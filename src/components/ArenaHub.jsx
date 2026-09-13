import React, { useState } from 'react';
import { 
  Trophy, Shield, Monitor, Coffee, Zap, Calendar, Users, 
  ArrowRight, Compass, Layers, Calculator, CheckCircle2, ChevronRight, Play, Check, Flame, X, Send,
  Search, PhoneCall, Image as ImageIcon, Newspaper, ExternalLink, Filter,
  Gamepad2, Gift, LayoutGrid
} from 'lucide-react';
import { 
  VENUE_ZONES, TOURNAMENTS, GALLERY_ACTIVITIES, 
  EVENT_CATEGORIES, GAME_NEWS 
} from '../data/mockData';
import { useSiteData } from '../context/SiteDataContext';

export default function ArenaHub({ onNavigateFranchise }) {
  const { siteData } = useSiteData();
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

  // Form states
  const [regForm, setRegForm] = useState({ teamName: '', captainName: '', phone: '', email: '', discord: '' });

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
    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      setSelectedTournament(null);
      setRegForm({ teamName: '', captainName: '', phone: '', email: '', discord: '' });
    }, 2500);
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
      <section 
        className="hero-section" 
        style={{ 
          backgroundColor: heroData.bgColor || '#ffffff',
          backgroundImage: heroData.bgOverlayImage ? `url(${heroData.bgOverlayImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="hero-background-overlay"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <div className="badge-pill badge-blue hero-tag">
              <span className="live-dot"></span>
              <span>{heroData.badge}</span>
            </div>

            <h1 className="hero-title" style={{ whiteSpace: 'pre-line' }}>
              {heroData.title}
            </h1>

            <p className="hero-description">
              {heroData.subtitle}
            </p>

            <div className="hero-cta-group">
              <a href={heroData.primaryCtaLink || '#activities'} className="btn-primary">
                <ImageIcon size={18} />
                <span>{heroData.primaryCta || heroData.primaryCtaText || 'ชมภาพกิจกรรมทั้งหมด'}</span>
              </a>
              <a href={heroData.secondaryCtaLink || '#tournaments'} className="btn-secondary">
                <Trophy size={18} />
                <span>{heroData.secondaryCta || heroData.secondaryCtaText || 'สมัครแข่งทัวร์นาเมนต์'}</span>
              </a>
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
                <div key={mIdx} className="metric-box">
                  <div className="metric-number">{m.number}</div>
                  <div className="metric-label">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
                    window.location.hash = `#/activity/${item.slug || item.id}`;
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
            {tournamentsList.map((t) => (
              <div key={t.id} className="tournament-card glass-panel">
                <div className="t-card-header">
                  <span className={`badge-pill badge-${t.badgeType === 'cyan' ? 'blue' : t.badgeType === 'magenta' ? 'white' : 'amber'}`}>
                    {t.badge}
                  </span>
                  <span className="t-game-tag">{t.game}</span>
                </div>

                <h3 className="t-card-title">{t.title}</h3>

                <div className="t-details-list">
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
                    <span><strong>จำนวนทีม:</strong> {t.slots}</span>
                  </div>
                  <div className="t-detail-item">
                    <Zap size={16} className="text-muted" />
                    <span><strong>รูปแบบ:</strong> {t.format}</span>
                  </div>
                </div>

                <div className="t-card-footer">
                  {t.status === 'Open' ? (
                    <button 
                      id={`btn-reg-${t.id}`}
                      className="btn-primary full-width"
                      onClick={() => setSelectedTournament(t)}
                    >
                      <span>สมัครเข้าร่วมแข่งขัน</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : t.status === 'Full' ? (
                    <button className="btn-secondary full-width disabled-btn" disabled>
                      <span>ที่นั่งเต็มแล้ว</span>
                    </button>
                  ) : (
                    <button 
                      className="btn-secondary full-width"
                      onClick={() => setSelectedTournament(t)}
                    >
                      <span>ติดตามรายละเอียด</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
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
                  window.location.hash = `#/activity/${news.slug || news.id}`;
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

      {/* TOURNAMENT REGISTRATION MODAL */}
      {selectedTournament && (
        <div className="modal-backdrop">
          <div className="modal-dialog glass-panel">
            <div className="modal-header">
              <div>
                <span className="badge-pill badge-blue">{selectedTournament.game}</span>
                <h3 className="modal-title">ลงทะเบียนแข่งขัน: {selectedTournament.title}</h3>
              </div>
              <button className="btn-icon-close" onClick={() => setSelectedTournament(null)}>
                <X size={20} />
              </button>
            </div>

            {registerSuccess ? (
              <div className="modal-success-state">
                <div className="success-icon-box">
                  <Check size={40} className="text-cyan" />
                </div>
                <h3>ลงทะเบียนสำเร็จเรียบร้อย!</h3>
                <p>ทีมงานจะทำการตรวจสอบข้อมูลและติดต่อกลับผ่านเบอร์โทรศัพท์และ Discord ภายใน 24 ชม.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="modal-form">
                <div className="form-group">
                  <label>ชื่อทีม (Team Name) *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="เช่น G-Speed Slayer Esports"
                    value={regForm.teamName}
                    onChange={e => setRegForm({...regForm, teamName: e.target.value})}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>ชื่อ-นามสกุล หัวหน้าทีม *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="เช่น สมชาย มีชัย"
                      value={regForm.captainName}
                      onChange={e => setRegForm({...regForm, captainName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>เบอร์โทรศัพท์ติดต่อ *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="08X-XXX-XXXX"
                      value={regForm.phone}
                      onChange={e => setRegForm({...regForm, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>อีเมลหัวหน้าทีม *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="captain@example.com"
                      value={regForm.email}
                      onChange={e => setRegForm({...regForm, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Discord Tag (สำหรับเข้าห้องแข่ง) *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Captain#1234 หรือ username"
                      value={regForm.discord}
                      onChange={e => setRegForm({...regForm, discord: e.target.value})}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={() => setSelectedTournament(null)}>
                    ยกเลิก
                  </button>
                  <button type="submit" className="btn-primary">
                    <Send size={16} />
                    <span>ยืนยันการสมัครแข่งขัน</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
