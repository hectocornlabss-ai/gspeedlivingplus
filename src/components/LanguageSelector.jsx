import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

// High-definition Vector Flag Icons (Prevents Windows emoji fallback rendering text like "TH TH")
export function FlagTH({ size = 20 }) {
  const height = Math.round(size * 0.68);
  return (
    <svg 
      width={size} 
      height={height} 
      viewBox="0 0 30 20" 
      style={{ 
        borderRadius: '3px', 
        boxShadow: '0 0 0 1px rgba(0,0,0,0.15)', 
        flexShrink: 0, 
        display: 'inline-block', 
        verticalAlign: 'middle',
        overflow: 'hidden'
      }}
      aria-label="ธงชาติไทย"
    >
      <rect width="30" height="20" fill="#A51931" />
      <rect y="3.33" width="30" height="13.34" fill="#FFFFFF" />
      <rect y="6.67" width="30" height="6.66" fill="#2D2A4A" />
    </svg>
  );
}

export function FlagEN({ size = 20 }) {
  const height = Math.round(size * 0.68);
  return (
    <svg 
      width={size} 
      height={height} 
      viewBox="0 0 60 30" 
      style={{ 
        borderRadius: '3px', 
        boxShadow: '0 0 0 1px rgba(0,0,0,0.15)', 
        flexShrink: 0, 
        display: 'inline-block', 
        verticalAlign: 'middle',
        overflow: 'hidden'
      }}
      aria-label="Flag of the United Kingdom"
    >
      <clipPath id="uk-flag-clip-path">
        <rect width="60" height="30" />
      </clipPath>
      <g clipPath="url(#uk-flag-clip-path)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0 0 L60 30 M60 0 L0 30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="2" />
        <path d="M30 0 V30 M0 15 H60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

export function FlagZH({ size = 20 }) {
  const height = Math.round(size * 0.68);
  return (
    <svg 
      width={size} 
      height={height} 
      viewBox="0 0 30 20" 
      style={{ 
        borderRadius: '3px', 
        boxShadow: '0 0 0 1px rgba(0,0,0,0.15)', 
        flexShrink: 0, 
        display: 'inline-block', 
        verticalAlign: 'middle',
        overflow: 'hidden'
      }}
      aria-label="中华人民共和国国旗"
    >
      <rect width="30" height="20" fill="#DE2910" />
      <polygon points="5,2 5.9,4.8 8.9,4.8 6.4,6.5 7.4,9.3 5,7.6 2.6,9.3 3.6,6.5 1.1,4.8 4.1,4.8" fill="#FFDE00" />
      <polygon points="10,1 10.3,1.9 11.3,1.9 10.5,2.5 10.8,3.4 10,2.8 9.2,3.4 9.5,2.5 8.7,1.9 9.7,1.9" fill="#FFDE00" transform="rotate(23 10 2)" />
      <polygon points="12,3 12.3,3.9 13.3,3.9 12.5,4.5 12.8,5.4 12,4.8 11.2,5.4 11.5,4.5 10.7,3.9 11.7,3.9" fill="#FFDE00" transform="rotate(45 12 4)" />
      <polygon points="12,6 12.3,6.9 13.3,6.9 12.5,7.5 12.8,8.4 12,7.8 11.2,8.4 11.5,7.5 10.7,6.9 11.7,6.9" fill="#FFDE00" transform="rotate(70 12 7)" />
      <polygon points="10,8 10.3,8.9 11.3,8.9 10.5,9.5 10.8,10.4 10,9.8 9.2,10.4 9.5,9.5 8.7,8.9 9.7,8.9" fill="#FFDE00" transform="rotate(20 10 9)" />
    </svg>
  );
}

export function FlagIcon({ code, size = 20 }) {
  const c = (code || '').toLowerCase();
  if (c === 'th') return <FlagTH size={size} />;
  if (c === 'en' || c === 'gb') return <FlagEN size={size} />;
  if (c === 'zh' || c === 'cn') return <FlagZH size={size} />;
  return null;
}

export default function LanguageSelector({ variant = 'navbar', className = '' }) {
  const { language, setLanguage, supportedLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Segmented Pill Variant (e.g. For Mobile Drawer)
  if (variant === 'segmented') {
    return (
      <div className={`lang-segmented-control ${className}`} style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#f1f5f9',
        padding: '3px',
        borderRadius: '999px',
        border: '1px solid #e2e8f0',
        gap: '2px'
      }}>
        {supportedLanguages.map(l => {
          const isActive = l.code === language;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                border: 'none',
                background: isActive ? '#1d4ed8' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              title={l.label}
            >
              <FlagIcon code={l.code} size={18} />
              <span>{l.short}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Navbar Dropdown Pill Variant
  return (
    <div 
      className={`lang-selector-dropdown-wrapper ${className}`} 
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button
        type="button"
        id="btn-language-selector"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          color: '#0f172a',
          fontSize: '0.82rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'all 0.15s ease'
        }}
        aria-label="Select Language"
        title="เปลี่ยนภาษา / Select Language / 切换语言"
      >
        <FlagIcon code={currentLang.code} size={20} />
        <span style={{ letterSpacing: '0.04em', fontWeight: 800 }}>{currentLang.short}</span>
        <ChevronDown size={14} style={{ opacity: 0.6, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
      </button>

      {isOpen && (
        <div 
          className="lang-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
            padding: '6px',
            minWidth: '150px',
            zIndex: 1000,
            animation: 'fadeIn 0.15s ease'
          }}
        >
          {supportedLanguages.map(l => {
            const isSelected = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isSelected ? '#eff6ff' : 'transparent',
                  color: isSelected ? '#1d4ed8' : '#1e293b',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <FlagIcon code={l.code} size={20} />
                  <span>{l.label}</span>
                </div>
                {isSelected && <Check size={14} color="#1d4ed8" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
