import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Award, Cpu, Zap, Armchair, Monitor, 
  Wifi, ShieldCheck, CheckCircle2, TrendingUp, Mail, Phone, MapPin, Quote, Calculator, ArrowRight,
  Camera, ZoomIn, ChevronLeft, ChevronRight, X, Layers, Building2, Target
} from 'lucide-react';
import { FOUNDER_INFO } from '../data/mockData';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { sanitizeSafeUrl, isSafeExternalUrl } from '../utils/security';

function getPhilosophyMeta(title = '', index = 0) {
  const t = (title || '').toLowerCase();
  if (t.includes('เทคโนโลยี') || t.includes('ฮาร์ดแวร์') || t.includes('tech') || index === 0) {
    return {
      icon: Cpu,
      color: '#0284c7',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe'
    };
  }
  if (t.includes('สิ่งแวดล้อม') || t.includes('ปลอดภัย') || t.includes('มาตรฐาน') || index === 1) {
    return {
      icon: ShieldCheck,
      color: '#059669',
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0'
    };
  }
  if (t.includes('คืนทุน') || t.includes('พาร์ตเนอร์') || t.includes('เติบโต') || index === 2) {
    return {
      icon: TrendingUp,
      color: '#d97706',
      bgColor: '#fffbeb',
      borderColor: '#fde68a'
    };
  }
  return {
    icon: CheckCircle2,
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe'
  };
}

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

