// Product Catalog & Specs for Gspeed Living Plus Store (โต๊ะ เก้าอี้ และอุปกรณ์ครบวงจร)

export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'สินค้าทั้งหมด', nameEn: 'All Products', icon: 'LayoutGrid' },
  { id: 'desks', name: 'โต๊ะเกมมิ่ง & โต๊ะทำงาน', nameEn: 'Desks & Tables', icon: 'Table' },
  { id: 'chairs', name: 'เก้าอี้เกมมิ่ง & Ergonomic', nameEn: 'Chairs & Ergonomics', icon: 'Armchair' },
  { id: 'accessories', name: 'อุปกรณ์เสริม & รางสายไฟ', nameEn: 'Accessories & Mounts', icon: 'Cpu' },
  { id: 'bundles', name: 'เซ็ตสุดคุ้ม (Bundle)', nameEn: 'Value Bundles', icon: 'Sparkles' }
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
    subtitle: 'โต๊ะเกมมิ่งโครงเหล็กคาร์บอน Z-Frame ลายเคฟลาร์ พร้อมรางจัดสายไฟ',
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
    weight: '18 กก. (รองรับน้ำหนักสูงสุด 150 กก.)',
    materials: 'โครงสร้างเหล็กคาร์บอนกล่องหนา 1.5 มม. เคลือบสีฝุ่น Powder Coat + หน้าท็อป HPL ลายคาร์บอนไฟเบอร์กันน้ำ 100%',
    warranty: 'รับประกันโครงสร้าง 3 ปีเต็ม',
    leadTime: 'พร้อมส่งใน 1-2 วันทำการ',
    features: [
      'หน้าท็อปกันน้ำ ป้องกันรอยขีดข่วน พร้อมปาดเว้า Ergonomic รับสรีระ',
      'โครงสร้างขา Z-Frame เสริมคานคู่ มั่นคง ไม่โยกแม้สะบัดเมาส์แรง',
      'มีถาดจัดระเบียบสายไฟใต้โต๊ะ ซ่อนปลั๊กไฟและอะแดปเตอร์เรียบร้อย',
      'ที่แขวนหูฟังและที่วางแก้วน้ำในตัว ไม่เกะกะพื้นที่ทำงาน',
      'ช่องร้อยสายไฟคู่ซ้าย-ขวา พร้อมฝาครอบเก็บสายเรียบร้อย'
    ],
    colors: [
      { id: 'c-black', name: 'Stealth Black (ดำคาร์บอน)', hex: '#0f172a', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' },
      { id: 'c-blue', name: 'GLP Royal Blue (น้ำเงินรอยัล)', hex: '#1d4ed8', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80' },
      { id: 'c-white', name: 'Pure White (ขาวมินิมอล)', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80' }
    ],
    sizes: [
      { id: 's-120', name: '120 x 60 ซม.', extraPrice: 0 },
      { id: 's-140', name: '140 x 65 ซม.', extraPrice: 600 },
      { id: 's-160', name: '160 x 70 ซม.', extraPrice: 1200 }
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
    nameEn: 'Gspeed Cyber Lift Dual-Motor Standing Desk',
    subtitle: 'ระบบมอเตอร์คู่ เงียบ นุ่มนวล บันทึกความสูงได้ 4 ระดับ รองรับสุขภาพ',
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
    weight: '32 กก. (รองรับน้ำหนักสูงสุด 130 กก.)',
    materials: 'ขาเหล็กกล้า 3 ท่อน มอเตอร์คู่เยอรมัน + หน้าไม้ MDF หนา 25 มม. เคลือบลามิเนตมาตรฐาน E0 ปลอดสารฟอร์มาลดีไฮด์',
    warranty: 'รับประกันมอเตอร์และโครงสร้าง 5 ปีเต็ม On-site Service',
    leadTime: 'พร้อมส่งใน 1-3 วันทำการ',
    features: [
      'Dual-Motor ยกปรับระดับเงียบสนิท เสียงต่ำกว่า 45dB ความเร็ว 35 มม./วินาที',
      'แผงควบคุมหน้าจอดิจิทัล LED บันทึกระดับความสูงได้ 4 เมมโมรี่',
      'ระบบ Anti-Collision หยุดและถอยกลับอัตโนมัติเมื่อชนสิ่งกีดขวาง',
      'ช่องเสียบ Fast Charge USB-A และ Type-C ที่แผงหน้าปัด',
      'รางร้อยสายไฟ Heavy Duty ใต้โต๊ะรองรับปลั๊กรางใหญ่'
    ],
    colors: [
      { id: 'c-black', name: 'Matte Black (ดำด้าน)', hex: '#1e293b' },
      { id: 'c-walnut', name: 'Dark Walnut (ไม้วอลนัทเข้ม)', hex: '#451a03' },
      { id: 'c-white', name: 'Nordic White (ขาวนอร์ดิก)', hex: '#f8fafc' }
    ],
    sizes: [
      { id: 's-140', name: '140 x 70 ซม.', extraPrice: 0 },
      { id: 's-160', name: '160 x 80 ซม.', extraPrice: 1500 },
      { id: 's-180', name: '180 x 80 ซม.', extraPrice: 2800 }
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
    nameEn: 'Gspeed Arena Commercial Double Desk 240cm',
    subtitle: 'โต๊ะสำหรับร้านอินเทอร์เน็ตคาเฟ่และสำนักงาน แข็งแรงทนทานพิเศษ พร้อมฉากกั้น',
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
    weight: '38 กก. (รองรับน้ำหนักรวม 300 กก.)',
    materials: 'โครงเหล็กกล่องมาตรฐานอุตสาหกรรม พ่นกันสนิม + หน้าท็อปเมลามีนกันรอยหนา 25 มม. + แผงกั้นอะคริลิกขุ่น',
    warranty: 'รับประกันโครงสร้าง 5 ปี',
    leadTime: '3 - 5 วันทำการ (สั่งจำนวนมากราคาส่ง)',
    features: [
      'ออกแบบโมดูลาร์สามารถนำมาต่อแถวยาว 4, 6, 8 ที่นั่งได้แนบสนิทไร้รอยต่อ',
      'ฉากกั้นกลางกึ่งโปร่งแสง ช่วยสร้างสมาธิและความเป็นส่วนตัว',
      'ราง Wireway ขนาดใหญ่สำหรับซ่อนสายไฟและสายแลน CAT6A ทั้งระบบ',
      'มีจุดยึดเคสคอมพิวเตอร์และแขนจับจอทุกตำแหน่ง',
      'โครงสร้างเหล็กคานคู่รองรับการใช้งานต่อเนื่อง 24 ชั่วโมง'
    ],
    colors: [
      { id: 'c-black', name: 'All Black (ดำล้วน)', hex: '#0f172a' },
      { id: 'c-blue', name: 'Blue Trim (ขอบน้ำเงิน GLP)', hex: '#1d4ed8' }
    ],
    sizes: [
      { id: 's-240', name: '240 x 70 ซม. (2 ที่นั่ง)', extraPrice: 0 },
      { id: 's-480', name: '480 x 70 ซม. (4 ที่นั่ง)', extraPrice: 7000 }
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
    nameEn: 'Gspeed Streamer Master L-Shaped Desk',
    subtitle: 'พื้นที่กว้างขวาง วางได้ 2-3 จอ พร้อมชั้นวางอุปกรณ์และไฟ RGB Sound Sync',
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
    weight: '26 กก. (รองรับน้ำหนักสูงสุด 180 กก.)',
    materials: 'โครงเหล็กกล้าทรงสามเหลี่ยมค้ำยัน + หน้าท็อปคาร์บอนไฟเบอร์เกรดพรีเมียม',
    warranty: 'รับประกันโครงสร้าง 3 ปี',
    leadTime: 'พร้อมส่งใน 1-2 วันทำการ',
    features: [
      'เข้ามุมห้องพอดี ได้พื้นที่ทำงานเพิ่มขึ้น 40%',
      'สลับติดตั้งฝั่งซ้ายหรือฝั่งขวาได้ตามแปลนห้อง',
      'มีแถมแถบไฟ RGB Magnetic ใต้โต๊ะ พร้อมรีโมทปรับแสงตามเสียงเกม',
      'ชั้นวางเคสคอมพิวเตอร์แบบลอยตัว ป้องกันฝุ่นใต้พื้น',
      'ช่องร้อยสายไฟ 3 ตำแหน่ง พร้อมที่แขวนหูฟังและแก้วน้ำ'
    ],
    colors: [
      { id: 'c-black', name: 'Stealth Carbon', hex: '#0f172a' },
      { id: 'c-white', name: 'Snow White', hex: '#ffffff' }
    ],
    sizes: [
      { id: 's-std', name: '160 x 110 ซม.', extraPrice: 0 }
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
    nameEn: 'Gspeed Pro Master Gaming Chair',
    subtitle: 'โฟมขึ้นรูป Molded Foam ความหนาแน่นสูง หนัง PU ทนรอยขีดข่วน ปรับเอน 165°',
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
    weight: '24 กก. (รองรับน้ำหนักสูงสุด 160 กก.)',
    materials: 'โครงเหล็กกล้าแบบเชื่อมไร้รอยต่อ + ฟองน้ำหล่อขึ้นรูป High Density Foam + หนัง PU Breathable ระบายอากาศ',
    warranty: 'รับประกันโครงสร้างและโช้คแก๊ส 3 ปี',
    leadTime: 'พร้อมส่งใน 1-2 วันทำการ',
    features: [
      'เบาะนั่งโฟมหนา นุ่มแน่น ไม่ยุบตัวตลอดอายุการใช้งาน',
      'พนักพิงปรับเอนนอนได้ตั้งแต่ 90° ถึง 165° พร้อมระบบโยก Rocking Mechanism',
      'ที่วางแขน 4D ปรับได้ 4 ทิศทาง (ขึ้น-ลง, หน้า-หลัง, ซ้าย-ขวา, หมุนเอียง)',
      'หมอนรองคอและหมอนรองหลัง เมมโมรี่โฟมเกรดพรีเมียม สบายลดปวดเมื่อย',
      'โช้คแก๊ส Class 4 ผ่านการรับรองมาตรฐานสากล SGS & TUV',
      'ฐานล้อเหล็ก 5 แฉกเคลือบสีดำเงา พร้อมล้อ PU ขนาด 65 มม. ลื่นเงียบ ไม่ทำลายพื้น'
    ],
    colors: [
      { id: 'c-black-blue', name: 'Black & GLP Blue (ดำ-น้ำเงิน)', hex: '#1d4ed8' },
      { id: 'c-all-black', name: 'Stealth Black (ดำด้านล้วน)', hex: '#0f172a' },
      { id: 'c-black-orange', name: 'Cyber Orange (ดำ-ส้ม)', hex: '#ea580c' },
      { id: 'c-white-black', name: 'Storm White (ขาว-ดำ)', hex: '#f8fafc' }
    ],
    sizes: [
      { id: 's-std', name: 'Standard (ความสูง 155-185 ซม.)', extraPrice: 0 },
      { id: 's-xl', name: 'XL Throne (ความสูง 175-200 ซม. รองรับ 180 กก.)', extraPrice: 1200 }
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
    subtitle: 'ระบายอากาศ 100% ปรับรองรับกระดูกสันหลัง Dynamic Lumbar Support นั่งสบาย 8+ ชม.',
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
    weight: '19 กก. (รองรับน้ำหนักสูงสุด 150 กก.)',
    materials: 'ผ้าตาข่ายเส้นใยโพลีเมอร์นำเข้าจากเกาหลี ยืดหยุ่นทนแรงดึง + ฐานอลูมิเนียมขัดเงา Die-Cast Aluminum Alloy',
    warranty: 'รับประกันโครงสร้างและตาข่าย 3 ปีเต็ม',
    leadTime: 'พร้อมส่งใน 1-2 วันทำการ',
    features: [
      'ตาข่าย Full Mesh ทั้งพนักพิงและเบาะนั่ง ระบายอากาศยอดเยี่ยม ไม่ร้อน ไม่อับชื้น',
      'Dynamic Adaptive Lumbar ปรับดันหลังส่วนล่างอัตโนมัติตามการขยับตัว',
      'ที่รองศีรษะ 3D กว้างพิเศษ ปรับขึ้น-ลง และหมุนทำมุมรับท้ายทอย',
      'ระบบกลไก Synchronized-Tilt ล็อคการเอนได้ 3 ระดับ (95°, 115°, 130°)',
      'เบาะนั่งเลื่อนสไลด์หน้า-หลังได้ (Seat Depth Adjustment) รองรับความยาวช่วงขา'
    ],
    colors: [
      { id: 'c-charcoal', name: 'Space Grey (เทาสเปซเกรย์)', hex: '#334155' },
      { id: 'c-black', name: 'Graphite Black (ดำกราไฟต์)', hex: '#0f172a' }
    ],
    sizes: [
      { id: 's-std', name: 'Free Size ปรับตามสรีระ', extraPrice: 0 }
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
    nameEn: 'Gspeed Arena Commercial NetCafe Chair',
    subtitle: 'ออกแบบเพื่อการใช้งานต่อเนื่อง 24 ชม. เบาะกว้างพิเศษ หนังหนา 1.2 มม. โครงเหล็กตัน',
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
    weight: '21 กก. (รองรับน้ำหนักสูงสุด 180 กก.)',
    materials: 'โครงเหล็กกล้าเชื่อมหนาพิเศษ + ฟองน้ำ Recycled Rebonded Foam ผสม High Density แน่นไม่ยวบ + หนัง PVC ทนสารเคมีเช็ดแอลกอฮอล์ได้',
    warranty: 'รับประกันโครงสร้าง 3 ปี (พร้อมอะไหล่เปลี่ยนทุกชิ้นส่วน)',
    leadTime: 'พร้อมส่งใน 1-3 วันทำการ (สั่ง 20 ตัวขึ้นไป ราคาส่งพิเศษ)',
    features: [
      'หนังหุ้มความหนา 1.2 มม. ทนต่อรอยขีดข่วน เช็ดทำความสะอาดด้วยแอลกอฮอล์ได้ไม่ลอก',
      'ฟองน้ำขึ้นรูปอัดแน่นพิเศษ รองรับน้ำหนักลูกค้าได้ทุกสัดส่วน นั่งสบายไม่จม',
      'กลไกปรับเอนแบบ Butterfly Mechanism ปรับได้สูงสุด 135°',
      'ที่วางแขนยึดแน่นกับตัวโครงสร้าง แข็งแรงทนทานต่อการกดทับ',
      'ล้อไนลอนขนาดใหญ่ ทนทาน รองรับการลากไถบนพื้นกระเบื้องหรืออีพ็อกซี่'
    ],
    colors: [
      { id: 'c-black-red', name: 'Black-Red (ดำ-แดงคลาสสิก)', hex: '#dc2626' },
      { id: 'c-black-blue', name: 'Black-Blue (ดำ-น้ำเงิน GLP)', hex: '#1d4ed8' },
      { id: 'c-all-black', name: 'Pure Black (ดำล้วน)', hex: '#0f172a' }
    ],
    sizes: [
      { id: 's-std', name: 'ขนาดมาตรฐานร้านอินเทอร์เน็ต', extraPrice: 0 }
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
    nameEn: 'Gspeed Heavy-Duty Gas-Spring Dual Monitor Arm',
    subtitle: 'ระบบโช้คแก๊สแท้ หมุนจอได้ 360° รับน้ำหนักข้างละ 12 กก. มีช่องเก็บสายในตัว',
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
    weight: '4.8 กก.',
    materials: 'อลูมิเนียมเกรดอากาศยานผสมเหล็กกล้า + ระบบสปริงแก๊สทนทาน 50,000 รอบ',
    warranty: 'รับประกันโช้คแก๊สและชิ้นส่วน 3 ปี',
    leadTime: 'พร้อมส่งทันที',
    features: [
      'รองรับหน้าจอขนาด 17 นิ้ว ถึง 35 นิ้ว ทั้งจอแบนและจอโค้ง (1000R-1800R)',
      'มาตรฐาน VESA 75x75 และ 100x100 มม. พร้อมแผ่นปลดเร็ว Quick Release',
      'ปรับก้ม-เงย +90°/-45°, หมุนซ้าย-ขวา 180°, หมุนแนวตั้ง-แนวนอน 360°',
      'ติดตั้งได้ 2 แบบ: ทั้งแบบหนีบโต๊ะ (C-Clamp) และแบบเจาะรูโต๊ะ (Grommet)',
      'ช่องเก็บสายไฟแบบซ่อนภายในแขนทั้งสองข้าง ดูสะอาดตาเป็นระเบียบ'
    ],
    colors: [
      { id: 'c-black', name: 'Matte Black (ดำด้าน)', hex: '#0f172a' },
      { id: 'c-white', name: 'Polar White (ขาวเงา)', hex: '#ffffff' }
    ],
    sizes: [
      { id: 's-dual', name: 'แบบ 2 จอ (Dual Arm)', extraPrice: 0 },
      { id: 's-single', name: 'แบบ 1 จอ (Single Arm)', extraPrice: -700 }
    ],
    threeDConfig: null
  },
  {
    id: 'prod-acc-02',
    sku: 'GSP-ACC-CABLETRAY',
    category: 'accessories',
    name: 'Gspeed Heavy-Duty Steel Cable Management Tray รางเก็บสายไฟใต้โต๊ะ',
    nameEn: 'Gspeed Steel Under-Desk Cable Tray',
    subtitle: 'รางเหล็กคาร์บอนระบายความร้อน ติดตั้งง่าย วางปลั๊กรางใหญ่และหม้อแปลงได้ครบ',
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
    weight: '1.4 กก.',
    materials: 'เหล็กกล้าพ่นสีดำด้าน Powder Coat ทนทานไม่เป็นสนิม',
    warranty: 'รับประกัน 1 ปี',
    leadTime: 'พร้อมส่งทันที',
    features: [
      'ช่องระบายอากาศแบบรังผึ้ง ไม่สะสมความร้อนจากหม้อแปลง',
      'ติดตั้งได้ทั้งแบบหนีบขอบโต๊ะ (ไม่ต้องเจาะ) หรือแบบขันน็อตใต้ท็อปโต๊ะ',
      'แถมสายรัดตีนตุ๊กแก Velcro Cable Tie 10 เส้นในกล่อง',
      'รองรับน้ำหนักได้สูงสุด 15 กก.'
    ],
    colors: [
      { id: 'c-black', name: 'Black (ดำ)', hex: '#0f172a' },
      { id: 'c-white', name: 'White (ขาว)', hex: '#ffffff' }
    ],
    sizes: [
      { id: 's-60', name: 'ยาว 60 ซม.', extraPrice: 0 },
      { id: 's-80', name: 'ยาว 80 ซม.', extraPrice: 200 }
    ],
    threeDConfig: null
  },
  {
    id: 'prod-acc-03',
    sku: 'GSP-ACC-MAT-XXL',
    category: 'accessories',
    name: 'Gspeed RGB Speed-Control XXL Gaming Desk Mat (900x400 mm)',
    nameEn: 'Gspeed RGB XXL Gaming Desk Mat',
    subtitle: 'แผ่นรองโต๊ะกว้างขวาง กันน้ำ ไฟ RGB 14 โหมด ฐานยางกันลื่น เย็บขอบหนา 4 มม.',
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
    weight: '0.7 กก.',
    materials: 'ผิวผ้า Micro-Weave Nano เคลือบสารสะท้อนน้ำ + ยางพาราธรรมชาติกันลื่น',
    warranty: 'รับประกันระบบไฟ 1 ปี',
    leadTime: 'พร้อมส่งทันที',
    features: [
      'ผิวสัมผัสแบบ Micro-textured ตอบสนองเซนเซอร์เมาส์ได้แม่นยำทั้ง Speed และ Control',
      'เส้นใยออปติกไฟ RGB 14 โหมดแสง (ไฟนิ่ง 7 สี + ไฟวิ่ง 7 รูปแบบ) ปุ่มกดเปลี่ยนโหมดในตัว',
      'เคลือบสาร Hydrophobic Coating น้ำและกาแฟหกไม่ซึม เช็ดออกได้ทันที',
      'สายถัก USB Type-C ยาว 1.8 ม. ถอดแยกได้'
    ],
    colors: [
      { id: 'c-black-glp', name: 'GLP Edition (ดำตัดขอบน้ำเงิน)', hex: '#1d4ed8' },
      { id: 'c-all-black', name: 'Stealth Black', hex: '#0f172a' }
    ],
    sizes: [
      { id: 's-900', name: '900 x 400 มม.', extraPrice: 0 }
    ],
    threeDConfig: null
  },
  {
    id: 'prod-acc-04',
    sku: 'GSP-ACC-ACOUSTIC',
    category: 'accessories',
    name: 'Gspeed Acoustic Sound-Proof Divider แผงกั้นซับเสียงตั้งโต๊ะ',
    nameEn: 'Gspeed Acoustic Sound-Proof Desk Divider',
    subtitle: 'เส้นใย PET ซับเสียงสะท้อน ตัดเสียงรบกวน 70% ปักหมุดโน้ตได้ ติดตั้งแบบหนีบโต๊ะ',
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
    weight: '2.1 กก.',
    materials: 'เส้นใยโพลีเอสเตอร์รีไซเคิล 100% เป็นมิตรต่อสิ่งแวดล้อม ไร้กลิ่นอับ ไม่ลามไฟ',
    warranty: 'รับประกัน 1 ปี',
    leadTime: 'พร้อมส่งใน 1-2 วันทำการ',
    features: [
      'ค่าดูดซับเสียง NRC 0.85 ช่วยลดเสียงสะท้อนระหว่างสื่อสารหรือสตรีมมิ่ง',
      'ผิวผ้าสักหลาดสามารถใช้เข็มหมุดปักกระดาษโน้ต โพสต์อิท หรือรูปภาพได้',
      'ขาหนีบเหล็กแบบ C-Clamp ปรับระยะหนีบหน้าโต๊ะหนาได้ถึง 5 ซม.',
      'มุมโค้งมน ปลอดภัย ไม่ขูดขีดผู้ใช้งาน'
    ],
    colors: [
      { id: 'c-grey', name: 'Charcoal Grey (เทาเข้ม)', hex: '#334155' },
      { id: 'c-blue', name: 'Royal Blue (น้ำเงินรอยัล)', hex: '#1d4ed8' },
      { id: 'c-beige', name: 'Warm Beige (เบจธรรมชาติ)', hex: '#d4b996' }
    ],
    sizes: [
      { id: 's-100', name: 'กว้าง 100 ซม.', extraPrice: 0 },
      { id: 's-120', name: 'กว้าง 120 ซม.', extraPrice: 300 }
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
    subtitle: 'เซ็ตจัดเต็มพร้อมลุย! โต๊ะ Battle 120cm + เก้าอี้ Pro Master + แขนจับจอคู่ + แผ่นรอง RGB',
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
    weight: 'น้ำหนักรวม 48 กก.',
    materials: 'โครงสร้างเหล็กคาร์บอน + หนัง PU เกรดโปร + อลูมิเนียมแขนจับจอ',
    warranty: 'รับประกัน 3 ปีเต็มทุกชิ้นส่วน',
    leadTime: 'พร้อมส่งใน 1-2 วันทำการ (กทม./ปริมณฑล พร้อมบริการประกอบฟรี)',
    features: [
      'ครบจบในเซ็ตเดียว ไม่ต้องหาซื้อแยก เข้าคู่กันอย่างลงตัว',
      '1x Gspeed Pro Battle Desk (120x60 ซม.) พร้อมถาดเก็บสายไฟ',
      '1x Gspeed Pro Master Gaming Chair โฟมหล่อหนานุ่ม เอนนอน 165°',
      '1x Gas-Spring Dual Monitor Arm แขนจับจอคู่ 17-35 นิ้ว',
      '1x XXL RGB Mousepad ขนาด 90x40 ซม. กันน้ำ',
      'ประหยัดกว่าซื้อแยกถึง ฿2,070 พร้อมสิทธิ์แลกซื้ออุปกรณ์เสริมลด 30%'
    ],
    colors: [
      { id: 'c-glp', name: 'Signature GLP Black-Blue (เซ็ตดำ-น้ำเงิน)', hex: '#1d4ed8' },
      { id: 'c-all-black', name: 'Stealth Blackout (เซ็ตดำด้านล้วน)', hex: '#0f172a' }
    ],
    sizes: [
      { id: 's-desk120', name: 'โต๊ะ 120 ซม.', extraPrice: 0 },
      { id: 's-desk140', name: 'อัปเกรดโต๊ะ 140 ซม.', extraPrice: 600 }
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
    subtitle: 'ชุดจัดเซ็ตสำหรับเปิดร้านเกม / โรงเรียน / ห้องแล็บคอมพิวเตอร์ 10 ที่นั่ง พร้อมรางสายไฟและฉากกั้น',
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
    weight: 'น้ำหนักรวม 400 กก.',
    materials: 'เหล็กกล่องมาตรฐานอุตสาหกรรม + ท็อปเมลามีนกันรอยหนา 25 มม. + เก้าอี้ Netcafe Heavy-Duty',
    warranty: 'รับประกันโครงสร้าง 5 ปี พร้อมบริการซ่อมบำรุงถึงสถานที่',
    leadTime: '5 - 7 วันทำการ (บริการจัดส่งและติดตั้งทั่วประเทศ)',
    features: [
      '5x โต๊ะคอมพิวเตอร์ 2 ที่นั่ง Commercial (รวม 10 สเตชัน)',
      '10x เก้าอี้ร้านเกม Gspeed Netcafe Heavy-Duty โครงเหล็กทนทาน 24 ชม.',
      'ระบบราง Wireway เก็บสายไฟและสายแลนครบเซ็ตทั้ง 10 โต๊ะ',
      'ฉากกั้นกลางอะคริลิกสวยงาม ทันสมัย',
      'ออกใบเสนอราคา ใบกำกับภาษีเต็มรูปแบบ สำหรับยื่นเบิกงบหรือหักภาษีนิติบุคคล'
    ],
    colors: [
      { id: 'c-blue', name: 'GLP Esports Standard (ดำ-น้ำเงิน)', hex: '#1d4ed8' },
      { id: 'c-black', name: 'Industrial Black (ดำด้าน)', hex: '#0f172a' }
    ],
    sizes: [
      { id: 's-10', name: 'แพ็กเกจ 10 ที่นั่ง', extraPrice: 0 },
      { id: 's-20', name: 'แพ็กเกจ 20 ที่นั่ง (ประหยัดเพิ่ม)', extraPrice: 47000 }
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
