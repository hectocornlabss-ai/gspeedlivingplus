import React, { useState, useMemo } from 'react';
import { 
  Search, SlidersHorizontal, ShoppingCart, Eye, 
  FileText, Check, Star, ShieldCheck, 
  Box, ArrowRight, Tag, ChevronRight,
  Flame, Heart, Plus
} from 'lucide-react';
import { EQUIPMENT_PRODUCTS, PRODUCT_CATEGORIES } from '../../data/equipmentProducts';
import { useCart } from '../../context/CartContext';
import { useSiteData } from '../../context/SiteDataContext';
import { useTranslation } from '../../context/LanguageContext';

// Multilingual Dictionary (Thai, English, Chinese)
const I18N = {
  th: {
    home: 'หน้าแรก',
    allProducts: 'สินค้าทั้งหมด',
    allCategoryTitle: 'โต๊ะ เก้าอี้เกมมิ่ง และอุปกรณ์อื่นๆ',
    totalItems: 'ทั้งหมด',
    itemsUnit: 'รายการ',
    vatIncluded: 'ราคาสินค้ารวมภาษีมูลค่าเพิ่ม 7% (ออกใบกำกับภาษีได้)',
    searchPlaceholder: 'ค้นหาชื่อสินค้า, สเปก, รหัสรุ่น...',
    sortByLabel: 'การเรียงลำดับ:',
    sortPopular: 'สินค้าแนะนำ / ยอดนิยม',
    sortPriceAsc: 'ราคา: ต่ำ ➔ สูง',
    sortPriceDesc: 'ราคา: สูง ➔ ต่ำ',
    sortRating: 'คะแนนรีวิวสูงสุด',
    emptyTitle: 'ไม่พบสินค้าที่ตรงกับการค้นหา',
    emptyDesc: 'ลองค้นหาด้วยคำอื่น หรือกดดูสินค้าทั้งหมด',
    btnShowAll: 'แสดงสินค้าทั้งหมด',
    inStock: 'มีสินค้าพร้อมส่ง',
    onlinePromo: 'โปรโมชั่นเฉพาะสั่งซื้อออนไลน์ • ส่งฟรีทั่วประเทศ',
    addToCart: 'ใส่ตะกร้า',
    addedToCart: 'ใส่ลงตะกร้าแล้ว ✓',
    categories: {
      all: 'สินค้าทั้งหมด',
      desks: 'โต๊ะเกมมิ่ง & โต๊ะทำงาน',
      chairs: 'เก้าอี้เกมมิ่ง & Ergonomic',
      accessories: 'อุปกรณ์เสริม & รางสายไฟ',
      bundles: 'เซ็ตสุดคุ้ม (Bundle)'
    }
  },
  en: {
    home: 'Home',
    allProducts: 'All Products',
    allCategoryTitle: 'Gaming Desks, Ergonomic Chairs & Accessories',
    totalItems: 'Total',
    itemsUnit: 'items',
    vatIncluded: 'Includes 7% VAT (Full Tax Invoice Available)',
    searchPlaceholder: 'Search by product name, specs, or SKU...',
    sortByLabel: 'Sort by:',
    sortPopular: 'Recommended / Popular',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortRating: 'Highest Customer Rating',
    emptyTitle: 'No products match your search',
    emptyDesc: 'Try adjusting your keywords or browse all categories',
    btnShowAll: 'Show All Products',
    inStock: 'In Stock & Ready to Ship',
    onlinePromo: 'Online Exclusive Promo • Free Nationwide Delivery',
    addToCart: 'Add to Cart',
    addedToCart: 'Added ✓',
    categories: {
      all: 'All Products',
      desks: 'Desks & Workstations',
      chairs: 'Gaming & Ergonomic Chairs',
      accessories: 'Accessories & Mounts',
      bundles: 'Value Bundles'
    }
  },
  zh: {
    home: '首页',
    allProducts: '全部商品',
    allCategoryTitle: '专业电竞桌椅与人体工学装备专区',
    totalItems: '共计',
    itemsUnit: '件商品',
    vatIncluded: '价格已含 7% 增值税（可开具正规发票）',
    searchPlaceholder: '搜索商品名称、型号或规格参数...',
    sortByLabel: '商品排序:',
    sortPopular: '推荐 / 热销优先',
    sortPriceAsc: '价格: 从低到高',
    sortPriceDesc: '价格: 从高到低',
    sortRating: '用户好评最高',
    emptyTitle: '未找到符合条件的商品',
    emptyDesc: '建议您更换关键词搜索，或点击查看全部分类',
    btnShowAll: '浏览全部商品',
    inStock: '现货直发',
    onlinePromo: '线上订购特惠 • 全泰国境内包邮',
    addToCart: '加入购物车',
    addedToCart: '已加入购物车 ✓',
    categories: {
      all: '全部商品',
      desks: '电竞桌与升降桌',
      chairs: '电竞椅与工学椅',
      accessories: '外设配件与收纳',
      bundles: '超值套装 (Bundle)'
    }
  }
};

