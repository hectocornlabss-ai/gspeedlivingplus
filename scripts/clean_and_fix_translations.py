import sys
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

CURATED_FIXES = {
  "Size S: ชุมชนสปีด (64 ตร.ม.)": {
    "en": "Size S: Speed Community (64 sq.m.)",
    "zh": "Size S: 速度社区 (64平方米)"
  },
  "ขนาด 8x8 ม. เหมาะกับพื้นที่อาคารพาณิชย์ 2 คูหา รองรับ 20-26 เครื่อง คืนทุนเร็ว": {
    "en": "Size 8x8 m. Suitable for 2-unit commercial shophouse, accommodates 20-26 PCs, fast ROI.",
    "zh": "尺寸 8x8 米，适用于商业建筑空间，2台，可容纳20-26台机器，投资回报快。"
  },
  "Size M: มาตรฐานอารีนา (120 ตร.ม.)": {
    "en": "Size M: Arena Standard (120 sq.m.)",
    "zh": "Size M: 竞技场标准 (120 平方米)"
  },
  "ขนาด 12x10 ม. เหมาะกับอาคารเดี่ยวหรือในห้าง รองรับ 40-52 เครื่อง พร้อมห้อง VIP 1 ห้อง": {
    "en": "Size 12x10 m. Suitable for standalone building or mall, supports 40-52 PCs with 1 VIP room.",
    "zh": "尺寸 12x10 米。适合单体建筑或购物中心，支持40-52台机器，1个VIP室。"
  },
  "Size L: แฟลกชิปอีสปอร์ตเซ็นเตอร์ (216 ตร.ม.)": {
    "en": "Size L: Flagship Esports Center (216 sq.m.)",
    "zh": "Size L: 旗舰电竞中心 (216 平方米)"
  },
  "ขนาด 18x12 ม. อารีนาเต็มรูปแบบ รองรับ 70-90+ เครื่อง พร้อมเวทีแข่งขัน 5v5 และ 2 VIP Rooms": {
    "en": "Size 18x12 m. Full-scale arena, accommodates 70-90+ PCs with 5v5 battle stage and 2 VIP Rooms.",
    "zh": "尺寸 18x12 米。完整的竞技场，可容纳 70-90 台以上机器，设有 5v5 比赛舞台和 2 个 VIP 室。"
  },
  "โทนขาว-น้ำเงิน มาตรฐานแบรนด์ GLP สว่าง สบายตา ทันสมัย": {
    "en": "White-blue GLP signature brand palette, bright, comfortable and modern",
    "zh": "白蓝 GLP 经典品牌色调，明亮舒适、科技现代"
  },
  "โทนขาว-เทาอ่อน ไฟ Warm White สะอาดตา หรูหรา เรียบหรู": {
    "en": "White and soft grey tones with warm white lighting, pristine and understated luxury",
    "zh": "白浅灰暖白光，清爽雅致，高端轻奢"
  },
  "ดำ-กราไฟต์ ดุดัน ไฟ Linear สีเดียว สไตล์นักกีฬา Pro Circuit": {
    "en": "Black graphite aggressive aesthetic, monochromatic linear accent lights, built for pro esports athletes",
    "zh": "黑石墨色调硬核冷峻，单色线性氛围灯，专为职业电竞打造"
  },
  "50,000 บาท + ถ้วยรางวัลเกียรติยศ": {
    "en": "50,000 THB + Trophy of Honor",
    "zh": "50,000 泰铢 + 荣誉奖杯"
  },
  "ถ้วยรางวัลเกียรติยศ": {
    "en": "Trophy of Honor",
    "zh": "荣誉奖杯"
  },
  "64 ทีม (เต็มแล้ว)": {
    "en": "64 Teams (Full)",
    "zh": "64 支战队 (名额已满)"
  },
  "(เต็มแล้ว)": {
    "en": "(Full)",
    "zh": "(名额已满)"
  },
  "เต็มแล้ว": {
    "en": "Full",
    "zh": "名额已满"
  },
  "กำลังโหลดข้อมูลระบบ...": {
    "en": "Loading system data...",
    "zh": "正在加载系统数据..."
  },
  "G-Speed Esport Arena System": {
    "en": "G-Speed Esport Arena System",
    "zh": "G-Speed 电竞馆智能管理系统"
  },
  "10-12 ตุลาคม 2026": {
    "en": "October 10-12, 2026",
    "zh": "2026年10月10-12日"
  },
  "13:00 - 19:00 น.": {
    "en": "13:00 - 19:00",
    "zh": "13:00 - 19:00"
  },
  "10-12 ตุลาคม 2026 (13:00 - 19:00 น.)": {
    "en": "October 10-12, 2026 (13:00 - 19:00)",
    "zh": "2026年10月10-12日 (13:00 - 19:00)"
  },
  "28-30 กันยายน 2026": {
    "en": "September 28-30, 2026",
    "zh": "2026年9月28-30日"
  },
  "24-25 ตุลาคม 2026": {
    "en": "October 24-25, 2026",
    "zh": "2026年10月24-25日"
  },
  "100,000 บาท": {
    "en": "100,000 THB",
    "zh": "100,000 泰铢"
  },
  "150,000 บาท": {
    "en": "150,000 THB",
    "zh": "150,000 泰铢"
  },
  "ห้องวีไอพีส่วนตัว 5 ที่นั่ง VIP Private Suite กระจกเก็บเสียง": {
    "en": "5-Seat Private VIP Suite with Soundproof Glass",
    "zh": "5座私人VIP独立套房（双层隔音玻璃）"
  },
  "เวทีแข่งขันอีสปอร์ต 5v5 Tournament Stage 10 ที่นั่ง": {
    "en": "5v5 Esports Tournament Stage (10 Seats)",
    "zh": "5v5 职业电竞对战舞台（10座）"
  },
  "เคาน์เตอร์แคชเชียร์และต้อนรับ GLP Reception Counter": {
    "en": "GLP Reception & Cashier Counter",
    "zh": "GLP 品牌前台收银与接待柜台"
  }
}

