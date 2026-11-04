import React from 'react';
import { Phone, MapPin, Clock, Calendar } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './Footer.css';

export default function Footer({ onOpenAppointment, onOpenContact, onOpenLegal, currentRoute = '/', onNavigate }) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e, anchor) => {
    if (onNavigate && currentRoute !== '/') {
      e.preventDefault();
      onNavigate('/', anchor);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        
        {/* Brand & Doctor Info */}
        <div className="footer-col brand-col">
          <div 
            className="footer-brand"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('/');
              }
            }}
          >
            <div className="footer-badge">
              <img 
                src="/assets/logo.png" 
                alt="Dr. Md. Jubayear Ahmed Saddam Logo" 
                className="footer-logo-img" 
              />
            </div>
            <div className="footer-brand-text">
              <span className="footer-title">{DOCTOR_INFO.name}</span>
              <span className="footer-bangla-name bangla-text">{DOCTOR_INFO.banglaName}</span>
            </div>
          </div>
          <p className="footer-desc">
            <strong>{DOCTOR_INFO.title}</strong>, Department of Surgery <br />
            {DOCTOR_INFO.currentInstitution} <br />
            {DOCTOR_INFO.degrees}
          </p>
        </div>

        {/* Surgical Specialties */}
        <div className="footer-col specialties-col">
          <h4 className="footer-heading">Surgical Specialties</h4>
          <ul className="footer-links">
            {DOCTOR_INFO.services.map((s) => (
              <li key={s.id}>
                <a href="#specialties" onClick={(e) => handleLinkClick(e, '#specialties')}>{s.title}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Chamber Serial & Helpline */}
        <div className="footer-col contact-col">
          <h4 className="footer-heading">Chamber Contact</h4>
          <div className="footer-contact-items">
            <div className="f-item">
              <MapPin size={16} className="f-icon" />
              <span><strong>Dhaka:</strong> Health and Hope Hospital (<a href="tel:01841822442" className="f-phone">01841-822442</a>)</span>
            </div>
            <div className="f-item">
              <MapPin size={16} className="f-icon" />
              <span><strong>Ashuganj:</strong> নিউ গ্রীণ লাইফ হাসপাতাল (<a href="tel:01771358595" className="f-phone">01771-358595</a>, <a href="tel:01308229576" className="f-phone">01308-229576</a>)</span>
            </div>
            <div className="f-item">
              <MapPin size={16} className="f-icon" />
              <span><strong>Brahmanbaria:</strong> ল্যাবএইড ডায়াগনস্টিক (<a href="tel:01766662233" className="f-phone">01766-662233</a>)</span>
            </div>
            <div className="f-item">
              <Phone size={16} className="f-icon" />
              <a href={DOCTOR_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="f-phone">
                WhatsApp: {DOCTOR_INFO.whatsapp}
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
