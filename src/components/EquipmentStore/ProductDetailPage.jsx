import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ChevronRight, ChevronLeft, ArrowLeft, ShoppingCart, Check, 
  Star, ShieldCheck, Truck, RotateCw, Eye, 
  Plus, Minus, Share2, Heart,
  MessageCircle, FileText, Copy,
  CheckCircle2, ChevronDown
} from 'lucide-react';
import { EQUIPMENT_PRODUCTS, PRODUCT_CATEGORIES } from '../../data/equipmentProducts';
import { useCart } from '../../context/CartContext';
import { useSiteData } from '../../context/SiteDataContext';
import { useTranslation } from '../../context/LanguageContext';
import ThreeProductViewer from '../ThreeProductViewer';
import './ShopeeProductDetail.css';

// Multilingual Dictionary (Thai, English, Chinese)
const I18N = {
  th: {
    home: 'หน้าแรก',
    store: 'อุปกรณ์และสินค้า',
    allProducts: 'สินค้าทั้งหมด',
    backToCatalog: 'กลับสู่หน้าร้าน',
    officialStore: 'สินค้าทางการ GLP',
    ratings: 'คะแนนความพึงพอใจ',
    sold: 'ขายแล้ว',
    report: 'รายงานสินค้า',
    inStock: 'มีสินค้าพร้อมส่ง',
    stockPieces: 'ชิ้น',
    shipping: 'การจัดส่ง',
    freeShipping: 'จัดส่งด่วนฟรีทั่วประเทศ',
    shippingTime: 'ส่งถึงภายใน 1-2 วันทำการ (มาตรฐานสนามแข่งอีสปอร์ต)',
    guarantee: 'การรับประกัน',
    guaranteeText: 'รับประกันศูนย์ On-site Service 3 ปีเต็ม',
    selectColor: 'ตัวเลือกสี',
    selectSize: 'ขนาด / ออปชัน',
    quantity: 'จำนวน',
    addToCart: 'เพิ่มไปยังรถเข็น',
    addedToCart: 'เพิ่มลงตะกร้าแล้ว',
    buyNow: 'ซื้อทันที',
    requestQuote: 'ขอใบเสนอราคาด่วน',
    view3D: 'หมุนดู 3D 360°',
    viewPhotos: 'ดูรูปถ่ายจริง',
    share: 'Share:',
    favorite: 'Favorite',
    vatIncluded: 'ราคาสินค้ารวมภาษีมูลค่าเพิ่ม 7% เรียบร้อยแล้ว (ออกใบกำกับภาษีได้)',
    specsTitle: 'ข้อมูลจำเพาะของสินค้า (Specifications)',
    descTitle: 'รายละเอียดสินค้า (Product Description)',
    featuresTitle: 'จุดเด่นและฟังก์ชันการใช้งาน:',
    relatedTitle: 'สินค้าอื่นๆ ที่แนะนำ (Related Products)',
    category: 'หมวดหมู่',
    brand: 'แบรนด์',
    sku: 'รหัสสินค้า (SKU)',
    dimensions: 'ขนาดสินค้า',
    weight: 'น้ำหนัก / การรับน้ำหนัก',
    materials: 'วัสดุและโครงสร้าง',
    warranty: 'ระยะเวลารับประกัน',
    shipsFrom: 'ส่งจาก',
    bangkok: 'กรุงเทพมหานคร, ประเทศไทย',
    chatNow: 'แชทเลย',
    quoteDoc: 'ใบเสนอราคา',
    toastAdded: 'เพิ่มลงในตะกร้าเรียบร้อยแล้ว',
    toastSub: 'มีสินค้าทั้งหมดในตะกร้า',
    toastContinue: 'คุณสามารถเลือกซื้อสินค้าอื่นต่อได้',
    fastDeliveryBadge: 'ส่งฟรีทั่วไทย',
    warrantyBadge: 'ประกันศูนย์ 3 ปี',
    verifiedBadge: 'GLP Arena'
  },
  en: {
    home: 'Home',
    store: 'Store',
    allProducts: 'All Products',
    backToCatalog: 'Back to Store',
    officialStore: 'GLP Official',
    ratings: 'Ratings',
    sold: 'Sold',
    report: 'Report',
    inStock: 'In Stock',
    stockPieces: 'items',
    shipping: 'Shipping',
    freeShipping: 'Free Nationwide Shipping',
    shippingTime: 'Estimated delivery within 1-2 business days',
    guarantee: 'Guarantee',
    guaranteeText: '3-Year On-Site Service & Official Warranty',
    selectColor: 'Color',
    selectSize: 'Size / Spec',
    quantity: 'Quantity',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart',
    buyNow: 'Buy Now',
    requestQuote: 'Request Quotation',
    view3D: 'View 3D 360°',
    viewPhotos: 'View Photos',
    share: 'Share:',
    favorite: 'Favorite',
    vatIncluded: 'Includes 7% VAT (Tax Invoice Available)',
    specsTitle: 'Product Specifications',
    descTitle: 'Product Description',
    featuresTitle: 'Key Features & Capabilities:',
    relatedTitle: 'Related Products',
    category: 'Category',
    brand: 'Brand',
    sku: 'SKU',
    dimensions: 'Dimensions',
    weight: 'Weight / Capacity',
    materials: 'Materials & Structure',
    warranty: 'Warranty',
    shipsFrom: 'Ships From',
    bangkok: 'Bangkok, Thailand',
    chatNow: 'Live Chat',
    quoteDoc: 'Quotation',
    toastAdded: 'Added to cart successfully',
    toastSub: 'Total items in cart',
    toastContinue: 'You can continue shopping for more items',
    fastDeliveryBadge: 'Free Delivery',
    warrantyBadge: '3-Year Warranty',
    verifiedBadge: 'GLP Arena'
  },
  zh: {
    home: '首页',
    store: '装备商城',
    allProducts: '全部商品',
    backToCatalog: '返回装备商城',
    officialStore: 'GLP 官方正品',
    ratings: '客户评分',
    sold: '已售出',
    report: '举报商品',
    inStock: '现货在库',
    stockPieces: '件',
    shipping: '配送服务',
    freeShipping: '全泰国免费极速配送',
    shippingTime: '预计 1-2 个工作日内送达上门',
    guarantee: '服务保障',
    guaranteeText: '3 年原厂联保与全国上门售后服务',
    selectColor: '选择颜色',
    selectSize: '选择规格 / 尺寸',
    quantity: '购买数量',
    addToCart: '加入购物车',
    addedToCart: '已加入购物车',
    buyNow: '立即购买',
    requestQuote: '申请官方报价单',
    view3D: '360° 3D 演示',
    viewPhotos: '查看实拍图片',
    share: '分享:',
    favorite: '收藏',
    vatIncluded: '含 7% 增值税（可开具正规发票）',
    specsTitle: '商品详细规格参数 (Specifications)',
    descTitle: '商品详细介绍 (Product Description)',
    featuresTitle: '核心卖点与功能特点:',
    relatedTitle: '精选推荐商品 (Related Products)',
    category: '商品分类',
    brand: '品牌',
    sku: '商品编号 (SKU)',
    dimensions: '外观尺寸',
    weight: '产品净重 / 承重',
    materials: '材质与用料',
    warranty: '质保期限',
    shipsFrom: '发货地',
    bangkok: '泰国曼谷仓储中心',
    chatNow: '在线咨询',
    quoteDoc: '官方报价',
    toastAdded: '已成功添加到购物车',
    toastSub: '购物车商品总数',
    toastContinue: '您可以继续挑选其他商品',
    fastDeliveryBadge: '全泰免邮',
    warrantyBadge: '3年质保',
    verifiedBadge: 'GLP 电竞认证'
  }
};