thai_regex = re.compile(r'[\u0E00-\u0E7F]')

# ==========================================
# 1. FIX LanguageContext.jsx
# ==========================================
print('--- Processing src/context/LanguageContext.jsx ---')
with open(r'c:\Gspeed\src\context\LanguageContext.jsx', 'r', encoding='utf-8') as f:
    lc_content = f.read()

# Replace translateDynamic implementation with strict safeguard
old_lc_td = """  // Helper to translate mock, CMS, and dynamic user content
  const translateDynamic = useCallback((text, forcedLang) => {
    const targetLang = forcedLang || language;
    if (!text || targetLang === 'th') return text;
    const str = typeof text === 'string' ? text.trim() : '';
    if (str && CONTENT_TRANSLATIONS[str] && CONTENT_TRANSLATIONS[str][targetLang]) {
      return CONTENT_TRANSLATIONS[str][targetLang];
    }
    return autoTranslateDynamic(text, targetLang);
  }, [language]);"""

new_lc_td = """  // Helper to translate mock, CMS, and dynamic user content
  const translateDynamic = useCallback((text, forcedLang) => {
    const targetLang = forcedLang || language;
    if (!text || targetLang === 'th') return text;
    const str = typeof text === 'string' ? text.trim() : '';
    if (str && CONTENT_TRANSLATIONS[str] && CONTENT_TRANSLATIONS[str][targetLang]) {
      const res = CONTENT_TRANSLATIONS[str][targetLang];
      // STRICT SAFEGUARD: Never return Thai characters as English or Chinese!
      if (!/[\\u0E00-\\u0E7F]/.test(res)) {
        return res;
      }
    }
    return autoTranslateDynamic(text, targetLang);
  }, [language]);"""

if old_lc_td in lc_content:
    lc_content = lc_content.replace(old_lc_td, new_lc_td)
    print('Updated translateDynamic with safeguard in LanguageContext.jsx')
else:
    print('Warning: old_lc_td not found in LanguageContext.jsx, checking regex...')
    lc_content = re.sub(
        r'const translateDynamic = useCallback\(\(text, forcedLang\) => \{[\s\S]*?return autoTranslateDynamic\(text, targetLang\);\s*\}, \[language\]\);',
        new_lc_td.strip(),
        lc_content
    )

# Extract and clean CONTENT_TRANSLATIONS
dict_match = re.search(r'export const CONTENT_TRANSLATIONS = {([\s\S]*?)};\n\nexport function', lc_content)
if dict_match:
    dict_body = dict_match.group(1)
    # Parse existing entries
    pattern = re.compile(r'"([^"\\]*(?:\\.[^"\\]*)*)":\s*{\s*en:\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*zh:\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*},?')
    cleaned_entries = {}
    for m in pattern.finditer(dict_body):
        k, en, zh = m.group(1), m.group(2), m.group(3)
        # Skip if en or zh contains Thai
        if thai_regex.search(en) or thai_regex.search(zh):
            continue
        cleaned_entries[k] = {"en": en, "zh": zh}

    print(f'Preserved clean entries in LanguageContext: {len(cleaned_entries)}')

    # Merge CURATED_FIXES
    for k, v in CURATED_FIXES.items():
        cleaned_entries[k] = v

    print(f'Total entries after applying curated fixes: {len(cleaned_entries)}')

    # Format new CONTENT_TRANSLATIONS
    lines = []
    for k, v in cleaned_entries.items():
        lines.append(f'  {json.dumps(k, ensure_ascii=False)}: {{\n    en: {json.dumps(v["en"], ensure_ascii=False)},\n    zh: {json.dumps(v["zh"], ensure_ascii=False)}\n  }},')
    new_dict_str = "export const CONTENT_TRANSLATIONS = {\n" + "\n".join(lines) + "\n};\n\nexport function"

    lc_content = lc_content[:dict_match.start()] + new_dict_str + lc_content[dict_match.end():]
    with open(r'c:\Gspeed\src\context\LanguageContext.jsx', 'w', encoding='utf-8') as f:
        f.write(lc_content)
    print('Successfully rewrote LanguageContext.jsx!')
