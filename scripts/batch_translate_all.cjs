const fs = require('fs');
const path = require('path');

// Domain term overrides for esports, gaming, franchise, and hardware
const DOMAIN_OVERRIDES = {
  'กัปตันทีม': { en: 'Team Captain', zh: '战队队长' },
  '(กัปตันทีม)': { en: '(Captain)', zh: '(队长)' },
  'SScary (กัปตันทีม)': { en: 'SScary (Captain)', zh: 'SScary (战队队长)' },
  'JohnOlsen (กัปตันทีม)': { en: 'JohnOlsen (Captain)', zh: 'JohnOlsen (战队队长)' },
  'Surf (กัปตันทีม)': { en: 'Surf (Captain)', zh: 'Surf (战队队长)' },
  'Kadoom (กัปตันทีม)': { en: 'Kadoom (Captain)', zh: 'Kadoom (战队队长)' },
  'SpeedyKnight (กัปตันทีม)': { en: 'SpeedyKnight (Captain)', zh: 'SpeedyKnight (战队队长)' },
  'ผู้เข้าแข่งขันทุกท่านต้องนำบัตรประชาชนหรือบัตรนักเรียน/นักศึกษามาแสดงตน ณ จุดลงทะเบียน': {
    en: 'All competitors must present their National ID or Student ID card at the registration desk.',
    zh: '所有参赛选手必须在现场报到处出示身份证或学生证。'
  },
  'อนุญาตให้นำเมาส์ คีย์บอร์ด และหูฟังส่วนตัวมาใช้ได้ โดยต้องผ่านการตรวจจากเจ้าหน้าที่เทคนิคก่อนเริ่มแข่ง': {
    en: 'Personal gaming gear (mouse, keyboard, headset) is permitted after inspection by technical staff.',
    zh: '允许使用个人电竞外设（鼠标、键盘、耳机），但须在赛前通过技术人员检验。'
  },
  'เครื่องคอมพิวเตอร์ที่ใช้แข่งขับเคลื่อนด้วย Intel Core i9 + NVIDIA GeForce RTX 4080 และจอ BenQ ZOWIE 360Hz': {
    en: 'Tournament PCs powered by Intel Core i9 + NVIDIA GeForce RTX 4080 and BenQ ZOWIE 360Hz displays.',
    zh: '比赛用机配备 Intel Core i9 + NVIDIA GeForce RTX 4080 显卡与 BenQ ZOWIE 360Hz 电竞屏。'
  },
  'ห้ามใช้โปรแกรมโกง สคริปต์ช่วยเล่น หรือฉวยโอกาสจากข้อผิดพลาดของเกม (Bug Exploitation) หากตรวจพบปรับแพ้ทันที': {
    en: 'Cheats, assistance scripts, or bug exploitation are strictly forbidden. Violators forfeit immediately.',
    zh: '严禁使用外挂、辅助脚本或利用游戏BUG，违者立即判负并取消资格。'
  },
  'คำตัดสินของหัวหน้าผู้ตัดสิน (Head Referee) ถือเป็นที่สิ้นสุดในทุกกรณี': {
    en: 'The Head Referee decision is final and binding in all cases.',
    zh: '赛事主裁判的裁决为最终裁定，不接受申诉。'
  },
  'ลงทะเบียนหน้างาน & ตรวจสอบอุปกรณ์นักกีฬา (Player Check-in & Gear Check)': {
    en: 'On-site Check-in & Player Gear Inspection',
    zh: '现场签到与选手外设检查 (Check-in & Gear Check)'
  },
  'รอบคัดเลือกแบ่งกลุ่ม Group Stage (Best of 1 - LAN Setup)': {
    en: 'Group Stage Qualifiers (Best of 1 - LAN Setup)',
    zh: '小组循环资格赛 (BO1 局域网线下对战)'
  },
  'รอบ 8 ทีม และ 4 ทีมสุดท้าย (Quarter & Semi-Finals - Best of 3)': {
    en: 'Quarter-Finals & Semi-Finals (Best of 3)',
    zh: '八强赛与半决赛 (BO3 三局两胜)'
  },
  'รอบชิงชนะเลิศ Grand Final บนเวที Main Stage (Best of 5 ถ่ายทอดสด)': {
    en: 'Grand Final on Main Stage (Best of 5 Live Broadcast)',
    zh: '主舞台巅峰总决赛 (BO5 五局三胜高清直播)'
  },
  '32 ทีม (เหลือ 6 ทีมสุดท้าย)': {
    en: '32 Teams (Final 6 Slots Remaining)',
    zh: '32 支战队 (仅剩最后6个席位)'
  },
  '16:00 - 20:00 น.': { en: '16:00 - 20:00', zh: '16:00 - 20:00' },
  '11:00 - 20:00 น.': { en: '11:00 - 20:00', zh: '11:00 - 20:00' },
  '10:00 - 11:00 น.': { en: '10:00 - 11:00', zh: '10:00 - 11:00' },
  '11:15 - 14:00 น.': { en: '11:15 - 14:00', zh: '11:15 - 14:00' },
  '14:30 - 17:30 น.': { en: '14:30 - 17:30', zh: '14:30 - 17:30' },
  '18:00 - 20:30 น.': { en: '18:00 - 20:30', zh: '18:00 - 20:30' },
  'ดูตารางแข่ง': { en: 'Match Schedule', zh: '查看赛程表' },
  'รายละเอียดงานแข่ง': { en: 'Tournament Details', zh: '赛事详情' },
  'ฟีเจอร์ใหม่ 3D': { en: 'New 3D Feature', zh: '全新3D功能' },
  'เปิดรับสมัคร GLP VALORANT CHAMPIONSHIP 2026 ชิง 100,000 บาท | ระบบจำลองผังร้าน 3D เปิดให้ทดลองใช้งานแล้ววันนี้!': {
    en: 'Open Registration for GLP VALORANT CHAMPIONSHIP 2026 (100,000 THB Prize) | 3D Store Planner is now live!',
    zh: 'GLP 无畏契约全国锦标赛 2026 火热报名中 (总奖金10万泰铢) | 3D门店布局系统现已正式上线！'
  },
  'ICAFE ATTACK LAN TOURNAMENT 2026 ระเบิดความมันส์ เสาร์-อาทิตย์นี้ ณ GLP Main Stage ลุ้นรับแรร์ไอเทมและเงินรางวัลสด': {
    en: 'ICAFE ATTACK LAN TOURNAMENT 2026 this weekend at GLP Main Stage! Win rare items and cash prizes.',
    zh: 'ICAFE ATTACK 线下电竞锦标赛 2026 本周末狂欢引爆！GLP 主舞台震撼开战，现场赢取稀有道具与现金大奖。'
  },
  'เปิดตัวแพ็กเกจแฟรนไชส์ GLP Living Plus 2026 พร้อมระบบจำลองผัง 3D คำนวณงบประมาณและผลตอบแทน ROI แบบเรียลไทม์': {
    en: 'Launching GLP Living Plus 2026 Franchise Package with real-time 3D store simulator and ROI payback calculator.',
    zh: 'GLP Living Plus 2026 电竞网咖加盟新模式重磅发布，搭载实时3D门店空间设计与投资回报率(ROI)预算系统。'
  },
  'เวทีแข่งขันหลัก 5v5 Soundproof Glass Booths': {
    en: 'Main Tournament 5v5 Soundproof Glass Booths',
    zh: '主赛事 5v5 隔音玻璃对战舱'
  },
  'ห้องกระจกส่วนตัว 4K Broadcast Streamer Room': {
    en: 'Private 4K Broadcast Streamer Room',
    zh: '独立隔音 4K 直播推流主播房'
  },
  'โซนหลักความจุกว่า 80 ที่นั่ง สเปกแข่ง 240Hz Fast-IPS': {
    en: 'Main Arena 80+ Seats with 240Hz Fast-IPS Displays',
    zh: '主对战区 80+ 机位 240Hz Fast-IPS 竞技屏'
  },
  'โซน PS5 Pro จอยักษ์ 4K และซิมมูเลเตอร์พวงมาลัยแข่งรถ F1': {
    en: 'PS5 Pro Zone with Giant 4K Display & F1 Racing Simulators',
    zh: 'PS5 Pro 巨幕4K区与 F1 专业赛车力反馈模拟舱'
  },
  'โซนเครื่องเล่นเกมหลัก (Main Esports Arena)': {
    en: 'Main Esports Arena Zone',
    zh: '核心电竞对战主区 (Main Esports Arena)'
  },
  'ห้องซ้อม VIP / Bootcamp Suite (กระจกเก็บเสียง)': {
    en: 'VIP Bootcamp Suite (Soundproof Glass)',
    zh: 'VIP 职业集训房 / Bootcamp (隔音玻璃)'
  },
  'เคาน์เตอร์แคชเชียร์ & จุดต้อนรับ (Reception)': {
    en: 'Cashier & Reception Counter',
    zh: '收银服务台与迎宾接待处 (Reception)'
  },
  'ห้องควบคุมระบบ MDB & Diskless Server': {
    en: 'MDB Electrical & Diskless Server Control Room',
    zh: '强电控制机房与无盘服务器中心 (MDB & Server)'
  },
  'Cafe Prep, Food & Dining Lounge': {
    en: 'Cafe Prep, Food & Dining Lounge',
    zh: '水吧饮品餐饮休息区 (Cafe Prep & Lounge)'
  },
  'ทางสัญจร & ช่องทางหนีไฟ (Circulation & Safety)': {
    en: 'Circulation & Safety Aisles',
    zh: '消防通道与公共动线 (Circulation & Safety)'
  },
  'โซนเครื่องเล่นเกมหลัก': { en: 'Main Gaming Arena', zh: '电竞主对战区' },
  'ห้องซ้อม VIP / Bootcamp Suite': { en: 'VIP Bootcamp Suite', zh: 'VIP 职业训练室' },
  'เคาน์เตอร์แคชเชียร์ & จุดต้อนรับ': { en: 'Cashier & Reception Counter', zh: '收银与接待柜台' },
  'ห้องควบคุมระบบ MDB & Diskless': { en: 'MDB & Diskless Server Room', zh: '无盘服务器控制机房' },
  'ทางสัญจร & ช่องทางหนีไฟ': { en: 'Circulation & Fire Exit Corridor', zh: '消防疏散安全通道' },
  'อุปกรณ์เกมมิ่งเกียร์และบรรยากาศการแข่งขัน': {
    en: 'Gaming Gear & Tournament Highlights',
    zh: '电竞外设装备与激战实况'
  },
  'พิธีมอบรางวัลและเงินรางวัลชนะเลิศ': {
    en: 'Award Ceremony & Championship Trophy Presentation',
    zh: '颁奖盛典与冠军奖金授予'
  },
  'แฟนคลับและผู้เข้าชมร่วมสนุกในกิจกรรม': {
    en: 'Fans & Attendees Community Highlights',
    zh: '广大玩家与到场观众狂欢互动'
  }
};

