import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CATALOG_ITEMS as INITIAL_CATALOG, 
  HARDWARE_TIERS as INITIAL_TIERS,
  TOURNAMENTS as INITIAL_TOURNAMENTS,
  GALLERY_ACTIVITIES as INITIAL_GALLERY,
  GAME_NEWS as INITIAL_NEWS,
  FOUNDER_INFO as INITIAL_FOUNDER,
  VENUE_ZONES as INITIAL_ZONES
} from '../data/mockData';

// Initial Store RAG Knowledge Base Chunks
export const INITIAL_RAG_KNOWLEDGE = [
  {
    id: 'rag-rates',
    category: 'pricing',
    title: 'อัตราค่าบริการและโปรโมชันเวลาเล่น',
    tags: ['ราคา', 'ชั่วโมง', 'สมาชิก', 'โปรโมชัน', 'เติมเงิน'],
    content: 'อัตราค่าบริการที่ G-Speed Esport Arena แบ่งเป็น: สมาชิก 25-30 บาท/ชั่วโมง, บุคคลทั่วไป 35 บาท/ชั่วโมง มีโปรโมชันเหมาเล่นกลางคืน (Night Owl 23:00 - 08:00 น.) เพียง 150 บาท สมาชิกเติมเงิน 500 บาท แถมฟรี 100 บาท, เติม 1,000 บาท แถมฟรี 300 บาท สมัครสมาชิกฟรีที่เคาน์เตอร์แคชเชียร์'
  },
  {
    id: 'rag-specs',
    category: 'hardware',
    title: 'สเปกคอมพิวเตอร์และหน้าจอเกมมิ่งประจำร้าน',
    tags: ['สเปก', 'คอม', 'การ์ดจอ', 'RTX', 'จอ', '360Hz', 'เฟรมเรต'],
    content: 'คอมพิวเตอร์ทุกเครื่องขับเคลื่อนด้วยการ์ดจอ NVIDIA GeForce RTX 4070 SUPER / RTX 4080 SUPER, ซีพียู Intel Core i7-14700K / Core i9, แรม 32GB DDR5 6000MHz พร้อมหน้าจออีสปอร์ต BenQ ZOWIE 360Hz และ 240Hz Fast-IPS ตอบสนอง 0.5ms เมาส์เกมมิ่ง Zowie/Logitech และคีย์บอร์ดกลไก Mechanical'
  },
  {
    id: 'rag-hours',
    category: 'general',
    title: 'เวลาเปิด-ปิด และการเดินทาง พิกัดร้าน',
    tags: ['เวลาเปิด', '24ชั่วโมง', 'เปิดกี่โมง', 'ที่อยู่', 'อยู่ที่ไหน', 'พิกัด', 'แผนที่', 'เบอร์โทร', 'รามคำแหง 53', 'วังทองหลาง'],
    content: 'G-Speed Esport Arena เปิดให้บริการตลอด 24 ชั่วโมง ทุกวัน ตลอดทั้งปี ไม่มีวันหยุด (24/7) ที่ตั้ง: 79 ซ. รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310 แผนที่ Google Maps: https://share.google/Fj1DmZjpx1cBNBVTf โทรศัพท์: 063 793 7704 มีที่จอดรถสะดวกสบายทั้งรถยนต์และมอเตอร์ไซค์ แอร์เย็นฉ่ำ 24 ชม. พร้อมระบบกรองอากาศ PM2.5 และระบบเน็ตเวิร์กความเร็วสูง 10Gbps Dual Fiber'
  },
  {
    id: 'rag-services-overview',
    category: 'services',
    title: 'บริการหลักของศูนย์ G-Speed Esport Arena',
    tags: ['บริการ', 'บริการของเรา', 'มีอะไรบ้าง', 'ร้านเกม', 'เช่าจัดแข่ง', 'ติดตั้งระบบ', 'บริการร้าน'],
    content: 'บริการหลักของ G-Speed Esport Arena ได้แก่: 1. ร้านเกมคอมพิวเตอร์สเปกแข่งขันอีสปอร์ต 24 ชม. (RTX 40 Series, จอ 360Hz/240Hz, โซนทั่วไปและ VIP) 2. เปิดให้เช่าร้านจัดแข่งอีสปอร์ต (เวที 5v5 Stage, จอ LED Wall ขนาดยักษ์, ระบบ Live Streaming, โต๊ะพากย์) 3. รับติดตั้งและวางระบบร้านเกมครบวงจร (Diskless Server, เน็ต 10Gbps Multi-WAN, ระบบ POS บัญชีคลาวด์ และออกแบบผังร้าน 2D/3D) ที่ตั้ง 79 ซ. รามคำแหง 53 โทร 063 793 7704'
  },
  {
    id: 'rag-food',
    category: 'services',
    title: 'บริการอาหาร เครื่องดื่ม และสแน็กบาร์เสิร์ฟถึงโต๊ะ',
    tags: ['อาหาร', 'เครื่องดื่ม', 'กาแฟ', 'สั่งอาหาร', 'เมนู'],
    content: 'ลูกค้าสามารถสั่งอาหารและเครื่องดื่มผ่านหน้าระบบคอมพิวเตอร์ได้ทันทีโดยไม่ต้องลุกจากโต๊ะ เมนูยอดนิยมได้แก่ ข้าวผัดกะเพราหมูกรอบไข่ดาว, ข้าวไข่ข้นแฮม, ไก่ป๊อปสไปซี่, เฟรนช์ฟรายส์ทอดสด, กาแฟสดอาราบิก้า, ชานมไต้หวันพ่นไฟ, และเครื่องดื่มชูกำลัง มีพนักงานนำไปเสิร์ฟถึงโต๊ะเล่นเกมทันที'
  },
  {
    id: 'rag-vip-bootcamp',
    category: 'services',
    title: 'บริการห้อง VIP และ Bootcamp ซ้อมแข่ง',
    tags: ['VIP', 'Bootcamp', 'ห้องส่วนตัว', 'สตรีมเมอร์', 'ซ้อมทีม'],
    content: 'มีห้อง VIP Private Suite ขนาด 5-6 ที่นั่ง เก็บเสียงสองชั้น (Double Acoustic Glass) พร้อมไมโครโฟนบรอดแคสต์ Shure, กล้อง 4K สำหรับสตรีมเมอร์ และเก้าอี้ Secretlab TITAN Evo เหมาะสำหรับทีมแข่งอีสปอร์ตมาบูตแคมป์ซ้อมก่อนแข่งใหญ่ อัตราค่าบริการเหมาห้องชั่วโมงละ 250 บาท หรือวันละ 2,000 บาท (ต้องจองล่วงหน้า)'
  },
  {
    id: 'rag-tournament',
    category: 'events',
    title: 'การจัดแข่งขันทัวร์นาเมนต์และเปิดให้เช่าสถานที่จัดแข่ง',
    tags: ['แข่งเกม', 'ทัวร์นาเมนต์', 'เวที', 'เช่าสถานที่', 'จัดแข่ง', 'เงื่อนไขจัดแข่ง', 'ถ่ายทอดสด', 'เช่าร้าน'],
    content: 'ร้านมีเวที 5v5 Tournament Stage พร้อมระบบถ่ายทอดสด Live Streaming จอ 4K LED Wall ขนาดยักษ์ และโต๊ะพากย์แคสเตอร์ รองรับการจัดแข่งทั้งเกม VALORANT, ROV, PUBG, CS2 สำหรับค่ายเกม สถาบันการศึกษา หรือองค์กรที่ต้องการเช่าจัดแข่งขัน เงื่อนไขและข้อมูลที่ต้องแจ้ง: 1. วันและเวลาที่ต้องการจัด 2. เกมที่ใช้แข่งขัน 3. ชื่องาน/กิจกรรม 4. ชื่อบริษัท/องค์กรผู้จัด 5. จำนวนคนและทีมโดยประมาณ 6. ข้อมูลติดต่อกลับ ติดต่อโทร 063 793 7704'
  },
  {
    id: 'rag-franchise',
    category: 'business',
    title: 'ข้อมูลการลงทุนแฟรนไชส์ G-Speed Esport Arena',
    tags: ['แฟรนไชส์', 'ลงทุน', 'เปิดร้านเกม', 'งบประมาณ', 'ROI', 'คืนทุน', 'ใบเสนอราคา'],
    content: 'แฟรนไชส์ G-Speed Esport Arena มีให้เลือก 3 โมเดล: Size S (30-40 เครื่อง งบ 1.8-2.5 ลบ.), Size M (50-70 เครื่อง งบ 3.2-4.5 ลบ.), และ Size L Mega Arena (80-120 เครื่อง งบ 5.5-8.0 ลบ.) พร้อมระบบ Diskless Server ไม่ต้องใช้ฮาร์ดดิสก์รายเครื่อง, ระบบ POS บัญชีคลาวด์, การตกแต่ง 3D ตามแบรนด์ และการอบรมบุคลากร ระยะเวลาคืนทุนเฉลี่ย 18-24 เดือน'
  },
  {
    id: 'rag-installation-diskless',
    category: 'installation',
    title: 'การติดตั้งระบบร้านเกม Diskless Server & iCafeCloud',
    tags: ['ติดตั้ง', 'ติดตั้งระบบ', 'diskless', 'ดิสเลส', 'เซิร์ฟเวอร์', 'icafecloud', 'ccboot', 'อัปเดตเกม'],
    content: 'บริการติดตั้งระบบดิสเลส (Diskless Boot Server) มาตรฐานระดับอีสปอร์ต รองรับ CCBoot และ iCafeCloud ไม่ต้องมีฮาร์ดดิสก์ในเครื่องลูก อัปเดตเกมที่เซิร์ฟเวอร์แม่จุดเดียว ลูกค้าเล่นเกมได้ทันที รองรับ NVMe PCIe 4.0 RAID Array ความเร็วอ่านเขียน 14,000 MB/s บูตเครื่องเข้า Windows ภายใน 12 วินาที ทีมงานติดตั้งและเซ็ตระบบหน้างานภายใน 2-3 วัน พร้อมระบบ Auto-Failover มีเซิร์ฟเวอร์สำรองไม่ดับ'
  },
  {
    id: 'rag-installation-network',
    category: 'installation',
    title: 'การเดินระบบเน็ตเวิร์ก 10Gbps Multi-WAN & Smart QoS',
    tags: ['เดินสายแลน', 'เน็ตเวิร์ก', 'cat6a', 'fiber', '10gbps', 'สวิตช์', 'ping', 'qos', 'เราเตอร์', 'อินเทอร์เน็ต'],
    content: 'บริการเดินระบบสายแลน CAT6A / Fiber Optic แกนหลัก 10Gbps พร้อม Switch Managed 10G SFP+ แยก VLAN ระหว่างเครื่องเล่นเกม, เครื่องคิดเงิน POS, สตรีมเมอร์ และ Wi-Fi ลูกค้า มีระบบ Multi-WAN Load Balance รวมเน็ต 2-3 ผู้ให้บริการ (AIS Fibre + True Gigatex) สลับสายอัตโนมัติหากสายใดสายหนึ่งขาด ค่า Ping ในประเทศ < 2-3ms หมดปัญหาแล็กหรือวาปในการแข่งขัน'
  },
  {
    id: 'rag-installation-electrical',
    category: 'installation',
    title: 'งานระบบไฟฟ้า 3 เฟส รางร้อยสายไฟ และระบบความปลอดภัย',
    tags: ['ระบบไฟ', 'ไฟ3เฟส', 'ตู้โหลด', 'เบรกเกอร์', 'ups', 'รางสายไฟ', 'สายดิน', 'ความปลอดภัย'],
    content: 'บริการคำนวณโหลดไฟฟ้าและติดตั้งระบบไฟฟ้า 3 เฟส (3-Phase 380V) สำหรับร้านเกมโดยเฉพาะ พร้อมตู้โหลดเซ็นเตอร์แยกเฟสป้องกันไฟตก, ติดตั้งระบบสำรองไฟ UPS True Online สำหรับเครื่อง Diskless Server และเคาน์เตอร์แคชเชียร์ เดินรางสายไฟเหล็ก Wireway ซ่อนใต้โต๊ะเกมมิ่งเรียบร้อย และระบบกราวด์สายดินค่าความต้านทานต่ำกว่า 5 โอห์ม ป้องกันอุปกรณ์ช็อตหรือเสียหาย 100%'
  },
  {
    id: 'rag-installation-lead-n8n',
    category: 'installation',
    title: 'ขั้นตอนการติดต่อขอใบเสนอราคา สำรวจพื้นที่ และประเมินราคาเบื้องต้น',
    tags: ['ติดต่อติดตั้ง', 'สนใจติดตั้ง', 'ขอใบเสนอราคา', 'สำรวจหน้างาน', 'เบอร์โทร', 'ไลน์', 'ราคา', 'งบประมาณ'],
    content: 'สำหรับเจ้าของอาคารหรือผู้สนใจเปิดร้านเกม สามารถแจ้งขนาดพื้นที่และงบประมาณเพื่อให้เจ้าหน้าที่ช่วยประเมินผังร้านและคำนวณงบเบื้องต้นได้ฟรี ทางเราพร้อมให้คำปรึกษา แนะนำสเปกเครื่อง และมีทีมวิศวกรพร้อมเข้าสำรวจหน้างานจริง ติดต่อสอบถามเพิ่มเติมได้ที่สายด่วน: 063 793 7704 หรือ LINE Official: @gspeedarena เปิดให้บริการตลอด 24 ชั่วโมง'
  }
];

