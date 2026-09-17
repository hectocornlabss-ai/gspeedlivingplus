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

export const DEMO_TOURNAMENT_PHOTOS_50 = [
  { id: 'p-1', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', caption: 'เวทีแข่งขัน Main Stage ระบบแสงสีเสียงและจอ LED Wall 4K ขนาดยักษ์', category: 'stage' },
  { id: 'p-2', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80', caption: 'บรรยากาศนักกีฬาประจำที่นั่ง Battle Stations ซ้อมมือก่อนเริ่มแข่ง', category: 'players' },
  { id: 'p-3', url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', caption: 'เครื่องคอมพิวเตอร์สเปก Intel i9 + RTX 4080 SUPER พร้อมจอ 360Hz', category: 'gear' },
  { id: 'p-4', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', caption: 'การแข่งขันรอบ 16 ทีมสุดท้าย แข่งพร้อมกันแบบ Full LAN Setup', category: 'players' },
  { id: 'p-5', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', caption: 'มุมมองกว้างของอารีน่า แสงไฟธีมน้ำเงิน-ส้ม สื่อถึงการปะทะสุดเข้มข้น', category: 'stage' },
  { id: 'p-6', url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80', caption: 'หูฟังตัดเสียงรบกวนเกรดการแข่งขัน Pro Studio Noise-Cancelling', category: 'gear' },
  { id: 'p-7', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', caption: 'ระบบเน็ตเวิร์กแลนแบบแยกวง 10Gbps Latency ต่ำกว่า 1ms', category: 'gear' },
  { id: 'p-8', url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=800&q=80', caption: 'การอุ่นเครื่องทดสอบความพร้อมปุ่มกดและอัตราตอบสนองอุปกรณ์', category: 'players' },
  { id: 'p-9', url: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80', caption: 'กองเชียร์แน่นขนัดส่งเสียงเชียร์จังหวะ Clutch 1v3 สุดระทึก', category: 'crowd' },
  { id: 'p-10', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', caption: 'เอฟเฟกต์ไฟสเตจเปลี่ยนสีอัตโนมัติตามสถานะการวาง Spike ในเกม', category: 'stage' },
  { id: 'p-11', url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80', caption: 'โต๊ะแข่งขันแบบ Ergonomic ปรับระดับความสูงและพื้นที่ลากเมาส์พิเศษ', category: 'gear' },
  { id: 'p-12', url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80', caption: 'สมาธิและความมุ่งมั่นของกัปตันทีมระหว่างสั่งการแผนการบุก', category: 'players' },
  { id: 'p-13', url: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80', caption: 'คีย์บอร์ดกลไกสวิตช์ Hall Effect Rapid Trigger แม่นยำทุกเสี้ยววินาที', category: 'gear' },
  { id: 'p-14', url: 'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=800&q=80', caption: 'โซนวอร์มอัพห้องกระจกกันเสียงส่วนตัวสำหรับทีมที่รอขึ้นเวที', category: 'players' },
  { id: 'p-15', url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80', caption: 'โต๊ะนักพากย์ (Caster Desk) พร้อมจอวิเคราะห์สถิติสดแบบเรียลไทม์', category: 'caster' },
  { id: 'p-16', url: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=800&q=80', caption: 'เคสคอมพิวเตอร์ชุดน้ำเปิด Custom RGB โลโก้ G-SPEED ประจำเวที', category: 'gear' },
  { id: 'p-17', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80', caption: 'ทางเดินเปิดตัวนักกีฬา (Player Tunnel) พร้อมไฟสปอตไลต์อลังการ', category: 'stage' },
  { id: 'p-18', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80', caption: 'ถ้วยรางวัลเกียรติยศและเหรียญรางวัลชนะเลิศบนโพเดียม', category: 'trophy' },
  { id: 'p-19', url: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&q=80', caption: 'เมาส์เกมมิ่งน้ำหนักเบาพิเศษ 49g สำหรับการเล็งเป้าหมายที่เฉียบคม', category: 'gear' },
  { id: 'p-20', url: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=800&q=80', caption: 'ทัศนียภาพมุมสูงของอารีน่าระหว่างเปิดการแข่งขันอย่างเป็นทางการ', category: 'stage' },
  { id: 'p-21', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', caption: 'ทีมงานบรอดแคสต์และสวิตเชอร์ควบคุมการถ่ายทอดสดแบบ Multi-View', category: 'caster' },
  { id: 'p-22', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', caption: 'หน้าจอ Replay Slow Motion จังหวะช็อตเด็ด Headshot มหัศจรรย์', category: 'stage' },
  { id: 'p-23', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80', caption: 'อุปกรณ์ควบคุมเสียงและไมโครโฟนสำหรับการบรรยายภาษาไทยและอังกฤษ', category: 'caster' },
  { id: 'p-24', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', caption: 'โค้ชและผู้เล่นร่วมวิเคราะห์แผนที่และตัวละครระหว่างช่วงพักครึ่ง', category: 'players' },
  { id: 'p-25', url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80', caption: 'การจับมือแสดงสปิริตนักกีฬาระหว่างสองทีมหลังจบการแข่งขัน', category: 'players' },
  { id: 'p-26', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80', caption: 'พิธีมอบเช็คเงินรางวัล ฿100,000 แก่ทีมแชมป์เปียนประจำทัวร์นาเมนต์', category: 'trophy' },
  { id: 'p-27', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', caption: 'แฟนคลับถ่ายรูปเซลฟี่ร่วมกับนักแข่งคนโปรดหลังจบงาน', category: 'crowd' },
  { id: 'p-28', url: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=800&q=80', caption: 'ช่วงเวลาดีใจสุดขีดเมื่อยิงปิดเกมคว้า Match Point สุดระทึก', category: 'players' },
  { id: 'p-29', url: 'https://images.unsplash.com/photo-1486572788966-cfd3dfdd4a42?auto=format&fit=crop&w=800&q=80', caption: 'จุดลงทะเบียนนักกีฬาและการแจกไอดีการ์ดประจำตัวการแข่งขัน', category: 'players' },
  { id: 'p-30', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80', caption: 'บรรยากาศผู้ร่วมงานเข้าคิวลุ้นรับของรางวัล Lucky Draw เกมมิ่งเกียร์', category: 'crowd' },
  { id: 'p-31', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80', caption: 'แสงเลเซอร์และไพโรเทคนิคเปิดตัวคู่ชิงชนะเลิศ Grand Final', category: 'stage' },
  { id: 'p-32', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', caption: 'การแสดงดนตรีสดเปิดงานทัวร์นาเมนต์สร้างความตื่นเต้นให้แฟนๆ', category: 'crowd' },
  { id: 'p-33', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', caption: 'ป้ายไฟเชียร์และแบนเนอร์ของเหล่าแฟนคลับที่มาร่วมให้กำลังใจ', category: 'crowd' },
  { id: 'p-34', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', caption: 'สัมภาษณ์สดผู้เล่นยอดเยี่ยม MVP บนเวทีพร้อมล่ามแปลภาษา', category: 'caster' },
  { id: 'p-35', url: 'https://images.unsplash.com/photo-1558742569-fe6d39d0583a?auto=format&fit=crop&w=800&q=80', caption: 'ทีมช่างเทคนิคดูแลความสมบูรณ์ของระบบไฟฟ้าสำรอง UPS ตลอด 24 ชม.', category: 'gear' },
  { id: 'p-36', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', caption: 'การตรวจสอบความสมบูรณ์ของสายสัญญาณ Fiber Optic ก่อนเริ่มแข่ง', category: 'gear' },
  { id: 'p-37', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', caption: 'ห้องประชุมลับสำหรับกรรมการผู้ตัดสินเพื่อพิจารณาเทปย้อนหลัง', category: 'caster' },
  { id: 'p-38', url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80', caption: 'คณะผู้จัดงานและตัวแทนสปอนเซอร์ร่วมถ่ายภาพเปิดทัวร์นาเมนต์', category: 'trophy' },
  { id: 'p-39', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', caption: 'เหรียญรางวัลเกียรติยศเคลือบทองคำแท้สำหรับแชมป์รายการนี้', category: 'trophy' },
  { id: 'p-40', url: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=800&q=80', caption: 'มุมอาหารว่างและเครื่องดื่มเกลือแร่ฟรีสำหรับนักกีฬาทุกทีม', category: 'crowd' },
  { id: 'p-41', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', caption: 'บรรยากาศบาร์ Cyber Cafe บริการเมนูสดใหม่ตลอดคืนแข่งขัน', category: 'crowd' },
  { id: 'p-42', url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80', caption: 'ช่วงเวลาชูถ้วยรางวัลฉลองชัยชนะท่ามกลางสายฝนริบบิ้นทอง', category: 'trophy' },
  { id: 'p-43', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80', caption: 'ภาพความประทับใจรวมเหล่านักแข่งทั้ง 32 ทีมบนเวทีใหญ่', category: 'players' },
  { id: 'p-44', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', caption: 'ระบบคอมพิวเตอร์เซิร์ฟเวอร์ควบคุมผลคะแนนการแข่งขันแบบอัตโนมัติ', category: 'gear' },
  { id: 'p-45', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', caption: 'กราฟิก 3D Hologram แสดงสายการแข่งขันและผลคะแนนสด', category: 'stage' },
  { id: 'p-46', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', caption: 'การจับสลากแบ่งสายการแข่งขัน Group Draw ถ่ายทอดสดทั่วประเทศ', category: 'stage' },
  { id: 'p-47', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', caption: 'โค้ชให้คำแนะนำด้านจิตวิทยาและสมาธิระหว่างเวลานอก (Tactical Timeout)', category: 'players' },
  { id: 'p-48', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', caption: 'รอยยิ้มและมิตรภาพระหว่างผู้เล่นหลังจบแมตช์สุดดุเดือด', category: 'players' },
  { id: 'p-49', url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80', caption: 'แฟนเกมร่วมสนุกกับมินิเกมและตอบคำถามแจกของรางวัลช็อปปิ้งมอลล์', category: 'crowd' },
  { id: 'p-50', url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80', caption: 'โน้ตบุ๊กเกมมิ่งระดับท็อปสำหรับการสตรีมมุมมองบุคคลที่หนึ่ง (POV)', category: 'gear' },
  { id: 'p-51', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', caption: 'ผู้บริหาร G-Speed ขึ้นกล่าวปิดงานและประกาศทัวร์นาเมนต์ซีซันถัดไป', category: 'stage' },
  { id: 'p-52', url: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80', caption: 'ภาพความทรงจำส่งท้ายงาน แฟนคลับและนักกีฬาร่วมบันทึกประวัติศาสตร์', category: 'crowd' }
];

export const TOURNAMENTS = [
  {
    id: 'tour-1',
    title: 'G-SPEED VALORANT CHAMPIONSHIP 2026',
    game: 'VALORANT',
    gameCategory: 'Tactical 5v5 FPS',
    gameIcon: 'Crosshair',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    date: '28-30 กันยายน 2026',
    time: '11:00 - 20:00 น.',
    regStartDate: '1 กันยายน 2026',
    regEndDate: '25 กันยายน 2026',
    tourneyStartDate: '2026-09-28',
    tourneyEndDate: '2026-09-30',
    prizePool: '100,000 บาท',
    slots: '32 ทีม (เหลือ 6 ทีมสุดท้าย)',
    format: 'LAN Final @ Main Stage & Double Elimination',
    badge: 'รับสมัครด่วน',
    badgeType: 'magenta',
    status: 'Open',
    venue: 'G-Speed Esport Arena รามคำแหง 53 (Main Stage & Battleground Zone)',
    streamChannel: 'Twitch.tv/gspeed_esport & YouTube Gaming Live',
    desc: 'ทัวร์นาเมนต์อีสปอร์ตสุดยิ่งใหญ่แห่งปี 2026 ชิงเงินรางวัลรวมกว่า ฿100,000 รวบรวม 32 ยอดทีมทั่วประเทศมาดวลความแม่นยำบนเวที LAN Final ณ G-Speed Arena รามคำแหง 53 พร้อมระบบคอมพิวเตอร์สเปกทัวร์นาเมนต์ Intel Core i9 + RTX 4080 และหน้าจอ BenQ ZOWIE 360Hz ถ่ายทอดสดด้วยทีมงานแคสเตอร์ระดับมืออาชีพ',
    prizeDistribution: [
      { rank: 'แชมป์อันดับ 1', reward: '฿50,000 + ถ้วยเกียรติยศ + เหรียญทอง + ROG Gaming Gear Set' },
      { rank: 'รองชนะเลิศอันดับ 1', reward: '฿25,000 + เหรียญเงิน' },
      { rank: 'รองชนะเลิศอันดับ 2 ร่วม (2 ทีม)', reward: '฿10,000 ต่อทีม + เหรียญทองแดง' },
      { rank: 'MVP of Tournament', reward: '฿5,000 + หูฟัง ROG Delta S Wireless' }
    ],
    rules: [
      'ผู้เข้าแข่งขันทุกท่านต้องนำบัตรประชาชนหรือบัตรนักเรียน/นักศึกษามาแสดงตน ณ จุดลงทะเบียน',
      'อนุญาตให้นำเมาส์ คีย์บอร์ด และหูฟังส่วนตัวมาใช้ได้ โดยต้องผ่านการตรวจจากเจ้าหน้าที่เทคนิคก่อนเริ่มแข่ง',
      'เครื่องคอมพิวเตอร์ที่ใช้แข่งขับเคลื่อนด้วย Intel Core i9 + NVIDIA GeForce RTX 4080 และจอ BenQ ZOWIE 360Hz',
      'ห้ามใช้โปรแกรมโกง สคริปต์ช่วยเล่น หรือฉวยโอกาสจากข้อผิดพลาดของเกม (Bug Exploitation) หากตรวจพบปรับแพ้ทันที',
      'คำตัดสินของหัวหน้าผู้ตัดสิน (Head Referee) ถือเป็นที่สิ้นสุดในทุกกรณี'
    ],
    scheduleTimetable: [
      { time: '10:00 - 11:00 น.', stage: 'ลงทะเบียนหน้างาน & ตรวจสอบอุปกรณ์นักกีฬา (Player Check-in & Gear Check)' },
      { time: '11:15 - 14:00 น.', stage: 'รอบคัดเลือกแบ่งกลุ่ม Group Stage (Best of 1 - LAN Setup)' },
      { time: '14:30 - 17:30 น.', stage: 'รอบ 8 ทีม และ 4 ทีมสุดท้าย (Quarter & Semi-Finals - Best of 3)' },
      { time: '18:00 - 20:30 น.', stage: 'รอบชิงชนะเลิศ Grand Final บนเวที Main Stage (Best of 5 ถ่ายทอดสด)' }
    ],
    teams: [
      {
        id: 'team-1',
        name: 'Talon Academy',
        tag: 'TLN',
        logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
        seed: 1,
        status: 'Confirmed',
        captain: 'SScary (กัปตันทีม)',
        captainPhone: '081-234-5678',
        captainDiscord: 'sscary#0001',
        players: ['SScary', 'Crws', 'JitboyS', 'foxz', 'garnetS'],
        substitutes: ['Governor'],
        wins: 5,
        losses: 0
      },
      {
        id: 'team-2',
        name: 'Full Sense Elite',
        tag: 'FS',
        logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=150&q=80',
        seed: 2,
        status: 'Confirmed',
        captain: 'JohnOlsen (กัปตันทีม)',
        captainPhone: '089-876-5432',
        captainDiscord: 'johnolsen#1122',
        players: ['JohnOlsen', 'PTC', 'Leviathan', 'ApeX', 'ChAlalala'],
        substitutes: ['LAMMYSNAX'],
        wins: 4,
        losses: 1
      },
      {
        id: 'team-3',
        name: 'XERXIA NextGen',
        tag: 'XIA',
        logo: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=150&q=80',
        seed: 3,
        status: 'Confirmed',
        captain: 'Surf (กัปตันทีม)',
        captainPhone: '086-555-1234',
        captainDiscord: 'surf#4321',
        players: ['Surf', 'aRoche', 'b3ta', 'Siraphop', 'PPOverdose'],
        substitutes: ['xNova'],
        wins: 3,
        losses: 2
      },
      {
        id: 'team-4',
        name: 'Made in Thailand (MiTH)',
        tag: 'MiTH',
        logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=150&q=80',
        seed: 4,
        status: 'Confirmed',
        captain: 'Kadoom (กัปตันทีม)',
        captainPhone: '084-333-8899',
        captainDiscord: 'kadoom#9999',
        players: ['Kadoom', 'Delph1x', 'Kongared', 'Wannafly', 'CigaretteS'],
        substitutes: ['ViperX'],
        wins: 3,
        losses: 2
      },
      {
        id: 'team-5',
        name: 'G-Speed Slayer Squad',
        tag: 'GLP',
        logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80',
        seed: 5,
        status: 'Confirmed',
        captain: 'SpeedyKnight (กัปตันทีม)',
        captainPhone: '063-793-7704',
        captainDiscord: 'speedy#2026',
        players: ['SpeedyKnight', 'CyberViper', 'NeonPulse', 'PhantomShot', 'Valkyrie99'],
        substitutes: ['GhostAim'],
        wins: 2,
        losses: 1
      },
      {
        id: 'team-6',
        name: 'Ramkhamhaeng Titans',
        tag: 'RKH',
        logo: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=150&q=80',
        seed: 6,
        status: 'Confirmed',
        captain: 'BangkokBlade (กัปตันทีม)',
        captainPhone: '082-111-2233',
        captainDiscord: 'titan_cap#5555',
        players: ['BangkokBlade', 'ShadowStrike', 'IronShield', 'FrostBite', 'ThunderBolt'],
        substitutes: ['SolarFlare'],
        wins: 2,
        losses: 2
      }
    ],
    galleryPhotos: DEMO_TOURNAMENT_PHOTOS_50,
    seo: {
      metaTitle: 'G-SPEED VALORANT CHAMPIONSHIP 2026 | ทัวร์นาเมนต์ชิงเงินรางวัล ฿100,000',
      metaDesc: 'การแข่งขัน VALORANT LAN Tournament สุดยิ่งใหญ่ ณ G-Speed Arena รามคำแหง 53 เงินรางวัลรวม 100,000 บาท แข่งขันบนเวที Main Stage จอ 360Hz',
      keywords: 'VALORANT, GSpeed, ทัวร์นาเมนต์, แข่งเกม, อีสปอร์ต, รามคำแหง 53, LAN Final, 360Hz, ร้านเกม',
      ogImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      slug: 'gspeed-valorant-championship-2026'
    }
  },
  {
    id: 'tour-2',
    title: 'ROV UNIVERSITY BATTLE LEAGUE',
    game: 'Arena of Valor (RoV)',
    gameCategory: '5v5 Mobile MOBA',
    gameIcon: 'Smartphone',
    bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    date: '10-12 ตุลาคม 2026',
    time: '13:00 - 19:00 น.',
    regStartDate: '15 กันยายน 2026',
    regEndDate: '5 ตุลาคม 2026',
    tourneyStartDate: '2026-10-10',
    tourneyEndDate: '2026-10-12',
    prizePool: '50,000 บาท + ถ้วยรางวัลเกียรติยศ',
    slots: '64 ทีม (เต็มแล้ว)',
    format: 'Online Qualifier + LAN Semi-Final & Grand Final',
    badge: 'เต็มแล้ว',
    badgeType: 'amber',
    status: 'Full',
    venue: 'G-Speed Esport Arena รามคำแหง 53 (Mobile Studio Arena)',
    streamChannel: 'YouTube & Facebook Gaming @GSpeedEsport',
    desc: 'ศึกแห่งศักดิ์ศรีนิสิตนักศึกษาจาก 64 สถาบันทั่วประเทศ ประลองฝีมือและทีมเวิร์กในสมรภูมิ RoV 5v5 เพื่อชิงทุนการศึกษา ถ้วยรางวัลเกียรติยศ และเกียรติยศแห่งมหาวิทยาลัย จัดรอบ 4 ทีมสุดท้ายสดบนเวที Main Stage',
    prizeDistribution: [
      { rank: 'ชนะเลิศอันดับ 1', reward: '฿25,000 + ทุนการศึกษา + ถ้วยเกียรติยศ' },
      { rank: 'รองชนะเลิศอันดับ 1', reward: '฿15,000 + เหรียญเงิน' },
      { rank: 'รองชนะเลิศอันดับ 2 ร่วม (2 ทีม)', reward: '฿5,000 ต่อทีม + เหรียญทองแดง' }
    ],
    rules: [
      'สมาชิกทุกคนในทีมต้องเป็นนิสิตหรือนักศึกษาระดับปริญญาตรีและแสดงบัตรนักศึกษาที่ยังไม่หมดอายุ',
      'ใช้ระบบทัวร์นาเมนต์ Global Ban Pick (BP) ในรอบ 8 ทีมสุดท้ายเป็นต้นไป',
      'ห้ามใช้สมาร์ตโฟนที่มีการดัดแปลง OS หรือใช้โปรแกรมจำลอง Emulator เด็ดขาด',
      'การเชื่อมต่อต้องใช้ Wi-Fi 6 Dedicated Esport Network ที่ทางสนามจัดไว้เท่านั้น'
    ],
    scheduleTimetable: [
      { time: '13:00 น.', stage: 'พิธีเปิดและรายงานตัวนักศึกษาตัวแทนมหาวิทยาลัย' },
      { time: '14:00 น.', stage: 'รอบ 8 ทีมสุดท้าย Best of 3' },
      { time: '16:30 น.', stage: 'รอบรองชนะเลิศ Semi-Final Best of 5' },
      { time: '18:00 น.', stage: 'รอบชิงชนะเลิศ Grand Final Best of 7 พร้อมพิธีมอบรางวัล' }
    ],
    teams: [
      {
        id: 'rov-1',
        name: 'Chula Pegasus',
        tag: 'CU',
        logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
        seed: 1,
        status: 'Confirmed',
        captain: 'CU_Zeph (กัปตันทีม)',
        captainPhone: '081-999-8877',
        captainDiscord: 'zeph_cu#1234',
        players: ['CU_Zeph', 'CU_Airi', 'CU_Tulik', 'CU_Hayate', 'CU_Thane'],
        substitutes: ['CU_Krixi'],
        wins: 6,
        losses: 0
      },
      {
        id: 'rov-2',
        name: 'Thammasat Phoenix',
        tag: 'TU',
        logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=150&q=80',
        seed: 2,
        status: 'Confirmed',
        captain: 'TU_Raz (กัปตันทีม)',
        captainPhone: '089-777-6655',
        captainDiscord: 'raz_tu#5678',
        players: ['TU_Raz', 'TU_Nakroth', 'TU_Yorn', 'TU_Florentino', 'TU_Helen'],
        substitutes: ['TU_Elsu'],
        wins: 5,
        losses: 1
      },
      {
        id: 'rov-3',
        name: 'Kasetsart Bulls',
        tag: 'KU',
        logo: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=150&q=80',
        seed: 3,
        status: 'Confirmed',
        captain: 'KU_Lili (กัปตันทีม)',
        captainPhone: '085-444-3322',
        captainDiscord: 'lili_ku#9988',
        players: ['KU_Lili', 'KU_Zuka', 'KU_Violet', 'KU_Maloch', 'KU_Aya'],
        substitutes: ['KU_Taara'],
        wins: 4,
        losses: 2
      }
    ],
    galleryPhotos: DEMO_TOURNAMENT_PHOTOS_50,
    seo: {
      metaTitle: 'ROV UNIVERSITY BATTLE LEAGUE 2026 | ชิงทุนการศึกษา ฿50,000',
      metaDesc: 'การแข่งขัน RoV ระดับมหาวิทยาลัย 64 สถาบันทั่วประเทศ จัด ณ G-Speed Arena รามคำแหง 53 ชิงทุนการศึกษาและถ้วยเกียรติยศ',
      keywords: 'RoV, แข่ง RoV, มหาวิทยาลัย, G-Speed, รามคำแหง 53, อีสปอร์ต, ทุนการศึกษา',
      ogImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      slug: 'rov-university-battle-league-2026'
    }
  },
  {
    id: 'tour-3',
    title: 'CS2 BANGKOK SHOWDOWN INVITATIONAL',
    game: 'Counter-Strike 2',
    gameCategory: 'Tactical 5v5 FPS',
    gameIcon: 'Target',
    bannerImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    date: '24-25 ตุลาคม 2026',
    time: '10:00 - 22:00 น.',
    regStartDate: '1 ตุลาคม 2026',
    regEndDate: '20 ตุลาคม 2026',
    tourneyStartDate: '2026-10-24',
    tourneyEndDate: '2026-10-25',
    prizePool: '150,000 บาท',
    slots: '16 ทีมระดับ Pro Circuit',
    format: '128-Tick Dedicated Server on LAN',
    badge: 'เร็วๆ นี้',
    badgeType: 'cyan',
    status: 'Upcoming',
    venue: 'G-Speed Esport Arena รามคำแหง 53 (Main Stage Soundproof Booths)',
    streamChannel: 'Twitch.tv/cs2_gspeed & HLTV Live Score',
    desc: 'แมตช์เชิญชวน 16 สุดยอดทีม CS2 ชั้นนำของภูมิภาคเอเชียตะวันออกเฉียงใต้ ดวลกันด้วยระบบ Dedicated LAN Server ซับทิกแม่นยำพิเศษ จอ 540Hz OLED และห้องกระจกกันเสียงระดับ World Championship',
    prizeDistribution: [
      { rank: 'แชมป์อันดับ 1', reward: '฿80,000 + โควตาทัวร์ระดับนานาชาติ' },
      { rank: 'รองชนะเลิศอันดับ 1', reward: '฿40,000' },
      { rank: 'อันดับ 3-4', reward: '฿15,000 ต่อทีม' }
    ],
    rules: [
      'ใช้การตั้งค่า Official Valve CS2 Tournament Ruleset (MR12 + Overtime MR3)',
      'ห้ามใช้คำสั่ง Console ที่ไม่ได้รับอนุญาตหรือ Custom Aliases',
      'การแข่งขันรันบนเซิร์ฟเวอร์ LAN ในเครื่องแม่ข่ายของ G-Speed ความหน่วงต่ำกว่า 1ms'
    ],
    scheduleTimetable: [
      { time: '10:00 น.', stage: 'พิธีเปิดและการคัดเลือกแผนที่ Map Veto' },
      { time: '11:00 - 15:00 น.', stage: 'รอบ Quarter-Finals (Bo3)' },
      { time: '16:00 - 19:00 น.', stage: 'รอบ Semi-Finals (Bo3)' },
      { time: '19:30 - 22:00 น.', stage: 'รอบชิงชนะเลิศ Grand Final (Bo5)' }
    ],
    teams: [
      {
        id: 'cs-1',
        name: 'NKT Global',
        tag: 'NKT',
        logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
        seed: 1,
        status: 'Confirmed',
        captain: 'BnTeT (กัปตันทีม)',
        captainPhone: '081-111-2222',
        captainDiscord: 'bntet#1111',
        players: ['BnTeT', 'Katsu', 'erkaSt', 'XigN', 'MachineGun'],
        substitutes: ['senzu'],
        wins: 4,
        losses: 0
      },
      {
        id: 'cs-2',
        name: 'The MongolZ TH Wing',
        tag: 'TMZ',
        logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=150&q=80',
        seed: 2,
        status: 'Confirmed',
        captain: 'bLitz (กัปตันทีม)',
        captainPhone: '082-222-3333',
        captainDiscord: 'blitz#2222',
        players: ['bLitz', 'Techno', 'mzinho', 'Senzu', '910'],
        substitutes: ['MaaRaa'],
        wins: 3,
        losses: 1
      }
    ],
    galleryPhotos: DEMO_TOURNAMENT_PHOTOS_50,
    seo: {
      metaTitle: 'CS2 BANGKOK SHOWDOWN INVITATIONAL 2026 | ชิง ฿150,000',
      metaDesc: 'การแข่งขัน Counter-Strike 2 ระดับนานาชาติ ชิงเงินรางวัล 150,000 บาท ณ G-Speed Arena รามคำแหง 53 Dedicated LAN Server',
      keywords: 'CS2, Counter-Strike 2, G-Speed, ทัวร์นาเมนต์, แข่ง LAN, รามคำแหง 53, HLTV, Bangkok Showdown',
      ogImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
      slug: 'cs2-bangkok-showdown-invitational-2026'
    }
  }
];

export const EVENT_CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด', icon: 'LayoutGrid', description: 'รวมกิจกรรมและการแข่งขันอีสปอร์ตทุกประเภทของ GLP', badgeColor: '#1d4ed8' },
  { id: 'tournament', label: 'การแข่งขัน & ทัวร์นาเมนต์', icon: 'Trophy', description: 'ทัวร์นาเมนต์ชิงเงินรางวัลระดับประเทศ ทั้ง LAN และ Online', badgeColor: '#f59e0b' },
  { id: 'publisher', label: 'งานเปิดตัวเกม & ค่ายเกม', icon: 'Gamepad2', description: 'งานแถลงข่าว เปิดแพตช์ใหม่ และความร่วมมือกับค่ายเกมชั้นนำ', badgeColor: '#10b981' },
  { id: 'community', label: 'กิจกรรมคอมมูนิตี้ & แจกรางวัล', icon: 'Gift', description: 'มีตติ้งแฟนคลับ กิจกรรมกระชับมิตร แจกของรางวัลเกมมิ่งเกียร์', badgeColor: '#8b5cf6' },
  { id: 'venue', label: 'บรรยากาศร้าน & แข่ง LAN 24 ชม.', icon: 'Zap', description: 'ภาพบรรยากาศผู้ใช้บริการ สเปกเครื่องเทพ และบริการ 24 ชั่วโมง', badgeColor: '#06b6d4' }
];

export const DEFAULT_ARTICLE_TAGS = [
  '#EsportsThailand',
  '#GLP2026',
  '#Tournament',
  '#GamingArena',
  '#LANParty',
  '#Audition',
  '#PUBG',
  '#VALORANT',
  '#RoV',
  '#Zone4',
  '#Community',
  '#NightOwl'
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
    tags: ['#EsportsThailand', '#GLP2026', '#Tournament', '#GamingArena', '#LANParty'],
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
    tags: ['#PUBG', '#Tournament', '#EsportsThailand', '#GLP2026', '#GamingArena'],
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
    tags: ['#Zone4', '#GamingArena', '#Community', '#GLP2026'],
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
    tags: ['#Audition', '#Community', '#Tournament', '#EsportsThailand', '#GLP2026'],
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
    tags: ['#EsportsThailand', '#GLP2026', '#Tournament', '#GamingArena', '#Audition', '#Community'],
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
    tags: ['#GamingArena', '#GLP2026', '#NightOwl', '#Community', '#LANParty'],
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
  },
  {
    type: 'vip-lounge-sofa',
    name: 'โซฟา VIP เลานจ์ & จอโค้ง 65 นิ้ว (VIP Console Lounge)',
    category: 'amenities',
    grade: 'vip',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    widthMeters: 3.6,
    heightMeters: 2.2,
    depth3D: 2.2,
    height3D: 1.8,
    seats: 4,
    baseCost: 65000,
    deskPrice: 20000,
    deskDesc: 'โต๊ะกลางหินอ่อนสั่งผลิตพร้อมจอโค้ง Ultra-wide 65 นิ้ว และขาแขวนปรับมุมองศา',
    chairModel: 'ชุดโซฟาหนังพรีเมียม L-Shape 4-5 ที่นั่ง นุ่มกระชับสรีระ',
    chairPrice: 45000,
    chairCount: 1,
    deskColor: '#090d16',
    accentColor: '#38bdf8',
    chairColor: '#0f172a',
    color: '#38bdf8',
    icon: 'Armchair',
    warranty: 'รับประกันโครงสร้างโซฟา 5 ปี และระบบจอดิจิทัล 3 ปี On-site',
    leadTime: '10 - 14 วันทำการ',
    material: 'โครงไม้เนื้อแข็งอบแห้งเคลือบสารกันปลวก + เบาะหนังแท้ผสม High Resilience Foam + จอแสดงผล Curved 4K 120Hz',
    desc: 'ชุดโซฟาพักผ่อนระดับพรีเมียมพร้อมจอโค้งยักษ์ เหมาะสำหรับห้อง VIP และโซนเล่นเกมคอนโซล PS5 / Nintendo Switch'
  },
  {
    type: 'smart-kiosk',
    name: 'ตู้คีออสก์บริการตนเองอัจฉริยะ (Smart Self-Order Kiosk)',
    category: 'facilities',
    grade: 'pro',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    widthMeters: 1.0,
    heightMeters: 0.8,
    depth3D: 0.8,
    height3D: 1.95,
    seats: 0,
    baseCost: 48000,
    deskPrice: 48000,
    deskDesc: 'ตู้ Kiosk ทัชสกรีน 32 นิ้ว พร้อมเครื่องสแกนบาร์โค้ด QR และเครื่องพิมพ์ใบเสร็จความร้อน',
    chairModel: 'โครงสร้างแบบยืนใช้งาน (ไม่มีเก้าอี้)',
    chairPrice: 0,
    chairCount: 0,
    deskColor: '#0f172a',
    accentColor: '#10b981',
    chairColor: '#0f172a',
    color: '#10b981',
    icon: 'Monitor',
    warranty: 'รับประกันตัวตู้และระบบหน้าจอสัมผัส 3 ปี On-site Service',
    leadTime: '7 - 10 วันทำการ',
    material: 'โครงสร้างเหล็กกล้า SPCC อบสีอุตสาหกรรม + กระจกหน้าจอทัชสกรีน Capacitive ป้องกันรอยขีดข่วน + ระบบระบายความร้อน 24 ชม.',
    desc: 'ตู้คีออสก์บริการตนเอง ลูกค้าสามารถสั่งอาหาร เติมเงินสมาชิก และชำระเงินผ่าน PromptPay ได้ตลอด 24 ชั่วโมง ลดภาระพนักงานเคาน์เตอร์'
  },
  {
    type: 'neon-brand-sign',
    name: 'ป้ายไฟนีออนโลโก้ GLP อะคริลิก 3D (3D Glowing Brand Sign)',
    category: 'architectural',
    grade: 'ultimate',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    widthMeters: 2.8,
    heightMeters: 0.3,
    depth3D: 0.3,
    height3D: 1.2,
    seats: 0,
    baseCost: 28000,
    deskPrice: 28000,
    deskDesc: 'ป้ายไฟอะคริลิกเลเซอร์ 3 มิติ โลโก้ GLP เรืองแสงนีออนเฟล็กซ์สีน้ำเงินและสกายบลู',
    chairModel: 'ป้ายไฟตกแต่งผนัง (ไม่มีเก้าอี้)',
    chairPrice: 0,
    chairCount: 0,
    deskColor: '#020617',
    accentColor: '#38bdf8',
    chairColor: '#020617',
    color: '#06b6d4',
    icon: 'Sparkles',
    warranty: 'รับประกันหม้อแปลงไฟ LED และตัวป้ายอะคริลิก 3 ปีเต็ม',
    leadTime: '5 - 7 วันทำการ',
    material: 'แผ่นอะคริลิกหล่อหนา 10 มม. แกะสลัก CNC + ไฟซิลิโคน Neon Flex 12V คุณภาพสูงกันความร้อน + หม้อแปลง Mean Well มาตรฐานสากล',
    desc: 'ป้ายไฟนีออนเรืองแสงโลโก้ G-Speed Living Plus สำหรับติดตั้งบริเวณผนังไฮไลต์ จุดเช็กอินถ่ายรูป และทางเข้าร้าน'
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
      { id: 'item-1', type: 'cashier-counter', x: 0.6, y: 0.6, rotation: 0 },
      { id: 'item-2', type: 'server-room', x: 5.4, y: 0.6, rotation: 0 },
      { id: 'item-3', type: 'pc-row-4', x: 0.6, y: 2.8, rotation: 0 },
      { id: 'item-4', type: 'pc-row-4', x: 0.6, y: 4.5, rotation: 0 },
      { id: 'item-5', type: 'pc-row-4', x: 0.6, y: 6.2, rotation: 0 },
      { id: 'item-6', type: 'pc-row-2', x: 6.0, y: 3.4, rotation: 90 }
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
      { id: 'item-2', type: 'cafe-bar', x: 4.5, y: 0.6, rotation: 0 },
      { id: 'item-3', type: 'server-room', x: 9.2, y: 0.6, rotation: 0 },
      { id: 'item-4', type: 'lounge-sofa', x: 0.8, y: 3.2, rotation: 0 },
      { id: 'item-5', type: 'vip-room-5', x: 0.8, y: 5.8, rotation: 0 },
      { id: 'item-6', type: 'pc-row-4', x: 6.4, y: 3.6, rotation: 0 },
      { id: 'item-7', type: 'pc-island-6', x: 6.8, y: 6.2, rotation: 0 }
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
      { id: 'item-4', type: 'cafe-bar', x: 15.0, y: 3.4, rotation: 90 },
      { id: 'item-5', type: 'lounge-sofa', x: 7.4, y: 4.6, rotation: 0 },
      { id: 'item-6', type: 'vip-room-5', x: 0.8, y: 7.8, rotation: 0 },
      { id: 'item-7', type: 'vip-room-5', x: 6.4, y: 7.8, rotation: 0 },
      { id: 'item-8', type: 'pc-island-6', x: 13.0, y: 7.4, rotation: 0 },
      { id: 'item-9', type: 'pc-island-6', x: 13.0, y: 9.8, rotation: 0 }
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
