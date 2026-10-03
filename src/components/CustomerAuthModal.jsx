import React, { useState } from 'react';
import { 
  X, Shield, Phone, Mail, CheckCircle2, 
  ArrowRight, Sparkles, User, Lock
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function CustomerAuthModal() {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    loginWithGoogle, 
    loginWithPhone,
    loginRedirectOrderNo 
  } = useCustomerAuth();

  const [authTab, setAuthTab] = useState('google'); // 'google' | 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [isSimulatingGoogle, setIsSimulatingGoogle] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleGoogleSignIn = (selectedEmail = null, selectedName = null) => {
    setIsSimulatingGoogle(true);
    setTimeout(() => {
      setIsSimulatingGoogle(false);
      const email = selectedEmail || customGoogleEmail.trim() || 'customer.glp@gmail.com';
      const name = selectedName || (email.split('@')[0]) || 'สมาชิก GLP';
      loginWithGoogle({
        id: `usr-google-${Date.now()}`,
        name: name,
        email: email,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        provider: 'google',
        phone: '081-999-8888',
        createdAt: new Date().toISOString()
      });
    }, 600);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      alert('กรุณากรอกเบอร์โทรศัพท์');
      return;
    }
    loginWithPhone(phoneNumber, userName);
  };

  return (
    <div 
      className="store-modal-backdrop" 
      onClick={closeLoginModal}
      style={{ zIndex: 100010 }}
    >
      <div 
        className="store-modal-container" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '440px', borderRadius: '20px' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#eff6ff',
              color: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                เข้าสู่ระบบสมาชิก GLP
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {loginRedirectOrderNo 
                  ? `เพื่อดูสถานะคำสั่งซื้อ #${loginRedirectOrderNo}` 
                  : 'เพื่อบันทึกประวัติออเดอร์และใบเสร็จ'}
              </span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={closeLoginModal}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {/* Privacy Note */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '0.8rem',
            color: '#475569',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            lineHeight: 1.45
          }}>
            <Lock size={16} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>ความเป็นส่วนตัวสูงสุด:</strong> รายละเอียดคำสั่งซื้อ ที่อยู่จัดส่ง และใบเสร็จรับเงิน จะแสดงให้เห็นเฉพาะเจ้าของบัญชีเท่านั้น
            </span>
          </div>

          {/* Login Tabs */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => setAuthTab('google')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: authTab === 'google' ? '#ffffff' : 'transparent',
                color: authTab === 'google' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: authTab === 'google' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Google G SVG */}
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google Login</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthTab('phone')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: authTab === 'phone' ? '#ffffff' : 'transparent',
                color: authTab === 'phone' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: authTab === 'phone' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Phone size={15} />
              <span>เบอร์โทรศัพท์</span>
            </button>
          </div>

          {/* TAB 1: GOOGLE LOGIN */}
          {authTab === 'google' && (
            <div>
              <button
                type="button"
                onClick={() => handleGoogleSignIn('weerayut.glp@gmail.com', 'Weerayut Th.')}
                disabled={isSimulatingGoogle}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  background: '#ffffff',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease',
                  marginBottom: '14px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>{isSimulatingGoogle ? 'กำลังเชื่อมต่อ Google...' : 'เข้าสู่ระบบด้วยบัญชี Google'}</span>
              </button>

              <div style={{
                position: 'relative',
                textAlign: 'center',
                margin: '16px 0',
                color: '#94a3b8',
                fontSize: '0.78rem'
              }}>
                <span style={{ background: '#ffffff', padding: '0 10px', position: 'relative', zIndex: 1 }}>หรือระบุอีเมล Google ของคุณ</span>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#e2e8f0' }} />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="email"
                  placeholder="เช่น your.email@gmail.com"
                  value={customGoogleEmail}
                  onChange={e => setCustomGoogleEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem'
                  }}
                />
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => handleGoogleSignIn(customGoogleEmail)}
                  disabled={!customGoogleEmail.trim() || isSimulatingGoogle}
                  style={{ padding: '9px 16px', fontSize: '0.85rem' }}
                >
                  เข้าสู่ระบบ
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PHONE LOGIN */}
          {authTab === 'phone' && (
            <form onSubmit={handlePhoneSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#0f172a' }}>
                  เบอร์โทรศัพท์มือถือ *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="เช่น 089-123-4567"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#0f172a' }}>
                  ชื่อของคุณ (ทางเลือก)
                </label>
                <input
                  type="text"
                  placeholder="ชื่อ-นามสกุล หรือชื่อเรียก"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>ยืนยันเข้าสู่ระบบสมาชิก</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
