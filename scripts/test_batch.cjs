const fs = require('fs');

async function translateText(text, targetLang) {
  const langPair = targetLang === 'zh' ? 'th|zh-CN' : 'th|en';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}&de=contact@gspeedlivingplus.com`;
  
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
      await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  return text; // fallback
}

async function run() {
  const missing = JSON.parse(fs.readFileSync('scripts/missing_translations.json', 'utf8'));
  const testBatch = missing.slice(0, 10);
  console.log('Testing 10 items:');
  for (const item of testBatch) {
    const en = await translateText(item, 'en');
    const zh = await translateText(item, 'zh');
    console.log(`[TH] ${item.slice(0, 40)} -> [EN] ${en.slice(0, 40)} | [ZH] ${zh.slice(0, 40)}`);
  }
}

run();
