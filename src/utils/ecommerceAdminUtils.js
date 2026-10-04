/**
 * eCommerce Admin Utilities for GLP ESPORTS CMS
 * Includes CSV Export, Audio Chime, and Analytics Calculators
 */

/**
 * Synthesizes a pleasant 2-tone notification chime using Web Audio API
 */
export function playAlertChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    
    // Note 1: E5 (659 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Note 2: B5 (987 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.12);
    gain2.gain.setValueAtTime(0.18, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    console.debug('Audio chime playback omitted or blocked by browser policy:', e);
  }
}

/**
 * Exports an array of orders to CSV with UTF-8 BOM for Microsoft Excel compatibility
 */
export function exportOrdersToCSV(orders = []) {
  if (!orders || orders.length === 0) {
    alert('ไม่มีรายการคำสั่งซื้อให้ส่งออก');
    return;
  }

  const headers = [
    'เลขที่คำสั่งซื้อ',
    'วันที่สั่งซื้อ',
    'สถานะคำสั่งซื้อ',
    'ชื่อผู้รับ',
    'เบอร์โทรศัพท์',
    'อีเมล',
    'ที่อยู่จัดส่ง',
    'รายการสินค้า',
    'จำนวนชิ้นรวม',
    'ยอดรวมสินค้า (฿)',
    'ส่วนลด (฿)',
    'VAT 7% (฿)',
    'ยอดชำระสุทธิ (฿)',
    'วิธีชำระเงิน',
    'สถานะสลิป',
    'บริษัทขนส่ง',
    'เลขพัสดุ (Tracking No)',
    'หมายเหตุ'
  ];

  const statusLabelMap = {
    verifying_payment: 'รอตรวจสอบสลิป',
    payment_verified: 'ชำระแล้ว / อนุมัติสลิป',
    preparing_items: 'กำลังเตรียมพัสดุ',
    shipping: 'กำลังจัดส่งพัสดุ',
    delivered: 'จัดส่งสำเร็จ',
    payment_issue: 'สลิปมีปัญหา',
    order_received: 'รอการชำระเงิน'
  };

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = orders.map(o => {
    const itemsSummary = (o.items || [])
      .map(it => `${it.name} (${it.color || '-'} / ${it.size || '-'}) x${it.quantity}`)
      .join('; ');

    const totalQty = (o.items || []).reduce((sum, it) => sum + (it.quantity || 1), 0);
    const dateStr = o.createdAt ? new Date(o.createdAt).toLocaleString('th-TH') : '-';

    return [
      escapeCSV(o.orderNo),
      escapeCSV(dateStr),
      escapeCSV(statusLabelMap[o.status] || o.status),
      escapeCSV(o.shipping?.receiverName || o.customerName || '-'),
      escapeCSV(o.shipping?.phone || o.customerPhone || '-'),
      escapeCSV(o.shipping?.email || o.customerEmail || '-'),
      escapeCSV(o.shipping?.address || '-'),
      escapeCSV(itemsSummary),
      totalQty,
      o.pricing?.subtotal || 0,
      o.pricing?.discount || 0,
      o.pricing?.vat || 0,
      o.pricing?.grandTotal || 0,
      escapeCSV(o.paymentMethod === 'promptpay' ? 'พร้อมเพย์ QR' : o.paymentMethod === 'bank_transfer' ? 'โอนเงินบัญชีธนาคาร' : o.paymentMethod || '-'),
      escapeCSV(o.hasSlipUploaded ? 'แนบสลิปแล้ว' : 'ยังไม่แนบ'),
      escapeCSV(o.shippingCarrier || '-'),
      escapeCSV(o.trackingNumber || '-'),
      escapeCSV(o.shipping?.notes || o.statusNote || '-')
    ].join(',');
  });

  // UTF-8 BOM (\uFEFF) ensures Excel displays Thai characters perfectly
  const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const d = new Date();
  const dateSuffix = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`;
  const filename = `GLP_Orders_${dateSuffix}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Calculates stock levels, alert lists, and inventory valuations
 */
export function calculateStockMetrics(products = [], lowStockThreshold = 5) {
  let totalStockUnits = 0;
  let totalInventoryValuation = 0;
  const outOfStockProducts = [];
  const lowStockProducts = [];
  const healthyStockProducts = [];

  products.forEach(p => {
    const stock = Number(p.stock !== undefined ? p.stock : 20);
    const price = Number(p.price || 0);

    totalStockUnits += stock;
    totalInventoryValuation += stock * price;

    if (stock <= 0) {
      outOfStockProducts.push(p);
    } else if (stock <= lowStockThreshold) {
      lowStockProducts.push(p);
    } else {
      healthyStockProducts.push(p);
    }
  });

  return {
    totalProducts: products.length,
    totalStockUnits,
    totalInventoryValuation,
    outOfStockCount: outOfStockProducts.length,
    lowStockCount: lowStockProducts.length,
    healthyStockCount: healthyStockProducts.length,
    outOfStockProducts,
    lowStockProducts,
    healthyStockProducts
  };
}

/**
 * Calculates revenue analytics, top sellers, and order status summaries
 */
export function calculateSalesAnalytics(orders = [], products = []) {
  let totalRevenue = 0;
  let paidRevenue = 0;
  let pendingRevenue = 0;
  let todayRevenue = 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const itemSalesMap = {};

  orders.forEach(o => {
    const total = Number(o.pricing?.grandTotal || 0);
    totalRevenue += total;

    if (o.status === 'payment_verified' || o.status === 'preparing_items' || o.status === 'shipping' || o.status === 'delivered') {
      paidRevenue += total;
    } else if (o.status === 'verifying_payment' || o.status === 'order_received') {
      pendingRevenue += total;
    }

    if (o.createdAt && o.createdAt.startsWith(todayStr)) {
      todayRevenue += total;
    }

    // Tally item sales
    (o.items || []).forEach(it => {
      const pid = it.id || it.sku;
      if (!itemSalesMap[pid]) {
        itemSalesMap[pid] = {
          id: it.id,
          sku: it.sku,
          name: it.name,
          image: it.image,
          unitsSold: 0,
          revenueGenerated: 0
        };
      }
      itemSalesMap[pid].unitsSold += (it.quantity || 1);
      itemSalesMap[pid].revenueGenerated += (it.totalPrice || (it.unitPrice * (it.quantity || 1)));
    });
  });

  // Top 5 best-selling products
  const topSellers = Object.values(itemSalesMap)
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  return {
    totalOrders: orders.length,
    totalRevenue,
    paidRevenue,
    pendingRevenue,
    todayRevenue,
    averageOrderValue,
    topSellers
  };
}
