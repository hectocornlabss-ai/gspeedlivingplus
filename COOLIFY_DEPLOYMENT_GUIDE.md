# คู่มือการ Deploy เว็บไซต์ G-SPEED ESPORT ARENA & 3D STUDIO บน Coolify 🚀

คู่มือฉบับนี้จัดทำขึ้นเพื่อให้คุณสามารถนำโปรเจกต์ **G-SPEED ESPORT ARENA & 3D STUDIO** ไปติดตั้งและเปิดให้บริการบน **Coolify** (หรือ VPS ทั่วไป) ได้อย่างราบรื่น ปลอดภัย และได้ประสิทธิภาพระดับสูงสุด (Production Grade)

---

## 🌟 ภาพรวมสถาปัตยกรรมระบบ (Architecture)

โปรเจกต์นี้ได้รับการออกแบบให้ทำงานร่วมกันอย่างสมบูรณ์แบบในรูปแบบ **Containerized Microservices** ผ่าน `docker-compose.yml`:

```
                           [ Coolify Reverse Proxy / SSL (Let's Encrypt) ]
                                                   │
                                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Docker Network: glp-network                                                                 │
│                                                                                             │
│  ┌──────────────────────────────────────────┐    /api/*    ┌─────────────────────────────┐  │
│  │ 1. gspeed-app (Port 80)                 │ ───────────> │ 2. email-service (Port 3001)│  │
│  │  - Nginx Alpine (Ultra Fast & Lightweight)│              │  - Node.js Express Backend  │  │
│  │  - React 19 + Three.js 3D Engine         │              │  - Hostinger SMTP (SSL 465) │  │
│  │  - Clean Path URLs (No 404 on Refresh)   │              │  - Staff Email Alerts       │  │
│  │  - Gzip & 1-Year Asset Caching           │              │  - Blueprint Streamer       │  │
│  └──────────────────────────────────────────┘              └──────────────┬──────────────┘  │
└───────────────────────────────────────────────────────────────────────────┼─────────────────┘
                                                                            │ Port 465 SSL
                                                                            ▼
                                                             [ smtp.hostinger.com ]
```

### จุดเด่นที่เตรียมไว้พร้อมใช้งาน:
1. **รองรับ Clean Path URLs 100%**: ด้วย Nginx `try_files $uri $uri/ /index.html;` เข้าลิงก์ตรง `/events`, `/activities`, `/franchise`, `/admin` กดรีเฟรชหน้าแล้วไม่เจอ Error 404
2. **ระบบส่งอีเมล Hostinger SMTP อัตโนมัติ**: เมื่อลูกค้าส่งฟอร์มขอใบเสนอราคาผังร้าน 3D หรือฟอร์มติดต่อ ระบบส่งอีเมลยืนยันหาลูกค้าและแจ้งเตือนเข้า Inbox พนักงานทันที
3. **ระบบดาวน์โหลดไฟล์พิมพ์เขียว/สำรองข้อมูล (Streamer)**: รองรับการดาวน์โหลดไฟล์ขนาดใหญ่สูงสุด 25MB พร้อมตั้งค่า Content-Disposition อัตโนมัติ
4. **ความปลอดภัยระดับสูง (Security Headers)**: มี Rate Limiter ป้องกันสแปม, ซ่อน Server Header, บล็อก XSS และ Clickjacking

---

## 📋 เช็คลิสต์ก่อนเริ่ม Deploy วันนี้ (Pre-flight Checklist)

ก่อนเริ่มกดปุ่ม Deploy บน Coolify แนะนำให้ตรวจสอบ 4 ข้อนี้:

- [x] **โค้ดผ่านการทดสอบ Build ในเครื่องเรียบร้อย** (`npm run build` ผ่าน 100% ไม่มีข้อผิดพลาด)
- [x] **การตั้งค่า Nginx และ Docker Compose ถูกต้อง** (`docker compose config` ผ่าน 100%)
- [ ] **มีบัญชีอีเมล Hostinger และรหัสผ่านพร้อมใช้งาน** (เช่น `contact@gspeedlivingplus.com`)
- [ ] **ชี้ DNS A Record โดเมนของคุณมาที่ IP ของเซิร์ฟเวอร์ Coolify** เรียบร้อยแล้ว (เช่น A Record ของ `gspeedlivingplus.com` ชี้ไปที่ Server IP)

---

## 🛠️ ขั้นตอนการ Deploy บน Coolify ทีละขั้นตอน (Step-by-Step)

### ขั้นตอนที่ 1: ตรวจสอบและ Push โค้ดขึ้น Git Repository
นำโค้ดล่าสุดขึ้น GitHub / GitLab / Gitea ของคุณ:
```bash
git add .
git commit -m "feat: production ready docker-compose and coolify deployment setup"
git push origin main
```

---

### ขั้นตอนที่ 2: เพิ่ม Resource บน Coolify Dashboard
1. เข้าสู่ระบบ Coolify Dashboard (เช่น `https://coolify.yourdomain.com`)
2. เลือก **Project** และ **Environment** (เช่น Production)
3. คลิกปุ่ม **`+ Add Resource`** (หรือ `+ New`)
4. เลือก **Public Repository** หรือ **Private Repository (GitHub App / Deploy Key)**

---

