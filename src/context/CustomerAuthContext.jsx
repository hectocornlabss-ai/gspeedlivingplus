import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomerAuthContext = createContext(null);

const STORAGE_KEY = 'glp_customer_user';
const SESSION_ORDERS_KEY = 'glp_session_placed_orders';

export function CustomerAuthProvider({ children }) {
  // Current logged in customer profile
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Track order IDs created in current browser session
  const [sessionOrderIds, setSessionOrderIds] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_ORDERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMyOrdersModalOpen, setIsMyOrdersModalOpen] = useState(false);
  const [loginRedirectOrderNo, setLoginRedirectOrderNo] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save customer user', e);
    }
  }, [currentUser]);

  // Sync session orders
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_ORDERS_KEY, JSON.stringify(sessionOrderIds));
    } catch (e) {}
  }, [sessionOrderIds]);

  // Register an order created in this session
  const registerSessionOrder = (orderNo) => {
    if (!orderNo) return;
    setSessionOrderIds(prev => prev.includes(orderNo) ? prev : [...prev, orderNo]);
  };

  // Login with Google simulation / OAuth
  const loginWithGoogle = (customProfile = null) => {
    const profile = customProfile || {
      id: `usr-google-${Date.now()}`,
      name: 'Weerayut Th.',
      email: 'weerayut.glp@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      provider: 'google',
      phone: '081-999-8888',
      createdAt: new Date().toISOString()
    };

    setCurrentUser(profile);
    setIsLoginModalOpen(false);
    return profile;
  };

  // Login with Phone / Member ID
  const loginWithPhone = (phone, name = 'สมาชิก GLP') => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const profile = {
      id: `usr-phone-${cleanPhone || Date.now()}`,
      name: name.trim() || `สมาชิก ${cleanPhone.slice(-4) || 'GLP'}`,
      email: `${cleanPhone}@member.gspeed.co.th`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      provider: 'phone',
      phone: phone.trim(),
      createdAt: new Date().toISOString()
    };

    setCurrentUser(profile);
    setIsLoginModalOpen(false);
    return profile;
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setIsMyOrdersModalOpen(false);
  };

  // Open modal with optional redirect intent
  const openLoginModal = (redirectOrderNo = null) => {
    setLoginRedirectOrderNo(redirectOrderNo);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginRedirectOrderNo(null);
  };

  const openMyOrdersModal = () => {
    setIsMyOrdersModalOpen(true);
  };

  const closeMyOrdersModal = () => {
    setIsMyOrdersModalOpen(false);
  };

  // Check if an order is owned by current user
  const isOrderOwner = (order) => {
    if (!order) return false;

    // 1. Created in current session?
    if (sessionOrderIds.includes(order.orderNo)) {
      return true;
    }

    // 2. If logged in, check user ID or email or phone match
    if (currentUser) {
      if (order.userId && order.userId === currentUser.id) return true;
      if (order.shipping?.email && currentUser.email && order.shipping.email.toLowerCase() === currentUser.email.toLowerCase()) return true;
      if (order.shipping?.phone && currentUser.phone && order.shipping.phone.replace(/[^0-9]/g, '') === currentUser.phone.replace(/[^0-9]/g, '')) return true;
    }

    return false;
  };

  return (
    <CustomerAuthContext.Provider value={{
      currentUser,
      isLoggedIn: !!currentUser,
      loginWithGoogle,
      loginWithPhone,
      logout,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      isMyOrdersModalOpen,
      openMyOrdersModal,
      closeMyOrdersModal,
      loginRedirectOrderNo,
      sessionOrderIds,
      registerSessionOrder,
      isOrderOwner
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return ctx;
}
