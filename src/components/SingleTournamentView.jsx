import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Trophy, Calendar, MapPin, Globe, Copy, Check, Award, 
  Users, Camera, Zap, Clock, Shield, CheckCircle2, 
  ArrowRight, ChevronLeft, ChevronRight, Home,
  GitBranch, ExternalLink, Radio, Search, Share2, 
  AlertCircle, MessageCircle, Sparkles
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { generateDefaultBracket } from '../data/mockData';

export default function SingleTournamentView({
  tournament,
  initialTab = 'overview',
  onBack = () => {},
  onNavigateHome = () => {},
  onSelectTournament = () => {},
  onNavigateFranchise = () => {}
}) {
  const { siteData } = useSiteData();
  const allTournaments = siteData?.tournaments || [];

  const [activeTab, setActiveTab] = useState(initialTab);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryCategory, setGalleryCategory] = useState('all');
  const [rosterSearch, setRosterSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

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

  if (!tournament) {
    return (
      <div className="single-tournament-page container" style={{ padding: '90px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '520px', margin: '0 auto', background: '#ffffff', padding: '40px 30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <AlertCircle size={48} className="text-amber" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            ไม่พบข้อมูลรายการแข่งขัน
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
            รายการแข่งขันนี้อาจเสร็จสิ้นไปแล้ว ลิงก์ไม่ถูกต้อง หรือยังไม่ได้เปิดเผยต่อสาธารณะ
          </p>
          <button 
            type="button" 
            onClick={onBack} 
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
          >
            <ArrowLeft size={16} />
            <span>กลับไปหน้ารวมทัวร์นาเมนต์ทั้งหมด</span>
          </button>
        </div>
      </div>
    );
  }

  const matches = (tournament.bracketMatches && tournament.bracketMatches.length > 0)
    ? tournament.bracketMatches
    : generateDefaultBracket(tournament.teams, tournament.title);

  const liveMatches = matches.filter(m => m.status === 'LIVE');
  const isRegistrationOpen = tournament.status === 'Open';
  const cleanSlug = tournament.slug || tournament.seo?.slug || tournament.id;
  const canonicalUrl = `${window.location.origin}/tournaments/${cleanSlug}`;
  const lineOaUrl = tournament.regUrl || siteData?.footer?.lineUrl || 'https://line.me/R/ti/p/@gspeed';

  // Filtered Roster Teams
  const teamsList = tournament.teams || [];
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
  const photosList = tournament.galleryPhotos || [];
  const filteredPhotos = photosList.filter(p => {
    if (galleryCategory === 'all') return true;
    return p.category === galleryCategory;
  });

  // Related Tournaments
  const relatedTournaments = allTournaments.filter(t => t.id !== tournament.id);

  return (
    <div className="single-tournament-page">
      {/* 1. TOP STICKY NAV BAR */}
      <div className="tournament-nav-bar">
        <div className="container nav-bar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn-back-link" 
              onClick={onBack}
              title="ย้อนกลับไปหน้ารายการแข่งขันทั้งหมด"
            >
              <ArrowLeft size={16} />
              <span>หน้ารวมทัวร์นาเมนต์</span>
            </button>

            {/* Breadcrumb Trail */}
            <nav className="tournament-breadcrumbs" aria-label="Breadcrumb">
              <button type="button" onClick={onNavigateHome} className="breadcrumb-step">
                <Home size={13} style={{ marginRight: '4px' }} />
                <span>หน้าแรก</span>
              </button>
              <span className="breadcrumb-separator">/</span>
              <button type="button" onClick={onBack} className="breadcrumb-step">
                <span>ทัวร์นาเมนต์</span>
              </button>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current" title={tournament.title}>
                {tournament.game}
              </span>
            </nav>
          </div>

          {/* WordPress Clean Permalink Indicator & Copy */}
          <div className="wordpress-clean-permalink-badge">
            <Globe size={13} className="text-blue" />
            <span className="permalink-text">
              /tournaments/<strong style={{ color: '#1d4ed8' }}>{cleanSlug}</strong>
            </span>
            <button
              type="button"
              className="btn-copy-permalink"
              onClick={() => {
                navigator.clipboard.writeText(canonicalUrl);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2500);
              }}
              title="คัดลอก Clean Permalink สำหรับแชร์บนโซเชียล"
            >
              {copiedLink ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
              <span>{copiedLink ? 'คัดลอกแล้ว ✓' : 'คัดลอกลิงก์'}</span>
            </button>
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
                fontWeight: 800, 
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
              {liveMatches.length > 0 ? (
                <span style={{ 
                  background: 'linear-gradient(135deg, #dc2626, #ef4444)', 
                  color: '#ffffff', 
                  fontWeight: 800, 
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
              ) : isRegistrationOpen ? (
                <span style={{ 
                  background: 'linear-gradient(135deg, #059669, #10b981)', 
                  color: '#ffffff', 
                  fontWeight: 800, 
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
              ) : tournament.status === 'Completed' ? (
                <span style={{ 
                  background: '#334155', 
                  color: '#e2e8f0', 
                  fontWeight: 700, 
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
                  fontWeight: 800, 
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
              {tournament.title}
            </h1>

            {/* Metadata Info Grid */}
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

              <div className="hero-metric-card">
                <div className="metric-icon-wrap" style={{ background: 'rgba(192, 132, 252, 0.2)', color: '#c084fc', border: '1px solid rgba(192, 132, 252, 0.4)' }}>
                  <Radio size={20} />
                </div>
                <div>
                  <span className="metric-label" style={{ color: '#e9d5ff' }}>ช่องทางถ่ายทอดสด</span>
                  <div className="metric-value" style={{ fontSize: '0.88rem' }}>
                    {tournament.streamChannel || 'YouTube & Twitch @GSpeedEsport'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons with High-Contrast, Gorgeous Styling */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
              {/* Primary Action Button */}
              {isRegistrationOpen ? (
                <a 
                  href={lineOaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    padding: '13px 26px', 
                    background: 'linear-gradient(135deg, #06c755 0%, #00a843 100%)', 
                    color: '#ffffff', 
                    borderRadius: '10px', 
                    fontWeight: 800, 
                    fontSize: '1rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 18px rgba(6, 199, 85, 0.45)',
                    border: '1px solid #34d399',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-lift"
                >
                  <MessageCircle size={18} />
                  <span>สมัครแข่งขันผ่าน LINE OA</span>
                  <ExternalLink size={14} style={{ opacity: 0.8 }} />
                </a>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setActiveTab('bracket')}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '13px 24px', 
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
                    color: '#ffffff', 
                    borderRadius: '10px', 
                    fontWeight: 800, 
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
                    border: '1px solid #60a5fa',
                    cursor: 'pointer'
                  }}
                >
                  <Trophy size={16} />
                  <span>ดูสรุปผลการแข่งขัน & แชมป์</span>
                </button>
              )}

              {/* Bracket Button */}
              <button 
                type="button" 
                onClick={() => setActiveTab('bracket')}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '13px 22px', 
                  background: '#ffffff', 
                  color: '#1d4ed8', 
                  borderRadius: '10px', 
                  fontWeight: 700, 
                  fontSize: '0.92rem', 
                  border: '1px solid #bfdbfe', 
                  boxShadow: '0 2px 10px rgba(0,0,0,0.15)', 
                  cursor: 'pointer' 
                }}
              >
                <GitBranch size={16} />
                <span>สายการแข่งขัน & ผลสด</span>
              </button>

              {/* Share Button */}
              <button 
                type="button" 
                onClick={() => {
                  navigator.clipboard.writeText(canonicalUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '13px 20px', 
                  background: 'rgba(255, 255, 255, 0.95)', 
                  color: '#0f172a', 
                  borderRadius: '10px', 
                  fontWeight: 700, 
                  fontSize: '0.92rem', 
                  border: '1px solid #cbd5e1', 
                  boxShadow: '0 2px 10px rgba(0,0,0,0.15)', 
                  cursor: 'pointer' 
                }}
              >
                <Share2 size={16} />
                <span>{copiedLink ? 'คัดลอกลิงก์แล้ว ✓' : 'แชร์ทัวร์นาเมนต์'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABS NAVIGATION BAR (STICKY) */}
      <div className="tournament-tabs-bar">
        <div className="container tabs-inner-scroll">
          {[
            { id: 'overview', label: 'ภาพรวม & กติกา & รางวัล', icon: <Award size={16} /> },
            { id: 'schedule', label: 'กำหนดการ & วันที่', icon: <Calendar size={16} /> },
            { 
              id: 'bracket', 
              label: liveMatches.length > 0 ? `สายแข่ง & ผลสด (${matches.length}) 🔴 LIVE` : `สายแข่ง & ผลสด (${matches.length})`, 
              icon: <GitBranch size={16} />,
              highlight: liveMatches.length > 0
            },
            { id: 'roster', label: `รายชื่อทีม & ไลน์อัป (${teamsList.length})`, icon: <Users size={16} /> },
            { id: 'gallery', label: `คลังภาพกิจกรรม & ไฮไลต์ (${photosList.length})`, icon: <Camera size={16} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`tourney-tab-item ${activeTab === tab.id ? 'active' : ''} ${tab.highlight ? 'highlight' : ''}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN BODY CONTAINER */}
      <div className="container" style={{ padding: '36px 20px 60px' }}>
        
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
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ background: '#06c755', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800 }}>
                      LINE OFFICIAL
                    </span>
                    <strong style={{ fontSize: '1.15rem', color: '#14532d' }}>
                      ช่องทางรับสมัครนักกีฬา & ส่งรายชื่อทีม
                    </strong>
                  </div>
                  <p style={{ margin: 0, color: '#166534', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    ไม่ต้องลงทะเบียนผ่านหน้าเว็บให้ยุ่งยาก เพียงทักแชต LINE Official เพื่อขอรับแบบฟอร์ม ส่งรายชื่อผู้เล่น และรับการยืนยันสิทธิ์จากทีมงาน G-Speed โดยตรง
                  </p>
                </div>
                <a 
                  href={lineOaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    background: '#06c755', 
                    color: '#ffffff', 
                    padding: '13px 24px', 
                    borderRadius: '10px', 
                    fontWeight: 800, 
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(6, 199, 85, 0.35)',
                    flexShrink: 0
                  }}
                >
                  <MessageCircle size={18} />
                  <span>เปิด LINE เพื่อสมัครแข่งขัน</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

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
                    <strong className="prize-reward-text">
                      {pz.reward}
                    </strong>
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
                <h4 style={{ margin: '4px 0 6px 0', fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  มาตรฐานสนามแข่งขันระดับ World Class LAN Arena
                </h4>
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                  ทุกสเตชันขับเคลื่อนด้วยขุมพลัง Intel Core i9 + NVIDIA GeForce RTX 40 Series, จอเกมมิ่ง BenQ ZOWIE 360Hz Fast-IPS พร้อมระบบ Dedicated Multi-WAN 10Gbps ลื่นไหลไร้อาการหน่วง
                </p>
              </div>
              {isRegistrationOpen && (
                <a 
                  href={lineOaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-white-action"
                  style={{ textDecoration: 'none' }}
                >
                  <MessageCircle size={16} />
                  <span>สมัครผ่าน LINE OA</span>
                </a>
              )}
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
                    <div style={{ background: '#2563eb', color: '#ffffff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, flexShrink: 0 }}>
                      {rIdx + 1}
                    </div>
                    <span style={{ fontSize: '0.94rem', color: '#334155', lineHeight: 1.6 }}>
                      {rule}
                    </span>
                  </div>
                ))}
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
                    <div style={{ minWidth: '130px', fontWeight: 800, color: '#1d4ed8', fontSize: '0.95rem' }}>
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

            {/* Matches List or Tree */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {matches.map((m, idx) => (
                <div 
                  key={m.id || idx}
                  style={{ 
                    background: '#ffffff', 
                    borderRadius: '12px', 
                    border: m.status === 'LIVE' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxShadow: m.status === 'LIVE' ? '0 4px 16px rgba(239, 68, 68, 0.15)' : '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  {/* Match Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
                      {m.roundLabel || m.round || `แมตช์ที่ ${idx + 1}`}
                    </span>
                    <span 
                      style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        padding: '2px 8px', 
                        borderRadius: '20px',
                        background: m.status === 'LIVE' ? '#fee2e2' : m.status === 'Completed' ? '#dcfce7' : '#f1f5f9',
                        color: m.status === 'LIVE' ? '#dc2626' : m.status === 'Completed' ? '#16a34a' : '#64748b'
                      }}
                    >
                      {m.status === 'LIVE' ? '🔴 กำลังแข่งสด' : m.status === 'Completed' ? '✓ แข่งเสร็จสิ้น' : 'รอแข่งขัน'}
                    </span>
                  </div>

                  {/* Team A vs Team B */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Team A */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: m.teamA?.isWinner ? '#f0fdf4' : '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                      <span style={{ fontWeight: m.teamA?.isWinner ? 800 : 600, color: '#0f172a', fontSize: '0.92rem' }}>
                        {m.teamA?.name || 'รอผลการประกบคู่'}
                      </span>
                      <strong style={{ fontSize: '1.1rem', color: m.teamA?.isWinner ? '#16a34a' : '#475569' }}>
                        {m.teamA?.score ?? '-'}
                      </strong>
                    </div>

                    {/* Team B */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: m.teamB?.isWinner ? '#f0fdf4' : '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                      <span style={{ fontWeight: m.teamB?.isWinner ? 800 : 600, color: '#0f172a', fontSize: '0.92rem' }}>
                        {m.teamB?.name || 'รอผลการประกบคู่'}
                      </span>
                      <strong style={{ fontSize: '1.1rem', color: m.teamB?.isWinner ? '#16a34a' : '#475569' }}>
                        {m.teamB?.score ?? '-'}
                      </strong>
                    </div>
                  </div>

                  {/* Match Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                    <span>{m.time || '14:00 น.'}</span>
                    <span>{m.format || 'BO3'}</span>
                  </div>
                </div>
              ))}
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
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
                style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}
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
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.4 }}>
                      {relTour.title}
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                      <span style={{ color: '#b45309', fontWeight: 700 }}>
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

      </div>

      {/* Lightbox Modal for Gallery */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div 
          className="modal-backdrop" 
          onClick={() => setLightboxIndex(null)}
          style={{ zIndex: 10050, background: 'rgba(0,0,0,0.92)' }}
        >
          <div style={{ position: 'relative', maxWidth: '1000px', width: '92vw', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <img 
              src={filteredPhotos[lightboxIndex].url || filteredPhotos[lightboxIndex]} 
              alt="Tournament Lightbox"
              style={{ maxHeight: '80vh', maxWidth: '100%', objectFit: 'contain', borderRadius: '10px' }}
            />
            <div style={{ color: '#ffffff', marginTop: '12px', fontSize: '0.95rem' }}>
              {filteredPhotos[lightboxIndex].caption || `ภาพที่ ${lightboxIndex + 1}`}
            </div>
            <button 
              type="button" 
              onClick={() => setLightboxIndex(null)}
              style={{ position: 'absolute', top: '-40px', right: 0, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
