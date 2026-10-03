import React, { useState } from 'react';
import EquipmentNavbar from './EquipmentNavbar';
import EquipmentHero from './EquipmentHero';
import ProductCatalog from './ProductCatalog';
import ProductDetailModal from './ProductDetailModal';
import CartDrawer from './CartDrawer';
import QuotationModal from './QuotationModal';
import CheckoutPaymentModal from './CheckoutPaymentModal';
import OrderTrackerModal from './OrderTrackerModal';
import EquipmentFooter from './EquipmentFooter';
import './EquipmentStore.css';

export default function EquipmentStoreApp() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModalProduct, setActiveModalProduct] = useState(null);

  const handleOpenProductDetail = (product) => {
    setActiveModalProduct(product);
  };

  const handleCloseProductDetail = () => {
    setActiveModalProduct(null);
  };

  return (
    <div className="equipment-store-root">
      {/* 1. Header & Navigation */}
      <EquipmentNavbar 
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 2. Hero Banner */}
      <EquipmentHero 
        onSelectCategory={setSelectedCategory}
      />

      {/* 3. Product Catalog Grid */}
      <ProductCatalog 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenProductDetail={handleOpenProductDetail}
      />

      {/* 4. Product Details & 3D Configurator Modal */}
      <ProductDetailModal 
        product={activeModalProduct}
        isOpen={!!activeModalProduct}
        onClose={handleCloseProductDetail}
      />

      {/* 5. Cart Slide-in Drawer */}
      <CartDrawer />

      {/* 6. Instant Quotation Modal (Official Thai Document) */}
      <QuotationModal />

      {/* 7. Checkout & Payment Modal (PromptPay QR, Bank Slip, Card, Deposit) */}
      <CheckoutPaymentModal />

      {/* 8. Order & Quotation Tracker Modal */}
      <OrderTrackerModal />

      {/* 9. Store Footer */}
      <EquipmentFooter 
        onSelectCategory={setSelectedCategory}
      />
    </div>
  );
}
