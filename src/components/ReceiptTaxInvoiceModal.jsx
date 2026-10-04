import React from 'react';
import { X, Printer, FileText, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { thaiBahtText } from '../data/equipmentProducts';

export default function ReceiptTaxInvoiceModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const grandTotal = Number(order.pricing?.grandTotal || 0);
  const subtotal = Number(order.pricing?.subtotal || Math.round(grandTotal / 1.07));
  const vat = Number(order.pricing?.vat || (grandTotal - subtotal));
  const discount = Number(order.pricing?.discount || 0);

  const orderDateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : new Date().toLocaleDateString('th-TH');

  const customerName = order.taxInvoice?.companyName || order.shipping?.receiverName || order.customerName || 'ลูกค้าทั่วไป';
  const customerTaxId = order.taxInvoice?.taxId || '-';
  const customerBranch = order.taxInvoice?.branch || 'สำนักงานใหญ่';
  const customerAddress = order.shipping?.address || '-';

  return (
    <div className="shipping-label-modal-backdrop" onClick={onClose}>
      <div className="shipping-label-modal-card invoice-style" onClick={e => e.stopPropagation()}>
        {/* Modal Top Toolbar */}
        <div className="shipping-label-toolbar no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} className="text-blue" />
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
              ใบเสร็จรับเงิน / ใบกำกับภาษี (Receipt & Tax Invoice) - {order.orderNo}
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
              <span>พิมพ์ใบเสร็จ (Print)</span>
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

        {/* Printable Tax Invoice Sheet */}
        <div className="receipt-printable-sheet" id="printable-receipt-tax">
          {/* Header */}
          <div className="receipt-header-row">
            <div className="receipt-seller-col">
              <div className="receipt-logo-title">บริษัท จี สปีด ลิฟวิ่ง พลัส จำกัด</div>
              <div className="receipt-logo-sub">GSPEED LIVING PLUS CO., LTD.</div>
              <div className="receipt-seller-text">
                88/14 อาคารไอทีพลาซ่า ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240<br />
                เลขประจำตัวผู้เสียภาษีอากร: <strong>0105556098741</strong> (สำนักงานใหญ่)<br />
                โทรศัพท์: 089-456-7890 | อีเมล: support@gspeedlivingplus.com
              </div>
            </div>

            <div className="receipt-doc-meta">
              <div className="receipt-doc-title">ใบเสร็จรับเงิน / ใบกำกับภาษี</div>
              <div className="receipt-doc-subtitle">RECEIPT / TAX INVOICE (ต้นฉบับ)</div>
              <table className="receipt-meta-table">
                <tbody>
                  <tr>
                    <td>เลขที่เอกสาร:</td>
                    <td><strong>INV-{order.orderNo.replace('GLP-', '')}</strong></td>
                  </tr>
                  <tr>
                    <td>อ้างอิงออเดอร์:</td>
                    <td>{order.orderNo}</td>
                  </tr>
                  <tr>
                    <td>วันที่:</td>
                    <td>{orderDateStr}</td>
                  </tr>
                  <tr>
                    <td>สถานะการชำระ:</td>
                    <td><span className="receipt-paid-tag">ชำระเงินแล้ว 100%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer / Buyer Info */}
          <div className="receipt-buyer-card">
            <div className="buyer-col">
              <div className="buyer-label">ลูกค้า / ผู้ซื้อ (Customer):</div>
              <div className="buyer-name">{customerName}</div>
              <div className="buyer-address">{customerAddress}</div>
            </div>

            <div className="buyer-tax-col">
              <div>เลขประจำตัวผู้เสียภาษี: <strong>{customerTaxId}</strong></div>
              <div>สาขา: <strong>{customerBranch}</strong></div>
              <div>เบอร์โทรติดต่อ: {order.shipping?.phone || '-'}</div>
            </div>
          </div>

          {/* Items Table */}
          <table className="receipt-items-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>ลำดับ</th>
                <th>รายการสินค้า / รายละเอียดอุปกรณ์</th>
                <th style={{ width: '140px' }}>ตัวเลือก/สเปก</th>
                <th style={{ width: '60px', textAlign: 'center' }}>จำนวน</th>
                <th style={{ width: '120px', textAlign: 'right' }}>ราคา/หน่วย</th>
                <th style={{ width: '130px', textAlign: 'right' }}>จำนวนเงิน (฿)</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((it, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                  <td>
                    <strong>{it.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>SKU: {it.sku || '-'}</div>
                  </td>
                  <td>{it.color || '-'} {it.size ? `/ ${it.size}` : ''}</td>
                  <td style={{ textAlign: 'center', fontWeight: 800 }}>{it.quantity}</td>
                  <td style={{ textAlign: 'right' }}>฿{Number(it.unitPrice || 0).toLocaleString()}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>฿{Number(it.totalPrice || (it.unitPrice * it.quantity)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculations Summary */}
          <div className="receipt-calc-grid">
            <div className="receipt-baht-text-col">
              <div className="baht-box">
                <span className="baht-title">จำนวนเงินตัวอักษร:</span>
                <span className="baht-string">({thaiBahtText(grandTotal)})</span>
              </div>
              <div className="receipt-note-text">
                ✓ ราคาสินค้ารวมภาษีมูลค่าเพิ่ม 7% เรียบร้อยแล้ว<br />
                ✓ ชำระเงินผ่าน {order.paymentMethod === 'promptpay' ? 'QR พร้อมเพย์' : 'โอนเงินบัญชีธนาคาร'}<br />
                ✓ ได้รับเงินครบถ้วนเรียบร้อยแล้ว
              </div>
            </div>

            <div className="receipt-totals-col">
              <div className="calc-row">
                <span>มูลค่าสินค้ารวม:</span>
                <span>฿{subtotal.toLocaleString()}.-</span>
              </div>
              {discount > 0 && (
                <div className="calc-row discount">
                  <span>ส่วนลด:</span>
                  <span>-฿{discount.toLocaleString()}.-</span>
                </div>
              )}
              <div className="calc-row">
                <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                <span>฿{vat.toLocaleString()}.-</span>
              </div>
              <div className="calc-row grand-total">
                <span>ยอดเงินสุทธิทั้งสิ้น:</span>
                <span>฿{grandTotal.toLocaleString()}.-</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="receipt-sign-row">
            <div className="sign-box">
              <div className="sign-signature-line"></div>
              <div className="sign-name-title">ผู้รับเงิน / ผู้มีอำนาจลงนาม</div>
              <div className="sign-date-text">วันที่ {orderDateStr}</div>
            </div>

            <div className="sign-box">
              <div className="sign-signature-line"></div>
              <div className="sign-name-title">ผู้รับสินค้า / บริการ</div>
              <div className="sign-date-text">วันที่ ........................................</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
