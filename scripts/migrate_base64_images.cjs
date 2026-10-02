const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const siteDataPath = path.resolve('server/data/site-data.json');
const publicUploads = path.resolve('public/uploads');
const serverUploads = path.resolve('server/data/uploads');
const backupPath = path.resolve('server/data/backups/site-data-pre-img-optimization.json');

if (!fs.existsSync(siteDataPath)) {
  console.error('site-data.json not found!');
  process.exit(1);
}

const raw = fs.readFileSync(siteDataPath, 'utf8');
fs.writeFileSync(backupPath, raw, 'utf8');
console.log('Backed up site-data.json to:', backupPath);

const data = JSON.parse(raw);
let extractedCount = 0;
let savedBytes = 0;

function saveBase64ToFile(base64Str, category = 'optimized') {
  const matches = base64Str.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!matches) return base64Str;

  let ext = matches[1].toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  if (ext === 'svg+xml') ext = 'svg';

  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 12);
  const fileName = `${category}_${hash}.${ext}`;

  const pubDir = path.join(publicUploads, category);
  const srvDir = path.join(serverUploads, category);

  if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
  if (!fs.existsSync(srvDir)) fs.mkdirSync(srvDir, { recursive: true });

  fs.writeFileSync(path.join(pubDir, fileName), buffer);
  fs.writeFileSync(path.join(srvDir, fileName), buffer);

  extractedCount++;
  savedBytes += buffer.length;
  return `/uploads/${category}/${fileName}`;
}

function processObject(obj, currentKey = '') {
  for (const k in obj) {
    const val = obj[k];
    if (typeof val === 'string' && val.startsWith('data:image/')) {
      const category = currentKey.includes('gallery') ? 'gallery' : (currentKey.includes('hero') ? 'hero' : (currentKey.includes('banner') ? 'banners' : 'media'));
      obj[k] = saveBase64ToFile(val, category);
      console.log(`Extracted: ${currentKey}.${k} -> ${obj[k]}`);
    } else if (typeof val === 'object' && val !== null) {
      processObject(val, currentKey ? `${currentKey}.${k}` : k);
    }
  }
}

processObject(data);

const newJson = JSON.stringify(data, null, 2);
fs.writeFileSync(siteDataPath, newJson, 'utf8');

const oldSize = Buffer.byteLength(raw, 'utf8');
const newSize = Buffer.byteLength(newJson, 'utf8');

console.log(`\n================ SUCCESS ================`);
console.log(`Images extracted: ${extractedCount}`);
console.log(`Original site-data.json size: ${(oldSize / 1024 / 1024).toFixed(2)} MB (${(oldSize / 1024).toFixed(1)} KB)`);
console.log(`New site-data.json size: ${(newSize / 1024).toFixed(1)} KB`);
console.log(`Size reduction: ${((1 - newSize / oldSize) * 100).toFixed(1)}%!`);
console.log(`=========================================\n`);
