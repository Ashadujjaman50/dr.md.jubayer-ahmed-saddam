import React from 'react';
import { Building2, GraduationCap, Award, Hospital } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './Affiliations.css';

export default function Affiliations() {
  const getIcon = (idx) => {
    switch (idx) {
      case 0: return <Building2 size={24} className="affil-icon-svg" />;
      case 1: return <Hospital size={24} className="affil-icon-svg" />;
      case 2: return <GraduationCap size={24} className="affil-icon-svg" />;
      default: return <Award size={24} className="affil-icon-svg" />;
    }
  };

  return (
    <section className="affiliations-section" id="affiliations">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Institutional Integrity</span>
          <h2 className="section-title">Hospital & Academic Affiliations</h2>
          <p className="section-subtitle">
            Providing senior surgical expertise through premier teaching hospitals and dedicated regional chambers.
          </p>
        </div>

        <div className="affiliations-grid">
          {DOCTOR_INFO.affiliations.map((item, idx) => (
            <div key={idx} className="affiliation-card">
              <div className="affil-header">
                <div className="affil-icon-box">
                  {getIcon(idx)}
                </div>
                <span className="affil-status-badge">{item.status}</span>
              </div>
              <h3 className="affil-name">{item.name}</h3>
              <p className="affil-role">{item.role}</p>
              <div className="affil-meta">
                <span className="affil-type">{item.type}</span>
                <span className="affil-loc">{item.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
