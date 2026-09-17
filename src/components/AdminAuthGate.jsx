import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, User, Eye, EyeOff, AlertTriangle, 
  ArrowLeft, CheckCircle2, Key, Terminal, Server
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import AdminCMS from './AdminCMS';

const SESSION_TOKEN_KEY = 'gspeed_admin_auth_token';
const PERSISTENT_TOKEN_KEY = 'gspeed_admin_auth_persistent_token';
const PERSISTENT_EXPIRES_KEY = 'gspeed_admin_auth_expires';
const FAILED_COUNT_KEY = 'gspeed_admin_failed_count';
const LOCKOUT_TIME_KEY = 'gspeed_admin_lockout_until';
const LAST_ACTIVITY_KEY = 'gspeed_admin_last_activity';

import ErrorBoundary from './ErrorBoundary';

export default function AdminAuthGate({ onExitToPublic = () => {} }) {
  const { siteData, updateSecurityConfig, addAuditLog } = useSiteData();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // 1. Check persistent localStorage if not expired
    const persistentToken = localStorage.getItem(PERSISTENT_TOKEN_KEY);
    const expires = parseInt(localStorage.getItem(PERSISTENT_EXPIRES_KEY) || '0', 10);
    if (persistentToken && expires > Date.now()) {
      return true;
    }
    // 2. Otherwise check sessionStorage
    return Boolean(sessionStorage.getItem(SESSION_TOKEN_KEY));
  });

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('gspeed2026');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return parseInt(sessionStorage.getItem(FAILED_COUNT_KEY) || '0', 10);
  });
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Check lockout on mount
  useEffect(() => {
    const checkLockout = () => {
      const lockoutUntil = parseInt(sessionStorage.getItem(LOCKOUT_TIME_KEY) || '0', 10);
      const now = Date.now();
      if (lockoutUntil > now) {
        setLockoutRemaining(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        setLockoutRemaining(0);
      }
    };

    checkLockout();
    const timer = setInterval(checkLockout, 1000);
    return () => clearInterval(timer);
  }, []);

  // Inactivity Auto-Logout Timer (Default: 30 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    const timeoutMinutes = siteData?.securityConfig?.sessionTimeoutMinutes || 30;
    const timeoutMs = timeoutMinutes * 60 * 1000;
    let lastActive = Date.now();
    localStorage.setItem(LAST_ACTIVITY_KEY, lastActive.toString());

    const updateActivity = () => {
      lastActive = Date.now();
      localStorage.setItem(LAST_ACTIVITY_KEY, lastActive.toString());
    };

    const checkTimeout = () => {
      const storedLast = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || `${lastActive}`, 10);
      if (Date.now() - storedLast > timeoutMs) {
        handleLogout('SESSION_TIMEOUT');
      }
    };

    const timer = setInterval(checkTimeout, 10000); // Check every 10s

    window.addEventListener('mousemove', updateActivity, { passive: true });
    window.addEventListener('keydown', updateActivity, { passive: true });
    window.addEventListener('click', updateActivity, { passive: true });
    window.addEventListener('scroll', updateActivity, { passive: true });

    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [isAuthenticated, siteData?.securityConfig?.sessionTimeoutMinutes]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    const targetUsername = siteData?.securityConfig?.adminUsername || 'admin';
    const targetPassword = siteData?.securityConfig?.adminPassword || 'gspeed2026';

    if (username.trim() === targetUsername && password.trim() === targetPassword) {
      // Successful Auth
      const token = btoa(`gspeed_root_${Date.now()}`);
      
      if (rememberMe) {
        const durationDays = siteData?.securityConfig?.rememberMeDurationDays || 7;
        const expiresAt = Date.now() + (durationDays * 24 * 60 * 60 * 1000);
        localStorage.setItem(PERSISTENT_TOKEN_KEY, token);
        localStorage.setItem(PERSISTENT_EXPIRES_KEY, expiresAt.toString());
        sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      } else {
        sessionStorage.setItem(SESSION_TOKEN_KEY, token);
        localStorage.removeItem(PERSISTENT_TOKEN_KEY);
        localStorage.removeItem(PERSISTENT_EXPIRES_KEY);
      }

      sessionStorage.removeItem(FAILED_COUNT_KEY);
      sessionStorage.removeItem(LOCKOUT_TIME_KEY);
      setErrorMsg('');
      setIsAuthenticated(true);
      
      const now = new Date();
      const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      if (typeof updateSecurityConfig === 'function') {
        updateSecurityConfig({ lastLogin: timeStr });
      }

      if (typeof addAuditLog === 'function') {
        addAuditLog({
          action: 'LOGIN_SUCCESS',
          adminUser: username.trim(),
          status: 'success',
          details: `เข้าสู่ระบบสำเร็จ (${rememberMe ? 'จดจำการเข้าสู่ระบบ 7 วัน' : 'เซสชันชั่วคราว'})`
        });
      }
    } else {
      // Failed Auth
      const newCount = failedAttempts + 1;
      setFailedAttempts(newCount);
      sessionStorage.setItem(FAILED_COUNT_KEY, newCount.toString());

      if (typeof addAuditLog === 'function') {
        addAuditLog({
          action: 'LOGIN_FAILED',
          adminUser: username.trim() || 'Unknown',
          status: 'warning',
          details: `รหัสผ่านไม่ถูกต้อง (พยายามครั้งที่ ${newCount}/5)`
        });
      }

      if (newCount >= 5) {
        // Trigger 30-sec lockout
        const lockoutUntil = Date.now() + 30000;
        sessionStorage.setItem(LOCKOUT_TIME_KEY, lockoutUntil.toString());
        setLockoutRemaining(30);
        setErrorMsg('กรอกผิดเกิน 5 ครั้ง ระบบถูกระงับชั่วคราว 30 วินาทีเพื่อความปลอดภัย');
      } else {
        setErrorMsg(`ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (เหลือโอกาสลองอีก ${5 - newCount} ครั้ง)`);
      }
    }
  };

  const handleLogout = (reason = 'USER_LOGOUT') => {
    try {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
      localStorage.removeItem(PERSISTENT_TOKEN_KEY);
      localStorage.removeItem(PERSISTENT_EXPIRES_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    } catch (e) {
      console.warn('Logout error:', e);
    }

    if (typeof addAuditLog === 'function') {
      addAuditLog({
        action: reason === 'SESSION_TIMEOUT' ? 'SESSION_TIMEOUT' : 'LOGOUT',
        adminUser: username.trim() || 'admin',
        status: reason === 'SESSION_TIMEOUT' ? 'warning' : 'info',
        details: reason === 'SESSION_TIMEOUT' ? 'ตัดสิทธิ์การใช้งานอัตโนมัติเนื่องจากไม่มีการใช้งานเกิน 30 นาที' : 'ออกจากระบบโดยผู้ดูแล'
      });
    }

    setIsAuthenticated(false);
    if (reason === 'SESSION_TIMEOUT') {
      setErrorMsg('เซสชันหมดอายุเนื่องจากไม่มีการใช้งานเกิน 30 นาที กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
    }
    onExitToPublic();
  };

  // If already authenticated, render the full CMS with ErrorBoundary
  if (isAuthenticated) {
    return (
      <ErrorBoundary>
        <AdminCMS onExitAdmin={() => handleLogout('USER_LOGOUT')} />
      </ErrorBoundary>
    );
  }

  return (
    <div className="admin-auth-gate-layout">
      <div className="auth-gate-card glass-panel">
        {/* Top Security Header */}
        <div className="auth-gate-header">
          <div className="auth-brand-badge">
            <Shield size={28} />
          </div>
          <h2 className="auth-gate-title">G-SPEED MASTER ADMIN</h2>
          <p className="auth-gate-subtitle">
            ระบบความปลอดภัยศูนย์ควบคุมส่วนกลาง (Zero-Trust Security Console)
          </p>
        </div>

        {/* Security Alert / Notice */}
        <div className="auth-notice-box" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'rgba(30, 58, 138, 0.25)', 
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '16px',
          fontSize: '0.8rem',
          color: '#93c5fd'
        }}>
          <Lock size={14} style={{ color: '#60a5fa', flexShrink: 0 }} />
          <span>สงวนสิทธิ์เฉพาะผู้บริหารและเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น</span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="auth-error-box" style={{ marginBottom: '16px' }}>
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="auth-gate-form" onSubmit={handleLogin}>
          <div className="auth-field">
            <label htmlFor="admin-auth-user">ชื่อผู้ดูแลระบบ (Username)</label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-input-icon" />
              <input 
                type="text" 
                id="admin-auth-user"
                placeholder="กรอกชื่อผู้ใช้..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={lockoutRemaining > 0}
                autoFocus
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="admin-auth-pass">รหัสผ่านเข้าถึงส่วนกลาง (Master Security Key)</label>
            <div className="auth-input-wrapper">
              <Key size={16} className="auth-input-icon" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="admin-auth-pass"
                placeholder="กรอกรหัสผ่าน..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={lockoutRemaining > 0}
              />
              <button 
                type="button" 
                className="btn-toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Quick Credential Hint */}
          <div style={{
            fontSize: '0.75rem',
            color: '#64748b',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: '6px',
            padding: '6px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>🔑 ข้อมูลเข้าสู่ระบบเริ่มต้น:</span>
            <code style={{ color: '#93c5fd', fontWeight: 600 }}>admin / gspeed2026</code>
          </div>

          {/* Remember Me Option */}
          <div className="auth-remember-row" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.84rem',
            color: '#cbd5e1',
            margin: '10px 0 14px 0',
            userSelect: 'none'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={e => setRememberMe(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <span>จดจำการเข้าสู่ระบบ 7 วัน (Remember Me)</span>
            </label>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>ตัดสิทธิ์อัตโนมัติเมื่อไม่ใช้งาน 30 น.</span>
          </div>

          {/* Lockout countdown timer if locked */}
          {lockoutRemaining > 0 && (
            <div className="lockout-countdown-pill">
              <span>ระงับการเข้าสู่ระบบ: กรุณารอ {lockoutRemaining} วินาที</span>
            </div>
          )}

          <button 
            type="submit" 
            id="btn-admin-submit-login"
            className="btn-auth-submit"
            disabled={lockoutRemaining > 0}
          >
            <Lock size={16} />
            <span>เข้าสู่ระบบจัดการหลังบ้าน</span>
          </button>
        </form>

        {/* Bottom Actions */}
        <div className="auth-gate-footer">
          <button 
            type="button" 
            onClick={onExitToPublic} 
            className="auth-back-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <ArrowLeft size={14} />
            <span>กลับสู่หน้าเว็บไซต์สาธารณะ</span>
          </button>
        </div>

        {/* Subtle Tech Watermark */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.7rem', color: '#475569', letterSpacing: '0.05em' }}>
          <span>GLP ESPORTS SECURITY ARCHITECTURE • VER. 2.4.0</span>
        </div>
      </div>
    </div>
  );
}
