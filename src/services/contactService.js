/**
 * General Contact Message Service
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
export const sanitizeInput = (str, maxLength = 500) => {
  if (!str) return '';
  return String(str)
    .replace(/[<>]/g, '') // remove HTML tag brackets
    .trim()
    .slice(0, maxLength);
};

export const submitContactMessage = async (formData) => {
  const errors = [];

  const rawName = sanitizeInput(formData.name, 100);
  const rawPhone = normalizeBengaliDigits(formData.phone || '').trim();
  const rawEmail = sanitizeInput(formData.email, 100);
  const rawSubject = sanitizeInput(formData.subject || 'Consultation Inquiry', 150);
  const rawMessage = sanitizeInput(formData.message, 2000);

  if (!rawName) {
    errors.push('Your name is required.');
  }

  if (!rawPhone) {
    errors.push('A contact phone number is required.');
  } else if (!/^[0-9+-\s()]{8,18}$/.test(rawPhone)) {
    errors.push('Please enter a valid contact phone number (e.g., 01771-358595).');
  }

  if (rawEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
    errors.push('Please provide a valid email address.');
  }

  if (!rawMessage || rawMessage.length < 5) {
    errors.push('Please provide a brief message or question (at least 5 characters).');
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      message: errors[0]
    };
  }

  // Brief UX response delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const preparedPayload = {
    name: rawName,
    phone: rawPhone,
    email: rawEmail,
    subject: rawSubject,
    message: rawMessage,
    preparedAt: new Date().toISOString()
  };

  return {
    success: true,
    data: preparedPayload,
    message: "Your inquiry has been prepared. Email submission will be available soon."
  };
};
