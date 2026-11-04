import React, { useState } from 'react';
import { MapPin, Clock, Phone, Calendar, ExternalLink, Navigation, MessageCircle } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './LocationHours.css';

export default function LocationHours({ onOpenAppointment }) {
  const [activeTab, setActiveTab] = useState(0);
  const chamber = DOCTOR_INFO.chambers[activeTab] || DOCTOR_INFO.chambers[0];

  return (
    <section className="location-section" id="schedule">
      <div className="container">
        
        <div className="section-header">
          <span className="section-tag">Consultation Chambers</span>
          <h2 className="section-title">Chamber Schedule & Locations</h2>
          <p className="section-subtitle">
            Regular specialist surgical outpatient consultation and clinical evaluation across Dhaka, Ashuganj, and Brahmanbaria.
          </p>
        </div>

        {/* Chamber Selection Tabs */}
        <div className="chamber-tabs-nav" role="tablist" aria-label="Chamber Locations">
          {DOCTOR_INFO.chambers.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={activeTab === idx}
              className={`chamber-tab-pill ${activeTab === idx ? 'active' : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              <span className="tab-pill-city">{c.city} Chamber</span>
              <span className="tab-pill-name">{c.hospitalName}</span>
              <span className="tab-pill-time">{c.scheduleDays}</span>
            </button>
          ))}
        </div>

        <div className="location-grid">
          
          {/* Left: Schedule & Chamber Details */}
          <div className="chamber-details-card">
            <div className="chamber-header-badge">
              <span className="badge badge-primary">{chamber.city} Specialist Chamber</span>
            </div>

            <h3 className="chamber-name">{chamber.hospitalName}</h3>
            <span className="chamber-bangla-name bangla-text">{chamber.banglaHospitalName}</span>

            <div className="chamber-info-list">
              
              {/* Visiting Day & Time */}
              <div className="info-item highlight">
                <div className="info-icon">
                  <Clock size={20} />
                </div>
                <div className="info-text">
                  <span className="info-label">Consultation Schedule:</span>
                  <span className="info-val">{chamber.scheduleDays}: {chamber.scheduleHours}</span>
                  <span className="info-bangla bangla-text">({chamber.banglaScheduleDays}: {chamber.banglaScheduleHours})</span>
                  {chamber.closedDays && (
                    <span className="closed-days-pill">
                      Weekly Closed: {chamber.closedDays} ({chamber.banglaClosedDays})
                    </span>
                  )}
                </div>
              </div>

              {/* Exact Address */}
              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={20} />
                </div>
                <div className="info-text">
                  <span className="info-label">Address & Landmark:</span>
                  <span className="info-val">{chamber.address}</span>
                  <span className="info-bangla bangla-text">({chamber.banglaAddress})</span>
                </div>
              </div>

              {/* Appointment Serial Phone */}
              <div className="info-item">
                <div className="info-icon">
                  <Phone size={20} />
                </div>
                <div className="info-text">
                  <span className="info-label">Serial & Inquiry Hotline:</span>
                  <div className="hotline-links-group">
                    {chamber.serialPhones.map((ph, idx) => (
                      <a key={idx} href={`tel:${ph.replace(/[^\d+]/g, '')}`} className="phone-hotline-link">
                        {ph}
                      </a>
                    ))}
                  </div>
                  <span className="info-sub">Advance appointment serial booking recommended</span>
                  
                  {/* WhatsApp Support Link */}
                  <a
                    href={DOCTOR_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-chamber-link"
                    title="Direct WhatsApp Consultation"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Action buttons */}
            <div className="chamber-actions">
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={onOpenAppointment}
              >
                <Calendar size={17} />
                <span>Book Serial Online</span>
              </button>

              <a 
                href={chamber.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <Navigation size={17} />
                <span>Open in Google Maps</span>
              </a>
            </div>

          </div>

          {/* Right: Embedded Interactive Map */}
          <div className="map-container-box">
            <div className="map-header">
              <span className="map-title">{chamber.hospitalName} Location</span>
              <a 
                href={chamber.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="map-open-link"
              >
                <span>View Full Map</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="map-frame-wrapper">
              <iframe
                key={chamber.id}
                title={`${chamber.hospitalName} Location Map`}
                src={`https://maps.google.com/maps?q=${chamber.coordinates.lat},${chamber.coordinates.lng}&hl=en&z=16&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="map-footer-note">
              <MapPin size={14} className="map-pin-icon" />
              <span>{chamber.address}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
