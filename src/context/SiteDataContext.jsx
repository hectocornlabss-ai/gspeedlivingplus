import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  CATALOG_ITEMS as INITIAL_CATALOG, 
  HARDWARE_TIERS as INITIAL_TIERS,
  FIXED_INFRASTRUCTURE as INITIAL_FIXED_INFRASTRUCTURE,
  TOURNAMENTS as INITIAL_TOURNAMENTS,
  GALLERY_ACTIVITIES as INITIAL_GALLERY,
  GAME_NEWS as INITIAL_NEWS,
  FOUNDER_INFO as INITIAL_FOUNDER,
  VENUE_ZONES as INITIAL_ZONES,
  EVENT_CATEGORIES as INITIAL_CATEGORIES,
  DEFAULT_ARTICLE_TAGS as INITIAL_TAGS,
  ARENA_SEATING_ZONES,
  INTERIOR_THEMES as INITIAL_INTERIOR_THEMES,
  DEFAULT_ORGANIZER_GAMES
} from '../data/mockData';
import { EQUIPMENT_PRODUCTS } from '../data/equipmentProducts';

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
    tags: ['เวลาเปิด', '24ชั่วโมง', 'เปิดกี่โมง', 'ที่อยู่', 'อยู่ที่ไหน', 'พิกัด', 'แผนที่', 'เบอร์โทร', 'ลาดพร้าว 112', 'รามคำแหง 53', 'วังทองหลาง'],
    content: 'G-Speed Esport Arena เปิดให้บริการตลอด 24 ชั่วโมง ทุกวัน ตลอดทั้งปี ไม่มีวันหยุด (24/7) ที่ตั้ง: 79 ซอย รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310 (เข้าออกได้ทั้งทางซอยลาดพร้าว 112 และซอยรามคำแหง 53 พิกัด 13.766999, 100.618755) แผนที่ Google Maps: https://maps.app.goo.gl/ak23az5WtsvXGWUR8 โทรศัพท์: 063-793-7704 อีเมล: gspeedlivingplus35@gmail.com มีที่จอดรถสะดวกสบายทั้งรถยนต์และมอเตอร์ไซค์ แอร์เย็นฉ่ำ 24 ชม. พร้อมระบบกรองอากาศ PM2.5 และระบบเน็ตเวิร์กความเร็วสูง 10Gbps Dual Fiber'
  },
  {
    id: 'rag-services-overview',
    category: 'services',
    title: 'บริการหลักของศูนย์ G-Speed Esport Arena',
    tags: ['บริการ', 'บริการของเรา', 'มีอะไรบ้าง', 'ร้านเกม', 'เช่าจัดแข่ง', 'ติดตั้งระบบ', 'บริการร้าน'],
    content: 'บริการหลักของ G-Speed Esport Arena ได้แก่: 1. ร้านเกมคอมพิวเตอร์สเปกแข่งขันอีสปอร์ต 24 ชม. (RTX 40 Series, จอ 360Hz/240Hz, โซนทั่วไปและ VIP) 2. เปิดให้เช่าร้านจัดแข่งอีสปอร์ต (เวที 5v5 Stage, จอ LED Wall ขนาดยักษ์, ระบบ Live Streaming, โต๊ะพากย์) 3. รับติดตั้งและวางระบบร้านเกมครบวงจร (Diskless Server, เน็ต 10Gbps Multi-WAN, ระบบ POS บัญชีคลาวด์ และออกแบบผังร้าน 2D/3D) ที่ตั้ง: 79 ซอย รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กทม. 10310 แผนที่: https://maps.app.goo.gl/ak23az5WtsvXGWUR8 โทร 063-793-7704'
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

// Initial Navigation Links: 1.หน้าแรก 2.ทัวร์นาเมนต์ 3.ภาพกิจกรรม 4.เกี่ยวกับเรา 5.ติดต่อเรา
export const INITIAL_NAV_LINKS = [
  { id: 'nav-arena', label: 'หน้าแรก', target: 'arena', visible: true },
  { id: 'nav-tournaments', label: 'ทัวร์นาเมนต์', target: 'tournaments', visible: true },
  { id: 'nav-activities', label: 'ภาพกิจกรรม', target: 'activities', visible: true },
  { id: 'nav-company', label: 'เกี่ยวกับเรา', target: 'company', visible: true },
  { id: 'nav-contact', label: 'ติดต่อเรา', target: 'contact', visible: true }
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

// Initial Arena Seat Bookings
export const INITIAL_ARENA_BOOKINGS = [
  {
    id: 'BKG-2026-0918-01',
    bookingCode: 'GLP-SEAT-8941',
    customerName: 'คุณอาร์ม (Arm Gamer)',
    phone: '081-234-5678',
    email: 'arm.gamer@gmail.com',
    discord: 'arm#1337',
    memberId: 'GLP-VIP-042',
    zoneId: 'vip',
    zoneName: 'VIP & Streamer Pods',
    seatNumbers: ['V01'],
    date: '2026-09-18',
    timeSlot: '14:00 - 18:00 น.',
    durationHours: 4,
    hardwareTier: 'RTX 4080 SUPER + 360Hz BenQ',
    foodPackage: 'Energy Boost Combo (Red Bull + ข้าวไข่ข้นแฮม)',
    foodPackagePrice: 89,
    baseRatePerHour: 50,
    seatTotal: 200,
    totalPrice: 289,
    status: 'Checked-In',
    createdAt: '2026-09-18T11:30:00.000Z',
    notes: 'ขอกล้อง 4K สำหรับสตรีมแข่ง Valorant'
  },
  {
    id: 'BKG-2026-0918-02',
    bookingCode: 'GLP-SEAT-8942',
    customerName: 'คุณกิตติศักดิ์ (Talon Fan)',
    phone: '089-776-5544',
    email: 'kittisak.t@gmail.com',
    discord: 'kitti#9900',
    memberId: '',
    zoneId: 'stage',
    zoneName: '5v5 Tournament Stage Pro Booths',
    seatNumbers: ['S03', 'S04'],
    date: '2026-09-18',
    timeSlot: '18:00 - 22:00 น.',
    durationHours: 4,
    hardwareTier: 'RTX 4080 SUPER + 360Hz BenQ (Stage Booth)',
    foodPackage: 'Gamer Feast Combo (ชานมพ่นไฟ + กะเพราหมูกรอบ)',
    foodPackagePrice: 149,
    baseRatePerHour: 50,
    seatTotal: 400,
    totalPrice: 549,
    status: 'Confirmed',
    createdAt: '2026-09-18T12:15:00.000Z',
    notes: 'ซ้อมคู่ Duo ก่อนเริ่มแมตช์ทัวร์นาเมนต์'
  },
  {
    id: 'BKG-2026-0918-03',
    bookingCode: 'GLP-SEAT-8943',
    customerName: 'คุณภานุวัฒน์',
    phone: '086-332-1199',
    email: 'panuwat@outlook.co.th',
    discord: '',
    memberId: 'GLP-MEM-109',
    zoneId: 'standard',
    zoneName: 'Esports Battleground Zone',
    seatNumbers: ['B07', 'B08', 'B09', 'B10', 'B11'],
    date: '2026-09-18',
    timeSlot: '23:00 - 08:00 น. (Night Owl เหมาค่ำ)',
    durationHours: 9,
    hardwareTier: 'RTX 4070 SUPER + 240Hz Fast-IPS',
    foodPackage: 'None',
    foodPackagePrice: 0,
    baseRatePerHour: 16.6,
    seatTotal: 750,
    totalPrice: 750,
    status: 'Confirmed',
    createdAt: '2026-09-18T13:40:00.000Z',
    notes: 'ทีม 5 คน ซ้อมข้ามคืน'
  }
];

// Initial Site Data Key
const STORAGE_KEY = 'gspeed_site_cms_data_v2';

// Initial SEO Tools & Marketing Tracking Configuration
export const INITIAL_SEO_MARKETING_CONFIG = {
  // 1. Search Engine Verification
  googleSiteVerification: 'google-site-verification=AbCdEfGhIjKlMnOpQrStUvWxYz',
  bingSiteVerification: 'msvalidate.01=1234567890ABCDEF1234567890ABCDEF',
  
  // 2. Tag Management & Web Analytics
  googleTagManagerId: 'GTM-GLPESPORT',
  gtmEnabled: true,
  googleAnalyticsId: 'G-GSPEED2026',
  gaEnabled: false,
  
  // 3. Social Advertising Pixels & Conversion Tracking
  facebookPixelId: '109283746592817',
  fbPixelEnabled: true,
  tiktokPixelId: '',
  tiktokPixelEnabled: false,
  lineTagId: '',
  lineTagEnabled: false,
  
  // 4. AI SEO & Intelligent Search Overviews (GEO & llms.txt)
  aiSeoEnabled: true,
  allowAiCrawlers: {
    gptBot: true,
    claudeBot: true,
    googleExtended: true,
    perplexityBot: true,
    applebot: true
  },
  aiKnowledgeSummary: `GLP : G Speed Living Plus เป็นศูนย์กีฬาอีสปอร์ตระดับ World Class และคอมมูนิตี้ครบวงจร 24 ชั่วโมง ตั้งอยู่ ณ ซอยรามคำแหง 53 กรุงเทพมหานคร\n\nจุดเด่นและสิ่งอำนวยความสะดวก:\n- เครื่องคอมพิวเตอร์สเปกทัวร์นาเมนต์ Intel Core i9 + NVIDIA GeForce RTX 40/50 Series\n- จอ BenQ ZOWIE Fast-IPS 360Hz และ 280Hz คุณภาพสูงสำหรับนักกีฬาโปรลีก\n- เวทีแข่งขัน 5v5 Soundproof Glass Arena พร้อมระบบโปรดักชันถ่ายทอดสด 4K\n- อินเทอร์เน็ต Dedicated Multi-WAN 10Gbps แบนด์วิดท์เสถียร Ping ต่ำกว่า 3ms\n- บริการให้คำปรึกษาและวางระบบแฟรนไชส์ร้านเกม 3D แบบครบวงจร คืนทุนไวใน 12-18 เดือน\n\nติดต่อสอบถาม:\n- สายด่วน: 063-793-7704\n- LINE Official: @gspeed\n- ที่อยู่: 23/1 ซอยรามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพฯ 10310`,
  
  // 5. Custom Scripts Injection
  customHeadScripts: `<!-- GLP Custom Schema.org Structured Data -->\n<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "SportsActivityLocation",\n  "name": "GLP : G Speed Living Plus",\n  "url": "https://gspeedesport.com",\n  "telephone": "+66637937704",\n  "priceRange": "$$",\n  "openingHours": "Mo-Su 00:00-24:00"\n}\n</script>`,
  customBodyScripts: '',
  customScriptsEnabled: true
};

// Initial Admin Staff Accounts with Role-Based Access Control (RBAC)
export const INITIAL_ADMIN_STAFF_LIST = [
  {
    id: 'staff-master',
    name: 'ผู้ดูแลระบบสูงสุด (Master Owner)',
    username: 'admin',
    password: 'Weerayutth0@',
    pin: '998877',
    roleTitle: 'Super Administrator',
    isMaster: true,
    status: 'active',
    avatarColor: '#2563eb',
    permissions: ['*'],
    lastActive: '26/09/2026 21:50',
    createdAt: '01/01/2026'
  },
  {
    id: 'staff-tourney',
    name: 'กิตติศักดิ์ (Head of Esports)',
    username: 'tournament_admin',
    password: 'tourney2026',
    pin: '112233',
    roleTitle: 'ผู้จัดการงานแข่ง & สายการแข่งขัน',
    isMaster: false,
    status: 'active',
    avatarColor: '#dc2626',
    permissions: ['tourney-apps', 'arena-bookings', 'articles'],
    lastActive: '26/09/2026 19:30',
    createdAt: '15/02/2026'
  },
  {
    id: 'staff-sales',
    name: 'ชลธิชา (Franchise Sales Manager)',
    username: 'sales_admin',
    password: 'sales2026',
    pin: '445566',
    roleTitle: 'ผู้ดูแลยอดขาย & แฟรนไชส์ Leads',
    isMaster: false,
    status: 'active',
    avatarColor: '#059669',
    permissions: ['erp-analytics', 'omnichannel-leads', 'arena-bookings'],
    lastActive: '26/09/2026 20:15',
    createdAt: '10/03/2026'
  },
  {
    id: 'staff-hardware',
    name: 'วิศรุต (Lead Hardware Specialist)',
    username: 'hardware_admin',
    password: 'hardware2026',
    pin: '778899',
    roleTitle: 'ช่างเทคนิค & จัดการสเปกคอม 3D',
    isMaster: false,
    status: 'active',
    avatarColor: '#7c3aed',
    permissions: ['catalog', 'hardware-pricing'],
    lastActive: '25/09/2026 18:00',
    createdAt: '20/04/2026'
  },
  {
    id: 'staff-marketing',
    name: 'ธนาภา (Digital Marketing & SEO)',
    username: 'marketing_admin',
    password: 'market2026',
    pin: '334455',
    roleTitle: 'การตลาด, SEO & คอนเทนต์',
    isMaster: false,
    status: 'active',
    avatarColor: '#ea580c',
    permissions: ['seo-tools', 'articles', 'sections', 'menu-footer'],
    lastActive: '26/09/2026 16:40',
    createdAt: '01/05/2026'
  }
];

// Initial Top Announcement Ticker Settings and Items
export const INITIAL_TICKER_SETTINGS = {
  enabled: true,
  speed: 28, // seconds for full marquee loop (lower = faster)
  pauseOnHover: true,
  showLeadBadge: true,
  leadBadgeText: 'GLP LIVE',
  leadBadgeTextColor: '#ffffff',
  leadBadgeBgColor: 'rgba(0, 0, 0, 0.45)',
  leadBadgeDotColor: '#10b981',
  leadBadgeIconColor: '#fbbf24',
  bgColor: '#1e3a8a',
  textColor: '#ffffff',
  badgeBgColor: '#ffffff',
  badgeTextColor: '#1d4ed8'
};

export const INITIAL_TICKER_ITEMS = [
  {
    id: 'tick-1',
    badge: 'ประกาศสำคัญ',
    text: 'เปิดรับสมัคร GLP VALORANT CHAMPIONSHIP 2026 ชิง 100,000 บาท | ระบบจำลองผังร้าน 3D Interior Planner พร้อมใช้งานแล้ว',
    linkTarget: '/tournaments',
    linkText: 'ดูตารางแข่ง',
    active: true,
    priority: 1
  },
  {
    id: 'tick-2',
    badge: 'ทัวร์นาเมนต์',
    text: 'ICAFE ATTACK LAN TOURNAMENT 2026 ระเบิดความมันส์ เสาร์-อาทิตย์นี้ ณ GLP Main Stage ลุ้นรับแรร์ไอเทมและเงินรางวัลสด',
    linkTarget: '/activities/icafe-attack-lan-tournament',
    linkText: 'รายละเอียดงานแข่ง',
    active: true,
    priority: 2
  },
  {
    id: 'tick-3',
    badge: 'ฟีเจอร์ใหม่ 3D',
    text: 'ระบบ 3D Interior Planner ใหม่! ออกแบบผังร้านเกม คำนวณขนาดโต๊ะเก้าอี้และงบลงทุนแฟรนไชส์ได้เรียลไทม์ 24 ชม.',
    linkTarget: '/franchise',
    linkText: 'เปิดระบบจัดผัง 3D',
    active: true,
    priority: 3
  },
  {
    id: 'tick-4',
    badge: 'จัดแข่ง Esport',
    text: 'เปิดรับจองพื้นที่ Main Stage 5v5 Soundproof Glass Arena พร้อมทีมงานสตรีมมิ่ง 4K และระบบ Tournament Manager',
    linkTarget: '#activities',
    linkText: 'ติดต่อจองเวที',
    active: true,
    priority: 4
  }
];

export const INITIAL_CONTACT_PAGE = {
  heroBadge: 'CONTACT & STORE LOCATION • 24/7 OPEN',
  heroTitle: 'ติดต่อเรา & แผนที่ร้าน GLP',
  heroDesc: 'ศูนย์กีฬาอีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากล GLP : G Speed Living Plus พร้อมต้อนรับนักกีฬาอีสปอร์ต เกมเมอร์ และผู้สนใจร่วมลงทุนแฟรนไชส์ตลอด 24 ชั่วโมง',
  storeName: 'GLP : G Speed Living Plus',
  storeAddress: '79 ซอย รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310 (เข้าออกได้ทั้งทางซอยลาดพร้าว 112 และซอยรามคำแหง 53)',
  storePhone: '063-793-7704',
  storeEmail: 'gspeedlivingplus35@gmail.com',
  lineId: '@gspeedarena',
  locationHint: '(ทำเลศักยภาพ เชื่อมต่อระหว่าง ซอยลาดพร้าว 112 และ ซอยรามคำแหง 53 พิกัด 13.766999, 100.618755 มีที่จอดรถสะดวกสบาย)',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=13.766999,100.618755&t=&z=17&ie=UTF8&iwloc=&output=embed',
  googleMapsDirectUrl: 'https://maps.app.goo.gl/ak23az5WtsvXGWUR8',
  socialLinks: {
    facebook: 'https://www.facebook.com/GLP.Gspeedlivingplus',
    tiktok: 'https://www.tiktok.com/@gspeedlivingplus',
    instagram: 'https://www.instagram.com/gspeedlivingplus',
    discord: 'https://discord.gg/gspeed',
    youtube: 'https://youtube.com/@gspeedarena',
    steam: 'https://steamcommunity.com/groups/gspeed'
  },
  transportation: [
    {
      id: 'trans-1',
      type: 'train',
      title: 'รถไฟฟ้า MRT',
      desc: 'สายสีเหลือง: ลงสถานีลาดพร้าว 83 หรือ สถานีลาดพร้าว 101 จากนั้นต่อวินมอเตอร์ไซค์เข้าซอยลาดพร้าว 112 (ประมาณ 5 นาทีถึงหน้าร้าน)',
      tag: 'แนะนำสำหรับผู้ใช้รถไฟฟ้า',
      theme: 'yellow',
      visible: true
    },
    {
      id: 'trans-2',
      type: 'car',
      title: 'รถยนต์ส่วนบุคคล',
      desc: 'เข้าได้จาก ถ.ลาดพร้าว (ซอย 112) หรือจาก ถ.รามคำแหง (ซอย 53) มีลานจอดรถยนต์กว้างขวาง ปลอดภัย พร้อมกล้อง CCTV ตลอด 24 ชม.',
      tag: 'มีที่จอดรถรองรับ',
      theme: 'blue',
      visible: true
    },
    {
      id: 'trans-3',
      type: 'bus',
      title: 'รถโดยสารประจำทาง',
      desc: 'ฝั่งลาดพร้าว: สาย 8, 27, 44, 73, 96, 137, 145, 502, 514 | ฝั่งรามคำแหง: สาย 60, 71, 92, 93, 113, 168, 501',
      tag: 'เดินทางประหยัด',
      theme: 'purple',
      visible: true
    }
  ],
  perks: [
    { id: 'perk-1', text: 'เปิดบริการ 24 ชั่วโมง 365 วัน ไม่มีวันหยุด', visible: true },
    { id: 'perk-2', text: 'เวทีแข่งขัน 5v5 Stage และจอ LED Wall ระดับสากล', visible: true },
    { id: 'perk-3', text: 'ระบบ Diskless Server & เน็ตเวิร์ก 10Gbps แข่งขันระดับโปร', visible: true },
    { id: 'perk-4', text: 'ระบบความปลอดภัย CCTV 24 ชม. ปลอดบุหรี่ 100%', visible: true }
  ]
};

export const DEFAULT_SITE_DATA = {
  equipmentProducts: EQUIPMENT_PRODUCTS,
  seoMarketingConfig: INITIAL_SEO_MARKETING_CONFIG,
  adminStaffList: INITIAL_ADMIN_STAFF_LIST,
  arenaSeatingZones: ARENA_SEATING_ZONES,
  arenaBookings: INITIAL_ARENA_BOOKINGS,
  tickerSettings: INITIAL_TICKER_SETTINGS,
  tickerItems: INITIAL_TICKER_ITEMS,
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
  tickerLinkVisible: false,
  headerCta: {
    text: 'สนใจเปิดร้าน',
    target: 'franchise',
    visible: true
  },
  navLinks: INITIAL_NAV_LINKS,
  hero: {
    badge: 'THE NEXT-GEN ESPORT & FRANCHISE HUB',
    title: 'ศูนย์รวมอีสปอร์ตครบวงจร & พื้นที่ประลองเกมมาตรฐานสากล',
    subtitle: 'สัมผัสประสบการณ์เกมมิ่งระดับเวิลด์คลาสด้วยเครื่องสเปกไฮเอนด์ RTX 40 Series จอ 360Hz และเวทีแข่งขันมาตรฐาน Pro Circuit พร้อมระบบคำนวณและจำลองผังร้านแฟรนไชส์อัจฉริยะ',
    primaryCta: 'ดูภาพกิจกรรม',
    primaryCtaLink: '#activities',
    secondaryCta: 'ร้านค้า',
    btn1Text: 'สนใจจัดงาน',
    btn1Link: '',
    btn1Target: '_self',
    btn2Text: 'ดูภาพกิจกรรม',
    btn2Link: '/activities',
    btn2Target: '_self',
    btn3Text: 'ทัวร์นาเมนต์',
    btn3Link: '/tournaments',
    btn3Target: '_self',
    btn4Text: 'ร้านค้า',
    btn4Link: '/franchise',
    btn4Target: '_self',
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
      title: 'รวมภาพกิจกรรม',
      desc: 'ภาพงานแข่ง LAN, งานเปิดตัวเกม, มีตติ้ง และพิธีมอบรางวัลชนะเลิศตลอดทั้งปี',
      linkText: 'สำรวจอัลบั้มภาพกิจกรรม',
      linkTarget: '/activities',
      bgColor: '#1e3a8a',
      titleColor: '#ffffff',
      descColor: '#cbd5e1',
      bgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      alt: 'ภาพบรรยากาศการแข่งขันเกมและกองเชียร์อีสปอร์ต ณ GLP Arena'
    },
    bannerRight: {
      badge: 'GLP TOURNAMENTS',
      title: 'ทัวร์นาเมนต์การแข่งขัน',
      desc: 'เกาะติดผลการแข่งขัน สายแข่งสด (Brackets) และลงทะเบียนประลองฝีมือระดับประเทศ',
      linkText: 'สำรวจทัวร์นาเมนต์ทั้งหมด',
      linkTarget: '/tournaments',
      bgColor: '#1e293b',
      titleColor: '#ffffff',
      descColor: '#cbd5e1',
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      alt: 'ตารางการแข่งขันและทัวร์นาเมนต์อีสปอร์ต GLP Esports Arena'
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
    buttonText: 'วางผังร้านและประเมินราคา',
    buttonLink: 'franchise',
    bgColor: '#1e3a8a',
    headingColor: '#ffffff',
    descColor: '#bfdbfe',
    bgImage: ''
  },
  venueZones: INITIAL_ZONES,
  tournaments: INITIAL_TOURNAMENTS,
  gallery: INITIAL_GALLERY,
  activityCategories: INITIAL_CATEGORIES,
  articleTags: INITIAL_TAGS,
  news: INITIAL_NEWS,
  organizerGames: DEFAULT_ORGANIZER_GAMES,
  founder: {
    ...INITIAL_FOUNDER,
    ctaButtonText: 'ปรึกษาเรื่องการเปิดร้าน',
    ctaButtonLink: '/franchise',
    showCtaButton: true,
    bgColor: '#ffffff',
    titleColor: '#0f172a',
    textColor: '#475569'
  },
  catalogItems: INITIAL_CATALOG,
  hardwareTiers: INITIAL_TIERS,
  fixedInfrastructure: INITIAL_FIXED_INFRASTRUCTURE,
  interiorThemes: INITIAL_INTERIOR_THEMES,
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
    adminPassword: 'Weerayutth0@',
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
  smtpConfig: {
    provider: 'hostinger',
    host: 'smtp.hostinger.com',
    port: '465',
    encryption: 'SSL/TLS',
    user: 'order@cyber-wp.com',
    pass: '••••••••••••••••',
    senderName: 'GLP : G Speed Living Plus',
    senderEmail: 'order@cyber-wp.com',
    adminCcEmail: 'order@cyber-wp.com',
    autoReplyEnabled: true,
    staffAlertEmails: [
      { id: 1, email: 'order@cyber-wp.com', role: 'ผู้บริหาร / เจ้าของร้าน (Owner/Executive)', active: true },
      { id: 2, email: '', role: 'ฝ่ายขาย & ที่ปรึกษาแฟรนไชส์ (Sales & Franchise)', active: false },
      { id: 3, email: '', role: 'ทีมวิศวกร & เทคนิค 3D (Engineering)', active: false },
      { id: 4, email: '', role: 'ฝ่ายบริการลูกค้า & นัดหมาย (Customer Support)', active: false },
      { id: 5, email: '', role: 'ผู้จัดการสาขารามคำแหง (Store Manager)', active: false }
    ],
    lastTestedAt: '05/10/2026 16:00',
    lastTestStatus: 'Connected (Hostinger SMTP 250 OK)'
  },
  emailTemplates: {
    franchiseAutoReply: {
      id: 'franchiseAutoReply',
      name: 'อีเมลตอบกลับคำขอแฟรนไชส์ & แปลนร้านอัตโนมัติ (Customer Auto-Reply)',
      subject: 'ขอบพระคุณที่สนใจร่วมลงทุนแฟรนไชส์ GLP : G Speed Living Plus (ใบเสนอราคาเลขที่ {{quote_ref}})',
      preheader: 'ทีมวิศวกรและผู้เชี่ยวชาญ GLP ได้รับพิมพ์เขียวผังร้านของคุณเรียบร้อยแล้ว',
      body: 'เรียน คุณ{{customer_name}},\n\nบริษัท จี-สปีด ลิฟวิ่ง พลัส จำกัด (GLP : G Speed Living Plus) ขอขอบพระคุณเป็นอย่างยิ่งที่ท่านได้ให้ความสนใจร่วมลงทุนในธุรกิจอีสปอร์ตอารีน่าและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากล\n\nทีมวิศวกรออกแบบระบบและที่ปรึกษาธุรกิจแฟรนไชส์ GLP ได้รับข้อมูลพิมพ์เขียวผังร้าน 3D ของท่านเรียบร้อยแล้ว โดยมีรายละเอียดสรุปเบื้องต้นดังนี้:\n\n• รหัสอ้างอิงใบเสนอราคา: {{quote_ref}}\n• ขนาดพื้นที่ร้าน: {{room_dimensions}}\n• จำนวนเครื่องที่จัดวาง: {{total_stations}} เครื่อง\n• งบประมาณลงทุนประเมินเบื้องต้น: {{total_investment}} บาท\n• ผลตอบแทนเฉลี่ยประมาณการ: {{monthly_profit}} บาท/เดือน (ระยะคืนทุน {{payback_months}} เดือน)\n\nทีมงานผู้เชี่ยวชาญกำลังดำเนินการจัดทำ "รายงานการศึกษาความเป็นไปได้ของโครงการ (Project Feasibility Study)" อย่างละเอียด และจะติดต่อกลับหาท่านทางเบอร์ {{customer_phone}} หรืออีเมล {{customer_email}} ภายใน 24 ชั่วโมง เพื่อส่งมอบเล่มรายงานและนัดหมายให้คำปรึกษาแบบ 1-on-1 โดยไม่มีค่าใช้จ่าย\n\nหากท่านมีข้อสงสัยเร่งด่วน สามารถติดต่อฝ่ายพัฒนาธุรกิจแฟรนไชส์ได้ทันทีที่เบอร์ {{company_phone}} หรือ Line Official: {{company_line}}\n\nขอแสดงความนับถือ,\nทีมงานฝ่ายพัฒนาธุรกิจแฟรนไชส์\nบริษัท จี-สปีด ลิฟวิ่ง พลัส จำกัด (GLP)'
    },
    internalAdminAlert: {
      id: 'internalAdminAlert',
      name: 'อีเมลแจ้งเตือนทีมวิศวกร & ฝ่ายขายเมื่อมี Lead ใหม่ (Internal Staff Alert)',
      subject: '[NEW LEAD] มีผู้สนใจเปิดร้านใหม่: คุณ{{customer_name}} ({{total_stations}} เครื่อง / {{quote_ref}})',
      preheader: 'มีคำขอใบเสนอราคาใหม่จากระบบ 3D Floorplanner',
      body: 'เรียน ทีมงานวิศวกรและฝ่ายพัฒนาธุรกิจ GLP,\n\nมีลูกค้าสนใจร่วมลงทุนแฟรนไชส์รายใหม่ส่งแบบแปลนร้าน 3D เข้ามาในระบบ:\n\n• ชื่อลูกค้า: คุณ{{customer_name}}\n• เบอร์โทรติดต่อ: {{customer_phone}}\n• อีเมล: {{customer_email}}\n• เลขที่ใบเสนอราคา: {{quote_ref}}\n• จำนวนเครื่อง: {{total_stations}} เครื่อง\n• งบประมาณประเมิน: {{total_investment}} บาท\n• ขนาดพื้นที่: {{room_dimensions}}\n• รายละเอียดสถานที่: {{location_detail}}\n\nกรุณาตรวจสอบผังและติดต่อกลับลูกค้าภายใน 24 ชั่วโมง ตาม SLA ที่กำหนด'
    }
  },
  footer: {
    description: 'ศูนย์กีฬาอีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากล บริหารงานโดย GLP Living Plus Group พร้อมระบบโซลูชันแฟรนไชส์อัจฉริยะสำหรับผู้ประกอบการรุ่นใหม่',
    phone: '063-793-7704',
    email: 'gspeedlivingplus35@gmail.com',
    line: '@gspeedarena',
    address: '79 ซอย รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310',
    googleMapUrl: 'https://maps.app.goo.gl/ak23az5WtsvXGWUR8',
    copyright: '2026 GLP : G Speed Living Plus. All Rights Reserved.',
    socialLinks: {
      facebook: 'https://www.facebook.com/GLP.Gspeedlivingplus',
      tiktok: 'https://www.tiktok.com/@gspeedlivingplus',
      instagram: 'https://www.instagram.com/gspeedlivingplus',
      discord: 'https://discord.gg/gspeed',
      youtube: 'https://youtube.com/@gspeedarena',
      steam: 'https://steamcommunity.com/groups/gspeed'
    }
  },
  contactPage: INITIAL_CONTACT_PAGE,
  leads: INITIAL_LEADS,
  pettyCashExpenses: INITIAL_PETTY_CASH,
  omnichannelChats: INITIAL_OMNICHANNEL_CHATS,
  hardwareStations: INITIAL_HARDWARE_STATIONS,
  rmaClaims: INITIAL_RMA_CLAIMS,
  securityConfig: {
    adminUsername: 'admin',
    adminPassword: 'Weerayutth0@',
    quickPin: '998877',
    sessionTimeoutMinutes: 30,
    rememberMeDurationDays: 7,
    lastLogin: null,
    lockoutDurationSeconds: 30,
    maxFailedAttempts: 5
  },
  adminAuditLogs: [
    {
      id: 'log-1',
      timestamp: '17/09/2026 10:00',
      action: 'LOGIN_SUCCESS',
      adminUser: 'admin',
      ip: '127.0.0.1 (Localhost)',
      device: 'Chrome / Windows',
      status: 'success',
      details: 'เข้าสู่ระบบคอนโซลศูนย์ควบคุมส่วนกลางสำเร็จ'
    },
    {
      id: 'log-2',
      timestamp: '16/09/2026 18:30',
      action: 'UPDATE_HERO',
      adminUser: 'admin',
      ip: '127.0.0.1 (Localhost)',
      device: 'Chrome / Windows',
      status: 'info',
      details: 'ปรับปรุงข้อความและธีมส่วนหัว Banner Hero'
    }
  ],
  tournamentApplications: [
    {
      id: 'app-tourney-1',
      tournamentId: 'tourney-1',
      tournamentTitle: 'VALORANT CHAMPIONSHIP 2026',
      teamName: 'TALON ESPORTS JR.',
      teamTag: 'TLN',
      logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
      captainName: 'พีรภัทร วรเดชสกุล (Captain Pat)',
      captainPhone: '081-992-3456',
      captainEmail: 'pat.talon@gmail.com',
      captainDiscord: 'PatVlr#1234',
      players: [
        { ign: 'PatVlr', realName: 'พีรภัทร วรเดชสกุล', role: 'Duelist (Captain)' },
        { ign: 'NightStrike', realName: 'กิตติศักดิ์ มั่นคง', role: 'Initiator' },
        { ign: 'CynicZ', realName: 'ชัชวาล เลิศปรีชา', role: 'Controller' },
        { ign: 'ShadowAim', realName: 'ธนากร ภักดีผล', role: 'Sentinel' },
        { ign: 'ViperKing', realName: 'อภิสิทธิ์ ศรีสวัสดิ์', role: 'Flex' }
      ],
      substitutes: [
        { ign: 'SubZeroX', realName: 'ณัฐพล พรหมเมศ', role: 'Sub 1' }
      ],
      status: 'Pending',
      submittedAt: '17/09/2026 09:30',
      notes: 'พร้อมลงสนามรอบออฟไลน์ นำอุปกรณ์เมาส์/หูฟังมาเอง'
    },
    {
      id: 'app-tourney-2',
      tournamentId: 'tourney-2',
      tournamentTitle: 'PUBG BATTLEGROUNDS SQUAD ARENA',
      teamName: 'PHOENIX VORTEX',
      teamTag: 'PHX',
      logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=150&q=80',
      captainName: 'ชานนท์ สิทธิชัย (Chanon)',
      captainPhone: '089-445-1289',
      captainEmail: 'chanon.pubg@gmail.com',
      captainDiscord: 'ChanonPHX#7788',
      players: [
        { ign: 'PHX_Nont', realName: 'ชานนท์ สิทธิชัย', role: 'IGL / Scout' },
        { ign: 'PHX_Blaster', realName: 'วรพล เกษมสันต์', role: 'Fragger' },
        { ign: 'PHX_SniperD', realName: 'ดนัย บุญมี', role: 'Sniper' },
        { ign: 'PHX_Support', realName: 'ศุภกร แก้วมณี', role: 'Support' }
      ],
      substitutes: [],
      status: 'Pending',
      submittedAt: '17/09/2026 11:15',
      notes: 'ขอสิทธิ์รอบบ่ายเนื่องจากเดินทางมาจากชลบุรี'
    }
  ]
};

// Deep merge helper ensuring every nested property in defaults is present
function deepMerge(target, source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return source !== undefined ? source : target;
  }
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (key === 'hardwareTiers') {
      // hardwareTiers is a user-managed collection of PC specs.
      // NEVER copy deleted tiers from target! User's source is the authoritative source of truth.
      if (source.hardwareTiers && typeof source.hardwareTiers === 'object' && !Array.isArray(source.hardwareTiers) && Object.keys(source.hardwareTiers).length > 0) {
        result.hardwareTiers = { ...source.hardwareTiers };
      }
    } else if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  if (source.hardwareTiers && typeof source.hardwareTiers === 'object' && !Array.isArray(source.hardwareTiers) && Object.keys(source.hardwareTiers).length > 0) {
    result.hardwareTiers = { ...source.hardwareTiers };
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
        if (parsed.hardwareTiers && typeof parsed.hardwareTiers === 'object' && Object.keys(parsed.hardwareTiers).length > 0) {
          merged.hardwareTiers = { ...parsed.hardwareTiers };
        }

        // Update default address/phone/email/social if old placeholder exists
        if (merged.footer) {
          if (!merged.footer.phone || merged.footer.phone.includes('02-888-9999') || merged.footer.phone.includes('02-999-8888') || merged.footer.phone === '063 793 7704') {
            merged.footer.phone = DEFAULT_SITE_DATA.footer.phone;
          }
          if (!merged.footer.address || !merged.footer.address.includes('รามคำแหง 53')) {
            merged.footer.address = DEFAULT_SITE_DATA.footer.address;
          }
          if (!merged.footer.email || merged.footer.email.includes('contact@') || merged.footer.email.includes('@gspeed') || merged.footer.email !== 'gspeedlivingplus35@gmail.com') {
            merged.footer.email = 'gspeedlivingplus35@gmail.com';
          }
          merged.footer.googleMapUrl = 'https://maps.app.goo.gl/ak23az5WtsvXGWUR8';
          if (merged.footer.copyright) {
            merged.footer.copyright = merged.footer.copyright.replace(/^©\s*/, '');
          }
          if (!merged.footer.socialLinks) {
            merged.footer.socialLinks = DEFAULT_SITE_DATA.footer.socialLinks;
          } else {
            merged.footer.socialLinks = {
              ...DEFAULT_SITE_DATA.footer.socialLinks,
              ...merged.footer.socialLinks
            };
          }
          if (!merged.footer.socialLinks.facebook || merged.footer.socialLinks.facebook.includes('gspeedesport') || merged.footer.socialLinks.facebook !== 'https://www.facebook.com/GLP.Gspeedlivingplus') {
            merged.footer.socialLinks.facebook = 'https://www.facebook.com/GLP.Gspeedlivingplus';
          }
        }

        if (merged.contactPage) {
          if (!merged.contactPage.storeEmail || merged.contactPage.storeEmail !== 'gspeedlivingplus35@gmail.com') {
            merged.contactPage.storeEmail = 'gspeedlivingplus35@gmail.com';
          }
          if (merged.contactPage.socialLinks) {
            if (!merged.contactPage.socialLinks.facebook || merged.contactPage.socialLinks.facebook.includes('gspeedesport')) {
              merged.contactPage.socialLinks.facebook = 'https://www.facebook.com/GLP.Gspeedlivingplus';
            }
          }
          if (Array.isArray(merged.contactPage.perks)) {
            merged.contactPage.perks = merged.contactPage.perks.map(p => {
              if (p.id === 'perk-1' || (p.text && (p.text.includes('เปิดบริ') || p.text.includes('365')))) {
                return { ...p, text: 'เปิดบริการ 24 ชั่วโมง 365 วัน ไม่มีวันหยุด' };
              }
              return p;
            });
          }
        }

        if (merged.smtpConfig) {
          if (!merged.smtpConfig.senderEmail || merged.smtpConfig.senderEmail.includes('@gspeedlivingplus.com') || merged.smtpConfig.senderEmail.includes('@gspeed-esport.com') || merged.smtpConfig.senderEmail.includes('contact@') || merged.smtpConfig.senderEmail === 'gspeedlivingplus35@gmail.com') {
            merged.smtpConfig.senderEmail = 'order@cyber-wp.com';
          }
          if (!merged.smtpConfig.user || merged.smtpConfig.user.includes('@gspeedlivingplus.com') || merged.smtpConfig.user.includes('contact@') || merged.smtpConfig.user === 'gspeedlivingplus35@gmail.com') {
            merged.smtpConfig.user = 'order@cyber-wp.com';
          }
          if (!merged.smtpConfig.adminCcEmail || merged.smtpConfig.adminCcEmail.includes('@gspeedlivingplus.com') || merged.smtpConfig.adminCcEmail.includes('@gspeed-esport.com') || merged.smtpConfig.adminCcEmail === 'gspeedlivingplus35@gmail.com') {
            merged.smtpConfig.adminCcEmail = 'order@cyber-wp.com';
          }
          if (Array.isArray(merged.smtpConfig.staffAlertEmails)) {
            merged.smtpConfig.staffAlertEmails = merged.smtpConfig.staffAlertEmails.map(st => {
              if (st.email && (st.email.includes('@gspeedlivingplus.com') || st.email.includes('@gspeed-esport.com') || st.email === 'gspeedlivingplus35@gmail.com')) {
                return { ...st, email: st.id === 1 ? 'order@cyber-wp.com' : '' };
              }
              return st;
            });
          }
        }

        // Migrate legacy secondaryCta button text and ensure hero buttons defaults
        if (merged.hero && typeof merged.hero === 'object') {
          if (!merged.hero.secondaryCta || merged.hero.secondaryCta.includes('จำลองผังร้าน') || merged.hero.secondaryCta.includes('ติดต่อเปิดร้าน') || merged.hero.secondaryCta.includes('เปิดร้าน')) {
            merged.hero.secondaryCta = 'ร้านค้า';
          }
          if (!merged.hero.btn2Text || merged.hero.btn2Text === 'สำรวจกิจกรรม & ทัวร์นาเมนต์' || merged.hero.btn2Text.includes('ทัวร์นาเมนต์') || merged.hero.btn2Text === 'ดูกิจกรรม') {
            merged.hero.btn2Text = 'ดูภาพกิจกรรม';
          }
          if (!merged.hero.primaryCta || merged.hero.primaryCta === 'สำรวจกิจกรรม & ทัวร์นาเมนต์' || merged.hero.primaryCta.includes('ทัวร์นาเมนต์') || merged.hero.primaryCta === 'ดูกิจกรรม') {
            merged.hero.primaryCta = 'ดูภาพกิจกรรม';
          }
          if (!merged.hero.btn4Text || merged.hero.btn4Text.includes('ติดต่อเปิดร้าน') || merged.hero.btn4Text.includes('จำลองผังร้าน') || merged.hero.btn4Text.includes('เปิดร้าน')) {
            merged.hero.btn4Text = 'ร้านค้า';
          }
          if (merged.hero.btn1Target === undefined) merged.hero.btn1Target = '_self';
          if (merged.hero.btn2Target === undefined) merged.hero.btn2Target = '_self';
          if (merged.hero.btn3Target === undefined) merged.hero.btn3Target = '_self';
          if (merged.hero.btn4Target === undefined) merged.hero.btn4Target = '_self';
          if (merged.hero.btn1Link === undefined) merged.hero.btn1Link = '';
          if (merged.hero.btn2Link === undefined) merged.hero.btn2Link = '/activities';
          if (merged.hero.btn3Link === undefined) merged.hero.btn3Link = '/tournaments';
          if (merged.hero.btn4Link === undefined) merged.hero.btn4Link = '/franchise';
        }

        // Sanitize legacy founder experience if it has the long sentence
        if (merged.founder && merged.founder.experience && (merged.founder.experience.includes('ในอุตสาหกรรม') || merged.founder.experience.length > 15)) {
          const expMatch = merged.founder.experience.match(/^(\d+\+?\s*ปี)/);
          merged.founder.experience = expMatch ? expMatch[1] : '16+ ปี';
        }

        if (!Array.isArray(merged.gallery)) merged.gallery = INITIAL_GALLERY;
        if (!Array.isArray(merged.news)) merged.news = INITIAL_NEWS;
        if (!Array.isArray(merged.catalogItems)) merged.catalogItems = INITIAL_CATALOG;

        // Ensure founder corporate galleries are populated
        if (!merged.founder || typeof merged.founder !== 'object') {
          merged.founder = { ...INITIAL_FOUNDER };
        } else {
          merged.founder = {
            ...INITIAL_FOUNDER,
            ...merged.founder,
            ctaButtonText: merged.founder.ctaButtonText || INITIAL_FOUNDER.ctaButtonText || 'ปรึกษาเรื่องการเปิดร้าน',
            ctaButtonLink: merged.founder.ctaButtonLink || INITIAL_FOUNDER.ctaButtonLink || '/franchise',
            showCtaButton: merged.founder.showCtaButton !== undefined ? merged.founder.showCtaButton : true,
            hero: { ...INITIAL_FOUNDER.hero, ...(merged.founder.hero || {}) },
            philosophies: Array.isArray(merged.founder.philosophies) && merged.founder.philosophies.length > 0
              ? merged.founder.philosophies
              : INITIAL_FOUNDER.philosophies,
            standards: { ...INITIAL_FOUNDER.standards, ...(merged.founder.standards || {}) },
            franchiseCta: { ...INITIAL_FOUNDER.franchiseCta, ...(merged.founder.franchiseCta || {}) },
            history: (Array.isArray(merged.founder.history) && merged.founder.history.length > 0
              ? merged.founder.history
              : INITIAL_FOUNDER.history
            ).map(h => ({
              ...h,
              event: (h.event || '').replace(/8\s*[\uFFFD?]+าขา/g, '8 สาขา').replace(/ค่ายเกมใ[\uFFFD?]+ญ่/g, 'ค่ายเกมใหญ่')
            })),
            stats: (Array.isArray(merged.founder.stats) && merged.founder.stats.length > 0
              ? merged.founder.stats
              : INITIAL_FOUNDER.stats
            ).map(s => ({
              ...s,
              label: (s.label || '').replace(/8\s*[\uFFFD?]+าขา/g, '8 สาขา'),
              value: (s.value || '').replace(/8\s*[\uFFFD?]+าขา/g, '8 สาขา').replace(/8\s+าขา/g, '8 สาขา')
            })),
            milestonesGallery: Array.isArray(merged.founder.milestonesGallery) && merged.founder.milestonesGallery.length > 0
              ? merged.founder.milestonesGallery
              : INITIAL_FOUNDER.milestonesGallery,
            partnersGallery: Array.isArray(merged.founder.partnersGallery) && merged.founder.partnersGallery.length > 0
              ? merged.founder.partnersGallery
              : INITIAL_FOUNDER.partnersGallery,
            standardsGallery: Array.isArray(merged.founder.standardsGallery) && merged.founder.standardsGallery.length > 0
              ? merged.founder.standardsGallery
              : INITIAL_FOUNDER.standardsGallery,
            partners: Array.isArray(merged.founder.partners) && merged.founder.partners.length > 0
              ? merged.founder.partners.map(p => {
                  if (!p.logo || p.logo === '') {
                    const match = INITIAL_FOUNDER.partners.find(ip => ip.name.toLowerCase() === (p.name || '').toLowerCase());
                    if (match && match.logo) return { ...p, logo: match.logo };
                  }
                  return p;
                })
              : INITIAL_FOUNDER.partners,
          };
        }
        if (!merged.hardwareTiers || typeof merged.hardwareTiers !== 'object' || Array.isArray(merged.hardwareTiers) || Object.keys(merged.hardwareTiers).length === 0) {
          merged.hardwareTiers = INITIAL_TIERS;
        } else {
          // Preserve user customized hardwareTiers as source of truth (do not revive deleted tiers)
          Object.keys(merged.hardwareTiers).forEach(k => {
            if (merged.hardwareTiers[k]?.chair) {
              delete merged.hardwareTiers[k].chair;
            }
          });
        }
        if (!merged.fixedInfrastructure || typeof merged.fixedInfrastructure !== 'object') {
          merged.fixedInfrastructure = INITIAL_FIXED_INFRASTRUCTURE;
        } else {
          merged.fixedInfrastructure = {
            ...INITIAL_FIXED_INFRASTRUCTURE,
            ...merged.fixedInfrastructure
          };
        }
        if (!Array.isArray(merged.interiorThemes) || merged.interiorThemes.length === 0) {
          merged.interiorThemes = INITIAL_INTERIOR_THEMES;
        }
        if (!Array.isArray(merged.tournaments)) {
          merged.tournaments = INITIAL_TOURNAMENTS;
        } else {
          // Preserve saved tournaments as-is
          merged.tournaments = merged.tournaments.map(t => {
            const def = INITIAL_TOURNAMENTS.find(it => it.id === t.id);
            const slug = t.slug || t.seo?.slug || (def && def.slug) || (t.title ? t.title.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)/g, '') : t.id);
            return {
              ...(def || {}),
              ...t,
              slug,
              teams: Array.isArray(t.teams) ? t.teams : (def ? (def.teams || []) : []),
              bracketMatches: Array.isArray(t.bracketMatches) ? t.bracketMatches : (def ? (def.bracketMatches || []) : []),
              galleryPhotos: Array.isArray(t.galleryPhotos) ? t.galleryPhotos : (def ? (def.galleryPhotos || []) : []),
              rules: Array.isArray(t.rules) ? t.rules : (def ? (def.rules || []) : []),
              prizeDistribution: Array.isArray(t.prizeDistribution) ? t.prizeDistribution : (def ? (def.prizeDistribution || []) : []),
              scheduleTimetable: Array.isArray(t.scheduleTimetable) ? t.scheduleTimetable : (def ? (def.scheduleTimetable || []) : []),
              seo: (t.seo && t.seo.metaTitle) ? { ...t.seo, slug: t.seo.slug || slug } : { ...(def ? def.seo : {}), slug }
            };
          });
        }
        if (!Array.isArray(merged.venueZones) || merged.venueZones.length === 0) {
          merged.venueZones = INITIAL_ZONES.map(z => ({
            ...z,
            images: (z.images || []).slice(0, 3)
          }));
        } else {
          // Ensure all 4 zones exist
          const existingIds = new Set(merged.venueZones.map(z => z.id));
          const completeZones = [...merged.venueZones];
          INITIAL_ZONES.forEach(initZone => {
            if (!existingIds.has(initZone.id)) {
              completeZones.push({ ...initZone, images: (initZone.images || []).slice(0, 3) });
            }
          });

          merged.venueZones = completeZones.map(z => {
            const init = INITIAL_ZONES.find(iz => iz.id === z.id);
            let zoneImages = Array.isArray(z.images) && z.images.length > 0
              ? z.images.slice(0, 3)
              : (init && Array.isArray(init.images) ? init.images.slice(0, 3) : []);
            
            if (zoneImages.length === 0 && (z.image || init?.image)) {
              zoneImages = [{ id: `${z.id}-1`, url: z.image || init?.image || '', caption: z.title || init?.title || '' }];
            }

            // Ensure each slot has a valid URL and fallback
            zoneImages = zoneImages.map((s, idx) => {
              const initSlot = init?.images?.[idx] || init?.images?.[0];
              let validUrl = (s?.url && typeof s.url === 'string' && s.url.trim() && s.url !== '[object Object]') 
                ? s.url 
                : (initSlot?.url || init?.image || '');

              // Automatically replace outdated medieval castle or claw machine photos with real esports stage photos
              if (validUrl.includes('photo-1518709268805-4e9042af9f23') || validUrl.includes('photo-1511882150382-421056c89033')) {
                validUrl = initSlot?.url || init?.image || validUrl;
              }

              return {
                id: s?.id || `${z.id}-img-${idx + 1}`,
                url: validUrl,
                caption: s?.caption !== undefined ? s.caption : (initSlot?.caption || '')
              };
            });

            return {
              ...(init || {}),
              ...z,
              subtitle: z.subtitle !== undefined ? z.subtitle : (init?.subtitle || ''),
              badge: z.badge !== undefined ? z.badge : (init?.badge || ''),
              images: zoneImages,
              image: zoneImages[0]?.url || z.image || init?.image || ''
            };
          });
        }
        if (!Array.isArray(merged.navLinks) || merged.navLinks.some(l => l.target === 'franchise' || l.label === 'หน้าหลัก' || l.label === 'ทัวร์นาเมนต์ & แข่งขัน') || !merged.navLinks.some(l => l.target === 'contact' || l.id === 'nav-contact')) {
          merged.navLinks = INITIAL_NAV_LINKS;
        }
        if (!merged.headerCta || merged.headerCta.text === 'คำนวณราคาเปิดร้าน') {
          merged.headerCta = {
            ...(merged.headerCta || {}),
            text: 'สนใจเปิดร้าน',
            target: 'franchise',
            visible: true
          };
        }
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
          if (merged.securityConfig.adminPassword === 'gspeed2026') {
            merged.securityConfig.adminPassword = 'Weerayutth0@';
          }
        }

        if (Array.isArray(merged.adminStaffList)) {
          merged.adminStaffList = merged.adminStaffList.map(staff => {
            if (staff.isMaster || staff.username === 'admin') {
              if (staff.password === 'gspeed2026') {
                return { ...staff, password: 'Weerayutth0@' };
              }
            }
            return staff;
          });
        }

        if (!merged.smtpConfig || typeof merged.smtpConfig !== 'object') {
          merged.smtpConfig = DEFAULT_SITE_DATA.smtpConfig;
        } else {
          const isOldGmail = merged.smtpConfig.host === 'smtp.gmail.com';
          const hasStaffList = Array.isArray(merged.smtpConfig.staffAlertEmails) && merged.smtpConfig.staffAlertEmails.length > 0;
          
          merged.smtpConfig = {
            ...DEFAULT_SITE_DATA.smtpConfig,
            ...merged.smtpConfig,
            host: isOldGmail ? 'smtp.hostinger.com' : (merged.smtpConfig.host || 'smtp.hostinger.com'),
            provider: isOldGmail ? 'hostinger' : (merged.smtpConfig.provider || 'hostinger'),
            senderName: isOldGmail ? 'GLP : G-Speed Living Plus' : (merged.smtpConfig.senderName || 'GLP : G-Speed Living Plus'),
            staffAlertEmails: hasStaffList ? merged.smtpConfig.staffAlertEmails : DEFAULT_SITE_DATA.smtpConfig.staffAlertEmails
          };
        }

        if (!merged.emailTemplates || typeof merged.emailTemplates !== 'object') {
          merged.emailTemplates = DEFAULT_SITE_DATA.emailTemplates;
        } else {
          merged.emailTemplates = { ...DEFAULT_SITE_DATA.emailTemplates, ...merged.emailTemplates };
        }

        if (!merged.contactPage || typeof merged.contactPage !== 'object') {
          merged.contactPage = INITIAL_CONTACT_PAGE;
        } else {
          merged.contactPage = {
            ...INITIAL_CONTACT_PAGE,
            ...merged.contactPage,
            storeAddress: '79 ซอย รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310 (เข้าออกได้ทั้งทางซอยลาดพร้าว 112 และซอยรามคำแหง 53)',
            googleMapsDirectUrl: 'https://maps.app.goo.gl/ak23az5WtsvXGWUR8',
            googleMapsEmbedUrl: 'https://maps.google.com/maps?q=13.766999,100.618755&t=&z=17&ie=UTF8&iwloc=&output=embed',
            socialLinks: { ...INITIAL_CONTACT_PAGE.socialLinks, ...(merged.contactPage.socialLinks || {}) },
            transportation: Array.isArray(merged.contactPage.transportation) && merged.contactPage.transportation.length > 0
              ? merged.contactPage.transportation
              : INITIAL_CONTACT_PAGE.transportation,
            perks: Array.isArray(merged.contactPage.perks) && merged.contactPage.perks.length > 0
              ? merged.contactPage.perks
              : INITIAL_CONTACT_PAGE.perks
          };
        }

        if (!Array.isArray(merged.adminAuditLogs)) {
          merged.adminAuditLogs = DEFAULT_SITE_DATA.adminAuditLogs;
        }

        if (!Array.isArray(merged.tournamentApplications)) {
          merged.tournamentApplications = DEFAULT_SITE_DATA.tournamentApplications;
        }

        if (!Array.isArray(merged.arenaBookings)) {
          merged.arenaBookings = INITIAL_ARENA_BOOKINGS;
        }
        if (!Array.isArray(merged.arenaSeatingZones)) {
          merged.arenaSeatingZones = ARENA_SEATING_ZONES;
        }

        if (!Array.isArray(merged.equipmentProducts) || merged.equipmentProducts.length === 0) {
          merged.equipmentProducts = EQUIPMENT_PRODUCTS;
        } else {
          merged.equipmentProducts = merged.equipmentProducts.map(p => {
            if (p.id === 'prod-desk-02') {
              const defaultDesk2 = EQUIPMENT_PRODUCTS.find(x => x.id === 'prod-desk-02');
              return {
                ...p,
                gallery: defaultDesk2 ? defaultDesk2.gallery : [p.image]
              };
            }
            return p;
          });
        }

        // Preserve saved gallery items as-is
        if (Array.isArray(merged.gallery)) {
          merged.gallery = merged.gallery.map(item => item);
        }

        // Preserve saved news items as-is
        if (Array.isArray(merged.news)) {
          merged.news = merged.news.map(item => item);
        }

        // Hydrate catalog items with mockData images, colors, grade, warranty, sku, weightKg, maxLoadKg, and imageAlt if missing
        merged.catalogItems = merged.catalogItems.map(item => {
          const initial = INITIAL_CATALOG.find(c => c.type === item.type);
          return initial
            ? { 
                ...initial, 
                ...item, 
                sku: item.sku || initial.sku || ('GLP-' + (item.type || 'ITEM').toUpperCase()),
                weightKg: item.weightKg !== undefined ? item.weightKg : (initial.weightKg || 48),
                maxLoadKg: item.maxLoadKg !== undefined ? item.maxLoadKg : (initial.maxLoadKg || 350),
                weightNote: item.weightNote || initial.weightNote || '',
                imageAlt: item.imageAlt || initial.imageAlt || item.name || '',
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
          // Check if bannerRight still has old 'บทความ' / '#news' content and migrate
          const isOldRight = !merged.featureBanners.bannerRight?.title || 
            merged.featureBanners.bannerRight.title.includes('บทความ') || 
            merged.featureBanners.bannerRight.badge?.includes('BLOG') ||
            merged.featureBanners.bannerRight.linkTarget === '#news';

          merged.featureBanners.bannerRight = {
            ...DEFAULT_SITE_DATA.featureBanners.bannerRight,
            ...(merged.featureBanners.bannerRight || {}),
            badge: isOldRight ? 'GLP TOURNAMENTS' : (merged.featureBanners.bannerRight.badge || 'GLP TOURNAMENTS'),
            title: isOldRight ? 'ทัวร์นาเมนต์การแข่งขัน' : (merged.featureBanners.bannerRight.title || 'ทัวร์นาเมนต์การแข่งขัน'),
            desc: isOldRight ? 'เกาะติดผลการแข่งขัน สายแข่งสด (Brackets) และลงทะเบียนประลองฝีมือระดับประเทศ' : (merged.featureBanners.bannerRight.desc || 'เกาะติดผลการแข่งขัน สายแข่งสด (Brackets) และลงทะเบียนประลองฝีมือระดับประเทศ'),
            linkText: isOldRight ? 'สำรวจทัวร์นาเมนต์ทั้งหมด' : (merged.featureBanners.bannerRight.linkText || 'สำรวจทัวร์นาเมนต์ทั้งหมด'),
            linkTarget: isOldRight ? '/tournaments' : (merged.featureBanners.bannerRight.linkTarget || '/tournaments'),
            image: merged.featureBanners.bannerRight?.image || DEFAULT_SITE_DATA.featureBanners.bannerRight.image
          };

          const isOldLeft = merged.featureBanners.bannerLeft?.title?.includes('บรรยากาศสด') || 
            merged.featureBanners.bannerLeft?.linkTarget === '#activities';

          merged.featureBanners.bannerLeft = {
            ...DEFAULT_SITE_DATA.featureBanners.bannerLeft,
            ...(merged.featureBanners.bannerLeft || {}),
            title: isOldLeft ? 'รวมภาพกิจกรรม' : (merged.featureBanners.bannerLeft?.title || 'รวมภาพกิจกรรม'),
            linkTarget: isOldLeft ? '/activities' : (merged.featureBanners.bannerLeft?.linkTarget || '/activities'),
            image: merged.featureBanners.bannerLeft?.image || DEFAULT_SITE_DATA.featureBanners.bannerLeft.image
          };
        }

        if (!Array.isArray(merged.activityCategories) || merged.activityCategories.length === 0) {
          merged.activityCategories = INITIAL_CATEGORIES;
        }
        if (!Array.isArray(merged.articleTags) || merged.articleTags.length === 0) {
          merged.articleTags = INITIAL_TAGS;
        }
        if (!Array.isArray(merged.organizerGames) || merged.organizerGames.length === 0) {
          merged.organizerGames = DEFAULT_ORGANIZER_GAMES;
        } else {
          const existingIds = new Set(merged.organizerGames.map(g => g.id));
          const missingDefaults = DEFAULT_ORGANIZER_GAMES.filter(dg => !existingIds.has(dg.id) && dg.id !== 'other');
          
          let combined = merged.organizerGames.map(g => {
            const def = DEFAULT_ORGANIZER_GAMES.find(dg => dg.id === g.id || dg.name.toLowerCase() === (g.name || '').toLowerCase());
            return {
              ...g,
              logo: g.logo || def?.logo || '/game-logos/other.svg'
            };
          });

          if (missingDefaults.length > 0) {
            const otherIdx = combined.findIndex(g => g.id === 'other' || g.isOther);
            if (otherIdx !== -1) {
              combined.splice(otherIdx, 0, ...missingDefaults);
            } else {
              combined.push(...missingDefaults);
            }
          }
          merged.organizerGames = combined;
        }
        if (Array.isArray(merged.gallery)) {
          merged.gallery = merged.gallery.map(g => ({
            ...g,
            tags: Array.isArray(g.tags) && g.tags.length > 0 ? g.tags : (INITIAL_GALLERY.find(ig => ig.id === g.id)?.tags || ['#EsportsThailand', '#GLP2026', '#Tournament', '#GamingArena']),
            location: (g.location && g.location.trim() && g.location !== 'G-Speed Esport Arena รามคำแหง (โซนเวที Main Stage)')
              ? g.location
              : 'G-Speed Esport Arena รามคำแหง 53 กรุงเทพฯ',
            attendees: g.attendees || '300+ คน'
          }));
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

  // Keep a synchronous ref to siteData to prevent stale closure reads during rapid saves
  const siteDataRef = useRef(siteData);
  useEffect(() => {
    siteDataRef.current = siteData;
  }, [siteData]);

  // State changes are kept in-memory for maximum 60FPS typing performance.
  // Real persistence to localStorage and the server database occurs on explicit Save (saveSiteData).

  // Flag to track when initial server hydration is complete
  const isHydratedRef = useRef(false);


  // Synchronize siteData changes across browser tabs in real time
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
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Server Database Sync & Persistence Tracking
  const [serverSyncStatus, setServerSyncStatus] = useState({
    synced: false,
    lastSynced: null,
    error: null,
    saving: false
  });

  // Hydrate from persistent server database on initial load (Server is Single Source of Truth)
  useEffect(() => {
    let isMounted = true;
    const fetchServerSiteData = async () => {
      try {
        const res = await fetch('/api/site-data');
        if (!res.ok) {
          isHydratedRef.current = true;
          return;
        }
        const result = await res.json();
        if (result && result.success && result.siteData && typeof result.siteData === 'object') {
          if (isMounted) {
            console.log('[SiteDataContext] Hydrated from persistent server database.');
            setSiteData(prev => {
              // Server database is the authoritative single source of truth
              const merged = deepMerge(DEFAULT_SITE_DATA, result.siteData);

              // Explicitly preserve user-managed collections from server
              if (result.siteData.hardwareTiers && typeof result.siteData.hardwareTiers === 'object' && Object.keys(result.siteData.hardwareTiers).length > 0) {
                merged.hardwareTiers = { ...result.siteData.hardwareTiers };
              }
              if (Array.isArray(result.siteData.gallery)) merged.gallery = result.siteData.gallery;
              if (Array.isArray(result.siteData.news)) merged.news = result.siteData.news;
              if (Array.isArray(result.siteData.tournaments)) merged.tournaments = result.siteData.tournaments;
              if (Array.isArray(result.siteData.venueZones)) merged.venueZones = result.siteData.venueZones;
              if (Array.isArray(result.siteData.catalogItems)) merged.catalogItems = result.siteData.catalogItems;
              if (Array.isArray(result.siteData.interiorThemes)) merged.interiorThemes = result.siteData.interiorThemes;
              if (Array.isArray(result.siteData.equipmentProducts) && result.siteData.equipmentProducts.length > 0) {
                merged.equipmentProducts = result.siteData.equipmentProducts;
              }
              if (Array.isArray(result.siteData.storeOrders)) {
                merged.storeOrders = result.siteData.storeOrders;
              }
              if (result.siteData.ecommerceConfig && typeof result.siteData.ecommerceConfig === 'object') {
                merged.ecommerceConfig = { ...merged.ecommerceConfig, ...result.siteData.ecommerceConfig };
              }

              // Cache fresh server data to localStorage and ref
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch (e) {}
              siteDataRef.current = merged;
              // Sanitize legacy/invalid emails and Facebook link from server DB if any
              if (merged.footer) {
                if (!merged.footer.email || merged.footer.email.includes('contact@') || merged.footer.email.includes('@gspeed') || merged.footer.email !== 'gspeedlivingplus35@gmail.com') {
                  merged.footer.email = 'gspeedlivingplus35@gmail.com';
                }
                if (!merged.footer.socialLinks || !merged.footer.socialLinks.facebook || merged.footer.socialLinks.facebook.includes('gspeedesport') || merged.footer.socialLinks.facebook !== 'https://www.facebook.com/GLP.Gspeedlivingplus') {
                  if (!merged.footer.socialLinks) merged.footer.socialLinks = {};
                  merged.footer.socialLinks.facebook = 'https://www.facebook.com/GLP.Gspeedlivingplus';
                }
              }
              if (merged.contactPage) {
                if (!merged.contactPage.storeEmail || merged.contactPage.storeEmail !== 'gspeedlivingplus35@gmail.com') {
                  merged.contactPage.storeEmail = 'gspeedlivingplus35@gmail.com';
                }
                if (merged.contactPage.socialLinks) {
                  if (!merged.contactPage.socialLinks.facebook || merged.contactPage.socialLinks.facebook.includes('gspeedesport')) {
                    merged.contactPage.socialLinks.facebook = 'https://www.facebook.com/GLP.Gspeedlivingplus';
                  }
                }
              }
              if (merged.smtpConfig) {
                if (!merged.smtpConfig.senderEmail || merged.smtpConfig.senderEmail.includes('@gspeedlivingplus.com') || merged.smtpConfig.senderEmail.includes('@gspeed-esport.com') || merged.smtpConfig.senderEmail.includes('contact@') || merged.smtpConfig.senderEmail === 'gspeedlivingplus35@gmail.com') {
                  merged.smtpConfig.senderEmail = 'order@cyber-wp.com';
                }
                if (!merged.smtpConfig.user || merged.smtpConfig.user.includes('@gspeedlivingplus.com') || merged.smtpConfig.user.includes('contact@') || merged.smtpConfig.user === 'gspeedlivingplus35@gmail.com') {
                  merged.smtpConfig.user = 'order@cyber-wp.com';
                }
                if (!merged.smtpConfig.adminCcEmail || merged.smtpConfig.adminCcEmail.includes('@gspeedlivingplus.com') || merged.smtpConfig.adminCcEmail.includes('@gspeed-esport.com') || merged.smtpConfig.adminCcEmail === 'gspeedlivingplus35@gmail.com') {
                  merged.smtpConfig.adminCcEmail = 'order@cyber-wp.com';
                }
              }
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch (e) {}
              siteDataRef.current = merged;
              return merged;
            });
            const syncTime = result.updatedAt 
              ? new Date(result.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
              : new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
            setServerSyncStatus({
              synced: true,
              lastSynced: syncTime,
              error: null,
              saving: false
            });
          }
        }
        isHydratedRef.current = true;
      } catch (err) {
        isHydratedRef.current = true;
        console.log('[SiteDataContext] Server database check skipped (offline or initial boot):', err.message);
      } finally {
        isHydratedRef.current = true;
      }
    };
    fetchServerSiteData();
    return () => { isMounted = false; };
  }, []);

  // Generic Update Handlers
  const updateTicker = (badgeOrObj, text, linkTarget, linkText, linkVisible) => {
    if (typeof badgeOrObj === 'object' && badgeOrObj !== null) {
      setSiteData(prev => {
        const nextBadge = badgeOrObj.badge !== undefined ? badgeOrObj.badge : prev.tickerBadge;
        const nextText = badgeOrObj.text !== undefined ? badgeOrObj.text : prev.tickerText;
        const nextLinkTarget = badgeOrObj.linkTarget !== undefined ? badgeOrObj.linkTarget : (badgeOrObj.linkTab || prev.tickerLinkTarget || prev.tickerLinkTab);
        const nextLinkText = badgeOrObj.linkText !== undefined ? badgeOrObj.linkText : prev.tickerLinkText;
        const nextLinkVisible = badgeOrObj.linkVisible !== undefined ? badgeOrObj.linkVisible : prev.tickerLinkVisible;
        
        // Also sync first item in tickerItems if exists
        const currentItems = prev.tickerItems && prev.tickerItems.length > 0 ? [...prev.tickerItems] : [...INITIAL_TICKER_ITEMS];
        if (currentItems[0]) {
          currentItems[0] = {
            ...currentItems[0],
            badge: nextBadge,
            text: nextText,
            linkTarget: nextLinkTarget,
            linkText: nextLinkText
          };
        }

        return {
          ...prev,
          tickerBadge: nextBadge,
          tickerText: nextText,
          tickerLinkText: nextLinkText,
          tickerLinkTarget: nextLinkTarget,
          tickerLinkTab: nextLinkTarget,
          tickerLinkVisible: nextLinkVisible,
          tickerItems: currentItems
        };
      });
    } else {
      setSiteData(prev => {
        const nextBadge = badgeOrObj;
        const nextText = text !== undefined ? text : prev.tickerText;
        const nextLinkTarget = linkTarget !== undefined ? linkTarget : (prev.tickerLinkTarget || prev.tickerLinkTab);
        const nextLinkText = linkText !== undefined ? linkText : (prev.tickerLinkText || 'เปิดระบบ 3D');
        const nextLinkVisible = linkVisible !== undefined ? linkVisible : (prev.tickerLinkVisible !== false);

        const currentItems = prev.tickerItems && prev.tickerItems.length > 0 ? [...prev.tickerItems] : [...INITIAL_TICKER_ITEMS];
        if (currentItems[0]) {
          currentItems[0] = {
            ...currentItems[0],
            badge: nextBadge,
            text: nextText,
            linkTarget: nextLinkTarget,
            linkText: nextLinkText
          };
        }

        return {
          ...prev,
          tickerBadge: nextBadge,
          tickerText: nextText,
          tickerLinkTab: nextLinkTarget,
          tickerLinkTarget: nextLinkTarget,
          tickerLinkText: nextLinkText,
          tickerLinkVisible: nextLinkVisible,
          tickerItems: currentItems
        };
      });
    }
  };

  // Announcement Ticker Management (Multiple Items & Marquee Settings)
  const addTickerItem = (item) => {
    const newItem = {
      id: `tick-${Date.now()}`,
      badge: item.badge?.trim() || 'ประกาศ',
      text: item.text?.trim() || '',
      linkTarget: item.linkTarget?.trim() || '',
      linkText: item.linkText?.trim() || 'ดูรายละเอียด',
      active: item.active !== false,
      priority: (siteData.tickerItems || []).length + 1,
      createdAt: new Date().toISOString()
    };
    setSiteData(prev => {
      const items = [...(prev.tickerItems || INITIAL_TICKER_ITEMS), newItem];
      const nextData = {
        ...prev,
        tickerItems: items,
        tickerBadge: items[0]?.badge || prev.tickerBadge,
        tickerText: items[0]?.text || prev.tickerText,
        tickerLinkTarget: items[0]?.linkTarget || prev.tickerLinkTarget,
        tickerLinkText: items[0]?.linkText || prev.tickerLinkText
      };
      saveSiteData(nextData);
      return nextData;
    });
    return newItem;
  };

  const updateTickerItem = (id, updates) => {
    setSiteData(prev => {
      const currentList = prev.tickerItems || INITIAL_TICKER_ITEMS;
      const updated = currentList.map(it => it.id === id ? { ...it, ...updates } : it);
      const nextData = {
        ...prev,
        tickerItems: updated,
        tickerBadge: updated[0]?.badge || prev.tickerBadge,
        tickerText: updated[0]?.text || prev.tickerText,
        tickerLinkTarget: updated[0]?.linkTarget || prev.tickerLinkTarget,
        tickerLinkText: updated[0]?.linkText || prev.tickerLinkText
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const deleteTickerItem = (id) => {
    setSiteData(prev => {
      const currentList = prev.tickerItems || INITIAL_TICKER_ITEMS;
      const filtered = currentList.filter(it => it.id !== id);
      const nextData = {
        ...prev,
        tickerItems: filtered,
        tickerBadge: filtered[0]?.badge || '',
        tickerText: filtered[0]?.text || ''
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const reorderTickerItems = (reorderedItems) => {
    setSiteData(prev => {
      const nextData = {
        ...prev,
        tickerItems: reorderedItems
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const updateTickerSettings = (settingsUpdates) => {
    setSiteData(prev => {
      const nextData = {
        ...prev,
        tickerSettings: {
          ...(prev.tickerSettings || INITIAL_TICKER_SETTINGS),
          ...settingsUpdates
        }
      };
      saveSiteData(nextData);
      return nextData;
    });
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
    setSiteData(prev => {
      const mergedSocialLinks = footerUpdates.socialLinks ? {
        ...(prev.footer?.socialLinks || {}),
        ...footerUpdates.socialLinks
      } : (prev.footer?.socialLinks || {});

      return {
        ...prev,
        footer: {
          ...prev.footer,
          ...footerUpdates,
          socialLinks: mergedSocialLinks
        },
        contactPage: footerUpdates.socialLinks ? {
          ...(prev.contactPage || {}),
          socialLinks: {
            ...(prev.contactPage?.socialLinks || {}),
            ...footerUpdates.socialLinks
          }
        } : prev.contactPage
      };
    });
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

  const saveSiteData = async (manualData) => {
    const rawData = manualData || siteDataRef.current || siteData;
    const nowIso = new Date().toISOString();
    const dataToSave = {
      ...rawData,
      lastModified: nowIso,
      updatedAt: nowIso
    };

    if (dataToSave.hardwareTiers && typeof dataToSave.hardwareTiers === 'object') {
      for (const k of Object.keys(dataToSave.hardwareTiers)) {
        const t = dataToSave.hardwareTiers[k];
        if (t && t.image && typeof t.image === 'object' && t.image.dataUrl) {
          t.image = t.image.dataUrl;
        }
      }
    }

    // Synchronously update ref and state
    siteDataRef.current = dataToSave;
    setSiteData(dataToSave);

    let localOk = false;
    let serverOk = false;
    const nowTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    // 1. Immediate LocalStorage persistence with quota safety
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      localOk = true;
    } catch (e) {
      console.warn('LocalStorage save warning:', e);
      try {
        const compactData = { ...dataToSave };
        if (Array.isArray(compactData.mediaLibrary) && compactData.mediaLibrary.length > 5) {
          compactData.mediaLibrary = compactData.mediaLibrary.slice(0, 5);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(compactData));
        localOk = true;
      } catch (e2) {}
    }

    // 2. Server Database Persistence (Volume Mount / Docker)
    try {
      setServerSyncStatus(prev => ({ ...prev, saving: true }));
      const response = await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteData: dataToSave, author: 'admin' })
      });
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      const resJson = await response.json();
      if (resJson?.success) {
        serverOk = true;
        setServerSyncStatus({
          synced: true,
          lastSynced: nowTime,
          error: null,
          saving: false
        });
        return { 
          success: true, 
          serverSaved: true, 
          timestamp: nowTime, 
          message: resJson.message 
        };
      }
    } catch (apiErr) {
      console.warn('[SiteDataContext] Server API sync warning:', apiErr.message);
      setServerSyncStatus(prev => ({ ...prev, saving: false, error: apiErr.message }));
      return { 
        success: localOk, 
        serverSaved: false, 
        timestamp: nowTime, 
        error: apiErr.message 
      };
    }

    return { success: localOk, serverSaved: serverOk, timestamp: nowTime };
  };

  const syncWithServerDatabase = async () => {
    try {
      setServerSyncStatus(prev => ({ ...prev, saving: true }));
      const res = await fetch('/api/site-data');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (result && result.success && result.siteData) {
        setSiteData(prev => {
          const merged = deepMerge(prev, result.siteData);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
        const syncTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        setServerSyncStatus({
          synced: true,
          lastSynced: syncTime,
          error: null,
          saving: false
        });
        return { success: true, message: 'ดึงข้อมูลล่าสุดจาก Server Database สำเร็จ', timestamp: syncTime };
      }
      setServerSyncStatus(prev => ({ ...prev, saving: false }));
      return { success: false, message: 'ยังไม่มีข้อมูลบนเซิร์ฟเวอร์' };
    } catch (err) {
      setServerSyncStatus(prev => ({ ...prev, saving: false, error: err.message }));
      return { success: false, message: err.message };
    }
  };

  // Catalog Handlers (Furniture, Desks, Chairs, Counters)
  const updateCatalogItem = (updatedItem) => {
    setSiteData(prev => {
      const nextData = {
        ...prev,
        catalogItems: prev.catalogItems.map(item => 
          item.type === updatedItem.type ? { ...item, ...updatedItem } : item
        )
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const addCatalogItem = (newItem) => {
    setSiteData(prev => {
      const nextData = {
        ...prev,
        catalogItems: [...prev.catalogItems, newItem]
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const deleteCatalogItem = (type) => {
    setSiteData(prev => {
      const nextData = {
        ...prev,
        catalogItems: prev.catalogItems.filter(item => item.type !== type)
      };
      saveSiteData(nextData);
      return nextData;
    });
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
    const current = siteDataRef.current || siteData;
    const nextData = {
      ...current,
      gallery: [{ ...newItem, id, slug }, ...(current.gallery || [])]
    };
    siteDataRef.current = nextData;
    setSiteData(nextData);
    saveSiteData(nextData);
    return nextData;
  };

  const updateActivityItem = (id, updatedFields) => {
    const current = siteDataRef.current || siteData;
    const nextData = {
      ...current,
      gallery: (current.gallery || []).map(item => 
        item.id === id ? { ...item, ...updatedFields } : item
      ),
      news: (current.news || []).map(item => 
        item.id === id ? { ...item, ...updatedFields } : item
      )
    };
    siteDataRef.current = nextData;
    setSiteData(nextData);
    saveSiteData(nextData);
    return nextData;
  };

  const deleteActivityItem = (id) => {
    const current = siteDataRef.current || siteData;
    const nextData = {
      ...current,
      gallery: (current.gallery || []).filter(item => item.id !== id),
      news: (current.news || []).filter(item => item.id !== id)
    };
    siteDataRef.current = nextData;
    setSiteData(nextData);
    saveSiteData(nextData);
    return nextData;
  };

  // Activity Categories & Tags Handlers
  const updateActivityCategories = (categories) => {
    setSiteData(prev => ({
      ...prev,
      activityCategories: categories
    }));
  };

  const addActivityCategory = (newCat) => {
    const id = newCat.id || (newCat.label || newCat.name || 'cat').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setSiteData(prev => ({
      ...prev,
      activityCategories: [...(prev.activityCategories || INITIAL_CATEGORIES), { ...newCat, id }]
    }));
  };

  const updateActivityCategory = (id, updates) => {
    setSiteData(prev => ({
      ...prev,
      activityCategories: (prev.activityCategories || INITIAL_CATEGORIES).map(cat => 
        cat.id === id ? { ...cat, ...updates } : cat
      )
    }));
  };

  const deleteActivityCategory = (id) => {
    setSiteData(prev => ({
      ...prev,
      activityCategories: (prev.activityCategories || INITIAL_CATEGORIES).filter(cat => cat.id !== id)
    }));
  };

  const updateArticleTags = (tags) => {
    setSiteData(prev => ({
      ...prev,
      articleTags: tags
    }));
  };

  const addArticleTag = (tag) => {
    const cleanTag = tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`;
    if (!cleanTag || cleanTag === '#') return;
    setSiteData(prev => {
      const existing = prev.articleTags || INITIAL_TAGS;
      if (existing.includes(cleanTag)) return prev;
      return {
        ...prev,
        articleTags: [...existing, cleanTag]
      };
    });
  };

  const deleteArticleTag = (tag) => {
    setSiteData(prev => ({
      ...prev,
      articleTags: (prev.articleTags || INITIAL_TAGS).filter(t => t !== tag)
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

  const updateSmtpConfig = (updates) => {
    setSiteData(prev => ({
      ...prev,
      smtpConfig: { ...(prev.smtpConfig || DEFAULT_SITE_DATA.smtpConfig), ...updates }
    }));
  };

  const updateStaffAlertEmail = (index, updates) => {
    setSiteData(prev => {
      const currentList = Array.isArray(prev.smtpConfig?.staffAlertEmails)
        ? [...prev.smtpConfig.staffAlertEmails]
        : [...DEFAULT_SITE_DATA.smtpConfig.staffAlertEmails];
      if (currentList[index]) {
        currentList[index] = { ...currentList[index], ...updates };
      }
      return {
        ...prev,
        smtpConfig: {
          ...(prev.smtpConfig || DEFAULT_SITE_DATA.smtpConfig),
          staffAlertEmails: currentList
        }
      };
    });
  };

  const updateEmailTemplate = (templateId, updates) => {
    setSiteData(prev => ({
      ...prev,
      emailTemplates: {
        ...(prev.emailTemplates || DEFAULT_SITE_DATA.emailTemplates),
        [templateId]: {
          ...(prev.emailTemplates?.[templateId] || DEFAULT_SITE_DATA.emailTemplates[templateId]),
          ...updates
        }
      }
    }));
  };

  const resetEmailTemplates = () => {
    setSiteData(prev => ({
      ...prev,
      emailTemplates: DEFAULT_SITE_DATA.emailTemplates
    }));
  };

  // Contact Page & Store Location Handlers
  const updateContactPage = (updates) => {
    setSiteData(prev => ({
      ...prev,
      contactPage: {
        ...(prev.contactPage || INITIAL_CONTACT_PAGE),
        ...updates
      }
    }));
  };

  const addTransportationItem = (item) => {
    const newItem = {
      id: item.id || `trans-${Date.now()}`,
      visible: true,
      ...item
    };
    setSiteData(prev => {
      const current = prev.contactPage?.transportation || INITIAL_CONTACT_PAGE.transportation;
      return {
        ...prev,
        contactPage: {
          ...(prev.contactPage || INITIAL_CONTACT_PAGE),
          transportation: [...current, newItem]
        }
      };
    });
    return newItem;
  };

  const updateTransportationItem = (id, updates) => {
    setSiteData(prev => {
      const current = prev.contactPage?.transportation || INITIAL_CONTACT_PAGE.transportation;
      return {
        ...prev,
        contactPage: {
          ...(prev.contactPage || INITIAL_CONTACT_PAGE),
          transportation: current.map(item => item.id === id ? { ...item, ...updates } : item)
        }
      };
    });
  };

  const deleteTransportationItem = (id) => {
    setSiteData(prev => {
      const current = prev.contactPage?.transportation || INITIAL_CONTACT_PAGE.transportation;
      return {
        ...prev,
        contactPage: {
          ...(prev.contactPage || INITIAL_CONTACT_PAGE),
          transportation: current.filter(item => item.id !== id)
        }
      };
    });
  };

  const reorderTransportationItems = (startIndex, endIndex) => {
    setSiteData(prev => {
      const current = [...(prev.contactPage?.transportation || INITIAL_CONTACT_PAGE.transportation)];
      const [removed] = current.splice(startIndex, 1);
      current.splice(endIndex, 0, removed);
      return {
        ...prev,
        contactPage: {
          ...(prev.contactPage || INITIAL_CONTACT_PAGE),
          transportation: current
        }
      };
    });
  };

  const addContactPerk = (perk) => {
    const newPerk = {
      id: perk.id || `perk-${Date.now()}`,
      visible: true,
      text: typeof perk === 'string' ? perk : (perk.text || '')
    };
    setSiteData(prev => {
      const current = prev.contactPage?.perks || INITIAL_CONTACT_PAGE.perks;
      return {
        ...prev,
        contactPage: {
          ...(prev.contactPage || INITIAL_CONTACT_PAGE),
          perks: [...current, newPerk]
        }
      };
    });
    return newPerk;
  };

  const updateContactPerk = (id, updates) => {
    setSiteData(prev => {
      const current = prev.contactPage?.perks || INITIAL_CONTACT_PAGE.perks;
      return {
        ...prev,
        contactPage: {
          ...(prev.contactPage || INITIAL_CONTACT_PAGE),
          perks: current.map(p => p.id === id ? { ...p, ...(typeof updates === 'string' ? { text: updates } : updates) } : p)
        }
      };
    });
  };

  const deleteContactPerk = (id) => {
    setSiteData(prev => {
      const current = prev.contactPage?.perks || INITIAL_CONTACT_PAGE.perks;
      return {
        ...prev,
        contactPage: {
          ...(prev.contactPage || INITIAL_CONTACT_PAGE),
          perks: current.filter(p => p.id !== id)
        }
      };
    });
  };

  // AI Guardrails & Pending Questions Handlers
  const updateAIGuardrails = (guardrailUpdates) => {
    setSiteData(prev => ({
      ...prev,
      aiGuardrails: { ...prev.aiGuardrails, ...guardrailUpdates }
    }));
  };

  const addPendingQuestion = (query, translationTh = '', lang = 'th') => {
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
        translationTh: translationTh || query,
        lang: lang || 'th',
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

  const addAuditLog = (logEntry) => {
    const now = new Date();
    const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: timeStr,
      ip: '127.0.0.1 (Localhost)',
      device: typeof navigator !== 'undefined' ? `${navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'} / Windows` : 'Web',
      status: logEntry.status || 'info',
      adminUser: logEntry.adminUser || 'admin',
      ...logEntry
    };
    setSiteData(prev => ({
      ...prev,
      adminAuditLogs: [newLog, ...(prev.adminAuditLogs || [])].slice(0, 100)
    }));
  };

  const clearAuditLogs = () => {
    setSiteData(prev => ({
      ...prev,
      adminAuditLogs: []
    }));
  };

  // Tournament Registration Applications Handlers
  const addTournamentApplication = (applicationData) => {
    const now = new Date();
    const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newApp = {
      id: `app-${Date.now()}`,
      submittedAt: timeStr,
      status: applicationData.status || 'Pending',
      ...applicationData
    };

    setSiteData(prev => {
      let updatedTournaments = prev.tournaments || [];
      // If manually added as Confirmed, sync into tournament teams immediately
      if (newApp.status === 'Confirmed' && newApp.tournamentId) {
        updatedTournaments = updatedTournaments.map(t => {
          if (t.id === newApp.tournamentId) {
            const currentTeams = t.teams || [];
            const newConfirmedTeam = {
              id: `team-${Date.now()}`,
              name: newApp.teamName,
              tag: newApp.teamTag || newApp.teamName.slice(0, 3).toUpperCase(),
              logo: newApp.logo || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
              seed: currentTeams.length + 1,
              status: 'Confirmed',
              captain: `${newApp.captainName || 'Captain'} (กัปตันทีม)`,
              captainPhone: newApp.captainPhone || '',
              captainDiscord: newApp.captainDiscord || '',
              players: (newApp.players || []).map(p => typeof p === 'string' ? p : (p.ign || p.realName || 'Player')),
              substitutes: (newApp.substitutes || []).map(s => typeof s === 'string' ? s : (s.ign || s.realName || 'Sub')),
              wins: 0,
              losses: 0
            };
            return {
              ...t,
              teams: [...currentTeams, newConfirmedTeam]
            };
          }
          return t;
        });
      }

      return {
        ...prev,
        tournamentApplications: [newApp, ...(prev.tournamentApplications || [])],
        tournaments: updatedTournaments
      };
    });

    addAuditLog({
      action: 'TEAM_REGISTERED',
      adminUser: 'Admin/System',
      status: 'info',
      details: `ทีม ${newApp.teamName} (${newApp.teamTag || ''}) ลงทะเบียนแข่งขัน ${newApp.tournamentTitle || ''}`
    });

    return newApp;
  };

  const updateTournamentApplication = (applicationId, updatedData) => {
    setSiteData(prev => {
      const apps = prev.tournamentApplications || [];
      const targetApp = apps.find(a => a.id === applicationId);
      if (!targetApp) return prev;

      const mergedApp = { ...targetApp, ...updatedData, updatedAt: new Date().toLocaleTimeString('th-TH') };
      const updatedApps = apps.map(a => a.id === applicationId ? mergedApp : a);

      let updatedTournaments = prev.tournaments || [];
      if (mergedApp.tournamentId) {
        updatedTournaments = updatedTournaments.map(t => {
          if (t.id === mergedApp.tournamentId) {
            const currentTeams = t.teams || [];
            // If team already exists in t.teams, update it
            const existingIdx = currentTeams.findIndex(tm => tm.name.toLowerCase() === targetApp.teamName.toLowerCase() || tm.name.toLowerCase() === mergedApp.teamName.toLowerCase());
            if (existingIdx !== -1) {
              const updatedTeams = [...currentTeams];
              updatedTeams[existingIdx] = {
                ...updatedTeams[existingIdx],
                name: mergedApp.teamName,
                tag: mergedApp.teamTag || mergedApp.teamName.slice(0, 3).toUpperCase(),
                logo: mergedApp.logo || updatedTeams[existingIdx].logo,
                captain: `${mergedApp.captainName} (กัปตันทีม)`,
                captainPhone: mergedApp.captainPhone,
                captainDiscord: mergedApp.captainDiscord,
                players: (mergedApp.players || []).map(p => typeof p === 'string' ? p : (p.ign || p.realName || 'Player')),
                substitutes: (mergedApp.substitutes || []).map(s => typeof s === 'string' ? s : (s.ign || s.realName || 'Sub'))
              };
              return { ...t, teams: updatedTeams };
            } else if (mergedApp.status === 'Confirmed') {
              // Add to teams if now confirmed and not present
              const newConfirmedTeam = {
                id: `team-${Date.now()}`,
                name: mergedApp.teamName,
                tag: mergedApp.teamTag || mergedApp.teamName.slice(0, 3).toUpperCase(),
                logo: mergedApp.logo || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
                seed: currentTeams.length + 1,
                status: 'Confirmed',
                captain: `${mergedApp.captainName} (กัปตันทีม)`,
                captainPhone: mergedApp.captainPhone,
                captainDiscord: mergedApp.captainDiscord,
                players: (mergedApp.players || []).map(p => typeof p === 'string' ? p : (p.ign || p.realName || 'Player')),
                substitutes: (mergedApp.substitutes || []).map(s => typeof s === 'string' ? s : (s.ign || s.realName || 'Sub')),
                wins: 0,
                losses: 0
              };
              return { ...t, teams: [...currentTeams, newConfirmedTeam] };
            }
          }
          return t;
        });
      }

      return {
        ...prev,
        tournamentApplications: updatedApps,
        tournaments: updatedTournaments
      };
    });

    addAuditLog({
      action: 'UPDATE_TEAM_DATA',
      adminUser: 'Admin',
      status: 'info',
      details: `แก้ไขข้อมูลทีม ${updatedData.teamName || applicationId}`
    });
  };

  const updateApplicationStatus = (applicationId, newStatus, adminNotes = '') => {
    setSiteData(prev => {
      const apps = prev.tournamentApplications || [];
      const targetApp = apps.find(a => a.id === applicationId);
      if (!targetApp) return prev;

      const updatedApps = apps.map(a => 
        a.id === applicationId 
          ? { ...a, status: newStatus, adminNotes: adminNotes || a.adminNotes, reviewedAt: new Date().toLocaleTimeString('th-TH') } 
          : a
      );

      // If approved (Confirmed), also automatically register team into tournament.teams
      let updatedTournaments = prev.tournaments || [];
      if (newStatus === 'Confirmed' && targetApp.tournamentId) {
        updatedTournaments = updatedTournaments.map(t => {
          if (t.id === targetApp.tournamentId) {
            const currentTeams = t.teams || [];
            if (!currentTeams.some(tm => tm.name.toLowerCase() === targetApp.teamName.toLowerCase())) {
              const newConfirmedTeam = {
                id: `team-${Date.now()}`,
                name: targetApp.teamName,
                tag: targetApp.teamTag || targetApp.teamName.slice(0, 3).toUpperCase(),
                logo: targetApp.logo || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
                seed: currentTeams.length + 1,
                status: 'Confirmed',
                captain: `${targetApp.captainName} (กัปตันทีม)`,
                captainPhone: targetApp.captainPhone,
                captainDiscord: targetApp.captainDiscord,
                players: (targetApp.players || []).map(p => typeof p === 'string' ? p : (p.ign || p.realName || 'Player')),
                substitutes: (targetApp.substitutes || []).map(s => typeof s === 'string' ? s : (s.ign || s.realName || 'Sub')),
                wins: 0,
                losses: 0
              };
              return {
                ...t,
                teams: [...currentTeams, newConfirmedTeam]
              };
            }
          }
          return t;
        });
      }

      return {
        ...prev,
        tournamentApplications: updatedApps,
        tournaments: updatedTournaments
      };
    });

    addAuditLog({
      action: `APPLICATION_${newStatus.toUpperCase()}`,
      status: newStatus === 'Confirmed' ? 'success' : newStatus === 'Rejected' ? 'warning' : 'info',
      details: `ปรับสถานะใบสมัคร ${applicationId} เป็น ${newStatus}`
    });
  };

  const deleteTournamentApplication = (applicationId) => {
    setSiteData(prev => ({
      ...prev,
      tournamentApplications: (prev.tournamentApplications || []).filter(a => a.id !== applicationId)
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
    const slug = newItem.slug || newItem.seo?.slug || (newItem.title ? newItem.title.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-').replace(/(^-|-$)/g, '') : id);
    const current = siteDataRef.current || siteData;
    const nextData = {
      ...current,
      tournaments: [...(current.tournaments || []), { 
        ...newItem, 
        id, 
        slug,
        seo: { ...(newItem.seo || {}), slug: newItem.seo?.slug || slug }
      }]
    };
    siteDataRef.current = nextData;
    setSiteData(nextData);
    saveSiteData(nextData);
    return nextData;
  };

  const updateTournament = (id, updates) => {
    const current = siteDataRef.current || siteData;
    const nextData = {
      ...current,
      tournaments: (current.tournaments || []).map(t => {
        if (t.id !== id) return t;
        const newSlug = updates.slug || updates.seo?.slug || t.slug || t.seo?.slug;
        return { 
          ...t, 
          ...updates, 
          slug: newSlug,
          seo: { ...(t.seo || {}), ...(updates.seo || {}), slug: newSlug }
        };
      })
    };
    siteDataRef.current = nextData;
    setSiteData(nextData);
    saveSiteData(nextData);
    return nextData;
  };

  const deleteTournament = (id) => {
    const current = siteDataRef.current || siteData;
    const nextData = {
      ...current,
      tournaments: (current.tournaments || []).filter(t => t.id !== id)
    };
    siteDataRef.current = nextData;
    setSiteData(nextData);
    saveSiteData(nextData);
    return nextData;
  };

  const updateTournamentBracketMatch = (tournamentId, matchId, matchUpdates) => {
    const current = siteDataRef.current || siteData;
    const tourneyList = current.tournaments || [];
    const updatedTournaments = tourneyList.map(tour => {
      if (tour.id !== tournamentId) return tour;
      const currentMatches = tour.bracketMatches || [];
      const matchIdx = currentMatches.findIndex(m => m.id === matchId);
      if (matchIdx === -1) return tour;

      const targetMatch = currentMatches[matchIdx];
      const updatedMatch = { ...targetMatch, ...matchUpdates };
      let newMatches = [...currentMatches];
      newMatches[matchIdx] = updatedMatch;

      // Auto Advance Winner to nextMatchId if set
      if (updatedMatch.nextMatchId && updatedMatch.nextMatchSlot) {
        const winningTeam = updatedMatch.teamA?.isWinner 
          ? updatedMatch.teamA 
          : (updatedMatch.teamB?.isWinner ? updatedMatch.teamB : null);

        if (winningTeam) {
          const nextMatchIdx = newMatches.findIndex(m => m.id === updatedMatch.nextMatchId);
          if (nextMatchIdx !== -1) {
            const nextMatch = newMatches[nextMatchIdx];
            newMatches[nextMatchIdx] = {
              ...nextMatch,
              [updatedMatch.nextMatchSlot]: {
                ...winningTeam,
                score: 0,
                isWinner: false
              }
            };
          }
        }
      }

      return {
        ...tour,
        bracketMatches: newMatches
      };
    });

    const nextData = {
      ...current,
      tournaments: updatedTournaments
    };
    siteDataRef.current = nextData;
    setSiteData(nextData);
    saveSiteData(nextData);
    return nextData;
  };

  // Arena Seat Booking Handlers
  const createArenaBooking = (bookingData) => {
    const newId = `BKG-${Date.now()}`;
    const bookingCode = `GLP-SEAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: newId,
      bookingCode,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      ...bookingData
    };

    setSiteData(prev => ({
      ...prev,
      arenaBookings: [newBooking, ...(prev.arenaBookings || [])]
    }));

    return newBooking;
  };

  const updateArenaBookingStatus = (bookingId, newStatus) => {
    setSiteData(prev => ({
      ...prev,
      arenaBookings: (prev.arenaBookings || []).map(b => 
        b.id === bookingId ? { ...b, status: newStatus, updatedAt: new Date().toISOString() } : b
      )
    }));
  };

  const cancelArenaBooking = (bookingId) => {
    updateArenaBookingStatus(bookingId, 'Cancelled');
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
    setSiteData(prev => {
      const updatedZones = (prev.venueZones || []).map(z => {
        if (z.id === id) {
          const nextZone = { ...z, ...updates };
          if (Array.isArray(nextZone.images) && nextZone.images.length > 0 && nextZone.images[0]?.url) {
            nextZone.image = nextZone.images[0].url;
          }
          return nextZone;
        }
        return z;
      });
      const nextData = {
        ...prev,
        venueZones: updatedZones
      };
      saveSiteData(nextData);
      return nextData;
    });
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

  // Company Profile & Corporate Galleries Handlers
  const updateFounder = (updates) => {
    setSiteData(prev => ({
      ...prev,
      founder: {
        ...(prev.founder || INITIAL_FOUNDER),
        ...updates
      }
    }));
  };

  const addCompanyGalleryPhoto = (galleryKey, photo) => {
    const newPhoto = {
      id: photo.id || `cg-${Date.now()}`,
      title: photo.title?.trim() || 'ภาพกิจกรรมองค์กร',
      caption: photo.caption?.trim() || '',
      tag: photo.tag?.trim() || 'GALLERY',
      partner: photo.partner?.trim() || '',
      year: photo.year?.trim() || '',
      url: photo.url?.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      createdAt: new Date().toISOString()
    };
    setSiteData(prev => {
      const founderObj = prev.founder || INITIAL_FOUNDER;
      const currentList = Array.isArray(founderObj[galleryKey]) ? [...founderObj[galleryKey]] : [];
      return {
        ...prev,
        founder: {
          ...founderObj,
          [galleryKey]: [newPhoto, ...currentList]
        }
      };
    });
    return newPhoto;
  };

  const deleteCompanyGalleryPhoto = (galleryKey, photoId) => {
    setSiteData(prev => {
      const founderObj = prev.founder || INITIAL_FOUNDER;
      const currentList = Array.isArray(founderObj[galleryKey]) ? founderObj[galleryKey] : [];
      return {
        ...prev,
        founder: {
          ...founderObj,
          [galleryKey]: currentList.filter(p => p.id !== photoId)
        }
      };
    });
  };

  const updateCompanyGalleryPhoto = (galleryKey, photoId, updates) => {
    setSiteData(prev => {
      const founderObj = prev.founder || INITIAL_FOUNDER;
      const currentList = Array.isArray(founderObj[galleryKey]) ? founderObj[galleryKey] : [];
      return {
        ...prev,
        founder: {
          ...founderObj,
          [galleryKey]: currentList.map(p => p.id === photoId ? { ...p, ...updates } : p)
        }
      };
    });
  };

  // Official Partners Management Handlers
  const addPartner = (partner) => {
    const newPartner = {
      id: partner.id || `partner-${Date.now()}`,
      name: partner.name?.trim() || 'พันธมิตร',
      tier: partner.tier?.trim() || 'Official Partner',
      icon: partner.icon || 'Zap',
      logo: partner.logo?.trim() || '',
      website: partner.website?.trim() || ''
    };
    setSiteData(prev => {
      const founderObj = prev.founder || INITIAL_FOUNDER;
      const currentList = Array.isArray(founderObj.partners) ? [...founderObj.partners] : [...INITIAL_FOUNDER.partners];
      return {
        ...prev,
        founder: {
          ...founderObj,
          partners: [...currentList, newPartner]
        }
      };
    });
    return newPartner;
  };

  const deletePartner = (partnerIdOrName) => {
    setSiteData(prev => {
      const founderObj = prev.founder || INITIAL_FOUNDER;
      const currentList = Array.isArray(founderObj.partners) ? founderObj.partners : INITIAL_FOUNDER.partners;
      return {
        ...prev,
        founder: {
          ...founderObj,
          partners: currentList.filter(p => (p.id || p.name) !== partnerIdOrName && p.name !== partnerIdOrName)
        }
      };
    });
  };

  const updatePartner = (partnerIdOrName, updates) => {
    setSiteData(prev => {
      const founderObj = prev.founder || INITIAL_FOUNDER;
      const currentList = Array.isArray(founderObj.partners) ? founderObj.partners : INITIAL_FOUNDER.partners;
      return {
        ...prev,
        founder: {
          ...founderObj,
          partners: currentList.map(p => ((p.id || p.name) === partnerIdOrName || p.name === partnerIdOrName) ? { ...p, ...updates } : p)
        }
      };
    });
  };

  const movePartner = (partnerIdOrName, direction) => {
    setSiteData(prev => {
      const founderObj = prev.founder || INITIAL_FOUNDER;
      const currentList = Array.isArray(founderObj.partners) ? [...founderObj.partners] : [...INITIAL_FOUNDER.partners];
      const index = currentList.findIndex(p => (p.id || p.name) === partnerIdOrName || p.name === partnerIdOrName);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' || direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentList.length) return prev;
      const item = currentList.splice(index, 1)[0];
      currentList.splice(targetIndex, 0, item);
      return {
        ...prev,
        founder: {
          ...founderObj,
          partners: currentList
        }
      };
    });
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

  // Esport Organizer Games Handlers (Logo & Game Names)
  const updateOrganizerGames = (newGames) => {
    setSiteData(prev => {
      const updated = { ...prev, organizerGames: newGames };
      saveSiteData(updated);
      return updated;
    });
  };

  const addOrganizerGame = (gameData) => {
    setSiteData(prev => {
      const existing = prev.organizerGames || DEFAULT_ORGANIZER_GAMES;
      const newGame = {
        id: `game-${Date.now()}`,
        name: gameData.name || 'ชื่อเกมใหม่',
        logo: gameData.logo || '/game-logos/other.svg',
        ...gameData
      };
      // Keep "other" at the very end
      const withoutOther = existing.filter(g => g.id !== 'other');
      const otherItem = existing.find(g => g.id === 'other') || { id: 'other', name: 'เกมอื่นๆ', logo: '/game-logos/other.svg', isOther: true };
      const updatedGames = [...withoutOther, newGame, otherItem];
      const updated = { ...prev, organizerGames: updatedGames };
      saveSiteData(updated);
      return updated;
    });
  };

  const updateOrganizerGame = (id, updates) => {
    setSiteData(prev => {
      const existing = prev.organizerGames || DEFAULT_ORGANIZER_GAMES;
      const updatedGames = existing.map(g => g.id === id ? { ...g, ...updates } : g);
      const updated = { ...prev, organizerGames: updatedGames };
      saveSiteData(updated);
      return updated;
    });
  };

  const deleteOrganizerGame = (id) => {
    setSiteData(prev => {
      const existing = prev.organizerGames || DEFAULT_ORGANIZER_GAMES;
      const updatedGames = existing.filter(g => g.id !== id);
      const updated = { ...prev, organizerGames: updatedGames };
      saveSiteData(updated);
      return updated;
    });
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

  // Hardware Specs (Tiers) & Infrastructure Pricing Management
  const updateHardwareTier = (tierId, updates) => {
    const current = siteDataRef.current || siteData;
    const currentTiers = current?.hardwareTiers || INITIAL_TIERS;
    const nextData = {
      ...current,
      hardwareTiers: {
        ...currentTiers,
        [tierId]: {
          ...(currentTiers[tierId] || {}),
          ...updates,
          id: tierId
        }
      }
    };
    saveSiteData(nextData);
  };

  const addHardwareTier = (newTier) => {
    const current = siteDataRef.current || siteData;
    const id = newTier.id || `tier-${Date.now()}`;
    const nextData = {
      ...current,
      hardwareTiers: {
        ...(current?.hardwareTiers || INITIAL_TIERS),
        [id]: {
          ...newTier,
          id
        }
      }
    };
    saveSiteData(nextData);
    return id;
  };

  const deleteHardwareTier = (tierId) => {
    const current = siteDataRef.current || siteData;
    const copy = { ...(current?.hardwareTiers || INITIAL_TIERS) };
    delete copy[tierId];
    const nextData = {
      ...current,
      hardwareTiers: copy
    };
    saveSiteData(nextData);
  };

  const resetHardwareTiers = () => {
    const current = siteDataRef.current || siteData;
    const nextData = {
      ...current,
      hardwareTiers: INITIAL_TIERS
    };
    saveSiteData(nextData);
  };

  const updateFixedInfrastructure = (updates) => {
    setSiteData(prev => {
      const nextData = {
        ...prev,
        fixedInfrastructure: {
          ...(prev.fixedInfrastructure || INITIAL_FIXED_INFRASTRUCTURE),
          ...updates
        }
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const resetFixedInfrastructure = () => {
    setSiteData(prev => {
      const nextData = {
        ...prev,
        fixedInfrastructure: INITIAL_FIXED_INFRASTRUCTURE
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const updateCatalogItemCost = (itemId, newCost) => {
    setSiteData(prev => {
      const nextData = {
        ...prev,
        catalogItems: (prev.catalogItems || INITIAL_CATALOG).map(item =>
          item.id === itemId ? { ...item, baseCost: Number(newCost) || 0 } : item
        )
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  // Interior Style Themes Handlers
  const updateInteriorTheme = (id, updates) => {
    setSiteData(prev => {
      const list = Array.isArray(prev.interiorThemes) ? [...prev.interiorThemes] : [...INITIAL_INTERIOR_THEMES];
      const idx = list.findIndex(t => t.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
      }
      const nextData = { ...prev, interiorThemes: list };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const addInteriorTheme = (newTheme) => {
    setSiteData(prev => {
      const list = Array.isArray(prev.interiorThemes) ? [...prev.interiorThemes] : [...INITIAL_INTERIOR_THEMES];
      const id = newTheme.id || `theme-${Date.now()}`;
      const nextData = {
        ...prev,
        interiorThemes: [...list, { ...newTheme, id }]
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const deleteInteriorTheme = (id) => {
    setSiteData(prev => {
      const list = Array.isArray(prev.interiorThemes) ? [...prev.interiorThemes] : [...INITIAL_INTERIOR_THEMES];
      const nextData = {
        ...prev,
        interiorThemes: list.filter(t => t.id !== id)
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const resetInteriorThemes = () => {
    setSiteData(prev => {
      const nextData = {
        ...prev,
        interiorThemes: INITIAL_INTERIOR_THEMES
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  // SEO & Marketing Tracking Handlers
  const updateSeoMarketingConfig = (updates) => {
    setSiteData(prev => ({
      ...prev,
      seoMarketingConfig: {
        ...(prev.seoMarketingConfig || INITIAL_SEO_MARKETING_CONFIG),
        ...updates
      }
    }));
  };

  const resetSeoMarketingConfig = () => {
    setSiteData(prev => ({
      ...prev,
      seoMarketingConfig: INITIAL_SEO_MARKETING_CONFIG
    }));
  };

  // Admin Staff & RBAC Handlers
  const addAdminStaff = (staff) => {
    const now = new Date();
    const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const newStaff = {
      id: staff.id || `staff-${Date.now()}`,
      createdAt: timeStr,
      status: 'active',
      isMaster: false,
      avatarColor: staff.avatarColor || '#2563eb',
      permissions: staff.permissions || ['tourney-apps'],
      ...staff
    };
    setSiteData(prev => ({
      ...prev,
      adminStaffList: [...(prev.adminStaffList || INITIAL_ADMIN_STAFF_LIST), newStaff]
    }));
    return newStaff;
  };

  const updateAdminStaff = (id, updates) => {
    setSiteData(prev => ({
      ...prev,
      adminStaffList: (prev.adminStaffList || INITIAL_ADMIN_STAFF_LIST).map(s => 
        s.id === id ? { ...s, ...updates } : s
      )
    }));
  };

  const deleteAdminStaff = (id) => {
    setSiteData(prev => ({
      ...prev,
      adminStaffList: (prev.adminStaffList || INITIAL_ADMIN_STAFF_LIST).filter(s => s.id !== id || s.isMaster)
    }));
  };

  const toggleAdminStaffStatus = (id) => {
    setSiteData(prev => ({
      ...prev,
      adminStaffList: (prev.adminStaffList || INITIAL_ADMIN_STAFF_LIST).map(s => {
        if (s.id === id && !s.isMaster) {
          return { ...s, status: s.status === 'active' ? 'suspended' : 'active' };
        }
        return s;
      })
    }));
  };

  // Equipment Products Management Functions
  const updateEquipmentProduct = (productId, updates) => {
    setSiteData(prev => {
      const currentList = Array.isArray(prev.equipmentProducts) ? prev.equipmentProducts : EQUIPMENT_PRODUCTS;
      const nextList = currentList.map(p => p.id === productId ? { ...p, ...updates } : p);
      const nextData = {
        ...prev,
        equipmentProducts: nextList
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const addEquipmentProduct = (newProduct) => {
    setSiteData(prev => {
      const currentList = Array.isArray(prev.equipmentProducts) ? prev.equipmentProducts : EQUIPMENT_PRODUCTS;
      const nextList = [newProduct, ...currentList];
      const nextData = {
        ...prev,
        equipmentProducts: nextList
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const deleteEquipmentProduct = (productId) => {
    setSiteData(prev => {
      const currentList = Array.isArray(prev.equipmentProducts) ? prev.equipmentProducts : EQUIPMENT_PRODUCTS;
      const nextList = currentList.filter(p => p.id !== productId);
      const nextData = {
        ...prev,
        equipmentProducts: nextList
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const resetEquipmentProducts = () => {
    setSiteData(prev => {
      const nextData = {
        ...prev,
        equipmentProducts: EQUIPMENT_PRODUCTS
      };
      saveSiteData(nextData);
      return nextData;
    });
  };

  const value = {
    siteData,
    setSiteData,
    updateSeoMarketingConfig,
    resetSeoMarketingConfig,
    addAdminStaff,
    updateAdminStaff,
    deleteAdminStaff,
    toggleAdminStaffStatus,
    updateHardwareTier,
    addHardwareTier,
    deleteHardwareTier,
    resetHardwareTiers,
    updateFixedInfrastructure,
    resetFixedInfrastructure,
    updateCatalogItemCost,
    updateTicker,
    addTickerItem,
    updateTickerItem,
    deleteTickerItem,
    reorderTickerItems,
    updateTickerSettings,
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
    updateActivityCategories,
    addActivityCategory,
    updateActivityCategory,
    deleteActivityCategory,
    updateArticleTags,
    addArticleTag,
    deleteArticleTag,
    updateNewsItem,
    addNewsItem,
    deleteNewsItem,
    updateTournament,
    addTournament,
    deleteTournament,
    updateTournamentBracketMatch,
    createArenaBooking,
    updateArenaBookingStatus,
    cancelArenaBooking,
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
    addAuditLog,
    clearAuditLogs,
    addTournamentApplication,
    updateTournamentApplication,
    updateApplicationStatus,
    deleteTournamentApplication,
    updateERPData,
    updateWebhooks,
    updateSmtpConfig,
    updateStaffAlertEmail,
    updateEmailTemplate,
    resetEmailTemplates,
    updateContactPage,
    addTransportationItem,
    updateTransportationItem,
    deleteTransportationItem,
    reorderTransportationItems,
    addContactPerk,
    updateContactPerk,
    deleteContactPerk,
    updateHeaderCta,
    addNavLink,
    deleteNavLink,
    addMediaItem,
    deleteMediaItem,
    updateFounder,
    addCompanyGalleryPhoto,
    deleteCompanyGalleryPhoto,
    updateCompanyGalleryPhoto,
    addPartner,
    deletePartner,
    updatePartner,
    movePartner,
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
    updateInteriorTheme,
    addInteriorTheme,
    deleteInteriorTheme,
    resetInteriorThemes,
    updateOrganizerGames,
    addOrganizerGame,
    updateOrganizerGame,
    deleteOrganizerGame,
    saveSiteData,
    syncWithServerDatabase,
    serverSyncStatus,
    resetToDefaults,
    updateEquipmentProduct,
    addEquipmentProduct,
    deleteEquipmentProduct,
    resetEquipmentProducts
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
