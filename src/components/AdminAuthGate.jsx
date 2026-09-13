import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, User, Eye, EyeOff, AlertTriangle, 
  ArrowLeft, CheckCircle2, Key, Terminal, Server
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import AdminCMS from './AdminCMS';

const SESSION_TOKEN_KEY = 'gspeed_admin_auth_token';
const FAILED_COUNT_KEY = 'gspeed_admin_failed_count';
const LOCKOUT_TIME_KEY = 'gspeed_admin_lockout_until';

export default function AdminAuthGate({ onExitToPublic = () => {} }) {
  const { siteData, updateSecurityConfig } = useSiteData();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(sessionStorage.getItem(SESSION_TOKEN_KEY));
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    const targetUsername = siteData.securityConfig?.adminUsername || 'admin';
    const targetPassword = siteData.securityConfig?.adminPassword || 'gspeed2026';

    if (username.trim() === targetUsername && password.trim() === targetPassword) {
      // Successful Auth
      const token = btoa(`gspeed_root_${Date.now()}`);
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      sessionStorage.removeItem(FAILED_COUNT_KEY);
      sessionStorage.removeItem(LOCKOUT_TIME_KEY);
      setErrorMsg('');
      setIsAuthenticated(true);
      
      const now = new Date();
      const timeStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      updateSecurityConfig({ lastLogin: timeStr });
    } else {
      // Failed Auth
      const newCount = failedAttempts + 1;
      setFailedAttempts(newCount);
      sessionStorage.setItem(FAILED_COUNT_KEY, newCount.toString());

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

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    setIsAuthenticated(false);
    onExitToPublic();
  };

  // If already authenticated, render the full CMS
  if (isAuthenticated) {
    return <AdminCMS onExitAdmin={handleLogout} />;
  }

  return (
    <div className="admin-auth-gate-layout">
      {/* Background Cyber Glow */}
      <div className="auth-gate-glow"></div>

      <div className="auth-gate-card glass-panel">
        {/* Top Security Header */}
        <div className="auth-gate-header">
          <div className="auth-shield-badge">
            <Shield size={28} className="text-blue" />
          </div>
          <div className="auth-security-status">
            <span className="live-dot-green"></span>
            <span>RESTRICTED ACCESS • TLS 1.3 ENCRYPTED</span>
          </div>
          <h2 className="auth-title">G-SPEED MASTER ADMIN</h2>
          <p className="auth-subtitle">
            ระบบความปลอดภัยศูนย์ควบคุมส่วนกลาง (Zero-Trust Security Console)
          </p>
        </div>

        {/* Security Alert / Notice */}
        <div className="auth-notice-box">
          <Lock size={14} className="text-blue" />
          <span>สงวนสิทธิ์เฉพาะผู้บริหารและเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น</span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="auth-error-box">
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>
              <User size={14} className="text-blue" />
              <span>ชื่อผู้ดูแลระบบ (Username)</span>
            </label>
            <div className="auth-input-wrapper">
              <input 
                type="text" 
                id="admin-auth-user"
                className="form-input auth-input"
                placeholder="กรอกชื่อผู้ใช้..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={lockoutRemaining > 0}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <Key size={14} className="text-blue" />
              <span>รหัสผ่านเข้าถึงส่วนกลาง (Master Security Key)</span>
            </label>
            <div className="auth-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="admin-auth-pass"
                className="form-input auth-input"
                placeholder="กรอกรหัสผ่าน..."
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={lockoutRemaining > 0}
              />
              <button 
                type="button" 
                className="btn-toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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
            className="btn-primary auth-submit-btn full-width"
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
            className="btn-auth-back-link"
          >
            <ArrowLeft size={14} />
            <span>กลับสู่หน้าเว็บไซต์สาธารณะ</span>
          </button>
        </div>

        {/* Subtle Tech Watermark */}
        <div className="auth-tech-spec">
          <span>GLP ESPORTS SECURITY ARCHITECTURE • VER. 2.4.0</span>
        </div>
      </div>
    </div>
  );
}
