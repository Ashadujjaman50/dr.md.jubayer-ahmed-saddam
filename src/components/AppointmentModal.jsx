import React, { useState } from 'react';
import { X, Calendar, Clock, Phone, AlertCircle, CheckCircle2, Hospital } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import { submitAppointmentRequest } from '../services/appointmentService';
import './Modal.css';

export default function AppointmentModal({ isOpen, onClose, initialServiceId }) {
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    appointmentDate: '',
    serviceId: initialServiceId || DOCTOR_INFO.services[0].id,
    age: '',
    gender: 'Male',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [preparedNotice, setPreparedNotice] = useState(null);

  if (!isOpen) return null;

  // Calculate upcoming Thursdays
  const getUpcomingThursdays = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() === 4) { // Thursday is day 4
        dates.push({
          value: d.toISOString().split('T')[0],
          label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        });
        if (dates.length >= 4) break;
      }
    }
    return dates;
  };

  const upcomingThursdays = getUpcomingThursdays();

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
      const result = await submitAppointmentRequest(formData);
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

  const handleReset = () => {
    setPreparedNotice(null);
    setFormData({
      patientName: '',
      phone: '',
      appointmentDate: '',
      serviceId: DOCTOR_INFO.services[0].id,
      age: '',
      gender: 'Male',
      notes: ''
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleReset}>
      <div className="modal-dialog appointment-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title">Request Surgical Appointment</h3>
            <span className="modal-subtitle">
              New Green Life Hospital, Ashuganj (Every Thursday 2:00 PM – 8:00 PM)
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
                  <span className="summary-val">{preparedNotice.data.appointmentDate} (Thursday)</span>
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
                  <p>Please call the hospital reception desk directly at:</p>
                  <a href={`tel:${DOCTOR_INFO.chamber.phone}`} className="alert-phone-btn">
                    <Phone size={16} />
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
                  <label htmlFor="patientName">Patient Full Name <span className="req">*</span></label>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    required
                    placeholder="e.g. Md. Kabir Hossain"
                    value={formData.patientName}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Contact Phone Number <span className="req">*</span></label>
                  <input
                    type="tel"
                    id="phone"
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
                  <label htmlFor="appointmentDate">Select Thursday Date <span className="req">*</span></label>
                  <select
                    id="appointmentDate"
                    name="appointmentDate"
                    required
                    value={formData.appointmentDate}
                    onChange={handleChange}
                  >
                    <option value="">-- Choose Upcoming Thursday --</option>
                    {upcomingThursdays.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label} (2:00 PM - 8:00 PM)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="serviceId">Surgical Specialty <span className="req">*</span></label>
                  <select
                    id="serviceId"
                    name="serviceId"
                    required
                    value={formData.serviceId}
                    onChange={handleChange}
                  >
                    {DOCTOR_INFO.services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label htmlFor="age">Patient Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="1"
                    max="115"
                    placeholder="e.g. 45"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
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

              <div className="form-group">
                <label htmlFor="notes">Brief Problem Summary / Surgical Symptoms</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  placeholder="e.g. Gallbladder stone detected on USG / Piles problem for 6 months..."
                  value={formData.notes}
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
                  {loading ? 'Preparing Request...' : 'Prepare Request'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
