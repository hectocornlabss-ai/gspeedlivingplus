# คู่มือช่างเทคนิค: ระบบ Diskless Server, เน็ตเวิร์ก 10Gbps และระบบไฟฟ้า 3 เฟส
## ศูนย์กีฬาอีสปอร์ต G-Speed Esport Arena (GLP Living Plus)

---

### 1. โครงสร้างสถาปัตยกรรมระบบดิสเลส (Diskless Boot Architecture)
ระบบคอมพิวเตอร์ในร้านทั้งหมด 70-120 เครื่อง ไม่ใช้ฮาร์ดดิสก์รายเครื่อง (Diskless Client) โดยบูตผ่าน LAN ผ่านเครื่องแม่ข่ายเซิร์ฟเวอร์แม่ (Diskless Boot Server):

- **Diskless Software:** iCafeCloud / CCBoot 2026 Enterprise Edition
- **Server Specs:** Dual AMD EPYC / Intel Xeon 32 Cores, 128GB ECC RAM
- **Storage Pools:**
  - `Writeback Disk (NVMe PCIe 4.0 RAID 0)`: บันทึกข้อมูลแคชเครื่องลูก ความเร็ว 14,000 MB/s
  - `Game Disk (NVMe U.2 Enterprise RAID 10)`: บรรจุตัวเกมทั้งหมดขนาด 8TB - 16TB
  - `Image Disk`: เก็บอิมเมจ Windows 11 Esports Custom Super-Lite
- **ระบบสำรอง (Auto-Failover):** มีเซิร์ฟเวอร์คู่ขนานแบบ Master-Slave หากเครื่องหลักดับ เครื่องสำรองจะเทกโอเวอร์ภายใน 3 วินาที

---

### 2. ขั้นตอนการอัปเดตเกมและการจัดการ Superclient
1. **การเปิดโหมด Superclient (เพื่อติดตั้งหรืออัปเดตเกม)**:
   - เข้าโปรแกรมบริหาร Diskless ที่เครื่องเซิร์ฟเวอร์แม่
   - เลือกหมายเลขเครื่องลูกที่ต้องการทดสอบ (แนะนำเครื่อง `VIP-01` หรือ `A01`)
   - คลิกขวา ➔ **"Enable Superclient"**
2. **การอัปเดตตัวเกม**:
   - เดินไปที่เครื่องลูก เปิดเกมที่ต้องการอัปเดต (เช่น VALORANT, Apex Legends, Steam, Epic Games)
   - รอจนการอัปเดตสมบูรณ์ 100% และทดสอบเข้าเกมจนถึงหน้าล็อบบี้
3. **การบันทึกภาพอิมเมจ (Save Image Point)**:
   - สั่ง Shutdown เครื่องลูกตามปกติ
   - กลับมาที่เครื่องเซิร์ฟเวอร์แม่ คลิกขวา ➔ **"Save Superclient Image"**
   - ใส่คำอธิบาย (เช่น *"Update VALORANT Patch 10.02 - 14/09/2026"*)
   - หลังจากนั้น ทุกเครื่องในร้านจะได้รับตัวเกมเวอร์ชันใหม่ทันทีโดยไม่ต้องไปลงทีละเครื่อง

---

### 3. ระบบเน็ตเวิร์ก 10Gbps Multi-WAN & Smart QoS
- **Core Switch:** 10Gbps SFP+ Managed Switch (Ubiquiti UniFi / MikroTik Cloud Router Switch)
- **Edge Switch:** 2.5Gbps / 1Gbps PoE+ Access Switch แยกตามโซน
- **VLAN Isolation:**
  - `VLAN 10`: เครื่องเล่นเกมลูกค้า (Gaming Stations) - จัดความสำคัญสูงสุด (High Priority QoS)
  - `VLAN 20`: ระบบเซิร์ฟเวอร์ Diskless & แคชเชียร์ POS
  - `VLAN 30`: เวทีแข่งขัน 5v5 Main Stage & สตรีมเมอร์ (Dedicated Uplink ไม่แชร์กับใคร)
  - `VLAN 40`: Wi-Fi ลูกค้าและแขกทั่วไป (จำกัดความเร็ว 20/20 Mbps ต่อเครื่อง)
- **Multi-WAN Load Balance:**
  - **เส้นที่ 1 (Main ISP):** AIS Fibre 2000/1000 Mbps Dedicated IP
  - **เส้นที่ 2 (Backup ISP):** True Gigatex Fiber 2000/1000 Mbps
  - **Ping Guarantee:** ค่า Ping ในประเทศ (BKK Server) ต่ำกว่า 2-3ms หากเส้นใดเส้นหนึ่งขาด ระบบจะตัดสายภายใน 100ms โดยไม่ตัดการเชื่อมต่อในเกม

---

### 4. ระบบไฟฟ้า 3 เฟส (3-Phase Power) และตู้โหลดเซ็นเตอร์
- **หม้อแปลงและการจ่ายไฟ:** ระบบไฟ 3 เฟส 380V บาลานซ์เฟส (Phase A, B, C) เฉลี่ยเฟสละเท่าๆ กันเพื่อป้องกันหม้อแปลงโหลดเกิน
- **การเดินรางสายไฟ (Wireway):** รางเหล็กพ่นสีพาวเดอร์โค้ตซ่อนใต้โต๊ะเกมมิ่ง แยกรางไฟและรางสายแลนเพื่อป้องกันสัญญาณรบกวน (EMI)
- **ระบบสำรองไฟ UPS True Online:**
  - ตู้แร็กเซิร์ฟเวอร์ Diskless มี UPS True Online ขนาด 6kVA สำรองไฟได้นาน 30 นาที
  - เคาน์เตอร์แคชเชียร์ POS มี UPS ขนาด 1.5kVA
- **ระบบกราวด์สายดิน (Earth Grounding):**
  - แท่งกราวด์ร็อดทองแดงลึก 3 เมตร ค่าความต้านทานดินต่ำกว่า 5 โอห์ม ป้องกันอุปกรณ์ช็อตหรือไฟดูด 100%
