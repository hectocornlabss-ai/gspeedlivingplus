import React, { useState } from 'react';
import { 
  X, Trophy, Phone, MessageCircle, Calendar, Users, 
  Send, CheckCircle2, Monitor, Radio, ArrowRight, ExternalLink, Sparkles 
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function EsportOrganizerModal({ 
  isOpen, 
  onClose,
  initialZoneName = ''
}) {
  const { siteData, addLead } = useSiteData();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    organization: '',
    phone: '',
    lineId: '',
    email: '',
    game: 'VALORANT',
    customGame: '',
    format: 'Main Stage 5v5 + Battleground Zone',
    expectedDate: '',
    attendees: '16-32 ทีม (ประมาณ 100-200 คน)',
    budget: '',
    notes: initialZoneName ? `สนใจจัดงานแข่งขันในโซน: ${initialZoneName}` : ''
  });

  if (!isOpen) return null;

  const lineOaUrl = siteData?.footer?.lineUrl || 'https://line.me/R/ti/p/@gspeed';
  const hotlinePhone = siteData?.footer?.phone || '063-793-7704';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      alert('กรุณากรอกชื่อผู้ติดต่อและเบอร์โทรศัพท์');
      return;
    }

    const selectedGame = form.game === 'other' ? (form.customGame || 'เกมอื่นๆ') : form.game;

    if (addLead) {
      addLead({
        name: form.name,
        company: form.organization || 'บุคคลทั่วไป / ทีมแข่งอิสระ',
        phone: form.phone,
        email: form.email,
        lineId: form.lineId,
        type: 'tournament_venue',
        typeName: `ติดต่อขอจัดงานแข่ง Esport (${selectedGame})`,
        budget: form.budget ? Number(form.budget.replace(/[^0-9]/g, '')) || 50000 : 50000,
        stage: 'new',
        channel: 'web_esport_modal',
        floorArea: form.format,
        expectedOpening: form.expectedDate || 'เร็วๆ นี้',
        notes: `เกมที่ต้องการจัด: ${selectedGame} | รูปแบบ: ${form.format} | ผู้เข้าร่วม: ${form.attendees} | LINE: ${form.lineId || '-'} | บันทึกเพิ่มเติม: ${form.notes || '-'}`
      });
    }

    setSubmitted(true);
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{ zIndex: 10050, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div 
        className="modal-dialog"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '680px', width: '94vw', maxHeight: '92vh', overflowY: 'auto', borderRadius: '16px', background: '#ffffff', padding: 0 }}
      >
        {/* Modal Header */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', color: '#ffffff', padding: '24px 28px', position: 'relative' }}>
          <button 
            type="button" 
            onClick={onClose}
            style={{ position: 'absolute', top: '18px', right: '18px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37, 99, 235, 0.3)', border: '1px solid rgba(147, 197, 253, 0.4)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: 800, color: '#93c5fd', marginBottom: '8px' }}>
            <Sparkles size={12} />
            <span>GLP ARENA TOURNAMENT VENUE</span>
          </div>

          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
            ติดต่อขอจัดงานแข่ง Esport & เช่าสถานที่
          </h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            พื้นที่ประลองเกมมาตรฐาน Pro Circuit พร้อมเวที Main Stage, จอถ่ายทอดสด LED, สเปก RTX 40 Series 360Hz และระบบเน็ตเวิร์ก 10Gbps
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px' }}>
          {/* Quick Contact Bar */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                ช่องทางด่วนฝ่ายกิจกรรม & งานแข่ง:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={15} className="text-blue" />
                  <span>{hotlinePhone}</span>
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageCircle size={15} />
                  <span>LINE: @GSPEED</span>
                </span>
              </div>
            </div>

            <a 
              href={lineOaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: '#06c755', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <MessageCircle size={15} />
              <span>ทักแชต LINE OA</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                ส่งข้อมูลขอจัดงานแข่งสำเร็จแล้ว!
              </h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto 24px' }}>
                เจ้าหน้าที่ฝ่ายจัดกิจกรรม & ประสานงานทัวร์นาเมนต์ G-Speed จะติดต่อกลับหาคุณผ่านเบอร์โทรศัพท์และ LINE เพื่อเสนอแพ็กเกจสถานที่และนัดหมายเข้าชมสนามจริงภายใน 24 ชม.
              </p>
              <button 
                type="button" 
                onClick={onClose}
                className="btn-primary"
                style={{ padding: '10px 24px' }}
              >
                ตกลง
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-row-2">
                <div className="form-group">
                  <label>ชื่อผู้ติดต่อ / ตัวแทนผู้จัด *</label>
                  <input 
                    type="text" required className="form-input"
                    placeholder="เช่น คุณกอล์ฟ หรือ ชมรมอีสปอร์ต"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>องค์กร / บริษัท / มหาวิทยาลัย</label>
                  <input 
                    type="text" className="form-input"
                    placeholder="เช่น ม.เกษตรศาสตร์ หรือ บริษัท ABC"
                    value={form.organization}
                    onChange={e => setForm({ ...form, organization: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>เบอร์โทรศัพท์ติดต่อ *</label>
                  <input 
                    type="tel" required className="form-input"
                    placeholder="08X-XXX-XXXX"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>LINE ID หรือ อีเมล</label>
                  <input 
                    type="text" className="form-input"
                    placeholder="ID Line สำหรับส่งใบเสนอราคา"
                    value={form.lineId}
                    onChange={e => setForm({ ...form, lineId: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>เกมที่ต้องการจัดแข่งขัน</label>
                  <select 
                    className="form-input"
                    value={form.game}
                    onChange={e => setForm({ ...form, game: e.target.value })}
                  >
                    <option value="VALORANT">VALORANT (5v5 Tactical FPS)</option>
                    <option value="Arena of Valor (RoV)">RoV (5v5 Mobile MOBA)</option>
                    <option value="Counter-Strike 2">Counter-Strike 2 (CS2)</option>
                    <option value="PUBG PC">PUBG PC / PUBG Mobile</option>
                    <option value="EA Sports FC Online">EA Sports FC Online</option>
                    <option value="Apex Legends">Apex Legends</option>
                    <option value="other">เกมอื่นๆ (ระบุเอง)</option>
                  </select>
                </div>
                {form.game === 'other' ? (
                  <div className="form-group">
                    <label>ระบุชื่อเกม</label>
                    <input 
                      type="text" className="form-input"
                      placeholder="เช่น Audition, Zone4, Street Fighter"
                      value={form.customGame}
                      onChange={e => setForm({ ...form, customGame: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>วันที่หรือช่วงเวลาที่ต้องการจัดแข่ง</label>
                    <input 
                      type="text" className="form-input"
                      placeholder="เช่น กลางเดือนตุลาคม หรือ เสาร์-อาทิตย์"
                      value={form.expectedDate}
                      onChange={e => setForm({ ...form, expectedDate: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>รูปแบบและโซนที่ต้องการใช้งาน</label>
                  <select 
                    className="form-input"
                    value={form.format}
                    onChange={e => setForm({ ...form, format: e.target.value })}
                  >
                    <option value="Main Stage 5v5 + Battleground Zone">เวที Main Stage 5v5 + Battleground Zone (ยอดนิยม)</option>
                    <option value="เหมาพื้นที่จัดแข่ง 50 เครื่อง">เช่าพื้นที่จัดแข่ง 50 เครื่อง</option>
                    <option value="เหมาอารีน่าทั้งร้าน 100+ เครื่อง">เช่าพื้นที่อารีน่าทั้งร้าน 100+ เครื่อง (Full Arena)</option>
                    <option value="Live Streaming & Caster Desk">เฉพาะห้องถ่ายทอดสด & โต๊ะพากย์แคสเตอร์</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>จำนวนทีมหรือผู้เข้าร่วมโดยประมาณ</label>
                  <input 
                    type="text" className="form-input"
                    placeholder="เช่น 16 ทีม (ประมาณ 100 คน)"
                    value={form.attendees}
                    onChange={e => setForm({ ...form, attendees: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>รายละเอียดเพิ่มเติม หรือความต้องการพิเศษ</label>
                <textarea 
                  className="form-input" rows="2"
                  placeholder="เช่น ต้องการจอ LED Wall สำหรับถ่ายทอดสด, ต้องการโต๊ะแคสเตอร์พากย์เกม, หรือนัดเข้าชมสถานที่จริง"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary"
                style={{ padding: '14px', fontSize: '1rem', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Send size={18} />
                <span>ส่งข้อมูลติดต่อขอจัดงานแข่ง</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