export default function CompanyProfile({ onNavigateFranchise }) {
  const { siteData } = useSiteData();
  const { t, language, translateDynamic } = useTranslation();
  const founder = siteData?.founder || FOUNDER_INFO;
  const founderBg = founder.bgColor || '#ffffff';
  const isDarkFounder = isColorDark(founderBg);

  // Clean metrics values to ensure symmetrical, balanced layout
  const cleanExp = (() => {
    const raw = (founder.experience || '16+ ปี').trim();
    if (language === 'en') return raw.replace(/ปี/, 'Years').replace(/ในอุตสาหกรรม.*/, '');
    if (language === 'zh') return raw.replace(/ปี/, '年').replace(/ในอุตสาหกรรม.*/, '');
    if (raw.includes('ในอุตสาหกรรม') || raw.length > 15) {
      const match = raw.match(/^(\d+\+?\s*ปี)/);
      return match ? match[1] : '16+ ปี';
    }
    return raw;
  })();

  const cleanBranches = (() => {
    const raw = (founder.managedBranches || '8 สาขา').trim();
    if (language === 'en') return raw.replace(/สาขา|แห่ง/, 'Arenas').replace(/ที่บริหาร.*/, '');
    if (language === 'zh') return raw.replace(/สาขา|แห่ง/, '家门店').replace(/ที่บริหาร.*/, '');
    if (raw.includes('ที่บริหาร') || raw.length > 15) {
      const match = raw.match(/^(\d+\+?\s*(?:สาขา|แห่ง)?)/);
      return match ? match[1] : '8 สาขา';
    }
    return raw;
  })();

  // Gallery datasets with fallback to mock data
  const milestonesList = (Array.isArray(founder.milestonesGallery) && founder.milestonesGallery.length > 0)
    ? founder.milestonesGallery
    : (FOUNDER_INFO.milestonesGallery || []);

  const currentPartners = (Array.isArray(founder.partners) && founder.partners.length > 0)
    ? founder.partners
    : (FOUNDER_INFO.partners || []);

  const repeatFactor = currentPartners.length < 5 ? 4 : (currentPartners.length < 10 ? 3 : 2);
  const partnerLogosRepeated = Array.from({ length: repeatFactor }).flatMap(() => currentPartners);

  const standardsList = (Array.isArray(founder.standardsGallery) && founder.standardsGallery.length > 0)
    ? founder.standardsGallery
    : (FOUNDER_INFO.standardsGallery || []);

  // Lightbox Modal State for Public Visitors
  const [lightboxData, setLightboxData] = useState(null); // { list: [], index: 0 }

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxData) return;
      if (e.key === 'Escape') {
        setLightboxData(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxData]);

  const openLightbox = (list, index) => {
    setLightboxData({ list, index });
  };

  const handlePrevPhoto = () => {
    if (!lightboxData) return;
    setLightboxData(prev => ({
      ...prev,
      index: (prev.index - 1 + prev.list.length) % prev.list.length
    }));
  };

  const handleNextPhoto = () => {
    if (!lightboxData) return;
    setLightboxData(prev => ({
      ...prev,
      index: (prev.index + 1) % prev.list.length
    }));
  };

  // Touch Swipe Gesture for Company Lightbox
  const compTouchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const [compSwipeOffset, setCompSwipeOffset] = useState(0);
  const [compIsSwiping, setCompIsSwiping] = useState(false);

  const handleCompTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      compTouchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
      setCompIsSwiping(true);
      setCompSwipeOffset(0);
    }
  };

  const handleCompTouchMove = (e) => {
    if (!compIsSwiping || !e.touches || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - compTouchStartRef.current.x;
    const deltaY = e.touches[0].clientY - compTouchStartRef.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setCompSwipeOffset(deltaX);
    }
  };

  const handleCompTouchEnd = () => {
    if (!compIsSwiping) return;
    setCompIsSwiping(false);

    const deltaX = compSwipeOffset;
    const elapsed = Date.now() - compTouchStartRef.current.time;
    const velocity = Math.abs(deltaX) / (elapsed || 1);

    if (deltaX < -35 || (deltaX < -15 && velocity > 0.25)) {
      handleNextPhoto();
    } else if (deltaX > 35 || (deltaX > 15 && velocity > 0.25)) {
      handlePrevPhoto();
    }

    setCompSwipeOffset(0);
  };

  return (
    <div className="company-profile-page">
      {/* 1. Header Banner */}
      <section className="profile-hero-section">
        <div className="container">
          <div className="section-header-center">
            <div className="badge-pill badge-cyan">
              <Users size={14} />
              <span>{language === 'th' ? (founder.hero?.badge || t('companyPage.badge')) : t('companyPage.badge')}</span>
            </div>
            <h1 className="section-title">
              {language === 'th' ? (
                founder.hero?.title ? (
                  founder.hero.title
                ) : (
                  <>วิสัยทัศน์ผู้บริหาร & <span className="text-blue">ประวัติองค์กร G-SPEED</span></>
                )
              ) : (
                <span>{t('companyPage.title')}</span>
              )}
            </h1>
            <p className="section-subtitle max-w-700">
              {language === 'th' ? (founder.hero?.subtitle || t('companyPage.subtitle')) : t('companyPage.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Founder & Executive Profile Showcase */}
      <section 
        className="founder-section" 
        style={{ 
          background: founderBg, 
          backgroundColor: founderBg, 
          backgroundImage: 'none' 
        }}
      >
        <div className="container">
          <div 
            className="founder-card glass-panel" 
            style={{ 
              backgroundColor: isDarkFounder ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: isDarkFounder ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'
            }}
          >
            <div className="founder-grid">
              {/* Photo & Badge */}
              <div className="founder-media-col">
                <div className="founder-avatar-frame">
                  <img 
                    src={founder.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"} 
                    alt={founder.name}
                    className="founder-img" 
                  />
                  <div className="founder-badge-overlay">
                    <span className="founder-tag">{t('companyPage.founderTag')}</span>
                  </div>
                </div>
                <div className="founder-quick-metrics">
                  <div className={`founder-m-item ${isDarkFounder ? 'dark-founder' : ''}`}>
                    <div className="founder-m-icon-wrap">
                      <Award size={18} />
                    </div>
                    <span className="m-val text-blue">{cleanExp}</span>
                    <span className="m-lbl">{t('companyPage.experienceLabel')}</span>
                  </div>
                  <div className={`founder-m-item ${isDarkFounder ? 'dark-founder' : ''}`}>
                    <div className="founder-m-icon-wrap">
                      <Building2 size={18} />
                    </div>
                    <span className="m-val text-blue">{cleanBranches}</span>
                    <span className="m-lbl">{t('companyPage.branchesLabel')}</span>
                  </div>
                </div>
              </div>

              {/* Founder Bio & Vision */}
              <div className="founder-info-col">
                <div className="badge-pill badge-blue">
                  <Award size={14} />
                  <span>PRESIDENT & FOUNDER</span>
                </div>
                <h2 className="founder-name" style={{ color: founder.titleColor || (isDarkFounder ? '#ffffff' : '#0f172a') }}>
                  {language === 'th' ? founder.name : t('companyPage.founderName', founder.name)}
                </h2>
                <div className="founder-title" style={{ color: isDarkFounder ? '#94a3b8' : '#64748b' }}>
                  {language === 'th' ? founder.title : t('companyPage.founderTitle', founder.title)}
                </div>

                <div className="founder-quote-box">
                  <Quote size={28} className="quote-icon text-blue" />
                  <p className="quote-text" style={{ color: founder.textColor || (isDarkFounder ? '#e2e8f0' : '#334155') }}>
                    {language === 'th' ? founder.quote : t('companyPage.quote', founder.quote)}
                  </p>
                </div>

                <div className="vision-box">
                  <div className="vision-header-row">
                    <div className="vision-icon-badge">
                      <Target size={18} />
                    </div>
                    <h4 className="vision-title">
                      <span>{t('companyPage.coreVisionTitle')}</span>
                    </h4>
                  </div>
                  <p className="vision-text" style={{ color: founder.textColor || (isDarkFounder ? '#cbd5e1' : '#475569') }}>
                    {language === 'th' ? founder.vision : t('companyPage.coreVisionDesc', founder.vision)}
                  </p>
                </div>

                <div className="founder-philosophy-list">
                  {(founder.philosophies && founder.philosophies.length > 0 
                    ? founder.philosophies 
                    : [
                        { 
                          title: t('companyPage.pillar1Title'), 
                          desc: t('companyPage.pillar1Desc') 
                        },
                        { 
                          title: t('companyPage.pillar2Title'), 
                          desc: t('companyPage.pillar2Desc') 
                        },
                        { 
                          title: t('companyPage.pillar3Title'), 
                          desc: t('companyPage.pillar3Desc') 
                        }
                      ]
                  ).map((phil, pIdx) => {
                    const meta = getPhilosophyMeta(phil.title, pIdx);
                    const PhilIcon = meta.icon;
                    const displayTitle = (pIdx === 0 ? t('companyPage.pillar1Title') : (pIdx === 1 ? t('companyPage.pillar2Title') : (pIdx === 2 ? t('companyPage.pillar3Title') : null))) || translateDynamic(phil.title);
                    const displayDesc = (pIdx === 0 ? t('companyPage.pillar1Desc') : (pIdx === 1 ? t('companyPage.pillar2Desc') : (pIdx === 2 ? t('companyPage.pillar3Desc') : null))) || translateDynamic(phil.desc);
                    return (
                      <div key={phil.id || pIdx} className="philosophy-item-card">
                        <div 
                          className="philosophy-icon-wrap"
                          style={{
                            color: meta.color,
                            backgroundColor: meta.bgColor,
                            borderColor: meta.borderColor
                          }}
                        >
                          <PhilIcon size={18} />
                        </div>
                        <div className="philosophy-body">
                          <h5 className="philosophy-title" style={{ color: isDarkFounder ? '#ffffff' : '#0f172a' }}>
                            {language === 'th' ? phil.title : displayTitle}
                          </h5>
                          <p className="philosophy-desc" style={{ color: isDarkFounder ? '#94a3b8' : '#475569' }}>
                            {language === 'th' ? phil.desc : displayDesc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Company Milestones & Journey */}
      <section className="milestones-section">
        <div className="container">
          <div className="section-header">
            <div className="badge-pill badge-amber">
              <Award size={14} />
              <span>{t('companyPage.milestonesBadge')}</span>
            </div>
            <h2 className="section-title">
              {language === 'th' ? (
                <>เส้นทางการเติบโตของ <span className="text-blue">G-SPEED GROUP</span></>
              ) : (
                <span>{t('companyPage.milestonesTitle')}</span>
              )}
            </h2>
            <p className="section-subtitle">
              {t('companyPage.milestonesSubtitle')}
            </p>
          </div>

          <div className="timeline-journey-grid">
            {(founder.history || FOUNDER_INFO.history).map((h, idx) => (
              <div key={idx} className="journey-card glass-panel">
                <div className="journey-year">{translateDynamic(h.year, language)}</div>
                <div className="journey-line"></div>
                <p className="journey-event">{translateDynamic(h.event, language)}</p>
              </div>
            ))}
          </div>

          {/* Stats Banner */}
          <div className="stats-banner-card glass-panel">
            <div className="stats-grid">
              {(founder.stats || FOUNDER_INFO.stats).map((s, idx) => (
                <div key={idx} className="stat-box">
                  <div className="stat-value text-blue">{translateDynamic(s.value, language)}</div>
                  <div className="stat-label">{translateDynamic(s.label, language)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* GALLERY 1: ใต้เส้นทางการเติบโต (Milestones & Growth Showcase) */}
          <div className="company-gallery-block">
            <div className="company-gallery-header-row">
              <div className="company-gallery-header-text">
                <div className="badge-pill badge-amber">
                  <Camera size={14} />
                  <span>GROWTH & MILESTONES SHOWCASE</span>
                </div>
                <h3 className="company-gallery-title">
                  {language === 'th' ? 'อัลบั้มภาพความสำเร็จ & การเติบโตของสาขา' : (language === 'zh' ? '成功足迹与分店拓展图集' : 'Milestones & Growth Showcase')}
                </h3>
                <p className="company-gallery-subtitle">
                  {language === 'th'
                    ? 'ภาพบันทึกความทรงจำการเปิดสาขาใหม่ วิวัฒนาการจากร้านอินเทอร์เน็ตสู่ Esport Arena เต็มรูปแบบ และการขยายเครือข่ายครอบคลุมทั่วประเทศ'
                    : (language === 'zh'
                      ? '记录新店开幕难忘时刻，从传统网吧转型为全功能电竞竞技场，并将网络拓展至全国各地。'
                      : 'Memories of branch grand openings, evolving from internet cafe to full Esport Arena, expanding across Thailand.')}
                </p>
              </div>
            </div>

            <div className="company-gallery-grid">
              {milestonesList.map((item, idx) => (
                <div 
                  key={item.id || idx} 
                  className="company-gallery-card"
                  onClick={() => openLightbox(milestonesList, idx)}
                >
                  <div className="company-gallery-thumb-box">
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="company-gallery-img" 
                      loading="lazy" 
                    />
                    <div className="company-gallery-tag-pill">
                      {item.tag || item.year || 'GROWTH'}
                    </div>
                    <div className="company-gallery-overlay">
                      <span className="company-gallery-zoom-badge">
                        <ZoomIn size={14} />
                        <span>{language === 'th' ? 'ดูภาพขนาดเต็ม' : (language === 'zh' ? '查看原图' : 'View Full Image')}</span>
                      </span>
                    </div>
                  </div>

                  <div className="company-gallery-body">
                    <div className="company-gallery-item-title">{translateDynamic(item.title, language)}</div>
                    <p className="company-gallery-item-caption">{translateDynamic(item.caption, language)}</p>
                    <div className="company-gallery-card-footer">
                      <span className="company-gallery-submeta">{item.year ? (language === 'th' ? `ปี ${item.year}` : (language === 'zh' ? `${item.year} 年` : `Year ${item.year}`)) : 'G-Speed Group'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Global Hardware & Tech Partners */}
      <section className="partners-section">
        <div className="container">
          <div className="section-header">
            <div className="badge-pill badge-cyan">
              <Zap size={14} />
              <span>OFFICIAL HARDWARE & ECOSYSTEM PARTNERS</span>
            </div>
            <h2 className="section-title">
              {language === 'th' ? (
                <>พันธมิตรเทคโนโลยี <span className="text-blue">ระดับโลก</span></>
              ) : (language === 'zh' ? (
                <>全球顶级 <span className="text-blue">科技合作伙伴</span></>
              ) : (
                <>Global Technology <span className="text-blue">Partners</span></>
              ))}
            </h2>
            <p className="section-subtitle">
              {language === 'th' 
                ? 'ร่วมมือโดยตรงกับแบรนด์ฮาร์ดแวร์ชั้นนำ เพื่อให้ลูกค้าและผู้ร่วมลงทุนแฟรนไชส์ได้รับอุปกรณ์สเปกที่ดีที่สุดในราคาต้นทุนพันธมิตร'
                : (language === 'zh'
                  ? '与全球一线硬件品牌深度直合，确保顾客及加盟投资伙伴以顶级成本优势享有最强电竞赛事规格配置。'
                  : 'Direct collaborations with global leading hardware brands, ensuring world-class tournament specs at partner-tier pricing.')}
            </p>
          </div>

          {/* Partner Logo Slider / Infinite Marquee - Minimalist Monochrome Black Edition */}
          <div className="partner-logo-slider-container partner-marquee-clean">
            <div className="partner-logo-track">
              {partnerLogosRepeated.map((p, idx) => (
                <div 
                  key={`${p.id || p.name}-${idx}`} 
                  className={`partner-clean-item ${isDarkFounder ? 'dark-mode' : ''} ${p.website && isSafeExternalUrl(p.website) ? 'clickable' : ''}`}
                  onClick={() => {
                    if (p.website && isSafeExternalUrl(p.website)) {
                      window.open(sanitizeSafeUrl(p.website), '_blank', 'noopener,noreferrer');
                    }
                  }}
                  title={p.website ? (language === 'zh' ? `访问网站 ${p.name}` : language === 'en' ? `Visit ${p.name} website` : `เข้าสู่เว็บไซต์ ${p.name}`) : p.name}
                  role={p.website ? 'link' : 'article'}
                  tabIndex={p.website ? 0 : undefined}
                >
                  {p.logo && (
                    <img 
                      src={p.logo} 
                      alt={p.name} 
                      className="partner-clean-logo"
                      loading="lazy" 
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <span className="partner-clean-name">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Corporate Compliance & Standards */}
      <section className="standards-section">
        <div className="container">
          <div className="standards-card glass-panel">
            <div className="standards-content">
              <div className="badge-pill badge-blue">
                <ShieldCheck size={14} />
                <span>{language === 'zh' ? '合规与法律认证' : language === 'en' ? 'LEGAL & STANDARD CERTIFICATION' : 'LEGAL & STANDARD CERTIFICATION'}</span>
              </div>
              <h3 className="standards-title">
                {language === 'zh' 
                  ? '合规、透明与安全认证标准' 
                  : language === 'en' 
                    ? 'Compliance, Transparency & Safety Standards' 
                    : translateDynamic(founder.standards?.title || 'มาตรฐานความถูกต้อง โปร่งใส และปลอดภัย', language)}
              </h3>
              <p className="standards-desc">
                {language === 'zh'
                  ? 'G-Speed 所有分店均通过泰国电影与录像法案严格审核，获得文化部官方颁发的营业许可，全场采用正版操作系统与正版游戏授权，全面保障投资人与玩家权益。'
                  : language === 'en'
                    ? 'All G-Speed arenas are certified under the Film and Video Act, officially licensed by the Ministry of Culture, running 100% genuine OS and game licenses.'
                    : translateDynamic(founder.standards?.desc || 'G-Speed ทุกสาขาผ่านการรับรองและตรวจสอบตามพระราชบัญญัติภาพยนตร์และวีดิทัศน์ ได้รับใบอนุญาตประกอบกิจการร้านเกมอย่างถูกต้องจากกระทรวงวัฒนธรรม ใช้ระบบปฏิบัติการ Windows และลิขสิทธิ์เกมแท้ 100% หมดกังวลเรื่องปัญหาลิขสิทธิ์', language)}
              </p>

              <div className="standards-pills">
                {(founder.standards?.pills && founder.standards.pills.length > 0
                  ? founder.standards.pills
                  : [
                      language === 'zh' ? '合法合规营业牌照与文化部许可' : language === 'en' ? 'Fully licensed and legally compliant venue' : 'ใบอนุญาตสถานประกอบการถูกต้องตามกฎหมาย',
                      language === 'zh' ? '泰国绿色健康网吧 少年儿童友好环境' : language === 'en' ? 'White Cyber Cafe standard, safe for youth' : 'ร้านเกมสีขาว ปลอดภัยสำหรับเยาวชน',
                      language === 'zh' ? '24小时高清 CCTV 监控与30天录像存储' : language === 'en' ? '24/7 CCTV surveillance with 30-day archive' : 'ระบบกล้องวงจรปิด CCTV Full HD บันทึก 30 วัน'
                    ]
                ).map((pill, plIdx) => (
                  <span key={plIdx} className="std-pill">
                    <CheckCircle2 size={16} className="text-blue" /> {translateDynamic(pill, language)}
                  </span>
                ))}
              </div>
            </div>

            <div className="standards-action">
              <button 
                type="button"
                onClick={onNavigateFranchise} 
                className="btn-partner-cta"
                title={language === 'zh' ? '点击打开加盟投资预算与3D空间规划系统' : language === 'en' ? 'Click to open franchise planner & 3D layout calculator' : 'คลิกเพื่อเปิดระบบคำนวณงบและวางแผนเปิดร้านแฟรนไชส์'}
              >
                <div className="btn-partner-icon-box">
                  <Calculator size={20} />
                </div>
                <div className="btn-partner-text-stack">
                  <span className="btn-partner-tier-sub">{t('companyPage.calculatorCta')}</span>
                  <span className="btn-partner-tier-main">{t('companyPage.calculatorBtn')}</span>
                </div>
              </button>
            </div>
          </div>

          {/* GALLERY 3: ใต้มาตรฐานความถูกต้อง (Compliance & Standards Showcase) */}
          <div className="company-gallery-block">
            <div className="company-gallery-header-row">
              <div className="company-gallery-header-text">
                <div className="badge-pill badge-blue">
                  <ShieldCheck size={14} />
                  <span>SAFETY & STANDARDS SHOWCASE</span>
                </div>
                <h3 className="company-gallery-title">
                  {language === 'th' ? 'ภาพการตรวจสอบมาตรฐาน & สภาพแวดล้อมร้านเกมสีขาว' : (language === 'zh' ? '合规认证与绿色健康电竞环境展示' : 'Compliance & Safe Cyber Cafe Environment')}
                </h3>
                <p className="company-gallery-subtitle">
                  {language === 'th'
                    ? 'ความโปร่งใส ปลอดภัย ตรวจสอบได้จริงตามมาตรฐานกระทรวงวัฒนธรรม ร้านเกมสีขาว และระบบดูแลความปลอดภัยตลอด 24 ชั่วโมง'
                    : (language === 'zh'
                      ? '透明、安全且严格符合泰国文化部认证标准，绿色健康网吧，全天候 24 小时安防监控体系。'
                      : 'Transparent, certified under Ministry of Culture standards, 100% smoke-free cyber cafe with 24/7 security.')}
                </p>
              </div>
            </div>

            <div className="company-gallery-grid">
              {standardsList.map((item, idx) => (
                <div 
                  key={item.id || idx} 
                  className="company-gallery-card"
                  onClick={() => openLightbox(standardsList, idx)}
                >
                  <div className="company-gallery-thumb-box">
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="company-gallery-img" 
                      loading="lazy" 
                    />
                    <div className="company-gallery-tag-pill" style={{ color: '#60a5fa' }}>
                      {translateDynamic(item.tag || 'CERTIFIED', language)}
                    </div>
                    <div className="company-gallery-overlay">
                      <span className="company-gallery-zoom-badge">
                        <ZoomIn size={14} />
                        <span>{language === 'th' ? 'ดูภาพขนาดเต็ม' : (language === 'zh' ? '查看原图' : 'View Full Image')}</span>
                      </span>
                    </div>
                  </div>

                  <div className="company-gallery-body">
                    <div className="company-gallery-item-title">{translateDynamic(item.title, language)}</div>
                    <p className="company-gallery-item-caption">{translateDynamic(item.caption, language)}</p>
                    <div className="company-gallery-card-footer">
                      <span className="company-gallery-submeta">{translateDynamic(item.tag || 'มาตรฐานความปลอดภัย', language)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL: FULL PHOTO VIEWER (FOR PUBLIC VISITORS) */}
      {lightboxData && lightboxData.list[lightboxData.index] && (() => {
        const curPhoto = lightboxData.list[lightboxData.index];
        return (
          <div 
            className="company-lightbox-backdrop"
            onClick={() => setLightboxData(null)}
          >
            <div 
              className="company-lightbox-panel"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleCompTouchStart}
              onTouchMove={handleCompTouchMove}
              onTouchEnd={handleCompTouchEnd}
            >
              <button 
                type="button" 
                className="lightbox-close-btn"
                onClick={() => setLightboxData(null)}
                title={language === 'zh' ? '关闭 (Esc)' : language === 'en' ? 'Close (Esc)' : 'ปิด (Esc)'}
              >
                <X size={20} />
              </button>

              <div className="company-lightbox-img-wrap">
                <img 
                  src={curPhoto.url} 
                  alt={curPhoto.title} 
                  className="company-lightbox-img" 
                  style={{
                    transform: compIsSwiping ? `translateX(${compSwipeOffset * 0.38}px)` : 'none',
                    transition: compIsSwiping ? 'none' : 'transform 0.22s ease-out'
                  }}
                  draggable={false}
                />

                {lightboxData.list.length > 1 && (
                  <>
                    <button 
                      type="button" 
                      className="lightbox-nav-btn prev"
                      onClick={handlePrevPhoto}
                      title={language === 'zh' ? '上一张 (左箭头)' : language === 'en' ? 'Previous (Left Arrow)' : 'ภาพก่อนหน้า (ลูกศรซ้าย)'}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      type="button" 
                      className="lightbox-nav-btn next"
                      onClick={handleNextPhoto}
                      title={language === 'zh' ? '下一张 (右箭头)' : language === 'en' ? 'Next (Right Arrow)' : 'ภาพถัดไป (ลูกศรขวา)'}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              <div className="company-lightbox-footer">
                <div className="lightbox-meta-info">
                  <div className="lightbox-tag-row">
                    <span className="lightbox-tag">{translateDynamic(curPhoto.tag || curPhoto.year || curPhoto.partner || 'SHOWCASE', language)}</span>
                  </div>
                  <h4 className="lightbox-title">{translateDynamic(curPhoto.title, language)}</h4>
                  <p className="lightbox-caption">{translateDynamic(curPhoto.caption, language)}</p>
                </div>

                <div className="lightbox-counter">
                  {lightboxData.index + 1} / {lightboxData.list.length}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
