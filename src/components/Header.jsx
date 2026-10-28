import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Menu, X } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './Header.css';

export default function Header({ onOpenAppointment, onOpenContact }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        {/* Brand / Doctor Title */}
        <a href="#" className="brand-logo" aria-label="Home">
          <div className="brand-badge">
            <span className="brand-initials">DS</span>
          </div>
          <div className="brand-text">
            <span className="brand-name">{DOCTOR_INFO.name}</span>
            <span className="brand-designation">{DOCTOR_INFO.title}</span>
            <span className="brand-degrees">{DOCTOR_INFO.degrees}</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <a href="#about" className="nav-link">About</a>
          <a href="#specialties" className="nav-link">Specialties</a>
          <a href="#affiliations" className="nav-link">Affiliations</a>
          <a href="#schedule" className="nav-link">Chamber</a>
          <a href="#reviews" className="nav-link">Consultation</a>
          <button
            type="button"
            className="nav-link nav-btn-link"
            onClick={onOpenContact}
          >
            Contact
          </button>
        </nav>

        {/* Action Button: Appointment CTA */}
        <div className="header-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm header-book-btn"
            onClick={onOpenAppointment}
          >
            <Calendar size={15} />
            <span>Book Appointment</span>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav">
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>About Dr. Saddam</a>
            <a href="#specialties" onClick={() => setMobileMenuOpen(false)}>Surgical Specialties</a>
            <a href="#affiliations" onClick={() => setMobileMenuOpen(false)}>Affiliations</a>
            <a href="#schedule" onClick={() => setMobileMenuOpen(false)}>Chamber</a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)}>Consultation</a>
            <button
              type="button"
              className="mobile-drawer-btn"
              onClick={() => { setMobileMenuOpen(false); onOpenContact(); }}
            >
              Contact Inquiries
            </button>
            <div className="mobile-drawer-actions">
              <a href={`tel:${DOCTOR_INFO.chamber.phone}`} className="mobile-phone-btn">
                <Phone size={16} /> Serial: {DOCTOR_INFO.chamber.phone}
              </a>
              <button
                type="button"
                className="btn btn-primary mobile-appointment-btn"
                onClick={() => { setMobileMenuOpen(false); onOpenAppointment(); }}
              >
                <Calendar size={16} /> Request Appointment
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