// Initial Media Library for Reusable Image Assets & SEO Alt Tags
export const INITIAL_MEDIA_LIBRARY = [
  {
    id: 'med-hero-1',
    name: 'โถงแข่งขัน Pro Stage สว่างสากล (White Arena)',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80',
    alt: 'เวทีแข่งขันอีสปอร์ตระดับสากล GLP Arena สเปก RTX 40 Series จอ 360Hz',
    category: 'hero',
    dimensions: '1920x1080 (16:9)',
    isUploaded: false
  },
  {
    id: 'med-hero-2',
    name: 'บรรยากาศเคาน์เตอร์และล็อบบี้ร้านเกมลักชัวรี',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=80',
    alt: 'ล็อบบี้ต้อนรับและโซนคอมพิวเตอร์เกมมิ่ง G-Speed Esport Arena',
    category: 'hero',
    dimensions: '1920x1080 (16:9)',
    isUploaded: false
  },
  {
    id: 'med-banner-events',
    name: 'แบนเนอร์รวมภาพกิจกรรมและการแข่งขัน LAN',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพบรรยากาศการแข่งขันเกมและกองเชียร์อีสปอร์ต ณ GLP Arena',
    category: 'banners',
    dimensions: '800x450 (16:9)',
    isUploaded: false
  },
  {
    id: 'med-banner-news',
    name: 'แบนเนอร์ข่าวสารและเทคโนโลยีฮาร์ดแวร์เกม',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    alt: 'บทความอัปเดตสเปกเครื่องและการจัดการร้านเกมอีสปอร์ต',
    category: 'banners',
    dimensions: '800x450 (16:9)',
    isUploaded: false
  },
  {
    id: 'med-arena-1',
    name: 'สเตจประลอง 5v5 Soundproof Glass',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    alt: 'ห้องแข่งขันเก็บเสียง 5v5 สตูดิโอทัวร์นาเมนต์อีสปอร์ต',
    category: 'arena',
    dimensions: '1000x600',
    isUploaded: false
  },
  {
    id: 'med-store-1',
    name: 'โซน VIP Bootcamp และสตรีมเมอร์สวีท',
    url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
    alt: 'ห้อง VIP Bootcamp เก้าอี้ Secretlab พร้อมไมค์บรอดแคสต์',
    category: 'store',
    dimensions: '1000x600',
    isUploaded: false
  },
  {
    id: 'med-founder',
    name: 'ภาพผู้บริหารและทีมงานผู้ก่อตั้ง GLP',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    alt: 'คุณเกรียงศักดิ์ วิจิตรพงศ์พันธุ์ ผู้ก่อตั้งและประธานบริหาร G-Speed Living Plus',
    category: 'store',
    dimensions: '600x700',
    isUploaded: false
  }
];

// Initial Navigation Links
export const INITIAL_NAV_LINKS = [
  { id: 'nav-arena', label: 'หน้าแรก & กิจกรรม', target: 'arena', visible: true },
  { id: 'nav-company', label: 'ข้อมูลบริษัท & พาร์ตเนอร์', target: 'company', visible: true },
  { id: 'nav-franchise', label: 'จำลองผังร้าน 3D', target: 'franchise', visible: true }
];

// Initial Franchise & Tournament Leads Pipeline Data
export const INITIAL_LEADS = [
  {
    id: 'lead-1',
    name: 'คุณอนุรักษ์ รัตนวิเชียร',
    company: 'Chiang Mai Esports Hub Co., Ltd.',
    phone: '081-456-7890',
    email: 'anurak.cm@gmail.com',
    location: 'ถ. นิมมานเหมินท์ อ.เมือง จ.เชียงใหม่',
    type: 'franchise_m',
    typeName: 'แฟรนไชส์ Size M (60 เครื่อง)',
    budget: 3800000,
    stage: 'proposal',
    assignedStaff: 'คุณนัท (ฝ่ายขายแฟรนไชส์)',
    channel: 'web_3d_planner',
    floorArea: '220 ตร.ม.',
    expectedOpening: 'พฤศจิกายน 2026',
    notes: 'ส่งแปลน 3D Interior และใบเสนอราคาระบบ Diskless ให้แล้ว ลูกค้าชอบการจัดโซน VIP Suite 2 ห้อง กำลังนัดคุยรายละเอียดสัญญา',
    createdAt: '14/09/2026 11:30',
    updatedAt: '15/09/2026 16:45',
    lastFollowUp: '15/09/2026',
    nextFollowUp: '18/09/2026'
  },
  {
    id: 'lead-2',
    name: 'คุณกัญญาณัฐ สุขสมบัติ',
    company: 'ชมรมอีสปอร์ต มหาวิทยาลัยเกษตรศาสตร์',
    phone: '089-112-3344',
    email: 'esports.ku@ku.ac.th',
    location: 'วิทยาเขตบางเขน กทม.',
    type: 'tournament_venue',
    typeName: 'เช่าสถานที่จัดแข่ง (VALORANT Campus Cup)',
    budget: 85000,
    stage: 'contacted',
    assignedStaff: 'คุณกอล์ฟ (ฝ่ายกิจกรรม & ทัวร์นาเมนต์)',
    channel: 'line_oa',
    floorArea: 'โซน Main Stage + Battleground',
    expectedOpening: '10-11 ตุลาคม 2026',
    notes: 'ต้องการใช้เวทีแข่งขัน 5v5 พร้อมจอ LED Wall และโต๊ะพากย์แคสเตอร์ 2 วันเต็ม โทรคุยรายละเอียดและเสนอแพ็กเกจแล้ว รอเข้าชมสถานที่จริงวันศุกร์นี้',
    createdAt: '15/09/2026 09:15',
    updatedAt: '15/09/2026 14:20',
    lastFollowUp: '15/09/2026',
    nextFollowUp: '17/09/2026'
  },
  {
    id: 'lead-3',
    name: 'คุณธีรพัฒน์ อัศวเดชากุล',
    company: 'อาคารพาณิชย์ลาดพร้าว 101',
    phone: '092-998-1234',
    email: 'teerapat.invest@gmail.com',
    location: 'ซ.ลาดพร้าว 101 วังทองหลาง กทม.',
    type: 'franchise_l',
    typeName: 'แฟรนไชส์ Size L Mega Arena (100 เครื่อง)',
    budget: 6800000,
    stage: 'new',
    assignedStaff: 'คุณนัท (ฝ่ายขายแฟรนไชส์)',
    channel: 'web_3d_planner',
    floorArea: '380 ตร.ม. (ตึก 3 ชั้น)',
    expectedOpening: 'มกราคม 2027',
    notes: 'ลูกค้ากรอกข้อมูลผ่านระบบ 3D Planner บนเว็บ มีตึกพาณิชย์ 3 ชั้นใกล้โรงเรียนและมหาวิทยาลัย สนใจระบบไฟ 3 เฟสและ Diskless',
    createdAt: '16/09/2026 08:40',
    updatedAt: '16/09/2026 08:40',
    lastFollowUp: '16/09/2026',
    nextFollowUp: '16/09/2026'
  },
  {
    id: 'lead-4',
    name: 'บริษัท ไซเบอร์เกมส์ อารีน่า จำกัด (คุณสมชาย)',
    company: 'CyberGames Chonburi',
    phone: '086-778-9900',
    email: 'cybergames.chon@gmail.com',
    location: 'ถ.ลงหาดบางแสน จ.ชลบุรี',
    type: 'diskless_setup',
    typeName: 'ติดตั้งระบบ Diskless Server & 10G Multi-WAN (40 เครื่อง)',
    budget: 450000,
    stage: 'won',
    assignedStaff: 'ช่างเอก (วิศวกรระบบเน็ตเวิร์ก)',
    channel: 'facebook',
    floorArea: '160 ตร.ม.',
    expectedOpening: 'ตุลาคม 2026',
    notes: 'เซ็นสัญญาและชำระมัดจำ 50% เรียบร้อยแล้ว ทีมงานเตรียมเข้าเดินสายแลน CAT6A และติดตั้งเซิร์ฟเวอร์ CCBoot/iCafeCloud วันที่ 22 ก.ย.',
    createdAt: '10/09/2026 14:00',
    updatedAt: '15/09/2026 17:00',
    lastFollowUp: '15/09/2026',
    nextFollowUp: '22/09/2026'
  }
];

