/**
 * AI Smart Spec Sheet & Image-to-3D Extractor Utility
 * Extracts specifications (dimensions, weight, materials, prices, SKU) from text/documents
 * and extracts real colors & tabletop textures from product photos.
 */

// 1. Extract Dominant & Accent Colors + Tabletop Texture from an Image
export async function analyzeProductPhoto(fileOrDataUrl) {
  return new Promise((resolve) => {
    let img = new Image();
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }

    const handleLoaded = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxDim = 800;
        let width = img.width || 400;
        let height = img.height || 400;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height).data;

        // Sample pixels across different zones:
        // Zone A: Center (Desk surface)
        // Zone B: Bright saturated pixels (LED strips / RGB)
        // Zone C: Bottom / Legs (Chair / Metal frame)
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        let maxSaturation = 0;
        let accentHex = '#1d4ed8'; // default fallback blue
        let darkHex = '#0f172a';

        for (let y = Math.floor(height * 0.25); y < Math.floor(height * 0.75); y += 4) {
          for (let x = Math.floor(width * 0.25); x < Math.floor(width * 0.75); x += 4) {
            const idx = (y * width + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            const a = imgData[idx + 3];

            if (a < 128) continue;

            rSum += r;
            gSum += g;
            bSum += b;
            count++;

            // Calculate saturation
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const sat = max === 0 ? 0 : (max - min) / max;
            const brightness = (r + g + b) / 3;

            if (sat > maxSaturation && brightness > 50 && brightness < 240) {
              maxSaturation = sat;
              accentHex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            }
          }
        }

        let deskHex = '#0f172a';
        if (count > 0) {
          const avgR = Math.round(rSum / count);
          const avgG = Math.round(gSum / count);
          const avgB = Math.round(bSum / count);
          deskHex = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB).toString(16).slice(1)}`;
        }

        // Detect chair / secondary color from bottom zone
        let bR = 15, bG = 23, bB = 42;
        let bCount = 0;
        for (let y = Math.floor(height * 0.7); y < height; y += 4) {
          for (let x = 0; x < width; x += 4) {
            const idx = (y * width + x) * 4;
            bR += imgData[idx];
            bG += imgData[idx + 1];
            bB += imgData[idx + 2];
            bCount++;
          }
        }
        let chairHex = '#0f172a';
        if (bCount > 0) {
          chairHex = `#${((1 << 24) + (Math.round(bR / bCount) << 16) + (Math.round(bG / bCount) << 8) + Math.round(bB / bCount)).toString(16).slice(1)}`;
        }

        // Texture Data URL for 3D tabletop
        const textureUrl = canvas.toDataURL('image/webp', 0.85);

        // Aspect ratio estimate for seats
        const aspect = img.width / img.height;
        let suggestedSeats = 2;
        if (aspect >= 2.2) suggestedSeats = 4;
        else if (aspect <= 1.1) suggestedSeats = 1;

        resolve({
          success: true,
          deskColor: deskHex,
          accentColor: accentHex,
          chairColor: chairHex,
          textureUrl: textureUrl,
          suggestedSeats: suggestedSeats
        });
      } catch (e) {
        console.error('Error analyzing image colors:', e);
        clearTimeout(safetyTimer);
        resolve({
          success: false,
          deskColor: '#0f172a',
          accentColor: '#1d4ed8',
          chairColor: '#0f172a'
        });
      }
    };

    // Safeguard: Never hang indefinitely
    const safetyTimer = setTimeout(() => {
      console.warn('Image analysis timed out, returning fallback colors');
      resolve({
        success: false,
        deskColor: '#0f172a',
        accentColor: '#1d4ed8',
        chairColor: '#0f172a'
      });
    }, 4000);

    img.onload = () => {
      clearTimeout(safetyTimer);
      handleLoaded();
    };

    img.onerror = () => {
      clearTimeout(safetyTimer);
      resolve({
        success: false,
        deskColor: '#0f172a',
        accentColor: '#1d4ed8',
        chairColor: '#0f172a'
      });
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = () => {
        clearTimeout(safetyTimer);
        resolve({
          success: false,
          deskColor: '#0f172a',
          accentColor: '#1d4ed8',
          chairColor: '#0f172a'
        });
      };
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

// 2. Parse Spec Sheet Text / Quotation / Document Contents
export function parseSpecSheetText(text) {
  if (!text || typeof text !== 'string') return null;

  const result = {};
  const clean = text.replace(/\r/g, '');

  // 1. SKU Extraction
  const skuMatch = clean.match(/(?:รหัสสินค้า|รหัส|SKU|Item Code|Model No\.?|Part No\.?)[:\s]+([A-Z0-9_-]{3,20})/i) ||
                   clean.match(/\b([A-Z]{2,4}-[A-Z0-9]{2,10}(?:-[A-Z0-9]+)?)\b/);
  if (skuMatch) {
    result.sku = skuMatch[1].trim();
  }

  // 2. Product Name
  const nameMatch = clean.match(/(?:ชื่อสินค้า|ชื่อรุ่น|รายการ|Product Name|Item Name)[:\s]+([^\n]+)/i) ||
                    clean.match(/(?:โต๊ะเกมมิ่ง|ชุดโต๊ะ|Gaming Desk|Station|Booth)[^\n]+/i);
  if (nameMatch) {
    result.name = nameMatch[1] ? nameMatch[1].trim() : nameMatch[0].trim();
  }

  // 3. Dimensions Extraction (W x D x H in meters, cm, or mm)
  // Example: 2400 x 1000 x 1250 mm or 240 x 100 x 125 cm or 2.4 x 1.0 x 1.25 m
  const dimMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:x|\*|X|คูณ)\s*(\d+(?:\.\d+)?)\s*(?:x|\*|X|คูณ)\s*(\d+(?:\.\d+)?)\s*(mm|cm|m|มม|ซม|ม\.?|เมตร)?/i);
  if (dimMatch) {
    let w = parseFloat(dimMatch[1]);
    let d = parseFloat(dimMatch[2]);
    let h = parseFloat(dimMatch[3]);
    const unit = (dimMatch[4] || '').toLowerCase();

    if (unit === 'mm' || unit === 'มม' || w > 500) {
      w = +(w / 1000).toFixed(2);
      d = +(d / 1000).toFixed(2);
      h = +(h / 1000).toFixed(2);
    } else if (unit === 'cm' || unit === 'ซม' || w > 20) {
      w = +(w / 100).toFixed(2);
      d = +(d / 100).toFixed(2);
      h = +(h / 100).toFixed(2);
    }

    result.widthMeters = w;
    result.depth3D = d;
    result.height3D = h;
  } else {
    // Check individual width, depth, height
    const wMatch = clean.match(/(?:กว้าง|Width|W)[:\s]+(\d+(?:\.\d+)?)\s*(mm|cm|m|มม|ซม|ม\.?)?/i);
    const dMatch = clean.match(/(?:ลึก|ยาว|Depth|D|Length|L)[:\s]+(\d+(?:\.\d+)?)\s*(mm|cm|m|มม|ซม|ม\.?)?/i);
    const hMatch = clean.match(/(?:สูง|Height|H)[:\s]+(\d+(?:\.\d+)?)\s*(mm|cm|m|มม|ซม|ม\.?)?/i);

    if (wMatch) {
      let val = parseFloat(wMatch[1]);
      if (val > 500) val /= 1000;
      else if (val > 20) val /= 100;
      result.widthMeters = +val.toFixed(2);
    }
    if (dMatch) {
      let val = parseFloat(dMatch[1]);
      if (val > 500) val /= 1000;
      else if (val > 20) val /= 100;
      result.depth3D = +val.toFixed(2);
    }
    if (hMatch) {
      let val = parseFloat(hMatch[1]);
      if (val > 500) val /= 1000;
      else if (val > 20) val /= 100;
      result.height3D = +val.toFixed(2);
    }
  }

  // 4. Seats
  const seatMatch = clean.match(/(\d+)\s*(?:ที่นั่ง|seats|seat|ที่|คน)/i);
  if (seatMatch) {
    result.seats = parseInt(seatMatch[1], 10);
    result.chairCount = result.seats;
  }

  // 5. Weight & Load
  const weightMatch = clean.match(/(?:น้ำหนักสินค้า|น้ำหนักสุทธิ|Weight|Net Weight)[:\s]+(\d+(?:\.\d+)?)\s*(?:kg|กก|กิโลกรัม)?/i) ||
                      clean.match(/(\d+(?:\.\d+)?)\s*(?:kg|กก\.?|กิโลกรัม)\b/i);
  if (weightMatch) {
    result.weightKg = parseFloat(weightMatch[1]);
  }

  const loadMatch = clean.match(/(?:รับน้ำหนัก|รับน้ำหนักสูงสุด|Max Load|Loading Capacity)[:\s]+(\d+(?:\.\d+)?)\s*(?:kg|กก|กิโลกรัม)?/i);
  if (loadMatch) {
    result.maxLoadKg = parseFloat(loadMatch[1]);
  }

  // 6. Prices
  const totalMatch = clean.match(/(?:ราคารวม|ราคาขาย|ราคาชุดละ|ราคาสุทธิ|Total Price|Price)[:\s]+(?:฿|THB)?\s*([\d,]+)/i);
  if (totalMatch) {
    result.baseCost = parseInt(totalMatch[1].replace(/,/g, ''), 10);
  }

  const deskPriceMatch = clean.match(/(?:ราคาโต๊ะ|เฉพาะโต๊ะ|Desk Price)[:\s]+(?:฿|THB)?\s*([\d,]+)/i);
  if (deskPriceMatch) {
    result.deskPrice = parseInt(deskPriceMatch[1].replace(/,/g, ''), 10);
  }

  const chairPriceMatch = clean.match(/(?:ราคาเก้าอี้|เก้าอี้ตัวละ|Chair Price)[:\s]+(?:฿|THB)?\s*([\d,]+)/i);
  if (chairPriceMatch) {
    result.chairPrice = parseInt(chairPriceMatch[1].replace(/,/g, ''), 10);
  }

  // 7. Materials
  const matMatch = clean.match(/(?:วัสดุ|โครงสร้าง|Material|Construction)[:\s]+([^\n]+)/i);
  if (matMatch) {
    result.material = matMatch[1].trim();
  }

  // 8. Warranty
  const warMatch = clean.match(/(?:รับประกัน|การรับประกัน|Warranty)[:\s]+([^\n]+)/i);
  if (warMatch) {
    result.warranty = warMatch[1].trim();
  }

  // 9. Lead Time
  const leadMatch = clean.match(/(?:ระยะเวลาผลิต|ระยะเวลาส่งมอบ|Lead Time|Delivery)[:\s]+([^\n]+)/i);
  if (leadMatch) {
    result.leadTime = leadMatch[1].trim();
  }

  // 10. Chair Model
  const chairModMatch = clean.match(/(?:รุ่นเก้าอี้|เก้าอี้รุ่น|Chair Model)[:\s]+([^\n]+)/i);
  if (chairModMatch) {
    result.chairModel = chairModMatch[1].trim();
  }

  return Object.keys(result).length > 0 ? result : null;
}
