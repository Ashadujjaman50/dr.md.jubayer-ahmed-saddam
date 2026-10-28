import React from 'react';
import { Calendar, Phone, Award, Clock, CheckCircle } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './Hero.css';

export default function Hero({ onOpenAppointment, onOpenContact }) {
  return (
    <section className="hero-section" id="home">
      <div className="container hero-container">
        
        {/* Left Column: Doctor Identity & Surgical Credentials */}
        <div className="hero-content">
          <div className="hero-badge-row">
            <span className="badge badge-primary">
              <Award size={14} />
              <span>{DOCTOR_INFO.degrees}</span>
            </span>
            <span className="badge badge-outline">
              <span>{DOCTOR_INFO.title}</span>
            </span>
          </div>

          <h1 className="hero-title">
            <span className="hero-greeting">Assalamu Alaikum, I am</span>
            <span className="hero-name">{DOCTOR_INFO.name}</span>
            <span className="hero-bangla-name bangla-text">
              ({DOCTOR_INFO.banglaName})
            </span>
          </h1>

          <p className="hero-designation">
            <strong>{DOCTOR_INFO.title}</strong>, Dept. of Surgery <br />
            <span className="hero-institution">{DOCTOR_INFO.currentInstitution}</span>
            <br />
            <span className="hero-former">{DOCTOR_INFO.formerInstitution}</span>
          </p>

          <div className="hero-specialties-box">
            <span className="specialties-label">Specialist In:</span>
            <div className="specialties-tags">
              {DOCTOR_INFO.specialties.map((spec, idx) => (
                <span key={idx} className="spec-tag">
                  <CheckCircle size={13} className="spec-icon" />
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Schedule Highlight Banner */}
          <div className="hero-schedule-banner">
            <div className="schedule-banner-icon">
              <Clock size={20} />
            </div>
            <div className="schedule-banner-text">
              <span className="schedule-days-title">
                {DOCTOR_INFO.chamber.banglaHospitalName} (আশুগঞ্জ চেম্বার):
              </span>
              <span className="schedule-hours-pill">
                {DOCTOR_INFO.chamber.scheduleDays} • {DOCTOR_INFO.chamber.scheduleHours}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="hero-actions">
            <button 
              type="button" 
              className="btn btn-primary hero-btn-main"
              onClick={onOpenAppointment}
            >
              <Calendar size={18} />
              <span>Book Appointment</span>
            </button>

            <button 
              type="button" 
              className="btn btn-secondary hero-btn-sub"
              onClick={onOpenContact}
            >
              <Phone size={17} />
              <span>Contact Chamber</span>
            </button>
          </div>
        </div>

        {/* Right Column: Doctor Professional Portrait & Floating Stat Cards */}
        <div className="hero-image-wrapper">
          <div className="hero-image-stage">
            {/* Soft Ambient Glow Backdrop */}
            <div className="stage-glow"></div>
            
            {/* Doctor Portrait (anchored to bottom) */}
            <img 
              src="/assets/doctor-transparent.png" 
              alt={`Dr. Md. Jubayer Ahmed Saddam - ${DOCTOR_INFO.title}`}
              className="doctor-cutout-img"
              onError={(e) => {
                // Fallback to regular photo if transparent cutout is missing
                e.target.onerror = null;
                e.target.src = '/assets/doctor.jpg';
                e.target.classList.add('fallback-radius');
              }}
            />

            {/* Floating Card 1: Experience (Top Left negative space) */}
            <div className="floating-stat-card card-top-left">
              <div className="stat-card-icon emerald">
                <Award size={18} />
              </div>
              <div className="stat-card-text">
                <span className="stat-card-number">{DOCTOR_INFO.experienceYears}+ Years</span>
                <span className="stat-card-label">Surgical Experience</span>
              </div>
            </div>

            {/* Floating Card 2: Academic Role (Top Right negative space) */}
            <div className="floating-stat-card card-top-right">
              <div className="stat-card-icon teal">
                <CheckCircle size={18} />
              </div>
              <div className="stat-card-text">
                <span className="stat-card-number">Asst. Professor</span>
                <span className="stat-card-label">Ad-din Medical College</span>
              </div>
            </div>

            {/* Floating Card 3: Visiting Schedule (Bottom Right negative space) */}
            <div className="floating-stat-card card-bottom-right">
              <div className="stat-card-icon blue">
                <Clock size={18} />
              </div>
              <div className="stat-card-text">
                <span className="stat-card-number no-wrap">Every Thursday</span>
                <span className="stat-card-label no-wrap">2:00 PM – 8:00 PM (Ashuganj)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
