import React from 'react';
import { MapPin, Clock, Phone, Calendar, ExternalLink, Navigation } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './LocationHours.css';

export default function LocationHours({ onOpenAppointment }) {
  const { chamber } = DOCTOR_INFO;

  return (
    <section className="location-section" id="schedule">
      <div className="container">
        
        <div className="section-header">
          <span className="section-tag">Ashuganj Specialist Chamber</span>
          <h2 className="section-title">Chamber Schedule & Location</h2>
          <p className="section-subtitle">
            Regular specialist surgical outpatient consultation and clinical evaluation at New Green Life Hospital, Ashuganj.
          </p>
        </div>

        <div className="location-grid">
          
          {/* Left: Schedule & Chamber Details */}
          <div className="chamber-details-card">
            <div className="chamber-header-badge">
              <span className="badge badge-primary">Weekly Visiting Schedule</span>
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
                  <span className="info-val">{chamber.scheduleDays}</span>
                  <span className="info-time">{chamber.scheduleHours}</span>
                  <span className="info-bangla bangla-text">({chamber.banglaScheduleDays}, {chamber.banglaScheduleHours})</span>
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
                  <a href={`tel:${chamber.phone}`} className="phone-hotline-link">
                    {chamber.phone}
                  </a>
                  <span className="info-sub">Advance appointment serial booking recommended</span>
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
              <span className="map-title">Hospital Location on Google Maps</span>
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
                title="New Green Life Hospital Location Map"
                src={`https://maps.google.com/maps?q=${chamber.coordinates.lat},${chamber.coordinates.lng}&hl=en&z=17&output=embed`}
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
              <span>Coordinates: {chamber.coordinates.lat}, {chamber.coordinates.lng} (Station Road, Ashuganj)</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
