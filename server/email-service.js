import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*', // Allow requests from frontend domain and localhost
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple in-memory rate limiter (max 20 requests per IP per minute)
const rateLimitMap = new Map();
const rateLimitMiddleware = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 20;

  const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
  } else {
    clientData.count++;
  }

  rateLimitMap.set(ip, clientData);

  if (clientData.count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'ส่งคำขอบ่อยเกินไป กรุณารอ 1 นาทีก่อนลองใหม่ (Rate Limit Exceeded)'
    });
  }

  next();
};

app.use(rateLimitMiddleware);

/**
 * Creates a Nodemailer Transporter using either dynamic request config or .env defaults.
 */
function createTransporter(customConfig = {}) {
  const host = customConfig.host || process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(customConfig.port || process.env.SMTP_PORT || '465', 10);
  const secure = customConfig.secure !== undefined 
    ? Boolean(customConfig.secure) 
    : (customConfig.encryption === 'SSL/TLS' || port === 465 || process.env.SMTP_SECURE === 'true');
  const user = customConfig.user || customConfig.senderEmail || process.env.SMTP_USER || '';
  const pass = customConfig.pass || customConfig.password || process.env.SMTP_PASS || '';

  if (!user || !pass) {
    return {
      transporter: null,
      isConfigured: false,
      configInfo: { host, port, secure, user: user || '(ไม่ได้ระบุ)' }
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for 587
    auth: { user, pass },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production' // verify certificates in production
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });

  return {
    transporter,
    isConfigured: true,
    configInfo: { host, port, secure, user }
  };
}

/**
 * Branded HTML Email Template Wrapper
 */
function wrapHtmlEmail({ title, preheader, contentHtml, footerExtra = '' }) {
  return `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased; }
    .email-container { max-width: 620px; margin: 30px auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 32px 28px; text-align: center; color: #ffffff; }
    .brand-title { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; }
    .brand-sub { margin: 6px 0 0; font-size: 13px; color: #93c5fd; }
    .badge { display: inline-block; background: #f59e0b; color: #000; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 12px; margin-top: 10px; text-transform: uppercase; }
    .content { padding: 32px 28px; color: #1e293b; line-height: 1.65; font-size: 15px; }
    .info-card { background: #f8fafc; border-left: 4px solid #2563eb; border-radius: 8px; padding: 18px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .info-label { color: #64748b; font-weight: 600; }
    .info-value { color: #0f172a; font-weight: 700; text-align: right; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 22px 28px; text-align: center; font-size: 12px; color: #64748b; }
    .footer a { color: #2563eb; text-decoration: none; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader || title}
  </div>
  <div class="email-container">
    <div class="header">
      <h1 class="brand-title">GLP : G SPEED LIVING PLUS</h1>
      <p class="brand-sub">ศูนย์กีฬาอีสปอร์ตครบวงจร 24 ชม. & ระบบแฟรนไชส์จำลองผังร้าน 3D</p>
      <span class="badge">Ramkhamhaeng 53 • Official Notification</span>
    </div>
    <div class="content">
      ${contentHtml}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px;"><strong>GLP : G Speed Living Plus</strong> (รามคำแหง 53 กรุงเทพฯ)</p>
      <p style="margin: 0 0 6px;">โทร: <a href="tel:0818299882">081-829-9882</a> • อีเมล: <a href="mailto:contact@gspeedlivingplus.com">contact@gspeedlivingplus.com</a></p>
      <p style="margin: 0; color: #94a3b8; font-size: 11px;">ระบบส่งข้อความอัตโนมัติผ่าน Hostinger SMTP Server ปลอดภัยตามมาตรฐาน SSL/TLS</p>
      ${footerExtra}
    </div>
  </div>
</body>
</html>
  `;
}

// ==============================================================================
// 1. Health Check Endpoint
// ==============================================================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'glp-email-service',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'glp-email-service',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)
  });
});

