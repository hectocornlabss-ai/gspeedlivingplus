import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
// Internal microservice MUST strictly use port 3001, immune to Coolify's PORT=3000 override
const PORT = 3001;

// Persistent CMS Data Directory (mounted to Docker volume on production)
const defaultDataDir = fs.existsSync('/app/server/data') 
  ? '/app/server/data' 
  : (fs.existsSync('/app/data') ? '/app/data' : path.join(__dirname, 'data'));
const DATA_DIR = process.env.DATA_DIR || defaultDataDir;
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const SITE_DATA_FILE = path.join(DATA_DIR, 'site-data.json');

// Load default metadata fallback for activities, tournaments & news
let defaultMeta = { gallery: [], tournaments: [], news: [] };
try {
  const metaPath = path.join(__dirname, 'default-meta.json');
  if (fs.existsSync(metaPath)) {
    defaultMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    console.log(`[Meta] Loaded default metadata fallback (${defaultMeta.gallery?.length || 0} activities, ${defaultMeta.tournaments?.length || 0} tournaments, ${defaultMeta.news?.length || 0} news)`);
  }
} catch (e) {
  console.warn('[Meta] Warning reading default-meta.json:', e.message);
}

// Ensure database and uploads directories exist
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const SEED_SITE_DATA_FILE = path.join(__dirname, 'default-site-data.json');
try {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  // Auto-seed database from default-site-data.json if site-data.json is missing on fresh deploy
  if (!fs.existsSync(SITE_DATA_FILE) && fs.existsSync(SEED_SITE_DATA_FILE)) {
    fs.copyFileSync(SEED_SITE_DATA_FILE, SITE_DATA_FILE);
    console.log('[Database] Auto-seeded persistent site-data.json from default-site-data.json');
  }
} catch (dirErr) {
  console.warn('[Database] Directory init warning:', dirErr.message);
}

