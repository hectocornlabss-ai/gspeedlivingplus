# คู่มือการ Deploy เว็บไซต์ G-SPEED ESPORT ARENA บน Coolify 🚀

คู่มือฉบับนี้จัดทำขึ้นเพื่อให้คุณสามารถนำโปรเจกต์ **G-SPEED ESPORT ARENA & 3D STUDIO** ไปติดตั้งและเปิดให้บริการบน **Coolify** ได้อย่างง่ายดาย ราบรื่น และได้ประสิทธิภาพระดับสูงสุด (Production Grade)

---

## 🌟 จุดเด่นของสถาปัตยกรรมที่เตรียมไว้ให้สำหรับ Coolify

1. **รองรับ Clean Path URLs 100%**: ด้วย `nginx.conf` ที่กำหนด `try_files $uri $uri/ /index.html;` ทำให้การเข้า URL ตรง เช่น `/events`, `/events/gspeed-valorant-championship-2026`, `/activities`, `/franchise`, หรือ `/admin` กดรีเฟรชหน้าแล้วไม่เจอ Error 404 อย่างแน่นอน
2. **Multi-Stage Dockerfile ที่เบาและเร็ว**: แยก Stage การ Build (Node.js 20) ออกจาก Stage การ Run (Nginx Alpine) ทำให้ได้ Container ขนาดเล็ก ประหยัดแรมเซิร์ฟเวอร์ และบูตขึ้นเร็วมาก
3. **เปิดใช้งาน Gzip Compression & Asset Caching**: โหลดไฟล์ภาพ, 3D Assets, และ JavaScript ได้อย่างรวดเร็ว โหลดซ้ำแทบไม่กิน Bandwidth
4. **Auto SSL (Let's Encrypt)**: Coolify จะจัดการต่ออายุใบรับรองความปลอดภัย HTTPS ให้ฟรีตลอดชีพ

---

## 📋 ไฟล์ที่เตรียมไว้ในโปรเจกต์แล้ว

| ไฟล์ | หน้าที่ |
| :--- | :--- |
| `Dockerfile` | คำสั่ง Build และ Serve เว็บไซต์ด้วย Nginx Alpine อัตโนมัติ |
| `nginx.conf` | การตั้งค่าเว็บเซิร์ฟเวอร์, รองรับ Clean Path URLs, Gzip, และ Security Headers |
| `docker-compose.yml` | สำหรับผู้ที่ต้องการ Deploy ด้วย Docker Compose |
| `.dockerignore` | กรองไฟล์ที่ไม่จำเป็นออก เพื่อให้การ Build บน Coolify รวดเร็วและมีขนาดเล็ก |

---

## 🛠️ ขั้นตอนการ Deploy บน Coolify ทีละขั้นตอน (Step-by-Step)

### ขั้นตอนที่ 1: อัปโหลดโค้ดขึ้น Git Repository
1. นำโค้ดในโฟลเดอร์นี้ Push ขึ้นไปยัง Git (GitHub, GitLab, หรือ Self-hosted Gitea) ของคุณ:
   ```bash
   git add .
   git commit -m "feat: complete clean urls, tournament system and coolify docker setup"
   git push origin main
   ```

---

### ขั้นตอนที่ 2: เพิ่ม Resource ใหม่ใน Coolify
1. เข้าสู่ระบบ Coolify Dashboard ของคุณ (เช่น `https://coolify.yourdomain.com`)
2. เลือก **Project** และ **Environment** (เช่น Production)
3. คลิกปุ่ม **`+ New`** หรือ **`+ Add Resource`**
4. เลือก **Public Repository** หรือ **Private Repository (GitHub App / Deploy Key)**

---

### ขั้นตอนที่ 3: ระบุข้อมูล Git Repository
1. ใส่ URL ของ Git Repository ของคุณ
2. เลือก Branch: `main` (หรือ branch ที่คุณต้องการ deploy)
3. ติ๊กเลือก **Autodeploy** (เพื่อให้ Coolify ทำการ Deploy ใหม่อัตโนมัติทุกครั้งที่คุณ `git push`)

---

### ขั้นตอนที่ 4: Coolify ตรวจพบ Dockerfile อัตโนมัติ (Configuration)
Coolify จะทำการตรวจสอบโปรเจกต์และเลือก **Build Pack: Dockerfile** ให้อัตโนมัติ:

1. **Build Pack**: `Dockerfile` (ตรวจสอบว่าถูกเลือกเป็น Dockerfile)
2. **Ports Exposes**: ใส่เลข `80` *(เนื่องจาก Nginx ใน Container ของเราเปิดพอร์ต 80)*
3. **Domains (ชื่อโดเมนของคุณ)**:
   - พิมพ์ชื่อโดเมนที่คุณต้องการ เช่น:
     ```text
     https://gspeedesport.com
     ```
   - หรือหากต้องการให้รองรับทั้ง `www` ด้วย:
     ```text
     https://gspeedesport.com,https://www.gspeedesport.com
     ```
   *(อย่าลืมชี้ DNS A Record ของโดเมนมาที่ IP ของเซิร์ฟเวอร์ Coolify ก่อนนะครับ)*

---

### ขั้นตอนที่ 5: กด Deploy 🚀
1. คลิกปุ่ม **`Deploy`** (ปุ่มสีเขียวมุมขวาบน)
2. ดูขั้นตอนการ Build ในแท็บ **Logs**:
   - `Step 1`: ติดตั้ง dependencies (`npm ci`)
   - `Step 2`: ทำการ Build Production Bundle (`npm run build`)
   - `Step 3`: นำไฟล์ไปใส่ใน Nginx Container
   - `Step 4`: Coolify ขอ SSL Certificate จาก Let's Encrypt และเปิดใช้งาน Reverse Proxy ให้อัตโนมัติ
3. เมื่อสถานะเปลี่ยนเป็น **Running (Healthy)** สามารถคลิกเข้าชมเว็บไซต์ผ่านโดเมนของคุณได้ทันที!

---

## 🌐 การเชื่อมต่อกับ Open WebUI และ n8n บนเซิร์ฟเวอร์เดียวกัน

หากคุณติดตั้ง **Open WebUI** และ **n8n** บน Coolify เครื่องเดียวกัน:
* คุณสามารถสร้าง **Docker Network** วงเดียวกันใน Coolify เพื่อให้ Container คุยหากันได้โดยไม่ต้องวิ่งออกเน็ตภายนอก
* ตัวอย่าง URL ภายใน:
  - Open WebUI: `http://openwebui:8080`
  - n8n Automation: `http://n8n:5678`
* สามารถนำ Webhook URL ของ n8n มาใส่ในหน้า **Admin CMS > ระบบ Automation & Webhooks** ของเว็บเพื่อส่งแจ้งเตือน Lead การขอเปิดร้านแฟรนไชส์ หรือการสมัครแข่งเกมเข้ากลุ่ม LINE / Discord ได้ทันที

---

## ❓ การแก้ไขปัญหาที่พบบ่อย (Troubleshooting)

### 1. กดรีเฟรชหน้า `/events` หรือ `/admin` แล้วเจอ 404 หรือไม่?
* **ตอบ**: **ไม่เจอแน่นอนครับ** เพราะใน `nginx.conf` เราได้ใส่คำสั่ง `try_files $uri $uri/ /index.html;` ไว้เรียบร้อยแล้ว ทุก Route จะถูกส่งเข้า React SPA อย่างสมบูรณ์แบบ

### 2. ต้องการอัปเดตรหัสผ่านแอดมินหรือข้อมูลเริ่มต้นผ่าน Environment Variable ทำได้ไหม?
* **ตอบ**: สามารถกำหนดตัวแปรในแท็บ **Environment Variables** บน Coolify ได้เลย เช่น:
  ```env
  VITE_API_BASE_URL=https://api.gspeedesport.com
  VITE_ENABLE_ANALYTICS=true
  ```

### 3. แคชรูปภาพหรือสเปกไม่อัปเดตเมื่อ Deploy เวอร์ชันใหม่?
* **ตอบ**: ไฟล์ `index.html` ของเราถูกตั้งค่า `Cache-Control: no-cache` ไว้ ดังนั้นเมื่อคุณ Deploy เวอร์ชันใหม่ ผู้ใช้จะได้รับเวอร์ชันใหม่ทันที ส่วนไฟล์ JavaScript/CSS จะมี Hash กำกับอยู่แล้ว (`index-DROlz0gS.js`) ทำให้ไม่ต้องกังวลเรื่องติดแคชเก่า
