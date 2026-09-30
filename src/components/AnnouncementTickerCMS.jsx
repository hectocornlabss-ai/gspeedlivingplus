import React, { useState } from 'react';
import { 
  Bell, Plus, Trash2, Edit3, Eye, EyeOff, Sparkles, ArrowUp, ArrowDown,
  ExternalLink, ArrowRight, CheckCircle2, Sliders, Palette, RefreshCw,
  X, Check, AlertTriangle
} from 'lucide-react';
import { useSiteData, INITIAL_TICKER_SETTINGS, INITIAL_TICKER_ITEMS } from '../context/SiteDataContext';

// Preset Badges for one-click selection
const BADGE_PRESETS = [
  'ประกาศสำคัญ',
  'ทัวร์นาเมนต์',
  'ข่าวด่วน',
  'ฟีเจอร์ใหม่ 3D',
  'จัดแข่ง Esport',
  'โปรโมชั่น',
  'อัปเดตระบบ',
  'สเปกคอมใหม่'
];

// Preset Link Targets
const LINK_PRESETS = [
  { label: 'ตารางทัวร์นาเมนต์', target: '/tournaments', defaultBtn: 'ดูตารางแข่ง' },
  { label: 'จำลองผังร้าน 3D', target: '/franchise', defaultBtn: 'ลองจัดผัง 3D' },
  { label: 'กิจกรรม & บทความ', target: '/activities', defaultBtn: 'อ่านข่าวทั้งหมด' },
  { label: 'ข้อมูลบริษัท GLP', target: '/company', defaultBtn: 'ดูข้อมูลบริษัท' },
  { label: 'โซนงานแข่ง (#activities)', target: '#activities', defaultBtn: 'ดูภาพงานแข่ง' },
  { label: 'หน้าแรก (/)', target: '/', defaultBtn: 'กลับหน้าแรก' }
];

// Sample Message Templates
const TEMPLATE_PRESETS = [
  {
    badge: 'ทัวร์นาเมนต์',
    text: 'เปิดรับสมัคร GLP ESPORT CHAMPIONSHIP 2026 ชิงเงินรางวัลรวม 150,000 บาท พร้อมถ้วยเกียรติยศ สมัครด่วน!',
    linkTarget: '/tournaments',
    linkText: 'สมัครแข่งขัน'
  },
  {
    badge: 'ฟีเจอร์ใหม่ 3D',
    text: 'เปิดตัวระบบ 3D Interior Planner V2 วางผังร้านเกม ปรับแต่งสเปกโต๊ะเก้าอี้ พร้อมคำนวณงบลงทุนแบบเรียลไทม์',
    linkTarget: '/franchise',
    linkText: 'เปิดระบบ 3D'
  },
  {
    badge: 'จัดแข่ง Esport',
    text: 'เปิดให้เช่าเวที Main Stage 5v5 Soundproof Glass Arena พร้อมทีมงานสตรีมมิ่ง 4K และระบบ Tournament Bracket สด',
    linkTarget: '#activities',
    linkText: 'ติดต่อเช่าเวที'
  },
  {
    badge: 'สเปกคอมใหม่',
    text: 'อัปเกรดขุมพลังใหม่! เครื่องสเปก Intel Core i9 + RTX 5090 และจอ Fast-IPS 360Hz พร้อมให้บริการทุกโซนแล้ววันนี้',
    linkTarget: '#zones',
    linkText: 'ดูสเปกทั้งหมด'
  }
];

