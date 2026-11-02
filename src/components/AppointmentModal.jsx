import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Phone, AlertCircle, CheckCircle2, Hospital, MessageCircle } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import { submitAppointmentRequest } from '../services/appointmentService';
import './Modal.css';

export default function AppointmentModal({ isOpen, onClose, initialServiceId }) {
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    chamberId: 'ashuganj',
    appointmentDate: '',
    serviceId: initialServiceId || DOCTOR_INFO.services[0].id,
    age: '',
    gender: 'Male',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [preparedNotice, setPreparedNotice] = useState(null);

  const handleReset = () => {
    setPreparedNotice(null);
    setFormData({
      patientName: '',
      phone: '',
      chamberId: 'ashuganj',
      appointmentDate: '',
      serviceId: DOCTOR_INFO.services[0].id,
      age: '',
      gender: 'Male',
      notes: ''
    });
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    if (initialServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: initialServiceId }));
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, initialServiceId]);

  if (!isOpen) return null;

  // Calculate upcoming available dates for selected chamber with local timezone safety
  const getUpcomingDates = (chamberId) => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 35; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const day = d.getDay();
      let match = false;
      if (chamberId === 'ashuganj') {
        match = (day === 4); // Thursday
      } else if (chamberId === 'brahmanbaria') {
        match = (day === 5); // Friday
      } else {
        // Dhaka: daily except Thursday (4) & Friday (5)
        match = (day !== 4 && day !== 5);
      }

      if (match) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dayOfMonth = String(d.getDate()).padStart(2, '0');
        const localIsoDate = `${year}-${month}-${dayOfMonth}`;

        dates.push({
          value: localIsoDate,
          label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        });
        if (dates.length >= 6) break;
      }
    }
    return dates;
  };

  const currentChamber = DOCTOR_INFO.chambers.find(c => c.id === formData.chamberId) || DOCTOR_INFO.chambers[0];
  const upcomingDates = getUpcomingDates(formData.chamberId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleChamberChange = (e) => {
    const chamberId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      chamberId,
      appointmentDate: ''
    }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await submitAppointmentRequest({
        ...formData,
        chamberLocation: `${currentChamber.hospitalName}, ${currentChamber.city}`
      });
      if (result.success) {
        setPreparedNotice(result);
      } else {
        setErrorMessage(result.message || 'Please check the required fields.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please call the hotline directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleReset}>
      <div
        className="modal-dialog appointment-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-modal-title"
      >
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title" id="appointment-modal-title">Request Surgical Appointment</h3>
            <span className="modal-subtitle">
              Chambers in Dhaka, Ashuganj &amp; Brahmanbaria
            </span>
          </div>
          <button type="button" className="modal-close-btn" onClick={handleReset} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {preparedNotice ? (
            <div className="prepared-feedback-box">
              <div className="feedback-icon-wrapper">
                <CheckCircle2 size={42} className="feedback-check-icon" />
              </div>
              <h4 className="feedback-title">Appointment Request Prepared</h4>
              <p className="feedback-message">
                {preparedNotice.message}
              </p>

              <div className="prepared-summary-card">
                <div className="summary-row">
                  <span className="summary-label">Patient:</span>
                  <span className="summary-val">{preparedNotice.data.patientName}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Phone:</span>
                  <span className="summary-val">{preparedNotice.data.phone}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Preferred Date:</span>
                  <span className="summary-val">{preparedNotice.data.appointmentDate}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Chamber:</span>
                  <span className="summary-val">{preparedNotice.data.chamberLocation}</span>
                </div>
              </div>

              {/* Direct Hotline Notice */}
              <div className="direct-call-alert">
                <Hospital size={20} className="alert-icon" />
                <div className="alert-text">
                  <strong>Need immediate serial confirmation?</strong>
                  <p>Please call the chamber serial desk or message on WhatsApp:</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                    {currentChamber.serialPhones.map((ph, idx) => (
                      <a key={idx} href={`tel:${ph}`} className="alert-phone-btn">
                        <Phone size={14} />
                        <span>Call {ph}</span>
                      </a>
                    ))}
                    <a href={DOCTOR_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="alert-phone-btn" style={{ background: '#059669' }}>
                      <MessageCircle size={14} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
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

              {/* Chamber Selector */}
              <div className="form-group">
                <label htmlFor="appointmentChamber">Select Consultation Chamber <span className="req">*</span></label>
                <select
                  id="appointmentChamber"
                  name="chamberId"
                  value={formData.chamberId}
                  onChange={handleChamberChange}
                >
                  {DOCTOR_INFO.chambers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.city}: {c.hospitalName} ({c.scheduleDays} {c.scheduleHours})
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Name & Phone */}
              <div className="form-row two-col">
                <div className="form-group">
                  <label htmlFor="patientName">Patient Name <span className="req">*</span></label>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    required
                    placeholder="e.g. Mohammad Ali"
                    value={formData.patientName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="patientPhone">Contact Phone Number <span className="req">*</span></label>
                  <input
                    type="tel"
                    id="patientPhone"
                    name="phone"
                    required
                    placeholder="e.g. 01771-358595"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Date & Service */}
              <div className="form-row two-col">
                <div className="form-group">
                  <label htmlFor="appointmentDate">Preferred Date <span className="req">*</span></label>
                  <select
                    id="appointmentDate"
                    name="appointmentDate"
                    required
                    value={formData.appointmentDate}
                    onChange={handleChange}
                  >
                    <option value="">-- Choose Available Date --</option>
                    {upcomingDates.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="serviceId">Surgical Specialty <span className="req">*</span></label>
                  <select
                    id="serviceId"
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                  >
                    {DOCTOR_INFO.services.map((svc) => (
                      <option key={svc.id} value={svc.id}>
                        {svc.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Age & Gender */}
              <div className="form-row two-col">
                <div className="form-group">
                  <label htmlFor="patientAge">Patient Age</label>
                  <input
                    type="number"
                    id="patientAge"
                    name="age"
                    min="1"
                    max="110"
                    placeholder="e.g. 42"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="patientGender">Gender</label>
                  <select
                    id="patientGender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Clinical Notes / Symptoms */}
              <div className="form-group">
                <label htmlFor="appointmentNotes">Medical Concern / Symptoms (Optional)</label>
                <textarea
                  id="appointmentNotes"
                  name="notes"
                  rows="3"
                  placeholder="Briefly describe your symptoms (e.g., Gallbladder pain, Piles, Hernia, Previous reports)"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Notice */}
              <div className="form-notice">
                <Clock size={14} className="notice-icon" />
                <span>Serial confirmation is provided upon clinical coordination. In urgent cases, call the chamber hotline directly.</span>
              </div>

              {/* Submit Buttons */}
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
                  <Calendar size={16} />
                  <span>{loading ? 'Preparing Request...' : 'Prepare Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