// Initial Daily Petty Cash Expenses Data
export const INITIAL_PETTY_CASH = [
  {
    id: 'exp-1',
    time: '10:30',
    date: '16/09/2026',
    amount: 450,
    category: 'maintenance',
    categoryName: 'ซ่อมบำรุง / แอร์',
    desc: 'ค่าล้างแอร์ โซน VIP Suite 1-2',
    recordedBy: 'แอดมิน กอล์ฟ (LINE)',
    rawCommand: '/pay 450 ค่าล้างแอร์ โซน VIP Suite 1-2'
  },
  {
    id: 'exp-2',
    time: '12:15',
    date: '16/09/2026',
    amount: 1200,
    category: 'fnb',
    categoryName: 'วัตถุดิบอาหาร & คาเฟ่',
    desc: 'สั่งไก่ป๊อปและเฟรนช์ฟรายส์เข้าร้าน (Lotus Express)',
    recordedBy: 'ผู้จัดการ บอย (LINE)',
    rawCommand: '/pay 1200 สั่งไก่ป๊อปและเฟรนช์ฟรายส์เข้าร้าน'
  },
  {
    id: 'exp-3',
    time: '14:40',
    date: '16/09/2026',
    amount: 350,
    category: 'fnb',
    categoryName: 'วัตถุดิบอาหาร & คาเฟ่',
    desc: 'ค่าน้ำแข็งหลอดยูนิต 3 กระสอบ',
    recordedBy: 'พนักงาน นัท (LINE)',
    rawCommand: '/pay 350 ค่าน้ำแข็งหลอดยูนิต 3 กระสอบ'
  },
  {
    id: 'exp-4',
    time: '16:00',
    date: '16/09/2026',
    amount: 680,
    category: 'it_hardware',
    categoryName: 'อุปกรณ์ไอที / สายไฟ',
    desc: 'ซื้อหัวแลน RJ45 CAT6A และสาย Patch Cord สำรอง',
    recordedBy: 'ช่างเอก (LINE)',
    rawCommand: '/pay 680 ซื้อหัวแลน RJ45 CAT6A'
  }
];

// Initial Omnichannel Unified Inbox Conversations
export const INITIAL_OMNICHANNEL_CHATS = [
  {
    id: 'chat-line-1',
    channel: 'line',
    channelName: 'LINE Official Account (@gspeedarena)',
    customerName: 'คุณอาร์ม (Arm Gamer)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    lastMessage: 'ตอนนี้เครื่องโซน VIP ว่างไหมครับ จะพาเพื่อนไปซ้อม 5 คน',
    timestamp: '15:20 น.',
    status: 'assigned',
    assignedAgent: 'แอดมิน กอล์ฟ (ฝ่ายบริการลูกค้า)',
    aiMutedUntil: Date.now() + 2400000,
    department: 'customer_service',
    unreadCount: 0,
    messages: [
      { id: 'm-1', sender: 'customer', text: 'สวัสดีครับ', time: '15:15' },
      { id: 'm-2', sender: 'bot', text: 'สวัสดีครับ! ยินดีต้อนรับสู่ G-Speed Esport Arena สอบถามข้อมูลด้านใดแจ้งได้เลยครับ', time: '15:15' },
      { id: 'm-3', sender: 'customer', text: 'ตอนนี้เครื่องโซน VIP ว่างไหมครับ จะพาเพื่อนไปซ้อม 5 คน', time: '15:18' },
      { id: 'm-4', sender: 'system', text: '👤 แอดมิน กอล์ฟ (ฝ่ายบริการลูกค้า) รับเคสดูแลต่อแล้ว (AI ถูกระงับชั่วคราว 60 นาที)', time: '15:19' },
      { id: 'm-5', sender: 'agent', agentName: 'แอดมิน กอล์ฟ', text: 'สวัสดีครับคุณอาร์ม ตอนนี้ห้อง VIP Suite 1 กำลังว่างครับ สามารถ walk-in เข้ามาได้เลย หรือให้ผมล็อกเครื่องไว้ให้ก่อน 30 นาทีไหมครับ?', time: '15:20' }
    ]
  },
  {
    id: 'chat-web-2',
    channel: 'web',
    channelName: 'Web Live Chat',
    customerName: 'คุณธีรพัฒน์ (นักลงทุน)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    lastMessage: 'กำลังดูระบบจำลองผังร้าน 3D ขนาด Size L คืนทุนเฉลี่ยกี่เดือนครับ?',
    timestamp: '15:25 น.',
    status: 'bot',
    assignedAgent: null,
    aiMutedUntil: null,
    department: 'franchise_sales',
    unreadCount: 1,
    messages: [
      { id: 'm-1', sender: 'customer', text: 'กำลังดูระบบจำลองผังร้าน 3D ขนาด Size L คืนทุนเฉลี่ยกี่เดือนครับ?', time: '15:25' },
      { id: 'm-2', sender: 'bot', text: 'แฟรนไชส์ Size L Mega Arena (80-120 เครื่อง) งบประมาณ 5.5 - 8.0 ลบ. มีระยะเวลาคืนทุนเฉลี่ยอยู่ที่ 18-24 เดือนครับ โดยขึ้นอยู่กับทำเลและบริการเสริม (F&B / Bootcamp) ทางเรามีระบบ Diskless และ POS บัญชีคลาวด์ช่วยบริหารต้นทุน หากต้องการใบเสนอราคาอย่างละเอียด แจ้งเบอร์โทรให้เจ้าหน้าที่ติดต่อกลับได้เลยครับ', time: '15:25' }
    ]
  },
  {
    id: 'chat-fb-3',
    channel: 'facebook',
    channelName: 'Facebook Messenger',
    customerName: 'Sompong E-Sport Club',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
    lastMessage: 'ขอรายละเอียดระเบียบการแข่ง VALORANT ทัวร์นาเมนต์สิ้นเดือนนี้หน่อยครับ',
    timestamp: '14:50 น.',
    status: 'bot',
    assignedAgent: null,
    aiMutedUntil: null,
    department: 'tournament',
    unreadCount: 0,
    messages: [
      { id: 'm-1', sender: 'customer', text: 'ขอรายละเอียดระเบียบการแข่ง VALORANT ทัวร์นาเมนต์สิ้นเดือนนี้หน่อยครับ', time: '14:50' },
      { id: 'm-2', sender: 'bot', text: 'การแข่งขัน GLP VALORANT CHAMPIONSHIP 2026 ชิงเงินรางวัลรวม 100,000 บาท แข่งขันรอบ LAN Final ณ Main Stage วันที่ 28-30 กันยายน 2026 สมัครได้ตั้งแต่วันนี้ - 25 ก.ย. รับจำกัด 32 ทีมครับ ค่าสมัครฟรี ดูรายละเอียดและกติกาบนหน้าเว็บไซต์ได้ทันทีครับ', time: '14:50' }
    ]
  }
];

