import React, { useState, useEffect } from 'react';
import { 
  Users, Award, Cpu, Zap, Armchair, Monitor, 
  Wifi, ShieldCheck, CheckCircle2, TrendingUp, Mail, Phone, MapPin, Quote, Calculator, ArrowRight,
  Camera, ZoomIn, ChevronLeft, ChevronRight, X, Layers, Building2, Target
} from 'lucide-react';
import { FOUNDER_INFO } from '../data/mockData';
import { useSiteData } from '../context/SiteDataContext';
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
  const founder = siteData?.founder || FOUNDER_INFO;
  const founderBg = founder.bgColor || '#ffffff';
  const isDarkFounder = isColorDark(founderBg);

  // Clean metrics values to ensure symmetrical, balanced layout
  const cleanExp = (() => {
    const raw = (founder.experience || '16+ ปี').trim();
    if (raw.includes('ในอุตสาหกรรม') || raw.length > 15) {
      const match = raw.match(/^(\d+\+?\s*ปี)/);
      return match ? match[1] : '16+ ปี';
    }
    return raw;
  })();

  const cleanBranches = (() => {
    const raw = (founder.managedBranches || '8 สาขา').trim();
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

  return (
    <div className="company-profile-page">
      {/* 1. Header Banner */}
      <section className="profile-hero-section">
        <div className="container">
          <div className="section-header-center">
            <div className="badge-pill badge-cyan">
              <Users size={14} />
              <span>{founder.hero?.badge || 'LEADERSHIP & CORPORATE PROFILE'}</span>
            </div>
            <h1 className="section-title">
              {founder.hero?.title ? (
                founder.hero.title
              ) : (
                <>วิสัยทัศน์ผู้บริหาร & <span className="text-blue">ประวัติองค์กร G-SPEED</span></>
              )}
            </h1>
            <p className="section-subtitle max-w-700">
              {founder.hero?.subtitle || 'มุ่งมั่นขับเคลื่อนอุตสาหกรรมอีสปอร์ตไทยสู่มาตรฐานสากล ด้วยเทคโนโลยีระดับมืออาชีพ และระบบการจัดการที่โปร่งใส มั่นคง ยั่งยืน'}
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
                    <span className="founder-tag">FOUNDER & CEO</span>
                  </div>
                </div>
                <div className="founder-quick-metrics">
                  <div className={`founder-m-item ${isDarkFounder ? 'dark-founder' : ''}`}>
                    <div className="founder-m-icon-wrap">
                      <Award size={18} />
                    </div>
                    <span className="m-val text-blue">{cleanExp}</span>
                    <span className="m-lbl">ประสบการณ์ในอุตสาหกรรม</span>
                  </div>
                  <div className={`founder-m-item ${isDarkFounder ? 'dark-founder' : ''}`}>
                    <div className="founder-m-icon-wrap">
                      <Building2 size={18} />
                    </div>
                    <span className="m-val text-blue">{cleanBranches}</span>
                    <span className="m-lbl">อารีนาที่บริหารจัดการ</span>
                  </div>
                </div>
              </div>

              {/* Founder Bio & Vision */}
              <div className="founder-info-col">
                <div className="badge-pill badge-blue">
                  <Award size={14} />
                  <span>PRESIDENT & FOUNDER</span>
                </div>
                <h2 className="founder-name" style={{ color: founder.titleColor || (isDarkFounder ? '#ffffff' : '#0f172a') }}>{founder.name}</h2>
                <div className="founder-title" style={{ color: isDarkFounder ? '#94a3b8' : '#64748b' }}>{founder.title}</div>

                <div className="founder-quote-box">
                  <Quote size={28} className="quote-icon text-blue" />
                  <p className="quote-text" style={{ color: founder.textColor || (isDarkFounder ? '#e2e8f0' : '#334155') }}>{founder.quote}</p>
                </div>

                <div className="vision-box">
                  <div className="vision-header-row">
                    <div className="vision-icon-badge">
                      <Target size={18} />
                    </div>
                    <h4 className="vision-title">
                      <span>วิสัยทัศน์และการขับเคลื่อน (Core Vision)</span>
                    </h4>
                  </div>
                  <p className="vision-text" style={{ color: founder.textColor || (isDarkFounder ? '#cbd5e1' : '#475569') }}>{founder.vision}</p>
                </div>

                <div className="founder-philosophy-list">
                  {(founder.philosophies && founder.philosophies.length > 0 
                    ? founder.philosophies 
                    : [
                        { title: 'เทคโนโลยีต้องดีที่สุด', desc: 'ลงทุนในฮาร์ดแวร์ระดับทัวร์นาเมนต์ จอ 360Hz และระบบเน็ตเวิร์กที่แข่งขันได้จริง' },
                        { title: 'สิ่งแวดล้อมปลอดภัยและได้มาตรฐาน', desc: 'ยึดหลักร้านเกมสีขาว ได้รับใบอนุญาตถูกต้อง 100% ปลอดบุหรี่และโปร่งใส' },
                        { title: 'คืนทุนไว พาร์ตเนอร์เติบโตยั่งยืน', desc: 'ระบบแฟรนไชส์ออกแบบโดยคำนึงถึงผลตอบแทนของผู้ลงทุน ควบคุมต้นทุนได้จริง' }
                      ]
                  ).map((phil, pIdx) => {
                    const meta = getPhilosophyMeta(phil.title, pIdx);
                    const PhilIcon = meta.icon;
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
                            {phil.title}
                          </h5>
                          <p className="philosophy-desc" style={{ color: isDarkFounder ? '#94a3b8' : '#475569' }}>
                            {phil.desc}
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
              <span>COMPANY MILESTONES</span>
            </div>
            <h2 className="section-title">
              เส้นทางการเติบโตของ <span className="text-blue">G-SPEED GROUP</span>
            </h2>
            <p className="section-subtitle">
              จากร้านอินเทอร์เน็ตคาเฟ่สาขาแรก สู่การเป็นเครือข่ายศูนย์กีฬาอีสปอร์ตครบวงจรชั้นนำของไทย
            </p>
          </div>

          <div className="timeline-journey-grid">
            {(founder.history || FOUNDER_INFO.history).map((h, idx) => (
              <div key={idx} className="journey-card glass-panel">
                <div className="journey-year">{h.year}</div>
                <div className="journey-line"></div>
                <p className="journey-event">{h.event}</p>
              </div>
            ))}
          </div>

          {/* Stats Banner */}
          <div className="stats-banner-card glass-panel">
            <div className="stats-grid">
              {(founder.stats || FOUNDER_INFO.stats).map((s, idx) => (
                <div key={idx} className="stat-box">
                  <div className="stat-value text-blue">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
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
                  อัลบั้มภาพความสำเร็จ & การเติบโตของสาขา
                </h3>
                <p className="company-gallery-subtitle">
                  ภาพบันทึกความทรงจำการเปิดสาขาใหม่ วิวัฒนาการจากร้านอินเทอร์เน็ตสู่ Esport Arena เต็มรูปแบบ และการขยายเครือข่ายครอบคลุมทั่วประเทศ
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
                        <span>ดูภาพขนาดเต็ม</span>
                      </span>
                    </div>
                  </div>

                  <div className="company-gallery-body">
                    <div className="company-gallery-item-title">{item.title}</div>
                    <p className="company-gallery-item-caption">{item.caption}</p>
                    <div className="company-gallery-card-footer">
                      <span className="company-gallery-submeta">{item.year ? `ปี ${item.year}` : 'G-Speed Group'}</span>
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
              พันธมิตรเทคโนโลยี <span className="text-blue">ระดับโลก</span>
            </h2>
            <p className="section-subtitle">
              ร่วมมือโดยตรงกับแบรนด์ฮาร์ดแวร์ชั้นนำ เพื่อให้ลูกค้าและผู้ร่วมลงทุนแฟรนไชส์ได้รับอุปกรณ์สเปกที่ดีที่สุดในราคาต้นทุนพันธมิตร
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
                  title={p.website ? `เข้าสู่เว็บไซต์ ${p.name}` : p.name}
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
                <span>LEGAL & STANDARD CERTIFICATION</span>
              </div>
              <h3 className="standards-title">{founder.standards?.title || 'มาตรฐานความถูกต้อง โปร่งใส และปลอดภัย'}</h3>
              <p className="standards-desc">
                {founder.standards?.desc || 'G-Speed ทุกสาขาผ่านการรับรองและตรวจสอบตามพระราชบัญญัติภาพยนตร์และวีดิทัศน์ ได้รับใบอนุญาตประกอบกิจการร้านเกมอย่างถูกต้องจากกระทรวงวัฒนธรรม ใช้ระบบปฏิบัติการ Windows และลิขสิทธิ์เกมแท้ 100% หมดกังวลเรื่องปัญหาลิขสิทธิ์'}
              </p>

              <div className="standards-pills">
                {(founder.standards?.pills && founder.standards.pills.length > 0
                  ? founder.standards.pills
                  : [
                      'ใบอนุญาตสถานประกอบการถูกต้องตามกฎหมาย',
                      'ร้านเกมสีขาว ปลอดภัยสำหรับเยาวชน',
                      'ระบบกล้องวงจรปิด CCTV Full HD บันทึก 30 วัน'
                    ]
                ).map((pill, plIdx) => (
                  <span key={plIdx} className="std-pill">
                    <CheckCircle2 size={16} className="text-blue" /> {pill}
                  </span>
                ))}
              </div>
            </div>

            <div className="standards-action">
              <button 
                type="button"
                onClick={onNavigateFranchise} 
                className="btn-partner-cta"
                title="คลิกเพื่อเปิดระบบคำนวณงบและวางแผนเปิดร้านแฟรนไชส์"
              >
                <div className="btn-partner-icon-box">
                  <Calculator size={20} />
                </div>
                <div className="btn-partner-text-stack">
                  <span className="btn-partner-tier-sub">{founder.franchiseCta?.subTitle || 'คำนวณงบลงทุน & วางระบบร้าน'}</span>
                  <span className="btn-partner-tier-main">{founder.franchiseCta?.title || 'ร่วมเป็นพาร์ตเนอร์แฟรนไชส์กับเรา'}</span>
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
                  ภาพการตรวจสอบมาตรฐาน & สภาพแวดล้อมร้านเกมสีขาว
                </h3>
                <p className="company-gallery-subtitle">
                  ความโปร่งใส ปลอดภัย ตรวจสอบได้จริงตามมาตรฐานกระทรวงวัฒนธรรม ร้านเกมสีขาว และระบบดูแลความปลอดภัยตลอด 24 ชั่วโมง
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
                      {item.tag || 'CERTIFIED'}
                    </div>
                    <div className="company-gallery-overlay">
                      <span className="company-gallery-zoom-badge">
                        <ZoomIn size={14} />
                        <span>ดูภาพขนาดเต็ม</span>
                      </span>
                    </div>
                  </div>

                  <div className="company-gallery-body">
                    <div className="company-gallery-item-title">{item.title}</div>
                    <p className="company-gallery-item-caption">{item.caption}</p>
                    <div className="company-gallery-card-footer">
                      <span className="company-gallery-submeta">{item.tag || 'มาตรฐานความปลอดภัย'}</span>
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
            >
              <button 
                type="button" 
                className="lightbox-close-btn"
                onClick={() => setLightboxData(null)}
                title="ปิด (Esc)"
              >
                <X size={20} />
              </button>

              <div className="company-lightbox-img-wrap">
                <img 
                  src={curPhoto.url} 
                  alt={curPhoto.title} 
                  className="company-lightbox-img" 
                />

                {lightboxData.list.length > 1 && (
                  <>
                    <button 
                      type="button" 
                      className="lightbox-nav-btn prev"
                      onClick={handlePrevPhoto}
                      title="ภาพก่อนหน้า (ลูกศรซ้าย)"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      type="button" 
                      className="lightbox-nav-btn next"
                      onClick={handleNextPhoto}
                      title="ภาพถัดไป (ลูกศรขวา)"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              <div className="company-lightbox-footer">
                <div className="lightbox-meta-info">
                  <div className="lightbox-tag-row">
                    <span className="lightbox-tag">{curPhoto.tag || curPhoto.year || curPhoto.partner || 'SHOWCASE'}</span>
                  </div>
                  <h4 className="lightbox-title">{curPhoto.title}</h4>
                  <p className="lightbox-caption">{curPhoto.caption}</p>
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
