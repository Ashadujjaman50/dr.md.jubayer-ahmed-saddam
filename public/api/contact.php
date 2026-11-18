<?php
/**
 * Contact Inquiry Submission API Endpoint
 * 
 * Receives inquiry messages from the website, formats an HTML email,
 * dispatches it to the doctor's personal email and admin email via Hostinger SMTP,
 * and sends an automatic acknowledgment email to the patient/visitor if they provided an email address.
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
$name        = htmlspecialchars(trim($data['name'] ?? ''), ENT_QUOTES, 'UTF-8');
$phone       = htmlspecialchars(trim($data['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$email       = trim($data['email'] ?? '');
$subject     = htmlspecialchars(trim($data['subject'] ?? 'Consultation Inquiry'), ENT_QUOTES, 'UTF-8');
$messageText = nl2br(htmlspecialchars(trim($data['message'] ?? ''), ENT_QUOTES, 'UTF-8'));
$submittedAt = date('d M Y, h:i A (T)');

// Validation
$errors = [];
if (empty($name)) {
    $errors[] = 'Your name is required.';
}
if (empty($phone)) {
    $errors[] = 'Contact phone number is required.';
}
if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address.';
}
if (empty($messageText) || strlen(trim($data['message'] ?? '')) < 5) {
    $errors[] = 'Please provide a brief message (at least 5 characters).';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors, 'message' => $errors[0]]);
    exit;
}

// Check if credentials are still placeholder
if (SUPPORT_PASSWORD === 'YOUR_SUPPORT_PASSWORD_HERE' || empty(SUPPORT_PASSWORD)) {
    echo json_encode([
        'success' => true,
        'simulated' => true,
        'message' => 'Inquiry prepared. Please configure your Hostinger support email password in public/api/config.php.'
    ]);
    exit;
}

$mailer = new HostingerMailer(SMTP_HOST, SMTP_PORT, SUPPORT_EMAIL, SUPPORT_PASSWORD);

// 1. Email to Doctor & Admin
$doctorSubject = "New Website Inquiry: [{$subject}] from {$name}";
$displayEmail = !empty($email) ? htmlspecialchars($email, ENT_QUOTES, 'UTF-8') : 'Not provided';

$doctorHtml = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Website Inquiry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B; }
    .card { max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05); }
    .header { background: #0F766E; padding: 24px 28px; color: #FFFFFF; }
    .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 0; font-size: 14px; opacity: 0.92; }
    .content { padding: 28px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { text-align: left; padding: 10px 14px; font-size: 13px; color: #64748B; text-transform: uppercase; letter-spacing: 0.04em; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; width: 35%; }
    td { padding: 12px 14px; font-size: 14px; color: #0F172A; border-bottom: 1px solid #F1F5F9; }
    .highlight { font-weight: 700; color: #0F766E; }
    .message-box { background: #F8FAFC; border-left: 4px solid #0F766E; padding: 16px 20px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px; }
    .footer { background: #F1F5F9; padding: 16px 28px; font-size: 12px; color: #64748B; text-align: center; border-top: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>General Consultation & Chamber Inquiry</h2>
      <p>Submitted via Dr. Md. Jubayear Ahmed Saddam Official Website</p>
    </div>
    <div class="content">
      <table>
        <tr>
          <th>Sender Name</th>
          <td class="highlight">{$name}</td>
        </tr>
        <tr>
          <th>Contact Phone</th>
          <td><strong>{$phone}</strong> (<a href="tel:{$phone}" style="color: #0F766E;">Call</a>)</td>
        </tr>
        <tr>
          <th>Email Address</th>
          <td>{$displayEmail}</td>
        </tr>
        <tr>
          <th>Subject</th>
          <td>{$subject}</td>
        </tr>
        <tr>
          <th>Submitted At</th>
          <td>{$submittedAt}</td>
        </tr>
      </table>

      <strong style="font-size: 13px; color: #475569; display: block; margin-bottom: 6px; text-transform: uppercase;">Message / Inquiry:</strong>
      <div class="message-box">
        {$messageText}
      </div>
    </div>
    <div class="footer">
      Dispatched from <strong>support@drjubayearsaddam.com</strong> to Dr. Saddam and chamber management.
    </div>
  </div>
</body>
</html>
HTML;

$adminRecipients = [DOCTOR_EMAIL, ADMIN_EMAIL];
$replyTo = !empty($email) ? $email : '';
$adminResult = $mailer->send($adminRecipients, $doctorSubject, $doctorHtml, SUPPORT_FROM_NAME, $replyTo);

if (!$adminResult['success']) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Could not dispatch inquiry email: ' . $adminResult['message']
    ]);
    exit;
}

// 2. Auto-reply Confirmation Email to Patient / Visitor (if user provided email)
$autoReplySent = false;
if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $userSubject = "Thank you for contacting Dr. Md. Jubayear Ahmed Saddam";
    $safeUserName = $name;

    $userHtml = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Inquiry Received</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B; }
    .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05); }
    .header { background: #0D9488; padding: 24px 28px; color: #FFFFFF; text-align: center; }
    .header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 0; font-size: 13px; opacity: 0.92; }
    .content { padding: 28px; line-height: 1.6; font-size: 14px; }
    .notice { background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 8px; padding: 14px 18px; margin: 20px 0; color: #065F46; }
    .contacts-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px 20px; margin-top: 20px; }
    .contacts-box h4 { margin: 0 0 10px 0; color: #0F172A; font-size: 14px; }
    .contacts-box p { margin: 4px 0; font-size: 13px; color: #475569; }
    .footer { background: #F1F5F9; padding: 16px 28px; font-size: 12px; color: #64748B; text-align: center; border-top: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>Dr. Md. Jubayear Ahmed Saddam</h2>
      <p>Assistant Professor (Surgery), Ad-Din Medical College Hospital | MBBS, FCPS</p>
    </div>
    <div class="content">
      <p>Dear <strong>{$safeUserName}</strong>,</p>
      <p>Thank you for reaching out through the official consultation portal. We have received your inquiry regarding <strong>"{$subject}"</strong>.</p>
      
      <div class="notice">
        <strong>Status:</strong> Your message has been forwarded to Dr. Saddam's consultation desk. Our team will review your inquiry and get in touch with you shortly.
      </div>

      <div class="contacts-box">
        <h4>Need Urgent Clinical Assistance or Immediate Serial?</h4>
        <p><strong>Dhaka Chamber:</strong> Health and Hope Hospital — <a href="tel:01841822442" style="color: #0D9488; font-weight: 600;">01841-822442</a></p>
        <p><strong>Ashuganj Chamber:</strong> New Green Life Hospital — <a href="tel:01771358595" style="color: #0D9488; font-weight: 600;">01771-358595</a>, <a href="tel:01308229576" style="color: #0D9488; font-weight: 600;">01308-229576</a></p>
        <p><strong>Brahmanbaria Chamber:</strong> Labaid Diagnostic — <a href="tel:01766662233" style="color: #0D9488; font-weight: 600;">01766-662233</a></p>
        <p><strong>WhatsApp Support:</strong> <a href="https://wa.me/8801677566535" style="color: #059669; font-weight: 600;">01677-566535</a></p>
      </div>

      <p style="margin-top: 24px;">Warm regards,<br>
      <strong>Dr. Saddam Surgical Consultation Team</strong><br>
      <a href="https://drjubayearsaddam.com" style="color: #0D9488;">www.drjubayearsaddam.com</a></p>
    </div>
    <div class="footer">
      This is an automated acknowledgment sent to {$email}. Please do not reply directly to this automated email.
    </div>
  </div>
</body>
</html>
HTML;

    $userResult = $mailer->send([$email], $userSubject, $userHtml, 'Dr. Md. Jubayear Ahmed Saddam Support');
    if ($userResult['success']) {
        $autoReplySent = true;
    }
}

// 3. Dispatch SMS Notifications (Doctor alert; Admin alert if enabled)
$smsResult = SmsService::notifyContact($phone, $name, $subject, $messageText);

echo json_encode([
    'success' => true,
    'message' => $autoReplySent 
        ? 'Your message has been sent successfully. A confirmation email has been sent to your inbox.' 
        : 'Your message has been sent to Dr. Saddam\'s support team.',
    'autoReplySent' => $autoReplySent,
    'sms' => $smsResult
]);
