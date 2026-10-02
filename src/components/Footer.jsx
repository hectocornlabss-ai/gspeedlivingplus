import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Award, Clock, Navigation } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { translateDynamic } from '../utils/autoTranslator';

export default function Footer({ setActiveTab, onNavigate }) {
  const { siteData } = useSiteData();
  const { t, language } = useTranslation();
  const footer = siteData?.footer || {
    companyName: 'GLP : G Speed Living Plus',
    description: 'ศูนย์กีฬาอีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากล บริหารงานโดย GLP Living Plus Group พร้อมระบบโซลูชันแฟรนไชส์อัจฉริยะสำหรับผู้ประกอบการรุ่นใหม่',
    address: '79 ซอย รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310',
    googleMapUrl: 'https://maps.app.goo.gl/ak23az5WtsvXGWUR8',
    phone: '063-793-7704',
    email: 'gspeedlivingplus35@gmail.com',
    hours: 'เปิดบริการตลอด 24 ชั่วโมง ทุกวัน (24/7)',
    copyright: '2026 GLP : G Speed Living Plus. All Rights Reserved.',
    socialLinks: {
      facebook: 'https://www.facebook.com/GLP.Gspeedlivingplus',
      tiktok: 'https://www.tiktok.com/@gspeedlivingplus',
      instagram: 'https://www.instagram.com/gspeedlivingplus'
    }
  };

  const handleLink = (path) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState(null, '', path);
      if (setActiveTab) {
        if (path === '/franchise') setActiveTab('franchise');
        else if (path === '/company') setActiveTab('company');
        else if (path === '/tournaments' || path === '/events') setActiveTab('tournaments');
        else if (path === '/activities' || path === '/gallery') setActiveTab('activities');
        else if (path === '/contact' || path === '/contact-us') setActiveTab('contact');
        else setActiveTab('arena');
      }
      window.scrollTo(0, 0);
    }
  };

  // Sanitize double copyright symbol
  const rawCopyright = footer.copyright || `${new Date().getFullYear()} GLP : G Speed Living Plus. All Rights Reserved.`;
  const cleanCopyright = rawCopyright.replace(/^©\s*/, '');

  const phoneDigits = (footer.phone || '063-793-7704').replace(/[^0-9+]/g, '');

  const defaultThAddress = '79 ซอย รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310';
  const defaultEnAddress = '79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310';
  const currentRawAddress = footer.address || defaultThAddress;
  const localizedAddress = language === 'th'
    ? currentRawAddress
    : (footer.address_en || translateDynamic(currentRawAddress, language) || defaultEnAddress);

  const currentRawHours = footer.hours || 'เปิดบริการตลอด 24 ชั่วโมง ทุกวัน (24/7)';
  const localizedHours = language === 'th'
    ? currentRawHours
    : (footer.hours_en || translateDynamic(currentRawHours, language) || (language === 'zh' ? '全天24小时营业，全年无休 (24/7)' : 'Open 24 Hours Daily (24/7)'));

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info & Socials */}
          <div className="footer-col brand-col">
            <div className="footer-logo" onClick={() => handleLink('/')} style={{ cursor: 'pointer' }}>
              <div className="logo-icon-box small">
                <img 
                  src="/glp-logo-badge.png" 
                  alt="GLP Esports" 
                  className="brand-logo-img" 
                />
              </div>
              <span className="footer-brand-title">{footer.companyName || 'GLP : G Speed Living Plus'}</span>
            </div>
            <p className="footer-desc">
              {language === 'th' ? footer.description : (t('footer.tagline') || footer.description)}
            </p>
            <div className="trust-badges">
              <span className="trust-item">
                <ShieldCheck size={16} className="text-blue" /> 
                {language === 'th' ? 'ลิขสิทธิ์ซอฟต์แวร์แท้ 100%' : language === 'zh' ? '100% 正版授权软件' : '100% Licensed Software'}
              </span>
              <span className="trust-item">
                <Award size={16} className="text-blue" /> 
                {language === 'th' ? 'มาตรฐานสมาคมกีฬาอีสปอร์ต' : language === 'zh' ? '职业电竞协会认证标准' : 'Esports Association Standards'}
              </span>
            </div>

            {/* 3 Prominent Social Media Buttons */}
            <div className="footer-social-wrapper">
              <span className="footer-social-heading">
                {language === 'th' ? 'ช่องทางโซเชียลมีเดีย:' : language === 'zh' ? '官方社交平台:' : 'Social Channels:'}
              </span>
              <div className="footer-social-row">
                {/* 1. Facebook */}
                <a 
                  href={(footer.socialLinks?.facebook && !footer.socialLinks.facebook.includes('gspeedesport')) ? footer.socialLinks.facebook : 'https://www.facebook.com/GLP.Gspeedlivingplus'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-social-circle fb"
                  title="Facebook GLP"
                  aria-label="Facebook GLP"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* 2. TikTok */}
                <a 
                  href={footer.socialLinks?.tiktok || 'https://www.tiktok.com/@gspeedlivingplus'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-social-circle tt"
                  title="TikTok GLP"
                  aria-label="TikTok GLP"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>

                {/* 3. IG */}
                <a 
                  href={footer.socialLinks?.instagram || 'https://www.instagram.com/gspeedlivingplus'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-social-circle ig"
                  title="Instagram GLP"
                  aria-label="Instagram GLP"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">{t('footer.quickLinks') || 'เมนูลัด'}</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => handleLink('/')}>
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/tournaments')}>
                  {t('nav.tournaments')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/activities')}>
                  {t('nav.activities')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/company')}>
                  {t('nav.company')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/contact')} className="text-highlight">
                  {t('nav.contact')}
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/franchise')} className="text-blue">
                  {t('nav.cta')}
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Store Contact */}
          <div className="footer-col">
            <h4 className="footer-heading">{t('footer.contactInfo') || 'ช่องทางการติดต่อ'}</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={18} className="text-blue shrink-0" />
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '2px' }}>
                    {language === 'th' ? 'ที่ตั้งอารีนา:' : language === 'zh' ? '场馆地址:' : 'Arena Location:'}
                  </span>
                  <span style={{ lineHeight: '1.5', display: 'block' }}>{localizedAddress}</span>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <a 
                      href={footer.googleMapUrl || 'https://maps.app.goo.gl/ak23az5WtsvXGWUR8'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="footer-map-action-btn"
                      style={{ textDecoration: 'none' }}
                    >
                      <Navigation size={13} />
                      <span>{language === 'th' ? 'เปิด Google Maps นำทาง' : language === 'zh' ? 'Google 地图导航' : 'Open in Google Maps'}</span>
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <Phone size={18} className="text-blue shrink-0" />
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {language === 'th' ? 'เบอร์โทรติดต่อ:' : language === 'zh' ? '联系电话:' : 'Phone Number:'}
                  </span>
                  <a href={`tel:${phoneDigits}`} className="footer-direct-link">
                    {footer.phone || '063-793-7704'}
                  </a>
                </div>
              </li>
              <li>
                <Mail size={18} className="text-blue shrink-0" />
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {language === 'th' ? 'อีเมลติดต่อ:' : language === 'zh' ? '电子邮箱:' : 'Email Address:'}
                  </span>
                  <a href={`mailto:${footer.email || 'gspeedlivingplus35@gmail.com'}`} className="footer-direct-link">
                    {footer.email || 'gspeedlivingplus35@gmail.com'}
                  </a>
                </div>
              </li>
              <li>
                <Clock size={18} className="text-blue shrink-0" />
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '2px' }}>
                    {language === 'th' ? 'เวลาทำการ:' : language === 'zh' ? '营业时间:' : 'Opening Hours:'}
                  </span>
                  <span style={{ lineHeight: '1.5', display: 'block' }}>{localizedHours}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {cleanCopyright}</p>
          <div className="footer-legal-links">
            <button 
              onClick={() => handleLink('/contact')}
              className="footer-legal-item"
            >
              {t('nav.contact')}
            </button>
            <span className="footer-legal-sep">•</span>
            <a href="#terms" className="footer-legal-item">
              <span>{language === 'th' ? 'เงื่อนไขการใช้บริการ' : language === 'zh' ? '服务条款' : 'Terms of Service'}</span>
            </a>
            <span className="footer-legal-sep">•</span>
            <a href="#privacy" className="footer-legal-item">
              <span>{language === 'th' ? 'นโยบายความเป็นส่วนตัว' : language === 'zh' ? '隐私政策' : 'Privacy Policy'}</span>
            </a>
            <span className="footer-legal-sep">•</span>
            <a href="#franchise-terms" className="footer-legal-item">
              <span>{language === 'th' ? 'ข้อกำหนดการลงทุนแฟรนไชส์' : language === 'zh' ? '加盟投资条款' : 'Franchise Terms'}</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