// ==============================================================================
// 2. Test SMTP Connection Endpoint
// ==============================================================================
app.post('/api/test-smtp', async (req, res) => {
  try {
    const { smtpConfig } = req.body || {};
    const { transporter, isConfigured, configInfo } = createTransporter(smtpConfig);

    if (!isConfigured) {
      return res.status(400).json({
        success: false,
        error: 'ยังไม่ได้ระบุชื่อผู้ใช้ (SMTP User) หรือรหัสผ่าน (SMTP Password)',
        configInfo
      });
    }

    // Verify connection to Hostinger SMTP
    await transporter.verify();

    return res.json({
      success: true,
      message: `เชื่อมต่อ Hostinger SMTP สำเร็จเรียบร้อย! (${configInfo.host}:${configInfo.port}, SSL: ${configInfo.secure ? 'เปิด' : 'ปิด'})`,
      configInfo: {
        host: configInfo.host,
        port: configInfo.port,
        secure: configInfo.secure,
        user: configInfo.user
      },
      verifiedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[SMTP Test Error]:', error);
    return res.status(500).json({
      success: false,
      error: `การเชื่อมต่อ SMTP ล้มเหลว: ${error.message || 'Authentication error'}`,
      code: error.code || 'SMTP_CONNECT_FAILED'
    });
  }
});

// ==============================================================================
// 3. Generic Send Email Endpoint
// ==============================================================================
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, text, smtpConfig, attachments } = req.body || {};

    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        success: false,
        error: 'กรุณาระบุ to, subject และเนื้อหาอีเมล (html หรือ text)'
      });
    }

    const { transporter, isConfigured, configInfo } = createTransporter(smtpConfig);

    const senderName = smtpConfig?.senderName || process.env.SMTP_FROM_NAME || 'GLP Support';
    const senderEmail = smtpConfig?.senderEmail || configInfo.user || process.env.SMTP_FROM_EMAIL || 'contact@gspeedlivingplus.com';
    const fromAddress = `"${senderName}" <${senderEmail}>`;

    // Simulation fallback if no credentials configured yet
    if (!isConfigured) {
      console.warn('[SMTP Warning]: No credentials provided. Simulating email delivery.');
      return res.json({
        success: true,
        simulated: true,
        message: 'จำลองการส่งสำเร็จ (เนื่องจากยังไม่ได้ระบุ SMTP User/Password ใน .env หรือ Admin)',
        deliveredTo: to,
        subject,
        timestamp: new Date().toISOString()
      });
    }

    const mailOptions = {
      from: fromAddress,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      text: text || '',
      html: html || text,
      attachments: Array.isArray(attachments) ? attachments : []
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('[Email Delivered]:', info.messageId, 'to:', to);

    return res.json({
      success: true,
      messageId: info.messageId,
      response: info.response,
      deliveredTo: to,
      sentAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Send Email Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'ส่งอีเมลไม่สำเร็จ',
      code: error.code || 'SEND_MAIL_ERROR'
    });
  }
});

