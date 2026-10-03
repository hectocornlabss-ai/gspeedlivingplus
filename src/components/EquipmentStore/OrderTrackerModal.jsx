import React, { useState } from 'react';
import { 
  X, Search, PackageCheck, FileText, CheckCircle2, 
  Clock, Truck, AlertCircle, ArrowRight, Download 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function OrderTrackerModal() {
  const { 
    isTrackingModalOpen, 
    setIsTrackingModalOpen, 
    savedOrders, 
    savedQuotations,
    setActiveQuotationData,
    setIsQuotationModalOpen,
    setCheckoutInitialData,
    setIsCheckoutModalOpen 
  } = useCart();

  const [searchKey, setSearchKey] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'quotes'

  if (!isTrackingModalOpen) return null;

  const filteredOrders = savedOrders.filter(ord => {
    if (!searchKey.trim()) return true;
    const q = searchKey.toLowerCase().trim();
    return ord.orderNo.toLowerCase().includes(q) ||
      ord.shipping?.phone?.includes(q) ||
      ord.shipping?.receiverName?.toLowerCase().includes(q);
  });

  const filteredQuotes = savedQuotations.filter(qt => {
    if (!searchKey.trim()) return true;
    const q = searchKey.toLowerCase().trim();
    return qt.quoteNo.toLowerCase().includes(q) ||
      qt.clientInfo?.companyName?.toLowerCase().includes(q) ||
      qt.clientInfo?.contactName?.toLowerCase().includes(q) ||
      qt.clientInfo?.phone?.includes(q);
  });

  const handleOpenQuote = (qt) => {
    setActiveQuotationData(qt);
    setIsTrackingModalOpen(false);
    setIsQuotationModalOpen(true);
  };

  const handlePayQuote = (qt) => {
    setIsTrackingModalOpen(false);
    setCheckoutInitialData({
      fromQuotationNo: qt.quoteNo,
      items: qt.items,
      subtotal: qt.subtotal,
      discount: qt.discount,
      vat: qt.vat,
      grandTotal: qt.grandTotal,
      clientInfo: qt.clientInfo
    });
    setIsTrackingModalOpen(false);
    window.history.pushState(null, '', '/checkout');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <div className="tracker-modal-backdrop" onClick={() => setIsTrackingModalOpen(false)}>
      <div 
        className="tracker-modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tracker-header">
          <div className="tracker-title-box">
            <PackageCheck size={22} className="text-blue" />
            <div>
              <h3>ตรวจสอบสถานะคำสั่งซื้อ & ใบเสนอราคา</h3>
              <p>ค้นหาด้วยเลขที่คำสั่งซื้อ (GS-ORD-xxxx), ใบเสนอราคา (QT-xxxx) หรือเบอร์โทร</p>
            </div>
          </div>

          <button 
            className="tracker-close-btn"
            onClick={() => setIsTrackingModalOpen(false)}
            aria-label="ปิดหน้าต่าง"
          >
            <X size={20} />
          </button>
        </div>

        <div className="tracker-body">
          {/* Search Box */}
          <div className="tracker-search-bar">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="พิมพ์เลขที่เอกสาร หรือ เบอร์โทรศัพท์..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            {searchKey && (
              <button className="btn-clear-search" onClick={() => setSearchKey('')}>✕</button>
            )}
          </div>

          {/* Tab Selector */}
          <div className="tracker-tabs-bar">
            <button 
              className={`tracker-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <PackageCheck size={16} />
              <span>คำสั่งซื้อ ({savedOrders.length})</span>
            </button>
            <button 
              className={`tracker-tab ${activeTab === 'quotes' ? 'active' : ''}`}
              onClick={() => setActiveTab('quotes')}
            >
              <FileText size={16} />
              <span>ใบเสนอราคาที่เคยออก ({savedQuotations.length})</span>
            </button>
          </div>

          {/* Results List */}
          <div className="tracker-results-container">
            {activeTab === 'orders' ? (
              filteredOrders.length === 0 ? (
                <div className="tracker-empty">
                  <PackageCheck size={40} className="text-slate-300" />
                  <h4>ยังไม่พบประวัติคำสั่งซื้อ</h4>
                  <p>เมื่อสั่งซื้อสินค้าและชำระเงินแล้ว คำสั่งซื้อจะปรากฏที่นี่</p>
                </div>
              ) : (
                <div className="orders-timeline-list">
                  {filteredOrders.map(order => (
                    <div key={order.orderNo} className="order-track-card">
                      <div className="card-top-row">
                        <strong className="order-no-val">{order.orderNo}</strong>
                        <span className="order-date-val">
                          {new Date(order.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="order-card-meta">
                        <div>
                          <span>ผู้รับ: </span>
                          <strong>{order.shipping.receiverName}</strong> ({order.shipping.phone})
                        </div>
                        <div>
                          <span>ยอดชำระ: </span>
                          <strong className="text-emerald">฿{order.pricing.amountPaid.toLocaleString()}</strong>
                          {order.pricing.remainingAmount > 0 && (
                            <span className="text-orange text-xs"> (คงเหลือ ฿{order.pricing.remainingAmount.toLocaleString()})</span>
                          )}
                        </div>
                      </div>

                      <div className="order-status-timeline">
                        <div className={`step-node ${order.status ? 'done' : ''}`}>
                          <div className="step-circle"><CheckCircle2 size={13} /></div>
                          <span>รับคำสั่งซื้อ</span>
                        </div>
                        <div className="step-line active"></div>
                        <div className={`step-node ${order.status === 'paid' ? 'done' : 'active'}`}>
                          <div className="step-circle"><Clock size={13} /></div>
                          <span>{order.status === 'paid' ? 'ชำระเงินแล้ว' : 'รอเช็คสลิป'}</span>
                        </div>
                        <div className="step-line"></div>
                        <div className="step-node">
                          <div className="step-circle"><Truck size={13} /></div>
                          <span>จัดเตรียม & ส่งมอบ</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              filteredQuotes.length === 0 ? (
                <div className="tracker-empty">
                  <FileText size={40} className="text-slate-300" />
                  <h4>ยังไม่มีประวัติใบเสนอราคา</h4>
                  <p>สามารถกด "ออกใบเสนอราคา" ในตะกร้าสินค้าเพื่อสร้างเอกสาร</p>
                </div>
              ) : (
                <div className="quotes-timeline-list">
                  {filteredQuotes.map(qt => (
                    <div key={qt.quoteNo} className="quote-track-card">
                      <div className="card-top-row">
                        <div>
                          <strong className="quote-no-val">{qt.quoteNo}</strong>
                          <div className="quote-client-name">{qt.clientInfo?.companyName || 'ลูกค้าทั่วไป'}</div>
                        </div>
                        <span className="quote-total-price">฿{qt.grandTotal?.toLocaleString()}</span>
                      </div>

                      <div className="quote-actions-row">
                        <button 
                          className="btn-quote-view-doc"
                          onClick={() => handleOpenQuote(qt)}
                        >
                          <FileText size={14} />
                          <span>ดู / พิมพ์ใบเสนอราคา</span>
                        </button>

                        <button 
                          className="btn-quote-pay-now"
                          onClick={() => handlePayQuote(qt)}
                        >
                          <span>ชำระเงินตามใบนี้</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
