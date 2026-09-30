import React, { useState, useEffect } from 'react';
import { 
  X, Trophy, Phone, MessageCircle, Calendar, Users, 
  Send, CheckCircle2, Monitor, Radio, ArrowRight, ExternalLink, Sparkles,
  User, Building2, Layers, Check, Tv, Zap, Shield, FileText
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

const POPULAR_GAMES = [
  { id: 'VALORANT', name: 'VALORANT', genre: '5v5 Tactical FPS' },
  { id: 'Arena of Valor (RoV)', name: 'RoV', genre: '5v5 Mobile MOBA' },
  { id: 'Counter-Strike 2', name: 'CS2', genre: 'Tactical Shooter' },
  { id: 'PUBG PC', name: 'PUBG PC/Mobile', genre: 'Battle Royale' },
  { id: 'EA Sports FC Online', name: 'EA FC Online', genre: 'Football' },
  { id: 'Apex Legends', name: 'Apex Legends', genre: 'Hero Shooter' },
  { id: 'other', name: 'เกมอื่นๆ', genre: 'ระบุชื่อเกมเอง' }
];



const QUICK_ADDONS = [
  'จอ LED Wall 4K ถ่ายทอดสด',
  'โต๊ะแคสเตอร์พากย์สดสตูดิโอ',
  'อาหารและเครื่องดื่ม Cyber Cafe',
  'เน็ตเวิร์ก 10Gbps Latency ต่ำพิเศษ',
  'กรรมการ & ทีมงานดูแลระบบ 24 ชม.',
  'นัดเข้าชมสถานที่จริงก่อน'
];

export default function EsportOrganizerModal({ 
  isOpen, 
  onClose,
  initialZoneName = ''
}) {
  const { siteData, addLead } = useSiteData();
  const [submitted, setSubmitted] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const [form, setForm] = useState({
    name: '',
    organization: '',
    phone: '',
    lineId: '',
    email: '',
    game: 'VALORANT',
    customGame: '',
    format: initialZoneName || 'ศูนย์การแข่งขัน GLP Arena',
    expectedDate: '',
    attendees: '16-32 ทีม (ประมาณ 100-200 คน)',
    budget: '',
    notes: initialZoneName ? `สนใจจัดงานแข่งขันในโซน: ${initialZoneName}` : ''
  });

  useEffect(() => {
    if (initialZoneName) {
      setForm(prev => ({
        ...prev,
        notes: prev.notes ? prev.notes : `สนใจจัดงานแข่งขันในโซน: ${initialZoneName}`
      }));
    }
  }, [initialZoneName]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const lineOaUrl = siteData?.footer?.lineUrl || 'https://line.me/R/ti/p/@gspeed';
  const hotlinePhone = siteData?.footer?.phone || '063-793-7704';

  const toggleAddon = (addon) => {
    if (selectedAddons.includes(addon)) {
      setSelectedAddons(prev => prev.filter(item => item !== addon));
    } else {
      setSelectedAddons(prev => [...prev, addon]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      alert('กรุณากรอกชื่อผู้ติดต่อและเบอร์โทรศัพท์');
      return;
    }

    const selectedGame = form.game === 'other' ? (form.customGame || 'เกมอื่นๆ') : form.game;
    const addonsText = selectedAddons.length > 0 ? ` | อุปกรณ์เสริม: ${selectedAddons.join(', ')}` : '';
    const fullNotes = `${form.notes || '-'}${addonsText}`;

    if (addLead) {
      addLead({
        name: form.name,
        company: form.organization || 'บุคคลทั่วไป / ทีมแข่งอิสระ',
        phone: form.phone,
        email: form.email || form.lineId,
        lineId: form.lineId,
        type: 'tournament_venue',
        typeName: `ติดต่อขอจัดงานแข่ง Esport (${selectedGame})`,
        budget: form.budget ? Number(form.budget.replace(/[^0-9]/g, '')) || 50000 : 50000,
        stage: 'new',
        channel: 'web_esport_modal',
        floorArea: initialZoneName || form.format || 'ศูนย์การแข่งขัน GLP Arena',
        expectedOpening: form.expectedDate || 'เร็วๆ นี้',
        notes: `${initialZoneName ? `โซนที่เลือก: ${initialZoneName} | ` : ''}เกมที่ต้องการจัด: ${selectedGame} | ผู้เข้าร่วม: ${form.attendees} | LINE: ${form.lineId || '-'} | บันทึกเพิ่มเติม: ${fullNotes}`
      });
    }

    setSubmitted(true);
  };

  return (
    <div 
      className="esport-modal-backdrop" 
      onClick={onClose}
    >
      <div 
        className="esport-modal-dialog"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="esport-modal-header">
          <button 
            type="button" 
            onClick={onClose}
            className="esport-modal-close-btn"
            aria-label="ปิดหน้าต่าง"
          >
            <X size={18} />
          </button>

          <div className="esport-modal-badge">
            <Sparkles size={13} />
            <span>GLP ARENA TOURNAMENT VENUE</span>
          </div>

          <h3 className="esport-modal-title">
            ติดต่อขอจัดงานแข่ง Esport & เช่าสถานที่
          </h3>
          <p className="esport-modal-subtitle">
            พื้นที่ประลองเกมมาตรฐาน Pro Circuit พร้อมเวที Main Stage, จอถ่ายทอดสด LED Wall 4K, สเปก 360Hz และระบบเน็ตเวิร์ก 10Gbps
          </p>

          {/* Highlights Chips Bar */}
          <div className="esport-modal-chips-bar">
            <div className="esport-feature-chip">
              <Trophy size={13} />
              <span>เวที 5v5 Soundproof Stage</span>
            </div>
            <div className="esport-feature-chip">
              <Tv size={13} />
              <span>จอ LED Wall 4K สตูดิโอ</span>
            </div>
            <div className="esport-feature-chip">
              <Zap size={13} />
              <span>RTX 40 Series 360Hz</span>
            </div>
            <div className="esport-feature-chip">
              <Radio size={13} />
              <span>โต๊ะแคสเตอร์พากย์สด</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="esport-modal-body">
          {submitted ? (
            <div className="esport-success-card">
              <div className="esport-success-icon">
                <CheckCircle2 size={40} />
              </div>
              <h4 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                ส่งข้อมูลขอจัดงานแข่งสำเร็จแล้ว!
              </h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 18px' }}>
                เจ้าหน้าที่ฝ่ายประสานงานทัวร์นาเมนต์ GLP ได้รับข้อมูลของคุณเรียบร้อยแล้ว และจะติดต่อกลับผ่านเบอร์โทรศัพท์และ LINE เพื่อเสนอแพ็กเกจสถานที่และนัดหมายเข้าชมสนามจริงภายใน 24 ชม.
              </p>

              {/* Summary Box */}
              <div className="esport-summary-box">
                <div className="esport-summary-line">
                  <span className="esport-summary-label">ผู้ติดต่อ:</span>
                  <span className="esport-summary-value">{form.name} {form.organization ? `(${form.organization})` : ''}</span>
                </div>
                <div className="esport-summary-line">
                  <span className="esport-summary-label">เบอร์โทรศัพท์:</span>
                  <span className="esport-summary-value">{form.phone}</span>
                </div>
                <div className="esport-summary-line">
                  <span className="esport-summary-label">เกมที่ต้องการจัด:</span>
                  <span className="esport-summary-value text-blue">{form.game === 'other' ? form.customGame : form.game}</span>
                </div>
                {initialZoneName && (
                  <div className="esport-summary-line">
                    <span className="esport-summary-label">โซนที่สนใจ:</span>
                    <span className="esport-summary-value">{initialZoneName}</span>
                  </div>
                )}
                {selectedAddons.length > 0 && (
                  <div className="esport-summary-line">
                    <span className="esport-summary-label">อุปกรณ์เสริม:</span>
                    <span className="esport-summary-value">{selectedAddons.join(', ')}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a 
                  href={lineOaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ background: '#06c755', borderColor: '#06c755', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 24px' }}
                >
                  <MessageCircle size={16} />
                  <span>ทักแชต LINE OA เพื่อส่งรายละเอียดเพิ่ม</span>
                  <ExternalLink size={14} />
                </a>

                <button 
                  type="button" 
                  onClick={onClose}
                  className="btn-secondary"
                  style={{ padding: '11px 24px' }}
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* SECTION 1: เลือกเกมที่ต้องการจัดแข่งขัน */}
              <div className="esport-form-section">
                <div className="esport-section-header">
                  <span className="esport-section-num">1</span>
                  <h4 className="esport-section-title">เลือกเกมที่ต้องการจัดการแข่งขัน</h4>
                </div>

                {/* Popular Games Chips */}
                <div className="esport-field-group">
                  <label className="esport-field-label">เกมที่ต้องการจัดการแข่งขัน:</label>
                  <div className="esport-game-chips-grid">
                    {POPULAR_GAMES.map(g => {
                      const isSel = form.game === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          className={`esport-game-chip-btn ${isSel ? 'active' : ''}`}
                          onClick={() => setForm({ ...form, game: g.id })}
                        >
                          <div className="esport-chip-top">
                            <span className="esport-game-name">{g.name}</span>
                            {isSel && <Check size={14} className="text-blue" />}
                          </div>
                          <span className="esport-game-genre">{g.genre}</span>
                        </button>
                      );
                    })}
                  </div>

                  {form.game === 'other' && (
                    <div className="esport-input-wrapper" style={{ marginTop: '8px' }}>
                      <input 
                        type="text" 
                        required
                        className="esport-text-input"
                        placeholder="พิมพ์ระบุชื่อเกม เช่น Audition, Zone4, Street Fighter 6..."
                        value={form.customGame}
                        onChange={e => setForm({ ...form, customGame: e.target.value })}
                        style={{ paddingLeft: '14px' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: ข้อมูลผู้ติดต่อ & องค์กร */}
              <div className="esport-form-section">
                <div className="esport-section-header">
                  <span className="esport-section-num">2</span>
                  <h4 className="esport-section-title">ข้อมูลผู้ติดต่อ & องค์กร</h4>
                </div>

                <div className="esport-inputs-grid-2">
                  <div className="esport-field-group">
                    <label className="esport-field-label">
                      <span>ชื่อผู้ติดต่อ / ตัวแทนผู้จัด</span>
                      <span className="esport-required-mark">*</span>
                    </label>
                    <div className="esport-input-wrapper">
                      <User size={16} className="esport-input-icon" />
                      <input 
                        type="text" required 
                        className="esport-text-input"
                        placeholder="เช่น คุณกิตติศักดิ์ มั่นคง"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="esport-field-group">
                    <label className="esport-field-label">องค์กร / บริษัท / มหาวิทยาลัย / ทีมแข่ง</label>
                    <div className="esport-input-wrapper">
                      <Building2 size={16} className="esport-input-icon" />
                      <input 
                        type="text" 
                        className="esport-text-input"
                        placeholder="เช่น ม.เกษตรศาสตร์ หรือ บริษัท ABC"
                        value={form.organization}
                        onChange={e => setForm({ ...form, organization: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="esport-inputs-grid-2">
                  <div className="esport-field-group">
                    <label className="esport-field-label">
                      <span>เบอร์โทรศัพท์ติดต่อ</span>
                      <span className="esport-required-mark">*</span>
                    </label>
                    <div className="esport-input-wrapper">
                      <Phone size={16} className="esport-input-icon" />
                      <input 
                        type="tel" required 
                        className="esport-text-input"
                        placeholder="08X-XXX-XXXX"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="esport-field-group">
                    <label className="esport-field-label">LINE ID หรือ อีเมลสำหรับรับใบเสนอราคา</label>
                    <div className="esport-input-wrapper">
                      <MessageCircle size={16} className="esport-input-icon" />
                      <input 
                        type="text" 
                        className="esport-text-input"
                        placeholder="เช่น @line_id หรือ email@domain.com"
                        value={form.lineId}
                        onChange={e => setForm({ ...form, lineId: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: วันที่จัดงาน, ผู้เข้าร่วม & อุปกรณ์เสริม */}
              <div className="esport-form-section">
                <div className="esport-section-header">
                  <span className="esport-section-num">3</span>
                  <h4 className="esport-section-title">กำหนดการ & ความต้องการเพิ่มเติม</h4>
                </div>

                <div className="esport-inputs-grid-2">
                  <div className="esport-field-group">
                    <label className="esport-field-label">วันที่หรือช่วงเวลาที่ต้องการจัดงาน:</label>
                    <div className="esport-input-wrapper">
                      <Calendar size={16} className="esport-input-icon" />
                      <input 
                        type="text" 
                        className="esport-text-input"
                        placeholder="เช่น 15-16 พ.ย. หรือ เสาร์-อาทิตย์"
                        value={form.expectedDate}
                        onChange={e => setForm({ ...form, expectedDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="esport-field-group">
                    <label className="esport-field-label">จำนวนทีม / ผู้เข้าร่วมงานโดยประมาณ:</label>
                    <div className="esport-input-wrapper">
                      <Users size={16} className="esport-input-icon" />
                      <input 
                        type="text" 
                        className="esport-text-input"
                        placeholder="เช่น 16 ทีม (ประมาณ 100-200 คน)"
                        value={form.attendees}
                        onChange={e => setForm({ ...form, attendees: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Addons Checklist */}
                <div className="esport-field-group" style={{ marginBottom: '14px' }}>
                  <label className="esport-field-label">อุปกรณ์และบริการเสริมที่ต้องการ:</label>
                  <div className="esport-addons-row">
                    {QUICK_ADDONS.map(addon => {
                      const isSel = selectedAddons.includes(addon);
                      return (
                        <button
                          key={addon}
                          type="button"
                          className={`esport-addon-chip-btn ${isSel ? 'active' : ''}`}
                          onClick={() => toggleAddon(addon)}
                        >
                          {isSel ? <Check size={13} className="text-blue" /> : <span style={{ opacity: 0.5 }}>+</span>}
                          <span>{addon}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Notes */}
                <div className="esport-field-group">
                  <label className="esport-field-label">บันทึกเพิ่มเติม หรือคำถามที่ต้องการให้ประเมินราคา:</label>
                  <textarea 
                    className="esport-textarea"
                    placeholder="เช่น ต้องการถ่ายทอดสด 2 ภาษา, ต้องการจัดเลี้ยงอาหารว่าง หรือต้องการนัดเข้าสำรวจสนามก่อนจัดงาน..."
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit Button & Fast Contact Bar */}
              <div className="esport-submit-bar">
                <button 
                  type="submit" 
                  className="esport-btn-submit"
                >
                  <Send size={18} />
                  <span>ส่งข้อมูลขอจัดงาน & รับใบเสนอราคาฟรี</span>
                </button>

                <div className="esport-fast-help-box">
                  <div className="esport-fast-help-title">
                    <Sparkles size={14} className="text-blue" />
                    <span>ต้องการสอบถามคิวว่าง หรือปรึกษาทีมงานด่วนทันที:</span>
                  </div>
                  <div className="esport-fast-contact-grid">
                    <a 
                      href={`tel:${hotlinePhone.replace(/[^0-9]/g, '')}`} 
                      className="esport-contact-action-btn phone"
                    >
                      <div className="contact-action-icon-circle">
                        <Phone size={15} />
                      </div>
                      <div className="contact-action-info">
                        <span className="contact-action-lbl">โทรสายด่วน</span>
                        <span className="contact-action-val">{hotlinePhone}</span>
                      </div>
                    </a>

                    <a 
                      href={lineOaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="esport-contact-action-btn line"
                    >
                      <div className="contact-action-icon-circle">
                        <MessageCircle size={15} />
                      </div>
                      <div className="contact-action-info">
                        <span className="contact-action-lbl">แชท LINE ทางการ</span>
                        <span className="contact-action-val">@GSPEED</span>
                      </div>
                      <ExternalLink size={12} className="contact-action-ext" />
                    </a>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

