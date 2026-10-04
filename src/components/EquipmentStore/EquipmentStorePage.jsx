import React, { useState, useEffect } from 'react';
import ProductCatalog from './ProductCatalog';
import ProductDetailPage from './ProductDetailPage';
import { EQUIPMENT_PRODUCTS } from '../../data/equipmentProducts';
import { useSiteData } from '../../context/SiteDataContext';
import './EquipmentStore.css';

export default function EquipmentStorePage({ 
  onNavigateHome, 
  initialProductId = null,
  currentPath = null,
  onNavigate = null
}) {
  const { siteData } = useSiteData();
  const products = siteData?.equipmentProducts || EQUIPMENT_PRODUCTS;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeProductId, setActiveProductId] = useState(initialProductId);

  // Sync activeProductId with props whenever initialProductId or currentPath changes
  useEffect(() => {
    if (initialProductId) {
      setActiveProductId(initialProductId);
    } else {
      const path = currentPath || window.location.pathname;
      const match = path.match(/^\/(?:products|product|equipment|shop)\/([^/?#]+)/i);
      const urlId = match ? decodeURIComponent(match[1]) : new URLSearchParams(window.location.search).get('product');
      setActiveProductId(urlId || null);
    }
  }, [initialProductId, currentPath]);

  // Sync with URL popstate and query params
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      if (path === '/shop' || path === '/franchise' || path === '/products' || path === '/equipment') {
        setActiveProductId(null);
        return;
      }
      const match = path.match(/^\/(?:products|product|equipment|shop)\/([^/?#]+)/i);
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
    if (onNavigate) {
      onNavigate(`/products/${product.id}`);
    } else {
      window.history.pushState(null, '', `/products/${product.id}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleBackToCatalog = () => {
    setActiveProductId(null);
    if (onNavigate) {
      onNavigate('/shop');
    } else {
      window.history.pushState(null, '', '/shop');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
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
