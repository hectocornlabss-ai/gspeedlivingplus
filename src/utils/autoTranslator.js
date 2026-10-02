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

// Debounce state for localStorage persistence and event dispatching
let cacheSaveTimer = null;
let cacheDispatchTimer = null;
const changedKeysInBatch = new Set();

function scheduleCachePersistence() {
  if (typeof window === 'undefined') return;

  if (!cacheSaveTimer) {
    cacheSaveTimer = setTimeout(() => {
      cacheSaveTimer = null;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(translationCache));
      } catch (e) {
        console.warn('Failed to save to translations cache:', e);
      }
    }, 400);
  }

  if (!cacheDispatchTimer) {
    cacheDispatchTimer = setTimeout(() => {
      cacheDispatchTimer = null;
      window.dispatchEvent(new CustomEvent('glp_translation_cache_updated', {
        detail: { count: changedKeysInBatch.size }
      }));
      changedKeysInBatch.clear();
    }, 150);
  }
}

/**
 * Save translation entry to persistent cache and notify listeners (debounced and batched)
 */
export function saveToTranslationCache(text, lang, translatedText) {
  if (!text || !lang || !translatedText || text === translatedText) return;
  const key = text.trim();
  if (translationCache[key] && translationCache[key][lang] === translatedText) {
    return; // Already in cache, avoid redundant writes and events
  }

  if (!translationCache[key]) {
    translationCache[key] = {};
  }
  translationCache[key][lang] = translatedText;
  changedKeysInBatch.add(key);

  scheduleCachePersistence();
}

/**
 * Instant Pattern Matcher for Thai Dates, Currencies, Times, and Badges
 */
