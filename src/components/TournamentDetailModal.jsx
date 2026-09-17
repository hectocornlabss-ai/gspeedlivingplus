import React, { useState } from 'react';
import { 
  X, Trophy, Calendar, MapPin, Globe, Copy, Check, Award, 
  Users, Camera, Send, Zap, Clock, Shield, CheckCircle2, 
  Crown, Plus, ArrowRight, ChevronLeft, ChevronRight, Home 
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

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
                background: tourneyModalTab === tab.id ? '#1d4ed8' : tab.highlight ? '#fef3c7' : '#f1f5f9',
                color: tourneyModalTab === tab.id ? '#ffffff' : tab.highlight ? '#b45309' : '#475569',
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

          {/* TAB 3: ROSTER & TEAMS */}
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
    </div>
  );
}