export default function ProductCatalog({ 
  selectedCategory, 
  onSelectCategory, 
  onOpenProductDetail,
  onNavigateHome
}) {
  const { siteData } = useSiteData();
  const rawProducts = siteData?.equipmentProducts || EQUIPMENT_PRODUCTS;
  const { addToCart, setIsQuotationModalOpen } = useCart();
  const { language = 'th' } = useTranslation();
  const text = I18N[language] || I18N.th;

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
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
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
  }, [rawProducts, selectedCategory, searchQuery, sortBy]);

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

  const getCategoryName = (catId) => {
    if (text.categories && text.categories[catId]) {
      return text.categories[catId];
    }
    const cat = PRODUCT_CATEGORIES.find(c => c.id === catId);
    if (!cat) return text.allProducts;
    return language === 'en' ? (cat.nameEn || cat.name) : cat.name;
  };

  const currentCategoryName = selectedCategory === 'all' 
    ? text.allCategoryTitle 
    : getCategoryName(selectedCategory);

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
              {text.home}
            </button>
            <ChevronRight size={14} className="breadcrumb-sep-icon" />
            <button 
              className="breadcrumb-link-btn"
              onClick={() => onSelectCategory('all')}
            >
              {text.allProducts}
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
        {/* 2. Top Title & Meta Strip */}
        <div className="catalog-top-header">
          <div className="header-title-col">
            <h1 className="catalog-main-title">{currentCategoryName}</h1>
            <div className="catalog-meta-strip">
              <span className="meta-count-tag">
                {text.totalItems} <strong>{filteredProducts.length}</strong> {text.itemsUnit}
              </span>
              <span className="meta-divider">|</span>
              <span className="meta-vat-text">{text.vatIncluded}</span>
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
                {getCategoryName(cat.id)}
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
              placeholder={text.searchPlaceholder}
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
            <span className="sort-label">{text.sortByLabel}</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-box-select"
            >
              <option value="popular">{text.sortPopular}</option>
              <option value="price-asc">{text.sortPriceAsc}</option>
              <option value="price-desc">{text.sortPriceDesc}</option>
              <option value="rating">{text.sortRating}</option>
            </select>
          </div>
        </div>

        {/* 5. Products Grid (Clean White Cards) */}
        {filteredProducts.length === 0 ? (
          <div className="catalog-empty-state">
            <Box size={44} className="empty-icon text-slate-400" />
            <h3>{text.emptyTitle}</h3>
            <p>{text.emptyDesc}</p>
            <button 
              className="btn-show-all-products"
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
              }}
            >
              {text.btnShowAll}
            </button>
          </div>
        ) : (
          <div className="products-ecommerce-grid">
            {filteredProducts.map(product => {
              const discountPercent = product.originalPrice 
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              const displayName = (language === 'en' && product.nameEn) ? product.nameEn : (language === 'zh' && product.nameZh ? product.nameZh : product.name);
              const displaySubtitle = (language === 'en' && product.subtitleEn) ? product.subtitleEn : (language === 'zh' && product.subtitleZh ? product.subtitleZh : product.subtitle);

              return (
                <div 
                  key={product.id}
                  className="ecommerce-product-card"
                  onClick={() => onOpenProductDetail(product)}
                >
                  {/* Top Header Tags - Aligned on the exact same row */}
                  <div className="card-top-tags">
                    <span className="tag-in-stock">
                      <Check size={11} /> {text.inStock}
                    </span>
                    {discountPercent > 0 && (
                      <span className="discount-top-badge">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  {/* Product Image Box */}
                  <div className="card-img-wrap">
                    <img 
                      src={product.image} 
                      alt={displayName}
                      className="product-clean-photo" 
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </div>

                  {/* Product Title */}
                  <h3 className="card-product-name" title={displayName}>
                    {displayName}
                  </h3>

                  {/* Specs Summary (1-2 lines) */}
                  <p className="card-product-specs">
                    {displaySubtitle}
                  </p>

                  {/* Online Promo Label */}
                  <div className="card-promo-label">
                    <span>{text.onlinePromo}</span>
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
                      title={text.addToCart}
                    >
                      <Plus size={15} />
                      <span>{addedFeedbackId === product.id ? text.addedToCart : text.addToCart}</span>
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
