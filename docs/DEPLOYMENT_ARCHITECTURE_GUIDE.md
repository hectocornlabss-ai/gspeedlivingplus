# คู่มือสถาปัตยกรรมเซิร์ฟเวอร์และการติดตั้งระบบ G-Speed Esport Arena
## (Website Frontend + n8n Automation Hub + Open WebUI Internal Operations)

เอกสารฉบับนี้จัดทำขึ้นเพื่อให้ผู้ดูแลระบบและผู้บริหารของ **G-Speed Esport Arena (GLP Living Plus)** สามารถติดตั้ง จัดการ และดูแลรักษาระบบทั้งหมดบนเซิร์ฟเวอร์ (Cloud VPS / Dedicated Server) ได้อย่างง่ายดาย เป็นระบบ และปลอดภัยสูงสุด

---

## 1. ผังโครงสร้างระบบ (System Architecture Overview)

ระบบถูกแบ่งออกเป็น **3 ส่วนหลัก (3-Tier Architecture)** ทำงานร่วมกันบนเซิร์ฟเวอร์ผ่าน Docker:

```
                                 [ อินเทอร์เน็ต / ลูกค้า ]
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │     REVERSE PROXY (SSL)   │
                               │   Nginx / Coolify / Traefik│
                               └─────────────┬─────────────┘
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
   https://gspeedarena.com        https://n8n.gspeedarena.com    https://ai.gspeedarena.com
  ┌──────────────────────────┐   ┌──────────────────────────┐   ┌──────────────────────────┐
  │   1. WEBSITE FRONTEND    │   │   2. n8n AUTOMATION      │   │   3. OPEN WEBUI          │
  │   (หน้าร้าน / ลูกค้า)     │   │   (สมองกลาง / Gateway)    │   │   (ระบบหลังบ้าน / พนักงาน)│
  ├──────────────────────────┤   ├──────────────────────────┤   ├──────────────────────────┤
  │ • จำลองผังร้าน 3D         │   │ • Webhook Router         │   │ • SOP พนักงานใหม่        │
  │ • คำนวณราคาเปิดร้าน      │   │ • RAG ลูกค้าภายนอก       │   │ • คู่มือช่าง Diskless    │
  │ • กล่องแชทบริการลูกค้า   │   │ • แยกแชทส่งตามแผนก      │   │ • วิธีคุมเวทีแข่ง 5v5     │
  │   (3 ภาษา: TH, EN, ZH)   │   │ • Gemini Flash 3.8 Chain │   │ • สรุปยอดขาย / บัญชีกะ   │
  │ • Admin CMS จัดการเว็บ   │   │ • Cron สรุปยอดส่ง LINE   │   │ • สิทธิ์เฉพาะแอดมิน/สตาฟ │
  └──────────────────────────┘   └──────────────────────────┘   └──────────────────────────┘
```

---

## 2. การเตรียมเซิร์ฟเวอร์ (Server Specifications)

### สเปกเซิร์ฟเวอร์ที่แนะนำ (Cloud VPS เช่น DigitalOcean, Hetzner, Vultr, AWS หรือเครื่อง Server ร้าน):
- **CPU:** 4 Cores (x86_64)
- **RAM:** 8 GB - 16 GB (หากรัน Open WebUI + n8n + Database แนะนำ 8GB ขึ้นไป)
- **Storage:** 80 GB - 160 GB NVMe SSD
- **OS:** Ubuntu 22.04 LTS หรือ 24.04 LTS
- **Domain Name:** จดโดเมน เช่น `gspeedarena.com` พร้อมชี้ Subdomain:
  - `gspeedarena.com` ➔ IP Server (เว็บไซต์หลัก)
  - `n8n.gspeedarena.com` ➔ IP Server (n8n Automation)
  - `ai.gspeedarena.com` ➔ IP Server (Open WebUI หลังบ้าน)

---

## 3. ติดตั้งด้วย Docker Compose (One-Click Stack)

