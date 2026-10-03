import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, ShoppingCart, FileText, Check, 
  Star, ShieldCheck, Truck, RotateCw, Eye, Percent, 
  Plus, Minus, Box, Share2, Layers, Award
} from 'lucide-react';
import { EQUIPMENT_PRODUCTS, PRODUCT_CATEGORIES } from '../../data/equipmentProducts';
import { useCart } from '../../context/CartContext';
import { useSiteData } from '../../context/SiteDataContext';
import ThreeProductViewer from '../ThreeProductViewer';

export default function ProductDetailPage({ 
  product, 
  onBack, 
  onSelectProduct, 
  onNavigateHome 
}) {
  const { siteData } = useSiteData();
  const allProducts = siteData?.equipmentProducts || EQUIPMENT_PRODUCTS;
  const { addToCart, setIsQuotationModalOpen, setIsCartOpen } = useCart();

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isAutoSlidePaused, setIsAutoSlidePaused] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState('gallery'); // 'gallery' | '3d'
  const [addedSuccess, setAddedSuccess] = useState(false);

  const galleryImages = (product?.gallery && product.gallery.length > 0) 
    ? product.gallery 
    : (product?.image ? [product.image] : []);

  // Auto-slide gallery photos every 3.5 seconds (pauses on user hover/touch)
  useEffect(() => {
    if (activeMediaTab !== 'gallery' || galleryImages.length <= 1 || isAutoSlidePaused) {
      return;
    }
    const timer = setInterval(() => {
      setActivePhotoIdx(prev => (prev + 1) % galleryImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [activeMediaTab, galleryImages.length, isAutoSlidePaused]);

  // Reset when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(product.sizes?.[0] || null);
      setQuantity(1);
      setActivePhotoIdx(0);
      setActiveMediaTab('gallery');
      setAddedSuccess(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [product?.id]);

  if (!product) return null;

  const extraPrice = selectedSize?.extraPrice || 0;
  const unitPrice = (product.price || 0) + extraPrice;
  const totalPrice = unitPrice * quantity;
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Prepare 3D Item Config
  const threeDItem = product.threeDConfig ? {
    ...product,
    deskColor: selectedColor?.hex || product.threeDConfig.deskColor || '#0f172a',
    chairColor: selectedColor?.hex || product.threeDConfig.chairColor || '#0f172a',
    accentColor: selectedColor?.hex === '#0f172a' ? '#1d4ed8' : (selectedColor?.hex || '#1d4ed8'),
    hasMonitor: product.threeDConfig.hasMonitor !== false,
    hasChair: product.threeDConfig.hasChair || product.category === 'chairs' || product.category === 'bundles'
  } : null;

  const handleAddToCart = () => {
    addToCart(product, {
      color: selectedColor,
      size: selectedSize
    }, quantity);

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2000);
  };

  const handleInstantQuotation = () => {
    addToCart(product, {
      color: selectedColor,
      size: selectedSize
    }, quantity);
    setIsQuotationModalOpen(true);
  };

  const categoryObj = PRODUCT_CATEGORIES.find(c => c.id === product.category);
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.category === 'accessories'))
    .slice(0, 4);

  return (
    <div className="product-detail-page-wrapper">
      {/* 1. Breadcrumb Bar */}
      <div className="pdp-breadcrumb-bar">
        <div className="container">
          <div className="pdp-breadcrumb-row">
            <button className="pdp-back-button" onClick={onBack}>
              <ArrowLeft size={16} />
              <span>ย้อนกลับไปหน้ารวมสินค้า</span>
            </button>
            <div className="pdp-breadcrumb-path">
              <span className="pdp-crumb-link" onClick={onNavigateHome}>หน้าแรก</span>
              <ChevronRight size={13} className="pdp-crumb-sep" />
              <span className="pdp-crumb-link" onClick={onBack}>สินค้าทั้งหมด</span>
              {categoryObj && (
                <>
                  <ChevronRight size={13} className="pdp-crumb-sep" />
                  <span className="pdp-crumb-link" onClick={onBack}>{categoryObj.name}</span>
                </>
              )}
              <ChevronRight size={13} className="pdp-crumb-sep" />
              <span className="pdp-crumb-current">{product.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container pdp-main-container">
        {/* 2. Top Product Showcase Area (Grid: Left Media, Right Purchase Form) */}
        <div className="pdp-showcase-grid">
          {/* LEFT: Product Media (Photos & 3D Viewer) */}
          <div className="pdp-media-column">
            {/* Mode Switcher (Gallery vs 3D) */}
            {product.threeDConfig && (
              <div className="pdp-media-mode-tabs">
                <button 
                  className={`pdp-mode-tab-btn ${activeMediaTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => setActiveMediaTab('gallery')}
                >
                  <Eye size={15} />
                  <span>รูปถ่ายสินค้าจริง ({product.gallery?.length || 1})</span>
                </button>
                <button 
                  className={`pdp-mode-tab-btn ${activeMediaTab === '3d' ? 'active' : ''}`}
                  onClick={() => setActiveMediaTab('3d')}
                >
                  <RotateCw size={15} className={activeMediaTab === '3d' ? 'spin-slow' : ''} />
                  <span>หมุนดูโมเดล 3D แบบ 360°</span>
                </button>
              </div>
            )}

            {/* Media Canvas Box */}
            <div className="pdp-main-media-box">
              {activeMediaTab === '3d' && product.threeDConfig ? (
                <div className="pdp-three-d-container">
                  <ThreeProductViewer 
                    item={threeDItem}
                    autoRotateDefault={true}
                    height="450px"
                    showControls={true}
                  />
                  <div className="pdp-three-d-hint">
                    💡 คลิกค้างแล้วลากเมาส์เพื่อหมุนดูรอบทิศทาง 360° • เลือกสีด้านขวาเพื่อเปลี่ยนสีโมเดลสดๆ
                  </div>
                </div>
              ) : (
                <div 
                  className="pdp-photo-display-wrap"
                  onMouseEnter={() => setIsAutoSlidePaused(true)}
                  onMouseLeave={() => setIsAutoSlidePaused(false)}
                  onTouchStart={() => setIsAutoSlidePaused(true)}
                  onTouchEnd={() => setIsAutoSlidePaused(false)}
                >
                  <img 
                    src={galleryImages[activePhotoIdx] || product.image} 
                    alt={product.name}
                    className="pdp-active-photo"
                  />
                  {discountPercent > 0 && (
                    <span className="pdp-discount-corner">
                      ลดทันที {discountPercent}%
                    </span>
                  )}

                  {/* Previous / Next Arrow Controls */}
                  {galleryImages.length > 1 && (
                    <>
                      <button 
                        type="button" 
                        className="pdp-slide-arrow prev" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIdx(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
                        }}
                        aria-label="Previous photo"
                        title="ดูภาพก่อนหน้า"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        type="button" 
                        className="pdp-slide-arrow next" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIdx(prev => (prev + 1) % galleryImages.length);
                        }}
                        aria-label="Next photo"
                        title="ดูภาพถัดไป"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Dot Indicators */}
                      <div className="pdp-slide-indicators">
                        {galleryImages.map((_, i) => (
                          <span 
                            key={i} 
                            className={`pdp-indicator-dot ${activePhotoIdx === i ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePhotoIdx(i);
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail Filmstrip */}
            {activeMediaTab === 'gallery' && galleryImages.length > 1 && (
              <div className="pdp-thumbnails-strip">
                {galleryImages.map((imgUrl, idx) => (
                  <div 
                    key={idx}
                    className={`pdp-thumb-item ${activePhotoIdx === idx ? 'active' : ''}`}
                    onClick={() => setActivePhotoIdx(idx)}
                  >
                    <img src={imgUrl} alt={`${product.name} view ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Trust Badges Strip */}
            <div className="pdp-trust-badges-grid">
              <div className="pdp-trust-item">
                <ShieldCheck size={20} className="text-blue" />
                <div>
                  <strong>{product.warranty || 'รับประกัน 3 ปี'}</strong>
                  <p>On-site Service ทั่วประเทศ</p>
                </div>
              </div>
              <div className="pdp-trust-item">
                <Truck size={20} className="text-emerald" />
                <div>
                  <strong>จัดส่งด่วนทั่วไทย</strong>
                  <p>{product.leadTime || 'พร้อมส่งใน 1-2 วันทำการ'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details & Purchase Controls */}
          <div className="pdp-details-column">
            {/* Meta Line: Category, SKU, Stock */}
            <div className="pdp-meta-tags-line">
              <span className="pdp-category-pill">
                {categoryObj?.name || 'สินค้าทั่วไป'}
              </span>
              <span className="pdp-sku-code">รหัสสินค้า: {product.sku}</span>
              <span className="pdp-stock-status in-stock">
                <Check size={13} /> มีสินค้าพร้อมส่ง ({product.stock || 50} ชิ้น)
              </span>
            </div>

            {/* Product Title & Subtitle */}
            <h1 className="pdp-product-title">{product.name}</h1>
            <p className="pdp-product-subtitle">{product.subtitle}</p>

            {/* Rating Bar */}
            <div className="pdp-rating-strip">
              <div className="pdp-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="pdp-score">{product.rating}</span>
              <span className="pdp-reviews-count">({product.reviewsCount} รีวิวจากผู้ใช้จริง)</span>
            </div>

            {/* Price Box */}
            <div className="pdp-price-card">
              <div className="pdp-price-row">
                <div className="pdp-current-price">
                  ฿{unitPrice.toLocaleString()}.-
                </div>
                {product.originalPrice && (
                  <div className="pdp-strike-price">
                    ฿{product.originalPrice.toLocaleString()}.-
                  </div>
                )}
                {product.originalPrice && (
                  <span className="pdp-save-badge">
                    ประหยัด ฿{(product.originalPrice - unitPrice).toLocaleString()}.-
                  </span>
                )}
              </div>
              <div className="pdp-vat-badge">
                ✓ ราคาสินค้ารวมภาษีมูลค่าเพิ่ม 7% เรียบร้อยแล้ว (สามารถออกใบกำกับภาษีได้)
              </div>
            </div>

            {/* Color Option Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="pdp-option-section">
                <div className="pdp-option-header">
                  <span className="pdp-opt-title">เลือกสี:</span>
                  <span className="pdp-opt-selected-val">{selectedColor?.name}</span>
                </div>
                <div className="pdp-color-options-row">
                  {product.colors.map(col => (
                    <button
                      key={col.id}
                      className={`pdp-color-chip ${selectedColor?.id === col.id ? 'active' : ''}`}
                      onClick={() => setSelectedColor(col)}
                    >
                      <span 
                        className="pdp-color-dot" 
                        style={{ backgroundColor: col.hex }} 
                      />
                      <span>{col.name}</span>
                      {selectedColor?.id === col.id && <Check size={13} className="check-icon" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size / Option Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="pdp-option-section">
                <div className="pdp-option-header">
                  <span className="pdp-opt-title">เลือกขนาด / ออปชัน:</span>
                  <span className="pdp-opt-selected-val">{selectedSize?.name}</span>
                </div>
                <div className="pdp-size-options-row">
                  {product.sizes.map(sz => (
                    <button
                      key={sz.id}
                      className={`pdp-size-chip ${selectedSize?.id === sz.id ? 'active' : ''}`}
                      onClick={() => setSelectedSize(sz)}
                    >
                      <span>{sz.name}</span>
                      {sz.extraPrice > 0 && (
                        <span className="pdp-extra-price-tag">+฿{sz.extraPrice.toLocaleString()}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper (จัดเรียงสวยงาม มีปุ่ม + - ชัดเจน และปุ่มลัด) */}
            <div className="pdp-quantity-section">
              <div className="pdp-quantity-header-row">
                <span className="pdp-opt-title">ระบุจำนวนที่ต้องการ:</span>
                <span className="pdp-stock-in-hand">คงเหลือในสต็อก {product.stock || 50} ชิ้น</span>
              </div>

              <div className="pdp-stepper-control-row">
                <div className="pdp-stepper-box">
                  <button 
                    className="pdp-stepper-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="ลดจำนวน"
                    title="ลดจำนวน"
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    type="text" 
                    readOnly 
                    value={quantity} 
                    className="pdp-stepper-input" 
                  />
                  <button 
                    className="pdp-stepper-btn pdp-stepper-plus"
                    onClick={() => setQuantity(q => Math.min(product.stock || 99, q + 1))}
                    aria-label="เพิ่มจำนวน"
                    title="เพิ่มจำนวน"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Quick Add Increment Pills */}
                <div className="pdp-quick-qty-pills">
                  {[1, 5, 10, 20].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      className={`pdp-qty-pill ${quantity === amt ? 'active' : ''}`}
                      onClick={() => setQuantity(amt)}
                    >
                      +{amt}
                    </button>
                  ))}
                </div>

                <div className="pdp-total-price-summary">
                  <span className="pdp-subtotal-label">ยอดรวมสินค้านี้:</span>
                  <strong className="pdp-subtotal-val">฿{totalPrice.toLocaleString()}.-</strong>
                </div>
              </div>
            </div>

            {/* Action Buttons (มีปุ่ม + สินค้าลงตะกร้าสวยๆ และขอใบเสนอราคาด่วน) */}
            <div className="pdp-action-buttons-group">
              <button 
                id="btn-pdp-add-to-cart"
                className={`btn-pdp-cart-primary ${addedSuccess ? 'is-success' : ''}`}
                onClick={handleAddToCart}
                title="กดเพื่อเพิ่มสินค้านี้ลงในตะกร้าสินค้า"
              >
                {addedSuccess ? (
                  <>
                    <Check size={20} className="pdp-btn-icon-pulse" />
                    <span>เพิ่มลงตะกร้าเรียบร้อยแล้ว ✓</span>
                  </>
                ) : (
                  <>
                    <div className="pdp-btn-plus-icon-circle">
                      <Plus size={16} strokeWidth={3} />
                    </div>
                    <ShoppingCart size={19} />
                    <span className="pdp-btn-text">เพิ่มลงตะกร้าสินค้า</span>
                    <span className="pdp-btn-subtotal-pill">฿{totalPrice.toLocaleString()}.-</span>
                  </>
                )}
              </button>
            </div>

            {/* B2B Corporate Offer Callout */}
            <div className="pdp-b2b-callout-card">
              <div className="b2b-callout-head">
                <Percent size={16} className="text-blue" />
                <strong>สิทธิพิเศษสำหรับร้านเกม สำนักงาน และโครงการ B2B:</strong>
              </div>
              <p>
                สั่งซื้อ 5-9 ตัว <strong>ลด 5%</strong> | 10-19 ตัว <strong>ลด 10%</strong> | 20+ ตัว <strong>ลด 15%</strong> ทันที 
                พร้อมบริการประกอบติดตั้งหน้างานและออกใบกำกับภาษีเต็มรูปแบบ
              </p>
            </div>
          </div>
        </div>

        {/* 3. Detailed Specifications Table & Key Features Section */}
        <div className="pdp-details-tabs-section">
          <h2 className="pdp-section-heading">ข้อมูลสเปกสินค้าและรายละเอียดเชิงลึก</h2>
          
          <div className="pdp-specs-grid">
            {/* Table of Specs */}
            <div className="pdp-specs-table-card">
              <h3 className="specs-card-title">
                <Box size={16} className="text-blue" />
                <span>ตารางข้อมูลจำเพาะ (Specifications)</span>
              </h3>
              <table className="pdp-specs-table">
                <tbody>
                  {product.dimensions && (
                    <tr>
                      <th>ขนาดสินค้า</th>
                      <td>{product.dimensions}</td>
                    </tr>
                  )}
                  {product.weight && (
                    <tr>
                      <th>น้ำหนัก / การรับน้ำหนัก</th>
                      <td>{product.weight}</td>
                    </tr>
                  )}
                  {product.materials && (
                    <tr>
                      <th>วัสดุและโครงสร้าง</th>
                      <td>{product.materials}</td>
                    </tr>
                  )}
                  {product.warranty && (
                    <tr>
                      <th>การรับประกันศูนย์</th>
                      <td>{product.warranty}</td>
                    </tr>
                  )}
                  {product.leadTime && (
                    <tr>
                      <th>ระยะเวลาจัดส่ง</th>
                      <td>{product.leadTime}</td>
                    </tr>
                  )}
                  <tr>
                    <th>มาตรฐานรองรับ</th>
                    <td>มาตรฐานสนามแข่งอีสปอร์ตระดับประเทศ (GLP Arena Verified)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Key Feature Highlights */}
            {product.features && product.features.length > 0 && (
              <div className="pdp-features-card">
                <h3 className="specs-card-title">
                  <Award size={16} className="text-blue" />
                  <span>จุดเด่นและฟังก์ชันการใช้งาน</span>
                </h3>
                <ul className="pdp-features-list">
                  {product.features.map((feat, idx) => (
                    <li key={idx}>
                      <Check size={16} className="feature-check-icon text-emerald" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 4. Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pdp-related-section">
            <h2 className="pdp-section-heading">สินค้าอื่นๆ ที่เกี่ยวข้องและแนะนำ</h2>
            <div className="products-ecommerce-grid">
              {relatedProducts.map(rel => (
                <div 
                  key={rel.id}
                  className="ecommerce-product-card"
                  onClick={() => onSelectProduct(rel)}
                >
                  <div className="card-top-tags">
                    <span className="tag-in-stock">
                      <Check size={11} /> มีสินค้าพร้อมส่ง
                    </span>
                    {rel.threeDConfig && (
                      <span className="tag-3d-feature">
                        <RotateCw size={11} /> 360° 3D
                      </span>
                    )}
                  </div>

                  <div className="card-img-wrap">
                    <img src={rel.image} alt={rel.name} className="product-clean-photo" />
                  </div>

                  <h3 className="card-product-name">{rel.name}</h3>
                  <p className="card-product-specs">{rel.subtitle}</p>

                  <div className="card-price-display">
                    <div className="price-primary-blue">
                      ฿{rel.price.toLocaleString()}.-
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
