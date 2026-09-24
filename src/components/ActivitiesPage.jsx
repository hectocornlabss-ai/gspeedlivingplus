import React, { useState, useEffect, useMemo } from 'react';
import { 
  Image as ImageIcon, Trophy, Gamepad2, Gift, Zap, 
  Search, X, ArrowLeft, ArrowRight, ExternalLink, 
  Calendar, Users, Sparkles, Filter, PhoneCall, LayoutGrid, Tag
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { GALLERY_ACTIVITIES, EVENT_CATEGORIES, GAME_NEWS } from '../data/mockData';

export default function ActivitiesPage({
  onSelectActivitySlug,
  onNavigateHome,
  initialCategory = 'all',
  initialTag = 'all'
}) {
  const { siteData } = useSiteData();
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

  // Extract all unique tags
  const allUniqueTags = useMemo(() => {
    const set = new Set();
    galleryList.forEach(item => {
      if (Array.isArray(item.tags)) {
        item.tags.forEach(t => set.add(t));
      } else if (item.tag) {
        set.add(item.tag);
      }
    });
    return Array.from(set);
  }, [galleryList]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return galleryList.filter(item => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchTag = selectedTag === 'all' || 
        (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase())) ||
        (item.tag && item.tag.toLowerCase() === selectedTag.toLowerCase());

      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || 
        item.title.toLowerCase().includes(q) || 
        item.desc.toLowerCase().includes(q) ||
        (item.partner && item.partner.toLowerCase().includes(q)) ||
        (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(q))) ||
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
      {/* 1. Breadcrumb Bar */}
      <div className="page-breadcrumb-bar">
        <div className="container breadcrumb-container">
          <button 
            type="button" 
            className="breadcrumb-back-btn"
            onClick={() => onNavigateHome ? onNavigateHome() : (window.history.pushState(null, '', '/'), window.dispatchEvent(new PopStateEvent('popstate')))}
          >
            <ArrowLeft size={16} />
            <span>กลับหน้าหลัก</span>
          </button>
          <div className="breadcrumb-trail">
            <span className="breadcrumb-item" onClick={() => onNavigateHome ? onNavigateHome() : (window.history.pushState(null, '', '/'), window.dispatchEvent(new PopStateEvent('popstate')))}>
              หน้าหลัก
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item current">ภาพกิจกรรม & แกลเลอรี</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Header Banner */}
      <section className="activities-hero-header">
        <div className="container activities-hero-container">
          <div className="activities-hero-badge">
            <ImageIcon size={15} className="text-blue pulse-icon" />
            <span>GLP PHOTO & COMMUNITY GALLERY</span>
          </div>
          <h1 className="activities-hero-title">
            ประมวลภาพกิจกรรม & <span className="text-blue">บรรยากาศความมันส์</span>
          </h1>
          <p className="activities-hero-subtitle">
            ย้อนชมภาพความประทับใจ บรรยากาศการประลองฝีมือของเหล่านักกีฬาอีสปอร์ต งานแถลงข่าวเปิดตัวเกม และงานแฟนมีตติ้งร่วมกับค่ายเกมชั้นนำระดับประเทศ ณ GLP Esport Stadium
          </p>

          {/* Quick Metrics Bar */}
          <div className="tournaments-metrics-grid">
            <div className="metric-card glass-panel">
              <div className="metric-icon-box blue">
                <ImageIcon size={20} />
              </div>
              <div className="metric-content">
                <div className="metric-value">52+ อัลบั้ม</div>
                <div className="metric-label">คลังภาพความละเอียดสูง</div>
              </div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-icon-box amber">
                <Trophy size={20} />
              </div>
              <div className="metric-content">
                <div className="metric-value">LAN Final</div>
                <div className="metric-label">ภาพงานแข่งระดับประเทศ</div>
              </div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-icon-box purple">
                <Gamepad2 size={20} />
              </div>
              <div className="metric-content">
                <div className="metric-value">Game Launch</div>
                <div className="metric-label">เปิดตัวเกม & แฟนมีตติ้ง</div>
              </div>
            </div>

            <div className="metric-card glass-panel">
              <div className="metric-icon-box emerald">
                <Users size={20} />
              </div>
              <div className="metric-content">
                <div className="metric-value">10,000+</div>
                <div className="metric-label">คอมมูนิตี้ผู้ร่วมงาน</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Search & Category Filters */}
      <section className="activities-controls-section">
        <div className="container">
          <div className="activities-controls-card glass-panel">
            {/* Top row: Search Box & Category Pills */}
            <div className="controls-row-top">
              <div className="activity-search-box">
                <Search size={18} className="search-icon text-blue" />
                <input 
                  type="text" 
                  placeholder="ค้นหาภาพกิจกรรม, ชื่องาน, ค่ายเกม หรือชื่อเกม..."
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

              {/* Category Pills */}
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
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`cat-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    >
                      <CategoryIcon size={15} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row: Tags Row */}
            {allUniqueTags.length > 0 && (
              <div className="controls-row-tags">
                <span className="tags-label">
                  <Tag size={13} className="text-blue" />
                  <span>แท็กยอดนิยม:</span>
                </span>
                <button 
                  type="button"
                  className={`tag-chip-btn ${selectedTag === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedTag('all')}
                >
                  ทั้งหมด
                </button>
                {allUniqueTags.map(tag => (
                  <button 
                    key={tag}
                    type="button"
                    className={`tag-chip-btn ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => setSelectedTag(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {/* Active Filters Summary */}
            {(selectedCategory !== 'all' || selectedTag !== 'all' || searchQuery) && (
              <div className="hub-active-filters-summary">
                <div className="summary-tags-group">
                  <span className="summary-title">กำลังกรองข้อมูล:</span>
                  {selectedCategory !== 'all' && (
                    <span className="summary-pill category">
                      หมวด: <strong>{categories.find(c => c.id === selectedCategory)?.label || selectedCategory}</strong>
                      <X size={12} className="btn-x-clear" onClick={() => setSelectedCategory('all')} />
                    </span>
                  )}
                  {selectedTag !== 'all' && (
                    <span className="summary-pill tag">
                      แท็ก: <strong>#{selectedTag}</strong>
                      <X size={12} className="btn-x-clear" onClick={() => setSelectedTag('all')} />
                    </span>
                  )}
                  {searchQuery && (
                    <span className="summary-pill search">
                      คำค้น: "{searchQuery}"
                      <X size={12} className="btn-x-clear" onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                  <span className="summary-count">({filteredActivities.length} รายการ)</span>
                </div>
                <button 
                  type="button" 
                  className="btn-clear-all-filters"
                  onClick={() => { setSelectedCategory('all'); setSelectedTag('all'); setSearchQuery(''); }}
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Activities Grid */}
      <section className="activities-grid-section">
        <div className="container">
          <div className="activities-count-heading">
            <span>แสดงผล <strong>{filteredActivities.length}</strong> บทความ & อัลบั้มภาพกิจกรรม</span>
            <span className="click-hint-badge">💡 คลิกที่การ์ดเพื่ออ่านบทความและชมภาพขนาดเต็ม</span>
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
                    />
                    <span className="gallery-tag-pill">{item.tag || item.category}</span>
                  </div>

                  <div className="gallery-info">
                    <div className="gallery-meta">
                      <span className="gallery-date">
                        <Calendar size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        {item.date}
                      </span>
                      <span className="gallery-partner">{item.partner}</span>
                    </div>
                    <h3 className="gallery-title">{item.title}</h3>
                    <p className="gallery-desc">{item.desc}</p>

                    <div className="gallery-view-link text-blue">
                      <span>อ่านบทความ & ชมภาพกิจกรรมเต็ม</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events-found glass-panel">
              <Search size={36} className="text-blue" />
              <h3>ไม่พบกิจกรรมตามเงื่อนไขที่ค้นหา</h3>
              <p>ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นเพื่อดูกิจกรรมที่น่าสนใจ</p>
              <button 
                type="button"
                className="btn-primary" 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedTag('all'); }}
              >
                แสดงภาพกิจกรรมทั้งหมด
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
                สนใจจัดงานแฟนมีตติ้ง งานเปิดตัวเกม หรืออีเวนต์คอมมูนิตี้ที่ GLP?
              </h3>
              <p className="organizer-desc">
                GLP Esport Arena มีพื้นที่โถงอเนกประสงค์ขนาดใหญ่ เวทีแสงสีเสียง 4K รองรับผู้เข้าร่วมงานกว่า 200+ คน พร้อมบริการอาหาร เครื่องดื่ม และทีมงานดูแลงานแถลงข่าวครบวงจร
              </p>
              <div className="organizer-specs-chips">
                <span className="spec-chip">✓ พื้นที่จัดงานกว่า 500 ตร.ม.</span>
                <span className="spec-chip">✓ จอ LED Display ขนาดใหญ่</span>
                <span className="spec-chip">✓ ระบบแสง สี เสียง มาตรฐานสากล</span>
                <span className="spec-chip">✓ ที่จอดรถสะดวกสบายตลอด 24 ชม.</span>
              </div>
            </div>

            <div className="organizer-right">
              <div className="organizer-contact-card">
                <div className="contact-card-title">ติดต่อฝ่ายประสานงานอีเวนต์</div>
                <div className="contact-hotline">
                  <PhoneCall size={18} className="text-blue pulse-icon" />
                  <a href="tel:0637937704">063-793-7704</a>
                </div>
                <p className="contact-subtext">ยินดีต้อนรับค่ายเกม แบรนด์เกมมิ่งเกียร์ และคอมมูนิตี้ทุกกลุ่ม</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
