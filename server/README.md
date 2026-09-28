# 📧 GLP Hostinger SMTP & Notification Microservice

บริการหลังบ้าน (Backend Microservice) ขนาดเบา พัฒนาด้วย **Node.js, Express และ Nodemailer** สำหรับจัดการการส่งอีเมลผ่านเซิร์ฟเวอร์ **Hostinger SMTP (SSL/TLS พอร์ต 465)** พร้อมระบบแจ้งเตือนพนักงานและ Auto-Reply สำหรับ **GLP : G Speed Living Plus**

---

## 🌟 ฟังก์ชันหลัก (Core Features)

1. **Hostinger SMTP Integration (Port 465 SSL)**: เชื่อมต่อเซิร์ฟเวอร์ `smtp.hostinger.com` โดยตรง รองรับการส่งอีเมลแบบมีรูป รหัสอ้างอิง และดีไซน์ HTML สวยงาม
2. **Customer Auto-Reply (ส่งเมลยืนยันถึงลูกค้าทันที)**:
   - เมื่อลูกค้าส่งแบบฟอร์มหน้า `/contact` ระบบจะส่งอีเมลตอบกลับยืนยันพร้อมหมายเลขอ้างอิง `GLP-INQ-xxxxxx`
   - เมื่อลูกค้ากดขอใบเสนอราคาผังร้าน 3D หน้า `/franchise` ระบบจะส่งสรุปสเปกและแพ็กเกจแฟรนไชส์พร้อมเลขอ้างอิง `GLP-Q2026-xxxxxx`
3. **Staff Alert Notifications (แจ้งเตือนพนักงานสูงสุด 5 บัญชี)**:
   - ส่งอีเมลแจ้งเตือนเข้ากล่องข้อความของพนักงานทันทีที่มีข้อความติดต่อใหม่หรือลีดแฟรนไชส์
4. **Live SMTP Handshake Verification**:
   - แอดมินสามารถกดปุ่ม **"ทดสอบ Handshake SMTP"** ในหน้า Admin CMS (แท็บ 13) เพื่อทดสอบรหัสผ่านและการเชื่อมต่อจริงได้แบบ Real-time
5. **Anti-Spam & Rate Limiter**:
   - จำกัดคำขอสูงสุด 20 ครั้ง/นาที ต่อ 1 IP ป้องกันการถูกยิงสแปม และช่วยรักษาโควตาอีเมลของ Hostinger

---

## 🛠️ โครงสร้างไฟล์ (File Structure)

```
c:/Gspeed/server/
├── email-service.js       # Express REST API & Nodemailer Core
├── package.json           # Dependencies (express, nodemailer, cors, dotenv)
├── Dockerfile             # Multi-stage Dockerfile สำหรับรัน Microservice
├── .env.example           # แม่แบบค่า Environment Variables
└── .env                   # ไฟล์ระบุรหัสผ่านจริงสำหรับรันระบบ
```

---

## ⚙️ วิธีการตั้งค่า Environment Variables (`.env`)

เปิดไฟล์ `server/.env` แล้วกรอกข้อมูลจริงจากบัญชี Hostinger ของคุณ:

```env
PORT=3001
NODE_ENV=production

# ข้อมูลการตั้งค่า Hostinger SMTP
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true

# บัญชีอีเมลที่คุณสร้างใน Hostinger hPanel (เช่น contact@gspeedlivingplus.com)
SMTP_USER=contact@gspeedlivingplus.com
SMTP_PASS=รหัสผ่านอีเมลที่คุณตั้งในHostinger

# ชื่อผู้ส่งและอีเมลที่แสดงใน Inbox ของลูกค้า
SMTP_FROM_NAME=GLP : G Speed Living Plus
SMTP_FROM_EMAIL=contact@gspeedlivingplus.com

# รายชื่ออีเมลพนักงานสำหรับรับการแจ้งเตือน (คั่นด้วยเครื่องหมายจุลภาค , สูงสุด 5 บัญชี)
STAFF_NOTIFICATION_EMAILS=staff1@gspeedlivingplus.com,manager@gspeedlivingplus.com

# Webhook สำรอง (Optional: Discord / Slack)
DISCORD_WEBHOOK_URL=
```

---

## 🚀 วิธีการรันระบบ (How to Run)

### แบบที่ 1: รันโดยตรงด้วย Node.js (Local Development)
```bash
cd server
npm install
node email-service.js
```
ระบบจะเปิดบริการที่: `http://localhost:3001` (และทดสอบสถานะได้ที่ `http://localhost:3001/health`)

### แบบที่ 2: รันผ่าน Docker Compose บน Coolify / VPS
ในโฟลเดอร์หลักของโปรเจกต์ มีการตั้งค่า `docker-compose.yml` รองรับไว้แล้ว:
```bash
docker compose up -d --build
```
ระบบจะสร้าง 2 Containers ทำงานคู่กัน:
- **`gspeed-esport-arena`**: หน้าเว็บหลัก (Nginx Port 80)
- **`glp-email-service`**: ระบบส่งอีเมล (Node.js Port 3001) พร้อม Reverse Proxy จาก Nginx `/api/` ให้อัตโนมัติ

---

## 🛡️ คำแนะนำเพื่อไม่ให้อีเมลตกไปอยู่ใน "ถังขยะ" (Spam Prevention)

เพื่อให้ Hostinger ส่งอีเมลไปยัง Gmail / Outlook ของลูกค้าและพนักงานโดยไม่ตก Junk/Spam:

1. **ตั้งค่า SPF Record บน DNS ของโดเมน:**
   - ค่า Type: `TXT`
   - Name/Host: `@`
   - Value: `v=spf1 include:_spf.mail.hostinger.com ~all`
2. **เปิดใช้งาน DKIM (DomainKeys Identified Mail):**
   - ไปที่ Hostinger hPanel > Emails > Email Accounts > Manage > **DKIM** แล้วกด **Enable**
3. **ตั้งค่า DMARC Record:**
   - ค่า Type: `TXT`
   - Name/Host: `_dmarc`
   - Value: `v=DMARC1; p=none; sp=none;`
4. **Sender Email ต้องตรงกับโดเมน:**
   - ต้องใช้ `SMTP_FROM_EMAIL` ที่ลงท้ายด้วยชื่อโดเมนของเว็บไซต์ เช่น `contact@gspeedlivingplus.com` (ห้ามใช้ `@gmail.com` เป็น Sender ใน SMTP Hostinger)

---

## 📡 API Endpoints Reference

| Method | Endpoint | รายละเอียด |
| :--- | :--- | :--- |
| `GET` | `/health` | ตรวจสอบสถานะการทำงานของเซิร์ฟเวอร์ |
| `POST` | `/api/test-smtp` | ทดสอบความถูกต้องของ User & Password กับ Hostinger SMTP |
| `POST` | `/api/send-email` | ส่งอีเมลเดี่ยวทั่วไป รองรับทั้ง HTML และ Text |
| `POST` | `/api/contact-inquiry` | บันทึกข้อความติดต่อ + ส่ง Auto-reply หาผู้ติดต่อ + ส่ง Alert หาพนักงาน |
| `POST` | `/api/franchise-quote` | บันทึกคำขอแฟรนไชส์ + ส่งใบเสนอราคา 3D หาผู้ติดต่อ + ส่ง Alert หาเซลส์ |
