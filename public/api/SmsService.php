<?php
/**
 * Shakherhat SMS Gateway Integration
 * 
 * Provides automated SMS notification dispatch for Dr. Saddam portfolio:
 * 1. Confirmation SMS to patient/visitor upon submission.
 * 2. Instant alert SMS to Doctor, Admin, and the specific Chamber's mobile desk.
 */

require_once __DIR__ . '/config.php';

class SmsService {
    private static $apiKey = defined('SMS_API_KEY') ? SMS_API_KEY : '';
    private static $baseUrl = defined('SMS_BASE_URL') ? SMS_BASE_URL : 'https://api.shakherhat.com';

    /**
     * Normalize Bangladeshi mobile number to 8801XXXXXXXXX format
     */
    public static function formatNumber($phone) {
        if (empty($phone)) return '';

        // Bengali to English digits
        $bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        $en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        $clean = str_replace($bn, $en, (string)$phone);

        // Remove non-digit characters
        $digits = preg_replace('/\D/', '', $clean);

        if (strlen($digits) === 13 && strpos($digits, '8801') === 0) {
            return $digits;
        }
        if (strlen($digits) === 11 && strpos($digits, '01') === 0) {
            return '88' . $digits;
        }
        if (strlen($digits) === 10 && strpos($digits, '1') === 0) {
            return '880' . $digits;
        }

        return $digits;
    }

    /**
     * Determine chamber mobile phone based on chamberId or location string
     * Ashuganj chamber: ONLY 01771-358595 per user instruction
     */
    public static function getChamberPhone($chamberId = '', $chamberLocation = '') {
        $key = strtolower(trim($chamberId . ' ' . $chamberLocation));
        if (strpos($key, 'ashuganj') !== false) {
            return '8801771358595'; // Ashuganj chamber serial mobile
        }
        if (strpos($key, 'brahmanbaria') !== false) {
            return '8801766662233'; // Brahmanbaria chamber serial mobile
        }
        if (strpos($key, 'dhaka') !== false) {
            return '8801841822442'; // Dhaka chamber serial mobile
        }
        return '8801841822442';
    }

    /**
     * Get concise chamber name for SMS
     */
    public static function getShortChamberName($chamberId = '', $chamberLocation = '') {
        $key = strtolower(trim($chamberId . ' ' . $chamberLocation));
        if (strpos($key, 'ashuganj') !== false) return 'Ashuganj';
        if (strpos($key, 'brahmanbaria') !== false) return 'Brahmanbaria';
        if (strpos($key, 'dhaka') !== false) return 'Dhaka';
        return 'Chamber';
    }

    /**
     * Dispatch an individual SMS via Shakherhat API
     */
    public static function send($mobileNumber, $message) {
        $formattedNumber = self::formatNumber($mobileNumber);
        if (strlen($formattedNumber) < 11) {
            return ['success' => false, 'message' => 'Invalid mobile number: ' . $mobileNumber];
        }

        $url = rtrim(self::$baseUrl, '/') . '/sms/sendSms';
        $payload = json_encode([
            'MobileNumber' => $formattedNumber,
            'Message' => $message
        ]);

        $headers = [
            'X-API-KEY: ' . self::$apiKey,
            'Content-Type: application/json',
            'Content-Length: ' . strlen($payload)
        ];

        // Prefer cURL if available
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 12);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $err = curl_error($ch);
            curl_close($ch);

            if ($err) {
                return ['success' => false, 'message' => $err];
            }