export default function ProductDetailPage({ 
  product, 
  onBack, 
  onSelectProduct, 
  onNavigateHome 
}) {
  const { siteData } = useSiteData();
  const allProducts = siteData?.equipmentProducts || EQUIPMENT_PRODUCTS;
  const { language = 'th' } = useTranslation();
  const text = I18N[language] || I18N.th;

  const { 
    addToCart, 
    setIsQuotationModalOpen, 
    setIsCartOpen,
    totalItemCount = 0 
  } = useCart();

  // Selection states
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState('gallery'); // 'gallery' | '3d'
  const [addedSuccess, setAddedSuccess] = useState(false);
  
  // Interactive UI states
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(196);
  const [copyToast, setCopyToast] = useState(false);
  const [cartToast, setCartToast] = useState(false);

  // Gallery images: use ONLY actual product images (real count, no fake fallback padding)
  const galleryImages = useMemo(() => {
    const list = [];
    if (product?.gallery && product.gallery.length > 0) {
      product.gallery.forEach(img => {
        if (img && !list.includes(img)) list.push(img);
      });
    } else if (product?.image) {
      list.push(product.image);
    }

    // Also include any unique variant images from colors
    if (product?.colors) {
      product.colors.forEach(c => {
        if (c.image && !list.includes(c.image)) {
          list.push(c.image);
        }
      });
    }

    if (list.length === 0) {
      list.push('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
    }

    return list;
  }, [product]);

  // Handle color selection and switch hero image to match color
  const handleSelectColor = (col, idx) => {
    setSelectedColor(col);
    const targetImg = col.image || product.gallery?.[idx] || product.image;
    if (targetImg) {
      const foundIdx = galleryImages.indexOf(targetImg);
      if (foundIdx !== -1) {
        setActivePhotoIdx(foundIdx);
      } else if (idx < galleryImages.length) {
        setActivePhotoIdx(idx);
      }
    }
  };

  // Handle size selection and switch hero image if size has an image or maps to a gallery photo
  const handleSelectSize = (sz, idx) => {
    setSelectedSize(sz);
    const targetImg = sz.image || (product.gallery && product.gallery[idx % product.gallery.length]);
    if (targetImg) {
      const foundIdx = galleryImages.indexOf(targetImg);
      if (foundIdx !== -1) {
        setActivePhotoIdx(foundIdx);
      } else if (idx < galleryImages.length) {
        setActivePhotoIdx(idx);
      }
    }
  };

  // Touch & Pointer gesture handling for mobile image swiping
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const currentDragOffsetRef = useRef(0);

  const handleTouchStart = (e) => {
    if (galleryImages.length <= 1) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isDraggingRef.current = true;
    currentDragOffsetRef.current = 0;
    setIsSwiping(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || galleryImages.length <= 1) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartXRef.current;
    const diffY = currentY - touchStartYRef.current;

    // Track horizontal swipe if horizontal movement is dominant
    if (Math.abs(diffX) > Math.abs(diffY)) {
      currentDragOffsetRef.current = diffX;
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsSwiping(false);

    const diffX = currentDragOffsetRef.current;
    const swipeThreshold = 45; // pixels to trigger image slide

    if (diffX < -swipeThreshold) {
      // Swiped LEFT -> Next Image
      setActivePhotoIdx(prev => (prev + 1) % galleryImages.length);
    } else if (diffX > swipeThreshold) {
      // Swiped RIGHT -> Previous Image
      setActivePhotoIdx(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
    }

    currentDragOffsetRef.current = 0;
    setDragOffset(0);
  };

  // Mouse Drag support for testing on desktop browser
  const handleMouseDown = (e) => {
    if (galleryImages.length <= 1) return;
    touchStartXRef.current = e.clientX;
    touchStartYRef.current = e.clientY;
    isDraggingRef.current = true;
    currentDragOffsetRef.current = 0;
    setIsSwiping(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || galleryImages.length <= 1) return;
    const diffX = e.clientX - touchStartXRef.current;
    currentDragOffsetRef.current = diffX;
    setDragOffset(diffX);
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    handleTouchEnd();
  };

  // Reset when product changes & manage body class for isolated mobile header/footer
  useEffect(() => {
    document.body.classList.add('in-shopee-pdp');
    if (product) {
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(product.sizes?.[0] || null);
      setQuantity(1);
      setActivePhotoIdx(0);
      setActiveMediaTab('gallery');
      setAddedSuccess(false);
      setCartToast(false);
      setFavoriteCount(product.reviewsCount ? product.reviewsCount + 68 : 196);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    return () => {
      document.body.classList.remove('in-shopee-pdp');
    };
  }, [product]);

  if (!product) return null;

  // Price calculations
  const extraPrice = selectedSize?.extraPrice || 0;
  const unitPrice = (product.price || 0) + extraPrice;
  const totalPrice = unitPrice * quantity;
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const originalDisplayPrice = product.originalPrice 
    ? (product.originalPrice + extraPrice)
    : null;

  // Prepare 3D Item Config
  const threeDItem = product.threeDConfig ? {
    ...product,
    deskColor: selectedColor?.hex || product.threeDConfig.deskColor || '#0f172a',
    chairColor: selectedColor?.hex || product.threeDConfig.chairColor || '#0f172a',
    accentColor: selectedColor?.hex === '#0f172a' ? '#1d4ed8' : (selectedColor?.hex || '#1d4ed8'),
    hasMonitor: product.threeDConfig.hasMonitor !== false,
    hasChair: product.threeDConfig.hasChair || product.category === 'chairs' || product.category === 'bundles'
  } : null;

  // 1. Handle Add to Cart (DOES NOT NAVIGATE OR OPEN CART - Allows adding multiple items!)
  const handleAddToCart = () => {
    addToCart(product, {
      color: selectedColor,
      size: selectedSize
    }, quantity, false); // shouldOpenCart = false

    setAddedSuccess(true);
    setCartToast(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setCartToast(false);
    }, 2500);
  };

  // 2. Handle Buy Now ("ซื้อทันที" - Bounces directly to checkout/payment page if user didn't just add to cart)
  const handleBuyNow = () => {
    // Add item to cart
    addToCart(product, {
      color: selectedColor,
      size: selectedSize
    }, quantity, false);

    // Direct navigation to checkout page!
    window.history.pushState(null, '', '/checkout');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleInstantQuotation = () => {
    addToCart(product, {
      color: selectedColor,
      size: selectedSize
    }, quantity, false);
    setIsQuotationModalOpen(true);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(prev => {
      const next = !prev;
      setFavoriteCount(c => next ? c + 1 : c - 1);
      return next;
    });
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2200);
    }
  };

  const handleOpenLiveChat = () => {
    const chatBtn = document.getElementById('btn-open-ai-chat');
    if (chatBtn) {
      chatBtn.click();
    } else {
      alert(language === 'zh' ? '客服人员已在线，随时为您服务。' : language === 'en' ? 'Customer service is ready 24/7.' : 'เจ้าหน้าที่ฝ่ายบริการลูกค้าพร้อมให้บริการ 24 ชม.');
    }
  };

  const categoryObj = PRODUCT_CATEGORIES.find(c => c.id === product.category);
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 6);

  return (
    <div className="shopee-pdp-root">
      {/* Floating Animated Cart Toast Notification */}
      {cartToast && (
        <div className="shopee-cart-toast-banner">
          <CheckCircle2 size={20} className="toast-icon" />
          <div className="toast-content">
            <strong>{text.toastAdded} (+{quantity})</strong>
            <span>{text.toastSub}: {totalItemCount + quantity} {text.stockPieces} • {text.toastContinue}</span>
          </div>
        </div>
      )}

      <div className="shopee-pdp-container">
        {/* ------------------------------------------------------------------
            DESKTOP BREADCRUMBS: Clean Semantic Path
            ------------------------------------------------------------------ */}
        <div className="shopee-breadcrumb-bar">
          <div className="shopee-breadcrumb-list">
            <button className="shopee-back-pill-btn" onClick={onBack}>
              <ArrowLeft size={13} />
              <span>{text.backToCatalog}</span>
            </button>
            <div className="shopee-breadcrumb-item">
              <span className="shopee-crumb-link" onClick={onNavigateHome}>{text.home}</span>
              <ChevronRight size={11} className="shopee-crumb-sep" />
            </div>
            <div className="shopee-breadcrumb-item">
              <span className="shopee-crumb-link" onClick={onBack}>Gspeed Living Plus</span>
              <ChevronRight size={11} className="shopee-crumb-sep" />
            </div>
            {categoryObj && (
              <div className="shopee-breadcrumb-item">
                <span className="shopee-crumb-link" onClick={onBack}>{categoryObj.name}</span>
                <ChevronRight size={11} className="shopee-crumb-sep" />
              </div>
            )}
            <div className="shopee-breadcrumb-item">
              <span className="shopee-crumb-current">{product.name}</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            MAIN SHOWCASE CARD: White Container (Desktop & Mobile)
            ------------------------------------------------------------------ */}
        <div className="shopee-showcase-card">
          {/* ==================== LEFT COLUMN: MEDIA ==================== */}
          <div className="shopee-media-column">
            {/* Main Photo Box with Touch & Mouse Swipe Gestures */}
            <div 
              className="shopee-main-photo-wrapper"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Slide Track for all Gallery Photos */}
              <div 
                className="shopee-photo-slide-track"
                style={{
                  transform: isSwiping && dragOffset !== 0
                    ? `translateX(calc(-${activePhotoIdx * 100}% + ${dragOffset}px))`
                    : `translateX(-${activePhotoIdx * 100}%)`,
                  transition: isSwiping ? 'none' : 'transform 0.32s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              >
                {galleryImages.map((img, idx) => (
                  <div key={idx} className="shopee-photo-slide-item">
                    <img 
                      src={img} 
                      alt={`${product.name} - รูปที่ ${idx + 1}`} 
                      className="shopee-main-photo-img"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>

              {/* Left & Right Nav Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button 
                    type="button" 
                    className="shopee-photo-nav-arrow prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIdx(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
                    }}
                    aria-label="รูปก่อนหน้า"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button 
                    type="button" 
                    className="shopee-photo-nav-arrow next"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIdx(prev => (prev + 1) % galleryImages.length);
                    }}
                    aria-label="รูปถัดไป"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {/* Mobile Page Indicator */}
              <div className="shopee-mobile-page-counter">
                {activePhotoIdx + 1}/{galleryImages.length}
              </div>

              {/* Promotional Bottom Ribbon with Brand Badges */}
              <div className="shopee-photo-promo-ribbon">
                <div className="shopee-ribbon-tag-free-ship">
                  <span className="free-ship-badge">FREE</span>
                  <span>{text.fastDeliveryBadge}</span>
                </div>
                <div className="shopee-ribbon-tag-discount">
                  <ShieldCheck size={14} />
                  <span>{text.warrantyBadge}</span>
                </div>
                <div className="shopee-ribbon-tag-spec">
                  <span>{text.verifiedBadge}</span>
                </div>
              </div>
            </div>

            {/* Desktop Thumbnails Filmstrip Carousel (5 Items) */}
            <div className="shopee-thumbnails-carousel">
              <button 
                type="button" 
                className="shopee-thumb-arrow-btn"
                onClick={() => setActivePhotoIdx(prev => (prev - 1 + galleryImages.length) % galleryImages.length)}
                aria-label="เลื่อนรูปซ้าย"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="shopee-thumbs-track">
                {galleryImages.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`shopee-thumb-card ${activePhotoIdx === idx && activeMediaTab === 'gallery' ? 'active' : ''}`}
                    onClick={() => {
                      setActivePhotoIdx(idx);
                      setActiveMediaTab('gallery');
                    }}
                    onMouseEnter={() => {
                      setActivePhotoIdx(idx);
                      setActiveMediaTab('gallery');
                    }}
                  >
                    <img src={img} alt={`มุมมอง ${idx + 1}`} />
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                className="shopee-thumb-arrow-btn"
                onClick={() => setActivePhotoIdx(prev => (prev + 1) % galleryImages.length)}
                aria-label="เลื่อนรูปขวา"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Desktop Social Share & Favorite Strip */}
            <div className="shopee-social-actions-bar">
              <div className="shopee-share-left">
                <span className="shopee-share-label">{text.share}</span>
                <button 
                  type="button" 
                  className="shopee-social-icon-btn messenger"
                  title="Messenger"
                  onClick={handleCopyLink}
                >
                  <MessageCircle size={15} />
                </button>
                <button 
                  type="button" 
                  className="shopee-social-icon-btn facebook"
                  title="Facebook"
                  onClick={handleCopyLink}
                >
                  <span style={{ fontWeight: 900, fontSize: '13px' }}>f</span>
                </button>
                <button 
                  type="button" 
                  className="shopee-social-icon-btn pinterest"
                  title="Pinterest"
                  onClick={handleCopyLink}
                >
                  <span style={{ fontWeight: 900, fontSize: '13px' }}>P</span>
                </button>
                <button 
                  type="button" 
                  className="shopee-social-icon-btn twitter"
                  title="X (Twitter)"
                  onClick={handleCopyLink}
                >
                  <span style={{ fontWeight: 900, fontSize: '13px' }}>𝕏</span>
                </button>
                <button 
                  type="button" 
                  className="shopee-social-icon-btn copy"
                  title={text.copyLink || 'Copy Link'}
                  onClick={handleCopyLink}
                >
                  <Copy size={13} />
                </button>
              </div>

              <div className="shopee-social-divider" />

              <button 
                type="button" 
                className={`shopee-favorite-btn ${isFavorite ? 'is-fav' : ''}`}
                onClick={handleToggleFavorite}
                title="Favorite"
              >
                <Heart size={18} className="fav-icon" />
                <span>{text.favorite} ({favoriteCount})</span>
              </button>
            </div>

            {/* Copy Link Toast */}
            {copyToast && (
              <div className="shopee-copy-toast">
                ✓ {language === 'zh' ? '已成功复制商品链接' : language === 'en' ? 'Product link copied!' : 'คัดลอกลิงก์สินค้าเรียบร้อยแล้ว'}
              </div>
            )}
          </div>

          {/* ==================== RIGHT COLUMN: DETAILS ==================== */}
          <div className="shopee-details-column">
            {/* Mobile Variations Horizontal Scroll Strip */}
            <div className="shopee-mobile-vars-strip">
              <div className="shopee-mobile-vars-title">
                {product.colors?.length || 3} {text.selectColor}
              </div>
              <div className="shopee-mobile-vars-scroll">
                {product.colors && product.colors.map((col, idx) => (
                  <div 
                    key={col.id}
                    className={`shopee-mobile-var-item ${selectedColor?.id === col.id ? 'active' : ''}`}
                    onClick={() => handleSelectColor(col, idx)}
                    title={col.name}
                  >
                    <img 
                      src={col.image || product.gallery?.[idx] || product.image} 
                      alt={col.name} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Title Section (Official Badge + Name) */}
            <div className="shopee-title-container">
              <span className="shopee-preferred-badge">{text.officialStore}</span>
              <h1 className="shopee-product-headline">
                {product.name} {product.subtitle ? `• ${product.subtitle}` : ''}
              </h1>
            </div>

            {/* Ratings & Sold Statistics Row */}
            <div className="shopee-rating-stats-row">
              <div className="shopee-stat-group">
                <span className="shopee-score-text">{product.rating || '5.0'}</span>
                <div className="shopee-stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>

              <div className="shopee-stat-sep" />

              <div className="shopee-stat-group">
                <span className="shopee-ratings-count-text">{product.reviewsCount || 78}</span>
                <span className="shopee-stat-label-muted">{text.ratings}</span>
              </div>

              <div className="shopee-stat-sep" />

              <div className="shopee-stat-group">
                <span className="shopee-sold-count-text">{product.reviewsCount ? product.reviewsCount * 5 : '640'}</span>
                <span className="shopee-stat-label-muted">{text.sold}</span>
              </div>

              <button type="button" className="shopee-report-btn">
                {text.report}
              </button>
            </div>

            {/* Price Highlight Banner (Clean GLP Brand Colors, No Vouchers) */}
            <div className="shopee-price-banner">
              {originalDisplayPrice && (
                <div className="shopee-strike-price">
                  ฿{originalDisplayPrice.toLocaleString()}
                </div>
              )}
              <div className="shopee-current-price-val">
                ฿{unitPrice.toLocaleString()}.-
              </div>
              {discountPercent > 0 && (
                <span className="shopee-discount-chip">-{discountPercent}%</span>
              )}
              <div className="shopee-vat-note-tag">
                <Check size={14} />
                <span>{text.vatIncluded}</span>
              </div>
            </div>

            {/* Shipping Information Row */}
            <div className="shopee-form-row">
              <div className="shopee-form-label">{text.shipping}</div>
              <div className="shopee-form-content">
                <div className="shopee-shipping-info-block">
                  <div className="shopee-shipping-main-line">
                    <Truck size={17} className="truck-icon" />
                    <span>{text.freeShipping}</span>
                  </div>
                  <div className="shopee-shipping-sub-line">
                    {text.shippingTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Shopping Guarantee Row */}
            <div className="shopee-form-row">
              <div className="shopee-form-label">{text.guarantee}</div>
              <div className="shopee-form-content">
                <div className="shopee-guarantee-line">
                  <ShieldCheck size={18} className="shield-icon" />
                  <span>{text.guaranteeText}</span>
                  <ChevronDown size={14} color="#64748b" />
                </div>
              </div>
            </div>

            {/* Color Variations Section */}
            {product.colors && product.colors.length > 0 && (
              <div className="shopee-form-row">
                <div className="shopee-form-label">{text.selectColor}</div>
                <div className="shopee-form-content">
                  <div className="shopee-variations-grid">
                    {product.colors.map((col, idx) => {
                      const isSelected = selectedColor?.id === col.id;
                      const thumbImg = col.image || product.gallery?.[idx] || product.image;
                      return (
                        <button
                          key={col.id}
                          type="button"
                          className={`shopee-variation-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => handleSelectColor(col, idx)}
                        >
                          {thumbImg ? (
                            <img src={thumbImg} alt={col.name} className="shopee-var-thumb" />
                          ) : (
                            <span 
                              className="shopee-var-color-dot" 
                              style={{ backgroundColor: col.hex }} 
                            />
                          )}
                          <span>{col.name}</span>
                          {isSelected && <span className="shopee-var-corner-tick" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Size / Specs Options Section */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="shopee-form-row">
                <div className="shopee-form-label">{text.selectSize}</div>
                <div className="shopee-form-content">
                  <div className="shopee-sizes-row">
                    {product.sizes.map((sz, idx) => {
                      const isSelected = selectedSize?.id === sz.id;
                      return (
                        <button
                          key={sz.id}
                          type="button"
                          className={`shopee-size-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => handleSelectSize(sz, idx)}
                        >
                          <span>{sz.name}</span>
                          {sz.extraPrice > 0 && (
                            <span className="shopee-extra-price-tag">+฿{sz.extraPrice.toLocaleString()}</span>
                          )}
                          {isSelected && <span className="shopee-var-corner-tick" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Stepper Row */}
            <div className="shopee-form-row">
              <div className="shopee-form-label">{text.quantity}</div>
              <div className="shopee-form-content" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="shopee-qty-stepper-box">
                  <button 
                    type="button" 
                    className="shopee-qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="ลดจำนวน"
                  >
                    <Minus size={14} />
                  </button>
                  <input 
                    type="text" 
                    readOnly 
                    value={quantity} 
                    className="shopee-qty-input" 
                  />
                  <button 
                    type="button" 
                    className="shopee-qty-btn"
                    onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                    aria-label="เพิ่มจำนวน"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="shopee-stock-counter-text">
                  {text.inStock} ({product.stock || 50} {text.stockPieces})
                </span>
              </div>
            </div>

            {/* Desktop Action Buttons Row */}
            <div className="shopee-action-buttons-strip">
              {/* 1. Add to Cart Button (Adds to cart without navigating to checkout) */}
              <button 
                id="btn-shopee-add-to-cart"
                type="button"
                className={`shopee-btn-add-to-cart ${addedSuccess ? 'success' : ''}`}
                onClick={handleAddToCart}
                title="กดเพื่อเพิ่มสินค้านี้ลงในตะกร้า"
              >
                {addedSuccess ? (
                  <>
                    <CheckCircle2 size={19} />
                    <span>{text.addedToCart} (+{quantity})</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={19} />
                    <span>{text.addToCart}</span>
                  </>
                )}
              </button>

              {/* 2. Buy Now Button ("ซื้อทันที" - Bounces directly to checkout/payment page) */}
              <button 
                id="btn-shopee-buy-now"
                type="button"
                className="shopee-btn-buy-now"
                onClick={handleBuyNow}
                title="กดเพื่อสั่งซื้อและไปที่หน้าชำระเงินทันที"
              >
                <span>{text.buyNow} ฿{totalPrice.toLocaleString()}.-</span>
              </button>

              {/* 3. B2B Quotation Button */}
              <button 
                type="button" 
                className="shopee-btn-quote-b2b"
                onClick={handleInstantQuotation}
                title="ออกใบเสนอราคาทางการพร้อมส่วนลดพิเศษ B2B"
              >
                <FileText size={16} />
                <span>{text.requestQuote}</span>
              </button>
            </div>

            {/* Desktop Trust & Guarantee Strip */}
            <div className="shopee-guarantee-bar">
              <div className="shopee-guarantee-item">
                <ShieldCheck size={18} className="item-icon" />
                <span>{text.guaranteeText}</span>
              </div>
              <div className="shopee-guarantee-item">
                <Check size={16} className="item-icon" />
                <span>{language === 'zh' ? '100% 官方原厂正品' : language === 'en' ? '100% Authentic Products' : 'ของแท้ศูนย์ 100%'}</span>
              </div>
              <div className="shopee-guarantee-item">
                <Truck size={17} className="item-icon" />
                <span>{text.freeShipping}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            SPECIFICATIONS & DETAILS CARD (Store profile removed per request!)
            ------------------------------------------------------------------ */}
        <div className="shopee-details-tab-card">
          <h2 className="shopee-card-heading">{text.specsTitle}</h2>
          <div className="shopee-specs-list">
            <div className="shopee-spec-row">
              <span className="shopee-spec-label">{text.category}</span>
              <span className="shopee-spec-val" style={{ color: '#1d4ed8', fontWeight: 600 }}>
                {categoryObj?.name || (language === 'zh' ? '电竞桌与人体工学椅' : language === 'en' ? 'Gaming Desks & Chairs' : 'โต๊ะและเก้าอี้เกมมิ่ง')}
              </span>
            </div>
            <div className="shopee-spec-row">
              <span className="shopee-spec-label">{text.brand}</span>
              <span className="shopee-spec-val">Gspeed Living Plus (GLP)</span>
            </div>
            <div className="shopee-spec-row">
              <span className="shopee-spec-label">{text.sku}</span>
              <span className="shopee-spec-val" style={{ fontFamily: 'monospace' }}>{product.sku}</span>
            </div>
            {product.dimensions && (
              <div className="shopee-spec-row">
                <span className="shopee-spec-label">{text.dimensions}</span>
                <span className="shopee-spec-val">{product.dimensions}</span>
              </div>
            )}
            {product.weight && (
              <div className="shopee-spec-row">
                <span className="shopee-spec-label">{text.weight}</span>
                <span className="shopee-spec-val">{product.weight}</span>
              </div>
            )}
            {product.materials && (
              <div className="shopee-spec-row">
                <span className="shopee-spec-label">{text.materials}</span>
                <span className="shopee-spec-val">{product.materials}</span>
              </div>
            )}
            {product.warranty && (
              <div className="shopee-spec-row">
                <span className="shopee-spec-label">{text.warranty}</span>
                <span className="shopee-spec-val">{product.warranty} (On-site Service)</span>
              </div>
            )}
            <div className="shopee-spec-row">
              <span className="shopee-spec-label">{text.shipsFrom}</span>
              <span className="shopee-spec-val">{text.bangkok}</span>
            </div>
          </div>

          <h2 className="shopee-card-heading" style={{ marginTop: '28px' }}>
            {text.descTitle}
          </h2>
          <div className="shopee-description-prose">
            <p>
              <strong>{product.name}</strong> - {product.subtitle}
            </p>
            <p>
              {language === 'zh'
                ? '高品质专业电竞及办公设备，专为高强度使用场景打造，满足职业电竞选手、网咖连锁及现代化企业对于人体工学与耐用性的严苛要求。'
                : language === 'en'
                  ? 'High-performance equipment designed for intense esports training, modern cybercafes, and ergonomic offices.'
                  : 'อุปกรณ์คุณภาพสูง ออกแบบมาเพื่อรองรับการใช้งานอย่างหนักหน่วง ทั้งสำหรับนักกีฬาอีสปอร์ตระดับอาชีพ ร้านอินเทอร์เน็ตคาเฟ่ และสำนักงานยุคใหม่ที่ใส่ใจเรื่องสุขภาพการนั่งทำงาน (Ergonomics)'}
            </p>

            {product.features && product.features.length > 0 && (
              <>
                <h4 style={{ margin: '14px 0 8px 0', fontSize: '15px' }}>{text.featuresTitle}</h4>
                <ul className="shopee-features-bullets">
                  {product.features.map((feat, i) => (
                    <li key={i}>
                      <Check size={16} className="check-icon" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p style={{ marginTop: '14px', color: '#64748b', fontSize: '13px' }}>
              ✓ {text.vatIncluded}<br />
              ✓ {language === 'zh' ? '全泰国免费配送并提供上门组装服务。' : language === 'en' ? 'Free nationwide delivery and on-site assembly service available.' : 'บริการจัดส่งและประกอบติดตั้งหน้างานฟรีทั่วประเทศเมื่อสั่งซื้อตามเงื่อนไขโครงการ'}
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            RELATED PRODUCTS
            ------------------------------------------------------------------ */}
        {relatedProducts.length > 0 && (
          <div className="shopee-related-section">
            <h2 className="shopee-related-heading">{text.relatedTitle}</h2>
            <div className="shopee-products-grid">
              {relatedProducts.map(rel => (
                <div 
                  key={rel.id} 
                  className="shopee-product-card"
                  onClick={() => onSelectProduct(rel)}
                >
                  <div className="shopee-card-img-wrap">
                    <img src={rel.image} alt={rel.name} />
                  </div>
                  <div className="shopee-card-body">
                    <h3 className="shopee-card-title">{rel.name}</h3>
                    <div className="shopee-card-price-row">
                      <span className="shopee-card-price">฿{rel.price.toLocaleString()}</span>
                      <span className="shopee-card-sold">{text.sold} {rel.reviewsCount || 42} {text.stockPieces}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------
          MOBILE FIXED BOTTOM ACTION BAR: GLP Theme Colors
          ------------------------------------------------------------------ */}
      <div className="shopee-mobile-bottom-bar">
        <button 
          type="button" 
          className="shopee-mobile-bar-icon-btn quote"
          onClick={handleInstantQuotation}
        >
          <FileText size={18} />
          <span>{text.quoteDoc}</span>
        </button>

        {/* Mobile: "+ เพิ่มไปยังรถเข็น" - adds to cart without navigating */}
        <button 
          type="button" 
          className={`shopee-mobile-bar-cart-btn ${addedSuccess ? 'success' : ''}`}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={17} />
          <span>{addedSuccess ? `+${quantity} ${text.addedToCart}` : text.addToCart}</span>
        </button>

        {/* Mobile: "ซื้อทันที" - bounces directly to payment/checkout page! */}
        <button 
          type="button" 
          className="shopee-mobile-bar-buy-btn"
          onClick={handleBuyNow}
        >
          <span className="btn-sub">{text.buyNow}</span>
          <span className="btn-price">฿{totalPrice.toLocaleString()}.-</span>
        </button>
      </div>
    </div>
  );
}
