/**
 * Automated Dynamic Translation Engine for G-SPEED / GLP Esports & Activities
 * Supports: Thai (th), English (en), Chinese (zh)
 * Features:
 *  1. Deterministic Regex Transformers (Thai dates, months, Buddhist Era, currencies, time, attendees, ranks)
 *  2. Rich Curated Esports & Arena Dictionary for zero-latency instant display
 *  3. Persistent LocalStorage Caching ('glp_translations_cache_v1')
 *  4. Real-time background auto-translation via free Google GTX translation API for any newly added articles/activities
 *  5. Reactive event dispatching ('glp_translation_cache_updated') to automatically update UI on resolve
 *  6. CMS Batch Pre-translation for newly authored content
 */

const STORAGE_KEY = 'glp_translations_cache_v1';

// Thai Month definitions
const THAI_MONTHS = [
  { full: 'มกราคม', short: 'ม.ค.', en: 'January', zh: '1月', monthNum: 1 },
  { full: 'กุมภาพันธ์', short: 'ก.พ.', en: 'February', zh: '2月', monthNum: 2 },
  { full: 'มีนาคม', short: 'มี.ค.', en: 'March', zh: '3月', monthNum: 3 },
  { full: 'เมษายน', short: 'เม.ย.', en: 'April', zh: '4月', monthNum: 4 },
  { full: 'พฤษภาคม', short: 'พ.ค.', en: 'May', zh: '5月', monthNum: 5 },
  { full: 'มิถุนายน', short: 'มิ.ย.', en: 'June', zh: '6月', monthNum: 6 },
  { full: 'กรกฎาคม', short: 'ก.ค.', en: 'July', zh: '7月', monthNum: 7 },
  { full: 'สิงหาคม', short: 'ส.ค.', en: 'August', zh: '8月', monthNum: 8 },
  { full: 'กันยายน', short: 'ก.ย.', en: 'September', zh: '9月', monthNum: 9 },
  { full: 'ตุลาคม', short: 'ต.ค.', en: 'October', zh: '10月', monthNum: 10 },
  { full: 'พฤศจิกายน', short: 'พ.ย.', en: 'November', zh: '11月', monthNum: 11 },
  { full: 'ธันวาคม', short: 'ธ.ค.', en: 'December', zh: '12月', monthNum: 12 }
];

// In-memory cache synced with LocalStorage
let translationCache = {};
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      translationCache = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load translations cache from localStorage:', e);
  }
}

// In-flight request deduplication map
const pendingRequests = new Map();

/**
 * Save translation entry to persistent cache and notify listeners
 */
export function saveToTranslationCache(text, lang, translatedText) {
  if (!text || !lang || !translatedText || text === translatedText) return;
  const key = text.trim();
  if (!translationCache[key]) {
    translationCache[key] = {};
  }
  translationCache[key][lang] = translatedText;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(translationCache));
      window.dispatchEvent(new CustomEvent('glp_translation_cache_updated', {
        detail: { text: key, lang, translated: translatedText }
      }));
    } catch (e) {
      console.warn('Failed to save to translations cache:', e);
    }
  }
}

/**
 * Instant Pattern Matcher for Thai Dates, Currencies, Times, and Badges
 */
export function matchPatternTranslation(rawText, lang) {
  if (!rawText || typeof rawText !== 'string' || lang === 'th') return null;
  const str = rawText.trim();

  // 1. Currency & Prize formatting: e.g. "100,000 บาท" or "฿100,000"
  const bahtRegex = /^([\d,]+)\s*บาท$/i;
  const bahtMatch = str.match(bahtRegex);
  if (bahtMatch) {
    return lang === 'zh' ? `${bahtMatch[1]} 泰铢` : `${bahtMatch[1]} THB`;
  }

  // 2. Reading time: e.g. "3 นาทีในการอ่าน" or "5 นาที"
  const readTimeRegex = /^(\d+)\s*นาที(ในการอ่าน)?$/;
  const readMatch = str.match(readTimeRegex);
  if (readMatch) {
    return lang === 'zh' ? `${readMatch[1]} 分钟阅读` : `${readMatch[1]} min read`;
  }

  // 3. Time formatting: e.g. "11:00 - 20:00 น." or "14:00 น."
  const timeRegex = /^(\d{1,2}:\d{2})(\s*-\s*(\d{1,2}:\d{2}))?\s*น\.?$/;
  const timeMatch = str.match(timeRegex);
  if (timeMatch) {
    if (timeMatch[3]) {
      return `${timeMatch[1]} - ${timeMatch[3]}`;
    }
    return `${timeMatch[1]}`;
  }

  // 4. Attendees formatting: e.g. "350+ คน (32 ทีม)"
  const attendeesRegex = /^(\d+\+?)\s*คน\s*\(([^\)]+)\)$/;
  const attMatch = str.match(attendeesRegex);
  if (attMatch) {
    if (lang === 'zh') return `${attMatch[1]} 人 (${attMatch[2].replace('ทีม', '支战队')})`;
    return `${attMatch[1]} attendees (${attMatch[2].replace('ทีม', 'teams')})`;
  }

  // 5. Thai Dates formatting
  // Examples: "28-30 กันยายน 2026", "28 กันยายน 2026", "ตุลาคม 2026", "15 ก.ย. 2569"
  for (const m of THAI_MONTHS) {
    // Check range: "28-30 กันยายน 2026" or "28-30 กันยายน 2569"
    const rangeRegex = new RegExp(`^(\\d{1,2})\\s*-\\s*(\\d{1,2})\\s*(${m.full}|${m.short})\\s*(\\d{4})$`, 'i');
    const rangeMatch = str.match(rangeRegex);
    if (rangeMatch) {
      let year = parseInt(rangeMatch[4], 10);
      if (year > 2500) year -= 543; // Buddhist to Gregorian
      const dayRange = `${rangeMatch[1]}-${rangeMatch[2]}`;
      if (lang === 'zh') {
        return `${year}年${m.monthNum}月${dayRange}日`;
      }
      return `${dayRange} ${m.en} ${year}`;
    }

    // Check single day: "28 กันยายน 2026"
    const singleRegex = new RegExp(`^(\\d{1,2})\\s*(${m.full}|${m.short})\\s*(\\d{4})$`, 'i');
    const singleMatch = str.match(singleRegex);
    if (singleMatch) {
      let year = parseInt(singleMatch[3], 10);
      if (year > 2500) year -= 543;
      const day = singleMatch[1];
      if (lang === 'zh') {
        return `${year}年${m.monthNum}月${day}日`;
      }
      return `${day} ${m.en} ${year}`;
    }

    // Check month + year only: "ตุลาคม 2026" or "กันยายน 2026"
    const monthYearRegex = new RegExp(`^(${m.full}|${m.short})\\s*(\\d{4})$`, 'i');
    const myMatch = str.match(monthYearRegex);
    if (myMatch) {
      let year = parseInt(myMatch[2], 10);
      if (year > 2500) year -= 543;
      if (lang === 'zh') {
        return `${year}年${m.monthNum}月`;
      }
      return `${m.en} ${year}`;
    }
  }

  // 6. Common Rank & Prize Badges
  if (str === 'แชมป์อันดับ 1' || str === 'อันดับที่ 1 (CHAMPION)' || str === '🥇 อันดับที่ 1 (Champion)') {
    return lang === 'zh' ? '🥇 冠军 (CHAMPION)' : '🥇 1st Place (Champion)';
  }
  if (str === 'รองชนะเลิศอันดับ 1' || str === 'อันดับที่ 2 (RUNNER-UP)' || str === '🥈 อันดับที่ 2 (Runner-Up)') {
    return lang === 'zh' ? '🥈 亚军 (Runner-Up)' : '🥈 2nd Place (Runner-Up)';
  }
  if (str.includes('รองชนะเลิศอันดับ 2')) {
    return lang === 'zh' ? '🥉 季军 (3rd Place)' : '🥉 3rd Place';
  }

  return null;
}

/**
 * Comprehensive Built-in Esports & Activities Translations
 */
