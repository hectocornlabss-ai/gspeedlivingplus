import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingBag, Package, CheckCircle2, Clock, Truck, 
  AlertTriangle, AlertCircle, Eye, Search, Plus, Trash2, 
  Edit3, RotateCw, ExternalLink, Download, FileText, Check, 
  X, Filter, ChevronRight, ArrowUpDown, DollarSign, Tag,
  Phone, Mail, MapPin, Printer, ShieldCheck, Flame, Image as ImageIcon,
  Sliders, Info, Maximize2, ZoomIn, ZoomOut, BarChart2, TrendingUp,
  Volume2, VolumeX, Layers, Copy, Settings, CheckSquare, PackagePlus,
  RefreshCcw, Building2, QrCode, Sparkles, Send, Shield
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSiteData } from '../context/SiteDataContext';
import { EQUIPMENT_PRODUCTS, PRODUCT_CATEGORIES } from '../data/equipmentProducts';
import { compressAndConvertToWebP } from '../utils/imageOptimizer';
import { dispatchOrderStatusEmail, buildOrderStatusEmailTemplate } from '../utils/orderEmailService';
import { 
  exportOrdersToCSV, 
  playAlertChime, 
  calculateStockMetrics, 
  calculateSalesAnalytics 
} from '../utils/ecommerceAdminUtils';
import WooCommerceOrderEditor from './WooCommerceOrderEditor';
import ShippingLabelModal from './ShippingLabelModal';
import ReceiptTaxInvoiceModal from './ReceiptTaxInvoiceModal';
import './StoreOrdersAndProductsCMS.css';

