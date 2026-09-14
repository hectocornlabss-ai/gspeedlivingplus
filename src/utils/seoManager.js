// seoManager.js - Dynamic SEO & OpenGraph Meta Tag Engine
// อัปเดต Title, Meta Description, Keywords, OpenGraph, และ Canonical Link แบบเรียลไทม์

/**
 * อัปเดตแท็ก meta ใน head ถ้าไม่มีให้สร้างใหม่
 */
function setMetaTag(attrName, attrVal, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrVal);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * อัปเดต canonical link
 */
function setCanonical(url) {
  if (!url) return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

/**
 * ฟังก์ชันหลักในการนำ metadata ไปอัปเดตลงใน DOM <head>
 */
export function applySEOMetadata(metadata = {}) {
  if (!metadata) return;

  // 1. Update Title
  if (metadata.metaTitle) {
    document.title = metadata.metaTitle;
  }

  // 2. Update Standard SEO Meta
  if (metadata.metaDesc) {
    setMetaTag('name', 'description', metadata.metaDesc);
  }
  if (metadata.keywords) {
    setMetaTag('name', 'keywords', metadata.keywords);
  }

  // 3. Update Open Graph (Facebook / LINE / Discord / Social Share)
  setMetaTag('property', 'og:title', metadata.metaTitle || document.title);
  setMetaTag('property', 'og:description', metadata.metaDesc || '');
  setMetaTag('property', 'og:url', metadata.canonical || window.location.href);
  if (metadata.ogImage) {
    setMetaTag('property', 'og:image', metadata.ogImage);
  }

  // 4. Update Twitter Card
  setMetaTag('name', 'twitter:title', metadata.metaTitle || document.title);
  setMetaTag('name', 'twitter:description', metadata.metaDesc || '');
  if (metadata.ogImage) {
    setMetaTag('name', 'twitter:image', metadata.ogImage);
  }

  // 5. Update Canonical
  if (metadata.canonical) {
    setCanonical(metadata.canonical);
  }
}
