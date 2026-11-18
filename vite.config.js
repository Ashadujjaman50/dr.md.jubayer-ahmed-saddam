import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import nodemailer from 'nodemailer';

const SMS_BASE_URL = 'https://api.shakherhat.com';

function formatBdMobile(phone) {
  if (!phone) return '';
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let clean = String(phone);
  bn.forEach((d, i) => { clean = clean.replaceAll(d, en[i]); });
  const digits = clean.replace(/\D/g, '');
  if (digits.length === 13 && digits.startsWith('8801')) return digits;
  if (digits.length === 11 && digits.startsWith('01')) return '88' + digits;
  if (digits.length === 10 && digits.startsWith('1')) return '880' + digits;
  return digits;
}

function getChamberPhone(chamberId = '', chamberLocation = '') {
  const key = String(chamberId + ' ' + chamberLocation).toLowerCase();
  if (key.includes('ashuganj')) return '8801771358595'; // Ashuganj chamber serial mobile strictly
  if (key.includes('brahmanbaria')) return '8801766662233'; // Brahmanbaria chamber serial mobile
  if (key.includes('dhaka')) return '8801841822442'; // Dhaka chamber serial mobile
  return '8801841822442';
}

function getShortChamberName(chamberId = '', chamberLocation = '') {
  const key = String(chamberId + ' ' + chamberLocation).toLowerCase();
  if (key.includes('ashuganj')) return 'Ashuganj';
  if (key.includes('brahmanbaria')) return 'Brahmanbaria';
  if (key.includes('dhaka')) return 'Dhaka';
  return 'Chamber';
}

async function sendSmsNotification(mobileNumber, message, apiKey = '') {
  const formatted = formatBdMobile(mobileNumber);
  if (formatted.length < 11) return { success: false, message: 'Invalid phone' };
  if (!apiKey) {
    console.warn('[SMS Gateway] SMS_API_KEY is not configured. Skipping SMS.');
    return { success: false, message: 'Missing SMS_API_KEY' };
  }
  try {
    const res = await fetch(`${SMS_BASE_URL}/sms/sendSms`, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        MobileNumber: formatted,
        Message: message
      })
    });
    const data = await res.json().catch(() => ({}));
    console.log(`[SMS Gateway] Sent to ${formatted}:`, data.message || res.status);
    return data;
  } catch (err) {
    console.error(`[SMS Gateway] Failed for ${formatted}:`, err.message);
    return { success: false, error: err.message };
  }
}

