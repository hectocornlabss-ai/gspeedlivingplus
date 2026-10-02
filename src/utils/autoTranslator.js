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
  // Common Venues
  'GLP : G Speed Living Plus รามคำแหง 53': {
    en: 'GLP : G Speed Living Plus Ramkhamhaeng 53',
    zh: 'GLP : G Speed Living Plus 曼谷兰甘亨53巷'
  },
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

  // 1. Direct Cache lookup
  if (translationCache[cleanText] && translationCache[cleanText][targetLang]) {
    return translationCache[cleanText][targetLang];
  }

  // 2. Built-in Dictionary
  if (BUILT_IN_DICTIONARY[cleanText] && BUILT_IN_DICTIONARY[cleanText][targetLang]) {
    return BUILT_IN_DICTIONARY[cleanText][targetLang];
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
