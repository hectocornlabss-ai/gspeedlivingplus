import React, { useState } from 'react';
import { 
  X, Check, AlertTriangle, Truck, Eye, Printer, 
  ExternalLink, Copy, Send, Mail, MessageSquare, 
  Plus, Trash2, Calendar, User, MapPin, Building2, 
  FileText, ShieldCheck, Clock, CheckCircle2, ZoomIn, 
  Edit3, Save, ChevronDown, PackageCheck, AlertCircle, ShoppingBag
} from 'lucide-react';
import { ORDER_STATUS_CONFIG } from './StoreOrdersAndProductsCMS';
import { buildOrderStatusEmailTemplate, dispatchOrderStatusEmail } from '../utils/orderEmailService';
import './WooCommerceOrderEditor.css';

export default function WooCommerceOrderEditor({
  order,
  onClose,
  onSaveOrder,
  onApproveSlip,
  onFlagSlipIssue,
  onDeleteOrder,
  onPrintShippingLabel,
  onPrintReceipt,
  productsList = [],
  siteData = {},
  showToast = () => {}
}) {
  if (!order) return null;

  // Local Editable State
  const [status, setStatus] = useState(order.status || 'order_received');
  const [statusNote, setStatusNote] = useState(order.statusNote || '');
  const [shippingCarrier, setShippingCarrier] = useState(order.shippingCarrier || 'Kerry Express');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [isPreviewingEmail, setIsPreviewingEmail] = useState(false);
  const [emailPreviewType, setEmailPreviewType] = useState(order.status === 'shipping' ? 'shipping' : order.status === 'delivered' ? 'delivered' : 'payment_verified');
  
  // Edit toggles for Billing & Shipping
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  
  // Billing Form
  const [billingCompany, setBillingCompany] = useState(order.taxInvoice?.companyName || order.shipping?.receiverName || '');
  const [billingTaxId, setBillingTaxId] = useState(order.taxInvoice?.taxId || '');
  const [billingBranch, setBillingBranch] = useState(order.taxInvoice?.branch || 'สำนักงานใหญ่');
  
  // Shipping Form
  const [receiverName, setReceiverName] = useState(order.shipping?.receiverName || '');
  const [phone, setPhone] = useState(order.shipping?.phone || '');
  const [email, setEmail] = useState(order.shipping?.email || '');
  const [address, setAddress] = useState(order.shipping?.address || '');
  const [notes, setNotes] = useState(order.shipping?.notes || '');

  // Order Items (Editable list)
  const [items, setItems] = useState(order.items || []);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [selectedProductIdToAdd, setSelectedProductIdToAdd] = useState(productsList[0]?.id || '');

  // Slip Zoom Modal
  const [isZoomingSlip, setIsZoomingSlip] = useState(false);

  // Order Notes Stream (WooCommerce Notes)
  const [orderNotes, setOrderNotes] = useState(() => {
    if (Array.isArray(order.orderNotes) && order.orderNotes.length > 0) {
      return order.orderNotes;
    }
    const defaultNotes = [
      {
        id: 'n1',
        content: `คำสั่งซื้อถูกสร้างเข้าระบบผ่านหน้าเว็บเรียบร้อยแล้ว ยอดชำระ ฿${(order.pricing?.grandTotal || 0).toLocaleString()}.-`,
        type: 'customer',
        createdAt: order.createdAt || new Date().toISOString(),
        author: 'ระบบอัตโนมัติ (System)'
      }
    ];
    if (order.hasSlipUploaded) {
      defaultNotes.unshift({
        id: 'n2',
        content: `ลูกค้าแนบหลักฐานการชำระเงิน (${order.slipFileName || 'สลิปโอนเงิน'}) เข้าสู่ระบบ`,
        type: 'customer',
        createdAt: order.slipUploadedAt || order.createdAt || new Date().toISOString(),
        author: 'ลูกค้า (Customer)'
      });
    }
    if (order.status === 'payment_verified') {
      defaultNotes.unshift({
        id: 'n3',
        content: 'ตรวจสอบยอดเงินและอนุมัติสลิปเรียบร้อยแล้ว',
        type: 'private',
        createdAt: new Date().toISOString(),
        author: 'Admin'
      });
    }
    return defaultNotes;
  });

  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState('private'); // 'private' | 'customer'

  // Selected Order Action in Sidebar
  const [selectedAction, setSelectedAction] = useState('save');

  // Recalculate totals
  const subtotal = items.reduce((sum, it) => sum + ((it.unitPrice || 0) * (it.quantity || 1)), 0);
  const discount = order.pricing?.discount || 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const vat = Math.round(taxableAmount * 0.07);
  const grandTotal = taxableAmount + vat;

  // Carrier tracking link generator
  const getCarrierTrackUrl = (carrier, trackNo) => {
    if (!trackNo) return null;
    const cleanTrack = encodeURIComponent(trackNo.trim());
    const c = (carrier || '').toLowerCase();
    if (c.includes('kerry') || c.includes('kex')) return `https://th.kerryexpress.com/th/track/?track=${cleanTrack}`;
    if (c.includes('flash')) return `https://www.flashexpress.co.th/tracking/?se=${cleanTrack}`;
    if (c.includes('ems') || c.includes('ไปรษณีย์') || c.includes('thailand post')) return `https://track.thailandpost.co.th/?trackNumber=${cleanTrack}`;
    if (c.includes('scg')) return `https://www.scgexpress.co.th/tracking/detail/${cleanTrack}`;
    if (c.includes('j&t') || c.includes('jt')) return `https://www.jtexpress.co.th/index/query/gzquery.html?bills=${cleanTrack}`;
    return `https://www.google.com/search?q=${encodeURIComponent(`${carrier} ${trackNo}`)}`;
  };

  // Add Item to Order
  const handleAddItem = () => {
    const prod = productsList.find(p => p.id === selectedProductIdToAdd);
    if (!prod) return;

    const newItem = {
      id: prod.id,
      sku: prod.sku,
      name: prod.name,
      color: prod.colors?.[0]?.name || '',
      size: prod.sizes?.[0]?.name || '',
      unitPrice: prod.price,
      quantity: 1,
      totalPrice: prod.price,
      image: prod.image
    };

    setItems(prev => [...prev, newItem]);
    setIsAddingItem(false);
    showToast(`เพิ่ม ${prod.name} ลงในคำสั่งซื้อแล้ว`);
  };

  // Remove Item
  const handleRemoveItem = (idx) => {
    if (items.length <= 1) {
      alert('คำสั่งซื้อต้องมีรายการสินค้าอย่างน้อย 1 รายการ');
      return;
    }
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  // Update Item Quantity
  const handleUpdateItemQty = (idx, newQty) => {
    const q = Math.max(1, parseInt(newQty, 10) || 1);
    setItems(prev => prev.map((item, i) => i === idx ? {
      ...item,
      quantity: q,
      totalPrice: item.unitPrice * q
    } : item));
  };

  // Add Note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const noteObj = {
      id: `note-${Date.now()}`,
      content: newNoteContent.trim(),
      type: newNoteType,
      createdAt: new Date().toISOString(),
      author: 'Admin (ผู้ดูแลระบบ)'
    };

    setOrderNotes(prev => [noteObj, ...prev]);
    setNewNoteContent('');
    showToast('เพิ่มบันทึกช่วยจำในคำสั่งซื้อแล้ว');
  };

  // Generate LINE Formatted Message
  const getLineNotificationText = () => {
    const itemsText = items.map((it, idx) => 
      `${idx + 1}. ${it.name} (${it.color || '-'} ${it.size ? `/ ${it.size}` : ''}) x ${it.quantity} = ฿${(it.unitPrice * it.quantity).toLocaleString()}.-`
    ).join('\n');

    return `🛒 [แจ้งเตือนคำสั่งซื้อใหม่ - GLP Store]
━━━━━━━━━━━━━━━━━━━━
📦 เลขที่คำสั่งซื้อ: ${order.orderNo}
📅 วันที่สั่งซื้อ: ${new Date(order.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.
สถานะ: ${ORDER_STATUS_CONFIG[status]?.label || status}

👤 ข้อมูลลูกค้า:
• ผู้รับ: ${receiverName || 'ไม่ระบุชื่อ'}
• เบอร์ติดต่อ: ${phone || '-'}
• อีเมล: ${email || '-'}
• ที่อยู่จัดส่ง: ${address || '-'}
${notes ? `• หมายเหตุ: ${notes}\n` : ''}
📋 รายการสินค้า (${items.length} รายการ):
${itemsText}

💰 สรุปยอดเงิน:
• ยอดรวมสุทธิ: ฿${grandTotal.toLocaleString()}.- (รวม VAT 7%)
• วิธีชำระเงิน: ${order.paymentMethod === 'promptpay' ? 'พร้อมเพย์ QR Code' : 'โอนเงินผ่านธนาคาร'}
• สถานะสลิป: ${order.hasSlipUploaded ? '✓ แนบสลิปเรียบร้อยแล้ว' : 'ยังไม่ได้แนบสลิป'}
${trackingNumber ? `🚚 ขนส่ง: ${shippingCarrier} (เลขพัสดุ: ${trackingNumber})\n` : ''}
🔗 ตรวจสอบสถานะลูกค้า:
https://gspeedarena.com/orders/${order.orderNo}
━━━━━━━━━━━━━━━━━━━━`;
  };

  // Send to LINE Group
  const handleSendToLineGroup = () => {
    const msg = getLineNotificationText();
    
    // Check if LINE webhook is configured
    const webhookUrl = siteData.omnichannelConfig?.lineWebhookUrl || siteData.webhooks?.leadWebhookUrl;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'new_store_order',
          orderNo: order.orderNo,
          message: msg,
          orderData: { ...order, items, status, shippingCarrier, trackingNumber }
        })
      }).catch(err => console.warn('LINE Webhook dispatch failed', err));
    }

    // Add note to order
    const noteObj = {
      id: `note-line-${Date.now()}`,
      content: `ส่งข้อความแจ้งเตือนคำสั่งซื้อเข้า LINE กลุ่มทีมงาน & ฝ่ายจัดส่งเรียบร้อยแล้ว`,
      type: 'private',
      createdAt: new Date().toISOString(),
      author: 'ระบบ LINE Notify'
    };
    setOrderNotes(prev => [noteObj, ...prev]);

    showToast(`ส่งแจ้งเตือนออเดอร์ ${order.orderNo} เข้ากลุ่ม LINE สำเร็จเรียบร้อยแล้ว!`);
  };

  // Copy LINE Message to Clipboard
  const handleCopyLineText = () => {
    const msg = getLineNotificationText();
    navigator.clipboard?.writeText(msg);
    showToast('คัดลอกข้อความสรุปสำหรับส่งใน LINE เรียบร้อยแล้ว');
  };

  // Send Customer Email (Status-Aware with carrier & tracking links)
  const handleSendCustomerEmail = async (overrideType) => {
    const targetEmail = email || order.shipping?.email;
    if (!targetEmail) {
      showToast('ไม่พบอีเมลของลูกค้า กรุณาระบุอีเมลก่อนดำเนินการส่ง');
      return;
    }

    const typeToSend = overrideType || (status === 'shipping' ? 'shipping' : status === 'delivered' ? 'delivered' : status === 'preparing_items' ? 'preparing_items' : 'payment_verified');

    try {
      await dispatchOrderStatusEmail({
        ...order,
        items,
        status,
        shippingCarrier,
        trackingNumber,
        customerEmail: targetEmail,
        shipping: { receiverName, phone, email: targetEmail, address, notes },
        pricing: { grandTotal }
      }, typeToSend, { carrier: shippingCarrier, trackingNo: trackingNumber });

      const statusTitle = ORDER_STATUS_CONFIG[status]?.label || status;
      const noteObj = {
        id: `note-email-${Date.now()}`,
        content: `ส่งอีเมลแจ้งสถานะ (${statusTitle}) ไปยังลูกค้า (${targetEmail}) เรียบร้อยแล้ว ${trackingNumber ? `[ขนส่ง: ${shippingCarrier} เลขพัสดุ: ${trackingNumber}]` : ''}`,
        type: 'customer',
        createdAt: new Date().toISOString(),
        author: 'ระบบอีเมล (SMTP / Relay)'
      };
      setOrderNotes(prev => [noteObj, ...prev]);

      showToast(`ส่งอีเมลแจ้งสถานะไปยัง ${targetEmail} สำเร็จเรียบร้อยแล้ว! 📧`);
      setIsPreviewingEmail(false);
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการส่งอีเมล');
    }
  };

  // Save All Changes (WooCommerce Update Button)
  const handleSaveAll = () => {
    const updatedPayload = {
      status,
      statusNote: statusNote.trim(),
      shippingCarrier: shippingCarrier.trim(),
      trackingNumber: trackingNumber.trim(),
      shipping: {
        receiverName: receiverName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        notes: notes.trim()
      },
      taxInvoice: order.taxInvoice || billingTaxId ? {
        companyName: billingCompany.trim(),
        taxId: billingTaxId.trim(),
        branch: billingBranch.trim()
      } : null,
      items,
      pricing: {
        ...order.pricing,
        subtotal,
        vat,
        grandTotal,
        amountPaid: grandTotal
      },
      orderNotes
    };

    onSaveOrder(order.orderNo, updatedPayload);
    setIsEditingBilling(false);
    setIsEditingShipping(false);
    showToast(`บันทึกการแก้ไขคำสั่งซื้อ ${order.orderNo} สำเร็จ (Order Updated)`);
  };

  return (
    <div className="woo-order-editor-backdrop" onClick={onClose}>
      <div className="woo-order-editor-container" onClick={e => e.stopPropagation()}>
        {/* WooCommerce Header Bar */}
        <div className="woo-editor-header">
          <div className="woo-header-left">
            <div className="woo-order-icon-badge">
              <ShoppingBag size={22} />
            </div>
            <div className="woo-header-title-box">
              <h2>
                <span>คำสั่งซื้อ #{order.orderNo}</span>
                <span 
                  className={`order-status-badge status-${status}`}
                  style={{ fontSize: '0.82rem', padding: '3px 10px', borderRadius: '12px' }}
                >
                  {ORDER_STATUS_CONFIG[status]?.label || status}
                </span>
              </h2>
              <div className="woo-header-meta">
                <span>การชำระเงิน: <strong>{order.paymentMethod === 'promptpay' ? 'พร้อมเพย์ QR Code (100%)' : 'โอนเงินผ่านธนาคาร'}</strong></span>
                <span>•</span>
                <span>สั่งซื้อเมื่อ: {new Date(order.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.</span>
                <span>•</span>
                <span>ช่องทาง: Web Store (ลูกค้าทั่วไป)</span>
              </div>
            </div>
          </div>

          <div className="woo-header-right">
            <a 
              href={`/orders/${order.orderNo}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="button-woo-secondary"
              style={{ width: 'auto', padding: '6px 12px' }}
              title="เปิดดูหน้าติดตามออเดอร์ของลูกค้า"
            >
              <ExternalLink size={14} />
              <span>ดูหน้าลูกค้า (Frontend) ↗</span>
            </a>

            <button 
              type="button" 
              className="btn-woo-close"
              onClick={onClose}
              title="ปิดและกลับไปหน้ารายการออเดอร์"
            >
              <X size={18} />
              <span>ปิด (Close)</span>
            </button>
          </div>
        </div>

        {/* WooCommerce 2-Column Body */}
        <div className="woo-editor-body">
          {/* =========================================================
              LEFT / MAIN COLUMN (70% WIDTH)
              ========================================================= */}
          <div className="woo-main-column">
            {/* POSTBOX 1: ORDER DETAILS (GENERAL, BILLING, SHIPPING) */}
            <div className="woo-postbox">
              <div className="woo-postbox-header">
                <h3 className="woo-postbox-title">
                  <FileText size={16} className="text-blue" />
                  <span>ข้อมูลคำสั่งซื้อ (Order Details)</span>
                </h3>
              </div>

              <div className="woo-postbox-inside">
                <div className="woo-details-grid">
                  {/* General Details Column */}
                  <div className="woo-detail-col">
                    <div className="woo-col-head">
                      <h4>ข้อมูลทั่วไป (General)</h4>
                    </div>

                    <div className="woo-field-group">
                      <label className="woo-field-label">วันที่สั่งซื้อ (Date Created):</label>
                      <input 
                        type="text" 
                        className="woo-input-text" 
                        value={new Date(order.createdAt).toLocaleString('th-TH')}
                        disabled
                        style={{ background: '#f8fafc', color: '#64748b' }}
                      />
                    </div>

                    <div className="woo-field-group">
                      <label className="woo-field-label">สถานะคำสั่งซื้อ (Order Status):</label>
                      <select 
                        className="woo-select-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="order_received">รอการชำระเงิน (Pending payment)</option>
                        <option value="verifying_payment">รอตรวจสอบสลิป (On hold / Verifying)</option>
                        <option value="payment_verified">ตรวจสอบยอดเงินแล้ว (Processing / Verified)</option>
                        <option value="preparing_items">กำลังจัดเตรียมของ (Preparing items)</option>
                        <option value="shipping">กำลังจัดส่ง (Out for delivery)</option>
                        <option value="delivered">จัดส่งสำเร็จ (Delivered / Completed)</option>
                        <option value="payment_issue">สลิปมีปัญหา / รอแก้ไข (Payment issue)</option>
                      </select>
                    </div>

                    <div className="woo-field-group">
                      <label className="woo-field-label">หมายเหตุสถานะ (Status Note):</label>
                      <input 
                        type="text" 
                        className="woo-input-text"
                        placeholder="เช่น จัดส่งผ่าน Kerry เรียบร้อยแล้ว"
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                      />
                    </div>

                    <div className="woo-field-group">
                      <label className="woo-field-label">รหัสสมาชิกผู้สั่งซื้อ (Customer ID):</label>
                      <div style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                        {order.userId ? `ID: ${order.userId}` : 'ลูกค้าสั่งซื้อทั่วไป (Guest)'}
                      </div>
                    </div>
                  </div>

                  {/* Billing Details Column */}
                  <div className="woo-detail-col">
                    <div className="woo-col-head">
                      <h4>ที่อยู่ออกใบกำกับภาษี (Billing)</h4>
                      <button 
                        type="button" 
                        className="btn-woo-edit-toggle"
                        onClick={() => setIsEditingBilling(!isEditingBilling)}
                      >
                        <Edit3 size={12} />
                        <span>{isEditingBilling ? 'ยกเลิก' : 'แก้ไข'}</span>
                      </button>
                    </div>

                    {isEditingBilling ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                          <label className="woo-field-label">ชื่อบริษัท / ผู้ชำระเงิน:</label>
                          <input 
                            type="text" 
                            className="woo-input-text" 
                            value={billingCompany}
                            onChange={(e) => setBillingCompany(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="woo-field-label">เลขประจำตัวผู้เสียภาษี 13 หลัก:</label>
                          <input 
                            type="text" 
                            className="woo-input-text" 
                            value={billingTaxId}
                            onChange={(e) => setBillingTaxId(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="woo-field-label">สาขา (Branch):</label>
                          <input 
                            type="text" 
                            className="woo-input-text" 
                            value={billingBranch}
                            onChange={(e) => setBillingBranch(e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="woo-display-address">
                        <strong>{billingCompany || 'ไม่ประสงค์ขอใบกำกับภาษีเต็มรูป'}</strong>
                        {billingTaxId && (
                          <div style={{ marginTop: '4px', color: '#475569' }}>
                            เลขผู้เสียภาษี: <strong>{billingTaxId}</strong> ({billingBranch})
                          </div>
                        )}
                        <div style={{ marginTop: '6px', color: '#64748b' }}>
                          อีเมล: {email || '-'}<br />
                          เบอร์โทร: {phone || '-'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shipping Details Column */}
                  <div className="woo-detail-col">
                    <div className="woo-col-head">
                      <h4>ที่อยู่จัดส่งและติดตั้ง (Shipping)</h4>
                      <button 
                        type="button" 
                        className="btn-woo-edit-toggle"
                        onClick={() => setIsEditingShipping(!isEditingShipping)}
                      >
                        <Edit3 size={12} />
                        <span>{isEditingShipping ? 'ยกเลิก' : 'แก้ไข'}</span>
                      </button>
                    </div>

                    {isEditingShipping ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                          <label className="woo-field-label">ชื่อผู้รับสินค้า:</label>
                          <input 
                            type="text" 
                            className="woo-input-text" 
                            value={receiverName}
                            onChange={(e) => setReceiverName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="woo-field-label">เบอร์โทรศัพท์ติดต่อ:</label>
                          <input 
                            type="text" 
                            className="woo-input-text" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="woo-field-label">อีเมลผู้รับ:</label>
                          <input 
                            type="email" 
                            className="woo-input-text" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="woo-field-label">ที่อยู่จัดส่ง & ประกอบติดตั้ง:</label>
                          <textarea 
                            rows={2}
                            className="woo-textarea" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="woo-field-label">หมายเหตุการส่งมอบ:</label>
                          <textarea 
                            rows={2}
                            className="woo-textarea" 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="woo-display-address">
                        <strong>{receiverName || 'ไม่ระบุชื่อผู้รับ'}</strong>
                        <div style={{ marginTop: '4px' }}>
                          {address || 'ไม่ระบุที่อยู่จัดส่ง'}
                        </div>
                        <div style={{ marginTop: '6px', color: '#2563eb', fontWeight: 600 }}>
                          📞 {phone || '-'}
                        </div>
                        {notes && (
                          <div style={{ marginTop: '8px', padding: '6px 10px', background: '#f8fafc', borderRadius: '4px', border: '1px dashed #cbd5e1', fontSize: '0.78rem', color: '#475569' }}>
                            <strong>หมายเหตุจากลูกค้า:</strong> {notes}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* POSTBOX 2: ORDER ITEMS (ตารางรายการสินค้าสไตล์ WOOCOMMERCE) */}
            <div className="woo-postbox">
              <div className="woo-postbox-header">
                <h3 className="woo-postbox-title">
                  <PackageCheck size={16} className="text-blue" />
                  <span>รายการสินค้าในคำสั่งซื้อ (Order Items)</span>
                </h3>

                <button 
                  type="button" 
                  className="btn-woo-edit-toggle"
                  onClick={() => setIsAddingItem(!isAddingItem)}
                >
                  <Plus size={13} />
                  <span>{isAddingItem ? 'ยกเลิก' : 'เพิ่มรายการสินค้า (Add Item)'}</span>
                </button>
              </div>

              <div className="woo-postbox-inside" style={{ padding: 0 }}>
                {/* Add Item Row */}
                {isAddingItem && (
                  <div style={{ padding: '14px 18px', background: '#eff6ff', borderBottom: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e40af' }}>เลือกสินค้า:</span>
                    <select 
                      className="woo-input-text"
                      style={{ maxWidth: '320px' }}
                      value={selectedProductIdToAdd}
                      onChange={(e) => setSelectedProductIdToAdd(e.target.value)}
                    >
                      {productsList.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ฿{p.price.toLocaleString()} (SKU: {p.sku})
                        </option>
                      ))}
                    </select>

                    <button 
                      type="button" 
                      className="button-woo-primary"
                      style={{ width: 'auto', padding: '6px 14px' }}
                      onClick={handleAddItem}
                    >
                      เพิ่มลงในออเดอร์
                    </button>
                  </div>
                )}

                {/* Items Table */}
                <table className="woo-items-table">
                  <thead>
                    <tr>
                      <th style={{ width: '55%' }}>สินค้า (Item)</th>
                      <th style={{ width: '15%', textAlign: 'right' }}>ราคา (Cost)</th>
                      <th style={{ width: '15%', textAlign: 'center' }}>จำนวน (Qty)</th>
                      <th style={{ width: '15%', textAlign: 'right' }}>รวม (Total)</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {item.image && (
                              <img src={item.image} alt={item.name} className="woo-item-thumb" />
                            )}
                            <div>
                              <div className="woo-item-name">{item.name}</div>
                              <div className="woo-item-sku">SKU: {item.sku || '-'}</div>
                              {(item.color || item.size) && (
                                <span className="woo-item-variation">
                                  {item.color} {item.size ? `/ ${item.size}` : ''}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          ฿{(item.unitPrice || 0).toLocaleString()}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <input 
                            type="number" 
                            min="1"
                            className="woo-qty-input"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItemQty(idx, e.target.value)}
                          />
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: '#1e293b' }}>
                          ฿{((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                            title="ลบรายการนี้"
                          >
                            <Trash2 size={14} className="hover:text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* WooCommerce Totals Breakdown */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid #c3c4c7', background: '#fafafa' }}>
                  <div className="woo-totals-wrapper">
                    <table className="woo-totals-table">
                      <tbody>
                        <tr>
                          <td className="total-label">มูลค่าสินค้ารวม (Items Subtotal):</td>
                          <td className="total-val">฿{subtotal.toLocaleString()}.-</td>
                        </tr>
                        {discount > 0 && (
                          <tr>
                            <td className="total-label" style={{ color: '#ea580c' }}>ส่วนลดพิเศษ (B2B Discount):</td>
                            <td className="total-val" style={{ color: '#ea580c' }}>-฿{discount.toLocaleString()}.-</td>
                          </tr>
                        )}
                        <tr>
                          <td className="total-label">ค่าจัดส่งและติดตั้ง (Shipping & Installation):</td>
                          <td className="total-val" style={{ color: '#16a34a' }}>ฟรี (Free)</td>
                        </tr>
                        <tr>
                          <td className="total-label">ภาษีมูลค่าเพิ่ม (VAT 7% Included):</td>
                          <td className="total-val">฿{vat.toLocaleString()}.-</td>
                        </tr>
                        <tr className="grand-total-row">
                          <td className="total-label">ยอดสุทธิรวมทั้งสิ้น (Order Total):</td>
                          <td className="total-val">฿{grandTotal.toLocaleString()}.-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* POSTBOX 3: FULFILLMENT & COURIER TRACKING (การจัดส่ง & ขนส่ง) */}
            <div className="woo-postbox">
              <div className="woo-postbox-header">
                <h3 className="woo-postbox-title">
                  <Truck size={16} className="text-blue" />
                  <span>การจัดส่ง & เลขติดตามพัสดุ (Shipping & Fulfillment)</span>
                </h3>
              </div>

              <div className="woo-postbox-inside">
                <div className="woo-tracking-box">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label className="woo-field-label">ผู้ให้บริการขนส่ง (Shipping Carrier):</label>
                      <select 
                        className="woo-select-status"
                        value={shippingCarrier}
                        onChange={(e) => setShippingCarrier(e.target.value)}
                      >
                        <option value="Kerry Express">Kerry Express (KEX)</option>
                        <option value="Flash Express">Flash Express</option>
                        <option value="ไปรษณีย์ไทย (EMS)">ไปรษณีย์ไทย EMS</option>
                        <option value="SCG Express">SCG Express</option>
                        <option value="J&T Express">J&T Express</option>
                        <option value="ทีมช่าง GLP Logistics">ทีมช่าง GLP Logistics จัดส่งตรง</option>
                      </select>
                    </div>

                    <div>
                      <label className="woo-field-label">เลขพัสดุ (Tracking Number):</label>
                      <input 
                        type="text" 
                        className="woo-input-text" 
                        placeholder="เช่น KEX12345678TH หรือ TH0123456"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="woo-tracking-row">
                    {trackingNumber ? (
                      <>
                        <button 
                          type="button" 
                          className="button-woo-secondary"
                          style={{ width: 'auto', padding: '6px 12px' }}
                          onClick={() => {
                            navigator.clipboard?.writeText(trackingNumber);
                            showToast(`คัดลอกเลขพัสดุ ${trackingNumber} แล้ว`);
                          }}
                        >
                          <Copy size={13} />
                          <span>คัดลอกเลขพัสดุ</span>
                        </button>

                        {getCarrierTrackUrl(shippingCarrier, trackingNumber) && (
                          <a 
                            href={getCarrierTrackUrl(shippingCarrier, trackingNumber)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-woo-link"
                          >
                            <ExternalLink size={13} />
                            <span>เช็คพัสดุกับ {shippingCarrier} ↗</span>
                          </a>
                        )}

                        <button 
                          type="button"
                          className="button-woo-primary"
                          style={{ width: 'auto', padding: '6px 14px', background: '#059669', borderColor: '#059669' }}
                          onClick={() => {
                            setStatus('shipping');
                            setStatusNote(`ส่งมอบพัสดุให้ ${shippingCarrier} แล้ว เลขพัสดุ: ${trackingNumber}`);
                            showToast('เปลี่ยนสถานะเป็น "กำลังจัดส่ง" และบันทึกเลขพัสดุเรียบร้อย');
                          }}
                        >
                          <Truck size={14} />
                          <span>อัปเดตเป็น "กำลังจัดส่ง" ทันที</span>
                        </button>
                      </>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        * เมื่อกรอกเลขพัสดุแล้ว ลูกค้าจะสามารถคลิกลิงก์ตรวจสถานะ Real-time ได้ทันทีที่หน้าคำสั่งซื้อ
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* POSTBOX 4: PAYMENT PROOF & SLIP INSPECTOR */}
            <div className="woo-postbox">
              <div className="woo-postbox-header">
                <h3 className="woo-postbox-title">
                  <ShieldCheck size={16} className="text-blue" />
                  <span>หลักฐานสลิปการโอนเงิน (Payment Slip Inspector)</span>
                </h3>
              </div>

              <div className="woo-postbox-inside">
                {order.hasSlipUploaded && order.slipPreview ? (
                  <div className="woo-slip-inspector">
                    {order.slipFileType === 'pdf' ? (
                      <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
                        <FileText size={48} style={{ color: '#2563eb', margin: '0 auto 8px' }} />
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                          {order.slipFileName || 'เอกสารสลิป PDF'}
                        </div>
                        <a 
                          href={order.slipPreview} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="button-woo-primary"
                          style={{ width: 'auto', padding: '6px 16px', display: 'inline-flex' }}
                        >
                          <ExternalLink size={14} />
                          <span>เปิดดูเอกสาร PDF เต็มจอ</span>
                        </a>
                      </div>
                    ) : (
                      <div className="woo-slip-thumb-box" onClick={() => setIsZoomingSlip(true)}>
                        <img src={order.slipPreview} alt="Payment Slip" className="woo-slip-img" />
                        <div className="woo-slip-badge-overlay">
                          <ZoomIn size={12} />
                          <span>คลิกเพื่อขยายดูสลิป</span>
                        </div>
                      </div>
                    )}

                    <div className="woo-slip-actions">
                      <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                        <div>ไฟล์: <strong>{order.slipFileName || 'payment_slip.jpg'}</strong></div>
                        <div style={{ marginTop: '2px', color: '#64748b' }}>
                          อัปโหลดเมื่อ: {new Date(order.slipUploadedAt || order.createdAt).toLocaleString('th-TH')}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                        <button 
                          type="button" 
                          className="button-woo-primary"
                          style={{ width: 'auto', background: '#16a34a', borderColor: '#16a34a', padding: '8px 16px' }}
                          onClick={() => {
                            setStatus('payment_verified');
                            setStatusNote('ตรวจสอบยอดเงินและสลิปโอนเงินถูกต้องเรียบร้อยแล้ว');
                            onApproveSlip(order.orderNo);
                            showToast('อนุมัติสลิปเรียบร้อยแล้ว');
                          }}
                        >
                          <Check size={15} />
                          <span>อนุมัติสลิปโอนเงิน (Approve)</span>
                        </button>

                        <button 
                          type="button" 
                          className="button-woo-secondary"
                          style={{ width: 'auto', color: '#dc2626', borderColor: '#fca5a5', padding: '8px 14px' }}
                          onClick={() => {
                            const reason = prompt('กรุณาระบุปัญหาของสลิป (เช่น ยอดเงินไม่ตรง หรือสลิปไม่ชัดเจน):', 'ยอดเงินไม่ตรงกับคำสั่งซื้อ กรุณาตรวจสอบและแนบใหม่อีกครั้ง');
                            if (reason !== null) {
                              setStatus('payment_issue');
                              setStatusNote(reason);
                              onFlagSlipIssue(order.orderNo);
                            }
                          }}
                        >
                          <AlertTriangle size={15} />
                          <span>แจ้งสลิปมีปัญหา (Flag Issue)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                    <AlertCircle size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '0.88rem' }}>ลูกค้ายังไม่ได้แนบหลักฐานสลิปการโอนเงิน</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT SIDEBAR COLUMN (30% WIDTH)
              ========================================================= */}
          <div className="woo-sidebar-column">
            {/* SIDEBAR POSTBOX A: ORDER ACTIONS */}
            <div className="woo-postbox">
              <div className="woo-postbox-header">
                <h3 className="woo-postbox-title">
                  <CheckCircle2 size={16} className="text-blue" />
                  <span>การกระทำคำสั่งซื้อ (Order Actions)</span>
                </h3>
              </div>

              <div className="woo-postbox-inside">
                <div className="woo-field-group">
                  <select 
                    className="woo-select-status"
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                  >
                    <option value="save">บันทึกข้อมูลคำสั่งซื้อทั้งหมด (Save Order)</option>
                    <option value="email_customer">ส่งอีเมลยืนยันให้ลูกค้า (Email Customer)</option>
                    <option value="line_group">ส่งแจ้งเตือนเข้า LINE กลุ่มทีมงาน (LINE Notify)</option>
                  </select>
                </div>

                <div className="woo-sidebar-actions-btn-group">
                  <button 
                    type="button" 
                    className="button-woo-primary"
                    onClick={() => {
                      if (selectedAction === 'email_customer') {
                        handleSendCustomerEmail();
                      } else if (selectedAction === 'line_group') {
                        handleSendToLineGroup();
                      } else {
                        handleSaveAll();
                      }
                    }}
                  >
                    <Save size={15} />
                    <span>บันทึกคำสั่งซื้อ (Update Order)</span>
                  </button>

                  {/* Print / Download Shipping Label & Delivery Note (Duplicate) */}
                  <button 
                    type="button" 
                    className="button-woo-secondary"
                    onClick={() => {
                      if (typeof onPrintShippingLabel === 'function') {
                        onPrintShippingLabel(order);
                      }
                    }}
                    title="พิมพ์หรือดาวน์โหลดใบส่งสินค้า & ใบปะหน้ากล่องพัสดุ (คู่ฉบับมีลายเซ็นรับของ)"
                  >
                    <Truck size={14} />
                    <span>ใบส่งสินค้า/ปะหน้า (คู่ฉบับ)</span>
                  </button>

                  {/* Print / Download Receipt & Tax Invoice */}
                  <button 
                    type="button" 
                    className="button-woo-secondary"
                    onClick={() => {
                      if (typeof onPrintReceipt === 'function') {
                        onPrintReceipt(order);
                      } else {
                        window.print();
                      }
                    }}
                    title="พิมพ์หรือดาวน์โหลดใบเสร็จรับเงิน/ใบกำกับภาษี"
                  >
                    <Printer size={14} />
                    <span>ใบเสร็จรับเงิน / ใบกำกับภาษี</span>
                  </button>

                  <button 
                    type="button" 
                    className="button-woo-secondary"
                    style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    onClick={() => onDeleteOrder(order.orderNo)}
                  >
                    <Trash2 size={14} />
                    <span>ลบคำสั่งซื้อนี้ (Move to Trash)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SIDEBAR POSTBOX B: LINE GROUP & EMAIL NOTIFICATIONS */}
            <div className="woo-postbox">
              <div className="woo-postbox-header">
                <h3 className="woo-postbox-title">
                  <MessageSquare size={16} style={{ color: '#06c755' }} />
                  <span>ระบบส่งแจ้งเตือน (LINE & Email)</span>
                </h3>
              </div>

              <div className="woo-postbox-inside">
                {/* LINE Group Box */}
                <div className="woo-dispatch-card">
                  <div className="woo-dispatch-head">
                    <span className="woo-line-badge">
                      <MessageSquare size={12} />
                      <span>LINE GROUP NOTIFY</span>
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                      พร้อมส่ง (Active)
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#166534', margin: '0 0 10px', lineHeight: 1.4 }}>
                    ส่งสรุปออเดอร์ ชื่อลูกค้า รายการสินค้า และยอดเงิน เข้ากลุ่ม LINE ทีมงานและฝ่ายจัดส่งทันที
                  </p>

                  <button 
                    type="button" 
                    className="btn-dispatch-line"
                    onClick={handleSendToLineGroup}
                  >
                    <Send size={14} />
                    <span>ส่งแจ้งเตือนเข้ากลุ่ม LINE ทันที 🚀</span>
                  </button>

                  <button 
                    type="button"
                    onClick={handleCopyLineText}
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      border: '1px solid #a7f3d0',
                      borderRadius: '4px',
                      padding: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#065f46',
                      marginTop: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <Copy size={12} />
                    <span>คัดลอกข้อความ LINE</span>
                  </button>

                  {/* Preview Box */}
                  <div className="woo-line-preview-box">
                    {getLineNotificationText()}
                  </div>
                </div>

                {/* Email Customer Box */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#1e40af' }}>
                      <Mail size={14} />
                      <span>{status === 'shipping' ? 'อีเมลแจ้งเลขพัสดุ & จัดส่ง' : status === 'delivered' ? 'อีเมลส่งมอบสินค้าสำเร็จ' : 'อีเมลแจ้งสถานะคำสั่งซื้อ'}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
                      ✓ พร้อมส่ง (Auto)
                    </span>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '8px' }}>
                    ปลายทาง: <strong>{email || order.shipping?.email || 'ยังไม่ได้ระบุ'}</strong>
                  </div>

                  {status === 'shipping' && (
                    <div style={{ fontSize: '0.72rem', color: '#2563eb', background: '#eff6ff', padding: '5px 8px', borderRadius: '4px', marginBottom: '8px', border: '1px solid #bfdbfe' }}>
                      🚚 {shippingCarrier}: <strong>{trackingNumber || 'ยังไม่ได้ระบุเลขพัสดุ'}</strong>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      type="button" 
                      className="btn-dispatch-email"
                      style={{ flex: 1 }}
                      onClick={() => handleSendCustomerEmail()}
                    >
                      <Mail size={13} />
                      <span>ส่งอีเมล{status === 'shipping' ? 'แจ้งจัดส่ง' : 'ให้ลูกค้า'}</span>
                    </button>

                    <button 
                      type="button" 
                      className="button-woo-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      title="ดูตัวอย่างอีเมลที่จะส่งให้ลูกค้า"
                      onClick={() => {
                        setEmailPreviewType(status === 'shipping' ? 'shipping' : status === 'delivered' ? 'delivered' : 'payment_verified');
                        setIsPreviewingEmail(true);
                      }}
                    >
                      <Eye size={13} />
                      <span>ตัวอย่าง</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR POSTBOX C: ORDER NOTES (WOOCOMMERCE ORDER NOTES) */}
            <div className="woo-postbox">
              <div className="woo-postbox-header">
                <h3 className="woo-postbox-title">
                  <Clock size={16} className="text-blue" />
                  <span>บันทึกช่วยจำ (Order Notes)</span>
                </h3>
              </div>

              <div className="woo-postbox-inside">
                {/* Notes Stream */}
                <div className="woo-notes-list">
                  {orderNotes.map(n => (
                    <div key={n.id} className={`woo-note-bubble ${n.type === 'customer' ? 'customer' : 'private'}`}>
                      <div className="woo-note-content">{n.content}</div>
                      <div className="woo-note-meta">
                        <span>{new Date(n.createdAt).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.</span>
                        <span style={{ fontWeight: 600 }}>{n.type === 'customer' ? 'แจ้งเตือนลูกค้า' : 'บันทึกภายใน'}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Note Box */}
                <form onSubmit={handleAddNote} className="woo-add-note-box">
                  <textarea 
                    rows={3}
                    className="woo-textarea"
                    placeholder="เพิ่มบันทึกช่วยจำเกี่ยวกับออเดอร์นี้..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '8px' }}>
                    <select 
                      className="woo-select-status"
                      style={{ fontSize: '0.78rem', padding: '5px 8px', maxWidth: '160px' }}
                      value={newNoteType}
                      onChange={(e) => setNewNoteType(e.target.value)}
                    >
                      <option value="private">บันทึกภายในร้าน</option>
                      <option value="customer">บันทึกถึงลูกค้า</option>
                    </select>

                    <button 
                      type="submit" 
                      className="button-woo-primary"
                      style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      เพิ่มบันทึก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slip Image Fullscreen Zoom Modal */}
      {isZoomingSlip && order.slipPreview && (
        <div 
          className="store-modal-backdrop" 
          onClick={() => setIsZoomingSlip(false)}
          style={{ zIndex: 100030, background: 'rgba(0,0,0,0.85)' }}
        >
          <div 
            onClick={e => e.stopPropagation()} 
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
          >
            <button 
              type="button"
              onClick={() => setIsZoomingSlip(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
            <img 
              src={order.slipPreview} 
              alt="Payment Slip Full Zoom" 
              style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} 
            />
          </div>
        </div>
      )}

      {/* MODAL: EMAIL NOTIFICATION PREVIEW & DIRECT DISPATCH */}
      {isPreviewingEmail && (() => {
        const previewOrderData = {
          ...order,
          items,
          status,
          shippingCarrier,
          trackingNumber,
          customerEmail: email || order.shipping?.email,
          shipping: { receiverName, phone, email: email || order.shipping?.email, address, notes },
          pricing: { grandTotal }
        };
        const emailTemplate = buildOrderStatusEmailTemplate(previewOrderData, emailPreviewType, {
          carrier: shippingCarrier,
          trackingNo: trackingNumber
        });

        return (
          <div 
            className="woo-lightbox-backdrop" 
            onClick={() => setIsPreviewingEmail(false)}
            style={{ zIndex: 100025, background: 'rgba(15, 23, 42, 0.75)' }}
          >
            <div 
              onClick={e => e.stopPropagation()} 
              style={{ 
                maxWidth: '820px', 
                width: '94%', 
                background: '#ffffff', 
                borderRadius: '16px', 
                overflow: 'hidden', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh'
              }}
            >
              {/* Header */}
              <div style={{ padding: '16px 22px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      ตัวอย่างอีเมลแจ้งเตือนลูกค้า (Email Notification Preview)
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      ออเดอร์: <strong>{order.orderNo}</strong> | ลูกค้า: <strong>{receiverName || 'ลูกค้าคนสำคัญ'}</strong>
                    </div>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsPreviewingEmail(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '16px 22px', overflowY: 'auto', flex: 1, background: '#f1f5f9' }}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: 700, color: '#475569' }}>แบบอีเมล:</span>
                      <select 
                        value={emailPreviewType} 
                        onChange={(e) => setEmailPreviewType(e.target.value)}
                        style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontWeight: 600 }}
                      >
                        <option value="shipping">🚚 กำลังจัดส่งพัสดุ (Shipping & Tracking)</option>
                        <option value="payment_verified">✓ ยืนยันยอดชำระเงินแล้ว (Payment Verified)</option>
                        <option value="preparing_items">📦 กำลังเตรียมพัสดุ & QC (Preparing)</option>
                        <option value="delivered">🎉 จัดส่งสำเร็จเรียบร้อย (Delivered)</option>
                        <option value="payment_issue">⚠️ แจ้งสลิปมีปัญหา (Payment Issue)</option>
                      </select>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      ปลายทาง: <strong style={{ color: '#0f172a' }}>{email || order.shipping?.email || 'ยังไม่ได้ระบุอีเมล'}</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                    <strong>Subject:</strong> {emailTemplate.subject}
                  </div>
                </div>

                <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', background: '#ffffff' }}>
                  <iframe 
                    title="Order Email Preview"
                    srcDoc={emailTemplate.html}
                    style={{ width: '100%', height: '420px', border: 'none', display: 'block' }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '12px 22px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    className="button-woo-secondary"
                    onClick={() => {
                      navigator.clipboard?.writeText(emailTemplate.html);
                      showToast('คัดลอกโค้ด HTML ของอีเมลเรียบร้อยแล้ว');
                    }}
                    style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Copy size={13} />
                    <span>คัดลอก HTML</span>
                  </button>

                  <button 
                    type="button" 
                    className="button-woo-secondary"
                    onClick={() => {
                      const blob = new Blob([emailTemplate.html], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      window.open(url, '_blank');
                    }}
                    style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <ExternalLink size={13} />
                    <span>เปิดดูเต็มจอ ↗</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    className="button-woo-secondary" 
                    onClick={() => setIsPreviewingEmail(false)}
                  >
                    ปิด
                  </button>

                  <button 
                    type="button" 
                    className="button-woo-primary"
                    style={{ background: '#2563eb', borderColor: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => handleSendCustomerEmail(emailPreviewType)}
                  >
                    <Send size={14} />
                    <span>ส่งอีเมลจริงหาลูกค้าทันที 🚀</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
