import nodemailer from 'nodemailer';
import { sendSmsNotification } from './utils/sms.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=UTF-8'
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    if (!data.name || !data.phone) {
      return {
        statusCode: 422,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Please provide your name and contact phone number.'
        })
      };
    }

    const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const doctorEmail = process.env.DOCTOR_EMAIL || 'jubayearsaddam@gmail.com';
    const adminEmail = process.env.ADMIN_EMAIL || 'ashadujjaman.cse@gmail.com';
    const fromEmail = process.env.SUPPORT_EMAIL || 'support@drjubayearsaddam.com';
    const fromPass = process.env.SUPPORT_EMAIL_PASSWORD || process.env.SUPPORT_PASSWORD;

    const doctorSmsPhone = process.env.DOCTOR_SMS_PHONE || '8801677566535';
    const enableAdminSms = process.env.ENABLE_ADMIN_SMS === 'true';
    const adminSmsPhone = process.env.ADMIN_SMS_PHONE || '8801835612169';

    const cleanVisitorName = (data.name || '').slice(0, 25);
    const shortSubject = (data.subject || 'Inquiry').slice(0, 30);
    const shortMsg = (data.message || '').replace(/[\r\n\s]+/g, ' ').slice(0, 35);

    // 1. Dispatch SMS Notifications (Doctor Alert ONLY; Visitor does not receive SMS)
    const alertMsg = `New Inquiry from ${cleanVisitorName}, Ph: ${data.phone}, Sub: ${shortSubject}. Msg: ${shortMsg}. Dr. Saddam Portal.`;
    const contactRecipients = [doctorSmsPhone];
    if (enableAdminSms && adminSmsPhone) contactRecipients.push(adminSmsPhone);

    const uniqueRecipients = Array.from(new Set(contactRecipients));
    for (const rec of uniqueRecipients) {
      sendSmsNotification(rec, alertMsg).catch(console.error);
    }

    // 2. Dispatch Hostinger SMTP Email
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

        // Auto-reply to visitor if email was provided
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
      } catch (mailErr) {
        console.error('[Netlify Function Contact Mail Error]:', mailErr.message);
      }
    } else {
      console.warn('[Netlify Function] SUPPORT_EMAIL_PASSWORD not set in environment.');
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        autoReplySent,
        message: autoReplySent
          ? 'Your message has been sent successfully. A confirmation email has been sent to your inbox.'
          : "Your message has been sent to Dr. Saddam's support team."
      })
    };
  } catch (err) {
    console.error('[Netlify Function Contact Exception]:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error processing contact inquiry.'
      })
    };
  }
};
