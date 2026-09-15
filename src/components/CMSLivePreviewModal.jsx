import React, { useState } from 'react';
import { 
  Eye, X, Smartphone, Tablet, Monitor, Save, CheckCircle2, Trophy, Flame, 
  FileText, Layers, ShieldCheck, Palette, Globe, ExternalLink, ArrowRight, 
  Compass, Sparkles, MapPin, Calendar, Clock, Tag, Award, Quote, TrendingUp,
  Share2, Check, Shield, Coffee, ChevronRight, Zap, Info, RefreshCw
} from 'lucide-react';

// Helpers for dynamic theme contrast & color overlays
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

function hexToRgba(hex, alpha = 1) {
  if (!hex || typeof hex !== 'string') return `rgba(15, 23, 42, ${alpha})`;
  let c = hex.trim().replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length !== 6) return `rgba(15, 23, 42, ${alpha})`;
  const r = parseInt(c.substr(0, 2), 16) || 0;
  const g = parseInt(c.substr(2, 2), 16) || 0;
  const b = parseInt(c.substr(4, 2), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function CMSLivePreviewModal({
  isOpen,
  onClose,
  sectionType = 'hero',
  siteData = {},
  draftData = null,
  onSave = null
}) {
  const [viewport, setViewport] = useState('desktop'); // 'desktop', 'tablet', 'mobile'
  const [activeZoneTab, setActiveZoneTab] = useState('stage');
  const [previewPage, setPreviewPage] = useState('home'); // for full-site: 'home', 'company', 'franchise'

  if (!isOpen) return null;

  // Title mappings for section headers
  const SECTION_TITLES = {
    'hero': 'พรีวิว: ส่วนหัวหน้าแรก (Hero Section)',
    'banners': 'พรีวิว: แบนเนอร์คู่หน้าแรก (Feature Banners)',
    'tournaments': 'พรีวิว: ทัวร์นาเมนต์ & ปฏิทินแข่งขัน (Tournaments)',
    'zones': 'พรีวิว: บรรยากาศร้าน & โซนบริการ (Venue Atmosphere & Zones)',
    'franchise-cta': 'พรีวิว: แบนเนอร์ชวนลงทุนแฟรนไชส์ (Franchise CTA)',
    'news-sec': 'พรีวิว: ส่วนหัวบทความและข่าวสาร (News Section)',
    'founder': 'พรีวิว: ผู้ก่อตั้งและวิสัยทัศน์องค์กร (Founder & Executive Profile)',
    'theme': 'พรีวิว: ธีมสี & สไตล์ส่วนกลาง (Theme & Brand Colors)',
    'seo': 'พรีวิว: การแสดงผลบน Google Search & โซเชียลมีเดีย (SEO & Social Share)',
    'menu-footer': 'พรีวิว: แถบประกาศ Header & ส่วนท้าย Footer',
    'article-view': 'พรีวิว: หน้าอ่านบทความ / กิจกรรมฉบับเต็ม (Full Article View)',
    'full-site': 'พรีวิว: หน้าเว็บไซต์จริงแบบโต้ตอบ (Interactive Live Site)'
  };

  const title = SECTION_TITLES[sectionType] || 'พรีวิวตัวอย่างเนื้อหาก่อนบันทึก';

  // Active Zone data helper
  const zonesList = siteData?.venueZones || [];
  const currentZone = zonesList.find(z => z.id === activeZoneTab) || zonesList[0] || {
    id: 'stage',
    title: '5v5 Tournament Stage',
    subtitle: 'เวทีประลองระดับมืออาชีพ',
    description: 'เวทีแข่งขันแยก 2 ฝั่งพร้อมระบบกระจกกันเสียงระดับสตูดิโอ',
    specs: ['10x Pro Battle Stations', 'Soundproof Glass Booths'],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    badge: 'Official Tournament Ready'
  };

  return (
    <div className="cms-preview-modal-backdrop" onClick={onClose}>
      <div className="cms-preview-modal-dialog" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="cms-preview-modal-header">
          <div className="cms-preview-title-wrap">
            <Eye size={18} className="text-cyan" />
            <h4>{title}</h4>
            <span className="cms-preview-badge">LIVE PREVIEW</span>
          </div>

          {/* Device Viewport Selector */}
          <div className="cms-preview-viewport-bar">
            <button 
              className={`viewport-toggle-btn ${viewport === 'desktop' ? 'active' : ''}`}
              onClick={() => setViewport('desktop')}
              title="มุมมองหน้าจอคอมพิวเตอร์ Desktop (100%)"
            >
              <Monitor size={14} />
              <span>Desktop</span>
            </button>
            <button 
              className={`viewport-toggle-btn ${viewport === 'tablet' ? 'active' : ''}`}
              onClick={() => setViewport('tablet')}
              title="มุมมองแท็บเล็ต Tablet (768px)"
            >
              <Tablet size={14} />
              <span>Tablet</span>
            </button>
            <button 
              className={`viewport-toggle-btn ${viewport === 'mobile' ? 'active' : ''}`}
              onClick={() => setViewport('mobile')}
              title="มุมมองมือถือ Mobile (390px)"
            >
              <Smartphone size={14} />
              <span>Mobile</span>
            </button>
          </div>

          <button className="cms-preview-close-btn" onClick={onClose} title="ปิดหน้าต่างพรีวิว">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body with Viewport Simulator */}
        <div className="cms-preview-modal-body">
          <div className={`cms-preview-canvas viewport-${viewport}`}>

            {/* 1. HERO SECTION PREVIEW */}
            {sectionType === 'hero' && (() => {
              const heroBg = siteData?.hero?.backgroundImage || siteData?.hero?.bgOverlayImage;
              const effectiveBg = siteData?.hero?.bgColor || '#ffffff';
              const overlayType = siteData?.hero?.overlayType || 'light';
              const isDarkHero = Boolean(heroBg)
                ? (overlayType === 'dark')
                : isColorDark(effectiveBg);
              const opacity = siteData?.hero?.overlayOpacity ?? (overlayType === 'light' ? 0.82 : (overlayType === 'soft' ? 0.35 : 0.75));

              let previewBg = effectiveBg;
              if (heroBg) {
                if (overlayType === 'dark') {
                  previewBg = `linear-gradient(180deg, rgba(11, 15, 25, ${opacity}) 0%, rgba(15, 23, 42, ${Math.min(1, opacity + 0.1)}) 100%), url(${heroBg}) center/cover no-repeat`;
                } else if (overlayType === 'soft') {
                  previewBg = `linear-gradient(180deg, rgba(255, 255, 255, ${opacity}) 0%, rgba(241, 245, 249, ${Math.min(1, opacity + 0.1)}) 100%), url(${heroBg}) center/cover no-repeat`;
                } else if (overlayType === 'none') {
                  previewBg = `url(${heroBg}) center/cover no-repeat`;
                } else {
                  // 'light' default: Soft clean white frosted gradient
                  previewBg = `linear-gradient(180deg, rgba(255, 255, 255, ${opacity}) 0%, rgba(255, 255, 255, ${Math.max(0.45, opacity - 0.18)}) 50%, rgba(248, 250, 252, ${Math.min(1, opacity + 0.12)}) 100%), url(${heroBg}) center/cover no-repeat`;
                }
              }

              const resolvedTitleColor = isDarkHero 
                ? '#ffffff' 
                : (siteData?.hero?.titleColor && siteData?.hero?.titleColor !== '#ffffff' ? siteData?.hero?.titleColor : '#0f172a');
              const resolvedSubtitleColor = isDarkHero 
                ? '#cbd5e1' 
                : (siteData?.hero?.subtitleColor && siteData?.hero?.subtitleColor !== '#ffffff' && siteData?.hero?.subtitleColor !== '#e2e8f0' ? siteData?.hero?.subtitleColor : '#475569');

              return (
                <div 
                  className="preview-hero-block"
                  style={{
                    padding: viewport === 'mobile' ? '40px 16px' : '70px 40px',
                    backgroundColor: effectiveBg,
                    background: previewBg,
                    color: resolvedSubtitleColor,
                    textAlign: 'center',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      background: isDarkHero ? 'rgba(56, 189, 248, 0.15)' : 'rgba(37, 99, 235, 0.08)', 
                      border: isDarkHero ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(37, 99, 235, 0.25)', 
                      padding: '6px 14px', 
                      borderRadius: '999px', 
                      fontSize: '0.78rem', 
                      fontWeight: 700, 
                      color: isDarkHero ? '#38bdf8' : '#1d4ed8', 
                      marginBottom: '16px' 
                    }}>
                      <Sparkles size={14} />
                      <span>{siteData?.hero?.badge || 'THAILAND FLAGSHIP ESPORT ARENA'}</span>
                    </div>

                    <h1 style={{ 
                      fontSize: viewport === 'mobile' ? '1.5rem' : '2.4rem', 
                      fontWeight: 800, 
                      lineHeight: '1.25', 
                      marginBottom: '16px', 
                      color: resolvedTitleColor,
                      textShadow: isDarkHero ? '0 2px 12px rgba(0,0,0,0.7)' : 'none'
                    }}>
                      {siteData?.hero?.title || 'ศูนย์อีสปอร์ตครบวงจร & ระบบแฟรนไชส์จัดผังร้านอัจฉริยะ'}
                    </h1>

                    <p style={{ 
                      fontSize: viewport === 'mobile' ? '0.86rem' : '1.05rem', 
                      color: resolvedSubtitleColor, 
                      lineHeight: '1.6', 
                      marginBottom: '28px', 
                      maxWidth: '640px', 
                      margin: '0 auto 28px' 
                    }}>
                      {siteData?.hero?.subtitle || 'สัมผัสประสบการณ์เกมมิ่งระดับทัวร์นาเมนต์ สเปก RTX 40 Series จอ 360Hz และระบบ 3D Interior Floor Plan คำนวณงบประมาณและผลตอบแทนการลงทุนทันที'}
                    </p>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
                        <Compass size={17} />
                        <span>{siteData?.hero?.primaryCta || 'จำลองผังร้าน 3D & คำนวณงบประมาณ'}</span>
                        <ArrowRight size={17} />
                      </button>
                      <button className="btn-secondary" style={{ padding: '12px 22px', fontSize: '0.9rem', background: isDarkHero ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)', color: isDarkHero ? '#fff' : '#1e293b', border: isDarkHero ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(203,213,225,0.9)' }}>
                        <Trophy size={17} />
                        <span>{siteData?.hero?.secondaryCta || 'ปฏิทินแข่งขัน & สมัครทัวร์นาเมนต์'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 2. FEATURE BANNERS PREVIEW */}
            {sectionType === 'banners' && (() => {
              const leftBg = siteData?.featureBanners?.bannerLeft?.bgColor || '#1e3a8a';
              const leftImg = siteData?.featureBanners?.bannerLeft?.image;
              const isDarkLeft = isColorDark(leftBg);
              const cardBgLeft = leftImg
                ? `linear-gradient(180deg, ${hexToRgba(leftBg, 0.65)} 0%, ${hexToRgba(leftBg, 0.92)} 100%), url(${leftImg}) center/cover no-repeat`
                : leftBg;

              const rightBg = siteData?.featureBanners?.bannerRight?.bgColor || '#1e293b';
              const rightImg = siteData?.featureBanners?.bannerRight?.image;
              const isDarkRight = isColorDark(rightBg);
              const cardBgRight = rightImg
                ? `linear-gradient(180deg, ${hexToRgba(rightBg, 0.65)} 0%, ${hexToRgba(rightBg, 0.92)} 100%), url(${rightImg}) center/cover no-repeat`
                : rightBg;

              return (
                <div style={{ padding: viewport === 'mobile' ? '20px 14px' : '36px 30px', background: '#ffffff' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: viewport === 'mobile' ? '1fr' : '1fr 1fr', 
                    gap: '20px' 
                  }}>
                    {/* Left Banner: Events */}
                    <div style={{
                      padding: '28px 24px',
                      borderRadius: '16px',
                      backgroundColor: leftBg,
                      background: cardBgLeft,
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '220px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                    }}>
                      <div>
                        <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', background: '#1d4ed8', color: '#fff', fontSize: '0.72rem', fontWeight: 700, marginBottom: '12px' }}>
                          {siteData?.featureBanners?.bannerLeft?.badge || 'GLP OUR EVENTS'}
                        </span>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: siteData?.featureBanners?.bannerLeft?.titleColor || (isDarkLeft ? '#fff' : '#0f172a'), marginBottom: '8px' }}>
                          {siteData?.featureBanners?.bannerLeft?.title || 'รวมภาพกิจกรรม & บรรยากาศสด'}
                        </h3>
                        <p style={{ fontSize: '0.84rem', color: siteData?.featureBanners?.bannerLeft?.descColor || (isDarkLeft ? '#cbd5e1' : '#475569'), lineHeight: '1.5', margin: 0 }}>
                          {siteData?.featureBanners?.bannerLeft?.desc || 'ภาพงานแข่ง LAN, งานเปิดตัวเกม, มีตติ้ง และพิธีมอบรางวัลชนะเลิศตลอดทั้งปี'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 600, fontSize: '0.86rem', marginTop: '20px' }}>
                        <span>{siteData?.featureBanners?.bannerLeft?.linkText || 'สำรวจอัลบั้มภาพกิจกรรม'}</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>

                    {/* Right Banner: News */}
                    <div style={{
                      padding: '28px 24px',
                      borderRadius: '16px',
                      backgroundColor: rightBg,
                      background: cardBgRight,
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '220px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                    }}>
                      <div>
                        <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.15)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, marginBottom: '12px' }}>
                          {siteData?.featureBanners?.bannerRight?.badge || 'GLP BLOG & NEWS'}
                        </span>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: siteData?.featureBanners?.bannerRight?.titleColor || (isDarkRight ? '#fff' : '#0f172a'), marginBottom: '8px' }}>
                          {siteData?.featureBanners?.bannerRight?.title || 'บทความ ข่าวสาร & ไฮไลต์เกม'}
                        </h3>
                        <p style={{ fontSize: '0.84rem', color: siteData?.featureBanners?.bannerRight?.descColor || (isDarkRight ? '#cbd5e1' : '#475569'), lineHeight: '1.5', margin: 0 }}>
                          {siteData?.featureBanners?.bannerRight?.desc || 'เกาะติดผลการแข่งขัน ทริกการเล่น สเปกอุปกรณ์ใหม่ และประกาศจากทางร้าน'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 600, fontSize: '0.86rem', marginTop: '20px' }}>
                        <span>{siteData?.featureBanners?.bannerRight?.linkText || 'อ่านบทความล่าสุด'}</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 3. VENUE ATMOSPHERE & ZONES PREVIEW */}
            {sectionType === 'zones' && (
              <div style={{ padding: viewport === 'mobile' ? '20px 14px' : '36px 30px', background: siteData?.zonesSection?.bgColor || '#f8fafc' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <span className="badge-pill badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Layers size={13} />
                    <span>{siteData?.zonesSection?.badge || 'VENUE ATMOSPHERE & ZONES'}</span>
                  </span>
                  <h2 style={{ fontSize: viewport === 'mobile' ? '1.3rem' : '1.8rem', fontWeight: 800, color: siteData?.zonesSection?.titleColor || '#0f172a', margin: '4px 0 8px' }}>
                    {siteData?.zonesSection?.title || 'บรรยากาศและโซนการให้บริการ GLP ESPORTS'}
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: siteData?.zonesSection?.subtitleColor || '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                    {siteData?.zonesSection?.subtitle || 'สัมผัสความพรีเมียมที่ออกแบบมาสำหรับเกมเมอร์ทุกสไตล์'}
                  </p>
                </div>

                {/* Zone Switcher Tabs */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {zonesList.map(z => {
                    const zTitle = z.title || z.name || 'โซน';
                    const isActive = (currentZone.id === z.id);
                    return (
                      <button
                        key={z.id}
                        type="button"
                        onClick={() => setActiveZoneTab(z.id)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          border: isActive ? '2px solid #1d4ed8' : '1px solid #e2e8f0',
                          background: isActive ? '#1d4ed8' : '#ffffff',
                          color: isActive ? '#ffffff' : '#334155',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: isActive ? '0 4px 12px rgba(29, 78, 216, 0.25)' : '0 1px 3px rgba(0,0,0,0.04)'
                        }}
                      >
                        {z.id === 'stage' && <Trophy size={14} />}
                        {z.id === 'vip' && <Shield size={14} />}
                        {z.id === 'standard' && <Monitor size={14} />}
                        {z.id === 'cafe' && <Coffee size={14} />}
                        <span>{zTitle}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Zone Card Showcase */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: viewport === 'mobile' ? '1fr' : '1.1fr 1fr'
                }}>
                  <div style={{ position: 'relative', minHeight: '260px' }}>
                    <img 
                      src={currentZone.image} 
                      alt={currentZone.title || currentZone.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {currentZone.badge || 'PRO SPEC'}
                    </div>
                  </div>

                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1d4ed8' }}>{currentZone.subtitle || 'จุดเด่นโซน'}</span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 10px' }}>
                        {currentZone.title || currentZone.name}
                      </h3>
                      <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: '1.6', marginBottom: '16px' }}>
                        {currentZone.description || currentZone.desc}
                      </p>

                      <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Zap size={14} className="text-blue" />
                          <span>สเปกและจุดเด่นประจำโซน:</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                          {(Array.isArray(currentZone.specs) ? currentZone.specs : (currentZone.specs || '').split(',')).map((spec, sIdx) => (
                            <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#334155' }}>
                              <CheckCircle2 size={13} className="text-blue" />
                              <span>{typeof spec === 'string' ? spec.trim() : spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      <Compass size={15} />
                      <span>ลองใส่โซนนี้ในผังร้าน 3D ของคุณ</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. FRANCHISE BANNER & CTA PREVIEW */}
            {sectionType === 'franchise-cta' && (
              <div style={{ padding: viewport === 'mobile' ? '20px 14px' : '36px 30px', background: '#ffffff' }}>
                <div style={{
                  padding: viewport === 'mobile' ? '30px 20px' : '48px 40px',
                  borderRadius: '20px',
                  backgroundColor: siteData?.franchiseBanner?.bgColor || '#1e3a8a',
                  backgroundImage: siteData?.franchiseBanner?.bgImage 
                    ? `linear-gradient(180deg, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0.9) 100%), url(${siteData.franchiseBanner.bgImage})` 
                    : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: siteData?.franchiseBanner?.descColor || '#ffffff',
                  textAlign: 'center',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', padding: '5px 14px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700, color: '#93c5fd', marginBottom: '14px' }}>
                    <Layers size={13} />
                    <span>{siteData?.franchiseBanner?.badge || 'G-SPEED FRANCHISE & INTERIOR PLANNER'}</span>
                  </div>

                  <h2 style={{ fontSize: viewport === 'mobile' ? '1.3rem' : '2rem', fontWeight: 800, color: siteData?.franchiseBanner?.headingColor || '#ffffff', margin: '0 0 14px', lineHeight: '1.3' }}>
                    {siteData?.franchiseBanner?.heading || 'อยากมีร้านเกมอีสปอร์ตสเปกเทพเป็นของตัวเอง?'}
                  </h2>

                  <p style={{ fontSize: viewport === 'mobile' ? '0.84rem' : '0.96rem', color: siteData?.franchiseBanner?.descColor || '#e2e8f0', lineHeight: '1.6', maxWidth: '680px', margin: '0 auto 24px' }}>
                    {siteData?.franchiseBanner?.desc || 'เพียงแค่คุณมีพื้นที่หรืออาคาร เรามีระบบ Interior Floor Plan Configurator ช่วยจำลองผังร้าน 2D สเกลจริง จัดวางโต๊ะคอมพิวเตอร์ เวทีแข่งขัน เคาน์เตอร์ และคำนวณต้นทุน สเปกอุปกรณ์ ระยะเวลาคืนทุน (ROI) และเวลาติดตั้งให้ทันที!'}
                  </p>

                  <button className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.92rem', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
                    <Compass size={17} />
                    <span>{siteData?.franchiseBanner?.buttonText || 'เริ่มออกแบบผังร้าน & ประเมินงบประมาณทันที'}</span>
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            )}

            {/* 5. TOURNAMENTS SECTION PREVIEW */}
            {sectionType === 'tournaments' && (() => {
              const tourBg = siteData?.tournamentsSection?.bgColor || '#ffffff';
              const isDarkTour = isColorDark(tourBg);

              return (
                <div style={{ padding: viewport === 'mobile' ? '20px 14px' : '36px 30px', background: tourBg, color: siteData?.tournamentsSection?.subtitleColor || (isDarkTour ? '#fff' : '#475569') }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, marginBottom: '8px' }}>
                      <Trophy size={13} />
                      <span>{siteData?.tournamentsSection?.badge || 'TOURNAMENTS & COMMUNITY EVENTS'}</span>
                    </span>
                    <h2 style={{ fontSize: viewport === 'mobile' ? '1.3rem' : '1.8rem', fontWeight: 800, margin: '4px 0 8px', color: siteData?.tournamentsSection?.titleColor || (isDarkTour ? '#ffffff' : '#0f172a') }}>
                      {siteData?.tournamentsSection?.title || 'ปฏิทินการแข่งขัน & ทัวร์นาเมนต์'}
                    </h2>
                    <p style={{ fontSize: '0.84rem', color: siteData?.tournamentsSection?.subtitleColor || (isDarkTour ? '#94a3b8' : '#64748b'), maxWidth: '600px', margin: '0 auto' }}>
                      {siteData?.tournamentsSection?.subtitle || 'เข้าร่วมชิงเงินรางวัลรวมกว่า ฿150,000 ทุกเดือน'}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: viewport === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    {(siteData?.tournaments || []).map(t => (
                      <div key={t.id} style={{ background: isDarkTour ? '#1e293b' : '#ffffff', borderRadius: '12px', padding: '18px', border: isDarkTour ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ background: '#1d4ed8', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>{t.game}</span>
                            <span style={{ fontSize: '0.72rem', color: t.status === 'Open' ? '#4ade80' : '#f59e0b', fontWeight: 600 }}>{t.status}</span>
                          </div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: isDarkTour ? '#fff' : '#0f172a', marginBottom: '8px' }}>{t.title}</h4>
                          <div style={{ fontSize: '0.78rem', color: isDarkTour ? '#94a3b8' : '#64748b', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                            <div><strong>วันแข่ง:</strong> {t.date}</div>
                            <div><strong>เงินรางวัล:</strong> <span style={{ color: '#1d4ed8', fontWeight: 700 }}>{t.prizePool}</span></div>
                            <div><strong>จำนวนทีม:</strong> {t.slots}</div>
                          </div>
                        </div>
                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 12px' }}>
                          สมัครแข่งขันฟรี
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 6. FOUNDER & COMPANY STORY PREVIEW */}
            {sectionType === 'founder' && (
              <div style={{ padding: viewport === 'mobile' ? '20px 14px' : '36px 30px', background: siteData?.founder?.bgColor || '#f8fafc' }}>
                <div style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: viewport === 'mobile' ? '1fr' : '260px 1fr'
                }}>
                  {/* Photo Col */}
                  <div style={{ padding: '24px', background: '#0f172a', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '130px', height: '130px', borderRadius: '14px', overflow: 'hidden', border: '3px solid #38bdf8', marginBottom: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
                      <img 
                        src={siteData?.founder?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"} 
                        alt={siteData?.founder?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <span style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '3px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>
                      FOUNDER & CEO
                    </span>
                    <div style={{ display: 'flex', gap: '14px', marginTop: '16px' }}>
                      <div>
                        <div style={{ color: '#38bdf8', fontSize: '1rem', fontWeight: 800 }}>16+ ปี</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.66rem' }}>ประสบการณ์</div>
                      </div>
                      <div>
                        <div style={{ color: '#38bdf8', fontSize: '1rem', fontWeight: 800 }}>8 สาขา</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.66rem' }}>อารีนาที่บริหาร</div>
                      </div>
                    </div>
                  </div>

                  {/* Info Col */}
                  <div style={{ padding: '24px' }}>
                    <span className="badge-pill badge-blue" style={{ marginBottom: '8px' }}>
                      <Award size={13} />
                      <span>LEADERSHIP & VISION</span>
                    </span>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: siteData?.founder?.titleColor || '#0f172a', margin: '4px 0 2px' }}>
                      {siteData?.founder?.name || 'คุณธนภัทร วรเชษฐ์'}
                    </h2>
                    <div style={{ fontSize: '0.82rem', color: '#1d4ed8', fontWeight: 600, marginBottom: '14px' }}>
                      {siteData?.founder?.title || 'ผู้ก่อตั้งและประธานเจ้าหน้าที่บริหาร GLP Group'}
                    </div>

                    <div style={{ background: '#eff6ff', borderLeft: '4px solid #1d4ed8', padding: '10px 14px', borderRadius: '0 8px 8px 0', marginBottom: '14px', fontStyle: 'italic', fontSize: '0.84rem', color: '#1e3a8a' }}>
                      <Quote size={18} style={{ display: 'inline', marginRight: '6px' }} />
                      "{siteData?.founder?.quote || 'เราไม่ได้มองว่าร้านเกมเป็นแค่ที่เล่นเกม แต่คือสนามซ้อมกีฬาของคนรุ่นใหม่'}"
                    </div>

                    <p style={{ fontSize: '0.84rem', color: siteData?.founder?.textColor || '#475569', lineHeight: '1.6', margin: 0 }}>
                      {siteData?.founder?.bio || 'มุ่งมั่นขับเคลื่อนอุตสาหกรรมอีสปอร์ตไทยสู่มาตรฐานสากล ด้วยเทคโนโลยีระดับมืออาชีพ และระบบการจัดการที่โปร่งใส มั่นคง ยั่งยืน'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. NEWS SECTION PREVIEW */}
            {sectionType === 'news-sec' && (
              <div style={{ padding: viewport === 'mobile' ? '20px 14px' : '36px 30px', background: siteData?.newsSection?.bgColor || '#ffffff' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <span className="badge-pill badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <FileText size={13} />
                    <span>{siteData?.newsSection?.badge || 'ARTICLES & UPDATES'}</span>
                  </span>
                  <h2 style={{ fontSize: viewport === 'mobile' ? '1.3rem' : '1.8rem', fontWeight: 800, color: siteData?.newsSection?.titleColor || '#0f172a', margin: '4px 0 8px' }}>
                    {siteData?.newsSection?.title || 'บทความ ไฮไลต์ & ข่าวสารวงการเกม'}
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: siteData?.newsSection?.subtitleColor || '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                    {siteData?.newsSection?.subtitle || 'เกาะติดข่าวสารการแข่งขัน ทริกเกมน่ารู้ และอัปเดตสเปกฮาร์ดแวร์ล่าสุด'}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: viewport === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {(siteData?.news || [
                    { id: 'sample-1', title: 'เปิดตัวเวทีแข่งขันใหม่มาตรฐาน Pro Circuit รองรับผู้ชม 200+ ที่นั่ง', date: '14 ก.ย. 2026', tag: 'ARENA UPDATE', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80', desc: 'ยกระดับประสบการณ์การแข่งขันด้วยจอแสดงผล 4K HDR ระบบเสียงสตูดิโอ และห้องกระจกซับเสียง 100%' },
                    { id: 'sample-2', title: 'เจาะลึก 5 สเปกคอมพิวเตอร์เกมมิ่ง RTX 40 Series สำหรับร้านเกมยุคใหม่', date: '12 ก.ย. 2026', tag: 'TECH SPEC', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80', desc: 'คู่มือเลือกการ์ดจอ ซีพียู และจอ 360Hz เพื่อให้ร้านเกมของคุณคืนทุนไวและมีลูกค้าประจำแน่นขนัด' }
                  ]).slice(0, 2).map(item => (
                    <div key={item.id} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                      <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
                        <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#1d4ed8', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>{item.tag}</span>
                      </div>
                      <div style={{ padding: '14px' }}>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>{item.date}</div>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', lineHeight: '1.4', margin: '0 0 8px' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: '1.5', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. THEME & COLORS PREVIEW */}
            {sectionType === 'theme' && (
              <div style={{ padding: '30px', background: siteData?.theme?.backgroundColor || '#ffffff', color: '#0f172a' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>ตัวอย่างพาเลตต์สีและส่วนประกอบ UI จริง (Live Color System)</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ padding: '14px', borderRadius: '10px', background: siteData?.theme?.primaryColor || '#1d4ed8', color: '#fff' }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Primary Color</div>
                    <strong style={{ fontSize: '0.9rem' }}>{siteData?.theme?.primaryColor || '#1d4ed8'}</strong>
                  </div>
                  <div style={{ padding: '14px', borderRadius: '10px', background: siteData?.theme?.secondaryColor || '#0ea5e9', color: '#fff' }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Secondary Color</div>
                    <strong style={{ fontSize: '0.9rem' }}>{siteData?.theme?.secondaryColor || '#0ea5e9'}</strong>
                  </div>
                  <div style={{ padding: '14px', borderRadius: '10px', background: siteData?.theme?.backgroundColor || '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Background</div>
                    <strong style={{ fontSize: '0.9rem' }}>{siteData?.theme?.backgroundColor || '#ffffff'}</strong>
                  </div>
                  <div style={{ padding: '14px', borderRadius: '10px', background: siteData?.theme?.surfaceColor || '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Surface / Card</div>
                    <strong style={{ fontSize: '0.9rem' }}>{siteData?.theme?.surfaceColor || '#f8fafc'}</strong>
                  </div>
                </div>

                {/* Sample UI Card using these theme colors */}
                <div style={{ background: siteData?.theme?.surfaceColor || '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px' }}>
                  <span style={{ display: 'inline-block', background: siteData?.theme?.primaryColor || '#1d4ed8', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '10px' }}>
                    PREVIEW CARD
                  </span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 8px' }}>ทดสอบการผสมสีบนการ์ดและปุ่ม</h4>
                  <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '16px' }}>นี่คือตัวอย่างการแสดงผลจริงเมื่อนำสีธีมไปประยุกต์ใช้กับปุ่มหลักและพื้นหลัง</p>
                  <button style={{ background: siteData?.theme?.primaryColor || '#1d4ed8', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                    ปุ่มทดสอบสีหลัก
                  </button>
                </div>
              </div>
            )}

            {/* 8. GLOBAL SEO & SOCIAL SHARE PREVIEW */}
            {sectionType === 'seo' && (
              <div style={{ padding: '30px', background: '#f8fafc' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                  การแสดงผลบน Google Search & โซเชียลมีเดีย
                </h3>

                {/* Google SERP Preview Card */}
                <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '0.74rem', color: '#202124', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Globe size={14} className="text-blue" />
                    <span>https://gspeedarena.com</span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: '#1a0dab', margin: '0 0 6px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                    {siteData?.globalSEO?.siteTitle || 'G-SPEED ESPORT ARENA | ศูนย์อีสปอร์ตครบวงจร'}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#4d5156', lineHeight: '1.5', margin: 0 }}>
                    {siteData?.globalSEO?.metaDescription || 'ศูนย์อีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากล สเปกเกมมิ่ง RTX 40 Series จอ 360Hz'}
                  </p>
                </div>

                {/* Social Share Simulator */}
                <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', maxWidth: '540px', margin: '0 auto', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}>
                  <div style={{ background: '#1877f2', padding: '10px 16px', color: '#fff', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Share2 size={15} />
                    <span>Facebook & LINE Social Share Card Preview</span>
                  </div>
                  <div style={{ height: '260px', background: '#0f172a' }}>
                    <img 
                      src={siteData?.globalSEO?.ogImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'} 
                      alt="OG Share" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '14px 16px', background: '#f0f2f5' }}>
                    <div style={{ fontSize: '0.7rem', color: '#65676b', textTransform: 'uppercase' }}>GSPEEDARENA.COM</div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#050505', margin: '3px 0 5px' }}>
                      {siteData?.globalSEO?.siteTitle || 'G-SPEED ESPORT ARENA'}
                    </h5>
                    <p style={{ fontSize: '0.78rem', color: '#65676b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {siteData?.globalSEO?.metaDescription || 'ศูนย์อีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากล'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 9. ARTICLE / EVENT FULL READER PREVIEW */}
            {sectionType === 'article-view' && draftData && (
              <div style={{ padding: viewport === 'mobile' ? '20px 14px' : '36px 30px', background: '#ffffff' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  {/* Article Category & Title */}
                  <div style={{ display: 'inline-block', background: '#1d4ed8', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700, marginBottom: '12px' }}>
                    {draftData.tag || draftData.category || 'EVENT HIGHLIGHT'}
                  </div>
                  <h1 style={{ fontSize: viewport === 'mobile' ? '1.4rem' : '2rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.3', marginBottom: '12px' }}>
                    {draftData.title || 'ชื่อกิจกรรม'}
                  </h1>
                  
                  {/* Meta */}
                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#64748b', flexWrap: 'wrap', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={13} /> {draftData.date || 'กันยายน 2026'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> {draftData.location || 'G-Speed Arena'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Trophy size={13} /> {draftData.partner || 'ASUS ROG'}</span>
                  </div>

                  {/* Cover Image */}
                  <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                    <img 
                      src={draftData.image} 
                      alt={draftData.imageAlt || draftData.title}
                      style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
                    />
                    {draftData.imageAlt && (
                      <div style={{ background: '#f8fafc', padding: '8px 14px', fontSize: '0.74rem', color: '#64748b', borderTop: '1px solid #e2e8f0' }}>
                        <strong>SEO ALT:</strong> {draftData.imageAlt}
                      </div>
                    )}
                  </div>

                  {/* Excerpt */}
                  {draftData.desc && (
                    <div style={{ fontSize: '0.96rem', fontWeight: 600, color: '#1e293b', lineHeight: '1.6', marginBottom: '20px', background: '#eff6ff', padding: '14px 18px', borderRadius: '10px', borderLeft: '4px solid #1d4ed8' }}>
                      {draftData.desc}
                    </div>
                  )}

                  {/* Paragraphs */}
                  <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.8', marginBottom: '30px' }}>
                    {(draftData.contentParagraphsText ? draftData.contentParagraphsText.split('\n\n') : (draftData.contentParagraphs || [''])).map((p, pIdx) => (
                      <p key={pIdx} style={{ marginBottom: '14px' }}>{p}</p>
                    ))}
                  </div>

                  {/* Gallery Section */}
                  {(draftData.galleryPhotos || []).length > 0 && (
                    <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
                        อัลบั้มภาพกิจกรรม ({(draftData.galleryPhotos || []).length} ภาพ)
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                        {(draftData.galleryPhotos || []).map((photo, phIdx) => (
                          <div key={phIdx} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                            <img 
                              src={photo.url || photo} 
                              alt={photo.alt || 'Gallery photo'} 
                              style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                            />
                            {photo.caption && (
                              <div style={{ padding: '6px 8px', fontSize: '0.7rem', color: '#64748b', background: '#f8fafc' }}>
                                {photo.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 10. MENU & FOOTER PREVIEW */}
            {sectionType === 'menu-footer' && (
              <div style={{ background: '#0f172a', color: '#ffffff' }}>
                {/* Announcement Ticker */}
                <div style={{ background: '#1d4ed8', padding: '8px 16px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}>
                  <Sparkles size={14} />
                  <span>{siteData?.ticker?.text || 'ประกาศ: G-Speed Esport Arena เปิดให้บริการ 24 ชม. ทุกวัน'}</span>
                </div>

                {/* Navbar */}
                <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#38bdf8' }}>G-SPEED ESPORT</div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.84rem' }}>
                    {(siteData?.navLinks || []).map(l => (
                      <span key={l.id} style={{ color: l.visible ? '#fff' : '#64748b' }}>{l.label}</span>
                    ))}
                  </div>
                  <button className="btn-primary btn-sm">
                    {siteData?.headerCta?.text || 'จองเครื่องล่วงหน้า'}
                  </button>
                </div>

                {/* Sample Content Divider */}
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  [พื้นที่เนื้อหาหน้าแรกของเว็บไซต์]
                </div>

                {/* Footer Preview */}
                <div style={{ background: '#090d16', padding: '30px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: viewport === 'mobile' ? '1fr' : '2fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <h5 style={{ color: '#38bdf8', margin: '0 0 8px' }}>G-SPEED ESPORT ARENA</h5>
                      <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                        {siteData?.footer?.aboutText || 'ศูนย์กีฬาอีสปอร์ตครบวงจรมาตรฐานสากล'}
                      </p>
                    </div>
                    <div>
                      <h6 style={{ color: '#fff', margin: '0 0 8px', fontSize: '0.8rem' }}>บริการของเรา</h6>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span>เวทีการแข่งขัน 5v5</span>
                        <span>ห้อง VIP สตรีมเมอร์</span>
                        <span>แฟรนไชส์ร้านเกม 3D</span>
                      </div>
                    </div>
                    <div>
                      <h6 style={{ color: '#fff', margin: '0 0 8px', fontSize: '0.8rem' }}>ติดต่อสอบถาม</h6>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span>โทร: {siteData?.footer?.contactPhone || '02-888-9999'}</span>
                        <span>อีเมล: {siteData?.footer?.contactEmail || 'partner@gspeedarena.com'}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                    {siteData?.footer?.copyright || '© 2026 G-Speed Esport Arena. All rights reserved.'}
                  </div>
                </div>
              </div>
            )}

            {/* 11. FULL SITE INTERACTIVE PREVIEW */}
            {sectionType === 'full-site' && (
              <div style={{ width: '100%', height: '700px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: '#1e293b', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setPreviewPage('home')}
                      style={{ padding: '4px 12px', borderRadius: '6px', background: previewPage === 'home' ? '#1d4ed8' : '#334155', color: '#fff', border: 'none', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      หน้าแรก (Home Arena)
                    </button>
                    <button 
                      onClick={() => setPreviewPage('company')}
                      style={{ padding: '4px 12px', borderRadius: '6px', background: previewPage === 'company' ? '#1d4ed8' : '#334155', color: '#fff', border: 'none', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      ผู้ก่อตั้ง & บริษัท (Company Profile)
                    </button>
                    <button 
                      onClick={() => setPreviewPage('franchise')}
                      style={{ padding: '4px 12px', borderRadius: '6px', background: previewPage === 'franchise' ? '#1d4ed8' : '#334155', color: '#fff', border: 'none', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      ผังร้าน 3D & แฟรนไชส์ (Franchise Planner)
                    </button>
                  </div>
                  <a href={`#/${previewPage === 'home' ? '' : previewPage}`} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                    <span>เปิดในแท็บใหม่</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <iframe 
                  src={`#/${previewPage === 'home' ? '' : previewPage}`} 
                  title="Full Live Site Simulator"
                  style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff' }}
                />
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="cms-preview-modal-footer">
          <div className="cms-preview-tip-text">
            <Info size={14} className="text-cyan" />
            <span>พรีวิวแสดงผลตามข้อมูลที่กำลังแก้ไขอยู่แบบเรียลไทม์ ตรวจสอบความถูกต้องก่อนกดบันทึก</span>
          </div>

          <div className="cms-preview-footer-actions">
            <button className="btn-secondary" onClick={onClose}>
              <X size={14} /> ปิดหน้าต่างพรีวิว
            </button>
            {onSave && (
              <button 
                className="btn-primary" 
                onClick={() => {
                  onSave();
                  onClose();
                }}
              >
                <Save size={14} /> ยืนยันบันทึกข้อมูลส่วนนี้ทันที
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
