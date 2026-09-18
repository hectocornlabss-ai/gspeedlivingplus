import React, { useState } from 'react';
import { 
  X, Trophy, Calendar, MapPin, Globe, Copy, Check, Award, 
  Users, Camera, Send, Zap, Clock, Shield, CheckCircle2, 
  Crown, Plus, ArrowRight, ChevronLeft, ChevronRight, Home,
  GitBranch, Flame, Play, ExternalLink, RefreshCw, Radio, Swords, Eye
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { generateDefaultBracket } from '../data/mockData';

export default function TournamentDetailModal({
  tournament,
  initialTab = 'overview',
  onClose = () => {},
  onNavigateHome = () => {},
  onNavigateTournaments = () => {},
  onRegisterTeam
}) {
  if (!tournament) return null;

  const { addTournamentApplication } = useSiteData();
  const [tourneyModalTab, setTourneyModalTab] = useState(initialTab);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [tourneyGalleryCategory, setTourneyGalleryCategory] = useState('all');
  const [rosterSearch, setRosterSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Bracket state
  const [selectedMatchDetail, setSelectedMatchDetail] = useState(null);
  const [bracketViewMode, setBracketViewMode] = useState('tree'); // 'tree' | 'list'
  const [bracketRoundFilter, setBracketRoundFilter] = useState('all');

  const matches = (tournament.bracketMatches && tournament.bracketMatches.length > 0)
    ? tournament.bracketMatches
    : generateDefaultBracket(tournament.teams, tournament.title);

  const liveMatches = matches.filter(m => m.status === 'LIVE');

  // Registration Form State
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

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newTeam = {
      id: `team-${Date.now()}`,
      name: teamRegForm.teamName,
      tag: teamRegForm.teamTag || teamRegForm.teamName.slice(0, 3).toUpperCase(),
      logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
      seed: (tournament.teams || []).length + 1,
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

    if (addTournamentApplication) {
      addTournamentApplication({
        tournamentId: tournament.id,
        tournamentTitle: tournament.title,
        teamName: teamRegForm.teamName,
        teamTag: teamRegForm.teamTag || teamRegForm.teamName.slice(0, 3).toUpperCase(),
        logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
        captainName: teamRegForm.captainName,
        captainPhone: teamRegForm.captainPhone,
        captainEmail: teamRegForm.captainEmail,
        captainDiscord: teamRegForm.captainDiscord,
        players: [
          teamRegForm.captainName,
          teamRegForm.player2 || 'Player 2',
          teamRegForm.player3 || 'Player 3',
          teamRegForm.player4 || 'Player 4',
          teamRegForm.player5 || 'Player 5'
        ].filter(Boolean),
        substitutes: teamRegForm.substitute ? [teamRegForm.substitute] : [],
        status: 'Pending'
      });
    }

    if (onRegisterTeam) {
      onRegisterTeam(tournament.id, newTeam);
    }
    setRegisterSuccess(true);
  };

  const isRegistrationOpen = tournament.status === 'Open';

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{ zIndex: 10010 }}
    >
      <div 
        className="modal-dialog tournament-hub-modal" 
        onClick={e => e.stopPropagation()}
      >
        {/* 1. Modal Hero Header - Fixed, NO collapsing or shrinking */}
        <div 
          className="tourney-modal-header"
          style={{ 
            background: tournament.bannerImage 
              ? `url(${tournament.bannerImage}) center/cover no-repeat` 
              : 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
          }}
        >
          <div className="tourney-header-overlay" />
          
          {/* Top Row: Tags & Close button */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2, marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="t-game-tag">
                {tournament.game}
              </span>
              {tournament.gameCategory && (
                <span className="t-category-tag">
                  {tournament.gameCategory}
                </span>
              )}
              {isRegistrationOpen ? (
                <span className="badge-live-pulse">
                  <span className="live-ping-wrapper">
                    <span className="live-ping-ring" />
                    <span className="live-ping-core" />
                  </span>
                  <span>{tournament.badge || 'เปิดรับสมัครด่วน'}</span>
                </span>
              ) : (
                <span className="t-status-full-tag">
                  {tournament.badge || 'เต็มแล้ว'}
                </span>
              )}
            </div>

            <button 
              type="button" 
              className="btn-icon-close" 
              onClick={onClose}
              style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              title="ปิดหน้าต่าง"
            >
              <X size={18} />
            </button>
          </div>

          {/* Middle Row: Interactive Functional Breadcrumbs & Clean Link (MATCHES SCREENSHOT 2) */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <nav className="tourney-breadcrumb-nav" aria-label="Breadcrumb">
              <button 
                type="button" 
                className="tourney-breadcrumb-link"
                onClick={onNavigateHome}
                title="คลิกเพื่อกลับไปยังหน้าแรก"
              >
                <span>หน้าหลัก</span>
              </button>
              <span className="tourney-breadcrumb-sep">/</span>
              <button 
                type="button" 
                className="tourney-breadcrumb-link"
                onClick={onNavigateTournaments}
                title="คลิกเพื่อไปที่ตารางการแข่งขัน"
              >
                <span>การแข่งขัน & อีเวนต์</span>
              </button>
              <span className="tourney-breadcrumb-sep">/</span>
              <span className="tourney-breadcrumb-current">
                {tournament.game}
              </span>
            </nav>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', background: 'rgba(0,0,0,0.5)', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Globe size={12} className="text-cyan" />
              <span style={{ fontFamily: 'monospace', color: '#93c5fd' }}>/events/{tournament.slug || tournament.id}</span>
              <button
                type="button"
                onClick={() => {
                  const cleanUrl = `${window.location.origin}/events/${tournament.slug || tournament.id}`;
                  navigator.clipboard.writeText(cleanUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }}
                style={{ background: copiedLink ? '#10b981' : 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '2px 8px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 600 }}
                title="คัดลอก Clean URL สำหรับแชร์บน Facebook, LINE, Discord"
              >
                {copiedLink ? <Check size={11} /> : <Copy size={11} />}
                <span>{copiedLink ? 'คัดลอกแล้ว ✓' : 'คัดลอก Clean Link'}</span>
              </button>
            </div>
          </div>

          {/* Title & Metadata chips */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '2px 0 10px 0', textShadow: '0 2px 10px rgba(0,0,0,0.7)', color: '#ffffff', letterSpacing: '-0.3px' }}>
              {tournament.title}
            </h2>
            <div className="tourney-meta-chips">
              <div className="tourney-meta-chip">
                <Trophy size={15} className="text-amber" />
                <span>เงินรางวัลรวม: <strong className="text-amber" style={{ fontSize: '0.92rem' }}>{tournament.prizePool}</strong></span>
              </div>
              <div className="tourney-meta-chip">
                <Calendar size={15} className="text-cyan" />
                <span>{tournament.date} ({tournament.time})</span>
              </div>
              <div className="tourney-meta-chip">
                <MapPin size={15} className="text-blue" />
                <span>{tournament.venue || 'GLP : G Speed Living Plus รามคำแหง 53'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Modal Navigation Tabs - Stable and Locked in place */}
        <div className="tourney-hub-nav">
          {[
            { id: 'overview', label: 'ภาพรวม & กติกา & รางวัล', icon: <Award size={15} /> },
            { id: 'schedule', label: 'กำหนดการ & วันที่', icon: <Calendar size={15} /> },
            { 
              id: 'bracket', 
              label: liveMatches.length > 0 ? `สายแข่ง & ผลสด (${matches.length}) 🔴 LIVE` : `สายแข่ง & ผลสด (${matches.length})`, 
              icon: <GitBranch size={15} />,
              highlight: liveMatches.length > 0
            },
            { id: 'roster', label: `รายชื่อทีม (${(tournament.teams || []).length})`, icon: <Users size={15} /> },
            { id: 'gallery', label: `คลังภาพกิจกรรม (${(tournament.galleryPhotos || []).length})`, icon: <Camera size={15} /> },
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
                fontSize: '0.84rem', 
                fontWeight: 600, 
                border: 'none', 
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                background: tourneyModalTab === tab.id 
                  ? '#1d4ed8' 
                  : (tab.id === 'bracket' && liveMatches.length > 0)
                    ? '#fee2e2'
                    : tab.highlight 
                      ? '#fef3c7' 
                      : '#f1f5f9',
                color: tourneyModalTab === tab.id 
                  ? '#ffffff' 
                  : (tab.id === 'bracket' && liveMatches.length > 0)
                    ? '#b91c1c'
                    : tab.highlight 
                      ? '#b45309' 
                      : '#475569',
                boxShadow: tourneyModalTab === tab.id ? '0 4px 12px rgba(29, 78, 216, 0.25)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 3. Modal Body Content - Fixed scroll container */}
        <div className="tourney-hub-body">
          {/* TAB 1: OVERVIEW & RULES */}
          {tourneyModalTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* About Tournament Story */}
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} className="text-blue" />
                  <span>เกี่ยวกับรายการแข่งขัน</span>
                </h4>
                <p style={{ margin: 0, lineHeight: 1.7, color: '#475569', fontSize: '0.92rem' }}>
                  {tournament.desc || 'การแข่งขันอีสปอร์ตสุดยิ่งใหญ่ รวบรวมยอดฝีมือทั่วประเทศมาร่วมประลองความแม่นยำบนเวที LAN Final ณ GLP : G Speed Living Plus รามคำแหง 53 ชิงเงินรางวัลและถ้วยเกียรติยศ พร้อมถ่ายทอดสดด้วยโปรดักชันระดับสตูดิโอ'}
                </p>
              </div>

              {/* Prize Pool Distribution */}
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy size={18} className="text-amber" />
                  <span>โครงสร้างเงินรางวัล (Prize Pool Distribution)</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  {(tournament.prizeDistribution || [
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

              {/* Hardware Specs Box (MATCHES USER SCREENSHOT 1 EXACTLY) */}
              <div className="tourney-specs-box">
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <span className="badge-pill badge-white" style={{ marginBottom: '8px', display: 'inline-block' }}>
                    OFFICIAL TOURNAMENT SPECS
                  </span>
                  <h4 style={{ margin: '4px 0 6px 0', fontSize: '1.08rem', fontWeight: 800, color: '#ffffff' }}>
                    มาตรฐานสนามแข่งขันระดับ World Class LAN Arena
                  </h4>
                  <span style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5, display: 'block' }}>
                    Intel Core i9 • RTX 4080 SUPER • BenQ ZOWIE 360Hz Fast-IPS • 10Gbps Latency 0.5ms • Soundproof Booths
                  </span>
                </div>
                
                {/* HIGH-CONTRAST VISIBLE CTA BUTTON */}
                <button 
                  type="button" 
                  className="tourney-specs-cta-btn" 
                  onClick={() => setTourneyModalTab('register')}
                  title="คลิกเพื่อลงทะเบียนเข้าร่วมแข่งขัน"
                  style={{ background: '#ffffff', color: '#1d4ed8', border: '1.5px solid #e2e8f0' }}
                >
                  <span style={{ color: '#1d4ed8', fontWeight: 800, fontSize: '0.94rem' }}>สมัครลงแข่งรอบนี้</span>
                  <ArrowRight size={16} color="#1d4ed8" />
                </button>
              </div>

              {/* Official Rules Checklist */}
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} className="text-blue" />
                  <span>กติกาและข้อบังคับอย่างเป็นทางการ (Official Tournament Rules)</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(tournament.rules || [
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
                <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d4ed8', marginBottom: '8px' }}>
                    <Clock size={16} />
                    <strong>ช่วงเวลารับสมัคร (Registration Period)</strong>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    {tournament.regStartDate || '1 กันยายน 2026'} - {tournament.regEndDate || '25 กันยายน 2026'}
                  </div>
                  <span className="text-xs text-muted block" style={{ marginTop: '4px' }}>
                    รับสมัครจำนวนจำกัด {tournament.slots} ปิดรับเมื่อเต็ม
                  </span>
                </div>

                <div style={{ background: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '8px' }}>
                    <Calendar size={16} />
                    <strong>วันแข่งขันจริง (Tournament Days)</strong>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    {tournament.date}
                  </div>
                  <span className="text-xs text-muted block" style={{ marginTop: '4px' }}>
                    เวลา {tournament.time} @ {tournament.venue || 'G-Speed Main Stage'}
                  </span>
                </div>
              </div>

              {/* Match Timetable */}
              <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} className="text-blue" />
                  <span>ตารางการแข่งขันรายรอบ (Match Timetable)</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(tournament.scheduleTimetable || [
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

          {/* TAB 3: BRACKET & MATCH RESULTS */}
          {tourneyModalTab === 'bracket' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Bracket Header Toolbar */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '12px',
                background: '#ffffff',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GitBranch size={20} color="#2563eb" />
                    <span>ผังสายการแข่งขัน & ผลสด (Tournament Bracket)</span>
                  </h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    รูปแบบ: {tournament.format || 'Double Elimination LAN'} • ระบบ Best of 3 / 5
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {liveMatches.length > 0 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#fee2e2',
                      color: '#b91c1c',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}>
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        background: '#ef4444', 
                        boxShadow: '0 0 8px #ef4444' 
                      }} />
                      <span>มีการแข่งขันสด {liveMatches.length} แมตช์</span>
                    </div>
                  )}

                  {/* View Mode Toggle */}
                  <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <button
                      type="button"
                      onClick={() => setBracketViewMode('tree')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: bracketViewMode === 'tree' ? '#ffffff' : 'transparent',
                        color: bracketViewMode === 'tree' ? '#1d4ed8' : '#64748b',
                        boxShadow: bracketViewMode === 'tree' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      <GitBranch size={14} />
                      <span>ผังต้นไม้ (Tree)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBracketViewMode('list')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: bracketViewMode === 'list' ? '#ffffff' : 'transparent',
                        color: bracketViewMode === 'list' ? '#1d4ed8' : '#64748b',
                        boxShadow: bracketViewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      <Swords size={14} />
                      <span>รายการแมตช์ (Cards)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* View 1: Bracket Tree Flow */}
              {bracketViewMode === 'tree' && (
                <div style={{
                  background: 'linear-gradient(135deg, #090e1a 0%, #0f172a 100%)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid #1e293b',
                  overflowX: 'auto',
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(290px, 1fr))',
                    gap: '24px',
                    minWidth: '920px'
                  }}>
                    {/* Column 1: Quarter-Finals */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: 'rgba(30, 41, 59, 0.7)',
                        borderRadius: '8px',
                        borderLeft: '4px solid #3b82f6',
                        color: '#93c5fd',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}>
                        <span>รอบ 8 ทีม (Quarter-Finals)</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>BO3 LAN</span>
                      </div>

                      {matches.filter(m => m.round === 'Quarter-Finals').map(match => (
                        <div
                          key={match.id}
                          onClick={() => setSelectedMatchDetail(match)}
                          style={{
                            background: match.status === 'LIVE' ? 'rgba(30, 27, 75, 0.85)' : 'rgba(15, 23, 42, 0.85)',
                            border: match.status === 'LIVE' ? '1px solid #f43f5e' : '1px solid #334155',
                            borderRadius: '10px',
                            padding: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: match.status === 'LIVE' ? '0 0 16px rgba(244, 63, 94, 0.25)' : 'none'
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#38bdf8'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = match.status === 'LIVE' ? '#f43f5e' : '#334155'}
                        >
                          {/* Match Top meta */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.74rem' }}>
                            <span style={{ color: '#94a3b8', fontWeight: 600 }}>{match.roundLabel || match.title}</span>
                            {match.status === 'LIVE' ? (
                              <span style={{ background: '#e11d48', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
                                LIVE
                              </span>
                            ) : match.status === 'Finished' ? (
                              <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Check size={12} /> จบแล้ว
                              </span>
                            ) : (
                              <span style={{ color: '#64748b' }}>{match.time}</span>
                            )}
                          </div>

                          {/* Team A */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            background: match.teamA?.isWinner ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                            marginBottom: '4px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {match.teamA?.logo ? (
                                <img src={match.teamA.logo} alt="" style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.7rem' }}>A</div>
                              )}
                              <span style={{ color: match.teamA?.isWinner ? '#60a5fa' : '#f8fafc', fontWeight: match.teamA?.isWinner ? 700 : 500, fontSize: '0.85rem' }}>
                                {match.teamA?.name || 'TBD'}
                              </span>
                            </div>
                            <span style={{
                              fontWeight: 800,
                              fontSize: '0.95rem',
                              color: match.teamA?.isWinner ? '#38bdf8' : '#94a3b8',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: match.teamA?.isWinner ? 'rgba(56, 189, 248, 0.15)' : 'transparent'
                            }}>
                              {match.teamA?.score ?? 0}
                            </span>
                          </div>

                          {/* Team B */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            background: match.teamB?.isWinner ? 'rgba(37, 99, 235, 0.2)' : 'transparent'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {match.teamB?.logo ? (
                                <img src={match.teamB.logo} alt="" style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.7rem' }}>B</div>
                              )}
                              <span style={{ color: match.teamB?.isWinner ? '#60a5fa' : '#f8fafc', fontWeight: match.teamB?.isWinner ? 700 : 500, fontSize: '0.85rem' }}>
                                {match.teamB?.name || 'TBD'}
                              </span>
                            </div>
                            <span style={{
                              fontWeight: 800,
                              fontSize: '0.95rem',
                              color: match.teamB?.isWinner ? '#38bdf8' : '#94a3b8',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: match.teamB?.isWinner ? 'rgba(56, 189, 248, 0.15)' : 'transparent'
                            }}>
                              {match.teamB?.score ?? 0}
                            </span>
                          </div>

                          {/* Footer details hint */}
                          <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(51, 65, 85, 0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#64748b' }}>
                            <span>{match.stage || 'Main Stage'}</span>
                            <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '2px' }}>
                              คลิกดูรายละเอียด <ChevronRight size={12} />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column 2: Semi-Finals */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: 'rgba(30, 41, 59, 0.7)',
                        borderRadius: '8px',
                        borderLeft: '4px solid #8b5cf6',
                        color: '#c4b5fd',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}>
                        <span>รอบรองชนะเลิศ (Semi-Finals)</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>BO3 LAN</span>
                      </div>

                      {matches.filter(m => m.round === 'Semi-Finals').map(match => (
                        <div
                          key={match.id}
                          onClick={() => setSelectedMatchDetail(match)}
                          style={{
                            background: match.status === 'LIVE' ? 'rgba(30, 27, 75, 0.85)' : 'rgba(15, 23, 42, 0.85)',
                            border: match.status === 'LIVE' ? '1px solid #f43f5e' : '1px solid #334155',
                            borderRadius: '10px',
                            padding: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            margin: '10px 0'
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#a855f7'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = match.status === 'LIVE' ? '#f43f5e' : '#334155'}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.74rem' }}>
                            <span style={{ color: '#94a3b8', fontWeight: 600 }}>{match.roundLabel || match.title}</span>
                            <span style={{ color: '#64748b' }}>{match.time}</span>
                          </div>

                          {/* Team A */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px',
                            borderRadius: '6px',
                            background: match.teamA?.isWinner ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                            marginBottom: '4px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {match.teamA?.logo ? (
                                <img src={match.teamA.logo} alt="" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.7rem' }}>A</div>
                              )}
                              <span style={{ color: match.teamA?.name ? '#f8fafc' : '#64748b', fontWeight: match.teamA?.isWinner ? 700 : 500, fontSize: '0.88rem' }}>
                                {match.teamA?.name || 'ผู้ชนะ QF'}
                              </span>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: match.teamA?.isWinner ? '#a855f7' : '#94a3b8' }}>
                              {match.teamA?.score ?? 0}
                            </span>
                          </div>

                          {/* Team B */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px',
                            borderRadius: '6px',
                            background: match.teamB?.isWinner ? 'rgba(139, 92, 246, 0.2)' : 'transparent'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {match.teamB?.logo ? (
                                <img src={match.teamB.logo} alt="" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.7rem' }}>B</div>
                              )}
                              <span style={{ color: match.teamB?.name ? '#f8fafc' : '#64748b', fontWeight: match.teamB?.isWinner ? 700 : 500, fontSize: '0.88rem' }}>
                                {match.teamB?.name || 'ผู้ชนะ QF'}
                              </span>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: match.teamB?.isWinner ? '#a855f7' : '#94a3b8' }}>
                              {match.teamB?.score ?? 0}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column 3: Grand Final & Championship Podium */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%)',
                        borderRadius: '8px',
                        borderLeft: '4px solid #eab308',
                        color: '#fde047',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Crown size={16} color="#eab308" /> รอบชิงชนะเลิศ (Grand Final)
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#fef08a' }}>BO5</span>
                      </div>

                      {matches.filter(m => m.round === 'Grand Final').map(match => (
                        <div
                          key={match.id}
                          onClick={() => setSelectedMatchDetail(match)}
                          style={{
                            background: 'rgba(23, 23, 23, 0.95)',
                            border: '2px solid #eab308',
                            borderRadius: '14px',
                            padding: '18px',
                            cursor: 'pointer',
                            boxShadow: '0 0 30px rgba(234, 179, 8, 0.15)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {/* Trophy Watermark */}
                          <div style={{ position: 'absolute', right: '-15px', bottom: '-15px', opacity: 0.08, pointerEvents: 'none' }}>
                            <Trophy size={140} color="#eab308" />
                          </div>

                          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(234, 179, 8, 0.2)', color: '#fef08a', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                              <Trophy size={13} /> ชิงเงินรางวัล ฿{tournament.prizePool || '100,000'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                              {match.time} • {match.stage}
                            </div>
                          </div>

                          {/* Grand Final Teams */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Crown size={16} color="#eab308" />
                                <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.92rem' }}>
                                  {match.teamA?.name || 'ผู้ชนะ Semi-Final 1'}
                                </span>
                              </div>
                              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#eab308' }}>
                                {match.teamA?.score ?? 0}
                              </span>
                            </div>

                            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>VS</div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Crown size={16} color="#eab308" />
                                <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.92rem' }}>
                                  {match.teamB?.name || 'ผู้ชนะ Semi-Final 2'}
                                </span>
                              </div>
                              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#eab308' }}>
                                {match.teamB?.score ?? 0}
                              </span>
                            </div>
                          </div>

                          <div style={{ marginTop: '14px', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                              คลิกเพื่อดูสถิติและช่องทางสตรีมสด
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Match List Cards */}
              {bracketViewMode === 'list' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Round Filter Tabs */}
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {[
                      { id: 'all', label: 'แมตช์ทั้งหมด' },
                      { id: 'Quarter-Finals', label: 'รอบ 8 ทีม (Quarter-Finals)' },
                      { id: 'Semi-Finals', label: 'รอบ 4 ทีม (Semi-Finals)' },
                      { id: 'Grand Final', label: 'รอบชิงชนะเลิศ (Grand Final)' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setBracketRoundFilter(tab.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: '1px solid',
                          borderColor: bracketRoundFilter === tab.id ? '#2563eb' : '#e2e8f0',
                          background: bracketRoundFilter === tab.id ? '#2563eb' : '#ffffff',
                          color: bracketRoundFilter === tab.id ? '#ffffff' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                    {matches
                      .filter(m => bracketRoundFilter === 'all' || m.round === bracketRoundFilter)
                      .map(match => (
                        <div
                          key={match.id}
                          onClick={() => setSelectedMatchDetail(match)}
                          style={{
                            background: '#ffffff',
                            borderRadius: '12px',
                            border: match.status === 'LIVE' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                            padding: '16px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1d4ed8' }}>
                              {match.roundLabel || match.title}
                            </span>
                            {match.status === 'LIVE' ? (
                              <span style={{ background: '#ef4444', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                                🔴 LIVE
                              </span>
                            ) : match.status === 'Finished' ? (
                              <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
                                จบการแข่งขัน
                              </span>
                            ) : (
                              <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 600 }}>
                                {match.time}
                              </span>
                            )}
                          </div>

                          {/* Match Head-to-Head */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: match.teamA?.isWinner ? 800 : 600, color: match.teamA?.isWinner ? '#1d4ed8' : '#0f172a' }}>
                                {match.teamA?.name || 'TBD'}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Seed #{match.teamA?.seed || '-'}</span>
                            </div>
                            <div style={{ padding: '0 12px', textAlign: 'center' }}>
                              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                                {match.teamA?.score ?? 0} - {match.teamB?.score ?? 0}
                              </span>
                              <span style={{ display: 'block', fontSize: '0.68rem', color: '#64748b' }}>{match.format || 'BO3'}</span>
                            </div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                              <div style={{ fontWeight: match.teamB?.isWinner ? 800 : 600, color: match.teamB?.isWinner ? '#1d4ed8' : '#0f172a' }}>
                                {match.teamB?.name || 'TBD'}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Seed #{match.teamB?.seed || '-'}</span>
                            </div>
                          </div>

                          {/* Maps Played */}
                          {match.maps && match.maps.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {match.maps.map((mp, idx) => (
                                <span key={idx} style={{ background: mp.isCurrent ? '#fee2e2' : '#f1f5f9', color: mp.isCurrent ? '#b91c1c' : '#475569', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                  {mp.mapName}: {mp.scoreA}-{mp.scoreB}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* MVP badge */}
                          {match.mvp && (
                            <div style={{ fontSize: '0.76rem', color: '#b45309', background: '#fef3c7', padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Award size={14} />
                              <span>MVP: <strong>{match.mvp.name}</strong> ({match.mvp.teamTag}) • {match.mvp.stats}</span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ROSTER & TEAMS */}
          {tourneyModalTab === 'roster' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                    ทีมที่ได้รับการยืนยันสิทธิ์ ({(tournament.teams || []).length} ทีม)
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
                {(tournament.teams || [])
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
                        borderRadius: '12px', 
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
              {/* Gallery Header Banner */}
              <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Camera size={22} className="text-blue" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: '1.02rem', color: '#0f172a' }}>
                      คลังภาพบรรยากาศการแข่งขัน: {(tournament.galleryPhotos || []).length} ภาพ
                    </strong>
                    <span className="text-xs text-muted block" style={{ marginTop: '2px' }}>
                      คลิกที่รูปภาพเพื่อเปิดชมภาพขยายเต็มจอ (Fullscreen Lightbox) ความละเอียดสูง
                    </span>
                  </div>
                </div>

                {/* Category Filter Pills - Smooth Horizontal Scroll */}
                <div className="tourney-gallery-filters">
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
                      style={{ padding: '5px 14px', fontSize: '0.78rem', whiteSpace: 'nowrap', flexShrink: 0, borderRadius: '999px' }}
                      onClick={() => setTourneyGalleryCategory(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photos Grid */}
              <div className="tourney-gallery-grid">
                {(tournament.galleryPhotos || [])
                  .filter(p => tourneyGalleryCategory === 'all' || p.category === tourneyGalleryCategory)
                  .map((photo, pidx) => (
                    <div 
                      key={photo.id || pidx}
                      onClick={() => setLightboxIndex(pidx)}
                      className="gallery-thumb-card"
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.caption}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.88) 0%, transparent 55%)', pointerEvents: 'none' }} />
                      <span style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, border: '1px solid rgba(255,255,255,0.15)' }}>
                        #{pidx + 1}
                      </span>
                      <div style={{ position: 'absolute', bottom: '6px', left: '8px', right: '8px', fontSize: '0.72rem', color: '#ffffff', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
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
                      onClick={onClose}
                    >
                      ปิดหน้าต่าง
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} style={{ background: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#0f172a' }}>
                      แบบฟอร์มสมัครเข้าร่วมแข่งขัน: {tournament.title}
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
                      onClick={onClose}
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

      {/* 4. FULLSCREEN PHOTO LIGHTBOX */}
      {lightboxIndex !== null && tournament?.galleryPhotos?.[lightboxIndex] && (
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
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{tournament.title}</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                ภาพที่ {lightboxIndex + 1} จาก {tournament.galleryPhotos.length}
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
              src={tournament.galleryPhotos[lightboxIndex].url} 
              alt={tournament.galleryPhotos[lightboxIndex].caption}
              style={{ maxWidth: '100%', maxHeight: '78vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}
            />

            {/* Prev Button */}
            {lightboxIndex > 0 && (
              <button 
                type="button"
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                style={{ position: 'absolute', left: '12px', zIndex: 10, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="ภาพก่อนหน้า"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Next Button */}
            {lightboxIndex < tournament.galleryPhotos.length - 1 && (
              <button 
                type="button"
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                style={{ position: 'absolute', right: '12px', zIndex: 10, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="ภาพถัดไป"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Caption */}
          <div 
            style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', margin: '0 auto', textAlign: 'center', color: '#ffffff', maxWidth: '700px', fontSize: '0.88rem', background: 'rgba(15,23,42,0.82)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 18px', borderRadius: '20px', backdropFilter: 'blur(8px)' }}
            onClick={e => e.stopPropagation()}
          >
            {tournament.galleryPhotos[lightboxIndex].caption}
          </div>
        </div>
      )}

      {/* Match Detail Drawer Modal */}
      {selectedMatchDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 15, 29, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 100300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setSelectedMatchDetail(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              border: '1px solid #e2e8f0'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              padding: '18px 22px',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  {selectedMatchDetail.roundLabel || selectedMatchDetail.round}
                </div>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', color: '#ffffff' }}>
                  รายละเอียดการแข่งขันแมตช์
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatchDetail(null)}
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Scoreboard VS */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: selectedMatchDetail.teamA?.isWinner ? '#2563eb' : '#0f172a' }}>
                    {selectedMatchDetail.teamA?.name || 'TBD'}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>[{selectedMatchDetail.teamA?.tag || 'A'}]</span>
                  {selectedMatchDetail.teamA?.isWinner && (
                    <div style={{ color: '#eab308', fontSize: '0.7rem', fontWeight: 700, marginTop: '2px' }}>
                      👑 ชนะแมตช์นี้
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'center', padding: '0 8px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '2px' }}>
                    {selectedMatchDetail.teamA?.score ?? 0} - {selectedMatchDetail.teamB?.score ?? 0}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: selectedMatchDetail.status === 'LIVE' ? '#ef4444' : '#64748b', fontWeight: 700 }}>
                    {selectedMatchDetail.status === 'LIVE' ? '🔴 กำลังแข่งสด' : (selectedMatchDetail.format || 'BO3')}
                  </span>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: selectedMatchDetail.teamB?.isWinner ? '#2563eb' : '#0f172a' }}>
                    {selectedMatchDetail.teamB?.name || 'TBD'}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>[{selectedMatchDetail.teamB?.tag || 'B'}]</span>
                  {selectedMatchDetail.teamB?.isWinner && (
                    <div style={{ color: '#eab308', fontSize: '0.7rem', fontWeight: 700, marginTop: '2px' }}>
                      👑 ชนะแมตช์นี้
                    </div>
                  )}
                </div>
              </div>

              {/* Match Meta: Time & Stage */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '10px 14px', background: '#f1f5f9', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>วันและเวลาแข่งขัน</span>
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{selectedMatchDetail.time}</strong>
                </div>
                <div style={{ padding: '10px 14px', background: '#f1f5f9', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>สถานที่แข่ง / เวที</span>
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{selectedMatchDetail.stage || 'Main Stage LAN'}</strong>
                </div>
              </div>

              {/* Map Scores Table */}
              {selectedMatchDetail.maps && selectedMatchDetail.maps.length > 0 && (
                <div>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#334155' }}>
                    ผลคะแนนรายแผนที่ (Map Breakdown)
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedMatchDetail.maps.map((mp, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 14px',
                          background: mp.isCurrent ? '#fee2e2' : '#f8fafc',
                          borderRadius: '6px',
                          border: mp.isCurrent ? '1px solid #f87171' : '1px solid #e2e8f0',
                          fontSize: '0.84rem'
                        }}
                      >
                        <span style={{ fontWeight: 600, color: mp.isCurrent ? '#b91c1c' : '#0f172a' }}>
                          Map {idx + 1}: {mp.mapName} {mp.isCurrent ? '(กำลังแข่ง)' : ''}
                        </span>
                        <span style={{ fontWeight: 800, color: mp.winner ? '#16a34a' : '#0f172a' }}>
                          {mp.scoreA} - {mp.scoreB} {mp.winner ? `(ชนะ: ${mp.winner})` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MVP Player Spotlight */}
              {selectedMatchDetail.mvp && (
                <div style={{
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '1px solid #fcd34d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#d97706',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Award size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
                      MVP OF THE MATCH
                    </div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#78350f' }}>
                      {selectedMatchDetail.mvp.name} [{selectedMatchDetail.mvp.teamTag}]
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#92400e' }}>
                      {selectedMatchDetail.mvp.stats} • {selectedMatchDetail.mvp.role}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons: Live Stream & Close */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <a
                  href={selectedMatchDetail.streamUrl || tournament.streamChannel || 'https://twitch.tv/gspeed_esport'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  <Play size={16} />
                  <span>รับชมการถ่ายทอดสด (Watch Stream)</span>
                  <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedMatchDetail(null)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
