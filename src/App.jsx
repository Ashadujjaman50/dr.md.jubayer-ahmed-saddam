import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Affiliations from './components/Affiliations';
import Services from './components/Services';
import About from './components/About';
import Reviews from './components/Reviews';
import LocationHours from './components/LocationHours';
import Footer from './components/Footer';
import AppointmentModal from './components/AppointmentModal';
import ContactModal from './components/ContactModal';
import ServiceDetailModal from './components/ServiceDetailModal';
import LegalModal from './components/LegalModal';
import './App.css';

export default function App() {
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [serviceDetail, setServiceDetail] = useState(null);
  const [legalType, setLegalType] = useState(null);

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
      />

      {/* Main Content Sections */}
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

      {/* Footer */}
      <Footer
        onOpenAppointment={() => handleOpenAppointment()}
        onOpenContact={handleOpenContact}
        onOpenLegal={handleOpenLegal}
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
