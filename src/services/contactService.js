/**
 * General Contact Message Service
 * 
 * Modular service prepared for future email integration (e.g. EmailJS, Resend, or Serverless Function).
 * Note: No private API keys or SMTP secrets should ever be placed in client-side code.
 */

export const submitContactMessage = async (formData) => {
  const errors = [];
  if (!formData.name || !formData.name.trim()) {
    errors.push('Your name is required.');
  }
  if (!formData.phone || !formData.phone.trim()) {
    errors.push('A contact phone number is required.');
  } else if (!/^[0-9+-\s]{8,15}$/.test(formData.phone.trim())) {
    errors.push('Please enter a valid contact phone number.');
  }
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.push('Please provide a valid email address.');
  }
  if (!formData.message || !formData.message.trim() || formData.message.trim().length < 5) {
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
  await new Promise((resolve) => setTimeout(resolve, 800));

  const preparedPayload = {
    name: formData.name.trim(),
    phone: formData.phone.trim(),
    email: (formData.email || '').trim(),
    subject: (formData.subject || 'Consultation Inquiry').trim(),
    message: formData.message.trim(),
    preparedAt: new Date().toISOString()
  };

  /**
   * FUTURE EMAIL INTEGRATION HOOK:
   * When integrating with an email service:
   * Option A (Serverless/API):
   *   const res = await fetch('/api/send-contact-email', { method: 'POST', body: JSON.stringify(preparedPayload) });
   * Option B (EmailJS with safe public key):
   *   await emailjs.send(SERVICE_ID, TEMPLATE_ID, preparedPayload, PUBLIC_KEY);
   */

  return {
    success: true,
    data: preparedPayload,
    message: "Your request has been prepared. Email submission will be available soon."
  };
};