สร้างไฟล์ `docker-compose.yml` บนเซิร์ฟเวอร์ (เช่นในโฟลเดอร์ `/opt/gspeed-stack/`):

```yaml
version: '3.8'

services:
  # -------------------------------------------------------------
  # 1. G-Speed Website Frontend
  # -------------------------------------------------------------
  gspeed-web:
    build:
      context: ./Gspeed
      dockerfile: Dockerfile
    container_name: gspeed_website
    restart: always
    ports:
      - "5899:80"
    environment:
      - NODE_ENV=production

  # -------------------------------------------------------------
  # 2. n8n Automation Engine
  # -------------------------------------------------------------
  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    container_name: gspeed_n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.gspeedarena.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://n8n.gspeedarena.com/
      - GENERIC_TIMEZONE=Asia/Bangkok
      - N8N_DEFAULT_BINARY_DATA_MODE=filesystem
    volumes:
      - ./n8n_data:/home/node/.n8n

  # -------------------------------------------------------------
  # 3. Open WebUI (Internal Staff Knowledge Base & Operations)
  # -------------------------------------------------------------
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: gspeed_openwebui
    restart: always
    ports:
      - "3000:8080"
    environment:
      - WEBUI_SECRET_KEY=gspeed_super_secret_key_2026
      - OPENAI_API_BASE_URL=https://openrouter.ai/api/v1
      - OPENAI_API_KEY=sk-or-v1-your-openrouter-key-here
    volumes:
      - ./openwebui_data:/app/backend/data

  # -------------------------------------------------------------
  # 4. Qdrant Vector Database (คลังจัดเก็บ RAG)
  # -------------------------------------------------------------
  qdrant:
    image: qdrant/qdrant:latest
    container_name: gspeed_vector_db
    restart: always
    ports:
      - "6333:6333"
    volumes:
      - ./qdrant_storage:/qdrant/storage
```

### สั่งรันระบบ:
```bash
docker compose up -d
```

---

## 4. วิธีตั้งค่าการเชื่อมต่อในแต่ละส่วน

### ส่วนที่ 1: ตั้งค่า n8n (สมองกลาง)
1. เปิดเข้าไปที่ `https://n8n.gspeedarena.com` และสมัครบัญชี Owner คนแรก
2. **สร้าง Workflow ที่ 1: Web Chat & Omnichannel Gateway**:
   - สร้างโหนด **Webhook** (Method: `POST`, Path: `omnichannel-chat`)
   - นำ Webhook URL ที่ได้: `https://n8n.gspeedarena.com/webhook/omnichannel-chat` ไปใส่ในหน้า **Admin CMS ของเว็บไซต์**
   - ใส่โหนด **AI Agent** (Model: `Google Gemini Flash 3.8` ผ่าน OpenRouter หรือ Google PaLM API)
   - ใส่เอกสาร RAG ร้าน (ไฟล์ `docs/knowledge/ข้อมูลร้าน_RAG_ลูกค้าภายนอก.md`) ใน System Message
3. **สร้าง Workflow ที่ 2: Department Lead Router**:
   - ใช้โหนด **Switch / IF**:
     - หากเนื้อหาเกี่ยวกับ *"เปิดร้าน"*, *"แฟรนไชส์"*, *"ลงทุน"* ➔ ส่งเข้า LINE Notify **[กลุ่มฝ่ายขายแฟรนไชส์]**
     - หากเนื้อหาเกี่ยวกับ *"จัดแข่ง"*, *"เช่าเวที"*, *"ทัวร์นาเมนต์"* ➔ ส่งเข้า LINE Notify **[กลุ่มทีมงานอีเวนต์]**
     - หากเนื้อหาเกี่ยวกับ *"ปัญหาเน็ต"*, *"เครื่องค้าง"*, *"แจ้งซ่อม"* ➔ ส่งเข้า LINE Notify **[กลุ่มช่างเทคนิค]**
