import React, { useState } from 'react';
import { 
  Search, Globe, Tag, Check, Copy, AlertCircle, 
  ExternalLink, Sparkles, Bot, Code2, Save, RefreshCw, 
  ShieldCheck, Eye, EyeOff, FileText, Download, CheckCircle2,
  TrendingUp, Activity, Layers, Sliders, Smartphone
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { extractMetaContent } from '../utils/seoManager';

export default function SeoMarketingCMS() {
  const { siteData, updateSeoMarketingConfig, resetSeoMarketingConfig } = useSiteData();
  
  const seoConfig = siteData?.seoMarketingConfig || {};

  // Form State
  const [formData, setFormData] = useState({
    googleSiteVerification: seoConfig.googleSiteVerification || '',
    bingSiteVerification: seoConfig.bingSiteVerification || '',
    googleTagManagerId: seoConfig.googleTagManagerId || 'GTM-GLPESPORT',
    gtmEnabled: seoConfig.gtmEnabled !== false,
    googleAnalyticsId: seoConfig.googleAnalyticsId || 'G-GSPEED2026',
    gaEnabled: seoConfig.gaEnabled || false,
    facebookPixelId: seoConfig.facebookPixelId || '109283746592817',
    fbPixelEnabled: seoConfig.fbPixelEnabled !== false,
    tiktokPixelId: seoConfig.tiktokPixelId || '',
    tiktokPixelEnabled: seoConfig.tiktokPixelEnabled || false,
    lineTagId: seoConfig.lineTagId || '',
    lineTagEnabled: seoConfig.lineTagEnabled || false,
    aiSeoEnabled: seoConfig.aiSeoEnabled !== false,
    allowAiCrawlers: seoConfig.allowAiCrawlers || {
      gptBot: true,
      claudeBot: true,
      googleExtended: true,
      perplexityBot: true,
      applebot: true
    },
    aiKnowledgeSummary: seoConfig.aiKnowledgeSummary || '',
    customHeadScripts: seoConfig.customHeadScripts || '',
    customBodyScripts: seoConfig.customBodyScripts || '',
    customScriptsEnabled: seoConfig.customScriptsEnabled !== false
  });

  const [toastMessage, setToastMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);
  const [showLlmsPreview, setShowLlmsPreview] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCopyText = (text, key) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    showToast('คัดลอกลงคลิปบอร์ดสำเร็จ ✓');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSave = (e) => {
    e?.preventDefault?.();
    // Auto-clean verification tags
    const cleanedData = {
      ...formData,
      googleSiteVerification: extractMetaContent(formData.googleSiteVerification),
      bingSiteVerification: extractMetaContent(formData.bingSiteVerification)
    };

    updateSeoMarketingConfig(cleanedData);
    setFormData(cleanedData);
    showToast('บันทึกการตั้งค่า SEO, Webmaster & Marketing Tracking เรียบร้อยแล้ว ✓');
  };

  const handleDownloadLlmsTxt = () => {
    const blob = new Blob([formData.aiKnowledgeSummary || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'llms.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('ดาวน์โหลดไฟล์ llms.txt สำเร็จแล้ว 📄');
  };

  return (
    <div className="seo-marketing-cms-panel">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="cms-toast-floating-banner">
          <CheckCircle2 size={16} className="text-emerald" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="seo-header-banner glass-panel">
        <div className="seo-header-content">
          <div className="badge-pill badge-blue" style={{ marginBottom: '8px' }}>
            <Search size={14} />
            <span>SEO & MARKETING TRACKING CONSOLE</span>
          </div>
          <h2 className="seo-header-title">
            เครื่องมือ SEO & ระบบติดตาม Conversion (Google, Bing, GTM, Meta Pixel & AI SEO)
          </h2>
          <p className="seo-header-desc">
            ศูนย์กลางบริหารจัดการ Search Engine Verification, รหัสติดตามโฆษณา Meta / Google Tag Manager, 
            และ Generative Engine Optimization (AI SEO / llms.txt) สำหรับเพิ่มอันดับและการค้นพบในยุค AI Search
          </p>

          {/* Quick Status Chips */}
          <div className="seo-status-chips-row">
            <div className={`seo-status-chip ${formData.googleSiteVerification ? 'active' : ''}`}>
              <span className="dot" />
              <span>Google Search: {formData.googleSiteVerification ? 'พร้อมยืนยัน ✓' : 'ยังไม่ได้เชื่อมต่อ'}</span>
            </div>
            <div className={`seo-status-chip ${formData.bingSiteVerification ? 'active' : ''}`}>
              <span className="dot" />
              <span>Bing Webmaster: {formData.bingSiteVerification ? 'พร้อมยืนยัน ✓' : 'ยังไม่ได้เชื่อมต่อ'}</span>
            </div>
            <div className={`seo-status-chip ${formData.gtmEnabled && formData.googleTagManagerId ? 'active' : ''}`}>
              <span className="dot" />
              <span>GTM: {formData.gtmEnabled ? (formData.googleTagManagerId || 'Active') : 'ปิดใช้งาน'}</span>
            </div>
            <div className={`seo-status-chip ${formData.fbPixelEnabled && formData.facebookPixelId ? 'active' : ''}`}>
              <span className="dot" />
              <span>Meta Pixel: {formData.fbPixelEnabled ? (formData.facebookPixelId ? 'Active ✓' : 'ไม่มี ID') : 'ปิดใช้งาน'}</span>
            </div>
            <div className={`seo-status-chip ${formData.aiSeoEnabled ? 'active' : ''}`}>
              <span className="dot" />
              <span>AI SEO (GEO): {formData.aiSeoEnabled ? 'Active (5 Bots)' : 'ปิดใช้งาน'}</span>
            </div>
          </div>
        </div>

        <div className="seo-header-actions">
          <button 
            type="button" 
            onClick={handleSave}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '0.95rem' }}
          >
            <Save size={16} />
            <span>บันทึกการตั้งค่า SEO</span>
          </button>
        </div>
      </div>

      <div className="seo-cards-grid">
        
        {/* =========================================================================
            CARD 1: SEARCH ENGINE VERIFICATION (Google & Bing)
            ========================================================================= */}
        <div className="seo-card-box glass-panel">
          <div className="seo-card-header">
            <div className="seo-card-icon-box google">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="seo-card-title">1. การยืนยันสิทธิ์ค้นหา (Google & Bing Webmaster)</h3>
              <p className="seo-card-subtitle">ใส่รหัสยืนยันตัวตน HTML Tag สำหรับ Google Search Console และ Bing Webmaster Tools</p>
            </div>
          </div>

          <div className="seo-card-body">
            {/* Google Search Console */}
            <div className="seo-input-group">
              <div className="seo-label-row">
                <label htmlFor="googleSiteVerification" className="seo-field-label">
                  <strong>Google Search Console Verification Token / Tag:</strong>
                </label>
                <a 
                  href="https://search.google.com/search-console" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="seo-ext-link"
                >
                  <span>เปิด Google Search Console</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="seo-input-with-icon">
                <input 
                  id="googleSiteVerification"
                  type="text" 
                  value={formData.googleSiteVerification}
                  onChange={(e) => setFormData(prev => ({ ...prev, googleSiteVerification: e.target.value }))}
                  placeholder="เช่น google-site-verification=AbCdEfGhIjKlMnOpQrStUvWxYz หรือวางทั้งแท็ก <meta ...>"
                  className="seo-text-input"
                />
              </div>
              <small className="seo-hint-text">
                ระบบจะตัดแยกค่าอัตโนมัติ แม้คุณจะวางทั้งแท็ก <code>&lt;meta name="google-site-verification" content="..." /&gt;</code>
              </small>
            </div>

            {/* Bing Webmaster Tools */}
            <div className="seo-input-group" style={{ marginTop: '18px' }}>
              <div className="seo-label-row">
                <label htmlFor="bingSiteVerification" className="seo-field-label">
                  <strong>Bing Webmaster Tools Verification Tag:</strong>
                </label>
                <a 
                  href="https://www.bing.com/webmasters" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="seo-ext-link"
                >
                  <span>เปิด Bing Webmaster Tools</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="seo-input-with-icon">
                <input 
                  id="bingSiteVerification"
                  type="text" 
                  value={formData.bingSiteVerification}
                  onChange={(e) => setFormData(prev => ({ ...prev, bingSiteVerification: e.target.value }))}
                  placeholder="เช่น msvalidate.01=1234567890ABCDEF1234567890ABCDEF"
                  className="seo-text-input"
                />
              </div>
              <small className="seo-hint-text">
                ช่วยให้เว็บไซต์ GLP ติดอันดับการค้นหาบน Bing, Microsoft Edge และ Copilot AI Search
              </small>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 2: TAG MANAGEMENT & WEB ANALYTICS (GTM & GA4)
            ========================================================================= */}
        <div className="seo-card-box glass-panel">
          <div className="seo-card-header">
            <div className="seo-card-icon-box gtm">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="seo-card-title">2. ระบบวิเคราะห์สถิติ & Google Tag Manager (GTM)</h3>
              <p className="seo-card-subtitle">ติดตั้ง GTM Container และ Google Analytics 4 เพื่อตรวจวัด Traffic และพฤติกรรมผู้เข้าชม</p>
            </div>
          </div>

          <div className="seo-card-body">
            {/* GTM */}
            <div className="seo-toggle-field-box">
              <div className="seo-toggle-top">
                <div>
                  <strong style={{ fontSize: '0.96rem', color: '#0f172a' }}>Google Tag Manager (GTM)</strong>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                    บริหารแท็กการตลาดได้แบบ All-in-One โดยไม่ต้องแก้โค้ดหน้าเว็บ
                  </p>
                </div>
                <label className="switch-toggle-label">
                  <input 
                    type="checkbox"
                    checked={formData.gtmEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, gtmEnabled: e.target.checked }))}
                  />
                  <span className="switch-slider round" />
                </label>
              </div>

              {formData.gtmEnabled && (
                <div style={{ marginTop: '12px' }}>
                  <label htmlFor="googleTagManagerId" className="seo-field-label">GTM Container ID:</label>
                  <input 
                    id="googleTagManagerId"
                    type="text" 
                    value={formData.googleTagManagerId}
                    onChange={(e) => setFormData(prev => ({ ...prev, googleTagManagerId: e.target.value.trim().toUpperCase() }))}
                    placeholder="เช่น GTM-XXXXXXX"
                    className="seo-text-input"
                  />
                </div>
              )}
            </div>

            {/* GA4 */}
            <div className="seo-toggle-field-box" style={{ marginTop: '16px' }}>
              <div className="seo-toggle-top">
                <div>
                  <strong style={{ fontSize: '0.96rem', color: '#0f172a' }}>Google Analytics 4 (GA4)</strong>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                    วัดสถิติผู้เข้าชมแบบ Real-time, Conversion การสมัครแข่งเกม และยอดวิวหน้า 3D Planner
                  </p>
                </div>
                <label className="switch-toggle-label">
                  <input 
                    type="checkbox"
                    checked={formData.gaEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, gaEnabled: e.target.checked }))}
                  />
                  <span className="switch-slider round" />
                </label>
              </div>

              {formData.gaEnabled && (
                <div style={{ marginTop: '12px' }}>
                  <label htmlFor="googleAnalyticsId" className="seo-field-label">GA4 Measurement ID:</label>
                  <input 
                    id="googleAnalyticsId"
                    type="text" 
                    value={formData.googleAnalyticsId}
                    onChange={(e) => setFormData(prev => ({ ...prev, googleAnalyticsId: e.target.value.trim().toUpperCase() }))}
                    placeholder="เช่น G-XXXXXXXXXX"
                    className="seo-text-input"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 3: SOCIAL ADVERTISING PIXELS (Meta, TikTok, LINE)
            ========================================================================= */}
        <div className="seo-card-box glass-panel">
          <div className="seo-card-header">
            <div className="seo-card-icon-box meta">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="seo-card-title">3. พิกเซลยิงแอด & Conversion Tracking (Meta, TikTok, LINE)</h3>
              <p className="seo-card-subtitle">ติดตั้ง Pixel ID สำหรับยิงแอดหาลูกค้าจัดแข่งเกม, ปาร์ตี้วันเกิด และแฟรนไชส์</p>
            </div>
          </div>

          <div className="seo-card-body">
            {/* Meta (Facebook) Pixel */}
            <div className="seo-toggle-field-box">
              <div className="seo-toggle-top">
                <div>
                  <strong style={{ fontSize: '0.96rem', color: '#0f172a' }}>Meta / Facebook Pixel</strong>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                    ยิง Event: PageView, ViewContent, Contact, Lead, CompleteRegistration
                  </p>
                </div>
                <label className="switch-toggle-label">
                  <input 
                    type="checkbox"
                    checked={formData.fbPixelEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, fbPixelEnabled: e.target.checked }))}
                  />
                  <span className="switch-slider round" />
                </label>
              </div>

              {formData.fbPixelEnabled && (
                <div style={{ marginTop: '12px' }}>
                  <label htmlFor="facebookPixelId" className="seo-field-label">Meta Pixel ID (15-16 หลัก):</label>
                  <input 
                    id="facebookPixelId"
                    type="text" 
                    value={formData.facebookPixelId}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebookPixelId: e.target.value.trim() }))}
                    placeholder="เช่น 109283746592817"
                    className="seo-text-input"
                  />
                </div>
              )}
            </div>

            {/* TikTok & LINE Tags */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '16px' }}>
              {/* TikTok */}
              <div className="seo-toggle-field-box">
                <div className="seo-toggle-top">
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>TikTok Pixel</strong>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>แคมเปญวิดีโอสั้นและอีสปอร์ต</p>
                  </div>
                  <label className="switch-toggle-label">
                    <input 
                      type="checkbox"
                      checked={formData.tiktokPixelEnabled}
                      onChange={(e) => setFormData(prev => ({ ...prev, tiktokPixelEnabled: e.target.checked }))}
                    />
                    <span className="switch-slider round" />
                  </label>
                </div>
                {formData.tiktokPixelEnabled && (
                  <input 
                    type="text" 
                    value={formData.tiktokPixelId}
                    onChange={(e) => setFormData(prev => ({ ...prev, tiktokPixelId: e.target.value.trim() }))}
                    placeholder="TikTok Pixel ID"
                    className="seo-text-input"
                    style={{ marginTop: '10px' }}
                  />
                )}
              </div>

              {/* LINE Tag */}
              <div className="seo-toggle-field-box">
                <div className="seo-toggle-top">
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>LINE Tag ID</strong>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>LINE Ads Platform (LAP)</p>
                  </div>
                  <label className="switch-toggle-label">
                    <input 
                      type="checkbox"
                      checked={formData.lineTagEnabled}
                      onChange={(e) => setFormData(prev => ({ ...prev, lineTagEnabled: e.target.checked }))}
                    />
                    <span className="switch-slider round" />
                  </label>
                </div>
                {formData.lineTagEnabled && (
                  <input 
                    type="text" 
                    value={formData.lineTagId}
                    onChange={(e) => setFormData(prev => ({ ...prev, lineTagId: e.target.value.trim() }))}
                    placeholder="LINE Tag Base ID"
                    className="seo-text-input"
                    style={{ marginTop: '10px' }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 4: AI SEO & GENERATIVE ENGINE OPTIMIZATION (GEO & llms.txt)
            ========================================================================= */}
        <div className="seo-card-box glass-panel">
          <div className="seo-card-header">
            <div className="seo-card-icon-box ai">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="seo-card-title">4. AI SEO & Generative Engine Optimization (GEO / llms.txt)</h3>
              <p className="seo-card-subtitle">
                ช่วยให้ AI Engine (ChatGPT, Claude, Perplexity, Google SGE) สรุปข้อมูลร้านเกมได้อย่างแม่นยำ 100%
              </p>
            </div>
          </div>

          <div className="seo-card-body">
            {/* Master Toggle */}
            <div className="seo-toggle-field-box">
              <div className="seo-toggle-top">
                <div>
                  <strong style={{ fontSize: '0.96rem', color: '#0f172a' }}>เปิดใช้งาน AI SEO Directives</strong>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                    อนุญาตให้ AI Search Bot เข้าอ่านโครงสร้างข้อมูลร้านเกม และอัปเดต Meta Snippets สูงสุด
                  </p>
                </div>
                <label className="switch-toggle-label">
                  <input 
                    type="checkbox"
                    checked={formData.aiSeoEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, aiSeoEnabled: e.target.checked }))}
                  />
                  <span className="switch-slider round" />
                </label>
              </div>

              {formData.aiSeoEnabled && (
                <div style={{ marginTop: '14px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}>
                    เลือก AI Bot ที่อนุญาตให้รวบรวมข้อมูล:
                  </span>
                  <div className="ai-bots-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginTop: '8px' }}>
                    {[
                      { key: 'gptBot', label: 'GPTBot (OpenAI / ChatGPT)', desc: 'ChatGPT Web Search' },
                      { key: 'claudeBot', label: 'ClaudeBot (Anthropic)', desc: 'Claude Search' },
                      { key: 'googleExtended', label: 'Google-Extended', desc: 'Gemini & AI Overviews' },
                      { key: 'perplexityBot', label: 'PerplexityBot', desc: 'Perplexity AI Search' },
                      { key: 'applebot', label: 'Applebot', desc: 'Apple Intelligence / Siri' }
                    ].map(bot => (
                      <label key={bot.key} className="ai-bot-checkbox-card">
                        <input 
                          type="checkbox" 
                          checked={Boolean(formData.allowAiCrawlers[bot.key])}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            allowAiCrawlers: {
                              ...prev.allowAiCrawlers,
                              [bot.key]: e.target.checked
                            }
                          }))}
                        />
                        <div>
                          <strong>{bot.label}</strong>
                          <span>{bot.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* llms.txt Profile */}
            <div style={{ marginTop: '18px' }}>
              <div className="seo-label-row">
                <label htmlFor="aiKnowledgeSummary" className="seo-field-label">
                  <strong>ข้อมูลธุรกิจและบริการฉบับย่อสำหรับ AI (llms.txt Specification):</strong>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowLlmsPreview(!showLlmsPreview)}
                    className="btn-outline-sm"
                  >
                    <Eye size={13} />
                    <span>{showLlmsPreview ? 'ซ่อนพรีวิว' : 'พรีวิว llms.txt'}</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleCopyText(formData.aiKnowledgeSummary, 'llms')}
                    className="btn-outline-sm"
                  >
                    {copiedKey === 'llms' ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                    <span>{copiedKey === 'llms' ? 'คัดลอกแล้ว' : 'คัดลอก llms.txt'}</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={handleDownloadLlmsTxt}
                    className="btn-outline-sm"
                  >
                    <Download size={13} />
                    <span>ดาวน์โหลดไฟล์</span>
                  </button>
                </div>
              </div>

              {showLlmsPreview ? (
                <div className="llms-preview-box">
                  <pre>{formData.aiKnowledgeSummary}</pre>
                </div>
              ) : (
                <textarea 
                  id="aiKnowledgeSummary"
                  rows={8}
                  value={formData.aiKnowledgeSummary}
                  onChange={(e) => setFormData(prev => ({ ...prev, aiKnowledgeSummary: e.target.value }))}
                  className="seo-textarea-code"
                  placeholder="ใส่ข้อมูลสรุปร้านเกม สเปกเครื่อง ราคา การเดินทาง และช่องทางติดต่อสำหรับ AI..."
                />
              )}
              <small className="seo-hint-text">
                ข้อมูลนี้จะถูกส่งให้ AI เมื่อมีการสอบถามเกี่ยวกับ "ร้านเกมรามคำแหง", "จัดแข่งอีสปอร์ต", หรือ "สเปกคอม G-Speed"
              </small>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 5: CUSTOM SCRIPTS INJECTION (HEAD & BODY)
            ========================================================================= */}
        <div className="seo-card-box glass-panel">
          <div className="seo-card-header">
            <div className="seo-card-icon-box scripts">
              <Code2 size={20} />
            </div>
            <div>
              <h3 className="seo-card-title">5. สคริปต์ขั้นสูง & JSON-LD Schema Markup</h3>
              <p className="seo-card-subtitle">ติดตั้ง Structured Data Schema.org หรือโค้ดสคริปต์พิเศษลงใน &lt;head&gt; และ &lt;body&gt;</p>
            </div>
          </div>

          <div className="seo-card-body">
            <div className="seo-toggle-field-box">
              <div className="seo-toggle-top">
                <div>
                  <strong style={{ fontSize: '0.96rem', color: '#0f172a' }}>เปิดใช้งาน Custom Scripts Injection</strong>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                    แทรกสคริปต์ลงในหน้าเว็บจริงโดยอัตโนมัติ
                  </p>
                </div>
                <label className="switch-toggle-label">
                  <input 
                    type="checkbox"
                    checked={formData.customScriptsEnabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, customScriptsEnabled: e.target.checked }))}
                  />
                  <span className="switch-slider round" />
                </label>
              </div>

              {formData.customScriptsEnabled && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label htmlFor="customHeadScripts" className="seo-field-label">
                      <strong>สคริปต์ใน &lt;head&gt; (เช่น Schema.org JSON-LD):</strong>
                    </label>
                    <textarea 
                      id="customHeadScripts"
                      rows={6}
                      value={formData.customHeadScripts}
                      onChange={(e) => setFormData(prev => ({ ...prev, customHeadScripts: e.target.value }))}
                      className="seo-textarea-code monospace"
                      placeholder="<!-- วางแท็ก <script> หรือ Schema Markup ที่นี่ -->"
                    />
                  </div>

                  <div>
                    <label htmlFor="customBodyScripts" className="seo-field-label">
                      <strong>สคริปต์ใน &lt;body&gt; (เช่น Live Chat Widget ภายนอก):</strong>
                    </label>
                    <textarea 
                      id="customBodyScripts"
                      rows={4}
                      value={formData.customBodyScripts}
                      onChange={(e) => setFormData(prev => ({ ...prev, customBodyScripts: e.target.value }))}
                      className="seo-textarea-code monospace"
                      placeholder="<!-- วางสคริปต์ที่ต้องการโหลดก่อนปิดแท็ก </body> -->"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Floating Bottom Sticky Save Bar */}
      <div className="seo-bottom-sticky-bar glass-panel">
        <div className="sticky-bar-left">
          <CheckCircle2 size={16} className="text-emerald" />
          <span>การเปลี่ยนแปลงจะถูกบันทึกลงในระบบ CMS และนำไปใช้กับหน้าเว็บทันที</span>
        </div>
        <div className="sticky-bar-right">
          <button 
            type="button" 
            onClick={resetSeoMarketingConfig}
            className="btn-outline-sm"
          >
            <RefreshCw size={13} />
            <span>คืนค่าเริ่มต้น SEO</span>
          </button>
          <button 
            type="button" 
            onClick={handleSave}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={15} />
            <span>บันทึกการตั้งค่าทั้งหมด</span>
          </button>
        </div>
      </div>
    </div>
  );
}