export function matchPatternTranslation(rawText, lang) {
  if (!rawText || typeof rawText !== 'string' || lang === 'th') return null;
  const str = rawText.trim();

  // 1. Currency & Prize formatting: e.g. "100,000 บาท" or "เงินรางวัลรวม 100,000 บาท"
    // 1d. Currency with trophy: e.g. "50,000 บาท + ถ้วยรางวัลเกียรติยศ"
  const prizePlusTrophyRegex = /^([\d,]+)\s*บาท\s*\+\s*(.+)$/i;
  const prizePlusTrophyMatch = str.match(prizePlusTrophyRegex);
  if (prizePlusTrophyMatch) {
    const trophy = prizePlusTrophyMatch[2].trim();
    const trophyZh = (trophy === 'ถ้วยรางวัลเกียรติยศ' || trophy.includes('ถ้วยรางวัล')) ? '荣誉奖杯' : (translateDynamic(trophy, 'zh', false) || trophy);
    const trophyEn = (trophy === 'ถ้วยรางวัลเกียรติยศ' || trophy.includes('ถ้วยรางวัล')) ? 'Trophy of Honor' : (translateDynamic(trophy, 'en', false) || trophy);
    return lang === 'zh'
      ? `${prizePlusTrophyMatch[1]} 泰铢 + ${trophyZh}`
      : `${prizePlusTrophyMatch[1]} THB + ${trophyEn}`;
  }

  // 4b. Slot with full status: e.g. "64 ทีม (เต็มแล้ว)"
  const slotFullRegex = /^(\d+)\s*ทีม\s*\((?:เต็มแล้ว|เต็ม)\)$/i;
  const slotFullMatch = str.match(slotFullRegex);
  if (slotFullMatch) {
    return lang === 'zh'
      ? `${slotFullMatch[1]} 支战队 (名额已满)`
      : `${slotFullMatch[1]} Teams (Full)`;
  }

  const prizeTotalRegex = /^(?:เงินรางวัลรวม\s*)?([\d,]+)\s*บาท$/i;
  const prizeTotalMatch = str.match(prizeTotalRegex);
  if (prizeTotalMatch) {
    const hasLabel = str.includes('เงินรางวัลรวม');
    if (hasLabel) {
      return lang === 'zh' ? `总奖金 ${prizeTotalMatch[1]} 泰铢` : `Total Prize Pool ${prizeTotalMatch[1]} THB`;
    }
    return lang === 'zh' ? `${prizeTotalMatch[1]} 泰铢` : `${prizeTotalMatch[1]} THB`;
  }

  // 1b. Currency Range: e.g. "1,500,000 - 3,000,000 บาท" or "1,000,000 - 2,000,000 บาท"
  const prizeRangeRegex = /^([\d,]+)\s*-\s*([\d,]+)\s*บาท$/i;
  const prizeRangeMatch = str.match(prizeRangeRegex);
  if (prizeRangeMatch) {
    return lang === 'zh' ? `${prizeRangeMatch[1]} - ${prizeRangeMatch[2]} 泰铢` : `${prizeRangeMatch[1]} - ${prizeRangeMatch[2]} THB`;
  }

  // 1c. Currency with plus/min: e.g. "5,000,000 บาทขึ้นไป"
  const prizePlusRegex = /^([\d,]+)\s*บาท(?:ขึ้นไป)?(?:\s*\((.+)\))?$/i;
  const prizePlusMatch = str.match(prizePlusRegex);
  if (prizePlusMatch) {
    const note = prizePlusMatch[2] ? ` (${translateDynamic(prizePlusMatch[2], lang, false)})` : '';
    return lang === 'zh' ? `${prizePlusMatch[1]} 泰铢以上${note}` : `${prizePlusMatch[1]}+ THB${note}`;
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

  // 4. Slots, Teams, and Registered count formatting
  // e.g. "32 ทีม", "32 ทีม (เหลือ 6 ทีมสุดท้าย)", "16 ทีมระดับ Pro Circuit", "(1 ทีมร่วมแข่ง)", "1 ทีมร่วมแข่ง"
  const slotRemainingRegex = /^(\d+)\s*ทีม\s*\((?:เหลือ\s*)?(\d+)\s*ทีมสุดท้าย\)$/;
  const slotRemMatch = str.match(slotRemainingRegex);
  if (slotRemMatch) {
    return lang === 'zh' 
      ? `${slotRemMatch[1]} 支战队 (剩余最后${slotRemMatch[2]}支)`
      : `${slotRemMatch[1]} Teams (Final ${slotRemMatch[2]} remaining)`;
  }

  const slotTierRegex = /^(\d+)\s*ทีมระดับ\s*(.+)$/;
  const slotTierMatch = str.match(slotTierRegex);
  if (slotTierMatch) {
    return lang === 'zh'
      ? `${slotTierMatch[1]} 支${slotTierMatch[2]}级战队`
      : `${slotTierMatch[1]} ${slotTierMatch[2]} Teams`;
  }

  const slotSimpleRegex = /^(\d+)\s*ทีม$/;
  const slotSimpleMatch = str.match(slotSimpleRegex);
  if (slotSimpleMatch) {
    return lang === 'zh' ? `${slotSimpleMatch[1]} 支战队` : `${slotSimpleMatch[1]} Teams`;
  }

  const teamRegisteredRegex = /^\(?(\d+)\s*ทีมร่วมแข่ง\)?$/;
  const teamRegMatch = str.match(teamRegisteredRegex);
  if (teamRegMatch) {
    const isParens = str.startsWith('(') && str.endsWith(')');
    const count = teamRegMatch[1];
    const zh = `${count} 支战队已报名`;
    const en = `${count} teams registered`;
    return isParens ? `(${lang === 'zh' ? zh : en})` : (lang === 'zh' ? zh : en);
  }

  // 5. Attendees formatting: e.g. "350+ คน (32 ทีม)"
  const attendeesRegex = /^(\d+\+?)\s*คน\s*\(([^\)]+)\)$/;
  const attMatch = str.match(attendeesRegex);
  if (attMatch) {
    if (lang === 'zh') return `${attMatch[1]} 人 (${attMatch[2].replace('ทีม', '支战队')})`;
    return `${attMatch[1]} attendees (${attMatch[2].replace('ทีม', 'teams')})`;
  }

  // 6. Bullet-separated strings e.g. "12 กันยายน 2026 • 3 min read"
  if (str.includes(' • ')) {
    const parts = str.split(' • ');
    const translatedParts = parts.map(p => translateDynamic(p.trim(), lang, false));
    return translatedParts.join(' • ');
  }

  // 7. Thai Dates formatting
  // Examples: "28-30 กันยายน 2026", "28 กันยายน 2026", "ตุลาคม 2026", "15 ก.ย. 2569"
  // Also supports time in parens: "28-30 กันยายน 2026 (11:00 - 20:00 น.)"
  for (const m of THAI_MONTHS) {
    // Check range with optional time: "28-30 กันยายน 2026 (11:00 - 20:00 น.)"
    const rangeWithTimeRegex = new RegExp(`^(\\d{1,2})\\s*-\\s*(\\d{1,2})\\s*(${m.full}|${m.short})\\s*(\\d{4})\\s*\\(([^\\)]+)\\)$`, 'i');
    const rangeTimeMatch = str.match(rangeWithTimeRegex);
    if (rangeTimeMatch) {
      let year = parseInt(rangeTimeMatch[4], 10);
      if (year > 2500) year -= 543;
      const dayRange = `${rangeTimeMatch[1]}-${rangeTimeMatch[2]}`;
      const timePart = matchPatternTranslation(rangeTimeMatch[5], lang) || rangeTimeMatch[5];
      if (lang === 'zh') {
        return `${year}年${m.monthNum}月${dayRange}日 (${timePart})`;
      }
      return `${dayRange} ${m.en} ${year} (${timePart})`;
    }

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

    // Check single day with optional time: "28 กันยายน 2026 (14:00 น.)"
    const singleWithTimeRegex = new RegExp(`^(\\d{1,2})\\s*(${m.full}|${m.short})\\s*(\\d{4})\\s*\\(([^\\)]+)\\)$`, 'i');
    const singleTimeMatch = str.match(singleWithTimeRegex);
    if (singleTimeMatch) {
      let year = parseInt(singleTimeMatch[3], 10);
      if (year > 2500) year -= 543;
      const day = singleTimeMatch[1];
      const timePart = matchPatternTranslation(singleTimeMatch[4], lang) || singleTimeMatch[4];
      if (lang === 'zh') {
        return `${year}年${m.monthNum}月${day}日 (${timePart})`;
      }
      return `${day} ${m.en} ${year} (${timePart})`;
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

  // 8. Common Rank & Prize Badges
  if (str === 'แชมป์อันดับ 1' || str === 'อันดับที่ 1 (CHAMPION)' || str === '🥇 อันดับที่ 1 (Champion)') {
    return lang === 'zh' ? '🥇 冠军 (CHAMPION)' : '🥇 1st Place (Champion)';
  }
  if (str === 'รองชนะเลิศอันดับ 1' || str === 'อันดับที่ 2 (RUNNER-UP)' || str === '🥈 อันดับที่ 2 (Runner-Up)') {
    return lang === 'zh' ? '🥈 亚军 (Runner-Up)' : '🥈 2nd Place (Runner-Up)';
  }
  if (str.includes('รองชนะเลิศอันดับ 2')) {
    return lang === 'zh' ? '🥉 季军 (3rd Place)' : '🥉 3rd Place';
  }

  // 9. Timeline year ranges: e.g. "2024-ปัจจุบัน"
  const timelineYearRegex = /^(\d{4})\s*-\s*ปัจจุบัน$/;
  const timelineYearMatch = str.match(timelineYearRegex);
  if (timelineYearMatch) {
    return lang === 'zh' ? `${timelineYearMatch[1]}-至今` : `${timelineYearMatch[1]}-Present`;
  }
  if (str === 'ปัจจุบัน') {
    return lang === 'zh' ? '至今' : 'Present';
  }

  // 10. Quantities with units: e.g. "8 สาขา", "750+ เครื่อง", "52,000+ คน", "180+ รายการ"
  const branchesRegex = /^(\d+[\d,]*\+?)\s*สาขา$/;
  const brMatch = str.match(branchesRegex);
  if (brMatch) {
    return lang === 'zh' ? `${brMatch[1]} 家分店` : `${brMatch[1]} Branches`;
  }

  const pcsRegex = /^(\d+[\d,]*\+?)\s*เครื่อง$/;
  const pcsMatch = str.match(pcsRegex);
  if (pcsMatch) {
    return lang === 'zh' ? `${pcsMatch[1]} 台` : `${pcsMatch[1]} PCs`;
  }

  const membersRegex = /^(\d+[\d,]*\+?)\s*คน$/;
  const memMatch = str.match(membersRegex);
  if (memMatch) {
    return lang === 'zh' ? `${memMatch[1]} 位` : `${memMatch[1]} Members`;
  }

  const tourneysRegex = /^(\d+[\d,]*\+?)\s*รายการ$/;
  const tourMatch = str.match(tourneysRegex);
  if (tourMatch) {
    return lang === 'zh' ? `${tourMatch[1]} 场` : `${tourMatch[1]} Tournaments`;
  }

  return null;
}

/**
 * Comprehensive Built-in Esports & Activities Translations
 */
export const BUILT_IN_DICTIONARY = {
  "กัปตันทีม": {
    en: "Team Captain",
    zh: "战队队长"
  },
  "(กัปตันทีม)": {
    en: "(Captain)",
    zh: "(队长)"
  },
  "SScary (กัปตันทีม)": {
    en: "SScary (Captain)",
    zh: "SScary (战队队长)"
  },
  "JohnOlsen (กัปตันทีม)": {
    en: "JohnOlsen (Captain)",
    zh: "JohnOlsen (战队队长)"
  },
  "Surf (กัปตันทีม)": {
    en: "Surf (Captain)",
    zh: "Surf (战队队长)"
  },
  "Kadoom (กัปตันทีม)": {
    en: "Kadoom (Captain)",
    zh: "Kadoom (战队队长)"
  },
  "SpeedyKnight (กัปตันทีม)": {
    en: "SpeedyKnight (Captain)",
    zh: "SpeedyKnight (战队队长)"
  },
  "ผู้เข้าแข่งขันทุกท่านต้องนำบัตรประชาชนหรือบัตรนักเรียน/นักศึกษามาแสดงตน ณ จุดลงทะเบียน": {
    en: "All competitors must present their National ID or Student ID card at the registration desk.",
    zh: "所有参赛选手必须在现场报到处出示身份证或学生证。"
  },
  "อนุญาตให้นำเมาส์ คีย์บอร์ด และหูฟังส่วนตัวมาใช้ได้ โดยต้องผ่านการตรวจจากเจ้าหน้าที่เทคนิคก่อนเริ่มแข่ง": {
    en: "Personal gaming gear (mouse, keyboard, headset) is permitted after inspection by technical staff.",
    zh: "允许使用个人电竞外设（鼠标、键盘、耳机），但须在赛前通过技术人员检验。"
  },
  "เครื่องคอมพิวเตอร์ที่ใช้แข่งขับเคลื่อนด้วย Intel Core i9 + NVIDIA GeForce RTX 4080 และจอ BenQ ZOWIE 360Hz": {
    en: "Tournament PCs powered by Intel Core i9 + NVIDIA GeForce RTX 4080 and BenQ ZOWIE 360Hz displays.",
    zh: "比赛用机配备 Intel Core i9 + NVIDIA GeForce RTX 4080 显卡与 BenQ ZOWIE 360Hz 电竞屏。"
  },
  "ห้ามใช้โปรแกรมโกง สคริปต์ช่วยเล่น หรือฉวยโอกาสจากข้อผิดพลาดของเกม (Bug Exploitation) หากตรวจพบปรับแพ้ทันที": {
    en: "Cheats, assistance scripts, or bug exploitation are strictly forbidden. Violators forfeit immediately.",
    zh: "严禁使用外挂、辅助脚本或利用游戏BUG，违者立即判负并取消资格。"
  },
  "คำตัดสินของหัวหน้าผู้ตัดสิน (Head Referee) ถือเป็นที่สิ้นสุดในทุกกรณี": {
    en: "The Head Referee decision is final and binding in all cases.",
    zh: "赛事主裁判的裁决为最终裁定，不接受申诉。"
  },
  "ลงทะเบียนหน้างาน & ตรวจสอบอุปกรณ์นักกีฬา (Player Check-in & Gear Check)": {
    en: "On-site Check-in & Player Gear Inspection",
    zh: "现场签到与选手外设检查 (Check-in & Gear Check)"
  },
  "รอบคัดเลือกแบ่งกลุ่ม Group Stage (Best of 1 - LAN Setup)": {
    en: "Group Stage Qualifiers (Best of 1 - LAN Setup)",
    zh: "小组循环资格赛 (BO1 局域网线下对战)"
  },
  "รอบ 8 ทีม และ 4 ทีมสุดท้าย (Quarter & Semi-Finals - Best of 3)": {
    en: "Quarter-Finals & Semi-Finals (Best of 3)",
    zh: "八强赛与半决赛 (BO3 三局两胜)"
  },
  "รอบชิงชนะเลิศ Grand Final บนเวที Main Stage (Best of 5 ถ่ายทอดสด)": {
    en: "Grand Final on Main Stage (Best of 5 Live Broadcast)",
    zh: "主舞台巅峰总决赛 (BO5 五局三胜高清直播)"
  },
  "32 ทีม (เหลือ 6 ทีมสุดท้าย)": {
    en: "32 Teams (Final 6 Slots Remaining)",
    zh: "32 支战队 (仅剩最后6个席位)"
  },
  "16:00 - 20:00 น.": {
    en: "16:00 - 20:00",
    zh: "16:00 - 20:00"
  },
  "11:00 - 20:00 น.": {
    en: "11:00 - 20:00",
    zh: "11:00 - 20:00"
  },
  "10:00 - 11:00 น.": {
    en: "10:00 - 11:00",
    zh: "10:00 - 11:00"
  },
  "11:15 - 14:00 น.": {
    en: "11:15 - 14:00",
    zh: "11:15 - 14:00"
  },
  "14:30 - 17:30 น.": {
    en: "14:30 - 17:30",
    zh: "14:30 - 17:30"
  },
  "18:00 - 20:30 น.": {
    en: "18:00 - 20:30",
    zh: "18:00 - 20:30"
  },
  "ดูตารางแข่ง": {
    en: "Match Schedule",
    zh: "查看赛程表"
  },
  "รายละเอียดงานแข่ง": {
    en: "Tournament Details",
    zh: "赛事详情"
  },
  "ฟีเจอร์ใหม่ 3D": {
    en: "New 3D Feature",
    zh: "全新3D功能"
  },
  "เปิดรับสมัคร GLP VALORANT CHAMPIONSHIP 2026 ชิง 100,000 บาท | ระบบจำลองผังร้าน 3D เปิดให้ทดลองใช้งานแล้ววันนี้!": {
    en: "Open Registration for GLP VALORANT CHAMPIONSHIP 2026 (100,000 THB Prize) | 3D Store Planner is now live!",
    zh: "GLP 无畏契约全国锦标赛 2026 火热报名中 (总奖金10万泰铢) | 3D门店布局系统现已正式上线！"
  },
  "ICAFE ATTACK LAN TOURNAMENT 2026 ระเบิดความมันส์ เสาร์-อาทิตย์นี้ ณ GLP Main Stage ลุ้นรับแรร์ไอเทมและเงินรางวัลสด": {
    en: "ICAFE ATTACK LAN TOURNAMENT 2026 this weekend at GLP Main Stage! Win rare items and cash prizes.",
    zh: "ICAFE ATTACK 线下电竞锦标赛 2026 本周末狂欢引爆！GLP 主舞台震撼开战，现场赢取稀有道具与现金大奖。"
  },
  "เปิดตัวแพ็กเกจแฟรนไชส์ GLP Living Plus 2026 พร้อมระบบจำลองผัง 3D คำนวณงบประมาณและผลตอบแทน ROI แบบเรียลไทม์": {
    en: "Launching GLP Living Plus 2026 Franchise Package with real-time 3D store simulator and ROI payback calculator.",
    zh: "GLP Living Plus 2026 电竞网咖加盟新模式重磅发布，搭载实时3D门店空间设计与投资回报率(ROI)预算系统。"
  },
  "เวทีแข่งขันหลัก 5v5 Soundproof Glass Booths": {
    en: "Main Tournament 5v5 Soundproof Glass Booths",
    zh: "主赛事 5v5 隔音玻璃对战舱"
  },
  "ห้องกระจกส่วนตัว 4K Broadcast Streamer Room": {
    en: "Private 4K Broadcast Streamer Room",
    zh: "独立隔音 4K 直播推流主播房"
  },
  "โซนหลักความจุกว่า 80 ที่นั่ง สเปกแข่ง 240Hz Fast-IPS": {
    en: "Main Arena 80+ Seats with 240Hz Fast-IPS Displays",
    zh: "主对战区 80+ 机位 240Hz Fast-IPS 竞技屏"
  },
  "โซน PS5 Pro จอยักษ์ 4K และซิมมูเลเตอร์พวงมาลัยแข่งรถ F1": {
    en: "PS5 Pro Zone with Giant 4K Display & F1 Racing Simulators",
    zh: "PS5 Pro 巨幕4K区与 F1 专业赛车力反馈模拟舱"
  },
  "โซนเครื่องเล่นเกมหลัก (Main Esports Arena)": {
    en: "Main Esports Arena Zone",
    zh: "核心电竞对战主区 (Main Esports Arena)"
  },
  "ห้องซ้อม VIP / Bootcamp Suite (กระจกเก็บเสียง)": {
    en: "VIP Bootcamp Suite (Soundproof Glass)",
    zh: "VIP 职业集训房 / Bootcamp (隔音玻璃)"
  },
  "เคาน์เตอร์แคชเชียร์ & จุดต้อนรับ (Reception)": {
    en: "Cashier & Reception Counter",
    zh: "收银服务台与迎宾接待处 (Reception)"
  },
  "ห้องควบคุมระบบ MDB & Diskless Server": {
    en: "MDB Electrical & Diskless Server Control Room",
    zh: "强电控制机房与无盘服务器中心 (MDB & Server)"
  },
  "Cafe Prep, Food & Dining Lounge": {
    en: "Cafe Prep, Food & Dining Lounge",
    zh: "水吧饮品餐饮休息区 (Cafe Prep & Lounge)"
  },
  "ทางสัญจร & ช่องทางหนีไฟ (Circulation & Safety)": {
    en: "Circulation & Safety Aisles",
    zh: "消防通道与公共动线 (Circulation & Safety)"
  },
  "โซนเครื่องเล่นเกมหลัก": {
    en: "Main Gaming Arena",
    zh: "电竞主对战区"
  },
  "ห้องซ้อม VIP / Bootcamp Suite": {
    en: "VIP Bootcamp Suite",
    zh: "VIP 职业训练室"
  },
  "เคาน์เตอร์แคชเชียร์ & จุดต้อนรับ": {
    en: "Cashier & Reception Counter",
    zh: "收银与接待柜台"
  },
  "ห้องควบคุมระบบ MDB & Diskless": {
    en: "MDB & Diskless Server Room",
    zh: "无盘服务器控制机房"
  },
  "ทางสัญจร & ช่องทางหนีไฟ": {
    en: "Circulation & Fire Exit Corridor",
    zh: "消防疏散安全通道"
  },
  "อุปกรณ์เกมมิ่งเกียร์และบรรยากาศการแข่งขัน": {
    en: "Gaming Gear & Tournament Highlights",
    zh: "电竞外设装备与激战实况"
  },
  "พิธีมอบรางวัลและเงินรางวัลชนะเลิศ": {
    en: "Award Ceremony & Championship Trophy Presentation",
    zh: "颁奖盛典与冠军奖金授予"
  },
  "แฟนคลับและผู้เข้าชมร่วมสนุกในกิจกรรม": {
    en: "Fans & Attendees Community Highlights",
    zh: "广大玩家与到场观众狂欢互动"
  },
  "ผู้ดูแลระบบสูงสุด (Master Owner)": {
    en: "Master Owner",
    zh: "主所有者"
  },
  "กิตติศักดิ์ (Head of Esports)": {
    en: "Kittisak (Head of Esports)",
    zh: "Kittisak （电子竞技主管）"
  },
  "ผู้จัดการงานแข่ง & สายการแข่งขัน": {
    en: "Tournament & Bracket Manager",
    zh: "锦标赛和组别经理"
  },
  "GLP : G Speed Living Plus เป็นศูนย์กีฬาอีสปอร์ตระดับ World Class และคอมมูนิตี้ครบวงจร 24 ชั่วโมง ตั้งอยู่ ณ ซอยรามคำแหง 53 กรุงเทพมหานคร\\n\\nจุดเด่นและสิ่งอำนวยความสะดวก:\\n- เครื่องคอมพิวเตอร์สเปกทัวร์นาเมนต์ Intel Core i9 + NVIDIA GeForce RTX 40/50 Series\\n- จอ BenQ ZOWIE Fast-IPS 360Hz และ 280Hz คุณภาพสูงสำหรับนักกีฬาโปรลีก\\n- เวทีแข่งขัน 5v5 Soundproof Glass Arena พร้อมระบบโปรดักชันถ่ายทอดสด 4K\\n- อินเทอร์เน็ต Dedicated Multi-WAN 10Gbps แบนด์วิดท์เสถียร Ping ต่ำกว่า 3ms\\n- บริการให้คำปรึกษาและวางระบบแฟรนไชส์ร้านเกม 3D แบบครบวงจร คืนทุนไวใน 12-18 เดือน\\n\\nติดต่อสอบถาม:\\n- สายด่วน: 063-793-7704\\n- LINE Official: @gspeed\\n- ที่อยู่: 23/1 ซอยรามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพฯ 10310": {
    en: "GLP: G Speed Living Plus is a world class esports centre and 24 hour comprehensive community located in Soi Ramkhamhaeng 53, Bangkok.\\n\\nHighlights & Amenities:\\n- Intel Core i9 + NVIDIA GeForce RTX 40/50 Series tournament specs PC\\n- High quality BenQ ZOWIE Fast-IPS 360Hz and 280Hz screen for Pro League athletes\\n- 5v5 Soundproof Glass Arena with 4K live production system\\n- Dedicated Multi-WAN Internet 10Gbps Stable Ping Bandwidth under 3ms\\n- Fully integrated 3D game store franchise consulting and implementation service, payback in 12-18 months.\\n\\nInquiries:\\n- Hotline: 063-793-7704\\n- line Official: @ gspeed\\n- Address: 23/1 Soi Ramkhamhaeng 53, Plubpla Sub-district, Wangthonglang District, Bangkok 10310",
    zh: "GLP ： G Speed Living Plus是世界一流的电子竞技中心和24小时综合社区，位于曼谷Soi Ramkhamhaeng 53。\\n\\n亮点和便利设施：\\n-英特尔酷睿i9 +英伟达GeForce RTX 40/50系列锦标赛规格PC\\n-适用于职业联赛运动员的高品质明基ZOWIE Fast-IPS 360Hz和280Hz屏幕\\n-配备4K现场制作系统的5v5隔音玻璃竞技场\\n-专用多WAN互联网10Gbps稳定Ping带宽低于3毫秒\\n-完全集成的3D游戏商店特许经营咨询和实施服务，在12-18个月内回报。\\n\\n咨询：\\n-热线： 063-793-7704\\n- LINE官方账号： @ gspeed\\n-地址： 23/1 Soi Ramkhamhaeng 53, Plubpla Sub-district, Wangthonglang District, Bangkok 10310"
  },
  "ชลธิชา (Franchise Sales Manager)": {
    en: "Chonthicha (Franchise Sales Manager)",
    zh: "Chonthicha （特许经营销售经理）"
  },
  "ช่างเทคนิค & จัดการสเปกคอม 3D": {
    en: "Technician & 3D Spectroscope Manager",
    zh: "技术员和3D光谱仪经理"
  },
  "ผู้ดูแลยอดขาย & แฟรนไชส์ Leads": {
    en: "Sales Administrator & Franchise Leads",
    zh: "销售管理员和特许经营负责人"
  },
  "วิศรุต (Lead Hardware Specialist)": {
    en: "Visarut (Lead Hardware Specialist)",
    zh: "Visarut （首席硬件专家）"
  },
  "ธนาภา (Digital Marketing & SEO)": {
    en: "Thanapa (Digital Marketing & SEO)",
    zh: "Thanapa （数字营销和SEO ）"
  },
  "การตลาด, SEO & คอนเทนต์": {
    en: "Marketing, SEO & Content",
    zh: "营销、搜索引擎优化和内容"
  },
  "คุณอาร์ม (Arm Gamer)": {
    en: "Mr. Arm Gamer",
    zh: "Mr. Arm Gamer"
  },
  "ขอกล้อง 4K สำหรับสตรีมแข่ง Valorant": {
    en: "Request 4K Camera for Valorant Racing Stream",
    zh: "为Valorant Racing Stream申请4K摄像头"
  },
  "18:00 - 22:00 น.": {
    en: "6:00 PM - 10:00 PM",
    zh: "下午6:00 -晚上10:00"
  },
  "คุณกิตติศักดิ์ (Talon Fan)": {
    en: "Khun Kittisak (Talon Fan)",
    zh: "Khun Kittisak （ Talon Fan ）"
  },
  "14:00 - 18:00 น.": {
    en: "2:00 PM - 6:00 PM",
    zh: "下午2:00 -下午6:00"
  },
  "ซ้อมคู่ Duo ก่อนเริ่มแมตช์ทัวร์นาเมนต์": {
    en: "Practice duo before the start of the tournament",
    zh: "比赛开始前练习二人组"
  },
  "23:00 - 08:00 น. (Night Owl เหมาค่ำ)": {
    en: "23:00 - 08:00 (Night Owl)",
    zh: "23:00 - 08:00 （夜猫子）"
  },
  "Gamer Feast Combo (ชานมพ่นไฟ + กะเพราหมูกรอบ)": {
    en: "Gamer Feast Combo (Flaming Milk Tea + Crispy Pork Basil)",
    zh: "玩家盛宴组合（火焰奶茶+酥脆猪肉罗勒）"
  },
  "ทีม 5 คน ซ้อมข้ามคืน": {
    en: "A team of five drills overnight.",
    zh: "一支由五人组成的团队在一夜之间进行了演习。"
  },
  "คุณภานุวัฒน์": {
    en: "Mr. Panuwat",
    zh: "Panuwat先生"
  },
  "ประกาศสำคัญ": {
    en: "Important Notice",
    zh: "重要提示"
  },
  "ระบบ 3D Interior Planner ใหม่! ออกแบบผังร้านเกม คำนวณขนาดโต๊ะเก้าอี้และงบลงทุนแฟรนไชส์ได้เรียลไทม์ 24 ชม.": {
    en: "New 3D Interior Planner System! Design game store layout, calculate table size, chairs and franchise investment budget in 24 hours.",
    zh: "全新3D室内规划器系统！设计游戏商店布局，在24小时内计算桌面尺寸、椅子和特许经营投资预算。"
  },
  "จัดแข่ง Esport": {
    en: "Host an Esport Match",
    zh: "举办电子竞技比赛"
  },
  "เปิดรับสมัคร GLP VALORANT CHAMPIONSHIP 2026 ชิง 100,000 บาท | ระบบจำลองผังร้าน 3D Interior Planner พร้อมใช้งานแล้ว": {
    en: "Application for GLP valorant Championship 2026 for 100,000 THB | 3D Interior Planner is now available",
    zh: "10万泰铢的2026年GLP Valorant锦标赛申请| 3D室内规划师现已推出"
  },
  "เปิดระบบจัดผัง 3D": {
    en: "Turn on 3D mapping",
    zh: "开启3D映射"
  },
  "เปิดรับจองพื้นที่ Main Stage 5v5 Soundproof Glass Arena พร้อมทีมงานสตรีมมิ่ง 4K และระบบ Tournament Manager": {
    en: "Main Stage 5v5 Soundproof Glass Arena with 4K Streaming Team and Tournament Manager",
    zh: "4K流媒体团队和锦标赛经理的主舞台5v5隔音玻璃竞技场"
  },
  "ติดต่อจองเวที": {
    en: "Contact to book the stage",
    zh: "联系以预订舞台"
  },
  "GLP : G Speed Living Plus | ศูนย์อีสปอร์ตครบวงจร & ระบบแฟรนไชส์จัดผังร้านอัจฉริยะ": {
    en: "GLP: G Speed Living Plus | Fully Integrated Esports Center & Smart Store Layout Franchise System",
    zh: "GLP ： G Speed Living Plus |完全集成的电子竞技中心和智能商店布局特许经营系统"
  },
  "ศูนย์รวมอีสปอร์ตครบวงจร สเปกคอมไฮเอนด์ RTX 40 Series จอ 360Hz เวทีแข่งมาตรฐานสากล พร้อมระบบจำลองผังร้านแฟรนไชส์ 3D": {
    en: "Fully integrated esports hub, high end specs, RTX 40 Series, 360Hz screen, international standard arena with 3D franchise store layout simulation.",
    zh: "完全集成的电子竞技中心，高端规格， RTX 40系列， 360Hz屏幕，具有3D特许经营店布局模拟的国际标准竞技场。"
  },
  "ร้านเกม, อีสปอร์ต, แฟรนไชส์ร้านเกม, GLP, G Speed Living Plus, จัดผังร้านเกม 3D, RTX 4090, BenQ 360Hz": {
    en: "Game Store, Esports, Game Store Franchise, GLP, G Speed Living Plus, 3D Game Store Layout, RTX 4090, BenQ 360Hz",
    zh: "游戏商店，电子竞技，游戏商店特许经营， GLP ， G Speed Living Plus ， 3D游戏商店布局， RTX 4090 ，明基360Hz"
  },
  "สำรวจกิจกรรม & ทัวร์นาเมนต์": {
    en: "Explore events & tournaments",
    zh: "探索赛事和锦标赛"
  },
  "ศูนย์รวมอีสปอร์ตครบวงจร & พื้นที่ประลองเกมมาตรฐานสากล": {
    en: "One-stop esports hub & international standard gaming arena",
    zh: "一站式电子竞技中心和国际标准游戏竞技场"
  },
  "ติดต่อเปิดร้านเกมของคุณ": {
    en: "Contact to open your game store.",
    zh: "请联系以打开您的游戏商店。"
  },
  "สัมผัสประสบการณ์เกมมิ่งระดับเวิลด์คลาสด้วยเครื่องสเปกไฮเอนด์ RTX 40 Series จอ 360Hz และเวทีแข่งขันมาตรฐาน Pro Circuit พร้อมระบบคำนวณและจำลองผังร้านแฟรนไชส์อัจฉริยะ": {
    en: "Experience world-class gaming with the high-end RTX 40 Series 360Hz spectroscope and Pro Circuit standard arena with intelligent franchise store layout calculations and simulations.",
    zh: "借助高端RTX 40系列360Hz光谱仪和Pro Circuit标准竞技场，通过智能特许经营店布局计算和模拟，体验世界一流的游戏。"
  },
  "เปิดระบบ 3D": {
    en: "Turn on 3D",
    zh: "开启3D"
  },
  "รวมภาพกิจกรรม & บรรยากาศสด": {
    en: "Overview & Live Atmosphere",
    zh: "概述和现场氛围"
  },
  "เกาะติดผลการแข่งขัน ทริกการเล่น สเปกอุปกรณ์ใหม่ และประกาศจากทางร้าน": {
    en: "Stick to match results, playing tricks, specs, new equipment, and shop announcements.",
    zh: "坚持匹配结果、耍花招、规格、新设备和商店公告。"
  },
  "ภาพบรรยากาศการแข่งขันเกมและกองเชียร์อีสปอร์ต ณ GLP Arena": {
    en: "Images of games and esports cheerleading at the GLP Arena.",
    zh: "GLP竞技场的游戏和电子竞技啦啦队图片。"
  },
  "บทความ ข่าวสาร & ไฮไลต์เกม": {
    en: "News Articles & Game Highlights",
    zh: "新闻文章和游戏亮点"
  },
  "ศูนย์รวมอีสปอร์ตครบวงจร GLP G-Speed Living Plus แฟรนไชส์ร้านเกม 3D": {
    en: "One-stop esports hub GLP G-Speed Living Plus 3D Game Store Franchise",
    zh: "一站式电竞中心GLP G-Speed Living Plus 3D游戏商店特许经营"
  },
  "อ่านบทความล่าสุด": {
    en: "Read the latest article",
    zh: "阅读最新文章"
  },
  "บรรยากาศและโซนการให้บริการ GLP ESPORTS": {
    en: "GLP Esports Service Atmosphere and Zone",
    zh: "GLP电子竞技服务氛围和区域"
  },
  "เริ่มออกแบบผังร้าน & ประเมินงบประมาณทันที": {
    en: "Start Designing Store Layout & Budget Assessment Immediately",
    zh: "立即开始设计商店布局和预算评估"
  },
  "บทความ ข่าวสารวงการเกม และอัปเดตสเปกฮาร์ดแวร์ GLP Esports": {
    en: "Articles, gaming news and GLP Esports hardware specs update",
    zh: "文章、游戏新闻和GLP Esports硬件规格更新"
  },
  "สัมผัสความพรีเมียมที่ออกแบบมาสำหรับเกมเมอร์ทุกสไตล์ ตั้งแต่ผู้เล่นทั่วไป สตรีมเมอร์ ไปจนถึงการประลองระดับแชมป์เปียนชิป": {
    en: "Experience a premium designed for every style of gamer, from regular streamers to chip championships.",
    zh: "体验专为各种风格的游戏玩家设计的高级版，从常规主播到芯片锦标赛。"
  },
  "เวทีประลองระดับมืออาชีพ": {
    en: "Professional Arena",
    zh: "专业竞技场"
  },
  "ทัศนียภาพมุมสูงของอารีน่าความจุผู้ชมกว่า 200 ที่นั่งพร้อมจอด้านข้าง": {
    en: "High angle view of the 200 + seat arena with side screen.",
    zh: "带侧屏的200多个座位竞技场的高角度视野。"
  },
  "ระบบแสงเวที Dynamic Light Sync เปลี่ยนสีตามสถานะการแข่งขัน": {
    en: "The Dynamic Light Sync stage lighting system changes color according to the match status.",
    zh: "动态光同步舞台照明系统根据匹配状态更改颜色。"
  },
  "เวทีแข่งขัน Main Stage ระบบแสงสีเสียงและจอ LED Wall 4K ขนาดยักษ์": {
    en: "Main Stage Light & Sound System & Giant 4K LED Wall Screen",
    zh: "主舞台灯光音响系统和巨型4K LED墙面屏幕"
  },
  "เวทีแข่งขันแยก 2 ฝั่งพร้อมระบบกระจกกันเสียงระดับสตูดิโอ จอ LED Wall ขนาดยักษ์ 4K และโต๊ะแคสเตอร์สำหรับถ่ายทอดสด Live Streaming รองรับการจัดแข่ง Official ทุกเกม": {
    en: "Two separate arenas with studio soundproofing, a giant 4K LED Wall screen, and a caster table for live streaming support all official games.",
    zh: "两个带有工作室隔音功能的独立竞技场、一个巨大的4K LED墙面屏幕和一个用于直播的脚轮桌，支持所有官方游戏。"
  },
  "ห้องส่วนตัว Private Gaming Suite": {
    en: "Private room Private Gaming Suite",
    zh: "独立房间独立游戏套房"
  },
  "สเปกคอมพิวเตอร์ระดับสตรีมเมอร์ พร้อมไฟสตูดิโอ Elgato Key Light": {
    en: "Streamer Computer Specs with Elgato Key Light Studio Lights",
    zh: "Streamer电脑规格带Elgato钥匙灯工作室灯"
  },
  "ไมโครโฟนระดับสตูดิโอบรอดแคสต์ Shure SM7B + RodeCaster Pro": {
    en: "Shure SM7B + RodeCaster Pro Broadcast Studio Level Microphone",
    zh: "舒尔SM7B + RodeCaster专业广播工作室级麦克风"
  },
  "ห้องส่วนตัว VIP Suite ผนังซับเสียง Acoustic เก็บเสียงเงียบสนิท": {
    en: "Private Room VIP Suite Acoustic Sound Absorption Wall Keep the sound quiet.",
    zh: "独立房间VIP套房吸音墙保持安静。"
  },
  "โซนส่วนตัว 5-6 ที่นั่ง เหมาะสำหรับทีมฝึกซ้อม (Bootcamp) หรือแก๊งเพื่อน พร้อมอุปกรณ์สตรีมมิ่งครบเซ็ต กล้อง 4K ไมโครโฟนระดับบอร์ดแคสต์ และไฟสตูดิโอ Key Light": {
    en: "The 5-6 seat private zone is perfect for a practice team (bootcamp) or a gang of friends, complete with full streaming equipment, 4K camera, microphone, casting board, and Key Light studio lights.",
    zh: "5-6个座位的私人区域非常适合练习团队（训练营）或一群朋友，配备全流媒体设备、4K摄像头、麦克风、浇铸板和Key Light工作室灯光。"
  },
  "หูฟังเกมมิ่ง Pro Wireless ตัดเสียงรบกวนภายนอก 100%": {
    en: "100% external noise-cancelling Pro Wireless gaming headphones",
    zh: "100%外部降噪Pro无线游戏耳机"
  },
  "บรรยากาศทีมบูตแคมป์ 5 คน นั่งซ้อมกลยุทธ์ส่วนตัวไม่มีเสียงรบกวน": {
    en: "Atmosphere 5 person boot camp team sitting in private strategy practice, no noise.",
    zh: "Atmosphere 5人新兵训练营团队坐在私人战略练习场，无噪音。"
  },
  "เก้าอี้ Secretlab TITAN Evo พรีเมียมรองรับหลัง นั่งสบายยาวนาน": {
    en: "Premium Titan Evo Secretlab Chair supports long-lasting comfort",
    zh: "高级Titan Evo Secretlab椅子支持持久的舒适性"
  },
  "แสงไฟนีออน Cyberpunk ปรับแต่งโปรไฟล์สีได้ตามความชอบของทีม": {
    en: "Cyberpunk neon lights customize the color profile according to the team's preferences.",
    zh: "赛博朋克霓虹灯根据团队的喜好定制颜色配置文件。"
  },
  "หน้าจอคู่ Dual-Monitor: จอหลัก OLED 360Hz + จอรอง 4K มอนิเตอร์แชท": {
    en: "Dual-Monitor Screen: 360Hz OLED Home Screen + 4K Secondary Monitor Chat",
    zh: "双显示器屏幕： 360Hz OLED主屏幕+ 4K辅助显示器聊天"
  },
  "ระบบระบายความร้อน Custom Water Cooling เงียบสนิท ไร้เสียงพัดลมรบกวน": {
    en: "Custom Water Cooling system is completely silent, no noise fan.",
    zh: "定制水冷系统完全静音，无噪音风扇。"
  },
  "คีย์บอร์ดกลไก Rapid Trigger ตอบสนองเร็วระดับมิลลิวินาที": {
    en: "Keyboard, Rapid Trigger mechanism, millisecond response",
    zh: "键盘，快速触发机制，毫秒响应"
  },
  "มุมวิเคราะห์แผนการเล่นหน้าจอสมาร์ททีวี 65 นิ้วสำหรับโค้ช": {
    en: "Game plan analysis corner 65 inch smart TV screen for coaches",
    zh: "游戏计划分析角65寸智能电视教练屏"
  },
  "โค้ชและนักกีฬาบรีฟแผนการเล่นก่อนการแข่งขันแมตช์สำคัญ": {
    en: "Coach and athlete brethren, pre-match game plan",
    zh: "教练和运动员兄弟，赛前比赛计划"
  },
  "มุมพักผ่อนและโต๊ะทำงานส่วนตัวสำหรับครีเอเตอร์และผู้จัดการทีม": {
    en: "Dedicated lounge corner and desk for creators and team managers",
    zh: "专为创作者和团队经理打造的休息室角落和办公桌"
  },
  "สาย LAN 10Gbps แยก Dedicated Bandwidth ไม่แชร์ความเร็วกับภายนอก": {
    en: "10Gbps LAN cable separates Dedicated Bandwidth and does not share speed with external",
    zh: "10Gbps局域网电缆分离专用带宽，不与外部共享速度"
  },
  "เมาส์เกมมิ่ง Pro Wireless น้ำหนักเบาพร้อมแผ่นรองเมาส์ Speed/Control": {
    en: "Lightweight Pro Wireless Gaming Mouse with Speed/Control Mouse Pad",
    zh: "轻量级专业无线游戏鼠标带速度/控制鼠标垫"
  },
  "มินิบาร์และตู้แช่เครื่องดื่มบริการเสิร์ฟถึงห้องพักส่วนตัว": {
    en: "Minibar and beverage cooler served in private room",
    zh: "独立房间提供迷你吧和饮料冷藏柜"
  },
  "มีจุดเชื่อมต่อกล้อง DSLR / Capture Card 4K พร้อมสตรีมทันที": {
    en: "There is a 4K DSLR/Capture Card access point with instant stream.",
    zh: "有一个带即时流的4K数码单反相机/采集卡接入点。"
  },
  "บรรยากาศการซ้อมทีมที่เต็มไปด้วยสมาธิและการประสานงานที่ยอดเยี่ยม": {
    en: "Team rehearsal atmosphere with great focus and coordination.",
    zh: "团队排练氛围，高度专注和协调。"
  },
  "โซนเครื่องมาตรฐานระดับแข่งขัน": {
    en: "Competitive Standard Machine Zone",
    zh: "有竞争力的标准机器区域"
  },
  "แถวที่นั่งเล่นเกมมาตรฐานความจุกว่า 80+ ที่นั่ง แสงไฟนีออนสบายตา": {
    en: "80 + standard gaming seats with comfortable neon lighting",
    zh: "80多个标准游戏座椅，配备舒适的霓虹灯照明"
  },
  "โซนหลักความจุกว่า 80+ ที่นั่ง ออกแบบระยะห่างตามหลักสรีรศาสตร์ เก้าอี้เกมมิ่งระบายอากาศ โต๊ะกว้าง 120 ซม. ลากเมาส์สะใจ พร้อมระบบเน็ตเวิร์ก 10Gbps Ping ต่ำกว่า 5ms": {
    en: "Main zone 80 + seats, Ergonomic spacing design, Ventilated gaming chair, 120cm wide table Drag your mouse with 10Gbps network ping below 5ms.",
    zh: "主区域80 +座位，符合人体工程学的间距设计，通风游戏椅， 120厘米宽的桌子使用低于5毫秒的10Gbps网络ping拖动鼠标。"
  },
  "ความสะดวกสบายและความเป็นส่วนตัวระดับ First-Class Gaming Lounge": {
    en: "First-Class Gaming Lounge Comfort and Privacy",
    zh: "一流的游戏休息室舒适和隐私"
  },
  "ระบบปรับอากาศแยกส่วน Daikin Inverter เย็นสบายและเงียบเป็นพิเศษ": {
    en: "Daikin Inverter split air conditioning system is cool and ultra quiet.",
    zh: "大金逆变器分体式空调系统凉爽安静。"
  },
  "โต๊ะเกมมิ่งกว้างพิเศษ 120 ซม. ออกแบบมาเพื่อลากเมาส์ได้เต็มวงกว้าง": {
    en: "Extra Wide 120cm Gaming Table Designed to drag the mouse in full width.",
    zh: "超宽120厘米游戏桌设计用于全宽拖动鼠标。"
  },
  "คีย์บอร์ดกลไก Blue/Red Switch กดมันส์ เสียงแน่น ทนทาน": {
    en: "Blue/Red Switch mechanical keyboard with strong and durable sound.",
    zh: "蓝色/红色开关机械键盘，声音强劲耐用。"
  },
  "บรรยากาศความสนุกสนานและคอมมูนิตี้คนรักเกมทุกวัยตลอด 24 ชม.": {
    en: "Fun atmosphere and community, game lovers of all ages, 24 hours a day.",
    zh: "有趣的氛围和社区，所有年龄段的游戏爱好者，一天24小时。"
  },
  "เมาส์เกมมิ่ง Ergonomic DPI สูง พร้อมปุ่ม Macro สำหรับเกม FPS และ MOBA": {
    en: "High dpi Ergonomic Gaming Mouse with Macro Button for FPS and MOBA Games",
    zh: "高DPI符合人体工程学的游戏鼠标，带用于FPS和MOBA游戏的宏按钮"
  },
  "หน้าจอ Fast-IPS 240Hz สีสันสดใส คมชัด มองสบายตาแม้เล่นนาน": {
    en: "240Hz Fast-IPS screen, bright and clear, comfortable to look at even when playing for a long time.",
    zh: "240Hz快速IPS屏幕，明亮清晰，即使在长时间玩游戏时也能舒适地观看。"
  },
  "ระบบอินเทอร์เน็ต Dual Fiber 10Gbps Ping ต่ำกว่า 3ms เล่นไม่กระตุก": {
    en: "Dual Fiber 10Gbps Internet System, Ping less than 3ms, play no jog",
    zh: "双光纤10Gbps互联网系统， ping小于3ms ，不慢跑播放"
  },
  "การเดินสายแลนแบบ Cat6A ชีลด์กันสัญญาณรบกวนใต้รางพื้นเรียบร้อย": {
    en: "Cat6A S.H.I.E.L.D. wiring prevents noise under floor tracks.",
    zh: "Cat6A S.H.I.E.L.D.布线可防止地板轨道下的噪音。"
  },
  "ระบบสำรองไฟระดับองค์กร UPS ไฟดับเล่นต่อได้ไม่มีเซฟหลุด": {
    en: "Enterprise-grade uninterruptible power supply, UPS, power outages, playback, no safeguards",
    zh: "企业级不间断电源， UPS ，停电，回放，无保障"
  },
  "หูฟังครอบหูบุนวมหนานุ่ม เบสแน่น ไมโครโฟนตัดเสียงคุยในดิสคอร์ดชัดเจน": {
    en: "Padded earbuds, thick and soft, tight bass, microphone, clear chatter in the discord.",
    zh: "带衬垫的耳机，厚实柔软，低音结实，麦克风，清晰的喋喋不休。"
  },
  "เคสคอมพิวเตอร์การ์ดจอ RTX 4070 SUPER ปรับกราฟิก Ultra ทุกเกม": {
    en: "Computer case RTX 4070 super graphics card Ultra adapt all games",
    zh: "电脑外壳RTX 4070超级显卡超适合所有游戏"
  },
  "เคาน์เตอร์แคชเชียร์และระบบสมาชิกเติมเงินออนไลน์ สะดวก รวดเร็ว": {
    en: "The cashier counter and online top-up membership system are convenient and fast.",
    zh: "收银台和在线充值会员系统方便快捷。"
  },
  "ระบบ Diskless และ Auto-Update เกม อัปเดตแพตช์ทันทีพร้อมเล่น": {
    en: "Diskless and Auto-Update system, instant patch update game, ready to play",
    zh: "无盘和自动更新系统，即时补丁更新游戏，随时可玩"
  },
  "บรรยากาศการรวมตัวเพื่อนฝูงจัดตี้เล่นเกมวันหยุดสุดสัปดาห์": {
    en: "The atmosphere of gathering friends, playing weekend games",
    zh: "聚友、玩周末游戏的气氛"
  },
  "เก้าอี้เกมมิ่งหุ้มหนัง PU ระบายความร้อน มีหมอนรองคอและหลัง": {
    en: "A heated PU leather upholstered gaming chair with a neck pillow and back.",
    zh: "带颈枕和背部的加热聚氨酯合成革软垫游戏椅。"
  },
  "ความสะอาดของอุปกรณ์ มีการฆ่าเชื้อด้วยแอลกอฮอล์ทุกรอบการใช้งาน": {
    en: "The cleanliness of the equipment is disinfected with alcohol every use cycle.",
    zh: "每次使用周期都用酒精对设备的清洁度进行消毒。"
  },
  "ทางเดินกว้างขวาง ปลอดโปร่ง แอร์เย็นฉ่ำ 24 องศาตลอดวัน": {
    en: "The corridor is spacious, clear, air-cooled, 24 degrees all day.",
    zh: "走廊宽敞、干净、风冷，全天24度。"
  },
  "ไฟส่องสว่างนวลตา ลดการเมื่อยล้าของสายตาเมื่อเล่นเกมนาน": {
    en: "Soft illumination reduces eye fatigue when playing long games.",
    zh: "柔和的照明可以减少长时间玩游戏时的眼睛疲劳。"
  },
  "จุดเติมพลังและคอมมูนิตี้บาร์": {
    en: "Refueling Spots and Community Bars",
    zh: "加油点和社区酒吧"
  },
  "พื้นที่พบปะสังสรรค์ของชาวเกมเมอร์ที่ใหญ่และทันสมัยที่สุด": {
    en: "The largest and most modern gamer meeting space.",
    zh: "最大、最现代化的游戏玩家会议空间。"
  },
  "โมเมนต์คว้าแชมป์ในเกมพร้อมเสียงเฮลั่นจากเพื่อนร่วมทีม": {
    en: "Moment of championship in the game with hissing from his teammates.",
    zh: "比赛中的冠军时刻，队友发出嘶嘶声。"
  },
  "เคาน์เตอร์บาร์เครื่องดื่ม Specialty Coffee สดใหม่พร้อมเสิร์ฟ": {
    en: "A specialty coffee bar counter is fresh to serve.",
    zh: "特色咖啡吧台很新鲜。"
  },
  "บาร์เครื่องดื่ม Energy Drinks นำเข้าเย็นเจี๊ยบเติมความสดชื่น": {
    en: "Energy Drinks Bar, Imported, Cool, Refreshing Chick",
    zh: "能量饮料酒吧，进口，清凉，清爽的小鸡"
  },
  "มุมที่นั่งพักผ่อนสไตล์โมเดิร์นคาเฟ่ แอร์เย็น บรรยากาศผ่อนคลาย": {
    en: "Modern lounge seating corner, cool air-conditioned cafe, relaxing atmosphere.",
    zh: "现代化的休息室座位角落、凉爽的空调咖啡馆、轻松的氛围。"
  },
  "บาร์เครื่องดื่มและอาหารปรุงสด พร้อมเสิร์ฟถึงโต๊ะผ่านระบบสั่งอาหารบนหน้าจอคอมพิวเตอร์ กาแฟสด ชานมไข่มุก เบอร์เกอร์ และมุมโซฟาชมการแข่งขันผ่านจอยักษ์": {
    en: "Bars, drinks, and freshly prepared food are served to the table via a computer screen ordering system, fresh coffee, tea, pearl milk, burgers, and a giant screen competition sofa corner.",
    zh: "酒吧、饮料和新鲜烹制的食物通过电脑屏幕订购系统、新鲜咖啡、茶、珍珠奶、汉堡和巨大的屏幕比赛沙发角落供应。"
  },
  "เมนูอาหารปรุงสด เบอร์เกอร์เนื้อพรีเมียม และเฟรนช์ฟรายส์กรอบ": {
    en: "Freshly cooked dishes, premium meat burgers and crispy French fries",
    zh: "新鲜烹饪的菜肴、优质肉汉堡和脆薯条"
  },
  "ขนมขบเคี้ยวและของหวาน ไอศกรีมหลากหลายรสชาติ": {
    en: "Snacks and desserts, ice cream in a variety of flavors",
    zh: "各种口味的小吃和甜点、冰淇淋"
  },
  "พื้นที่นั่งรอและจุดนัดพบสำหรับเพื่อนๆ ระหว่างรอโต๊ะว่าง": {
    en: "Waiting area and meeting point for friends while waiting for an empty table",
    zh: "等待空桌时等待好友的区域和集合点"
  },
  "โซฟาเลานจ์ขนาดใหญ่พร้อมจอยักษ์ ถ่ายทอดสดทัวร์นาเมนต์ระดับโลก": {
    en: "A large lounge sofa with a giant screen broadcasting live world tournaments.",
    zh: "一张大型休息室沙发，配有巨型屏幕，可直播世界锦标赛。"
  },
  "กาแฟอาราบิก้าแท้ คั่วบดหอมกรุ่นโดยบาริสต้าประจำร้าน": {
    en: "Authentic Arabica coffee, roasted, ground, fragrant by the in-house barista",
    zh: "正宗的阿拉比卡咖啡，由内部咖啡师烘焙、研磨、芳香"
  },
  "บริการส่งอาหารและเครื่องดื่มตรงถึงโต๊ะคอม ไม่ต้องลุกไปสั่ง": {
    en: "Food and beverage delivery directly to the computer table, no need to get up and order.",
    zh: "餐饮直接送到电脑桌，无需起床点餐。"
  },
  "บรรยากาศยามค่ำคืนกับแสงไฟ Warm Light ให้ความรู้สึกอบอุ่น": {
    en: "The night time atmosphere with the warm light gives a warm feeling.",
    zh: "夜晚的氛围和温暖的灯光给人一种温暖的感觉。"
  },
  "ตู้แช่เครื่องดื่มอัตโนมัติ ชำระเงินผ่านสแกน QR Code ทันใจ": {
    en: "Automatic beverage cooler, instant payment via QR code scan",
    zh: "自动饮料冷却器，通过二维码扫描即时付款"
  },
  "มุมฉลองความสำเร็จและปาร์ตี้วันเกิดร่วมกับเพื่อนในทีม": {
    en: "Achievement corner and birthday party with teammates",
    zh: "与队友一起体验成就角落和生日派对"
  },
  "คอมมูนิตี้พบปะแลกเปลี่ยนประสบการณ์ของชาวเกมเมอร์": {
    en: "Community Encounters Gamer Experiences",
    zh: "社区邂逅游戏玩家体验"
  },
  "เมนูเซ็ตโปรโมชันคู่คอมพิวเตอร์ สั่งเป็นชุดสุดคุ้ม": {
    en: "Computer pair promotion set menu, ordered as a set of great value",
    zh: "电脑对促销套餐，以超值套餐订购"
  },
  "พื้นที่นั่งทำงาน Co-working Space ทำงานไปพลาง จิบกาแฟไปพลาง": {
    en: "Co-working space to work while sipping coffee",
    zh: "共享办公空间，边喝咖啡边工作"
  },
  "พนักงานบริการด้วยรอยยิ้มและพร้อมให้คำแนะนำตลอด 24 ชม.": {
    en: "Service staff with smiles and ready to give advice 24 hours a day.",
    zh: "服务人员面带微笑， 24小时随时为您提供建议。"
  },
  "มีจุดชาร์จโทรศัพท์มือถือไร้สายและปลั๊กไฟบริการฟรีทุกโต๊ะ": {
    en: "There are wireless mobile phone charging points and free power outlets at all tables.",
    zh: "所有桌子上都有无线手机充电点和免费电源插座。"
  },
  "ระบบเสียงเพลงเบาๆ ช่วยผ่อนคลายความเหนื่อยล้าหลังเล่นเกม": {
    en: "The soft music system soothes post-game fatigue.",
    zh: "柔和的音乐系统可以缓解赛后的疲劳。"
  },
  "มาตรฐานความสะอาดระดับพรีเมียม ภาชนะผ่านการฆ่าเชื้อทุกชิ้น": {
    en: "Premium cleanliness standards. All containers are sterilized.",
    zh: "优质清洁标准。所有容器均已灭菌。"
  },
  "เร็วๆนี้": {
    en: "Coming soon",
    zh: "很快就会"
  },
  "1 กันยายน 2026": {
    en: "September 1, 2026",
    zh: "2026年9月1日"
  },
  "จุดเช็กอินถ่ายรูปสวยพร้อมมุมถ่ายภาพชิคๆ โพสต์ลงโซเชียล": {
    en: "Check-in point, take a good photo with a photo corner. Chic posted on social media.",
    zh: "入住点，拍一张好照片，照片角落。别致发布在社交媒体上。"
  },
  "ทัวร์นาเมนต์อีสปอร์ตสุดยิ่งใหญ่แห่งปี 2026 ชิงเงินรางวัลรวมกว่า ฿100,000 รวบรวม 32 ยอดทีมทั่วประเทศมาดวลความแม่นยำบนเวที LAN Final ณ G-Speed Arena รามคำแหง 53 พร้อมระบบคอมพิวเตอร์สเปกทัวร์นาเมนต์ Intel Core i9 + RTX 4080 และหน้าจอ BenQ ZOWIE 360Hz ถ่ายทอดสดด้วยทีมงานแคสเตอร์ระดับมืออาชีพ": {
    en: "The biggest esports tournament of 2026 for a total prize pool of more than 100,000, gathering 32 teams across the country for precision duels on the LAN Final stage at G-Speed Arena Ramkhamhaeng 53 with computer systems, Intel Core i9 + RTX 4080 tournament specs, and a BenQ ZOWIE 360Hz screen live with a team of professional casters.",
    zh: "2026年最大的电子竞技锦标赛，总奖池超过100,000个，汇集了全国32支球队，在G-Speed Arena Ramkhamhaeng 53的局域网决赛阶段进行精确决斗，配备计算机系统、英特尔酷睿i9 + RTX 4080锦标赛规格和明基ZOWIE 360Hz屏幕，由专业脚轮团队直播。"
  },
  "25 กันยายน 2026": {
    en: "September 25, 2026",
    zh: "2026年9月25日"
  },
  "฿25,000 + เหรียญเงิน": {
    en: "25,000 + Silver",
    zh: "25,000 +银币"
  },
  "฿10,000 ต่อทีม + เหรียญทองแดง": {
    en: "10,000 per team + Bronze",
    zh: "每队10,000 +铜牌"
  },
  "รองชนะเลิศอันดับ 2 ร่วม (2 ทีม)": {
    en: "Joint 2nd Runner-up (2 teams)",
    zh: "并列亚军（ 2支球队）"
  },
  "฿5,000 + หูฟัง ROG Delta S Wireless": {
    en: "5,000 + Rog Delta S Wireless Headphones",
    zh: "5,000 + ROG Delta S无线耳机"
  },
  "฿50,000 + ถ้วยเกียรติยศ + เหรียญทอง + ROG Gaming Gear Set": {
    en: "50,000 + Honor Cup + Gold Medal + Rog Gaming Gear Set",
    zh: "50,000 +荣誉杯+金牌+ ROG游戏装备套装"
  },
  "28 ก.ย. 2026 • 11:00 น.": {
    en: "Sep 28, 2026 • 11:00 AM",
    zh: "2026年9月28日•上午11:00"
  },
  "RoninZero (กัปตันทีม)": {
    en: "RoninZero (Team Captain)",
    zh: "RoninZero （队长）"
  },
  "BangkokBlade (กัปตันทีม)": {
    en: "BangkokBlade (Team Captain)",
    zh: "BangkokBlade （队长）"
  },
  "รอบ 8 ทีมสุดท้าย (QF 1)": {
    en: "Final 8 (QF 1)",
    zh: "决赛8 （ QF 1 ）"
  },
  "PredatorAim (กัปตันทีม)": {
    en: "PredatorAim (Team Captain)",
    zh: "PredatorAim （队长）"
  },
  "28 ก.ย. 2026 • 13:30 น.": {
    en: "Sep 28, 2026 • 1:30 PM",
    zh: "2026年9月28日•下午1:30"
  },
  "28 ก.ย. 2026 • 16:00 น.": {
    en: "Sep 28, 2026 • 4:00 PM",
    zh: "2026年9月28日•下午4:00"
  },
  "รอบ 8 ทีมสุดท้าย (QF 4)": {
    en: "Final 8 (QF 4)",
    zh: "决赛8 （ QF 4 ）"
  },
  "รอบ 8 ทีมสุดท้าย (QF 3)": {
    en: "Final 8 (QF3)",
    zh: "决赛8 （ QF3 ）"
  },
  "รอบ 8 ทีมสุดท้าย (QF 2)": {
    en: "Final 8 (QF2)",
    zh: "决赛8 （ QF2 ）"
  },
  "ผู้ชนะ QF 1": {
    en: "QF Winner 1",
    zh: "QF优胜者1"
  },
  "ผู้ชนะ QF 2": {
    en: "QF Winner 2",
    zh: "QF优胜者2"
  },
  "รอบ 4 ทีมสุดท้าย (Semi-Final 1)": {
    en: "Semi-Final 1",
    zh: "半决赛1"
  },
  "29 ก.ย. 2026 • 14:00 น.": {
    en: "Sep 29, 2026 • 2:00 PM",
    zh: "2026年9月29日•下午2:00"
  },
  "28 ก.ย. 2026 • 18:30 น.": {
    en: "Sep 28, 2026 • 6:30 PM",
    zh: "2026年9月28日•下午6:30"
  },
  "รอบ 4 ทีมสุดท้าย (Semi-Final 2)": {
    en: "Semi-Final 2",
    zh: "半决赛2"
  },
  "29 ก.ย. 2026 • 17:00 น.": {
    en: "Sep 29, 2026 • 5:00 PM",
    zh: "2026年9月29日•下午5:00"
  },
  "ผู้ชนะ QF 3": {
    en: "QF Winner 3",
    zh: "QF优胜者3"
  },
  "ผู้ชนะ QF 4": {
    en: "QF Winner 4",
    zh: "QF优胜者4"
  },
  "รอบชิงชนะเลิศ (Grand Final ชิงแชมป์ ฿50,000)": {
    en: "Final (Grand Final Championship 50,000)",
    zh: "决赛（总决赛冠军50,000 ）"
  },
  "ผู้ชนะ Semi-Final 1": {
    en: "Semi-Final 1 winner",
    zh: "半决赛1冠军"
  },
  "ผู้ชนะ Semi-Final 2": {
    en: "Semi-Final 2 winners",
    zh: "半决赛2获胜者"
  },
  "30 ก.ย. 2026 • 18:00 น.": {
    en: "Sep 30, 2026 • 6:00 PM",
    zh: "2026年9月30日•下午6:00"
  },
  "เครื่องคอมพิวเตอร์สเปก Intel i9 + RTX 4080 SUPER พร้อมจอ 360Hz": {
    en: "Intel i9 + RTX 4080 super spec pc with 360Hz monitor",
    zh: "英特尔i9 + RTX 4080超级规格PC ，带360Hz显示器"
  },
  "บรรยากาศนักกีฬาประจำที่นั่ง Battle Stations ซ้อมมือก่อนเริ่มแข่ง": {
    en: "The atmosphere of the athletes in the Battle Stations seats practicing their hands before the start of the game",
    zh: "战站座位上运动员在比赛开始前练手的气氛"
  },
  "การแข่งขันรอบ 16 ทีมสุดท้าย แข่งพร้อมกันแบบ Full LAN Setup": {
    en: "The last 16 matches were played at the same time as the Full LAN Setup.",
    zh: "最后16场比赛与全局局域网设置同时进行。"
  },
  "มุมมองกว้างของอารีน่า แสงไฟธีมน้ำเงิน-ส้ม สื่อถึงการปะทะสุดเข้มข้น": {
    en: "Wide views of the arena, blue-orange themed lights convey intense clashes.",
    zh: "广阔的竞技场景观，蓝橙色主题灯光传递出激烈的冲突。"
  },
  "ระบบเน็ตเวิร์กแลนแบบแยกวง 10Gbps Latency ต่ำกว่า 1ms": {
    en: "Isolated Network LAN 10Gbps Latency under 1ms",
    zh: "1毫秒以下的隔离网络局域网10Gbps延迟"
  },
  "หูฟังตัดเสียงรบกวนเกรดการแข่งขัน Pro Studio Noise-Cancelling": {
    en: "Pro Studio Noise-Cancelling Competition Grade Noise Cancelling Headphones",
    zh: "专业工作室降噪比赛级降噪耳机"
  },
  "การอุ่นเครื่องทดสอบความพร้อมปุ่มกดและอัตราตอบสนองอุปกรณ์": {
    en: "Appliance readiness and response test preheating",
    zh: "电器准备和响应测试预热"
  },
  "โต๊ะแข่งขันแบบ Ergonomic ปรับระดับความสูงและพื้นที่ลากเมาส์พิเศษ": {
    en: "Ergonomic race table with adjustable height and special drag area",
    zh: "具有可调节高度和特殊阻力区域的人体工学比赛桌"
  },
  "เอฟเฟกต์ไฟสเตจเปลี่ยนสีอัตโนมัติตามสถานะการวาง Spike ในเกม": {
    en: "Stage lighting effects automatically change color based on Spike placement status in the game.",
    zh: "舞台照明效果会根据游戏中的尖峰位置状态自动更改颜色。"
  },
  "คีย์บอร์ดกลไกสวิตช์ Hall Effect Rapid Trigger แม่นยำทุกเสี้ยววินาที": {
    en: "Keyboard, mechanism, switch, Hall Effect Rapid Trigger, precise every second.",
    zh: "键盘、机构、开关、霍尔效应快速触发器，每秒精确。"
  },
  "สมาธิและความมุ่งมั่นของกัปตันทีมระหว่างสั่งการแผนการบุก": {
    en: "Concentration and determination of the team captain during command of the plan of attack.",
    zh: "指挥进攻计划期间队长的专注和决心。"
  },
  "กองเชียร์แน่นขนัดส่งเสียงเชียร์จังหวะ Clutch 1v3 สุดระทึก": {
    en: "Crowded cheerleaders cheered at the thrilling Clutch 1v3.",
    zh: "拥挤的啦啦队员在惊心动魄的离合器1V3中欢呼雀跃。"
  },
  "ทางเดินเปิดตัวน����กกีฬา (Player Tunnel) พร้อมไฟสปอตไลต์อลังการ": {
    en: "Player Tunnel launch corridor with spectacular spotlights",
    zh: "带有壮观聚光灯的玩家隧道发射走廊"
  },
  "โต๊ะนักพากย์ (Caster Desk) พร้อมจอวิเคราะห์สถิติสดแบบเร��������ไทม์": {
    en: "Caster Desk with live statistical analysis screen",
    zh: "带实时统计分析屏幕的脚轮桌"
  },
  "โซนวอร์มอัพห้องกระจกกันเสียงส่วนตัวสำหรับทีมที่รอขึ้นเวที": {
    en: "A private soundproofed glass room warm-up zone for teams waiting to take the stage.",
    zh: "私人隔音玻璃房热身区，适合等待登台的团队。"
  },
  "เคสคอมพิวเตอร์ชุดน้ำเปิด Custom RGB โลโก้ G-SPEED ประจำเวที": {
    en: "Computer case, open water set, Custom RGB, stage G-SPEED logo",
    zh: "电脑外壳，开放水域套装，定制RGB ，舞台G-SPEED徽标"
  },
  "ถ้วยรางวัลเกียรติยศและเหรียญรางวัลชนะเลิศบนโพเดียม": {
    en: "Trophies of honour and medals of the first place on the podium",
    zh: "领奖台第一名的荣誉奖杯和奖牌"
  },
  "ทีมงานบรอดแคสต์และสวิตเชอร์ควบคุมการถ่ายทอดสดแบบ Multi-View": {
    en: "The Broadcast and Switcher teams control the Multi-View live broadcast.",
    zh: "广播和切换器团队控制多视图直播。"
  },
  "เมาส์เกมมิ่งน้ำหนักเบา���ิเศษ 49g สำหรับการเล็งเป้าหมายที่เฉียบคม": {
    en: "Lightweight gaming mouse 49g for sharp aiming",
    zh: "轻巧的游戏鼠标49克，瞄准清晰"
  },
  "หน้าจอ Replay Slow Motion จังหวะช็อตเด็ด Headshot มหัศจรรย์": {
    en: "Replay Slow Motion Screen Magic Headshot Rhythm",
    zh: "重播慢动作屏幕魔术头像节奏"
  },
  "อุปกรณ์ควบคุมเสียงและไมโครโฟนสำหรับการบรรยายภาษาไทยและอังกฤษ": {
    en: "Audio controls and microphones for Thai and English lectures",
    zh: "泰语和英语讲座的音频控制和麦克风"
  },
  "ทัศนียภาพมุมสูงของอารีน่าระหว่างเปิดการแข่งขันอย่างเป็นทางการ": {
    en: "High view of the arena during the official opening of the tournament.",
    zh: "锦标赛正式开幕期间的竞技场高景观。"
  },
  "โค้ชและผู้เล่นร่วมวิเคราะห์แผนที่และตัวละครระหว่างช่วงพักครึ่ง": {
    en: "Co-coaches and players analyze maps and characters during halftime.",
    zh: "教练和玩家在半场结束时分析地图和角色。"
  },
  "พิธีมอบเช็คเงินรางวัล ฿100,000 แก่ทีมแชมป์เปียนประจำทัวร์นาเมนต์": {
    en: "A cheque for 100,000 won was presented to the tournament's champion team.",
    zh: "向锦标赛冠军球队赠送了一张10万韩元的支票。"
  },
  "แฟนคลับถ่ายรูปเซลฟี่ร่วมกับนักแข่งคนโปรดหลังจบงาน": {
    en: "Fans take selfies with their favorite racers after the event.",
    zh: "活动结束后，粉丝们将与他们最喜爱的赛车手进行自拍。"
  },
  "การจับมือแสดงสปิริตนักกีฬาระหว่างสองทีมหลังจบการแข่งขัน": {
    en: "The handshake showed the athlete's spirit between the two teams after the match.",
    zh: "比赛结束后，握手显示了两支球队之间的运动员精神。"
  },
  "ช่วงเวลาดีใจสุดขีดเมื่อยิงปิดเกมคว้า Match Point สุดระทึก": {
    en: "The moment of extreme joy when the shot closes the game, grabbing the thrilling Match Point.",
    zh: "当投篮结束比赛，抓住激动人心的比赛点时，极度欢乐的时刻。"
  },
  "แสงเลเซอร์และไพโรเทคนิคเปิดตัวคู่ชิงชนะเลิศ Grand Final": {
    en: "Laser light and pyrotechnics launch Grand Final duo",
    zh: "激光灯和烟火推出Grand Final duo"
  },
  "บรรยากาศผู้ร่วมงานเข้าคิวลุ้นรับของรางวัล Lucky Draw เกมมิ่งเกียร์": {
    en: "The atmosphere of the participants joined the queue to win Lucky Draw Gaming Gear prizes.",
    zh: "参与者的气氛加入队列，赢得幸运抽奖游戏装备奖品。"
  },
  "ป้ายไฟเชียร์และแบนเนอร์ของเหล่าแฟนคลับที่มาร่วมให้กำลังใจ": {
    en: "Cheerleading fan signs and banners",
    zh: "啦啦队球迷标志和横幅"
  },
  "การแสดงดนตรีสดเปิดงานทัวร์นาเมนต์สร้างความตื่นเต้นให้แฟนๆ": {
    en: "Live music at the opening of the tournament excites fans.",
    zh: "比赛开幕式上的现场音乐让球迷们兴奋不已。"
  },
  "จุดลงทะเบียนนักกีฬาและการแจกไอดีการ์ดประจำตัวการแข่งขัน": {
    en: "Athlete Registration Point and Tournament ID Card Distribution",
    zh: "运动员注册积分和锦标赛身份证发放"
  },
  "การตรวจสอบความสมบูรณ์ของสายสัญญาณ Fiber Optic ก่อนเริ่มแข่ง": {
    en: "Checking the integrity of the fiber optic cable before the start of the race",
    zh: "在比赛开始前检查光纤电缆的完整性"
  },
  "คณะผู้จัดงานและตัวแทนสปอนเซอร์ร่วมถ่ายภาพเปิดทัวร์นาเมนต์": {
    en: "Organizers and sponsoring representatives took the opening photos of the tournament.",
    zh: "组织者和赞助商代表拍摄了比赛的开幕照片。"
  },
  "สัมภาษณ์สดผู้เล่นยอดเยี่ยม MVP บนเวทีพร้อมล่ามแปลภาษา": {
    en: "Live interviews with top players, MVPs on stage, and interpreters.",
    zh: "现场采访顶级球员、舞台上的MVP和口译员。"
  },
  "ทีมช่างเทคนิคดูแลความสมบูรณ์ของระบบไฟฟ้าสำรอง UPS ตลอด 24 ชม.": {
    en: "The technician team takes care of the integrity of the UPS backup power system 24 hours a day.",
    zh: "技术人员团队全天候负责UPS备用电源系统的完整性。"
  },
  "ห้องประชุมลับสำหรับกรรมการผู้ตัดสินเพื่อพิจารณาเทปย้อนหลัง": {
    en: "Secret meeting room for judges to consider the tape back.",
    zh: "供评委考虑录音带的秘密会议室。"
  },
  "ภาพความประทับใจรวมเหล่านักแข่งทั้ง 32 ทีมบนเวทีใหญ่": {
    en: "Impressions include 32 racers on the main stage.",
    zh: "印象包括主舞台上的32名赛车手。"
  },
  "บรรยากาศบาร์ Cyber Cafe บริการเมนูสดใหม่ตลอดคืนแข่งขัน": {
    en: "The Cyber Cafe bar atmosphere offers fresh menus throughout the night of the competition.",
    zh: "Cyber Cafe酒吧的氛围在比赛当晚提供新鲜的菜单。"
  },
  "ช่วงเวลาชูถ้วยรางวัลฉลองชัยชนะท่ามกลางสายฝนริบบิ้นทอง": {
    en: "A moment to raise the trophy to celebrate victory in the rain of gold ribbons.",
    zh: "在金丝带雨中举起奖杯庆祝胜利的时刻。"
  },
  "เหรียญรางวัลเกียรติยศเคลือบทองคำแท้สำหรับแชมป์รายการนี้": {
    en: "A real gold-plated Medal of Honor for this champion.",
    zh: "为这位冠军颁发一枚真正的镀金荣誉勋章。"
  },
  "มุมอาหารว่างและเครื่องดื่มเกลือแร่ฟรีสำหรับนักกีฬาทุกทีม": {
    en: "Free snack and mineral beverage corner for all teams of athletes.",
    zh: "为所有运动员提供免费小吃和矿物质饮料角。"
  },
  "การจับสลากแบ่งสายการแข่งขัน Group Draw ถ่ายทอดสดทั่วประเทศ": {
    en: "The Group Draw is live nationwide.",
    zh: "团体抽奖在全国范围内直播。"
  },
  "กราฟิก 3D Hologram แสดงสายการแข่งขันและผลคะแนนสด": {
    en: "3D Hologram graphics show bracket and live scores.",
    zh: "3D全息图形显示括号和实时分数。"
  },
  "โค้ชให้คำแนะนำด้านจิตวิทยาและสมาธิระหว่างเวลานอก (Tactical Timeout)": {
    en: "The coach provides psychological guidance and concentration during time-out (Tactical Timeout).",
    zh: "教练在超时（战术超时）期间提供心理指导和专注力。"
  },
  "ระบบคอมพิวเตอร์เซิร์ฟเวอร์ควบคุมผลคะแนนการแข่งขันแบบอัตโนมัติ": {
    en: "The server computer system automatically controls the results of the match scores.",
    zh: "服务器计算机系统自动控制比赛分数的结果。"
  },
  "รอยยิ้มและมิตรภาพระหว่างผู้เล่นหลังจบแมตช์สุดดุเดือด": {
    en: "Smiles and friendships between players after a fierce match.",
    zh: "激烈的比赛后，玩家之间的微笑和友谊。"
  },
  "ผู้บริหาร G-Speed ขึ้นกล่าวปิดงานและประกาศทัวร์นาเมนต์ซีซันถัดไป": {
    en: "G-Speed executives gave closing remarks and announced the next season tournament.",
    zh: "G-Speed高管发表了闭幕词，并宣布了下赛季的比赛。"
  },
  "G-SPEED VALORANT CHAMPIONSHIP 2026 | ทัวร์นาเมนต์ชิงเงินรางวัล ฿100,000": {
    en: "G-SPEED valorant Championship 2026 | 100,000 cash prize tournament",
    zh: "2026年G-SPEED VALORANT锦标赛| 100,000现金奖金锦标赛"
  },
  "แฟนเกมร่วมสนุกกับมินิเกมและตอบคำถามแจกของรางวัลช็อปปิ้งมอลล์": {
    en: "Game fans enjoy mini-games and answer questions, giveaways, shopping malls",
    zh: "游戏爱好者喜欢迷你游戏，解答问题、赠品、购物中心"
  },
  "โน้ตบุ๊กเกมมิ่งระดับท็อปสำหรับการสตรีมมุมมองบุคคลที่หนึ่ง (POV)": {
    en: "A top-rated gaming notebook for first-person streaming (pov).",
    zh: "适用于第一人称流媒体（ POV ）的顶级游戏笔记本。"
  },
  "ภาพความทรงจำส่งท้ายงาน แฟนคลับและนักกีฬาร่วมบันทึกประวัติศาสตร์": {
    en: "Images of memories at the end of the event, fans and athletes recording history.",
    zh: "赛事结束时的回忆、球迷和运动员记录历史的图像。"
  },
  "฿25,000 + silver coins": {
    en: "25,000 + silver coins",
    zh: "25,000 +枚银币"
  },
  "฿50,000 + Trophy + Gold Medal + ROG Gaming Gear Set": {
    en: "$10,000 + Trophy + Gold Medal + Rog Gaming Gear Set",
    zh: "$ 10,000 +奖杯+金牌+ ROG游戏装备套装"
  },
  "VALORANT, GSpeed, ทัวร์นาเมนต์, แข่งเกม, อีสปอร์ต, รามคำแหง 53, LAN Final, 360Hz, ร้านเกม": {
    en: "VALORANT, GSpeed, Tournament, Game Race, Esports, Ramkhamhaeng 53, LAN Final, 360Hz, Game Store",
    zh: "VALORANT、GSpeed、锦标赛、比赛、电子竞技、Ramkhamhaeng 53、LAN Final、360Hz、游戏商店"
  },
  "การแข่งขัน VALORANT LAN Tournament สุดยิ่งใหญ่ ณ G-Speed Arena รามคำแหง 53 เงินรางวัลรวม 100,000 บาท แข่งขันบนเวที Main Stage จอ 360Hz": {
    en: "The great valorant LAN Tournament at G-Speed Arena, Ramkhamhaeng 53 with a prize pool of 100,000 baht, competed on the 360Hz Main Stage.",
    zh: "在G-Speed竞技场Ramkhamhaeng 53举行的伟大勇敢的局域网锦标赛，奖金为10万泰铢，在360Hz主舞台上比赛。"
  },
  "The biggest esports tournament of 2026, competing for a total prize money of over ฿100,000, gathering 32 top teams across the country to duel with precision on the LAN Final stage at G-Speed ​​Arena, Ramkhamhaeng 53, with a tournament spec computer system Intel Core i9 + RTX 4080 and a BenQ ZOWIE 360Hz screen, broadcast live by a professional caster team.": {
    en: "The biggest esports tournament of 2026, competing for a total prize money of over 100,000, gathering 32 top teams across the country to duel with precision on the LAN Final stage at G-Speed Arena, Ramkhamhaeng 53, with a tournament spec computer system Intel Core i9 + RTX 4080 and a BenQ ZOWIE 360Hz screen, broadcast live by a professional caster team.",
    zh: "2026年最大的电子竞技锦标赛，总奖金超过10万，汇集了全国32支顶级球队，在G-Speed Arena的Ramkhamhaeng 53局域网决赛阶段精准对决，配备锦标赛规格计算机系统Intel Core i9 + RTX 4080和BenQ ZOWIE 360Hz屏幕，由专业脚轮团队现场直播。"
  },
  "฿25,000 + 银币": {
    en: "25,000 + 银币",
    zh: "25,000 + 银币"
  },
  "฿10,000 per team + bronze medal": {
    en: "10,000 per team + bronze medal",
    zh: "每队10,000 +铜牌"
  },
  "฿5,000 + ROG Delta S Wireless headphones": {
    en: "5,000 + Rog Delta S Wireless headphones",
    zh: "5,000 + ROG Delta S无线耳机"
  },
  "฿5,000 + ROG Delta S 无线耳机": {
    en: "5,000 + Rog Delta S 无线耳机",
    zh: "5,000 + ROG Delta S 无线耳机"
  },
  "฿50,000 + 奖杯 + 金牌 + ROG 游戏装备套装": {
    en: "50,000 + 奖杯 + 金牌 + Rog 游戏装备套装",
    zh: "50,000 + 奖杯 + 金牌 + ROG 游戏装备套装"
  },
  "2026 年 G-SPEED VALORANT 锦标赛 |锦标赛奖金 ฿100,000": {
    en: "2026 年 G-SPEED valorant 锦标赛 |锦标赛奖金 100,000",
    zh: "2026 年 G-SPEED VALORANT 锦标赛 |锦标赛奖金 100,000"
  },
  "Ceremony to present prize money checks of ฿100,000 to the tournament champion teams.": {
    en: "Ceremony to present prize money checks of 100,000 to the tournament champion teams.",
    zh: "向锦标赛冠军球队颁发10万张奖金支票的仪式。"
  },
  "G-SPEED VALORANT CHAMPIONSHIP 2026 | Tournament for prize money ฿100,000": {
    en: "G-SPEED valorant Championship 2026 | Tournament for prize money 100,000",
    zh: "2026年G-SPEED VALORANT锦标赛| 10万奖金锦标赛"
  },
  "24-25 ตุลาคม 2026": {
    en: "October 24-25, 2026",
    zh: "2026年10月24-25日"
  },
  "10:00 - 22:00 น.": {
    en: "10:00 AM - 10:00 PM",
    zh: "上午10:00 -晚上10:00"
  },
  "฿80,000 + โควตาทัวร์ระดับนานาชาติ": {
    en: "80,000 + International Tour Quota",
    zh: "80,000 +国际旅游名额"
  },
  "1 ตุลาคม 2026": {
    en: "October 1, 2026",
    zh: "2026年10月1日"
  },
  "G-Speed Esport Arena รามคำแหง 53 (Main Stage Soundproof Booths)": {
    en: "G-Speed Esport Arena Ramkhamhaeng 53 (Main Stage Soundproof Booths)",
    zh: "G-Speed Esport Arena Ramkhamhaeng 53 （主舞台隔音摊位）"
  },
  "20 ตุลาคม 2026": {
    en: "October 20, 2026.",
    zh: "2026年10月20日。"
  },
  "฿40,000": {
    en: "<g id=\\\"1\\\">40,000</g>",
    zh: "40,000"
  },
  "฿15,000 ต่อทีม": {
    en: "15,000 per team",
    zh: "每队15,000人"
  },
  "อันดับ 3-4": {
    en: "3rd-4th",
    zh: "第3-4名"
  },
  "ใช้การตั้งค่า Official Valve CS2 Tournament Ruleset (MR12 + Overtime MR3)": {
    en: "Use the Official Valve CS2 Tournament Ruleset (MR12 + Overtime MR3) setting.",
    zh: "使用官方阀门CS2锦标赛规则集（ MR12 +加班MR3 ）设置。"
  },
  "การแข่งขันรันบนเซิร์ฟเวอร์ LAN ในเครื่องแม่ข่ายของ G-Speed ความหน่วงต่ำกว่า 1ms": {
    en: "The competition runs on LAN servers on G-Speed servers with a latency of less than 1ms.",
    zh: "比赛在G-Speed服务器上的局域网服务器上进行，延迟小于1毫秒。"
  },
  "ห้ามใช้คำสั่ง Console ที่ไม่ได้รับอนุญาตหรือ Custom Aliases": {
    en: "Do not use unauthorized console commands or custom aliases.",
    zh: "请勿使用未经授权的控制台命令或自定义别名。"
  },
  "รอบ Quarter-Finals (Bo3)": {
    en: "Quarter-Finals (Bo3)",
    zh: "四分之一决赛(Bo3)"
  },
  "10:00 น.": {
    en: "10:00 AM",
    zh: "上午10:00"
  },
  "พิธีเปิดและการคัดเลือกแผนที่ Map Veto": {
    en: "Map Veto Opening and Selection Ceremony",
    zh: "MAP否决权开盘和选拔仪式"
  },
  "11:00 - 15:00 น.": {
    en: "11:00 AM - 3:00 PM",
    zh: "上午11:00 -下午3:00"
  },
  "16:00 - 19:00 น.": {
    en: "4:00 PM - 7:00 PM",
    zh: "下午4:00 -晚上7:00"
  },
  "รอบ Semi-Finals (Bo3)": {
    en: "Semi-Finals (Bo3)",
    zh: "半决赛（ Bo3 ）"
  },
  "รอบชิงชนะเลิศ Grand Final (Bo5)": {
    en: "Grand Final (Bo5)",
    zh: "总决赛（ Bo5 ）"
  },
  "19:30 - 22:00 น.": {
    en: "7:30 PM - 10:00 PM",
    zh: "晚上7:30 -晚上10:00"
  },
  "BnTeT (กัปตันทีม)": {
    en: "BnTeT (Team Captain)",
    zh: "BnTeT （队长）"
  },
  "bLitz (กัปตันทีม)": {
    en: "bLitz (Team Captain)",
    zh: "bLitz （队长）"
  },
  "โต๊ะนักพากย์ (Caster Desk) พร้อมจอวิเคราะห์สถิติสดแบบเรียลไทม์": {
    en: "Caster Desk with real-time live statistical analysis screen",
    zh: "带实时统计分析屏幕的脚轮桌"
  },
  "CS2 BANGKOK SHOWDOWN INVITATIONAL 2026 | ชิง ฿150,000": {
    en: "CS2 Bangkok showdown Invitational 2026 | win 150,000",
    zh: "CS2曼谷摊牌邀请赛2026 |赢得150,000"
  },
  "เมาส์เกมมิ่งน้ำหนักเบาพิเศษ 49g สำหรับการเล็งเป้าหมายที่เฉียบคม": {
    en: "49g ultra-light gaming mouse for sharp aiming.",
    zh: "49克超轻游戏鼠标，瞄准清晰。"
  },
  "ทางเดินเปิดตัวนักกีฬา (Player Tunnel) พร้อมไฟสปอตไลต์อลังการ": {
    en: "Player Tunnel launch corridor with spectacular spotlights",
    zh: "带有壮观聚光灯的玩家隧道发射走廊"
  },
  "การแข่งขัน Counter-Strike 2 ระดับนานาชาติ ชิงเงินรางวัล 150,000 บาท ณ G-Speed Arena รามคำแหง 53 Dedicated LAN Server": {
    en: "International Counter-Strike 2 competition for 150,000 baht prize money at G-Speed Arena Ramkhamhaeng 53 Dedicated LAN Server",
    zh: "在G-Speed Arena Ramkhamhaeng 53专用局域网服务器举行的国际反恐精英2比赛，奖金为15万泰铢"
  },
  "รองชนะเลิศอันดับ 2 ร่วม": {
    en: "Joint 2nd Runner-up",
    zh: "联合亚军"
  },
  "CS2, Counter-Strike 2, G-Speed, ทัวร์นาเมนต์, แข่ง LAN, รามคำแหง 53, HLTV, Bangkok Showdown": {
    en: "CS2, Counter-Strike 2, G-Speed, Tournament, LAN Race, Ramkhamhaeng 53, HLTV, Bangkok Showdown",
    zh: "CS2、反恐精英2、G-Speed、锦标赛、局域网竞赛、Ramkhamhaeng 53、HLTV、曼谷摊牌"
  },
  "ห้ามใช้โปรแกรมโกง สคริปต์ช่วยเล่น หรือฉวยโอกาสจากข้อผิดพลาดของเกม หากตรวจพบปรับแพ้ทันที": {
    en: "Do not use cheaters, help scripts, or take advantage of game errors if it detects an immediate loss.",
    zh: "如果检测到直接损失，请勿使用作弊者、帮助脚本或利用游戏错误。"
  },
  "฿5,000 + หูฟังเกมมิ่ง ROG Delta S": {
    en: "5,000 + Rog Delta S Gaming Headset",
    zh: "5,000 + ROG Delta S游戏耳机"
  },
  "การแข่งขันอีสปอร์ตระดับประเทศ ชิงเงินรางวัลรวมกว่า ฿100,000 รวบรวมยอดฝีมือทั่วประเทศมาดวลความแม่นยำบนเวที LAN Final ณ G-Speed Arena รามคำแหง 53": {
    en: "The national esports competition for a total prize fund of more than 100,000 gathered experts across the country to duel with precision on the LAN Final stage at G-Speed Arena, Ramkhamhaeng 53.",
    zh: "全国电子竞技比赛总奖金超过10万人，全国各地的专家齐聚一堂，在G-Speed Arena （ Ramkhamhaeng 53 ）的局域网决赛阶段精确对决。"
  },
  "ลงทะเบียนหน้างาน & ตรวจสอบอุปกรณ์นักกีฬา (Player Check-in)": {
    en: "On-site registration & Player Check-in",
    zh: "现场注册和球员签到"
  },
  "รอบชิงชนะเลิศ Grand Final บนเวที Main Stage (Best of 5)": {
    en: "Grand Final on Main Stage (Best of 5)",
    zh: "主舞台总决赛（五强）"
  },
  "รอบคัดเลือกแบ่งกลุ่ม Group Stage (Best of 1)": {
    en: "Group Stage Qualifier (Best of 1)",
    zh: "小组赛阶段预选赛（满分1分）"
  },
  "G-SPEED VALORANT TOURNAMENT 2026 | ชิงเงินรางวัล ฿100,000": {
    en: "G-SPEED valorant tournament 2026 | $100,000 prize pool",
    zh: "2026年G-SPEED Valorant锦标赛| $ 100,000奖金池"
  },
  "รอบ 8 ทีม และ 4 ทีมสุดท้าย (Quarter & Semi-Finals)": {
    en: "Quarter & Semi-Finals",
    zh: "四分之一决赛和半决赛"
  },
  "VALORANT, GSpeed, ทัวร์นาเมนต์, แข่งเกม, อีสปอร์ต, รามคำแหง 53, LAN Final, 360Hz": {
    en: "Valorant, GSpeed, Tournament, Game Race, Esports, Ramkhamhaeng 53, LAN Final, 360Hz",
    zh: "Valorant ， GSpeed ，锦标赛，比赛，电子竞技， Ramkhamhaeng 53 ，局域网决赛， 360Hz"
  },
  "ภาพบรรยากาศการแข่งขัน Pan-Pacific Warfare Cup 2026 จัดขึ้นที่ ร้าน Gspeed Living Plus ดูภาพบรรกาศได้ที่นี่": {
    en: "Photo courtesy of the Pan-Pacific Warfare Cup 2026 held at Gspeed Living Plus. View photos here.",
    zh: "照片由Gspeed Living Plus举办的2026年泛太平洋战争杯提供。在此处查看照片。"
  },
  "4 นาทีในการอ่าน": {
    en: "4 minutes to read",
    zh: "4分钟阅读"
  },
  "การแข่งขัน VALORANT LAN Tournament สุดยิ่งใหญ่ ณ G-Speed Arena รามคำแหง 53 เงินรางวัลรวม 100,000 บาท สมัครด่วน 32 ทีมเท่านั้น": {
    en: "The great VALORANT LAN Tournament at G-Speed Arena Ramkhamhaeng 53 with a prize pool of 100,000 baht. Join now. 32 teams only.",
    zh: "G-Speed Arena Ramkhamhaeng 53的精彩VALORANT局域网锦标赛，奖金为10万泰铢。立即加入。仅限32支队伍。"
  },
  "เมษายน 2026": {
    en: "April 2026",
    zh: "2026年4月"
  },
  "฿50,000 พร้อมอุปกรณ์เกมมิ่งเกียร์ ROG": {
    en: "50,000 with Rog gaming gear",
    zh: "配备ROG游戏装备的50,000"
  },
  "บรรยากาศการแข่งขัน Pan-Pacific Warfare Cup 2026": {
    en: "Pan-Pacific Warfare Cup 2026 atmosphere",
    zh: "2026年泛太平洋战杯气氛"
  },
  "G-Speed ร่วมกับ ASUS ROG และ NVIDIA Thailand": {
    en: "G-Speed joins Asus Rog and NVIDIA Thailand",
    zh: "G-Speed加入华硕ROG和NVIDIA泰国"
  },
  "320+ คน (32 ทีมทั่วประเทศ)": {
    en: "320 + people (32 teams nationwide)",
    zh: "320多人（全国32个团队）"
  },
  "การได้ลงแข่งในสภาพแวดล้อมที่เครื่องสเปกแรง จอ 360Hz และเน็ตไม่กระตุกเลย ทำให้ผู้เล่นสามารถปลดปล่อยศักยภาพได้ 100% สมกับเป็นสนามแข่งระดับเวิลด์คลาส": {
    en: "Being able to compete in an environment where the 360Hz spectroscope and the net are not twitching at all, allowing players to unleash their potential 100% of the time, as if they were a world class race track.",
    zh: "能够在360Hz光谱仪和网络完全不抽搐的环境中竞争，让玩家能够100 ％释放他们的潜力，就好像他们是世界级的赛道一样。"
  },
  "฿80,000 พร้อมสิทธิ์แข่งรอบเอเชียแปซิฟิก": {
    en: "80,000 with Asia-Pacific rights",
    zh: "80,000人拥有亚太权利"
  },
  "Predator Gaming Thailand ร่วมกับ Krafton Inc.": {
    en: "Predator Gaming Thailand in partnership with Krafton Inc.",
    zh: "与Krafton Inc.合作的Predator Gaming Thailand"
  },
  "฿50,000 including ROG gaming gear": {
    en: "50,000 including Rog gaming gear",
    zh: "50,000 ，包括ROG游戏装备"
  },
  "G-Speed Esport Arena (เวทีกลางและบูทกิจกรรมค่ายเกม)": {
    en: "G-Speed Esport Arena (Center Stage & Game Camp Activity Boot)",
    zh: "G-Speed电子竞技场（中心舞台和比赛训练营活动靴）"
  },
  "กรกฎาคม 2026": {
    en: "July 2026",
    zh: "2026年7月"
  },
  "450+ คน (แฟนเกมและทีมสตรีมเมอร์)": {
    en: "450 + people (game fans and team streamers)",
    zh: "450多人（游戏粉丝和团队主播）"
  },
  "บรรยากาศในงานคึกคักตั้งแต่ช่วงเช้าด้วยกิจกรรม Fan Meeting พบปะคอสเพลย์เยอร์ในชุดตัวละครแอร์ดรอปสุดเท่ พร้อมจุดถ่าย���ูปโฟโต้บูธสามมิติ และแจกไอเทมโค้ดลิขสิทธิ์แท้ให้กับผู้เข้าร่วมงานทุกคน": {
    en: "The atmosphere at the event is lively from the morning with Fan Meeting activities, cosplayers in cool airdrop character costumes with three-dimensional photobooth photo spots, and give out authentic code items to all attendees.",
    zh: "活动的气氛从早上开始就充满活力，有粉丝会活动，穿着凉爽的空投人物服装和三维照相亭拍照点的角色扮演者，并向所有与会者分发正宗的代码项目。"
  },
  "การแข่งขันรอบออฟไลน์ไฟนอลดำเนินไปอย่างตื่นเต้นเร้าใจ มีการใช้ระบบ Observer บรอดแคสต์มืออาชีพพร้อมแคสเตอร์ชื่อดังมาพากย์สดในสตูดิโอบาร์ของร้าน ผู้ชนะเลิศได้รับสิทธิ์เป็นตัวแทนประเทศไทยไปลุยต่อในเวทีระดับนานาชาติ": {
    en: "The Offline Finals went on excitedly, using the professional Broadcast Observer system with the famous caster to be dubbed live in the shop's studio bar. The winner was entitled to represent Thailand on the international stage.",
    zh: "线下总决赛兴奋地继续进行，使用专业的广播观察者系统与著名的脚轮在商店的工作室酒吧现场配音。获胜者有权在国际舞台上代表泰国。"
  },
  "G-Speed เป็นพาร์ตเนอ���์ร้านเกมที่มีความพร้อมด้านระบบและสถานที่สูงมาก สามารถรองรับการบรอดแคสต์ระดับออฟฟิเชียลได้อย่างไร้ที่ติ": {
    en: "G-Speed is a game shop partner with very high system and location availability that can support office-level broadcasting flawlessly.",
    zh: "G-Speed是一家游戏商店合作伙伴，拥有非常高的系统和位置可用性，可以完美支持办公室级广播。"
  },
  "ค่ายเกมยักษ์ใหญ่ Krafton จับมือกับ Acer Predator Gaming เลือกใช้ศูนย์ G-Speed Esport Arena เป็นสถานที่จัดศึกใหญ่ THAILAND PREDATOR LEAGUE - PUBG BATTLEGROUNDS ประจำปี โดยมีนักล่าไก่ทั่วฟ้าเมืองไทยลงทะเบียนเข้าร่วมกว่า 64 สควอด": {
    en: "The gaming giant Krafton teamed up with Acer Predator Gaming to use the G-Speed Esport Arena as a venue for the annual Thailand Predator League - PUBG Battlegrounds, with over 64 squads of chicken hunters registered across the Thai sky.",
    zh: "游戏巨头卡夫顿与宏碁捕食者游戏公司合作，将G-Speed电子竞技场用作一年一度的泰国捕食者联盟-《绝地求生》战场（ PUBG Battlegrounds ）的场地，在泰国天空中注册了超过64支猎鸡队。"
  },
  "เวทีหลักกับการแข่งขันรอบตัดสินชิงตั๋วสู่เอเชีย": {
    en: "The main stage and the finals of the ticket to Asia",
    zh: "亚洲之旅门票的主舞台和决赛"
  },
  "G-Speed Esport Arena (โซนคาเฟ่และเวท��กลาง)": {
    en: "G-Speed Esport Arena (Cafe & Magic Zone)",
    zh: "G-Speed电子竞技场（咖啡馆和魔术区）"
  },
  "พิธีมอบถ้วยแชมป์และเงินรางวัลสนับสนุนจาก Predator": {
    en: "Champion's Cup Ceremony and Predator's Prize Money",
    zh: "冠军杯颁奖典礼和掠夺者奖金"
  },
  "ผู้เข้าแข่งขันสวมหูฟังตัดเสียงรบกวน วางแผนเอาตัวรอด": {
    en: "Contestants wear noise-cancelling headphones and plan to survive.",
    zh: "参赛者佩戴降噪耳机并计划生存。"
  },
  "มิถุนายน 2026": {
    en: "June 2026",
    zh: "2026年6月"
  },
  "ไอเทมแรร์มูลค่ารวมกว่า ฿120,000": {
    en: "Rare items worth a total of over 120,000",
    zh: "总价值超过12万的稀有道具"
  },
  "ความอบอุ่นของแฟนเกม Zone4 ที่มารวมตัวกันที่นี่ ทำให้เรารู้ว่าคอมมูนิตี้เกมไทยยังเหนียวแน่นและพร้อมสนับสนุนกันเสมอ": {
    en: "The warmth of Zone4 fans gathered here lets us know that the Thai gaming community is strong and supportive.",
    zh: "聚集在这里的Zone4粉丝的热情让我们知道，泰国游戏社区是强大而支持的。"
  },
  "280+ คน": {
    en: "280 + people",
    zh: "280人以上"
  },
  "ผู้ร่วมงานได้ร่วมประลองฝีมือในมินิทัวร์นาเมนต์ 1v1 และ 3v3 แบบกระชับมิตร พร้อมลุ้นรับแรร์ไอเทมและฟิกเกอร์ลิมิเต็ดที่มีเฉพาะในงานนี้เท่านั้น": {
    en: "Participants participated in friendly 1v1 and 3v3 mini tournaments with a chance to win exclusive rare items and limited figurines.",
    zh: "参与者参加了友好的1v1和3v3迷你锦标赛，有机会赢得专属稀有物品和限量小雕像。"
  },
  "งานรวมพลสาวกเกมต่อสู้ในตำนาน Zone4 โดยค่าย Electronics Extreme เนรมิตพื้นที่ G-Speed ให้กลายเป็นสถานที่จัดแฟนมีตติ้งสุดเอ็กซ์คลูซีฟ มีการเปิดเผยแผนการอัปเดตเซิร์ฟเวอร์และระบบคลาสใหม่อย่างเป็นทางการ": {
    en: "Zone4 legendary fighting game discipleship gathering by Electronics Extreme Camp has created the G-Speed area to become an exclusive fan meeting place. The new server and class system update plans have been officially revealed.",
    zh: "Electronics Extreme Camp的Zone4传奇格斗游戏门徒聚会打造了G-Speed专区，成为粉丝专属聚会场所，全新服务器和职业系统更新方案已正式揭晓。"
  },
  "G-Speed Esport Arena (โซน Standard Gaming Arena)": {
    en: "G-Speed Esport Arena (Standard Gaming Arena Zone)",
    zh: "G-Speed电子竞技场（标准游戏竞技场区）"
  },
  "฿25,000 พร้อมมงกุฎและไอเทมปีกถาวร": {
    en: "25,000 with crown and wing items",
    zh: "25,000件带表冠和机翼的物品"
  },
  "แฟนเกม Zone4 ร่วมทดลองเล่นแพตช์ใหม่ในโซนเครื่อง VIP": {
    en: "Zone4 fans try out the new patches in the VIP zone.",
    zh: "Zone4粉丝在VIP区试用新补丁。"
  },
  "การแจกของรางวัลสุดพิเศษและของที่ระลึกจากผู้บริหารค่าย": {
    en: "Exclusive giveaways and souvenirs from camp administrators",
    zh: "营地管理员提供的独家赠品和纪念品"
  },
  "พฤษภาคม 2026": {
    en: "May 2026",
    zh: "2026年5月"
  },
  "งานแข่งขันที่เต็มไปด้วยรอยยิ้ม เสียงเพลง และมิตรภาพของเหล่านักเต้นทั่วประเทศที่มารวมตัวกัน": {
    en: "A competition filled with smiles, music, and the friendship of dancers all over the country.",
    zh: "这场比赛充满了微笑、音乐和全国舞者的友谊。"
  },
  "ศึกประชันความเร็วของนิ้วมือและจังหวะดนตรีกับ AUDITION LADY TOURNAMENT ครั้งที่ 7 รายการแข่งขันที่เปิดโอกาสให้นักเต้นสาวสวยทั่วประเทศมาชิงตำแหน่งราชินีฟลอร์เต้น": {
    en: "Finger speed and rhythm battle with the 7th audition lady tournament, a competition that allows beautiful dancers all over the country to win the title of Floor Queen.",
    zh: "第7届试镜女子锦标赛的手指速度和节奏比赛，让全国各地的美丽舞者赢得地板女王的称号。"
  },
  "ร้านเกม G-Speed ได้จัดเตรียมคีย์บอร์ดกลไกสวิตช์ความเร็วสูงและหูฟังตัดเสียง เพื่อให้นักกีฬาได้ยินบีตดนตรีและกดปุ่ม Perfect ได้อย่างแม่นยำที่สุด": {
    en: "G-Speed Game Store has provided keyboards, mechanics, high-speed switches, and mute headphones to enable athletes to hear music beats and press the Perfect key as accurately as possible.",
    zh: "G-Speed Game Store提供键盘、机械、高速开关和静音耳机，使运动员能够尽可能准确地听到音乐节拍并按下Perfect键。"
  },
  "ความเร็วในการรัวปุ่มคีย์บอร์ดระดับเสี้ยววินาที": {
    en: "Crash speed, millisecond level keyboard keys",
    zh: "崩溃速度，毫秒级键盘键"
  },
  "ผู้ได้รับรางวัลชนะเลิศรับมอบมงกุฎและเงินรางวัล": {
    en: "The Grand Prize Winner receives the crown and the prize money.",
    zh: "大奖得主将获得王冠和奖金。"
  },
  "กิจกรรม เปิดตัวเกม ZONE4": {
    en: "ZONE4 Game Launch Event",
    zh: "ZONE4游戏发布活动"
  },
  "เมษายน 2013": {
    en: "April 2013",
    zh: "2013年4月"
  },
  "150+ คน": {
    en: "150 + people",
    zh: "150人以上"
  },
  "บรรยากาศงานเปิดตัวเกม ZONE4 ที่ร้าน GSpeed Living Plus 2013": {
    en: "Atmosphere of the launch of ZONE4 at GSpeed Living Plus 2013",
    zh: "在GSpeed Living Plus 2013上推出ZONE4的氛围"
  },
  "2 นาทีในการอ่าน": {
    en: "2 minutes to read",
    zh: "2分钟阅读"
  },
  "บรรยากาศ งานแข่ง Pubg Chicken Dinner by zowie": {
    en: "Pubg Chicken Dinner by zowie",
    zh: "Zowie的Pubg鸡肉晚餐"
  },
  "การแข่งขันกระชับมิตรประจำเดือนของชุมชนร้านเกม G-Speed ชิงเงินรางวัลและชั่วโมงเล่นเกมฟรี บรรยากาศสนุกสนานและเป็นกันเองตลอดวันหยุดสุดสัปดาห์": {
    en: "Monthly friendly tournaments of the G-Speed gaming community, prize money and free game hours, fun and friendly atmosphere throughout the weekend.",
    zh: "G-Speed游戏社区的每月友好锦标赛、奖金和免费游戏时间、整个周末的乐趣和友好的氛围。"
  },
  "กิจกรรม เปิดตัวเกม ZONE4 - zone4 08": {
    en: "ZONE4-zone4 game launch event 08",
    zh: "ZONE4-zone4游戏发布活动08"
  },
  "มีนาคม 2013": {
    en: "March 2013",
    zh: "2013年3月"
  },
  "กิจกรรมคอมมูนิตี้รายเดือนที่เปิดให้ลูกค้าประจำและแฟนคลับได้มาพบปะและประลองฝีมือกันอย่างเป็นกันเอง": {
    en: "A monthly community event open to regular customers and fans to meet and compete in a friendly manner.",
    zh: "每月一次的社区活动，向常客和粉丝开放，以友好的方式见面和比赛。"
  },
  "ลูกค้าหมุนเวียน 800+ คน/วัน": {
    en: "800 + active customers/day",
    zh: "每天有超过800个活跃客户"
  },
  "งานแข่ง Pubg Chicken Dinner by zowie": {
    en: "Pubg Chicken Dinner by zowie",
    zh: "Zowie的Pubg鸡肉晚餐"
  },
  "G-Speed Esport Arena ทุกโซนบริการ": {
    en: "G-Speed Esport Arena All Service Zones",
    zh: "G-Speed电子竞技场所有服务区"
  },
  "เราใส่ใจในทุกรายละเอียด ทั้งเก้าอี้ที่นั่งสบายตลอดคืน ระบบแอร์ฟอกอากาศ PM2.5 และเมนูอาหารปรุงสดที่ส่งตรงถึงโต๊ะ": {
    en: "We pay attention to every detail, including comfortable chairs throughout the night, PM2.5 air purification system, and fresh-cooked dishes delivered directly to the table.",
    zh: "我们注重每一个细节，包括整晚舒适的椅子、PM2.5空气净化系统，以及直接送到餐桌上的新鲜烹饪的菜肴。"
  },
  "เก็บบรรยากาศยามค่ำคืนของ G-Speed Esport Arena ศูนย์รวมเกมเมอร์ที่เปิดให้บริการตลอด 24 ชั่วโมง ไฮไลต์คือช่วงสุดสัปดาห์ที่มีปาร์ตี้เล่นเกมกับกลุ่มเพื่อน เครื่องเต็ม 100% พร้อมบริการสั่งอาหาร เครื่องดื่มร้อน-เย็นจากบาร์เสิร์ฟถึงโต๊ะอย่างรวดเร็ว": {
    en: "Capture the nightlife of the G-Speed Esport Arena, a 24-hour gamer hub. Highlights include a weekend of parties, games with a group of friends, 100% full machines, and fast food, hot and cold drinks from the bar to the table.",
    zh: "捕捉24小时游戏中心G-Speed Esport Arena的夜生活。亮点包括周末派对、与一群朋友的游戏、100%全功能机器，以及从酒吧到餐桌的快餐、冷热饮料。"
  },
  "฿80,000 พร้อมตั๋วตัวแทนเอเชีย": {
    en: "80,000 with Asia agent ticket",
    zh: "80,000与亚洲代理工单"
  },
  "ทีมข่าวกิจกรรม G-Speed": {
    en: "G-Speed Activity News Team",
    zh: "G-Speed活动新闻团队"
  },
  "รวมภาพความมันส์งานแข่ง PUBG Predator League 2026 | G-Speed Arena": {
    en: "PUBG Predator League 2026 Overview | G-Speed Arena",
    zh: "PUBG Predator League 2026概览| G-Speed竞技场"
  },
  "การจัดแข่งบนฮาร์ดแวร์มาตรฐาน Pro Circuit ช่วยดึงศักยภาพนักกีฬาอีสปอร์ตไทยได้อย่างเต็มที่": {
    en: "Organizing the race on Pro Circuit standard hardware helps to capture the full potential of Thai esports athletes.",
    zh: "在Pro Circuit标准硬件上组织比赛有助于充分发挥泰国电子竞技运动员的潜力。"
  },
  "450+ คน": {
    en: "450 + people",
    zh: "450人以上"
  },
  "PUBG, Predator League, แข่งเกม, G-Speed, Esports Arena, ทัวร์นาเมนต์": {
    en: "PUBG, Predator League, Gaming, G-Speed, Esports Arena, Tournaments",
    zh: "《绝地求生》、捕食者联盟、游戏、G-Speed、电子竞技场、锦标赛"
  },
  "เกาะติดภาพบรรยากาศการแข่งขัน PUBG Predator League ศึกชิงแชมป์เงินรางวัล 80,000 บาท ณ ศูนย์ G-Speed Esport Arena": {
    en: "Attached to the image of the PUBG Predator League tournament, the 80,000 baht championship battle at the G-Speed Esport Arena center.",
    zh: "在G-Speed Esport Arena中心举行的80,000泰铢冠军争夺战附在PUBG Predator League锦标赛的形象上。"
  },
  "สิ้นสุดลงอย่างยิ่งใหญ่สำหรับศึกใหญ่แห่งปี THAILAND PREDATOR LEAGUE 2026 ณ ศูนย์ G-Speed Esport Arena โดยมีทีมระดับหัวแถวของประเทศกว่า 32 ทีมตบเท้าประลองฝีมือชิงเงินรางวัลรวมกว่า ฿80,000 บาท": {
    en: "Great end for the big battle of the year, Thailand predator league 2026 at the G-Speed Esport Arena center, with more than 32 country's top teams slapping a total prize pool of more than 80,000 baht.",
    zh: "在G-Speed Esport Arena中心举办的泰国捕食者联赛2026是年度大战的最佳结局，超过32支国家顶级球队总奖金超过8万泰铢。"
  },
  "ตลอดการขับเคี่ยว 2 วันเต็ม โซนเวที Main Stage เต็มไปด้วยเสียงเชียร์ดังกึกก้อง แฟนคลับมาร่วมชมทั้งติดขอบเวทีและผ่านจอถ่ายทอดสด LED 4K ขนาดยักษ์ใจกลางร้าน": {
    en: "Over the course of two full days, the Main Stage zone was filled with loud cheers. Fans came to watch both on the edge of the stage and through the giant 4K led live screen in the center of the store.",
    zh: "在整整两天的时间里，主舞台区充满了欢呼声，粉丝们来到舞台边缘，通过商店中心的巨型4K LED直播屏幕观看。"
  },
  "การแข่งขันรอบสุดท้ายเป็นไปอย่างระทึกใจ โดยทีมแชมป์สามารถเอาชีวิตรอดและเก็บคะแนนคิลสูงสุดในวงสุดท้าย คว้าถ้วยแชมป์และสิทธิ์เข้าร่วมแข่งขันระดับภูมิภาคเอเชียแปซิฟิกต่อไป": {
    en: "The final round was thrilling, with the championship team able to survive and collect the highest kill points in the final band, winning the championship trophy and continuing to participate in the Asia-Pacific region.",
    zh: "最后一轮是激动人心的，冠军球队能够生存下来，并在决赛乐队中获得最高的击杀点，赢得冠军奖杯，并继续参加亚太地区的比赛。"
  },
  "5 กันยายน 2026": {
    en: "September 5, 2026",
    zh: "2026年9月5日"
  },
  "บรรยากาศผู้เข้าแข่งขันและหน้าจอคอม 360Hz บนเวที": {
    en: "Participant atmosphere and 360Hz computer screen on stage",
    zh: "舞台上的参与者氛围和360Hz电脑屏幕"
  },
  "แฟนคลับส่งเสียงเชียร์รอบชิงชนะเลิศ": {
    en: "The fans cheered on the final.",
    zh: "球迷们在决赛中欢呼雀跃。"
  },
  "พิธีมอบเงินรางวัลและของที่ระลึกจาก Predator": {
    en: "Prize Ceremony and Predator Souvenirs",
    zh: "颁奖典礼和捕食者纪念品"
  },
  "กองบรรณาธิการ GLP": {
    en: "GLP Editorial Board",
    zh: "GLP编辑委员会"
  },
  "ไอเทมแรร์มูลค่า ฿50,000": {
    en: "Rare item worth 50,000",
    zh: "价值5万的稀有道具"
  },
  "GLP จับมือ Electronics Extreme จัดงาน Zone4 แจกไอเทมแท้ | G-Speed": {
    en: "GLP joins hands with Electronics Extreme to host Zone4 giveaway | G-Speed",
    zh: "GLP携手Electronics Extreme推出Zone4赠品| G-Speed"
  },
  "ภาพบรรยากาศงาน Electronics Extreme - Zone4 Fan Meeting กิจกรรมแจกไอเทมโค้ดและการแข่งขันมินิแมตช์ ณ G-Speed": {
    en: "Photos of Electronics Extreme - Zone4 Fan Meeting, Item Code Giveaway and Mini-Match at G-Speed",
    zh: "Electronics Extreme - Zone4粉丝会议、商品代码赠送和G-Speed迷你比赛的照片"
  },
  "Zone4, Electronics Extreme, แฟนมีตติ้ง, แจกไอเทม, ร้านเกม, G-Speed": {
    en: "Zone4, Electronics Extreme, Fan Meeting, Item Giveaway, Game Store, G-Speed",
    zh: "Zone4, Electronics Extreme,粉丝会议,物品赠送,游戏商店, G-Speed"
  },
  "ความอบอุ่นของแฟนเกม Zone4 ยังคงเหนียวแน่น และพื้นที่ของ G-Speed ตอบโจทย์งานมีตติ้งได้อย่างสมบูรณ์แบบ": {
    en: "Zone4 fans' warmth remains tight, and the G-Speed space perfectly meets their meeting needs.",
    zh: "Zone4风扇的温暖仍然紧凑， G-Speed空间完美满足了他们的需求。"
  },
  "ผู้เข้าร่วมงานทุกคนได้รับแพ็กเกจไอเทมโค้ดระดับ Exclusive พร้อมลุ้นรับเสื้อแจ็กเก็ตและของสะสมลิขสิทธิ์แท้จากเกาหลี": {
    en: "All attendees received an Exclusive coded item package with a chance to win authentic Korean jackets and collectibles.",
    zh: "所有与会者都获得了独家编码物品套餐，有机会赢取正宗的韩国夹克和收藏品。"
  },
  "งานนี้นับเป็นอีกหนึ่งเครื่องยืนยันว่า G-Speed ไม่ได้เป็นเพียงร้านเกม แต่เป็นฮับจัดอีเวนต์และศูนย์รวมคอมมูนิตี้เกมเมอร์ที่พร้อมที่สุดของกรุงเทพฯ": {
    en: "This event confirms that G-Speed is not just a game store, but an event hub and Bangkok's most equipped community gamer hub.",
    zh: "此次活动证实了G-Speed不仅仅是一家游戏商店，而是一个活动中心和曼谷设备最齐全的社区游戏玩家中心。"
  },
  "Electronics Extreme ร่วมกับ G-Speed Arena จัดกิจกรรมสุดพิเศษเพื่อเอาใจแฟนเกมไฟท์ติ้งระดับตำนาน Zone4 ภายในงานมีการประกวดคอมมูนิตี้และมินิทัวร์นาเมนต์กระชับมิตร": {
    en: "Electronics Extreme and G-Speed Arena organized a special event to please fans of the legendary fighting game Zone4. The event featured a community contest and a friendly mini tournament.",
    zh: "Electronics Extreme和G-Speed Arena组织了一场特别活动，以取悦传奇格斗游戏Zone4的粉丝。该活动以社区比赛和友谊迷你锦标赛为特色。"
  },
  "การประลองฝีมือแมตช์พิเศษบนเวที": {
    en: "Special Match Skill Stages",
    zh: "特殊比赛技能阶段"
  },
  "ผู้ร่วมงานลงทะเบียนรับถุงของขวัญและไอเทมโค้ด": {
    en: "Participants sign up for gift bags and item codes.",
    zh: "参与者注册礼品袋和商品代码。"
  },
  "28 สิงหาคม 2026": {
    en: "August 28, 2026.",
    zh: "2026年8月28日。"
  },
  "ทีมเทคนิคและวิศวกรรมไอที": {
    en: "Technical and Engineering IT Team",
    zh: "技术和工程IT团队"
  },
  "เราไม่เคยหยุดพัฒนามาตรฐาน เพื่อมอบประสบการณ์เกมมิ่งที่ดีที่สุดและลื่นที่สุดให้แก่ลูกค้าทุกคน": {
    en: "We never stop developing standards to deliver the best and smoothest gaming experience for all our customers.",
    zh: "我们从不停止制定标准，为所有客户提供最佳、最流畅的游戏体验。"
  },
  "อัปเกรดมูลค่ากว่า 5 ล้านบาท": {
    en: "Upgrades worth over 5 million baht",
    zh: "价值超过500万泰铢的升级"
  },
  "เปิดบริการแล้วทุกที่นั่ง": {
    en: "Open to all seats",
    zh: "向所有座位开放"
  },
  "อัปเกรดสเปกใหม่ RTX 40 Series จอ 360Hz ทุกล็อต | G-Speed Esport": {
    en: "Upgrade New Specs RTX 40 Series 360Hz Display All Lots | G-Speed Esport",
    zh: "升级全新规格RTX 40系列360Hz显示器所有批次| G-Speed Esport"
  },
  "สเปกคอมร้านเกม, RTX 4080, จอ 360Hz, ร้านเกมสเปกแรง, G-Speed Arena": {
    en: "Gaming Shop Specs, RTX 4080, 360Hz Screen, Gaming Shop Specs, G-Speed Arena",
    zh: "游戏商店规格， RTX 4080 ， 360Hz屏幕，游戏商店规格， G-Speed Arena"
  },
  "G-Speed Arena ยกเครื่องสเปกคอมใหม่ยกแผง ขุมพลัง GeForce RTX 40 Series พร้อมจอ BenQ 360Hz Fast-IPS เน็ต 10Gbps": {
    en: "G-Speed Arena revamped the GeForce RTX 40 Series with BenQ 360Hz Fast-IPS Net 10Gbps display.",
    zh: "G-Speed Arena使用明基360Hz Fast-IPS Net 10Gbps显示屏改进了GeForce RTX 40系列。"
  },
  "จับคู่กับซีพียู Intel Core i7 / i9 เจนเนอเรชันใหม่ แรม 32GB DDR5 ความเร็วสูง 6000MHz และหน้าจออีสปอร์ต BenQ ZOWIE 360Hz Fast-IPS ที่ให้การตอบสนอง 0.5ms คมชัดทุกการเคลื่อนไหว": {
    en: "Paired with a new generation Intel Core i7/i9 CPU, high-speed 32GB DDR5 6000MHz RAM, and a BenQ ZOWIE 360Hz Fast-IPS e-sports screen that delivers a crisp 0.5ms response every move.",
    zh: "搭配新一代英特尔酷睿i7/i9处理器、高速32GB DDR5 6000MHz RAM和明基ZOWIE 360Hz Fast-IPS电子竞技屏幕，每次移动都能提供清晰的0.5毫秒响应。"
  },
  "เพื่อตอกย้ำความเป็นผู้นำศูนย์กีฬาอีสปอร์ตระด��บเวิลด์คลาส G-Speed Esport Arena ทุ่มงบประมาณกว่า 5 ล้านบาท ปรับปรุงเครื่องคอมพิวเตอร์ทุกล็อตให้เป็นขุมพลังล่าสุด NVIDIA GeForce RTX 40 Series": {
    en: "To reinforce its leadership, Esports Center World Class G-Speed Esport Arena has invested more than 5 million baht, improving all PC lots to be the latest powerhouse, the NVIDIA GeForce RTX 40 Series.",
    zh: "为了巩固其领导地位， Esports Center World Class G-Speed Esport Arena已投资超过500万泰铢，改进了所有PC批次，使其成为NVIDIA GeForce RTX 40系列的最新动力源泉。"
  },
  "หน้าจอ 360Hz ที่ผ่านการปรับแต่งค่าสีสำหรับโปรเพลเยอร์": {
    en: "360Hz color-optimized display for Pro Player",
    zh: "适用于专业播放器的360Hz彩色优化显示屏"
  },
  "เกมอื่นๆ": {
    en: "More games",
    zh: "更多游戏"
  },
  "เคสคอมพิวเตอร์และระบบระบายความร้อนด้วยน้ำสุดเท่": {
    en: "Cool computer case and water-cooling system",
    zh: "冷却电脑机箱和水冷系统"
  },
  "16+ ปี": {
    en: "16 years old",
    zh: "- 十六年"
  },
  "นอกจากนี้ ระบบ Diskless Server ยังได้รับการอัปเกรดเป็น NVMe Gen5 Multi-tier Caching ร่วมกับระบบเน็ตเวิร์ก Dual 10Gbps Fiber Optic ช่วยให้การโหลดเกมและการเปิดเครื่องเร็วขึ้นกว่าเดิม 300%": {
    en: "The Diskless Server system has also been upgraded to NVMe Gen5 Multi-tier Caching in conjunction with the Dual 10Gbps Fiber Optic network, enabling 300% faster game loading and power-on times.",
    zh: "无盘服务器系统还与双10Gbps光纤网络一起升级到NVMe Gen5多层缓存，使游戏加载和开机时间加快300%。"
  },
  "มาตรฐานความถูกต้อง โปร่งใ�� และปลอดภัย": {
    en: "Standards for accuracy, transparency and safety",
    zh: "准确性、透明度和安全性标准"
  },
  "ยึดหลักร้านเกมสีขาว ได้รับใบอนุญาตถูกต้อง 100% ปลอดบุหรี่และโปร่งใส": {
    en: "Based on the principle, the white game shop is 100% licensed, non-smoking and transparent.",
    zh: "基于这一原则，白色游戏商店是100%许可、禁烟和透明的。"
  },
  "สิ่งแวดล้อมปลอดภัยและได้มาตรฐาน": {
    en: "Environmentally safe and up to standard",
    zh: "环保安全且符合标准"
  },
  "ระบบแฟรนไชส์ออกแบบโดยคำนึงถึงผลตอบแทนของผู้ลงทุน ควบคุมต้นทุนได้จริง": {
    en: "The franchise system is designed with the return of investors in mind, controlling the actual cost.",
    zh: "特许经营系统的设计考虑了投资者的回报，控制了实际成本。"
  },
  "คืนทุนไว พาร์ตเนอร์เติบโตยั่งยืน": {
    en: "Return capital for sustainable growth with viPartners",
    zh: "通过viPartners实现可持续增长的回报资本"
  },
  "ร้านเกมสีขาว ปลอดภัยสำหรับเยาวชน": {
    en: "The White Shop is safe for teens.",
    zh: "白色商店对青少年来说是安全的。"
  },
  "ระบบกล้องวงจรปิด CCTV Full HD บันทึก 30 วัน": {
    en: "CCTV Surveillance System Full HD 30-day recording",
    zh: "闭路电视监控系统全高清30天录制"
  },
  "G-Speed ทุกสาขาผ่านการรับรองและตรวจสอบตามพระราชบัญญัติภาพยนตร์และวีดิทัศน์ ได้รับใบอนุญาตประกอบกิจการร้านเกมอย่างถูกต้องจากกระทรวงวัฒนธรรม ใช้ระบบปฏิบัติการ Windows และลิขสิทธิ์เกมแท้ 100% หมดกังวลเรื่องปัญหาลิขสิทธิ์": {
    en: "All G-Speed branches are certified and audited in accordance with the Film and Video Act, have a valid gaming store license from the Ministry of Culture, use the Windows operating system and copyright 100% genuine games, no worries about copyright issues.",
    zh: "所有G-Speed分支机构均根据“电影和视频法”进行认证和审计，拥有文化部颁发的有效游戏商店许可证，使用Windows操作系统和版权100 ％正版游戏，无需担心版权问题。"
  },
  "ใบอนุญาตสถานประกอบการถูกต้องตามกฎหมาย": {
    en: "Legal Establishment Permit",
    zh: "合法营业执照"
  },
  "คำนวณงบลงทุน & วางระบบร้าน": {
    en: "Calculate investment budget & set up store system",
    zh: "计算投资预算并建立门店系统"
  },
  "ร่วมเป็นพาร์ตเนอร์แฟรนไชส์กับเรา": {
    en: "Become a Franchise Partner",
    zh: "成为特许经营合作伙伴"
  },
  "ขยายธุรกิจสู่ Esport Arena เต็มรูปแบบ รองรับการจัดแข่งขันระดับประเทศร่วมกับค่ายเกมใ����ญ่": {
    en: "Expand into a full-fledged Esport Arena, supporting national tournaments in conjunction with gaming camps.",
    zh: "扩展成为一个成熟的电子竞技场，与游戏营地一起支持全国锦标赛。"
  },
  "พิธีเปิดตัว GLP Flagship Arena รามคำแหง 53": {
    en: "Launch Ceremony of GLP Flagship Arena Ramkhamhaeng 53",
    zh: "GLP旗舰竞技场Ramkhamhaeng 53启动仪式"
  },
  "8 ���าขา": {
    en: "8. Legs",
    zh: "8.腿"
  },
  "ศูนย์กีฬาอีสปอร์ตสาขาเรือธงมาตรฐานสากล รองรับเวทีแข่งขัน 5v5 สเปก RTX 4080 SUPER และจอ 360Hz": {
    en: "The international flagship e-sports center supports 5v5 arena, RTX 4080 super specs and 360Hz screen.",
    zh: "国际旗舰电子竞技中心支持5v5竞技场、RTX 4080超级规格和360Hz屏幕。"
  },
  "เปิดตัวระบบ Cloud Diskless & Franchise Model": {
    en: "Cloud Diskless & Franchise Model Launched",
    zh: "推出云无盘和特许经营模式"
  },
  "บุกเบิกระบบเซิร์ฟเวอร์แบบไร้ฮาร์ดดิสก์ความเร็ว 10Gbps พร้อมระบบควบคุมบัญชีและสต๊อกคลาวด์": {
    en: "Pioneering 10Gbps hard diskless server system with account control and stock cloud",
    zh: "具有帐户控制和股票云的先锋10Gbps无盘服务器系统"
  },
  "พัฒนาการสู่ Full Esport Arena มาตรฐานทัวร์นาเมนต์": {
    en: "Improvement to Full Esport Arena Tournament Standard",
    zh: "完整电子竞技场锦标赛标准的改进"
  },
  "การขยายตัวสู่เครือข่าย 8 สาขา และสมาชิกกว่า 52,000 คน": {
    en: "Expansion into a network of 8 branches and over 52,000 members",
    zh: "扩展到拥有8个分支机构和超过52,000名会员的网络"
  },
  "ปรับเปลี่ยนโครงสร้างร้านอินเทอร์เน็ตคาเฟ่เดิมสู่สนามประลองเกมพร้อมโซนสตรีมเมอร์และเวทีแข่งขัน": {
    en: "Transform your old internet cafe into a gaming arena with a streamer zone and arena.",
    zh: "将您的旧网吧改造成带有流媒体区和竞技场的游戏竞技场。"
  },
  "เชื่อมต่อโครงข่ายเคเบิลใยแก้วนำแสงความเร็วสูง 10Gbps พร้อมระบบเราเตอร์สำรอง Ping ต่ำกว่า 2ms": {
    en: "Connect 10Gbps high speed fiber optic cable network with ping backup router system under 2ms.",
    zh: "将10Gbps高速光缆网络连接到2ms以下的ping备用路由器系统。"
  },
  "ร่วมมือกับ NVIDIA Thailand ในการติดตั้งการ์ดจอ GeForce RTX 40 Series สำหรับสนามแข่งมาตรฐาน": {
    en: "Collaborate with NVIDIA Thailand to install GeForce RTX 40 Series graphics cards for standard racetracks.",
    zh: "与NVIDIA泰国合作，为标准赛道安装GeForce RTX 40系列显卡。"
  },
  "ชุดอุปกรณ์เมนบอร์ดและการ์ดจอ ASUS ROG มอบความเสถียรสูงสุดตลอดการแข่งขันยาวนาน 24 ชม.": {
    en: "The Asus Rog motherboard kit and graphics card provide maximum stability throughout the 24-hour race.",
    zh: "华硕ROG主板套件和显卡在24小时比赛中提供了最大的稳定性。"
  },
  "ติดตั้งเก้าอี้เกมมิ่งสรีรศาสตร์ Secretlab Titan Evo รองรับสรีระนักกีฬาอีสปอร์ตทุกตำแหน่งที่นั่ง": {
    en: "Equipped with a Secretlab Titan Evo ergonomic gaming chair to support esports athletes in all seating positions.",
    zh: "配备Secretlab Titan Evo符合人体工程学的游戏椅，为所有座位位置的电子竞技运动员提供支持。"
  },
  "ขยายสาขาครอบคลุมย่านสถาบันการศึกษาและศูนย์การค้า พร้อมให้บริการเกมเมอร์ตลอด 24 ชั่วโมง": {
    en: "Expand branches to cover neighborhoods, educational institutions, and shopping centers. Available for gamers 24 hours a day.",
    zh: "扩展分支机构，覆盖街区、教育机构和购物中心。全天候为游戏玩家提供服务。"
  },
  "ศูนย์ควบคุมกล้องวงจรปิด CCTV Full HD 24 ชม.": {
    en: "CCTV CCTV Full HD 24hrs Control Centre",
    zh: "闭路电视闭路电视全高清24小时控制中心"
  },
  "โซนปลอดบุหรี่ & ระบบอากาศ Clean Air Circulation": {
    en: "Non-Smoking Zone & Clean Air Circulation",
    zh: "禁烟区和清洁空气循环"
  },
  "ผ่านการตรวจเยี่ยมและรับรองมาตรฐานสถานประกอบกิจการตาม พ.ร.บ. ภาพยนตร์และวีดิทัศน์": {
    en: "Has passed the inspection and certification of the workplace according to the Film and Video Act.",
    zh: "已通过《电影和视频法》规定的工作场所检查和认证。"
  },
  "ระบบกล้องวงจรปิดครอบคลุมทุกจุดภายในและภายนอกร้าน จัดเก็บข้อมูลย้อนหลัง 30 วันเพื่อความปลอดภัยสูงสุด": {
    en: "CCTV systems cover all points inside and outside the data store for the past 30 days for maximum security.",
    zh: "闭路电视系统在过去30天内覆盖了数据存储区内外的所有点，以实现最大的安全性。"
  },
  "ตรวจรับรองมาตรฐานร้านเกมสีขาวจากหน่วยงานภาครัฐ": {
    en: "Certification of white game shop standards from government agencies",
    zh: "政府机构白色游戏店标准认证"
  },
  "แยกส่วน 3 ชิ้น ขนส่งสะดวก ประกอบหน้างานภายใน 20 นาที": {
    en: "Disassemble 3 parts, convenient transportation, assemble on site within 20 minutes.",
    zh: "拆卸3个零件，运输方便， 20分钟内现场组装。"
  },
  "ร้านเกมปลอดบุหรี่ 100% พร้อมระบบฟอกอากาศและระบายอากาศหมุนเวียนมาตรฐานสากล": {
    en: "100% smoke-free game shop with international standard air purification and ventilation system",
    zh: "100%无烟游戏店，配备国际标准的空气净化和通风系统"
  },
  "โต๊ะคอมพิวเตอร์เกมมิ่ง 2 ที่นั่ง GLP Double Station โครงเหล็กคาร์บอน": {
    en: "GLP Double Station 2 Seater Gaming Computer Table Carbon Steel Frame",
    zh: "GLP双工位2座博彩电脑桌碳钢框架"
  },
  "ระบบแคชเชียร์และพนักงานคัดกรองเวลาให้บริการเยาวชนอย่างเคร่งครัดตามกรอบกฎหมาย": {
    en: "The cashier system and staff screen youth service hours strictly according to the legal framework.",
    zh: "收银系统和工作人员严格按照法律框架筛选青少年服务时间。"
  },
  "การคัดกรองเวลาและดูแลเยาวชนตามกฎหมาย": {
    en: "Time screening and legal supervision of juveniles",
    zh: "对未成年人的时间筛选和法律监督"
  },
  "โต๊ะเกมมิ่งเหล็กคาร์บอนยาว 2.4 ม. พร้อมรางร้อยสายไฟและฉากกั้นกลาง": {
    en: "2.4m long carbon steel gaming table with wiring rails and a central partition",
    zh: "2.4米长碳钢游戏桌配有配线栏杆和中央隔断"
  },
  "7 - 10 วันทำการ": {
    en: "7 - 10 business days",
    zh: "7 - 10个工作日"
  },
  "G-Speed Pro Racing PU Leather (ปรับเอน 160°)": {
    en: "G-Speed Pro Racing PU Leather (160° lean)",
    zh: "G-Speed Pro Racing PU皮革（ 160°倾斜）"
  },
  "รับประกันโครงสร้าง 5 ปี และระบบไฟ 3 ปี On-site Service": {
    en: "5 year structure warranty and 3 year lighting system On-site Service",
    zh: "5年结构保修和3年照明系统上门服务"
  },
  "โครงเหล็กกล้าคาร์บอนพ่นสี Powder Coat + หน้าท็อป HPL กันน้ำและรอยขีดข่วน + รางร้อยสายไฟแยก High/Low Voltage": {
    en: "Carbon steel frame with powder coat paint + Water and scratch resistant HPL top + High/Low Voltage isolation trunking",
    zh: "碳钢框架，带粉末涂料+防水和防刮HPL顶部+高/低压隔离线槽"
  },
  "โต๊ะแถวยาว 4.8 ม. โครงสร้างเสาคานรับน้ำหนักพิเศษ ช่องเก็บสายไฟเมน": {
    en: "4.8m row table Column structure, extra load beam, main cable compartment",
    zh: "4.8米行表柱结构、额外载荷梁、主电缆舱"
  },
  "7 - 12 วันทำการ": {
    en: "7 - 12 business days",
    zh: "7 - 12个工作日"
  },
  "G-Speed Pro Racing PU Leather (พนักพิงปรับสรีระ)": {
    en: "G-Speed Pro Racing PU Leather",
    zh: "G-Speed Pro Racing PU皮革"
  },
  "โครงสร้างเสาคานคู่รับน้ำหนักพิเศษ แยกส่วนขนย้าย 4 แพ็กเกจ": {
    en: "Column structure, double beam, special load bearing, separated, transported in 4 packages",
    zh: "立柱结构，双梁，特殊承重，分离， 4包运输"
  },
  "แถวคอมพิวเตอร์เกมมิ่ง 4 ที่นั่ง GLP Quad Station แถวยาวมาตรฐาน": {
    en: "4 Seater Computer Gaming Row GLP Quad Station Standard Long Row",
    zh: "4座电脑Gaming Row GLP四站标准长排"
  },
  "เกาะคอมพิวเตอร์ 6 ที่นั่ง GLP Island 6 พร้อมเสาเดินสายไฟกลาง": {
    en: "6 seater computer island GLP Island 6 with central wiring pole",
    zh: "6座电脑岛GLP岛6带中央接线柱"
  },
  "G-Speed Pro Racing PU Leather (เก้าอี้เกมมิ่ง 6 ตัว)": {
    en: "G-Speed Pro Racing PU Leather (6 Gaming Chairs)",
    zh: "G-Speed Pro Racing PU皮革（ 6把游戏椅）"
  },
  "โครงสร้างเสาคานเหล็กรับน้ำหนักพิเศษ + หน้าท็อปโมดูลาร์ 4 ช่วงต่อไร้รอยสะดุด + ถาดซ่อนเราเตอร์ Gigabit LAN": {
    en: "Column structure, special load-bearing steel beam + modular top 4 seamless splices + Gigabit LAN router hidden tray",
    zh: "立柱结构，特殊承重钢梁+模块化顶部4个无缝接头+千兆局域网路由器隐藏托盘"
  },
  "โต๊ะเกาะกลาง 3x3 หันหลังชนกัน พร้อมกระดูกงูร้อยสายไฟและปลั๊กไฟ 6 จุด": {
    en: "3x3 center island table with back to back collision with keel and 6 power outlets",
    zh: "3x3中心岛桌，与龙骨和6个电源插座背靠背碰撞"
  },
  "เกาะกลาง 6 ที่นั่ง โครงสร้างสามเหลี่ยมค้ำยัน รองรับ 1,100 กก.": {
    en: "6-seater central island, triangular structure, support support 1,100 kg",
    zh: "6座中央岛，三角形结构，支撑1100公斤"
  },
  "10 - 14 วันทำการ": {
    en: "10 - 14 business days",
    zh: "10 - 14个工作日"
  },
  "ท็อปคู่หันหลังชนกันพร้อมเสากลางเดินท่อไฟและลมแอร์ + โครงเหล็กชุบกัลวาไนซ์ + แผงกั้นอะคริลิกตัดแสง RGB": {
    en: "Double rear-facing, colliding central pillars, light ducts and air-conditioning + galvanized steel frame + RGB cut-out acrylic partition",
    zh: "双后置、碰撞中心柱、灯管、空调+镀锌钢架+ RGB剪裁亚克力隔断"
  },
  "ทั้งหมด": {
    en: "All",
    zh: "全部"
  },
  "การแข่งขัน & ทัวร์นาเมนต์": {
    en: "Tournaments & Pro Circuit",
    zh: "电竞赛事与锦标赛"
  },
  "งานเปิดตัวเกม & ค่ายเกม": {
    en: "Game Launch & Publisher Events",
    zh: "新作发布与厂商活动"
  },
  "กิจกรรมคอมมูนิตี้ & แจกรางวัล": {
    en: "Community Meetups & Awards",
    zh: "社区聚会与颁奖典礼"
  },
  "บรรยากาศร้าน & แข่ง LAN 24 ชม.": {
    en: "Arena Atmosphere & 24h LAN",
    zh: "场馆氛围与24小时LAN"
  },
  "รวมกิจกรรมและการแข่งขันอีสปอร์ตทุกประเภทของ GLP": {
    en: "All GLP esports activities and tournaments",
    zh: "汇聚 GLP 旗下的所有电竞赛事与特色活动"
  },
  "ทัวร์นาเมนต์ชิงเงินรางวัลระดับประเทศ ทั้ง LAN และ Online": {
    en: "Nationwide prize-pool tournaments, both LAN and Online",
    zh: "全国高额奖金锦标赛，涵盖线下LAN与线上对决"
  },
  "งานแถลงข่าว เปิดแพตช์ใหม่ และความร่วมมือกับค่ายเกมชั้นนำ": {
    en: "Press conferences, game patch debuts, and top publisher partnerships",
    zh: "新作发布会、重大版本更新体验与顶尖游戏厂商联动"
  },
  "มีตติ้งแฟนคลับ กิจกรรมกระชับมิตร แจกของรางวัลเกมมิ่งเกียร์": {
    en: "Fan meetups, friendly scrims, and gaming gear giveaways",
    zh: "粉丝见面会、友谊赛及豪华电竞外设福利派发"
  },
  "ภาพบรรยากาศผู้ใช้บริการ สเปกเครื่องเทพ และบริการ 24 ชั่วโมง": {
    en: "Gamer atmosphere, elite PC specs, and 24-hour service highlights",
    zh: "现场玩家火爆氛围、旗舰配置体验与24小时全天候运营"
  },
  "Official Standard": {
    en: "Official Standard",
    zh: "官方标准形象"
  },
  "Premium Lifestyle": {
    en: "Premium Lifestyle",
    zh: "高端轻奢格调"
  },
  "Hardcore Esports": {
    en: "Hardcore Esports",
    zh: "硬核职业电竞"
  },
  "G-Speed Royal Modern": {
    en: "G-Speed Royal Modern",
    zh: "G-Speed 皇家现代风 (Royal Modern)"
  },
  "Minimal Clean Luxury": {
    en: "Minimal Clean Luxury",
    zh: "极简轻奢风 (Clean Luxury)"
  },
  "Stealth Pro Circuit": {
    en: "Stealth Pro Circuit",
    zh: "暗黑赛博竞速风 (Stealth Pro)"
  },
  "โทนขาว-น้ำเงิน มาตรฐานแบรนด์ GLP สว่าง สบายตา ทันสมัย": {
    en: "White-blue GLP signature brand palette, bright, comfortable and modern",
    zh: "白蓝 GLP 经典品牌色调，明亮舒适、科技现代"
  },
  "โทนขาว-เทาอ่อน ไฟ Warm White สะอาดตา หรูหรา เรียบหรู": {
    en: "White and soft grey tones with warm white lighting, pristine and understated luxury",
    zh: "白浅灰暖白光，清爽雅致，高端轻奢"
  },
  "ดำ-กราไฟต์ ดุดัน ไฟ Linear สีเดียว สไตล์นักกีฬา Pro Circuit": {
    en: "Black graphite aggressive aesthetic, monochromatic linear accent lights, built for pro esports athletes",
    zh: "黑石墨色调硬核冷峻，单色线性氛围灯，专为职业电竞打造"
  },
  "การตกแต่งระดับแฟล็กชิปที่ผสมผสานความโมเดิร์นกับจิตวิญญาณอีสปอร์ต ไฟ LED สีน้ำเงินสลับขาว สว่างเพียงพอสำหรับทุกเพศทุกวัย ถ่ายรูปสวย โดดเด่นเป็นเอกลักษณ์": {
    en: "Flagship decoration blending modern aesthetics with esports spirit, blue-white LED lighting, bright and welcoming for all ages, photogenic and iconic.",
    zh: "旗舰级装饰风格，融合现代美学与电竞精神，蓝白交织LED照明，全年龄段明亮舒适，打卡出片极具辨识度。"
  },
  "ดีไซน์สไตล์มินิมอลคาเฟ่ชั้นนำ ผสมผสานวัสดุไม้ธรรมชาติ หินอ่อน และแสงไฟ Warm White อบอุ่น เหมาะกับผู้เล่นระดับพรีเมียม สตรีมเมอร์ และกลุ่มที่ต้องการบรรยากาศผ่อนคลายระดับสูง": {
    en: "Top cafe-style minimalist design combining natural wood, marble, and warm white lighting, ideal for premium gamers, streamers, and guests seeking high relaxation.",
    zh: "顶级咖啡馆极简设计，融合天然木质、大理石与柔和暖白光，极佳契合高端玩家、主播及追求轻奢私密体验的客群。"
  },
  "ดีไซน์สนามแข่งขันระดับโลกสไตล์ Dark Stealth เน้นการควบคุมสมาธิสูงสุด ผนังสีดำด้าน แผงซับเสียงทรงรังผึ้ง และไฟแถบเส้นตรง (Linear Light) ปราศจากแสงสะท้อนรบกวนสายตา": {
    en: "World-class tournament arena styling in Dark Stealth, focused on peak concentration with matte black walls, honeycomb acoustic panels, and glare-free linear lighting.",
    zh: "世界级电竞赛场Dark Stealth暗黑风格，极度注重专注力，哑光黑墙面、蜂窝吸音隔音板及线性矩阵赛博灯带，杜绝眩光反光。"
  },
  "กรุงเทพฯ และปริมณฑล": {
    en: "Bangkok & Metropolitan Area",
    zh: "曼谷及周边都会区"
  },
  "กรุงเทพฯ และปริมณฑล (ย่านมหาวิทยาลัย/ชุมชน)": {
    en: "Bangkok & Vicinity (University/Residential)",
    zh: "曼谷及周边都会区 (大学城/核心商圈)"
  },
  "เชียงใหม่ / ภาคเหนือ": {
    en: "Chiang Mai / Northern Thailand",
    zh: "清迈 / 泰国北部地区"
  },
  "ขอนแก่น / โคราช / ภาคอีสาน": {
    en: "Khon Kaen / Korat / Isan",
    zh: "孔敬 / 呵叻 / 东北部地区"
  },
  "ชลบุรี / พัทยา / ภาคตะวันออก": {
    en: "Chonburi / Pattaya / Eastern EEC",
    zh: "春武里 / 芭提雅 / 泰国东部"
  },
  "ภูเก็ต / สงขลา / ภาคใต้": {
    en: "Phuket / Songkhla / Southern Thailand",
    zh: "普吉岛 / 宋卡 / 泰国南部"
  },
  "อาคารพาณิชย์ (Commercial Building)": {
    en: "Commercial Building (Shophouse)",
    zh: "商业排屋 (Shophouse)"
  },
  "อาคารพาณิชย์ 2-3 คูหา (Commercial Shophouse)": {
    en: "2-3 Unit Commercial Shophouse",
    zh: "2-3 联排商业排屋 (Shophouse)"
  },
  "พื้นที่เช่าในศูนย์การค้า (Mall)": {
    en: "Shopping Mall Rental Space",
    zh: "购物中心商铺 (Shopping Mall)"
  },
  "พื้นที่เช่าในศูนย์การค้า / ไลฟ์สไตล์มอลล์ (Shopping Mall)": {
    en: "Shopping Mall / Lifestyle Center Unit",
    zh: "大型商场 / 购物生活广场租赁铺位"
  },
  "อาคารเดี่ยว (Standalone)": {
    en: "Standalone Commercial Building",
    zh: "独栋商业建筑 (Standalone)"
  },
  "อาคารเดี่ยว Standalone หรือโกดัง Renovate": {
    en: "Standalone Building / Renovated Warehouse",
    zh: "独立单体建筑 / 仓储改建空间"
  },
  "ใกล้มหาวิทยาลัย": {
    en: "Near University / Student District",
    zh: "大学周边 / 大学城商圈"
  },
  "ใกล้มหาวิทยาลัย / หอพักนักศึกษา": {
    en: "Near University / Student Dormitories",
    zh: "大学校园周边 / 学生公寓生活区"
  },
  "ผู้สนใจลงทุนแฟรนไชส์ (Franchise Investor)": {
    en: "Franchise Investor",
    zh: "意向加盟投资人 (Franchise Investor)"
  },
  "1,500,000 - 3,000,000 บาท": {
    en: "1,500,000 - 3,000,000 THB",
    zh: "1,500,000 - 3,000,000 泰铢"
  },
  "1,000,000 - 2,000,000 บาท": {
    en: "1,000,000 - 2,000,000 THB",
    zh: "100万 - 200万 泰铢"
  },
  "2,000,000 - 3,500,000 บาท": {
    en: "2,000,000 - 3,500,000 THB",
    zh: "200万 - 350万 泰铢"
  },
  "3,500,000 - 5,000,000 บาท": {
    en: "3,500,000 - 5,000,000 THB",
    zh: "350万 - 500万 泰铢"
  },
  "5,000,000 บาทขึ้นไป (Flagship Arena)": {
    en: "5,000,000+ THB (Flagship Arena)",
    zh: "500万 泰铢以上 (旗舰电竞馆)"
  },
  "มีงบประมาณเฉพาะ / ปรึกษาผู้เชี่ยวชาญ": {
    en: "Custom Budget / Consult Expert",
    zh: "有特定投资预算 / 专属专家咨询"
  },
  "2024-ปัจจุบัน": {
    en: "2024-Present",
    zh: "2024-至今"
  },
  "ปัจจุบัน": {
    en: "Present",
    zh: "至今"
  },
  "8 สาขา": {
    en: "8 Branches",
    zh: "8 家分店"
  },
  "750+ เครื่อง": {
    en: "750+ PCs",
    zh: "750+ 台"
  },
  "52,000+ คน": {
    en: "52,000+ Members",
    zh: "52,000+ 位"
  },
  "180+ รายการ": {
    en: "180+ Tournaments",
    zh: "180+ 场"
  },
  "สาขาที่เปิดให้บริการ": {
    en: "Active Branches",
    zh: "正式运营门店"
  },
  "จำนวนเครื่องในระบบ": {
    en: "Total Gaming PCs",
    zh: "系统中的机器数量"
  },
  "สมาชิกในเครือข่าย": {
    en: "Network Members",
    zh: "网络成员"
  },
  "ทัวร์นาเมนต์ที่จัดแล้ว": {
    en: "Tournaments Hosted",
    zh: "举办比赛"
  },
  "มีสาขาในเครือ 8 สาขาทั่วกรุงเทพฯ และปริมณฑล พร้อมขยายสู่หัวเมืองใหญ่ทั่วประเทศ": {
    en: "Expanded to 8 operating branches across Bangkok metropolitan area, with upcoming expansion to major provincial cities nationwide.",
    zh: "在曼谷及周边都会区拓展至8家运营分店，并稳步向全泰核心重点城市辐射布局。"
  },
  "เปิดตัวสาขาแรกในย่านมหาวิทยาลัย นำระบบ Diskless Server มาตรฐานใหม่มาใช้เป็นเจ้าแรกๆ": {
    en: "Launched the first branch near university campus, pioneering diskless server high-speed system.",
    zh: "于大学商圈开设首家门店，行业内率先引进万兆无盘系统新标准。"
  },
  "ขยายธุรกิจสู่ Esport Arena เต็มรูปแบบ รองรับการจัดแข่งขันระดับประเทศร่วมกับค่ายเกมใหญ่": {
    en: "Scaled up into full-scale Esports Arena, hosting major nationwide tournaments in partnership with leading publishers.",
    zh: "升级打造全能型电竞馆，携手顶级游戏厂商承办全国级专业电子竞技大赛。"
  },
  "เปิดตัวระบบเฟรนไชส์ G-Speed Express & Arena พร้อมระบบควบคุมการเงินและสต๊อกแบบคลาวด์": {
    en: "Launched G-Speed Express & Arena franchise model with cloud billing and real-time ERP inventory management.",
    zh: "正式发布 G-Speed Express & Arena 加盟体系，整合云端计费系统与集中化财务库存管理。"
  },
  "79 ซอย รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310": {
    en: "79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310",
    zh: "79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310"
  },
  "79 ซอย รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310 (เข้าออกได้ทั้งทางซอยลาดพร้าว 112 และซอยรามคำแหง 53)": {
    en: "79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310 (Accessible via Lat Phrao 112 & Ramkhamhaeng 53)",
    zh: "79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310"
  },
  "79 ซอย รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310 (เข้าออกได้ทั้งทางซอยลาดพร้าว 112 และซอยรามคำแหง 53 พิกัด 13.766999, 100.618755)": {
    en: "79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310 (Accessible via Lat Phrao 112 & Ramkhamhaeng 53, GPS: 13.766999, 100.618755)",
    zh: "79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310 (GPS: 13.766999, 100.618755)"
  },
  "79 ซ. รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310": {
    en: "79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310",
    zh: "79 Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok 10310"
  },
  "79 ซอย รามคำแหง 53": {
    en: "79 Soi Ramkhamhaeng 53",
    zh: "79 Soi Ramkhamhaeng 53"
  },
  "ซอยรามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพฯ": {
    en: "Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok",
    zh: "Soi Ramkhamhaeng 53, Phlabphla, Wang Thonglang, Bangkok"
  },
  "ซอยรามคำแหง 53": {
    en: "Soi Ramkhamhaeng 53",
    zh: "Soi Ramkhamhaeng 53"
  },
  "ซอยลาดพร้าว 112": {
    en: "Soi Lat Phrao 112",
    zh: "Soi Lat Phrao 112"
  },
  "รามคำแหง 53": {
    en: "Ramkhamhaeng 53",
    zh: "Ramkhamhaeng 53"
  },
  "เปิดบริการตลอด 24 ชั่วโมง ทุกวัน (24/7)": {
    en: "Open 24/7 Every Day",
    zh: "24小时全天候营业 (24/7)"
  },
  "เปิดบริการตลอด 24 ชม. ทุกวัน": {
    en: "Open 24 Hours Daily",
    zh: "24小时营业，全年无休"
  },
  "เปิดบริการตลอด 24 ชม.": {
    en: "Open 24 Hours Daily",
    zh: "24小时全天候营业"
  },
  "เปิดบริการ 24 ชั่วโมง 365 วัน ไม่มีวันหยุด": {
    en: "Open 24 Hours, 365 Days A Year",
    zh: "365天全年无休，24小时营业"
  },
  "(ทำเลศักยภาพ เชื่อมต่อระหว่าง ซอยลาดพร้าว 112 และ ซอยรามคำแหง 53 พิกัด 13.766999, 100.618755 มีที่จอดรถสะดวกสบาย)": {
    en: "(Prime location connecting Soi Lat Phrao 112 & Soi Ramkhamhaeng 53, GPS: 13.766999, 100.618755. Convenient parking available)",
    zh: "(Prime location connecting Soi Lat Phrao 112 & Soi Ramkhamhaeng 53, GPS: 13.766999, 100.618755. 设便利停车场)"
  },
  "แผนที่ร้าน": {
    en: "Arena Location",
    zh: "场馆地址"
  },
  "ที่ตั้งอารีนา": {
    en: "Arena Location",
    zh: "场馆地址"
  },
  "ที่อยู่": {
    en: "Address",
    zh: "地址"
  },
  "ที่อยู่:": {
    en: "Address:",
    zh: "地址:"
  },
  "เบอร์โทรติดต่อ": {
    en: "Phone Number",
    zh: "联系电话"
  },
  "อีเมลติดต่อ": {
    en: "Email Address",
    zh: "电子邮箱"
  },
  "เวลาทำการ": {
    en: "Opening Hours",
    zh: "营业时间"
  },
  "กำลังอยู่ในโหมดเดินชมร้านระดับสายตา": {
    en: "First-person walk-through mode active",
    zh: "第一人称漫游模式已启用"
  },
  "เดินชมร้าน": {
    en: "Walk Mode",
    zh: "漫游视角"
  },
  "มุมมองหน้าร้าน": {
    en: "Storefront View",
    zh: "门头视角"
  },
  "หน้าร้าน": {
    en: "Front View",
    zh: "门头"
  },
  "สลับเป็นมุมมอง 3D": {
    en: "Switch to 3D perspective",
    zh: "切换到3D全景"
  },
  "สลับเป็นมุมมองแปลนด้านบน": {
    en: "Switch to 2D top-down plan",
    zh: "切换到2D俯视图"
  },
  "ออกจากโหมดเดินชมร้าน (กด ESC ได้)": {
    en: "Exit walk mode (or press ESC)",
    zh: "退出漫游模式 (可按ESC)"
  },
  "ออกจากโหมดเดิน (ESC)": {
    en: "Exit Walk (ESC)",
    zh: "退出漫游 (ESC)"
  },
  "หรือ": {
    en: "or",
    zh: "或"
  },
  "เดินชมในร้าน": {
    en: "Walk around venue",
    zh: "店内漫游"
  },
  "เมาส์ 360°": {
    en: "Mouse 360°",
    zh: "鼠标 360°"
  },
  "คลิกเมาส์": {
    en: "Click Mouse",
    zh: "点击鼠标"
  },
  "ขยับเมาส์หันมองรอบทิศ (FPS Lock)": {
    en: "Look around 360° (FPS Lock)",
    zh: "移动鼠标环视四周 (锁定准星)"
  },
  "คลิกเพื่อล็อคเมาส์หันมอง 360°": {
    en: "Click to lock mouse and look 360°",
    zh: "点击锁定鼠标进行360°环视"
  },
  "วิ่งเร็ว": {
    en: "Sprint",
    zh: "加速奔跑"
  },
  "ออกจากโหมดเดิน / ปลดล็อค": {
    en: "Exit walk / Unlock mouse",
    zh: "退出漫游 / 解锁鼠标"
  },
  "สายตา 1.65ม.": {
    en: "Eye Level 1.65m",
    zh: "视线高 1.65米"
  },
  "เดินหน้า (Forward)": {
    en: "Forward",
    zh: "前进"
  },
  "สเต็ปซ้าย (Strafe Left)": {
    en: "Strafe Left",
    zh: "向左平移"
  },
  "สเต็ปขวา (Strafe Right)": {
    en: "Strafe Right",
    zh: "向右平移"
  },
  "ถอยหลัง (Backward)": {
    en: "Backward",
    zh: "后退"
  },
  "สลับวิ่งเร็ว / เดิน": {
    en: "Toggle Sprint / Walk",
    zh: "切换疾跑 / 步行"
  },
  "วิ่งเร็ว (เปิด)": {
    en: "Sprint (ON)",
    zh: "加速 (开启)"
  },
  "หมุนมุมมองซ้าย": {
    en: "Turn view left",
    zh: "向左转头"
  },
  "หันซ้าย": {
    en: "Look Left",
    zh: "向左看"
  },
  "หมุนมุมมองขวา": {
    en: "Turn view right",
    zh: "向右转头"
  },
  "หันขวา": {
    en: "Look Right",
    zh: "向右看"
  },
  "คลิกซ้ายค้างเพื่อหมุนรอบห้อง • คลิกขวาเพื่อเลื่อน • กดปุ่มลูกศรเพื่อย้ายโต๊ะ": {
    en: "Left-click & drag to rotate • Right-click to pan • Arrow keys to nudge items",
    zh: "左键拖拽旋转视角 • 右键平移 • 方向键微调设备位置"
  },
  "แตะเลื่อนเพื่อหมุน 360° • สองนิ้วเพื่อซูม": {
    en: "Swipe to rotate 360° • Pinch with two fingers to zoom",
    zh: "单指滑动旋转360° • 双指捏合缩放"
  },
  "เลื่อนตำแหน่งวัตถุใน 3D (หรือกดปุ่มลูกศรบนคีย์บอร์ด)": {
    en: "Nudge object in 3D (or use arrow keys)",
    zh: "在3D中微调物品位置（或使用键盘方向键）"
  },
  "ย้าย:": {
    en: "Move:",
    zh: "移动:"
  },
  "เลื่อนซ้าย (-0.5ม.) หรือกดปุ่ม ←": {
    en: "Move left (-0.5m) or press ←",
    zh: "向左移动 (-0.5米) 或按 ←"
  },
  "เลื่อนขวา (+0.5ม.) หรือกดปุ่ม →": {
    en: "Move right (+0.5m) or press →",
    zh: "向右移动 (+0.5米) 或按 →"
  },
  "เลื่อนขึ้น/ลึก (-0.5ม.) หรือกดปุ่ม ↑": {
    en: "Move up/inward (-0.5m) or press ↑",
    zh: "向前移入 (-0.5米) 或按 ↑"
  },
  "เลื่อนลง/หน้า (+0.5ม.) หรือกดปุ่ม ↓": {
    en: "Move down/outward (+0.5m) or press ↓",
    zh: "向后移出 (+0.5米) 或按 ↓"
  },
  "หมุน 90°": {
    en: "Rotate 90°",
    zh: "旋转 90°"
  },
  "คัดลอก": {
    en: "Copy",
    zh: "复制"
  },
  "ลบ": {
    en: "Delete",
    zh: "删除"
  },
  "ทางเข้าร้าน": {
    en: "ENTRANCE",
    zh: "入口"
  },
  "ดึง • PULL": {
    en: "PULL",
    zh: "拉 • PULL"
  },
  "เปิด/ปิดการแสดงผังแปลนที่แนบ": {
    en: "Toggle attached blueprint overlay",
    zh: "显示/隐藏附加蓝图"
  },
  "คลิกเพื่อปรับตำแหน่งประตูทางเข้าร้านและป้ายชื่อร้าน (ในแถบซ้าย)": {
    en: "Click to adjust entrance door & store signage (in left panel)",
    zh: "点击调整大门位置及招牌（左侧面板）"
  },
  "คลิกเพื่อเปลี่ยนวอลเปเปอร์ผนังและวัสดุพื้น": {
    en: "Click to change wall & flooring materials",
    zh: "点击更换墙纸与地面材质"
  },
  "คลิกเพื่อเปิดแท็บเพิ่มอุปกรณ์ (ในแถบซ้าย)": {
    en: "Click to open Add Equipment tab (in left panel)",
    zh: "点击打开添加设备面板（左侧面板）"
  },
  "ดูรายละเอียดอุปกรณ์ที่เลือก และรายการอุปกรณ์ในร้าน": {
    en: "View selected item details & venue inventory",
    zh: "查看选中设备详情及店内设备清单"
  },
  "ปรับแต่งตำแหน่งประตูทางเข้าร้าน รูปแบบประตู และป้ายชื่อร้าน": {
    en: "Configure entrance door, door style & store signage",
    zh: "配置店铺大门位置、款式及招牌"
  },
  "ปรับแต่งวอลเปเปอร์ผนังและวัสดุปูพื้นห้อง": {
    en: "Configure wall wallpaper & room flooring finishes",
    zh: "配置墙面壁纸与室内地坪材质"
  },
  "เลือกและเพิ่มอุปกรณ์/โต๊ะคอมลงในผัง": {
    en: "Browse & place gaming modules/stations into layout",
    zh: "浏览并添加电竞工作站/设施到平面图"
  },
  "ปิดหน้าต่างปรับประตู": {
    en: "Close door settings",
    zh: "关闭大门设置"
  },
  "เช่น GLP : G SPEED LIVING PLUS...": {
    en: "e.g. GLP : G SPEED LIVING PLUS...",
    zh: "例如 GLP : G SPEED LIVING PLUS..."
  },
  "สาขา สยามสแควร์": {
    en: "Siam Square Branch",
    zh: "暹罗广场店"
  },
  "ปิดการเลือก": {
    en: "Deselect item",
    zh: "取消选中"
  },
  "คลิกเพื่อดูสเปกเต็มและภาพสินค้าขยาย": {
    en: "Click to inspect full specs & HD photo",
    zh: "点击查看完整规格及高清图"
  },
  "คัดลอกโมดูลนี้ (Duplicate)": {
    en: "Duplicate this module (Duplicate)",
    zh: "复制此模块 (Duplicate)"
  },
  "ลบโมดูลนี้ออกจากผัง (กด Delete)": {
    en: "Delete module from layout (Press Delete)",
    zh: "从平面图中删除模块 (按 Delete)"
  },
  "ไปที่แท็บเพิ่มอุปกรณ์": {
    en: "Go to Add Equipment tab",
    zh: "前往添加设备标签"
  },
  "คลิกเพื่อเลือกและปรับตำแหน่งประตูทางเข้าร้าน": {
    en: "Click to select and adjust entrance door position",
    zh: "点击选择并调整大门位置"
  },
  "คลิกเพื่อย่อข้อมูล": {
    en: "Click to collapse info",
    zh: "点击折叠信息"
  },
  "คลิกเพื่อดูขนาด ราคา และจัดการอุปกรณ์": {
    en: "Click to view dimensions, price & manage equipment",
    zh: "点击查看尺寸、价格及管理模块"
  },
  "เลือกและปรับตำแหน่งในมุมมอง 3D": {
    en: "Select and fine-tune position in 3D",
    zh: "在3D视图中选中并调整位置"
  },
  "หมุน 90 องศา": {
    en: "Rotate 90 degrees",
    zh: "旋转 90 度"
  },
  "นำอุปกรณ์ชิ้นนี้ออกจากผังร้าน": {
    en: "Remove this item from layout",
    zh: "从店面平面图中移除此项"
  },
  "คลิกเพื่อเปลี่ยนวอลเปเปอร์ในแท็บ 2": {
    en: "Click to change wallpaper in Tab 2",
    zh: "点击在标签2中更换壁纸"
  },
  "คลิกเพื่อเปลี่ยนวัสดุปูพื้นในแท็บ 2": {
    en: "Click to change flooring in Tab 2",
    zh: "点击在标签2中更换地板材质"
  },
  "คลิกเพื่อปรับตำแหน่งประตู": {
    en: "Click to adjust door position",
    zh: "点击调整大门位置"
  },
  "ด้านหน้า": {
    en: "Front",
    zh: "正门"
  },
  "ผนังซ้าย": {
    en: "Left Wall",
    zh: "左墙"
  },
  "ผนังหลัง": {
    en: "Back Wall",
    zh: "后墙"
  },
  "ผนังขวา": {
    en: "Right Wall",
    zh: "右墙"
  },
  "ใช้งานอยู่": {
    en: "Active",
    zh: "使用中"
  },
  "คลิกเพื่อดูสเปกเต็มและภาพสินค้า": {
    en: "Click to inspect full specs & photo",
    zh: "点击查看完整规格及实物照片"
  },
  "โทนสีวัสดุและไฟ": {
    en: "Material and Lighting Tones",
    zh: "材质与灯光色彩"
  },
  "สีท็อปโต๊ะ": {
    en: "Desk Top Color",
    zh: "桌面面板颜色"
  },
  "สีไฟตกแต่ง": {
    en: "Accent Lighting Color",
    zh: "氛围灯光颜色"
  },
  "สีเก้าอี้": {
    en: "Chair Color",
    zh: "座椅颜色"
  },
  "ขนาด:": {
    en: "Size:",
    zh: "尺寸:"
  },
  "สูง": {
    en: "Height",
    zh: "高度"
  },
  "เพิ่มลงในผัง 3D ทันที": {
    en: "Add directly to 3D layout",
    zh: "立即添加到3D平面图"
  },
  "รวม": {
    en: "Total",
    zh: "合计"
  },
  "โต๊ะ": {
    en: "Desk",
    zh: "桌子"
  },
  "เก้าอี้": {
    en: "Chairs",
    zh: "椅子"
  },
  "ตัว": {
    en: "pcs",
    zh: "把"
  },
  "ล้างผังทั้งหมด": {
    en: "Clear All Layout",
    zh: "清空所有布局"
  },
  "ซูมย่อแปลน (-)": {
    en: "Zoom out (-)",
    zh: "缩小平面图 (-)"
  },
  "คลิกเพื่อรีเซ็ต 100%": {
    en: "Click to reset 100%",
    zh: "点击重置 100%"
  },
  "ซูมขยายแปลน (+)": {
    en: "Zoom in (+)",
    zh: "放大平面图 (+)"
  },
  "รีเซ็ตพอดีหน้าจอ (Fit to Screen 100%)": {
    en: "Fit to screen (100%)",
    zh: "适应屏幕 (100%)"
  },
  "โซฟาเลานจ์": {
    en: "Lounge Sofa",
    zh: "休息室沙发"
  },
  "คลิกเลือก หรือลากเพื่อย้ายตำแหน่ง": {
    en: "Click to select or drag to move position",
    zh: "点击选中或拖拽移动位置"
  },
  "กดเพื่อเลื่อนตำแหน่ง (หรือใช้ปุ่มลูกศร ↑ ↓ ← → บนคีย์บอร์ด)": {
    en: "Nudge position (or use arrow keys ↑ ↓ ← →)",
    zh: "微调位置（或使用键盘方向键 ↑ ↓ ← →）"
  },
  "เลื่อนซ้าย 0.2ม. (กด ←)": {
    en: "Nudge left 0.2m (Press ←)",
    zh: "向左微调 0.2米 (按 ←)"
  },
  "เลื่อนขึ้น 0.2ม. (กด ↑)": {
    en: "Nudge up 0.2m (Press ↑)",
    zh: "向上微调 0.2米 (按 ↑)"
  },
  "เลื่อนลง 0.2ม. (กด ↓)": {
    en: "Nudge down 0.2m (Press ↓)",
    zh: "向下微调 0.2米 (按 ↓)"
  },
  "เลื่อนขวา 0.2ม. (กด →)": {
    en: "Nudge right 0.2m (Press →)",
    zh: "向右微调 0.2米 (按 →)"
  },
  "สามารถเลือก Tier สเปกที่เหมาะสมกับกลุ่มลูกค้าและงบประมาณลงทุน (เก้าอี้เกมมิ่งรวมอยู่ในชุดโต๊ะแล้ว)": {
    en: "Choose the hardware tier fitting your target gamers and budget (gaming chairs are already included in desk sets)",
    zh: "请选择符合客群定位及预算的电脑硬件档次 (电竞椅已包含在桌组中)"
  },
  "ดาวน์โหลดภาพแปลนสำหรับช่างและผู้รับเหมา (PNG)": {
    en: "Download architectural floorplan for contractors (PNG)",
    zh: "下载承包商施工蓝图 (PNG)"
  },
  "บริษัท จี-สปีด ลิฟวิ่ง พลัส จำกัด (สำนักงานใหญ่)": {
    en: "G-Speed Living Plus Co., Ltd. (Headquarters)",
    zh: "G-Speed Living Plus 有限公司 (总部)"
  },
  "เลขที่ 88/9 อาคารจี-สปีด ทาวเวอร์ ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900": {
    en: "88/9 G-Speed Tower, Phahonyothin Rd, Lat Yao, Chatuchak, Bangkok 10900, Thailand",
    zh: "泰国曼谷乍都节区帕凤裕庭路 G-Speed 大厦 88/9 号 10900"
  },
  "เลขประจำตัวผู้เสียภาษีอากร: 0105566012345 | โทร: 02-888-9999 | เว็บไซต์: www.gspeed-esport.com": {
    en: "Tax ID: 0105566012345 | Tel: +66 2 888 9999 | Web: www.gspeed-esport.com",
    zh: "纳税人识别号: 0105566012345 | 电话: +66 2 888 9999 | 网站: www.gspeed-esport.com"
  },
  "ระบบได้บันทึกไฟล์พิมพ์เขียวและสัดส่วนพื้นที่": {
    en: "System has recorded blueprint dimensions",
    zh: "系统已成功登记蓝图及场地尺寸"
  },
  "เรียบร้อยแล้ว สถาปนิก G-Speed จะนำผังนี้ไปขึ้นแบบโครงสร้าง 3D Interior เสมือนจริงความละเอียดสูง (Photo-realistic Render) และจัดเตรียมใบเสนอราคาทางการส่งกลับให้ท่านภายใน 24 ชม.": {
    en: "successfully. G-Speed architects will generate photorealistic 3D interior renderings and prepare an official turnkey quotation within 24 hours.",
    zh: "已归档。G-Speed 建筑设计团队将以此深化超高清3D实景渲染图，并在24小时内向您发送官方总承包报价单。"
  },
  "คุณสมเกียรติ มั่นคง": {
    en: "e.g. John Doe / Somkiat M.",
    zh: "例如 张先生 / Somkiat M."
  },
  "คำนวณตามผังร้านและสเปค": {
    en: "Calculated from layout & specs",
    zh: "根据店面布局及硬件规格自动测算"
  },
  "คำนวณอัตโนมัติตามผัง": {
    en: "Calculated from layout",
    zh: "根据当前排布自动测算"
  },
  "งบประเมินรวมฮาร์ดแวร์และโครงสร้างพื้นฐาน:": {
    en: "Estimated capex (hardware & turnkey infrastructure):",
    zh: "预估总投资（含硬件及总包基础设施）:"
  },
  "เช่น มีอาคารพาณิชย์ 2 คูหา ย่าน ม.เกษตรศาสตร์ ติดถนนใหญ่...": {
    en: "e.g. 2 commercial shophouses near university, roadside location...",
    zh: "例如 大学城主干道旁两间商铺，临街位置..."
  },
  "ดาวน์โหลดแปลนสำหรับช่าง (PNG)": {
    en: "Download contractor blueprint (PNG)",
    zh: "下载施工蓝图 (PNG)"
  },
  "ปิดหน้าต่าง": {
    en: "Close",
    zh: "关闭窗口"
  },
  "คลิกเพื่อย่อมุมมองปกติ": {
    en: "Click to reset normal view",
    zh: "点击还原正常视图"
  },
  "คลิกเพื่อขยายดูตัวอักษรและรายละเอียดขนาดใหญ่ (100% Zoom)": {
    en: "Click to zoom in for 100% full detail & readable text",
    zh: "点击放大查看100%细节及文字"
  },
  "หมุน": {
    en: "Rotate",
    zh: "旋转"
  },
  "ด้านหน้า (Front)": {
    en: "Front",
    zh: "正门"
  },
  "ผนังซ้าย (Left)": {
    en: "Left Wall",
    zh: "左墙"
  },
  "ผนังหลัง (Back)": {
    en: "Back Wall",
    zh: "后墙"
  },
  "ผนังขวา (Right)": {
    en: "Right Wall",
    zh: "右墙"
  },
  "ใบเสนอราคาประเมินเบื้องต้น: แฟรนไชส์ GLP : G Speed Living Plus": {
    en: "Preliminary Investment Quotation: GLP G-Speed Living Plus Franchise",
    zh: "初审投资预算报价单: GLP G-Speed Living Plus 电竞馆加盟"
  },
  "บันทึกข้อมูลและส่งแปลนร้านเรียบร้อย!": {
    en: "Store Plan & Inquiry Successfully Submitted!",
    zh: "开店方案及意向信息已成功提交！"
  },
  "ทีมวิศวกรและผู้เชี่ยวชาญแฟรนไชส์ของ GLP : G Speed Living Plus จะตรวจสอบผังที่คุณออกแบบ และติดต่อกลับเพื่อเสนอนัดสำรวจสถานที่จริงภายใน 24 ชม.": {
    en: "GLP engineering & franchise experts will review your custom layout and contact you for an on-site survey within 24 hours.",
    zh: "GLP 专属工程师与投资顾问将审核您的场地设计，并在24小时内与您致电预约实地勘测。"
  },
  "Black Obsidian (ดำด้าน)": {
    en: "Black Obsidian (Matte Black)",
    zh: "曜石黑 (质感哑光黑)"
  },
  "Esport Blue (น้ำเงิน)": {
    en: "Esport Blue (Pro Blue)",
    zh: "电竞深蓝 (Esport Blue)"
  },
  "Cyber Cyan (ฟ้าสว่าง)": {
    en: "Cyber Cyan (Electric Cyan)",
    zh: "赛博青蓝 (Cyber Cyan)"
  },
  "Aura Purple (ม่วง)": {
    en: "Aura Purple (Neon Violet)",
    zh: "极光幻紫 (Aura Purple)"
  },
  "บ.": {
    en: "THB",
    zh: "泰铢"
  },
  "เรากำลังนำข้อมูลขนาดพื้นที่": {
    en: "We are processing your space dimensions of",
    zh: "我们正在根据您的场地实用面积"
  },
  "และจำนวน": {
    en: "and capacity of",
    zh: "及规划电脑席位数"
  },
  "ไปจัดทำ รายงานวิเคราะห์ความเป็นไปได้ของโครงการ (Feasibility Study) พร้อมประมาณการผลตอบแทนรายเดือน โดยทีมงานผู้เชี่ยวชาญจะติดต่อกลับไปยังเบอร์": {
    en: "to generate your customized Feasibility Study and monthly ROI projection. Our advisory team will reach out to",
    zh: "测算专属可行性分析报告 (Feasibility Study) 与月度回报测算。官方专家将致电"
  },
  "หรืออีเมล": {
    en: "or email",
    zh: "或发送邮件至"
  },
  "ภายใน 24 ชั่วโมง เพื่อส่งมอบเอกสารสรุปโครงการและนัดหมายให้คำปรึกษาแบบ 1-on-1 โดยไม่มีค่าใช้จ่าย": {
    en: "within 24 hours to deliver the summary documentation and arrange a free 1-on-1 investment consultation.",
    zh: "在24小时内与您联系，交付正式项目方案并预约免费一对一开店咨询。"
  },
  "แปลนอ้างอิง:": {
    en: "Reference Plan:",
    zh: "参照底图:"
  },
  "เปิดอยู่": {
    en: "ON",
    zh: "已开启"
  },
  "ความชัด:": {
    en: "Opacity:",
    zh: "透明度:"
  },
  "สีผนัง": {
    en: "Wall Color",
    zh: "墙面颜色"
  },
  "สีพื้น": {
    en: "Floor Color",
    zh: "地面颜色"
  },
  "ภาพสินค้าจริงจากโรงงานผลิต G-Speed": {
    en: "Real Factory Manufactured Photo - G-Speed",
    zh: "G-Speed 专属工厂实体产品实拍"
  },
  "โทนสีและวัสดุตกแต่งจริง (Color & Finish)": {
    en: "Actual Colors & Finishes (Color & Finish)",
    zh: "实体色彩与质感用料 (Color & Finish)"
  },
  "สีท็อป & ขาโต๊ะ": {
    en: "Desktop & Leg Color",
    zh: "台面及桌腿颜色"
  },
  "สีไฟนีออน / ขอบตกแต่ง": {
    en: "Neon & Trim Color",
    zh: "霓虹灯光及装饰边"
  },
  "สีหนังเก้าอี้เกมมิ่ง": {
    en: "Gaming Chair Leather",
    zh: "电竞椅皮质配色"
  },
  "Racing Black (หนัง PU ดำเดินด้ายคู่)": {
    en: "Racing Black (Dual-stitched PU Leather)",
    zh: "竞速黑 (双线精工缝制PU环保皮革)"
  },
  "หน้าท็อปโต๊ะ:": {
    en: "Desktop Panel:",
    zh: "台面面板:"
  },
  "ไม้สังเคราะห์ HPL (High Pressure Laminate) ความหนา 25 มม. เกรดทนความร้อน กันน้ำ 100% และกันรอยขูดขีด": {
    en: "25mm High-Pressure Laminate (HPL) engineering core: heat-resistant, 100% waterproof, anti-scratch coating",
    zh: "25mm 高压层压复合耐磨板 (HPL)：耐热防刮痕，100%防水且经久耐磨"
  },
  "ขอบโต๊ะ Ergonomic:": {
    en: "Ergonomic Bevel Edge:",
    zh: "人体工学前沿微弧:"
  },
  "เจียรลบมุมลาดเอียง 45 องศา (Bevel Edge) ตามหลักสรีรศาสตร์ รองรับข้อมือผู้เล่นเกมได้สบายตลอดวัน": {
    en: "45-degree ergonomic bevel slope providing optimal wrist support for prolonged gaming marathons",
    zh: "45度人体工学斜切圆滑倒边，贴合手臂手腕，长久对战不累"
  },
  "โครงขาและคานรับแรง:": {
    en: "Steel Leg & Load Beams:",
    zh: "钢架支撑梁与桌腿:"
  },
  "เหล็กกล้าคาร์บอน (Carbon Steel Box) หนา 1.5 - 2.0 มม. พ่นสีพาวเดอร์โค้ตกันสนิม รองรับน้ำหนักได้มากกว่า 250 กก.": {
    en: "1.5-2.0mm high-tensile carbon steel box tubing with anti-corrosion powder coating, supports 250+ kg",
    zh: "1.5 - 2.0mm 高强度碳钢管结构，环保静电防锈喷塑，承重能力超 250kg"
  },
  "รุ่นเก้าอี้:": {
    en: "Chair Model:",
    zh: "电竞椅型号:"
  },
  "ประจำสถานี": {
    en: "per station",
    zh: "把/席位"
  },
  "เบาะรองนั่ง:": {
    en: "Seat Cushion:",
    zh: "座椅坐垫:"
  },
  "โฟมขึ้นรูปเย็นความหนาแน่นสูง (High-Density Cold-Cure Foam) ไม่ยุบตัว รับประกันการใช้งานต่อเนื่อง": {
    en: "High-density cold-cure molded foam cushion ensuring zero sag under continuous esports use",
    zh: "高密度一体发泡冷发泡海绵，久坐不塌陷，保障连续商业高频使用"
  },
  "ฟังก์ชันการปรับระดับ:": {
    en: "Recline & Armrests:",
    zh: "调节系统:"
  },
  "ปรับเอนหลังได้ 160 องศา พร้อมระบบล็อกมัลติฟังก์ชัน + ที่พักแขน 3D/4D ปรับระดับความสูงและองศาได้": {
    en: "160° stepless recline with multi-tilt locking + 3D/4D multi-directional adjustable armrests",
    zh: "160度大角度后仰逍遥锁定，配置3D/4D多向可调电竞扶手"
  },
  "ระบบรองรับน้ำหนัก:": {
    en: "Gas Lift Mechanism:",
    zh: "气压防爆升降:"
  },
  "โช้กแก๊ส Class 4 ผ่านการทดสอบความปลอดภัยระดับสากล BIFMA รองรับน้ำหนักสูงสุด 150 กก./ตัว": {
    en: "Class-4 explosion-proof gas lift certified to international BIFMA standards, rated for 150 kg",
    zh: "国际 BIFMA 认证 Class 4 防爆加厚气压棒，单把承重达 150kg"
  },
  "รางร้อยสายไฟใต้โต๊ะ (Dual Cable Raceway):": {
    en: "Under-Desk Dual Cable Raceway:",
    zh: "桌底强弱电双分离线槽:"
  },
  "รางเหล็กซ่อนสายไฟ 2 ช่องอิสระ แยกท่อไฟฟ้ากำลัง 220V และสายแลน LAN ป้องกันสัญญาณรบกวน (Zero Interference)": {
    en: "Independent dual steel cable ducts separating 220V power and CAT6A LAN for zero EMI signal interference",
    zh: "独立双金属理线槽，220V强电与CAT6A弱电网线物理隔离，确保零电磁干扰"
  },
  "จุดเต้ารับไฟฟ้าต่อสถานี:": {
    en: "Individual Power Sockets:",
    zh: "独立防浪涌插座:"
  },
  "เต้ารับคู่ 3 ขา มีกราวด์ (Universal Socket 220V 16A) พร้อมเบรกเกอร์กันไฟกระชาก (Surge Protection) 1:1": {
    en: "Universal 3-prong grounded 16A 220V sockets with 1:1 integrated surge protection circuitry",
    zh: "双联国标/通用三孔带接地电源插座 (220V 16A)，配备独立防浪涌保护"
  },
  "การเชื่อมต่อเน็ตเวิร์ก:": {
    en: "Network Terminations:",
    zh: "高速千兆网络端口:"
  },
  "เต้ารับ LAN RJ-45 CAT6A Shielded ความเร็ว 10Gbps Ready พร้อมท่อร้อยสายเชื่อมตรงสู่ตู้ Rack เซิร์ฟเวอร์": {
    en: "Shielded CAT6A RJ-45 LAN port 10Gbps-ready, routed directly into central server rack",
    zh: "六类屏蔽 CAT6A RJ-45 工业级网口，支持万兆速率直连中心机柜"
  },
  "โต๊ะมาตรฐาน": {
    en: "Standard Desk",
    zh: "标准对战桌"
  },
  "รางสายไฟครบชุด": {
    en: "complete raceway & cabling included",
    zh: "全套内置走线槽管线"
  },
  "กำลังซูม 100% (คลิกเพื่อย่อภาพรวม)": {
    en: "Zoomed 100% (Click to fit view)",
    zh: "100% 放大中 (点击还原整体视图)"
  },
  "คลิกภาพเพื่อซูมดูตัวหนังสือและอุปกรณ์ 100%": {
    en: "Click image to zoom 100% and inspect equipment text",
    zh: "点击图片可 100% 放大查看所有文字标注与设备细节"
  },
  "คำแนะนำ:": {
    en: "Tip:",
    zh: "操作提示:"
  },
  "คลิกที่ภาพเพื่อย่อมุมมองปกติ | เลื่อนลูกกลิ้งเมาส์เพื่อดูส่วนต่างๆ": {
    en: "Click image to reset to fit view | Use mouse wheel to scroll around",
    zh: "再次点击图片可还原全图 | 滚动鼠标滚轮浏览各分区"
  },
  "คลิกที่ภาพ หรือกดปุ่ม \\\"ขยายดูอุปกรณ์ 100%\\\" เพื่ออ่านตัวหนังสือชัดเจน": {
    en: "Click image or press \\\"100% Zoom\\\" button to view blueprint text clearly",
    zh: "点击图片或“100%放大”按钮，即可清晰阅读所有施工图纸标注"
  },
  "ชุดเครื่องคอมพิวเตอร์เกมมิ่งสเปก": {
    en: "Gaming Battle Station Hardware Package:",
    zh: "电竞专业电脑机台配置套组:"
  },
  "จอ": {
    en: "Display:",
    zh: "显示器:"
  },
  "เกมมิ่งเกียร์": {
    en: "Gaming Gear:",
    zh: "电竞外设:"
  },
  "(ไม่รวมเก้าอี้ - รวมในชุดโต๊ะ)": {
    en: "(Excl. Chairs - included in desk modules)",
    zh: "(不含椅 - 已在桌组中配备)"
  },
  "ชุดโต๊ะคอมพิวเตอร์เกมมิ่งพร้อมเก้าอี้ Ergonomic และโซนพิเศษในผัง": {
    en: "Gaming Desks with Ergonomic Chairs & Specialized Zones in Layout",
    zh: "电竞对战桌椅与VIP包厢工程 (全套人体工学座椅及专用桌)"
  },
  "จัดวางตามผังร้าน": {
    en: "Configured per store plan:",
    zh: "按场地规划排布:"
  },
  "โมดูล": {
    en: "modules",
    zh: "个模块"
  },
  "ชุด": {
    en: "set",
    zh: "套"
  },
  "ระบบ": {
    en: "system",
    zh: "套系统"
  },
  "สาขา": {
    en: "branch",
    zh: "家分店"
  },
  "(รวมเก้าอี้ Ergonomic ครบตามจำนวนที่นั่ง, รางร้อยสายไฟ, และกล่องเต้ารับคู่ 3 ขา)": {
    en: "(Includes Ergonomic chairs for all stations, cable raceway, dual-socket 3-prong electrical box)",
    zh: "(配齐所有席位人体工学椅、双槽走线管及防浪涌双三孔电源插座)"
  },
  "งานตกแต่งภายใน ระบบฝ้า ผนังกันเสียง & ไฟ Linear Modern": {
    en: "Interior Decoration, Acoustic Ceiling/Walls & Linear Lighting",
    zh: "室内硬装、吸音隔音墙面及线性矩阵赛博灯带"
  },
  "งานผนัง Acoustic ซับเสียง, งานพื้น Epoxy/กระเบื้องยาง Heavy-Duty, ป้ายไฟอะคริลิกเรืองแสงโลโก้แบรนด์": {
    en: "Acoustic sound absorption walls, heavy-duty commercial flooring, glowing brand logo sign",
    zh: "专业吸音阻尼墙面、重载商用防静电地板/地毯、3D发光品牌门头灯箱"
  },
  "งานระบบปรับอากาศ Inverter Cassette Type ประหยัดพลังงาน": {
    en: "Energy-Saving Commercial Inverter Cassette HVAC System",
    zh: "商用节能变频多联机吸顶空调及新风系统"
  },
  "เครื่องปรับอากาศฝังฝ้า 4 ทิศทาง พร้อมระบบระบายอากาศ Fresh Air Circulation สำหรับบริการ 24 ชม.": {
    en: "4-Way ceiling cassette inverter AC with fresh air circulation engineered for 24/7 operation",
    zh: "四面出风嵌入式变频吸顶机，配备独立新风排气系统，满足24小时连续高负荷运行"
  },
  "ระบบแม่ข่าย Diskless Server 10Gbps NVMe High-Availability": {
    en: "10Gbps NVMe Enterprise Diskless Master Server Cluster",
    zh: "万兆企业级无盘主控服务器集群 (双机热备)"
  },
  "เซิร์ฟเวอร์สำรอง Dual-Host ระบบอัปเดตเกมอัตโนมัติความเร็วสูง รองรับการบูตพร้อมกันโดยไม่มีสะดุด": {
    en: "Dual-Host failover server with automated high-speed game patching, instant concurrent boot with zero lag",
    zh: "双机热备服务器，配备200+款游戏库全自动极速更新，支撑全场瞬间无延迟并发启动"
  },
  "ระบบโครงข่ายเน็ตเวิร์ก Enterprise Dual-WAN & Cisco 10G Switch": {
    en: "Enterprise Dual-WAN Network Infrastructure & Cisco 10G Managed Switches",
    zh: "企业级双线光纤智能分流极速网络与思科万兆交换机"
  },
  "สายสัญญาณ LAN CAT6A Shielded + ตู้ Rack 42U Server + ระบบ UPS สำรองไฟขนาด 10kVA": {
    en: "CAT6A Shielded cabling + 42U Server Rack + 10kVA Central UPS battery backup system",
    zh: "CAT6A六类双屏蔽双绞线工程、42U标准服务器机柜、10kVA中央不间断电源UPS"
  },
  "ระบบบริหารจัดการร้าน Billing & Cloud Member POS System": {
    en: "Billing Management & Cloud Member POS Cashier System",
    zh: "专业电竞上机计费与云端会员收银POS一体化系统"
  },
  "โปรแกรมคิดเงิน ลิ้นชักเก็บเงิน เครื่องสแกนบาร์โค้ด และระบบสมาชิกระดับคลาวด์เชื่อมต่อส่วนกลาง": {
    en: "Billing software, electronic cash drawer, QR barcode scanner, cloud member integration & mobile dashboard",
    zh: "机台控制计费系统、智能防盗钱箱、扫码盒子及云端会员积分联网系统"
  },
  "ค่าสิทธิ์แฟรนไชส์ G-SPEED & บริการ Turnkey Onboarding ครบวงจร": {
    en: "G-Speed Franchise License & Full Turnkey Onboarding Package",
    zh: "G-Speed 品牌特许加盟授权及全套交钥匙带店开业服务"
  },
  "สิทธิ์การใช้แบรนด์, แปลนก่อสร้าง 3D, จัดฝึกอบรมผู้จัดการและพนักงาน, การตลาดและโปรโมทเปิดร้าน": {
    en: "Brand license, 3D architectural blueprint, manager & staff SOP training, opening marketing campaign",
    zh: "品牌使用权、3D施工深化图纸、店长与店员全套SOP培训、盛大开业企划宣传"
  },
  "ยอดรวมประมาณการลงทุนก่อนภาษี (Subtotal):": {
    en: "Pre-Tax Estimated Subtotal:",
    zh: "税前预估投资小计 (Subtotal):"
  },
  "ภาษีมูลค่าเพิ่ม 7% (VAT 7%):": {
    en: "Value Added Tax (VAT 7%):",
    zh: "增值税 7% (VAT 7%):"
  },
  "เงื่อนไขการชำระเงินแบ่ง 3 งวด:": {
    en: "3-Stage Payment Terms:",
    zh: "分三期支付节点:"
  },
  "งวดที่ 1 (มัดจำลงนามสัญญา) 30% | งวดที่ 2 (จัดส่งและติดตั้งอุปกรณ์) 50% | งวดที่ 3 (ตรวจรับงานและเปิดร้าน) 20%": {
    en: "Stage 1 (Contract Deposit) 30% | Stage 2 (Delivery & Fit-Out) 50% | Stage 3 (Final Inspection & Handover) 20%",
    zh: "第一期 (签约首付定金) 30% | 第二期 (设备进场与装修) 50% | 第三期 (整店交付验收) 20%"
  },
  "การรับประกัน (Warranty):": {
    en: "Turnkey Warranty:",
    zh: "质保承诺 (Warranty):"
  },
  "อุปกรณ์คอมพิวเตอร์และเซิร์ฟเวอร์รับประกัน On-site Service 3 ปีเต็ม, ระบบ Network ดูแลตลอด 24 ชม. ผ่าน Cloud Monitoring": {
    en: "PCs and servers include 3-Year full On-site Service warranty; network supervised 24/7 via cloud NOC monitoring",
    zh: "电脑硬件与服务器享受3年原厂上门保修，网络系统通过云端网管中心24小时不间断监控"
  },
  "ระยะเวลาก่อสร้างและส่งมอบ:": {
    en: "Delivery Timeline:",
    zh: "工期交付时间:"
  },
  "ดำเนินการแล้วเสร็จภายใน 4 - 6 สัปดาห์ พร้อมเปิดให้บริการเชิงพาณิชย์": {
    en: "Fully delivered and ready for commercial operation within 4 to 6 weeks",
    zh: "自签约进场起 4 - 6 周内全部完工交付，达到盛大营业标准"
  },
  "ราคารวมงานแบบเบ็ดเสร็จ (Turnkey):": {
    en: "Turnkey Scope:",
    zh: "交钥匙总包说明:"
  },
  "รวมค่าขนส่ง, การติดตั้งสายระบบไฟฟ้า, สายแลน, การคอนฟิกระบบ Diskless และการอบรมบุคลากร": {
    en: "Includes freight, electrical installation, LAN cabling, diskless server deployment, and staff SOP training",
    zh: "包含物流运输、强电配电安装、六类网线敷设、无盘系统搭建及全员实操培训"
  },
  "ซ้าย 25%": {
    en: "Left 25%",
    zh: "左侧 25%"
  },
  "หลัง 25%": {
    en: "Back 25%",
    zh: "后侧 25%"
  },
  "ตรงกลาง 50%": {
    en: "Center 50%",
    zh: "居中 50%"
  },
  "ขวา 75%": {
    en: "Right 75%",
    zh: "右侧 75%"
  },
  "หน้า 75%": {
    en: "Front 75%",
    zh: "前侧 75%"
  },
  "นีออน LED": {
    en: "Neon LED",
    zh: "发光霓虹"
  },
  "อะคริลิกทอง": {
    en: "Gold Acrylic",
    zh: "镜面金亚克力"
  },
  "มินิมอลไซเบอร์": {
    en: "Cyber Minimal",
    zh: "极简赛博"
  },
  "ซุ้มแกรนด์": {
    en: "Grand Arch",
    zh: "宏伟门头"
  },
  "โมดูลที่เลือก": {
    en: "Selected Module",
    zh: "已选模块"
  },
  "คลิกดูภาพขยาย & สเปกเต็ม": {
    en: "Click to Inspect Full Specs",
    zh: "点击查看大图及详细规格"
  },
  "รายละเอียดราคาอุปกรณ์ในโมดูล": {
    en: "Module Price Breakdown",
    zh: "模块设备价格清单"
  },
  "วอลเปเปอร์:": {
    en: "Wallpaper:",
    zh: "壁纸风格:"
  },
  "วัสดุปูพื้น:": {
    en: "Flooring:",
    zh: "地面材质:"
  },
  "ประตูทางเข้า:": {
    en: "Store Entrance:",
    zh: "入户大门:"
  },
  "พอดีจอ": {
    en: "Fit Screen",
    zh: "适应屏幕"
  },
  "เลือกอยู่": {
    en: "Selected",
    zh: "已选中"
  },
  "ชิ้นใหม่! ลากจัดผังได้เลย": {
    en: "New item! Drag to position",
    zh: "新设备！点击拖动排布"
  },
  "คลิกลาก": {
    en: "Click & Drag",
    zh: "鼠标拖动"
  },
  "ย้ายอิสระ": {
    en: "Freely",
    zh: "自由移动"
  },
  "ลูกศร": {
    en: "Arrow Keys",
    zh: "方向键"
  },
  "บนคีย์บอร์ด": {
    en: "on keyboard",
    zh: "键盘微调"
  },
  "การควบคุม:": {
    en: "Navigation Controls:",
    zh: "视角与操作说明:"
  },
  "หมุนมุมมองอิสระ 360° ด้วยเมาส์ซ้าย • ซูมเข้า-ออกด้วยลูกกลิ้ง • คลิกเลือกวัตถุเพื่อดูราคาโต๊ะและเก้าอี้": {
    en: "360° Free orbit with Left Mouse • Zoom with scroll wheel • Click objects to view desk & chair pricing",
    zh: "鼠标左键360度旋转视角 • 滚轮缩放 • 点击设备查看桌椅详情及造价"
  },
  "ใบเสนอราคา / ESTIMATED QUOTATION": {
    en: "ESTIMATED QUOTATION",
    zh: "正式工程报价单 / ESTIMATED QUOTATION"
  },
  "เลขที่ใบเสนอราคา:": {
    en: "Quotation Ref:",
    zh: "报价单编号:"
  },
  "วันที่ออกเอกสาร:": {
    en: "Date Issued:",
    zh: "出单日期:"
  },
  "กำหนดยืนราคา:": {
    en: "Price Validity:",
    zh: "报价有效期:"
  },
  "30 วันนับจากวันที่ระบุ": {
    en: "30 Days from Issue Date",
    zh: "出单日起 30 天内有效"
  },
  "ข้อมูลลูกค้า / ผู้ขอรับสิทธิ์แฟรนไชส์ (CUSTOMER INFO)": {
    en: "Customer & Franchisee Info",
    zh: "客户及加盟申请人信息 (CUSTOMER INFO)"
  },
  "ชื่อลูกค้า / นิติบุคคล:": {
    en: "Client / Company Name:",
    zh: "客户名称 / 企业法人:"
  },
  "เบอร์โทรศัพท์ติดต่อ:": {
    en: "Phone Number:",
    zh: "联系电话:"
  },
  "อีเมลติดต่อ:": {
    en: "Email Address:",
    zh: "电子邮箱:"
  },
  "งบประมาณที่เตรียมไว้:": {
    en: "Planned Budget:",
    zh: "拟定投资预算:"
  },
  "ข้อมูลโครงการสาขา (PROJECT SPECIFICATIONS)": {
    en: "Project Specifications",
    zh: "分店项目规格明细 (PROJECT SPECIFICATIONS)"
  },
  "ทำเลที่ตั้งสาขา:": {
    en: "Target Location:",
    zh: "选址意向地段:"
  },
  "รูปแบบพื้นที่:": {
    en: "Building Type:",
    zh: "场地建筑形态:"
  },
  "ขนาดพื้นที่ร้าน:": {
    en: "Store Dimensions:",
    zh: "场地实用面积:"
  },
  "สเปกคอมพิวเตอร์:": {
    en: "Hardware Tier:",
    zh: "选用硬件档次:"
  },
  "ขนาดพื้นที่:": {
    en: "Total Area:",
    zh: "场地面积:"
  },
  "จำนวนเครื่อง:": {
    en: "Stations:",
    zh: "电脑台数:"
  },
  "ระยะเวลาติดตั้ง:": {
    en: "Installation Timeline:",
    zh: "施工周期:"
  },
  "4-6 สัปดาห์": {
    en: "4-6 Weeks",
    zh: "4-6 周"
  },
  "จุดคุ้มทุนประเมิน:": {
    en: "Est. Payback:",
    zh: "预估回本期:"
  },
  "แนบแปลนอาคาร:": {
    en: "Blueprint Attached:",
    zh: "附带图纸:"
  },
  "แบบแปลนอาคารแนบพิเศษ (Custom Blueprint Attached)": {
    en: "Custom Blueprint Attached",
    zh: "客户附带专属建筑图纸 (Custom Blueprint Attached)"
  },
  "ลำดับ": {
    en: "No.",
    zh: "序号"
  },
  "รายการรายละเอียดอุปกรณ์และงานระบบ (BOQ ITEM DESCRIPTION)": {
    en: "Item Description & Scope of Work (BOQ)",
    zh: "工程及设备明细项目说明 (BOQ DESCRIPTION)"
  },
  "จำนวน": {
    en: "Qty",
    zh: "数量"
  },
  "ราคาต่อหน่วย": {
    en: "Unit Price",
    zh: "单价"
  },
  "รวมเงิน (บาท)": {
    en: "Total (THB)",
    zh: "合价 (泰铢)"
  },
  "รวมราคาสินค้าและบริการ (SUBTOTAL):": {
    en: "SUBTOTAL:",
    zh: "合计总额 (SUBTOTAL):"
  },
  "ภาษีมูลค่าเพิ่ม (VAT 7%):": {
    en: "VAT (7%):",
    zh: "增值税 (VAT 7%):"
  },
  "ยอดรวมสุทธิทั้งสิ้น (GRAND TOTAL):": {
    en: "GRAND TOTAL:",
    zh: "最终结算法定总价 (GRAND TOTAL):"
  },
  "เงื่อนไขและข้อตกลงทางการค้า (COMMERCIAL TERMS & WARRANTY)": {
    en: "Commercial Terms & Warranty",
    zh: "商业条款及售后保证 (COMMERCIAL TERMS & WARRANTY)"
  },
  "ผู้อนุมัติเสนอราคา (Authorized Signature)": {
    en: "Authorized Signature",
    zh: "报价审批授权人 (Authorized Signature)"
  },
  "ฝ่ายพัฒนาธุรกิจแฟรนไชส์ / G-Speed Living Plus Co., Ltd.": {
    en: "Franchise Business Development / G-Speed Living Plus Co., Ltd.",
    zh: "特许加盟业务拓展部 / G-Speed Living Plus Co., Ltd."
  },
  "ผู้ขอรับสิทธิ์แฟรนไชส์ / ลูกค้า (Franchisee Acceptance)": {
    en: "Franchisee Acceptance / Client",
    zh: "加盟申请人确认签字 / 客户 (Franchisee Acceptance)"
  },
  "ผู้ตกลงยินยอมตามใบเสนอราคา": {
    en: "Agreement of Quotation",
    zh: "同意本报价单全部条款并确认"
  },
  "วันที่:": {
    en: "Date:",
    zh: "日期:"
  },
  "บันทึกแปลนร้านสำเร็จ • REF ID:": {
    en: "Store Plan Saved • REF ID:",
    zh: "方案保存成功 • 参考编号:"
  },
  "ขอขอบพระคุณที่ให้ความไว้วางใจ": {
    en: "Thank You for Your Trust",
    zh: "感谢您对 GLP 的信赖与支持"
  },
  "ทีมวิศวกรออกแบบระบบและที่ปรึกษาการลงทุนแฟรนไชส์ GLP ได้รับข้อมูลพิมพ์เขียวผังร้านของคุณเรียบร้อยแล้ว": {
    en: "The GLP engineering and franchise advisory team has received your 3D floor plan layout.",
    zh: "GLP 专业系统工程师及加盟投资顾问已成功接收您的3D场地规划方案。"
  },
  "การประสานงานติดต่อกลับภายใน 24 ชั่วโมง": {
    en: "Direct 24-Hour Follow-Up Promise",
    zh: "24小时内专属专家致电跟进承诺"
  },
  "ผังร้านที่จัดวาง": {
    en: "Planned Stations",
    zh: "规划电脑机位"
  },
  "งบประมาณประเมิน": {
    en: "Estimated Budget",
    zh: "预估投资额"
  },
  "สถานะอีเมลตอบกลับ": {
    en: "Email Dispatch",
    zh: "邮件送达状态"
  },
  "ส่งสำเนาอัตโนมัติแล้ว": {
    en: "Auto Copy Sent",
    zh: "自动确认函已发送"
  },
  "ระบบกำลังพาท่านกลับสู่หน้าแรกอัตโนมัติในอีก": {
    en: "Redirecting to homepage in",
    zh: "系统将在"
  },
  "วินาที": {
    en: "seconds",
    zh: "秒后返回首页"
  },
  "กลับสู่หน้าหลักทันที (Go to Home)": {
    en: "Go to Home Now",
    zh: "立即返回网站首页"
  },
  "ดูแปลนจำลองต่อ": {
    en: "Continue Exploring Plan",
    zh: "继续查看3D设计"
  },
  "ตารางเมตร": {
    en: "sqm",
    zh: "平方米"
  },
  "วัน": {
    en: "days",
    zh: "天"
  },
  "บาท": {
    en: "THB",
    zh: "泰铢"
  },
  "บาท/ชม.": {
    en: "THB/hr",
    zh: "泰铢/时"
  },
  "กว้าง": {
    en: "Width",
    zh: "宽度"
  },
  "ลึก": {
    en: "Depth",
    zh: "进深"
  },
  "ยกเลิก": {
    en: "Cancel",
    zh: "取消"
  },
  "ปิด": {
    en: "Close",
    zh: "关闭"
  },
  "เลือกโมเดลขนาดสำเร็จรูป (Preset Models):": {
    en: "Select Preset Models:",
    zh: "选择标准预设户型:"
  },
  "ความกว้างห้อง (Width):": {
    en: "Room Width (Width):",
    zh: "场地宽度 (Width):"
  },
  "ความลึก/ความยาวห้อง (Length):": {
    en: "Room Length (Length):",
    zh: "场地进深/长度 (Length):"
  },
  "พื้นที่ใช้สอยรวม:": {
    en: "Total Usable Area:",
    zh: "总使用面积:"
  },
  "รองรับได้ประมาณ": {
    en: "Supports approx.",
    zh: "约可容纳"
  },
  "แบบไม่อึดอัด": {
    en: "comfortably spaced",
    zh: "舒适不拥挤"
  },
  "มีแบบแปลนพิมพ์เขียวอาคารจริงของคุณอยู่แล้ว?": {
    en: "Already have an architectural blueprint of your building?",
    zh: "已有实体场地的建筑施工蓝图？"
  },
  "สลับไปอัปโหลดแปลน (ตัวเลือกเสริม)": {
    en: "Switch to Blueprint Upload (Optional)",
    zh: "切换至蓝图上传 (AI可选)"
  },
  "ลากไฟล์แปลนอาคารมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์ (ตัวเลือกเสริม)": {
    en: "Drag & drop blueprint file here or click to select (Optional)",
    zh: "拖拽建筑图纸至此处，或点击选择文件 (可选)"
  },
  "รองรับไฟล์ภาพแบบแปลนพิมพ์เขียว, ภาพวาดผังร้าน, สเก็ตช์ 2D, ไฟล์สแกน (PNG, JPG, WEBP)": {
    en: "Supports architectural blueprints, floor plan drawings, 2D sketches, scans (PNG, JPG, WEBP)",
    zh: "支持建筑蓝图、平面布置图、2D手绘草图、扫描件 (PNG, JPG, WEBP)"
  },
  "เลือกไฟล์แปลนจากเครื่อง": {
    en: "Choose Blueprint File",
    zh: "从本地选择蓝图"
  },
  "ทดลองใช้แปลนตัวอย่างอาคารพาณิชย์": {
    en: "Try Commercial Shophouse Sample",
    zh: "体验商用排屋示例蓝图"
  },
  "AI กำลังสแกนแปลนอาคาร วัดสเกลพื้นที่ และคำนวณการจัดสรรโซนร้านเกม...": {
    en: "AI is scanning blueprint, measuring area scale, and calculating esports zone layout...",
    zh: "AI 正在扫描图纸、测算空间比例并规划电竞分区..."
  },
  "แนบแปลนสำเร็จ:": {
    en: "Blueprint Attached:",
    zh: "已成功载入图纸:"
  },
  "ลบแปลนนี้": {
    en: "Remove Blueprint",
    zh: "移除图纸"
  },
  "เปลี่ยนไฟล์ใหม่": {
    en: "Change File",
    zh: "更换文件"
  },
  "ความกว้างอาคารจริง (Width):": {
    en: "Actual Building Width (Width):",
    zh: "实际建筑宽度 (Width):"
  },
  "ความลึก/ความยาวอาคารจริง (Length):": {
    en: "Actual Building Length (Length):",
    zh: "实际建筑进深 (Length):"
  },
  "ความจุเครื่องที่แนะนำ:": {
    en: "Recommended Capacity:",
    zh: "建议电脑台数:"
  },
  "งบลงทุนประมาณการ:": {
    en: "Estimated Investment:",
    zh: "预估投资总额:"
  },
  "กำไรสุทธิคาดการณ์:": {
    en: "Estimated Monthly Net Profit:",
    zh: "预计月净利润:"
  },
  "จุดคุ้มทุน (ROI):": {
    en: "Payback Period (ROI):",
    zh: "投资回报期 (ROI):"
  },
  "การจัดสรรสัดส่วนโซนที่คำนวณได้:": {
    en: "Calculated Zone Allocation:",
    zh: "智能测算分区规划比例:"
  },
  "คำแนะนำเชิงกลยุทธ์การจัดวางผังร้าน (Smart Layout Advice)": {
    en: "Smart Layout Strategic Advice",
    zh: "专业场地布局规划建议 (Smart Layout Advice)"
  },
  "1. ทางเข้า & เคาน์เตอร์แคชเชียร์": {
    en: "1. Entrance & Cashier Reception",
    zh: "1. 进店入口与收银接待台"
  },
  "ตั้งขนานประตูทางเข้า คุมทัศนวิสัย 180 องศา ต้อนรับลูกค้าทันทีและดูแลความปลอดภัย": {
    en: "Aligned with entrance with 180° visibility for immediate greeting and store safety monitoring",
    zh: "正对入口主通道，掌控180度全场视野，第一时间接待顾客并保障场内安全"
  },
  "2. แนวโต๊ะคอม (Island Back-to-Back)": {
    en: "2. Station Island (Back-to-Back)",
    zh: "2. 中央背靠背对战工作岛"
  },
  "วางเกาะกลางหันหลังชนกัน ซ่อนรางสายไฟและท่อแอร์ลงกลางโต๊ะ ประหยัดสายแลน 40% เว้นทางเดิน 1.5 ม.": {
    en: "Back-to-back center island concealing power and AC ducts, saving 40% LAN cabling with 1.5m aisles",
    zh: "中央背对背排布，线槽管线中置隐藏，节省40%网线耗材，预留1.5米宽阔主通道"
  },
  "3. ห้องซ้อม VIP Bootcamp Suite": {
    en: "3. VIP Bootcamp Suite",
    zh: "3. VIP 私享隔音集训包厢"
  },
  "กั้นห้องกระจกเก็บเสียงโซนด้านในสุด ลดเสียงรบกวน เหมาะกับการฝึกซ้อมทีมและสตรีมเมอร์": {
    en: "Soundproof glass partition in innermost area for noise isolation, ideal for team training and streaming",
    zh: "位于场馆最深处隔音独立空间，阻隔外界喧闹，专供战队集训拉练与主播直播"
  },
  "4. ห้องเซิร์ฟเวอร์ & ตู้ไฟ MDB": {
    en: "4. Server Room & Main MDB",
    zh: "4. 机房服务器与配电总闸 MDB"
  },
  "วางชิดผนังมุมหลังร้าน แยกห้องล็อก ปลอดภัย ติดตั้งระบบ UPS สำรองไฟและแอร์เฉพาะตัว 24 ชม.": {
    en: "Positioned against rear wall, secured access with UPS backup power and dedicated 24/7 cooling",
    zh: "紧贴后墙角落独立锁闭，配备大容量UPS不间断电源及24小时专用机房精密空调"
  },
  "จัดวางผังร้านอัตโนมัติ": {
    en: "Auto-Generate Layout",
    zh: "智能一键自动排布"
  },
  "จัดวางผังด้วยตนเอง": {
    en: "Design Layout Manually",
    zh: "手动自定义排布"
  },
  "ต้องการใช้ขนาดห้องและโมเดลสำเร็จรูปมาตรฐาน?": {
    en: "Want to use standard room dimensions and presets?",
    zh: "需要使用标准房间尺寸与预设模型？"
  },
  "สลับไปใช้โมเดลสำเร็จรูป (ค่าเริ่มต้น)": {
    en: "Switch to Presets (Default)",
    zh: "切换至预设户型 (默认)"
  },
  "ใช้แปลนอาคาร:": {
    en: "Using Blueprint:",
    zh: "使用图纸:"
  },
  "ขนาดพื้นที่จำลอง:": {
    en: "Simulated Space:",
    zh: "模拟场地尺寸:"
  },
  "ทำเลรอสำรวจพื้นที่จริง": {
    en: "Location awaiting site survey",
    zh: "地段等待实地勘测"
  },
  "ไม่ได้ระบุ": {
    en: "Not specified",
    zh: "未指定"
  },
  "โต๊ะและโครงสร้าง": {
    en: "Desk & Structure",
    zh: "电竞桌与主体结构"
  },
  "เก้าอี้เกมมิ่ง / ที่นั่ง": {
    en: "Gaming Chairs / Seats",
    zh: "电竞椅 / 席位"
  },
  "ไม่มี": {
    en: "None",
    zh: "无"
  },
  "มิติขนาด (กว้าง x ลึก x สูง)": {
    en: "Dimensions (W x D x H)",
    zh: "外形尺寸 (长 x 宽 x 高)"
  },
  "ราคารวมโมดูลนี้:": {
    en: "Total Module Price:",
    zh: "当前模块总价:"
  },
  "ตำแหน่ง & ทิศทางในห้อง": {
    en: "Position & Orientation",
    zh: "在场地中的坐标与角度"
  },
  "คลิกลากย้ายอิสระ หรือกดปุ่มลูกศร [↑][↓][←][→] บนคีย์บอร์ด": {
    en: "Drag freely or use arrow keys [↑][↓][←][→] on keyboard",
    zh: "点击自由拖动，或使用键盘方向键 [↑][↓][←][→] 微调"
  },
  "ยังไม่มีอุปกรณ์ในผังร้าน คลิกปุ่ม \\\"+ เพิ่มอุปกรณ์\\\" ด้านบนเพื่อเริ่มจัดวาง": {
    en: "No equipment in store layout yet. Click \\\"+ Add Equipment\\\" above to begin placing!",
    zh: "场地内暂无设备，点击上方 \\\"+ 添加设备\\\" 开始布置"
  },
  "สรุปงบลงทุนเบื้องต้น": {
    en: "Initial Investment Summary",
    zh: "初期投资预算汇总"
  },
  "ฮาร์ดแวร์": {
    en: "Hardware",
    zh: "电脑硬件"
  },
  "โต๊ะ เก้าอี้ และห้อง VIP:": {
    en: "Desks, Chairs & VIP Rooms:",
    zh: "桌椅与VIP包厢工程:"
  },
  "งานตกแต่ง Interior": {
    en: "Interior Decoration",
    zh: "室内装饰工程"
  },
  "ระบบแอร์ & ระบายอากาศ:": {
    en: "HVAC & Ventilation:",
    zh: "空调及新风排气系统:"
  },
  "ค่าแฟรนไชส์ & สิทธิ์การใช้แบรนด์:": {
    en: "Franchise License & Brand Rights:",
    zh: "加盟品牌授权及开业指导费:"
  },
  "งบประมาณลงทุนรวมโดยประมาณ:": {
    en: "Estimated Total Turnkey Investment:",
    zh: "全套整店投资预算预估:"
  },
  "* รวมฮาร์ดแวร์ ตกแต่ง และเปิดร้านพร้อมใช้งาน": {
    en: "* Turnkey package: includes hardware, interior fit-out, and grand opening readiness",
    zh: "* 包含全套电脑硬件、装修工程及开业即营运标准"
  },
  "ดูสเปกเต็ม": {
    en: "View Full Specs",
    zh: "查看详细规格"
  },
  "ดูสเปก": {
    en: "Specs",
    zh: "规格"
  },
  "โมเดลผังร้านสำเร็จรูป:": {
    en: "Preset Layout Models:",
    zh: "预设户型排布:"
  },
  "คุณต้องการล้างผังร้านทั้งหมดใช่หรือไม่?": {
    en: "Are you sure you want to clear all layout items?",
    zh: "您确定要清空场地中的所有设备布局吗？"
  },
  "วอลเปเปอร์ผนัง & วัสดุพื้น": {
    en: "Wall Finishes & Flooring",
    zh: "墙面风格与地面材质"
  },
  "คลิกเพื่อเปลี่ยนโทนสี แสดงผล 3D จำลองแสงทันที": {
    en: "Click to change finish tones, preview live in 3D",
    zh: "点击切换色彩风格，3D实时光影渲染"
  },
  "1. วอลเปเปอร์ผนังร้าน (Wall Finishes):": {
    en: "1. Wall Finishes:",
    zh: "1. 场馆墙面壁纸风格 (Wall Finishes):"
  },
  "2. วัสดุปูพื้นห้อง (Floor Finishes):": {
    en: "2. Floor Finishes:",
    zh: "2. 地面铺装材质 (Floor Finishes):"
  },
  "💡 ผนังและพื้นจะคำนวณในหมวด \\\"งานตกแต่ง Interior\\\" ในงบลงทุนโดยอัตโนมัติ": {
    en: "💡 Walls and floors are automatically calculated under \\\"Interior Decoration\\\" in budget.",
    zh: "💡 墙面与地面将自动汇总计入预算中的“室内装饰工程”类目。"
  },
  "← กลับไปดูรายละเอียดผังร้าน": {
    en: "← Back to Layout Details",
    zh: "← 返回场地规划详情"
  },
  "เพิ่มอุปกรณ์และโซนในร้าน": {
    en: "Add Equipment & Zones",
    zh: "添加设备与功能分区"
  },
  "กดปุ่ม + ด้านขวา เพื่อเพิ่มโต๊ะ/อุปกรณ์ลงในห้องทันที": {
    en: "Click the + button on the right to place items into layout instantly",
    zh: "点击右侧 + 按钮，即可将设备直接加入到场地中"
  },
  "โต๊ะคอม": {
    en: "Gaming Desks",
    zh: "电竞桌"
  },
  "บริการ/เคาน์เตอร์": {
    en: "Service/Counter",
    zh: "服务台/前台"
  },
  "ประตู/หน้าต่าง": {
    en: "Doors/Windows",
    zh: "门窗结构"
  },
  "จำนวนเครื่องในผังของคุณปัจจุบันคือ": {
    en: "Current stations in your layout:",
    zh: "您当前场地布局的电脑总数为"
  },
  "ผู้ดูแลระบบ:": {
    en: "Administrator:",
    zh: "管理员权限:"
  },
  "สามารถเข้าไปปรับแต่งรายละเอียดสเปก เพิ่มโมเดล หรือแก้ไขราคาต่อเครื่องและงานระบบได้ทุกจุด": {
    en: "Customize hardware specs, add components, or edit pricing at any time",
    zh: "可随时在后台调整硬件规格、新增机型或修改各项目单价"
  },
  "เปิดแผงจัดการสเปก & ราคา (Admin CMS)": {
    en: "Open Hardware & Pricing CMS",
    zh: "进入硬件配置与价格管理后台"
  },
  "/ เครื่อง (ครบชุด)": {
    en: "/ station (complete set)",
    zh: "/ 台 (完整全套)"
  },
  "เก้าอี้เกมมิ่ง:": {
    en: "Gaming Chair:",
    zh: "专业电竞椅:"
  },
  "รวมอยู่ในชุดโต๊ะเกมมิ่งแล้ว": {
    en: "Included in desk module set",
    zh: "已标配包含在电竞桌组中"
  },
  "เลือกสเปกนี้แล้ว": {
    en: "Selected This Tier",
    zh: "已选用该配置"
  },
  "เลือกใช้สเปกนี้": {
    en: "Select This Tier",
    zh: "选用该档次配置"
  },
  "ระบบเซิร์ฟเวอร์แม่ข่าย & เครือข่าย (Included Infrastructure)": {
    en: "Included Infrastructure: Master Server & Network",
    zh: "核心主控机房与极速网络工程 (标配包含)"
  },
  "แม่ข่าย NVMe Enterprise 2 เครื่อง รันเกม 200+ เกม ไม่ต้องลงเกมทีละเครื่อง อัปเดตแพทช์อัตโนมัติ 24 ชม.": {
    en: "Dual Enterprise NVMe Master servers supporting 200+ games with zero local installation and 24/7 automated patching",
    zh: "双台企业级NVMe高可用母机，承载200+款主流游戏，免单机安装，24小时自动更新游戏补丁"
  },
  "ระบบสำรองเน็ต 2 เส้น อัตโนมัติ ป้องกันเน็ตหลุด ปิงนิ่งระดับ 1-3ms พร้อม Cisco Managed Switch 10G": {
    en: "Automated dual-line fiber failover, ultra-low ping (< 3ms), and Cisco 10G managed switches",
    zh: "双ISP多线自动灾备与智能分流，确保比赛极低Ping (1-3ms)，配备思科万兆管理型交换机"
  },
  "ระบบบริหารจัดการสมาชิก คิดเงิน คุมเวลาหน้าจอ และสั่งเครื่องดื่มผ่านโต๊ะคอมพิวเตอร์ มีแดชบอร์ดดูยอดขายบนมือถือ": {
    en: "Member management, screen time billing, desktop food/beverage ordering, and real-time mobile revenue dashboard",
    zh: "集会员管理、上机计费、桌面扫码点餐点饮品于一体，支持手机端实时查看营收数据"
  },
  "ถัดไป: สรุปงบ": {
    en: "Next: Budget & ROI",
    zh: "下一步: 预算与回报"
  },
  "แจกแจงรายการต้นทุน (Turnkey Breakdown)": {
    en: "Turnkey Cost Breakdown",
    zh: "全套整店投资清单明细 (Turnkey Package)"
  },
  "หมวดหมู่งาน": {
    en: "Work Category",
    zh: "工程与采购大类"
  },
  "งบประมาณ": {
    en: "Budget",
    zh: "预算金额"
  },
  "1. เครื่องคอมพิวเตอร์ & เกมมิ่งเกียร์ (ไม่รวมเก้าอี้)": {
    en: "1. Battle Stations & Gaming Gear (Excl. Chairs)",
    zh: "1. 电竞电脑工作站与竞技外设 (不含椅)"
  },
  "2. ชุดโต๊ะคอมเกมมิ่ง & เก้าอี้ Ergonomic ในผัง": {
    en: "2. Gaming Desks & Ergonomic Chairs in Layout",
    zh: "2. 场内电竞对战桌椅与VIP包厢工程"
  },
  "โต๊ะเกมมิ่งพร้อมเก้าอี้ตามจำนวนที่นั่ง, ห้อง VIP, เวที 5v5": {
    en: "Gaming desks with chairs matching seats, VIP suites, 5v5 stage",
    zh: "含按座位配齐的电竞桌、人体工学椅、VIP私享包厢与5v5主舞台"
  },
  "3. ตกแต่งภายใน & ไฟ Linear Modern": {
    en: "3. Interior Fit-Out & Modern Linear Lighting",
    zh: "3. 室内硬装、吸音墙面与极光线性灯带"
  },
  "พื้น, ผนังกันเสียง, ไฟ Linear": {
    en: "Flooring, acoustic walls, architectural linear lights",
    zh: "地胶地毯、声学阻尼隔音墙、矩阵赛博灯光"
  },
  "4. งานระบบแอร์ Inverter": {
    en: "4. Commercial Inverter HVAC System",
    zh: "4. 商用变频多联机空调及新风系统"
  },
  "แอร์ Cassette 4 ทิศทาง": {
    en: "4-Way Cassette Inverter Air Conditioning",
    zh: "商用4面出风嵌入式变频吸顶空调"
  },
  "5. แม่ข่าย Diskless Server 10G": {
    en: "5. 10G Diskless Master Server System",
    zh: "5. 万兆无盘主控服务器集群"
  },
  "Server แม่ข่าย NVMe 2 ชุด + คลังเกม 200+ เกม อัปเดตอัตโนมัติ": {
    en: "Dual NVMe Master Servers + 200+ Game Library with auto-updates",
    zh: "双NVMe企业级主母机 + 200+款游戏库24小时全自动更新"
  },
  "6. เน็ตเวิร์ก Enterprise Dual-WAN": {
    en: "6. Enterprise Dual-WAN Network Infrastructure",
    zh: "6. 企业级双线极速网络与布线工程"
  },
  "Cisco 10G Switches, Mikrotik Router, สายแลน Shielded, ตู้ Rack": {
    en: "Cisco 10G switches, Mikrotik router, Shielded CAT6A, 42U rack",
    zh: "思科万兆交换机、Mikrotik核心路由、六类双屏蔽网线、42U机柜"
  },
  "7. ซอฟต์แวร์ Billing & เครื่อง POS": {
    en: "7. Billing Software & POS Cashier Terminal",
    zh: "7. 专业电竞计费系统与触控收银POS台"
  },
  "ระบบคุมเครื่อง, ลิ้นชักเก็บเงิน, สแกนเนอร์, ระบบสั่งอาหาร": {
    en: "Client management, cash drawer, QR barcode scanner, in-desk food ordering",
    zh: "机台控制客户端、智能钱箱、扫码盒、桌面扫码点餐点单系统"
  },
  "8. ค่าแฟรนไชส์ & การอบรมเปิดร้าน": {
    en: "8. Franchise License & Opening Training",
    zh: "8. 品牌加盟特许授权与开业带店指导"
  },
  "สิทธิ์ใช้แบรนด์ G-Speed, แบบ 3D ก่อสร้าง, อบรมพนักงาน, การตลาดวันเปิดร้าน": {
    en: "G-Speed brand license, 3D architectural drawings, staff SOP training, opening marketing",
    zh: "G-Speed品牌使用权、3D施工图纸、全套SOP员工培训、开业营销企划"
  },
  "รวมงบประมาณลงทุนทั้งสิ้น (Turnkey Package):": {
    en: "Total Turnkey Investment Package:",
    zh: "整店交付总投资额 (Turnkey Package):"
  },
  "พร้อมเปิดให้บริการ": {
    en: "Turnkey & Ready to Open",
    zh: "交钥匙工程 • 达到开业营业标准"
  },
  "จำลองรายได้ & ระยะเวลาคืนทุน (Interactive ROI)": {
    en: "Revenue & Payback Simulator (Interactive ROI)",
    zh: "财务收益测算与投资回本期 (Interactive ROI)"
  },
  "อัตราค่าบริการ (บาท / ชั่วโมง):": {
    en: "Service Rate (THB / Hour):",
    zh: "机时收费标准 (泰铢 / 小时):"
  },
  "อัตราการใช้งานเฉลี่ย (Occupancy Rate):": {
    en: "Average Daily Occupancy Rate:",
    zh: "平均每日上座率 (Occupancy Rate):"
  },
  "30% (น้อย)": {
    en: "30% (Low)",
    zh: "30% (偏低)"
  },
  "60% (มาตรฐาน)": {
    en: "60% (Standard)",
    zh: "60% (标准)"
  },
  "85% (ทำเลทอง)": {
    en: "85% (Prime Location)",
    zh: "85% (黄金商圈)"
  },
  "รายรับต่อเดือน": {
    en: "Monthly Revenue",
    zh: "月总营业额"
  },
  "กำไรสุทธิต่อเดือน": {
    en: "Net Monthly Profit",
    zh: "每月净利润"
  },
  "ผลตอบแทนต่อปี (ROI)": {
    en: "Annual Return (ROI)",
    zh: "年投资回报率 (ROI)"
  },
  "คืนทุนใน": {
    en: "Payback in",
    zh: "预计回本期"
  },
  "รายได้ค่าชั่วโมงเล่นเกม": {
    en: "Gaming Hours Revenue",
    zh: "电竞上机机时费收入"
  },
  "รายได้จำหน่ายเครื่องดื่ม & อาหารว่าง:": {
    en: "F&B and Snack Bar Revenue:",
    zh: "水吧饮品及轻食零售收入:"
  },
  "รายรับรวมต่อเดือน (Gross Revenue):": {
    en: "Gross Monthly Revenue:",
    zh: "每月总营业收入 (Gross):"
  },
  "ค่าไฟ & แอร์ประมาณการ:": {
    en: "Estimated Electricity & AC:",
    zh: "预估电费与空调能耗支出:"
  },
  "เงินเดือนพนักงาน (2-3 กะ):": {
    en: "Staff Salaries (2-3 Shifts):",
    zh: "员工薪酬支出 (2-3班制):"
  },
  "ค่าอินเทอร์เน็ต & เบ็ดเตล็ด:": {
    en: "Fiber Internet & Misc:",
    zh: "专用光纤专线费及杂项开销:"
  },
  "กำไรสุทธิโดยประมาณ (Net Profit):": {
    en: "Estimated Monthly Net Profit:",
    zh: "预估月度净利润 (Net Profit):"
  },
  "คาดว่าจะคืนทุนใน:": {
    en: "Estimated Payback:",
    zh: "预计回本周期:"
  },
  "ระยะเวลาในการก่อสร้างและติดตั้ง (ประมาณ 6 สัปดาห์)": {
    en: "Construction & Installation Timeline (~6 Weeks)",
    zh: "施工与交付进度计划 (约6周)"
  },
  "ขั้นตอนการดำเนินงานแบบ Turnkey ตั้งแต่สำรวจพื้นที่จนถึงวัน Grand Opening พร้อมเปิดให้บริการ": {
    en: "Turnkey process from site survey through Grand Opening day ready to operate",
    zh: "全套交钥匙流程：从实地勘测、硬装装修直至盛大开业正式营业"
  },
  "แบบแปลนสถาปัตยกรรม & งานระบบ (PNG)": {
    en: "Architectural Blueprint & MEP Layout (PNG)",
    zh: "建筑结构与弱电施工蓝图 (PNG)"
  },
  "บันทึกไฟล์ (PNG)": {
    en: "Save File (PNG)",
    zh: "保存蓝图 (PNG)"
  },
  "ย่อมุมมอง": {
    en: "Fit View",
    zh: "缩放适应"
  },
  "ซูม 100%": {
    en: "100% Zoom",
    zh: "100% 原尺寸放大"
  },
  "เปิดแท็บใหม่": {
    en: "Open in New Tab",
    zh: "在新标签页打开"
  },
  "ยืนยันนำอุปกรณ์ออกจากผัง?": {
    en: "Confirm Remove Equipment?",
    zh: "确认从场地中移除此设备？"
  },
  "คุณต้องการนำอุปกรณ์ชิ้นนี้ออกจากแบบจำลองผังร้าน 3D ใช่หรือไม่?": {
    en: "Are you sure you want to remove this equipment from the 3D layout?",
    zh: "您确定要将该设备从 3D 场地布局模型中移除吗？"
  },
  "ท่านสามารถเลือกเพิ่มอุปกรณ์ชิ้นนี้กลับเข้ามาใหม่ได้ตลอดเวลาจากแท็บ": {
    en: "You can re-add this equipment at any time from the tab:",
    zh: "您可以随时在以下标签页重新添加该设备:"
  },
  "ยืนยันนำอุปกรณ์ออก": {
    en: "Confirm Removal",
    zh: "确认移除"
  },
  "ราคารวมเซ็ตพร้อมติดตั้ง:": {
    en: "Set Price (Installed):",
    zh: "整套总价 (含专业安装):"
  },
  "(รวมภาษีและค่าติดตั้ง)": {
    en: "(Incl. VAT and installation)",
    zh: "(已含税金及上门调试安装费)"
  },
  "โต๊ะสั่งผลิต:": {
    en: "Custom Desk:",
    zh: "定制电竞工作桌:"
  },
  "เก้าอี้เกมมิ่ง": {
    en: "Gaming Chairs",
    zh: "专业电竞椅"
  },
  "1. สเปกวัสดุและโครงสร้างทางวิศวกรรม (Material & Construction)": {
    en: "1. Engineering Materials & Construction",
    zh: "1. 结构与工程材料规格 (Material & Construction)"
  },
  "2. สเปกเก้าอี้เกมมิ่งและอุปกรณ์ที่มาในเซ็ต (Included Furniture)": {
    en: "2. Ergonomic Gaming Chairs & Furniture",
    zh: "2. 配套电竞座椅与家具规格 (Included Furniture)"
  },
  "3. ระบบท่อร้อยสายไฟและโครงข่ายเน็ตเวิร์ก (Electrical & LAN Raceway)": {
    en: "3. Electrical & 10G LAN Raceway Infrastructure",
    zh: "3. 强弱电双分离线槽与万兆网管系统"
  },
  "4. การรับประกันและระยะเวลาผลิต (Warranty & Delivery)": {
    en: "4. Warranty & Production Lead Time",
    zh: "4. 售后质保与生产交付周期"
  },
  "การรับประกัน:": {
    en: "Warranty:",
    zh: "售后质保:"
  },
  "ระยะเวลาสั่งผลิต:": {
    en: "Production Lead Time:",
    zh: "生产交期:"
  },
  "โมเดลนี้ประกอบด้วย:": {
    en: "This model includes:",
    zh: "该模型套组包含:"
  },
  "เพิ่มลงในผัง 3D (Add to Plan)": {
    en: "Add to 3D Plan",
    zh: "添加至 3D 布局 (Add to Plan)"
  },
  "ต้องการให้ทีมงาน G-Speed ติดต่อกลับพร้อมส่งแปลนร้านนี้": {
    en: "Request G-Speed Team Contact & Send Store Plan",
    zh: "提交开店意向，获取3D图纸及官方顾问致电"
  },
  "ชื่อ - นามสกุล": {
    en: "Full Name",
    zh: "您的姓名"
  },
  "เบอร์โทรศัพท์ (ติดต่อกลับ)": {
    en: "Phone Number",
    zh: "联系电话"
  },
  "อีเมล (รับใบเสนอราคา)": {
    en: "Email Address (Receive Quote)",
    zh: "电子邮箱 (接收正式报价单)"
  },
  "งบประมาณลงทุนที่เตรียมไว้": {
    en: "Planned Investment Budget",
    zh: "预期准备的投资预算"
  },
  "ทำเลหรือจังหวัดที่สนใจเปิดสาขา": {
    en: "Target Location / Province",
    zh: "计划开店的城市或意向地段"
  },
  "กำลังส่งข้อมูล...": {
    en: "Sending Request...",
    zh: "正在提交中..."
  },
  "ส่งแปลนขอคำปรึกษา": {
    en: "Submit Plan & Get Consultation",
    zh: "提交方案免费获取咨询"
  },
  "ดาวน์โหลดแปลน (PNG)": {
    en: "Download Blueprint (PNG)",
    zh: "下载施工蓝图 (PNG)"
  },
  "กรุณากรอกชื่อ-นามสกุล, เบอร์โทรศัพท์ และอีเมลติดต่อให้ครบถ้วน": {
    en: "Please fill in your full name, phone number, and email completely.",
    zh: "请完整填写您的姓名、联系电话与电子邮箱。"
  },
  "Size S: ชุมชนสปีด (64 ตร.ม.)": {
    en: "Size S: Speed Community (64 sq.m.)",
    zh: "Size S: 速度社区 (64平方米)"
  },
  "ขนาด 8x8 ม. เหมาะกับพื้นที่อาคารพาณิชย์ 2 คูหา รองรับ 20-26 เครื่อง คืนทุนเร็ว": {
    en: "Size 8x8 m. Suitable for 2-unit commercial shophouse, accommodates 20-26 PCs, fast ROI.",
    zh: "尺寸 8x8 米，适用于商业建筑空间，2台，可容纳20-26台机器，投资回报快。"
  },
  "Size M: มาตรฐานอารีนา (120 ตร.ม.)": {
    en: "Size M: Arena Standard (120 sq.m.)",
    zh: "Size M: 竞技场标准 (120 平方米)"
  },
  "ขนาด 12x10 ม. เหมาะกับอาคารเดี่ยวหรือในห้าง รองรับ 40-52 เครื่อง พร้อมห้อง VIP 1 ห้อง": {
    en: "Size 12x10 m. Suitable for standalone building or mall, supports 40-52 PCs with 1 VIP room.",
    zh: "尺寸 12x10 米。适合单体建筑或购物中心，支持40-52台机器，1个VIP室。"
  },
  "Size L: แฟลกชิปอีสปอร์ตเซ็นเตอร์ (216 ตร.ม.)": {
    en: "Size L: Flagship Esports Center (216 sq.m.)",
    zh: "Size L: 旗舰电竞中心 (216 平方米)"
  },
  "ขนาด 18x12 ม. อารีนาเต็มรูปแบบ รองรับ 70-90+ เครื่อง พร้อมเวทีแข่งขัน 5v5 และ 2 VIP Rooms": {
    en: "Size 18x12 m. Full-scale arena, accommodates 70-90+ PCs with 5v5 battle stage and 2 VIP Rooms.",
    zh: "尺寸 18x12 米。完整的竞技场，可容纳 70-90 台以上机器，设有 5v5 比赛舞台和 2 个 VIP 室。"
  },
  "50,000 บาท + ถ้วยรางวัลเกียรติยศ": {
    en: "50,000 THB + Trophy of Honor",
    zh: "50,000 泰铢 + 荣誉奖杯"
  },
  "ถ้วยรางวัลเกียรติยศ": {
    en: "Trophy of Honor",
    zh: "荣誉奖杯"
  },
  "64 ทีม (เต็มแล้ว)": {
    en: "64 Teams (Full)",
    zh: "64 支战队 (名额已满)"
  },
  "(เต็มแล้ว)": {
    en: "(Full)",
    zh: "(名额已满)"
  },
  "เต็มแล้ว": {
    en: "Full",
    zh: "名额已满"
  },
  "กำลังโหลดข้อมูลระบบ...": {
    en: "Loading system data...",
    zh: "正在加载系统数据..."
  },
  "G-Speed Esport Arena System": {
    en: "G-Speed Esport Arena System",
    zh: "G-Speed 电竞馆智能管理系统"
  },
  "10-12 ตุลาคม 2026": {
    en: "October 10-12, 2026",
    zh: "2026年10月10-12日"
  },
  "13:00 - 19:00 น.": {
    en: "13:00 - 19:00",
    zh: "13:00 - 19:00"
  },
  "10-12 ตุลาคม 2026 (13:00 - 19:00 น.)": {
    en: "October 10-12, 2026 (13:00 - 19:00)",
    zh: "2026年10月10-12日 (13:00 - 19:00)"
  },
  "28-30 กันยายน 2026": {
    en: "September 28-30, 2026",
    zh: "2026年9月28-30日"
  },
  "100,000 บาท": {
    en: "100,000 THB",
    zh: "100,000 泰铢"
  },
  "150,000 บาท": {
    en: "150,000 THB",
    zh: "150,000 泰铢"
  },
  "ห้องวีไอพีส่วนตัว 5 ที่นั่ง VIP Private Suite กระจกเก็บเสียง": {
    en: "5-Seat Private VIP Suite with Soundproof Glass",
    zh: "5座私人VIP独立套房（双层隔音玻璃）"
  },
  "เวทีแข่งขันอีสปอร์ต 5v5 Tournament Stage 10 ที่นั่ง": {
    en: "5v5 Esports Tournament Stage (10 Seats)",
    zh: "5v5 职业电竞对战舞台（10座）"
  },
  "เคาน์เตอร์แคชเชียร์และต้อนรับ GLP Reception Counter": {
    en: "GLP Reception & Cashier Counter",
    zh: "GLP 品牌前台收银与接待柜台"
  },
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
export function translateDynamic(text, targetLang = null, triggerAsync = true) {
  if (!text) return '';

  // Auto detect active target language if not passed or default
  let effectiveLang = targetLang;
  if ((!effectiveLang || effectiveLang === 'th') && typeof window !== 'undefined') {
    const detected = window.__GLP_CURRENT_LANG__ || localStorage.getItem('glp_lang') || document.documentElement.lang;
    if (detected && detected !== 'th') {
      effectiveLang = detected;
    }
  }
  if (!effectiveLang) effectiveLang = 'th';
  if (effectiveLang === 'th') return typeof text === 'string' ? text : (text.th || text.title || '');

  // If text is an object containing multilingual keys
  if (typeof text === 'object') {
    if (text[effectiveLang]) return text[effectiveLang];
    if (text[`title_${effectiveLang}`]) return text[`title_${effectiveLang}`];
    if (text[`desc_${effectiveLang}`]) return text[`desc_${effectiveLang}`];
    if (text.title) text = text.title;
    else return '';
  }

  if (typeof text !== 'string') return String(text);
  const cleanText = text.trim();
  if (!cleanText) return '';

  // 1. Built-in Dictionary (Highest priority for accuracy)
  if (BUILT_IN_DICTIONARY[cleanText] && BUILT_IN_DICTIONARY[cleanText][effectiveLang]) {
    const val = BUILT_IN_DICTIONARY[cleanText][effectiveLang];
    // STRICT SAFEGUARD: Never return Thai characters as English or Chinese!
    if (!/[\u0E00-\u0E7F]/.test(val)) {
      return val;
    }
  }

  // 2. Direct Cache lookup
  if (translationCache[cleanText] && translationCache[cleanText][effectiveLang]) {
    return translationCache[cleanText][effectiveLang];
  }

  // 3. Regex / Pattern Transformer (Dates, currencies, attendees, times, slots)
  const patternMatch = matchPatternTranslation(cleanText, effectiveLang);
  if (patternMatch) {
    if (!translationCache[cleanText]) {
      translationCache[cleanText] = {};
    }
    translationCache[cleanText][effectiveLang] = patternMatch;
    return patternMatch;
  }

  // 4. Background Auto-translate for new/unseen Thai text
  const hasThai = /[\u0E00-\u0E7F]/.test(cleanText);
  if (hasThai && triggerAsync && typeof window !== 'undefined') {
    fetchOnlineTranslation(cleanText, effectiveLang).catch(() => {});
  }

  // Fallback to original text until translated
  return text;
}

/**
 * Get active AI Configuration for translation (Checks OpenRouter or Direct Gemini)
 */
export function getActiveAiConfig() {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Direct explicit translation key if saved in localStorage
    const directKey = localStorage.getItem('glp_ai_translation_key');
    const directProvider = localStorage.getItem('glp_ai_translation_provider') || 'openrouter';
    const directModel = localStorage.getItem('glp_ai_translation_model') || 'google/gemini-flash-3.8';
    if (directKey && directKey.trim()) {
      const cleanKey = directKey.trim();
      return {
        apiKey: cleanKey,
        provider: cleanKey.startsWith('AIzaSy') ? 'gemini' : directProvider,
        model: directModel
      };
    }

    // 2. Read from siteData in localStorage (shared with AdminCMS and AIChatWidget)
    const cmsRaw = localStorage.getItem('gspeed_site_cms_data_v2');
    if (cmsRaw) {
      const cms = JSON.parse(cmsRaw);
      const or = cms.openRouterSettings;
      if (or && or.apiKey && or.apiKey.trim()) {
        const key = or.apiKey.trim();
        return {
          apiKey: key,
          provider: key.startsWith('AIzaSy') ? 'gemini' : 'openrouter',
          model: or.model || 'google/gemini-flash-3.8',
          proxyUrl: or.useSecureProxy ? or.proxyUrl : null
        };
      }
    }
  } catch (e) {
    console.warn('Error reading AI config for translation:', e);
  }
  return null;
}

/**
 * Save custom AI Translation config to localStorage
 */
export function saveAiTranslationConfig({ apiKey, provider, model }) {
  if (typeof window === 'undefined') return;
  try {
    if (apiKey) localStorage.setItem('glp_ai_translation_key', apiKey.trim());
    if (provider) localStorage.setItem('glp_ai_translation_provider', provider);
    if (model) localStorage.setItem('glp_ai_translation_model', model);
  } catch (e) {
    console.warn('Failed to save AI translation config:', e);
  }
}

/**
 * Status indicator for Admin UI
 */
export function getAiTranslationStatus() {
  const config = getActiveAiConfig();
  if (config && config.apiKey) {
    return {
      active: true,
      provider: config.provider,
      model: config.model || 'Gemini Flash',
      label: config.provider === 'gemini' 
        ? '✨ Google Gemini Flash (Direct AI API)' 
        : `✨ Gemini Flash / LLM (${config.model || 'OpenRouter'})`
    };
  }
  return {
    active: false,
    provider: 'builtin',
    model: 'Google GTX + Arena Dictionary',
    label: '🌐 Free Auto-Translator (Built-in Engine)'
  };
}

/**
 * High-Precision AI Translation using Gemini Flash (via OpenRouter or Direct Gemini API)
 * Translates article/tournament context naturally with professional esports copywriting
 */
export async function translateEntityWithAI(entity, customConfig = null) {
  const config = customConfig || getActiveAiConfig();
  if (!config || !config.apiKey) {
    return autoTranslateEntityBuiltin(entity);
  }

  // Extract translatable text fields
  const translatable = {};
  if (entity.title && typeof entity.title === 'string') translatable.title = entity.title;
  if (entity.excerpt && typeof entity.excerpt === 'string') translatable.excerpt = entity.excerpt;
  if (entity.desc && typeof entity.desc === 'string') translatable.desc = entity.desc;
  if (entity.venue && typeof entity.venue === 'string') translatable.venue = entity.venue;
  if (entity.location && typeof entity.location === 'string') translatable.location = entity.location;
  if (entity.attendees && typeof entity.attendees === 'string') translatable.attendees = entity.attendees;
  if (entity.format && typeof entity.format === 'string') translatable.format = entity.format;
  if (entity.slots && typeof entity.slots === 'string') translatable.slots = entity.slots;
  if (entity.prizePool && typeof entity.prizePool === 'string') translatable.prizePool = entity.prizePool;
  if (entity.tag && typeof entity.tag === 'string') translatable.tag = entity.tag;
  if (entity.badge && typeof entity.badge === 'string') translatable.badge = entity.badge;

  if (Array.isArray(entity.contentParagraphs) && entity.contentParagraphs.length > 0) {
    translatable.contentParagraphs = entity.contentParagraphs;
  }
  if (Array.isArray(entity.rules) && entity.rules.length > 0) {
    translatable.rules = entity.rules;
  }

  // Check if any Thai characters exist in payload
  const hasThai = Object.values(translatable).some(val => 
    typeof val === 'string' 
      ? /[\u0E00-\u0E7F]/.test(val) 
      : Array.isArray(val) && val.some(item => typeof item === 'string' && /[\u0E00-\u0E7F]/.test(item))
  );

  if (!hasThai) {
    return autoTranslateEntityBuiltin(entity);
  }

  const systemPrompt = `You are an elite bilingual esports journalist, gaming content creator, and professional localization editor for "GLP : G-Speed Living Plus" (Bangkok's premier 24/7 esports tournament venue & gaming center).
Translate the provided Thai gaming/tournament content into:
1. Natural, engaging, native-sounding English ("en")
2. Fluent, authentic Simplified Chinese ("zh")

CRITICAL GUIDELINES:
- Do NOT use literal word-for-word machine translation. Write compelling, high-energy gaming copy that resonates with esports players and fans (Valorant, CS2, PUBG, Apex, MOBA).
- Retain official esports terms naturally: 5v5 Tournament Stage, LAN Final, Pro Circuit, Bootcamp, Bracket, Roster, Double Elimination, Ping, FPS, 360Hz, RTX 40 Series, Diskless Server, LED Wall, Caster Desk.
- Keep numbers, currency figures (e.g. 100,000 THB / 100,000 泰铢), and times accurate.
- Output MUST strictly be a valid JSON object with keys "en" and "zh", containing the exact same translated property names as the input.
- Do NOT wrap in markdown or include text outside the JSON object.`;

  const userPrompt = `Translate this JSON object into "en" and "zh":\n${JSON.stringify(translatable, null, 2)}`;

  let enResult = null;
  let zhResult = null;

  try {
    if (config.provider === 'gemini' || config.apiKey.startsWith('AIzaSy')) {
      // Direct Google Gemini Generative Language API
      const geminiModel = config.model?.includes('2.0') ? 'gemini-2.0-flash' : 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${config.apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        })
      });

      if (!res.ok) throw new Error(`Gemini API HTTP ${res.status}`);
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const clean = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        enResult = parsed.en;
        zhResult = parsed.zh;
      }
    } else {
      // OpenRouter API (Supports google/gemini-flash-3.8, google/gemini-2.0-flash, etc.)
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
          'X-Title': 'GLP Esports Arena'
        },
        body: JSON.stringify({
          model: config.model || 'google/gemini-flash-3.8',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3
        })
      });

      if (!res.ok) throw new Error(`OpenRouter API HTTP ${res.status}`);
      const data = await res.json();
      const replyContent = data.choices?.[0]?.message?.content;
      if (replyContent) {
        const clean = replyContent.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        enResult = parsed.en;
        zhResult = parsed.zh;
      }
    }
  } catch (apiErr) {
    console.warn('AI Translation via LLM failed, falling back to built-in translation engine:', apiErr);
    return autoTranslateEntityBuiltin(entity);
  }

  // Merge high-grade AI translations into cloned entity
  const cloned = { ...entity };

  if (enResult && typeof enResult === 'object') {
    if (enResult.title) { cloned.title_en = enResult.title; saveToTranslationCache(entity.title, 'en', enResult.title); }
    if (enResult.excerpt) { cloned.excerpt_en = enResult.excerpt; saveToTranslationCache(entity.excerpt, 'en', enResult.excerpt); }
    if (enResult.desc) { cloned.desc_en = enResult.desc; saveToTranslationCache(entity.desc, 'en', enResult.desc); }
    if (enResult.venue) { cloned.venue_en = enResult.venue; saveToTranslationCache(entity.venue, 'en', enResult.venue); }
    if (enResult.location) { cloned.location_en = enResult.location; saveToTranslationCache(entity.location, 'en', enResult.location); }
    if (enResult.attendees) { cloned.attendees_en = enResult.attendees; saveToTranslationCache(entity.attendees, 'en', enResult.attendees); }
    if (enResult.format) { cloned.format_en = enResult.format; saveToTranslationCache(entity.format, 'en', enResult.format); }
    if (enResult.slots) { cloned.slots_en = enResult.slots; saveToTranslationCache(entity.slots, 'en', enResult.slots); }
    if (enResult.prizePool) { cloned.prizePool_en = enResult.prizePool; saveToTranslationCache(entity.prizePool, 'en', enResult.prizePool); }
    if (enResult.tag) cloned.tag_en = enResult.tag;
    if (enResult.badge) cloned.badge_en = enResult.badge;
    if (Array.isArray(enResult.contentParagraphs)) cloned.contentParagraphs_en = enResult.contentParagraphs;
    if (Array.isArray(enResult.rules)) cloned.rules_en = enResult.rules;
  }

  if (zhResult && typeof zhResult === 'object') {
    if (zhResult.title) { cloned.title_zh = zhResult.title; saveToTranslationCache(entity.title, 'zh', zhResult.title); }
    if (zhResult.excerpt) { cloned.excerpt_zh = zhResult.excerpt; saveToTranslationCache(entity.excerpt, 'zh', zhResult.excerpt); }
    if (zhResult.desc) { cloned.desc_zh = zhResult.desc; saveToTranslationCache(entity.desc, 'zh', zhResult.desc); }
    if (zhResult.venue) { cloned.venue_zh = zhResult.venue; saveToTranslationCache(entity.venue, 'zh', zhResult.venue); }
    if (zhResult.location) { cloned.location_zh = zhResult.location; saveToTranslationCache(entity.location, 'zh', zhResult.location); }
    if (zhResult.attendees) { cloned.attendees_zh = zhResult.attendees; saveToTranslationCache(entity.attendees, 'zh', zhResult.attendees); }
    if (zhResult.format) { cloned.format_zh = zhResult.format; saveToTranslationCache(entity.format, 'zh', zhResult.format); }
    if (zhResult.slots) { cloned.slots_zh = zhResult.slots; saveToTranslationCache(entity.slots, 'zh', zhResult.slots); }
    if (zhResult.prizePool) { cloned.prizePool_zh = zhResult.prizePool; saveToTranslationCache(entity.prizePool, 'zh', zhResult.prizePool); }
    if (zhResult.tag) cloned.tag_zh = zhResult.tag;
    if (zhResult.badge) cloned.badge_zh = zhResult.badge;
    if (Array.isArray(zhResult.contentParagraphs)) cloned.contentParagraphs_zh = zhResult.contentParagraphs;
    if (Array.isArray(zhResult.rules)) cloned.rules_zh = zhResult.rules;
  }

  // Pass through built-in translator for any remaining secondary fields (gallery photos, timetables, etc.)
  return autoTranslateEntityBuiltin(cloned);
}

