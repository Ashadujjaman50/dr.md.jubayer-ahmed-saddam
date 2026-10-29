import React from 'react';
import { Award, GraduationCap, CheckCircle2, FileText, Calendar, ShieldCheck, HeartPulse, UserCheck } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './About.css';

export default function About({ onOpenAppointment }) {
  const whyPoints = [
    {
      icon: <GraduationCap size={22} className="why-icon" />,
      title: "Assistant Professor & Surgical Educator",
      desc: "Actively training upcoming surgeons at Ad-din Medical College & Hospital with strong commitment to evidence-based medical sciences."
    },
    {
      icon: <ShieldCheck size={22} className="why-icon" />,
      title: "Fellow of BCPS (Surgery)",
      desc: "Attained Fellowship (FCPS) from Bangladesh College of Physicians and Surgeons—the benchmark of surgical excellence in the country."
    },
    {
      icon: <HeartPulse size={22} className="why-icon" />,
      title: "Minimally Invasive Precision",
      desc: "Pioneering laparoscopic and keyhole surgeries that dramatically minimize blood loss, wound size, and recovery turnaround."
    },
    {
      icon: <UserCheck size={22} className="why-icon" />,
      title: "Empathetic Patient Care",
      desc: "Clear explanations of pathology, surgical indications, and detailed pre-operative counseling for patients and their families."
    }
  ];

  return (
    <section className="about-section" id="about">
      <div className="container">
        
        {/* Top Header */}
        <div className="section-header">
          <span className="section-tag">Academic & Clinical Profile</span>
          <h2 className="section-title">About {DOCTOR_INFO.name}</h2>
          <p className="section-subtitle">
            Dedicated General, Laparoscopic, Colorectal & Liver Surgeon combining academic rigor with patient-first compassion.
          </p>
        </div>

        {/* Two-Column Bio and Credentials */}
        <div className="about-grid">
          
          {/* Left: Detailed Story */}
          <div className="about-bio-card">
            <h3 className="bio-title">Dedicated to Surgical Precision & Healing</h3>
            <p className="bio-paragraph">
              <strong>{DOCTOR_INFO.name}</strong> ({DOCTOR_INFO.banglaName}) serves as an <strong>{DOCTOR_INFO.title}</strong> in the Department of Surgery at <strong>{DOCTOR_INFO.currentInstitution}</strong>. With rigorous residency training completed at <strong>{DOCTOR_INFO.formerInstitution}</strong> and prestigious fellowship certification from the <strong>Bangladesh College of Physicians and Surgeons (BCPS)</strong>, Dr. Saddam brings over a decade of clinical excellence to every patient interaction.
            </p>
            <p className="bio-paragraph">
              His clinical focus spans advanced laparoscopic procedures for gallbladder stones and abdominal hernias, modern colorectal surgery including painless stapled and laser procedures for piles, fissures, and fistulae, as well as complex liver and emergency surgical interventions.
            </p>
            <p className="bio-paragraph">
              To bring apex tertiary surgical care closer to regional communities, Dr. Saddam visits <strong>{DOCTOR_INFO.chamber.hospitalName}</strong> in Ashuganj, Brahmanbaria <strong>every Thursday from 2:00 PM to 8:00 PM</strong>.
            </p>

            <div className="bio-actions">
              <a 
                href="/assets/cv.pdf" 
                download="Dr-Md-Jubayear-Ahmed-Saddam-CV.pdf"
                className="btn btn-primary"
              >
                <FileText size={17} />
                <span>Download Curriculum Vitae (PDF)</span>
              </a>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onOpenAppointment}
              >
                <Calendar size={17} />
                <span>Consult on Thursday</span>
              </button>
            </div>
          </div>

          {/* Right: Academic Qualifications Timeline */}
          <div className="about-credentials-box">
            <h3 className="credentials-heading">
              <Award size={20} className="cred-icon" />
              <span>Academic Degrees & Certifications</span>
            </h3>

            <div className="credentials-timeline">
              {DOCTOR_INFO.credentials.map((cred, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h4 className="timeline-degree">{cred.degree}</h4>
                      <span className="timeline-badge">{cred.year}</span>
                    </div>
                    <span className="timeline-inst">{cred.institution}</span>
                    <p className="timeline-desc">{cred.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Why Consult 4 Cards */}
        <div className="why-section">
          <h3 className="why-main-title">Why Patients Choose Dr. Saddam</h3>
          <div className="why-grid">
            {whyPoints.map((pt, i) => (
              <div key={i} className="why-card">
                <div className="why-icon-box">
                  {pt.icon}
                </div>
                <h4 className="why-card-title">{pt.title}</h4>
                <p className="why-card-desc">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
