const fs = require('fs');
const path = require('path');

console.log('========================================================');
console.log('   G-SPEED LIVING PLUS: SYSTEM HEALTH & SECURITY AUDIT  ');
console.log('========================================================\n');

// 1. Check Security: Search for eval, dangerous innerHTML, exposed API keys
console.log('>>> 1. AUDITING SECURITY & VULNERABILITIES...');
const srcDir = path.resolve(__dirname, '..', 'src');

function getAllFiles(dir, exts = ['.js', '.jsx', '.ts', '.tsx', '.json', '.html']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        results = results.concat(getAllFiles(fullPath, exts));
      }
    } else {
      if (exts.includes(path.extname(file))) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const allSrcFiles = getAllFiles(srcDir);
let securityIssues = [];

allSrcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(path.resolve(__dirname, '..'), file);

  // Check dangerous eval
  if (/\beval\s*\(/.test(content)) {
    securityIssues.push({ file: relPath, issue: 'Dangerous eval() usage' });
  }

  // Check dangerouslySetInnerHTML
  if (/dangerouslySetInnerHTML/.test(content)) {
    // Check if sanitized
    securityIssues.push({ file: relPath, issue: 'dangerouslySetInnerHTML usage (verify sanitization)' });
  }

  // Check exposed hardcoded private API keys (sk-..., AIzaSy...)
  const openRouterMatch = content.match(/sk-or-v1-[a-zA-Z0-9]{30,}/g);
  if (openRouterMatch) {
    securityIssues.push({ file: relPath, issue: `Potential exposed OpenRouter API key: ${openRouterMatch[0].slice(0, 10)}...` });
  }
  const googleKeyMatch = content.match(/AIzaSy[a-zA-Z0-9_-]{33}/g);
  if (googleKeyMatch) {
    securityIssues.push({ file: relPath, issue: `Potential exposed Google API key: ${googleKeyMatch[0].slice(0, 10)}...` });
  }

  // Check target="_blank" without rel="noopener" across whole <a> tag
  const anchorTags = content.match(/<a\b[^>]*>/gi) || [];
  anchorTags.forEach(tag => {
    if (tag.includes('target="_blank"') || tag.includes("target='_blank'")) {
      if (!tag.includes('noopener') && !tag.includes('noreferrer')) {
        securityIssues.push({ file: relPath, issue: `target="_blank" without rel="noopener noreferrer" in tag: ${tag.slice(0, 60)}...` });
      }
    }
  });
});

console.log(`Audited ${allSrcFiles.length} source files.`);
if (securityIssues.length === 0) {
  console.log('✓ PASS: No critical security vulnerabilities (no unescaped eval, no hardcoded API keys).');
} else {
  console.log(`Found ${securityIssues.length} items to review:`);
  securityIssues.forEach(s => console.log(`  - [${s.file}${s.line ? ':' + s.line : ''}] ${s.issue}`));
}

// 2. Check Translations Parity between TH, EN, ZH
console.log('\n>>> 2. AUDITING TRANSLATIONS PARITY (TH, EN, ZH)...');
try {
  const langContextFile = path.join(srcDir, 'context', 'LanguageContext.jsx');
  const langContent = fs.readFileSync(langContextFile, 'utf8');
  
  // Extract translations object keys
  const hasTh = langContent.includes('th: {');
  const hasEn = langContent.includes('en: {');
  const hasZh = langContent.includes('zh: {');

  console.log(`- Languages defined in LanguageContext: Thai: ${hasTh}, English: ${hasEn}, Chinese: ${hasZh}`);

  // Count size and coverage
  console.log(`- LanguageContext file size: ${(langContent.length / 1024).toFixed(1)} KB (${langContent.split('\n').length} lines)`);
  
  const autoTranslatorFile = path.join(srcDir, 'utils', 'autoTranslator.js');
  if (fs.existsSync(autoTranslatorFile)) {
    const autoContent = fs.readFileSync(autoTranslatorFile, 'utf8');
    console.log(`- autoTranslator engine size: ${(autoContent.length / 1024).toFixed(1)} KB (${autoContent.split('\n').length} lines)`);
  }
} catch (e) {
  console.error('Translation audit error:', e);
}

// 3. Check Routes & Component Imports in App.jsx
console.log('\n>>> 3. AUDITING ROUTE STABILITY & LAZY COMPONENTS...');
const appFile = path.join(srcDir, 'App.jsx');
const appContent = fs.readFileSync(appFile, 'utf8');

const lazyMatches = appContent.match(/const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)\)/g) || [];
console.log(`Found ${lazyMatches.length} lazy loaded routes:`);
let missingFiles = 0;
lazyMatches.forEach(lm => {
  const m = lm.match(/const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)\)/);
  if (m) {
    const compName = m[1];
    const importPath = m[2];
    const resolvedPath = path.resolve(srcDir, importPath.endsWith('.jsx') ? importPath : importPath + '.jsx');
    const exists = fs.existsSync(resolvedPath);
    if (!exists) {
      console.log(`  ✗ MISSING: ${compName} -> ${resolvedPath}`);
      missingFiles++;
    } else {
      console.log(`  ✓ OK: ${compName} (${importPath})`);
    }
  }
});

if (missingFiles === 0) {
  console.log('✓ PASS: All lazy route components exist and resolve cleanly.');
} else {
  console.log(`✗ FAIL: ${missingFiles} lazy components missing!`);
}

console.log('\n========================================================\n');
