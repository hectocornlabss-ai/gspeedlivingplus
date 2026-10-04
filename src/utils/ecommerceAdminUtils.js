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

/**
 * Triggers a client-side download of a standalone printable HTML document.
 * Self-contains all typography, layout, CSS variables, and offline print button.
 */
export function downloadDocumentAsHtml(filename, htmlContent, title = 'เอกสาร GLP') {
  const safeTitle = String(title || 'เอกสาร GLP').replace(/[<>&"']/g, '');
  const safeFilename = String(filename || 'document.html').replace(/[\\/:*?"<>|]/g, '_');
  const fullHtml = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Kanit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      padding: 24px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .offline-toolbar {
      max-width: 820px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .offline-title {
      font-weight: 800;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .offline-btn {
      background: #00e5ff;
      color: #000000;
      border: none;
      padding: 8px 18px;
      font-weight: 800;
      border-radius: 6px;
      cursor: pointer;
      font-family: 'Kanit', sans-serif;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .offline-btn:hover {
      background: #38bdf8;
      transform: translateY(-1px);
    }
    .document-wrapper {
      max-width: 820px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .shipping-label-printable-sheet,
    .receipt-printable-sheet {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
      border: 1px solid #cbd5e1;
      padding: 24px;
    }
    .label-header-bar { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 2px solid #0f172a; margin-bottom: 12px; }
    .label-brand-group { display: flex; align-items: center; gap: 12px; }
    .label-brand-badge { background: #0f172a; color: #00e5ff; font-weight: 900; font-size: 16px; padding: 4px 10px; border-radius: 6px; letter-spacing: 1px; }
    .label-brand-title { font-weight: 900; font-size: 14px; letter-spacing: 0.5px; color: #0f172a; }
    .label-brand-subtitle { font-size: 9px; font-weight: 700; color: #64748b; }
    .label-carrier-tag { background: #fee2e2; border: 1.5px solid #dc2626; color: #991b1b; font-weight: 900; font-size: 13px; padding: 6px 14px; border-radius: 6px; }
    .label-copy-tag { font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px; }
    .label-copy-tag.customer { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .label-copy-tag.store { background: #fef08a; color: #854d0e; border: 1px solid #fde047; }
    .label-tracking-box { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 16px; margin-bottom: 14px; }
    .simulated-barcode { display: flex; height: 38px; align-items: stretch; gap: 2px; }
    .bar { background: #000; height: 100%; }
    .bar.w-1 { width: 2px; } .bar.w-2 { width: 3px; } .bar.w-3 { width: 5px; } .bar.w-4 { width: 7px; }
    .tracking-code-text { font-family: monospace; font-size: 12px; font-weight: 800; letter-spacing: 1px; margin-top: 4px; color: #0f172a; }
    .label-order-meta { text-align: right; font-size: 11px; line-height: 1.5; color: #334155; }
    .paid-stamp { display: inline-block; background: #dcfce7; color: #166534; font-weight: 800; font-size: 11px; padding: 2px 8px; border-radius: 4px; margin-top: 4px; }
    .label-parties-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 14px; margin-bottom: 14px; }
    .party-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background: #ffffff; }
    .party-box.receiver { border: 1.5px solid #0f172a; background: #f8fafc; }
    .party-label { font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 4px; text-transform: uppercase; }
    .party-label.highlight { color: #dc2626; font-size: 11px; }
    .party-name { font-size: 12px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
    .party-name.recipient-name { font-size: 14px; color: #0f172a; }
    .party-address { font-size: 11px; line-height: 1.4; color: #334155; }
    .party-phone { font-size: 11px; color: #334155; margin-bottom: 4px; }
    .recipient-phone { font-size: 13px; color: #0f172a; }
    .delivery-note { margin-top: 6px; padding: 4px 8px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 4px; font-size: 10px; color: #92400e; }
    .label-items-box { border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; margin-bottom: 14px; }
    .items-box-title { background: #f1f5f9; padding: 8px 12px; font-size: 11px; font-weight: 800; color: #334155; display: flex; align-items: center; gap: 6px; }
    .label-items-table { width: 100%; border-collapse: collapse; font-size: 11px; }
    .label-items-table th { background: #f8fafc; padding: 6px 8px; text-align: left; border-bottom: 1px solid #cbd5e1; font-size: 10px; }
    .label-items-table td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; }
    .check-square { width: 14px; height: 14px; border: 1.5px solid #64748b; border-radius: 2px; margin: 0 auto; }
    .item-sku { display: block; font-size: 9px; color: #64748b; }
    .label-footer-grid { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 10px; border-top: 1.5px solid #0f172a; }
    .label-guarantee-note { font-size: 10px; color: #475569; max-width: 340px; }
    .sign-columns { display: flex; gap: 20px; }
    .sign-col { text-align: center; width: 110px; }
    .sign-line { border-bottom: 1px solid #64748b; height: 28px; margin-bottom: 4px; }
    .sign-label { font-size: 9px; color: #64748b; }

    /* POD Copy Styles */
    .pod-directive-banner { background: #fffbeb; border: 1.5px dashed #f59e0b; border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; font-size: 11px; font-weight: 700; color: #92400e; display: flex; align-items: center; gap: 8px; line-height: 1.4; }
    .pod-inspection-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; font-size: 11px; }
    .pod-inspection-title { font-weight: 800; color: #0f172a; margin-bottom: 6px; }
    .pod-check-item { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; color: #334155; }
    .pod-sign-grid { display: grid; grid-template-columns: 1.3fr 1.1fr 1fr; gap: 12px; margin-top: 14px; padding-top: 12px; border-top: 1.5px solid #0f172a; }
    .pod-sign-card { border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 10px; background: #ffffff; }
    .pod-sign-card.highlight { border-color: #0f172a; background: #fcfcfc; }
    .pod-sign-card-title { font-size: 10px; font-weight: 900; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; text-transform: uppercase; }
    .pod-sign-slot { border-bottom: 1px solid #64748b; height: 38px; margin-bottom: 6px; }
    .pod-sign-field { font-size: 10px; color: #334155; margin-bottom: 4px; line-height: 1.4; }

    /* Receipt Styles */
    .receipt-header-row { display: flex; justify-content: space-between; gap: 20px; padding-bottom: 18px; border-bottom: 2px solid #1d4ed8; margin-bottom: 18px; }
    .receipt-logo-title { font-size: 16px; font-weight: 900; color: #1d4ed8; }
    .receipt-logo-sub { font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 6px; }
    .receipt-seller-text { font-size: 12px; line-height: 1.45; color: #334155; }
    .receipt-doc-meta { text-align: right; }
    .receipt-doc-title { font-size: 18px; font-weight: 900; color: #0f172a; }
    .receipt-doc-subtitle { font-size: 10px; font-weight: 700; color: #64748b; margin-bottom: 8px; }
    .receipt-meta-table { font-size: 11px; margin-left: auto; }
    .receipt-meta-table td { padding: 2px 6px; }
    .receipt-paid-tag { background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 11px; }
    .receipt-buyer-card { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 18px; font-size: 12px; }
    .buyer-label { font-weight: 800; color: #64748b; margin-bottom: 4px; }
    .buyer-name { font-weight: 900; font-size: 14px; color: #0f172a; margin-bottom: 4px; }
    .buyer-address { line-height: 1.4; color: #334155; }
    .receipt-items-table { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 12px; }
    .receipt-items-table th { background: #1d4ed8; color: #ffffff; padding: 8px 10px; text-align: left; font-weight: 800; }
    .receipt-items-table td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
    .receipt-calc-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; margin-bottom: 24px; }
    .baht-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; }
    .baht-title { display: block; font-size: 11px; color: #64748b; font-weight: 600; }
    .baht-string { font-weight: 800; color: #1d4ed8; font-size: 13px; }
    .receipt-note-text { font-size: 11px; color: #64748b; line-height: 1.5; }
    .receipt-totals-col { display: flex; flex-direction: column; gap: 6px; font-size: 13px; }
    .calc-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed #e2e8f0; }
    .calc-row.grand-total { font-size: 16px; font-weight: 900; color: #1d4ed8; border-bottom: 2px solid #1d4ed8; border-top: 1px solid #cbd5e1; padding-top: 8px; }
    .receipt-sign-row { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .sign-box { text-align: center; width: 200px; }
    .sign-signature-line { border-bottom: 1px solid #94a3b8; height: 40px; margin-bottom: 6px; }

    @media print {
      .offline-toolbar { display: none !important; }
      body { background: #ffffff; padding: 0; }
      .document-wrapper { gap: 0; max-width: 100%; }
      .shipping-label-printable-sheet,
      .receipt-printable-sheet { border: none !important; box-shadow: none !important; padding: 10px; margin: 0; }
      .sheet-page-break { display: block !important; page-break-after: always !important; break-after: page !important; height: 0 !important; border: none !important; margin: 0 !important; }
      .sheet-page-break::after { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="offline-toolbar">
    <div class="offline-title">
      <strong>GLP ESPORTS STORE</strong> - <span>${title}</span>
    </div>
    <button class="offline-btn" onclick="window.print()">สั่งพิมพ์ หรือ บันทึกเป็น PDF (Print / PDF)</button>
  </div>
  <div class="document-wrapper">
    ${htmlContent}
  </div>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
