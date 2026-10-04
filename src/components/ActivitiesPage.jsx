import React, { useState, useEffect, useMemo } from 'react';
import { 
  Image as ImageIcon, Trophy, Gamepad2, Gift, Zap, 
  Search, X, ArrowLeft, ArrowRight, ExternalLink, 
  Calendar, Users, Sparkles, Filter, PhoneCall, LayoutGrid, Tag
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { GALLERY_ACTIVITIES, EVENT_CATEGORIES, GAME_NEWS } from '../data/mockData';

export default function ActivitiesPage({
  onSelectActivitySlug,
  onNavigateHome,
  onNavigateFranchise,
  initialCategory = 'all',
  initialTag = 'all'
}) {
  const { siteData } = useSiteData();
  const { t, language, translateDynamic } = useTranslation();
  const galleryList = siteData?.gallery || GALLERY_ACTIVITIES;
  const newsList = siteData?.news || GAME_NEWS;
  const categories = siteData?.activityCategories || EVENT_CATEGORIES;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [selectedTag, setSelectedTag] = useState(initialTag || 'all');

  // Sync initial props
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

  // Extract all unique tags (merge from activities and siteData.articleTags)
  const allUniqueTags = useMemo(() => {
    const set = new Set();
    if (Array.isArray(siteData?.articleTags)) {
      siteData.articleTags.forEach(tg => {
        if (tg && tg.trim()) set.add(tg.replace(/^#/, '').trim());
      });
    }
    galleryList.forEach(item => {
      if (Array.isArray(item.tags)) {
        item.tags.forEach(tg => {
          if (tg && tg.trim()) set.add(tg.replace(/^#/, '').trim());
        });
      } else if (item.tag && item.tag.trim()) {
        set.add(item.tag.replace(/^#/, '').trim());
      }
    });
    return Array.from(set);
  }, [galleryList, siteData?.articleTags]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return galleryList.filter(item => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchTag = selectedTag === 'all' || 
        (Array.isArray(item.tags) && item.tags.some(t => t.replace(/^#/, '').toLowerCase() === selectedTag.replace(/^#/, '').toLowerCase())) ||
        (item.tag && item.tag.replace(/^#/, '').toLowerCase() === selectedTag.replace(/^#/, '').toLowerCase());

      const q = searchQuery.trim().toLowerCase();
      const cleanQ = q.replace(/^#/, '');
      const matchSearch = !q || 
        item.title.toLowerCase().includes(q) || 
        item.desc.toLowerCase().includes(q) ||
        (item.partner && item.partner.toLowerCase().includes(q)) ||
        (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(q) || t.replace(/^#/, '').toLowerCase().includes(cleanQ))) ||
        (item.tag && item.tag.toLowerCase().includes(q));

      return matchCategory && matchTag && matchSearch;
    });
  }, [galleryList, selectedCategory, selectedTag, searchQuery]);

  const handleCardClick = (item) => {
    const slug = item.slug || item.id;
    if (onSelectActivitySlug) {
      onSelectActivitySlug(slug);
    } else {
      window.history.pushState(null, '', `/activities/${slug}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div className="activities-page-wrapper">
      {/* 1. Page Breadcrumb & Interactive Filter Controls Bar */}
      <div className="page-breadcrumb-bar" style={{ padding: '16px 0 20px 0', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <div className="container">
          <div className="breadcrumb-trail" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              className="breadcrumb-item" 
              style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem' }}
              onClick={() => onNavigateHome ? onNavigateHome() : (window.history.pushState(null, '', '/'), window.dispatchEvent(new PopStateEvent('popstate')))}
            >
              {t('nav.home')}
            </span>
            <span className="breadcrumb-separator" style={{ color: '#94a3b8' }}>/</span>
            <span className="breadcrumb-item current" style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.85rem' }}>
              {t('nav.activities')}
            </span>
          </div>

          {/* Search & Category Filters */}
          <div className="activities-controls-card glass-panel" style={{ margin: 0, boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)' }}>
            {/* Top row: Search Box & Category Pills */}
            <div className="controls-row-top">
              <div className="activity-search-box">
                <Search size={18} className="search-icon text-blue" />
                <input 
                  type="text" 
                  placeholder={language === 'zh' ? '搜索活动图集、赛事名称、厂商或游戏...' : language === 'en' ? 'Search photo galleries, event titles, publishers, or games...' : 'ค้นหาภาพกิจกรรม, ชื่องาน, ค่ายเกม หรือชื่อเกม...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button className="btn-clear-search" onClick={() => setSearchQuery('')}>
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Category Pills Slider (Single Row & Touch Swipeable) */}
              <div className="category-scroll-wrapper">
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
                        type="button"
                        onClick={(e) => {
                          setSelectedCategory(cat.id);
                          try {
                            e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                          } catch (err) {}
                        }}
                        className={`cat-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                      >
                        <CategoryIcon size={14} />
                        <span>{translateDynamic(cat.label)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Header Banner */}
      <section className="activities-hero-header" style={{ padding: '36px 0 30px 0' }}>
        <div className="container activities-hero-container">
          <div className="activities-hero-badge">
            <ImageIcon size={15} className="text-blue pulse-icon" />
            <span>{t('activitiesPage.badge') || 'GLP PHOTO & COMMUNITY GALLERY'}</span>
          </div>
          <h1 className="activities-hero-title">
            {language === 'th' ? (
              <>ประมวลภาพกิจกรรม & <span className="text-blue">บรรยากาศความมันส์</span></>
            ) : language === 'zh' ? (
              <>精彩活动图集 & <span className="text-blue">热血赛事现场</span></>
            ) : (
              <>Activity Highlights & <span className="text-blue">Esports Photo Gallery</span></>
            )}
          </h1>
          <p className="activities-hero-subtitle" style={{ marginBottom: 0 }}>
            {language === 'th' 
              ? 'ย้อนชมภาพความประทับใจ บรรยากาศการประลองฝีมือของเหล่านักกีฬาอีสปอร์ต งานแถลงข่าวเปิดตัวเกม และงานแฟนมีตติ้งร่วมกับค่ายเกมชั้นนำระดับประเทศ ณ GLP Esport Stadium'
              : (language === 'zh'
                ? '重温精彩瞬间！探寻职业电竞选手高能操作、一线游戏大厂新游发布会及粉丝狂欢见面会现场实况。'
                : 'Relive epic moments! Explore high-stakes tournament highlights, game publisher launch events, and passionate community fan meetings at GLP Arena.')}
          </p>
        </div>
      </section>

      {/* 4. Activities Grid */}
      <section className="activities-grid-section">
        <div className="container">
          <div className="activities-count-heading">
            <span>
              {language === 'th' ? (
                <>แสดงผล <strong>{filteredActivities.length}</strong> อัลบั้มภาพกิจกรรม</>
              ) : language === 'zh' ? (
                <>共展示 <strong>{filteredActivities.length}</strong> 个精彩相册</>
              ) : (
                <>Showing <strong>{filteredActivities.length}</strong> Photo Galleries</>
              )}
            </span>
            <span className="click-hint-badge">
              {language === 'th' 
                ? '💡 คลิกที่การ์ดเพื่อชมภาพบรรยากาศขนาดเต็ม' 
                : language === 'zh'
                ? '💡 点击卡片查看高清活动相册'
                : '💡 Click card to view high-res photo gallery'}
            </span>
          </div>

          {filteredActivities.length > 0 ? (
            <div className="gallery-items-grid">
              {filteredActivities.map(item => (
                <div 
                  key={item.id} 
                  className="gallery-card glass-panel clickable-article-card"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="gallery-thumb-wrapper">
                    <img 
                      src={item.image} 
                      alt={item.imageAlt || item.title} 
                      className="gallery-thumb-img" 
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        const fallback = item.galleryPhotos?.[0]?.url && item.galleryPhotos[0].url !== item.image
                          ? item.galleryPhotos[0].url
                          : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
                        e.currentTarget.src = fallback;
                      }}
                    />
                    <span className="gallery-tag-pill">{translateDynamic(item.tag || item.category)}</span>
                  </div>

                  <div className="gallery-info">
                    <div className="gallery-meta">
                      <span className="gallery-date">
                        <Calendar size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        {translateDynamic(item.date)}
                      </span>
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
              ))}
            </div>
          ) : (
            <div className="no-events-found glass-panel">
              <Search size={36} className="text-blue" />
              <h3>{language === 'th' ? 'ไม่พบกิจกรรมตามเงื่อนไขที่ค้นหา' : (language === 'zh' ? '未找到符合条件的活动或图集' : 'No activities match your search')}</h3>
              <p>{language === 'th' ? 'ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นเพื่อดูกิจกรรมที่น่าสนใจ' : (language === 'zh' ? '请尝试更换搜索词或选择其他分类' : 'Try adjusting your search query or select another category.')}</p>
              <button 
                type="button"
                className="btn-primary" 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedTag('all'); }}
              >
                {language === 'th' ? 'แสดงภาพกิจกรรมทั้งหมด' : (language === 'zh' ? '显示全部活动' : 'Show All Activities')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Event Hosting & Community Callout */}
      <section className="tournaments-organizer-callout">
        <div className="container">
          <div className="organizer-box glass-panel">
            <div className="organizer-left">
              <div className="organizer-badge">
                <Sparkles size={14} className="text-blue" />
                <span>COMMUNITY & EVENT VENUE</span>
              </div>
              <h3 className="organizer-title">
                {translateDynamic('สนใจจัดงานแฟนมีตติ้ง งานเปิดตัวเกม หรืออีเวนต์คอมมูนิตี้ที่ GLP?')}
              </h3>
              <p className="organizer-desc">
                {translateDynamic('GLP Esport Arena มีพื้นที่โถงอเนกประสงค์ขนาดใหญ่ เวทีแสงสีเสียง 4K รองรับผู้เข้าร่วมงานกว่า 200+ คน พร้อมบริการอาหาร เครื่องดื่ม และทีมงานดูแลงานแถลงข่าวครบวงจร')}
              </p>
              <div className="organizer-specs-chips">
                <span className="spec-chip">{translateDynamic('✓ พื้นที่จัดงาน 500 ตร.ม.')}</span>
                <span className="spec-chip">{translateDynamic('✓ จอ LED ขนาดใหญ่')}</span>
                <span className="spec-chip">{translateDynamic('✓ ระบบแสงสีเสียง 4K')}</span>
                <span className="spec-chip">{translateDynamic('✓ ที่จอดรถ 24 ชม.')}</span>
              </div>
            </div>

            <div className="organizer-right">
              <div className="organizer-contact-card">
                <div className="contact-card-title">{translateDynamic('ติดต่อฝ่ายประสานงานอีเวนต์')}</div>
                <div className="contact-hotline">
                  <PhoneCall size={18} className="text-blue pulse-icon" />
                  <a href="tel:0637937704">063-793-7704</a>
                </div>
                <p className="contact-subtext">{translateDynamic('ยินดีต้อนรับค่ายเกม แบรนด์เกมมิ่งเกียร์ และคอมมูนิตี้ทุกกลุ่ม')}</p>
                {onNavigateFranchise && (
                  <button 
                    type="button" 
                    className="btn-organizer-plan"
                    onClick={onNavigateFranchise}
                  >
                    <span>{translateDynamic('ติดต่อขอเปิดแฟรนไชส์')}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