// ==============================================================================
// 4. Contact Form Inquiries: Auto-Reply & Staff Alerts
// ==============================================================================
app.post('/api/contact-inquiry', async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      email, 
      subject, 
      message, 
      inquiryRef = `GLP-INQ-${Date.now().toString().slice(-6)}`,
      smtpConfig,
      staffEmails = []
    } = req.body || {};

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'กรุณากรอกชื่อ เบอร์โทร และข้อความติดต่อให้ครบถ้วน'
      });
    }

    const { transporter, isConfigured, configInfo } = createTransporter(smtpConfig);
    const senderName = smtpConfig?.senderName || 'GLP Support Team';
    const senderEmail = smtpConfig?.senderEmail || configInfo.user || 'contact@gspeedlivingplus.com';
    const fromAddress = `"${senderName}" <${senderEmail}>`;

    let customerSent = false;
    let staffSentCount = 0;
    const errors = [];

    // A. Send Customer Auto-Reply Email (if customer provided email)
    if (email && email.includes('@')) {
      const customerHtml = wrapHtmlEmail({
        title: `ขอบพระคุณที่ติดต่อ GLP (${inquiryRef})`,
        preheader: `เราได้รับข้อความติดต่อของคุณ ${name} เรียบร้อยแล้ว ทีมงานจะติดต่อกลับโดยเร็วที่สุด`,
        contentHtml: `
          <h2 style="color: #0f172a; margin-top: 0;">เรียน คุณ${name},</h2>
          <p>ขอบพระคุณที่ให้ความสนใจและติดต่อสอบถามเข้ามายัง <strong>GLP : G Speed Living Plus</strong> รามคำแหง 53</p>
          <p>ระบบได้รับข้อความของคุณเรียบร้อยแล้ว โดยมีหมายเลขอ้างอิงดังนี้:</p>
          
          <div class="info-card">
            <div class="info-row">
              <span class="info-label">เลขอ้างอิง (Ref No.):</span>
              <span class="info-value" style="color: #2563eb;">${inquiryRef}</span>
            </div>
            <div class="info-row">
              <span class="info-label">หัวข้อติดต่อ:</span>
              <span class="info-value">${subject || 'สอบถามข้อมูลทั่วไป'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">เบอร์โทรศัพท์ของคุณ:</span>
              <span class="info-value">${phone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ข้อความของคุณ:</span>
              <span class="info-value" style="font-weight: 500; font-style: italic;">"${message}"</span>
            </div>
          </div>

          <p>เจ้าหน้าที่ฝ่ายบริการลูกค้าของเราจะตรวจสอบและติดต่อกลับหาท่านตามเบอร์โทรศัพท์ที่แจ้งไว้โดยเร็วที่สุดครับ</p>
          <p style="margin-top: 24px;">ขอแสดงความนับถือ,<br><strong>ทีมงาน GLP : G Speed Living Plus</strong></p>
        `
      });

      if (isConfigured) {
        try {
          await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject: `[GLP Contact] ขอบพระคุณที่ติดต่อ GLP : G Speed Living Plus (เลขอ้างอิง ${inquiryRef})`,
            html: customerHtml
          });
          customerSent = true;
        } catch (err) {
          console.error('[Customer Auto-Reply Error]:', err);
          errors.push(`Customer email failed: ${err.message}`);
        }
      } else {
        customerSent = true; // Simulated
      }
    }

    // B. Send Staff Alert Notifications (up to 5 staff emails)
    const alertRecipients = Array.isArray(staffEmails) && staffEmails.length > 0 
      ? staffEmails 
      : (process.env.STAFF_NOTIFICATION_EMAILS ? process.env.STAFF_NOTIFICATION_EMAILS.split(',').map(s => s.trim()) : []);

    if (alertRecipients.length > 0) {
      const staffHtml = wrapHtmlEmail({
        title: `[แจ้งเตือน] มีข้อความติดต่อใหม่จากเว็บไซต์: ${name}`,
        preheader: `คุณ ${name} เบอร์ ${phone} ส่งข้อความติดต่อเข้ามาใหม่`,
        contentHtml: `
          <h2 style="color: #dc2626; margin-top: 0;">⚡ มีข้อความติดต่อใหม่จากหน้าเว็บไซต์!</h2>
          <p>มีผู้เข้าชมเว็บไซต์ได้ส่งแบบฟอร์มติดต่อสอบถามเข้ามาใหม่ กรุณาตรวจสอบและติดต่อกลับโดยเร็ว:</p>
          
          <div class="info-card" style="border-left-color: #dc2626;">
            <div class="info-row">
              <span class="info-label">เลขอ้างอิง:</span>
              <span class="info-value">${inquiryRef}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ชื่อผู้ติดต่อ:</span>
              <span class="info-value">${name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">เบอร์โทรศัพท์:</span>
              <span class="info-value"><a href="tel:${phone}" style="color: #2563eb; font-size: 16px;">${phone}</a></span>
            </div>
            <div class="info-row">
              <span class="info-label">อีเมลลูกค้า:</span>
              <span class="info-value">${email || 'ไม่ได้ระบุ'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">หัวข้อ:</span>
              <span class="info-value">${subject || 'สอบถามข้อมูลทั่วไป'}</span>
            </div>
            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #cbd5e1;">
              <span class="info-label">เนื้อหาข้อความ:</span>
              <p style="margin: 6px 0 0; color: #0f172a; font-weight: 600; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <p style="font-size: 13px; color: #64748b;">* อีเมลนี้ส่งแจ้งเตือนอัตโนมัติถึงทีมงานที่ตั้งค่าไว้ในระบบ CMS</p>
        `
      });

      if (isConfigured) {
        for (const staffEmail of alertRecipients) {
          if (!staffEmail || !staffEmail.includes('@')) continue;
          try {
            await transporter.sendMail({
              from: fromAddress,
              to: staffEmail,
              subject: `[ALERT] ข้อความติดต่อใหม่: คุณ${name} (${phone}) - ${subject || 'ทั่วไป'}`,
              html: staffHtml
            });
            staffSentCount++;
          } catch (err) {
            console.error(`[Staff Alert Error for ${staffEmail}]:`, err);
            errors.push(`Staff alert to ${staffEmail} failed: ${err.message}`);
          }
        }
      } else {
        staffSentCount = alertRecipients.length; // Simulated
      }
    }

    return res.json({
      success: true,
      inquiryRef,
      simulated: !isConfigured,
      customerEmailSent: customerSent,
      staffEmailsSent: staffSentCount,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Contact Inquiry Handler Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'เกิดข้อผิดพลาดในการบันทึกและส่งอีเมล'
    });
  }
});

