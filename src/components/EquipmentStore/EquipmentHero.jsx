import React from 'react';
import { 
  Sparkles, ShieldCheck, Truck, FileText, ArrowRight, 
  CheckCircle2, Box, Percent, Flame, Award
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function EquipmentHero({ onSelectCategory, onOpenCustomizer }) {
  const { setIsQuotationModalOpen } = useCart();

  const handleScrollToCatalog = (catId = 'all') => {
    if (onSelectCategory) onSelectCategory(catId);
    const catalogEl = document.getElementById('product-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="equipment-hero-section">
      <div className="container equipment-hero-container">
        {/* Left Column: Hero Text & CTAs */}
        <div className="hero-text-content">
          <div className="hero-badge-tag">
            <Sparkles size={14} className="text-orange" />
            <span>GSPEED LIVING PLUS • OFFICIAL STORE</span>
          </div>

          <h1 className="hero-main-title">
            โต๊ะ เก้าอี้เกมมิ่ง <br />
            <span className="hero-gradient-text">& อุปกรณ์สำนักงานครบวงจร</span>
          </h1>

          <p className="hero-description">
            ผู้จัดจำหน่ายโต๊ะเกมมิ่งโครงเหล็กคาร์บอน โต๊ะปรับระดับไฟฟ้า เก้าอี้ Ergonomic เพื่อสุขภาพ 
            และอุปกรณ์จัดโต๊ะคอมพิวเตอร์ระดับโปร มาตรฐานสนามแข่งอีสปอร์ตและองค์กรชั้นนำ 
            <strong> เลือกซื้อสินค้า ออกใบเสนอราคา (Quotation) และชำระเงินครบจบในที่เดียว</strong>
          </p>

          {/* Quick Value Metrics */}
          <div className="hero-value-badges">
            <div className="hero-badge-item">
              <ShieldCheck size={18} className="text-blue" />
              <div>
                <strong>รับประกัน 3 - 5 ปี</strong>
                <p>On-site Service ทั่วประเทศ</p>
              </div>
            </div>
            <div className="hero-badge-item">
              <FileText size={18} className="text-emerald" />
              <div>
                <strong>ออกใบเสนอราคาใน 1 นาที</strong>
                <p>รองรับนิติบุคคล หัก ณ ที่จ่าย</p>
              </div>
            </div>
            <div className="hero-badge-item">
              <Percent size={18} className="text-orange" />
              <div>
                <strong>ราคาส่ง B2B ลดสูงสุด 15%</strong>
                <p>สั่ง 5 ตัวขึ้นไปลดเพิ่มทันที</p>
              </div>
            </div>
          </div>

          {/* Hero CTAs */}
          <div className="hero-cta-group">
            <button 
              id="hero-btn-explore"
              className="btn-hero-primary"
              onClick={() => handleScrollToCatalog('all')}
            >
              <span>เลือกชมสินค้าทั้งหมด</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Customer Trust Indicators */}
          <div className="hero-trust-bar">
            <div className="trust-stars">⭐⭐⭐⭐⭐</div>
            <div className="trust-text">
              ความพึงพอใจ <strong>4.9/5</strong> จากลูกค้าร้านเกม สำนักงาน และผู้ใช้งานจริงกว่า <strong>2,500+ แห่ง</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="hero-visual-showcase">
          <div className="hero-visual-card">
            <div className="card-top-glow"></div>
            
            {/* Visual Highlight Badge */}
            <div className="hero-promo-pill">
              <Flame size={14} className="text-orange" />
              <span>เซ็ตยอดนิยม: Complete Battle Station</span>
            </div>

            <div className="hero-featured-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80" 
                alt="Gspeed Battle Station"
                className="hero-featured-img" 
              />
              <div className="image-overlay-tags">
                <span className="tag-overlay-pill">🪑 เก้าอี้ Pro Master เอน 165°</span>
                <span className="tag-overlay-pill">🖥️ แขนจับจอคู่ Gas-Spring</span>
                <span className="tag-overlay-pill">⚡ โต๊ะ Battle Desk เหล็กคาร์บอน</span>
              </div>
            </div>

            {/* Quick Feature Strip */}
            <div className="hero-card-bottom">
              <div className="hero-card-stat">
                <span className="stat-label">โครงสร้าง</span>
                <span className="stat-val">Carbon Steel 1.5mm</span>
              </div>
              <div className="hero-card-stat">
                <span className="stat-label">รองรับน้ำหนัก</span>
                <span className="stat-val">สูงสุด 180 กก.</span>
              </div>
              <div className="hero-card-stat">
                <span className="stat-label">การจัดส่ง</span>
                <span className="stat-val text-emerald">พร้อมส่งใน 1-2 วัน</span>
              </div>
            </div>
          </div>

          {/* Quick Floating Cards */}
          <div className="floating-b2b-badge">
            <Award size={22} className="text-orange" />
            <div>
              <div className="f-title">สั่งสำหรับร้านเกม / ออฟฟิศ</div>
              <div className="f-desc">สั่ง 5-20+ ตัว มีบริการประกอบและติดตั้งถึงที่</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