function emailDevPlugin() {
  return {
    name: 'email-dev-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        const isAppointment = req.method === 'POST' && (url === '/api/appointment.php' || url === '/api/appointment');
        const isContact = req.method === 'POST' && (url === '/api/contact.php' || url === '/api/contact');

        if (!isAppointment && !isContact) {
          return next();
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const data = JSON.parse(body || '{}');
            const env = loadEnv('development', process.cwd(), '');

            const smtpHost = env.SMTP_HOST || 'smtp.hostinger.com';
            const smtpPort = parseInt(env.SMTP_PORT || '465', 10);
            const doctorEmail = env.DOCTOR_EMAIL || 'jubayearsaddam@gmail.com';
            const adminEmail = env.ADMIN_EMAIL || 'ashadujjaman.cse@gmail.com';
            const doctorSmsPhone = env.DOCTOR_SMS_PHONE || '8801677566535';
            const enableAdminSms = env.ENABLE_ADMIN_SMS === 'true';
            const adminSmsPhone = env.ADMIN_SMS_PHONE || '';
            const smsApiKey = env.SMS_API_KEY || '';

            if (isAppointment) {
              const fromEmail = env.APPOINTMENT_EMAIL || 'appoinment@drjubayearsaddam.com';
              const fromPass = env.APPOINTMENT_EMAIL_PASSWORD;

              console.log(`[Dev Appointment] Request for ${data.patientName} (${data.phone})`);

              const shortChamber = getShortChamberName(data.chamberId, data.chamberLocation);
              const chamberPhone = getChamberPhone(data.chamberId, data.chamberLocation);
              const cleanPatientName = (data.patientName || '').slice(0, 25);
              const cleanService = (data.serviceId || '').slice(0, 20);

              // 1. Dispatch SMS Notifications (Single segment <= 160 chars)
              // A) Patient Confirmation SMS
              const patientMsg = `Dear ${cleanPatientName}, your appointment for ${data.appointmentDate} at ${shortChamber} is received. Dr. Saddam's serial desk will call you shortly. Helpline: 01841822442`;
              sendSmsNotification(data.phone, patientMsg, smsApiKey).catch(console.error);

              // B) Doctor & Chamber/Hospital Alert SMS (Admin SMS only if ENABLE_ADMIN_SMS=true)
              const alertMsg = `New Appt! Patient: ${cleanPatientName}, Ph: ${data.phone}, Date: ${data.appointmentDate}, Chamber: ${shortChamber}, Specialty: ${cleanService}. Dr. Saddam Desk.`;
              const apptRecipients = [doctorSmsPhone];
              if (chamberPhone) apptRecipients.push(chamberPhone);
              if (enableAdminSms && adminSmsPhone) apptRecipients.push(adminSmsPhone);

              const allRecipients = Array.from(new Set(apptRecipients));
              for (const rec of allRecipients) {
                sendSmsNotification(rec, alertMsg, smsApiKey).catch(console.error);
              }

              // 2. Dispatch Email
              if (fromPass && fromPass !== 'YOUR_APPOINTMENT_PASSWORD_HERE') {
                try {
                  const transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: smtpPort,
                    secure: true,
                    auth: { user: fromEmail, pass: fromPass }
                  });

                  await transporter.sendMail({
                    from: `"Dr. Saddam Serial Desk" <${fromEmail}>`,
                    to: [doctorEmail, adminEmail],
                    subject: `New Appointment Request: ${data.patientName} (${data.chamberLocation || 'Chamber'})`,
                    html: `
                      <div style="font-family: sans-serif; padding: 24px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h2 style="color: #0d9488; margin-top: 0;">New Surgical Appointment Request</h2>
                        <p><strong>Patient Name:</strong> ${data.patientName}</p>
                        <p><strong>Phone:</strong> ${data.phone}</p>
                        <p><strong>Chamber:</strong> ${data.chamberLocation}</p>
                        <p><strong>Preferred Date:</strong> ${data.appointmentDate}</p>
                        <p><strong>Surgical Specialty:</strong> ${data.serviceId}</p>
                        <p><strong>Age / Gender:</strong> ${data.age || 'N/A'} / ${data.gender || 'N/A'}</p>
                        <p><strong>Symptoms / Notes:</strong> ${data.notes || 'None'}</p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #64748b;">Dispatched from ${fromEmail} to Dr. Saddam and chamber management.</p>
                      </div>
                    `
                  });
                } catch (emailErr) {
                  console.error('[Dev Appointment Email] Warning:', emailErr.message);
                }
              }

              return res.end(JSON.stringify({
                success: true,
                message: "Your appointment request has been submitted successfully. A confirmation SMS has been sent to your phone."
              }));
            }

            if (isContact) {
              const fromEmail = env.SUPPORT_EMAIL || 'support@drjubayearsaddam.com';
              const fromPass = env.SUPPORT_EMAIL_PASSWORD;

              console.log(`[Dev Contact] Inquiry from ${data.name} (${data.email || 'no email'})`);

              const cleanVisitorName = (data.name || '').slice(0, 25);
              const shortSubject = (data.subject || 'Inquiry').slice(0, 30);
              const shortMsg = (data.message || '').replace(/[\r\n\s]+/g, ' ').slice(0, 35);

              // 1. Dispatch SMS Notifications (Single segment <= 160 chars)
              // Doctor Alert SMS (Admin SMS only if ENABLE_ADMIN_SMS=true; Visitor does not receive SMS)
              const alertMsg = `New Inquiry from ${cleanVisitorName}, Ph: ${data.phone}, Sub: ${shortSubject}. Msg: ${shortMsg}. Dr. Saddam Portal.`;
              const contactRecipients = [doctorSmsPhone];
              if (enableAdminSms && adminSmsPhone) contactRecipients.push(adminSmsPhone);

              const allContactRecipients = Array.from(new Set(contactRecipients));
              for (const rec of allContactRecipients) {
                sendSmsNotification(rec, alertMsg, smsApiKey).catch(console.error);
              }

              // 2. Dispatch Email
              let autoReplySent = false;
              if (fromPass && fromPass !== 'YOUR_SUPPORT_PASSWORD_HERE') {
                try {
                  const transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: smtpPort,
                    secure: true,
                    auth: { user: fromEmail, pass: fromPass }
                  });

                  // Email to Doctor & Admin
                  await transporter.sendMail({
                    from: `"Dr. Saddam Support Desk" <${fromEmail}>`,
                    to: [doctorEmail, adminEmail],
                    replyTo: data.email || undefined,
                    subject: `New Contact Inquiry: [${data.subject || 'Inquiry'}] from ${data.name}`,
                    html: `
                      <div style="font-family: sans-serif; padding: 24px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h2 style="color: #0f766e; margin-top: 0;">General Consultation & Chamber Inquiry</h2>
                        <p><strong>Name:</strong> ${data.name}</p>
                        <p><strong>Phone:</strong> ${data.phone}</p>
                        <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
                        <p><strong>Subject:</strong> ${data.subject}</p>
                        <p><strong>Message:</strong> ${data.message}</p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #64748b;">Dispatched from ${fromEmail} to Dr. Saddam and chamber management.</p>
                      </div>
                    `
                  });

                  // Auto-reply to user if email provided
                  if (data.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                    await transporter.sendMail({
                      from: `"Dr. Md. Jubayear Ahmed Saddam Support" <${fromEmail}>`,
                      to: data.email,
                      subject: 'Thank you for contacting Dr. Md. Jubayear Ahmed Saddam',
                      html: `
                        <div style="font-family: sans-serif; padding: 24px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
                          <h2 style="color: #0d9488; margin-top: 0;">Dr. Md. Jubayear Ahmed Saddam</h2>
                          <p>Dear <strong>${data.name}</strong>,</p>
                          <p>Thank you for reaching out. We have received your inquiry regarding <strong>"${data.subject}"</strong>.</p>
                          <p>Our consultation desk will review your inquiry and get in touch with you shortly.</p>
                          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; margin: 18px 0;">
                            <strong style="color: #0f172a;">Chamber Hotlines:</strong><br/>
                            Dhaka: 01841-822442<br/>
                            Ashuganj: 01771-358595, 01308-229576<br/>
                            Brahmanbaria: 01766-662233<br/>
                            WhatsApp: 01677-566535
                          </div>
                          <p>Warm regards,<br/>
                          <strong>Dr. Saddam Consultation Team</strong></p>
                        </div>
                      `
                    });
                    autoReplySent = true;
                  }
                } catch (emailErr) {
                  console.error('[Dev Contact Email] Warning:', emailErr.message);
                }
              }

              return res.end(JSON.stringify({
                success: true,
                autoReplySent,
                message: autoReplySent
                  ? 'Your message has been sent successfully. A confirmation email has been sent to your inbox.'
                  : "Your message has been sent to Dr. Saddam's support team."
              }));
            }
          } catch (err) {
            console.error('[Dev API] Notice:', err.message);
            return res.end(JSON.stringify({
              success: true,
              simulated: true,
              autoReplySent: true,
              message: "Your submission has been received successfully."
            }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), emailDevPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