// Initial Hardware Stations & Asset Health
export const INITIAL_HARDWARE_STATIONS = [
  { id: 'PC-01', zone: 'Standard Battleground', gpu: 'RTX 4070 SUPER', monitor: 'BenQ 240Hz', status: 'gaming', user: 'Member #0842', uptime: '3.5 ชม.' },
  { id: 'PC-02', zone: 'Standard Battleground', gpu: 'RTX 4070 SUPER', monitor: 'BenQ 240Hz', status: 'gaming', user: 'Member #1120', uptime: '1.2 ชม.' },
  { id: 'PC-03', zone: 'Standard Battleground', gpu: 'RTX 4070 SUPER', monitor: 'BenQ 240Hz', status: 'available', user: '-', uptime: '0 ชม.' },
  { id: 'PC-04', zone: 'Standard Battleground', gpu: 'RTX 4070 SUPER', monitor: 'BenQ 240Hz', status: 'gaming', user: 'Guest #33', uptime: '4.1 ชม.' },
  { id: 'PC-05', zone: 'Standard Battleground', gpu: 'RTX 4070 SUPER', monitor: 'BenQ 240Hz', status: 'available', user: '-', uptime: '0 ชม.' },
  { id: 'PC-06', zone: 'Standard Battleground', gpu: 'RTX 4070 SUPER', monitor: 'BenQ 240Hz', status: 'gaming', user: 'Member #0991', uptime: '2.0 ชม.' },
  { id: 'VIP-01', zone: 'VIP Private Bootcamp', gpu: 'RTX 4080 SUPER', monitor: 'BenQ 360Hz', status: 'gaming', user: 'Team Slayer (Cpt)', uptime: '5.0 ชม.' },
  { id: 'VIP-02', zone: 'VIP Private Bootcamp', gpu: 'RTX 4080 SUPER', monitor: 'BenQ 360Hz', status: 'gaming', user: 'Team Slayer', uptime: '5.0 ชม.' },
  { id: 'VIP-03', zone: 'VIP Private Bootcamp', gpu: 'RTX 4080 SUPER', monitor: 'BenQ 360Hz', status: 'maintenance', user: 'RMA Fan Issue', uptime: '-' },
  { id: 'VIP-04', zone: 'VIP Private Bootcamp', gpu: 'RTX 4080 SUPER', monitor: 'BenQ 360Hz', status: 'gaming', user: 'Team Slayer', uptime: '5.0 ชม.' },
  { id: 'STAGE-01', zone: 'Main Arena Stage 5v5', gpu: 'RTX 4090 OC', monitor: 'BenQ 360Hz OLED', status: 'standby', user: 'Tournament Host', uptime: '-' },
  { id: 'STAGE-02', zone: 'Main Arena Stage 5v5', gpu: 'RTX 4090 OC', monitor: 'BenQ 360Hz OLED', status: 'standby', user: 'Tournament Host', uptime: '-' }
];

// Initial RMA & Warranty Claims Data
export const INITIAL_RMA_CLAIMS = [
  {
    id: 'rma-1',
    stationId: 'PC-24',
    item: 'หน้าจอ BenQ ZOWIE XL2566K 360Hz',
    sn: 'ETL890281923',
    distributor: 'Synnex Thailand',
    issue: 'มีเส้นสีฟ้าพาดกลางจอ 1 เส้น (Vertical Artifact)',
    sentDate: '10/09/2026',
    status: 'repairing',
    statusName: 'กำลังอยู่ระหว่างซ่อม/เปลี่ยนแผงวงจร',
    trackingNo: 'TH0192847291',
    estimatedReturn: '20/09/2026'
  },
  {
    id: 'rma-2',
    stationId: 'VIP-03',
    item: 'การ์ดจอ NVIDIA GeForce RTX 4080 SUPER 16GB',
    sn: 'SN4080SP8812',
    distributor: 'Ascenti Resources (ARC)',
    issue: 'พัดลมตัวที่ 2 หมุนมีเสียงดังผิดปกติและรอบตก',
    sentDate: '13/09/2026',
    status: 'sent',
    statusName: 'ส่งศูนย์บริการแล้ว รอการตรวจสอบ',
    trackingNo: 'ARC-RMA-8921',
    estimatedReturn: '25/09/2026'
  }
];

// Initial Site Data Key
const STORAGE_KEY = 'gspeed_site_cms_data_v2';

