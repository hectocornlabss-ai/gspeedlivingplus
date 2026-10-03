import React, { useState, useEffect } from 'react';
import { Gamepad2, Users, LayoutGrid, Calculator, Menu, X, ArrowRight, PhoneCall, Trophy, Sparkles, Globe, Camera, ShoppingBag, ShoppingCart, LogOut, User } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import LanguageSelector from './LanguageSelector';

export default function Navbar({ activeTab, setActiveTab, currentPath = '/', onNavigate }) {
  const { siteData } = useSiteData();
  const { t, language } = useTranslation();
  const { totalItems = 0, totalItemCount = 0, setIsCartOpen } = useCart();
  const { 
    currentUser, 
    isLoggedIn, 
    openLoginModal, 
    openMyOrdersModal, 
    logout 
  } = useCustomerAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
  const getNavIcon = (target = '', id = '', label = '') => {
    const key = `${target} ${id} ${label}`.toLowerCase();
    if (key.includes('arena') || key === '/') return Gamepad2;
    if (key.includes('company') || key.includes('about') || key.includes('team')) return Users;
    if (key.includes('franchise') || key.includes('3d') || key.includes('plan') || key.includes('shop') || key.includes('product') || key.includes('อุปกรณ์') || key.includes('สินค้า') || key.includes('โต๊ะ')) return ShoppingBag;
    if (key.includes('tournament') || key.includes('event')) return Trophy;
    if (key.includes('activit') || key.includes('gallery') || key.includes('photo') || key.includes('ภาพกิจกรรม') || key.includes('กล้อง')) return Camera;
    if (key.includes('contact') || key.includes('location') || key.includes('phone') || key.includes('map')) return PhoneCall;
    if (key.includes('http')) return Globe;
    return LayoutGrid;
  };

  // Active navigation items with clean semantic paths with internationalization support
  const navLabelMap = {
    'nav-arena': t('nav.home'),
    'nav-tournaments': t('nav.tournaments'),
    'nav-activities': t('nav.activities'),
    'nav-company': t('nav.company'),
    'nav-contact': t('nav.contact'),
    'arena': t('nav.home'),
    'tournaments': t('nav.tournaments'),
    'activities': t('nav.activities'),
    'company': t('nav.company'),
    'contact': t('nav.contact')
  };

  const defaultNavItems = [
    { id: 'nav-arena', label: t('nav.home'), target: 'arena', cleanPath: '/', visible: true },
    { id: 'nav-tournaments', label: t('nav.tournaments'), target: 'tournaments', cleanPath: '/tournaments', visible: true },
    { id: 'nav-activities', label: t('nav.activities'), target: 'activities', cleanPath: '/activities', visible: true },
    { id: 'nav-company', label: t('nav.company'), target: 'company', cleanPath: '/company', visible: true },
    { id: 'nav-contact', label: t('nav.contact'), target: 'contact', cleanPath: '/contact', visible: true }
  ];

  const activeNavItems = (siteData?.navLinks && siteData.navLinks.length > 0)
    ? siteData.navLinks
        .filter(item => item.visible !== false && (item.target || '').toLowerCase() !== 'franchise' && (item.target || '').toLowerCase() !== '3d')
        .map(item => {
          let cleanPath = '/';
          const targetStr = (item.target || '').toLowerCase();
          if (targetStr === 'company' || targetStr === 'about') cleanPath = '/company';
          else if (targetStr === 'events' || targetStr === 'tournaments' || targetStr.includes('tournament')) cleanPath = '/tournaments';
          else if (targetStr === 'activities' || targetStr === 'gallery' || targetStr.includes('activit')) cleanPath = '/activities';
          else if (targetStr === 'contact' || targetStr.includes('contact') || targetStr === 'location' || targetStr === 'map') cleanPath = '/contact';
          else if (targetStr.startsWith('/')) cleanPath = targetStr;

          // Standardize display label with translation support
          let label = navLabelMap[item.id] || navLabelMap[targetStr] || item.label;
          return { ...item, label, cleanPath };
        })
    : defaultNavItems;

  const handleNavClick = (target = 'arena', explicitPath = null) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
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
      else if (t === 'contact' || t === 'location' || t === 'map') destPath = '/contact';
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
        else if (destPath === '/contact' || destPath === '/contact-us') setActiveTab('contact');
        else setActiveTab('arena');
      }
      window.history.pushState(null, '', destPath);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  };

  const totalCartItems = totalItemCount || totalItems || 0;
  const openCart = () => {
    if (setIsCartOpen) setIsCartOpen(true);
  };

  const rawCtaText = siteData?.headerCta?.text;
  const isDefaultCta = !rawCtaText || rawCtaText === 'สนใจเปิดร้าน' || rawCtaText === 'คำนวณราคาเปิดร้าน' || rawCtaText === 'เปิดร้าน' || rawCtaText.includes('ขอใบเสนอราคา') || rawCtaText.includes('สั่งซื้ออุปกรณ์') || rawCtaText === 'สั่งซื้อสินค้า';
  const ctaLabel = isDefaultCta ? t('nav.cta') : rawCtaText;

  const headerCta = {
    text: ctaLabel,
    target: siteData?.headerCta?.target || 'franchise',
    visible: siteData?.headerCta?.visible !== false
  };

  return (
    <>
      <header className={`navbar-wrapper ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Brand Logo - GLP Esports */}
          <div 
            className="brand-logo" 
            onClick={() => handleNavClick('arena')}
            id="btn-brand-logo"
          >
            <div className="logo-icon-box">
              <img 
                src="/glp-logo-badge.png" 
                alt="GLP Esports" 
                className="brand-logo-img" 
              />
            </div>
            <div className="logo-text">
              <div className="logo-title">
                GLP <span className="text-blue">ESPORTS</span>
              </div>
              <div className="logo-subtitle">GSPEED LIVING PLUS</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {activeNavItems.map((item) => {
              const Icon = getNavIcon(item.target, item.id, item.label);
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
            <LanguageSelector variant="navbar" />

            {/* Member Profile / My Orders / Login Button */}
            {isLoggedIn ? (
              <div className="navbar-member-wrap" style={{ position: 'relative' }}>
                <button
                  id="btn-navbar-member-profile"
                  type="button"
                  className="btn-navbar-member"
                  onClick={() => setUserDropdownOpen(prev => !prev)}
                  title="ข้อมูลสมาชิก & ออเดอร์ของฉัน"
                >
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="member-avatar-mini" 
                    />
                  ) : (
                    <div className="member-avatar-placeholder">
                      {currentUser.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="member-name-label">{currentUser.name?.split(' ')[0] || 'สมาชิก'}</span>
                </button>

                {userDropdownOpen && (
                  <div 
                    className="member-dropdown-menu"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="member-dropdown-head">
                      <strong>{currentUser.name}</strong>
                      <span>{currentUser.email}</span>
                    </div>
                    <button 
                      type="button" 
                      className="member-dropdown-item"
                      onClick={() => openMyOrdersModal()}
                    >
                      <ShoppingBag size={15} />
                      <span>คำสั่งซื้อของฉัน (My Orders)</span>
                    </button>
                    <button 
                      type="button" 
                      className="member-dropdown-item logout"
                      onClick={() => logout()}
                    >
                      <LogOut size={15} />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-navbar-member-login"
                type="button"
                className="btn-navbar-member-login"
                onClick={() => openLoginModal()}
                title="เข้าสู่ระบบสมาชิก GLP"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="login-btn-label">สมาชิก</span>
              </button>
            )}

            {/* Cart Drawer Trigger Button */}
            <button 
              id="btn-navbar-cart"
              className="btn-navbar-cart"
              onClick={openCart}
              title="ตะกร้าสินค้า & ขอใบเสนอราคา"
              aria-label="ตะกร้าสินค้า"
            >
              <ShoppingCart size={18} />
              <span className="cart-btn-label">ตะกร้า</span>
              {totalCartItems > 0 && (
                <span className="cart-badge-count">{totalCartItems}</span>
              )}
            </button>

            {headerCta.visible !== false && (
              <button 
                id="btn-quick-franchise-cta"
                className="btn-primary header-cta-btn"
                onClick={() => handleNavClick(headerCta.target || 'franchise')}
              >
                <ShoppingBag size={16} />
                <span>{headerCta.text}</span>
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
              <span className="menu-btn-label">{mobileMenuOpen ? t('nav.close') : t('nav.menu')}</span>
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
              <img 
                src="/glp-logo-badge.png" 
                alt="GLP Esports" 
                className="brand-logo-img" 
              />
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
          {/* Mobile Language Switcher */}
          <div style={{
            padding: '10px 12px',
            marginBottom: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🌐 {language === 'th' ? 'เลือกภาษา / LANGUAGE' : language === 'zh' ? '选择语言 / LANGUAGE' : 'SELECT LANGUAGE'}
            </span>
            <LanguageSelector variant="segmented" />
          </div>

          <span className="mobile-menu-label">{t('nav.menu')} (NAVIGATION)</span>
          {activeNavItems.map((item) => {
            const Icon = getNavIcon(item.target, item.id, item.label);
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
              <span className="hotline-sub">{t('common.hotline') || 'สายด่วนจองเครื่อง & จองเวที'}:</span>
              <a href={`tel:${(siteData?.footer?.phone || '063-793-7704').replace(/[^0-9]/g, '')}`} className="hotline-number">
                {siteData?.footer?.phone || '063-793-7704'}
              </a>
            </div>
          </div>
        </div>

        <div className="mobile-drawer-footer">
          {/* Member Profile in Mobile Drawer */}
          {isLoggedIn ? (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <button 
                type="button"
                className="btn-outline full-width"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  openMyOrdersModal();
                }}
              >
                <ShoppingBag size={16} />
                <span>คำสั่งซื้อของฉัน ({currentUser.name?.split(' ')[0]})</span>
              </button>
              <button 
                type="button"
                className="btn-outline"
                style={{ padding: '0 12px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                onClick={() => logout()}
                title="ออกจากระบบ"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              type="button"
              className="btn-outline full-width"
              style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={() => {
                setMobileMenuOpen(false);
                openLoginModal();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>เข้าสู่ระบบสมาชิก (Google Login)</span>
            </button>
          )}

          <button 
            id="btn-mobile-drawer-cart"
            className="btn-outline full-width" 
            style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={() => {
              setMobileMenuOpen(false);
              openCart();
            }}
          >
            <ShoppingCart size={16} />
            <span>ตะกร้าสินค้า ({totalCartItems})</span>
          </button>

          {headerCta.visible !== false && (
            <button 
              className="btn-primary full-width" 
              onClick={() => handleNavClick(headerCta.target || 'franchise')}
            >
              <ShoppingBag size={16} />
              <span>{headerCta.text}</span>
            </button>
          )}
          <p className="mobile-footer-text">
            GSPEED LIVING PLUS • 24/7 Service
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
          <span className="bottom-nav-label">{t('nav.home')}</span>
        </button>

        <button 
          id="btn-bottom-nav-tournaments"
          type="button"
          className={`bottom-nav-item ${activeTab === 'tournaments' ? 'active' : ''}`}
          onClick={() => handleNavClick('tournaments', '/tournaments')}
        >
          <Trophy size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">{t('nav.tournaments')}</span>
        </button>

        <button 
          id="btn-bottom-nav-franchise"
          type="button"
          className={`bottom-nav-item bottom-nav-featured ${activeTab === 'franchise' ? 'active' : ''}`}
          onClick={() => handleNavClick('franchise', '/franchise')}
        >
          <div className="bottom-nav-feature-pill">
            <ShoppingBag size={20} className="bottom-nav-icon" />
          </div>
          <span className="bottom-nav-label">{t('nav.cta')}</span>
        </button>

        <button 
          id="btn-bottom-nav-activities"
          type="button"
          className={`bottom-nav-item ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => handleNavClick('activities', '/activities')}
        >
          <Camera size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">{t('nav.activities')}</span>
        </button>

        <button 
          id="btn-bottom-nav-menu"
          type="button"
          className={`bottom-nav-item ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="bottom-nav-label">{mobileMenuOpen ? t('nav.close') : t('nav.menu')}</span>
        </button>
      </nav>
    </>
  );
}