export default function AnnouncementTickerCMS() {
  const { 
    siteData, 
    addTickerItem, 
    updateTickerItem, 
    deleteTickerItem, 
    reorderTickerItems, 
    updateTickerSettings,
    triggerSaveToast
  } = useSiteData();

  const settings = siteData?.tickerSettings || INITIAL_TICKER_SETTINGS;
  const items = siteData?.tickerItems || INITIAL_TICKER_ITEMS;

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    badge: 'ประกาศสำคัญ',
    text: '',
    linkTarget: '/tournaments',
    linkText: 'ดูรายละเอียด',
    active: true
  });

  // Settings Accordion State
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      badge: 'ประกาศสำคัญ',
      text: '',
      linkTarget: '/tournaments',
      linkText: 'ดูรายละเอียด',
      active: true
    });
    setModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      badge: item.badge || 'ประกาศ',
      text: item.text || '',
      linkTarget: item.linkTarget || '',
      linkText: item.linkText || 'ดูรายละเอียด',
      active: item.active !== false
    });
    setModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) {
      alert('กรุณากรอกข้อความประกาศ');
      return;
    }

    if (editingItem) {
      updateTickerItem(editingItem.id, {
        badge: formData.badge.trim(),
        text: formData.text.trim(),
        linkTarget: formData.linkTarget.trim(),
        linkText: formData.linkText.trim(),
        active: formData.active
      });
    } else {
      addTickerItem({
        badge: formData.badge.trim(),
        text: formData.text.trim(),
        linkTarget: formData.linkTarget.trim(),
        linkText: formData.linkText.trim(),
        active: formData.active
      });
    }

    if (typeof triggerSaveToast === 'function') triggerSaveToast();
    setModalOpen(false);
  };

  // Handle Delete
  const handleDelete = (id, text) => {
    if (window.confirm(`คุณต้องการลบข้อความประกาศนี้ใช่หรือไม่?\n\n"${text?.substring(0, 50)}..."`)) {
      deleteTickerItem(id);
      if (typeof triggerSaveToast === 'function') triggerSaveToast();
    }
  };

  // Handle Toggle Active
  const handleToggleActive = (id, currentActive) => {
    updateTickerItem(id, { active: !currentActive });
    if (typeof triggerSaveToast === 'function') triggerSaveToast();
  };

  // Reorder Item Up
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    reorderTickerItems(newItems);
    if (typeof triggerSaveToast === 'function') triggerSaveToast();
  };

  // Reorder Item Down
  const handleMoveDown = (index) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    reorderTickerItems(newItems);
    if (typeof triggerSaveToast === 'function') triggerSaveToast();
  };

  // Active items for preview
  const activeItems = items.filter(it => it.active !== false);

  return (
    <div className="announcement-ticker-cms-section">
      {/* Header with Title & Action Buttons */}
      <div className="admin-subcard glass-panel" style={{ borderLeft: '4px solid #1d4ed8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div>
            <div className="subcard-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Bell size={18} className="text-blue" />
              <strong>จัดการแถบประกาศตัวอักษรวิ่ง (Announcement Marquee Ticker)</strong>
              <span className="staff-role-pill">
                {activeItems.length} จาก {items.length} รายการกำลังแสดงผล
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              เพิ่ม แก้ไข และลบประกาศด่วนบนสุดของเว็บ พร้อมระบบตัวอักษรวิ่ง (Marquee) ปรับความเร็ว และหยุดนิ่งเมื่อผู้ใช้ชี้เมาส์
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className={`btn-secondary btn-sm ${showSettingsPanel ? 'active' : ''}`}
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              title="ตั้งค่าความเร็ว, ป้ายหัวแถบ, และสีสัน"
            >
              <Sliders size={14} />
              <span>{showSettingsPanel ? 'ซ่อนตั้งค่าการวิ่ง' : 'ตั้งค่าการวิ่ง & สี'}</span>
            </button>

            <button
              id="btn-add-ticker-announcement"
              type="button"
              className="btn-primary btn-sm"
              onClick={handleOpenAdd}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={15} />
              <span>เพิ่มประกาศใหม่</span>
            </button>
          </div>
        </div>

        {/* Live Simulator Preview of Current Ticker Bar */}
        <div className="ticker-preview-container">
          <div className="ticker-preview-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} className="text-blue" />
              <span>ตัวอย่างการแสดงผลบนหน้าเว็บจริง (Live Simulator):</span>
            </div>
            <div className="ticker-preview-status">
              {settings.enabled ? (
                <span className="status-badge-ok">
                  <span className="live-pulsing-dot" style={{ width: 6, height: 6 }} /> เปิดใช้งาน (Active)
                </span>
              ) : (
                <span className="status-badge-disabled">ปิดการแสดงผลแถบประกาศ</span>
              )}
            </div>
          </div>

          {/* Interactive Marquee Strip */}
          <div 
            className="ticker-sim-bar"
            style={{ 
              backgroundColor: settings.bgColor || '#1e3a8a',
              color: settings.textColor || '#ffffff',
              opacity: settings.enabled ? 1 : 0.4
            }}
          >
            {settings.showLeadBadge !== false && (
              <div 
                className="ticker-sim-lead-pill"
                style={{
                  backgroundColor: settings.leadBadgeBgColor || 'rgba(0, 0, 0, 0.45)',
                  color: settings.leadBadgeTextColor || '#ffffff',
                  borderColor: settings.leadBadgeBorderColor || 'rgba(255, 255, 255, 0.25)'
                }}
              >
                <span 
                  className="live-pulsing-dot" 
                  style={{
                    backgroundColor: settings.leadBadgeDotColor || '#10b981',
                    boxShadow: `0 0 8px ${settings.leadBadgeDotColor || '#10b981'}`
                  }}
                />
                <span>{settings.leadBadgeText || 'GLP LIVE'}</span>
              </div>
            )}

            <div className="ticker-sim-track-wrapper">
              <div 
                className={`ticker-sim-marquee ${settings.pauseOnHover ? 'pause-hover' : ''}`}
                style={{ animationDuration: `${Math.max(12, Number(settings.speed) || 28)}s` }}
              >
                {activeItems.length > 0 ? (
                  <>
                    {activeItems.map((item, idx) => (
                      <span key={`prev-1-${item.id || idx}`} className="ticker-sim-item">
                        {item.badge && (
                          <span 
                            className="ticker-sim-badge"
                            style={{
                              backgroundColor: settings.badgeBgColor || '#ffffff',
                              color: settings.badgeTextColor || '#1d4ed8'
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                        <span className="ticker-sim-text">{item.text}</span>
                        {item.linkTarget && (
                          <span className="ticker-sim-btn">
                            {item.linkText || 'ดูรายละเอียด'} <ArrowRight size={10} />
                          </span>
                        )}
                        <span className="ticker-sim-sep"><Sparkles size={11} /></span>
                      </span>
                    ))}
                    {/* Duplicate for infinite loop */}
                    {activeItems.map((item, idx) => (
                      <span key={`prev-2-${item.id || idx}`} className="ticker-sim-item" aria-hidden="true">
                        {item.badge && (
                          <span 
                            className="ticker-sim-badge"
                            style={{
                              backgroundColor: settings.badgeBgColor || '#ffffff',
                              color: settings.badgeTextColor || '#1d4ed8'
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                        <span className="ticker-sim-text">{item.text}</span>
                        {item.linkTarget && (
                          <span className="ticker-sim-btn">
                            {item.linkText || 'ดูรายละเอียด'} <ArrowRight size={10} />
                          </span>
                        )}
                        <span className="ticker-sim-sep"><Sparkles size={11} /></span>
                      </span>
                    ))}
                  </>
                ) : (
                  <span style={{ color: '#94a3b8', fontStyle: 'italic', padding: '0 20px' }}>
                    ไม่มีรายการประกาศที่เปิดใช้งานอยู่ในขณะนี้ (กรุณาเปิดใช้งานอย่างน้อย 1 รายการ)
                  </span>
                )}
              </div>
            </div>
          </div>
          <small className="ticker-preview-tip">
            * นำเมาส์ไปชี้ที่แถบเพื่อทดสอบการหยุดนิ่ง (Pause on Hover) ตัวอักษรจะวิ่งวนซ้ำแบบไร้รอยต่อ
          </small>
        </div>

        {/* Settings Accordion Panel (Speed, Badges, Colors) */}
        {showSettingsPanel && (
          <div className="ticker-settings-accordion glass-panel" style={{ marginTop: '16px' }}>
            <div className="subcard-title" style={{ fontSize: '0.88rem', marginBottom: '12px' }}>
              <Sliders size={14} className="text-blue" />
              <strong>ปรับแต่งพฤติกรรมการวิ่ง และความสวยงาม</strong>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="checkbox-label" style={{ fontWeight: 600 }}>
                  <input 
                    type="checkbox"
                    checked={settings.enabled !== false}
                    onChange={(e) => {
                      updateTickerSettings({ enabled: e.target.checked });
                      if (typeof triggerSaveToast === 'function') triggerSaveToast();
                    }}
                  />
                  <span>เปิดใช้งานแถบประกาศ (Master Switch)</span>
                </label>
                <small className="form-hint">หากปิดใช้งาน แถบประกาศด้านบนจะไม่แสดงผล</small>
              </div>

              <div className="form-group">
                <label className="checkbox-label" style={{ fontWeight: 600 }}>
                  <input 
                    type="checkbox"
                    checked={settings.pauseOnHover !== false}
                    onChange={(e) => {
                      updateTickerSettings({ pauseOnHover: e.target.checked });
                      if (typeof triggerSaveToast === 'function') triggerSaveToast();
                    }}
                  />
                  <span>หยุดวิ่งเมื่อนำเมาส์ไปชี้ (Pause on Hover)</span>
                </label>
                <small className="form-hint">ช่วยให้อ่านและคลิกลิงก์ง่ายขึ้น</small>
              </div>

              <div className="form-group">
                <label className="checkbox-label" style={{ fontWeight: 600 }}>
                  <input 
                    type="checkbox"
                    checked={settings.showLeadBadge !== false}
                    onChange={(e) => {
                      updateTickerSettings({ showLeadBadge: e.target.checked });
                      if (typeof triggerSaveToast === 'function') triggerSaveToast();
                    }}
                  />
                  <span>แสดงป้ายไฟกระพริบซ้ายมือ (Live Badge)</span>
                </label>
                <small className="form-hint">ป้ายตรึงด้านซ้ายสุด เช่น GLP LIVE</small>
              </div>
            </div>

            <div className="form-row-3" style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>ความเร็วตัวอักษรวิ่ง:</span>
                  <strong style={{ color: '#38bdf8' }}>{settings.speed || 28} วินาที/รอบ</strong>
                </label>
                <input 
                  type="range"
                  min="12"
                  max="60"
                  step="2"
                  value={settings.speed || 28}
                  onChange={(e) => {
                    updateTickerSettings({ speed: Number(e.target.value) });
                    if (typeof triggerSaveToast === 'function') triggerSaveToast();
                  }}
                  className="form-range"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                  <span>วิ่งเร็ว (12s)</span>
                  <span>ปานกลาง (28s)</span>
                  <span>วิ่งช้า (60s)</span>
                </div>
              </div>

              <div className="form-group">
                <label>ข้อความป้ายหัวแถบซ้าย</label>
                <input 
                  type="text"
                  className="form-input"
                  value={settings.leadBadgeText || 'GLP LIVE'}
                  placeholder="เช่น GLP LIVE, ข่าวด่วน"
                  onChange={(e) => {
                    updateTickerSettings({ leadBadgeText: e.target.value });
                    if (typeof triggerSaveToast === 'function') triggerSaveToast();
                  }}
                />
              </div>

              <div className="form-group">
                <label>สีพื้นหลังแถบประกาศ</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="color"
                    value={settings.bgColor || '#1e3a8a'}
                    onChange={(e) => {
                      updateTickerSettings({ bgColor: e.target.value });
                      if (typeof triggerSaveToast === 'function') triggerSaveToast();
                    }}
                    style={{ width: '42px', height: '36px', padding: '2px', borderRadius: '6px', cursor: 'pointer', border: 'none' }}
                  />
                  <input 
                    type="text"
                    className="form-input"
                    value={settings.bgColor || '#1e3a8a'}
                    onChange={(e) => {
                      updateTickerSettings({ bgColor: e.target.value });
                      if (typeof triggerSaveToast === 'function') triggerSaveToast();
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Live Badge Customizer (Colors & Themes) */}
            {settings.showLeadBadge !== false && (
              <div 
                style={{ 
                  marginTop: '16px', 
                  padding: '14px 16px', 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  borderRadius: '10px', 
                  border: '1px solid rgba(255, 255, 255, 0.08)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Palette size={14} style={{ color: '#38bdf8' }} />
                    ปรับแต่งสีป้าย Live ด้านซ้าย ({settings.leadBadgeText || 'GLP LIVE'})
                  </span>
                  
                  {/* Preset Themes */}
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ธีมด่วน:</span>
                    <button
                      type="button"
                      style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
                      onClick={() => {
                        updateTickerSettings({
                          leadBadgeTextColor: '#ffffff',
                          leadBadgeBgColor: 'rgba(0, 0, 0, 0.45)',
                          leadBadgeDotColor: '#10b981',
                          leadBadgeIconColor: '#fbbf24'
                        });
                        if (typeof triggerSaveToast === 'function') triggerSaveToast();
                      }}
                    >
                      🟢 นีออนคลาสสิก
                    </button>
                    <button
                      type="button"
                      style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer' }}
                      onClick={() => {
                        updateTickerSettings({
                          leadBadgeTextColor: '#ffffff',
                          leadBadgeBgColor: 'rgba(239, 68, 68, 0.35)',
                          leadBadgeDotColor: '#ef4444',
                          leadBadgeIconColor: '#ffffff'
                        });
                        if (typeof triggerSaveToast === 'function') triggerSaveToast();
                      }}
                    >
                      🔴 แดงไฟแรง (Hot Live)
                    </button>
                    <button
                      type="button"
                      style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', cursor: 'pointer' }}
                      onClick={() => {
                        updateTickerSettings({
                          leadBadgeTextColor: '#fbbf24',
                          leadBadgeBgColor: 'rgba(0, 0, 0, 0.6)',
                          leadBadgeDotColor: '#f59e0b',
                          leadBadgeIconColor: '#fbbf24'
                        });
                        if (typeof triggerSaveToast === 'function') triggerSaveToast();
                      }}
                    >
                      🟡 ทองพรีเมียม
                    </button>
                    <button
                      type="button"
                      style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', cursor: 'pointer' }}
                      onClick={() => {
                        updateTickerSettings({
                          leadBadgeTextColor: '#e0f2fe',
                          leadBadgeBgColor: 'rgba(14, 165, 233, 0.25)',
                          leadBadgeDotColor: '#38bdf8',
                          leadBadgeIconColor: '#38bdf8'
                        });
                        if (typeof triggerSaveToast === 'function') triggerSaveToast();
                      }}
                    >
                      🔵 ไซเบอร์บลู
                    </button>
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label>สีตัวอักษรป้าย</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="color"
                        value={settings.leadBadgeTextColor && settings.leadBadgeTextColor.startsWith('#') ? settings.leadBadgeTextColor : '#ffffff'}
                        onChange={(e) => {
                          updateTickerSettings({ leadBadgeTextColor: e.target.value });
                          if (typeof triggerSaveToast === 'function') triggerSaveToast();
                        }}
                        style={{ width: '42px', height: '36px', padding: '2px', borderRadius: '6px', cursor: 'pointer', border: 'none' }}
                      />
                      <input 
                        type="text"
                        className="form-input"
                        value={settings.leadBadgeTextColor || '#ffffff'}
                        onChange={(e) => {
                          updateTickerSettings({ leadBadgeTextColor: e.target.value });
                          if (typeof triggerSaveToast === 'function') triggerSaveToast();
                        }}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>สีพื้นหลังป้าย</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="color"
                        value={settings.leadBadgeBgColor && settings.leadBadgeBgColor.startsWith('#') ? settings.leadBadgeBgColor : '#0f172a'}
                        onChange={(e) => {
                          updateTickerSettings({ leadBadgeBgColor: e.target.value });
                          if (typeof triggerSaveToast === 'function') triggerSaveToast();
                        }}
                        style={{ width: '42px', height: '36px', padding: '2px', borderRadius: '6px', cursor: 'pointer', border: 'none' }}
                      />
                      <input 
                        type="text"
                        className="form-input"
                        value={settings.leadBadgeBgColor || 'rgba(0, 0, 0, 0.45)'}
                        onChange={(e) => {
                          updateTickerSettings({ leadBadgeBgColor: e.target.value });
                          if (typeof triggerSaveToast === 'function') triggerSaveToast();
                        }}
                        placeholder="#0f172a หรือ rgba(0,0,0,0.4)"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>สีไฟกระพริบ Live Dot</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="color"
                        value={settings.leadBadgeDotColor && settings.leadBadgeDotColor.startsWith('#') ? settings.leadBadgeDotColor : '#10b981'}
                        onChange={(e) => {
                          updateTickerSettings({ leadBadgeDotColor: e.target.value });
                          if (typeof triggerSaveToast === 'function') triggerSaveToast();
                        }}
                        style={{ width: '42px', height: '36px', padding: '2px', borderRadius: '6px', cursor: 'pointer', border: 'none' }}
                      />
                      <input 
                        type="text"
                        className="form-input"
                        value={settings.leadBadgeDotColor || '#10b981'}
                        onChange={(e) => {
                          updateTickerSettings({ leadBadgeDotColor: e.target.value });
                          if (typeof triggerSaveToast === 'function') triggerSaveToast();
                        }}
                        placeholder="#10b981"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Announcement Items Cards List */}
        <div className="ticker-items-list-box" style={{ marginTop: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f1f5f9' }}>
              รายการข้อความประกาศที่วิ่ง ({items.length} รายการ)
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              * สามารถเลื่อนลำดับด้วยลูกศรขึ้น/ลง เพื่อจัดคิวข้อความที่จะวิ่งก่อน-หลัง
            </span>
          </div>

          <div className="ticker-items-grid">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className={`ticker-item-card glass-panel ${item.active === false ? 'item-disabled' : ''}`}
              >
                {/* Left Priority & Drag handles */}
                <div className="item-order-col">
                  <span className="item-order-pill">#{index + 1}</span>
                  <div className="order-btn-group">
                    <button
                      type="button"
                      className="btn-order-arrow"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      title="เลื่อนขึ้น"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      className="btn-order-arrow"
                      disabled={index === items.length - 1}
                      onClick={() => handleMoveDown(index)}
                      title="เลื่อนลง"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>
                </div>

                {/* Content details */}
                <div className="item-main-content">
                  <div className="item-badge-row">
                    <span className="ticker-card-badge">{item.badge || 'ประกาศ'}</span>
                    {item.linkTarget && (
                      <span className="ticker-card-link-target" title={item.linkTarget}>
                        <ExternalLink size={11} />
                        <span>{item.linkText || item.linkTarget}</span>
                        <code style={{ fontSize: '0.7rem', color: '#64748b' }}>({item.linkTarget})</code>
                      </span>
                    )}
                  </div>

                  <p className="ticker-card-text">
                    {item.text}
                  </p>
                </div>

                {/* Actions column */}
                <div className="item-actions-col">
                  <button
                    type="button"
                    className={`btn-toggle-active ${item.active !== false ? 'active' : ''}`}
                    onClick={() => handleToggleActive(item.id, item.active !== false)}
                    title={item.active !== false ? 'คลิกเพื่อปิดการแสดงผล' : 'คลิกเพื่อเปิดการแสดงผล'}
                  >
                    {item.active !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                    <span>{item.active !== false ? 'เปิดอยู่' : 'ปิด'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn-action-icon edit"
                    onClick={() => handleOpenEdit(item)}
                    title="แก้ไขข้อความประกาศนี้"
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    type="button"
                    className="btn-action-icon delete"
                    onClick={() => handleDelete(item.id, item.text)}
                    title="ลบข้อความประกาศนี้"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add / Edit Announcement Modal */}
      {modalOpen && (
        <div className="staff-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="staff-modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="admin-logo-badge" style={{ width: 34, height: 34, background: '#1d4ed8' }}>
                  <Bell size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#f8fafc' }}>
                    {editingItem ? 'แก้ไขข้อความประกาศวิ่ง' : 'เพิ่มข้อความประกาศวิ่งใหม่'}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    กำหนดป้ายกำกับ ข้อความ และปุ่มลิงก์นำทาง
                  </span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setModalOpen(false)}
                className="btn-action-icon"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              {/* Quick Template Presets for fast selection */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  ⚡ เทมเพลตตัวอย่าง (คลิกเพื่อเติมข้อความด่วน):
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {TEMPLATE_PRESETS.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      className="btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                      onClick={() => {
                        setFormData({
                          badge: tpl.badge,
                          text: tpl.text,
                          linkTarget: tpl.linkTarget,
                          linkText: tpl.linkText,
                          active: true
                        });
                      }}
                    >
                      {tpl.badge}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge Selection & Input */}
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>ป้ายกำกับ (Badge)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {BADGE_PRESETS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      className={`btn-secondary btn-sm ${formData.badge === b ? 'active' : ''}`}
                      style={{ 
                        fontSize: '0.72rem', 
                        padding: '3px 8px',
                        background: formData.badge === b ? '#2563eb' : 'rgba(255,255,255,0.06)',
                        color: formData.badge === b ? '#ffffff' : '#94a3b8'
                      }}
                      onClick={() => setFormData({ ...formData, badge: b })}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <input 
                  type="text"
                  className="form-input"
                  value={formData.badge}
                  placeholder="เช่น ประกาศสำคัญ, ทัวร์นาเมนต์, ข่าวด่วน"
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  required
                />
              </div>

              {/* Announcement Text */}
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>ข้อความประกาศวิ่ง (Text) *</label>
                  <small style={{ color: '#64748b', fontSize: '0.72rem' }}>
                    ความยาว: {formData.text.length} ตัวอักษร
                  </small>
                </div>
                <textarea 
                  className="form-textarea"
                  rows={3}
                  value={formData.text}
                  placeholder="กรอกข้อความข่าวสารหรือประกาศที่ต้องการให้วิ่งบนหน้าเว็บ..."
                  onChange={e => setFormData({ ...formData, text: e.target.value })}
                  required
                />
              </div>

              {/* Link Target & Quick Presets */}
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label>ลิงก์ปลายทางเมื่อผู้ใช้คลิก (Target URL / Path)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {LINK_PRESETS.map((lp) => (
                    <button
                      key={lp.target}
                      type="button"
                      className="btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                      onClick={() => setFormData({ 
                        ...formData, 
                        linkTarget: lp.target,
                        linkText: lp.defaultBtn || formData.linkText
                      })}
                    >
                      {lp.label}
                    </button>
                  ))}
                </div>

                <div className="form-row-2">
                  <div>
                    <input 
                      type="text"
                      className="form-input"
                      value={formData.linkTarget}
                      placeholder="เช่น /tournaments, /franchise, #activities, https://..."
                      onChange={e => setFormData({ ...formData, linkTarget: e.target.value })}
                    />
                    <small className="form-hint">ระบุหน้าภายใน หรือใส่ URL ภายนอกได้</small>
                  </div>

                  <div>
                    <input 
                      type="text"
                      className="form-input"
                      value={formData.linkText}
                      placeholder="ข้อความบนปุ่ม เช่น ดูตารางแข่ง"
                      onChange={e => setFormData({ ...formData, linkText: e.target.value })}
                    />
                    <small className="form-hint">ข้อความปุ่มนำทาง (แสดงต่อท้ายข้อความ)</small>
                  </div>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="checkbox-label" style={{ fontWeight: 600 }}>
                  <input 
                    type="checkbox"
                    checked={formData.active}
                    onChange={e => setFormData({ ...formData, active: e.target.checked })}
                  />
                  <span>เปิดใช้งานข้อความนี้ทันทีหลังบันทึก</span>
                </label>
              </div>

              {/* Footer buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Check size={16} />
                  <span>{editingItem ? 'บันทึกการแก้ไข' : 'เพิ่มประกาศวิ่ง'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
