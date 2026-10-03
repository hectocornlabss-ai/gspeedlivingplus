import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Package, CheckCircle2, Clock, Truck, 
  AlertTriangle, AlertCircle, Eye, Search, Plus, Trash2, 
  Edit3, RotateCw, ExternalLink, Download, FileText, Check, 
  X, Filter, ChevronRight, ArrowUpDown, DollarSign, Tag,
  Phone, Mail, MapPin, Printer, ShieldCheck, Flame, Image as ImageIcon,
  Sliders, Info, Maximize2, ZoomIn, ZoomOut
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteData } from '../context/SiteDataContext';
import { EQUIPMENT_PRODUCTS, PRODUCT_CATEGORIES } from '../data/equipmentProducts';
import { compressAndConvertToWebP } from '../utils/imageOptimizer';
import WooCommerceOrderEditor from './WooCommerceOrderEditor';
import './StoreOrdersAndProductsCMS.css';

// Status labels & badges mapping
export const ORDER_STATUS_CONFIG = {
  verifying_payment: {
    label: 'รอตรวจสอบสลิป',
    color: '#b45309',
    bg: '#fef3c7',
    icon: Clock
  },
  payment_verified: {
    label: 'ชำระแล้ว / อนุมัติสลิป',
    color: '#15803d',
    bg: '#dcfce7',
    icon: CheckCircle2
  },
  preparing_items: {
    label: 'กำลังเตรียมพัสดุ',
    color: '#0369a1',
    bg: '#e0f2fe',
    icon: Package
  },
  shipping: {
    label: 'กำลังจัดส่งพัสดุ',
    color: '#6d28d9',
    bg: '#ede9fe',
    icon: Truck
  },
  delivered: {
    label: 'จัดส่งสำเร็จ',
    color: '#0f766e',
    bg: '#ccfbf1',
    icon: ShieldCheck
  },
  payment_issue: {
    label: 'สลิปมีปัญหา / รอแก้ไข',
    color: '#b91c1c',
    bg: '#fee2e2',
    icon: AlertTriangle
  },
  order_received: {
    label: 'รอการชำระเงิน',
    color: '#475569',
    bg: '#f1f5f9',
    icon: Clock
  }
};

