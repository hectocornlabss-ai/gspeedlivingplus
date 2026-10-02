import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Share2, Copy, Check, X, Smartphone
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

/**
 * SocialSharePopover
 * High-performance, portal-rendered sharing bottom sheet (mobile) and anchored popover (desktop).
 * Renders directly into document.body to prevent any parent sticky / backdrop-filter clipping.
 */
export default function SocialSharePopover({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'G-Speed Living Plus',
  subtitle = '',
  contentType = 'auto', // 'tournament' | 'activity' | 'auto'
  isOpen,
  onClose,
  triggerRef
}) {
  const { language } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth <= 768 : false));
  const [desktopCoords, setDesktopCoords] = useState({ top: 0, left: 0, width: 340 });

  const popoverRef = useRef(null);

  // Client-side mount check for portals
  useEffect(() => {
    setMounted(true);
  }, []);

  // Responsive breakpoint tracking
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute anchored position for desktop
  useLayoutEffect(() => {
    if (!isOpen || isMobile || typeof window === 'undefined') return;

    const updatePosition = () => {
      if (!triggerRef?.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 340;
      const popoverHeight = popoverRef.current ? popoverRef.current.offsetHeight : 380;
      const padding = 12;

      // Align right edge of popover with right edge of trigger, or clamp to viewport
      let left = rect.right - popoverWidth;
      if (left < padding) left = padding;
      if (left + popoverWidth > window.innerWidth - padding) {
        left = window.innerWidth - popoverWidth - padding;
      }

      // Check vertical placement: default below, flip above if tight below
      let top = rect.bottom + 8;
      if (top + popoverHeight > window.innerHeight - padding) {
        const flippedTop = rect.top - popoverHeight - 8;
        if (flippedTop >= padding) {
          top = flippedTop;
        }
      }

      setDesktopCoords({
        top: Math.round(top),
        left: Math.round(left),
        width: popoverWidth
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, isMobile, triggerRef]);

  // Lock mobile body scroll when bottom sheet is open
  useEffect(() => {
    if (!isOpen || !isMobile || typeof document === 'undefined') return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isMobile]);

  // Click outside to close (desktop & backdrop)
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target) &&
        triggerRef?.current &&
        !triggerRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  // Esc key listener
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  // I18n text resolution
  const isTournament = contentType === 'tournament' || 
    (contentType === 'auto' && (
      (typeof url === 'string' && url.includes('tournament')) ||
      (typeof title === 'string' && (title.includes('Tournament') || title.includes('ทัวร์นาเมนต์') || title.includes('Championship') || title.includes('VALORANT') || title.includes('ROV') || title.includes('PUBG') || title.includes('Free Fire')))
    ));

  const modalTitle = isTournament
    ? (language === 'zh' ? '分享赛事' : language === 'en' ? 'Share Tournament' : 'แชร์ทัวร์นาเมนต์')
    : (language === 'zh' ? '分享活动' : language === 'en' ? 'Share Activity' : 'แชร์กิจกรรม');

  const modalSubtitle = language === 'zh' 
    ? '转发给好友或分享到社交平台' 
    : language === 'en' 
      ? 'Share with friends or to social media' 
      : 'ส่งต่อให้เพื่อนหรือแชร์ลงโซเชียลมีเดีย';

  const copyLabel = language === 'zh' ? '复制链接' : language === 'en' ? 'Copy link' : 'คัดลอกลิงก์';
  const copiedLabel = language === 'zh' ? '已复制 ✓' : language === 'en' ? 'Copied ✓' : 'คัดลอกแล้ว ✓';
  const nativeShareLabel = language === 'zh' ? '系统原生分享 / 其他应用' : language === 'en' ? 'Share via Device / Other Apps' : 'เปิดแชร์ผ่านระบบโทรศัพท์ / แอปอื่น ๆ';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopied(true);
    showToast(language === 'zh' ? '链接已成功复制！✓' : language === 'en' ? 'Link copied to clipboard! ✓' : 'คัดลอกลิงก์สำเร็จแล้ว พร้อมส่งต่อได้ทันที ✓');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer,width=620,height=580');
  };

  const shareToLine = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' | G-Speed Living Plus')}`;
    window.open(lineUrl, '_blank', 'noopener,noreferrer,width=620,height=580');
  };

  const shareToMessenger = () => {
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobileDevice) {
      window.location.href = `fb-messenger://share?link=${encodeURIComponent(url)}`;
    } else {
      const msgUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(url)}`;
      window.open(msgUrl, '_blank', 'noopener,noreferrer,width=620,height=580');
    }
  };

  const shareToInstagram = () => {
    handleCopyLink();
    showToast(language === 'zh' ? '链接已复制！正在打开 Instagram... 📸' : language === 'en' ? 'Link copied! Opening Instagram... 📸' : 'คัดลอกลิงก์แล้ว! เปิด Instagram เพื่อแชร์ใน Story หรือ DM 📸');
    setTimeout(() => {
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    }, 600);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: subtitle ? `${title} - ${subtitle}` : title,
          url
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const content = (
    <div className="social-share-portal-container">
      {/* Full Viewport Backdrop */}
      <div 
        className="social-share-backdrop" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Popover / Mobile Bottom Sheet Card */}
      <div 
        ref={popoverRef} 
        className={`social-share-popover-box ${isMobile ? 'is-mobile-bottom-sheet' : 'is-desktop-popover'}`}
        style={!isMobile && desktopCoords.top > 0 ? {
          position: 'fixed',
          top: `${desktopCoords.top}px`,
          left: `${desktopCoords.left}px`,
          width: `${desktopCoords.width}px`
        } : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={modalTitle}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div className="sheet-drag-handle-bar" onClick={onClose} title="แตะเพื่อปิด">
            <div className="sheet-drag-handle" />
          </div>
        )}

        {/* Header */}
        <div className="share-popover-header">
          <div className="share-header-left">
            <div className="share-icon-badge">
              <Share2 size={16} className="text-blue" />
            </div>
            <div>
              <h4 className="share-title">{modalTitle}</h4>
              <p className="share-subtitle">{modalSubtitle}</p>
            </div>
          </div>
          <button 
            type="button"
            className="btn-share-close"
            onClick={onClose}
            aria-label="ปิดหน้าต่างแชร์"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="share-toast-banner">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Social Channels Grid */}
        <div className="share-channels-grid">
          {/* Facebook */}
          <button 
            type="button"
            onClick={shareToFacebook}
            className="share-channel-btn share-btn-fb"
            title="แชร์ลง Facebook"
          >
            <div className="channel-icon-circle fb-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <span className="channel-label">Facebook</span>
          </button>

          {/* LINE */}
          <button 
            type="button"
            onClick={shareToLine}
            className="share-channel-btn share-btn-line"
            title="แชร์เข้า LINE"
          >
            <div className="channel-icon-circle line-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.066.51.251l2.454 3.327V8.108c0-.345.282-.63.63-.63.345 0 .626.285.626.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
            </div>
            <span className="channel-label">LINE</span>
          </button>

          {/* Messenger */}
          <button 
            type="button"
            onClick={shareToMessenger}
            className="share-channel-btn share-btn-messenger"
            title="แชร์ผ่าน Messenger"
          >
            <div className="channel-icon-circle messenger-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.079.298 2.222.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.259 5.889-3.259-6.56 6.963z"/>
              </svg>
            </div>
            <span className="channel-label">Messenger</span>
          </button>

          {/* Instagram */}
          <button 
            type="button"
            onClick={shareToInstagram}
            className="share-channel-btn share-btn-ig"
            title="แชร์ไปยัง Instagram"
          >
            <div className="channel-icon-circle ig-circle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <span className="channel-label">Instagram</span>
          </button>
        </div>

        {/* Copy Link Section */}
        <div className="share-link-box">
          <div className="share-url-preview" title={url}>
            {url}
          </div>
          <button 
            type="button" 
            onClick={handleCopyLink}
            className={`btn-share-copy ${copied ? 'copied' : ''}`}
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-500" />
                <span>{copiedLabel}</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>{copyLabel}</span>
              </>
            )}
          </button>
        </div>

        {/* Native Mobile Share Button (if supported) */}
        {typeof navigator !== 'undefined' && Boolean(navigator.share) && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="btn-share-native-mobile"
          >
            <Smartphone size={14} />
            <span>{nativeShareLabel}</span>
          </button>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
