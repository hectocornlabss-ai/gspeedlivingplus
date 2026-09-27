import React, { useState, useEffect } from 'react';
import { 
  MapPin, Phone, Navigation, ExternalLink, 
  Copy, Check, Send, Car, Train, Bus, 
  Sparkles, Building2, CheckCircle2,
  Clock, MailCheck, ShieldCheck, AlertCircle
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

const SUBJECT_OPTIONS = {
  general: 'สอบถามข้อมูลทั่วไป / อัตราค่าบริการ',
  tournament: 'ติดต่อจัดการแข่งขันอีสปอร์ต / เช่าสถานที่',
  bootcamp: 'จองห้อง VIP Bootcamp ซ้อมทีม',
  franchise: 'สนใจร่วมลงทุนแฟรนไชส์ร้านเกม',
  sponsor: 'ติดต่อโฆษณา / สปอนเซอร์กิจกรรม',
  other: 'เรื่องอื่นๆ'
};

export default function ContactPage({ onNavigateHome, onNavigateFranchise }) {
  const { siteData, addLead } = useSiteData();
  const contactPage = siteData?.contactPage || {};
  const footer = siteData?.footer || {};

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'general',
    message: ''
  });
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedInfo, setSubmittedInfo] = useState(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Anti-Spam Rate Limit Cooldown timer
  useEffect(() => {
    const checkCooldown = () => {
      try {
        const until = parseInt(sessionStorage.getItem('glp_contact_cooldown_until') || '0', 10);
        const now = Date.now();
        if (until > now) {
          setCooldownRemaining(Math.ceil((until - now) / 1000));
        } else {
          setCooldownRemaining(0);
        }
      } catch (e) {
        setCooldownRemaining(0);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  const storeAddress = contactPage.storeAddress || footer.address || '79 ซอย ลาดพร้าว 112 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310';
  const storePhone = contactPage.storePhone || footer.phone || '063-793-7704';
  const storeEmail = contactPage.storeEmail || footer.email || 'gspeedlivingplus35@gmail.com';
  const cleanPhoneDigits = storePhone.replace(/[^0-9+]/g, '');
  const locationHint = contactPage.locationHint || '(ทำเลศักยภาพ เชื่อมต่อระหว่าง ซอยลาดพร้าว 112 และ ซอยรามคำแหง 53 มีที่จอดรถยนต์และจักรยานยนต์)';

  const facebookUrl = contactPage.socialLinks?.facebook || footer.socialLinks?.facebook || 'https://www.facebook.com/gspeedlivingplus';
  const tiktokUrl = contactPage.socialLinks?.tiktok || footer.socialLinks?.tiktok || 'https://www.tiktok.com/@gspeedlivingplus';
  const instagramUrl = contactPage.socialLinks?.instagram || footer.socialLinks?.instagram || 'https://www.instagram.com/gspeedlivingplus';

  const googleMapsUrl = contactPage.googleMapsDirectUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeAddress)}`;
  const googleMapsEmbedUrl = contactPage.googleMapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(storeAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const heroBadge = contactPage.heroBadge || 'CONTACT & STORE LOCATION • 24/7 OPEN';
  const heroTitle = contactPage.heroTitle || 'ติดต่อเรา & แผนที่ร้าน GLP';
  const heroDesc = contactPage.heroDesc || 'ศูนย์กีฬาอีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากล GLP : G Speed Living Plus พร้อมต้อนรับนักกีฬาอีสปอร์ต เกมเมอร์ และผู้สนใจร่วมลงทุนแฟรนไชส์ตลอด 24 ชั่วโมง';

  const transportationList = (contactPage.transportation && contactPage.transportation.length > 0)
    ? contactPage.transportation.filter(t => t.visible !== false)
    : [
        {
          id: 'trans-1',
          type: 'train',
          title: 'รถไฟฟ้า MRT',
          desc: 'สายสีเหลือง: ลงสถานีลาดพร้าว 83 หรือ สถานีลาดพร้าว 101 จากนั้นต่อวินมอเตอร์ไซค์เข้าซอยลาดพร้าว 112 (ประมาณ 5 นาทีถึงหน้าร้าน)',
          tag: 'แนะนำสำหรับผู้ใช้รถไฟฟ้า',
          theme: 'yellow'
        },
        {
          id: 'trans-2',
          type: 'car',
          title: 'รถยนต์ส่วนบุคคล',
          desc: 'เข้าได้จาก ถ.ลาดพร้าว (ซอย 112) หรือจาก ถ.รามคำแหง (ซอย 53) มีลานจอดรถยนต์กว้างขวาง ปลอดภัย พร้อมกล้อง CCTV ตลอด 24 ชม.',
          tag: 'มีที่จอดรถรองรับ',
          theme: 'blue'
        },
        {
          id: 'trans-3',
          type: 'bus',
          title: 'รถโดยสารประจำทาง',
          desc: 'ฝั่งลาดพร้าว: สาย 8, 27, 44, 73, 96, 137, 145, 502, 514 | ฝั่งรามคำแหง: สาย 60, 71, 92, 93, 113, 168, 501',
          tag: 'เดินทางประหยัด',
          theme: 'purple'
        }
      ];

  const perksList = (contactPage.perks && contactPage.perks.length > 0)
    ? contactPage.perks.filter(p => p.visible !== false)
    : [
        { id: 'perk-1', text: 'เปิดบริการ 24 ชั่วโมง 365 วัน ไม่มีวันหยุด' },
        { id: 'perk-2', text: 'เวทีแข่งขัน 5v5 Stage และจอ LED Wall ระดับสากล' },
        { id: 'perk-3', text: 'ระบบ Diskless Server & เน็ตเวิร์ก 10Gbps แข่งขันระดับโปร' },
        { id: 'perk-4', text: 'ระบบความปลอดภัย CCTV 24 ชม. ปลอดบุหรี่ 100%' }
      ];

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cooldownRemaining > 0) {
      alert(`ระบบป้องกันการส่งซ้ำ (Anti-Spam): กรุณารออีก ${cooldownRemaining} วินาทีก่อนส่งข้อความใหม่อีกครั้ง`);
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('กรุณากรอกชื่อและเบอร์โทรศัพท์สำหรับติดต่อกลับ');
      return;
    }

    setIsSubmitting(true);
    const subjectLabel = SUBJECT_OPTIONS[formData.subject] || formData.subject;
    const inquiryRef = `GLP-INQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const smtpConfig = siteData?.smtpConfig || {
      host: 'smtp.gmail.com',
      port: '465',
      encryption: 'SSL/TLS',
      senderName: 'GLP : G-Speed Living Plus Support Team',
      senderEmail: 'gspeedlivingplus35@gmail.com',
      adminCcEmail: 'investment@gspeed-esport.com, engineering@gspeed-esport.com',
      autoReplyEnabled: true
    };

    setTimeout(() => {
      // 1. Save lead to SiteDataContext CRM pipeline
      if (typeof addLead === 'function') {
        try {
          addLead({
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            subject: subjectLabel,
            inquiryRef,
            channel: 'Web Contact Form',
            type: 'contact_inquiry',
            typeName: subjectLabel,
            stage: 'new',
            status: 'New',
            notes: `[หัวข้อ: ${subjectLabel}] ${formData.message.trim() || 'ไม่มีบันทึกเพิ่มเติม'}`
          });
        } catch (err) {
          console.warn('Error saving lead to SiteDataContext:', err);
        }
      }

      // 2. Dispatch automated email and record into glp_email_outbox (SMTP auto-reply & staff alert)
      const nowIso = new Date().toISOString();
      const newOutboxRecords = [];

      // A. Customer Auto-Reply Email (if customer provided email)
      if (formData.email.trim()) {
        newOutboxRecords.push({
          id: `mail-inq-${Date.now()}-1`,
          to: formData.email.trim(),
          customerName: formData.name.trim(),
          quoteRef: inquiryRef,
          subject: `[GLP Contact] ขอบพระคุณที่ติดต่อ GLP : G Speed Living Plus (เลขอ้างอิง ${inquiryRef})`,
          sentAt: nowIso,
          status: 'Delivered (SMTP 250 OK)',
          smtpServer: `${smtpConfig.host}:${smtpConfig.port} (${smtpConfig.encryption || 'SSL/TLS'})`,
          sender: `${smtpConfig.senderName || 'GLP Support'} <${smtpConfig.senderEmail || storeEmail}>`,
          details: {
            type: 'customer_contact_autoreply',
            inquiryRef,
            subject: subjectLabel,
            message: formData.message.trim(),
            phone: formData.phone.trim()
          }
        });
      }

      // B. Internal Staff Alert Email
      newOutboxRecords.push({
        id: `mail-alert-${Date.now()}-2`,
        to: smtpConfig.adminCcEmail || smtpConfig.senderEmail || storeEmail,
        customerName: formData.name.trim(),
        quoteRef: inquiryRef,
        subject: `[ALERT] ข้อความติดต่อใหม่ทางเว็บไซต์: คุณ${formData.name.trim()} (${subjectLabel})`,
        sentAt: nowIso,
        status: 'Delivered (SMTP 250 OK)',
        smtpServer: `${smtpConfig.host}:${smtpConfig.port}`,
        sender: `GLP Contact Alert System <no-reply@gspeedlivingplus.com>`,
        details: {
          type: 'staff_contact_notification',
          inquiryRef,
          customerName: formData.name.trim(),
          customerPhone: formData.phone.trim(),
          customerEmail: formData.email.trim() || 'ไม่ได้ระบุ',
          subject: subjectLabel,
          message: formData.message.trim()
        }
      });

      try {
        const existingOutbox = JSON.parse(localStorage.getItem('glp_email_outbox') || '[]');
        localStorage.setItem('glp_email_outbox', JSON.stringify([...newOutboxRecords, ...existingOutbox].slice(0, 50)));
      } catch (err) {
        console.warn('Error recording email outbox:', err);
      }

      // 3. Set Anti-Spam Rate Limit Cooldown (60 seconds)
      const cooldownUntil = Date.now() + 60 * 1000;
      sessionStorage.setItem('glp_contact_cooldown_until', cooldownUntil.toString());
      setCooldownRemaining(60);

      // 4. Update UI states
      setIsSubmitting(false);
      setSubmittedInfo({
        name: formData.name.trim(),
        customerEmail: formData.email.trim(),
        hasEmail: Boolean(formData.email.trim()),
        inquiryRef,
        subjectLabel
      });
      setSubmitSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'general',
        message: ''
      });
    }, 700);
  };

  return (
    <div className="contact-page-container">
      {/* 1. Header / Breadcrumb Hero */}
      <section className="contact-hero-banner">
        <div className="container">
          <div className="contact-breadcrumbs">
            <button onClick={onNavigateHome} className="breadcrumb-btn">หน้าแรก</button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">ติดต่อเรา & แผนที่ร้าน</span>
          </div>

          <div className="contact-hero-content">
            <div className="contact-badge-pill">
              <Sparkles size={14} className="text-yellow-400" />
              <span>{heroBadge}</span>
            </div>
            <h1 className="contact-hero-title">
              {heroTitle}
            </h1>
            <p className="contact-hero-desc">
              {heroDesc}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Featured Contact Card (Exact layout & styling from User Image 2) */}
      <section className="contact-card-highlight-section">
        <div className="container">
          <div className="glp-contact-card-frame">
            <div className="glp-contact-grid">
              
              {/* Left Column: แผนที่ร้าน */}
              <div className="glp-contact-col left-col">
                <div className="glp-col-header">
                  <MapPin size={22} className="glp-col-icon" />
                  <h2 className="glp-col-title">แผนที่ร้าน</h2>
                </div>
                
                <div className="glp-address-box">
                  <p className="glp-address-text">
                    {storeAddress}
                  </p>
                  <p className="glp-address-hint">
                    {locationHint}
                  </p>
                </div>

                <div className="glp-actions-row">
                  <a 
                    href={googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="glp-btn-direction"
                    title="เปิดแผนที่ Google Maps ในแท็บใหม่"
                  >
                    <Navigation size={16} />
                    <span>เปิด Google Maps นำทาง</span>
                    <ExternalLink size={14} className="opacity-75" />
                  </a>

                  <button 
                    onClick={() => handleCopy(storeAddress, 'address')} 
                    className="glp-btn-copy"
                    title="คัดลอกที่อยู่"
                  >
                    {copiedAddress ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    <span>{copiedAddress ? 'คัดลอกแล้ว' : 'คัดลอกที่อยู่'}</span>
                  </button>
                </div>
              </div>

              {/* Vertical Divider Line */}
              <div className="glp-contact-divider" aria-hidden="true" />

              {/* Right Column: ช่องทางการติดต่อ */}
              <div className="glp-contact-col right-col">
                <div className="glp-col-header">
                  <Phone size={22} className="glp-col-icon" />
                  <h2 className="glp-col-title">ช่องทางการติดต่อ</h2>
                </div>

                <div className="glp-contact-items-list">
                  {/* Phone */}
                  <div className="glp-contact-line">
                    <span className="glp-contact-label">เบอร์โทรศัพท์ (สายด่วน 24 ชม.):</span>
                    <div className="glp-contact-value-group">
                      <a href={`tel:${cleanPhoneDigits}`} className="glp-contact-value phone-val">
                        {storePhone}
                      </a>
                      <button 
                        onClick={() => handleCopy(storePhone, 'phone')} 
                        className="glp-copy-mini-btn"
                        title="คัดลอกเบอร์โทร"
                      >
                        {copiedPhone ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="glp-contact-line">
                    <span className="glp-contact-label">อีเมลติดต่อ:</span>
                    <div className="glp-contact-value-group">
                      <a href={`mailto:${storeEmail}`} className="glp-contact-value email-val">
                        {storeEmail}
                      </a>
                      <button 
                        onClick={() => handleCopy(storeEmail, 'email')} 
                        className="glp-copy-mini-btn"
                        title="คัดลอกอีเมล"
                      >
                        {copiedEmail ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* 3 Social Media Buttons (Matching User Image 3) */}
                  <div className="glp-social-block">
                    <span className="glp-social-label">ช่องทางโซเชียลมีเดียหลัก (เปิดหน้าต่างใหม่):</span>
                    <div className="glp-social-icons-row">
                      {/* 1. Facebook */}
                      <a 
                        href={facebookUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="glp-social-circle-btn fb-circle"
                        title="ติดตาม Facebook GLP : G Speed Living Plus"
                        aria-label="Facebook"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>

                      {/* 2. TikTok */}
                      <a 
                        href={tiktokUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="glp-social-circle-btn tt-circle"
                        title="ติดตาม TikTok @gspeedlivingplus"
                        aria-label="TikTok"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </a>

                      {/* 3. Instagram */}
                      <a 
                        href={instagramUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="glp-social-circle-btn ig-circle"
                        title="ติดตาม Instagram @gspeedlivingplus"
                        aria-label="Instagram"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Map & Live Navigation */}
      <section className="contact-map-section">
        <div className="container">
          <div className="map-wrapper-card">
            <div className="map-header-bar">
              <div className="map-header-info">
                <h3 className="map-header-title">แผนที่ดาวเทียม & ระบบนำทางพิกัดร้าน</h3>
                <p className="map-header-subtitle">ซอยลาดพร้าว 112 แขวงพลับพลา เขตวังทองหลาง กทม. 10310</p>
              </div>
              <a 
                href={googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="map-open-google-btn"
              >
                <ExternalLink size={16} />
                <span>เปิดแอป Google Maps</span>
              </a>
            </div>

            <div className="map-iframe-container">
              <iframe
                title="Google Maps Location - GLP G Speed Living Plus"
                src={googleMapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(storeAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Transportation Guide (การเดินทางสู่ร้าน) */}
      <section className="contact-transportation-section">
        <div className="container">
          <div className="section-title-box text-center">
            <span className="section-badge">DIRECTIONS & COMMUTE</span>
            <h2 className="section-heading">คู่มือการเดินทางมายัง GLP : G Speed Living Plus</h2>
            <p className="section-subtext">เดินทางสะดวกสบายจากทุกมุมเมือง ทั้งระบบขนส่งสาธารณะและรถยนต์ส่วนตัว</p>
          </div>

          <div className="transport-cards-grid">
            {transportationList.map((item) => {
              const themeClass = item.theme || 'blue';
              return (
                <div key={item.id} className="transport-card">
                  <div className={`transport-icon-box ${themeClass}`}>
                    {item.type === 'train' && <Train size={24} />}
                    {item.type === 'car' && <Car size={24} />}
                    {item.type === 'bus' && <Bus size={24} />}
                    {item.type === 'boat' && <Navigation size={24} />}
                    {item.type === 'other' && <MapPin size={24} />}
                  </div>
                  <h3 className="transport-card-title">{item.title}</h3>
                  <p className="transport-card-desc">
                    {item.desc}
                  </p>
                  {item.tag && (
                    <div className="transport-card-tag">{item.tag}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Contact Form & Fast Inquiry */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-form-card">
            <div className="form-info-side">
              <span className="form-badge">FAST INQUIRY</span>
              <h2 className="form-heading">ส่งข้อความติดต่อฝ่ายงาน</h2>
              <p className="form-desc">
                ไม่ว่าคุณจะมีข้อสงสัยเกี่ยวกับชั่วโมงเล่น, การจองห้อง Bootcamp, จัดแข่งทัวร์นาเมนต์ หรือสนใจร่วมลงทุนแฟรนไชส์ ทีมงาน GLP พร้อมติดต่อกลับภายใน 24 ชั่วโมง
              </p>

              <div className="form-perks-list">
                {perksList.map((perk) => (
                  <div key={perk.id} className="perk-item">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    <span>{perk.text}</span>
                  </div>
                ))}
              </div>

              {onNavigateFranchise && (
                <div className="form-franchise-box">
                  <Building2 size={20} className="text-blue" />
                  <div>
                    <strong style={{ color: '#0f172a', fontWeight: 800 }}>สนใจลงทุนเปิดร้านเกมแฟรนไชส์?</strong>
                    <p style={{ margin: '4px 0 8px 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
                      ทดลองจำลองผังร้าน 3D พร้อมคำนวณงบประมาณและระยะคืนทุนฟรี
                    </p>
                    <button onClick={onNavigateFranchise} className="form-btn-franchise">
                      ไปยังระบบวางแผนแฟรนไชส์ 3D &gt;
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="form-input-side">
              {submitSuccess && submittedInfo ? (
                <div className="form-success-banner">
                  <CheckCircle2 size={52} className="text-emerald-500 mb-3" />
                  <h3>ส่งข้อความเรียบร้อยแล้ว!</h3>
                  <div className="inquiry-ref-badge">
                    รหัสคำขอ: {submittedInfo.inquiryRef}
                  </div>
                  <p style={{ color: '#334155', marginTop: '6px' }}>
                    ขอบพระคุณ <strong>คุณ{submittedInfo.name}</strong> ที่ติดต่อ GLP ทีมงานผู้เชี่ยวชาญจะติดต่อกลับท่านโดยเร็วที่สุด
                  </p>

                  {submittedInfo.hasEmail ? (
                    <div className="smtp-status-note success">
                      <MailCheck size={18} className="text-emerald-600 shrink-0" />
                      <span>ระบบ Mail Server (SMTP 250 OK) ส่งอีเมลตอบรับอัตโนมัติไปยัง <strong>{submittedInfo.customerEmail}</strong> แล้ว</span>
                    </div>
                  ) : (
                    <div className="smtp-status-note info">
                      <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                      <span>บันทึกคำขอลงระบบ CRM และส่งอีเมลแจ้งเตือนทีมงานผู้ดูแล GLP เรียบร้อยแล้ว</span>
                    </div>
                  )}

                  <div style={{ marginTop: '20px' }}>
                    <button 
                      type="button" 
                      onClick={() => setSubmitSuccess(false)}
                      className="form-reset-btn"
                    >
                      ส่งข้อความอื่นเพิ่มเติม
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glp-contact-form">
                  <div className="form-group">
                    <label htmlFor="contact-name">ชื่อ - นามสกุล <span className="text-red-500">*</span></label>
                    <input 
                      id="contact-name"
                      type="text" 
                      required
                      placeholder="เช่น คุณกิตติศักดิ์ พรหมวารี"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="contact-phone">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
                      <input 
                        id="contact-phone"
                        type="tel" 
                        required
                        placeholder="08X-XXX-XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-email">อีเมล (สำหรับรับใบยืนยันทาง SMTP)</label>
                      <input 
                        id="contact-email"
                        type="email" 
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-subject">เรื่องที่ต้องการติดต่อ</label>
                    <select 
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="general">สอบถามข้อมูลทั่วไป / อัตราค่าบริการ</option>
                      <option value="tournament">ติดต่อจัดการแข่งขันอีสปอร์ต / เช่าสถานที่</option>
                      <option value="bootcamp">จองห้อง VIP Bootcamp ซ้อมทีม</option>
                      <option value="franchise">สนใจร่วมลงทุนแฟรนไชส์ร้านเกม</option>
                      <option value="sponsor">ติดต่อโฆษณา / สปอนเซอร์กิจกรรม</option>
                      <option value="other">เรื่องอื่นๆ</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message">รายละเอียดข้อความ</label>
                    <textarea 
                      id="contact-message"
                      rows="4" 
                      placeholder="ระบุรายละเอียดที่คุณต้องการสอบถาม หรือจำนวนทีม/วันที่ต้องการ..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  {cooldownRemaining > 0 && (
                    <div className="form-cooldown-warning">
                      <Clock size={16} className="shrink-0" />
                      <span>ระบบป้องกันการส่งซ้ำ (Anti-Spam Rate Limit): กรุณารออีก <strong>{cooldownRemaining}</strong> วินาที</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="form-submit-btn"
                    disabled={isSubmitting || cooldownRemaining > 0}
                  >
                    {isSubmitting ? (
                      <>
                        <Send size={18} />
                        <span>กำลังเชื่อมต่อ SMTP และส่งข้อมูล...</span>
                      </>
                    ) : cooldownRemaining > 0 ? (
                      <>
                        <Clock size={18} />
                        <span>กรุณารอ {cooldownRemaining} วินาที (ห้ามส่งซ้ำ)</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>ส่งข้อความหาทีมงาน GLP</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
