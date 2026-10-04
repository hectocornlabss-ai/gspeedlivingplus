// Product Catalog & Specs for Gspeed Living Plus Store (โต๊ะ เก้าอี้ และอุปกรณ์ครบวงจร)

export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'สินค้าทั้งหมด', nameEn: 'All Products', nameZh: '全部商品', icon: 'LayoutGrid' },
  { id: 'desks', name: 'โต๊ะเกมมิ่ง & โต๊ะทำงาน', nameEn: 'Desks & Workstations', nameZh: '电竞桌与升降桌', icon: 'Table' },
  { id: 'chairs', name: 'เก้าอี้เกมมิ่ง & Ergonomic', nameEn: 'Chairs & Ergonomics', nameZh: '电竞椅与工学椅', icon: 'Armchair' },
  { id: 'accessories', name: 'อุปกรณ์เสริม & รางสายไฟ', nameEn: 'Accessories & Mounts', nameZh: '外设配件与收纳', icon: 'Cpu' },
  { id: 'bundles', name: 'เซ็ตสุดคุ้ม (Bundle)', nameEn: 'Value Bundles', nameZh: '超值套装 (Bundle)', icon: 'Sparkles' }
];

export const EQUIPMENT_PRODUCTS = [
  // -------------------------------------------------------------
  // DESKS (โต๊ะ)
  // -------------------------------------------------------------
  {
    id: 'prod-desk-01',
    sku: 'GSP-DSK-BATTLE120',
    category: 'desks',
    name: 'Gspeed Pro Battle Desk (120x60 cm)',
    nameEn: 'Gspeed Pro Battle Desk 120cm',
    nameZh: 'Gspeed Pro Battle 对战电竞桌 (120x60 cm)',
    subtitle: 'โต๊ะเกมมิ่งโครงเหล็กคาร์บอน Z-Frame ลายเคฟลาร์ พร้อมรางจัดสายไฟ',
    subtitleEn: 'Z-Frame cold-rolled steel carbon fiber gaming desk with cable tray',
    subtitleZh: 'Z型加厚碳钢框架 碳纤维纹理桌面 标配隐藏式理线槽',
    badge: 'ขายดีอันดับ 1',
    badgeType: 'fire',
    price: 3890,
    originalPrice: 4590,
    stock: 45,
    rating: 4.9,
    reviewsCount: 128,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'กว้าง 120 x ลึก 60 x สูง 75 ซม.',
    dimensionsEn: 'W 120 x D 60 x H 75 cm',
    dimensionsZh: '宽 120 x 深 60 x 高 75 cm',
    weight: '18 กก. (รองรับน้ำหนักสูงสุด 150 กก.)',
    weightEn: '18 kg (Supports up to 150 kg)',
    weightZh: '18 kg (安全承重 150 kg)',
    materials: 'โครงสร้างเหล็กคาร์บอนกล่องหนา 1.5 มม. เคลือบสีฝุ่น Powder Coat + หน้าท็อป HPL ลายคาร์บอนไฟเบอร์กันน้ำ 100%',
    materialsEn: '1.5mm powder-coated carbon steel frame + 100% waterproof HPL carbon fiber desktop',
    materialsZh: '1.5mm加厚防锈喷涂冷轧碳钢 + 100%防水防刮高密碳纤维面板',
    warranty: 'รับประกันโครงสร้าง 3 ปีเต็ม',
    warrantyEn: '3-Year Structural Frame Warranty',
    warrantyZh: '3年主体架构原厂质保',
    leadTime: 'พร้อมส่งใน 1-2 วันทำการ',
    features: [
      'หน้าท็อปกันน้ำ ป้องกันรอยขีดข่วน พร้อมปาดเว้า Ergonomic รับสรีระ',
      'โครงสร้างขา Z-Frame เสริมคานคู่ มั่นคง ไม่โยกแม้สะบัดเมาส์แรง',
      'มีถาดจัดระเบียบสายไฟใต้โต๊ะ ซ่อนปลั๊กไฟและอะแดปเตอร์เรียบร้อย',
      'ที่แขวนหูฟังและที่วางแก้วน้ำในตัว ไม่เกะกะพื้นที่ทำงาน',
      'ช่องร้อยสายไฟคู่ซ้าย-ขวา พร้อมฝาครอบเก็บสายเรียบร้อย'
    ],
    featuresEn: [
      'Waterproof, scratch-resistant desktop with ergonomic contoured edge',
      'Reinforced Z-frame dual-beam structure for zero wobble during intense play',
      'Under-desk cable management tray hides power strips and adapters',
      'Integrated headphone hanger and cup holder for a clutter-free desk',
      'Dual cable pass-through grommets with neat covers'
    ],
    featuresZh: [
      '防水耐磨防刮擦微弧人体工学曲面桌面',
      'Z型双横梁加固冷轧碳钢框架，激烈对战稳固不晃',
      '桌底大容量下挂式理线槽，收纳排插与变压器',
      '标配专用电竞耳机挂钩与防倾倒杯架',
      '左右双理线孔设计，桌面走线整洁美观'
    ],
    colors: [
      { id: 'c-black', name: 'Stealth Black (ดำคาร์บอน)', nameEn: 'Stealth Black', nameZh: '碳黑款', hex: '#0f172a', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' },
      { id: 'c-blue', name: 'GLP Royal Blue (น้ำเงินรอยัล)', nameEn: 'GLP Royal Blue', nameZh: 'GLP 皇家蓝', hex: '#1d4ed8', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80' },
      { id: 'c-white', name: 'Pure White (ขาวมินิมอล)', nameEn: 'Pure White', nameZh: '纯白款', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80' }
    ],
    sizes: [
      { id: 's-120', name: '120 x 60 ซม.', nameEn: '120 x 60 cm', nameZh: '120 x 60 cm', extraPrice: 0 },
      { id: 's-140', name: '140 x 65 ซม.', nameEn: '140 x 65 cm', nameZh: '140 x 65 cm', extraPrice: 600 },
      { id: 's-160', name: '160 x 70 ซม.', nameEn: '160 x 70 cm', nameZh: '160 x 70 cm', extraPrice: 1200 }
    ],
    threeDConfig: {
      type: 'desk',
      deskColor: '#0f172a',
      accentColor: '#1d4ed8',
      hasMonitor: true,
      hasChair: false
    }
  },
  {
    id: 'prod-desk-02',
    sku: 'GSP-DSK-ELEC140',
    category: 'desks',
    name: 'Gspeed Cyber Lift Dual-Motor โต๊ะปรับระดับไฟฟ้า (140x70 cm)',
    nameEn: 'Gspeed Cyber Lift Dual-Motor Standing Desk (140x70 cm)',
    nameZh: 'Gspeed Cyber Lift 智能双电机升降桌 (140x70 cm)',
    subtitle: 'ระบบมอเตอร์คู่ เงียบ นุ่มนวล บันทึกความสูงได้ 4 ระดับ รองรับสุขภาพ',
    subtitleEn: 'Whisper-quiet dual motors with 4 memory presets for active ergonomics',
    subtitleZh: '双电机静音平稳升降，4档高度智能记忆，健康站坐交替办公',
    badge: 'เทคโนโลยีมอเตอร์คู่',
    badgeType: 'pro',
    price: 8900,
    originalPrice: 10900,
    stock: 24,
    rating: 5.0,
    reviewsCount: 86,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'กว้าง 140 x ลึก 70 x สูงปรับได้ 70 - 118 ซม.',
    dimensionsEn: 'W 140 x D 70 x Adjustable H 70 - 118 cm',
    dimensionsZh: '宽 140 x 深 70 x 升降高度 70 - 118 cm',
    weight: '32 กก. (รองรับน้ำหนักสูงสุด 130 กก.)',
    weightEn: '32 kg (Supports up to 130 kg)',
    weightZh: '32 kg (最大承重 130 kg)',
    materials: 'ขาเหล็กกล้า 3 ท่อน มอเตอร์คู่เยอรมัน + หน้าไม้ MDF หนา 25 มม. เคลือบลามิเนตมาตรฐาน E0 ปลอดสารฟอร์มาลดีไฮด์',
    materialsEn: '3-stage steel legs with German dual motors + 25mm E0 formaldehyde-free MDF laminate',
    materialsZh: '3节加厚钢制立柱+德国核心双电机+25mm E0级环保无甲醛免漆板',
    warranty: 'รับประกันมอเตอร์และโครงสร้าง 5 ปีเต็ม On-site Service',
    warrantyEn: '5-Year Motor & Structure Warranty (On-site Service)',
    warrantyZh: '5年电机与结构原厂质保 (上门服务)',
    leadTime: 'พร้อมส่งใน 1-3 วันทำการ',
    features: [
      'Dual-Motor ยกปรับระดับเงียบสนิท เสียงต่ำกว่า 45dB ความเร็ว 35 มม./วินาที',
      'แผงควบคุมหน้าจอดิจิทัล LED บันทึกระดับความสูงได้ 4 เมมโมรี่',
      'ระบบ Anti-Collision หยุดและถอยกลับอัตโนมัติเมื่อชนสิ่งกีดขวาง',
      'ช่องเสียบ Fast Charge USB-A และ Type-C ที่แผงหน้าปัด',
      'รางร้อยสายไฟ Heavy Duty ใต้โต๊ะรองรับปลั๊กรางใหญ่'
    ],
    featuresEn: [
      'Dual motors with ultra-quiet operation (<45dB) and 35mm/s lifting speed',
      'Smart digital LED controller with 4 custom memory height presets',
      'Anti-collision safety sensor stops and rebounds on contact',
      'Integrated fast-charge USB-A and Type-C ports on the front panel',
      'Heavy-duty under-desk raceway accommodates large power strips'
    ],
    featuresZh: [
      '双电机静音平稳驱动（运行音量低于45dB），升降速度35mm/s',
      '高清数显触控屏，支持4档常用高度智能记忆一键直达',
      '智能遇阻回弹安全防夹保护系统',
      '控制面板集成 USB-A 及 Type-C 快充接口',
      '桌底大容量重型走线槽，轻松容纳各类排插'
    ],
    colors: [
      { id: 'c-black', name: 'Matte Black (ดำด้าน)', nameEn: 'Matte Black', nameZh: '哑光黑', hex: '#1e293b' },
      { id: 'c-walnut', name: 'Dark Walnut (ไม้วอลนัทเข้ม)', nameEn: 'Dark Walnut', nameZh: '深胡桃木色', hex: '#451a03' },
      { id: 'c-white', name: 'Nordic White (ขาวนอร์ดิก)', nameEn: 'Nordic White', nameZh: '北欧白', hex: '#f8fafc' }
    ],
    sizes: [
      { id: 's-140', name: '140 x 70 ซม.', nameEn: '140 x 70 cm', nameZh: '140 x 70 cm', extraPrice: 0 },
      { id: 's-160', name: '160 x 80 ซม.', nameEn: '160 x 80 cm', nameZh: '160 x 80 cm', extraPrice: 1500 },
      { id: 's-180', name: '180 x 80 ซม.', nameEn: '180 x 80 cm', nameZh: '180 x 80 cm', extraPrice: 2800 }
    ],
    threeDConfig: {
      type: 'desk',
      deskColor: '#1e293b',
      accentColor: '#38bdf8',
      hasMonitor: true,
      hasChair: false
    }
  },
  {
    id: 'prod-desk-03',
    sku: 'GSP-DSK-COMM240',
    category: 'desks',
    name: 'Gspeed Arena Commercial โต๊ะคู่ 2 ที่นั่ง (240x70 cm)',
    nameEn: 'Gspeed Arena Commercial Double Desk (240x70 cm)',
    nameZh: 'Gspeed Arena 商用双人连排电竞桌 (240x70 cm)',
    subtitle: 'โต๊ะสำหรับร้านอินเทอร์เน็ตคาเฟ่และสำนักงาน แข็งแรงทนทานพิเศษ พร้อมฉากกั้น',
    subtitleEn: 'Heavy-duty commercial workstation for cyber cafes and modern offices with privacy partition',
    subtitleZh: '专为网咖及现代办公打造的重型连排对战桌，配备磨砂隐私隔板与全隐藏线槽',
    badge: 'สำหรับร้านเกม & ออฟฟิศ',
    badgeType: 'business',
    price: 7500,
    originalPrice: 8900,
    stock: 35,
    rating: 4.8,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'กว้าง 240 x ลึก 70 x สูง 75 ซม. (แบ่ง 2 สเตชัน ที่ละ 120 ซม.)',
    dimensionsEn: 'W 240 x D 70 x H 75 cm (2 Stations, 120 cm each)',
    dimensionsZh: '宽 240 x 深 70 x 高 75 cm (双人工位，每个120 cm)',
    weight: '38 กก. (รองรับน้ำหนักรวม 300 กก.)',
    weightEn: '38 kg (Supports up to 300 kg total)',
    weightZh: '38 kg (总承重达 300 kg)',
    materials: 'โครงเหล็กกล่องมาตรฐานอุตสาหกรรม พ่นกันสนิม + หน้าท็อปเมลามีนกันรอยหนา 25 มม. + แผงกั้นอะคริลิกขุ่น',
    materialsEn: 'Industrial powder-coated steel frame + 25mm scratch-resistant melamine + frosted acrylic divider',
    materialsZh: '工业级防锈喷涂钢架 + 25mm耐磨三聚氰胺防刮面板 + 半透磨砂亚克力隔断',
    warranty: 'รับประกันโครงสร้าง 5 ปี',
    warrantyEn: '5-Year Structural Frame Warranty',
    warrantyZh: '5年高负荷商用主体结构质保',
    leadTime: '3 - 5 วันทำการ (สั่งจำนวนมากราคาส่ง)',
    features: [
      'ออกแบบโมดูลาร์สามารถนำมาต่อแถวยาว 4, 6, 8 ที่นั่งได้แนบสนิทไร้รอยต่อ',
      'ฉากกั้นกลางกึ่งโปร่งแสง ช่วยสร้างสมาธิและความเป็นส่วนตัว',
      'ราง Wireway ขนาดใหญ่สำหรับซ่อนสายไฟและสายแลน CAT6A ทั้งระบบ',
      'มีจุดยึดเคสคอมพิวเตอร์และแขนจับจอทุกตำแหน่ง',
      'โครงสร้างเหล็กคานคู่รองรับการใช้งานต่อเนื่อง 24 ชั่วโมง'
    ],
    featuresEn: [
      'Modular design easily links into 4, 6, or 8-seat continuous rows seamlessly',
      'Semi-transparent divider enhances focus and privacy between players',
      'Oversized wireway raceway routes electrical and CAT6A LAN cables neatly',
      'Integrated PC case mounts and monitor arm support at every station',
      'Dual-beam steel frame engineered for 24/7 continuous operation'
    ],
    featuresZh: [
      '模块化可无限无缝拼接设计，轻松扩展4人、6人、8人连排工位',
      '磨砂半透明中央隔板，保障选手专注度与私密空间',
      '超大容量全贯通 Wireway 走线槽，强弱电及万兆网线有序隔离',
      '每个工位均配备防盗防震电脑主机下挂架及显示器支架加固点',
      '加厚双横梁钢架，满足网咖全天候 24 小时高强度使用'
    ],
    colors: [
      { id: 'c-black', name: 'All Black (ดำล้วน)', nameEn: 'All Black', nameZh: '纯黑款', hex: '#0f172a' },
      { id: 'c-blue', name: 'Blue Trim (ขอบน้ำเงิน GLP)', nameEn: 'GLP Blue Trim', nameZh: 'GLP 蓝黑款', hex: '#1d4ed8' }
    ],
    sizes: [
      { id: 's-240', name: '240 x 70 ซม. (2 ที่นั่ง)', nameEn: '240 x 70 cm (2 Stations)', nameZh: '240 x 70 cm (双人工位)', extraPrice: 0 },
      { id: 's-480', name: '480 x 70 ซม. (4 ที่นั่ง)', nameEn: '480 x 70 cm (4 Stations)', nameZh: '480 x 70 cm (四人工位)', extraPrice: 7000 }
    ],
    threeDConfig: {
      type: 'pc-row-2',
      deskColor: '#0f172a',
      accentColor: '#2563eb',
      hasMonitor: true,
      hasChair: false
    }
  },
  {
    id: 'prod-desk-04',
    sku: 'GSP-DSK-LSHAPE',
    category: 'desks',
    name: 'Gspeed Streamer Master โต๊ะเข้ามุมรูปตัว L (160x110 cm)',
    nameEn: 'Gspeed Streamer Master L-Shaped Corner Desk (160x110 cm)',
    nameZh: 'Gspeed Streamer Master L型转角主播电竞桌 (160x110 cm)',
    subtitle: 'พื้นที่กว้างขวาง วางได้ 2-3 จอ พร้อมชั้นวางอุปกรณ์และไฟ RGB Sound Sync',
    subtitleEn: 'Spacious corner desk supporting 2-3 monitors with sound-reactive RGB lighting',
    subtitleZh: '转角超大空间，轻松容纳2-3台电竞显示器，标配声控声波律动RGB灯光',
    badge: 'สายสตรีมเมอร์',
    badgeType: 'fire',
    price: 6490,
    originalPrice: 7800,
    stock: 18,
    rating: 4.9,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'กว้าง 160 x ลึก 110 x สูง 75 ซม.',
    dimensionsEn: 'W 160 x D 110 x H 75 cm',
    dimensionsZh: '宽 160 x 深 110 x 高 75 cm',
    weight: '26 กก. (รองรับน้ำหนักสูงสุด 180 กก.)',
    weightEn: '26 kg (Supports up to 180 kg)',
    weightZh: '26 kg (安全承重 180 kg)',
    materials: 'โครงเหล็กกล้าทรงสามเหลี่ยมค้ำยัน + หน้าท็อปคาร์บอนไฟเบอร์เกรดพรีเมียม',
    materialsEn: 'Triangular braced steel frame + Premium carbon fiber desktop',
    materialsZh: '三角强化力学加固碳钢框架 + 高性能耐刮碳纤维台面',
    warranty: 'รับประกันโครงสร้าง 3 ปี',
    warrantyEn: '3-Year Structural Frame Warranty',
    warrantyZh: '3年主体架构原厂质保',
    leadTime: 'พร้อมส่งใน 1-2 วันทำการ',
    features: [
      'เข้ามุมห้องพอดี ได้พื้นที่ทำงานเพิ่มขึ้น 40%',
      'สลับติดตั้งฝั่งซ้ายหรือฝั่งขวาได้ตามแปลนห้อง',
      'มีแถมแถบไฟ RGB Magnetic ใต้โต๊ะ พร้อมรีโมทปรับแสงตามเสียงเกม',
      'ชั้นวางเคสคอมพิวเตอร์แบบลอยตัว ป้องกันฝุ่นใต้พื้น',
      'ช่องร้อยสายไฟ 3 ตำแหน่ง พร้อมที่แขวนหูฟังและแก้วน้ำ'
    ],
    featuresEn: [
      'Fits corners perfectly, providing 40% more usable workstation area',
      'Reversible design can be installed left- or right-handed to suit room layout',
      'Includes magnetic RGB light strip with sound sync remote control',
      'Elevated floating PC tower shelf protects against floor dust',
      '3 cable routing ports plus integrated headphone and cup holders'
    ],
    featuresZh: [
      '贴合房间转角，桌面有效使用空间提升 40%',
      '左右两侧可自由互换安装，灵活适配不同房间格局',
      '附送磁吸式智能声控 RGB 律动灯带及无线遥控器',
      '悬空式电脑主机托架，有效隔绝地面灰尘湿气',
      '3个专用走线孔，附带耳机架与水杯架'
    ],
    colors: [
      { id: 'c-black', name: 'Stealth Carbon', nameEn: 'Stealth Carbon', nameZh: '深邃碳黑', hex: '#0f172a' },
      { id: 'c-white', name: 'Snow White', nameEn: 'Snow White', nameZh: '极地雪白', hex: '#ffffff' }
    ],
    sizes: [
      { id: 's-std', name: '160 x 110 ซม.', nameEn: '160 x 110 cm', nameZh: '160 x 110 cm', extraPrice: 0 }
    ],
    threeDConfig: {
      type: 'desk',
      deskColor: '#0f172a',
      accentColor: '#8b5cf6',
      hasMonitor: true,
      hasChair: false
    }
  },

  // -------------------------------------------------------------
  // CHAIRS (เก้าอี้)
  // -------------------------------------------------------------
  {
    id: 'prod-chair-01',
    sku: 'GSP-CHR-PROMAX',
    category: 'chairs',
    name: 'Gspeed Pro Master Ergonomic Gaming Chair',
    nameEn: 'Gspeed Pro Master Ergonomic Gaming Chair',
    nameZh: 'Gspeed Pro Master 人体工学专业电竞椅',
    subtitle: 'โฟมขึ้นรูป Molded Foam ความหนาแน่นสูง หนัง PU ทนรอยขีดข่วน ปรับเอน 165°',
    subtitleEn: 'High-density molded foam, scratch-resistant PU leather, 165° recline lock',
    subtitleZh: '高密度定型海绵，耐磨抗刮PU皮革，支持165°多档后仰锁定',
    badge: 'ยอดนิยมสูงสุด',
    badgeType: 'fire',
    price: 5990,
    originalPrice: 7500,
    stock: 50,
    rating: 4.9,
    reviewsCount: 194,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'กว้าง 68 x ลึก 70 x สูง 128 - 138 ซม. (เบาะกว้าง 54 ซม.)',
    dimensionsEn: 'W 68 x D 70 x H 128 - 138 cm (Seat Width 54 cm)',
    dimensionsZh: '宽 68 x 深 70 x 高 128 - 138 cm (座宽 54 cm)',
    weight: '24 กก. (รองรับน้ำหนักสูงสุด 160 กก.)',
    weightEn: '24 kg (Supports up to 160 kg)',
    weightZh: '24 kg (最大承重 160 kg)',
    materials: 'โครงเหล็กกล้าแบบเชื่อมไร้รอยต่อ + ฟองน้ำหล่อขึ้นรูป High Density Foam + หนัง PU Breathable ระบายอากาศ',
    materialsEn: 'Seamless heavy-duty steel frame + High-Density molded foam + Breathable PU Leather',
    materialsZh: '无缝高强度钢制框架 + 一体成型高密度冷泡海绵 + 亲肤透气PU皮革',
    warranty: 'รับประกันโครงสร้างและโช้คแก๊ส 3 ปี',
    warrantyEn: '3-Year Frame & Gas Lift Warranty (On-site Service)',
    warrantyZh: '3年主体框架与气压杆原厂质保 (上门服务)',
    leadTime: 'พร้อมส่งใน 1-2 วันทำการ',
    features: [
      'เบาะนั่งโฟมหนา นุ่มแน่น ไม่ยุบตัวตลอดอายุการใช้งาน',
      'พนักพิงปรับเอนนอนได้ตั้งแต่ 90° ถึง 165° พร้อมระบบโยก Rocking Mechanism',
      'ที่วางแขน 4D ปรับได้ 4 ทิศทาง (ขึ้น-ลง, หน้า-หลัง, ซ้าย-ขวา, หมุนเอียง)',
      'หมอนรองคอและหมอนรองหลัง เมมโมรี่โฟมเกรดพรีเมียม สบายลดปวดเมื่อย',
      'โช้คแก๊ส Class 4 ผ่านการรับรองมาตรฐานสากล SGS & TUV',
      'ฐานล้อเหล็ก 5 แฉกเคลือบสีดำเงา พร้อมล้อ PU ขนาด 65 มม. ลื่นเงียบ ไม่ทำลายพื้น'
    ],
    featuresEn: [
      'High-density molded foam cushion for long-lasting ergonomic comfort without sagging',
      '90° to 165° reclining backrest with synchronized rocking tilt mechanism',
      '4D multidirectional adjustable armrests (Height, forward/backward, lateral, and swivel)',
      'Premium memory foam neck pillow and lumbar cushion for spine fatigue relief',
      'SGS & TUV certified Class 4 heavy-duty explosion-proof gas lift cylinder',
      'Gloss black 5-star steel base with 65mm smooth, silent PU caster wheels'
    ],
    featuresZh: [
      '加厚高回弹定型海绵坐垫，久坐不塌陷，贴合臀部分散压力',
      '支持 90° 至 165° 大角度后仰调节，配备逍遥联动锁定机构',
      '4D 多向灵活调节扶手（升降、前后、左右平移及多角度旋转）',
      '标配慢回弹记忆棉护颈头枕与人体工学护腰靠垫',
      'SGS 与 TUV 国际双认证 Class 4 防爆重型气压杆',
      '亮黑强化五星钢制脚架搭配 65mm PU 静音滑轮，不刮伤地板'
    ],
    colors: [
      { id: 'c-black-blue', name: 'Black & GLP Blue (ดำ-น้ำเงิน)', nameEn: 'Black & GLP Blue', nameZh: '黑蓝款', hex: '#1d4ed8' },
      { id: 'c-all-black', name: 'Stealth Black (ดำด้านล้วน)', nameEn: 'Stealth Black', nameZh: '全黑款', hex: '#0f172a' },
      { id: 'c-black-orange', name: 'Cyber Orange (ดำ-ส้ม)', nameEn: 'Cyber Orange', nameZh: '黑橙款', hex: '#ea580c' },
      { id: 'c-white-black', name: 'Storm White (ขาว-ดำ)', nameEn: 'Storm White', nameZh: '白黑款', hex: '#f8fafc' }
    ],
    sizes: [
      { id: 's-std', name: 'Standard (ความสูง 155-185 ซม.)', nameEn: 'Standard (Height 155-185 cm)', nameZh: '标准款 (身高 155-185 cm)', extraPrice: 0 },
      { id: 's-xl', name: 'XL Throne (ความสูง 175-200 ซม. รองรับ 180 กก.)', nameEn: 'XL Throne (Height 175-200 cm, Max 180 kg)', nameZh: '加厚加宽王者款 (身高 175-200 cm，承重 180 kg)', extraPrice: 1200 }
    ],
    threeDConfig: {
      type: 'chair',
      chairColor: '#0f172a',
      accentColor: '#1d4ed8'
    }
  },
  {
    id: 'prod-chair-02',
    sku: 'GSP-CHR-AIRFLOW',
    category: 'chairs',
    name: 'Gspeed Air-Flow Pro เก้าอี้สุขภาพตาข่าย Full Mesh',
    nameEn: 'Gspeed Air-Flow Ergonomic Full Mesh Chair',
    nameZh: 'Gspeed Air-Flow Pro 全透气人体工学网椅',
    subtitle: 'ระบายอากาศ 100% ปรับรองรับกระดูกสันหลัง Dynamic Lumbar Support นั่งสบาย 8+ ชม.',
    subtitleEn: '100% breathable Korean mesh with dynamic adaptive lumbar support for 8+ hour sitting',
    subtitleZh: '全方位100%透气韩国高弹特网，动态自适应追腰支撑，久坐8+小时不闷热不酸痛',
    badge: 'แก้อาการปวดหลัง',
    badgeType: 'pro',
    price: 6890,
    originalPrice: 8500,
    stock: 30,
    rating: 5.0,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'กว้าง 65 x ลึก 65 x สูง 115 - 128 ซม.',
    dimensionsEn: 'W 65 x D 65 x H 115 - 128 cm',
    dimensionsZh: '宽 65 x 深 65 x 高 115 - 128 cm',
    weight: '19 กก. (รองรับน้ำหนักสูงสุด 150 กก.)',
    weightEn: '19 kg (Supports up to 150 kg)',
    weightZh: '19 kg (最大承重 150 kg)',
    materials: 'ผ้าตาข่ายเส้นใยโพลีเมอร์นำเข้าจากเกาหลี ยืดหยุ่นทนแรงดึง + ฐานอลูมิเนียมขัดเงา Die-Cast Aluminum Alloy',
    materialsEn: 'High-tensile imported Korean polymer mesh + Die-cast polished aluminum alloy base',
    materialsZh: '韩国进口抗拉高分子特网 + 航天级压铸一体成型高光铝合金五星脚',
    warranty: 'รับประกันโครงสร้างและตาข่าย 3 ปีเต็ม',
    warrantyEn: '3-Year Frame & Mesh Warranty',
    warrantyZh: '3年骨架与网布全保',
    leadTime: 'พร้อมส่งใน 1-2 วันทำการ',
    features: [
      'ตาข่าย Full Mesh ทั้งพนักพิงและเบาะนั่ง ระบายอากาศยอดเยี่ยม ไม่ร้อน ไม่อับชื้น',
      'Dynamic Adaptive Lumbar ปรับดันหลังส่วนล่างอัตโนมัติตามการขยับตัว',
      'ที่รองศีรษะ 3D กว้างพิเศษ ปรับขึ้น-ลง และหมุนทำมุมรับท้ายทอย',
      'ระบบกลไก Synchronized-Tilt ล็อคการเอนได้ 3 ระดับ (95°, 115°, 130°)',
      'เบาะนั่งเลื่อนสไลด์หน้า-หลังได้ (Seat Depth Adjustment) รองรับความยาวช่วงขา'
    ],
    featuresEn: [
      'Full mesh backrest and seat for 360° airflow and zero heat buildup',
      'Dynamic Adaptive Lumbar automatically adjusts lower-back support with your posture',
      'Extra-wide 3D headrest with multi-angle height and tilt adjustment',
      'Synchronized-tilt mechanism locks at 3 ergonomic angles (95°, 115°, 130°)',
      'Sliding seat depth adjustment to fit various leg lengths'
    ],
    featuresZh: [
      '靠背与座垫全特网设计，360°清凉透气，告别湿热出汗',
      '动态自适应腰靠，随身体坐姿变化主动追腰护腰',
      '超宽大3D头枕，支持高度升降与贴合颈椎多角度旋转',
      '三档线控自载重同步倾仰底盘（95°、115°、130°）',
      '座深前后滑动可调，完美承托大腿与膝盖关节'
    ],
    colors: [
      { id: 'c-charcoal', name: 'Space Grey (เทาสเปซเกรย์)', nameEn: 'Space Grey', nameZh: '太空灰', hex: '#334155' },
      { id: 'c-black', name: 'Graphite Black (ดำกราไฟต์)', nameEn: 'Graphite Black', nameZh: '石墨黑', hex: '#0f172a' }
    ],
    sizes: [
      { id: 's-std', name: 'Free Size ปรับตามสรีระ', nameEn: 'Free Size (Dynamic Fit)', nameZh: '人体工学自适应 (Free Size)', extraPrice: 0 }
    ],
    threeDConfig: {
      type: 'chair',
      chairColor: '#334155',
      accentColor: '#38bdf8'
    }
  },
  {
    id: 'prod-chair-03',
    sku: 'GSP-CHR-NETCAFE',
    category: 'chairs',
    name: 'Gspeed Arena NetCafe Heavy-Duty เก้าอี้ร้านเกมทนทานพิเศษ',
    nameEn: 'Gspeed Arena NetCafe Heavy-Duty Chair',
    nameZh: 'Gspeed Arena 网咖高负荷专用竞技椅',
    subtitle: 'ออกแบบเพื่อการใช้งานต่อเนื่อง 24 ชม. เบาะกว้างพิเศษ หนังหนา 1.2 มม. โครงเหล็กตัน',
    subtitleEn: 'Built for 24/7 continuous use with extra-wide cushion, 1.2mm thick PU, and solid steel core',
    subtitleZh: '专为24小时高频使用打造，超宽坐垫，1.2mm耐磨防刮皮革，全实心钢架',
    badge: 'สำหรับร้านเกม & องค์กร',
    badgeType: 'business',
    price: 3590,
    originalPrice: 4200,
    stock: 80,
    rating: 4.8,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'กว้าง 66 x ลึก 68 x สูง 120 - 130 ซม.',
    dimensionsEn: 'W 66 x D 68 x H 120 - 130 cm',
    dimensionsZh: '宽 66 x 深 68 x 高 120 - 130 cm',
    weight: '21 กก. (รองรับน้ำหนักสูงสุด 180 กก.)',
    weightEn: '21 kg (Supports up to 180 kg)',
    weightZh: '21 kg (最大承重 180 kg)',
    materials: 'โครงเหล็กกล้าเชื่อมหนาพิเศษ + ฟองน้ำ Recycled Rebonded Foam ผสม High Density แน่นไม่ยวบ + หนัง PVC ทนสารเคมีเช็ดแอลกอฮอล์ได้',
    materialsEn: 'Reinforced welded steel + High-Density rebonded foam + Chemical-resistant PVC leather',
    materialsZh: '加厚满焊精钢骨架 + 高密度复合定型海绵 + 抗酒精擦拭耐磨PVC皮革',
    warranty: 'รับประกันโครงสร้าง 3 ปี (พร้อมอะไหล่เปลี่ยนทุกชิ้นส่วน)',
    warrantyEn: '3-Year Structural Frame Warranty (Immediate spare parts support)',
    warrantyZh: '3年主体结构质保 (原厂现货配件速发)',
    leadTime: 'พร้อมส่งใน 1-3 วันทำการ (สั่ง 20 ตัวขึ้นไป ราคาส่งพิเศษ)',
    features: [
      'หนังหุ้มความหนา 1.2 มม. ทนต่อรอยขีดข่วน เช็ดทำความสะอาดด้วยแอลกอฮอล์ได้ไม่ลอก',
      'ฟองน้ำขึ้นรูปอัดแน่นพิเศษ รองรับน้ำหนักลูกค้าได้ทุกสัดส่วน นั่งสบายไม่จม',
      'กลไกปรับเอนแบบ Butterfly Mechanism ปรับได้สูงสุด 135°',
      'ที่วางแขนยึดแน่นกับตัวโครงสร้าง แข็งแรงทนทานต่อการกดทับ',
      'ล้อไนลอนขนาดใหญ่ ทนทาน รองรับการลากไถบนพื้นกระเบื้องหรืออีพ็อกซี่'
    ],
    featuresEn: [
      '1.2mm wear-resistant leather that can be sanitized with alcohol wipes without peeling',
      'High-density rebonded foam cushion supports all body sizes without collapsing',
      'Butterfly tilt mechanism reclines up to 135°',
      'Armrests bolted directly to steel chassis for maximum weight-bearing stability',
      'Large nylon caster wheels roll smoothly over tile and epoxy floors'
    ],
    featuresZh: [
      '1.2mm 加厚耐刮外皮，支持医用酒精日常消毒擦拭不爆皮',
      '特调高密度一体复合海绵，强力承托各种体型，久坐不变形',
      '蝶形逍遥升降底盘，支持最大 135° 后仰休憩',
      '强化连体扶手与钢架紧密固定，承受重压不松动',
      '大直径高耐磨尼龙滑轮，在瓷砖及环氧地坪上静音顺滑'
    ],
    colors: [
      { id: 'c-black-red', name: 'Black-Red (ดำ-แดงคลาสสิก)', nameEn: 'Black-Red Classic', nameZh: '黑红经典', hex: '#dc2626' },
      { id: 'c-black-blue', name: 'Black-Blue (ดำ-น้ำเงิน GLP)', nameEn: 'Black-Blue GLP', nameZh: '黑蓝竞技', hex: '#1d4ed8' },
      { id: 'c-all-black', name: 'Pure Black (ดำล้วน)', nameEn: 'Pure Black', nameZh: '纯黑商务', hex: '#0f172a' }
    ],
    sizes: [
      { id: 's-std', name: 'ขนาดมาตรฐานร้านอินเทอร์เน็ต', nameEn: 'Standard Cyber Cafe Size', nameZh: '网咖标准尺寸', extraPrice: 0 }
    ],
    threeDConfig: {
      type: 'chair',
      chairColor: '#0f172a',
      accentColor: '#dc2626'
    }
  },

  // -------------------------------------------------------------
  // ACCESSORIES (อุปกรณ์เสริม)
  // -------------------------------------------------------------
  {
    id: 'prod-acc-01',
    sku: 'GSP-ACC-ARM-DUAL',
    category: 'accessories',
    name: 'Gspeed Gas-Spring Dual Monitor Arm แขนจับจอคู่ (17" - 35")',
    nameEn: 'Gspeed Gas-Spring Dual Monitor Arm (17" - 35")',
    nameZh: 'Gspeed 气压双屏显示器机械臂支架 (17" - 35")',
    subtitle: 'ระบบโช้คแก๊สแท้ หมุนจอได้ 360° รับน้ำหนักข้างละ 12 กก. มีช่องเก็บสายในตัว',
    subtitleEn: 'Genuine gas-spring counterbalance with 360° rotation, 12kg per arm, and internal cable tracks',
    subtitleZh: '原装气压机械弹簧自由悬停，360°横竖屏旋转，单臂承重12kg，内置隐藏理线槽',
    badge: 'อุปกรณ์ขายดี',
    badgeType: 'fire',
    price: 1990,
    originalPrice: 2690,
    stock: 65,
    rating: 4.9,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'ปรับยืดแขนสูงสุด 52 ซม. / ปรับระดับความสูง 16 - 41 ซม.',
    dimensionsEn: 'Max Arm Reach 52 cm / Height Range 16 - 41 cm',
    dimensionsZh: '单臂最大延展 52 cm / 升降行程 16 - 41 cm',
    weight: '4.8 กก.',
    weightEn: '4.8 kg',
    weightZh: '4.8 kg',
    materials: 'อลูมิเนียมเกรดอากาศยานผสมเหล็กกล้า + ระบบสปริงแก๊สทนทาน 50,000 รอบ',
    materialsEn: 'Aerospace-grade aluminum + heavy-duty steel + 50,000-cycle gas spring',
    materialsZh: '航空级精铸铝合金 + 强化冷轧钢 + 50,000次高寿命气压芯',
    warranty: 'รับประกันโช้คแก๊สและชิ้นส่วน 3 ปี',
    warrantyEn: '3-Year Gas Cylinder & Structural Warranty',
    warrantyZh: '3年气压弹簧与机械主体质保',
    leadTime: 'พร้อมส่งทันที',
    features: [
      'รองรับหน้าจอขนาด 17 นิ้ว ถึง 35 นิ้ว ทั้งจอแบนและจอโค้ง (1000R-1800R)',
      'มาตรฐาน VESA 75x75 และ 100x100 มม. พร้อมแผ่นปลดเร็ว Quick Release',
      'ปรับก้ม-เงย +90°/-45°, หมุนซ้าย-ขวา 180°, หมุนแนวตั้ง-แนวนอน 360°',
      'ติดตั้งได้ 2 แบบ: ทั้งแบบหนีบโต๊ะ (C-Clamp) และแบบเจาะรูโต๊ะ (Grommet)',
      'ช่องเก็บสายไฟแบบซ่อนภายในแขนทั้งสองข้าง ดูสะอาดตาเป็นระเบียบ'
    ],
    featuresEn: [
      'Supports 17" to 35" flat and curved displays (1000R-1800R)',
      'Universal VESA 75x75 and 100x100mm with quick-release bracket',
      'Tilt +90°/-45°, swivel 180°, and full 360° landscape/portrait rotation',
      'Dual mounting options included: C-Clamp and Grommet mount',
      'Integrated cable routing channels conceal all monitor cables'
    ],
    featuresZh: [
      '兼容 17 至 35 寸电竞直屏与曲面屏（支持 1000R-1800R 大曲率）',
      '支持 VESA 75x75 及 100x100mm 国际标准，附带快拆安装面板',
      '俯仰角 +90°/-45°、左右摆动 180°、横竖屏 360° 任意旋转悬停',
      '标配穿孔与桌面夹持（C-Clamp）两种安装配件',
      '双臂内置隐藏式导线槽，电源线与DP线彻底隐形'
    ],
    colors: [
      { id: 'c-black', name: 'Matte Black (ดำด้าน)', nameEn: 'Matte Black', nameZh: '哑光黑', hex: '#0f172a' },
      { id: 'c-white', name: 'Polar White (ขาวเงา)', nameEn: 'Polar White', nameZh: '极光白', hex: '#ffffff' }
    ],
    sizes: [
      { id: 's-dual', name: 'แบบ 2 จอ (Dual Arm)', nameEn: 'Dual Arm (2 Monitors)', nameZh: '双屏机械臂 (Dual Arm)', extraPrice: 0 },
      { id: 's-single', name: 'แบบ 1 จอ (Single Arm)', nameEn: 'Single Arm (1 Monitor)', nameZh: '单屏机械臂 (Single Arm)', extraPrice: -700 }
    ],
    threeDConfig: null
  },
  {
    id: 'prod-acc-02',
    sku: 'GSP-ACC-CABLETRAY',
    category: 'accessories',
    name: 'Gspeed Heavy-Duty Steel Cable Management Tray รางเก็บสายไฟใต้โต๊ะ',
    nameEn: 'Gspeed Steel Under-Desk Cable Tray',
    nameZh: 'Gspeed 下挂式高承重钢制理线槽',
    subtitle: 'รางเหล็กคาร์บอนระบายความร้อน ติดตั้งง่าย วางปลั๊กรางใหญ่และหม้อแปลงได้ครบ',
    subtitleEn: 'Heat-dissipating carbon steel tray for large power strips and heavy adapters',
    subtitleZh: '通风散热型碳钢走线架，免打孔轻松固定，大功率排插与变压器一网打尽',
    badge: 'ช่วยจัดโต๊ะเนี๊ยบ',
    badgeType: 'pro',
    price: 690,
    originalPrice: 990,
    stock: 120,
    rating: 4.8,
    reviewsCount: 75,
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'ยาว 60 x กว้าง 16 x ลึก 12 ซม.',
    dimensionsEn: 'L 60 x W 16 x D 12 cm',
    dimensionsZh: '长 60 x 宽 16 x 深 12 cm',
    weight: '1.4 กก.',
    weightEn: '1.4 kg',
    weightZh: '1.4 kg',
    materials: 'เหล็กกล้าพ่นสีดำด้าน Powder Coat ทนทานไม่เป็นสนิม',
    materialsEn: 'Powder-coated rust-resistant carbon steel',
    materialsZh: '防锈磨砂喷塑强化碳钢',
    warranty: 'รับประกัน 1 ปี',
    warrantyEn: '1-Year Warranty',
    warrantyZh: '1年质保',
    leadTime: 'พร้อมส่งทันที',
    features: [
      'ช่องระบายอากาศแบบรังผึ้ง ไม่สะสมความร้อนจากหม้อแปลง',
      'ติดตั้งได้ทั้งแบบหนีบขอบโต๊ะ (ไม่ต้องเจาะ) หรือแบบขันน็อตใต้ท็อปโต๊ะ',
      'แถมสายรัดตีนตุ๊กแก Velcro Cable Tie 10 เส้นในกล่อง',
      'รองรับน้ำหนักได้สูงสุด 15 กก.'
    ],
    featuresEn: [
      'Honeycomb ventilation holes prevent power adapter heat buildup',
      'Installs via clamp (no drilling required) or under-desk screw mounting',
      'Includes 10 Velcro cable ties in the box',
      'Supports up to 15 kg of weight'
    ],
    featuresZh: [
      '蜂窝状散热孔结构，变压器与插座快速通风不积热',
      '支持免打孔桌沿夹具或螺丝旋紧双重安装方式',
      '包装附赠 10 根魔术贴扎线带',
      '最大安全承重高达 15 kg'
    ],
    colors: [
      { id: 'c-black', name: 'Black (ดำ)', nameEn: 'Black', nameZh: '黑色', hex: '#0f172a' },
      { id: 'c-white', name: 'White (ขาว)', nameEn: 'White', nameZh: '白色', hex: '#ffffff' }
    ],
    sizes: [
      { id: 's-60', name: 'ยาว 60 ซม.', nameEn: 'Length 60 cm', nameZh: '长度 60 cm', extraPrice: 0 },
      { id: 's-80', name: 'ยาว 80 ซม.', nameEn: 'Length 80 cm', nameZh: '长度 80 cm', extraPrice: 200 }
    ],
    threeDConfig: null
  },
  {
    id: 'prod-acc-03',
    sku: 'GSP-ACC-MAT-XXL',
    category: 'accessories',
    name: 'Gspeed RGB Speed-Control XXL Gaming Desk Mat (900x400 mm)',
    nameEn: 'Gspeed RGB XXL Gaming Desk Mat (900x400 mm)',
    nameZh: 'Gspeed RGB XXL 超大电竞桌面垫 (900x400 mm)',
    subtitle: 'แผ่นรองโต๊ะกว้างขวาง กันน้ำ ไฟ RGB 14 โหมด ฐานยางกันลื่น เย็บขอบหนา 4 มม.',
    subtitleEn: 'Spacious waterproof desk mat with 14 RGB lighting modes and 4mm anti-fray stitched edge',
    subtitleZh: '宽阔防水桌面垫，14种RGB炫彩灯效，防滑天然橡胶底，4mm精密耐磨锁边',
    badge: 'กันน้ำ 100%',
    badgeType: 'fire',
    price: 590,
    originalPrice: 890,
    stock: 90,
    rating: 4.9,
    reviewsCount: 153,
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'กว้าง 90 x ยาว 40 x หนา 0.4 ซม.',
    dimensionsEn: 'W 90 x L 40 x Thickness 0.4 cm',
    dimensionsZh: '宽 90 x 长 40 x 厚 0.4 cm',
    weight: '0.7 กก.',
    weightEn: '0.7 kg',
    weightZh: '0.7 kg',
    materials: 'ผิวผ้า Micro-Weave Nano เคลือบสารสะท้อนน้ำ + ยางพาราธรรมชาติกันลื่น',
    materialsEn: 'Micro-weave nano cloth with hydrophobic coating + Natural non-slip rubber base',
    materialsZh: '纳米级微编织疏水面料 + 天然环保防滑橡胶基底',
    warranty: 'รับประกันระบบไฟ 1 ปี',
    warrantyEn: '1-Year RGB Lighting Warranty',
    warrantyZh: '1年RGB光纤电路质保',
    leadTime: 'พร้อมส่งทันที',
    features: [
      'ผิวสัมผัสแบบ Micro-textured ตอบสนองเซนเซอร์เมาส์ได้แม่นยำทั้ง Speed และ Control',
      'เส้นใยออปติกไฟ RGB 14 โหมดแสง (ไฟนิ่ง 7 สี + ไฟวิ่ง 7 รูปแบบ) ปุ่มกดเปลี่ยนโหมดในตัว',
      'เคลือบสาร Hydrophobic Coating น้ำและกาแฟหกไม่ซึม เช็ดออกได้ทันที',
      'สายถัก USB Type-C ยาว 1.8 ม. ถอดแยกได้'
    ],
    featuresEn: [
      'Micro-textured surface provides pinpoint accuracy for both speed and control',
      '14 RGB light modes (7 solid colors + 7 dynamic breathing effects) with built-in button',
      'Hydrophobic coating causes liquids and coffee to bead up for instant wipe-away',
      'Detachable 1.8m braided USB Type-C cable'
    ],
    featuresZh: [
      '高精度微纹理表面，兼具顺滑极速滑动与精准急停操控',
      '14 种 RGB 炫彩光效（7色单色常亮 + 7种动态跑马呼吸），一键切换',
      '高密度疏水涂层，水滴咖啡泼洒不渗透，一擦即净',
      '1.8 米可拆卸编织 Type-C 供电线'
     ],
    colors: [
      { id: 'c-black-glp', name: 'GLP Edition (ดำตัดขอบน้ำเงิน)', nameEn: 'GLP Blue Trim Edition', nameZh: 'GLP 蓝黑限定版', hex: '#1d4ed8' },
      { id: 'c-all-black', name: 'Stealth Black', nameEn: 'Stealth Black', nameZh: '暗夜纯黑版', hex: '#0f172a' }
    ],
    sizes: [
      { id: 's-900', name: '900 x 400 มม.', nameEn: '900 x 400 mm', nameZh: '900 x 400 mm', extraPrice: 0 }
    ],
    threeDConfig: null
  },
  {
    id: 'prod-acc-04',
    sku: 'GSP-ACC-ACOUSTIC',
    category: 'accessories',
    name: 'Gspeed Acoustic Sound-Proof Divider แผงกั้นซับเสียงตั้งโต๊ะ',
    nameEn: 'Gspeed Acoustic Sound-Proof Desk Divider',
    nameZh: 'Gspeed 桌面声学吸音降噪隔断屏风',
    subtitle: 'เส้นใย PET ซับเสียงสะท้อน ตัดเสียงรบกวน 70% ปักหมุดโน้ตได้ ติดตั้งแบบหนีบโต๊ะ',
    subtitleEn: 'Recycled PET fiber absorbing 70% of noise with pinnable felt and clamp mount',
    subtitleZh: '环保PET声学聚酯纤维，吸收70%人声回音与键盘杂音，支持大头针备忘，夹式免打孔安装',
    badge: 'สำหรับออฟฟิศ & สตรีม',
    badgeType: 'pro',
    price: 1290,
    originalPrice: 1690,
    stock: 40,
    rating: 4.8,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'กว้าง 100 x สูง 40 x หนา 1.8 ซม.',
    dimensionsEn: 'W 100 x H 40 x Thickness 1.8 cm',
    dimensionsZh: '宽 100 x 高 40 x 厚 1.8 cm',
    weight: '2.1 กก.',
    weightEn: '2.1 kg',
    weightZh: '2.1 kg',
    materials: 'เส้นใยโพลีเอสเตอร์รีไซเคิล 100% เป็นมิตรต่อสิ่งแวดล้อม ไร้กลิ่นอับ ไม่ลามไฟ',
    materialsEn: '100% recycled eco-friendly polyester fiber, flame-retardant and odor-free',
    materialsZh: '100% 环保再生聚酯纤维，阻燃防潮无异味',
    warranty: 'รับประกัน 1 ปี',
    warrantyEn: '1-Year Warranty',
    warrantyZh: '1年质保',
    leadTime: 'พร้อมส่งใน 1-2 วันทำการ',
    features: [
      'ค่าดูดซับเสียง NRC 0.85 ช่วยลดเสียงสะท้อนระหว่างสื่อสารหรือสตรีมมิ่ง',
      'ผิวผ้าสักหลาดสามารถใช้เข็มหมุดปักกระดาษโน้ต โพสต์อิท หรือรูปภาพได้',
      'ขาหนีบเหล็กแบบ C-Clamp ปรับระยะหนีบหน้าโต๊ะหนาได้ถึง 5 ซม.',
      'มุมโค้งมน ปลอดภัย ไม่ขูดขีดผู้ใช้งาน'
    ],
    featuresEn: [
      'NRC 0.85 sound absorption rating dampens voice echoes during stream and voice chat',
      'Dense felt surface allows pinning notes, sticky notes, or photos safely',
      'Heavy-duty C-clamp fits desk thickness up to 5 cm',
      'Smooth rounded corners for safety and comfort'
    ],
    featuresZh: [
      'NRC 0.85 卓越吸音系数，消除语音连麦与直播时的空间回声',
      '致密毛毡表面，可随时用图钉固定备忘录、便签或照片',
      '重型 C 型夹具支持厚度达 5cm 的各类桌面',
      '圆润圆角打磨设计，安全防磕碰'
    ],
    colors: [
      { id: 'c-grey', name: 'Charcoal Grey (เทาเข้ม)', nameEn: 'Charcoal Grey', nameZh: '深炭灰', hex: '#334155' },
      { id: 'c-blue', name: 'Royal Blue (น้ำเงินรอยัล)', nameEn: 'Royal Blue', nameZh: '皇家蓝', hex: '#1d4ed8' },
      { id: 'c-beige', name: 'Warm Beige (เบจธรรมชาติ)', nameEn: 'Warm Beige', nameZh: '暖燕麦色', hex: '#d4b996' }
    ],
    sizes: [
      { id: 's-100', name: 'กว้าง 100 ซม.', nameEn: 'Width 100 cm', nameZh: '宽度 100 cm', extraPrice: 0 },
      { id: 's-120', name: 'กว้าง 120 ซม.', nameEn: 'Width 120 cm', nameZh: '宽度 120 cm', extraPrice: 300 }
    ],
    threeDConfig: null
  },

  // -------------------------------------------------------------
  // BUNDLES (เซ็ตสุดคุ้ม)
  // -------------------------------------------------------------
  {
    id: 'prod-bnd-01',
    sku: 'GSP-BND-PROSTATION',
    category: 'bundles',
    name: 'Set: Gspeed Pro Battle Station Complete (โต๊ะ + เก้าอี้ + แขนจับจอ + แผ่นรอง)',
    nameEn: 'Gspeed Pro Battle Station Complete Set',
    nameZh: 'Gspeed Pro 一站式全套电竞对战工作站 (桌+椅+双臂+超大垫)',
    subtitle: 'เซ็ตจัดเต็มพร้อมลุย! โต๊ะ Battle 120cm + เก้าอี้ Pro Master + แขนจับจอคู่ + แผ่นรอง RGB',
    subtitleEn: 'All-in-one esports package: Battle Desk 120cm + Pro Master Chair + Dual Arm + RGB Mat',
    subtitleZh: '一站配齐！对战桌120cm + Pro Master电竞椅 + 气压双臂支架 + XXL RGB桌垫',
    badge: 'ประหยัด ฿2,070',
    badgeType: 'fire',
    price: 9990,
    originalPrice: 12060,
    stock: 20,
    rating: 5.0,
    reviewsCount: 78,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'ชุดเซ็ตสำหรับพื้นที่ขั้นต่ำ 1.5 x 1.5 ม.',
    dimensionsEn: 'Complete setup requires min. 1.5 x 1.5 m space',
    dimensionsZh: '整套工位建议占地面积 1.5 x 1.5 米以上',
    weight: 'น้ำหนักรวม 48 กก.',
    weightEn: 'Total Weight 48 kg',
    weightZh: '总重 48 kg',
    materials: 'โครงสร้างเหล็กคาร์บอน + หนัง PU เกรดโปร + อลูมิเนียมแขนจับจอ',
    materialsEn: 'Cold-rolled carbon steel + Pro-grade PU Leather + Die-cast Aluminum',
    materialsZh: '加厚冷轧碳钢 + 专业级PU皮革 + 航空铝合金',
    warranty: 'รับประกัน 3 ปีเต็มทุกชิ้นส่วน',
    warrantyEn: '3-Year Comprehensive Warranty on all parts',
    warrantyZh: '3年全配件原厂质保',
    leadTime: 'พร้อมส่งใน 1-2 วันทำการ (กทม./ปริมณฑล พร้อมบริการประกอบฟรี)',
    features: [
      'ครบจบในเซ็ตเดียว ไม่ต้องหาซื้อแยก เข้าคู่กันอย่างลงตัว',
      '1x Gspeed Pro Battle Desk (120x60 ซม.) พร้อมถาดเก็บสายไฟ',
      '1x Gspeed Pro Master Gaming Chair โฟมหล่อหนานุ่ม เอนนอน 165°',
      '1x Gas-Spring Dual Monitor Arm แขนจับจอคู่ 17-35 นิ้ว',
      '1x XXL RGB Mousepad ขนาด 90x40 ซม. กันน้ำ',
      'ประหยัดกว่าซื้อแยกถึง ฿2,070 พร้อมสิทธิ์แลกซื้ออุปกรณ์เสริมลด 30%'
    ],
    featuresEn: [
      'Complete curated set with perfectly matched ergonomics and design',
      '1x Gspeed Pro Battle Desk (120x60 cm) with cable management tray',
      '1x Gspeed Pro Master Gaming Chair with 165° recline and molded foam',
      '1x Gas-Spring Dual Monitor Arm supporting 17-35 inch monitors',
      '1x XXL RGB Waterproof Mousepad (90x40 cm)',
      'Save ฿2,070 compared to buying individually + 30% off accessories'
    ],
    featuresZh: [
      '一站式电竞旗舰配置，风格统一，免除繁琐搭配',
      '1x Gspeed Pro Battle 对战桌 (120x60 cm) 带走线槽',
      '1x Gspeed Pro Master 电竞椅 165°后仰高回弹定型海绵',
      '1x 气压双屏机械臂支架（支持 17-35 寸）',
      '1x XXL 防水 RGB 发光鼠标垫 (90x40 cm)',
      '相比单买立省 ฿2,070，更享外设配件加购7折特惠'
    ],
    colors: [
      { id: 'c-glp', name: 'Signature GLP Black-Blue (เซ็ตดำ-น้ำเงิน)', nameEn: 'Signature GLP Black-Blue', nameZh: 'GLP 黑蓝签名版', hex: '#1d4ed8' },
      { id: 'c-all-black', name: 'Stealth Blackout (เซ็ตดำด้านล้วน)', nameEn: 'Stealth Blackout', nameZh: '暗黑全黑版', hex: '#0f172a' }
    ],
    sizes: [
      { id: 's-desk120', name: 'โต๊ะ 120 ซม.', nameEn: 'Desk 120 cm', nameZh: '配备 120 cm 桌', extraPrice: 0 },
      { id: 's-desk140', name: 'อัปเกรดโต๊ะ 140 ซม.', nameEn: 'Upgrade to Desk 140 cm', nameZh: '升级 140 cm 桌', extraPrice: 600 }
    ],
    threeDConfig: {
      type: 'pc-row-2',
      deskColor: '#0f172a',
      accentColor: '#1d4ed8',
      chairColor: '#0f172a',
      hasMonitor: true,
      hasChair: true
    }
  },
  {
    id: 'prod-bnd-02',
    sku: 'GSP-BND-NETCAFE10',
    category: 'bundles',
    name: 'B2B Set: Gspeed Cyber Cafe Starter Kit (10 ที่นั่ง)',
    nameEn: 'Gspeed Cyber Cafe Starter Pack (10 Stations)',
    nameZh: 'B2B Gspeed 网咖与电竞实训室起步十连座套餐 (10位)',
    subtitle: 'ชุดจัดเซ็ตสำหรับเปิดร้านเกม / โรงเรียน / ห้องแล็บคอมพิวเตอร์ 10 ที่นั่ง พร้อมรางสายไฟและฉากกั้น',
    subtitleEn: 'Turnkey package for gaming cafes, schools, and esport labs: 10 stations with partitions and wireways',
    subtitleZh: '专为电竞网咖、高校实训基地、电竞教室打造的10人套包，含全套隔断与集中走线系统',
    badge: 'แพ็กเกจ B2B ราคาส่ง',
    badgeType: 'business',
    price: 49900,
    originalPrice: 58900,
    stock: 10,
    rating: 5.0,
    reviewsCount: 34,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80'
    ],
    dimensions: 'โต๊ะคู่ 5 ตัว (รวม 10 ที่นั่ง) ยาวแถวละ 6 ม. x 2 แถว',
    dimensionsEn: '5 double desks (10 stations total) in 2 rows of 6 meters',
    dimensionsZh: '5张双人对战桌（共10工位），双排排列每排长6米',
    weight: 'น้ำหนักรวม 400 กก.',
    weightEn: 'Total Weight 400 kg',
    weightZh: '总重 400 kg',
    materials: 'เหล็กกล่องมาตรฐานอุตสาหกรรม + ท็อปเมลามีนกันรอยหนา 25 มม. + เก้าอี้ Netcafe Heavy-Duty',
    materialsEn: 'Industrial structural steel + 25mm scratchproof melamine + Heavy-duty NetCafe chairs',
    materialsZh: '工业级重型结构钢 + 25mm防刮三聚氰胺台面 + 重装耐磨竞技椅',
    warranty: 'รับประกันโครงสร้าง 5 ปี พร้อมบริการซ่อมบำรุงถึงสถานที่',
    warrantyEn: '5-Year Structural Warranty with on-site maintenance support',
    warrantyZh: '5年高负荷商用质保，曼谷及各大区提供上门快速维保',
    leadTime: '5 - 7 วันทำการ (บริการจัดส่งและติดตั้งทั่วประเทศ)',
    features: [
      '5x โต๊ะคอมพิวเตอร์ 2 ที่นั่ง Commercial (รวม 10 สเตชัน)',
      '10x เก้าอี้ร้านเกม Gspeed Netcafe Heavy-Duty โครงเหล็กทนทาน 24 ชม.',
      'ระบบราง Wireway เก็บสายไฟและสายแลนครบเซ็ตทั้ง 10 โต๊ะ',
      'ฉากกั้นกลางอะคริลิกสวยงาม ทันสมัย',
      'ออกใบเสนอราคา ใบกำกับภาษีเต็มรูปแบบ สำหรับยื่นเบิกงบหรือหักภาษีนิติบุคคล'
    ],
    featuresEn: [
      '5x Commercial Double Workstations (10 stations total)',
      '10x Gspeed NetCafe Heavy-Duty Chairs engineered for 24/7 gaming',
      'Complete Wireway raceway management for power and LAN cables',
      'Modern semi-transparent frosted acrylic central dividers',
      'Full Tax Invoice and official quotation provided for corporate tax deductions'
    ],
    featuresZh: [
      '5张 Commercial 双人电竞桌（共计 10 个独立工位）',
      '10把 Gspeed NetCafe 24小时耐磨防刮全实心钢骨架竞技椅',
      '全套 Wireway 工业级集中理线走线槽（强电+六类千兆网线）',
      '中央半透现代磨砂亚克力隔断',
      '随单提供正规全额增值税专用发票与对公采购合同'
    ],
    colors: [
      { id: 'c-blue', name: 'GLP Esports Standard (ดำ-น้ำเงิน)', nameEn: 'GLP Esports Standard (Black-Blue)', nameZh: 'GLP 电竞标准色 (黑蓝)', hex: '#1d4ed8' },
      { id: 'c-black', name: 'Industrial Black (ดำด้าน)', nameEn: 'Industrial Black', nameZh: '工业纯黑', hex: '#0f172a' }
    ],
    sizes: [
      { id: 's-10', name: 'แพ็กเกจ 10 ที่นั่ง', nameEn: '10-Station Package', nameZh: '10 工位套餐', extraPrice: 0 },
      { id: 's-20', name: 'แพ็กเกจ 20 ที่นั่ง (ประหยัดเพิ่ม)', nameEn: '20-Station Package (Extra Savings)', nameZh: '20 工位特惠套餐', extraPrice: 47000 }
    ],
    threeDConfig: {
      type: 'pc-row-4',
      deskColor: '#0f172a',
      accentColor: '#1d4ed8',
      chairColor: '#0f172a',
      hasMonitor: true,
      hasChair: true
    }
  }
];

// Helper to convert number to Thai Baht Text (e.g. 1,250 -> "หนึ่งพันสองร้อยห้าสิบบาทถ้วน")
export function thaiBahtText(num) {
  if (num === null || num === undefined || isNaN(num)) return '';
  num = Math.round(Number(num) * 100) / 100;
  if (num === 0) return 'ศูนย์บาทถ้วน';

  const numbers = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const units = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

  const splitNum = num.toFixed(2).split('.');
  const integerPart = splitNum[0];
  const decimalPart = splitNum[1];

  function convertGroup(digits) {
    let result = '';
    const len = digits.length;
    for (let i = 0; i < len; i++) {
      const digit = parseInt(digits[i], 10);
      const pos = len - i - 1;
      if (digit !== 0) {
        if (pos === 1 && digit === 1) {
          result += 'สิบ';
        } else if (pos === 1 && digit === 2) {
          result += 'ยี่สิบ';
        } else if (pos === 0 && digit === 1 && len > 1 && digits[len - 2] !== '0') {
          result += 'เอ็ด';
        } else {
          result += numbers[digit] + units[pos];
        }
      }
    }
    return result;
  }

  let text = '';
  // Support up to millions and billions
  if (integerPart.length > 6) {
    const millionAbove = integerPart.substring(0, integerPart.length - 6);
    const millionBelow = integerPart.substring(integerPart.length - 6);
    text += convertGroup(millionAbove) + 'ล้าน' + convertGroup(millionBelow) + 'บาท';
  } else {
    text += convertGroup(integerPart) + 'บาท';
  }

  if (decimalPart === '00') {
    text += 'ถ้วน';
  } else {
    const satangDigits = decimalPart;
    text += convertGroup(satangDigits) + 'สตางค์';
  }

  return text;
}
