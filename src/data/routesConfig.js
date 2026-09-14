// routesConfig.js - Centralized Route, Category & Pre-crafted SEO Descriptions Registry
// รวมศูนย์เส้นทาง Clean Path, หมวดหมู่, และคำอธิบาย SEO สำเร็จรูปสำหรับทุกหน้าและทัวร์นาเมนต์

export const SITE_BASE_URL = 'https://gspeedesport.com';

export const ROUTES_CONFIG = {
  // 1. หน้าหลัก (Home Hub)
  home: {
    path: '/',
    name: 'หน้าหลัก',
    sectionTitle: 'ศูนย์กีฬาอีสปอร์ตครบวงจร & คอมมูนิตี้ระดับประเทศ',
    badge: 'HOME • GLP LIVING PLUS',
    metaTitle: 'GLP : G Speed Living Plus | ศูนย์อีสปอร์ตครบวงจร & ระบบแฟรนไชส์จัดผังร้านอัจฉริยะ',
    metaDesc: 'ศูนย์กีฬาอีสปอร์ตและคอมมูนิตี้ครบวงจร 24 ชม. ณ รามคำแหง 53 รองรับการจัดแข่งทัวร์นาเมนต์ทุกระดับ เวที 5v5 สเปก 360Hz และระบบจำลองผังร้านแฟรนไชส์ 3D อัจฉริยะ คืนทุนไว',
    keywords: 'GLP, G Speed Living Plus, ร้านเกมรามคำแหง, ทัวร์นาเมนต์เกม, แฟรนไชส์ร้านเกม, ออกแบบร้านเกม 3D, จัดแข่งอีสปอร์ต, ร้านเกม 24 ชม',
    ogImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    breadcrumbs: [
      { label: 'หน้าหลัก', path: '/' }
    ]
  },

  // 2. ศูนย์รวมงานแข่งและอีเวนต์ทั้งหมด (All Events & Tournaments Hub)
  events: {
    path: '/events',
    aliasPaths: ['/tournaments'],
    name: 'งานแข่ง & อีเวนต์',
    sectionTitle: 'ปฏิทินการแข่งขัน & ทัวร์นาเมนต์อีสปอร์ต',
    badge: 'TOURNAMENTS & COMMUNITY EVENTS',
    metaTitle: 'ทัวร์นาเมนต์ & ปฏิทินการแข่งขันอีสปอร์ต | GLP : G Speed Living Plus',
    metaDesc: 'ศูนย์รวมการแข่งขันอีสปอร์ตและทัวร์นาเมนต์ระดับประเทศ ชิงเงินรางวัลรวมกว่าหลายแสนบาท พิสูจน์ฝีมือบนเวที LAN Final ถ่ายทอดสดทั่วประเทศ สเปกเครื่อง Intel i9 + RTX 4080 จอ 360Hz สมัครแข่งขันได้ทันที',
    keywords: 'แข่งเกม, ทัวร์นาเมนต์อีสปอร์ต, แข่ง VALORANT, แข่ง RoV, แข่ง CS2, เงินรางวัลแข่งเกม, LAN Final, สมัครแข่งเกม, GLP รามคำแหง 53',
    ogImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    breadcrumbs: [
      { label: 'หน้าหลัก', path: '/' },
      { label: 'การแข่งขัน & อีเวนต์', path: '/events' }
    ]
  },

  // 3. ภาพกิจกรรม & ไฮไลต์แกลเลอรี (Activities & Gallery Hub)
  activities: {
    path: '/activities',
    aliasPaths: ['/gallery', '/events-gallery'],
    name: 'ภาพกิจกรรม & แกลเลอรี',
    sectionTitle: 'ประมวลภาพกิจกรรม & บรรยากาศงานแข่งระดับประเทศ',
    badge: 'EVENT HIGHLIGHTS & GALLERY',
    metaTitle: 'ภาพกิจกรรม & ไฮไลต์การแข่งขันอีสปอร์ต | GLP : G Speed Living Plus',
    metaDesc: 'ชมคลังภาพกิจกรรม บรรยากาศการแข่งขันอีสปอร์ตสุดมันส์ เวทีแสงสีเสียง 4K อุปกรณ์เกมมิ่งเกรดโปร และคอมมูนิตี้เกมเมอร์ชาวไทย ณ GLP : G Speed Living Plus รามคำแหง 53',
    keywords: 'ภาพกิจกรรมร้านเกม, บรรยากาศแข่งอีสปอร์ต, แกลเลอรีงานแข่ง, เวทีแข่งขันเกม, แคสเตอร์อีสปอร์ต, นักกีฬาอีสปอร์ตไทย',
    ogImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    breadcrumbs: [
      { label: 'หน้าหลัก', path: '/' },
      { label: 'ภาพกิจกรรม & แกลเลอรี', path: '/activities' }
    ]
  },

  // 4. แฟรนไชส์ & จำลองผังร้าน 3D (3D Studio & Franchise Planner)
  franchise: {
    path: '/franchise',
    aliasPaths: ['/planner', '/3d-studio'],
    name: 'แฟรนไชส์ & แปลนร้าน 3D',
    sectionTitle: 'ระบบจำลองผังร้าน 3D & วิเคราะห์ผลตอบแทนแฟรนไชส์อัจฉริยะ',
    badge: '3D PLANNER & FRANCHISE',
    metaTitle: 'ระบบจำลองผังร้าน 3D & วางระบบแฟรนไชส์ร้านเกม | GLP : G Speed Living Plus',
    metaDesc: 'จำลองการจัดวางผังร้านเกมเสมือนจริงแบบ 3D Interactive เลือกสเปกคอมพิวเตอร์ โต๊ะ เก้าอี้ คำนวณงบลงทุน จุดคุ้มทุน และวางระบบ Diskless Server ครบวงจร คืนทุนไวใน 12-18 เดือน',
    keywords: 'เปิดร้านเกม, แฟรนไชส์ร้านเกม, ออกแบบร้านเกม 3D, ลงทุนร้านเน็ต, งบเปิดร้านเกม, ระบบ Diskless, สเปกคอมร้านเกม, คืนทุนไว',
    ogImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    breadcrumbs: [
      { label: 'หน้าหลัก', path: '/' },
      { label: 'ระบบแฟรนไชส์ & แปลนร้าน 3D', path: '/franchise' }
    ]
  },

  // 5. ข้อมูลองค์กร & ผู้บริหาร (Company & Leadership Profile)
  company: {
    path: '/company',
    aliasPaths: ['/about', '/about-us'],
    name: 'เกี่ยวกับเรา & ผู้บริหาร',
    sectionTitle: 'วิสัยทัศน์ผู้นำกีฬาอีสปอร์ต & มาตรฐานสากลแห่งแรกในไทย',
    badge: 'ABOUT & LEADERSHIP',
    metaTitle: 'เกี่ยวกับเรา & วิสัยทัศน์ผู้บริหาร | GLP : G Speed Living Plus',
    metaDesc: 'ทำความรู้จัก GLP : G Speed Living Plus ผู้นำด้านธุรกิจสนามแข่งขันอีสปอร์ตและร้านอินเทอร์เน็ตคาเฟ่มาตรฐานสากลกว่า 10 ปี ขับเคลื่อนวงการเกมเมอร์ไทยสู่อนาคตด้วยเทคโนโลยีและพันธมิตรระดับโลก',
    keywords: 'GLP, G Speed Living Plus, ประวัติร้านจีสปีด, ผู้บริหาร GSpeed, ร้านเกมมาตรฐานสากล, วงการอีสปอร์ตไทย, บริษัทเกมไทย',
    ogImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    breadcrumbs: [
      { label: 'หน้าหลัก', path: '/' },
      { label: 'เกี่ยวกับองค์กร & ผู้บริหาร', path: '/company' }
    ]
  },

  // 6. ระบบหลังบ้าน (Master CMS Administration)
  admin: {
    path: '/admin',
    aliasPaths: ['/cms'],
    name: 'ระบบจัดการหลังบ้าน',
    sectionTitle: 'GLP Master CMS & Management Dashboard',
    badge: 'ADMINISTRATION & CMS',
    metaTitle: 'GLP Master CMS | ระบบจัดการเว็บไซต์และทัวร์นาเมนต์ GLP : G Speed Living Plus',
    metaDesc: 'ระบบบริหารจัดการหลังบ้านครบวงจร จัดการทัวร์นาเมนต์ รายชื่อนักแข่ง ภาพกิจกรรม ปรับแต่งข้อมูล SEO และระบบวางแผนแฟรนไชส์',
    keywords: 'admin cms, จัดการงานแข่ง, esports cms, gspeed admin',
    ogImage: '/favicon.svg',
    breadcrumbs: [
      { label: 'หน้าหลัก', path: '/' },
      { label: 'ผู้ดูแลระบบ', path: '/admin' }
    ]
  }
};

