/**
 * G-Speed Esport Arena - Security & Input Sanitization Utilities
 * Protects against XSS, malicious URI protocols (javascript:), and HTML injection.
 */

/**
 * Sanitizes URLs to prevent XSS via javascript: or data: URIs in href attributes.
 * Allows safe protocols: http, https, mailto, tel, relative paths (#, /).
 * 
 * @param {string} url - Input URL to sanitize
 * @param {string} defaultFallback - Fallback URL if invalid/unsafe (default: '#')
 * @returns {string} Sanitized safe URL
 */
export function sanitizeSafeUrl(url, defaultFallback = '#') {
  if (!url || typeof url !== 'string') return defaultFallback;

  const trimmed = url.trim();

  // Explicitly block javascript: and vbscript: URIs (case-insensitive, including whitespace/control chars)
  // eslint-disable-next-line no-control-regex
  const sanitizedProtocol = trimmed.replace(/[\u0000-\u001F\u007F-\u009F\s]+/g, '');
  if (/^(?:javascript|vbscript):/i.test(sanitizedProtocol)) {
    return defaultFallback;
  }

  // Allow safe absolute URLs
  if (/^(?:https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  // Allow relative paths, anchors, and queries
  if (/^(?:\/|#|\?)/.test(trimmed)) {
    return trimmed;
  }

  // If user typed domain without protocol (e.g. "www.zowie.com" or "facebook.com/gspeed")
  if (/^[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+/i.test(trimmed) && !trimmed.includes(':')) {
    return `https://${trimmed}`;
  }

  return defaultFallback;
}

/**
 * Checks if a URL is safe to open via window.open()
 * 
 * @param {string} url - URL to check
 * @returns {boolean} True if safe
 */
export function isSafeExternalUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const sanitized = sanitizeSafeUrl(url, '');
  return sanitized.startsWith('http://') || sanitized.startsWith('https://');
}

/**
 * Strips dangerous HTML tags and scripts from a plain text string
 * 
 * @param {string} input - Plain text input
 * @returns {string} Sanitized text
 */
export function sanitizePlainText(input) {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}