// Status labels & badges mapping (Exported for WooCommerceOrderEditor)
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

  // Active Main Tab: 'dashboard' | 'orders' | 'products' | 'stock-alerts' | 'settings'
  const [activeMainTab, setActiveMainTab] = useState('dashboard');

  // Low stock threshold state
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [isAudioAlertEnabled, setIsAudioAlertEnabled] = useState(true);

  // Print Modals State
  const [selectedOrderForShippingLabel, setSelectedOrderForShippingLabel] = useState(null);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState(null);

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
  const [previewEmailOrder, setPreviewEmailOrder] = useState(null);
  const [previewEmailType, setPreviewEmailType] = useState('shipping');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // STOCK & SALES METRICS
  // -------------------------------------------------------------
  const stockMetrics = useMemo(() => {
    return calculateStockMetrics(productsList, lowStockThreshold);
  }, [productsList, lowStockThreshold]);

  const salesAnalytics = useMemo(() => {
    return calculateSalesAnalytics(savedOrders, productsList);
  }, [savedOrders, productsList]);

  // Pending slips count
  const pendingSlipsCount = useMemo(() => {
    return savedOrders.filter(o => o.status === 'verifying_payment' || (o.hasSlipUploaded && o.status !== 'payment_verified' && o.status !== 'delivered' && o.status !== 'shipping' && o.status !== 'preparing_items')).length;
  }, [savedOrders]);

  // Play audio chime if critical alerts exist on tab change
  useEffect(() => {
    if (isAudioAlertEnabled && (pendingSlipsCount > 0 || stockMetrics.outOfStockCount > 0)) {
      // Gentle chime on load if pending items
      const timer = setTimeout(() => {
        playAlertChime();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAudioAlertEnabled, pendingSlipsCount, stockMetrics.outOfStockCount]);

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
  const handleApproveSlip = async (orderNo) => {
    const targetOrder = savedOrders.find(o => o.orderNo === orderNo);
    await updateOrderStatus(orderNo, 'payment_verified', 'ตรวจสอบยอดเงินและสลิปโอนเงินถูกต้องเรียบร้อยแล้ว');
    showToast(`อนุมัติสลิปคำสั่งซื้อ ${orderNo} สำเร็จ 🟢`);
    if (targetOrder) {
      dispatchOrderStatusEmail({ ...targetOrder, status: 'payment_verified' }, 'payment_verified').catch(err => {
        console.warn('Approve slip email error:', err);
      });
    }
    if (selectedOrderForDetail && selectedOrderForDetail.orderNo === orderNo) {
      setSelectedOrderForDetail(prev => prev ? { ...prev, status: 'payment_verified', statusNote: 'ตรวจสอบยอดเงินและสลิปโอนเงินถูกต้องเรียบร้อยแล้ว' } : null);
    }
  };

  const handlePrepareItems = async (orderNo) => {
    const targetOrder = savedOrders.find(o => o.orderNo === orderNo);
    await updateOrderStatus(orderNo, 'preparing_items', 'คลังสินค้ากำลังจัดเตรียมอุปกรณ์และตรวจสอบความเรียบร้อย');
    showToast(`อัปเดตสถานะคำสั่งซื้อ ${orderNo} เป็น "กำลังเตรียมพัสดุ" 📦`);
    if (targetOrder) {
      dispatchOrderStatusEmail({ ...targetOrder, status: 'preparing_items' }, 'preparing_items').catch(err => {
        console.warn('Prepare items email error:', err);
      });
    }
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

  const handleConfirmShipment = async () => {
    if (!orderToShip) return;
    const note = `พัสดุถูกส่งมอบให้ ${shippingCarrierInput} แล้ว เลขพัสดุ: ${trackingNumberInput}`;
    await updateOrderStatus(
      orderToShip.orderNo, 
      'shipping', 
      note,
      { shippingCarrier: shippingCarrierInput, trackingNumber: trackingNumberInput }
    );

    // Automated Shipping Status Email Dispatch
    try {
      await dispatchOrderStatusEmail(orderToShip, 'shipping', {
        carrier: shippingCarrierInput,
        trackingNo: trackingNumberInput
      });
    } catch (err) {
      console.warn('Shipping email dispatch error:', err);
    }

    const emailRecipient = orderToShip.customerEmail || orderToShip.shipping?.email;
    if (emailRecipient) {
      showToast(`บันทึกการจัดส่งและส่งอีเมลแจ้งเลขพัสดุ ${trackingNumberInput} ไปยัง ${emailRecipient} เรียบร้อยแล้ว 📧`);
    } else {
      showToast(`บันทึกการจัดส่ง ${orderToShip.orderNo} สำเร็จ 🚚`);
    }

    setIsShippingPromptOpen(false);
    if (selectedOrderForDetail && selectedOrderForDetail.orderNo === orderToShip.orderNo) {
      setSelectedOrderForDetail(prev => prev ? {
        ...prev, 
        status: 'shipping', 
        shippingCarrier: shippingCarrierInput, 
        trackingNumber: trackingNumberInput,
        statusNote: note
      } : null);
    }
    setOrderToShip(null);
  };

  const handleMarkDelivered = async (orderNo) => {
    const targetOrder = savedOrders.find(o => o.orderNo === orderNo);
    await updateOrderStatus(orderNo, 'delivered', 'พัสดุได้รับการจัดส่งและส่งมอบถึงผู้รับเรียบร้อยแล้ว');
    showToast(`คำสั่งซื้อ ${orderNo} จัดส่งสำเร็จ 🎉`);
    if (targetOrder) {
      dispatchOrderStatusEmail({ ...targetOrder, status: 'delivered' }, 'delivered').catch(err => {
        console.warn('Delivered email error:', err);
      });
    }
    if (selectedOrderForDetail && selectedOrderForDetail.orderNo === orderNo) {
      setSelectedOrderForDetail(prev => prev ? { ...prev, status: 'delivered', statusNote: 'พัสดุได้รับการจัดส่งและส่งมอบถึงผู้รับเรียบร้อยแล้ว' } : null);
    }
  };

  const handleFlagSlipIssue = async (orderNo) => {
    const reason = prompt('กรุณาระบุปัญหาของสลิป (เช่น "ยอดเงินไม่ตรง", "ภาพสลิปไม่ชัดเจน", "สลิปซ้ำ"):', 'ยอดเงินไม่ตรงกับยอดคำสั่งซื้อ กรุณาตรวจสอบและแนบใหม่อีกครั้ง');
    if (reason !== null) {
      const targetOrder = savedOrders.find(o => o.orderNo === orderNo);
      await updateOrderStatus(orderNo, 'payment_issue', reason);
      showToast(`แจ้งสลิปมีปัญหาในออเดอร์ ${orderNo} แล้ว`);
      if (targetOrder) {
        dispatchOrderStatusEmail({ ...targetOrder, status: 'payment_issue', statusNote: reason }, 'payment_issue', { issueNote: reason }).catch(err => {
          console.warn('Slip issue email error:', err);
        });
      }
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
  // PRODUCTS MANAGEMENT STATES & QUICK STOCK EDIT
  // -------------------------------------------------------------
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all'); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [selectedProductIdsForBatch, setSelectedProductIdsForBatch] = useState([]);

  // Quick Inline Stock Change
  const handleInlineStockChange = (productId, deltaOrAbsolute, isAbsolute = false) => {
    const prod = productsList.find(p => p.id === productId);
    if (!prod) return;
    const currentStock = Number(prod.stock !== undefined ? prod.stock : 20);
    const newStock = isAbsolute 
      ? Math.max(0, Number(deltaOrAbsolute) || 0)
      : Math.max(0, currentStock + deltaOrAbsolute);

    updateEquipmentProduct(productId, { stock: newStock });
    showToast(`อัปเดตสต็อก "${prod.name}" เป็น ${newStock} ชิ้น`);
  };

  // Quick Restock Button (+10, +20)
  const handleQuickRestock = (productId, addAmount = 10) => {
    handleInlineStockChange(productId, addAmount, false);
  };

  // Duplicate Product
  const handleDuplicateProduct = (prod) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const duplicated = {
      ...prod,
      id: `prod-${Date.now()}`,
      sku: `${prod.sku || 'GSP'}-COPY-${randomSuffix}`,
      name: `${prod.name} (Copy)`,
      stock: 20,
      badge: 'NEW 2026'
    };
    addEquipmentProduct(duplicated);
    showToast(`คัดลอกสินค้า "${duplicated.name}" สำเร็จ`);
  };

  // Toggle Product Visibility
  const handleToggleProductVisibility = (productId, currentVisible) => {
    const nextVal = currentVisible === false ? true : false;
    updateEquipmentProduct(productId, { isVisible: nextVal });
    showToast(`ปรับสถานะการแสดงผลสินค้าในร้านเป็น: ${nextVal ? 'แสดง (เปิดขาย)' : 'ซ่อนชั่วคราว'}`);
  };

  // Batch Restock Selected Products
  const handleBatchRestock = (amount) => {
    if (selectedProductIdsForBatch.length === 0) {
      alert('กรุณาติ๊กเลือกสินค้าที่ต้องการเติมสต็อก');
      return;
    }
    selectedProductIdsForBatch.forEach(id => {
      handleInlineStockChange(id, amount, false);
    });
    showToast(`เติมสต็อก +${amount} ชิ้น ให้สินค้าที่เลือก ${selectedProductIdsForBatch.length} รายการ เรียบร้อยแล้ว`);
    setSelectedProductIdsForBatch([]);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let list = [...productsList];

    if (productCategoryFilter !== 'all') {
      list = list.filter(p => p.category === productCategoryFilter);
    }

    if (productStockFilter === 'out_of_stock') {
      list = list.filter(p => Number(p.stock !== undefined ? p.stock : 20) <= 0);
    } else if (productStockFilter === 'low_stock') {
      list = list.filter(p => {
        const s = Number(p.stock !== undefined ? p.stock : 20);
        return s > 0 && s <= lowStockThreshold;
      });
    } else if (productStockFilter === 'in_stock') {
      list = list.filter(p => Number(p.stock !== undefined ? p.stock : 20) > lowStockThreshold);
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
  }, [productsList, productCategoryFilter, productStockFilter, productSearchQuery, lowStockThreshold]);

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
    leadTime: 'พร้อมส่งใน 1-3 วันทำการ',
    isVisible: true
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
      leadTime: prod.leadTime || 'พร้อมส่งใน 1-3 วันทำการ',
      isVisible: prod.isVisible !== false
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
      leadTime: 'พร้อมส่งใน 1-2 วันทำการ',
      isVisible: true
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
    try {
      setIsCompressingImage(true);
      const webpResult = await compressAndConvertToWebP(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.84 });
      let finalUrl = webpResult.dataUrl;

      // Attempt server disk upload to persist as /uploads/products/...
      try {
        const uploadRes = await fetch('/api/upload-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dataUrl: webpResult.dataUrl,
            filename: file.name,
            category: 'products'
          })
        });
        const uploadData = await uploadRes.json();
        if (uploadData?.success && uploadData.url) {
          finalUrl = uploadData.url;
        }
      } catch (uploadErr) {
        console.warn('Server disk upload failed, falling back to WebP dataUrl:', uploadErr);
      }

      setProductForm(prev => ({
        ...prev,
        image: finalUrl,
        gallery: prev.gallery.length === 0 ? [finalUrl] : prev.gallery
      }));
      showToast('อัปโหลดและประมวลผลรูปภาพสินค้า WebP สำเร็จ');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการประมวลผลรูปภาพ: ' + (err.message || ''));
    } finally {
      setIsCompressingImage(false);
    }
  };

  // Multi-image upload for Product Auto-Slide Gallery
  const handleProductGalleryUpload = async (files) => {
    if (!files || files.length === 0) return;
    try {
      setIsCompressingImage(true);
      const addedUrls = [];
      for (const file of Array.from(files)) {
        try {
          const webpResult = await compressAndConvertToWebP(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.84 });
          let finalUrl = webpResult.dataUrl;
          try {
            const uploadRes = await fetch('/api/upload-media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                dataUrl: webpResult.dataUrl,
                filename: file.name,
                category: 'products'
              })
            });
            const uploadData = await uploadRes.json();
            if (uploadData?.success && uploadData.url) {
              finalUrl = uploadData.url;
            }
          } catch (uploadErr) {}
          addedUrls.push(finalUrl);
        } catch (itemErr) {
          console.error('Failed to compress gallery image:', itemErr);
        }
      }
      if (addedUrls.length > 0) {
        setProductForm(prev => ({
          ...prev,
          gallery: [...prev.gallery, ...addedUrls]
        }));
        showToast(`เพิ่มรูปภาพสไลเดอร์สินค้า ${addedUrls.length} รูปเรียบร้อย`);
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพสไลเดอร์');
    } finally {
      setIsCompressingImage(false);
    }
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryInput.trim()) return;
    setProductForm(prev => ({
      ...prev,
      gallery: [...prev.gallery, newGalleryInput.trim()]
    }));
    setNewGalleryInput('');
  };

  const handleRemoveGalleryImage = (idx) => {
    setProductForm(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== idx)
    }));
  };

  // -------------------------------------------------------------
  // STORE SETTINGS STATE
  // -------------------------------------------------------------
  const [storeSettingsForm, setStoreSettingsForm] = useState(() => {
    const saved = siteData?.ecommerceConfig || {};
    return {
      bankName: saved.bankName || 'ธนาคารกสิกรไทย (KBANK)',
      accountNo: saved.accountNo || '012-3-45678-9',
      accountName: saved.accountName || 'บจก. จี สปีด ลิฟวิ่ง พลัส',
      branch: saved.branch || 'สาขา เดอะมอลล์ บางกะปิ',
      promptPayId: saved.promptPayId || '0105556098741',
      promptPayQrUrl: saved.promptPayQrUrl || '',
      companyName: saved.companyName || 'บริษัท จี สปีด ลิฟวิ่ง พลัส จำกัด',
      taxId: saved.taxId || '0105556098741',
      companyAddress: saved.companyAddress || '88/14 อาคารไอทีพลาซ่า ถนนรามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240',
      contactPhone: saved.contactPhone || '089-456-7890',
      contactEmail: saved.contactEmail || 'support@gspeedlivingplus.com',
      freeShippingMin: saved.freeShippingMin !== undefined ? saved.freeShippingMin : 2000,
      defaultShippingFee: saved.defaultShippingFee !== undefined ? saved.defaultShippingFee : 0,
      supportedCarriers: saved.supportedCarriers || 'Kerry Express, Flash Express, SCG Express, GLP Fleet'
    };
  });

  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    if (typeof siteData?.updateEcommerceConfig === 'function') {
      siteData.updateEcommerceConfig(storeSettingsForm);
    } else {
      localStorage.setItem('glp_ecommerce_settings', JSON.stringify(storeSettingsForm));
    }
    showToast('บันทึกการตั้งค่าร้านค้า & บัญชีธนาคาร เรียบร้อยแล้ว 💾');
  };

  return (
    <div className="store-cms-wrapper">
      {/* Floating Animated Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
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

      {/* Top Main Navigation 5 Tabs */}
      <div className="store-cms-topbar">
        <div className="store-cms-nav-tabs">
          {/* Tab 1: Dashboard */}
          <button 
            type="button"
            className={`store-cms-tab-btn ${activeMainTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('dashboard')}
          >
            <BarChart2 size={18} />
            <span>01. ภาพรวม & สถิติ</span>
            {(pendingSlipsCount > 0 || stockMetrics.outOfStockCount > 0) && (
              <span className="store-tab-counter alert" title="มีรายการต้องตรวจสอบ">
                {pendingSlipsCount + stockMetrics.outOfStockCount}
              </span>
            )}
          </button>

          {/* Tab 2: Orders */}
          <button 
            type="button"
            className={`store-cms-tab-btn ${activeMainTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('orders')}
          >
            <ShoppingBag size={18} />
            <span>02. จัดการคำสั่งซื้อ & สลิป</span>
            {pendingSlipsCount > 0 && (
              <span className="store-tab-counter alert" title={`${pendingSlipsCount} คำสั่งซื้อรอตรวจสอบสลิป`}>
                {pendingSlipsCount}
              </span>
            )}
            <span className="store-tab-counter">{savedOrders.length}</span>
          </button>

          {/* Tab 3: Products */}
          <button 
            type="button"
            className={`store-cms-tab-btn ${activeMainTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('products')}
          >
            <Package size={18} />
            <span>03. จัดการสินค้า & สต็อก</span>
            <span className="store-tab-counter">{productsList.length}</span>
          </button>

          {/* Tab 4: Stock Alerts */}
          <button 
            type="button"
            className={`store-cms-tab-btn ${activeMainTab === 'stock-alerts' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('stock-alerts')}
          >
            <AlertTriangle size={18} />
            <span>04. แจ้งเตือนสินค้า & สต็อกต่ำ</span>
            {(stockMetrics.outOfStockCount + stockMetrics.lowStockCount) > 0 && (
              <span className="store-tab-counter alert">
                {stockMetrics.outOfStockCount + stockMetrics.lowStockCount}
              </span>
            )}
          </button>

          {/* Tab 5: Settings */}
          <button 
            type="button"
            className={`store-cms-tab-btn ${activeMainTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveMainTab('settings')}
          >
            <Settings size={18} />
            <span>05. ตั้งค่าร้านค้า & บัญชีรับโอน</span>
          </button>
        </div>

        {/* Global Action Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Sound Alert Toggle */}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setIsAudioAlertEnabled(prev => {
                const next = !prev;
                if (next) playAlertChime();
                showToast(`เสียงแจ้งเตือน: ${next ? 'เปิดใช้งาน (มีเสียงแจ้งเตือนสลิป/สต็อก)' : 'ปิดใช้งาน'}`);
                return next;
              });
            }}
            title={isAudioAlertEnabled ? 'คลิกเพื่อปิดเสียงแจ้งเตือน' : 'คลิกเพื่อเปิดเสียงแจ้งเตือน'}
            style={{ padding: '8px 12px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {isAudioAlertEnabled ? <Volume2 size={15} style={{ color: '#2563eb' }} /> : <VolumeX size={15} style={{ color: '#94a3b8' }} />}
            <span>{isAudioAlertEnabled ? 'เสียงเตือน: เปิด' : 'เสียงเตือน: ปิด'}</span>
          </button>

          {/* Export Orders CSV */}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => exportOrdersToCSV(filteredOrders)}
            title="ส่งออกรายงานออเดอร์เป็น CSV รองรับ Excel"
            style={{ padding: '8px 12px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>ส่งออก CSV</span>
          </button>

          {/* Demo Order Button */}
          <button 
            type="button"
            className="btn-primary"
            onClick={handleCreateDemoOrder}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <Plus size={14} />
            <span>+ สร้างออเดอร์ตัวอย่าง</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          SECTION 1: DASHBOARD & ACTIVE ALERTS HUB
          ========================================================= */}
      {activeMainTab === 'dashboard' && (
        <div>
          {/* Active Alerts Hub */}
          {(stockMetrics.outOfStockCount > 0 || stockMetrics.lowStockCount > 0 || pendingSlipsCount > 0) && (
            <div className="store-alerts-hub">
              {/* Critical: Out of Stock */}
              {stockMetrics.outOfStockCount > 0 && (
                <div className="store-alert-banner critical">
                  <div className="store-alert-left">
                    <div className="store-alert-icon-box">
                      <AlertCircle size={22} />
                    </div>
                    <div>
                      <div className="store-alert-title">
                        🚨 สินค้าหมดสต็อก {stockMetrics.outOfStockCount} รายการ! ลูกค้าไม่สามารถกดสั่งซื้อได้
                      </div>
                      <div className="store-alert-desc">
                        สินค้าที่หมด: {stockMetrics.outOfStockProducts.slice(0, 3).map(p => p.name).join(', ')}
                        {stockMetrics.outOfStockProducts.length > 3 && ` และอีก ${stockMetrics.outOfStockProducts.length - 3} รายการ`}
                      </div>
                    </div>
                  </div>

                  <div className="store-alert-actions">
                    <button 
                      type="button" 
                      className="btn-primary" 
                      style={{ background: '#dc2626', borderColor: '#dc2626', padding: '7px 14px', fontSize: '0.82rem' }}
                      onClick={() => {
                        setActiveMainTab('stock-alerts');
                      }}
                    >
                      <span>ไปที่หน้าเติมสต็อกทันที</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Warning: Low Stock */}
              {stockMetrics.lowStockCount > 0 && (
                <div className="store-alert-banner warning">
                  <div className="store-alert-left">
                    <div className="store-alert-icon-box">
                      <AlertTriangle size={22} />
                    </div>
                    <div>
                      <div className="store-alert-title">
                        ⚠️ สินค้าใกล้หมดสต็อก {stockMetrics.lowStockCount} รายการ (เหลือ &le; {lowStockThreshold} ชิ้น)
                      </div>
                      <div className="store-alert-desc">
                        รายการใกล้หมด: {stockMetrics.lowStockProducts.slice(0, 3).map(p => `${p.name} (เหลือ ${p.stock})`).join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="store-alert-actions">
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      style={{ padding: '7px 14px', fontSize: '0.82rem', borderColor: '#d97706', color: '#92400e' }}
                      onClick={() => setActiveMainTab('stock-alerts')}
                    >
                      <span>จัดการสต็อก</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Info: Pending Slip Verifications */}
              {pendingSlipsCount > 0 && (
                <div className="store-alert-banner info">
                  <div className="store-alert-left">
                    <div className="store-alert-icon-box">
                      <Clock size={22} />
                    </div>
                    <div>
                      <div className="store-alert-title">
                        ⏳ มีสลิปโอนเงินรอตรวจสอบ {pendingSlipsCount} รายการ
                      </div>
                      <div className="store-alert-desc">
                        ลูกค้าทำการแนบสลิปเรียบร้อยแล้ว กรุณาตรวจสอบยอดเงินและกดยืนยันเพื่อเริ่มเตรียมพัสดุ
                      </div>
                    </div>
                  </div>

                  <div className="store-alert-actions">
                    <button 
                      type="button" 
                      className="btn-primary" 
                      style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                      onClick={() => {
                        setOrderFilterStatus('verifying_payment');
                        setActiveMainTab('orders');
                      }}
                    >
                      <span>ตรวจสลิปทันที</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metrics Grid */}
          <div className="store-metrics-grid">
            <div className="store-metric-card">
              <div className="store-metric-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                <DollarSign size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">ยอดขายรวมทั้งหมด</span>
                <span className="store-metric-value" style={{ color: '#059669', fontSize: '1.3rem' }}>
                  ฿{salesAnalytics.totalRevenue.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  ชำระแล้ว: ฿{salesAnalytics.paidRevenue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="store-metric-card">
              <div className="store-metric-icon" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                <ShoppingBag size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">คำสั่งซื้อทั้งหมด</span>
                <span className="store-metric-value">{savedOrders.length} ออเดอร์</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  เฉลี่ย/ออเดอร์: ฿{salesAnalytics.averageOrderValue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="store-metric-card" style={{ borderColor: pendingSlipsCount > 0 ? '#fde68a' : '#e2e8f0', background: pendingSlipsCount > 0 ? '#fffbeb' : '#ffffff' }}>
              <div className="store-metric-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
                <Clock size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">สลิปรอตรวจสอบ</span>
                <span className="store-metric-value" style={{ color: pendingSlipsCount > 0 ? '#b45309' : '#0f172a' }}>
                  {pendingSlipsCount} รายการ
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  รอดำเนินการ: {savedOrders.filter(o => o.status === 'preparing_items').length} รายการ
                </span>
              </div>
            </div>

            <div className="store-metric-card">
              <div className="store-metric-icon" style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1' }}>
                <Package size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">สินค้า & คลังสต็อกรวม</span>
                <span className="store-metric-value">{stockMetrics.totalStockUnits} ชิ้น</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  มูลค่าคลัง: ฿{stockMetrics.totalInventoryValuation.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="store-metric-card" style={{ borderColor: stockMetrics.outOfStockCount > 0 ? '#fecaca' : '#e2e8f0', background: stockMetrics.outOfStockCount > 0 ? '#fef2f2' : '#ffffff' }}>
              <div className="store-metric-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
                <AlertCircle size={24} />
              </div>
              <div className="store-metric-info">
                <span className="store-metric-label">สินค้าหมด / ใกล้หมด</span>
                <span className="store-metric-value" style={{ color: (stockMetrics.outOfStockCount + stockMetrics.lowStockCount) > 0 ? '#dc2626' : '#0f172a' }}>
                  {stockMetrics.outOfStockCount} หมด / {stockMetrics.lowStockCount} ใกล้หมด
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  เกณฑ์เตือน: &le; {lowStockThreshold} ชิ้น
                </span>
              </div>
            </div>
          </div>

          {/* 2-Column Section: Top Sellers & Recent Orders */}
          <div className="dashboard-grid-cols">
            {/* Top 5 Best Selling Products */}
            <div className="dashboard-panel-card">
              <div className="dashboard-panel-header">
                <div className="dashboard-panel-title">
                  <Flame size={18} style={{ color: '#ea580c' }} />
                  <span>5 อันดับสินค้าขายดีที่สุด (Top Sellers)</span>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveMainTab('products')}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  ดูสินค้าทั้งหมด
                </button>
              </div>

              {salesAnalytics.topSellers.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  ยังไม่มีสถิติยอดขาย (จะแสดงเมื่อมีคำสั่งซื้อเข้ามา)
                </div>
              ) : (
                <table className="top-sellers-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>สินค้า</th>
                      <th style={{ textAlign: 'center' }}>จำนวนที่ขาย</th>
                      <th style={{ textAlign: 'right' }}>ยอดขายรวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesAnalytics.topSellers.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 800, color: idx === 0 ? '#ea580c' : '#64748b' }}>{idx + 1}</td>
                        <td>
                          <div className="top-seller-prod-info">
                            {item.image && <img src={item.image} alt="" className="top-seller-thumb" />}
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0f172a' }}>{item.name}</strong>
                              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>SKU: {item.sku || '-'}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 800 }}>{item.unitsSold} ชิ้น</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: '#059669' }}>฿{item.revenueGenerated.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Recent Orders Stream */}
            <div className="dashboard-panel-card">
              <div className="dashboard-panel-header">
                <div className="dashboard-panel-title">
                  <Clock size={18} className="text-blue" />
                  <span>คำสั่งซื้อล่าสุด (Recent Orders)</span>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveMainTab('orders')}
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  ดูออเดอร์ทั้งหมด ({savedOrders.length})
                </button>
              </div>

              {savedOrders.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  ยังไม่มีคำสั่งซื้อในระบบ
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {savedOrders.slice(0, 5).map(o => {
                    const statusCfg = ORDER_STATUS_CONFIG[o.status] || ORDER_STATUS_CONFIG.order_received;
                    return (
                      <div 
                        key={o.orderNo}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #f1f5f9',
                          background: '#f8fafc',
                          fontSize: '0.82rem'
                        }}
                      >
                        <div>
                          <strong style={{ color: '#1d4ed8' }}>{o.orderNo}</strong>
                          <span style={{ color: '#475569', marginLeft: '8px' }}>{o.shipping?.receiverName || o.customerName || 'ลูกค้า'}</span>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                            {o.items?.length || 0} รายการ • ฿{(o.pricing?.grandTotal || 0).toLocaleString()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span 
                            className="order-status-badge"
                            style={{ background: statusCfg.bg, color: statusCfg.color, fontSize: '0.72rem', padding: '3px 8px' }}
                          >
                            {statusCfg.label}
                          </span>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setSelectedOrderForDetail(o)}
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            เปิดดู
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 2: ORDERS MANAGEMENT & SLIP VERIFICATION
          ========================================================= */}
      {activeMainTab === 'orders' && (
        <div>
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
                  placeholder="ค้นหาเลขออเดอร์, ชื่อผู้รับ, เบอร์โทร..."
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
                <p style={{ margin: 0, fontSize: '0.85rem' }}>คลิกปุ่ม "+ สร้างออเดอร์ตัวอย่าง" ด้านบนเพื่อทดสอบระบบได้ทันที</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="store-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '130px' }}>เลขออเดอร์</th>
                      <th style={{ width: '110px' }}>วันที่ / เวลา</th>
                      <th style={{ width: '180px' }}>ผู้รับ & ที่อยู่จัดส่ง</th>
                      <th>รายการสินค้า</th>
                      <th style={{ width: '120px' }}>ยอดรวมสุทธิ</th>
                      <th style={{ width: '110px' }}>สลิปโอนเงิน</th>
                      <th style={{ width: '130px' }}>สถานะ</th>
                      <th style={{ width: '220px', textAlign: 'right' }}>การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => {
                      const statusCfg = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.order_received;
                      const StatusIcon = statusCfg.icon;

                      return (
                        <tr key={order.orderNo}>
                          {/* Order No */}
                          <td>
                            <strong 
                              style={{ color: '#1d4ed8', cursor: 'pointer', display: 'block' }}
                              onClick={() => setSelectedOrderForDetail(order)}
                            >
                              {order.orderNo}
                            </strong>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              {order.taxInvoice?.companyName ? '🏢 นิติบุคคล' : '👤 บุคคลทั่วไป'}
                            </span>
                          </td>

                          {/* Created Date */}
                          <td>
                            <div style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600 }}>
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString('th-TH') : '-'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : ''}
                            </div>
                          </td>

                          {/* Customer */}
                          <td>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>
                              {order.shipping?.receiverName || order.customerName || '-'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#2563eb' }}>
                              📞 {order.shipping?.phone || order.customerPhone || '-'}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b', maxWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={order.shipping?.address}>
                              📍 {order.shipping?.address || '-'}
                            </div>
                          </td>

                          {/* Items Summary */}
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.78rem' }}>
                              {(order.items || []).slice(0, 2).map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {item.image && (
                                    <img src={item.image} alt="" style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'cover' }} />
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
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                              ฿{(order.pricing?.grandTotal || 0).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
                              ชำระเต็ม 100%
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
                                  >
                                    <FileText size={13} />
                                    <span>เปิด PDF</span>
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
                                <button
                                  type="button"
                                  onClick={() => setActiveSlipZoomUrl(order.slipPreview)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#2563eb',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    padding: 0
                                  }}
                                >
                                  ตรวจสลิป
                                </button>
                              </div>
                            ) : (
                              <span className="no-slip-tag">ยังไม่แนบ</span>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td>
                            <span 
                              className={`order-status-badge status-${order.status}`}
                              style={{ background: statusCfg.bg, color: statusCfg.color }}
                            >
                              <StatusIcon size={12} />
                              <span>{statusCfg.label}</span>
                            </span>
                            {order.trackingNumber && (
                              <div style={{ fontSize: '0.7rem', color: '#6d28d9', marginTop: '3px', fontWeight: 600 }}>
                                🚚 {order.trackingNumber}
                              </div>
                            )}
                          </td>

                          {/* Quick Actions */}
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              {/* Quick Approve Slip */}
                              {order.status === 'verifying_payment' && (
                                <button
                                  type="button"
                                  className="btn-primary"
                                  onClick={() => handleApproveSlip(order.orderNo)}
                                  title="อนุมัติสลิป"
                                  style={{ padding: '5px 8px', fontSize: '0.75rem', background: '#16a34a', borderColor: '#16a34a' }}
                                >
                                  <Check size={12} />
                                  <span>อนุมัติ</span>
                                </button>
                              )}

                              {/* Prepare Items */}
                              {order.status === 'payment_verified' && (
                                <button
                                  type="button"
                                  className="btn-primary"
                                  onClick={() => handlePrepareItems(order.orderNo)}
                                  style={{ padding: '5px 8px', fontSize: '0.75rem', background: '#0284c7', borderColor: '#0284c7' }}
                                >
                                  <Package size={12} />
                                  <span>เตรียมของ</span>
                                </button>
                              )}

                              {/* Ship */}
                              {order.status === 'preparing_items' && (
                                <button
                                  type="button"
                                  className="btn-primary"
                                  onClick={() => handleOpenShipModal(order)}
                                  style={{ padding: '5px 8px', fontSize: '0.75rem', background: '#7c3aed', borderColor: '#7c3aed' }}
                                >
                                  <Truck size={12} />
                                  <span>ส่งของ</span>
                                </button>
                              )}

                              {/* Mark Delivered */}
                              {order.status === 'shipping' && (
                                <button
                                  type="button"
                                  className="btn-primary"
                                  onClick={() => handleMarkDelivered(order.orderNo)}
                                  title="เปลี่ยนสถานะเป็นจัดส่งสำเร็จและส่งอีเมลแจ้งลูกค้า"
                                  style={{ padding: '5px 8px', fontSize: '0.75rem', background: '#059669', borderColor: '#059669' }}
                                >
                                  <ShieldCheck size={12} />
                                  <span>จัดส่งสำเร็จ</span>
                                </button>
                              )}

                              {/* Print Shipping Delivery Note & Label (Duplicate) */}
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setSelectedOrderForShippingLabel(order)}
                                title="พิมพ์หรือดาวน์โหลดใบส่งสินค้า & ใบปะหน้ากล่อง (คู่ฉบับมีลายเซ็นรับของ)"
                                style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                              >
                                <Truck size={12} />
                                <span>ใบส่งของ/คู่ฉบับ</span>
                              </button>

                              {/* Print Receipt / Tax Invoice */}
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setSelectedOrderForReceipt(order)}
                                title="พิมพ์ใบเสร็จรับเงิน / ใบกำกับภาษี"
                                style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                              >
                                <Printer size={12} />
                                <span>ใบเสร็จ</span>
                              </button>

                              {/* Detail / Edit */}
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setSelectedOrderForDetail(order)}
                                title="แก้ไขออเดอร์แบบละเอียด"
                                style={{ padding: '5px 8px', fontSize: '0.75rem' }}
                              >
                                <Edit3 size={12} />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => handleDeleteOrderConfirm(order.orderNo)}
                                title="ลบออเดอร์"
                                style={{ padding: '5px 8px', fontSize: '0.75rem', color: '#ef4444' }}
                              >
                                <Trash2 size={12} />
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
          SECTION 3: PRODUCTS & INVENTORY MANAGEMENT
          ========================================================= */}
      {activeMainTab === 'products' && (
        <div>
          {/* Top Filter & Action Bar */}
          <div className="store-filter-bar">
            <div className="store-filter-row-top" style={{ marginBottom: '10px' }}>
              {/* Category Pills */}
              <div className="store-filter-pills">
                <button
                  type="button"
                  className={`store-filter-pill ${productCategoryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setProductCategoryFilter('all')}
                >
                  ทั้งหมด ({productsList.length})
                </button>
                {PRODUCT_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`store-filter-pill ${productCategoryFilter === cat.id ? 'active' : ''}`}
                    onClick={() => setProductCategoryFilter(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Add New Product Button */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={handleResetProducts}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', fontSize: '0.82rem' }}
                >
                  <RotateCw size={13} />
                  <span>รีเซ็ตค่าเริ่มต้น</span>
                </button>

                <button 
                  type="button"
                  className="btn-primary"
                  onClick={handleOpenCreateProduct}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  <Plus size={14} />
                  <span>+ เพิ่มสินค้าใหม่</span>
                </button>
              </div>
            </div>

            {/* Second Filter Row: Stock Status & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 700, color: '#475569' }}>สถานะสต็อก:</span>
                {[
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'in_stock', label: '🟢 มีของพร้อมส่ง' },
                  { id: 'low_stock', label: `🟡 ใกล้หมด (≤ ${lowStockThreshold})` },
                  { id: 'out_of_stock', label: '🔴 สินค้าหมด (0)' }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className={`store-filter-pill ${productStockFilter === s.id ? 'active' : ''}`}
                    onClick={() => setProductStockFilter(s.id)}
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="store-search-box" style={{ maxWidth: '320px' }}>
                <Search size={15} className="store-search-icon" />
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อสินค้า, SKU, สเปก..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Products Table with Inline Quick Stock Steppers */}
          <div className="store-orders-table-card">
            <div className="table-responsive">
              <table className="store-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>รูปภาพ</th>
                    <th style={{ width: '130px' }}>รหัส SKU</th>
                    <th>ชื่อสินค้า & หมวดหมู่</th>
                    <th style={{ width: '130px' }}>ราคาขาย (ปกติ)</th>
                    <th style={{ width: '210px' }}>สต็อกคงเหลือ (ปรับด่วน ⚡)</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>แสดงหน้าร้าน</th>
                    <th style={{ width: '160px', textAlign: 'right' }}>การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(prod => {
                    const currentStock = Number(prod.stock !== undefined ? prod.stock : 20);
                    const isOutOfStock = currentStock <= 0;
                    const isLowStock = currentStock > 0 && currentStock <= lowStockThreshold;
                    const isVisible = prod.isVisible !== false;

                    return (
                      <tr key={prod.id}>
                        {/* Image Thumbnail */}
                        <td>
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'contain', background: '#fff', border: '1px solid #e2e8f0' }} 
                          />
                        </td>

                        {/* SKU & Badge */}
                        <td>
                          <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>
                            {prod.sku || '-'}
                          </div>
                          {prod.badge && (
                            <span style={{ display: 'inline-block', marginTop: '3px', fontSize: '0.68rem', fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px' }}>
                              {prod.badge}
                            </span>
                          )}
                        </td>

                        {/* Product Title & Subtitle */}
                        <td>
                          <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                            {prod.name}
                          </strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                            หมวด: {PRODUCT_CATEGORIES.find(c => c.id === prod.category)?.name || prod.category}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', maxWidth: '340px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.subtitle}
                          </div>
                        </td>

                        {/* Pricing */}
                        <td>
                          <div style={{ fontWeight: 800, color: '#1d4ed8', fontSize: '0.95rem' }}>
                            ฿{Number(prod.price || 0).toLocaleString()}
                          </div>
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                              ฿{Number(prod.originalPrice).toLocaleString()}
                            </div>
                          )}
                        </td>

                        {/* Inline Quick Stock Editor */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div className="inline-stock-stepper">
                                <button
                                  type="button"
                                  className="inline-stock-btn"
                                  onClick={() => handleInlineStockChange(prod.id, -1, false)}
                                  title="ลด 1 ชิ้น"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  className="inline-stock-input"
                                  value={currentStock}
                                  onChange={(e) => handleInlineStockChange(prod.id, e.target.value, true)}
                                />
                                <button
                                  type="button"
                                  className="inline-stock-btn"
                                  onClick={() => handleInlineStockChange(prod.id, 1, false)}
                                  title="เพิ่ม 1 ชิ้น"
                                >
                                  +
                                </button>
                              </div>

                              {/* Quick +10 Restock */}
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => handleQuickRestock(prod.id, 10)}
                                title="เติมด่วน +10 ชิ้น"
                                style={{ padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700, borderColor: '#bfdbfe', color: '#1d4ed8', background: '#eff6ff' }}
                              >
                                +10 ชิ้น
                              </button>
                            </div>

                            {/* Stock status pill */}
                            <div>
                              {isOutOfStock ? (
                                <span className="stock-tag-pill out-of-stock">
                                  🔴 หมดสต็อก (0 ชิ้น)
                                </span>
                              ) : isLowStock ? (
                                <span className="stock-tag-pill low-stock">
                                  ⚠️ ใกล้หมด (เหลือ {currentStock} ชิ้น)
                                </span>
                              ) : (
                                <span className="stock-tag-pill in-stock">
                                  ✓ มีของพร้อมส่ง ({currentStock} ชิ้น)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Visibility Toggle */}
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleProductVisibility(prod.id, isVisible)}
                            style={{
                              background: isVisible ? '#dcfce7' : '#fee2e2',
                              color: isVisible ? '#15803d' : '#b91c1c',
                              border: `1px solid ${isVisible ? '#86efac' : '#fca5a5'}`,
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                            title="คลิกเพื่อสลับสถานะเปิด/ปิดขายในหน้าร้าน"
                          >
                            {isVisible ? 'เปิดขาย' : 'ซ่อน'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => handleOpenEditProduct(prod)}
                              title="แก้ไขข้อมูลสินค้า & สเปก"
                              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                            >
                              <Edit3 size={13} />
                              <span>แก้ไข</span>
                            </button>

                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => handleDuplicateProduct(prod)}
                              title="คัดลอกสินค้านี้เพื่อสร้างใหม่"
                              style={{ padding: '6px 8px', fontSize: '0.78rem' }}
                            >
                              <Copy size={13} />
                            </button>

                            <a
                              href={`/products/${prod.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-secondary"
                              title="ดูหน้าสินค้าจริง"
                              style={{ padding: '6px 8px', fontSize: '0.78rem', color: '#0f172a', textDecoration: 'none' }}
                            >
                              <ExternalLink size={13} />
                            </a>

                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => handleDeleteProductConfirm(prod.id, prod.name)}
                              title="ลบสินค้านี้"
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
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 4: STOCK ALERTS & RESTOCK PLANNING
          ========================================================= */}
      {activeMainTab === 'stock-alerts' && (
        <div>
          {/* Controls & Threshold Selector */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 22px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} style={{ color: '#d97706' }} />
                  <span>ศูนย์แจ้งเตือนสต็อก & วางแผนเติมสินค้า (Stock Alerts Hub)</span>
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                  ระบบคัดกรองสินค้าที่สต็อกต่ำกว่าเกณฑ์อัตโนมัติ เพื่อป้องกันสินค้าขาดตลาดและไม่เสียโอกาสการขาย
                </p>
              </div>

              {/* Threshold Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                  เกณฑ์แจ้งเตือนสต็อกต่ำ:
                </span>
                <select
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                  style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  <option value={3}>เหลือ &le; 3 ชิ้น (เตือนฉุกเฉิน)</option>
                  <option value={5}>เหลือ &le; 5 ชิ้น (ค่ามาตรฐาน)</option>
                  <option value={10}>เหลือ &le; 10 ชิ้น (คลังใหญ่)</option>
                  <option value={20}>เหลือ &le; 20 ชิ้น (สินค้าขายเร็ว)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Batch Restock Toolbar */}
          <div className="batch-restock-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={selectedProductIdsForBatch.length > 0 && selectedProductIdsForBatch.length === [...stockMetrics.outOfStockProducts, ...stockMetrics.lowStockProducts].length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProductIdsForBatch([...stockMetrics.outOfStockProducts, ...stockMetrics.lowStockProducts].map(p => p.id));
                    } else {
                      setSelectedProductIdsForBatch([]);
                    }
                  }}
                  style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                />
                <span>เลือกทั้งหมด ({selectedProductIdsForBatch.length} รายการที่เลือก)</span>
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#1e40af', fontWeight: 600 }}>เติมสต็อกกลุ่มที่เลือก:</span>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleBatchRestock(10)}
                disabled={selectedProductIdsForBatch.length === 0}
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                +10 ชิ้น
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleBatchRestock(20)}
                disabled={selectedProductIdsForBatch.length === 0}
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                +20 ชิ้น
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleBatchRestock(50)}
                disabled={selectedProductIdsForBatch.length === 0}
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                +50 ชิ้น
              </button>
            </div>
          </div>

          {/* Stock Alerts Table */}
          <div className="store-orders-table-card">
            {([...stockMetrics.outOfStockProducts, ...stockMetrics.lowStockProducts]).length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#16a34a' }}>
                <CheckCircle2 size={48} style={{ margin: '0 auto 12px', opacity: 0.8 }} />
                <h4 style={{ margin: '0 0 6px', color: '#0f172a' }}>สต็อกสินค้าทุกรายการอยู่ในระดับปลอดภัย!</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  ไม่มีสินค้าหมดหรือต่ำกว่าเกณฑ์ ({lowStockThreshold} ชิ้น) ในระบบขณะนี้
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="store-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>เลือก</th>
                      <th style={{ width: '60px' }}>รูปภาพ</th>
                      <th style={{ width: '130px' }}>ระดับความเสี่ยง</th>
                      <th>ชื่อสินค้า & SKU</th>
                      <th style={{ width: '130px' }}>สต็อกปัจจุบัน</th>
                      <th style={{ width: '130px' }}>ราคาขาย</th>
                      <th style={{ width: '220px', textAlign: 'right' }}>เติมสต็อกทันที (Restock)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...stockMetrics.outOfStockProducts, ...stockMetrics.lowStockProducts].map(prod => {
                      const currentStock = Number(prod.stock !== undefined ? prod.stock : 20);
                      const isOutOfStock = currentStock <= 0;
                      const isSelected = selectedProductIdsForBatch.includes(prod.id);

                      return (
                        <tr key={prod.id} style={{ background: isOutOfStock ? '#fff5f5' : '#fffdfa' }}>
                          <td>
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProductIdsForBatch(prev => [...prev, prod.id]);
                                } else {
                                  setSelectedProductIdsForBatch(prev => prev.filter(id => id !== prod.id));
                                }
                              }}
                              style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                            />
                          </td>

                          <td>
                            <img 
                              src={prod.image} 
                              alt="" 
                              style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'contain', background: '#fff', border: '1px solid #e2e8f0' }} 
                            />
                          </td>

                          <td>
                            {isOutOfStock ? (
                              <span className="stock-tag-pill out-of-stock">
                                🚨 สินค้าหมด (0)
                              </span>
                            ) : (
                              <span className="stock-tag-pill low-stock">
                                ⚠️ ใกล้หมด ({currentStock})
                              </span>
                            )}
                          </td>

                          <td>
                            <strong style={{ fontSize: '0.88rem', color: '#0f172a', display: 'block' }}>
                              {prod.name}
                            </strong>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              SKU: {prod.sku || '-'} | หมวด: {PRODUCT_CATEGORIES.find(c => c.id === prod.category)?.name || prod.category}
                            </span>
                          </td>

                          <td>
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: isOutOfStock ? '#dc2626' : '#b45309' }}>
                              {currentStock} ชิ้น
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>
                              ฿{Number(prod.price || 0).toLocaleString()}
                            </div>
                          </td>

                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                type="button"
                                className="btn-primary"
                                onClick={() => handleQuickRestock(prod.id, 10)}
                                style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                              >
                                +10 ชิ้น
                              </button>
                              <button
                                type="button"
                                className="btn-primary"
                                onClick={() => handleQuickRestock(prod.id, 25)}
                                style={{ padding: '5px 10px', fontSize: '0.78rem', background: '#0284c7', borderColor: '#0284c7' }}
                              >
                                +25 ชิ้น
                              </button>
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => handleOpenEditProduct(prod)}
                                style={{ padding: '5px 8px', fontSize: '0.78rem' }}
                              >
                                <Edit3 size={13} />
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
          SECTION 5: STORE & SHIPPING SETTINGS
          ========================================================= */}
      {activeMainTab === 'settings' && (
        <form onSubmit={handleSaveStoreSettings} style={{ maxWidth: '900px' }}>
          {/* Bank Transfer Information */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <Building2 size={20} className="text-blue" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                1. ข้อมูลบัญชีธนาคารสำหรับรับชำระเงิน (Bank Transfer & PromptPay)
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  ธนาคารที่เปิดบัญชี *
                </label>
                <input 
                  type="text"
                  required
                  value={storeSettingsForm.bankName}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, bankName: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  เลขที่บัญชีธนาคาร *
                </label>
                <input 
                  type="text"
                  required
                  value={storeSettingsForm.accountNo}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, accountNo: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  ชื่อบัญชี (Account Name) *
                </label>
                <input 
                  type="text"
                  required
                  value={storeSettingsForm.accountName}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, accountName: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  สาขาธนาคาร
                </label>
                <input 
                  type="text"
                  value={storeSettingsForm.branch}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, branch: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  หมายเลขพร้อมเพย์ (PromptPay ID)
                </label>
                <input 
                  type="text"
                  value={storeSettingsForm.promptPayId}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, promptPayId: e.target.value })}
                  placeholder="เลขผู้เสียภาษี 13 หลัก หรือ เบอร์โทร"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  URL รูปภาพ QR Code พร้อมเพย์
                </label>
                <input 
                  type="text"
                  value={storeSettingsForm.promptPayQrUrl}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, promptPayQrUrl: e.target.value })}
                  placeholder="https://... หรือเว้นว่างเพื่อใช้ QR อัตโนมัติ"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          </div>

          {/* Shipping Configuration */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <Truck size={20} className="text-blue" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                2. การตั้งค่าการจัดส่งพัสดุ (Shipping & Logistics)
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  บริษัทขนส่งพัสดุที่รองรับ (คั่นด้วยจุลภาค)
                </label>
                <input 
                  type="text"
                  value={storeSettingsForm.supportedCarriers}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, supportedCarriers: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  ยอดสั่งซื้อขั้นต่ำสำหรับ ส่งฟรีทั่วประเทศ (฿)
                </label>
                <input 
                  type="number"
                  min="0"
                  value={storeSettingsForm.freeShippingMin}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, freeShippingMin: Number(e.target.value) })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  ค่าจัดส่งมาตรฐานเมื่อยอดไม่ถึงเกณฑ์ (฿)
                </label>
                <input 
                  type="number"
                  min="0"
                  value={storeSettingsForm.defaultShippingFee}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, defaultShippingFee: Number(e.target.value) })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          </div>

          {/* Company & Tax Invoice Info */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <FileText size={20} className="text-blue" />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                3. ข้อมูลร้านค้าสำหรับออกใบกำกับภาษี & ใบเสร็จ (Store & Tax Info)
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  ชื่อบริษัท / ร้านค้า *
                </label>
                <input 
                  type="text"
                  required
                  value={storeSettingsForm.companyName}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, companyName: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  เลขประจำตัวผู้เสียภาษีอากร (13 หลัก) *
                </label>
                <input 
                  type="text"
                  required
                  value={storeSettingsForm.taxId}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, taxId: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  เบอร์โทรศัพท์ติดต่อ
                </label>
                <input 
                  type="text"
                  value={storeSettingsForm.contactPhone}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, contactPhone: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  อีเมลร้านค้า
                </label>
                <input 
                  type="email"
                  value={storeSettingsForm.contactEmail}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, contactEmail: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  ที่อยู่สำนักงานสำหรับออกใบกำกับภาษี *
                </label>
                <textarea 
                  rows={2}
                  required
                  value={storeSettingsForm.companyAddress}
                  onChange={e => setStoreSettingsForm({ ...storeSettingsForm, companyAddress: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', fontSize: '0.95rem' }}
            >
              <Check size={16} />
              <span>บันทึกการตั้งค่าร้านค้าทั้งหมด</span>
            </button>
          </div>
        </form>
      )}

      {/* =========================================================
          PRINT MODAL 1: SHIPPING LABEL / PACKING SLIP
          ========================================================= */}
      {selectedOrderForShippingLabel && (
        <ShippingLabelModal
          order={selectedOrderForShippingLabel}
          onClose={() => setSelectedOrderForShippingLabel(null)}
        />
      )}

      {/* =========================================================
          PRINT MODAL 2: RECEIPT / TAX INVOICE
          ========================================================= */}
      {selectedOrderForReceipt && (
        <ReceiptTaxInvoiceModal
          order={selectedOrderForReceipt}
          onClose={() => setSelectedOrderForReceipt(null)}
        />
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
          onPrintShippingLabel={(ord) => setSelectedOrderForShippingLabel(ord)}
          onPrintReceipt={(ord) => setSelectedOrderForReceipt(ord)}
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

            <div className="store-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setPreviewEmailOrder({
                    ...orderToShip,
                    shippingCarrier: shippingCarrierInput,
                    trackingNumber: trackingNumberInput
                  });
                  setPreviewEmailType('shipping');
                }}
                style={{ fontSize: '0.82rem', padding: '8px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Eye size={14} />
                <span>ดูตัวอย่างอีเมล</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
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
        </div>
      )}

      {/* =========================================================
          MODAL: EMAIL PREVIEW & DISPATCHER
          ========================================================= */}
      {previewEmailOrder && (() => {
        const emailTemplate = buildOrderStatusEmailTemplate(previewEmailOrder, previewEmailType, {
          carrier: previewEmailOrder.shippingCarrier || shippingCarrierInput || 'Kerry Express',
          trackingNo: previewEmailOrder.trackingNumber || trackingNumberInput || ''
        });

        return (
          <div className="store-modal-backdrop" onClick={() => setPreviewEmailOrder(null)}>
            <div className="store-modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '820px', width: '94%' }}>
              <div className="store-modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      ตัวอย่างอีเมลแจ้งเตือนลูกค้า (Email Notification Preview)
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                      คำสั่งซื้อ: <strong>{previewEmailOrder.orderNo}</strong> | ผู้รับ: <strong>{previewEmailOrder.shipping?.receiverName || '-'}</strong>
                    </div>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setPreviewEmailOrder(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="store-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '16px 20px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 700, color: '#475569' }}>เลือกแบบอีเมล:</span>
                      <select 
                        value={previewEmailType} 
                        onChange={(e) => setPreviewEmailType(e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600, background: '#ffffff' }}
                      >
                        <option value="shipping">🚚 กำลังจัดส่งพัสดุ (Shipping & Tracking)</option>
                        <option value="payment_verified">✓ ตรวจสอบการชำระเงินแล้ว (Payment Verified)</option>
                        <option value="preparing_items">📦 กำลังเตรียมพัสดุ & QC (Preparing)</option>
                        <option value="delivered">🎉 จัดส่งสำเร็จเรียบร้อย (Delivered)</option>
                        <option value="payment_issue">⚠️ แจ้งสลิปมีปัญหา (Payment Issue)</option>
                      </select>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      ส่งถึง: <strong style={{ color: '#0f172a' }}>{previewEmailOrder.customerEmail || previewEmailOrder.shipping?.email || 'ยังไม่ได้ระบุอีเมล'}</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#334155', background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <strong>หัวข้ออีเมล (Subject):</strong> {emailTemplate.subject}
                  </div>
                </div>

                <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', background: '#f1f5f9' }}>
                  <iframe 
                    title="Email Preview"
                    srcDoc={emailTemplate.html}
                    style={{ width: '100%', height: '460px', border: 'none', display: 'block', background: '#f1f5f9' }}
                  />
                </div>
              </div>

              <div className="store-modal-footer" style={{ borderTop: '1px solid #e2e8f0', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      navigator.clipboard?.writeText(emailTemplate.html);
                      showToast('คัดลอกโค้ด HTML ของอีเมลเรียบร้อยแล้ว');
                    }}
                    style={{ fontSize: '0.82rem', padding: '8px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Copy size={14} />
                    <span>คัดลอก HTML</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => {
                      const blob = new Blob([emailTemplate.html], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      window.open(url, '_blank');
                    }}
                    style={{ fontSize: '0.82rem', padding: '8px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ExternalLink size={14} />
                    <span>เปิดดูเต็มจอ ↗</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setPreviewEmailOrder(null)}
                  >
                    ปิด
                  </button>

                  <button 
                    type="button" 
                    className="btn-primary"
                    style={{ background: '#2563eb', borderColor: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    onClick={async () => {
                      const res = await dispatchOrderStatusEmail(previewEmailOrder, previewEmailType, {
                        carrier: previewEmailOrder.shippingCarrier || shippingCarrierInput,
                        trackingNo: previewEmailOrder.trackingNumber || trackingNumberInput
                      });
                      if (res.success) {
                        showToast(`ส่งอีเมลสถานะไปยัง ${previewEmailOrder.customerEmail || previewEmailOrder.shipping?.email} เรียบร้อยแล้ว! 📧`);
                        setPreviewEmailOrder(null);
                      } else {
                        showToast(`ไม่สามารถส่งได้: ${res.message || 'ลูกค้าไม่ได้ระบุอีเมล'}`);
                      }
                    }}
                  >
                    <Send size={14} />
                    <span>ส่งอีเมลจริงให้ลูกค้าทันที 🚀</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <input 
                        type="text" 
                        placeholder="เพิ่ม URL รูปภาพสำหรับออโต้สไลด์ หรือกดปุ่มอัปโหลดจากเครื่อง..."
                        value={newGalleryInput}
                        onChange={e => setNewGalleryInput(e.target.value)}
                        style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={handleAddGalleryImage}
                        style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                      >
                        + เพิ่มจาก URL
                      </button>
                      <label className="btn-secondary" style={{ cursor: 'pointer', margin: 0, padding: '8px 14px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span>📁 อัปโหลดรูปสไลด์จากเครื่อง</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple
                          style={{ display: 'none' }} 
                          onChange={e => {
                            if (e.target.files && e.target.files.length > 0) handleProductGalleryUpload(e.target.files);
                            e.target.value = '';
                          }} 
                        />
                      </label>
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
