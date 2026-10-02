const fs = require('fs');

async function fetchGtx(text, lang) {
  const gtxLang = lang === 'zh' ? 'zh-CN' : lang;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=th&tl=${gtxLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map(s => s[0]).join('').trim();
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Curated overrides for highest quality
const CURATED = {
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
  }
};

async function main() {
  const badEntries = JSON.parse(fs.readFileSync('scripts/bad_entries.json', 'utf8'));
  console.log(`Processing ${badEntries.length} bad entries...`);

  const fixedMap = {};

  for (let i = 0; i < badEntries.length; i++) {
    const item = badEntries[i];
    const key = item.key;

    if (CURATED[key]) {
      fixedMap[key] = CURATED[key];
      continue;
    }

    let en = item.en;
    let zh = item.zh;

    const hasThaiEn = /[\u0E00-\u0E7F]/.test(en);
    const hasThaiZh = /[\u0E00-\u0E7F]/.test(zh);

    if (hasThaiEn) {
      const transEn = await fetchGtx(key, 'en');
      if (transEn && !/[\u0E00-\u0E7F]/.test(transEn)) {
        en = transEn;
      } else {
        en = ''; // Leave blank so autoTranslator handles it or pattern matches it!
      }
    }

    if (hasThaiZh) {
      const transZh = await fetchGtx(key, 'zh');
      if (transZh && !/[\u0E00-\u0E7F]/.test(transZh)) {
        zh = transZh;
      } else {
        zh = ''; // Leave blank!
      }
    }

    if (en && zh && !/[\u0E00-\u0E7F]/.test(en) && !/[\u0E00-\u0E7F]/.test(zh)) {
      fixedMap[key] = { en, zh };
    }

    if ((i + 1) % 50 === 0 || i === badEntries.length - 1) {
      console.log(`Progress: ${i + 1}/${badEntries.length} processed. Valid fixes so far: ${Object.keys(fixedMap).length}`);
    }
  }

  // Add all CURATED
  for (const [k, v] of Object.entries(CURATED)) {
    fixedMap[k] = v;
  }

  fs.writeFileSync('scripts/fixed_translations.json', JSON.stringify(fixedMap, null, 2), 'utf8');
  console.log(`Saved ${Object.keys(fixedMap).length} fixed translations to scripts/fixed_translations.json!`);
}

main().catch(console.error);
