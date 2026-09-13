// Mock Data & Specifications for G-Speed Esport Arena

export const VENUE_ZONES = [
  {
    id: 'stage',
    title: '5v5 Tournament Stage',
    subtitle: 'เวทีประลองระดับมืออาชีพ',
    description: 'เวทีแข่งขันแยก 2 ฝั่งพร้อมระบบกระจกกันเสียงระดับสตูดิโอ จอ LED Wall ขนาดยักษ์ 4K และโต๊ะแคสเตอร์สำหรับถ่ายทอดสด Live Streaming รองรับการจัดแข่ง Official ทุกเกม',
    specs: ['10x Pro Battle Stations', 'Soundproof Glass Booths', '4K Ultra-wide LED Display', 'Studio Caster Desk'],
    icon: 'Trophy',
    badge: 'Official Tournament Ready',
    accentColor: '#2563eb',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'vip',
    title: 'VIP & Streamer Pods',
    subtitle: 'ห้องส่วนตัว Private Gaming Suite',
    description: 'โซนส่วนตัว 5-6 ที่นั่ง เหมาะสำหรับทีมฝึกซ้อม (Bootcamp) หรือแก๊งเพื่อน พร้อมอุปกรณ์สตรีมมิ่งครบเซ็ต กล้อง 4K ไมโครโฟนระดับบอร์ดแคสต์ และไฟสตูดิโอ Key Light',
    specs: ['Private Acoustic Room', 'Dual-Monitor 360Hz + 4K', 'Broadcast Mic & 4K Cam', 'Secretlab Ergonomic Chairs'],
    icon: 'Shield',
    badge: 'Ultra Premium',
    accentColor: '#38bdf8',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'standard',
    title: 'Esports Battleground Zone',
    subtitle: 'โซนเครื่องมาตรฐานระดับแข่งขัน',
    description: 'โซนหลักความจุกว่า 80+ ที่นั่ง ออกแบบระยะห่างตามหลักสรีรศาสตร์ เก้าอี้เกมมิ่งระบายอากาศ โต๊ะกว้าง 120 ซม. ลากเมาส์สะใจ พร้อมระบบเน็ตเวิร์ก 10Gbps Ping ต่ำกว่า 5ms',
    specs: ['RTX 4070 SUPER Powered', '240Hz Fast-IPS Monitors', 'Ultra-Low Latency 10Gbps LAN', 'Custom Mechanical Keyboards'],
    icon: 'Monitor',
    badge: 'Most Popular',
    accentColor: '#1d4ed8',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cafe',
    title: 'Cyber Cafe & Snack Lounge',
    subtitle: 'จุดเติมพลังและคอมมูนิตี้บาร์',
    description: 'บาร์เครื่องดื่มและอาหารปรุงสด พร้อมเสิร์ฟถึงโต๊ะผ่านระบบสั่งอาหารบนหน้าจอคอมพิวเตอร์ กาแฟสด ชานมไข่มุก เบอร์เกอร์ และมุมโซฟาชมการแข่งขันผ่านจอยักษ์',
    specs: ['Direct In-Game Ordering System', 'Specialty Coffee & Energy Drinks', 'Spectator Big Screen', 'Comfort Lounge Seating'],
    icon: 'Coffee',
    badge: 'Chill & Dine',
    accentColor: '#60a5fa',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80'
  }
];

export const TOURNAMENTS = [
  {
    id: 'tour-1',
    title: 'G-SPEED VALORANT CHAMPIONSHIP 2026',
    game: 'VALORANT',
    date: '28-30 กันยายน 2026',
    time: '11:00 - 20:00 น.',
    prizePool: '100,000 บาท',
    slots: '32 ทีม (เหลือ 6 ทีมสุดท้าย)',
    format: 'LAN Final @ Main Stage & Double Elimination',
    badge: 'รับสมัครด่วน',
    badgeType: 'magenta',
    status: 'Open'
  },
  {
    id: 'tour-2',
    title: 'ROV UNIVERSITY BATTLE LEAGUE',
    game: 'Arena of Valor (RoV)',
    date: '10-12 ตุลาคม 2026',
    time: '13:00 - 19:00 น.',
    prizePool: '50,000 บาท + ถ้วยรางวัลเกียรติยศ',
    slots: '64 ทีม (เต็มแล้ว)',
    format: 'Online Qualifier + LAN Semi-Final & Grand Final',
    badge: 'เต็มแล้ว',
    badgeType: 'amber',
    status: 'Full'
  },
  {
    id: 'tour-3',
    title: 'CS2 BANGKOK SHOWDOWN INVITATIONAL',
    game: 'Counter-Strike 2',
    date: '24-25 ตุลาคม 2026',
    time: '10:00 - 22:00 น.',
    prizePool: '150,000 บาท',
    slots: '16 ทีมระดับ Pro Circuit',
    format: '128-Tick Dedicated Server on LAN',
    badge: 'เร็วๆ นี้',
    badgeType: 'cyan',
    status: 'Upcoming'
  }
];

export const EVENT_CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด', icon: 'LayoutGrid' },
  { id: 'tournament', label: 'การแข่งขัน & ทัวร์นาเมนต์', icon: 'Trophy' },
  { id: 'publisher', label: 'งานเปิดตัวเกม & ค่ายเกม', icon: 'Gamepad2' },
  { id: 'community', label: 'กิจกรรมคอมมูนิตี้ & แจกรางวัล', icon: 'Gift' },
  { id: 'venue', label: 'บรรยากาศร้าน & แข่ง LAN 24 ชม.', icon: 'Zap' }
];

