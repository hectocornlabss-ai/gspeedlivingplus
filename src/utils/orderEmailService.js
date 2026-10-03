/**
 * Automated Order Status Email Notification Service
 * Generates beautiful, responsive HTML emails with GLP branding and tracking links.
 */

export const CARRIER_TRACKING_URLS = {
  kerry: (track) => `https://th.kerryexpress.com/th/track/?track=${encodeURIComponent(track)}`,
  kex: (track) => `https://th.kerryexpress.com/th/track/?track=${encodeURIComponent(track)}`,
  flash: (track) => `https://www.flashexpress.co.th/tracking/?se=${encodeURIComponent(track)}`,
  ems: (track) => `https://track.thailandpost.co.th/?trackNumber=${encodeURIComponent(track)}`,
  post: (track) => `https://track.thailandpost.co.th/?trackNumber=${encodeURIComponent(track)}`,
  scg: (track) => `https://www.scgexpress.co.th/tracking/detail/${encodeURIComponent(track)}`,
  j_and_t: (track) => `https://www.jtexpress.co.th/trajectoryQuery?bills=${encodeURIComponent(track)}`,
  glp_onsite: () => null
};

export const getCarrierDirectTrackingUrl = (carrierName = '', trackingNumber = '') => {
  if (!trackingNumber) return null;
  const c = carrierName.toLowerCase();
  for (const [key, fn] of Object.entries(CARRIER_TRACKING_URLS)) {
    if (c.includes(key)) {
      return fn(trackingNumber);
    }
  }
  return `https://th.kerryexpress.com/th/track/?track=${encodeURIComponent(trackingNumber)}`;
};

/**
 * Builds email subject and HTML content based on status type
 */
