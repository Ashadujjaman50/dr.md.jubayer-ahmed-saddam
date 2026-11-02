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
            Comprehensive surgical care in General, Advanced Laparoscopic, Colorectal, Hepatobiliary and Pancreatic Surgery.
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
                {(service.cardProcedures || service.procedures).map((item, i) => (
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

        {/* Surgical Consultation Callout */}
        <div className="ashuganj-service-banner">
          <div className="banner-text">
            <h4>Specialist Surgical Consultation</h4>
            <p>Regular surgical consultations available in Dhaka (Health and Hope Hospital), Ashuganj (নিউ গ্রীণ লাইফ হাসপাতাল), and Brahmanbaria (ল্যাবএইড ডায়াগনস্টিক লিঃ).</p>
          </div>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => onOpenAppointment()}
          >
            Schedule Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
