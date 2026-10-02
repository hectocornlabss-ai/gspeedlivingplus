import React, { useState, useEffect } from 'react';
import { 
  X, Monitor, Shield, Trophy, Coffee, Check, Clock, Calendar, 
  User, Phone, Mail, Sparkles, AlertCircle, Download, Printer, 
  QrCode, ChevronRight, ChevronLeft, ArrowRight, CheckCircle2, 
  CreditCard, Flame, Award, Gamepad2, Info, Copy
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { ARENA_SEATING_ZONES } from '../data/mockData';

export default function ArenaSeatBookingModal({ 
  isOpen, 
  onClose, 
  initialZoneId = 'stage' 
}) {
  const { siteData, createArenaBooking } = useSiteData();
  const { t, language } = useTranslation();
  const seatingZones = siteData?.arenaSeatingZones || ARENA_SEATING_ZONES;

  // Step state: 1: Seats & Zone, 2: Time & Duration, 3: Details & Food, 4: Confirmed Ticket
  const [step, setStep] = useState(1);
  const [activeZoneId, setActiveZoneId] = useState(initialZoneId);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  
  // Date & Time slot state
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('14:00 - 18:00');
  const [durationPackage, setDurationPackage] = useState('4'); // '2', '4', '6', 'night'
  
  // Customer & F&B state
  const [isMember, setIsMember] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerDiscord, setCustomerDiscord] = useState('');
  const [selectedFoodPackage, setSelectedFoodPackage] = useState('none');
  const [bookingNotes, setBookingNotes] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Completed Booking Record
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const currentZone = seatingZones.find(z => z.id === activeZoneId) || seatingZones[0];

  // Toggle seat selection
  const handleSeatClick = (seat) => {
    if (seat.status === 'occupied') return;
    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seat.id));
    } else {
      setSelectedSeatIds(prev => [...prev, seat.id]);
    }
  };

  // Pricing calculations
  const ratePerHour = isMember ? (currentZone.memberPricePerHour || 30) : (currentZone.pricePerHour || 40);
  let durationHours = parseInt(durationPackage) || 4;
  let isNightOwl = durationPackage === 'night';
  
  let seatCostPerStation = 0;
  if (isNightOwl) {
    seatCostPerStation = 150; // Night owl flat rate 23:00 - 08:00
    durationHours = 9;
  } else {
    seatCostPerStation = ratePerHour * durationHours;
  }

  const foodPackages = {
    none: { 
      name: t('seatBookingModal.foodNone') || 'ไม่รับอาหารและเครื่องดื่ม (0 บาท)', 
      price: 0 
    },
    energy: { 
      name: t('seatBookingModal.foodEnergy') || 'Energy Boost Combo (Red Bull + ข้าวไข่ข้นแฮม)', 
      price: 89 
    },
    feast: { 
      name: t('seatBookingModal.foodFeast') || 'Gamer Feast Combo (ชานมพ่นไฟ + ข้าวผัดกะเพรา + เฟรนช์ฟรายส์)', 
      price: 149 
    },
    coffee: { 
      name: t('seatBookingModal.foodCoffee') || 'Specialty Coffee Combo (กาแฟคั่วสดเย็น + ครัวซองต์)', 
      price: 65 
    }
  };

  const foodCost = foodPackages[selectedFoodPackage]?.price || 0;
  const seatsCount = Math.max(1, selectedSeatIds.length);
  const totalSeatPrice = seatCostPerStation * (selectedSeatIds.length > 0 ? selectedSeatIds.length : 1);
  const grandTotal = totalSeatPrice + (foodCost * seatsCount);

  // Submit Booking
  const handleCompleteBooking = (e) => {
    e.preventDefault();
    if (selectedSeatIds.length === 0) {
      alert(language === 'th' ? 'กรุณาเลือกที่นั่งอย่างน้อย 1 ที่นั่ง' : language === 'zh' ? '请至少选择 1 个机位' : 'Please select at least 1 seat');
      setStep(1);
      return;
    }
    if (!customerName || !customerPhone) {
      alert(language === 'th' ? 'กรุณากรอกชื่อและเบอร์โทรศัพท์ติดต่อ' : language === 'zh' ? '请填写姓名和联系电话' : 'Please enter your name and phone number');
      return;
    }

    const bookingPayload = {
      customerName,
      phone: customerPhone,
      email: customerEmail,
      discord: customerDiscord,
      memberId: isMember ? memberId : '',
      zoneId: currentZone.id,
      zoneName: currentZone.name,
      seatNumbers: selectedSeatIds,
      date: selectedDate,
      timeSlot: isNightOwl ? '23:00 - 08:00 (Night Owl)' : selectedTimeSlot,
      durationHours,
      hardwareTier: currentZone.specs,
      foodPackage: foodPackages[selectedFoodPackage].name,
      foodPackagePrice: foodCost,
      baseRatePerHour: ratePerHour,
      seatTotal: totalSeatPrice,
      totalPrice: grandTotal,
      notes: bookingNotes
    };

    let created = null;
    if (createArenaBooking) {
      created = createArenaBooking(bookingPayload);
    } else {
      created = {
        ...bookingPayload,
        id: `BKG-${Date.now()}`,
        bookingCode: `GLP-SEAT-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      };
    }

    setConfirmedBooking(created);
    setStep(4);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{ zIndex: 100250, padding: '16px' }}
    >
      <div 
        className="modal-dialog" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '850px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Top Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          padding: '20px 24px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ 
                background: 'rgba(37, 99, 235, 0.4)', 
                color: '#93c5fd', 
                padding: '2px 8px', 
                borderRadius: '12px', 
                fontSize: '0.72rem', 
                fontWeight: 700, 
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                GLP ARENA LIVE SEATING
              </span>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>• Ramkhamhaeng 53</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
              {t('seatBookingModal.title') || 'ระบบจองที่นั่งอารีน่า & เช็กสถานะเครื่องสด'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label={t('nav.close') || 'ปิด'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Progress Tabs */}
        {step < 4 && (
          <div style={{
            display: 'flex',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '8px 16px',
            gap: '8px',
            overflowX: 'auto',
            flexShrink: 0
          }}>
            {[
              { num: 1, label: t('seatBookingModal.step1') || '1. โซน & ที่นั่ง' },
              { num: 2, label: t('seatBookingModal.step2') || '2. วันและเวลา' },
              { num: 3, label: t('seatBookingModal.step3') || '3. ผู้จอง & เมนู' }
            ].map(s => (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: step === s.num ? 700 : 500,
                  background: step === s.num ? '#2563eb' : 'transparent',
                  color: step === s.num ? '#ffffff' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* STEP 1: ZONE & SEAT SELECTION */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Zone Selector Pills */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  {t('seatBookingModal.selectZone') || 'เลือกโซนที่ต้องการ'}:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  {seatingZones.map(zone => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => {
                        setActiveZoneId(zone.id);
                        setSelectedSeatIds([]);
                      }}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: activeZoneId === zone.id ? zone.color || '#2563eb' : '#e2e8f0',
                        background: activeZoneId === zone.id ? 'rgba(37, 99, 235, 0.06)' : '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                          {zone.name}
                        </span>
                        <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', background: zone.color || '#2563eb', color: '#fff', fontWeight: 700 }}>
                          {zone.badge || 'Zone'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        ฿{zone.pricePerHour}/{language === 'th' ? 'ชม.' : language === 'zh' ? '小时' : 'hr'} ({language === 'th' ? 'สมาชิก' : language === 'zh' ? '会员' : 'Member'} ฿{zone.memberPricePerHour})
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone Hardware Specs Banner */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Monitor size={22} color="#2563eb" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>
                    {t('seatBookingModal.hardwareSpecs') || 'สเปกฮาร์ดแวร์ประจำโซน'} ({currentZone.name})
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 500 }}>
                    {currentZone.specs}
                  </div>
                </div>
              </div>

              {/* Seat Map Legend */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.78rem', color: '#64748b', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(30, 41, 59, 0.8)', border: '1px solid #334155' }} />
                  <span>{t('seatBookingModal.available') || 'ที่นั่งว่าง'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444' }} />
                  <span style={{ color: '#ef4444' }}>{t('seatBookingModal.occupied') || 'มีผู้ใช้งาน'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#2563eb', border: '1px solid #60a5fa' }} />
                  <span style={{ color: '#1d4ed8', fontWeight: 700 }}>{t('seatBookingModal.selected') || 'ที่คุณเลือก'}</span>
                </div>
              </div>

              {/* Interactive Floor Plan Grid */}
              <div style={{
                background: '#090e1a',
                padding: '24px',
                borderRadius: '14px',
                border: '1px solid #1e293b',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
              }}>
                <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.75rem', marginBottom: '16px', letterSpacing: '0.05em' }}>
                  {t('seatBookingModal.stageFront') || '─── เวที / ด้านหน้าสนามแข่ง ARENA MAIN STAGE DISPLAY ───'}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
                  gap: '12px'
                }}>
                  {(currentZone.seats || []).map(seat => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isOccupied = seat.status === 'occupied';

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        onClick={() => handleSeatClick(seat)}
                        disabled={isOccupied}
                        style={{
                          aspectRatio: '1 / 1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                          border: isSelected 
                            ? '2px solid #60a5fa' 
                            : isOccupied 
                              ? '1px solid #7f1d1d' 
                              : '1px solid #334155',
                          background: isSelected 
                            ? '#2563eb' 
                            : isOccupied 
                              ? 'rgba(239, 68, 68, 0.12)' 
                              : 'rgba(30, 41, 59, 0.8)',
                          color: isSelected 
                            ? '#ffffff' 
                            : isOccupied 
                              ? '#ef4444' 
                              : '#cbd5e1',
                          cursor: isOccupied ? 'not-allowed' : 'pointer',
                          position: 'relative',
                          transition: 'all 0.15s ease',
                          transform: isSelected ? 'scale(1.05)' : 'none',
                          boxShadow: isSelected ? '0 0 14px rgba(37, 99, 235, 0.6)' : 'none'
                        }}
                      >
                        <span style={{ fontSize: '0.88rem', fontWeight: 800 }}>{seat.name}</span>
                        <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>
                          {isOccupied ? (language === 'th' ? 'ไม่ว่าง' : language === 'zh' ? '占用' : 'Occupied') : (language === 'th' ? 'ว่าง' : language === 'zh' ? '空闲' : 'Free')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Next Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {t('seatBookingModal.selectedSeatsCount') || 'ที่นั่งที่เลือก:'}{' '}
                  </span>
                  <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                    {selectedSeatIds.length > 0 ? selectedSeatIds.join(', ') : (language === 'th' ? 'ยังไม่ได้เลือก' : language === 'zh' ? '尚未选择' : 'None')}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedSeatIds.length === 0) {
                      alert(language === 'th' ? 'กรุณาเลือกที่นั่งอย่างน้อย 1 ที่นั่งเพื่อดำเนินการต่อ' : language === 'zh' ? '请至少选择 1 个机位以继续' : 'Please select at least 1 seat to continue');
                      return;
                    }
                    setStep(2);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: selectedSeatIds.length > 0 ? '#2563eb' : '#94a3b8',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: selectedSeatIds.length > 0 ? 'pointer' : 'not-allowed',
                    boxShadow: selectedSeatIds.length > 0 ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none'
                  }}
                >
                  <span>{t('seatBookingModal.btnNext') || 'ถัดไป'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & DURATION */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {/* Date Picker */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    {t('seatBookingModal.dateLabel') || 'วันที่ต้องการใช้บริการ:'}
                  </label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setSelectedDate(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                  />
                </div>

                {/* Duration Packages */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    {t('seatBookingModal.durationLabel') || 'แพ็กเกจระยะเวลาชั่วโมง:'}
                  </label>
                  <select
                    className="form-input"
                    value={durationPackage}
                    onChange={e => setDurationPackage(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                  >
                    <option value="2">{t('seatBookingModal.package2hr') || '2 ชั่วโมง (ชิวๆ สบายๆ)'} • ฿{ratePerHour * 2}</option>
                    <option value="4">{t('seatBookingModal.package4hr') || '4 ชั่วโมง (ยอดนิยม - กำลังดี)'} • ฿{ratePerHour * 4}</option>
                    <option value="6">{t('seatBookingModal.package6hr') || '6 ชั่วโมง (สายลุย แบกแรงค์)'} • ฿{ratePerHour * 6}</option>
                    <option value="night">🌙 {t('seatBookingModal.packageNight') || 'Night Owl เหมาคืน 23:00 - 08:00 (150 บาท)'}</option>
                  </select>
                </div>
              </div>

              {/* Time Slots Selector (if not night owl) */}
              {durationPackage !== 'night' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    {t('seatBookingModal.timeSlotLabel') || 'ช่วงเวลาที่เริ่มใช้บริการ:'}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {[
                      '10:00 - 14:00',
                      '12:00 - 16:00',
                      '14:00 - 18:00',
                      '16:00 - 20:00',
                      '18:00 - 22:00',
                      '20:00 - 24:00'
                    ].map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: selectedTimeSlot === slot ? '#2563eb' : '#cbd5e1',
                          background: selectedTimeSlot === slot ? '#eff6ff' : '#ffffff',
                          color: selectedTimeSlot === slot ? '#1d4ed8' : '#334155',
                          fontWeight: selectedTimeSlot === slot ? 700 : 500,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Summary Box */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>{language === 'th' ? 'โซนที่เลือก:' : language === 'zh' ? '所选区域:' : 'Selected Zone:'}</span>
                  <strong style={{ color: '#0f172a' }}>{currentZone.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>{t('seatBookingModal.selectedSeatsCount') || 'ที่นั่งที่เลือก:'} ({selectedSeatIds.length})</span>
                  <strong style={{ color: '#0f172a' }}>{selectedSeatIds.join(', ')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>{language === 'th' ? 'รวมค่าชั่วโมงเล่น:' : language === 'zh' ? '机位费用小计:' : 'Seat Subtotal:'}</span>
                  <strong style={{ color: '#1d4ed8', fontSize: '1.05rem' }}>฿{totalSeatPrice.toLocaleString()}</strong>
                </div>
              </div>

              {/* Stepper buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  <ChevronLeft size={16} /> {t('seatBookingModal.btnBack') || 'ย้อนกลับ'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 22px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {t('seatBookingModal.btnNext') || 'ถัดไป'} <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOMER DETAILS & FOOD ADD-ONS */}
          {step === 3 && (
            <form onSubmit={handleCompleteBooking} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Member Discount Toggle */}
              <div style={{
                background: isMember ? '#eff6ff' : '#f8fafc',
                border: isMember ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                padding: '14px 16px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award size={22} color={isMember ? '#2563eb' : '#64748b'} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      {t('seatBookingModal.memberCheck') || 'สิทธิ์สมาชิก GLP Member'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {language === 'th' ? 'รับส่วนลดชั่วโมงละ 10 บาท' : language === 'zh' ? '每小时立减 10 泰铢' : 'Get 10 THB discount per hour'}
                    </div>
                  </div>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#1d4ed8' }}>
                  <input 
                    type="checkbox" 
                    checked={isMember} 
                    onChange={e => setIsMember(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>{t('seatBookingModal.isMemberLabel') || 'ฉันเป็นสมาชิก GLP'}</span>
                </label>
              </div>

              {/* Member ID Input if checked */}
              {isMember && (
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    {t('seatBookingModal.memberId') || 'รหัสสมาชิก GLP:'}
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="GLP-VIP-XXXX"
                    value={memberId}
                    onChange={e => setMemberId(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}
                  />
                </div>
              )}

              {/* Customer Info Form */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    {t('seatBookingModal.custName') || 'ชื่อ - นามสกุล ผู้จอง:'} *
                  </label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    placeholder={language === 'th' ? 'เช่น คุณกอล์ฟ หรือ SScary' : language === 'zh' ? '例如 张三' : 'e.g. Alex Johnson'}
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    {t('seatBookingModal.custPhone') || 'เบอร์โทรศัพท์ติดต่อ (จำเป็น):'} *
                  </label>
                  <input 
                    type="tel" 
                    required 
                    className="form-input"
                    placeholder="08X-XXX-XXXX"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    {t('seatBookingModal.custEmail') || 'อีเมลติดต่อ (ถ้ามี):'}
                  </label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="name@example.com"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}
                  />
                </div>
              </div>

              {/* F&B Snack Add-ons */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  {t('seatBookingModal.foodLabel') || 'เลือกแพ็กเกจอาหารและเครื่องดื่ม:'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  {Object.entries(foodPackages).map(([key, item]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedFoodPackage(key)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: selectedFoodPackage === key ? '#2563eb' : '#e2e8f0',
                        background: selectedFoodPackage === key ? '#eff6ff' : '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2563eb' }}>
                        {item.price > 0 ? `+฿${item.price}` : (language === 'th' ? 'ฟรี / ไม่รับ' : language === 'zh' ? '免费/不选' : 'Free / None')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Notes */}
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  {t('seatBookingModal.notes') || 'หมายเหตุเพิ่มเติม (ถ้ามี):'}
                </label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder={language === 'th' ? 'เช่น ต้องการสาย LAN สำรอง หรือไมโครโฟนสำหรับสตรีมสด' : language === 'zh' ? '例如 需要备用网线或独立声卡麦克风' : 'e.g. Spare LAN cable or streaming mic'}
                  value={bookingNotes}
                  onChange={e => setBookingNotes(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}
                />
              </div>

              {/* Grand Total Price Bar */}
              <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: '#ffffff',
                padding: '16px 20px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block' }}>{t('seatBookingModal.totalEstimated') || 'ยอดรวมประมาณการ:'}</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>
                    ฿{grandTotal.toLocaleString()}
                  </span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  {language === 'th' ? 'ชำระหน้าเคาน์เตอร์แคชเชียร์ หรือโอนผ่านพร้อมเพย์เมื่อถึงร้าน' : language === 'zh' ? '到店前台扫码或现金支付' : 'Pay at the counter upon arrival'}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  <ChevronLeft size={16} /> {t('seatBookingModal.btnBack') || 'ย้อนกลับ'}
                </button>
                <button
                  type="submit"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 28px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)' }}
                >
                  <CheckCircle2 size={18} /> {t('seatBookingModal.btnConfirm') || 'ยืนยันการจองที่นั่ง'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: CONFIRMED DIGITAL E-TICKET PASS */}
          {step === 4 && confirmedBooking && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              {/* Success Badge */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px auto'
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', color: '#0f172a', fontWeight: 800 }}>
                  {t('seatBookingModal.ticketSuccess') || 'จองที่นั่งสำเร็จแล้ว!'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  {t('seatBookingModal.ticketSubtitle') || 'ขอบคุณที่ใช้บริการ G-SPEED ARENA กรุณาบันทึกตั๋วหรือถ่ายรูปไว้แสดงหน้าเคาน์เตอร์'}
                </p>
              </div>

              {/* Digital Cyber Ticket Card */}
              <div style={{
                maxWidth: '480px',
                width: '100%',
                background: 'linear-gradient(135deg, #090e1a 0%, #1e293b 100%)',
                color: '#ffffff',
                borderRadius: '16px',
                border: '2px solid #38bdf8',
                boxShadow: '0 15px 40px rgba(56, 189, 248, 0.25)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {/* Ticket Top Strip */}
                <div style={{
                  background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
                  padding: '10px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#ffffff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Gamepad2 size={18} />
                    <span style={{ fontWeight: 800, fontSize: '0.84rem', letterSpacing: '0.05em' }}>
                      GLP ARENA OFFICIAL PASS
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(0,0,0,0.25)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                    CONFIRMED
                  </span>
                </div>

                {/* Ticket Details */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                        {t('seatBookingModal.ticketCode') || 'รหัสการจอง (Booking Code):'}
                      </span>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '1px' }}>
                        {confirmedBooking.bookingCode}
                      </div>
                    </div>

                    {/* QR Code Icon / Box */}
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: '#ffffff',
                      borderRadius: '8px',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0f172a'
                    }}>
                      <QrCode size={56} />
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: '16px',
                    fontSize: '0.8rem'
                  }}>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>{language === 'th' ? 'ชื่อผู้จอง' : language === 'zh' ? '预订人姓名' : 'Customer Name'}</span>
                      <strong style={{ color: '#ffffff' }}>{confirmedBooking.customerName}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>{language === 'th' ? 'เบอร์โทรศัพท์' : language === 'zh' ? '电话' : 'Phone'}</span>
                      <strong style={{ color: '#ffffff' }}>{confirmedBooking.phone}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>{language === 'th' ? 'โซนที่นั่ง' : language === 'zh' ? '所选区域' : 'Zone'}</span>
                      <strong style={{ color: '#38bdf8' }}>{confirmedBooking.zoneName}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>{language === 'th' ? 'หมายเลขที่นั่ง' : language === 'zh' ? '机位号' : 'Seat Numbers'}</span>
                      <strong style={{ color: '#fbbf24', fontSize: '0.95rem' }}>
                        {(confirmedBooking.seatNumbers || []).join(', ')}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>{language === 'th' ? 'วันที่' : language === 'zh' ? '日期' : 'Date'}</span>
                      <strong style={{ color: '#ffffff' }}>{confirmedBooking.date}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>{language === 'th' ? 'เวลา & ระยะเวลา' : language === 'zh' ? '时段与时长' : 'Time & Duration'}</span>
                      <strong style={{ color: '#ffffff' }}>{confirmedBooking.timeSlot}</strong>
                    </div>
                  </div>

                  {/* Hardware & Food summary */}
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.5 }}>
                    <div>⚡ {language === 'th' ? 'สเปก:' : language === 'zh' ? '配置:' : 'Specs:'} <span style={{ color: '#cbd5e1' }}>{confirmedBooking.hardwareTier}</span></div>
                    {confirmedBooking.foodPackage && !confirmedBooking.foodPackage.includes('ไม่รับ') && !confirmedBooking.foodPackage.includes('None') && !confirmedBooking.foodPackage.includes('不选') && (
                      <div style={{ marginTop: '2px' }}>🍔 {language === 'th' ? 'เมนูเสริม:' : language === 'zh' ? '配套餐饮:' : 'F&B:'} <span style={{ color: '#fef08a' }}>{confirmedBooking.foodPackage}</span></div>
                    )}
                  </div>

                  {/* Price Row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '10px',
                    borderTop: '1px dashed rgba(255,255,255,0.2)'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{language === 'th' ? 'ยอดชำระเงิน' : language === 'zh' ? '应付总额' : 'Total Amount'}</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#38bdf8' }}>
                      ฿{confirmedBooking.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handlePrint}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={16} /> {t('seatBookingModal.btnPrintTicket') || 'พิมพ์ใบจอง / ตั๋ว'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(confirmedBooking.bookingCode);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2500);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={16} /> {copiedCode ? (language === 'th' ? 'คัดลอกแล้ว!' : language === 'zh' ? '已复制！' : 'Copied!') : (t('seatBookingModal.btnCopyCode') || 'คัดลอกรหัส')}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  {t('seatBookingModal.btnClose') || 'เสร็จสิ้น / ปิดหน้าต่าง'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