export const BUILT_IN_DICTIONARY = {
  "กำลังอยู่ในโหมดเดินชมร้านระดับสายตา": { en: "First-person walk-through mode active", zh: "第一人称漫游模式已启用" },
  "เดินชมร้าน": { en: "Walk Mode", zh: "漫游视角" },
  "มุมมองหน้าร้าน": { en: "Storefront View", zh: "门头视角" },
  "หน้าร้าน": { en: "Front View", zh: "门头" },
  "สลับเป็นมุมมอง 3D": { en: "Switch to 3D perspective", zh: "切换到3D全景" },
  "สลับเป็นมุมมองแปลนด้านบน": { en: "Switch to 2D top-down plan", zh: "切换到2D俯视图" },
  "ออกจากโหมดเดินชมร้าน (กด ESC ได้)": { en: "Exit walk mode (or press ESC)", zh: "退出漫游模式 (可按ESC)" },
  "ออกจากโหมดเดิน (ESC)": { en: "Exit Walk (ESC)", zh: "退出漫游 (ESC)" },
  "หรือ": { en: "or", zh: "或" },
  "เดินชมในร้าน": { en: "Walk around venue", zh: "店内漫游" },
  "เมาส์ 360°": { en: "Mouse 360°", zh: "鼠标 360°" },
  "คลิกเมาส์": { en: "Click Mouse", zh: "点击鼠标" },
  "ขยับเมาส์หันมองรอบทิศ (FPS Lock)": { en: "Look around 360° (FPS Lock)", zh: "移动鼠标环视四周 (锁定准星)" },
  "คลิกเพื่อล็อคเมาส์หันมอง 360°": { en: "Click to lock mouse and look 360°", zh: "点击锁定鼠标进行360°环视" },
  "วิ่งเร็ว": { en: "Sprint", zh: "加速奔跑" },
  "ออกจากโหมดเดิน / ปลดล็อค": { en: "Exit walk / Unlock mouse", zh: "退出漫游 / 解锁鼠标" },
  "สายตา 1.65ม.": { en: "Eye Level 1.65m", zh: "视线高 1.65米" },
  "เดินหน้า (Forward)": { en: "Forward", zh: "前进" },
  "สเต็ปซ้าย (Strafe Left)": { en: "Strafe Left", zh: "向左平移" },
  "สเต็ปขวา (Strafe Right)": { en: "Strafe Right", zh: "向右平移" },
  "ถอยหลัง (Backward)": { en: "Backward", zh: "后退" },
  "สลับวิ่งเร็ว / เดิน": { en: "Toggle Sprint / Walk", zh: "切换疾跑 / 步行" },
  "วิ่งเร็ว (เปิด)": { en: "Sprint (ON)", zh: "加速 (开启)" },
  "หมุนมุมมองซ้าย": { en: "Turn view left", zh: "向左转头" },
  "หันซ้าย": { en: "Look Left", zh: "向左看" },
  "หมุนมุมมองขวา": { en: "Turn view right", zh: "向右转头" },
  "หันขวา": { en: "Look Right", zh: "向右看" },
  "คลิกซ้ายค้างเพื่อหมุนรอบห้อง • คลิกขวาเพื่อเลื่อน • กดปุ่มลูกศรเพื่อย้ายโต๊ะ": { en: "Left-click & drag to rotate • Right-click to pan • Arrow keys to nudge items", zh: "左键拖拽旋转视角 • 右键平移 • 方向键微调设备位置" },
  "แตะเลื่อนเพื่อหมุน 360° • สองนิ้วเพื่อซูม": { en: "Swipe to rotate 360° • Pinch with two fingers to zoom", zh: "单指滑动旋转360° • 双指捏合缩放" },
  "เลื่อนตำแหน่งวัตถุใน 3D (หรือกดปุ่มลูกศรบนคีย์บอร์ด)": { en: "Nudge object in 3D (or use arrow keys)", zh: "在3D中微调物品位置（或使用键盘方向键）" },
  "ย้าย:": { en: "Move:", zh: "移动:" },
  "เลื่อนซ้าย (-0.5ม.) หรือกดปุ่ม ←": { en: "Move left (-0.5m) or press ←", zh: "向左移动 (-0.5米) 或按 ←" },
  "เลื่อนขวา (+0.5ม.) หรือกดปุ่ม →": { en: "Move right (+0.5m) or press →", zh: "向右移动 (+0.5米) 或按 →" },
  "เลื่อนขึ้น/ลึก (-0.5ม.) หรือกดปุ่ม ↑": { en: "Move up/inward (-0.5m) or press ↑", zh: "向前移入 (-0.5米) 或按 ↑" },
  "เลื่อนลง/หน้า (+0.5ม.) หรือกดปุ่ม ↓": { en: "Move down/outward (+0.5m) or press ↓", zh: "向后移出 (+0.5米) 或按 ↓" },
  "หมุน 90°": { en: "Rotate 90°", zh: "旋转 90°" },
  "คัดลอก": { en: "Copy", zh: "复制" },
  "ลบ": { en: "Delete", zh: "删除" },
  "ทางเข้าร้าน": { en: "ENTRANCE", zh: "入口" },
  "ดึง • PULL": { en: "PULL", zh: "拉 • PULL" },

  "เปิด/ปิดการแสดงผังแปลนที่แนบ": { en: "Toggle attached blueprint overlay", zh: "显示/隐藏附加蓝图" },
  "คลิกเพื่อปรับตำแหน่งประตูทางเข้าร้านและป้ายชื่อร้าน (ในแถบซ้าย)": { en: "Click to adjust entrance door & store signage (in left panel)", zh: "点击调整大门位置及招牌（左侧面板）" },
  "คลิกเพื่อเปลี่ยนวอลเปเปอร์ผนังและวัสดุพื้น": { en: "Click to change wall & flooring materials", zh: "点击更换墙纸与地面材质" },
  "คลิกเพื่อเปิดแท็บเพิ่มอุปกรณ์ (ในแถบซ้าย)": { en: "Click to open Add Equipment tab (in left panel)", zh: "点击打开添加设备面板（左侧面板）" },
  "ดูรายละเอียดอุปกรณ์ที่เลือก และรายการอุปกรณ์ในร้าน": { en: "View selected item details & venue inventory", zh: "查看选中设备详情及店内设备清单" },
  "ปรับแต่งตำแหน่งประตูทางเข้าร้าน รูปแบบประตู และป้ายชื่อร้าน": { en: "Configure entrance door, door style & store signage", zh: "配置店铺大门位置、款式及招牌" },
  "ปรับแต่งวอลเปเปอร์ผนังและวัสดุปูพื้นห้อง": { en: "Configure wall wallpaper & room flooring finishes", zh: "配置墙面壁纸与室内地坪材质" },
  "เลือกและเพิ่มอุปกรณ์/โต๊ะคอมลงในผัง": { en: "Browse & place gaming modules/stations into layout", zh: "浏览并添加电竞工作站/设施到平面图" },
  "ปิดหน้าต่างปรับประตู": { en: "Close door settings", zh: "关闭大门设置" },
  "เช่น GLP : G SPEED LIVING PLUS...": { en: "e.g. GLP : G SPEED LIVING PLUS...", zh: "例如 GLP : G SPEED LIVING PLUS..." },
  "สาขา สยามสแควร์": { en: "Siam Square Branch", zh: "暹罗广场店" },
  "ปิดการเลือก": { en: "Deselect item", zh: "取消选中" },
  "คลิกเพื่อดูสเปกเต็มและภาพสินค้าขยาย": { en: "Click to inspect full specs & HD photo", zh: "点击查看完整规格及高清图" },
  "คัดลอกโมดูลนี้ (Duplicate)": { en: "Duplicate this module (Duplicate)", zh: "复制此模块 (Duplicate)" },
  "ลบโมดูลนี้ออกจากผัง (กด Delete)": { en: "Delete module from layout (Press Delete)", zh: "从平面图中删除模块 (按 Delete)" },
  "ไปที่แท็บเพิ่มอุปกรณ์": { en: "Go to Add Equipment tab", zh: "前往添加设备标签" },
  "คลิกเพื่อเลือกและปรับตำแหน่งประตูทางเข้าร้าน": { en: "Click to select and adjust entrance door position", zh: "点击选择并调整大门位置" },
  "คลิกเพื่อย่อข้อมูล": { en: "Click to collapse info", zh: "点击折叠信息" },
  "คลิกเพื่อดูขนาด ราคา และจัดการอุปกรณ์": { en: "Click to view dimensions, price & manage equipment", zh: "点击查看尺寸、价格及管理模块" },
  "เลือกและปรับตำแหน่งในมุมมอง 3D": { en: "Select and fine-tune position in 3D", zh: "在3D视图中选中并调整位置" },
  "หมุน 90 องศา": { en: "Rotate 90 degrees", zh: "旋转 90 度" },
  "นำอุปกรณ์ชิ้นนี้ออกจากผังร้าน": { en: "Remove this item from layout", zh: "从店面平面图中移除此项" },
  "คลิกเพื่อเปลี่ยนวอลเปเปอร์ในแท็บ 2": { en: "Click to change wallpaper in Tab 2", zh: "点击在标签2中更换壁纸" },
  "คลิกเพื่อเปลี่ยนวัสดุปูพื้นในแท็บ 2": { en: "Click to change flooring in Tab 2", zh: "点击在标签2中更换地板材质" },
  "คลิกเพื่อปรับตำแหน่งประตู": { en: "Click to adjust door position", zh: "点击调整大门位置" },
  "ด้านหน้า": { en: "Front", zh: "正门" },
  "ผนังซ้าย": { en: "Left Wall", zh: "左墙" },
  "ผนังหลัง": { en: "Back Wall", zh: "后墙" },
  "ผนังขวา": { en: "Right Wall", zh: "右墙" },
  "ใช้งานอยู่": { en: "In Use", zh: "使用中" },
  "คลิกเพื่อดูสเปกเต็มและภาพสินค้า": { en: "Click to inspect full specs & photo", zh: "点击查看完整规格及实物照片" },
  "โทนสีวัสดุและไฟ": { en: "Material finishes & RGB accents", zh: "材质配色与氛围灯" },
  "สีท็อปโต๊ะ": { en: "Desktop finish", zh: "桌面颜色" },
  "สีไฟตกแต่ง": { en: "Lighting accent", zh: "装饰灯光颜色" },
  "สีเก้าอี้": { en: "Chair color", zh: "电竞椅颜色" },
  "ขนาด:": { en: "Size:", zh: "尺寸:" },
  "สูง": { en: "Height", zh: "高" },
  "เพิ่มลงในผัง 3D ทันที": { en: "Add directly to 3D layout", zh: "立即添加到3D平面图" },
  "รวม": { en: "Total", zh: "总计" },
  "โต๊ะ": { en: "Desk", zh: "桌" },
  "เก้าอี้": { en: "Chair", zh: "椅" },
  "ตัว": { en: "pcs", zh: "把" },
  "ล้างผังทั้งหมด": { en: "Clear entire layout", zh: "清空全部布局" },
  "ซูมย่อแปลน (-)": { en: "Zoom out (-)", zh: "缩小平面图 (-)" },
  "คลิกเพื่อรีเซ็ต 100%": { en: "Click to reset 100%", zh: "点击重置 100%" },
  "ซูมขยายแปลน (+)": { en: "Zoom in (+)", zh: "放大平面图 (+)" },
  "รีเซ็ตพอดีหน้าจอ (Fit to Screen 100%)": { en: "Fit to screen (100%)", zh: "适应屏幕 (100%)" },
  "โซฟาเลานจ์": { en: "Lounge Sofa", zh: "休息室沙发" },
  "คลิกเลือก หรือลากเพื่อย้ายตำแหน่ง": { en: "Click to select or drag to move position", zh: "点击选中或拖拽移动位置" },
  "กดเพื่อเลื่อนตำแหน่ง (หรือใช้ปุ่มลูกศร ↑ ↓ ← → บนคีย์บอร์ด)": { en: "Nudge position (or use arrow keys ↑ ↓ ← →)", zh: "微调位置（或使用键盘方向键 ↑ ↓ ← →）" },
  "เลื่อนซ้าย 0.2ม. (กด ←)": { en: "Nudge left 0.2m (Press ←)", zh: "向左微调 0.2米 (按 ←)" },
  "เลื่อนขึ้น 0.2ม. (กด ↑)": { en: "Nudge up 0.2m (Press ↑)", zh: "向上微调 0.2米 (按 ↑)" },
  "เลื่อนลง 0.2ม. (กด ↓)": { en: "Nudge down 0.2m (Press ↓)", zh: "向下微调 0.2米 (按 ↓)" },
  "เลื่อนขวา 0.2ม. (กด →)": { en: "Nudge right 0.2m (Press →)", zh: "向右微调 0.2米 (按 →)" },
  "สามารถเลือก Tier สเปกที่เหมาะสมกับกลุ่มลูกค้าและงบประมาณลงทุน (เก้าอี้เกมมิ่งรวมอยู่ในชุดโต๊ะแล้ว)": { en: "Select the hardware tier best suited to your target demographic and capital investment budget (gaming chairs already bundled with desks).", zh: "可根据目标客群与预算选择硬件规格层级（电竞椅已整合于工作站组合中）。" },
  "ดาวน์โหลดภาพแปลนสำหรับช่างและผู้รับเหมา (PNG)": { en: "Download architectural floorplan for contractors (PNG)", zh: "下载承包商施工蓝图 (PNG)" },
  "บริษัท จี-สปีด ลิฟวิ่ง พลัส จำกัด (สำนักงานใหญ่)": { en: "G-Speed Living Plus Co., Ltd. (Headquarters)", zh: "G-Speed Living Plus 有限公司（总部）" },
  "เลขที่ 88/9 อาคารจี-สปีด ทาวเวอร์ ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900": { en: "88/9 G-Speed Tower, Phahonyothin Rd, Lat Yao, Chatuchak, Bangkok 10900, Thailand", zh: "泰国曼谷乍都节区帕凤裕庭路 G-Speed 大厦 88/9 号 10900" },
  "เลขประจำตัวผู้เสียภาษีอากร: 0105566012345 | โทร: 02-888-9999 | เว็บไซต์: www.gspeed-esport.com": { en: "Tax ID: 0105566012345 | Tel: +66 2 888 9999 | Web: www.gspeed-esport.com", zh: "纳税人识别号: 0105566012345 | 电话: +66 2 888 9999 | 网站: www.gspeed-esport.com" },
  "ระบบได้บันทึกไฟล์พิมพ์เขียวและสัดส่วนพื้นที่": { en: "System has recorded blueprint dimensions", zh: "系统已成功登记蓝图及场地尺寸" },
  "เรียบร้อยแล้ว สถาปนิก G-Speed จะนำผังนี้ไปขึ้นแบบโครงสร้าง 3D Interior เสมือนจริงความละเอียดสูง (Photo-realistic Render) และจัดเตรียมใบเสนอราคาทางการส่งกลับให้ท่านภายใน 24 ชม.": { en: "successfully. G-Speed architects will generate photorealistic 3D interior renderings and prepare an official turnkey quotation within 24 hours.", zh: "已归档。G-Speed 建筑设计团队将以此深化超高清3D实景渲染图，并在24小时内向您发送官方总承包报价单。" },
  "คุณสมเกียรติ มั่นคง": { en: "e.g. John Doe / Somkiat M.", zh: "例如 张先生 / Somkiat M." },
  "คำนวณตามผังร้านและสเปค": { en: "Calculated from layout & specs", zh: "根据店面布局及硬件规格自动测算" },
  "คำนวณอัตโนมัติตามผัง": { en: "Auto-calculated based on layout of", zh: "按平面图自动测算" },
  "1,000,000 - 2,000,000 บาท": { en: "1,000,000 - 2,000,000 THB", zh: "100万 - 200万 泰铢" },
  "2,000,000 - 3,500,000 บาท": { en: "2,000,000 - 3,500,000 THB", zh: "200万 - 350万 泰铢" },
  "3,500,000 - 5,000,000 บาท": { en: "3,500,000 - 5,000,000 THB", zh: "350万 - 500万 泰铢" },
  "5,000,000 บาทขึ้นไป (Flagship Arena)": { en: "5,000,000+ THB (Flagship Arena)", zh: "500万 泰铢以上 (旗舰电竞馆)" },
  "งบประเมินรวมฮาร์ดแวร์และโครงสร้างพื้นฐาน:": { en: "Estimated capex (hardware & turnkey infrastructure):", zh: "预估总投资（含硬件及总包基础设施）:" },
  "เช่น มีอาคารพาณิชย์ 2 คูหา ย่าน ม.เกษตรศาสตร์ ติดถนนใหญ่...": { en: "e.g. 2 commercial shophouses near university, roadside location...", zh: "例如 大学城主干道旁两间商铺，临街位置..." },
  "ดาวน์โหลดแปลนสำหรับช่าง (PNG)": { en: "Download contractor blueprint (PNG)", zh: "下载施工蓝图 (PNG)" },
  "ปิดหน้าต่าง": { en: "Close dialog", zh: "关闭窗口" },
  "คลิกเพื่อย่อมุมมองปกติ": { en: "Click to reset normal view", zh: "点击还原正常视图" },
  "คลิกเพื่อขยายดูตัวอักษรและรายละเอียดขนาดใหญ่ (100% Zoom)": { en: "Click to zoom in for 100% full detail & readable text", zh: "点击放大查看100%细节及文字" },
  "หมุน": { en: "Rotate", zh: "旋转" },
  "ใช้งานอยู่": { en: "In Use", zh: "使用中" },
  "โซฟาเลานจ์": { en: "Lounge Sofa", zh: "休息室沙发" },
  "ด้านหน้า (Front)": { en: "Front", zh: "正门" },
  "ผนังซ้าย (Left)": { en: "Left Wall", zh: "左墙" },
  "ผนังหลัง (Back)": { en: "Back Wall", zh: "后墙" },
  "ผนังขวา (Right)": { en: "Right Wall", zh: "右墙" },
  "บริษัท จี-สปีด ลิฟวิ่ง พลัส จำกัด (สำนักงานใหญ่)": { en: "G-Speed Living Plus Co., Ltd. (Headquarters)", zh: "G-Speed Living Plus 有限公司（总部）" },
  "ใบเสนอราคาประเมินเบื้องต้น: แฟรนไชส์ GLP : G Speed Living Plus": { en: "Turnkey Franchise Quotation: GLP : G Speed Living Plus", zh: "加盟初步估价单：GLP : G Speed Living Plus" },
  "บันทึกข้อมูลและส่งแปลนร้านเรียบร้อย!": { en: "Information & Floorplan Submitted Successfully!", zh: "店铺资料与平面图提交成功！" },

  "เปิด/ปิดการแสดงผังแปลนที่แนบ": { en: "Toggle attached blueprint overlay", zh: "显示/隐藏附加蓝图" },
  "คลิกเพื่อปรับตำแหน่งประตูทางเข้าร้านและป้ายชื่อร้าน (ในแถบซ้าย)": { en: "Click to adjust entrance door & store signage (in left panel)", zh: "点击调整大门位置及招牌（左侧面板）" },
  "คลิกเพื่อเปลี่ยนวอลเปเปอร์ผนังและวัสดุพื้น": { en: "Click to change wall & flooring materials", zh: "点击更换墙纸与地面材质" },
  "คลิกเพื่อเปิดแท็บเพิ่มอุปกรณ์ (ในแถบซ้าย)": { en: "Click to open Add Equipment tab (in left panel)", zh: "点击打开添加设备面板（左侧面板）" },
  "ดูรายละเอียดอุปกรณ์ที่เลือก และรายการอุปกรณ์ในร้าน": { en: "View selected item details & venue inventory", zh: "查看选中设备详情及店内设备清单" },
  "ปรับแต่งตำแหน่งประตูทางเข้าร้าน รูปแบบประตู และป้ายชื่อร้าน": { en: "Configure entrance door, door style & store signage", zh: "配置店铺大门位置、款式及招牌" },
  "ปรับแต่งวอลเปเปอร์ผนังและวัสดุปูพื้นห้อง": { en: "Configure wall wallpaper & room flooring finishes", zh: "配置墙面壁纸与室内地坪材质" },
  "เลือกและเพิ่มอุปกรณ์/โต๊ะคอมลงในผัง": { en: "Browse & place gaming modules/stations into layout", zh: "浏览并添加电竞工作站/设施到平面图" },
  "ปิดหน้าต่างปรับประตู": { en: "Close door settings", zh: "关闭大门设置" },
  "เช่น GLP : G SPEED LIVING PLUS...": { en: "e.g. GLP : G SPEED LIVING PLUS...", zh: "例如 GLP : G SPEED LIVING PLUS..." },
  "สาขา สยามสแควร์": { en: "Siam Square Branch", zh: "暹罗广场店" },
  "ปิดการเลือก": { en: "Deselect item", zh: "取消选中" },
  "คลิกเพื่อดูสเปกเต็มและภาพสินค้าขยาย": { en: "Click to inspect full specs & HD photo", zh: "点击查看完整规格及高清图" },
  "คัดลอกโมดูลนี้ (Duplicate)": { en: "Duplicate this module (Duplicate)", zh: "复制此模块 (Duplicate)" },
  "ลบโมดูลนี้ออกจากผัง (กด Delete)": { en: "Delete module from layout (Press Delete)", zh: "从平面图中删除模块 (按 Delete)" },
  "ไปที่แท็บเพิ่มอุปกรณ์": { en: "Go to Add Equipment tab", zh: "前往添加设备标签" },
  "คลิกเพื่อเลือกและปรับตำแหน่งประตูทางเข้าร้าน": { en: "Click to select and adjust entrance door position", zh: "点击选择并调整大门位置" },
  "คลิกเพื่อย่อข้อมูล": { en: "Click to collapse info", zh: "点击折叠信息" },
  "คลิกเพื่อดูขนาด ราคา และจัดการอุปกรณ์": { en: "Click to view dimensions, price & manage equipment", zh: "点击查看尺寸、价格及管理模块" },
  "เลือกและปรับตำแหน่งในมุมมอง 3D": { en: "Select and fine-tune position in 3D", zh: "在3D视图中选中并调整位置" },
  "หมุน 90 องศา": { en: "Rotate 90 degrees", zh: "旋转 90 度" },
  "นำอุปกรณ์ชิ้นนี้ออกจากผังร้าน": { en: "Remove this item from layout", zh: "从店面平面图中移除此项" },
  "คลิกเพื่อเปลี่ยนวอลเปเปอร์ในแท็บ 2": { en: "Click to change wallpaper in Tab 2", zh: "点击在标签2中更换壁纸" },
  "คลิกเพื่อเปลี่ยนวัสดุปูพื้นในแท็บ 2": { en: "Click to change flooring in Tab 2", zh: "点击在标签2中更换地板材质" },
  "คลิกเพื่อปรับตำแหน่งประตู": { en: "Click to adjust door position", zh: "点击调整大门位置" },
  "ด้านหน้า": { en: "Front", zh: "正门" },
  "ผนังซ้าย": { en: "Left Wall", zh: "左墙" },
  "ผนังหลัง": { en: "Back Wall", zh: "后墙" },
  "ผนังขวา": { en: "Right Wall", zh: "右墙" },
  "ใช้งานอยู่": { en: "In Use", zh: "使用中" },
  "คลิกเพื่อดูสเปกเต็มและภาพสินค้า": { en: "Click to inspect full specs & photo", zh: "点击查看完整规格及实物照片" },
  "โทนสีวัสดุและไฟ": { en: "Material finishes & RGB accents", zh: "材质配色与氛围灯" },
  "สีท็อปโต๊ะ": { en: "Desktop finish", zh: "桌面颜色" },
  "สีไฟตกแต่ง": { en: "Lighting accent", zh: "装饰灯光颜色" },
  "สีเก้าอี้": { en: "Chair color", zh: "电竞椅颜色" },
  "สูง": { en: "Height", zh: "高" },
  "เพิ่มลงในผัง 3D ทันที": { en: "Add directly to 3D layout", zh: "立即添加到3D平面图" },
  "รวม": { en: "Total", zh: "总计" },
  "โต๊ะ": { en: "Desk", zh: "桌" },
  "เก้าอี้": { en: "Chair", zh: "椅" },
  "ตัว": { en: "pcs", zh: "把" },
  "ล้างผังทั้งหมด": { en: "Clear entire layout", zh: "清空全部布局" },
  "ซูมย่อแปลน (-)": { en: "Zoom out (-)", zh: "缩小平面图 (-)" },
  "คลิกเพื่อรีเซ็ต 100%": { en: "Click to reset 100%", zh: "点击重置 100%" },
  "ซูมขยายแปลน (+)": { en: "Zoom in (+)", zh: "放大平面图 (+)" },
  "รีเซ็ตพอดีหน้าจอ (Fit to Screen 100%)": { en: "Fit to screen (100%)", zh: "适应屏幕 (100%)" },
  "โซฟาเลานจ์": { en: "Lounge Sofa", zh: "休息室沙发" },
  "คลิกเลือก หรือลากเพื่อย้ายตำแหน่ง": { en: "Click to select or drag to move position", zh: "点击选中或拖拽移动位置" },
  "กดเพื่อเลื่อนตำแหน่ง (หรือใช้ปุ่มลูกศร ↑ ↓ ← → บนคีย์บอร์ด)": { en: "Nudge position (or use arrow keys ↑ ↓ ← →)", zh: "微调位置（或使用键盘方向键 ↑ ↓ ← →）" },
  "เลื่อนซ้าย 0.2ม. (กด ←)": { en: "Nudge left 0.2m (Press ←)", zh: "向左微调 0.2米 (按 ←)" },
  "เลื่อนขึ้น 0.2ม. (กด ↑)": { en: "Nudge up 0.2m (Press ↑)", zh: "向上微调 0.2米 (按 ↑)" },
  "เลื่อนลง 0.2ม. (กด ↓)": { en: "Nudge down 0.2m (Press ↓)", zh: "向下微调 0.2米 (按 ↓)" },
  "เลื่อนขวา 0.2ม. (กด →)": { en: "Nudge right 0.2m (Press →)", zh: "向右微调 0.2米 (按 →)" },
  "สามารถเลือก Tier สเปกที่เหมาะสมกับกลุ่มลูกค้าและงบประมาณลงทุน (เก้าอี้เกมมิ่งรวมอยู่ในชุดโต๊ะแล้ว)": { en: "Select the hardware tier best suited to your target demographic and capital investment budget (gaming chairs already bundled with desks).", zh: "可根据目标客群与预算选择硬件规格层级（电竞椅已整合于工作站组合中）。" },
  "ดาวน์โหลดภาพแปลนสำหรับช่างและผู้รับเหมา (PNG)": { en: "Download architectural floorplan for contractors (PNG)", zh: "下载承包商施工蓝图 (PNG)" },
  "เลขที่ 88/9 อาคารจี-สปีด ทาวเวอร์ ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900": { en: "88/9 G-Speed Tower, Phahonyothin Rd, Lat Yao, Chatuchak, Bangkok 10900, Thailand", zh: "泰国曼谷乍都节区帕凤裕庭路 G-Speed 大厦 88/9 号 10900" },
  "เลขประจำตัวผู้เสียภาษีอากร: 0105566012345 | โทร: 02-888-9999 | เว็บไซต์: www.gspeed-esport.com": { en: "Tax ID: 0105566012345 | Tel: +66 2 888 9999 | Web: www.gspeed-esport.com", zh: "纳税人识别号: 0105566012345 | 电话: +66 2 888 9999 | 网站: www.gspeed-esport.com" },
  "ระบบได้บันทึกไฟล์พิมพ์เขียวและสัดส่วนพื้นที่": { en: "System has recorded blueprint dimensions", zh: "系统已成功登记蓝图及场地尺寸" },
  "เรียบร้อยแล้ว สถาปนิก G-Speed จะนำผังนี้ไปขึ้นแบบโครงสร้าง 3D Interior เสมือนจริงความละเอียดสูง (Photo-realistic Render) และจัดเตรียมใบเสนอราคาทางการส่งกลับให้ท่านภายใน 24 ชม.": { en: "successfully. G-Speed architects will generate photorealistic 3D interior renderings and prepare an official turnkey quotation within 24 hours.", zh: "已归档。G-Speed 建筑设计团队将以此深化超高清3D实景渲染图，并在24小时内向您发送官方总承包报价单。" },
  "คุณสมเกียรติ มั่นคง": { en: "e.g. John Doe / Somkiat M.", zh: "例如 张先生 / Somkiat M." },
  "คำนวณตามผังร้านและสเปค": { en: "Calculated from layout & specs", zh: "根据店面布局及硬件规格自动测算" },
  "คำนวณอัตโนมัติตามผัง": { en: "Auto-calculated based on layout of", zh: "按平面图自动测算" },
  "1,000,000 - 2,000,000 บาท": { en: "1,000,000 - 2,000,000 THB", zh: "100万 - 200万 泰铢" },
  "2,000,000 - 3,500,000 บาท": { en: "2,000,000 - 3,500,000 THB", zh: "200万 - 350万 泰铢" },
  "3,500,000 - 5,000,000 บาท": { en: "3,500,000 - 5,000,000 THB", zh: "350万 - 500万 泰铢" },
  "5,000,000 บาทขึ้นไป (Flagship Arena)": { en: "5,000,000+ THB (Flagship Arena)", zh: "500万 泰铢以上 (旗舰电竞馆)" },
  "งบประเมินรวมฮาร์ดแวร์และโครงสร้างพื้นฐาน:": { en: "Estimated capex (hardware & turnkey infrastructure):", zh: "预估总投资（含硬件及总包基础设施）:" },
  "เช่น มีอาคารพาณิชย์ 2 คูหา ย่าน ม.เกษตรศาสตร์ ติดถนนใหญ่...": { en: "e.g. 2 commercial shophouses near university, roadside location...", zh: "例如 大学城主干道旁两间商铺，临街位置..." },
  "ดาวน์โหลดแปลนสำหรับช่าง (PNG)": { en: "Download contractor blueprint (PNG)", zh: "下载施工蓝图 (PNG)" },
  "ปิดหน้าต่าง": { en: "Close dialog", zh: "关闭窗口" },
  "คลิกเพื่อย่อมุมมองปกติ": { en: "Click to reset normal view", zh: "点击还原正常视图" },
  "คลิกเพื่อขยายดูตัวอักษรและรายละเอียดขนาดใหญ่ (100% Zoom)": { en: "Click to zoom in for 100% full detail & readable text", zh: "点击放大查看100%细节及文字" },
  "หมุน": { en: "Rotate", zh: "旋转" },
  "ใช้งานอยู่": { en: "In Use", zh: "使用中" },
  "โซฟาเลานจ์": { en: "Lounge Sofa", zh: "休息室沙发" },
  "ด้านหน้า (Front)": { en: "Front", zh: "正门" },
  "ผนังซ้าย (Left)": { en: "Left Wall", zh: "左墙" },
  "ผนังหลัง (Back)": { en: "Back Wall", zh: "后墙" },
  "ผนังขวา (Right)": { en: "Right Wall", zh: "右墙" },
  "บริษัท จี-สปีด ลิฟวิ่ง พลัส จำกัด (สำนักงานใหญ่)": { en: "G-Speed Living Plus Co., Ltd. (Headquarters)", zh: "G-Speed Living Plus 有限公司（总部）" },
  "ใบเสนอราคาประเมินเบื้องต้น: แฟรนไชส์ GLP : G Speed Living Plus": { en: "Turnkey Franchise Quotation: GLP : G Speed Living Plus", zh: "加盟初步估价单：GLP : G Speed Living Plus" },
  "บันทึกข้อมูลและส่งแปลนร้านเรียบร้อย!": { en: "Information & Floorplan Submitted Successfully!", zh: "店铺资料与平面图提交成功！" },

  "ใบเสนอราคาประเมินเบื้องต้น: แฟรนไชส์ GLP : G Speed Living Plus": { en: "Preliminary Investment Quotation: GLP G-Speed Living Plus Franchise", zh: "初审投资预算报价单: GLP G-Speed Living Plus 电竞馆加盟" },
  "บันทึกข้อมูลและส่งแปลนร้านเรียบร้อย!": { en: "Store Plan & Inquiry Successfully Submitted!", zh: "开店方案及意向信息已成功提交！" },
  "ทีมวิศวกรและผู้เชี่ยวชาญแฟรนไชส์ของ GLP : G Speed Living Plus จะตรวจสอบผังที่คุณออกแบบ และติดต่อกลับเพื่อเสนอนัดสำรวจสถานที่จริงภายใน 24 ชม.": { en: "GLP engineering & franchise experts will review your custom layout and contact you for an on-site survey within 24 hours.", zh: "GLP 专属工程师与投资顾问将审核您的场地设计，并在24小时内与您致电预约实地勘测。" },
  "บริษัท จี-สปีด ลิฟวิ่ง พลัส จำกัด (สำนักงานใหญ่)": { en: "G-Speed Living Plus Co., Ltd. (Headquarters)", zh: "G-Speed Living Plus 有限公司 (总部)" },
  "ผู้สนใจลงทุนแฟรนไชส์ (Franchise Investor)": { en: "Franchise Investor", zh: "意向加盟投资人 (Franchise Investor)" },
  "Black Obsidian (ดำด้าน)": { en: "Black Obsidian (Matte Black)", zh: "曜石黑 (质感哑光黑)" },
  "Esport Blue (น้ำเงิน)": { en: "Esport Blue (Pro Blue)", zh: "电竞深蓝 (Esport Blue)" },
  "Cyber Cyan (ฟ้าสว่าง)": { en: "Cyber Cyan (Electric Cyan)", zh: "赛博青蓝 (Cyber Cyan)" },
  "Aura Purple (ม่วง)": { en: "Aura Purple (Neon Violet)", zh: "极光幻紫 (Aura Purple)" },
  "บ.": { en: "THB", zh: "泰铢" },
  "เรากำลังนำข้อมูลขนาดพื้นที่": { en: "We are processing your space dimensions of", zh: "我们正在根据您的场地实用面积" },
  "และจำนวน": { en: "and capacity of", zh: "及规划电脑席位数" },
  "ไปจัดทำ รายงานวิเคราะห์ความเป็นไปได้ของโครงการ (Feasibility Study) พร้อมประมาณการผลตอบแทนรายเดือน โดยทีมงานผู้เชี่ยวชาญจะติดต่อกลับไปยังเบอร์": { en: "to generate your customized Feasibility Study and monthly ROI projection. Our advisory team will reach out to", zh: "测算专属可行性分析报告 (Feasibility Study) 与月度回报测算。官方专家将致电" },
  "หรืออีเมล": { en: "or email", zh: "或发送邮件至" },
  "ภายใน 24 ชั่วโมง เพื่อส่งมอบเอกสารสรุปโครงการและนัดหมายให้คำปรึกษาแบบ 1-on-1 โดยไม่มีค่าใช้จ่าย": { en: "within 24 hours to deliver the summary documentation and arrange a free 1-on-1 investment consultation.", zh: "在24小时内与您联系，交付正式项目方案并预约免费一对一开店咨询。" },
  "แปลนอ้างอิง:": { en: "Reference Plan:", zh: "参照底图:" },
  "เปิดอยู่": { en: "ON", zh: "已开启" },
  "ความชัด:": { en: "Opacity:", zh: "透明度:" },
  "สีผนัง": { en: "Wall Color", zh: "墙面颜色" },
  "สีพื้น": { en: "Floor Color", zh: "地面颜色" },
  "ภาพสินค้าจริงจากโรงงานผลิต G-Speed": { en: "Real Factory Manufactured Photo - G-Speed", zh: "G-Speed 专属工厂实体产品实拍" },
  "โทนสีและวัสดุตกแต่งจริง (Color & Finish)": { en: "Actual Colors & Finishes (Color & Finish)", zh: "实体色彩与质感用料 (Color & Finish)" },
  "สีท็อป & ขาโต๊ะ": { en: "Desktop & Leg Color", zh: "台面及桌腿颜色" },
  "สีไฟนีออน / ขอบตกแต่ง": { en: "Neon & Trim Color", zh: "霓虹灯光及装饰边" },
  "สีหนังเก้าอี้เกมมิ่ง": { en: "Gaming Chair Leather", zh: "电竞椅皮质配色" },
  "Racing Black (หนัง PU ดำเดินด้ายคู่)": { en: "Racing Black (Dual-stitched PU Leather)", zh: "竞速黑 (双线精工缝制PU环保皮革)" },
  "หน้าท็อปโต๊ะ:": { en: "Desktop Panel:", zh: "台面面板:" },
  "ไม้สังเคราะห์ HPL (High Pressure Laminate) ความหนา 25 มม. เกรดทนความร้อน กันน้ำ 100% และกันรอยขูดขีด": { en: "25mm High-Pressure Laminate (HPL) engineering core: heat-resistant, 100% waterproof, anti-scratch coating", zh: "25mm 高压层压复合耐磨板 (HPL)：耐热防刮痕，100%防水且经久耐磨" },
  "ขอบโต๊ะ Ergonomic:": { en: "Ergonomic Bevel Edge:", zh: "人体工学前沿微弧:" },
  "เจียรลบมุมลาดเอียง 45 องศา (Bevel Edge) ตามหลักสรีรศาสตร์ รองรับข้อมือผู้เล่นเกมได้สบายตลอดวัน": { en: "45-degree ergonomic bevel slope providing optimal wrist support for prolonged gaming marathons", zh: "45度人体工学斜切圆滑倒边，贴合手臂手腕，长久对战不累" },
  "โครงขาและคานรับแรง:": { en: "Steel Leg & Load Beams:", zh: "钢架支撑梁与桌腿:" },
  "เหล็กกล้าคาร์บอน (Carbon Steel Box) หนา 1.5 - 2.0 มม. พ่นสีพาวเดอร์โค้ตกันสนิม รองรับน้ำหนักได้มากกว่า 250 กก.": { en: "1.5-2.0mm high-tensile carbon steel box tubing with anti-corrosion powder coating, supports 250+ kg", zh: "1.5 - 2.0mm 高强度碳钢管结构，环保静电防锈喷塑，承重能力超 250kg" },
  "รุ่นเก้าอี้:": { en: "Chair Model:", zh: "电竞椅型号:" },
  "ประจำสถานี": { en: "per station", zh: "把/席位" },
  "เบาะรองนั่ง:": { en: "Seat Cushion:", zh: "座椅坐垫:" },
  "โฟมขึ้นรูปเย็นความหนาแน่นสูง (High-Density Cold-Cure Foam) ไม่ยุบตัว รับประกันการใช้งานต่อเนื่อง": { en: "High-density cold-cure molded foam cushion ensuring zero sag under continuous esports use", zh: "高密度一体发泡冷发泡海绵，久坐不塌陷，保障连续商业高频使用" },
  "ฟังก์ชันการปรับระดับ:": { en: "Recline & Armrests:", zh: "调节系统:" },
  "ปรับเอนหลังได้ 160 องศา พร้อมระบบล็อกมัลติฟังก์ชัน + ที่พักแขน 3D/4D ปรับระดับความสูงและองศาได้": { en: "160° stepless recline with multi-tilt locking + 3D/4D multi-directional adjustable armrests", zh: "160度大角度后仰逍遥锁定，配置3D/4D多向可调电竞扶手" },
  "ระบบรองรับน้ำหนัก:": { en: "Gas Lift Mechanism:", zh: "气压防爆升降:" },
  "โช้กแก๊ส Class 4 ผ่านการทดสอบความปลอดภัยระดับสากล BIFMA รองรับน้ำหนักสูงสุด 150 กก./ตัว": { en: "Class-4 explosion-proof gas lift certified to international BIFMA standards, rated for 150 kg", zh: "国际 BIFMA 认证 Class 4 防爆加厚气压棒，单把承重达 150kg" },
  "รางร้อยสายไฟใต้โต๊ะ (Dual Cable Raceway):": { en: "Under-Desk Dual Cable Raceway:", zh: "桌底强弱电双分离线槽:" },
  "รางเหล็กซ่อนสายไฟ 2 ช่องอิสระ แยกท่อไฟฟ้ากำลัง 220V และสายแลน LAN ป้องกันสัญญาณรบกวน (Zero Interference)": { en: "Independent dual steel cable ducts separating 220V power and CAT6A LAN for zero EMI signal interference", zh: "独立双金属理线槽，220V强电与CAT6A弱电网线物理隔离，确保零电磁干扰" },
  "จุดเต้ารับไฟฟ้าต่อสถานี:": { en: "Individual Power Sockets:", zh: "独立防浪涌插座:" },
  "เต้ารับคู่ 3 ขา มีกราวด์ (Universal Socket 220V 16A) พร้อมเบรกเกอร์กันไฟกระชาก (Surge Protection) 1:1": { en: "Universal 3-prong grounded 16A 220V sockets with 1:1 integrated surge protection circuitry", zh: "双联国标/通用三孔带接地电源插座 (220V 16A)，配备独立防浪涌保护" },
  "การเชื่อมต่อเน็ตเวิร์ก:": { en: "Network Terminations:", zh: "高速千兆网络端口:" },
  "เต้ารับ LAN RJ-45 CAT6A Shielded ความเร็ว 10Gbps Ready พร้อมท่อร้อยสายเชื่อมตรงสู่ตู้ Rack เซิร์ฟเวอร์": { en: "Shielded CAT6A RJ-45 LAN port 10Gbps-ready, routed directly into central server rack", zh: "六类屏蔽 CAT6A RJ-45 工业级网口，支持万兆速率直连中心机柜" },
  "โต๊ะมาตรฐาน": { en: "Standard Desk", zh: "标准对战桌" },
  "รางสายไฟครบชุด": { en: "complete raceway & cabling included", zh: "全套内置走线槽管线" },
  "กำลังซูม 100% (คลิกเพื่อย่อภาพรวม)": { en: "Zoomed 100% (Click to fit view)", zh: "100% 放大中 (点击还原整体视图)" },
  "คลิกภาพเพื่อซูมดูตัวหนังสือและอุปกรณ์ 100%": { en: "Click image to zoom 100% and inspect equipment text", zh: "点击图片可 100% 放大查看所有文字标注与设备细节" },
  "คำแนะนำ:": { en: "Tip:", zh: "操作提示:" },
  "คลิกที่ภาพเพื่อย่อมุมมองปกติ | เลื่อนลูกกลิ้งเมาส์เพื่อดูส่วนต่างๆ": { en: "Click image to reset to fit view | Use mouse wheel to scroll around", zh: "再次点击图片可还原全图 | 滚动鼠标滚轮浏览各分区" },
  "คลิกที่ภาพ หรือกดปุ่ม \"ขยายดูอุปกรณ์ 100%\" เพื่ออ่านตัวหนังสือชัดเจน": { en: "Click image or press \"100% Zoom\" button to view blueprint text clearly", zh: "点击图片或“100%放大”按钮，即可清晰阅读所有施工图纸标注" },
  "ชุดเครื่องคอมพิวเตอร์เกมมิ่งสเปก": { en: "Gaming Battle Station Hardware Package:", zh: "电竞专业电脑机台配置套组:" },
  "จอ": { en: "Display:", zh: "显示器:" },
  "เกมมิ่งเกียร์": { en: "Gaming Gear:", zh: "电竞外设:" },
  "(ไม่รวมเก้าอี้ - รวมในชุดโต๊ะ)": { en: "(Excl. Chairs - included in desk modules)", zh: "(不含椅 - 已在桌组中配备)" },
  "ชุดโต๊ะคอมพิวเตอร์เกมมิ่งพร้อมเก้าอี้ Ergonomic และโซนพิเศษในผัง": { en: "Gaming Desks with Ergonomic Chairs & Specialized Zones in Layout", zh: "电竞对战桌椅与VIP包厢工程 (全套人体工学座椅及专用桌)" },
  "จัดวางตามผังร้าน": { en: "Configured per store plan:", zh: "按场地规划排布:" },
  "โมดูล": { en: "modules", zh: "个模块" },
  "ชุด": { en: "set", zh: "套" },
  "ระบบ": { en: "system", zh: "套系统" },
  "สาขา": { en: "branch", zh: "家分店" },
  "(รวมเก้าอี้ Ergonomic ครบตามจำนวนที่นั่ง, รางร้อยสายไฟ, และกล่องเต้ารับคู่ 3 ขา)": { en: "(Includes Ergonomic chairs for all stations, cable raceway, dual-socket 3-prong electrical box)", zh: "(配齐所有席位人体工学椅、双槽走线管及防浪涌双三孔电源插座)" },
  "งานตกแต่งภายใน ระบบฝ้า ผนังกันเสียง & ไฟ Linear Modern": { en: "Interior Decoration, Acoustic Ceiling/Walls & Linear Lighting", zh: "室内硬装、吸音隔音墙面及线性矩阵赛博灯带" },
  "งานผนัง Acoustic ซับเสียง, งานพื้น Epoxy/กระเบื้องยาง Heavy-Duty, ป้ายไฟอะคริลิกเรืองแสงโลโก้แบรนด์": { en: "Acoustic sound absorption walls, heavy-duty commercial flooring, glowing brand logo sign", zh: "专业吸音阻尼墙面、重载商用防静电地板/地毯、3D发光品牌门头灯箱" },
  "งานระบบปรับอากาศ Inverter Cassette Type ประหยัดพลังงาน": { en: "Energy-Saving Commercial Inverter Cassette HVAC System", zh: "商用节能变频多联机吸顶空调及新风系统" },
  "เครื่องปรับอากาศฝังฝ้า 4 ทิศทาง พร้อมระบบระบายอากาศ Fresh Air Circulation สำหรับบริการ 24 ชม.": { en: "4-Way ceiling cassette inverter AC with fresh air circulation engineered for 24/7 operation", zh: "四面出风嵌入式变频吸顶机，配备独立新风排气系统，满足24小时连续高负荷运行" },
  "ระบบแม่ข่าย Diskless Server 10Gbps NVMe High-Availability": { en: "10Gbps NVMe Enterprise Diskless Master Server Cluster", zh: "万兆企业级无盘主控服务器集群 (双机热备)" },
  "เซิร์ฟเวอร์สำรอง Dual-Host ระบบอัปเดตเกมอัตโนมัติความเร็วสูง รองรับการบูตพร้อมกันโดยไม่มีสะดุด": { en: "Dual-Host failover server with automated high-speed game patching, instant concurrent boot with zero lag", zh: "双机热备服务器，配备200+款游戏库全自动极速更新，支撑全场瞬间无延迟并发启动" },
  "ระบบโครงข่ายเน็ตเวิร์ก Enterprise Dual-WAN & Cisco 10G Switch": { en: "Enterprise Dual-WAN Network Infrastructure & Cisco 10G Managed Switches", zh: "企业级双线光纤智能分流极速网络与思科万兆交换机" },
  "สายสัญญาณ LAN CAT6A Shielded + ตู้ Rack 42U Server + ระบบ UPS สำรองไฟขนาด 10kVA": { en: "CAT6A Shielded cabling + 42U Server Rack + 10kVA Central UPS battery backup system", zh: "CAT6A六类双屏蔽双绞线工程、42U标准服务器机柜、10kVA中央不间断电源UPS" },
  "ระบบบริหารจัดการร้าน Billing & Cloud Member POS System": { en: "Billing Management & Cloud Member POS Cashier System", zh: "专业电竞上机计费与云端会员收银POS一体化系统" },
  "โปรแกรมคิดเงิน ลิ้นชักเก็บเงิน เครื่องสแกนบาร์โค้ด และระบบสมาชิกระดับคลาวด์เชื่อมต่อส่วนกลาง": { en: "Billing software, electronic cash drawer, QR barcode scanner, cloud member integration & mobile dashboard", zh: "机台控制计费系统、智能防盗钱箱、扫码盒子及云端会员积分联网系统" },
  "ค่าสิทธิ์แฟรนไชส์ G-SPEED & บริการ Turnkey Onboarding ครบวงจร": { en: "G-Speed Franchise License & Full Turnkey Onboarding Package", zh: "G-Speed 品牌特许加盟授权及全套交钥匙带店开业服务" },
  "สิทธิ์การใช้แบรนด์, แปลนก่อสร้าง 3D, จัดฝึกอบรมผู้จัดการและพนักงาน, การตลาดและโปรโมทเปิดร้าน": { en: "Brand license, 3D architectural blueprint, manager & staff SOP training, opening marketing campaign", zh: "品牌使用权、3D施工深化图纸、店长与店员全套SOP培训、盛大开业企划宣传" },
  "ยอดรวมประมาณการลงทุนก่อนภาษี (Subtotal):": { en: "Pre-Tax Estimated Subtotal:", zh: "税前预估投资小计 (Subtotal):" },
  "ภาษีมูลค่าเพิ่ม 7% (VAT 7%):": { en: "Value Added Tax (VAT 7%):", zh: "增值税 7% (VAT 7%):" },
  "เงื่อนไขการชำระเงินแบ่ง 3 งวด:": { en: "3-Stage Payment Terms:", zh: "分三期支付节点:" },
  "งวดที่ 1 (มัดจำลงนามสัญญา) 30% | งวดที่ 2 (จัดส่งและติดตั้งอุปกรณ์) 50% | งวดที่ 3 (ตรวจรับงานและเปิดร้าน) 20%": { en: "Stage 1 (Contract Deposit) 30% | Stage 2 (Delivery & Fit-Out) 50% | Stage 3 (Final Inspection & Handover) 20%", zh: "第一期 (签约首付定金) 30% | 第二期 (设备进场与装修) 50% | 第三期 (整店交付验收) 20%" },
  "การรับประกัน (Warranty):": { en: "Turnkey Warranty:", zh: "质保承诺 (Warranty):" },
  "อุปกรณ์คอมพิวเตอร์และเซิร์ฟเวอร์รับประกัน On-site Service 3 ปีเต็ม, ระบบ Network ดูแลตลอด 24 ชม. ผ่าน Cloud Monitoring": { en: "PCs and servers include 3-Year full On-site Service warranty; network supervised 24/7 via cloud NOC monitoring", zh: "电脑硬件与服务器享受3年原厂上门保修，网络系统通过云端网管中心24小时不间断监控" },
  "ระยะเวลาก่อสร้างและส่งมอบ:": { en: "Delivery Timeline:", zh: "工期交付时间:" },
  "ดำเนินการแล้วเสร็จภายใน 4 - 6 สัปดาห์ พร้อมเปิดให้บริการเชิงพาณิชย์": { en: "Fully delivered and ready for commercial operation within 4 to 6 weeks", zh: "自签约进场起 4 - 6 周内全部完工交付，达到盛大营业标准" },
  "ราคารวมงานแบบเบ็ดเสร็จ (Turnkey):": { en: "Turnkey Scope:", zh: "交钥匙总包说明:" },
  "รวมค่าขนส่ง, การติดตั้งสายระบบไฟฟ้า, สายแลน, การคอนฟิกระบบ Diskless และการอบรมบุคลากร": { en: "Includes freight, electrical installation, LAN cabling, diskless server deployment, and staff SOP training", zh: "包含物流运输、强电配电安装、六类网线敷设、无盘系统搭建及全员实操培训" },
  "ซ้าย 25%": { en: "Left 25%", zh: "左侧 25%" },
  "หลัง 25%": { en: "Back 25%", zh: "后侧 25%" },
  "ตรงกลาง 50%": { en: "Center 50%", zh: "居中 50%" },
  "ขวา 75%": { en: "Right 75%", zh: "右侧 75%" },
  "หน้า 75%": { en: "Front 75%", zh: "前侧 75%" },
  "นีออน LED": { en: "Neon LED", zh: "发光霓虹" },
  "อะคริลิกทอง": { en: "Gold Acrylic", zh: "镜面金亚克力" },
  "มินิมอลไซเบอร์": { en: "Cyber Minimal", zh: "极简赛博" },
  "ซุ้มแกรนด์": { en: "Grand Arch", zh: "宏伟门头" },
  "โมดูลที่เลือก": { en: "Selected Module", zh: "已选模块" },
  "คลิกดูภาพขยาย & สเปกเต็ม": { en: "Click to Inspect Full Specs", zh: "点击查看大图及详细规格" },
  "รายละเอียดราคาอุปกรณ์ในโมดูล": { en: "Module Price Breakdown", zh: "模块设备价格清单" },
  "วอลเปเปอร์:": { en: "Wallpaper:", zh: "壁纸风格:" },
  "วัสดุปูพื้น:": { en: "Flooring:", zh: "地面材质:" },
  "ประตูทางเข้า:": { en: "Store Entrance:", zh: "入户大门:" },
  "พอดีจอ": { en: "Fit Screen", zh: "适应屏幕" },
  "เลือกอยู่": { en: "Selected", zh: "已选中" },
  "ชิ้นใหม่! ลากจัดผังได้เลย": { en: "New item! Drag to position", zh: "新设备！点击拖动排布" },
  "คลิกลาก": { en: "Click & Drag", zh: "鼠标拖动" },
  "ย้ายอิสระ": { en: "Freely", zh: "自由移动" },
  "ลูกศร": { en: "Arrow Keys", zh: "方向键" },
  "บนคีย์บอร์ด": { en: "on keyboard", zh: "键盘微调" },
  "การควบคุม:": { en: "Navigation Controls:", zh: "视角与操作说明:" },
  "หมุนมุมมองอิสระ 360° ด้วยเมาส์ซ้าย • ซูมเข้า-ออกด้วยลูกกลิ้ง • คลิกเลือกวัตถุเพื่อดูราคาโต๊ะและเก้าอี้": { en: "360° Free orbit with Left Mouse • Zoom with scroll wheel • Click objects to view desk & chair pricing", zh: "鼠标左键360度旋转视角 • 滚轮缩放 • 点击设备查看桌椅详情及造价" },
  "ใบเสนอราคา / ESTIMATED QUOTATION": { en: "ESTIMATED QUOTATION", zh: "正式工程报价单 / ESTIMATED QUOTATION" },
  "เลขที่ใบเสนอราคา:": { en: "Quotation Ref:", zh: "报价单编号:" },
  "วันที่ออกเอกสาร:": { en: "Date Issued:", zh: "出单日期:" },
  "กำหนดยืนราคา:": { en: "Price Validity:", zh: "报价有效期:" },
  "30 วันนับจากวันที่ระบุ": { en: "30 Days from Issue Date", zh: "出单日起 30 天内有效" },
  "ข้อมูลลูกค้า / ผู้ขอรับสิทธิ์แฟรนไชส์ (CUSTOMER INFO)": { en: "Customer & Franchisee Info", zh: "客户及加盟申请人信息 (CUSTOMER INFO)" },
  "ชื่อลูกค้า / นิติบุคคล:": { en: "Client / Company Name:", zh: "客户名称 / 企业法人:" },
  "เบอร์โทรศัพท์ติดต่อ:": { en: "Phone Number:", zh: "联系电话:" },
  "อีเมลติดต่อ:": { en: "Email Address:", zh: "电子邮箱:" },
  "งบประมาณที่เตรียมไว้:": { en: "Planned Budget:", zh: "拟定投资预算:" },
  "ข้อมูลโครงการสาขา (PROJECT SPECIFICATIONS)": { en: "Project Specifications", zh: "分店项目规格明细 (PROJECT SPECIFICATIONS)" },
  "ทำเลที่ตั้งสาขา:": { en: "Target Location:", zh: "选址意向地段:" },
  "รูปแบบพื้นที่:": { en: "Building Type:", zh: "场地建筑形态:" },
  "ขนาดพื้นที่ร้าน:": { en: "Store Dimensions:", zh: "场地实用面积:" },
  "สเปกคอมพิวเตอร์:": { en: "Hardware Tier:", zh: "选用硬件档次:" },
  "ขนาดพื้นที่:": { en: "Total Area:", zh: "场地面积:" },
  "จำนวนเครื่อง:": { en: "Stations:", zh: "电脑台数:" },
  "ระยะเวลาติดตั้ง:": { en: "Installation Timeline:", zh: "施工周期:" },
  "4-6 สัปดาห์": { en: "4-6 Weeks", zh: "4-6 周" },
  "จุดคุ้มทุนประเมิน:": { en: "Est. Payback:", zh: "预估回本期:" },
  "แนบแปลนอาคาร:": { en: "Blueprint Attached:", zh: "附带图纸:" },
  "แบบแปลนอาคารแนบพิเศษ (Custom Blueprint Attached)": { en: "Custom Blueprint Attached", zh: "客户附带专属建筑图纸 (Custom Blueprint Attached)" },
  "ลำดับ": { en: "No.", zh: "序号" },
  "รายการรายละเอียดอุปกรณ์และงานระบบ (BOQ ITEM DESCRIPTION)": { en: "Item Description & Scope of Work (BOQ)", zh: "工程及设备明细项目说明 (BOQ DESCRIPTION)" },
  "จำนวน": { en: "Qty", zh: "数量" },
  "ราคาต่อหน่วย": { en: "Unit Price", zh: "单价" },
  "รวมเงิน (บาท)": { en: "Total (THB)", zh: "合价 (泰铢)" },
  "รวมราคาสินค้าและบริการ (SUBTOTAL):": { en: "SUBTOTAL:", zh: "合计总额 (SUBTOTAL):" },
  "ภาษีมูลค่าเพิ่ม (VAT 7%):": { en: "VAT (7%):", zh: "增值税 (VAT 7%):" },
  "ยอดรวมสุทธิทั้งสิ้น (GRAND TOTAL):": { en: "GRAND TOTAL:", zh: "最终结算法定总价 (GRAND TOTAL):" },
  "เงื่อนไขและข้อตกลงทางการค้า (COMMERCIAL TERMS & WARRANTY)": { en: "Commercial Terms & Warranty", zh: "商业条款及售后保证 (COMMERCIAL TERMS & WARRANTY)" },
  "ผู้อนุมัติเสนอราคา (Authorized Signature)": { en: "Authorized Signature", zh: "报价审批授权人 (Authorized Signature)" },
  "ฝ่ายพัฒนาธุรกิจแฟรนไชส์ / G-Speed Living Plus Co., Ltd.": { en: "Franchise Business Development / G-Speed Living Plus Co., Ltd.", zh: "特许加盟业务拓展部 / G-Speed Living Plus Co., Ltd." },
  "ผู้ขอรับสิทธิ์แฟรนไชส์ / ลูกค้า (Franchisee Acceptance)": { en: "Franchisee Acceptance / Client", zh: "加盟申请人确认签字 / 客户 (Franchisee Acceptance)" },
  "ผู้ตกลงยินยอมตามใบเสนอราคา": { en: "Agreement of Quotation", zh: "同意本报价单全部条款并确认" },
  "วันที่:": { en: "Date:", zh: "日期:" },
  "คำนวณอัตโนมัติตามผัง": { en: "Calculated from layout", zh: "根据当前排布自动测算" },
  "มีงบประมาณเฉพาะ / ปรึกษาผู้เชี่ยวชาญ": { en: "Custom Budget / Consult Expert", zh: "有特定投资预算 / 专属专家咨询" },
  "บันทึกแปลนร้านสำเร็จ • REF ID:": { en: "Store Plan Saved • REF ID:", zh: "方案保存成功 • 参考编号:" },
  "ขอขอบพระคุณที่ให้ความไว้วางใจ": { en: "Thank You for Your Trust", zh: "感谢您对 GLP 的信赖与支持" },
  "ทีมวิศวกรออกแบบระบบและที่ปรึกษาการลงทุนแฟรนไชส์ GLP ได้รับข้อมูลพิมพ์เขียวผังร้านของคุณเรียบร้อยแล้ว": { en: "The GLP engineering and franchise advisory team has received your 3D floor plan layout.", zh: "GLP 专业系统工程师及加盟投资顾问已成功接收您的3D场地规划方案。" },
  "การประสานงานติดต่อกลับภายใน 24 ชั่วโมง": { en: "Direct 24-Hour Follow-Up Promise", zh: "24小时内专属专家致电跟进承诺" },
  "ผังร้านที่จัดวาง": { en: "Planned Stations", zh: "规划电脑机位" },
  "งบประมาณประเมิน": { en: "Estimated Budget", zh: "预估投资额" },
  "สถานะอีเมลตอบกลับ": { en: "Email Dispatch", zh: "邮件送达状态" },
  "ส่งสำเนาอัตโนมัติแล้ว": { en: "Auto Copy Sent", zh: "自动确认函已发送" },
  "ระบบกำลังพาท่านกลับสู่หน้าแรกอัตโนมัติในอีก": { en: "Redirecting to homepage in", zh: "系统将在" },
  "วินาที": { en: "seconds", zh: "秒后返回首页" },
  "กลับสู่หน้าหลักทันที (Go to Home)": { en: "Go to Home Now", zh: "立即返回网站首页" },
  "ดูแปลนจำลองต่อ": { en: "Continue Exploring Plan", zh: "继续查看3D设计" },
  "ตารางเมตร": { en: "sqm", zh: "平方米" },
  "วัน": { en: "days", zh: "天" },
  "บาท": { en: "THB", zh: "泰铢" },
  "บาท/ชม.": { en: "THB/hr", zh: "泰铢/时" },
  "กว้าง": { en: "Width", zh: "宽度" },
  "ลึก": { en: "Depth", zh: "进深" },
  "สูง": { en: "Height", zh: "高度" },
  "ยกเลิก": { en: "Cancel", zh: "取消" },
  "ปิด": { en: "Close", zh: "关闭" },
  "ปิดหน้าต่าง": { en: "Close", zh: "关闭窗口" },
  "เลือกโมเดลขนาดสำเร็จรูป (Preset Models):": { en: "Select Preset Models:", zh: "选择标准预设户型:" },
  "ความกว้างห้อง (Width):": { en: "Room Width (Width):", zh: "场地宽度 (Width):" },
  "ความลึก/ความยาวห้อง (Length):": { en: "Room Length (Length):", zh: "场地进深/长度 (Length):" },
  "พื้นที่ใช้สอยรวม:": { en: "Total Usable Area:", zh: "总使用面积:" },
  "รองรับได้ประมาณ": { en: "Supports approx.", zh: "约可容纳" },
  "แบบไม่อึดอัด": { en: "comfortably spaced", zh: "舒适不拥挤" },
  "มีแบบแปลนพิมพ์เขียวอาคารจริงของคุณอยู่แล้ว?": { en: "Already have an architectural blueprint of your building?", zh: "已有实体场地的建筑施工蓝图？" },
  "สลับไปอัปโหลดแปลน (ตัวเลือกเสริม)": { en: "Switch to Blueprint Upload (Optional)", zh: "切换至蓝图上传 (AI可选)" },
  "ลากไฟล์แปลนอาคารมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์ (ตัวเลือกเสริม)": { en: "Drag & drop blueprint file here or click to select (Optional)", zh: "拖拽建筑图纸至此处，或点击选择文件 (可选)" },
  "รองรับไฟล์ภาพแบบแปลนพิมพ์เขียว, ภาพวาดผังร้าน, สเก็ตช์ 2D, ไฟล์สแกน (PNG, JPG, WEBP)": { en: "Supports architectural blueprints, floor plan drawings, 2D sketches, scans (PNG, JPG, WEBP)", zh: "支持建筑蓝图、平面布置图、2D手绘草图、扫描件 (PNG, JPG, WEBP)" },
  "เลือกไฟล์แปลนจากเครื่อง": { en: "Choose Blueprint File", zh: "从本地选择蓝图" },
  "ทดลองใช้แปลนตัวอย่างอาคารพาณิชย์": { en: "Try Commercial Shophouse Sample", zh: "体验商用排屋示例蓝图" },
  "AI กำลังสแกนแปลนอาคาร วัดสเกลพื้นที่ และคำนวณการจัดสรรโซนร้านเกม...": { en: "AI is scanning blueprint, measuring area scale, and calculating esports zone layout...", zh: "AI 正在扫描图纸、测算空间比例并规划电竞分区..." },
  "แนบแปลนสำเร็จ:": { en: "Blueprint Attached:", zh: "已成功载入图纸:" },
  "ลบแปลนนี้": { en: "Remove Blueprint", zh: "移除图纸" },
  "เปลี่ยนไฟล์ใหม่": { en: "Change File", zh: "更换文件" },
  "ความกว้างอาคารจริง (Width):": { en: "Actual Building Width (Width):", zh: "实际建筑宽度 (Width):" },
  "ความลึก/ความยาวอาคารจริง (Length):": { en: "Actual Building Length (Length):", zh: "实际建筑进深 (Length):" },
  "ความจุเครื่องที่แนะนำ:": { en: "Recommended Capacity:", zh: "建议电脑台数:" },
  "งบลงทุนประมาณการ:": { en: "Estimated Investment:", zh: "预估投资总额:" },
  "กำไรสุทธิคาดการณ์:": { en: "Estimated Monthly Net Profit:", zh: "预计月净利润:" },
  "จุดคุ้มทุน (ROI):": { en: "Payback Period (ROI):", zh: "投资回报期 (ROI):" },
  "การจัดสรรสัดส่วนโซนที่คำนวณได้:": { en: "Calculated Zone Allocation:", zh: "智能测算分区规划比例:" },
  "คำแนะนำเชิงกลยุทธ์การจัดวางผังร้าน (Smart Layout Advice)": { en: "Smart Layout Strategic Advice", zh: "专业场地布局规划建议 (Smart Layout Advice)" },
  "1. ทางเข้า & เคาน์เตอร์แคชเชียร์": { en: "1. Entrance & Cashier Reception", zh: "1. 进店入口与收银接待台" },
  "ตั้งขนานประตูทางเข้า คุมทัศนวิสัย 180 องศา ต้อนรับลูกค้าทันทีและดูแลความปลอดภัย": { en: "Aligned with entrance with 180° visibility for immediate greeting and store safety monitoring", zh: "正对入口主通道，掌控180度全场视野，第一时间接待顾客并保障场内安全" },
  "2. แนวโต๊ะคอม (Island Back-to-Back)": { en: "2. Station Island (Back-to-Back)", zh: "2. 中央背靠背对战工作岛" },
  "วางเกาะกลางหันหลังชนกัน ซ่อนรางสายไฟและท่อแอร์ลงกลางโต๊ะ ประหยัดสายแลน 40% เว้นทางเดิน 1.5 ม.": { en: "Back-to-back center island concealing power and AC ducts, saving 40% LAN cabling with 1.5m aisles", zh: "中央背对背排布，线槽管线中置隐藏，节省40%网线耗材，预留1.5米宽阔主通道" },
  "3. ห้องซ้อม VIP Bootcamp Suite": { en: "3. VIP Bootcamp Suite", zh: "3. VIP 私享隔音集训包厢" },
  "กั้นห้องกระจกเก็บเสียงโซนด้านในสุด ลดเสียงรบกวน เหมาะกับการฝึกซ้อมทีมและสตรีมเมอร์": { en: "Soundproof glass partition in innermost area for noise isolation, ideal for team training and streaming", zh: "位于场馆最深处隔音独立空间，阻隔外界喧闹，专供战队集训拉练与主播直播" },
  "4. ห้องเซิร์ฟเวอร์ & ตู้ไฟ MDB": { en: "4. Server Room & Main MDB", zh: "4. 机房服务器与配电总闸 MDB" },
  "วางชิดผนังมุมหลังร้าน แยกห้องล็อก ปลอดภัย ติดตั้งระบบ UPS สำรองไฟและแอร์เฉพาะตัว 24 ชม.": { en: "Positioned against rear wall, secured access with UPS backup power and dedicated 24/7 cooling", zh: "紧贴后墙角落独立锁闭，配备大容量UPS不间断电源及24小时专用机房精密空调" },
  "จัดวางผังร้านอัตโนมัติ": { en: "Auto-Generate Layout", zh: "智能一键自动排布" },
  "จัดวางผังด้วยตนเอง": { en: "Design Layout Manually", zh: "手动自定义排布" },
  "ต้องการใช้ขนาดห้องและโมเดลสำเร็จรูปมาตรฐาน?": { en: "Want to use standard room dimensions and presets?", zh: "需要使用标准房间尺寸与预设模型？" },
  "สลับไปใช้โมเดลสำเร็จรูป (ค่าเริ่มต้น)": { en: "Switch to Presets (Default)", zh: "切换至预设户型 (默认)" },
  "ใช้แปลนอาคาร:": { en: "Using Blueprint:", zh: "使用图纸:" },
  "ขนาดพื้นที่จำลอง:": { en: "Simulated Space:", zh: "模拟场地尺寸:" },
  "กรุงเทพฯ และปริมณฑล (ย่านมหาวิทยาลัย/ชุมชน)": { en: "Bangkok & Vicinity (University/Residential)", zh: "曼谷及周边都会区 (大学城/核心商圈)" },
  "เชียงใหม่ / ภาคเหนือ": { en: "Chiang Mai / Northern Thailand", zh: "清迈 / 泰国北部地区" },
  "ขอนแก่น / โคราช / ภาคอีสาน": { en: "Khon Kaen / Korat / Isan", zh: "孔敬 / 呵叻 / 东北部地区" },
  "ชลบุรี / พัทยา / ภาคตะวันออก": { en: "Chonburi / Pattaya / Eastern EEC", zh: "春武里 / 芭提雅 / 泰国东部" },
  "ภูเก็ต / สงขลา / ภาคใต้": { en: "Phuket / Songkhla / Southern Thailand", zh: "普吉岛 / 宋卡 / 泰国南部" },
  "อาคารพาณิชย์ 2-3 คูหา (Commercial Shophouse)": { en: "2-3 Unit Commercial Shophouse", zh: "2-3 联排商业排屋 (Shophouse)" },
  "พื้นที่เช่าในศูนย์การค้า / ไลฟ์สไตล์มอลล์ (Shopping Mall)": { en: "Shopping Mall / Lifestyle Center Unit", zh: "大型商场 / 购物生活广场租赁铺位" },
  "อาคารเดี่ยว Standalone หรือโกดัง Renovate": { en: "Standalone Building / Renovated Warehouse", zh: "独立单体建筑 / 仓储改建空间" },
  "ใกล้มหาวิทยาลัย / หอพักนักศึกษา": { en: "Near University / Student Dormitories", zh: "大学校园周边 / 学生公寓生活区" },
  "ทำเลรอสำรวจพื้นที่จริง": { en: "Location awaiting site survey", zh: "地段等待实地勘测" },
  "ไม่ได้ระบุ": { en: "Not specified", zh: "未指定" },
  "โต๊ะและโครงสร้าง": { en: "Desk & Structure", zh: "电竞桌与主体结构" },
  "เก้าอี้เกมมิ่ง / ที่นั่ง": { en: "Gaming Chairs / Seats", zh: "电竞椅 / 席位" },
  "ไม่มี": { en: "None", zh: "无" },
  "มิติขนาด (กว้าง x ลึก x สูง)": { en: "Dimensions (W x D x H)", zh: "外形尺寸 (长 x 宽 x 高)" },
  "ราคารวมโมดูลนี้:": { en: "Total Module Price:", zh: "当前模块总价:" },
  "ตำแหน่ง & ทิศทางในห้อง": { en: "Position & Orientation", zh: "在场地中的坐标与角度" },
  "คลิกลากย้ายอิสระ หรือกดปุ่มลูกศร [↑][↓][←][→] บนคีย์บอร์ด": { en: "Drag freely or use arrow keys [↑][↓][←][→] on keyboard", zh: "点击自由拖动，或使用键盘方向键 [↑][↓][←][→] 微调" },
  "ยังไม่มีอุปกรณ์ในผังร้าน คลิกปุ่ม \"+ เพิ่มอุปกรณ์\" ด้านบนเพื่อเริ่มจัดวาง": { en: "No equipment in store layout yet. Click \"+ Add Equipment\" above to begin placing!", zh: "场地内暂无设备，点击上方 \"+ 添加设备\" 开始布置" },
  "สรุปงบลงทุนเบื้องต้น": { en: "Initial Investment Summary", zh: "初期投资预算汇总" },
  "ฮาร์ดแวร์": { en: "Hardware", zh: "电脑硬件" },
  "โต๊ะ เก้าอี้ และห้อง VIP:": { en: "Desks, Chairs & VIP Rooms:", zh: "桌椅与VIP包厢工程:" },
  "งานตกแต่ง Interior": { en: "Interior Decoration", zh: "室内装饰工程" },
  "ระบบแอร์ & ระบายอากาศ:": { en: "HVAC & Ventilation:", zh: "空调及新风排气系统:" },
  "ค่าแฟรนไชส์ & สิทธิ์การใช้แบรนด์:": { en: "Franchise License & Brand Rights:", zh: "加盟品牌授权及开业指导费:" },
  "งบประมาณลงทุนรวมโดยประมาณ:": { en: "Estimated Total Turnkey Investment:", zh: "全套整店投资预算预估:" },
  "* รวมฮาร์ดแวร์ ตกแต่ง และเปิดร้านพร้อมใช้งาน": { en: "* Turnkey package: includes hardware, interior fit-out, and grand opening readiness", zh: "* 包含全套电脑硬件、装修工程及开业即营运标准" },
  "ดูสเปกเต็ม": { en: "View Full Specs", zh: "查看详细规格" },
  "โทนสีวัสดุและไฟ": { en: "Material and Lighting Tones", zh: "材质与灯光色彩" },
  "สีท็อปโต๊ะ": { en: "Desk Top Color", zh: "桌面面板颜色" },
  "สีไฟตกแต่ง": { en: "Accent Lighting Color", zh: "氛围灯光颜色" },
  "สีเก้าอี้": { en: "Chair Color", zh: "座椅颜色" },
  "ขนาด:": { en: "Size:", zh: "尺寸:" },
  "รวม": { en: "Total", zh: "合计" },
  "ดูสเปก": { en: "Specs", zh: "规格" },
  "โต๊ะ": { en: "Desk", zh: "桌子" },
  "เก้าอี้": { en: "Chairs", zh: "椅子" },
  "โมเดลผังร้านสำเร็จรูป:": { en: "Preset Layout Models:", zh: "预设户型排布:" },
  "ล้างผังทั้งหมด": { en: "Clear All Layout", zh: "清空所有布局" },
  "คุณต้องการล้างผังร้านทั้งหมดใช่หรือไม่?": { en: "Are you sure you want to clear all layout items?", zh: "您确定要清空场地中的所有设备布局吗？" },
  "วอลเปเปอร์ผนัง & วัสดุพื้น": { en: "Wall Finishes & Flooring", zh: "墙面风格与地面材质" },
  "คลิกเพื่อเปลี่ยนโทนสี แสดงผล 3D จำลองแสงทันที": { en: "Click to change finish tones, preview live in 3D", zh: "点击切换色彩风格，3D实时光影渲染" },
  "1. วอลเปเปอร์ผนังร้าน (Wall Finishes):": { en: "1. Wall Finishes:", zh: "1. 场馆墙面壁纸风格 (Wall Finishes):" },
  "2. วัสดุปูพื้นห้อง (Floor Finishes):": { en: "2. Floor Finishes:", zh: "2. 地面铺装材质 (Floor Finishes):" },
  "ใช้งานอยู่": { en: "Active", zh: "使用中" },
  "💡 ผนังและพื้นจะคำนวณในหมวด \"งานตกแต่ง Interior\" ในงบลงทุนโดยอัตโนมัติ": { en: "💡 Walls and floors are automatically calculated under \"Interior Decoration\" in budget.", zh: "💡 墙面与地面将自动汇总计入预算中的“室内装饰工程”类目。" },
  "← กลับไปดูรายละเอียดผังร้าน": { en: "← Back to Layout Details", zh: "← 返回场地规划详情" },
  "เพิ่มอุปกรณ์และโซนในร้าน": { en: "Add Equipment & Zones", zh: "添加设备与功能分区" },
  "กดปุ่ม + ด้านขวา เพื่อเพิ่มโต๊ะ/อุปกรณ์ลงในห้องทันที": { en: "Click the + button on the right to place items into layout instantly", zh: "点击右侧 + 按钮，即可将设备直接加入到场地中" },
  "โต๊ะคอม": { en: "Gaming Desks", zh: "电竞桌" },
  "บริการ/เคาน์เตอร์": { en: "Service/Counter", zh: "服务台/前台" },
  "ประตู/หน้าต่าง": { en: "Doors/Windows", zh: "门窗结构" },
  "จำนวนเครื่องในผังของคุณปัจจุบันคือ": { en: "Current stations in your layout:", zh: "您当前场地布局的电脑总数为" },
  "สามารถเลือก Tier สเปกที่เหมาะสมกับกลุ่มลูกค้าและงบประมาณลงทุน (เก้าอี้เกมมิ่งรวมอยู่ในชุดโต๊ะแล้ว)": { en: "Choose the hardware tier fitting your target gamers and budget (gaming chairs are already included in desk sets)", zh: "请选择符合客群定位及预算的电脑硬件档次 (电竞椅已包含在桌组中)" },
  "ผู้ดูแลระบบ:": { en: "Administrator:", zh: "管理员权限:" },
  "สามารถเข้าไปปรับแต่งรายละเอียดสเปก เพิ่มโมเดล หรือแก้ไขราคาต่อเครื่องและงานระบบได้ทุกจุด": { en: "Customize hardware specs, add components, or edit pricing at any time", zh: "可随时在后台调整硬件规格、新增机型或修改各项目单价" },
  "เปิดแผงจัดการสเปก & ราคา (Admin CMS)": { en: "Open Hardware & Pricing CMS", zh: "进入硬件配置与价格管理后台" },
  "/ เครื่อง (ครบชุด)": { en: "/ station (complete set)", zh: "/ 台 (完整全套)" },
  "เก้าอี้เกมมิ่ง:": { en: "Gaming Chair:", zh: "专业电竞椅:" },
  "รวมอยู่ในชุดโต๊ะเกมมิ่งแล้ว": { en: "Included in desk module set", zh: "已标配包含在电竞桌组中" },
  "เลือกสเปกนี้แล้ว": { en: "Selected This Tier", zh: "已选用该配置" },
  "เลือกใช้สเปกนี้": { en: "Select This Tier", zh: "选用该档次配置" },
  "ระบบเซิร์ฟเวอร์แม่ข่าย & เครือข่าย (Included Infrastructure)": { en: "Included Infrastructure: Master Server & Network", zh: "核心主控机房与极速网络工程 (标配包含)" },
  "แม่ข่าย NVMe Enterprise 2 เครื่อง รันเกม 200+ เกม ไม่ต้องลงเกมทีละเครื่อง อัปเดตแพทช์อัตโนมัติ 24 ชม.": { en: "Dual Enterprise NVMe Master servers supporting 200+ games with zero local installation and 24/7 automated patching", zh: "双台企业级NVMe高可用母机，承载200+款主流游戏，免单机安装，24小时自动更新游戏补丁" },
  "ระบบสำรองเน็ต 2 เส้น อัตโนมัติ ป้องกันเน็ตหลุด ปิงนิ่งระดับ 1-3ms พร้อม Cisco Managed Switch 10G": { en: "Automated dual-line fiber failover, ultra-low ping (< 3ms), and Cisco 10G managed switches", zh: "双ISP多线自动灾备与智能分流，确保比赛极低Ping (1-3ms)，配备思科万兆管理型交换机" },
  "ระบบบริหารจัดการสมาชิก คิดเงิน คุมเวลาหน้าจอ และสั่งเครื่องดื่มผ่านโต๊ะคอมพิวเตอร์ มีแดชบอร์ดดูยอดขายบนมือถือ": { en: "Member management, screen time billing, desktop food/beverage ordering, and real-time mobile revenue dashboard", zh: "集会员管理、上机计费、桌面扫码点餐点饮品于一体，支持手机端实时查看营收数据" },
  "ถัดไป: สรุปงบ": { en: "Next: Budget & ROI", zh: "下一步: 预算与回报" },
  "แจกแจงรายการต้นทุน (Turnkey Breakdown)": { en: "Turnkey Cost Breakdown", zh: "全套整店投资清单明细 (Turnkey Package)" },
  "หมวดหมู่งาน": { en: "Work Category", zh: "工程与采购大类" },
  "งบประมาณ": { en: "Budget", zh: "预算金额" },
  "1. เครื่องคอมพิวเตอร์ & เกมมิ่งเกียร์ (ไม่รวมเก้าอี้)": { en: "1. Battle Stations & Gaming Gear (Excl. Chairs)", zh: "1. 电竞电脑工作站与竞技外设 (不含椅)" },
  "2. ชุดโต๊ะคอมเกมมิ่ง & เก้าอี้ Ergonomic ในผัง": { en: "2. Gaming Desks & Ergonomic Chairs in Layout", zh: "2. 场内电竞对战桌椅与VIP包厢工程" },
  "โต๊ะเกมมิ่งพร้อมเก้าอี้ตามจำนวนที่นั่ง, ห้อง VIP, เวที 5v5": { en: "Gaming desks with chairs matching seats, VIP suites, 5v5 stage", zh: "含按座位配齐的电竞桌、人体工学椅、VIP私享包厢与5v5主舞台" },
  "3. ตกแต่งภายใน & ไฟ Linear Modern": { en: "3. Interior Fit-Out & Modern Linear Lighting", zh: "3. 室内硬装、吸音墙面与极光线性灯带" },
  "พื้น, ผนังกันเสียง, ไฟ Linear": { en: "Flooring, acoustic walls, architectural linear lights", zh: "地胶地毯、声学阻尼隔音墙、矩阵赛博灯光" },
  "4. งานระบบแอร์ Inverter": { en: "4. Commercial Inverter HVAC System", zh: "4. 商用变频多联机空调及新风系统" },
  "แอร์ Cassette 4 ทิศทาง": { en: "4-Way Cassette Inverter Air Conditioning", zh: "商用4面出风嵌入式变频吸顶空调" },
  "5. แม่ข่าย Diskless Server 10G": { en: "5. 10G Diskless Master Server System", zh: "5. 万兆无盘主控服务器集群" },
  "Server แม่ข่าย NVMe 2 ชุด + คลังเกม 200+ เกม อัปเดตอัตโนมัติ": { en: "Dual NVMe Master Servers + 200+ Game Library with auto-updates", zh: "双NVMe企业级主母机 + 200+款游戏库24小时全自动更新" },
  "6. เน็ตเวิร์ก Enterprise Dual-WAN": { en: "6. Enterprise Dual-WAN Network Infrastructure", zh: "6. 企业级双线极速网络与布线工程" },
  "Cisco 10G Switches, Mikrotik Router, สายแลน Shielded, ตู้ Rack": { en: "Cisco 10G switches, Mikrotik router, Shielded CAT6A, 42U rack", zh: "思科万兆交换机、Mikrotik核心路由、六类双屏蔽网线、42U机柜" },
  "7. ซอฟต์แวร์ Billing & เครื่อง POS": { en: "7. Billing Software & POS Cashier Terminal", zh: "7. 专业电竞计费系统与触控收银POS台" },
  "ระบบคุมเครื่อง, ลิ้นชักเก็บเงิน, สแกนเนอร์, ระบบสั่งอาหาร": { en: "Client management, cash drawer, QR barcode scanner, in-desk food ordering", zh: "机台控制客户端、智能钱箱、扫码盒、桌面扫码点餐点单系统" },
  "8. ค่าแฟรนไชส์ & การอบรมเปิดร้าน": { en: "8. Franchise License & Opening Training", zh: "8. 品牌加盟特许授权与开业带店指导" },
  "สิทธิ์ใช้แบรนด์ G-Speed, แบบ 3D ก่อสร้าง, อบรมพนักงาน, การตลาดวันเปิดร้าน": { en: "G-Speed brand license, 3D architectural drawings, staff SOP training, opening marketing", zh: "G-Speed品牌使用权、3D施工图纸、全套SOP员工培训、开业营销企划" },
  "รวมงบประมาณลงทุนทั้งสิ้น (Turnkey Package):": { en: "Total Turnkey Investment Package:", zh: "整店交付总投资额 (Turnkey Package):" },
  "พร้อมเปิดให้บริการ": { en: "Turnkey & Ready to Open", zh: "交钥匙工程 • 达到开业营业标准" },
  "จำลองรายได้ & ระยะเวลาคืนทุน (Interactive ROI)": { en: "Revenue & Payback Simulator (Interactive ROI)", zh: "财务收益测算与投资回本期 (Interactive ROI)" },
  "อัตราค่าบริการ (บาท / ชั่วโมง):": { en: "Service Rate (THB / Hour):", zh: "机时收费标准 (泰铢 / 小时):" },
  "อัตราการใช้งานเฉลี่ย (Occupancy Rate):": { en: "Average Daily Occupancy Rate:", zh: "平均每日上座率 (Occupancy Rate):" },
  "30% (น้อย)": { en: "30% (Low)", zh: "30% (偏低)" },
  "60% (มาตรฐาน)": { en: "60% (Standard)", zh: "60% (标准)" },
  "85% (ทำเลทอง)": { en: "85% (Prime Location)", zh: "85% (黄金商圈)" },
  "รายรับต่อเดือน": { en: "Monthly Revenue", zh: "月总营业额" },
  "กำไรสุทธิต่อเดือน": { en: "Net Monthly Profit", zh: "每月净利润" },
  "ผลตอบแทนต่อปี (ROI)": { en: "Annual Return (ROI)", zh: "年投资回报率 (ROI)" },
  "คืนทุนใน": { en: "Payback in", zh: "预计回本期" },
  "รายได้ค่าชั่วโมงเล่นเกม": { en: "Gaming Hours Revenue", zh: "电竞上机机时费收入" },
  "รายได้จำหน่ายเครื่องดื่ม & อาหารว่าง:": { en: "F&B and Snack Bar Revenue:", zh: "水吧饮品及轻食零售收入:" },
  "รายรับรวมต่อเดือน (Gross Revenue):": { en: "Gross Monthly Revenue:", zh: "每月总营业收入 (Gross):" },
  "ค่าไฟ & แอร์ประมาณการ:": { en: "Estimated Electricity & AC:", zh: "预估电费与空调能耗支出:" },
  "เงินเดือนพนักงาน (2-3 กะ):": { en: "Staff Salaries (2-3 Shifts):", zh: "员工薪酬支出 (2-3班制):" },
  "ค่าอินเทอร์เน็ต & เบ็ดเตล็ด:": { en: "Fiber Internet & Misc:", zh: "专用光纤专线费及杂项开销:" },
  "กำไรสุทธิโดยประมาณ (Net Profit):": { en: "Estimated Monthly Net Profit:", zh: "预估月度净利润 (Net Profit):" },
  "คาดว่าจะคืนทุนใน:": { en: "Estimated Payback:", zh: "预计回本周期:" },
  "ระยะเวลาในการก่อสร้างและติดตั้ง (ประมาณ 6 สัปดาห์)": { en: "Construction & Installation Timeline (~6 Weeks)", zh: "施工与交付进度计划 (约6周)" },
  "ขั้นตอนการดำเนินงานแบบ Turnkey ตั้งแต่สำรวจพื้นที่จนถึงวัน Grand Opening พร้อมเปิดให้บริการ": { en: "Turnkey process from site survey through Grand Opening day ready to operate", zh: "全套交钥匙流程：从实地勘测、硬装装修直至盛大开业正式营业" },
  "แบบแปลนสถาปัตยกรรม & งานระบบ (PNG)": { en: "Architectural Blueprint & MEP Layout (PNG)", zh: "建筑结构与弱电施工蓝图 (PNG)" },
  "บันทึกไฟล์ (PNG)": { en: "Save File (PNG)", zh: "保存蓝图 (PNG)" },
  "ย่อมุมมอง": { en: "Fit View", zh: "缩放适应" },
  "ซูม 100%": { en: "100% Zoom", zh: "100% 原尺寸放大" },
  "เปิดแท็บใหม่": { en: "Open in New Tab", zh: "在新标签页打开" },
  "ยืนยันนำอุปกรณ์ออกจากผัง?": { en: "Confirm Remove Equipment?", zh: "确认从场地中移除此设备？" },
  "คุณต้องการนำอุปกรณ์ชิ้นนี้ออกจากแบบจำลองผังร้าน 3D ใช่หรือไม่?": { en: "Are you sure you want to remove this equipment from the 3D layout?", zh: "您确定要将该设备从 3D 场地布局模型中移除吗？" },
  "ท่านสามารถเลือกเพิ่มอุปกรณ์ชิ้นนี้กลับเข้ามาใหม่ได้ตลอดเวลาจากแท็บ": { en: "You can re-add this equipment at any time from the tab:", zh: "您可以随时在以下标签页重新添加该设备:" },
  "ยืนยันนำอุปกรณ์ออก": { en: "Confirm Removal", zh: "确认移除" },
  "ราคารวมเซ็ตพร้อมติดตั้ง:": { en: "Set Price (Installed):", zh: "整套总价 (含专业安装):" },
  "(รวมภาษีและค่าติดตั้ง)": { en: "(Incl. VAT and installation)", zh: "(已含税金及上门调试安装费)" },
  "โต๊ะสั่งผลิต:": { en: "Custom Desk:", zh: "定制电竞工作桌:" },
  "เก้าอี้เกมมิ่ง": { en: "Gaming Chairs", zh: "专业电竞椅" },
  "1. สเปกวัสดุและโครงสร้างทางวิศวกรรม (Material & Construction)": { en: "1. Engineering Materials & Construction", zh: "1. 结构与工程材料规格 (Material & Construction)" },
  "2. สเปกเก้าอี้เกมมิ่งและอุปกรณ์ที่มาในเซ็ต (Included Furniture)": { en: "2. Ergonomic Gaming Chairs & Furniture", zh: "2. 配套电竞座椅与家具规格 (Included Furniture)" },
  "3. ระบบท่อร้อยสายไฟและโครงข่ายเน็ตเวิร์ก (Electrical & LAN Raceway)": { en: "3. Electrical & 10G LAN Raceway Infrastructure", zh: "3. 强弱电双分离线槽与万兆网管系统" },
  "4. การรับประกันและระยะเวลาผลิต (Warranty & Delivery)": { en: "4. Warranty & Production Lead Time", zh: "4. 售后质保与生产交付周期" },
  "การรับประกัน:": { en: "Warranty:", zh: "售后质保:" },
  "ระยะเวลาสั่งผลิต:": { en: "Production Lead Time:", zh: "生产交期:" },
  "โมเดลนี้ประกอบด้วย:": { en: "This model includes:", zh: "该模型套组包含:" },
  "เพิ่มลงในผัง 3D (Add to Plan)": { en: "Add to 3D Plan", zh: "添加至 3D 布局 (Add to Plan)" },
  "ต้องการให้ทีมงาน G-Speed ติดต่อกลับพร้อมส่งแปลนร้านนี้": { en: "Request G-Speed Team Contact & Send Store Plan", zh: "提交开店意向，获取3D图纸及官方顾问致电" },
  "ชื่อ - นามสกุล": { en: "Full Name", zh: "您的姓名" },
  "เบอร์โทรศัพท์ (ติดต่อกลับ)": { en: "Phone Number", zh: "联系电话" },
  "อีเมล (รับใบเสนอราคา)": { en: "Email Address (Receive Quote)", zh: "电子邮箱 (接收正式报价单)" },
  "งบประมาณลงทุนที่เตรียมไว้": { en: "Planned Investment Budget", zh: "预期准备的投资预算" },
  "ทำเลหรือจังหวัดที่สนใจเปิดสาขา": { en: "Target Location / Province", zh: "计划开店的城市或意向地段" },
  "กำลังส่งข้อมูล...": { en: "Sending Request...", zh: "正在提交中..." },
  "ส่งแปลนขอคำปรึกษา": { en: "Submit Plan & Get Consultation", zh: "提交方案免费获取咨询" },
  "ดาวน์โหลดแปลน (PNG)": { en: "Download Blueprint (PNG)", zh: "下载施工蓝图 (PNG)" },
  "กรุณากรอกชื่อ-นามสกุล, เบอร์โทรศัพท์ และอีเมลติดต่อให้ครบถ้วน": { en: "Please fill in your full name, phone number, and email completely.", zh: "请完整填写您的姓名、联系电话与电子邮箱。" },
  // Common Venues
  'GLP : G Speed Living Plus รามคำแหง 53': {
    en: 'GLP : G Speed Living Plus Ramkhamhaeng 53',
    zh: 'GLP : G Speed Living Plus 曼谷兰甘亨53巷'
  },

  // Franchise 3D Studio & Workflow UI Terms
  'ย้อนกลับ': { en: 'Back', zh: '上一步' },
  'ถัดไป': { en: 'Next', zh: '下一步' },
  'ผังร้าน': { en: 'Store Layout', zh: '场地规划' },
  'ผังร้าน:': { en: 'Store Layout:', zh: '场地规划:' },
  'ขนาดห้อง': { en: 'Room Size', zh: '场地尺寸' },
  'ขนาดห้อง:': { en: 'Room Size:', zh: '场地尺寸:' },
  'ขนาดร้าน:': { en: 'Store Size:', zh: '场地尺寸:' },
  'แนะนำ': { en: 'Recommended', zh: '推荐' },
  'สเปก:': { en: 'Specs:', zh: '配置:' },
  'งบรวม:': { en: 'Total Investment:', zh: '总预算:' },
  'คืนทุน': { en: 'Payback', zh: '回本' },
  'คืนทุน:': { en: 'Payback:', zh: '回本:' },
  'ความจุ:': { en: 'Capacity:', zh: '容量:' },
  'งบลงทุน:': { en: 'Investment Budget:', zh: '投资预算:' },
  'พื้นที่:': { en: 'Area:', zh: '面积:' },
  'เครื่อง': { en: 'stations', zh: '台' },
  'ชิ้น': { en: 'items', zh: '件' },
  'ตร.ม.': { en: 'sqm', zh: '平方米' },
  'ที่นั่ง': { en: 'seats', zh: '座' },
  'ตัว': { en: 'units', zh: '把' },
  'ม.': { en: 'm.', zh: '米' },
  'เมตร': { en: 'meters', zh: '米' },
  'ด.': { en: 'mo.', zh: '个月' },
  'เดือน': { en: 'months', zh: '个月' },
  'ตั้งค่า': { en: 'Settings', zh: '设置' },
  'รายละเอียด': { en: 'Details', zh: '详情' },
  'ประตูร้าน': { en: 'Store Door', zh: '大门设置' },
  'ผนัง/พื้น': { en: 'Wall/Floor', zh: '墙面/地面' },
  '+ เพิ่มอุปกรณ์': { en: '+ Add Equipment', zh: '+ 添加设备' },
  'เพิ่มอุปกรณ์': { en: 'Add Equipment', zh: '添加设备' },
  'ประตู:': { en: 'Door:', zh: '大门:' },
  'โทนสี': { en: 'Theme', zh: '色彩风格' },
  'ประตูทางเข้าร้านหลัก': { en: 'Main Entrance Door', zh: '进店主大门' },
  'ผนังขวา': { en: 'Right Wall', zh: '右墙' },
  'ผนังซ้าย': { en: 'Left Wall', zh: '左墙' },
  'ด้านหน้า': { en: 'Front Wall', zh: '前墙' },
  'ผนังหลัง': { en: 'Back Wall', zh: '后墙' },
  'กระจก 2 บาน (ฟิล์มดำ)': { en: 'Double Glass (Tinted)', zh: '双开钢化玻璃 (黑膜)' },
  'กระจก 1 บาน (ฟิล์มดำ)': { en: 'Single Glass (Tinted)', zh: '单开钢化玻璃 (黑膜)' },
  'บานเลื่อนออโต้ (ฟิล์มดำ)': { en: 'Auto-Sliding Glass (Tinted)', zh: '自动感应移门 (黑膜)' },
  'งานบริการ/ระบบ': { en: 'Service & System', zh: '服务与系统' },
  'โซนเกมมิ่ง': { en: 'Gaming Zone', zh: '电竞对战区' },
  'โต๊ะ & คอมพิวเตอร์': { en: 'Stations & Desks', zh: '电竞对战桌' },
  'ห้อง VIP & สตรีมเมอร์': { en: 'VIP & Streamer Rooms', zh: 'VIP包厢与直播' },
  'เวที & การแข่งขัน': { en: 'Stage & Arena', zh: '赛事主舞台' },
  'เวทีแข่งขัน': { en: 'Tournament Stage', zh: '赛事主舞台' },
  'โครงสร้าง & ทางเข้า': { en: 'Architecture & Entry', zh: '建筑与门窗' },
  'โครงสร้างสถาปัตยกรรม': { en: 'Architectural Structure', zh: '建筑结构组件' },
  'โซนพักผ่อน & ตกแต่ง': { en: 'Lounge & Amenities', zh: '休闲与氛围' },
  'อุปกรณ์': { en: 'Equipment', zh: '配套设施' },
  'คลิกเพื่อดูขนาด ราคา & จัดการ': { en: 'Click to inspect size, price & controls', zh: '点击查看尺寸、价格及操作' },
  'คลิกเพื่อย่อรายละเอียด': { en: 'Click to collapse details', zh: '点击收起详情' },
  'ขนาดโมดูล': { en: 'Module Size', zh: '模块尺寸' },
  'ราคาประเมิน': { en: 'Est. Price', zh: '预估价格' },
  'ปรับใน 3D': { en: 'Focus in 3D', zh: '3D 聚焦' },
  'หมุน': { en: 'Rotate', zh: '旋转' },
  'นำออก': { en: 'Remove', zh: '移除' },
  'ลบออก': { en: 'Delete', zh: '删除' },
  'คัดลอก': { en: 'Duplicate', zh: '复制' },
  'หมุน 90°': { en: 'Rotate 90°', zh: '旋转 90°' },
  'คอมพิวเตอร์ที่วางแล้ว:': { en: 'PCs Placed:', zh: '已放置电脑:' },
  'ชิ้นส่วนในผัง:': { en: 'Placed Items:', zh: '布局件数:' },
  'สถานะระยะทางเดิน:': { en: 'Aisle Clearance:', zh: '过道安全距离:' },
  'ได้มาตรฐาน ปลอดภัย': { en: 'Standard & Safe', zh: '符合消防安全标准' },
  'หนาแน่นเกินไป': { en: 'Overcrowded', zh: '过道过于拥挤' },
  'แปลนช่าง (PNG)': { en: 'Blueprint (PNG)', zh: '施工蓝图 (PNG)' },
  'จัดผังอัตโนมัติ': { en: 'Auto Layout', zh: '自动排布' },
  'ขยายเต็มจอ': { en: 'Fullscreen', zh: '全屏' },
  'ออกจากเต็มจอ': { en: 'Exit Fullscreen', zh: '退出全屏' },
  'เดินชมร้าน': { en: 'Walk Mode', zh: '漫游' },
  'หน้าร้าน': { en: 'Storefront', zh: '门头' },
  'แปลน 2D': { en: '2D Plan', zh: '2D 平面' },
  'ทางเข้า': { en: 'Entrance', zh: '入口' },
  'เลือกสเปก': { en: 'Choose Specs', zh: '选择配置' },
  'เลือกสเปก ->': { en: 'Choose Specs →', zh: '选择配置 →' },
  'เลือกสเปก →': { en: 'Choose Specs →', zh: '选择配置 →' },
  'ถัดไป: เลือกสเปก': { en: 'Next: Hardware Specs', zh: '下一步: 选择配置' },
  'ถัดไป: เลือกสเปกคอม': { en: 'Next: Hardware Specs', zh: '下一步: 选择配置' },
  'ถัดไป: ดูงบ & ROI': { en: 'Next: Budget & ROI', zh: '下一步: 预算与回报' },
  'ถัดไป: จัดผังร้าน': { en: 'Next: 3D Layout', zh: '下一步: 场地布局' },
  'สรุปใบเสนอราคา': { en: 'Summary of Quotation', zh: '报价汇总' },
  'ขอใบเสนอราคา': { en: 'Request Official Quote', zh: '获取正式报价单' },
  'พิมพ์ใบเสนอราคา': { en: 'Print Quotation', zh: '打印报价单' },
  'ส่งออกแปลน (PNG)': { en: 'Export Blueprint (PNG)', zh: '导出施工蓝图 (PNG)' },

  // Catalog Item Names & Descs
  'โต๊ะคอมพิวเตอร์ 2 ที่นั่ง (Double Station)': { en: '2-Player Gaming Desk (Double Station)', zh: '双人对战电竞桌 (Double Station)' },
  'แถวคอมพิวเตอร์ 4 ที่นั่ง (Quad Station)': { en: '4-Player Station Row (Quad Station)', zh: '4人联排对战工作站 (Quad Station)' },
  'เกาะคอมพิวเตอร์ 6 ที่นั่ง (Island 6)': { en: '6-Station Gaming Island (Island 6)', zh: '6人中央对战岛 (Island 6)' },
  'ห้อง VIP Private Suite (5 ที่นั่ง)': { en: 'VIP Private Suite (5 Seats)', zh: 'VIP 私享隔音包厢 (5座)' },
  'เวทีแข่งขัน 5v5 Tournament Stage': { en: '5v5 Tournament Stage', zh: '5v5 职业电竞赛事主舞台' },
  'เคาน์เตอร์แคชเชียร์ & ต้อนรับ (Reception)': { en: 'Cashier & Reception Counter', zh: '收银服务台与前台接待处' },
  'ห้องเซิร์ฟเวอร์ & Rack (Diskless Master)': { en: 'Server Room & 42U Rack (Diskless Master)', zh: '机房服务器机柜 (无盘主控系统)' },
  'สแน็กบาร์ & จุดเครื่องดื่ม (Cafe Bar)': { en: 'Snack Bar & Beverage Station (Cafe Bar)', zh: '水吧饮品站与轻食吧台 (Cafe Bar)' },
  'โซฟาพักผ่อน & กองเชียร์ (Spectator Lounge)': { en: 'Spectator Lounge & Sofa', zh: '观赛休息区与多人沙发' },
  'ประตูทางเข้าหลัก (Main Glass/Wood Door)': { en: 'Main Glass/Wood Entrance Door', zh: '主入户钢化玻璃/木质大门' },
  'หน้าต่างกระจกบานใหญ่ (Panoramic Glass Window)': { en: 'Panoramic Glass Window', zh: '全景采光落地玻璃大窗' },
  'โซฟา VIP เลานจ์ & จอโค้ง 65 นิ้ว (VIP Console Lounge)': { en: 'VIP Console Lounge & 65" Curved Display', zh: 'VIP 沙发休闲区 (配备65寸超宽曲面屏)' },
  'ตู้คีออสก์บริการตนเองอัจฉริยะ (Smart Self-Order Kiosk)': { en: 'Smart Self-Order Kiosk (32" Touch)', zh: '智能自助服务终端机 (32寸触控点单)' },
  'ป้ายไฟนีออนโลโก้ GLP อะคริลิก 3D (3D Glowing Brand Sign)': { en: '3D Glowing GLP Brand Neon Sign', zh: 'GLP 品牌3D发光亚克力霓虹灯牌' },
  'G-Speed Esport Arena รามคำแหง 53 (Main Stage & Battleground Zone)': {
    en: 'G-Speed Esport Arena Ramkhamhaeng 53 (Main Stage & Battleground Zone)',
    zh: 'G-Speed 电竞馆 兰甘亨53巷 (主舞台与对战区)'
  },
  'G-Speed Esport Arena (Main Stage Zone)': {
    en: 'G-Speed Esport Arena (Main Stage Zone)',
    zh: 'G-Speed 电竞馆 (主舞台专区)'
  },

  // Registration & Hotlines
  'ช่องทางการรับสมัคร': {
    en: 'Registration Channel',
    zh: '赛事报名通道'
  },
  'ไม่ต้องลงทะเบียนผ่านหน้าเว็บให้ยุ่งยาก เพียงทักแชตเพื่อขอรับแบบฟอร์ม ส่งรายชื่อผู้เล่น และรับการยืนยันสิทธิ์จากทีมงาน G-Speed โดยตรง': {
    en: 'No complicated web registration needed! Simply chat with our staff to get the application form, submit your player roster, and receive direct confirmation.',
    zh: '无需繁琐的网页注册！只需在线联络客服索取报名表，提交战队选手名单，即可直接获得 G-Speed 官方席位确认。'
  },
  'ลงทะเบียน': {
    en: 'Register Now',
    zh: '立即报名'
  },
  'ทักแชท LINE เพื่อสมัครแข่งขัน': {
    en: 'Chat on LINE to Register',
    zh: '通过 LINE 联络报名'
  },

  // Section Headers & UI
  'เกี่ยวกับรายการแข่งขัน': {
    en: 'About the Tournament',
    zh: '关于赛事'
  },
  'โครงสร้างเงินรางวัล (Prize Pool Distribution)': {
    en: 'Prize Pool Distribution',
    zh: '赛事奖金分配体系 (Prize Pool)'
  },
  'มาตรฐานสนามแข่งขันระดับ World Class LAN Arena': {
    en: 'World-Class LAN Arena Hardware Standard',
    zh: '世界锦标赛级线下场馆硬件标准'
  },
  'กติกาและระเบียบการแข่งขัน (Rules & Regulations)': {
    en: 'Rules & Regulations',
    zh: '比赛规则与纪律条例 (Rules & Regulations)'
  },
  'แชร์ทัวร์นาเมนต์นี้': {
    en: 'Share this Tournament',
    zh: '分享此赛事'
  },
  'ร่วมส่งต่อความมันส์และไฮไลต์การแข่งขันให้เพื่อนและคอมมูนิตี้': {
    en: 'Share tournament excitement and highlights with friends and community',
    zh: '与好友及电竞社群分享精彩对决与赛事高光瞬间'
  },
  'กำหนดการและลำดับเวลาแข่งขัน (Tournament Timeline)': {
    en: 'Tournament Timeline & Schedule',
    zh: '赛事赛程与时间表 (Timeline)'
  },
  'สายการแข่งขัน & ผลคะแนน': {
    en: 'Tournament Bracket & Live Scores',
    zh: '对阵赛程表与实时比分'
  },
  'ผังสายแข่ง (Tree)': {
    en: 'Bracket Tree',
    zh: '树状图赛程'
  },
  'รายการแมตช์ (List)': {
    en: 'Matches List',
    zh: '对阵列表'
  },
  'รายชื่อผู้เล่นไลน์อัปหลัก:': {
    en: 'Main Roster Players:',
    zh: '首发主力队员名单:'
  },
  'แท็กหัวข้อที่เกี่ยวข้อง (Article Tags):': {
    en: 'Related Article Tags:',
    zh: '相关话题标签 (Article Tags):'
  },
  '(คลิกที่แท็กเพื่อดูบทความที่เกี่ยวข้อง)': {
    en: '(Click tag to explore related articles)',
    zh: '(点击标签探索相关文章)'
  },
  'แกลเลอรีภาพบรรยากาศความละเอียดสูง': {
    en: 'High-Resolution Photo Highlights Gallery',
    zh: '高清现场活动图集'
  },
  'คลิกที่รูปภาพเพื่อเปิดดูขนาดใหญ่แบบ Full-Screen HD': {
    en: 'Click any photo to view in Full-Screen HD',
    zh: '点击图片即可全屏查看高清大图'
  },
  'แชร์กิจกรรม & บทความนี้': {
    en: 'Share this Event & Article',
    zh: '分享此活动与资讯'
  },
  'ร่วมส่งต่อความมันส์และไฮไลต์กิจกรรมให้เพื่อนและคอมมูนิตี้': {
    en: 'Share the event fun and highlights with friends and community',
    zh: '与好友及电竞社群分享活动精彩瞬间'
  },
  'คัดลอกลิงก์': {
    en: 'Copy Link',
    zh: '复制链接'
  },
  'คัดลอกลิงก์แล้ว ✓': {
    en: 'Link Copied ✓',
    zh: '链接已复制 ✓'
  },
  'ข้อมูลสรุปกิจกรรม (Quick Facts)': {
    en: 'Event Quick Facts',
    zh: '活动核心速览 (Quick Facts)'
  },
  'ช่วงเวลาจัดกิจกรรม': {
    en: 'Event Schedule',
    zh: '活动时间'
  },
  'สนใจจัดงานหรือเช่าเวทีแข่ง?': {
    en: 'Interested in hosting an event or renting the arena stage?',
    zh: '有意举办赛事或包场租用舞台？'
  },
  'ติดต่อทีมงานอีเวนต์เพื่อขอใบเสนอราคาและจองสถานที่': {
    en: 'Contact our event team for quotations and venue reservation',
    zh: '联系赛事活动团队获取报价及预订场地'
  },
  'กิจกรรมและบทความอื่นๆ ที่น่าสนใจ': {
    en: 'More Featured Activities & Articles',
    zh: '更多精选活动与精彩文章'
  },
  'ย้อนชมความสนุกและข่าวสารความเคลื่อนไหวล่าสุดจาก G-Speed Esport Arena': {
    en: 'Catch up on highlights and the latest news from G-Speed Esport Arena',
    zh: '重温高能瞬间，掌握 G-Speed 电竞馆最新活动资讯'
  },
  'อ่านบทความเต็ม': {
    en: 'Read Full Article',
    zh: '阅读全文'
  },
  'รายการแข่งขันอื่นๆ ของทางร้าน (More Tournaments)': {
    en: 'More Tournaments from GLP',
    zh: 'GLP 更多精彩电竞赛事 (More Tournaments)'
  },
  'ติดตามงานแข่งและประลองฝีมือในสังเวียนอีสปอร์ตรายการอื่นๆ ชิงเงินรางวัลรวมกว่า ฿300,000': {
    en: 'Follow upcoming esports tournaments at GLP Arena and compete for over 300,000 THB in total prizes',
    zh: '关注更多热血电竞赛事，决战 GLP 竞技场，争夺逾 300,000 泰铢总奖金'
  },
  'ดูทั้งหมด': {
    en: 'View All',
    zh: '查看全部'
  },

  // Hardware Specs & Rules Descriptions
  'ทุกสเตชันขับเคลื่อนด้วยขุมพลัง Intel Core i9 + NVIDIA GeForce RTX 40 Series, จอเกมมิ่ง BenQ ZOWIE 360Hz Fast-IPS พร้อมระบบ Dedicated Multi-WAN 10Gbps ลื่นไหลไร้อาการหน่วง': {
    en: 'Every station is powered by Intel Core i9 + NVIDIA GeForce RTX 40 Series, BenQ ZOWIE 360Hz Fast-IPS monitors, and dedicated 10Gbps Multi-WAN networking for ultra-smooth, zero-lag gameplay.',
    zh: '全场对战机台均配备 Intel Core i9 + NVIDIA GeForce RTX 40 系列显卡、BenQ ZOWIE 360Hz Fast-IPS 电竞屏以及 10Gbps 专线网络，极致流畅零延迟。'
  },
  'ผู้เข้าแข่งขันทุกท่านต้องนำบัตรประชาชนหรือหลักฐานแสดงตนตัวจริงมาแสดง ณ จุดลงทะเบียนสนาม': {
    en: 'All competitors must present their physical National ID card or official government ID at the arena check-in desk.',
    zh: '所有参赛选手必须在现场登记处出示实体身份证或有效官方身份证明。'
  },
  'อนุญาตให้นำอุปกรณ์เกมมิ่งเกียร์ส่วนตัว (เมาส์, คีย์บอร์ด, หูฟัง) มาใช้ได้ โดยต้องผ่านการตรวจสอบจากกรรมการเทคนิค': {
    en: 'Personal gaming gear (mouse, keyboard, headset) is permitted subject to technical inspection by tournament referees.',
    zh: '允许使用自带电竞外设（鼠标、键盘、耳机），但须通过赛事技术裁判的安全检验。'
  },
  'ห้ามใช้โปรแกรมโกง สคริปต์ช่วยเล่น หรือ Macro ใดๆ ที่เข้าข่ายเอาเปรียบผู้เล่นอื่น หากตรวจพบปรับแพ้และตัดสิทธิ์ทันที': {
    en: 'Any use of cheats, assistance scripts, or unfair macros is strictly prohibited. Violators will be immediately disqualified and forfeited.',
    zh: '严禁使用任何外挂作弊软件、辅助脚本或违规宏指令，一经查实立即判负并取消参赛资格。'
  },
  'การตัดสินของคณะกรรมการและผู้ตัดสินกลางในสนามถือเป็นที่สิ้นสุดในทุกกรณี': {
    en: 'The tournament committee and head referee decisions are final and binding in all circumstances.',
    zh: '赛事组委会与现场主裁判的裁决为最终判决，不予申诉。'
  }
};

