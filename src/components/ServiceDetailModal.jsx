import React from 'react';
import { X, CheckCircle, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import './Modal.css';

export default function ServiceDetailModal({ service, onClose, onOpenAppointment }) {
  if (!service) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog service-dialog" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="badge badge-primary">{service.banglaTitle}</span>
            <h3 className="modal-title">{service.title}</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="service-detail-section">
            <h4 className="service-subhead">Clinical Overview</h4>
            <p className="service-full-desc">{service.fullDesc}</p>
          </div>

          <div className="service-detail-section">
            <h4 className="service-subhead">Key Procedures Performed</h4>
            <div className="detail-procedures-grid">
              {service.procedures.map((proc, i) => (
                <div key={i} className="detail-proc-item">
                  <CheckCircle size={16} className="detail-check" />
                  <span>{proc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="service-consultation-banner">
            <div className="consult-banner-text">
              <h5>Consult Dr. Saddam on Thursday</h5>
              <p>Visiting hours: 2:00 PM – 8:00 PM at New Green Life Hospital, Ashuganj.</p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onOpenAppointment(service.id);
              }}
            >
              <Calendar size={16} />
              <span>Book Consultation</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
