import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Check, QrCode, Building2, 
  Upload, Copy, CheckCircle2, ShieldCheck, Truck, 
  Phone, Mail, MapPin, ArrowRight, Download, PackageCheck,
  Clock, AlertCircle, FileText, Trash2, Plus, Minus, ShoppingBag,
  Printer, Search, FileCheck, XCircle, RotateCcw, File, RefreshCw, CheckCheck,
  ExternalLink, Lock, Shield, Sparkles, X, Share2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { thaiBahtText } from '../../data/equipmentProducts';
import { dispatchOrderStatusEmail } from '../../utils/orderEmailService';
import './EquipmentStore.css';

export default function CheckoutPage({ 
  onNavigateHome, 
  onNavigateStore, 
  initialOrderNo = null, 
  initialStep = 'shipping' 
}) {
  const { 
    cartItems, 
    totalItemCount,
    subtotal, 
    volumeDiscountRate,
    volumeDiscountAmount, 
    vatAmount, 
    grandTotal, 
    updateQuantity,
    removeFromCart,
    checkoutInitialData, 
    createOrder,
    getOrder,
    updateOrderPaymentSlip,
    updateOrderStatus,
    savedOrders,
    setIsQuotationModalOpen
  } = useCart();

  const {
    currentUser,
    isLoggedIn,
    isOrderOwner,
    registerSessionOrder,
    openLoginModal
  } = useCustomerAuth();

  // Multi-step Checkout State:
  // 'shipping' (1. ข้อมูลจัดส่ง & ออกบิล)
  // 'invoice'  (2. ใบแจ้งหนี้การค้า & พิมพ์เอกสาร Proforma Invoice)
  // 'payment'  (3. ชำระเงิน & แนบสลิปทั้งภาพและ PDF)
  // 'tracking' (4. ติดตามสถานะ 5 ขั้นตอน: รับคำสั่งซื้อ > ตรวจสอบสลิป > กำลังเตรียมของ > กำลังจัดส่ง > จัดส่งสำเร็จ)
  const [checkoutStep, setCheckoutStep] = useState(initialStep === 'tracking' ? 'tracking' : 'shipping');

  // Currently active order (created or retrieved via Pay Later)
  const [activeOrder, setActiveOrder] = useState(null);

  // Resume order search input
  const [resumeSearchQuery, setResumeSearchQuery] = useState('');
  const [resumeSearchMsg, setResumeSearchMsg] = useState(null);

  // Customer & Shipping Form State
  const [receiverName, setReceiverName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [needTaxInvoice, setNeedTaxInvoice] = useState(false);
  const [taxCompanyName, setTaxCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [taxBranch, setTaxBranch] = useState('สำนักงานใหญ่');

  // Payment Options (Always full payment 100%, only promptpay or bank transfer)
  const paymentPlan = 'full';
  const [paymentMethod, setPaymentMethod] = useState('promptpay'); // 'promptpay' | 'transfer'

  // Slip upload state (supports both PDF and regular images)
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [slipFileType, setSlipFileType] = useState(null); // 'image' | 'pdf'
  const [slipFileSize, setSlipFileSize] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);

  // Custom Modal when slip is missing (replaces browser alert())
  const [isSlipRequiredModalOpen, setIsSlipRequiredModalOpen] = useState(false);

  // Privacy lock verification for tracking
  const [phoneUnlockInput, setPhoneUnlockInput] = useState('');
  const [phoneUnlockError, setPhoneUnlockError] = useState(null);
  const [isUnlockedByPhone, setIsUnlockedByPhone] = useState(false);
  const [copiedOrderUrl, setCopiedOrderUrl] = useState(false);
  const [copiedOrderNum, setCopiedOrderNum] = useState(false);

  // QR Timer Countdown (15 minutes)
  const [qrCountdown, setQrCountdown] = useState(900);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  // Form Validation Errors
  const [formErrors, setFormErrors] = useState({});

  // Pay later notification notice
  const [payLaterNotice, setPayLaterNotice] = useState(false);

  // Helper for Carrier Track URL
  const getCarrierTrackUrl = (carrier, trackingNo) => {
    if (!trackingNo) return null;
    const cleanTrack = encodeURIComponent(trackingNo.trim());
    const c = (carrier || '').toLowerCase();
    if (c.includes('kerry') || c.includes('kex')) {
      return `https://th.kerryexpress.com/th/track/?track=${cleanTrack}`;
    }
    if (c.includes('flash')) {
      return `https://www.flashexpress.co.th/tracking/?se=${cleanTrack}`;
    }
    if (c.includes('ems') || c.includes('ไปรษณีย์') || c.includes('thailand post')) {
      return `https://track.thailandpost.co.th/?trackNumber=${cleanTrack}`;
    }
    if (c.includes('scg')) {
      return `https://www.scgexpress.co.th/tracking/detail/${cleanTrack}`;
    }
    if (c.includes('j&t') || c.includes('jt')) {
      return `https://www.jtexpress.co.th/index/query/gzquery.html?bills=${cleanTrack}`;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(`${carrier || 'พัสดุ'} ${trackingNo}`)}`;
  };

  // 1. Instant scroll to top STRICTLY on initial page mount only (never when typing or when polling syncs)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // 2. Check URL query param, initial props, or quotation data on mount
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (hasInitializedRef.current && !initialOrderNo) return;
    hasInitializedRef.current = true;

    // Check initialOrderNo or URL ?order=
    const urlParams = new URLSearchParams(window.location.search);
    const orderParam = initialOrderNo || urlParams.get('order');
    if (orderParam) {
      const allOrders = savedOrders || [];
      const found = (typeof getOrder === 'function' ? getOrder(orderParam) : null) || 
        allOrders.find(o => o.orderNo && o.orderNo.toLowerCase() === orderParam.toLowerCase().trim());
      if (found) {
        setActiveOrder(found);
        if (initialStep === 'tracking' || found.hasSlipUploaded || found.status !== 'order_received') {
          setCheckoutStep('tracking');
        } else {
          setCheckoutStep('invoice');
        }
        return;
      }
    }

    // Pre-fill from quotation if passed
    if (checkoutInitialData?.clientInfo) {
      const c = checkoutInitialData.clientInfo;
      setReceiverName(c.contactName || c.companyName || '');
      setPhone(c.phone || '');
      setEmail(c.email || '');
      setDeliveryAddress(c.address || '');
      setTaxCompanyName(c.companyName || '');
      setTaxId(c.taxId || '');
      setNeedTaxInvoice(!!(c.companyName || c.taxId));
    }
  }, [initialOrderNo, initialStep]);

  // Sync Clean URL to /orders/:orderNo when viewing tracking
  useEffect(() => {
    if (activeOrder?.orderNo && checkoutStep === 'tracking') {
      const expectedPath = `/orders/${activeOrder.orderNo}`;
      if (window.location.pathname !== expectedPath) {
        window.history.replaceState(null, '', expectedPath);
      }
    }
  }, [activeOrder?.orderNo, checkoutStep]);

  // Keep activeOrder synced with savedOrders from context only when actual attributes change
  useEffect(() => {
    if (activeOrder?.orderNo) {
      const updated = (savedOrders || []).find(o => o.orderNo === activeOrder.orderNo);
      if (updated && (
        updated.status !== activeOrder.status || 
        updated.updatedAt !== activeOrder.updatedAt || 
        updated.hasSlipUploaded !== activeOrder.hasSlipUploaded ||
        updated.trackingNumber !== activeOrder.trackingNumber
      )) {
        setActiveOrder(updated);
      }
    }
  }, [savedOrders, activeOrder?.orderNo, activeOrder?.status, activeOrder?.updatedAt, activeOrder?.hasSlipUploaded, activeOrder?.trackingNumber]);

  // QR Timer effect
  useEffect(() => {
    if (checkoutStep !== 'payment' || paymentMethod !== 'promptpay') return;
    const timer = setInterval(() => {
      setQrCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [checkoutStep, paymentMethod]);

  // Compute effective pricing (from quotation or active cart or active order)
  const currentPricing = activeOrder?.pricing || {
    grandTotal: checkoutInitialData?.grandTotal || grandTotal,
    subtotal: checkoutInitialData?.subtotal || subtotal,
    discount: checkoutInitialData?.discount || volumeDiscountAmount,
    vat: checkoutInitialData?.vat || vatAmount
  };

  const effectiveGrandTotal = currentPricing.grandTotal;
  const effectiveSubtotal = currentPricing.subtotal;
  const effectiveDiscount = currentPricing.discount;
  const effectiveVat = currentPricing.vat;

  // Calculate amount to pay (Always 100% full payment, no installments)
  const amountToPay = effectiveGrandTotal;
  const remainingAmount = 0;

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopyAccount = (accNum) => {
    navigator.clipboard?.writeText(accNum.replace(/-/g, ''));
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  // Handle Slip Upload (Supports Images and PDF)
  const handleSlipChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSlipFile(file);
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    setSlipFileType(isPdf ? 'pdf' : 'image');

    // Format size
    const sizeKb = Math.round(file.size / 1024);
    setSlipFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(2)} MB` : `${sizeKb} KB`);

    if (isPdf) {
      // PDF document
      setSlipPreview(null);
    } else {
      // Regular image (JPG, PNG, WebP)
      const reader = new FileReader();
      reader.onload = () => setSlipPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSlip = () => {
    setSlipFile(null);
    setSlipPreview(null);
    setSlipFileType(null);
    setSlipFileSize('');
  };

  // Search and Resume Order (Pay Later feature)
  const handleResumeSearch = (e) => {
    e.preventDefault();
    if (!resumeSearchQuery.trim()) return;

    const query = resumeSearchQuery.trim().toLowerCase();
    const found = savedOrders.find(o => 
      o.orderNo.toLowerCase().includes(query) || 
      o.shipping.phone.replace(/-/g, '').includes(query.replace(/-/g, ''))
    );

    if (found) {
      setActiveOrder(found);
      setResumeSearchMsg({ type: 'success', text: `พบคำสั่งซื้อ ${found.orderNo} เรียบร้อยแล้ว` });
      if (found.hasSlipUploaded || found.status !== 'order_received') {
        setCheckoutStep('tracking');
      } else {
        setCheckoutStep('invoice');
      }
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      setResumeSearchMsg({ type: 'error', text: 'ไม่พบคำสั่งซื้อที่ตรงกับรหัสหรือเบอร์โทรดังกล่าว กรุณาตรวจสอบอีกครั้ง' });
    }
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!receiverName.trim()) errors.receiverName = 'กรุณากรอกชื่อผู้รับ หรือชื่อบริษัท';
    if (!phone.trim()) errors.phone = 'กรุณากรอกเบอร์โทรศัพท์ติดต่อ';
    if (!deliveryAddress.trim()) errors.deliveryAddress = 'กรุณาระบุที่อยู่จัดส่งและติดตั้ง';
    if (needTaxInvoice && !taxId.trim()) errors.taxId = 'กรุณากรอกเลขประจำตัวผู้เสียภาษี 13 หลัก';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // STEP 1 SUBMIT: Create Order -> Move to Step 2 (Invoice)
  const handleProceedToInvoice = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 200, behavior: 'smooth' });
      return;
    }

    setIsProcessing(true);

    const orderPayload = {
      userId: currentUser?.id || null,
      customerEmail: currentUser?.email || email.trim() || null,
      fromQuotationNo: checkoutInitialData?.fromQuotationNo || null,
      items: checkoutInitialData?.items || cartItems.map(item => ({
        id: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        color: item.selectedColor?.name || '',
        size: item.selectedSize?.name || '',
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.unitPrice * item.quantity,
        image: item.product.image
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
        receiverName: receiverName.trim(),
        phone: phone.trim(),
        email: email.trim() || 'customer@example.com',
        address: deliveryAddress.trim(),
        notes: deliveryNotes.trim()
      },
      taxInvoice: needTaxInvoice ? {
        companyName: taxCompanyName.trim() || receiverName.trim(),
        taxId: taxId.trim(),
        branch: taxBranch.trim()
      } : null,
      paymentMethod,
      hasSlipUploaded: false
    };

    setTimeout(() => {
      const order = createOrder(orderPayload);
      if (order?.orderNo) {
        registerSessionOrder(order.orderNo);
        window.history.pushState(null, '', `/orders/${order.orderNo}`);
        dispatchOrderStatusEmail(order, 'order_received').catch(err => {
          console.warn('[Checkout] Failed to dispatch order email:', err);
        });
      }
      setIsProcessing(false);
      setActiveOrder(order);
      setCheckoutStep('invoice');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 600);
  };

  // STEP 3 SUBMIT: Confirm Payment Slip -> Move to Step 4 (Tracking)
  const handleConfirmSlipPayment = () => {
    if (!slipFile && !activeOrder?.hasSlipUploaded) {
      setIsSlipRequiredModalOpen(true);
      return;
    }

    setIsProcessing(true);

    if (activeOrder && slipFile) {
      updateOrderPaymentSlip(activeOrder.orderNo, {
        preview: slipPreview,
        fileName: slipFile.name,
        fileType: slipFileType
      });
    }

    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep('tracking');
      if (activeOrder?.orderNo) {
        registerSessionOrder(activeOrder.orderNo);
        window.history.pushState(null, '', `/orders/${activeOrder.orderNo}`);
        const updatedOrder = {
          ...activeOrder,
          hasSlipUploaded: true,
          status: 'verifying_payment'
        };
        dispatchOrderStatusEmail(updatedOrder, 'verifying_payment').catch(err => {
          console.warn('[Checkout] Failed to dispatch slip verification email:', err);
        });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 600);
  };

  // Quick switch order status for demonstration & testing
  const handleSimulateStatus = (newStatus, note) => {
    if (!activeOrder) return;
    updateOrderStatus(activeOrder.orderNo, newStatus, note);
    setActiveOrder(prev => prev ? { ...prev, status: newStatus, statusNote: note } : null);
  };

  // Current active items (either from activeOrder or cart)
  const displayItems = activeOrder?.items || cartItems.map(item => ({
    id: item.product.id,
    sku: item.product.sku,
    name: item.product.name,
    color: item.selectedColor?.name || '',
    size: item.selectedSize?.name || '',
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    totalPrice: item.unitPrice * item.quantity,
    image: item.product.image
  }));

  // -------------------------------------------------------------
  // EMPTY CART SCREEN (WHEN NO CART AND NO ACTIVE ORDER)
  // -------------------------------------------------------------
  if (cartItems.length === 0 && !activeOrder && !checkoutInitialData) {
    return (
      <div className="checkout-page-wrapper">
        <div className="container checkout-container">
          {/* Resume Order Search Bar */}
          <div className="resume-order-bar" style={{ marginTop: '20px' }}>
            <div className="resume-order-info">
              <Search size={18} className="text-blue" />
              <span><strong>มีคำสั่งซื้ออยู่แล้ว?</strong> กรอกรหัส Order No. หรือเบอร์โทร เพื่อกลับมาชำระเงินหรือเช็คสถานะได้ทันที:</span>
            </div>
            <form onSubmit={handleResumeSearch} className="resume-search-form">
              <input 
                type="text" 
                className="resume-input"
                placeholder="เช่น GS-ORD-20261003-xxxx หรือ 0812345678"
                value={resumeSearchQuery}
                onChange={(e) => setResumeSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn-resume-search">
                <Search size={14} />
                <span>ค้นหา</span>
              </button>
            </form>
          </div>

          {resumeSearchMsg && (
            <div className={`status-feedback-banner ${resumeSearchMsg.type === 'success' ? 'verified' : 'issue'}`} style={{ marginBottom: '16px' }}>
              <div className="banner-icon-badge">
                {resumeSearchMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              </div>
              <div className="banner-content-box">
                <p style={{ margin: 0, fontWeight: 700 }}>{resumeSearchMsg.text}</p>
              </div>
            </div>
          )}

          <div className="checkout-empty-state-card">
            <div className="empty-cart-icon-circle">
              <ShoppingBag size={48} className="text-slate-400" />
            </div>
            <h2>ยังไม่มีรายการสินค้าในตะกร้า</h2>
            <p>กรุณาเลือกซื้อโต๊ะ เก้าอี้เกมมิ่ง หรืออุปกรณ์ที่ต้องการก่อนเข้าสู่หน้าสั่งซื้อและออกใบแจ้งหนี้</p>
            <button className="btn-continue-store-primary" onClick={onNavigateStore}>
              <ArrowLeft size={16} />
              <span>ไปยังหน้ารวมสินค้า</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine current timeline active step index (0 to 4)
  const currentOrderStatus = activeOrder?.status || 'order_received';
  let activeTimelineIndex = 0;
  if (currentOrderStatus === 'order_received') activeTimelineIndex = 0;
  else if (currentOrderStatus === 'verifying_payment' || currentOrderStatus === 'payment_verified' || currentOrderStatus === 'payment_issue') activeTimelineIndex = 1;
  else if (currentOrderStatus === 'preparing_items') activeTimelineIndex = 2;
  else if (currentOrderStatus === 'shipping') activeTimelineIndex = 3;
  else if (currentOrderStatus === 'delivered') activeTimelineIndex = 4;

  return (
    <div className="checkout-page-wrapper">
      {/* 1. Breadcrumb & Back to Store */}
      <div className="checkout-breadcrumb-bar">
        <div className="container">
          <div className="pdp-breadcrumb-row">
            <button className="pdp-back-button" onClick={onNavigateStore}>
              <ArrowLeft size={16} />
              <span>กลับไปเลือกสินค้าเพิ่มเติม</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container checkout-container">
        {/* TOP STEP-BY-STEP PROGRESS BAR */}
        <div className="checkout-stepper-container">
          <div className="checkout-stepper-bar">
            {/* Step 1 */}
            <div 
              className={`checkout-step-item ${checkoutStep === 'shipping' ? 'active' : activeOrder ? 'done' : ''}`}
              onClick={() => !activeOrder && setCheckoutStep('shipping')}
              style={{ cursor: !activeOrder ? 'pointer' : 'default' }}
            >
              <div className="step-circle">
                {activeOrder ? <Check size={14} strokeWidth={3} /> : '1'}
              </div>
              <span className="step-title">ข้อมูลการจัดส่ง</span>
            </div>

            <div className={`step-connector ${activeOrder ? 'done' : ''}`} />

            {/* Step 2 */}
            <div 
              className={`checkout-step-item ${checkoutStep === 'invoice' ? 'active' : (activeOrder && checkoutStep !== 'shipping') ? 'done' : ''}`}
              onClick={() => activeOrder && setCheckoutStep('invoice')}
              style={{ cursor: activeOrder ? 'pointer' : 'default' }}
            >
              <div className="step-circle">
                {(activeOrder && checkoutStep !== 'shipping' && checkoutStep !== 'invoice') ? <Check size={14} strokeWidth={3} /> : '2'}
              </div>
              <span className="step-title">ใบแจ้งหนี้</span>
            </div>

            <div className={`step-connector ${(activeOrder && checkoutStep !== 'shipping' && checkoutStep !== 'invoice') ? 'done' : ''}`} />

            {/* Step 3 */}
            <div 
              className={`checkout-step-item ${checkoutStep === 'payment' ? 'active' : (activeOrder?.hasSlipUploaded || checkoutStep === 'tracking') ? 'done' : ''}`}
              onClick={() => activeOrder && setCheckoutStep('payment')}
              style={{ cursor: activeOrder ? 'pointer' : 'default' }}
            >
              <div className="step-circle">
                {(activeOrder?.hasSlipUploaded || checkoutStep === 'tracking') ? <Check size={14} strokeWidth={3} /> : '3'}
              </div>
              <span className="step-title">การชำระเงิน</span>
            </div>

            <div className={`step-connector ${(activeOrder?.hasSlipUploaded || checkoutStep === 'tracking') ? 'done' : ''}`} />

            {/* Step 4 */}
            <div 
              className={`checkout-step-item ${checkoutStep === 'tracking' ? 'active' : ''}`}
              onClick={() => activeOrder && setCheckoutStep('tracking')}
              style={{ cursor: activeOrder ? 'pointer' : 'default' }}
            >
              <div className="step-circle">
                {activeOrder?.status === 'delivered' ? <Check size={14} strokeWidth={3} /> : '4'}
              </div>
              <span className="step-title">ติดตาม</span>
            </div>
          </div>
        </div>



        {/* PAY LATER SUCCESS NOTICE */}
        {payLaterNotice && (
          <div className="status-feedback-banner pending" style={{ marginBottom: '20px' }}>
            <div className="banner-icon-badge">
              <Clock size={20} />
            </div>
            <div className="banner-content-box">
              <h3>บันทึกคำสั่งซื้อเรียบร้อยแล้ว (ชำระเงินภายหลัง)</h3>
              <p>
                คำสั่งซื้อรหัส <strong>{activeOrder?.orderNo}</strong> ได้รับการบันทึกไว้ในระบบแล้ว ท่านสามารถนำใบแจ้งหนี้ไปเสนอขออนุมัติการจ่ายเงิน และกลับมาเปิดหน้านี้เพื่อแนบสลิปหลักฐานได้ตลอดเวลา
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-banner-action" onClick={() => setCheckoutStep('payment')}>
                  <Upload size={14} />
                  <span>พร้อมแนบสลิปแล้ว คลิกที่นี่</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* STEP 1: SHIPPING & ORDER OPTIONS FORM                         */}
        {/* ============================================================= */}
        {checkoutStep === 'shipping' && (
          <div className="checkout-layout-grid">
            {/* LEFT COLUMN: Customer info, Payment Plan & Payment Methods */}
            <div className="checkout-forms-column">
              {/* 1. Customer & Shipping Details */}
              <div className="checkout-card-section">
                <div className="section-card-head">
                  <div className="head-icon-circle">
                    <MapPin size={18} className="text-blue" />
                  </div>
                  <div>
                    <h3 className="section-card-title">1. ข้อมูลผู้รับและสถานที่จัดส่ง / ติดตั้ง</h3>
                    <p className="section-card-desc">ระบุข้อมูลสำหรับจัดส่งสินค้าและนัดหมายทีมช่างเข้าติดตั้ง</p>
                  </div>
                </div>

                <div className="form-fields-grid">
                  <div className="form-col-6">
                    <label className="field-label">ชื่อผู้รับ / ชื่อบริษัท <span className="req">*</span></label>
                    <input 
                      type="text" 
                      className={`checkout-input ${formErrors.receiverName ? 'input-error' : ''}`}
                      placeholder="เช่น นายสมชาย มั่นคง หรือ บจก. เอเปกซ์ อินเตอร์เน็ต"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                    />
                    {formErrors.receiverName && <span className="err-msg">{formErrors.receiverName}</span>}
                  </div>

                  <div className="form-col-6">
                    <label className="field-label">เบอร์โทรศัพท์ติดต่อ <span className="req">*</span></label>
                    <input 
                      type="tel" 
                      className={`checkout-input ${formErrors.phone ? 'input-error' : ''}`}
                      placeholder="เช่น 081-234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {formErrors.phone && <span className="err-msg">{formErrors.phone}</span>}
                  </div>

                  <div className="form-col-12">
                    <label className="field-label">อีเมลสำหรับรับใบเสร็จและแจ้งเตือนจัดส่ง <span className="req">*</span></label>
                    <input 
                      type="email" 
                      className="checkout-input"
                      placeholder="customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-col-12">
                    <label className="field-label">ที่อยู่จัดส่งและติดตั้งอย่างละเอียด <span className="req">*</span></label>
                    <textarea 
                      rows={3}
                      className={`checkout-textarea ${formErrors.deliveryAddress ? 'input-error' : ''}`}
                      placeholder="บ้านเลขที่, อาคาร/ชั้น, หมู่บ้าน, ซอย, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    />
                    {formErrors.deliveryAddress && <span className="err-msg">{formErrors.deliveryAddress}</span>}
                  </div>

                  <div className="form-col-12">
                    <label className="checkbox-field-wrap">
                      <input 
                        type="checkbox" 
                        checked={needTaxInvoice} 
                        onChange={(e) => setNeedTaxInvoice(e.target.checked)} 
                      />
                      <span className="checkbox-label-text">
                        <strong>ขอใบกำกับภาษีเต็มรูปแบบ (Full Tax Invoice)</strong> — ราคารวมภาษี 7% เรียบร้อยแล้ว
                      </span>
                    </label>
                  </div>

                  {needTaxInvoice && (
                    <div className="tax-invoice-subform form-col-12">
                      <div className="form-fields-grid">
                        <div className="form-col-6">
                          <label className="field-label">ชื่อนิติบุคคล / ชื่อบนใบกำกับภาษี</label>
                          <input 
                            type="text" 
                            className="checkout-input"
                            placeholder="ชื่อบริษัท หรือ ชื่อ-นามสกุล บุคคลธรรมดา"
                            value={taxCompanyName}
                            onChange={(e) => setTaxCompanyName(e.target.value)}
                          />
                        </div>
                        <div className="form-col-6">
                          <label className="field-label">เลขประจำตัวผู้เสียภาษี (13 หลัก) <span className="req">*</span></label>
                          <input 
                            type="text" 
                            maxLength={13}
                            className={`checkout-input ${formErrors.taxId ? 'input-error' : ''}`}
                            placeholder="เช่น 01055xxxxxxxx"
                            value={taxId}
                            onChange={(e) => setTaxId(e.target.value)}
                          />
                          {formErrors.taxId && <span className="err-msg">{formErrors.taxId}</span>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Payment Method Choice (100% Full Payment) */}
              <div className="checkout-card-section">
                <div className="section-card-head">
                  <div className="head-icon-circle">
                    <Building2 size={18} className="text-blue" />
                  </div>
                  <div>
                    <h3 className="section-card-title">2. ช่องทางชำระเงินที่ต้องการ (Payment Method)</h3>
                    <p className="section-card-desc">ชำระเต็มจำนวน 100% ปลอดภัย จัดส่งสินค้าพร้อมประกัน On-site เต็มรูปแบบ</p>
                  </div>
                </div>

                <div className="payment-method-tabs-row">
                  <button 
                    type="button"
                    className={`payment-method-pill ${paymentMethod === 'promptpay' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('promptpay')}
                  >
                    <QrCode size={16} />
                    <span>พร้อมเพย์ QR Code</span>
                  </button>
                  <button 
                    type="button"
                    className={`payment-method-pill ${paymentMethod === 'transfer' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    <Building2 size={16} />
                    <span>โอนเงินผ่านธนาคาร</span>
                  </button>
                </div>
              </div>

              {/* 3. Delivery Notes */}
              <div className="checkout-card-section">
                <label className="field-label">หมายเหตุเพิ่มเติมถึงผู้ขาย / ทีมช่าง (ไม่บังคับ)</label>
                <textarea 
                  rows={2}
                  className="checkout-textarea"
                  placeholder="เช่น ต้องการให้นัดหมายเวลาเข้าส่งล่วงหน้า 1 วัน, อาคารมีลิฟต์ขนของ ฯลฯ"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Order Summary & Proceed Button */}
            <div className="checkout-summary-column">
              <div className="checkout-summary-sticky-card">
                <div className="summary-card-header">
                  <h3 className="summary-title">สรุปรายการคำสั่งซื้อ</h3>
                  <span className="summary-count-tag">{totalItemCount} รายการ</span>
                </div>

                {/* Items List */}
                <div className="summary-items-list">
                  {cartItems.map((item, idx) => (
                    <div key={`${item.product.id}-${idx}`} className="summary-item-row">
                      <img src={item.product.image} alt={item.product.name} className="summary-item-thumb" />
                      <div className="summary-item-info">
                        <h4 className="summary-item-name">{item.product.name}</h4>
                        <div className="summary-item-variants">
                          {item.selectedColor && <span className="item-var-chip">{item.selectedColor.name}</span>}
                          {item.selectedSize && <span className="item-var-chip">{item.selectedSize.name}</span>}
                        </div>
                        <div className="summary-item-stepper-row">
                          <div className="c-mini-stepper">
                            <button onClick={() => updateQuantity(idx, -1)} aria-label="ลดจำนวน"><Minus size={12} /></button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(idx, 1)} aria-label="เพิ่มจำนวน"><Plus size={12} /></button>
                          </div>
                          <button className="c-remove-btn" onClick={() => removeFromCart(idx)} title="ลบรายการ">
                            <Trash2 size={13} />
                          </button>
                          <div className="summary-item-total">
                            ฿{(item.unitPrice * item.quantity).toLocaleString()}.-
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="summary-calculation-box">
                  <div className="calc-row">
                    <span>ยอดรวมสินค้า ({totalItemCount} ชิ้น):</span>
                    <span>฿{effectiveSubtotal.toLocaleString()}.-</span>
                  </div>
                  {effectiveDiscount > 0 && (
                    <div className="calc-row text-orange">
                      <span>ส่วนลดพิเศษ B2B ({volumeDiscountRate * 100}%):</span>
                      <span>-฿{effectiveDiscount.toLocaleString()}.-</span>
                    </div>
                  )}
                  <div className="calc-row">
                    <span>ภาษีมูลค่าเพิ่ม (VAT 7% รวมแล้ว):</span>
                    <span>฿{effectiveVat.toLocaleString()}.-</span>
                  </div>
                  <div className="calc-row text-emerald">
                    <span>ค่าบริการจัดส่ง:</span>
                    <strong>ฟรีทั่วประเทศ</strong>
                  </div>
                  
                  <div className="calc-row-divider" />

                  <div className="calc-row grand-total-line">
                    <span>ยอดรวมสุทธิทั้งสิ้น:</span>
                    <span className="grand-total-amount">฿{effectiveGrandTotal.toLocaleString()}.-</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="summary-actions-group">
                  <button 
                    id="btn-confirm-checkout-final"
                    className={`btn-confirm-checkout ${isProcessing ? 'is-loading' : ''}`}
                    onClick={handleProceedToInvoice}
                    disabled={isProcessing}
                  >
                    <span>{isProcessing ? 'กำลังออกใบแจ้งหนี้...' : 'ออกใบแจ้งหนี้การค้า & ไปหน้าสรุปยอด ➔'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="summary-trust-footer">
                  <div className="trust-point">
                    <ShieldCheck size={15} className="text-emerald" />
                    <span>ความปลอดภัยมาตรฐาน SSL 256-bit</span>
                  </div>
                  <div className="trust-point">
                    <Truck size={15} className="text-blue" />
                    <span>จัดส่งด่วนพร้อมประกอบติดตั้งหน้างาน</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* STEP 2: OFFICIAL PROFORMA INVOICE SHEET (พิมพ์/ส่งเอกสารบริษัท)  */}
        {/* ============================================================= */}
        {checkoutStep === 'invoice' && activeOrder && (
          <div>
            {/* Top Action Strip */}
            <div className="invoice-actions-strip" style={{ marginBottom: '16px' }}>
              <div className="invoice-actions-left">
                <button className="btn-inv-print" onClick={() => window.print()}>
                  <Download size={16} />
                  <span>ดาวน์โหลดใบสั่งซื้อ (PDF)</span>
                </button>
              </div>

              <div className="invoice-actions-right">
                <button 
                  className="btn-inv-pay-later"
                  onClick={() => {
                    setPayLaterNotice(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Clock size={15} />
                  <span>บันทึกไว้ นำไปเบิกจ่าย / ชำระภายหลัง</span>
                </button>

                <button 
                  className="btn-inv-pay-now"
                  onClick={() => {
                    setCheckoutStep('payment');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>ขั้นตอนถัดไป: ชำระเงิน & แนบสลิปหลักฐาน</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* A4 PROFORMA INVOICE SHEET */}
            <div className="official-invoice-sheet">
              {/* Header Strip */}
              <div className="invoice-header-strip">
                <div className="invoice-company-brand">
                  <h2>บริษัท จี สปีด ลิฟวิ่ง พลัส จำกัด (สำนักงานใหญ่)</h2>
                  <p><strong>G SPEED LIVING PLUS CO., LTD.</strong> • เลขประจำตัวผู้เสียภาษี: 0105561089123</p>
                  <p>ที่อยู่: 234/56 ถนนลาดพร้าว แขวงคลองเจ้าคุณสิงห์ เขตวังทองหลาง กรุงเทพฯ 10310</p>
                  <p>โทรศัพท์: 02-123-4567 • อีเมล: billing@gspeedlivingplus.com • เว็บไซต์: www.gspeedlivingplus.com</p>
                </div>

                <div className="invoice-doc-type-box">
                  <h1 className="invoice-doc-title">ใบแจ้งหนี้การค้า</h1>
                  <div className="invoice-doc-subtitle">PROFORMA INVOICE / PAYMENT ADVICE</div>
                  <div className="invoice-order-no-pill">
                    เลขที่คำสั่งซื้อ: {activeOrder.orderNo}
                  </div>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                    วันที่ออกเอกสาร: {new Date(activeOrder.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Meta Grid (Customer & Billing Info) */}
              <div className="invoice-meta-grid">
                <div className="invoice-meta-col">
                  <h4>ข้อมูลลูกค้า / ผู้สั่งซื้อ (Bill To):</h4>
                  <p><strong>ชื่อ-นามสกุล / นิติบุคคล:</strong> {activeOrder.shipping.receiverName}</p>
                  <p><strong>เบอร์โทรศัพท์:</strong> {activeOrder.shipping.phone}</p>
                  <p><strong>อีเมล:</strong> {activeOrder.shipping.email}</p>
                  <p><strong>สถานที่จัดส่ง/ติดตั้ง:</strong> {activeOrder.shipping.address}</p>
                  {activeOrder.shipping.notes && <p><strong>หมายเหตุ:</strong> {activeOrder.shipping.notes}</p>}
                </div>

                <div className="invoice-meta-col">
                  <h4>ข้อมูลออกใบกำกับภาษี (Tax Entity):</h4>
                  {activeOrder.taxInvoice ? (
                    <>
                      <p><strong>ชื่อบนใบกำกับ:</strong> {activeOrder.taxInvoice.companyName}</p>
                      <p><strong>เลขประจำตัวผู้เสียภาษี:</strong> {activeOrder.taxInvoice.taxId}</p>
                      <p><strong>สาขา:</strong> {activeOrder.taxInvoice.branch}</p>
                      <p style={{ color: '#15803d', fontWeight: 600 }}>✓ ราคารวมภาษีมูลค่าเพิ่ม 7% แล้ว</p>
                    </>
                  ) : (
                    <p style={{ color: '#64748b' }}>ออกใบเสร็จรับเงินในนามบุคคลธรรมดาตามชื่อผู้รับสินค้า</p>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="invoice-table-wrap">
                <table className="invoice-items-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }} className="text-center">#</th>
                      <th>รายการสินค้า / รายละเอียดอุปกรณ์</th>
                      <th style={{ width: '130px' }}>ตัวเลือก/ขนาด</th>
                      <th style={{ width: '70px' }} className="text-center">จำนวน</th>
                      <th style={{ width: '120px' }} className="text-right">ราคาต่อหน่วย</th>
                      <th style={{ width: '130px' }} className="text-right">จำนวนเงิน (บาท)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="text-center">{idx + 1}</td>
                        <td>
                          <strong>{item.name}</strong>
                          <span className="invoice-sku-code">SKU: {item.sku}</span>
                        </td>
                        <td>
                          <span className="invoice-variant-text">{item.color || '-'} {item.size ? `/ ${item.size}` : ''}</span>
                        </td>
                        <td className="text-center"><strong>{item.quantity}</strong></td>
                        <td className="text-right">฿{item.unitPrice.toLocaleString()}.-</td>
                        <td className="text-right"><strong>฿{item.totalPrice.toLocaleString()}.-</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invoice Calculations */}
              <div className="invoice-calc-row">
                <div className="invoice-terms-box">
                  <strong>เงื่อนไขการชำระเงินและการส่งมอบ:</strong>
                  <ul>
                    <li>การชำระเงิน: <strong>ชำระเต็มจำนวน 100% (Full Payment)</strong></li>
                    <li>บริการจัดส่งและประกอบติดตั้งฟรีทั่วประเทศโดยทีมช่างผู้เชี่ยวชาญ</li>
                    <li>รับประกันโครงสร้างและอุปกรณ์ On-site Service 3 - 5 ปีเต็ม</li>
                    <li>กรุณาชำระเงินภายใน 7 วัน นับจากวันที่ออกใบแจ้งหนี้นี้</li>
                  </ul>
                </div>

                <div className="invoice-totals-box">
                  <div className="inv-total-line">
                    <span>มูลค่าสินค้ารวม:</span>
                    <span>฿{effectiveSubtotal.toLocaleString()}.-</span>
                  </div>
                  {effectiveDiscount > 0 && (
                    <div className="inv-total-line" style={{ color: '#ea580c' }}>
                      <span>ส่วนลดพิเศษ B2B:</span>
                      <span>-฿{effectiveDiscount.toLocaleString()}.-</span>
                    </div>
                  )}
                  <div className="inv-total-line">
                    <span>ภาษีมูลค่าเพิ่ม (VAT 7% รวมแล้ว):</span>
                    <span>฿{effectiveVat.toLocaleString()}.-</span>
                  </div>
                  <div className="inv-total-line">
                    <span>ค่าขนส่งและติดตั้ง:</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>ฟรี (Free)</span>
                  </div>
                  <div className="inv-total-line amount-due">
                    <span>ยอดรวมสุทธิที่ต้องชำระ:</span>
                    <span>฿{effectiveGrandTotal.toLocaleString()}.-</span>
                  </div>
                  <div className="inv-baht-text-banner">
                    ({thaiBahtText(effectiveGrandTotal)})
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="invoice-signatures-row">
                <div className="inv-sign-box">
                  <div className="inv-sign-line" />
                  <span>ผู้สั่งซื้อ / ผู้อนุมัติจ่ายเงิน (Authorized Customer Signature)</span>
                </div>
                <div className="inv-sign-box">
                  <div className="inv-sign-line" />
                  <span>ผู้มีอำนาจลงนาม บจก. จี สปีด ลิฟวิ่ง พลัส (Gspeed Living Plus)</span>
                </div>
              </div>
            </div>

            {/* Bottom Proceed Action Button */}
            <div className="invoice-actions-strip">
              <button className="btn-inv-print" onClick={() => window.print()}>
                <Download size={16} />
                <span>ดาวน์โหลดใบสั่งซื้อ (PDF)</span>
              </button>

              <button 
                className="btn-inv-pay-now"
                onClick={() => {
                  setCheckoutStep('payment');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>ดำเนินการชำระเงิน & แนบสลิปหลักฐาน (Step 3)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* STEP 3: PAYMENT & SLIP UPLOAD (PDF / IMAGE SUPPORT)           */}
        {/* ============================================================= */}
        {checkoutStep === 'payment' && activeOrder && (
          <div className="checkout-layout-grid">
            <div className="checkout-forms-column">
              {/* Payment Method Details */}
              <div className="checkout-card-section">
                <div className="section-card-head">
                  <div className="head-icon-circle">
                    <Building2 size={18} className="text-blue" />
                  </div>
                  <div>
                    <h3 className="section-card-title">รายละเอียดการชำระเงิน (Order: {activeOrder.orderNo})</h3>
                    <p className="section-card-desc">ยอดชำระรอบนี้: <strong className="text-blue" style={{ fontSize: '16px' }}>฿{amountToPay.toLocaleString()}.-</strong></p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="payment-method-tabs-row">
                  <button 
                    type="button"
                    className={`payment-method-pill ${paymentMethod === 'promptpay' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('promptpay')}
                  >
                    <QrCode size={16} />
                    <span>พร้อมเพย์ QR Code</span>
                  </button>
                  <button 
                    type="button"
                    className={`payment-method-pill ${paymentMethod === 'transfer' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    <Building2 size={16} />
                    <span>โอนเงินผ่านธนาคาร</span>
                  </button>
                </div>

                {/* PROMPTPAY QR */}
                {paymentMethod === 'promptpay' && (
                  <div className="payment-content-box">
                    <div className="promptpay-payment-container">
                      <div className="promptpay-qr-column">
                        <div className="qr-badge-header">
                          <span className="thai-qr-logo">THAI QR PAYMENT</span>
                          <span className="qr-timer-pill">
                            <Clock size={13} /> หมดอายุใน {formatCountdown(qrCountdown)}
                          </span>
                        </div>

                        <div className="qr-image-wrapper">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=00020101021129370016A000000677010111011300668912345675802TH5303764540${amountToPay}6304`}
                            alt="PromptPay QR Code"
                            className="promptpay-qr-code-img"
                          />
                        </div>

                        <div className="qr-pay-amount">
                          ฿{amountToPay.toLocaleString()}.-
                        </div>
                        <p className="qr-account-owner">
                          ชื่อบัญชี: <strong>บริษัท จี สปีด ลิฟวิ่ง พลัส จำกัด</strong>
                        </p>
                      </div>

                      <div className="promptpay-upload-column">
                        <h4 className="upload-col-title">วิธีชำระเงินผ่าน Mobile Banking:</h4>
                        <ol className="qr-steps-list">
                          <li>เปิดแอปธนาคารของท่าน (K PLUS, SCB EASY, Krungthai NEXT, ฯลฯ)</li>
                          <li>สแกน QR Code ตรวจสอบยอดเงินให้ตรงกับ <strong>฿{amountToPay.toLocaleString()}.-</strong></li>
                          <li>กดยืนยันการโอนเงิน และบันทึกสลิปหลักฐาน (หรือดาวน์โหลดเป็นไฟล์ PDF)</li>
                          <li>อัปโหลดไฟล์สลิปหลักฐานลงในกล่องด้านล่าง เพื่อให้ระบบส่งต่อไปยังฝ่ายตรวจสอบ</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {/* BANK TRANSFER */}
                {paymentMethod === 'transfer' && (
                  <div className="payment-content-box">
                    <div className="bank-accounts-grid">
                      <div className="bank-account-card">
                        <div className="bank-card-top">
                          <div className="bank-badge kbank">KBANK</div>
                          <strong>ธนาคารกสิกรไทย</strong>
                        </div>
                        <div className="bank-acc-no-row">
                          <span className="acc-number">089-1-23456-7</span>
                          <button 
                            type="button"
                            className="btn-copy-acc"
                            onClick={() => handleCopyAccount('0891234567')}
                          >
                            <Copy size={13} />
                            <span>{copiedBank ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                          </button>
                        </div>
                        <p className="acc-name">ชื่อบัญชี: บจก. จี สปีด ลิฟวิ่ง พลัส (สาขาลาดพร้าว 112)</p>
                      </div>

                      <div className="bank-account-card">
                        <div className="bank-card-top">
                          <div className="bank-badge scb">SCB</div>
                          <strong>ธนาคารไทยพาณิชย์</strong>
                        </div>
                        <div className="bank-acc-no-row">
                          <span className="acc-number">123-4-56789-0</span>
                          <button 
                            type="button"
                            className="btn-copy-acc"
                            onClick={() => handleCopyAccount('1234567890')}
                          >
                            <Copy size={13} />
                            <span>{copiedBank ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                          </button>
                        </div>
                        <p className="acc-name">ชื่อบัญชี: บจก. จี สปีด ลิฟวิ่ง พลัส (สาขาบางกะปิ)</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SLIP UPLOAD DROPZONE (SUPPORTS BOTH IMAGE AND PDF) */}
              <div className="checkout-card-section">
                <div className="section-card-head">
                  <div className="head-icon-circle">
                    <Upload size={18} className="text-blue" />
                  </div>
                  <div>
                    <h3 className="section-card-title">แนบหลักฐานการชำระเงิน (Upload Payment Proof)</h3>
                    <p className="section-card-desc">รองรับทั้งไฟล์ภาพสลิปปกติ (JPG, PNG) และไฟล์เอกสารบริษัท (PDF)</p>
                  </div>
                </div>

                <div className="slip-dropzone-box" onClick={() => document.getElementById('slip-input-field')?.click()}>
                  <input 
                    type="file" 
                    id="slip-input-field"
                    accept=".pdf, application/pdf, image/*"
                    onChange={handleSlipChange}
                    style={{ display: 'none' }}
                  />
                  <div className="slip-dropzone-icon">
                    <Upload size={24} />
                  </div>
                  <div className="slip-dropzone-text">
                    <strong>คลิกเพื่อเลือกไฟล์สลิปหลักฐาน หรือลากไฟล์มาวางที่นี่</strong>
                    <p>รองรับไฟล์รูปภาพ JPG, PNG และไฟล์เอกสารธนาคาร PDF (ขนาดไม่เกิน 10MB)</p>
                  </div>
                </div>

                {/* Uploaded File Preview Badge */}
                {slipFile && (
                  <div className="slip-preview-container">
                    <div className="slip-preview-left">
                      {slipFileType === 'pdf' ? (
                        <div className="slip-pdf-badge">
                          <FileText size={24} />
                          <span>PDF FILE</span>
                        </div>
                      ) : (
                        <img src={slipPreview} alt="Slip Preview" className="slip-thumbnail-img" />
                      )}
                      <div className="slip-file-meta">
                        <strong>{slipFile.name}</strong>
                        <span>✓ อัปโหลดสำเร็จ ({slipFileSize}) • พร้อมตรวจสอบ</span>
                      </div>
                    </div>

                    <button type="button" className="btn-remove-slip" onClick={handleRemoveSlip}>
                      ลบไฟล์
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Action & Confirmation */}
            <div className="checkout-summary-column">
              <div className="checkout-summary-sticky-card">
                <div className="summary-card-header">
                  <h3 className="summary-title">สรุปคำสั่งซื้อ</h3>
                  <span className="summary-count-tag">{activeOrder.orderNo}</span>
                </div>

                <div className="summary-calculation-box">
                  <div className="calc-row">
                    <span>ยอดรวมสุทธิ:</span>
                    <span>฿{effectiveGrandTotal.toLocaleString()}.-</span>
                  </div>
                  <div className="calc-row pay-now-line">
                    <span>ยอดที่ต้องชำระรอบนี้:</span>
                    <span className="pay-now-highlight">฿{amountToPay.toLocaleString()}.-</span>
                  </div>
                  {remainingAmount > 0 && (
                    <div className="remaining-alert-bar">
                      คงเหลือชำระวันส่งมอบ: <strong>฿{remainingAmount.toLocaleString()}.-</strong>
                    </div>
                  )}
                </div>

                <div className="summary-actions-group">
                  <button 
                    id="btn-confirm-slip-submission"
                    className={`btn-confirm-checkout ${isProcessing ? 'is-loading' : ''}`}
                    onClick={handleConfirmSlipPayment}
                    disabled={isProcessing}
                  >
                    <Check size={18} />
                    <span>{isProcessing ? 'กำลังบันทึกหลักฐาน...' : 'ยืนยันการแจ้งชำระเงิน'}</span>
                  </button>

                  <button 
                    type="button"
                    className="btn-quote-alt-link"
                    onClick={() => setCheckoutStep('invoice')}
                  >
                    <ArrowLeft size={15} />
                    <span>ย้อนกลับไปดูใบแจ้งหนี้ (Invoice)</span>
                  </button>

                  <button 
                    type="button"
                    className="btn-inv-pay-later"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      setPayLaterNotice(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Clock size={15} />
                    <span>บันทึกไว้ ชำระภายหลัง</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* STEP 4: 5-STAGE VISUAL TIMELINE & REAL-TIME STATUS FEEDBACK   */}
        {/* โฟล: รับคำสั่งซื้อ > ตรวจสอบสลิป > กำลังเตรียมของ > กำลังจัดส่ง > จัดส่งสำเร็จ */}
        {/* ============================================================= */}
        {checkoutStep === 'tracking' && activeOrder && (() => {
          const isOwner = isOrderOwner(activeOrder) || isUnlockedByPhone;

          if (!isOwner) {
            return (
              <div className="order-tracking-card">
                <div className="order-privacy-locked-card">
                  <div className="privacy-lock-icon-halo">
                    <Shield size={36} />
                  </div>
                  <div className="privacy-lock-content">
                    <span className="privacy-security-badge">🔒 ระบบความปลอดภัยข้อมูลคำสั่งซื้อ (Protected Order)</span>
                    <h2 className="privacy-lock-title">คำสั่งซื้อนี้เป็นข้อมูลเฉพาะบุคคล</h2>
                    <p className="privacy-lock-order-no">
                      รหัสออเดอร์: <strong>{activeOrder.orderNo.replace(/^(.{10}).+(.{4})$/, '$1****$2')}</strong>
                    </p>
                    <p className="privacy-lock-desc">
                      เพื่อรักษาความเป็นส่วนตัวและความปลอดภัยของข้อมูลผู้สั่งซื้อ ที่อยู่จัดส่ง เบอร์โทรศัพท์ และเอกสารใบแจ้งหนี้การค้า อนุญาตให้เฉพาะเจ้าของคำสั่งซื้อเข้าดูรายละเอียดได้เท่านั้น
                    </p>

                    <div className="privacy-action-box">
                      <button 
                        type="button"
                        className="btn-privacy-google-login"
                        onClick={() => openLoginModal(activeOrder.orderNo)}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>เข้าสู่ระบบด้วย Google เพื่อดูออเดอร์</span>
                      </button>

                      <div className="privacy-or-divider">
                        <span>หรือยืนยันด้วยเบอร์โทรศัพท์ผู้รับของออเดอร์นี้</span>
                      </div>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const cleanInput = phoneUnlockInput.replace(/[^0-9]/g, '');
                          const cleanTarget = (activeOrder.shipping?.phone || '').replace(/[^0-9]/g, '');
                          if (cleanInput && (cleanTarget.endsWith(cleanInput) || cleanInput.endsWith(cleanTarget))) {
                            setIsUnlockedByPhone(true);
                            setPhoneUnlockError(null);
                            registerSessionOrder(activeOrder.orderNo);
                          } else {
                            setPhoneUnlockError('เบอร์โทรศัพท์ไม่ตรงกับข้อมูลในคำสั่งซื้อนี้ กรุณาตรวจสอบอีกครั้ง');
                          }
                        }}
                        className="privacy-phone-form"
                      >
                        <div className="privacy-phone-row">
                          <input 
                            type="tel"
                            className="privacy-phone-input"
                            placeholder="กรอกเบอร์โทรศัพท์ผู้รับ (เช่น 0812345678)"
                            value={phoneUnlockInput}
                            onChange={(e) => {
                              setPhoneUnlockInput(e.target.value);
                              setPhoneUnlockError(null);
                            }}
                          />
                          <button type="submit" className="btn-privacy-verify-phone">
                            ยืนยันตัวตน
                          </button>
                        </div>
                        {phoneUnlockError && (
                          <p className="privacy-phone-error">⚠️ {phoneUnlockError}</p>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div>
              <div className="order-tracking-card">
                {/* Header */}
                <div className="track-header-row">
                  <div className="track-order-ident">
                    <h2>คำสั่งซื้อเลขที่: <span className="track-order-no">{activeOrder.orderNo}</span></h2>
                    <p>สั่งซื้อเมื่อ: {new Date(activeOrder.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.</p>
                  </div>

                  <div className="track-header-buttons">
                    <button 
                      type="button" 
                      className="btn-quick-copy-num"
                      onClick={() => {
                        navigator.clipboard?.writeText(activeOrder.orderNo);
                        setCopiedOrderNum(true);
                        setTimeout(() => setCopiedOrderNum(false), 2500);
                      }}
                      title="คัดลอกหมายเลขคำสั่งซื้อ"
                    >
                      <Copy size={14} />
                      <span>{copiedOrderNum ? '✓ คัดลอกเลขแล้ว!' : 'คัดลอกเลขคำสั่งซื้อ'}</span>
                    </button>

                    <button 
                      type="button"
                      className="btn-copy-order-url"
                      onClick={() => {
                        const url = `${window.location.origin}/orders/${activeOrder.orderNo}`;
                        navigator.clipboard?.writeText(url);
                        setCopiedOrderUrl(true);
                        setTimeout(() => setCopiedOrderUrl(false), 2500);
                      }}
                    >
                      <Share2 size={14} />
                      <span>{copiedOrderUrl ? '✓ คัดลอกลิงก์แล้ว' : 'แชร์ลิงก์เช็คสถานะ'}</span>
                    </button>

                    <button className="btn-inv-print" onClick={() => setCheckoutStep('invoice')}>
                      <Download size={15} />
                      <span>ดาวน์โหลดใบสั่งซื้อ</span>
                    </button>
                  </div>
                </div>

                {/* Important Notice: Order No is Crucial */}
                <div className="guest-order-notice-box">
                  <p className="guest-notice-desc">
                    💡 <strong>สำคัญมาก:</strong> โปรดบันทึกหรือคัดลอก <strong>หมายเลขคำสั่งซื้อ ({activeOrder.orderNo})</strong> นี้ไว้ เพื่อใช้ตรวจสอบสถานะการจัดส่ง หรือแจ้งชำระเงินภายหลังได้ตลอด 24 ชม.
                  </p>
                </div>

                {/* 5-STEP HORIZONTAL VISUAL TIMELINE */}
                {/* Stages: 1.รับคำสั่งซื้อ > 2.ตรวจสอบสลิป > 3.กำลังเตรียมของ > 4.กำลังจัดส่ง > 5.จัดส่งสำเร็จ */}
                <div className="order-timeline-scroll-wrapper">
                  <div className="order-five-steps-timeline">
                    <div className="timeline-connecting-line">
                      <div 
                        className="timeline-connecting-progress"
                        style={{ 
                          width: activeTimelineIndex === 0 ? '10%' :
                                 activeTimelineIndex === 1 ? '30%' :
                                 activeTimelineIndex === 2 ? '55%' :
                                 activeTimelineIndex === 3 ? '80%' : '100%' 
                        }}
                      />
                    </div>

                    {/* Node 1: รับคำสั่งซื้อ */}
                    <div className={`timeline-step-node ${activeTimelineIndex > 0 ? 'done' : activeTimelineIndex === 0 ? 'active' : ''}`}>
                      <div className="step-circle-icon">
                        {activeTimelineIndex > 0 ? <Check size={20} /> : <FileCheck size={20} />}
                      </div>
                      <div className="step-label-title">1. รับคำสั่งซื้อ</div>
                      <div className="step-label-desc">บันทึกในระบบ</div>
                    </div>

                    {/* Node 2: ตรวจสอบสลิป */}
                    <div className={`timeline-step-node ${
                      currentOrderStatus === 'payment_issue' ? 'issue' :
                      activeTimelineIndex > 1 ? 'done' : 
                      activeTimelineIndex === 1 ? 'active' : ''
                    }`}>
                      <div className="step-circle-icon">
                        {currentOrderStatus === 'payment_issue' ? <XCircle size={20} /> :
                         activeTimelineIndex > 1 ? <Check size={20} /> : <Search size={20} />}
                      </div>
                      <div className="step-label-title">2. ตรวจสอบสลิป</div>
                      <div className="step-label-desc">
                        {currentOrderStatus === 'payment_issue' ? 'สลิปไม่ถูกต้อง' : 
                         activeTimelineIndex > 1 ? 'ยอดเงินถูกต้อง' : 'ตรวจยอดเงิน'}
                      </div>
                    </div>

                    {/* Node 3: กำลังเตรียมของ */}
                    <div className={`timeline-step-node ${activeTimelineIndex > 2 ? 'done' : activeTimelineIndex === 2 ? 'active' : ''}`}>
                      <div className="step-circle-icon">
                        {activeTimelineIndex > 2 ? <Check size={20} /> : <PackageCheck size={20} />}
                      </div>
                      <div className="step-label-title">3. กำลังเตรียมของ</div>
                      <div className="step-label-desc">จัดสินค้า & QC</div>
                    </div>

                    {/* Node 4: กำลังจัดส่ง */}
                    <div className={`timeline-step-node ${activeTimelineIndex > 3 ? 'done' : activeTimelineIndex === 3 ? 'active' : ''}`}>
                      <div className="step-circle-icon">
                        {activeTimelineIndex > 3 ? <Check size={20} /> : <Truck size={20} />}
                      </div>
                      <div className="step-label-title">4. กำลังจัดส่ง</div>
                      <div className="step-label-desc">ทีมนัดหมายส่ง/ติดตั้ง</div>
                    </div>

                    {/* Node 5: จัดส่งสำเร็จ */}
                    <div className={`timeline-step-node ${activeTimelineIndex === 4 ? 'done' : ''}`}>
                      <div className="step-circle-icon">
                        <CheckCheck size={20} />
                      </div>
                      <div className="step-label-title">5. จัดส่งสำเร็จ</div>
                      <div className="step-label-desc">ตรวจรับมอบงาน</div>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC STATUS FEEDBACK BANNER */}
                {/* Case 1: Order received without slip */}
                {currentOrderStatus === 'order_received' && (
                  <div className="status-feedback-banner pending">
                    <div className="banner-icon-badge">
                      <Clock size={22} />
                    </div>
                    <div className="banner-content-box">
                      <h3>สถานะ: รับคำสั่งซื้อแล้ว (รอการชำระเงินและแนบหลักฐาน)</h3>
                      <p>
                        ระบบได้รับรายการสั่งซื้อของท่านแล้ว ยอดชำระรอบนี้: <strong>฿{amountToPay.toLocaleString()}.-</strong> กรุณาดำเนินการชำระเงินและแนบสลิป เพื่อให้เจ้าหน้าที่ตรวจสอบยอดเงินและเริ่มเตรียมจัดส่ง
                      </p>
                      <button className="btn-banner-action" onClick={() => setCheckoutStep('payment')}>
                        <Upload size={15} />
                        <span>ไปหน้าชำระเงินและแนบสลิป ➔</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Case 2: Slip uploaded, verifying payment */}
                {currentOrderStatus === 'verifying_payment' && (
                  <div className="status-feedback-banner pending">
                    <div className="banner-icon-badge">
                      <RefreshCw size={22} className="spin-slow" />
                    </div>
                    <div className="banner-content-box">
                      <h3>สถานะ: กำลังตรวจสอบสลิปหลักฐานการชำระเงิน (รอการตรวจสอบ)</h3>
                      <p>
                        ระบบได้รับหลักฐานการชำระเงินของท่านเรียบร้อยแล้ว เจ้าหน้าที่ฝ่ายการเงินกำลังดำเนินการตรวจสอบยอดเงินในบัญชี (ใช้เวลาประมาณ 5 - 15 นาที) ท่านสามารถปิดหน้านี้และกลับมาตรวจสอบใหม่ได้ตลอดเวลา
                      </p>
                      {activeOrder.slipFileName && (
                        <p style={{ fontSize: '12px', color: '#1e40af' }}>
                          ไฟล์หลักฐานที่แนบ: <strong>{activeOrder.slipFileName}</strong> ({activeOrder.slipFileType === 'pdf' ? 'เอกสาร PDF' : 'ไฟล์รูปภาพ'})
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Case 3: Payment Verified */}
                {currentOrderStatus === 'payment_verified' && (
                  <div className="status-feedback-banner verified">
                    <div className="banner-icon-badge">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="banner-content-box">
                      <h3>สถานะ: ตรวจสอบยอดเงินเรียบร้อยแล้ว! (Payment Verified)</h3>
                      <p>
                        เจ้าหน้าที่ได้ตรวจสอบยอดเงิน <strong>฿{amountToPay.toLocaleString()}.-</strong> เข้าบัญชีเรียบร้อยสมบูรณ์ ทางเราได้ส่งคำสั่งซื้อต่อไปยังฝ่ายคลังสินค้าเพื่อจัดเตรียมอุปกรณ์และจองคิวรถขนส่งแล้ว
                      </p>
                    </div>
                  </div>
                )}

                {/* Case 4: Payment Issue / Slip Problem */}
                {currentOrderStatus === 'payment_issue' && (
                  <div className="status-feedback-banner issue">
                    <div className="banner-icon-badge">
                      <AlertCircle size={24} />
                    </div>
                    <div className="banner-content-box">
                      <h3>แจ้งเตือน: ตรวจสอบยอดเงินไม่สำเร็จ หรือสลิปหลักฐานไม่ถูกต้อง</h3>
                      <p>
                        {activeOrder.statusNote || 'เจ้าหน้าที่ตรวจสอบแล้วไม่พบยอดเงินเข้าบัญชี หรือรูปภาพ/เอกสารสลิปไม่ชัดเจน/ยอดไม่ตรงกับคำสั่งซื้อ กรุณาตรวจสอบหรือแนบหลักฐานสลิปใหม่อีกครั้ง'}
                      </p>
                      <button className="btn-banner-action" onClick={() => setCheckoutStep('payment')}>
                        <Upload size={15} />
                        <span>อัปโหลดสลิปใหม่อีกครั้ง (Re-upload Slip)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Case 5: Preparing Items */}
                {currentOrderStatus === 'preparing_items' && (
                  <div className="status-feedback-banner preparing">
                    <div className="banner-icon-badge">
                      <PackageCheck size={24} />
                    </div>
                    <div className="banner-content-box">
                      <h3>สถานะ: กำลังจัดเตรียมสินค้าและตรวจเช็คคุณภาพ (Preparing Items)</h3>
                      <p>
                        ฝ่ายคลังสินค้ากำลังจัดเตรียมโต๊ะ เก้าอี้ และอุปกรณ์ครบชุด พร้อมตรวจเช็คสภาพความสมบูรณ์ (QC) ก่อนแพ็กเกจส่งมอบ
                      </p>
                    </div>
                  </div>
                )}

                {/* Case 6: Shipping */}
                {currentOrderStatus === 'shipping' && (
                  <div className="status-feedback-banner shipping">
                    <div className="banner-icon-badge">
                      <Truck size={24} />
                    </div>
                    <div className="banner-content-box">
                      <h3>สถานะ: สินค้ากำลังอยู่ระหว่างการจัดส่ง (Out for Delivery)</h3>
                      <p>
                        {activeOrder.statusNote || `สินค้าของท่านกำลังอยู่บนรถขนส่ง ทีมงานจะโทรติดต่อผู้รับที่เบอร์ ${activeOrder.shipping.phone} เพื่อนัดหมายเวลาส่งมอบและประกอบติดตั้งหน้างาน`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Case 7: Delivered */}
                {currentOrderStatus === 'delivered' && (
                  <div className="status-feedback-banner delivered">
                    <div className="banner-icon-badge">
                      <CheckCheck size={24} />
                    </div>
                    <div className="banner-content-box">
                      <h3>สถานะ: จัดส่งและติดตั้งสำเร็จเรียบร้อย (Delivered)</h3>
                      <p>
                        สินค้าได้จัดส่งถึงผู้รับและประกอบติดตั้งเรียบร้อยแล้ว การรับประกัน On-site Service เริ่มมีผลตั้งแต่วันนี้ ขอขอบคุณที่ไว้วางใจ Gspeed Living Plus!
                      </p>
                    </div>
                  </div>
                )}

                {/* CARRIER TRACKING CARD (ขนส่ง & เลขพัสดุ พร้อมลิงก์ตรวจเช็ค Real-time) */}
                {(activeOrder.shippingCarrier || activeOrder.trackingNumber || activeOrder.status === 'shipping' || activeOrder.status === 'delivered') && (
                  <div className="order-carrier-direct-box">
                    <div className="carrier-direct-head">
                      <div className="carrier-badge-icon">
                        <Truck size={22} />
                      </div>
                      <div>
                        <h4 className="carrier-title">
                          ผู้ให้บริการขนส่ง: <strong>{activeOrder.shippingCarrier || 'ขนส่งและทีมช่าง GLP Logistics'}</strong>
                        </h4>
                        <span className="carrier-subtitle">ส่งมอบพัสดุเข้าระบบขนส่งเรียบร้อยแล้ว</span>
                      </div>
                    </div>

                    {activeOrder.trackingNumber ? (
                      <div className="carrier-track-action-row">
                        <div className="carrier-track-code">
                          <span className="code-label">เลขพัสดุ (Tracking No.):</span>
                          <strong className="code-val">{activeOrder.trackingNumber}</strong>
                          <button 
                            type="button" 
                            className="btn-copy-tracking"
                            onClick={() => {
                              navigator.clipboard?.writeText(activeOrder.trackingNumber);
                              alert(`คัดลอกเลขพัสดุ ${activeOrder.trackingNumber} เรียบร้อยแล้ว`);
                            }}
                          >
                            <Copy size={13} />
                            <span>คัดลอก</span>
                          </button>
                        </div>

                        {getCarrierTrackUrl(activeOrder.shippingCarrier, activeOrder.trackingNumber) && (
                          <a 
                            href={getCarrierTrackUrl(activeOrder.shippingCarrier, activeOrder.trackingNumber)}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-track-carrier-external"
                          >
                            <ExternalLink size={14} />
                            <span>ตรวจสอบสถานะกับ {activeOrder.shippingCarrier || 'ผู้ให้บริการขนส่ง'} ↗</span>
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="carrier-awaiting-note">
                        ทีมงานกำลังจัดทำใบส่งสินค้าและรหัสพัสดุ เลขติดตามจะแสดงในกล่องนี้ทันทีที่มีการส่งมอบ
                      </p>
                    )}
                  </div>
                )}

                {/* STORE CUSTOMER UPDATES / NOTES TIMELINE */}
                {Array.isArray(activeOrder.orderNotes) && activeOrder.orderNotes.filter(n => n.type === 'customer').length > 0 && (
                  <div className="order-customer-notes-card">
                    <div className="order-customer-notes-head">
                      <div className="notes-head-icon">
                        <FileText size={18} />
                      </div>
                      <h4 className="notes-head-title">ข้อความอัปเดตจากทางร้าน (Store Updates)</h4>
                    </div>
                    <div className="notes-timeline-list">
                      {activeOrder.orderNotes.filter(n => n.type === 'customer').map((note) => (
                        <div key={note.id || note.createdAt} className="notes-timeline-item">
                          <div className="notes-item-header">
                            <span className="notes-item-author">{note.author || 'เจ้าหน้าที่ฝ่ายบริการ GLP'}</span>
                            <span className="notes-item-time">
                              {new Date(note.createdAt).toLocaleDateString('th-TH', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} น.
                            </span>
                          </div>
                          <p className="notes-item-content">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ORDER ITEMS TABLE CARD */}
                {Array.isArray(activeOrder.items) && activeOrder.items.length > 0 && (
                  <div className="order-items-tracking-card">
                    <div className="order-items-card-head">
                      <h4 className="order-items-card-title">
                        <ShoppingBag size={18} />
                        <span>รายการสินค้าในคำสั่งซื้อ</span>
                        <span className="order-items-badge-count">{activeOrder.items.length} รายการ</span>
                      </h4>
                    </div>

                    <div className="order-items-list-wrapper">
                      {activeOrder.items.map((item, idx) => (
                        <div key={item.id || idx} className="order-item-tracking-row">
                          <div className="order-item-info-group">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="order-item-tracking-thumb"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="order-item-thumb-placeholder">
                                <ShoppingBag size={22} />
                              </div>
                            )}
                            <div className="order-item-meta-col">
                              <h5 className="order-item-name">{item.name}</h5>
                              <div className="order-item-options-badges">
                                {item.sku && <span className="order-item-badge">SKU: {item.sku}</span>}
                                {item.color && <span className="order-item-badge">สี: {item.color}</span>}
                                {item.size && <span className="order-item-badge">ขนาด: {item.size}</span>}
                              </div>
                            </div>
                          </div>

                          <div className="order-item-price-col">
                            <div className="order-item-qty-rate">
                              ฿{(item.unitPrice || 0).toLocaleString()} × {item.quantity || 1} ชิ้น
                            </div>
                            <div className="order-item-subtotal-price">
                              ฿{((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}.-
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Pricing Calculation Breakdown */}
                    <div className="order-tracking-pricing-summary">
                      <div className="summary-calc-row">
                        <span>ยอดรวมสินค้า (Subtotal):</span>
                        <span>฿{(activeOrder.pricing?.subtotal || effectiveSubtotal).toLocaleString()}.-</span>
                      </div>
                      {(activeOrder.pricing?.discount || effectiveDiscount) > 0 && (
                        <div className="summary-calc-row" style={{ color: '#16a34a' }}>
                          <span>ส่วนลดพิเศษ (Discount):</span>
                          <span>-฿{(activeOrder.pricing?.discount || effectiveDiscount).toLocaleString()}.-</span>
                        </div>
                      )}
                      <div className="summary-calc-row">
                        <span>ภาษีมูลค่าเพิ่ม (VAT 7% รวมในยอด):</span>
                        <span>฿{(activeOrder.pricing?.vat || effectiveVat).toLocaleString()}.-</span>
                      </div>
                      <div className="summary-calc-row total-row">
                        <span>ยอดชำระสุทธิ (Grand Total):</span>
                        <span>฿{effectiveGrandTotal.toLocaleString()}.-</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Details Accordion / Summary Box */}
                <div className="order-summary-box-complete" style={{ marginTop: '20px' }}>
                  <div className="order-info-grid">
                    <div className="order-info-col">
                      <strong>ข้อมูลการจัดส่งและผู้รับ:</strong>
                      <p>ชื่อผู้รับ: {activeOrder.shipping.receiverName}</p>
                      <p>เบอร์ติดต่อ: {activeOrder.shipping.phone}</p>
                      {activeOrder.shipping.email && <p>อีเมล: {activeOrder.shipping.email}</p>}
                      <p>ที่อยู่จัดส่ง: {activeOrder.shipping.address}</p>
                      {activeOrder.shipping.notes && <p>หมายเหตุ: {activeOrder.shipping.notes}</p>}
                    </div>

                    <div className="order-info-col">
                      <strong>การชำระเงินและภาษี:</strong>
                      <p>ยอดชำระสุทธิ: <strong style={{ color: '#1d4ed8' }}>฿{effectiveGrandTotal.toLocaleString()}.-</strong></p>
                      <p>วิธีชำระเงิน: {activeOrder.paymentMethod === 'promptpay' ? 'พร้อมเพย์ QR Code (100%)' : 'โอนเงินผ่านธนาคาร'}</p>
                      <p>หลักฐานการชำระเงิน: {activeOrder.hasSlipUploaded ? '✓ แนบสลิปเรียบร้อยแล้ว' : 'ยังไม่ได้แนบสลิป'}</p>
                      {activeOrder.taxInvoice?.taxId ? (
                        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a', display: 'block', fontSize: '12px' }}>ออกใบกำกับภาษีในนาม:</span>
                          <span style={{ display: 'block', fontSize: '12px', color: '#475569' }}>
                            {activeOrder.taxInvoice.companyName} (เลขผู้เสียภาษี: {activeOrder.taxInvoice.taxId} / สาขา: {activeOrder.taxInvoice.branch || 'สำนักงานใหญ่'})
                          </span>
                        </div>
                      ) : (
                        <p style={{ fontSize: '12px', color: '#64748b' }}>ภาษี: ราคารวม VAT 7% เรียบร้อยแล้ว</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="success-actions-row" style={{ marginTop: '24px' }}>
                  <button 
                    type="button"
                    className="btn-download-order-doc"
                    onClick={() => {
                      setCheckoutStep('invoice');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <Download size={18} />
                    <span>ดาวน์โหลดใบสั่งซื้อ</span>
                  </button>

                  <button 
                    type="button"
                    className="btn-continue-store-primary"
                    onClick={onNavigateStore}
                  >
                    <ShoppingBag size={18} />
                    <span>เลือกซื้อสินค้าอื่น</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* CUSTOM POPUP MODAL: SLIP REQUIRED (Replaces native browser alert) */}
        {isSlipRequiredModalOpen && (
          <div 
            className="store-modal-backdrop"
            onClick={() => setIsSlipRequiredModalOpen(false)}
            style={{ zIndex: 100020 }}
          >
            <div 
              className="store-modal-container"
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '440px', borderRadius: '20px' }}
            >
              <div style={{
                padding: '24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#fef3c7',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <AlertCircle size={32} />
                </div>

                <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  กรุณาแนบหลักฐานการชำระเงิน
                </h3>
                <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                  เพื่อความรวดเร็วในการตรวจสอบยอดเงินและจัดเตรียมสินค้าเข้าระบบ กรุณาแนบไฟล์รูปภาพสลิปโอนเงิน (JPG, PNG) หรือเอกสารธนาคาร PDF ก่อนยืนยันการแจ้งชำระเงิน
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  <button 
                    type="button"
                    className="btn-confirm-checkout"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      setIsSlipRequiredModalOpen(false);
                      setTimeout(() => {
                        document.getElementById('slip-input-field')?.click();
                      }, 150);
                    }}
                  >
                    <Upload size={16} />
                    <span>เลือกไฟล์สลิปทันที (Select File)</span>
                  </button>

                  <button 
                    type="button"
                    style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    onClick={() => setIsSlipRequiredModalOpen(false)}
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
