import React, { useState } from 'react';
import { 
  X, Printer, Package, Truck, Check, ShieldCheck, 
  Download, FileText, CheckSquare, AlertTriangle, UserCheck, 
  Layers, Copy, ClipboardCheck
} from 'lucide-react';
import { downloadDocumentAsHtml } from '../utils/ecommerceAdminUtils';

export default function ShippingLabelModal({ order, onClose }) {
  if (!order) return null;

  // View Mode: 'both' (คู่ฉบับ 2 หน้า), 'customer' (ฉบับปิดหน้ากล่อง), 'store_pod' (คู่ฉบับมีลายเซ็นรับของ)
  const [viewMode, setViewMode] = useState('both');

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const container = document.getElementById('printable-shipping-container');
    if (!container) return;

    let filename = `GLP_ใบส่งสินค้า_คู่ฉบับ_${order.orderNo}.html`;
    let title = `ใบส่งสินค้าและใบปะหน้ากล่องพัสดุ (คู่ฉบับสมบูรณ์) - ${order.orderNo}`;

    if (viewMode === 'customer') {
      filename = `GLP_ใบปะหน้ากล่อง_${order.orderNo}.html`;
      title = `ใบปะหน้ากล่องพัสดุ (ฉบับลูกค้า) - ${order.orderNo}`;
    } else if (viewMode === 'store_pod') {
      filename = `GLP_ใบรับสินค้า_POD_คู่ฉบับ_${order.orderNo}.html`;
      title = `หลักฐานการรับมอบพัสดุ (คู่ฉบับร้านค้านำกลับ POD) - ${order.orderNo}`;
    }

    downloadDocumentAsHtml(filename, container.innerHTML, title);
  };

  const senderInfo = {
    name: 'บริษัท จี สปีด ลิฟวิ่ง พลัส จำกัด (GLP ESPORTS STORE)',
    address: '88/14 อาคารไอทีพลาซ่า ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240',
    phone: '089-456-7890, 02-345-6789'
  };

  const receiver = order.shipping || {};
  const orderDateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : new Date().toLocaleDateString('th-TH');

  const todayDateStr = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const totalItemsCount = (order.items || []).reduce((sum, it) => sum + (it.quantity || 1), 0);
  const trackingNumber = order.trackingNumber || `KEX-${(order.orderNo || 'GLP').replace('GLP-', '')}`;
  const carrierName = order.shippingCarrier || 'KERRY EXPRESS';

  return (
    <div className="shipping-label-modal-backdrop" onClick={onClose}>
      <div className="shipping-label-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '860px' }}>
        
        {/* Modal Top Toolbar (Hidden during printing) */}
        <div className="shipping-label-toolbar no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} className="text-blue" />
            <span style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0f172a' }}>
              ใบส่งสินค้า & ใบปะหน้ากล่องพัสดุ (คู่ฉบับ) - {order.orderNo}
            </span>
          </div>

          {/* Segmented Mode Selector */}
          <div className="label-mode-tabs">
            <button
              type="button"
              className={`label-mode-btn ${viewMode === 'both' ? 'active' : ''}`}
              onClick={() => setViewMode('both')}
              title="พิมพ์หรือดาวน์โหลดครบทั้ง 2 ฉบับ (ต้นฉบับ + คู่ฉบับรับสินค้า)"
            >
              <Layers size={14} />
              <span>คู่ฉบับครบชุด (2 หน้า)</span>
            </button>
            <button
              type="button"
              className={`label-mode-btn ${viewMode === 'customer' ? 'active' : ''}`}
              onClick={() => setViewMode('customer')}
              title="เฉพาะฉบับที่ 1: ติดหน้ากล่องพัสดุ"
            >
              <Package size={14} />
              <span>ฉบับที่ 1: ปิดหน้ากล่อง</span>
            </button>
            <button
              type="button"
              className={`label-mode-btn ${viewMode === 'store_pod' ? 'active' : ''}`}
              onClick={() => setViewMode('store_pod')}
              title="เฉพาะฉบับที่ 2: คู่ฉบับสำหรับร้านค้านำกลับ (มีลายเซ็นผู้รับ)"
            >
              <ClipboardCheck size={14} />
              <span>ฉบับที่ 2: มีลายเซ็นรับของ</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handlePrint}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '0.84rem' }}
            >
              <Printer size={15} />
              <span>พิมพ์ (Print/PDF)</span>
            </button>

            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleDownload}
              title="ดาวน์โหลดไฟล์เอกสาร HTML สำหรับเปิดดูหรือสั่งพิมพ์ออฟไลน์"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '0.84rem', background: '#0284c7', color: '#ffffff', borderColor: '#0284c7' }}
            >
              <Download size={15} />
              <span>ดาวน์โหลดไฟล์</span>
            </button>

            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              style={{ padding: '7px 12px', fontSize: '0.84rem' }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Printable Label Container */}
        <div id="printable-shipping-container">
          
          {/* =================================================================
              SHEET 1: CUSTOMER COPY (ต้นฉบับ: สำหรับปิดหน้ากล่องพัสดุ)
              ================================================================= */}
          {(viewMode === 'both' || viewMode === 'customer') && (
            <div className="shipping-label-printable-sheet" id="printable-sheet-customer">
              {/* Header Strip */}
              <div className="label-header-bar">
                <div className="label-brand-group">
                  <span className="label-brand-badge">GLP</span>
                  <div>
                    <div className="label-brand-title">GSPEED LIVING PLUS</div>
                    <div className="label-brand-subtitle">OFFICIAL ESPORTS ARENA & EQUIPMENT STORE</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="label-copy-tag customer">
                    ต้นฉบับ: ปิดหน้ากล่องพัสดุ (CUSTOMER COPY)
                  </span>
                  <div className="label-carrier-tag">
                    <span>{carrierName}</span>
                  </div>
                </div>
              </div>

              {/* Barcode & Tracking Row */}
              <div className="label-tracking-box">
                <div className="label-barcode-placeholder">
                  {/* Simulated Code 128 Barcode */}
                  <div className="simulated-barcode">
                    <div className="bar w-2"></div><div className="bar w-1"></div><div className="bar w-3"></div><div className="bar w-1"></div>
                    <div className="bar w-2"></div><div className="bar w-4"></div><div className="bar w-1"></div><div className="bar w-2"></div>
                    <div className="bar w-3"></div><div className="bar w-1"></div><div className="bar w-2"></div><div className="bar w-3"></div>
                    <div className="bar w-1"></div><div className="bar w-4"></div><div className="bar w-2"></div><div className="bar w-1"></div>
                    <div className="bar w-3"></div><div className="bar w-2"></div><div className="bar w-1"></div><div className="bar w-3"></div>
                  </div>
                  <div className="tracking-code-text">
                    TRACKING NO: {trackingNumber}
                  </div>
                </div>

                <div className="label-order-meta">
                  <div>เลขออเดอร์: <strong>{order.orderNo}</strong></div>
                  <div>วันที่สั่งซื้อ: <strong>{orderDateStr}</strong></div>
                  <div className="paid-stamp">✓ ชำระเงินแล้ว 100% (PAID)</div>
                </div>
              </div>

              {/* Sender & Receiver 2-Column Grid */}
              <div className="label-parties-grid">
                {/* Sender */}
                <div className="party-box sender">
                  <div className="party-label">ผู้ส่ง (FROM):</div>
                  <div className="party-name">{senderInfo.name}</div>
                  <div className="party-address">{senderInfo.address}</div>
                  <div className="party-phone">โทรศัพท์: <strong>{senderInfo.phone}</strong></div>
                </div>

                {/* Receiver */}
                <div className="party-box receiver">
                  <div className="party-label highlight">ผู้รับพัสดุปลายทาง (DELIVER TO):</div>
                  <div className="party-name recipient-name">{receiver.receiverName || order.customerName || 'ลูกค้า GLP'}</div>
                  <div className="party-phone recipient-phone">
                    เบอร์โทรศัพท์: <strong>{receiver.phone || order.customerPhone || '-'}</strong>
                  </div>
                  <div className="party-address recipient-address">
                    {receiver.address || 'ที่อยู่ตามใบสั่งซื้อ'}
                  </div>
                  {receiver.notes && (
                    <div className="delivery-note">
                      📌 <strong>หมายเหตุผู้รับ:</strong> {receiver.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Packing Items Checklist */}
              <div className="label-items-box">
                <div className="items-box-title">
                  <Package size={13} />
                  <span>รายการสินค้าภายในกล่องพัสดุ (Packing List Checklist - รวม {totalItemsCount} ชิ้น):</span>
                </div>

                <table className="label-items-table">
                  <thead>
                    <tr>
                      <th style={{ width: '36px', textAlign: 'center' }}>ตรวจ</th>
                      <th>รายการอุปกรณ์</th>
                      <th style={{ width: '130px' }}>ตัวเลือก/สเปก</th>
                      <th style={{ width: '60px', textAlign: 'center' }}>จำนวน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((it, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: 'center' }}>
                          <div className="check-square"></div>
                        </td>
                        <td>
                          <strong>{it.name}</strong>
                          <span className="item-sku">SKU: {it.sku || '-'}</span>
                        </td>
                        <td>{it.color || '-'} {it.size ? `/ ${it.size}` : ''}</td>
                        <td style={{ textAlign: 'center', fontWeight: 800 }}>{it.quantity || 1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures & Quality Guarantee */}
              <div className="label-footer-grid">
                <div className="label-guarantee-note">
                  <ShieldCheck size={16} />
                  <span>สินค้าทุกชิ้นผ่านการตรวจสอบคุณภาพ QC บรรจุหีบห่ออย่างแน่นหนา และรับประกันศูนย์แท้ 100% โดย Gspeed Living Plus</span>
                </div>

                <div className="sign-columns">
                  <div className="sign-col">
                    <div className="sign-line"></div>
                    <div className="sign-label">ผู้บรรจุหีบห่อ (QC Staff)</div>
                  </div>
                  <div className="sign-col">
                    <div className="sign-line"></div>
                    <div className="sign-label">เจ้าหน้าที่ขนส่งเข้ารับ</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page break divider when both copies are rendered together */}
          {viewMode === 'both' && (
            <div className="sheet-page-break"></div>
          )}

          {/* =================================================================
              SHEET 2: STORE COPY / PROOF OF DELIVERY (คู่ฉบับสำหรับร้านค้า)
              มีส่วนลงลายมือชื่อผู้รับพัสดุส่งคืนร้านค้า (Proof of Delivery: POD)
              ================================================================= */}
          {(viewMode === 'both' || viewMode === 'store_pod') && (
            <div className="shipping-label-printable-sheet" id="printable-sheet-store">
              {/* Header Strip */}
              <div className="label-header-bar">
                <div className="label-brand-group">
                  <span className="label-brand-badge" style={{ background: '#ca8a04', color: '#000' }}>POD</span>
                  <div>
                    <div className="label-brand-title">GSPEED LIVING PLUS</div>
                    <div className="label-brand-subtitle">ฝ่ายคลังสินค้าและการจัดส่ง (LOGISTICS & FULFILLMENT CENTER)</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="label-copy-tag store">
                    ★ คู่ฉบับสำหรับร้านค้านำกลับ (STORE COPY - PROOF OF DELIVERY)
                  </span>
                  <div className="label-carrier-tag">
                    <span>{carrierName}</span>
                  </div>
                </div>
              </div>

              {/* Crucial Directive Banner for Courier Driver */}
              <div className="pod-directive-banner">
                <AlertTriangle size={16} style={{ flexShrink: 0, color: '#ca8a04' }} />
                <span>
                  <strong>เอกสารสำคัญ (โปรดนำส่งคืนร้านค้า):</strong> เจ้าหน้าที่จัดส่งต้องให้ผู้รับพัสดุลงลายมือชื่อและตรวจรับมอบสินค้าตัวจริง จากนั้นนำเอกสารคู่ฉบับนี้ส่งคืนฝ่ายคลังสินค้า/แอดมิน GLP เพื่อเป็นหลักฐานยืนยันการรับมอบสินค้าสมบูรณ์
                </span>
              </div>

              {/* Barcode & Tracking Row */}
              <div className="label-tracking-box">
                <div className="label-barcode-placeholder">
                  <div className="simulated-barcode">
                    <div className="bar w-2"></div><div className="bar w-1"></div><div className="bar w-3"></div><div className="bar w-1"></div>
                    <div className="bar w-2"></div><div className="bar w-4"></div><div className="bar w-1"></div><div className="bar w-2"></div>
                    <div className="bar w-3"></div><div className="bar w-1"></div><div className="bar w-2"></div><div className="bar w-3"></div>
                    <div className="bar w-1"></div><div className="bar w-4"></div><div className="bar w-2"></div><div className="bar w-1"></div>
                    <div className="bar w-3"></div><div className="bar w-2"></div><div className="bar w-1"></div><div className="bar w-3"></div>
                  </div>
                  <div className="tracking-code-text">
                    TRACKING NO: {trackingNumber}
                  </div>
                </div>

                <div className="label-order-meta">
                  <div>เลขออเดอร์: <strong>{order.orderNo}</strong></div>
                  <div>วันที่จัดส่ง: <strong>{todayDateStr}</strong></div>
                  <div className="paid-stamp">ยอดเงิน: ฿{Number(order.pricing?.grandTotal || 0).toLocaleString()} (ชำระแล้ว)</div>
                </div>
              </div>

              {/* Sender & Receiver 2-Column Grid */}
              <div className="label-parties-grid">
                {/* Sender */}
                <div className="party-box sender">
                  <div className="party-label">ผู้ส่ง (CONSIGNOR):</div>
                  <div className="party-name">{senderInfo.name}</div>
                  <div className="party-address">{senderInfo.address}</div>
                  <div className="party-phone">โทรศัพท์: <strong>{senderInfo.phone}</strong></div>
                </div>

                {/* Receiver */}
                <div className="party-box receiver">
                  <div className="party-label highlight">ผู้รับพัสดุปลายทาง (CONSIGNEE):</div>
                  <div className="party-name recipient-name">{receiver.receiverName || order.customerName || 'ลูกค้า GLP'}</div>
                  <div className="party-phone recipient-phone">
                    เบอร์โทรศัพท์: <strong>{receiver.phone || order.customerPhone || '-'}</strong>
                  </div>
                  <div className="party-address recipient-address">
                    {receiver.address || 'ที่อยู่ตามใบสั่งซื้อ'}
                  </div>
                  {receiver.notes && (
                    <div className="delivery-note">
                      📌 <strong>หมายเหตุผู้รับ:</strong> {receiver.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Summary */}
              <div className="label-items-box">
                <div className="items-box-title">
                  <Package size={13} />
                  <span>รายการสินค้าและอุปกรณ์ที่ส่งมอบ (Delivery Items - รวม {totalItemsCount} ชิ้น):</span>
                </div>

                <table className="label-items-table">
                  <thead>
                    <tr>
                      <th style={{ width: '36px', textAlign: 'center' }}>ลำดับ</th>
                      <th>รายการอุปกรณ์</th>
                      <th style={{ width: '130px' }}>ตัวเลือก/สเปก</th>
                      <th style={{ width: '60px', textAlign: 'center' }}>จำนวน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((it, i) => (
                      <tr key={i}>
                        <td style={{ textAlign: 'center', color: '#64748b' }}>{i + 1}</td>
                        <td>
                          <strong>{it.name}</strong>
                          <span className="item-sku">SKU: {it.sku || '-'}</span>
                        </td>
                        <td>{it.color || '-'} {it.size ? `/ ${it.size}` : ''}</td>
                        <td style={{ textAlign: 'center', fontWeight: 800 }}>{it.quantity || 1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Condition Inspection Checklist */}
              <div className="pod-inspection-box">
                <div className="pod-inspection-title">
                  <CheckSquare size={14} className="text-blue" />
                  <span>การตรวจสอบสภาพกล่องและพัสดุ ณ จุดส่งมอบ (Package Condition Inspection):</span>
                </div>
                <div className="pod-inspection-grid">
                  <label className="pod-check-item">
                    <span className="check-square" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}></span>
                    <span>1. กล่องพัสดุและบรรจุภัณฑ์อยู่ในสภาพสมบูรณ์ ไม่มีการฉีกขาด ยุบตัว หรือถูกเปิดออกก่อนถึงมือผู้รับ</span>
                  </label>
                  <label className="pod-check-item">
                    <span className="check-square" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}></span>
                    <span>2. ตรวจสอบจำนวนกล่อง/หีบห่อ ถูกต้องตรงตามใบส่งมอบพัสดุครบถ้วน</span>
                  </label>
                  <label className="pod-check-item">
                    <span className="check-square" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}></span>
                    <span>3. กรณีพัสดุมีตำหนิ/ชำรุด ระบุหมายเหตุ: ....................................................................................................</span>
                  </label>
                </div>
              </div>

              {/* 3-Column Signature Grid (Proof of Delivery Signatures) */}
              <div className="pod-sign-grid">
                {/* 1. Receiver Signature (Most Important) */}
                <div className="pod-sign-card highlight">
                  <div className="pod-sign-card-title">
                    ✍️ ลายมือชื่อผู้รับมอบพัสดุ (Received By)
                  </div>
                  <div className="pod-sign-slot"></div>
                  <div className="pod-sign-field">
                    ชื่อตัวบรรจง: (............................................................)
                  </div>
                  <div className="pod-sign-field">
                    เบอร์โทรผู้รับ: ............................................................
                  </div>
                  <div className="pod-sign-field">
                    วันที่รับ: ......../......../............ เวลา: ............. น.
                  </div>
                  <div className="pod-sign-field" style={{ fontSize: '9px', color: '#64748b' }}>
                    [ ] ผู้รับตามจ่าหน้า &nbsp; [ ] ตัวแทนรับมอบแทน
                  </div>
                </div>

                {/* 2. Courier Driver Signature */}
                <div className="pod-sign-card">
                  <div className="pod-sign-card-title">
                    🚚 เจ้าหน้าที่จัดส่งพัสดุ (Delivered By)
                  </div>
                  <div className="pod-sign-slot"></div>
                  <div className="pod-sign-field">
                    ชื่อพนักงานส่ง: (..........................................................)
                  </div>
                  <div className="pod-sign-field">
                    ทะเบียนรถ/สายส่ง: .......................................................
                  </div>
                  <div className="pod-sign-field">
                    วันที่ส่งมอบ: ......../......../............
                  </div>
                  <div className="pod-sign-field" style={{ fontSize: '9px', color: '#64748b' }}>
                    สังกัด: {carrierName}
                  </div>
                </div>

                {/* 3. Warehouse Return Verification */}
                <div className="pod-sign-card">
                  <div className="pod-sign-card-title">
                    🏢 เจ้าหน้าที่คลัง GLP ตรวจรับเอกสารคืน
                  </div>
                  <div className="pod-sign-slot"></div>
                  <div className="pod-sign-field">
                    ผู้ตรวจรับคืน: (............................................................)
                  </div>
                  <div className="pod-sign-field">
                    วันที่รับเอกสารคืน: ......../......../............
                  </div>
                  <div className="pod-sign-field" style={{ fontSize: '9px', color: '#166534', fontWeight: 700 }}>
                    [ ] ตรวจรับ POD และปิดงานในระบบ
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
