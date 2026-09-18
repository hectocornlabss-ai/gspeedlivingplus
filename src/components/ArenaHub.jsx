import React, { useState, useEffect } from 'react';
import { 
  Trophy, Shield, Monitor, Coffee, Zap, Calendar, Users, 
  ArrowRight, Compass, Layers, Calculator, CheckCircle2, ChevronRight, Play, Check, Flame, X, Send,
  Search, PhoneCall, Image as ImageIcon, Newspaper, ExternalLink, Filter,
  Gamepad2, Gift, LayoutGrid, Award, Camera, Sparkles, Target, ChevronLeft, Maximize2, Crown, MapPin, Eye, Clock, Globe, Plus,
  Share2, Copy, Link as LinkIcon
} from 'lucide-react';
import { 
  VENUE_ZONES, TOURNAMENTS, GALLERY_ACTIVITIES, 
  EVENT_CATEGORIES, GAME_NEWS 
} from '../data/mockData';
import { useSiteData } from '../context/SiteDataContext';
import TournamentDetailModal from './TournamentDetailModal';
import ArenaSeatBookingModal from './ArenaSeatBookingModal';

// Helper functions for dynamic theme contrast & color overlays
function isColorDark(hexColor) {
  if (!hexColor || typeof hexColor !== 'string') return false;
  let c = hexColor.trim().replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length !== 6) return false;
  const r = parseInt(c.substr(0, 2), 16) || 0;
  const g = parseInt(c.substr(2, 2), 16) || 0;
  const b = parseInt(c.substr(4, 2), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 135;
}