/**
 * Fetch online translation from Google GTX API (Free, high speed, reliable)
 * Falls back to MyMemory API if unreachable
 */
export async function fetchOnlineTranslation(text, targetLang) {
  if (!text || typeof text !== 'string' || !text.trim() || targetLang === 'th') {
    return text;
  }
  const cleanText = text.trim();

  // Cache key
  const cacheKey = cleanText;
  if (translationCache[cacheKey] && translationCache[cacheKey][targetLang]) {
    return translationCache[cacheKey][targetLang];
  }

  // Deduplicate inflight requests
  const requestKey = `${targetLang}:${cleanText}`;
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  const promise = (async () => {
    // 1. Google Translate GTX
    try {
      const gtxLang = targetLang === 'zh' ? 'zh-CN' : targetLang;
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=th&tl=${gtxLang}&dt=t&q=${encodeURIComponent(cleanText)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const translated = data[0].map(segment => segment[0]).join('');
          if (translated && translated.trim()) {
            saveToTranslationCache(cleanText, targetLang, translated.trim());
            return translated.trim();
          }
        }
      }
    } catch (err) {
      console.warn('GTX translation error, trying fallback:', err);
    }

    // 2. MyMemory Fallback
    try {
      const mmLang = targetLang === 'zh' ? 'zh-CN' : targetLang;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=th|${mmLang}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const translated = data?.responseData?.translatedText;
        if (translated && translated.trim() && !translated.includes('MYMEMORY WARNING')) {
          saveToTranslationCache(cleanText, targetLang, translated.trim());
          return translated.trim();
        }
      }
    } catch (err) {
      console.warn('MyMemory translation error:', err);
    }

    return cleanText;
  })().finally(() => {
    pendingRequests.delete(requestKey);
  });

  pendingRequests.set(requestKey, promise);
  return promise;
}