### ขั้นตอนที่ 3: กำหนดค่า Git Repository
1. วาง URL ของ Git Repository ของคุณ:
   ```text
   https://github.com/hectocornlabss-ai/gspeedlivingplus.git
   ```
2. เลือก Branch: `main`
3. ติ๊กเปิด **Autodeploy** (เมื่อมีการ git push โค้ดใหม่ Coolify จะ build และ deploy ใหม่อัตโนมัติ)

---

### ขั้นตอนที่ 4: เลือกรูปแบบการ Build (แนะนำ: Docker Compose)

#### ⭐ วิธีที่ 1: Docker Compose (แนะนำสูงสุด — ได้ทั้งเว็บ + ระบบส่งเมล)
เมื่อ Coolify ให้เลือก **Build Pack**:
1. เลือก **Build Pack: Docker Compose**
2. Coolify จะอ่านไฟล์ `docker-compose.yml` ในโปรเจกต์โดยอัตโนมัติ
3. กำหนด **Domains** ในหน้า Configuration:
   ```text
   https://gspeedlivingplus.com
   ```
   *(หรือใส่ทั้ง www ด้วย: `https://gspeedlivingplus.com,https://www.gspeedlivingplus.com`)*
4. ไปที่แท็บ **Environment Variables** แล้วเพิ่มตัวแปรสำหรับระบบอีเมล Hostinger:
   ```env
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=contact@gspeedlivingplus.com
   SMTP_PASS=รหัสผ่านอีเมลHostingerของคุณ
   SMTP_FROM_NAME=GLP : G Speed Living Plus
   SMTP_FROM_EMAIL=contact@gspeedlivingplus.com
   STAFF_NOTIFICATION_EMAILS=staff1@gspeedlivingplus.com,manager@gspeedlivingplus.com
   ```

#### 🔹 วิธีที่ 2: Dockerfile (เฉพาะหน้าเว็บอย่างเดียว)
หากต้องการรันเฉพาะหน้าเว็บ Static SPA:
1. เลือก **Build Pack: Dockerfile**
2. Ports Exposes: `80`
3. Domains: ระบุชื่อโดเมนของคุณ

---

### ขั้นตอนที่ 5: กดปุ่ม Deploy 🚀
1. คลิกปุ่ม **`Deploy`** (ปุ่มสีฟ้าหรือสีเขียวมุมขวาบน)
2. สังเกตหน้าต่าง **Deployment Logs**:
   - ระบบจะทำการดึง Base Image Node.js 20 และ Nginx Alpine
   - ทำการติดตั้งแพ็กเกจและรันคำสั่ง `npm run build`
   - Coolify จะเชื่อมต่อกับ Let's Encrypt เพื่อสร้างใบรับรองความปลอดภัย HTTPS (SSL) ให้อัตโนมัติ
3. เมื่อสถานะแสดงเป็น **Running (Healthy)** คุณสามารถเปิดดูเว็บไซต์ผ่านโดเมนของคุณได้ทันที!

---

## 🧪 การทดสอบระบบหลังการ Deploy (Verification Checklist)

เมื่อ Deploy สำเร็จแล้ว ให้เปิดเข้าเว็บผ่านโดเมนและทดสอบตามลำดับนี้:

1. **ทดสอบ Clean URLs**:
   - เปิดไปที่ `https://yourdomain.com/events`
   - ลองกดปุ่ม **Refresh (F5)** บนเบราว์เซอร์ หากแสดงผลหน้าเดิมถูกต้อง ไม่ขึ้น 404 ถือว่าผ่าน
2. **ทดสอบระบบดาวน์โหลดผังร้าน/สำรองข้อมูล**:
   - ไปที่หน้า **3D Franchise Planner** หรือ **Admin CMS (แท็บ 14 สำรองข้อมูล)**
   - กดปุ่ม "ดาวน์โหลดสำรองข้อมูลทั้งระบบ" ไฟล์ต้องโหลดลงเครื่องได้ทันที
3. **ทดสอบการเชื่อมต่อ Hostinger SMTP**:
   - ล็อกอินเข้าสู่ระบบหลังบ้าน `https://yourdomain.com/admin`
   - ไปที่แท็บ **13. จัดการอีเมล SMTP**
   - กดปุ่ม **"ทดสอบ Handshake SMTP"** เพื่อดูผลการตอบกลับว่าสถานะ Connected สำเร็จหรือไม่
4. **ทดสอบการส่งแบบฟอร์มติดต่อ**:
   - ไปที่หน้า `https://yourdomain.com/contact`
   - ลองกรอกข้อความและกดส่ง จะต้องได้รับเลขอ้างอิงและอีเมลยืนยัน

---

## 🌐 การเชื่อมโยงกับ AI และ Automation บน Server เดียวกัน

หากคุณรัน **Open WebUI** หรือ **n8n** อยู่บน Coolify เครื่องเดียวกัน:
* สามารถเชื่อมต่อ Docker Network เดียวกันเพื่อคุยผ่าน Internal IP ได้โดยไม่ต้องวิ่งออกเน็ตภายนอก:
  - **Open WebUI**: `http://openwebui:8080`
  - **n8n**: `http://n8n:5678`
* สามารถนำ Webhook URL ของ n8n มาใส่ในหน้า **Admin CMS > ระบบ Automation & Webhooks** เพื่อส่งการแจ้งเตือน Lead ไปยัง LINE Notify หรือ Discord ได้ทันที
