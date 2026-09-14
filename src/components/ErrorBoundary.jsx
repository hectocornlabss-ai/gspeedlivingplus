import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert, Wrench } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleResetStorage = () => {
    try {
      localStorage.removeItem('gspeed_site_cms_data_v2');
      localStorage.removeItem('gspeed_site_cms_data');
      sessionStorage.removeItem('gspeed_admin_auth_token');
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
    window.location.href = window.location.pathname === '/admin' ? '/admin' : '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 60%, #020617 100%)',
          padding: '24px',
          boxSizing: 'border-box',
          fontFamily: "'Kanit', sans-serif",
          color: '#f8fafc'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.92)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(239, 68, 68, 0.15)',
            borderRadius: '20px',
            padding: '36px 32px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#ef4444',
              marginBottom: '20px'
            }}>
              <ShieldAlert size={34} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', color: '#ffffff' }}>
              ระบบตรวจพบข้อผิดพลาดในการแสดงผล
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
              อาจเกิดจากข้อมูลที่บันทึกไว้ในเบราว์เซอร์ไม่ตรงกับเวอร์ชันปัจจุบันของระบบ (Schema Mismatch) หรือเกิดข้อผิดพลาดในการประมวลผลชั่วคราว
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '14px 16px',
              textAlign: 'left',
              marginBottom: '24px',
              fontSize: '0.8rem',
              color: '#f87171',
              fontFamily: 'monospace',
              maxHeight: '120px',
              overflowY: 'auto',
              wordBreak: 'break-all'
            }}>
              <strong>Error:</strong> {this.state.error?.toString() || 'Unknown Error'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={this.handleResetStorage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(29, 78, 216, 0.35)'
                }}
              >
                <Wrench size={16} />
                <span>ซ่อมแซมและคืนค่าเริ่มต้น (Auto-Repair & Reset Storage)</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={this.handleReload}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '11px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#f1f5f9',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={15} />
                  <span>ลองโหลดใหม่อีกครั้ง</span>
                </button>

                <button
                  onClick={this.handleGoHome}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '11px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#f1f5f9',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    cursor: 'pointer'
                  }}
                >
                  <Home size={15} />
                  <span>กลับหน้าหลัก</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
