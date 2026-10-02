import React, { useState, useEffect } from 'react';
import { 
  X, Trophy, Phone, MessageCircle, Calendar, Users, 
  Send, CheckCircle2, Monitor, Radio, ArrowRight, ExternalLink, Sparkles,
  User, Building2, Layers, Check, Tv, Zap, Shield, FileText, Gamepad2
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';

const POPULAR_GAMES = [
  { id: 'VALORANT', name: 'VALORANT', logo: '/game-logos/valorant.svg' },
  { id: 'Arena of Valor (RoV)', name: 'RoV', logo: '/game-logos/rov.svg' },
  { id: 'Counter-Strike 2', name: 'CS2', logo: '/game-logos/cs2.svg' },
  { id: 'PUBG PC', name: 'PUBG PC/Mobile', logo: '/game-logos/pubg.svg' },
  { id: 'EA Sports FC Online', name: 'EA FC Online', logo: '/game-logos/eafc.svg' },
  { id: 'Apex Legends', name: 'Apex Legends', logo: '/game-logos/apex.svg' },
  { id: 'AUDITION', name: 'AUDITION', logo: '/game-logos/audition.svg' },
  { id: 'RAGNAROK', name: 'RAGNAROK', logo: '/game-logos/ragnarok.svg' },
  { id: 'WARZ', name: 'WARZ', logo: '/game-logos/warz.svg' },
  { id: 'other', name: 'เกมอื่นๆ', logo: '/game-logos/other.svg', isOther: true }
];

export default function EsportOrganizerModal({ 
  isOpen, 
  onClose,
  initialZoneName = ''
}) {
  const { siteData, addLead } = useSiteData();
  const { t, language } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

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
    addonsText: '',
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

  const lineOaUrl = siteData?.footer?.lineUrl || 'https://line.me/R/ti/p/@gspeed';
  const hotlinePhone = siteData?.footer?.phone || '063-793-7704';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      alert(language === 'th' ? 'กรุณากรอกชื่อผู้ติดต่อและเบอร์โทรศัพท์' : language === 'zh' ? '请填写联系人姓名与电话' : 'Please fill in contact name and phone number');
      return;
    }

    const selectedGame = form.game === 'other' ? (form.customGame || (language === 'th' ? 'เกมอื่นๆ' : language === 'zh' ? '其他游戏' : 'Other Game')) : form.game;
    const addonsNote = form.addonsText?.trim() ? ` | อุปกรณ์เสริม: ${form.addonsText.trim()}` : '';
    const fullNotes = `${form.notes || '-'}${addonsNote}`;

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

  if (!isOpen) return null;

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
            aria-label={t('nav.close') || 'ปิดหน้าต่าง'}
          >
            <X size={18} />
          </button>

          <div className="esport-modal-badge">
            <Sparkles size={13} />
            <span>GSPEED LIVING PLUS TOURNAMENT VENUE</span>
          </div>

          <h3 className="esport-modal-title">
            {t('organizerModal.title') || 'ติดต่อขอจัดงานแข่ง Esport & เช่าสถานที่'}
          </h3>
          <p className="esport-modal-subtitle">
            {t('organizerModal.subtitle') || 'พื้นที่ประลองเกมมาตรฐาน Pro Circuit พร้อมเวที Main Stage, จอถ่ายทอดสด LED Wall 4K, สเปก 360Hz และระบบเน็ตเวิร์ก 10Gbps'}
          </p>

          {/* Highlights Chips Bar */}
          <div className="esport-modal-chips-bar">
            <div className="esport-feature-chip">
              <Trophy size={13} />
              <span>{t('organizerModal.chipStage') || 'เวที 5v5 Soundproof Stage'}</span>
            </div>
            <div className="esport-feature-chip">
              <Tv size={13} />
              <span>{t('organizerModal.chipScreen') || 'จอ LED Wall 4K สตูดิโอ'}</span>
            </div>
            <div className="esport-feature-chip">
              <Zap size={13} />
              <span>{t('organizerModal.chipGear') || 'RTX 40 Series 360Hz'}</span>
            </div>
            <div className="esport-feature-chip">
              <Radio size={13} />
              <span>{t('organizerModal.chipCaster') || 'โต๊ะแคสเตอร์พากย์สด'}</span>
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
                {t('organizerModal.successTitle') || 'ส่งข้อมูลขอจัดงานแข่งสำเร็จแล้ว!'}
              </h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 18px' }}>
                {t('organizerModal.successDesc') || 'เจ้าหน้าที่ฝ่ายประสานงานทัวร์นาเมนต์ GLP ได้รับข้อมูลของคุณเรียบร้อยแล้ว และจะติดต่อกลับผ่านเบอร์โทรศัพท์และ LINE เพื่อเสนอแพ็กเกจสถานที่และนัดหมายเข้าชมสนามจริงภายใน 24 ชม.'}
              </p>

              {/* Summary Box */}
              <div className="esport-summary-box">
                <div className="esport-summary-line">
                  <span className="esport-summary-label">{language === 'th' ? 'ผู้ติดต่อ:' : language === 'zh' ? '联系人:' : 'Contact:'}</span>
                  <span className="esport-summary-value">{form.name} {form.organization ? `(${form.organization})` : ''}</span>
                </div>
                <div className="esport-summary-line">
                  <span className="esport-summary-label">{language === 'th' ? 'เบอร์โทรศัพท์:' : language === 'zh' ? '联系电话:' : 'Phone:'}</span>
                  <span className="esport-summary-value">{form.phone}</span>
                </div>
                <div className="esport-summary-line">
                  <span className="esport-summary-label">{language === 'th' ? 'เกมที่ต้องการจัด:' : language === 'zh' ? '比赛项目:' : 'Game:'}</span>
                  <span className="esport-summary-value text-blue">{form.game === 'other' ? form.customGame : form.game}</span>
                </div>
                {initialZoneName && (
                  <div className="esport-summary-line">
                    <span className="esport-summary-label">{language === 'th' ? 'โซนที่สนใจ:' : language === 'zh' ? '意向区域:' : 'Preferred Zone:'}</span>
                    <span className="esport-summary-value">{initialZoneName}</span>
                  </div>
                )}
                {form.addonsText && (
                  <div className="esport-summary-line">
                    <span className="esport-summary-label">{language === 'th' ? 'อุปกรณ์เสริม:' : language === 'zh' ? '附加配套:' : 'Add-ons:'}</span>
                    <span className="esport-summary-value">{form.addonsText}</span>
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
                  <span>{t('organizerModal.chatLineSuccess') || 'ทักแชต LINE OA เพื่อส่งรายละเอียดเพิ่ม'}</span>
                  <ExternalLink size={14} />
                </a>

                <button 
                  type="button" 
                  onClick={onClose}
                  className="btn-secondary"
                  style={{ padding: '11px 24px' }}
                >
                  {t('nav.close') || 'ปิดหน้าต่าง'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* SECTION 1: เลือกเกมที่ต้องการจัดแข่งขัน */}
              <div className="esport-form-section">
                <div className="esport-section-header">
                  <span className="esport-section-num">1</span>
                  <h4 className="esport-section-title">{t('organizerModal.section1') || 'เลือกเกมที่ต้องการจัดการแข่งขัน'}</h4>
                </div>

                {/* Popular Games Chips with Logos */}
                <div className="esport-field-group">
                  <label className="esport-field-label">
                    {t('organizerModal.gameLabel') || 'เกมที่ต้องการจัดการแข่งขัน'}:
                  </label>
                  <div className="esport-game-chips-grid">
                    {(Array.isArray(siteData?.organizerGames) && siteData.organizerGames.length > 0 ? siteData.organizerGames : POPULAR_GAMES).map(g => {
                      const isSel = form.game === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          className={`esport-game-chip-btn ${isSel ? 'active' : ''}`}
                          onClick={() => setForm({ ...form, game: g.id })}
                        >
                          <div className="esport-chip-content">
                            {g.logo ? (
                              <img 
                                src={g.logo} 
                                alt={g.name} 
                                className="esport-game-logo-img" 
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const fallback = e.currentTarget.parentElement.querySelector('.esport-game-logo-fallback');
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="esport-game-logo-fallback" style={{ display: g.logo ? 'none' : 'flex' }}>
                              <Gamepad2 size={22} className="text-blue" />
                            </div>
                            <span className="esport-game-name">{g.isOther && language !== 'th' ? (language === 'zh' ? '其他游戏' : 'Other') : g.name}</span>
                          </div>
                          {isSel && (
                            <div className="esport-chip-check-badge">
                              <Check size={14} className="text-blue" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {(form.game === 'other' || (siteData?.organizerGames || POPULAR_GAMES).find(g => g.id === form.game)?.isOther) && (
                    <div className="esport-input-wrapper" style={{ marginTop: '10px' }}>
                      <input 
                        type="text" 
                        required
                        className="esport-text-input"
                        placeholder={language === 'th' ? 'พิมพ์ระบุชื่อเกม เช่น Audition, Zone4, Street Fighter 6...' : language === 'zh' ? '请输入比赛游戏名称...' : 'Specify game title e.g. Street Fighter 6, FC 24...'}
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
                  <h4 className="esport-section-title">{t('organizerModal.section2') || 'ข้อมูลผู้ติดต่อ & องค์กร'}</h4>
                </div>

                <div className="esport-inputs-grid-2">
                  <div className="esport-field-group">
                    <label className="esport-field-label">
                      <span>{t('organizerModal.nameLabel') || 'ชื่อผู้ติดต่อ / ตัวแทนผู้จัด'}</span>
                      <span className="esport-required-mark">*</span>
                    </label>
                    <div className="esport-input-wrapper">
                      <User size={16} className="esport-input-icon" />
                      <input 
                        type="text" required 
                        className="esport-text-input"
                        placeholder={language === 'th' ? 'เช่น คุณกิตติศักดิ์ มั่นคง' : language === 'zh' ? '例如 张先生' : 'e.g. Alex Johnson'}
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="esport-field-group">
                    <label className="esport-field-label">
                      {t('organizerModal.orgLabel') || 'องค์กร / บริษัท / มหาวิทยาลัย / ทีมแข่ง'}
                    </label>
                    <div className="esport-input-wrapper">
                      <Building2 size={16} className="esport-input-icon" />
                      <input 
                        type="text" 
                        className="esport-text-input"
                        placeholder={language === 'th' ? 'เช่น ม.เกษตรศาสตร์ หรือ บริษัท ABC' : language === 'zh' ? '例如 ABC 公司或某电竞俱乐部' : 'e.g. University Esports Club or ABC Corp'}
                        value={form.organization}
                        onChange={e => setForm({ ...form, organization: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="esport-inputs-grid-2">
                  <div className="esport-field-group">
                    <label className="esport-field-label">
                      <span>{t('organizerModal.phoneLabel') || 'เบอร์โทรศัพท์ติดต่อ'}</span>
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
                    <label className="esport-field-label">
                      {t('organizerModal.lineLabel') || 'LINE ID หรือ อีเมลสำหรับรับใบเสนอราคา'}
                    </label>
                    <div className="esport-input-wrapper">
                      <MessageCircle size={16} className="esport-input-icon" />
                      <input 
                        type="text" 
                        className="esport-text-input"
                        placeholder={language === 'th' ? 'เช่น @line_id หรือ email@domain.com' : language === 'zh' ? '微信号 / LINE ID / 邮箱' : 'e.g. @line_id or email@example.com'}
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
                  <h4 className="esport-section-title">{t('organizerModal.section3') || 'กำหนดการ & ความต้องการเพิ่มเติม'}</h4>
                </div>

                <div className="esport-inputs-grid-2">
                  <div className="esport-field-group">
                    <label className="esport-field-label">
                      {t('organizerModal.expectedDateLabel') || 'วันที่หรือช่วงเวลาที่ต้องการจัดงาน'}:
                    </label>
                    <div className="esport-input-wrapper">
                      <Calendar size={16} className="esport-input-icon" />
                      <input 
                        type="text" 
                        className="esport-text-input"
                        placeholder={language === 'th' ? 'เช่น 15-16 พ.ย. หรือ เสาร์-อาทิตย์' : language === 'zh' ? '例如 11月15-16日 或 周末' : 'e.g. Nov 15-16 or Weekends'}
                        value={form.expectedDate}
                        onChange={e => setForm({ ...form, expectedDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="esport-field-group">
                    <label className="esport-field-label">
                      {t('organizerModal.attendeesLabel') || 'จำนวนทีม / ผู้เข้าร่วมงานโดยประมาณ'}:
                    </label>
                    <div className="esport-input-wrapper">
                      <Users size={16} className="esport-input-icon" />
                      <input 
                        type="text" 
                        className="esport-text-input"
                        placeholder={language === 'th' ? 'เช่น 16 ทีม (ประมาณ 100-200 คน)' : language === 'zh' ? '例如 16 支队伍 (约 100-200 人)' : 'e.g. 16 Teams (~100-200 people)'}
                        value={form.attendees}
                        onChange={e => setForm({ ...form, attendees: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Equipment & Services text input */}
                <div className="esport-field-group" style={{ marginBottom: '14px' }}>
                  <label className="esport-field-label">
                    {t('organizerModal.addonsLabel') || 'อุปกรณ์และบริการเสริมที่ต้องการ:'}
                  </label>
                  <div className="esport-input-wrapper">
                    <Sparkles size={16} className="esport-input-icon" />
                    <input 
                      type="text" 
                      className="esport-text-input"
                      placeholder={language === 'th' ? 'เช่น จอ LED Wall 4K, โต๊ะแคสเตอร์พากย์สด, อาหารเครื่องดื่ม, เน็ต 10Gbps...' : language === 'zh' ? '如 4K巨幕LED屏、解说台、餐饮、10Gbps网络专线...' : 'e.g. 4K LED Screen, Caster Desk, Catering, 10Gbps Network...'}
                      value={form.addonsText}
                      onChange={e => setForm({ ...form, addonsText: e.target.value })}
                    />
                  </div>
                </div>

                {/* Detailed Notes */}
                <div className="esport-field-group">
                  <label className="esport-field-label">
                    {t('organizerModal.notesLabel') || 'บันทึกเพิ่มเติม หรือคำถามที่ต้องการให้ประเมินราคา:'}
                  </label>
                  <textarea 
                    className="esport-textarea"
                    placeholder={language === 'th' ? 'เช่น ต้องการถ่ายทอดสด 2 ภาษา, ต้องการจัดเลี้ยงอาหารว่าง หรือต้องการนัดเข้าสำรวจสนามก่อนจัดงาน...' : language === 'zh' ? '例如 需要双语直播、茶歇供应，或预约现场实地考察...' : 'e.g. Need bilingual live stream, catering snacks, or schedule a venue inspection visit...'}
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
                  <span>{t('organizerModal.submitFull') || 'ส่งข้อมูลขอจัดงาน & รับใบเสนอราคาฟรี'}</span>
                </button>

                <div className="esport-fast-help-box">
                  <div className="esport-fast-help-title">
                    <Sparkles size={14} className="text-blue" />
                    <span>{t('organizerModal.fastHelpTitle') || 'ต้องการสอบถามคิวว่าง หรือปรึกษาทีมงานด่วนทันที:'}</span>
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
                        <span className="contact-action-lbl">{t('organizerModal.callHotline') || 'โทรสายด่วน'}</span>
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
                        <span className="contact-action-lbl">{t('organizerModal.chatLine') || 'แชท LINE ทางการ'}</span>
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
