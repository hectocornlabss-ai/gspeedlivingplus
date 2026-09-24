import React, { useState } from 'react';
import { 
  Trophy, Plus, Download, Phone, Gamepad2, Trash2, X, Save, Search, 
  CheckCircle2, AlertCircle, Clock, Calendar, Users, DollarSign, MessageCircle 
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function EsportRequestsCMS() {
  const { siteData, addLead, updateLead, deleteLead, addAuditLog } = useSiteData();

  // Filters & Search
  const [filterStage, setFilterStage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  const [form, setForm] = useState({
    name: '',
    organization: '',
    phone: '',
    lineId: '',
    email: '',
    gameRequested: 'VALORANT',
    zoneRequested: 'Main Stage & Battleground Zone',
    requestedDate: '',
    participantsCount: '16 ทีม (100+ คน)',
    estimatedBudget: '฿50,000 - ฿100,000',
    notes: ''
  });

  // Extract all leads that are tournament venue or esport event inquiries
  const allEventLeads = (siteData?.leads || []).filter(l => 
    l.type === 'tournament_venue' || 
    (l.typeName && (l.typeName.includes('แข่ง') || l.typeName.includes('จัดงาน') || l.typeName.includes('สนาม')))
  );

  const newCount = allEventLeads.filter(l => l.stage === 'new' || l.status === 'New').length;
  const inProgressCount = allEventLeads.filter(l => 
    l.stage === 'contacted' || l.stage === 'meeting' || l.stage === 'proposal' || l.status === 'In Discussion'
  ).length;
  const confirmedCount = allEventLeads.filter(l => l.stage === 'closed_won' || l.status === 'Confirmed').length;

  const filteredRequests = allEventLeads.filter(r => {
    const matchFilter = filterStage === 'all' || r.stage === filterStage || r.status === filterStage;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || 
      (r.name || '').toLowerCase().includes(q) ||
      (r.organization || '').toLowerCase().includes(q) ||
      (r.phone || '').toLowerCase().includes(q) ||
      (r.lineId || '').toLowerCase().includes(q) ||
      (r.gameRequested || '').toLowerCase().includes(q) ||
      (r.zoneRequested || r.zoneName || '').toLowerCase().includes(q) ||
      (r.notes || '').toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const handleExportCSV = () => {
    if (allEventLeads.length === 0) {
      alert('ยังไม่มีข้อมูลคำขอจัดงานแข่งสำหรับส่งออก');
      return;
    }
    const headers = ['รหัส', 'วันที่ส่งคำขอ', 'ชื่อผู้ติดต่อ', 'หน่วยงาน/สถาบัน', 'เบอร์โทร', 'LINE ID', 'เกมที่จัดแข่ง', 'เวที/โซนที่ขอ', 'วันที่ต้องการจัด', 'จำนวนผู้ร่วมงาน', 'งบประมาณ', 'สถานะ', 'หมายเหตุ'];
    const rows = allEventLeads.map(l => [
      l.id,
      '"' + (l.createdAt || '').replace(/"/g, '""') + '"',
      '"' + (l.name || '').replace(/"/g, '""') + '"',
      '"' + (l.organization || '').replace(/"/g, '""') + '"',
      '"' + (l.phone || '').replace(/"/g, '""') + '"',
      '"' + (l.lineId || '').replace(/"/g, '""') + '"',
      '"' + (l.gameRequested || '').replace(/"/g, '""') + '"',
      '"' + (l.zoneRequested || l.zoneName || '').replace(/"/g, '""') + '"',
      '"' + (l.requestedDate || '').replace(/"/g, '""') + '"',
      '"' + (l.participantsCount || '').replace(/"/g, '""') + '"',
      '"' + (l.estimatedBudget || l.budget || '').replace(/"/g, '""') + '"',
      '"' + (l.stage || l.status || '').replace(/"/g, '""') + '"',
      '"' + (l.notes || '').replace(/"/g, '""') + '"'
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GLP_Esport_Event_Requests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert('กรุณากรอกชื่อผู้ติดต่อและเบอร์โทรศัพท์');
      return;
    }

    if (addLead) {
      addLead({
        type: 'tournament_venue',
        typeName: 'ติดต่อขอจัดงานแข่ง Esport & เช่าสนาม',
        name: form.name,
        organization: form.organization || 'บุคคลทั่วไป / ทีมอิสระ',
        phone: form.phone,
        lineId: form.lineId,
        email: form.email,
        gameRequested: form.gameRequested,
        zoneRequested: form.zoneRequested,
        requestedDate: form.requestedDate || 'รอยืนยัน',
        participantsCount: form.participantsCount,
        estimatedBudget: form.estimatedBudget,
        notes: form.notes,
        stage: 'new',
        priority: 'High',
        channel: 'Admin Manual Entry'
      });
    }

    if (addAuditLog) {
      addAuditLog('MANUAL_ESPORT_REQUEST', `บันทึกคำขอจัดงานแข่งของ ${form.name} (${form.organization})`);
    }

    setShowManualModal(false);
    setForm({
      name: '',
      organization: '',
      phone: '',
      lineId: '',
      email: '',
      gameRequested: 'VALORANT',
      zoneRequested: 'Main Stage & Battleground Zone',
      requestedDate: '',
      participantsCount: '16 ทีม (100+ คน)',
      estimatedBudget: '฿50,000 - ฿100,000',
      notes: ''
    });
    triggerToast('บันทึกคำขอจัดงานแข่งใหม่เรียบร้อยแล้ว');
  };

  return (
    <div className="cms-panel-block" style={{ position: 'relative' }}>
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 100300,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="panel-header-row">
        <div>
          <h3 className="panel-title">
            <Trophy size={20} className="text-blue" />
            <span>ระบบคำขอจัดงานแข่ง Esport & เช่าสนาม Arena (Esport Event Requests)</span>
          </h3>
          <p className="panel-desc">
            จัดการคำขอติดต่อจัดงานแข่งอีสปอร์ต, ทัวร์นาเมนต์เกม, เช่าพื้นที่ Main Stage และโซนแข่งขัน พร้อมบันทึกสถานะการประสานงานและส่งต่อทีมงาน
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn-primary"
            onClick={() => setShowManualModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={14} /> + บันทึกคำขอจัดงานใหม่ (Walk-in / สายด่วน)
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleExportCSV}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> ส่งออก CSV
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <div className="admin-subcard glass-panel" style={{ padding: '16px', borderLeft: '4px solid #3b82f6' }}>
          <span className="text-xs text-muted" style={{ fontWeight: 600 }}>คำขอจัดงานทั้งหมด</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {allEventLeads.length}
          </div>
          <span className="text-xs text-muted">ทุกประเภทการจัดงาน & เช่าสนาม</span>
        </div>

        <div className="admin-subcard glass-panel" style={{ padding: '16px', borderLeft: '4px solid #f59e0b', background: 'rgba(254, 243, 199, 0.3)' }}>
          <span className="text-xs" style={{ fontWeight: 600, color: '#b45309' }}>ผู้สนใจใหม่ / รอติดต่อกลับ</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {newCount}
          </div>
          <span className="text-xs text-muted">ต้องติดต่อกลับภายใน 24 ชม.</span>
        </div>

        <div className="admin-subcard glass-panel" style={{ padding: '16px', borderLeft: '4px solid #8b5cf6', background: 'rgba(243, 232, 255, 0.3)' }}>
          <span className="text-xs" style={{ fontWeight: 600, color: '#6d28d9' }}>กำลังเจรจา / นัดหมาย / ส่งใบเสนอราคา</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>
            {inProgressCount}
          </div>
          <span className="text-xs text-muted">รอสรุปวันแข่ง & มัดจำ</span>
        </div>

        <div className="admin-subcard glass-panel" style={{ padding: '16px', borderLeft: '4px solid #10b981', background: 'rgba(209, 250, 229, 0.3)' }}>
          <span className="text-xs" style={{ fontWeight: 600, color: '#047857' }}>ยืนยันจัดงานแล้ว (Confirmed / Won)</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            {confirmedCount}
          </div>
          <span className="text-xs text-muted">ล็อกคิวเวที & เตรียมพื้นที่</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="admin-subcard glass-panel" style={{ padding: '14px 18px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'new', label: 'ผู้สนใจใหม่ (New)' },
              { id: 'contacted', label: 'ติดต่อแล้ว (Contacted)' },
              { id: 'meeting', label: 'นัดหมายดูสนาม (Meeting)' },
              { id: 'proposal', label: 'ส่งใบเสนอราคา (Proposal)' },
              { id: 'closed_won', label: 'ยืนยันจัดงาน (Confirmed)' },
              { id: 'closed_lost', label: 'ยกเลิก/ไม่พร้อม (Cancelled)' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterStage(f.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: filterStage === f.id ? '#2563eb' : '#cbd5e1',
                  background: filterStage === f.id ? '#2563eb' : '#ffffff',
                  color: filterStage === f.id ? '#ffffff' : '#475569',
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ minWidth: '280px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="ค้นหาชื่อผู้ติดต่อ, สถาบัน, เบอร์โทร หรือชื่อเกม..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '0.84rem', width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Requests Table */}
      {filteredRequests.length === 0 ? (
        <div className="admin-subcard glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          <Trophy size={40} style={{ opacity: 0.3, marginBottom: '8px' }} />
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>ยังไม่พบคำขอจัดงานแข่งที่ตรงกับเงื่อนไข</div>
          <p style={{ fontSize: '0.85rem', margin: '4px 0 16px 0' }}>คำขอจัดงานแข่งที่ลูกค้าส่งจากหน้าเว็บหรือสายด่วนจะแสดงที่นี่</p>
          <button 
            type="button" 
            className="btn-primary" 
            onClick={() => setShowManualModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}
          >
            <Plus size={14} /> + บันทึกคำขอจัดงานแข่งใหม่
          </button>
        </div>
      ) : (
        <div className="admin-subcard glass-panel" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px 16px' }}>วันที่ & รหัส</th>
                <th style={{ padding: '12px 16px' }}>ผู้ติดต่อ & สถาบัน/หน่วยงาน</th>
                <th style={{ padding: '12px 16px' }}>ช่องทางติดต่อ</th>
                <th style={{ padding: '12px 16px' }}>เกม & เวที/โซนที่ขอ</th>
                <th style={{ padding: '12px 16px' }}>วันแข่ง & จำนวนคน</th>
                <th style={{ padding: '12px 16px' }}>งบประมาณ</th>
                <th style={{ padding: '12px 16px' }}>สถานะการประสานงาน</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r, idx) => (
                <tr key={r.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 800, color: '#2563eb' }}>{r.id}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{r.createdAt}</div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.name}</div>
                    {r.organization ? (
                      <div style={{ fontSize: '0.76rem', color: '#2563eb', fontWeight: 600 }}>{r.organization}</div>
                    ) : (
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>บุคคลทั่วไป / ทีมอิสระ</div>
                    )}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} className="text-blue" />
                      <a href={`tel:${r.phone}`} style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'none' }}>
                        {r.phone}
                      </a>
                    </div>
                    {r.lineId && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontSize: '0.76rem' }}>
                        <span style={{ color: '#06c755', fontWeight: 700 }}>LINE:</span>
                        <a 
                          href={`https://line.me/ti/p/~${r.lineId.replace(/^@/, '')}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          style={{ color: '#059669', textDecoration: 'none', fontWeight: 600 }}
                        >
                          {r.lineId}
                        </a>
                      </div>
                    )}
                    {r.email && (
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        {r.email}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.78rem' }}>
                      <Gamepad2 size={13} />
                      <span>{r.gameRequested || 'ไม่ระบุเกม'}</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '4px' }}>
                      {r.zoneRequested || r.zoneName || 'Main Stage & Battleground'}
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{r.requestedDate || 'ยังไม่ระบุวัน'}</div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{r.participantsCount || 'ยังไม่ระบุจำนวนคน'}</div>
                  </td>

                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#059669' }}>
                    {r.estimatedBudget || r.budget || 'ตามตกลง'}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={r.stage || r.status || 'new'}
                      onChange={e => {
                        const newStage = e.target.value;
                        if (updateLead) {
                          updateLead(r.id, { stage: newStage, status: newStage });
                          if (addAuditLog) {
                            addAuditLog('UPDATE_ESPORT_REQUEST_STATUS', `เปลี่ยนสถานะคำขอจัดงานของ ${r.name} เป็น ${newStage}`);
                          }
                          triggerToast(`อัปเดตสถานะของ ${r.name} เป็น ${newStage}`);
                        }
                      }}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        border: '1px solid #cbd5e1',
                        background: (r.stage === 'closed_won' || r.status === 'Confirmed') ? '#dcfce7' : (r.stage === 'new' || r.status === 'New') ? '#fef3c7' : '#ffffff',
                        color: (r.stage === 'closed_won' || r.status === 'Confirmed') ? '#15803d' : (r.stage === 'new' || r.status === 'New') ? '#b45309' : '#0f172a',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="new">ผู้สนใจใหม่ (New)</option>
                      <option value="contacted">ติดต่อแล้ว (Contacted)</option>
                      <option value="meeting">นัดหมายดูสนาม (Meeting)</option>
                      <option value="proposal">ส่งใบเสนอราคา (Proposal)</option>
                      <option value="closed_won">ยืนยันจัดงาน (Confirmed)</option>
                      <option value="closed_lost">ยกเลิก/ไม่พร้อม (Cancelled)</option>
                    </select>
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`คุณต้องการลบคำขอจัดงานของ "${r.name}" หรือไม่?`)) {
                            if (deleteLead) {
                              deleteLead(r.id);
                              if (addAuditLog) {
                                addAuditLog('DELETE_ESPORT_REQUEST', `ลบคำขอจัดงาน ${r.id} (${r.name})`);
                              }
                              triggerToast(`ลบคำขอจัดงานของ ${r.name} แล้ว`);
                            }
                          }
                        }}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', fontSize: '0.74rem', cursor: 'pointer' }}
                        title="ลบคำขอจัดงาน"
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

      {/* Manual Organizer Request Modal */}
      {showManualModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 15, 29, 0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 100200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowManualModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              maxWidth: '540px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={18} className="text-blue" />
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>+ บันทึกคำขอจัดงานแข่ง Esport & เช่าสนาม</h4>
              </div>
              <button type="button" onClick={() => setShowManualModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateRequest}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div className="form-row-2">
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>ชื่อผู้ติดต่อ / ผู้รับผิดชอบงาน *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="เช่น คุณกอล์ฟ, อาจารย์ นพดล"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>หน่วยงาน / สถาบัน / บริษัท</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น ม.เกษตรศาสตร์, ทีม Bacon Time"
                    value={form.organization}
                    onChange={e => setForm({ ...form, organization: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>เบอร์โทรติดต่อ *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="08X-XXX-XXXX"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>LINE ID</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="@line_id"
                    value={form.lineId}
                    onChange={e => setForm({ ...form, lineId: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>เกมที่ต้องการจัดแข่งขัน</label>
                  <select
                    className="form-input"
                    value={form.gameRequested}
                    onChange={e => setForm({ ...form, gameRequested: e.target.value })}
                  >
                    <option value="VALORANT">VALORANT (PC)</option>
                    <option value="RoV">RoV (Mobile)</option>
                    <option value="CS2">Counter-Strike 2 (PC)</option>
                    <option value="PUBG PC">PUBG: BATTLEGROUNDS (PC)</option>
                    <option value="EA Sports FC 25">EA Sports FC 25 (PS5/PC)</option>
                    <option value="Free Fire">Free Fire (Mobile)</option>
                    <option value="Custom / อื่นๆ">เกมอื่นๆ / หลายเกม</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>โซนหรือเวทีที่ต้องการใช้</label>
                  <select
                    className="form-input"
                    value={form.zoneRequested}
                    onChange={e => setForm({ ...form, zoneRequested: e.target.value })}
                  >
                    <option value="Main Stage & Battleground Zone">Main Stage 5v5 + จอ LED ยักษ์</option>
                    <option value="Caster & Production Suite">Caster & Production Studio</option>
                    <option value="VIP Private Training Room">VIP Private Training Room</option>
                    <option value="High-FPS Pro Circuit Zone">High-FPS Pro Circuit Zone</option>
                    <option value="เหมาทั้งอารีน่า (Full Arena Takeover)">เหมาทั้งอารีน่า (Full Arena Takeover)</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>วันที่คาดว่าจะจัดงาน</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น 15-16 พ.ย. 2026"
                    value={form.requestedDate}
                    onChange={e => setForm({ ...form, requestedDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>ประมาณการจำนวนคน / นักกีฬา</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น 16 ทีม (100+ คน)"
                    value={form.participantsCount}
                    onChange={e => setForm({ ...form, participantsCount: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>งบประมาณโดยประมาณ</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="เช่น ฿50,000 หรือ ตามตกลง"
                  value={form.estimatedBudget}
                  onChange={e => setForm({ ...form, estimatedBudget: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>หมายเหตุ / ความต้องการพิเศษ</label>
                <textarea
                  rows={2}
                  className="form-input"
                  placeholder="เช่น ต้องการพากย์สด, จอ LED ถ่ายทอดสด, เครื่องสตรีมเมอร์..."
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowManualModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}>
                  <Save size={14} /> บันทึกคำขอจัดงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
