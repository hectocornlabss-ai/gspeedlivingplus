import React from 'react';
import { 
  Users, Award, Cpu, Zap, Armchair, Monitor, 
  Wifi, ShieldCheck, CheckCircle2, TrendingUp, Mail, Phone, MapPin, Quote, Calculator, ArrowRight
} from 'lucide-react';
import { FOUNDER_INFO } from '../data/mockData';
import { useSiteData } from '../context/SiteDataContext';

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

  return (
    <div className="company-profile-page">
      {/* 1. Header Banner */}
      <section className="profile-hero-section">
        <div className="container">
          <div className="section-header-center">
            <div className="badge-pill badge-cyan">
              <Users size={14} />
              <span>LEADERSHIP & CORPORATE PROFILE</span>
            </div>
            <h1 className="section-title">
              วิสัยทัศน์ผู้บริหาร & <span className="text-blue">ประวัติองค์กร G-SPEED</span>
            </h1>
            <p className="section-subtitle max-w-700">
              มุ่งมั่นขับเคลื่อนอุตสาหกรรมอีสปอร์ตไทยสู่มาตรฐานสากล ด้วยเทคโนโลยีระดับมืออาชีพ และระบบการจัดการที่โปร่งใส มั่นคง ยั่งยืน
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
                  <div className="founder-m-item">
                    <span className="m-val text-blue">16+ ปี</span>
                    <span className="m-lbl">ประสบการณ์ในอุตสาหกรรม</span>
                  </div>
                  <div className="founder-m-item">
                    <span className="m-val text-blue">8 สาขา</span>
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
                  <h4 className="vision-title">
                    <TrendingUp size={18} className="text-blue" />
                    <span>วิสัยทัศน์และการขับเคลื่อน (Core Vision)</span>
                  </h4>
                  <p className="vision-text" style={{ color: founder.textColor || (isDarkFounder ? '#cbd5e1' : '#475569') }}>{founder.vision}</p>
                </div>

                <div className="founder-philosophy-list">
                  <div className="philosophy-item">
                    <CheckCircle2 size={18} className="text-blue" />
                    <div>
                      <strong>เทคโนโลยีต้องดีที่สุด:</strong> ลงทุนในฮาร์ดแวร์ระดับทัวร์นาเมนต์ จอ 360Hz และระบบเน็ตเวิร์กที่แข่งขันได้จริง
                    </div>
                  </div>
                  <div className="philosophy-item">
                    <CheckCircle2 size={18} className="text-blue" />
                    <div>
                      <strong>สิ่งแวดล้อมปลอดภัยและได้มาตรฐาน:</strong> ยึดหลักร้านเกมสีขาว ได้รับใบอนุญาตถูกต้อง 100% ปลอดบุหรี่และโปร่งใส
                    </div>
                  </div>
                  <div className="philosophy-item">
                    <CheckCircle2 size={18} className="text-blue" />
                    <div>
                      <strong>คืนทุนไว พาร์ตเนอร์เติบโตยั่งยืน:</strong> ระบบแฟรนไชส์ออกแบบโดยคำนึงถึงผลตอบแทนของผู้ลงทุน ควบคุมต้นทุนได้จริง
                    </div>
                  </div>
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

          <div className="partners-grid">
            {FOUNDER_INFO.partners.map((p, idx) => (
              <div key={idx} className="partner-card glass-panel">
                <div className="partner-icon-box">
                  {p.icon === 'Cpu' && <Cpu size={28} className="text-blue" />}
                  {p.icon === 'Zap' && <Zap size={28} className="text-blue" />}
                  {p.icon === 'Armchair' && <Armchair size={28} className="text-blue" />}
                  {p.icon === 'Monitor' && <Monitor size={28} className="text-blue" />}
                  {p.icon === 'Wifi' && <Wifi size={28} className="text-blue" />}
                </div>
                <h3 className="partner-name">{p.name}</h3>
                <div className="partner-tier">{p.tier}</div>
              </div>
            ))}
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
              <h3 className="standards-title">มาตรฐานความถูกต้อง โปร่งใส และปลอดภัย</h3>
              <p className="standards-desc">
                G-Speed ทุกสาขาผ่านการรับรองและตรวจสอบตามพระราชบัญญัติภาพยนตร์และวีดิทัศน์ ได้รับใบอนุญาตประกอบกิจการร้านเกมอย่างถูกต้องจากกระทรวงวัฒนธรรม ใช้ระบบปฏิบัติการ Windows และลิขสิทธิ์เกมแท้ 100% หมดกังวลเรื่องปัญหาลิขสิทธิ์
              </p>

              <div className="standards-pills">
                <span className="std-pill"><CheckCircle2 size={16} className="text-blue" /> ใบอนุญาตสถานประกอบการถูกต้องตามกฎหมาย</span>
                <span className="std-pill"><CheckCircle2 size={16} className="text-blue" /> ร้านเกมสีขาว ปลอดภัยสำหรับเยาวชน</span>
                <span className="std-pill"><CheckCircle2 size={16} className="text-blue" /> ระบบกล้องวงจรปิด CCTV Full HD บันทึก 30 วัน</span>
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
                  <span className="btn-partner-tier-sub">คำนวณงบลงทุน & วางระบบร้าน</span>
                  <span className="btn-partner-tier-main">ร่วมเป็นพาร์ตเนอร์แฟรนไชส์กับเรา</span>
                </div>
                <ArrowRight size={18} className="btn-partner-arrow" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
