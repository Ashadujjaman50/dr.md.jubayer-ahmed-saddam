import React from 'react';
import { X, ShieldAlert, FileText, Lock } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './Modal.css';

export default function LegalModal({ type, onClose }) {
  if (!type) return null;

  const getContent = () => {
    switch (type) {
      case 'disclaimer':
        return {
          title: 'Medical Disclaimer & Information Notice',
          icon: <ShieldAlert size={24} className="legal-icon" />,
          content: (
            <>
              <p>
                The information provided on this website is for general educational and informational purposes only regarding the clinical practice, academic credentials, and surgical chamber services of <strong>{DOCTOR_INFO.name}</strong>.
              </p>
              <p>
                Content on this website does not constitute formal medical diagnosis, treatment plans, or emergency healthcare services. Patients experiencing acute surgical emergencies (such as sudden severe abdominal pain, persistent vomiting, or gastrointestinal bleeding) should report immediately to the nearest hospital emergency department.
              </p>
              <p>
                A personalized surgical treatment plan can only be formulated following an in-person physical examination, thorough clinical history evaluation, and review of appropriate diagnostic tests and radiological imaging.
              </p>
            </>
          )
        };
      case 'privacy':
        return {
          title: 'Patient Privacy Policy',
          icon: <Lock size={24} className="legal-icon" />,
          content: (
            <>
              <p>
                We respect your personal and health privacy. Any information submitted through our website appointment request and inquiry preparation forms (including your name, phone number, and health concerns) is kept strictly confidential.
              </p>
              <p>
                Your contact details are used solely to assist with chamber appointment coordination, serial scheduling at New Green Life Hospital, and responding to your direct inquiries.
              </p>
              <p>
                We do not sell, rent, or share personal contact information with third-party advertising or commercial marketing entities.
              </p>
            </>
          )
        };
      case 'terms':
      default:
        return {
          title: 'Chamber Consultation Terms',
          icon: <FileText size={24} className="legal-icon" />,
          content: (
            <>
              <p>
                <strong>Visiting Day:</strong> Dr. Md. Jubayer Ahmed Saddam visits New Green Life Hospital, Ashuganj <strong>every Thursday from 2:00 PM to 8:00 PM</strong>.
              </p>
              <p>
                <strong>Serial Booking:</strong> Appointment serials are allocated on a prioritized booking basis. Advance booking through the serial hotline (<strong>{DOCTOR_INFO.chamber.phone}</strong>) or online request preparation helps reduce waiting times.
              </p>
              <p>
                <strong>Medical Records:</strong> Patients are kindly requested to bring all previous investigation reports, imaging films/CDs (Ultrasound, CT scan, Endoscopy), prescriptions, and medical records to their consultation.
              </p>
            </>
          )
        };
    }
  };

  const data = getContent();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog legal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title">{data.title}</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body legal-body">
          {data.content}
          <div className="modal-actions">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