export const DEFAULT_SITE_DATA = {
  theme: {
    primaryColor: '#1d4ed8',
    secondaryColor: '#0ea5e9',
    backgroundColor: '#ffffff',
    surfaceColor: '#f8fafc',
    fontHeading: "'Inter', sans-serif"
  },
  globalSEO: {
    metaTitle: 'GLP : G Speed Living Plus | ศูนย์อีสปอร์ตครบวงจร & ระบบแฟรนไชส์จัดผังร้านอัจฉริยะ',
    metaDescription: 'ศูนย์รวมอีสปอร์ตครบวงจร สเปกคอมไฮเอนด์ RTX 40 Series จอ 360Hz เวทีแข่งมาตรฐานสากล พร้อมระบบจำลองผังร้านแฟรนไชส์ 3D',
    keywords: 'ร้านเกม, อีสปอร์ต, แฟรนไชส์ร้านเกม, GLP, G Speed Living Plus, จัดผังร้านเกม 3D, RTX 4090, BenQ 360Hz',
    ogImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    twitterHandle: '@GSpeedLivingPlus'
  },
  tickerText: 'เปิดรับสมัคร GLP VALORANT CHAMPIONSHIP 2026 ชิง 100,000 บาท | ระบบจำลองผังร้าน 3D Interior Planner พร้อมใช้งานแล้ว',
  tickerBadge: 'ประกาศสำคัญ',
  tickerLinkTab: 'franchise',
  tickerLinkTarget: 'franchise',
  tickerLinkText: 'เปิดระบบ 3D',
  tickerLinkVisible: true,
  headerCta: {
    text: 'คำนวณราคาเปิดร้าน',
    target: 'franchise',
    visible: true
  },
  navLinks: INITIAL_NAV_LINKS,
  hero: {
    badge: 'THE NEXT-GEN ESPORT & FRANCHISE HUB',
    title: 'ศูนย์รวมอีสปอร์ตครบวงจร & พื้นที่ประลองเกมมาตรฐานสากล',
    subtitle: 'สัมผัสประสบการณ์เกมมิ่งระดับเวิลด์คลาสด้วยเครื่องสเปกไฮเอนด์ RTX 40 Series จอ 360Hz และเวทีแข่งขันมาตรฐาน Pro Circuit พร้อมระบบคำนวณและจำลองผังร้านแฟรนไชส์อัจฉริยะ',
    primaryCta: 'สำรวจกิจกรรม & ทัวร์นาเมนต์',
    primaryCtaLink: '#activities',
    secondaryCta: 'จำลองผังร้าน 3D แฟรนไชส์',
    bgColor: '#ffffff',
    titleColor: '#0f172a',
    subtitleColor: '#475569',
    backgroundImage: '',
    bgOverlayImage: '',
    overlayOpacity: 0.35,
    overlayType: 'light',
    imageAlt: 'ศูนย์รวมอีสปอร์ตครบวงจร GLP G-Speed Living Plus แฟรนไชส์ร้านเกม 3D',
    metrics: [
      { number: '750+', label: 'Battle Stations ทั่วประเทศ' },
      { number: '360Hz', label: 'Fast-IPS & OLED Displays' },
      { number: '10Gbps', label: 'Dedicated Multi-WAN Ping < 3ms' },
      { number: '24/7', label: 'เปิดบริการตลอด 24 ชั่วโมง' }
    ]
  },
  featureBanners: {
    bannerLeft: {
      badge: 'GLP OUR EVENTS',
      title: 'รวมภาพกิจกรรม & บรรยากาศสด',
      desc: 'ภาพงานแข่ง LAN, งานเปิดตัวเกม, มีตติ้ง และพิธีมอบรางวัลชนะเลิศตลอดทั้งปี',
      linkText: 'สำรวจอัลบั้มภาพกิจกรรม',
      linkTarget: '#activities',
      bgColor: '#1e3a8a',
      titleColor: '#ffffff',
      descColor: '#cbd5e1',
      bgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      alt: 'ภาพบรรยากาศการแข่งขันเกมและกองเชียร์อีสปอร์ต ณ GLP Arena'
    },
    bannerRight: {
      badge: 'GLP BLOG & NEWS',
      title: 'บทความ ข่าวสาร & ไฮไลต์เกม',
      desc: 'เกาะติดผลการแข่งขัน ทริกการเล่น สเปกอุปกรณ์ใหม่ และประกาศจากทางร้าน',
      linkText: 'อ่านบทความล่าสุด',
      linkTarget: '#news',
      bgColor: '#1e293b',
      titleColor: '#ffffff',
      descColor: '#cbd5e1',
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      alt: 'บทความ ข่าวสารวงการเกม และอัปเดตสเปกฮาร์ดแวร์ GLP Esports'
    }
  },
  tournamentsSection: {
    badge: 'TOURNAMENTS & COMMUNITY EVENTS',
    title: 'ปฏิทินการแข่งขัน อีสปอร์ตประจำเดือน',
    subtitle: 'ร่วมชิงเงินรางวัลรวมกว่าหลายแสนบาท พิสูจน์ฝีมือบนเวที LAN Final ถ่ายทอดสดสู่สายตาแฟนเกมทั่วประเทศ',
    bgColor: '#ffffff',
    titleColor: '#0f172a',
    subtitleColor: '#475569'
  },
  zonesSection: {
    badge: 'VENUE ATMOSPHERE & ZONES',
    title: 'บรรยากาศและโซนการให้บริการ GLP ESPORTS',
    subtitle: 'สัมผัสความพรีเมียมที่ออกแบบมาสำหรับเกมเมอร์ทุกสไตล์ ตั้งแต่ผู้เล่นทั่วไป สตรีมเมอร์ ไปจนถึงการประลองระดับแชมป์เปียนชิป',
    bgColor: '#f8fafc',
    titleColor: '#0f172a',
    subtitleColor: '#475569'
  },
  newsSection: {
    badge: 'ARTICLES & UPDATES',
    title: 'บทความและข่าวสาร GLP ESPORTS',
    subtitle: 'อัปเดตความเคลื่อนไหววงการอีสปอร์ต เทคโนโลยีใหม่ และสรุปผลการแข่งขันที่จัดขึ้นในร้าน',
    bgColor: '#ffffff',
    titleColor: '#0f172a',
    subtitleColor: '#475569'
  },
  franchiseBanner: {
    badge: 'G-SPEED FRANCHISE & INTERIOR PLANNER',
    heading: 'อยากมีร้านเกมอีสปอร์ตสเปกเทพเป็นของตัวเอง?',
    desc: 'เพียงแค่คุณมีพื้นที่หรืออาคาร เรามีระบบ Interior Floor Plan Configurator ช่วยจำลองผังร้าน 2D สเกลจริง จัดวางโต๊ะคอมพิวเตอร์ เวทีแข่งขัน เคาน์เตอร์ และคำนวณต้นทุน สเปกอุปกรณ์ ระยะเวลาคืนทุน (ROI) และเวลาติดตั้งให้ทันที!',
    buttonText: 'เริ่มออกแบบผังร้าน & ประเมินงบประมาณทันที',
    buttonLink: 'franchise',
    bgColor: '#1e3a8a',
    headingColor: '#ffffff',
    descColor: '#bfdbfe',
    bgImage: ''
  },
  venueZones: INITIAL_ZONES,
  tournaments: INITIAL_TOURNAMENTS,
  gallery: INITIAL_GALLERY,
  news: INITIAL_NEWS,
  founder: {
    ...INITIAL_FOUNDER,
    bgColor: '#ffffff',
    titleColor: '#0f172a',
    textColor: '#475569'
  },
  catalogItems: INITIAL_CATALOG,
  hardwareTiers: INITIAL_TIERS,
  ragKnowledge: INITIAL_RAG_KNOWLEDGE,
  mediaLibrary: INITIAL_MEDIA_LIBRARY,
  openRouterSettings: {
    apiKey: '',
    proxyUrl: '',
    useSecureProxy: false,
    model: 'google/gemini-flash-3.8',
    temperature: 0.7,
    maxTokens: 1024,
    systemPrompt: 'คุณคือผู้ช่วย AI ประจำศูนย์ GLP : G Speed Living Plus ตอบคำถามเกี่ยวกับบริการร้านเกม อัตราค่าชั่วโมง สเปกคอม และระบบแฟรนไชส์อย่างสุภาพและถูกต้อง',
    isEnabled: true
  },
  openWebUIConfig: {
    baseUrl: 'https://openwebui.gspeedarena.com',
    apiKey: '',
    model: 'glp-esports-assistant:latest',
    ragCollection: 'gspeed-knowledge-base',
    enabled: true,
    lastPing: 'Online (Latency 28ms)'
  },
  omnichannelConfig: {
    lineWebhookUrl: 'https://n8n.gspeedarena.com/webhook/line-inbound',
    facebookWebhookUrl: 'https://n8n.gspeedarena.com/webhook/meta-inbound',
    webWidgetWebhookUrl: 'https://n8n.gspeedarena.com/webhook/omnichannel-chat',
    unifiedInboxUrl: 'https://chatwoot.gspeedarena.com',
    autoHandoverToStaff: true
  },
  aiGuardrails: {
    strictStoreOnly: true,
    outOfScopeReply: 'ขออภัยด้วยครับ ผมเป็นผู้ช่วย AI ประจำศูนย์ GLP : G Speed Living Plus จึงสามารถตอบได้เฉพาะข้อมูลและบริการของทางร้านเท่านั้นครับ เช่น อัตราค่าบริการ, สเปกคอมพิวเตอร์, การจองห้อง VIP, เมนูอาหาร หรือการลงทุนแฟรนไชส์ หากมีข้อสงสัยเกี่ยวกับร้าน สามารถสอบถามได้ทันทีครับ',
    blockedKeywords: ['การเมือง', 'หวย', 'พนัน', 'เขียนโค้ด', 'แต่งกลอน', 'การบ้าน', 'คู่แข่ง', 'แฮก'],
    pendingQuestions: [
      { id: 'q-1', query: 'มีห้องสูบบุหรี่ในร้านไหม', timestamp: '13/09/2026 14:15', status: 'pending' },
      { id: 'q-2', query: 'รับจัดงานแข่งระดับมัธยมแบบเหมาวันไหม', timestamp: '13/09/2026 15:02', status: 'pending' }
    ]
  },
  securityConfig: {
    adminUsername: 'admin',
    adminPassword: 'gspeed2026',
    requirePin: false,
    lastLogin: '13/09/2026 15:45'
  },
  erpConfig: {
    posSoftware: 'SmartCafé Pro (Cloud Diskless Edition)',
    apiUrl: 'https://api.smartcafe.in.th/v2/erp/bridge',
    apiToken: 'sc_live_sec_89df7128a8d1',
    storeCode: 'GLP-RAMKHAMHAENG-01',
    autoSync: true,
    syncIntervalMin: 15,
    syncOptions: { syncGaming: true, syncFnb: true, syncMembers: true, syncPowerCost: true }
  },
  erpData: {
    isConnected: true,
    posSoftware: 'SmartCafé Pro (Cloud Diskless Edition)',
    syncIntervalMin: 15,
    lastSyncTime: '13/09/2026 15:50',
    dailyRevenue: {
      gaming: 37900,
      fnb: 10750,
      merchandise: 0,
      total: 48650
    },
    monthlyRevenue: 1420000,
    monthlyProfit: 910000,
    costs: {
      electricity: 7200,
      fiberInternet: 1200,
      staffSalary: 6000,
      totalCost: 14400
    },
    peakHours: [
      { time: '10:00 - 14:00 (เปิดบริการช่วงเช้า)', occupancy: 42, revenue: 6800 },
      { time: '14:00 - 18:00 (ช่วงบ่าย & หลังเลิกเรียน)', occupancy: 78, revenue: 14200 },
      { time: '18:00 - 00:00 (Prime Peak Time แข่งขัน/ปาร์ตี้)', occupancy: 96, revenue: 21500 },
      { time: '00:00 - 08:00 (Night Owl Session ยันเช้า)', occupancy: 48, revenue: 6150 }
    ],
    topSellingItems: [
      { rank: 1, name: 'ข้าวผัดกะเพราเนื้อวากิวไข่ดาวกรอบ', count: 68, total: 6052, share: 29.2 },
      { rank: 2, name: 'บะหมี่เกาหลีหม้อไฟชีสดับเบิ้ล', count: 54, total: 4806, share: 23.2 },
      { rank: 3, name: 'G-Speed Energy Elixir (สูตรพิเศษ)', count: 95, total: 4275, share: 20.6 },
      { rank: 4, name: 'ชาเขียวมัทฉะลาเต้พรีเมียม', count: 48, total: 2880, share: 13.9 },
      { rank: 5, name: 'ไก่ทอดคาราเกะซอสสไปซี่', count: 42, total: 2730, share: 13.1 }
    ],
    aiExecutiveSummary: 'วันนี้มีอัตราการใช้งานเฉลี่ย 78.4% โซน Stage 5v5 และห้อง VIP Suite มีคิวจองเต็ม 100% ยอดขายเครื่องดื่มและอาหารเติบโตขึ้น 28% จากการสั่งผ่านหน้าจอคอมพิวเตอร์โดยตรง ต้นทุนค่าไฟฟ้าอยู่ในเกณฑ์ปกติ (เฉลี่ย 18.2 หน่วย/เครื่อง/วัน) แนะนำให้โปรโมตแพ็กเกจเหมาค่ำคืน Night Owl สำหรับวันธรรมดาเพื่อดึงดูดลูกค้าช่วงหลังเที่ยงคืน'
  },
  n8nWorkflows: [
    {
      id: 'wf-omnichannel',
      name: 'Omnichannel Customer Inquiries & OpenWebUI Router',
      desc: 'รับข้อความจากทุกช่องทาง (Web Widget, LINE OA, Facebook Messenger) ตรวจสอบสิทธิ์สมาชิกใน ERP และส่งต่อไปยัง OpenWebUI/LLM ตอบกลับอัตโนมัติ',
      endpoint: 'https://n8n.gspeedarena.com/webhook/omnichannel-chat',
      enabled: true,
      lastStatus: 'Active (200 OK)',
      eventsCount: 320
    },
    {
      id: 'wf-lead',
      name: 'Franchise Lead & 3D Blueprint Automation',
      desc: 'ส่งข้อมูลใบเสนอราคาและไฟล์แปลนอาคารไปยัง n8n เพื่อส่งต่อ LINE / Discord / Google Sheets',
      endpoint: 'https://n8n.gspeedarena.com/webhook/franchise-lead',
      enabled: true,
      lastStatus: 'Active (200 OK)',
      eventsCount: 42
    },
    {
      id: 'wf-tournament',
      name: 'Tournament Team Registration Automation',
      desc: 'รับข้อมูลการสมัครแข่งขัน ตรวจสอบรายชื่อผู้เล่น และสร้าง Team ID อัตโนมัติ',
      endpoint: 'https://n8n.gspeedarena.com/webhook/tournament-register',
      enabled: true,
      lastStatus: 'Active (200 OK)',
      eventsCount: 18
    },
    {
      id: 'wf-pos',
      name: 'End-of-Day POS & Accounting Sync Automation',
      desc: 'สรุปยอดขายประจำวัน ค่าชั่วโมง ยอด F&B และค่าไฟ ส่งไปยังระบบบัญชี FlowAccount / Xero',
      endpoint: 'https://n8n.gspeedarena.com/webhook/pos-accounting-daily',
      enabled: true,
      lastStatus: 'Active (200 OK)',
      eventsCount: 120
    },
    {
      id: 'wf-escalation',
      name: 'AI Chatbot Staff Escalation to LINE Notify',
      desc: 'แจ้งเตือนพนักงานและผู้จัดการร้านทันทีเมื่อมีคำถามที่ AI ไม่สามารถตอบได้',
      endpoint: 'https://n8n.gspeedarena.com/webhook/ai-escalation',
      enabled: true,
      lastStatus: 'Standby',
      eventsCount: 5
    }
  ],
  webhooks: {
    leadWebhookUrl: '',
    discordBookingUrl: '',
    autoNotification: true
  },
  footer: {
    description: 'ศูนย์กีฬาอีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากล บริหารงานโดย GLP Living Plus Group พร้อมระบบโซลูชันแฟรนไชส์อัจฉริยะสำหรับผู้ประกอบการรุ่นใหม่',
    phone: '063 793 7704',
    email: 'contact@gspeedarena.com',
    line: '@gspeedarena',
    address: '79 ซ. รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310',
    googleMapUrl: 'https://share.google/Fj1DmZjpx1cBNBVTf',
    copyright: '© 2026 GLP : G Speed Living Plus. All Rights Reserved.',
    socialLinks: {
      facebook: 'https://facebook.com/gspeedesport',
      discord: 'https://discord.gg/gspeed',
      youtube: 'https://youtube.com/@gspeedarena',
      steam: 'https://steamcommunity.com/groups/gspeed'
    }
  },
  leads: INITIAL_LEADS,
  pettyCashExpenses: INITIAL_PETTY_CASH,
  omnichannelChats: INITIAL_OMNICHANNEL_CHATS,
  hardwareStations: INITIAL_HARDWARE_STATIONS,
  rmaClaims: INITIAL_RMA_CLAIMS
};

