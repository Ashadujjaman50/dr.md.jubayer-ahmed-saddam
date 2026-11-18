import nodemailer from 'nodemailer';
import { sendSmsNotification, getChamberPhone, getShortChamberName } from './utils/sms.js';

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

    if (!data.patientName || !data.phone || !data.appointmentDate) {
      return {
        statusCode: 422,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Please provide patient name, phone number, and preferred date.'
        })
      };
    }

    const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const doctorEmail = process.env.DOCTOR_EMAIL || 'jubayearsaddam@gmail.com';
    const adminEmail = process.env.ADMIN_EMAIL || 'ashadujjaman.cse@gmail.com';
    const fromEmail = process.env.APPOINTMENT_EMAIL || 'appoinment@drjubayearsaddam.com';
    const fromPass = process.env.APPOINTMENT_EMAIL_PASSWORD || process.env.APPOINTMENT_PASSWORD;

    const doctorSmsPhone = process.env.DOCTOR_SMS_PHONE || '8801677566535';
    const enableAdminSms = process.env.ENABLE_ADMIN_SMS === 'true';
    const adminSmsPhone = process.env.ADMIN_SMS_PHONE || '8801835612169';

    const shortChamber = getShortChamberName(data.chamberId, data.chamberLocation);
    const chamberPhone = getChamberPhone(data.chamberId, data.chamberLocation);
    const cleanPatientName = (data.patientName || '').slice(0, 25);
    const cleanService = (data.serviceId || 'General Consultation').slice(0, 20);

    // 1. Dispatch SMS Notifications
    // A) Patient Confirmation SMS (single segment <= 160 chars)
    const patientMsg = `Dear ${cleanPatientName}, your appointment for ${data.appointmentDate} at ${shortChamber} is received. Dr. Saddam's serial desk will call you shortly. Helpline: 01841822442`;
    sendSmsNotification(data.phone, patientMsg).catch(console.error);

    // B) Doctor & Chamber Alert SMS (Admin SMS only if ENABLE_ADMIN_SMS=true)
    const alertMsg = `New Appt! Patient: ${cleanPatientName}, Ph: ${data.phone}, Date: ${data.appointmentDate}, Chamber: ${shortChamber}, Specialty: ${cleanService}. Dr. Saddam Desk.`;
    const apptRecipients = [doctorSmsPhone];
    if (chamberPhone) apptRecipients.push(chamberPhone);
    if (enableAdminSms && adminSmsPhone) apptRecipients.push(adminSmsPhone);

    const uniqueRecipients = Array.from(new Set(apptRecipients));
    for (const rec of uniqueRecipients) {
      sendSmsNotification(rec, alertMsg).catch(console.error);
    }

    // 2. Dispatch Hostinger SMTP Email
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
              <p><strong>Chamber:</strong> ${data.chamberLocation || 'Not specified'}</p>
              <p><strong>Preferred Date:</strong> ${data.appointmentDate}</p>
              <p><strong>Surgical Specialty:</strong> ${data.serviceId || 'General'}</p>
              <p><strong>Age / Gender:</strong> ${data.age || 'N/A'} / ${data.gender || 'N/A'}</p>
              <p><strong>Symptoms / Notes:</strong> ${data.notes || 'None'}</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="font-size: 12px; color: #64748b;">Dispatched from ${fromEmail} to Dr. Saddam and chamber management.</p>
            </div>
          `
        });
      } catch (mailErr) {
        console.error('[Netlify Function Appointment Mail Error]:', mailErr.message);
      }
    } else {
      console.warn('[Netlify Function] APPOINTMENT_EMAIL_PASSWORD not set in environment.');
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Your appointment request has been submitted successfully. A confirmation SMS has been sent to your phone.'
      })
    };
  } catch (err) {
    console.error('[Netlify Function Appointment Exception]:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error processing appointment.'
      })
    };
  }
};
