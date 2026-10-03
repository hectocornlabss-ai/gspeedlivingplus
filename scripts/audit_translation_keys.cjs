const fs = require('fs');
const path = require('path');

// Extract translations from LanguageContext.jsx
const lcPath = path.resolve(__dirname, '..', 'src', 'context', 'LanguageContext.jsx');
const content = fs.readFileSync(lcPath, 'utf8');

// We can extract translations object by evaluating safely or parsing
// Let's create a temporary node file that imports or extracts it
const scriptContent = `
const fs = require('fs');
const path = require('path');

// Read file
let code = fs.readFileSync(${JSON.stringify(lcPath)}, 'utf8');

// Isolate export const translations = { ... };
const startIdx = code.indexOf('export const translations = {');
if (startIdx === -1) {
  console.error('Cannot find translations object');
  process.exit(1);
}

// Strip out React imports and export keyword for evaluation
const sub = code.substring(startIdx).replace('export const translations =', 'const translations =');
// Find closing bracket of translations
let depth = 0;
let endIdx = -1;
let inString = false;
let quoteChar = '';

for (let i = 0; i < sub.length; i++) {
  const ch = sub[i];
  const prev = i > 0 ? sub[i-1] : '';

  if ((ch === '"' || ch === "'" || ch === '\`') && prev !== '\\\\') {
    if (!inString) {
      inString = true;
      quoteChar = ch;
    } else if (quoteChar === ch) {
      inString = false;
    }
  }

  if (!inString) {
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        endIdx = i;
        break;
      }
    }
  }
}

if (endIdx === -1) {
  console.error('Could not find matching closing bracket');
  process.exit(1);
}

const objCode = sub.substring(0, endIdx + 1) + '; module.exports = translations;';
const tmpFile = path.join(__dirname, 'temp_translations.cjs');
fs.writeFileSync(tmpFile, objCode);

const translations = require(tmpFile);
fs.unlinkSync(tmpFile);

const th = translations.th || {};
const en = translations.en || {};
const zh = translations.zh || {};

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const full = prefix ? prefix + '.' + k : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getAllKeys(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

const thKeys = getAllKeys(th);
const enKeys = getAllKeys(en);
const zhKeys = getAllKeys(zh);

console.log('Total translation leaf keys:');
console.log('  Thai (th):', thKeys.length);
console.log('  English (en):', enKeys.length);
console.log('  Chinese (zh):', zhKeys.length);

const missingInEn = thKeys.filter(k => !enKeys.includes(k));
const missingInZh = thKeys.filter(k => !zhKeys.includes(k));

console.log('\\nMissing in English:', missingInEn.length);
if (missingInEn.length > 0) {
  missingInEn.slice(0, 15).forEach(k => console.log('  - ' + k));
}

console.log('\\nMissing in Chinese:', missingInZh.length);
if (missingInZh.length > 0) {
  missingInZh.slice(0, 15).forEach(k => console.log('  - ' + k));
}

// Check for empty string values
let emptyTh = thKeys.filter(k => {
  const val = k.split('.').reduce((acc, part) => acc && acc[part], th);
  return val === '' || val === null || val === undefined;
});
let emptyEn = enKeys.filter(k => {
  const val = k.split('.').reduce((acc, part) => acc && acc[part], en);
  return val === '' || val === null || val === undefined;
});
let emptyZh = zhKeys.filter(k => {
  const val = k.split('.').reduce((acc, part) => acc && acc[part], zh);
  return val === '' || val === null || val === undefined;
});

console.log('\\nEmpty values: TH=' + emptyTh.length + ', EN=' + emptyEn.length + ', ZH=' + emptyZh.length);
`;

fs.writeFileSync(path.join(__dirname, 'run_translation_audit.cjs'), scriptContent);
