import React, { useState } from 'react';
import { 
  MapPin, Phone, Mail, Navigation, Globe, Plus, Trash2, Edit3, 
  Eye, CheckCircle2, AlertCircle, Save, ExternalLink, RefreshCw, 
  ArrowUp, ArrowDown, Clock, Search, Filter, MessageSquare, 
  Send, Sparkles, Car, Train, Bus, HelpCircle, Check, X,
  ShieldCheck, Share2, Layers, Building2, User
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

// Transportation Icon Options
const TRANSPORT_ICON_OPTIONS = [
  { value: 'train', label: 'รถไฟฟ้า / รถไฟ (MRT / BTS / Train)', icon: Train },
  { value: 'car', label: 'รถยนต์ส่วนบุคคล / แท็กซี่ (Car)', icon: Car },
  { value: 'bus', label: 'รถโดยสารประจำทาง (Bus)', icon: Bus },
  { value: 'boat', label: 'เรือโดยสาร / ทางน้ำ (Boat)', icon: Navigation },
  { value: 'other', label: 'อื่นๆ / จุดสังเกต (Pin)', icon: MapPin }
];

const THEME_OPTIONS = [
  { value: 'yellow', label: 'เหลืองทอง (Yellow)', bg: '#fef9c3', text: '#854d0e', border: '#fef08a' },
  { value: 'blue', label: 'น้ำเงินฟ้า (Blue)', bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  { value: 'purple', label: 'ม่วงนีออน (Purple)', bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' },
  { value: 'emerald', label: 'เขียวมรกต (Emerald)', bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  { value: 'rose', label: 'ชมพูแดง (Rose)', bg: '#fff1f2', text: '#9f1239', border: '#fecdd3' }
];

export default function ContactPageCMS({ onNavigateToContact }) {
  const { 
    siteData, 
    updateContactPage,
    addTransportationItem,
    updateTransportationItem,
    deleteTransportationItem,
    reorderTransportationItems,
    addContactPerk,
    updateContactPerk,
    deleteContactPerk,
    updateFooter,
    addLead,
    updateLead,
    deleteLead,
    triggerSaveToast
  } = useSiteData();

  const contact = siteData?.contactPage || {};
  const footer = siteData?.footer || {};
  const leads = siteData?.leads || [];

  // Filter contact inquiries (from web contact form or type contact_inquiry)
  const contactInquiries = leads.filter(l => 
    l.channel === 'Web Contact Form' || 
    l.type === 'contact_inquiry' || 
    (l.inquiryRef && l.inquiryRef.startsWith('GLP-INQ')) ||
    (l.notes && l.notes.includes('[หัวข้อ:'))
  );

  // Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState('info'); // 'info' | 'transport' | 'perks' | 'inquiries'

  // Transportation Modal State
  const [transModalOpen, setTransModalOpen] = useState(false);
  const [editingTransId, setEditingTransId] = useState(null);
  const [transForm, setTransForm] = useState({
    type: 'train',
    title: '',
    desc: '',
    tag: '',
    theme: 'yellow',
    visible: true
  });

  // Perks State
  const [newPerkText, setNewPerkText] = useState('');
  const [editingPerkId, setEditingPerkId] = useState(null);
  const [editingPerkText, setEditingPerkText] = useState('');

  // Inquiries Modal State
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryFilterStatus, setInquiryFilterStatus] = useState('all');

  // Manual Inquiry Modal State
  const [manualInquiryModalOpen, setManualInquiryModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'สอบถามข้อมูลทั่วไป / อัตราค่าบริการ',
    message: '',
    stage: 'new',
    adminNotes: ''
  });

  // ==========================================
  // Transportation Handlers (Add / Edit / Delete)
  // ==========================================
  const handleOpenAddTransModal = () => {
    setEditingTransId(null);
    setTransForm({
      type: 'train',
      title: '',
      desc: '',
      tag: '',
      theme: 'yellow',
      visible: true
    });
    setTransModalOpen(true);
  };

  const handleOpenEditTransModal = (item) => {
    setEditingTransId(item.id);
    setTransForm({
      type: item.type || 'train',
      title: item.title || '',
      desc: item.desc || '',
      tag: item.tag || '',
      theme: item.theme || 'yellow',
      visible: item.visible !== false
    });
    setTransModalOpen(true);
  };

  const handleSaveTransModal = (e) => {
    e.preventDefault();
    if (!transForm.title.trim()) {
      alert('กรุณาระบุชื่อวิธีการเดินทาง');
      return;
    }

    if (editingTransId) {
      updateTransportationItem(editingTransId, transForm);
    } else {
      addTransportationItem(transForm);
    }

    setTransModalOpen(false);
    triggerSaveToast();
  };

  const handleDeleteTrans = (id, title) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบวิธีการเดินทาง "${title}"?`)) {
      deleteTransportationItem(id);
      triggerSaveToast();
    }
  };

  const handleMoveTrans = (index, direction) => {
    const targetIndex = index + direction;
    const items = contact.transportation || [];
    if (targetIndex < 0 || targetIndex >= items.length) return;
    reorderTransportationItems(index, targetIndex);
    triggerSaveToast();
  };

  // ==========================================
  // Perks Handlers (Add / Edit / Delete)
  // ==========================================
  const handleAddPerk = (e) => {
    e.preventDefault();
    if (!newPerkText.trim()) return;
    addContactPerk(newPerkText.trim());
    setNewPerkText('');
    triggerSaveToast();
  };

  const handleSaveEditPerk = (id) => {
    if (!editingPerkText.trim()) return;
    updateContactPerk(id, { text: editingPerkText.trim() });
    setEditingPerkId(null);
    setEditingPerkText('');
    triggerSaveToast();
  };

  const handleDeletePerk = (id, text) => {
    if (window.confirm(`ต้องการลบจุดเด่น "${text}" ใช่หรือไม่?`)) {
      deleteContactPerk(id);
      triggerSaveToast();
    }
  };

  // ==========================================
  // Inquiries Handlers (View / Add / Edit / Delete)
  // ==========================================
  const handleOpenInquiryDetails = (inquiry) => {
    setEditingInquiry({ ...inquiry });
    setInquiryModalOpen(true);
  };

  const handleUpdateInquiryStatus = (newStage) => {
    if (!editingInquiry) return;
    updateLead(editingInquiry.id, { 
      stage: newStage,
      status: newStage === 'resolved' ? 'Closed' : (newStage === 'contacted' ? 'Contacted' : 'New'),
      adminNotes: editingInquiry.adminNotes || ''
    });
    setEditingInquiry(prev => ({ ...prev, stage: newStage }));
    triggerSaveToast();
  };

  const handleSaveInquiryNotes = () => {
    if (!editingInquiry) return;
    updateLead(editingInquiry.id, { 
      adminNotes: editingInquiry.adminNotes || '',
      stage: editingInquiry.stage || 'new'
    });
    setInquiryModalOpen(false);
    triggerSaveToast();
  };

  const handleDeleteInquiry = (id, name) => {
    if (window.confirm(`ต้องการลบข้อความติดต่อจากคุณ "${name}" ใช่หรือไม่? (การกระทำนี้ไม่สามารถย้อนกลับได้)`)) {
      deleteLead(id);
      if (editingInquiry?.id === id) setInquiryModalOpen(false);
      triggerSaveToast();
    }
  };

  const handleSaveManualInquiry = (e) => {
    e.preventDefault();
    if (!manualForm.name.trim() || !manualForm.phone.trim()) {
      alert('กรุณากรอกชื่อและเบอร์โทรศัพท์');
      return;
    }

    const inquiryRef = `GLP-INQ-${Math.floor(100000 + Math.random() * 900000)}`;
    addLead({
      name: manualForm.name.trim(),
      phone: manualForm.phone.trim(),
      email: manualForm.email.trim(),
      subject: manualForm.subject,
      inquiryRef,
      channel: 'Web Contact Form (Manual Entry)',
      type: 'contact_inquiry',
      typeName: manualForm.subject,
      stage: manualForm.stage,
      status: manualForm.stage === 'resolved' ? 'Closed' : 'New',
      notes: `[หัวข้อ: ${manualForm.subject}] ${manualForm.message.trim() || 'บันทึกด้วยตนเอง'}`,
      adminNotes: manualForm.adminNotes.trim()
    });

    setManualInquiryModalOpen(false);
    setManualForm({
      name: '',
      phone: '',
      email: '',
      subject: 'สอบถามข้อมูลทั่วไป / อัตราค่าบริการ',
      message: '',
      stage: 'new',
      adminNotes: ''
    });
    triggerSaveToast();
  };

  // Filtered Inquiries
  const filteredInquiries = contactInquiries.filter(item => {
    const matchSearch = 
      (item.name || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
      (item.phone || '').includes(inquirySearch) ||
      (item.email || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
      (item.inquiryRef || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
      (item.subject || item.notes || '').toLowerCase().includes(inquirySearch.toLowerCase());

    const matchStatus = inquiryFilterStatus === 'all' || (item.stage || 'new') === inquiryFilterStatus;

    return matchSearch && matchStatus;
  });

  return (
    <div className="cms-panel-block contact-cms-container">
      {/* 1. Header Bar */}
      <div className="panel-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            <MapPin size={24} className="text-blue" />
            <span>15. จัดการหน้าติดต่อเรา & แผนที่ร้าน (Contact & Location CMS)</span>
          </h3>
          <p className="panel-desc" style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px' }}>
            เพิ่ม ลบ และแก้ไขข้อมูลที่อยู่ร้าน, แผนที่ Google Maps, ลิงก์โซเชียล, คู่มือการเดินทาง, ไฮไลต์บริการ และจัดการกล่องข้อความติดต่อจากลูกค้า
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
          >
            <Eye size={15} />
            <span>ดูหน้าติดต่อเรา (Live View)</span>
            <ExternalLink size={13} className="opacity-70" />
          </a>

          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={() => triggerSaveToast()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
          >
            <Save size={15} />
            <span>บันทึกการเปลี่ยนแปลงทั้งหมด</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Tabs Bar */}
      <div className="contact-subtab-nav" style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`template-tab-pill ${activeSubTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('info')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.92rem',
            background: activeSubTab === 'info' ? '#2563eb' : '#f1f5f9',
            color: activeSubTab === 'info' ? '#ffffff' : '#475569',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <MapPin size={17} />
          <span>01. ข้อมูลร้าน & พิกัดแผนที่ (Store Info & Maps)</span>
        </button>

        <button
          type="button"
          className={`template-tab-pill ${activeSubTab === 'transport' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('transport')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.92rem',
            background: activeSubTab === 'transport' ? '#2563eb' : '#f1f5f9',
            color: activeSubTab === 'transport' ? '#ffffff' : '#475569',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Navigation size={17} />
          <span>02. วิธีการเดินทาง ({(contact.transportation || []).length})</span>
        </button>

        <button
          type="button"
          className={`template-tab-pill ${activeSubTab === 'perks' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('perks')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.92rem',
            background: activeSubTab === 'perks' ? '#2563eb' : '#f1f5f9',
            color: activeSubTab === 'perks' ? '#ffffff' : '#475569',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Sparkles size={17} />
          <span>03. จุดเด่นและบริการ ({(contact.perks || []).length})</span>
        </button>

        <button
          type="button"
          className={`template-tab-pill ${activeSubTab === 'inquiries' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('inquiries')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.92rem',
            background: activeSubTab === 'inquiries' ? '#2563eb' : '#f1f5f9',
            color: activeSubTab === 'inquiries' ? '#ffffff' : '#475569',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <MessageSquare size={17} />
          <span>04. กล่องข้อความติดต่อ ({contactInquiries.length})</span>
        </button>
      </div>

      {/* =========================================================================
          SUB-TAB 1: STORE INFO & MAPS
          ========================================================================= */}
      {activeSubTab === 'info' && (
        <div className="contact-info-subtab">
          {/* Hero Banner Texts */}
          <div className="admin-subcard glass-panel">
            <div className="subcard-title">
              <Sparkles size={18} className="text-blue" />
              <strong>ส่วนหัวหน้าติดต่อเรา (Hero Banner Settings)</strong>
            </div>

            <div className="form-group">
              <label>ป้ายข้อความกำกับ (Badge Pill)</label>
              <input 
                type="text" 
                className="form-input" 
                value={contact.heroBadge || ''} 
                onChange={e => updateContactPage({ heroBadge: e.target.value })}
                placeholder="CONTACT & STORE LOCATION • 24/7 OPEN"
              />
            </div>

            <div className="form-group">
              <label>หัวข้อใหญ่ (Main Title)</label>
              <input 
                type="text" 
                className="form-input" 
                value={contact.heroTitle || ''} 
                onChange={e => updateContactPage({ heroTitle: e.target.value })}
                placeholder="ติดต่อเรา & แผนที่ร้าน GLP"
              />
            </div>

            <div className="form-group">
              <label>คำอธิบายย่อย (Hero Description)</label>
              <textarea 
                rows={2} 
                className="form-input" 
                value={contact.heroDesc || ''} 
                onChange={e => updateContactPage({ heroDesc: e.target.value })}
                placeholder="ศูนย์กีฬาอีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากล..."
              />
            </div>
          </div>

          {/* Store Location & Contacts */}
          <div className="admin-subcard glass-panel">
            <div className="subcard-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} className="text-blue" />
                <strong>ข้อมูลที่ตั้งร้าน & ช่องทางการติดต่อหลัก</strong>
              </div>
              <button 
                type="button" 
                className="btn-secondary btn-sm"
                onClick={() => {
                  updateContactPage({
                    storeAddress: footer.address || '',
                    storePhone: footer.phone || '',
                    storeEmail: footer.email || ''
                  });
                  triggerSaveToast();
                }}
                title="ดึงข้อมูลจาก Footer มาใส่ในหน้านี้"
              >
                <RefreshCw size={13} />
                <span>ซิงค์ข้อมูลจาก Footer</span>
              </button>
            </div>

            <div className="form-group">
              <label>ที่อยู่สาขาหลัก (Store Address)</label>
              <input 
                type="text" 
                className="form-input" 
                value={contact.storeAddress || footer.address || ''} 
                onChange={e => {
                  updateContactPage({ storeAddress: e.target.value });
                  updateFooter({ address: e.target.value });
                }}
                placeholder="79 ซอย ลาดพร้าว 112 แขวงพลับพลา เขตวังทองหลาง กทม. 10310"
              />
            </div>

            <div className="form-group">
              <label>คำแนะนำทำเลที่ตั้ง (Location Hint)</label>
              <input 
                type="text" 
                className="form-input" 
                value={contact.locationHint || ''} 
                onChange={e => updateContactPage({ locationHint: e.target.value })}
                placeholder="(ทำเลศักยภาพ เชื่อมต่อระหว่าง ซอยลาดพร้าว 112 และ ซอยรามคำแหง 53...)"
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>เบอร์โทรศัพท์สายด่วน 24 ชม. (Phone)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={contact.storePhone || footer.phone || ''} 
                  onChange={e => {
                    updateContactPage({ storePhone: e.target.value });
                    updateFooter({ phone: e.target.value });
                  }}
                  placeholder="063-793-7704"
                />
              </div>

              <div className="form-group">
                <label>อีเมลติดต่อ (Email)</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={contact.storeEmail || footer.email || ''} 
                  onChange={e => {
                    updateContactPage({ storeEmail: e.target.value });
                    updateFooter({ email: e.target.value });
                  }}
                  placeholder="gspeedlivingplus35@gmail.com"
                />
              </div>
            </div>
          </div>

          {/* Google Maps & Navigation */}
          <div className="admin-subcard glass-panel">
            <div className="subcard-title">
              <Navigation size={18} className="text-blue" />
              <strong>ระบบแผนที่ Google Maps & การนำทาง</strong>
            </div>

            <div className="form-group">
              <label>ลิงก์นำทาง Google Maps (Direct Navigation URL)</label>
              <input 
                type="url" 
                className="form-input font-mono" 
                value={contact.googleMapsDirectUrl || ''} 
                onChange={e => updateContactPage({ googleMapsDirectUrl: e.target.value })}
                placeholder="https://www.google.com/maps/search/?api=1&query=..."
              />
            </div>

            <div className="form-group">
              <label>Google Maps Iframe Embed URL (แผนที่ดาวเทียมในหน้าเว็บ)</label>
              <input 
                type="url" 
                className="form-input font-mono" 
                value={contact.googleMapsEmbedUrl || ''} 
                onChange={e => updateContactPage({ googleMapsEmbedUrl: e.target.value })}
                placeholder="https://maps.google.com/maps?q=...&output=embed"
              />
              <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                รองรับ URL สำหรับ iframe ของ Google Maps (เช่น <code>https://maps.google.com/maps?q=...&output=embed</code>)
              </span>
            </div>

            {/* Live Map Preview Frame */}
            <div style={{ marginTop: '16px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              <iframe
                title="Google Maps Location Preview"
                src={contact.googleMapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(contact.storeAddress || footer.address || '')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="260"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="admin-subcard glass-panel">
            <div className="subcard-title">
              <Share2 size={18} className="text-blue" />
              <strong>ช่องทางโซเชียลมีเดียหลัก (Social Media Channels)</strong>
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label>Facebook Page URL</label>
                <input 
                  type="url" 
                  className="form-input font-mono" 
                  value={contact.socialLinks?.facebook || footer.socialLinks?.facebook || ''} 
                  onChange={e => {
                    const newSocial = { ...(contact.socialLinks || {}), facebook: e.target.value };
                    updateContactPage({ socialLinks: newSocial });
                    updateFooter({ socialLinks: { ...(footer.socialLinks || {}), facebook: e.target.value } });
                  }}
                  placeholder="https://www.facebook.com/..."
                />
              </div>

              <div className="form-group">
                <label>TikTok Profile URL</label>
                <input 
                  type="url" 
                  className="form-input font-mono" 
                  value={contact.socialLinks?.tiktok || footer.socialLinks?.tiktok || ''} 
                  onChange={e => {
                    const newSocial = { ...(contact.socialLinks || {}), tiktok: e.target.value };
                    updateContactPage({ socialLinks: newSocial });
                    updateFooter({ socialLinks: { ...(footer.socialLinks || {}), tiktok: e.target.value } });
                  }}
                  placeholder="https://www.tiktok.com/@..."
                />
              </div>

              <div className="form-group">
                <label>Instagram URL</label>
                <input 
                  type="url" 
                  className="form-input font-mono" 
                  value={contact.socialLinks?.instagram || footer.socialLinks?.instagram || ''} 
                  onChange={e => {
                    const newSocial = { ...(contact.socialLinks || {}), instagram: e.target.value };
                    updateContactPage({ socialLinks: newSocial });
                    updateFooter({ socialLinks: { ...(footer.socialLinks || {}), instagram: e.target.value } });
                  }}
                  placeholder="https://www.instagram.com/..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: TRANSPORTATION GUIDE (ADD / EDIT / DELETE)
          ========================================================================= */}
      {activeSubTab === 'transport' && (
        <div className="contact-transport-subtab">
          <div className="admin-subcard glass-panel">
            <div className="subcard-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <strong style={{ fontSize: '1.15rem', color: '#0f172a' }}>คู่มือการเดินทางสู่ร้าน (Transportation Routes)</strong>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  สามารถเพิ่มเส้นทางใหม่ แก้ไขเส้นทางรถไฟฟ้า รถยนต์ รถประจำทาง หรือปรับเปลี่ยนธีมสีและสลับลำดับได้ตามต้องการ
                </p>
              </div>

              <button 
                type="button" 
                className="btn-primary btn-sm"
                onClick={handleOpenAddTransModal}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} />
                <span>เพิ่มวิธีการเดินทางใหม่</span>
              </button>
            </div>

            {/* List of Transportation Cards */}
            <div className="trans-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(contact.transportation || []).map((item, index) => {
                const themeInfo = THEME_OPTIONS.find(t => t.value === item.theme) || THEME_OPTIONS[0];
                return (
                  <div 
                    key={item.id} 
                    className="trans-edit-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: item.visible !== false ? '#ffffff' : '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      gap: '16px',
                      opacity: item.visible !== false ? 1 : 0.6,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                  >
                    {/* Left: Reorder & Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button 
                          type="button" 
                          onClick={() => handleMoveTrans(index, -1)}
                          disabled={index === 0}
                          style={{ border: 'none', background: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                          title="เลื่อนขึ้น"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleMoveTrans(index, 1)}
                          disabled={index === (contact.transportation || []).length - 1}
                          style={{ border: 'none', background: 'none', cursor: index === (contact.transportation || []).length - 1 ? 'not-allowed' : 'pointer', opacity: index === (contact.transportation || []).length - 1 ? 0.3 : 1 }}
                          title="เลื่อนลง"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>

                      {/* Theme Icon Box */}
                      <div 
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: themeInfo.bg,
                          color: themeInfo.text,
                          border: `1px solid ${themeInfo.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800
                        }}
                      >
                        {item.type === 'train' && <Train size={22} />}
                        {item.type === 'car' && <Car size={22} />}
                        {item.type === 'bus' && <Bus size={22} />}
                        {item.type === 'boat' && <Navigation size={22} />}
                        {item.type === 'other' && <MapPin size={22} />}
                      </div>

                      {/* Title & Desc */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{item.title}</strong>
                          {item.tag && (
                            <span 
                              style={{
                                fontSize: '0.72rem',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: themeInfo.bg,
                                color: themeInfo.text,
                                border: `1px solid ${themeInfo.border}`,
                                fontWeight: 600
                              }}
                            >
                              {item.tag}
                            </span>
                          )}
                          {item.visible === false && (
                            <span style={{ fontSize: '0.72rem', background: '#e2e8f0', color: '#64748b', padding: '2px 8px', borderRadius: '12px' }}>
                              ซ่อนชั่วคราว
                            </span>
                          )}
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#475569', lineHeight: '1.5' }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          updateTransportationItem(item.id, { visible: item.visible === false });
                          triggerSaveToast();
                        }}
                        className="btn-secondary btn-sm"
                        title={item.visible === false ? 'แสดงรายการนี้' : 'ซ่อนรายการนี้'}
                      >
                        {item.visible === false ? <Eye size={15} /> : <Eye size={15} className="text-blue" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditTransModal(item)}
                        className="btn-secondary btn-sm"
                        title="แก้ไขรายละเอียด"
                      >
                        <Edit3 size={15} />
                        <span>แก้ไข</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTrans(item.id, item.title)}
                        className="btn-trash-nav"
                        title="ลบรายการนี้"
                        style={{ padding: '8px', color: '#ef4444', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: STORE HIGHLIGHTS & PERKS (ADD / EDIT / DELETE)
          ========================================================================= */}
      {activeSubTab === 'perks' && (
        <div className="contact-perks-subtab">
          <div className="admin-subcard glass-panel">
            <div className="subcard-title">
              <Sparkles size={18} className="text-blue" />
              <strong>จุดเด่นและบริการหลักของร้าน (Store Perks & Key Highlights)</strong>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: '#64748b' }}>
              ข้อความจุดเด่น 4-6 ข้อที่ปรากฏข้างแบบฟอร์มส่งข้อความติดต่อ เช่น การเปิดบริการ 24 ชม., สเปกเน็ตเวิร์ก, กล้อง CCTV
            </p>

            {/* Add New Perk Form */}
            <form onSubmit={handleAddPerk} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input 
                type="text"
                className="form-input"
                placeholder="พิมพ์ข้อความจุดเด่นใหม่ เช่น ห้อง Bootcamp จอ 360Hz ส่วนตัว..."
                value={newPerkText}
                onChange={e => setNewPerkText(e.target.value)}
                style={{ flex: 1 }}
              />
              <button 
                type="submit" 
                className="btn-primary"
                disabled={!newPerkText.trim()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
              >
                <Plus size={16} />
                <span>เพิ่มจุดเด่น</span>
              </button>
            </form>

            {/* List of Perks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(contact.perks || []).map((perk, i) => (
                <div 
                  key={perk.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    background: perk.visible !== false ? '#ffffff' : '#f8fafc',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    {editingPerkId === perk.id ? (
                      <input 
                        type="text" 
                        className="form-input" 
                        value={editingPerkText}
                        onChange={e => setEditingPerkText(e.target.value)}
                        autoFocus
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <span style={{ fontSize: '0.92rem', color: perk.visible !== false ? '#0f172a' : '#94a3b8', fontWeight: 600 }}>
                        {perk.text}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {editingPerkId === perk.id ? (
                      <>
                        <button
                          type="button"
                          className="btn-primary btn-sm"
                          onClick={() => handleSaveEditPerk(perk.id)}
                          style={{ padding: '6px 12px' }}
                        >
                          <Check size={14} />
                          <span>บันทึก</span>
                        </button>
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => setEditingPerkId(null)}
                          style={{ padding: '6px 10px' }}
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => {
                            setEditingPerkId(perk.id);
                            setEditingPerkText(perk.text);
                          }}
                          style={{ padding: '6px 10px' }}
                          title="แก้ไขข้อความ"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            updateContactPerk(perk.id, { visible: perk.visible === false });
                            triggerSaveToast();
                          }}
                          className="btn-secondary btn-sm"
                          style={{ padding: '6px 10px' }}
                          title={perk.visible === false ? 'แสดงข้อความนี้' : 'ซ่อนข้อความนี้'}
                        >
                          <Eye size={14} className={perk.visible !== false ? 'text-blue' : 'text-muted'} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePerk(perk.id, perk.text)}
                          style={{ padding: '6px 10px', color: '#ef4444', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer' }}
                          title="ลบจุดเด่นนี้"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: CUSTOMER INQUIRIES INBOX (VIEW / ADD / EDIT / DELETE)
          ========================================================================= */}
      {activeSubTab === 'inquiries' && (
        <div className="contact-inquiries-subtab">
          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>ข้อความติดต่อทั้งหมด</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{contactInquiries.length}</div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: 600 }}>คำขอใหม่ (New)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>
                {contactInquiries.filter(i => (i.stage || 'new') === 'new').length}
              </div>
            </div>

            <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#854d0e', fontWeight: 600 }}>ติดต่อกลับแล้ว (Contacted)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ca8a04', marginTop: '4px' }}>
                {contactInquiries.filter(i => i.stage === 'contacted').length}
              </div>
            </div>

            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 600 }}>เสร็จสิ้น (Resolved)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                {contactInquiries.filter(i => i.stage === 'resolved').length}
              </div>
            </div>
          </div>

          {/* Search, Filter & Add Manual Action */}
          <div className="admin-subcard glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input 
                    type="text"
                    className="form-input"
                    placeholder="ค้นหาชื่อ, เบอร์โทร, อีเมล, รหัสคำขอ GLP-INQ..."
                    value={inquirySearch}
                    onChange={e => setInquirySearch(e.target.value)}
                    style={{ paddingLeft: '36px' }}
                  />
                </div>

                <select 
                  className="form-input" 
                  value={inquiryFilterStatus} 
                  onChange={e => setInquiryFilterStatus(e.target.value)}
                  style={{ width: '160px' }}
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="new">ใหม่ (New)</option>
                  <option value="contacted">ติดต่อแล้ว (Contacted)</option>
                  <option value="resolved">เสร็จสิ้น (Resolved)</option>
                </select>
              </div>

              <button 
                type="button" 
                className="btn-primary"
                onClick={() => setManualInquiryModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} />
                <span>+ บันทึกข้อความติดต่อใหม่</span>
              </button>
            </div>

            {/* Inquiries Table */}
            {filteredInquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                <MessageSquare size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <p>ยังไม่มีข้อความติดต่อที่ตรงกับเงื่อนไขการค้นหา</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '12px 14px' }}>รหัสคำขอ & วันที่</th>
                      <th style={{ padding: '12px 14px' }}>ผู้ติดต่อ</th>
                      <th style={{ padding: '12px 14px' }}>เรื่องที่ติดต่อ</th>
                      <th style={{ padding: '12px 14px' }}>ข้อความเบื้องต้น</th>
                      <th style={{ padding: '12px 14px' }}>สถานะ</th>
                      <th style={{ padding: '12px 14px', textAlign: 'center' }}>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>
                            {item.inquiryRef || item.id}
                          </strong>
                          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                            {item.createdAt || 'ไม่ระบุเวลา'}
                          </div>
                        </td>

                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <strong style={{ color: '#0f172a' }}>{item.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                            <a href={`tel:${item.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{item.phone}</a>
                          </div>
                          {item.email && (
                            <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                              <a href={`mailto:${item.email}`} style={{ color: '#64748b' }}>{item.email}</a>
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <span 
                            style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              border: '1px solid #bfdbfe'
                            }}
                          >
                            {item.subject || item.typeName || 'สอบถามทั่วไป'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 14px', verticalAlign: 'top', maxWidth: '240px' }}>
                          <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#334155' }}>
                            {item.notes ? item.notes.replace(/\[หัวข้อ:[^\]]+\]\s*/, '') : '-'}
                          </p>
                          {item.adminNotes && (
                            <div style={{ fontSize: '0.72rem', color: '#d97706', marginTop: '2px' }}>
                              <strong>โน้ต:</strong> {item.adminNotes}
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '12px 14px', verticalAlign: 'top' }}>
                          <span 
                            className={`status-pill ${
                              (item.stage || 'new') === 'new' ? 'status-pill-info' :
                              item.stage === 'contacted' ? 'status-pill-warning' : 'status-pill-success'
                            }`}
                            style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}
                          >
                            {(item.stage || 'new') === 'new' ? 'ใหม่' :
                             item.stage === 'contacted' ? 'ติดต่อแล้ว' : 'เสร็จสิ้น'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'top' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => handleOpenInquiryDetails(item)}
                              title="ดูรายละเอียด & บันทึกโน้ต"
                              style={{ padding: '6px 10px' }}
                            >
                              <Edit3 size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteInquiry(item.id, item.name)}
                              style={{ padding: '6px 10px', color: '#ef4444', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer' }}
                              title="ลบข้อความนี้"
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
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT TRANSPORTATION ROUTE
          ========================================================================= */}
      {transModalOpen && (
        <div className="modal-backdrop-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="modal-content-card" style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '540px', width: '100%', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {editingTransId ? 'แก้ไขวิธีการเดินทาง' : 'เพิ่มวิธีการเดินทางใหม่'}
              </h3>
              <button type="button" onClick={() => setTransModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTransModal}>
              <div className="form-group">
                <label>ประเภทไอคอนพาหนะ</label>
                <select 
                  className="form-input"
                  value={transForm.type}
                  onChange={e => setTransForm({ ...transForm, type: e.target.value })}
                >
                  {TRANSPORT_ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>ธีมสีไอคอน & ป้ายกำกับ</label>
                <select 
                  className="form-input"
                  value={transForm.theme}
                  onChange={e => setTransForm({ ...transForm, theme: e.target.value })}
                >
                  {THEME_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>ชื่อวิธีการเดินทาง (Title) *</label>
                <input 
                  type="text" 
                  required
                  className="form-input"
                  placeholder="เช่น รถไฟฟ้า MRT สายสีเหลือง, รถยนต์ส่วนบุคคล"
                  value={transForm.title}
                  onChange={e => setTransForm({ ...transForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>ป้ายกำกับข้อความ (Tag Badge)</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="เช่น แนะนำสำหรับผู้ใช้รถไฟฟ้า, มีที่จอดรถรองรับ"
                  value={transForm.tag}
                  onChange={e => setTransForm({ ...transForm, tag: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>รายละเอียดเส้นทางและการเดินทาง (Description) *</label>
                <textarea 
                  rows={4} 
                  required
                  className="form-input"
                  placeholder="ระบุสถานีที่ลง, ซอยทางเข้า, สายรถเมล์, ระยะเวลาเดิน หรือจุดจอดรถ..."
                  value={transForm.desc}
                  onChange={e => setTransForm({ ...transForm, desc: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    checked={transForm.visible}
                    onChange={e => setTransForm({ ...transForm, visible: e.target.checked })}
                  />
                  <span>เปิดแสดงผลในหน้าเว็บ</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setTransModalOpen(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn-primary">
                  {editingTransId ? 'บันทึกการแก้ไข' : 'เพิ่มรายการ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: INQUIRY DETAILS & INTERNAL NOTES
          ========================================================================= */}
      {inquiryModalOpen && editingInquiry && (
        <div className="modal-backdrop-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="modal-content-card" style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '580px', width: '100%', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 800, fontFamily: 'monospace' }}>
                  {editingInquiry.inquiryRef || editingInquiry.id}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
                  รายละเอียดข้อความติดต่อ: {editingInquiry.name}
                </h3>
              </div>
              <button type="button" onClick={() => setInquiryModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '16px', marginBottom: '18px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.86rem', marginBottom: '12px' }}>
                <div><strong>เบอร์โทร:</strong> <a href={`tel:${editingInquiry.phone}`} className="text-blue">{editingInquiry.phone}</a></div>
                <div><strong>อีเมล:</strong> {editingInquiry.email ? <a href={`mailto:${editingInquiry.email}`} className="text-blue">{editingInquiry.email}</a> : 'ไม่ได้ระบุ'}</div>
                <div><strong>วันที่ส่ง:</strong> {editingInquiry.createdAt || 'ไม่ระบุ'}</div>
                <div><strong>เรื่อง:</strong> {editingInquiry.subject || editingInquiry.typeName || 'ทั่วไป'}</div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                <strong>ข้อความจากลูกค้า:</strong>
                <p style={{ margin: '6px 0 0', whiteSpace: 'pre-wrap' }}>
                  {editingInquiry.notes ? editingInquiry.notes.replace(/\[หัวข้อ:[^\]]+\]\s*/, '') : 'ไม่มีข้อความ'}
                </p>
              </div>
            </div>

            {/* Status Selector */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>สถานะการดำเนินการ (Status)</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {[
                  { value: 'new', label: 'ใหม่ (New)', bg: '#eff6ff', color: '#1d4ed8' },
                  { value: 'contacted', label: 'ติดต่อกลับแล้ว (Contacted)', bg: '#fefce8', color: '#854d0e' },
                  { value: 'resolved', label: 'ปิดเคสเรียบร้อย (Resolved)', bg: '#ecfdf5', color: '#065f46' }
                ].map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => handleUpdateInquiryStatus(s.value)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: editingInquiry.stage === s.value ? `2px solid ${s.color}` : '1px solid #cbd5e1',
                      background: editingInquiry.stage === s.value ? s.bg : '#ffffff',
                      color: editingInquiry.stage === s.value ? s.color : '#64748b'
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Notes */}
            <div className="form-group">
              <label>บันทึกภายในของแอดมิน (Internal Staff Notes)</label>
              <textarea 
                rows={3}
                className="form-input"
                placeholder="ระบุข้อความโน้ต เช่น โทรติดต่อแล้ว นัดหมายเข้ามาดูสถานที่วันเสาร์นี้..."
                value={editingInquiry.adminNotes || ''}
                onChange={e => setEditingInquiry({ ...editingInquiry, adminNotes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
              <button 
                type="button" 
                onClick={() => handleDeleteInquiry(editingInquiry.id, editingInquiry.name)}
                style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                ลบรายการนี้
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setInquiryModalOpen(false)}>
                  ปิด
                </button>
                <button type="button" className="btn-primary" onClick={handleSaveInquiryNotes}>
                  บันทึกโน้ต
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD MANUAL INQUIRY
          ========================================================================= */}
      {manualInquiryModalOpen && (
        <div className="modal-backdrop-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="modal-content-card" style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '540px', width: '100%', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                บันทึกข้อความติดต่อใหม่ด้วยตนเอง (Manual Entry)
              </h3>
              <button type="button" onClick={() => setManualInquiryModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveManualInquiry}>
              <div className="form-group">
                <label>ชื่อผู้ติดต่อ *</label>
                <input 
                  type="text" 
                  required
                  className="form-input"
                  placeholder="เช่น คุณกิตติศักดิ์ พรหมวารี"
                  value={manualForm.name}
                  onChange={e => setManualForm({ ...manualForm, name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>เบอร์โทรศัพท์ *</label>
                  <input 
                    type="tel" 
                    required
                    className="form-input"
                    placeholder="08X-XXX-XXXX"
                    value={manualForm.phone}
                    onChange={e => setManualForm({ ...manualForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>อีเมล</label>
                  <input 
                    type="email" 
                    className="form-input"
                    placeholder="customer@example.com"
                    value={manualForm.email}
                    onChange={e => setManualForm({ ...manualForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>เรื่องที่ติดต่อ</label>
                <select 
                  className="form-input"
                  value={manualForm.subject}
                  onChange={e => setManualForm({ ...manualForm, subject: e.target.value })}
                >
                  <option value="สอบถามข้อมูลทั่วไป / อัตราค่าบริการ">สอบถามข้อมูลทั่วไป / อัตราค่าบริการ</option>
                  <option value="ติดต่อจัดการแข่งขันอีสปอร์ต / เช่าสถานที่">ติดต่อจัดการแข่งขันอีสปอร์ต / เช่าสถานที่</option>
                  <option value="จองห้อง VIP Bootcamp ซ้อมทีม">จองห้อง VIP Bootcamp ซ้อมทีม</option>
                  <option value="สนใจร่วมลงทุนแฟรนไชส์ร้านเกม">สนใจร่วมลงทุนแฟรนไชส์ร้านเกม</option>
                  <option value="ติดต่อโฆษณา / สปอนเซอร์กิจกรรม">ติดต่อโฆษณา / สปอนเซอร์กิจกรรม</option>
                  <option value="เรื่องอื่นๆ">เรื่องอื่นๆ</option>
                </select>
              </div>

              <div className="form-group">
                <label>รายละเอียดข้อความ</label>
                <textarea 
                  rows={3} 
                  className="form-input"
                  placeholder="ระบุข้อความที่ลูกค้าต้องการสอบถาม..."
                  value={manualForm.message}
                  onChange={e => setManualForm({ ...manualForm, message: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>บันทึกช่วยจำของแอดมิน (Admin Notes)</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="เช่น ลูกค้าโทรเข้ามาสอบถาม..."
                  value={manualForm.adminNotes}
                  onChange={e => setManualForm({ ...manualForm, adminNotes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" onClick={() => setManualInquiryModalOpen(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn-primary">
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
