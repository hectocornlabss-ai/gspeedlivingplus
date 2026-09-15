import React, { useState, useMemo } from 'react';
import { 
  X, Search, Upload, Image as ImageIcon, Check, Trash2, 
  Tag, HardDrive, RefreshCw, ZoomIn, Filter, PlusCircle, CheckCircle2, ArrowRight
} from 'lucide-react';

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
  currentValue = '',
  mediaList = [],
  onUploadImage,
  onDeleteImage,
  compressing = false
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [customAltText, setCustomAltText] = useState('');

  // Filtered images list
  const filteredList = useMemo(() => {
    return mediaList.filter(item => {
      const matchCategory = activeTab === 'all' || item.category === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.alt && item.alt.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [mediaList, activeTab, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (item) => {
    setSelectedItem(item);
    setCustomAltText(item.alt || item.name || '');
  };

  const handleConfirm = () => {
    if (!selectedItem) return;
    onSelectImage({
      url: selectedItem.url,
      alt: customAltText || selectedItem.alt || selectedItem.name || 'G-Speed Esport Arena',
      name: selectedItem.name
    });
    onClose();
  };

  return (
    <div className="media-library-backdrop" onClick={onClose}>
      <div className="media-library-dialog" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="media-library-header">
          <div className="media-library-title">
            <div className="media-lib-icon-badge">
              <HardDrive size={18} className="text-blue" />
            </div>
            <div>
              <h3>คลังสื่อและรูปภาพ (Media Library & SEO Asset Manager)</h3>
              <p>เลือกภาพที่เคยใช้งาน ประหยัดพื้นที่จัดเก็บ หรืออัปโหลดภาพใหม่พร้อมกำหนด Image ALT Text เพื่อผลลัพธ์ SEO สูงสุด</p>
            </div>
          </div>
          <button type="button" className="btn-icon-close" onClick={onClose} title="ปิดหน้าต่าง">
            <X size={18} />
          </button>
        </div>

        {/* Toolbar: Categories + Search + Quick Upload */}
        <div className="media-library-toolbar">
          <div className="media-cat-pills">
            {[
              { id: 'all', label: 'ทั้งหมด (All)' },
              { id: 'hero', label: 'ส่วนหัว Hero' },
              { id: 'banners', label: 'แบนเนอร์' },
              { id: 'arena', label: 'กิจกรรม & อารีนา' },
              { id: 'store', label: 'บรรยากาศร้าน' },
              { id: 'uploads', label: 'ภาพที่ฉันอัปโหลด' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`media-cat-btn ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="media-toolbar-right">
            <div className="media-search-wrap">
              <Search size={14} className="media-search-icon" />
              <input 
                type="text"
                placeholder="ค้นหาชื่อภาพ หรือ Alt tag..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="media-search-input"
              />
              {searchQuery && (
                <button type="button" className="media-search-clear" onClick={() => setSearchQuery('')}>
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Direct Upload Button inside Library */}
            <label className="btn-media-upload">
              {compressing ? (
                <>
                  <RefreshCw size={14} className="spin-icon" />
                  <span>กำลังแปลง WebP...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>อัปโหลดภาพใหม่</span>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                disabled={compressing}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file && onUploadImage) {
                    onUploadImage(file);
                    e.target.value = '';
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Content Body: Grid + Sidebar Inspector */}
        <div className="media-library-body">
          {/* Main Grid Area */}
          <div className="media-grid-scroll">
            {filteredList.length === 0 ? (
              <div className="media-empty-state">
                <ImageIcon size={40} className="text-muted" />
                <h4>ไม่พบรูปภาพในหมวดหมู่นี้</h4>
                <p>ลองเปลี่ยนคำค้นหา หรือคลิก "อัปโหลดภาพใหม่" ด้านบนเพื่อเพิ่มภาพเข้าคลังสื่อ</p>
              </div>
            ) : (
              <div className="media-thumbnails-grid">
                {filteredList.map((item, idx) => {
                  const isSelected = selectedItem?.url === item.url || (!selectedItem && currentValue === item.url);
                  return (
                    <div 
                      key={item.id || item.url || idx}
                      className={`media-thumb-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelect(item)}
                    >
                      <div className="media-thumb-aspect">
                        <img 
                          src={item.url} 
                          alt={item.alt || item.name} 
                          className="media-thumb-img"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="media-thumb-selected-badge">
                            <Check size={14} />
                          </div>
                        )}
                        {item.dimensions && (
                          <span className="media-dim-badge">{item.dimensions}</span>
                        )}
                      </div>
                      <div className="media-thumb-info">
                        <span className="media-thumb-name" title={item.name || 'Image'}>
                          {item.name || 'Untitled Image'}
                        </span>
                        {item.alt && (
                          <span className="media-thumb-alt" title={item.alt}>
                            ALT: {item.alt}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Inspector Panel for Selected Image */}
          <div className="media-inspector-panel">
            {selectedItem ? (
              <div className="inspector-content">
                <h5 className="inspector-title">รายละเอียดภาพที่เลือก</h5>
                <div className="inspector-preview-frame">
                  <img src={selectedItem.url} alt={customAltText || selectedItem.name} className="inspector-preview-img" />
                </div>

                <div className="inspector-field-group">
                  <label className="inspector-label">
                    <Tag size={13} className="text-blue" />
                    <span>ข้อความกำกับภาพ (Image ALT Text - สำหรับ SEO)*</span>
                  </label>
                  <input 
                    type="text"
                    className="form-input inspector-input"
                    placeholder="เช่น เวทีแข่งอีสปอร์ต 5v5 สเปก RTX 40 Series GLP Arena..."
                    value={customAltText}
                    onChange={e => setCustomAltText(e.target.value)}
                  />
                  <span className="inspector-tip-text">
                    💡 ALT Text ช่วยให้ Google ค้นพบภาพบน Google Images และช่วยดันคะแนน SEO ของเว็บไซต์
                  </span>
                </div>

                <div className="inspector-meta-box">
                  <div className="inspector-meta-row">
                    <span>ชื่อไฟล์ / หัวข้อ:</span>
                    <strong>{selectedItem.name || 'ภาพจากระบบ'}</strong>
                  </div>
                  {selectedItem.dimensions && (
                    <div className="inspector-meta-row">
                      <span>สัดส่วนขนาด:</span>
                      <strong>{selectedItem.dimensions}</strong>
                    </div>
                  )}
                  {selectedItem.category && (
                    <div className="inspector-meta-row">
                      <span>หมวดหมู่:</span>
                      <strong style={{ textTransform: 'capitalize' }}>{selectedItem.category}</strong>
                    </div>
                  )}
                </div>

                <div className="inspector-actions">
                  <button 
                    type="button" 
                    className="btn-primary inspector-select-btn"
                    onClick={handleConfirm}
                  >
                    <CheckCircle2 size={16} />
                    <span>นำรูปนี้ไปใช้งานทันที</span>
                  </button>

                  {selectedItem.isUploaded && onDeleteImage && (
                    <button 
                      type="button" 
                      className="btn-danger-outline"
                      onClick={() => {
                        if (window.confirm('คุณต้องการลบภาพนี้ออกจากคลังสื่อหรือไม่?')) {
                          onDeleteImage(selectedItem.id || selectedItem.url);
                          setSelectedItem(null);
                        }
                      }}
                      title="ลบภาพนี้ออกจากคลังสื่อ"
                    >
                      <Trash2 size={13} />
                      <span>ลบภาพออกจากคลัง</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="inspector-empty">
                <ImageIcon size={32} className="text-muted" />
                <span>คลิกเลือกรูปภาพทางซ้าย เพื่อดูรายละเอียดและนำไปใช้งาน</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="media-library-footer">
          <span className="media-footer-count">
            รูปภาพทั้งหมดในคลัง: <strong>{filteredList.length}</strong> ภาพ
          </span>
          <div className="media-footer-btns">
            <button type="button" className="btn-secondary" onClick={onClose}>
              ยกเลิก
            </button>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handleConfirm}
              disabled={!selectedItem}
            >
              <Check size={16} />
              <span>ยืนยันการเลือกรูปภาพ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
