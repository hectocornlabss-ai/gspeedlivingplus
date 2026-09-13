import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Trophy, Users, Share2, Copy, Check, 
  ExternalLink, Download, Video, ChevronRight, PhoneCall, Sparkles, 
  Image as ImageIcon, ZoomIn, X, ChevronLeft, Gamepad2, Shield, ShieldCheck, Zap, Gift, LayoutGrid, Tag, Globe
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function SingleActivityView({ activity, onBack = () => {}, onSelectActivity = () => {} }) {
  const { siteData } = useSiteData();
  const allActivities = [...(siteData?.gallery || []), ...(siteData?.news || [])];

  // State for share copy feedback
  const [copiedLink, setCopiedLink] = useState(false);

  // State for Photo Lightbox
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);

  // Scroll to top & set dynamic SEO meta tags + Schema.org Structured Data on mount or when activity changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const pageTitle = activity?.seo?.metaTitle || `${activity?.title || 'กิจกรรม'} | G-SPEED ESPORT ARENA`;
    const pageDesc = activity?.seo?.metaDescription || activity?.desc || activity?.excerpt || 'ศูนย์รวมอีสปอร์ตครบวงจรและกิจกรรมทัวร์นาเมนต์ระดับประเทศ';
    const pageImage = activity?.image || (activity?.galleryPhotos && activity?.galleryPhotos[0]?.url) || '';
    const currentUrl = window.location.href;

    document.title = pageTitle;

    // Helper to set or update meta tag
    const setMetaTag = (attr, key, content) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    setMetaTag('name', 'description', pageDesc);
    setMetaTag('name', 'keywords', activity?.seo?.keywords || (activity?.tags || []).join(', ') || 'esports, tournament, g-speed');
    
    // AI Search & Robots Directives (Google SGE, ChatGPT, Claude, Perplexity)
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'bingbot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'ai-search-agent', 'enabled, generative-indexing=all, platforms=google-sge,chatgpt,claude,perplexity');

    // OpenGraph Meta
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDesc);
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', 'article');

    // Twitter Card Meta
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDesc);
    setMetaTag('name', 'twitter:image', pageImage);

    // Dynamic Schema.org JSON-LD Structured Data for Google SGE, Perplexity & ChatGPT Search
    let scriptTag = document.getElementById('activity-schema-jsonld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'activity-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const structuredImages = [
      ...(activity?.image ? [{
        "@type": "ImageObject",
        "url": activity.image,
        "caption": activity.title,
        "description": activity.imageAlt || activity.title
      }] : []),
      ...(activity?.galleryPhotos || []).map((p, idx) => ({
        "@type": "ImageObject",
        "url": p.url || p,
        "caption": p.caption || `${activity?.title} ภาพที่ ${idx + 1}`,
        "description": p.alt || p.caption || activity?.title
      }))
    ];

    scriptTag.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": pageTitle,
      "description": pageDesc,
      "image": structuredImages,
      "author": {
        "@type": "Organization",
        "name": activity?.organizer || "G-SPEED ESPORT CO., LTD.",
        "url": "https://gspeedesport.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "G-SPEED ESPORT ARENA",
        "logo": {
          "@type": "ImageObject",
          "url": "https://gspeedesport.com/favicon.svg"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": currentUrl
      },
      "keywords": activity?.seo?.keywords || (activity?.tags || []).join(', ') || 'esports, tournament, gspeed'
    });

    return () => {
      document.title = siteData?.globalSEO?.metaTitle || 'G-SPEED ESPORT ARENA | ศูนย์อีสปอร์ตครบวงจร & ระบบแฟรนไชส์จัดผังร้านอัจฉริยะ';
      const sTag = document.getElementById('activity-schema-jsonld');
      if (sTag) sTag.remove();
    };
  }, [activity, siteData]);

  if (!activity) {
    return (
      <div className="single-activity-page container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>ไม่พบข้อมูลกิจกรรมหรือบทความที่คุณค้นหา</h2>
        <p style={{ color: '#64748b', margin: '14px 0 24px' }}>บทความนี้อาจถูกย้าย หรือลิงก์ไม่ถูกต้อง</p>
        <button onClick={() => onBack('activities')} className="btn-primary">
          <ArrowLeft size={16} /> กลับสู่หน้ารวมกิจกรรม & บทความ
        </button>
      </div>
    );
  }

  // Handle Share / Copy Link
  const handleCopyLink = () => {
    const fullUrl = window.location.href;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const handleShareLine = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(activity.title);
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${activity.title} | G-Speed Esport Arena`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
  };

  // Gallery Photos Fallback
  const galleryPhotos = activity.galleryPhotos && activity.galleryPhotos.length > 0 
    ? activity.galleryPhotos 
    : [
        { url: activity.image, caption: 'บรรยากาศผู้ร่วมงานและนักกีฬาอีสปอร์ตบนเวทีหลัก' },
        { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', caption: 'การประลองฝีมือสุดเดือดในโซน Battleground' },
        { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', caption: 'จอแสดงผลถ่ายทอดสด 4K LED Wall ขนาดยักษ์' },
        { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', caption: 'อุปกรณ์เกมมิ่งเกียร์และสเปกคอมพิวเตอร์ระดับทัวร์นาเมนต์' }
      ];

  // Content Paragraphs Fallback
  const contentParagraphs = activity.contentParagraphs && activity.contentParagraphs.length > 0
    ? activity.contentParagraphs
    : [
        activity.desc || 'G-Speed Esport Arena ร่วมมือกับพันธมิตรชั้นนำจัดกิจกรรมการแข่งขันระดับประเทศ สร้างความคึกคักและมอบประสบการณ์เกมมิ่งที่ยอดเยี่ยมให้แก่ผู้เล่นทุกคน',
        'ภายในงานเต็มไปด้วยความมันส์และการขับเคี่ยวของเหล่าผู้เล่นแถวหน้าของประเทศไทย โดยใช้เครื่องคอมพิวเตอร์สเปกไฮเอนด์การ์ดจอ GeForce RTX 40 Series และหน้าจอรีเฟรชเรต 360Hz Fast-IPS ตอบสนอง 0.5ms พร้อมระบบเน็ตเวิร์กแลนแบบ Dual 10Gbps ช่วยให้การแข่งขันลื่นไหลไร้สะดุด',
        'นอกจากทัวร์นาเมนต์สุดเร้าใจแล้ว ผู้เข้าร่วมงานยังได้ร่วมสนุกกับกิจกรรมมินิเกม ลุ้นรับของรางวัลและเกมมิ่งเกียร์ลิขสิทธิ์แท้จากผู้สนับสนุน พร้อมอิ่มอร่อยกับเมนูอาหารและเครื่องดื่มที่รังสรรค์ขึ้นเพื่องานนี้โดยเฉพาะ',
        'ทางทีมงาน G-Speed Esport Arena ขอขอบคุณค่ายเกม พันธมิตร และแฟนคลับทุกคนที่มาร่วมสร้างความทรงจำอันยอดเยี่ยมนี้ แล้วพบกันใหม่ในกิจกรรมและการแข่งขันรอบถัดไป!'
      ];

  // Related Activities (excluding current)
  const relatedActivities = allActivities
    .filter(a => a.id !== activity.id)
    .slice(0, 3);

  // Category Icon helper
  const renderCategoryIcon = (cat) => {
    switch (cat) {
      case 'tournament': return <Trophy size={14} />;
      case 'publisher': return <Gamepad2 size={14} />;
      case 'community': return <Gift size={14} />;
      case 'venue': return <Zap size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  return (
    <div className="single-activity-page">
      {/* Top Breadcrumb & Action Bar */}
      <div className="activity-nav-bar">
        <div className="container nav-bar-inner">
          <button onClick={() => onBack('activities')} className="btn-back-link">
            <ArrowLeft size={16} />
            <span>กลับสู่หน้ารวมกิจกรรม</span>
          </button>

          <div className="breadcrumbs-trail">
            <a href="#/" onClick={(e) => { e.preventDefault(); onBack('home'); }}>หน้าแรก</a>
            <ChevronRight size={13} className="bread-divider" />
            <a href="#activities" onClick={(e) => { e.preventDefault(); onBack('activities'); }}>กิจกรรม & บทความ</a>
            <ChevronRight size={13} className="bread-divider" />
            <span className="current-crumb">{activity.title}</span>
          </div>

          <div className="share-actions-group">
            <button 
              className={`btn-share-icon ${copiedLink ? 'copied' : ''}`} 
              onClick={handleCopyLink}
              title="คัดลอกลิงก์บทความนี้"
            >
              {copiedLink ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
              <span>{copiedLink ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}</span>
            </button>

            <button className="btn-share-icon fb" onClick={handleShareFacebook} title="แชร์ลง Facebook">
              <Share2 size={14} />
              <span>Facebook</span>
            </button>

            <button className="btn-share-icon line" onClick={handleShareLine} title="แชร์ไปยัง LINE">
              <Share2 size={14} />
              <span>LINE</span>
            </button>

            <button className="btn-share-icon twitter" onClick={handleShareTwitter} title="แชร์ลง X / Twitter">
              <Share2 size={14} />
              <span>X / Twitter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Header Hero */}
      <header className="activity-article-header">
        <div className="container header-container">
          <div className="article-meta-top">
            <span className="badge-pill badge-blue">
              {renderCategoryIcon(activity.category)}
              <span>{activity.tag || 'GLP OFFICIAL EVENT'}</span>
            </span>

            <span className="article-date-badge">
              <Calendar size={14} />
              <span>{activity.date}</span>
            </span>

            <span className="article-read-badge">
              <Clock size={14} />
              <span>{activity.readTime || '3 นาทีในการอ่าน'}</span>
            </span>

            {activity.partner && (
              <span className="article-partner-badge">
                <ShieldCheck size={14} className="text-blue" />
                <span>พาร์ตเนอร์: <strong>{activity.partner}</strong></span>
              </span>
            )}
          </div>

          <h1 className="article-title">{activity.title}</h1>

          {activity.desc && (
            <div className="article-lead-card glass-panel">
              <p className="lead-text">{activity.desc}</p>
            </div>
          )}
        </div>
      </header>

      {/* Article Body Content & Sticky Sidebar Grid */}
      <section className="activity-body-section container">
        <div className="activity-layout-grid">
          {/* Left: Main Content & Multi-photo Gallery */}
          <article className="activity-main-article">
            {/* Feature Cover Image Banner */}
            <div className="article-cover-frame">
              <img src={activity.image} alt={activity.imageAlt || activity.title} className="cover-img" />
              <div className="cover-caption-tag">
                <ImageIcon size={14} />
                <span>ภาพบรรยากาศสดจาก G-Speed Esport Arena • ผู้สนับสนุน: {activity.partner}</span>
              </div>
            </div>

            {/* Article Paragraphs & Highlight Quote */}
            <div className="article-story-content">
              <p className="story-p lead-p">{contentParagraphs[0]}</p>

              {/* Highlight Quote Box */}
              <blockquote className="article-highlight-quote">
                <div className="quote-mark">“</div>
                <p className="quote-body">
                  {activity.quote || 'งานนี้ถือเป็นอีกหนึ่งก้าวสำคัญในการขับเคลื่อนวงการอีสปอร์ตไทยสู่มาตรฐานสากล ทั้งฮาร์ดแวร์ บรรยากาศ และพลังของคอมมูนิตี้'}
                </p>
                <cite className="quote-author">
                  — {activity.author || 'ฝ่ายกิจกรรมและพัฒนาการแข่งขัน G-SPEED ESPORT CO., LTD.'}
                </cite>
              </blockquote>

              {contentParagraphs.slice(1).map((para, idx) => (
                <p key={idx} className="story-p">{para}</p>
              ))}

              {/* Related Tags Cluster */}
              <div className="article-tags-cluster">
                <div className="tags-label-row">
                  <Tag size={15} className="text-blue" />
                  <span>แท็กหัวข้อที่เกี่ยวข้อง (Article Tags):</span>
                </div>
                <div className="tags-pill-list">
                  {(activity.tags || ['#EsportsThailand', '#GLP2026', '#Tournament', '#GamingArena']).map((tag, tIdx) => (
                    <span key={tIdx} className="article-tag-chip">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* High-Resolution Multi-Photo Gallery Showcase */}
            <div className="article-gallery-section">
              <div className="gallery-section-header">
                <div className="gallery-title-group">
                  <div className="badge-pill badge-cyan">
                    <ImageIcon size={14} />
                    <span>PHOTO HIGHLIGHTS ({galleryPhotos.length} ภาพ)</span>
                  </div>
                  <h3>แกลเลอรีภาพบรรยากาศความละเอียดสูง</h3>
                  <p>คลิกที่รูปภาพเพื่อเปิดดูขนาดใหญ่แบบ Full-Screen HD</p>
                </div>
              </div>

              <div className="photo-highlights-grid">
                {galleryPhotos.map((photo, pIdx) => (
                  <div 
                    key={pIdx} 
                    className="photo-card-item"
                    onClick={() => setActivePhotoIdx(pIdx)}
                  >
                    <img 
                      src={photo.url || photo} 
                      alt={photo.alt || photo.caption || `${activity.title} - ภาพแกลเลอรีที่ ${pIdx + 1}`} 
                      loading="lazy"
                    />
                    <div className="photo-overlay">
                      <ZoomIn size={24} className="zoom-icon" />
                      <span className="photo-cap-text">{photo.caption || photo.alt || 'คลิกเพื่อดูภาพขยาย'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Share & Copy Link Panel (Replaces old download/video buttons) */}
            <div className="article-actions-panel glass-panel social-share-panel">
              <div className="actions-header">
                <div className="actions-icon-wrap">
                  <Share2 size={22} className="text-blue" />
                </div>
                <div>
                  <h4 className="actions-card-title">แชร์กิจกรรม & บทความนี้ หรือคัดลอกลิงก์</h4>
                  <p className="actions-card-desc">
                    ร่วมส่งต่อความมันส์และไฮไลต์กิจกรรม ให้เพื่อนๆ ในทีมและคอมมูนิตี้เกมเมอร์ได้ร่วมรับชม
                  </p>
                </div>
              </div>

              {/* Grid of Main Social Share Buttons */}
              <div className="social-share-buttons-grid">
                {/* Facebook Share */}
                <button 
                  onClick={handleShareFacebook}
                  className="social-share-card-btn btn-share-facebook"
                  title="แชร์ลง Facebook"
                >
                  <svg className="social-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <div className="share-btn-text">
                    <span className="share-btn-name">Facebook</span>
                    <span className="share-btn-action">แชร์ลงหน้าฟีดหรือกลุ่ม</span>
                  </div>
                </button>

                {/* LINE Share */}
                <button 
                  onClick={handleShareLine}
                  className="social-share-card-btn btn-share-line"
                  title="แชร์ไปยัง LINE"
                >
                  <svg className="social-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.019 9.607.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.646 1.281-.54 6.915-4.072 9.434-6.973 1.796-1.999 2.583-4.024 2.583-5.382z"/>
                  </svg>
                  <div className="share-btn-text">
                    <span className="share-btn-name">LINE</span>
                    <span className="share-btn-action">ส่งให้เพื่อนหรือกลุ่มแชต</span>
                  </div>
                </button>

                {/* X (Twitter) Share */}
                <button 
                  onClick={handleShareTwitter}
                  className="social-share-card-btn btn-share-x"
                  title="แชร์ลง X (Twitter)"
                >
                  <svg className="social-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <div className="share-btn-text">
                    <span className="share-btn-name">X (Twitter)</span>
                    <span className="share-btn-action">โพสต์สู่ไทม์ไลน์</span>
                  </div>
                </button>

                {/* Copy Link Main Button */}
                <button 
                  onClick={handleCopyLink}
                  className={`social-share-card-btn btn-share-copy ${copiedLink ? 'copied' : ''}`}
                  title="คัดลอกลิงก์บทความนี้"
                >
                  {copiedLink ? <Check size={20} className="text-emerald" /> : <Copy size={20} />}
                  <div className="share-btn-text">
                    <span className="share-btn-name">{copiedLink ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}</span>
                    <span className="share-btn-action">{copiedLink ? 'พร้อมส่งต่อได้ทันที' : 'คัดลอก URL สู่คลิปบอร์ด'}</span>
                  </div>
                </button>
              </div>

              {/* Direct URL Box for convenient 1-click select & copy */}
              <div className="share-url-inline-box">
                <div className="url-field-wrap">
                  <Globe size={16} className="text-muted" />
                  <input 
                    type="text" 
                    readOnly 
                    value={typeof window !== 'undefined' ? window.location.href : ''} 
                    onClick={(e) => e.target.select()}
                    className="share-url-input"
                    title="คลิกเพื่อเลือก URL ทั้งหมด"
                  />
                </div>
                <button 
                  onClick={handleCopyLink} 
                  className={`btn-url-copy-trigger ${copiedLink ? 'copied' : ''}`}
                >
                  {copiedLink ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copiedLink ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>
              </div>
            </div>
          </article>

          {/* Right: Sticky Event Facts & Contact Sidebar */}
          <aside className="activity-sidebar">
            {/* Event Quick Facts Card */}
            <div className="event-facts-card glass-panel">
              <div className="card-top-header">
                <Trophy size={18} className="text-blue" />
                <h4>ข้อมูลสรุปกิจกรรม (Quick Facts)</h4>
              </div>

              <ul className="facts-list">
                <li className="fact-item">
                  <div className="fact-icon-box"><Calendar size={16} /></div>
                  <div className="fact-content">
                    <span className="fact-lbl">ช่วงเวลาจัดกิจกรรม</span>
                    <strong className="fact-val">{activity.date}</strong>
                  </div>
                </li>

                <li className="fact-item">
                  <div className="fact-icon-box"><MapPin size={16} /></div>
                  <div className="fact-content">
                    <span className="fact-lbl">สถานที่จัดงาน</span>
                    <strong className="fact-val">{activity.location || 'G-Speed Esport Arena (Main Stage Zone)'}</strong>
                  </div>
                </li>

                <li className="fact-item">
                  <div className="fact-icon-box"><Trophy size={16} /></div>
                  <div className="fact-content">
                    <span className="fact-lbl">รางวัลรวม</span>
                    <strong className="fact-val text-blue">{activity.prizePool || '฿50,000 พร้อมถ้วยเกียรติยศ'}</strong>
                  </div>
                </li>

                <li className="fact-item">
                  <div className="fact-icon-box"><Users size={16} /></div>
                  <div className="fact-content">
                    <span className="fact-lbl">ผู้เข้าร่วมงาน</span>
                    <strong className="fact-val">{activity.attendees || '350+ คน (32 ทีม)'}</strong>
                  </div>
                </li>

                <li className="fact-item">
                  <div className="fact-icon-box"><ShieldCheck size={16} /></div>
                  <div className="fact-content">
                    <span className="fact-lbl">ผู้สนับสนุนหลัก</span>
                    <strong className="fact-val">{activity.partner || 'ASUS ROG & NVIDIA'}</strong>
                  </div>
                </li>

                <li className="fact-item">
                  <div className="fact-icon-box"><Gamepad2 size={16} /></div>
                  <div className="fact-content">
                    <span className="fact-lbl">หมวดหมู่</span>
                    <strong className="fact-val">{activity.tag || 'ESPORTS EVENT'}</strong>
                  </div>
                </li>
              </ul>
            </div>

            {/* Venue Booking & Inquiry Card */}
            <div className="event-inquiry-card glass-panel">
              <div className="inquiry-header">
                <PhoneCall size={20} className="text-blue" />
                <div>
                  <h4>สนใจจัดงานหรือเช่าเวทีแข่ง?</h4>
                  <p>ติดต่อทีมงานอีเวนต์เพื่อขอใบเสนอราคาและจองสถานที่</p>
                </div>
              </div>

              <div className="inquiry-contacts">
                <a href="tel:0637937704" className="inquiry-contact-btn">
                  <PhoneCall size={16} />
                  <span>สายด่วน: 063-793-7704</span>
                </a>
                <a href="mailto:partner@gspeedarena.com" className="inquiry-contact-btn secondary">
                  <span>อีเมล: partner@gspeedarena.com</span>
                </a>
              </div>
            </div>

            {/* Social Share / SEO Live Preview Card */}
            <div className="social-og-preview-card glass-panel">
              <div className="og-preview-header">
                <Globe size={16} className="text-blue" />
                <h5>ตัวอย่างการแสดงผลบนโซเชียล (Social Card)</h5>
              </div>
              <div className="og-card-frame">
                <div className="og-card-image-wrap">
                  <img src={activity.image} alt={activity.imageAlt || activity.title} />
                  <span className="og-domain-badge">gspeedarena.com</span>
                </div>
                <div className="og-card-meta">
                  <h6>{activity.title}</h6>
                  <p>{activity.desc || activity.excerpt}</p>
                </div>
              </div>
            </div>

            {/* URL Slug Info Badge */}
            <div className="slug-info-box">
              <span className="slug-lbl">Permanent Article URL:</span>
              <code>#/activity/{activity.slug || activity.id}</code>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Activities Section */}
      <section className="related-activities-section">
        <div className="container">
          <div className="section-header">
            <div className="badge-pill badge-blue">
              <LayoutGrid size={14} />
              <span>EXPLORE MORE EVENTS</span>
            </div>
            <h2 className="section-title">กิจกรรมและบทความอื่นๆ ที่น่าสนใจ</h2>
            <p className="section-subtitle">ย้อนชมความสนุกและข่าวสารความเคลื่อนไหวล่าสุดจาก G-Speed Esport Arena</p>
          </div>

          <div className="related-grid">
            {relatedActivities.map((item) => (
              <div 
                key={item.id} 
                className="related-card glass-panel"
                onClick={() => {
                  onSelectActivity(item);
                  window.location.hash = `#/activity/${item.slug || item.id}`;
                }}
              >
                <div className="related-thumb">
                  <img src={item.image} alt={item.imageAlt || item.title} />
                  <span className="related-tag">{item.tag}</span>
                </div>
                <div className="related-info">
                  <div className="related-meta">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.partner}</span>
                  </div>
                  <h4 className="related-title">{item.title}</h4>
                  <p className="related-desc">{item.desc}</p>
                  <div className="related-read-more text-blue">
                    <span>อ่านบทความเต็ม</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-Screen Photo Lightbox Modal */}
      {activePhotoIdx !== null && (
        <div className="photo-lightbox-backdrop" onClick={() => setActivePhotoIdx(null)}>
          <div className="lightbox-container" onClick={e => e.stopPropagation()}>
            <button 
              className="btn-lightbox-close" 
              onClick={() => setActivePhotoIdx(null)}
              title="ปิดหน้าต่างภาพ"
            >
              <X size={24} />
            </button>

            <button 
              className="btn-lightbox-arrow prev"
              onClick={() => setActivePhotoIdx((activePhotoIdx - 1 + galleryPhotos.length) % galleryPhotos.length)}
              title="ภาพก่อนหน้า"
            >
              <ChevronLeft size={28} />
            </button>

            <div className="lightbox-img-wrapper">
              <img 
                src={galleryPhotos[activePhotoIdx]?.url || galleryPhotos[activePhotoIdx]} 
                alt={galleryPhotos[activePhotoIdx]?.alt || galleryPhotos[activePhotoIdx]?.caption || activity.title} 
              />
              <div className="lightbox-caption">
                <span>{galleryPhotos[activePhotoIdx]?.caption || activity.title}</span>
                <span className="counter-tag">{activePhotoIdx + 1} / {galleryPhotos.length}</span>
              </div>
            </div>

            <button 
              className="btn-lightbox-arrow next"
              onClick={() => setActivePhotoIdx((activePhotoIdx + 1) % galleryPhotos.length)}
              title="ภาพถัดไป"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
