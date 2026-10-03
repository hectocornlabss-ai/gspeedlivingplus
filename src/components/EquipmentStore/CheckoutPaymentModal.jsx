import React, { useState, useEffect } from 'react';
import { 
  X, Check, QrCode, CreditCard, Building2, 
  Upload, Copy, CheckCircle2, ShieldCheck, Truck, 
  Phone, Mail, MapPin, ArrowRight, Download, PackageCheck,
  Clock, AlertCircle, FileText
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { thaiBahtText } from '../../data/equipmentProducts';

export default function CheckoutPaymentModal() {
  const { 
    cartItems, 
    subtotal, 
    volumeDiscountAmount, 
    vatAmount, 
    grandTotal, 
    isCheckoutModalOpen, 
    setIsCheckoutModalOpen, 
    checkoutInitialData, 
    setCheckoutInitialData,
    createOrder,
    setIsTrackingModalOpen
  } = useCart();

  // Form State
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [needTaxInvoice, setNeedTaxInvoice] = useState(true);
  const [taxCompanyName, setTaxCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');

  // Payment Options (Always 100% full payment)
  const paymentPlan = 'full';
  const [paymentMethod, setPaymentMethod] = useState('promptpay'); // 'promptpay' | 'transfer' | 'card'

  // Slip upload state
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [copiedBank, setCopiedBank] = useState(false);

  // QR Timer Countdown
  const [qrCountdown, setQrCountdown] = useState(900); // 15 mins

  // Processing & Completed state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Initialize from quotation or cart
  useEffect(() => {
    if (isCheckoutModalOpen) {
      setCompletedOrder(null);
      setIsProcessing(false);
      setQrCountdown(900);

      if (checkoutInitialData?.clientInfo) {
        const c = checkoutInitialData.clientInfo;
        setReceiverName(c.contactName || c.companyName || '');
        setPhone(c.phone || '');
        setEmail(c.email || '');
        setDeliveryAddress(c.address || '');
        setTaxCompanyName(c.companyName || '');
        setTaxId(c.taxId || '');
        setNeedTaxInvoice(true);
      }
    }
  }, [isCheckoutModalOpen, checkoutInitialData]);

  // QR Timer effect
  useEffect(() => {
    if (!isCheckoutModalOpen || completedOrder || paymentMethod !== 'promptpay') return;
    const timer = setInterval(() => {
      setQrCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isCheckoutModalOpen, completedOrder, paymentMethod]);

  if (!isCheckoutModalOpen) return null;

  // Compute pricing
  const effectiveGrandTotal = checkoutInitialData?.grandTotal || grandTotal;
  const effectiveSubtotal = checkoutInitialData?.subtotal || subtotal;
  const effectiveDiscount = checkoutInitialData?.discount || volumeDiscountAmount;
  const effectiveVat = checkoutInitialData?.vat || vatAmount;

  // Calculate amount to pay (Always 100% full payment)
  const amountToPay = effectiveGrandTotal;
  const remainingAmount = 0;

  const handleCopyAccount = (accNum) => {
    navigator.clipboard?.writeText(accNum.replace(/-/g, ''));
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSlipChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFile(file);
      const reader = new FileReader();
      reader.onload = () => setSlipPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    const orderPayload = {
      fromQuotationNo: checkoutInitialData?.fromQuotationNo || null,
      items: checkoutInitialData?.items || cartItems.map(item => ({
        id: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        color: item.selectedColor?.name || '',
        size: item.selectedSize?.name || '',
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.unitPrice * item.quantity
      })),
      pricing: {
        subtotal: effectiveSubtotal,
        discount: effectiveDiscount,
        vat: effectiveVat,
        grandTotal: effectiveGrandTotal,
        amountPaid: effectiveGrandTotal,
        remainingAmount: 0,
        paymentPlan: 'full'
      },
      shipping: {
        receiverName: receiverName || 'ลูกค้า Gspeed Living Plus',
        phone: phone || '08x-xxx-xxxx',
        email: email || 'customer@example.com',
        address: deliveryAddress || 'จัดส่งตามที่อยู่จดทะเบียน'
      },
      taxInvoice: needTaxInvoice ? {
        companyName: taxCompanyName || receiverName,
        taxId: taxId || '-'
      } : null,
      paymentMethod,
      hasSlipUploaded: !!slipPreview
    };

    setTimeout(() => {
      const order = createOrder(orderPayload);
      setIsProcessing(false);
      setCompletedOrder(order);
    }, 1500);
  };

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="checkout-modal-backdrop" onClick={() => setIsCheckoutModalOpen(false)}>
      <div 
        className="checkout-modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="checkout-header">
          <div className="checkout-header-title">
            <CreditCard size={20} className="text-blue" />
            <div>
              <h3>สั่งซื้อและชำระเงิน (Checkout & Payment)</h3>
              <p>ระบบชำระเงินปลอดภัย Gspeed Official Store</p>
            </div>
          </div>

          <button 
            className="checkout-close-btn"
            onClick={() => setIsCheckoutModalOpen(false)}
            aria-label="ปิดหน้าต่าง"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="checkout-body">
          {completedOrder ? (
            /* ORDER SUCCESS VIEW */
            <div className="order-success-screen">
              <div className="success-icon-badge">
                <CheckCircle2 size={56} className="text-emerald" />
              </div>

              <h2 className="success-heading">การสั่งซื้อสำเร็จเรียบร้อย!</h2>
              <p className="success-subheading">
                ขอบพระคุณที่เลือกใช้บริการโต๊ะ เก้าอี้ และอุปกรณ์จาก <strong>Gspeed Living Plus</strong>
              </p>

              {/* Order Metadata Card */}
              <div className="order-summary-card">
                <div className="order-num-row">
                  <span>เลขที่คำสั่งซื้อ (Order No.):</span>
                  <strong className="order-id-highlight">{completedOrder.orderNo}</strong>
                </div>

                {completedOrder.fromQuotationNo && (
                  <div className="order-num-row sub">
                    <span>อ้างอิงใบเสนอราคา:</span>
                    <span>{completedOrder.fromQuotationNo}</span>
                  </div>
                )}

                <div className="order-status-pill in-process">
                  <span className="dot-pulse"></span>
                  <span>
                    {completedOrder.status === 'paid' 
                      ? 'ชำระเงินสำเร็จแล้ว (รอจัดส่งสินค้า)' 
                      : 'รอตรวจสอบยอดสลิป (กำลังประสานงาน)'}
                  </span>
                </div>

                <div className="order-details-mini-table">
                  <div className="mini-row">
                    <span>ผู้รับสินค้า:</span>
                    <strong>{completedOrder.shipping.receiverName} ({completedOrder.shipping.phone})</strong>
                  </div>
                  <div className="mini-row">
                    <span>ที่อยู่จัดส่ง:</span>
                    <span>{completedOrder.shipping.address}</span>
                  </div>
                  <div className="mini-row">
                    <span>ยอดชำระในรอบนี้:</span>
                    <strong className="text-emerald">฿{completedOrder.pricing.amountPaid.toLocaleString()}</strong>
                  </div>
                  {completedOrder.pricing.remainingAmount > 0 && (
                    <div className="mini-row">
                      <span>ยอดคงเหลือชำระวันส่งมอบ:</span>
                      <strong className="text-orange">฿{completedOrder.pricing.remainingAmount.toLocaleString()}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Success Action Buttons */}
              <div className="success-cta-group">
                <button 
                  className="btn-success-print"
                  onClick={() => window.print()}
                >
                  <Download size={16} />
                  <span>พิมพ์ใบเสร็จรับเงิน / ใบสั่งซื้อ</span>
                </button>

                <button 
                  className="btn-success-track"
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    setIsTrackingModalOpen(true);
                  }}
                >
                  <PackageCheck size={16} />
                  <span>ติดตามสถานะคำสั่งซื้อ</span>
                </button>

                <button 
                  className="btn-success-close"
                  onClick={() => setIsCheckoutModalOpen(false)}
                >
                  กลับสู่หน้าหลัก
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT PROCESS FORM & PAYMENT GATEWAY */
            <div className="checkout-grid-flow">
              {/* Left Column: Shipping & Invoicing Form */}
              <div className="checkout-left-form">
                {/* 1. Delivery Info */}
                <div className="checkout-section-box">
                  <div className="section-title-line">
                    <Truck size={17} className="text-blue" />
                    <h4>1. ข้อมูลผู้รับและสถานที่จัดส่ง / ติดตั้ง</h4>
                  </div>

                  <div className="form-grid-2">
                    <div className="input-group">
                      <label>ชื่อผู้รับสินค้า / บริษัท *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="ชื่อ-นามสกุล หรือ บริษัท"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>เบอร์โทรศัพท์ติดต่อ *</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="08x-xxx-xxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>อีเมลสำหรับรับใบเสร็จและแจ้งเตือนจัดส่ง *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>ที่อยู่จัดส่งและติดตั้งอย่างละเอียด *</label>
                    <textarea 
                      rows={2}
                      required
                      placeholder="บ้านเลขที่, อาคาร/ชั้น, ซอย, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                  </div>
                </div>

                {/* 2. Tax Invoice Checkbox */}
                <div className="checkout-section-box">
                  <div className="tax-invoice-toggle">
                    <label className="checkbox-custom-label">
                      <input 
                        type="checkbox" 
                        checked={needTaxInvoice}
                        onChange={(e) => setNeedTaxInvoice(e.target.checked)}
                      />
                      <span>ขอใบกำกับภาษีเต็มรูปแบบ (Full Tax Invoice)</span>
                    </label>
                  </div>

                  {needTaxInvoice && (
                    <div className="tax-fields-subbox">
                      <div className="form-grid-2">
                        <div className="input-group">
                          <label>ชื่อนิติบุคคล / ชื่อบนใบกำกับภาษี</label>
                          <input 
                            type="text" 
                            placeholder="บจก. / นาย..."
                            value={taxCompanyName}
                            onChange={(e) => setTaxCompanyName(e.target.value)}
                          />
                        </div>
                        <div className="input-group">
                          <label>เลขประจำตัวผู้เสียภาษี 13 หลัก</label>
                          <input 
                            type="text" 
                            maxLength={13}
                            placeholder="01055xxxxxxxx"
                            value={taxId}
                            onChange={(e) => setTaxId(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              {/* Right Column: Payment Method & Gateway Gateway */}
              <div className="checkout-right-gateway">
                <div className="gateway-box-card">
                  <div className="gateway-header">
                    <h4>3. เลือกช่องทางชำระเงิน</h4>
                    <span className="amount-pill">
                      ยอดชำระรอบนี้: <strong>฿{amountToPay.toLocaleString()}</strong>
                    </span>
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="payment-methods-selector">
                    <button 
                      className={`method-tab-btn ${paymentMethod === 'promptpay' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('promptpay')}
                    >
                      <QrCode size={16} />
                      <span>พร้อมเพย์ QR</span>
                    </button>

                    <button 
                      className={`method-tab-btn ${paymentMethod === 'transfer' ? 'active' : ''}`}
                      onClick={() => setPaymentMethod('transfer')}
                    >
                      <Building2 size={16} />
                      <span>โอนแนบสลิป</span>
                    </button>
                  </div>

                  {/* Gateway Content 1: PromptPay Dynamic QR */}
                  {paymentMethod === 'promptpay' && (
                    <div className="promptpay-screen">
                      <div className="promptpay-badge-line">
                        <span className="thai-qr-logo">THAI QR PAYMENT</span>
                        <span className="qr-timer">
                          <Clock size={13} /> หมดอายุใน {formatCountdown(qrCountdown)}
                        </span>
                      </div>

                      {/* Dynamic PromptPay QR Card */}
                      <div className="qr-code-frame">
                        <div className="qr-inner-box">
                          {/* Styled Simulated High-Res PromptPay QR with Thai Baht Amount */}
                          <div className="promptpay-svg-wrapper">
                            <svg className="qr-svg" viewBox="0 0 240 240" width="180" height="180">
                              {/* Background */}
                              <rect width="240" height="240" fill="#ffffff" rx="12" />
                              {/* QR Patterns */}
                              <rect x="20" y="20" width="56" height="56" fill="#0f172a" rx="4" />
                              <rect x="28" y="28" width="40" height="40" fill="#ffffff" rx="2" />
                              <rect x="36" y="36" width="24" height="24" fill="#1d4ed8" rx="2" />

                              <rect x="164" y="20" width="56" height="56" fill="#0f172a" rx="4" />
                              <rect x="172" y="28" width="40" height="40" fill="#ffffff" rx="2" />
                              <rect x="180" y="36" width="24" height="24" fill="#1d4ed8" rx="2" />

                              <rect x="20" y="164" width="56" height="56" fill="#0f172a" rx="4" />
                              <rect x="28" y="172" width="40" height="40" fill="#ffffff" rx="2" />
                              <rect x="36" y="180" width="24" height="24" fill="#1d4ed8" rx="2" />

                              {/* Matrix dots simulation */}
                              <circle cx="95" cy="40" r="4" fill="#0f172a" />
                              <circle cx="115" cy="40" r="4" fill="#0f172a" />
                              <circle cx="135" cy="40" r="4" fill="#0f172a" />
                              <circle cx="95" cy="60" r="4" fill="#0f172a" />
                              <circle cx="135" cy="60" r="4" fill="#0f172a" />
                              <circle cx="95" cy="80" r="4" fill="#0f172a" />
                              <circle cx="115" cy="80" r="4" fill="#0f172a" />
                              <circle cx="40" cy="100" r="4" fill="#0f172a" />
                              <circle cx="60" cy="100" r="4" fill="#0f172a" />
                              <circle cx="100" cy="100" r="4" fill="#0f172a" />
                              <circle cx="140" cy="100" r="4" fill="#0f172a" />
                              <circle cx="180" cy="100" r="4" fill="#0f172a" />
                              <circle cx="200" cy="100" r="4" fill="#0f172a" />
                              <circle cx="95" cy="120" r="4" fill="#0f172a" />
                              <circle cx="120" cy="120" r="4" fill="#0f172a" />
                              <circle cx="145" cy="120" r="4" fill="#0f172a" />
                              <circle cx="100" cy="140" r="4" fill="#0f172a" />
                              <circle cx="140" cy="140" r="4" fill="#0f172a" />
                              <circle cx="95" cy="160" r="4" fill="#0f172a" />
                              <circle cx="115" cy="160" r="4" fill="#0f172a" />
                              <circle cx="135" cy="160" r="4" fill="#0f172a" />
                              <circle cx="160" cy="160" r="4" fill="#0f172a" />
                              <circle cx="180" cy="160" r="4" fill="#0f172a" />
                              <circle cx="200" cy="160" r="4" fill="#0f172a" />
                              <circle cx="100" cy="180" r="4" fill="#0f172a" />
                              <circle cx="125" cy="180" r="4" fill="#0f172a" />
                              <circle cx="150" cy="180" r="4" fill="#0f172a" />
                              <circle cx="175" cy="180" r="4" fill="#0f172a" />
                              <circle cx="100" cy="200" r="4" fill="#0f172a" />
                              <circle cx="130" cy="200" r="4" fill="#0f172a" />
                              <circle cx="160" cy="200" r="4" fill="#0f172a" />
                              <circle cx="190" cy="200" r="4" fill="#0f172a" />
                            </svg>
                          </div>
                          <div className="qr-pay-amount">฿{amountToPay.toLocaleString()}</div>
                          <div className="qr-payee">บจก. จีสปีด ลิฟวิ่ง พลัส</div>
                        </div>
                      </div>

                      <div className="qr-scan-instructions">
                        เปิดแอปพลิเคชันธนาคารใดก็ได้ แล้วสแกน QR Code นี้เพื่อชำระเงิน
                      </div>

                      <button 
                        id="btn-simulate-qr-paid"
                        className="btn-confirm-gateway"
                        disabled={isProcessing}
                        onClick={handleConfirmPayment}
                      >
                        {isProcessing ? (
                          <span>กำลังตรวจสอบสถานะการชำระเงิน...</span>
                        ) : (
                          <>
                            <CheckCircle2 size={18} />
                            <span>ยืนยันชำระเงินสำเร็จ (฿{amountToPay.toLocaleString()})</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Gateway Content 2: Bank Transfer & Slip Upload */}
                  {paymentMethod === 'transfer' && (
                    <div className="transfer-screen">
                      <div className="bank-account-card">
                        <div className="bank-logo-kbank">KBANK</div>
                        <div className="bank-account-info">
                          <div className="bank-name-label">ธนาคารกสิกรไทย (KBANK)</div>
                          <div className="bank-acc-no-line">
                            <span className="acc-number">095-2-88741-2</span>
                            <button 
                              className="btn-copy-acc"
                              onClick={() => handleCopyAccount('095-2-88741-2')}
                              title="คัดลอกเลขบัญชี"
                            >
                              {copiedBank ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                              <span>{copiedBank ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                            </button>
                          </div>
                          <div className="bank-holder">ชื่อบัญชี: บจก. จีสปีด ลิฟวิ่ง พลัส</div>
                        </div>
                      </div>

                      {/* Slip Upload Box */}
                      <div className="slip-upload-container">
                        <label className="slip-upload-label">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleSlipChange}
                            className="hidden-file-input"
                          />
                          {slipPreview ? (
                            <div className="slip-preview-box">
                              <img src={slipPreview} alt="Slip Preview" />
                              <div className="slip-change-tag">คลิกเพื่อเปลี่ยนรูปสลิป</div>
                            </div>
                          ) : (
                            <div className="slip-drop-placeholder">
                              <Upload size={32} className="text-blue" />
                              <strong>แนบสลิปหลักฐานการโอนเงิน</strong>
                              <span>แตะเพื่อเลือกรูปภาพจากเครื่อง หรือลากไฟล์มาวาง</span>
                            </div>
                          )}
                        </label>
                      </div>

                      <button 
                        id="btn-confirm-slip-transfer"
                        className="btn-confirm-gateway"
                        disabled={isProcessing}
                        onClick={handleConfirmPayment}
                      >
                        {isProcessing ? (
                          <span>กำลังตรวจสอบสลิปและสร้างคำสั่งซื้อ...</span>
                        ) : (
                          <>
                            <CheckCircle2 size={18} />
                            <span>ยืนยันการโอนเงิน (฿{amountToPay.toLocaleString()})</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="gateway-guarantee-note">
                    <ShieldCheck size={14} className="text-emerald" />
                    <span>ระบบเข้ารหัส TLS 1.3 ปลอดภัย 100% พร้อมบริการรับประกันความพึงพอใจ</span>
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
