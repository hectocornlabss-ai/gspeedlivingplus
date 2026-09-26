import React, { useState } from 'react';
import { 
  Users, Shield, ShieldCheck, Key, Plus, Trash2, Edit3, 
  Check, X, Eye, EyeOff, Lock, UserCheck, UserX, AlertTriangle,
  Save, CheckSquare, Square, Crown, Sliders, CheckCircle2,
  TrendingUp, MessagesSquare, Monitor, Cpu, Bot, LayoutGrid,
  FileText, Trophy, Search, Activity, Mail
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

// Tab Definitions Reference for Permission Matrix
export const PERMISSION_TABS_LIST = [
  { id: 'erp-analytics', label: '01. ดูยอดขาย & ERP ร้านเกม', icon: TrendingUp, color: '#059669', desc: 'AI สรุปรายได้, Peak Hours, ซิงก์ POS' },
  { id: 'omnichannel-leads', label: '02. แชท & Leads แฟรนไชส์', icon: MessagesSquare, color: '#0284c7', desc: 'รวมแชท LINE/FB, Leads แฟรนไชส์, งบดุล /pay' },
  { id: 'catalog', label: '03. แต่งอุปกรณ์ & แคตตาล็อก 3D', icon: Monitor, color: '#7c3aed', desc: 'โต๊ะ, เก้าอี้, เคาน์เตอร์, หลายเกรด' },
  { id: 'hardware-pricing', label: '04. สเปกคอม & ราคาโครงสร้าง', icon: Cpu, color: '#2563eb', desc: 'รุ่น 001, RTX 5090, Diskless, โต๊ะ' },
  { id: 'tourney-apps', label: '05. ทัวร์นาเมนต์ & สายการแข่งขัน', icon: Users, color: '#dc2626', desc: 'อนุมัติทีมแข่ง, ควบคุมสายแข่ง, สกอร์สด' },
  { id: 'arena-bookings', label: '06. คำขอจัดงานแข่ง Esport', icon: Trophy, color: '#d97706', desc: 'ติดต่อขอจัดงานแข่ง, เช่าเวที Main Stage, สปอนเซอร์' },
  { id: 'articles', label: '07. กิจกรรม & บทความ (Articles)', icon: FileText, color: '#4f46e5', desc: 'กำหนด URL Slug, ลิงก์แยก, รูปภาพ' },
  { id: 'ai-rag', label: '08. ระบบ AI แชท & คลังความรู้ RAG', icon: Bot, color: '#9333ea', desc: 'OpenRouter, Gemini Flash, เทรนข้อมูล' },
  { id: 'seo-tools', label: '09. เครื่องมือ SEO & Marketing Tracking', icon: Search, color: '#ea580c', desc: 'Google Search, Bing, Meta Pixel, GTM, AI SEO' },
  { id: 'sections', label: '10. เนื้อหาแต่ละ Section', icon: LayoutGrid, color: '#0d9488', desc: 'Hero, กิจกรรม, แกลเลอรี, ประวัติ' },
  { id: 'menu-footer', label: '11. เมนู Header & Footer', icon: LayoutGrid, color: '#64748b', desc: 'แถบประกาศ, เมนูนำทาง, ช่องทางติดต่อ' },
  { id: 'automation', label: '12. ระบบ Automation & Webhooks', icon: Sliders, color: '#475569', desc: 'แจ้งเตือน Discord, Lead แฟรนไชส์, ตั้งค่า SMTP' },
  { id: 'email-templates', label: '13. แม่แบบอีเมลตอบกลับ (Email Templates)', icon: Mail, color: '#0284c7', desc: 'แก้ไขข้อความตอบกลับลูกค้า, ใบเสนอราคาอัตโนมัติ' },
  { id: 'security', label: '14. ความปลอดภัย & จัดการแอดมิน', icon: ShieldCheck, color: '#be123c', desc: 'จัดการ Staff Roles, สิทธิ์เข้าถึง, รหัส Master' }
];

// Preset Roles for Fast Selection
export const ROLE_PRESETS = [
  {
    name: 'Super Administrator',
    desc: 'สิทธิ์เต็มทุกส่วนในระบบ',
    permissions: PERMISSION_TABS_LIST.map(t => t.id)
  },
  {
    name: 'ผู้จัดการงานแข่ง & ทัวร์นาเมนต์',
    desc: 'จัดการสายแข่ง, อนุมัติทีม, คำขอจัดงานแข่ง และภาพกิจกรรม',
    permissions: ['tourney-apps', 'arena-bookings', 'articles']
  },
  {
    name: 'ผู้ดูแลยอดขาย & แฟรนไชส์ Leads',
    desc: 'ดูยอดขาย ERP, จัดการแชทลูกค้า, ตอบรับ Lead แฟรนไชส์ และคำขอจัดงาน',
    permissions: ['erp-analytics', 'omnichannel-leads', 'arena-bookings']
  },
  {
    name: 'ช่างเทคนิค & จัดการสเปกคอม 3D',
    desc: 'กำหนดสเปกคอม, ราคาเครื่อง, และอุปกรณ์ 3D Studio',
    permissions: ['catalog', 'hardware-pricing']
  },
  {
    name: 'การตลาด, SEO & คอนเทนต์',
    desc: 'จัดการเครื่องมือ SEO, Meta Tags, กิจกรรมบทความ และเนื้อหาหน้าเว็บ',
    permissions: ['seo-tools', 'articles', 'sections', 'menu-footer']
  },
  {
    name: 'Custom Role (กำหนดสิทธิ์เอง)',
    desc: 'เลือกติ๊กสิทธิ์ตามต้องการ',
    permissions: []
  }
];

export default function AdminStaffRolesCMS({ currentAdmin = null }) {
  const { siteData, addAdminStaff, updateAdminStaff, deleteAdminStaff, toggleAdminStaffStatus, addAuditLog } = useSiteData();

  const staffList = siteData?.adminStaffList || [];

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null); // null = add new, id = edit
  const [showPinMap, setShowPinMap] = useState({});
  const [toastMsg, setToastMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    pin: '',
    roleTitle: 'Custom Role',
    permissions: ['tourney-apps'],
    status: 'active',
    avatarColor: '#2563eb'
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleOpenAdd = () => {
    setEditingStaffId(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      pin: Math.floor(100000 + Math.random() * 900000).toString(),
      roleTitle: 'ผู้จัดการงานแข่ง & ทัวร์นาเมนต์',
      permissions: ['tourney-apps', 'arena-bookings', 'articles'],
      status: 'active',
      avatarColor: '#2563eb'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (staff) => {
    setEditingStaffId(staff.id);
    setFormData({
      name: staff.name || '',
      username: staff.username || '',
      password: staff.password || '',
      pin: staff.pin || '123456',
      roleTitle: staff.roleTitle || 'Custom Role',
      permissions: staff.permissions || [],
      status: staff.status || 'active',
      avatarColor: staff.avatarColor || '#2563eb'
    });
    setShowModal(true);
  };

  const handlePresetSelect = (preset) => {
    setFormData(prev => ({
      ...prev,
      roleTitle: preset.name,
      permissions: [...preset.permissions]
    }));
  };

  const handleTogglePermission = (tabId) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(tabId);
      const newPerms = exists 
        ? prev.permissions.filter(p => p !== tabId)
        : [...prev.permissions, tabId];
      return {
        ...prev,
        permissions: newPerms
      };
    });
  };

  const handleSelectAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: PERMISSION_TABS_LIST.map(t => t.id)
    }));
  };

  const handleClearAllPermissions = () => {
    setFormData(prev => ({
      ...prev,
      permissions: []
    }));
  };

  const handleSaveStaff = (e) => {
    e?.preventDefault?.();
    if (!formData.name.trim() || !formData.username.trim() || !formData.password.trim()) {
      alert('กรุณากรอกชื่อ, Username และ Password ให้ครบถ้วน');
      return;
    }

    if (editingStaffId) {
      updateAdminStaff(editingStaffId, formData);
      showToast(`อัปเดตสิทธิ์และข้อมูลของ ${formData.name} สำเร็จ ✓`);
      if (typeof addAuditLog === 'function') {
        addAuditLog({
          action: 'UPDATE_ADMIN_STAFF',
          adminUser: currentAdmin?.username || 'admin',
          status: 'success',
          details: `แก้ไขสิทธิ์บัญชีแอดมิน: ${formData.username} (${formData.roleTitle})`
        });
      }
    } else {
      addAdminStaff(formData);
      showToast(`เพิ่มแอดมินคนใหม่ ${formData.name} สำเร็จแล้ว ✓`);
      if (typeof addAuditLog === 'function') {
        addAuditLog({
          action: 'ADD_ADMIN_STAFF',
          adminUser: currentAdmin?.username || 'admin',
          status: 'success',
          details: `เพิ่มบัญชีแอดมินใหม่: ${formData.username} (${formData.roleTitle}) เข้าสู่ระบบ`
        });
      }
    }

    setShowModal(false);
  };

  const handleDelete = (staff) => {
    if (staff.isMaster) {
      alert('ไม่สามารถลบบัญชี Master Owner สูงสุดได้');
      return;
    }
    if (window.confirm(`ต้องการลบบัญชีแอดมิน "${staff.name}" (@${staff.username}) ใช่หรือไม่?`)) {
      deleteAdminStaff(staff.id);
      showToast(`ลบบัญชีแอดมิน ${staff.name} เรียบร้อยแล้ว`);
      if (typeof addAuditLog === 'function') {
        addAuditLog({
          action: 'DELETE_ADMIN_STAFF',
          adminUser: currentAdmin?.username || 'admin',
          status: 'warning',
          details: `ลบบัญชีแอดมิน: ${staff.username}`
        });
      }
    }
  };

  const handleToggleStatus = (staff) => {
    if (staff.isMaster) return;
    toggleAdminStaffStatus(staff.id);
    const newStatus = staff.status === 'active' ? 'ระงับชั่วคราว' : 'เปิดใช้งาน';
    showToast(`เปลี่ยนสถานะของ ${staff.name} เป็น "${newStatus}" แล้ว`);
  };

  const togglePinVisibility = (id) => {
    setShowPinMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="admin-staff-roles-cms">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="cms-toast-floating-banner">
          <CheckCircle2 size={16} className="text-emerald" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="staff-roles-header-card glass-panel">
        <div className="header-left">
          <div className="badge-pill badge-blue" style={{ marginBottom: '8px' }}>
            <ShieldCheck size={14} />
            <span>ROLE-BASED ACCESS CONTROL (RBAC)</span>
          </div>
          <h3 className="staff-header-title">
            ระบบจัดการบัญชีแอดมิน & สิทธิ์การเข้าถึงแยกตาม Role
          </h3>
          <p className="staff-header-desc">
            กำหนดบทบาทเจ้าหน้าที่แต่ละแผนก (ผู้จัดการทัวร์นาเมนต์, ฝ่ายขายแฟรนไชส์, ช่างเทคนิค 3D, การตลาด & SEO) 
            พร้อมติ๊กเลือก Tab จัดการที่อนุญาตให้เห็นและแก้ไขได้อย่างปลอดภัย
          </p>
        </div>

        <div className="header-right">
          <button 
            type="button" 
            onClick={handleOpenAdd}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 20px', fontSize: '0.92rem' }}
          >
            <Plus size={16} />
            <span>เพิ่มแอดมินคนใหม่</span>
          </button>
        </div>
      </div>

      {/* Staff Accounts Grid */}
      <div className="staff-cards-grid">
        {staffList.map((staff) => {
          const isMaster = staff.isMaster;
          const isSuspended = staff.status === 'suspended';
          const isPinVisible = Boolean(showPinMap[staff.id]);

          // Calculate permitted tabs labels
          const permittedTabs = isMaster 
            ? PERMISSION_TABS_LIST 
            : PERMISSION_TABS_LIST.filter(t => (staff.permissions || []).includes(t.id));

          return (
            <div 
              key={staff.id} 
              className={`staff-account-card glass-panel ${isMaster ? 'master-card' : ''} ${isSuspended ? 'suspended-card' : ''}`}
            >
              <div className="staff-card-top">
                <div className="staff-avatar-box" style={{ background: staff.avatarColor || '#2563eb' }}>
                  {staff.name.slice(0, 1)}
                </div>

                <div className="staff-info-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <h4 className="staff-name">{staff.name}</h4>
                    {isMaster && (
                      <span className="badge-pill badge-gold" title="ผู้ดูแลระบบสูงสุด สิทธิ์เต็ม">
                        <Crown size={12} />
                        <span>MASTER OWNER</span>
                      </span>
                    )}
                  </div>
                  <span className="staff-username">@{staff.username}</span>
                  <div className="staff-role-badge">
                    <span>{staff.roleTitle || 'Custom Role'}</span>
                  </div>
                </div>

                <div className="staff-status-badge">
                  {isSuspended ? (
                    <span className="status-pill suspended">
                      <UserX size={12} />
                      <span>ระงับการใช้งาน</span>
                    </span>
                  ) : (
                    <span className="status-pill active">
                      <UserCheck size={12} />
                      <span>ใช้งานปกติ</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Login Credentials & PIN Preview */}
              <div className="staff-cred-row">
                <div className="cred-item">
                  <Key size={13} className="text-muted" />
                  <span className="cred-lbl">รหัส PIN 6 หลัก:</span>
                  <span className="cred-val monospace">
                    {isPinVisible ? (staff.pin || '998877') : '••••••'}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => togglePinVisibility(staff.id)}
                    className="btn-icon-ghost"
                    title={isPinVisible ? 'ซ่อน PIN' : 'ดู PIN'}
                  >
                    {isPinVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>

                <div className="cred-item">
                  <Lock size={13} className="text-muted" />
                  <span className="cred-lbl">รหัสผ่าน:</span>
                  <span className="cred-val monospace">••••••••</span>
                </div>
              </div>

              {/* Permitted Tabs Section */}
              <div className="staff-permissions-preview">
                <div className="perm-header">
                  <span className="perm-lbl">
                    สิทธิ์การเข้าถึง ({isMaster ? 'ทุก Tab' : `${permittedTabs.length} จาก ${PERMISSION_TABS_LIST.length} Tab`}):
                  </span>
                </div>

                <div className="perm-chips-wrap">
                  {isMaster ? (
                    <span className="perm-chip-all">
                      <Check size={12} />
                      <span>เข้าถึงได้ครบทุก 13 Tab ของศูนย์ควบคุม CMS</span>
                    </span>
                  ) : permittedTabs.length > 0 ? (
                    permittedTabs.map(tab => (
                      <span key={tab.id} className="perm-chip-item">
                        <tab.icon size={12} style={{ color: tab.color }} />
                        <span>{tab.label.split('.')[1]?.trim() || tab.label}</span>
                      </span>
                    ))
                  ) : (
                    <span className="perm-chip-none">
                      <AlertTriangle size={12} />
                      <span>ยังไม่ได้กำหนดสิทธิ์ใดๆ</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="staff-card-footer">
                <button 
                  type="button" 
                  onClick={() => handleOpenEdit(staff)}
                  className="btn-staff-action edit"
                  title="แก้ไขสิทธิ์และข้อมูลบัญชี"
                >
                  <Edit3 size={14} />
                  <span>แก้ไขสิทธิ์</span>
                </button>

                {!isMaster && (
                  <>
                    <button 
                      type="button" 
                      onClick={() => handleToggleStatus(staff)}
                      className={`btn-staff-action ${isSuspended ? 'resume' : 'suspend'}`}
                      title={isSuspended ? 'เปิดใช้งานบัญชี' : 'ระงับการใช้งานชั่วคราว'}
                    >
                      {isSuspended ? <UserCheck size={14} /> : <UserX size={14} />}
                      <span>{isSuspended ? 'ปลดระงับ' : 'ระงับชั่วคราว'}</span>
                    </button>

                    <button 
                      type="button" 
                      onClick={() => handleDelete(staff)}
                      className="btn-staff-action delete"
                      title="ลบบัญชีเจ้าหน้าที่นี้"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          MODAL: ADD / EDIT STAFF ACCOUNT & PERMISSIONS MATRIX
          ========================================================================= */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-dialog-box glass-panel staff-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="icon-badge-round" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="modal-title">
                    {editingStaffId ? 'แก้ไขข้อมูล & สิทธิ์ของเจ้าหน้าที่' : 'เพิ่มบัญชีแอดมินคนใหม่'}
                  </h3>
                  <p className="modal-subtitle">กำหนด Username, รหัสผ่าน, และติ๊กเลือก Tab ที่อนุญาตให้จัดการ</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="btn-close-modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="modal-body-scroll">
              
              {/* Account Basic Info */}
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label">ชื่อ-นามสกุล / ตำแหน่งผู้ดูแล *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="เช่น กิตติศักดิ์ (Esports Manager)"
                    className="form-input-text"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ชื่อบัญชีเข้าสู่ระบบ (Username) *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.trim().toLowerCase() }))}
                    placeholder="เช่น tourney_mod"
                    className="form-input-text monospace"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">รหัสผ่าน (Password) *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value.trim() }))}
                    placeholder="กำหนดรหัสผ่านอย่างน้อย 6 ตัวอักษร"
                    className="form-input-text monospace"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">รหัส PIN 6 หลัก เข้าถึงด่วน (Quick PIN) *</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    required
                    value={formData.pin}
                    onChange={(e) => setFormData(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '') }))}
                    placeholder="เช่น 112233"
                    className="form-input-text monospace"
                  />
                </div>
              </div>

              {/* Role Presets */}
              <div style={{ marginTop: '18px' }}>
                <label className="form-label">
                  <strong>เลือกบทบาทสำเร็จรูป (Role Presets):</strong>
                </label>
                <div className="presets-chips-row">
                  {ROLE_PRESETS.map((preset, idx) => (
                    <button 
                      key={idx}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`preset-chip-btn ${formData.roleTitle === preset.name ? 'active' : ''}`}
                    >
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <input 
                    type="text"
                    value={formData.roleTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, roleTitle: e.target.value }))}
                    placeholder="ชื่อ Role หรือแผนก"
                    className="form-input-text"
                    style={{ fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              {/* Permission Matrix with Checkboxes */}
              <div className="permissions-matrix-box" style={{ marginTop: '20px' }}>
                <div className="matrix-header-row">
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 650, color: '#0f172a' }}>
                      ติ๊กเลือกสิทธิ์ Tab จัดการที่อนุญาต (Permission Matrix):
                    </h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      แอดมินท่านนี้จะเห็นและเข้าถึงได้เฉพาะ Tab ที่มีเครื่องหมายถูกเท่านั้น
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      type="button" 
                      onClick={handleSelectAllPermissions}
                      className="btn-matrix-action"
                    >
                      <CheckSquare size={13} />
                      <span>เลือกทั้งหมด</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={handleClearAllPermissions}
                      className="btn-matrix-action"
                    >
                      <Square size={13} />
                      <span>ล้างทั้งหมด</span>
                    </button>
                  </div>
                </div>

                <div className="permission-items-grid">
                  {PERMISSION_TABS_LIST.map((tab) => {
                    const isChecked = formData.permissions.includes(tab.id);
                    return (
                      <label 
                        key={tab.id} 
                        className={`perm-checkbox-item ${isChecked ? 'checked' : ''}`}
                      >
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(tab.id)}
                        />
                        <div className="perm-checkbox-icon" style={{ color: tab.color }}>
                          <tab.icon size={16} />
                        </div>
                        <div className="perm-checkbox-label">
                          <strong>{tab.label}</strong>
                          <span>{tab.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="modal-footer-row" style={{ marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="btn-outline-sm"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px' }}
                >
                  <Save size={15} />
                  <span>{editingStaffId ? 'บันทึกการแก้ไข' : 'สร้างบัญชีแอดมิน'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
