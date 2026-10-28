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
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll and close on Escape / desktop resize
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

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
            aria-label="Book Appointment"
            title="Book Appointment"
          >
            <Calendar size={16} />
            <span className="header-book-text">Book Appointment</span>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="mobile-drawer-backdrop"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <div
            id="mobile-navigation-drawer"
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site Navigation"
          >
            <nav className="mobile-nav" aria-label="Mobile Navigation">
              <a href="#about" onClick={closeMenu}>About Dr. Saddam</a>
              <a href="#specialties" onClick={closeMenu}>Surgical Specialties</a>
              <a href="#affiliations" onClick={closeMenu}>Affiliations</a>
              <a href="#schedule" onClick={closeMenu}>Chamber</a>
              <a href="#reviews" onClick={closeMenu}>Consultation</a>
              <button
                type="button"
                className="mobile-drawer-btn"
                onClick={() => { closeMenu(); onOpenContact(); }}
              >
                Contact Inquiries
              </button>
              <div className="mobile-drawer-actions">
                <a href={`tel:${DOCTOR_INFO.chamber.phone}`} className="mobile-phone-btn" onClick={closeMenu}>
                  <Phone size={16} /> Serial: {DOCTOR_INFO.chamber.phone}
                </a>
                <button
                  type="button"
                  className="btn btn-primary mobile-appointment-btn"
                  onClick={() => { closeMenu(); onOpenAppointment(); }}
                >
                  <Calendar size={16} /> Request Appointment
                </button>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
