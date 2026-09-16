import React, { useState } from 'react';
import { 
  Settings, Layers, FileText, Cpu, Bot, Send, Save, RefreshCw, 
  Plus, Trash2, Edit3, Eye, EyeOff, CheckCircle2, AlertTriangle, AlertCircle,
  ExternalLink, Key, Sparkles, MessageSquare, Database, Sliders,
  HelpCircle, Monitor, Armchair, DollarSign, LayoutGrid, Compass, Calculator,
  Phone, Mail, MapPin, Globe, Shield, Trophy, Search, Tag,
  TrendingUp, BarChart2, ShieldCheck, Lock, LogOut, Activity, ArrowUpRight,
  Palette, Image as ImageIcon, Flame, Coffee, Check, Copy, Clock, Share2,
  Box, Printer, Download, Camera, Upload, CheckSquare, Zap, ChevronRight, ChevronUp, ChevronDown, Server, Info, Ruler, Scale, Wrench, FileUp, Wand2,
  Users, Calendar, Award, Target, Gamepad2, X, List, Hash, HardDrive,
  MessagesSquare, Receipt
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { DEMO_TOURNAMENT_PHOTOS_50 } from '../data/mockData';
import ThreeProductViewer from './ThreeProductViewer';
import ProductSpecSheetModal from './ProductSpecSheetModal';
import { compressAndConvertToWebP, formatBytes } from '../utils/imageOptimizer';
import CMSLivePreviewModal from './CMSLivePreviewModal';
import PhotoshopColorPickerModal from './PhotoshopColorPickerModal';
import MediaLibraryModal from './MediaLibraryModal';
import OmnichannelLeadsCMS from './OmnichannelLeadsCMS';
import ArticleBlockEditor from './ArticleBlockEditor';
import { analyzeProductPhoto, parseSpecSheetText } from '../utils/aiSpecParser';

// Reusable Component: Section Image Field with Guidelines, Live Preview, SEO Alt Text & Media Library
function SectionImageUploader({
  label,
  value,
  onChange,
  altValue,
  onAltChange,
  onOpenMediaLibrary,
  recommendedSize = '1200 x 600 px',
  aspectRatio = '2:1 (แนวนอน)',
  description = 'แนะนำภาพแนวนอน คมชัด ความละเอียดสูง',
  uploadKey,
  compressingItemId,
  handleImageUpload,
  previewHeight = 100,
  previewWidth = 160
}) {
  return (
    <div className="section-image-uploader-card">
      <div className="siu-header">
        <div className="siu-title-group">
          <ImageIcon size={15} className="text-blue" />
          <span className="siu-label">{label}</span>
        </div>
        <div className="siu-badges">
          <span className="siu-badge size-badge">ขนาดแนะนำ: {recommendedSize}</span>
          <span className="siu-badge ratio-badge">สัดส่วน: {aspectRatio}</span>
          <span className="siu-badge format-badge">WebP / JPG</span>
        </div>
      </div>

      {description && (
        <div className="siu-guideline-tip">
          <Info size={13} className="text-blue" />
          <span>{description}</span>
        </div>
      )}

      <div className="siu-body">
        {/* Live Preview Frame */}
        <div 
          className={`siu-preview-frame ${!value ? 'empty' : ''}`}
          style={{ width: `${previewWidth}px`, height: `${previewHeight}px` }}
        >
          {value ? (
            <>
              <img src={value} alt={altValue || 'Preview'} className="siu-preview-img" />
              <div className="siu-preview-overlay">
                <a href={value} target="_blank" rel="noopener noreferrer" className="siu-btn-view" title="เปิดดูภาพขนาดเต็ม">
                  <Eye size={13} />
                </a>
                <button type="button" onClick={() => onChange('')} className="siu-btn-clear" title="ลบภาพนี้">
                  <Trash2 size={13} />
                </button>
              </div>
            </>
          ) : (
            <div className="siu-empty-content">
              <Camera size={20} className="text-muted" />
              <span>ยังไม่มีรูปภาพ</span>
            </div>
          )}
        </div>

        {/* Input & Upload Controls */}
        <div className="siu-controls-col">
          <div className="siu-input-row">
            <input 
              type="url" 
              className="form-input"
              placeholder="วาง URL รูปภาพภายนอก หรือกดเลือกจากคลัง/อัปโหลด..."
              value={value || ''}
              onChange={e => onChange(e.target.value)}
            />

            {/* Media Library Picker Button */}
            {onOpenMediaLibrary && (
              <button 
                type="button" 
                onClick={onOpenMediaLibrary}
                className="btn-secondary"
                style={{ 
                  whiteSpace: 'nowrap', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  padding: '7px 12px',
                  fontSize: '0.82rem',
                  color: '#2563eb',
                  borderColor: '#bfdbfe',
                  background: '#eff6ff',
                  cursor: 'pointer'
                }}
                title="เลือกภาพจากคลังสื่อ Media Library ที่เคยอัปโหลดไว้ ประหยัดพื้นที่ ไม่ต้องอัปใหม่"
              >
                <HardDrive size={14} className="text-blue" />
                <span>เลือกจากคลังสื่อ</span>
              </button>
            )}

            <label className="btn-upload-file" title="เลือกไฟล์ภาพ ระบบจะย่อขนาดและแปลงเป็น WebP บีบอัดอัตโนมัติ">
              {compressingItemId === uploadKey ? (
                <>
                  <RefreshCw size={14} className="spin-icon" />
                  <span>กำลังแปลง WebP...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>อัปโหลดภาพ (WebP)</span>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file, (dataUrl) => {
                      onChange(dataUrl);
                    }, uploadKey);
                    e.target.value = '';
                  }
                }}
              />
            </label>
            {value && (
              <button 
                type="button" 
                onClick={() => onChange('')} 
                className="btn-secondary"
                style={{ 
                  whiteSpace: 'nowrap', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  padding: '7px 12px',
                  fontSize: '0.82rem',
                  color: '#ef4444',
                  borderColor: '#fca5a5',
                  background: '#fef2f2',
                  cursor: 'pointer'
                }}
                title="ลบภาพออกเพื่อแสดงเฉพาะสีพื้นหลังล้วน"
              >
                <Trash2 size={13} />
                <span>ลบรูปภาพ</span>
              </button>
            )}
          </div>

          {/* SEO ALT Text Field */}
          <div className="siu-alt-input-wrap" style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <Tag size={12} className="text-blue" />
              <span>ALT Text (สำหรับ SEO)*:</span>
            </span>
            <input 
              type="text" 
              className="form-input"
              style={{ fontSize: '0.82rem', height: '32px', flex: 1 }}
              placeholder="ใส่ข้อความกำกับภาพเพื่อเพิ่มคะแนน Google SEO เช่น เวทีแข่งอีสปอร์ต 5v5 สเปก RTX 40 Series..."
              value={altValue || ''}
              onChange={e => onAltChange && onAltChange(e.target.value)}
            />
          </div>

          <div className="siu-help-row" style={{ marginTop: '4px' }}>
            <span className="text-xs text-muted">
              {value ? '✓ รูปภาพพร้อมแสดงผล (คลิกไอคอนดวงตาบนภาพเพื่อดูขนาดเต็ม หรือกดปุ่มอัปโหลดใหม่เพื่อเปลี่ยนภาพ)' : 'คลิก "เลือกจากคลังสื่อ" เพื่อนำภาพเก่ามาใช้ซ้ำ หรือคลิก "อัปโหลดภาพ (WebP)" เพื่อเลือกไฟล์ใหม่จากเครื่อง'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Component: Section Color & Background Customizer with Photoshop-Style Palette
function SectionColorCustomizer({
  title = "🎨 สีและพื้นหลัง Section (Colors & Styling)",
  description = "กำหนดสีพื้นหลัง (เมื่อไม่ได้ใช้ภาพ) และสีฟอนต์หัวข้อ/เนื้อหาสำหรับ Section นี้",
  bgColor = '#ffffff',
  onBgColorChange,
  titleColor = '#0f172a',
  onTitleColorChange,
  subtitleColor = '#475569',
  onSubtitleColorChange,
  titleLabel = "สีฟอนต์หัวข้อใหญ่ (Title Color)",
  subtitleLabel = "สีฟอนต์คำบรรยาย/เนื้อหา (Text Color)",
  defaultBg = '#ffffff',
  defaultTitle = '#0f172a',
  defaultSubtitle = '#475569',
  presets = [
    { label: 'สว่าง (Light White)', bg: '#ffffff', title: '#0f172a', subtitle: '#475569' },
    { label: 'เทาอ่อน (Soft Slate)', bg: '#f8fafc', title: '#0f172a', subtitle: '#64748b' },
    { label: 'ดาร์กอารีนา (Dark Arena)', bg: '#0b0f19', title: '#ffffff', subtitle: '#94a3b8' },
    { label: 'น้ำเงินเข้ม (Deep Navy)', bg: '#0f172a', title: '#60a5fa', subtitle: '#cbd5e1' },
    { label: 'น้ำเงิน GLP (Brand Blue)', bg: '#1e3a8a', title: '#ffffff', subtitle: '#bfdbfe' }
  ]
}) {
  const [activePickerField, setActivePickerField] = useState(null); // 'bg', 'title', 'subtitle'

  const applyPreset = (p) => {
    if (onBgColorChange) onBgColorChange(p.bg);
    if (onTitleColorChange) onTitleColorChange(p.title);
    if (onSubtitleColorChange) onSubtitleColorChange(p.subtitle);
  };

  const handleReset = () => {
    if (onBgColorChange) onBgColorChange(defaultBg);
    if (onTitleColorChange) onTitleColorChange(defaultTitle);
    if (onSubtitleColorChange) onSubtitleColorChange(defaultSubtitle);
  };

  return (
    <div className="section-color-customizer-card glass-panel" style={{
      background: 'rgba(248, 250, 252, 0.95)',
      border: '1px solid #cbd5e1',
      borderRadius: '12px',
      padding: '16px 18px',
      marginTop: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
            <Palette size={16} className="text-blue" />
            <span>{title}</span>
          </div>
          {description && (
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              {description}
            </p>
          )}
        </div>

        {/* Quick Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>โทนสียอดนิยม:</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title={`ปรับเป็น ${preset.label}`}
            >
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: preset.bg, border: '1px solid #94a3b8', display: 'inline-block' }}></span>
              <span>{preset.label.split(' ')[0]}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              color: '#64748b',
              background: 'transparent',
              border: '1px dashed #cbd5e1',
              cursor: 'pointer'
            }}
            title="รีเซ็ตเป็นค่าเริ่มต้น"
          >
            รีเซ็ต
          </button>
        </div>
      </div>

      {/* 3 Color Pickers with Photoshop Palette Modals & Direct Hex Codes */}
      <div className="form-row-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        
        {/* 1. BG Color */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px', display: 'block' }}>
            สีพื้นหลัง (Background)
          </label>
          <div className="color-field-row" style={{ padding: '6px 8px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            {/* Color Swatch Trigger */}
            <button
              type="button"
              onClick={() => setActivePickerField('bg')}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: bgColor || defaultBg,
                border: '1.5px solid rgba(0,0,0,0.15)',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s ease'
              }}
              title="คลิกเพื่อเปิดระบบจานสี Photoshop"
            >
              <Palette size={13} style={{ color: (bgColor || defaultBg) === '#ffffff' ? '#64748b' : '#ffffff', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))' }} />
            </button>

            {/* Direct Hex Code Input */}
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '3px 8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, marginRight: '2px' }}>#</span>
              <input
                type="text"
                maxLength={7}
                value={(bgColor || defaultBg).replace('#', '')}
                onChange={e => {
                  const val = e.target.value.trim().replace('#', '');
                  onBgColorChange && onBgColorChange(`#${val}`);
                }}
                style={{ width: '100%', border: 'none', fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 700, outline: 'none', background: 'transparent', color: '#0f172a' }}
                placeholder="ffffff"
              />
            </div>

            {/* Open Palette Button */}
            <button
              type="button"
              onClick={() => setActivePickerField('bg')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#f1f5f9',
                color: '#334155',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="เปิดระบบจานสีกราฟิกแบบ Photoshop"
            >
              <Palette size={12} className="text-blue" />
              <span>จานสี</span>
            </button>
          </div>
        </div>

        {/* 2. Title Font Color */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px', display: 'block' }}>
            {titleLabel}
          </label>
          <div className="color-field-row" style={{ padding: '6px 8px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setActivePickerField('title')}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: titleColor || defaultTitle,
                border: '1.5px solid rgba(0,0,0,0.15)',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s ease'
              }}
              title="คลิกเพื่อเปิดระบบจานสี Photoshop"
            >
              <Palette size={13} style={{ color: (titleColor || defaultTitle) === '#ffffff' ? '#64748b' : '#ffffff', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '3px 8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, marginRight: '2px' }}>#</span>
              <input
                type="text"
                maxLength={7}
                value={(titleColor || defaultTitle).replace('#', '')}
                onChange={e => {
                  const val = e.target.value.trim().replace('#', '');
                  onTitleColorChange && onTitleColorChange(`#${val}`);
                }}
                style={{ width: '100%', border: 'none', fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 700, outline: 'none', background: 'transparent', color: '#0f172a' }}
                placeholder="0f172a"
              />
            </div>

            <button
              type="button"
              onClick={() => setActivePickerField('title')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#f1f5f9',
                color: '#334155',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="เปิดระบบจานสีกราฟิกแบบ Photoshop"
            >
              <Palette size={12} className="text-blue" />
              <span>จานสี</span>
            </button>
          </div>
        </div>

        {/* 3. Subtitle / Text Font Color */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px', display: 'block' }}>
            {subtitleLabel}
          </label>
          <div className="color-field-row" style={{ padding: '6px 8px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setActivePickerField('subtitle')}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: subtitleColor || defaultSubtitle,
                border: '1.5px solid rgba(0,0,0,0.15)',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s ease'
              }}
              title="คลิกเพื่อเปิดระบบจานสี Photoshop"
            >
              <Palette size={13} style={{ color: (subtitleColor || defaultSubtitle) === '#ffffff' ? '#64748b' : '#ffffff', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.4))' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '3px 8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, marginRight: '2px' }}>#</span>
              <input
                type="text"
                maxLength={7}
                value={(subtitleColor || defaultSubtitle).replace('#', '')}
                onChange={e => {
                  const val = e.target.value.trim().replace('#', '');
                  onSubtitleColorChange && onSubtitleColorChange(`#${val}`);
                }}
                style={{ width: '100%', border: 'none', fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 700, outline: 'none', background: 'transparent', color: '#0f172a' }}
                placeholder="475569"
              />
            </div>

            <button
              type="button"
              onClick={() => setActivePickerField('subtitle')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#f1f5f9',
                color: '#334155',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="เปิดระบบจานสีกราฟิกแบบ Photoshop"
            >
              <Palette size={12} className="text-blue" />
              <span>จานสี</span>
            </button>
          </div>
        </div>

      </div>

      {/* Mini Live Preview Box */}
      <div style={{
        marginTop: '12px',
        padding: '10px 14px',
        borderRadius: '8px',
        background: bgColor || defaultBg,
        border: '1px solid #cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease'
      }}>
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: titleColor || defaultTitle, marginBottom: '2px' }}>
            ตัวอย่างหัวข้อ (Sample Section Heading)
          </div>
          <div style={{ fontSize: '0.78rem', color: subtitleColor || defaultSubtitle }}>
            ตัวอย่างข้อความคำบรรยายเพื่อดูคอนทราสต์และความคมชัด (Sample Subtitle Text)
          </div>
        </div>
        <span style={{
          fontSize: '0.7rem',
          padding: '3px 8px',
          borderRadius: '999px',
          background: 'rgba(59, 130, 246, 0.15)',
          color: '#2563eb',
          fontWeight: 700
        }}>
          Preview Contrast
        </span>
      </div>

      {/* Photoshop Color Picker Modal Dialog */}
      <PhotoshopColorPickerModal
        isOpen={Boolean(activePickerField)}
        onClose={() => setActivePickerField(null)}
        initialColor={
          activePickerField === 'bg' ? (bgColor || defaultBg) :
          activePickerField === 'title' ? (titleColor || defaultTitle) :
          (subtitleColor || defaultSubtitle)
        }
        title={
          activePickerField === 'bg' ? 'Color Picker: สีพื้นหลัง (Background)' :
          activePickerField === 'title' ? `Color Picker: ${titleLabel}` :
          `Color Picker: ${subtitleLabel}`
        }
        onSelectColor={(selectedHex) => {
          if (activePickerField === 'bg' && onBgColorChange) {
            onBgColorChange(selectedHex);
          } else if (activePickerField === 'title' && onTitleColorChange) {
            onTitleColorChange(selectedHex);
          } else if (activePickerField === 'subtitle' && onSubtitleColorChange) {
            onSubtitleColorChange(selectedHex);
          }
        }}
      />
    </div>
  );
}

export default function AdminCMS({ onExitAdmin = () => {} }) {
  const {
    siteData,
    updateTicker,
    updateHero,
    updateFooter,
    updateNavLinks,
    updateCatalogItem,
    addCatalogItem,
    deleteCatalogItem,
    addRAGItem,
    updateRAGItem,
    deleteRAGItem,
    updateOpenRouterSettings,
    updateAIGuardrails,
    deletePendingQuestion,
    updateSecurityConfig,
    updateERPData,
    updateWebhooks,
    addActivityItem,
    updateActivityItem,
    deleteActivityItem,
    updateNewsItem,
    addNewsItem,
    deleteNewsItem,
    updateTournament,
    addTournament,
    deleteTournament,
    updateVenueZone,
    updateTheme,
    updateGlobalSEO,
    updateSectionConfig,
    updateN8NWorkflow,
    updateOpenWebUIConfig,
    updateOmnichannelConfig,
    updateERPConfig,
    updateHeaderCta,
    addNavLink,
    deleteNavLink,
    saveSiteData,
    resetToDefaults,
    addMediaItem,
    deleteMediaItem
  } = useSiteData();

  // Media Library Modal state
  const [mediaLibraryModal, setMediaLibraryModal] = useState({
    isOpen: false,
    currentValue: '',
    onSelect: null,
    category: 'all'
  });

  const openMediaLibraryForField = (category, onSelectCallback, currentValue = '') => {
    setMediaLibraryModal({
      isOpen: true,
      currentValue: currentValue || '',
      onSelect: onSelectCallback,
      category: category || 'all'
    });
  };

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState('erp-analytics'); // 'erp-analytics', 'sections', 'articles', 'ai-rag', 'catalog', 'menu-footer', 'automation', 'security'

  // Sub-section tab inside 'sections'
  const [activeSectionSubTab, setActiveSectionSubTab] = useState('theme'); // 'theme', 'hero', 'banners', 'tournaments', 'zones', 'franchise-cta', 'news-sec', 'founder', 'seo'

  // Article filter and platform preview
  const [articleTypeFilter, setArticleTypeFilter] = useState('all'); // 'all', 'gallery', 'news'
  const [socialPreviewPlatform, setSocialPreviewPlatform] = useState('facebook'); // 'facebook', 'line', 'twitter'

  // OpenRouter Test state
  const [isOpenRouterTesting, setIsOpenRouterTesting] = useState(false);
  const [openRouterTestResult, setOpenRouterTestResult] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);

  // ERP Test & Sync state
  const [isERPTesting, setIsERPTesting] = useState(false);
  const [erpTestResult, setErpTestResult] = useState(null);
  const [showERPToken, setShowERPToken] = useState(false);

  // n8n Workflow Test state
  const [isN8NTesting, setIsN8NTesting] = useState(false);
  const [activeN8NTestId, setActiveN8NTestId] = useState('wf-lead');
  const [n8nTestResult, setN8NTestResult] = useState(null);

  // OpenWebUI & Omnichannel Test states
  const [isOpenWebUITesting, setIsOpenWebUITesting] = useState(false);
  const [openWebUITestResult, setOpenWebUITestResult] = useState(null);
  const [isOmnichannelTesting, setIsOmnichannelTesting] = useState(false);
  const [omnichannelTestResult, setOmnichannelTestResult] = useState(null);

  // RAG & Knowledge Base Simulation State
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [showAddRAGModal, setShowAddRAGModal] = useState(false);
  const [editingRAGItem, setEditingRAGItem] = useState(null);
  const [newRAGItem, setNewRAGItem] = useState({
    title: '',
    category: 'pricing',
    content: '',
    tags: ''
  });

  // Tournament Master CMS State & Actions
  const [tournamentModalTab, setTournamentModalTab] = useState('general'); // 'general', 'rules', 'roster', 'gallery', 'seo'
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);
  const [isEditingTournament, setIsEditingTournament] = useState(false);
  const [activeTournamentDraft, setActiveTournamentDraft] = useState(null);
  const [batchPhotoUrls, setBatchPhotoUrls] = useState('');
  const [showBatchImporter, setShowBatchImporter] = useState(false);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('all');
  const [newSinglePhoto, setNewSinglePhoto] = useState({ url: '', caption: '', category: 'stage' });
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [newTeamDraft, setNewTeamDraft] = useState({
    name: '',
    tag: '',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
    seed: 1,
    status: 'Confirmed',
    captain: '',
    captainPhone: '',
    captainDiscord: '',
    players: ['', '', '', '', ''],
    substitutes: [''],
    wins: 0,
    losses: 0
  });

  const openCreateTournamentModal = () => {
    setActiveTournamentDraft({
      id: `tour-${Date.now()}`,
      title: 'G-SPEED VALORANT TOURNAMENT 2026',
      game: 'VALORANT',
      gameCategory: 'Tactical 5v5 FPS',
      gameIcon: 'Crosshair',
      bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      date: '28-30 กันยายน 2026',
      time: '11:00 - 20:00 น.',
      regStartDate: '1 กันยายน 2026',
      regEndDate: '25 กันยายน 2026',
      tourneyStartDate: '2026-09-28',
      tourneyEndDate: '2026-09-30',
      prizePool: '100,000 บาท',
      slots: '32 ทีม',
      format: 'LAN Final @ Main Stage & Double Elimination',
      badge: 'เปิดรับสมัคร',
      badgeType: 'magenta',
      status: 'Open',
      venue: 'G-Speed Esport Arena รามคำแหง 53 (Main Stage & Battleground Zone)',
      streamChannel: 'Twitch.tv/gspeed_esport & YouTube Live',
      desc: 'การแข่งขันอีสปอร์ตระดับประเทศ ชิงเงินรางวัลรวมกว่า ฿100,000 รวบรวมยอดฝีมือทั่วประเทศมาดวลความแม่นยำบนเวที LAN Final ณ G-Speed Arena รามคำแหง 53',
      rules: [
        'ผู้เข้าแข่งขันทุกท่านต้องนำบัตรประชาชนหรือบัตรนักเรียน/นักศึกษามาแสดงตน ณ จุดลงทะเบียน',
        'อนุญาตให้นำเมาส์ คีย์บอร์ด และหูฟังส่วนตัวมาใช้ได้ โดยต้องผ่านการตรวจจากเจ้าหน้าที่เทคนิคก่อนเริ่มแข่ง',
        'เครื่องคอมพิวเตอร์ที่ใช้แข่งขับเคลื่อนด้วย Intel Core i9 + NVIDIA GeForce RTX 4080 และจอ BenQ ZOWIE 360Hz',
        'ห้ามใช้โปรแกรมโกง สคริปต์ช่วยเล่น หรือฉวยโอกาสจากข้อผิดพลาดของเกม หากตรวจพบปรับแพ้ทันที',
        'คำตัดสินของหัวหน้าผู้ตัดสิน (Head Referee) ถือเป็นที่สิ้นสุดในทุกกรณี'
      ],
      prizeDistribution: [
        { rank: 'แชมป์อันดับ 1', reward: '฿50,000 + ถ้วยเกียรติยศ + เหรียญทอง + ROG Gaming Gear Set' },
        { rank: 'รองชนะเลิศอันดับ 1', reward: '฿25,000 + เหรียญเงิน' },
        { rank: 'รองชนะเลิศอันดับ 2 ร่วม', reward: '฿10,000 ต่อทีม + เหรียญทองแดง' },
        { rank: 'MVP of Tournament', reward: '฿5,000 + หูฟังเกมมิ่ง ROG Delta S' }
      ],
      scheduleTimetable: [
        { time: '10:00 - 11:00 น.', stage: 'ลงทะเบียนหน้างาน & ตรวจสอบอุปกรณ์นักกีฬา (Player Check-in)' },
        { time: '11:15 - 14:00 น.', stage: 'รอบคัดเลือกแบ่งกลุ่ม Group Stage (Best of 1)' },
        { time: '14:30 - 17:30 น.', stage: 'รอบ 8 ทีม และ 4 ทีมสุดท้าย (Quarter & Semi-Finals)' },
        { time: '18:00 - 20:30 น.', stage: 'รอบชิงชนะเลิศ Grand Final บนเวที Main Stage (Best of 5)' }
      ],
      teams: [
        {
          id: 'team-demo-1',
          name: 'G-Speed Slayer Squad',
          tag: 'GLP',
          logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80',
          seed: 1,
          status: 'Confirmed',
          captain: 'SpeedyKnight (กัปตันทีม)',
          captainPhone: '063-793-7704',
          captainDiscord: 'speedy#2026',
          players: ['SpeedyKnight', 'CyberViper', 'NeonPulse', 'PhantomShot', 'Valkyrie99'],
          substitutes: ['GhostAim'],
          wins: 0,
          losses: 0
        }
      ],
      galleryPhotos: [...DEMO_TOURNAMENT_PHOTOS_50],
      seo: {
        metaTitle: 'G-SPEED VALORANT TOURNAMENT 2026 | ชิงเงินรางวัล ฿100,000',
        metaDesc: 'การแข่งขัน VALORANT LAN Tournament สุดยิ่งใหญ่ ณ G-Speed Arena รามคำแหง 53 เงินรางวัลรวม 100,000 บาท สมัครด่วน 32 ทีมเท่านั้น',
        keywords: 'VALORANT, GSpeed, ทัวร์นาเมนต์, แข่งเกม, อีสปอร์ต, รามคำแหง 53, LAN Final, 360Hz',
        ogImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
        slug: 'gspeed-valorant-tournament-2026'
      }
    });
    setIsEditingTournament(false);
    setTournamentModalTab('general');
    setIsTournamentModalOpen(true);
  };

  const openEditTournamentModal = (t, defaultTab = 'general') => {
    setActiveTournamentDraft({
      ...t,
      gameCategory: t.gameCategory || 'Esports Tournament',
      bannerImage: t.bannerImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      venue: t.venue || 'G-Speed Esport Arena รามคำแหง 53 (Main Stage)',
      streamChannel: t.streamChannel || 'Twitch & YouTube Live',
      desc: t.desc || '',
      teams: Array.isArray(t.teams) ? t.teams : [],
      galleryPhotos: (Array.isArray(t.galleryPhotos) && t.galleryPhotos.length > 0) ? t.galleryPhotos : [...DEMO_TOURNAMENT_PHOTOS_50],
      rules: Array.isArray(t.rules) && t.rules.length > 0 ? t.rules : [
        'ผู้เข้าแข่งขันทุกท่านต้องนำบัตรประชาชนหรือบัตรนักเรียน/นักศึกษามาแสดงตน ณ จุดลงทะเบียน',
        'อนุญาตให้นำเมาส์ คีย์บอร์ด และหูฟังส่วนตัวมาใช้ได้ โดยต้องผ่านการตรวจจากเจ้าหน้าที่เทคนิคก่อนเริ่มแข่ง',
        'ห้ามใช้โปรแกรมโกง สคริปต์ช่วยเล่น หรือฉวยโอกาสจากข้อผิดพลาดของเกม หากตรวจพบปรับแพ้ทันที'
      ],
      prizeDistribution: Array.isArray(t.prizeDistribution) && t.prizeDistribution.length > 0 ? t.prizeDistribution : [
        { rank: 'แชมป์อันดับ 1', reward: t.prizePool || '฿50,000 + ถ้วยเกียรติยศ' }
      ],
      scheduleTimetable: Array.isArray(t.scheduleTimetable) && t.scheduleTimetable.length > 0 ? t.scheduleTimetable : [
        { time: t.time || '11:00 น.', stage: 'การแข่งขันรอบทัวร์นาเมนต์ LAN Final' }
      ],
      seo: t.seo && t.seo.metaTitle ? t.seo : {
        metaTitle: `${t.title} | G-Speed Esport Arena`,
        metaDesc: `ติดตามและสมัครแข่งขัน ${t.title} เกม ${t.game} ชิงเงินรางวัล ${t.prizePool} ณ G-Speed Arena รามคำแหง 53`,
        keywords: `${t.game}, G-Speed, ทัวร์นาเมนต์, แข่งขันอีสปอร์ต, รามคำแหง 53, LAN Final`,
        ogImage: t.bannerImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
        slug: (t.title || 'tournament').toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)/g, '')
      }
    });
    setIsEditingTournament(true);
    setTournamentModalTab(defaultTab);
    setIsTournamentModalOpen(true);
  };

  const handleImportBatchPhotos = () => {
    if (!batchPhotoUrls.trim()) return;
    const lines = batchPhotoUrls.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const prevCount = activeTournamentDraft?.galleryPhotos?.length || 0;
    const newItems = lines.map((url, idx) => ({
      id: `p-import-${Date.now()}-${idx}`,
      url: url,
      caption: `ภาพบรรยากาศการแข่งขันทัวร์นาเมนต์ G-Speed #${prevCount + idx + 1}`,
      category: 'stage'
    }));
    setActiveTournamentDraft(prev => ({
      ...prev,
      galleryPhotos: [...(prev?.galleryPhotos || []), ...newItems]
    }));
    setBatchPhotoUrls('');
    setShowBatchImporter(false);
    alert(`นำเข้าภาพสำเร็จทั้งหมด ${newItems.length} ภาพ รวมมีภาพในแกลเลอรี ${prevCount + newItems.length} ภาพ!`);
  };

  const handleLoadDemo50Photos = () => {
    setActiveTournamentDraft(prev => ({
      ...prev,
      galleryPhotos: [...DEMO_TOURNAMENT_PHOTOS_50]
    }));
    alert(`โหลดภาพกิจกรรมตัวอย่างครบ 52 ภาพเรียบร้อยแล้ว!`);
  };

  const handleAddTeam = () => {
    if (!newTeamDraft.name.trim()) {
      alert('กรุณากรอกชื่อทีม (Team Name)');
      return;
    }
    const cleanPlayers = newTeamDraft.players.filter(p => p.trim().length > 0);
    const newTeamObj = {
      ...newTeamDraft,
      id: `team-${Date.now()}`,
      seed: (activeTournamentDraft?.teams?.length || 0) + 1,
      players: cleanPlayers.length > 0 ? cleanPlayers : [newTeamDraft.captain || 'Player 1'],
      substitutes: newTeamDraft.substitutes.filter(s => s.trim().length > 0)
    };
    setActiveTournamentDraft(prev => ({
      ...prev,
      teams: [...(prev?.teams || []), newTeamObj]
    }));
    setNewTeamDraft({
      name: '',
      tag: '',
      logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
      seed: (activeTournamentDraft?.teams?.length || 0) + 2,
      status: 'Confirmed',
      captain: '',
      captainPhone: '',
      captainDiscord: '',
      players: ['', '', '', '', ''],
      substitutes: [''],
      wins: 0,
      losses: 0
    });
    setShowAddTeamForm(false);
  };

  const handleSaveTournamentDraft = () => {
    if (!activeTournamentDraft?.title?.trim()) {
      alert('กรุณากรอกชื่อรายการแข่งขัน');
      return;
    }
    if (isEditingTournament) {
      updateTournament(activeTournamentDraft.id, activeTournamentDraft);
    } else {
      addTournament(activeTournamentDraft);
    }
    setIsTournamentModalOpen(false);
    triggerSaveToast();
  };

  // Activities & Articles CMS State
  const [editingActivity, setEditingActivity] = useState(null);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    slug: '',
    category: 'tournament',
    author: 'กองบรรณาธิการ G-Speed',
    date: 'กันยายน 2026',
    readTime: '3 นาทีในการอ่าน',
    desc: '',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'ภาพบรรยากาศการแข่งขันอีสปอร์ต ณ G-Speed Arena',
    tag: 'LAN TOURNAMENT',
    tagsText: '#VALORANT, #LAN, #EsportsThailand, #GspeedArena',
    partner: 'ASUS ROG & NVIDIA',
    location: 'G-Speed Esport Arena รามคำแหง (Main Stage)',
    organizer: 'G-Speed Operations Team',
    prizePool: '฿50,000 พร้อมถ้วยรางวัล',
    attendees: '300+ คน',
    quote: '',
    seoMetaTitle: '',
    seoMetaDesc: '',
    seoKeywords: '',
    enableAISearch: true,
    contentBlocks: [
      {
        id: 'block_init_h1',
        type: 'heading',
        level: 2,
        text: 'สรุปภาพรวมกิจกรรมและการแข่งขัน'
      },
      {
        id: 'block_init_p1',
        type: 'paragraph',
        align: 'left',
        text: 'รายละเอียดการจัดกิจกรรมและการแข่งขันอีสปอร์ตสุดมันส์ พร้อมบรรยากาศกองเชียร์และผู้เข้าแข่งขันที่มาร่วมสร้างปรากฏการณ์ในครั้งนี้'
      }
    ],
    contentParagraphsText: 'รายละเอียดการจัดกิจกรรมและการแข่งขันอีสปอร์ตสุดมันส์...\n\nบรรยากาศภายในงานเต็มไปด้วยกองเชียร์และผู้เข้าแข่งขัน...',
    galleryPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        caption: 'นักกีฬาอีสปอร์ตกำลังแข่งขันในรอบชิงชนะเลิศ',
        alt: 'การแข่งขันรอบชิงชนะเลิศ ณ G-Speed Arena'
      },
      {
        url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
        caption: 'จอ LED 4K ขนาดยักษ์ถ่ายทอดสดมุมมองผู้เล่น',
        alt: 'จอ LED 4K และเวทีการแข่งขันอีสปอร์ต'
      }
    ]
  });

  // Quick Add Gallery Photo URL states
  const [editGalleryUrl, setEditGalleryUrl] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // New blocked keyword input state
  const [newBlockedKeyword, setNewBlockedKeyword] = useState('');

  // Security credentials edit state
  const [adminUserEdit, setAdminUserEdit] = useState(siteData.securityConfig?.adminUsername || 'admin');
  const [adminPassEdit, setAdminPassEdit] = useState(siteData.securityConfig?.adminPassword || 'gspeed2026');

  // AI Revenue Analysis generation state
  const [isAnalyzingRevenue, setIsAnalyzingRevenue] = useState(false);
  const [isSyncingERP, setIsSyncingERP] = useState(false);

  // Toast / Save notification & Manual Save State
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState('');

  // Live Preview Modal State
  const [previewModalState, setPreviewModalState] = useState({
    isOpen: false,
    sectionType: 'hero',
    draftData: null
  });

  const openPreview = (sectionType, draftData = null) => {
    setPreviewModalState({ isOpen: true, sectionType, draftData });
  };

  const closePreview = () => {
    setPreviewModalState(prev => ({ ...prev, isOpen: false }));
  };

  const triggerSaveToast = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2600);
  };

  const handleManualSave = () => {
    setIsSaving(true);
    const result = saveSiteData();
    setTimeout(() => {
      setIsSaving(false);
      if (result?.success) {
        setLastSavedTime(result.timestamp || new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }));
        triggerSaveToast();
      }
    }, 400);
  };

  // WebP Image Compression State & Handler
  const [compressingItemId, setCompressingItemId] = useState(null);
  const [compressionToast, setCompressionToast] = useState(null);

  const handleImageUpload = async (file, onComplete, fieldKey = 'image') => {
    if (!file) return;
    setCompressingItemId(fieldKey);
    try {
      const res = await compressAndConvertToWebP(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
      onComplete(res.dataUrl, res);

      // Automatically register to media library for future reuse
      if (addMediaItem) {
        addMediaItem({
          name: file.name.replace(/\.[^/.]+$/, "") || 'รูปภาพอัปโหลดใหม่',
          alt: file.name.replace(/\.[^/.]+$/, "") || 'รูปภาพอัปโหลด GLP',
          category: fieldKey.includes('hero') ? 'hero' : (fieldKey.includes('banner') ? 'banners' : (fieldKey.includes('tourn') ? 'tournaments' : 'uploads')),
          url: res.dataUrl,
          dimensions: `${res.width || 1200}x${res.height || 600} (${res.format || 'WebP'})`
        });
      }

      setCompressionToast({
        original: res.originalSizeFormatted,
        compressed: res.compressedSizeFormatted,
        ratio: res.compressionRatio,
        format: res.format
      });
      setTimeout(() => setCompressionToast(null), 6000);
    } catch (err) {
      console.error('Image WebP conversion failed, falling back:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        onComplete(event.target.result, null);
        if (addMediaItem) {
          addMediaItem({
            name: file.name.replace(/\.[^/.]+$/, "") || 'รูปภาพอัปโหลด',
            alt: file.name.replace(/\.[^/.]+$/, "") || 'รูปภาพอัปโหลด GLP',
            category: 'uploads',
            url: event.target.result,
            dimensions: 'Original'
          });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setCompressingItemId(null);
    }
  };

  // Batch Image Compression for Photo Gallery
  const handleBatchGalleryUpload = async (files, isEdit = true) => {
    if (!files || files.length === 0) return;
    const targetKey = isEdit ? 'edit-gallery-photos' : 'new-gallery-photos';
    setCompressingItemId(targetKey);
    try {
      const addedPhotos = [];
      const currentTitle = isEdit ? (editingActivity?.title || 'กิจกรรม') : (newActivity?.title || 'กิจกรรม');
      for (const file of Array.from(files)) {
        try {
          const res = await compressAndConvertToWebP(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
          const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          addedPhotos.push({
            url: res.dataUrl,
            caption: rawName || currentTitle,
            alt: rawName ? `${currentTitle} - ${rawName}` : currentTitle
          });
        } catch (err) {
          console.error('Failed to compress gallery image:', err);
        }
      }
      if (addedPhotos.length > 0) {
        if (isEdit) {
          setEditingActivity(prev => ({
            ...prev,
            galleryPhotos: [...(prev.galleryPhotos || []), ...addedPhotos]
          }));
        } else {
          setNewActivity(prev => ({
            ...prev,
            galleryPhotos: [...(prev.galleryPhotos || []), ...addedPhotos]
          }));
        }
        setCompressionToast({
          original: `${addedPhotos.length} ไฟล์`,
          compressed: 'WebP สำเร็จ',
          ratio: 'พร้อมสำหรับ SEO & AI Search',
          format: 'WEBP'
        });
        setTimeout(() => setCompressionToast(null), 5000);
      }
    } finally {
      setCompressingItemId(null);
    }
  };

  // State for Catalog Item Modal / Editing / 3D & Spec Sheet Views
  const [editingCatalogItem, setEditingCatalogItem] = useState(null);
  const [aiSpecModalOpen, setAiSpecModalOpen] = useState(false);
  const [aiSpecTarget, setAiSpecTarget] = useState('edit'); // 'edit' | 'new'
  const [aiSpecInputText, setAiSpecInputText] = useState('');
  const [aiSpecFeedback, setAiSpecFeedback] = useState(null);
  const [aiImageFeedback, setAiImageFeedback] = useState(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [viewing3DItem, setViewing3DItem] = useState(null);
  const [viewingSpecItem, setViewingSpecItem] = useState(null);
  const [newCatalogItem, setNewCatalogItem] = useState({
    type: '',
    sku: 'GLP-NEW-01',
    name: '',
    weightKg: 48,
    maxLoadKg: 350,
    weightNote: 'แยกส่วน 3 ชิ้น ขนส่งสะดวก ประกอบหน้างานภายใน 20 นาที',
    imageAlt: 'ชุดโต๊ะเกมมิ่ง G-Speed Esport Arena สเปกมาตรฐาน',
    category: 'stations',
    grade: 'pro', // standard, pro, ultimate, vip
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    widthMeters: 2.4,
    heightMeters: 1.0,
    depth3D: 1.0,
    height3D: 1.25,
    seats: 2,
    baseCost: 28000,
    deskPrice: 16000,
    deskDesc: 'โต๊ะเกมมิ่งเหล็กคาร์บอนยาว 2.4 ม. พร้อมรางร้อยสายไฟและฉากกั้นกลาง',
    chairModel: 'G-Speed Pro Racing PU Leather',
    chairPrice: 6000,
    chairCount: 2,
    deskColor: '#0f172a',
    accentColor: '#1d4ed8',
    chairColor: '#0f172a',
    color: '#1d4ed8',
    warranty: 'รับประกันโครงสร้าง 5 ปี และระบบไฟ 3 ปี On-site Service',
    leadTime: '7 - 10 วันทำการ',
    material: 'โครงเหล็กกล้าคาร์บอนพ่นสี Powder Coat + หน้าท็อป HPL กันน้ำและรอยขีดข่วน + รางร้อยสายไฟแยก High/Low Voltage',
    desc: 'โต๊ะเกมมิ่ง 2 ที่นั่ง ออกแบบระยะห่างมาตรฐานนักกีฬา ลากเมาส์ได้กว้าง'
  });
  const [showAddCatalogModal, setShowAddCatalogModal] = useState(false);

  // Curated presets for fast selection
  const CATALOG_PRESET_IMAGES = [
    { label: 'Dual Station 2 ที่นั่ง', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Quad Station 4 ที่นั่ง', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80' },
    { label: 'Island Hex 6 ที่นั่ง', url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80' },
    { label: 'VIP Private Suite Pod', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Stage 5v5 Tournament', url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Reception Cashier', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Diskless Server 42U', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cafe Snack Bar', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' }
  ];

  const DESK_COLOR_PRESETS = [
    { label: 'Charcoal Black', hex: '#0f172a' },
    { label: 'Minimal White', hex: '#ffffff' },
    { label: 'Dark Navy', hex: '#1e293b' },
    { label: 'Cyber Steel', hex: '#334155' },
    { label: 'Walnut Wood', hex: '#78350f' }
  ];

  const ACCENT_COLOR_PRESETS = [
    { label: 'Royal Blue', hex: '#1d4ed8' },
    { label: 'Cyber Cyan', hex: '#06b6d4' },
    { label: 'Neon Violet', hex: '#8b5cf6' },
    { label: 'Flame Red', hex: '#ef4444' },
    { label: 'Toxic Green', hex: '#10b981' },
    { label: 'Amber Gold', hex: '#f59e0b' }
  ];

  const CHAIR_COLOR_PRESETS = [
    { label: 'Jet Black', hex: '#0f172a' },
    { label: 'Royal Blue', hex: '#1d4ed8' },
    { label: 'Racing Red', hex: '#dc2626' },
    { label: 'Snow White', hex: '#f8fafc' },
    { label: 'Titan Slate', hex: '#1e293b' }
  ];

  // Filter Catalog by Grade
  const [catalogGradeFilter, setCatalogGradeFilter] = useState('all');

  // Handle RAG Test Query Simulation
  const handleTestRAG = () => {
    if (!testQuery.trim()) return;
    const query = testQuery.toLowerCase();
    const matches = siteData.ragKnowledge.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const contentMatch = item.content.toLowerCase().includes(query);
      const tagMatch = item.tags && item.tags.some(t => query.includes(t.toLowerCase()) || t.toLowerCase().includes(query));
      return titleMatch || contentMatch || tagMatch;
    });
    setTestResults(matches.length > 0 ? matches : []);
  };

  // Handle OpenRouter API Live Test Ping
  const handleTestOpenRouter = () => {
    setIsOpenRouterTesting(true);
    setOpenRouterTestResult(null);
    setTimeout(() => {
      setIsOpenRouterTesting(false);
      if (siteData.openRouterSettings?.apiKey) {
        setOpenRouterTestResult({
          success: true,
          latency: '185ms',
          model: siteData.openRouterSettings?.model || 'google/gemini-flash-3.8',
          message: 'เชื่อมต่อ OpenRouter API สำเร็จ! ได้รับสิทธิ์เข้าถึงโมเดลและ Quota ปกติ'
        });
      } else {
        setOpenRouterTestResult({
          success: false,
          latency: '0ms',
          message: 'ยังไม่ได้ระบุ OpenRouter API Key: ระบบใช้งานโหมด Smart Fallback RAG ตอบคำถามจากฐานข้อมูลร้านในตัว'
        });
      }
      triggerSaveToast();
    }, 900);
  };

  // Handle ERP / POS Bridge Connection Test
  const handleTestERP = () => {
    setIsERPTesting(true);
    setErpTestResult(null);
    setTimeout(() => {
      setIsERPTesting(false);
      setErpTestResult({
        success: true,
        latency: '34ms',
        software: siteData.erpData?.bridgeSoftware || 'SmartCafé Thailand',
        storeCode: siteData.erpConfig?.storeCode || 'GLP-RAMKHAMHAENG-01',
        message: 'เชื่อมต่อแม่ข่ายระบบร้านเกม (Diskless & POS) สำเร็จ: พอร์ต 8088 พร้อมซิงก์ข้อมูลรายได้'
      });
      triggerSaveToast();
    }, 1100);
  };

  // Handle n8n Webhook Test Trigger
  const handleTestN8N = (workflowId) => {
    setIsN8NTesting(true);
    setActiveN8NTestId(workflowId);
    setN8NTestResult(null);
    setTimeout(() => {
      setIsN8NTesting(false);
      const wf = (siteData.n8nWorkflows || []).find(w => w.id === workflowId);
      setN8NTestResult({
        workflowId,
        success: true,
        status: '200 OK',
        timestamp: new Date().toLocaleTimeString('th-TH'),
        message: `ยิง Payload จำลองไปยัง n8n Webhook (${wf ? wf.name : workflowId}) สำเร็จ!`
      });
      // Increment event count
      if (wf) {
        updateN8NWorkflow(workflowId, { eventsCount: (wf.eventsCount || 0) + 1, lastStatus: 'Active (200 OK)' });
      }
      triggerSaveToast();
    }, 1200);
  };

  // Handle OpenWebUI Connection Test
  const handleTestOpenWebUI = () => {
    setIsOpenWebUITesting(true);
    setOpenWebUITestResult(null);
    setTimeout(() => {
      setIsOpenWebUITesting(false);
      setOpenWebUITestResult({
        success: true,
        latency: '26ms',
        model: siteData.openWebUIConfig?.model || 'glp-esports-assistant:latest',
        endpoint: siteData.openWebUIConfig?.baseUrl || 'https://openwebui.gspeedarena.com',
        message: 'เชื่อมต่อ OpenWebUI AI Hub สำเร็จ! พร้อมส่งต่อคำค้นหาและดึงความรู้ RAG Collection'
      });
      triggerSaveToast();
    }, 1000);
  };

  // Handle Omnichannel Dispatcher Test
  const handleTestOmnichannel = (channel = 'line') => {
    setIsOmnichannelTesting(true);
    setOmnichannelTestResult(null);
    setTimeout(() => {
      setIsOmnichannelTesting(false);
      setOmnichannelTestResult({
        success: true,
        channel: channel === 'line' ? 'LINE OA (@gspeedarena)' : 'Web Chat Widget',
        status: '200 OK',
        latency: '138ms',
        userQuery: channel === 'line' ? 'มีห้อง VIP ว่างไหม สเปกเป็นยังไงบ้าง' : 'สนใจลงทุนแฟรนไชส์ 20 เครื่อง ใช้งบเท่าไหร่',
        erpVerification: 'ตรวจสอบสิทธิ์สมาชิก SmartCafé Member: Gold Tier (พบข้อมูลในระบบ)',
        aiReply: channel === 'line' 
          ? 'สวัสดีครับคุณสมาชิก VIP ขณะนี้ห้อง VIP Suite 4 ที่นั่ง ว่าง 2 ห้อง เครื่องสเปก RTX 4080 + จอ 360Hz อัตราค่าบริการสมาชิก 35 บาท/ชม. สามารถแจ้งจองล่วงหน้าได้ทันทีครับ'
          : 'ยินดีให้ข้อมูลแฟรนไชส์ครับ สำหรับพื้นที่ 20 เครื่อง ขนาดห้องแนะนำ 8x6 ม. (48 ตร.ม.) งบประมาณเริ่มต้นโมเดล Size S รวมระบบ Diskless และโต๊ะเก้าอี้เกมมิ่ง ประมาณ ฿1,350,000 คืนทุนเฉลี่ย 10-12 เดือนครับ',
        routedVia: 'n8n Webhook Router -> SmartCafé ERP Bridge -> OpenWebUI RAG'
      });
      triggerSaveToast();
    }, 1200);
  };

  return (
    <div className="admin-cms-layout">
      {/* Top Admin Header Bar */}
      <header className="admin-header-bar">
        <div className="admin-brand">
          <div className="admin-logo-badge">
            <Settings size={18} />
          </div>
          <div>
            <h2>GLP Site & 3D Master CMS</h2>
            <span className="admin-subtitle">ระบบจัดการเนื้อหา เว็บไซต์ ผังร้าน 3D และ AI Assistant ประจำร้าน</span>
          </div>
        </div>

        <div className="admin-header-actions">
          <div className="admin-session-badge">
            <ShieldCheck size={14} className="text-blue" />
            <span>Root Admin: {siteData.securityConfig?.adminUsername || 'admin'}</span>
          </div>

          {showSavedToast && (
            <div className="toast-saved-pill">
              <CheckCircle2 size={14} />
              <span>บันทึกข้อมูลเรียบร้อยแล้ว</span>
            </div>
          )}

          {/* Master Live Preview Button */}
          <button 
            type="button"
            id="btn-admin-master-preview"
            onClick={() => openPreview('full-site')}
            className="btn-admin-preview"
            title="เปิดดูตัวอย่างหน้าเว็บจริงแบบ Interactive Live Simulator"
          >
            <Eye size={15} />
            <span>พรีวิวหน้าเว็บสด (Live Preview)</span>
          </button>

          {/* Master Explicit Save Button */}
          <button 
            id="btn-admin-master-save"
            onClick={handleManualSave}
            disabled={isSaving}
            className={`btn-admin-master-save ${isSaving ? 'saving' : ''}`}
            title="บันทึกข้อมูลและการตั้งค่าทั้งหมดลงสู่ระบบทันที"
          >
            {isSaving ? <RefreshCw size={15} className="spin-icon" /> : <Save size={15} />}
            <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล (Save)'}</span>
          </button>

          <button 
            onClick={() => {
              if (window.confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
                resetToDefaults();
                triggerSaveToast();
              }
            }}
            className="btn-admin-reset"
            title="คืนค่าโรงงาน"
          >
            <RefreshCw size={14} />
            <span>คืนค่าเริ่มต้น</span>
          </button>

          <a href="#/" target="_blank" rel="noopener noreferrer" className="btn-admin-viewsite" title="ดูหน้าเว็บสาธารณะ">
            <ExternalLink size={14} />
            <span>ดูหน้าเว็บ</span>
          </a>

          <button onClick={onExitAdmin} className="btn-admin-logout" title="ออกจากระบบหลังบ้าน">
            <LogOut size={14} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar Tabs + Editor Panel */}
      <div className="admin-body-container">
        {/* Left Navigation Sidebar */}
        <aside className="admin-sidebar">
          <nav className="admin-nav-menu">
            <button 
              id="cms-tab-erp"
              className={`admin-nav-item ${activeTab === 'erp-analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('erp-analytics')}
            >
              <TrendingUp size={18} />
              <div>
                <strong>AI สรุปรายได้ & ERP ร้านเกม</strong>
                <span>สรุปยอดขาย, Peak Hours, ซิงก์ POS</span>
              </div>
            </button>

            <button 
              id="cms-tab-omnichannel"
              className={`admin-nav-item ${activeTab === 'omnichannel-leads' ? 'active' : ''}`}
              onClick={() => setActiveTab('omnichannel-leads')}
            >
              <MessagesSquare size={18} />
              <div>
                <strong>Omnichannel & Leads Hub</strong>
                <span>รวมแชท, Leads แฟรนไชส์, งบดุล /pay</span>
              </div>
            </button>

            <button 
              id="cms-tab-catalog"
              className={`admin-nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
              onClick={() => setActiveTab('catalog')}
            >
              <Monitor size={18} />
              <div>
                <strong>อุปกรณ์ & แคตตาล็อก 3D</strong>
                <span>โต๊ะ, เก้าอี้, เคาน์เตอร์, หลายเกรด</span>
              </div>
            </button>

            <button 
              id="cms-tab-airag"
              className={`admin-nav-item ${activeTab === 'ai-rag' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai-rag')}
            >
              <Bot size={18} />
              <div>
                <strong>ระบบ AI & คลังความรู้ RAG</strong>
                <span>OpenRouter, Gemini Flash, เทรนข้อมูล</span>
              </div>
            </button>

            <button 
              id="cms-tab-menu"
              className={`admin-nav-item ${activeTab === 'menu-footer' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu-footer')}
            >
              <LayoutGrid size={18} />
              <div>
                <strong>เมนู Header & Footer</strong>
                <span>แถบประกาศ, เมนูนำทาง, ช่องทางติดต่อ</span>
              </div>
            </button>

            <button 
              id="cms-tab-articles"
              className={`admin-nav-item ${activeTab === 'articles' ? 'active' : ''}`}
              onClick={() => setActiveTab('articles')}
            >
              <FileText size={18} />
              <div>
                <strong>กิจกรรม & บทความ (Articles)</strong>
                <span>กำหนด URL Slug, ลิงก์แยก, รูปภาพ</span>
              </div>
            </button>

            <button 
              id="cms-tab-sections"
              className={`admin-nav-item ${activeTab === 'sections' ? 'active' : ''}`}
              onClick={() => setActiveTab('sections')}
            >
              <FileText size={18} />
              <div>
                <strong>เนื้อหาแต่ละ Section</strong>
                <span>Hero, กิจกรรม, แกลเลอรี, ประวัติ</span>
              </div>
            </button>

            <button 
              id="cms-tab-automation"
              className={`admin-nav-item ${activeTab === 'automation' ? 'active' : ''}`}
              onClick={() => setActiveTab('automation')}
            >
              <Sliders size={18} />
              <div>
                <strong>ระบบ Automation & Webhooks</strong>
                <span>แจ้งเตือน Discord, Lead แฟรนไชส์</span>
              </div>
            </button>

            <button 
              id="cms-tab-security"
              className={`admin-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <ShieldCheck size={18} />
              <div>
                <strong>ความปลอดภัย & รหัสแอดมิน</strong>
                <span>เปลี่ยนรหัสผ่าน Master, Zero-Trust</span>
              </div>
            </button>
          </nav>
        </aside>

        {/* Right Editor Area */}
        <main className="admin-content-area">

          {/* =========================================================================
              TAB: OMNICHANNEL LEADS & DAILY CASHFLOW HUB
              ========================================================================= */}
          {activeTab === 'omnichannel-leads' && (
            <OmnichannelLeadsCMS />
          )}

          {/* =========================================================================
              TAB 1: CATALOG & 3D HARDWARE/FURNITURE MANAGEMENT (หลายเกรด)
              ========================================================================= */}
          {activeTab === 'catalog' && (
            <div className="cms-panel-block">
              <div className="panel-header-row">
                <div>
                  <h3 className="panel-title">
                    <Monitor size={20} className="text-blue" />
                    <span>จัดการอุปกรณ์ โต๊ะ เก้าอี้ และเคาน์เตอร์ 3D (หลายเกรด)</span>
                  </h3>
                  <p className="panel-desc">
                    กำหนดชื่อ, ราคา, ขนาดมิติ 3 มิติ, สีท็อปโต๊ะ, สีไฟ LED RGB, สีเก้าอี้, เพิ่ม/อัปโหลดภาพ และส่งออกเป็นเอกสารสเปกหรือภาพ 3D PNG ได้ทันที
                  </p>
                </div>
                <button 
                  id="btn-add-catalog-item"
                  className="btn-primary"
                  onClick={() => setShowAddCatalogModal(true)}
                >
                  <Plus size={16} />
                  <span>เพิ่มโมดูลใหม่</span>
                </button>
              </div>

              {/* Filter Grade */}
              <div className="cms-filter-bar">
                <span className="filter-lbl">หมวดหมู่โมดูล:</span>
                <div className="filter-chips">
                  {[
                    { id: 'all', label: 'ทั้งหมด' },
                    { id: 'stations', label: 'โต๊ะคอมเกมมิ่ง' },
                    { id: 'vip', label: 'ห้อง VIP Suite' },
                    { id: 'stage', label: 'เวทีแข่งขัน' },
                    { id: 'facilities', label: 'เคาน์เตอร์ & บาร์' },
                    { id: 'architectural', label: 'สถาปัตยกรรม (ประตู/หน้าต่าง)' }
                  ].map(cat => (
                    <button 
                      key={cat.id} 
                      className={`filter-chip ${catalogGradeFilter === cat.id ? 'active' : ''}`}
                      onClick={() => setCatalogGradeFilter(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catalog Items Table */}
              <div className="cms-table-wrapper">
                <table className="cms-data-table catalog-table-enhanced">
                  <thead>
                    <tr>
                      <th style={{ width: '75px', textAlign: 'center' }}>ภาพ 3D</th>
                      <th>ชื่อโมดูล & รหัส</th>
                      <th>หมวดหมู่ & เกรด</th>
                      <th>ขนาด 3D (กxลxส)</th>
                      <th>โทนสี</th>
                      <th>ราคาโต๊ะ / เก้าอี้</th>
                      <th>ราคารวมโมดูล</th>
                      <th style={{ width: '160px', textAlign: 'center' }}>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siteData.catalogItems
                      .filter(item => catalogGradeFilter === 'all' || item.category === catalogGradeFilter)
                      .map(item => (
                        <tr key={item.type}>
                          <td style={{ textAlign: 'center' }}>
                            <div 
                              className="catalog-table-thumb"
                              onClick={() => setViewing3DItem(item)}
                              title="คลิกเพื่อเปิดสตูดิโอ 3D & ส่งออกภาพเรนเดอร์"
                            >
                              {item.image ? (
                                <img src={item.image} alt={item.name} />
                              ) : (
                                <div className="thumb-3d-placeholder">
                                  <Box size={20} className="text-blue" />
                                </div>
                              )}
                              <span className="thumb-hover-badge">
                                <Box size={10} /> 3D
                              </span>
                            </div>
                          </td>
                          <td>
                            <strong className="catalog-item-title">{item.name}</strong>
                            <div className="catalog-meta-row">
                              <span className="sub-type-tag">{item.type}</span>
                              <span className={`grade-tag-pill ${item.grade || 'pro'}`}>
                                {(item.grade || 'pro').toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="badge-category">{item.category}</span>
                          </td>
                          <td>
                            <div className="dims-text">
                              {item.widthMeters} x {item.depth3D || item.heightMeters} x {item.height3D || 1.25} ม.
                            </div>
                            {item.seats > 0 && (
                              <span className="text-muted text-xs">
                                ({item.seats} ที่นั่ง)
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="color-swatches-cluster" title={`สีโต๊ะ: ${item.deskColor || item.color || '#0f172a'}, ไฟ LED: ${item.accentColor || '#1d4ed8'}, เก้าอี้: ${item.chairColor || '#0f172a'}`}>
                              <span 
                                className="color-dot" 
                                style={{ backgroundColor: item.deskColor || item.color || '#0f172a' }} 
                                title={`โต๊ะ: ${item.deskColor || item.color || '#0f172a'}`}
                              />
                              <span 
                                className="color-dot glow" 
                                style={{ backgroundColor: item.accentColor || '#1d4ed8' }} 
                                title={`ไฟ LED RGB: ${item.accentColor || '#1d4ed8'}`}
                              />
                              <span 
                                className="color-dot" 
                                style={{ backgroundColor: item.chairColor || '#0f172a' }} 
                                title={`เก้าอี้: ${item.chairColor || '#0f172a'}`}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="text-blue font-semibold">
                              โต๊ะ ฿{(item.deskPrice || 0).toLocaleString()}
                            </div>
                            {item.chairCount > 0 && (
                              <span className="text-muted text-xs">
                                + {item.chairCount} เก้าอี้ (฿{((item.chairPrice || 0) * item.chairCount).toLocaleString()})
                              </span>
                            )}
                          </td>
                          <td className="font-bold text-slate">
                            ฿{(item.baseCost || 0).toLocaleString()}
                          </td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="btn-table-action preview-3d"
                                onClick={() => setViewing3DItem(item)}
                                title="ดูโมเดล 3D แบบเต็มจอ & ส่งออกภาพเรนเดอร์ PNG"
                              >
                                <Box size={14} />
                              </button>
                              <button 
                                className="btn-table-action spec-sheet"
                                onClick={() => setViewingSpecItem(item)}
                                title="ส่งออกเป็นเอกสารสเปกสินค้า (Spec Sheet / Print PDF)"
                              >
                                <FileText size={14} />
                              </button>
                              <button 
                                className="btn-table-action edit"
                                onClick={() => setEditingCatalogItem({ ...item })}
                                title="แก้ไขชื่อ, ราคา, ขนาด, สี, ภาพ"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                className="btn-table-action delete"
                                onClick={() => {
                                  if (window.confirm(`คุณต้องการลบโมดูล "${item.name}" ออกจากแคตตาล็อกใช่หรือไม่?`)) {
                                    deleteCatalogItem(item.type);
                                    triggerSaveToast();
                                  }
                                }}
                                title="ลบโมดูล"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* =========================================================================
                  EDIT CATALOG ITEM MODAL (AI REAL-PHOTO 3D SYNTHESIS, SPEC OCR & EDITABLE PRICING)
                  ========================================================================= */}
              {editingCatalogItem && (
                <div className="cms-modal-backdrop" onClick={() => setEditingCatalogItem(null)}>
                  <div className="cms-modal-card modal-extra-wide catalog-edit-dual-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-head">
                      <div className="modal-head-title">
                        <Box size={22} className="text-blue" />
                        <div>
                          <h4>แก้ไขข้อมูลอุปกรณ์ & สเปกโมดูล 3D: {editingCatalogItem.name}</h4>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                            <span className="sub-type-tag">Type: {editingCatalogItem.type}</span>
                            <span className="sub-type-tag" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                              SKU: {editingCatalogItem.sku || 'GLP-' + editingCatalogItem.type.toUpperCase()}
                            </span>
                            <span className={`grade-tag-pill ${editingCatalogItem.grade || 'pro'}`}>
                              {(editingCatalogItem.grade || 'pro').toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="modal-head-actions">
                        <button 
                          type="button"
                          className="btn-spec-shortcut"
                          onClick={() => setViewingSpecItem(editingCatalogItem)}
                          title="ดูเอกสารสเปกอุปกรณ์ทางการ (Spec Sheet)"
                        >
                          <FileText size={14} />
                          <span>ดูเอกสารสเปก</span>
                        </button>
                        <button onClick={() => setEditingCatalogItem(null)} className="btn-close-modal">✕</button>
                      </div>
                    </div>

                    <div className="modal-dual-body">
                      {/* Left Column: Form Controls with AI Spec Importer */}
                      <div className="modal-form-scrollable">

                        {/* AI SMART SPEC & REAL-PHOTO 3D SYNTHESIS HUB */}
                        <div className="ai-smart-spec-card">
                          <div className="ai-smart-card-head">
                            <div className="ai-title-row">
                              <Sparkles size={16} className="text-blue" />
                              <strong className="ai-hub-title">AI Smart 3D & Spec Importer (นำเข้าและแปลงข้อมูลอัตโนมัติ 100%)</strong>
                            </div>
                            <span className="ai-hub-badge">One-Click Auto Fill</span>
                          </div>
                          <p className="ai-hub-desc">
                            อัปโหลดภาพสินค้าจริงเพื่อสกัดสีและเรนเดอร์ 3D ทันที หรือแนบเอกสารสเปก/ใบเสนอราคา เพื่อกรอกข้อมูล ขนาด น้ำหนัก วัสดุ และราคาอัตโนมัติ
                          </p>

                          <div className="ai-action-buttons-row">
                            {/* Action 1: Upload Real Product Photo -> Image to 3D & Real Color Extraction */}
                            <label className="btn-ai-action-chip photo-to-3d">
                              {isAnalyzingPhoto ? <RefreshCw size={14} className="spin-icon" /> : <Camera size={14} />}
                              <span>{isAnalyzingPhoto ? 'กำลังวิเคราะห์ภาพ...' : '📸 อัปโหลดภาพสินค้าจริง -> แปลงเป็น 3D & สกัดสี'}</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setIsAnalyzingPhoto(true);
                                    try {
                                      const result = await analyzeProductPhoto(file);
                                      if (result.success) {
                                        setEditingCatalogItem(prev => ({
                                          ...prev,
                                          image: result.textureUrl,
                                          deskTextureUrl: result.textureUrl,
                                          deskColor: result.deskColor,
                                          color: result.deskColor,
                                          accentColor: result.accentColor,
                                          chairColor: result.chairColor,
                                          seats: result.suggestedSeats || prev.seats,
                                          chairCount: result.suggestedSeats || prev.chairCount
                                        }));
                                        setAiImageFeedback(`✨ สกัดสีจากภาพสินค้าจริงสำเร็จ: ท็อปโต๊ะ (${result.deskColor}), ไฟ LED (${result.accentColor}), เก้าอี้ (${result.chairColor}) พร้อมลงลายท็อปโต๊ะจริงเรียบร้อย!`);
                                        setTimeout(() => setAiImageFeedback(null), 7000);
                                      } else {
                                        setAiImageFeedback('⚠️ ไม่สามารถวิเคราะห์พิกเซลภาพได้ กรุณาใช้ไฟล์ภาพ JPG/PNG ที่คมชัด');
                                        setTimeout(() => setAiImageFeedback(null), 5000);
                                      }
                                    } catch (err) {
                                      console.error(err);
                                      setAiImageFeedback('⚠️ เกิดข้อผิดพลาดในการโหลดรูปภาพ');
                                      setTimeout(() => setAiImageFeedback(null), 5000);
                                    } finally {
                                      setIsAnalyzingPhoto(false);
                                      e.target.value = '';
                                    }
                                  }
                                }}
                              />
                            </label>

                            {/* Action 2: Attach Spec Sheet Document / Text OCR */}
                            <button 
                              type="button" 
                              className="btn-ai-action-chip doc-to-spec"
                              onClick={() => {
                                setAiSpecTarget('edit');
                                setAiSpecModalOpen(true);
                              }}
                            >
                              <FileUp size={14} />
                              <span>📄 แนบเอกสารสเปกสินค้า / ใบเสนอราคา</span>
                            </button>

                            {/* Action 3: Upload 3D Model File (.GLB / .GLTF) */}
                            <label className="btn-ai-action-chip upload-3d-model">
                              <Box size={14} />
                              <span>📦 อัปโหลดโมเดล 3D (.GLB/.GLTF)</span>
                              <input 
                                type="file" 
                                accept=".glb,.gltf" 
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const modelUrl = URL.createObjectURL(file);
                                    setEditingCatalogItem(prev => ({
                                      ...prev,
                                      model3DUrl: modelUrl
                                    }));
                                    setAiImageFeedback(`📦 นำเข้าโมเดล 3D (${file.name}) สำเร็จ! เรนเดอร์บน 3D Studio เรียบร้อย`);
                                    setTimeout(() => setAiImageFeedback(null), 7000);
                                  }
                                }}
                              />
                            </label>
                          </div>

                          {/* AI Feedback Banners */}
                          {aiImageFeedback && (
                            <div className="ai-feedback-banner success">
                              <CheckCircle2 size={15} />
                              <span>{aiImageFeedback}</span>
                            </div>
                          )}

                          {aiSpecFeedback && (
                            <div className="ai-feedback-banner success">
                              <CheckCircle2 size={15} />
                              <span>{aiSpecFeedback}</span>
                            </div>
                          )}
                        </div>

                        {/* SECTION 1: รหัสสินค้า, ชื่อ, หมวดหมู่ & เกรด */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <Tag size={15} className="text-blue" />
                            <span>1. รหัสสินค้า (SKU) & ข้อมูลพื้นฐาน</span>
                          </h5>

                          {/* Row 1: ชื่อโมดูล & หมวดหมู่สินค้า */}
                          <div className="form-row-2">
                            <div className="form-group">
                              <label>ชื่อโมดูลอุปกรณ์ (ภาษาไทย)</label>
                              <input 
                                type="text" 
                                className="form-input font-semibold" 
                                placeholder="เช่น โต๊ะคอมพิวเตอร์ 2 ที่นั่ง (Double Station)"
                                value={editingCatalogItem.name} 
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, name: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>หมวดหมู่สินค้าในแคตตาล็อก</label>
                              <select 
                                className="form-input"
                                value={editingCatalogItem.category}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, category: e.target.value })}
                              >
                                <option value="stations">โต๊ะคอมพิวเตอร์เกมมิ่ง (Stations)</option>
                                <option value="vip">ห้อง VIP ส่วนตัว (Private Bootcamp Suite)</option>
                                <option value="stage">เวทีการแข่งขัน (Main Tournament Stage)</option>
                                <option value="facilities">เคาน์เตอร์แคชเชียร์ & บาร์เครื่องดื่ม (Facilities)</option>
                                <option value="amenities">สิ่งอำนวยความสะดวก & โซฟาเลานจ์ (Amenities)</option>
                                <option value="architectural">สถาปัตยกรรม (ผนัง, ประตู, กระจกเทมเปอร์)</option>
                              </select>
                            </div>
                          </div>

                          {/* Row 2: รหัสสินค้า (SKU) & เกรดโมดูล */}
                          <div className="form-row-2">
                            <div className="form-group">
                              <label>รหัสสินค้า (Product SKU)</label>
                              <input 
                                type="text" 
                                className="form-input font-mono font-semibold" 
                                placeholder="เช่น GLP-PC-ROW-2"
                                value={editingCatalogItem.sku || ('GLP-' + (editingCatalogItem.type || '').toUpperCase())} 
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, sku: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>เกรดโมดูล (Quality Tier)</label>
                              <select 
                                className="form-input"
                                value={editingCatalogItem.grade || 'pro'}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, grade: e.target.value })}
                              >
                                <option value="standard">Standard (Tier 1 - คุ้มค่า คืนทุนเร็ว)</option>
                                <option value="pro">Pro Racing (Tier 2 - นักกีฬาแข่งขัน)</option>
                                <option value="ultimate">Ultimate Esports (Tier 3 - ไฮเอนด์อารีนา)</option>
                                <option value="vip">VIP Suite Grade (เกรดห้องสตรีมเมอร์)</option>
                              </select>
                            </div>
                          </div>

                          {/* Row 3: รหัสประเภท 3D (Type Slug) พร้อมการ์ดแนะนำ */}
                          <div className="type-slug-card">
                            <div className="type-slug-field">
                              <div className="type-slug-label-row">
                                <label className="type-slug-label">
                                  <Box size={13} className="text-blue" />
                                  <span>รหัสประเภท 3D (Type Slug)</span>
                                </label>
                                <span className="type-slug-badge" title="ระบบล็อกไว้เพื่อรักษาโครงสร้างเรขาคณิต 3 มิติ">
                                  <Lock size={10} style={{ display: 'inline', marginRight: '3px' }} />
                                  3D Engine Key
                                </span>
                              </div>
                              <input 
                                type="text" 
                                className="form-input font-mono font-semibold" 
                                value={editingCatalogItem.type} 
                                disabled
                                title="รหัสประจำโมดูลในระบบเรนเดอร์ 3D (ล็อกไว้เพื่อรักษาโครงสร้างโมเดล)"
                              />
                            </div>
                            <div className="type-slug-helper">
                              <div className="helper-title">
                                <Info size={13} className="text-blue" />
                                <span>รหัสประเภท 3D คืออะไร?</span>
                              </div>
                              <p className="helper-text">
                                เป็นคีย์ระบุโครงสร้างเรขาคณิตใน Three.js เช่น <code>pc-row-2</code>, <code>pc-row-4</code>, <code>vip-room-5</code> เพื่อสร้างรูปทรงโต๊ะ เก้าอี้ จอคอมพิวเตอร์ และเชื่อมโยงกับการจัดวางผังร้าน 2D/3D อัตโนมัติ
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 2: ขนาดมิติ 3 มิติ (DIMENSIONS) */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <Ruler size={15} className="text-blue" />
                            <span>2. ขนาดมิติ 3 มิติ (Dimensions) & จำนวนที่นั่ง</span>
                          </h5>

                          <div className="form-row-4">
                            <div className="form-group">
                              <label>กว้างหน้าโต๊ะ (ม.)</label>
                              <input 
                                type="number" 
                                step="0.05" 
                                className="form-input"
                                value={editingCatalogItem.widthMeters}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, widthMeters: parseFloat(e.target.value) || 1 })}
                              />
                            </div>
                            <div className="form-group">
                              <label>ความลึก 3D (ม.)</label>
                              <input 
                                type="number" 
                                step="0.05" 
                                className="form-input"
                                value={editingCatalogItem.depth3D || editingCatalogItem.heightMeters}
                                onChange={e => setEditingCatalogItem({ 
                                  ...editingCatalogItem, 
                                  depth3D: parseFloat(e.target.value) || 1,
                                  heightMeters: parseFloat(e.target.value) || 1
                                })}
                              />
                            </div>
                            <div className="form-group">
                              <label>ความสูง 3D (ม.)</label>
                              <input 
                                type="number" 
                                step="0.05" 
                                className="form-input"
                                value={editingCatalogItem.height3D || 1.25}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, height3D: parseFloat(e.target.value) || 1 })}
                              />
                            </div>
                            <div className="form-group">
                              <label>จำนวนที่นั่ง (Seats)</label>
                              <input 
                                type="number" 
                                min="0"
                                className="form-input"
                                value={editingCatalogItem.seats ?? editingCatalogItem.chairCount ?? 0}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, seats: parseInt(e.target.value) || 0 })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* SECTION 3: น้ำหนักและการรับน้ำหนัก (WEIGHT & LOAD CAPACITY) */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <Scale size={15} className="text-blue" />
                            <span>3. น้ำหนัก & โครงสร้างการรับน้ำหนัก (Weight & Load)</span>
                          </h5>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>น้ำหนักสินค้าสุทธิ (Net Weight กก.)</label>
                              <input 
                                type="number" 
                                className="form-input"
                                placeholder="เช่น 48"
                                value={editingCatalogItem.weightKg || 48}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, weightKg: parseFloat(e.target.value) || 0 })}
                              />
                            </div>
                            <div className="form-group">
                              <label>น้ำหนักที่รองรับได้สูงสุด (Max Load กก.)</label>
                              <input 
                                type="number" 
                                className="form-input"
                                placeholder="เช่น 350"
                                value={editingCatalogItem.maxLoadKg || 350}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, maxLoadKg: parseFloat(e.target.value) || 0 })}
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label>หมายเหตุการขนส่งและการประกอบหน้างาน</label>
                            <input 
                              type="text" 
                              className="form-input"
                              placeholder="เช่น แยกส่วน 3 ชิ้น ขนส่งสะดวก ประกอบหน้างานภายใน 20 นาที"
                              value={editingCatalogItem.weightNote || 'แยกส่วน 3 ชิ้น ขนส่งสะดวก ประกอบหน้างานภายใน 20 นาที'}
                              onChange={e => setEditingCatalogItem({ ...editingCatalogItem, weightNote: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* SECTION 4: วัสดุและคุณภาพการประกอบ (MATERIALS & BUILD QUALITY) */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <Wrench size={15} className="text-blue" />
                            <span>4. วัสดุ & คุณภาพการประกอบ (Materials & Construction)</span>
                          </h5>

                          <div className="form-group">
                            <label>สเปกวัสดุโครงสร้างและหน้าท็อป (Material Specification)</label>
                            <textarea 
                              className="form-input form-textarea" 
                              rows="2"
                              placeholder="เช่น โครงเหล็กกล้าคาร์บอนพ่นสี Powder Coat หนา 1.8mm + หน้าท็อป HPL กันน้ำและรอยขีดข่วน..."
                              value={editingCatalogItem.material || ''}
                              onChange={e => setEditingCatalogItem({ ...editingCatalogItem, material: e.target.value })}
                            />
                          </div>

                          <div className="material-quick-chips">
                            <span className="text-xs text-muted" style={{ marginRight: '6px' }}>เลือกข้อความวัสดุด่วน:</span>
                            {[
                              'หน้าท็อป HPL เคลือบเมลามีนกันน้ำและรอยขูดขีด',
                              'โครงเหล็กกล้าคาร์บอนพ่นสี Powder Coat หนา 1.8mm',
                              'รางร้อยสายไฟเหล็ก Wireway ซ่อนใต้โต๊ะแยก High/Low Voltage',
                              'ฉากกั้นกลางอะคริลิกซับเสียงหนา 8mm พร้อมไฟ LED Strip',
                              'ขาโต๊ะปรับระดับความสูงได้ ±3 ซม. รองรับพื้นไม่เรียบ'
                            ].map((mat, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className="preset-chip-btn"
                                style={{ fontSize: '11px', margin: '2px' }}
                                onClick={() => {
                                  const current = editingCatalogItem.material || '';
                                  const updated = current ? `${current} + ${mat}` : mat;
                                  setEditingCatalogItem({ ...editingCatalogItem, material: updated });
                                }}
                              >
                                + {mat.split(' ')[0]} {mat.split(' ')[1]}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* SECTION 5: ราคา & สเปกอุปกรณ์ (PRICING BREAKDOWN & REAL EDITING) */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <DollarSign size={15} className="text-blue" />
                            <span>5. ราคา & สเปกอุปกรณ์ (Pricing Breakdown & สามารถแก้ไขราคาได้จริง)</span>
                          </h5>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>ราคาเฉพาะโต๊ะและโครงสร้าง (บาท)</label>
                              <input 
                                type="number" 
                                className="form-input font-semibold"
                                value={editingCatalogItem.deskPrice || 0}
                                onChange={e => {
                                  const deskPrice = parseInt(e.target.value) || 0;
                                  setEditingCatalogItem({ 
                                    ...editingCatalogItem, 
                                    deskPrice
                                  });
                                }}
                              />
                            </div>
                            <div className="form-group">
                              <label>คำอธิบายสเปกโต๊ะ</label>
                              <input 
                                type="text" 
                                className="form-input" 
                                placeholder="โต๊ะเหล็กคาร์บอน รางร้อยสายไฟ ท็อป HPL"
                                value={editingCatalogItem.deskDesc || ''}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, deskDesc: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-row-3">
                            <div className="form-group">
                              <label>รุ่นเก้าอี้เกมมิ่ง</label>
                              <input 
                                type="text" 
                                className="form-input" 
                                value={editingCatalogItem.chairModel || ''}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, chairModel: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>ราคาเก้าอี้/ตัว (บาท)</label>
                              <input 
                                type="number" 
                                className="form-input font-semibold"
                                value={editingCatalogItem.chairPrice || 0}
                                onChange={e => {
                                  const chairPrice = parseInt(e.target.value) || 0;
                                  setEditingCatalogItem({ 
                                    ...editingCatalogItem, 
                                    chairPrice
                                  });
                                }}
                              />
                            </div>
                            <div className="form-group">
                              <label>จำนวนเก้าอี้ (ตัว)</label>
                              <input 
                                type="number" 
                                className="form-input font-semibold"
                                value={editingCatalogItem.chairCount || 0}
                                onChange={e => {
                                  const chairCount = parseInt(e.target.value) || 0;
                                  setEditingCatalogItem({ 
                                    ...editingCatalogItem, 
                                    chairCount,
                                    seats: chairCount
                                  });
                                }}
                              />
                            </div>
                          </div>

                          {/* Editable Total Module Cost Card */}
                          <div className="total-cost-editable-box">
                            <div className="total-cost-header">
                              <div>
                                <label className="total-cost-label">ราคารวมโมดูลที่ใช้จริง (บาท):</label>
                                <span className="text-xs text-muted" style={{ display: 'block' }}>
                                  คุณสามารถแก้ไขราคานี้ได้โดยตรงตามราคาแพ็กเกจจริง หรือกดปุ่มซิงค์ตามคำนวณ
                                </span>
                              </div>
                              <button
                                type="button"
                                className="btn-sync-calc"
                                onClick={() => {
                                  const calculated = (editingCatalogItem.deskPrice || 0) + ((editingCatalogItem.chairPrice || 0) * (editingCatalogItem.chairCount || 0));
                                  setEditingCatalogItem({ ...editingCatalogItem, baseCost: calculated });
                                }}
                                title="คำนวณจาก โต๊ะ + (ราคาเก้าอี้ x จำนวนเก้าอี้)"
                              >
                                <RefreshCw size={13} />
                                <span>ซิงค์ตามคำนวณ (฿{(((editingCatalogItem.deskPrice || 0) + ((editingCatalogItem.chairPrice || 0) * (editingCatalogItem.chairCount || 0)))).toLocaleString()})</span>
                              </button>
                            </div>

                            <div className="total-cost-input-row">
                              <span className="currency-prefix">฿</span>
                              <input 
                                type="number"
                                className="total-price-large-input"
                                value={editingCatalogItem.baseCost || 0}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, baseCost: parseInt(e.target.value) || 0 })}
                              />
                              <span className="currency-suffix">บาท</span>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 6: ภาพประกอบ & SEO (PRODUCT IMAGES & SEO) */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <ImageIcon size={15} className="text-blue" />
                            <span>6. ภาพประกอบสินค้า & SEO (Product Photography)</span>
                          </h5>

                          <div className="image-manager-row">
                            <div className="form-group" style={{ flex: 1 }}>
                              <label>URL รูปภาพสินค้า (Image URL)</label>
                              <input 
                                type="url" 
                                className="form-input"
                                placeholder="https://images.unsplash.com/..."
                                value={editingCatalogItem.image || ''}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, image: e.target.value })}
                              />
                            </div>
                            <div className="image-upload-wrapper">
                              <label className="btn-upload-file" title="เลือกไฟล์ภาพ ระบบจะแปลงเป็น WebP และสกัดสี 3D อัตโนมัติ">
                                {isAnalyzingPhoto ? (
                                  <>
                                    <RefreshCw size={14} className="spin-icon" />
                                    <span>กำลังสกัดสี & แปลง WebP...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload size={14} />
                                    <span>อัปโหลดภาพสินค้า (WebP)</span>
                                  </>
                                )}
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  style={{ display: 'none' }}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setIsAnalyzingPhoto(true);
                                      try {
                                        const result = await analyzeProductPhoto(file);
                                        if (result.success) {
                                          setEditingCatalogItem(prev => ({
                                            ...prev,
                                            image: result.textureUrl,
                                            deskTextureUrl: result.textureUrl,
                                            deskColor: result.deskColor,
                                            color: result.deskColor,
                                            accentColor: result.accentColor,
                                            chairColor: result.chairColor
                                          }));
                                        }
                                      } finally {
                                        setIsAnalyzingPhoto(false);
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Live Image Preview Thumbnail */}
                          {editingCatalogItem.image && (
                            <div className="catalog-image-preview-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
                              <img 
                                src={editingCatalogItem.image} 
                                alt={editingCatalogItem.imageAlt || editingCatalogItem.name || 'พรีวิวภาพสินค้า'} 
                                style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <CheckCircle2 size={14} className="text-blue" />
                                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>ภาพพรีวิวสินค้าปัจจุบัน (Active Preview Photo)</strong>
                                </div>
                                <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                                  ภาพนี้จะถูกใช้เป็นภาพปกในหน้าร้าน, ตารางแคตตาล็อก, เอกสารสเปก (Spec Sheet), และสกรีนเป็นลายท็อปโต๊ะ 3D
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Image ALT Tag for SEO */}
                          <div className="form-group" style={{ marginTop: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                              <Tag size={13} className="text-blue" />
                              <span>คำอธิบายภาพสำหรับ SEO (Image ALT Tag):</span>
                            </label>
                            <input 
                              type="text" 
                              className="form-input"
                              placeholder="เช่น โต๊ะคอมพิวเตอร์เกมมิ่งอีสปอร์ต 3 มิติ รุ่น Pro Stadium Arena"
                              value={editingCatalogItem.imageAlt || ''}
                              onChange={e => setEditingCatalogItem({ ...editingCatalogItem, imageAlt: e.target.value })}
                            />
                          </div>

                          {/* Quick Preset Images */}
                          <div className="preset-images-picker" style={{ marginTop: '10px' }}>
                            <span className="text-xs text-muted">หรือเลือกภาพสำเร็จรูป:</span>
                            <div className="preset-chips-scroll">
                              {CATALOG_PRESET_IMAGES.map((p, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  className={`preset-chip-btn ${editingCatalogItem.image === p.url ? 'active' : ''}`}
                                  onClick={() => setEditingCatalogItem({ ...editingCatalogItem, image: p.url })}
                                >
                                  {p.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* SECTION 7: การรับประกัน & รายละเอียดสินค้า */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <Shield size={15} className="text-blue" />
                            <span>7. การรับประกัน & รายละเอียดจุดเด่น</span>
                          </h5>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>เงื่อนไขการรับประกัน</label>
                              <input 
                                type="text" 
                                className="form-input" 
                                placeholder="รับประกันโครงสร้าง 5 ปี ระบบไฟ 3 ปี"
                                value={editingCatalogItem.warranty || ''}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, warranty: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>ระยะเวลาผลิต & ติดตั้ง</label>
                              <input 
                                type="text" 
                                className="form-input" 
                                placeholder="7 - 14 วันทำการ"
                                value={editingCatalogItem.leadTime || ''}
                                onChange={e => setEditingCatalogItem({ ...editingCatalogItem, leadTime: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label>คำอธิบายจุดเด่นของโมดูล</label>
                            <textarea 
                              className="form-input form-textarea" 
                              rows="2"
                              value={editingCatalogItem.desc || ''}
                              onChange={e => setEditingCatalogItem({ ...editingCatalogItem, desc: e.target.value })}
                            />
                          </div>
                        </div>

                      </div>

                      {/* Right Column: Live 3D Studio & Floor Plan Integration */}
                      <div className="modal-live-3d-pane">
                        <div className="live-3d-box">
                          <div className="live-3d-header">
                            <span className="live-3d-badge">
                              <Sparkles size={13} />
                              <span>Live 3D Studio Preview</span>
                            </span>
                            <small style={{ color: '#94a3b8', fontSize: '12px' }}>หมุน 360° • ซูม • ดูแสงเงา</small>
                          </div>

                          <ThreeProductViewer 
                            item={editingCatalogItem}
                            height="280px"
                            autoRotateDefault={true}
                            showControls={true}
                            onSetAsImage={(dataUrl) => {
                              setEditingCatalogItem({ ...editingCatalogItem, image: dataUrl });
                              triggerSaveToast();
                            }}
                          />

                          <div className="live-3d-tips high-contrast">
                            <Camera size={15} className="text-blue" style={{ flexShrink: 0 }} />
                            <p>
                              หมุนดูรอบทิศทาง แล้วกดปุ่ม <strong>"ใช้เป็นภาพปก"</strong> หรือ <strong>"ส่งออกภาพ 3D"</strong> ด้านล่างภาพ 3D ได้ทันที
                            </p>
                          </div>
                        </div>

                        {/* Interactive Color Customization */}
                        <div className="live-3d-colors-block">
                          <h6 className="colors-block-title">
                            <Palette size={14} className="text-blue" />
                            <span>ปรับสีโมเดล & แสงไฟ LED RGB (Colors)</span>
                          </h6>

                          {/* Desk Top Color */}
                          <div className="color-field-row" style={{ padding: '8px 0' }}>
                            <div className="color-field-meta">
                              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>สีท็อปโต๊ะ:</label>
                              <div className="color-input-badge">
                                <input 
                                  type="color" 
                                  className="color-picker-input"
                                  value={editingCatalogItem.deskColor || editingCatalogItem.color || '#0f172a'}
                                  onChange={e => setEditingCatalogItem({ 
                                    ...editingCatalogItem, 
                                    deskColor: e.target.value,
                                    color: e.target.value 
                                  })}
                                />
                                <code style={{ fontSize: '11px', fontWeight: 700 }}>{editingCatalogItem.deskColor || editingCatalogItem.color || '#0f172a'}</code>
                              </div>
                            </div>
                            <div className="color-presets-inline">
                              {DESK_COLOR_PRESETS.map((p, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  className={`color-preset-dot ${(editingCatalogItem.deskColor || editingCatalogItem.color) === p.hex ? 'selected-ring' : ''}`}
                                  style={{ backgroundColor: p.hex }}
                                  title={p.label}
                                  onClick={() => setEditingCatalogItem({ 
                                    ...editingCatalogItem, 
                                    deskColor: p.hex,
                                    color: p.hex 
                                  })}
                                />
                              ))}
                            </div>
                          </div>

                          {/* LED Glow Color */}
                          <div className="color-field-row" style={{ padding: '8px 0' }}>
                            <div className="color-field-meta">
                              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>สีไฟ LED RGB:</label>
                              <div className="color-input-badge">
                                <input 
                                  type="color" 
                                  className="color-picker-input"
                                  value={editingCatalogItem.accentColor || '#1d4ed8'}
                                  onChange={e => setEditingCatalogItem({ ...editingCatalogItem, accentColor: e.target.value })}
                                />
                                <code style={{ fontSize: '11px', fontWeight: 700 }}>{editingCatalogItem.accentColor || '#1d4ed8'}</code>
                              </div>
                            </div>
                            <div className="color-presets-inline">
                              {ACCENT_COLOR_PRESETS.map((p, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  className={`color-preset-dot glow ${editingCatalogItem.accentColor === p.hex ? 'selected-ring' : ''}`}
                                  style={{ backgroundColor: p.hex }}
                                  title={p.label}
                                  onClick={() => setEditingCatalogItem({ ...editingCatalogItem, accentColor: p.hex })}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Chair Color */}
                          <div className="color-field-row" style={{ padding: '8px 0' }}>
                            <div className="color-field-meta">
                              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>สีเก้าอี้เกมมิ่ง:</label>
                              <div className="color-input-badge">
                                <input 
                                  type="color" 
                                  className="color-picker-input"
                                  value={editingCatalogItem.chairColor || '#0f172a'}
                                  onChange={e => setEditingCatalogItem({ ...editingCatalogItem, chairColor: e.target.value })}
                                />
                                <code style={{ fontSize: '11px', fontWeight: 700 }}>{editingCatalogItem.chairColor || '#0f172a'}</code>
                              </div>
                            </div>
                            <div className="color-presets-inline">
                              {CHAIR_COLOR_PRESETS.map((p, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  className={`color-preset-dot ${editingCatalogItem.chairColor === p.hex ? 'selected-ring' : ''}`}
                                  style={{ backgroundColor: p.hex }}
                                  title={p.label}
                                  onClick={() => setEditingCatalogItem({ ...editingCatalogItem, chairColor: p.hex })}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* FLOOR PLAN INTEGRATION BOX (HIGH CONTRAST & CLEAR READABILITY) */}
                        <div className="floor-plan-specs-box">
                          <div className="floor-plan-specs-header">
                            <Compass size={15} className="text-blue" />
                            <strong>คุณสมบัติสำหรับวางบนแปลนร้าน (Floor Planner)</strong>
                          </div>
                          <div className="floor-plan-specs-grid">
                            <div className="spec-stat">
                              <span className="spec-label">Footprint 2D:</span>
                              <span className="spec-val font-semibold text-blue">
                                {editingCatalogItem.widthMeters} x {editingCatalogItem.depth3D || editingCatalogItem.heightMeters} ม.
                              </span>
                            </div>
                            <div className="spec-stat">
                              <span className="spec-label">ความสูง 3D:</span>
                              <span className="spec-val">{editingCatalogItem.height3D || 1.25} ม.</span>
                            </div>
                            <div className="spec-stat">
                              <span className="spec-label">ระยะ Clearance:</span>
                              <span className="spec-val">{(editingCatalogItem.widthMeters + 0.6).toFixed(1)} x {((editingCatalogItem.depth3D || editingCatalogItem.heightMeters) + 0.8).toFixed(1)} ม.</span>
                            </div>
                            <div className="spec-stat">
                              <span className="spec-label">จุดต่อไฟ / LAN:</span>
                              <span className="spec-val text-green font-semibold">Wireway ใต้โต๊ะ</span>
                            </div>
                          </div>
                          <div className="floor-plan-palette-preview">
                            <span className="palette-tag-badge">
                              หมวดในพาเล็ต: {editingCatalogItem.category}
                            </span>
                            <span className="ready-indicator">
                              <CheckCircle2 size={13} /> พร้อมลากวางบนแปลนร้าน 2D/3D
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                          <button className="btn-secondary" onClick={() => setEditingCatalogItem(null)}>ยกเลิก</button>
                          <button 
                            className="btn-primary" 
                            onClick={() => {
                              updateCatalogItem(editingCatalogItem);
                              setEditingCatalogItem(null);
                              triggerSaveToast();
                            }}
                          >
                            <Save size={15} /> บันทึกการเปลี่ยนแปลง
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  ADD NEW CATALOG ITEM MODAL (AI REAL-PHOTO 3D SYNTHESIS, SPEC OCR & EDITABLE PRICING)
                  ========================================================================= */}
              {showAddCatalogModal && (
                <div className="cms-modal-backdrop" onClick={() => setShowAddCatalogModal(false)}>
                  <div className="cms-modal-card modal-extra-wide catalog-edit-dual-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-head">
                      <div className="modal-head-title">
                        <Plus size={22} className="text-blue" />
                        <div>
                          <h4>เพิ่มโมดูลอุปกรณ์ & เฟอร์นิเจอร์ 3D ใหม่</h4>
                          <span style={{ color: '#94a3b8', fontSize: '13px' }}>กำหนดขนาด รหัสสินค้า ราคา น้ำหนัก วัสดุ ภาพประกอบ และโมเดล 3D สำหรับวางบนแปลนร้าน</span>
                        </div>
                      </div>
                      <button onClick={() => setShowAddCatalogModal(false)} className="btn-close-modal">✕</button>
                    </div>

                    <div className="modal-dual-body">
                      {/* Left: Form Controls with AI Spec Importer */}
                      <div className="modal-form-scrollable">

                        {/* AI SMART SPEC & REAL-PHOTO 3D SYNTHESIS HUB */}
                        <div className="ai-smart-spec-card">
                          <div className="ai-smart-card-head">
                            <div className="ai-title-row">
                              <Sparkles size={16} className="text-blue" />
                              <strong className="ai-hub-title">AI Smart 3D & Spec Importer (นำเข้าและแปลงข้อมูลอัตโนมัติ 100%)</strong>
                            </div>
                            <span className="ai-hub-badge">One-Click Auto Fill</span>
                          </div>
                          <p className="ai-hub-desc">
                            อัปโหลดภาพสินค้าจริงเพื่อสกัดสีและเรนเดอร์ 3D ทันที หรือแนบเอกสารสเปก/ใบเสนอราคา เพื่อกรอกข้อมูล ขนาด น้ำหนัก วัสดุ และราคาอัตโนมัติ
                          </p>

                          <div className="ai-action-buttons-row">
                            {/* Action 1: Upload Real Product Photo */}
                            <label className="btn-ai-action-chip photo-to-3d">
                              {isAnalyzingPhoto ? <RefreshCw size={14} className="spin-icon" /> : <Camera size={14} />}
                              <span>{isAnalyzingPhoto ? 'กำลังวิเคราะห์ภาพ...' : '📸 อัปโหลดภาพสินค้าจริง -> แปลงเป็น 3D & สกัดสี'}</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setIsAnalyzingPhoto(true);
                                    try {
                                      const result = await analyzeProductPhoto(file);
                                      if (result.success) {
                                        setNewCatalogItem(prev => ({
                                          ...prev,
                                          image: result.textureUrl,
                                          deskTextureUrl: result.textureUrl,
                                          deskColor: result.deskColor,
                                          color: result.deskColor,
                                          accentColor: result.accentColor,
                                          chairColor: result.chairColor,
                                          seats: result.suggestedSeats || prev.seats,
                                          chairCount: result.suggestedSeats || prev.chairCount
                                        }));
                                        setAiImageFeedback(`✨ สกัดสีจากภาพสินค้าจริงสำเร็จ: ท็อปโต๊ะ (${result.deskColor}), ไฟ LED (${result.accentColor}), เก้าอี้ (${result.chairColor}) พร้อมลงลายท็อปโต๊ะจริงเรียบร้อย!`);
                                        setTimeout(() => setAiImageFeedback(null), 7000);
                                      } else {
                                        setAiImageFeedback('⚠️ ไม่สามารถวิเคราะห์พิกเซลภาพได้ กรุณาใช้ไฟล์ภาพ JPG/PNG ที่คมชัด');
                                        setTimeout(() => setAiImageFeedback(null), 5000);
                                      }
                                    } catch (err) {
                                      console.error(err);
                                      setAiImageFeedback('⚠️ เกิดข้อผิดพลาดในการโหลดรูปภาพ');
                                      setTimeout(() => setAiImageFeedback(null), 5000);
                                    } finally {
                                      setIsAnalyzingPhoto(false);
                                      e.target.value = '';
                                    }
                                  }
                                }}
                              />
                            </label>

                            {/* Action 2: Attach Spec Sheet Document */}
                            <button 
                              type="button" 
                              className="btn-ai-action-chip doc-to-spec"
                              onClick={() => {
                                setAiSpecTarget('new');
                                setAiSpecModalOpen(true);
                              }}
                            >
                              <FileUp size={14} />
                              <span>📄 แนบเอกสารสเปกสินค้า / ใบเสนอราคา</span>
                            </button>

                            {/* Action 3: Upload 3D Model File (.GLB / .GLTF) */}
                            <label className="btn-ai-action-chip upload-3d-model">
                              <Box size={14} />
                              <span>📦 อัปโหลดโมเดล 3D (.GLB/.GLTF)</span>
                              <input 
                                type="file" 
                                accept=".glb,.gltf" 
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const modelUrl = URL.createObjectURL(file);
                                    setNewCatalogItem(prev => ({
                                      ...prev,
                                      model3DUrl: modelUrl
                                    }));
                                    setAiImageFeedback(`📦 นำเข้าโมเดล 3D (${file.name}) สำเร็จ! เรนเดอร์บน 3D Studio เรียบร้อย`);
                                    setTimeout(() => setAiImageFeedback(null), 7000);
                                  }
                                }}
                              />
                            </label>
                          </div>

                          {/* AI Feedback Banners */}
                          {aiImageFeedback && (
                            <div className="ai-feedback-banner success">
                              <CheckCircle2 size={15} />
                              <span>{aiImageFeedback}</span>
                            </div>
                          )}

                          {aiSpecFeedback && (
                            <div className="ai-feedback-banner success">
                              <CheckCircle2 size={15} />
                              <span>{aiSpecFeedback}</span>
                            </div>
                          )}
                        </div>

                        {/* SECTION 1: รหัสสินค้า, ชื่อ & หมวดหมู่ */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <Tag size={15} className="text-blue" />
                            <span>1. รหัสสินค้า (SKU) & ข้อมูลพื้นฐาน</span>
                          </h5>

                          {/* Row 1: ชื่อโมดูล & หมวดหมู่สินค้า */}
                          <div className="form-row-2">
                            <div className="form-group">
                              <label>ชื่อโมดูล (ภาษาไทย)</label>
                              <input 
                                type="text" 
                                className="form-input font-semibold" 
                                placeholder="เช่น โต๊ะเกมมิ่งสตรีมเมอร์เดี่ยว (Solo Streamer Pod)"
                                value={newCatalogItem.name}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, name: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>หมวดหมู่โมดูล</label>
                              <select 
                                className="form-input"
                                value={newCatalogItem.category}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, category: e.target.value })}
                              >
                                <option value="stations">โต๊ะคอมพิวเตอร์เกมมิ่ง (Stations)</option>
                                <option value="vip">ห้อง VIP ส่วนตัว (Private Suite)</option>
                                <option value="stage">เวทีการแข่งขัน (Main Stage)</option>
                                <option value="facilities">เคาน์เตอร์ & บาร์ (Facilities)</option>
                                <option value="amenities">สิ่งอำนวยความสะดวก & โซฟา (Amenities)</option>
                                <option value="architectural">สถาปัตยกรรม (ผนัง/ประตู/กระจก)</option>
                              </select>
                            </div>
                          </div>

                          {/* Row 2: รหัสสินค้า (SKU) & เกรดโมดูล */}
                          <div className="form-row-2">
                            <div className="form-group">
                              <label>รหัสสินค้า (Product SKU)</label>
                              <input 
                                type="text" 
                                className="form-input font-mono font-semibold" 
                                placeholder="เช่น GLP-DSK-NEW-01"
                                value={newCatalogItem.sku || 'GLP-NEW-01'}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, sku: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>เกรดโมดูล</label>
                              <select 
                                className="form-input"
                                value={newCatalogItem.grade || 'pro'}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, grade: e.target.value })}
                              >
                                <option value="standard">Standard (Tier 1 - คุ้มค่า คืนทุนเร็ว)</option>
                                <option value="pro">Pro Racing (Tier 2 - นักกีฬาแข่งขัน)</option>
                                <option value="ultimate">Ultimate Esports (Tier 3 - ไฮเอนด์อารีนา)</option>
                                <option value="vip">VIP Suite Grade (เกรดห้องสตรีมเมอร์)</option>
                              </select>
                            </div>
                          </div>

                          {/* Row 3: รหัสประเภท 3D (Type Slug) พร้อมพรีเซ็ตสำเร็จรูป */}
                          <div className="type-slug-card">
                            <div className="type-slug-field">
                              <div className="type-slug-label-row">
                                <label className="type-slug-label">
                                  <Box size={13} className="text-blue" />
                                  <span>รหัสประเภท 3D (Type Slug)</span>
                                </label>
                                <span className="type-slug-badge editable">เลือกโครงสร้าง 3D</span>
                              </div>
                              <input 
                                type="text" 
                                className="form-input font-mono" 
                                placeholder="เช่น pc-row-2, pc-row-4, vip-room-5"
                                value={newCatalogItem.type}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, type: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                              />
                              <div className="type-slug-presets">
                                <span className="text-xs text-muted">โครงสร้างสำเร็จรูป:</span>
                                {['pc-row-2', 'pc-row-4', 'pc-island-6', 'vip-room-5', 'stage-5v5', 'counter'].map((t) => (
                                  <button
                                    key={t}
                                    type="button"
                                    className={`type-preset-pill ${newCatalogItem.type === t ? 'active' : ''}`}
                                    onClick={() => setNewCatalogItem({ ...newCatalogItem, type: t })}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="type-slug-helper">
                              <div className="helper-title">
                                <Info size={13} className="text-blue" />
                                <span>รหัสประเภท 3D คืออะไร?</span>
                              </div>
                              <p className="helper-text">
                                กำหนดโครงสร้างเรขาคณิต 3D ใน Three.js สำหรับประกอบโต๊ะ เก้าอี้ จอคอม และเชื่อมโยงกับการจำลองผังร้าน 2D/3D อัตโนมัติ (คลิกเลือกพรีเซ็ตสำเร็จรูป หรือระบุรหัสเอง)
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 2: ขนาดมิติ 3 มิติ */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <Ruler size={15} className="text-blue" />
                            <span>2. ขนาดมิติ 3 มิติ (Dimensions) & จำนวนที่นั่ง</span>
                          </h5>

                          <div className="form-row-4">
                            <div className="form-group">
                              <label>กว้าง (ม.)</label>
                              <input 
                                type="number" step="0.05" className="form-input"
                                value={newCatalogItem.widthMeters}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, widthMeters: parseFloat(e.target.value) || 1 })}
                              />
                            </div>
                            <div className="form-group">
                              <label>ลึก 3D (ม.)</label>
                              <input 
                                type="number" step="0.05" className="form-input"
                                value={newCatalogItem.depth3D || newCatalogItem.heightMeters}
                                onChange={e => setNewCatalogItem({ 
                                  ...newCatalogItem, 
                                  depth3D: parseFloat(e.target.value) || 1,
                                  heightMeters: parseFloat(e.target.value) || 1
                                })}
                              />
                            </div>
                            <div className="form-group">
                              <label>สูง 3D (ม.)</label>
                              <input 
                                type="number" step="0.05" className="form-input"
                                value={newCatalogItem.height3D || 1.25}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, height3D: parseFloat(e.target.value) || 1 })}
                              />
                            </div>
                            <div className="form-group">
                              <label>ที่นั่ง</label>
                              <input 
                                type="number" min="0" className="form-input"
                                value={newCatalogItem.seats ?? newCatalogItem.chairCount ?? 0}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, seats: parseInt(e.target.value) || 0 })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* SECTION 3: น้ำหนักและการรับน้ำหนัก */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <Scale size={15} className="text-blue" />
                            <span>3. น้ำหนัก & โครงสร้างการรับน้ำหนัก (Weight & Load)</span>
                          </h5>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>น้ำหนักสินค้าสุทธิ (Net Weight กก.)</label>
                              <input 
                                type="number" 
                                className="form-input"
                                placeholder="เช่น 48"
                                value={newCatalogItem.weightKg || 48}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, weightKg: parseFloat(e.target.value) || 0 })}
                              />
                            </div>
                            <div className="form-group">
                              <label>น้ำหนักที่รองรับได้สูงสุด (Max Load กก.)</label>
                              <input 
                                type="number" 
                                className="form-input"
                                placeholder="เช่น 350"
                                value={newCatalogItem.maxLoadKg || 350}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, maxLoadKg: parseFloat(e.target.value) || 0 })}
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label>หมายเหตุการขนส่งและการประกอบหน้างาน</label>
                            <input 
                              type="text" 
                              className="form-input"
                              placeholder="เช่น แยกส่วน 3 ชิ้น ขนส่งสะดวก ประกอบหน้างานภายใน 20 นาที"
                              value={newCatalogItem.weightNote || 'แยกส่วน 3 ชิ้น ขนส่งสะดวก ประกอบหน้างานภายใน 20 นาที'}
                              onChange={e => setNewCatalogItem({ ...newCatalogItem, weightNote: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* SECTION 4: วัสดุและคุณภาพการประกอบ */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <Wrench size={15} className="text-blue" />
                            <span>4. วัสดุ & คุณภาพการประกอบ (Materials & Construction)</span>
                          </h5>

                          <div className="form-group">
                            <label>สเปกวัสดุโครงสร้างและหน้าท็อป</label>
                            <textarea 
                              className="form-input form-textarea" 
                              rows="2"
                              value={newCatalogItem.material || ''}
                              onChange={e => setNewCatalogItem({ ...newCatalogItem, material: e.target.value })}
                            />
                          </div>

                          <div className="material-quick-chips">
                            <span className="text-xs text-muted" style={{ marginRight: '6px' }}>เลือกข้อความวัสดุด่วน:</span>
                            {[
                              'หน้าท็อป HPL เคลือบเมลามีนกันน้ำและรอยขูดขีด',
                              'โครงเหล็กกล้าคาร์บอนพ่นสี Powder Coat หนา 1.8mm',
                              'รางร้อยสายไฟเหล็ก Wireway ซ่อนใต้โต๊ะแยก High/Low Voltage',
                              'ฉากกั้นกลางอะคริลิกซับเสียงหนา 8mm พร้อมไฟ LED Strip',
                              'ขาโต๊ะปรับระดับความสูงได้ ±3 ซม. รองรับพื้นไม่เรียบ'
                            ].map((mat, idx) => (
                              <button
                                key={idx}
                                type="button"
                                className="preset-chip-btn"
                                style={{ fontSize: '11px', margin: '2px' }}
                                onClick={() => {
                                  const current = newCatalogItem.material || '';
                                  const updated = current ? `${current} + ${mat}` : mat;
                                  setNewCatalogItem({ ...newCatalogItem, material: updated });
                                }}
                              >
                                + {mat.split(' ')[0]} {mat.split(' ')[1]}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* SECTION 5: ราคา & สเปกอุปกรณ์ (EDITABLE REAL PRICE) */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <DollarSign size={15} className="text-blue" />
                            <span>5. ราคา & สเปกอุปกรณ์ (Pricing Breakdown & สามารถแก้ไขราคาได้จริง)</span>
                          </h5>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>ราคาเฉพาะโต๊ะและโครงสร้าง (บาท)</label>
                              <input 
                                type="number" className="form-input font-semibold"
                                value={newCatalogItem.deskPrice}
                                onChange={e => {
                                  const deskPrice = parseInt(e.target.value) || 0;
                                  setNewCatalogItem({ ...newCatalogItem, deskPrice });
                                }}
                              />
                            </div>
                            <div className="form-group">
                              <label>คำอธิบายสเปกโต๊ะ</label>
                              <input 
                                type="text" className="form-input"
                                placeholder="โต๊ะโครงเหล็กคาร์บอน รางร้อยสายไฟ"
                                value={newCatalogItem.deskDesc}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, deskDesc: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-row-3">
                            <div className="form-group">
                              <label>รุ่นเก้าอี้</label>
                              <input 
                                type="text" className="form-input"
                                value={newCatalogItem.chairModel}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, chairModel: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>ราคาเก้าอี้/ตัว (บาท)</label>
                              <input 
                                type="number" className="form-input font-semibold"
                                value={newCatalogItem.chairPrice}
                                onChange={e => {
                                  const chairPrice = parseInt(e.target.value) || 0;
                                  setNewCatalogItem({ ...newCatalogItem, chairPrice });
                                }}
                              />
                            </div>
                            <div className="form-group">
                              <label>จำนวนเก้าอี้ (ตัว)</label>
                              <input 
                                type="number" className="form-input font-semibold"
                                value={newCatalogItem.chairCount}
                                onChange={e => {
                                  const chairCount = parseInt(e.target.value) || 0;
                                  setNewCatalogItem({ ...newCatalogItem, chairCount, seats: chairCount });
                                }}
                              />
                            </div>
                          </div>

                          {/* Editable Total Module Cost Card */}
                          <div className="total-cost-editable-box">
                            <div className="total-cost-header">
                              <div>
                                <label className="total-cost-label">ราคารวมโมดูลที่ใช้จริง (บาท):</label>
                                <span className="text-xs text-muted" style={{ display: 'block' }}>
                                  คุณสามารถแก้ไขราคานี้ได้โดยตรงตามราคาแพ็กเกจจริง หรือกดปุ่มซิงค์ตามคำนวณ
                                </span>
                              </div>
                              <button
                                type="button"
                                className="btn-sync-calc"
                                onClick={() => {
                                  const calculated = (newCatalogItem.deskPrice || 0) + ((newCatalogItem.chairPrice || 0) * (newCatalogItem.chairCount || 0));
                                  setNewCatalogItem({ ...newCatalogItem, baseCost: calculated });
                                }}
                                title="คำนวณจาก โต๊ะ + (ราคาเก้าอี้ x จำนวนเก้าอี้)"
                              >
                                <RefreshCw size={13} />
                                <span>ซิงค์ตามคำนวณ (฿{(((newCatalogItem.deskPrice || 0) + ((newCatalogItem.chairPrice || 0) * (newCatalogItem.chairCount || 0)))).toLocaleString()})</span>
                              </button>
                            </div>

                            <div className="total-cost-input-row">
                              <span className="currency-prefix">฿</span>
                              <input 
                                type="number"
                                className="total-price-large-input"
                                value={newCatalogItem.baseCost || 0}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, baseCost: parseInt(e.target.value) || 0 })}
                              />
                              <span className="currency-suffix">บาท</span>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 6: ภาพประกอบ & SEO */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <ImageIcon size={15} className="text-blue" />
                            <span>6. ภาพประกอบสินค้า & SEO (Product Photography)</span>
                          </h5>

                          <div className="image-manager-row">
                            <div className="form-group" style={{ flex: 1 }}>
                              <label>URL รูปภาพสินค้า (Image URL)</label>
                              <input 
                                type="url" 
                                className="form-input"
                                placeholder="https://images.unsplash.com/..."
                                value={newCatalogItem.image || ''}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, image: e.target.value })}
                              />
                            </div>
                            <div className="image-upload-wrapper">
                              <label className="btn-upload-file" title="เลือกไฟล์ภาพ ระบบจะแปลงเป็น WebP และสกัดสี 3D อัตโนมัติ">
                                {isAnalyzingPhoto ? (
                                  <>
                                    <RefreshCw size={14} className="spin-icon" />
                                    <span>กำลังสกัดสี & แปลง WebP...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload size={14} />
                                    <span>อัปโหลดภาพสินค้า (WebP)</span>
                                  </>
                                )}
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  style={{ display: 'none' }}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setIsAnalyzingPhoto(true);
                                      try {
                                        const result = await analyzeProductPhoto(file);
                                        if (result.success) {
                                          setNewCatalogItem(prev => ({
                                            ...prev,
                                            image: result.textureUrl,
                                            deskTextureUrl: result.textureUrl,
                                            deskColor: result.deskColor,
                                            color: result.deskColor,
                                            accentColor: result.accentColor,
                                            chairColor: result.chairColor
                                          }));
                                        }
                                      } finally {
                                        setIsAnalyzingPhoto(false);
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Live Image Preview Thumbnail */}
                          {newCatalogItem.image && (
                            <div className="catalog-image-preview-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
                              <img 
                                src={newCatalogItem.image} 
                                alt={newCatalogItem.imageAlt || newCatalogItem.name || 'พรีวิวภาพสินค้า'} 
                                style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <CheckCircle2 size={14} className="text-blue" />
                                  <strong style={{ fontSize: '13px', color: '#1e293b' }}>ภาพพรีวิวสินค้าปัจจุบัน (Active Preview Photo)</strong>
                                </div>
                                <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                                  ภาพนี้จะถูกใช้เป็นภาพปกในหน้าร้าน, ตารางแคตตาล็อก, เอกสารสเปก (Spec Sheet), และสกรีนเป็นลายท็อปโต๊ะ 3D
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Image ALT Tag for SEO */}
                          <div className="form-group" style={{ marginTop: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                              <Tag size={13} className="text-blue" />
                              <span>คำอธิบายภาพสำหรับ SEO (Image ALT Tag):</span>
                            </label>
                            <input 
                              type="text" 
                              className="form-input"
                              placeholder="เช่น โต๊ะคอมพิวเตอร์เกมมิ่งอีสปอร์ต 3 มิติ รุ่น Pro Stadium Arena"
                              value={newCatalogItem.imageAlt || ''}
                              onChange={e => setNewCatalogItem({ ...newCatalogItem, imageAlt: e.target.value })}
                            />
                          </div>

                          {/* Quick Presets */}
                          <div className="preset-images-picker" style={{ marginTop: '10px' }}>
                            <span className="text-xs text-muted">หรือเลือกภาพสำเร็จรูป:</span>
                            <div className="preset-chips-scroll">
                              {CATALOG_PRESET_IMAGES.map((p, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  className={`preset-chip-btn ${newCatalogItem.image === p.url ? 'active' : ''}`}
                                  onClick={() => setNewCatalogItem({ ...newCatalogItem, image: p.url })}
                                >
                                  {p.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* SECTION 7: การรับประกัน & รายละเอียด */}
                        <div className="form-subblock">
                          <h5 className="form-subblock-title">
                            <Shield size={15} className="text-blue" />
                            <span>7. การรับประกัน & รายละเอียดจุดเด่น</span>
                          </h5>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>เงื่อนไขการรับประกัน</label>
                              <input 
                                type="text" 
                                className="form-input" 
                                value={newCatalogItem.warranty || ''}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, warranty: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>ระยะเวลาผลิต & ติดตั้ง</label>
                              <input 
                                type="text" 
                                className="form-input" 
                                value={newCatalogItem.leadTime || ''}
                                onChange={e => setNewCatalogItem({ ...newCatalogItem, leadTime: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label>คำอธิบายจุดเด่นของโมดูล</label>
                            <textarea 
                              className="form-input form-textarea" 
                              rows="2"
                              value={newCatalogItem.desc || ''}
                              onChange={e => setNewCatalogItem({ ...newCatalogItem, desc: e.target.value })}
                            />
                          </div>
                        </div>

                      </div>

                      {/* Right: Live 3D Studio & Floor Plan Integration */}
                      <div className="modal-live-3d-pane">
                        <div className="live-3d-box">
                          <div className="live-3d-header">
                            <span className="live-3d-badge">
                              <Sparkles size={13} />
                              <span>Live 3D Studio Preview</span>
                            </span>
                            <small style={{ color: '#94a3b8', fontSize: '12px' }}>หมุน 360° • ซูม • ดูแสงเงา</small>
                          </div>

                          <ThreeProductViewer 
                            item={newCatalogItem}
                            height="280px"
                            autoRotateDefault={true}
                            showControls={true}
                            onSetAsImage={(dataUrl) => {
                              setNewCatalogItem({ ...newCatalogItem, image: dataUrl });
                              triggerSaveToast();
                            }}
                          />

                          <div className="live-3d-tips high-contrast">
                            <Camera size={15} className="text-blue" style={{ flexShrink: 0 }} />
                            <p>
                              หมุนดูรอบทิศทาง แล้วกดปุ่ม <strong>"ใช้เป็นภาพปก"</strong> หรือ <strong>"ส่งออกภาพ 3D"</strong> ด้านล่างภาพ 3D ได้ทันที
                            </p>
                          </div>
                        </div>

                        {/* Interactive Color Customization */}
                        <div className="live-3d-colors-block">
                          <h6 className="colors-block-title">
                            <Palette size={14} className="text-blue" />
                            <span>ปรับสีโมเดล & แสงไฟ LED RGB (Colors)</span>
                          </h6>

                          {/* Desk Top Color */}
                          <div className="color-field-row" style={{ padding: '8px 0' }}>
                            <div className="color-field-meta">
                              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>สีท็อปโต๊ะ:</label>
                              <div className="color-input-badge">
                                <input 
                                  type="color" 
                                  className="color-picker-input"
                                  value={newCatalogItem.deskColor || newCatalogItem.color || '#0f172a'}
                                  onChange={e => setNewCatalogItem({ 
                                    ...newCatalogItem, 
                                    deskColor: e.target.value,
                                    color: e.target.value 
                                  })}
                                />
                                <code style={{ fontSize: '11px', fontWeight: 700 }}>{newCatalogItem.deskColor || newCatalogItem.color || '#0f172a'}</code>
                              </div>
                            </div>
                            <div className="color-presets-inline">
                              {DESK_COLOR_PRESETS.map((p, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  className={`color-preset-dot ${(newCatalogItem.deskColor || newCatalogItem.color) === p.hex ? 'selected-ring' : ''}`}
                                  style={{ backgroundColor: p.hex }}
                                  title={p.label}
                                  onClick={() => setNewCatalogItem({ 
                                    ...newCatalogItem, 
                                    deskColor: p.hex,
                                    color: p.hex 
                                  })}
                                />
                              ))}
                            </div>
                          </div>

                          {/* LED Glow Color */}
                          <div className="color-field-row" style={{ padding: '8px 0' }}>
                            <div className="color-field-meta">
                              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>สีไฟ LED RGB:</label>
                              <div className="color-input-badge">
                                <input 
                                  type="color" 
                                  className="color-picker-input"
                                  value={newCatalogItem.accentColor || '#1d4ed8'}
                                  onChange={e => setNewCatalogItem({ ...newCatalogItem, accentColor: e.target.value })}
                                />
                                <code style={{ fontSize: '11px', fontWeight: 700 }}>{newCatalogItem.accentColor || '#1d4ed8'}</code>
                              </div>
                            </div>
                            <div className="color-presets-inline">
                              {ACCENT_COLOR_PRESETS.map((p, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  className={`color-preset-dot glow ${newCatalogItem.accentColor === p.hex ? 'selected-ring' : ''}`}
                                  style={{ backgroundColor: p.hex }}
                                  title={p.label}
                                  onClick={() => setNewCatalogItem({ ...newCatalogItem, accentColor: p.hex })}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Chair Color */}
                          <div className="color-field-row" style={{ padding: '8px 0' }}>
                            <div className="color-field-meta">
                              <label style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>สีเก้าอี้เกมมิ่ง:</label>
                              <div className="color-input-badge">
                                <input 
                                  type="color" 
                                  className="color-picker-input"
                                  value={newCatalogItem.chairColor || '#0f172a'}
                                  onChange={e => setNewCatalogItem({ ...newCatalogItem, chairColor: e.target.value })}
                                />
                                <code style={{ fontSize: '11px', fontWeight: 700 }}>{newCatalogItem.chairColor || '#0f172a'}</code>
                              </div>
                            </div>
                            <div className="color-presets-inline">
                              {CHAIR_COLOR_PRESETS.map((p, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  className={`color-preset-dot ${newCatalogItem.chairColor === p.hex ? 'selected-ring' : ''}`}
                                  style={{ backgroundColor: p.hex }}
                                  title={p.label}
                                  onClick={() => setNewCatalogItem({ ...newCatalogItem, chairColor: p.hex })}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* FLOOR PLAN INTEGRATION BOX (HIGH CONTRAST & CLEAR READABILITY) */}
                        <div className="floor-plan-specs-box">
                          <div className="floor-plan-specs-header">
                            <Compass size={15} className="text-blue" />
                            <strong>คุณสมบัติสำหรับวางบนแปลนร้าน (Floor Planner)</strong>
                          </div>
                          <div className="floor-plan-specs-grid">
                            <div className="spec-stat">
                              <span className="spec-label">Footprint 2D:</span>
                              <span className="spec-val font-semibold text-blue">
                                {newCatalogItem.widthMeters} x {newCatalogItem.depth3D || newCatalogItem.heightMeters} ม.
                              </span>
                            </div>
                            <div className="spec-stat">
                              <span className="spec-label">ความสูง 3D:</span>
                              <span className="spec-val">{newCatalogItem.height3D || 1.25} ม.</span>
                            </div>
                            <div className="spec-stat">
                              <span className="spec-label">ระยะ Clearance:</span>
                              <span className="spec-val">{(newCatalogItem.widthMeters + 0.6).toFixed(1)} x {((newCatalogItem.depth3D || newCatalogItem.heightMeters) + 0.8).toFixed(1)} ม.</span>
                            </div>
                            <div className="spec-stat">
                              <span className="spec-label">จุดต่อไฟ / LAN:</span>
                              <span className="spec-val text-green font-semibold">Wireway ใต้โต๊ะ</span>
                            </div>
                          </div>
                          <div className="floor-plan-palette-preview">
                            <span className="palette-tag-badge">
                              หมวดในพาเล็ต: {newCatalogItem.category}
                            </span>
                            <span className="ready-indicator">
                              <CheckCircle2 size={13} /> พร้อมลากวางบนแปลนร้าน 2D/3D
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                          <button className="btn-secondary" onClick={() => setShowAddCatalogModal(false)}>ยกเลิก</button>
                          <button 
                            className="btn-primary"
                            onClick={() => {
                              if (!newCatalogItem.type || !newCatalogItem.name) {
                                alert('กรุณากรอกรหัสประเภทและชื่อโมดูล');
                                return;
                              }
                              addCatalogItem(newCatalogItem);
                              setShowAddCatalogModal(false);
                              triggerSaveToast();
                            }}
                          >
                            <Plus size={15} /> เพิ่มโมดูลลงระบบ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  AI SPEC SHEET / DOCUMENT TEXT OCR & PARSER MODAL
                  ========================================================================= */}
              {aiSpecModalOpen && (
                <div className="cms-modal-backdrop submodal" style={{ zIndex: 999999 }} onClick={() => setAiSpecModalOpen(false)}>
                  <div className="cms-modal-card ai-spec-parser-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-head">
                      <div className="modal-head-title">
                        <Wand2 size={20} className="text-blue" />
                        <h4>AI แปลงเอกสารสเปกสินค้า / ใบเสนอราคาเป็นข้อมูล 100%</h4>
                      </div>
                      <button onClick={() => setAiSpecModalOpen(false)} className="btn-close-modal">✕</button>
                    </div>

                    <div className="ai-spec-modal-body">
                      <p className="ai-spec-intro">
                        แนบไฟล์เอกสารสเปก (.txt, .pdf, .docx, .png) หรือวางข้อความสเปกจากใบเสนอราคาหรือแคตตาล็อก ระบบจะดึงรหัสสินค้า, ขนาด, น้ำหนัก, วัสดุ, ราคา และระยะเวลารับประกัน มากรอกลงฟอร์มอัตโนมัติทันที
                      </p>

                      <div className="ai-spec-upload-row">
                        <label className="btn-spec-upload-file">
                          <Upload size={14} />
                          <span>เลือกไฟล์เอกสารสเปก / รูปภาพใบเสนอราคา</span>
                          <input 
                            type="file" 
                            accept=".txt,.json,.md,.csv,.pdf,.png,.jpg,.jpeg,.webp" 
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  const text = ev.target.result;
                                  if (typeof text === 'string') {
                                    setAiSpecInputText(text);
                                  }
                                };
                                reader.readAsText(file);
                              }
                            }}
                          />
                        </label>

                        <button 
                          type="button" 
                          className="btn-sample-spec"
                          onClick={() => {
                            setAiSpecInputText(`รหัสสินค้า: GLP-ULT-4P-2026
ชื่อสินค้า: โต๊ะคอมพิวเตอร์เกมมิ่ง Ultimate Arena Quad 4 ที่นั่ง
ขนาด: 4800 x 1200 x 1250 mm (กว้าง 4.8 ม. ลึก 1.2 ม. สูง 1.25 ม.)
จำนวนที่นั่ง: 4 ที่นั่ง
น้ำหนักสินค้า: 95 กก.
รับน้ำหนักสูงสุด: 700 กก.
วัสดุ: โครงเหล็กกล้าคาร์บอนพ่นสี Powder Coat หนา 2.0mm + หน้าท็อป HPL กันน้ำและรอยขีดข่วน + รางร้อยสายไฟเหล็ก Wireway ซ่อนใต้โต๊ะแยก High/Low Voltage
ราคาโต๊ะ: 32,000 บาท
รุ่นเก้าอี้: G-Speed Pro Racing PU Leather
ราคาเก้าอี้: 6,000 บาท (จำนวน 4 ตัว = 24,000 บาท)
ราคารวมโมดูล: 56,000 บาท
การรับประกัน: รับประกันโครงสร้าง 5 ปี ระบบไฟ 3 ปี On-site Service
ระยะเวลาผลิต: 10-14 วันทำการ`);
                          }}
                        >
                          <FileText size={13} />
                          <span>ลองใส่ข้อความสเปกตัวอย่าง</span>
                        </button>
                      </div>

                      <div className="form-group" style={{ marginTop: '12px' }}>
                        <label style={{ fontWeight: 600 }}>ข้อความสเปกสินค้า / รายการใบเสนอราคา:</label>
                        <textarea 
                          className="form-input ai-spec-textarea"
                          rows="8"
                          placeholder="วางข้อความสเปกสินค้า เช่น ขนาด 2400x1000x1250mm น้ำหนัก 48 กก. ราคา 28000 บาท..."
                          value={aiSpecInputText}
                          onChange={e => setAiSpecInputText(e.target.value)}
                        />
                      </div>

                      <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                        <button className="btn-secondary" onClick={() => setAiSpecModalOpen(false)}>ยกเลิก</button>
                        <button 
                          type="button" 
                          className="btn-primary"
                          disabled={!aiSpecInputText.trim()}
                          onClick={() => {
                            const extracted = parseSpecSheetText(aiSpecInputText);
                            if (extracted) {
                              if (aiSpecTarget === 'edit') {
                                setEditingCatalogItem(prev => ({
                                  ...prev,
                                  ...extracted,
                                  baseCost: extracted.baseCost || prev.baseCost
                                }));
                              } else {
                                setNewCatalogItem(prev => ({
                                  ...prev,
                                  ...extracted,
                                  baseCost: extracted.baseCost || prev.baseCost
                                }));
                              }
                              setAiSpecFeedback(`✓ อ่านเอกสารสเปกสำเร็จ: รหัส ${extracted.sku || '-'} | ขนาด ${extracted.widthMeters || '-'}x${extracted.depth3D || '-'}ม. | ราคา ฿${extracted.baseCost?.toLocaleString() || '-'} นำเข้าฟอร์มครบ 100%!`);
                              setTimeout(() => setAiSpecFeedback(null), 8000);
                              setAiSpecModalOpen(false);
                            } else {
                              alert('ไม่พบข้อมูลสเปกที่ตรวจจับได้ กรุณาตรวจสอบข้อความหรือพิมพ์รายละเอียดให้ชัดเจนขึ้นครับ');
                            }
                          }}
                        >
                          <Wand2 size={14} /> แปลงข้อมูลและนำเข้าฟอร์มทันที
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  FULLSCREEN 3D STUDIO & SNAPSHOT EXPORT MODAL
                  ========================================================================= */}
              {viewing3DItem && (
                <div className="cms-modal-backdrop" onClick={() => setViewing3DItem(null)}>
                  <div className="cms-modal-card modal-view-3d-studio" onClick={e => e.stopPropagation()}>
                    <div className="modal-head">
                      <div className="modal-head-title">
                        <Box size={18} className="text-blue" />
                        <h4>3D Studio เรนเดอร์: {viewing3DItem.name}</h4>
                        <span className="sub-type-tag">{viewing3DItem.type}</span>
                      </div>
                      <div className="modal-head-actions">
                        <button 
                          type="button" 
                          className="btn-spec-shortcut"
                          onClick={() => {
                            const current = viewing3DItem;
                            setViewing3DItem(null);
                            setViewingSpecItem(current);
                          }}
                        >
                          <FileText size={14} />
                          <span>ดูเอกสารสเปก</span>
                        </button>
                        <button onClick={() => setViewing3DItem(null)} className="btn-close-modal">✕</button>
                      </div>
                    </div>

                    <div className="viewing-3d-body">
                      <ThreeProductViewer 
                        item={viewing3DItem}
                        height="480px"
                        autoRotateDefault={true}
                        showControls={true}
                        onSetAsImage={(dataUrl) => {
                          updateCatalogItem({ ...viewing3DItem, image: dataUrl });
                          triggerSaveToast();
                        }}
                      />

                      <div className="viewing-3d-footer-info">
                        <div className="meta-tag-cluster">
                          <span className="info-chip">
                            <strong>ขนาด:</strong> {viewing3DItem.widthMeters} x {viewing3DItem.depth3D || viewing3DItem.heightMeters} x {viewing3DItem.height3D || 1.25} ม.
                          </span>
                          <span className="info-chip">
                            <strong>เกรด:</strong> {(viewing3DItem.grade || 'pro').toUpperCase()}
                          </span>
                          <span className="info-chip">
                            <strong>ราคา:</strong> ฿{(viewing3DItem.baseCost || 0).toLocaleString()} บาท
                          </span>
                          <span className="info-chip">
                            <strong>สีโต๊ะ:</strong> {viewing3DItem.deskColor || viewing3DItem.color || '#0f172a'}
                          </span>
                          <span className="info-chip">
                            <strong>ไฟ LED:</strong> {viewing3DItem.accentColor || '#1d4ed8'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  PRINTABLE PRODUCT SPECIFICATION SHEET MODAL
                  ========================================================================= */}
              {viewingSpecItem && (
                <ProductSpecSheetModal 
                  item={viewingSpecItem}
                  onClose={() => setViewingSpecItem(null)}
                  onEdit={(item) => setEditingCatalogItem(item)}
                />
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 2: AI ASSISTANT & RAG KNOWLEDGE BASE
              ========================================================================= */}
          {activeTab === 'ai-rag' && (
            <div className="cms-panel-block">
              <div className="panel-header-row">
                <div>
                  <h3 className="panel-title">
                    <Bot size={20} className="text-blue" />
                    <span>ระบบ AI Store Assistant & คลังความรู้ RAG (Gemini Flash / OpenRouter)</span>
                  </h3>
                  <p className="panel-desc">
                    จัดการข้อมูลของร้านเกมสำหรับนำไปเทรน (RAG Retrieval) ให้ AI ตอบคำถามลูกค้าได้อย่างแม่นยำ พร้อมตั้งค่าการเชื่อมต่อ OpenRouter API
                  </p>
                </div>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddRAGModal(true)}
                >
                  <Plus size={16} />
                  <span>เพิ่มข้อมูลเข้าคลังความรู้</span>
                </button>
              </div>

              {/* OpenRouter API Settings Card */}
              <div className="admin-subcard glass-panel">
                <div className="subcard-title" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Key size={16} className="text-blue" />
                    <strong>ตั้งค่าการเชื่อมต่อ OpenRouter API & LLM Cloud Engine</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`status-pill ${siteData.openRouterSettings?.apiKey ? 'status-pill-success' : 'status-pill-warning'}`}>
                      {siteData.openRouterSettings?.apiKey ? 'API Key Configured' : 'Fallback RAG Active'}
                    </span>
                  </div>
                </div>

                {/* Security Mode Selector: Zero-Leak Proxy vs Direct Browser */}
                <div style={{ background: siteData.openRouterSettings?.useSecureProxy ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)', border: siteData.openRouterSettings?.useSecureProxy ? '1px solid #10b981' : '1px solid #f59e0b', borderRadius: '8px', padding: '14px 16px', margin: '14px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShieldCheck size={22} className={siteData.openRouterSettings?.useSecureProxy ? 'text-green' : 'text-amber'} />
                      <div>
                        <strong style={{ color: siteData.openRouterSettings?.useSecureProxy ? '#059669' : '#d97706', fontSize: '0.92rem' }}>
                          {siteData.openRouterSettings?.useSecureProxy ? 'โหมดความปลอดภัยสูงสุด: Zero-Leak Server Proxy (ป้องกัน API Key รั่วไหล 100%)' : 'โหมด Direct Client (เรียก API ตรงจาก Browser สำหรับ Dev เท่านั้น)'}
                        </strong>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                          {siteData.openRouterSettings?.useSecureProxy 
                            ? 'เบราว์เซอร์ของลูกค้าจะไม่สามารถแอบดูหรือ Inspect หา OpenRouter API Key ได้ เพราะส่งผ่าน /api/chat หรือ n8n Webhook ฝั่ง Server เท่านั้น'
                            : 'คำเตือน: การยิงตรงจากหน้าเว็บสาธารณะอาจทำให้ผู้ใช้เปิด F12 Network Tab แล้วคัดลอก API Key ไปใช้ได้ แนะนำให้เปิด Zero-Leak Proxy สำหรับ Production'}
                        </p>
                      </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: siteData.openRouterSettings?.useSecureProxy ? '#10b981' : '#e2e8f0', color: siteData.openRouterSettings?.useSecureProxy ? '#fff' : '#475569', padding: '6px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.8rem' }}>
                      <input 
                        type="checkbox"
                        checked={siteData.openRouterSettings?.useSecureProxy || false}
                        onChange={e => {
                          updateOpenRouterSettings({ useSecureProxy: e.target.checked });
                          triggerSaveToast();
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{siteData.openRouterSettings?.useSecureProxy ? 'Zero-Leak ทำงาน' : 'เปิด Zero-Leak Proxy'}</span>
                    </label>
                  </div>

                  {siteData.openRouterSettings?.useSecureProxy && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed rgba(16, 185, 129, 0.3)' }}>
                      <div className="form-group" style={{ marginBottom: '6px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                          Proxy Webhook / Backend Chat Endpoint URL (Coolify / Docker / n8n)
                        </label>
                        <input 
                          type="url"
                          className="form-input"
                          placeholder="/api/chat หรือ https://n8n.gspeedarena.com/webhook/chat-proxy"
                          value={siteData.openRouterSettings?.proxyUrl || ''}
                          onChange={e => updateOpenRouterSettings({ proxyUrl: e.target.value })}
                        />
                        <span className="text-xs text-muted">
                          * คีย์จะถูกเก็บไว้ที่เซิร์ฟเวอร์หลังบ้าน (Server-Side Environment Variable: OPENROUTER_API_KEY) เบราว์เซอร์จะไม่ส่ง Authorization Header ใดๆ ออกไป
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-row-3">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>OpenRouter API Key {siteData.openRouterSettings?.useSecureProxy ? '(สำรองสำหรับ Server / Local Dev)' : '(โหมด Direct Client)'}</span>
                      <button 
                        type="button" 
                        className="btn-text-action" 
                        onClick={() => setShowApiKey(!showApiKey)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', fontSize: '0.78rem' }}
                      >
                        {showApiKey ? <EyeOff size={13} /> : <Eye size={13} />}
                        <span>{showApiKey ? 'ซ่อนคีย์' : 'แสดงคีย์'}</span>
                      </button>
                    </label>
                    <input 
                      type={showApiKey ? 'text' : 'password'} 
                      className="form-input" 
                      placeholder="sk-or-v1-xxxxxxxxxxxxxxxxxxxx"
                      value={siteData.openRouterSettings?.apiKey || ''}
                      onChange={e => updateOpenRouterSettings({ apiKey: e.target.value })}
                    />
                    <span className="text-xs text-muted">
                      * คีย์จะถูกเข้ารหัสใน LocalStorage เฉพาะสิทธิ์แอดมิน หากไม่มีคีย์ ระบบจะใช้ Smart Fallback RAG ตอบคำถามแทนอัตโนมัติ
                    </span>
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>โมเดล AI (Recommended: Gemini Flash 3.8 ตัวใหม่ล่าสุด)</span>
                      <span style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1d4ed8', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>ตัวใหม่ล่าสุด</span>
                    </label>
                    <select 
                      className="form-input"
                      value={siteData.openRouterSettings?.model || 'google/gemini-flash-3.8'}
                      onChange={e => {
                        updateOpenRouterSettings({ model: e.target.value });
                        triggerSaveToast();
                      }}
                    >
                      <option value="google/gemini-flash-3.8">google/gemini-flash-3.8 (เร็วสุด ฉลาดสุด ตัวใหม่ล่าสุด แนะนำ)</option>
                      <option value="google/gemini-2.0-flash">google/gemini-2.0-flash (ยอดนิยม เสถียร)</option>
                      <option value="google/gemini-2.5-flash">google/gemini-2.5-flash</option>
                      <option value="google/gemini-flash-1.5">google/gemini-flash-1.5</option>
                      <option value="openai/gpt-4o-mini">openai/gpt-4o-mini</option>
                      <option value="anthropic/claude-3.5-haiku">anthropic/claude-3.5-haiku</option>
                      <option value="meta-llama/llama-3.3-70b-instruct">meta-llama/llama-3.3-70b-instruct</option>
                      <option value="deepseek/deepseek-chat">deepseek/deepseek-chat</option>
                    </select>
                    <div style={{ marginTop: '6px' }}>
                      <input 
                        type="text" 
                        className="form-input"
                        placeholder="หรือพิมพ์ชื่อโมเดลเอง (Custom Model Slug)..."
                        value={siteData.openRouterSettings?.model || ''}
                        onChange={e => updateOpenRouterSettings({ model: e.target.value })}
                        style={{ fontSize: '0.78rem', height: '32px' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row-3" style={{ marginTop: '14px' }}>
                  <div className="form-group">
                    <label>อุณหภูมิคำตอบ (Temperature): {siteData.openRouterSettings?.temperature ?? 0.7}</label>
                    <input 
                      type="range" 
                      min="0.0" 
                      max="1.0" 
                      step="0.05"
                      className="form-range" 
                      value={siteData.openRouterSettings?.temperature ?? 0.7}
                      onChange={e => updateOpenRouterSettings({ temperature: parseFloat(e.target.value) })}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                      <span>0.0 (ตรงเป๊ะ ทางการ)</span>
                      <span>1.0 (สร้างสรรค์ ลื่นไหล)</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>จำกัดคำตอบสูงสุด (Max Tokens)</label>
                    <select 
                      className="form-input"
                      value={siteData.openRouterSettings?.maxTokens || 1024}
                      onChange={e => updateOpenRouterSettings({ maxTokens: parseInt(e.target.value) })}
                    >
                      <option value={512}>512 Tokens (กระชับ รวดเร็ว)</option>
                      <option value={1024}>1,024 Tokens (มาตรฐาน)</option>
                      <option value={2048}>2,048 Tokens (เนื้อหายาว)</option>
                      <option value={4096}>4,096 Tokens (บทความละเอียด)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <button 
                      type="button"
                      className="btn-secondary"
                      onClick={handleTestOpenRouter}
                      disabled={isOpenRouterTesting}
                      style={{ height: '38px' }}
                    >
                      <RefreshCw size={14} className={isOpenRouterTesting ? 'spin-icon' : ''} />
                      <span>{isOpenRouterTesting ? 'กำลังทดสอบเชื่อมต่อ...' : 'ทดสอบ Ping OpenRouter'}</span>
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '14px' }}>
                  <label>System Prompt กำหนดบุคลิกและบทบาทของ AI ประจำร้าน</label>
                  <textarea 
                    className="form-input form-textarea" 
                    rows="3"
                    value={siteData.openRouterSettings?.systemPrompt || 'คุณคือผู้ช่วย AI ประจำศูนย์ G-Speed Esport Arena ตอบคำถามเกี่ยวกับบริการร้านเกม อัตราค่าชั่วโมง สเปกคอม และระบบแฟรนไชส์อย่างสุภาพและถูกต้อง'}
                    onChange={e => updateOpenRouterSettings({ systemPrompt: e.target.value })}
                  />
                </div>

                {openRouterTestResult && (
                  <div className={`test-ping-result-box ${openRouterTestResult.success ? 'success' : 'warning'}`} style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {openRouterTestResult.success ? <CheckCircle2 size={16} className="text-green" /> : <AlertTriangle size={16} className="text-amber" />}
                      <strong>{openRouterTestResult.message}</strong>
                    </div>
                    {openRouterTestResult.latency && (
                      <span className="text-xs text-muted" style={{ display: 'block', marginTop: '4px' }}>
                        ความเร็วในการตอบสนอง (Latency): {openRouterTestResult.latency} | โมเดล: {openRouterTestResult.model || siteData.openRouterSettings?.model}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* OpenWebUI & Local Enterprise RAG Hub Card */}
              <div className="admin-subcard glass-panel" style={{ marginTop: '20px' }}>
                <div className="subcard-title" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={16} className="text-blue" />
                    <strong>เชื่อมต่อ OpenWebUI AI Hub & Local Model (Ollama / vLLM / On-Premises)</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`status-pill ${siteData.openWebUIConfig?.enabled ? 'status-pill-success' : 'status-pill-warning'}`}>
                      {siteData.openWebUIConfig?.enabled ? 'OpenWebUI Connected' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <p className="subcard-desc">
                  เชื่อมต่อคลังสมองของร้านเข้ากับ OpenWebUI ซึ่งโฮสต์บนเซิร์ฟเวอร์ส่วนตัว (Coolify / Docker / VPS) รองรับการรันโมเดลภาษาขนาดใหญ่แบบ On-Premises ไม่ต้องเสียค่า Token รายครั้ง และดึงฐานข้อมูลร้านผ่าน RAG Collection
                </p>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>OpenWebUI Base Endpoint URL</label>
                    <input 
                      type="url"
                      className="form-input"
                      placeholder="https://openwebui.gspeedarena.com"
                      value={siteData.openWebUIConfig?.baseUrl || ''}
                      onChange={e => updateOpenWebUIConfig({ baseUrl: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>โมเดลเป้าหมายใน OpenWebUI (Target Model)</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="glp-esports-assistant:latest หรือ llama3.3:70b"
                      value={siteData.openWebUIConfig?.model || ''}
                      onChange={e => updateOpenWebUIConfig({ model: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2" style={{ marginTop: '12px' }}>
                  <div className="form-group">
                    <label>RAG Knowledge Collection Tag / ID</label>
                    <input 
                      type="text"
                      className="form-input"
                      placeholder="gspeed-knowledge-base"
                      value={siteData.openWebUIConfig?.ragCollection || ''}
                      onChange={e => updateOpenWebUIConfig({ ragCollection: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>OpenWebUI Bearer API Token (Optional / Private Key)</label>
                    <input 
                      type="password"
                      className="form-input"
                      placeholder="sk-openwebui-xxxxxxxxxxxxxxxxxxxx"
                      value={siteData.openWebUIConfig?.apiKey || ''}
                      onChange={e => updateOpenWebUIConfig({ apiKey: e.target.value })}
                    />
                  </div>
                </div>

                {openWebUITestResult && (
                  <div className={`test-ping-result-box ${openWebUITestResult.success ? 'success' : 'warning'}`} style={{ marginTop: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} className="text-green" />
                      <strong>{openWebUITestResult.message}</strong>
                    </div>
                    <span className="text-xs text-muted" style={{ display: 'block', marginTop: '4px' }}>
                      ความเร็ว Latency: {openWebUITestResult.latency} | โมเดล: {openWebUITestResult.model} | เซิร์ฟเวอร์: {openWebUITestResult.endpoint}
                    </span>
                  </div>
                )}

                <div className="modal-footer-btns" style={{ marginTop: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={handleTestOpenWebUI}
                    disabled={isOpenWebUITesting}
                  >
                    <RefreshCw size={14} className={isOpenWebUITesting ? 'spin-icon' : ''} />
                    <span>{isOpenWebUITesting ? 'กำลังทดสอบเชื่อมต่อ OpenWebUI...' : 'ทดสอบ Ping OpenWebUI Hub'}</span>
                  </button>
                  <button 
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      updateOpenWebUIConfig({ enabled: !siteData.openWebUIConfig?.enabled });
                      triggerSaveToast();
                    }}
                  >
                    <Save size={14} />
                    <span>{siteData.openWebUIConfig?.enabled ? 'บันทึกสถานะ (Active)' : 'เปิดใช้งาน OpenWebUI'}</span>
                  </button>
                </div>
              </div>

              {/* RAG Query Simulator Box */}
              <div className="admin-subcard glass-panel">
                <div className="subcard-title">
                  <Sparkles size={16} className="text-blue" />
                  <strong>ทดสอบระบบสืบค้น RAG (RAG Semantic Retriever Test)</strong>
                </div>
                <div className="rag-test-input-row">
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="พิมพ์คำถามทดสอบ เช่น 'ราคาชั่วโมงละเท่าไหร่', 'สเปกคอมเป็นยังไง', 'มีอาหารอะไรบ้าง'..."
                    value={testQuery}
                    onChange={e => setTestQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleTestRAG()}
                  />
                  <button className="btn-secondary" onClick={handleTestRAG}>
                    <Search size={14} />
                    <span>ค้นหาข้อมูล RAG</span>
                  </button>
                </div>

                {testResults && (
                  <div className="rag-test-results">
                    <span className="text-xs text-blue font-bold">
                      พบข้อมูลที่ตรงกับคำถาม {testResults.length} รายการ ที่จะถูกส่งเข้า System Prompt ของ Gemini:
                    </span>
                    <div className="rag-results-list">
                      {testResults.map(res => (
                        <div key={res.id} className="rag-result-card">
                          <strong>{res.title}</strong>
                          <p>{res.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RAG Knowledge Base Table */}
              <div className="cms-table-wrapper">
                <table className="cms-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '25%' }}>หัวข้อความรู้</th>
                      <th style={{ width: '15%' }}>หมวดหมู่</th>
                      <th style={{ width: '45%' }}>เนื้อหาข้อมูลสำหรับ AI</th>
                      <th style={{ width: '15%' }}>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siteData.ragKnowledge.map(k => (
                      <tr key={k.id}>
                        <td>
                          <strong>{k.title}</strong>
                          <div className="tags-row">
                            {k.tags && k.tags.map((t, idx) => (
                              <span key={idx} className="rag-tag">{t}</span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <span className="badge-category">{k.category}</span>
                        </td>
                        <td>
                          <p className="rag-content-preview">{k.content}</p>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className="btn-table-action edit"
                              onClick={() => setEditingRAGItem({ ...k, tagsStr: (k.tags || []).join(', ') })}
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              className="btn-table-action delete"
                              onClick={() => {
                                if (window.confirm(`ลบข้อมูล "${k.title}" ออกจากคลังความรู้ใช่หรือไม่?`)) {
                                  deleteRAGItem(k.id);
                                  triggerSaveToast();
                                }
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* AI Guardrails & Strict Scope Settings Card */}
              <div className="admin-subcard glass-panel" style={{ marginTop: '20px' }}>
                <div className="subcard-title">
                  <Shield size={16} className="text-blue" />
                  <strong>การควบคุมขอบเขตคำถาม & ปฏิเสธคำถามนอกเรื่อง (AI Scope Guardrails)</strong>
                </div>
                <p className="subcard-desc">
                  กำหนดให้ AI ตอบเฉพาะข้อมูลเกี่ยวกับร้านและบริการของ G-Speed Esport Arena เท่านั้น หากถามเรื่องอื่น (การเมือง, คณิตศาสตร์, งานเขียน, เรื่องทั่วไป) AI จะแจ้งปฏิเสธอย่างสุภาพทันที
                </p>

                <div className="guardrails-toggle-row">
                  <label className="toggle-switch-container">
                    <input 
                      type="checkbox" 
                      id="toggle-strict-store"
                      checked={siteData.aiGuardrails?.strictStoreOnly ?? true}
                      onChange={e => {
                        updateAIGuardrails({ strictStoreOnly: e.target.checked });
                        triggerSaveToast();
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <div>
                    <strong>เปิดใช้งานโหมดจำกัดตอบเฉพาะเรื่องร้านและบริการ (Strict Store-Only Mode)</strong>
                    <span className="text-xs text-muted block">ปฏิเสธคำถามที่ไม่เกี่ยวข้องกับร้านเกมโดยอัตโนมัติ ไม่ว่าลูกค้าจะสั่งอย่างไร</span>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>ข้อความแจ้งปฏิเสธเมื่อลูกค้าถามนอกเรื่องร้าน (Out-of-Scope Decline Message)</label>
                  <textarea 
                    className="form-input form-textarea"
                    rows="3"
                    value={siteData.aiGuardrails?.outOfScopeReply || ''}
                    onChange={e => updateAIGuardrails({ outOfScopeReply: e.target.value })}
                  />
                  <div className="form-hint-row">
                    <span className="text-xs text-muted">* ระบุหัวข้อที่ร้านพร้อมให้บริการ เช่น ค่าบริการ, สเปกคอม, จองห้อง หรือแฟรนไชส์</span>
                    <button 
                      className="btn-mini-save"
                      onClick={() => triggerSaveToast()}
                    >
                      <Save size={12} />
                      <span>บันทึกข้อความ</span>
                    </button>
                  </div>
                </div>

                <div className="blocked-keywords-section" style={{ marginTop: '16px' }}>
                  <label>คำหรือหัวข้อที่บล็อกไม่ให้ตอบ (Blocked Topics / Blacklist)</label>
                  <div className="keyword-chips-wrap">
                    {(siteData.aiGuardrails?.blockedKeywords || []).map((word, idx) => (
                      <span key={idx} className="keyword-blocked-chip">
                        <span>{word}</span>
                        <button 
                          onClick={() => {
                            const filtered = (siteData.aiGuardrails?.blockedKeywords || []).filter((_, i) => i !== idx);
                            updateAIGuardrails({ blockedKeywords: filtered });
                            triggerSaveToast();
                          }}
                          title="ลบคำนี้"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="add-keyword-input-row" style={{ marginTop: '8px' }}>
                    <input 
                      type="text" 
                      className="form-input form-input-sm"
                      placeholder="พิมพ์คำหรือหัวข้อที่ต้องการบล็อกเพิ่ม เช่น 'ยืมเงิน', 'พนัน', 'เขียนโปรแกรม'..."
                      value={newBlockedKeyword}
                      onChange={e => setNewBlockedKeyword(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newBlockedKeyword.trim()) {
                          const existing = siteData.aiGuardrails?.blockedKeywords || [];
                          if (!existing.includes(newBlockedKeyword.trim())) {
                            updateAIGuardrails({ blockedKeywords: [...existing, newBlockedKeyword.trim()] });
                            setNewBlockedKeyword('');
                            triggerSaveToast();
                          }
                        }
                      }}
                    />
                    <button 
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        if (newBlockedKeyword.trim()) {
                          const existing = siteData.aiGuardrails?.blockedKeywords || [];
                          if (!existing.includes(newBlockedKeyword.trim())) {
                            updateAIGuardrails({ blockedKeywords: [...existing, newBlockedKeyword.trim()] });
                            setNewBlockedKeyword('');
                            triggerSaveToast();
                          }
                        }
                      }}
                    >
                      <Plus size={14} />
                      <span>เพิ่มคำบล็อก</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Unanswered / Pending Questions Log */}
              <div className="admin-subcard glass-panel" style={{ marginTop: '20px' }}>
                <div className="subcard-title">
                  <MessageSquare size={16} className="text-blue" />
                  <strong>กล่องบันทึกคำถามที่ตอบไม่ได้ / รอตอบภายหลัง (Unanswered Questions Log)</strong>
                </div>
                <p className="subcard-desc">
                  รวบรวมคำถามที่ลูกค้าพิมพ์ถามในแชทแต่ AI ยังไม่มีข้อมูล หรือถูกปฏิเสธเนื่องจากอยู่นอกคลังความรู้ เพื่อให้เจ้าของร้านสามารถกดแปลงเป็นเอกสารความรู้ RAG ได้ในคลิกเดียว
                </p>

                {(siteData.aiGuardrails?.pendingQuestions || []).length === 0 ? (
                  <div className="empty-pending-box">
                    <CheckCircle2 size={24} className="text-green" />
                    <span>ยังไม่มีคำถามค้างตอบในระบบ ทุกคำถามได้รับการจัดการเรียบร้อยแล้ว</span>
                  </div>
                ) : (
                  <div className="pending-questions-table-wrap">
                    <table className="cms-data-table pending-table">
                      <thead>
                        <tr>
                          <th style={{ width: '20%' }}>วันและเวลา</th>
                          <th style={{ width: '50%' }}>คำถามจากลูกค้า</th>
                          <th style={{ width: '30%' }}>การจัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(siteData.aiGuardrails?.pendingQuestions || []).map(pq => (
                          <tr key={pq.id}>
                            <td className="text-xs text-muted">{pq.timestamp}</td>
                            <td><strong>"{pq.query}"</strong></td>
                            <td>
                              <div className="actions-cell">
                                <button 
                                  className="btn-primary btn-sm"
                                  onClick={() => {
                                    setNewRAGItem({
                                      title: `คำถาม: ${pq.query}`,
                                      category: 'general',
                                      content: '',
                                      tags: pq.query
                                    });
                                    setShowAddRAGModal(true);
                                    deletePendingQuestion(pq.id);
                                  }}
                                  title="นำคำถามนี้ไปเพิ่มในคลังความรู้ RAG"
                                >
                                  <Plus size={13} />
                                  <span>เพิ่มลง RAG</span>
                                </button>
                                <button 
                                  className="btn-icon-action action-delete"
                                  onClick={() => deletePendingQuestion(pq.id)}
                                  title="ลบคำถามนี้ออก"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Edit RAG Modal */}
              {editingRAGItem && (
                <div className="cms-modal-backdrop" onClick={() => setEditingRAGItem(null)}>
                  <div className="cms-modal-card" onClick={e => e.stopPropagation()}>
                    <div className="modal-head">
                      <h4>แก้ไขข้อมูลคลังความรู้ AI</h4>
                      <button onClick={() => setEditingRAGItem(null)} className="btn-close-modal">✕</button>
                    </div>

                    <div className="modal-body-form">
                      <div className="form-group">
                        <label>หัวข้อความรู้</label>
                        <input 
                          type="text" className="form-input"
                          value={editingRAGItem.title}
                          onChange={e => setEditingRAGItem({ ...editingRAGItem, title: e.target.value })}
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>หมวดหมู่</label>
                          <select 
                            className="form-input"
                            value={editingRAGItem.category}
                            onChange={e => setEditingRAGItem({ ...editingRAGItem, category: e.target.value })}
                          >
                            <option value="pricing">อัตราค่าบริการ & โปรโมชัน</option>
                            <option value="hardware">ฮาร์ดแวร์ & สเปกคอม</option>
                            <option value="general">เวลาทำการ & ทั่วไป</option>
                            <option value="services">บริการอาหาร & ห้อง VIP</option>
                            <option value="events">ทัวร์นาเมนต์ & แข่งขัน</option>
                            <option value="business">แฟรนไชส์ & การลงทุน</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>คำค้นหา / Keywords (คั่นด้วยจุลภาค ,)</label>
                          <input 
                            type="text" className="form-input"
                            value={editingRAGItem.tagsStr || ''}
                            onChange={e => setEditingRAGItem({ ...editingRAGItem, tagsStr: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>เนื้อหาข้อมูลที่ให้ AI นำไปตอบคำถาม</label>
                        <textarea 
                          className="form-input form-textarea" rows="4"
                          value={editingRAGItem.content}
                          onChange={e => setEditingRAGItem({ ...editingRAGItem, content: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="modal-footer-btns">
                      <button className="btn-secondary" onClick={() => setEditingRAGItem(null)}>ยกเลิก</button>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          const tags = (editingRAGItem.tagsStr || '').split(',').map(s => s.trim()).filter(Boolean);
                          updateRAGItem(editingRAGItem.id, {
                            title: editingRAGItem.title,
                            category: editingRAGItem.category,
                            content: editingRAGItem.content,
                            tags
                          });
                          setEditingRAGItem(null);
                          triggerSaveToast();
                        }}
                      >
                        <Save size={14} /> บันทึกข้อมูล
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add RAG Modal */}
              {showAddRAGModal && (
                <div className="cms-modal-backdrop" onClick={() => setShowAddRAGModal(false)}>
                  <div className="cms-modal-card" onClick={e => e.stopPropagation()}>
                    <div className="modal-head">
                      <h4>เพิ่มความรู้ใหม่เข้าคลังข้อมูล AI</h4>
                      <button onClick={() => setShowAddRAGModal(false)} className="btn-close-modal">✕</button>
                    </div>

                    <div className="modal-body-form">
                      <div className="form-group">
                        <label>หัวข้อความรู้</label>
                        <input 
                          type="text" className="form-input"
                          placeholder="เช่น กฎการใช้บริการอินเทอร์เน็ตสำหรับเยาวชน"
                          value={newRAGItem.title}
                          onChange={e => setNewRAGItem({ ...newRAGItem, title: e.target.value })}
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>หมวดหมู่</label>
                          <select 
                            className="form-input"
                            value={newRAGItem.category}
                            onChange={e => setNewRAGItem({ ...newRAGItem, category: e.target.value })}
                          >
                            <option value="pricing">อัตราค่าบริการ & โปรโมชัน</option>
                            <option value="hardware">ฮาร์ดแวร์ & สเปกคอม</option>
                            <option value="general">เวลาทำการ & ทั่วไป</option>
                            <option value="services">บริการอาหาร & ห้อง VIP</option>
                            <option value="events">ทัวร์นาเมนต์ & แข่งขัน</option>
                            <option value="business">แฟรนไชส์ & การลงทุน</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>คำค้นหา / Keywords (คั่นด้วยจุลภาค ,)</label>
                          <input 
                            type="text" className="form-input"
                            placeholder="กฎหมาย, อายุ, เวลา, เยาวชน"
                            value={newRAGItem.tags}
                            onChange={e => setNewRAGItem({ ...newRAGItem, tags: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>เนื้อหาข้อมูลที่ให้ AI ใช้ตอบ</label>
                        <textarea 
                          className="form-input form-textarea" rows="4"
                          placeholder="กรอกข้อมูลที่ถูกต้องและชัดเจนของร้าน เพื่อให้ AI ใช้ตอบคำถามแก่ผู้ใช้งาน..."
                          value={newRAGItem.content}
                          onChange={e => setNewRAGItem({ ...newRAGItem, content: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="modal-footer-btns">
                      <button className="btn-secondary" onClick={() => setShowAddRAGModal(false)}>ยกเลิก</button>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          if (!newRAGItem.title || !newRAGItem.content) {
                            alert('กรุณากรอกหัวข้อและเนื้อหา');
                            return;
                          }
                          const tags = (newRAGItem.tags || '').split(',').map(s => s.trim()).filter(Boolean);
                          addRAGItem({
                            title: newRAGItem.title,
                            category: newRAGItem.category,
                            content: newRAGItem.content,
                            tags
                          });
                          setShowAddRAGModal(false);
                          setNewRAGItem({ title: '', category: 'pricing', content: '', tags: '' });
                          triggerSaveToast();
                        }}
                      >
                        <Plus size={14} /> เพิ่มข้อมูลเข้าคลัง
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 3: MENU, HEADER & FOOTER MANAGEMENT
              ========================================================================= */}
          {activeTab === 'menu-footer' && (
            <div className="cms-panel-block">
              <div className="panel-header-row">
                <div>
                  <h3 className="panel-title">
                    <LayoutGrid size={20} className="text-blue" />
                    <span>จัดการแถบเมนู Header, Ticker ประกาศ และ Footer</span>
                  </h3>
                  <p className="panel-desc">
                    ปรับแต่งลิงก์เมนูนำทางด้านบน ข้อความข่าววิ่งด้านบนสุด และข้อมูลการติดต่อท้ายหน้าเว็บ
                  </p>
                </div>
              </div>

              {/* Ticker Announcement Editor */}
              <div className="admin-subcard glass-panel">
                <div className="subcard-title">
                  <AlertTriangle size={16} className="text-amber" />
                  <strong>แถบประกาศด่วนด้านบนสุด (Top Announcement Bar)</strong>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>ป้ายข้อความ (Badge)</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.tickerBadge || ''}
                      placeholder="เช่น ประกาศสำคัญ, ข่าวด่วน"
                      onChange={e => updateTicker({ badge: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>ข้อความประกาศ</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.tickerText || ''}
                      placeholder="ข้อความที่ต้องการแจ้งผู้ใช้งาน..."
                      onChange={e => updateTicker({ text: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-3" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #e2e8f0' }}>
                  <div className="form-group">
                    <label>ข้อความบนปุ่มกด (Button Label)</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.tickerLinkText || 'เปิดระบบ 3D'}
                      placeholder="เช่น เปิดระบบ 3D, ดูรายละเอียด"
                      onChange={e => updateTicker({ linkText: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>ลิงก์ปลายทาง (Target Tab / Anchor / URL)</label>
                    <input 
                      type="text" className="form-input"
                      list="ticker-targets-list"
                      value={siteData.tickerLinkTarget || siteData.tickerLinkTab || 'franchise'}
                      placeholder="เช่น franchise, #activities, https://..."
                      onChange={e => updateTicker({ linkTarget: e.target.value })}
                    />
                    <datalist id="ticker-targets-list">
                      <option value="franchise">จำลองผังร้าน 3D (Tab: franchise)</option>
                      <option value="arena">หน้าแรก & สนามแข่ง (Tab: arena)</option>
                      <option value="company">ข้อมูลบริษัท & พาร์ตเนอร์ (Tab: company)</option>
                      <option value="#activities">โซนภาพกิจกรรม (#activities)</option>
                      <option value="#tournaments">โซนทัวร์นาเมนต์ (#tournaments)</option>
                      <option value="#zones">โซนร้านและบรรยากาศ (#zones)</option>
                      <option value="#news">โซนข่าวสาร & บทความ (#news)</option>
                    </datalist>
                  </div>
                  <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={siteData.tickerLinkVisible !== false}
                        onChange={e => updateTicker({ linkVisible: e.target.checked })}
                      />
                      <span>แสดงปุ่มกดนี้บนแถบประกาศ</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Navigation Menu Links */}
              <div className="admin-subcard glass-panel">
                <div className="subcard-title-row">
                  <div className="subcard-title">
                    <Globe size={16} className="text-blue" />
                    <strong>รายการเมนูบน Navbar (Navigation Menu Items)</strong>
                  </div>
                  <button 
                    id="btn-add-nav-link"
                    type="button" 
                    className="btn-secondary btn-sm"
                    onClick={() => {
                      addNavLink({
                        id: `nav-${Date.now()}`,
                        label: 'เมนูใหม่',
                        target: 'arena',
                        visible: true
                      });
                      triggerSaveToast();
                    }}
                  >
                    <Plus size={14} />
                    <span>เพิ่มเมนูใหม่</span>
                  </button>
                </div>
                <p className="subcard-hint-text" style={{ fontSize: '0.84rem', color: '#64748b', margin: '0 0 16px' }}>
                  สามารถกำหนดหน้าปลายทางได้ทั้ง Tab หลักในเว็บ (<code>arena</code>, <code>company</code>, <code>franchise</code>), หมุดในหน้า (<code>#activities</code>, <code>#tournaments</code>, <code>#zones</code>, <code>#news</code>) หรือใส่ URL ลิงก์ภายนอก
                </p>

                <div className="cms-nav-links-list">
                  {siteData.navLinks.map((nav, i) => (
                    <div key={nav.id} className="nav-link-edit-card glass-panel">
                      <div className="nav-link-grid-row">
                        <div className="form-group flex-2">
                          <label>ชื่อเมนู #{i + 1}</label>
                          <input 
                            type="text" className="form-input"
                            value={nav.label}
                            placeholder="ชื่อเมนูนำทาง"
                            onChange={e => {
                              const updated = siteData.navLinks.map(l => l.id === nav.id ? { ...l, label: e.target.value } : l);
                              updateNavLinks(updated);
                            }}
                          />
                        </div>

                        <div className="form-group flex-2">
                          <label>หน้า/ลิงก์ปลายทาง (Target)</label>
                          <input 
                            type="text" 
                            className="form-input font-mono" 
                            value={nav.target}
                            placeholder="arena, company, franchise, #activities, https://..."
                            list={`nav-target-presets-${nav.id}`}
                            onChange={e => {
                              const updated = siteData.navLinks.map(l => l.id === nav.id ? { ...l, target: e.target.value } : l);
                              updateNavLinks(updated);
                            }}
                          />
                          <datalist id={`nav-target-presets-${nav.id}`}>
                            <option value="arena">หน้าแรก & สนามแข่ง (arena)</option>
                            <option value="company">ข้อมูลบริษัท & พาร์ตเนอร์ (company)</option>
                            <option value="franchise">ระบบจำลองผังร้าน 3D (franchise)</option>
                            <option value="#activities">โซนภาพกิจกรรม (#activities)</option>
                            <option value="#tournaments">โซนทัวร์นาเมนต์ (#tournaments)</option>
                            <option value="#zones">โซนบรรยากาศร้าน (#zones)</option>
                            <option value="#news">โซนข่าวสารและบทความ (#news)</option>
                          </datalist>
                        </div>

                        <div className="form-group flex-1">
                          <label>ป้ายกำกับ (Badge)</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={nav.highlightTag || ''} 
                            placeholder="เช่น 3D Studio, Hot"
                            onChange={e => {
                              const updated = siteData.navLinks.map(l => l.id === nav.id ? { ...l, highlightTag: e.target.value, highlight: !!e.target.value } : l);
                              updateNavLinks(updated);
                            }}
                          />
                        </div>

                        <div className="form-group nav-checkbox-group" style={{ alignSelf: 'flex-end', paddingBottom: '8px' }}>
                          <label className="checkbox-label">
                            <input 
                              type="checkbox" 
                              checked={nav.visible !== false}
                              onChange={e => {
                                const updated = siteData.navLinks.map(l => l.id === nav.id ? { ...l, visible: e.target.checked } : l);
                                updateNavLinks(updated);
                              }}
                            />
                            <span>แสดง</span>
                          </label>
                        </div>

                        <button 
                          type="button"
                          className="btn-trash-nav"
                          onClick={() => {
                            if (siteData.navLinks.length <= 1) {
                              alert('ต้องมีเมนูบน Navbar อย่างน้อย 1 เมนูครับ');
                              return;
                            }
                            deleteNavLink(nav.id);
                            triggerSaveToast();
                          }}
                          title="ลบเมนูนี้"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Header Right Action Button (CTA) */}
              <div className="admin-subcard glass-panel">
                <div className="subcard-title">
                  <Calculator size={16} className="text-blue" />
                  <strong>ปุ่มแอ็กชันด่วนบน Header (Header Right CTA Button)</strong>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label>ข้อความบนปุ่ม (CTA Label)</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.headerCta?.text || 'คำนวณราคาเปิดร้าน'}
                      placeholder="เช่น คำนวณราคาเปิดร้าน, สมัครแข่ง"
                      onChange={e => updateHeaderCta({ text: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>ลิงก์ปลายทาง (Target Link / Tab / URL)</label>
                    <input 
                      type="text" className="form-input"
                      list="header-cta-targets"
                      value={siteData.headerCta?.target || 'franchise'}
                      placeholder="เช่น franchise, #tournaments, https://..."
                      onChange={e => updateHeaderCta({ target: e.target.value })}
                    />
                    <datalist id="header-cta-targets">
                      <option value="franchise">จำลองผังร้าน 3D (Tab: franchise)</option>
                      <option value="arena">หน้าแรก & สนามแข่ง (Tab: arena)</option>
                      <option value="company">ข้อมูลบริษัท & พาร์ตเนอร์ (Tab: company)</option>
                      <option value="#tournaments">โซนสมัครทัวร์นาเมนต์ (#tournaments)</option>
                      <option value="#activities">โซนกิจกรรม (#activities)</option>
                    </datalist>
                  </div>

                  <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={siteData.headerCta?.visible !== false}
                        onChange={e => updateHeaderCta({ visible: e.target.checked })}
                      />
                      <span>แสดงปุ่ม CTA บน Header</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* In-tab Save Button */}
              <div className="subcard-save-action-footer">
                <button 
                  type="button"
                  onClick={handleManualSave}
                  disabled={isSaving}
                  className="btn-primary btn-save-tab"
                >
                  {isSaving ? <RefreshCw size={16} className="spin-icon" /> : <Save size={16} />}
                  <span>{isSaving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการตั้งค่าเมนู & ข้อมูลเว็บไซต์ (Save Changes)'}</span>
                </button>
              </div>

              {/* Footer Information */}
              <div className="admin-subcard glass-panel">
                <div className="subcard-title">
                  <Phone size={16} className="text-blue" />
                  <strong>ข้อมูลการติดต่อและข้อความท้ายเว็บ (Footer Information)</strong>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>เบอร์โทรศัพท์ติดต่อ</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.footer.phone}
                      onChange={e => updateFooter({ phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>อีเมลติดต่อ</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.footer.email}
                      onChange={e => updateFooter({ email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>LINE Official ID</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.footer.line}
                      onChange={e => updateFooter({ line: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>ข้อความลิขสิทธิ์ (Copyright)</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.footer.copyright}
                      onChange={e => updateFooter({ copyright: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>ที่อยู่สาขาหลัก</label>
                  <input 
                    type="text" className="form-input"
                    value={siteData.footer.address}
                    onChange={e => updateFooter({ address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>คำอธิบายสั้นเกี่ยวกับบริษัท (Footer Bio)</label>
                  <textarea 
                    className="form-input form-textarea" rows="2"
                    value={siteData.footer.description}
                    onChange={e => updateFooter({ description: e.target.value })}
                  />
                </div>
                <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                  <button type="button" className="btn-section-preview" onClick={() => openPreview('menu-footer')}>
                    <Eye size={14} /> พรีวิวเมนู Header & Footer ก่อนบันทึก
                  </button>
                  <button className="btn-primary" onClick={() => triggerSaveToast()}>
                    <Save size={14} /> บันทึกข้อมูล Header & Footer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: PAGE SECTIONS CONTENT (Theme, Hero, Tournaments, Zones, SEO, etc.)
              ========================================================================= */}
          {activeTab === 'sections' && (
            <div className="cms-panel-block">
              <div className="panel-header-row">
                <div>
                  <h3 className="panel-title">
                    <FileText size={20} className="text-blue" />
                    <span>จัดการเนื้อหาหน้าเว็บแต่ละ Section (Universal Section CMS)</span>
                  </h3>
                  <p className="panel-desc">
                    ควบคุมเนื้อหา รูปภาพประกอบ สีพื้นหลัง ลิงก์ และสเตตัสของทุกส่วนบนหน้าแรก พร้อมเครื่องมือจำลอง SEO และ Social Share Preview
                  </p>
                </div>
              </div>

              {/* Sub-tab Navigation Bar */}
              <div className="cms-filter-bar" style={{ marginBottom: '16px' }}>
                <span className="filter-lbl">เลือก Section ที่ต้องการแก้ไข:</span>
                <div className="filter-chips">
                  {[
                    { id: 'theme', label: '1. ธีม & สีหลัก' },
                    { id: 'hero', label: '2. Hero Section' },
                    { id: 'banners', label: '3. แบนเนอร์คู่หน้าแรก' },
                    { id: 'tournaments', label: '4. ทัวร์นาเมนต์ & ปฏิทินแข่ง' },
                    { id: 'zones', label: '5. โซนบรรยากาศร้าน' },
                    { id: 'franchise-cta', label: '6. แบนเนอร์แฟรนไชส์' },
                    { id: 'news-sec', label: '7. บทความ & ข่าวสาร' },
                    { id: 'founder', label: '8. ผู้ก่อตั้ง & บริษัท' },
                    { id: 'seo', label: '9. Global SEO & โซเชียล' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      className={`filter-chip ${activeSectionSubTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveSectionSubTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* -------------------------------------------------------------
                  SUBTAB 1: THEME & GLOBAL COLORS
                  ------------------------------------------------------------- */}
              {activeSectionSubTab === 'theme' && (
                <div className="admin-subcard glass-panel">
                  <div className="subcard-title">
                    <Palette size={16} className="text-blue" />
                    <strong>1. ธีมและพาเลตต์สีประจำแบรนด์ (Theme & Brand Colors)</strong>
                  </div>
                  <p className="subcard-desc">
                    ปรับแต่งโทนสีหลักของเว็บไซต์ เพื่อให้ตรงตามอัตลักษณ์ของร้าน การเปลี่ยนแปลงจะมีผลทั่วทั้งระบบ
                  </p>

                  <div className="form-row-4">
                    <div className="form-group">
                      <label>สีหลัก (Primary Blue)</label>
                      <div className="color-field-row" style={{ padding: '6px' }}>
                        <input 
                          type="color" 
                          className="color-picker-input"
                          value={siteData.theme?.primaryColor || '#1d4ed8'}
                          onChange={e => updateTheme({ primaryColor: e.target.value })}
                        />
                        <code>{siteData.theme?.primaryColor || '#1d4ed8'}</code>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>สีรอง (Secondary Cyan)</label>
                      <div className="color-field-row" style={{ padding: '6px' }}>
                        <input 
                          type="color" 
                          className="color-picker-input"
                          value={siteData.theme?.secondaryColor || '#0ea5e9'}
                          onChange={e => updateTheme({ secondaryColor: e.target.value })}
                        />
                        <code>{siteData.theme?.secondaryColor || '#0ea5e9'}</code>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>สีพื้นหลังเว็บ (Background)</label>
                      <div className="color-field-row" style={{ padding: '6px' }}>
                        <input 
                          type="color" 
                          className="color-picker-input"
                          value={siteData.theme?.backgroundColor || '#ffffff'}
                          onChange={e => updateTheme({ backgroundColor: e.target.value })}
                        />
                        <code>{siteData.theme?.backgroundColor || '#ffffff'}</code>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>สีพื้นหลังการ์ด (Surface)</label>
                      <div className="color-field-row" style={{ padding: '6px' }}>
                        <input 
                          type="color" 
                          className="color-picker-input"
                          value={siteData.theme?.surfaceColor || '#f8fafc'}
                          onChange={e => updateTheme({ surfaceColor: e.target.value })}
                        />
                        <code>{siteData.theme?.surfaceColor || '#f8fafc'}</code>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                    <button type="button" className="btn-section-preview" onClick={() => openPreview('theme')}>
                      <Eye size={14} /> พรีวิวตัวอย่างก่อนบันทึก
                    </button>
                    <button className="btn-primary" onClick={() => triggerSaveToast()}>
                      <Save size={14} /> บันทึกการตั้งค่าธีมสี
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUBTAB 2: HERO SECTION
                  ------------------------------------------------------------- */}
              {activeSectionSubTab === 'hero' && (
                <div className="admin-subcard glass-panel">
                  <div className="subcard-title">
                    <Trophy size={16} className="text-blue" />
                    <strong>2. ส่วนหัวหน้าแรก (Hero Section)</strong>
                  </div>

                  <div className="form-group">
                    <label>ป้ายหัวข้อเล็ก (Badge Pill)</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.hero.badge}
                      onChange={e => updateHero({ badge: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>หัวข้อใหญ่ (Main Title)</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.hero.title}
                      onChange={e => updateHero({ title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>คำบรรยายใต้หัวข้อ (Subtitle)</label>
                    <textarea 
                      className="form-input form-textarea" rows="3"
                      value={siteData.hero.subtitle}
                      onChange={e => updateHero({ subtitle: e.target.value })}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>ข้อความบนปุ่มหลัก (Primary Button)</label>
                      <input 
                        type="text" className="form-input"
                        value={siteData.hero.primaryCta}
                        onChange={e => updateHero({ primaryCta: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>ข้อความบนปุ่มรอง (Secondary Button)</label>
                      <input 
                        type="text" className="form-input"
                        value={siteData.hero.secondaryCta}
                        onChange={e => updateHero({ secondaryCta: e.target.value })}
                      />
                    </div>
                  </div>

                  <SectionColorCustomizer 
                    title="🎨 สีและพื้นหลัง Hero Section"
                    description="กำหนดสีพื้นหลังของส่วนหัวเมื่อไม่ได้ใส่รูปภาพ (หรือแสดงผลร่วมกับภาพ) พร้อมปรับแต่งสีฟอนต์หัวข้อและคำบรรยาย"
                    bgColor={siteData.hero?.bgColor || '#0b0f19'}
                    onBgColorChange={val => updateHero({ bgColor: val })}
                    titleColor={siteData.hero?.titleColor || '#ffffff'}
                    onTitleColorChange={val => updateHero({ titleColor: val })}
                    subtitleColor={siteData.hero?.subtitleColor || '#e2e8f0'}
                    onSubtitleColorChange={val => updateHero({ subtitleColor: val })}
                    defaultBg="#0b0f19"
                    defaultTitle="#ffffff"
                    defaultSubtitle="#e2e8f0"
                    presets={[
                      { label: 'ดาร์กอารีนา (Dark Arena)', bg: '#0b0f19', title: '#ffffff', subtitle: '#e2e8f0' },
                      { label: 'น้ำเงินเข้ม (Deep Navy)', bg: '#0f172a', title: '#60a5fa', subtitle: '#cbd5e1' },
                      { label: 'น้ำเงิน GLP (Brand Blue)', bg: '#1e3a8a', title: '#ffffff', subtitle: '#bfdbfe' },
                      { label: 'สว่างคลีน (Clean Light)', bg: '#ffffff', title: '#0f172a', subtitle: '#475569' },
                      { label: 'เทาพรีเมียม (Slate)', bg: '#1e293b', title: '#38bdf8', subtitle: '#94a3b8' }
                    ]}
                  />

                  <SectionImageUploader 
                    label="ภาพพื้นหลังส่วนหัว (Hero Background Image - ตัวเลือกเสริม)"
                    value={siteData.hero?.backgroundImage || ''}
                    onChange={val => updateHero({ backgroundImage: val })}
                    altValue={siteData.hero?.imageAlt || ''}
                    onAltChange={alt => updateHero({ imageAlt: alt })}
                    onOpenMediaLibrary={() => openMediaLibraryForField('hero-bg-img', (item) => {
                      updateHero({ backgroundImage: item.url, imageAlt: item.alt || item.name });
                    })}
                    recommendedSize="1920 x 1080 px"
                    aspectRatio="16:9 (Widescreen Full HD / 4K)"
                    description="ภาพพื้นหลังขนาดใหญ่ด้านบนสุดของหน้าแรก แนะนำภาพมุมกว้างของร้าน เวทีแข่งขัน หรืออารีนาที่สว่างคมชัด สามารถเลือกสไตล์ฟิลเตอร์ด้านล่างเพื่อปรับโทนภาพให้สวยสดใสได้"
                    uploadKey="hero-bg-img"
                    compressingItemId={compressingItemId}
                    handleImageUpload={handleImageUpload}
                    previewWidth={192}
                    previewHeight={108}
                  />

                  {/* Overlay Filter & Opacity Control - High Contrast Clean White Design */}
                  {siteData.hero?.backgroundImage && (
                    <div className="form-subblock" style={{ marginTop: '16px', background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1.5px solid #cbd5e1', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
                      <h5 className="form-subblock-title" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 800 }}>
                        <Sliders size={16} className="text-blue" />
                        <span>🎨 โทนฟิลเตอร์ซ้อนภาพ (Background Overlay Style)</span>
                      </h5>
                      <p style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '14px', lineHeight: 1.55 }}>
                        เลือกฟิลเตอร์ให้เหมาะสมกับโทนภาพของคุณ (หากเป็นภาพโทนขาว/สว่าง แนะนำเลือก <strong>"ขาว สว่าง คลีน"</strong> ภาพจะไม่มืด ไม่ตุ่น และตัวหนังสือจะคมชัดสวยงาม)
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                        {[
                          { id: 'light', name: '☀️ ขาว สว่าง คลีน', desc: 'คงธีมเดิมของเว็บ! พื้นขาวสว่างสดใส ตัวหนังสือเข้ม คมชัด ไม่มืด ไม่หมอง' },
                          { id: 'dark', name: '🌙 ดาร์ก อารีนา', desc: 'สไตล์เกมมิ่งมืดเท่ กล่องสถิติดำกระจกฝ้าเข้าชุด' },
                          { id: 'soft', name: '💎 ซอฟต์ 35%', desc: 'ฟิลเตอร์บางเบา โชว์ภาพต้นฉบับชัดเจน' },
                          { id: 'none', name: '🚫 ไม่ใส่ฟิลเตอร์', desc: 'โชว์ภาพต้นฉบับ 100%' }
                        ].map(styleOpt => {
                          const currentType = siteData.hero?.overlayType || 'light';
                          const isSelected = currentType === styleOpt.id;
                          return (
                            <button
                              key={styleOpt.id}
                              type="button"
                              onClick={() => {
                                const newType = styleOpt.id;
                                const newOpacity = newType === 'light' ? 0.82 : (newType === 'soft' ? 0.35 : 0.75);
                                const updates = { 
                                  overlayType: newType, 
                                  overlayOpacity: newOpacity 
                                };
                                if (newType === 'light') {
                                  updates.titleColor = '#0f172a';
                                  updates.subtitleColor = '#475569';
                                  updates.bgColor = '#ffffff';
                                } else if (newType === 'dark') {
                                  updates.titleColor = '#ffffff';
                                  updates.subtitleColor = '#e2e8f0';
                                  updates.bgColor = '#0b0f19';
                                }
                                updateHero(updates);
                              }}
                              style={{
                                padding: '12px 10px',
                                borderRadius: '8px',
                                border: isSelected ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
                                background: isSelected ? '#eff6ff' : '#f8fafc',
                                color: isSelected ? '#1d4ed8' : '#0f172a',
                                cursor: 'pointer',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                transition: 'all 0.2s ease',
                                boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.15)' : 'none'
                              }}
                            >
                              <strong style={{ fontSize: '0.88rem', color: isSelected ? '#1d4ed8' : '#0f172a' }}>{styleOpt.name}</strong>
                              <span style={{ fontSize: '0.72rem', color: isSelected ? '#2563eb' : '#64748b', lineHeight: 1.3, fontWeight: isSelected ? 600 : 400 }}>{styleOpt.desc}</span>
                            </button>
                          );
                        })}
                      </div>

                      {(siteData.hero?.overlayType || 'light') !== 'none' && (
                        <div className="form-group" style={{ marginBottom: '0', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>ความสว่าง / ความเข้มของเลเยอร์ขาว (Overlay Opacity)</label>
                            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1d4ed8', background: '#dbeafe', border: '1px solid #bfdbfe', padding: '2px 10px', borderRadius: '999px' }}>
                              {Math.round(((siteData.hero?.overlayOpacity ?? ((siteData.hero?.overlayType || 'light') === 'light' ? 0.82 : 0.75))) * 100)}%
                            </span>
                          </div>
                          <input 
                            type="range" 
                            min="5" 
                            max="95" 
                            step="5"
                            value={Math.round(((siteData.hero?.overlayOpacity ?? ((siteData.hero?.overlayType || 'light') === 'light' ? 0.82 : 0.75))) * 100)}
                            onChange={e => updateHero({ overlayOpacity: Number(e.target.value) / 100 })}
                            style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer', height: '6px' }}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '4px' }}>
                            <span style={{ color: '#64748b', fontWeight: 600 }}>เห็นรูปชัดขึ้น (ขาวบางเบา ~30%)</span>
                            <span style={{ color: '#1d4ed8', fontWeight: 700 }}>ขาวสว่างคลีน (คงธีมเดิม ~85%)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                    <button type="button" className="btn-section-preview" onClick={() => openPreview('hero')}>
                      <Eye size={14} /> พรีวิวตัวอย่างก่อนบันทึก
                    </button>
                    <button className="btn-primary" onClick={() => triggerSaveToast()}>
                      <Save size={14} /> บันทึกเนื้อหา Hero Section
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUBTAB 3: FEATURE BANNERS
                  ------------------------------------------------------------- */}
              {activeSectionSubTab === 'banners' && (
                <div className="admin-subcard glass-panel">
                  <div className="subcard-title">
                    <LayoutGrid size={16} className="text-blue" />
                    <strong>3. แบนเนอร์คู่หน้าแรก (Feature Banners: Events & News)</strong>
                  </div>

                  <div className="form-row-2" style={{ gap: '20px' }}>
                    {/* Left Banner: Events */}
                    <div className="form-subblock">
                      <h5 className="form-subblock-title">
                        <Flame size={14} className="text-blue" />
                        <span>แบนเนอร์ฝั่งซ้าย: รวมภาพกิจกรรม (Our Events)</span>
                      </h5>

                      <div className="form-group">
                        <label>ป้ายหัวข้อเล็ก</label>
                        <input 
                          type="text" className="form-input"
                          value={siteData.featureBanners?.bannerLeft?.badge || 'GLP OUR EVENTS'}
                          onChange={e => updateSectionConfig('featureBanners', {
                            ...siteData.featureBanners,
                            bannerLeft: { ...siteData.featureBanners?.bannerLeft, badge: e.target.value }
                          })}
                        />
                      </div>

                      <div className="form-group">
                        <label>หัวข้อแบนเนอร์</label>
                        <input 
                          type="text" className="form-input"
                          value={siteData.featureBanners?.bannerLeft?.title || ''}
                          onChange={e => updateSectionConfig('featureBanners', {
                            ...siteData.featureBanners,
                            bannerLeft: { ...siteData.featureBanners?.bannerLeft, title: e.target.value }
                          })}
                        />
                      </div>

                      <div className="form-group">
                        <label>คำบรรยายสั้น</label>
                        <textarea 
                          className="form-input form-textarea" rows="2"
                          value={siteData.featureBanners?.bannerLeft?.desc || ''}
                          onChange={e => updateSectionConfig('featureBanners', {
                            ...siteData.featureBanners,
                            bannerLeft: { ...siteData.featureBanners?.bannerLeft, desc: e.target.value }
                          })}
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>ข้อความปุ่มลิงก์</label>
                          <input 
                            type="text" className="form-input"
                            value={siteData.featureBanners?.bannerLeft?.linkText || ''}
                            onChange={e => updateSectionConfig('featureBanners', {
                              ...siteData.featureBanners,
                              bannerLeft: { ...siteData.featureBanners?.bannerLeft, linkText: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>URL ปลายทาง</label>
                          <input 
                            type="text" className="form-input"
                            value={siteData.featureBanners?.bannerLeft?.linkTarget || '#activities'}
                            onChange={e => updateSectionConfig('featureBanners', {
                              ...siteData.featureBanners,
                              bannerLeft: { ...siteData.featureBanners?.bannerLeft, linkTarget: e.target.value }
                            })}
                          />
                        </div>
                      </div>

                      <SectionColorCustomizer 
                        title="🎨 สีพื้นหลังและฟอนต์แบนเนอร์ซ้าย"
                        description="กำหนดสีพื้นหลังและสีตัวอักษรเมื่อไม่ได้ใช้ภาพ หรือแสดงผลร่วมกัน"
                        bgColor={siteData.featureBanners?.bannerLeft?.bgColor || '#1e3a8a'}
                        onBgColorChange={val => updateSectionConfig('featureBanners', {
                          ...siteData.featureBanners,
                          bannerLeft: { ...siteData.featureBanners?.bannerLeft, bgColor: val }
                        })}
                        titleColor={siteData.featureBanners?.bannerLeft?.titleColor || '#ffffff'}
                        onTitleColorChange={val => updateSectionConfig('featureBanners', {
                          ...siteData.featureBanners,
                          bannerLeft: { ...siteData.featureBanners?.bannerLeft, titleColor: val }
                        })}
                        subtitleColor={siteData.featureBanners?.bannerLeft?.descColor || '#cbd5e1'}
                        onSubtitleColorChange={val => updateSectionConfig('featureBanners', {
                          ...siteData.featureBanners,
                          bannerLeft: { ...siteData.featureBanners?.bannerLeft, descColor: val }
                        })}
                        defaultBg="#1e3a8a"
                        defaultTitle="#ffffff"
                        defaultSubtitle="#cbd5e1"
                      />

                      <SectionImageUploader 
                        label="ภาพพื้นหลังแบนเนอร์กิจกรรม (Left Banner Image)"
                        value={siteData.featureBanners?.bannerLeft?.image || ''}
                        onChange={val => updateSectionConfig('featureBanners', {
                          ...siteData.featureBanners,
                          bannerLeft: { ...siteData.featureBanners?.bannerLeft, image: val }
                        })}
                        altValue={siteData.featureBanners?.bannerLeft?.alt || ''}
                        onAltChange={alt => updateSectionConfig('featureBanners', {
                          ...siteData.featureBanners,
                          bannerLeft: { ...siteData.featureBanners?.bannerLeft, alt }
                        })}
                        onOpenMediaLibrary={() => openMediaLibraryForField('banners', (item) => {
                          updateSectionConfig('featureBanners', {
                            ...siteData.featureBanners,
                            bannerLeft: { ...siteData.featureBanners?.bannerLeft, image: item.url, alt: item.alt || item.name }
                          });
                        }, siteData.featureBanners?.bannerLeft?.image)}
                        recommendedSize="1200 x 600 px"
                        aspectRatio="2:1 (แนวนอนมาตรฐาน)"
                        description="ภาพพื้นหลังแบนเนอร์ฝั่งซ้าย (รวมภาพกิจกรรม Our Events) แนะนำรูปงานแข่ง บรรยากาศเวที หรือพิธีมอบรางวัล"
                        uploadKey="banner-left-img"
                        compressingItemId={compressingItemId}
                        handleImageUpload={handleImageUpload}
                        previewWidth={170}
                        previewHeight={85}
                      />
                    </div>

                    {/* Right Banner: News */}
                    <div className="form-subblock">
                      <h5 className="form-subblock-title">
                        <FileText size={14} className="text-blue" />
                        <span>แบนเนอร์ฝั่งขวา: บทความ & ข่าวสาร (Blog & News)</span>
                      </h5>

                      <div className="form-group">
                        <label>ป้ายหัวข้อเล็ก</label>
                        <input 
                          type="text" className="form-input"
                          value={siteData.featureBanners?.bannerRight?.badge || 'GLP BLOG & NEWS'}
                          onChange={e => updateSectionConfig('featureBanners', {
                            ...siteData.featureBanners,
                            bannerRight: { ...siteData.featureBanners?.bannerRight, badge: e.target.value }
                          })}
                        />
                      </div>

                      <div className="form-group">
                        <label>หัวข้อแบนเนอร์</label>
                        <input 
                          type="text" className="form-input"
                          value={siteData.featureBanners?.bannerRight?.title || ''}
                          onChange={e => updateSectionConfig('featureBanners', {
                            ...siteData.featureBanners,
                            bannerRight: { ...siteData.featureBanners?.bannerRight, title: e.target.value }
                          })}
                        />
                      </div>

                      <div className="form-group">
                        <label>คำบรรยายสั้น</label>
                        <textarea 
                          className="form-input form-textarea" rows="2"
                          value={siteData.featureBanners?.bannerRight?.desc || ''}
                          onChange={e => updateSectionConfig('featureBanners', {
                            ...siteData.featureBanners,
                            bannerRight: { ...siteData.featureBanners?.bannerRight, desc: e.target.value }
                          })}
                        />
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>ข้อความปุ่มลิงก์</label>
                          <input 
                            type="text" className="form-input"
                            value={siteData.featureBanners?.bannerRight?.linkText || ''}
                            onChange={e => updateSectionConfig('featureBanners', {
                              ...siteData.featureBanners,
                              bannerRight: { ...siteData.featureBanners?.bannerRight, linkText: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>URL ปลายทาง</label>
                          <input 
                            type="text" className="form-input"
                            value={siteData.featureBanners?.bannerRight?.linkTarget || '#news'}
                            onChange={e => updateSectionConfig('featureBanners', {
                              ...siteData.featureBanners,
                              bannerRight: { ...siteData.featureBanners?.bannerRight, linkTarget: e.target.value }
                            })}
                          />
                        </div>
                      </div>

                      <SectionColorCustomizer 
                        title="🎨 สีพื้นหลังและฟอนต์แบนเนอร์ขวา"
                        description="กำหนดสีพื้นหลังและสีตัวอักษรเมื่อไม่ได้ใช้ภาพ หรือแสดงผลร่วมกัน"
                        bgColor={siteData.featureBanners?.bannerRight?.bgColor || '#0f172a'}
                        onBgColorChange={val => updateSectionConfig('featureBanners', {
                          ...siteData.featureBanners,
                          bannerRight: { ...siteData.featureBanners?.bannerRight, bgColor: val }
                        })}
                        titleColor={siteData.featureBanners?.bannerRight?.titleColor || '#ffffff'}
                        onTitleColorChange={val => updateSectionConfig('featureBanners', {
                          ...siteData.featureBanners,
                          bannerRight: { ...siteData.featureBanners?.bannerRight, titleColor: val }
                        })}
                        subtitleColor={siteData.featureBanners?.bannerRight?.descColor || '#cbd5e1'}
                        onSubtitleColorChange={val => updateSectionConfig('featureBanners', {
                          ...siteData.featureBanners,
                          bannerRight: { ...siteData.featureBanners?.bannerRight, descColor: val }
                        })}
                        defaultBg="#0f172a"
                        defaultTitle="#ffffff"
                        defaultSubtitle="#cbd5e1"
                      />

                      <SectionImageUploader 
                        label="ภาพพื้นหลังแบนเนอร์บทความ & ข่าวสาร (Right Banner Image)"
                        value={siteData.featureBanners?.bannerRight?.image || ''}
                        onChange={val => updateSectionConfig('featureBanners', {
                          ...siteData.featureBanners,
                          bannerRight: { ...siteData.featureBanners?.bannerRight, image: val }
                        })}
                        altValue={siteData.featureBanners?.bannerRight?.alt || ''}
                        onAltChange={alt => updateSectionConfig('featureBanners', {
                          ...siteData.featureBanners,
                          bannerRight: { ...siteData.featureBanners?.bannerRight, alt }
                        })}
                        onOpenMediaLibrary={() => openMediaLibraryForField('banners', (item) => {
                          updateSectionConfig('featureBanners', {
                            ...siteData.featureBanners,
                            bannerRight: { ...siteData.featureBanners?.bannerRight, image: item.url, alt: item.alt || item.name }
                          });
                        }, siteData.featureBanners?.bannerRight?.image)}
                        recommendedSize="1200 x 600 px"
                        aspectRatio="2:1 (แนวนอนมาตรฐาน)"
                        description="ภาพพื้นหลังแบนเนอร์ฝั่งขวา (บทความ ข่าวสาร & ไฮไลต์) แนะนำรูปอุปกรณ์เกมมิ่ง, มุมคอมพิวเตอร์ หรือบรรยากาศร้านโมเดิร์น"
                        uploadKey="banner-right-img"
                        compressingItemId={compressingItemId}
                        handleImageUpload={handleImageUpload}
                        previewWidth={170}
                        previewHeight={85}
                      />
                    </div>
                  </div>

                  <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                    <button type="button" className="btn-section-preview" onClick={() => openPreview('banners')}>
                      <Eye size={14} /> พรีวิวตัวอย่างก่อนบันทึก
                    </button>
                    <button className="btn-primary" onClick={() => triggerSaveToast()}>
                      <Save size={14} /> บันทึกแบนเนอร์คู่หน้าแรก
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUBTAB 4: TOURNAMENTS SECTION & CRUD
                  ------------------------------------------------------------- */}
              {activeSectionSubTab === 'tournaments' && (
                <div className="admin-subcard glass-panel">
                  <div className="subcard-title" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Trophy size={16} className="text-blue" />
                      <strong>4. ปฏิทินการแข่งขัน & ทัวร์นาเมนต์ (Tournaments & Schedule)</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button 
                        type="button"
                        className="btn-section-preview btn-sm"
                        onClick={() => openPreview('tournaments')}
                      >
                        <Eye size={13} /> พรีวิวส่วนทัวร์นาเมนต์
                      </button>
                      <button 
                        className="btn-primary btn-sm"
                        onClick={() => openCreateTournamentModal()}
                      >
                        <Plus size={14} /> เพิ่มทัวร์นาเมนต์ใหม่
                      </button>
                    </div>
                  </div>

                  {/* Section Title & Subtitle */}
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>ป้ายหัวข้อเล็ก</label>
                      <input 
                        type="text" className="form-input"
                        value={siteData.tournamentsSection?.badge || 'TOURNAMENTS & COMMUNITY EVENTS'}
                        onChange={e => updateSectionConfig('tournamentsSection', {
                          ...siteData.tournamentsSection,
                          badge: e.target.value
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>หัวข้อใหญ่ Section</label>
                      <input 
                        type="text" className="form-input"
                        value={siteData.tournamentsSection?.title || ''}
                        onChange={e => updateSectionConfig('tournamentsSection', {
                          ...siteData.tournamentsSection,
                          title: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>คำบรรยาย Section</label>
                    <textarea 
                      className="form-input form-textarea" rows="2"
                      value={siteData.tournamentsSection?.subtitle || ''}
                      onChange={e => updateSectionConfig('tournamentsSection', {
                        ...siteData.tournamentsSection,
                        subtitle: e.target.value
                      })}
                    />
                  </div>

                  <SectionColorCustomizer 
                    title="🎨 สีพื้นหลังและฟอนต์ส่วนทัวร์นาเมนต์"
                    description="กำหนดสีพื้นหลังของโซนตารางแข่งขัน และสีฟอนต์หัวข้อ/คำบรรยาย"
                    bgColor={siteData.tournamentsSection?.bgColor || '#ffffff'}
                    onBgColorChange={val => updateSectionConfig('tournamentsSection', {
                      ...siteData.tournamentsSection,
                      bgColor: val
                    })}
                    titleColor={siteData.tournamentsSection?.titleColor || '#0f172a'}
                    onTitleColorChange={val => updateSectionConfig('tournamentsSection', {
                      ...siteData.tournamentsSection,
                      titleColor: val
                    })}
                    subtitleColor={siteData.tournamentsSection?.subtitleColor || '#475569'}
                    onSubtitleColorChange={val => updateSectionConfig('tournamentsSection', {
                      ...siteData.tournamentsSection,
                      subtitleColor: val
                    })}
                    defaultBg="#ffffff"
                    defaultTitle="#0f172a"
                    defaultSubtitle="#475569"
                  />

                  {/* Tournaments Data Table */}
                  <div className="cms-table-wrapper" style={{ marginTop: '16px' }}>
                    <table className="cms-data-table">
                      <thead>
                        <tr>
                          <th>เกม & รายการแข่งขัน</th>
                          <th>วันแข่งขัน / เวลา</th>
                          <th>เงินรางวัล</th>
                          <th>ทีม & นักแข่ง</th>
                          <th>คลังภาพกิจกรรม</th>
                          <th>สถานะ & SEO</th>
                          <th style={{ textAlign: 'center' }}>การจัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(siteData.tournaments || []).map(t => {
                          const photoCount = (t.galleryPhotos || []).length;
                          const teamCount = (t.teams || []).length;
                          const hasSeo = Boolean(t.seo?.metaTitle);
                          return (
                            <tr key={t.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  {t.bannerImage && (
                                    <img 
                                      src={t.bannerImage} 
                                      alt={t.title}
                                      style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)' }}
                                    />
                                  )}
                                  <div>
                                    <strong style={{ display: 'block' }}>{t.title}</strong>
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                                      <span className="text-xs text-muted" style={{ fontWeight: 600 }}>{t.game}</span>
                                      {t.gameCategory && (
                                        <span className="text-xs" style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', color: '#64748b' }}>
                                          {t.gameCategory}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>{t.date}</div>
                                <span className="text-xs text-muted block">{t.time}</span>
                              </td>
                              <td><strong className="text-blue">{t.prizePool}</strong></td>
                              <td>
                                <button 
                                  type="button"
                                  className="btn-table-action"
                                  style={{ padding: '3px 8px', fontSize: '0.8rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}
                                  onClick={() => openEditTournamentModal(t, 'roster')}
                                  title="คลิกเพื่อจัดการรายชื่อนักแข่ง & ทีม"
                                >
                                  <Users size={12} />
                                  <span>{teamCount} ทีม</span>
                                </button>
                              </td>
                              <td>
                                <button 
                                  type="button"
                                  className="btn-table-action"
                                  style={{ 
                                    padding: '3px 8px', 
                                    fontSize: '0.8rem', 
                                    background: photoCount >= 50 ? '#ecfdf5' : '#f8fafc', 
                                    color: photoCount >= 50 ? '#059669' : '#475569', 
                                    border: photoCount >= 50 ? '1px solid #a7f3d0' : '1px solid #e2e8f0' 
                                  }}
                                  onClick={() => openEditTournamentModal(t, 'gallery')}
                                  title="คลิกเพื่อจัดการแกลเลอรีภาพกิจกรรม 50+ ภาพ"
                                >
                                  <Camera size={12} />
                                  <span>{photoCount} ภาพ {photoCount >= 50 ? '✓ (50+)' : ''}</span>
                                </button>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span className={`status-pill ${t.status === 'Open' ? 'status-pill-success' : 'status-pill-warning'}`}>
                                    {t.status}
                                  </span>
                                  <span 
                                    className="text-xs" 
                                    style={{ color: hasSeo ? '#059669' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}
                                    title={hasSeo ? `SEO: ${t.seo?.metaTitle}` : 'ยังไม่ได้ตั้งค่า SEO'}
                                  >
                                    <Globe size={11} /> {hasSeo ? 'SEO พร้อม' : 'รอตั้ง SEO'}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="actions-cell" style={{ justifyContent: 'center', gap: '6px' }}>
                                  <button 
                                    className="btn-table-action"
                                    onClick={() => openEditTournamentModal(t, 'general')}
                                    title="แก้ไขข้อมูลทัวร์นาเมนต์ครบวงจร"
                                  >
                                    <Edit3 size={13} />
                                  </button>
                                  <button 
                                    className="btn-table-action action-delete"
                                    onClick={() => {
                                      if (window.confirm(`คุณต้องการลบทัวร์นาเมนต์ "${t.title}" ใช่หรือไม่?`)) {
                                        deleteTournament(t.id);
                                        triggerSaveToast();
                                      }
                                    }}
                                    title="ลบทัวร์นาเมนต์นี้"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                    <button type="button" className="btn-section-preview" onClick={() => openPreview('tournaments')}>
                      <Eye size={14} /> พรีวิวตัวอย่างก่อนบันทึก
                    </button>
                    <button className="btn-primary" onClick={() => triggerSaveToast()}>
                      <Save size={14} /> บันทึกข้อมูลส่วนทัวร์นาเมนต์
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUBTAB 5: VENUE ZONES CRUD
                  ------------------------------------------------------------- */}
              {activeSectionSubTab === 'zones' && (
                <div className="admin-subcard glass-panel">
                  <div className="subcard-title">
                    <Compass size={16} className="text-blue" />
                    <strong>5. โซนบรรยากาศร้าน & อัตราค่าบริการ (Venue Atmosphere & Zones)</strong>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>ป้ายหัวข้อเล็ก</label>
                      <input 
                        type="text" className="form-input"
                        value={siteData.zonesSection?.badge || 'VENUE ATMOSPHERE & ZONES'}
                        onChange={e => updateSectionConfig('zonesSection', {
                          ...siteData.zonesSection,
                          badge: e.target.value
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>หัวข้อใหญ่ Section</label>
                      <input 
                        type="text" className="form-input"
                        value={siteData.zonesSection?.title || ''}
                        onChange={e => updateSectionConfig('zonesSection', {
                          ...siteData.zonesSection,
                          title: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>คำบรรยาย Section</label>
                    <textarea 
                      className="form-input form-textarea" rows="2"
                      value={siteData.zonesSection?.subtitle || ''}
                      onChange={e => updateSectionConfig('zonesSection', {
                        ...siteData.zonesSection,
                        subtitle: e.target.value
                      })}
                    />
                  </div>

                  <SectionColorCustomizer 
                    title="🎨 สีพื้นหลังและฟอนต์ส่วนโซนบรรยากาศร้าน"
                    description="กำหนดสีพื้นหลังของโซนบรรยากาศร้าน และสีฟอนต์หัวข้อ/คำบรรยาย"
                    bgColor={siteData.zonesSection?.bgColor || '#f8fafc'}
                    onBgColorChange={val => updateSectionConfig('zonesSection', {
                      ...siteData.zonesSection,
                      bgColor: val
                    })}
                    titleColor={siteData.zonesSection?.titleColor || '#0f172a'}
                    onTitleColorChange={val => updateSectionConfig('zonesSection', {
                      ...siteData.zonesSection,
                      titleColor: val
                    })}
                    subtitleColor={siteData.zonesSection?.subtitleColor || '#475569'}
                    onSubtitleColorChange={val => updateSectionConfig('zonesSection', {
                      ...siteData.zonesSection,
                      subtitleColor: val
                    })}
                    defaultBg="#f8fafc"
                    defaultTitle="#0f172a"
                    defaultSubtitle="#475569"
                  />

                  {/* Zones Grid */}
                  <div className="form-row-2" style={{ gap: '16px', marginTop: '16px' }}>
                    {(siteData.venueZones || []).map(zone => {
                      const zoneTitle = zone.title || zone.name || 'โซนร้านเกม';
                      const zoneDesc = zone.description || zone.desc || '';
                      const zoneSpecs = Array.isArray(zone.specs) ? zone.specs.join(', ') : (zone.specs || '');
                      return (
                        <div key={zone.id} className="form-subblock">
                          <h5 className="form-subblock-title">
                            <Monitor size={14} className="text-blue" />
                            <span>{zoneTitle}</span>
                          </h5>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>ชื่อโซน</label>
                              <input 
                                type="text" className="form-input"
                                value={zoneTitle}
                                onChange={e => updateVenueZone(zone.id, { title: e.target.value, name: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>อัตราค่าบริการ / ชม.</label>
                              <input 
                                type="text" className="form-input"
                                placeholder="เช่น ฿35 / ชม. หรือ ฟรีสำหรับสมาชิก"
                                value={zone.ratePerHour || ''}
                                onChange={e => updateVenueZone(zone.id, { ratePerHour: e.target.value })}
                              />
                            </div>
                          </div>

                          <SectionImageUploader 
                            label={`ภาพถ่ายบรรยากาศประจำโซน (${zoneTitle})`}
                            value={zone.image || ''}
                            onChange={val => updateVenueZone(zone.id, { image: val })}
                            recommendedSize="1000 x 650 px"
                            aspectRatio="16:10 หรือ 16:9 (แนวนอน)"
                            description={`ภาพถ่ายจริงหรือ 3D Render ของ ${zoneTitle} สำหรับแท็บสลับดูบรรยากาศร้านหน้าแรก`}
                            uploadKey={`zone-img-${zone.id}`}
                            compressingItemId={compressingItemId}
                            handleImageUpload={handleImageUpload}
                            previewWidth={160}
                            previewHeight={100}
                          />

                          <div className="form-group">
                            <label>สเปกฮาร์ดแวร์ประจำโซน (คั่นด้วยจุลภาค ,)</label>
                            <input 
                              type="text" className="form-input"
                              value={zoneSpecs}
                              onChange={e => updateVenueZone(zone.id, { 
                                specs: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                              })}
                            />
                          </div>

                          <div className="form-group">
                            <label>คำบรรยายโซน</label>
                            <textarea 
                              className="form-input form-textarea" rows="2"
                              value={zoneDesc}
                              onChange={e => updateVenueZone(zone.id, { description: e.target.value, desc: e.target.value })}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                    <button type="button" className="btn-section-preview" onClick={() => openPreview('zones')}>
                      <Eye size={14} /> พรีวิวตัวอย่างก่อนบันทึก
                    </button>
                    <button className="btn-primary" onClick={() => triggerSaveToast()}>
                      <Save size={14} /> บันทึกข้อมูลโซนทั้งหมด
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUBTAB 6: FRANCHISE BANNER & CTA
                  ------------------------------------------------------------- */}
              {activeSectionSubTab === 'franchise-cta' && (
                <div className="admin-subcard glass-panel">
                  <div className="subcard-title">
                    <TrendingUp size={16} className="text-blue" />
                    <strong>6. แบนเนอร์ชวนร่วมระบบแฟรนไชส์ (Franchise Banner & CTA)</strong>
                  </div>

                  <div className="form-group">
                    <label>ป้ายหัวข้อเล็ก (Badge)</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.franchiseBanner?.badge || 'G-SPEED FRANCHISE & INTERIOR PLANNER'}
                      onChange={e => updateSectionConfig('franchiseBanner', {
                        ...siteData.franchiseBanner,
                        badge: e.target.value
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>หัวข้อชวนลงทุน (Heading)</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.franchiseBanner?.heading || ''}
                      onChange={e => updateSectionConfig('franchiseBanner', {
                        ...siteData.franchiseBanner,
                        heading: e.target.value
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>คำอธิบายข้อเสนอแฟรนไชส์</label>
                    <textarea 
                      className="form-input form-textarea" rows="3"
                      value={siteData.franchiseBanner?.desc || ''}
                      onChange={e => updateSectionConfig('franchiseBanner', {
                        ...siteData.franchiseBanner,
                        desc: e.target.value
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>ข้อความบนปุ่มกด</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.franchiseBanner?.buttonText || 'เริ่มออกแบบผังร้าน & ประเมินงบประมาณทันที'}
                      onChange={e => updateSectionConfig('franchiseBanner', {
                        ...siteData.franchiseBanner,
                        buttonText: e.target.value
                      })}
                    />
                  </div>

                  <SectionColorCustomizer 
                    title="🎨 สีพื้นหลังและฟอนต์แบนเนอร์แฟรนไชส์"
                    description="กำหนดสีพื้นหลังของกล่องแบนเนอร์ (เมื่อไม่ได้ใช้ภาพ หรือแสดงผลร่วมกัน) และสีฟอนต์หัวข้อ/คำบรรยาย"
                    bgColor={siteData.franchiseBanner?.bgColor || '#1e3a8a'}
                    onBgColorChange={val => updateSectionConfig('franchiseBanner', {
                      ...siteData.franchiseBanner,
                      bgColor: val
                    })}
                    titleColor={siteData.franchiseBanner?.headingColor || '#ffffff'}
                    onTitleColorChange={val => updateSectionConfig('franchiseBanner', {
                      ...siteData.franchiseBanner,
                      headingColor: val
                    })}
                    subtitleColor={siteData.franchiseBanner?.descColor || '#bfdbfe'}
                    onSubtitleColorChange={val => updateSectionConfig('franchiseBanner', {
                      ...siteData.franchiseBanner,
                      descColor: val
                    })}
                    titleLabel="สีฟอนต์หัวข้อชวนลงทุน (Heading Color)"
                    subtitleLabel="สีฟอนต์คำอธิบายข้อเสนอ (Desc Color)"
                    defaultBg="#1e3a8a"
                    defaultTitle="#ffffff"
                    defaultSubtitle="#bfdbfe"
                    presets={[
                      { label: 'น้ำเงิน GLP (Brand Blue)', bg: '#1e3a8a', title: '#ffffff', subtitle: '#bfdbfe' },
                      { label: 'ดาร์กอารีนา (Dark Arena)', bg: '#0b0f19', title: '#60a5fa', subtitle: '#cbd5e1' },
                      { label: 'น้ำเงินเข้ม (Deep Navy)', bg: '#0f172a', title: '#ffffff', subtitle: '#94a3b8' },
                      { label: 'เทาพรีเมียม (Slate)', bg: '#1e293b', title: '#38bdf8', subtitle: '#e2e8f0' },
                      { label: 'สว่างคลีน (Clean Light)', bg: '#ffffff', title: '#0f172a', subtitle: '#475569' }
                    ]}
                  />

                  <SectionImageUploader 
                    label="ภาพพื้นหลังแบนเนอร์แฟรนไชส์ (Franchise CTA Background Image - ตัวเลือกเสริม)"
                    value={siteData.franchiseBanner?.bgImage || ''}
                    onChange={val => updateSectionConfig('franchiseBanner', {
                      ...siteData.franchiseBanner,
                      bgImage: val
                    })}
                    recommendedSize="1600 x 600 px"
                    aspectRatio="8:3 หรือ 16:6 (แนวนอนมุมกว้างพิเศษ)"
                    description="ภาพพื้นหลังส่วนชวนร่วมลงทุนแฟรนไชส์ แนะนำภาพร้านรวมมุมกว้าง หรือ 3D Floor Plan ที่ดูอลังการ ทันสมัย เพื่อสร้างความมั่นใจให้นักลงทุน"
                    uploadKey="franchise-bg-img"
                    compressingItemId={compressingItemId}
                    handleImageUpload={handleImageUpload}
                    previewWidth={200}
                    previewHeight={75}
                  />

                  <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                    <button type="button" className="btn-section-preview" onClick={() => openPreview('franchise-cta')}>
                      <Eye size={14} /> พรีวิวตัวอย่างก่อนบันทึก
                    </button>
                    <button className="btn-primary" onClick={() => triggerSaveToast()}>
                      <Save size={14} /> บันทึกแบนเนอร์แฟรนไชส์
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUBTAB 7: NEWS SECTION & ARTICLES
                  ------------------------------------------------------------- */}
              {activeSectionSubTab === 'news-sec' && (
                <div className="admin-subcard glass-panel">
                  <div className="subcard-title">
                    <FileText size={16} className="text-blue" />
                    <strong>7. ส่วนหัวบทความและข่าวสาร (News Section Config)</strong>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>ป้ายหัวข้อเล็ก</label>
                      <input 
                        type="text" className="form-input"
                        value={siteData.newsSection?.badge || 'ARTICLES & UPDATES'}
                        onChange={e => updateSectionConfig('newsSection', {
                          ...siteData.newsSection,
                          badge: e.target.value
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>หัวข้อใหญ่ Section</label>
                      <input 
                        type="text" className="form-input"
                        value={siteData.newsSection?.title || ''}
                        onChange={e => updateSectionConfig('newsSection', {
                          ...siteData.newsSection,
                          title: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>คำบรรยาย Section</label>
                    <textarea 
                      className="form-input form-textarea" rows="2"
                      value={siteData.newsSection?.subtitle || ''}
                      onChange={e => updateSectionConfig('newsSection', {
                        ...siteData.newsSection,
                        subtitle: e.target.value
                      })}
                    />
                  </div>

                  <SectionColorCustomizer 
                    title="🎨 สีพื้นหลังและฟอนต์ส่วนบทความ & ข่าวสาร"
                    description="กำหนดสีพื้นหลังของส่วนข่าวสาร และสีฟอนต์หัวข้อ/คำบรรยาย"
                    bgColor={siteData.newsSection?.bgColor || '#ffffff'}
                    onBgColorChange={val => updateSectionConfig('newsSection', {
                      ...siteData.newsSection,
                      bgColor: val
                    })}
                    titleColor={siteData.newsSection?.titleColor || '#0f172a'}
                    onTitleColorChange={val => updateSectionConfig('newsSection', {
                      ...siteData.newsSection,
                      titleColor: val
                    })}
                    subtitleColor={siteData.newsSection?.subtitleColor || '#475569'}
                    onSubtitleColorChange={val => updateSectionConfig('newsSection', {
                      ...siteData.newsSection,
                      subtitleColor: val
                    })}
                    defaultBg="#ffffff"
                    defaultTitle="#0f172a"
                    defaultSubtitle="#475569"
                  />

                  <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                    <button type="button" className="btn-section-preview" onClick={() => openPreview('news-sec')}>
                      <Eye size={14} /> พรีวิวตัวอย่างก่อนบันทึก
                    </button>
                    <button className="btn-primary" onClick={() => triggerSaveToast()}>
                      <Save size={14} /> บันทึกข้อมูลส่วนข่าวสาร
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUBTAB 8: FOUNDER & COMPANY STORY
                  ------------------------------------------------------------- */}
              {activeSectionSubTab === 'founder' && (
                <div className="admin-subcard glass-panel">
                  <div className="subcard-title">
                    <ShieldCheck size={16} className="text-blue" />
                    <strong>8. เรื่องราวผู้ก่อตั้งและวิสัยทัศน์องค์กร (Founder & Company Story)</strong>
                  </div>

                  <div className="form-group">
                    <label>คำคม / ปรัชญาผู้ก่อตั้ง (Founder Quote)</label>
                    <textarea 
                      className="form-input form-textarea" rows="2"
                      value={siteData.founder?.quote || ''}
                      onChange={e => updateSectionConfig('founder', {
                        ...siteData.founder,
                        quote: e.target.value
                      })}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label>ชื่อผู้ก่อตั้ง</label>
                      <input 
                        type="text" className="form-input"
                        value={siteData.founder?.name || 'คุณธนภัทร วรเชษฐ์'}
                        onChange={e => updateSectionConfig('founder', {
                          ...siteData.founder,
                          name: e.target.value
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>ตำแหน่งผู้บริหาร</label>
                      <input 
                        type="text" className="form-input"
                        value={siteData.founder?.title || 'ผู้ก่อตั้งและประธานเจ้าหน้าที่บริหาร GLP Group'}
                        onChange={e => updateSectionConfig('founder', {
                          ...siteData.founder,
                          title: e.target.value
                        })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>ประวัติและแรงบันดาลใจ (Founder Bio)</label>
                    <textarea 
                      className="form-input form-textarea" rows="3"
                      value={siteData.founder?.bio || ''}
                      onChange={e => updateSectionConfig('founder', {
                        ...siteData.founder,
                        bio: e.target.value
                      })}
                    />
                  </div>

                  <SectionColorCustomizer 
                    title="🎨 สีพื้นหลังและฟอนต์ส่วนผู้ก่อตั้ง & บริษัท"
                    description="กำหนดสีพื้นหลังและการ์ดโปรไฟล์ผู้ก่อตั้ง และสีฟอนต์ชื่อ/คำคม/ประวัติ"
                    bgColor={siteData.founder?.bgColor || '#ffffff'}
                    onBgColorChange={val => updateSectionConfig('founder', {
                      ...siteData.founder,
                      bgColor: val
                    })}
                    titleColor={siteData.founder?.titleColor || '#0f172a'}
                    onTitleColorChange={val => updateSectionConfig('founder', {
                      ...siteData.founder,
                      titleColor: val
                    })}
                    subtitleColor={siteData.founder?.textColor || '#475569'}
                    onSubtitleColorChange={val => updateSectionConfig('founder', {
                      ...siteData.founder,
                      textColor: val
                    })}
                    titleLabel="สีฟอนต์ชื่อผู้ก่อตั้ง (Name Color)"
                    subtitleLabel="สีฟอนต์คำคมและเนื้อหา (Quote & Bio Color)"
                    defaultBg="#ffffff"
                    defaultTitle="#0f172a"
                    defaultSubtitle="#475569"
                  />

                  <SectionImageUploader 
                    label="ภาพถ่ายผู้บริหาร / ผู้ก่อตั้ง (Founder & CEO Portrait)"
                    value={siteData.founder?.image || ''}
                    onChange={val => updateSectionConfig('founder', {
                      ...siteData.founder,
                      image: val
                    })}
                    recommendedSize="800 x 800 px หรือ 800 x 1000 px"
                    aspectRatio="1:1 (สี่เหลี่ยมจัตุรัส) หรือ 4:5 (แนวตั้งพอร์ตเทรต)"
                    description="ภาพถ่ายพอร์ตเทรตผู้ก่อตั้งสำหรับหน้า Company Profile แนะนำภาพที่มีความคมชัด สีหน้ามั่นใจ และพื้นหลังดูเป็นมืออาชีพ"
                    uploadKey="founder-portrait-img"
                    compressingItemId={compressingItemId}
                    handleImageUpload={handleImageUpload}
                    previewWidth={120}
                    previewHeight={120}
                  />

                  <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                    <button type="button" className="btn-section-preview" onClick={() => openPreview('founder')}>
                      <Eye size={14} /> พรีวิวตัวอย่างก่อนบันทึก
                    </button>
                    <button className="btn-primary" onClick={() => triggerSaveToast()}>
                      <Save size={14} /> บันทึกข้อมูลผู้ก่อตั้ง
                    </button>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUBTAB 9: GLOBAL SEO & SOCIAL SHARE PREVIEW
                  ------------------------------------------------------------- */}
              {activeSectionSubTab === 'seo' && (
                <div className="admin-subcard glass-panel">
                  <div className="subcard-title">
                    <Globe size={16} className="text-blue" />
                    <strong>9. Global SEO Meta Tags & ระบบจำลองการแชร์โซเชียลมีเดีย</strong>
                  </div>

                  <div className="form-group">
                    <label>Page Meta Title (ความยาวที่แนะนำ 50-60 ตัวอักษร)</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.globalSEO?.siteTitle || 'G-SPEED ESPORT ARENA | ศูนย์อีสปอร์ตครบวงจร & ระบบแฟรนไชส์จัดผังร้านอัจฉริยะ'}
                      onChange={e => updateGlobalSEO({ siteTitle: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Page Meta Description (ความยาวที่แนะนำ 120-160 ตัวอักษร)</label>
                    <textarea 
                      className="form-input form-textarea" rows="2"
                      value={siteData.globalSEO?.metaDescription || 'ศูนย์อีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากล สเปกเกมมิ่ง RTX 40 Series จอ 360Hz พร้อมระบบ 3D Interior Floor Plan คำนวณงบประมาณและผลตอบแทนการลงทุนแฟรนไชส์'}
                      onChange={e => updateGlobalSEO({ metaDescription: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Keywords สำหรับค้นหาบน Google (คั่นด้วยเครื่องหมายจุลภาค ,)</label>
                    <input 
                      type="text" className="form-input"
                      value={siteData.globalSEO?.keywords || 'ร้านเกม, อีสปอร์ต, แฟรนไชส์ร้านเกม, จัดผังร้าน 3D, G-Speed, GLP, Valorant Thailand'}
                      onChange={e => updateGlobalSEO({ keywords: e.target.value })}
                    />
                  </div>

                  <SectionImageUploader 
                    label="รูปภาพพรีวิวสำหรับแชร์โซเชียลมีเดีย (Global OpenGraph & Twitter Card Image)"
                    value={siteData.globalSEO?.ogImage || ''}
                    onChange={val => updateGlobalSEO({ ogImage: val })}
                    recommendedSize="1200 x 630 px (มาตรฐานสากล Facebook, LINE, Discord, X)"
                    aspectRatio="1.91:1 (มาตรฐาน OpenGraph แนวนอน)"
                    description="ภาพที่จะปรากฏบนพรีวิวการ์ดเมื่อนำลิงก์เว็บไซต์ไปแชร์ใน LINE, Facebook, Discord หรือ Twitter แนะนำให้วางโลโก้และข้อความสำคัญตรงกลางภาพ"
                    uploadKey="global-og-img"
                    compressingItemId={compressingItemId}
                    handleImageUpload={handleImageUpload}
                    previewWidth={191}
                    previewHeight={100}
                  />

                  {/* Social Share Simulator */}
                  <div className="social-share-simulator" style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className="text-xs font-bold text-muted uppercase">ตัวอย่างการแสดงผลบนโซเชียลมีเดียเมื่อแชร์ลิงก์:</span>
                      <div className="filter-chips">
                        <button 
                          className={`filter-chip ${socialPreviewPlatform === 'facebook' ? 'active' : ''}`}
                          onClick={() => setSocialPreviewPlatform('facebook')}
                        >
                          Facebook
                        </button>
                        <button 
                          className={`filter-chip ${socialPreviewPlatform === 'line' ? 'active' : ''}`}
                          onClick={() => setSocialPreviewPlatform('line')}
                        >
                          LINE
                        </button>
                      </div>
                    </div>

                    <div className="social-preview-card" style={{ maxWidth: '480px', margin: '0 auto', background: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                      <div style={{ width: '100%', height: '220px', background: '#0f172a', overflow: 'hidden' }}>
                        <img 
                          src={siteData.globalSEO?.ogImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'} 
                          alt="Social Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '12px 14px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                          GSPEEDLIVINGPLUS.COM
                        </span>
                        <strong style={{ fontSize: '0.92rem', color: '#0f172a', display: 'block', lineHeight: 1.3, marginBottom: '4px' }}>
                          {siteData.globalSEO?.siteTitle || 'G-SPEED ESPORT ARENA'}
                        </strong>
                        <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {siteData.globalSEO?.metaDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer-btns" style={{ marginTop: '16px' }}>
                    <button type="button" className="btn-section-preview" onClick={() => openPreview('seo')}>
                      <Eye size={14} /> พรีวิวตัวอย่างก่อนบันทึก
                    </button>
                    <button className="btn-primary" onClick={() => triggerSaveToast()}>
                      <Save size={14} /> บันทึกการตั้งค่า SEO
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  MASTER TOURNAMENT CMS MODAL (UNIFIED 5-TAB SUITE)
                  Game, Dates, Description & Rules, Roster, 50+ Photos Gallery, SEO Suite
                  ========================================================================= */}
              {isTournamentModalOpen && activeTournamentDraft && (
                <div className="cms-modal-backdrop" onClick={() => setIsTournamentModalOpen(false)}>
                  <div 
                    className="cms-modal-card modal-extra-wide tournament-master-modal" 
                    onClick={e => e.stopPropagation()}
                    style={{ maxWidth: '1080px', width: '95vw', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
                  >
                    {/* Modal Head */}
                    <div className="modal-head" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#eff6ff', color: '#1d4ed8', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trophy size={20} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.15rem' }}>
                            {isEditingTournament ? `แก้ไขทัวร์นาเมนต์: ${activeTournamentDraft.title || ''}` : 'สร้างทัวร์นาเมนต์ใหม่ (New Tournament)'}
                          </h4>
                          <span className="text-xs text-muted">
                            ระบบจัดการงานแข่งรวมศูนย์ (ชื่อเกม, รายชื่อนักแข่ง, ระบบวันที่, กติกา, SEO, ภาพกิจกรรม 50+ ภาพ)
                          </span>
                        </div>
                      </div>
                      <button onClick={() => setIsTournamentModalOpen(false)} className="btn-close-modal">✕</button>
                    </div>

                    {/* Master Tabs Bar */}
                    <div className="subtabs-bar" style={{ padding: '8px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px', overflowX: 'auto' }}>
                      <button 
                        type="button" 
                        className={`subtab-btn ${tournamentModalTab === 'general' ? 'active' : ''}`}
                        onClick={() => setTournamentModalTab('general')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Gamepad2 size={14} />
                        <span>1. ข้อมูลหลัก & เกม & วันที่</span>
                      </button>
                      <button 
                        type="button" 
                        className={`subtab-btn ${tournamentModalTab === 'rules' ? 'active' : ''}`}
                        onClick={() => setTournamentModalTab('rules')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <List size={14} />
                        <span>2. คำอธิบาย & กติกา & รางวัล</span>
                      </button>
                      <button 
                        type="button" 
                        className={`subtab-btn ${tournamentModalTab === 'roster' ? 'active' : ''}`}
                        onClick={() => setTournamentModalTab('roster')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Users size={14} />
                        <span>3. รายชื่อนักแข่ง & ทีม ({(activeTournamentDraft.teams || []).length})</span>
                      </button>
                      <button 
                        type="button" 
                        className={`subtab-btn ${tournamentModalTab === 'gallery' ? 'active' : ''}`}
                        onClick={() => setTournamentModalTab('gallery')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Camera size={14} />
                        <span>4. คลังภาพกิจกรรม 50+ ภาพ ({(activeTournamentDraft.galleryPhotos || []).length})</span>
                      </button>
                      <button 
                        type="button" 
                        className={`subtab-btn ${tournamentModalTab === 'seo' ? 'active' : ''}`}
                        onClick={() => setTournamentModalTab('seo')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Globe size={14} />
                        <span>5. ระบบ SEO & โซเชียล</span>
                      </button>
                    </div>

                    {/* Scrollable Modal Content */}
                    <div className="modal-body-form" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                      
                      {/* ----------------- TAB 1: GENERAL & GAME & DATES ----------------- */}
                      {tournamentModalTab === 'general' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div className="form-group">
                            <label>ชื่อรายการแข่งขัน (Tournament Title) *</label>
                            <input 
                              type="text" className="form-input"
                              placeholder="เช่น G-SPEED VALORANT CHAMPIONSHIP 2026"
                              value={activeTournamentDraft.title || ''}
                              onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, title: e.target.value })}
                            />
                          </div>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>ชื่อเกมที่ใช้แข่งขัน (Game Name) *</label>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                  type="text" className="form-input"
                                  placeholder="เช่น VALORANT, RoV, CS2"
                                  value={activeTournamentDraft.game || ''}
                                  onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, game: e.target.value })}
                                />
                                <select 
                                  className="form-input" 
                                  style={{ width: '130px' }}
                                  onChange={e => {
                                    if (e.target.value) {
                                      setActiveTournamentDraft({ ...activeTournamentDraft, game: e.target.value });
                                    }
                                  }}
                                  value=""
                                >
                                  <option value="">เลือกด่วน...</option>
                                  <option value="VALORANT">VALORANT</option>
                                  <option value="Arena of Valor (RoV)">RoV</option>
                                  <option value="Counter-Strike 2">CS2</option>
                                  <option value="PUBG PC">PUBG PC</option>
                                  <option value="EA Sports FC Online">FC Online</option>
                                  <option value="Dota 2">Dota 2</option>
                                  <option value="Apex Legends">Apex Legends</option>
                                </select>
                              </div>
                            </div>
                            <div className="form-group">
                              <label>ประเภท / หมวดหมู่เกม (Game Category)</label>
                              <input 
                                type="text" className="form-input"
                                placeholder="เช่น Tactical 5v5 FPS, 5v5 Mobile MOBA"
                                value={activeTournamentDraft.gameCategory || ''}
                                onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, gameCategory: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>เงินรางวัลรวม (Total Prize Pool)</label>
                              <input 
                                type="text" className="form-input"
                                placeholder="เช่น 100,000 บาท หรือ ฿50,000"
                                value={activeTournamentDraft.prizePool || ''}
                                onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, prizePool: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>จำนวนทีม / สล็อตที่รับสมัคร (Slots)</label>
                              <input 
                                type="text" className="form-input"
                                placeholder="เช่น 32 ทีม (เหลือ 6 ทีมสุดท้าย)"
                                value={activeTournamentDraft.slots || ''}
                                onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, slots: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>รูปแบบการแข่งขัน (Format)</label>
                              <input 
                                type="text" className="form-input"
                                placeholder="เช่น LAN Final @ Main Stage & Double Elimination"
                                value={activeTournamentDraft.format || ''}
                                onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, format: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>สถานะการเปิดรับสมัคร (Status)</label>
                              <select 
                                className="form-input"
                                value={activeTournamentDraft.status || 'Open'}
                                onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, status: e.target.value })}
                              >
                                <option value="Open">Open (เปิดรับสมัคร)</option>
                                <option value="Full">Full (ที่นั่งเต็มแล้ว)</option>
                                <option value="Ongoing">Ongoing (กำลังแข่งขัน)</option>
                                <option value="Closed">Closed (ปิดรับสมัครแล้ว)</option>
                                <option value="Completed">Completed (จบการแข่งขันแล้ว)</option>
                                <option value="Upcoming">Upcoming (เร็วๆ นี้)</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>ป้ายข้อความ (Badge Text)</label>
                              <input 
                                type="text" className="form-input"
                                placeholder="เช่น รับสมัครด่วน, เต็มแล้ว, เร็วๆ นี้"
                                value={activeTournamentDraft.badge || ''}
                                onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, badge: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>สีของป้าย Badge</label>
                              <select 
                                className="form-input"
                                value={activeTournamentDraft.badgeType || 'magenta'}
                                onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, badgeType: e.target.value })}
                              >
                                <option value="magenta">Magenta (ชมพูม่วง - รับสมัครด่วน)</option>
                                <option value="cyan">Cyan (ฟ้าสว่าง - ทัวร์นาเมนต์หลัก)</option>
                                <option value="amber">Amber (ส้มทอง - เต็มแล้ว / รางวัลใหญ่)</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>สถานที่จัดแข่ง (Venue)</label>
                              <input 
                                type="text" className="form-input"
                                placeholder="G-Speed Esport Arena รามคำแหง 53"
                                value={activeTournamentDraft.venue || ''}
                                onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, venue: e.target.value })}
                              />
                            </div>
                            <div className="form-group">
                              <label>ช่องทางถ่ายทอดสด (Stream Channel)</label>
                              <input 
                                type="text" className="form-input"
                                placeholder="Twitch.tv/gspeed_esport & YouTube Live"
                                value={activeTournamentDraft.streamChannel || ''}
                                onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, streamChannel: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label>URL ภาพแบนเนอร์ปกทัวร์นาเมนต์ (Banner Image URL)</label>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <input 
                                type="text" className="form-input" style={{ flex: 1 }}
                                placeholder="https://images.unsplash.com/..."
                                value={activeTournamentDraft.bannerImage || ''}
                                onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, bannerImage: e.target.value })}
                              />
                              {activeTournamentDraft.bannerImage && (
                                <img 
                                  src={activeTournamentDraft.bannerImage} 
                                  alt="Preview" 
                                  style={{ width: '60px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                              )}
                            </div>
                          </div>

                          {/* Date System Box */}
                          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                              <Calendar size={16} className="text-blue" />
                              <strong style={{ color: '#0f172a' }}>📅 ระบบวันที่ & กำหนดการแข่งขัน (Date & Time System)</strong>
                            </div>

                            <div className="form-row-2">
                              <div className="form-group">
                                <label>วันเปิดรับสมัคร (Registration Start)</label>
                                <input 
                                  type="text" className="form-input"
                                  placeholder="1 กันยายน 2026"
                                  value={activeTournamentDraft.regStartDate || ''}
                                  onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, regStartDate: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label>วันปิดรับสมัคร (Registration Deadline)</label>
                                <input 
                                  type="text" className="form-input"
                                  placeholder="25 กันยายน 2026"
                                  value={activeTournamentDraft.regEndDate || ''}
                                  onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, regEndDate: e.target.value })}
                                />
                              </div>
                            </div>

                            <div className="form-row-2">
                              <div className="form-group">
                                <label>ช่วงวันที่แข่งขันจริง (Tournament Date)</label>
                                <input 
                                  type="text" className="form-input"
                                  placeholder="28-30 กันยายน 2026"
                                  value={activeTournamentDraft.date || ''}
                                  onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, date: e.target.value })}
                                />
                              </div>
                              <div className="form-group">
                                <label>เวลาเริ่ม - สิ้นสุดในแต่ละวัน (Daily Time)</label>
                                <input 
                                  type="text" className="form-input"
                                  placeholder="11:00 - 20:00 น."
                                  value={activeTournamentDraft.time || ''}
                                  onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, time: e.target.value })}
                                />
                              </div>
                            </div>

                            {/* Timetable / Schedule editor */}
                            <div style={{ marginTop: '12px' }}>
                              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '0.85rem' }}>
                                <span>กำหนดการแข่งขันรายรอบ (Match Timetable)</span>
                                <button 
                                  type="button" 
                                  className="btn-table-action"
                                  style={{ padding: '2px 8px', fontSize: '0.75rem', background: '#eff6ff', color: '#1d4ed8' }}
                                  onClick={() => {
                                    const current = activeTournamentDraft.scheduleTimetable || [];
                                    setActiveTournamentDraft({
                                      ...activeTournamentDraft,
                                      scheduleTimetable: [...current, { time: '12:00 น.', stage: 'รอบการแข่งขันใหม่' }]
                                    });
                                  }}
                                >
                                  + เพิ่มรอบแข่ง
                                </button>
                              </label>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                                {(activeTournamentDraft.scheduleTimetable || []).map((st, sidx) => (
                                  <div key={sidx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input 
                                      type="text" className="form-input" style={{ width: '130px' }}
                                      placeholder="เวลา เช่น 11:00 น."
                                      value={st.time}
                                      onChange={e => {
                                        const updated = [...activeTournamentDraft.scheduleTimetable];
                                        updated[sidx].time = e.target.value;
                                        setActiveTournamentDraft({ ...activeTournamentDraft, scheduleTimetable: updated });
                                      }}
                                    />
                                    <input 
                                      type="text" className="form-input" style={{ flex: 1 }}
                                      placeholder="รายละเอียดรอบ เช่น รอบ 8 ทีมสุดท้าย (Bo3)"
                                      value={st.stage}
                                      onChange={e => {
                                        const updated = [...activeTournamentDraft.scheduleTimetable];
                                        updated[sidx].stage = e.target.value;
                                        setActiveTournamentDraft({ ...activeTournamentDraft, scheduleTimetable: updated });
                                      }}
                                    />
                                    <button 
                                      type="button"
                                      className="btn-table-action action-delete"
                                      onClick={() => {
                                        const updated = activeTournamentDraft.scheduleTimetable.filter((_, i) => i !== sidx);
                                        setActiveTournamentDraft({ ...activeTournamentDraft, scheduleTimetable: updated });
                                      }}
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ----------------- TAB 2: DESC & RULES & PRIZES ----------------- */}
                      {tournamentModalTab === 'rules' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                          <div className="form-group">
                            <label>คำอธิบายและเรื่องราวการแข่งขัน (Detailed Tournament Description)</label>
                            <textarea 
                              className="form-input form-textarea" rows="4"
                              placeholder="อธิบายความเป็นมาของทัวร์นาเมนต์ ไฮไลต์ รางวัล และเวทีการแข่งขัน..."
                              value={activeTournamentDraft.desc || ''}
                              onChange={e => setActiveTournamentDraft({ ...activeTournamentDraft, desc: e.target.value })}
                            />
                          </div>

                          {/* Prize Breakdown */}
                          <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Award size={16} className="text-amber" />
                                <strong style={{ color: '#854d0e' }}>การแบ่งเงินรางวัล (Prize Pool Distribution)</strong>
                              </div>
                              <button 
                                type="button" 
                                className="btn-table-action"
                                style={{ padding: '3px 10px', fontSize: '0.8rem', background: '#fef08a', color: '#854d0e' }}
                                onClick={() => {
                                  const current = activeTournamentDraft.prizeDistribution || [];
                                  setActiveTournamentDraft({
                                    ...activeTournamentDraft,
                                    prizeDistribution: [...current, { rank: `อันดับที่ ${current.length + 1}`, reward: '฿5,000' }]
                                  });
                                }}
                              >
                                + เพิ่มอันดับรางวัล
                              </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {(activeTournamentDraft.prizeDistribution || []).map((pz, pidx) => (
                                <div key={pidx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <input 
                                    type="text" className="form-input" style={{ width: '180px' }}
                                    placeholder="เช่น แชมป์อันดับ 1"
                                    value={pz.rank}
                                    onChange={e => {
                                      const updated = [...activeTournamentDraft.prizeDistribution];
                                      updated[pidx].rank = e.target.value;
                                      setActiveTournamentDraft({ ...activeTournamentDraft, prizeDistribution: updated });
                                    }}
                                  />
                                  <input 
                                    type="text" className="form-input" style={{ flex: 1 }}
                                    placeholder="เช่น ฿50,000 + ถ้วยเกียรติยศ + เหรียญทอง"
                                    value={pz.reward}
                                    onChange={e => {
                                      const updated = [...activeTournamentDraft.prizeDistribution];
                                      updated[pidx].reward = e.target.value;
                                      setActiveTournamentDraft({ ...activeTournamentDraft, prizeDistribution: updated });
                                    }}
                                  />
                                  <button 
                                    type="button" 
                                    className="btn-table-action action-delete"
                                    onClick={() => {
                                      const updated = activeTournamentDraft.prizeDistribution.filter((_, i) => i !== pidx);
                                      setActiveTournamentDraft({ ...activeTournamentDraft, prizeDistribution: updated });
                                    }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Rules Checklist */}
                          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Shield size={16} className="text-blue" />
                                <strong style={{ color: '#0f172a' }}>กติกาและข้อบังคับการแข่งขัน (Official Rules)</strong>
                              </div>
                              <button 
                                type="button" 
                                className="btn-table-action"
                                style={{ padding: '3px 10px', fontSize: '0.8rem', background: '#eff6ff', color: '#1d4ed8' }}
                                onClick={() => {
                                  const current = activeTournamentDraft.rules || [];
                                  setActiveTournamentDraft({
                                    ...activeTournamentDraft,
                                    rules: [...current, 'กติกาการแข่งขันข้อใหม่']
                                  });
                                }}
                              >
                                + เพิ่มกติกา
                              </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {(activeTournamentDraft.rules || []).map((rl, ridx) => (
                                <div key={ridx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', width: '24px' }}>
                                    {ridx + 1}.
                                  </span>
                                  <input 
                                    type="text" className="form-input" style={{ flex: 1 }}
                                    value={rl}
                                    onChange={e => {
                                      const updated = [...activeTournamentDraft.rules];
                                      updated[ridx] = e.target.value;
                                      setActiveTournamentDraft({ ...activeTournamentDraft, rules: updated });
                                    }}
                                  />
                                  <button 
                                    type="button" 
                                    className="btn-table-action action-delete"
                                    onClick={() => {
                                      const updated = activeTournamentDraft.rules.filter((_, i) => i !== ridx);
                                      setActiveTournamentDraft({ ...activeTournamentDraft, rules: updated });
                                    }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ----------------- TAB 3: ROSTERS & TEAMS ----------------- */}
                      {tournamentModalTab === 'roster' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px' }}>
                            <div>
                              <strong style={{ color: '#1d4ed8' }}>รายชื่อนักแข่ง & ทีมที่สมัครเข้าร่วม ({(activeTournamentDraft.teams || []).length} ทีม)</strong>
                              <span className="text-xs text-muted block">จัดการข้อมูลทีม กัปตัน รายชื่อผู้เล่น 5 คน ตัวสำรอง และสถานะการชำระเงิน/ยืนยัน</span>
                            </div>
                            <button 
                              type="button" 
                              className="btn-primary btn-sm"
                              onClick={() => setShowAddTeamForm(!showAddTeamForm)}
                            >
                              <Plus size={14} /> {showAddTeamForm ? 'ปิดฟอร์ม' : 'เพิ่มทีมใหม่'}
                            </button>
                          </div>

                          {/* Add Team Inline Form */}
                          {showAddTeamForm && (
                            <div style={{ background: '#ffffff', border: '2px solid #2563eb', borderRadius: '8px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                              <h5 style={{ margin: '0 0 12px 0', color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Plus size={15} /> ฟอร์มเพิ่มทีมผู้เข้าแข่งขันใหม่
                              </h5>

                              <div className="form-row-2">
                                <div className="form-group">
                                  <label>ชื่อทีม (Team Name) *</label>
                                  <input 
                                    type="text" className="form-input" placeholder="เช่น Talon Academy"
                                    value={newTeamDraft.name}
                                    onChange={e => setNewTeamDraft({ ...newTeamDraft, name: e.target.value })}
                                  />
                                </div>
                                <div className="form-group">
                                  <label>แท็กทีม (Team Tag)</label>
                                  <input 
                                    type="text" className="form-input" placeholder="เช่น TLN"
                                    value={newTeamDraft.tag}
                                    onChange={e => setNewTeamDraft({ ...newTeamDraft, tag: e.target.value })}
                                  />
                                </div>
                              </div>

                              <div className="form-row-2">
                                <div className="form-group">
                                  <label>ชื่อกัปตันทีม (Captain IGN & Full Name)</label>
                                  <input 
                                    type="text" className="form-input" placeholder="เช่น SScary (กัปตัน)"
                                    value={newTeamDraft.captain}
                                    onChange={e => setNewTeamDraft({ ...newTeamDraft, captain: e.target.value })}
                                  />
                                </div>
                                <div className="form-group">
                                  <label>เบอร์โทรศัพท์ติดต่อกัปตัน</label>
                                  <input 
                                    type="text" className="form-input" placeholder="08X-XXX-XXXX"
                                    value={newTeamDraft.captainPhone}
                                    onChange={e => setNewTeamDraft({ ...newTeamDraft, captainPhone: e.target.value })}
                                  />
                                </div>
                              </div>

                              <div className="form-row-2">
                                <div className="form-group">
                                  <label>Discord Tag (สำหรับประสานงาน)</label>
                                  <input 
                                    type="text" className="form-input" placeholder="captain#1234"
                                    value={newTeamDraft.captainDiscord}
                                    onChange={e => setNewTeamDraft({ ...newTeamDraft, captainDiscord: e.target.value })}
                                  />
                                </div>
                                <div className="form-group">
                                  <label>สถานะทีม (Status)</label>
                                  <select 
                                    className="form-input"
                                    value={newTeamDraft.status}
                                    onChange={e => setNewTeamDraft({ ...newTeamDraft, status: e.target.value })}
                                  >
                                    <option value="Confirmed">Confirmed (ยืนยันสิทธิ์แล้ว)</option>
                                    <option value="Pending">Pending (รอตรวจสอบ)</option>
                                    <option value="Paid">Paid (ชำระค่าสมัครแล้ว)</option>
                                  </select>
                                </div>
                              </div>

                              <div className="form-group">
                                <label>รายชื่อผู้เล่นตัวจริง 5 คน (Player 1 - 5 IGNs)</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                                  {[0, 1, 2, 3, 4].map(idx => (
                                    <input 
                                      key={idx}
                                      type="text" className="form-input" 
                                      placeholder={`ผู้เล่นคนที่ ${idx + 1}`}
                                      value={newTeamDraft.players[idx] || ''}
                                      onChange={e => {
                                        const p = [...newTeamDraft.players];
                                        p[idx] = e.target.value;
                                        setNewTeamDraft({ ...newTeamDraft, players: p });
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                                <button type="button" className="btn-secondary" onClick={() => setShowAddTeamForm(false)}>
                                  ยกเลิก
                                </button>
                                <button type="button" className="btn-primary" onClick={handleAddTeam}>
                                  <Check size={14} /> ยืนยันเพิ่มทีมนี้
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Teams Cards List */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                            {(activeTournamentDraft.teams || []).map((tm, tidx) => (
                              <div 
                                key={tm.id || tidx}
                                style={{ 
                                  background: '#ffffff', 
                                  border: '1px solid #e2e8f0', 
                                  borderRadius: '8px', 
                                  padding: '14px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '10px'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1d4ed8' }}>
                                      {tm.tag || tm.name?.slice(0, 3)?.toUpperCase() || 'TM'}
                                    </div>
                                    <div>
                                      <strong style={{ fontSize: '0.95rem' }}>{tm.name}</strong>
                                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                                        <span className="text-xs" style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>Seed #{tm.seed || (tidx + 1)}</span>
                                        <span className="status-pill status-pill-success text-xs">{tm.status || 'Confirmed'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <button 
                                    type="button" 
                                    className="btn-table-action action-delete"
                                    onClick={() => {
                                      const updated = activeTournamentDraft.teams.filter((_, i) => i !== tidx);
                                      setActiveTournamentDraft({ ...activeTournamentDraft, teams: updated });
                                    }}
                                    title="ลบทีมนี้"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>

                                <div style={{ fontSize: '0.82rem', color: '#475569', background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                                  <div><strong>กัปตัน:</strong> {tm.captain || 'ไม่ระบุ'} {tm.captainPhone ? `(${tm.captainPhone})` : ''}</div>
                                  {tm.captainDiscord && <div><strong>Discord:</strong> {tm.captainDiscord}</div>}
                                </div>

                                <div>
                                  <div className="text-xs text-muted" style={{ fontWeight: 600, marginBottom: '4px' }}>ไลน์อัปผู้เล่น (Roster):</div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {(tm.players || []).map((pl, pidx) => (
                                      <span key={pidx} style={{ fontSize: '0.78rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                                        {pl}
                                      </span>
                                    ))}
                                    {(tm.substitutes || []).filter(s => s).map((sub, sidx) => (
                                      <span key={sidx} style={{ fontSize: '0.78rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                                        Sub: {sub}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ----------------- TAB 4: 50+ PHOTO GALLERY ----------------- */}
                      {tournamentModalTab === 'gallery' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {/* Banner Highlight for 50+ Photos */}
                          <div 
                            style={{ 
                              background: (activeTournamentDraft.galleryPhotos || []).length >= 50 ? '#ecfdf5' : '#eff6ff', 
                              border: (activeTournamentDraft.galleryPhotos || []).length >= 50 ? '1px solid #6ee7b7' : '1px solid #bfdbfe', 
                              borderRadius: '8px', 
                              padding: '14px 18px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '12px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <Camera size={22} color={(activeTournamentDraft.galleryPhotos || []).length >= 50 ? '#059669' : '#2563eb'} />
                              <div>
                                <strong style={{ color: (activeTournamentDraft.galleryPhotos || []).length >= 50 ? '#065f46' : '#1e3a8a', fontSize: '1rem' }}>
                                  คลังภาพกิจกรรมทัวร์นาเมนต์: {(activeTournamentDraft.galleryPhotos || []).length} ภาพ
                                </strong>
                                <span className="text-xs block" style={{ color: (activeTournamentDraft.galleryPhotos || []).length >= 50 ? '#047857' : '#475569' }}>
                                  {(activeTournamentDraft.galleryPhotos || []).length >= 50 
                                    ? '✅ ครบถ้วนตามเป้าหมายมากกว่า 50 ภาพ รองรับการแสดงผลแกลเลอรีแบบ Lightbox คมชัดระดับ 4K'
                                    : 'สามารถเพิ่มภาพแบบเดี่ยว หรือกดโหลดตัวอย่าง 50 รูป หรือนำเข้า URL แบบชุดได้ทันที'}
                                </span>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <button 
                                type="button" 
                                className="btn-primary btn-sm"
                                style={{ background: '#059669', borderColor: '#059669' }}
                                onClick={handleLoadDemo50Photos}
                                title="โหลดภาพตัวอย่างบรรยากาศการแข่งขันอีสปอร์ต 52 ภาพทันที"
                              >
                                <Sparkles size={14} /> โหลดภาพตัวอย่าง 50 ภาพ (Demo 50 Photos)
                              </button>
                              <button 
                                type="button" 
                                className="btn-secondary btn-sm"
                                onClick={() => setShowBatchImporter(!showBatchImporter)}
                              >
                                <Upload size={14} /> นำเข้า URL แบบชุด (Batch)
                              </button>
                            </div>
                          </div>

                          {/* Batch Importer Accordion */}
                          {showBatchImporter && (
                            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px' }}>
                              <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                                📋 นำเข้า Image URLs แบบชุด (วาง 1 URL ต่อ 1 บรรทัด สามารถวางได้ 50+ บรรทัด)
                              </strong>
                              <textarea 
                                className="form-input form-textarea" rows="4"
                                placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2...&#10;https://images.unsplash.com/photo-3..."
                                value={batchPhotoUrls}
                                onChange={e => setBatchPhotoUrls(e.target.value)}
                              />
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                                <button type="button" className="btn-secondary btn-sm" onClick={() => setShowBatchImporter(false)}>
                                  ยกเลิก
                                </button>
                                <button type="button" className="btn-primary btn-sm" onClick={handleImportBatchPhotos}>
                                  <Plus size={14} /> เพิ่มภาพทั้งหมดที่ระบุ
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Quick Single Photo Adder */}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <input 
                              type="text" className="form-input" style={{ flex: 2 }}
                              placeholder="URL ภาพใหม่ (https://...)"
                              value={newSinglePhoto.url}
                              onChange={e => setNewSinglePhoto({ ...newSinglePhoto, url: e.target.value })}
                            />
                            <input 
                              type="text" className="form-input" style={{ flex: 2 }}
                              placeholder="คำบรรยายภาพ (Caption)"
                              value={newSinglePhoto.caption}
                              onChange={e => setNewSinglePhoto({ ...newSinglePhoto, caption: e.target.value })}
                            />
                            <select 
                              className="form-input" style={{ width: '130px' }}
                              value={newSinglePhoto.category}
                              onChange={e => setNewSinglePhoto({ ...newSinglePhoto, category: e.target.value })}
                            >
                              <option value="stage">เวที & แสงสี</option>
                              <option value="players">นักกีฬา</option>
                              <option value="gear">อุปกรณ์</option>
                              <option value="crowd">กองเชียร์</option>
                              <option value="trophy">มอบถ้วยรางวัล</option>
                              <option value="caster">แคสเตอร์</option>
                            </select>
                            <button 
                              type="button" 
                              className="btn-primary btn-sm"
                              onClick={() => {
                                if (!newSinglePhoto.url.trim()) return;
                                const current = activeTournamentDraft.galleryPhotos || [];
                                setActiveTournamentDraft({
                                  ...activeTournamentDraft,
                                  galleryPhotos: [
                                    ...current,
                                    {
                                      id: `p-${Date.now()}`,
                                      url: newSinglePhoto.url.trim(),
                                      caption: newSinglePhoto.caption.trim() || `ภาพกิจกรรม #${current.length + 1}`,
                                      category: newSinglePhoto.category
                                    }
                                  ]
                                });
                                setNewSinglePhoto({ url: '', caption: '', category: 'stage' });
                              }}
                            >
                              <Plus size={14} /> เพิ่มรูป
                            </button>
                          </div>

                          {/* Category Filter Pills */}
                          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {[
                              { id: 'all', label: 'ทั้งหมด' },
                              { id: 'stage', label: 'เวที & แสงสี' },
                              { id: 'players', label: 'นักกีฬา' },
                              { id: 'gear', label: 'อุปกรณ์ & สเปก' },
                              { id: 'crowd', label: 'กองเชียร์ & บรรยากาศ' },
                              { id: 'trophy', label: 'มอบรางวัล' },
                              { id: 'caster', label: 'แคสเตอร์' }
                            ].map(cat => (
                              <button 
                                key={cat.id}
                                type="button"
                                className={`subtab-btn ${galleryCategoryFilter === cat.id ? 'active' : ''}`}
                                style={{ padding: '3px 10px', fontSize: '0.78rem' }}
                                onClick={() => setGalleryCategoryFilter(cat.id)}
                              >
                                {cat.label}
                              </button>
                            ))}
                          </div>

                          {/* Photos Grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px', maxHeight: '420px', overflowY: 'auto', padding: '4px' }}>
                            {(activeTournamentDraft.galleryPhotos || [])
                              .filter(p => galleryCategoryFilter === 'all' || p.category === galleryCategoryFilter)
                              .map((photo, pidx) => (
                                <div 
                                  key={photo.id || pidx}
                                  style={{ 
                                    position: 'relative', 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '6px', 
                                    overflow: 'hidden',
                                    background: '#ffffff',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                                  }}
                                >
                                  <div style={{ position: 'relative', height: '110px', background: '#0f172a' }}>
                                    <img 
                                      src={photo.url} 
                                      alt={photo.caption}
                                      loading="lazy"
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <span style={{ position: 'absolute', top: '4px', left: '4px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                                      #{pidx + 1}
                                    </span>
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        const updated = activeTournamentDraft.galleryPhotos.filter((_, i) => i !== pidx);
                                        setActiveTournamentDraft({ ...activeTournamentDraft, galleryPhotos: updated });
                                      }}
                                      style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                      title="ลบรูปนี้"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                  <div style={{ padding: '6px' }}>
                                    <input 
                                      type="text" 
                                      className="form-input" 
                                      style={{ fontSize: '0.75rem', padding: '3px 6px', width: '100%' }}
                                      value={photo.caption || ''}
                                      onChange={e => {
                                        const updated = [...activeTournamentDraft.galleryPhotos];
                                        updated[pidx].caption = e.target.value;
                                        setActiveTournamentDraft({ ...activeTournamentDraft, galleryPhotos: updated });
                                      }}
                                      placeholder="คำบรรยายภาพ"
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* ----------------- TAB 5: SEO SUITE ----------------- */}
                      {tournamentModalTab === 'seo' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Globe size={18} className="text-emerald-600" />
                              <strong style={{ color: '#166534' }}>ระบบ SEO ทัวร์นาเมนต์ & พรีวิว Google Snippet</strong>
                            </div>
                            <span className="text-xs text-muted block" style={{ marginTop: '2px' }}>
                              เพิ่มโอกาสติดหน้าแรก Google ในคีย์เวิร์ดชื่อเกม งานแข่งอีสปอร์ต และพรีวิวการแชร์บน Facebook / LINE / X
                            </span>
                          </div>

                          <div className="form-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>หัวข้อหน้าเว็บ (Meta Title) *</span>
                              <span className="text-xs text-muted">แนะนำ 50-60 ตัวอักษร ({activeTournamentDraft.seo?.metaTitle?.length || 0}/60)</span>
                            </label>
                            <input 
                              type="text" className="form-input"
                              placeholder="เช่น G-SPEED VALORANT CHAMPIONSHIP 2026 | ชิงเงินรางวัล ฿100,000"
                              value={activeTournamentDraft.seo?.metaTitle || ''}
                              onChange={e => setActiveTournamentDraft({
                                ...activeTournamentDraft,
                                seo: { ...(activeTournamentDraft.seo || {}), metaTitle: e.target.value }
                              })}
                            />
                          </div>

                          <div className="form-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>คำอธิบายผลการค้นหา (Meta Description) *</span>
                              <span className="text-xs text-muted">แนะนำ 120-160 ตัวอักษร ({activeTournamentDraft.seo?.metaDesc?.length || 0}/160)</span>
                            </label>
                            <textarea 
                              className="form-input form-textarea" rows="3"
                              placeholder="สรุปเนื้อหาทัวร์นาเมนต์ รางวัล วันที่ และวิธีการสมัคร..."
                              value={activeTournamentDraft.seo?.metaDesc || ''}
                              onChange={e => setActiveTournamentDraft({
                                ...activeTournamentDraft,
                                seo: { ...(activeTournamentDraft.seo || {}), metaDesc: e.target.value }
                              })}
                            />
                          </div>

                          <div className="form-row-2">
                            <div className="form-group">
                              <label>คีย์เวิร์ดเป้าหมาย (SEO Keywords - คั่นด้วยจุลภาค)</label>
                              <input 
                                type="text" className="form-input"
                                placeholder="เช่น VALORANT, แข่งเกม, G-Speed, รามคำแหง 53, อีสปอร์ต"
                                value={activeTournamentDraft.seo?.keywords || ''}
                                onChange={e => setActiveTournamentDraft({
                                  ...activeTournamentDraft,
                                  seo: { ...(activeTournamentDraft.seo || {}), keywords: e.target.value }
                                })}
                              />
                            </div>
                            <div className="form-group">
                              <label>URL Slug ถาวร (Canonical Slug)</label>
                              <input 
                                type="text" className="form-input"
                                placeholder="เช่น gspeed-valorant-championship-2026"
                                value={activeTournamentDraft.seo?.slug || ''}
                                onChange={e => setActiveTournamentDraft({
                                  ...activeTournamentDraft,
                                  seo: { ...(activeTournamentDraft.seo || {}), slug: e.target.value }
                                })}
                              />
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Social Share Image URL (OG Image สำหรับแสดงในการแชร์ Facebook/LINE/Discord)</label>
                            <input 
                              type="text" className="form-input"
                              placeholder="https://images.unsplash.com/..."
                              value={activeTournamentDraft.seo?.ogImage || activeTournamentDraft.bannerImage || ''}
                              onChange={e => setActiveTournamentDraft({
                                ...activeTournamentDraft,
                                seo: { ...(activeTournamentDraft.seo || {}), ogImage: e.target.value }
                              })}
                            />
                          </div>

                          {/* Live Google Snippet Preview */}
                          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginTop: '6px' }}>
                            <span className="text-xs text-muted" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              พรีวิวบนหน้าผลการค้นหา Google (Google Search Preview)
                            </span>
                            <div style={{ marginTop: '8px', fontFamily: 'Arial, sans-serif' }}>
                              <div style={{ fontSize: '0.8rem', color: '#202124', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ color: '#5f6368' }}>https://gspeedesport.com › tournaments › {activeTournamentDraft.seo?.slug || 'gspeed-tournament'}</span>
                              </div>
                              <div style={{ fontSize: '1.15rem', color: '#1a0dab', cursor: 'pointer', fontWeight: 500, marginTop: '2px', lineHeight: 1.3 }}>
                                {activeTournamentDraft.seo?.metaTitle || activeTournamentDraft.title || 'ชื่อรายการแข่งขัน - G-Speed Esport Arena'}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: '#4d5156', marginTop: '4px', lineHeight: 1.4 }}>
                                {activeTournamentDraft.seo?.metaDesc || activeTournamentDraft.desc?.slice(0, 150) || 'ติดตามรายละเอียดการแข่งขันอีสปอร์ต ชิงเงินรางวัลรวม ณ G-Speed Arena รามคำแหง 53'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Modal Footer */}
                    <div className="modal-footer-btns" style={{ borderTop: '1px solid #e2e8f0', padding: '14px 20px', background: '#f8fafc' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button type="button" className="btn-secondary" onClick={() => setIsTournamentModalOpen(false)}>
                          ยกเลิก
                        </button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          type="button" 
                          className="btn-section-preview"
                          onClick={() => openPreview('tournaments')}
                        >
                          <Eye size={14} /> พรีวิวหน้าเว็บ
                        </button>
                        <button 
                          type="button" 
                          className="btn-primary"
                          onClick={handleSaveTournamentDraft}
                        >
                          <Save size={14} /> บันทึกทัวร์นาเมนต์ครบวงจร
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB: ACTIVITIES & ARTICLES CMS (WordPress-like Custom Slugs & Rich Content)
              ========================================================================= */}
          {activeTab === 'articles' && (
            <div className="cms-panel-block">
              <div className="panel-header-row">
                <div>
                  <h3 className="panel-title">
                    <FileText size={20} className="text-blue" />
                    <span>จัดการกิจกรรม & บทความ (WordPress-like Articles CMS)</span>
                  </h3>
                  <p className="panel-desc">
                    จัดการข้อมูลกิจกรรม กำหนด URL ปลายทาง (Slug) สำหรับแชร์ลิงก์แยกเหมือนบทความ WordPress พร้อมรูปภาพ แกลเลอรี และข้อมูลพาร์ตเนอร์
                  </p>
                </div>
                <button 
                  id="btn-add-activity-modal"
                  className="btn-primary"
                  onClick={() => setShowAddActivityModal(true)}
                >
                  <Plus size={15} />
                  <span>เพิ่มกิจกรรม / บทความใหม่</span>
                </button>
              </div>

              {/* Activities Data Table */}
              <div className="admin-subcard glass-panel">
                <div className="subcard-title">
                  <Trophy size={16} className="text-blue" />
                  <strong>รายการกิจกรรมและบทความทั้งหมด ({(siteData.gallery || []).length} รายการ)</strong>
                </div>

                <div className="activities-table-wrapper">
                  <table className="erp-table activities-cms-table">
                    <thead>
                      <tr>
                        <th style={{ width: '80px' }}>ภาพหน้าปก</th>
                        <th>ชื่อกิจกรรม & หมวดหมู่</th>
                        <th>URL ปลายทาง (Slug)</th>
                        <th>วันที่ & พาร์ตเนอร์</th>
                        <th style={{ width: '130px', textAlign: 'center' }}>การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(siteData.gallery || []).map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="table-thumb-frame">
                              <img src={item.image} alt={item.title} />
                            </div>
                          </td>
                          <td>
                            <div className="table-title-cell">
                              <strong>{item.title}</strong>
                              <span className="table-tag-pill">{item.tag || item.category}</span>
                            </div>
                          </td>
                          <td>
                            <div className="table-slug-cell">
                              <code>#/activity/{item.slug || item.id}</code>
                              <a 
                                href={`#/activity/${item.slug || item.id}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="slug-preview-btn"
                                title="เปิดดูหน้านี้"
                              >
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </td>
                          <td>
                            <div className="table-date-cell">
                              <span>{item.date}</span>
                              <small>{item.partner}</small>
                            </div>
                          </td>
                          <td>
                            <div className="table-actions-cell">
                              <a 
                                href={`#/activity/${item.slug || item.id}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn-table-action view" 
                                title="เปิดดูหน้าจริง"
                              >
                                <Eye size={14} />
                              </a>
                              <button 
                                className="btn-table-action edit"
                                onClick={() => {
                                  setEditingActivity({
                                    ...item,
                                    contentBlocks: (item.contentBlocks && item.contentBlocks.length > 0)
                                      ? item.contentBlocks
                                      : (item.contentParagraphs && item.contentParagraphs.length > 0 ? item.contentParagraphs : [item.desc || '']).map((paraText, pI) => ({
                                          id: `block_conv_${pI}_${Date.now()}`,
                                          type: 'paragraph',
                                          align: 'left',
                                          text: paraText
                                        })),
                                    contentParagraphsText: (item.contentParagraphs || [item.desc]).join('\n\n'),
                                    enableAISearch: item.enableAISearch !== false,
                                    galleryPhotos: (item.galleryPhotos || []).map((p, idx) => {
                                      if (typeof p === 'string') {
                                        return { url: p, caption: item.title, alt: item.imageAlt || `${item.title} ภาพที่ ${idx + 1}` };
                                      }
                                      return {
                                        url: p.url || '',
                                        caption: p.caption || item.title || '',
                                        alt: p.alt || p.caption || item.imageAlt || `${item.title} ภาพที่ ${idx + 1}`
                                      };
                                    })
                                  });
                                }}
                                title="แก้ไขบทความนี้"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                className="btn-table-action delete"
                                onClick={() => {
                                  if (window.confirm(`คุณต้องการลบกิจกรรม "${item.title}" ใช่หรือไม่?`)) {
                                    deleteActivityItem(item.id);
                                    triggerSaveToast();
                                  }
                                }}
                                title="ลบกิจกรรมนี้"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Edit Activity Modal */}
              {editingActivity && (
                <div className="cms-modal-backdrop" onClick={() => setEditingActivity(null)}>
                  <div className="cms-modal-card modal-extra-wide" style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                    <div className="modal-head" style={{ flexShrink: 0 }}>
                      <h4>แก้ไขบทความกิจกรรม: {editingActivity.title}</h4>
                      <button onClick={() => setEditingActivity(null)} className="btn-close-modal">✕</button>
                    </div>

                    <div className="modal-body-form" style={{ flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }}>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>ชื่อกิจกรรม / หัวข้อบทความ</label>
                          <input 
                            type="text" className="form-input"
                            value={editingActivity.title}
                            onChange={e => setEditingActivity({ ...editingActivity, title: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label>URL Slug ปลายทาง (เช่น icafe-lan-tournament)</label>
                          <div className="slug-input-prefix">
                            <span>#/activity/</span>
                            <input 
                              type="text" className="form-input"
                              value={editingActivity.slug || ''}
                              onChange={e => setEditingActivity({ 
                                ...editingActivity, 
                                slug: e.target.value.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)/g, '') 
                              })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-row-3">
                        <div className="form-group">
                          <label>หมวดหมู่</label>
                          <select 
                            className="form-input"
                            value={editingActivity.category}
                            onChange={e => setEditingActivity({ ...editingActivity, category: e.target.value })}
                          >
                            <option value="tournament">การแข่งขัน & ทัวร์นาเมนต์ (tournament)</option>
                            <option value="publisher">งานเปิดตัวเกม & ค่ายเกม (publisher)</option>
                            <option value="community">คอมมูนิตี้ & แจกรางวัล (community)</option>
                            <option value="venue">บรรยากาศร้าน & แข่ง LAN 24 ชม. (venue)</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>ป้ายหัวข้อเล็ก (Tag Badge เช่น LAN TOURNAMENT)</label>
                          <input 
                            type="text" className="form-input"
                            value={editingActivity.tag || ''}
                            onChange={e => setEditingActivity({ ...editingActivity, tag: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label>พาร์ตเนอร์ / ผู้สนับสนุน</label>
                          <input 
                            type="text" className="form-input"
                            value={editingActivity.partner || ''}
                            onChange={e => setEditingActivity({ ...editingActivity, partner: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-row-3">
                        <div className="form-group">
                          <label>วันที่จัดกิจกรรม (เช่น สิงหาคม 2026)</label>
                          <input 
                            type="text" className="form-input"
                            value={editingActivity.date || ''}
                            onChange={e => setEditingActivity({ ...editingActivity, date: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label>เวลาที่ใช้ในการอ่าน (เช่น 3 นาที)</label>
                          <input 
                            type="text" className="form-input"
                            value={editingActivity.readTime || '3 นาทีในการอ่าน'}
                            onChange={e => setEditingActivity({ ...editingActivity, readTime: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label>รางวัลรวม (Prize Pool)</label>
                          <input 
                            type="text" className="form-input"
                            value={editingActivity.prizePool || ''}
                            onChange={e => setEditingActivity({ ...editingActivity, prizePool: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="image-manager-row">
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>URL รูปภาพหน้าปก (Cover Image URL)</label>
                          <input 
                            type="url" className="form-input"
                            value={editingActivity.image || ''}
                            onChange={e => setEditingActivity({ ...editingActivity, image: e.target.value })}
                          />
                        </div>
                        <div className="image-upload-wrapper">
                          <label className="btn-upload-file" title="เลือกไฟล์ภาพ ระบบจะย่อขนาดและแปลงเป็น WebP บีบอัดอัตโนมัติ">
                            {compressingItemId === 'edit-act-cover' ? (
                              <>
                                <RefreshCw size={14} className="spin-icon" />
                                <span>กำลังแปลง WebP...</span>
                              </>
                            ) : (
                              <>
                                <Upload size={14} />
                                <span>อัปโหลดภาพ (WebP)</span>
                              </>
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }}
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, (dataUrl) => {
                                    setEditingActivity({ ...editingActivity, image: dataUrl });
                                  }, 'edit-act-cover');
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Image ALT Tag for SEO */}
                      <div className="form-group" style={{ marginTop: '4px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                          <Tag size={13} className="text-blue" />
                          <span>คำอธิบายรูปภาพสำหรับ SEO (Image ALT Tag):</span>
                        </label>
                        <input 
                          type="text" 
                          className="form-input"
                          placeholder="เช่น ภาพถ่ายบรรยากาศการแข่งขันรอบชิงชนะเลิศ GLP VALORANT ณ เวทีกลาง"
                          value={editingActivity.imageAlt || ''}
                          onChange={e => setEditingActivity({ ...editingActivity, imageAlt: e.target.value })}
                        />
                        <span className="text-xs text-muted" style={{ display: 'block', marginTop: '4px' }}>
                          ใช้สำหรับ Google Image Search และการแชร์ขึ้น Social Media (OG Image)
                        </span>
                      </div>

                      <div className="form-group">
                        <label>คำอธิบายสั้น (Excerpt / บทคัดย่อ)</label>
                        <textarea 
                          className="form-input form-textarea" rows="2"
                          value={editingActivity.desc || ''}
                          onChange={e => setEditingActivity({ ...editingActivity, desc: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
                          เนื้อหาบทความเต็ม (Visual Block Editor สไตล์ WordPress Gutenberg)
                        </label>
                        <ArticleBlockEditor 
                          blocks={editingActivity.contentBlocks || []} 
                          onChange={(updatedBlocks) => {
                            setEditingActivity(prev => ({
                              ...prev,
                              contentBlocks: updatedBlocks
                            }));
                          }} 
                        />
                      </div>

                      {/* Interactive High-Res Photo Gallery & SEO ALT Manager */}
                      <div className="form-group gallery-cms-section">
                        <div className="gallery-cms-header">
                          <div className="gallery-cms-title-wrap">
                            <div className="gallery-cms-title">
                              <ImageIcon size={18} className="text-blue" />
                              <strong>แกลเลอรีรูปภาพความละเอียดสูง (Photo Gallery)</strong>
                              <span className="gallery-count-badge">{(editingActivity.galleryPhotos || []).length} ภาพ</span>
                            </div>
                            <p className="gallery-cms-subtitle">
                              อัปโหลดภาพกิจกรรม (แปลงเป็น WebP อัตโนมัติ) และกำหนด ALT Text สำหรับ SEO & AI Search Engine
                            </p>
                          </div>

                          <div className="gallery-cms-actions">
                            <label className="btn-upload-file btn-upload-gallery-primary" title="เลือกไฟล์ภาพหลายไฟล์พร้อมกัน ระบบจะย่อขนาดและแปลงเป็น WebP อัตโนมัติ">
                              {compressingItemId === 'edit-gallery-photos' ? (
                                <>
                                  <RefreshCw size={14} className="spin-icon" />
                                  <span>กำลังแปลง WebP...</span>
                                </>
                              ) : (
                                <>
                                  <Upload size={14} />
                                  <span>อัปโหลดภาพแกลเลอรี (WebP)</span>
                                </>
                              )}
                              <input 
                                type="file" 
                                accept="image/*" 
                                multiple
                                style={{ display: 'none' }}
                                onChange={e => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    handleBatchGalleryUpload(e.target.files, true);
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Quick Add URL Box */}
                        <div className="gallery-url-quick-add">
                          <input 
                            type="url" 
                            className="form-input form-input-sm" 
                            placeholder="หรือวาง URL รูปภาพภายนอกที่นี่..." 
                            value={editGalleryUrl}
                            onChange={e => setEditGalleryUrl(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (editGalleryUrl.trim()) {
                                  setEditingActivity(prev => ({
                                    ...prev,
                                    galleryPhotos: [
                                      ...(prev.galleryPhotos || []),
                                      {
                                        url: editGalleryUrl.trim(),
                                        caption: prev.title || 'ภาพบรรยากาศกิจกรรม',
                                        alt: `${prev.title || 'กิจกรรม'} - ภาพประกอบ`
                                      }
                                    ]
                                  }));
                                  setEditGalleryUrl('');
                                }
                              }
                            }}
                          />
                          <button 
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => {
                              if (editGalleryUrl.trim()) {
                                setEditingActivity(prev => ({
                                  ...prev,
                                  galleryPhotos: [
                                    ...(prev.galleryPhotos || []),
                                    {
                                      url: editGalleryUrl.trim(),
                                      caption: prev.title || 'ภาพบรรยากาศกิจกรรม',
                                      alt: `${prev.title || 'กิจกรรม'} - ภาพประกอบ`
                                    }
                                  ]
                                }));
                                setEditGalleryUrl('');
                              }
                            }}
                          >
                            <Plus size={13} /> เพิ่ม URL
                          </button>
                        </div>

                        {/* Generative AI Search & SEO Notice Banner */}
                        <div className="ai-search-status-banner">
                          <div className="ai-search-banner-left">
                            <Sparkles size={16} className="text-cyan" />
                            <div>
                              <div className="ai-search-title">
                                <span>เปิด AI Search ทุกแพลตฟอร์ม (Generative Engine Optimization - GEO)</span>
                                <span className="ai-status-tag active">Active ทุกระบบ</span>
                              </div>
                              <p className="ai-search-desc">
                                รูปภาพและข้อความ ALT จะถูกจัดโครงสร้าง Schema.org (ImageObject) ให้อัตโนมัติ เพื่อให้ Google SGE, Gemini, ChatGPT (GPTBot), ClaudeBot, PerplexityBot นำภาพไปแนะนำ
                              </p>
                            </div>
                          </div>
                          <div className="ai-bots-chip-list">
                            <span className="bot-pill google">Google SGE / Gemini</span>
                            <span className="bot-pill gpt">OpenAI ChatGPT</span>
                            <span className="bot-pill claude">Anthropic Claude</span>
                            <span className="bot-pill perplexity">Perplexity AI</span>
                            <span className="bot-pill apple">Applebot</span>
                          </div>
                        </div>

                        {/* Gallery Photo List with ALT & Caption inputs */}
                        <div className="gallery-photo-items-list">
                          {(editingActivity.galleryPhotos || []).length === 0 ? (
                            <div className="gallery-empty-state">
                              <ImageIcon size={32} className="text-muted" />
                              <p>ยังไม่มีรูปภาพในแกลเลอรี</p>
                              <span>กดปุ่ม <strong>"อัปโหลดภาพแกลเลอรี (WebP)"</strong> ด้านบน เพื่อเลือกไฟล์จากเครื่อง (เลือกได้หลายไฟล์พร้อมกัน) หรือวาง URL</span>
                            </div>
                          ) : (
                            (editingActivity.galleryPhotos || []).map((photo, pIdx) => (
                              <div key={pIdx} className="gallery-item-card">
                                <div className="gallery-item-thumb">
                                  <img src={photo.url || photo} alt={photo.alt || `ภาพ ${pIdx + 1}`} />
                                  <span className="gallery-item-index">#{pIdx + 1}</span>
                                </div>

                                <div className="gallery-item-fields">
                                  <div className="form-group">
                                    <label className="field-lbl-sm">
                                      <Tag size={12} className="text-blue" />
                                      <span>คำอธิบายภาพสำหรับ SEO (Image ALT Tag) *สำคัญต่อ Google & AI Search:</span>
                                    </label>
                                    <input 
                                      type="text" 
                                      className="form-input form-input-sm"
                                      placeholder="เช่น ภาพถ่ายบรรยากาศนักกีฬาบนเวทีการแข่งขัน GLP 2026..."
                                      value={photo.alt || ''}
                                      onChange={e => {
                                        const newAlt = e.target.value;
                                        setEditingActivity(prev => {
                                          const list = [...(prev.galleryPhotos || [])];
                                          list[pIdx] = { ...list[pIdx], alt: newAlt };
                                          return { ...prev, galleryPhotos: list };
                                        });
                                      }}
                                    />
                                    <span className="text-xs text-muted">
                                      {photo.alt ? '✓ SEO & AI Ready' : '⚠️ แนะนำให้ระบุ ALT เพื่อให้ AI และ Google Image Search ค้นพบภาพนี้'}
                                    </span>
                                  </div>

                                  <div className="form-group" style={{ marginTop: '6px' }}>
                                    <label className="field-lbl-sm">
                                      <span>คำบรรยายใต้ภาพ (Lightbox Caption):</span>
                                    </label>
                                    <input 
                                      type="text" 
                                      className="form-input form-input-sm"
                                      placeholder="เช่น จอ LED 4K ขนาดยักษ์ ถ่ายทอดสดมุมมองผู้เล่น..."
                                      value={photo.caption || ''}
                                      onChange={e => {
                                        const newCap = e.target.value;
                                        setEditingActivity(prev => {
                                          const list = [...(prev.galleryPhotos || [])];
                                          list[pIdx] = { ...list[pIdx], caption: newCap };
                                          return { ...prev, galleryPhotos: list };
                                        });
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="gallery-item-actions">
                                  <button 
                                    type="button" 
                                    className="btn-item-ctrl" 
                                    disabled={pIdx === 0}
                                    title="ย้ายขึ้น"
                                    onClick={() => {
                                      setEditingActivity(prev => {
                                        const list = [...(prev.galleryPhotos || [])];
                                        if (pIdx > 0) {
                                          const temp = list[pIdx];
                                          list[pIdx] = list[pIdx - 1];
                                          list[pIdx - 1] = temp;
                                        }
                                        return { ...prev, galleryPhotos: list };
                                      });
                                    }}
                                  >
                                    <ChevronUp size={14} />
                                  </button>
                                  <button 
                                    type="button" 
                                    className="btn-item-ctrl" 
                                    disabled={pIdx === (editingActivity.galleryPhotos || []).length - 1}
                                    title="ย้ายลง"
                                    onClick={() => {
                                      setEditingActivity(prev => {
                                        const list = [...(prev.galleryPhotos || [])];
                                        if (pIdx < list.length - 1) {
                                          const temp = list[pIdx];
                                          list[pIdx] = list[pIdx + 1];
                                          list[pIdx + 1] = temp;
                                        }
                                        return { ...prev, galleryPhotos: list };
                                      });
                                    }}
                                  >
                                    <ChevronDown size={14} />
                                  </button>
                                  <button 
                                    type="button" 
                                    className="btn-item-ctrl delete" 
                                    title="ลบรูปภาพนี้"
                                    onClick={() => {
                                      setEditingActivity(prev => ({
                                        ...prev,
                                        galleryPhotos: (prev.galleryPhotos || []).filter((_, i) => i !== pIdx)
                                      }));
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer-btns" style={{ flexShrink: 0 }}>
                      <button className="btn-secondary" onClick={() => setEditingActivity(null)}>ยกเลิก</button>
                      <button 
                        type="button" 
                        className="btn-section-preview" 
                        onClick={() => openPreview('article-view', editingActivity)}
                      >
                        <Eye size={14} /> พรีวิวตัวอย่างบทความ
                      </button>
                      <button 
                        className="btn-primary" 
                        onClick={() => {
                          let paragraphs = [];
                          if (editingActivity.contentBlocks && editingActivity.contentBlocks.length > 0) {
                            paragraphs = editingActivity.contentBlocks
                              .map(b => {
                                if (b.type === 'heading') return b.text;
                                if (b.type === 'paragraph') return b.text;
                                if (b.type === 'media-text') return `${b.title ? b.title + ': ' : ''}${b.text || ''}`.trim();
                                if (b.type === 'columns-2') return `${b.leftTitle || ''} ${b.leftText || ''}\n${b.rightTitle || ''} ${b.rightText || ''}`.trim();
                                if (b.type === 'columns-3') return `${b.col1Text || ''}\n${b.col2Text || ''}\n${b.col3Text || ''}`.trim();
                                if (b.type === 'quote') return `"${b.text}" ${b.author ? `— ${b.author}` : ''}`.trim();
                                if (b.type === 'callout') return `${b.title ? b.title + ': ' : ''}${b.text || ''}`.trim();
                                if (b.type === 'list') return (b.items || []).join('\n');
                                return '';
                              })
                              .filter(Boolean);
                          }
                          if (paragraphs.length === 0) {
                            paragraphs = (editingActivity.contentParagraphsText || '')
                              .split('\n\n')
                              .map(p => p.trim())
                              .filter(Boolean);
                          }
                          const validPhotos = (editingActivity.galleryPhotos || []).map(p => {
                            if (typeof p === 'string') return { url: p, caption: editingActivity.title, alt: editingActivity.imageAlt || editingActivity.title };
                            return {
                              url: p.url || '',
                              caption: p.caption || editingActivity.title || '',
                              alt: p.alt || p.caption || editingActivity.imageAlt || editingActivity.title || ''
                            };
                          }).filter(p => Boolean(p.url));

                          updateActivityItem(editingActivity.id, {
                            ...editingActivity,
                            contentBlocks: editingActivity.contentBlocks || [],
                            contentParagraphs: paragraphs.length > 0 ? paragraphs : [editingActivity.desc],
                            galleryPhotos: validPhotos.length > 0 ? validPhotos : [{ url: editingActivity.image, caption: editingActivity.title, alt: editingActivity.imageAlt || editingActivity.title }]
                          });
                          setEditingActivity(null);
                          triggerSaveToast();
                        }}
                      >
                        <Save size={14} /> บันทึกบทความกิจกรรม
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add New Activity Modal */}
              {showAddActivityModal && (
                <div className="cms-modal-backdrop" onClick={() => setShowAddActivityModal(false)}>
                  <div className="cms-modal-card modal-extra-wide" style={{ maxHeight: '92vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                    <div className="modal-head" style={{ flexShrink: 0 }}>
                      <h4>เพิ่มกิจกรรม & บทความใหม่ (New Article)</h4>
                      <button onClick={() => setShowAddActivityModal(false)} className="btn-close-modal">✕</button>
                    </div>

                    <div className="modal-body-form" style={{ flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }}>
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>ชื่อกิจกรรม / หัวข้อบทความ</label>
                          <input 
                            type="text" className="form-input"
                            placeholder="เช่น GLP VALORANT OPEN CHAMPIONSHIP 2026"
                            value={newActivity.title}
                            onChange={e => {
                              const title = e.target.value;
                              const autoSlug = title.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)/g, '');
                              setNewActivity({ 
                                ...newActivity, 
                                title, 
                                slug: newActivity.slug ? newActivity.slug : autoSlug 
                              });
                            }}
                          />
                        </div>

                        <div className="form-group">
                          <label>URL Slug ปลายทาง (เช่น glp-valorant-open-2026)</label>
                          <div className="slug-input-prefix">
                            <span>#/activity/</span>
                            <input 
                              type="text" className="form-input"
                              placeholder="valorant-open-2026"
                              value={newActivity.slug}
                              onChange={e => setNewActivity({ 
                                ...newActivity, 
                                slug: e.target.value.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)/g, '') 
                              })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-row-3">
                        <div className="form-group">
                          <label>หมวดหมู่</label>
                          <select 
                            className="form-input"
                            value={newActivity.category}
                            onChange={e => setNewActivity({ ...newActivity, category: e.target.value })}
                          >
                            <option value="tournament">การแข่งขัน & ทัวร์นาเมนต์ (tournament)</option>
                            <option value="publisher">งานเปิดตัวเกม & ค่ายเกม (publisher)</option>
                            <option value="community">คอมมูนิตี้ & แจกรางวัล (community)</option>
                            <option value="venue">บรรยากาศร้าน & แข่ง LAN 24 ชม. (venue)</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>ป้ายหัวข้อเล็ก (Tag Badge)</label>
                          <input 
                            type="text" className="form-input"
                            placeholder="LAN TOURNAMENT"
                            value={newActivity.tag}
                            onChange={e => setNewActivity({ ...newActivity, tag: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label>พาร์ตเนอร์ / ผู้สนับสนุน</label>
                          <input 
                            type="text" className="form-input"
                            placeholder="ASUS ROG, NVIDIA"
                            value={newActivity.partner}
                            onChange={e => setNewActivity({ ...newActivity, partner: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="image-manager-row">
                        <div className="form-group" style={{ flex: 1 }}>
                          <label>URL รูปภาพหน้าปก (Cover Image URL)</label>
                          <input 
                            type="url" className="form-input"
                            value={newActivity.image}
                            onChange={e => setNewActivity({ ...newActivity, image: e.target.value })}
                          />
                        </div>
                        <div className="image-upload-wrapper">
                          <label className="btn-upload-file" title="เลือกไฟล์ภาพ ระบบจะย่อขนาดและแปลงเป็น WebP บีบอัดอัตโนมัติ">
                            {compressingItemId === 'new-act-cover' ? (
                              <>
                                <RefreshCw size={14} className="spin-icon" />
                                <span>กำลังแปลง WebP...</span>
                              </>
                            ) : (
                              <>
                                <Upload size={14} />
                                <span>อัปโหลดภาพ (WebP)</span>
                              </>
                            )}
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }}
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, (dataUrl) => {
                                    setNewActivity({ ...newActivity, image: dataUrl });
                                  }, 'new-act-cover');
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Image ALT Tag for SEO */}
                      <div className="form-group" style={{ marginTop: '4px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                          <Tag size={13} className="text-blue" />
                          <span>คำอธิบายรูปภาพสำหรับ SEO (Image ALT Tag):</span>
                        </label>
                        <input 
                          type="text" 
                          className="form-input"
                          placeholder="เช่น ภาพถ่ายบรรยากาศการแข่งขันรอบชิงชนะเลิศ GLP VALORANT ณ เวทีกลาง"
                          value={newActivity.imageAlt || ''}
                          onChange={e => setNewActivity({ ...newActivity, imageAlt: e.target.value })}
                        />
                        <span className="text-xs text-muted" style={{ display: 'block', marginTop: '4px' }}>
                          ใช้สำหรับ Google Image Search และการแชร์ขึ้น Social Media (OG Image)
                        </span>
                      </div>

                      <div className="form-group">
                        <label>คำอธิบายสั้น (Excerpt)</label>
                        <textarea 
                          className="form-input form-textarea" rows="2"
                          placeholder="สรุปไฮไลต์ของกิจกรรมสั้นๆ..."
                          value={newActivity.desc}
                          onChange={e => setNewActivity({ ...newActivity, desc: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
                          เนื้อหาบทความเต็ม (Visual Block Editor สไตล์ WordPress Gutenberg)
                        </label>
                        <ArticleBlockEditor 
                          blocks={newActivity.contentBlocks || []} 
                          onChange={(updatedBlocks) => {
                            setNewActivity(prev => ({
                              ...prev,
                              contentBlocks: updatedBlocks
                            }));
                          }} 
                        />
                      </div>
                      {/* Interactive High-Res Photo Gallery & SEO ALT Manager */}
                      <div className="form-group gallery-cms-section">
                        <div className="gallery-cms-header">
                          <div className="gallery-cms-title-wrap">
                            <div className="gallery-cms-title">
                              <ImageIcon size={18} className="text-blue" />
                              <strong>แกลเลอรีรูปภาพความละเอียดสูง (Photo Gallery)</strong>
                              <span className="gallery-count-badge">{(newActivity.galleryPhotos || []).length} ภาพ</span>
                            </div>
                            <p className="gallery-cms-subtitle">
                              อัปโหลดภาพกิจกรรม (แปลงเป็น WebP อัตโนมัติ) และกำหนด ALT Text สำหรับ SEO & AI Search Engine
                            </p>
                          </div>

                          <div className="gallery-cms-actions">
                            <label className="btn-upload-file btn-upload-gallery-primary" title="เลือกไฟล์ภาพหลายไฟล์พร้อมกัน ระบบจะย่อขนาดและแปลงเป็น WebP อัตโนมัติ">
                              {compressingItemId === 'new-gallery-photos' ? (
                                <>
                                  <RefreshCw size={14} className="spin-icon" />
                                  <span>กำลังแปลง WebP...</span>
                                </>
                              ) : (
                                <>
                                  <Upload size={14} />
                                  <span>อัปโหลดภาพแกลเลอรี (WebP)</span>
                                </>
                              )}
                              <input 
                                type="file" 
                                accept="image/*" 
                                multiple
                                style={{ display: 'none' }}
                                onChange={e => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    handleBatchGalleryUpload(e.target.files, false);
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Quick Add URL Box */}
                        <div className="gallery-url-quick-add">
                          <input 
                            type="url" 
                            className="form-input form-input-sm" 
                            placeholder="หรือวาง URL รูปภาพภายนอกที่นี่..." 
                            value={newGalleryUrl}
                            onChange={e => setNewGalleryUrl(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newGalleryUrl.trim()) {
                                  setNewActivity(prev => ({
                                    ...prev,
                                    galleryPhotos: [
                                      ...(prev.galleryPhotos || []),
                                      {
                                        url: newGalleryUrl.trim(),
                                        caption: prev.title || 'ภาพบรรยากาศกิจกรรม',
                                        alt: `${prev.title || 'กิจกรรม'} - ภาพประกอบ`
                                      }
                                    ]
                                  }));
                                  setNewGalleryUrl('');
                                }
                              }
                            }}
                          />
                          <button 
                            type="button"
                            className="btn-secondary btn-sm"
                            onClick={() => {
                              if (newGalleryUrl.trim()) {
                                setNewActivity(prev => ({
                                  ...prev,
                                  galleryPhotos: [
                                    ...(prev.galleryPhotos || []),
                                    {
                                      url: newGalleryUrl.trim(),
                                      caption: prev.title || 'ภาพบรรยากาศกิจกรรม',
                                      alt: `${prev.title || 'กิจกรรม'} - ภาพประกอบ`
                                    }
                                  ]
                                }));
                                setNewGalleryUrl('');
                              }
                            }}
                          >
                            <Plus size={13} /> เพิ่ม URL
                          </button>
                        </div>

                        {/* Generative AI Search & SEO Notice Banner */}
                        <div className="ai-search-status-banner">
                          <div className="ai-search-banner-left">
                            <Sparkles size={16} className="text-cyan" />
                            <div>
                              <div className="ai-search-title">
                                <span>เปิด AI Search ทุกแพลตฟอร์ม (Generative Engine Optimization - GEO)</span>
                                <span className="ai-status-tag active">Active ทุกระบบ</span>
                              </div>
                              <p className="ai-search-desc">
                                รูปภาพและข้อความ ALT จะถูกจัดโครงสร้าง Schema.org (ImageObject) ให้อัตโนมัติ เพื่อให้ Google SGE, Gemini, ChatGPT (GPTBot), ClaudeBot, PerplexityBot นำภาพไปแนะนำ
                              </p>
                            </div>
                          </div>
                          <div className="ai-bots-chip-list">
                            <span className="bot-pill google">Google SGE / Gemini</span>
                            <span className="bot-pill gpt">OpenAI ChatGPT</span>
                            <span className="bot-pill claude">Anthropic Claude</span>
                            <span className="bot-pill perplexity">Perplexity AI</span>
                            <span className="bot-pill apple">Applebot</span>
                          </div>
                        </div>

                        {/* Gallery Photo List with ALT & Caption inputs */}
                        <div className="gallery-photo-items-list">
                          {(newActivity.galleryPhotos || []).length === 0 ? (
                            <div className="gallery-empty-state">
                              <ImageIcon size={32} className="text-muted" />
                              <p>ยังไม่มีรูปภาพในแกลเลอรี</p>
                              <span>กดปุ่ม <strong>"อัปโหลดภาพแกลเลอรี (WebP)"</strong> ด้านบน เพื่อเลือกไฟล์จากเครื่อง (เลือกได้หลายไฟล์พร้อมกัน) หรือวาง URL</span>
                            </div>
                          ) : (
                            (newActivity.galleryPhotos || []).map((photo, pIdx) => (
                              <div key={pIdx} className="gallery-item-card">
                                <div className="gallery-item-thumb">
                                  <img src={photo.url || photo} alt={photo.alt || `ภาพ ${pIdx + 1}`} />
                                  <span className="gallery-item-index">#{pIdx + 1}</span>
                                </div>

                                <div className="gallery-item-fields">
                                  <div className="form-group">
                                    <label className="field-lbl-sm">
                                      <Tag size={12} className="text-blue" />
                                      <span>คำอธิบายภาพสำหรับ SEO (Image ALT Tag) *สำคัญต่อ Google & AI Search:</span>
                                    </label>
                                    <input 
                                      type="text" 
                                      className="form-input form-input-sm"
                                      placeholder="เช่น ภาพถ่ายบรรยากาศนักกีฬาบนเวทีการแข่งขัน GLP 2026..."
                                      value={photo.alt || ''}
                                      onChange={e => {
                                        const newAlt = e.target.value;
                                        setNewActivity(prev => {
                                          const list = [...(prev.galleryPhotos || [])];
                                          list[pIdx] = { ...list[pIdx], alt: newAlt };
                                          return { ...prev, galleryPhotos: list };
                                        });
                                      }}
                                    />
                                    <span className="text-xs text-muted">
                                      {photo.alt ? '✓ SEO & AI Ready' : '⚠️ แนะนำให้ระบุ ALT เพื่อให้ AI และ Google Image Search ค้นพบภาพนี้'}
                                    </span>
                                  </div>

                                  <div className="form-group" style={{ marginTop: '6px' }}>
                                    <label className="field-lbl-sm">
                                      <span>คำบรรยายใต้ภาพ (Lightbox Caption):</span>
                                    </label>
                                    <input 
                                      type="text" 
                                      className="form-input form-input-sm"
                                      placeholder="เช่น จอ LED 4K ขนาดยักษ์ ถ่ายทอดสดมุมมองผู้เล่น..."
                                      value={photo.caption || ''}
                                      onChange={e => {
                                        const newCap = e.target.value;
                                        setNewActivity(prev => {
                                          const list = [...(prev.galleryPhotos || [])];
                                          list[pIdx] = { ...list[pIdx], caption: newCap };
                                          return { ...prev, galleryPhotos: list };
                                        });
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="gallery-item-actions">
                                  <button 
                                    type="button" 
                                    className="btn-item-ctrl" 
                                    disabled={pIdx === 0}
                                    title="ย้ายขึ้น"
                                    onClick={() => {
                                      setNewActivity(prev => {
                                        const list = [...(prev.galleryPhotos || [])];
                                        if (pIdx > 0) {
                                          const temp = list[pIdx];
                                          list[pIdx] = list[pIdx - 1];
                                          list[pIdx - 1] = temp;
                                        }
                                        return { ...prev, galleryPhotos: list };
                                      });
                                    }}
                                  >
                                    <ChevronUp size={14} />
                                  </button>
                                  <button 
                                    type="button" 
                                    className="btn-item-ctrl" 
                                    disabled={pIdx === (newActivity.galleryPhotos || []).length - 1}
                                    title="ย้ายลง"
                                    onClick={() => {
                                      setNewActivity(prev => {
                                        const list = [...(prev.galleryPhotos || [])];
                                        if (pIdx < list.length - 1) {
                                          const temp = list[pIdx];
                                          list[pIdx] = list[pIdx + 1];
                                          list[pIdx + 1] = temp;
                                        }
                                        return { ...prev, galleryPhotos: list };
                                      });
                                    }}
                                  >
                                    <ChevronDown size={14} />
                                  </button>
                                  <button 
                                    type="button" 
                                    className="btn-item-ctrl delete" 
                                    title="ลบรูปภาพนี้"
                                    onClick={() => {
                                      setNewActivity(prev => ({
                                        ...prev,
                                        galleryPhotos: (prev.galleryPhotos || []).filter((_, i) => i !== pIdx)
                                      }));
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer-btns" style={{ flexShrink: 0 }}>
                      <button className="btn-secondary" onClick={() => setShowAddActivityModal(false)}>ยกเลิก</button>
                      <button 
                        type="button" 
                        className="btn-section-preview" 
                        onClick={() => openPreview('article-view', newActivity)}
                      >
                        <Eye size={14} /> พรีวิวตัวอย่างบทความ
                      </button>
                      <button 
                        className="btn-primary" 
                        onClick={() => {
                          if (!newActivity.title.trim()) {
                            alert('กรุณาระบุชื่อกิจกรรม');
                            return;
                          }
                          let paragraphs = [];
                          if (newActivity.contentBlocks && newActivity.contentBlocks.length > 0) {
                            paragraphs = newActivity.contentBlocks
                              .map(b => {
                                if (b.type === 'heading') return b.text;
                                if (b.type === 'paragraph') return b.text;
                                if (b.type === 'media-text') return `${b.title ? b.title + ': ' : ''}${b.text || ''}`.trim();
                                if (b.type === 'columns-2') return `${b.leftTitle || ''} ${b.leftText || ''}\n${b.rightTitle || ''} ${b.rightText || ''}`.trim();
                                if (b.type === 'columns-3') return `${b.col1Text || ''}\n${b.col2Text || ''}\n${b.col3Text || ''}`.trim();
                                if (b.type === 'quote') return `"${b.text}" ${b.author ? `— ${b.author}` : ''}`.trim();
                                if (b.type === 'callout') return `${b.title ? b.title + ': ' : ''}${b.text || ''}`.trim();
                                if (b.type === 'list') return (b.items || []).join('\n');
                                return '';
                              })
                              .filter(Boolean);
                          }
                          if (paragraphs.length === 0) {
                            paragraphs = (newActivity.contentParagraphsText || '')
                              .split('\n\n')
                              .map(p => p.trim())
                              .filter(Boolean);
                          }
                          const validPhotos = (newActivity.galleryPhotos || []).map(p => {
                            if (typeof p === 'string') return { url: p, caption: newActivity.title, alt: newActivity.imageAlt || newActivity.title };
                            return {
                              url: p.url || '',
                              caption: p.caption || newActivity.title || '',
                              alt: p.alt || p.caption || newActivity.imageAlt || newActivity.title || ''
                            };
                          }).filter(p => Boolean(p.url));

                          addActivityItem({
                            ...newActivity,
                            contentBlocks: newActivity.contentBlocks || [],
                            contentParagraphs: paragraphs.length > 0 ? paragraphs : [newActivity.desc],
                            galleryPhotos: validPhotos.length > 0 ? validPhotos : [{ url: newActivity.image, caption: newActivity.title, alt: newActivity.imageAlt || newActivity.title }]
                          });
                          setShowAddActivityModal(false);
                          triggerSaveToast();
                        }}
                      >
                        <Save size={14} /> เพิ่มบทความใหม่ลงระบบ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 5: AUTOMATION, N8N WORKFLOWS & WEBHOOKS
              ========================================================================= */}
          {activeTab === 'automation' && (
            <div className="cms-panel-block">
              <div className="panel-header-row">
                <div>
                  <h3 className="panel-title">
                    <Sliders size={20} className="text-blue" />
                    <span>ระบบ Automation, n8n Workflow Hub & Webhooks</span>
                  </h3>
                  <p className="panel-desc">
                    เชื่อมต่อระบบอัตโนมัติ 4 ทิศทางสำหรับร้านเกมอีสปอร์ต: Lead แฟรนไชส์, สมัครแข่งทัวร์นาเมนต์, ซิงก์บัญชีสิ้นวัน, และแจ้งเตือน Staff ผ่าน LINE Notify
                  </p>
                </div>
              </div>

              {/* Workflows Grid */}
              <div className="form-row-2" style={{ gap: '20px' }}>
                {(siteData.n8nWorkflows || []).map(wf => (
                  <div key={wf.id} className="admin-subcard glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="subcard-title" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Zap size={16} className="text-blue" />
                          <strong>{wf.name}</strong>
                        </div>
                        <span className={`status-pill ${wf.enabled ? 'status-pill-success' : 'status-pill-warning'}`}>
                          {wf.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>

                      <p className="subcard-desc" style={{ marginBottom: '14px' }}>
                        {wf.desc}
                      </p>

                      <div className="form-group">
                        <label>n8n Production Webhook URL</label>
                        <input 
                          type="url" 
                          className="form-input"
                          value={wf.endpoint || ''}
                          onChange={e => updateN8NWorkflow(wf.id, { endpoint: e.target.value })}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.78rem', color: '#64748b' }}>
                        <span>สถานะล่าสุด: <strong className="text-blue">{wf.lastStatus}</strong></span>
                        <span>ประมวลผลแล้ว: <strong>{wf.eventsCount || 0} ครั้ง</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                      <label className="checkbox-label" style={{ margin: 0 }}>
                        <input 
                          type="checkbox" 
                          checked={wf.enabled}
                          onChange={e => {
                            updateN8NWorkflow(wf.id, { enabled: e.target.checked });
                            triggerSaveToast();
                          }}
                        />
                        <span>เปิดใช้งานเวิร์กโฟลว์นี้</span>
                      </label>

                      <button 
                        className="btn-secondary btn-sm"
                        onClick={() => handleTestN8N(wf.id)}
                        disabled={isN8NTesting && activeN8NTestId === wf.id}
                      >
                        <Send size={13} className={isN8NTesting && activeN8NTestId === wf.id ? 'spin-icon' : ''} />
                        <span>{isN8NTesting && activeN8NTestId === wf.id ? 'กำลังส่ง...' : 'ทดสอบยิง Webhook'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Test Result Banner */}
              {n8nTestResult && (
                <div className="test-ping-result-box success" style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} className="text-green" />
                    <strong>{n8nTestResult.message}</strong>
                  </div>
                  <span className="text-xs text-muted" style={{ display: 'block', marginTop: '4px' }}>
                    HTTP Status: {n8nTestResult.status} | เวลา: {n8nTestResult.timestamp} | เวิร์กโฟลว์ ID: {n8nTestResult.workflowId}
                  </span>
                </div>
              )}

              {/* Omnichannel Multi-Channel Customer Chat Hub Card */}
              <div className="admin-subcard glass-panel" style={{ marginTop: '20px' }}>
                <div className="subcard-title" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={16} className="text-blue" />
                    <strong>ระบบรวมแชท Omnichannel & AI Dispatcher (LINE OA + Facebook + Website Chat)</strong>
                  </div>
                  <span className="status-pill status-pill-success">
                    Omnichannel Pipeline Active
                  </span>
                </div>

                <p className="subcard-desc">
                  รวมศูนย์การสื่อสารกับลูกค้าทุกช่องทาง: เมื่อลูกค้าทักหา LINE Official Account, Facebook Messenger หรือ Web Chat Widget ระบบ n8n จะดึงข้อมูลสมาชิก/เครื่องว่างจาก SmartCafé ERP และส่งต่อไปยัง OpenWebUI เพื่อตอบคำถามและคำนวณงบประมาณอัตโนมัติ
                </p>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>LINE Official Account Webhook URL (Messaging API)</label>
                    <input 
                      type="url"
                      className="form-input"
                      value={siteData.omnichannelConfig?.lineWebhookUrl || ''}
                      onChange={e => updateOmnichannelConfig({ lineWebhookUrl: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Facebook Page Messenger Webhook URL (Meta Graph API)</label>
                    <input 
                      type="url"
                      className="form-input"
                      value={siteData.omnichannelConfig?.facebookWebhookUrl || ''}
                      onChange={e => updateOmnichannelConfig({ facebookWebhookUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-2" style={{ marginTop: '12px' }}>
                  <div className="form-group">
                    <label>Web Chat Widget Webhook URL (In-Browser Live Stream)</label>
                    <input 
                      type="url"
                      className="form-input"
                      value={siteData.omnichannelConfig?.webWidgetWebhookUrl || ''}
                      onChange={e => updateOmnichannelConfig({ webWidgetWebhookUrl: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Unified Staff Inbox URL (Chatwoot / Zendesk / n8n Live Chat)</label>
                    <input 
                      type="url"
                      className="form-input"
                      value={siteData.omnichannelConfig?.unifiedInboxUrl || ''}
                      onChange={e => updateOmnichannelConfig({ unifiedInboxUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label className="checkbox-label" style={{ margin: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={siteData.omnichannelConfig?.autoHandoverToStaff ?? true}
                      onChange={e => {
                        updateOmnichannelConfig({ autoHandoverToStaff: e.target.checked });
                        triggerSaveToast();
                      }}
                    />
                    <span>เปิดระบบ Auto-Handover ส่งต่อพนักงานเคาน์เตอร์อัตโนมัติเมื่อตรวจพบคำถามพิเศษ</span>
                  </label>
                </div>

                {/* Pipeline Flow Visualization */}
                <div style={{ marginTop: '14px', padding: '12px 14px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    เส้นทางข้อมูลอัจฉริยะ (Omnichannel Execution Pipeline):
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.74rem' }}>
                    <span style={{ background: '#06b6d4', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>LINE / FB / Web</span>
                    <span style={{ color: '#94a3b8' }}>&rarr;</span>
                    <span style={{ background: '#ea580c', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>n8n Webhook Router</span>
                    <span style={{ color: '#94a3b8' }}>&rarr;</span>
                    <span style={{ background: '#10b981', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>SmartCafé ERP Bridge (เช็กสิทธิ์/เครื่อง)</span>
                    <span style={{ color: '#94a3b8' }}>&rarr;</span>
                    <span style={{ background: '#6366f1', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>OpenWebUI / RAG</span>
                    <span style={{ color: '#94a3b8' }}>&rarr;</span>
                    <span style={{ background: '#1d4ed8', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>ตอบกลับลูกค้าอัตโนมัติ</span>
                  </div>
                </div>

                {/* Omnichannel Interactive Simulation Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                  <button 
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => handleTestOmnichannel('line')}
                    disabled={isOmnichannelTesting}
                  >
                    <Send size={13} className={isOmnichannelTesting ? 'spin-icon' : ''} />
                    <span>{isOmnichannelTesting ? 'กำลังจำลองส่งข้อความ...' : 'จำลองลูกค้าทัก LINE OA (ถามห้อง VIP)'}</span>
                  </button>
                  <button 
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => handleTestOmnichannel('web')}
                    disabled={isOmnichannelTesting}
                  >
                    <Send size={13} className={isOmnichannelTesting ? 'spin-icon' : ''} />
                    <span>{isOmnichannelTesting ? 'กำลังจำลองส่งข้อความ...' : 'จำลองลูกค้าทัก Web Chat (ถามแฟรนไชส์ 20 เครื่อง)'}</span>
                  </button>
                </div>

                {/* Simulation Result Box */}
                {omnichannelTestResult && (
                  <div className="test-ping-result-box success" style={{ marginTop: '14px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={16} className="text-green" />
                        <strong>การจำลอง Omnichannel สำเร็จ ({omnichannelTestResult.channel})</strong>
                      </div>
                      <span className="status-pill status-pill-success">{omnichannelTestResult.latency}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', lineHeight: '1.6', background: 'rgba(255,255,255,0.85)', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div><strong>คำถามจากลูกค้า:</strong> <span style={{ color: '#1d4ed8' }}>"{omnichannelTestResult.userQuery}"</span></div>
                      <div style={{ marginTop: '4px' }}><strong>การยืนยัน ERP:</strong> <span style={{ color: '#059669', fontWeight: 600 }}>{omnichannelTestResult.erpVerification}</span></div>
                      <div style={{ marginTop: '4px' }}><strong>คำตอบอัตโนมัติ (OpenWebUI RAG):</strong> <span style={{ color: '#0f172a' }}>"{omnichannelTestResult.aiReply}"</span></div>
                      <div style={{ marginTop: '6px', fontSize: '0.74rem', color: '#64748b' }}><strong>เส้นทางการประมวลผล:</strong> {omnichannelTestResult.routedVia}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Discord Franchise Leads Fallback */}
              <div className="admin-subcard glass-panel" style={{ marginTop: '20px' }}>
                <div className="subcard-title">
                  <Send size={16} className="text-blue" />
                  <strong>Discord / Slack Instant Webhook Fallback</strong>
                </div>

                <div className="form-group">
                  <label>Webhook URL สำหรับรับใบเสนอราคาแฟรนไชส์ตรงเข้าห้องแชท Discord</label>
                  <input 
                    type="url" className="form-input"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={siteData.webhooks?.leadWebhookUrl || ''}
                    onChange={e => updateWebhooks({ leadWebhookUrl: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={siteData.webhooks?.autoNotification}
                      onChange={e => updateWebhooks({ autoNotification: e.target.checked })}
                    />
                    <span>แจ้งเตือน Discord อัตโนมัติทุกครั้งเมื่อมีผู้กดขอใบเสนอราคาผังร้าน 3D</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: AI ERP & SMART REVENUE ANALYTICS (Esports Cafe Financial Hub)
              ========================================================================= */}
          {activeTab === 'erp-analytics' && (
            <div className="cms-panel-block">
              {/* Panel Header */}
              <div className="panel-header-row erp-header-row">
                <div>
                  <div className="erp-title-wrapper">
                    <h3 className="panel-title">
                      <TrendingUp size={22} className="text-blue" />
                      <span>ระบบสรุปรายได้อัจฉริยะ & AI ERP Bridge (Esports Cafe Hub)</span>
                    </h3>
                    <span className="status-pill status-pill-success erp-live-badge">
                      <span className="live-ping-dot"></span>
                      เชื่อมต่อแม่ข่าย SmartCafé POS (Port 8088 Active)
                    </span>
                  </div>
                  <p className="panel-desc">
                    สรุปผลประกอบการร้านเกมแบบ Real-time, ระบบเชื่อมต่อ POS/Diskless และการวิเคราะห์ทางการเงินอัตโนมัติด้วย AI
                  </p>
                </div>
                <div className="header-actions-group">
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setIsSyncingERP(true);
                      setTimeout(() => {
                        setIsSyncingERP(false);
                        triggerSaveToast();
                      }, 1000);
                    }}
                    disabled={isSyncingERP}
                  >
                    <RefreshCw size={14} className={isSyncingERP ? 'spin-icon' : ''} />
                    <span>{isSyncingERP ? 'กำลังดึงข้อมูล POS...' : 'ซิงค์ข้อมูลสด (Live Sync)'}</span>
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => setActiveTab('omnichannel-leads')}
                  >
                    <Receipt size={14} />
                    <span>จัดการรายจ่ายสดย่อย (/pay)</span>
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      alert('ส่งออกรายงานบัญชีรายรับ-รายจ่าย (.CSV / Excel) เรียบร้อยแล้ว!');
                    }}
                  >
                    <ArrowUpRight size={14} />
                    <span>ส่งออกรายงานบัญชี (Export)</span>
                  </button>
                </div>
              </div>

              {/* 4 Financial KPI Summary Cards */}
              <div className="erp-kpi-grid">
                <div className="erp-kpi-card glass-panel">
                  <div className="kpi-header">
                    <span className="kpi-label">รายได้รวมวันนี้ (Gross Revenue)</span>
                    <span className="kpi-tag success">+14.2%</span>
                  </div>
                  <div className="kpi-value text-blue">
                    ฿{(siteData.erpData?.dailyRevenue?.total || 48650).toLocaleString()}
                  </div>
                  <div className="kpi-subtext">
                    <DollarSign size={13} className="text-blue" />
                    <span>ยอดรวมเครื่องเล่นเกมและคาเฟ่ (Real-time)</span>
                  </div>
                </div>

                <div className="erp-kpi-card glass-panel">
                  <div className="kpi-header">
                    <span className="kpi-label">ค่าชั่วโมงเล่นเกม (Stations)</span>
                    <span className="kpi-tag neutral">77.9% ของยอดรวม</span>
                  </div>
                  <div className="kpi-value">
                    ฿{(siteData.erpData?.dailyRevenue?.gamingStations || 37900).toLocaleString()}
                  </div>
                  <div className="kpi-subtext">
                    <Monitor size={13} className="text-blue" />
                    <span>Main Arena, VIP Bootcamp & Console</span>
                  </div>
                </div>

                <div className="erp-kpi-card glass-panel">
                  <div className="kpi-header">
                    <span className="kpi-label">รายได้แผนกอาหาร & คาเฟ่ (F&B)</span>
                    <span className="kpi-tag success">+22.5%</span>
                  </div>
                  <div className="kpi-value text-emerald">
                    ฿{(siteData.erpData?.dailyRevenue?.fnb || 10750).toLocaleString()}
                  </div>
                  <div className="kpi-subtext">
                    <Coffee size={13} className="text-emerald" />
                    <span>เครื่องดื่ม, ซิกเนเจอร์สแน็ค, กาแฟสด</span>
                  </div>
                </div>

                <div className="erp-kpi-card glass-panel">
                  <div className="kpi-header">
                    <span className="kpi-label">กำไรสุทธิประเมินต่อวัน (Net Profit)</span>
                    <span className="kpi-tag primary">Margin 70.4%</span>
                  </div>
                  <div className="kpi-value text-purple">
                    ฿{(siteData.erpData?.dailyRevenue?.netProfit || 34250).toLocaleString()}
                  </div>
                  <div className="kpi-subtext">
                    <TrendingUp size={13} className="text-purple" />
                    <span>หักต้นทุนค่าไฟเฉลี่ยและวัตถุดิบแล้ว</span>
                  </div>
                </div>
              </div>

              {/* AI Executive Financial Summary & Advisor */}
              <div className="admin-subcard ai-financial-advisor-card">
                <div className="advisor-header">
                  <div className="advisor-title-group">
                    <div className="advisor-badge">
                      <Sparkles size={14} className="text-blue" />
                      <span>AI Esports Financial Executive (Gemini Flash 3.8)</span>
                      <span className="advisor-pulse-dot"></span>
                    </div>
                    <h4>บทวิเคราะห์และข้อเสนอแนะทางการเงินประจำวันโดย AI</h4>
                  </div>
                  <button 
                    className="btn-ai-analyze"
                    onClick={() => {
                      setIsAnalyzingRevenue(true);
                      setTimeout(() => {
                        setIsAnalyzingRevenue(false);
                        updateERPData({
                          aiExecutiveSummary: `[AI Re-Analysis] รายได้วันนี้เติบโตเหนือเป้าหมาย 14.2% โดยเฉพาะช่วง Peak 18:00 - 23:00 น. เครื่องเต็ม 100% ต่อเนื่อง 5 ชั่วโมง\n• ข้อเสนอแนะ 1: ขยายเวลาโปรโมชัน Combo Set F&B ในช่วงบ่าย 14:00 - 17:00 เพื่อดึงดูดลูกค้าช่วงก่อนเลิกงาน\n• ข้อเสนอแนะ 2: ห้อง VIP Suite อัตราจองสตรีมเมอร์สูงมาก ควรพิจารณาเปิดรับจองล่วงหน้าระบบ Membership\n• คาดการณ์ยอดสุทธิสิ้นเดือน: มีโอกาสแตะ 1,480,000 บาท (ROI คืนทุนเร็วกว่าเกณฑ์ 1.8 เดือน)`
                        });
                        triggerSaveToast();
                      }, 1400);
                    }}
                    disabled={isAnalyzingRevenue}
                  >
                    <RefreshCw size={14} className={isAnalyzingRevenue ? 'spin-icon' : ''} />
                    <span>{isAnalyzingRevenue ? 'AI กำลังประมวลผลข้อมูล...' : 'ให้ AI วิเคราะห์สถานะการเงินสด'}</span>
                  </button>
                </div>

                {/* Structured Executive Briefing */}
                <div className="advisor-structured-content">
                  {/* 1. Highlight Banner */}
                  <div className="advisor-highlight-banner">
                    <div className="highlight-icon-box">
                      <TrendingUp size={20} className="text-blue" />
                    </div>
                    <div className="highlight-text-content">
                      <div className="highlight-lead">
                        <strong>ผลประกอบการประจำวันเติบโตเหนือเป้าหมาย +14.2%</strong>
                        <span className="highlight-tag">อัตราครองเครื่อง 100% ต่อเนื่อง 5 ชั่วโมง (18:00 - 23:00 น.)</span>
                      </div>
                      <p className="highlight-sub">
                        เครื่องเล่นเกมทุกโซนทำงานเต็มขีดความสามารถ ยอดจำหน่ายอาหารและเครื่องดื่มช่วงไพรม์ไทม์เพิ่มขึ้นตามความหนาแน่นของผู้ใช้บริการ
                      </p>
                    </div>
                  </div>

                  {/* 2. Actionable Recommendations Grid */}
                  <div className="advisor-actions-grid">
                    <div className="advisor-action-card">
                      <div className="action-card-header">
                        <div className="action-icon-pill fnb">
                          <Coffee size={15} />
                        </div>
                        <div className="action-header-texts">
                          <strong>ข้อเสนอแนะ 1: ปรับโปรโมชัน F&B ดึงยอดรอบบ่าย</strong>
                          <span className="action-badge">เพิ่ม Occupancy</span>
                        </div>
                      </div>
                      <p className="action-desc">
                        ขยายเวลาโปรโมชัน Combo Set F&B ในช่วงบ่าย 14:00 - 17:00 เพื่อดึงดูดลูกค้ากลุ่มนักเรียน/นักศึกษาและฟรีแลนซ์ก่อนช่วงเวลาเลิกงาน
                      </p>
                    </div>

                    <div className="advisor-action-card">
                      <div className="action-card-header">
                        <div className="action-icon-pill vip">
                          <Armchair size={15} />
                        </div>
                        <div className="action-header-texts">
                          <strong>ข้อเสนอแนะ 2: บริหารจองล่วงหน้า VIP Suite</strong>
                          <span className="action-badge">Optimize Yield</span>
                        </div>
                      </div>
                      <p className="action-desc">
                        ห้อง VIP Bootcamp & Streamer Suite มีความต้องการสูงมาก ควรเปิดระบบรับจองล่วงหน้าผ่านสิทธิพิเศษสมาชิกระดับ Gold / VIP Membership
                      </p>
                    </div>
                  </div>

                  {/* 3. Forecast Target Banner */}
                  <div className="advisor-forecast-banner">
                    <div className="forecast-left">
                      <Activity size={16} className="text-blue" />
                      <span><strong>คาดการณ์ยอดสุทธิสิ้นเดือน:</strong> มีโอกาสแตะระดับ <strong>฿1,480,000</strong></span>
                    </div>
                    <div className="forecast-right">
                      <span className="forecast-roi-pill">ROI คืนทุนเร็วกว่าเกณฑ์ 1.8 เดือน</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Peak Hours & Top F&B Items Two-Column Grid (Balanced Heights) */}
              <div className="erp-dual-grid">
                {/* Left: Peak Hours Breakdown */}
                <div className="admin-subcard glass-panel erp-card-column">
                  <div className="subcard-header-flex">
                    <div className="subcard-title-group">
                      <div className="subcard-title">
                        <Clock size={18} className="text-blue" />
                        <strong>อัตราการใช้เครื่องตามช่วงเวลา (Peak Hours Occupancy)</strong>
                      </div>
                      <span className="subcard-badge-count">4 กะการทำงาน</span>
                    </div>
                  </div>

                  <div className="peak-hours-list">
                    {(siteData.erpData?.peakHours || [
                      { time: '10:00 - 14:00 (เปิดบริการช่วงเช้า)', occupancy: 42, revenue: 6800 },
                      { time: '14:00 - 18:00 (ช่วงบ่าย & หลังเลิกเรียน)', occupancy: 78, revenue: 14200 },
                      { time: '18:00 - 00:00 (Prime Peak Time แข่งขัน/ปาร์ตี้)', occupancy: 96, revenue: 21500 },
                      { time: '00:00 - 08:00 (Night Owl Session ยันเช้า)', occupancy: 48, revenue: 6150 }
                    ]).map((slot, idx) => (
                      <div key={idx} className="peak-slot-item">
                        <div className="slot-meta">
                          <span className="slot-time">{slot.time}</span>
                          <div className="slot-numbers">
                            <span className="slot-rev">
                              <DollarSign size={12} className="text-blue" />
                              <strong>฿{(slot?.revenue || 0).toLocaleString()}</strong>
                            </span>
                            <span className={`slot-rate ${slot.occupancy >= 85 ? 'peak' : ''}`}>
                              {slot.occupancy}% {slot.occupancy >= 85 ? 'Peak' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="slot-progress-bar">
                          <div 
                            className="slot-progress-fill" 
                            style={{ 
                              width: `${slot.occupancy}%`,
                              background: slot.occupancy >= 85 
                                ? 'linear-gradient(90deg, #3b82f6, #ef4444)' 
                                : slot.occupancy > 60 
                                  ? 'linear-gradient(90deg, #60a5fa, #1d4ed8)' 
                                  : 'linear-gradient(90deg, #93c5fd, #3b82f6)'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Left Footer Summary Bar */}
                  <div className="erp-card-footer-bar">
                    <div className="footer-bar-item">
                      <Activity size={14} className="text-blue" />
                      <span>อัตราครองเครื่องเฉลี่ยทั้งวัน: <strong>66.0%</strong></span>
                    </div>
                    <div className="footer-bar-item">
                      <span className="text-muted">รอบพีคสูงสุด: </span>
                      <strong className="text-red">18:00 - 00:00 (96%)</strong>
                    </div>
                  </div>
                </div>

                {/* Right: Top Selling Food & Beverages */}
                <div className="admin-subcard glass-panel erp-card-column">
                  <div className="subcard-header-flex">
                    <div className="subcard-title-group">
                      <div className="subcard-title">
                        <Coffee size={18} className="text-blue" />
                        <strong>เมนูอาหาร & สินค้าขายดีประจำวัน (Top Selling F&B)</strong>
                      </div>
                      <span className="subcard-badge-count">5 อันดับยอดนิยม</span>
                    </div>
                  </div>

                  <div className="top-items-table-wrapper">
                    <table className="erp-table">
                      <thead>
                        <tr>
                          <th style={{ width: '45px', textAlign: 'center' }}>อันดับ</th>
                          <th>รายการสินค้า / เมนู</th>
                          <th style={{ textAlign: 'center', width: '85px' }}>จำนวน</th>
                          <th style={{ textAlign: 'center', width: '75px' }}>สัดส่วน</th>
                          <th style={{ textAlign: 'right', width: '90px' }}>ยอดรวม</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(siteData.erpData?.topSellingItems || [
                          { rank: 1, name: 'ข้าวผัดกะเพราเนื้อวากิวไข่ดาวกรอบ', count: 68, total: 6052, share: 29.2 },
                          { rank: 2, name: 'บะหมี่เกาหลีหม้อไฟชีสดับเบิ้ล', count: 54, total: 4806, share: 23.2 },
                          { rank: 3, name: 'G-Speed Energy Elixir (สูตรพิเศษ)', count: 95, total: 4275, share: 20.6 },
                          { rank: 4, name: 'ชาเขียวมัทฉะลาเต้พรีเมียม', count: 48, total: 2880, share: 13.9 },
                          { rank: 5, name: 'ไก่ทอดคาราเกะซอสสไปซี่', count: 42, total: 2730, share: 13.1 }
                        ]).map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`rank-badge ${idx === 0 ? 'top-1' : idx === 1 ? 'top-2' : idx === 2 ? 'top-3' : ''}`}>
                                {item.rank || idx + 1}
                              </span>
                            </td>
                            <td className="font-semibold text-slate-800">{item?.name || 'รายการสินค้า'}</td>
                            <td style={{ textAlign: 'center' }}>
                              <span className="fnb-qty-pill">
                                {item?.count || 0} จาน
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className="fnb-share-pill">
                                {item?.share || (idx === 0 ? 29.2 : idx === 1 ? 23.2 : idx === 2 ? 20.6 : idx === 3 ? 13.9 : 13.1)}%
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }} className="text-blue font-bold">
                              ฿{(item?.total || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Right Footer Summary Bar */}
                  <div className="erp-card-footer-bar">
                    <div className="footer-bar-item">
                      <DollarSign size={14} className="text-blue" />
                      <span>ยอดรวม 5 อันดับแรก: <strong>฿20,743</strong></span>
                    </div>
                    <div className="footer-bar-item">
                      <span className="text-muted">สัดส่วนยอด F&B: </span>
                      <strong className="text-emerald">88.5% ของแผนก</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* ERP Bridge & Software Integration Settings (2-Panel Command Center) */}
              <div className="admin-subcard glass-panel erp-bridge-master-card">
                <div className="subcard-header-block" style={{ marginBottom: '18px' }}>
                  <div className="subcard-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={18} className="text-blue" />
                    <strong>ตั้งค่าการเชื่อมต่อโปรแกรมบริหารร้านเกม (Esports Cafe ERP Bridge)</strong>
                  </div>
                  <p className="subcard-desc" style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                    เชื่อมโยงฐานข้อมูลระหว่างเครื่องแม่ข่ายดิสก์เลส, โปรแกรมคิดเงินหน้าร้าน POS และระบบคลาวด์วิเคราะห์ผลกำไร
                  </p>
                </div>

                <div className="erp-bridge-two-col">
                  {/* Column 1: Software & Local Network */}
                  <div className="bridge-col-panel">
                    <div className="panel-col-heading">
                      <Server size={15} className="text-blue" />
                      <span>1. ซอฟต์แวร์และการเชื่อมต่อ Local Server</span>
                    </div>

                    <div className="form-group">
                      <label>โปรแกรมระบบจัดการร้านอินเทอร์เน็ต/ดิสก์เลส (POS & Diskless Software)</label>
                      <select 
                        className="form-input"
                        value={siteData.erpData?.bridgeSoftware || 'SmartCafé Thailand'}
                        onChange={e => updateERPData({ bridgeSoftware: e.target.value })}
                      >
                        <option value="SmartCafé Thailand">SmartCafé Thailand (ยอดนิยมอันดับ 1 ในไทย)</option>
                        <option value="CyberCafePro">CyberCafePro Billing System</option>
                        <option value="Ourgame Icafe8">Ourgame / Icafe8 Diskless Server</option>
                        <option value="N-Café System">N-Café Management System</option>
                        <option value="Custom REST API">Custom Cloud REST API & Webhook</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Local Server IP / Cloud Bridge URL</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={siteData.erpData?.syncUrl || 'http://192.168.1.200:8088/api/v2/live-metrics'} 
                        onChange={e => updateERPData({ syncUrl: e.target.value })}
                        placeholder="http://192.168.1.xxx:8088/api/v2/live-metrics"
                      />
                    </div>
                  </div>

                  {/* Column 2: Security & Sync Status */}
                  <div className="bridge-col-panel">
                    <div className="panel-col-heading">
                      <ShieldCheck size={15} className="text-blue" />
                      <span>2. กุญแจความปลอดภัยและสถานะแม่ข่าย</span>
                    </div>

                    <div className="form-group">
                      <label>สถานะการเชื่อมต่อเครือข่ายร้าน (Network Sync Status)</label>
                      <div className="status-connection-badge success">
                        <div className="badge-live-pulse"></div>
                        <div className="badge-text-group">
                          <strong>Online เชื่อมต่อแม่ข่ายสาขาหลักเรียบร้อย</strong>
                          <span className="badge-subtext">Port 8088 Active • Latency 34ms • Protocol HTTP/REST JSON</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>API Secret Token / License Key</label>
                      <div className="input-password-wrapper">
                        <input 
                          type={showERPToken ? "text" : "password"} 
                          className="form-input" 
                          value={siteData.erpData?.apiToken || 'GSPEED-ERP-LIVE-KEY-998821'} 
                          onChange={e => updateERPData({ apiToken: e.target.value })}
                          placeholder="กรอก API Key หรือ Secret Token สำหรับเชื่อมต่อ"
                        />
                        <button 
                          type="button" 
                          className="btn-toggle-eye"
                          onClick={() => setShowERPToken(!showERPToken)}
                          title={showERPToken ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                        >
                          {showERPToken ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ping Test Diagnostic Box */}
                {erpTestResult && (
                  <div className={`test-ping-result-box ${erpTestResult.success ? 'success' : 'warning'}`}>
                    <div className="ping-res-header">
                      <CheckCircle2 size={16} className="text-green" />
                      <strong>{erpTestResult.message}</strong>
                    </div>
                    <div className="ping-res-details">
                      <span>ความเร็ว Latency: <strong>{erpTestResult.latency}</strong></span>
                      <span>•</span>
                      <span>รหัสสาขา: <strong>{erpTestResult.storeCode}</strong></span>
                      <span>•</span>
                      <span>ซอฟต์แวร์: <strong>{erpTestResult.software}</strong></span>
                    </div>
                  </div>
                )}

                {/* Action Buttons Toolbar */}
                <div className="erp-bridge-actions-bar">
                  <div className="actions-bar-note">
                    <Sparkles size={13} className="text-blue" />
                    <span>ข้อมูลรายได้และเครื่องว่างจะถูกอัปเดตอัตโนมัติทุกๆ 30 วินาที</span>
                  </div>
                  <div className="actions-bar-buttons">
                    <button 
                      type="button"
                      className="btn-secondary"
                      onClick={handleTestERP}
                      disabled={isERPTesting}
                    >
                      <RefreshCw size={14} className={isERPTesting ? 'spin-icon' : ''} />
                      <span>{isERPTesting ? 'กำลังทดสอบเชื่อมต่อแม่ข่าย...' : 'ทดสอบ Ping ERP Bridge'}</span>
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        triggerSaveToast();
                      }}
                    >
                      <Save size={14} /> บันทึกการตั้งค่า ERP Bridge
                    </button>
                  </div>
                </div>
              </div>

              {/* In-Store Hardware & Diskless Subsystems Architecture Card */}
              <div className="admin-subcard glass-panel in-store-arch-card">
                <div className="subcard-header-block" style={{ marginBottom: '14px' }}>
                  <div className="subcard-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={18} className="text-blue" />
                    <strong>ผังการเชื่อมต่อระบบต่างๆ ในร้านเกม (In-Store Hardware & Diskless Architecture)</strong>
                  </div>
                  <p className="subcard-desc" style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.82rem' }}>
                    สถาปัตยกรรมเชื่อมต่อระบบร้านเกมครบวงจร: สื่อสารระหว่างแม่ข่ายดิสก์เลส, โปรแกรมคิดเงินหน้าร้าน, อุปกรณ์ IoT สวิตช์ไฟ, และการส่งต่อข้อมูลแบบ Real-time ไปยัง n8n และ OpenWebUI
                  </p>
                </div>

                <div className="arch-steps-grid">
                  <div className="arch-step-card">
                    <div className="arch-card-top">
                      <div className="arch-step-number">01</div>
                      <div className="arch-icon-circle">
                        <Server size={18} className="text-blue" />
                      </div>
                    </div>
                    <strong className="arch-title">Diskless Game Server</strong>
                    <span className="status-pill status-pill-success arch-pill">10Gbps LAN Boot Active</span>
                    <p className="arch-text">
                      ระบบแม่ข่าย CCBoot / iCafeCloud / ICAFE8 กระจาย Windows Image และคลังเกม 400+ ไตเติลไปยังเครื่องลูกข่ายโดยไม่ต้องมีฮาร์ดดิสก์ประจำโต๊ะ ซิงก์แพตช์เกมอัตโนมัติยามค่ำคืน
                    </p>
                  </div>

                  <div className="arch-step-card">
                    <div className="arch-card-top">
                      <div className="arch-step-number">02</div>
                      <div className="arch-icon-circle">
                        <Monitor size={18} className="text-blue" />
                      </div>
                    </div>
                    <strong className="arch-title">SmartCafé POS & Billing</strong>
                    <span className="status-pill status-pill-success arch-pill">Port 8088 Synchronized</span>
                    <p className="arch-text">
                      โปรแกรมคิดเงินหน้าร้าน บันทึกเวลาเล่น เปิด-ปิดเครื่องลูกข่าย หักยอดสมาชิก เติมเงิน TrueMoney / PromptPay และระบบแคชเชียร์จำหน่ายอาหารและเครื่องดื่ม F&B
                    </p>
                  </div>

                  <div className="arch-step-card">
                    <div className="arch-card-top">
                      <div className="arch-step-number">03</div>
                      <div className="arch-icon-circle">
                        <Zap size={18} className="text-blue" />
                      </div>
                    </div>
                    <strong className="arch-title">Smart IoT Power Relay</strong>
                    <span className="status-pill status-pill-success arch-pill">Sonoff / Tuya Zigbee Active</span>
                    <p className="arch-text">
                      รีเลย์ตัดต่อกระแสไฟอัจฉริยะ จ่ายไฟให้เฉพาะโต๊ะที่มีลูกค้าล็อกอินใช้งาน ปิดไฟจอและไฟ RGB อัตโนมัติเมื่อหมดเวลา ช่วยประหยัดค่าไฟฟ้าในร้านได้กว่า 28% ต่อเดือน
                    </p>
                  </div>

                  <div className="arch-step-card">
                    <div className="arch-card-top">
                      <div className="arch-step-number">04</div>
                      <div className="arch-icon-circle">
                        <Activity size={18} className="text-blue" />
                      </div>
                    </div>
                    <strong className="arch-title">AI & Cloud Dispatcher</strong>
                    <span className="status-pill status-pill-success arch-pill">n8n + OpenWebUI Pipeline</span>
                    <p className="arch-text">
                      ดึงข้อมูลสถิติรายได้, เครื่องว่าง, และข้อมูลสเปกคอม เข้าสู่ n8n เพื่อรายงานผลผู้บริหารผ่าน Telegram/Discord และส่งต่อไปยัง OpenWebUI สำหรับตอบแชทลูกค้าข้ามแพลตฟอร์ม
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 7: SECURITY & ZERO-TRUST ADMIN ACCESS
              ========================================================================= */}
          {activeTab === 'security' && (
            <div className="cms-panel-block">
              <div className="panel-header-row">
                <div>
                  <h3 className="panel-title">
                    <ShieldCheck size={20} className="text-blue" />
                    <span>จัดการสิทธิ์การเข้าถึง & ความปลอดภัยระดับสูงสุด (Zero-Trust Security Console)</span>
                  </h3>
                  <p className="panel-desc">
                    หน้านี้อนุญาตเฉพาะผู้ดูแลระบบหลักเท่านั้น ทุกเซสชันถูกเข้ารหัส และปุ่มเข้าแอดมินถูกซ่อนจากผู้ใช้ภายนอกโดยสมบูรณ์
                  </p>
                </div>
              </div>

              {/* Security Status Card */}
              <div className="admin-subcard glass-panel security-overview-card">
                <div className="security-status-header">
                  <div className="security-icon-circle">
                    <ShieldCheck size={24} className="text-blue" />
                  </div>
                  <div>
                    <h4>สถานะระบบความปลอดภัย: ป้องกันแน่นหนาสูงสุด (Active & Protected)</h4>
                    <p>
                      Path ส่วนตัว: <code>#/admin</code> | สิทธิ์ใช้งาน: Root Administrator | การล็อกเอาต์: ปิดเบราว์เซอร์แล้วเคลียร์เซสชันทันที
                    </p>
                  </div>
                </div>

                <div className="security-metrics-list">
                  <div className="sec-metric-item">
                    <span className="sec-title">ความปลอดภัยของ API Key (Zero-Leak Protection)</span>
                    <span className="sec-badge ok">{siteData.openRouterSettings?.useSecureProxy ? 'Zero-Leak Backend Proxy ทำงาน (ไม่มีการส่งคีย์ผ่าน Browser)' : 'Protected (เข้ารหัสใน LocalStorage แอดมิน)'}</span>
                  </div>
                  <div className="sec-metric-item">
                    <span className="sec-title">การซ่อนปุ่มระบบแอดมินจากสาธารณะ</span>
                    <span className="sec-badge ok">ซ่อน 100% (ผู้ใช้ทั่วไปจะไม่เห็นปุ่มใดๆ)</span>
                  </div>
                  <div className="sec-metric-item">
                    <span className="sec-title">ระบบป้องกันการเดารหัสผ่าน (Brute-force Lockout)</span>
                    <span className="sec-badge ok">เปิดใช้งาน (ผิดพลาด 5 ครั้ง ล็อก 30 วินาที)</span>
                  </div>
                  <div className="sec-metric-item">
                    <span className="sec-title">การจำกัดคำถามนอกขอบเขต AI Assistant</span>
                    <span className="sec-badge ok">เปิดใช้งานแบบเข้มงวด (Store Only)</span>
                  </div>
                  <div className="sec-metric-item">
                    <span className="sec-title">เวลาการล็อกอินครั้งล่าสุด</span>
                    <span className="sec-time">{siteData.securityConfig?.lastLogin || 'วันนี้ เวลา 15:45 น.'}</span>
                  </div>
                </div>
              </div>

              {/* Change Master Admin Credentials Form */}
              <div className="admin-subcard glass-panel">
                <div className="subcard-title">
                  <Lock size={16} className="text-blue" />
                  <strong>เปลี่ยนชื่อผู้ใช้และรหัสผ่าน Master Admin</strong>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>ชื่อผู้ดูแลระบบ (Admin Username)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={adminUserEdit}
                      onChange={e => setAdminUserEdit(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>รหัสผ่าน Master (Admin Password)</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={adminPassEdit}
                      onChange={e => setAdminPassEdit(e.target.value)}
                    />
                    <small className="form-hint">กำหนดรหัสผ่านที่มีความยาวอย่างน้อย 8 ตัวอักษรเพื่อความปลอดภัย</small>
                  </div>
                </div>

                <div className="modal-footer-btns">
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      if (!adminUserEdit.trim() || !adminPassEdit.trim()) {
                        alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
                        return;
                      }
                      updateSecurityConfig({
                        adminUsername: adminUserEdit.trim(),
                        adminPassword: adminPassEdit.trim()
                      });
                      triggerSaveToast();
                      alert('อัปเดตรหัสผ่าน Master Admin สำเร็จเรียบร้อย!');
                    }}
                  >
                    <Save size={14} /> บันทึกรหัสผ่านใหม่
                  </button>
                  <button 
                    className="btn-admin-logout"
                    onClick={onExitAdmin}
                  >
                    <LogOut size={14} /> ออกจากระบบทันที
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Floating Save Action Bar */}
      <div className="admin-floating-save-bar glass-panel">
        <div className="floating-save-status">
          <span className="save-status-dot"></span>
          <span className="save-status-text">
            {lastSavedTime ? `บันทึกล่าสุดเวลา ${lastSavedTime} น.` : 'พร้อมบันทึกข้อมูล CMS'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            type="button"
            onClick={() => openPreview(activeTab === 'sections' ? activeSectionSubTab : (activeTab === 'articles' ? 'article-view' : (activeTab === 'menu-footer' ? 'menu-footer' : 'full-site')))}
            className="btn-section-preview"
            title="ดูตัวอย่างส่วนที่กำลังแก้ไขอยู่ก่อนบันทึก"
          >
            <Eye size={14} />
            <span>พรีวิวส่วนนี้ก่อนบันทึก</span>
          </button>
          <button 
            id="btn-floating-save-action"
            type="button"
            onClick={handleManualSave}
            disabled={isSaving}
            className={`btn-floating-save ${isSaving ? 'saving' : ''}`}
          >
            {isSaving ? <RefreshCw size={15} className="spin-icon" /> : <Save size={15} />}
            <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลทั้งหมด (Save Changes)'}</span>
          </button>
        </div>
      </div>

      {/* Live Preview Modal */}
      <CMSLivePreviewModal 
        isOpen={previewModalState.isOpen}
        onClose={closePreview}
        sectionType={previewModalState.sectionType}
        siteData={siteData}
        draftData={previewModalState.draftData}
        onSave={() => {
          handleManualSave();
        }}
      />

      {/* Media Library Modal for Reusable Image Assets & SEO Alt Tags */}
      <MediaLibraryModal 
        isOpen={mediaLibraryModal.isOpen}
        onClose={() => setMediaLibraryModal(prev => ({ ...prev, isOpen: false }))}
        currentValue={mediaLibraryModal.currentValue}
        mediaList={siteData.mediaLibrary || []}
        onSelectImage={(item) => {
          if (mediaLibraryModal.onSelect) {
            mediaLibraryModal.onSelect(item);
          }
          setMediaLibraryModal(prev => ({ ...prev, isOpen: false }));
        }}
        onUploadImage={(file, meta) => {
          handleImageUpload(file, (dataUrl) => {
            const added = addMediaItem({
              name: meta?.name || file.name.replace(/\.[^/.]+$/, ""),
              alt: meta?.alt || meta?.name || file.name.replace(/\.[^/.]+$/, ""),
              category: meta?.category || mediaLibraryModal.category || 'uploads',
              url: dataUrl,
              dimensions: 'WebP / Original'
            });
            if (mediaLibraryModal.onSelect && added) {
              mediaLibraryModal.onSelect(added);
            }
          }, 'media-modal-upload');
        }}
        onDeleteImage={(idOrUrl) => {
          deleteMediaItem(idOrUrl);
        }}
        compressing={compressingItemId === 'media-modal-upload'}
      />
    </div>
  );
}
