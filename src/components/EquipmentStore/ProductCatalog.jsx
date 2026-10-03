import React, { useState, useMemo } from 'react';
import { 
  Search, SlidersHorizontal, ShoppingCart, Eye, 
  FileText, Check, Star, ShieldCheck, 
  Box, RotateCw, ArrowRight, Tag, Percent, ChevronRight,
  Flame, Heart, Plus
} from 'lucide-react';
import { EQUIPMENT_PRODUCTS, PRODUCT_CATEGORIES } from '../../data/equipmentProducts';
import { useCart } from '../../context/CartContext';
import { useSiteData } from '../../context/SiteDataContext';

export default function ProductCatalog({ 
  selectedCategory, 
  onSelectCategory, 
  onOpenProductDetail,
  onNavigateHome
}) {
  const { siteData } = useSiteData();
  const rawProducts = siteData?.equipmentProducts || EQUIPMENT_PRODUCTS;
  const { addToCart, setIsQuotationModalOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'price-asc' | 'price-desc' | 'rating'
  const [addedFeedbackId, setAddedFeedbackId] = useState(null);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let list = [...rawProducts];

    // Category Filter
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.materials?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: popular
      list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    addToCart(product, {
      color: product.colors?.[0],
      size: product.sizes?.[0]
    }, 1);

    setAddedFeedbackId(product.id);
    setTimeout(() => setAddedFeedbackId(null), 1800);
  };

  const handleQuickQuote = (product, e) => {
    e.stopPropagation();
    addToCart(product, {
      color: product.colors?.[0],
      size: product.sizes?.[0]
    }, 1);
    setIsQuotationModalOpen(true);
  };

  const currentCategoryName = selectedCategory === 'all' 
    ? 'โต๊ะ เก้าอี้เกมมิ่ง และอุปกรณ์อื่นๆ' 
    : (PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'สินค้าทั้งหมด');

  return (
    <div className="equipment-catalog-page-wrapper">
      {/* 1. Breadcrumb Bar */}
      <div className="catalog-breadcrumb-bar">
        <div className="container">
          <div className="breadcrumb-items">
            <button 
              className="breadcrumb-link-btn"
              onClick={onNavigateHome}
            >
              หน้าแรก
            </button>
            <ChevronRight size={14} className="breadcrumb-sep-icon" />
            <button 
              className="breadcrumb-link-btn"
              onClick={() => onSelectCategory('all')}
            >
              สินค้าทั้งหมด
            </button>
            {selectedCategory !== 'all' && (
              <>
                <ChevronRight size={14} className="breadcrumb-sep-icon" />
                <span className="breadcrumb-current-text">{currentCategoryName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container catalog-main-container">
        {/* 2. Top Title & B2B Strip */}
        <div className="catalog-top-header">
          <div className="header-title-col">
            <h1 className="catalog-main-title">{currentCategoryName}</h1>
            <div className="catalog-meta-strip">
              <span className="meta-count-tag">
                ทั้งหมด <strong>{filteredProducts.length}</strong> รายการ
              </span>
              <span className="meta-divider">|</span>
              <span className="meta-vat-text">ราคาสินค้ารวมภาษีมูลค่าเพิ่ม 7% (ออกใบกำกับภาษีได้)</span>
            </div>
          </div>

          {/* B2B Volume Promotion Strip */}
          <div className="b2b-tier-strip">
            <div className="b2b-strip-badge">
              <Percent size={14} />
              <span>ราคาส่ง B2B</span>
            </div>
            <div className="b2b-strip-desc">
              สั่งซื้อ 5+ ชิ้น <strong>ลด 5%</strong> | 10+ ชิ้น <strong>ลด 10%</strong> | 20+ ชิ้น <strong>ลด 15%</strong> (ออกใบเสนอราคาและใบกำกับภาษีได้ทันทีเมื่อสั่งซื้อ)
            </div>
          </div>
        </div>

        {/* 3. Category Filter Tabs */}
        <div className="catalog-category-bar">
          <div className="category-tabs-scroll">
            {PRODUCT_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Search and Sort Filter Bar */}
        <div className="catalog-filter-controls">
          <div className="search-bar-box">
            <Search size={16} className="search-box-icon" />
            <input
              type="text"
              placeholder="ค้นหาชื่อสินค้า, สเปก, รหัสรุ่น..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-box-input"
            />
            {searchQuery && (
              <button 
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="sort-controls-box">
            <SlidersHorizontal size={14} className="sort-box-icon" />
            <span className="sort-label">การเรียงลำดับ:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-box-select"
            >
              <option value="popular">สินค้าแนะนำ / ยอดนิยม</option>
              <option value="price-asc">ราคา: ต่ำ ➔ สูง</option>
              <option value="price-desc">ราคา: สูง ➔ ต่ำ</option>
              <option value="rating">คะแนนรีวิวสูงสุด</option>
            </select>
          </div>
        </div>

        {/* 5. Products Grid (Clean White Cards matching Image 2) */}
        {filteredProducts.length === 0 ? (
          <div className="catalog-empty-state">
            <Box size={44} className="empty-icon text-slate-400" />
            <h3>ไม่พบสินค้าที่ตรงกับการค้นหา</h3>
            <p>ลองค้นหาด้วยคำอื่น หรือกดดูสินค้าทั้งหมด</p>
            <button 
              className="btn-show-all-products"
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
              }}
            >
              แสดงสินค้าทั้งหมด
            </button>
          </div>
        ) : (
          <div className="products-ecommerce-grid">
            {filteredProducts.map(product => {
              const discountPercent = product.originalPrice 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div 
                  key={product.id}
                  className="ecommerce-product-card"
                  onClick={() => onOpenProductDetail(product)}
                >
                  {/* Top Header Tags */}
                  <div className="card-top-tags">
                    <span className="tag-in-stock">
                      <Check size={11} /> มีสินค้าพร้อมส่ง
                    </span>
                    {product.threeDConfig && (
                      <span className="tag-3d-feature" title="สามารถหมุนดู 3D ได้ 360 องศา">
                        <RotateCw size={11} /> 360° 3D
                      </span>
                    )}
                  </div>

                  {/* Product Image Box */}
                  <div className="card-img-wrap">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-clean-photo" 
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80';
                      }}
                    />

                    {discountPercent > 0 && (
                      <span className="discount-corner-badge">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Product Title */}
                  <h3 className="card-product-name" title={product.name}>
                    {product.name}
                  </h3>

                  {/* Specs Summary (1-2 lines) */}
                  <p className="card-product-specs">
                    {product.subtitle}
                  </p>

                  {/* Online Promo Label */}
                  <div className="card-promo-label">
                    <span>โปรโมชั่นเฉพาะสั่งซื้อออนไลน์ • ส่งฟรีทั่วประเทศ</span>
                  </div>

                  {/* Pricing Display (GSPEED Royal Blue) */}
                  <div className="card-price-display">
                    <div className="price-primary-blue">
                      ฿{product.price.toLocaleString()}.-
                    </div>
                    {product.originalPrice && (
                      <div className="price-secondary-strike">
                        ฿{product.originalPrice.toLocaleString()}.-
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Meta (Quick Add to Cart) */}
                  <div className="card-bottom-actions">
                    <button 
                      id={`btn-quick-add-${product.id}`}
                      className={`btn-card-quick-add ${addedFeedbackId === product.id ? 'is-added' : ''}`}
                      onClick={(e) => handleQuickAdd(product, e)}
                      title="ใส่ตะกร้าทันที 1 ชิ้น"
                    >
                      <Plus size={15} />
                      <span>{addedFeedbackId === product.id ? 'ใส่ลงตะกร้าแล้ว ✓' : 'ใส่ตะกร้า'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
