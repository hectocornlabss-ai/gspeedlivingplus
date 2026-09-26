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

/**
 * ตัดแยก content จาก String ไม่ว่าผู้ใช้จะกรอกทั้งแท็ก <meta ... content="val"> หรือกรอกเฉพาะ value
 */
export function extractMetaContent(raw = '') {
  if (!raw) return '';
  const trimmed = raw.trim();
  const match = trimmed.match(/content=["']([^"']+)["']/i);
  if (match) return match[1];
  return trimmed.replace(/^content=|^value=/i, '').replace(/^['"]|['"]$/g, '');
}

/**
 * ติดตั้ง Google Search Console, Bing Webmaster, Google Tag Manager, Meta Pixel และ AI SEO ลงใน <head>
 */
export function applyTrackingAndVerificationScripts(seoConfig = {}) {
  if (typeof document === 'undefined' || !seoConfig) return;

  // 1. Google Site Verification (Search Console)
  const googleVal = extractMetaContent(seoConfig.googleSiteVerification);
  if (googleVal) {
    setMetaTag('name', 'google-site-verification', googleVal);
  }

  // 2. Bing Webmaster Tools
  const bingVal = extractMetaContent(seoConfig.bingSiteVerification);
  if (bingVal) {
    setMetaTag('name', 'msvalidate.01', bingVal);
  }

  // 3. AI SEO & Intelligent Search Overviews (GEO Directives)
  if (seoConfig.aiSeoEnabled) {
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'googlebot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
  }

  // 4. Google Tag Manager (GTM)
  const gtmId = (seoConfig.googleTagManagerId || '').trim();
  if (seoConfig.gtmEnabled && gtmId && gtmId.startsWith('GTM-')) {
    if (!document.getElementById('glp-gtm-script')) {
      const gtmScript = document.createElement('script');
      gtmScript.id = 'glp-gtm-script';
      gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');`;
      document.head.appendChild(gtmScript);
    }
  }

  // 5. Meta / Facebook Pixel
  const fbPixelId = (seoConfig.facebookPixelId || '').trim();
  if (seoConfig.fbPixelEnabled && fbPixelId && /^\d+$/.test(fbPixelId)) {
    if (!document.getElementById('glp-fb-pixel')) {
      const fbScript = document.createElement('script');
      fbScript.id = 'glp-fb-pixel';
      fbScript.innerHTML = `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${fbPixelId}');
      fbq('track', 'PageView');`;
      document.head.appendChild(fbScript);
    }
  }

  // 6. Custom Head Script Injection (Safe Sandbox)
  if (seoConfig.customScriptsEnabled && seoConfig.customHeadScripts) {
    let customEl = document.getElementById('glp-custom-head-scripts');
    if (!customEl) {
      customEl = document.createElement('div');
      customEl.id = 'glp-custom-head-scripts';
      document.head.appendChild(customEl);
    }
    customEl.innerHTML = seoConfig.customHeadScripts;
  }
}