// ==============================================================================
// 5. Franchise 3D Quote: Customer Quotation & Staff Alerts
// ==============================================================================
app.post('/api/franchise-quote', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      location,
      budget,
      pcCount,
      quoteRef = `GLP-Q2026-${Date.now().toString().slice(-6)}`,
      itemsSummary = [],
      smtpConfig,
      staffEmails = []
    } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'กรุณากรอกชื่อและเบอร์โทรศัพท์สำหรับรับใบเสนอราคา'
      });
    }

    const { transporter, isConfigured, configInfo } = createTransporter(smtpConfig);
    const senderName = smtpConfig?.senderName || 'GLP Franchise Business Team';
    const senderEmail = smtpConfig?.senderEmail || configInfo.user || 'contact@gspeedlivingplus.com';
    const fromAddress = `"${senderName}" <${senderEmail}>`;

    let customerSent = false;
    let staffSentCount = 0;

    // Customer Quotation Email
    if (email && email.includes('@')) {
      const customerHtml = wrapHtmlEmail({
        title: `ใบเสนอราคาและสรุปสเปกผังร้านแฟรนไชส์ 3D (${quoteRef})`,
        preheader: `สรุปสเปกและแพ็กเกจแฟรนไชส์ GLP Esport Arena สำหรับคุณ ${name}`,
        contentHtml: `
          <h2 style="color: #0f172a; margin-top: 0;">เรียน คุณ${name},</h2>
          <p>ขอบพระคุณที่ร่วมวางแผนและจำลองผังร้านแฟรนไชส์อีสปอร์ตผ่านระบบ <strong>GLP 3D Studio & Planner</strong></p>
          <p>สรุปรายละเอียดการประเมินราคาและสเปกโครงสร้างเบื้องต้นของคุณมีดังนี้:</p>

          <div class="info-card">
            <div class="info-row">
              <span class="info-label">เลขอ้างอิงใบเสนอราคา:</span>
              <span class="info-value" style="color: #2563eb; font-size: 16px;">${quoteRef}</span>
            </div>
            <div class="info-row">
              <span class="info-label">จำนวนเครื่องคอมพิวเตอร์:</span>
              <span class="info-value">${pcCount || 'ตามที่กำหนด'} เครื่อง</span>
            </div>
            <div class="info-row">
              <span class="info-label">ทำเล / จังหวัดที่ตั้ง:</span>
              <span class="info-value">${location || 'ไม่ระบุ'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">งบประมาณที่วางไว้:</span>
              <span class="info-value">${budget ? Number(budget).toLocaleString() + ' บาท' : 'ตามสเปก'}</span>
            </div>
          </div>

          <p>ทีมงานที่ปรึกษาการลงทุนแฟรนไชส์ GLP จะทำการวิเคราะห์จุดคืนทุน (ROI) และเตรียมเอกสารแผนธุรกิจฉบับเต็มเพื่อนำเสนอแก่ท่านในขั้นตอนถัดไปครับ</p>
          <p style="margin-top: 24px;">ขอแสดงความนับถือ,<br><strong>ทีมงานฝ่ายพัฒนาธุรกิจแฟรนไชส์ GLP</strong></p>
        `
      });

      if (isConfigured) {
        try {
          await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject: `[GLP Franchise] ใบเสนอราคาและสรุปสเปกผังร้าน 3D (เลขอ้างอิง ${quoteRef})`,
            html: customerHtml
          });
          customerSent = true;
        } catch (err) {
          console.error('[Franchise Quote Email Error]:', err);
        }
      } else {
        customerSent = true; // Simulated
      }
    }

    // Staff Alert
    const alertRecipients = Array.isArray(staffEmails) && staffEmails.length > 0 
      ? staffEmails 
      : (process.env.STAFF_NOTIFICATION_EMAILS ? process.env.STAFF_NOTIFICATION_EMAILS.split(',').map(s => s.trim()) : []);

    if (alertRecipients.length > 0) {
      const staffHtml = wrapHtmlEmail({
        title: `🔥 [LEAD แฟรนไชส์ใหม่] คุณ${name} ขอใบเสนอราคา ${quoteRef}`,
        preheader: `มีลีดแฟรนไชส์ใหม่: คุณ ${name} (${phone}) ทำเล ${location || 'ไม่ระบุ'}`,
        contentHtml: `
          <h2 style="color: #d97706; margin-top: 0;">🔥 มีผู้สนใจลงทุนแฟรนไชส์กดขอใบเสนอราคาใหม่!</h2>
          <p>รายละเอียดลีดและสเปกที่ลูกค้าจำลองไว้ใน 3D Studio:</p>

          <div class="info-card" style="border-left-color: #d97706;">
            <div class="info-row">
              <span class="info-label">เลขอ้างอิง:</span>
              <span class="info-value">${quoteRef}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ชื่อผู้ขอใบเสนอราคา:</span>
              <span class="info-value">${name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">เบอร์โทรศัพท์:</span>
              <span class="info-value"><a href="tel:${phone}" style="color: #2563eb; font-size: 16px;">${phone}</a></span>
            </div>
            <div class="info-row">
              <span class="info-label">อีเมล:</span>
              <span class="info-value">${email || 'ไม่ได้ระบุ'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ทำเลเป้าหมาย:</span>
              <span class="info-value">${location || 'ไม่ระบุ'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">จำนวนเครื่อง:</span>
              <span class="info-value">${pcCount || '-'} เครื่อง</span>
            </div>
          </div>

          <p style="font-size: 14px; font-weight: 700; color: #dc2626;">* กรุณาโทรติดต่อกลับเพื่อแนะนำแพ็กเกจและนัดหมายดูทำเลจริง</p>
        `
      });

      if (isConfigured) {
        for (const staffEmail of alertRecipients) {
          if (!staffEmail || !staffEmail.includes('@')) continue;
          try {
            await transporter.sendMail({
              from: fromAddress,
              to: staffEmail,
              subject: `[LEAD แฟรนไชส์] คุณ${name} (${phone}) - ${pcCount || 'ผัง 3D'} เครื่อง`,
              html: staffHtml
            });
            staffSentCount++;
          } catch (err) {
            console.error(`[Staff Alert Error for ${staffEmail}]:`, err);
          }
        }
      } else {
        staffSentCount = alertRecipients.length; // Simulated
      }
    }

    return res.json({
      success: true,
      quoteRef,
      simulated: !isConfigured,
      customerEmailSent: customerSent,
      staffEmailsSent: staffSentCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Franchise Quote Handler Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'เกิดข้อผิดพลาดในการประมวลผลใบเสนอราคา'
    });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 GLP Hostinger SMTP Email Service Running on Port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  console.log(`📧 Hostinger SMTP Host: ${process.env.SMTP_HOST || 'smtp.hostinger.com:465'}`);
  console.log(`=======================================================`);
});
