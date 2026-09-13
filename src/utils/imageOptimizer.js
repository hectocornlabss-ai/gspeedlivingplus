/**
 * Image Optimizer & WebP Compressor Utility
 * High-performance client-side image resizing and WebP conversion engine.
 * Converts large camera/PNG/JPEG uploads (5-20MB) into ultra-lightweight WebP (50-180KB).
 */

export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Compresses an image File or Blob into modern WebP format
 * @param {File|Blob} file - Original image file from input[type="file"]
 * @param {Object} options - Configuration options
 * @param {number} options.maxWidth - Maximum allowed width (default 1600px)
 * @param {number} options.maxHeight - Maximum allowed height (default 1600px)
 * @param {number} options.quality - WebP quality factor (0.1 to 1.0, default 0.82)
 * @returns {Promise<{ dataUrl: string, originalSize: number, compressedSize: number, originalSizeFormatted: string, compressedSizeFormatted: string, compressionRatio: string, width: number, height: number, format: string }>}
 */
export function compressAndConvertToWebP(file, options = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82
  } = options;

  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('ไฟล์ที่เลือกไม่ใช่รูปภาพที่รองรับ'));
    }

    const originalSize = file.size;
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการอ่านไฟล์รูปภาพ'));

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('ไม่สามารถประมวลผลรูปภาพได้'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional downscaled dimensions
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (aspectRatio > 1) {
            if (width > maxWidth) {
              width = maxWidth;
              height = Math.round(maxWidth / aspectRatio);
            }
          } else {
            if (height > maxHeight) {
              height = maxHeight;
              width = Math.round(maxHeight * aspectRatio);
            }
          }
        }

        // Create canvas with high-dpi rendering
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Canvas 2D Context ไม่พร้อมใช้งาน'));
        }

        // High quality interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        let dataUrl = canvas.toDataURL('image/webp', quality);
        let format = 'webp';

        // Fallback check: if browser doesn't support webp export, fall back to jpeg
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          format = 'jpeg';
        }

        // Calculate compressed byte size from base64 string
        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const compressedSize = Math.round(base64Length * 0.75);

        const savings = Math.max(0, originalSize - compressedSize);
        const compressionRatio = originalSize > 0 
          ? `${((savings / originalSize) * 100).toFixed(1)}%` 
          : '0%';

        resolve({
          dataUrl,
          originalSize,
          compressedSize,
          originalSizeFormatted: formatBytes(originalSize),
          compressedSizeFormatted: formatBytes(compressedSize),
          compressionRatio,
          width,
          height,
          format
        });
      };

      img.src = readerEvent.target.result;
    };

    reader.readAsDataURL(file);
  });
}
