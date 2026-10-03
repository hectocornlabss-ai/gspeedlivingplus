import React from 'react';
import { 
  X, Trash2, ShoppingCart, FileText, ArrowRight, 
  CreditCard, ShieldCheck, Tag, Percent, CheckCircle2 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { 
    cartItems, 
    totalItemCount, 
    subtotal, 
    volumeDiscountRate, 
    volumeDiscountAmount, 
    afterDiscount, 
    vatAmount, 
    grandTotal, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    isCartOpen, 
    setIsCartOpen, 
    setIsQuotationModalOpen,
    setIsCheckoutModalOpen 
  } = useCart();

  if (!isCartOpen) return null;

  const handleProceedToQuotation = () => {
    setIsCartOpen(false);
    setIsQuotationModalOpen(true);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    window.history.pushState(null, '', '/checkout');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Next Volume Discount Tier Calculator
  let nextTierHint = null;
  if (totalItemCount < 5) {
    nextTierHint = `ซื้อเพิ่มอีก ${5 - totalItemCount} ชิ้น เพื่อรับส่วนลด 5% ทันที`;
  } else if (totalItemCount < 10) {
    nextTierHint = `ซื้อเพิ่มอีก ${10 - totalItemCount} ชิ้น เพื่อรับส่วนลด 10% ทันที`;
  } else if (totalItemCount < 20) {
    nextTierHint = `ซื้อเพิ่มอีก ${20 - totalItemCount} ชิ้น เพื่อรับส่วนลด 15% สูงสุด`;
  }

  return (
    <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div 
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="drawer-title-group">
            <ShoppingCart size={22} className="text-blue" />
            <h3 className="drawer-title">ตะกร้าสินค้า</h3>
            <span className="drawer-item-count">{totalItemCount} รายการ</span>
          </div>

          <button 
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="ปิดตะกร้า"
          >
            <X size={20} />
          </button>
        </div>

        {/* Volume Tier Discount Banner */}
        {cartItems.length > 0 && (
          <div className="cart-discount-banner">
            <div className="cart-discount-icon">
              <Percent size={18} />
            </div>
            <div className="cart-discount-content">
              {volumeDiscountRate > 0 ? (
                <div>
                  <strong>ยอดเยี่ยม! คุณได้รับส่วนลด {volumeDiscountRate * 100}%</strong>
                  <p>ประหยัดไปได้ ฿{volumeDiscountAmount.toLocaleString()}</p>
                </div>
              ) : (
                <div>
                  <strong>ส่วนลดราคาส่ง B2B สำหรับคำสั่งซื้อจำนวนมาก</strong>
                  {nextTierHint && <p className="next-tier-text">{nextTierHint}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Drawer Body: Cart Items List */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-icon-circle">
                <ShoppingCart size={40} className="text-slate-400" />
              </div>
              <h4>ยังไม่มีสินค้าในตะกร้า</h4>
              <p>เลือกชมโต๊ะ เก้าอี้ และอุปกรณ์ที่ต้องการ แล้วกดใส่ตะกร้าเพื่อออกใบเสนอราคาหรือสั่งซื้อ</p>
              <button 
                className="btn-start-shopping"
                onClick={() => setIsCartOpen(false)}
              >
                เลือกซื้อสินค้า
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item, idx) => {
                const lineTotal = item.unitPrice * item.quantity;
                return (
                  <div key={`${item.product.id}-${idx}`} className="cart-item-card">
                    {/* Item Thumbnail */}
                    <div className="cart-item-img-box">
                      <img src={item.product.image} alt={item.product.name} />
                    </div>

                    {/* Item Info */}
                    <div className="cart-item-details">
                      <div className="cart-item-title-row">
                        <h4 className="cart-item-name">{item.product.name}</h4>
                        <button 
                          className="cart-remove-item-btn"
                          onClick={() => removeFromCart(idx)}
                          title="ลบรายการนี้"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Selected Options */}
                      <div className="cart-item-options">
                        {item.selectedColor && (
                          <span className="cart-opt-pill">
                            <span 
                              className="color-pip" 
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="cart-opt-pill">
                            {item.selectedSize.name}
                          </span>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="cart-item-bottom-row">
                        <div className="cart-qty-stepper">
                          <button 
                            className="c-qty-btn"
                            onClick={() => updateQuantity(idx, -1)}
                          >
                            -
                          </button>
                          <span className="c-qty-val">{item.quantity}</span>
                          <button 
                            className="c-qty-btn"
                            onClick={() => updateQuantity(idx, 1)}
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-pricing">
                          <span className="cart-unit-price">
                            @฿{item.unitPrice.toLocaleString()}
                          </span>
                          <span className="cart-line-total">
                            ฿{lineTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="cart-clear-action">
                <button className="clear-cart-link" onClick={clearCart}>
                  ล้างรายการทั้งหมดในตะกร้า
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer: Pricing Calculation & CTAs */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Calculation Breakdown */}
            <div className="cart-calculation-sheet">
              <div className="calc-row">
                <span className="calc-label">ยอดรวมสินค้า ({totalItemCount} ชิ้น):</span>
                <span className="calc-val">฿{subtotal.toLocaleString()}</span>
              </div>

              {volumeDiscountAmount > 0 && (
                <div className="calc-row discount-row">
                  <span className="calc-label">ส่วนลดพิเศษ ({volumeDiscountRate * 100}%):</span>
                  <span className="calc-val">-฿{volumeDiscountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="calc-row">
                <span className="calc-label">ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                <span className="calc-val">฿{vatAmount.toLocaleString()}</span>
              </div>

              <div className="calc-row grand-total-row">
                <span className="calc-label">ยอดรวมสุทธิทั้งสิ้น:</span>
                <span className="calc-val-highlight">฿{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* CTAs: Quotation and Checkout */}
            <div className="cart-action-buttons">
              <button 
                id="btn-cart-checkout"
                className="btn-checkout-primary"
                onClick={handleProceedToCheckout}
              >
                <CreditCard size={18} />
                <span>สั่งซื้อและชำระเงิน (฿{grandTotal.toLocaleString()})</span>
              </button>

              <button 
                id="btn-cart-quotation"
                className="btn-quotation-secondary"
                onClick={handleProceedToQuotation}
              >
                <FileText size={18} />
                <span>ออกใบเสนอราคา (Quotation PDF)</span>
              </button>
            </div>

            <div className="cart-security-badge">
              <ShieldCheck size={14} className="text-emerald" />
              <span>ความปลอดภัยมาตรฐาน SSL 256-bit • ออกใบกำกับภาษีเต็มรูปแบบ</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
