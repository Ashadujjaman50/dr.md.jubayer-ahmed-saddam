import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Tag, 
  Sparkles,
  Maximize2,
  Image as ImageIcon,
  Play,
  Video
} from 'lucide-react';
import { GALLERY_CATEGORIES, getSortedGalleryItems } from '../data/galleryData';
import { getSortedVideoItems } from '../data/videoData';
import './Gallery.css';

export default function Gallery({ onNavigate, onOpenAppointment }) {
  // Gallery mode tab: 'photos' | 'videos'
  const [galleryTab, setGalleryTab] = useState('photos');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Video modal state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const videoPlayerRef = useRef(null);

  // Touch gesture state for mobile swipe navigation
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  // All photos sorted newest first
  const allSortedItems = getSortedGalleryItems();

  // All videos sorted newest first
  const allSortedVideos = getSortedVideoItems();

  // Filtered photos based on active tab
  const filteredItems = selectedCategory === 'All'
    ? allSortedItems
    : allSortedItems.filter((item) => item.category === selectedCategory);

  // Lock body scroll when photo lightbox or video modal is active
  useEffect(() => {
    if (lightboxOpen || videoModalOpen) {
      document.body.classList.add('lightbox-open');
    } else {
      document.body.classList.remove('lightbox-open');
    }
    return () => {
      document.body.classList.remove('lightbox-open');
      if (videoPlayerRef.current) {
        videoPlayerRef.current.pause();
      }
    };
  }, [lightboxOpen, videoModalOpen]);

  // Reset active lightbox index when category filter changes to prevent out-of-range index
  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedCategory]);

  // Tab switch handler: pauses any active video and stops modal
  const handleTabSwitch = (tab) => {
    if (tab === galleryTab) return;
    if (galleryTab === 'videos' && videoPlayerRef.current) {
      videoPlayerRef.current.pause();
    }
    if (videoModalOpen) {
      closeVideoModal();
    }
    setGalleryTab(tab);
  };

  // Keyboard navigation for Lightbox & Video Modal (Left, Right, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (videoModalOpen) {
          closeVideoModal();
        } else if (lightboxOpen) {
          closeLightbox();
        }
      } else if (lightboxOpen && !videoModalOpen) {
        if (e.key === 'ArrowRight') {
          goToNext();
        } else if (e.key === 'ArrowLeft') {
          goToPrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, videoModalOpen, filteredItems.length]);

  const openLightbox = (index) => {
    const safeIndex = (index >= 0 && index < filteredItems.length) ? index : 0;
    setActiveImageIndex(safeIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    if (!filteredItems.length) return;
    setActiveImageIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const goToPrev = () => {
    if (!filteredItems.length) return;
    setActiveImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  // Video Modal Handlers
  const openVideoModal = (video) => {
    setActiveVideo(video);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
    }
    setVideoModalOpen(false);
    setActiveVideo(null);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Trigger swipe only if horizontal movement exceeds 45px and dominates vertical movement
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        goToNext(); // Swiped left -> next
      } else {
        goToPrev(); // Swiped right -> prev
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Latest image (newest uploaded item)
  const latestItem = allSortedItems.length > 0 ? allSortedItems[0] : null;

  // Active item in lightbox
  const currentItem = filteredItems[activeImageIndex] || null;

  return (
    <div className="gallery-page">
      {/* Top Navigation & Breadcrumb */}
      <div className="gallery-topbar">
        <div className="container gallery-topbar-container">
          <button
            type="button"
            className="gallery-back-btn"
            onClick={() => onNavigate('/')}
            aria-label="Back to Home"
            title="Back to Home"
          >
            <ArrowLeft size={18} />
            <span className="gallery-back-text">Back to Home</span>
          </button>
        </div>
      </div>

      <div className="container gallery-container">
        {/* Page Header */}
        <header className="gallery-header">
          <span className="section-tag">
            {galleryTab === 'photos' ? 'PHOTO GALLERY' : 'VIDEO GALLERY'}
          </span>
          <h1 className="section-title">
            {galleryTab === 'photos' 
              ? 'Moments of Care & Professional Journey' 
              : 'Videos & Professional Moments'}
          </h1>
          <p className="section-subtitle">
            {galleryTab === 'photos'
              ? 'Explore professional moments, medical activities, achievements and memories of Dr. Md. Jubayear Ahmed Saddam.'
              : 'Watch professional moments, medical activities and informative videos of Dr. Md. Jubayear Ahmed Saddam.'}
          </p>
        </header>

        {/* Two-Tab Navigation: Photo Gallery | Video Gallery */}
        <div className="gallery-main-tabs" role="tablist" aria-label="Gallery Section Tabs">
          <button
            type="button"
            role="tab"
            aria-selected={galleryTab === 'photos'}
            className={`gallery-main-tab-btn ${galleryTab === 'photos' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('photos')}
          >
            <span className="tab-icon">📷</span>
            <span className="tab-text">Photo Gallery</span>
            <span className="tab-badge">{allSortedItems.length}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={galleryTab === 'videos'}
            className={`gallery-main-tab-btn ${galleryTab === 'videos' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('videos')}
          >
            <span className="tab-icon">▶</span>
            <span className="tab-text">Video Gallery</span>
            <span className="tab-badge">{allSortedVideos.length}</span>
          </button>
        </div>

        {/* TAB 1: Photo Gallery Content */}
        {galleryTab === 'photos' && (
          <div className="tab-content-pane" role="tabpanel" aria-label="Photo Gallery Content">
            {/* Latest Activity Spotlight Banner */}
            {latestItem && selectedCategory === 'All' && (
              <div 
                className="gallery-spotlight-card"
                onClick={() => openLightbox(0)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(0)}
                aria-label={`View latest photo: ${latestItem.title}`}
              >
                <div className="spotlight-badge">
                  <Sparkles size={14} className="sparkle-icon" />
                  <span>Latest Medical Activity</span>
                </div>
                <div className="spotlight-content">
                  <div 
                    className="spotlight-image-box"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <img
                      src={latestItem.image}
                      alt={latestItem.title || 'Latest Activity'}
                      className="spotlight-img protected-gallery-image"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      loading="eager"
                    />
                    <div className="gallery-image-shield" aria-hidden="true" />
                    <div className="spotlight-hover-cue">
                      <Maximize2 size={20} />
                      <span>View Full Photo</span>
                    </div>
                  </div>
                  <div className="spotlight-text">
                    <div className="spotlight-meta">
                      <span className="gallery-cat-pill">
                        <Tag size={12} />
                        {latestItem.category}
                      </span>
                      {latestItem.uploadedAt && (
                        <span className="gallery-date-pill">
                          <Calendar size={12} />
                          {formatDate(latestItem.uploadedAt)}
                        </span>
                      )}
                    </div>
                    <h2 className="spotlight-title">{latestItem.title}</h2>
                    {latestItem.description && (
                      <p className="spotlight-desc">{latestItem.description}</p>
                    )}
                    <div className="spotlight-footer">
                      <span className="spotlight-click-hint">
                        Click to inspect in high-definition viewer →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Filter Tabs */}
            <div className="gallery-filter-bar" role="tablist" aria-label="Gallery Categories">
              {GALLERY_CATEGORIES.map((cat) => {
                const count = cat === 'All' 
                  ? allSortedItems.length 
                  : allSortedItems.filter((i) => i.category === cat).length;
                
                // Only show categories that have items, plus 'All'
                if (cat !== 'All' && count === 0) return null;

                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`gallery-filter-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span>{cat}</span>
                    <span className="filter-count">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Gallery Grid */}
            <div className="gallery-grid" role="region" aria-label="Photo Grid">
              {filteredItems.map((item, index) => (
                <article
                  key={item.id || index}
                  className="gallery-card"
                  onClick={() => openLightbox(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                  aria-label={`Open photo: ${item.title}`}
                >
                  <div 
                    className="gallery-card-media"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <img
                      src={item.image}
                      alt={item.title || 'Doctor Gallery Photo'}
                      className="gallery-card-img protected-gallery-image"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      loading="lazy"
                    />
                    {/* Transparent protective shield intercepts drag and right-click */}
                    <div className="gallery-image-shield" aria-hidden="true" />
                    
                    {/* Subtle Hover Overlay */}
                    <div className="gallery-card-overlay">
                      <div className="overlay-icon-wrap">
                        <Maximize2 size={20} />
                      </div>
                      <span className="overlay-label">Enlarge</span>
                    </div>

                    {/* Category Pill Over Media */}
                    <span className="media-cat-badge">
                      {item.category}
                    </span>
                  </div>

                  <div className="gallery-card-body">
                    <div className="card-meta-row">
                      {item.uploadedAt && (
                        <span className="card-date">
                          <Calendar size={13} />
                          {formatDate(item.uploadedAt)}
                        </span>
                      )}
                      <span className="card-item-num">#{index + 1}</span>
                    </div>

                    <h3 className="gallery-card-title">{item.title}</h3>

                    {item.description && (
                      <p className="gallery-card-desc">{item.description}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Empty State fallback */}
            {filteredItems.length === 0 && (
              <div className="gallery-empty-state">
                <ImageIcon size={48} className="empty-icon" />
                <h3>No Photos in This Category</h3>
                <p>Please select another category or view all gallery moments.</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedCategory('All')}
                >
                  View All Photos
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Video Gallery Content */}
        {galleryTab === 'videos' && (
          <div className="tab-content-pane" role="tabpanel" aria-label="Video Gallery Content">
            {/* Video Cards Grid */}
            <div className="video-grid" role="region" aria-label="Video Gallery Grid">
              {allSortedVideos.map((video) => (
                <article
                  key={video.id}
                  className="video-card"
                  onClick={() => openVideoModal(video)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openVideoModal(video)}
                  aria-label={`Play video: ${video.title}`}
                >
                  <div 
                    className="video-card-media"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="video-card-poster protected-gallery-image"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      loading="lazy"
                    />
                    {/* Subtle dark gradient overlay */}
                    <div className="video-media-gradient" />

                    {/* Play Button Overlay */}
                    <div className="video-play-badge">
                      <Play size={24} className="play-icon-symbol" />
                    </div>

                    {/* Duration Badge */}
                    {video.duration && (
                      <span className="video-duration-pill">
                        {video.duration}
                      </span>
                    )}

                    {/* Category Pill */}
                    <span className="video-cat-badge">
                      {video.category}
                    </span>
                  </div>

                  <div className="video-card-body">
                    <div className="card-meta-row">
                      {video.uploadedAt && (
                        <span className="card-date">
                          <Calendar size={13} />
                          {formatDate(video.uploadedAt)}
                        </span>
                      )}
                      <span className="card-badge-video">
                        <Video size={13} />
                        Video
                      </span>
                    </div>

                    <h3 className="video-card-title">{video.title}</h3>

                    {video.description && (
                      <p className="video-card-desc">{video.description}</p>
                    )}

                    <div className="video-card-footer">
                      <span className="watch-video-link">
                        <Play size={13} /> Watch Video
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {videoModalOpen && activeVideo && (
        <div
          className="video-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeVideoModal();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
        >
          <div className="video-modal-dialog">
            {/* Modal Header */}
            <div className="video-modal-header">
              <div className="video-modal-title-wrap">
                <span className="video-modal-cat">{activeVideo.category}</span>
                <h3 className="video-modal-title">{activeVideo.title}</h3>
              </div>
              <button
                type="button"
                className="video-modal-close-btn"
                onClick={closeVideoModal}
                aria-label="Close video player (Esc)"
                title="Close (Esc)"
              >
                <X size={22} />
              </button>
            </div>

            {/* Video Player Container */}
            <div 
              className="video-player-box"
              onContextMenu={(e) => e.preventDefault()}
            >
              <video
                ref={videoPlayerRef}
                src={activeVideo.video}
                poster={activeVideo.thumbnail}
                controls
                controlsList="nodownload"
                disablePictureInPicture
                playsInline
                autoPlay
                className="modal-video-element"
                onContextMenu={(e) => e.preventDefault()}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info / Caption */}
            {activeVideo.description && (
              <div className="video-modal-footer">
                <p className="video-modal-desc">{activeVideo.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox / High-Definition Image Viewer */}
      {lightboxOpen && currentItem && (
        <div
          className="lightbox-overlay"
          onClick={(e) => {
            // Close if clicking outside viewer content
            if (e.target === e.currentTarget) {
              closeLightbox();
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="High Definition Photo Viewer"
        >
          {/* Top Control Bar */}
          <div className="lightbox-topbar">
            <div className="lightbox-counter">
              <span className="counter-pill">
                {activeImageIndex + 1} of {filteredItems.length}
              </span>
            </div>

            <button
              type="button"
              className="lightbox-close-btn"
              onClick={closeLightbox}
              aria-label="Close photo viewer (Esc)"
              title="Close (Esc)"
            >
              <X size={24} />
            </button>
          </div>

          {/* Main Stage */}
          <div 
            className="lightbox-stage"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeLightbox();
              }
            }}
          >
            {/* Previous Button */}
            {filteredItems.length > 1 && (
              <button
                type="button"
                className="lightbox-nav-btn prev-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                aria-label="Previous photo"
                title="Previous (Left Arrow)"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Display Image with Protection */}
            <div 
              className="lightbox-image-wrapper"
              onContextMenu={(e) => e.preventDefault()}
            >
              <img
                src={currentItem.image}
                alt={currentItem.title || 'High Definition Photo'}
                className="lightbox-img protected-gallery-image"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
              {/* Invisible Shield against right-click drag-save */}
              <div className="gallery-image-shield" aria-hidden="true" />
            </div>

            {/* Next Button */}
            {filteredItems.length > 1 && (
              <button
                type="button"
                className="lightbox-nav-btn next-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next photo"
                title="Next (Right Arrow)"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>

          {/* Bottom Caption Bar */}
          <div className="lightbox-caption-bar">
            <div className="caption-container">
              <div className="caption-meta">
                <span className="caption-category">{currentItem.category}</span>
                {currentItem.uploadedAt && (
                  <span className="caption-date">
                    <Calendar size={13} />
                    {formatDate(currentItem.uploadedAt)}
                  </span>
                )}
              </div>
              <h2 className="caption-title">{currentItem.title}</h2>
              {currentItem.description && (
                <p className="caption-desc">{currentItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

