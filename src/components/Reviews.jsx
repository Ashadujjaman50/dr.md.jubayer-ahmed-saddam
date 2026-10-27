import React from 'react';
import { Star, Quote, ShieldCheck, HeartHandshake, UserCheck } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './Reviews.css';

export default function Reviews() {
  return (
    <section className="reviews-section" id="reviews">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Patient Experience & Integrity</span>
          <h2 className="section-title">Clinical Consultation & Care Principles</h2>
          <p className="section-subtitle">
            Ethical surgical practice centered on patient safety, informed consent, and attentive recovery support.
          </p>
        </div>

        {/* Doctor Clinical Quote Box */}
        <div className="quote-spotlight">
          <Quote size={40} className="quote-icon" />
          <blockquote className="quote-text">
            "{DOCTOR_INFO.clinicalPrinciples[0].quote}"
          </blockquote>
          <div className="quote-author-info">
            <span className="quote-author-name">{DOCTOR_INFO.clinicalPrinciples[0].author}</span>
            <span className="quote-author-role">{DOCTOR_INFO.clinicalPrinciples[0].designation}</span>
          </div>
        </div>

        {/* Patient Testimonials Grid */}
        <div className="reviews-grid">
          {DOCTOR_INFO.reviews.map((rev) => (
            <div key={rev.id} className="review-card">
              <div className="review-rating">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={16} className="star-filled" fill="#F59E0B" />
                ))}
              </div>
              <p className="review-comment bangla-text">"{rev.comment}"</p>
              <div className="review-patient-meta">
                <div className="patient-avatar">
                  <UserCheck size={18} />
                </div>
                <div className="patient-details">
                  <h4 className="patient-name">{rev.patientName}</h4>
                  <span className="patient-treatment">{rev.treatment}</span>
                  <span className="patient-loc">{rev.location} • {rev.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transparency note */}
        <div className="transparency-note">
          <ShieldCheck size={18} className="transparency-icon" />
          <span>
            <strong>Clinical Notice:</strong> Every individual patient condition is clinically unique. Surgical indications, procedure types, and recovery timelines are determined following clinical examination and appropriate investigations.
          </span>
        </div>

      </div>
    </section>
  );
}
