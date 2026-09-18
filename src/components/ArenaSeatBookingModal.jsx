import React, { useState } from 'react';
import { 
  X, Monitor, Shield, Trophy, Coffee, Check, Clock, Calendar, 
  User, Phone, Mail, Sparkles, AlertCircle, Download, Printer, 
  QrCode, ChevronRight, ChevronLeft, ArrowRight, CheckCircle2, 
  CreditCard, Flame, Award, Gamepad2, Info, Copy
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { ARENA_SEATING_ZONES } from '../data/mockData';

export default function ArenaSeatBookingModal({ 
  isOpen, 
  onClose, 
  initialZoneId = 'stage' 
}) {
  if (!isOpen) return null;

  const { siteData, createArenaBooking } = useSiteData();
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
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('14:00 - 18:00 น.');
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
    none: { name: 'ไม่รับอาหารและเครื่องดื่ม', price: 0 },
    energy: { name: 'Energy Boost Combo (Red Bull + ข้าวไข่ข้นแฮม)', price: 89 },
    feast: { name: 'Gamer Feast Combo (ชานมพ่นไฟ + ข้าวผัดกะเพราหมูกรอบ + เฟรนช์ฟรายส์)', price: 149 },
    coffee: { name: 'Specialty Coffee Combo (กาแฟอาราบิก้าคั่วสดเย็น + ครัวซองต์เนยสด)', price: 65 }
  };

  const foodCost = foodPackages[selectedFoodPackage]?.price || 0;
  const seatsCount = Math.max(1, selectedSeatIds.length);
  const totalSeatPrice = seatCostPerStation * (selectedSeatIds.length > 0 ? selectedSeatIds.length : 1);
  const grandTotal = totalSeatPrice + (foodCost * seatsCount);

  // Submit Booking
  const handleCompleteBooking = (e) => {
    e.preventDefault();
    if (selectedSeatIds.length === 0) {
      alert('กรุณาเลือกที่นั่งอย่างน้อย 1 ที่นั่ง');
      setStep(1);
      return;
    }
    if (!customerName || !customerPhone) {
      alert('กรุณากรอกชื่อและเบอร์โทรศัพท์ติดต่อ');
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
      timeSlot: isNightOwl ? '23:00 - 08:00 น. (Night Owl)' : selectedTimeSlot,
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
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>• รามคำแหง 53</span>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
              ระบบจองที่นั่งอารีน่า & เช็กสถานะเครื่องสด
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
              { num: 1, label: '1. เลือกโซนและที่นั่ง' },
              { num: 2, label: '2. วันที่และระยะเวลา' },
              { num: 3, label: '3. อาหารและข้อมูลผู้จอง' }
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
                  เลือกโซนการใช้งานในอารีน่า (Select Arena Zone):
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
                        ฿{zone.pricePerHour}/ชม. (สมาชิก ฿{zone.memberPricePerHour})
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
                    สเปกฮาร์ดแวร์ประจำโซน ({currentZone.name})
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
                  <span>ที่นั่งว่าง (Available)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444' }} />
                  <span style={{ color: '#ef4444' }}>มีผู้ใช้งาน (Occupied)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#2563eb', border: '1px solid #60a5fa' }} />
                  <span style={{ color: '#1d4ed8', fontWeight: 700 }}>ที่คุณเลือก (Selected)</span>
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
                  ─── เวที / ด้านหน้าสนามแข่ง ARENA MAIN STAGE DISPLAY ───
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
                              ? 'rgba(239, 68, 68, 0.15)' 
                              : 'rgba(30, 41, 59, 0.8)',
                          color: isSelected ? '#ffffff' : isOccupied ? '#f87171' : '#f1f5f9',
                          cursor: isOccupied ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s ease',
                          transform: isSelected ? 'scale(1.05)' : 'none',
                          boxShadow: isSelected ? '0 0 14px rgba(37, 99, 235, 0.6)' : 'none'
                        }}
                      >
                        <Monitor size={18} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, marginTop: '4px' }}>
                          {seat.id}
                        </span>
                        <span style={{ fontSize: '0.62rem', opacity: 0.8 }}>
                          {isOccupied ? 'ไม่ว่าง' : isSelected ? 'เลือกแล้ว' : 'ว่าง'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Seats summary & Next button */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #e2e8f0',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    ที่นั่งที่เลือก ({selectedSeatIds.length} ที่):
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {selectedSeatIds.length > 0 ? (
                      selectedSeatIds.map(id => (
                        <span key={id} style={{ background: '#dbeafe', color: '#1d4ed8', padding: '3px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                          {id}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>ยังไม่ได้เลือกที่นั่ง (คลิกที่เครื่องด้านบน)</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedSeatIds.length === 0) {
                      alert('กรุณาเลือกที่นั่งอย่างน้อย 1 ที่นั่งเพื่อดำเนินการต่อ');
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
                  <span>ขั้นตอนถัดไป (กำหนดเวลา)</span>
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
                    วันที่ต้องการเข้าใช้งาน (Booking Date):
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
                    แพ็กเกจระยะเวลา (Duration Package):
                  </label>
                  <select
                    className="form-input"
                    value={durationPackage}
                    onChange={e => setDurationPackage(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%' }}
                  >
                    <option value="2">2 ชั่วโมง (Quick Play) • ฿{ratePerHour * 2}/เครื่อง</option>
                    <option value="4">4 ชั่วโมง (Pro Session - แนะนำ) • ฿{ratePerHour * 4}/เครื่อง</option>
                    <option value="6">6 ชั่วโมง (Rank Push Marathon) • ฿{ratePerHour * 6}/เครื่อง</option>
                    <option value="night">🌙 เหมาข้ามคืน Night Owl (23:00 - 08:00 น.) • ฿150/เครื่อง</option>
                  </select>
                </div>
              </div>

              {/* Time Slots Selector (if not night owl) */}
              {durationPackage !== 'night' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    เลือกรอบเวลาเริ่มต้น (Start Time Slot):
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {[
                      '10:00 - 14:00 น.',
                      '12:00 - 16:00 น.',
                      '14:00 - 18:00 น.',
                      '16:00 - 20:00 น.',
                      '18:00 - 22:00 น.',
                      '20:00 - 24:00 น.'
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
                  <span style={{ color: '#64748b' }}>โซนที่เลือก:</span>
                  <strong style={{ color: '#0f172a' }}>{currentZone.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>จำนวนที่นั่ง ({selectedSeatIds.length} เครื่อง):</span>
                  <strong style={{ color: '#0f172a' }}>{selectedSeatIds.join(', ')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#64748b' }}>รวมค่าชั่วโมงเล่น:</span>
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
                  <ChevronLeft size={16} /> ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 22px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
                >
                  ถัดไป (ระบุข้อมูลผู้จอง) <ChevronRight size={16} />
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
                      สิทธิ์สมาชิก GLP Member (ลดค่าชั่วโมงทันที)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      ประหยัดสูงสุด 10-15 บาท/ชม. พร้อมสะสมแต้มแลกชั่วโมงฟรี
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
                  <span>ใช้สิทธิ์สมาชิก</span>
                </label>
              </div>

              {/* Member ID Input if checked */}
              {isMember && (
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    รหัสสมาชิก GLP Member ID:
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="เช่น GLP-VIP-042 หรือ เบอร์โทรที่สมัครสมาชิก"
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
                    ชื่อผู้จอง / Gamer Tag *
                  </label>
                  <input 
                    type="text" 
                    required 
                    className="form-input"
                    placeholder="เช่น คุณกอล์ฟ หรือ SScary"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    เบอร์โทรศัพท์ติดต่อ *
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
                    อีเมล หรือ Discord Tag (สำหรับรับตั๋ว E-Ticket)
                  </label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="name@example.com หรือ user#1234"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}
                  />
                </div>
              </div>

              {/* F&B Snack Add-ons */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  สั่งชุดอาหาร & เครื่องดื่มเสิร์ฟถึงโต๊ะล่วงหน้า (F&B Combos):
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
                        {item.price > 0 ? `+฿${item.price}` : 'ฟรี / ไม่รับ'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Notes */}
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  หมายเหตุเพิ่มเติม (เช่น ยืมเมาส์/คีย์บอร์ดพิเศษ, สตรีมมิ่ง 4K):
                </label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="เช่น ต้องการสาย LAN สำรอง หรือไมโครโฟนสำหรับสตรีมสด"
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
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block' }}>ยอดชำระสุทธิ (รวมอาหารและส่วนลดสมาชิก)</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>
                    ฿{grandTotal.toLocaleString()}
                  </span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  ชำระหน้าเคาน์เตอร์แคชเชียร์ หรือโอนผ่านพร้อมเพย์เมื่อถึงร้าน
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  <ChevronLeft size={16} /> ย้อนกลับ
                </button>
                <button
                  type="submit"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 28px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: 800, fontSize: '0.92rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)' }}
                >
                  <CheckCircle2 size={18} /> ยืนยันการจอง & ออกบัตร E-Ticket
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
                  การจองที่นั่งอารีน่าเสร็จสมบูรณ์!
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  กรุณาบันทึกหรือแสดงตั๋ว Digital E-Ticket นี้แก่พนักงาน ณ จุดเคาน์เตอร์แคชเชียร์
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
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>รหัสบัตรการจอง (Booking ID)</span>
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
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>ชื่อผู้จอง</span>
                      <strong style={{ color: '#ffffff' }}>{confirmedBooking.customerName}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>เบอร์โทรศัพท์</span>
                      <strong style={{ color: '#ffffff' }}>{confirmedBooking.phone}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>โซนที่นั่ง</span>
                      <strong style={{ color: '#38bdf8' }}>{confirmedBooking.zoneName}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>หมายเลขที่นั่ง</span>
                      <strong style={{ color: '#fbbf24', fontSize: '0.95rem' }}>
                        {(confirmedBooking.seatNumbers || []).join(', ')}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>วันที่</span>
                      <strong style={{ color: '#ffffff' }}>{confirmedBooking.date}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem' }}>เวลา & ระยะเวลา</span>
                      <strong style={{ color: '#ffffff' }}>{confirmedBooking.timeSlot}</strong>
                    </div>
                  </div>

                  {/* Hardware & Food summary */}
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.5 }}>
                    <div>⚡ สเปก: <span style={{ color: '#cbd5e1' }}>{confirmedBooking.hardwareTier}</span></div>
                    {confirmedBooking.foodPackage && confirmedBooking.foodPackage !== 'ไม่รับอาหารและเครื่องดื่ม' && (
                      <div style={{ marginTop: '2px' }}>🍔 เมนูเสริม: <span style={{ color: '#fef08a' }}>{confirmedBooking.foodPackage}</span></div>
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
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ยอดชำระเงิน</span>
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
                  <Printer size={16} /> พิมพ์ตั๋ว E-Ticket
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
                  <Copy size={16} /> {copiedCode ? 'คัดลอกแล้ว!' : 'คัดลอกรหัสตั๋ว'}
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
                  เรียบร้อย (เสร็จสิ้น)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