else:
    print('Error: Could not match CONTENT_TRANSLATIONS in LanguageContext.jsx')

# ==========================================
# 2. FIX autoTranslator.js
# ==========================================
print('\n--- Processing src/utils/autoTranslator.js ---')
with open(r'c:\Gspeed\src\utils\autoTranslator.js', 'r', encoding='utf-8') as f:
    at_content = f.read()

# Add missing regex patterns in matchPatternTranslation
# Check if prizeTrophyRegex exists
if 'prizePlusTrophyRegex' not in at_content:
    pattern_insertion = """  // 1d. Currency with trophy: e.g. "50,000 บาท + ถ้วยรางวัลเกียรติยศ"
  const prizePlusTrophyRegex = /^([\\d,]+)\\s*บาท\\s*\\+\\s*(.+)$/i;
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
  const slotFullRegex = /^(\\d+)\\s*ทีม\\s*\\((?:เต็มแล้ว|เต็ม)\\)$/i;
  const slotFullMatch = str.match(slotFullRegex);
  if (slotFullMatch) {
    return lang === 'zh'
      ? `${slotFullMatch[1]} 支战队 (名额已满)`
      : `${slotFullMatch[1]} Teams (Full)`;
  }
"""
    at_content = at_content.replace(
        "const prizeTotalRegex = /^(?:เงินรางวัลรวม\\s*)?([\\d,]+)\\s*บาท$/i;",
        pattern_insertion + "\n  const prizeTotalRegex = /^(?:เงินรางวัลรวม\\s*)?([\\d,]+)\\s*บาท$/i;"
    )
    print('Injected prizeTrophyRegex and slotFullRegex into autoTranslator.js')

# Update translateDynamic with safeguard in autoTranslator.js
old_dict_check = """  // 1. Built-in Dictionary (Highest priority for accuracy)
  if (BUILT_IN_DICTIONARY[cleanText] && BUILT_IN_DICTIONARY[cleanText][effectiveLang]) {
    return BUILT_IN_DICTIONARY[cleanText][effectiveLang];
  }"""

new_dict_check = """  // 1. Built-in Dictionary (Highest priority for accuracy)
  if (BUILT_IN_DICTIONARY[cleanText] && BUILT_IN_DICTIONARY[cleanText][effectiveLang]) {
    const val = BUILT_IN_DICTIONARY[cleanText][effectiveLang];
    // STRICT SAFEGUARD: Never return Thai characters as English or Chinese!
    if (!/[\\u0E00-\\u0E7F]/.test(val)) {
      return val;
    }
  }"""

if old_dict_check in at_content:
    at_content = at_content.replace(old_dict_check, new_dict_check)
    print('Updated translateDynamic safeguard in autoTranslator.js')

# Clean BUILT_IN_DICTIONARY in autoTranslator.js
dict_match_at = re.search(r'export const BUILT_IN_DICTIONARY = {([\s\S]*?)};\n\n/\*\*', at_content)
if dict_match_at:
    dict_body_at = dict_match_at.group(1)
    pattern = re.compile(r'"([^"\\]*(?:\\.[^"\\]*)*)":\s*{\s*en:\s*"([^"\\]*(?:\\.[^"\\]*)*)",\s*zh:\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*},?')
    cleaned_entries_at = {}
    for m in pattern.finditer(dict_body_at):
        k, en, zh = m.group(1), m.group(2), m.group(3)
        if thai_regex.search(en) or thai_regex.search(zh):
            continue
        cleaned_entries_at[k] = {"en": en, "zh": zh}

    print(f'Preserved clean entries in BUILT_IN_DICTIONARY: {len(cleaned_entries_at)}')

    for k, v in CURATED_FIXES.items():
        cleaned_entries_at[k] = v

    print(f'Total BUILT_IN_DICTIONARY entries after curated fixes: {len(cleaned_entries_at)}')

    lines_at = []
    for k, v in cleaned_entries_at.items():
        lines_at.append(f'  {json.dumps(k, ensure_ascii=False)}: {{\n    en: {json.dumps(v["en"], ensure_ascii=False)},\n    zh: {json.dumps(v["zh"], ensure_ascii=False)}\n  }},')
    new_dict_str_at = "export const BUILT_IN_DICTIONARY = {\n" + "\n".join(lines_at) + "\n};\n\n/**"

    at_content = at_content[:dict_match_at.start()] + new_dict_str_at + at_content[dict_match_at.end():]
    with open(r'c:\Gspeed\src\utils\autoTranslator.js', 'w', encoding='utf-8') as f:
        f.write(at_content)
    print('Successfully rewrote autoTranslator.js!')
else:
    print('Error: Could not match BUILT_IN_DICTIONARY in autoTranslator.js')
