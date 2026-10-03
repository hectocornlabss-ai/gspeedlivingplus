import React, { useState, useEffect } from 'react';
import { 
  X, Check, ShoppingCart, FileText, ShieldCheck, 
  Truck, Star, RotateCw, Box, Sparkles, Layers,
  ChevronRight, Info, Eye
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ThreeProductViewer from '../ThreeProductViewer';

export default function ProductDetailModal({ product, isOpen, onClose }) {
  const { addToCart, setIsQuotationModalOpen } = useCart();

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeMediaTab, setActiveMediaTab] = useState('gallery'); // 'gallery' by default! 3D is optional
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Initialize options when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(product.sizes?.[0] || null);
      setQuantity(1);
      setActivePhotoIdx(0);
      setActiveMediaTab('gallery'); // Default to static photo gallery
      setAddedSuccess(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const extraPrice = selectedSize?.extraPrice || 0;
  const unitPrice = (product.price || 0) + extraPrice;
  const totalPrice = unitPrice * quantity;

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
      onClose();
    }, 1200);
  };

  const handleInstantQuotation = () => {
    addToCart(product, {
      color: selectedColor,
      size: selectedSize
    }, quantity);
    onClose();
    setIsQuotationModalOpen(true);
  };

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <div 
        className="product-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="modal-close-icon-btn"
          onClick={onClose}
          aria-label="ปิดหน้าต่าง"
        >
          <X size={22} />
        </button>

        <div className="product-modal-grid">
          {/* Left Media Area: 3D Viewer or Photo Gallery */}
          <div className="modal-media-col">
            {/* Tab switch between Photos & 3D */}
            {product.threeDConfig && (
              <div className="media-mode-switch">
                <button 
                  className={`media-switch-btn ${activeMediaTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => setActiveMediaTab('gallery')}
                >
                  <Eye size={14} />
                  <span>รูปถ่ายสินค้าจริง ({product.gallery?.length || 1})</span>
                </button>
                <button 
                  className={`media-switch-btn ${activeMediaTab === '3d' ? 'active' : ''}`}
                  onClick={() => setActiveMediaTab('3d')}
                >
                  <RotateCw size={14} className={activeMediaTab === '3d' ? 'spin-slow' : ''} />
                  <span>ลองหมุนดู 3D (ทางเลือก)</span>
                </button>
              </div>
            )}

            {/* Media Content */}
            <div className="media-display-box">
              {activeMediaTab === '3d' && product.threeDConfig ? (
                <div className="three-d-viewer-wrapper">
                  <ThreeProductViewer 
                    item={threeDItem}
                    autoRotateDefault={true}
                    height="420px"
                    showControls={true}
                  />
                  <div className="three-d-hint-tag">
                    <span>💡 หมุนเมาส์เพื่อดูรอบทิศทาง 360° • เลือกสีเพื่อเปลี่ยนสีโมเดลสดๆ</span>
                  </div>
                </div>
              ) : (
                <div className="photo-gallery-wrapper">
                  <div className="main-active-photo">
                    <img 
                      src={product.gallery?.[activePhotoIdx] || product.image} 
                      alt={product.name}
                      className="large-preview-img" 
                    />
                  </div>
                  {product.gallery && product.gallery.length > 1 && (
                    <div className="thumbnails-filmstrip">
                      {product.gallery.map((imgUrl, idx) => (
                        <div 
                          key={idx}
                          className={`thumb-box ${activePhotoIdx === idx ? 'active' : ''}`}
                          onClick={() => setActivePhotoIdx(idx)}
                        >
                          <img src={imgUrl} alt={`view-${idx}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Trust Badges under Media */}
            <div className="modal-trust-cards">
              <div className="trust-card-pill">
                <ShieldCheck size={16} className="text-blue" />
                <span>{product.warranty}</span>
              </div>
              <div className="trust-card-pill">
                <Truck size={16} className="text-emerald" />
                <span>{product.leadTime}</span>
              </div>
            </div>
          </div>

          {/* Right Product Details & Configurator */}
          <div className="modal-details-col">
            {/* Category & SKU */}
            <div className="detail-meta-header">
              <span className="detail-category-badge">{product.category.toUpperCase()}</span>
              <span className="detail-sku">SKU: {product.sku}</span>
              <span className="detail-stock-badge">
                <Check size={12} /> มีสินค้าพร้อมส่ง ({product.stock} ชิ้น)
              </span>
            </div>

            {/* Product Title */}
            <h2 className="detail-product-title">{product.name}</h2>
            <p className="detail-product-subtitle">{product.subtitle}</p>

            {/* Rating */}
            <div className="detail-rating-row">
              <div className="stars-box">
                {'★'.repeat(5)}
              </div>
              <span className="rating-number">{product.rating}</span>
              <span className="reviews-text">({product.reviewsCount} รีวิวจากผู้ใช้จริง)</span>
            </div>

            {/* Price Box */}
            <div className="detail-price-box">
              <div className="price-main-display">
                <span className="currency-symbol">฿</span>
                <span className="price-amount">{unitPrice.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="price-crossed">
                    ฿{(product.originalPrice + extraPrice).toLocaleString()}
                  </span>
                )}
              </div>
              <div className="price-vat-tag">ราคารวมภาษีมูลค่าเพิ่ม 7% เรียบร้อยแล้ว</div>
            </div>

            {/* Color Option Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="option-section">
                <div className="option-label-line">
                  <span>เลือกสี:</span>
                  <strong>{selectedColor?.name || ''}</strong>
                </div>
                <div className="color-swatches-grid">
                  {product.colors.map(col => (
                    <button
                      key={col.id}
                      type="button"
                      className={`color-swatch-btn ${selectedColor?.id === col.id ? 'active' : ''}`}
                      onClick={() => setSelectedColor(col)}
                    >
                      <span 
                        className="color-chip"
                        style={{ backgroundColor: col.hex }} 
                      />
                      <span className="color-name">{col.name}</span>
                      {selectedColor?.id === col.id && (
                        <Check size={14} className="color-checked-icon" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size / Dimension Option Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="option-section">
                <div className="option-label-line">
                  <span>เลือกขนาด / ออปชัน:</span>
                  <strong>{selectedSize?.name || ''}</strong>
                </div>
                <div className="size-options-grid">
                  {product.sizes.map(sz => (
                    <button
                      key={sz.id}
                      type="button"
                      className={`size-option-pill ${selectedSize?.id === sz.id ? 'active' : ''}`}
                      onClick={() => setSelectedSize(sz)}
                    >
                      <span>{sz.name}</span>
                      {sz.extraPrice > 0 && (
                        <span className="extra-price-tag">+฿{sz.extraPrice.toLocaleString()}</span>
                      )}
                      {sz.extraPrice < 0 && (
                        <span className="extra-price-tag">-฿{Math.abs(sz.extraPrice).toLocaleString()}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Summary */}
            <div className="quantity-and-total-row">
              <div className="quantity-selector-box">
                <span className="qty-label">จำนวน:</span>
                <div className="qty-stepper">
                  <button 
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button 
                    type="button"
                    className="qty-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="detail-total-subtotal">
                <span className="total-label">ยอดรวมสินค้านี้:</span>
                <span className="total-number">฿{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Instant Quotation */}
            <div className="modal-cta-buttons">
              <button 
                id="btn-modal-add-cart"
                className={`btn-modal-primary ${addedSuccess ? 'success' : ''}`}
                onClick={handleAddToCart}
              >
                {addedSuccess ? (
                  <>
                    <Check size={18} />
                    <span>เพิ่มลงในตะกร้าแล้ว!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>ใส่ตะกร้าสินค้า (฿{totalPrice.toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>

            {/* Specifications Details Accordion / List */}
            <div className="product-spec-breakdown">
              <h4 className="spec-section-title">
                <Info size={15} /> ข้อมูลจำเพาะและสเปกวัสดุ
              </h4>
              <ul className="spec-list">
                {product.dimensions && (
                  <li>
                    <strong>ขนาด:</strong> <span>{product.dimensions}</span>
                  </li>
                )}
                {product.weight && (
                  <li>
                    <strong>น้ำหนัก / การรับน้ำหนัก:</strong> <span>{product.weight}</span>
                  </li>
                )}
                {product.materials && (
                  <li>
                    <strong>วัสดุและโครงสร้าง:</strong> <span>{product.materials}</span>
                  </li>
                )}
                {product.features && product.features.map((feat, i) => (
                  <li key={i} className="feature-item">
                    <Check size={13} className="text-emerald shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
