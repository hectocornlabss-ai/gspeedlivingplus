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
    title: 'เวลาเปิด-ปิด และระบบอำนวยความสะดวก',
    tags: ['เวลาเปิด', '24ชั่วโมง', 'ที่จอดรถ', 'ห้องน้ำ', 'แอร์'],
    content: 'G-Speed Esport Arena เปิดให้บริการ 24 ชั่วโมง ทุกวัน ตลอดทั้งปี ไม่มีวันหยุด แอร์เย็นฉ่ำ 24 ชม. ด้วยระบบกรองอากาศ PM2.5 มีระบบเน็ตเวิร์กความเร็วสูง 10Gbps Dual Fiber เส้นทางคู่ ค่า Ping ในประเทศต่ำกว่า 3ms และมีที่จอดรถรองรับทั้งมอเตอร์ไซค์และรถยนต์'
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
    title: 'การจัดแข่งขันทัวร์นาเมนต์และเช่าสถานที่',
    tags: ['แข่งเกม', 'ทัวร์นาเมนต์', 'เวที', 'เช่าสถานที่', 'ถ่ายทอดสด'],
    content: 'ร้านมีเวที 5v5 Tournament Stage พร้อมระบบถ่ายทอดสด Live Streaming จอ 4K LED Wall ขนาดยักษ์ และโต๊ะพากย์แคสเตอร์ รองรับการจัดแข่งทั้งเกม VALORANT, ROV, PUBG, CS2 สำหรับค่ายเกม สถาบันการศึกษา หรือองค์กรที่ต้องการเช่าจัดแข่งขัน ติดต่อทีมงานได้ที่อีเมล partner@gspeedarena.com หรือโทร 02-888-9999'
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
    content: 'สำหรับเจ้าของอาคารหรือผู้สนใจเปิดร้านเกม สามารถแจ้งขนาดพื้นที่และงบประมาณเพื่อให้แอดมินช่วยประเมินผังร้านและคำนวณงบเบื้องต้นได้ฟรี ทางเราพร้อมให้คำปรึกษา แนะนำสเปกเครื่อง และมีทีมวิศวกรพร้อมเข้าสำรวจหน้างานจริง ติดต่อสอบถามเพิ่มเติมได้ที่สายด่วน: 02-888-9999 หรือ LINE Official: @gspeedarena เปิดให้บริการตลอด 24 ชั่วโมง'
  }
];

