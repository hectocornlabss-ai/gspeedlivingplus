import React, { useState, useEffect } from 'react';
import { 
  X, Save, RefreshCw, Upload, Image as ImageIcon, Tag, Plus, Trash2, 
  ChevronUp, ChevronDown, Check, Star, AlertCircle, Info, ExternalLink, Globe, Sparkles,
  MapPin, Users
} from 'lucide-react';
import ArticleBlockEditor from './ArticleBlockEditor';
import { compressAndConvertToWebP } from '../utils/imageOptimizer';
import { EVENT_CATEGORIES, DEFAULT_ARTICLE_TAGS } from '../data/mockData';
import { autoTranslateEntity, getAiTranslationStatus } from '../utils/autoTranslator';

const DEFAULT_NEW_ACTIVITY = {
  title: '',
  slug: '',
  category: 'tournament',
  tag: 'GLP ESPORTS',
  partner: 'G-Speed Living Plus',
  tags: ['#EsportsThailand', '#GLP2026', '#GamingArena'],
  date: 'ตุลาคม 2026',
  prizePool: '',
  location: 'G-Speed Esport Arena รามคำแหง 53 กรุงเทพฯ',
  attendees: '300+ คน',
  image: '',
  imageAlt: '',
  desc: '',
  contentBlocks: [],
  contentParagraphs: [],
  galleryPhotos: [],
  status: 'published'
};

