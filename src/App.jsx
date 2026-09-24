import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ArenaHub from './components/ArenaHub';
import AIChatWidget from './components/AIChatWidget';
import ErrorBoundary from './components/ErrorBoundary';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import { getRouteMetadata } from './data/routesConfig';
import { applySEOMetadata } from './utils/seoManager';
import './App.css';

// Code Splitting: Lazy load heavy modules for lightning fast initial load
const AdminAuthGate = lazy(() => import('./components/AdminAuthGate'));
const CompanyProfile = lazy(() => import('./components/CompanyProfile'));
const FranchisePlanner = lazy(() => import('./components/FranchisePlanner'));
const SingleActivityView = lazy(() => import('./components/SingleActivityView'));
const SingleTournamentView = lazy(() => import('./components/SingleTournamentView'));
const TournamentsPage = lazy(() => import('./components/TournamentsPage'));
const ActivitiesPage = lazy(() => import('./components/ActivitiesPage'));

function PageLoadingSpinner({ label = 'กำลังโหลดข้อมูลระบบ...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '55vh',
      padding: '40px 20px',
      color: '#0f172a'
    }}>
      <div style={{
        position: 'relative',
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '3px solid rgba(37, 99, 235, 0.15)',
          borderTopColor: '#2563eb',
          animation: 'spin 0.8s linear infinite'
        }} />
        <div style={{
          position: 'absolute',
          inset: '8px',
          borderRadius: '50%',
          border: '3px solid rgba(249, 115, 22, 0.15)',
          borderBottomColor: '#ea580c',
          animation: 'spin 1.2s linear infinite reverse'
        }} />
        <span style={{ fontSize: '11px', fontWeight: 900, color: '#1d4ed8', letterSpacing: '0.05em' }}>GLP</span>
      </div>
      <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a', letterSpacing: '0.02em', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
        G-Speed Esport Arena System
      </div>
    </div>
  );
}

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
    cleanPath = '/tournaments';
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

    // 5. Tab selection - Dedicated Pages for Tournaments, Activities, Franchise, Company & Arena
    let tab = 'arena';
    let sectionToScroll = null;

    if (path === '/franchise' || path === '/planner') {
      tab = 'franchise';
    } else if (path === '/company' || path === '/about') {
      tab = 'company';
    } else if (path === '/events' || path === '/tournaments' || path.startsWith('/events/') || path.startsWith('/tournaments/')) {
      tab = 'tournaments';
    } else if (path === '/activities' || path === '/gallery') {
      tab = 'activities';
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

  // เลื่อนกลับขึ้นบนสุดเมื่อเปลี่ยนหน้า
  useEffect(() => {
    if (routeState.sectionToScroll && !routeState.actSlug) {
      setTimeout(() => {
        const el = document.getElementById(routeState.sectionToScroll);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (!routeState.sectionToScroll) {
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

  // ดึงข้อมูลทัวร์นาเมนต์ปัจจุบันที่ตรงกับ Slug (WordPress-like Permalink)
  const allTournaments = siteData?.tournaments || [];
  const matchedTournament = routeState.eventSlug
    ? allTournaments.find(t => 
        (t.slug && t.slug.toLowerCase() === routeState.eventSlug.toLowerCase()) || 
        t.id === routeState.eventSlug ||
        (t.seo && t.seo.slug && t.seo.slug.toLowerCase() === routeState.eventSlug.toLowerCase())
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
      <Suspense fallback={<PageLoadingSpinner label="กำลังโหลดระบบควบคุม Admin Security..." />}>
        <AdminAuthGate 
          onExitToPublic={() => {
            navigateTo('/');
          }} 
        />
      </Suspense>
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
                  navigateTo('/tournaments');
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
        <Suspense fallback={<PageLoadingSpinner />}>
          {routeState.eventSlug ? (
            <SingleTournamentView 
              tournament={matchedTournament}
              onBack={() => navigateTo('/tournaments')}
              onNavigateHome={() => navigateTo('/')}
              onSelectTournament={(tour) => {
                const slug = tour.slug || tour.seo?.slug || tour.id;
                navigateTo(`/tournaments/${slug}`);
              }}
              onNavigateFranchise={() => navigateTo('/franchise')}
            />
          ) : routeState.actSlug ? (
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
                      navigateTo(`/tournaments/${slug}`);
                    } else {
                      navigateTo('/tournaments');
                    }
                  }}
                  onSelectActivitySlug={(slug) => {
                    navigateTo(`/activities/${slug}`);
                  }}
                  onNavigateTournaments={() => {
                    navigateTo('/tournaments');
                  }}
                  onNavigateActivities={() => {
                    navigateTo('/activities');
                  }}
                  onNavigateFranchise={() => {
                    navigateTo('/franchise');
                  }} 
                />
              )}

              {routeState.tab === 'tournaments' && (
                <TournamentsPage 
                  initialTournamentSlug={routeState.eventSlug}
                  onSelectTournamentSlug={(slug) => {
                    if (slug) {
                      navigateTo(`/tournaments/${slug}`);
                    } else {
                      navigateTo('/tournaments');
                    }
                  }}
                  onNavigateHome={() => navigateTo('/')}
                  onNavigateFranchise={() => navigateTo('/franchise')}
                />
              )}

              {routeState.tab === 'activities' && (
                <ActivitiesPage 
                  initialCategory={routeState.catParam || 'all'}
                  initialTag={routeState.tagParam || 'all'}
                  onSelectActivitySlug={(slug) => {
                    navigateTo(`/activities/${slug}`);
                  }}
                  onNavigateHome={() => navigateTo('/')}
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
        </Suspense>
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