// Initial Navigation Links
export const INITIAL_NAV_LINKS = [
  { id: 'nav-arena', label: 'หน้าแรก & กิจกรรม', target: 'arena', visible: true },
  { id: 'nav-company', label: 'ข้อมูลบริษัท & พาร์ตเนอร์', target: 'company', visible: true },
  { id: 'nav-franchise', label: 'จำลองผังร้าน 3D', target: 'franchise', visible: true }
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
    metaTitle: 'G-SPEED ESPORT ARENA | ศูนย์อีสปอร์ตครบวงจร & ระบบแฟรนไชส์จัดผังร้านอัจฉริยะ',
    metaDescription: 'ศูนย์รวมอีสปอร์ตครบวงจร สเปกคอมไฮเอนด์ RTX 40 Series จอ 360Hz เวทีแข่งมาตรฐานสากล พร้อมระบบจำลองผังร้านแฟรนไชส์ 3D',
    keywords: 'ร้านเกม, อีสปอร์ต, แฟรนไชส์ร้านเกม, G-Speed Arena, GLP, จัดผังร้านเกม 3D, RTX 4090, BenQ 360Hz',
    ogImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    twitterHandle: '@GSpeedArena'
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
    badge: 'THE NEXT-GEN ESPORT ARENA & FRANCHISE HUB',
    title: 'ศูนย์รวมอีสปอร์ตครบวงจร & พื้นที่ประลองเกมมาตรฐานสากล',
    subtitle: 'สัมผัสประสบการณ์เกมมิ่งระดับเวิลด์คลาสด้วยเครื่องสเปกไฮเอนด์ RTX 40 Series จอ 360Hz และเวทีแข่งขันมาตรฐาน Pro Circuit พร้อมระบบคำนวณและจำลองผังร้านแฟรนไชส์อัจฉริยะ',
    primaryCta: 'สำรวจกิจกรรม & ทัวร์นาเมนต์',
    primaryCtaLink: '#activities',
    secondaryCta: 'จำลองผังร้าน 3D แฟรนไชส์',
    secondaryCtaLink: '#franchise',
    bgColor: '#ffffff',
    bgOverlayImage: '',
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
      bgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
    },
    bannerRight: {
      badge: 'GLP BLOG & NEWS',
      title: 'บทความ ข่าวสาร & ไฮไลต์เกม',
      desc: 'เกาะติดผลการแข่งขัน ทริกการเล่น สเปกอุปกรณ์ใหม่ และประกาศจากทางร้าน',
      linkText: 'อ่านบทความล่าสุด',
      linkTarget: '#news',
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
    }
  },
  tournamentsSection: {
    badge: 'TOURNAMENTS & COMMUNITY EVENTS',
    title: 'ปฏิทินการแข่งขัน อีสปอร์ตประจำเดือน',
    subtitle: 'ร่วมชิงเงินรางวัลรวมกว่าหลายแสนบาท พิสูจน์ฝีมือบนเวที LAN Final ถ่ายทอดสดสู่สายตาแฟนเกมทั่วประเทศ',
    bgColor: '#ffffff'
  },
  zonesSection: {
    badge: 'VENUE ATMOSPHERE & ZONES',
    title: 'บรรยากาศและโซนการให้บริการ GLP ESPORTS',
    subtitle: 'สัมผัสความพรีเมียมที่ออกแบบมาสำหรับเกมเมอร์ทุกสไตล์ ตั้งแต่ผู้เล่นทั่วไป สตรีมเมอร์ ไปจนถึงการประลองระดับแชมป์เปียนชิป',
    bgColor: '#f8fafc'
  },
  newsSection: {
    badge: 'ARTICLES & UPDATES',
    title: 'บทความและข่าวสาร GLP ESPORTS',
    subtitle: 'อัปเดตความเคลื่อนไหววงการอีสปอร์ต เทคโนโลยีใหม่ และสรุปผลการแข่งขันที่จัดขึ้นในร้าน',
    bgColor: '#ffffff'
  },
  franchiseBanner: {
    badge: 'G-SPEED FRANCHISE & INTERIOR PLANNER',
    heading: 'อยากมีร้านเกมอีสปอร์ตสเปกเทพเป็นของตัวเอง?',
    desc: 'เพียงแค่คุณมีพื้นที่หรืออาคาร เรามีระบบ Interior Floor Plan Configurator ช่วยจำลองผังร้าน 2D สเกลจริง จัดวางโต๊ะคอมพิวเตอร์ เวทีแข่งขัน เคาน์เตอร์ และคำนวณต้นทุน สเปกอุปกรณ์ ระยะเวลาคืนทุน (ROI) และเวลาติดตั้งให้ทันที!',
    buttonText: 'เริ่มออกแบบผังร้าน & ประเมินงบประมาณทันที',
    buttonLink: 'franchise',
    bgColor: '#1e3a8a',
    bgImage: ''
  },
  venueZones: INITIAL_ZONES,
  tournaments: INITIAL_TOURNAMENTS,
  gallery: INITIAL_GALLERY,
  news: INITIAL_NEWS,
  founder: INITIAL_FOUNDER,
  catalogItems: INITIAL_CATALOG,
  hardwareTiers: INITIAL_TIERS,
  ragKnowledge: INITIAL_RAG_KNOWLEDGE,
  openRouterSettings: {
    apiKey: '',
    proxyUrl: '',
    useSecureProxy: false,
    model: 'google/gemini-flash-3.8',
    temperature: 0.7,
    maxTokens: 1024,
    systemPrompt: 'คุณคือผู้ช่วย AI ประจำศูนย์ G-Speed Esport Arena ตอบคำถามเกี่ยวกับบริการร้านเกม อัตราค่าชั่วโมง สเปกคอม และระบบแฟรนไชส์อย่างสุภาพและถูกต้อง',
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
    outOfScopeReply: 'ขออภัยด้วยครับ ผมเป็นผู้ช่วย AI ประจำศูนย์ G-Speed Esport Arena จึงสามารถตอบได้เฉพาะข้อมูลและบริการของทางร้านเท่านั้นครับ เช่น อัตราค่าบริการ, สเปกคอมพิวเตอร์, การจองห้อง VIP, เมนูอาหาร หรือการลงทุนแฟรนไชส์ หากมีข้อสงสัยเกี่ยวกับร้าน สามารถสอบถามได้ทันทีครับ',
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
    phone: '02-888-9999 / 089-777-6655',
    email: 'contact@gspeedarena.com',
    line: '@gspeedarena',
    address: '99/1 ซอยรามคำแหง 24 แยก 14 แขวงหัวหมาก เขตบางกะปิ กรุงเทพมหานคร 10240',
    copyright: '© 2026 G-Speed Esport Arena (GLP Living Plus). All Rights Reserved.',
    socialLinks: {
      facebook: 'https://facebook.com/gspeedesport',
      discord: 'https://discord.gg/gspeed',
      youtube: 'https://youtube.com/@gspeedarena',
      steam: 'https://steamcommunity.com/groups/gspeed'
    }
  }
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

        // Ensure array types are intact
        if (!Array.isArray(merged.gallery)) merged.gallery = INITIAL_GALLERY;
        if (!Array.isArray(merged.news)) merged.news = INITIAL_NEWS;
        if (!Array.isArray(merged.catalogItems)) merged.catalogItems = INITIAL_CATALOG;
        if (!Array.isArray(merged.hardwareTiers)) merged.hardwareTiers = INITIAL_TIERS;
        if (!Array.isArray(merged.tournaments)) merged.tournaments = INITIAL_TOURNAMENTS;
        if (!Array.isArray(merged.venueZones)) merged.venueZones = INITIAL_ZONES;
        if (!Array.isArray(merged.navLinks)) merged.navLinks = INITIAL_NAV_LINKS;
        if (!Array.isArray(merged.n8nWorkflows)) merged.n8nWorkflows = DEFAULT_SITE_DATA.n8nWorkflows;
        if (!Array.isArray(merged.ragKnowledge)) {
          merged.ragKnowledge = INITIAL_RAG_KNOWLEDGE;
        } else {
          // Merge any newly introduced default RAG items if missing by id
          INITIAL_RAG_KNOWLEDGE.forEach(defaultItem => {
            if (!merged.ragKnowledge.some(k => k.id === defaultItem.id)) {
              merged.ragKnowledge.push(defaultItem);
            }
          });
        }

        if (merged.erpData) {
          if (!Array.isArray(merged.erpData.peakHours)) merged.erpData.peakHours = DEFAULT_SITE_DATA.erpData.peakHours;
          if (!Array.isArray(merged.erpData.topSellingItems)) merged.erpData.topSellingItems = DEFAULT_SITE_DATA.erpData.topSellingItems;
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
    setSiteData(prev => ({
      ...prev,
      hero: { ...prev.hero, ...heroUpdates }
    }));
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
