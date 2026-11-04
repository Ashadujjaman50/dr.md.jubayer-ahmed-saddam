import React from 'react';
import { AlertTriangle, RefreshCw, Phone } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Antigravity Caught Error in Component Tree:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          backgroundColor: '#F8FAFC',
          fontFamily: 'Inter, sans-serif',
          color: '#0F172A'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
            textAlign: 'center',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0F172A' }}>
              Temporary Clinical Page Notice
            </h2>

            <p style={{ fontSize: '0.925rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              The application encountered an unexpected display issue. Please reload the page or connect directly via the chamber hotlines below.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#0D9488',
                color: '#FFFFFF',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.925rem',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)'
              }}
            >
              <RefreshCw size={16} />
              <span>Reload Page</span>
            </button>

            <div style={{
              borderTop: '1px solid #E2E8F0',
              paddingTop: '1.25rem',
              textAlign: 'left'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                Emergency &amp; Chamber Contacts:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
                <span><strong>Dhaka (Health and Hope):</strong> <a href="tel:01841822442" style={{ color: '#0D9488', textDecoration: 'none' }}>01841-822442</a></span>
                <span><strong>Ashuganj (New Green Life):</strong> <a href="tel:01771358595" style={{ color: '#0D9488', textDecoration: 'none' }}>01771-358595</a>, <a href="tel:01308229576" style={{ color: '#0D9488', textDecoration: 'none' }}>01308-229576</a></span>
                <span><strong>Brahmanbaria (Labaid):</strong> <a href="tel:01766662233" style={{ color: '#0D9488', textDecoration: 'none' }}>01766-662233</a></span>
                <span><strong>WhatsApp:</strong> <a href={DOCTOR_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#059669', fontWeight: 600, textDecoration: 'none' }}>{DOCTOR_INFO.whatsapp}</a></span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

