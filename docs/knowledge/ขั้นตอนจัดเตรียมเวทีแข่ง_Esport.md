# คู่มือขั้นตอนการจัดเตรียมเวทีแข่งขันอีสปอร์ต (Tournament Stage Setup)
## ศูนย์กีฬาอีสปอร์ต G-Speed Esport Arena (GLP Living Plus)

---

### 1. เช็กลิสต์ตรวจสอบเงื่อนไขก่อนรับงาน (6 Conditions Intake Checklist)
พนักงานหรือแอดมินต้องตรวจสอบว่าผู้ขอเช่าได้ส่งข้อมูลครบ **6 ข้อ** ดังนี้:
1. **วันและเวลาจัดงาน:** ระบุวันเริ่มต้น วันสิ้นสุด และช่วงเวลาการใช้เวที (เช่น 10:00 - 20:00 น.)
2. **เกมที่ใช้แข่งขัน:** (เช่น VALORANT, ROV, PUBG, CS2, FC24, Street Fighter 6)
3. **ชื่องาน / กิจกรรม:** ชื่อการแข่งขันหรือธีมของงานอย่างเป็นทางการ
4. **ชื่อบริษัท / ผู้จัด / สถาบัน:** องค์กร สโมสร หรือกลุ่มผู้จัดงาน
5. **จำนวนคนและทีม:** จำนวนทีมแข่ง ผู้เล่น และผู้ชมในงานโดยประมาณ
6. **ข้อมูลติดต่อกลับ:** ชื่อผู้ประสานงาน, เบอร์โทรศัพท์, LINE ID และอีเมล

---

### 2. ข้อมูลสเปกเวทีแข่งขัน 5v5 Stage และอุปกรณ์
- **เวที 5v5 Dual Podiums:** ยกสูงจากพื้น 45 ซม. ฝั่งซ้าย (Blue Side) 5 เครื่อง, ฝั่งขวา (Red Side) 5 เครื่อง
- **คอมพิวเตอร์ประจำสเตจ (10 เครื่อง):**
  - CPU: Intel Core i9-14900K
  - GPU: NVIDIA GeForce RTX 4080 SUPER 16GB
  - Monitor: BenQ ZOWIE XL2566K 360Hz Fast-TN (0.5ms) พร้อมฉากกั้นสายตา Shield
  - เก้าอี้: Secretlab TITAN Evo 2026 Esports Edition
- **จอ LED Wall ขนาดยักษ์ (Center Stage Display):**
  - ขนาด: P2.5 High-Refresh LED Wall กว้าง 6 เมตร สูง 3 เมตร
  - รองรับความละเอียด 4K แสดงผลแบบ Multi-View (มุมมองผู้เล่น + กราฟิกสกอร์ + กล้องถ่ายทอดสด)
- **โต๊ะพากย์แคสเตอร์ (Caster Desk):**
  - เก้าอี้แคสเตอร์ 2 ที่นั่ง
  - ไมโครโฟนบรอดแคสต์ Shure SM7B + Rodecaster Pro II Audio Mixer
  - กล้อง 4K Sony Facecam ถ่ายมุมแคสเตอร์ส่งภาพเข้าสวิตเชอร์

---

### 3. ขั้นตอนการเซ็ตอัพระบบถ่ายทอดสด (Live Streaming Broadcast Setup)
1. **การเปิดระบบไฟฟ้าเวที**:
   - เปิดสวิตช์ไฟเวที (Stage Spotlight & RGB Linear Truss) จากตู้ควบคุมเวที
   - เปิดเบรกเกอร์จ่ายไฟจอ LED Wall รอสัญญาณบูต 30 วินาที
2. **การตั้งค่า OBS Studio / vMix**:
   - เปิดเครื่องคอนโทรลเลอร์ห้องพากย์
   - โหลด Preset ฉากการแข่งขัน (Scenes):
     - `Scene 1: Waiting Screen / Countdown`
     - `Scene 2: Caster Desk (ภาพผู้พากย์)`
     - `Scene 3: In-Game Observer View (ภาพในเกม)`
     - `Scene 4: Player Webcams 5v5 Split`
     - `Scene 5: Match Victory / MVP Screen`
3. **การทดสอบสัญญาณเสียงและเครือข่าย**:
   - ตรวจสอบระดับเสียงไมค์แคสเตอร์ (-12dB ถึง -6dB ไม่พีคสีแดง)
   - ตรวจสอบความเร็วสตรีมมิ่งผ่าน Dedicated VLAN 30 (Bitrate: 8,000 - 10,000 Kbps 1080p60)
   - ทดสอบสตรีมลับ (Private Test Stream) ขึ้น YouTube/Facebook ก่อนเวลาเริ่มงานจริง 30 นาที
