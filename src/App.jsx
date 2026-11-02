import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Affiliations from './components/Affiliations';
import Services from './components/Services';
import About from './components/About';
import Reviews from './components/Reviews';
import LocationHours from './components/LocationHours';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import AppointmentModal from './components/AppointmentModal';
import ContactModal from './components/ContactModal';
import ServiceDetailModal from './components/ServiceDetailModal';
import LegalModal from './components/LegalModal';
import './App.css';

export default function App() {
  // Routing state: '/' or '/gallery'
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/gallery') || hash.startsWith('#/gallery')) {
        return '/gallery';
      }
    }
    return '/';
  });

  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [serviceDetail, setServiceDetail] = useState(null);
  const [legalType, setLegalType] = useState(null);

  // Lock body scroll when any modal is active
  useEffect(() => {
    const isAnyModalOpen = appointmentModalOpen || contactModalOpen || !!serviceDetail || !!legalType;
    if (isAnyModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [appointmentModalOpen, contactModalOpen, serviceDetail, legalType]);

  // Sync route on browser Back/Forward (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.startsWith('/gallery') || hash.startsWith('#/gallery')) {
        setCurrentRoute('/gallery');
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update document title for SEO and user clarity
  useEffect(() => {
    if (currentRoute === '/gallery') {
      document.title = 'Photo Gallery | Dr. Md. Jubayear Ahmed Saddam - Surgeon';
    } else {
      document.title = 'Dr. Md. Jubayear Ahmed Saddam | General, Laparoscopic & Colorectal Surgeon';
    }
  }, [currentRoute]);

  const navigateTo = (path, targetAnchor = null) => {
    if (path === '/gallery') {
      window.history.pushState({}, '', '/gallery');
      setCurrentRoute('/gallery');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const cleanAnchor = targetAnchor ? targetAnchor.replace(/^#/, '') : '';
      const newUrl = cleanAnchor ? `/#${cleanAnchor}` : '/';
      window.history.pushState({}, '', newUrl);
      setCurrentRoute('/');

      if (cleanAnchor) {
        setTimeout(() => {
          const el = document.getElementById(cleanAnchor);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleOpenAppointment = (serviceId = null) => {
    setSelectedServiceId(serviceId);
    setAppointmentModalOpen(true);
  };

  const handleCloseAppointment = () => {
    setAppointmentModalOpen(false);
    setSelectedServiceId(null);
  };

  const handleOpenContact = () => {
    setContactModalOpen(true);
  };

  const handleCloseContact = () => {
    setContactModalOpen(false);
  };

  const handleSelectService = (service) => {
    setServiceDetail(service);
  };

  const handleCloseServiceDetail = () => {
    setServiceDetail(null);
  };

  const handleOpenLegal = (type) => {
    setLegalType(type);
  };

  const handleCloseLegal = () => {
    setLegalType(null);
  };

  return (
    <div className="app-layout">
      {/* Top Header */}
      <Header
        onOpenAppointment={() => handleOpenAppointment()}
        onOpenContact={handleOpenContact}
        currentRoute={currentRoute}
        onNavigate={navigateTo}
      />

      {/* Conditional Page Rendering */}
      {currentRoute === '/gallery' ? (
        <Gallery
          onNavigate={navigateTo}
          onOpenAppointment={() => handleOpenAppointment()}
        />
      ) : (
        /* Main Home Content Sections */
        <main className="main-content">
          <Hero
            onOpenAppointment={() => handleOpenAppointment()}
            onOpenContact={handleOpenContact}
          />

          <Affiliations />

          <Services
            onSelectService={handleSelectService}
            onOpenAppointment={handleOpenAppointment}
          />

          <About
            onOpenAppointment={() => handleOpenAppointment()}
          />

          <Reviews />

          <LocationHours
            onOpenAppointment={() => handleOpenAppointment()}
          />
        </main>
      )}

      {/* Footer */}
      <Footer
        onOpenAppointment={() => handleOpenAppointment()}
        onOpenContact={handleOpenContact}
        onOpenLegal={handleOpenLegal}
        currentRoute={currentRoute}
        onNavigate={navigateTo}
      />

      {/* Modals */}
      <AppointmentModal
        isOpen={appointmentModalOpen}
        initialServiceId={selectedServiceId}
        onClose={handleCloseAppointment}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={handleCloseContact}
      />

      <ServiceDetailModal
        service={serviceDetail}
        onClose={handleCloseServiceDetail}
        onOpenAppointment={handleOpenAppointment}
      />

      <LegalModal
        type={legalType}
        onClose={handleCloseLegal}
      />
    </div>
  );
}
