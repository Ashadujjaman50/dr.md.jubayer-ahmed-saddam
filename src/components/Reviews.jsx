import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Star, Quote, ShieldCheck, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { DOCTOR_INFO } from '../data/doctorConfig';
import './Reviews.css';

export default function Reviews() {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cards = el.querySelectorAll('.review-card');
    if (cards.length > 0) {
      const containerLeft = el.getBoundingClientRect().left;
      let closestIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, idx) => {
        const cardRect = card.getBoundingClientRect();
        const distance = Math.abs(cardRect.left - containerLeft);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      });
      setActiveIndex(closestIndex);
    }
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);

    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [checkScrollState]);

  const handleScroll = (direction) => {
    const el = carouselRef.current;
    if (!el) return;

    const cards = el.querySelectorAll('.review-card');
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = 16;
    const scrollStep = cardWidth + gap;

    el.scrollBy({
      left: direction === 'left' ? -scrollStep : scrollStep,
      behavior: 'smooth'
    });
  };

  const scrollToIndex = (index) => {
    const el = carouselRef.current;
    if (!el) return;

    const cards = el.querySelectorAll('.review-card');
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

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

        {/* Reviews Carousel Wrapper */}
        <div className="reviews-carousel-wrapper">
          {/* Patient Testimonials Grid / Carousel */}
          <div className="reviews-grid" ref={carouselRef}>
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

          {/* Navigation Controls (Visible ONLY on Mobile & Tablet < 1024px) */}
          <div className="reviews-carousel-controls">
            <button
              type="button"
              className="carousel-nav-btn prev-btn"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous review"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="carousel-indicators" role="tablist" aria-label="Review pagination">
              {DOCTOR_INFO.reviews.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  className={`carousel-dot ${activeIndex === idx ? 'active' : ''}`}
                  onClick={() => scrollToIndex(idx)}
                  aria-label={`Go to review ${idx + 1}`}
                  aria-selected={activeIndex === idx}
                />
              ))}
            </div>

            <button
              type="button"
              className="carousel-nav-btn next-btn"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Next review"
            >
              <ChevronRight size={20} />
            </button>
          </div>
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