/**
 * Synchronous dynamic translation function for React components
 * Returns cached/pattern/dictionary translation instantly.
 * If unseen Thai text, kicks off background async translation and will re-render via cache update event.
 */
export function translateDynamic(text, targetLang = 'th', triggerAsync = true) {
  if (!text) return '';
  if (targetLang === 'th') return typeof text === 'string' ? text : (text.th || text.title || '');

  // If text is an object containing multilingual keys
  if (typeof text === 'object') {
    if (text[targetLang]) return text[targetLang];
    if (text[`title_${targetLang}`]) return text[`title_${targetLang}`];
    if (text[`desc_${targetLang}`]) return text[`desc_${targetLang}`];
    if (text.title) text = text.title;
    else return '';
  }

  if (typeof text !== 'string') return String(text);
  const cleanText = text.trim();
  if (!cleanText) return '';

  // 1. Built-in Dictionary (Highest priority for accuracy)
  if (BUILT_IN_DICTIONARY[cleanText] && BUILT_IN_DICTIONARY[cleanText][targetLang]) {
    return BUILT_IN_DICTIONARY[cleanText][targetLang];
  }

  // 2. Direct Cache lookup
  if (translationCache[cleanText] && translationCache[cleanText][targetLang]) {
    return translationCache[cleanText][targetLang];
  }

  // 3. Regex / Pattern Transformer (Dates, currencies, attendees, times)
  const patternMatch = matchPatternTranslation(cleanText, targetLang);
  if (patternMatch) {
    saveToTranslationCache(cleanText, targetLang, patternMatch);
    return patternMatch;
  }

  // 4. Background Auto-translate for new/unseen Thai text
  const hasThai = /[\u0E00-\u0E7F]/.test(cleanText);
  if (hasThai && triggerAsync && typeof window !== 'undefined') {
    fetchOnlineTranslation(cleanText, targetLang).catch(() => {});
  }

  // Fallback to original text until translated
  return text;
}

