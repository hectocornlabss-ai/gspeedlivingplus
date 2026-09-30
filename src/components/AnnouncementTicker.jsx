import React, { useMemo } from 'react';
import { Sparkles, ArrowRight, Flame, Bell, ExternalLink } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export default function AnnouncementTicker({ onNavigate = () => {} }) {
  const { siteData } = useSiteData();

  const settings = siteData?.tickerSettings || {
    enabled: true,
    speed: 28,
    pauseOnHover: true,
    showLeadBadge: true,
    leadBadgeText: 'GLP LIVE',
    bgColor: '#1e3a8a',
    textColor: '#ffffff',
    badgeBgColor: '#ffffff',
    badgeTextColor: '#1d4ed8'
  };

  // Extract active announcement items
  const activeItems = useMemo(() => {
    if (Array.isArray(siteData?.tickerItems) && siteData.tickerItems.length > 0) {
      const filtered = siteData.tickerItems.filter(it => it.active !== false);
      if (filtered.length > 0) return filtered;
    }
    // Fallback to legacy single ticker if no items exist or all disabled
    if (siteData?.tickerText) {
      return [{
        id: 'tick-fallback',
        badge: siteData?.tickerBadge || 'ประกาศสำคัญ',
        text: siteData?.tickerText,
        linkTarget: siteData?.tickerLinkTarget || siteData?.tickerLinkTab || '',
        linkText: siteData?.tickerLinkText || 'ดูรายละเอียด',
        active: true
      }];
    }
    return [];
  }, [siteData?.tickerItems, siteData?.tickerText, siteData?.tickerBadge, siteData?.tickerLinkTarget, siteData?.tickerLinkTab, siteData?.tickerLinkText]);

  // If ticker is disabled in settings or there are no active items, do not render
  if (settings.enabled === false || activeItems.length === 0) {
    return null;
  }

  // Handle click on ticker item or action button
  const handleItemClick = (e, item) => {
    if (!item.linkTarget) return;
    e.preventDefault();
    e.stopPropagation();

    const target = item.linkTarget.trim();
    if (target.startsWith('http://') || target.startsWith('https://')) {
      window.open(target, '_blank', 'noopener,noreferrer');
      return;
    }

    if (target.startsWith('#')) {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If not on home page, navigate home first
        onNavigate('/');
        setTimeout(() => {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
      return;
    }

    // Normal internal navigation (clean URLs or tabs)
    if (target === 'franchise' || target === '/franchise') {
      onNavigate('/franchise');
    } else if (target === 'tournaments' || target === '/tournaments') {
      onNavigate('/tournaments');
    } else if (target === 'activities' || target === '/activities') {
      onNavigate('/activities');
    } else if (target === 'company' || target === '/company') {
      onNavigate('/company');
    } else if (target === 'arena' || target === '/') {
      onNavigate('/');
    } else {
      onNavigate(target.startsWith('/') ? target : `/${target}`);
    }
  };

  // Calculate animation duration based on speed setting
  const scrollDuration = `${Math.max(12, Number(settings.speed) || 28)}s`;

  const barStyle = {
    backgroundColor: settings.bgColor || '#1e3a8a',
    color: settings.textColor || '#ffffff'
  };

  return (
    <aside 
      className={`top-announcement-bar marquee-enabled ${settings.pauseOnHover ? 'pause-on-hover' : ''}`}
      style={barStyle}
      aria-label="ประกาศและข่าวด่วน G-Speed Living Plus"
    >
      <div className="ticker-inner-wrapper">
        {/* Left Fixed Lead Badge */}
        {settings.showLeadBadge !== false && (
          <div className="ticker-lead-anchor">
            <div 
              className="ticker-live-pill"
              style={{
                backgroundColor: settings.leadBadgeBgColor || 'rgba(0, 0, 0, 0.4)',
                color: settings.leadBadgeTextColor || '#ffffff',
                borderColor: settings.leadBadgeBorderColor || 'rgba(255, 255, 255, 0.25)'
              }}
            >
              <span 
                className="live-pulsing-dot" 
                style={{
                  backgroundColor: settings.leadBadgeDotColor || '#10b981',
                  boxShadow: `0 0 8px ${settings.leadBadgeDotColor || '#10b981'}`
                }}
              />
              <strong>{settings.leadBadgeText || 'GLP LIVE'}</strong>
            </div>
          </div>
        )}

        {/* Marquee Content Track (Smooth Right to Left Scrolling) */}
        <div className="ticker-marquee-viewport">
          <div 
            className="ticker-marquee-track"
            style={{ animationDuration: scrollDuration }}
          >
            {/* First Set of Items */}
            {activeItems.map((item, idx) => (
              <div 
                key={`item-1-${item.id || idx}`} 
                className={`ticker-scroll-item ${item.linkTarget ? 'is-clickable' : ''}`}
                onClick={(e) => handleItemClick(e, item)}
                title={item.linkTarget ? `คลิกเพื่อเปิด: ${item.linkText || item.linkTarget}` : item.text}
              >
                {item.badge && (
                  <span 
                    className="ticker-item-badge"
                    style={{
                      backgroundColor: settings.badgeBgColor || '#ffffff',
                      color: settings.badgeTextColor || '#1d4ed8'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                
                <span className="ticker-item-text">
                  {item.text}
                </span>

                {item.linkTarget && (
                  <span className="ticker-item-action-btn">
                    <span>{item.linkText || 'ดูรายละเอียด'}</span>
                    {item.linkTarget.startsWith('http') ? <ExternalLink size={12} /> : <ArrowRight size={12} />}
                  </span>
                )}

                <span className="ticker-item-separator">
                  <Sparkles size={13} />
                </span>
              </div>
            ))}

            {/* Duplicate Set for Seamless Continuous Infinite Scrolling */}
            {activeItems.map((item, idx) => (
              <div 
                key={`item-2-${item.id || idx}`} 
                className={`ticker-scroll-item ${item.linkTarget ? 'is-clickable' : ''}`}
                onClick={(e) => handleItemClick(e, item)}
                title={item.linkTarget ? `คลิกเพื่อเปิด: ${item.linkText || item.linkTarget}` : item.text}
                aria-hidden="true"
              >
                {item.badge && (
                  <span 
                    className="ticker-item-badge"
                    style={{
                      backgroundColor: settings.badgeBgColor || '#ffffff',
                      color: settings.badgeTextColor || '#1d4ed8'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                
                <span className="ticker-item-text">
                  {item.text}
                </span>

                {item.linkTarget && (
                  <span className="ticker-item-action-btn">
                    <span>{item.linkText || 'ดูรายละเอียด'}</span>
                    {item.linkTarget.startsWith('http') ? <ExternalLink size={12} /> : <ArrowRight size={12} />}
                  </span>
                )}

                <span className="ticker-item-separator">
                  <Sparkles size={13} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