function hexToRgba(hex, alpha = 1) {
  if (!hex || typeof hex !== 'string') return `rgba(15, 23, 42, ${alpha})`;
  let c = hex.trim().replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length !== 6) return `rgba(15, 23, 42, ${alpha})`;
  const r = parseInt(c.substr(0, 2), 16) || 0;
  const g = parseInt(c.substr(2, 2), 16) || 0;
  const b = parseInt(c.substr(4, 2), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ArenaHub({ 
  onNavigateFranchise, 
  initialTournamentSlug, 
  onSelectTournamentSlug, 
  onSelectActivitySlug,
  initialCategory = 'all',
  initialTag = 'all'
}) {
  const { siteData, updateTournament } = useSiteData();
  const heroData = siteData?.hero || {
    badge: 'GLP ESPORTS • ความสนุกสุดมันส์ ตลอด 24 ชม.',
    title: 'GLP ESPORT STADIUM MEETING\nศูนย์รวมกิจกรรม & ทัวร์นาเมนต์ระดับประเทศ',
    subtitle: 'สมรภูมิประลองเกมอันดับ 1 ของเกมเมอร์ชาวไทย เวทีแข่งขันมาตรฐานสากล รองรับทัวร์นาเมนต์ LAN ทุกเกม พร้อมโซนซ้อมสตรีมเมอร์ และบริการจัดกิจกรรมสำหรับค่ายเกมชั้นนำ',
    primaryCtaText: 'ชมภาพกิจกรรมทั้งหมด',
    secondaryCtaText: 'สมัครแข่งทัวร์นาเมนต์'
  };
  const tournamentsList = siteData?.tournaments || TOURNAMENTS;
  const galleryList = siteData?.gallery || GALLERY_ACTIVITIES;
  const newsList = siteData?.news || GAME_NEWS;
  const categories = siteData?.activityCategories || EVENT_CATEGORIES;

  // State for zone showcase
  const [activeZone, setActiveZone] = useState(VENUE_ZONES[0].id);

  // Search and Category Filter for Activities
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedTag, setSelectedTag] = useState(initialTag || 'all');

  // Sync initialCategory & initialTag props
  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialTag && initialTag !== selectedTag) {
      setSelectedTag(initialTag);
    }
  }, [initialTag]);

  // Modals state
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [tourneyModalTab, setTourneyModalTab] = useState('overview'); // 'overview', 'schedule', 'bracket', 'roster', 'gallery', 'register'

  // Arena Live Seat Booking Modal State
  const [isSeatBookingOpen, setIsSeatBookingOpen] = useState(false);
  const [bookingInitialZone, setBookingInitialZone] = useState('stage');

  // Sync initialTournamentSlug prop with selectedTournament modal
  useEffect(() => {
    if (initialTournamentSlug) {
      const match = tournamentsList.find(t => 
        (t.slug && t.slug.toLowerCase() === initialTournamentSlug.toLowerCase()) || 
        t.id === initialTournamentSlug ||
        (t.seo && t.seo.slug && t.seo.slug.toLowerCase() === initialTournamentSlug.toLowerCase())
      );
      if (match) {
        setSelectedTournament(match);
      }
    } else if (selectedTournament && !initialTournamentSlug) {
      setSelectedTournament(null);
    }
  }, [initialTournamentSlug, tournamentsList]);

  const handleOpenTournament = (tour, tab = 'overview') => {
    setSelectedTournament(tour);
    setTourneyModalTab(tab);
    if (onSelectTournamentSlug) {
      onSelectTournamentSlug(tour.slug || tour.id);
    }
  };

  const handleCloseTournament = () => {
    setSelectedTournament(null);
    if (onSelectTournamentSlug) {
      onSelectTournamentSlug(null);
    }
  };

  const currentZoneData = VENUE_ZONES.find(z => z.id === activeZone) || VENUE_ZONES[0];

  // Filtered gallery activities based on category, tag, and search
  const filteredActivities = galleryList.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchTag = selectedTag === 'all' || (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()));
    const matchSearch = !searchQuery.trim() || 
                        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.partner && item.partner.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchCategory && matchTag && matchSearch;
  });

  return (
    <div className="arena-hub-page">
      {/* 1. TOP ACTIVITY SEARCH & HOTLINE BAR */}
      <section className="activity-search-bar-section">
        <div className="container activity-search-container">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon text-blue" />
            <input 
              type="text" 
              placeholder="ค้นหากิจกรรม, ทัวร์นาเมนต์, ค่ายเกม หรือชื่อเกม (เช่น PUBG, Audition, Zone4)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="activity-search-input"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="activity-hotline-badge">
            <PhoneCall size={16} className="text-blue pulse-icon" />
            <span>สายด่วนจองเครื่อง & เวทีแข่ง:</span>
            <a href="tel:0637937704" className="hotline-phone-link">063-793-7704</a>
          </div>
        </div>
      </section>

      {/* 2. HERO BANNER: GLP ESPORT STADIUM MEETING */}
      {(() => {
        const heroBg = heroData.backgroundImage || heroData.bgOverlayImage;
        const overlayType = heroData.overlayType || 'light';
        const isDarkHero = Boolean(heroBg) 
          ? (overlayType === 'dark') 
          : (heroData.bgColor ? (heroData.bgColor === '#0b0f19' || heroData.bgColor === '#0f172a') : false);
        const opacity = heroData.overlayOpacity ?? (overlayType === 'light' ? 0.82 : (overlayType === 'soft' ? 0.35 : 0.75));

        let overlayGradient = 'none';
        if (heroBg && overlayType !== 'none') {
          if (overlayType === 'dark') {
            overlayGradient = `linear-gradient(180deg, rgba(11, 15, 25, ${opacity}) 0%, rgba(15, 23, 42, ${Math.min(1, opacity + 0.1)}) 100%)`;
          } else if (overlayType === 'soft') {
            overlayGradient = `linear-gradient(180deg, rgba(255, 255, 255, ${opacity}) 0%, rgba(241, 245, 249, ${Math.min(1, opacity + 0.1)}) 100%)`;
          } else {
            // 'light' default: Soft clean white frosted gradient to preserve original bright white look!
            overlayGradient = `linear-gradient(180deg, rgba(255, 255, 255, ${opacity}) 0%, rgba(255, 255, 255, ${Math.max(0.45, opacity - 0.18)}) 50%, rgba(248, 250, 252, ${Math.min(1, opacity + 0.12)}) 100%)`;
          }
        }

        return (
          <section 
            className={`hero-section ${heroBg ? 'has-bg-image' : ''} ${isDarkHero ? 'hero-dark-theme' : 'hero-light-theme'}`} 
            style={{ 
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: isDarkHero ? '#0b0f19' : (heroData.bgColor || '#ffffff'),
              backgroundImage: heroBg ? `url(${heroBg})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '85px 0 65px 0',
              transition: 'all 0.3s ease'
            }}
            aria-label={heroData.imageAlt || heroData.title || 'G-Speed Esport Arena'}
          >
            {/* Dynamic Background Overlay */}
            {heroBg && overlayType !== 'none' && (
              <div 
                className="hero-background-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: overlayGradient,
                  zIndex: 1,
                  pointerEvents: 'none',
                  transition: 'background 0.3s ease'
                }}
              />
            )}

            <div className="container hero-container" style={{ position: 'relative', zIndex: 2 }}>
              <div className="hero-content">
                <div 
                  className="badge-pill badge-blue hero-tag"
                  style={isDarkHero ? {
                    background: 'rgba(37, 99, 235, 0.25)',
                    borderColor: 'rgba(96, 165, 250, 0.45)',
                    color: '#93c5fd',
                    backdropFilter: 'blur(6px)'
                  } : {
                    background: 'rgba(37, 99, 235, 0.08)',
                    borderColor: 'rgba(37, 99, 235, 0.25)',
                    color: '#1d4ed8'
                  }}
                >
                  <span className="live-dot"></span>
                  <span>{heroData.badge}</span>
                </div>

                <h1 
                  className="hero-title" 
                  style={{ 
                    whiteSpace: 'pre-line',
                    color: isDarkHero ? '#ffffff' : (heroData.titleColor && heroData.titleColor !== '#ffffff' ? heroData.titleColor : '#0f172a'),
                    textShadow: isDarkHero ? '0 3px 16px rgba(0,0,0,0.75)' : 'none',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {heroData.title}
                </h1>

                <p 
                  className="hero-description"
                  style={{
                    color: isDarkHero ? '#e2e8f0' : (heroData.subtitleColor && heroData.subtitleColor !== '#ffffff' && heroData.subtitleColor !== '#e2e8f0' ? heroData.subtitleColor : '#475569'),
                    textShadow: isDarkHero ? '0 2px 8px rgba(0,0,0,0.6)' : 'none',
                    lineHeight: 1.75
                  }}
                >
                  {heroData.subtitle}
                </p>

                <div className="hero-cta-group">
                  <button 
                    id="btn-hero-live-seat-booking"
                    onClick={() => {
                      setBookingInitialZone('stage');
                      setIsSeatBookingOpen(true);
                    }} 
                    className="btn-primary cta-btn-large"
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                      boxShadow: '0 8px 24px rgba(2, 132, 199, 0.35)'
                    }}
                  >
                    <Gamepad2 size={18} />
                    <span>จองที่นั่ง Arena ล่วงหน้า (Live Booking)</span>
                  </button>

                  <button 
                    onClick={() => {
                      window.history.pushState(null, '', '/activities');
                      const el = document.getElementById('activities');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className="btn-secondary cta-btn-large"
                    style={isDarkHero ? {
                      background: 'rgba(255, 255, 255, 0.12)',
                      borderColor: 'rgba(255, 255, 255, 0.25)',
                      color: '#ffffff',
                      backdropFilter: 'blur(8px)'
                    } : {
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderColor: 'rgba(203, 213, 225, 0.9)',
                      color: '#1e293b'
                    }}
                  >
                    <span>{heroData.primaryCta || heroData.primaryCtaText || 'สำรวจกิจกรรม & ทัวร์นาเมนต์'}</span>
                    <ArrowRight size={18} />
                  </button>

                  <button 
                    id="btn-hero-navigate-franchise"
                    onClick={onNavigateFranchise} 
                    className="btn-secondary cta-btn-large"
                    style={isDarkHero ? {
                      background: 'rgba(255, 255, 255, 0.12)',
                      borderColor: 'rgba(255, 255, 255, 0.25)',
                      color: '#ffffff',
                      backdropFilter: 'blur(8px)'
                    } : {
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderColor: 'rgba(203, 213, 225, 0.9)',
                      color: '#1e293b'
                    }}
                  >
                    <Compass size={18} />
                    <span>{heroData.secondaryCta || heroData.secondaryCtaText || 'จำลองผังร้าน 3D แฟรนไชส์'}</span>
                  </button>
                </div>

                {/* Quick Metrics Bar: 4 columns on desktop / 2 columns on mobile */}
                <div 
                  className="hero-metrics-grid"
                  style={isDarkHero ? {
                    background: 'rgba(15, 23, 42, 0.78)',
                    borderColor: 'rgba(255, 255, 255, 0.16)',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(16px)'
                  } : {
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderColor: 'rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  {(heroData.metrics || [
                    { number: '750+', label: 'Battle Stations ทั่วประเทศ' },
                    { number: '360Hz', label: 'Fast-IPS & OLED Displays' },
                    { number: '10Gbps', label: 'Dedicated Multi-WAN Ping < 3ms' },
                    { number: '24/7', label: 'เปิดบริการตลอด 24 ชั่วโมง' }
                  ]).map((m, mIdx) => (
                    <div 
                      key={mIdx} 
                      className="metric-box"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none'
                      }}
                    >
                      <div className="metric-number" style={{ color: isDarkHero ? '#38bdf8' : '#1d4ed8' }}>{m.number}</div>
                      <div className="metric-label" style={{ color: isDarkHero ? '#cbd5e1' : '#64748b' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 3. DUAL FEATURE HIGHLIGHT CARDS (BLOG & NEWS vs OUR EVENTS) */}
      <section className="dual-feature-section">
        <div className="container">
          <div className="dual-cards-grid">
            {/* Left Card: OUR EVENTS */}
            <a 
              href={siteData?.featureBanners?.bannerLeft?.linkTarget || '#activities'} 
              className="feature-banner-card events-banner glass-panel"
              style={{ 
                background: siteData?.featureBanners?.bannerLeft?.image
                  ? `linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.88) 100%), url(${siteData.featureBanners.bannerLeft.image}) center/cover no-repeat`
                  : (siteData?.featureBanners?.bannerLeft?.bgGradient || 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)')
              }}
            >
              <div className="banner-content">
                <span className="badge-pill badge-blue">{siteData?.featureBanners?.bannerLeft?.badge || 'GLP OUR EVENTS'}</span>
                <h3 className="banner-title" style={{ color: '#ffffff' }}>
                  {siteData?.featureBanners?.bannerLeft?.title || 'รวมภาพกิจกรรม & บรรยากาศสด'}
                </h3>
                <p className="banner-desc" style={{ color: '#cbd5e1' }}>
                  {siteData?.featureBanners?.bannerLeft?.desc || 'ภาพงานแข่ง LAN, งานเปิดตัวเกม, มีตติ้ง และพิธีมอบรางวัลชนะเลิศตลอดทั้งปี'}
                </p>
                <div className="banner-link-row text-blue">
                  <span style={{ color: '#60a5fa' }}>{siteData?.featureBanners?.bannerLeft?.linkText || 'สำรวจอัลบั้มภาพกิจกรรม'}</span>
                  <ArrowRight size={18} color="#60a5fa" />
                </div>
              </div>
            </a>

            {/* Right Card: BLOG & NEWS */}
            <a 
              href={siteData?.featureBanners?.bannerRight?.linkTarget || '#news'} 
              className="feature-banner-card blog-banner glass-panel"
              style={{ 
                background: siteData?.featureBanners?.bannerRight?.image
                  ? `linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.88) 100%), url(${siteData.featureBanners.bannerRight.image}) center/cover no-repeat`
                  : (siteData?.featureBanners?.bannerRight?.bgGradient || 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)')
              }}
            >
              <div className="banner-content">
                <span className="badge-pill badge-white">{siteData?.featureBanners?.bannerRight?.badge || 'GLP BLOG & NEWS'}</span>
                <h3 className="banner-title" style={{ color: '#ffffff' }}>
                  {siteData?.featureBanners?.bannerRight?.title || 'บทความ ข่าวสาร & ไฮไลต์เกม'}
                </h3>
                <p className="banner-desc" style={{ color: '#cbd5e1' }}>
                  {siteData?.featureBanners?.bannerRight?.desc || 'เกาะติดผลการแข่งขัน ทริกการเล่น สเปกอุปกรณ์ใหม่ และประกาศจากทางร้าน'}
                </p>
                <div className="banner-link-row text-blue">
                  <span style={{ color: '#60a5fa' }}>{siteData?.featureBanners?.bannerRight?.linkText || 'อ่านบทความล่าสุด'}</span>
                  <ArrowRight size={18} color="#60a5fa" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 4. ACTIVITIES & COMMUNITY GALLERY (ภาพกิจกรรม) */}
      <section className="activities-gallery-section" id="activities">
        <div className="container">
          <div className="section-header-center">
            <div className="badge-pill badge-blue">
              <ImageIcon size={14} />
              <span>GLP PHOTO & COMMUNITY GALLERY</span>
            </div>
            <h2 className="section-title">
              ภาพกิจกรรม & <span className="text-blue">บรรยากาศความมันส์</span>
            </h2>
            <p className="section-subtitle max-w-700">
              ย้อนชมภาพความประทับใจ การประลองฝีมือของเหล่านักกีฬาอีสปอร์ต และงานอีเวนต์ร่วมกับค่ายเกมชั้นนำ ณ GLP Esports
            </p>

            {/* Category Filter Tabs */}
            <div className="category-filter-pills">
              {categories.map(cat => {
                let CategoryIcon = LayoutGrid;
                if (cat.id === 'tournament') CategoryIcon = Trophy;
                if (cat.id === 'publisher') CategoryIcon = Gamepad2;
                if (cat.id === 'community') CategoryIcon = Gift;
                if (cat.id === 'venue') CategoryIcon = Zap;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`cat-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  >
                    <CategoryIcon size={16} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Filter Summary Banner */}
            {(selectedCategory !== 'all' || selectedTag !== 'all' || searchQuery) && (
              <div className="hub-active-filters-summary glass-panel">
                <div className="summary-tags-group">
                  <span className="summary-title">กำลังกรองบทความ:</span>
                  {selectedCategory !== 'all' && (
                    <span className="summary-pill category">
                      หมวดหมู่: <strong>{categories.find(c => c.id === selectedCategory)?.label || selectedCategory}</strong>
                      <X size={12} className="btn-x-clear" onClick={() => setSelectedCategory('all')} />
                    </span>
                  )}
                  {selectedTag !== 'all' && (
                    <span className="summary-pill tag">
                      แท็ก: <strong>{selectedTag}</strong>
                      <X size={12} className="btn-x-clear" onClick={() => setSelectedTag('all')} />
                    </span>
                  )}
                  {searchQuery && (
                    <span className="summary-pill search">
                      คำค้น: "{searchQuery}"
                      <X size={12} className="btn-x-clear" onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                  <span className="summary-count">({filteredActivities.length} บทความ)</span>
                </div>
                <button 
                  type="button" 
                  className="btn-clear-all-filters"
                  onClick={() => { setSelectedCategory('all'); setSelectedTag('all'); setSearchQuery(''); }}
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            )}
          </div>

          {/* Activities Grid */}
          <div className="gallery-items-grid">
            {filteredActivities.length > 0 ? (
              filteredActivities.map(item => (
                <div 
                  key={item.id} 
                  className="gallery-card glass-panel clickable-article-card"
                  onClick={() => {
                    if (onSelectActivitySlug) {
                      onSelectActivitySlug(item.slug || item.id);
                    } else {
                      window.history.pushState(null, '', `/activities/${item.slug || item.id}`);
                    }
                  }}
                >
                  <div className="gallery-thumb-wrapper">
                    <img src={item.image} alt={item.imageAlt || item.title} className="gallery-thumb-img" />
                    <span className="gallery-tag-pill">{item.tag || item.category}</span>
                  </div>

                  <div className="gallery-info">
                    <div className="gallery-meta">
                      <span className="gallery-date">{item.date}</span>
                      <span className="gallery-partner">{item.partner}</span>
                    </div>
                    <h3 className="gallery-title">{item.title}</h3>
                    <p className="gallery-desc">{item.desc}</p>

                    <div className="gallery-view-link text-blue">
                      <span>อ่านบทความ & ชมภาพกิจกรรมเต็ม</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events-found glass-panel">
                <Search size={32} className="text-muted" />
                <h3>ไม่พบกิจกรรมที่ค้นหา</h3>
                <p>ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นเพื่อดูกิจกรรมที่น่าสนใจ</p>
                <button className="btn-secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedTag('all'); }}>
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. TOURNAMENTS & ACTIVITIES SCHEDULE */}
      {(() => {
        const tourBg = siteData?.tournamentsSection?.bgColor || '#ffffff';
        const isDarkTour = isColorDark(tourBg);
        return (
          <section 
            className="tournaments-section" 
            id="tournaments"
            style={{ 
              background: tourBg,
              backgroundColor: tourBg,
              backgroundImage: 'none'
            }}
          >
            <div className="container">
              <div className="section-header">
                <div className="badge-pill badge-amber">
                  <Flame size={14} />
                  <span>{siteData?.tournamentsSection?.badge || 'TOURNAMENTS & COMMUNITY EVENTS'}</span>
                </div>
                <h2 className="section-title" style={{ color: siteData?.tournamentsSection?.titleColor || (isDarkTour ? '#ffffff' : '#0f172a') }}>
                  {siteData?.tournamentsSection?.title || 'ปฏิทินการแข่งขัน อีสปอร์ตประจำเดือน'}
                </h2>
                <p className="section-subtitle" style={{ color: siteData?.tournamentsSection?.subtitleColor || (isDarkTour ? '#cbd5e1' : '#475569') }}>
                  {siteData?.tournamentsSection?.subtitle || 'ร่วมชิงเงินรางวัลรวมกว่าหลายแสนบาท พิสูจน์ฝีมือบนเวที LAN Final ถ่ายทอดสดสู่สายตาแฟนเกมทั่วประเทศ'}
                </p>
              </div>

              <div className="tournaments-grid">
                {tournamentsList.map((t) => {
                  const photoCount = (t.galleryPhotos || []).length;
                  const teamCount = (t.teams || []).length;
                  const isRegistrationOpen = t.status === 'Open';
                  return (
                    <div key={t.id} className="tournament-card">
                      {/* Banner Image with Overlays */}
                      <div className="t-banner-wrapper">
                        <img 
                          src={t.bannerImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'} 
                          alt={t.title} 
                          className="t-card-img"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="t-card-overlay" />
                        
                        <div className="t-banner-top">
                          {isRegistrationOpen ? (
                            <span className="badge-live-pulse">
                              <span className="live-ping-wrapper">
                                <span className="live-ping-ring" />
                                <span className="live-ping-core" />
                              </span>
                              <span>{t.badge || 'เปิดรับสมัครด่วน'}</span>
                            </span>
                          ) : (
                            <span className={`badge-pill badge-${t.badgeType === 'cyan' ? 'blue' : t.badgeType === 'magenta' ? 'white' : 'amber'}`} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                              {t.badge}
                            </span>
                          )}
                          {t.gameCategory && (
                            <span className="t-category-badge" title={t.gameCategory}>
                              {t.gameCategory}
                            </span>
                          )}
                        </div>

                        <div className="t-banner-bottom">
                          <span className="t-game-tag">
                            {t.game}
                          </span>
                          {photoCount > 0 && (
                            <span className="t-photo-pill">
                              <Camera size={12} /> {photoCount} ภาพ
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="t-card-body">
                        <div>
                          <h3 className="t-card-title" title={t.title}>
                            {t.title}
                          </h3>

                          {/* High-impact Prize Banner */}
                          <div className="t-prize-banner" style={{ marginTop: '14px' }}>
                            <div className="t-prize-label">
                              <Trophy size={16} className="text-amber" />
                              <span>เงินรางวัลรวม</span>
                            </div>
                            <div className="t-prize-amount">
                              {t.prizePool}
                            </div>
                          </div>

                          {/* Spec Details List */}
                          <div className="t-details-list" style={{ marginTop: '12px' }}>
                            <div className="t-detail-item">
                              <Calendar size={15} className="text-cyan" style={{ flexShrink: 0 }} />
                              <span><strong>วันที่:</strong> {t.date} ({t.time})</span>
                            </div>
                            <div className="t-detail-item">
                              <Users size={15} className="text-blue" style={{ flexShrink: 0 }} />
                              <span><strong>จำนวนทีม:</strong> {t.slots} ({teamCount} ทีมร่วมแข่ง)</span>
                            </div>
                            <div className="t-detail-item">
                              <Zap size={15} className="text-amber" style={{ flexShrink: 0 }} />
                              <span><strong>รูปแบบ:</strong> {t.format}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="t-card-footer">
                          <div className="t-action-pair">
                            <button 
                              type="button"
                              className="t-btn-secondary"
                              onClick={() => handleOpenTournament(t, 'gallery')}
                            >
                              <Camera size={14} />
                              <span>ภาพกิจกรรม ({photoCount})</span>
                            </button>
                            <button 
                              type="button"
                              className="t-btn-secondary"
                              onClick={() => handleOpenTournament(t, 'roster')}
                            >
                              <Users size={14} />
                              <span>รายชื่อทีม ({teamCount})</span>
                            </button>
                          </div>

                          {t.status === 'Open' ? (
                            <div className="t-action-open-grid">
                              <button 
                                id={`btn-reg-${t.id}`}
                                className="t-btn-register"
                                onClick={() => handleOpenTournament(t, 'register')}
                              >
                                <Zap size={16} className="text-amber-300" style={{ filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))' }} />
                                <span>สมัครแข่ง</span>
                                <ArrowRight size={17} className="btn-arrow-icon" />
                              </button>
                              <button
                                className="t-btn-bracket-split"
                                title="ดูสายการแข่งขัน & สกอร์สด"
                                onClick={() => handleOpenTournament(t, 'bracket')}
                              >
                                <Trophy size={15} />
                                <span>สายแข่ง</span>
                              </button>
                            </div>
                          ) : t.status === 'Full' ? (
                            <button 
                              className="t-btn-full"
                              onClick={() => handleOpenTournament(t, 'bracket')}
                            >
                              <Trophy size={15} />
                              <span>ดูสายการแข่งขัน & สกอร์สด (Brackets)</span>
                            </button>
                          ) : (
                            <button 
                              className="t-btn-details"
                              onClick={() => handleOpenTournament(t, 'bracket')}
                            >
                              <span>ดูสายแข่ง & รายละเอียดการแข่งขัน</span>
                              <ArrowRight size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 6. VENUE ATMOSPHERE & SIGNATURE ZONES */}
      {(() => {
        const zonesBg = siteData?.zonesSection?.bgColor || '#f8fafc';
        const isDarkZones = isColorDark(zonesBg);
        return (
          <section 
            className="zones-section" 
            id="zones"
            style={{ 
              background: zonesBg,
              backgroundColor: zonesBg,
              backgroundImage: 'none'
            }}
          >
            <div className="container">
              <div className="section-header">
                <div className="badge-pill badge-white">
                  <Layers size={14} />
                  <span>{siteData?.zonesSection?.badge || 'VENUE ATMOSPHERE & ZONES'}</span>
                </div>
                <h2 className="section-title" style={{ color: siteData?.zonesSection?.titleColor || (isDarkZones ? '#ffffff' : '#0f172a') }}>
                  {siteData?.zonesSection?.title || 'บรรยากาศและโซนการให้บริการ GLP ESPORTS'}
                </h2>
                <p className="section-subtitle" style={{ color: siteData?.zonesSection?.subtitleColor || (isDarkZones ? '#cbd5e1' : '#475569') }}>
                  {siteData?.zonesSection?.subtitle || 'สัมผัสความพรีเมียมที่ออกแบบมาสำหรับเกมเมอร์ทุกสไตล์ ตั้งแต่ผู้เล่นทั่วไป สตรีมเมอร์ ไปจนถึงการประลองระดับแชมป์เปียนชิป'}
                </p>
              </div>

              {/* Zone Tabs */}
              <div className="zone-tabs-list">
                {(siteData?.venueZones || VENUE_ZONES).map((zone) => (
                  <button
                    key={zone.id}
                    id={`btn-zone-tab-${zone.id}`}
                    onClick={() => setActiveZone(zone.id)}
                    className={`zone-tab-btn ${activeZone === zone.id ? 'active' : ''}`}
                  >
                    {zone.id === 'stage' && <Trophy size={18} />}
                    {zone.id === 'vip' && <Shield size={18} />}
                    {zone.id === 'standard' && <Monitor size={18} />}
                    {zone.id === 'cafe' && <Coffee size={18} />}
                    <span>{zone.title}</span>
                  </button>
                ))}
              </div>

              {/* Active Zone Detail Showcase */}
              <div className="zone-showcase-panel glass-panel">
                <div className="zone-image-wrapper">
                  <img 
                    src={currentZoneData.image} 
                    alt={currentZoneData.title}
                    className="zone-feature-img" 
                  />
                  <div className="zone-badge-overlay">
                    <span className="badge-pill badge-blue">{currentZoneData.badge}</span>
                  </div>
                </div>

                <div className="zone-info-wrapper">
                  <div className="zone-sub">{currentZoneData.subtitle}</div>
                  <h3 className="zone-heading">{currentZoneData.title}</h3>
                  <p className="zone-desc">{currentZoneData.description}</p>

                  <div className="zone-specs-box">
                    <div className="specs-title">
                      <Zap size={16} className="text-blue" />
                      <span>จุดเด่นของโซนนี้:</span>
                    </div>
                    <div className="specs-grid">
                      {currentZoneData.specs.map((spec, idx) => (
                        <div key={idx} className="spec-item">
                          <CheckCircle2 size={16} className="text-blue" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="zone-action-bar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => {
                        setBookingInitialZone(currentZoneData.id);
                        setIsSeatBookingOpen(true);
                      }} 
                      className="btn-primary"
                      style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}
                    >
                      <Monitor size={16} />
                      <span>จองที่นั่งโซนนี้ล่วงหน้า (Live Booking)</span>
                    </button>
                    <button 
                      onClick={onNavigateFranchise} 
                      className="btn-secondary"
                    >
                      <Compass size={16} />
                      <span>ลองใส่โซนนี้ในผังร้านของคุณ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 7. GAME NEWS & ARTICLES (บทความและข่าวสาร) */}
      {(() => {
        const newsBg = siteData?.newsSection?.bgColor || '#ffffff';
        const isDarkNews = isColorDark(newsBg);
        return (
          <section 
            className="news-section" 
            id="news"
            style={{ 
              background: newsBg,
              backgroundColor: newsBg,
              backgroundImage: 'none'
            }}
          >
            <div className="container">
              <div className="section-header">
                <div className="badge-pill badge-blue">
                  <Newspaper size={14} />
                  <span>{siteData?.newsSection?.badge || 'ARTICLES & UPDATES'}</span>
                </div>
                <h2 className="section-title" style={{ color: siteData?.newsSection?.titleColor || (isDarkNews ? '#ffffff' : '#0f172a') }}>
                  {siteData?.newsSection?.title || 'บทความและข่าวสาร GLP ESPORTS'}
                </h2>
                <p className="section-subtitle" style={{ color: siteData?.newsSection?.subtitleColor || (isDarkNews ? '#cbd5e1' : '#475569') }}>
                  {siteData?.newsSection?.subtitle || 'อัปเดตความเคลื่อนไหววงการอีสปอร์ต เทคโนโลยีใหม่ และสรุปผลการแข่งขันที่จัดขึ้นในร้าน'}
                </p>
              </div>

              <div className="news-grid">
                {newsList.map(news => (
                  <div 
                    key={news.id} 
                    className="news-card glass-panel clickable-article-card"
                    onClick={() => {
                      if (onSelectActivitySlug) {
                        onSelectActivitySlug(news.slug || news.id);
                      } else {
                        window.history.pushState(null, '', `/activities/${news.slug || news.id}`);
                      }
                    }}
                  >
                    <div className="news-thumb-wrapper">
                      <img src={news.image} alt={news.imageAlt || news.title} className="news-img" />
                      <span className="news-cat-pill">{news.tag || news.category}</span>
                    </div>
                    <div className="news-body">
                      <div className="news-meta">
                        <span>{news.date}</span>
                        <span>•</span>
                        <span>อ่าน {news.readTime}</span>
                      </div>
                      <h3 className="news-title">{news.title}</h3>
                      <p className="news-excerpt">{news.excerpt || news.desc}</p>
                      <div className="news-read-more-link text-blue">
                        <span>อ่านบทความเต็ม</span>
                        <ExternalLink size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 8. FRANCHISE CTA SECTION */}
      {(() => {
        const fBg = siteData?.franchiseBanner?.bgColor || '#1e3a8a';
        const fImg = siteData?.franchiseBanner?.bgImage;
        const isDarkF = isColorDark(fBg);
        const cardBg = fImg
          ? `linear-gradient(180deg, ${hexToRgba(fBg, 0.70)} 0%, ${hexToRgba(fBg, 0.92)} 100%), url(${fImg}) center/cover no-repeat`
          : fBg;

        return (
          <section className="franchise-callout-section">
            <div className="container">
              <div 
                className="franchise-cta-card"
                style={{ 
                  background: cardBg,
                  backgroundColor: fBg,
                  backgroundImage: fImg ? undefined : 'none'
                }}
              >
                <div className="cta-content">
                  <div className="badge-pill badge-blue">
                    <Layers size={14} />
                    <span>{siteData?.franchiseBanner?.badge || 'G-SPEED FRANCHISE & INTERIOR PLANNER'}</span>
                  </div>
                  <h2 className="cta-heading" style={{ color: siteData?.franchiseBanner?.headingColor || siteData?.franchiseBanner?.titleColor || (isDarkF ? '#ffffff' : '#0f172a') }}>
                    {siteData?.franchiseBanner?.heading || 'อยากมีร้านเกมอีสปอร์ตสเปกเทพเป็นของตัวเอง?'}
                  </h2>
                  <p className="cta-desc" style={{ color: siteData?.franchiseBanner?.descColor || siteData?.franchiseBanner?.textColor || (isDarkF ? '#bfdbfe' : '#475569') }}>
                    {siteData?.franchiseBanner?.desc || 'เพียงแค่คุณมีพื้นที่หรืออาคาร เรามีระบบ Interior Floor Plan Configurator ช่วยจำลองผังร้าน 2D สเกลจริง จัดวางโต๊ะคอมพิวเตอร์ เวทีแข่งขัน เคาน์เตอร์ และคำนวณต้นทุน สเปกอุปกรณ์ ระยะเวลาคืนทุน (ROI) และเวลาติดตั้งให้ทันที!'}
                  </p>
                  <div className="cta-buttons">
                    <button 
                      id="btn-hero-interior-start"
                      onClick={onNavigateFranchise} 
                      className="btn-primary cta-btn-large"
                    >
                      <Compass size={18} />
                      <span>{siteData?.franchiseBanner?.buttonText || 'เริ่มออกแบบผังร้าน & ประเมินงบประมาณทันที'}</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* MODAL: GALLERY ITEM DETAIL (LIGHTBOX) */}
      {selectedGalleryItem && (
        <div className="modal-backdrop" onClick={() => setSelectedGalleryItem(null)}>
          <div className="modal-dialog modal-large glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge-pill badge-blue">{selectedGalleryItem.tag}</span>
                <h3 className="modal-title">{selectedGalleryItem.title}</h3>
              </div>
              <button className="btn-icon-close" onClick={() => setSelectedGalleryItem(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="gallery-modal-body">
              <div className="modal-img-frame">
                <img src={selectedGalleryItem.image} alt={selectedGalleryItem.imageAlt || selectedGalleryItem.title} className="modal-feature-img" />
              </div>
              <div className="modal-details-box">
                <div className="meta-row">
                  <div><strong>วันที่จัดกิจกรรม:</strong> {selectedGalleryItem.date}</div>
                  <div><strong>พาร์ตเนอร์ร่วมจัด:</strong> {selectedGalleryItem.partner}</div>
                </div>
                <p className="modal-full-desc">{selectedGalleryItem.desc}</p>
                <div className="modal-hotline-callout">
                  <PhoneCall size={18} className="text-blue" />
                  <span>สนใจเช่าสถานที่จัดกิจกรรม หรือจัดแข่งอีเวนต์แบบนี้ ติดต่อสายด่วน: <strong>063-793-7704</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          GRAND ESPORTS TOURNAMENT HUB MODAL (DEDICATED COMPONENT)
          ========================================================================= */}
      {selectedTournament && (
        <TournamentDetailModal
          tournament={selectedTournament}
          initialTab={tourneyModalTab}
          onClose={handleCloseTournament}
          onNavigateHome={() => {
            handleCloseTournament();
            window.history.pushState(null, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateTournaments={() => {
            handleCloseTournament();
            window.history.pushState(null, '', '/events');
            window.dispatchEvent(new PopStateEvent('popstate'));
            const el = document.getElementById('tournaments');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onRegisterTeam={(tournamentId, newTeam) => {
            const currentTourney = tournamentsList.find(t => t.id === tournamentId) || selectedTournament;
            const updatedTeams = [...(currentTourney.teams || []), newTeam];
            if (updateTournament) {
              updateTournament(tournamentId, { teams: updatedTeams });
            }
            setSelectedTournament({ ...currentTourney, teams: updatedTeams });
          }}
        />
      )}

      {/* Arena Live Seat Booking Modal */}
      <ArenaSeatBookingModal
        isOpen={isSeatBookingOpen}
        onClose={() => setIsSeatBookingOpen(false)}
        initialZoneId={bookingInitialZone}
      />
    </div>
  );
}
