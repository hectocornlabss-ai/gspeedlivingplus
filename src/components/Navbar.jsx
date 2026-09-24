import React, { useState, useEffect } from 'react';
import { Gamepad2, Users, LayoutGrid, Calculator, Menu, X, ArrowRight, PhoneCall, Trophy, Sparkles, Globe, Camera } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function Navbar({ activeTab, setActiveTab, currentPath = '/', onNavigate }) {
  const { siteData } = useSiteData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for enhanced sticky header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  // Dynamic Icon Selector
  const getNavIcon = (target = '', id = '') => {
    const key = `${target} ${id}`.toLowerCase();
    if (key.includes('arena') || key === '/') return Gamepad2;
    if (key.includes('company') || key.includes('about') || key.includes('team')) return Users;
    if (key.includes('franchise') || key.includes('3d') || key.includes('plan')) return LayoutGrid;
    if (key.includes('tournament') || key.includes('event')) return Trophy;
    if (key.includes('activit') || key.includes('gallery')) return Sparkles;
    if (key.includes('http')) return Globe;
    return LayoutGrid;
  };

  // Active navigation items with clean semantic paths (1.หน้าแรก 2.ทัวร์นาเมนต์ 3.ภาพกิจกรรม 4.เกี่ยวกับเรา)
  const defaultNavItems = [
    { id: 'nav-arena', label: 'หน้าแรก', target: 'arena', cleanPath: '/', visible: true },
    { id: 'nav-tournaments', label: 'ทัวร์นาเมนต์', target: 'tournaments', cleanPath: '/tournaments', visible: true },
    { id: 'nav-activities', label: 'ภาพกิจกรรม', target: 'activities', cleanPath: '/activities', visible: true },
    { id: 'nav-company', label: 'เกี่ยวกับเรา', target: 'company', cleanPath: '/company', visible: true }
  ];

  const activeNavItems = (siteData?.navLinks && siteData.navLinks.length > 0)
    ? siteData.navLinks
        .filter(item => item.visible !== false && (item.target || '').toLowerCase() !== 'franchise' && (item.target || '').toLowerCase() !== '3d')
        .map(item => {
          let cleanPath = '/';
          const t = (item.target || '').toLowerCase();
          if (t === 'company' || t === 'about') cleanPath = '/company';
          else if (t === 'events' || t === 'tournaments' || t.includes('tournament')) cleanPath = '/tournaments';
          else if (t === 'activities' || t === 'gallery' || t.includes('activit')) cleanPath = '/activities';
          else if (t.startsWith('/')) cleanPath = t;

          // Standardize display label if it matches default IDs
          let label = item.label;
          if (item.id === 'nav-arena' && (label === 'หน้าหลัก' || label === 'หน้าแรก & กิจกรรม')) label = 'หน้าแรก';
          if (item.id === 'nav-tournaments' && (label === 'ทัวร์นาเมนต์ & แข่งขัน' || label === 'งานแข่ง & อีเวนต์')) label = 'ทัวร์นาเมนต์';
          if (item.id === 'nav-activities' && (label === 'ภาพกิจกรรม & แกลเลอรี' || label === 'ภาพกิจกรรม')) label = 'ภาพกิจกรรม';
          if (item.id === 'nav-company' && (label === 'เกี่ยวกับองค์กร' || label === 'ข้อมูลบริษัท & พาร์ตเนอร์')) label = 'เกี่ยวกับเรา';

          return { ...item, label, cleanPath };
        })
    : defaultNavItems;

  const handleNavClick = (target = 'arena', explicitPath = null) => {
    setMobileMenuOpen(false);
    if (!target && !explicitPath) return;

    // 1. External Link
    if (target.startsWith('http://') || target.startsWith('https://')) {
      window.open(target, '_blank', 'noopener,noreferrer');
      return;
    }

    // 2. Resolve clean path
    let destPath = explicitPath;
    if (!destPath) {
      const t = target.replace(/^#\/?/, '').toLowerCase();
      if (t === 'arena' || t === 'home' || t === '') destPath = '/';
      else if (t === 'events' || t === 'tournaments') destPath = '/tournaments';
      else if (t === 'activities' || t === 'gallery') destPath = '/activities';
      else if (t === 'franchise' || t === 'planner') destPath = '/franchise';
      else if (t === 'company' || t === 'about') destPath = '/company';
      else if (t === 'admin' || t === 'cms') destPath = '/admin';
      else destPath = `/${t}`;
    }

    if (onNavigate) {
      onNavigate(destPath);
    } else {
      if (setActiveTab) {
        if (destPath === '/franchise') setActiveTab('franchise');
        else if (destPath === '/company') setActiveTab('company');
        else if (destPath === '/tournaments' || destPath === '/events') setActiveTab('tournaments');
        else if (destPath === '/activities' || destPath === '/gallery') setActiveTab('activities');
        else setActiveTab('arena');
      }
      window.history.pushState(null, '', destPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const headerCta = {
    text: (siteData?.headerCta?.text && siteData.headerCta.text !== 'คำนวณราคาเปิดร้าน') ? siteData.headerCta.text : 'สนใจเปิดร้าน',
    target: siteData?.headerCta?.target || 'franchise',
    visible: siteData?.headerCta?.visible !== false
  };

  return (
    <>
      <header className={`navbar-wrapper ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Brand Logo - G-Speed Blue & White CL */}
          <div 
            className="brand-logo" 
            onClick={() => handleNavClick('arena')}
            id="btn-brand-logo"
          >
            <div className="logo-icon-box">
              <span className="logo-letter">GL</span>
            </div>
            <div className="logo-text">
              <div className="logo-title">
                GLP <span className="text-blue">ESPORTS</span>
              </div>
              <div className="logo-subtitle">G-SPEED LIVING PLUS ARENA</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {activeNavItems.map((item) => {
              const Icon = getNavIcon(item.target, item.id);
              const isActive = (item.cleanPath === '/' && (currentPath === '/' || !currentPath)) ||
                (item.cleanPath && item.cleanPath !== '/' && (
                  currentPath === item.cleanPath ||
                  currentPath.startsWith(item.cleanPath + '/') ||
                  (item.cleanPath === '/tournaments' && (currentPath === '/events' || currentPath.startsWith('/events/'))) ||
                  (item.cleanPath === '/activities' && (currentPath === '/gallery' || currentPath.startsWith('/gallery/') || currentPath.startsWith('/news/') || currentPath.startsWith('/article/')))
                ));
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleNavClick(item.target, item.cleanPath)}
                  className={`nav-button ${isActive ? 'active' : ''} ${item.highlight ? 'nav-highlight' : ''}`}
                >
                  <Icon size={17} className="nav-icon" />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="badge-pulse-tag">{item.highlightTag || '3D Studio'}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Right Actions */}
          <div className="header-actions">
            {headerCta.visible !== false && (
              <button 
                id="btn-quick-franchise-cta"
                className="btn-primary header-cta-btn"
                onClick={() => handleNavClick(headerCta.target || 'franchise')}
              >
                <Calculator size={16} />
                <span>{headerCta.text || 'คำนวณราคาเปิดร้าน'}</span>
              </button>
            )}

            {/* Mobile Menu Button - Highlighted & Clearly Visible with Text */}
            <button 
              id="btn-mobile-menu-toggle"
              className={`mobile-toggle-btn ${mobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="menu-btn-label">{mobileMenuOpen ? 'ปิด' : 'เมนู'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Nav Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-head">
          <div className="brand-logo" onClick={() => handleNavClick('arena')}>
            <div className="logo-icon-box small">
              <span className="logo-letter">GL</span>
            </div>
            <span className="mobile-drawer-title">GLP ESPORTS</span>
          </div>
          <button 
            className="mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mobile-drawer-body">
          <span className="mobile-menu-label">เมนูนำทาง (NAVIGATION)</span>
          {activeNavItems.map((item) => {
            const Icon = getNavIcon(item.target, item.id);
            const isActive = (item.cleanPath === '/' && (currentPath === '/' || !currentPath)) ||
              (item.cleanPath && item.cleanPath !== '/' && currentPath.startsWith(item.cleanPath));
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.target, item.cleanPath)}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                <div className="mobile-item-left">
                  <Icon size={20} className="nav-drawer-icon" />
                  <span>{item.label}</span>
                </div>
                {item.highlight && <span className="badge-pulse-tag">{item.highlightTag || '3D Studio'}</span>}
                <ArrowRight size={16} className="mobile-arrow" />
              </button>
            );
          })}

          <div className="mobile-drawer-hotline">
            <PhoneCall size={18} className="text-blue" />
            <div>
              <span className="hotline-sub">สายด่วนจองเครื่อง & จองเวที:</span>
              <a href={`tel:${(siteData?.footer?.phone || '063-793-7704').replace(/[^0-9]/g, '')}`} className="hotline-number">
                {siteData?.footer?.phone || '063-793-7704'}
              </a>
            </div>
          </div>
        </div>

        <div className="mobile-drawer-footer">
          {headerCta.visible !== false && (
            <button 
              className="btn-primary full-width" 
              onClick={() => handleNavClick(headerCta.target || 'franchise')}
            >
              <Calculator size={16} />
              <span>{headerCta.text || 'สนใจเปิดร้าน'}</span>
            </button>
          )}
          <p className="mobile-footer-text">
            GLP ESPORT ARENA • เปิดบริการตลอด 24 ชม.
          </p>
        </div>
      </div>

      {/* Mobile & Tablet Fixed Bottom Navigation Bar ("buttonmenu" / bottom navigation bar) */}
      <nav className="mobile-bottom-nav" aria-label="แถบเมนูด้านล่างสำหรับมือถือและแท็บเล็ต">
        <button 
          id="btn-bottom-nav-arena"
          type="button"
          className={`bottom-nav-item ${activeTab === 'arena' ? 'active' : ''}`}
          onClick={() => handleNavClick('arena', '/')}
        >
          <Gamepad2 size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">หน้าแรก</span>
        </button>

        <button 
          id="btn-bottom-nav-tournaments"
          type="button"
          className={`bottom-nav-item ${activeTab === 'tournaments' ? 'active' : ''}`}
          onClick={() => handleNavClick('tournaments', '/tournaments')}
        >
          <Trophy size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">ทัวร์นาเมนต์</span>
        </button>

        <button 
          id="btn-bottom-nav-franchise"
          type="button"
          className={`bottom-nav-item bottom-nav-featured ${activeTab === 'franchise' ? 'active' : ''}`}
          onClick={() => handleNavClick('franchise', '/franchise')}
        >
          <div className="bottom-nav-feature-pill">
            <LayoutGrid size={20} className="bottom-nav-icon" />
          </div>
          <span className="bottom-nav-label">สนใจเปิดร้าน</span>
        </button>

        <button 
          id="btn-bottom-nav-activities"
          type="button"
          className={`bottom-nav-item ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => handleNavClick('activities', '/activities')}
        >
          <Camera size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">ภาพกิจกรรม</span>
        </button>

        <button 
          id="btn-bottom-nav-menu"
          type="button"
          className={`bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="bottom-nav-label">{mobileMenuOpen ? 'ปิด' : 'เมนู'}</span>
        </button>
      </nav>
    </>
  );
}
