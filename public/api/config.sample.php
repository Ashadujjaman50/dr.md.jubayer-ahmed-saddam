<?php
/**
 * Email & SMS Configuration Template for Hostinger
 * Copy this file to config.php and set your credentials.
 */

// Auto-load root .env if present
$envPath = __DIR__ . '/../../.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $val) = explode('=', $line, 2);
            $key = trim($key);
            $val = trim($val, " \t\n\r\0\x0B\"'");
            if (!defined($key)) {
                define($key, $val);
            }
        }
    }
}

if (!defined('SMTP_HOST')) define('SMTP_HOST', 'smtp.hostinger.com');
if (!defined('SMTP_PORT')) define('SMTP_PORT', 465);

if (!defined('APPOINTMENT_EMAIL')) define('APPOINTMENT_EMAIL', 'appoinment@drjubayearsaddam.com');
if (!defined('APPOINTMENT_PASSWORD')) define('APPOINTMENT_PASSWORD', 'YOUR_APPOINTMENT_PASSWORD_HERE');
if (!defined('APPOINTMENT_FROM_NAME')) define('APPOINTMENT_FROM_NAME', 'Dr. Saddam Serial Desk');

if (!defined('SUPPORT_EMAIL')) define('SUPPORT_EMAIL', 'support@drjubayearsaddam.com');
if (!defined('SUPPORT_PASSWORD')) define('SUPPORT_PASSWORD', 'YOUR_SUPPORT_PASSWORD_HERE');
if (!defined('SUPPORT_FROM_NAME')) define('SUPPORT_FROM_NAME', 'Dr. Saddam Support Desk');

if (!defined('DOCTOR_EMAIL')) define('DOCTOR_EMAIL', 'jubayearsaddam@gmail.com');
if (!defined('ADMIN_EMAIL')) define('ADMIN_EMAIL', 'ashadujjaman.cse@gmail.com');

// SMS Gateway Settings
if (!defined('SMS_API_KEY')) define('SMS_API_KEY', 'YOUR_SHAKHERHAT_API_KEY_HERE');
if (!defined('SMS_BASE_URL')) define('SMS_BASE_URL', 'https://api.shakherhat.com');
if (!defined('DOCTOR_SMS_PHONE')) define('DOCTOR_SMS_PHONE', '8801677566535');

// Admin SMS Setting (Temporarily OFF per request. Set to true or uncomment in .env to enable)
if (!defined('ENABLE_ADMIN_SMS')) define('ENABLE_ADMIN_SMS', false);
if (!defined('ADMIN_SMS_PHONE')) define('ADMIN_SMS_PHONE', '8801835612169');
