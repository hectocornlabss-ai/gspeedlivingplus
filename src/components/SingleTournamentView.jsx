import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Trophy, Calendar, MapPin, Globe, Copy, Check, Award, 
  Users, Camera, Zap, Clock, Shield, CheckCircle2, 
  ArrowRight, ChevronLeft, ChevronRight, Home,
  GitBranch, ExternalLink, Radio, Search, Share2, 
  AlertCircle, MessageCircle, Sparkles, PhoneCall, Layers, X
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { generateDefaultBracket } from '../data/mockData';
import TournamentOverviewSlider from './TournamentOverviewSlider';
import SocialSharePopover from './SocialSharePopover';

export default function SingleTournamentView({
  tournament,
  initialTab = 'overview',
  onBack = () => {},
  onNavigateHome = () => {},
  onSelectTournament = () => {},
  onNavigateFranchise = () => {}
}) {
  const { siteData } = useSiteData();
  const { t, language, translateDynamic } = useTranslation();
  const allTournaments = siteData?.tournaments || [];

  const [activeTab, setActiveTab] = useState(initialTab);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryCategory, setGalleryCategory] = useState('all');
  const [rosterSearch, setRosterSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const shareBtnRef = useRef(null);
  const tabsAnchorRef = useRef(null);
  const tabsBarRef = useRef(null);
  const isFirstRender = useRef(true);

  const scrollToTabsTop = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const navOffset = isMobile ? 62 : 72;

    if (tabsAnchorRef.current) {
      tabsAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const heroEl = document.querySelector('.tourney-hero-header');
      if (heroEl) {
        const topPos = heroEl.offsetTop + heroEl.offsetHeight - navOffset;
        window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
      }
    }
  };

  const handleTabSelect = (tabId, buttonEl) => {
    setActiveTab(tabId);

    // 1. Center the clicked tab button horizontally on mobile/desktop
    if (buttonEl) {
      try {
        buttonEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } catch (e) {}
    }

    // 2. Vertically scroll up so user immediately sees the beginning of the tab content
    scrollToTabsTop();
    setTimeout(() => {
      scrollToTabsTop();
    }, 50);
  };

  // Auto scroll up on activeTab change if user was scrolled down into content
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const heroEl = document.querySelector('.tourney-hero-header');
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const navOffset = isMobile ? 62 : 72;
    if (heroEl) {
      const tabsNaturalTop = heroEl.offsetTop + heroEl.offsetHeight - navOffset;
      if (window.pageYOffset > tabsNaturalTop - 40) {
        scrollToTabsTop();
      }
    }
  }, [activeTab]);

  // Bracket state
  const [bracketViewMode, setBracketViewMode] = useState('tree'); // 'tree' | 'list'

  // Scroll to top on mount or when tournament changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tournament?.id, tournament?.slug]);

  // Dynamic SEO Meta Tags & Schema.org Structured Data
  useEffect(() => {
    if (!tournament) return;

    const pageTitle = tournament.seo?.metaTitle || `${tournament.title} | GLP Esport Tournament`;
    const pageDesc = tournament.seo?.metaDesc || tournament.desc || `การแข่งขัน ${tournament.game} ชิงเงินรางวัล ${tournament.prizePool} ณ G-Speed Arena`;
    const pageImage = tournament.seo?.ogImage || tournament.bannerImage || '';
    const currentUrl = window.location.href;

    document.title = pageTitle;

    const setMetaTag = (attr, key, content) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('name', 'description', pageDesc);
    setMetaTag('name', 'keywords', tournament.seo?.keywords || `${tournament.game}, ทัวร์นาเมนต์, แข่งเกม, G-Speed, อีสปอร์ต`);
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDesc);
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', 'website');

    // Schema.org Event / SportsEvent
    let scriptTag = document.getElementById('tournament-schema-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'tournament-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    scriptTag.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      "name": tournament.title,
      "description": pageDesc,
      "image": pageImage,
      "startDate": tournament.tourneyStartDate || "2026-09-28",
      "endDate": tournament.tourneyEndDate || "2026-09-30",
      "eventStatus": tournament.status === 'Open' ? "https://schema.org/EventScheduled" : "https://schema.org/EventPostponed",
      "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": tournament.venue || "G-Speed Esport Arena รามคำแหง 53",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "รามคำแหง 53",
          "addressLocality": "กรุงเทพมหานคร",
          "addressCountry": "TH"
        }
      },
      "organizer": {
        "@type": "Organization",
        "name": "GLP : G Speed Living Plus",
        "url": "https://gspeedesport.com"
      }
    });

    return () => {
      document.title = siteData?.globalSEO?.metaTitle || 'G-SPEED ESPORT ARENA';
      const sTag = document.getElementById('tournament-schema-jsonld');
      if (sTag) sTag.remove();
    };
  }, [tournament, siteData]);

  const isRegistrationOpen = tournament?.status === 'Open';
  const rawMatches = (tournament?.bracketMatches && tournament.bracketMatches.length > 0)
    ? tournament.bracketMatches
    : generateDefaultBracket(tournament?.teams || [], tournament?.title || '');

  // If tournament is Open for registration, matches have not happened yet (no finished scores, no live state)
  const matches = rawMatches.map(m => {
    if (isRegistrationOpen) {
      return {
        ...m,
        status: 'Upcoming',
        teamA: m.teamA ? { ...m.teamA, score: 0, isWinner: false } : null,
        teamB: m.teamB ? { ...m.teamB, score: 0, isWinner: false } : null,
        maps: [],
        mvp: null
      };
    }
    return m;
  });

  const liveMatches = isRegistrationOpen ? [] : matches.filter(m => m.status === 'LIVE' || m.status === 'Live');
  const cleanSlug = tournament?.slug || tournament?.seo?.slug || tournament?.id || '';
  const canonicalUrl = `${window.location.origin}/tournaments/${cleanSlug}`;
  const lineOaUrl = tournament?.regUrl || siteData?.footer?.lineUrl || 'https://line.me/R/ti/p/@gspeed';

  // Filtered Roster Teams
  const teamsList = tournament?.teams || [];
  const filteredTeams = teamsList.filter(tm => {
    if (!rosterSearch.trim()) return true;
    const q = rosterSearch.toLowerCase();
    const matchName = tm.name?.toLowerCase().includes(q);
    const matchTag = tm.tag?.toLowerCase().includes(q);
    const matchCaptain = tm.captain?.toLowerCase().includes(q);
    const matchPlayers = (tm.players || []).some(p => p.toLowerCase().includes(q));
    return matchName || matchTag || matchCaptain || matchPlayers;
  });

  // Filtered Gallery Photos
  const photosList = tournament?.galleryPhotos || [];
  const filteredPhotos = photosList.filter(p => {
    if (galleryCategory === 'all') return true;
    return p.category === galleryCategory;
  });

  // Touch Swipe Gesture & Navigation for Lightbox
  const lightboxTouchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const [lightboxSwipeOffset, setLightboxSwipeOffset] = useState(0);
  const [lightboxIsSwiping, setLightboxIsSwiping] = useState(false);

  const handleNextLightboxPhoto = () => {
    setLightboxIndex(prev => (prev === null ? null : (prev + 1) % filteredPhotos.length));
  };

  const handlePrevLightboxPhoto = () => {
    setLightboxIndex(prev => (prev === null ? null : (prev - 1 + filteredPhotos.length) % filteredPhotos.length));
  };

  const handleLightboxTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      lightboxTouchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
      setLightboxIsSwiping(true);
      setLightboxSwipeOffset(0);
    }
  };

  const handleLightboxTouchMove = (e) => {
    if (!lightboxIsSwiping || !e.touches || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lightboxTouchStartRef.current.x;
    const deltaY = e.touches[0].clientY - lightboxTouchStartRef.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setLightboxSwipeOffset(deltaX);
    }
  };

  const handleLightboxTouchEnd = () => {
    if (!lightboxIsSwiping) return;
    setLightboxIsSwiping(false);

    const deltaX = lightboxSwipeOffset;
    const elapsed = Date.now() - lightboxTouchStartRef.current.time;
    const velocity = Math.abs(deltaX) / (elapsed || 1);

    if (deltaX < -35 || (deltaX < -15 && velocity > 0.25)) {
      handleNextLightboxPhoto();
    } else if (deltaX > 35 || (deltaX > 15 && velocity > 0.25)) {
      handlePrevLightboxPhoto();
    }

    setLightboxSwipeOffset(0);
  };

  // Keyboard navigation & body scroll lock while lightbox is active
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        handleNextLightboxPhoto();
      } else if (e.key === 'ArrowLeft') {
        handlePrevLightboxPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = origOverflow;
    };
  }, [lightboxIndex, filteredPhotos.length]);

  // Related Tournaments
  const relatedTournaments = allTournaments.filter(t => t.id !== tournament?.id);

  // Bottom Social Share State & Handlers
  const [bottomShareOpen, setBottomShareOpen] = useState(false);
  const bottomShareBtnRef = useRef(null);

  if (!tournament) {
    return (
      <div className="single-tournament-page container" style={{ padding: '90px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', background: '#ffffff', padding: '40px 30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <AlertCircle size={48} className="text-amber" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 650, color: '#0f172a', marginBottom: '8px' }}>
            {language === 'th' ? 'ไม่พบข้อมูลรายการแข่งขัน' : language === 'zh' ? '未找到赛事信息' : 'Tournament Not Found'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
            {language === 'th' 
              ? 'รายการแข่งขันนี้อาจเสร็จสิ้นไปแล้ว ลิงก์ไม่ถูกต้อง หรือยังไม่ได้เปิดเผยต่อสาธารณะ'
              : language === 'zh'
              ? '该赛事可能已结束，或链接无效。'
              : 'This tournament may have ended or the link is invalid.'}
          </p>
          <button 
            type="button" 
            onClick={onBack} 
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
          >
            <ArrowLeft size={16} />
            <span>{language === 'th' ? 'กลับไปหน้ารวมทัวร์นาเมนต์ทั้งหมด' : language === 'zh' ? '返回赛事列表' : 'Back to Tournaments'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Handle Share / Copy Link with reliable fallback and visual feedback
  const handleCopyLink = () => {
    const fullUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const onCopied = () => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    };

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullUrl).then(onCopied).catch(() => {
        fallbackCopyText(fullUrl, onCopied);
      });
    } else {
      fallbackCopyText(fullUrl, onCopied);
    }
  };

  const fallbackCopyText = (text, cb) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful && typeof cb === 'function') cb();
    } catch (err) {
      console.error('Fallback copy link failed:', err);
    }
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(canonicalUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const handleShareLine = () => {
    const url = encodeURIComponent(canonicalUrl);
    const title = encodeURIComponent(tournament.title);
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(canonicalUrl);
    const text = encodeURIComponent(`${tournament.title} | GLP : G Speed Living Plus`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
  };

  return (
    <div className="single-tournament-page">
      {/* 1. TOP STICKY NAV BAR */}
      <div className="tournament-nav-bar">
        <div className="container tournament-nav-inner">
          <div className="tourney-nav-left-group">
            {/* Clean Back Button */}
            <button 
              type="button" 
              onClick={onBack} 
              className="btn-tourney-back"
              title={t('singleTournament.back')}
            >
              <ArrowLeft size={15} />
              <span className="back-btn-text-full">{t('singleTournament.back')}</span>
              <span className="back-btn-text-short">{t('common.back')}</span>
            </button>
          </div>

          {/* Compact Social Share Trigger & Popover */}
          <div className="tourney-share-wrapper">
            <button
              ref={shareBtnRef}
              type="button"
              className="btn-tourney-share-trigger"
              onClick={() => setShareOpen(!shareOpen)}
              title={t('common.share')}
            >
              <Share2 size={14} className="text-blue" />
              <span>{t('common.share')}</span>
            </button>

            <SocialSharePopover
              url={canonicalUrl}
              title={tournament.title}
              subtitle={`${tournament.game} | เงินรางวัล ${tournament.prizePool}`}
              isOpen={shareOpen}
              onClose={() => setShareOpen(false)}
              triggerRef={shareBtnRef}
            />
          </div>
        </div>
      </div>

      {/* 2. DEDICATED FULL HERO BANNER */}
      <div className="tournament-hero-wrapper">
        <div 
          className="tournament-hero-banner"
          style={{ 
            backgroundImage: tournament.bannerImage 
              ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0.94) 100%), url(${tournament.bannerImage})` 
              : 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          }}
        >
          <div className="container tournament-hero-content">
            {/* Top Badges Row - Clean, High Contrast, Separated & NEVER Overlapping */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
              {/* Game Badge */}
              <span style={{ 
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)', 
                color: '#ffffff', 
                fontWeight: 650, 
                padding: '6px 14px', 
                borderRadius: '8px', 
                fontSize: '0.84rem', 
                letterSpacing: '0.5px',
                boxShadow: '0 2px 10px rgba(37,99,235,0.4)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                {tournament.game}
              </span>

              {/* Game Category Badge */}
              {tournament.gameCategory && (
                <span style={{ 
                  background: 'rgba(255, 255, 255, 0.14)', 
                  color: '#f8fafc', 
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)', 
                  padding: '6px 14px', 
                  borderRadius: '8px', 
                  fontSize: '0.82rem', 
                  fontWeight: 600 
                }}>
                  {tournament.gameCategory}
                </span>
              )}

              {/* Status Badge */}
              {isRegistrationOpen ? (
                <span style={{ 
                  background: 'linear-gradient(135deg, #059669, #10b981)', 
                  color: '#ffffff', 
                  fontWeight: 650, 
                  padding: '6px 14px', 
                  borderRadius: '8px', 
                  fontSize: '0.82rem', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  boxShadow: '0 0 12px rgba(16,185,129,0.4)',
                  border: '1px solid #34d399'
                }}>
                  ✨ เปิดรับสมัคร (รับจำนวนจำกัด)
                </span>
              ) : liveMatches.length > 0 ? (
                <span style={{ 
                  background: 'linear-gradient(135deg, #dc2626, #ef4444)', 
                  color: '#ffffff', 
                  fontWeight: 650, 
                  padding: '6px 14px', 
                  borderRadius: '8px', 
                  fontSize: '0.82rem', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  boxShadow: '0 0 14px rgba(239,68,68,0.5)',
                  border: '1px solid #f87171'
                }}>
                  🔴 กำลังแข่งขันสดในสนาม ({liveMatches.length} คู่)
                </span>
              ) : tournament.status === 'Completed' ? (
                <span style={{ 
                  background: '#334155', 
                  color: '#e2e8f0', 
                  fontWeight: 600, 
                  padding: '6px 14px', 
                  borderRadius: '8px', 
                  fontSize: '0.82rem',
                  border: '1px solid #475569'
                }}>
                  🏁 การแข่งขันเสร็จสิ้นแล้ว
                </span>
              ) : (
                <span style={{ 
                  background: '#d97706', 
                  color: '#fef3c7', 
                  fontWeight: 650, 
                  padding: '6px 14px', 
                  borderRadius: '8px', 
                  fontSize: '0.82rem',
                  border: '1px solid #f59e0b'
                }}>
                  🔒 ปิดรับสมัคร (ทีมเต็มแล้ว)
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="tournament-hero-title">
              {translateDynamic(tournament.title)}
            </h1>

            {/* Metadata Info Grid - 3 Equal Balanced Columns */}
            <div className="tournament-hero-metrics">
              <div className="hero-metric-card">
                <div className="metric-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.25)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                  <Trophy size={20} />
                </div>
                <div>
                  <span className="metric-label" style={{ color: '#fbbf24' }}>เงินรางวัลรวม</span>
                  <div className="metric-value text-amber">{tournament.prizePool}</div>
                </div>
              </div>

              <div className="hero-metric-card">
                <div className="metric-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <span className="metric-label" style={{ color: '#bae6fd' }}>วันที่จัดแข่งขัน</span>
                  <div className="metric-value">{tournament.date}</div>
                  <span className="metric-sub">{tournament.time}</span>
                </div>
              </div>

              <div className="hero-metric-card">
                <div className="metric-icon-wrap" style={{ background: 'rgba(96, 165, 250, 0.2)', color: '#60a5fa', border: '1px solid rgba(96, 165, 250, 0.4)' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="metric-label" style={{ color: '#bfdbfe' }}>สถานที่จัดแข่งขัน</span>
                  <div className="metric-value" style={{ fontSize: '0.92rem' }}>
                    {tournament.venue || 'GLP : G Speed Living Plus รามคำแหง 53'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABS ANCHOR & NAVIGATION BAR (STICKY) */}
      <div 
        ref={tabsAnchorRef} 
        id="tournament-tabs-anchor" 
        style={{ 
          scrollMarginTop: '75px', 
          height: '1px', 
          marginTop: '-1px', 
          visibility: 'hidden' 
        }} 
      />

      <div className="tournament-tabs-bar" ref={tabsBarRef}>
        <div className="container tabs-inner-scroll">
          {[
            { id: 'overview', label: t('singleTournament.overview'), icon: <Award size={14} /> },
            { id: 'schedule', label: t('singleTournament.schedule'), icon: <Calendar size={14} /> },
            { 
              id: 'bracket', 
              label: (!isRegistrationOpen && liveMatches.length > 0) ? `${t('singleTournament.bracket')} (${matches.length}) 🔴 LIVE` : `${t('singleTournament.bracket')} (${matches.length})`, 
              icon: <GitBranch size={14} />,
              highlight: !isRegistrationOpen && liveMatches.length > 0
            },
            { id: 'roster', label: `${t('singleTournament.teams')} (${teamsList.length})`, icon: <Users size={14} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              type="button"
              onClick={(e) => handleTabSelect(tab.id, e.currentTarget)}
              className={`tourney-tab-item ${activeTab === tab.id ? 'active' : ''} ${tab.highlight ? 'highlight' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN BODY CONTAINER */}
      <div className="container tourney-body-container">
        
        {/* ================= TAB 1: OVERVIEW & RULES ================= */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Direct LINE Registration Callout (If Registration is open) */}
            {isRegistrationOpen && (
              <div style={{ 
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', 
                border: '2px solid #86efac', 
                borderRadius: '16px', 
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '18px',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.1)'
              }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#14532d', fontWeight: 700, margin: '0 0 6px 0' }}>
                    ช่องทางการรับสมัคร
                  </h3>
                  <p style={{ margin: 0, color: '#166534', fontSize: '0.92rem', lineHeight: 1.55 }}>
                    ไม่ต้องลงทะเบียนผ่านหน้าเว็บให้ยุ่งยาก เพียงทักแชตเพื่อขอรับแบบฟอร์ม ส่งรายชื่อผู้เล่น และรับการยืนยันสิทธิ์จากทีมงาน G-Speed โดยตรง
                  </p>
                </div>
                <a 
                  href={lineOaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: '#06c755', 
                    color: '#ffffff', 
                    padding: '11px 22px', 
                    borderRadius: '10px', 
                    fontWeight: 700, 
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(6, 199, 85, 0.35)',
                    flexShrink: 0
                  }}
                >
                  <MessageCircle size={17} />
                  <span>ลงทะเบียน</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            {/* 16:9 Showcase Continuous 20-Slide Carousel */}
            <TournamentOverviewSlider tournament={tournament} />

            {/* Story & Description */}
            <div className="tourney-card-box">
              <h3 className="section-card-title">
                <Zap size={20} className="text-blue" />
                <span>เกี่ยวกับรายการแข่งขัน</span>
              </h3>
              <p style={{ margin: 0, lineHeight: 1.8, color: '#334155', fontSize: '1rem' }}>
                {tournament.desc || 'การแข่งขันอีสปอร์ตสุดยิ่งใหญ่ รวบรวมยอดฝีมือทั่วประเทศมาร่วมประลองความแม่นยำบนเวที LAN Final ณ GLP : G Speed Living Plus รามคำแหง 53 ชิงเงินรางวัลและถ้วยเกียรติยศ พร้อมถ่ายทอดสดด้วยโปรดักชันระดับสตูดิโอ'}
              </p>
            </div>

            {/* Prize Pool Distribution */}
            <div className="tourney-card-box">
              <h3 className="section-card-title">
                <Trophy size={20} className="text-amber" />
                <span>โครงสร้างเงินรางวัล (Prize Pool Distribution)</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {(tournament.prizeDistribution || [
                  { rank: 'แชมป์อันดับ 1', reward: '฿50,000 + ถ้วยเกียรติยศ + เหรียญทอง + ROG Gaming Gear' },
                  { rank: 'รองชนะเลิศอันดับ 1', reward: '฿25,000 + เหรียญเงิน' },
                  { rank: 'รองชนะเลิศอันดับ 2 ร่วม (2 ทีม)', reward: '฿10,000 ต่อทีม + เหรียญทองแดง' },
                  { rank: 'MVP of Tournament', reward: '฿5,000 + หูฟัง ROG Delta S Wireless' }
                ]).map((pz, idx) => (
                  <div 
                    key={idx}
                    className={`prize-card ${idx === 0 ? 'prize-champion' : idx === 1 ? 'prize-runnerup' : 'prize-standard'}`}
                  >
                    <span className="prize-rank-badge">
                      {idx === 0 ? '🥇 อันดับที่ 1 (CHAMPION)' : idx === 1 ? '🥈 อันดับที่ 2 (RUNNER-UP)' : `🎖️ ${pz.rank}`}
                    </span>
                    <span className="prize-reward-text">
                      {pz.reward}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware Specs Box */}
            <div className="tourney-specs-box">
              <div style={{ flex: 1, minWidth: '260px' }}>
                <span className="badge-pill badge-white" style={{ marginBottom: '8px', display: 'inline-block' }}>
                  OFFICIAL TOURNAMENT SPECS
                </span>
                <h4 style={{ margin: '4px 0 6px 0', fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>
                  มาตรฐานสนามแข่งขันระดับ World Class LAN Arena
                </h4>
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                  ทุกสเตชันขับเคลื่อนด้วยขุมพลัง Intel Core i9 + NVIDIA GeForce RTX 40 Series, จอเกมมิ่ง BenQ ZOWIE 360Hz Fast-IPS พร้อมระบบ Dedicated Multi-WAN 10Gbps ลื่นไหลไร้อาการหน่วง
                </p>
              </div>
            </div>

            {/* Rules & Regulations */}
            <div className="tourney-card-box">
              <h3 className="section-card-title">
                <Shield size={20} className="text-emerald-600" />
                <span>กติกาและระเบียบการแข่งขัน (Rules & Regulations)</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(tournament.rules || [
                  'ผู้เข้าแข่งขันทุกท่านต้องนำบัตรประชาชนหรือหลักฐานแสดงตนตัวจริงมาแสดง ณ จุดลงทะเบียนสนาม',
                  'อนุญาตให้นำอุปกรณ์เกมมิ่งเกียร์ส่วนตัว (เมาส์, คีย์บอร์ด, หูฟัง) มาใช้ได้ โดยต้องผ่านการตรวจสอบจากกรรมการเทคนิค',
                  'ห้ามใช้โปรแกรมโกง สคริปต์ช่วยเล่น หรือ Macro ใดๆ ที่เข้าข่ายเอาเปรียบผู้เล่นอื่น หากตรวจพบปรับแพ้และตัดสิทธิ์ทันที',
                  'การตัดสินของคณะกรรมการและผู้ตัดสินกลางในสนามถือเป็นที่สิ้นสุดในทุกกรณี'
                ]).map((rule, rIdx) => (
                  <div key={rIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#2563eb', color: '#ffffff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 650, flexShrink: 0 }}>
                      {rIdx + 1}
                    </div>
                    <span style={{ fontSize: '0.94rem', color: '#334155', lineHeight: 1.6 }}>
                      {rule}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact & Sleek Social Share Strip */}
            <div className="article-share-strip glass-panel" style={{ marginTop: '16px' }}>
              <div className="share-strip-header">
                <div className="share-strip-title-row">
                  <Share2 size={16} className="text-blue" />
                  <span className="share-strip-title">แชร์ทัวร์นาเมนต์นี้</span>
                </div>
                <span className="share-strip-subtitle">ร่วมส่งต่อความมันส์และไฮไลต์การแข่งขันให้เพื่อนและคอมมูนิตี้</span>
              </div>

              <div className="share-strip-actions">
                <div className="share-buttons-row">
                  {/* Facebook */}
                  <button 
                    type="button"
                    onClick={handleShareFacebook}
                    className="share-pill-btn fb"
                    title="แชร์ลง Facebook"
                  >
                    <svg className="social-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>

                  {/* LINE */}
                  <button 
                    type="button"
                    onClick={handleShareLine}
                    className="share-pill-btn line"
                    title="แชร์ไปยัง LINE"
                  >
                    <svg className="social-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.019 9.607.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.646 1.281-.54 6.915-4.072 9.434-6.973 1.796-1.999 2.583-4.024 2.583-5.382z"/>
                    </svg>
                    <span>LINE</span>
                  </button>

                  {/* X (Twitter) */}
                  <button 
                    type="button"
                    onClick={handleShareTwitter}
                    className="share-pill-btn x-twitter"
                    title="แชร์ลง X (Twitter)"
                  >
                    <svg className="social-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>X</span>
                  </button>

                  {/* Copy Link Button with Live Visual Feedback */}
                  <button 
                    type="button"
                    onClick={handleCopyLink}
                    className={`share-pill-btn copy ${copiedLink ? 'copied' : ''}`}
                    title="คัดลอกลิงก์ทัวร์นาเมนต์นี้"
                  >
                    {copiedLink ? (
                      <>
                        <Check size={14} className="text-emerald" />
                        <span>คัดลอกลิงก์แล้ว ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>คัดลอกลิงก์</span>
                      </>
                    )}
                  </button>

                  {/* Compact Share Trigger Icon Button & Popover */}
                  <div className="share-btn-relative-wrapper">
                    <button 
                      ref={bottomShareBtnRef}
                      type="button"
                      onClick={() => setBottomShareOpen(!bottomShareOpen)}
                      className={`share-pill-btn share-icon-btn ${bottomShareOpen ? 'active' : ''}`}
                      title="ช่องทางแชร์เพิ่มเติม (Messenger, Instagram, และแอปอื่นๆ)"
                      aria-label="ช่องทางแชร์เพิ่มเติม"
                    >
                      <Share2 size={15} className="text-blue" />
                    </button>

                    <SocialSharePopover
                      url={canonicalUrl}
                      title={tournament.title}
                      subtitle={`${tournament.game} | เงินรางวัล ${tournament.prizePool}`}
                      isOpen={bottomShareOpen}
                      onClose={() => setBottomShareOpen(false)}
                      triggerRef={bottomShareBtnRef}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: SCHEDULE & DATES ================= */}
        {activeTab === 'schedule' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="tourney-card-box">
              <h3 className="section-card-title">
                <Clock size={20} className="text-blue" />
                <span>กำหนดการและลำดับเวลาแข่งขัน (Tournament Timeline)</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                {(tournament.scheduleTimetable || [
                  { time: '10:00 - 11:00 น.', stage: 'เปิดจุดลงทะเบียนนักกีฬาและทีมผู้เข้าแข่งขัน พร้อมตรวจเช็กอุปกรณ์เกมมิ่งเกียร์' },
                  { time: '11:00 - 11:30 น.', stage: 'พิธีเปิดการแข่งขันและบรีฟกฎกติกาการแข่งขันโดยทีมงานกรรมการกลาง' },
                  { time: '11:30 - 14:00 น.', stage: 'การแข่งขันรอบแบ่งกลุ่ม Group Stage (Best of 1 - ทุกคู่ถ่ายทอดสดบนจอ Stadium)' },
                  { time: '14:30 - 17:30 น.', stage: 'การแข่งขันรอบ 8 ทีมสุดท้าย (Quarter-Finals) และรอบตัดเชือก (Semi-Finals - BO3)' },
                  { time: '18:00 - 20:30 น.', stage: 'การแข่งขันรอบชิงชนะเลิศ Grand Final (BO5) บนเวที Main Stage พร้อมแคสเตอร์ระดับโปร' },
                  { time: '20:30 - 21:00 น.', stage: 'พิธีมอบถ้วยรางวัล เหรียญรางวัลเกียรติยศ และเงินรางวัลรวม 100,000 บาท' }
                ]).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', background: '#f8fafc', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ minWidth: '130px', fontWeight: 650, color: '#1d4ed8', fontSize: '0.95rem' }}>
                      {item.time}
                    </div>
                    <div style={{ width: '2px', height: '24px', background: '#cbd5e1' }} />
                    <div style={{ flex: 1, color: '#334155', fontSize: '0.95rem', fontWeight: 500 }}>
                      {item.stage}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: BRACKET & LIVE MATCHES ================= */}
        {activeTab === 'bracket' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Bracket Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: '#ffffff', padding: '14px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GitBranch size={18} className="text-blue" />
                <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>สายการแข่งขัน & ผลคะแนน</strong>
                <span className="badge-pill" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                  {matches.length} แมตช์
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setBracketViewMode('tree')}
                  className={`btn-secondary ${bracketViewMode === 'tree' ? 'btn-active-filter' : ''}`}
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  ผังสายแข่ง (Tree)
                </button>
                <button 
                  type="button" 
                  onClick={() => setBracketViewMode('list')}
                  className={`btn-secondary ${bracketViewMode === 'list' ? 'btn-active-filter' : ''}`}
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  รายการแมตช์ (List)
                </button>
              </div>
            </div>

            {/* Open Registration Notice for Bracket */}
            {isRegistrationOpen && (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '0.9rem' }}>
                <Clock size={18} className="text-blue" style={{ flexShrink: 0 }} />
                <span>
                  <strong>สถานะ: ทัวร์นาเมนต์นี้อยู่ระหว่างเปิดรับสมัคร</strong> ตารางและสายการแข่งขันด้านล่างเป็นการวางผังรอบการแข่งขันเบื้องต้น ผลคะแนนการแข่งขันจะเริ่มอัปเดตสดเมื่อการแข่งขันเริ่มขึ้นในวันแข่งขันจริง ({tournament.date})
                </span>
              </div>
            )}

            {/* Matches List or Tree */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {matches.map((m, idx) => {
                const matchIsLive = !isRegistrationOpen && (m.status === 'LIVE' || m.status === 'Live');
                const matchIsFinished = !isRegistrationOpen && (m.status === 'Completed' || m.status === 'Finished');
                const teamAWinner = matchIsFinished && Boolean(m.teamA?.isWinner);
                const teamBWinner = matchIsFinished && Boolean(m.teamB?.isWinner);

                return (
                  <div 
                    key={m.id || idx}
                    style={{ 
                      background: '#ffffff', 
                      borderRadius: '12px', 
                      border: matchIsLive ? '2px solid #ef4444' : '1px solid #e2e8f0',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: matchIsLive ? '0 4px 16px rgba(239, 68, 68, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                  >
                    {/* Match Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>
                        {m.roundLabel || m.round || `แมตช์ที่ ${idx + 1}`}
                      </span>
                      <span 
                        style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 650, 
                          padding: '2px 8px', 
                          borderRadius: '20px',
                          background: matchIsLive ? '#fee2e2' : matchIsFinished ? '#dcfce7' : '#f1f5f9',
                          color: matchIsLive ? '#dc2626' : matchIsFinished ? '#16a34a' : '#64748b'
                        }}
                      >
                        {matchIsLive ? '🔴 กำลังแข่งสด' : matchIsFinished ? '✓ แข่งเสร็จสิ้น' : 'รอแข่งขัน'}
                      </span>
                    </div>

                    {/* Team A vs Team B */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Team A */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: teamAWinner ? '#f0fdf4' : '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                        <span style={{ fontWeight: teamAWinner ? 800 : 600, color: '#0f172a', fontSize: '0.92rem' }}>
                          {m.teamA?.name || 'รอผลการประกบคู่'}
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: teamAWinner ? '#16a34a' : '#64748b' }}>
                          {matchIsFinished || matchIsLive ? (m.teamA?.score ?? 0) : '-'}
                        </strong>
                      </div>

                      {/* Team B */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: teamBWinner ? '#f0fdf4' : '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                        <span style={{ fontWeight: teamBWinner ? 800 : 600, color: '#0f172a', fontSize: '0.92rem' }}>
                          {m.teamB?.name || 'รอผลการประกบคู่'}
                        </span>
                        <strong style={{ fontSize: '1.1rem', color: teamBWinner ? '#16a34a' : '#64748b' }}>
                          {matchIsFinished || matchIsLive ? (m.teamB?.score ?? 0) : '-'}
                        </strong>
                      </div>
                    </div>

                  {/* Match Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                    <span>{m.time || '14:00 น.'}</span>
                    <span>{m.format || 'BO3'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* ================= TAB 4: ROSTER & TEAMS ================= */}
        {activeTab === 'roster' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Search Box */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
                <Search size={18} className="text-muted" />
                <input 
                  type="text"
                  placeholder="ค้นหาชื่อทีม, กัปตัน หรือชื่อนักแข่ง..."
                  value={rosterSearch}
                  onChange={e => setRosterSearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                />
              </div>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                พบ {filteredTeams.length} / {teamsList.length} ทีม
              </span>
            </div>

            {/* Teams Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {filteredTeams.map((team, idx) => (
                <div 
                  key={team.id || idx}
                  style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img 
                      src={team.logo || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'} 
                      alt={team.name}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{team.name}</strong>
                        {team.tag && (
                          <span className="badge-pill" style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.72rem' }}>
                            [{team.tag}]
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        กัปตัน: {team.captain || 'ไม่ระบุ'}
                      </span>
                    </div>
                    <span className="badge-pill" style={{ background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 700 }}>
                      Confirmed
                    </span>
                  </div>

                  {/* Players list */}
                  <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      รายชื่อผู้เล่นไลน์อัปหลัก:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(team.players || []).map((p, pIdx) => (
                        <span 
                          key={pIdx}
                          style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '6px', fontSize: '0.8rem', color: '#334155' }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: GALLERY PHOTOS ================= */}
        {activeTab === 'gallery' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Gallery Category Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: '#ffffff', padding: '14px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              {[
                { id: 'all', label: 'ทั้งหมด (50+ ภาพ)' },
                { id: 'stage', label: 'เวที Main Stage' },
                { id: 'lan', label: 'บรรยากาศแข่งขัน LAN' },
                { id: 'crowd', label: 'กองเชียร์ & แฟนคลับ' },
                { id: 'awards', label: 'พิธีมอบรางวัล' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setGalleryCategory(cat.id)}
                  className={`btn-secondary ${galleryCategory === cat.id ? 'btn-active-filter' : ''}`}
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Photos Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
              {filteredPhotos.map((photo, pIdx) => (
                <div 
                  key={pIdx}
                  onClick={() => setLightboxIndex(pIdx)}
                  style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', aspectRatio: '16/10', border: '1px solid #e2e8f0' }}
                >
                  <img 
                    src={photo.url || photo} 
                    alt={photo.caption || 'Tournament Photo'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    loading="lazy"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)', display: 'flex', alignItems: 'flex-end', padding: '10px' }}>
                    <span style={{ color: '#ffffff', fontSize: '0.78rem', fontWeight: 600 }}>
                      {photo.caption || `ภาพกิจกรรม #${pIdx + 1}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. BOTTOM SECTION: RELATED TOURNAMENTS */}
        {relatedTournaments.length > 0 && (
          <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 650, color: '#0f172a', margin: '0 0 4px 0' }}>
                  รายการแข่งขันอื่นๆ ของทางร้าน (More Tournaments)
                </h3>
                <span style={{ fontSize: '0.88rem', color: '#64748b' }}>
                  ติดตามงานแข่งและประลองฝีมือในสังเวียนอีสปอร์ตรายการอื่นๆ ชิงเงินรางวัลรวมกว่า ฿300,000
                </span>
              </div>
              <button 
                type="button" 
                onClick={onBack}
                className="btn-link"
                style={{ fontSize: '0.88rem', fontWeight: 600, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>ดูทั้งหมด</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {relatedTournaments.slice(0, 3).map(relTour => (
                <div 
                  key={relTour.id}
                  onClick={() => onSelectTournament(relTour)}
                  style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}
                  className="related-tourney-card"
                >
                  <div style={{ height: '140px', position: 'relative' }}>
                    <img 
                      src={relTour.bannerImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'} 
                      alt={relTour.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      <span className="badge-pill badge-white" style={{ fontSize: '0.72rem' }}>
                        {relTour.game}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.98rem', fontWeight: 650, color: '#0f172a', lineHeight: 1.4 }}>
                      {relTour.title}
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                      <span style={{ color: '#b45309', fontWeight: 600 }}>
                        🏆 {relTour.prizePool}
                      </span>
                      <span style={{ color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <span>ดูรายละเอียด</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORGANIZER & PUBLISHER CALLOUT */}
        <section className="tournaments-organizer-callout" style={{ marginTop: '40px' }}>
          <div className="organizer-box tournaments-organizer-box glass-panel">
            <div className="organizer-left">
              <div className="badge-pill badge-blue">
                <Layers size={14} />
                <span>FOR TOURNAMENT ORGANIZERS & PUBLISHERS</span>
              </div>
              <h3 className="organizer-title">
                ต้องการจัดแข่งทัวร์นาเมนต์ หรือเช่าเวทีแข่งขันอีสปอร์ตที่ GLP?
              </h3>
              <p className="organizer-desc">
                GLP Esport Stadium พร้อมสนับสนุนค่ายเกม แบรนด์สปอนเซอร์ และออร์แกไนเซอร์ ด้วยเวทีแข่งขัน 5v5 มาตรฐานสากล, ระบบสตรีมมิ่ง 4K, ห้องพากย์แคสเตอร์เก็บเสียง, ระบบเซิร์ฟเวอร์ LAN 128-Tick และทีมงานเทคนิคอีสปอร์ตมืออาชีพ
              </p>
              <div className="organizer-specs-chips">
                <span className="spec-chip">✓ เวทีแข่งขัน 5v5</span>
                <span className="spec-chip">✓ เครื่องแข่งสเปคสูง</span>
                <span className="spec-chip">✓ ระบบถ่ายทอดสด 4K</span>
                <span className="spec-chip">✓ ห้องพากย์ Caster Studio</span>
              </div>
            </div>

            <div className="organizer-right">
              <div className="organizer-contact-card">
                <div className="contact-card-title">ติดต่อฝ่ายบริหารงานแข่งขัน</div>
                <div className="contact-hotline">
                  <PhoneCall size={18} className="text-blue pulse-icon" />
                  <a href="tel:0637937704">063-793-7704</a>
                </div>
                <p className="contact-subtext">เปิดบริการให้คำปรึกษาและจองคิวจัดงานทุกวัน</p>
                {onNavigateFranchise && (
                  <button 
                    type="button" 
                    className="btn-organizer-plan"
                    onClick={onNavigateFranchise}
                  >
                    <span>ติดต่อขอเปิดแฟรนไชส์</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox Modal for Gallery */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div 
          className="photo-lightbox-backdrop" 
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Top fixed Close Button */}
          <button 
            type="button"
            className="btn-lightbox-close" 
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(null);
            }}
            title="ปิดหน้าต่างภาพ (Esc)"
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>

          <div 
            className="lightbox-container" 
            onClick={e => e.stopPropagation()}
            onTouchStart={handleLightboxTouchStart}
            onTouchMove={handleLightboxTouchMove}
            onTouchEnd={handleLightboxTouchEnd}
          >
            {/* Prev Photo Arrow (Smaller & Sleeker) */}
            {filteredPhotos.length > 1 && (
              <button 
                type="button"
                className="btn-lightbox-arrow prev"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevLightboxPhoto();
                }}
                title="ภาพก่อนหน้า (ลูกศรซ้าย หรือสไลด์ขวา)"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div className="lightbox-img-wrapper">
              <img 
                src={filteredPhotos[lightboxIndex].url || filteredPhotos[lightboxIndex]} 
                alt={filteredPhotos[lightboxIndex].caption || 'Tournament Lightbox'} 
                style={{
                  transform: lightboxIsSwiping ? `translateX(${lightboxSwipeOffset * 0.38}px)` : 'none',
                  transition: lightboxIsSwiping ? 'none' : 'transform 0.22s ease-out'
                }}
                draggable={false}
              />
              <div className="lightbox-caption">
                <span className="caption-text">{filteredPhotos[lightboxIndex].caption || `ภาพที่ ${lightboxIndex + 1}`}</span>
                {filteredPhotos.length > 1 && (
                  <span className="counter-tag">{lightboxIndex + 1} / {filteredPhotos.length}</span>
                )}
              </div>
            </div>

            {/* Next Photo Arrow (Smaller & Sleeker) */}
            {filteredPhotos.length > 1 && (
              <button 
                type="button"
                className="btn-lightbox-arrow next"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextLightboxPhoto();
                }}
                title="ภาพถัดไป (ลูกศรขวา หรือสไลด์ซ้าย)"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Toast Notification when Link Copied */}
      {copiedLink && (
        <div 
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.94)',
            color: '#ffffff',
            padding: '12px 22px',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.28)',
            zIndex: 9999,
            fontSize: '0.88rem',
            fontWeight: 650,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            pointerEvents: 'none'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: '#10b981', color: '#fff' }}>
            <Check size={14} />
          </span>
          <span>คัดลอกลิงก์สำเร็จแล้ว พร้อมส่งต่อได้ทันที ✓</span>
        </div>
      )}
    </div>
  );
}
