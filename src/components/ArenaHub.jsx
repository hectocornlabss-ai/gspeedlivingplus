import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { 
  Trophy, Shield, Monitor, Coffee, Zap, Calendar, Users, 
  ArrowRight, Compass, Layers, Calculator, CheckCircle2, ChevronRight, Play, Check, Flame, X, Send,
  Search, PhoneCall, Image as ImageIcon, Newspaper, ExternalLink, Filter,
  Gamepad2, Gift, LayoutGrid, Award, Camera, Sparkles, Target, ChevronLeft, Maximize2, Crown, MapPin, Eye, Clock, Globe, Plus,
  Share2, Copy, Link as LinkIcon, ShoppingBag, Star, ShoppingCart
} from 'lucide-react';
import { 
  VENUE_ZONES, TOURNAMENTS, GALLERY_ACTIVITIES, 
  EVENT_CATEGORIES, GAME_NEWS 
} from '../data/mockData';
import { EQUIPMENT_PRODUCTS } from '../data/equipmentProducts';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import EsportOrganizerModal from './EsportOrganizerModal';
import ArenaSeatBookingModal from './ArenaSeatBookingModal';
import { compareTournaments, isTournamentRegistrationOpen } from '../utils/tournamentUtils';

// Helper functions for dynamic theme contrast & color overlays
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

