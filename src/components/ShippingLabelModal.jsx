import React from 'react';
import { X, Printer, Package, Truck, Check, ShieldCheck, QrCode } from 'lucide-react';

export default function ShippingLabelModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
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

  return (
    <div className="shipping-label-modal-backdrop" onClick={onClose}>
      <div className="shipping-label-modal-card" onClick={e => e.stopPropagation()}>
        {/* Modal Top Toolbar (Hidden during printing) */}
        <div className="shipping-label-toolbar no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} className="text-blue" />
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
              ใบปะหน้ากล่องพัสดุ (Shipping Label) - {order.orderNo}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={handlePrint}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', fontSize: '0.88rem' }}
            >
              <Printer size={16} />
              <span>พิมพ์ใบปะหน้า (Print)</span>
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              style={{ padding: '8px 14px', fontSize: '0.88rem' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Label Sheet (Standard Shipping Slip Format) */}
        <div className="shipping-label-printable-sheet" id="printable-shipping-label">
          {/* Header Strip */}
          <div className="label-header-bar">
            <div className="label-brand-group">
              <span className="label-brand-badge">GLP</span>
              <div>
                <div className="label-brand-title">GSPEED LIVING PLUS</div>
                <div className="label-brand-subtitle">OFFICIAL ESPORTS ARENA & EQUIPMENT STORE</div>
              </div>
            </div>

            <div className="label-carrier-tag">
              <span>{order.shippingCarrier || 'KERRY EXPRESS'}</span>
            </div>
          </div>

          {/* Barcode & Tracking Row */}
          <div className="label-tracking-box">
            <div className="label-barcode-placeholder">
              {/* Simulated Code 128 Barcode lines */}
              <div className="simulated-barcode">
                <div className="bar w-2"></div><div className="bar w-1"></div><div className="bar w-3"></div><div className="bar w-1"></div>
                <div className="bar w-2"></div><div className="bar w-4"></div><div className="bar w-1"></div><div className="bar w-2"></div>
                <div className="bar w-3"></div><div className="bar w-1"></div><div className="bar w-2"></div><div className="bar w-3"></div>
                <div className="bar w-1"></div><div className="bar w-4"></div><div className="bar w-2"></div><div className="bar w-1"></div>
                <div className="bar w-3"></div><div className="bar w-2"></div><div className="bar w-1"></div><div className="bar w-3"></div>
              </div>
              <div className="tracking-code-text">
                TRACKING NO: {order.trackingNumber || `KEX-${order.orderNo.replace('GLP-', '')}`}
              </div>
            </div>

            <div className="label-order-meta">
              <div>เลขออเดอร์: <strong>{order.orderNo}</strong></div>
              <div>วันที่สั่ง: <strong>{orderDateStr}</strong></div>
              <div className="paid-stamp">✓ ชำระเงินแล้ว 100%</div>
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
              <div className="party-label highlight">ผู้รับพัสดุ (TO):</div>
              <div className="party-name recipient-name">{receiver.receiverName || order.customerName || 'ลูกค้า GLP'}</div>
              <div className="party-phone recipient-phone">
                เบอร์โทร: <strong>{receiver.phone || order.customerPhone || '-'}</strong>
              </div>
              <div className="party-address recipient-address">
                {receiver.address || 'ที่อยู่ตามใบสั่งซื้อ'}
              </div>
              {receiver.notes && (
                <div className="delivery-note">
                  📌 <strong>หมายเหตุ:</strong> {receiver.notes}
                </div>
              )}
            </div>
          </div>

          {/* Packing Items Checklist */}
          <div className="label-items-box">
            <div className="items-box-title">
              <Package size={13} />
              <span>รายการสินค้าภายในกล่องพัสดุ (Packing List Checklist):</span>
            </div>

            <table className="label-items-table">
              <thead>
                <tr>
                  <th style={{ width: '30px' }}>ตรวจ</th>
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
              <span>สินค้าทุกชิ้นผ่านการตรวจสอบคุณภาพ QC และรับประกันศูนย์แท้ 100% โดย Gspeed Living Plus</span>
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
      </div>
    </div>
  );
}
