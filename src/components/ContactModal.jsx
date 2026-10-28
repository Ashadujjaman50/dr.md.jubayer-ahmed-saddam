import React, { useState, useEffect } from 'react';
import { X, Send, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import { submitContactMessage } from '../services/contactService';
import './Modal.css';

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Consultation & Serial Inquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [preparedNotice, setPreparedNotice] = useState(null);

  const handleReset = () => {
    setPreparedNotice(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      subject: 'Consultation & Serial Inquiry',
      message: ''
    });
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await submitContactMessage(formData);
      if (result.success) {
        setPreparedNotice(result);
      } else {
        setErrorMessage(result.message || 'Please fill in all required fields.');
      }
    } catch (err) {
      setErrorMessage('Could not prepare message. Please call the hotline directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleReset}>
      <div
        className="modal-dialog contact-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title" id="contact-modal-title">Chamber Inquiry & Message</h3>
            <span className="modal-subtitle">
              Send a question regarding consultation, procedures, or visiting schedule
            </span>
          </div>
          <button type="button" className="modal-close-btn" onClick={handleReset} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {preparedNotice ? (
            <div className="prepared-feedback-box">
              <div className="feedback-icon-wrapper">
                <CheckCircle2 size={42} className="feedback-check-icon" />
              </div>
              <h4 className="feedback-title">Inquiry Prepared</h4>
              <p className="feedback-message">
                {preparedNotice.message}
              </p>

              <div className="prepared-summary-card">
                <div className="summary-row">
                  <span className="summary-label">Name:</span>
                  <span className="summary-val">{preparedNotice.data.name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Phone:</span>
                  <span className="summary-val">{preparedNotice.data.phone}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Subject:</span>
                  <span className="summary-val">{preparedNotice.data.subject}</span>
                </div>
              </div>

              <div className="direct-call-alert">
                <Phone size={20} className="alert-icon" />
                <div className="alert-text">
                  <strong>For quick phone assistance:</strong>
                  <p>You can reach the Ashuganj chamber serial desk at:</p>
                  <a href={`tel:${DOCTOR_INFO.chamber.phone}`} className="alert-phone-btn">
                    <span>Call {DOCTOR_INFO.chamber.phone}</span>
                  </a>
                </div>
              </div>

              <button type="button" className="btn btn-primary btn-full" onClick={handleReset}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="modal-form">
              {errorMessage && (
                <div className="form-error-alert">
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="form-row two-col">
                <div className="form-group">
                  <label htmlFor="contactName">Your Name <span className="req">*</span></label>
                  <input
                    type="text"
                    id="contactName"
                    name="name"
                    required
                    placeholder="e.g. Tariqul Islam"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactPhone">Phone Number <span className="req">*</span></label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="phone"
                    required
                    placeholder="e.g. 01771-358595"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label htmlFor="contactEmail">Email Address (Optional)</label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contactSubject">Subject</label>
                  <select
                    id="contactSubject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="Consultation & Serial Inquiry">Consultation & Serial Inquiry</option>
                    <option value="Surgical Procedure Information">Surgical Procedure Information</option>
                    <option value="Fee & Investigation Inquiry">Fee & Investigation Inquiry</option>
                    <option value="Directions to Hospital">Directions to Hospital</option>
                    <option value="Other Medical Inquiry">Other Medical Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contactMessage">Your Message / Question <span className="req">*</span></label>
                <textarea
                  id="contactMessage"
                  name="message"
                  required
                  rows="4"
                  placeholder="How can we assist you regarding your surgical consultation?"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <Send size={16} />
                  <span>{loading ? 'Preparing Inquiry...' : 'Prepare Message'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
