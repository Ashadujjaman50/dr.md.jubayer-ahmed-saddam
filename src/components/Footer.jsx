import React from 'react';
import { Phone, MapPin, Clock, Calendar, Mail, ShieldAlert } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './Footer.css';

export default function Footer({ onOpenAppointment, onOpenContact, onOpenLegal }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        
        {/* Brand & Doctor Info */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <div className="footer-badge">DS</div>
            <span className="footer-title">{DOCTOR_INFO.name}</span>
          </div>
          <p className="footer-bangla-name bangla-text">{DOCTOR_INFO.banglaName}</p>
          <p className="footer-desc">
            <strong>{DOCTOR_INFO.title}</strong>, Department of Surgery <br />
            {DOCTOR_INFO.currentInstitution} <br />
            {DOCTOR_INFO.degrees}
          </p>
          <div className="footer-chamber-badge">
            <span className="chamber-badge-title">Ashuganj Visiting Chamber:</span>
            <span>New Green Life Hospital (Every Thursday 2 PM – 8 PM)</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Dr. Saddam</a></li>
            <li><a href="#specialties">Surgical Specialties</a></li>
            <li><a href="#affiliations">Hospital Affiliations</a></li>
            <li><a href="#schedule">Schedule & Chamber</a></li>
            <li><a href="#reviews">Care Principles</a></li>
            <li>
              <button 
                type="button" 
                className="footer-btn-link"
                onClick={onOpenContact}
              >
                Chamber Inquiries
              </button>
            </li>
          </ul>
        </div>

        {/* Surgical Specialties */}
        <div className="footer-col">
          <h4 className="footer-heading">Surgical Specialties</h4>
          <ul className="footer-links">
            {DOCTOR_INFO.services.map((s) => (
              <li key={s.id}>
                <a href="#specialties">{s.title}</a>
              </li>
            ))}
          </ul>
          <div className="footer-cv-box">
            <a 
              href="/assets/cv.pdf" 
              download="Dr-Md-Jubayer-Ahmed-Saddam-CV.pdf"
              className="footer-cv-btn"
            >
              Academic CV (PDF)
            </a>
          </div>
        </div>

        {/* Chamber Serial & Helpline */}
        <div className="footer-col contact-col">
          <h4 className="footer-heading">Chamber Contact</h4>
          <div className="footer-contact-items">
            <div className="f-item">
              <MapPin size={16} className="f-icon" />
              <span>{DOCTOR_INFO.chamber.address}</span>
            </div>
            <div className="f-item">
              <Clock size={16} className="f-icon" />
              <span>{DOCTOR_INFO.chamber.scheduleDays}, {DOCTOR_INFO.chamber.scheduleHours}</span>
            </div>
            <div className="f-item">
              <Phone size={16} className="f-icon" />
              <a href={`tel:${DOCTOR_INFO.chamber.phone}`} className="f-phone">
                Serial: {DOCTOR_INFO.chamber.phone}
              </a>
            </div>
          </div>
          <button 
            type="button" 
            className="btn btn-primary btn-sm footer-book-btn"
            onClick={onOpenAppointment}
          >
            <Calendar size={14} />
            <span>Book Appointment</span>
          </button>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container bottom-container">
          <p className="copyright-text">
            © {currentYear} {DOCTOR_INFO.name}. All medical rights reserved.
          </p>
          <div className="legal-links">
            <button type="button" onClick={() => onOpenLegal('disclaimer')}>Medical Disclaimer</button>
            <span className="dot">•</span>
            <button type="button" onClick={() => onOpenLegal('privacy')}>Privacy Policy</button>
            <span className="dot">•</span>
            <button type="button" onClick={() => onOpenLegal('terms')}>Terms of Consultation</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
