import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, Calendar, Users, Zap, Flame, Camera, 
  Search, X, ArrowLeft, ArrowRight, CheckCircle2, 
  Sparkles, Award, Shield, PhoneCall, ChevronRight,
  Filter, Play, ExternalLink, Gamepad2, Layers
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { TOURNAMENTS } from '../data/mockData';

export default function TournamentsPage({
  initialTournamentSlug = null,
  onSelectTournamentSlug,
  onNavigateHome,
  onNavigateFranchise
}) {
  const { siteData, updateTournament } = useSiteData();
  const tournamentsList = siteData?.tournaments || TOURNAMENTS;

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'open', 'ongoing', 'completed'
  const [gameFilter, setGameFilter] = useState('all');

  // Unique games list for filter
  const uniqueGames = useMemo(() => {
    const set = new Set();
    tournamentsList.forEach(t => {
      if (t.game) set.add(t.game);
    });
    return Array.from(set);
  }, [tournamentsList]);

  // Filtered Tournaments
  const filteredTournaments = useMemo(() => {
    return tournamentsList.filter(t => {
      // 1. Search Query
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || 
        t.title.toLowerCase().includes(q) || 
        t.game.toLowerCase().includes(q) ||
        (t.gameCategory && t.gameCategory.toLowerCase().includes(q)) ||
        (t.desc && t.desc.toLowerCase().includes(q));

      // 2. Status Filter
      let matchStatus = true;
      if (statusFilter === 'open') {
        matchStatus = t.status === 'Open';
      } else if (statusFilter === 'ongoing') {
        matchStatus = t.status === 'Ongoing' || t.badgeType === 'magenta' || (t.badge && t.badge.includes('กำลัง'));
      } else if (statusFilter === 'completed') {
        matchStatus = t.status === 'Completed' || t.status === 'Closed' || (t.badge && (t.badge.includes('จบ') || t.badge.includes('เต็ม')));
      }

      // 3. Game Filter
      const matchGame = gameFilter === 'all' || t.game === gameFilter;

      return matchSearch && matchStatus && matchGame;
    });
  }, [tournamentsList, searchQuery, statusFilter, gameFilter]);

  // Aggregate stats
  const totalPrizePoolText = '฿300,000+';
  const openCount = tournamentsList.filter(t => t.status === 'Open').length;
  const totalTeams = tournamentsList.reduce((acc, t) => acc + (t.teams ? t.teams.length : 0), 0);

  const handleOpenTournament = (tour) => {
    const slug = tour.slug || tour.seo?.slug || tour.id;
    if (onSelectTournamentSlug) {
      onSelectTournamentSlug(slug);
    } else {
      window.history.pushState(null, '', `/tournaments/${slug}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="tournaments-page-wrapper">
      {/* 1. Breadcrumb & Top Bar */}
      <div className="page-breadcrumb-bar">
        <div className="container breadcrumb-container">
          <button 
            type="button" 
            className="breadcrumb-back-btn"
            onClick={() => onNavigateHome ? onNavigateHome() : (window.history.pushState(null, '', '/'), window.dispatchEvent(new PopStateEvent('popstate')))}
          >
            <ArrowLeft size={16} />
            <span>กลับหน้าหลัก</span>
          </button>
          <div className="breadcrumb-trail">
            <span className="breadcrumb-item" onClick={() => onNavigateHome ? onNavigateHome() : (window.history.pushState(null, '', '/'), window.dispatchEvent(new PopStateEvent('popstate')))}>
              หน้าหลัก
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item current">ปฏิทินการแข่งขัน & ทัวร์นาเมนต์</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Header Banner */}
      <section className="tournaments-hero-header">
        <div className="container tournaments-hero-container">
          <div className="tournaments-hero-badge">
            <Flame size={15} className="text-amber pulse-icon" />
            <span>GLP ESPORTS LEAGUE & TOURNAMENTS</span>
          </div>
          <h1 className="tournaments-hero-title">
            ปฏิทินการแข่งขัน & <span className="text-blue">ทัวร์นาเมนต์อีสปอร์ต</span>
          </h1>
          <p className="tournaments-hero-subtitle">
            ศูนย์รวมการแข่งขันอีสปอร์ตระดับประเทศ ชิงเงินรางวัลรวมกว่าหลายแสนบาท พิสูจน์ฝีมือบนเวที LAN Final 4K สเปก Intel i9 + RTX 4080 จอ 360Hz พร้อมระบบ Dedicated Server 128-Tick และถ่ายทอดสดเต็มรูปแบบ
          </p>

          {/* Quick Metrics Bar */}
          <div className="tournaments-metrics-grid">
            <div className="metric-card glass-panel">
              <div className="metric-icon-box amber">
                <Trophy size={20} />
              </div>
              <div className="metric-content">
                <div className="metric-value">{totalPrizePoolText}</div>
                <div className="metric-label">เงินรางวัลรวมในปฏิทิน</div>
              </div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-icon-box blue">
                <Gamepad2 size={20} />
              </div>
              <div className="metric-content">
                <div className="metric-value">{tournamentsList.length} รายการ</div>
                <div className="metric-label">ทัวร์นาเมนต์ระดับทางการ</div>
              </div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-icon-box emerald">
                <Users size={20} />
              </div>
              <div className="metric-content">
                <div className="metric-value">{totalTeams > 0 ? `${totalTeams}+ ทีม` : '100+ ทีม'}</div>
                <div className="metric-label">ทีมเข้าประลองฝีมือ</div>
              </div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-icon-box purple">
                <Zap size={20} />
              </div>
              <div className="metric-content">
                <div className="metric-value">360Hz / 128-Tick</div>
                <div className="metric-label">LAN Final Esports Ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Search & Interactive Filter Controls */}
      <section className="tournaments-controls-section">
        <div className="container">
          <div className="tournaments-controls-card glass-panel">
            <div className="controls-row-top">
              {/* Search Box */}
              <div className="tournament-search-box">
                <Search size={18} className="search-icon text-blue" />
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อการแข่งขัน, ชื่อเกม (VALORANT, RoV, CS2...), หรือรูปแบบ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button className="btn-clear-search" onClick={() => setSearchQuery('')}>
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="status-filter-pills">
                <button 
                  type="button"
                  className={`status-pill ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  ทั้งหมด ({tournamentsList.length})
                </button>
                <button 
                  type="button"
                  className={`status-pill pill-open ${statusFilter === 'open' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('open')}
                >
                  <span className="dot-pulse-green"></span>
                  เปิดรับสมัคร ({openCount})
                </button>
                <button 
                  type="button"
                  className={`status-pill ${statusFilter === 'ongoing' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('ongoing')}
                >
                  กำลังแข่งขัน
                </button>
                <button 
                  type="button"
                  className={`status-pill ${statusFilter === 'completed' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('completed')}
                >
                  เต็มแล้ว / จบแล้ว
                </button>
              </div>
            </div>

            {/* Game Chips Row */}
            <div className="controls-row-games">
              <span className="game-chips-label">
                <Filter size={14} className="text-blue" />
                <span>คัดกรองตามเกม:</span>
              </span>
              <button 
                type="button"
                className={`game-chip-btn ${gameFilter === 'all' ? 'active' : ''}`}
                onClick={() => setGameFilter('all')}
              >
                ทุกเกม
              </button>
              {uniqueGames.map(game => (
                <button 
                  key={game}
                  type="button"
                  className={`game-chip-btn ${gameFilter === game ? 'active' : ''}`}
                  onClick={() => setGameFilter(game)}
                >
                  {game}
                </button>
              ))}

              {(searchQuery || statusFilter !== 'all' || gameFilter !== 'all') && (
                <button 
                  type="button"
                  className="btn-reset-filters"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setGameFilter('all');
                  }}
                >
                  ล้างตัวกรอง
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tournaments Grid */}
      <section className="tournaments-grid-section">
        <div className="container">
          <div className="tournaments-count-heading">
            <span>พบทั้งหมด <strong>{filteredTournaments.length}</strong> รายการแข่งขัน</span>
            {statusFilter === 'open' && (
              <span className="open-notice-tag">🔥 กำลังเปิดรับสมัครทีมเข้าแข่งขัน สมัครได้ทันที</span>
            )}
          </div>

          {filteredTournaments.length > 0 ? (
            <div className="tournaments-grid">
              {filteredTournaments.map((t) => {
                const photoCount = (t.galleryPhotos || []).length;
                const teamCount = (t.teams || []).length;
                const isRegistrationOpen = t.status === 'Open';

                return (
                  <div key={t.id} className="tournament-card">
                    {/* Banner Image with Overlays */}
                    <div 
                      className="t-banner-wrapper"
                      onClick={() => handleOpenTournament(t, 'overview')}
                      style={{ cursor: 'pointer' }}
                    >
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
                          <span className={`badge-pill badge-${t.badgeType === 'cyan' ? 'blue' : t.badgeType === 'magenta' ? 'white' : 'amber'}`}>
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
                        <h3 
                          className="t-card-title clickable-title" 
                          title={t.title}
                          onClick={() => handleOpenTournament(t, 'overview')}
                        >
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

                        {isRegistrationOpen ? (
                          <div className="t-action-open-grid">
                            <button 
                              type="button"
                              className="t-btn-register"
                              onClick={() => handleOpenTournament(t, 'register')}
                            >
                              <Zap size={15} />
                              <span>สมัครแข่ง</span>
                              <ArrowRight size={14} />
                            </button>
                            <button 
                              type="button"
                              className="t-btn-bracket-outline"
                              onClick={() => handleOpenTournament(t, 'bracket')}
                              title="ดูสายการแข่งขัน (Tournament Bracket)"
                            >
                              <Layers size={14} />
                              <span>สายแข่ง</span>
                            </button>
                          </div>
                        ) : (
                          <button 
                            type="button"
                            className="t-btn-bracket-full"
                            onClick={() => handleOpenTournament(t, 'bracket')}
                          >
                            <span>ดูสายการแข่งขัน & สกอร์สด (Brackets)</span>
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-tournaments-found glass-panel">
              <Search size={40} className="text-blue" />
              <h3>ไม่พบรายการแข่งขันตามเงื่อนไขที่ค้นหา</h3>
              <p>ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองสถานะเป็น "ทั้งหมด" เพื่อดูรายการแข่งขันทั้งหมด</p>
              <button 
                type="button"
                className="btn-primary"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setGameFilter('all');
                }}
              >
                แสดงทัวร์นาเมนต์ทั้งหมด
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Tournament Organizer & Venue Booking Callout */}
      <section className="tournaments-organizer-callout">
        <div className="container">
          <div className="organizer-box glass-panel">
            <div className="organizer-left">
              <div className="organizer-badge">
                <Shield size={14} className="text-blue" />
                <span>FOR TOURNAMENT ORGANIZERS & PUBLISHERS</span>
              </div>
              <h3 className="organizer-title">
                ต้องการจัดแข่งทัวร์นาเมนต์ หรือเช่าเวทีแข่งขันอีสปอร์ตที่ GLP?
              </h3>
              <p className="organizer-desc">
                GLP Esport Stadium พร้อมสนับสนุนค่ายเกม แบรนด์สปอนเซอร์ และออร์แกไนเซอร์ ด้วยเวทีแข่งขัน 5v5 มาตรฐานสากล, ระบบสตรีมมิ่ง 4K, ห้องพากย์แคสเตอร์เก็บเสียง, ระบบเซิร์ฟเวอร์ LAN 128-Tick และทีมงานเทคนิคอีสปอร์ตมืออาชีพ
              </p>
              <div className="organizer-specs-chips">
                <span className="spec-chip">✓ เวทีแข่งขัน 5v5 Main Stage</span>
                <span className="spec-chip">✓ เครื่องแข่ง i9 + RTX 4080 จอ 360Hz</span>
                <span className="spec-chip">✓ ระบบถ่ายทอดสด 4K Streaming Rig</span>
                <span className="spec-chip">✓ ห้องนักพากย์ Caster Studio</span>
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
                    <span>ดูบริการระบบสนาม & แฟรนไชส์</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
