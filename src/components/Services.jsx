import React from 'react';
import { Activity, ShieldPlus, Stethoscope, Scissors, ArrowRight, Check } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './Services.css';

export default function Services({ onSelectService, onOpenAppointment }) {
  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Activity': return <Activity size={24} />;
      case 'ShieldPlus': return <ShieldPlus size={24} />;
      case 'Stethoscope': return <Stethoscope size={24} />;
      case 'Scissors': return <Scissors size={24} />;
      default: return <Activity size={24} />;
    }
  };

  return (
    <section className="services-section" id="specialties">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Clinical Expertise</span>
          <h2 className="section-title">Specialized Surgical Care</h2>
          <p className="section-subtitle">
            Advanced operative procedures utilizing minimally invasive laparoscopic technology, precision colorectal management, and evidence-based surgical safety protocols.
          </p>
        </div>

        <div className="services-grid">
          {DOCTOR_INFO.services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card-top">
                <div className="service-icon-wrapper">
                  {getServiceIcon(service.icon)}
                </div>
                <span className="service-bangla-badge bangla-text">
                  {service.banglaTitle}
                </span>
              </div>

              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.shortDesc}</p>

              <div className="service-procedures-list">
                {service.procedures.slice(0, 3).map((item, i) => (
                  <div key={i} className="procedure-item">
                    <Check size={14} className="procedure-check" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="service-card-actions">
                <button
                  type="button"
                  className="service-btn-details"
                  onClick={() => onSelectService(service)}
                  title="View detailed clinical information"
                >
                  <span>Clinical Details</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  className="service-btn-book"
                  onClick={() => onOpenAppointment(service.id)}
                >
                  Consultation
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Ashuganj Surgical Consultation Callout */}
        <div className="ashuganj-service-banner">
          <div className="banner-text">
            <h4>Visiting Thursday at New Green Life Hospital, Ashuganj</h4>
            <p>Patients requiring surgical assessment for Gallstones, Hernia, Piles, or Abdominal Pain can consult directly.</p>
          </div>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => onOpenAppointment()}
          >
            Schedule Thursday Appointment
          </button>
        </div>
      </div>
    </section>
  );
}
