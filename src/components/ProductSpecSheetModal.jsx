import React, { useState, useRef } from 'react';
import { 
  Printer, Copy, Download, Edit3, X, Check, 
  FileText, ShieldCheck, Box, Palette, DollarSign, 
  Layers, Wrench, Clock, CheckCircle2, Monitor, Armchair,
  Sparkles, ExternalLink
} from 'lucide-react';
import ThreeProductViewer from './ThreeProductViewer';

export default function ProductSpecSheetModal({
  item,
  onClose,
  onEdit = null
}) {
  const [activeMediaTab, setActiveMediaTab] = useState('3d'); // '3d' or 'photo'
  const [copiedToast, setCopiedToast] = useState(false);
  const specCardRef = useRef(null);

  if (!item) return null;

  const widthMeters = parseFloat(item.widthMeters) || 2.4;
  const depthMeters = parseFloat(item.depth3D || item.heightMeters) || 1.0;
  const heightMeters = parseFloat(item.height3D) || 1.25;
  const seats = parseInt(item.seats, 10) || 0;
  const floorArea = (widthMeters * depthMeters).toFixed(2);
  const chairTotal = (item.chairPrice || 0) * (item.chairCount || 0);
  const totalCost = (item.deskPrice || 0) + chairTotal;
  const vatAmount = Math.round(totalCost * 0.07);
  const totalWithVat = totalCost + vatAmount;

  // Grade badge configuration
  const gradeConfig = {
    standard: { label: 'Esports Standard (Tier 1)', color: 'bg-emerald text-emerald' },
    pro: { label: 'Pro Racing Competitive (Tier 2)', color: 'bg-blue text-blue' },
    ultimate: { label: 'Ultimate Arena Championship (Tier 3)', color: 'bg-purple text-purple' },
    vip: { label: 'VIP Private Suite Grade', color: 'bg-amber text-amber' }
  }[item.grade || 'pro'] || { label: 'Pro Racing (Tier 2)', color: 'bg-blue text-blue' };

  // Copy Spec Text to Clipboard
  const handleCopySpec = () => {
    const specText = `[G-SPEED ESPORT ARENA - OFFICIAL EQUIPMENT SPECIFICATION]
------------------------------------------------------------
ชื่อโมดูล: ${item.name}
รหัสสินค้า (SKU): ${item.type}
เกรดคุณภาพ: ${gradeConfig.label}
หมวดหมู่: ${item.category}
จำนวนที่นั่ง: ${seats} ที่นั่ง

มิติขนาดสเปก (Dimensions):
- ความกว้าง (Width): ${widthMeters} เมตร
- ความลึก (Depth): ${depthMeters} เมตร
- ความสูง (Height): ${heightMeters} เมตร
- พื้นที่ติดตั้ง (Footprint): ${floorArea} ตารางเมตร

โทนสีและการตกแต่ง (Color Palette):
- สีท็อปโต๊ะ & โครงสร้าง: ${item.deskColor || item.color || '#0f172a'}
- สีไฟ LED RGB & เส้นเรืองแสง: ${item.accentColor || '#1d4ed8'}
- สีเบาะเก้าอี้เกมมิ่ง: ${item.chairColor || '#0f172a'}

ราคาและโครงสร้างงบประมาณ (Financial Breakdown):
- ราคาโต๊ะและโครงสร้างเหล็ก: ฿${(item.deskPrice || 0).toLocaleString()}
- เก้าอี้เกมมิ่ง (${item.chairModel || 'N/A'}): ${item.chairCount || 0} ตัว @ ฿${(item.chairPrice || 0).toLocaleString()} = ฿${chairTotal.toLocaleString()}
- ราคารวมทั้งโมดูล: ฿${totalCost.toLocaleString()} (ก่อน VAT)
- รวมภาษีมูลค่าเพิ่ม 7%: ฿${totalWithVat.toLocaleString()}

ข้อมูลทางวิศวกรรมและการรับประกัน:
- สเปกวัสดุ: ${item.material || item.deskDesc || 'โครงสร้างเหล็กกล้าคาร์บอนพ่น Powder Coat + ท็อป HPL ทนรอยขีดข่วน'}
- การรับประกัน: ${item.warranty || 'รับประกันโครงสร้าง 5 ปี และระบบไฟ 3 ปี On-site Service'}
- ระยะเวลาผลิต & ติดตั้ง: ${item.leadTime || '7 - 14 วันทำการ'}
------------------------------------------------------------
เอกสารออกโดย: ศูนย์บริหารจัดการผังร้านแฟรนไชส์ G-Speed Esport Arena`;

    navigator.clipboard.writeText(specText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2200);
  };

  // Trigger Print Dialog
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="cms-modal-backdrop spec-sheet-backdrop" onClick={onClose}>
      <div 
        className="spec-sheet-modal-card" 
        onClick={e => e.stopPropagation()}
      >
        {/* Floating Action Bar Header */}
        <div className="spec-sheet-topbar no-print">
          <div className="spec-title-pill">
            <FileText size={16} className="text-blue" />
            <span>เอกสารสเปกอุปกรณ์ทางการ (Equipment Specification Sheet)</span>
          </div>

          <div className="spec-topbar-actions">
            {copiedToast && (
              <div className="toast-saved-pill">
                <Check size={14} />
                <span>คัดลอกข้อความสเปกแล้ว</span>
              </div>
            )}

            <button 
              type="button" 
              className="btn-spec-action"
              onClick={handleCopySpec}
              title="คัดลอกข้อความสเปกสินค้าลงคลิปบอร์ด"
            >
              <Copy size={14} />
              <span>คัดลอกสเปก</span>
            </button>

            <button 
              type="button" 
              className="btn-spec-action primary"
              onClick={handlePrint}
              title="พิมพ์เอกสารสเปก หรือบันทึกเป็น PDF (Print / PDF)"
            >
              <Printer size={14} />
              <span>พิมพ์ / บันทึก PDF</span>
            </button>

            {onEdit && (
              <button 
                type="button" 
                className="btn-spec-action"
                onClick={() => {
                  onClose();
                  onEdit(item);
                }}
                title="แก้ไขข้อมูลโมดูลนี้"
              >
                <Edit3 size={14} />
                <span>แก้ไขโมดูล</span>
              </button>
            )}

            <button 
              type="button" 
              className="btn-close-modal" 
              onClick={onClose}
              title="ปิดหน้าต่าง"
            >
              ✕
            </button>
          </div>
        </div>

        {/* =========================================================================
            PRINTABLE SPECIFICATION SHEET CONTAINER
            ========================================================================= */}
        <div ref={specCardRef} className="spec-printable-document">
          {/* Document Header with Branding */}
          <div className="spec-doc-header">
            <div className="doc-brand">
              <div className="doc-logo-square">
                <span>G</span>
              </div>
              <div>
                <h2 className="doc-brand-title">G-SPEED ESPORT ARENA</h2>
                <p className="doc-brand-sub">FRANCHISE ARCHITECTURE & HARDWARE STANDARDS</p>
              </div>
            </div>

            <div className="doc-meta-box">
              <div className="doc-meta-item">
                <span className="doc-meta-lbl">DOCUMENT REF:</span>
                <strong className="doc-meta-val">SPEC-{item.type.toUpperCase()}-2026</strong>
              </div>
              <div className="doc-meta-item">
                <span className="doc-meta-lbl">DATE / VERSION:</span>
                <span className="doc-meta-val">กันยายน 2026 | REV 2.4</span>
              </div>
              <div className="doc-meta-item">
                <span className="doc-meta-lbl">STATUS:</span>
                <span className="doc-meta-val text-emerald font-bold">COMMERCIAL APPROVED</span>
              </div>
            </div>
          </div>

          {/* Product Primary Identification Banner */}
          <div className="spec-product-banner">
            <div className="spec-banner-info">
              <div className="spec-badges-row">
                <span className={`spec-badge-grade ${gradeConfig.color}`}>
                  <ShieldCheck size={12} />
                  {gradeConfig.label}
                </span>
                <span className="spec-badge-cat">
                  หมวดหมู่: {item.category.toUpperCase()}
                </span>
                <span className="spec-badge-sku">
                  SKU: {item.type}
                </span>
              </div>
              <h1 className="spec-product-name">{item.name}</h1>
              <p className="spec-product-lead">{item.desc || 'โมดูลเฟอร์นิเจอร์เกมมิ่งมาตรฐานสำหรับการแข่งขันและการเปิดร้านอินเทอร์เน็ตอีสปอร์ต'}</p>
            </div>
          </div>

          {/* Visual Showcase: 3D Interactive Studio / Photo View */}
          <div className="spec-visual-showcase">
            <div className="visual-tabs-bar no-print">
              <button 
                type="button" 
                className={`visual-tab-btn ${activeMediaTab === '3d' ? 'active' : ''}`}
                onClick={() => setActiveMediaTab('3d')}
              >
                <Box size={14} />
                <span>มุมมอง 3 มิติสด (Interactive 3D Render)</span>
              </button>
              {item.image && (
                <button 
                  type="button" 
                  className={`visual-tab-btn ${activeMediaTab === 'photo' ? 'active' : ''}`}
                  onClick={() => setActiveMediaTab('photo')}
                >
                  <Monitor size={14} />
                  <span>ภาพถ่าย / ภาพปกจริง (Real Photo)</span>
                </button>
              )}
            </div>

            <div className="visual-content-stage">
              {activeMediaTab === '3d' ? (
                <ThreeProductViewer 
                  item={item} 
                  height="340px" 
                  autoRotateDefault={true}
                  showControls={true}
                />
              ) : (
                <div className="spec-photo-frame">
                  <img src={item.image} alt={item.imageAlt || item.name} />
                </div>
              )}
            </div>
          </div>

          {/* 3-Column Detailed Data Grid */}
          <div className="spec-three-grid">
            {/* Column 1: Dimensions & Space Footprint */}
            <div className="spec-subcard">
              <div className="spec-subcard-head">
                <Box size={16} className="text-blue" />
                <h4>มิติขนาด 3 มิติ (Dimensions)</h4>
              </div>
              <table className="spec-compact-table">
                <tbody>
                  <tr>
                    <td>ความกว้างรวม (Width):</td>
                    <td><strong>{widthMeters} เมตร</strong> ({Math.round(widthMeters * 100)} ซม.)</td>
                  </tr>
                  <tr>
                    <td>ความลึกรวม (Depth):</td>
                    <td><strong>{depthMeters} เมตร</strong> ({Math.round(depthMeters * 100)} ซม.)</td>
                  </tr>
                  <tr>
                    <td>ความสูงรวม 3D (Height):</td>
                    <td><strong>{heightMeters} เมตร</strong> ({Math.round(heightMeters * 100)} ซม.)</td>
                  </tr>
                  <tr>
                    <td>จำนวนที่นั่ง / จอ (Seats):</td>
                    <td><strong>{seats > 0 ? `${seats} ที่นั่ง` : 'ไม่มีที่นั่ง (ระบบส่วนกลาง)'}</strong></td>
                  </tr>
                  <tr>
                    <td>พื้นที่ติดตั้ง (Footprint):</td>
                    <td><strong>{floorArea} ตร.ม.</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Column 2: Color Palette & Materials */}
            <div className="spec-subcard">
              <div className="spec-subcard-head">
                <Palette size={16} className="text-blue" />
                <h4>โทนสีและวัสดุ (Color & Finishes)</h4>
              </div>
              <div className="spec-colors-breakdown">
                <div className="spec-color-item">
                  <div 
                    className="spec-color-chip" 
                    style={{ backgroundColor: item.deskColor || item.color || '#0f172a' }} 
                  />
                  <div>
                    <strong>สีท็อปโต๊ะ & โครงสร้าง</strong>
                    <code>{item.deskColor || item.color || '#0f172a'}</code>
                  </div>
                </div>

                <div className="spec-color-item">
                  <div 
                    className="spec-color-chip" 
                    style={{ backgroundColor: item.accentColor || '#1d4ed8' }} 
                  />
                  <div>
                    <strong>สีไฟ LED RGB & เส้นตกแต่ง</strong>
                    <code>{item.accentColor || '#1d4ed8'}</code>
                  </div>
                </div>

                <div className="spec-color-item">
                  <div 
                    className="spec-color-chip" 
                    style={{ backgroundColor: item.chairColor || '#0f172a' }} 
                  />
                  <div>
                    <strong>สีเบาะเก้าอี้เกมมิ่ง</strong>
                    <code>{item.chairColor || '#0f172a'}</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Engineering Standards & Warranty */}
            <div className="spec-subcard">
              <div className="spec-subcard-head">
                <Wrench size={16} className="text-blue" />
                <h4>มาตรฐานวิศวกรรม (Engineering)</h4>
              </div>
              <ul className="spec-feature-bullets">
                <li>
                  <CheckCircle2 size={13} className="text-emerald" />
                  <span>โครงสร้างเหล็กกล้าคาร์บอน Heavy-Duty รับน้ำหนัก 250+ กก.</span>
                </li>
                <li>
                  <CheckCircle2 size={13} className="text-emerald" />
                  <span>รางสายไฟแยกระบบ 220V และสายสัญญาณ CAT6A 10Gbps</span>
                </li>
                <li>
                  <CheckCircle2 size={13} className="text-emerald" />
                  <span>หน้าท็อป HPL ทนรอยขีดข่วน กันน้ำ และกันลามไฟ</span>
                </li>
                <li>
                  <Clock size={13} className="text-blue" />
                  <span>ระยะเวลาผลิต & ติดตั้ง: {item.leadTime || '7 - 14 วันทำการ'}</span>
                </li>
                <li>
                  <ShieldCheck size={13} className="text-blue" />
                  <span>การรับประกัน: {item.warranty || 'โครงสร้าง 5 ปี และระบบไฟ 3 ปี'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pricing & Commercial Quotation Breakdown Table */}
          <div className="spec-pricing-card">
            <div className="spec-subcard-head">
              <DollarSign size={16} className="text-blue" />
              <h4>สรุปโครงสร้างราคาและงบประมาณ (Commercial Price Breakdown)</h4>
            </div>

            <table className="spec-pricing-table">
              <thead>
                <tr>
                  <th>รายการอุปกรณ์ & ส่วนประกอบ</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>จำนวน</th>
                  <th style={{ width: '140px', textAlign: 'right' }}>ราคาต่อหน่วย (บาท)</th>
                  <th style={{ width: '160px', textAlign: 'right' }}>ราคารวม (บาท)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>โต๊ะเกมมิ่งและโครงสร้างเหล็กโมดูลาร์</strong>
                    <div className="text-muted text-xs">{item.deskDesc || 'โครงสร้างคาร์บอนสตีล รางร้อยสายไฟ และฉากกั้น'}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>1 ชุด</td>
                  <td style={{ textAlign: 'right' }}>฿{(item.deskPrice || 0).toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>฿{(item.deskPrice || 0).toLocaleString()}</td>
                </tr>

                {item.chairCount > 0 && (
                  <tr>
                    <td>
                      <strong>{item.chairModel || 'เก้าอี้เกมมิ่ง Ergonomic Racing'}</strong>
                      <div className="text-muted text-xs">พนักพิงปรับเอน 160° ไฮดรอลิก Class 4 รับน้ำหนัก 180 กก.</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.chairCount} ตัว</td>
                    <td style={{ textAlign: 'right' }}>฿{(item.chairPrice || 0).toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>฿{chairTotal.toLocaleString()}</td>
                  </tr>
                )}

                <tr className="spec-total-row">
                  <td colSpan={3}>
                    <strong>ราคารวมทั้งโมดูล (Total Module Base Cost - Excl. VAT)</strong>
                  </td>
                  <td className="text-blue" style={{ textAlign: 'right', fontSize: '1.15rem', fontWeight: 700 }}>
                    ฿{totalCost.toLocaleString()}
                  </td>
                </tr>

                <tr className="spec-vat-row">
                  <td colSpan={3}>ภาษีมูลค่าเพิ่มโดยประมาณ (Estimated VAT 7%)</td>
                  <td style={{ textAlign: 'right' }}>฿{vatAmount.toLocaleString()}</td>
                </tr>

                <tr className="spec-grand-row">
                  <td colSpan={3}>
                    <strong>ราคารวมสุทธิประเมินการ (Estimated Grand Total - Incl. VAT)</strong>
                  </td>
                  <td className="text-emerald" style={{ textAlign: 'right', fontSize: '1.25rem', fontWeight: 800 }}>
                    ฿{totalWithVat.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="spec-bulk-note">
              <Sparkles size={14} className="text-amber" />
              <span>
                <strong>สิทธิพิเศษแฟรนไชส์:</strong> สั่งซื้อสำหรับเปิดสาขา 10 โมดูลขึ้นไป รับส่วนลด Volume Discount 5% - 8% พร้อมบริการวางผังระบบ 3D Studio ฟรี
              </span>
            </div>
          </div>

          {/* Official Document Footer */}
          <div className="spec-doc-footer">
            <div className="spec-footer-col">
              <small>จัดทำและรับรองมาตรฐานโดย:</small>
              <div className="spec-signature-line">
                <strong>ฝ่ายวิศวกรรมโครงสร้างและจัดผังร้าน G-Speed Esport Arena</strong>
              </div>
            </div>
            <div className="spec-footer-col" style={{ textAlign: 'right' }}>
              <small>ระบบบริหารจัดการแคตตาล็อก & ผังร้าน 3D อัจฉริยะ</small>
              <div>gspeedlivingplus.com | โทร 02-888-9999</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