export default function StoreOrdersAndProductsCMS() {
  const { 
    savedOrders = [], 
    updateOrderStatus, 
    updateOrder,
    deleteOrder, 
    createOrder,
    setSavedOrders 
  } = useCart();

  const {
    siteData,
    updateEquipmentProduct,
    addEquipmentProduct,
    deleteEquipmentProduct,
    resetEquipmentProducts
  } = useSiteData();

  const productsList = siteData?.equipmentProducts || EQUIPMENT_PRODUCTS;

  // Active Main Sub-tab: 'orders' | 'products'
  const [activeMainTab, setActiveMainTab] = useState('orders');

  // -------------------------------------------------------------
  // ORDERS MANAGEMENT STATES
  // -------------------------------------------------------------
  const [orderFilterStatus, setOrderFilterStatus] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState(null);
  const [activeSlipZoomUrl, setActiveSlipZoomUrl] = useState(null);
  const [isShippingPromptOpen, setIsShippingPromptOpen] = useState(false);
  const [orderToShip, setOrderToShip] = useState(null);
  const [shippingCarrierInput, setShippingCarrierInput] = useState('Kerry Express');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pending slips count
  const pendingSlipsCount = useMemo(() => {
    return savedOrders.filter(o => o.status === 'verifying_payment' || (o.hasSlipUploaded && o.status !== 'payment_verified' && o.status !== 'delivered' && o.status !== 'shipping' && o.status !== 'preparing_items')).length;
  }, [savedOrders]);

  // Orders Filtered List
  const filteredOrders = useMemo(() => {
    let list = [...savedOrders];

    if (orderFilterStatus !== 'all') {
      list = list.filter(o => o.status === orderFilterStatus);
    }

    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase().trim();
      list = list.filter(o => 
        (o.orderNo && o.orderNo.toLowerCase().includes(q)) ||
        (o.shipping?.receiverName && o.shipping.receiverName.toLowerCase().includes(q)) ||
        (o.shipping?.phone && o.shipping.phone.includes(q)) ||
        (o.shipping?.email && o.shipping.email.toLowerCase().includes(q)) ||
        (o.taxInvoice?.companyName && o.taxInvoice.companyName.toLowerCase().includes(q))
      );
    }

    // Default newest first
    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [savedOrders, orderFilterStatus, orderSearchQuery]);

  // Order Quick Actions
  const handleApproveSlip = (orderNo) => {
    updateOrderStatus(orderNo, 'payment_verified', 'ตรวจสอบยอดเงินและสลิปโอนเงินถูกต้องเรียบร้อยแล้ว');
    showToast(`อนุมัติสลิปคำสั่งซื้อ ${orderNo} สำเร็จ`);
    if (selectedOrderForDetail && selectedOrderForDetail.orderNo === orderNo) {
      setSelectedOrderForDetail(prev => prev ? { ...prev, status: 'payment_verified', statusNote: 'ตรวจสอบยอดเงินและสลิปโอนเงินถูกต้องเรียบร้อยแล้ว' } : null);
    }
  };

  const handlePrepareItems = (orderNo) => {
    updateOrderStatus(orderNo, 'preparing_items', 'คลังสินค้ากำลังจัดเตรียมอุปกรณ์และตรวจสอบความเรียบร้อย');
    showToast(`อัปเดตสถานะคำสั่งซื้อ ${orderNo} เป็น "กำลังเตรียมพัสดุ"`);
    if (selectedOrderForDetail && selectedOrderForDetail.orderNo === orderNo) {
      setSelectedOrderForDetail(prev => prev ? { ...prev, status: 'preparing_items', statusNote: 'คลังสินค้ากำลังจัดเตรียมอุปกรณ์และตรวจสอบความเรียบร้อย' } : null);
    }
  };

  const handleOpenShipModal = (order) => {
    setOrderToShip(order);
    setShippingCarrierInput(order.shippingCarrier || 'Kerry Express');
    setTrackingNumberInput(order.trackingNumber || `KEX${Math.floor(10000000 + Math.random() * 90000000)}TH`);
    setIsShippingPromptOpen(true);
  };

  const handleConfirmShipment = () => {
    if (!orderToShip) return;
    updateOrderStatus(
      orderToShip.orderNo, 
      'shipping', 
      `พัสดุถูกส่งมอบให้ ${shippingCarrierInput} แล้ว เลขพัสดุ: ${trackingNumberInput}`,
      { shippingCarrier: shippingCarrierInput, trackingNumber: trackingNumberInput }
    );
    showToast(`บันทึกการจัดส่ง ${orderToShip.orderNo} สำเร็จ`);
    setIsShippingPromptOpen(false);
    if (selectedOrderForDetail && selectedOrderForDetail.orderNo === orderToShip.orderNo) {
      setSelectedOrderForDetail(prev => prev ? {
        ...prev, 
        status: 'shipping', 
        shippingCarrier: shippingCarrierInput, 
        trackingNumber: trackingNumberInput,
        statusNote: `พัสดุถูกส่งมอบให้ ${shippingCarrierInput} แล้ว เลขพัสดุ: ${trackingNumberInput}`
      } : null);
    }
    setOrderToShip(null);
  };

  const handleMarkDelivered = (orderNo) => {
    updateOrderStatus(orderNo, 'delivered', 'พัสดุได้รับการจัดส่งและส่งมอบถึงผู้รับเรียบร้อยแล้ว');
    showToast(`คำสั่งซื้อ ${orderNo} จัดส่งสำเร็จ`);
    if (selectedOrderForDetail && selectedOrderForDetail.orderNo === orderNo) {
      setSelectedOrderForDetail(prev => prev ? { ...prev, status: 'delivered', statusNote: 'พัสดุได้รับการจัดส่งและส่งมอบถึงผู้รับเรียบร้อยแล้ว' } : null);
    }
  };

  const handleFlagSlipIssue = (orderNo) => {
    const reason = prompt('กรุณาระบุปัญหาของสลิป (เช่น "ยอดเงินไม่ตรง", "ภาพสลิปไม่ชัดเจน", "สลิปซ้ำ"):', 'ยอดเงินไม่ตรงกับยอดคำสั่งซื้อ กรุณาตรวจสอบและแนบใหม่อีกครั้ง');
    if (reason !== null) {
      updateOrderStatus(orderNo, 'payment_issue', reason);
      showToast(`แจ้งสลิปมีปัญหาในออเดอร์ ${orderNo} แล้ว`);
      if (selectedOrderForDetail && selectedOrderForDetail.orderNo === orderNo) {
        setSelectedOrderForDetail(prev => prev ? { ...prev, status: 'payment_issue', statusNote: reason } : null);
      }
    }
  };

  const handleDeleteOrderConfirm = (orderNo) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบคำสั่งซื้อ ${orderNo}? ข้อมูลนี้จะไม่สามารถกู้คืนได้`)) {
      deleteOrder(orderNo);
      if (selectedOrderForDetail?.orderNo === orderNo) {
        setSelectedOrderForDetail(null);
      }
      showToast(`ลบคำสั่งซื้อ ${orderNo} สำเร็จ`);
    }
  };

  // Create Demo Order for testing
  const handleCreateDemoOrder = () => {
    const sampleDesk = productsList.find(p => p.id === 'prod-desk-01') || productsList[0];
    const sampleChair = productsList.find(p => p.id === 'prod-chair-01') || productsList[1];

    const demoPayload = {
      items: [
        {
          id: sampleDesk.id,
          sku: sampleDesk.sku,
          name: sampleDesk.name,
          color: sampleDesk.colors?.[0]?.name || 'Stealth Black',
          size: sampleDesk.sizes?.[0]?.name || '120 x 60 ซม.',
          unitPrice: sampleDesk.price,
          quantity: 2,
          totalPrice: sampleDesk.price * 2,
          image: sampleDesk.image
        },
        {
          id: sampleChair.id,
          sku: sampleChair.sku,
          name: sampleChair.name,
          color: sampleChair.colors?.[0]?.name || 'Carbon Stealth',
          size: 'Standard',
          unitPrice: sampleChair.price,
          quantity: 2,
          totalPrice: sampleChair.price * 2,
          image: sampleChair.image
        }
      ],
      pricing: {
        subtotal: (sampleDesk.price * 2) + (sampleChair.price * 2),
        discount: 0,
        vat: Math.round(((sampleDesk.price * 2) + (sampleChair.price * 2)) * 0.07),
        grandTotal: Math.round(((sampleDesk.price * 2) + (sampleChair.price * 2)) * 1.07),
        amountPaid: Math.round(((sampleDesk.price * 2) + (sampleChair.price * 2)) * 1.07),
        remainingAmount: 0,
        paymentPlan: 'full'
      },
      shipping: {
        receiverName: 'คุณเกรียงไกร ชัยมงคล (Arena Esports Club)',
        phone: '089-456-7890',
        email: 'kriangkrai.arena@example.com',
        address: '88/14 อาคารไอทีพลาซ่า ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240',
        notes: 'ขอส่งช่วงเช้า มีลิฟต์ขนของ รบกวนโทรแจ้งก่อนถึง 30 นาที'
      },
      taxInvoice: {
        companyName: 'บริษัท อารีน่า อีสปอร์ต คลับ จำกัด',
        taxId: '0105556098741',
        branch: 'สำนักงานใหญ่'
      },
      paymentMethod: 'bank_transfer',
      hasSlipUploaded: true,
      slipPreview: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
      slipFileName: 'kbank_transfer_slip_20261003.jpg',
      slipFileType: 'image',
      slipUploadedAt: new Date().toISOString()
    };

    const newOrd = createOrder(demoPayload);
    showToast(`สร้างคำสั่งซื้อตัวอย่าง ${newOrd.orderNo} เรียบร้อยแล้ว`);
  };

  // -------------------------------------------------------------
  // PRODUCTS MANAGEMENT STATES
  // -------------------------------------------------------------
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [isCompressingImage, setIsCompressingImage] = useState(false);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let list = [...productsList];

    if (productCategoryFilter !== 'all') {
      list = list.filter(p => p.category === productCategoryFilter);
    }

    if (productSearchQuery.trim()) {
      const q = productSearchQuery.toLowerCase().trim();
      list = list.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q))
      );
    }

    return list;
  }, [productsList, productCategoryFilter, productSearchQuery]);

  // Product Form State
  const [productForm, setProductForm] = useState({
    sku: '',
    name: '',
    nameEn: '',
    category: 'desks',
    subtitle: '',
    price: 0,
    originalPrice: 0,
    stock: 20,
    badge: '',
    badgeType: 'fire',
    image: '',
    gallery: [],
    features: [],
    dimensions: '',
    weight: '',
    materials: '',
    warranty: 'รับประกัน 3 ปีเต็ม',
    leadTime: 'พร้อมส่งใน 1-3 วันทำการ'
  });

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      sku: prod.sku || '',
      name: prod.name || '',
      nameEn: prod.nameEn || '',
      category: prod.category || 'desks',
      subtitle: prod.subtitle || '',
      price: prod.price || 0,
      originalPrice: prod.originalPrice || 0,
      stock: prod.stock !== undefined ? prod.stock : 20,
      badge: prod.badge || '',
      badgeType: prod.badgeType || 'fire',
      image: prod.image || '',
      gallery: Array.isArray(prod.gallery) ? [...prod.gallery] : [prod.image].filter(Boolean),
      features: Array.isArray(prod.features) ? [...prod.features] : [],
      dimensions: prod.dimensions || '',
      weight: prod.weight || '',
      materials: prod.materials || '',
      warranty: prod.warranty || 'รับประกัน 3 ปีเต็ม',
      leadTime: prod.leadTime || 'พร้อมส่งใน 1-3 วันทำการ'
    });
    setIsNewProductModalOpen(true);
  };

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setProductForm({
      id: `prod-custom-${Date.now()}`,
      sku: `GSP-PROD-${randomSuffix}`,
      name: '',
      nameEn: '',
      category: 'desks',
      subtitle: '',
      price: 2990,
      originalPrice: 3590,
      stock: 30,
      badge: 'NEW 2026',
      badgeType: 'fire',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
      ],
      features: [
        'โครงสร้างเหล็กคาร์บอน แข็งแรงพิเศษ',
        'หน้าท็อปกันน้ำและรอยขีดข่วน 100%'
      ],
      dimensions: '120 x 60 x 75 ซม.',
      weight: '16 กก.',
      materials: 'Steel + HPL Carbon Texture',
      warranty: 'รับประกัน 3 ปีเต็ม',
      leadTime: 'พร้อมส่งใน 1-2 วันทำการ'
    });
    setIsNewProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      alert('กรุณากรอกชื่อสินค้า');
      return;
    }

    if (editingProduct) {
      updateEquipmentProduct(editingProduct.id, {
        ...productForm,
        price: Number(productForm.price) || 0,
        originalPrice: Number(productForm.originalPrice) || 0,
        stock: Number(productForm.stock) || 0
      });
      showToast(`อัปเดตข้อมูลสินค้า "${productForm.name}" เรียบร้อยแล้ว`);
    } else {
      const newProd = {
        ...productForm,
        id: productForm.id || `prod-${Date.now()}`,
        price: Number(productForm.price) || 0,
        originalPrice: Number(productForm.originalPrice) || 0,
        stock: Number(productForm.stock) || 0,
        rating: 5.0,
        reviewsCount: 1
      };
      addEquipmentProduct(newProd);
      showToast(`เพิ่มสินค้าใหม่ "${newProd.name}" เรียบร้อยแล้ว`);
    }

    setIsNewProductModalOpen(false);
  };

  const handleDeleteProductConfirm = (productId, productName) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${productName}" ออกจากระบบ?`)) {
      deleteEquipmentProduct(productId);
      showToast(`ลบสินค้า "${productName}" สำเร็จ`);
    }
  };

  const handleResetProducts = () => {
    if (window.confirm('คุณต้องการรีเซ็ตแคตตาล็อกสินค้าทั้งหมดกลับสู่ค่าเริ่มต้นจากโรงงานใช่หรือไม่? การปรับแต่งทั้งหมดจะถูกแทนที่')) {
      resetEquipmentProducts();
      showToast('รีเซ็ตสินค้ากลับสู่ค่าเริ่มต้นเรียบร้อยแล้ว');
    }
  };

  // Image Upload handler for product form
  const handleProductImageUpload = async (file) => {
    if (!file) return;
    setIsCompressingImage(true);
    try {
      const optimized = await compressAndConvertToWebP(file, { maxWidth: 1200, quality: 0.85 });
      setProductForm(prev => {
        const nextGallery = prev.gallery.includes(prev.image) 
          ? prev.gallery.map(img => img === prev.image ? optimized : img)
          : [optimized, ...prev.gallery];
        return {
          ...prev,
          image: optimized,
          gallery: nextGallery
        };
      });
      showToast('อัปโหลดและบีบอัดภาพ WebP เรียบร้อย');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ');
    } finally {
      setIsCompressingImage(false);
    }
  };

  // Add gallery image
  const handleAddGalleryImage = () => {
    if (!newGalleryInput.trim()) return;
    setProductForm(prev => ({
      ...prev,
      gallery: [...prev.gallery, newGalleryInput.trim()]
    }));
    setNewGalleryInput('');
  };

  // Remove gallery image
  const handleRemoveGalleryImage = (idx) => {
    setProductForm(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="store-cms-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 100001,
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} className="text-green" style={{ color: '#22c55e' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Main Navigation Tabs */}
      <div className="store-cms-topbar">
        <div className="store-cms-nav-tabs">
          <button 
            type="button"
            className={`store-cms-tab-btn ${activeMainTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('orders')}
          >
            <ShoppingBag size={18} />
            <span>จัดการคำสั่งซื้อ & ตรวจสลิป</span>
            {pendingSlipsCount > 0 && (
              <span className="store-tab-counter alert" title={`${pendingSlipsCount} คำสั่งซื้อรอตรวจสอบสลิป`}>
                {pendingSlipsCount}
              </span>
            )}
            <span className="store-tab-counter">
              {savedOrders.length}
            </span>
          </button>

          <button 
            type="button"
            className={`store-cms-tab-btn ${activeMainTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('products')}
          >
            <Package size={18} />
            <span>จัดการสินค้าในร้าน (Equipment Products)</span>
            <span className="store-tab-counter">
              {productsList.length}
            </span>
          </button>
        </div>

        {/* Global Action on the Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeMainTab === 'orders' ? (
            <button 
              type="button"
              className="btn-primary"
              onClick={handleCreateDemoOrder}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <Plus size={15} />
              <span>สร้างคำสั่งซื้อตัวอย่าง (Demo Order)</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button"
                className="btn-secondary"
                onClick={handleResetProducts}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.85rem' }}
                title="คืนค่าสินค้าเริ่มต้น"
              >
                <RotateCw size={14} />
                <span>รีเซ็ตค่าเริ่มต้น</span>
              </button>
              <button 
                type="button"
                className="btn-primary"
                onClick={handleOpenCreateProduct}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <Plus size={15} />
                <span>เพิ่มสินค้าใหม่</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          SECTION 1: ORDERS & PAYMENT SLIP VERIFICATION
          ========================================================= */}
      {activeMainTab === 'orders' && (
        <div>
          {/* Orders Metrics Cards */}
          <div className="store-metrics-grid">
            <div className="store-metric-card">
              <div className="store-metric-icon" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                <ShoppingBag size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">คำสั่งซื้อทั้งหมด</span>
                <span className="store-metric-value">{savedOrders.length} รายการ</span>
              </div>
            </div>

            <div className="store-metric-card" style={{ borderColor: pendingSlipsCount > 0 ? '#fde68a' : '#e2e8f0', background: pendingSlipsCount > 0 ? '#fffbeb' : '#ffffff' }}>
              <div className="store-metric-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
                <Clock size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">รอตรวจสอบสลิปโอนเงิน</span>
                <span className="store-metric-value" style={{ color: pendingSlipsCount > 0 ? '#b45309' : '#0f172a' }}>
                  {pendingSlipsCount} รายการ
                </span>
              </div>
            </div>

            <div className="store-metric-card">
              <div className="store-metric-icon" style={{ background: '#dcfce7', color: '#15803d' }}>
                <CheckCircle2 size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">ชำระแล้ว / อนุมัติแล้ว</span>
                <span className="store-metric-value">
                  {savedOrders.filter(o => o.status === 'payment_verified' || o.status === 'preparing_items').length} รายการ
                </span>
              </div>
            </div>

            <div className="store-metric-card">
              <div className="store-metric-icon" style={{ background: '#ede9fe', color: '#6d28d9' }}>
                <Truck size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">กำลังจัดส่ง / จัดส่งแล้ว</span>
                <span className="store-metric-value">
                  {savedOrders.filter(o => o.status === 'shipping' || o.status === 'delivered').length} รายการ
                </span>
              </div>
            </div>

            <div className="store-metric-card">
              <div className="store-metric-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                <DollarSign size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">ยอดสั่งซื้อรวม</span>
                <span className="store-metric-value" style={{ color: '#059669', fontSize: '1.25rem' }}>
                  ฿{savedOrders.reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="store-filter-bar">
            <div className="store-filter-row-top">
              <div className="store-filter-pills">
                {[
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'verifying_payment', label: '⏳ รอตรวจสลิป' },
                  { id: 'payment_verified', label: '🟢 ชำระแล้ว' },
                  { id: 'preparing_items', label: '📦 กำลังเตรียมของ' },
                  { id: 'shipping', label: '🚚 กำลังจัดส่ง' },
                  { id: 'delivered', label: '✅ จัดส่งสำเร็จ' },
                  { id: 'payment_issue', label: '❌ สลิปมีปัญหา' },
                  { id: 'order_received', label: '🕒 รอชำระ' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className={`store-filter-pill ${orderFilterStatus === p.id ? 'active' : ''}`}
                    onClick={() => setOrderFilterStatus(p.id)}
                  >
                    <span>{p.label}</span>
                    {p.id === 'verifying_payment' && pendingSlipsCount > 0 && (
                      <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '10px' }}>
                        {pendingSlipsCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="store-search-box">
                <Search size={16} className="store-search-icon" />
                <input 
                  type="text" 
                  placeholder="ค้นหาเลขที่ออเดอร์, ชื่อผู้รับ, เบอร์โทร..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="store-orders-table-card">
            {filteredOrders.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
                <ShoppingBag size={48} style={{ opacity: 0.3, margin: '0 auto 14px' }} />
                <h4 style={{ margin: '0 0 6px', color: '#0f172a' }}>ยังไม่พบรายการคำสั่งซื้อ</h4>
                <p style={{ margin: '0 0 16px', fontSize: '0.9rem' }}>
                  {savedOrders.length === 0 
                    ? 'ยังไม่มีคำสั่งซื้อเข้ามาในระบบ คุณสามารถคลิกปุ่มด้านบนเพื่อสร้างคำสั่งซื้อตัวอย่างสำหรับทดสอบ' 
                    : 'ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา/ฟิลเตอร์'}
                </p>
                {savedOrders.length === 0 && (
                  <button 
                    type="button" 
                    className="btn-primary" 
                    onClick={handleCreateDemoOrder}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={16} />
                    <span>สร้างคำสั่งซื้อตัวอย่างทดสอบระบบ</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="store-table-container">
                <table className="store-data-table">
                  <thead>
                    <tr>
                      <th>เลขที่คำสั่งซื้อ & วันที่</th>
                      <th>ข้อมูลลูกค้า / ที่อยู่</th>
                      <th>รายการสินค้า</th>
                      <th>ยอดชำระสุทธิ</th>
                      <th>หลักฐานสลิป</th>
                      <th>สถานะ</th>
                      <th style={{ textAlign: 'right' }}>การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const statusCfg = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.order_received;
                      const StatusIcon = statusCfg.icon;
                      const dateDisplay = order.createdAt 
                        ? new Date(order.createdAt).toLocaleDateString('th-TH', { 
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          }) 
                        : '-';

                      return (
                        <tr key={order.orderNo}>
                          {/* Order No & Date */}
                          <td>
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForDetail(order)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontWeight: 800,
                                color: '#1d4ed8',
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                textDecoration: 'underline'
                              }}
                              title="คลิกเพื่อเปิดหน้าต่างแก้ไขออเดอร์ (WooCommerce Style)"
                            >
                              {order.orderNo}
                            </button>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>
                              {dateDisplay}
                            </div>
                            {order.fromQuotationNo && (
                              <div style={{ fontSize: '0.7rem', color: '#0284c7', marginTop: '2px' }}>
                                Ref: {order.fromQuotationNo}
                              </div>
                            )}
                          </td>

                          {/* Customer & Shipping */}
                          <td>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>
                              {order.shipping?.receiverName || 'ไม่ระบุชื่อ'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                              <a href={`tel:${order.shipping?.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                                📞 {order.shipping?.phone || '-'}
                              </a>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={order.shipping?.address}>
                              📍 {order.shipping?.address || '-'}
                            </div>
                            {order.taxInvoice && (
                              <span style={{ display: 'inline-block', marginTop: '3px', fontSize: '0.68rem', padding: '1px 6px', background: '#f1f5f9', color: '#0f172a', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                🏢 ขอใบกำกับภาษี
                              </span>
                            )}
                          </td>

                          {/* Items Preview */}
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {(order.items || []).slice(0, 2).map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                                  {item.image && (
                                    <img src={item.image} alt="" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                                  )}
                                  <span style={{ fontWeight: 600, color: '#1e293b' }}>
                                    {item.name}
                                  </span>
                                  <span style={{ color: '#64748b' }}>
                                    x{item.quantity}
                                  </span>
                                </div>
                              ))}
                              {(order.items || []).length > 2 && (
                                <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}>
                                  + อีก {order.items.length - 2} รายการ
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Grand Total */}
                          <td>
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                              ฿{(order.pricing?.grandTotal || 0).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
                              ชำระเต็ม 100%
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              {order.paymentMethod === 'bank_transfer' ? 'โอนเงินบัญชี กสิกร' : order.paymentMethod === 'promptpay' ? 'QR พร้อมเพย์' : 'บัตรเครดิต'}
                            </div>
                          </td>

                          {/* Slip Preview Column */}
                          <td>
                            {order.hasSlipUploaded && order.slipPreview ? (
                              <div className="slip-cell-preview">
                                {order.slipFileType === 'pdf' ? (
                                  <a 
                                    href={order.slipPreview} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="slip-pdf-btn"
                                    title="เปิดดูไฟล์สลิป PDF"
                                  >
                                    <FileText size={14} />
                                    <span>เปิดไฟล์ PDF</span>
                                  </a>
                                ) : (
                                  <img 
                                    src={order.slipPreview} 
                                    alt="Payment Slip" 
                                    className="slip-mini-thumb" 
                                    title="คลิกเพื่อขยายดูสลิปขนาดใหญ่"
                                    onClick={() => setActiveSlipZoomUrl(order.slipPreview)}
                                  />
                                )}
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => setActiveSlipZoomUrl(order.slipPreview)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#2563eb',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      padding: 0,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px'
                                    }}
                                  >
                                    <Eye size={12} />
                                    <span>ตรวจสลิป</span>
                                  </button>
                                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                                    แนบแล้ว
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="no-slip-tag">ยังไม่ได้แนบสลิป</span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td>
                            <span 
                              className={`order-status-badge status-${order.status}`}
                              style={{ background: statusCfg.bg, color: statusCfg.color }}
                            >
                              <StatusIcon size={13} />
                              <span>{statusCfg.label}</span>
                            </span>
                            {order.trackingNumber && (
                              <div style={{ fontSize: '0.72rem', color: '#6d28d9', marginTop: '4px', fontWeight: 600 }}>
                                🚚 {order.shippingCarrier || 'ขนส่ง'}: {order.trackingNumber}
                              </div>
                            )}
                          </td>

                          {/* Quick Actions */}
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              {/* If waiting for verification -> quick approve */}
                              {order.status === 'verifying_payment' && (
                                <>
                                  <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={() => handleApproveSlip(order.orderNo)}
                                    title="อนุมัติยอดโอนเงิน"
                                    style={{ padding: '6px 10px', fontSize: '0.78rem', background: '#16a34a', borderColor: '#16a34a' }}
                                  >
                                    <Check size={13} />
                                    <span>อนุมัติสลิป</span>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => handleFlagSlipIssue(order.orderNo)}
                                    title="แจ้งสลิปมีปัญหา"
                                    style={{ padding: '6px 8px', fontSize: '0.78rem', color: '#dc2626' }}
                                  >
                                    <AlertTriangle size={13} />
                                  </button>
                                </>
                              )}

                              {/* If verified -> advance to preparing */}
                              {order.status === 'payment_verified' && (
                                <button
                                  type="button"
                                  className="btn-primary"
                                  onClick={() => handlePrepareItems(order.orderNo)}
                                  style={{ padding: '6px 10px', fontSize: '0.78rem', background: '#0284c7', borderColor: '#0284c7' }}
                                >
                                  <Package size={13} />
                                  <span>เตรียมของ</span>
                                </button>
                              )}

                              {/* If preparing -> advance to shipping */}
                              {order.status === 'preparing_items' && (
                                <button
                                  type="button"
                                  className="btn-primary"
                                  onClick={() => handleOpenShipModal(order)}
                                  style={{ padding: '6px 10px', fontSize: '0.78rem', background: '#7c3aed', borderColor: '#7c3aed' }}
                                >
                                  <Truck size={13} />
                                  <span>ส่งของแล้ว</span>
                                </button>
                              )}

                              {/* If shipping -> mark delivered */}
                              {order.status === 'shipping' && (
                                <button
                                  type="button"
                                  className="btn-primary"
                                  onClick={() => handleMarkDelivered(order.orderNo)}
                                  style={{ padding: '6px 10px', fontSize: '0.78rem', background: '#0f766e', borderColor: '#0f766e' }}
                                >
                                  <CheckCircle2 size={13} />
                                  <span>ส่งสำเร็จ</span>
                                </button>
                              )}

                              {/* Edit Order (WooCommerce Style) */}
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setSelectedOrderForDetail(order)}
                                title="จัดการและแก้ไขคำสั่งซื้อแบบ WooCommerce"
                                style={{ padding: '6px 10px', fontSize: '0.78rem', background: '#f8fafc', borderColor: '#cbd5e1', color: '#1e293b' }}
                              >
                                <Edit3 size={13} style={{ color: '#2563eb' }} />
                                <span>แก้ไขออเดอร์</span>
                              </button>

                              {/* Delete Order Button */}
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => handleDeleteOrderConfirm(order.orderNo)}
                                title="ลบคำสั่งซื้อ"
                                style={{ padding: '6px 8px', fontSize: '0.78rem', color: '#ef4444' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 2: EQUIPMENT PRODUCTS MANAGEMENT
          ========================================================= */}
      {activeMainTab === 'products' && (
        <div>
          {/* Product Metrics Cards */}
          <div className="store-metrics-grid">
            <div className="store-metric-card">
              <div className="store-metric-icon" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                <Package size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">สินค้าทั้งหมดในร้าน</span>
                <span className="store-metric-value">{productsList.length} รายการ</span>
              </div>
            </div>

            <div className="store-metric-card">
              <div className="store-metric-icon" style={{ background: '#f8fafc', color: '#0f172a' }}>
                <Sliders size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">โต๊ะเกมมิ่ง & ปรับระดับ</span>
                <span className="store-metric-value">
                  {productsList.filter(p => p.category === 'desks').length} รายการ
                </span>
              </div>
            </div>

            <div className="store-metric-card">
              <div className="store-metric-icon" style={{ background: '#fdf2f8', color: '#be185d' }}>
                <Flame size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">เก้าอี้ Ergonomic</span>
                <span className="store-metric-value">
                  {productsList.filter(p => p.category === 'chairs').length} รายการ
                </span>
              </div>
            </div>

            <div className="store-metric-card">
              <div className="store-metric-icon" style={{ background: '#fff7ed', color: '#c2410c' }}>
                <Tag size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">อุปกรณ์เสริม & รางไฟ</span>
                <span className="store-metric-value">
                  {productsList.filter(p => p.category === 'accessories').length} รายการ
                </span>
              </div>
            </div>
          </div>

          {/* Product Filters & Search */}
          <div className="store-filter-bar">
            <div className="store-filter-row-top">
              <div className="store-filter-pills">
                {PRODUCT_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`store-filter-pill ${productCategoryFilter === cat.id ? 'active' : ''}`}
                    onClick={() => setProductCategoryFilter(cat.id)}
                  >
                    <span>{cat.name}</span>
                    <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>
                      ({cat.id === 'all' ? productsList.length : productsList.filter(p => p.category === cat.id).length})
                    </span>
                  </button>
                ))}
              </div>

              <div className="store-search-box">
                <Search size={16} className="store-search-icon" />
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อสินค้า, SKU, สเปก..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-cms-grid">
            {filteredProducts.map(prod => {
              const discount = prod.originalPrice && prod.originalPrice > prod.price
                ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                : 0;

              return (
                <div key={prod.id} className="product-cms-card">
                  <div className="product-cms-card-top">
                    <img src={prod.image} alt={prod.name} className="product-cms-card-img" />
                    {prod.badge && (
                      <span className="product-cms-badge">{prod.badge}</span>
                    )}
                    <span className={`product-cms-stock-tag ${prod.stock < 10 ? 'low' : ''}`}>
                      คงเหลือ {prod.stock || 0} ชิ้น
                    </span>
                  </div>

                  <div className="product-cms-card-body">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="product-cms-sku">{prod.sku}</span>
                      <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700 }}>
                        {prod.category === 'desks' ? 'โต๊ะเกมมิ่ง' : prod.category === 'chairs' ? 'เก้าอี้' : 'อุปกรณ์เสริม'}
                      </span>
                    </div>

                    <h4 className="product-cms-name">{prod.name}</h4>
                    <p className="product-cms-subtitle">{prod.subtitle}</p>

                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
                      📸 รูปสไลด์: <strong>{Array.isArray(prod.gallery) ? prod.gallery.length : 1} รูป</strong>
                    </div>

                    <div className="product-cms-pricing">
                      <span className="product-cms-current-price">
                        ฿{(prod.price || 0).toLocaleString()}
                      </span>
                      {prod.originalPrice > prod.price && (
                        <>
                          <span className="product-cms-original-price">
                            ฿{prod.originalPrice.toLocaleString()}
                          </span>
                          <span style={{ color: '#ea580c', fontSize: '0.75rem', fontWeight: 800 }}>
                            -{discount}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="product-cms-card-actions">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => handleOpenEditProduct(prod)}
                      style={{ flex: 1, padding: '7px 12px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Edit3 size={14} />
                      <span>แก้ไขสินค้า & ภาพ</span>
                    </button>

                    <a
                      href={`/products/${prod.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      title="ดูหน้าร้านจริง"
                      style={{ padding: '7px 10px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', color: '#0f172a', textDecoration: 'none' }}
                    >
                      <ExternalLink size={14} />
                    </a>

                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleDeleteProductConfirm(prod.id, prod.name)}
                      title="ลบสินค้านี้"
                      style={{ padding: '7px 10px', fontSize: '0.82rem', color: '#ef4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          WOOCOMMERCE ORDER EDITOR MODAL
          ========================================================= */}
      {selectedOrderForDetail && (
        <WooCommerceOrderEditor 
          order={selectedOrderForDetail}
          onClose={() => setSelectedOrderForDetail(null)}
          onSaveOrder={(orderNo, updatedFields) => {
            if (typeof updateOrder === 'function') {
              updateOrder(orderNo, updatedFields);
            } else {
              setSavedOrders(prev => prev.map(o => o.orderNo === orderNo ? { ...o, ...updatedFields } : o));
            }
            setSelectedOrderForDetail(prev => prev ? { ...prev, ...updatedFields } : null);
          }}
          onApproveSlip={handleApproveSlip}
          onFlagSlipIssue={handleFlagSlipIssue}
          onDeleteOrder={handleDeleteOrderConfirm}
          productsList={productsList}
          siteData={siteData}
          showToast={showToast}
        />
      )}

      {/* =========================================================
          MODAL: SHIPPING DISPATCH INPUT
          ========================================================= */}
      {isShippingPromptOpen && orderToShip && (
        <div className="store-modal-backdrop" onClick={() => setIsShippingPromptOpen(false)}>
          <div className="store-modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="store-modal-header">
              <h3>
                <Truck size={20} className="text-blue" />
                <span>ระบุข้อมูลการจัดส่งพัสดุ</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsShippingPromptOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="store-modal-body">
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  บริษัทขนส่งพัสดุ:
                </label>
                <select
                  value={shippingCarrierInput}
                  onChange={(e) => setShippingCarrierInput(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                >
                  <option value="Kerry Express">Kerry Express (จัดส่งด่วน)</option>
                  <option value="Flash Express">Flash Express</option>
                  <option value="SCG Express">SCG Express (ขนส่งพัสดุชิ้นใหญ่/โต๊ะ)</option>
                  <option value="J&T Express">J&T Express</option>
                  <option value="GLP Fleet">ทีมช่าง GLP จัดส่งและประกอบหน้างาน</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  เลขพัสดุ Tracking Number:
                </label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="เช่น KEX98765432TH หรือ FL88776655"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748b', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                💡 เมื่อบันทึกแล้ว สถานะจะถูกเปลี่ยนเป็น "กำลังจัดส่งพัสดุ" และลูกค้าสามารถนำเลข Tracking ไปตรวจเช็กในหน้าระบบได้ทันที
              </div>
            </div>

            <div className="store-modal-footer">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setIsShippingPromptOpen(false)}
              >
                ยกเลิก
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleConfirmShipment}
              >
                บันทึกการจัดส่ง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: PRODUCT EDIT & CREATE FORM
          ========================================================= */}
      {isNewProductModalOpen && (
        <div className="store-modal-backdrop" onClick={() => setIsNewProductModalOpen(false)}>
          <div className="store-modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="store-modal-header">
              <h3>
                <Package size={20} className="text-blue" />
                <span>{editingProduct ? `แก้ไขสินค้า: ${editingProduct.name}` : 'เพิ่มสินค้าใหม่ในแคตตาล็อก'}</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsNewProductModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="store-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                {/* 1. Basic Info */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      รหัสสินค้า (SKU) *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={productForm.sku}
                      onChange={e => setProductForm({ ...productForm, sku: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      หมวดหมู่สินค้า *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="desks">โต๊ะเกมมิ่ง & โต๊ะทำงาน (Desks)</option>
                      <option value="chairs">เก้าอี้เกมมิ่ง & Ergonomic (Chairs)</option>
                      <option value="accessories">อุปกรณ์เสริม & รางสายไฟ (Accessories)</option>
                      <option value="bundles">เซ็ตสุดคุ้ม (Bundle)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    ชื่อสินค้า (ภาษาไทย) *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="เช่น Gspeed Pro Battle Desk (120x60 cm)"
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    คำบรรยายสั้น / จุดเด่น (Subtitle)
                  </label>
                  <input 
                    type="text" 
                    placeholder="เช่น โต๊ะเกมมิ่งโครงเหล็กคาร์บอน Z-Frame ลายเคฟลาร์ พร้อมรางจัดสายไฟ"
                    value={productForm.subtitle}
                    onChange={e => setProductForm({ ...productForm, subtitle: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                {/* 2. Pricing & Stock */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      ราคาขายจริง (฿) *
                    </label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={productForm.price}
                      onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      ราคาปกติ / ป้าย (฿)
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={productForm.originalPrice}
                      onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      จำนวนสต็อกคงเหลือ
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      value={productForm.stock}
                      onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      ป้าย Badge ไฮไลต์
                    </label>
                    <input 
                      type="text" 
                      placeholder="เช่น ขายดีอันดับ 1, NEW 2026"
                      value={productForm.badge}
                      onChange={e => setProductForm({ ...productForm, badge: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                {/* 3. Main Product Image & Gallery */}
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>
                    รูปภาพหน้าปกหลัก (Main Product Image)
                  </label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                    <img 
                      src={productForm.image} 
                      alt="" 
                      style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'contain', background: '#fff', border: '1px solid #cbd5e1' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <input 
                        type="text"
                        placeholder="URL รูปภาพหน้าปก"
                        value={productForm.image}
                        onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>
                    <label className="btn-secondary" style={{ cursor: 'pointer', margin: 0, padding: '8px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      <span>{isCompressingImage ? 'กำลังประมวลผล...' : 'อัปโหลดภาพ WebP'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={e => {
                          if (e.target.files?.[0]) handleProductImageUpload(e.target.files[0]);
                          e.target.value = '';
                        }} 
                      />
                    </label>
                  </div>

                  {/* Auto-Slide Gallery Images List */}
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                        🎞️ รูปสไลเดอร์สินค้า (Auto-Slide Gallery): {productForm.gallery.length} รูป
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {productForm.gallery.map((imgUrl, i) => (
                        <div key={i} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #cbd5e1', background: '#fff' }}>
                          <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(i)}
                            style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}
                            title="ลบภาพนี้ออกจากสไลเดอร์"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        placeholder="เพิ่ม URL รูปภาพสำหรับออโต้สไลด์..."
                        value={newGalleryInput}
                        onChange={e => setNewGalleryInput(e.target.value)}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={handleAddGalleryImage}
                        style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                      >
                        + เพิ่มรูปสไลด์
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Specs & Guarantee */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      ขนาดสินค้า (Dimensions)
                    </label>
                    <input 
                      type="text"
                      value={productForm.dimensions}
                      onChange={e => setProductForm({ ...productForm, dimensions: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      วัสดุโครงสร้าง (Materials)
                    </label>
                    <input 
                      type="text"
                      value={productForm.materials}
                      onChange={e => setProductForm({ ...productForm, materials: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      การรับประกัน (Warranty)
                    </label>
                    <input 
                      type="text"
                      value={productForm.warranty}
                      onChange={e => setProductForm({ ...productForm, warranty: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      ระยะเวลาจัดส่ง (Lead Time)
                    </label>
                    <input 
                      type="text"
                      value={productForm.leadTime}
                      onChange={e => setProductForm({ ...productForm, leadTime: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>

              <div className="store-modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setIsNewProductModalOpen(false)}
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                >
                  {editingProduct ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มสินค้า'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          LIGHTBOX: SLIP FULL RESOLUTION ZOOM
          ========================================================= */}
      {activeSlipZoomUrl && (
        <div className="slip-lightbox-backdrop" onClick={() => setActiveSlipZoomUrl(null)}>
          <div className="slip-lightbox-content" onClick={e => e.stopPropagation()}>
            <button 
              type="button" 
              className="slip-lightbox-close" 
              onClick={() => setActiveSlipZoomUrl(null)}
            >
              <X size={20} />
            </button>
            <img 
              src={activeSlipZoomUrl} 
              alt="Zoomed Payment Slip" 
              className="slip-lightbox-img" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