// Middleware
app.use(cors({
  origin: '*', // Allow requests from frontend domain and localhost
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve persistent uploads statically
app.use('/uploads', express.static(UPLOADS_DIR));
const publicUploads = path.resolve(__dirname, '..', 'public', 'uploads');
if (fs.existsSync(publicUploads)) {
  app.use('/uploads', express.static(publicUploads));
}

// Simple in-memory rate limiter (exempts /api/site-data, /api/upload-media, and /health)
const rateLimitMap = new Map();
const rateLimitMiddleware = (req, res, next) => {
  // Never rate-limit database queries, file uploads, or health checks
  if (req.path.startsWith('/api/site-data') || req.path.startsWith('/api/upload-media') || req.path === '/health' || req.method === 'GET') {
    return next();
  }

  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 30;

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

  // Intelligent fallback for user
  let user = customConfig.user || customConfig.senderEmail || '';
  if (!user || user.includes('example.com') || user.includes('@gspeedlivingplus.com') || user.includes('@gspeed-esport.com')) {
    user = process.env.SMTP_USER || 'order@cyber-wp.com';
  }

  // Intelligent fallback for password
  let pass = customConfig.pass || customConfig.password || '';
  // If pass is masked (contains bullet '•') or empty, fallback to process.env.SMTP_PASS
  if (!pass || pass.includes('•') || pass.trim() === '') {
    pass = process.env.SMTP_PASS || '';
  }

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
      <p style="margin: 0 0 6px;">โทร: <a href="tel:0637937704">063-793-7704</a> • อีเมล: <a href="mailto:gspeedlivingplus35@gmail.com">gspeedlivingplus35@gmail.com</a></p>
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

    const senderName = process.env.SMTP_FROM_NAME || smtpConfig?.senderName || 'GLP Support';
    const senderEmail = process.env.SMTP_FROM_EMAIL || configInfo.user || (smtpConfig?.senderEmail && !smtpConfig.senderEmail.includes('gspeedlivingplus35') ? smtpConfig.senderEmail : 'order@cyber-wp.com');
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
    const senderName = process.env.SMTP_FROM_NAME || smtpConfig?.senderName || 'GLP Support Team';
    const senderEmail = process.env.SMTP_FROM_EMAIL || configInfo.user || (smtpConfig?.senderEmail && !smtpConfig.senderEmail.includes('gspeedlivingplus35') ? smtpConfig.senderEmail : 'order@cyber-wp.com');
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
      storeType,
      roomDimensions,
      themeName,
      themeDesc,
      costBreakdown,
      placedModulesCount,
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
    const senderName = process.env.SMTP_FROM_NAME || smtpConfig?.senderName || 'GLP Franchise Business Team';
    const senderEmail = process.env.SMTP_FROM_EMAIL || configInfo.user || (smtpConfig?.senderEmail && !smtpConfig.senderEmail.includes('gspeedlivingplus35') ? smtpConfig.senderEmail : 'order@cyber-wp.com');
    const fromAddress = `"${senderName}" <${senderEmail}>`;

    let customerSent = false;
    let staffSentCount = 0;

    // Helper to format currency
    const fmtTHB = (val) => val ? `฿${Number(val).toLocaleString()} บาท` : '-';

    // Build Cost Breakdown HTML Table
    const breakdownTableHtml = costBreakdown ? `
      <div style="margin: 20px 0; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <div style="background: #f1f5f9; padding: 10px 14px; font-weight: 700; color: #1e293b; font-size: 13px; border-bottom: 1px solid #cbd5e1;">
          📋 สรุปประมาณการงบประมาณลงทุนแยกตามหมวด (BOQ Breakdown)
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tbody>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 14px; color: #475569;">1. เครื่องคอมพิวเตอร์ & มอนิเตอร์เกมมิ่ง (${pcCount || '-'} เครื่อง)</td>
              <td style="padding: 9px 14px; text-align: right; font-weight: 600; color: #0f172a;">${fmtTHB(costBreakdown.hardware)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
              <td style="padding: 9px 14px; color: #475569;">2. ชุดโต๊ะคอม & เก้าอี้เกมมิ่ง Ergonomic (${placedModulesCount ? placedModulesCount + ' โมดูล' : 'ครบชุด'})</td>
              <td style="padding: 9px 14px; text-align: right; font-weight: 600; color: #0f172a;">${fmtTHB(costBreakdown.furniture)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 14px; color: #475569;">3. ตกแต่งภายใน ระบบฝ้า แสงสี & Acoustic (${themeName || 'ตามธีมที่เลือก'})</td>
              <td style="padding: 9px 14px; text-align: right; font-weight: 600; color: #0f172a;">${fmtTHB(costBreakdown.interiorDecor)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
              <td style="padding: 9px 14px; color: #475569;">4. ระบบปรับอากาศ Inverter Cassette Type</td>
              <td style="padding: 9px 14px; text-align: right; font-weight: 600; color: #0f172a;">${fmtTHB(costBreakdown.aircon)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 9px 14px; color: #475569;">5. เซิร์ฟเวอร์แม่ข่าย Diskless Enterprise & เน็ตเวิร์ก 10G Dual Fiber</td>
              <td style="padding: 9px 14px; text-align: right; font-weight: 600; color: #0f172a;">${fmtTHB(Number(costBreakdown.diskless || 0) + Number(costBreakdown.network || 0))}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
              <td style="padding: 9px 14px; color: #475569;">6. ระบบ POS บัญชีคลาวด์ & กล้องวงจรปิด CCTV</td>
              <td style="padding: 9px 14px; text-align: right; font-weight: 600; color: #0f172a;">${fmtTHB(costBreakdown.billing)}</td>
            </tr>
            <tr style="border-bottom: 2px solid #2563eb;">
              <td style="padding: 9px 14px; color: #475569;">7. ลิขสิทธิ์แฟรนไชส์ GLP แบรนดิ้ง & อบรมบริหารจัดการ</td>
              <td style="padding: 9px 14px; text-align: right; font-weight: 600; color: #0f172a;">${fmtTHB(costBreakdown.franchiseFee)}</td>
            </tr>
            <tr style="background: #eff6ff;">
              <td style="padding: 12px 14px; font-weight: 800; color: #1e3a8a; font-size: 14px;">รวมงบประมาณลงทุนเบื้องต้นทั้งสิ้น</td>
              <td style="padding: 12px 14px; text-align: right; font-weight: 800; color: #1d4ed8; font-size: 16px;">${fmtTHB(costBreakdown.totalInvestment || budget)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    ` : '';

    // Customer Quotation Email
    if (email && email.includes('@')) {
      const customerHtml = wrapHtmlEmail({
        title: `ใบเสนอราคาและสรุปสเปกผังร้านแฟรนไชส์ 3D (${quoteRef})`,
        preheader: `สรุปสเปกและแพ็กเกจแฟรนไชส์ GLP Esport Arena สำหรับคุณ ${name}`,
        contentHtml: `
          <h2 style="color: #0f172a; margin-top: 0;">เรียน คุณ${name},</h2>
          <p>ขอบพระคุณเป็นอย่างยิ่งที่ท่านได้ร่วมวางแผนและจำลองผังร้านแฟรนไชส์อีสปอร์ตผ่านระบบ <strong>GLP 3D Studio & Planner</strong></p>
          <p>ทีมวิศวกรและที่ปรึกษาการลงทุนแฟรนไชส์ GLP ได้รับข้อมูลสเปกผังร้านของท่านเรียบร้อยแล้ว โดยมีรายละเอียดสรุปเบื้องต้นดังนี้:</p>

          <div class="info-card">
            <div class="info-row">
              <span class="info-label">เลขอ้างอิงใบเสนอราคา:</span>
              <span class="info-value" style="color: #2563eb; font-size: 16px;">${quoteRef}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ธีมการตกแต่งร้านที่เลือก:</span>
              <span class="info-value" style="color: #0f172a;">${themeName || 'G-Speed Royal Modern'}</span>
            </div>
            ${themeDesc ? `<div style="font-size: 12px; color: #64748b; margin: -4px 0 8px 0; text-align: right;">${themeDesc}</div>` : ''}
            <div class="info-row">
              <span class="info-label">ขนาดห้องและพื้นที่:</span>
              <span class="info-value">${roomDimensions || 'ตามที่กำหนดในระบบ'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ประเภทอาคาร:</span>
              <span class="info-value">${storeType || 'อาคารพาณิชย์'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">จำนวนเครื่องคอมพิวเตอร์:</span>
              <span class="info-value" style="color: #10b981; font-size: 15px;">${pcCount || '-'} เครื่อง</span>
            </div>
            <div class="info-row">
              <span class="info-label">ทำเล / จังหวัดที่ตั้งเป้าหมาย:</span>
              <span class="info-value">${location || 'ไม่ระบุ'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ประมาณการงบลงทุนรวม:</span>
              <span class="info-value" style="color: #1d4ed8; font-size: 16px;">${fmtTHB(budget)}</span>
            </div>
          </div>

          ${breakdownTableHtml}

          <p><strong>ขั้นตอนถัดไป:</strong> ทีมงานฝ่ายพัฒนาธุรกิจแฟรนไชส์ GLP กำลังจัดทำรายงานศึกษาความเป็นไปได้ (Feasibility Study) และจะติดต่อกลับหาคุณ ${name} ที่เบอร์ <strong style="color: #2563eb;">${phone}</strong> ภายใน 24 ชั่วโมง เพื่อให้คำปรึกษาเชิงลึกและส่งมอบเอกสารแผนธุรกิจฉบับสมบูรณ์ครับ</p>
          <p style="margin-top: 24px;">ขอแสดงความนับถือ,<br><strong>ทีมงานฝ่ายพัฒนาธุรกิจแฟรนไชส์ GLP : G Speed Living Plus</strong></p>
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
        preheader: `มีลีดแฟรนไชส์ใหม่: คุณ ${name} (${phone}) ทำเล ${location || 'ไม่ระบุ'} - ${pcCount || 'ผัง 3D'} เครื่อง`,
        contentHtml: `
          <h2 style="color: #d97706; margin-top: 0;">🔥 มีผู้สนใจลงทุนแฟรนไชส์กดขอใบเสนอราคาใหม่!</h2>
          <p>รายละเอียดลีดและสเปกที่ลูกค้าได้จำลองไว้ผ่านระบบ 3D Floorplanner บนเว็บไซต์:</p>

          <div class="info-card" style="border-left-color: #d97706;">
            <div class="info-row">
              <span class="info-label">เลขอ้างอิงใบเสนอราคา:</span>
              <span class="info-value" style="color: #d97706; font-size: 16px;">${quoteRef}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ชื่อผู้ขอใบเสนอราคา:</span>
              <span class="info-value" style="font-size: 16px;">${name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">เบอร์โทรศัพท์ (กดโทรได้เลย):</span>
              <span class="info-value"><a href="tel:${phone}" style="color: #2563eb; font-size: 16px; font-weight: 800;">${phone}</a></span>
            </div>
            <div class="info-row">
              <span class="info-label">อีเมลลูกค้า:</span>
              <span class="info-value"><a href="mailto:${email || ''}" style="color: #2563eb;">${email || 'ไม่ได้ระบุ'}</a></span>
            </div>
            <div class="info-row">
              <span class="info-label">ทำเลเป้าหมาย:</span>
              <span class="info-value">${location || 'ไม่ระบุ'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ประเภทอาคาร:</span>
              <span class="info-value">${storeType || 'อาคารพาณิชย์'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ขนาดห้องและพื้นที่:</span>
              <span class="info-value">${roomDimensions || '-'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ธีมการตกแต่งร้านที่ลูกค้าเลือก:</span>
              <span class="info-value" style="color: #2563eb;">${themeName || 'G-Speed Royal Modern'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">จำนวนเครื่องคอมพิวเตอร์:</span>
              <span class="info-value" style="color: #10b981; font-size: 15px;">${pcCount || '-'} เครื่อง</span>
            </div>
            <div class="info-row">
              <span class="info-label">งบประมาณที่ลูกค้าประเมิน:</span>
              <span class="info-value" style="color: #1d4ed8; font-size: 16px;">${fmtTHB(budget)}</span>
            </div>
          </div>

          ${breakdownTableHtml}

          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px 16px; margin-top: 16px;">
            <p style="margin: 0; font-size: 14px; font-weight: 700; color: #dc2626;">
              ⚡ ข้อปฏิบัติทีมงาน (SLA 24 ชม.): กรุณาโทรติดต่อคุณ ${name} ที่เบอร์ <a href="tel:${phone}" style="color: #dc2626; text-decoration: underline;">${phone}</a> เพื่อแนะนำแพ็กเกจและนัดหมายวิเคราะห์ทำเลจริง
            </p>
          </div>
        `
      });

      if (isConfigured) {
        for (const staffEmail of alertRecipients) {
          if (!staffEmail || !staffEmail.includes('@')) continue;
          try {
            await transporter.sendMail({
              from: fromAddress,
              to: staffEmail,
              subject: `[LEAD แฟรนไชส์] คุณ${name} (${phone}) - ${pcCount || 'ผัง 3D'} เครื่อง (${themeName || 'Royal'})`,
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

// ==============================================================================
// 6. Server-Side File Download Streaming Endpoints (For Exports / Blueprints)
// ==============================================================================
const fileDownloadCache = new Map();

// Periodic cleanup of expired download files (3-minute TTL)
setInterval(() => {
  const now = Date.now();
  for (const [id, item] of fileDownloadCache.entries()) {
    if (now > item.expiresAt) {
      fileDownloadCache.delete(id);
    }
  }
}, 60 * 1000);

app.post('/api/prepare-download', (req, res) => {
  try {
    const { dataUrl, filename, mimeType } = req.body || {};
    if (!dataUrl) {
      return res.status(400).json({ success: false, error: 'dataUrl is required' });
    }
    const fileId = 'dl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    fileDownloadCache.set(fileId, {
      dataUrl,
      filename: (filename || 'download.bin').replace(/[^\w.-]/g, '_'),
      mimeType: mimeType || 'application/octet-stream',
      expiresAt: Date.now() + 180000 // 3 minutes TTL
    });
    return res.json({ success: true, fileId });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/download-file', (req, res) => {
  try {
    const fileId = req.query.id;
    const cached = fileId ? fileDownloadCache.get(fileId) : null;
    if (!cached || !cached.dataUrl) {
      return res.status(404).send('Download link expired or not found. Please try downloading again.');
    }

    const base64Data = cached.dataUrl.includes(',') ? cached.dataUrl.split(',')[1] : cached.dataUrl;
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = (cached.filename || 'download.bin').replace(/[^\w.-]/g, '_');
    const mimeType = cached.mimeType || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.send(buffer);
  } catch (err) {
    return res.status(500).send('Error processing download: ' + err.message);
  }
});

// ==============================================================================
// 7. Persistent CMS Site Data Storage (Mounted Docker Volume Database)
// ==============================================================================

// Helper: Prune old backup files to keep only latest N files
function pruneOldBackups(maxKeep = 10) {
  try {
    if (!fs.existsSync(BACKUP_DIR)) return;
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('site-data-') && f.endsWith('.json'))
      .map(f => {
        const fullPath = path.join(BACKUP_DIR, f);
        const stats = fs.statSync(fullPath);
        return { name: f, path: fullPath, mtime: stats.mtime.getTime() };
      })
      .sort((a, b) => b.mtime - a.mtime);

    if (files.length > maxKeep) {
      const toDelete = files.slice(maxKeep);
      for (const item of toDelete) {
        try {
          fs.unlinkSync(item.path);
          console.log(`[Database] Pruned old backup: ${item.name}`);
        } catch (e) {
          console.warn(`[Database] Failed to prune backup ${item.name}:`, e.message);
        }
      }
    }
  } catch (err) {
    console.warn('[Database] Prune error:', err.message);
  }
}

// ==============================================================================
// 5. Persistent Orders Database Endpoints (Cross-Device Real-Time Sync)
// ==============================================================================
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SEED_ORDERS_FILE = path.join(__dirname, 'default-orders.json');
const DELETED_ORDERS_FILE = path.join(DATA_DIR, 'deleted-orders.json');

function getDeletedOrderNos() {
  try {
    if (fs.existsSync(DELETED_ORDERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(DELETED_ORDERS_FILE, 'utf8'));
      if (Array.isArray(data)) return data;
    }
  } catch (e) {}
  return [];
}

function recordDeletedOrderNo(orderNo) {
  try {
    const list = getDeletedOrderNos();
    const clean = (orderNo || '').toLowerCase().trim();
    if (clean && !list.includes(clean)) {
      list.push(clean);
      fs.writeFileSync(DELETED_ORDERS_FILE, JSON.stringify(list, null, 2), 'utf8');
    }
  } catch (e) {}
}

function getStoredOrders() {
  try {
    if (!fs.existsSync(ORDERS_FILE) && fs.existsSync(SEED_ORDERS_FILE)) {
      try { fs.copyFileSync(SEED_ORDERS_FILE, ORDERS_FILE); } catch (e) {}
    }
    if (fs.existsSync(ORDERS_FILE)) {
      const content = fs.readFileSync(ORDERS_FILE, 'utf8');
      const list = JSON.parse(content);
      const deletedNos = getDeletedOrderNos();
      if (deletedNos.length > 0 && Array.isArray(list)) {
        return list.filter(o => o.orderNo && !deletedNos.includes(o.orderNo.toLowerCase().trim()));
      }
      return list;
    }
  } catch (err) {
    console.warn('[Orders] Read error:', err.message);
  }
  return [];
}

function saveStoredOrders(orders) {
  try {
    const tmp = `${ORDERS_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tmp, JSON.stringify(orders, null, 2), 'utf8');
    try {
      fs.renameSync(tmp, ORDERS_FILE);
    } catch (rErr) {
      fs.copyFileSync(tmp, ORDERS_FILE);
      try { fs.unlinkSync(tmp); } catch (u) {}
    }
    return true;
  } catch (err) {
    console.warn('[Orders] Save error:', err.message);
    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
      return true;
    } catch (e) {
      return false;
    }
  }
}

// GET /api/orders - Fetch all persisted orders across all devices
app.get('/api/orders', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  const orders = getStoredOrders();
  const deletedOrderNos = getDeletedOrderNos();
  res.json({ success: true, orders, deletedOrderNos, totalCount: orders.length });
});

// POST /api/orders - Save or update an order
app.post('/api/orders', (req, res) => {
  try {
    const incoming = req.body?.order || req.body;
    if (!incoming || !incoming.orderNo) {
      return res.status(400).json({ success: false, error: 'Order data with orderNo is required' });
    }

    const cleanNo = (incoming.orderNo || '').toLowerCase().trim();
    const deletedNos = getDeletedOrderNos();
    const currentOrders = getStoredOrders();

    // If order was explicitly deleted, reject resurrecting it
    if (deletedNos.includes(cleanNo)) {
      return res.json({ success: true, ignored: true, orders: currentOrders });
    }

    const existingIndex = currentOrders.findIndex(
      o => o.orderNo && o.orderNo.toLowerCase().trim() === cleanNo
    );

    if (existingIndex > -1) {
      currentOrders[existingIndex] = {
        ...currentOrders[existingIndex],
        ...incoming,
        updatedAt: incoming.updatedAt || new Date().toISOString()
      };
    } else {
      currentOrders.unshift({
        ...incoming,
        createdAt: incoming.createdAt || new Date().toISOString(),
        updatedAt: incoming.updatedAt || new Date().toISOString()
      });
    }

    saveStoredOrders(currentOrders);
    console.log(`[Orders] Saved/Updated order: ${incoming.orderNo} (Total: ${currentOrders.length})`);
    return res.json({ success: true, orders: currentOrders, deletedOrderNos: deletedNos });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/orders/:orderNo - Delete an order
app.delete('/api/orders/:orderNo', (req, res) => {
  try {
    const { orderNo } = req.params;
    const cleanNo = (orderNo || '').toLowerCase().trim();
    recordDeletedOrderNo(cleanNo);

    const currentOrders = getStoredOrders();
    const filtered = currentOrders.filter(
      o => o.orderNo && o.orderNo.toLowerCase().trim() !== cleanNo
    );
    saveStoredOrders(filtered);
    console.log(`[Orders] Deleted order: ${orderNo} (Remaining: ${filtered.length})`);
    return res.json({ success: true, orders: filtered, deletedOrderNos: getDeletedOrderNos() });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/site-data - Fetch current live persisted site data
app.get('/api/site-data', (req, res) => {
  try {
    if (!fs.existsSync(SITE_DATA_FILE) && fs.existsSync(SEED_SITE_DATA_FILE)) {
      try {
        fs.copyFileSync(SEED_SITE_DATA_FILE, SITE_DATA_FILE);
      } catch (e) {}
    }

    if (!fs.existsSync(SITE_DATA_FILE)) {
      return res.json({
        success: true,
        siteData: null,
        message: 'No server database file found yet. System will initialize on first save.'
      });
    }

    const raw = fs.readFileSync(SITE_DATA_FILE, 'utf8');
    const stats = fs.statSync(SITE_DATA_FILE);
    const parsed = JSON.parse(raw);

    return res.json({
      success: true,
      siteData: parsed,
      updatedAt: stats.mtime,
      sizeBytes: stats.size
    });
  } catch (err) {
    console.error('[Database GET Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to read server database: ' + err.message
    });
  }
});

// POST /api/upload-media - Handle batch media file uploads and save as static WebP files
app.post('/api/upload-media', (req, res) => {
  try {
    const { dataUrl, filename = 'image.webp', category = 'gallery' } = req.body || {};
    if (!dataUrl) {
      return res.status(400).json({ success: false, error: 'dataUrl is required' });
    }

    const catDir = path.join(UPLOADS_DIR, category);
    if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });

    const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
    const buffer = Buffer.from(base64Data, 'base64');
    const ext = dataUrl.includes('image/webp') ? '.webp' : (dataUrl.includes('image/png') ? '.png' : (dataUrl.includes('image/svg') ? '.svg' : '.jpg'));
    const safeName = filename.replace(/\.[^/.]+$/, '').replace(/[^\w-]/g, '_').toLowerCase();
    const uniqueName = `${safeName || category}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}${ext}`;
    const filePath = path.join(catDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    // Also copy to public/uploads if available for dev convenience
    try {
      const pubCatDir = path.join(publicUploads, category);
      if (!fs.existsSync(pubCatDir)) fs.mkdirSync(pubCatDir, { recursive: true });
      fs.copyFileSync(filePath, path.join(pubCatDir, uniqueName));
    } catch (pubErr) {}

    const publicUrl = `/uploads/${category}/${uniqueName}`;
    return res.json({
      success: true,
      url: publicUrl,
      name: filename || uniqueName,
      sizeBytes: buffer.length
    });
  } catch (err) {
    console.error('[Upload Media Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/site-data - Persist site data with atomic file write and rolling backup
app.post('/api/site-data', (req, res) => {
  try {
    const { siteData, author = 'admin' } = req.body || {};
    if (!siteData || typeof siteData !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid siteData payload. Expected non-empty JSON object.'
      });
    }

    const jsonString = JSON.stringify(siteData, null, 2);

    // If previous database exists, save a rolling backup before overwriting
    if (fs.existsSync(SITE_DATA_FILE)) {
      try {
        const backupFileName = `site-data-${Date.now()}.json`;
        const backupFilePath = path.join(BACKUP_DIR, backupFileName);
        fs.copyFileSync(SITE_DATA_FILE, backupFilePath);
        pruneOldBackups(10);
      } catch (bErr) {
        console.warn('[Database] Backup warning:', bErr.message);
      }
    }

    // Robust file write with atomic fallback (safe against Windows locks and Docker EXDEV errors)
    try {
      const tempFile = `${SITE_DATA_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, jsonString, 'utf8');
      try {
        fs.renameSync(tempFile, SITE_DATA_FILE);
      } catch (renameErr) {
        fs.copyFileSync(tempFile, SITE_DATA_FILE);
        try { fs.unlinkSync(tempFile); } catch (uErr) {}
      }
    } catch (writeErr) {
      fs.writeFileSync(SITE_DATA_FILE, jsonString, 'utf8');
    }

    const stats = fs.statSync(SITE_DATA_FILE);
    console.log(`[Database] Successfully saved site-data.json (${(stats.size / 1024).toFixed(1)} KB) by ${author}`);

    return res.json({
      success: true,
      message: 'ข้อมูลและรูปภาพทั้งหมดถูกบันทึกลง Persistent Server Database เรียบร้อยแล้ว (ปลอดภัยข้ามการ Deploy 100%)',
      updatedAt: stats.mtime,
      sizeBytes: stats.size
    });
  } catch (err) {
    console.error('[Database POST Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to write server database: ' + err.message
    });
  }
});

// GET /api/site-data/backups - List historical rolling backups
app.get('/api/site-data/backups', (req, res) => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return res.json({ success: true, backups: [] });
    }
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('site-data-') && f.endsWith('.json'))
      .map(f => {
        const fullPath = path.join(BACKUP_DIR, f);
        const stats = fs.statSync(fullPath);
        return {
          filename: f,
          sizeBytes: stats.size,
          mtime: stats.mtime
        };
      })
      .sort((a, b) => new Date(b.mtime) - new Date(a.mtime));

    return res.json({ success: true, backups: files });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 8. Open Graph & Social Media Crawler SSR Pre-rendering (/render-meta)
// ==============================================================================

// Helper: Normalize slug for resilient matching (handles missing hyphens, case differences)
const normalizeSlug = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]/g, '');

// Helper: Get active content from live server database or fallback to default-meta.json
function getLiveContent(collectionName) {
  try {
    if (fs.existsSync(SITE_DATA_FILE)) {
      const raw = fs.readFileSync(SITE_DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed[collectionName]) && parsed[collectionName].length > 0) {
        return parsed[collectionName];
      }
    }
  } catch (err) {
    console.warn(`[Meta] Error reading SITE_DATA_FILE for ${collectionName}:`, err.message);
  }
  return (defaultMeta && Array.isArray(defaultMeta[collectionName])) ? defaultMeta[collectionName] : [];
}

// Helper: Match item by exact slug/id, normalized slug, or fuzzy substring
function findMatchedItem(items, targetSlug) {
  if (!Array.isArray(items) || !targetSlug) return null;
  const targetNorm = normalizeSlug(targetSlug);
  if (!targetNorm) return null;

  // 1. Exact match by slug or id
  let match = items.find(item => 
    (item.slug && item.slug.toLowerCase() === targetSlug.toLowerCase()) ||
    (item.id && item.id.toLowerCase() === targetSlug.toLowerCase())
  );
  if (match) return match;

  // 2. Normalized match (handles e.g. audition-lady-tournamentcup vs audition-lady-tournament-cup)
  match = items.find(item => {
    const sNorm = normalizeSlug(item.slug);
    const idNorm = normalizeSlug(item.id);
    const titleNorm = normalizeSlug(item.title);
    return (sNorm && sNorm === targetNorm) ||
           (idNorm && idNorm === targetNorm) ||
           (titleNorm && titleNorm === targetNorm);
  });
  if (match) return match;

  // 3. Partial substring match
  match = items.find(item => {
    const sNorm = normalizeSlug(item.slug);
    return sNorm && (sNorm.includes(targetNorm) || targetNorm.includes(sNorm));
  });

  return match || null;
}

// Helper: Extract valid absolute image URL for LINE / Facebook crawlers
function getBestImageUrl(item, baseUrl, section = 'gallery', slug = '') {
  if (!item) return `${baseUrl}/glp-logo-transparent.png`;
  
  let img = item.image || 
            (item.seo && item.seo.ogImage) || 
            item.bannerImage || 
            (item.galleryPhotos && item.galleryPhotos[0] ? (typeof item.galleryPhotos[0] === 'string' ? item.galleryPhotos[0] : item.galleryPhotos[0].url) : null) || 
            (item.photos && item.photos[0] ? (typeof item.photos[0] === 'string' ? item.photos[0] : item.photos[0].url) : null);

  if (!img) return `${baseUrl}/glp-logo-transparent.png`;

  // If image is a Base64 data URL from user upload, stream it via /api/og-image so LINE & FB crawlers can fetch the binary image
  if (img.startsWith('data:image/')) {
    const cleanSlug = item.slug || slug || item.id || '';
    return `${baseUrl}/api/og-image?section=${encodeURIComponent(section)}&slug=${encodeURIComponent(cleanSlug)}`;
  }

  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  return `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`;
}

// GET /api/og-image - Decodes and streams uploaded Base64 WebP/PNG images directly as binary images for LINE / Facebook crawlers
app.get('/api/og-image', (req, res) => {
  try {
    const section = (req.query.section || 'gallery').toLowerCase();
    const slug = req.query.slug || '';
    const collectionName = (section === 'tournaments') ? 'tournaments' : ((section === 'news') ? 'news' : 'gallery');
    const items = getLiveContent(collectionName);
    const item = findMatchedItem(items, slug);

    if (!item) {
      return res.redirect('/glp-logo-transparent.png');
    }

    let img = item.image || 
              (item.seo && item.seo.ogImage) || 
              item.bannerImage || 
              (item.galleryPhotos && item.galleryPhotos[0] ? (typeof item.galleryPhotos[0] === 'string' ? item.galleryPhotos[0] : item.galleryPhotos[0].url) : null);

    if (!img) {
      return res.redirect('/glp-logo-transparent.png');
    }

    if (img.startsWith('http://') || img.startsWith('https://')) {
      return res.redirect(img);
    }

    if (img.startsWith('data:image/')) {
      const match = img.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const buffer = Buffer.from(match[2], 'base64');
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.end(buffer);
      }
    }

    return res.redirect('/glp-logo-transparent.png');
  } catch (err) {
    console.error('[OG Image Error]:', err);
    return res.redirect('/glp-logo-transparent.png');
  }
});

// Helper: Read index.html template from disk
function getIndexHtmlTemplate() {
  const candidates = [
    '/usr/share/nginx/html/index.html',
    path.join(__dirname, '../dist/index.html'),
    path.join(__dirname, '../index.html'),
    path.join(__dirname, 'index.html')
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf8');
    }
  }
  return `<!doctype html><html lang="th"><head><meta charset="UTF-8"><title>GLP : G Speed Living Plus</title></head><body><div id="root"></div></body></html>`;
}

// Helper: Escape HTML entities in meta content
function escapeMetaAttr(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// GET /render-meta - Server-Side Dynamic Meta Tag Injector for LINE, Facebook, Discord, Twitter crawlers
app.get('/render-meta', (req, res) => {
  try {
    const rawReqUrl = req.query.url || req.url || '/';
    // Clean URL and parse pathname
    let cleanPath = '/';
    try {
      const parsedUrl = new URL(rawReqUrl, 'http://localhost');
      cleanPath = parsedUrl.pathname;
    } catch {
      cleanPath = rawReqUrl.split('?')[0];
    }

    const host = req.get('x-forwarded-host') || req.get('host') || 'glp.cyber-wp.com';
    const proto = req.get('x-forwarded-proto') || (req.secure ? 'https' : 'https'); // Default https for social share
    const baseUrl = `${proto}://${host}`;
    const fullCanonicalUrl = `${baseUrl}${cleanPath}`;

    const parts = cleanPath.split('/').filter(Boolean);
    const section = (parts[0] || '').toLowerCase();
    const slug = parts.slice(1).join('/');

    let pageTitle = 'GLP : G Speed Living Plus | ศูนย์อีสปอร์ตครบวงจร & ระบบแฟรนไชส์จัดผังร้านอัจฉริยะ';
    let pageDesc = 'ศูนย์กีฬาและคอมมูนิตี้อีสปอร์ตครบวงจร รับจัดทัวร์นาเมนต์ และระบบจำลองผังร้านแฟรนไชส์ 2D/3D Interior Planner พร้อมประเมินราคาและสเปกคอมพิวเตอร์แบบเรียลไทม์';
    let pageImage = `${baseUrl}/glp-logo-transparent.png`;
    let pageType = 'website';

    if (section === 'activities' || section === 'gallery' || section === 'events') {
      const activities = getLiveContent('gallery');
      const item = findMatchedItem(activities, slug);
      if (item) {
        pageTitle = `${item.title} | GLP Activities & Community`;
        const dateStr = item.date ? ` • วันที่: ${item.date}` : '';
        const locStr = item.location ? ` • สถานที่: ${item.location}` : ' • G-Speed Arena รามคำแหง 53';
        const partnerStr = item.partner ? ` • ผู้ร่วมจัด: ${item.partner}` : '';
        pageDesc = `${item.desc || item.title}${dateStr}${locStr}${partnerStr}`;
        pageImage = getBestImageUrl(item, baseUrl, section, slug);
        pageType = 'article';
      }
    } else if (section === 'tournaments') {
      const tournaments = getLiveContent('tournaments');
      const item = findMatchedItem(tournaments, slug);
      if (item) {
        pageTitle = `${item.title} | GLP Esports Tournament`;
        const prizeStr = item.prizePool ? ` • ชิงรางวัล: ${item.prizePool}` : '';
        const dateStr = item.date ? ` • แข่งขัน: ${item.date}` : '';
        const gameStr = item.game ? ` • เกม: ${item.game}` : '';
        pageDesc = `${item.desc || (item.seo && item.seo.metaDesc) || item.title}${prizeStr}${gameStr}${dateStr}`;
        pageImage = getBestImageUrl(item, baseUrl, section, slug);
        pageType = 'article';
      }
    } else if (section === 'news') {
      const newsItems = getLiveContent('news');
      const item = findMatchedItem(newsItems, slug);
      if (item) {
        pageTitle = `${item.title} | GLP News`;
        const dateStr = item.date ? ` • เผยแพร่เมื่อ: ${item.date}` : '';
        pageDesc = `${item.desc || (item.seo && item.seo.metaDesc) || item.title}${dateStr}`;
        pageImage = getBestImageUrl(item, baseUrl, section, slug);
        pageType = 'article';
      }
    }

    const safeTitle = escapeMetaAttr(pageTitle);
    const safeDesc = escapeMetaAttr(pageDesc);
    const safeImage = escapeMetaAttr(pageImage);
    const safeUrl = escapeMetaAttr(fullCanonicalUrl);

    let template = getIndexHtmlTemplate();

    // Replace <title>
    template = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);

    // Replace or strip existing meta description, Open Graph, and Twitter tags to prevent duplicates
    template = template
      .replace(/<meta\s+name=["']description["'][\s\S]*?>/gi, '')
      .replace(/<meta\s+property=["']og:[^"']+["'][\s\S]*?>/gi, '')
      .replace(/<meta\s+name=["']twitter:[^"']+["'][\s\S]*?>/gi, '');

    // Injected Open Graph tags strictly formatted for LINE bot, Facebook, Twitter & Discord
    const crawlerMetaBlock = `
    <!-- Dynamic Open Graph & Crawler SSR Meta Tags Generated by GLP Backend -->
    <meta name="description" content="${safeDesc}" />
    <meta property="og:type" content="${pageType}" />
    <meta property="og:site_name" content="GLP : G Speed Living Plus" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:image:secure_url" content="${safeImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${safeTitle}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${safeImage}" />
    <link rel="canonical" href="${safeUrl}" />
`;

    template = template.replace('</head>', `${crawlerMetaBlock}\n</head>`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60'); // Cache for 60 seconds
    return res.status(200).send(template);
  } catch (error) {
    console.error('[Render Meta Error]:', error);
    return res.status(500).send('Internal Server Error generating meta tags: ' + error.message);
  }
});

// Start Express Server on 0.0.0.0:3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 GLP Backend API & SMTP Service Running on 0.0.0.0:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/health`);
  console.log(`📁 Persistent Data Dir: ${DATA_DIR} (exists: ${fs.existsSync(DATA_DIR)})`);
  console.log(`=======================================================`);
});

process.on('uncaughtException', (err) => {
  console.error('[UncaughtException] Non-fatal server error:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[UnhandledRejection] Non-fatal promise rejection:', reason);
});