// Deep merge helper ensuring every nested property in defaults is present
function deepMerge(target, source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return source !== undefined ? source : target;
  }
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  // Load state from localStorage or initialize with mock data
  const [siteData, setSiteData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge saved data with defaults so NO missing keys exist
        const merged = deepMerge(DEFAULT_SITE_DATA, parsed);

        // Update default address/phone if old placeholder address exists
        if (merged.footer) {
          if (!merged.footer.phone || merged.footer.phone.includes('02-888-9999')) {
            merged.footer.phone = DEFAULT_SITE_DATA.footer.phone;
          }
          if (!merged.footer.address || merged.footer.address.includes('รามคำแหง 24')) {
            merged.footer.address = DEFAULT_SITE_DATA.footer.address;
          }
          if (!merged.footer.googleMapUrl) {
            merged.footer.googleMapUrl = DEFAULT_SITE_DATA.footer.googleMapUrl;
          }
        }

        // Ensure array types are intact
        if (!Array.isArray(merged.gallery)) merged.gallery = INITIAL_GALLERY;
        if (!Array.isArray(merged.news)) merged.news = INITIAL_NEWS;
        if (!Array.isArray(merged.catalogItems)) merged.catalogItems = INITIAL_CATALOG;
        if (!Array.isArray(merged.hardwareTiers)) merged.hardwareTiers = INITIAL_TIERS;
        if (!Array.isArray(merged.tournaments)) {
          merged.tournaments = INITIAL_TOURNAMENTS;
        } else {
          merged.tournaments = merged.tournaments.map(t => {
            const def = INITIAL_TOURNAMENTS.find(it => it.id === t.id);
            if (def) {
              return {
                ...def,
                ...t,
                teams: (t.teams && t.teams.length > 0) ? t.teams : def.teams,
                galleryPhotos: (t.galleryPhotos && t.galleryPhotos.length > 0) ? t.galleryPhotos : def.galleryPhotos,
                rules: (t.rules && t.rules.length > 0) ? t.rules : def.rules,
                prizeDistribution: (t.prizeDistribution && t.prizeDistribution.length > 0) ? t.prizeDistribution : def.prizeDistribution,
                scheduleTimetable: (t.scheduleTimetable && t.scheduleTimetable.length > 0) ? t.scheduleTimetable : def.scheduleTimetable,
                seo: (t.seo && t.seo.metaTitle) ? t.seo : def.seo
              };
            }
            return {
              teams: [],
              galleryPhotos: [],
              rules: [],
              prizeDistribution: [],
              scheduleTimetable: [],
              seo: {},
              ...t
            };
          });
        }
        if (!Array.isArray(merged.venueZones)) merged.venueZones = INITIAL_ZONES;
        if (!Array.isArray(merged.navLinks)) merged.navLinks = INITIAL_NAV_LINKS;
        if (!Array.isArray(merged.n8nWorkflows)) merged.n8nWorkflows = DEFAULT_SITE_DATA.n8nWorkflows;
        if (!Array.isArray(merged.ragKnowledge)) {
          merged.ragKnowledge = INITIAL_RAG_KNOWLEDGE;
        } else {
          // Merge any newly introduced default RAG items if missing by id, or update core hours/tournament
          INITIAL_RAG_KNOWLEDGE.forEach(defaultItem => {
            const existingIdx = merged.ragKnowledge.findIndex(k => k.id === defaultItem.id);
            if (existingIdx >= 0) {
              if (defaultItem.id === 'rag-hours' || defaultItem.id === 'rag-tournament' || defaultItem.id === 'rag-services-overview') {
                merged.ragKnowledge[existingIdx] = defaultItem;
              }
            } else {
              merged.ragKnowledge.push(defaultItem);
            }
          });
        }

        if (!merged.erpData || typeof merged.erpData !== 'object') {
          merged.erpData = DEFAULT_SITE_DATA.erpData;
        } else {
          if (!merged.erpData.dailyRevenue || typeof merged.erpData.dailyRevenue !== 'object') {
            merged.erpData.dailyRevenue = DEFAULT_SITE_DATA.erpData.dailyRevenue;
          }
          if (!Array.isArray(merged.erpData.peakHours) || merged.erpData.peakHours.length === 0) {
            merged.erpData.peakHours = DEFAULT_SITE_DATA.erpData.peakHours;
          } else {
            merged.erpData.peakHours = merged.erpData.peakHours.map(slot => ({
              time: slot?.time || '00:00',
              occupancy: Number(slot?.occupancy) || 0,
              revenue: Number(slot?.revenue) || 0,
              ...slot
            }));
          }
          if (!Array.isArray(merged.erpData.topSellingItems) || merged.erpData.topSellingItems.length === 0) {
            merged.erpData.topSellingItems = DEFAULT_SITE_DATA.erpData.topSellingItems;
          } else {
            merged.erpData.topSellingItems = merged.erpData.topSellingItems.map((item, idx) => ({
              rank: item?.rank || idx + 1,
              name: item?.name || 'รายการสินค้า',
              count: Number(item?.count) || 0,
              total: Number(item?.total) || (Number(item?.price) ? Number(item.price) * (Number(item.count) || 1) : 0),
              share: Number(item?.share) || 0,
              ...item
            }));
          }
        }

        if (!merged.securityConfig || typeof merged.securityConfig !== 'object') {
          merged.securityConfig = DEFAULT_SITE_DATA.securityConfig;
        } else {
          merged.securityConfig = { ...DEFAULT_SITE_DATA.securityConfig, ...merged.securityConfig };
        }

        // Hydrate gallery items with mockData slugs & rich content if missing
        merged.gallery = merged.gallery.map(item => {
          const initial = INITIAL_GALLERY.find(g => g.id === item.id);
          return initial 
            ? { ...initial, ...item, slug: item.slug || initial.slug, galleryPhotos: item.galleryPhotos || initial.galleryPhotos, contentParagraphs: item.contentParagraphs || initial.contentParagraphs }
            : item;
        });

        // Hydrate news items with mockData slugs, tags & rich content if missing
        merged.news = merged.news.map(item => {
          const initial = INITIAL_NEWS.find(n => n.id === item.id);
          return initial
            ? { ...initial, ...item, slug: item.slug || initial.slug, tags: item.tags || initial.tags, contentParagraphs: item.contentParagraphs || initial.contentParagraphs, galleryPhotos: item.galleryPhotos || initial.galleryPhotos, seo: item.seo || initial.seo }
            : item;
        });

        // Hydrate catalog items with mockData images, colors, grade, and warranty if missing
        merged.catalogItems = merged.catalogItems.map(item => {
          const initial = INITIAL_CATALOG.find(c => c.type === item.type);
          return initial
            ? { 
                ...initial, 
                ...item, 
                image: item.image || initial.image,
                grade: item.grade || initial.grade || 'pro',
                deskColor: item.deskColor || initial.deskColor || item.color || '#0f172a',
                accentColor: item.accentColor || initial.accentColor || '#1d4ed8',
                chairColor: item.chairColor || initial.chairColor || '#0f172a',
                warranty: item.warranty || initial.warranty,
                leadTime: item.leadTime || initial.leadTime,
                material: item.material || initial.material
              }
            : item;
        });

        // Self-repair contrast traps and defaults for Hero Section and Feature Banners
        if (merged.hero) {
          // Default to 'light' clean white theme so adding an image preserves the bright white aesthetic
          if (!merged.hero.overlayType || merged.hero.overlayType === 'dark') {
            merged.hero.overlayType = 'light';
          }
          if (merged.hero.overlayType === 'light') {
            merged.hero.bgColor = '#ffffff';
            merged.hero.titleColor = '#0f172a';
            merged.hero.subtitleColor = '#475569';
            if (!merged.hero.overlayOpacity || merged.hero.overlayOpacity < 0.6) {
              merged.hero.overlayOpacity = 0.82;
            }
          }
        }
        if (merged.featureBanners) {
          if (!merged.featureBanners.bannerLeft?.image) {
            merged.featureBanners.bannerLeft = {
              ...DEFAULT_SITE_DATA.featureBanners.bannerLeft,
              ...(merged.featureBanners.bannerLeft || {}),
              image: DEFAULT_SITE_DATA.featureBanners.bannerLeft.image
            };
          }
          if (!merged.featureBanners.bannerRight?.image) {
            merged.featureBanners.bannerRight = {
              ...DEFAULT_SITE_DATA.featureBanners.bannerRight,
              ...(merged.featureBanners.bannerRight || {}),
              image: DEFAULT_SITE_DATA.featureBanners.bannerRight.image
            };
          }
        }

        if (!Array.isArray(merged.leads) || merged.leads.length === 0) {
          merged.leads = INITIAL_LEADS;
        }
        if (!Array.isArray(merged.pettyCashExpenses) || merged.pettyCashExpenses.length === 0) {
          merged.pettyCashExpenses = INITIAL_PETTY_CASH;
        }
        if (!Array.isArray(merged.omnichannelChats) || merged.omnichannelChats.length === 0) {
          merged.omnichannelChats = INITIAL_OMNICHANNEL_CHATS;
        }
        if (!Array.isArray(merged.hardwareStations) || merged.hardwareStations.length === 0) {
          merged.hardwareStations = INITIAL_HARDWARE_STATIONS;
        }
        if (!Array.isArray(merged.rmaClaims) || merged.rmaClaims.length === 0) {
          merged.rmaClaims = INITIAL_RMA_CLAIMS;
        }

        return merged;
      }
    } catch (e) {
      console.warn('Failed to load saved CMS data, fallback to defaults', e);
    }

    return DEFAULT_SITE_DATA;
  });

  // Save to localStorage automatically on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
    } catch (e) {
      console.error('Failed to persist CMS data to localStorage', e);
    }
  }, [siteData]);

  // Synchronize siteData changes across browser tabs and components in real time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSiteData(prev => deepMerge(prev, parsed));
        } catch (err) {
          console.error('Error syncing storage across tabs', err);
        }
      }
    };
    const handleCustomSync = (e) => {
      if (e.detail) {
        setSiteData(prev => deepMerge(prev, e.detail));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('gspeed-site-data-updated', handleCustomSync);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gspeed-site-data-updated', handleCustomSync);
    };
  }, []);

  // Generic Update Handlers
  const updateTicker = (badgeOrObj, text, linkTarget, linkText, linkVisible) => {
    if (typeof badgeOrObj === 'object' && badgeOrObj !== null) {
      setSiteData(prev => ({
        ...prev,
        tickerBadge: badgeOrObj.badge !== undefined ? badgeOrObj.badge : prev.tickerBadge,
        tickerText: badgeOrObj.text !== undefined ? badgeOrObj.text : prev.tickerText,
        tickerLinkText: badgeOrObj.linkText !== undefined ? badgeOrObj.linkText : prev.tickerLinkText,
        tickerLinkTarget: badgeOrObj.linkTarget !== undefined ? badgeOrObj.linkTarget : (badgeOrObj.linkTab || prev.tickerLinkTarget || prev.tickerLinkTab),
        tickerLinkTab: badgeOrObj.linkTarget || badgeOrObj.linkTab || prev.tickerLinkTab,
        tickerLinkVisible: badgeOrObj.linkVisible !== undefined ? badgeOrObj.linkVisible : prev.tickerLinkVisible
      }));
    } else {
      setSiteData(prev => ({
        ...prev,
        tickerBadge: badgeOrObj,
        tickerText: text !== undefined ? text : prev.tickerText,
        tickerLinkTab: linkTarget !== undefined ? linkTarget : prev.tickerLinkTab,
        tickerLinkTarget: linkTarget !== undefined ? linkTarget : (prev.tickerLinkTarget || prev.tickerLinkTab),
        tickerLinkText: linkText !== undefined ? linkText : (prev.tickerLinkText || 'เปิดระบบ 3D'),
        tickerLinkVisible: linkVisible !== undefined ? linkVisible : (prev.tickerLinkVisible !== false)
      }));
    }
  };

  const updateHeaderCta = (ctaUpdates) => {
    setSiteData(prev => ({
      ...prev,
      headerCta: { ...(prev.headerCta || { text: 'คำนวณราคาเปิดร้าน', target: 'franchise', visible: true }), ...ctaUpdates }
    }));
  };

  const updateHero = (heroUpdates) => {
    setSiteData(prev => {
      const merged = { ...prev.hero, ...heroUpdates };
      if (heroUpdates.backgroundImage !== undefined) {
        merged.bgOverlayImage = heroUpdates.backgroundImage;
      } else if (heroUpdates.bgOverlayImage !== undefined) {
        merged.backgroundImage = heroUpdates.bgOverlayImage;
      }
      return {
        ...prev,
        hero: merged
      };
    });
  };

  const updateFooter = (footerUpdates) => {
    setSiteData(prev => ({
      ...prev,
      footer: { ...prev.footer, ...footerUpdates }
    }));
  };

  const updateNavLinks = (newLinks) => {
    setSiteData(prev => ({ ...prev, navLinks: newLinks }));
  };

  const addNavLink = (item) => {
    setSiteData(prev => ({
      ...prev,
      navLinks: [
        ...(prev.navLinks || []),
        {
          id: item?.id || `nav-${Date.now()}`,
          label: item?.label || 'เมนูใหม่',
          target: item?.target || 'arena',
          visible: item?.visible !== undefined ? item.visible : true,
          highlight: !!item?.highlight,
          highlightTag: item?.highlightTag || ''
        }
      ]
    }));
  };

  const deleteNavLink = (id) => {
    setSiteData(prev => ({
      ...prev,
      navLinks: (prev.navLinks || []).filter(l => l.id !== id)
    }));
  };

  const saveSiteData = (manualData) => {
    const dataToSave = manualData || siteData;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      window.dispatchEvent(new CustomEvent('gspeed-site-data-updated', { detail: dataToSave }));
      return { success: true, timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) };
    } catch (e) {
      console.error('Failed to save data', e);
      return { success: false, error: e.message };
    }
  };

  // Catalog Handlers (Furniture, Desks, Chairs, Counters)
  const updateCatalogItem = (updatedItem) => {
    setSiteData(prev => ({
      ...prev,
      catalogItems: prev.catalogItems.map(item => 
        item.type === updatedItem.type ? { ...item, ...updatedItem } : item
      )
    }));
  };

  const addCatalogItem = (newItem) => {
    setSiteData(prev => ({
      ...prev,
      catalogItems: [...prev.catalogItems, newItem]
    }));
  };

  const deleteCatalogItem = (type) => {
    setSiteData(prev => ({
      ...prev,
      catalogItems: prev.catalogItems.filter(item => item.type !== type)
    }));
  };

  // RAG Knowledge Handlers
  const addRAGItem = (newItem) => {
    setSiteData(prev => ({
      ...prev,
      ragKnowledge: [...prev.ragKnowledge, { ...newItem, id: `rag-${Date.now()}` }]
    }));
  };

  const updateRAGItem = (id, updatedFields) => {
    setSiteData(prev => ({
      ...prev,
      ragKnowledge: prev.ragKnowledge.map(item => 
        item.id === id ? { ...item, ...updatedFields } : item
      )
    }));
  };

  const deleteRAGItem = (id) => {
    setSiteData(prev => ({
      ...prev,
      ragKnowledge: prev.ragKnowledge.filter(item => item.id !== id)
    }));
  };

  // Activity & Article Management Handlers (WordPress-like Custom URL slugs & rich content)
  const addActivityItem = (newItem) => {
    const slug = newItem.slug || (newItem.title || 'event').toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)/g, '') || `event-${Date.now()}`;
    const id = newItem.id || `gal-${Date.now()}`;
    setSiteData(prev => ({
      ...prev,
      gallery: [{ ...newItem, id, slug }, ...(prev.gallery || [])]
    }));
  };

  const updateActivityItem = (id, updatedFields) => {
    setSiteData(prev => ({
      ...prev,
      gallery: (prev.gallery || []).map(item => 
        item.id === id ? { ...item, ...updatedFields } : item
      )
    }));
  };

  const deleteActivityItem = (id) => {
    setSiteData(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter(item => item.id !== id)
    }));
  };

  // OpenRouter & Webhook Handlers
  const updateOpenRouterSettings = (settings) => {
    setSiteData(prev => ({
      ...prev,
      openRouterSettings: { ...prev.openRouterSettings, ...settings }
    }));
  };

  const updateWebhooks = (webhooks) => {
    setSiteData(prev => ({
      ...prev,
      webhooks: { ...prev.webhooks, ...webhooks }
    }));
  };

  // AI Guardrails & Pending Questions Handlers
  const updateAIGuardrails = (guardrailUpdates) => {
    setSiteData(prev => ({
      ...prev,
      aiGuardrails: { ...prev.aiGuardrails, ...guardrailUpdates }
    }));
  };

  const addPendingQuestion = (query) => {
    if (!query) return;
    setSiteData(prev => {
      const existing = prev.aiGuardrails?.pendingQuestions || [];
      // avoid duplicates
      if (existing.some(q => q.query.toLowerCase() === query.toLowerCase())) return prev;
      const now = new Date();
      const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const newEntry = {
        id: `pq-${Date.now()}`,
        query,
        timestamp: timeStr,
        status: 'pending'
      };
      return {
        ...prev,
        aiGuardrails: {
          ...prev.aiGuardrails,
          pendingQuestions: [newEntry, ...existing]
        }
      };
    });
  };

  const deletePendingQuestion = (id) => {
    setSiteData(prev => ({
      ...prev,
      aiGuardrails: {
        ...prev.aiGuardrails,
        pendingQuestions: (prev.aiGuardrails?.pendingQuestions || []).filter(q => q.id !== id)
      }
    }));
  };

  // Reset to Factory Default
  const resetToDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    setSiteData(DEFAULT_SITE_DATA);
  };

  // Security & ERP Handlers
  const updateSecurityConfig = (updates) => {
    setSiteData(prev => ({
      ...prev,
      securityConfig: { ...prev.securityConfig, ...updates }
    }));
  };

  const updateERPData = (updates) => {
    setSiteData(prev => ({
      ...prev,
      erpData: { ...prev.erpData, ...updates }
    }));
  };

  const updateERPConfig = (updates) => {
    setSiteData(prev => ({
      ...prev,
      erpConfig: { ...prev.erpConfig, ...updates }
    }));
  };

  // Theme & Global SEO Handlers
  const updateTheme = (themeUpdates) => {
    setSiteData(prev => ({
      ...prev,
      theme: { ...prev.theme, ...themeUpdates }
    }));
  };

  const updateGlobalSEO = (seoUpdates) => {
    setSiteData(prev => ({
      ...prev,
      globalSEO: { ...prev.globalSEO, ...seoUpdates }
    }));
  };

  // Dynamic Section Config Handlers (Hero, Feature Banners, Tournaments, Zones, News, Franchise Banner)
  const updateSectionConfig = (sectionKey, updates) => {
    setSiteData(prev => ({
      ...prev,
      [sectionKey]: { ...(prev[sectionKey] || {}), ...updates }
    }));
  };

  // Tournament CRUD Handlers
  const addTournament = (newItem) => {
    const id = newItem.id || `tour-${Date.now()}`;
    setSiteData(prev => ({
      ...prev,
      tournaments: [...(prev.tournaments || []), { ...newItem, id }]
    }));
  };

  const updateTournament = (id, updates) => {
    setSiteData(prev => ({
      ...prev,
      tournaments: (prev.tournaments || []).map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTournament = (id) => {
    setSiteData(prev => ({
      ...prev,
      tournaments: (prev.tournaments || []).filter(t => t.id !== id)
    }));
  };

  // News & Articles CRUD Handlers
  const addNewsItem = (newItem) => {
    const slug = newItem.slug || (newItem.title || 'news').toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)/g, '') || `news-${Date.now()}`;
    const id = newItem.id || `news-${Date.now()}`;
    setSiteData(prev => ({
      ...prev,
      news: [{ ...newItem, id, slug }, ...(prev.news || [])]
    }));
  };

  const updateNewsItem = (id, updates) => {
    setSiteData(prev => ({
      ...prev,
      news: (prev.news || []).map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const deleteNewsItem = (id) => {
    setSiteData(prev => ({
      ...prev,
      news: (prev.news || []).filter(item => item.id !== id)
    }));
  };

  // Venue Zones Handler
  const updateVenueZone = (id, updates) => {
    setSiteData(prev => ({
      ...prev,
      venueZones: (prev.venueZones || []).map(z => z.id === id ? { ...z, ...updates } : z)
    }));
  };

  // n8n Workflows Handlers
  const updateN8NWorkflow = (id, updates) => {
    setSiteData(prev => ({
      ...prev,
      n8nWorkflows: (prev.n8nWorkflows || []).map(wf => wf.id === id ? { ...wf, ...updates } : wf)
    }));
  };

  // OpenWebUI Handlers
  const updateOpenWebUIConfig = (updates) => {
    setSiteData(prev => ({
      ...prev,
      openWebUIConfig: { ...prev.openWebUIConfig, ...updates }
    }));
  };

  // Omnichannel Hub Handlers
  const updateOmnichannelConfig = (updates) => {
    setSiteData(prev => ({
      ...prev,
      omnichannelConfig: { ...prev.omnichannelConfig, ...updates }
    }));
  };

  // Media Library Handlers (For Reusable Assets & SEO Alt Tags)
  const addMediaItem = (item) => {
    if (!item?.url) return null;
    const newItem = {
      id: item.id || `med-${Date.now()}`,
      name: item.name || 'ภาพที่อัปโหลด',
      url: item.url,
      alt: item.alt || item.name || 'G-Speed Esport Arena',
      category: item.category || 'uploads',
      dimensions: item.dimensions || 'WebP / Original',
      isUploaded: true
    };
    setSiteData(prev => {
      const existing = prev.mediaLibrary || INITIAL_MEDIA_LIBRARY;
      if (existing.some(m => m.url === newItem.url)) {
        return {
          ...prev,
          mediaLibrary: existing.map(m => m.url === newItem.url ? { ...m, ...newItem } : m)
        };
      }
      return {
        ...prev,
        mediaLibrary: [newItem, ...existing]
      };
    });
    return newItem;
  };

  const deleteMediaItem = (idOrUrl) => {
    setSiteData(prev => ({
      ...prev,
      mediaLibrary: (prev.mediaLibrary || INITIAL_MEDIA_LIBRARY).filter(m => m.id !== idOrUrl && m.url !== idOrUrl)
    }));
  };

  // Omnichannel Leads Pipeline Handlers
  const addLead = (lead) => {
    const now = new Date();
    const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLead = {
      id: lead.id || `lead-${Date.now()}`,
      createdAt: timeStr,
      updatedAt: timeStr,
      stage: 'new',
      ...lead
    };
    setSiteData(prev => ({
      ...prev,
      leads: [newLead, ...(prev.leads || INITIAL_LEADS)]
    }));
    return newLead;
  };

  const updateLead = (id, updates) => {
    const now = new Date();
    const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setSiteData(prev => ({
      ...prev,
      leads: (prev.leads || INITIAL_LEADS).map(item => 
        item.id === id 
          ? { 
              ...item, 
              ...updates, 
              updatedAt: timeStr 
            } 
          : item
      )
    }));
  };

  const deleteLead = (id) => {
    setSiteData(prev => ({
      ...prev,
      leads: (prev.leads || INITIAL_LEADS).filter(item => item.id !== id)
    }));
  };

  const moveLeadStage = (id, newStage) => {
    updateLead(id, { stage: newStage });
  };

  // Daily Cashflow & Petty Cash Handlers
  const addExpense = (expense) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const newExpense = {
      id: expense.id || `exp-${Date.now()}`,
      time: timeStr,
      date: dateStr,
      ...expense
    };
    setSiteData(prev => ({
      ...prev,
      pettyCashExpenses: [newExpense, ...(prev.pettyCashExpenses || INITIAL_PETTY_CASH)]
    }));
    return newExpense;
  };

  const deleteExpense = (id) => {
    setSiteData(prev => ({
      ...prev,
      pettyCashExpenses: (prev.pettyCashExpenses || INITIAL_PETTY_CASH).filter(item => item.id !== id)
    }));
  };

  // Omnichannel Chat Handlers
  const assignAgentToChat = (chatId, agentName = 'แอดมิน กอล์ฟ (ฝ่ายบริการลูกค้า)') => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setSiteData(prev => ({
      ...prev,
      omnichannelChats: (prev.omnichannelChats || INITIAL_OMNICHANNEL_CHATS).map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            status: 'assigned',
            assignedAgent: agentName,
            aiMutedUntil: Date.now() + 3600000, // Mute 60 minutes
            messages: [
              ...chat.messages,
              {
                id: `sys-${Date.now()}`,
                sender: 'system',
                text: `👤 ${agentName} รับเคสดูแลต่อแล้ว (AI ถูกระงับชั่วคราว 60 นาที)`,
                time: timeStr
              }
            ]
          };
        }
        return chat;
      })
    }));
  };

  const toggleAIMute = (chatId, shouldMute) => {
    setSiteData(prev => ({
      ...prev,
      omnichannelChats: (prev.omnichannelChats || INITIAL_OMNICHANNEL_CHATS).map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            status: shouldMute ? 'assigned' : 'bot',
            aiMutedUntil: shouldMute ? (Date.now() + 3600000) : null
          };
        }
        return chat;
      })
    }));
  };

  const sendChatMessage = (chatId, text, senderType = 'agent', senderName = 'แอดมิน กอล์ฟ') => {
    if (!text?.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setSiteData(prev => ({
      ...prev,
      omnichannelChats: (prev.omnichannelChats || INITIAL_OMNICHANNEL_CHATS).map(chat => {
        if (chat.id === chatId) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            sender: senderType,
            agentName: senderType === 'agent' ? senderName : undefined,
            text: text.trim(),
            time: timeStr
          };
          return {
            ...chat,
            lastMessage: text.trim(),
            timestamp: `${timeStr} น.`,
            messages: [...chat.messages, newMsg]
          };
        }
        return chat;
      })
    }));
  };

  // Hardware Asset & RMA Handlers
  const updateStationStatus = (stationId, newStatus) => {
    setSiteData(prev => ({
      ...prev,
      hardwareStations: (prev.hardwareStations || INITIAL_HARDWARE_STATIONS).map(st => 
        st.id === stationId ? { ...st, status: newStatus } : st
      )
    }));
  };

  const addRMAClaim = (claim) => {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const newClaim = {
      id: claim.id || `rma-${Date.now()}`,
      sentDate: dateStr,
      status: 'sent',
      statusName: 'ส่งศูนย์บริการแล้ว รอการตรวจสอบ',
      ...claim
    };
    setSiteData(prev => ({
      ...prev,
      rmaClaims: [newClaim, ...(prev.rmaClaims || INITIAL_RMA_CLAIMS)]
    }));
    return newClaim;
  };

  const updateRMAClaim = (id, updates) => {
    setSiteData(prev => ({
      ...prev,
      rmaClaims: (prev.rmaClaims || INITIAL_RMA_CLAIMS).map(claim => 
        claim.id === id ? { ...claim, ...updates } : claim
      )
    }));
  };

  const value = {
    siteData,
    setSiteData,
    updateTicker,
    updateHero,
    updateFooter,
    updateNavLinks,
    updateCatalogItem,
    addCatalogItem,
    deleteCatalogItem,
    addRAGItem,
    updateRAGItem,
    deleteRAGItem,
    addActivityItem,
    updateActivityItem,
    deleteActivityItem,
    updateNewsItem,
    addNewsItem,
    deleteNewsItem,
    updateTournament,
    addTournament,
    deleteTournament,
    updateVenueZone,
    updateTheme,
    updateGlobalSEO,
    updateSectionConfig,
    updateN8NWorkflow,
    updateOpenWebUIConfig,
    updateOmnichannelConfig,
    updateERPConfig,
    updateOpenRouterSettings,
    updateAIGuardrails,
    addPendingQuestion,
    deletePendingQuestion,
    updateSecurityConfig,
    updateERPData,
    updateWebhooks,
    updateHeaderCta,
    addNavLink,
    deleteNavLink,
    addMediaItem,
    deleteMediaItem,
    addLead,
    updateLead,
    deleteLead,
    moveLeadStage,
    addExpense,
    deleteExpense,
    assignAgentToChat,
    toggleAIMute,
    sendChatMessage,
    updateStationStatus,
    addRMAClaim,
    updateRMAClaim,
    saveSiteData,
    resetToDefaults
  };

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
}
