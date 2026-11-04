/**
 * Appointment Submission Service
 * 
 * Modular service prepared for future email integration (e.g. EmailJS, Resend, or Serverless Function).
 * Note: No private API keys or SMTP secrets should ever be placed in client-side code.
 */

// Normalize Bengali digits (০-৯) to standard Arabic digits (0-9)
export const normalizeBengaliDigits = (str) => {
  if (!str) return '';
  const bnToEn = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
  return String(str).replace(/[০-৯]/g, (d) => bnToEn[d] || d);
};

// Sanitize string to prevent basic injection / malformed input
export const sanitizeInput = (str, maxLength = 250) => {
  if (!str) return '';
  return String(str)
    .replace(/[<>]/g, '') // remove HTML tag brackets
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove ASCII control characters
    .replace(/[\u202A-\u202E\u2066-\u2069]/g, '') // remove Unicode bidirectional overrides
    .trim()
    .slice(0, maxLength);
};

// Sanitize single-line text and strip CRLF to prevent header/newline injection
export const sanitizeSingleLine = (str, maxLength = 150) => {
  if (!str) return '';
  return sanitizeInput(str, maxLength).replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim();
};

export const submitAppointmentRequest = async (formData) => {
  const errors = [];

  const rawName = sanitizeSingleLine(formData.patientName, 100);
  const rawPhone = normalizeBengaliDigits(formData.phone || '').trim();
  const rawAge = formData.age ? parseInt(normalizeBengaliDigits(String(formData.age)), 10) : null;
  const rawNotes = sanitizeInput(formData.notes, 1000);

  if (!rawName) {
    errors.push('Patient name is required.');
  }

  const digitsOnly = rawPhone.replace(/\D/g, '');
  if (!rawPhone) {
    errors.push('Contact phone number is required.');
  } else if (!/^[0-9+-\s()]{8,18}$/.test(rawPhone) || digitsOnly.length < 7 || digitsOnly.length > 15) {
    errors.push('Please enter a valid phone number (e.g., 01771-358595).');
  }

  if (!formData.appointmentDate) {
    errors.push('Please select a preferred appointment date.');
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(String(formData.appointmentDate).trim())) {
    errors.push('Please provide a valid date format.');
  }

  if (!formData.serviceId) {
    errors.push('Please select a surgical specialty or reason for consultation.');
  }

  if (rawAge !== null && (isNaN(rawAge) || rawAge < 1 || rawAge > 120)) {
    errors.push('Please enter a valid age between 1 and 120.');
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      message: errors[0]
    };
  }

  // Simulate network dispatch delay for professional UX feedback
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Prepared data payload ready for future email provider integration
  const preparedPayload = {
    patientName: rawName,
    phone: rawPhone,
    appointmentDate: sanitizeSingleLine(formData.appointmentDate, 20),
    serviceId: sanitizeSingleLine(formData.serviceId, 50),
    age: rawAge,
    gender: sanitizeSingleLine(formData.gender || 'Male', 20),
    notes: rawNotes,
    preparedAt: new Date().toISOString(),
    chamberLocation: sanitizeSingleLine(formData.chamberLocation || 'Specialist Consultation Chamber', 100)
  };

  return {
    success: true,
    data: preparedPayload,
    message: "Your request has been prepared. Email submission will be available soon."
  };
};
