import React, { useState, useEffect } from 'react';
import { Calendar, Menu, X } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './Header.css';

export default function Header({ onOpenAppointment, onOpenContact, currentRoute = '/', onNavigate }) {
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

  const handleNavClick = (e, anchor) => {
    if (onNavigate && currentRoute !== '/') {
      e.preventDefault();
      onNavigate('/', anchor);
    }
  };

  const handleMobileNavClick = (e, anchor) => {
    closeMenu();
    if (onNavigate && currentRoute !== '/') {
      e.preventDefault();
      onNavigate('/', anchor);
    }
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        {/* Brand / Doctor Title */}
        <a 
          href="/" 
          className="brand-logo" 
          aria-label="Home"
          onClick={(e) => {
            if (onNavigate) {
              e.preventDefault();
              onNavigate('/');
            }
          }}
        >
          <div className="brand-badge">
            <img 
              src="/assets/logo.png" 
              alt="Dr. Md. Jubayear Ahmed Saddam Logo" 
              className="brand-logo-img" 
            />
          </div>
          <div className="brand-text">
            <span className="brand-name">{DOCTOR_INFO.name}</span>
            <span className="brand-designation">{DOCTOR_INFO.title}</span>
            <span className="brand-degrees">{DOCTOR_INFO.degrees}</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, '#about')}>About</a>
          <a href="#specialties" className="nav-link" onClick={(e) => handleNavClick(e, '#specialties')}>Specialties</a>
          <a href="#affiliations" className="nav-link" onClick={(e) => handleNavClick(e, '#affiliations')}>Affiliations</a>
          <a href="#schedule" className="nav-link" onClick={(e) => handleNavClick(e, '#schedule')}>Chamber</a>
          <a 
            href="/gallery" 
            className={`nav-link ${currentRoute === '/gallery' ? 'active' : ''}`}
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('/gallery');
              }
            }}
          >
            Gallery
          </a>
          <a href="#reviews" className="nav-link" onClick={(e) => handleNavClick(e, '#reviews')}>Consultation</a>
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
            <Calendar className="header-calendar-icon" size={24} />
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
              <a href="#about" onClick={(e) => handleMobileNavClick(e, '#about')}>About Dr. Saddam</a>
              <a href="#specialties" onClick={(e) => handleMobileNavClick(e, '#specialties')}>Surgical Specialties</a>
              <a href="#affiliations" onClick={(e) => handleMobileNavClick(e, '#affiliations')}>Affiliations</a>
              <a href="#schedule" onClick={(e) => handleMobileNavClick(e, '#schedule')}>Chamber</a>
              <a 
                href="/gallery" 
                className={currentRoute === '/gallery' ? 'active' : ''}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    closeMenu();
                    onNavigate('/gallery');
                  }
                }}
              >
                Gallery
              </a>
              <a href="#reviews" onClick={(e) => handleMobileNavClick(e, '#reviews')}>Consultation</a>
              <button
                type="button"
                className="mobile-drawer-btn"
                onClick={() => { closeMenu(); onOpenContact(); }}
              >
                Contact Inquiries
              </button>
              <div className="mobile-drawer-actions">
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