4. **สร้าง Workflow ที่ 3: Daily Business Summary (สรุปผลรายวัน)**:
   - ใช้โหนด **Cron Trigger** ทุกวันเวลา `24:00 น.` (เที่ยงคืน)
   - ดึงข้อมูลจาก SmartCafé ERP / Database
   - ส่งรายงานสรุปยอดผู้เข้าใช้บริการ, รายได้ประจำวัน, และสถิติเครื่อง เข้า LINE ผู้บริหาร

---

### ส่วนที่ 2: ตั้งค่า Open WebUI (สำหรับพนักงานและหลังบ้าน)
1. เปิดเข้าไปที่ `https://ai.gspeedarena.com`
2. สมัครบัญชีผู้ดูแลระบบ (Admin) และสร้างบัญชีพนักงาน (User)
3. เข้าเมนู **Workspace ➔ Knowledge**:
   - กดปุ่ม `+` สร้างคลังความรู้ใหม่ชื่อ **`G-Speed Internal Knowledge Base`**
   - อัปโหลดไฟล์ SOP จากโฟลเดอร์ `docs/knowledge/`:
     - 📄 `SOP_พนักงานใหม่_GSPEED.md`
     - 📄 `คู่มือช่างเทคนิค_Diskless_Network.md`
     - 📄 `ขั้นตอนจัดเตรียมเวทีแข่ง_Esport.md`
4. เข้าเมนู **Workspace ➔ Models**:
   - สร้างโมเดลจำลองชื่อ **`G-Speed Staff Assistant`**
   - ผูกกับ Base Model: `gemini-flash-3.8`
   - ติ๊กเลือก Knowledge Base ที่สร้างไว้ในข้อ 3
   - พนักงานทุกคนสามารถล็อกอินเข้ามาถามขั้นตอนการทำงานหรือวิธีแก้ปัญหาได้ทันที 24 ชม.

---

### ส่วนที่ 3: ตั้งค่าบนหน้าเว็บไซต์ G-Speed (เชื่อมเข้า n8n)
1. เปิดหน้าเว็บ `http://localhost:5899/` หรือโดเมนจริง
2. เข้าหน้า **Admin CMS** (รหัสผ่านเริ่มต้น: `gspeed2026`)
3. ไปที่แท็บ **"AI & Omnichannel"**:
   - กรอกช่อง **`n8n Web Widget Webhook URL`**: ใส่ URL จาก n8n (เช่น `https://n8n.gspeedarena.com/webhook/omnichannel-chat`)
   - กรอกช่อง **`Open WebUI Base URL`**: ใส่ `https://ai.gspeedarena.com`
   - กดปุ่ม **"บันทึกการตั้งค่า"**
4. หน้าเว็บจะส่งข้อความคุยกับ n8n ทันที และหาก n8n ไม่พร้อมใช้งาน ระบบจะสลับไปใช้ **Local Smart Rule Engine** ที่เราสร้างไว้เพื่อตอบคำถามสำคัญ (เปิด 24 ชม., พิกัดร้าน, เบอร์ 063 793 7704, เงื่อนไขจัดแข่ง, งบเปิดร้าน) โดยไม่มีวันล่ม!

---

## 5. เช็กลิสต์ความปลอดภัย (Security Best Practices)
1. **ห้ามเปิดพอร์ตตรงของ Open WebUI และ n8n สู่สาธารณะ**: ให้เข้าผ่าน Nginx Reverse Proxy พร้อม SSL (HTTPS) เท่านั้น
2. **ห้ามนำ SOP หรือรหัสผ่านภายในใส่ใน RAG หน้าเว็บ**: เอกสารภายในร้านให้เก็บไว้ใน Open WebUI เท่านั้น
3. **Backup ข้อมูลสม่ำเสมอ**: กำหนด Cronjob แบ็กอัปโฟลเดอร์ `n8n_data`, `openwebui_data` และ `qdrant_storage` ขึ้น Google Drive หรือ S3 สัปดาห์ละ 1 ครั้ง
