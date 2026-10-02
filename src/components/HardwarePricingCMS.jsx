import React, { useState, useEffect } from 'react';
import { 
  Cpu, Zap, Layers, Monitor, Gamepad2, Plus, Trash2, Edit3, 
  Save, RefreshCw, CheckCircle2, Server, Network, 
  CreditCard, Award, Info, 
  Armchair, Sparkles, Sliders, Palette, X, Check,
  HardDrive, ShieldCheck, Box, Camera, Upload, Image as ImageIcon, Eye, AlertTriangle
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { 
  HARDWARE_TIERS as DEFAULT_TIERS, 
  FIXED_INFRASTRUCTURE as DEFAULT_INFRA,
  INTERIOR_THEMES as DEFAULT_THEMES 
} from '../data/mockData';
import { compressAndConvertToWebP } from '../utils/imageOptimizer';

export default function HardwarePricingCMS() {
  const { 
    siteData, 
    updateHardwareTier, 
    addHardwareTier, 
    deleteHardwareTier, 
    resetHardwareTiers, 
    updateFixedInfrastructure, 
    resetFixedInfrastructure, 
    updateCatalogItemCost,
    updateCatalogItem,
    updateInteriorTheme,
    addInteriorTheme,
    deleteInteriorTheme,
    resetInteriorThemes
  } = useSiteData();

  const [activeSubTab, setActiveSubTab] = useState('specs'); // 'specs' | 'infrastructure' | 'desks' | 'themes'
  const [successToast, setSuccessToast] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const resolveImageSrc = (img) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.dataUrl) return img.dataUrl;
    return '';
  };

  const handleSubTabChange = (tabKey) => {
    setActiveSubTab(tabKey);
    const panel = document.querySelector('.hardware-pricing-cms') || document.querySelector('.hardware-pricing-subtabs');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // ---------------------------------------------------------------------------
  // 1. HARDWARE SPECS (TIERS & MODELS)
  // ---------------------------------------------------------------------------
  const hardwareTiers = siteData?.hardwareTiers || DEFAULT_TIERS;
  const [editingTierId, setEditingTierId] = useState(null);
  const [tierEditForm, setTierEditForm] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTierForm, setNewTierForm] = useState({
    id: '',
    name: 'สเปกคอมรุ่นใหม่: Custom Model',
    tagline: 'สเปกเกมมิ่งประสิทธิภาพสูงสำหรับร้านเกมอีสปอร์ต',
    unitCost: 55000,
    image: '',
    cpu: 'Intel Core i7-14700F / AMD Ryzen 7 7800X3D',
    gpu: 'NVIDIA GeForce RTX 4070 SUPER 12GB',
    ram: '32GB DDR5 6000MHz RGB Dual Channel',
    storage: '1TB NVMe M.2 PCIe 4.0 / Diskless 10G Ready',
    psu: '750W 80+ Gold Fully Modular',
    caseCooling: 'Panoramic RGB Gaming Case + 240mm Liquid Cooler',
    mainboard: 'B760 / B650 Gaming Wi-Fi DDR5',
    monitor: '27" Fast-IPS 280Hz - 360Hz 0.5ms',
    gear: 'Custom Mechanical Keyboard + Gaming Mouse 4K/8K + Headset 7.1',
    warranty: 'รับประกัน 3 ปี On-site Service 24 ชม.'
  });

  const handleTierImageUpload = async (e, isEditing = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const optimizedWebP = await compressAndConvertToWebP(file, {
        maxWidth: 900,
        maxHeight: 600,
        quality: 0.85
      });

      const imageUrl = optimizedWebP?.dataUrl || (typeof optimizedWebP === 'string' ? optimizedWebP : '');

      if (isEditing) {
        setTierEditForm(prev => ({ ...prev, image: imageUrl }));
      } else {
        setNewTierForm(prev => ({ ...prev, image: imageUrl }));
      }
      showToast('อัปโหลดและบีบอัดรูปภาพ WebP เรียบร้อย');
    } catch (err) {
      console.error('Tier image upload failed:', err);
      alert('ไม่สามารถอัปโหลดรูปภาพได้ กรุณาตรวจสอบไฟล์รูปภาพอีกครั้ง');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleStartEditTier = (id, tier) => {
    setEditingTierId(id);
    setTierEditForm({
      name: tier.name || '',
      tagline: tier.tagline || '',
      unitCost: tier.unitCost || 45000,
      image: resolveImageSrc(tier.image),
      cpu: tier.cpu || '',
      gpu: tier.gpu || '',
      ram: tier.ram || '',
      storage: tier.storage || '',
      psu: tier.psu || '',
      caseCooling: tier.caseCooling || '',
      mainboard: tier.mainboard || '',
      monitor: tier.monitor || '',
      gear: tier.gear || '',
      warranty: tier.warranty || ''
    });
  };

  const handleSaveTier = (id) => {
    updateHardwareTier(id, {
      ...tierEditForm,
      image: resolveImageSrc(tierEditForm.image),
      unitCost: Number(tierEditForm.unitCost) || 0
    });
    setEditingTierId(null);
    showToast(`บันทึกสเปก "${tierEditForm.name}" เรียบร้อยแล้ว (อัปเดตและบันทึกอัตโนมัติ)`);
  };

  const handleAddNewTier = (e) => {
    e.preventDefault();
    const idKey = (newTierForm.id.trim() || `tier-${Date.now()}`).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    addHardwareTier({
      ...newTierForm,
      id: idKey,
      image: resolveImageSrc(newTierForm.image),
      unitCost: Number(newTierForm.unitCost) || 0
    });
    setShowAddModal(false);
    setNewTierForm({
      id: '',
      name: 'สเปกคอมรุ่นใหม่: Custom Model',
      tagline: 'สเปกเกมมิ่งประสิทธิภาพสูงสำหรับร้านเกมอีสปอร์ต',
      unitCost: 55000,
      image: '',
      cpu: 'Intel Core i7-14700F / AMD Ryzen 7 7800X3D',
      gpu: 'NVIDIA GeForce RTX 4070 SUPER 12GB',
      ram: '32GB DDR5 6000MHz RGB Dual Channel',
      storage: '1TB NVMe M.2 PCIe 4.0 / Diskless 10G Ready',
      psu: '750W 80+ Gold Fully Modular',
      caseCooling: 'Panoramic RGB Gaming Case + 240mm Liquid Cooler',
      mainboard: 'B760 / B650 Gaming Wi-Fi DDR5',
      monitor: '27" Fast-IPS 280Hz - 360Hz 0.5ms',
      gear: 'Custom Mechanical Keyboard + Gaming Mouse 4K/8K + Headset 7.1',
      warranty: 'รับประกัน 3 ปี On-site Service 24 ชม.'
    });
    showToast(`เพิ่มรุ่นสเปกคอมพิวเตอร์ใหม่ "${idKey}" เรียบร้อยแล้ว`);
  };

  const handleDeleteTier = (id, name) => {
    const tierKeys = Object.keys(hardwareTiers);
    if (tierKeys.length <= 1) {
      alert('ไม่สามารถลบได้: ระบบต้องมีรุ่นสเปกคอมพิวเตอร์อย่างน้อย 1 รุ่นสำหรับโปรแกรมคำนวณและแปลนร้าน');
      return;
    }
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรุ่นสเปก "${name}" (ID: ${id}) ออกจากระบบ?`)) {
      deleteHardwareTier(id);
      showToast(`ลบสเปก "${name}" ออกจากระบบแล้ว (บันทึกอัตโนมัติ)`);
    }
  };

  const handleResetTiers = () => {
    if (window.confirm('ต้องการรีเซ็ตระดับสเปกคอมพิวเตอร์ทั้งหมดกลับเป็นค่ามาตรฐานเริ่มต้น (Standard, Pro, Ultimate, คอมรุ่น 001) หรือไม่?')) {
      resetHardwareTiers();
      showToast('รีเซ็ตสเปกคอมพิวเตอร์เป็นค่าเริ่มต้นเรียบร้อยแล้ว');
    }
  };

  // ---------------------------------------------------------------------------
  // 2. FIXED INFRASTRUCTURE & LICENSING
  // ---------------------------------------------------------------------------
  const fixedInfra = siteData?.fixedInfrastructure || DEFAULT_INFRA;
  const [infraForm, setInfraForm] = useState({ ...fixedInfra });

  // Sync if context updates
  React.useEffect(() => {
    if (siteData?.fixedInfrastructure) {
      setInfraForm({ ...siteData.fixedInfrastructure });
    }
  }, [siteData?.fixedInfrastructure]);

  const handleSaveInfra = (e) => {
    e.preventDefault();
    updateFixedInfrastructure({
      disklessServer: Number(infraForm.disklessServer) || 0,
      networkEnterprise: Number(infraForm.networkEnterprise) || 0,
      billingAndPOS: Number(infraForm.billingAndPOS) || 0,
      franchiseFee: Number(infraForm.franchiseFee) || 0,
      interiorSqMeterCost: Number(infraForm.interiorSqMeterCost) || 0,
      airconSqMeterCost: Number(infraForm.airconSqMeterCost) || 0
    });
    showToast('บันทึกราคาโครงสร้างพื้นฐานและงานระบบเรียบร้อยแล้ว');
  };

  const handleResetInfra = () => {
    if (window.confirm('ต้องการรีเซ็ตราคาโครงสร้างพื้นฐานกลับเป็นค่ามาตรฐานหรือไม่?')) {
      resetFixedInfrastructure();
      setInfraForm({ ...DEFAULT_INFRA });
      showToast('รีเซ็ตราคาโครงสร้างพื้นฐานสำเร็จ');
    }
  };

  // ---------------------------------------------------------------------------
  // 3. DESK SETS & FURNITURE PRICING (Chairs bundled with desks)
  // ---------------------------------------------------------------------------
  const catalogItems = siteData?.catalogItems || [];
  const deskModules = catalogItems.filter(item => 
    item.type.includes('pc-') || item.type.includes('vip-') || item.type.includes('counter') || item.type.includes('cafe') || item.type.includes('server')
  );

  const [deskCosts, setDeskCosts] = useState({});
  const handleDeskCostChange = (id, cost) => {
    setDeskCosts(prev => ({ ...prev, [id]: cost }));
  };

  const handleSaveDeskCost = (id) => {
    const cost = deskCosts[id];
    if (cost !== undefined) {
      updateCatalogItemCost(id, cost);
      showToast('อัปเดตราคาชุดโต๊ะคอม/โมดูลเรียบร้อยแล้ว');
    }
  };

  const [editingCatalogItem, setEditingCatalogItem] = useState(null);
  const [catalogEditForm, setCatalogEditForm] = useState({});
  const [uploadingCatalogImage, setUploadingCatalogImage] = useState(false);

  const handleStartEditCatalogItem = (item) => {
    setEditingCatalogItem(item);
    setCatalogEditForm({
      name: item.name || '',
      baseCost: item.baseCost || 0,
      image: resolveImageSrc(item.image),
      width: item.width || 1,
      height: item.height || 1,
      realWorldHeight: item.realWorldHeight || 0.75,
      stationCount: item.stationCount || 0,
      material: item.material || '',
      warranty: item.warranty || '',
      weightNote: item.weightNote || ''
    });
  };

  const handleCatalogImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCatalogImage(true);
    try {
      const optimizedWebP = await compressAndConvertToWebP(file, {
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.85
      });
      const imageUrl = optimizedWebP?.dataUrl || (typeof optimizedWebP === 'string' ? optimizedWebP : '');
      setCatalogEditForm(prev => ({ ...prev, image: imageUrl }));
      showToast('อัปโหลดรูปภาพอุปกรณ์ WebP เรียบร้อย');
    } catch (err) {
      alert('ไม่สามารถอัปโหลดรูปภาพได้');
    } finally {
      setUploadingCatalogImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveCatalogItem = () => {
    if (!editingCatalogItem) return;
    updateCatalogItem({
      ...editingCatalogItem,
      ...catalogEditForm,
      image: resolveImageSrc(catalogEditForm.image),
      baseCost: Number(catalogEditForm.baseCost) || 0,
      stationCount: Number(catalogEditForm.stationCount) || 0,
      width: Number(catalogEditForm.width) || editingCatalogItem.width,
      height: Number(catalogEditForm.height) || editingCatalogItem.height,
      realWorldHeight: Number(catalogEditForm.realWorldHeight) || editingCatalogItem.realWorldHeight
    });
    setEditingCatalogItem(null);
    showToast(`บันทึกข้อมูลและรูปภาพ "${catalogEditForm.name}" เรียบร้อยแล้ว`);
  };

  // ---------------------------------------------------------------------------
  // 4. INTERIOR STYLE THEMES (DECORATION THEMES)
  // ---------------------------------------------------------------------------
  const interiorThemes = siteData?.interiorThemes || DEFAULT_THEMES;
  const [editingThemeId, setEditingThemeId] = useState(null);
  const [themeEditForm, setThemeEditForm] = useState({});
  const [showAddThemeModal, setShowAddThemeModal] = useState(false);
  const [newThemeForm, setNewThemeForm] = useState({
    id: '',
    name: '',
    badge: 'Official Standard',
    badgeType: 'blue',
    tagline: '',
    description: '',
    lighting: '',
    acoustic: '',
    primaryColor: '#1d4ed8'
  });

  const handleStartEditTheme = (theme) => {
    setEditingThemeId(theme.id);
    setThemeEditForm({
      name: theme.name || '',
      badge: theme.badge || '',
      badgeType: theme.badgeType || 'blue',
      tagline: theme.tagline || '',
      description: theme.description || '',
      lighting: theme.lighting || '',
      acoustic: theme.acoustic || '',
      primaryColor: theme.palette?.[0]?.hex || '#1d4ed8'
    });
  };

  const handleSaveTheme = (id) => {
    const currentTheme = interiorThemes.find(t => t.id === id);
    const newPalette = currentTheme?.palette && currentTheme.palette.length > 0 
      ? [...currentTheme.palette] 
      : [{ name: 'Primary Accent', hex: themeEditForm.primaryColor }];
    if (newPalette[0]) {
      newPalette[0] = { ...newPalette[0], hex: themeEditForm.primaryColor };
    }
    updateInteriorTheme(id, {
      ...themeEditForm,
      palette: newPalette
    });
    setEditingThemeId(null);
    showToast(`อัปเดตธีม "${themeEditForm.name}" เรียบร้อยแล้ว`);
  };

  const handleCreateTheme = (e) => {
    e.preventDefault();
    if (!newThemeForm.name.trim()) return;
    const id = (newThemeForm.id.trim() || `theme-${Date.now()}`).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const createdTheme = {
      id,
      name: newThemeForm.name.trim(),
      badge: newThemeForm.badge || 'Custom Style',
      badgeType: newThemeForm.badgeType || 'blue',
      tagline: newThemeForm.tagline || '',
      description: newThemeForm.description || '',
      lighting: newThemeForm.lighting || 'ไฟ LED แบรนด์ GLP Dual-Tone สบายตา',
      acoustic: newThemeForm.acoustic || 'แผงซับเสียง Acoustic Foam ตัดเสียงก้อง 65%',
      palette: [
        { name: 'Primary Color', hex: newThemeForm.primaryColor || '#1d4ed8' },
        { name: 'Pure White', hex: '#ffffff' },
        { name: 'Dark Slate', hex: '#0f172a' }
      ]
    };
    addInteriorTheme(createdTheme);
    setShowAddThemeModal(false);
    setNewThemeForm({
      id: '',
      name: '',
      badge: 'Official Standard',
      badgeType: 'blue',
      tagline: '',
      description: '',
      lighting: '',
      acoustic: '',
      primaryColor: '#1d4ed8'
    });
    showToast(`เพิ่มธีม "${createdTheme.name}" เรียบร้อยแล้ว`);
  };

  const handleDeleteTheme = (theme) => {
    if (interiorThemes.length <= 1) {
      alert('ต้องมีธีมตกแต่งร้านอย่างน้อย 1 แบบในระบบ');
      return;
    }
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบธีม "${theme.name}"?`)) {
      deleteInteriorTheme(theme.id);
      showToast(`ลบธีม "${theme.name}" เรียบร้อยแล้ว`);
    }
  };

  const handleResetThemes = () => {
    if (window.confirm('คุณต้องการรีเซ็ตธีมตกแต่งร้านทั้งหมดกลับเป็นค่ามาตรฐาน GLP หรือไม่?')) {
      resetInteriorThemes();
      showToast('รีเซ็ตธีมตกแต่งร้านเป็นค่ามาตรฐานเรียบร้อย');
    }
  };

  return (
    <div className="cms-panel-block hardware-pricing-cms">
      {/* Toast Notification */}
      {successToast && (
        <div className="cms-toast success-toast" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#065f46',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: '8px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600
        }}>
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="panel-header-row" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div className="badge-pill badge-blue" style={{ display: 'inline-flex', marginBottom: '8px' }}>
            <Cpu size={14} />
            <span>HARDWARE SPECS & INFRASTRUCTURE PRICING</span>
          </div>
          <h3 className="panel-title" style={{ fontSize: '1.28rem', margin: '0 0 4px 0' }}>
            จัดการสเปกคอมพิวเตอร์ & ราคางานระบบการลงทุน (ครบทุกจุด)
          </h3>
          <p className="panel-desc" style={{ maxWidth: '820px', margin: 0 }}>
            ปรับแต่งสเปกชิ้นส่วนคอมพิวเตอร์ (CPU, GPU เช่น RTX 5090, RAM, จอ, อุปกรณ์เกมมิ่งเกียร์) และแก้ไขราคาแม่ข่าย Diskless, ระบบเน็ตเวิร์ก, งานตกแต่ง และชุดโต๊ะคอมพิวเตอร์ ทุกการแก้ไขจะส่งผลต่อการจำลองผังร้าน 3D และใบเสนอราคา (BOQ) ทันที
          </p>
        </div>

        {/* Global Action Tools */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => setActiveSubTab('specs')}
            style={{ fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} />
            <span>รีเฟรชข้อมูล</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="pricing-stat-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', margin: '18px 0 22px 0' }}>
        <div className="ps-metric-card glass-panel" style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ps-icon-wrap" style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={20} />
          </div>
          <div className="ps-info">
            <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>รุ่นสเปกคอมในระบบ</span>
            <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{Object.keys(hardwareTiers).length} ระดับ / รุ่น</strong>
            <span style={{ fontSize: '0.7rem', color: '#8b5cf6', display: 'block' }}>รวมสเปกคอมรุ่น 001 (RTX 5090)</span>
          </div>
        </div>

        <div className="ps-metric-card glass-panel" style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ps-icon-wrap" style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Server size={20} />
          </div>
          <div className="ps-info">
            <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>ค่าเซิร์ฟเวอร์ Diskless</span>
            <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>฿{(fixedInfra.disklessServer || 0).toLocaleString()}</strong>
            <span style={{ fontSize: '0.7rem', color: '#059669', display: 'block' }}>NVMe Enterprise Dual NIC 10G</span>
          </div>
        </div>

        <div className="ps-metric-card glass-panel" style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ps-icon-wrap" style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Network size={20} />
          </div>
          <div className="ps-info">
            <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>ระบบเน็ตเวิร์ก 10G & Fiber</span>
            <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>฿{(fixedInfra.networkEnterprise || 0).toLocaleString()}</strong>
            <span style={{ fontSize: '0.7rem', color: '#d97706', display: 'block' }}>Cisco Switch + สาย CAT6A</span>
          </div>
        </div>

        <div className="ps-metric-card glass-panel" style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="ps-icon-wrap" style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={20} />
          </div>
          <div className="ps-info">
            <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>ลิขสิทธิ์แฟรนไชส์ Turnkey</span>
            <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>฿{(fixedInfra.franchiseFee || 0).toLocaleString()}</strong>
            <span style={{ fontSize: '0.7rem', color: '#9333ea', display: 'block' }}>แปลน 3D + อบรม + แบรนด์ GLP</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="hardware-pricing-subtabs" style={{ display: 'flex', gap: '8px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>
        <button
          type="button"
          className={`hp-subtab-btn ${activeSubTab === 'specs' ? 'active' : ''}`}
          onClick={() => handleSubTabChange('specs')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: 'none',
            background: activeSubTab === 'specs' ? '#2563eb' : '#f1f5f9',
            color: activeSubTab === 'specs' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer'
          }}
        >
          <Cpu size={15} />
          <span>1. ระดับสเปกคอมพิวเตอร์ ({Object.keys(hardwareTiers).length} รุ่น)</span>
        </button>

        <button
          type="button"
          className={`hp-subtab-btn ${activeSubTab === 'infrastructure' ? 'active' : ''}`}
          onClick={() => handleSubTabChange('infrastructure')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: 'none',
            background: activeSubTab === 'infrastructure' ? '#2563eb' : '#f1f5f9',
            color: activeSubTab === 'infrastructure' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer'
          }}
        >
          <Server size={15} />
          <span>2. ราคาโครงสร้างพื้นฐาน & งานระบบ</span>
        </button>

        <button
          type="button"
          className={`hp-subtab-btn ${activeSubTab === 'desks' ? 'active' : ''}`}
          onClick={() => handleSubTabChange('desks')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: 'none',
            background: activeSubTab === 'desks' ? '#2563eb' : '#f1f5f9',
            color: activeSubTab === 'desks' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer'
          }}
        >
          <Armchair size={15} />
          <span>3. ราคาชุดโต๊ะคอม & เฟอร์นิเจอร์ (รวมเก้าอี้)</span>
        </button>

        <button
          type="button"
          className={`hp-subtab-btn ${activeSubTab === 'themes' ? 'active' : ''}`}
          onClick={() => handleSubTabChange('themes')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: 'none',
            background: activeSubTab === 'themes' ? '#2563eb' : '#f1f5f9',
            color: activeSubTab === 'themes' ? '#ffffff' : '#475569',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer'
          }}
        >
          <Palette size={15} />
          <span>4. ธีมการตกแต่งร้าน ({interiorThemes.length} แบบ)</span>
        </button>
      </div>

      {/* =========================================================================
          SUBTAB 1: HARDWARE TIERS & MODELS
          ========================================================================= */}
      {activeSubTab === 'specs' && (
        <div className="subtab-content specs-subtab">
          {/* Chair bundle notification banner */}
          <div className="info-banner-tip" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 16px', marginBottom: '18px' }}>
            <Info size={18} className="text-blue" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.86rem', color: '#1e3a8a', lineHeight: 1.5 }}>
              <strong>โครงสร้างราคาสเปกคอมพิวเตอร์:</strong> เก้าอี้เกมมิ่ง (Gaming Chairs) ถูกแยกออกและนำไปรวมอยู่ใน <strong>"ชุดโต๊ะคอมพิวเตอร์"</strong> ของแต่ละโมดูลในผังร้านแล้ว เพื่อความถูกต้อง ไม่คิดราคาเก้าอี้ซ้ำซ้อน
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              รายการรุ่นสเปกคอมพิวเตอร์ทั้งหมด ({Object.keys(hardwareTiers).length} รุ่น)
            </h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowAddModal(true)}
                style={{ fontSize: '0.84rem' }}
              >
                <Plus size={15} />
                <span>+ เพิ่มรุ่นสเปกคอมใหม่</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleResetTiers}
                title="รีเซ็ตสเปกกลับเป็นค่าเริ่มต้นของระบบ"
                style={{ fontSize: '0.84rem' }}
              >
                <RefreshCw size={14} />
                <span>รีเซ็ตสเปกเริ่มต้น</span>
              </button>
            </div>
          </div>

          {/* Grid of Spec Cards */}
          <div className="specs-cms-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
            {Object.entries(hardwareTiers).map(([key, tier]) => {
              return (
                <div 
                  key={key} 
                  className="cms-tier-card glass-panel"
                  style={{
                    border: key === 'model001' ? '2px solid #8b5cf6' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '18px',
                    background: key === 'model001' ? 'linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)' : '#ffffff',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                  }}
                >
                  {key === 'model001' && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '16px',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 10px',
                      borderRadius: '12px',
                      letterSpacing: '0.5px',
                      zIndex: 2
                    }}>
                      FLAGSHIP RTX 5090
                    </div>
                  )}

                  <div>
                    {/* Tier Photo Banner */}
                    {tier.image ? (
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '150px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        marginBottom: '12px',
                        background: '#0f172a'
                      }}>
                        <img 
                          src={resolveImageSrc(tier.image)} 
                          alt={tier.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: '6px',
                          right: '8px',
                          background: 'rgba(0,0,0,0.65)',
                          color: '#fff',
                          fontSize: '0.68rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backdropFilter: 'blur(4px)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <ImageIcon size={11} />
                          <span>ภาพสเปกจริง</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '75px',
                        borderRadius: '10px',
                        marginBottom: '12px',
                        background: '#f8fafc',
                        border: '1px dashed #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        color: '#94a3b8',
                        fontSize: '0.75rem'
                      }}>
                        <ImageIcon size={16} />
                        <span>ยังไม่ได้ใส่รูปภาพ (คลิกแก้ไขเพื่อใส่รูป)</span>
                      </div>
                    )}

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1, paddingRight: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                          ID: {key}
                        </span>
                        <h4 style={{ margin: '2px 0 4px 0', fontSize: '1.08rem', color: '#0f172a', fontWeight: 700 }}>
                          {tier.name}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                          {tier.tagline}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>ราคาต่อเครื่อง</span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                          ฿{(tier.unitCost || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Hardware Spec Details List */}
                    <div className="tier-spec-details" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', padding: '12px', background: '#f8fafc', borderRadius: '10px', margin: '12px 0' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Cpu size={15} className="text-blue" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div><strong>CPU:</strong> {tier.cpu}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Zap size={15} className="text-purple" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div><strong>GPU:</strong> {tier.gpu}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Layers size={15} className="text-cyan" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div><strong>RAM:</strong> {tier.ram}</div>
                      </div>
                      {tier.storage && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <HardDrive size={15} className="text-blue" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div><strong>Storage:</strong> {tier.storage}</div>
                        </div>
                      )}
                      {(tier.psu || tier.caseCooling) && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Box size={15} className="text-indigo" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            {tier.psu && <span><strong>PSU:</strong> {tier.psu} </span>}
                            {tier.caseCooling && <span>• <strong>เคส/ระบายความร้อน:</strong> {tier.caseCooling}</span>}
                          </div>
                        </div>
                      )}
                      {tier.mainboard && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Sliders size={15} className="text-slate" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div><strong>Mainboard:</strong> {tier.mainboard}</div>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Monitor size={15} className="text-emerald" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div><strong>Monitor:</strong> {tier.monitor}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Gamepad2 size={15} className="text-amber" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div><strong>Gaming Gear:</strong> {tier.gear}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', color: '#059669', background: '#ecfdf5', padding: '6px 10px', borderRadius: '6px' }}>
                        <Armchair size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div><strong>เก้าอี้เกมมิ่ง:</strong> รวมอยู่ในชุดโต๊ะเกมมิ่งแล้ว (ไม่คิดซ้ำ)</div>
                      </div>
                      {tier.warranty && (
                        <div style={{ display: 'flex', gap: '8px', color: '#1e40af', background: '#eff6ff', padding: '6px 10px', borderRadius: '6px' }}>
                          <ShieldCheck size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div><strong>การรับประกัน:</strong> {tier.warranty}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Buttons: Available for ALL tiers */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleStartEditTier(key, tier)}
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      <Edit3 size={13} />
                      <span>แก้ไขสเปก & ราคา</span>
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDeleteTier(key, tier.name)}
                      style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                      title="ลบรุ่นสเปกนี้ออกจากระบบ"
                    >
                      <Trash2 size={13} />
                      <span>ลบ</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit Tier Modal */}
          {editingTierId && (
            <div className="admin-modal-backdrop" onClick={() => setEditingTierId(null)} style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '16px'
            }}>
              <div 
                className="admin-modal-card glass-panel" 
                style={{ 
                  maxWidth: '720px', 
                  width: '100%', 
                  maxHeight: '92vh', 
                  overflowY: 'auto',
                  background: '#ffffff', 
                  borderRadius: '16px', 
                  padding: '22px', 
                  boxShadow: '0 25px 50px rgba(0,0,0,0.25)' 
                }} 
                onClick={e => e.stopPropagation()}
              >
                <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Edit3 size={18} className="text-blue" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem' }}>แก้ไขสเปกคอมพิวเตอร์: {tierEditForm.name}</h3>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>รหัส ID: {editingTierId} • บันทึกอัตโนมัติลงฐานข้อมูล</span>
                    </div>
                  </div>
                  <button type="button" className="btn-popover-close-mini" onClick={() => setEditingTierId(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>

                <div className="admin-modal-body" style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Photo Upload & Preview */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <ImageIcon size={15} className="text-blue" />
                      <span>รูปภาพเคสคอมพิวเตอร์ / ชุดสเปก (Image):</span>
                    </label>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{
                        width: '120px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #cbd5e1',
                        flexShrink: 0
                      }}>
                        {tierEditForm.image ? (
                          <img src={resolveImageSrc(tierEditForm.image)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Camera size={24} className="text-slate" />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                          value={tierEditForm.image || ''}
                          onChange={e => setTierEditForm({ ...tierEditForm, image: e.target.value })}
                          placeholder="วาง URL รูปภาพ https://..."
                        />
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <label className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.78rem', cursor: uploadingImage ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Upload size={13} />
                            <span>{uploadingImage ? 'กำลังประมวลผล WebP...' : '📷 อัปโหลดภาพ (WebP)'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              disabled={uploadingImage}
                              onChange={e => handleTierImageUpload(e, true)}
                            />
                          </label>
                          {tierEditForm.image && (
                            <button
                              type="button"
                              className="btn-danger-outline"
                              onClick={() => setTierEditForm({ ...tierEditForm, image: '' })}
                              style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                            >
                              ลบรูปภาพ
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>ชื่อรุ่นสเปก:</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={tierEditForm.name || ''}
                        onChange={e => setTierEditForm({ ...tierEditForm, name: e.target.value })}
                        placeholder="เช่น Tier 2: Pro Competitive"
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>ราคาต่อเครื่อง (บาท/ครบชุด):</label>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={tierEditForm.unitCost || 0}
                        onChange={e => setTierEditForm({ ...tierEditForm, unitCost: e.target.value })}
                        placeholder="เช่น 52000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>คำโปรย / จุดเด่นของรุ่น:</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      value={tierEditForm.tagline || ''}
                      onChange={e => setTierEditForm({ ...tierEditForm, tagline: e.target.value })}
                      placeholder="เช่น สเปกนักกีฬาอีสปอร์ต ลื่นไหลทุกทัวร์นาเมนต์ เฟรมเรต 300+"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>ซีพียู (CPU):</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={tierEditForm.cpu || ''}
                        onChange={e => setTierEditForm({ ...tierEditForm, cpu: e.target.value })}
                        placeholder="เช่น Intel Core i7-14700F / AMD Ryzen 7 7800X3D"
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>การ์ดจอ (GPU):</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={tierEditForm.gpu || ''}
                        onChange={e => setTierEditForm({ ...tierEditForm, gpu: e.target.value })}
                        placeholder="เช่น NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>หน่วยความจำ (RAM):</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={tierEditForm.ram || ''}
                        onChange={e => setTierEditForm({ ...tierEditForm, ram: e.target.value })}
                        placeholder="เช่น 32GB DDR5 6000MHz RGB"
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>พื้นที่จัดเก็บข้อมูล (Storage / SSD):</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={tierEditForm.storage || ''}
                        onChange={e => setTierEditForm({ ...tierEditForm, storage: e.target.value })}
                        placeholder="เช่น 1TB NVMe M.2 PCIe 4.0 / Diskless 10G Ready"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>พาวเวอร์ซัพพลาย (Power Supply - PSU):</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={tierEditForm.psu || ''}
                        onChange={e => setTierEditForm({ ...tierEditForm, psu: e.target.value })}
                        placeholder="เช่น 750W 80+ Gold Fully Modular"
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>เคสและชุดระบายความร้อน (Case & Cooling):</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={tierEditForm.caseCooling || ''}
                        onChange={e => setTierEditForm({ ...tierEditForm, caseCooling: e.target.value })}
                        placeholder="เช่น Panoramic Glass Case + 240mm Liquid Cooler"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>เมนบอร์ด (Mainboard):</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={tierEditForm.mainboard || ''}
                        onChange={e => setTierEditForm({ ...tierEditForm, mainboard: e.target.value })}
                        placeholder="เช่น B760 / B650 Gaming Wi-Fi DDR5"
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>หน้าจอแสดงผล (Monitor):</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={tierEditForm.monitor || ''}
                        onChange={e => setTierEditForm({ ...tierEditForm, monitor: e.target.value })}
                        placeholder="เช่น 27&quot; Fast-IPS 280Hz - 360Hz QHD DyAc Ready"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>เกมมิ่งเกียร์ (เมาส์, คีย์บอร์ด, หูฟัง):</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      value={tierEditForm.gear || ''}
                      onChange={e => setTierEditForm({ ...tierEditForm, gear: e.target.value })}
                      placeholder="เช่น Custom Coiled Keyboard + Ultralight Wireless Mouse 4K/8K + Headset 7.1"
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>การรับประกันและบริการหลังการขาย (Warranty):</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      value={tierEditForm.warranty || ''}
                      onChange={e => setTierEditForm({ ...tierEditForm, warranty: e.target.value })}
                      placeholder="เช่น รับประกัน 3 ปี On-site Service 24 ชม."
                    />
                  </div>
                </div>

                <div className="admin-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setEditingTierId(null)}>ยกเลิก</button>
                  <button type="button" className="btn-primary" onClick={() => handleSaveTier(editingTierId)}>
                    <Save size={15} />
                    <span>บันทึกการแก้ไข</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add New Tier Modal */}
          {showAddModal && (
            <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)} style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '16px'
            }}>
              <div 
                className="admin-modal-card glass-panel" 
                style={{ 
                  maxWidth: '720px', 
                  width: '100%', 
                  maxHeight: '92vh', 
                  overflowY: 'auto',
                  background: '#ffffff', 
                  borderRadius: '16px', 
                  padding: '22px', 
                  boxShadow: '0 25px 50px rgba(0,0,0,0.25)' 
                }} 
                onClick={e => e.stopPropagation()}
              >
                <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} className="text-blue" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem' }}>สร้างรุ่นสเปกคอมพิวเตอร์ใหม่ (Custom Model)</h3>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>ใส่รูปภาพและสเปกอุปกรณ์ครบชุด</span>
                    </div>
                  </div>
                  <button type="button" className="btn-popover-close-mini" onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>

                <form onSubmit={handleAddNewTier}>
                  <div className="admin-modal-body" style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Photo Upload & Preview */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                      <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <ImageIcon size={15} className="text-blue" />
                        <span>รูปภาพเคสคอมพิวเตอร์ / ชุดสเปก (Image):</span>
                      </label>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{
                          width: '120px',
                          height: '80px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #cbd5e1',
                          flexShrink: 0
                        }}>
                          {newTierForm.image ? (
                            <img src={resolveImageSrc(newTierForm.image)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Camera size={24} className="text-slate" />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input
                            type="text"
                            className="form-input"
                            style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                            value={newTierForm.image || ''}
                            onChange={e => setNewTierForm({ ...newTierForm, image: e.target.value })}
                            placeholder="วาง URL รูปภาพ https://..."
                          />
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <label className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.78rem', cursor: uploadingImage ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <Upload size={13} />
                              <span>{uploadingImage ? 'กำลังประมวลผล WebP...' : '📷 อัปโหลดภาพ (WebP)'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                disabled={uploadingImage}
                                onChange={e => handleTierImageUpload(e, false)}
                              />
                            </label>
                            {newTierForm.image && (
                              <button
                                type="button"
                                className="btn-danger-outline"
                                onClick={() => setNewTierForm({ ...newTierForm, image: '' })}
                                style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                              >
                                ลบรูปภาพ
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>รหัสสเปก (ID):</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          value={newTierForm.id}
                          onChange={e => setNewTierForm({ ...newTierForm, id: e.target.value })}
                          placeholder="เช่น model002, esports-pro-max"
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>ราคาต่อเครื่อง (บาท):</label>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          value={newTierForm.unitCost}
                          onChange={e => setNewTierForm({ ...newTierForm, unitCost: e.target.value })}
                          placeholder="เช่น 65000"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>ชื่อรุ่นสเปกคอม:</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={newTierForm.name}
                        onChange={e => setNewTierForm({ ...newTierForm, name: e.target.value })}
                        placeholder="เช่น สเปกคอมรุ่น 002: RTX 5080 Extreme"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>คำโปรย / จุดเด่น:</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={newTierForm.tagline}
                        onChange={e => setNewTierForm({ ...newTierForm, tagline: e.target.value })}
                        placeholder="เช่น ประสิทธิภาพสูงสำหรับการแข่งขัน FPS เฟรมเรต 400+"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>CPU:</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          value={newTierForm.cpu}
                          onChange={e => setNewTierForm({ ...newTierForm, cpu: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>GPU:</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          value={newTierForm.gpu}
                          onChange={e => setNewTierForm({ ...newTierForm, gpu: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>RAM:</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          value={newTierForm.ram}
                          onChange={e => setNewTierForm({ ...newTierForm, ram: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Storage (SSD / M.2 NVMe):</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          value={newTierForm.storage || ''}
                          onChange={e => setNewTierForm({ ...newTierForm, storage: e.target.value })}
                          placeholder="เช่น 1TB NVMe M.2 PCIe 4.0 / Diskless 10G Ready"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>PSU (พาวเวอร์ซัพพลาย):</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          value={newTierForm.psu || ''}
                          onChange={e => setNewTierForm({ ...newTierForm, psu: e.target.value })}
                          placeholder="เช่น 750W 80+ Gold Fully Modular"
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>เคสและระบายความร้อน:</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          value={newTierForm.caseCooling || ''}
                          onChange={e => setNewTierForm({ ...newTierForm, caseCooling: e.target.value })}
                          placeholder="เช่น Panoramic RGB Gaming Case + 240mm Liquid Cooler"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>เมนบอร์ด (Mainboard):</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          value={newTierForm.mainboard || ''}
                          onChange={e => setNewTierForm({ ...newTierForm, mainboard: e.target.value })}
                          placeholder="เช่น B760 / B650 Gaming Wi-Fi DDR5"
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Monitor:</label>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          value={newTierForm.monitor}
                          onChange={e => setNewTierForm({ ...newTierForm, monitor: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Gaming Gear (เมาส์, คีย์บอร์ด, หูฟัง):</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={newTierForm.gear}
                        onChange={e => setNewTierForm({ ...newTierForm, gear: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>การรับประกัน (Warranty):</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={newTierForm.warranty || ''}
                        onChange={e => setNewTierForm({ ...newTierForm, warranty: e.target.value })}
                        placeholder="เช่น รับประกัน 3 ปี On-site Service 24 ชม."
                      />
                    </div>
                  </div>

                  <div className="admin-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                    <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>ยกเลิก</button>
                    <button type="submit" className="btn-primary">
                      <Plus size={15} />
                      <span>สร้างสเปกคอมรุ่นใหม่</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUBTAB 2: INFRASTRUCTURE & LICENSING
          ========================================================================= */}
      {activeSubTab === 'infrastructure' && (
        <div className="subtab-content infra-subtab">
          <div className="info-banner-tip" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
            <Server size={18} className="text-blue" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
              <strong>การปรับแต่งราคาโครงสร้างพื้นฐาน:</strong> ค่าใช้จ่ายด้านล่างนี้จะถูกนำไปคำนวณใน <strong>ขั้นตอนที่ 4 (งบประมาณ & ROI)</strong> และรวมใน <strong>ใบเสนอราคา (BOQ)</strong> อัตโนมัติ สามารถปรับเปลี่ยนราคาตามสภาพตลาดหรือขนาดโครงการได้อิสระ
            </div>
          </div>

          <form onSubmit={handleSaveInfra}>
            <div className="infra-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
              {/* 1. Diskless Master */}
              <div className="infra-card glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Server size={18} className="text-blue" />
                  <strong style={{ fontSize: '0.95rem' }}>1. แม่ข่าย Diskless Server 10Gbps Master</strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  แม่ข่ายเซิร์ฟเวอร์คู่ Dual Server NVMe Enterprise, 10G SFP+ Dual NIC, ระบบ Auto Game Updater
                </p>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600 }}>฿</span>
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px 8px 28px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                    value={infraForm.disklessServer || 0}
                    onChange={e => setInfraForm({ ...infraForm, disklessServer: e.target.value })}
                  />
                </div>
              </div>

              {/* 2. Network 10G Enterprise */}
              <div className="infra-card glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Network size={18} className="text-cyan" />
                  <strong style={{ fontSize: '0.95rem' }}>2. ระบบเน็ตเวิร์ก 10G Multi-WAN & Cisco</strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  เราเตอร์ Dual-WAN Load Balance, Cisco Managed Switch 10G Backbone, เดินสาย LAN CAT6A
                </p>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600 }}>฿</span>
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px 8px 28px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                    value={infraForm.networkEnterprise || 0}
                    onChange={e => setInfraForm({ ...infraForm, networkEnterprise: e.target.value })}
                  />
                </div>
              </div>

              {/* 3. Billing & POS */}
              <div className="infra-card glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CreditCard size={18} className="text-amber" />
                  <strong style={{ fontSize: '0.95rem' }}>3. ระบบคิดเงิน Billing & POS License</strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  ฮาร์ดแวร์ POS จอสัมผัส, ลิ้นชักเก็บเงิน, เครื่องสแกนบาร์โค้ด, ลิขสิทธิ์ระบบคิดเงินตลอดชีพ
                </p>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600 }}>฿</span>
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px 8px 28px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                    value={infraForm.billingAndPOS || 0}
                    onChange={e => setInfraForm({ ...infraForm, billingAndPOS: e.target.value })}
                  />
                </div>
              </div>

              {/* 4. Franchise License Fee */}
              <div className="infra-card glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Award size={18} className="text-purple" />
                  <strong style={{ fontSize: '0.95rem' }}>4. ค่าลิขสิทธิ์และแบรนด์แฟรนไชส์ (Franchise Fee)</strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  สิทธิ์ใช้แบรนด์ GLP Living Plus, พิมพ์เขียวแปลนช่าง 3D, อบรมบุคลากร, แคมเปญเปิดตัว 1 ปี
                </p>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600 }}>฿</span>
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px 8px 28px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                    value={infraForm.franchiseFee || 0}
                    onChange={e => setInfraForm({ ...infraForm, franchiseFee: e.target.value })}
                  />
                </div>
              </div>

              {/* 5. Interior Decor Cost / SqM */}
              <div className="infra-card glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sliders size={18} className="text-emerald" />
                  <strong style={{ fontSize: '0.95rem' }}>5. ค่าตกแต่งภายใน & ไฟ Linear RGB (ต่อ ตร.ม.)</strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  งานพื้น SPC/ลามิเนต, ผนังอะคูสติกเก็บเสียง, ระบบไฟเส้น Linear LED รางรางสายไฟ ซ่อนสาย
                </p>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600 }}>฿</span>
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px 8px 28px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                    value={infraForm.interiorSqMeterCost || 0}
                    onChange={e => setInfraForm({ ...infraForm, interiorSqMeterCost: e.target.value })}
                  />
                </div>
              </div>

              {/* 6. Air Conditioning Cost / SqM */}
              <div className="infra-card glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={18} className="text-cyan" />
                  <strong style={{ fontSize: '0.95rem' }}>6. ระบบปรับอากาศ Cassette Inverter (ต่อ ตร.ม.)</strong>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 10px 0' }}>
                  แอร์ฝังฝ้า 4 ทิศทาง มาตรฐานเชิงพาณิชย์ ทำงานเงียบ ประหยัดไฟ กรองอากาศ PM2.5 ตลอด 24 ชม.
                </p>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600 }}>฿</span>
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: '100%', padding: '8px 10px 8px 28px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                    value={infraForm.airconSqMeterCost || 0}
                    onChange={e => setInfraForm({ ...infraForm, airconSqMeterCost: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleResetInfra}
              >
                <RefreshCw size={14} />
                <span>รีเซ็ตราคาเป็นค่ามาตรฐาน</span>
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <Save size={15} />
                <span>บันทึกราคาโครงสร้างพื้นฐานทั้งหมด</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          SUBTAB 3: DESK SETS & FURNITURE PRICING
          ========================================================================= */}
      {activeSubTab === 'desks' && (
        <div className="subtab-content desks-subtab">
          <div className="info-banner-tip" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px', marginBottom: '18px' }}>
            <Armchair size={18} className="text-emerald" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.86rem', color: '#166534', lineHeight: 1.5 }}>
              <strong>ชุดโต๊ะคอมพิวเตอร์พร้อมเก้าอี้ Ergonomic:</strong> โมดูลโต๊ะคอมพิวเตอร์ทุกแบบด้านล่างถูกออกแบบโดยรวมเก้าอี้เกมมิ่งคุณภาพสูงตามจำนวนที่นั่งไว้ในราคาต้นทุนแล้ว สามารถปรับแก้ราคาฐาน (Base Cost) ของแต่ละโมดูลได้โดยตรง
            </div>
          </div>

          <div className="desk-pricing-table-wrap" style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 14px' }}>โมดูลโต๊ะ / เฟอร์นิเจอร์</th>
                  <th style={{ padding: '10px 14px' }}>ขนาด (กว้าง x ลึก x สูง)</th>
                  <th style={{ padding: '10px 14px' }}>จำนวนที่นั่ง & เก้าอี้ที่รวม</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>ราคาฐานปัจจุบัน</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>แก้ไขราคาฐาน (฿)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {deskModules.map((item) => {
                  const currentInputCost = deskCosts[item.id] !== undefined ? deskCosts[item.id] : item.baseCost;

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover' }} 
                            />
                          )}
                          <div>
                            <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{item.name}</strong>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>รหัส: {item.type}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#475569' }}>
                        {item.width} x {item.height} x {item.realWorldHeight || 0.75} ม.
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {item.stationCount ? (
                          <span className="badge-pill badge-emerald" style={{ fontSize: '0.74rem' }}>
                            {item.stationCount} ที่นั่ง + เก้าอี้ครบชุด
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>งานบริการ / ระบบ</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#059669', fontSize: '0.95rem' }}>
                        ฿{(item.baseCost || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '130px', textAlign: 'right', fontWeight: 600, display: 'inline-block', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          value={currentInputCost}
                          onChange={e => handleDeskCostChange(item.id, e.target.value)}
                        />
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => handleSaveDeskCost(item.id)}
                            style={{ padding: '6px 10px', fontSize: '0.76rem' }}
                            title="บันทึกราคาฐาน"
                          >
                            <Save size={13} />
                            <span>บันทึกราคา</span>
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => handleStartEditCatalogItem(item)}
                            style={{ padding: '6px 10px', fontSize: '0.76rem', color: '#2563eb' }}
                            title="แก้ไขสเปก รายละเอียด และรูปภาพอุปกรณ์"
                          >
                            <Edit3 size={13} />
                            <span>แก้ไขรูป & สเปก</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Edit Catalog Item / Equipment Modal */}
          {editingCatalogItem && (
            <div className="admin-modal-backdrop" onClick={() => setEditingCatalogItem(null)} style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '16px'
            }}>
              <div 
                className="admin-modal-card glass-panel" 
                style={{ 
                  maxWidth: '680px', 
                  width: '100%', 
                  maxHeight: '92vh', 
                  overflowY: 'auto',
                  background: '#ffffff', 
                  borderRadius: '16px', 
                  padding: '22px', 
                  boxShadow: '0 25px 50px rgba(0,0,0,0.25)' 
                }} 
                onClick={e => e.stopPropagation()}
              >
                <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Armchair size={18} className="text-blue" />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem' }}>แก้ไขข้อมูลอุปกรณ์/โมดูลโต๊ะ: {catalogEditForm.name}</h3>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>รหัสโมดูล: {editingCatalogItem.type}</span>
                    </div>
                  </div>
                  <button type="button" className="btn-popover-close-mini" onClick={() => setEditingCatalogItem(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>

                <div className="admin-modal-body" style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Photo Upload & Preview */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                    <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <ImageIcon size={15} className="text-blue" />
                      <span>รูปภาพอุปกรณ์ / โต๊ะคอมพิวเตอร์ / เฟอร์นิเจอร์:</span>
                    </label>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{
                        width: '120px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #cbd5e1',
                        flexShrink: 0
                      }}>
                        {catalogEditForm.image ? (
                          <img src={resolveImageSrc(catalogEditForm.image)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Camera size={24} className="text-slate" />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                          value={catalogEditForm.image || ''}
                          onChange={e => setCatalogEditForm({ ...catalogEditForm, image: e.target.value })}
                          placeholder="วาง URL รูปภาพ https://..."
                        />
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <label className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.78rem', cursor: uploadingCatalogImage ? 'wait' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Upload size={13} />
                            <span>{uploadingCatalogImage ? 'กำลังประมวลผล WebP...' : '📷 อัปโหลดรูปภาพ (WebP)'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              disabled={uploadingCatalogImage}
                              onChange={handleCatalogImageUpload}
                            />
                          </label>
                          {catalogEditForm.image && (
                            <button
                              type="button"
                              className="btn-danger-outline"
                              onClick={() => setCatalogEditForm({ ...catalogEditForm, image: '' })}
                              style={{ padding: '5px 10px', fontSize: '0.76rem' }}
                            >
                              ลบรูปภาพ
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>ชื่อโมดูลอุปกรณ์:</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={catalogEditForm.name || ''}
                        onChange={e => setCatalogEditForm({ ...catalogEditForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>ราคาฐานต่อชุด (บาท):</label>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                        value={catalogEditForm.baseCost || 0}
                        onChange={e => setCatalogEditForm({ ...catalogEditForm, baseCost: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>ความกว้าง (เมตร):</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={catalogEditForm.width || 1}
                        onChange={e => setCatalogEditForm({ ...catalogEditForm, width: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>ความลึก (เมตร):</label>
                      <input
                        type="number"
                        step="0.1"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={catalogEditForm.height || 1}
                        onChange={e => setCatalogEditForm({ ...catalogEditForm, height: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>จำนวนที่นั่ง/เก้าอี้:</label>
                      <input
                        type="number"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={catalogEditForm.stationCount || 0}
                        onChange={e => setCatalogEditForm({ ...catalogEditForm, stationCount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>วัสดุโครงสร้าง (Material):</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={catalogEditForm.material || ''}
                        onChange={e => setCatalogEditForm({ ...catalogEditForm, material: e.target.value })}
                        placeholder="เช่น เหล็กกล่องกัลวาไนซ์ + ท็อปไม้อัดเคลือบ HPL กันน้ำ"
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>การรับประกัน (Warranty):</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={catalogEditForm.warranty || ''}
                        onChange={e => setCatalogEditForm({ ...catalogEditForm, warranty: e.target.value })}
                        placeholder="เช่น รับประกันโครงสร้าง 5 ปี"
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setEditingCatalogItem(null)}>ยกเลิก</button>
                  <button type="button" className="btn-primary" onClick={handleSaveCatalogItem}>
                    <Save size={15} />
                    <span>บันทึกข้อมูลอุปกรณ์</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUBTAB 4: INTERIOR STYLE THEMES MANAGEMENT
          ========================================================================= */}
      {activeSubTab === 'themes' && (
        <div className="subtab-content themes-subtab">
          {/* Header & Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={18} className="text-blue" />
                <span>จัดการธีมการตกแต่งร้าน (Interior Style Themes)</span>
              </h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                ธีมเหล่านี้จะปรากฏในขั้นตอนที่ 1 ของระบบวางผังร้าน (Franchise Planner) และถูกแนบไปในใบเสนอราคา BOQ อัตโนมัติ
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleResetThemes}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                <RefreshCw size={13} />
                <span>คืนค่ามาตรฐาน</span>
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowAddThemeModal(true)}
                style={{ fontSize: '0.8rem', padding: '6px 14px' }}
              >
                <Plus size={14} />
                <span>เพิ่มธีมตกแต่งใหม่</span>
              </button>
            </div>
          </div>

          {/* Themes Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {interiorThemes.map((theme) => {
              const primaryHex = theme.palette?.[0]?.hex || (theme.id === 'royal' ? '#1d4ed8' : theme.id === 'luxury' ? '#f59e0b' : '#10b981');

              return (
                <div 
                  key={theme.id}
                  className="glass-panel"
                  style={{
                    position: 'relative',
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Left accent strip */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', background: primaryHex }} />

                  <div>
                    {/* Header info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ 
                            fontSize: '0.72rem', 
                            fontWeight: 700, 
                            padding: '2px 8px', 
                            borderRadius: '999px',
                            background: primaryHex + '22',
                            color: primaryHex,
                            border: `1px solid ${primaryHex}44`
                          }}>
                            {theme.badge || 'Official'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>ID: {theme.id}</span>
                        </div>
                        <h5 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                          {theme.name}
                        </h5>
                      </div>
                      
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: primaryHex, border: '2px solid #fff', boxShadow: '0 0 6px rgba(0,0,0,0.15)' }} title={`สีหลัก: ${primaryHex}`} />
                    </div>

                    {/* Tagline */}
                    <div style={{ 
                      fontSize: '0.82rem', 
                      fontWeight: 600, 
                      color: '#2563eb', 
                      background: '#f8fafc', 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0',
                      marginBottom: '10px'
                    }}>
                      {theme.tagline || 'ไม่มีคำอธิบายย่อ'}
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                      {theme.description}
                    </p>

                    {/* Specs Details */}
                    <div style={{ fontSize: '0.74rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                      {theme.lighting && (
                        <div><strong>ระบบไฟ:</strong> {theme.lighting}</div>
                      )}
                      {theme.acoustic && (
                        <div><strong>ซับเสียง:</strong> {theme.acoustic}</div>
                      )}
                    </div>

                    {/* Palette swatches */}
                    {theme.palette && theme.palette.length > 0 && (
                      <div style={{ marginBottom: '14px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>พาเลทสีประจำธีม:</span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {theme.palette.map((c, cIdx) => (
                            <div 
                              key={cIdx} 
                              style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '4px', 
                                fontSize: '0.7rem', 
                                background: '#f1f5f9', 
                                padding: '2px 8px', 
                                borderRadius: '6px', 
                                border: '1px solid #e2e8f0' 
                              }}
                            >
                              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.hex, display: 'inline-block' }} />
                              <span>{c.name || c.hex}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px', marginTop: '10px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleStartEditTheme(theme)}
                      style={{ fontSize: '0.75rem', padding: '5px 12px' }}
                    >
                      <Edit3 size={12} />
                      <span>แก้ไขธีม</span>
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleDeleteTheme(theme)}
                      style={{ fontSize: '0.75rem', padding: '5px 10px', color: '#ef4444' }}
                      title="ลบธีมนี้"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal: Edit Theme */}
          {editingThemeId && (
            <div className="cms-modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
              <div className="cms-modal-content glass-panel" style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '580px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Edit3 size={18} className="text-blue" />
                    <span>แก้ไขธีมการตกแต่งร้าน</span>
                  </h4>
                  <button type="button" onClick={() => setEditingThemeId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>ชื่อธีม (Theme Name)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={themeEditForm.name || ''}
                      onChange={e => setThemeEditForm({ ...themeEditForm, name: e.target.value })}
                      placeholder="เช่น G-Speed Royal Modern"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>ป้ายกำกับ (Badge)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={themeEditForm.badge || ''}
                        onChange={e => setThemeEditForm({ ...themeEditForm, badge: e.target.value })}
                        placeholder="เช่น Official Standard"
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>สีประจำธีม (Primary Color)</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={themeEditForm.primaryColor || '#1d4ed8'}
                          onChange={e => setThemeEditForm({ ...themeEditForm, primaryColor: e.target.value })}
                          style={{ width: '40px', height: '36px', padding: '2px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                        />
                        <input
                          type="text"
                          className="form-input"
                          value={themeEditForm.primaryColor || '#1d4ed8'}
                          onChange={e => setThemeEditForm({ ...themeEditForm, primaryColor: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>คำอธิบายย่อ (Tagline - แสดงใต้ชื่อธีมในหน้าร้าน)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={themeEditForm.tagline || ''}
                      onChange={e => setThemeEditForm({ ...themeEditForm, tagline: e.target.value })}
                      placeholder="เช่น โทนขาว-น้ำเงิน มาตรฐานแบรนด์ GLP สว่าง สบายตา ทันสมัย"
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>คำอธิบายฉบับเต็ม (Description)</label>
                    <textarea
                      rows={3}
                      className="form-input"
                      value={themeEditForm.description || ''}
                      onChange={e => setThemeEditForm({ ...themeEditForm, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>ระบบแสงไฟ (Lighting Spec)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={themeEditForm.lighting || ''}
                      onChange={e => setThemeEditForm({ ...themeEditForm, lighting: e.target.value })}
                      placeholder="เช่น ไฟ Dual-tone 4000K Natural White ผสานเส้นสายไฟซ่อน LED strip"
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>ระบบซับเสียง (Acoustic Spec)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={themeEditForm.acoustic || ''}
                      onChange={e => setThemeEditForm({ ...themeEditForm, acoustic: e.target.value })}
                      placeholder="เช่น แผงซับเสียงบุผ้าลายโมโนแกรม ตัดเสียงก้อง 65%"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setEditingThemeId(null)}>
                    ยกเลิก
                  </button>
                  <button type="button" className="btn-primary" onClick={() => handleSaveTheme(editingThemeId)}>
                    <Save size={14} />
                    <span>บันทึกการแก้ไข</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal: Add New Theme */}
          {showAddThemeModal && (
            <div className="cms-modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
              <div className="cms-modal-content glass-panel" style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '580px', width: '100%', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} className="text-blue" />
                    <span>เพิ่มธีมการตกแต่งร้านแบบใหม่</span>
                  </h4>
                  <button type="button" onClick={() => setShowAddThemeModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleCreateTheme} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>รหัสธีม (ID ภาษาอังกฤษ)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newThemeForm.id}
                        onChange={e => setNewThemeForm({ ...newThemeForm, id: e.target.value })}
                        placeholder="เช่น cyberpunk, neon-tokyo"
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>ป้ายกำกับ (Badge)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newThemeForm.badge}
                        onChange={e => setNewThemeForm({ ...newThemeForm, badge: e.target.value })}
                        placeholder="เช่น Next-Gen Esports"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>ชื่อธีม (Theme Name) *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newThemeForm.name}
                      onChange={e => setNewThemeForm({ ...newThemeForm, name: e.target.value })}
                      placeholder="เช่น Cyberpunk Neo-Tokyo Edition"
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>สีประจำธีม (Primary Color)</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={newThemeForm.primaryColor}
                        onChange={e => setNewThemeForm({ ...newThemeForm, primaryColor: e.target.value })}
                        style={{ width: '40px', height: '36px', padding: '2px', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                      />
                      <input
                        type="text"
                        className="form-input"
                        value={newThemeForm.primaryColor}
                        onChange={e => setNewThemeForm({ ...newThemeForm, primaryColor: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>คำอธิบายย่อ (Tagline) *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newThemeForm.tagline}
                      onChange={e => setNewThemeForm({ ...newThemeForm, tagline: e.target.value })}
                      placeholder="เช่น โทนสีนีออนม่วง-ฟ้า ล้ำยุค แสงไฟ Cyberpunk สำหรับสายสตรีมเมอร์"
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>คำอธิบายฉบับเต็ม (Description)</label>
                    <textarea
                      rows={3}
                      className="form-input"
                      value={newThemeForm.description}
                      onChange={e => setNewThemeForm({ ...newThemeForm, description: e.target.value })}
                      placeholder="รายละเอียดการออกแบบ วัสดุ และบรรยากาศโดยรวม..."
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>ระบบแสงไฟ (Lighting Spec)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newThemeForm.lighting}
                      onChange={e => setNewThemeForm({ ...newThemeForm, lighting: e.target.value })}
                      placeholder="เช่น ไฟ RGB Addressable Sync อัตโนมัติ"
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>ระบบซับเสียง (Acoustic Spec)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newThemeForm.acoustic}
                      onChange={e => setNewThemeForm({ ...newThemeForm, acoustic: e.target.value })}
                      placeholder="เช่น โฟม Acoustic ลายรังผึ้งความหนาแน่นสูง"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                    <button type="button" className="btn-secondary" onClick={() => setShowAddThemeModal(false)}>
                      ยกเลิก
                    </button>
                    <button type="submit" className="btn-primary">
                      <Plus size={14} />
                      <span>บันทึกและเพิ่มธีม</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