async function translateText(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  const clean = text.trim();
  if (DOMAIN_OVERRIDES[clean] && DOMAIN_OVERRIDES[clean][targetLang]) {
    return DOMAIN_OVERRIDES[clean][targetLang];
  }

  const langPair = targetLang === 'zh' ? 'th|zh-CN' : 'th|en';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${langPair}&de=contact@gspeedlivingplus.com`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = await res.json();
        const translated = data?.responseData?.translatedText;
        if (translated && !translated.includes('MYMEMORY WARNING')) {
          return translated.trim();
        }
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  return clean;
}

async function run() {
  const missing = JSON.parse(fs.readFileSync('scripts/missing_translations.json', 'utf8'));
  console.log(`Starting translation of ${missing.length} strings...`);

  // Load existing translated batch if resuming
  let translatedMap = {};
  if (fs.existsSync('scripts/translated_batch.json')) {
    try {
      translatedMap = JSON.parse(fs.readFileSync('scripts/translated_batch.json', 'utf8'));
    } catch (e) {}
  }

  // Pre-seed with domain overrides
  for (const [key, val] of Object.entries(DOMAIN_OVERRIDES)) {
    translatedMap[key] = val;
  }

  const itemsToProcess = missing.filter(k => !translatedMap[k] || !translatedMap[k].en || !translatedMap[k].zh);
  console.log(`Need to translate ${itemsToProcess.length} remaining items.`);

  const batchSize = 5;
  for (let i = 0; i < itemsToProcess.length; i += batchSize) {
    const chunk = itemsToProcess.slice(i, i + batchSize);
    await Promise.all(chunk.map(async (text) => {
      if (DOMAIN_OVERRIDES[text]) {
        translatedMap[text] = DOMAIN_OVERRIDES[text];
        return;
      }
      const [en, zh] = await Promise.all([
        translateText(text, 'en'),
        translateText(text, 'zh')
      ]);
      translatedMap[text] = { en, zh };
    }));

    if ((i + batchSize) % 25 === 0 || i + batchSize >= itemsToProcess.length) {
      console.log(`Progress: ${Math.min(i + batchSize, itemsToProcess.length)} / ${itemsToProcess.length}`);
      fs.writeFileSync('scripts/translated_batch.json', JSON.stringify(translatedMap, null, 2), 'utf8');
    }
  }

  fs.writeFileSync('scripts/translated_batch.json', JSON.stringify(translatedMap, null, 2), 'utf8');
  console.log('Finished translation! Total entries in dictionary:', Object.keys(translatedMap).length);
}

run();
