import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ArenaHub from './components/ArenaHub';
import CompanyProfile from './components/CompanyProfile';
import FranchisePlanner from './components/FranchisePlanner';
import AdminAuthGate from './components/AdminAuthGate';
import SingleActivityView from './components/SingleActivityView';
import AIChatWidget from './components/AIChatWidget';
import { SiteDataProvider, useSiteData } from './context/SiteDataContext';
import './App.css';

function AppContent() {
  const { siteData } = useSiteData();

  // Route check for separate admin path (/admin or #/admin)
  const getIsAdminPath = () => {
    const hash = window.location.hash || '';
    const path = window.location.pathname || '';
    return hash === '#/admin' || hash === '#admin' || path === '/admin' || path.startsWith('/admin/');
  };

  // Route check for single activity or article path (/activity/:slug or #/activity/:slug)
  const getActivitySlug = () => {
    const path = window.location.pathname || '';
    const pathMatch = path.match(/^\/(?:activity|article|news)\/([^/?#]+)/i);
    if (pathMatch) return decodeURIComponent(pathMatch[1]);

    const hash = window.location.hash || '';
    const hashMatch = hash.match(/^#\/?(?:activity|article|news)\/([^/?#]+)/i);
    if (hashMatch) return decodeURIComponent(hashMatch[1]);

    return null;
  };

  // Route check for tab routes (/franchise, /company, /about)
  const getTabFromRoute = () => {
    const path = (window.location.pathname || '').replace(/^\//, '').toLowerCase();
    const hash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
    
    if (path === 'franchise' || hash === 'franchise') return 'franchise';
    if (path === 'company' || path === 'about' || hash === 'company' || hash === 'about') return 'company';
    return 'arena';
  };

  const [isAdminRoute, setIsAdminRoute] = useState(getIsAdminPath);
  const [currentActivitySlug, setCurrentActivitySlug] = useState(getActivitySlug);
  const [activeTab, setActiveTab] = useState(getTabFromRoute);

  useEffect(() => {
    const handleRouteChange = () => {
      const isAdm = getIsAdminPath();
      const slug = getActivitySlug();
      setIsAdminRoute(isAdm);
      setCurrentActivitySlug(slug);
      if (!slug && !isAdm) {
        setActiveTab(getTabFromRoute());
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Scroll to top or anchor when switching tabs or activity
  useEffect(() => {
    const hash = window.location.hash || '';
    // If navigating to an anchor like #activities or #tournaments, scroll to it smoothly
    if (hash && hash.startsWith('#') && !hash.startsWith('#/')) {
      const targetId = hash.slice(1);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else if (!hash.startsWith('#/')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab, currentActivitySlug]);

  // Match current activity or news article object
  const allArticles = [...(siteData?.gallery || []), ...(siteData?.news || [])];
  const matchedActivity = currentActivitySlug
    ? allArticles.find(item => 
        (item.slug && item.slug.toLowerCase() === currentActivitySlug.toLowerCase()) || 
        item.id === currentActivitySlug
      )
    : null;

  // Dynamic Theme Styling variables
  const themeStyles = {
    '--primary': siteData?.theme?.primaryColor || '#1d4ed8',
    '--primary-hover': siteData?.theme?.secondaryColor || '#0ea5e9',
    backgroundColor: siteData?.theme?.backgroundColor || '#ffffff'
  };

  // If visiting the isolated admin path (#/admin), render secure AdminAuthGate
  if (isAdminRoute) {
    return (
      <div className="app-layout admin-mode">
        <AdminAuthGate 
          onExitToPublic={() => {
            window.location.hash = '';
            if (window.location.pathname === '/admin') {
              window.history.pushState(null, '', '/');
            }
            setIsAdminRoute(false);
          }} 
        />
      </div>
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
                setCurrentActivitySlug(null);
                if (target.startsWith('http://') || target.startsWith('https://')) {
                  window.open(target, '_blank', 'noopener,noreferrer');
                } else if (target.startsWith('#')) {
                  setActiveTab('arena');
                  window.history.pushState(null, '', `/${target}`);
                  setTimeout(() => {
                    const el = document.getElementById(target.replace('#', ''));
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 120);
                } else {
                  const validTabs = ['arena', 'company', 'franchise'];
                  const dest = validTabs.includes(target.toLowerCase()) ? target.toLowerCase() : 'franchise';
                  setActiveTab(dest);
                  window.history.pushState(null, '', dest === 'arena' ? '/' : `/${dest}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }} 
              className="ticker-link"
            >
              {siteData.tickerLinkText || 'เปิดระบบ 3D'}
            </button>
          )}
        </div>
      </div>

      {/* Main Header / Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setCurrentActivitySlug(null);
          setActiveTab(tab);
          const cleanPath = tab === 'arena' ? '/' : `/${tab}`;
          window.history.pushState(null, '', cleanPath);
        }} 
      />

      {/* Main Content Areas */}
      <main className="main-content">
        {currentActivitySlug ? (
          <SingleActivityView 
            activity={matchedActivity}
            onBack={(target = 'activities') => {
              const safeTarget = (typeof target === 'string' && target) ? target : 'activities';
              setCurrentActivitySlug(null);
              setActiveTab('arena');
              if (safeTarget === 'home') {
                window.history.pushState(null, '', '/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                const anchor = safeTarget.startsWith('#') ? safeTarget : `#${safeTarget}`;
                window.history.pushState(null, '', `/${anchor}`);
                setTimeout(() => {
                  const targetElement = document.getElementById(anchor.replace('#', ''));
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }, 120);
              }
            }}
            onSelectActivity={(act) => {
              const slug = act.slug || act.id;
              setCurrentActivitySlug(slug);
              window.history.pushState(null, '', `/activity/${slug}`);
            }}
          />
        ) : (
          <>
            {activeTab === 'arena' && (
              <ArenaHub onNavigateFranchise={() => {
                setCurrentActivitySlug(null);
                setActiveTab('franchise');
              }} />
            )}

            {activeTab === 'company' && (
              <CompanyProfile onNavigateFranchise={() => {
                setCurrentActivitySlug(null);
                setActiveTab('franchise');
              }} />
            )}

            {activeTab === 'franchise' && (
              <FranchisePlanner />
            )}
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* AI Store Concierge Chat Widget with RAG */}
      <AIChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <SiteDataProvider>
      <AppContent />
    </SiteDataProvider>
  );
}