/**
 * Main Auto Translation Entrypoint
 * Intelligently uses Gemini Flash / OpenRouter AI if configured, with instant fallback to built-in engine
 */
export async function autoTranslateEntity(entity, options = {}) {
  const config = options.aiConfig || getActiveAiConfig();
  if (config && config.apiKey && !options.skipAI) {
    try {
      return await translateEntityWithAI(entity, config);
    } catch (err) {
      console.warn('AI translation failed, falling back to built-in translator:', err);
      return autoTranslateEntityBuiltin(entity);
    }
  }
  return autoTranslateEntityBuiltin(entity);
}

/**
 * Built-in deterministic + Google GTX pre-translator
 */
export async function autoTranslateEntityBuiltin(entity) {
  if (!entity || typeof entity !== 'object') return entity;
  const cloned = { ...entity };

  const fieldsToTranslate = [
    'title', 'desc', 'venue', 'prizePool', 'quote', 'author', 
    'partner', 'location', 'excerpt', 'attendees', 'tag', 'badge',
    'format', 'slots', 'date', 'time', 'regStartDate', 'regEndDate',
    'readTime', 'category', 'streamChannel'
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

  // Translate prizeDistribution array
  if (Array.isArray(cloned.prizeDistribution)) {
    const enPrizes = [];
    const zhPrizes = [];
    for (const pz of cloned.prizeDistribution) {
      try {
        const [rankEn, rankZh, rewardEn, rewardZh] = await Promise.all([
          pz.rank ? fetchOnlineTranslation(pz.rank, 'en') : Promise.resolve(''),
          pz.rank ? fetchOnlineTranslation(pz.rank, 'zh') : Promise.resolve(''),
          pz.reward ? fetchOnlineTranslation(pz.reward, 'en') : Promise.resolve(''),
          pz.reward ? fetchOnlineTranslation(pz.reward, 'zh') : Promise.resolve('')
        ]);
        enPrizes.push({ ...pz, rank: rankEn, reward: rewardEn });
        zhPrizes.push({ ...pz, rank: rankZh, reward: rewardZh });
        if (pz.rank) {
          saveToTranslationCache(pz.rank, 'en', rankEn);
          saveToTranslationCache(pz.rank, 'zh', rankZh);
        }
        if (pz.reward) {
          saveToTranslationCache(pz.reward, 'en', rewardEn);
          saveToTranslationCache(pz.reward, 'zh', rewardZh);
        }
      } catch (_) {
        enPrizes.push(pz);
        zhPrizes.push(pz);
      }
    }
    cloned.prizeDistribution_en = enPrizes;
    cloned.prizeDistribution_zh = zhPrizes;
  }

  // Translate scheduleTimetable array
  if (Array.isArray(cloned.scheduleTimetable)) {
    const enSched = [];
    const zhSched = [];
    for (const st of cloned.scheduleTimetable) {
      try {
        const [timeEn, timeZh, stageEn, stageZh] = await Promise.all([
          st.time ? fetchOnlineTranslation(st.time, 'en') : Promise.resolve(''),
          st.time ? fetchOnlineTranslation(st.time, 'zh') : Promise.resolve(''),
          st.stage ? fetchOnlineTranslation(st.stage, 'en') : Promise.resolve(''),
          st.stage ? fetchOnlineTranslation(st.stage, 'zh') : Promise.resolve('')
        ]);
        enSched.push({ ...st, time: timeEn, stage: stageEn });
        zhSched.push({ ...st, time: timeZh, stage: stageZh });
        if (st.stage) {
          saveToTranslationCache(st.stage, 'en', stageEn);
          saveToTranslationCache(st.stage, 'zh', stageZh);
        }
      } catch (_) {
        enSched.push(st);
        zhSched.push(st);
      }
    }
    cloned.scheduleTimetable_en = enSched;
    cloned.scheduleTimetable_zh = zhSched;
  }

  // Translate galleryPhotos captions
  if (Array.isArray(cloned.galleryPhotos)) {
    const enPhotos = [];
    const zhPhotos = [];
    for (const photo of cloned.galleryPhotos) {
      if (photo.caption && typeof photo.caption === 'string' && /[\u0E00-\u0E7F]/.test(photo.caption)) {
        try {
          const [capEn, capZh] = await Promise.all([
            fetchOnlineTranslation(photo.caption, 'en'),
            fetchOnlineTranslation(photo.caption, 'zh')
          ]);
          enPhotos.push({ ...photo, caption: capEn });
          zhPhotos.push({ ...photo, caption: capZh });
          saveToTranslationCache(photo.caption, 'en', capEn);
          saveToTranslationCache(photo.caption, 'zh', capZh);
        } catch (_) {
          enPhotos.push(photo);
          zhPhotos.push(photo);
        }
      } else {
        enPhotos.push(photo);
        zhPhotos.push(photo);
      }
    }
    cloned.galleryPhotos_en = enPhotos;
    cloned.galleryPhotos_zh = zhPhotos;
  }

  // Translate SEO fields
  if (cloned.seo && typeof cloned.seo === 'object') {
    const seoEn = { ...cloned.seo };
    const seoZh = { ...cloned.seo };
    const seoTitle = cloned.seo.metaTitle || '';
    const seoDesc = cloned.seo.metaDesc || cloned.seo.metaDescription || '';

    if (seoTitle && /[\u0E00-\u0E7F]/.test(seoTitle)) {
      try {
        const [tEn, tZh] = await Promise.all([
          fetchOnlineTranslation(seoTitle, 'en'),
          fetchOnlineTranslation(seoTitle, 'zh')
        ]);
        seoEn.metaTitle = tEn;
        seoZh.metaTitle = tZh;
      } catch (_) {}
    }

    if (seoDesc && /[\u0E00-\u0E7F]/.test(seoDesc)) {
      try {
        const [dEn, dZh] = await Promise.all([
          fetchOnlineTranslation(seoDesc, 'en'),
          fetchOnlineTranslation(seoDesc, 'zh')
        ]);
        seoEn.metaDesc = dEn;
        seoEn.metaDescription = dEn;
        seoZh.metaDesc = dZh;
        seoZh.metaDescription = dZh;
      } catch (_) {}
    }

    cloned.seo_en = seoEn;
    cloned.seo_zh = seoZh;
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
