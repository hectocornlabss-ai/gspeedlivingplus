import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, FileText, Search, PhoneCall, 
  Menu, X, Sparkles, CheckCircle2, ChevronDown, 
  MapPin, ShieldCheck, Truck, Clock, PackageCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function EquipmentNavbar({ onSelectCategory, activeCategory, onOpenContact, onOpenAbout }) {
  const { totalItemCount, setIsCartOpen, setIsQuotationModalOpen, setIsTrackingModalOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (catId) => {
    if (onSelectCategory) onSelectCategory(catId);
    setMobileMenuOpen(false);
    const catalogEl = document.getElementById('product-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Notification / Trust Bar */}
      <div className="equipment-top-bar">
        <div className="container equipment-top-inner">
          <div className="top-trust-items">
            <span className="top-trust-pill">
              <ShieldCheck size={13} className="text-blue" /> รับประกันโครงสร้าง 3-5 ปี
            </span>
            <span className="top-trust-pill">
              <Truck size={13} className="text-orange" /> จัดส่งและติดตั้งทั่วประเทศ
            </span>
            <span className="top-trust-pill">
              <FileText size={13} className="text-emerald" /> ออกใบเสนอราคา / ใบกำกับภาษีเต็มรูปแบบ
            </span>
          </div>
          <div className="top-contact-direct">
            <a href="tel:0637937704" className="top-phone-link">
              <PhoneCall size={12} /> ฝ่ายขาย & โครงการ: 063-793-7704
            </a>
            <span className="top-divider">|</span>
            <span className="top-open-hours">
              <Clock size={12} /> โชว์รูมเปิดบริการทุกวัน 24 ชม.
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className={`equipment-navbar ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="container equipment-navbar-container">
          {/* Logo & Store Name */}
          <div 
            className="store-brand" 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              if (onSelectCategory) onSelectCategory('all');
            }}
          >
            <div className="store-logo-wrapper">
              <img 
                src="/glp-logo-badge.png" 
                alt="Gspeed Living Plus" 
                className="store-logo-img" 
              />
            </div>
            <div className="store-brand-meta">
              <div className="brand-name">
                GSPEED <span className="brand-highlight">LIVING PLUS</span>
              </div>
              <div className="brand-tagline">
                โต๊ะ เก้าอี้เกมมิ่ง และอุปกรณ์สำนักงานครบวงจร
              </div>
            </div>
          </div>

          {/* Desktop Categories / Menu */}
          <nav className="desktop-menu">
            <button 
              className={`menu-link ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('all')}
            >
              สินค้าทั้งหมด
            </button>
            <button 
              className={`menu-link ${activeCategory === 'desks' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('desks')}
            >
              โต๊ะเกมมิ่ง & ทำงาน
            </button>
            <button 
              className={`menu-link ${activeCategory === 'chairs' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('chairs')}
            >
              เก้าอี้ Ergonomic
            </button>
            <button 
              className={`menu-link ${activeCategory === 'accessories' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('accessories')}
            >
              อุปกรณ์เสริม & รางไฟ
            </button>
            <button 
              className={`menu-link ${activeCategory === 'bundles' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('bundles')}
            >
              <Sparkles size={14} className="text-orange" /> เซ็ตสุดคุ้ม
            </button>
          </nav>

          {/* Action Buttons: Quotation, Tracking, Cart */}
          <div className="header-action-group">
            {/* Quick Quotation Button */}
            <button 
              id="btn-nav-quotation"
              className="action-btn-outline"
              title="ขอใบเสนอราคาด่วนสำหรับองค์กรหรือเบิกงบ"
              onClick={() => setIsQuotationModalOpen(true)}
            >
              <FileText size={17} />
              <span className="action-btn-text">ออกใบเสนอราคา</span>
            </button>

            {/* Quick Order Tracking */}
            <button 
              id="btn-nav-tracking"
              className="action-btn-ghost"
              title="ตรวจสอบสถานะคำสั่งซื้อหรือใบเสนอราคา"
              onClick={() => setIsTrackingModalOpen(true)}
            >
              <PackageCheck size={18} />
              <span className="action-btn-text-subtle">เช็คสถานะ</span>
            </button>

            {/* Cart Button */}
            <button 
              id="btn-nav-cart"
              className="action-btn-cart"
              onClick={() => setIsCartOpen(true)}
              aria-label="ตะกร้าสินค้า"
            >
              <div className="cart-icon-wrapper">
                <ShoppingCart size={20} />
                {totalItemCount > 0 && (
                  <span className="cart-badge-count">{totalItemCount}</span>
                )}
              </div>
              <span className="cart-btn-label">ตะกร้า</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button 
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="เปิดเมนู"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="equipment-mobile-menu">
            <div className="mobile-menu-links">
              <button 
                className={`mobile-menu-item ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('all')}
              >
                สินค้าทั้งหมด
              </button>
              <button 
                className={`mobile-menu-item ${activeCategory === 'desks' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('desks')}
              >
                โต๊ะเกมมิ่ง & ทำงาน
              </button>
              <button 
                className={`mobile-menu-item ${activeCategory === 'chairs' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('chairs')}
              >
                เก้าอี้ Ergonomic
              </button>
              <button 
                className={`mobile-menu-item ${activeCategory === 'accessories' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('accessories')}
              >
                อุปกรณ์เสริม & รางสายไฟ
              </button>
              <button 
                className={`mobile-menu-item ${activeCategory === 'bundles' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('bundles')}
              >
                เซ็ตสุดคุ้ม (Bundle Sets)
              </button>
            </div>

            <div className="mobile-menu-actions">
              <button 
                className="mobile-action-btn quote-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsQuotationModalOpen(true);
                }}
              >
                <FileText size={18} /> ออกใบเสนอราคา (Quotation)
              </button>

              <button 
                className="mobile-action-btn track-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsTrackingModalOpen(true);
                }}
              >
                <PackageCheck size={18} /> ติดตามคำสั่งซื้อ / ตรวจสถานะ
              </button>

              <div className="mobile-contact-bar">
                <a href="tel:0637937704" className="mobile-phone-link">
                  <PhoneCall size={16} /> โทรสั่งซื้อด่วน: 063-793-7704
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
