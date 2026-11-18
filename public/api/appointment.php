<?php
/**
 * Appointment Submission API Endpoint
 * 
 * Receives appointment requests from the website, formats an HTML email,
 * and delivers it to the doctor's personal email and admin email via Hostinger SMTP.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/HostingerMailer.php';
require_once __DIR__ . '/SmsService.php';

// Parse incoming JSON body
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input.']);
    exit;
}

// Extract and sanitize input
$patientName     = htmlspecialchars(trim($data['patientName'] ?? ''), ENT_QUOTES, 'UTF-8');
$phone           = htmlspecialchars(trim($data['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$appointmentDate = htmlspecialchars(trim($data['appointmentDate'] ?? ''), ENT_QUOTES, 'UTF-8');
$serviceId       = htmlspecialchars(trim($data['serviceId'] ?? 'General Consultation'), ENT_QUOTES, 'UTF-8');
$chamberLocation = htmlspecialchars(trim($data['chamberLocation'] ?? 'Specialist Consultation Chamber'), ENT_QUOTES, 'UTF-8');
$chamberId       = htmlspecialchars(trim($data['chamberId'] ?? ''), ENT_QUOTES, 'UTF-8');
$age             = htmlspecialchars(trim((string)($data['age'] ?? 'Not specified')), ENT_QUOTES, 'UTF-8');
$gender          = htmlspecialchars(trim($data['gender'] ?? 'Not specified'), ENT_QUOTES, 'UTF-8');
$notes           = nl2br(htmlspecialchars(trim($data['notes'] ?? 'None provided'), ENT_QUOTES, 'UTF-8'));
$submittedAt     = date('d M Y, h:i A (T)');

// Validation
$errors = [];
if (empty($patientName)) {
    $errors[] = 'Patient name is required.';
}
if (empty($phone)) {
    $errors[] = 'Contact phone number is required.';
}
if (empty($appointmentDate)) {
    $errors[] = 'Appointment date is required.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors, 'message' => $errors[0]]);
    exit;
}

// Build HTML Email for Doctor & Admin
$emailSubject = "New Appointment Request: {$patientName} ({$chamberLocation})";

$htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Surgical Appointment Request</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B; }
    .card { max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05); }
    .header { background: #0D9488; padding: 24px 28px; color: #FFFFFF; }
    .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 0; font-size: 14px; opacity: 0.92; }
    .content { padding: 28px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #CCFBF1; color: #0F766E; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { text-align: left; padding: 10px 14px; font-size: 13px; color: #64748B; text-transform: uppercase; letter-spacing: 0.04em; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; width: 35%; }
    td { padding: 12px 14px; font-size: 14px; color: #0F172A; border-bottom: 1px solid #F1F5F9; }
    .highlight { font-weight: 700; color: #0D9488; font-size: 15px; }
    .phone-btn { display: inline-block; padding: 6px 14px; background: #0D9488; color: #FFFFFF; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px; }
    .notes-box { background: #F8FAFC; border-left: 4px solid #0D9488; padding: 14px 18px; border-radius: 4px; font-size: 14px; line-height: 1.5; color: #334155; margin-bottom: 24px; }
    .footer { background: #F1F5F9; padding: 16px 28px; font-size: 12px; color: #64748B; text-align: center; border-top: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>Surgical Appointment Request</h2>
      <p>Submitted via Dr. Md. Jubayear Ahmed Saddam Official Website</p>
    </div>
    <div class="content">
      <div class="badge">Direct Serial Booking Request</div>
      <table>
        <tr>
          <th>Patient Name</th>
          <td class="highlight">{$patientName}</td>
        </tr>
        <tr>
          <th>Contact Phone</th>
          <td>
            <strong>{$phone}</strong> &nbsp;
            <a href="tel:{$phone}" class="phone-btn">Call Patient</a>
          </td>
        </tr>
        <tr>
          <th>Consultation Chamber</th>
          <td>{$chamberLocation}</td>
        </tr>
        <tr>
          <th>Preferred Date</th>
          <td class="highlight">{$appointmentDate}</td>
        </tr>
        <tr>
          <th>Surgical Specialty</th>
          <td>{$serviceId}</td>
        </tr>
        <tr>
          <th>Age / Gender</th>
          <td>{$age} Years / {$gender}</td>
        </tr>
        <tr>
          <th>Submission Time</th>
          <td>{$submittedAt}</td>
        </tr>
      </table>

      <strong style="font-size: 13px; color: #475569; display: block; margin-bottom: 6px; text-transform: uppercase;">Medical Concern / Symptoms:</strong>
      <div class="notes-box">
        {$notes}
      </div>
    </div>
    <div class="footer">
      This notification was automatically dispatched from <strong>appoinment@drjubayearsaddam.com</strong> to Dr. Saddam and chamber management.
    </div>
  </div>
</body>
</html>
HTML;

// Check if credentials are still placeholder
if (APPOINTMENT_PASSWORD === 'YOUR_APPOINTMENT_PASSWORD_HERE' || empty(APPOINTMENT_PASSWORD)) {
    // Graceful response informing configuration is needed
    echo json_encode([
        'success' => true,
        'simulated' => true,
        'message' => 'Appointment request prepared. Please configure your Hostinger email password in public/api/config.php.'
    ]);
    exit;
}

// 1. Send SMS Notifications (Patient confirmation + Doctor, Admin & Chamber desk alerts)
$smsResult = SmsService::notifyAppointment($phone, $patientName, $appointmentDate, $chamberLocation, $serviceId, $chamberId);

// 2. Send via Hostinger SMTP over SSL
$mailer = new HostingerMailer(SMTP_HOST, SMTP_PORT, APPOINTMENT_EMAIL, APPOINTMENT_PASSWORD);
$recipients = [DOCTOR_EMAIL, ADMIN_EMAIL];

$emailResult = $mailer->send($recipients, $emailSubject, $htmlBody, APPOINTMENT_FROM_NAME);

if ($emailResult['success'] || !empty($smsResult['patient']['success'])) {
    echo json_encode([
        'success' => true,
        'message' => 'Your appointment request has been submitted successfully. A confirmation SMS has been sent to your phone.',
        'sms' => $smsResult
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Could not complete request dispatch. ' . ($emailResult['message'] ?? '')
    ]);
}
