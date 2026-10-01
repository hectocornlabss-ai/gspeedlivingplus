import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, Play, Pause, Maximize2, 
  Sparkles, Layers, Image as ImageIcon, X, Flame, Shield, Trophy,
  Gamepad2, ExternalLink
} from 'lucide-react';
import { getGameSlidesForTournament } from '../data/tournamentSlidesData';

export default function TournamentOverviewSlider({ tournament }) {
  const slides = getGameSlidesForTournament(tournament).slice(0, 20);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const autoPlayTimerRef = useRef(null);
  const AUTO_PLAY_INTERVAL = 3800; // 3.8 seconds per slide

  // Next / Previous navigation
  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleSelectSlide = (idx) => {
    setCurrentIndex(idx);
  };

  // Auto-play interval effect
  useEffect(() => {
    if (!isPlaying || isHovered || isLightboxOpen) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, isHovered, isLightboxOpen, handleNext]);

  // Touch Swipe handlers for mobile / tablet
  const minSwipeDistance = 45;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape' && isLightboxOpen) setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, isLightboxOpen]);

  const currentSlide = slides[currentIndex] || slides[0] || {};
  const gameTitle = tournament?.game || currentSlide.game || 'Esports Tournament';
  const gameCategory = tournament?.gameCategory || 'Official Tournament';

  return (
    <section className="tourney-overview-showcase-section" aria-label="ภาพบรรยากาศสมรภูมิและไฮไลต์เกม 16:9">
      {/* 1. Header Bar: Title, Game Tag, and 20-Slide Indicator */}
      <div className="tourney-showcase-header">
        <div className="showcase-header-left">
          <div className="showcase-game-pill">
            <span className="live-pulse-dot" />
            <Gamepad2 size={15} />
            <strong className="game-name-highlight">{gameTitle}</strong>
            <span className="game-cat-sep">•</span>
            <span className="game-cat-dim">{gameCategory}</span>
          </div>
          <h3 className="showcase-title-text">
            <span>ภาพบรรยากาศสมรภูมิ & ไฮไลต์การแข่งขัน</span>
            <span className="showcase-sub-badge">16:9 Cinematic Slideshow</span>
          </h3>
        </div>

        <div className="showcase-header-right">
          {/* Play/Pause Control */}
          <button 
            type="button"
            className={`btn-slider-ctrl-action ${isPlaying ? 'active' : ''}`}
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'หยุดเล่นสไลด์ชั่วคราว' : 'เล่นสไลด์อัตโนมัติ (ทุก 3.8 วินาที)'}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span className="ctrl-btn-text">{isPlaying ? 'กำลังสไลด์' : 'หยุดชั่วคราว'}</span>
          </button>

          {/* Slide Counter e.g. 01 / 20 */}
          <div className="showcase-counter-badge">
            <span className="counter-current">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="counter-sep">/</span>
            <span className="counter-total">{String(slides.length).padStart(2, '0')}</span>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            className="btn-slider-ctrl-action btn-expand-modal"
            onClick={() => setIsLightboxOpen(true)}
            title="ขยายดูภาพสไลด์ขนาดใหญ่เต็มหน้าจอ"
            aria-label="Expand fullscreen"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* 2. Main 16:9 Slideshow Viewport */}
      <div 
        className="tourney-16to9-viewport"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Animated Slide Image with Ken-Burns Zoom & Fade - Clicking anywhere opens Fullscreen Lightbox */}
        <div 
          className="tourney-slide-frame"
          onClick={() => setIsLightboxOpen(true)}
          style={{ cursor: 'pointer' }}
          title="คลิกหรือแตะที่รูปเพื่อขยายดูขนาดเต็ม (Full Screen)"
        >
          <img 
            key={currentSlide.id}
            src={currentSlide.url} 
            alt={`${gameTitle} - ${currentSlide.title}`}
            className="tourney-slide-img"
            loading="eager"
          />

          {/* Gradient Scrims: Dark gradient at top and rich dark gradient at bottom */}
          <div className="slide-top-gradient" />
          <div className="slide-bottom-gradient" />

          {/* Top Left Slide Floating Badge */}
          <div className="slide-floating-tag-badge">
            <Flame size={13} className="text-amber" />
            <span>{currentSlide.tag || 'ไฮไลต์เกม'}</span>
          </div>

          {/* Top Right Mini Counter Pill & Tap Hint */}
          <div className="slide-top-right-group">
            <div className="slide-mobile-tap-hint" title="แตะที่ภาพเพื่อขยายดูเต็มจอ">
              <Maximize2 size={11} />
              <span>แตะเพื่อขยาย</span>
            </div>
            <div className="slide-mini-counter-floating">
              <span>{currentIndex + 1} / {slides.length}</span>
            </div>
          </div>

          {/* Navigation Arrows with stopPropagation */}
          <button 
            type="button" 
            className="slider-nav-arrow arrow-left" 
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            title="ภาพก่อนหน้า (กดปุ่มลูกศรซ้ายได้)"
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>

          <button 
            type="button" 
            className="slider-nav-arrow arrow-right" 
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            title="ภาพถัดไป (กดปุ่มลูกศรขวาได้)"
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Bottom Caption Overlay */}
          <div className="slide-caption-container" onClick={(e) => e.stopPropagation()}>
            <div className="caption-text-block" onClick={() => setIsLightboxOpen(true)} style={{ cursor: 'pointer' }}>
              <span className="caption-tag-pill">{currentSlide.tag}</span>
              <h4 className="caption-main-title">{currentSlide.title}</h4>
              <p className="caption-subtitle">{currentSlide.subtitle}</p>
            </div>
            
            <div className="caption-action-block">
              <button 
                type="button"
                className="btn-caption-expand"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                title="คลิกเพื่อขยายดูภาพแบบคมชัด Full Screen"
              >
                <Maximize2 size={13} />
                <span>ขยายภาพ</span>
              </button>
            </div>
          </div>

          {/* Continuous Auto-slide Progress Bar at Bottom of 16:9 Frame */}
          {isPlaying && !isHovered && (
            <div className="slider-progress-bar-track">
              <div 
                key={currentIndex}
                className="slider-progress-bar-fill" 
                style={{ animationDuration: `${AUTO_PLAY_INTERVAL}ms` }}
              />
            </div>
          )}
        </div>

        {/* 20 Dot Indicators Overlaid on Bottom Center */}
        <div className="slider-dot-indicators-bar" role="tablist">
          {slides.map((s, idx) => (
            <button
              key={s.id || idx}
              type="button"
              className={`slider-dot-pill ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => handleSelectSlide(idx)}
              title={`ไปที่ภาพที่ ${idx + 1}: ${s.title}`}
              aria-label={`Slide ${idx + 1}`}
              aria-selected={idx === currentIndex}
            >
              <span className="dot-inner" />
            </button>
          ))}
        </div>
      </div>

      {/* 3. Horizontal Scrollable 16:9 Mini Thumbnail Strip (Jump directly to any of the 20 slides) */}
      <div className="tourney-thumbnail-strip-wrapper">
        <div className="thumbnail-strip-header">
          <span className="thumb-strip-lbl">
            <Layers size={13} className="text-blue" />
            <span>สารบัญ 20 ภาพสไลด์บรรยากาศ & ไฮไลต์ (คลิกเพื่อเลือกภาพ)</span>
          </span>
          <span className="thumb-strip-hint">เลื่อนซ้าย-ขวาเพื่อเลือกดูได้ทุกรูป</span>
        </div>

        <div className="tourney-thumbnail-scrollable">
          {slides.map((s, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={s.id || idx}
                type="button"
                className={`thumb-preview-card ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectSlide(idx)}
                title={`ภาพที่ ${idx + 1}: ${s.title}`}
              >
                <div className="thumb-img-box">
                  <img src={s.url} alt={s.title} loading="lazy" />
                  <span className="thumb-idx-badge">#{idx + 1}</span>
                  {isActive && <span className="thumb-active-dot" />}
                </div>
                <span className="thumb-name-trunc">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Fullscreen Lightbox Modal (When user clicks expand or slide) */}
      {isLightboxOpen && (
        <div 
          className="slider-lightbox-backdrop" 
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="lightbox-content-box" onClick={e => e.stopPropagation()}>
            <div className="lightbox-top-bar">
              <div className="lightbox-title-meta">
                <span className="lightbox-badge-game">{gameTitle}</span>
                <span className="lightbox-title-text">{currentSlide.title}</span>
                <span className="lightbox-counter-pill">{currentIndex + 1} / {slides.length}</span>
              </div>
              <button 
                type="button" 
                className="btn-lightbox-close"
                onClick={() => setIsLightboxOpen(false)}
                title="ปิด (ESC)"
              >
                <X size={20} />
              </button>
            </div>

            <div className="lightbox-img-viewport">
              <img 
                src={currentSlide.url} 
                alt={currentSlide.title} 
                className="lightbox-main-img" 
              />

              <button 
                type="button" 
                className="lightbox-arrow arrow-left" 
                onClick={handlePrev}
                title="ภาพก่อนหน้า"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                type="button" 
                className="lightbox-arrow arrow-right" 
                onClick={handleNext}
                title="ภาพถัดไป"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            <div className="lightbox-caption-bar">
              <p className="lightbox-desc-text">{currentSlide.subtitle}</p>
              <div className="lightbox-thumb-strip">
                {slides.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    type="button"
                    className={`lightbox-mini-thumb ${idx === currentIndex ? 'active' : ''}`}
                    onClick={() => handleSelectSlide(idx)}
                  >
                    <img src={s.url} alt="" />
                    <span>#{idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
