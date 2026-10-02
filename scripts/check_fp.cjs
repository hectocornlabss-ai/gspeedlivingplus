const fs = require('fs');
const lines = fs.readFileSync('src/components/FranchisePlanner.jsx', 'utf8').split('\n');
const samples = [];
lines.forEach((line, idx) => {
  if (/[\u0E00-\u0E7F]/.test(line)) {
    const isWrapped = /t\s*\(\s*['"`]/.test(line) || 
                      /translateDynamic\s*\(/.test(line) || 
                      /tp\s*\(/.test(line) ||
                      /language\s*===?\s*['"]th['"]/.test(line) ||
                      /['"]th['"]\s*:/.test(line);
    if (!isWrapped) {
      samples.push((idx + 1) + ': ' + line.trim());
    }
  }
});
console.log('Total unwrapped in FranchisePlanner:', samples.length);
samples.slice(40, 150).forEach(s => console.log(s));