            $data = json_decode($response, true);
            return ['success' => ($httpCode >= 200 && $httpCode < 300), 'data' => $data];
        }

        // Fallback to stream context
        $options = [
            'http' => [
                'header'  => implode("\r\n", $headers),
                'method'  => 'POST',
                'content' => $payload,
                'timeout' => 12
            ]
        ];
        $context  = stream_context_create($options);
        $result = @file_get_contents($url, false, $context);
        if ($result === false) {
            return ['success' => false, 'message' => 'Network error connecting to SMS Gateway.'];
        }

        $data = json_decode($result, true);
        return ['success' => true, 'data' => $data];
    }

    /**
     * Handle Appointment Booking SMS notifications:
     * 1. Patient gets concise confirmation SMS (single segment <= 160 chars).
     * 2. Doctor and Chamber/Hospital mobile receive concise alert SMS.
     * 3. Admin receives SMS only when ENABLE_ADMIN_SMS is enabled.
     */
    public static function notifyAppointment($patientPhone, $patientName, $date, $chamberLocation, $service, $chamberId = '') {
        $results = [];
        $shortChamber = self::getShortChamberName($chamberId, $chamberLocation);
        $chamberPhone = self::getChamberPhone($chamberId, $chamberLocation);

        // 1. Patient Confirmation SMS (Short & Professional <= 160 chars)
        $cleanPatientName = mb_substr(strip_tags($patientName), 0, 25, 'UTF-8');
        $patientMsg = "Dear {$cleanPatientName}, your appointment for {$date} at {$shortChamber} is received. Dr. Saddam's serial desk will call you shortly. Helpline: 01841822442";
        $results['patient'] = self::send($patientPhone, $patientMsg);

        // 2. Alert SMS (Doctor & Selected Chamber / Hospital Mobile)
        $cleanService = mb_substr(strip_tags($service), 0, 20, 'UTF-8');
        $alertMsg = "New Appt! Patient: {$cleanPatientName}, Ph: {$patientPhone}, Date: {$date}, Chamber: {$shortChamber}, Specialty: {$cleanService}. Dr. Saddam Desk.";

        $recipients = [];
        $doctorPhone = defined('DOCTOR_SMS_PHONE') ? DOCTOR_SMS_PHONE : '8801677566535';
        if (!empty($doctorPhone)) {
            $recipients[] = $doctorPhone;
        }
        if (!empty($chamberPhone)) {
            $recipients[] = $chamberPhone;
        }

        // Admin SMS (Temporarily off; enabled if ENABLE_ADMIN_SMS is active)
        if (defined('ENABLE_ADMIN_SMS') && (ENABLE_ADMIN_SMS === true || ENABLE_ADMIN_SMS === 'true') && defined('ADMIN_SMS_PHONE') && !empty(ADMIN_SMS_PHONE)) {
            $recipients[] = ADMIN_SMS_PHONE;
        }

        $allRecipients = array_unique($recipients);
        foreach ($allRecipients as $recipient) {
            $results['alerts'][$recipient] = self::send($recipient, $alertMsg);
        }

        return $results;
    }

    /**
     * Handle Contact Inquiry SMS notifications:
     * 1. Doctor receives alert SMS (Short <= 160 chars).
     * 2. Admin receives SMS only when ENABLE_ADMIN_SMS is enabled.
     * (Visitor does not receive SMS for contact inquiry).
     */
    public static function notifyContact($visitorPhone, $visitorName, $subject, $messageSnippet) {
        $results = [];

        // Doctor Alert SMS (Short <= 160 chars)
        $cleanVisitorName = mb_substr(strip_tags($visitorName), 0, 25, 'UTF-8');
        $shortSubject = mb_substr(strip_tags($subject), 0, 30, 'UTF-8');
        $shortMsg = mb_substr(preg_replace('/[\r\n\s]+/', ' ', strip_tags($messageSnippet)), 0, 35, 'UTF-8');
        $doctorMsg = "New Inquiry from {$cleanVisitorName}, Ph: {$visitorPhone}, Sub: {$shortSubject}. Msg: {$shortMsg}. Dr. Saddam Portal.";

        $recipients = [];
        $doctorPhone = defined('DOCTOR_SMS_PHONE') ? DOCTOR_SMS_PHONE : '8801677566535';
        if (!empty($doctorPhone)) {
            $recipients[] = $doctorPhone;
        }

        // Admin SMS (Temporarily off; enabled if ENABLE_ADMIN_SMS is active)
        if (defined('ENABLE_ADMIN_SMS') && (ENABLE_ADMIN_SMS === true || ENABLE_ADMIN_SMS === 'true') && defined('ADMIN_SMS_PHONE') && !empty(ADMIN_SMS_PHONE)) {
            $recipients[] = ADMIN_SMS_PHONE;
        }

        $allRecipients = array_unique($recipients);
        foreach ($allRecipients as $recipient) {
            $results['alerts'][$recipient] = self::send($recipient, $doctorMsg);
        }

        return $results;
    }
}
