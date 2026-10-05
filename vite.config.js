import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

// Middleware to force Content-Disposition attachment header for rock-solid file downloads in Chrome
const downloadServerPlugin = () => {
  const fileCache = new Map();

  return {
    name: 'download-server-plugin',
    configureServer(server) {
      // POST endpoint to register file for download
      server.middlewares.use('/api/prepare-download', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              const fileId = 'dl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
              fileCache.set(fileId, parsed);
              setTimeout(() => fileCache.delete(fileId), 180000); // 3 minutes TTL
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ fileId }));
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to prepare download' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });

      // GET endpoint that responds directly with attachment and real filename
      server.middlewares.use('/api/download-file', (req, res) => {
        if (req.method === 'GET') {
          const parsedUrl = new URL(req.url, 'http://localhost:5899');
          const fileId = parsedUrl.searchParams.get('id');
          const cached = fileId ? fileCache.get(fileId) : null;
          
          if (cached && cached.dataUrl) {
            const base64Data = cached.dataUrl.includes(',') ? cached.dataUrl.split(',')[1] : cached.dataUrl;
            const buffer = Buffer.from(base64Data, 'base64');
            const filename = (cached.filename || 'GSPEED-Blueprint.png').replace(/[^\w.-]/g, '_');
            const mimeType = cached.mimeType || 'image/png';

            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Length', buffer.length);
            res.setHeader('Cache-Control', 'no-cache');
            res.end(buffer);
            return;
          }
          res.statusCode = 404;
          res.end('File expired or not found');
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              let dataUrl = '';
              let filename = 'GSPEED-Blueprint.png';
              let mimeType = 'image/png';

              const contentType = req.headers['content-type'] || '';
              if (contentType.includes('application/x-www-form-urlencoded')) {
                const params = new URLSearchParams(body);
                dataUrl = params.get('dataUrl') || '';
                filename = params.get('filename') || filename;
                mimeType = params.get('mimeType') || mimeType;
              } else {
                try {
                  const parsed = JSON.parse(body);
                  dataUrl = parsed.dataUrl || '';
                  filename = parsed.filename || filename;
                  mimeType = parsed.mimeType || mimeType;
                } catch (err) {}
              }

              const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
              const buffer = Buffer.from(base64Data, 'base64');
              const cleanFilename = filename.replace(/[^\w.-]/g, '_');

              res.setHeader('Content-Type', mimeType);
              res.setHeader('Content-Disposition', `attachment; filename="${cleanFilename}"`);
              res.setHeader('Content-Length', buffer.length);
              res.end(buffer);
            } catch (e) {
              res.statusCode = 500;
              res.end('Error processing download');
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
      // High-performance Media Upload Middleware for development
      server.middlewares.use('/api/upload-media', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { dataUrl, filename = 'image.webp', category = 'gallery' } = JSON.parse(body);
              if (!dataUrl) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'dataUrl is required' }));
                return;
              }

              const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads', category);
              if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

              const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
              const buffer = Buffer.from(base64Data, 'base64');
              const ext = dataUrl.includes('image/webp') ? '.webp' : (dataUrl.includes('image/png') ? '.png' : (dataUrl.includes('image/svg') ? '.svg' : '.jpg'));
              const safeName = filename.replace(/\.[^/.]+$/, '').replace(/[^\w-]/g, '_').toLowerCase();
              const uniqueName = `${safeName || category}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}${ext}`;
              const filePath = path.join(uploadsDir, uniqueName);
              fs.writeFileSync(filePath, buffer);

              const publicUrl = `/uploads/${category}/${uniqueName}`;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                url: publicUrl,
                name: filename || uniqueName,
                sizeBytes: buffer.length
              }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }
        next();
      });

      // Persistent Local Site Data Middleware for development
      server.middlewares.use('/api/site-data', (req, res, next) => {
        const localDataDir = path.resolve(process.cwd(), 'server', 'data');
        const localBackupsDir = path.join(localDataDir, 'backups');
        const localDataFile = path.join(localDataDir, 'site-data.json');

        if (!fs.existsSync(localDataDir)) fs.mkdirSync(localDataDir, { recursive: true });
        if (!fs.existsSync(localBackupsDir)) fs.mkdirSync(localBackupsDir, { recursive: true });

        const urlPath = req.url ? req.url.split('?')[0] : '';

        if (urlPath === '/backups' && req.method === 'GET') {
          try {
            const files = fs.readdirSync(localBackupsDir)
              .filter(f => f.startsWith('site-data-') && f.endsWith('.json'))
              .map(f => {
                const s = fs.statSync(path.join(localBackupsDir, f));
                return { filename: f, sizeBytes: s.size, mtime: s.mtime };
              })
              .sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, backups: files }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
          return;
        }

        if (req.method === 'GET') {
          if (!fs.existsSync(localDataFile)) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, siteData: null }));
            return;
          }
          try {
            const content = fs.readFileSync(localDataFile, 'utf8');
            const stats = fs.statSync(localDataFile);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              siteData: JSON.parse(content),
              updatedAt: stats.mtime,
              sizeBytes: stats.size
            }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (!parsed.siteData) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'siteData is required' }));
                return;
              }

              if (fs.existsSync(localDataFile)) {
                try {
                  fs.copyFileSync(localDataFile, path.join(localBackupsDir, `site-data-${Date.now()}.json`));
                } catch (bErr) {}
              }

              try {
                const tmpFile = `${localDataFile}.tmp.${Date.now()}`;
                fs.writeFileSync(tmpFile, JSON.stringify(parsed.siteData, null, 2), 'utf8');
                try {
                  fs.renameSync(tmpFile, localDataFile);
                } catch (rErr) {
                  fs.copyFileSync(tmpFile, localDataFile);
                  try { fs.unlinkSync(tmpFile); } catch (uErr) {}
                }
              } catch (wErr) {
                fs.writeFileSync(localDataFile, JSON.stringify(parsed.siteData, null, 2), 'utf8');
              }

              const stats = fs.statSync(localDataFile);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'บันทึกข้อมูล CMS ลงไฟล์ฐานข้อมูล Local สำเร็จ',
                updatedAt: stats.mtime,
                sizeBytes: stats.size
              }));
            } catch (e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: e.message }));
            }
          });
          return;
        }

        next();
      });

      // Persistent Local Orders Middleware for development
      server.middlewares.use('/api/orders', (req, res, next) => {
        const localDataDir = path.resolve(process.cwd(), 'server', 'data');
        const ordersFile = path.join(localDataDir, 'orders.json');
        const seedOrdersFile = path.resolve(process.cwd(), 'server', 'default-orders.json');

        if (!fs.existsSync(localDataDir)) fs.mkdirSync(localDataDir, { recursive: true });
        if (!fs.existsSync(ordersFile) && fs.existsSync(seedOrdersFile)) {
          try { fs.copyFileSync(seedOrdersFile, ordersFile); } catch (e) {}
        }

        if (req.method === 'GET') {
          try {
            const content = fs.existsSync(ordersFile) ? fs.readFileSync(ordersFile, 'utf8') : '[]';
            const orders = JSON.parse(content || '[]');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, orders, totalCount: orders.length }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const incoming = JSON.parse(body || '{}');
              const item = incoming.order || incoming;
              if (!item || !item.orderNo) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'orderNo is required' }));
                return;
              }
              const content = fs.existsSync(ordersFile) ? fs.readFileSync(ordersFile, 'utf8') : '[]';
              const orders = JSON.parse(content || '[]');
              const idx = orders.findIndex(o => o.orderNo && o.orderNo.toLowerCase() === item.orderNo.toLowerCase());
              if (idx > -1) {
                orders[idx] = { ...orders[idx], ...item, updatedAt: new Date().toISOString() };
              } else {
                orders.unshift({ ...item, createdAt: item.createdAt || new Date().toISOString() });
              }
              fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, orders }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), downloadServerPlugin()],
  server: {
    port: 5899,
    host: true,
    watch: {
      ignored: [
        '**/server/**',
        '**/server/data/**',
        '**/server/data/backups/**',
        '**/*.tmp.*',
        (file) => typeof file === 'string' && (file.includes('server') || file.includes('data') || file.includes('.tmp.'))
      ]
    },
    proxy: {
      '/api/orders': 'http://localhost:3001',
      '/api/send-email': 'http://localhost:3001',
      '/api/test-smtp': 'http://localhost:3001',
      '/api/contact-inquiry': 'http://localhost:3001',
      '/api/franchise-quote': 'http://localhost:3001',
      '/api/health': 'http://localhost:3001'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide-icons';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-core';
          }
        }
      }
    },
    chunkSizeWarningLimit: 900
  }
})
