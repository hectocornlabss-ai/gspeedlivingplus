import React, { useState, useEffect } from 'react';
import ProductCatalog from './ProductCatalog';
import ProductDetailPage from './ProductDetailPage';
import { EQUIPMENT_PRODUCTS } from '../../data/equipmentProducts';
import { useSiteData } from '../../context/SiteDataContext';
import './EquipmentStore.css';

export default function EquipmentStorePage({ onNavigateHome, initialProductId = null }) {
  const { siteData } = useSiteData();
  const products = siteData?.equipmentProducts || EQUIPMENT_PRODUCTS;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeProductId, setActiveProductId] = useState(initialProductId);

  // Sync with URL popstate and query params
  useEffect(() => {
    const handleUrlChange = () => {
      const match = window.location.pathname.match(/^\/(?:products|product|equipment|shop)\/([^/?#]+)/i);
      const urlId = match ? decodeURIComponent(match[1]) : new URLSearchParams(window.location.search).get('product');
      setActiveProductId(urlId || null);
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const activeProduct = activeProductId 
    ? products.find(p => p.id === activeProductId || p.sku.toLowerCase() === activeProductId.toLowerCase())
    : null;

  const handleOpenProduct = (product) => {
    setActiveProductId(product.id);
    window.history.pushState(null, '', `/products/${product.id}`);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleBackToCatalog = () => {
    setActiveProductId(null);
    window.history.pushState(null, '', '/franchise');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <div className="equipment-store-page">
      {activeProduct ? (
        <ProductDetailPage 
          product={activeProduct}
          onBack={handleBackToCatalog}
          onSelectProduct={handleOpenProduct}
          onNavigateHome={onNavigateHome}
        />
      ) : (
        <ProductCatalog 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenProductDetail={handleOpenProduct}
          onNavigateHome={onNavigateHome}
        />
      )}
    </div>
  );
}