function hexToRgba(hex, alpha = 1) {
  if (!hex || typeof hex !== 'string') return `rgba(15, 23, 42, ${alpha})`;
  let c = hex.trim().replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length !== 6) return `rgba(15, 23, 42, ${alpha})`;
  const r = parseInt(c.substr(0, 2), 16) || 0;
  const g = parseInt(c.substr(2, 2), 16) || 0;
  const b = parseInt(c.substr(4, 2), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ArenaHub({ 
  onNavigateFranchise, 
  initialTournamentSlug, 
  onSelectTournamentSlug, 
  onSelectActivitySlug,
  onNavigateTournaments,
  onNavigateActivities,
  initialCategory = 'all',
  initialTag = 'all'
}) {
  const { siteData, updateTournament } = useSiteData();
  const { t, language, translateDynamic } = useTranslation();
  const { addToCart, setIsCartOpen } = useCart();
  const isThai = language === 'th';

  const handleViewProduct = (productId) => {
    window.history.pushState(null, '', `/products/${productId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rawHeroData = siteData?.hero || {};
  const heroData = {
    ...rawHeroData,
    badge: isThai ? (rawHeroData.badge || 'GLP ESPORTS • ความสนุกสุดมันส์ ตลอด 24 ชม.') : t('hero.tag'),
    title: isThai ? (rawHeroData.title || 'GLP ESPORT STADIUM MEETING\nศูนย์รวมกิจกรรม & ทัวร์นาเมนต์ระดับประเทศ') : t('hero.title'),
    subtitle: isThai ? (rawHeroData.subtitle || 'สมรภูมิประลองเกมอันดับ 1 ของเกมเมอร์ชาวไทย เวทีแข่งขันมาตรฐานสากล รองรับทัวร์นาเมนต์ LAN ทุกเกม พร้อมโซนซ้อมสตรีมเมอร์ และบริการจัดกิจกรรมสำหรับค่ายเกมชั้นนำ') : t('hero.subtitle'),
    btn1Text: isThai ? (rawHeroData.btn1Text || 'สนใจจัดงาน') : t('hero.btn1'),
    btn2Text: isThai ? (rawHeroData.btn2Text || 'ดูกิจกรรม') : t('hero.btn2'),
    btn3Text: isThai ? (rawHeroData.btn3Text || 'ทัวร์นาเมนต์') : t('hero.btn3'),
    btn4Text: isThai 
      ? ((rawHeroData.btn4Text && !rawHeroData.btn4Text.includes('เปิดร้าน') && !rawHeroData.btn4Text.includes('ติดต่อ')) ? rawHeroData.btn4Text : 'ร้านค้า') 
      : (t('hero.btn4') && !t('hero.btn4').includes('เปิดร้าน') ? t('hero.btn4') : 'ร้านค้า'),
    metrics: !isThai
      ? (language === 'zh'
          ? [
              { number: '750+', label: '全国电竞对战席位' },
              { number: '360Hz', label: 'Fast-IPS & OLED 电竞屏' },
              { number: '10Gbps', label: '专用多线光纤 延迟 < 3ms' },
              { number: '24/7', label: '24小时全年无休' }
            ]
          : [
              { number: '750+', label: 'Battle Stations Nationwide' },
              { number: '360Hz', label: 'Fast-IPS & OLED Displays' },
              { number: '10Gbps', label: 'Dedicated Multi-WAN Ping < 3ms' },
              { number: '24/7', label: 'Open 24 Hours / 7 Days' }
            ])
      : (rawHeroData.metrics && rawHeroData.metrics.length > 0
          ? rawHeroData.metrics
          : [
              { number: '750+', label: 'Battle Stations ทั่วประเทศ' },
              { number: '360Hz', label: 'Fast-IPS & OLED Displays' },
              { number: '10Gbps', label: 'Dedicated Multi-WAN Ping < 3ms' },
              { number: '24/7', label: 'เปิดบริการตลอด 24 ชั่วโมง' }
            ])
  };

  const rawTournamentsList = siteData?.tournaments || TOURNAMENTS;
  const tournamentsList = useMemo(() => {
    return [...rawTournamentsList].sort(compareTournaments);
  }, [rawTournamentsList]);
  const galleryList = siteData?.gallery || GALLERY_ACTIVITIES;
  const newsList = siteData?.news || GAME_NEWS;
  const categories = siteData?.activityCategories || EVENT_CATEGORIES;

  // State for zone showcase & 3-image slider with multi-language support
  const rawVenueZones = siteData?.venueZones || VENUE_ZONES;
  const allZones = useMemo(() => {
    if (isThai) return rawVenueZones;
    return rawVenueZones.map(z => {
      let title = z.title;
      let subtitle = z.subtitle;
      let badge = z.badge;
      let specs = z.specs;
      let desc = z.description;
      if (language === 'en') {
        if (z.id === 'stage') {
          title = '5v5 Tournament Main Stage';
          subtitle = 'Championship 5v5 Stage with 4K LED Screen';
          badge = 'PROFESSIONAL 5v5 STAGE';
          specs = ['5v5 Tournament PCs (RTX 4080)', '360Hz Fast-IPS Gaming Monitors', 'Pro Audio & Live Stream Broadcaster', '4K Giant LED Wall Display'];
          desc = 'Championship-grade stage built to international esports tournament standards, featuring acoustic treatment and broadcast-ready production facilities.';
        } else if (z.id === 'vip') {
          title = 'VIP & Streamer Pods';
          subtitle = 'Private VIP Suites & Streaming Rooms';
          badge = 'PRIVATE VIP SUITES';
          specs = ['Dual-PC Streaming Setup (RTX 4090)', 'Ergonomic Premium Gaming Chairs', 'Soundproof Acoustic Studio Walls', 'Dedicated 10Gbps Multi-WAN Fiber'];
          desc = 'Private, noise-isolated suites engineered for pro team bootcamps, content creators, and private gaming sessions with zero distractions.';
        } else if (z.id === 'standard') {
          title = 'Esports Battleground Zone';
          subtitle = 'High-Performance Gaming Stations';
          badge = 'ESPORTS BATTLEGROUND';
          specs = ['RTX 4070 Ti Super Graphics', '240Hz High Refresh Displays', 'Mechanical Keyboards & Pro Mice', 'Diskless 10Gbps Instant Loading'];
          desc = 'Open arena stations equipped with high-refresh rate displays and competitive peripherals for intense gaming sessions with friends.';
        } else if (z.id === 'cafe') {
          title = 'Cyber Cafe & Snack Lounge';
          subtitle = 'Fresh Cafe, Snacks & Chilled Drinks';
          badge = 'CAFE & CHILL LOUNGE';
          specs = ['Artisan Fresh Coffee & Drinks', 'Hot Meal Sets & Quick Snacks', 'Relaxed Cozy Dining Area', 'High-Speed Free Wi-Fi 6'];
          desc = 'A modern cafe and chill lounge offering freshly brewed coffee, hot meals, and refreshments to keep you recharged 24/7.';
        }
      } else if (language === 'zh') {
        if (z.id === 'stage') {
          title = '5v5 专业电竞主舞台';
          subtitle = '国际级5v5竞技舞台与4K巨幕LED屏';
          badge = '国际专业5v5主舞台';
          specs = ['5v5 对战主机 (RTX 4080)', '360Hz Fast-IPS 电竞级显示器', '专业现场转播与音频控制台', '4K 高清巨幕LED背景大屏'];
          desc = '依照国际电竞赛事标准精心打造的专业主舞台，配备声学降噪系统与4K超清直转播设施。';
        } else if (z.id === 'vip') {
          title = 'VIP战队训练与主播独立包厢';
          subtitle = '独立私密训练营与高清直播室';
          badge = '私密VIP战队训练包厢';
          specs = ['双电脑直播推流工作站 (RTX 4090)', '人体工学专业电竞椅', '专业声学隔音舱墙体', '独立独享 10Gbps 专线网络'];
          desc = '专为职业战队集训营、知名游戏主播打造的私密隔音空间，零外界干扰，尽情专注对局。';
        } else if (z.id === 'standard') {
          title = '高阶竞技对战专区';
          subtitle = '高端专业配置电竞对战席';
          badge = '高阶竞技对战大厅';
          specs = ['RTX 4070 Ti Super 独立显卡', '240Hz 高刷新率电竞屏幕', '职业级机械键盘与轻量化鼠标', '10Gbps 极速无盘秒开系统'];
          desc = '开放式竞技对战大厅，全席位配备超高刷电竞屏与职业外设，随时与好友开黑畅玩。';
        } else if (z.id === 'cafe') {
          title = '电竞咖啡与休闲轻食吧';
          subtitle = '现磨手作咖啡与美味轻食能量补给';
          badge = '休闲轻食与能量补给吧';
          specs = ['现磨手作咖啡与特调饮品', '热腾腾快餐简餐与能量点心', '宽敞舒适的用餐休息区', '全场覆盖高速 Wi-Fi 6'];
          desc = '现代时尚的电竞咖啡休闲吧，供应现磨咖啡、营养套餐和冰镇冷饮，全天候24小时为选手补充充沛能量。';
        }
      }
      return {
        ...z,
        title,
        subtitle: subtitle || z.subtitle,
        badge: badge || z.badge,
        specs: specs || z.specs,
        description: desc || z.description
      };
    });
  }, [rawVenueZones, isThai, language]);
  const [activeZone, setActiveZone] = useState(allZones[0]?.id || 'stage');
  const [zoneSlideIndex, setZoneSlideIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  const thumbnailsRef = useRef(null);

  const handleSelectZone = (zoneId) => {
    setActiveZone(zoneId);
    setZoneSlideIndex(0);
  };

  const handleHeroAction = (customLink, customTarget, defaultAction) => {
    const rawLink = (customLink || '').trim();
    if (!rawLink) {
      if (typeof defaultAction === 'function') defaultAction();
      return;
    }

    const isExternal = /^https?:\/\//i.test(rawLink) || /^\/\//.test(rawLink) || /^(www\.|line\.me|facebook\.com|fb\.com|instagram\.com|tiktok\.com|youtube\.com)/i.test(rawLink);
    const link = (/^(www\.|line\.me|facebook\.com|fb\.com|instagram\.com|tiktok\.com|youtube\.com)/i.test(rawLink))
      ? `https://${rawLink}`
      : rawLink;

    if (customTarget === '_blank') {
      window.open(link, '_blank', 'noopener,noreferrer');
      return;
    }

    // target is _self
    if (isExternal) {
      window.location.href = link;
    } else if (link.startsWith('#')) {
      if (link === '#organizer-modal' || link === '#esport-modal') {
        setSelectedOrganizerZone('Main Stage & Battleground Zone');
        setIsOrganizerModalOpen(true);
      } else {
        const targetEl = document.querySelector(link);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = link;
        }
      }
    } else {
      // Internal semantic route e.g. /activities, /tournaments, /franchise, /contact
      const cleanPath = link.startsWith('/') ? link : `/${link}`;
      window.history.pushState(null, '', cleanPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  };

  // Always ensure page starts at absolute top (0, 0) upon ArenaHub mounting
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    });
  }, []);

  const isInitialZoneMount = useRef(true);

  // Auto-scroll active thumbnail horizontally ONLY inside the strip (never touches window scroll)
  useEffect(() => {
    if (isInitialZoneMount.current) {
      isInitialZoneMount.current = false;
      return;
    }
    const container = thumbnailsRef.current;
    if (container) {
      const activeBtn = container.querySelector('.zone-thumb-btn.active');
      if (activeBtn) {
        const btnLeft = activeBtn.offsetLeft;
        const btnWidth = activeBtn.offsetWidth;
        const containerWidth = container.offsetWidth;
        container.scrollTo({
          left: btnLeft - (containerWidth / 2) + (btnWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  }, [zoneSlideIndex, activeZone]);

  // Search and Category Filter for Activities
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedTag, setSelectedTag] = useState(initialTag || 'all');

  // Sync initialCategory & initialTag props
  useEffect(() => {
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialTag && initialTag !== selectedTag) {
      setSelectedTag(initialTag);
    }
  }, [initialTag]);

  // Modals state
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);

  // Esport Organizer & Venue Rental Modal State
  const [isOrganizerModalOpen, setIsOrganizerModalOpen] = useState(false);
  const [selectedOrganizerZone, setSelectedOrganizerZone] = useState('');

  // Arena Live Seat Booking Modal State
  const [isSeatBookingOpen, setIsSeatBookingOpen] = useState(false);
  const [bookingInitialZone, setBookingInitialZone] = useState('stage');

  const handleOpenTournament = (tour) => {
    const slug = tour.slug || tour.seo?.slug || tour.id;
    if (onSelectTournamentSlug) {
      onSelectTournamentSlug(slug);
    } else {
      window.history.pushState(null, '', `/tournaments/${slug}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const currentZoneData = allZones.find(z => z.id === activeZone) || allZones[0] || VENUE_ZONES[0];
  const defaultZoneInit = VENUE_ZONES.find(z => z.id === currentZoneData.id) || VENUE_ZONES[0];

  // Robust extraction of 3 zone images with fallback to default mockData
  const currentZoneImages = useMemo(() => {
    const rawImages = Array.isArray(currentZoneData.images) && currentZoneData.images.length > 0
      ? currentZoneData.images.slice(0, 3)
      : (defaultZoneInit.images || [{ id: `${currentZoneData.id}-0`, url: currentZoneData.image || defaultZoneInit.image, caption: currentZoneData.title }]);

    return rawImages.map((imgObj, idx) => {
      const defaultSlot = defaultZoneInit?.images?.[idx] || defaultZoneInit?.images?.[0] || {};
      const urlStr = typeof imgObj === 'string' ? imgObj : (imgObj?.url || '');
      const validUrl = (urlStr && urlStr.trim() && urlStr !== '[object Object]') 
        ? urlStr 
        : (defaultSlot.url || defaultZoneInit.image || '');
      return {
        id: imgObj?.id || `${currentZoneData.id}-img-${idx}`,
        url: validUrl,
        caption: (imgObj?.caption && imgObj.caption.trim()) ? imgObj.caption : (defaultSlot.caption || currentZoneData.title)
      };
    });
  }, [currentZoneData, defaultZoneInit]);

  const totalZoneSlides = currentZoneImages.length || 1;
  const activeSlide = currentZoneImages[zoneSlideIndex % totalZoneSlides] || currentZoneImages[0] || {};

  const handleNextSlide = (e) => {
    if (e) e.stopPropagation();
    setZoneSlideIndex(prev => (prev + 1) % totalZoneSlides);
  };

  const handlePrevSlide = (e) => {
    if (e) e.stopPropagation();
    setZoneSlideIndex(prev => (prev - 1 + totalZoneSlides) % totalZoneSlides);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }
  };

  // Filtered gallery activities based on category, tag, and search
  const filteredActivities = galleryList.filter(item => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchTag = selectedTag === 'all' || (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()));
    const matchSearch = !searchQuery.trim() || 
                        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.partner && item.partner.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchCategory && matchTag && matchSearch;
  });

  return (
    <div className="arena-hub-page">
      {/* 1. TOP ACTIVITY SEARCH & HOTLINE BAR (Desktop only, hidden on mobile for clean immediate HERO display) */}
      <section className="activity-search-bar-section hide-mobile">
        <div className="container activity-search-container">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon text-blue" />
            <input 
              type="text" 
              placeholder={language === 'zh' ? '搜索赛事、活动、游戏厂商或游戏名称 (如 PUBG, Audition, Zone4)...' : language === 'en' ? 'Search activities, tournaments, game publishers or titles (e.g. PUBG, Audition, Zone4)...' : 'ค้นหากิจกรรม, ทัวร์นาเมนต์, ค่ายเกม หรือชื่อเกม (เช่น PUBG, Audition, Zone4)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="activity-search-input"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="activity-hotline-badge">
            <PhoneCall size={16} className="text-blue pulse-icon" />
            <span>{language === 'zh' ? '电竞赛事策划与承办热线:' : language === 'en' ? 'Esports Tournament Hotline:' : 'สายด่วนติดต่อขอจัดงานแข่ง Esport:'}</span>
            <a href="tel:0637937704" className="hotline-phone-link">063-793-7704</a>
          </div>
        </div>
      </section>

      {/* 2. HERO BANNER: GLP ESPORT STADIUM MEETING */}
      {(() => {
        const heroBg = heroData.backgroundImage || heroData.bgOverlayImage;
        const overlayType = heroData.overlayType || 'light';
        const isDarkHero = Boolean(heroBg) 
          ? (overlayType === 'dark') 
          : (heroData.bgColor ? (heroData.bgColor === '#0b0f19' || heroData.bgColor === '#0f172a') : false);
        const opacity = heroData.overlayOpacity ?? (overlayType === 'light' ? 0.82 : (overlayType === 'soft' ? 0.35 : 0.75));

        let overlayGradient = 'none';
        if (heroBg && overlayType !== 'none') {
          if (overlayType === 'dark') {
            overlayGradient = `linear-gradient(180deg, rgba(11, 15, 25, ${opacity}) 0%, rgba(15, 23, 42, ${Math.min(1, opacity + 0.1)}) 100%)`;
          } else if (overlayType === 'soft') {
            overlayGradient = `linear-gradient(180deg, rgba(255, 255, 255, ${opacity}) 0%, rgba(241, 245, 249, ${Math.min(1, opacity + 0.1)}) 100%)`;
          } else {
            // 'light' default: Soft clean white frosted gradient to preserve original bright white look!
            overlayGradient = `linear-gradient(180deg, rgba(255, 255, 255, ${opacity}) 0%, rgba(255, 255, 255, ${Math.max(0.45, opacity - 0.18)}) 50%, rgba(248, 250, 252, ${Math.min(1, opacity + 0.12)}) 100%)`;
          }
        }

        return (
          <section 
            className={`hero-section ${heroBg ? 'has-bg-image' : ''} ${isDarkHero ? 'hero-dark-theme' : 'hero-light-theme'}`} 
            style={{ 
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: isDarkHero ? '#0b0f19' : (heroData.bgColor || '#ffffff'),
              backgroundImage: heroBg ? `url(${heroBg})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              padding: '85px 0 65px 0',
              transition: 'all 0.3s ease'
            }}
            aria-label={heroData.imageAlt || heroData.title || 'G-Speed Esport Arena'}
          >
            {/* Dynamic Background Overlay */}
            {heroBg && overlayType !== 'none' && (
              <div 
                className="hero-background-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: overlayGradient,
                  zIndex: 1,
                  pointerEvents: 'none',
                  transition: 'background 0.3s ease'
                }}
              />
            )}

            <div className="container hero-container" style={{ position: 'relative', zIndex: 2 }}>
              <div className="hero-content">
                <div 
                  className="badge-pill badge-blue hero-tag"
                  style={isDarkHero ? {
                    background: 'rgba(37, 99, 235, 0.25)',
                    borderColor: 'rgba(96, 165, 250, 0.45)',
                    color: '#93c5fd',
                    backdropFilter: 'blur(6px)'
                  } : {
                    background: 'rgba(37, 99, 235, 0.08)',
                    borderColor: 'rgba(37, 99, 235, 0.25)',
                    color: '#1d4ed8'
                  }}
                >
                  <span className="live-dot"></span>
                  <span>{heroData.badge}</span>
                </div>

                <h1 
                  className="hero-title" 
                  style={{ 
                    whiteSpace: 'pre-line',
                    color: isDarkHero ? '#ffffff' : (heroData.titleColor && heroData.titleColor !== '#ffffff' ? heroData.titleColor : '#0f172a'),
                    textShadow: isDarkHero ? '0 3px 16px rgba(0,0,0,0.75)' : 'none',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {heroData.title}
                </h1>

                <p 
                  className="hero-description"
                  style={{
                    color: isDarkHero ? '#e2e8f0' : (heroData.subtitleColor && heroData.subtitleColor !== '#ffffff' && heroData.subtitleColor !== '#e2e8f0' ? heroData.subtitleColor : '#475569'),
                    textShadow: isDarkHero ? '0 2px 8px rgba(0,0,0,0.6)' : 'none',
                    lineHeight: 1.75
                  }}
                >
                  {heroData.subtitle}
                </p>

                <div className="hero-cta-group">
                  <button 
                    id="btn-hero-organize-esport"
                    onClick={() => {
                      handleHeroAction(
                        heroData.btn1Link,
                        heroData.btn1Target || '_self',
                        () => {
                          setSelectedOrganizerZone('Main Stage & Battleground Zone');
                          setIsOrganizerModalOpen(true);
                        }
                      );
                    }} 
                    className="btn-primary cta-btn-large"
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                      boxShadow: '0 8px 24px rgba(2, 132, 199, 0.35)'
                    }}
                  >
                    <Trophy size={18} />
                    <span>{language === 'th' ? (heroData.btn1Text || t('hero.btn1')) : t('hero.btn1')}</span>
                  </button>

                  <button 
                    id="btn-hero-activities"
                    onClick={() => {
                      handleHeroAction(
                        heroData.btn2Link !== undefined ? heroData.btn2Link : '/activities',
                        heroData.btn2Target || '_self',
                        () => {
                          if (onNavigateActivities) {
                            onNavigateActivities();
                          } else {
                            window.history.pushState(null, '', '/activities');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }
                        }
                      );
                    }} 
                    className="btn-secondary cta-btn-large"
                    style={isDarkHero ? {
                      background: 'rgba(255, 255, 255, 0.12)',
                      borderColor: 'rgba(255, 255, 255, 0.25)',
                      color: '#ffffff',
                      backdropFilter: 'blur(8px)'
                    } : {
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderColor: 'rgba(203, 213, 225, 0.9)',
                      color: '#1e293b'
                    }}
                  >
                    <Camera size={18} className="text-blue" />
                    <span>{language === 'th' ? (heroData.btn2Text || t('hero.btn2')) : t('hero.btn2')}</span>
                  </button>

                  <button 
                    id="btn-hero-tournaments"
                    onClick={() => {
                      handleHeroAction(
                        heroData.btn3Link !== undefined ? heroData.btn3Link : '/tournaments',
                        heroData.btn3Target || '_self',
                        () => {
                          if (onNavigateTournaments) {
                            onNavigateTournaments();
                          } else {
                            window.history.pushState(null, '', '/tournaments');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }
                        }
                      );
                    }} 
                    className="btn-secondary cta-btn-large"
                    style={isDarkHero ? {
                      background: 'rgba(255, 255, 255, 0.12)',
                      borderColor: 'rgba(255, 255, 255, 0.25)',
                      color: '#ffffff',
                      backdropFilter: 'blur(8px)'
                    } : {
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderColor: 'rgba(203, 213, 225, 0.9)',
                      color: '#1e293b'
                    }}
                  >
                    <Trophy size={18} className="text-amber" />
                    <span>{language === 'th' ? (heroData.btn3Text || t('hero.btn3')) : t('hero.btn3')}</span>
                  </button>

                  <button 
                    id="btn-hero-navigate-shop"
                    onClick={() => {
                      handleHeroAction(
                        heroData.btn4Link !== undefined ? heroData.btn4Link : '/shop',
                        heroData.btn4Target || '_self',
                        () => {
                          if (onNavigateFranchise) {
                            onNavigateFranchise();
                          } else {
                            window.history.pushState(null, '', '/shop');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                          }
                        }
                      );
                    }} 
                    className="btn-secondary cta-btn-large"
                    style={isDarkHero ? {
                      background: 'rgba(255, 255, 255, 0.12)',
                      borderColor: 'rgba(255, 255, 255, 0.25)',
                      color: '#ffffff',
                      backdropFilter: 'blur(8px)'
                    } : {
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderColor: 'rgba(203, 213, 225, 0.9)',
                      color: '#1e293b'
                    }}
                  >
                    <ShoppingBag size={18} className="text-blue" />
                    <span>{language === 'th' ? ((heroData.btn4Text && !heroData.btn4Text.includes('เปิดร้าน') && !heroData.btn4Text.includes('ติดต่อ')) ? heroData.btn4Text : 'ร้านค้า') : (t('hero.btn4') || 'ร้านค้า')}</span>
                  </button>
                </div>

                {/* Quick Metrics Bar: 4 columns on desktop / 2 columns on mobile */}
                <div 
                  className="hero-metrics-grid"
                  style={isDarkHero ? {
                    background: 'rgba(15, 23, 42, 0.78)',
                    borderColor: 'rgba(255, 255, 255, 0.16)',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(16px)'
                  } : {
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderColor: 'rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  {(heroData.metrics || [
                    { number: '750+', label: 'Battle Stations ทั่วประเทศ' },
                    { number: '360Hz', label: 'Fast-IPS & OLED Displays' },
                    { number: '10Gbps', label: 'Dedicated Multi-WAN Ping < 3ms' },
                    { number: '24/7', label: 'เปิดบริการตลอด 24 ชั่วโมง' }
                  ]).map((m, mIdx) => (
                    <div 
                      key={mIdx} 
                      className="metric-box"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none'
                      }}
                    >
                      <div className="metric-number" style={{ color: isDarkHero ? '#38bdf8' : '#1d4ed8' }}>{m.number}</div>
                      <div className="metric-label" style={{ color: isDarkHero ? '#cbd5e1' : '#64748b' }}>{translateDynamic(m.label, language)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 3. DUAL FEATURE HIGHLIGHT CARDS (OUR EVENTS vs TOURNAMENTS) */}
      <section className="dual-feature-section">
        <div className="container">
          <div className="dual-cards-grid">
            {/* Left Card: OUR EVENTS -> Goes to Dedicated Activities */}
            <div 
              onClick={() => {
                if (onNavigateActivities) onNavigateActivities();
                else {
                  window.history.pushState(null, '', '/activities');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }} 
              className="feature-banner-card events-banner glass-panel"
              style={{ 
                cursor: 'pointer',
                background: siteData?.featureBanners?.bannerLeft?.image
                  ? `linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.88) 100%), url(${siteData.featureBanners.bannerLeft.image}) center/cover no-repeat`
                  : (siteData?.featureBanners?.bannerLeft?.bgGradient || 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)')
              }}
            >
              <div className="banner-content">
                <span className="badge-pill badge-blue">{isThai ? (siteData?.featureBanners?.bannerLeft?.badge || 'GLP OUR EVENTS') : t('home.featureEvents.badge')}</span>
                <h3 className="banner-title" style={{ color: '#ffffff' }}>
                  {isThai ? (siteData?.featureBanners?.bannerLeft?.title || 'รวมภาพกิจกรรม') : t('home.featureEvents.title')}
                </h3>
                <p className="banner-desc" style={{ color: '#cbd5e1' }}>
                  {isThai ? (siteData?.featureBanners?.bannerLeft?.desc || 'ภาพงานแข่ง LAN, งานเปิดตัวเกม, มีตติ้ง และพิธีมอบรางวัลชนะเลิศตลอดทั้งปี') : t('home.featureEvents.desc')}
                </p>
                <div className="banner-link-row text-blue">
                  <span style={{ color: '#60a5fa' }}>{isThai ? (siteData?.featureBanners?.bannerLeft?.linkText || 'สำรวจอัลบั้มภาพกิจกรรม') : t('home.featureEvents.link')}</span>
                  <ArrowRight size={18} color="#60a5fa" />
                </div>
              </div>
            </div>

            {/* Right Card: TOURNAMENTS -> Goes to Dedicated Tournaments */}
            <div 
              onClick={() => {
                if (onNavigateTournaments) onNavigateTournaments();
                else {
                  window.history.pushState(null, '', '/tournaments');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }} 
              className="feature-banner-card blog-banner glass-panel"
              style={{ 
                cursor: 'pointer',
                background: siteData?.featureBanners?.bannerRight?.image
                  ? `linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.88) 100%), url(${siteData.featureBanners.bannerRight.image}) center/cover no-repeat`
                  : (siteData?.featureBanners?.bannerRight?.bgGradient || 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)')
              }}
            >
              <div className="banner-content">
                <span className="badge-pill badge-white">{isThai ? (siteData?.featureBanners?.bannerRight?.badge || 'GLP TOURNAMENTS') : t('home.featureTournaments.badge')}</span>
                <h3 className="banner-title" style={{ color: '#ffffff' }}>
                  {isThai ? (siteData?.featureBanners?.bannerRight?.title || 'ทัวร์นาเมนต์การแข่งขัน') : t('home.featureTournaments.title')}
                </h3>
                <p className="banner-desc" style={{ color: '#cbd5e1' }}>
                  {isThai ? (siteData?.featureBanners?.bannerRight?.desc || 'เกาะติดผลการแข่งขัน สายแข่งสด (Brackets) และลงทะเบียนประลองฝีมือระดับประเทศ') : t('home.featureTournaments.desc')}
                </p>
                <div className="banner-link-row text-blue">
                  <span style={{ color: '#60a5fa' }}>{isThai ? (siteData?.featureBanners?.bannerRight?.linkText || 'สำรวจทัวร์นาเมนต์ทั้งหมด') : t('home.featureTournaments.link')}</span>
                  <ArrowRight size={18} color="#60a5fa" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTIVITIES & COMMUNITY GALLERY (ภาพกิจกรรม) */}
      <section className="activities-gallery-section" id="activities">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <div className="badge-pill badge-blue">
              <ImageIcon size={14} />
              <span>GLP PHOTO & COMMUNITY GALLERY</span>
            </div>
            <div className="section-header-row-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: '1 1 500px' }}>
                <h2 className="section-title" style={{ margin: 0 }}>
                  {isThai ? (
                    <>ภาพกิจกรรม & <span className="text-blue">บรรยากาศความมันส์</span></>
                  ) : (
                    <span>{t('home.latestActivities.title')}</span>
                  )}
                </h2>
                <p className="section-subtitle" style={{ marginTop: '8px', marginBottom: 0 }}>
                  {isThai 
                    ? 'ย้อนชมภาพความประทับใจ การประลองฝีมือของเหล่านักกีฬาอีสปอร์ต และงานอีเวนต์ร่วมกับค่ายเกมชั้นนำ ณ GLP Esports'
                    : (language === 'zh' ? '记录线下狂欢赛、游戏发布会与玩家社区精彩瞬间' : 'Relive highlights from championship tournaments, publisher showcases, and gamer meetups at GLP Esports.')
                  }
                </p>
              </div>
              <button 
                type="button" 
                className="btn-enter-dedicated-page desktop-only-btn"
                onClick={() => onNavigateActivities ? onNavigateActivities() : (window.history.pushState(null, '', '/activities'), window.dispatchEvent(new PopStateEvent('popstate')))}
              >
                <span>{t('common.viewAll')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="section-header-center" style={{ paddingTop: 0 }}>
            {/* Category Filter Tabs (Single Row & Touch Swipeable) */}
            <div className="category-scroll-wrapper" style={{ width: '100%', margin: '20px 0 0 0' }}>
              <div className="category-filter-pills">
                {categories.map(cat => {
                  let CategoryIcon = LayoutGrid;
                  if (cat.id === 'tournament') CategoryIcon = Trophy;
                  if (cat.id === 'publisher') CategoryIcon = Gamepad2;
                  if (cat.id === 'community') CategoryIcon = Gift;
                  if (cat.id === 'venue') CategoryIcon = Zap;

                  return (
                    <button
                      key={cat.id}
                      onClick={(e) => {
                        setSelectedCategory(cat.id);
                        try {
                          e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        } catch (err) {}
                      }}
                      className={`cat-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    >
                      <CategoryIcon size={15} />
                      <span>{translateDynamic(cat.label)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Filter Summary Banner */}
            {(selectedCategory !== 'all' || selectedTag !== 'all' || searchQuery) && (
              <div className="hub-active-filters-summary glass-panel">
                <div className="summary-tags-group">
                  <span className="summary-title">{language === 'th' ? 'กำลังกรองบทความ:' : (language === 'zh' ? '当前筛选条件:' : 'Filtering Articles:')}</span>
                  {selectedCategory !== 'all' && (
                    <span className="summary-pill category">
                      <span>{language === 'th' ? 'หมวดหมู่:' : (language === 'zh' ? '分类:' : 'Category:')} <strong>{categories.find(c => c.id === selectedCategory)?.label || selectedCategory}</strong></span>
                      <X size={12} className="btn-x-clear" onClick={() => setSelectedCategory('all')} />
                    </span>
                  )}
                  {selectedTag !== 'all' && (
                    <span className="summary-pill tag">
                      <span>{language === 'th' ? 'แท็ก:' : (language === 'zh' ? '标签:' : 'Tag:')} <strong>{selectedTag}</strong></span>
                      <X size={12} className="btn-x-clear" onClick={() => setSelectedTag('all')} />
                    </span>
                  )}
                  {searchQuery && (
                    <span className="summary-pill search">
                      <span>{language === 'th' ? 'คำค้น:' : (language === 'zh' ? '搜索词:' : 'Search:')} "{searchQuery}"</span>
                      <X size={12} className="btn-x-clear" onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                  <span className="summary-count">({filteredActivities.length} {language === 'th' ? 'บทความ' : (language === 'zh' ? '篇文章' : 'Articles')})</span>
                </div>
                <button 
                  type="button" 
                  className="btn-clear-all-filters"
                  onClick={() => { setSelectedCategory('all'); setSelectedTag('all'); setSearchQuery(''); }}
                >
                  {language === 'th' ? 'ล้างตัวกรองทั้งหมด' : (language === 'zh' ? '清除所有筛选' : 'Clear All Filters')}
                </button>
              </div>
            )}
          </div>

          {/* Activities Grid */}
          <div className="gallery-items-grid">
            {filteredActivities.length > 0 ? (
              filteredActivities.slice(0, 3).map(item => (
                <div 
                  key={item.id} 
                  className="gallery-card glass-panel clickable-article-card"
                  onClick={() => {
                    if (onSelectActivitySlug) {
                      onSelectActivitySlug(item.slug || item.id);
                    } else {
                      window.history.pushState(null, '', `/activities/${item.slug || item.id}`);
                    }
                  }}
                >
                  <div className="gallery-thumb-wrapper">
                    <img src={item.image} alt={item.imageAlt || item.title} className="gallery-thumb-img" />
                    <span className="gallery-tag-pill">{translateDynamic(item.tag || item.category)}</span>
                  </div>

                  <div className="gallery-info">
                    <div className="gallery-meta">
                      <span className="gallery-date">{translateDynamic(item.date)}</span>
                      <span className="gallery-partner">{translateDynamic(item.partner)}</span>
                    </div>
                    <h3 className="gallery-title">{translateDynamic(item.title)}</h3>
                    <p className="gallery-desc">{translateDynamic(item.desc)}</p>

                    <div className="gallery-view-link text-blue">
                      <span>{language === 'th' ? 'ชมภาพกิจกรรมเต็ม' : (language === 'zh' ? '查看完整相册' : 'View Full Gallery')}</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events-found glass-panel">
                <Search size={32} className="text-muted" />
                <h3>{language === 'th' ? 'ไม่พบกิจกรรมที่ค้นหา' : (language === 'zh' ? '未找到相关活动' : 'No Events Found')}</h3>
                <p>{language === 'th' ? 'ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นเพื่อดูกิจกรรมที่น่าสนใจ' : (language === 'zh' ? '请尝试调整搜索关键词或选择其他分类' : 'Try adjusting your search or select another category.')}</p>
                <button className="btn-secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedTag('all'); }}>
                  {language === 'th' ? 'ล้างตัวกรองทั้งหมด' : (language === 'zh' ? '清除所有筛选' : 'Clear All Filters')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Bottom CTA: Displayed only on mobile below the 3 cards */}
          <div className="section-mobile-bottom-cta">
            <button 
              type="button" 
              className="btn-enter-dedicated-page"
              onClick={() => onNavigateActivities ? onNavigateActivities() : (window.history.pushState(null, '', '/activities'), window.dispatchEvent(new PopStateEvent('popstate')))}
            >
              <span>{t('common.viewAll')}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. TOURNAMENTS & ACTIVITIES SCHEDULE */}
      {(() => {
        const tourBg = siteData?.tournamentsSection?.bgColor || '#ffffff';
        const isDarkTour = isColorDark(tourBg);
        return (
          <section 
            className="tournaments-section" 
            id="tournaments"
            style={{ 
              background: tourBg,
              backgroundColor: tourBg,
              backgroundImage: 'none'
            }}
          >
            <div className="container">
              <div className="section-header">
                <div className="badge-pill badge-amber">
                  <Flame size={14} />
                  <span>{siteData?.tournamentsSection?.badge || 'TOURNAMENTS & COMMUNITY EVENTS'}</span>
                </div>
                <div className="section-header-row-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: '1 1 500px' }}>
                    <h2 className="section-title" style={{ color: siteData?.tournamentsSection?.titleColor || (isDarkTour ? '#ffffff' : '#0f172a'), margin: 0 }}>
                      {isThai ? (siteData?.tournamentsSection?.title || 'ปฏิทินการแข่งขัน อีสปอร์ตประจำเดือน') : t('home.latestTournaments.title')}
                    </h2>
                    <p className="section-subtitle" style={{ color: siteData?.tournamentsSection?.subtitleColor || (isDarkTour ? '#cbd5e1' : '#475569'), marginTop: '8px', marginBottom: 0 }}>
                      {isThai 
                        ? (siteData?.tournamentsSection?.subtitle || 'ร่วมชิงเงินรางวัลรวมกว่าหลายแสนบาท พิสูจน์ฝีมือบนเวที LAN Final ถ่ายทอดสดสู่สายตาแฟนเกมทั่วประเทศ')
                        : (language === 'zh' ? '全国大型电竞锦标赛赛程，丰厚奖金池，4K主舞台全程高清直播' : 'Compete for national championships and major prize pools, streamed live on the 4K Main Stage.')
                      }
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="btn-enter-dedicated-page amber-theme desktop-only-btn"
                    onClick={() => onNavigateTournaments ? onNavigateTournaments() : (window.history.pushState(null, '', '/tournaments'), window.dispatchEvent(new PopStateEvent('popstate')))}
                  >
                    <span>{t('common.viewAll')}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="tournaments-grid">
                {tournamentsList.slice(0, 3).map((tourney) => {
                  const photoCount = (tourney.galleryPhotos || []).length;
                  const teamCount = (tourney.teams || []).length;
                  const isRegistrationOpen = isTournamentRegistrationOpen(tourney);
                  return (
                    <div key={tourney.id} className="tournament-card">
                      {/* Banner Image with Overlays - Clickable */}
                      <div 
                        className="t-banner-wrapper"
                        onClick={() => handleOpenTournament(tourney, 'overview')}
                        style={{ cursor: 'pointer' }}
                        title={`ดูรายละเอียด ${tourney.title}`}
                      >
                        <img 
                          src={tourney.bannerImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'} 
                          alt={tourney.title} 
                          className="t-card-img"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="t-card-overlay" />
                        
                        <div className="t-banner-top">
                          {isRegistrationOpen ? (
                            <span className="badge-live-pulse">
                              <span className="live-ping-wrapper">
                                <span className="live-ping-ring" />
                                <span className="live-ping-core" />
                              </span>
                              <span>{translateDynamic(tourney.badge || 'เปิดรับสมัครด่วน')}</span>
                            </span>
                          ) : (
                            <span className={`badge-pill badge-${tourney.badgeType === 'cyan' ? 'blue' : tourney.badgeType === 'magenta' ? 'white' : 'amber'}`} style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                              {translateDynamic(tourney.badge)}
                            </span>
                          )}
                          {tourney.gameCategory && (
                            <span className="t-category-badge" title={tourney.gameCategory}>
                              {tourney.gameCategory}
                            </span>
                          )}
                        </div>

                        <div className="t-banner-bottom">
                          <span className="t-game-tag">
                            {tourney.game}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="t-card-body">
                        <div>
                          <h3 
                            className="t-card-title clickable-title" 
                            title={tourney.title}
                            onClick={() => handleOpenTournament(tourney, 'overview')}
                            style={{ cursor: 'pointer' }}
                          >
                            {translateDynamic(tourney.title)}
                          </h3>

                          {/* High-impact Prize Banner */}
                          <div className="t-prize-banner" style={{ marginTop: '14px' }}>
                            <div className="t-prize-label">
                              <Trophy size={16} className="text-amber" />
                              <span>{t('common.prizePool') || (language === 'zh' ? '总奖金' : language === 'en' ? 'Total Prize Pool' : 'เงินรางวัลรวม')}</span>
                            </div>
                            <div className="t-prize-amount">
                              {translateDynamic(tourney.prizePool)}
                            </div>
                          </div>

                          {/* Spec Details List */}
                          <div className="t-details-list" style={{ marginTop: '12px' }}>
                            <div className="t-detail-item">
                              <Calendar size={15} className="text-cyan" style={{ flexShrink: 0 }} />
                              <span><strong>{language === 'zh' ? '日期:' : language === 'en' ? 'Date:' : 'วันที่:'}</strong> {translateDynamic(tourney.date)} ({translateDynamic(tourney.time)})</span>
                            </div>
                            <div className="t-detail-item">
                              <Users size={15} className="text-blue" style={{ flexShrink: 0 }} />
                              <span><strong>{language === 'zh' ? '参赛规模:' : language === 'en' ? 'Teams:' : 'จำนวนทีม:'}</strong> {translateDynamic(tourney.slots)} ({teamCount} {language === 'zh' ? '支战队已报名' : language === 'en' ? 'teams registered' : 'ทีมร่วมแข่ง'})</span>
                            </div>
                            <div className="t-detail-item">
                              <Zap size={15} className="text-amber" style={{ flexShrink: 0 }} />
                              <span><strong>{language === 'zh' ? '赛制:' : language === 'en' ? 'Format:' : 'รูปแบบ:'}</strong> {translateDynamic(tourney.format)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="t-card-footer">
                          <div className="t-action-single">
                            <button 
                              type="button"
                              className="t-btn-secondary"
                              style={{ width: '100%', justifyContent: 'center' }}
                              onClick={() => handleOpenTournament(tourney, 'roster')}
                            >
                              <Users size={14} />
                              <span>{language === 'th' ? `รายชื่อทีม (${teamCount})` : (language === 'zh' ? `战队名单 (${teamCount})` : `Teams List (${teamCount})`)}</span>
                            </button>
                          </div>

                          {/* Action Buttons - Clean, Consistent & Aligned */}
                          {isRegistrationOpen ? (
                            <button 
                              id={`btn-reg-${tourney.id}`}
                              className="t-btn-register"
                              style={{ width: '100%', justifyContent: 'center' }}
                              onClick={() => handleOpenTournament(tourney, 'register')}
                            >
                              <Zap size={16} className="text-amber-300" style={{ filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))' }} />
                              <span>{language === 'th' ? 'สมัครเข้าร่วมแข่งขัน' : (language === 'zh' ? '报名参赛' : 'Register Now')}</span>
                              <ArrowRight size={17} className="btn-arrow-icon" />
                            </button>
                          ) : (
                            <button 
                              className="t-btn-full"
                              style={{ width: '100%', justifyContent: 'center' }}
                              onClick={() => handleOpenTournament(tourney, 'bracket')}
                            >
                              <Trophy size={15} />
                              <span>{language === 'th' ? 'ดูสายการแข่งขัน & สกอร์สด (Brackets)' : (language === 'zh' ? '查看对阵图与比分' : 'Tournament Brackets & Scores')}</span>
                              <ArrowRight size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Bottom CTA: Displayed only on mobile below the 3 cards */}
              <div className="section-mobile-bottom-cta">
                <button 
                  type="button" 
                  className="btn-enter-dedicated-page amber-theme"
                  onClick={() => onNavigateTournaments ? onNavigateTournaments() : (window.history.pushState(null, '', '/tournaments'), window.dispatchEvent(new PopStateEvent('popstate')))}
                >
                  <span>{t('common.viewAll')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 6. VENUE ATMOSPHERE & SIGNATURE ZONES */}
      {(() => {
        const zonesBg = siteData?.zonesSection?.bgColor || '#f8fafc';
        const isDarkZones = isColorDark(zonesBg);
        return (
          <section 
            className="zones-section" 
            id="zones"
            style={{ 
              background: zonesBg,
              backgroundColor: zonesBg,
              backgroundImage: 'none'
            }}
          >
            <div className="container">
              <div className="section-header">
                <div className="badge-pill badge-white">
                  <Layers size={14} />
                  <span>{isThai ? (siteData?.zonesSection?.badge || 'VENUE ATMOSPHERE & ZONES') : t('home.zones.badge')}</span>
                </div>
                <h2 className="section-title" style={{ color: siteData?.zonesSection?.titleColor || (isDarkZones ? '#ffffff' : '#0f172a') }}>
                  {isThai ? (siteData?.zonesSection?.title || 'บรรยากาศและโซนการให้บริการ GLP ESPORTS') : t('home.zones.title')}
                </h2>
                <p className="section-subtitle" style={{ color: siteData?.zonesSection?.subtitleColor || (isDarkZones ? '#cbd5e1' : '#475569') }}>
                  {isThai ? (siteData?.zonesSection?.subtitle || 'สัมผัสความพรีเมียมที่ออกแบบมาสำหรับเกมเมอร์ทุกสไตล์ ตั้งแต่ผู้เล่นทั่วไป สตรีมเมอร์ ไปจนถึงการประลองระดับแชมป์เปียนชิป') : t('home.zones.subtitle')}
                </p>
              </div>

              {/* Zone Tabs */}
              <div className="zone-tabs-list">
                {allZones.map((zone) => (
                  <button
                    key={zone.id}
                    id={`btn-zone-tab-${zone.id}`}
                    onClick={() => handleSelectZone(zone.id)}
                    className={`zone-tab-btn ${activeZone === zone.id ? 'active' : ''}`}
                    type="button"
                  >
                    {zone.id === 'stage' && <Trophy size={18} />}
                    {zone.id === 'vip' && <Shield size={18} />}
                    {zone.id === 'standard' && <Monitor size={18} />}
                    {zone.id === 'cafe' && <Coffee size={18} />}
                    <span>{zone.title}</span>
                  </button>
                ))}
              </div>

              {/* Active Zone Detail Showcase with 16:9 3-Image Slider */}
              <div className="zone-showcase-panel glass-panel">
                <div className="zone-slider-column">
                  <div 
                    className="zone-slider-viewport"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    <img 
                      key={`${currentZoneData.id}-${activeSlide.id || zoneSlideIndex}`}
                      src={activeSlide.url || defaultZoneInit.image} 
                      alt={activeSlide.caption || currentZoneData.title}
                      className="zone-feature-img" 
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultZoneInit?.images?.[zoneSlideIndex % (defaultZoneInit.images?.length || 1)]?.url || defaultZoneInit.image;
                      }}
                    />
                    
                    {/* Zone Badge Overlay */}
                    <div className="zone-badge-overlay">
                      <span className="badge-pill badge-blue">{currentZoneData.badge}</span>
                    </div>

                    {/* Slide Counter Overlay */}
                    <div className="zone-counter-overlay">
                      <Camera size={13} />
                      <span>{zoneSlideIndex + 1} / {totalZoneSlides}</span>
                    </div>

                    {/* Prev / Next Navigation Arrows */}
                    {totalZoneSlides > 1 && (
                      <>
                        <button 
                          className="zone-slider-nav-btn prev"
                          onClick={handlePrevSlide}
                          aria-label={language === 'zh' ? '上一张' : language === 'en' ? 'Previous' : 'ภาพก่อนหน้า'}
                          type="button"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button 
                          className="zone-slider-nav-btn next"
                          onClick={handleNextSlide}
                          aria-label={language === 'zh' ? '下一张' : language === 'en' ? 'Next' : 'ภาพถัดไป'}
                          type="button"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}

                    {/* Photo Caption Overlay */}
                    {activeSlide.caption && (
                      <div className="zone-caption-scrim">
                        <p className="zone-caption-text">{translateDynamic(activeSlide.caption)}</p>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Strip (Symmetrical 3-column preview) */}
                  {totalZoneSlides > 1 && (
                    <div className="zone-thumbnails-strip" aria-label={language === 'zh' ? '缩略图栏' : language === 'en' ? 'Thumbnails' : 'แถบภาพขนาดย่อ'} ref={thumbnailsRef}>
                      {currentZoneImages.map((imgObj, idx) => {
                        const fallbackThumb = defaultZoneInit?.images?.[idx]?.url || defaultZoneInit.image;
                        const thumbUrl = imgObj.url || fallbackThumb;
                        const isCur = idx === zoneSlideIndex;
                        return (
                          <button
                            key={imgObj.id || idx}
                            type="button"
                            onClick={() => setZoneSlideIndex(idx)}
                            className={`zone-thumb-btn ${isCur ? 'active' : ''}`}
                            title={language === 'zh' ? `第 ${idx + 1} 张: ${translateDynamic(imgObj.caption || '')}` : language === 'en' ? `Photo ${idx + 1}: ${translateDynamic(imgObj.caption || '')}` : `ภาพที่ ${idx + 1}: ${imgObj.caption || ''}`}
                          >
                            <img 
                              src={thumbUrl} 
                              alt="" 
                              className="zone-thumb-img" 
                              loading="lazy" 
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = fallbackThumb;
                              }}
                            />
                            <span className="zone-thumb-num">{idx + 1}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="zone-info-wrapper">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <div className="zone-sub">{currentZoneData.subtitle}</div>
                    {currentZoneData.ratePerHour && (
                      <span className="badge-pill badge-blue" style={{ fontSize: '0.78rem', padding: '4px 10px' }}>
                        {currentZoneData.ratePerHour}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="zone-heading">{currentZoneData.title}</h3>
                  <p className="zone-desc">{currentZoneData.description}</p>

                  <div className="zone-specs-box">
                    <div className="specs-title">
                      <Zap size={16} className="text-blue" />
                      <span>{isThai ? 'จุดเด่นของโซนนี้:' : (language === 'zh' ? '本区核心亮点:' : 'Key Zone Features:')}</span>
                    </div>
                    <div className="specs-grid">
                      {currentZoneData.specs.map((spec, idx) => (
                        <div key={idx} className="spec-item">
                          <CheckCircle2 size={16} className="text-blue" style={{ flexShrink: 0 }} />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="zone-action-bar">
                    <button 
                      type="button"
                      onClick={() => {
                        setSelectedOrganizerZone(currentZoneData.title || currentZoneData.name);
                        setIsOrganizerModalOpen(true);
                      }}
                      className="btn-zone-request-modal"
                      id={`btn-contact-zone-${currentZoneData.id}`}
                    >
                      <Trophy size={18} />
                      <span>{isThai ? 'ติดต่อขอเช่าสถานที่' : (language === 'zh' ? '咨询场地租赁 / 承办' : 'Inquire / Book Zone')}</span>
                      <ArrowRight size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setBookingInitialZone(currentZoneData.id);
                        setIsSeatBookingOpen(true);
                      }}
                      className="btn-zone-booking-modal"
                      id={`btn-book-zone-${currentZoneData.id}`}
                    >
                      <Gamepad2 size={18} />
                      <span>{isThai ? 'จองที่นั่งโซนนี้ (Live Booking)' : (language === 'zh' ? '在线预订机位' : 'Reserve Seat')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 7. OUR PRODUCTS SHOWCASE SECTION (สินค้าของเรา 6 รายการ) */}
      <section className="home-products-showcase-section" id="home-products-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '38px' }}>
            <div className="badge-pill badge-blue" style={{ margin: '0 auto 12px auto' }}>
              <ShoppingBag size={14} />
              <span>{isThai ? 'GSPEED EQUIPMENT STORE • อุปกรณ์มาตรฐานอีสปอร์ต' : (language === 'zh' ? 'GSPEED 官方商城' : 'GSPEED OFFICIAL STORE')}</span>
            </div>
            <h2 className="section-title" style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '10px' }}>
              {isThai ? 'สินค้าของเรา' : (language === 'zh' ? '我们的商品' : 'Our Products')}
            </h2>
            <p className="section-subtitle" style={{ maxWidth: '640px', margin: '0 auto', color: '#64748b', fontSize: '15px' }}>
              {isThai 
                ? 'โต๊ะเกมมิ่งโครงเหล็กคาร์บอน เก้าอี้ Ergonomic และอุปกรณ์จัดโต๊ะคอมพิวเตอร์ระดับโปร สั่งซื้อได้ทันที พร้อมออกใบเสนอราคาทางการ' 
                : (language === 'zh' 
                    ? '专业电竞对战桌椅、人体工学椅与电竞外设硬件，官方原厂质保，现货直发' 
                    : 'Esports-grade battle desks, ergonomic chairs, and professional equipment. Order online with instant official quotation.')}
            </p>
          </div>

          <div className="home-products-grid">
            {(siteData?.equipmentProducts || EQUIPMENT_PRODUCTS).slice(0, 6).map((prod) => {
              const categoryName = prod.category === 'desks' ? (isThai ? 'โต๊ะเกมมิ่ง' : 'Desks')
                : prod.category === 'chairs' ? (isThai ? 'เก้าอี้ Ergonomic' : 'Chairs')
                : prod.category === 'accessories' ? (isThai ? 'อุปกรณ์เสริม' : 'Accessories')
                : (isThai ? 'เซ็ตสุดคุ้ม' : 'Bundle');

              const discountPercent = prod.originalPrice && prod.price && prod.originalPrice > prod.price
                ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                : null;

              return (
                <div 
                  key={prod.id} 
                  className="home-product-card"
                  onClick={() => handleViewProduct(prod.id)}
                >
                  <div className="home-product-image-wrap">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="home-product-thumb" 
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    {prod.badge && (
                      <span className={`home-product-badge ${prod.badgeType || ''}`}>
                        {prod.badge}
                      </span>
                    )}
                    {discountPercent && (
                      <span className="home-product-discount-tag">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="home-product-content">
                    <div className="home-product-cat-row">
                      <span className="home-product-cat-tag">{categoryName}</span>
                      <div className="home-product-rating">
                        <Star size={13} fill="#eab308" color="#eab308" />
                        <span>{prod.rating}</span>
                        <span className="rating-count">({prod.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 className="home-product-name">{prod.name}</h3>
                    <p className="home-product-sub">{prod.subtitle}</p>

                    <div className="home-product-footer-row">
                      <div className="home-product-price-box">
                        <span className="home-product-price">฿{prod.price?.toLocaleString()}</span>
                        {prod.originalPrice && (
                          <span className="home-product-orig-price">฿{prod.originalPrice.toLocaleString()}</span>
                        )}
                      </div>

                      <div className="home-product-card-actions">
                        <button 
                          className="btn-home-quick-cart"
                          title={isThai ? 'เพิ่มลงตะกร้า' : 'Add to cart'}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(prod, {}, 1);
                            setIsCartOpen(true);
                          }}
                        >
                          <ShoppingCart size={16} />
                        </button>
                        <button 
                          className="btn-home-buy-prod"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProduct(prod.id);
                          }}
                        >
                          <span>{isThai ? 'สั่งซื้อ' : 'Buy'}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="home-products-footer-action">
            <button 
              id="btn-home-view-all-products"
              onClick={onNavigateFranchise} 
              className="btn-primary cta-btn-large"
            >
              <ShoppingBag size={18} />
              <span>{isThai ? 'ดูสินค้าทั้งหมด' : (language === 'zh' ? '查看全部商品' : 'View All Products')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* MODAL: GALLERY ITEM DETAIL (LIGHTBOX) */}
      {selectedGalleryItem && (
        <div className="modal-backdrop" onClick={() => setSelectedGalleryItem(null)}>
          <div className="modal-dialog modal-large glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="badge-pill badge-blue">{selectedGalleryItem.tag}</span>
                <h3 className="modal-title">{selectedGalleryItem.title}</h3>
              </div>
              <button className="btn-icon-close" onClick={() => setSelectedGalleryItem(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="gallery-modal-body">
              <div className="modal-img-frame">
                <img src={selectedGalleryItem.image} alt={selectedGalleryItem.imageAlt || selectedGalleryItem.title} className="modal-feature-img" />
              </div>
              <div className="modal-details-box">
                <div className="meta-row">
                  <div><strong>{language === 'zh' ? '活动日期:' : language === 'en' ? 'Event Date:' : 'วันที่จัดกิจกรรม:'}</strong> {translateDynamic(selectedGalleryItem.date)}</div>
                  <div><strong>{language === 'zh' ? '合作主办方:' : language === 'en' ? 'Organizing Partner:' : 'พาร์ตเนอร์ร่วมจัด:'}</strong> {translateDynamic(selectedGalleryItem.partner)}</div>
                </div>
                <p className="modal-full-desc">{translateDynamic(selectedGalleryItem.desc)}</p>
                <div className="modal-hotline-callout">
                  <PhoneCall size={18} className="text-blue" />
                  <span>{language === 'zh' ? '如需租赁场地举办此类电竞赛事或活动，请致电专线：' : language === 'en' ? 'Interested in renting the arena or hosting an event like this? Call: ' : 'สนใจเช่าสถานที่จัดกิจกรรม หรือจัดแข่งอีเวนต์แบบนี้ ติดต่อสายด่วน: '}<strong>063-793-7704</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Esport Tournament Organizer & Venue Rental Modal */}
      <EsportOrganizerModal
        isOpen={isOrganizerModalOpen}
        onClose={() => setIsOrganizerModalOpen(false)}
        initialZoneName={selectedOrganizerZone}
      />

      {/* Arena Live Seat Booking Modal */}
      <ArenaSeatBookingModal
        isOpen={isSeatBookingOpen}
        onClose={() => setIsSeatBookingOpen(false)}
        initialZoneId={bookingInitialZone}
      />
    </div>
  );
}
