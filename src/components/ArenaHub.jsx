import React, { useState, useEffect } from 'react';
import { 
  Trophy, Shield, Monitor, Coffee, Zap, Calendar, Users, 
  ArrowRight, Compass, Layers, Calculator, CheckCircle2, ChevronRight, Play, Check, Flame, X, Send,
  Search, PhoneCall, Image as ImageIcon, Newspaper, ExternalLink, Filter,
  Gamepad2, Gift, LayoutGrid, Award, Camera, Sparkles, Target, ChevronLeft, Maximize2, Tag, Crown, MapPin, Eye, Clock, Globe, Plus,
  Share2, Copy, Link as LinkIcon
} from 'lucide-react';
import { 
  VENUE_ZONES, TOURNAMENTS, GALLERY_ACTIVITIES, 
  EVENT_CATEGORIES, GAME_NEWS 
} from '../data/mockData';
import { useSiteData } from '../context/SiteDataContext';

export default function ArenaHub({ 
  onNavigateFranchise, 
  initialTournamentSlug, 
  onSelectTournamentSlug, 
  onSelectActivitySlug 
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
  // State for zone showcase
  const [activeZone, setActiveZone] = useState(VENUE_ZONES[0].id);

  // Search & Category Filter for Activities
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [tourneyModalTab, setTourneyModalTab] = useState('overview'); // 'overview', 'schedule', 'roster', 'gallery', 'register'
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [tourneyGalleryCategory, setTourneyGalleryCategory] = useState('all');
  const [rosterSearch, setRosterSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

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
    setRegisterSuccess(false);
    if (onSelectTournamentSlug) {
      onSelectTournamentSlug(tour.slug || tour.id);
    }
  };

  const handleCloseTournament = () => {
    setSelectedTournament(null);
    setRegisterSuccess(false);
    setLightboxIndex(null);
    if (onSelectTournamentSlug) {
      onSelectTournamentSlug(null);
    }
  };

  // Form states
  const [teamRegForm, setTeamRegForm] = useState({
    teamName: '',
    teamTag: '',
    captainName: '',
    captainPhone: '',
    captainEmail: '',
    captainDiscord: '',
    player2: '',
    player3: '',
    player4: '',
    player5: '',
    substitute: ''
  });

  const currentZoneData = VENUE_ZONES.find(z => z.id === activeZone) || VENUE_ZONES[0];

  // Filtered gallery activities based on category and search
  const filteredActivities = galleryList.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.partner && item.partner.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!selectedTournament) return;
    
    const newTeam = {
      id: `team-${Date.now()}`,
      name: teamRegForm.teamName,
      tag: teamRegForm.teamTag || teamRegForm.teamName.slice(0, 3).toUpperCase(),
      logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
      seed: (selectedTournament.teams || []).length + 1,
      status: 'Confirmed',
      captain: `${teamRegForm.captainName} (กัปตันทีม)`,
      captainPhone: teamRegForm.captainPhone,
      captainDiscord: teamRegForm.captainDiscord,
      players: [
        teamRegForm.captainName,
        teamRegForm.player2 || 'Player 2',
        teamRegForm.player3 || 'Player 3',
        teamRegForm.player4 || 'Player 4',
        teamRegForm.player5 || 'Player 5'
      ],
      substitutes: teamRegForm.substitute ? [teamRegForm.substitute] : [],
      wins: 0,
      losses: 0
    };

    const updatedTeams = [...(selectedTournament.teams || []), newTeam];
    updateTournament(selectedTournament.id, { teams: updatedTeams });
    setSelectedTournament({ ...selectedTournament, teams: updatedTeams });
    setRegisterSuccess(true);
  };

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
        const isDarkHero = Boolean(heroBg) && heroData.overlayType !== 'light';
        const opacity = heroData.overlayOpacity ?? 0.82;

        return (
          <section 
            className={`hero-section ${heroBg ? 'has-bg-image' : ''} ${isDarkHero ? 'hero-dark-theme' : ''}`} 
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
          >
            {/* Dynamic Background Overlay */}
            {heroBg ? (
              <div 
                className="hero-background-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: isDarkHero
                    ? `linear-gradient(180deg, rgba(11, 15, 25, ${opacity}) 0%, rgba(15, 23, 42, ${Math.min(1, opacity + 0.08)}) 100%)`
                    : `linear-gradient(180deg, rgba(255, 255, 255, ${opacity}) 0%, rgba(241, 245, 249, ${Math.min(1, opacity + 0.08)}) 100%)`,
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
            ) : (
              <div className="hero-background-overlay"></div>
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
                  } : {}}
                >
                  <span className="live-dot"></span>
                  <span>{heroData.badge}</span>
                </div>

                <h1 
                  className="hero-title" 
                  style={{ 
                    whiteSpace: 'pre-line',
                    color: isDarkHero ? '#ffffff' : '#0f172a',
                    textShadow: isDarkHero ? '0 4px 20px rgba(0,0,0,0.85)' : 'none',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {heroData.title}
                </h1>

                <p 
                  className="hero-description"
                  style={{
                    color: isDarkHero ? '#e2e8f0' : '#475569',
                    textShadow: isDarkHero ? '0 2px 10px rgba(0,0,0,0.7)' : 'none',
                    lineHeight: 1.75
                  }}
                >
                  {heroData.subtitle}
                </p>

                <div className="hero-cta-group">
                  <button 
                    onClick={() => {
                      window.history.pushState(null, '', '/activities');
                      const el = document.getElementById('activities');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }} 
                    className="btn-primary"
                  >
                    <ImageIcon size={18} />
                    <span>{heroData.primaryCta || heroData.primaryCtaText || 'สำรวจกิจกรรม & ทัวร์นาเมนต์'}</span>
                  </button>
                  <button 
                    onClick={() => {
                      window.history.pushState(null, '', '/events');
                      const el = document.getElementById('tournaments');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }} 
                    className="btn-secondary"
                    style={isDarkHero ? {
                      background: 'rgba(255, 255, 255, 0.14)',
                      color: '#ffffff',
                      borderColor: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(6px)'
                    } : {}}
                  >
                    <Trophy size={18} />
                    <span>{heroData.secondaryCta || heroData.secondaryCtaText || 'จำลองผังร้าน 3D แฟรนไชส์'}</span>
                  </button>
                  <button onClick={onNavigateFranchise} className="btn-accent">
                    <Calculator size={18} />
                    <span>สนใจระบบแฟรนไชส์ / จัดผังร้าน</span>
                  </button>
                </div>

                {/* Quick Metrics Bar */}
                <div className="hero-metrics-grid">
                  {(heroData.metrics || [
                    { number: '750+', label: 'Battle Stations ทั่วประเทศ' },
                    { number: '360Hz', label: 'Fast-IPS & OLED Displays' },
                    { number: '10Gbps', label: 'Dedicated Multi-WAN Ping < 3ms' },
                    { number: '24/7', label: 'เปิดบริการตลอด 24 ชั่วโมง' }
                  ]).map((m, mIdx) => (
                    <div 
                      key={mIdx} 
                      className="metric-box"
                      style={isDarkHero ? {
                        background: 'rgba(15, 23, 42, 0.65)',
                        borderColor: 'rgba(255, 255, 255, 0.18)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
                      } : {}}
                    >
                      <div className="metric-number" style={{ color: isDarkHero ? '#38bdf8' : undefined }}>{m.number}</div>
                      <div className="metric-label" style={{ color: isDarkHero ? '#cbd5e1' : undefined }}>{m.label}</div>
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
                  : (siteData?.featureBanners?.bannerLeft?.bgGradient || 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)')
              }}
            >
              <div className="banner-content">
                <span className="badge-pill badge-blue">{siteData?.featureBanners?.bannerLeft?.badge || 'GLP OUR EVENTS'}</span>
                <h3 className="banner-title">{siteData?.featureBanners?.bannerLeft?.title || 'รวมภาพกิจกรรม & บรรยากาศสด'}</h3>
                <p className="banner-desc">
                  {siteData?.featureBanners?.bannerLeft?.desc || 'ภาพงานแข่ง LAN, งานเปิดตัวเกม, มีตติ้ง และพิธีมอบรางวัลชนะเลิศตลอดทั้งปี'}
                </p>
                <div className="banner-link-row text-blue">
                  <span>{siteData?.featureBanners?.bannerLeft?.linkText || 'สำรวจอัลบั้มภาพกิจกรรม'}</span>
                  <ArrowRight size={18} />
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
                  : (siteData?.featureBanners?.bannerRight?.bgGradient || 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)')
              }}
            >
              <div className="banner-content">
                <span className="badge-pill badge-white">{siteData?.featureBanners?.bannerRight?.badge || 'GLP BLOG & NEWS'}</span>
                <h3 className="banner-title">{siteData?.featureBanners?.bannerRight?.title || 'บทความ ข่าวสาร & ไฮไลต์เกม'}</h3>
                <p className="banner-desc">
                  {siteData?.featureBanners?.bannerRight?.desc || 'เกาะติดผลการแข่งขัน ทริกการเล่น สเปกอุปกรณ์ใหม่ และประกาศจากทางร้าน'}
                </p>
                <div className="banner-link-row text-blue">
                  <span>{siteData?.featureBanners?.bannerRight?.linkText || 'อ่านบทความล่าสุด'}</span>
                  <ArrowRight size={18} />
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
              {EVENT_CATEGORIES.map(cat => {
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
                    <span className="gallery-tag-pill">{item.tag}</span>
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
                <button className="btn-secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. TOURNAMENTS & ACTIVITIES SCHEDULE */}
      <section 
        className="tournaments-section" 
        id="tournaments"
        style={{ backgroundColor: siteData?.tournamentsSection?.bgColor || '#ffffff' }}
      >
        <div className="container">
          <div className="section-header">
            <div className="badge-pill badge-amber">
              <Flame size={14} />
              <span>{siteData?.tournamentsSection?.badge || 'TOURNAMENTS & COMMUNITY EVENTS'}</span>
            </div>
            <h2 className="section-title">
              {siteData?.tournamentsSection?.title || 'ปฏิทินการแข่งขัน อีสปอร์ตประจำเดือน'}
            </h2>
            <p className="section-subtitle">
              {siteData?.tournamentsSection?.subtitle || 'ร่วมชิงเงินรางวัลรวมกว่าหลายแสนบาท พิสูจน์ฝีมือบนเวที LAN Final ถ่ายทอดสดสู่สายตาแฟนเกมทั่วประเทศ'}
            </p>
          </div>

          <div className="tournaments-grid">
            {tournamentsList.map((t) => {
              const photoCount = (t.galleryPhotos || []).length;
              const teamCount = (t.teams || []).length;
              return (
                <div key={t.id} className="tournament-card glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
                  {t.bannerImage && (
                    <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>
                      <img 
                        src={t.bannerImage} 
                        alt={t.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 60%)' }} />
                      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                        <span className={`badge-pill badge-${t.badgeType === 'cyan' ? 'blue' : t.badgeType === 'magenta' ? 'white' : 'amber'}`}>
                          {t.badge}
                        </span>
                      </div>
                      <div style={{ position: 'absolute', bottom: '10px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span className="t-game-tag" style={{ background: 'rgba(255,255,255,0.92)', color: '#1d4ed8', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                          {t.game}
                        </span>
                        {photoCount > 0 && (
                          <span style={{ background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)' }}>
                            <Camera size={11} /> {photoCount} ภาพ
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{ padding: '20px 24px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {!t.bannerImage && (
                      <div className="t-card-header">
                        <span className={`badge-pill badge-${t.badgeType === 'cyan' ? 'blue' : t.badgeType === 'magenta' ? 'white' : 'amber'}`}>
                          {t.badge}
                        </span>
                        <span className="t-game-tag">{t.game}</span>
                      </div>
                    )}

                    <h3 className="t-card-title" style={{ marginTop: t.bannerImage ? 0 : '8px', fontSize: '1.15rem' }}>
                      {t.title}
                    </h3>

                    <div className="t-details-list" style={{ marginTop: '12px' }}>
                      <div className="t-detail-item">
                        <Calendar size={16} className="text-cyan" />
                        <span><strong>วันที่:</strong> {t.date} ({t.time})</span>
                      </div>
                      <div className="t-detail-item">
                        <Trophy size={16} className="text-amber" />
                        <span><strong>เงินรางวัลรวม:</strong> <span className="text-amber prize-text">{t.prizePool}</span></span>
                      </div>
                      <div className="t-detail-item">
                        <Users size={16} className="text-muted" />
                        <span><strong>จำนวนทีม:</strong> {t.slots} ({teamCount} ทีมร่วมแข่ง)</span>
                      </div>
                      <div className="t-detail-item">
                        <Zap size={16} className="text-muted" />
                        <span><strong>รูปแบบ:</strong> {t.format}</span>
                      </div>
                    </div>

                    <div className="t-card-footer" style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button 
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '8px 10px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                          onClick={() => handleOpenTournament(t, 'gallery')}
                        >
                          <Camera size={13} />
                          <span>ภาพกิจกรรม</span>
                        </button>
                        <button 
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '8px 10px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                          onClick={() => handleOpenTournament(t, 'roster')}
                        >
                          <Users size={13} />
                          <span>ดูรายชื่อทีม</span>
                        </button>
                      </div>

                      {t.status === 'Open' ? (
                        <button 
                          id={`btn-reg-${t.id}`}
                          className="btn-primary full-width"
                          onClick={() => handleOpenTournament(t, 'register')}
                        >
                          <span>สมัครเข้าร่วมแข่งขัน</span>
                          <ArrowRight size={16} />
                        </button>
                      ) : t.status === 'Full' ? (
                        <button 
                          className="btn-secondary full-width disabled-btn"
                          onClick={() => handleOpenTournament(t, 'roster')}
                        >
                          <span>ที่นั่งเต็มแล้ว (ดูรายชื่อทีม & ภาพ)</span>
                        </button>
                      ) : (
                        <button 
                          className="btn-secondary full-width"
                          onClick={() => handleOpenTournament(t, 'overview')}
                        >
                          <span>ติดตามรายละเอียดการแข่งขัน</span>
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

      {/* 6. VENUE ATMOSPHERE & SIGNATURE ZONES */}
      <section 
        className="zones-section" 
        id="zones"
        style={{ backgroundColor: siteData?.zonesSection?.bgColor || '#f8fafc' }}
      >
        <div className="container">
          <div className="section-header">
            <div className="badge-pill badge-white">
              <Layers size={14} />
              <span>{siteData?.zonesSection?.badge || 'VENUE ATMOSPHERE & ZONES'}</span>
            </div>
            <h2 className="section-title">
              {siteData?.zonesSection?.title || 'บรรยากาศและโซนการให้บริการ GLP ESPORTS'}
            </h2>
            <p className="section-subtitle">
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

              <div className="zone-action-bar">
                <button 
                  onClick={onNavigateFranchise} 
                  className="btn-primary"
                >
                  <Compass size={16} />
                  <span>ลองใส่โซนนี้ในผังร้านของคุณ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GAME NEWS & ARTICLES (บทความและข่าวสาร) */}
      <section 
        className="news-section" 
        id="news"
        style={{ backgroundColor: siteData?.newsSection?.bgColor || '#ffffff' }}
      >
        <div className="container">
          <div className="section-header">
            <div className="badge-pill badge-blue">
              <Newspaper size={14} />
              <span>{siteData?.newsSection?.badge || 'ARTICLES & UPDATES'}</span>
            </div>
            <h2 className="section-title">
              {siteData?.newsSection?.title || 'บทความและข่าวสาร GLP ESPORTS'}
            </h2>
            <p className="section-subtitle">
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

      {/* 8. FRANCHISE CTA SECTION */}
      <section className="franchise-callout-section">
        <div className="container">
          <div 
            className="franchise-cta-card"
            style={{ 
              backgroundColor: siteData?.franchiseBanner?.bgColor || '#1e3a8a',
              backgroundImage: siteData?.franchiseBanner?.bgImage ? `url(${siteData.franchiseBanner.bgImage})` : undefined
            }}
          >
            <div className="cta-content">
              <div className="badge-pill badge-blue">
                <Layers size={14} />
                <span>{siteData?.franchiseBanner?.badge || 'G-SPEED FRANCHISE & INTERIOR PLANNER'}</span>
              </div>
              <h2 className="cta-heading">
                {siteData?.franchiseBanner?.heading || 'อยากมีร้านเกมอีสปอร์ตสเปกเทพเป็นของตัวเอง?'}
              </h2>
              <p className="cta-desc">
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
          GRAND ESPORTS TOURNAMENT HUB MODAL (5 TABS & LIGHTBOX)
          Overview & Rules, Schedule & Dates, Rosters, 50+ Photos Gallery, Team Register
          ========================================================================= */}
      {selectedTournament && (
        <div 
          className="modal-backdrop" 
          onClick={handleCloseTournament}
          style={{ zIndex: 10010, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
        >
          <div 
            className="modal-dialog glass-panel tournament-hub-modal" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: '1040px', 
              width: '100%', 
              maxHeight: '92vh', 
              display: 'flex', 
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
            }}
          >
            {/* 1. Modal Hero Header */}
            <div 
              style={{ 
                position: 'relative', 
                minHeight: '160px', 
                background: selectedTournament.bannerImage 
                  ? `url(${selectedTournament.bannerImage}) center/cover no-repeat` 
                  : 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#ffffff'
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.65) 60%, rgba(15,23,42,0.4) 100%)' }} />
              
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="t-game-tag" style={{ background: '#ffffff', color: '#1d4ed8', fontWeight: 800, padding: '4px 12px', borderRadius: '6px', fontSize: '0.82rem' }}>
                    {selectedTournament.game}
                  </span>
                  {selectedTournament.gameCategory && (
                    <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem' }}>
                      {selectedTournament.gameCategory}
                    </span>
                  )}
                  <span className={`badge-pill badge-${selectedTournament.badgeType === 'cyan' ? 'blue' : selectedTournament.badgeType === 'magenta' ? 'white' : 'amber'}`}>
                    {selectedTournament.badge}
                  </span>
                </div>
                <button 
                  className="btn-icon-close" 
                  onClick={handleCloseTournament}
                  style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ position: 'relative', marginTop: '16px', zIndex: 1 }}>
                {/* Clean URL Breadcrumbs & Share Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)' }}>
                    <span>หน้าหลัก</span>
                    <span>/</span>
                    <span>การแข่งขัน & อีเวนต์</span>
                    <span>/</span>
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>{selectedTournament.game}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', background: 'rgba(0,0,0,0.45)', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <Globe size={12} className="text-cyan" />
                    <span style={{ fontFamily: 'monospace', color: '#93c5fd' }}>/events/{selectedTournament.slug || selectedTournament.id}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const cleanUrl = `${window.location.origin}/events/${selectedTournament.slug || selectedTournament.id}`;
                        navigator.clipboard.writeText(cleanUrl);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2500);
                      }}
                      style={{ background: copiedLink ? '#10b981' : 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '2px 8px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 600 }}
                      title="คัดลอก Clean URL สำหรับแชร์บน Facebook, LINE, Discord"
                    >
                      {copiedLink ? <Check size={11} /> : <Copy size={11} />}
                      <span>{copiedLink ? 'คัดลอกลิงก์แล้ว ✓' : 'คัดลอก Clean Link'}</span>
                    </button>
                  </div>
                </div>

                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 8px 0', textShadow: '0 2px 8px rgba(0,0,0,0.6)', color: '#ffffff' }}>
                  {selectedTournament.title}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Trophy size={16} className="text-amber" />
                    <span>เงินรางวัลรวม: <strong className="text-amber" style={{ fontSize: '0.95rem' }}>{selectedTournament.prizePool}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} className="text-cyan" />
                    <span>{selectedTournament.date} ({selectedTournament.time})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} className="text-blue" />
                    <span>{selectedTournament.venue || 'GLP : G Speed Living Plus รามคำแหง 53'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Modal Navigation Tabs */}
            <div 
              className="tourney-hub-nav" 
              style={{ 
                display: 'flex', 
                gap: '8px', 
                background: '#ffffff', 
                padding: '8px 20px', 
                borderBottom: '1px solid #e2e8f0', 
                overflowX: 'auto' 
              }}
            >
              {[
                { id: 'overview', label: 'ภาพรวม & กติกา & รางวัล', icon: <Award size={15} /> },
                { id: 'schedule', label: 'กำหนดการ & วันที่', icon: <Calendar size={15} /> },
                { id: 'roster', label: `รายชื่อทีม (${(selectedTournament.teams || []).length})`, icon: <Users size={15} /> },
                { id: 'gallery', label: `คลังภาพกิจกรรม (${(selectedTournament.galleryPhotos || []).length})`, icon: <Camera size={15} /> },
                { id: 'register', label: 'ลงทะเบียนแข่งขัน', icon: <Send size={15} />, highlight: true }
              ].map(tab => (
                <button 
                  key={tab.id}
                  type="button"
                  onClick={() => setTourneyModalTab(tab.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    border: 'none', 
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: tourneyModalTab === tab.id ? '#1d4ed8' : tab.highlight ? '#fef3c7' : 'transparent',
                    color: tourneyModalTab === tab.id ? '#ffffff' : tab.highlight ? '#b45309' : '#475569',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* 3. Modal Body Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' }}>
              
              {/* TAB 1: OVERVIEW & RULES */}
              {tourneyModalTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Story / Description */}
                  <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={18} className="text-blue" />
                      <span>เกี่ยวกับรายการแข่งขัน</span>
                    </h4>
                    <p style={{ margin: 0, lineHeight: 1.7, color: '#475569', fontSize: '0.92rem' }}>
                      {selectedTournament.desc || 'การแข่งขันอีสปอร์ตสุดยิ่งใหญ่ รวบรวมยอดฝีมือทั่วประเทศมาร่วมประลองความแม่นยำบนเวที LAN Final ณ GLP : G Speed Living Plus รามคำแหง 53 ชิงเงินรางวัลและถ้วยเกียรติยศ พร้อมถ่ายทอดสดด้วยโปรดักชันระดับสตูดิโอ'}
                    </p>
                  </div>

                  {/* Prize Distribution Podium */}
                  <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Trophy size={18} className="text-amber" />
                      <span>โครงสร้างเงินรางวัล (Prize Pool Distribution)</span>
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      {(selectedTournament.prizeDistribution || [
                        { rank: 'แชมป์อันดับ 1', reward: '฿50,000 + ถ้วยเกียรติยศ + เหรียญทอง' },
                        { rank: 'รองชนะเลิศอันดับ 1', reward: '฿25,000 + เหรียญเงิน' },
                        { rank: 'รองชนะเลิศอันดับ 2 ร่วม', reward: '฿10,000 ต่อทีม + เหรียญทองแดง' }
                      ]).map((pz, idx) => (
                        <div 
                          key={idx}
                          style={{ 
                            background: idx === 0 ? 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)' : '#f8fafc',
                            border: idx === 0 ? '1px solid #facc15' : '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}
                        >
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: idx === 0 ? '#854d0e' : '#64748b', textTransform: 'uppercase' }}>
                            {idx === 0 ? '🥇 อันดับที่ 1 (Champion)' : idx === 1 ? '🥈 อันดับที่ 2 (Runner-Up)' : `🎖️ ${pz.rank}`}
                          </span>
                          <strong style={{ fontSize: '1.05rem', color: idx === 0 ? '#713f12' : '#0f172a' }}>
                            {pz.reward}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hardware Specs Callout */}
                  <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', color: '#ffffff', padding: '18px 22px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span className="badge-pill badge-white" style={{ marginBottom: '6px' }}>OFFICIAL TOURNAMENT SPECS</span>
                      <h4 style={{ margin: '4px 0', fontSize: '1.05rem', color: '#ffffff' }}>มาตรฐานสนามแข่งขันระดับ World Class LAN Arena</h4>
                      <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                        Intel Core i9 • RTX 4080 SUPER • BenQ ZOWIE 360Hz Fast-IPS • 10Gbps Latency 0.5ms • Soundproof Booths
                      </span>
                    </div>
                    <button 
                      type="button" 
                      className="btn-primary" 
                      style={{ background: '#ffffff', color: '#1d4ed8' }}
                      onClick={() => setTourneyModalTab('register')}
                    >
                      <span>สมัครลงแข่งรอบนี้</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Official Rules Checklist */}
                  <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 14px 0', fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield size={18} className="text-blue" />
                      <span>กติกาและข้อบังคับอย่างเป็นทางการ (Official Tournament Rules)</span>
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(selectedTournament.rules || [
                        'ผู้เข้าแข่งขันทุกท่านต้องนำบัตรประชาชนหรือบัตรนักศึกษามาแสดงตน ณ จุดลงทะเบียน',
                        'อนุญาตให้นำเมาส์ คีย์บอร์ด และหูฟังส่วนตัวมาใช้ได้ โดยต้องผ่านการตรวจจากเจ้าหน้าที่เทคนิคก่อนเริ่มแข่ง',
                        'เครื่องคอมพิวเตอร์ที่ใช้แข่งขับเคลื่อนด้วย Intel Core i9 + NVIDIA GeForce RTX 4080 และจอ BenQ ZOWIE 360Hz',
                        'ห้ามใช้โปรแกรมโกง สคริปต์ช่วยเล่น หรือฉวยโอกาสจากข้อผิดพลาดของเกม หากตรวจพบปรับแพ้ทันที',
                        'คำตัดสินของหัวหน้าผู้ตัดสิน (Head Referee) ถือเป็นที่สิ้นสุดในทุกกรณี'
                      ]).map((rl, ridx) => (
                        <div key={ridx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <CheckCircle2 size={16} className="text-blue" style={{ marginTop: '3px', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>{rl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SCHEDULE & DATES */}
              {tourneyModalTab === 'schedule' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Timeline Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#ffffff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', marginBottom: '8px' }}>
                        <Clock size={16} />
                        <strong>ช่วงเวลารับสมัคร (Registration Period)</strong>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                        {selectedTournament.regStartDate || '1 กันยายน 2026'} - {selectedTournament.regEndDate || '25 กันยายน 2026'}
                      </div>
                      <span className="text-xs text-muted block" style={{ marginTop: '4px' }}>
                        รับสมัครจำนวนจำกัด {selectedTournament.slots} ปิดรับเมื่อเต็ม
                      </span>
                    </div>

                    <div style={{ background: '#ffffff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '8px' }}>
                        <Calendar size={16} />
                        <strong>วันแข่งขันจริง (Tournament Days)</strong>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                        {selectedTournament.date}
                      </div>
                      <span className="text-xs text-muted block" style={{ marginTop: '4px' }}>
                        เวลา {selectedTournament.time} @ {selectedTournament.venue || 'G-Speed Main Stage'}
                      </span>
                    </div>
                  </div>

                  {/* Match Timetable */}
                  <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={18} className="text-blue" />
                      <span>ตารางการแข่งขันรายรอบ (Match Timetable)</span>
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(selectedTournament.scheduleTimetable || [
                        { time: '10:00 - 11:00 น.', stage: 'ลงทะเบียนหน้างาน & ตรวจสอบอุปกรณ์นักกีฬา (Player Check-in & Gear Check)' },
                        { time: '11:15 - 14:00 น.', stage: 'รอบคัดเลือกแบ่งกลุ่ม Group Stage (Best of 1 - LAN Setup)' },
                        { time: '14:30 - 17:30 น.', stage: 'รอบ 8 ทีม และ 4 ทีมสุดท้าย (Quarter & Semi-Finals - Best of 3)' },
                        { time: '18:00 - 20:30 น.', stage: 'รอบชิงชนะเลิศ Grand Final บนเวที Main Stage (Best of 5 ถ่ายทอดสด)' }
                      ]).map((st, idx) => (
                        <div 
                          key={idx}
                          style={{ 
                            display: 'flex', 
                            gap: '16px', 
                            padding: '12px 16px', 
                            background: '#f8fafc', 
                            borderRadius: '8px', 
                            borderLeft: '4px solid #2563eb',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{ minWidth: '130px', fontWeight: 700, color: '#1d4ed8', fontSize: '0.9rem' }}>
                            {st.time}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>
                            {st.stage}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ROSTER & TEAMS */}
              {tourneyModalTab === 'roster' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Search and summary bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                        ทีมที่ได้รับการยืนยันสิทธิ์ ({(selectedTournament.teams || []).length} ทีม)
                      </strong>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ width: '220px', padding: '6px 12px', fontSize: '0.85rem' }}
                        placeholder="ค้นหาทีม หรือชื่อผู้เล่น..."
                        value={rosterSearch}
                        onChange={e => setRosterSearch(e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="btn-primary btn-sm"
                        onClick={() => setTourneyModalTab('register')}
                      >
                        <Plus size={14} /> สมัครทีมเพิ่ม
                      </button>
                    </div>
                  </div>

                  {/* Teams Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
                    {(selectedTournament.teams || [])
                      .filter(t => {
                        if (!rosterSearch) return true;
                        const q = rosterSearch.toLowerCase();
                        return (
                          t.name?.toLowerCase().includes(q) ||
                          t.tag?.toLowerCase().includes(q) ||
                          t.captain?.toLowerCase().includes(q) ||
                          (t.players || []).some(p => p.toLowerCase().includes(q))
                        );
                      })
                      .map((team, tidx) => (
                        <div 
                          key={team.id || tidx}
                          style={{ 
                            background: '#ffffff', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '10px', 
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                                {team.tag || team.name?.slice(0, 3).toUpperCase() || 'TM'}
                              </div>
                              <div>
                                <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{team.name}</strong>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                                  <span className="text-xs" style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', color: '#64748b' }}>
                                    Seed #{team.seed || (tidx + 1)}
                                  </span>
                                  <span className="status-pill status-pill-success text-xs">
                                    {team.status || 'Confirmed'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '12px' }}>
                              W: {team.wins || 0} / L: {team.losses || 0}
                            </span>
                          </div>

                          <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Crown size={14} className="text-amber" />
                            <span><strong>กัปตันทีม:</strong> {team.captain || 'ไม่ระบุ'}</span>
                          </div>

                          <div>
                            <div className="text-xs text-muted" style={{ fontWeight: 600, marginBottom: '6px' }}>
                              รายชื่อผู้เล่นตัวจริง 5 คน (Lineup):
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                              {(team.players || []).map((player, pidx) => (
                                <span 
                                  key={pidx} 
                                  style={{ 
                                    fontSize: '0.78rem', 
                                    background: '#eff6ff', 
                                    color: '#1d4ed8', 
                                    fontWeight: 600, 
                                    padding: '2px 8px', 
                                    borderRadius: '12px',
                                    border: '1px solid #bfdbfe'
                                  }}
                                >
                                  {player}
                                </span>
                              ))}
                              {(team.substitutes || []).filter(s => s).map((sub, sidx) => (
                                <span 
                                  key={sidx} 
                                  style={{ 
                                    fontSize: '0.78rem', 
                                    background: '#fef3c7', 
                                    color: '#b45309', 
                                    fontWeight: 600, 
                                    padding: '2px 8px', 
                                    borderRadius: '12px',
                                    border: '1px solid #fde68a'
                                  }}
                                >
                                  Sub: {sub}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 4: 50+ PHOTO GALLERY & LIGHTBOX */}
              {tourneyModalTab === 'gallery' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Gallery header banner */}
                  <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Camera size={20} className="text-blue" />
                      <div>
                        <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                          คลังภาพบรรยากาศการแข่งขัน: {(selectedTournament.galleryPhotos || []).length} ภาพ
                        </strong>
                        <span className="text-xs text-muted block">
                          คลิกที่รูปภาพเพื่อเปิดชมภาพขยายเต็มจอ (Fullscreen Lightbox) ความละเอียดสูง
                        </span>
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
                      {[
                        { id: 'all', label: 'ทั้งหมด' },
                        { id: 'stage', label: 'เวที & แสงสี' },
                        { id: 'players', label: 'นักกีฬา' },
                        { id: 'gear', label: 'อุปกรณ์' },
                        { id: 'crowd', label: 'กองเชียร์' },
                        { id: 'trophy', label: 'มอบรางวัล' },
                        { id: 'caster', label: 'แคสเตอร์' }
                      ].map(cat => (
                        <button 
                          key={cat.id}
                          type="button"
                          className={`subtab-btn ${tourneyGalleryCategory === cat.id ? 'active' : ''}`}
                          style={{ padding: '3px 10px', fontSize: '0.78rem' }}
                          onClick={() => setTourneyGalleryCategory(cat.id)}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Photos Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                    {(selectedTournament.galleryPhotos || [])
                      .filter(p => tourneyGalleryCategory === 'all' || p.category === tourneyGalleryCategory)
                      .map((photo, pidx) => (
                        <div 
                          key={photo.id || pidx}
                          onClick={() => setLightboxIndex(pidx)}
                          style={{ 
                            position: 'relative', 
                            height: '140px', 
                            borderRadius: '8px', 
                            overflow: 'hidden', 
                            cursor: 'pointer',
                            background: '#0f172a',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                          }}
                          className="gallery-thumb-card"
                        >
                          <img 
                            src={photo.url} 
                            alt={photo.caption}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                          />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, transparent 50%)' }} />
                          <span style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                            #{pidx + 1}
                          </span>
                          <div style={{ position: 'absolute', bottom: '6px', left: '8px', right: '8px', fontSize: '0.72rem', color: '#ffffff', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {photo.caption}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 5: REGISTER TEAM */}
              {tourneyModalTab === 'register' && (
                <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                  {registerSuccess ? (
                    <div style={{ background: '#ffffff', padding: '36px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                        <Check size={36} />
                      </div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                        ลงทะเบียนเข้าร่วมแข่งขันสำเร็จ!
                      </h3>
                      <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                        ทีม <strong>{teamRegForm.teamName}</strong> ได้รับการบันทึกเข้าสู่ระบบการแข่งขันเรียบร้อยแล้ว ทีมงานจะทำการส่งข้อมูลห้อง Discord และกำหนดการอุ่นเครื่องไปยังเบอร์โทรศัพท์และ Discord ที่ระบุไว้
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        <button 
                          type="button" 
                          className="btn-primary"
                          onClick={() => {
                            setTourneyModalTab('roster');
                            setRegisterSuccess(false);
                          }}
                        >
                          <Users size={15} /> ดูรายชื่อทีมในสายแข่ง
                        </button>
                        <button 
                          type="button" 
                          className="btn-secondary"
                          onClick={handleCloseTournament}
                        >
                          ปิดหน้าต่าง
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleRegisterSubmit} style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#0f172a' }}>
                          แบบฟอร์มสมัครเข้าร่วมแข่งขัน: {selectedTournament.title}
                        </h4>
                        <span className="text-xs text-muted">
                          กรุณากรอกข้อมูลทีม กัปตัน และรายชื่อผู้เล่นตัวจริง 5 คนให้ครบถ้วนเพื่อความรวดเร็วในการยืนยันสิทธิ์
                        </span>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>ชื่อทีม (Team Name) *</label>
                          <input 
                            type="text" required className="form-input"
                            placeholder="เช่น G-Speed Slayer Esports"
                            value={teamRegForm.teamName}
                            onChange={e => setTeamRegForm({ ...teamRegForm, teamName: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>แท็กทีม (Team Tag)</label>
                          <input 
                            type="text" className="form-input"
                            placeholder="เช่น GLP"
                            value={teamRegForm.teamTag}
                            onChange={e => setTeamRegForm({ ...teamRegForm, teamTag: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>ชื่อ-นามสกุล และ IGN หัวหน้าทีม (Captain) *</label>
                          <input 
                            type="text" required className="form-input"
                            placeholder="เช่น สมชาย มีชัย (CaptainSpeed)"
                            value={teamRegForm.captainName}
                            onChange={e => setTeamRegForm({ ...teamRegForm, captainName: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>เบอร์โทรศัพท์ติดต่อหัวหน้าทีม *</label>
                          <input 
                            type="tel" required className="form-input"
                            placeholder="08X-XXX-XXXX"
                            value={teamRegForm.captainPhone}
                            onChange={e => setTeamRegForm({ ...teamRegForm, captainPhone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>อีเมลติดต่อ *</label>
                          <input 
                            type="email" required className="form-input"
                            placeholder="captain@example.com"
                            value={teamRegForm.captainEmail}
                            onChange={e => setTeamRegForm({ ...teamRegForm, captainEmail: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Discord Tag (สำหรับดึงเข้าห้องแข่งขัน) *</label>
                          <input 
                            type="text" required className="form-input"
                            placeholder="captain#1234 หรือ username"
                            value={teamRegForm.captainDiscord}
                            onChange={e => setTeamRegForm({ ...teamRegForm, captainDiscord: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* 5 Starting Players */}
                      <div className="form-group" style={{ marginTop: '10px' }}>
                        <label>รายชื่อผู้เล่นคนที่ 2 - 5 (IGN ในเกม)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                          <input 
                            type="text" className="form-input" placeholder="ผู้เล่นคนที่ 2"
                            value={teamRegForm.player2}
                            onChange={e => setTeamRegForm({ ...teamRegForm, player2: e.target.value })}
                          />
                          <input 
                            type="text" className="form-input" placeholder="ผู้เล่นคนที่ 3"
                            value={teamRegForm.player3}
                            onChange={e => setTeamRegForm({ ...teamRegForm, player3: e.target.value })}
                          />
                          <input 
                            type="text" className="form-input" placeholder="ผู้เล่นคนที่ 4"
                            value={teamRegForm.player4}
                            onChange={e => setTeamRegForm({ ...teamRegForm, player4: e.target.value })}
                          />
                          <input 
                            type="text" className="form-input" placeholder="ผู้เล่นคนที่ 5"
                            value={teamRegForm.player5}
                            onChange={e => setTeamRegForm({ ...teamRegForm, player5: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>ผู้เล่นตัวสำรอง (Substitute IGN - ถ้ามี)</label>
                        <input 
                          type="text" className="form-input"
                          placeholder="ชื่อในเกมผู้เล่นตัวสำรอง"
                          value={teamRegForm.substitute}
                          onChange={e => setTeamRegForm({ ...teamRegForm, substitute: e.target.value })}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
                        <button 
                          type="button" 
                          className="btn-secondary" 
                          onClick={handleCloseTournament}
                        >
                          ยกเลิก
                        </button>
                        <button type="submit" className="btn-primary">
                          <Send size={15} />
                          <span>ยืนยันการลงทะเบียนแข่งขัน</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          FULLSCREEN PHOTO LIGHTBOX (FOR 50+ EVENT PHOTOS)
          ========================================================================= */}
      {lightboxIndex !== null && selectedTournament?.galleryPhotos?.[lightboxIndex] && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(10, 15, 29, 0.95)', 
            backdropFilter: 'blur(10px)',
            zIndex: 100200, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '16px', 
              left: '20px', 
              right: '20px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              color: '#ffffff',
              zIndex: 10
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedTournament.title}</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                ภาพที่ {lightboxIndex + 1} จาก {selectedTournament.galleryPhotos.length}
              </span>
            </div>
            <button 
              type="button" 
              onClick={() => setLightboxIndex(null)}
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Large Image Container */}
          <div 
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '78vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={selectedTournament.galleryPhotos[lightboxIndex].url} 
              alt={selectedTournament.galleryPhotos[lightboxIndex].caption}
              style={{ maxWidth: '100%', maxHeight: '78vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}
            />

            {/* Prev Button */}
            {lightboxIndex > 0 && (
              <button 
                type="button"
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                style={{ position: 'absolute', left: '-50px', background: 'rgba(255,255,255,0.25)', color: '#fff', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Next Button */}
            {lightboxIndex < selectedTournament.galleryPhotos.length - 1 && (
              <button 
                type="button"
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                style={{ position: 'absolute', right: '-50px', background: 'rgba(255,255,255,0.25)', color: '#fff', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Caption */}
          <div 
            style={{ position: 'absolute', bottom: '20px', textAlign: 'center', color: '#ffffff', maxWidth: '700px', fontSize: '0.95rem', background: 'rgba(0,0,0,0.6)', padding: '8px 18px', borderRadius: '20px', backdropFilter: 'blur(6px)' }}
            onClick={e => e.stopPropagation()}
          >
            {selectedTournament.galleryPhotos[lightboxIndex].caption}
          </div>
        </div>
      )}
    </div>
  );
}