export default function ActivityFormModal({
  isOpen,
  initialData = null,
  onClose,
  onSave,
  categories = EVENT_CATEGORIES,
  availableTags = DEFAULT_ARTICLE_TAGS,
  onAddNewTag
}) {
  const isEdit = Boolean(initialData && initialData.id);

  // Isolated local state - Keystrokes only re-render this modal component (0ms latency, 60 FPS)
  const [draft, setDraft] = useState(() => {
    if (initialData) {
      const parsedPhotos = (initialData.galleryPhotos || []).map(p => {
        if (typeof p === 'string') {
          return { url: p, caption: initialData.title || '', alt: initialData.imageAlt || initialData.title || '' };
        }
        return {
          url: p?.url || '',
          caption: p?.caption || initialData.title || '',
          alt: p?.alt || p?.caption || initialData.imageAlt || initialData.title || ''
        };
      }).filter(p => Boolean(p.url));

      return {
        ...DEFAULT_NEW_ACTIVITY,
        ...initialData,
        location: initialData.location || 'G-Speed Esport Arena รามคำแหง 53 กรุงเทพฯ',
        attendees: initialData.attendees || '300+ คน',
        galleryPhotos: parsedPhotos
      };
    }
    return { ...DEFAULT_NEW_ACTIVITY };
  });

  const [newTagInput, setNewTagInput] = useState('');
  const [quickUrlInput, setQuickUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // { current, total, filename }
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [coverCompressing, setCoverCompressing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const parsedPhotos = (initialData.galleryPhotos || []).map(p => {
          if (typeof p === 'string') {
            return { url: p, caption: initialData.title || '', alt: initialData.imageAlt || initialData.title || '' };
          }
          return {
            url: p?.url || '',
            caption: p?.caption || initialData.title || '',
            alt: p?.alt || p?.caption || initialData.imageAlt || initialData.title || ''
          };
        }).filter(p => Boolean(p.url));

        setDraft({
          ...DEFAULT_NEW_ACTIVITY,
          ...initialData,
          location: initialData.location || 'G-Speed Esport Arena รามคำแหง 53 กรุงเทพฯ',
          attendees: initialData.attendees || '300+ คน',
          galleryPhotos: parsedPhotos
        });
      } else {
        setDraft({ ...DEFAULT_NEW_ACTIVITY });
      }
    }
  }, [isOpen, initialData]);

  // Helper to update draft field
  const updateField = (field, value) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  // Auto-generate slug from title if slug not manually set
  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    setDraft(prev => {
      const autoSlug = titleVal.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)/g, '');
      return {
        ...prev,
        title: titleVal,
        slug: !isEdit && (!prev.slug || prev.slug === autoSlug) ? autoSlug : prev.slug
      };
    });
  };

  // Cover image upload & WebP conversion
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverCompressing(true);
    try {
      const res = await compressAndConvertToWebP(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
      
      // Attempt server upload for clean static URL
      try {
        const uploadRes = await fetch('/api/upload-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl: res.dataUrl,
            filename: file.name
          })
        });
        const uploadData = await uploadRes.json();
        if (uploadData?.success && uploadData.url) {
          updateField('image', uploadData.url);
          if (!draft.imageAlt) updateField('imageAlt', file.name.replace(/\.[^/.]+$/, ''));
          return;
        }
      } catch (err) {
        console.warn('Fallback to WebP dataUrl for cover:', err);
      }
      
      updateField('image', res.dataUrl);
      if (!draft.imageAlt) updateField('imageAlt', file.name.replace(/\.[^/.]+$/, ''));
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการประมวลผลรูปภาพหน้าปก: ' + err.message);
    } finally {
      setCoverCompressing(false);
      e.target.value = '';
    }
  };

  // MULTI-FILE GALLERY UPLOAD TOOL
  // Uploads multiple files at once, converts to WebP, persists to static disk via /api/upload-media
  const handleMultiGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const total = files.length;
    const uploadedPhotos = [];

    try {
      for (let i = 0; i < total; i++) {
        const file = files[i];
        setUploadProgress({ current: i + 1, total, filename: file.name });

        try {
          // 1. Client-side lightweight WebP compression
          const webpRes = await compressAndConvertToWebP(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
          
          let photoUrl = webpRes.dataUrl;

          // 2. Upload to backend server disk (/uploads/gallery/...)
          try {
            const apiRes = await fetch('/api/upload-media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                dataUrl: webpRes.dataUrl,
                filename: file.name
              })
            });
            const apiData = await apiRes.json();
            if (apiData?.success && apiData.url) {
              photoUrl = apiData.url;
            }
          } catch (uploadErr) {
            console.warn('Backend disk upload failed, using optimized WebP dataUrl:', uploadErr);
          }

          const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          uploadedPhotos.push({
            url: photoUrl,
            caption: rawName || draft.title || 'ภาพกิจกรรม GLP',
            alt: `${draft.title || 'GLP'} - ${rawName || 'ภาพกิจกรรม'}`
          });
        } catch (fileErr) {
          console.error(`Error processing file ${file.name}:`, fileErr);
        }
      }

      if (uploadedPhotos.length > 0) {
        setDraft(prev => {
          const currentPhotos = prev.galleryPhotos || [];
          const nextPhotos = [...currentPhotos, ...uploadedPhotos];
          // If no cover image yet, use the first uploaded photo
          const nextCover = prev.image ? prev.image : uploadedPhotos[0].url;
          return {
            ...prev,
            galleryPhotos: nextPhotos,
            image: nextCover
          };
        });
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      e.target.value = '';
    }
  };

  // Add External Photo by URL
  const handleAddQuickUrl = () => {
    if (!quickUrlInput.trim()) return;
    const newPhoto = {
      url: quickUrlInput.trim(),
      caption: draft.title || 'ภาพกิจกรรม',
      alt: draft.title || 'ภาพกิจกรรม'
    };
    setDraft(prev => ({
      ...prev,
      galleryPhotos: [...(prev.galleryPhotos || []), newPhoto]
    }));
    setQuickUrlInput('');
  };

  // Photo gallery item actions
  const handleRemovePhoto = (index) => {
    setDraft(prev => ({
      ...prev,
      galleryPhotos: (prev.galleryPhotos || []).filter((_, idx) => idx !== index)
    }));
  };

  const handleMovePhoto = (fromIdx, toIdx) => {
    setDraft(prev => {
      const photos = [...(prev.galleryPhotos || [])];
      if (toIdx < 0 || toIdx >= photos.length) return prev;
      const [moved] = photos.splice(fromIdx, 1);
      photos.splice(toIdx, 0, moved);
      return { ...prev, galleryPhotos: photos };
    });
  };

  const handleSetCoverPhoto = (photoUrl) => {
    updateField('image', photoUrl);
  };

  const handleUpdatePhotoField = (index, field, value) => {
    setDraft(prev => {
      const photos = [...(prev.galleryPhotos || [])];
      if (!photos[index]) return prev;
      photos[index] = { ...photos[index], [field]: value };
      return { ...prev, galleryPhotos: photos };
    });
  };

  // Final Submit Handler - Saves directly to server once
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!draft.title.trim()) {
      alert('กรุณากรอกชื่อกิจกรรม / หัวข้อบทความ');
      return;
    }

    setIsSaving(true);
    try {
      // Build content paragraphs from blocks if present
      let paragraphs = [];
      if (draft.contentBlocks && draft.contentBlocks.length > 0) {
        paragraphs = draft.contentBlocks
          .map(b => {
            if (b.type === 'paragraph') return b.text;
            if (b.type === 'heading') return b.text;
            if (b.type === 'quote') return `"${b.text}" — ${b.author || ''}`;
            if (b.type === 'list') return (b.items || []).join('\n');
            return '';
          })
          .filter(Boolean);
      }
      if (paragraphs.length === 0 && draft.desc) {
        paragraphs = [draft.desc];
      }

      const finalData = {
        ...draft,
        slug: draft.slug || draft.title.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)/g, ''),
        contentParagraphs: paragraphs,
        galleryPhotos: (draft.galleryPhotos || []).filter(p => Boolean(p.url))
      };

      // Automated multi-language translation (TH -> EN & ZH)
      let translatedData = finalData;
      try {
        translatedData = await autoTranslateEntity(finalData);
      } catch (transErr) {
        console.warn('Auto-translation failed during save, proceeding with original data:', transErr);
      }

      await onSave(translatedData);
    } catch (err) {
      alert('บันทึกล้มเหลว: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualTranslate = async () => {
    if (!draft.title.trim()) {
      alert('กรุณากรอกหัวข้อหรือเนื้อหาก่อนแปลภาษา');
      return;
    }
    setIsTranslating(true);
    try {
      const translated = await autoTranslateEntity(draft);
      if (translated) {
        setDraft(translated);
      }
      const aiStatus = getAiTranslationStatus();
      alert(`✨ แปลภาษาอัตโนมัติ (อังกฤษ & จีน) เรียบร้อยแล้ว!\n\nโหมดที่ใช้งาน: ${aiStatus.label}\nบทความและเนื้อหาทุกย่อหน้าถูกแปลด้วยสำนวนสละสลวย พร้อมแสดงผลในเวอร์ชัน EN / ZH ทันที`);
    } catch (err) {
      alert('การแปลภาษาขัดข้อง: ' + err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="cms-modal-backdrop" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (window.confirm('คุณต้องการปิดหน้าต่างใช่หรือไม่? (ข้อมูลที่แก้ไขยังไม่ถูกบันทึก)')) {
            onClose();
          }
        }
      }}
    >
      <div 
        className="cms-modal-card modal-extra-wide" 
        style={{ maxHeight: '94vh', display: 'flex', flexDirection: 'column' }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-head" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
              {isEdit ? `✏️ แก้ไขบทความกิจกรรม: ${draft.title || 'ไม่มีชื่อ'}` : '➕ เพิ่มกิจกรรม & บทความใหม่ (New Article)'}
            </h4>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              ระบบบันทึกแบบ Single-Save พร้อมแปลภาษาอังกฤษ & จีน อัตโนมัติ (Auto-Translate)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              type="button" 
              onClick={handleManualTranslate} 
              disabled={isTranslating || isSaving}
              className="btn-secondary"
              title="แปลภาษาอังกฤษและจีนลงในระบบล่วงหน้าทันที"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.82rem' }}
            >
              {isTranslating ? <RefreshCw size={13} className="spin-icon text-blue" /> : <Globe size={13} className="text-blue" />}
              <span>{isTranslating ? 'กำลังแปล...' : '🌐 แปลอัตโนมัติ (AI)'}</span>
            </button>
            <button 
              type="button" 
              onClick={handleSubmit} 
              disabled={isSaving || isTranslating}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#10b981', borderColor: '#10b981', padding: '6px 14px' }}
            >
              {isSaving ? <RefreshCw size={14} className="spin-icon" /> : <Save size={14} />}
              <span>{isSaving ? 'กำลังบันทึก & แปล...' : (isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มบทความใหม่')}</span>
            </button>
            <button 
              type="button"
              onClick={() => {
                if (window.confirm('คุณต้องการปิดหน้าต่างใช่หรือไม่?')) onClose();
              }} 
              className="btn-close-modal"
              title="ปิดหน้าต่าง"
            >✕</button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body-form" style={{ flex: '1 1 auto', overflowY: 'auto', minHeight: 0, padding: '20px' }}>
          
          {/* Row 1: Title & Slug */}
          <div className="form-row-2">
            <div className="form-group">
              <label><strong>ชื่อกิจกรรม / หัวข้อบทความ *</strong></label>
              <input 
                type="text" 
                className="form-input"
                placeholder="เช่น การแข่งขัน GLP VALORANT Community Cup ประจำเดือน"
                value={draft.title}
                onChange={handleTitleChange}
              />
            </div>

            <div className="form-group">
              <label>URL Slug ปลายทาง</label>
              <div className="slug-input-prefix">
                <span>/activities/</span>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="valorant-community-cup-2026"
                  value={draft.slug || ''}
                  onChange={e => updateField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)/g, ''))}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Category, Tag Badge, Partner */}
          <div className="form-row-3">
            <div className="form-group">
              <label>หมวดหมู่</label>
              <select 
                className="form-input"
                value={draft.category}
                onChange={e => updateField('category', e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label} ({cat.id})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>ป้ายหัวข้อเล็ก (Tag Badge เช่น LAN TOURNAMENT)</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="LAN TOURNAMENT"
                value={draft.tag || ''}
                onChange={e => updateField('tag', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>พาร์ตเนอร์ / ผู้สนับสนุน</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="ASUS ROG / NVIDIA / G-Speed"
                value={draft.partner || ''}
                onChange={e => updateField('partner', e.target.value)}
              />
            </div>
          </div>

          {/* Row 3: Tags Multi-Selector */}
          <div className="form-group" style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>
                <Tag size={15} className="text-blue" />
                <span>แท็กบทความที่เกี่ยวข้อง (คลิกเพื่อเลือก/ยกเลิก):</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                เลือกแล้ว: {(draft.tags || []).length} แท็ก
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {availableTags.map((tag, tIdx) => {
                const isSelected = (draft.tags || []).includes(tag);
                return (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => {
                      const current = draft.tags || [];
                      const next = isSelected ? current.filter(t => t !== tag) : [...current, tag];
                      updateField('tags', next);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      color: isSelected ? '#1d4ed8' : '#475569',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isSelected && <Check size={12} />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Add Custom Tag */}
            <div style={{ display: 'flex', gap: '6px', maxWidth: '300px' }}>
              <input 
                type="text" 
                className="form-input form-input-sm" 
                placeholder="#เพิ่มแท็กใหม่..." 
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newTagInput.trim()) {
                      const tag = newTagInput.trim().startsWith('#') ? newTagInput.trim() : '#' + newTagInput.trim();
                      if (onAddNewTag) onAddNewTag(tag);
                      updateField('tags', [...(draft.tags || []), tag]);
                      setNewTagInput('');
                    }
                  }
                }}
              />
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => {
                  if (newTagInput.trim()) {
                    const tag = newTagInput.trim().startsWith('#') ? newTagInput.trim() : '#' + newTagInput.trim();
                    if (onAddNewTag) onAddNewTag(tag);
                    updateField('tags', [...(draft.tags || []), tag]);
                    setNewTagInput('');
                  }
                }}
              >
                <Plus size={12} /> เพิ่ม
              </button>
            </div>
          </div>

          {/* Row 4: Date & Prize Pool */}
          <div className="form-row-2">
            <div className="form-group">
              <label>วันที่จัดกิจกรรม (เช่น ตุลาคม 2026)</label>
              <input 
                type="text" 
                className="form-input"
                value={draft.date || ''}
                onChange={e => updateField('date', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>รางวัลรวม (Prize Pool)</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="฿100,000"
                value={draft.prizePool || ''}
                onChange={e => updateField('prizePool', e.target.value)}
              />
            </div>
          </div>

          {/* Row 4.5: Location & Attendees (Customizable & Preset Supported) */}
          <div className="form-row-2" style={{ marginTop: '4px', marginBottom: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#0f172a' }}>
                <MapPin size={15} style={{ color: '#0284c7' }} />
                <span>สถานที่จัดกิจกรรม (Location / Venue)</span>
              </label>
              <input 
                type="text" 
                className="form-input"
                placeholder="G-Speed Esport Arena รามคำแหง 53 กรุงเทพฯ"
                value={draft.location || ''}
                onChange={e => updateField('location', e.target.value)}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                {[
                  'G-Speed Esport Arena รามคำแหง 53 กรุงเทพฯ',
                  'G-Speed Esport Arena รามคำแหง 53 (โซนเวที Main Stage)',
                  'G-Speed Esport Arena รามคำแหง 53 (โซน Battleground)',
                  'G-Speed Esport Arena รามคำแหง 53 (โซน VIP Lounge)'
                ].map((locPreset, lpIdx) => (
                  <button
                    key={lpIdx}
                    type="button"
                    onClick={() => updateField('location', locPreset)}
                    style={{
                      background: draft.location === locPreset ? '#0284c7' : '#f1f5f9',
                      color: draft.location === locPreset ? '#ffffff' : '#334155',
                      border: '1px solid ' + (draft.location === locPreset ? '#0284c7' : '#cbd5e1'),
                      borderRadius: '14px',
                      fontSize: '0.72rem',
                      padding: '3px 8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {locPreset}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#0f172a' }}>
                <Users size={15} style={{ color: '#16a34a' }} />
                <span>ผู้เข้าร่วมงาน / สเกลงาน (Attendees & Scale)</span>
              </label>
              <input 
                type="text" 
                className="form-input"
                placeholder="300+ คน หรือ 350+ คน (32 ทีม)"
                value={draft.attendees || ''}
                onChange={e => updateField('attendees', e.target.value)}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                {[
                  '300+ คน',
                  '350+ คน (32 ทีม)',
                  '500+ คน',
                  '1,000+ คน'
                ].map((attPreset, apIdx) => (
                  <button
                    key={apIdx}
                    type="button"
                    onClick={() => updateField('attendees', attPreset)}
                    style={{
                      background: draft.attendees === attPreset ? '#16a34a' : '#ffffff',
                      color: draft.attendees === attPreset ? '#ffffff' : '#334155',
                      border: '1px solid ' + (draft.attendees === attPreset ? '#16a34a' : '#cbd5e1'),
                      borderRadius: '14px',
                      fontSize: '0.72rem',
                      padding: '3px 8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {attPreset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 5: Cover Image & SEO ALT */}
          <div className="image-manager-row" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '12px' }}>
            {draft.image && (
              <div style={{ position: 'relative', width: '100px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #2563eb', background: '#0f172a', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                <img 
                  src={draft.image} 
                  alt="ภาพหน้าปก" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}

            <div className="form-group" style={{ flex: 1, margin: 0 }}>
              <label><strong>URL รูปภาพหน้าปก (Cover Image URL)</strong></label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="url" 
                  className="form-input"
                  placeholder="https://... หรือ /uploads/gallery/..."
                  value={draft.image || ''}
                  onChange={e => updateField('image', e.target.value)}
                  style={{ flex: 1 }}
                />
                <label className="btn-upload-file" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#2563eb', color: '#fff', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                  {coverCompressing ? <RefreshCw size={14} className="spin-icon" /> : <Upload size={14} />}
                  <span>{coverCompressing ? 'กำลังแปลง WebP...' : 'อัปโหลดภาพหน้าปก'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={handleCoverUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.85rem' }}>
              <Tag size={13} className="text-blue" />
              <span>คำอธิบายรูปภาพสำหรับ SEO (Cover Image ALT Tag):</span>
            </label>
            <input 
              type="text" 
              className="form-input"
              placeholder="เช่น ภาพถ่ายบรรยากาศการแข่งขันรอบชิงชนะเลิศ GLP Esports ณ เวทีกลาง"
              value={draft.imageAlt || ''}
              onChange={e => updateField('imageAlt', e.target.value)}
            />
          </div>

          {/* Excerpt */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label><strong>คำอธิบายสั้น (Excerpt / บทคัดย่อ)</strong></label>
            <textarea 
              className="form-input form-textarea" 
              rows="2"
              placeholder="สรุปเนื้อหาสำคัญสั้นๆ สำหรับแสดงบนการ์ดกิจกรรมและผลการค้นหา Google..."
              value={draft.desc || ''}
              onChange={e => updateField('desc', e.target.value)}
            />
          </div>

          {/* Article Visual Block Editor */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
              เนื้อหาบทความเต็ม (Visual Block Editor สไตล์ WordPress Gutenberg)
            </label>
            <ArticleBlockEditor 
              blocks={draft.contentBlocks || []} 
              onChange={(updatedBlocks) => updateField('contentBlocks', updatedBlocks)} 
            />
          </div>

          {/* MULTI-FILE GALLERY TOOL SECTION */}
          <div className="form-group gallery-cms-section" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px' }}>
            <div className="gallery-cms-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={20} className="text-blue" />
                  <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>แกลเลอรีรูปภาพความละเอียดสูง (Photo Gallery Multi-Upload)</strong>
                  <span className="gallery-count-badge" style={{ background: '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {(draft.galleryPhotos || []).length} ภาพ
                  </span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  อัปโหลดได้พร้อมกันหลายไฟล์ ระบบจะแปลงเป็น WebP อัตโนมัติและบันทึกเป็นไฟล์บนเซิร์ฟเวอร์จริง ไม่ทำให้เว็บหน่วง
                </p>
              </div>

              {/* Multi-upload Action Button */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label 
                  className="btn-upload-file btn-upload-gallery-primary"
                  style={{
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: '#10b981',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(16,185,129,0.2)'
                  }}
                >
                  {isUploading ? (
                    <>
                      <RefreshCw size={15} className="spin-icon" />
                      <span>{uploadProgress ? `อัปโหลด (${uploadProgress.current}/${uploadProgress.total})...` : 'กำลังอัปโหลด...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={15} />
                      <span>📁 เลือกอัปโหลดภาพหลายไฟล์พร้อมกัน (WebP)</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    disabled={isUploading}
                    style={{ display: 'none' }}
                    onChange={handleMultiGalleryUpload}
                  />
                </label>
              </div>
            </div>

            {/* Quick URL Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input 
                type="url" 
                className="form-input form-input-sm" 
                placeholder="หรือวางลิงก์รูปภาพภายนอก URL..." 
                value={quickUrlInput}
                onChange={e => setQuickUrlInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddQuickUrl();
                  }
                }}
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                className="btn-secondary btn-sm"
                onClick={handleAddQuickUrl}
              >
                <Plus size={14} /> เพิ่มรูปจาก URL
              </button>
            </div>

            {/* Gallery Grid Display */}
            {(draft.galleryPhotos || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', border: '2px dashed #cbd5e1', borderRadius: '8px', background: '#ffffff', color: '#94a3b8' }}>
                <ImageIcon size={36} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <p style={{ margin: 0, fontWeight: 600 }}>ยังไม่มีรูปภาพในแกลเลอรี</p>
                <span style={{ fontSize: '0.8rem' }}>คลิกปุ่ม "เลือกอัปโหลดภาพหลายไฟล์พร้อมกัน" ด้านบนเพื่อเลือกรูปภาพจากเครื่องของคุณ</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
                {(draft.galleryPhotos || []).map((photo, pIdx) => {
                  const isCurrentCover = draft.image === photo.url;
                  return (
                    <div 
                      key={pIdx} 
                      style={{
                        background: '#ffffff',
                        border: isCurrentCover ? '2px solid #10b981' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        position: 'relative'
                      }}
                    >
                      {/* Image Thumbnail with Cover Badge */}
                      <div style={{ position: 'relative', height: '140px', background: '#0f172a' }}>
                        <img 
                          src={photo.url} 
                          alt={photo.alt || photo.caption || ''} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                        {isCurrentCover && (
                          <div style={{ position: 'absolute', top: '6px', left: '6px', background: '#10b981', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={11} fill="#fff" /> ภาพหน้าปก
                          </div>
                        )}
                        <span style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px' }}>
                          #{pIdx + 1}
                        </span>
                      </div>

                      {/* Photo Metadata Form */}
                      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <div>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>คำบรรยาย (Caption):</label>
                          <input 
                            type="text"
                            className="form-input form-input-sm"
                            placeholder="คำบรรยายภาพ..."
                            value={photo.caption || ''}
                            onChange={e => handleUpdatePhotoField(pIdx, 'caption', e.target.value)}
                            style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>SEO ALT Text:</label>
                          <input 
                            type="text"
                            className="form-input form-input-sm"
                            placeholder="คำอธิบายสำหรับ SEO..."
                            value={photo.alt || ''}
                            onChange={e => handleUpdatePhotoField(pIdx, 'alt', e.target.value)}
                            style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                          />
                        </div>

                        {/* Controls Toolbar */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                          <button
                            type="button"
                            onClick={() => handleSetCoverPhoto(photo.url)}
                            style={{
                              border: 'none',
                              background: isCurrentCover ? '#dcfce7' : '#f1f5f9',
                              color: isCurrentCover ? '#15803d' : '#475569',
                              fontSize: '0.7rem',
                              padding: '3px 6px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="ตั้งรูปนี้เป็นภาพหน้าปกหลักของบทความ"
                          >
                            <Star size={11} fill={isCurrentCover ? '#15803d' : 'none'} />
                            <span>{isCurrentCover ? 'หน้าปก' : 'ใช้เป็นหน้าปก'}</span>
                          </button>

                          <div style={{ display: 'flex', gap: '3px' }}>
                            <button
                              type="button"
                              onClick={() => handleMovePhoto(pIdx, pIdx - 1)}
                              disabled={pIdx === 0}
                              style={{ border: 'none', background: '#f8fafc', padding: '3px 5px', borderRadius: '3px', cursor: pIdx === 0 ? 'not-allowed' : 'pointer', opacity: pIdx === 0 ? 0.3 : 1 }}
                              title="ย้ายขึ้น"
                            >
                              <ChevronUp size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMovePhoto(pIdx, pIdx + 1)}
                              disabled={pIdx === (draft.galleryPhotos || []).length - 1}
                              style={{ border: 'none', background: '#f8fafc', padding: '3px 5px', borderRadius: '3px', cursor: pIdx === (draft.galleryPhotos || []).length - 1 ? 'not-allowed' : 'pointer', opacity: pIdx === (draft.galleryPhotos || []).length - 1 ? 0.3 : 1 }}
                              title="ย้ายลง"
                            >
                              <ChevronDown size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(pIdx)}
                              style={{ border: 'none', background: '#fee2e2', color: '#dc2626', padding: '3px 5px', borderRadius: '3px', cursor: 'pointer' }}
                              title="ลบรูปนี้"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer - Single Clear Save Button */}
        <div className="modal-footer-btns" style={{ flexShrink: 0, padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '12px', background: getAiTranslationStatus().active ? '#eff6ff' : '#f1f5f9', color: getAiTranslationStatus().active ? '#1d4ed8' : '#475569', fontSize: '0.76rem', fontWeight: 600 }}>
              <Sparkles size={13} className={getAiTranslationStatus().active ? 'text-blue' : 'text-muted'} />
              <span>{getAiTranslationStatus().label}</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleManualTranslate}
              disabled={isTranslating || isSaving}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', borderColor: '#86efac', color: '#166534', fontWeight: 600, padding: '8px 14px' }}
              title="สั่งแปลภาษาอังกฤษและจีนอัตโนมัติด้วย AI ทันที"
            >
              {isTranslating ? <RefreshCw size={14} className="spin-icon" /> : <Sparkles size={14} />}
              <span>{isTranslating ? 'กำลังแปลด้วย AI...' : '✨ แปลภาษา EN & ZH'}</span>
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => {
                if (window.confirm('คุณต้องการยกเลิกการแก้ไขใช่หรือไม่?')) onClose();
              }}
            >
              ยกเลิก
            </button>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={isSaving || isTranslating}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#10b981', borderColor: '#10b981', fontWeight: 700, padding: '8px 18px' }}
            >
              {isSaving ? <RefreshCw size={15} className="spin-icon" /> : <Save size={15} />}
              <span>{isSaving ? 'กำลังบันทึกลงเซิร์ฟเวอร์...' : (isEdit ? '💾 บันทึกการแก้ไขบทความ' : '➕ เพิ่มบทความใหม่ลงระบบ')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
