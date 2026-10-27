/**
 * Appointment Submission Service
 * 
 * Modular service prepared for future email integration (e.g. EmailJS, Resend, or Serverless Function).
 * Note: No private API keys or SMTP secrets should ever be placed in client-side code.
 */

export const submitAppointmentRequest = async (formData) => {
  // Validate required fields
  const errors = [];
  if (!formData.patientName || !formData.patientName.trim()) {
    errors.push('Patient name is required.');
  }
  if (!formData.phone || !formData.phone.trim()) {
    errors.push('Contact phone number is required.');
  } else if (!/^[0-9+-\s]{8,15}$/.test(formData.phone.trim())) {
    errors.push('Please enter a valid phone number (e.g., 01771-358595).');
  }
  if (!formData.appointmentDate) {
    errors.push('Please select a preferred Thursday appointment date.');
  }
  if (!formData.serviceId) {
    errors.push('Please select a surgical specialty or reason for consultation.');
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      message: errors[0]
    };
  }

  // Simulate network dispatch delay for professional UX feedback
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Prepared data payload ready for future email provider integration
  const preparedPayload = {
    patientName: formData.patientName.trim(),
    phone: formData.phone.trim(),
    appointmentDate: formData.appointmentDate,
    serviceId: formData.serviceId,
    age: formData.age ? Number(formData.age) : null,
    gender: formData.gender || 'Not specified',
    notes: (formData.notes || '').trim(),
    preparedAt: new Date().toISOString(),
    chamberLocation: 'New Green Life Hospital, Ashuganj'
  };

  /**
   * FUTURE EMAIL INTEGRATION HOOK:
   * When integrating with an email service:
   * Option A (Serverless/API):
   *   const res = await fetch('/api/send-appointment-email', { method: 'POST', body: JSON.stringify(preparedPayload) });
   * Option B (EmailJS with safe public key):
   *   await emailjs.send(SERVICE_ID, TEMPLATE_ID, preparedPayload, PUBLIC_KEY);
   */

  return {
    success: true,
    data: preparedPayload,
    message: "Your request has been prepared. Email submission will be available soon."
  };
};
