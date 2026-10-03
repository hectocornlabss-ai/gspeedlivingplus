const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src');

function getAllFiles(dir, exts = ['.jsx', '.js', '.html']) {
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

const files = getAllFiles(srcDir);
let fixedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Match multiline <a ... target="_blank" ...> where rel is not present
  content = content.replace(/<a\s+([^>]*?)target=["']_blank["']([^>]*?)>/gis, (match, before, after) => {
    if (before.includes('rel=') || after.includes('rel=') || match.includes('noopener')) {
      return match;
    }
    return `<a ${before}target="_blank" rel="noopener noreferrer"${after}>`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    fixedCount++;
    console.log(`Updated security headers in: ${path.relative(srcDir, file)}`);
  }
});

console.log(`Finished: Added rel="noopener noreferrer" in ${fixedCount} files.`);