/**
 * ดึงข้อมูล SEO และ Route Metadata ให้ตรงกับ Pathname ปัจจุบัน
 * รองรับ Dynamic Routes:
 * - /events/:slug (ทัวร์นาเมนต์รายรายการ)
 * - /activities/:slug (บทความ/ภาพกิจกรรมรายรายการ)
 */
export function getRouteMetadata(pathname = '/', extraData = {}) {
  const cleanPath = (pathname || '/').toLowerCase().trim();

  // 1. ตรวจสอบ Dynamic Route: ทัวร์นาเมนต์รายรายการ (/events/:slug หรือ /tournaments/:slug)
  const eventMatch = cleanPath.match(/^\/(?:events|tournaments)\/([^/?#]+)/i);
  if (eventMatch) {
    const slug = decodeURIComponent(eventMatch[1]);
    const tournaments = extraData.tournaments || [];
    const tour = tournaments.find(t => 
      (t.slug && t.slug.toLowerCase() === slug.toLowerCase()) || 
      t.id === slug ||
      (t.seo && t.seo.slug && t.seo.slug.toLowerCase() === slug.toLowerCase())
    );

    if (tour) {
      const tourTitle = tour.seo?.metaTitle || `${tour.title} | ทัวร์นาเมนต์ชิงเงินรางวัล ${tour.prizePool}`;
      const tourDesc = tour.seo?.metaDesc || tour.desc || `การแข่งขัน ${tour.game} (${tour.gameCategory}) สุดยิ่งใหญ่ ณ GLP : G Speed Living Plus รามคำแหง 53 เงินรางวัลรวม ${tour.prizePool} สเปกเครื่อง 360Hz`;
      const tourKeywords = tour.seo?.keywords || `${tour.game}, GLP, G Speed Living Plus, แข่งเกม, ทัวร์นาเมนต์, ${tour.gameCategory}, รามคำแหง 53`;
      const tourImage = tour.seo?.ogImage || tour.bannerImage || ROUTES_CONFIG.events.ogImage;

      return {
        type: 'tournament_single',
        path: `/events/${tour.slug || tour.id}`,
        canonical: `${SITE_BASE_URL}/events/${tour.slug || tour.id}`,
        name: tour.title,
        badge: `${tour.game.toUpperCase()} • ${tour.gameCategory || 'TOURNAMENT'}`,
        metaTitle: tourTitle,
        metaDesc: tourDesc,
        keywords: tourKeywords,
        ogImage: tourImage,
        breadcrumbs: [
          { label: 'หน้าหลัก', path: '/' },
          { label: 'การแข่งขัน & อีเวนต์', path: '/events' },
          { label: tour.title, path: `/events/${tour.slug || tour.id}` }
        ],
        itemData: tour
      };
    }
  }

  // 2. ตรวจสอบ Dynamic Route: บทความ/กิจกรรมรายรายการ (/activities/:slug หรือ /activity/:slug หรือ /news/:slug)
  const activityMatch = cleanPath.match(/^\/(?:activities|activity|article|news)\/([^/?#]+)/i);
  if (activityMatch) {
    const slug = decodeURIComponent(activityMatch[1]);
    const articles = [...(extraData.gallery || []), ...(extraData.news || [])];
    const act = articles.find(a => 
      (a.slug && a.slug.toLowerCase() === slug.toLowerCase()) || 
      a.id === slug
    );

    if (act) {
      const actTitle = `${act.title} | GLP : G Speed Living Plus`;
      const actDesc = act.desc || act.summary || `ภาพกิจกรรมและเนื้อหาข่าวสาร ${act.title} ประจำศูนย์ GLP : G Speed Living Plus รามคำแหง 53`;
      const actKeywords = `${act.tag || act.category || 'Esports'}, G-Speed, ข่าวกีฬาเกม, กิจกรรมร้านเกม, รามคำแหง 53`;
      const actImage = act.image || ROUTES_CONFIG.activities.ogImage;

      return {
        type: 'activity_single',
        path: `/activities/${act.slug || act.id}`,
        canonical: `${SITE_BASE_URL}/activities/${act.slug || act.id}`,
        name: act.title,
        badge: act.tag || act.category || 'ACTIVITY',
        metaTitle: actTitle,
        metaDesc: actDesc,
        keywords: actKeywords,
        ogImage: actImage,
        breadcrumbs: [
          { label: 'หน้าหลัก', path: '/' },
          { label: 'ภาพกิจกรรม & แกลเลอรี', path: '/activities' },
          { label: act.title, path: `/activities/${act.slug || act.id}` }
        ],
        itemData: act
      };
    }
  }

  // 3. Static Routes
  if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) {
    return { ...ROUTES_CONFIG.admin, type: 'admin', canonical: `${SITE_BASE_URL}/admin` };
  }
  if (cleanPath === '/franchise' || cleanPath === '/planner' || cleanPath === '/3d-studio') {
    return { ...ROUTES_CONFIG.franchise, type: 'franchise', canonical: `${SITE_BASE_URL}/franchise` };
  }
  if (cleanPath === '/company' || cleanPath === '/about' || cleanPath === '/about-us') {
    return { ...ROUTES_CONFIG.company, type: 'company', canonical: `${SITE_BASE_URL}/company` };
  }
  if (cleanPath === '/events' || cleanPath === '/tournaments') {
    return { ...ROUTES_CONFIG.events, type: 'events', canonical: `${SITE_BASE_URL}/events` };
  }
  if (cleanPath === '/activities' || cleanPath === '/gallery') {
    return { ...ROUTES_CONFIG.activities, type: 'activities', canonical: `${SITE_BASE_URL}/activities` };
  }

  // Default: Home
  return { ...ROUTES_CONFIG.home, type: 'home', canonical: `${SITE_BASE_URL}/` };
}
