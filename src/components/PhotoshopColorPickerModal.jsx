import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Check, RotateCcw, Palette, Copy } from 'lucide-react';

// Color conversion utilities
export function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  let c = String(hex).replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  if (c.length !== 6) return { r: 0, g: 0, b: 0 };
  const num = parseInt(c, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(Number(v) || 0)));
  const toHex = (v) => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsb(r, g, b) {
  const rNorm = Math.max(0, Math.min(255, Number(r) || 0)) / 255;
  const gNorm = Math.max(0, Math.min(255, Number(g) || 0)) / 255;
  const bNorm = Math.max(0, Math.min(255, Number(b) || 0)) / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const v = Math.round(max * 100);

  return { h, s, b: v };
}

export function hsbToRgb(h, s, b) {
  const hNorm = ((Number(h) || 0) % 360 + 360) % 360;
  const sNorm = Math.max(0, Math.min(100, Number(s) || 0)) / 100;
  const bNorm = Math.max(0, Math.min(100, Number(b) || 0)) / 100;

  const k = (n) => (n + hNorm / 60) % 6;
  const f = (n) => bNorm * (1 - sNorm * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return {
    r: Math.round(255 * f(5)),
    g: Math.round(255 * f(3)),
    b: Math.round(255 * f(1))
  };
}

// Preset Swatches matching Photoshop & Modern Web standards
const DEFAULT_SWATCHES = [
  '#000000', '#1e293b', '#475569', '#94a3b8', '#ffffff',
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#1d4ed8', '#0f172a', '#6366f1', '#ec4899'
];

export default function PhotoshopColorPickerModal({
  isOpen,
  onClose,
  initialColor = '#ffffff',
  onSelectColor,
  title = 'Color Picker (ระบบจานสี)'
}) {
  const [hsb, setHsb] = useState({ h: 0, s: 0, b: 100 });
  const [rgb, setRgb] = useState({ r: 255, g: 255, b: 255 });
  const [hexInput, setHexInput] = useState('ffffff');
  const [originalColor, setOriginalColor] = useState('#ffffff');
  const [copied, setCopied] = useState(false);

  const satValBoxRef = useRef(null);
  const hueSliderRef = useRef(null);
  const isDraggingSatVal = useRef(false);
  const isDraggingHue = useRef(false);

  // Initialize from initialColor when opened
  useEffect(() => {
    if (isOpen) {
      const cleanHex = initialColor.startsWith('#') ? initialColor : `#${initialColor}`;
      setOriginalColor(cleanHex);
      const parsedRgb = hexToRgb(cleanHex);
      const parsedHsb = rgbToHsb(parsedRgb.r, parsedRgb.g, parsedRgb.b);
      setHsb(parsedHsb);
      setRgb(parsedRgb);
      setHexInput(cleanHex.replace('#', ''));
    }
  }, [isOpen, initialColor]);

  // Update from HSB changes
  const updateFromHsb = useCallback((newHsb) => {
    setHsb(newHsb);
    const newRgb = hsbToRgb(newHsb.h, newHsb.s, newHsb.b);
    setRgb(newRgb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHexInput(hex.replace('#', ''));
  }, []);

  // Update from RGB changes
  const updateFromRgb = useCallback((newRgb) => {
    setRgb(newRgb);
    const newHsb = rgbToHsb(newRgb.r, newRgb.g, newRgb.b);
    setHsb(newHsb);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHexInput(hex.replace('#', ''));
  }, []);

  // Update from Hex changes
  const updateFromHex = useCallback((hexStr) => {
    setHexInput(hexStr);
    const clean = hexStr.replace('#', '').trim();
    if (clean.length === 3 || clean.length === 6) {
      const newRgb = hexToRgb(clean);
      setRgb(newRgb);
      const newHsb = rgbToHsb(newRgb.r, newRgb.g, newRgb.b);
      setHsb(newHsb);
    }
  }, []);

  // Saturation/Value Drag handlers
  const handleSatValMove = useCallback((e) => {
    if (!satValBoxRef.current) return;
    const rect = satValBoxRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;

    let x = (clientX - rect.left) / rect.width;
    let y = (clientY - rect.top) / rect.height;

    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));

    const s = Math.round(x * 100);
    const b = Math.round((1 - y) * 100);

    setHsb(prev => {
      const updated = { ...prev, s, b };
      const newRgb = hsbToRgb(updated.h, updated.s, updated.b);
      setRgb(newRgb);
      setHexInput(rgbToHex(newRgb.r, newRgb.g, newRgb.b).replace('#', ''));
      return updated;
    });
  }, []);

  // Hue Slider Drag handlers
  const handleHueMove = useCallback((e) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;

    let y = (clientY - rect.top) / rect.height;
    y = Math.max(0, Math.min(1, y));

    const h = Math.round(y * 360) % 360;

    setHsb(prev => {
      const updated = { ...prev, h };
      const newRgb = hsbToRgb(updated.h, updated.s, updated.b);
      setRgb(newRgb);
      setHexInput(rgbToHex(newRgb.r, newRgb.g, newRgb.b).replace('#', ''));
      return updated;
    });
  }, []);

  // Global mouse / touch listeners for smooth continuous dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingSatVal.current) {
        e.preventDefault();
        handleSatValMove(e);
      } else if (isDraggingHue.current) {
        e.preventDefault();
        handleHueMove(e);
      }
    };

    const handleMouseUp = () => {
      isDraggingSatVal.current = false;
      isDraggingHue.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleSatValMove, handleHueMove]);

  if (!isOpen) return null;

  const currentColorHex = rgbToHex(rgb.r, rgb.g, rgb.b);

  const handleConfirm = () => {
    if (onSelectColor) {
      onSelectColor(currentColorHex);
    }
    onClose();
  };

  const handleCopyHex = () => {
    navigator.clipboard?.writeText(currentColorHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="ps-color-picker-backdrop" onClick={onClose}>
      <div 
        className="ps-color-picker-dialog" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '520px',
          maxWidth: '95vw',
          background: '#242426',
          borderRadius: '12px',
          border: '1px solid #3e3e42',
          boxShadow: '0 25px 60px rgba(0,0,0,0.65)',
          color: '#e4e4e7',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          overflow: 'hidden',
          zIndex: 99999
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: '#1c1c1e',
          borderBottom: '1px solid #333336'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem', color: '#f4f4f5' }}>
            <Palette size={16} className="text-blue" style={{ color: '#38bdf8' }} />
            <span>{title}</span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="ปิดหน้าต่าง"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px', display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
          
          {/* LEFT: 2D Sat/Val Box & Hue Slider Bar */}
          <div style={{ display: 'flex', gap: '14px', flex: '1 1 280px', height: '240px' }}>
            
            {/* 2D Saturation-Brightness Plane */}
            <div
              ref={satValBoxRef}
              onMouseDown={(e) => {
                isDraggingSatVal.current = true;
                handleSatValMove(e);
              }}
              onTouchStart={(e) => {
                isDraggingSatVal.current = true;
                handleSatValMove(e);
              }}
              style={{
                flex: 1,
                height: '100%',
                position: 'relative',
                borderRadius: '6px',
                cursor: 'crosshair',
                overflow: 'hidden',
                backgroundColor: `hsl(${hsb.h}, 100%, 50%)`,
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.35)'
              }}
            >
              {/* White Gradient (horizontal) */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0) 100%)'
              }} />

              {/* Black Gradient (vertical) */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, #000000 0%, rgba(0,0,0,0) 100%)'
              }} />

              {/* Target Marker Pin */}
              <div style={{
                position: 'absolute',
                left: `${hsb.s}%`,
                top: `${100 - hsb.b}%`,
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: '2px solid #ffffff',
                boxShadow: '0 0 3px rgba(0,0,0,0.8), inset 0 0 2px rgba(0,0,0,0.8)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }} />
            </div>

            {/* Vertical Rainbow Hue Slider */}
            <div
              ref={hueSliderRef}
              onMouseDown={(e) => {
                isDraggingHue.current = true;
                handleHueMove(e);
              }}
              onTouchStart={(e) => {
                isDraggingHue.current = true;
                handleHueMove(e);
              }}
              style={{
                width: '28px',
                height: '100%',
                position: 'relative',
                borderRadius: '6px',
                cursor: 'pointer',
                background: 'linear-gradient(to bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.35)'
              }}
            >
              {/* Hue Thumb Indicator */}
              <div style={{
                position: 'absolute',
                top: `${(hsb.h / 360) * 100}%`,
                left: '-3px',
                right: '-3px',
                height: '6px',
                background: '#ffffff',
                border: '1px solid #000000',
                borderRadius: '2px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }} />
            </div>

          </div>

          {/* RIGHT: Preview & Numeric Code Inputs */}
          <div style={{ width: '160px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            
            {/* Preview Box: New vs Original */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 600 }}>ตัวอย่างสี:</div>
              <div style={{
                height: '52px',
                borderRadius: '6px',
                overflow: 'hidden',
                display: 'flex',
                border: '1px solid #444',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
              }}>
                {/* New Color (top/left) */}
                <div 
                  style={{ flex: 1, backgroundColor: currentColorHex }} 
                  title={`สีใหม่: ${currentColorHex}`}
                />
                {/* Original Color (bottom/right) */}
                <div 
                  style={{ flex: 1, backgroundColor: originalColor, borderLeft: '1px solid rgba(255,255,255,0.1)' }} 
                  title={`สีเดิม: ${originalColor}`}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#71717a' }}>
                <span>ใหม่ (New)</span>
                <span>เดิม (Old)</span>
              </div>
            </div>

            {/* Action Buttons: OK / Cancel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(37,99,235,0.4)'
                }}
              >
                <Check size={14} />
                <span>ตกลง (OK)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: '#333336',
                  color: '#d4d4d8',
                  border: '1px solid #444',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                ยกเลิก (Cancel)
              </button>
            </div>

            {/* HSB Numeric Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '4px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: '#a1a1aa', display: 'block' }}>H (°)</label>
                <input
                  type="number"
                  min="0" max="360"
                  value={hsb.h}
                  onChange={(e) => updateFromHsb({ ...hsb, h: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '3px 4px', fontSize: '0.78rem', background: '#1c1c1e', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', textAlign: 'center' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: '#a1a1aa', display: 'block' }}>S (%)</label>
                <input
                  type="number"
                  min="0" max="100"
                  value={hsb.s}
                  onChange={(e) => updateFromHsb({ ...hsb, s: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '3px 4px', fontSize: '0.78rem', background: '#1c1c1e', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', textAlign: 'center' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: '#a1a1aa', display: 'block' }}>B (%)</label>
                <input
                  type="number"
                  min="0" max="100"
                  value={hsb.b}
                  onChange={(e) => updateFromHsb({ ...hsb, b: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '3px 4px', fontSize: '0.78rem', background: '#1c1c1e', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', textAlign: 'center' }}
                />
              </div>
            </div>

            {/* RGB Numeric Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: '#a1a1aa', display: 'block' }}>R</label>
                <input
                  type="number"
                  min="0" max="255"
                  value={rgb.r}
                  onChange={(e) => updateFromRgb({ ...rgb, r: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '3px 4px', fontSize: '0.78rem', background: '#1c1c1e', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', textAlign: 'center' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: '#a1a1aa', display: 'block' }}>G</label>
                <input
                  type="number"
                  min="0" max="255"
                  value={rgb.g}
                  onChange={(e) => updateFromRgb({ ...rgb, g: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '3px 4px', fontSize: '0.78rem', background: '#1c1c1e', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', textAlign: 'center' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: '#a1a1aa', display: 'block' }}>B</label>
                <input
                  type="number"
                  min="0" max="255"
                  value={rgb.b}
                  onChange={(e) => updateFromRgb({ ...rgb, b: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '3px 4px', fontSize: '0.78rem', background: '#1c1c1e', border: '1px solid #3f3f46', color: '#fff', borderRadius: '4px', textAlign: 'center' }}
                />
              </div>
            </div>

            {/* HEX Input Field */}
            <div>
              <label style={{ fontSize: '0.68rem', color: '#a1a1aa', display: 'block', marginBottom: '2px' }}>
                รหัสโค้ดสี HEX (#):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#1c1c1e', border: '1px solid #3f3f46', borderRadius: '4px', padding: '2px 6px' }}>
                <span style={{ color: '#71717a', fontSize: '0.8rem', fontWeight: 600 }}>#</span>
                <input
                  type="text"
                  maxLength={6}
                  value={hexInput}
                  onChange={(e) => updateFromHex(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontFamily: 'monospace',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    padding: '2px 4px'
                  }}
                  placeholder="000000"
                />
                <button
                  type="button"
                  onClick={handleCopyHex}
                  style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', padding: '2px' }}
                  title="คัดลอกโค้ดสี HEX"
                >
                  {copied ? <Check size={12} color="#22c55e" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM: Quick Swatch Palette Chips */}
        <div style={{
          padding: '10px 18px',
          background: '#1c1c1e',
          borderTop: '1px solid #333336',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 600 }}>สียอดนิยม:</span>
          {DEFAULT_SWATCHES.map((swatch, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => updateFromHex(swatch)}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '3px',
                backgroundColor: swatch,
                border: swatch.toLowerCase() === currentColorHex.toLowerCase() ? '2px solid #38bdf8' : '1px solid #555',
                cursor: 'pointer',
                padding: 0,
                transform: swatch.toLowerCase() === currentColorHex.toLowerCase() ? 'scale(1.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
              title={swatch}
            />
          ))}

          <button
            type="button"
            onClick={() => updateFromHex(originalColor)}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.7rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="รีเซ็ตเป็นสีเดิมก่อนเปิดหน้าต่าง"
          >
            <RotateCcw size={12} />
            <span>ย้อนกลับสีเดิม</span>
          </button>
        </div>

      </div>
    </div>
  );
}
