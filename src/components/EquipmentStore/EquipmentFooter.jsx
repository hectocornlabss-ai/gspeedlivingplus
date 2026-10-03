import React from 'react';
import { 
  Phone, Mail, MapPin, Clock, ShieldCheck, 
  Truck, Award, FileText, ArrowUp, ExternalLink 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function EquipmentFooter({ onSelectCategory }) {
  const { setIsQuotationModalOpen, setIsTrackingModalOpen } = useCart();

  const handleCategoryClick = (catId) => {
    if (onSelectCategory) onSelectCategory(catId);
    const catalogEl = document.getElementById('product-catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="equipment-footer-section">
      {/* Pre-footer Trust Strip */}
      <div className="footer-trust-strip">
        <div className="container footer-trust-grid">
          <div className="trust-item-col">
            <ShieldCheck size={28} className="text-blue" />
            <div>
              <strong>รับประกันคุณภาพ 3 - 5 ปี</strong>
              <p>มีทีมช่างบริการดูแล On-site และมีอะไหล่แท้พร้อมเปลี่ยนทุกชิ้นส่วน</p>
            </div>
          </div>

          <div className="trust-item-col">
            <Truck size={28} className="text-orange" />
            <div>
              <strong>บริการจัดส่งและประกอบติดตั้ง</strong>
              <p>จัดส่งทั่วประเทศ พร้อมบริการยกขึ้นอาคารและประกอบเรียบร้อย</p>
            </div>
          </div>

          <div className="trust-item-col">
            <FileText size={28} className="text-emerald" />
            <div>
              <strong>ออกเอกสารภาษีถูกต้อง 100%</strong>
              <p>ใบเสนอราคา (Quotation), ใบกำกับภาษีเต็มรูปแบบ และใบเสร็จรับเงิน</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container footer-main-body">
        <div className="footer-cols-grid">
          {/* Col 1: Brand & Bio */}
          <div className="footer-col brand-col">
            <div className="footer-brand-logo">
              <img src="/glp-logo-badge.png" alt="Gspeed Living Plus" />
              <div>
                <span className="brand-f-title">GSPEED</span>
                <span className="brand-f-sub">LIVING PLUS</span>
              </div>
            </div>
            <p className="footer-about-text">
              ผู้นำด้านโต๊ะเกมมิ่ง โต๊ะทำงานปรับระดับไฟฟ้า เก้าอี้สรีรศาสตร์ Ergonomic 
              และอุปกรณ์จัดโต๊ะคอมพิวเตอร์ระดับมืออาชีพ ตอบโจทย์ทั้งผู้ใช้งานทั่วไป สตรีมเมอร์ 
              และองค์กรธุรกิจ ร้านอินเทอร์เน็ตคาเฟ่ทั่วประเทศ
            </p>
            <div className="footer-tax-reg">
              ทะเบียนนิติบุคคล / เลขผู้เสียภาษี: <strong>0105563048912</strong>
            </div>
          </div>

          {/* Col 2: Product Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">หมวดหมู่สินค้า</h4>
            <ul className="footer-links-list">
              <li>
                <button onClick={() => handleCategoryClick('all')}>สินค้าทั้งหมด</button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('desks')}>โต๊ะเกมมิ่ง & โต๊ะทำงาน</button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('chairs')}>เก้าอี้ Ergonomic & เกมมิ่ง</button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('accessories')}>อุปกรณ์เสริม & รางสายไฟ</button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('bundles')}>เซ็ตสุดคุ้ม (Bundle Sets)</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Services & Tools */}
          <div className="footer-col">
            <h4 className="footer-heading">บริการ & เอกสาร</h4>
            <ul className="footer-links-list">
              <li>
                <button onClick={() => setIsQuotationModalOpen(true)}>
                  📄 ออกใบเสนอราคาด่วน (Quotation)
                </button>
              </li>
              <li>
                <button onClick={() => setIsTrackingModalOpen(true)}>
                  📦 ตรวจสอบสถานะคำสั่งซื้อ
                </button>
              </li>
              <li>
                <a href="tel:0637937704">สั่งซื้อราคาส่ง B2B (5-50 ตัวขึ้นไป)</a>
              </li>
              <li>
                <a href="https://maps.app.goo.gl/ak23az5WtsvXGWUR8" target="_blank" rel="noreferrer">
                  เยี่ยมชมโชว์รูมทดลองนั่งจริง <ExternalLink size={12} className="inline ml-1" />
                </a>
              </li>
              <li>
                <a href="/admin">เข้าสู่ระบบจัดการร้าน (Staff Portal)</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Showroom & Contact */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">โชว์รูม & ช่องทางติดต่อ</h4>
            <div className="footer-contact-items">
              <div className="c-item">
                <MapPin size={17} className="text-blue shrink-0 mt-1" />
                <span>
                  79 ซอยรามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพฯ 10310 
                  (เข้า-ออกได้ทั้งลาดพร้าว 112 และรามคำแหง 53)
                </span>
              </div>
              <div className="c-item">
                <Clock size={17} className="text-orange shrink-0" />
                <span>โชว์รูมเปิดบริการทุกวัน ตลอด 24 ชั่วโมง</span>
              </div>
              <div className="c-item">
                <Phone size={17} className="text-emerald shrink-0" />
                <a href="tel:0637937704" className="phone-bold">063-793-7704</a>
              </div>
              <div className="c-item">
                <Mail size={17} className="text-blue shrink-0" />
                <span>gspeedlivingplus35@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="footer-bottom-bar">
          <div className="copyright-text">
            © 2026 บริษัท จีสปีด ลิฟวิ่ง พลัส จำกัด (Gspeed Living Plus Co., Ltd.) สงวนลิขสิทธิ์ทุกประการ
          </div>

          <button className="back-to-top-btn" onClick={scrollToTop}>
            <span>กลับขึ้นด้านบน</span>
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
