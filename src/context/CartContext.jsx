import React, { createContext, useContext, useState, useEffect } from 'react';
import { thaiBahtText } from '../data/equipmentProducts';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('gspeed_store_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [savedQuotations, setSavedQuotations] = useState(() => {
    try {
      const saved = localStorage.getItem('gspeed_saved_quotations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [savedOrders, setSavedOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('gspeed_saved_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [activeQuotationData, setActiveQuotationData] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutInitialData, setCheckoutInitialData] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gspeed_store_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Save quotations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gspeed_saved_quotations', JSON.stringify(savedQuotations));
    } catch (e) {
      console.warn('Failed to save quotations to localStorage', e);
    }
  }, [savedQuotations]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gspeed_saved_orders', JSON.stringify(savedOrders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage', e);
    }
  }, [savedOrders]);

  // Add Item to Cart (Default: does NOT open cart, only adds item so customer can select multiple items)
  const addToCart = (product, options = {}, quantity = 1, shouldOpenCart = false) => {
    const selectedColor = options.color || product.colors?.[0] || null;
    const selectedSize = options.size || product.sizes?.[0] || null;
    const extraPrice = selectedSize?.extraPrice || 0;
    const unitPrice = (product.price || 0) + extraPrice;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id &&
        item.selectedColor?.id === selectedColor?.id &&
        item.selectedSize?.id === selectedSize?.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            selectedColor,
            selectedSize,
            unitPrice,
            quantity
          }
        ];
      }
    });

    if (shouldOpenCart) {
      setIsCartOpen(true);
    }
  };

  // Update item quantity (delta: +1, -1, etc.)
  const updateQuantity = (index, delta) => {
    setCartItems(prev => {
      const next = [...prev];
      if (!next[index]) return prev;

      const currentQty = Number(next[index].quantity) || 1;
      const newQty = currentQty + Number(delta);

      if (newQty <= 0) {
        next.splice(index, 1);
      } else {
        const maxStock = next[index].product?.stock || 99;
        next[index] = { 
          ...next[index], 
          quantity: Math.min(maxStock, newQty) 
        };
      }
      return next;
    });
  };

  // Set explicit quantity
  const setItemQuantity = (index, exactQty) => {
    setCartItems(prev => {
      const next = [...prev];
      if (!next[index]) return prev;
      const targetQty = Number(exactQty);
      if (targetQty <= 0) {
        next.splice(index, 1);
      } else {
        const maxStock = next[index].product?.stock || 99;
        next[index] = { 
          ...next[index], 
          quantity: Math.min(maxStock, targetQty) 
        };
      }
      return next;
    });
  };

  // Remove single item
  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculation helpers
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.unitPrice * item.quantity);
  }, 0);

  // Bulk Tier Discount:
  // >= 5 items: 5% discount
  // >= 10 items: 10% discount
  // >= 20 items: 15% discount
  let volumeDiscountRate = 0;
  if (totalItemCount >= 20) volumeDiscountRate = 0.15;
  else if (totalItemCount >= 10) volumeDiscountRate = 0.10;
  else if (totalItemCount >= 5) volumeDiscountRate = 0.05;

  const volumeDiscountAmount = Math.round(subtotal * volumeDiscountRate);
  const afterDiscount = Math.max(0, subtotal - volumeDiscountAmount);
  const vatAmount = Math.round(afterDiscount * 0.07);
  const grandTotal = afterDiscount + vatAmount;

  // Add a newly created quotation
  const createQuotation = (clientInfo, customItems = null) => {
    const items = customItems || cartItems;
    const calcSubtotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    let discRate = 0;
    if (count >= 20) discRate = 0.15;
    else if (count >= 10) discRate = 0.10;
    else if (count >= 5) discRate = 0.05;

    const discount = Math.round(calcSubtotal * discRate);
    const net = calcSubtotal - discount;
    const vat = Math.round(net * 0.07);
    const total = net + vat;

    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const quoteNo = `QT-${dateStr}-${randomSuffix}`;

    const newQuotation = {
      quoteNo,
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      clientInfo,
      items: items.map(item => ({
        id: item.product.id,
        sku: item.product.sku,
        name: item.product.name,
        color: item.selectedColor?.name || '',
        size: item.selectedSize?.name || '',
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.unitPrice * item.quantity
      })),
      subtotal: calcSubtotal,
      discount,
      netTotal: net,
      vat,
      grandTotal: total,
      totalTextTh: thaiBahtText(total),
      status: 'pending' // 'pending' | 'accepted' | 'paid' | 'cancelled'
    };

    setSavedQuotations(prev => [newQuotation, ...prev]);
    setActiveQuotationData(newQuotation);
    return newQuotation;
  };

  // Get specific order
  const getOrder = (orderNo) => {
    if (!orderNo) return null;
    return savedOrders.find(o => o.orderNo.toLowerCase() === orderNo.toLowerCase().trim()) || null;
  };

  // Update payment slip for an existing order (Pay Later flow)
  const updateOrderPaymentSlip = (orderNo, slipData) => {
    setSavedOrders(prev => prev.map(o => {
      if (o.orderNo.toLowerCase() === orderNo.toLowerCase().trim()) {
        return {
          ...o,
          hasSlipUploaded: true,
          slipPreview: slipData.preview || o.slipPreview,
          slipFileName: slipData.fileName || o.slipFileName || 'payment_slip',
          slipFileType: slipData.fileType || o.slipFileType || 'image',
          slipUploadedAt: new Date().toISOString(),
          status: 'verifying_payment',
          statusNote: 'อัปโหลดหลักฐานการชำระเงินแล้ว รอเจ้าหน้าที่ตรวจสอบยอดเงิน'
        };
      }
      return o;
    }));
  };

  // Update Order Status (for testing simulation or admin workflow)
  const updateOrderStatus = (orderNo, newStatus, statusNote = '', extraUpdates = {}) => {
    setSavedOrders(prev => prev.map(o => {
      if (o.orderNo.toLowerCase() === orderNo.toLowerCase().trim()) {
        return {
          ...o,
          status: newStatus,
          statusNote: statusNote !== undefined ? statusNote : o.statusNote || '',
          ...extraUpdates,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
  };

  // Delete Order (for admin management)
  const deleteOrder = (orderNo) => {
    setSavedOrders(prev => prev.filter(o => o.orderNo.toLowerCase() !== orderNo.toLowerCase().trim()));
  };

  // Update Entire Order Details (WooCommerce-style full order edit)
  const updateOrder = (orderNo, updatedFields) => {
    setSavedOrders(prev => prev.map(o => {
      if (o.orderNo.toLowerCase() === orderNo.toLowerCase().trim()) {
        return {
          ...o,
          ...updatedFields,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
  };

  // Create Order
  const createOrder = (orderPayload) => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNo = `GS-ORD-${dateStr}-${randomSuffix}`;

    const newOrder = {
      ...orderPayload,
      orderNo,
      createdAt: new Date().toISOString(),
      status: orderPayload.hasSlipUploaded ? 'verifying_payment' : 'order_received',
      statusNote: orderPayload.hasSlipUploaded 
        ? 'อัปโหลดสลิปแล้ว กำลังรอเจ้าหน้าที่ตรวจสอบยอดเงิน'
        : 'รับคำสั่งซื้อแล้ว รอชำระเงินและแนบสลิปหลักฐาน'
    };

    setSavedOrders(prev => [newOrder, ...prev]);

    // If order was generated from cart, clear cart
    clearCart();

    // If order came from an existing quotation, mark quotation as accepted
    if (orderPayload.fromQuotationNo) {
      setSavedQuotations(prev => prev.map(q => 
        q.quoteNo === orderPayload.fromQuotationNo
          ? { ...q, status: 'paid', orderNo }
          : q
      ));
    }

    return newOrder;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      totalItemCount,
      totalItems: totalItemCount,
      subtotal,
      volumeDiscountRate,
      volumeDiscountAmount,
      afterDiscount,
      vatAmount,
      grandTotal,
      addToCart,
      updateQuantity,
      setItemQuantity,
      removeFromCart,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      isQuotationModalOpen,
      setIsQuotationModalOpen,
      activeQuotationData,
      setActiveQuotationData,
      createQuotation,
      isCheckoutModalOpen,
      setIsCheckoutModalOpen,
      checkoutInitialData,
      setCheckoutInitialData,
      createOrder,
      getOrder,
      updateOrderPaymentSlip,
      updateOrderStatus,
      updateOrder,
      deleteOrder,
      savedQuotations,
      savedOrders,
      setSavedOrders,
      isTrackingModalOpen,
      setIsTrackingModalOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
