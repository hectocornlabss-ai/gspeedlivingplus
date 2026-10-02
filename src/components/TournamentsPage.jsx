import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, Calendar, Users, Zap, Flame, Camera, 
  Search, X, ArrowLeft, ArrowRight, CheckCircle2, 
  Sparkles, Award, Shield, PhoneCall, ChevronRight,
  Filter, Play, ExternalLink, Gamepad2, Layers, Tag
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { TOURNAMENTS } from '../data/mockData';
import { compareTournaments, isTournamentRegistrationOpen } from '../utils/tournamentUtils';

export default function TournamentsPage({
  initialTournamentSlug = null,
  onSelectTournamentSlug,
  onNavigateHome,
  onNavigateFranchise
}) {
  const { siteData, updateTournament } = useSiteData();
  const { t, language, translateDynamic } = useTranslation();
  const tournamentsList = siteData?.tournaments || TOURNAMENTS;

  // Search & Game Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [gameFilter, setGameFilter] = useState('all');

  // Dynamic unique games list with counts
  const gamesWithCount = useMemo(() => {
    const counts = {};
    tournamentsList.forEach(tour => {
      const g = (tour.game || 'ทั่วไป').trim();
      counts[g] = (counts[g] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [tournamentsList]);

  // Filtered and Sorted Tournaments (New / Open tournaments sorted automatically to the front, closed to the back)
  const filteredTournaments = useMemo(() => {
    return tournamentsList
      .filter(tour => {
        // 1. Search Query
        const q = searchQuery.trim().toLowerCase();
        const matchSearch = !q || 
          tour.title.toLowerCase().includes(q) || 
          tour.game.toLowerCase().includes(q) ||
          (tour.gameCategory && tour.gameCategory.toLowerCase().includes(q)) ||
          (tour.desc && tour.desc.toLowerCase().includes(q));

        // 2. Game Filter
        const matchGame = gameFilter === 'all' || 
          (tour.game && tour.game.toLowerCase() === gameFilter.toLowerCase());

        return matchSearch && matchGame;
      })
      .sort(compareTournaments);
  }, [tournamentsList, searchQuery, gameFilter]);

  // Aggregate stats
  const totalPrizePoolText = '฿300,000+';
  const openCount = tournamentsList.filter(isTournamentRegistrationOpen).length;
  const totalTeams = tournamentsList.reduce((acc, tour) => acc + (tour.teams ? tour.teams.length : 0), 0);

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
      {/* 1. Page Breadcrumb & Interactive Filter Controls Bar */}
      <div className="page-breadcrumb-bar" style={{ padding: '16px 0 20px 0', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <div className="container">
          <div className="breadcrumb-trail" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              className="breadcrumb-item" 
              style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}
              onClick={() => onNavigateHome ? onNavigateHome() : (window.history.pushState(null, '', '/'), window.dispatchEvent(new PopStateEvent('popstate')))}
            >
              {t('nav.home')}
            </span>
            <span className="breadcrumb-separator" style={{ color: '#94a3b8' }}>/</span>
            <span className="breadcrumb-item current" style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.85rem' }}>
              {t('nav.tournaments')}
            </span>
          </div>

          {/* Search & Interactive Filter Controls */}
          <div className="tournaments-controls-card glass-panel" style={{ margin: 0, boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)' }}>
            <div className="controls-row-top">
              {/* Search Box */}
              <div className="tournament-search-box">
                <Search size={18} className="search-icon text-blue" />
                <input 
                  type="text" 
                  placeholder={language === 'zh' ? '搜索赛事名称、游戏 (VALORANT, RoV, CS2...) 或赛制...' : language === 'en' ? 'Search tournament name, game (VALORANT, RoV, CS2...), or format...' : 'ค้นหาชื่อการแข่งขัน, ชื่อเกม (VALORANT, RoV, CS2...), หรือรูปแบบ...'}
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

              {/* Game Category Filter Tabs (Single Row & Touch Swipeable) */}
              <div className="status-scroll-wrapper">
                <div className="status-filter-pills">
                  <button 
                    type="button"
                    className={`status-pill ${gameFilter === 'all' ? 'active' : ''}`}
                    onClick={(e) => {
                      setGameFilter('all');
                      try {
                        e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                      } catch (err) {}
                    }}
                  >
                    <Trophy size={14} />
                    <span>{t('common.all')} ({tournamentsList.length})</span>
                  </button>
                  {gamesWithCount.map(({ name, count }) => (
                    <button 
                      key={name}
                      type="button"
                      className={`status-pill ${gameFilter.toLowerCase() === name.toLowerCase() ? 'active' : ''}`}
                      onClick={(e) => {
                        setGameFilter(name);
                        try {
                          e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        } catch (err) {}
                      }}
                    >
                      <Gamepad2 size={14} />
                      <span>{name} ({count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Header Banner */}
      <section className="tournaments-hero-header" style={{ padding: '36px 0 30px 0' }}>
        <div className="container tournaments-hero-container">
          <div className="tournaments-hero-badge">
            <Flame size={15} className="text-amber pulse-icon" />
            <span>{t('tournamentsPage.badge') || 'GLP ESPORTS LEAGUE & TOURNAMENTS'}</span>
          </div>
          <h1 className="tournaments-hero-title">
            {language === 'th' ? (
              <>ปฏิทินการแข่งขัน & <span className="text-blue">ทัวร์นาเมนต์อีสปอร์ต</span></>
            ) : language === 'zh' ? (
              <>全国电竞赛事 & <span className="text-blue">锦标赛日程表</span></>
            ) : (
              <>Tournament Calendar & <span className="text-blue">Esports Leagues</span></>
            )}
          </h1>
          <p className="tournaments-hero-subtitle" style={{ marginBottom: 0 }}>
            {language === 'th'
              ? 'ศูนย์รวมการแข่งขันอีสปอร์ตระดับประเทศ ชิงเงินรางวัลรวมกว่าหลายแสนบาท พิสูจน์ฝีมือบนเวที LAN Final 4K สเปก Intel i9 + RTX 4080 จอ 360Hz พร้อมระบบ Dedicated Server 128-Tick และถ่ายทอดสดเต็มรูปแบบ'
              : (language === 'zh'
                ? '全国顶尖电竞赛事汇聚，争夺丰厚现金大奖。搭载 Intel i9 + RTX 4080、360Hz 电竞屏、128-Tick 局域网独立服务器及4K超清直转播系统。'
                : 'National premier esports tournaments with massive prize pools. Battle on 4K LAN Final stage powered by Intel i9 + RTX 4080, 360Hz displays, and 128-tick dedicated servers.')}
          </p>
        </div>
      </section>

      {/* 4. Tournaments Grid */}
      <section className="tournaments-grid-section">
        <div className="container">
          <div className="tournaments-count-heading">
            <span>
              {language === 'th' ? (
                <>พบทั้งหมด <strong>{filteredTournaments.length}</strong> รายการแข่งขัน</>
              ) : language === 'zh' ? (
                <>共找到 <strong>{filteredTournaments.length}</strong> 项赛事</>
              ) : (
                <>Found <strong>{filteredTournaments.length}</strong> Tournaments</>
              )}
            </span>
            {openCount > 0 && (
              <span className="open-notice-tag">
                🔥 {language === 'th' 
                  ? `เปิดรับสมัคร (${openCount}) รายการ พร้อมประลองฝีมือ`
                  : language === 'zh'
                  ? `${openCount} 项赛事报名中`
                  : `${openCount} Open Tournaments`}
              </span>
            )}
          </div>

          {filteredTournaments.length > 0 ? (
            <div className="tournaments-grid">
              {filteredTournaments.map((tourney) => {
                const photoCount = (tourney.galleryPhotos || []).length;
                const teamCount = (tourney.teams || []).length;
                const isRegistrationOpen = isTournamentRegistrationOpen(tourney);

                return (
                  <div key={tourney.id} className="tournament-card">
                    {/* Banner Image with Overlays */}
                    <div 
                      className="t-banner-wrapper"
                      onClick={() => handleOpenTournament(tourney, 'overview')}
                      style={{ cursor: 'pointer' }}
                    >
                      <img 
                        src={tourney.bannerImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'} 
                        alt={tourney.title} 
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
                            <span>{translateDynamic(tourney.badge || 'เปิดรับสมัครด่วน')}</span>
                          </span>
                        ) : (
                          <span className={`badge-pill badge-${tourney.badgeType === 'cyan' ? 'blue' : tourney.badgeType === 'magenta' ? 'white' : 'amber'}`}>
                            {translateDynamic(tourney.badge)}
                          </span>
                        )}
                        {tourney.gameCategory && (
                          <span className="t-category-badge" title={tourney.gameCategory}>
                            {tourney.gameCategory}
                          </span>
                        )}
                      </div>

                      <div className="t-banner-bottom">
                        <span className="t-game-tag">
                          {tourney.game}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="t-card-body">
                      <div>
                        <h3 
                          className="t-card-title clickable-title" 
                          title={tourney.title}
                          onClick={() => handleOpenTournament(tourney, 'overview')}
                        >
                          {translateDynamic(tourney.title)}
                        </h3>

                        {/* High-impact Prize Banner */}
                        <div className="t-prize-banner" style={{ marginTop: '14px' }}>
                          <div className="t-prize-label">
                            <Trophy size={16} className="text-amber" />
                            <span>{t('common.prizePool')}</span>
                          </div>
                          <div className="t-prize-amount">
                            {translateDynamic(tourney.prizePool)}
                          </div>
                        </div>

                        {/* Spec Details List */}
                        <div className="t-details-list" style={{ marginTop: '12px' }}>
                          <div className="t-detail-item">
                            <Calendar size={15} className="text-cyan" style={{ flexShrink: 0 }} />
                            <span><strong>{t('common.date')}:</strong> {translateDynamic(tourney.date)} ({translateDynamic(tourney.time)})</span>
                          </div>
                          <div className="t-detail-item">
                            <Users size={15} className="text-blue" style={{ flexShrink: 0 }} />
                            <span><strong>{t('common.teams')}:</strong> {translateDynamic(tourney.slots)} ({teamCount} {t('common.teamsCount')})</span>
                          </div>
                          <div className="t-detail-item">
                            <Zap size={15} className="text-amber" style={{ flexShrink: 0 }} />
                            <span><strong>{language === 'th' ? 'รูปแบบ:' : (language === 'zh' ? '赛制:' : 'Format:')}</strong> {translateDynamic(tourney.format)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="t-card-footer">
                        <div className="t-action-single">
                          <button 
                            type="button"
                            className="t-btn-secondary"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={() => handleOpenTournament(tourney, 'roster')}
                          >
                            <Users size={14} />
                            <span>{t('tournamentsPage.registeredTeams')} ({teamCount})</span>
                          </button>
                        </div>

                        {isRegistrationOpen ? (
                          <div className="t-action-open-grid">
                            <button 
                              type="button"
                              className="t-btn-register"
                              onClick={() => handleOpenTournament(tourney, 'register')}
                            >
                              <Zap size={15} />
                              <span>{t('common.registerTeam')}</span>
                              <ArrowRight size={14} />
                            </button>
                            <button 
                              type="button"
                              className="t-btn-bracket-outline"
                              onClick={() => handleOpenTournament(tourney, 'bracket')}
                              title={language === 'zh' ? '查看赛程对阵图 (Tournament Bracket)' : language === 'en' ? 'View Bracket (Tournament Bracket)' : 'ดูสายการแข่งขัน (Tournament Bracket)'}
                            >
                              <Layers size={14} />
                              <span>{t('common.bracket')}</span>
                            </button>
                          </div>
                        ) : (
                          <button 
                            type="button"
                            className="t-btn-bracket-full"
                            onClick={() => handleOpenTournament(tourney, 'bracket')}
                          >
                            <span>{language === 'th' ? 'ดูสายการแข่งขัน & สกอร์สด (Brackets)' : (language === 'zh' ? '查看赛程与比分 (Brackets)' : 'View Match Brackets & Live Scores')}</span>
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
              <h3>{language === 'th' ? 'ไม่พบรายการแข่งขันตามเงื่อนไขที่ค้นหา' : (language === 'zh' ? '未找到符合条件的赛事' : 'No tournaments match your search')}</h3>
              <p>{language === 'th' ? 'ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรองสถานะเป็น "ทั้งหมด" เพื่อดูรายการแข่งขันทั้งหมด' : (language === 'zh' ? '请尝试更换搜索词或选择“全部”查看更多赛事' : 'Try adjusting your search query or reset the game filter to view all events.')}</p>
              <button 
                type="button"
                className="btn-primary"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setGameFilter('all');
                }}
              >
                {language === 'zh' ? '查看所有赛事' : language === 'en' ? 'Show All Tournaments' : 'แสดงทัวร์นาเมนต์ทั้งหมด'}
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
                {language === 'zh' 
                  ? '有意举办赛事或包场租用 GLP 电竞对战舞台？' 
                  : language === 'en' 
                  ? 'Interested in hosting a tournament or renting GLP Esport Stage?' 
                  : 'ต้องการจัดแข่งทัวร์นาเมนต์ หรือเช่าเวทีแข่งขันอีสปอร์ตที่ GLP?'}
              </h3>
              <p className="organizer-desc">
                {language === 'zh'
                  ? 'GLP 电竞馆配备专业 5v5 对战舞台、4K 高清直转播推流系统、隔音解说演播厅、128-Tick 赛事专用 LAN 服务器与职业技术团队，全力支持赛事承办与品牌发布。'
                  : language === 'en'
                  ? 'GLP Esport Stadium supports publishers, sponsors, and organizers with pro 5v5 stage, 4K streaming production, soundproof caster booth, 128-tick LAN server, and dedicated technical crew.'
                  : 'GLP Esport Stadium พร้อมสนับสนุนค่ายเกม แบรนด์สปอนเซอร์ และออร์แกไนเซอร์ ด้วยเวทีแข่งขัน 5v5 มาตรฐานสากล, ระบบสตรีมมิ่ง 4K, ห้องพากย์แคสเตอร์เก็บเสียง, ระบบเซิร์ฟเวอร์ LAN 128-Tick และทีมงานเทคนิคอีสปอร์ตมืออาชีพ'}
              </p>
              <div className="organizer-specs-chips">
                <span className="spec-chip">{language === 'zh' ? '✓ 5v5 职业电竞舞台' : language === 'en' ? '✓ 5v5 Pro Stage' : '✓ เวทีแข่งขัน 5v5'}</span>
                <span className="spec-chip">{language === 'zh' ? '✓ 顶配职业竞技机台' : language === 'en' ? '✓ High-End Pro Stations' : '✓ เครื่องแข่งสเปคสูง'}</span>
                <span className="spec-chip">{language === 'zh' ? '✓ 4K超清直转播系统' : language === 'en' ? '✓ 4K Live Broadcast System' : '✓ ระบบถ่ายทอดสด 4K'}</span>
                <span className="spec-chip">{language === 'zh' ? '✓ 隔音解说演播厅' : language === 'en' ? '✓ Soundproof Caster Studio' : '✓ ห้องพากย์ Caster Studio'}</span>
              </div>
            </div>

            <div className="organizer-right">
              <div className="organizer-contact-card">
                <div className="contact-card-title">{language === 'zh' ? '联系赛事活动筹备组' : language === 'en' ? 'Tournament Events Team' : 'ติดต่อฝ่ายบริหารงานแข่งขัน'}</div>
                <div className="contact-hotline">
                  <PhoneCall size={18} className="text-blue pulse-icon" />
                  <a href="tel:0637937704">063-793-7704</a>
                </div>
                <p className="contact-subtext">{language === 'zh' ? '每日提供赛事咨询与场地预约服务' : language === 'en' ? 'Available daily for tournament consulting & bookings' : 'เปิดบริการให้คำปรึกษาและจองคิวจัดงานทุกวัน'}</p>
                {onNavigateFranchise && (
                  <button 
                    type="button" 
                    className="btn-organizer-plan"
                    onClick={onNavigateFranchise}
                  >
                    <span>{language === 'zh' ? '咨询加盟与开店合作' : language === 'en' ? 'Franchise & Partnership' : 'ติดต่อขอเปิดแฟรนไชส์'}</span>
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
