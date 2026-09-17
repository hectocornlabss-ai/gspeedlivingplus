import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ArenaHub from './components/ArenaHub';
import CompanyProfile from './components/CompanyProfile';
import FranchisePlanner from './components/FranchisePlanner';
import AdminAuthGate from './components/AdminAuthGate';
import SingleActivityView from './components/SingleActivityView';
import AIChatWidget from './components/AIChatWidget';
import ErrorBoundary from './components/ErrorBoundary';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { getRouteMetadata } from './data/routesConfig';
import { applySEOMetadata } from './utils/seoManager';
import './App.css';

/**
 * แปลง Legacy Hash (#/admin, #tournaments) ให้เป็น Clean Semantic Path แบบไร้ # ทันที
 */
function normalizeLegacyHash() {
  const hash = window.location.hash || '';
  if (!hash) return null;

  let cleanPath = '/';
  if (hash === '#/admin' || hash === '#admin') {
    cleanPath = '/admin';
  } else if (hash.includes('tournament') || hash.includes('event')) {
    cleanPath = '/events';
  } else if (hash.includes('franchise') || hash.includes('planner')) {
    cleanPath = '/franchise';
  } else if (hash.includes('company') || hash.includes('about')) {
    cleanPath = '/company';
  } else if (hash.includes('activity') || hash.includes('gallery') || hash.includes('news')) {
    const m = hash.match(/#(?:activity|activities|news)\/([^/?#]+)/i);
    cleanPath = m ? `/activities/${m[1]}` : '/activities';
  }

  // ล้าง hash ออกจาก address bar ของเบราว์เซอร์ทันที
  window.history.replaceState(null, '', cleanPath);
  return cleanPath;
}

function AppContent() {
  const { siteData } = useSiteData();

  // ตรวจจับสถานะเส้นทางจาก window.location.pathname
  const parseCurrentLocation = useCallback(() => {
    // 1. Auto cleanup hash if present
    normalizeLegacyHash();

    const path = window.location.pathname || '/';

    // 1. Admin route
    const isAdmin = path === '/admin' || path.startsWith('/admin/');

    // 2. Tournament Single Route: /events/:slug หรือ /tournaments/:slug
    const tourMatch = path.match(/^\/(?:events|tournaments)\/([^/?#]+)/i);
    const eventSlug = tourMatch ? decodeURIComponent(tourMatch[1]) : null;

    // 3. Activity Single Route: /activities/:slug หรือ /news/:slug
    const actMatch = path.match(/^\/(?:activities|activity|news|article)\/([^/?#]+)/i);
    const actSlug = actMatch ? decodeURIComponent(actMatch[1]) : null;

    // 4. Query Params (Tags and Categories filter)
    const searchParams = new URLSearchParams(window.location.search);
    const tagParam = searchParams.get('tag') ? decodeURIComponent(searchParams.get('tag')) : null;
    const catParam = searchParams.get('category') ? decodeURIComponent(searchParams.get('category')) : null;

    // 5. Tab selection
    let tab = 'arena';
    let sectionToScroll = null;

    if (path === '/franchise' || path === '/planner') {
      tab = 'franchise';
    } else if (path === '/company' || path === '/about') {
      tab = 'company';
    } else if (path === '/events' || path === '/tournaments') {
      tab = 'arena';
      sectionToScroll = 'tournaments';
    } else if (path === '/activities' || path === '/gallery') {
      tab = 'arena';
      sectionToScroll = 'activities';
    } else {
      tab = 'arena';
    }

    return {
      isAdmin,
      eventSlug,
      actSlug,
      tab,
      sectionToScroll,
      tagParam,
      catParam,
      pathname: path
    };
  }, []);

  const [routeState, setRouteState] = useState(parseCurrentLocation);

  // ฟังการเปลี่ยนแปลงเส้นทาง (popstate เมื่อกด Back/Forward ในเบราว์เซอร์)
  useEffect(() => {
    const handlePopState = () => {
      setRouteState(parseCurrentLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseCurrentLocation]);

  // อัปเดต SEO Metadata (Title, Meta Description, Keywords, OG Tags) ทุกครั้งที่เปลี่ยนหน้า
  useEffect(() => {
    const meta = getRouteMetadata(routeState.pathname, {
      tournaments: siteData?.tournaments,
      gallery: siteData?.gallery,
      news: siteData?.news
    });
    applySEOMetadata(meta);
  }, [routeState.pathname, routeState.eventSlug, routeState.actSlug, siteData]);

  // จัดการ Scroll ไปยังส่วนที่ระบุเมื่อเข้าเส้นทางหมวดหมู่ (/events, /activities)
  useEffect(() => {
    if (routeState.sectionToScroll && !routeState.actSlug) {
      setTimeout(() => {
        const el = document.getElementById(routeState.sectionToScroll);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (!routeState.sectionToScroll && !routeState.actSlug && !routeState.eventSlug) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [routeState.sectionToScroll, routeState.tab, routeState.actSlug, routeState.eventSlug]);

  // ดึงข้อมูลบทความปัจจุบันที่ตรงกับ Slug
  const allArticles = [...(siteData?.gallery || []), ...(siteData?.news || [])];
  const matchedActivity = routeState.actSlug
    ? allArticles.find(item => 
        (item.slug && item.slug.toLowerCase() === routeState.actSlug.toLowerCase()) || 
        item.id === routeState.actSlug
      )
    : null;

  // ฟังก์ชันนำทาง Clean Path กลาง
  const navigateTo = (path) => {
    window.history.pushState(null, '', path);
    setRouteState(parseCurrentLocation());
  };

  // Dynamic Theme Styling variables
  const themeStyles = {
    '--primary': siteData?.theme?.primaryColor || '#1d4ed8',
    '--primary-hover': siteData?.theme?.secondaryColor || '#0ea5e9',
    backgroundColor: siteData?.theme?.backgroundColor || '#ffffff'
  };

  // 1. ถ้าเข้าเส้นทาง /admin แสดงหน้า AdminAuthGate แบบเต็มจอ
  if (routeState.isAdmin) {
    return (
      <AdminAuthGate 
        onExitToPublic={() => {
          navigateTo('/');
        }} 
      />
    );
  }

  return (
    <div className="app-layout" style={themeStyles}>
      {/* Top Announcement Bar */}
      <div className="top-announcement-bar">
        <div className="container ticker-container">
          <span className="ticker-badge">{siteData.tickerBadge || 'ประกาศ'}</span>
          <span className="ticker-text">
            {siteData.tickerText}
          </span>
          {siteData.tickerLinkVisible !== false && (
            <button 
              onClick={() => {
                const target = siteData.tickerLinkTarget || siteData.tickerLinkTab || 'franchise';
                if (target.startsWith('http://') || target.startsWith('https://')) {
                  window.open(target, '_blank', 'noopener,noreferrer');
                } else if (target === 'events' || target === 'tournaments') {
                  navigateTo('/events');
                } else if (target === 'activities' || target === 'gallery') {
                  navigateTo('/activities');
                } else if (target === 'company' || target === 'about') {
                  navigateTo('/company');
                } else {
                  navigateTo('/franchise');
                }
              }} 
              className="ticker-link"
            >
              {siteData.tickerLinkText || 'เปิดระบบ 3D'}
            </button>
          )}
        </div>
      </div>

      {/* Main Header / Navigation (Clean Path URLs) */}
      <Navbar 
        activeTab={routeState.tab} 
        currentPath={routeState.pathname}
        onNavigate={navigateTo}
      />

      {/* Main Content Areas */}
      <main className="main-content">
        {routeState.actSlug ? (
          <SingleActivityView 
            activity={matchedActivity}
            onBack={(target = 'activities', filterParams = null) => {
              if (target === 'home') {
                navigateTo('/');
              } else if (filterParams?.tag) {
                navigateTo(`/activities?tag=${encodeURIComponent(filterParams.tag)}`);
              } else if (filterParams?.category) {
                navigateTo(`/activities?category=${encodeURIComponent(filterParams.category)}`);
              } else {
                navigateTo('/activities');
              }
            }}
            onSelectTag={(tag) => {
              navigateTo(`/activities?tag=${encodeURIComponent(tag)}`);
            }}
            onSelectCategory={(cat) => {
              navigateTo(`/activities?category=${encodeURIComponent(cat)}`);
            }}
            onSelectActivity={(act) => {
              const slug = act.slug || act.id;
              navigateTo(`/activities/${slug}`);
            }}
          />
        ) : (
          <>
            {routeState.tab === 'arena' && (
              <ArenaHub 
                initialTournamentSlug={routeState.eventSlug}
                initialCategory={routeState.catParam || 'all'}
                initialTag={routeState.tagParam || 'all'}
                onSelectTournamentSlug={(slug) => {
                  if (slug) {
                    navigateTo(`/events/${slug}`);
                  } else {
                    navigateTo('/events');
                  }
                }}
                onSelectActivitySlug={(slug) => {
                  navigateTo(`/activities/${slug}`);
                }}
                onNavigateFranchise={() => {
                  navigateTo('/franchise');
                }} 
              />
            )}

            {routeState.tab === 'company' && (
              <CompanyProfile 
                onNavigateFranchise={() => {
                  navigateTo('/franchise');
                }} 
              />
            )}

            {routeState.tab === 'franchise' && (
              <FranchisePlanner />
            )}
          </>
        )}
      </main>

      {/* Global Footer (Clean Navigation) */}
      <Footer onNavigate={navigateTo} />

      {/* Customer Service Concierge Chat Widget with RAG */}
      <AIChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SiteDataProvider>
        <AppContent />
      </SiteDataProvider>
    </ErrorBoundary>
  );
}
