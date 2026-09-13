import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutGrid, Calculator, Monitor, Armchair, Server, CreditCard, Coffee, 
  Users, Trophy, Shield, Plus, RotateCw, Trash2, Copy, Download, 
  Send, CheckCircle2, AlertTriangle, ArrowRight, DollarSign, Clock, 
  Sliders, ChevronRight, RefreshCw, Layers, Zap, Compass, Info, Check, X, Cpu, DoorOpen,
  Gamepad2, Wind, Ruler, Box, Eye, Palette, Sparkles, Move, ChevronUp, ChevronDown, ChevronLeft,
  UploadCloud, Image, FileText, SplitSquareVertical, FileCheck, Maximize2, Minimize2, ZoomIn, ZoomOut, MousePointerClick,
  Printer, Building2
} from 'lucide-react';
import Room3DStudio from './Room3DStudio';
import { 
  CATALOG_ITEMS, HARDWARE_TIERS, FIXED_INFRASTRUCTURE, 
  PRESET_ROOMS, INSTALLATION_TIMELINE,
  WALLPAPERS, FLOOR_MATERIALS
} from '../data/mockData';
import { useSiteData } from '../context/SiteDataContext';
import { compressAndConvertToWebP, formatBytes } from '../utils/imageOptimizer';

export default function FranchisePlanner() {
  const { siteData } = useSiteData();
  const catalogItems = siteData?.catalogItems || CATALOG_ITEMS;
  const hardwareTiers = siteData?.hardwareTiers || HARDWARE_TIERS;

  // Step navigation (1: พื้นที่และทำเล, 2: ออกแบบผัง 3D/2D, 3: เลือกสเปกอุปกรณ์, 4: สรุปงบประมาณ & ROI)
  const [currentStep, setCurrentStep] = useState(1); // Default to Step 1: ข้อมูลพื้นที่ & ทำเล

  // 3D Interior & Viewport Controls
  const [viewMode, setViewMode] = useState('3d'); // '3d' or '2d'
  const [selectedWallpaper, setSelectedWallpaper] = useState('white-clean');
  const [selectedFloorMaterial, setSelectedFloorMaterial] = useState('wood-parquet');
  const [catalogCategory, setCatalogCategory] = useState('all'); // all, stations, facilities, architectural

  // Location & Store Dimensions State
  const [storeLocation, setStoreLocation] = useState('กรุงเทพฯ และปริมณฑล');
  const [storeType, setStoreType] = useState('อาคารพาณิชย์ (Commercial Building)');
  const [roomWidth, setRoomWidth] = useState(12); // meters
  const [roomHeight, setRoomHeight] = useState(10); // meters
  const [selectedTheme, setSelectedTheme] = useState('royal'); // royal, luxury, stealth

  // Floor Plan Items State
  // Default to Size M preset items
  const [placedItems, setPlacedItems] = useState(() => {
    return PRESET_ROOMS[1].defaultItems.map(item => ({
      ...item,
      catalog: (siteData?.catalogItems || CATALOG_ITEMS).find(c => c.type === item.type) || CATALOG_ITEMS.find(c => c.type === item.type)
    }));
  });

  // Selected item on canvas for manipulation (moving, rotating, deleting)
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [draggingItemId, setDraggingItemId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [justAddedId, setJustAddedId] = useState(null);

  // Hardware Tier Selection
  const [selectedTier, setSelectedTier] = useState('pro'); // standard, pro, ultimate

  // Business / ROI Estimation Parameters
  const [hourlyRate, setHourlyRate] = useState(30); // THB / hour
  const [occupancyRate, setOccupancyRate] = useState(60); // % average utilization
  const [operatingHours, setOperatingHours] = useState(24); // hours / day

  // Modals
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showLeadSuccess, setShowLeadSuccess] = useState(false);
  const [leadForm, setLeadForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    budget: '1,500,000 - 3,000,000 บาท',
    locationDetail: '',
    note: ''
  });

  // =========================================================================
  // Architectural Blueprint Upload & AI Feasibility Calculation State
  // =========================================================================
  const [uploadedBlueprint, setUploadedBlueprint] = useState(null);
  const [showBlueprintOverlay, setShowBlueprintOverlay] = useState(true);
  const [blueprintOpacity, setBlueprintOpacity] = useState(0.45);
  const [isAnalyzingBlueprint, setIsAnalyzingBlueprint] = useState(false);

  // Fullscreen Studio Mode State
  const [isPlannerFullscreen, setIsPlannerFullscreen] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isPlannerFullscreen) {
        setIsPlannerFullscreen(false);
      }
    };
    if (isPlannerFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isPlannerFullscreen]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processBlueprintFile(file);
  };

  const processBlueprintFile = async (file) => {
    setIsAnalyzingBlueprint(true);
    try {
      // High performance WebP compression for blueprint scans
      const opt = await compressAndConvertToWebP(file, { maxWidth: 2000, maxHeight: 2000, quality: 0.85 });
      setTimeout(() => {
        setRoomWidth(18);
        setRoomHeight(16);
        setUploadedBlueprint({
          name: file.name.replace(/\.[^.]+$/, '') + '.webp',
          size: `${opt.compressedSizeFormatted} (ลดลง ${opt.compressionRatio})`,
          originalSize: opt.originalSizeFormatted,
          compressedSize: opt.compressedSizeFormatted,
          compressionRatio: opt.compressionRatio,
          url: opt.dataUrl,
          dimensions: '18 x 16 เมตร (288 ตร.ม.)',
          detectedZones: [
            { name: 'โซนเครื่องเล่นเกมหลัก (Main Arena)', area: '144 ตร.ม.', stations: '48-52 เครื่อง', color: '#1d4ed8' },
            { name: 'ห้องซ้อม VIP / Bootcamp Suites', area: '36 ตร.ม.', stations: '10 เครื่อง (2 ห้อง)', color: '#9333ea' },
            { name: 'Cafe Prep & Dining Lounge', area: '44 ตร.ม.', stations: '20 ที่นั่ง & บาร์กาแฟ', color: '#10b981' },
            { name: 'เคาน์เตอร์แคชเชียร์ & จุดต้อนรับ', area: '14 ตร.ม.', stations: '1 จุดบริการ', color: '#f59e0b' },
            { name: 'ห้องควบคุมระบบ MDB & Diskless Server', area: '12 ตร.ม.', stations: 'ตู้ Rack 42U', color: '#64748b' },
            { name: 'ห้องน้ำและทางสัญจร (Circulation)', area: '38 ตร.ม.', stations: 'แยกชาย-หญิง', color: '#0ea5e9' }
          ],
          recommendedStations: 60,
          estimatedCapex: 3480000,
          estimatedMonthlyProfit: 285000,
          paybackMonths: 12.2
        });
        setShowBlueprintOverlay(true);
        setIsAnalyzingBlueprint(false);
      }, 700);
    } catch (err) {
      console.warn('Blueprint optimization fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        setTimeout(() => {
          setRoomWidth(18);
          setRoomHeight(16);
          setUploadedBlueprint({
            name: file.name,
            size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            url: dataUrl,
            dimensions: '18 x 16 เมตร (288 ตร.ม.)',
            detectedZones: [
              { name: 'โซนเครื่องเล่นเกมหลัก (Main Arena)', area: '144 ตร.ม.', stations: '48-52 เครื่อง', color: '#1d4ed8' },
              { name: 'ห้องซ้อม VIP / Bootcamp Suites', area: '36 ตร.ม.', stations: '10 เครื่อง (2 ห้อง)', color: '#9333ea' },
              { name: 'Cafe Prep & Dining Lounge', area: '44 ตร.ม.', stations: '20 ที่นั่ง & บาร์กาแฟ', color: '#10b981' },
              { name: 'เคาน์เตอร์แคชเชียร์ & จุดต้อนรับ', area: '14 ตร.ม.', stations: '1 จุดบริการ', color: '#f59e0b' },
              { name: 'ห้องควบคุมระบบ MDB & Diskless Server', area: '12 ตร.ม.', stations: 'ตู้ Rack 42U', color: '#64748b' },
              { name: 'ห้องน้ำและทางสัญจร (Circulation)', area: '38 ตร.ม.', stations: 'แยกชาย-หญิง', color: '#0ea5e9' }
            ],
            recommendedStations: 60,
            estimatedCapex: 3480000,
            estimatedMonthlyProfit: 285000,
            paybackMonths: 12.2
          });
          setShowBlueprintOverlay(true);
          setIsAnalyzingBlueprint(false);
        }, 700);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleBlueprint = () => {
    setIsAnalyzingBlueprint(true);
    setTimeout(() => {
      setRoomWidth(18);
      setRoomHeight(16);
      setUploadedBlueprint({
        name: 'พิมพ์เขียวอาคารพาณิชย์_แปลนสาขาหลัก.png',
        size: '79 KB',
        url: '/sample-blueprint.png',
        dimensions: '18 x 16 เมตร (288 ตร.ม.)',
        detectedZones: [
          { name: 'โซนเครื่องเล่นเกมหลัก (Main Arena)', area: '144 ตร.ม.', stations: '48-52 เครื่อง', color: '#1d4ed8' },
          { name: 'ห้องซ้อม VIP / Bootcamp Suites', area: '36 ตร.ม.', stations: '10 เครื่อง (2 ห้อง)', color: '#9333ea' },
          { name: 'Cafe Prep & Dining Lounge', area: '44 ตร.ม.', stations: '20 ที่นั่ง & บาร์กาแฟ', color: '#10b981' },
          { name: 'เคาน์เตอร์แคชเชียร์ & จุดต้อนรับ', area: '14 ตร.ม.', stations: '1 จุดบริการ', color: '#f59e0b' },
          { name: 'ห้องควบคุมระบบ MDB & Diskless Server', area: '12 ตร.ม.', stations: 'ตู้ Rack 42U', color: '#64748b' },
          { name: 'ห้องน้ำและทางสัญจร (Circulation)', area: '38 ตร.ม.', stations: 'แยกชาย-หญิง', color: '#0ea5e9' }
        ],
        recommendedStations: 60,
        estimatedCapex: 3480000,
        estimatedMonthlyProfit: 285000,
        paybackMonths: 12.2
      });
      setShowBlueprintOverlay(true);
      setIsAnalyzingBlueprint(false);
    }, 500);
  };

  const handleRemoveBlueprint = () => {
    setUploadedBlueprint(null);
    setShowBlueprintOverlay(false);
  };

  // Canvas Reference & Scale
  const canvasContainerRef = useRef(null);
  const roomBoxRef = useRef(null);
  const placedItemsRef = useRef(placedItems);
  placedItemsRef.current = placedItems;

  // Scale factor: pixels per meter (dynamically computed to fit container)
  const [pixelsPerMeter, setPixelsPerMeter] = useState(45);

  // Recalculate pixels per meter dynamically when dimensions change, container resizes, or fullscreen toggles
  useEffect(() => {
    const updateScale = () => {
      if (canvasContainerRef.current) {
        const containerWidth = canvasContainerRef.current.clientWidth || 700;
        const containerHeight = canvasContainerRef.current.clientHeight || 520;
        // Accounting for 140px horizontal margin/padding and 100px vertical margin/padding
        const scaleX = Math.floor((containerWidth - 140) / roomWidth);
        const scaleY = Math.floor((containerHeight - 100) / roomHeight);
        const computedScale = Math.min(Math.max(Math.min(scaleX, scaleY > 0 ? scaleY : scaleX), 25), 75);
        setPixelsPerMeter(computedScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    let observer;
    if (canvasContainerRef.current && window.ResizeObserver) {
      observer = new ResizeObserver(updateScale);
      observer.observe(canvasContainerRef.current);
    }
    return () => {
      window.removeEventListener('resize', updateScale);
      if (observer) observer.disconnect();
    };
  }, [roomWidth, roomHeight, isPlannerFullscreen, viewMode]);

  // Keep room box perfectly centered without scroll drift
  useEffect(() => {
    if (canvasContainerRef.current) {
      canvasContainerRef.current.scrollTop = 0;
      canvasContainerRef.current.scrollLeft = 0;
    }
  }, [isPlannerFullscreen, viewMode]);

  // Lock body scroll in fullscreen mode to prevent background page jumping
  useEffect(() => {
    if (isPlannerFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPlannerFullscreen]);

  // Total Room Area
  const roomAreaSqM = roomWidth * roomHeight;

  // Calculate Total PCs on Floor Plan
  const totalStations = placedItems.reduce((acc, item) => {
    return acc + (item.catalog?.seats || 0);
  }, 0);

  // Check Aisle Clearance & Density
  // Safe estimate: each PC needs approx 2.2 - 2.5 sq.m of floor area (including aisles and facilities)
  const idealMaxPCs = Math.floor(roomAreaSqM / 2.3);
  const isOvercrowded = totalStations > idealMaxPCs;

  // Cost Calculations
  const currentTierInfo = hardwareTiers[selectedTier] || hardwareTiers.pro || { unitCost: 45000 };
  const hardwareCost = totalStations * (currentTierInfo?.unitCost || 45000);
  
  // Custom furniture and base cost from placed items
  const furnitureItemsCost = placedItems.reduce((acc, item) => {
    return acc + (item.catalog?.baseCost || 0);
  }, 0);

  const interiorDecorCost = roomAreaSqM * FIXED_INFRASTRUCTURE.interiorSqMeterCost;
  const airconCost = roomAreaSqM * FIXED_INFRASTRUCTURE.airconSqMeterCost;
  const disklessCost = FIXED_INFRASTRUCTURE.disklessServer;
  const networkCost = FIXED_INFRASTRUCTURE.networkEnterprise;
  const billingCost = FIXED_INFRASTRUCTURE.billingAndPOS;
  const franchiseLicenseCost = FIXED_INFRASTRUCTURE.franchiseFee;

  // Total Estimated Investment
  const totalInvestmentCost = 
    hardwareCost + 
    furnitureItemsCost + 
    interiorDecorCost + 
    airconCost + 
    disklessCost + 
    networkCost + 
    billingCost + 
    franchiseLicenseCost;

  // Monthly Revenue & ROI Estimation
  // Monthly gaming revenue = Total PCs * 30 days * (operating hours * occupancy% / 100) * hourlyRate
  const dailyGamingRevenue = totalStations * (operatingHours * (occupancyRate / 100)) * hourlyRate;
  const monthlyGamingRevenue = dailyGamingRevenue * 30;
  // F&B snack bar revenue is approx 22% of gaming revenue
  const monthlySnackRevenue = monthlyGamingRevenue * 0.22;
  const totalMonthlyRevenue = monthlyGamingRevenue + monthlySnackRevenue;

  // Estimated Monthly Expenses (Electricity, Fiber 2-lines, 2-shift staff, Maintenance)
  const monthlyElectricity = totalStations * 650 + (roomAreaSqM * 90); // ~650 THB per PC + AC
  const monthlyStaff = totalStations > 50 ? 60000 : 36000; // 2-3 shifts
  const monthlyInternetAndMisc = 12000;
  const totalMonthlyExpenses = monthlyElectricity + monthlyStaff + monthlyInternetAndMisc;

  const estimatedMonthlyNetProfit = Math.max(totalMonthlyRevenue - totalMonthlyExpenses, 10000);
  const paybackMonths = Math.max(Math.round(totalInvestmentCost / estimatedMonthlyNetProfit), 6);

  // Handlers for Floor Plan Items
  const handleAddItem = (catalogItem) => {
    const newItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: catalogItem.type,
      x: Math.max(0.5, (roomWidth / 2) - (catalogItem.widthMeters / 2)),
      y: Math.max(0.5, (roomHeight / 2) - (catalogItem.heightMeters / 2)),
      rotation: 0,
      catalog: catalogItem
    };
    setPlacedItems(prev => [...prev, newItem]);
    setSelectedItemId(newItem.id);
    setJustAddedId(newItem.id);
    setTimeout(() => setJustAddedId(null), 2500);
  };

  const handleRotateItem = (id) => {
    setPlacedItems(items => items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          rotation: (item.rotation + 90) % 360
        };
      }
      return item;
    }));
  };

  const handleDeleteItem = (id) => {
    setPlacedItems(items => items.filter(item => item.id !== id));
    if (selectedItemId === id) setSelectedItemId(null);
  };

  const handleDuplicateItem = (id) => {
    const target = placedItems.find(item => item.id === id);
    if (!target) return;
    const duplicated = {
      ...target,
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      x: Math.min(target.x + 0.8, roomWidth - 2),
      y: Math.min(target.y + 0.8, roomHeight - 2)
    };
    setPlacedItems(prev => [...prev, duplicated]);
    setSelectedItemId(duplicated.id);
    setJustAddedId(duplicated.id);
    setTimeout(() => setJustAddedId(null), 2500);
  };

  const handleNudgeItem = (id, dx, dy) => {
    setPlacedItems(items => items.map(item => {
      if (item.id === id) {
        const isRotated = item.rotation === 90 || item.rotation === 270;
        const itemW = isRotated ? (item.catalog?.heightMeters || 1) : (item.catalog?.widthMeters || 1);
        const itemH = isRotated ? (item.catalog?.widthMeters || 1) : (item.catalog?.heightMeters || 1);
        const newX = Math.max(0, Math.min(item.x + dx, roomWidth - itemW));
        const newY = Math.max(0, Math.min(item.y + dy, roomHeight - itemH));
        return {
          ...item,
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10
        };
      }
      return item;
    }));
  };

  const handleLoadPreset = (preset) => {
    setRoomWidth(preset.width);
    setRoomHeight(preset.height);
    const hydrated = preset.defaultItems.map(item => ({
      ...item,
      catalog: catalogItems.find(c => c.type === item.type) || CATALOG_ITEMS.find(c => c.type === item.type)
    }));
    setPlacedItems(hydrated);
    setSelectedItemId(null);
  };

  const handleClearCanvas = () => {
    if (window.confirm('คุณต้องการล้างผังร้านทั้งหมดใช่หรือไม่?')) {
      setPlacedItems([]);
      setSelectedItemId(null);
    }
  };

  // Drag & Drop on Canvas (Exact Room Coordinates via roomBoxRef)
  const handleMouseDown = (e, item) => {
    e.stopPropagation();
    setSelectedItemId(item.id);
    setDraggingItemId(item.id);
    if (!roomBoxRef.current) return;
    const roomRect = roomBoxRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - roomRect.left) / pixelsPerMeter;
    const mouseY = (e.clientY - roomRect.top) / pixelsPerMeter;
    setDragOffset({
      x: mouseX - item.x,
      y: mouseY - item.y
    });
  };

  // High-performance Window Pointer Drag & Drop for 2D Canvas (Fluid & Drift-Free)
  useEffect(() => {
    if (!draggingItemId) return;

    const onPointerMove = (e) => {
      if (!roomBoxRef.current) return;
      const roomRect = roomBoxRef.current.getBoundingClientRect();
      let currentX = (e.clientX - roomRect.left) / pixelsPerMeter - dragOffset.x;
      let currentY = (e.clientY - roomRect.top) / pixelsPerMeter - dragOffset.y;

      // Ultra-smooth 0.1 meter micro-grid snap
      currentX = Math.round(currentX * 10) / 10;
      currentY = Math.round(currentY * 10) / 10;

      const currentItem = placedItemsRef.current.find(i => i.id === draggingItemId);
      const isRotated = currentItem?.rotation === 90 || currentItem?.rotation === 270;
      const itemW = isRotated ? (currentItem?.catalog?.heightMeters || 1) : (currentItem?.catalog?.widthMeters || 1);
      const itemH = isRotated ? (currentItem?.catalog?.widthMeters || 1) : (currentItem?.catalog?.heightMeters || 1);

      const boundedX = Math.max(0, Math.min(currentX, roomWidth - itemW));
      const boundedY = Math.max(0, Math.min(currentY, roomHeight - itemH));

      setPlacedItems(items => items.map(item => {
        if (item.id === draggingItemId) {
          return { ...item, x: boundedX, y: boundedY };
        }
        return item;
      }));
    };

    const onPointerUp = () => {
      setDraggingItemId(null);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [draggingItemId, dragOffset, pixelsPerMeter, roomWidth, roomHeight]);

  // Keyboard Arrow Keys listener for 2D canvas nudging & rotation
  useEffect(() => {
    if (viewMode !== '2d' || !selectedItemId) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      const step = e.shiftKey ? 0.5 : 0.2;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleNudgeItem(selectedItemId, 0, -step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNudgeItem(selectedItemId, 0, step);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNudgeItem(selectedItemId, -step, 0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNudgeItem(selectedItemId, step, 0);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRotateItem(selectedItemId);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteItem(selectedItemId);
      } else if (e.key === 'Escape') {
        setSelectedItemId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, selectedItemId, roomWidth, roomHeight]);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    setShowLeadSuccess(true);
    setTimeout(() => {
      setShowLeadSuccess(false);
      setShowQuotationModal(false);
      setLeadForm({
        fullName: '',
        phone: '',
        email: '',
        budget: '1,500,000 - 3,000,000 บาท',
        locationDetail: '',
        note: ''
      });
    }, 2500);
  };

  // High-Resolution 2D Architectural & Engineering Blueprint Exporter for Contractors
  const handleExportBlueprintImage = () => {
    const canvas = document.createElement('canvas');
    const canvasWidth = 2400;
    const canvasHeight = 1600;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. White Blueprint Paper Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 2. Blueprint Architectural Border & Framing
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1d4ed8'; // Royal blue outer engineering border
    ctx.strokeRect(30, 30, canvasWidth - 60, canvasHeight - 60);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#93c5fd';
    ctx.strokeRect(38, 38, canvasWidth - 76, canvasHeight - 76);

    // 3. Drawing Header Title Bar
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(40, 40, canvasWidth - 80, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Outfit", "Inter", sans-serif';
    ctx.fillText('G-SPEED ESPORT ARENA | ARCHITECTURAL & MEP FITOUT BLUEPRINT', 65, 86);

    ctx.font = '15px "Inter", sans-serif';
    ctx.fillStyle = '#bfdbfe';
    ctx.fillText('แบบแปลนระบบไฟฟ้า, โครงข่าย LAN CAT6A และการจัดวางคอมพิวเตอร์ (สำหรับผู้รับเหมาและวิศวกรระบบ)', 65, 106);

    // Header Right Info
    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(`DWG NO: GS-BP-${Date.now().toString().slice(-6)}`, canvasWidth - 65, 78);
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillStyle = '#93c5fd';
    ctx.fillText(`สเกลระบุเมตร (METRIC) | วันที่: ${new Date().toLocaleDateString('th-TH')}`, canvasWidth - 65, 102);
    ctx.textAlign = 'left';

    // 4. Drawing Area Boundaries
    const drawLeft = 80;
    const drawTop = 150;
    const drawWidth = canvasWidth - 560; // reserve 480px on the right for Title Block & Legend
    const drawHeight = canvasHeight - 240; // reserve 90px at bottom for contractor notes

    // Calculate scale factor to fit the room in drawing area
    const meterScale = Math.min((drawWidth - 140) / roomWidth, (drawHeight - 140) / roomHeight);
    const roomPxW = roomWidth * meterScale;
    const roomPxH = roomHeight * meterScale;
    const roomOriginX = drawLeft + ((drawWidth - roomPxW) / 2);
    const roomOriginY = drawTop + ((drawHeight - roomPxH) / 2);

    // Draw Room Background (Light grid blueprint)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(roomOriginX, roomOriginY, roomPxW, roomPxH);

    // 1-Meter Grid Lines
    ctx.lineWidth = 1;
    for (let x = 0; x <= roomWidth; x += 1) {
      ctx.strokeStyle = x % 5 === 0 ? '#cbd5e1' : '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(roomOriginX + (x * meterScale), roomOriginY);
      ctx.lineTo(roomOriginX + (x * meterScale), roomOriginY + roomPxH);
      ctx.stroke();

      // Meter markers along top
      if (x > 0 && x < roomWidth) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px "Inter", sans-serif';
        ctx.fillText(`${x}m`, roomOriginX + (x * meterScale) - 8, roomOriginY - 8);
      }
    }

    for (let y = 0; y <= roomHeight; y += 1) {
      ctx.strokeStyle = y % 5 === 0 ? '#cbd5e1' : '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(roomOriginX, roomOriginY + (y * meterScale));
      ctx.lineTo(roomOriginX + roomPxW, roomOriginY + (y * meterScale));
      ctx.stroke();

      if (y > 0 && y < roomHeight) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px "Inter", sans-serif';
        ctx.fillText(`${y}m`, roomOriginX - 32, roomOriginY + (y * meterScale) + 4);
      }
    }

    // Outer Room Concrete Walls
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#0f172a';
    ctx.strokeRect(roomOriginX, roomOriginY, roomPxW, roomPxH);

    // Dimension Annotations (Engineering Arrows)
    // Top Dimension Line
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#2563eb';
    ctx.fillStyle = '#1d4ed8';
    const topDimY = roomOriginY - 26;
    ctx.beginPath();
    ctx.moveTo(roomOriginX, topDimY);
    ctx.lineTo(roomOriginX + roomPxW, topDimY);
    ctx.stroke();
    // Arrowheads
    ctx.beginPath(); ctx.moveTo(roomOriginX, topDimY); ctx.lineTo(roomOriginX + 12, topDimY - 4); ctx.lineTo(roomOriginX + 12, topDimY + 4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(roomOriginX + roomPxW, topDimY); ctx.lineTo(roomOriginX + roomPxW - 12, topDimY - 4); ctx.lineTo(roomOriginX + roomPxW - 12, topDimY + 4); ctx.fill();
    // Dimension Text
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`ความกว้าง ${roomWidth.toFixed(2)} เมตร`, roomOriginX + (roomPxW / 2), topDimY - 8);

    // Left Dimension Line
    const leftDimX = roomOriginX - 42;
    ctx.beginPath();
    ctx.moveTo(leftDimX, roomOriginY);
    ctx.lineTo(leftDimX, roomOriginY + roomPxH);
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(leftDimX, roomOriginY); ctx.lineTo(leftDimX - 4, roomOriginY + 12); ctx.lineTo(leftDimX + 4, roomOriginY + 12); ctx.fill();
    ctx.beginPath(); ctx.moveTo(leftDimX, roomOriginY + roomPxH); ctx.lineTo(leftDimX - 4, roomOriginY + roomPxH - 12); ctx.lineTo(leftDimX + 4, roomOriginY + roomPxH - 12); ctx.fill();
    
    // Left text (vertical)
    ctx.save();
    ctx.translate(leftDimX - 12, roomOriginY + (roomPxH / 2));
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`ความยาว ${roomHeight.toFixed(2)} เมตร`, 0, 0);
    ctx.restore();
    ctx.textAlign = 'left';

    // Main Entrance Indicator
    const entranceW = 1.4 * meterScale;
    const entranceX = roomOriginX + (roomPxW / 2) - (entranceW / 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(entranceX, roomOriginY + roomPxH - 4, entranceW, 8); // wall opening
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(entranceX, roomOriginY + roomPxH, entranceW, -Math.PI / 2, 0);
    ctx.stroke();
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.fillText('ทางเข้าร้านหลัก (MAIN ENTRANCE 1.4M)', entranceX - 50, roomOriginY + roomPxH + 28);

    // 5. Electrical & LAN Conduit Lines (Connecting Server Rack to desk clusters)
    const serverItem = placedItems.find(i => i.type === 'server-rack' || i.type === 'service-counter') || placedItems[0];
    const serverCenterX = serverItem 
      ? roomOriginX + (serverItem.x * meterScale) + (((serverItem.rotation === 90 || serverItem.rotation === 270 ? serverItem.catalog?.heightMeters : serverItem.catalog?.widthMeters) || 1) * meterScale / 2)
      : roomOriginX + (1.5 * meterScale);
    const serverCenterY = serverItem 
      ? roomOriginY + (serverItem.y * meterScale) + (((serverItem.rotation === 90 || serverItem.rotation === 270 ? serverItem.catalog?.widthMeters : serverItem.catalog?.heightMeters) || 1) * meterScale / 2)
      : roomOriginY + (1.5 * meterScale);

    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.65)'; // Dashed blue conduit lines

    placedItems.forEach(item => {
      if (item === serverItem) return;
      const isRotated = item.rotation === 90 || item.rotation === 270;
      const w = (isRotated ? item.catalog?.heightMeters : item.catalog?.widthMeters) || 1;
      const h = (isRotated ? item.catalog?.widthMeters : item.catalog?.heightMeters) || 1;
      const targetX = roomOriginX + (item.x * meterScale) + (w * meterScale / 2);
      const targetY = roomOriginY + (item.y * meterScale) + (h * meterScale / 2);

      ctx.beginPath();
      ctx.moveTo(serverCenterX, serverCenterY);
      ctx.lineTo(targetX, serverCenterY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
    });
    ctx.setLineDash([]); // reset line dash

    // 6. Draw Furniture Modules
    placedItems.forEach((item, index) => {
      const isRotated = item.rotation === 90 || item.rotation === 270;
      const itemW = (isRotated ? item.catalog?.heightMeters : item.catalog?.widthMeters) || 1;
      const itemH = (isRotated ? item.catalog?.widthMeters : item.catalog?.heightMeters) || 1;
      const pxX = roomOriginX + (item.x * meterScale);
      const pxY = roomOriginY + (item.y * meterScale);
      const pxW = itemW * meterScale;
      const pxH = itemH * meterScale;

      const isServer = item.type === 'server-rack';
      const isCounter = item.type === 'service-counter';
      const isVip = item.type.includes('vip');

      // Module background
      if (isServer) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(pxX, pxY, pxW, pxH);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(pxX, pxY, pxW, pxH);
      } else if (isCounter) {
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(pxX, pxY, pxW, pxH);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(pxX, pxY, pxW, pxH);
      } else if (isVip) {
        ctx.fillStyle = '#faf5ff';
        ctx.fillRect(pxX, pxY, pxW, pxH);
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 2;
        ctx.strokeRect(pxX, pxY, pxW, pxH);
      } else {
        ctx.fillStyle = '#eff6ff';
        ctx.fillRect(pxX, pxY, pxW, pxH);
        ctx.strokeStyle = '#1d4ed8';
        ctx.lineWidth = 2;
        ctx.strokeRect(pxX, pxY, pxW, pxH);
      }

      // Interior details & text
      ctx.fillStyle = isServer ? '#ffffff' : (isCounter ? '#92400e' : (isVip ? '#6b21a8' : '#1e3a8a'));
      ctx.font = 'bold 13px "Inter", sans-serif';
      const title = item.catalog?.name?.split('(')[0] || item.type;
      ctx.fillText(`[#${index + 1}] ${title}`, pxX + 6, pxY + 18);

      ctx.font = '11px "Inter", sans-serif';
      ctx.fillStyle = isServer ? '#93c5fd' : '#475569';
      ctx.fillText(`${itemW}x${itemH}m | (${item.x.toFixed(1)}, ${item.y.toFixed(1)})`, pxX + 6, pxY + 34);

      if (item.catalog?.seats > 0) {
        ctx.fillStyle = '#1d4ed8';
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.fillText(`⚡ ${item.catalog.seats} PCs (220V + CAT6A)`, pxX + 6, pxY + 50);

        // Draw seating circles
        const seatCount = Math.min(item.catalog.seats, 8);
        const seatRadius = 4;
        for (let s = 0; s < seatCount; s++) {
          const seatX = pxX + 12 + (s * 14);
          const seatY = pxY + pxH - 8;
          ctx.beginPath();
          ctx.arc(seatX, seatY, seatRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#2563eb';
          ctx.fill();
        }
      }
    });

    // 7. Right Panel: Engineering Specification Block & Legend
    const infoPanelX = canvasWidth - 480;
    const infoPanelY = 150;
    const infoPanelW = 440;
    const infoPanelH = canvasHeight - 240;

    // Background panel
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(infoPanelX, infoPanelY, infoPanelW, infoPanelH);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(infoPanelX, infoPanelY, infoPanelW, infoPanelH);

    // Section 1: Project Metadata
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(infoPanelX, infoPanelY, infoPanelW, 36);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.fillText('ข้อมูลแบบแปลน (DRAWING METADATA)', infoPanelX + 14, infoPanelY + 24);

    const metaRows = [
      ['โครงการ (Project):', 'G-SPEED ESPORT ARENA'],
      ['ขนาดพื้นที่ (Venue):', `${roomWidth} x ${roomHeight} เมตร (${roomWidth * roomHeight} ตร.ม.)`],
      ['จำนวนสถานี (Stations):', `${totalStations} เครื่อง`],
      ['จำนวนโมดูล (Modules):', `${placedItems.length} ชิ้นงาน`],
      ['สเปกคอมพิวเตอร์:', currentTierInfo.name],
      ['ทำเลที่ตั้ง (Location):', storeLocation],
      ['ผู้ออกแบบและตรวจแบบ:', 'G-Speed Engineering Dept.']
    ];

    ctx.font = '13px "Inter", sans-serif';
    let currentY = infoPanelY + 60;
    metaRows.forEach(([lbl, val]) => {
      ctx.fillStyle = '#64748b';
      ctx.fillText(lbl, infoPanelX + 14, currentY);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.fillText(val, infoPanelX + 180, currentY);
      ctx.font = '13px "Inter", sans-serif';
      currentY += 25;
    });

    // Section 2: Blueprint Legend (สัญลักษณ์แบบแปลน)
    currentY += 15;
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(infoPanelX, currentY, infoPanelW, 36);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.fillText('สัญลักษณ์แบบแปลน (PLAN LEGEND)', infoPanelX + 14, currentY + 24);

    currentY += 50;
    const legendItems = [
      { color: '#eff6ff', border: '#1d4ed8', label: 'โต๊ะคอมพิวเตอร์เกมมิ่ง (Gaming Stations)' },
      { color: '#0f172a', border: '#3b82f6', label: 'ตู้ Rack Server 42U & MDB (Server Room)' },
      { color: '#faf5ff', border: '#9333ea', label: 'ห้องซ้อม VIP / Bootcamp Suite' },
      { color: '#fef3c7', border: '#d97706', label: 'เคาน์เตอร์คิดเงิน & POS แคชเชียร์' },
      { line: true, color: '#2563eb', label: 'แนวท่อร้อยสายไฟ 220V & สาย LAN CAT6A' }
    ];

    legendItems.forEach(leg => {
      if (leg.line) {
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = leg.color;
        ctx.beginPath();
        ctx.moveTo(infoPanelX + 14, currentY - 5);
        ctx.lineTo(infoPanelX + 44, currentY - 5);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.fillStyle = leg.color;
        ctx.fillRect(infoPanelX + 14, currentY - 14, 30, 18);
        ctx.strokeStyle = leg.border;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(infoPanelX + 14, currentY - 14, 30, 18);
      }
      ctx.fillStyle = '#1e293b';
      ctx.font = '13px "Inter", sans-serif';
      ctx.fillText(leg.label, infoPanelX + 56, currentY);
      currentY += 32;
    });

    // Section 3: Placed Modules Index Table
    currentY += 15;
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(infoPanelX, currentY, infoPanelW, 36);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.fillText('รายการโมดูลในผัง (EQUIPMENT SCHEDULE)', infoPanelX + 14, currentY + 24);

    currentY += 40;
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('ลำดับ  ชื่อรายการโมดูล              พิกัด (X, Y)     ขนาด', infoPanelX + 14, currentY);
    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath(); ctx.moveTo(infoPanelX + 14, currentY + 5); ctx.lineTo(infoPanelX + infoPanelW - 14, currentY + 5); ctx.stroke();
    currentY += 20;

    placedItems.slice(0, 8).forEach((it, idx) => {
      const name = (it.catalog?.name?.split('(')[0] || it.type).slice(0, 16);
      const coords = `(${it.x.toFixed(1)}, ${it.y.toFixed(1)})`;
      const size = `${it.catalog?.widthMeters || 1}x${it.catalog?.heightMeters || 1}m`;
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`#${idx + 1}    ${name.padEnd(18, ' ')} ${coords.padEnd(12, ' ')} ${size}`, infoPanelX + 14, currentY);
      currentY += 19;
    });
    if (placedItems.length > 8) {
      ctx.fillStyle = '#64748b';
      ctx.fillText(`... และอีก ${placedItems.length - 8} รายการ`, infoPanelX + 14, currentY);
    }

    // 8. Bottom Contractor Notes Banner
    const notesY = canvasHeight - 100;
    ctx.fillStyle = '#eff6ff';
    ctx.fillRect(80, notesY, canvasWidth - 560, 65);
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(80, notesY, canvasWidth - 560, 65);

    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 14px "Inter", sans-serif';
    ctx.fillText('ข้อกำหนดสำคัญสำหรับผู้รับเหมางานระบบ (GENERAL CONTRACTOR NOTES):', 96, notesY + 22);

    ctx.fillStyle = '#334155';
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillText('1. ระยะทางเดินหลัก (Circulation Clearance) ต้องไม่น้อยกว่า 1.20 - 1.50 ม. ตามมาตรฐานความปลอดภัยอาคารพาณิชย์', 96, notesY + 40);
    ctx.fillText('2. จุดเต้ารับไฟฟ้า 220V 16A เต้ารับคู่ 3 ขา มีระบบกราวด์ (Grounding <= 5 Ohm) ต่อคอมพิวเตอร์ 1:1 พร้อมแยกสาย LAN Cat6A ห่างจากสายไฟฟ้า 30 ซม.', 96, notesY + 56);

    // 9. Trigger Direct Browser Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `GSPEED-Contractor-Blueprint-${roomWidth}x${roomHeight}m-${Date.now().toString().slice(-4)}.png`;
    link.href = dataUrl;
    link.click();
  };

  const selectedItemObject = placedItems.find(item => item.id === selectedItemId);

  return (
    <div className="franchise-planner-page">
      {/* 1. TOP HEADER & WORKFLOW TABS */}
      <section className="planner-header-section">
        <div className="container">
          <div className="planner-title-row">
            <div>
              <div className="badge-pill badge-cyan">
                <Calculator size={14} />
                <span>INTERIOR 2D ESTIMATOR & CONFIGURATOR</span>
              </div>
              <h1 className="section-title">
                ระบบจำลองผังร้าน & <span className="text-blue">คำนวณราคาแฟรนไชส์</span>
              </h1>
              <p className="section-subtitle">
                บอกขนาดพื้นที่ เลือกสเปกคอมพิวเตอร์ และลากวางโซนในร้านตามจินตนาการ พร้อมรับใบเสนอราคาและแผนระยะเวลาติดตั้งทันที
              </p>
            </div>

            <div className="planner-quick-actions">
              <button 
                id="btn-open-quote-summary"
                onClick={() => setShowQuotationModal(true)} 
                className="btn-primary quote-summary-cta-btn"
              >
                <Download size={18} />
                <span>สรุปใบเสนอราคา & สเปก</span>
              </button>
            </div>
          </div>

          {/* Workflow Stepper Bar */}
          <div className="workflow-stepper">
            <button 
              id="step-tab-1"
              onClick={() => setCurrentStep(1)} 
              className={`step-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
            >
              <div className="step-number">1</div>
              <div className="step-text">
                <span className="step-name">ข้อมูลพื้นที่ & ทำเล</span>
                <span className="step-hint">{roomWidth} x {roomHeight} ม. ({roomAreaSqM} ตร.ม.)</span>
              </div>
              <ChevronRight size={18} className="step-arrow" />
            </button>

            <button 
              id="step-tab-2"
              onClick={() => setCurrentStep(2)} 
              className={`step-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
            >
              <div className="step-number">2</div>
              <div className="step-text">
                <span className="step-name">จัดผังร้าน 3D Studio & แปลน 2D</span>
                <span className="step-hint">ลงคอม {totalStations} เครื่อง ({placedItems.length} ชิ้น)</span>
              </div>
              <ChevronRight size={18} className="step-arrow" />
            </button>

            <button 
              id="step-tab-3"
              onClick={() => setCurrentStep(3)} 
              className={`step-item ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}
            >
              <div className="step-number">3</div>
              <div className="step-text">
                <span className="step-name">เลือกระดับสเปกฮาร์ดแวร์</span>
                <span className="step-hint">{currentTierInfo.name.split(':')[1]}</span>
              </div>
              <ChevronRight size={18} className="step-arrow" />
            </button>

            <button 
              id="step-tab-4"
              onClick={() => setCurrentStep(4)} 
              className={`step-item ${currentStep === 4 ? 'active' : ''}`}
            >
              <div className="step-number">4</div>
              <div className="step-text">
                <span className="step-name">สรุปงบ & คืนทุน (ROI)</span>
                <span className="step-hint">{paybackMonths} เดือนคืนทุน</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 2. STEP 1: LOCATION & ROOM SETUP */}
      {currentStep === 1 && (
        <section className="step-content-section container">
          {/* ARCHITECTURAL BLUEPRINT UPLOAD & AI CALCULATION SECTION */}
          <div className="blueprint-upload-card glass-panel">
            <div className="blueprint-header-row">
              <div className="blueprint-title-group">
                <div className="badge-pill badge-cyan">
                  <Sparkles size={14} />
                  <span>NEW • AI BLUEPRINT ENGINE & SMART FEASIBILITY</span>
                </div>
                <h3 className="blueprint-main-title">
                  แนบแผนผัง / พิมพ์เขียวอาคารของคุณเพื่อคำนวณและออกแบบอัตโนมัติ
                </h3>
                <p className="blueprint-desc">
                  มีแปลนอาคารของตัวเองอยู่แล้ว? อัปโหลดภาพผังร้าน (Floor Plan) ของท่าน ระบบจะช่วยคำนวณสัดส่วนพื้นที่, จำแนกโซนการใช้งาน, แนะนำจำนวนเครื่องที่เหมาะสม และส่งเข้าไปในสตูดิโอ 3D ให้คุณวางตำแหน่งโต๊ะคอมได้ทันที!
                </p>
              </div>

              <div className="blueprint-upload-actions">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />
                <button 
                  id="btn-upload-own-blueprint"
                  className="btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzingBlueprint}
                >
                  <UploadCloud size={16} />
                  <span>แนบไฟล์ผังร้านของคุณ (PNG / JPG)</span>
                </button>
                <button 
                  id="btn-demo-blueprint"
                  className="btn-secondary"
                  onClick={handleUseSampleBlueprint}
                  disabled={isAnalyzingBlueprint}
                >
                  <Sparkles size={16} />
                  <span>ทดลองใช้ตัวอย่างแปลนคอมเพล็กซ์</span>
                </button>
              </div>
            </div>

            {/* If analyzing blueprint spinner */}
            {isAnalyzingBlueprint && (
              <div className="blueprint-analyzing-spinner">
                <RefreshCw size={24} className="spin-icon text-cyan" />
                <span>AI กำลังประมวลผลแปลนอาคาร วิเคราะห์พื้นที่ และจำแนกโซนร้านเกม...</span>
              </div>
            )}

            {/* When Blueprint is Attached */}
            {uploadedBlueprint && !isAnalyzingBlueprint && (
              <div className="blueprint-analysis-preview-grid">
                {/* Left: Blueprint Image Preview */}
                <div className="blueprint-image-box">
                  <div className="blueprint-image-tag">
                    <CheckCircle2 size={14} className="text-emerald" />
                    <span>แนบแปลน: {uploadedBlueprint.name} ({uploadedBlueprint.size})</span>
                  </div>
                  <div className="blueprint-img-frame">
                    <img src={uploadedBlueprint.url} alt="Floor Plan Blueprint Preview" />
                  </div>
                  <div className="blueprint-image-actions">
                    <button className="btn-text-danger" onClick={handleRemoveBlueprint}>
                      <Trash2 size={14} /> ลบแปลนนี้
                    </button>
                    <button className="btn-text-blue" onClick={() => fileInputRef.current?.click()}>
                      <RotateCw size={14} /> เปลี่ยนไฟล์ใหม่
                    </button>
                  </div>
                </div>

                {/* Right: AI Feasibility & Zone Allocation Breakdown */}
                <div className="blueprint-feasibility-details">
                  <div className="feasibility-headline">
                    <div className="kpi-tag success">ตรวจพบขนาด: {uploadedBlueprint.dimensions}</div>
                    <h4>ผลการวิเคราะห์และจัดสรรโซนอัจฉริยะ</h4>
                  </div>

                  <div className="zones-breakdown-grid">
                    {uploadedBlueprint.detectedZones.map((zone, idx) => (
                      <div key={idx} className="zone-pill-item">
                        <div className="zone-color-bar" style={{ backgroundColor: zone.color }}></div>
                        <div className="zone-info">
                          <strong>{zone.name}</strong>
                          <div className="zone-meta">
                            <span>พื้นที่: {zone.area}</span>
                            <span className="bullet">•</span>
                            <span className="zone-capacity text-cyan">{zone.stations}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="blueprint-calc-summary">
                    <div className="calc-stat-box">
                      <span className="lbl">ความจุเครื่องที่แนะนำ:</span>
                      <strong className="val text-cyan">{uploadedBlueprint.recommendedStations} เครื่อง</strong>
                    </div>
                    <div className="calc-stat-box">
                      <span className="lbl">งบประมาณประเมินการ:</span>
                      <strong className="val text-blue">฿{uploadedBlueprint.estimatedCapex.toLocaleString()}</strong>
                    </div>
                    <div className="calc-stat-box">
                      <span className="lbl">กำไรสุทธิคาดการณ์:</span>
                      <strong className="val text-emerald">฿{uploadedBlueprint.estimatedMonthlyProfit.toLocaleString()} / ด.</strong>
                    </div>
                    <div className="calc-stat-box">
                      <span className="lbl">จุดคุ้มทุน (ROI):</span>
                      <strong className="val text-purple">~{uploadedBlueprint.paybackMonths} เดือน</strong>
                    </div>
                  </div>

                  <div className="blueprint-cta-row">
                    <button 
                      id="btn-apply-blueprint-to-studio"
                      className="btn-primary btn-large"
                      onClick={() => setCurrentStep(2)}
                    >
                      <Layers size={18} />
                      <span>นำแปลนนี้เข้าสู่สตูดิโอ 3D / 2D เพื่อเริ่มวางผังร้าน</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="setup-grid">
            {/* Left Form: Size & Dimensions */}
            <div className="setup-card glass-panel">
              <h3 className="setup-card-title">
                <LayoutGrid size={20} className="text-cyan" />
                <span>กำหนดขนาดห้องและทำเลร้าน</span>
              </h3>
              <p className="setup-card-desc">
                กรอกขนาดพื้นที่จริงเพื่อใช้สร้าง Canvas จำลองผังร้านตามมาตราส่วน 1:1 หรือเลือกขนาด Preset สำเร็จรูป
              </p>

              {/* Preset Buttons */}
              <div className="preset-selector-group">
                <label className="form-label">เลือกโมเดลขนาดสำเร็จรูป (Preset Models):</label>
                <div className="preset-cards-grid">
                  {PRESET_ROOMS.map(preset => (
                    <div 
                      key={preset.id} 
                      className={`preset-card ${roomWidth === preset.width && roomHeight === preset.height ? 'selected' : ''}`}
                      onClick={() => handleLoadPreset(preset)}
                    >
                      <div className="preset-head">
                        <strong>{preset.name}</strong>
                        <span className="preset-dim">{preset.width}x{preset.height} ม.</span>
                      </div>
                      <p className="preset-info">{preset.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Sliders */}
              <div className="dimension-sliders">
                <div className="slider-group">
                  <div className="slider-header">
                    <label>ความกว้างห้อง (Width):</label>
                    <span className="slider-val text-cyan">{roomWidth} เมตร</span>
                  </div>
                  <input 
                    type="range" 
                    min="6" 
                    max="25" 
                    step="1" 
                    value={roomWidth} 
                    onChange={e => setRoomWidth(Number(e.target.value))}
                    className="custom-range"
                  />
                </div>

                <div className="slider-group">
                  <div className="slider-header">
                    <label>ความลึก/ความยาวห้อง (Length):</label>
                    <span className="slider-val text-cyan">{roomHeight} เมตร</span>
                  </div>
                  <input 
                    type="range" 
                    min="6" 
                    max="20" 
                    step="1" 
                    value={roomHeight} 
                    onChange={e => setRoomHeight(Number(e.target.value))}
                    className="custom-range"
                  />
                </div>
              </div>

              {/* Area Summary Pill */}
              <div className="area-summary-pill">
                <span>พื้นที่ใช้สอยรวม: <strong>{roomAreaSqM} ตารางเมตร</strong></span>
                <span>(รองรับได้ประมาณ <strong>{idealMaxPCs} เครื่อง</strong> แบบไม่อึดอัด)</span>
              </div>
            </div>

            {/* Right Form: Location & Theme */}
            <div className="setup-card glass-panel">
              <h3 className="setup-card-title">
                <Compass size={20} className="text-magenta" />
                <span>ข้อมูลทำเล & ธีมการตกแต่ง</span>
              </h3>

              <div className="form-group">
                <label className="form-label">จังหวัด / โซนที่ตั้งร้าน</label>
                <select 
                  value={storeLocation} 
                  onChange={e => setStoreLocation(e.target.value)}
                  className="form-select"
                >
                  <option>กรุงเทพฯ และปริมณฑล (ย่านมหาวิทยาลัย/ชุมชน)</option>
                  <option>เชียงใหม่ / ภาคเหนือ</option>
                  <option>ขอนแก่น / โคราช / ภาคอีสาน</option>
                  <option>ชลบุรี / พัทยา / ภาคตะวันออก</option>
                  <option>ภูเก็ต / สงขลา / ภาคใต้</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">ประเภทอาคาร / สถานที่</label>
                <select 
                  value={storeType} 
                  onChange={e => setStoreType(e.target.value)}
                  className="form-select"
                >
                  <option>อาคารพาณิชย์ 2-3 คูหา (Commercial Shophouse)</option>
                  <option>พื้นที่เช่าในศูนย์การค้า / ไลฟ์สไตล์มอลล์ (Shopping Mall)</option>
                  <option>อาคารเดี่ยว Standalone หรือโกดัง Renovate</option>
                  <option>ใกล้มหาวิทยาลัย / หอพักนักศึกษา</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">ธีมการตกแต่งร้าน (Interior Style)</label>
                <div className="theme-options-grid">
                  <div 
                    className={`theme-option ${selectedTheme === 'royal' ? 'active' : ''}`}
                    onClick={() => setSelectedTheme('royal')}
                  >
                    <div className="theme-color-bar royal-bar"></div>
                    <strong>G-Speed Royal Modern</strong>
                    <span>โทนขาว-น้ำเงิน มาตรฐานแบรนด์ GLP สว่าง สบายตา ทันสมัย</span>
                  </div>

                  <div 
                    className={`theme-option ${selectedTheme === 'luxury' ? 'active' : ''}`}
                    onClick={() => setSelectedTheme('luxury')}
                  >
                    <div className="theme-color-bar luxury-bar"></div>
                    <strong>Minimal Clean Luxury</strong>
                    <span>โทนขาว-เทาอ่อน ไฟ Warm White สะอาดตา หรูหรา เรียบหรู</span>
                  </div>

                  <div 
                    className={`theme-option ${selectedTheme === 'stealth' ? 'active' : ''}`}
                    onClick={() => setSelectedTheme('stealth')}
                  >
                    <div className="theme-color-bar stealth-bar"></div>
                    <strong>Stealth Pro Circuit</strong>
                    <span>ดำ-กราไฟต์ ดุดัน ไฟ Linear สีเดียว สไตล์นักกีฬา Pro Circuit</span>
                  </div>
                </div>
              </div>

              <div className="setup-actions">
                <button 
                  id="btn-step1-to-step2"
                  onClick={() => setCurrentStep(2)} 
                  className="btn-primary full-width"
                >
                  <span>ไปที่ขั้นตอนถัดไป: จัดวางผังร้าน 2D</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. STEP 2: 3D INTERIOR STUDIO & 2D FLOOR PLAN */}
      {currentStep === 2 && (
        <section className={`step-content-section container ${isPlannerFullscreen ? 'planner-fullscreen-mode' : ''}`}>
          {/* Top Control Bar: View Switcher & Material Customization */}
          <div className="planner-top-controls glass-panel">
            {/* View Mode Toggle */}
            <div className="view-mode-toggle-group">
              <span className="control-group-label">โหมดแสดงผล:</span>
              <div className="view-mode-btns">
                <button 
                  id="btn-view-mode-3d"
                  className={`btn-mode-switch ${viewMode === '3d' ? 'active' : ''}`}
                  onClick={() => setViewMode('3d')}
                >
                  <Box size={16} />
                  <span>3D Isometric Studio (สไตล์ Homestyler)</span>
                </button>
                <button 
                  id="btn-view-mode-2d"
                  className={`btn-mode-switch ${viewMode === '2d' ? 'active' : ''}`}
                  onClick={() => setViewMode('2d')}
                >
                  <LayoutGrid size={16} />
                  <span>2D Blueprint (แปลน 2 มิติ)</span>
                </button>
                <button 
                  type="button"
                  id="btn-toggle-fullscreen"
                  className={`btn-mode-switch btn-fullscreen-toggle ${isPlannerFullscreen ? 'active' : ''}`}
                  onClick={() => setIsPlannerFullscreen(!isPlannerFullscreen)}
                  title={isPlannerFullscreen ? 'ออกจากโหมดเต็มจอ (กด ESC ได้)' : 'เปิดสตูดิโอเต็มหน้าจอ (Zen Mode ไม่เลื่อนหรือหลุดสายตา)'}
                >
                  {isPlannerFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  <span>{isPlannerFullscreen ? 'ย่อหน้าต่าง (ESC)' : 'เปิดสตูดิโอเต็มจอ'}</span>
                </button>
              </div>
            </div>

            {/* Blueprint Overlay Controls (if blueprint is attached) */}
            {uploadedBlueprint && (
              <div className="blueprint-overlay-controls">
                <button 
                  id="btn-toggle-blueprint-overlay"
                  className={`btn-toggle-overlay ${showBlueprintOverlay ? 'active' : ''}`}
                  onClick={() => setShowBlueprintOverlay(!showBlueprintOverlay)}
                  title="เปิด/ปิดการแสดงผังแปลนที่แนบ"
                >
                  <SplitSquareVertical size={14} />
                  <span>แปลนอ้างอิง: {showBlueprintOverlay ? 'เปิดอยู่' : 'ปิด'}</span>
                </button>
                {showBlueprintOverlay && (
                  <div className="opacity-slider-box">
                    <span className="opacity-label">ความชัด: {Math.round(blueprintOpacity * 100)}%</span>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.05"
                      value={blueprintOpacity}
                      onChange={e => setBlueprintOpacity(parseFloat(e.target.value))}
                      className="mini-range"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Material & Finish Customization (Homestyler style) */}
            <div className="material-customizers-row">
              {/* Wallpaper / Wall Finish Selector */}
              <div className="material-selector-block">
                <div className="material-label">
                  <Palette size={14} className="text-blue" />
                  <span>วอลเปเปอร์ผนังร้าน:</span>
                </div>
                <div className="material-swatches">
                  {WALLPAPERS.map(wp => (
                    <button
                      key={wp.id}
                      id={`swatch-wall-${wp.id}`}
                      className={`swatch-btn ${selectedWallpaper === wp.id ? 'active' : ''}`}
                      onClick={() => setSelectedWallpaper(wp.id)}
                      title={`${wp.name} - ${wp.desc}`}
                    >
                      <span className="swatch-color-dot" style={{ backgroundColor: wp.color, border: '1px solid #cbd5e1' }} />
                      <span className="swatch-name">{wp.name.split(' ')[0]}</span>
                      {selectedWallpaper === wp.id && <Check size={12} className="swatch-check" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floor Material Selector */}
              <div className="material-selector-block">
                <div className="material-label">
                  <Layers size={14} className="text-blue" />
                  <span>วัสดุปูพื้นห้อง:</span>
                </div>
                <div className="material-swatches">
                  {FLOOR_MATERIALS.map(fl => (
                    <button
                      key={fl.id}
                      id={`swatch-floor-${fl.id}`}
                      className={`swatch-btn ${selectedFloorMaterial === fl.id ? 'active' : ''}`}
                      onClick={() => setSelectedFloorMaterial(fl.id)}
                      title={`${fl.name} - ${fl.desc}`}
                    >
                      <span className="swatch-color-dot floor-dot" style={{ backgroundColor: fl.color }} />
                      <span className="swatch-name">{fl.name.split(' ')[0]}</span>
                      {selectedFloorMaterial === fl.id && <Check size={12} className="swatch-check" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="planner-canvas-layout">
            {/* Left: Item Catalog Sidebar */}
            <div className="catalog-sidebar glass-panel">
              <div className="sidebar-header">
                <h3 className="sidebar-title">
                  <Layers size={18} className="text-cyan" />
                  <span>อุปกรณ์และโซนในร้าน</span>
                </h3>
                <span className="sidebar-subtitle">เลือกและเพิ่มลงในผัง 3D</span>
              </div>

              {/* Category Filter Tabs */}
              <div className="catalog-filter-tabs">
                <button 
                  className={`filter-tab ${catalogCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setCatalogCategory('all')}
                >
                  ทั้งหมด
                </button>
                <button 
                  className={`filter-tab ${catalogCategory === 'stations' ? 'active' : ''}`}
                  onClick={() => setCatalogCategory('stations')}
                >
                  โต๊ะคอม
                </button>
                <button 
                  className={`filter-tab ${catalogCategory === 'facilities' ? 'active' : ''}`}
                  onClick={() => setCatalogCategory('facilities')}
                >
                  บริการ/เคาน์เตอร์
                </button>
                <button 
                  className={`filter-tab ${catalogCategory === 'architectural' ? 'active' : ''}`}
                  onClick={() => setCatalogCategory('architectural')}
                >
                  ประตู/หน้าต่าง
                </button>
              </div>

              <div className="catalog-items-list">
                {catalogItems
                  .filter(item => {
                    if (catalogCategory === 'all') return true;
                    if (catalogCategory === 'stations') return item.category === 'stations' || item.category === 'vip' || item.category === 'stage';
                    if (catalogCategory === 'facilities') return item.category === 'facilities' || item.category === 'amenities';
                    if (catalogCategory === 'architectural') return item.category === 'architectural';
                    return true;
                  })
                  .map((item) => (
                    <div key={item.type} className="catalog-item-card">
                      <div className="catalog-item-top">
                        <div className="catalog-item-info">
                          <strong className="item-name">{item.name}</strong>
                          <span className="item-dim">
                            ขนาด 3D: {item.widthMeters} x {item.depth3D || item.heightMeters} ม. (สูง {item.height3D || 1.2}ม.)
                          </span>
                        </div>
                        <button 
                          id={`btn-add-item-${item.type}`}
                          className="btn-add-catalog"
                          onClick={() => handleAddItem(item)}
                          title="เพิ่มลงในผัง 3D"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      {/* Price Breakdown Micro-Badge */}
                      <div className="catalog-item-pricing-preview">
                        <span className="price-tag-badge">
                          รวม ฿{item.baseCost.toLocaleString()}
                        </span>
                        <span className="price-sub-badge">
                          โต๊ะ ฿{item.deskPrice?.toLocaleString()} {item.chairCount > 0 ? `| เก้าอี้ ${item.chairCount} ตัว` : ''}
                        </span>
                      </div>

                      <p className="catalog-item-desc">{item.desc}</p>
                    </div>
                  ))}
              </div>

              <div className="sidebar-footer-presets">
                <span className="sub-label">โมเดลผังร้านสำเร็จรูป:</span>
                <div className="preset-quick-btns">
                  {PRESET_ROOMS.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => handleLoadPreset(p)}
                      className="btn-mini-preset"
                    >
                      {p.name.split(':')[0]}
                    </button>
                  ))}
                  <button onClick={handleClearCanvas} className="btn-mini-clear" title="ล้างผังทั้งหมด">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Center: 3D Studio or 2D Canvas */}
            <div className="canvas-main-col">
              {/* Canvas Toolbar & Stats Header */}
              <div className="canvas-stats-toolbar glass-panel">
                <div className="canvas-stat-item">
                  <span className="stat-lbl">ขนาดห้อง:</span>
                  <span className="stat-val text-cyan">{roomWidth} x {roomHeight} ม. ({roomAreaSqM} ตร.ม.)</span>
                </div>
                <div className="canvas-stat-item">
                  <span className="stat-lbl">คอมพิวเตอร์ที่วางแล้ว:</span>
                  <span className="stat-val text-blue font-bold">{totalStations} เครื่อง</span>
                </div>
                <div className="canvas-stat-item">
                  <span className="stat-lbl">ชิ้นส่วนในผัง:</span>
                  <span className="stat-val">{placedItems.length} ชิ้น</span>
                </div>
                <div className="canvas-stat-item">
                  <span className="stat-lbl">สถานะระยะทางเดิน:</span>
                  {isOvercrowded ? (
                    <span className="stat-val status-warning text-amber">
                      <AlertTriangle size={14} /> หนาแน่นเกินไป
                    </span>
                  ) : (
                    <span className="stat-val status-good text-cyan">
                      <CheckCircle2 size={14} /> ได้มาตรฐาน ปลอดภัย
                    </span>
                  )}
                </div>
                <button 
                  type="button" 
                  id="btn-export-blueprint-toolbar"
                  className="btn-toolbar-blueprint-export"
                  onClick={handleExportBlueprintImage}
                  title="ส่งออกภาพแปลนสถาปัตยกรรมสำหรับช่าง (PNG)"
                >
                  <Download size={14} />
                  <span>แปลนช่าง (PNG)</span>
                </button>
                <button 
                  type="button"
                  id="btn-toolbar-fullscreen-toggle"
                  className={`btn-toolbar-fullscreen ${isPlannerFullscreen ? 'active' : ''}`}
                  onClick={() => setIsPlannerFullscreen(!isPlannerFullscreen)}
                  title={isPlannerFullscreen ? 'ออกจากโหมดเต็มจอ (กด ESC ได้)' : 'เปิดสตูดิโอเต็มหน้าจอ (Zen Mode)'}
                >
                  {isPlannerFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  <span>{isPlannerFullscreen ? 'ย่อหน้าต่าง (ESC)' : 'ขยายเต็มจอ (Zen Mode)'}</span>
                </button>
              </div>

              {/* Viewport: 3D Studio or 2D Blueprint */}
              {viewMode === '3d' ? (
                <Room3DStudio
                  roomWidth={roomWidth}
                  roomHeight={roomHeight}
                  placedItems={placedItems}
                  selectedItemId={selectedItemId}
                  onSelectItem={(id) => setSelectedItemId(id)}
                  selectedWallpaper={selectedWallpaper}
                  selectedFloorMaterial={selectedFloorMaterial}
                  blueprintUrl={uploadedBlueprint?.url}
                  blueprintOpacity={showBlueprintOverlay ? blueprintOpacity : 0}
                  onRotateItem={handleRotateItem}
                  onDuplicateItem={handleDuplicateItem}
                  onDeleteItem={handleDeleteItem}
                  onNudgeItem={handleNudgeItem}
                  isPlannerFullscreen={isPlannerFullscreen}
                  onToggleFullscreen={() => setIsPlannerFullscreen(!isPlannerFullscreen)}
                />
              ) : (
                <div 
                  className="floorplan-canvas-wrapper" 
                  ref={canvasContainerRef}
                  onClick={() => setSelectedItemId(null)}
                >
                  {/* Floating 2D Controls Bar */}
                  <div className="floorplan-floating-controls" onClick={e => e.stopPropagation()}>
                    <button 
                      type="button" 
                      className="btn-floorplan-ctrl" 
                      onClick={() => setPixelsPerMeter(p => Math.min(p + 5, 80))} 
                      title="ซูมขยายแปลน (+)"
                    >
                      <ZoomIn size={15} />
                    </button>
                    <button 
                      type="button" 
                      className="btn-floorplan-ctrl" 
                      onClick={() => setPixelsPerMeter(p => Math.max(p - 5, 25))} 
                      title="ซูมย่อแปลน (-)"
                    >
                      <ZoomOut size={15} />
                    </button>
                    <button 
                      type="button" 
                      className="btn-floorplan-ctrl" 
                      onClick={handleExportBlueprintImage} 
                      title="ส่งออกภาพแปลนสถาปัตยกรรมสำหรับช่าง (PNG)"
                    >
                      <Download size={15} />
                    </button>
                    <button 
                      type="button" 
                      className={`btn-floorplan-ctrl ${isPlannerFullscreen ? 'active text-cyan' : ''}`} 
                      onClick={() => setIsPlannerFullscreen(!isPlannerFullscreen)} 
                      title={isPlannerFullscreen ? 'ย่อหน้าต่าง (ESC)' : 'เปิดสตูดิโอ 2D เต็มจอ (Zen Mode)'}
                    >
                      {isPlannerFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                    </button>
                  </div>

                  <div 
                    className="floorplan-room-box"
                    ref={roomBoxRef}
                    style={{
                      width: `${roomWidth * pixelsPerMeter}px`,
                      height: `${roomHeight * pixelsPerMeter}px`,
                      backgroundSize: `${pixelsPerMeter}px ${pixelsPerMeter}px`
                    }}
                  >
                    {/* Blueprint Image Overlay Tracing Layer */}
                    {uploadedBlueprint?.url && showBlueprintOverlay && (
                      <img 
                        src={uploadedBlueprint.url} 
                        alt="Architectural Blueprint Tracing Overlay" 
                        className="blueprint-canvas-overlay"
                        style={{ opacity: blueprintOpacity }}
                      />
                    )}

                    {/* Scale Labels */}
                    <div className="canvas-scale-marker top-marker">{roomWidth} เมตร</div>
                    <div className="canvas-scale-marker left-marker">{roomHeight} เมตร</div>
                    <div className="entrance-label">
                      <DoorOpen size={14} />
                      <span>ทางเข้าร้าน (MAIN ENTRANCE)</span>
                    </div>

                    {/* Placed Items */}
                    {placedItems.map((item) => {
                      const isSelected = item.id === selectedItemId;
                      const isDragging = draggingItemId === item.id;
                      const isRotated = item.rotation === 90 || item.rotation === 270;
                      const itemWidthPx = (isRotated ? (item.catalog?.heightMeters || 1) : (item.catalog?.widthMeters || 1)) * pixelsPerMeter;
                      const itemHeightPx = (isRotated ? (item.catalog?.widthMeters || 1) : (item.catalog?.heightMeters || 1)) * pixelsPerMeter;

                      return (
                        <div
                          key={item.id}
                          id={`placed-${item.id}`}
                          onMouseDown={(e) => handleMouseDown(e, item)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItemId(item.id);
                          }}
                          className={`floorplan-item ${isSelected ? 'selected-item' : ''} ${isDragging ? 'is-dragging' : ''} ${justAddedId === item.id ? 'just-added-pulse' : ''} type-${item.type}`}
                          style={{
                            left: `${item.x * pixelsPerMeter}px`,
                            top: `${item.y * pixelsPerMeter}px`,
                            width: `${itemWidthPx}px`,
                            height: `${itemHeightPx}px`,
                            borderColor: item.catalog?.color || '#1d4ed8'
                          }}
                        >
                          {/* Visual details inside item */}
                          <div className="item-inner-content">
                            <div className="item-icon-tag" style={{ color: item.catalog?.color || '#1d4ed8' }}>
                              {item.catalog?.seats > 0 ? `${item.catalog.seats} PCs` : item.catalog?.name?.split(' ')[0]}
                            </div>

                            {/* Station Seats Visual Dots */}
                            {item.catalog?.seats > 0 && (
                              <div className="seat-dots-row">
                                {Array.from({ length: Math.min(item.catalog.seats, 10) }).map((_, i) => (
                                  <span key={i} className="seat-dot" style={{ background: item.catalog?.color || '#1d4ed8' }}></span>
                                ))}
                              </div>
                            )}

                            <div className="item-dimension-tag">
                              {item.catalog?.widthMeters}x{item.catalog?.heightMeters}m
                            </div>

                            <div className="item-drag-handle" title="คลิกเลือก หรือลากเพื่อย้ายตำแหน่ง">
                              <Move size={10} />
                              <span>{isSelected ? 'กำลังเลือก (ลาก/ลูกศร)' : 'คลิก/ลากย้าย'}</span>
                            </div>

                            {justAddedId === item.id && (
                              <div className="just-added-badge">
                                <span>ชิ้นใหม่! ลากจัดผังได้เลย</span>
                              </div>
                            )}
                          </div>

                          {/* On-item action buttons & D-Pad if selected */}
                          {isSelected && (
                            <div 
                              className={`floorplan-selected-pill ${item.y < 1.2 ? 'pos-bottom' : 'pos-top'}`} 
                              onClick={e => e.stopPropagation()}
                            >
                              <div className="pill-nudge-cluster" title="กดเพื่อเลื่อนตำแหน่ง (หรือใช้ปุ่มลูกศร ↑ ↓ ← → บนคีย์บอร์ด)">
                                <button 
                                  type="button" 
                                  className="pill-nudge-btn" 
                                  title="เลื่อนซ้าย 0.2ม. (กด ←)"
                                  onClick={() => handleNudgeItem(item.id, -0.2, 0)}
                                >
                                  <ChevronLeft size={13} />
                                </button>
                                <button 
                                  type="button" 
                                  className="pill-nudge-btn" 
                                  title="เลื่อนขึ้น 0.2ม. (กด ↑)"
                                  onClick={() => handleNudgeItem(item.id, 0, -0.2)}
                                >
                                  <ChevronUp size={13} />
                                </button>
                                <button 
                                  type="button" 
                                  className="pill-nudge-btn" 
                                  title="เลื่อนลง 0.2ม. (กด ↓)"
                                  onClick={() => handleNudgeItem(item.id, 0, 0.2)}
                                >
                                  <ChevronDown size={13} />
                                </button>
                                <button 
                                  type="button" 
                                  className="pill-nudge-btn" 
                                  title="เลื่อนขวา 0.2ม. (กด →)"
                                  onClick={() => handleNudgeItem(item.id, 0.2, 0)}
                                >
                                  <ChevronRight size={13} />
                                </button>
                              </div>
                              <div className="pill-divider" />
                              <button 
                                type="button" 
                                className="pill-action-btn" 
                                title="หมุน 90 องศา (กด R)"
                                onClick={() => handleRotateItem(item.id)}
                              >
                                <RotateCw size={12} />
                                <span>หมุน</span>
                              </button>
                              <button 
                                type="button" 
                                className="pill-action-btn" 
                                title="คัดลอกโมดูล"
                                onClick={() => handleDuplicateItem(item.id)}
                              >
                                <Copy size={12} />
                              </button>
                              <button 
                                type="button" 
                                className="pill-action-btn delete-btn" 
                                title="ลบออก (กด Delete)"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 2D Canvas Shortcuts Strip */}
                  <div className="canvas-shortcut-pill">
                    <span className="shortcut-tag"><strong>คลิกลาก</strong> ย้ายอิสระ</span>
                    <span className="shortcut-sep">•</span>
                    <span className="shortcut-tag">ลูกศร <strong>[↑] [↓] [←] [→]</strong> บนคีย์บอร์ด</span>
                    <span className="shortcut-sep">•</span>
                    <span className="shortcut-tag"><strong>[R]</strong> หมุน 90°</span>
                    <span className="shortcut-sep">•</span>
                    <span className="shortcut-tag"><strong>[Del]</strong> ลบ</span>
                  </div>
                </div>
              )}

              {/* Canvas Guidance Notes */}
              <div className="canvas-guidance-bar">
                <div className="guidance-tip">
                  <Info size={15} className="text-blue" />
                  <span>
                    <strong>การควบคุม:</strong> หมุนมุมมองอิสระ 360° ด้วยเมาส์ซ้าย • ซูมเข้า-ออกด้วยลูกกลิ้ง • คลิกเลือกวัตถุเพื่อดูราคาโต๊ะและเก้าอี้
                  </span>
                </div>
                <div className="guidance-btns">
                  <button onClick={() => setCurrentStep(1)} className="btn-secondary">
                    ย้อนกลับไปตั้งขนาด
                  </button>
                  <button 
                    id="btn-step2-to-step3"
                    onClick={() => setCurrentStep(3)} 
                    className="btn-primary"
                  >
                    <span>เลือกสเปกคอมพิวเตอร์ ({totalStations} เครื่อง)</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Selected Item Inspector & Cost Breakdown Panel */}
            <div className="inspector-sidebar glass-panel">
              {/* Selected Item Detail Inspector */}
              {selectedItemObject ? (
                <div className="selected-item-inspector-expanded">
                  <div className="insp-head">
                    <span className="badge-pill badge-blue">
                      <Box size={13} />
                      <span>โมดูลที่เลือก</span>
                    </span>
                    <h4>{selectedItemObject.catalog?.name}</h4>
                  </div>

                  {/* Component Breakdown Card: Desk vs Chair */}
                  <div className="component-breakdown-card">
                    <div className="breakdown-section-title">
                      <span>รายละเอียดราคาอุปกรณ์ในโมดูล</span>
                    </div>

                    {/* Desk Price Breakdown */}
                    <div className="component-spec-box desk-box">
                      <div className="spec-box-header">
                        <span className="box-title">โต๊ะและโครงสร้าง</span>
                        <strong className="box-price text-blue">
                          ฿{selectedItemObject.catalog?.deskPrice?.toLocaleString()}
                        </strong>
                      </div>
                      <p className="box-desc">{selectedItemObject.catalog?.deskDesc}</p>
                    </div>

                    {/* Chair Model & Price Breakdown */}
                    <div className="component-spec-box chair-box">
                      <div className="spec-box-header">
                        <span className="box-title">เก้าอี้เกมมิ่ง / ที่นั่ง</span>
                        <strong className="box-price text-blue">
                          {selectedItemObject.catalog?.chairCount > 0 
                            ? `฿${((selectedItemObject.catalog?.chairPrice || 0) * (selectedItemObject.catalog?.chairCount || 0)).toLocaleString()}`
                            : 'ไม่มี'}
                        </strong>
                      </div>
                      <div className="chair-detail-row">
                        <span className="chair-model-name">
                          {selectedItemObject.catalog?.chairModel}
                        </span>
                        {selectedItemObject.catalog?.chairCount > 0 && (
                          <span className="chair-count-badge">
                            {selectedItemObject.catalog?.chairCount} ตัว (฿{selectedItemObject.catalog?.chairPrice?.toLocaleString()}/ตัว)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3D Physical Dimensions */}
                    <div className="component-spec-box dimensions-box">
                      <div className="spec-box-header">
                        <span className="box-title">มิติขนาด (กว้าง x ลึก x สูง)</span>
                      </div>
                      <div className="dimensions-pills">
                        <span className="dim-tag">กว้าง: {selectedItemObject.catalog?.widthMeters} ม.</span>
                        <span className="dim-tag">ลึก: {selectedItemObject.catalog?.depth3D || selectedItemObject.catalog?.heightMeters} ม.</span>
                        <span className="dim-tag">สูง: {selectedItemObject.catalog?.height3D || 1.25} ม.</span>
                      </div>
                    </div>

                    {/* Total Module Price */}
                    <div className="total-module-price-row">
                      <span>ราคารวมโมดูลนี้:</span>
                      <strong className="text-blue font-bold">
                        ฿{selectedItemObject.catalog?.baseCost?.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* Placement & Spatial Controls */}
                  <div className="spatial-controls-card">
                    <div className="spatial-title">
                      <Move size={14} className="text-blue" />
                      <span>การจัดวางตำแหน่งในห้อง</span>
                    </div>
                    <div className="coords-info">
                      <span>X: {selectedItemObject.x.toFixed(1)} ม.</span>
                      <span>Y: {selectedItemObject.y.toFixed(1)} ม.</span>
                      <span>มุมหมุน: {selectedItemObject.rotation}°</span>
                    </div>

                    {/* Nudge Buttons Grid */}
                    <div className="nudge-buttons-grid">
                      <button 
                        className="btn-nudge" 
                        onClick={() => handleNudgeItem(selectedItemObject.id, 0, -0.5)}
                        title="เลื่อนขึ้น 0.5 ม."
                      >
                        <ChevronUp size={16} />
                      </button>
                      <div className="nudge-middle-row">
                        <button 
                          className="btn-nudge" 
                          onClick={() => handleNudgeItem(selectedItemObject.id, -0.5, 0)}
                          title="เลื่อนซ้าย 0.5 ม."
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button 
                          className="btn-nudge rotate-nudge" 
                          onClick={() => handleRotateItem(selectedItemObject.id)}
                          title="หมุน 90 องศา"
                        >
                          <RotateCw size={14} />
                        </button>
                        <button 
                          className="btn-nudge" 
                          onClick={() => handleNudgeItem(selectedItemObject.id, 0.5, 0)}
                          title="เลื่อนขวา 0.5 ม."
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      <button 
                        className="btn-nudge" 
                        onClick={() => handleNudgeItem(selectedItemObject.id, 0, 0.5)}
                        title="เลื่อนลง 0.5 ม."
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="insp-actions-row">
                    <button 
                      onClick={() => handleDuplicateItem(selectedItemObject.id)} 
                      className="btn-secondary btn-sm"
                    >
                      <Copy size={14} />
                      <span>คัดลอกโมดูล</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(selectedItemObject.id)} 
                      className="btn-secondary btn-sm text-red"
                    >
                      <Trash2 size={14} />
                      <span>ลบออกจากผัง</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-item-selected-state">
                  <div className="empty-selection-icon">
                    <MousePointerClick size={28} className="text-blue" />
                  </div>
                  <h4>เลือกดูหรือปรับตำแหน่งชิ้นส่วน</h4>
                  <p>คลิกที่โต๊ะบนผัง 2D/3D หรือเลือกจากรายการด้านล่าง เพื่อเลื่อนตำแหน่ง หมุน หรือคัดลอก</p>

                  {/* Quick Item Picker List */}
                  {placedItems.length > 0 && (
                    <div className="quick-items-card">
                      <div className="quick-items-header">
                        <span className="quick-title">โต๊ะและโซนในห้อง ({placedItems.length} ชิ้น):</span>
                      </div>
                      <div className="quick-items-scrollable">
                        {placedItems.map((item, idx) => (
                          <button
                            key={item.id}
                            type="button"
                            className="quick-item-select-btn"
                            onClick={() => setSelectedItemId(item.id)}
                            title="คลิกเพื่อเลือกและจัดตำแหน่งโต๊ะนี้ทันที"
                          >
                            <span className="quick-item-num">#{idx + 1}</span>
                            <span className="quick-item-name">{item.catalog?.name || item.type}</span>
                            <span className="quick-item-pill">
                              {item.catalog?.seats > 0 ? `${item.catalog.seats} PCs` : `${item.catalog?.widthMeters}x${item.catalog?.heightMeters}ม.`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Current Active Materials Badge */}
                  <div className="active-materials-summary">
                    <div className="mat-summary-row">
                      <span className="mat-key">วอลเปเปอร์:</span>
                      <strong className="mat-val">
                        {WALLPAPERS.find(w => w.id === selectedWallpaper)?.name}
                      </strong>
                    </div>
                    <div className="mat-summary-row">
                      <span className="mat-key">วัสดุปูพื้น:</span>
                      <strong className="mat-val">
                        {FLOOR_MATERIALS.find(f => f.id === selectedFloorMaterial)?.name}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="inspector-divider"></div>

              {/* Overall Estimated Cost Summary */}
              <div className="mini-cost-summary">
                <h4 className="summary-title">
                  <DollarSign size={16} className="text-blue" />
                  <span>สรุปงบลงทุนเบื้องต้น</span>
                </h4>
                <div className="cost-row">
                  <span>ฮาร์ดแวร์ ({totalStations} เครื่อง):</span>
                  <strong>฿{hardwareCost.toLocaleString()}</strong>
                </div>
                <div className="cost-row">
                  <span>โต๊ะ เก้าอี้ และห้อง VIP:</span>
                  <strong>฿{furnitureItemsCost.toLocaleString()}</strong>
                </div>
                <div className="cost-row">
                  <span>งานตกแต่ง Interior ({roomAreaSqM} ตร.ม.):</span>
                  <strong>฿{interiorDecorCost.toLocaleString()}</strong>
                </div>
                <div className="cost-row">
                  <span>ระบบแอร์ & ระบายอากาศ:</span>
                  <strong>฿{airconCost.toLocaleString()}</strong>
                </div>
                <div className="cost-row">
                  <span>Diskless Server & 10G Network:</span>
                  <strong>฿{(disklessCost + networkCost).toLocaleString()}</strong>
                </div>
                <div className="cost-row">
                  <span>ค่าแฟรนไชส์ & สิทธิ์การใช้แบรนด์:</span>
                  <strong>฿{franchiseLicenseCost.toLocaleString()}</strong>
                </div>

                <div className="cost-divider"></div>

                <div className="total-cost-box">
                  <span className="total-cost-label">งบประมาณลงทุนรวมโดยประมาณ:</span>
                  <div className="total-cost-number text-blue font-bold">
                    ฿{totalInvestmentCost.toLocaleString()}
                  </div>
                  <span className="total-cost-note">* รวมฮาร์ดแวร์ ตกแต่ง และเปิดร้านพร้อมใช้งาน</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. STEP 3: HARDWARE & SPEC SELECTION */}
      {currentStep === 3 && (
        <section className="step-content-section container">
          <div className="section-header-center">
            <div className="badge-pill badge-blue">
              <Cpu size={14} />
              <span>HARDWARE SPEC & GEAR SELECTION</span>
            </div>
            <h2 className="section-title">
              เลือกระดับสเปกคอมพิวเตอร์ <span className="text-blue">สำหรับทั้งร้าน</span>
            </h2>
            <p className="section-subtitle max-w-700">
              จำนวนเครื่องในผังของคุณปัจจุบันคือ <strong>{totalStations} เครื่อง</strong> สามารถเลือก Tier สเปกที่เหมาะสมกับกลุ่มลูกค้าและงบประมาณลงทุน
            </p>
          </div>

          <div className="tiers-grid">
            {Object.entries(hardwareTiers).map(([key, tier]) => {
              const isCurrent = selectedTier === key;
              const tierTotal = totalStations * (tier.unitCost || 0);

              return (
                <div 
                  key={key} 
                  className={`tier-card glass-panel ${isCurrent ? 'tier-active' : ''}`}
                  onClick={() => setSelectedTier(key)}
                >
                  {isCurrent && <div className="tier-badge-selected">SELECTED TIER</div>}
                  <div className="tier-header">
                    <h3 className="tier-name">{tier.name}</h3>
                    <p className="tier-tagline">{tier.tagline}</p>
                    <div className="tier-price-tag">
                      <span className="price-num">฿{tier.unitCost.toLocaleString()}</span>
                      <span className="price-unit">/ เครื่อง (ครบชุด)</span>
                    </div>
                    <div className="tier-total-badge">
                      รวม {totalStations} เครื่อง: ฿{tierTotal.toLocaleString()}
                    </div>
                  </div>

                  <div className="tier-specs-list">
                    <div className="tier-spec-item">
                      <Cpu size={16} className="text-blue" />
                      <div>
                        <strong>CPU:</strong> {tier.cpu}
                      </div>
                    </div>
                    <div className="tier-spec-item">
                      <Zap size={16} className="text-blue" />
                      <div>
                        <strong>GPU:</strong> {tier.gpu}
                      </div>
                    </div>
                    <div className="tier-spec-item">
                      <Layers size={16} className="text-blue" />
                      <div>
                        <strong>RAM:</strong> {tier.ram}
                      </div>
                    </div>
                    <div className="tier-spec-item">
                      <Monitor size={16} className="text-blue" />
                      <div>
                        <strong>Monitor:</strong> {tier.monitor}
                      </div>
                    </div>
                    <div className="tier-spec-item">
                      <Gamepad2 size={16} className="text-blue" />
                      <div>
                        <strong>Gaming Gear:</strong> {tier.gear}
                      </div>
                    </div>
                    <div className="tier-spec-item">
                      <Armchair size={16} className="text-blue" />
                      <div>
                        <strong>Chair:</strong> {tier.chair}
                      </div>
                    </div>
                  </div>

                  <button 
                    id={`btn-select-tier-${key}`}
                    className={isCurrent ? 'btn-primary full-width' : 'btn-secondary full-width'}
                    onClick={(e) => { e.stopPropagation(); setSelectedTier(key); }}
                  >
                    {isCurrent ? <Check size={16} /> : null}
                    <span>{isCurrent ? 'เลือกสเปกนี้แล้ว' : 'เลือกใช้สเปกนี้'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Fixed Infrastructure Showcase */}
          <div className="infra-showcase-panel glass-panel">
            <h3 className="infra-title">
              <Server size={20} className="text-cyan" />
              <span>ระบบเซิร์ฟเวอร์แม่ข่าย & เครือข่าย (Included Infrastructure)</span>
            </h3>
            <div className="infra-grid">
              <div className="infra-item">
                <strong>Diskless Server 10Gbps Master:</strong>
                <span>แม่ข่าย NVMe Enterprise 2 เครื่อง รันเกม 200+ เกม ไม่ต้องลงเกมทีละเครื่อง อัปเดตแพทช์อัตโนมัติ 24 ชม.</span>
              </div>
              <div className="infra-item">
                <strong>Dual-WAN Fiber & Mikrotik:</strong>
                <span>ระบบสำรองเน็ต 2 เส้น อัตโนมัติ ป้องกันเน็ตหลุด ปิงนิ่งระดับ 1-3ms พร้อม Cisco Managed Switch 10G</span>
              </div>
              <div className="infra-item">
                <strong>Billing & Member POS System:</strong>
                <span>ระบบบริหารจัดการสมาชิก คิดเงิน คุมเวลาหน้าจอ และสั่งเครื่องดื่มผ่านโต๊ะคอมพิวเตอร์ มีแดชบอร์ดดูยอดขายบนมือถือ</span>
              </div>
            </div>

            <div className="step3-nav-actions">
              <button onClick={() => setCurrentStep(2)} className="btn-secondary">
                ย้อนกลับไปจัดผังร้าน
              </button>
              <button 
                id="btn-step3-to-step4"
                onClick={() => setCurrentStep(4)} 
                className="btn-primary"
              >
                <span>ดูสรุปงบประมาณและระยะเวลาคืนทุน (ROI)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. STEP 4: BUDGET BREAKDOWN, ROI & INSTALLATION TIMELINE */}
      {currentStep === 4 && (
        <section className="step-content-section container">
          {/* Top Summary Banner */}
          <div className="budget-hero-card glass-panel">
            <div className="budget-hero-left">
              <span className="badge-pill badge-blue">PROJECT SUMMARY</span>
              <h2 className="budget-hero-title">
                งบประมาณลงทุนรวม: <span className="text-blue">฿{totalInvestmentCost.toLocaleString()}</span>
              </h2>
              <p className="budget-hero-desc">
                ร้านขนาด {roomWidth} x {roomHeight} ม. ({roomAreaSqM} ตร.ม.) • คอมพิวเตอร์ {totalStations} เครื่อง • {currentTierInfo.name} • ธีม {selectedTheme.toUpperCase()}
              </p>
            </div>

            <div className="budget-hero-right">
              <div className="roi-stat-pill">
                <span className="roi-lbl">ระยะเวลาคืนทุนโดยประมาณ:</span>
                <strong className="roi-val text-blue">{paybackMonths} เดือน</strong>
                <span className="roi-sub">คาดการณ์กำไรสุทธิ ฿{Math.round(estimatedMonthlyNetProfit).toLocaleString()} / เดือน</span>
              </div>
              <button 
                id="btn-view-quotation-step4"
                onClick={() => setShowQuotationModal(true)} 
                className="btn-primary"
              >
                <Download size={16} />
                <span>ดูใบเสนอราคาแบบละเอียด (PDF Preview)</span>
              </button>
            </div>
          </div>

          <div className="budget-columns-grid">
            {/* Left: Detailed Cost Breakdown Table */}
            <div className="cost-table-card glass-panel">
              <h3 className="card-subheading">
                <DollarSign size={20} className="text-amber" />
                <span>แจกแจงรายการต้นทุน (Turnkey Breakdown)</span>
              </h3>

              <div className="cost-breakdown-list">
                <div className="cb-row header-row">
                  <span>หมวดหมู่งาน</span>
                  <span>รายละเอียด</span>
                  <span className="text-right">งบประมาณ</span>
                </div>

                <div className="cb-row">
                  <strong>1. เครื่องคอมพิวเตอร์ & เกมมิ่งเกียร์</strong>
                  <span>{totalStations} เครื่อง x ฿{currentTierInfo.unitCost.toLocaleString()} ({currentTierInfo.name.split(':')[1]})</span>
                  <strong className="text-right">฿{hardwareCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>2. เฟอร์นิเจอร์ & โซนพิเศษในผัง</strong>
                  <span>โต๊ะเกมมิ่ง, เก้าอี้, ห้อง VIP, เวที 5v5 ({placedItems.length} รายการ)</span>
                  <strong className="text-right">฿{furnitureItemsCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>3. ตกแต่งภายใน & ไฟ Linear Modern</strong>
                  <span>{roomAreaSqM} ตร.ม. x ฿{FIXED_INFRASTRUCTURE.interiorSqMeterCost} (พื้น, ผนังกันเสียง, ไฟ Linear)</span>
                  <strong className="text-right">฿{interiorDecorCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>4. งานระบบแอร์ Inverter</strong>
                  <span>{roomAreaSqM} ตร.ม. x ฿{FIXED_INFRASTRUCTURE.airconSqMeterCost} (แอร์ Cassette 4 ทิศทาง)</span>
                  <strong className="text-right">฿{airconCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>5. แม่ข่าย Diskless Server 10G</strong>
                  <span>Server แม่ข่าย NVMe 2 ชุด + คลังเกม 200+ เกม อัปเดตอัตโนมัติ</span>
                  <strong className="text-right">฿{disklessCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>6. เน็ตเวิร์ก Enterprise Dual-WAN</strong>
                  <span>Cisco 10G Switches, Mikrotik Router, สายแลน Shielded, ตู้ Rack</span>
                  <strong className="text-right">฿{networkCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>7. ซอฟต์แวร์ Billing & เครื่อง POS</strong>
                  <span>ระบบคุมเครื่อง, ลิ้นชักเก็บเงิน, สแกนเนอร์, ระบบสั่งอาหาร</span>
                  <strong className="text-right">฿{billingCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>8. ค่าแฟรนไชส์ & การอบรมเปิดร้าน</strong>
                  <span>สิทธิ์ใช้แบรนด์ G-Speed, แบบ 3D ก่อสร้าง, อบรมพนักงาน, การตลาดวันเปิดร้าน</span>
                  <strong className="text-right">฿{franchiseLicenseCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row total-row">
                  <strong>รวมงบประมาณลงทุนทั้งสิ้น (Turnkey Package):</strong>
                  <span>พร้อมเปิดให้บริการ</span>
                  <strong className="text-right text-blue font-large">฿{totalInvestmentCost.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Right: Interactive ROI Calculator */}
            <div className="roi-calculator-card glass-panel">
              <h3 className="card-subheading">
                <Sliders size={20} className="text-blue" />
                <span>จำลองรายได้ & ระยะเวลาคืนทุน (Interactive ROI)</span>
              </h3>

              <div className="roi-inputs">
                <div className="roi-input-group">
                  <div className="roi-label-row">
                    <label>อัตราค่าบริการ (บาท / ชั่วโมง):</label>
                    <span className="roi-val-badge text-blue">{hourlyRate} บาท/ชม.</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="60" 
                    step="5" 
                    value={hourlyRate}
                    onChange={e => setHourlyRate(Number(e.target.value))}
                    className="custom-range"
                  />
                </div>

                <div className="roi-input-group">
                  <div className="roi-label-row">
                    <label>อัตราการใช้งานเฉลี่ย (Occupancy Rate):</label>
                    <span className="roi-val-badge text-blue">{occupancyRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="30" 
                    max="90" 
                    step="5" 
                    value={occupancyRate}
                    onChange={e => setOccupancyRate(Number(e.target.value))}
                    className="custom-range"
                  />
                  <div className="range-hints">
                    <span>30% (น้อย)</span>
                    <span>60% (มาตรฐาน)</span>
                    <span>85% (ทำเลทอง)</span>
                  </div>
                </div>
              </div>

              {/* Monthly Breakdown Projection */}
              <div className="roi-projection-box">
                <div className="proj-row">
                  <span>รายได้ค่าชั่วโมงเล่นเกม (30 วัน):</span>
                  <strong>฿{Math.round(monthlyGamingRevenue).toLocaleString()} / ด.</strong>
                </div>
                <div className="proj-row">
                  <span>รายได้จำหน่ายเครื่องดื่ม & อาหารว่าง:</span>
                  <strong>฿{Math.round(monthlySnackRevenue).toLocaleString()} / ด.</strong>
                </div>
                <div className="proj-row highlight-income">
                  <span>รายรับรวมต่อเดือน (Gross Revenue):</span>
                  <strong className="text-blue">฿{Math.round(totalMonthlyRevenue).toLocaleString()} / ด.</strong>
                </div>

                <div className="cost-divider"></div>

                <div className="proj-row text-muted">
                  <span>ค่าไฟ & แอร์ประมาณการ:</span>
                  <span>-฿{Math.round(monthlyElectricity).toLocaleString()}</span>
                </div>
                <div className="proj-row text-muted">
                  <span>เงินเดือนพนักงาน (2-3 กะ):</span>
                  <span>-฿{Math.round(monthlyStaff).toLocaleString()}</span>
                </div>
                <div className="proj-row text-muted">
                  <span>ค่าอินเทอร์เน็ต & เบ็ดเตล็ด:</span>
                  <span>-฿{Math.round(monthlyInternetAndMisc).toLocaleString()}</span>
                </div>

                <div className="net-profit-card">
                  <div className="net-profit-left">
                    <span>กำไรสุทธิโดยประมาณ (Net Profit):</span>
                    <h4 className="net-profit-number text-blue">
                      ฿{Math.round(estimatedMonthlyNetProfit).toLocaleString()} <span className="per-month">/ เดือน</span>
                    </h4>
                  </div>
                  <div className="net-profit-right">
                    <span>คาดว่าจะคืนทุนใน:</span>
                    <h3 className="payback-badge text-blue">{paybackMonths} เดือน</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. INSTALLATION TIMELINE (GANTT STEPS) */}
          <div className="timeline-section glass-panel">
            <div className="timeline-head">
              <div className="badge-pill badge-amber">
                <Clock size={14} />
                <span>6-WEEK IMPLEMENTATION TIMELINE</span>
              </div>
              <h3 className="timeline-title">ระยะเวลาในการก่อสร้างและติดตั้ง (ประมาณ 6 สัปดาห์)</h3>
              <p className="timeline-desc">
                ขั้นตอนการดำเนินงานแบบ Turnkey ตั้งแต่สำรวจพื้นที่จนถึงวัน Grand Opening พร้อมเปิดให้บริการ
              </p>
            </div>

            <div className="timeline-steps-grid">
              {INSTALLATION_TIMELINE.map((item, idx) => (
                <div key={idx} className="timeline-step-card">
                  <div className="step-week-badge">{item.week}</div>
                  <h4 className="step-week-title">{item.title}</h4>
                  <ul className="step-tasks-list">
                    {item.tasks.map((task, tIdx) => (
                      <li key={tIdx}>
                        <Check size={14} className="text-blue" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4 Final CTA */}
          <div className="step4-footer-actions">
            <button onClick={() => setCurrentStep(2)} className="btn-secondary">
              กลับไปแก้ไขผังร้าน 2D
            </button>
            <button 
              type="button"
              onClick={handleExportBlueprintImage} 
              className="btn-secondary"
              title="ดาวน์โหลดภาพแปลนสำหรับช่างและผู้รับเหมา (PNG)"
            >
              <Download size={16} />
              <span>ส่งออกแปลนช่าง (PNG)</span>
            </button>
            <button 
              id="btn-final-lead-cta"
              onClick={() => setShowQuotationModal(true)} 
              className="btn-primary btn-large"
            >
              <Download size={18} />
              <span>พิมพ์ใบเสนอราคา & ส่งให้ทีมงานติดต่อกลับ</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}

      {/* MODAL: QUOTATION & PRINT PREVIEW & LEAD GENERATION */}
      {showQuotationModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-large glass-panel">
            <div className="modal-header">
              <div className="modal-header-left">
                <span className="badge-pill badge-blue">OFFICIAL ESTIMATED QUOTATION</span>
                <h3 className="modal-title">ใบเสนอราคาประเมินเบื้องต้น: แฟรนไชส์ G-SPEED ESPORT ARENA</h3>
              </div>
              <button className="btn-icon-close" onClick={() => setShowQuotationModal(false)}>
                <X size={20} />
              </button>
            </div>

            {showLeadSuccess ? (
              <div className="modal-success-state">
                <div className="success-icon-box">
                  <Check size={40} className="text-blue" />
                </div>
                <h3>บันทึกข้อมูลและส่งแปลนร้านเรียบร้อย!</h3>
                <p>ทีมวิศวกรและผู้เชี่ยวชาญแฟรนไชส์ของ G-Speed Arena จะตรวจสอบผังที่คุณออกแบบ และติดต่อกลับเพื่อเสนอนัดสำรวจสถานที่จริงภายใน 24 ชม.</p>
              </div>
            ) : (
              <div className="quotation-modal-content">
                {/* Modal Top Action Toolbar for Printing & Contractor Blueprint Export */}
                <div className="modal-print-quick-actions">
                  <button 
                    type="button" 
                    id="btn-quick-print-quotation"
                    className="btn-modal-action btn-print-primary" 
                    onClick={() => window.print()}
                    title="สั่งพิมพ์ใบเสนอราคา หรือบันทึกเป็น PDF (Print to PDF)"
                  >
                    <Printer size={16} />
                    <span>พิมพ์ใบเสนอราคา (Print)</span>
                  </button>
                  <button 
                    type="button" 
                    id="btn-quick-export-blueprint"
                    className="btn-modal-action btn-blueprint-secondary" 
                    onClick={handleExportBlueprintImage}
                    title="ส่งออกภาพแปลนสถาปัตยกรรมและระบบไฟฟ้าสำหรับช่าง (PNG 2400x1600)"
                  >
                    <Download size={16} />
                    <span>ส่งออกแปลนสำหรับช่าง (PNG)</span>
                  </button>
                </div>

                {/* Official Printable Quotation Sheet (Whitelisted for Print Dialog) */}
                <div className="official-quotation-print-sheet" id="official-quotation-print-sheet">
                  {/* Company Letterhead */}
                  <div className="quote-sheet-header">
                    <div className="sheet-brand">
                      <div className="brand-title">G-SPEED ESPORT ARENA</div>
                      <div className="brand-sub">บริษัท จี-สปีด อีสปอร์ต จำกัด (สำนักงานใหญ่)</div>
                      <p className="brand-contact-info">
                        เลขที่ 88/9 อาคารจี-สปีด ทาวเวอร์ ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900<br />
                        เลขประจำตัวผู้เสียภาษีอากร: 0105566012345 | โทร: 02-888-9999 | เว็บไซต์: www.gspeed-esport.com
                      </p>
                    </div>
                    <div className="sheet-meta-box">
                      <div className="meta-doc-badge">ใบเสนอราคา / ESTIMATED QUOTATION</div>
                      <div className="meta-line"><strong>เลขที่ใบเสนอราคา:</strong> GS-QT-{new Date().toISOString().slice(0, 10).replace(/-/g, '')}-{Date.now().toString().slice(-4)}</div>
                      <div className="meta-line"><strong>วันที่ออกเอกสาร:</strong> {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      <div className="meta-line"><strong>กำหนดยืนราคา:</strong> 30 วันนับจากวันที่ระบุ</div>
                    </div>
                  </div>

                  {/* Customer & Project Specifications Grid */}
                  <div className="quote-customer-project-grid">
                    <div className="quote-info-col">
                      <div className="info-section-title">ข้อมูลลูกค้า / ผู้ขอรับสิทธิ์แฟรนไชส์ (CUSTOMER INFO)</div>
                      <div className="info-detail-row">
                        <span className="info-lbl">ชื่อลูกค้า / นิติบุคคล:</span>
                        <span className="info-val"><strong>{leadForm.fullName || 'ผู้สนใจลงทุนแฟรนไชส์ (Franchise Investor)'}</strong></span>
                      </div>
                      <div className="info-detail-row">
                        <span className="info-lbl">เบอร์โทรศัพท์ติดต่อ:</span>
                        <span className="info-val">{leadForm.phone || '08X-XXX-XXXX'}</span>
                      </div>
                      <div className="info-detail-row">
                        <span className="info-lbl">อีเมลติดต่อ:</span>
                        <span className="info-val">{leadForm.email || 'investor@example.com'}</span>
                      </div>
                      <div className="info-detail-row">
                        <span className="info-lbl">งบประมาณที่เตรียมไว้:</span>
                        <span className="info-val">{leadForm.budget}</span>
                      </div>
                    </div>
                    <div className="quote-info-col">
                      <div className="info-section-title">ข้อมูลโครงการสาขา (PROJECT SPECIFICATIONS)</div>
                      <div className="info-detail-row">
                        <span className="info-lbl">ทำเลที่ตั้งสาขา:</span>
                        <span className="info-val"><strong>{storeLocation}</strong></span>
                      </div>
                      <div className="info-detail-row">
                        <span className="info-lbl">รูปแบบพื้นที่:</span>
                        <span className="info-val">{storeType} {leadForm.locationDetail ? `(${leadForm.locationDetail})` : ''}</span>
                      </div>
                      <div className="info-detail-row">
                        <span className="info-lbl">ขนาดพื้นที่ร้าน:</span>
                        <span className="info-val"><strong>{roomWidth} x {roomHeight} ม. ({roomAreaSqM} ตร.ม.)</strong></span>
                      </div>
                      <div className="info-detail-row">
                        <span className="info-lbl">สเปกคอมพิวเตอร์:</span>
                        <span className="info-val text-blue"><strong>{currentTierInfo.name} ({totalStations} เครื่อง)</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Key Highlights Pill Badges */}
                  <div className="quote-summary-badges">
                    <div className="qs-badge">ขนาดพื้นที่: <strong>{roomWidth}x{roomHeight} ม. ({roomAreaSqM} ตร.ม.)</strong></div>
                    <div className="qs-badge">จำนวนเครื่อง: <strong>{totalStations} Stations</strong></div>
                    <div className="qs-badge">สเปก: <strong>{currentTierInfo.name}</strong></div>
                    <div className="qs-badge">ระยะเวลาติดตั้ง: <strong>4-6 สัปดาห์</strong></div>
                    <div className="qs-badge">จุดคุ้มทุนประเมิน: <strong>~{paybackMonths} เดือน</strong></div>
                    {uploadedBlueprint && (
                      <div className="qs-badge highlight-bp">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>แนบแปลนอาคาร: <strong>{uploadedBlueprint.name}</strong></span>
                      </div>
                    )}
                  </div>

                  {uploadedBlueprint && (
                    <div className="attached-blueprint-quote-box">
                      <div className="quote-bp-thumb">
                        <img src={uploadedBlueprint.url} alt="Attached Floor Plan" />
                      </div>
                      <div className="quote-bp-info">
                        <h5>แบบแปลนอาคารแนบพิเศษ (Custom Blueprint Attached)</h5>
                        <p>
                          ระบบได้บันทึกไฟล์พิมพ์เขียวและสัดส่วนพื้นที่ <strong>{uploadedBlueprint.dimensions}</strong> เรียบร้อยแล้ว สถาปนิก G-Speed จะนำผังนี้ไปขึ้นแบบโครงสร้าง 3D Interior เสมือนจริงความละเอียดสูง (Photo-realistic Render) และจัดเตรียมใบเสนอราคาทางการส่งกลับให้ท่านภายใน 24 ชม.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Itemized BOQ Table */}
                  <table className="quote-table official-boq-table">
                    <thead>
                      <tr>
                        <th style={{ width: '45px' }}>ลำดับ</th>
                        <th>รายการรายละเอียดอุปกรณ์และงานระบบ (BOQ ITEM DESCRIPTION)</th>
                        <th style={{ width: '110px' }} className="text-center">จำนวน</th>
                        <th style={{ width: '130px' }} className="text-right">ราคาต่อหน่วย</th>
                        <th style={{ width: '140px' }} className="text-right">รวมเงิน (บาท)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-center">1</td>
                        <td>
                          <strong>ชุดเครื่องคอมพิวเตอร์เกมมิ่งสเปก {currentTierInfo.name}</strong>
                          <div className="boq-item-desc">{currentTierInfo.cpu} • {currentTierInfo.gpu} • {currentTierInfo.ram} • จอ {currentTierInfo.monitor}</div>
                        </td>
                        <td className="text-center">{totalStations} เครื่อง</td>
                        <td className="text-right">฿{currentTierInfo.unitCost.toLocaleString()}</td>
                        <td className="text-right">฿{hardwareCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">2</td>
                        <td>
                          <strong>เฟอร์นิเจอร์ โต๊ะเกมมิ่งระดับแข่งขัน เก้าอี้ Ergonomic และโซน VIP</strong>
                          <div className="boq-item-desc">จัดวางตามผังร้าน {placedItems.length} โมดูล (รวมระบบรางท่อร้อยสายไฟและกล่องเต้ารับคู่ 3 ขา)</div>
                        </td>
                        <td className="text-center">1 ชุด</td>
                        <td className="text-right">-</td>
                        <td className="text-right">฿{furnitureItemsCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">3</td>
                        <td>
                          <strong>งานตกแต่งภายใน ระบบฝ้า ผนังกันเสียง & ไฟ Linear Modern ({selectedTheme})</strong>
                          <div className="boq-item-desc">งานผนัง Acoustic ซับเสียง, งานพื้น Epoxy/กระเบื้องยาง Heavy-Duty, ป้ายไฟอะคริลิกเรืองแสงโลโก้แบรนด์</div>
                        </td>
                        <td className="text-center">{roomAreaSqM} ตร.ม.</td>
                        <td className="text-right">฿{FIXED_INFRASTRUCTURE.interiorSqMeterCost.toLocaleString()}</td>
                        <td className="text-right">฿{interiorDecorCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">4</td>
                        <td>
                          <strong>งานระบบปรับอากาศ Inverter Cassette Type ประหยัดพลังงาน</strong>
                          <div className="boq-item-desc">เครื่องปรับอากาศฝังฝ้า 4 ทิศทาง พร้อมระบบระบายอากาศ Fresh Air Circulation สำหรับบริการ 24 ชม.</div>
                        </td>
                        <td className="text-center">{roomAreaSqM} ตร.ม.</td>
                        <td className="text-right">฿{FIXED_INFRASTRUCTURE.airconSqMeterCost.toLocaleString()}</td>
                        <td className="text-right">฿{airconCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">5</td>
                        <td>
                          <strong>ระบบแม่ข่าย Diskless Server 10Gbps NVMe High-Availability</strong>
                          <div className="boq-item-desc">เซิร์ฟเวอร์สำรอง Dual-Host ระบบอัปเดตเกมอัตโนมัติความเร็วสูง รองรับการบูตพร้อมกันโดยไม่มีสะดุด</div>
                        </td>
                        <td className="text-center">1 ระบบ</td>
                        <td className="text-right">-</td>
                        <td className="text-right">฿{disklessCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">6</td>
                        <td>
                          <strong>ระบบโครงข่ายเน็ตเวิร์ก Enterprise Dual-WAN & Cisco 10G Switch</strong>
                          <div className="boq-item-desc">สายสัญญาณ LAN CAT6A Shielded + ตู้ Rack 42U Server + ระบบ UPS สำรองไฟขนาด 10kVA</div>
                        </td>
                        <td className="text-center">1 ระบบ</td>
                        <td className="text-right">-</td>
                        <td className="text-right">฿{networkCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">7</td>
                        <td>
                          <strong>ระบบบริหารจัดการร้าน Billing & Cloud Member POS System</strong>
                          <div className="boq-item-desc">โปรแกรมคิดเงิน ลิ้นชักเก็บเงิน เครื่องสแกนบาร์โค้ด และระบบสมาชิกระดับคลาวด์เชื่อมต่อส่วนกลาง</div>
                        </td>
                        <td className="text-center">1 ชุด</td>
                        <td className="text-right">-</td>
                        <td className="text-right">฿{billingCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">8</td>
                        <td>
                          <strong>ค่าสิทธิ์แฟรนไชส์ G-SPEED & บริการ Turnkey Onboarding ครบวงจร</strong>
                          <div className="boq-item-desc">สิทธิ์การใช้แบรนด์, แปลนก่อสร้าง 3D, จัดฝึกอบรมผู้จัดการและพนักงาน, การตลาดและโปรโมทเปิดร้าน</div>
                        </td>
                        <td className="text-center">1 สาขา</td>
                        <td className="text-right">-</td>
                        <td className="text-right">฿{franchiseLicenseCost.toLocaleString()}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" className="text-right"><strong>ยอดรวมประมาณการลงทุนก่อนภาษี (Subtotal):</strong></td>
                        <td className="text-right"><strong>฿{totalInvestmentCost.toLocaleString()}</strong></td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="text-right">ภาษีมูลค่าเพิ่ม 7% (VAT 7%):</td>
                        <td className="text-right">฿{Math.round(totalInvestmentCost * 0.07).toLocaleString()}</td>
                      </tr>
                      <tr className="grand-total-row">
                        <td colSpan="4" className="text-right"><strong>ยอดรวมสุทธิทั้งสิ้น (GRAND TOTAL):</strong></td>
                        <td className="text-right"><strong className="text-blue font-large">฿{Math.round(totalInvestmentCost * 1.07).toLocaleString()}</strong></td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* Commercial Terms & Notes */}
                  <div className="quote-commercial-terms">
                    <div className="terms-title">เงื่อนไขและข้อตกลงทางการค้า (COMMERCIAL TERMS & WARRANTY)</div>
                    <ol className="terms-list">
                      <li><strong>เงื่อนไขการชำระเงินแบ่ง 3 งวด:</strong> งวดที่ 1 (มัดจำลงนามสัญญา) 30% | งวดที่ 2 (จัดส่งและติดตั้งอุปกรณ์) 50% | งวดที่ 3 (ตรวจรับงานและเปิดร้าน) 20%</li>
                      <li><strong>การรับประกัน (Warranty):</strong> อุปกรณ์คอมพิวเตอร์และเซิร์ฟเวอร์รับประกัน On-site Service 3 ปีเต็ม, ระบบ Network ดูแลตลอด 24 ชม. ผ่าน Cloud Monitoring</li>
                      <li><strong>ระยะเวลาก่อสร้างและส่งมอบ:</strong> ดำเนินการแล้วเสร็จภายใน 4 - 6 สัปดาห์ พร้อมเปิดให้บริการเชิงพาณิชย์</li>
                      <li><strong>ราคารวมงานแบบเบ็ดเสร็จ (Turnkey):</strong> รวมค่าขนส่ง, การติดตั้งสายระบบไฟฟ้า, สายแลน, การคอนฟิกระบบ Diskless และการอบรมบุคลากร</li>
                    </ol>
                  </div>

                  {/* Official Signatures Section */}
                  <div className="quote-signatures-row">
                    <div className="signature-box">
                      <div className="sign-line"></div>
                      <div className="sign-name">ผู้อนุมัติเสนอราคา (Authorized Signature)</div>
                      <div className="sign-title">ฝ่ายพัฒนาธุรกิจแฟรนไชส์ / G-Speed Esport Co., Ltd.</div>
                      <div className="sign-date">วันที่: ..... / ..... / ..........</div>
                    </div>
                    <div className="signature-box">
                      <div className="sign-line"></div>
                      <div className="sign-name">ผู้ขอรับสิทธิ์แฟรนไชส์ / ลูกค้า (Franchisee Acceptance)</div>
                      <div className="sign-title">ผู้ตกลงยินยอมตามใบเสนอราคา</div>
                      <div className="sign-date">วันที่: ..... / ..... / ..........</div>
                    </div>
                  </div>
                </div>

                {/* Lead Form to send design to company */}
                <form onSubmit={handleLeadSubmit} className="lead-submission-form">
                  <div className="lead-form-header">
                    <Send size={18} className="text-blue" />
                    <h4>ต้องการให้ทีมงาน G-Speed ติดต่อกลับพร้อมส่งแปลนร้านนี้</h4>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>ชื่อ-นามสกุล *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="คุณสมเกียรติ มั่นคง"
                        value={leadForm.fullName}
                        onChange={e => setLeadForm({...leadForm, fullName: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>เบอร์โทรศัพท์ติดต่อ *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="08X-XXX-XXXX"
                        value={leadForm.phone}
                        onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>อีเมลติดต่อ *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="investor@example.com"
                        value={leadForm.email}
                        onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>งบประมาณที่เตรียมไว้ลงทุน</label>
                      <select 
                        value={leadForm.budget}
                        onChange={e => setLeadForm({...leadForm, budget: e.target.value})}
                      >
                        <option>1,000,000 - 2,000,000 บาท</option>
                        <option>2,000,000 - 3,500,000 บาท</option>
                        <option>3,500,000 - 5,000,000 บาท</option>
                        <option>5,000,000 บาทขึ้นไป (Flagship Arena)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>รายละเอียดที่ตั้ง / ขนาดพื้นที่ที่มีอยู่เดิม (ถ้ามี)</label>
                    <textarea 
                      rows={2} 
                      placeholder="เช่น มีอาคารพาณิชย์ 2 คูหา ย่าน ม.เกษตรศาสตร์ ติดถนนใหญ่..."
                      value={leadForm.locationDetail}
                      onChange={e => setLeadForm({...leadForm, locationDetail: e.target.value})}
                    />
                  </div>

                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={handleExportBlueprintImage}
                      title="ดาวน์โหลดภาพแปลนสถาปัตยกรรมสำหรับช่าง (PNG)"
                    >
                      <Download size={16} />
                      <span>ดาวน์โหลดแปลนช่าง (PNG)</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={() => window.print()}
                      title="พิมพ์ใบเสนอราคา (Print หรือ Save PDF)"
                    >
                      <Printer size={16} />
                      <span>พิมพ์ใบเสนอราคา (Print)</span>
                    </button>
                    <button type="submit" className="btn-primary">
                      <Send size={16} />
                      <span>ส่งแปลนและขอคำปรึกษาฟรี</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
