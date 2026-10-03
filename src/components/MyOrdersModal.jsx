import React from 'react';
import { 
  X, ShoppingBag, FileText, CheckCircle2, Clock, 
  Truck, AlertTriangle, Eye, ArrowRight, Package, User, LogOut
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { useCart } from '../context/CartContext';

const STATUS_BADGES = {
  verifying_payment: { label: 'รอตรวจสลิป', color: '#b45309', bg: '#fef3c7' },
  payment_verified: { label: 'ชำระแล้ว', color: '#15803d', bg: '#dcfce7' },
  preparing_items: { label: 'เตรียมของ', color: '#0369a1', bg: '#e0f2fe' },
  shipping: { label: 'กำลังส่ง', color: '#6d28d9', bg: '#ede9fe' },
  delivered: { label: 'ส่งสำเร็จ', color: '#0f766e', bg: '#ccfbf1' },
  payment_issue: { label: 'สลิปมีปัญหา', color: '#b91c1c', bg: '#fee2e2' },
  order_received: { label: 'รอชำระ', color: '#475569', bg: '#f1f5f9' }
};

export default function MyOrdersModal({ onOpenTracker, onOpenQuotation }) {
  const { 
    isMyOrdersModalOpen, 
    closeMyOrdersModal, 
    currentUser, 
    logout,
    openLoginModal 
  } = useCustomerAuth();

  const { savedOrders = [], savedQuotations = [] } = useCart();

  if (!isMyOrdersModalOpen) return null;

  // Filter orders belonging to this user
  const myOrders = savedOrders.filter(order => {
    if (!currentUser) return false;
    if (order.userId && order.userId === currentUser.id) return true;
    if (order.shipping?.email && currentUser.email && order.shipping.email.toLowerCase() === currentUser.email.toLowerCase()) return true;
    if (order.shipping?.phone && currentUser.phone && order.shipping.phone.replace(/[^0-9]/g, '') === currentUser.phone.replace(/[^0-9]/g, '')) return true;
    return false;
  });

  return (
    <div 
      className="store-modal-backdrop" 
      onClick={closeMyOrdersModal}
      style={{ zIndex: 100010 }}
    >
      <div 
        className="store-modal-container" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '680px', borderRadius: '20px' }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt="" 
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }} 
              />
            ) : (
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} />
              </div>
            )}
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                {currentUser?.name || 'สมาชิก GLP'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {currentUser?.email || currentUser?.phone || 'เข้าสู่ระบบแล้ว'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={logout}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626' }}
            >
              <LogOut size={14} />
              <span>ออกจากระบบ</span>
            </button>
            <button 
              type="button" 
              onClick={closeMyOrdersModal}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', maxHeight: '65vh', overflowY: 'auto' }}>
          <h4 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} className="text-blue" />
            <span>ประวัติคำสั่งซื้อของฉัน ({myOrders.length} รายการ)</span>
          </h4>

          {myOrders.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
              <Package size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
              <p style={{ margin: 0, fontWeight: 600 }}>ยังไม่มีประวัติการสั่งซื้อภายใต้บัญชีนี้</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                เมื่อคุณสั่งซื้อสินค้า ระบบจะบันทึกออเดอร์และใบเสร็จลงในบัญชีนี้โดยอัตโนมัติ
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myOrders.map(order => {
                const badge = STATUS_BADGES[order.status] || STATUS_BADGES.order_received;
                const dateStr = order.createdAt 
                  ? new Date(order.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : '-';

                return (
                  <div 
                    key={order.orderNo}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <span style={{ fontWeight: 800, color: '#1d4ed8', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                          {order.orderNo}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {dateStr}
                        </div>
                      </div>

                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: badge.bg,
                        color: badge.color
                      }}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Items row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', padding: '4px 0' }}>
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', fontSize: '0.78rem', flexShrink: 0 }}>
                          {item.image && (
                            <img src={item.image} alt="" style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'cover' }} />
                          )}
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</span>
                          <span style={{ color: '#64748b' }}>x{item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom row: Total & Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                      <div>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>ยอดสุทธิ: </span>
                        <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                          ฿{(order.pricing?.grandTotal || 0).toLocaleString()}
                        </strong>
                      </div>

                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          closeMyOrdersModal();
                          if (onOpenTracker) onOpenTracker(order.orderNo);
                          else window.location.href = `/checkout?step=tracking&order=${order.orderNo}`;
                        }}
                        style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Eye size={13} />
                        <span>ติดตามออเดอร์นี้</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
