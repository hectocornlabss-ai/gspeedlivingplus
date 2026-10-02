const fs = require('fs');
const path = require('path');

const batch = JSON.parse(fs.readFileSync('scripts/translated_batch.json', 'utf8'));
console.log('Loaded batch items:', Object.keys(batch).length);

// 1. Update src/utils/autoTranslator.js
let autoTranslatorContent = fs.readFileSync('src/utils/autoTranslator.js', 'utf8');

// Find BUILT_IN_DICTIONARY opening
const dictStartStr = 'export const BUILT_IN_DICTIONARY = {';
const dictStartIndex = autoTranslatorContent.indexOf(dictStartStr);
if (dictStartIndex === -1) {
  console.error('Could not find BUILT_IN_DICTIONARY in autoTranslator.js');
  process.exit(1);
}

// Generate formatted entries
const newEntries = Object.entries(batch)
  .filter(([key]) => key && key.trim().length > 0)
  .map(([th, trans]) => {
    const safeTh = JSON.stringify(th);
    const safeEn = JSON.stringify(trans.en || th);
    const safeZh = JSON.stringify(trans.zh || th);
    return `  ${safeTh}: {\n    en: ${safeEn},\n    zh: ${safeZh}\n  },`;
  })
  .join('\n');

// Insert after 'export const BUILT_IN_DICTIONARY = {'
autoTranslatorContent = 
  autoTranslatorContent.substring(0, dictStartIndex + dictStartStr.length) +
  '\n' + newEntries + '\n' +
  autoTranslatorContent.substring(dictStartIndex + dictStartStr.length);

fs.writeFileSync('src/utils/autoTranslator.js', autoTranslatorContent, 'utf8');
console.log('Successfully updated src/utils/autoTranslator.js with 845 translations!');

// 2. Update src/context/LanguageContext.jsx
let langContextContent = fs.readFileSync('src/context/LanguageContext.jsx', 'utf8');
const contentTransStartStr = 'export const CONTENT_TRANSLATIONS = {';
const contentTransIndex = langContextContent.indexOf(contentTransStartStr);

if (contentTransIndex === -1) {
  console.error('Could not find CONTENT_TRANSLATIONS in LanguageContext.jsx');
  process.exit(1);
}

langContextContent = 
  langContextContent.substring(0, contentTransIndex + contentTransStartStr.length) +
  '\n' + newEntries + '\n' +
  langContextContent.substring(contentTransIndex + contentTransStartStr.length);

fs.writeFileSync('src/context/LanguageContext.jsx', langContextContent, 'utf8');
console.log('Successfully updated src/context/LanguageContext.jsx with 845 translations!');