/**
 * Pre-translates a CMS entity (Tournament, Activity, Article)
 * Generates _en and _zh fields and populates the cache for 0ms load times
 */
/**
 * Pre-translates a CMS entity (Tournament, Activity, Article)
 * Generates _en and _zh fields and populates the cache for 0ms load times
 */
export async function autoTranslateEntity(entity) {
  if (!entity || typeof entity !== 'object') return entity;
  const cloned = { ...entity };

  const fieldsToTranslate = [
    'title', 'desc', 'venue', 'prizePool', 'quote', 'author', 
    'partner', 'location', 'excerpt', 'attendees', 'tag'
  ];

  for (const field of fieldsToTranslate) {
    if (cloned[field] && typeof cloned[field] === 'string' && /[\u0E00-\u0E7F]/.test(cloned[field])) {
      try {
        const [enText, zhText] = await Promise.all([
          fetchOnlineTranslation(cloned[field], 'en'),
          fetchOnlineTranslation(cloned[field], 'zh')
        ]);
        cloned[`${field}_en`] = enText;
        cloned[`${field}_zh`] = zhText;
        saveToTranslationCache(cloned[field], 'en', enText);
        saveToTranslationCache(cloned[field], 'zh', zhText);
      } catch (err) {
        console.warn(`Translation error for ${field}:`, err);
      }
    }
  }

  // Translate tags array if present
  if (Array.isArray(cloned.tags)) {
    for (const tag of cloned.tags) {
      const clean = tag.replace(/^#/, '');
      if (/[\u0E00-\u0E7F]/.test(clean)) {
        try {
          const [enTag, zhTag] = await Promise.all([
            fetchOnlineTranslation(clean, 'en'),
            fetchOnlineTranslation(clean, 'zh')
          ]);
          saveToTranslationCache(clean, 'en', enTag);
          saveToTranslationCache(clean, 'zh', zhTag);
        } catch (_) {}
      }
    }
  }

  // Translate rules array if present
  if (Array.isArray(cloned.rules)) {
    const enRules = [];
    const zhRules = [];
    for (const rule of cloned.rules) {
      if (typeof rule === 'string' && /[\u0E00-\u0E7F]/.test(rule)) {
        try {
          const [enR, zhR] = await Promise.all([
            fetchOnlineTranslation(rule, 'en'),
            fetchOnlineTranslation(rule, 'zh')
          ]);
          enRules.push(enR);
          zhRules.push(zhR);
          saveToTranslationCache(rule, 'en', enR);
          saveToTranslationCache(rule, 'zh', zhR);
        } catch (_) {
          enRules.push(rule);
          zhRules.push(rule);
        }
      } else {
        enRules.push(rule);
        zhRules.push(rule);
      }
    }
    cloned.rules_en = enRules;
    cloned.rules_zh = zhRules;
  }

  // Translate contentParagraphs array
  if (Array.isArray(cloned.contentParagraphs)) {
    for (const para of cloned.contentParagraphs) {
      if (typeof para === 'string' && /[\u0E00-\u0E7F]/.test(para)) {
        try {
          const [enP, zhP] = await Promise.all([
            fetchOnlineTranslation(para, 'en'),
            fetchOnlineTranslation(para, 'zh')
          ]);
          saveToTranslationCache(para, 'en', enP);
          saveToTranslationCache(para, 'zh', zhP);
        } catch (_) {}
      }
    }
  }

  // Translate contentBlocks
  if (Array.isArray(cloned.contentBlocks)) {
    for (const block of cloned.contentBlocks) {
      const blockTexts = [];
      if (block.text) blockTexts.push(block.text);
      if (block.title) blockTexts.push(block.title);
      if (block.caption) blockTexts.push(block.caption);
      if (block.leftTitle) blockTexts.push(block.leftTitle);
      if (block.leftText) blockTexts.push(block.leftText);
      if (block.rightTitle) blockTexts.push(block.rightTitle);
      if (block.rightText) blockTexts.push(block.rightText);
      if (Array.isArray(block.items)) {
        block.items.forEach(it => { if (it) blockTexts.push(it); });
      }

      for (const str of blockTexts) {
        if (typeof str === 'string' && /[\u0E00-\u0E7F]/.test(str)) {
          try {
            const [enB, zhB] = await Promise.all([
              fetchOnlineTranslation(str, 'en'),
              fetchOnlineTranslation(str, 'zh')
            ]);
            saveToTranslationCache(str, 'en', enB);
            saveToTranslationCache(str, 'zh', zhB);
          } catch (_) {}
        }
      }
    }
  }

  return cloned;
}
