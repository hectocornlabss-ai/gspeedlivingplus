const fs = require('fs');
const path = require('path');

const langContextContent = fs.readFileSync('src/context/LanguageContext.jsx', 'utf8');
const autoTransContent = fs.readFileSync('src/utils/autoTranslator.js', 'utf8');

// Load site-data.json
const siteData = JSON.parse(fs.readFileSync('server/data/site-data.json', 'utf8'));

// Extract all Thai strings recursively from an object
function extractThaiStrings(obj, set = new Set()) {
  if (!obj) return set;
  if (typeof obj === 'string') {
    const trimmed = obj.trim();
    if (/[\u0E00-\u0E7F]/.test(trimmed) && trimmed.length > 1) {
      set.add(trimmed);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractThaiStrings(item, set));
  } else if (typeof obj === 'object') {
    Object.entries(obj).forEach(([key, val]) => {
      // Skip admin-only fields
      if (['adminPassword', 'quickPin', 'smtpConfig', 'staffRoles', 'roles'].includes(key)) return;
      extractThaiStrings(val, set);
    });
  }
  return set;
}

const allStrings = extractThaiStrings(siteData);

// Also extract from mockData.js (tournaments, gallery, news, etc.)
const mockDataContent = fs.readFileSync('src/data/mockData.js', 'utf8');
const regexString = /['"`]([^'"`]*[\u0E00-\u0E7F]+[^'"`]*)['"`]/g;
let m;
while ((m = regexString.exec(mockDataContent)) !== null) {
  const s = m[1].trim();
  if (s.length > 1) allStrings.add(s);
}

console.log('Total unique Thai strings found in data:', allStrings.size);

const missingTranslations = [];

allStrings.forEach(str => {
  // Check if present in LanguageContext or autoTranslator
  const inLang = langContextContent.includes(str);
  const inAuto = autoTransContent.includes(str);
  if (!inLang && !inAuto) {
    missingTranslations.push(str);
  }
});

console.log('Missing translations count:', missingTranslations.length);
fs.writeFileSync('scripts/missing_translations.json', JSON.stringify(missingTranslations, null, 2), 'utf8');
console.log('Saved to scripts/missing_translations.json');

// Sample the first 30 missing
console.log('\n--- SAMPLE OF MISSING TRANSLATIONS ---');
missingTranslations.slice(0, 30).forEach(s => console.log('•', s.slice(0, 80)));
