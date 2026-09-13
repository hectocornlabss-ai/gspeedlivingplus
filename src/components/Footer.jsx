import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Award, Clock } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function Footer({ setActiveTab }) {
  const { siteData } = useSiteData();
  const footer = siteData?.footer || {
    companyName: 'G-SPEED ESPORT CO., LTD.',
    description: 'ผู้นำศูนย์กีฬาอีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากลในประเทศไทย ให้บริการสนามแข่งขันระดับทัวร์นาเมนต์ ห้องซ้อมระดับมืออาชีพ และระบบแฟรนไชส์สร้างอาชีพที่ยั่งยืน',
    address: 'อาคาร จี-สปีด ทาวเวอร์ ชั้น 4 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
    phone: '02-999-8888, 089-777-6655',
    email: 'franchise@gspeed-arena.com',
    hours: 'จันทร์ - เสาร์ (09:00 - 18:00 น.) / สนามแข่งขันเปิด 24 ชม.',
    copyright: '2026 G-SPEED ESPORT CO., LTD. ALL RIGHTS RESERVED.'
  };
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <div className="logo-icon-box small">
                <span className="logo-letter">G</span>
              </div>
              <span className="footer-brand-title">{footer.companyName || 'G-SPEED ESPORT ARENA'}</span>
            </div>
            <p className="footer-desc">
              {footer.description}
            </p>
            <div className="trust-badges">
              <span className="trust-item"><ShieldCheck size={16} className="text-blue" /> ลิขสิทธิ์ซอฟต์แวร์แท้ 100%</span>
              <span className="trust-item"><Award size={16} className="text-blue" /> มาตรฐานสมาคมกีฬาอีสปอร์ต</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">เมนูลัด</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => { setActiveTab('arena'); window.scrollTo(0, 0); }}>
                  หน้าหลัก & สนามแข่งขัน
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('arena'); window.scrollTo(0, 800); }}>
                  ปฏิทินทัวร์นาเมนต์
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('arena'); window.scrollTo(0, 1600); }}>
                  บริการรับจัดงานอีเวนต์ (Organizer)
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('company'); window.scrollTo(0, 0); }}>
                  ประวัติองค์กร & วิสัยทัศน์ผู้บริหาร
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('franchise'); window.scrollTo(0, 0); }} className="text-blue">
                  ระบบออกแบบผังร้าน & คำนวณราคาแฟรนไชส์
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Franchise Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">ติดต่อฝ่ายธุรกิจแฟรนไชส์</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={18} className="text-blue" />
                <span>สำนักงานใหญ่: {footer.address}</span>
              </li>
              <li>
                <Phone size={18} className="text-blue" />
                <span>สายด่วนแฟรนไชส์: {footer.phone}</span>
              </li>
              <li>
                <Mail size={18} className="text-blue" />
                <span>อีเมลฝ่ายธุรกิจ: {footer.email}</span>
              </li>
              <li>
                <Clock size={18} className="text-blue" />
                <span>เวลาทำการ: {footer.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {footer.copyright || `${new Date().getFullYear()} G-SPEED ESPORT CO., LTD. ALL RIGHTS RESERVED.`}</p>
          <div className="footer-legal-links">
            <a href="#terms">เงื่อนไขการใช้บริการ</a>
            <span>•</span>
            <a href="#privacy">นโยบายความเป็นส่วนตัว</a>
            <span>•</span>
            <a href="#franchise-terms">ข้อกำหนดการลงทุนแฟรนไชส์</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