export const GALLERY_ACTIVITIES = [
  {
    id: 'gal-1',
    slug: 'icafe-attack-lan-tournament',
    title: 'ICAFE ATTACK LAN TOURNAMENT',
    category: 'tournament',
    date: 'สิงหาคม 2026',
    readTime: '4 นาทีในการอ่าน',
    desc: 'การแข่งขัน LAN สุดมันส์ในโซน Battleground พร้อมจอแสดงผลแบบเรียลไทม์ ผู้เข้าแข่งขันแน่นร้านตลอด 24 ชม.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    tag: 'LAN TOURNAMENT',
    partner: 'ASUS ROG & NVIDIA',
    location: 'G-Speed Esport Arena รามคำแหง (โซนเวที Main Stage)',
    organizer: 'G-Speed ร่วมกับ ASUS ROG และ NVIDIA Thailand',
    prizePool: '฿50,000 พร้อมอุปกรณ์เกมมิ่งเกียร์ ROG',
    attendees: '320+ คน (32 ทีมทั่วประเทศ)',
    quote: 'การได้ลงแข่งในสภาพแวดล้อมที่เครื่องสเปกแรง จอ 360Hz และเน็ตไม่กระตุกเลย ทำให้ผู้เล่นสามารถปลดปล่อยศักยภาพได้ 100% สมกับเป็นสนามแข่งระดับเวิลด์คลาส',
    contentParagraphs: [
      'การแข่งขัน ICAFE ATTACK LAN TOURNAMENT ถือเป็นหนึ่งในทัวร์นาเมนต์ออฟไลน์ที่ได้รับความสนใจสูงสุดของปี 2026 โดยมีทีมแข่งอีสปอร์ตระดับแนวหน้าและผู้เล่นดาวรุ่งกว่า 32 ทีมจากทั่วประเทศ ตบเท้าเข้าร่วมประลองฝีมือในเกมยิงเชิงกลยุทธ์ยอดนิยม ณ ศูนย์ G-Speed Esport Arena สาขารามคำแหง',
      'ตลอดการแข่งขันทั้ง 2 วันเต็ม โซน Battleground และเวที Main Stage ถูกเนรมิตให้เป็นสมรภูมิสุดเดือด ทั้ง 32 ทีมต่อสู้กันอย่างดุเดือดท่ามกลางเสียงเชียร์ของแฟนคลับที่มาร่วมชมอย่างหนาแน่น พร้อมการถ่ายทอดสดแบบ Multi-camera ผ่านจอ LED 4K ขนาดยักษ์ใจกลางร้าน',
      'ความพิเศษของงานนี้คือการใช้เครื่องคอมพิวเตอร์สเปกทัวร์นาเมนต์ ขับเคลื่อนด้วยขุมพลัง NVIDIA GeForce RTX 4080 SUPER และหน้าจอ BenQ ZOWIE 360Hz Fast-IPS ตอบสนอง 0.5ms พร้อมระบบเราเตอร์ไฟเบอร์ 10Gbps คู่ ทำให้ค่าความหน่วง (Ping) นิ่งสนิทต่ำกว่า 2ms ตลอดการแข่งขัน',
      'ทีมชนะเลิศอันดับหนึ่งคว้าเงินรางวัล ฿30,000 พร้อมถ้วยเกียรติยศและเซ็ตเกมมิ่งเกียร์ไร้สายจาก ASUS ROG ไปครอง ทางทีมงานขอแสดงความยินดีกับผู้ชนะทุกทีม และขอบคุณผู้สนับสนุนที่ร่วมสร้างปรากฏการณ์สุดมันส์ในครั้งนี้'
    ],
    galleryPhotos: [
      { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', caption: 'นักกีฬาอีสปอร์ตกำลังขับเคี่ยวอย่างดุเดือดในรอบชิงชนะเลิศ' },
      { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', caption: 'จอ LED 4K ขนาดยักษ์ถ่ายทอดสดมุมมองผู้เล่นแบบเรียลไทม์' },
      { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', caption: 'เครื่องคอมพิวเตอร์สเปกแข่งขัน RTX 4080 และจอ 360Hz' },
      { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', caption: 'บรรยากาศกองเชียร์และผู้ร่วมงานแน่นขนัดทั่วทั้งร้าน' }
    ]
  },
  {
    id: 'gal-2',
    slug: 'thailand-predator-league-pubg',
    title: 'THAILAND PREDATOR LEAGUE 2022 - PUBG BATTLEGROUNDS',
    category: 'publisher',
    date: 'กรกฎาคม 2026',
    readTime: '3 นาทีในการอ่าน',
    desc: 'งานเปิดตัวและแข่งขัน PUBG BATTLEGROUNDS อย่างเป็นทางการ พร้อมคอสเพลย์เยอร์และถ่ายทอดสด Live Stream',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    tag: 'OFFICIAL PUBG EVENT',
    partner: 'Predator & Krafton',
    location: 'G-Speed Esport Arena (เวทีกลางและบูทกิจกรรมค่ายเกม)',
    organizer: 'Predator Gaming Thailand ร่วมกับ Krafton Inc.',
    prizePool: '฿80,000 พร้อมสิทธิ์แข่งรอบเอเชียแปซิฟิก',
    attendees: '450+ คน (แฟนเกมและทีมสตรีมเมอร์)',
    quote: 'G-Speed เป็นพาร์ตเนอร์ร้านเกมที่มีความพร้อมด้านระบบและสถานที่สูงมาก สามารถรองรับการบรอดแคสต์ระดับออฟฟิเชียลได้อย่างไร้ที่ติ',
    contentParagraphs: [
      'ค่ายเกมยักษ์ใหญ่ Krafton จับมือกับ Acer Predator Gaming เลือกใช้ศูนย์ G-Speed Esport Arena เป็นสถานที่จัดศึกใหญ่ THAILAND PREDATOR LEAGUE - PUBG BATTLEGROUNDS ประจำปี โดยมีนักล่าไก่ทั่วฟ้าเมืองไทยลงทะเบียนเข้าร่วมกว่า 64 สควอด',
      'บรรยากาศในงานคึกคักตั้งแต่ช่วงเช้าด้วยกิจกรรม Fan Meeting พบปะคอสเพลย์เยอร์ในชุดตัวละครแอร์ดรอปสุดเท่ พร้อมจุดถ่ายรูปโฟโต้บูธสามมิติ และแจกไอเทมโค้ดลิขสิทธิ์แท้ให้กับผู้เข้าร่วมงานทุกคน',
      'การแข่งขันรอบออฟไลน์ไฟนอลดำเนินไปอย่างตื่นเต้นเร้าใจ มีการใช้ระบบ Observer บรอดแคสต์มืออาชีพพร้อมแคสเตอร์ชื่อดังมาพากย์สดในสตูดิโอบาร์ของร้าน ผู้ชนะเลิศได้รับสิทธิ์เป็นตัวแทนประเทศไทยไปลุยต่อในเวทีระดับนานาชาติ'
    ],
    galleryPhotos: [
      { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', caption: 'เวทีหลักกับการแข่งขันรอบตัดสินชิงตั๋วสู่เอเชีย' },
      { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', caption: 'ผู้เข้าแข่งขันสวมหูฟังตัดเสียงรบกวน วางแผนเอาตัวรอด' },
      { url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80', caption: 'พิธีมอบถ้วยแชมป์และเงินรางวัลสนับสนุนจาก Predator' }
    ]
  },
  {
    id: 'gal-3',
    slug: 'electronics-extreme-zone4-fan-meeting',
    title: 'ELECTRONICS EXTREME - ZONE4 FAN MEETING',
    category: 'publisher',
    date: 'มิถุนายน 2026',
    readTime: '3 นาทีในการอ่าน',
    desc: 'ค่ายเกม Electronics Extreme จัดงานแถลงข่าวและพบปะแฟนเกม Zone4 บน Main Stage ของ GLP',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    tag: 'GAME LAUNCH',
    partner: 'Electronics Extreme',
    location: 'G-Speed Esport Arena (โซนคาเฟ่และเวทีกลาง)',
    organizer: 'Electronics Extreme Co., Ltd.',
    prizePool: 'ไอเทมแรร์มูลค่ารวมกว่า ฿120,000',
    attendees: '280+ คน',
    quote: 'ความอบอุ่นของแฟนเกม Zone4 ที่มารวมตัวกันที่นี่ ทำให้เรารู้ว่าคอมมูนิตี้เกมไทยยังเหนียวแน่นและพร้อมสนับสนุนกันเสมอ',
    contentParagraphs: [
      'งานรวมพลสาวกเกมต่อสู้ในตำนาน Zone4 โดยค่าย Electronics Extreme เนรมิตพื้นที่ G-Speed ให้กลายเป็นสถานที่จัดแฟนมีตติ้งสุดเอ็กซ์คลูซีฟ มีการเปิดเผยแผนการอัปเดตเซิร์ฟเวอร์และระบบคลาสใหม่อย่างเป็นทางการ',
      'ผู้ร่วมงานได้ร่วมประลองฝีมือในมินิทัวร์นาเมนต์ 1v1 และ 3v3 แบบกระชับมิตร พร้อมลุ้นรับแรร์ไอเทมและฟิกเกอร์ลิมิเต็ดที่มีเฉพาะในงานนี้เท่านั้น'
    ],
    galleryPhotos: [
      { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', caption: 'แฟนเกม Zone4 ร่วมทดลองเล่นแพตช์ใหม่ในโซนเครื่อง VIP' },
      { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', caption: 'การแจกของรางวัลสุดพิเศษและของที่ระลึกจากผู้บริหารค่าย' }
    ]
  },
  {
    id: 'gal-4',
    slug: 'audition-lady-tournament-cup',
    title: 'AUDITION LADY TOURNAMENT CUP #7',
    category: 'community',
    date: 'พฤษภาคม 2026',
    readTime: '3 นาทีในการอ่าน',
    desc: 'การแข่งขัน Audition เกมเต้นอันดับ 1 ของไทย มอบเงินรางวัลชนะเลิศและไอเทมพิเศษ บรรยากาศอบอุ่นและสนุกสนาน',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    tag: 'COMMUNITY CUP',
    partner: 'PlayPark Audition',
    location: 'G-Speed Esport Arena (โซน Standard Gaming Arena)',
    organizer: 'PlayPark & Audition Community Thailand',
    prizePool: '฿25,000 พร้อมมงกุฎและไอเทมปีกถาวร',
    attendees: '200+ คน',
    quote: 'งานแข่งขันที่เต็มไปด้วยรอยยิ้ม เสียงเพลง และมิตรภาพของเหล่านักเต้นทั่วประเทศที่มารวมตัวกัน',
    contentParagraphs: [
      'ศึกประชันความเร็วของนิ้วมือและจังหวะดนตรีกับ AUDITION LADY TOURNAMENT ครั้งที่ 7 รายการแข่งขันที่เปิดโอกาสให้นักเต้นสาวสวยทั่วประเทศมาชิงตำแหน่งราชินีฟลอร์เต้น',
      'ร้านเกม G-Speed ได้จัดเตรียมคีย์บอร์ดกลไกสวิตช์ความเร็วสูงและหูฟังตัดเสียง เพื่อให้นักกีฬาได้ยินบีตดนตรีและกดปุ่ม Perfect ได้อย่างแม่นยำที่สุด'
    ],
    galleryPhotos: [
      { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', caption: 'ความเร็วในการรัวปุ่มคีย์บอร์ดระดับเสี้ยววินาที' },
      { url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80', caption: 'ผู้ได้รับรางวัลชนะเลิศรับมอบมงกุฎและเงินรางวัล' }
    ]
  },
  {
    id: 'gal-5',
    slug: 'audition-all-mode-tournament',
    title: 'AUDITION ALL MODE TOURNAMENT ชิง 5,000 บาท',
    category: 'community',
    date: 'เมษายน 2026',
    readTime: '2 นาทีในการอ่าน',
    desc: 'การประลองฝีมือกดปุ่มตามจังหวะเพลงสุดเร้าใจ กองเชียร์ส่งเสียงเชียร์กึกก้องทั่วร้านตลอดวันแข่งขัน',
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80',
    tag: 'AWARD CEREMONY',
    partner: 'GLP Community',
    location: 'G-Speed Esport Arena',
    organizer: 'GLP Community Management Team',
    prizePool: '฿5,000 พร้อมชั่วโมงเล่นฟรี 100 ชม.',
    attendees: '150+ คน',
    quote: 'กิจกรรมคอมมูนิตี้รายเดือนที่เปิดให้ลูกค้าประจำและแฟนคลับได้มาพบปะและประลองฝีมือกันอย่างเป็นกันเอง',
    contentParagraphs: [
      'การแข่งขันกระชับมิตรประจำเดือนของชุมชนร้านเกม G-Speed ชิงเงินรางวัลและชั่วโมงเล่นเกมฟรี บรรยากาศสนุกสนานและเป็นกันเองตลอดวันหยุดสุดสัปดาห์'
    ],
    galleryPhotos: [
      { url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80', caption: 'ผู้เข้าแข่งขันและกองเชียร์สนุกสนานร่วมกัน' }
    ]
  },
  {
    id: 'gal-6',
    slug: 'glp-esport-stadium-night-24hrs',
    title: 'GLP ESPORT STADIUM NIGHT 24 HRS.',
    category: 'venue',
    date: 'มีนาคม 2026',
    readTime: '3 นาทีในการอ่าน',
    desc: 'บรรยากาศผู้ใช้บริการแน่นร้านช่วงสุดสัปดาห์ เล่นเกมพร้อมแก๊งเพื่อน เครื่องสเปกแรง แอร์เย็นฉ่ำ สั่งอาหารได้ถึงโต๊ะ',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
    tag: 'ATMOSPHERE 24/7',
    partner: 'GLP Living Plus',
    location: 'G-Speed Esport Arena ทุกโซนบริการ',
    organizer: 'G-Speed Operations & Customer Care',
    prizePool: 'โปรโมชันแพ็กเกจเหมาดึก Night Owl',
    attendees: 'ลูกค้าหมุนเวียน 800+ คน/วัน',
    quote: 'เราใส่ใจในทุกรายละเอียด ทั้งเก้าอี้ที่นั่งสบายตลอดคืน ระบบแอร์ฟอกอากาศ PM2.5 และเมนูอาหารปรุงสดที่ส่งตรงถึงโต๊ะ',
    contentParagraphs: [
      'เก็บบรรยากาศยามค่ำคืนของ G-Speed Esport Arena ศูนย์รวมเกมเมอร์ที่เปิดให้บริการตลอด 24 ชั่วโมง ไฮไลต์คือช่วงสุดสัปดาห์ที่มีปาร์ตี้เล่นเกมกับกลุ่มเพื่อน เครื่องเต็ม 100% พร้อมบริการสั่งอาหาร เครื่องดื่มร้อน-เย็นจากบาร์เสิร์ฟถึงโต๊ะอย่างรวดเร็ว'
    ],
    galleryPhotos: [
      { url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80', caption: 'บรรยากาศแสงไฟนีออนสลัวสบายตาระหว่างการเล่นเกมรอบดึก' },
      { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', caption: 'ผู้เล่นเพลิดเพลินกับความลื่นไหลของจอ 360Hz และเน็ต 10Gbps' }
    ]
  }
];

export const GAME_NEWS = [
  {
    id: 'news-1',
    slug: 'thailand-predator-league-recap',
    title: 'รวมภาพความมันส์งานแข่ง PUBG Predator League @ GLP Esports Arena',
    category: 'tournament',
    tag: 'ESPORTS TOURNAMENT',
    tags: ['#PUBG', '#LAN', '#PredatorLeague', '#EsportsThailand', '#Battlegrounds'],
    author: 'ทีมข่าวกิจกรรม G-Speed',
    date: '12 กันยายน 2026',
    readTime: '3 นาทีในการอ่าน',
    excerpt: 'ภาพบรรยากาศการแข่งขันศึกชิงแชมป์ระดับประเทศ ทีมผู้เข้าแข่งขันกว่า 32 ทีม ดวลปืนสุดเดือดบนเวที 5v5 Stage พร้อมผู้ร่วมงานแน่นร้าน',
    desc: 'ภาพบรรยากาศการแข่งขันศึกชิงแชมป์ระดับประเทศ ทีมผู้เข้าแข่งขันกว่า 32 ทีม ดวลปืนสุดเดือดบนเวที 5v5 Stage พร้อมผู้ร่วมงานแน่นร้าน',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    partner: 'Acer Predator & Krafton',
    location: 'G-Speed Esport Arena (Main Arena Stage)',
    prizePool: '฿80,000 พร้อมตั๋วตัวแทนเอเชีย',
    attendees: '450+ คน',
    quote: 'การจัดแข่งบนฮาร์ดแวร์มาตรฐาน Pro Circuit ช่วยดึงศักยภาพนักกีฬาอีสปอร์ตไทยได้อย่างเต็มที่',
    seo: {
      metaTitle: 'รวมภาพความมันส์งานแข่ง PUBG Predator League 2026 | G-Speed Arena',
      metaDescription: 'เกาะติดภาพบรรยากาศการแข่งขัน PUBG Predator League ศึกชิงแชมป์เงินรางวัล 80,000 บาท ณ ศูนย์ G-Speed Esport Arena',
      keywords: 'PUBG, Predator League, แข่งเกม, G-Speed, Esports Arena, ทัวร์นาเมนต์'
    },
    contentParagraphs: [
      'สิ้นสุดลงอย่างยิ่งใหญ่สำหรับศึกใหญ่แห่งปี THAILAND PREDATOR LEAGUE 2026 ณ ศูนย์ G-Speed Esport Arena โดยมีทีมระดับหัวแถวของประเทศกว่า 32 ทีมตบเท้าประลองฝีมือชิงเงินรางวัลรวมกว่า ฿80,000 บาท',
      'ตลอดการขับเคี่ยว 2 วันเต็ม โซนเวที Main Stage เต็มไปด้วยเสียงเชียร์ดังกึกก้อง แฟนคลับมาร่วมชมทั้งติดขอบเวทีและผ่านจอถ่ายทอดสด LED 4K ขนาดยักษ์ใจกลางร้าน',
      'การแข่งขันรอบสุดท้ายเป็นไปอย่างระทึกใจ โดยทีมแชมป์สามารถเอาชีวิตรอดและเก็บคะแนนคิลสูงสุดในวงสุดท้าย คว้าถ้วยแชมป์และสิทธิ์เข้าร่วมแข่งขันระดับภูมิภาคเอเชียแปซิฟิกต่อไป'
    ],
    galleryPhotos: [
      { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', caption: 'บรรยากาศผู้เข้าแข่งขันและหน้าจอคอม 360Hz บนเวที' },
      { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', caption: 'แฟนคลับส่งเสียงเชียร์รอบชิงชนะเลิศ' },
      { url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80', caption: 'พิธีมอบเงินรางวัลและของที่ระลึกจาก Predator' }
    ]
  },
  {
    id: 'news-2',
    slug: 'glp-electronics-extreme-zone4',
    title: 'GLP จับมือ Electronics Extreme จัดงาน Zone4 และแจกไอเทมลิขสิทธิ์แท้',
    category: 'publisher',
    tag: 'PARTNER EVENT',
    tags: ['#Zone4', '#ElectronicsExtreme', '#FanMeeting', '#ItemCode', '#GLPCommunity'],
    author: 'กองบรรณาธิการ GLP',
    date: '5 กันยายน 2026',
    readTime: '2 นาทีในการอ่าน',
    excerpt: 'ค่ายเกมชั้นนำเนรมิตร้าน GLP เป็นสมรภูมิประลองยุทธ์ พร้อมมอบของรางวัลและถ้วยเกียรติยศแก่ผู้ชนะการแข่งขัน',
    desc: 'ค่ายเกมชั้นนำเนรมิตร้าน GLP เป็นสมรภูมิประลองยุทธ์ พร้อมมอบของรางวัลและถ้วยเกียรติยศแก่ผู้ชนะการแข่งขัน',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    partner: 'Electronics Extreme',
    location: 'G-Speed Esport Arena (Lounge & Event Zone)',
    prizePool: 'ไอเทมแรร์มูลค่า ฿50,000',
    attendees: '280+ คน',
    quote: 'ความอบอุ่นของแฟนเกม Zone4 ยังคงเหนียวแน่น และพื้นที่ของ G-Speed ตอบโจทย์งานมีตติ้งได้อย่างสมบูรณ์แบบ',
    seo: {
      metaTitle: 'GLP จับมือ Electronics Extreme จัดงาน Zone4 แจกไอเทมแท้ | G-Speed',
      metaDescription: 'ภาพบรรยากาศงาน Electronics Extreme - Zone4 Fan Meeting กิจกรรมแจกไอเทมโค้ดและการแข่งขันมินิแมตช์ ณ G-Speed',
      keywords: 'Zone4, Electronics Extreme, แฟนมีตติ้ง, แจกไอเทม, ร้านเกม, G-Speed'
    },
    contentParagraphs: [
      'Electronics Extreme ร่วมกับ G-Speed Arena จัดกิจกรรมสุดพิเศษเพื่อเอาใจแฟนเกมไฟท์ติ้งระดับตำนาน Zone4 ภายในงานมีการประกวดคอมมูนิตี้และมินิทัวร์นาเมนต์กระชับมิตร',
      'ผู้เข้าร่วมงานทุกคนได้รับแพ็กเกจไอเทมโค้ดระดับ Exclusive พร้อมลุ้นรับเสื้อแจ็กเก็ตและของสะสมลิขสิทธิ์แท้จากเกาหลี',
      'งานนี้นับเป็นอีกหนึ่งเครื่องยืนยันว่า G-Speed ไม่ได้เป็นเพียงร้านเกม แต่เป็นฮับจัดอีเวนต์และศูนย์รวมคอมมูนิตี้เกมเมอร์ที่พร้อมที่สุดของกรุงเทพฯ'
    ],
    galleryPhotos: [
      { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', caption: 'ผู้ร่วมงานลงทะเบียนรับถุงของขวัญและไอเทมโค้ด' },
      { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', caption: 'การประลองฝีมือแมตช์พิเศษบนเวที' }
    ]
  },
  {
    id: 'news-3',
    slug: 'rtx-40-series-360hz-upgrade',
    title: 'อัปเกรดขุมพลังใหม่! สเปก RTX 40 Series พร้อมจอ 360Hz ทุกล็อตที่ GLP',
    category: 'hardware',
    tag: 'HARDWARE UPGRADE',
    tags: ['#RTX40Series', '#BenQ360Hz', '#HardwareUpgrade', '#IntelCorei9', '#PCMasterRace'],
    author: 'ทีมเทคนิคและวิศวกรรมไอที',
    date: '28 สิงหาคม 2026',
    readTime: '4 นาทีในการอ่าน',
    excerpt: 'ยกระดับประสบการณ์เล่นเกมให้ลื่นไหลไร้รอยต่อ เฟรมเรตนิ่ง ปิงต่ำกว่า 3ms ด้วยระบบเน็ตเวิร์กและ Diskless Server ใหม่ล่าสุด',
    desc: 'ยกระดับประสบการณ์เล่นเกมให้ลื่นไหลไร้รอยต่อ เฟรมเรตนิ่ง ปิงต่ำกว่า 3ms ด้วยระบบเน็ตเวิร์กและ Diskless Server ใหม่ล่าสุด',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    partner: 'NVIDIA Thailand & ASUS ROG',
    location: 'G-Speed Esport Arena ทุกโซนบริการ',
    prizePool: 'อัปเกรดมูลค่ากว่า 5 ล้านบาท',
    attendees: 'เปิดบริการแล้วทุกที่นั่ง',
    quote: 'เราไม่เคยหยุดพัฒนามาตรฐาน เพื่อมอบประสบการณ์เกมมิ่งที่ดีที่สุดและลื่นที่สุดให้แก่ลูกค้าทุกคน',
    seo: {
      metaTitle: 'อัปเกรดสเปกใหม่ RTX 40 Series จอ 360Hz ทุกล็อต | G-Speed Esport',
      metaDescription: 'G-Speed Arena ยกเครื่องสเปกคอมใหม่ยกแผง ขุมพลัง GeForce RTX 40 Series พร้อมจอ BenQ 360Hz Fast-IPS เน็ต 10Gbps',
      keywords: 'สเปกคอมร้านเกม, RTX 4080, จอ 360Hz, ร้านเกมสเปกแรง, G-Speed Arena'
    },
    contentParagraphs: [
      'เพื่อตอกย้ำความเป็นผู้นำศูนย์กีฬาอีสปอร์ตระดับเวิลด์คลาส G-Speed Esport Arena ทุ่มงบประมาณกว่า 5 ล้านบาท ปรับปรุงเครื่องคอมพิวเตอร์ทุกล็อตให้เป็นขุมพลังล่าสุด NVIDIA GeForce RTX 40 Series',
      'จับคู่กับซีพียู Intel Core i7 / i9 เจนเนอเรชันใหม่ แรม 32GB DDR5 ความเร็วสูง 6000MHz และหน้าจออีสปอร์ต BenQ ZOWIE 360Hz Fast-IPS ที่ให้การตอบสนอง 0.5ms คมชัดทุกการเคลื่อนไหว',
      'นอกจากนี้ ระบบ Diskless Server ยังได้รับการอัปเกรดเป็น NVMe Gen5 Multi-tier Caching ร่วมกับระบบเน็ตเวิร์ก Dual 10Gbps Fiber Optic ช่วยให้การโหลดเกมและการเปิดเครื่องเร็วขึ้นกว่าเดิม 300%'
    ],
    galleryPhotos: [
      { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', caption: 'เคสคอมพิวเตอร์และระบบระบายความร้อนด้วยน้ำสุดเท่' },
      { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', caption: 'หน้าจอ 360Hz ที่ผ่านการปรับแต่งค่าสีสำหรับโปรเพลเยอร์' }
    ]
  }
];

export const FOUNDER_INFO = {
  name: 'กิตติศักดิ์ พรหมวารี (คุณกฤต)',
  title: 'ประธานเจ้าหน้าที่บริหารและผู้ก่อตั้ง G-SPEED Group',
  experience: '16+ ปีในอุตสาหกรรม Gaming & Esports ในประเทศไทย',
  quote: '"เราไม่ได้มองว่าร้านเกมเป็นแค่ที่เล่นเกม แต่คือสนามกีฬาของคนรุ่นใหม่ เป็นพื้นที่สานฝันและสร้างนักกีฬาอีสปอร์ตไทยสู่ระดับโลก"',
  vision: 'ยกระดับมาตรฐานร้านอินเทอร์เน็ตคาเฟ่ในไทยให้เทียบเท่าสนามแข่งระดับโลก ด้วยระบบฮาร์ดแวร์ที่ดีที่สุด บรรยากาศที่ปลอดภัย สะอาด และระบบการบริหารจัดการที่สร้างผลตอบแทนยั่งยืนแก่ผู้ร่วมลงทุน',
  history: [
    { year: '2010', event: 'เปิดตัวสาขาแรกในย่านมหาวิทยาลัย นำระบบ Diskless Server มาตรฐานใหม่มาใช้เป็นเจ้าแรกๆ' },
    { year: '2016', event: 'ขยายธุรกิจสู่ Esport Arena เต็มรูปแบบ รองรับการจัดแข่งขันระดับประเทศร่วมกับค่ายเกมใหญ่' },
    { year: '2020', event: 'เปิดตัวระบบเฟรนไชส์ G-Speed Express & Arena พร้อมระบบควบคุมการเงินและสต๊อกแบบคลาวด์' },
    { year: '2024-ปัจจุบัน', event: 'มีสาขาในเครือ 8 สาขาทั่วกรุงเทพฯ และปริมณฑล พร้อมขยายสู่หัวเมืองใหญ่ทั่วประเทศ' }
  ],
  stats: [
    { label: 'สาขาที่เปิดให้บริการ', value: '8 สาขา' },
    { label: 'จำนวนเครื่องในระบบ', value: '750+ เครื่อง' },
    { label: 'สมาชิกในเครือข่าย', value: '52,000+ คน' },
    { label: 'ทัวร์นาเมนต์ที่จัดแล้ว', value: '180+ รายการ' }
  ],
  partners: [
    { name: 'NVIDIA GeForce RTX', tier: 'Official GPU Partner', icon: 'Cpu' },
    { name: 'ASUS ROG', tier: 'Official Hardware & Motherboard', icon: 'Zap' },
    { name: 'Intel Extreme', tier: 'Official Processor Partner', icon: 'Cpu' },
    { name: 'Secretlab', tier: 'Official Ergonomic Gaming Chair', icon: 'Armchair' },
    { name: 'BenQ ZOWIE', tier: 'Official Tournament Esports Monitor', icon: 'Monitor' },
    { name: 'AIS Fibre Esports', tier: 'High-speed 10Gbps Fiber Partner', icon: 'Wifi' }
  ]
};

// Wallpapers & Wall Finishes for 3D Studio
export const WALLPAPERS = [
  { id: 'white-clean', name: 'Modern Clean White', color: '#f8fafc', hex: '#f8fafc', desc: 'ผนังสีขาวสว่าง เรียบหรู สะอาดตา สบายตา' },
  { id: 'royal-blue', name: 'GLP Royal Acoustic', color: '#1d4ed8', hex: '#1e3a8a', desc: 'แผงซับเสียงสีน้ำเงิน สัญลักษณ์แบรนด์ G-Speed' },
  { id: 'dark-hex', name: 'Dark Studio Hexagon', color: '#1e293b', hex: '#0f172a', desc: 'โฟมซับเสียงสีดำด้าน สไตล์ห้องแข่งขัน Pro Circuit' },
  { id: 'loft-concrete', name: 'Industrial Concrete', color: '#94a3b8', hex: '#64748b', desc: 'ปูนเปลือยลอฟท์โมเดิร์น สไตล์สถาปัตยกรรมร่วมสมัย' }
];

// Floor Materials for 3D Studio
export const FLOOR_MATERIALS = [
  { id: 'wood-parquet', name: 'Dark Wood Herringbone', color: '#78350f', hex: '#854d0e', desc: 'พื้นไม้ปาร์เกต์ก้างปลา อบอุ่น พรีเมียม (ตามภาพตัวอย่าง)' },
  { id: 'grey-epoxy', name: 'Esports Seamless Epoxy', color: '#334155', hex: '#475569', desc: 'พื้นอีพ็อกซี่สีเทาเข้ม ไร้รอยต่อ ทนทาน ล้อเก้าอี้ลื่นไหล' },
  { id: 'white-marble', name: 'Luxury Polished Marble', color: '#e2e8f0', hex: '#cbd5e1', desc: 'กระเบื้องหินอ่อนสีขาวเงา หรูหรา สว่างตา' },
  { id: 'dark-carpet', name: 'Acoustic Charcoal Carpet', color: '#1e293b', hex: '#020617', desc: 'พรมดักเสียงสะท้อนมาตรฐานอารีนา นุ่มเท้า' }
];

// Item Catalog for Floor Plan Interior Planner (with 3D Specs & Component Breakdown)
export const CATALOG_ITEMS = [
  {
    type: 'pc-row-2',
    name: 'โต๊ะคอมพิวเตอร์ 2 ที่นั่ง (Double Station)',
    category: 'stations',
    grade: 'pro',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    widthMeters: 2.4,
    heightMeters: 1.0,
    depth3D: 1.0,
    height3D: 1.25,
    seats: 2,
    baseCost: 28000,
    deskPrice: 16000,
    deskDesc: 'โต๊ะเกมมิ่งเหล็กคาร์บอนยาว 2.4 ม. พร้อมรางร้อยสายไฟและฉากกั้นกลาง',
    chairModel: 'G-Speed Pro Racing PU Leather (ปรับเอน 160°)',
    chairPrice: 6000,
    chairCount: 2,
    deskColor: '#0f172a',
    accentColor: '#1d4ed8',
    chairColor: '#0f172a',
    color: '#38bdf8',
    icon: 'Monitor',
    warranty: 'รับประกันโครงสร้าง 5 ปี และระบบไฟ 3 ปี On-site Service',
    leadTime: '7 - 10 วันทำการ',
    material: 'โครงเหล็กกล้าคาร์บอนพ่นสี Powder Coat + หน้าท็อป HPL กันน้ำและรอยขีดข่วน + รางร้อยสายไฟแยก High/Low Voltage',
    desc: 'โต๊ะเกมมิ่ง 2 ที่นั่ง ออกแบบระยะห่างมาตรฐานนักกีฬา ลากเมาส์ได้กว้าง'
  },
  {
    type: 'pc-row-4',
    name: 'แถวคอมพิวเตอร์ 4 ที่นั่ง (Quad Station)',
    category: 'stations',
    grade: 'pro',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    widthMeters: 4.8,
    heightMeters: 1.0,
    depth3D: 1.0,
    height3D: 1.25,
    seats: 4,
    baseCost: 52000,
    deskPrice: 28000,
    deskDesc: 'โต๊ะแถวยาว 4.8 ม. โครงสร้างเสาคานรับน้ำหนักพิเศษ ช่องเก็บสายไฟเมน',
    chairModel: 'G-Speed Pro Racing PU Leather (พนักพิงปรับสรีระ)',
    chairPrice: 6000,
    chairCount: 4,
    deskColor: '#0f172a',
    accentColor: '#2563eb',
    chairColor: '#0f172a',
    color: '#2563eb',
    icon: 'Monitor',
    warranty: 'รับประกันโครงสร้าง 5 ปี และระบบไฟ 3 ปี On-site Service',
    leadTime: '7 - 12 วันทำการ',
    material: 'โครงสร้างเสาคานเหล็กรับน้ำหนักพิเศษ + หน้าท็อปโมดูลาร์ 4 ช่วงต่อไร้รอยสะดุด + ถาดซ่อนเราเตอร์ Gigabit LAN',
    desc: 'แถวโต๊ะมาตรฐาน 4 ที่นั่งแบบเรียงหน้ากระดาน เหมาะกับแนวผนังร้าน'
  },
  {
    type: 'pc-island-6',
    name: 'เกาะคอมพิวเตอร์ 6 ที่นั่ง (Island 6)',
    category: 'stations',
    grade: 'ultimate',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    widthMeters: 3.6,
    heightMeters: 2.0,
    depth3D: 2.0,
    height3D: 1.35,
    seats: 6,
    baseCost: 78000,
    deskPrice: 42000,
    deskDesc: 'โต๊ะเกาะกลาง 3x3 หันหลังชนกัน พร้อมกระดูกงูร้อยสายไฟและปลั๊กไฟ 6 จุด',
    chairModel: 'G-Speed Pro Racing PU Leather (เก้าอี้เกมมิ่ง 6 ตัว)',
    chairPrice: 6000,
    chairCount: 6,
    deskColor: '#1e293b',
    accentColor: '#06b6d4',
    chairColor: '#0f172a',
    color: '#1d4ed8',
    icon: 'LayoutGrid',
    warranty: 'รับประกันโครงสร้าง 5 ปี และระบบไฟ 3 ปี On-site Service',
    leadTime: '10 - 14 วันทำการ',
    material: 'ท็อปคู่หันหลังชนกันพร้อมเสากลางเดินท่อไฟและลมแอร์ + โครงเหล็กชุบกัลวาไนซ์ + แผงกั้นอะคริลิกตัดแสง RGB',
    desc: 'เกาะกลาง 6 ที่นั่ง ประหยัดพื้นที่ เดินท่อสายไฟและท่อแอร์ลงตรงกลาง'
  },
  {
    type: 'vip-room-5',
    name: 'ห้อง VIP Private Suite (5 ที่นั่ง)',
    category: 'vip',
    grade: 'vip',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    widthMeters: 5.0,
    heightMeters: 3.5,
    depth3D: 3.5,
    height3D: 2.6,
    seats: 5,
    baseCost: 140000,
    deskPrice: 75000,
    deskDesc: 'ผนังกระจกเก็บเสียง Double Glass + ประตูบานเลื่อนกระจก + ไฟปรับอารมณ์',
    chairModel: 'Secretlab TITAN Evo 2024 Series (เก้าอี้พรีเมียม 5 ตัว)',
    chairPrice: 13000,
    chairCount: 5,
    deskColor: '#090d16',
    accentColor: '#8b5cf6',
    chairColor: '#111827',
    color: '#60a5fa',
    icon: 'Shield',
    warranty: 'รับประกันโครงสร้างและระบบกระจก 5 ปี, ระบบไฟอารมณ์ 3 ปี',
    leadTime: '14 - 21 วันทำการ',
    material: 'กระจกนิรภัยลามิเนตเก็บเสียง 12 มม. 2 ชั้น + โครงสร้างอะลูมิเนียมอโนไดซ์ดำด้าน + ระบบไฟ Smart RGB ควบคุมผ่านแอป',
    desc: 'ห้องกระจกเก็บเสียงส่วนตัว สำหรับทีมซ้อม Bootcamp และสตรีมเมอร์'
  },
  {
    type: 'stage-5v5',
    name: 'เวทีแข่งขัน 5v5 Tournament Stage',
    category: 'stage',
    grade: 'ultimate',
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80',
    widthMeters: 8.5,
    heightMeters: 3.2,
    depth3D: 3.2,
    height3D: 2.8,
    seats: 10,
    baseCost: 250000,
    deskPrice: 150000,
    deskDesc: 'เวทีแข่งขัน 2 ฝั่งยกพื้นสูง 30 ซม. พร้อมโครงทรัสไฟและแบ็กดรอปจอ LED',
    chairModel: 'Secretlab TITAN Evo Pro Tournament Edition (10 ตัว)',
    chairPrice: 10000,
    chairCount: 10,
    deskColor: '#0a0e1a',
    accentColor: '#1d4ed8',
    chairColor: '#0a0e1a',
    color: '#1d4ed8',
    icon: 'Trophy',
    warranty: 'รับประกันโครงสร้างเวที 7 ปี และระบบไฟเวที 3 ปี',
    leadTime: '21 - 30 วันทำการ',
    material: 'โครงสร้างเวทีเหล็กกล่องมาตรฐาน Pro Stage รองรับน้ำหนัก 2,000 กก. + พื้นไม้อัดหนาพิเศษปูพรมกันลามไฟ + เสาทรัสไฟอลูมิเนียม',
    desc: 'เวทีประลอง 10 ที่นั่ง (5v5) พร้อมโครงสร้างถ่ายทอดสดและโต๊ะแคสเตอร์'
  },
  {
    type: 'cashier-counter',
    name: 'เคาน์เตอร์แคชเชียร์ & ต้อนรับ (Reception)',
    category: 'facilities',
    grade: 'pro',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    widthMeters: 3.0,
    heightMeters: 1.5,
    depth3D: 1.5,
    height3D: 1.2,
    seats: 0,
    baseCost: 45000,
    deskPrice: 35000,
    deskDesc: 'เคาน์เตอร์ท็อปหินสังเคราะห์ โครงไม้ลามิเนต พร้อมลิ้นชักเก็บเงินและช่อง POS',
    chairModel: 'Ergonomic Stool สำหรับพนักงาน',
    chairPrice: 10000,
    chairCount: 1,
    deskColor: '#1e293b',
    accentColor: '#38bdf8',
    chairColor: '#0f172a',
    color: '#93c5fd',
    icon: 'CreditCard',
    warranty: 'รับประกันโครงสร้างเคาน์เตอร์ 3 ปี และรางลิ้นชัก Soft-close 2 ปี',
    leadTime: '10 - 14 วันทำการ',
    material: 'ท็อปหินสังเคราะห์ Solid Surface ไร้รอยต่อ + โครงไม้ HMR เกรดทนความชื้นปิดผิว High Pressure Laminate + ช่องเดินสาย POS ซ่อนรูป',
    desc: 'จุดต้อนรับลูกค้า เช็กอินสมาชิก คิดเงิน และเติมเงินหน้าเคาน์เตอร์'
  },
  {
    type: 'server-room',
    name: 'ห้องเซิร์ฟเวอร์ & Rack (Diskless Master)',
    category: 'facilities',
    grade: 'ultimate',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    widthMeters: 2.0,
    heightMeters: 2.0,
    depth3D: 2.0,
    height3D: 2.2,
    seats: 0,
    baseCost: 35000,
    deskPrice: 35000,
    deskDesc: 'ตู้ Rack Server 42U แบบปิดทึบ มีระบบระบายความร้อน พัดลมเทอร์โบ และระบบไฟ UPS',
    chairModel: 'ไม่มีที่นั่ง (ระบบเซิร์ฟเวอร์ควบคุมอัตโนมัติ)',
    chairPrice: 0,
    chairCount: 0,
    deskColor: '#0f172a',
    accentColor: '#06b6d4',
    chairColor: '#0f172a',
    color: '#1e3a8a',
    icon: 'Server',
    warranty: 'รับประกันตู้ Rack และระบบระบายความร้อน 5 ปี',
    leadTime: '5 - 7 วันทำการ',
    material: 'ตู้ Rack มาตรฐานสากล 19 นิ้ว 42U เหล็ก SPCC หนา 2.0 มม. + ประตูกระจกนิรภัยพร้อมกุญแจดิจิทัล + พัดลมระบายอากาศ 4 ตัว',
    desc: 'ห้องศูนย์รวมเครื่องแม่ข่าย Diskless และระบบเครือข่าย 10Gbps'
  },
  {
    type: 'cafe-bar',
    name: 'สแน็กบาร์ & จุดเครื่องดื่ม (Cafe Bar)',
    category: 'facilities',
    grade: 'pro',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    widthMeters: 3.5,
    heightMeters: 2.2,
    depth3D: 2.2,
    height3D: 1.4,
    seats: 0,
    baseCost: 55000,
    deskPrice: 55000,
    deskDesc: 'เคาน์เตอร์บาร์น้ำ ตู้แช่เครื่องดื่มทรงสูง และจุดจัดเตรียมอาหารสำเร็จรูป',
    chairModel: 'ไม่มีที่นั่ง (โซนบริการ)',
    chairPrice: 0,
    chairCount: 0,
    deskColor: '#1e293b',
    accentColor: '#f59e0b',
    chairColor: '#0f172a',
    color: '#38bdf8',
    icon: 'Coffee',
    warranty: 'รับประกันโครงสร้างบาร์ 3 ปี และระบบประปา/ซิงก์ 2 ปี',
    leadTime: '12 - 16 วันทำการ',
    material: 'ท็อปสแตนเลส Food Grade 304 ผสมผสานหินสังเคราะห์ + ซิงก์ล้างจานเดี่ยว + จุดต่อปลั๊กเครื่องชงกาแฟและหม้อทอดไร้น้ำมัน',
    desc: 'บาร์กาแฟสด เครื่องดื่มชูกำลัง และของว่างพร้อมเสิร์ฟถึงโต๊ะ'
  },
  {
    type: 'lounge-sofa',
    name: 'โซฟาพักผ่อน & กองเชียร์ (Spectator Lounge)',
    category: 'amenities',
    grade: 'standard',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    widthMeters: 3.2,
    heightMeters: 1.8,
    depth3D: 1.8,
    height3D: 0.9,
    seats: 4,
    baseCost: 32000,
    deskPrice: 8000,
    deskDesc: 'โต๊ะกลางกระจกนิรภัยทรงโมเดิร์น',
    chairModel: 'ชุดโซฟาหนัง L-Shape 4 ที่นั่ง นุ่มสบาย',
    chairPrice: 24000,
    chairCount: 1,
    deskColor: '#0f172a',
    accentColor: '#64748b',
    chairColor: '#1e293b',
    color: '#64748b',
    icon: 'Users',
    warranty: 'รับประกันโครงสร้างโซฟาและฟองน้ำความหนาแน่นสูง 3 ปี',
    leadTime: '7 - 10 วันทำการ',
    material: 'โครงไม้เนื้อแข็งอบแห้งกันมอด + เบาะหุ้มหนัง PU ทนการขูดขีดกันน้ำ + โต๊ะกลางโครงสแตนเลสท็อปกระจกเทมเปอร์ 8 มม.',
    desc: 'โซฟาพักผ่อนสำหรับผู้ติดตามและกองเชียร์นั่งชมการแข่งขันผ่านจอยักษ์'
  },
  {
    type: 'door-entrance',
    name: 'ประตูทางเข้าหลัก (Main Glass/Wood Door)',
    category: 'architectural',
    grade: 'pro',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    widthMeters: 1.6,
    heightMeters: 0.4,
    depth3D: 0.4,
    height3D: 2.4,
    seats: 0,
    baseCost: 18000,
    deskPrice: 18000,
    deskDesc: 'ประตูบานคู่พร้อมวงกบ ระบบโช้กอัพอัตโนมัติ และมือจับสแตนเลสทรงโมเดิร์น',
    chairModel: 'โครงสร้างสถาปัตยกรรม (ไม่มีเก้าอี้)',
    chairPrice: 0,
    chairCount: 0,
    deskColor: '#78350f',
    accentColor: '#d97706',
    chairColor: '#0f172a',
    color: '#b45309',
    icon: 'DoorOpen',
    warranty: 'รับประกันวงกบและโช้กอัพประตู 3 ปี',
    leadTime: '5 - 7 วันทำการ',
    material: 'วงกบไม้สังเคราะห์ WPC กันปลวกกันน้ำ + บานกระจกนิรภัยเทมเปอร์ตัดแสง 10 มม. + โช้กอัพฝังพื้นระบบ Soft-Closing',
    desc: 'ประตูทางเข้าหลักของร้าน ออกแบบกว้างขวางเข้า-ออกสะดวก'
  },
  {
    type: 'window-panoramic',
    name: 'หน้าต่างกระจกบานใหญ่ (Panoramic Glass Window)',
    category: 'architectural',
    grade: 'pro',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
    widthMeters: 3.6,
    heightMeters: 0.3,
    depth3D: 0.3,
    height3D: 2.2,
    seats: 0,
    baseCost: 22000,
    deskPrice: 22000,
    deskDesc: 'กระจกนิรภัยเทมเปอร์ตัดแสง 12 มม. พร้อมเฟรมอะลูมิเนียมสีดำด้าน',
    chairModel: 'โครงสร้างสถาปัตยกรรม (ไม่มีเก้าอี้)',
    chairPrice: 0,
    chairCount: 0,
    deskColor: '#0f172a',
    accentColor: '#0284c7',
    chairColor: '#0f172a',
    color: '#0284c7',
    icon: 'Maximize2',
    warranty: 'รับประกันโครงสร้างเฟรมและซีลกันรั่วซึม 5 ปี',
    leadTime: '7 - 10 วันทำการ',
    material: 'กระจก Laminate Heat-Strengthened 12 มม. เคลือบสารสะท้อนรังสี UV + กรอบอะลูมิเนียม Powder Coat ป้องกันสนิม',
    desc: 'หน้าต่างกระจกชมวิวด้านหน้าอาคาร รับแสงธรรมชาติและโชว์บรรยากาศในร้าน'
  }
];

export const HARDWARE_TIERS = {
  standard: {
    id: 'standard',
    name: 'Tier 1: Esports Standard',
    tagline: 'คุ้มค่า คืนทุนเร็ว เหมาะสำหรับเล่นเกมยอดนิยมทุกเกม',
    unitCost: 36500, // THB per PC unit (tower + monitor + peripherals)
    cpu: 'Intel Core i5-14400F / AMD Ryzen 5 7500F',
    gpu: 'NVIDIA GeForce RTX 4060 8GB GDDR6',
    ram: '16GB DDR5 5600MHz (Dual Channel)',
    monitor: '24.5" Fast-IPS 240Hz 0.5ms HDR',
    gear: 'RGB Mechanical Blue/Red Switch + Gaming Mouse 1000Hz + Headset 7.1',
    chair: 'G-Speed Pro Racing Gaming Chair (PU Leather, Recline 160°)'
  },
  pro: {
    id: 'pro',
    name: 'Tier 2: Pro Competitive',
    tagline: 'สเปกนักกีฬาอีสปอร์ต ลื่นไหลทุกทัวร์นาเมนต์ เฟรมเรต 300+',
    unitCost: 52000,
    cpu: 'Intel Core i7-14700F / AMD Ryzen 7 7800X3D',
    gpu: 'NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X',
    ram: '32GB DDR5 6000MHz RGB',
    monitor: '27" Fast-IPS 280Hz - 360Hz QHD / FHD DyAc Ready',
    gear: 'Custom Coiled Keyboard (Hotswap) + Ultralight Wireless Mouse 4K/8K + Studio Headset',
    chair: 'Ergonomic Esports Mesh Chair (ปรับ Lumbar Support ระบายความร้อน)'
  },
  ultimate: {
    id: 'ultimate',
    name: 'Tier 3: Ultimate VIP / Streamer',
    tagline: 'ไฮเอนด์ขีดสุด สตรีมเมอร์ & 4K Ray Tracing พร้อมกล้องไมค์สตูดิโอ',
    unitCost: 84000,
    cpu: 'Intel Core i9-14900K / AMD Ryzen 9 7950X3D (Liquid Cooled 360mm)',
    gpu: 'NVIDIA GeForce RTX 4080 SUPER 16GB GDDR6X',
    ram: '64GB DDR5 6400MHz RGB',
    monitor: 'Main 27" OLED 360Hz-500Hz + 2nd Chat Screen 24" FHD',
    gear: 'Magnetic Switch Rapid-Trigger Keyboard + Pro Wireless Mouse + Broadcast Shure Mic + 4K Cam',
    chair: 'Secretlab TITAN Evo 2024 Series (Magnetic Memory Foam Pillow)'
  }
};

export const FIXED_INFRASTRUCTURE = {
  disklessServer: 115000, // Dual High-End Server, NVMe Enterprise, 10G SFP+ Dual NIC, Auto Game Updater
  networkEnterprise: 80000, // 2x Load Balancing Routers, 10G Cisco Backbone, CAT6A shielded cabling
  billingAndPOS: 35000, // POS Hardware, Cash Drawer, Barcode Scanner, Billing System Lifetime License
  franchiseFee: 150000, // Brand license, shop design blueprint, staff training, 1-year marketing launch
  interiorSqMeterCost: 2600, // THB per sq.m (Flooring, Cyberpunk Acoustic Wall, Linear RGB Lighting)
  airconSqMeterCost: 1100 // THB per sq.m (Commercial Inverter Cassette AC system)
};

export const PRESET_ROOMS = [
  {
    id: 'preset-s',
    name: 'Size S: ชุมชนสปีด (64 ตร.ม.)',
    width: 8,
    height: 8,
    desc: 'ขนาด 8x8 ม. เหมาะกับพื้นที่อาคารพาณิชย์ 2 คูหา รองรับ 20-26 เครื่อง คืนทุนเร็ว',
    defaultItems: [
      { id: 'item-1', type: 'cashier-counter', x: 0.5, y: 0.5, rotation: 0 },
      { id: 'item-2', type: 'server-room', x: 5.5, y: 0.5, rotation: 0 },
      { id: 'item-3', type: 'pc-row-4', x: 0.5, y: 2.8, rotation: 0 },
      { id: 'item-4', type: 'pc-row-4', x: 0.5, y: 4.5, rotation: 0 },
      { id: 'item-5', type: 'pc-row-4', x: 0.5, y: 6.2, rotation: 0 },
      { id: 'item-6', type: 'pc-row-2', x: 5.2, y: 3.5, rotation: 90 },
      { id: 'item-7', type: 'pc-row-2', x: 5.2, y: 5.5, rotation: 90 }
    ]
  },
  {
    id: 'preset-m',
    name: 'Size M: มาตรฐานอารีนา (120 ตร.ม.)',
    width: 12,
    height: 10,
    desc: 'ขนาด 12x10 ม. เหมาะกับอาคารเดี่ยวหรือในห้าง รองรับ 40-52 เครื่อง พร้อมห้อง VIP 1 ห้อง',
    defaultItems: [
      { id: 'item-1', type: 'cashier-counter', x: 0.8, y: 0.6, rotation: 0 },
      { id: 'item-2', type: 'cafe-bar', x: 4.2, y: 0.6, rotation: 0 },
      { id: 'item-3', type: 'server-room', x: 9.5, y: 0.6, rotation: 0 },
      { id: 'item-4', type: 'vip-room-5', x: 0.8, y: 5.8, rotation: 0 },
      { id: 'item-5', type: 'pc-island-6', x: 6.8, y: 3.5, rotation: 0 },
      { id: 'item-6', type: 'pc-island-6', x: 6.8, y: 6.5, rotation: 0 },
      { id: 'item-7', type: 'pc-row-4', x: 0.8, y: 3.2, rotation: 0 },
      { id: 'item-8', type: 'lounge-sofa', x: 7.2, y: 0.6, rotation: 0 }
    ]
  },
  {
    id: 'preset-l',
    name: 'Size L: แฟลกชิปอีสปอร์ตเซ็นเตอร์ (216 ตร.ม.)',
    width: 18,
    height: 12,
    desc: 'ขนาด 18x12 ม. อารีนาเต็มรูปแบบ รองรับ 70-90+ เครื่อง พร้อมเวทีแข่งขัน 5v5 และ 2 VIP Rooms',
    defaultItems: [
      { id: 'item-1', type: 'stage-5v5', x: 4.8, y: 0.6, rotation: 0 },
      { id: 'item-2', type: 'cashier-counter', x: 0.8, y: 0.6, rotation: 0 },
      { id: 'item-3', type: 'server-room', x: 15.2, y: 0.6, rotation: 0 },
      { id: 'item-4', type: 'cafe-bar', x: 14.0, y: 3.2, rotation: 90 },
      { id: 'item-5', type: 'lounge-sofa', x: 7.5, y: 4.5, rotation: 0 },
      { id: 'item-6', type: 'vip-room-5', x: 0.8, y: 7.8, rotation: 0 },
      { id: 'item-7', type: 'vip-room-5', x: 6.2, y: 7.8, rotation: 0 },
      { id: 'item-8', type: 'pc-island-6', x: 12.0, y: 6.5, rotation: 0 },
      { id: 'item-9', type: 'pc-island-6', x: 12.0, y: 9.2, rotation: 0 }
    ]
  }
];

export const INSTALLATION_TIMELINE = [
  {
    week: 'สัปดาห์ที่ 1',
    title: 'สำรวจหน้างาน & ออกแบบ 3D Final Blueprint',
    tasks: ['ทีมวิศวกรและอินทีเรียร์เข้าวัดหน้างานจริง', 'ทำแปลนระบบไฟฟ้า ท่อแอร์ ระบบ LAN', 'สรุปสเปกและจัดเตรียมอุปกรณ์']
  },
  {
    week: 'สัปดาห์ที่ 2-3',
    title: 'งานโครงสร้าง ตกแต่งภายใน & งานระบบ (M&E)',
    tasks: ['เดินสายไฟเมน 3 เฟส และสายแลน CAT6A Shielded', 'ติดตั้งแอร์คอนดิชั่นเนอร์และงานผนังเก็บเสียง', 'ติดตั้งระบบไฟอารีนา Linear Light และฝ้าเพดานสไตล์ Modern Esports']
  },
  {
    week: 'สัปดาห์ที่ 4',
    title: 'ลงเฟอร์นิเจอร์ & ประกอบเครื่องคอมพิวเตอร์',
    tasks: ['ติดตั้งโต๊ะเกมมิ่ง เก้าอี้ และเคาน์เตอร์แคชเชียร์', 'ประกอบและจัดวางเครื่องคอมพิวเตอร์ตามผังร้าน', 'เซ็ตอัปตู้ Rack เซิร์ฟเวอร์และ UPS ระบบไฟสำรอง']
  },
  {
    week: 'สัปดาห์ที่ 5',
    title: 'วางระบบ Diskless, Billing & Stress Test',
    tasks: ['โคลนนิ่งระบบปฏิบัติการ และคลังเกมกว่า 200+ เกม', 'ทดสอบ Stress Test พร้อมกันทุกเครื่อง 24 ชั่วโมง', 'เทรนนิ่งพนักงานการใช้งานระบบ POS และบริการลูกค้า']
  },
  {
    week: 'สัปดาห์ที่ 6',
    title: 'Grand Opening & แคมเปญการตลาดเปิดตัว',
    tasks: ['จัดทัวร์นาเมนต์เปิดร้านเพื่อดึงดูดลูกค้าและสร้างกระแส', 'ยิงแคมเปญโฆษณาโซเชียลมีเดียในรัศมีรอบร้าน', 'เปิดให้บริการอย่างเป็นทางการ']
  }
];