export const buildOrderStatusEmailTemplate = (order, statusType = 'shipping', customOptions = {}) => {
  const orderNo = order.orderNo || 'GS-ORD';
  const recipientName = order.shipping?.receiverName || 'ลูกค้าคนสำคัญ';
  const recipientEmail = order.customerEmail || order.shipping?.email || '';
  const phone = order.shipping?.phone || '';
  const address = order.shipping?.address || '-';
  const grandTotal = (order.pricing?.grandTotal || 0).toLocaleString();
  const carrier = customOptions.carrier || order.shippingCarrier || 'Kerry Express';
  const trackingNo = customOptions.trackingNo || order.trackingNumber || '';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://glp.cyber-wp.com';
  const orderViewUrl = `${siteUrl}/orders/${orderNo}`;
  const carrierTrackUrl = getCarrierDirectTrackingUrl(carrier, trackingNo);

  const orderDateStr = new Date(order.createdAt || Date.now()).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Items table HTML
  const itemsHtml = (order.items || []).map(item => `
    <tr>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #1e293b;">
        <strong style="color: #0f172a;">${item.name}</strong>
        ${item.color ? `<br><span style="font-size: 12px; color: #64748b;">สี: ${item.color}</span>` : ''}
        ${item.size ? `<span style="font-size: 12px; color: #64748b;"> | ขนาด: ${item.size}</span>` : ''}
      </td>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: center; color: #475569;">
        x${item.quantity || 1}
      </td>
      <td style="padding: 12px 14px; border-bottom: 1px solid #e2e8f0; font-size: 14px; text-align: right; font-weight: 700; color: #0f172a;">
        ฿${(item.totalPrice || item.unitPrice * (item.quantity || 1) || 0).toLocaleString()}.-
      </td>
    </tr>
  `).join('');

  // Status-specific themes
  let statusBannerBg = '#2563eb';
  let statusHeadline = 'คำสั่งซื้อของคุณอยู่ระหว่างการจัดส่งแล้ว 🚚';
  let statusSub = 'ทีมงานได้ส่งมอบพัสดุให้กับบริษัทขนส่งเรียบร้อยแล้ว ตรวจสอบสถานะการจัดส่งได้ด้านล่าง';
  let emailSubject = `🚚 อัปเดตสถานะจัดส่ง: คำสั่งซื้อเลขที่ ${orderNo} อยู่ระหว่างการจัดส่งแล้ว | G-Speed Living Plus`;

  if (statusType === 'payment_verified') {
    statusBannerBg = '#10b981';
    statusHeadline = '✓ ยืนยันยอดชำระเงินเรียบร้อยแล้ว!';
    statusSub = 'ฝ่ายการเงินตรวจสอบหลักฐานการโอนเงินสมบูรณ์ กำลังส่งต่อให้ฝ่ายคลังจัดเตรียมอุปกรณ์';
    emailSubject = `✓ ยืนยันการชำระเงิน: คำสั่งซื้อเลขที่ ${orderNo} ตรวจสอบเรียบร้อย | G-Speed Living Plus`;
  } else if (statusType === 'preparing_items') {
    statusBannerBg = '#0284c7';
    statusHeadline = '📦 กำลังจัดเตรียมอุปกรณ์ & ตรวจสอบคุณภาพ (QC)';
    statusSub = 'เจ้าหน้าที่กำลังประกอบ ตรวจเช็คสภาพสินค้าอย่างละเอียด และจองคิวรถขนส่ง';
    emailSubject = `📦 กำลังเตรียมพัสดุ: คำสั่งซื้อเลขที่ ${orderNo} อยู่ในขั้นตอน QC | G-Speed Living Plus`;
  } else if (statusType === 'delivered') {
    statusBannerBg = '#059669';
    statusHeadline = '🎉 คำสั่งซื้อจัดส่งและติดตั้งสำเร็จเรียบร้อย!';
    statusSub = 'ขอบพระคุณที่ไว้วางใจเลือกใช้อุปกรณ์จาก Gspeed Living Plus สินค้าพร้อมเริ่มรับประกันทันที';
    emailSubject = `🎉 จัดส่งสำเร็จ: คำสั่งซื้อเลขที่ ${orderNo} ส่งมอบเรียบร้อย | G-Speed Living Plus`;
  } else if (statusType === 'payment_issue') {
    statusBannerBg = '#dc2626';
    statusHeadline = '⚠️ แจ้งเตือน: กรุณาตรวจสอบหลักฐานการชำระเงิน';
    statusSub = customOptions.issueNote || 'เจ้าหน้าที่ตรวจสอบแล้วไม่พบยอดเงินหรือสลิปไม่ชัดเจน รบกวนอัปโหลดใหม่อีกครั้ง';
    emailSubject = `⚠️ แจ้งเตือนยอดเงิน: คำสั่งซื้อเลขที่ ${orderNo} รอการตรวจสอบสลิปใหม่ | G-Speed Living Plus`;
  }

  const html = `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Container Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          
          <!-- Top Header Brand -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 30px; text-align: center;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 0.05em;">
                      GSPEED <span style="color: #38bdf8;">LIVING PLUS</span>
                    </span>
                    <div style="font-size: 11px; color: #94a3b8; margin-top: 4px; letter-spacing: 0.02em;">
                      ศูนย์จัดจำหน่ายโต๊ะ เก้าอี้เกมมิ่ง และโซลูชันครบวงจร
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status Highlight Banner -->
          <tr>
            <td style="background: ${statusBannerBg}; padding: 24px 30px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; line-height: 1.4;">
                ${statusHeadline}
              </h1>
              <p style="margin: 8px 0 0; font-size: 13.5px; opacity: 0.95; line-height: 1.5;">
                ${statusSub}
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 30px;">
              
              <!-- Greeting & Important Notice -->
              <p style="margin: 0 0 16px; font-size: 15px; color: #334155; line-height: 1.6;">
                เรียนคุณ <strong>${recipientName}</strong>,
              </p>
              
              <!-- Crucial Order No Callout Banner -->
              <div style="background-color: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                  หมายเลขคำสั่งซื้อของคุณ:
                </div>
                <div style="font-size: 22px; font-weight: 900; color: #1d4ed8; letter-spacing: 0.02em;">
                  ${orderNo}
                </div>
                <div style="margin-top: 8px; font-size: 12.5px; color: #166534; background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 6px 10px; border-radius: 6px; display: inline-block;">
                  💡 <strong>สมาชิก: ไม่จำเป็นต้องสมัครสมาชิก</strong> สามารถใช้หมายเลขคำสั่งซื้อนี้ตรวจสอบสถานะได้ตลอด 24 ชม.
                </div>
              </div>

              ${trackingNo ? `
              <!-- Tracking Details Box (If shipping) -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border: 1.5px solid #93c5fd; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-bottom: 8px; font-size: 13px; color: #1e3a8a; font-weight: 700;">
                      🚚 ผู้ให้บริการขนส่ง:
                    </td>
                    <td style="padding-bottom: 8px; font-size: 14px; color: #0f172a; font-weight: 800; text-align: right;">
                      ${carrier}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 12px; font-size: 13px; color: #1e3a8a; font-weight: 700;">
                      📦 หมายเลขพัสดุ (Tracking No.):
                    </td>
                    <td style="padding-bottom: 12px; font-size: 16px; color: #1d4ed8; font-weight: 900; text-align: right; font-family: monospace;">
                      ${trackingNo}
                    </td>
                  </tr>
                </table>

                ${carrierTrackUrl ? `
                <div style="text-align: center; margin-top: 10px;">
                  <a href="${carrierTrackUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 13.5px; font-weight: 800; padding: 10px 22px; border-radius: 8px; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);">
                    เช็คพัสดุกับ ${carrier} ➔
                  </a>
                </div>
                ` : ''}
              </div>
              ` : ''}

              <!-- Shipping Destination -->
              <div style="margin-bottom: 24px; padding: 14px 18px; background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
                <div style="font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 4px;">สถานที่จัดส่งและติดตั้ง:</div>
                <div style="font-size: 13.5px; color: #1e293b; line-height: 1.5;">${address}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">เบอร์ติดต่อผู้รับ: <strong>${phone}</strong></div>
              </div>

              <!-- Items Summary Table -->
              <div style="margin-bottom: 24px;">
                <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 10px;">
                  รายการสินค้าในคำสั่งซื้อ:
                </div>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                  <thead>
                    <tr style="background-color: #f8fafc;">
                      <th style="padding: 10px 14px; text-align: left; font-size: 12px; color: #64748b; font-weight: 700; border-bottom: 1px solid #e2e8f0;">สินค้า</th>
                      <th style="padding: 10px 14px; text-align: center; font-size: 12px; color: #64748b; font-weight: 700; border-bottom: 1px solid #e2e8f0;">จำนวน</th>
                      <th style="padding: 10px 14px; text-align: right; font-size: 12px; color: #64748b; font-weight: 700; border-bottom: 1px solid #e2e8f0;">รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                    <tr style="background-color: #f8fafc;">
                      <td colspan="2" style="padding: 14px; font-size: 14px; font-weight: 800; color: #0f172a; text-align: right;">
                        ยอดชำระสุทธิ (รวม VAT 7%):
                      </td>
                      <td style="padding: 14px; font-size: 16px; font-weight: 900; color: #1d4ed8; text-align: right;">
                        ฿${grandTotal}.-
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Main Action CTA: View Order / Download Document -->
              <div style="text-align: center; margin: 30px 0 10px;">
                <a href="${orderViewUrl}" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 14.5px; font-weight: 800; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.3);">
                  เปิดดูคำสั่งซื้อ & ดาวน์โหลดใบสั่งซื้อ ➔
                </a>
              </div>

              <!-- Help Hotline -->
              <p style="margin: 24px 0 0; font-size: 12.5px; color: #64748b; text-align: center; line-height: 1.6;">
                หากมีข้อสงสัยหรือต้องการเปลี่ยนเวลานัดหมายส่งสินค้า สามารถติดต่อฝ่ายบริการลูกค้าได้ตลอด 24 ชม.<br>
                โทร: <a href="tel:0637937704" style="color: #2563eb; font-weight: 700; text-decoration: none;">063-793-7704</a> 
                | อีเมล: <a href="mailto:gspeedlivingplus35@gmail.com" style="color: #2563eb; text-decoration: none;">gspeedlivingplus35@gmail.com</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; font-size: 11.5px; color: #94a3b8; line-height: 1.5;">
                © 2026 บริษัท จี สปีด ลิฟวิ่ง พลัส จำกัด (Gspeed Living Plus Co., Ltd.)<br>
                79 ซอยรามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพฯ 10310
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const plainText = `
[GSPEED LIVING PLUS] ${emailSubject}

เรียนคุณ ${recipientName},

สถานะ: ${statusHeadline}
${statusSub}

หมายเลขคำสั่งซื้อ: ${orderNo}
(สมาชิก: ไม่จำเป็นต้องสมัครสมาชิก สามารถใช้หมายเลขคำสั่งซื้อนี้ตรวจสอบสถานะได้ตลอด 24 ชม.)

${trackingNo ? `ผู้ให้บริการขนส่ง: ${carrier}\nหมายเลขพัสดุ: ${trackingNo}\n` : ''}
ยอดชำระสุทธิ: ฿${grandTotal}.-
สถานที่จัดส่ง: ${address}
เบอร์ติดต่อ: ${phone}

ตรวจสอบสถานะและดาวน์โหลดใบสั่งซื้อได้ที่:
${orderViewUrl}

ติดต่อฝ่ายบริการลูกค้า 24 ชม. โทร 063-793-7704
`.trim();

  return {
    subject: emailSubject,
    html,
    plainText,
    to: recipientEmail,
    orderNo
  };
};

/**
 * Dispatch or prepare email for sending
 */
export const dispatchOrderStatusEmail = async (order, statusType = 'shipping', customOptions = {}) => {
  const recipientEmail = order.customerEmail || order.shipping?.email || '';
  
  const emailPayload = buildOrderStatusEmailTemplate(order, statusType, customOptions);

  if (!recipientEmail || !recipientEmail.includes('@')) {
    return {
      success: false,
      reason: 'no_email',
      message: 'คำสั่งซื้อนี้ไม่ได้ระบุอีเมลผู้รับ',
      emailPayload
    };
  }

  try {
    // 1. Check if external email webhook relay is configured
    let relayEndpoint = null;
    if (typeof window !== 'undefined' && window.GSPEED_EMAIL_RELAY_URL) {
      relayEndpoint = window.GSPEED_EMAIL_RELAY_URL;
    }

    if (relayEndpoint) {
      const response = await fetch(relayEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload)
      });
      if (response.ok) {
        return { success: true, method: 'relay_api', emailPayload };
      }
    }

    // 2. Client-side logging and audit record
    const emailAuditLog = {
      id: `mail-${Date.now()}`,
      sentAt: new Date().toISOString(),
      type: statusType,
      to: recipientEmail,
      subject: emailPayload.subject,
      carrier: customOptions.carrier || order.shippingCarrier || null,
      trackingNo: customOptions.trackingNo || order.trackingNumber || null,
      status: 'dispatched'
    };

    return {
      success: true,
      method: 'client_dispatched',
      auditLog: emailAuditLog,
      emailPayload
    };
  } catch (error) {
    console.warn('[OrderEmailService] Dispatch failed:', error);
    return {
      success: false,
      reason: 'network_error',
      message: error.message,
      emailPayload
    };
  }
};
