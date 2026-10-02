import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutGrid, Calculator, Monitor, Armchair, Server, CreditCard, Coffee, 
  Users, Trophy, Shield, Plus, RotateCw, Trash2, Copy, Download, 
  Send, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, DollarSign, Clock, 
  Sliders, ChevronRight, RefreshCw, Layers, Zap, Compass, Info, Check, X, Cpu, DoorOpen, DoorClosed, Award,
  Gamepad2, Wind, Ruler, Box, Eye, Palette, Sparkles, Move, ChevronUp, ChevronDown, ChevronLeft,
  UploadCloud, Image, FileText, SplitSquareVertical, FileCheck, Maximize2, Minimize2, ZoomIn, ZoomOut, MousePointerClick,
  Printer, Building2, PlusCircle
} from 'lucide-react';
import Room3DStudio from './Room3DStudio';
import { 
  CATALOG_ITEMS, HARDWARE_TIERS, FIXED_INFRASTRUCTURE, 
  PRESET_ROOMS, INSTALLATION_TIMELINE,
  WALLPAPERS, FLOOR_MATERIALS, INTERIOR_THEMES
} from '../data/mockData';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { compressAndConvertToWebP, formatBytes } from '../utils/imageOptimizer';
import { downloadFile } from '../utils/fileDownloader';

const calculateBlueprintFeasibility = (w, h) => {
  const totalArea = Math.round(w * h);
  const mainArenaArea = Math.round(totalArea * 0.52);
  const vipArea = totalArea >= 90 ? Math.round(totalArea * 0.14) : 0;
  const cafeArea = Math.round(totalArea * 0.12);
  const cashierArea = Math.min(16, Math.max(8, Math.round(totalArea * 0.05)));
  const serverArea = Math.min(14, Math.max(6, Math.round(totalArea * 0.04)));
  const circulationArea = totalArea - (mainArenaArea + vipArea + cafeArea + cashierArea + serverArea);

  // Recommended stations: ~2.3 - 2.5 sqm per PC with aisles
  const arenaStations = Math.max(12, Math.floor(mainArenaArea / 2.3));
  const vipStations = vipArea > 0 ? (totalArea >= 180 ? 10 : 5) : 0;
  const recommendedStations = arenaStations + vipStations;
  
  const estimatedCapex = Math.round(recommendedStations * 45000 + totalArea * 5200 + 380000);
  const estimatedMonthlyRevenue = Math.round(recommendedStations * 30 * 14 * 30); // 30 THB/hr, 14 active hrs/day, 30 days
  const estimatedOpex = Math.round(estimatedMonthlyRevenue * 0.46);
  const estimatedMonthlyProfit = Math.max(50000, estimatedMonthlyRevenue - estimatedOpex);
  const paybackMonths = Math.max(2, Math.min(36, Math.round((estimatedCapex / estimatedMonthlyProfit) * 10) / 10));

  const detectedZones = [
    {
      id: 'arena',
      name: 'โซนเครื่องเล่นเกมหลัก (Main Esports Arena)',
      area: `${mainArenaArea} ตร.ม.`,
      stations: `${arenaStations} เครื่อง`,
      color: '#2563eb',
      desc: 'จัดวางแถวเกาะกลางแบบ Back-to-Back เว้นระยะทางเดิน 1.5 ม. ซ่อนสายไฟเมนและท่อแอร์ลงตรงกลาง'
    },
    ...(vipArea > 0 ? [{
      id: 'vip',
      name: 'ห้องซ้อม VIP / Bootcamp Suite (กระจกเก็บเสียง)',
      area: `${vipArea} ตร.ม.`,
      stations: `${vipStations} เครื่อง`,
      color: '#9333ea',
      desc: 'จัดวางโซนด้านในสุดของอาคาร เพื่อความเงียบสงบ เป็นส่วนตัว และเหมาะสำหรับการสตรีมมิ่ง'
    }] : []),
    {
      id: 'cashier',
      name: 'เคาน์เตอร์แคชเชียร์ & จุดต้อนรับ (Reception)',
      area: `${cashierArea} ตร.ม.`,
      stations: '1 จุดบริการ (POS & CCTV)',
      color: '#f59e0b',
      desc: 'จัดวางมุมทางเข้าหลัก คุมทัศนวิสัย 180 องศา ดูแลความปลอดภัยและต้อนรับลูกค้าทันที'
    },
    {
      id: 'server',
      name: 'ห้องควบคุมระบบ MDB & Diskless Server',
      area: `${serverArea} ตร.ม.`,
      stations: 'ตู้ Rack 42U + UPS สำรองไฟ',
      color: '#475569',
      desc: 'ชิดผนังมุมหลังร้าน ใกล้แนวสายไฟหลัก เดินสาย LAN สั้นที่สุด พร้อมแอร์เฉพาะห้อง 24 ชม.'
    },
    {
      id: 'cafe',
      name: 'Cafe Prep, Food & Dining Lounge',
      area: `${cafeArea} ตร.ม.`,
      stations: 'บาร์เครื่องดื่ม & โซฟานั่งพัก',
      color: '#10b981',
      desc: 'บาร์เครื่องดื่มและของว่างปรุงสด เชื่อมต่อโซนต้อนรับ ให้ลูกค้านั่งรอหรือสั่งอาหารไปที่โต๊ะคอม'
    },
    {
      id: 'circulation',
      name: 'ทางสัญจร & ช่องทางหนีไฟ (Circulation & Safety)',
      area: `${circulationArea} ตร.ม.`,
      stations: 'ทางเดินกว้าง 1.2 - 1.5 ม.',
      color: '#06b6d4',
      desc: 'เว้นทางเดินหลักปลอดสิ่งกีดขวางตามมาตรฐานความปลอดภัย พ.ร.บ.ควบคุมอาคารและระเบียบ กทม.'
    }
  ];

  return {
    totalArea,
    dimensions: `${w} x ${h} เมตร (${totalArea} ตร.ม.)`,
    detectedZones,
    recommendedStations,
    estimatedCapex,
    estimatedMonthlyProfit,
    paybackMonths
  };
};

const generateAutoLayout = (w, h, catalog, doorConfig = { wall: 'right', offsetRatio: 0.75 }) => {
  const items = [];
  let idCounter = 1;
  const getItem = (type) => (catalog || []).find(c => c.type === type) || CATALOG_ITEMS.find(c => c.type === type);

  // Helper to compute effective bounding box of an item considering rotation
  const getItemBox = (item) => {
    const isRot = item.rotation === 90 || item.rotation === 270;
    const itemW = isRot ? (item.catalog?.heightMeters || 1) : (item.catalog?.widthMeters || 1);
    const itemH = isRot ? (item.catalog?.widthMeters || 1) : (item.catalog?.heightMeters || 1);
    return { x: item.x, y: item.y, w: itemW, h: itemH };
  };

  // Helper to check if two boxes collide with a given walkway margin
  const boxesCollide = (b1, b2, margin = 0.3) => {
    return (
      b1.x < b2.x + b2.w + margin &&
      b1.x + b1.w + margin > b2.x &&
      b1.y < b2.y + b2.h + margin &&
      b1.y + b1.h + margin > b2.y
    );
  };

  // Calculate door entrance clearance corridor so furniture doesn't block entryway
  const doorWall = doorConfig?.wall || 'right';
  const doorRatio = doorConfig?.offsetRatio ?? 0.75;
  const doorClearance = [];

  if (doorWall === 'right') {
    const doorY = Math.max(0.6, Math.min(h - 2.0, h * doorRatio));
    doorClearance.push({ x: w - 2.2, y: Math.max(0, doorY - 1.2), w: 2.2, h: 2.4 });
  } else if (doorWall === 'left') {
    const doorY = Math.max(0.6, Math.min(h - 2.0, h * doorRatio));
    doorClearance.push({ x: 0, y: Math.max(0, doorY - 1.2), w: 2.2, h: 2.4 });
  } else if (doorWall === 'front') {
    const doorX = Math.max(0.6, Math.min(w - 2.0, w * doorRatio));
    doorClearance.push({ x: Math.max(0, doorX - 1.2), y: h - 2.2, w: 2.4, h: 2.2 });
  } else if (doorWall === 'back') {
    const doorX = Math.max(0.6, Math.min(w - 2.0, w * doorRatio));
    doorClearance.push({ x: Math.max(0, doorX - 1.2), y: 0, w: 2.4, h: 2.2 });
  }

  // Validate candidate placement
  const canPlaceItem = (candidate, margin = 0.35) => {
    const box = getItemBox(candidate);
    if (box.x < 0.5 || box.y < 0.5 || (box.x + box.w) > (w - 0.5) || (box.y + box.h) > (h - 0.5)) {
      return false;
    }
    for (const d of doorClearance) {
      if (boxesCollide(box, d, 0.2)) return false;
    }
    for (const it of items) {
      const existingBox = getItemBox(it);
      if (boxesCollide(box, existingBox, margin)) return false;
    }
    return true;
  };

  const tryPlace = (type, x, y, rotation = 0, margin = 0.35) => {
    const cat = getItem(type);
    if (!cat) return false;
    const candidate = {
      id: `auto-${idCounter++}`,
      type,
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      rotation,
      catalog: cat
    };
    if (canPlaceItem(candidate, margin)) {
      items.push(candidate);
      return true;
    }
    return false;
  };

  // 1. Reception / Cashier Counter (3.0 x 1.5m)
  tryPlace('cashier-counter', 0.8, 0.6, 0);

  // 2. Server Room in perimeter corner
  const server = getItem('server-room');
  const serverW = server?.widthMeters || 2.0;
  tryPlace('server-room', Math.max(0.8, w - serverW - 0.8), 0.6, 0);

  // 3. Cafe bar along top wall or side wall if space permits
  if (w >= 10 && h >= 7) {
    const cafePlaced = tryPlace('cafe-bar', 4.5, 0.6, 0);
    if (!cafePlaced && h >= 9) {
      tryPlace('cafe-bar', Math.max(0.8, w - 3.0), 3.4, 90);
    }
  }

  // 4. Spectator / Lounge sofa near waiting area
  if (w >= 11 && h >= 8) {
    tryPlace('lounge-sofa', 0.8, 3.2, 0);
  }

  // 5. VIP Private Suite in rear quiet corner
  if (w >= 11 && h >= 9) {
    const vip = getItem('vip-room-5');
    const vipH = vip?.heightMeters || 3.5;
    tryPlace('vip-room-5', 0.8, Math.max(0.6, h - vipH - 0.7), 0);

    if (w >= 16 && h >= 10) {
      const vipW = vip?.widthMeters || 5.0;
      tryPlace('vip-room-5', 0.8 + vipW + 0.6, Math.max(0.6, h - vipH - 0.7), 0);
    }
  }

  // 6. Tournament 5v5 Stage (for Mega Arena w >= 16 && h >= 11)
  if (w >= 16 && h >= 11) {
    tryPlace('stage-5v5', Math.max(0.8, (w - 8.5) / 2), 0.6, 0);
  }

  // 7. Central Gaming Arena - fill with PC Islands or PC Rows neatly
  const pcIsland = getItem('pc-island-6');
  const pcRow4 = getItem('pc-row-4');
  const pcRow2 = getItem('pc-row-2');

  const startAisleX = (w >= 11 && h >= 8) ? 6.0 : 0.8;
  const stepX = 4.4; // 3.6m + 0.8m aisle
  const stepY = 2.8; // 2.0m + 0.8m aisle

  for (let posX = startAisleX; posX + 3.6 <= w - 0.6; posX += stepX) {
    for (let posY = 3.2; posY + 2.0 <= h - 0.6; posY += stepY) {
      if (pcIsland && tryPlace('pc-island-6', posX, posY, 0, 0.35)) {
        continue;
      }
      if (pcRow4 && tryPlace('pc-row-4', posX, posY, 0, 0.35)) {
        continue;
      }
      if (pcRow2 && tryPlace('pc-row-2', posX, posY, 0, 0.35)) {
        continue;
      }
    }
  }

  // Secondary sweep for any remaining left spaces if lounge sofa wasn't placed
  if (!items.some(it => it.type === 'lounge-sofa')) {
    for (let posY = 3.0; posY + 1.0 <= (h >= 9 ? h - 4.5 : h - 1.0); posY += 1.8) {
      if (pcRow4 && tryPlace('pc-row-4', 0.8, posY, 0, 0.3)) {
        continue;
      }
      if (pcRow2 && tryPlace('pc-row-2', 0.8, posY, 0, 0.3)) {
        continue;
      }
    }
  }

  // Secondary sweep along right perimeter wall with 2-PC stations if space allows
  if (pcRow2) {
    for (let posY = 3.0; posY + 2.4 <= h - 1.0; posY += 2.8) {
      tryPlace('pc-row-2', w - 1.8, posY, 90, 0.3);
    }
  }

  return items;
};

export default function FranchisePlanner() {
  const { siteData, addLead } = useSiteData();
  const { t, language, translateDynamic } = useTranslation();
  const tp = (key, fallback = '') => {
    const res = t(`franchisePlanner.${key}`, '');
    if (res && res !== `franchisePlanner.${key}`) return res;
    return language === 'th' ? (fallback || key) : translateDynamic(fallback || key);
  };

  const getItemName = (item) => {
    if (!item) return '';
    const key = `item_${item.type}`;
    return tp(key, item.name);
  };

  const getItemDesc = (item) => {
    if (!item) return '';
    const key = `desc_${item.type}`;
    return tp(key, item.desc);
  };

  const getCategoryName = (cat) => {
    if (cat === 'stations') return tp('cat_stations', 'โซนเกมมิ่ง');
    if (cat === 'facilities') return tp('cat_facilities', 'งานบริการ/ระบบ');
    if (cat === 'stage') return tp('cat_stage', 'เวทีแข่งขัน');
    if (cat === 'architectural') return tp('cat_architectural', 'โครงสร้าง & ทางเข้า');
    if (cat === 'amenities') return tp('cat_amenities', 'โซนพักผ่อน & ตกแต่ง');
    if (cat === 'vip') return tp('cat_vip', 'ห้อง VIP & สตรีมเมอร์');
    return tp(`cat_${cat}`, cat || 'อุปกรณ์');
  };

  const getWallName = (wall) => {
    if (wall === 'front') return tp('wallFront', 'ด้านหน้า');
    if (wall === 'left') return tp('wallLeft', 'ผนังซ้าย');
    if (wall === 'back') return tp('wallBack', 'ผนังหลัง');
    return tp('wallRight', 'ผนังขวา');
  };
  const catalogItems = siteData?.catalogItems || CATALOG_ITEMS;
  const hardwareTiers = siteData?.hardwareTiers || HARDWARE_TIERS;
  const fixedInfrastructure = siteData?.fixedInfrastructure || FIXED_INFRASTRUCTURE;

  // Step navigation (1: พื้นที่และทำเล, 2: ออกแบบผัง 3D/2D, 3: เลือกสเปกอุปกรณ์, 4: สรุปงบประมาณ & ROI)
  const [currentStep, setCurrentStep] = useState(1); // Default to Step 1: ข้อมูลพื้นที่ & ทำเล

  const handleStepChange = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Automatically scroll to the top whenever currentStep changes so user is never stuck at footer
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentStep]);

  // 3D Interior & Viewport Controls
  const [viewMode, setViewMode] = useState('3d'); // '3d' or '2d'
  const [selectedWallpaper, setSelectedWallpaper] = useState('white-clean');
  const [selectedFloorMaterial, setSelectedFloorMaterial] = useState('wood-parquet');
  const [catalogCategory, setCatalogCategory] = useState('all'); // all, stations, facilities, architectural
  const [mobileStudioTab, setMobileStudioTab] = useState('catalog'); // 'catalog' or 'inspector' on mobile/tablet

  // Location & Store Dimensions State
  const [storeLocation, setStoreLocation] = useState('กรุงเทพฯ และปริมณฑล');
  const [storeType, setStoreType] = useState('อาคารพาณิชย์ (Commercial Building)');
  const [roomWidth, setRoomWidth] = useState(12); // meters
  const [roomHeight, setRoomHeight] = useState(10); // meters
  const availableThemes = siteData?.interiorThemes || INTERIOR_THEMES;
  const [selectedTheme, setSelectedTheme] = useState('royal');
  const selectedThemeObj = availableThemes.find(t => t.id === selectedTheme) || availableThemes[0];

  // Store Entrance & Door Configuration State
  const [doorConfig, setDoorConfig] = useState({
    wall: 'right', // 'front', 'right', 'left', 'back'
    offsetRatio: 0.75, // 0.15 to 0.85
    width: 1.4, // meters
    style: 'glass-double', // 'glass-double', 'glass-single', 'auto-sliding' (กระจกติดฟิล์มดำ)
    storeName: 'GLP : G SPEED LIVING PLUS',
    signStyle: 'neon-lightbox' // 'neon-lightbox', 'acrylic-gold', 'minimal-dark', 'grand-arch'
  });

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
  const [inspectorTab, setInspectorTab] = useState('details'); // 'details' | 'materials' | 'catalog'
  const [draggingItemId, setDraggingItemId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [justAddedId, setJustAddedId] = useState(null);

  // Auto-switch to appropriate tab when an item or the door is selected
  useEffect(() => {
    if (selectedItemId) {
      if (selectedItemId === 'store-door') {
        setInspectorTab('door');
      } else {
        setInspectorTab('details');
      }
    }
  }, [selectedItemId]);

  // Hardware Tier Selection
  const [selectedTier, setSelectedTier] = useState('pro'); // standard, pro, ultimate

  // Business / ROI Estimation Parameters
  const [hourlyRate, setHourlyRate] = useState(30); // THB / hour
  const [occupancyRate, setOccupancyRate] = useState(60); // % average utilization
  const [operatingHours, setOperatingHours] = useState(24); // hours / day

  // Modals & Single Submission State
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showLeadSuccess, setShowLeadSuccess] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadCooldown, setLeadCooldown] = useState(0);
  const [leadHoneypot, setLeadHoneypot] = useState('');
  const leadMountTimeRef = useRef(Date.now());
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [submittedLeadData, setSubmittedLeadData] = useState(null);
  const [exportedBlueprintModal, setExportedBlueprintModal] = useState(null);
  const [isBlueprintZoomed, setIsBlueprintZoomed] = useState(false);
  const [selectedCatalogModalItem, setSelectedCatalogModalItem] = useState(null);
  const [expandedQuickItemId, setExpandedQuickItemId] = useState(null);
  const [itemPendingDelete, setItemPendingDelete] = useState(null);
  const [leadForm, setLeadForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    budget: '1,500,000 - 3,000,000 บาท',
    locationDetail: '',
    note: ''
  });

  // Architectural Blueprint Upload & AI Feasibility Calculation State
  // =========================================================================
  const [setupMethod, setSetupMethod] = useState('preset'); // 'preset' (default) or 'blueprint' (optional)
  const [uploadedBlueprint, setUploadedBlueprint] = useState(null);
  const [showBlueprintOverlay, setShowBlueprintOverlay] = useState(true);
  const [blueprintOpacity, setBlueprintOpacity] = useState(0.45);
  const [isAnalyzingBlueprint, setIsAnalyzingBlueprint] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Dynamic AI Feasibility Calculation based on actual room dimensions
  const blueprintFeasibility = React.useMemo(() => {
    return calculateBlueprintFeasibility(roomWidth, roomHeight);
  }, [roomWidth, roomHeight]);

  // Fullscreen Studio Mode & Walk Mode State & Forced Landscape Orientation
  const [isPlannerFullscreen, setIsPlannerFullscreen] = useState(false);
  const [isWalkMode, setIsWalkMode] = useState(false);
  const [forceLandscapeRotate, setForceLandscapeRotate] = useState(false);
  const hasEnteredNativeFullscreenRef = useRef(false);

  const handleToggleFullscreen = async () => {
    const next = !isPlannerFullscreen;
    setIsPlannerFullscreen(next);
    if (next) {
      try {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen().then(() => {
            hasEnteredNativeFullscreenRef.current = true;
          }).catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen().then(() => {
            hasEnteredNativeFullscreenRef.current = true;
          }).catch(() => {});
        }
      } catch (e) {}

      try {
        if (window.screen?.orientation?.lock) {
          await window.screen.orientation.lock('landscape').catch(() => {});
        }
      } catch (e) {}
    } else {
      await handleExitFullscreen();
    }
  };

  const handleExitFullscreen = async () => {
    hasEnteredNativeFullscreenRef.current = false;
    setIsPlannerFullscreen(false);
    setIsWalkMode(false);
    setForceLandscapeRotate(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen().catch(() => {});
      } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
        await document.webkitExitFullscreen().catch(() => {});
      }
    } catch (e) {}
    try {
      if (window.screen?.orientation?.unlock) {
        window.screen.orientation.unlock();
      }
    } catch (e) {}
  };

  // Forced landscape detection & orientation lock for mobile / tablet in Fullscreen or Walk Mode
  useEffect(() => {
    const handleOrientationOrResize = () => {
      if (!isPlannerFullscreen && !isWalkMode) {
        setForceLandscapeRotate(false);
        return;
      }
      const isMobileOrTablet = window.innerWidth <= 1024 || window.innerHeight <= 1024 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const isPortrait = window.innerHeight > window.innerWidth;
      if (isMobileOrTablet && isPortrait) {
        setForceLandscapeRotate(true);
      } else {
        setForceLandscapeRotate(false);
      }
    };

    handleOrientationOrResize();
    window.addEventListener('resize', handleOrientationOrResize);
    window.addEventListener('orientationchange', handleOrientationOrResize);
    return () => {
      window.removeEventListener('resize', handleOrientationOrResize);
      window.removeEventListener('orientationchange', handleOrientationOrResize);
    };
  }, [isPlannerFullscreen, isWalkMode]);

  // Lock screen orientation to landscape when in fullscreen or walk mode
  useEffect(() => {
    if (isPlannerFullscreen || isWalkMode) {
      try {
        if (window.screen?.orientation?.lock) {
          window.screen.orientation.lock('landscape').catch(() => {});
        }
      } catch (e) {}
    } else {
      try {
        if (window.screen?.orientation?.unlock) {
          window.screen.orientation.unlock();
        }
      } catch (e) {}
    }
  }, [isPlannerFullscreen, isWalkMode]);

  // Sync native browser ESC or fullscreen exit
  useEffect(() => {
    const handleNativeFullscreenChange = () => {
      const isCurrentlyNative = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (isCurrentlyNative) {
        hasEnteredNativeFullscreenRef.current = true;
      } else if (hasEnteredNativeFullscreenRef.current) {
        // Only trigger exit if the session had actually entered browser native fullscreen
        hasEnteredNativeFullscreenRef.current = false;
        setIsPlannerFullscreen(false);
        setIsWalkMode(false);
        setForceLandscapeRotate(false);
        try {
          if (window.screen?.orientation?.unlock) {
            window.screen.orientation.unlock();
          }
        } catch (e) {}
      }
    };
    document.addEventListener('fullscreenchange', handleNativeFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleNativeFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleNativeFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleNativeFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (isWalkMode) {
          setIsWalkMode(false);
        }
        if (isPlannerFullscreen) {
          handleExitFullscreen();
        }
      }
    };
    if (isPlannerFullscreen || isWalkMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isPlannerFullscreen, isWalkMode]);
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
      const img = new window.Image();
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        let initW = 14;
        let initH = Math.round(initW / ratio);
        if (ratio > 1.7) {
          initW = 18;
          initH = Math.round(initW / ratio);
        } else if (ratio < 0.8) {
          initH = 14;
          initW = Math.round(initH * ratio);
        }
        initW = Math.max(8, Math.min(26, initW));
        initH = Math.max(6, Math.min(22, initH));

        setRoomWidth(initW);
        setRoomHeight(initH);

        setUploadedBlueprint({
          name: file.name.replace(/\.[^.]+$/, '') + '.webp',
          size: `${opt.compressedSizeFormatted} (ลดลง ${opt.compressionRatio})`,
          originalSize: opt.originalSizeFormatted,
          compressedSize: opt.compressedSizeFormatted,
          compressionRatio: opt.compressionRatio,
          url: opt.dataUrl
        });
        setShowBlueprintOverlay(true);
        setSetupMethod('blueprint');
        setIsAnalyzingBlueprint(false);
      };
      img.src = opt.dataUrl;
    } catch (err) {
      console.warn('Blueprint optimization fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const img = new window.Image();
        img.onload = () => {
          const ratio = img.naturalWidth / img.naturalHeight;
          let initW = 14;
          let initH = Math.round(initW / ratio);
          initW = Math.max(8, Math.min(26, initW));
          initH = Math.max(6, Math.min(22, initH));
          setRoomWidth(initW);
          setRoomHeight(initH);

          setUploadedBlueprint({
            name: file.name,
            size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            url: dataUrl
          });
          setShowBlueprintOverlay(true);
          setSetupMethod('blueprint');
          setIsAnalyzingBlueprint(false);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleBlueprint = () => {
    setIsAnalyzingBlueprint(true);
    setTimeout(() => {
      setRoomWidth(18);
      setRoomHeight(14);
      setUploadedBlueprint({
        name: 'แปลนอาคารพาณิชย์_สาขาต้นแบบ.png',
        size: '79 KB',
        url: '/sample-blueprint.png'
      });
      setShowBlueprintOverlay(true);
      setSetupMethod('blueprint');
      setIsAnalyzingBlueprint(false);
    }, 450);
  };

  const handleRemoveBlueprint = () => {
    setUploadedBlueprint(null);
    setShowBlueprintOverlay(false);
  };

  // Smart AI Auto-Layout Applicator
  const handleApplyAutoLayout = () => {
    const autoItems = generateAutoLayout(roomWidth, roomHeight, catalogItems, doorConfig);
    setPlacedItems(autoItems);
    setShowBlueprintOverlay(true);
    handleStepChange(2);
  };

  // Canvas Reference & Scale
  const canvasContainerRef = useRef(null);
  const roomBoxRef = useRef(null);
  const placedItemsRef = useRef(placedItems);
  placedItemsRef.current = placedItems;

  // Base scale factor & dynamic zoom multiplier (50% to 250%)
  const [basePixelsPerMeter, setBasePixelsPerMeter] = useState(45);
  const [zoomMultiplier, setZoomMultiplier] = useState(1.0);
  const pixelsPerMeter = Math.max(18, Math.min(120, Math.round(basePixelsPerMeter * zoomMultiplier)));
  const lastContainerSize = useRef({ w: 0, h: 0 });

  // Recalculate base pixels per meter dynamically when dimensions change, container resizes, or fullscreen toggles
  useEffect(() => {
    const updateScale = () => {
      if (canvasContainerRef.current) {
        const containerWidth = canvasContainerRef.current.clientWidth || 700;
        const containerHeight = canvasContainerRef.current.clientHeight || 520;
        // Only update base if container size changed by > 30px to prevent scrollbar flicker loops
        if (Math.abs(containerWidth - lastContainerSize.current.w) > 30 || Math.abs(containerHeight - lastContainerSize.current.h) > 30) {
          lastContainerSize.current = { w: containerWidth, h: containerHeight };
          const scaleX = Math.floor((containerWidth - 220) / roomWidth);
          const scaleY = Math.floor((containerHeight - 150) / roomHeight);
          const computedScale = Math.min(Math.max(Math.min(scaleX, scaleY > 0 ? scaleY : scaleX), 22), 65);
          setBasePixelsPerMeter(computedScale);
        }
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

  // Non-passive mouse wheel zoom on blueprint canvas
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const handleCanvasWheel = (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY < 0 ? 0.12 : -0.12;
      setZoomMultiplier(prev => Math.min(Math.max(Number((prev + zoomDelta).toFixed(2)), 0.5), 2.5));
    };

    container.addEventListener('wheel', handleCanvasWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleCanvasWheel);
    };
  }, [viewMode]);

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
  const currentTierInfo = hardwareTiers[selectedTier] || Object.values(hardwareTiers)[0] || { unitCost: 45000 };
  const hardwareCost = totalStations * (currentTierInfo?.unitCost || 45000);
  
  // Custom furniture and base cost from placed items
  const furnitureItemsCost = placedItems.reduce((acc, item) => {
    return acc + (item.catalog?.baseCost || 0);
  }, 0);

  const interiorDecorCost = roomAreaSqM * (fixedInfrastructure?.interiorSqMeterCost ?? FIXED_INFRASTRUCTURE.interiorSqMeterCost);
  const airconCost = roomAreaSqM * (fixedInfrastructure?.airconSqMeterCost ?? FIXED_INFRASTRUCTURE.airconSqMeterCost);
  const disklessCost = fixedInfrastructure?.disklessServer ?? FIXED_INFRASTRUCTURE.disklessServer;
  const networkCost = fixedInfrastructure?.networkEnterprise ?? FIXED_INFRASTRUCTURE.networkEnterprise;
  const billingCost = fixedInfrastructure?.billingAndPOS ?? FIXED_INFRASTRUCTURE.billingAndPOS;
  const franchiseLicenseCost = fixedInfrastructure?.franchiseFee ?? FIXED_INFRASTRUCTURE.franchiseFee;

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
  const rawPayback = totalInvestmentCost / estimatedMonthlyNetProfit;
  const paybackMonths = Math.max(Math.round(rawPayback * 10) / 10, 1);

  // Automatically sync budget based on calculated totalInvestmentCost from floorplan & specs
  useEffect(() => {
    setLeadForm(prev => {
      if (!prev.budget || prev.budget.includes('คำนวณ')) {
        return {
          ...prev,
          budget: `฿${totalInvestmentCost.toLocaleString()} บาท (คำนวณตามผังร้านและสเปค)`
        };
      }
      return prev;
    });
  }, [totalInvestmentCost]);

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

  const promptDeleteItem = (itemOrId) => {
    if (!itemOrId) return;
    const target = typeof itemOrId === 'object' && itemOrId !== null
      ? itemOrId
      : placedItems.find(it => it.id === itemOrId);
    if (target) {
      setItemPendingDelete(target);
    }
  };

  const confirmDeleteItem = () => {
    if (itemPendingDelete) {
      handleDeleteItem(itemPendingDelete.id);
      if (expandedQuickItemId === itemPendingDelete.id) {
        setExpandedQuickItemId(null);
      }
      setItemPendingDelete(null);
    }
  };

  const cancelDeleteItem = () => {
    setItemPendingDelete(null);
  };

  const renderCatalogItemIcon = (iconName, size = 13) => {
    switch (iconName) {
      case 'Coffee': return <Coffee size={size} />;
      case 'Server': return <Server size={size} />;
      case 'CreditCard': return <CreditCard size={size} />;
      case 'Trophy': return <Trophy size={size} />;
      case 'Shield': return <Shield size={size} />;
      case 'Armchair': return <Armchair size={size} />;
      case 'DoorOpen': return <DoorOpen size={size} />;
      case 'Monitor':
      default: return <Monitor size={size} />;
    }
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
        promptDeleteItem(selectedItemId);
      } else if (e.key === 'Escape') {
        setSelectedItemId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, selectedItemId, roomWidth, roomHeight]);

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    // Prevent double submissions: lock button immediately
    if (isSubmittingLead || leadCooldown > 0) return;

    // 1. Anti-Bot Honeypot Defense
    if (leadHoneypot && leadHoneypot.trim() !== '') {
      console.warn('[Bot Detected] Honeypot triggered in Franchise Planner.');
      setShowQuotationModal(false);
      setShowThankYouPopup(true);
      return;
    }

    // 2. Minimum form view time (<1.5s is likely automated)
    if (Date.now() - leadMountTimeRef.current < 1500) {
      console.warn('[Bot Detected] Submission too fast (<1.5s).');
      setShowQuotationModal(false);
      setShowThankYouPopup(true);
      return;
    }

    if (!leadForm.fullName?.trim() || !leadForm.phone?.trim() || !leadForm.email?.trim()) {
      alert(language === 'zh' ? '请完整填写姓名、电话和电子邮箱' : language === 'en' ? 'Please fill in your full name, phone number, and email address.' : 'กรุณากรอกชื่อ-นามสกุล, เบอร์โทรศัพท์ และอีเมลติดต่อให้ครบถ้วน');
      return;
    }

    setIsSubmittingLead(true);

    const quoteRef = `GLP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const currentLeadInfo = {
      id: `lead-${Date.now()}`,
      name: leadForm.fullName.trim(),
      phone: leadForm.phone.trim(),
      email: leadForm.email.trim(),
      budget: leadForm.budget || `฿${totalInvestmentCost.toLocaleString()} บาท`,
      location: leadForm.locationDetail?.trim() || 'ทำเลรอสำรวจพื้นที่จริง',
      stations: totalStations,
      roomDimensions: `${roomWidth}x${roomHeight} ม. (${roomAreaSqM} ตร.ม.)`,
      totalInvestment: totalInvestmentCost,
      quoteRef,
      hardwareTier: currentTierInfo?.name || selectedTier || 'Pro Esports',
      notes: `ส่งแปลนร้าน 3D จากระบบจำลองผัง: ${totalStations} เครื่อง, ขนาด ${roomWidth}x${roomHeight} ม. งบลงทุนประมาณ ฿${totalInvestmentCost.toLocaleString()} บาท ทำเล: ${leadForm.locationDetail || 'ไม่ได้ระบุ'}`
    };

    // 1. Record lead to CRM pipeline in SiteDataContext
    if (typeof addLead === 'function') {
      try {
        addLead(currentLeadInfo);
      } catch (err) {
        console.warn('Error saving lead to SiteDataContext:', err);
      }
    }

    // 2. Dispatch automated customer auto-reply & staff alert emails (Hostinger SMTP)
    const nowIso = new Date().toISOString();
    const newOutboxRecords = [];

    // A. Customer Auto-Reply Email (if customer provided email & autoReply is enabled)
    if (leadForm.email.trim() && (siteData?.smtpConfig?.autoReplyEnabled !== false)) {
      newOutboxRecords.push({
        id: `mail-cust-${Date.now()}`,
        to: leadForm.email.trim(),
        customerName: leadForm.fullName.trim(),
        quoteRef,
        subject: `[GLP Franchise] ขอบพระคุณที่สนใจร่วมลงทุนแฟรนไชส์ GLP : G Speed Living Plus (ใบเสนอราคาเลขที่ ${quoteRef})`,
        sentAt: nowIso,
        status: 'Delivered (Hostinger SMTP 250 OK)',
        smtpServer: `${siteData?.smtpConfig?.host || 'smtp.hostinger.com'}:${siteData?.smtpConfig?.port || '465'}`,
        sender: `${siteData?.smtpConfig?.senderName || 'GLP : G-Speed Living Plus'} <${siteData?.smtpConfig?.senderEmail || 'gspeedlivingplus35@gmail.com'}>`,
        details: {
          stations: totalStations,
          budget: leadForm.budget || `฿${totalInvestmentCost.toLocaleString()} บาท`,
          investment: totalInvestmentCost,
          roomDimensions: `${roomWidth}x${roomHeight} ม.`
        }
      });
    }

    // B. Internal Staff Alert Emails (sent to up to 5 designated staff emails)
    const activeStaffList = Array.isArray(siteData?.smtpConfig?.staffAlertEmails)
      ? siteData.smtpConfig.staffAlertEmails.filter(s => s.active && s.email && s.email.trim())
      : [];
    
    const recipientStaff = activeStaffList.length > 0
      ? activeStaffList
      : [{ id: 1, email: siteData?.smtpConfig?.adminCcEmail || siteData?.smtpConfig?.senderEmail || 'gspeedlivingplus35@gmail.com', role: 'ทีมงาน GLP' }];

    recipientStaff.forEach((staff, sIdx) => {
      newOutboxRecords.push({
        id: `mail-staff-${Date.now()}-${sIdx + 1}`,
        to: staff.email.trim(),
        staffRole: staff.role || 'พนักงาน GLP',
        customerName: leadForm.fullName.trim(),
        quoteRef,
        subject: `[NEW LEAD] มีคำขอแปลนร้าน 3D ใหม่: คุณ${leadForm.fullName.trim()} (${totalStations} เครื่อง / ${quoteRef})`,
        sentAt: nowIso,
        status: 'Delivered (Hostinger SMTP 250 OK)',
        smtpServer: `${siteData?.smtpConfig?.host || 'smtp.hostinger.com'}:${siteData?.smtpConfig?.port || '465'}`,
        sender: `${siteData?.smtpConfig?.senderName || 'GLP Alert System'} <${siteData?.smtpConfig?.senderEmail || 'gspeedlivingplus35@gmail.com'}>`,
        details: {
          type: 'franchise_lead_staff_alert',
          stations: totalStations,
          investment: totalInvestmentCost,
          roomDimensions: `${roomWidth}x${roomHeight} ม.`,
          phone: leadForm.phone.trim(),
          email: leadForm.email.trim(),
          location: leadForm.locationDetail || 'ไม่ได้ระบุ'
        }
      });
    });

    try {
      const existingOutbox = JSON.parse(localStorage.getItem('glp_email_outbox') || '[]');
      localStorage.setItem('glp_email_outbox', JSON.stringify([...newOutboxRecords, ...existingOutbox].slice(0, 50)));
    } catch (err) {
      console.warn('Error recording email outbox:', err);
    }

    // Send real quote emails via Hostinger SMTP Backend Microservice
    try {
      const staffEmails = recipientStaff.map(s => s.email).filter(Boolean);
      fetch('/api/franchise-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: (leadForm.fullName || '').trim(),
          phone: (leadForm.phone || '').trim(),
          email: (leadForm.email || '').trim(),
          location: leadForm.locationDetail || storeLocation || 'ไม่ได้ระบุ',
          budget: totalInvestmentCost,
          pcCount: totalStations,
          quoteRef: newLeadRecord.quoteRef,
          storeType,
          roomDimensions: `${roomWidth} x ${roomHeight} ม. (${roomAreaSqM} ตร.ม.)`,
          themeName: selectedThemeObj ? selectedThemeObj.name : selectedTheme,
          themeDesc: selectedThemeObj ? (selectedThemeObj.tagline || selectedThemeObj.description) : '',
          costBreakdown: {
            hardware: hardwareCost,
            furniture: furnitureItemsCost,
            interiorDecor: interiorDecorCost,
            aircon: airconCost,
            diskless: disklessCost,
            network: networkCost,
            billing: billingCost,
            franchiseFee: franchiseLicenseCost,
            totalInvestment: totalInvestmentCost
          },
          placedModulesCount: placedItems.length,
          smtpConfig: siteData?.smtpConfig,
          staffEmails
        })
      }).then(res => res.json()).then(data => {
        console.log('[Franchise Quote Hostinger SMTP Result]:', data);
      }).catch(err => {
        console.warn('[Franchise Quote SMTP Offline]:', err.message || err);
      });
    } catch (e) {
      console.warn('Quote microservice offline, saved to outbox:', e);
    }

    // 3. Complete submission after simulated dispatch latency to ensure single submit
    setTimeout(() => {
      setIsSubmittingLead(false);
      setShowQuotationModal(false);
      setSubmittedLeadData(currentLeadInfo);
      setShowThankYouPopup(true);
      setRedirectCountdown(5);

      // Start 5-second cooldown relay to prevent rapid double-clicks
      let remaining = 5;
      setLeadCooldown(remaining);
      const timer = setInterval(() => {
        remaining -= 1;
        setLeadCooldown(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    }, 1000);
  };

  // Auto redirect countdown effect when Thank You popup is visible
  useEffect(() => {
    let timer = null;
    if (showThankYouPopup && redirectCountdown > 0) {
      timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
    } else if (showThankYouPopup && redirectCountdown === 0) {
      handleRedirectToHome();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showThankYouPopup, redirectCountdown]);

  const handleRedirectToHome = () => {
    setShowThankYouPopup(false);
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // High-Resolution 2D Architectural & Engineering Blueprint Exporter for Contractors
  const handleExportBlueprintImage = () => {
    const canvas = document.createElement('canvas');
    const tBp = (th, en, zh) => language === 'en' ? en : (language === 'zh' ? (zh || en) : th);
    const canvasWidth = 3200;
    const canvasHeight = 2000;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. White Blueprint Paper Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 2. Blueprint Architectural Outer Border & Framing
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#1e3a8a'; // Deep Navy Engineering Blue
    ctx.strokeRect(36, 36, canvasWidth - 72, canvasHeight - 72);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#93c5fd';
    ctx.strokeRect(46, 46, canvasWidth - 92, canvasHeight - 92);

    // 3. Drawing Header Title Bar
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(50, 50, canvasWidth - 100, 95);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Inter", "Outfit", sans-serif';
    ctx.fillText('GLP : G SPEED LIVING PLUS | ARCHITECTURAL & MEP FITOUT BLUEPRINT', 85, 105);

    ctx.font = '19px "Inter", sans-serif';
    ctx.fillStyle = '#bfdbfe';
    ctx.fillText('แบบแปลนระบบไฟฟ้า, โครงข่าย LAN CAT6A และการจัดวางคอมพิวเตอร์ (สำหรับผู้รับเหมาและวิศวกรระบบ)', 85, 133);

    // Header Right Info
    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText(`DWG NO: GS-BP-${Date.now().toString().slice(-6)}`, canvasWidth - 85, 95);
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillStyle = '#93c5fd';
    ctx.fillText(`สเกลระบบเมตริก (METRIC 1:50) | วันที่อนุมัติ: ${new Date().toLocaleDateString('th-TH')}`, canvasWidth - 85, 126);
    ctx.textAlign = 'left';

    // 4. Drawing Area Boundaries & Layout Division
    // Reserve 880px on the right for huge readable specification schedules
    const rightPanelWidth = 880;
    const drawLeft = 90;
    const drawTop = 180;
    const drawWidth = canvasWidth - rightPanelWidth - 140; // ~2180px for floor plan
    const drawHeight = canvasHeight - 320; // reserve 120px at bottom for contractor notes

    // Calculate scale factor to fit the room in drawing area
    const meterScale = Math.min((drawWidth - 160) / roomWidth, (drawHeight - 160) / roomHeight);
    const roomPxW = roomWidth * meterScale;
    const roomPxH = roomHeight * meterScale;
    const roomOriginX = drawLeft + ((drawWidth - roomPxW) / 2);
    const roomOriginY = drawTop + ((drawHeight - roomPxH) / 2);

    // Draw Room Floor Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(roomOriginX, roomOriginY, roomPxW, roomPxH);

    // 1-Meter Grid Lines with High-Contrast Subdivisions
    ctx.lineWidth = 1;
    for (let x = 0; x <= roomWidth; x += 1) {
      ctx.strokeStyle = x % 5 === 0 ? '#94a3b8' : '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(roomOriginX + (x * meterScale), roomOriginY);
      ctx.lineTo(roomOriginX + (x * meterScale), roomOriginY + roomPxH);
      ctx.stroke();

      // Top Meter Markers
      if (x > 0 && x < roomWidth) {
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 18px "Inter", sans-serif';
        ctx.fillText(`${x}m`, roomOriginX + (x * meterScale) - 14, roomOriginY - 14);
      }
    }

    for (let y = 0; y <= roomHeight; y += 1) {
      ctx.strokeStyle = y % 5 === 0 ? '#94a3b8' : '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(roomOriginX, roomOriginY + (y * meterScale));
      ctx.lineTo(roomOriginX + roomPxW, roomOriginY + (y * meterScale));
      ctx.stroke();

      // Left Meter Markers
      if (y > 0 && y < roomHeight) {
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 18px "Inter", sans-serif';
        ctx.fillText(`${y}m`, roomOriginX - 44, roomOriginY + (y * meterScale) + 6);
      }
    }

    // Outer Room Concrete Walls (Thick Architectural Wall Outline)
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#0f172a';
    ctx.strokeRect(roomOriginX, roomOriginY, roomPxW, roomPxH);

    // Dimension Annotations (Engineering Arrows & Highlight Pills)
    // Top Overall Dimension Line
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1d4ed8';
    ctx.fillStyle = '#1d4ed8';
    const topDimY = roomOriginY - 42;
    ctx.beginPath();
    ctx.moveTo(roomOriginX, topDimY);
    ctx.lineTo(roomOriginX + roomPxW, topDimY);
    ctx.stroke();
    // Arrowheads
    ctx.beginPath(); ctx.moveTo(roomOriginX, topDimY); ctx.lineTo(roomOriginX + 18, topDimY - 8); ctx.lineTo(roomOriginX + 18, topDimY + 8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(roomOriginX + roomPxW, topDimY); ctx.lineTo(roomOriginX + roomPxW - 18, topDimY - 8); ctx.lineTo(roomOriginX + roomPxW - 18, topDimY + 8); ctx.fill();
    
    // Top Dimension Text with White Highlight Pill
    ctx.font = 'bold 26px "Inter", sans-serif';
    ctx.textAlign = 'center';
    const topDimLabel = `ความกว้างห้องรวม ${roomWidth.toFixed(2)} เมตร`;
    const topDimWidth = ctx.measureText(topDimLabel).width;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(roomOriginX + (roomPxW / 2) - (topDimWidth / 2) - 16, topDimY - 38, topDimWidth + 32, 44);
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(roomOriginX + (roomPxW / 2) - (topDimWidth / 2) - 16, topDimY - 38, topDimWidth + 32, 44);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText(topDimLabel, roomOriginX + (roomPxW / 2), topDimY - 8);

    // Left Overall Dimension Line
    const leftDimX = roomOriginX - 68;
    ctx.beginPath();
    ctx.moveTo(leftDimX, roomOriginY);
    ctx.lineTo(leftDimX, roomOriginY + roomPxH);
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(leftDimX, roomOriginY); ctx.lineTo(leftDimX - 8, roomOriginY + 18); ctx.lineTo(leftDimX + 8, roomOriginY + 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(leftDimX, roomOriginY + roomPxH); ctx.lineTo(leftDimX - 8, roomOriginY + roomPxH - 18); ctx.lineTo(leftDimX + 8, roomOriginY + roomPxH - 18); ctx.fill();
    
    // Left text (vertical) with White Highlight Pill
    ctx.save();
    ctx.translate(leftDimX - 22, roomOriginY + (roomPxH / 2));
    ctx.rotate(-Math.PI / 2);
    const leftDimLabel = `ความยาวห้องรวม ${roomHeight.toFixed(2)} เมตร`;
    const leftDimWidth = ctx.measureText(leftDimLabel).width;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(- (leftDimWidth / 2) - 16, -26, leftDimWidth + 32, 44);
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(- (leftDimWidth / 2) - 16, -26, leftDimWidth + 32, 44);
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText(leftDimLabel, 0, 4);
    ctx.restore();
    ctx.textAlign = 'left';

    // Main Entrance Indicator (Dynamic Wall Placement & High-Contrast Directional Arrows)
    const activeWall = doorConfig?.wall || 'right';
    const doorRatio = Math.max(0.15, Math.min(0.85, doorConfig?.offsetRatio ?? 0.75));
    const entranceW = (doorConfig?.width || 1.4) * meterScale;

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#10b981';
    ctx.fillStyle = '#ffffff';

    if (activeWall === 'front') {
      const entranceX = roomOriginX + (roomPxW * doorRatio) - (entranceW / 2);
      ctx.fillRect(entranceX, roomOriginY + roomPxH - 6, entranceW, 14);
      ctx.beginPath();
      ctx.arc(entranceX, roomOriginY + roomPxH, entranceW, -Math.PI / 2, 0);
      ctx.stroke();
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ทางเข้า ⬆', entranceX + (entranceW / 2), roomOriginY + roomPxH + 36);
      ctx.textAlign = 'left';
    } else if (activeWall === 'back') {
      const entranceX = roomOriginX + (roomPxW * doorRatio) - (entranceW / 2);
      ctx.fillRect(entranceX, roomOriginY - 8, entranceW, 14);
      ctx.beginPath();
      ctx.arc(entranceX, roomOriginY, entranceW, 0, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ทางเข้า ⬇', entranceX + (entranceW / 2), roomOriginY - 22);
      ctx.textAlign = 'left';
    } else if (activeWall === 'left') {
      const entranceY = roomOriginY + (roomPxH * doorRatio) - (entranceW / 2);
      ctx.fillRect(roomOriginX - 8, entranceY, 14, entranceW);
      ctx.beginPath();
      ctx.arc(roomOriginX, entranceY, entranceW, 0, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('ทางเข้า ➡', roomOriginX - 16, entranceY + (entranceW / 2) + 7);
      ctx.textAlign = 'left';
    } else {
      const entranceY = roomOriginY + (roomPxH * doorRatio) - (entranceW / 2);
      ctx.fillRect(roomOriginX + roomPxW - 6, entranceY, 14, entranceW);
      ctx.beginPath();
      ctx.arc(roomOriginX + roomPxW, entranceY, entranceW, Math.PI / 2, Math.PI);
      ctx.stroke();
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.fillText('ทางเข้า ⬅', roomOriginX + roomPxW + 16, entranceY + (entranceW / 2) + 7);
    }

    // 5. Electrical & LAN Conduit Lines (Connecting Server Rack to desk clusters)
    const serverItem = placedItems.find(i => i.type === 'server-room' || i.type === 'server-rack' || i.type === 'cashier-counter') || placedItems[0];
    const serverCenterX = serverItem 
      ? roomOriginX + (serverItem.x * meterScale) + (((serverItem.rotation === 90 || serverItem.rotation === 270 ? serverItem.catalog?.heightMeters : serverItem.catalog?.widthMeters) || 1) * meterScale / 2)
      : roomOriginX + (1.5 * meterScale);
    const serverCenterY = serverItem 
      ? roomOriginY + (serverItem.y * meterScale) + (((serverItem.rotation === 90 || serverItem.rotation === 270 ? serverItem.catalog?.widthMeters : serverItem.catalog?.heightMeters) || 1) * meterScale / 2)
      : roomOriginY + (1.5 * meterScale);

    ctx.lineWidth = 2.5;
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.55)'; // Dashed blue conduit lines

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

    // --- Helper Function: High-Detail Architectural Workstation Drawing ---
    const drawGamingWorkstation = (stX, stY, stW, stH, opts = {}) => {
      const isFlipped = opts.isFlipped || false;
      const isVipStation = opts.isVip || false;
      const monLabel = opts.monitorLabel || 'จอ 27" 360Hz';
      const pcLabel = opts.pcLabel || 'PC RTX 4070';
      const deskDim = opts.deskDimLabel || '1.20 ม.';
      
      // 1. Desk Surface Frame
      ctx.fillStyle = isVipStation ? '#fdf4ff' : '#ffffff';
      ctx.fillRect(stX + 2, stY + 2, stW - 4, stH - 4);
      ctx.strokeStyle = isVipStation ? '#a855f7' : '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(stX + 2, stY + 2, stW - 4, stH - 4);

      // Desk Dimension Badge (Large, Bold & Solid Contrast)
      const dimBadgeW = Math.min(stW * 0.45, 88);
      const dimBadgeH = 24;
      const dimBadgeY = isFlipped ? stY + stH - dimBadgeH - 4 : stY + 4;
      ctx.fillStyle = isVipStation ? '#7e22ce' : '#1e3a8a';
      ctx.fillRect(stX + (stW / 2) - (dimBadgeW / 2), dimBadgeY, dimBadgeW, dimBadgeH);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(deskDim, stX + (stW / 2), dimBadgeY + 17);

      // 2. Gaming PC Tower (Corner bracket)
      const towerW = Math.min(stW * 0.18, 28);
      const towerH = Math.min(stH * 0.44, 62);
      const towerX = stX + stW - towerW - 6;
      const towerY = isFlipped ? stY + 8 : stY + stH - towerH - 8;
      
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(towerX, towerY, towerW, towerH);
      ctx.strokeStyle = isVipStation ? '#c084fc' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(towerX, towerY, towerW, towerH);
      
      // PC RGB Fans (2 Glowing Circles)
      ctx.fillStyle = isVipStation ? '#d946ef' : '#06b6d4';
      ctx.beginPath();
      ctx.arc(towerX + (towerW / 2), towerY + (towerH * 0.3), 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(towerX + (towerW / 2), towerY + (towerH * 0.7), 5, 0, Math.PI * 2);
      ctx.fill();

      // PC Tower Tag
      ctx.font = 'bold 11px "Inter", sans-serif';
      ctx.fillStyle = '#93c5fd';
      ctx.fillText(pcLabel, towerX + (towerW / 2), isFlipped ? towerY + towerH + 13 : towerY - 4);

      // 3. Gaming Monitor (Widescreen Fast-IPS / OLED)
      const monW = Math.min(stW * 0.58, 96);
      const monH = 10;
      const monX = stX + (stW / 2) - (monW / 2) - 8;
      const monY = isFlipped ? stY + 12 : stY + stH - monH - 14;

      // Monitor Stand Base
      ctx.fillStyle = '#475569';
      ctx.fillRect(stX + (stW / 2) - 18 - 8, isFlipped ? monY - 5 : monY + monH, 36, 6);

      // Monitor Screen Panel
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(monX, monY, monW, monH);
      ctx.strokeStyle = isVipStation ? '#a855f7' : '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(monX, monY, monW, monH);

      // Cyan Active Screen Line
      ctx.fillStyle = isVipStation ? '#e879f9' : '#38bdf8';
      ctx.fillRect(monX + 2, monY + 2, monW - 4, 3);

      // Monitor Spec Text
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.fillStyle = isVipStation ? '#6b21a8' : '#1e3a8a';
      ctx.fillText(monLabel, stX + (stW / 2) - 8, isFlipped ? monY + monH + 16 : monY - 6);

      // 4. Gaming Deskmat, Keyboard & Mouse
      const padW = Math.min(stW * 0.52, 82);
      const padH = 26;
      const padX = stX + (stW / 2) - (padW / 2) - 8;
      const padY = isFlipped ? monY + 18 : monY - padH - 4;

      // Extended Mat
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(padX, padY, padW, padH);

      // Mechanical Keyboard
      const kbW = Math.min(padW * 0.65, 52);
      const kbH = 16;
      ctx.fillStyle = isVipStation ? '#7c3aed' : '#2563eb';
      ctx.fillRect(padX + 4, padY + 5, kbW, kbH);

      // Gaming Mouse
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(padX + padW - 10, padY + (padH / 2), 5, 0, Math.PI * 2);
      ctx.fill();

      // 5. Electrical & LAN Conduit Box Symbol (⚡ + 🖧)
      const outletX = stX + 6;
      const outletY = isFlipped ? stY + 6 : stY + stH - 26;
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(outletX, outletY, 36, 20);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(outletX, outletY, 36, 20);
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.fillText('⚡220V', outletX + 18, outletY + 14);

      // 6. Ergonomic Gaming Chair
      const chairRadius = 18;
      const chairCenterX = stX + (stW / 2) - 8;
      const chairCenterY = isFlipped ? stY - 24 : stY + stH + 24;

      // Seat Cushion
      ctx.fillStyle = isVipStation ? '#6b21a8' : '#1e40af';
      ctx.beginPath();
      ctx.arc(chairCenterX, chairCenterY, chairRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Headrest Cushion
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(chairCenterX - 14, isFlipped ? chairCenterY + chairRadius - 6 : chairCenterY - chairRadius, 28, 8);

      // 3D Armrests
      ctx.fillRect(chairCenterX - chairRadius - 6, chairCenterY - 10, 6, 20);
      ctx.fillRect(chairCenterX + chairRadius, chairCenterY - 10, 6, 20);

      // Chair Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px "Inter", sans-serif';
      ctx.fillText(tBp('เก้าอี้', 'Chair', '电竞椅'), chairCenterX, chairCenterY + 4);

      ctx.textAlign = 'left'; // reset
    };

    // 6. Detailed Architectural Furniture & Station Renderer
    placedItems.forEach((item, index) => {
      const isRotated = item.rotation === 90 || item.rotation === 270;
      const itemW = (isRotated ? item.catalog?.heightMeters : item.catalog?.widthMeters) || 1;
      const itemH = (isRotated ? item.catalog?.widthMeters : item.catalog?.heightMeters) || 1;
      const pxX = roomOriginX + (item.x * meterScale);
      const pxY = roomOriginY + (item.y * meterScale);
      const pxW = itemW * meterScale;
      const pxH = itemH * meterScale;

      const isServer = item.type === 'server-room' || item.type === 'server-rack';
      const isCounter = item.type === 'cashier-counter' || item.type === 'service-counter';
      const isVip = item.type.includes('vip');
      const isLounge = item.type.includes('sofa') || item.type.includes('lounge');
      const isCafe = item.type.includes('cafe');
      const isStage = item.type.includes('stage');

      if (isServer) {
        // --- Main Server Room & Network Core ---
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(pxX, pxY, pxW, pxH);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(pxX, pxY, pxW, pxH);

        // 2x 42U Server Racks
        const rackW = Math.min((pxW - 40) / 2, 85);
        const rackH = Math.min(pxH - 60, 110);
        const rackY = pxY + 45;

        for (let r = 0; r < 2; r++) {
          const rx = pxX + 20 + (r * (rackW + 15));
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(rx, rackY, rackW, rackH);
          ctx.strokeStyle = '#60a5fa';
          ctx.lineWidth = 2;
          ctx.strokeRect(rx, rackY, rackW, rackH);
          
          // Server rack shelves/blades
          for (let b = 0; b < 4; b++) {
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1;
            ctx.strokeRect(rx + 4, rackY + 6 + (b * 22), rackW - 8, 18);
            // LED lights
            ctx.fillStyle = '#10b981';
            ctx.fillRect(rx + 8, rackY + 12 + (b * 22), 4, 4);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(rx + 16, rackY + 12 + (b * 22), 4, 4);
          }
          
          ctx.fillStyle = '#93c5fd';
          ctx.font = 'bold 12px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(r === 0 ? tBp('ตู้แร็ค 42U: No-Disk', '42U Rack: Diskless', '42U 机柜: 无盘系统') : tBp('ตู้แร็ค 42U: Switch/10G', '42U Rack: 10G Switch', '42U 机柜: 10G 交换机'), rx + (rackW / 2), rackY + rackH + 18);
        }

        // 6kVA Online UPS Unit
        const upsX = pxX + pxW - 140;
        const upsY = rackY;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(upsX, upsY, 120, 52);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(upsX, upsY, 120, 52);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ Online UPS 6kVA', upsX + 60, upsY + 22);
        ctx.font = '11px "Inter", sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(tBp('สำรองไฟฉุกเฉิน 30 นาที', '30-min Emergency Backup', '应急备电 30 分钟'), upsX + 60, upsY + 40);

        // Server Room 24hr Precision AC Unit
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(pxX + 20, pxY + 12, 160, 24);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pxX + 20, pxY + 12, 160, 24);
        ctx.fillStyle = '#0369a1';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.fillText(tBp('❄ แอร์เซิร์ฟเวอร์ 18,000 BTU 24ชม.', '❄ Server AC 18k BTU 24hr', '❄ 机房精密空调 18k BTU 24h'), pxX + 100, pxY + 28);
        ctx.textAlign = 'left';

      } else if (isCounter) {
        // --- Cashier & Reception Counter ---
        ctx.fillStyle = '#fffbeb';
        ctx.fillRect(pxX, pxY, pxW, pxH);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(pxX, pxY, pxW, pxH);

        // Warm wood countertop front edge
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(pxX + 6, pxY + 6, pxW - 12, Math.min(pxH * 0.42, 45));
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.strokeRect(pxX + 6, pxY + 6, pxW - 12, Math.min(pxH * 0.42, 45));

        // 2x POS Touchscreen Terminals
        const posSpacing = (pxW - 140) / 2;
        for (let p = 0; p < 2; p++) {
          const posX = pxX + 30 + (p * (posSpacing + 70));
          const posY = pxY + 10;
          ctx.fillStyle = '#334155';
          ctx.fillRect(posX + 15, posY + 22, 40, 8); // stand
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(posX, posY, 70, 24);
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(posX, posY, 70, 24);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(posX + 3, posY + 3, 64, 5);
          ctx.font = 'bold 12px "Inter", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(tBp(`POS จอสัมผัส #${p + 1}`, `Touch POS #${p + 1}`, `触摸POS机 #${p + 1}`), posX + 35, posY + 17);
        }

        // Cash Drawer & Slip Thermal Printer
        const cashX = pxX + 24;
        const cashY = pxY + Math.min(pxH * 0.45, 50) + 12;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cashX, cashY, 65, 45);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cashX, cashY, 65, 45);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.fillText('ตู้เซฟเก็บเงิน', cashX + 32, cashY + 20);
        ctx.fillText('& ปริ้นเตอร์สลิป', cashX + 32, cashY + 36);

        // Main Electrical Distribution Board (MDB)
        const mdbX = pxX + pxW - 150;
        const mdbY = cashY;
        ctx.fillStyle = '#fff7ed';
        ctx.fillRect(mdbX, mdbY, 125, 45);
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 2;
        ctx.strokeRect(mdbX, mdbY, 125, 45);
        ctx.fillStyle = '#c2410c';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.fillText('⚡ MDB ไฟหลัก 3-Phase', mdbX + 62, mdbY + 20);
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('100A Main Breaker', mdbX + 62, mdbY + 36);

        // CCTV Master Screen
        const cctvX = pxX + (pxW / 2) - 50;
        const cctvY = cashY;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cctvX, cctvY, 100, 45);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cctvX, cctvY, 100, 45);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.fillText('จอมอนิเตอร์ CCTV', cctvX + 50, cctvY + 20);
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText('16 กล้องรอบร้าน', cctvX + 50, cctvY + 36);
        ctx.textAlign = 'left';

      } else if (isVip) {
        // --- VIP Private Bootcamp Suite ---
        ctx.fillStyle = '#faf5ff';
        ctx.fillRect(pxX, pxY, pxW, pxH);
        // Double soundproof acoustic glass outline
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 4;
        ctx.strokeRect(pxX, pxY, pxW, pxH);
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2;
        ctx.strokeRect(pxX + 6, pxY + 6, pxW - 12, pxH - 12);

        // Sliding door arc opening
        const vipDoorW = Math.min(pxW * 0.25, 75);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(pxX + pxW - vipDoorW - 10, pxY + pxH - 8, vipDoorW, 14);
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pxX + pxW - vipDoorW - 10, pxY + pxH, vipDoorW, -Math.PI / 2, 0);
        ctx.stroke();
        ctx.fillStyle = '#7e22ce';
        ctx.font = 'bold 13px "Inter", sans-serif';
        ctx.fillText('ประตูกระจกเก็บเสียง 1.0 ม.', pxX + pxW - vipDoorW - 40, pxY + pxH - 14);

        // Wall-mounted Inverter Air Conditioner
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(pxX + 20, pxY + 12, 110, 22);
        ctx.strokeStyle = '#9333ea';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pxX + 20, pxY + 12, 110, 22);
        ctx.fillStyle = '#6b21a8';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.fillText('❄ แอร์ 24,000 BTU Inverter', pxX + 24, pxY + 27);

        // 5x VIP Pro Battlestations
        const seats = item.catalog?.seats || 5;
        const deskMargin = 16;
        const availableW = pxW - (deskMargin * 2);
        const deskPerSeatW = availableW / seats;
        const deskDepth = Math.min(pxH * 0.42, 68);

        for (let s = 0; s < seats; s++) {
          const stX = pxX + deskMargin + (s * deskPerSeatW);
          const stY = pxY + deskMargin + 25;
          drawGamingWorkstation(stX, stY, deskPerSeatW, deskDepth, {
            isVip: true,
            monitorLabel: '32" OLED 240Hz',
            pcLabel: 'i9+RTX4080',
            deskDimLabel: '1.20 ม.'
          });
        }

      } else if (isCafe) {
        // --- Cafe Bar & Snack Station ---
        ctx.fillStyle = '#ecfdf5';
        ctx.fillRect(pxX, pxY, pxW, pxH);
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 3;
        ctx.strokeRect(pxX, pxY, pxW, pxH);

        // 2-Door Beverage Cooler
        const coolerW = Math.min(pxW * 0.45, 120);
        const coolerH = Math.min(pxH * 0.42, 55);
        ctx.fillStyle = '#065f46';
        ctx.fillRect(pxX + 12, pxY + 12, coolerW, coolerH);
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.strokeRect(pxX + 12, pxY + 12, coolerW, coolerH);
        ctx.fillStyle = '#a7f3d0';
        ctx.fillRect(pxX + 16, pxY + 16, (coolerW / 2) - 6, coolerH - 8);
        ctx.fillRect(pxX + 14 + (coolerW / 2), pxY + 16, (coolerW / 2) - 6, coolerH - 8);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ตู้แช่เครื่องดื่ม 2 ประตู', pxX + 12 + (coolerW / 2), pxY + 12 + (coolerH / 2) + 4);

        // Espresso & Hot Water Bar
        const coffeeX = pxX + coolerW + 25;
        ctx.fillStyle = '#d1fae5';
        ctx.fillRect(coffeeX, pxY + 12, pxW - coolerW - 38, coolerH);
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(coffeeX, pxY + 12, pxW - coolerW - 38, coolerH);
        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.fillText('บาร์กาแฟสด & กาน้ำร้อน', coffeeX + ((pxW - coolerW - 38) / 2), pxY + 12 + (coolerH / 2) + 4);

        // Snack Shelves & Microwave
        const snackY = pxY + coolerH + 20;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(pxX + 12, snackY, pxW - 24, pxH - coolerH - 32);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pxX + 12, snackY, pxW - 24, pxH - coolerH - 32);
        ctx.fillStyle = '#047857';
        ctx.font = 'bold 13px "Inter", sans-serif';
        ctx.fillText('ชั้นวางขนมขบเคี้ยว & บะหมี่กึ่งสำเร็จรูป + จุดไมโครเวฟ', pxX + (pxW / 2), snackY + ((pxH - coolerH - 32) / 2) + 4);
        ctx.textAlign = 'left';

      } else if (isLounge) {
        // --- Spectator Esports Lounge ---
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(pxX, pxY, pxW, pxH);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;
        ctx.strokeRect(pxX, pxY, pxW, pxH);

        // L-Shape Sectional Sofa
        ctx.fillStyle = '#334155';
        ctx.fillRect(pxX + 16, pxY + 16, pxW - 32, 45);
        ctx.fillRect(pxX + 16, pxY + 55, 55, pxH - 75);
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.strokeRect(pxX + 16, pxY + 16, pxW - 32, 45);
        ctx.strokeRect(pxX + 16, pxY + 55, 55, pxH - 75);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ชุดโซฟา L-Shape รองรับผู้ชม', pxX + (pxW / 2), pxY + 42);

        // Glass Coffee Table
        const tableX = pxX + 85;
        const tableY = pxY + 75;
        const tableW = Math.min(pxW - 110, 120);
        const tableH = Math.min(pxH - 95, 45);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(tableX, tableY, tableW, tableH);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tableX, tableY, tableW, tableH);
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.fillText('โต๊ะกลางกระจก', tableX + (tableW / 2), tableY + (tableH / 2) + 4);

        // Wall-mounted 75" 4K Smart TV
        const tvW = Math.min(pxW - 40, 180);
        const tvX = pxX + (pxW / 2) - (tvW / 2);
        const tvY = pxY + pxH - 24;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(tvX, tvY, tvW, 14);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tvX, tvY, tvW, 14);
        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.fillText('📺 Smart TV 75" ถ่ายทอดสด Esports (Soundbar 5.1)', pxX + (pxW / 2), tvY - 8);
        ctx.textAlign = 'left';

      } else {
        // --- Standard & Pro Gaming Desk Modules (Single, Double, Quad, Island-6) ---
        ctx.fillStyle = '#eff6ff';
        ctx.fillRect(pxX, pxY, pxW, pxH);
        ctx.strokeStyle = '#1d4ed8';
        ctx.lineWidth = 3;
        ctx.strokeRect(pxX, pxY, pxW, pxH);

        const seats = item.catalog?.seats || 2;
        const isDoubleSidedIsland = seats >= 6 && item.type.includes('island');

        if (isDoubleSidedIsland) {
          // Island 6: 3 PCs top row, 3 PCs bottom row facing each other
          const cols = Math.ceil(seats / 2);
          const colW = pxW / cols;
          const rowH = pxH / 2;

          // Center Cable Duct / Acoustic Divider
          ctx.fillStyle = '#1e3a8a';
          ctx.fillRect(pxX, pxY + rowH - 12, pxW, 24);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚡ รางปลั๊กเมน 220V 16A x 6 จุด  |  🖧 ตู้กระจายสาย LAN CAT6A 10G', pxX + (pxW / 2), pxY + rowH + 4);
          ctx.textAlign = 'left';

          for (let c = 0; c < cols; c++) {
            const deskX = pxX + (c * colW);

            // Row 1 (facing down towards center)
            drawGamingWorkstation(deskX, pxY + 3, colW, rowH - 14, {
              isFlipped: false,
              monitorLabel: 'จอ 27" 360Hz',
              pcLabel: 'RTX 4070',
              deskDimLabel: '1.20 ม.'
            });

            // Row 2 (facing up towards center)
            drawGamingWorkstation(deskX, pxY + rowH + 12, colW, rowH - 14, {
              isFlipped: true,
              monitorLabel: 'จอ 27" 360Hz',
              pcLabel: 'RTX 4070',
              deskDimLabel: '1.20 ม.'
            });
          }
        } else {
          // Linear Row (1, 2, 4 seats)
          const seatW = pxW / seats;

          // Back cable tray / wire channel
          ctx.fillStyle = '#dbeafe';
          ctx.fillRect(pxX + 3, pxY + 3, pxW - 6, 12);
          ctx.fillStyle = '#1e40af';
          ctx.font = 'bold 11px "Inter", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚡ รางปลั๊ก 220V + 🖧 รางสาย LAN CAT6A', pxX + (pxW / 2), pxY + 12);
          ctx.textAlign = 'left';

          for (let s = 0; s < seats; s++) {
            const stationX = pxX + (s * seatW);
            drawGamingWorkstation(stationX, pxY + 16, seatW, pxH - 22, {
              isFlipped: false,
              monitorLabel: 'จอ 27" 360Hz',
              pcLabel: 'RTX 4070',
              deskDimLabel: '1.20 ม.'
            });
          }
        }
      }

      // High-Contrast Tag Overlay for Each Module (Placed outside module to prevent obscuring equipment)
      const title = item.catalog?.name?.split('(')[0] || item.type;
      const dimBadge = `กว้าง ${itemW.toFixed(1)} x ลึก ${itemH.toFixed(1)} ม.`;
      
      const badgeH = 48;
      const badgeW = Math.min(Math.max(pxW, 260), 440);
      let badgeX = pxX;
      let badgeY = pxY - badgeH - 8;
      
      // If module is close to top wall, place badge below the module
      if (badgeY < roomOriginY + 8) {
        badgeY = pxY + pxH + 8;
      }
      
      if (!isServer) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
        ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
        ctx.strokeStyle = isVip ? '#9333ea' : (isCounter ? '#d97706' : (isCafe ? '#059669' : '#1d4ed8'));
        ctx.lineWidth = 2.5;
        ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);

        ctx.fillStyle = isVip ? '#6b21a8' : (isCounter ? '#92400e' : (isCafe ? '#065f46' : '#1e3a8a'));
        ctx.font = 'bold 18px "Inter", sans-serif';
        ctx.fillText(`[#${index + 1}] ${title.slice(0, 25)}`, badgeX + 12, badgeY + 22);

        ctx.fillStyle = '#334155';
        ctx.font = 'bold 14px "Inter", sans-serif';
        ctx.fillText(`${dimBadge} ${item.catalog?.seats ? `| ${item.catalog.seats} เครื่อง (โต๊ะ 1.20ม.)` : ''}`, badgeX + 12, badgeY + 41);
      }
    });

    // 7. Right Engineering Panel: Extra Large & Highly Detailed Specifications for Contractors
    const infoPanelX = canvasWidth - rightPanelWidth - 60;
    const infoPanelY = 180;
    const infoPanelW = rightPanelWidth;
    const infoPanelH = canvasHeight - 320;

    // Background panel
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(infoPanelX, infoPanelY, infoPanelW, infoPanelH);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(infoPanelX, infoPanelY, infoPanelW, infoPanelH);

    let currentY = infoPanelY;

    // --- Section 1: Project Metadata ---
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(infoPanelX, currentY, infoPanelW, 46);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.fillText(tBp('1. ข้อมูลโครงการและงานระบบอาคาร (PROJECT & MEP METADATA)', '1. PROJECT & MEP METADATA', '1. 项目与建筑机电工程信息 (PROJECT & MEP METADATA)'), infoPanelX + 18, currentY + 30);
    currentY += 62;

    const metaRows = [
      [tBp('ชื่อโครงการ (Project Name):', 'Project Name:', '项目名称:'), 'GLP : G SPEED LIVING PLUS OFFICIAL STORE'],
      [tBp('ขนาดพื้นที่ร้านรวม (Total Venue):', 'Total Venue Area:', '场地总面积:'), `${roomWidth} x ${roomHeight} ${tBp('เมตร', 'm', '米')} (${roomWidth * roomHeight} ${tBp('ตร.ม.', 'sq.m.', '平米')})`],
      [tBp('จำนวนสถานีคอมพิวเตอร์ (Capacity):', 'Gaming Station Capacity:', '电竞工作站容量:'), `${totalStations} ${tBp('เครื่อง (สัดส่วน 1 PC / 2.3 ตร.ม.)', 'Stations (Std: 1 PC / 2.3 sq.m.)', '台 (标准: 1 PC / 2.3平米)')}`],
      [tBp('จำนวนโมดูลเฟอร์นิเจอร์ทั้งหมด:', 'Total Placed Furniture Modules:', '总家具与设备模块数:'), `${placedItems.length} ${tBp('โมดูลหลัก (รวมงานระบบ)', 'Primary Modules (Turnkey)', '个主要模块 (含总包机电)')}`],
      [tBp('ทำเลที่ตั้งสาขา (Site Location):', 'Branch Site Location:', '门店选址位置:'), translateDynamic(storeLocation, language)],
      [tBp('ระบบไฟฟ้าและโหลดเมนรวม (MDB):', 'Main Electrical Distribution (MDB):', '主配电系统 (MDB):'), tBp('3 Phase 380V / 100A พร้อมตู้ MDB แยกเบรกเกอร์ย่อย', '3 Phase 380V / 100A with Sub-Breakers', '3相 380V / 100A 配电柜带独立空气开关')],
      [tBp('โครงข่ายอินเทอร์เน็ต (Internet):', 'High-Speed Enterprise Internet:', '企业级高速网络:'), 'Dual 10Gbps SFP+ Fiber Optic Active-Active Failover']
    ];

    metaRows.forEach(([lbl, val]) => {
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.fillText(lbl, infoPanelX + 18, currentY);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px "Inter", sans-serif';
      ctx.fillText(val, infoPanelX + 320, currentY);
      currentY += 28;
    });

    // --- Section 2: Complete PC Hardware Specifications ---
    currentY += 12;
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(infoPanelX, currentY, infoPanelW, 46);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.fillText(tBp(`2. สเปกคอมพิวเตอร์และอุปกรณ์ครบชุด (PC SPECIFICATIONS - ${currentTierInfo.name.toUpperCase()})`, `2. PC HARDWARE & ESPORTS GEAR SPECIFICATIONS - ${(currentTierInfo.name || '').toUpperCase()}`, `2. 电竞PC硬件与外设完整规格 - ${(currentTierInfo.name || '').toUpperCase()}`), infoPanelX + 18, currentY + 30);
    currentY += 62;

    const pcSpecs = [
      [tBp('หน่วยประมวลผล (Processor CPU):', 'Processor (CPU):', '处理器 (CPU):'), currentTierInfo.cpu || 'Intel Core i7-14700F / AMD Ryzen 7 7800X3D (Liquid Cooler)'],
      [tBp('การ์ดแสดงผล (Graphics Card GPU):', 'Graphics Card (GPU):', '显卡 (GPU):'), currentTierInfo.gpu || 'NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X Dual/Triple Fan'],
      [tBp('หน่วยความจำหลัก (RAM System):', 'System Memory (RAM):', '运行内存 (RAM):'), currentTierInfo.ram || '32GB DDR5 6000MHz Dual-Channel Low Latency RGB'],
      [tBp('จอแสดงผลการแข่งขัน (Esports Monitor):', 'Esports Gaming Monitor:', '电竞赛事显示器:'), currentTierInfo.monitor || '27" Fast-IPS 280Hz - 360Hz QHD DyAc Ready (0.5ms Response)'],
      [tBp('ชุดเกมมิ่งเกียร์ (Gaming Gear Set):', 'Esports Gaming Gear Set:', '电竞外设套装:'), currentTierInfo.gear || 'Custom Coiled Keyboard (Hotswap) + Ultralight 4K/8K Hz Mouse + Headset 7.1'],
      [tBp('เซิร์ฟเวอร์ดิสก์เลส (Diskless Boot Master):', 'Diskless Master Server:', '无盘主服务器:'), '10G SFP+ Dual Master Server (Enterprise NVMe PCIe 4.0 Array + Auto Updater)'],
      [tBp('ระบบพาวเวอร์ซัพพลาย (Power Supply PSU):', 'Power Supply Unit (PSU):', '电源供应器 (PSU):'), tBp('750W - 850W 80+ Gold Fully Modular Active PFC รับประกัน 5 ปี', '750W - 850W 80+ Gold Fully Modular Active PFC (5-Yr Warranty)', '750W - 850W 80+ 金牌全模组 (5年保修)')],
      [tBp('การเชื่อมต่อระบบเครือข่าย (LAN Interface):', 'Network Interface (LAN):', '网络接入 (LAN):'), tBp('RJ-45 CAT6A Shielded 1000/2500 Mbps ต่อเครื่อง 1:1 เข้า Switch 10G', 'RJ-45 CAT6A Shielded 1000/2500 Mbps Dedicated 1:1 to 10G Switch', 'RJ-45 CAT6A 屏蔽线 1000/2500 Mbps 1:1直连10G交换机')]
    ];

    pcSpecs.forEach(([part, spec]) => {
      ctx.fillStyle = '#1d4ed8';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.fillText(part, infoPanelX + 18, currentY);
      ctx.fillStyle = '#1e293b';
      ctx.font = '15px "Inter", sans-serif';
      
      if (spec.length > 46) {
        ctx.fillText(spec.slice(0, 46), infoPanelX + 320, currentY);
        currentY += 22;
        ctx.fillText(spec.slice(46), infoPanelX + 320, currentY);
      } else {
        ctx.fillText(spec, infoPanelX + 320, currentY);
      }
      currentY += 28;
    });

    // --- Section 3: Desk Dimensions, Materials & Furniture Schedule ---
    currentY += 12;
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(infoPanelX, currentY, infoPanelW, 46);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.fillText(tBp('3. รายละเอียดสเปกโต๊ะและเก้าอี้ติดตั้ง (DESK & FURNITURE SCHEDULE)', '3. DESK & ERGONOMIC FURNITURE SCHEDULE', '3. 电竞桌椅定制工程规格 (DESK & FURNITURE SCHEDULE)'), infoPanelX + 18, currentY + 30);
    currentY += 62;

    const deskSpecs = [
      [tBp('ขนาดโต๊ะต่อที่นั่ง (Station Dimensions):', 'Station Dimensions:', '工位尺寸规格:'), tBp('กว้าง 1.20 x ลึก 0.80 x สูง 0.75 ม. (ระยะตามมาตรฐาน Pro Player)', 'W 1.20 x D 0.80 x H 0.75 m (Pro Esports Standard)', '宽 1.20 x 深 0.80 x 高 0.75 米 (职业电竞标准)')],
      [tBp('หน้าท็อปโต๊ะ (Desk Tabletop Material):', 'Tabletop Material:', '桌面材质规格:'), tBp('ไม้สังเคราะห์เกรด HPL หนา 25 มม. ทนรอยขีดข่วน/ความร้อน/น้ำ 100%', '25mm Heavy-Duty HPL Composite (Scratch & Heat Resistant, 100% Waterproof)', '25mm 高耐磨HPL复合板 (耐刮擦、耐热、100%防水)')],
      [tBp('การขึ้นรูปขอบโต๊ะ (Ergonomic Bevel Edge):', 'Ergonomic Bevel Edge:', '人体工学倾角封边:'), tBp('ลบมุมลาดเอียง 45 องศา ลดแรงกดทับข้อมือขณะเล่นเกมต่อเนื่อง', '45° Beveled Ergonomic Front Edge (Reduces wrist fatigue during extended gaming)', '45度人体工学斜切导角 (有效缓解长时间电竞腕部压力)')],
      [tBp('โครงสร้างขาและคาน (Steel Frame Structure):', 'Steel Frame Structure:', '钢架承重结构:'), tBp('เหล็กกล้าคาร์บอน (Carbon Steel) หนา 1.5 มม. อบสีพาวเดอร์โค้ตกันสนิม', '1.5mm Carbon Steel Box Tubing with Anti-Rust Powder Coating (250kg load)', '1.5mm 高强度碳素冷轧钢管 + 防锈静电喷粉涂装 (承重250kg)')],
      [tBp('ระบบท่อร้อยสายไฟ (Dual Wire Raceway):', 'Dual Cable Raceway:', '双通道隐藏式走线槽:'), tBp('รางเหล็กใต้โต๊ะแยกอิสระ 2 ช่อง: ช่องไฟ 220V และช่องสายสัญญาณ LAN', 'Under-Desk Dual Trunking: Separate 220V Power & Shielded LAN (Zero Interference)', '桌底双通道阻燃金属线槽: 强电220V与弱电网线隔离 (防电磁干扰)')],
      [tBp('เก้าอี้เกมมิ่งมืออาชีพ (Ergonomic Chair):', 'Professional Esports Chair:', '职业电竞人体工学椅:'), currentTierInfo.chair || 'G-Speed Pro Racing PU Leather / Ergonomic Mesh'],
      [tBp('ระบบปรับระดับเก้าอี้ (Ergonomic Adjustability):', 'Ergonomic Adjustability:', '全功能调节系统:'), tBp('ที่พักแขน 4D ปรับได้ 4 ทิศทาง + เบาะปรับเอนนอน 160° + ปรับหนุนหลัง', '4D Adjustable Armrests + 160° Reclining Backrest + Multi-tilt Lock', '4D全向调节扶手 + 160°大角度后仰躺倒 + 摇椅锁定机构')],
      [tBp('การรับประกันสินค้า (Warranty Coverage):', 'Warranty Coverage:', '售后质保政策:'), tBp('รับประกันโครงสร้างโต๊ะ 5 ปี และเก้าอี้เกมมิ่ง 3 ปี On-site Service', '5-Year Desk Structural Warranty & 3-Year On-Site Chair Service', '电竞桌钢架质保5年，电竞椅上门售后质保3年')]
    ];

    deskSpecs.forEach(([itemTitle, itemVal]) => {
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.fillText(itemTitle, infoPanelX + 18, currentY);
      ctx.fillStyle = '#0f172a';
      ctx.font = '14.5px "Inter", sans-serif';

      if (itemVal.length > 46) {
        ctx.fillText(itemVal.slice(0, 46), infoPanelX + 320, currentY);
        currentY += 22;
        ctx.fillText(itemVal.slice(46), infoPanelX + 320, currentY);
      } else {
        ctx.fillText(itemVal, infoPanelX + 320, currentY);
      }
      currentY += 28;
    });

    // --- Section 4: Placed Modules Breakdown Table ---
    currentY += 12;
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(infoPanelX, currentY, infoPanelW, 46);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Inter", sans-serif';
    ctx.fillText(tBp('4. รายการโมดูลและจุดติดตั้งในผัง (EQUIPMENT SCHEDULE TABLE)', '4. VENUE EQUIPMENT & MODULE SCHEDULE TABLE', '4. 店面设备与家具定位明细表 (EQUIPMENT SCHEDULE TABLE)'), infoPanelX + 18, currentY + 30);
    currentY += 58;

    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(tBp('ลำดับ  ชื่อรายการโมดูล             พิกัด (X,Y)     ขนาดโมดูล        จำนวนสถานี / สเปก', 'No.    Module Name             Coord (X,Y)    Dimensions       Capacity / Specs', '序号   模块名称                坐标 (X,Y)      尺寸规格         工位数量 / 规格'), infoPanelX + 18, currentY);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(infoPanelX + 18, currentY + 8); ctx.lineTo(infoPanelX + infoPanelW - 18, currentY + 8); ctx.stroke();
    currentY += 28;

    ctx.font = '14.5px "Inter", sans-serif';
    placedItems.slice(0, 8).forEach((it, idx) => {
      const name = (it.catalog?.name?.split('(')[0] || it.type).slice(0, 18);
      const coords = `(${it.x.toFixed(1)}, ${it.y.toFixed(1)})`;
      const size = `${it.catalog?.widthMeters || 1}x${it.catalog?.heightMeters || 1}m`;
      const seatInfo = it.catalog?.seats ? `${it.catalog.seats} PCs (${tBp('โต๊ะ 1.20ม.', '1.2m Desk', '1.2米标准桌')})` : tBp('Facility จุดบริการ', 'Facility Service Zone', '公共配套服务区');
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`#${idx + 1}    ${name.padEnd(20, ' ')} ${coords.padEnd(12, ' ')} ${size.padEnd(12, ' ')} ${seatInfo}`, infoPanelX + 18, currentY);
      currentY += 26;
    });

    if (placedItems.length > 8) {
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 14px "Inter", sans-serif';
      ctx.fillText(tBp(`... และยังมีอีก ${placedItems.length - 8} รายการในบัญชีรายการผลิตและการติดตั้ง`, `... plus ${placedItems.length - 8} additional items scheduled in full contractor manifest`, `... 另有 ${placedItems.length - 8} 项家具与设备已列入施工制造总清单`), infoPanelX + 18, currentY);
    }

    // 8. Bottom Contractor Notes Banner (Extra Large & Highly Detailed for Field Contractors)
    const notesY = canvasHeight - 120;
    ctx.fillStyle = '#eff6ff';
    ctx.fillRect(90, notesY, canvasWidth - rightPanelWidth - 140, 80);
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = 2;
    ctx.strokeRect(90, notesY, canvasWidth - rightPanelWidth - 140, 80);

    ctx.fillStyle = '#1e3a8a';
    ctx.font = 'bold 18px "Inter", sans-serif';
    ctx.fillText(tBp('ข้อกำหนดสำคัญสำหรับผู้รับเหมาและวิศวกรระบบ (GENERAL CONTRACTOR & MEP SPECIFICATIONS):', 'GENERAL CONTRACTOR & MEP ENGINEERING SPECIFICATIONS:', '施工承包商与机电工程师核心规范 (GENERAL CONTRACTOR & MEP SPECIFICATIONS):'), 110, notesY + 28);

    ctx.fillStyle = '#334155';
    ctx.font = '15px "Inter", sans-serif';
    ctx.fillText(tBp('1. ขนาดโต๊ะเกมมิ่งมาตรฐาน: กว้าง 1.20 ม. ลึก 0.80 ม. ต่อสถานี เว้นระยะทางเดินหลัก (Main Clearance) ไม่น้อยกว่า 1.20 - 1.50 ม. ตามกฎหมายอาคาร', '1. Standard Gaming Station: W 1.20m x D 0.80m per seat. Maintain Main Aisle Clearance >= 1.20 - 1.50m per building code.', '1. 标准电竞工作站: 每工位宽1.20米、深0.80米。主通道净宽须保持不小于1.20 - 1.50米符合消防与建筑规范。'), 110, notesY + 50);
    ctx.fillText(tBp('2. จุดเต้ารับไฟฟ้า 220V 16A เต้ารับคู่ 3 ขา มีกราวด์ (Grounding <= 5 Ohm) ต่อเครื่อง 1:1 พร้อมรางร้อยสาย LAN CAT6A แยกท่อห่างสายเมน 30 ซม.', '2. Electrical: 220V 16A grounded dual socket (Grounding <= 5 Ohm) 1:1 per PC. CAT6A LAN conduit separated 30cm from main power.', '2. 电力工程: 220V 16A带接地双三孔插座 (接地电阻<=5欧姆) 1:1专机专供。CAT6A双屏蔽网线与强电主线路间距须大于30cm。'), 110, notesY + 70);

    // 9. Trigger Direct Browser Download and show high-res visual preview modal
    const blueprintFilename = `GSPEED-Contractor-Blueprint-${roomWidth}x${roomHeight}m-${Date.now().toString().slice(-4)}.png`;
    try {
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setExportedBlueprintModal({
        dataUrl,
        filename: blueprintFilename
      });
      downloadFile(dataUrl, blueprintFilename, 'image/png');
    } catch (e) {
      console.error('Failed to export blueprint:', e);
      downloadFile(canvas, blueprintFilename, 'image/png');
    }
  };

  const selectedItemObject = placedItems.find(item => item.id === selectedItemId);

  return (
    <div className="franchise-planner-page">
      {/* 1. STANDARDIZED COMPACT WORKFLOW STEPPER & ACTION BAR (ACROSS ALL STEPS) */}
      <section className="studio-compact-header glass-panel">
        <div className="container studio-compact-header-inner">
          {/* Step Navigation Breadcrumbs */}
          <div className="studio-compact-steps">
            <button 
              type="button" 
              id="btn-step-compact-1"
              className={`studio-step-pill ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`} 
              onClick={() => handleStepChange(1)}
              title={tp('tabStoreSize', 'ขั้นตอนที่ 1: กำหนดขนาดห้องและแปลนอาคาร')}
            >
              <span className={`step-num ${currentStep === 1 ? 'active' : ''}`}>1</span>
              <span className="step-txt">
                <span className="hide-mobile">{tp('step1_crumb', 'ขนาด')} {roomWidth}x{roomHeight} {tp('metersUnit', 'ม.')}</span>
                <span className="show-mobile">{tp('step1_crumb_mobile', 'ขนาดห้อง')}</span>
              </span>
              {currentStep === 1 && <span className="studio-active-dot"></span>}
            </button>
            <ChevronRight size={14} className="studio-step-sep" />
            <button 
              type="button" 
              id="btn-step-compact-2"
              className={`studio-step-pill ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`} 
              onClick={() => handleStepChange(2)}
              title={tp('tabLayout', 'ขั้นตอนที่ 2: จัดผังร้าน 3D Studio & แปลน 2D')}
            >
              <span className={`step-num ${currentStep === 2 ? 'active' : ''}`}>2</span>
              <span className="step-txt">
                <span className="hide-mobile">{tp('step2_crumb', 'จัดผัง 3D Studio')}</span>
                <span className="show-mobile">{tp('step2_crumb_mobile', 'ผัง 3D')}</span>
              </span>
              {currentStep === 2 && <span className="studio-active-dot"></span>}
            </button>
            <ChevronRight size={14} className="studio-step-sep" />
            <button 
              type="button" 
              id="btn-step-compact-3"
              className={`studio-step-pill ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`} 
              onClick={() => handleStepChange(3)}
              title={tp('tabHardware', 'ขั้นตอนที่ 3: เลือกระดับสเปกฮาร์ดแวร์')}
            >
              <span className={`step-num ${currentStep === 3 ? 'active' : ''}`}>3</span>
              <span className="step-txt">
                <span className="hide-mobile">{tp('step3_crumb', 'สเปกคอม')}</span>
                <span className="show-mobile">{tp('step3_crumb_mobile', 'สเปก')}</span>
              </span>
              {currentStep === 3 && <span className="studio-active-dot"></span>}
            </button>
            <ChevronRight size={14} className="studio-step-sep" />
            <button 
              type="button" 
              id="btn-step-compact-4"
              className={`studio-step-pill ${currentStep === 4 ? 'active' : ''}`} 
              onClick={() => handleStepChange(4)}
              title={tp('tabQuote', 'ขั้นตอนที่ 4: สรุปงบประมาณและผลตอบแทน ROI')}
            >
              <span className={`step-num ${currentStep === 4 ? 'active' : ''}`}>4</span>
              <span className="step-txt">
                <span className="hide-mobile">{tp('step4_crumb', 'งบ & ROI')}</span>
                <span className="show-mobile">{tp('step4_crumb_mobile', 'สรุปงบ')}</span>
              </span>
              {currentStep === 4 && <span className="studio-active-dot"></span>}
            </button>
          </div>

          {/* Quick Metrics & CTA */}
          <div className="studio-compact-metrics">
            <div className="compact-metric-pill">
              <span className="metric-tag">{currentStep === 1 ? tp('metricArea', 'พื้นที่:') : tp('metricCapacity', 'ความจุ:')}</span>
              <strong className="text-blue">
                {currentStep === 1 ? `${roomAreaSqM} ${tp('sqmUnit', 'ตร.ม.')}` : `${totalStations} ${tp('stationsCountUnit', 'เครื่อง')}`}
              </strong>
            </div>
            <div className="compact-metric-pill hide-mobile">
              <span className="metric-tag">{currentStep === 4 ? tp('metricPayback', 'คืนทุน:') : tp('metricInvestment', 'งบลงทุน:')}</span>
              <strong className="text-emerald">
                {currentStep === 4 ? `${paybackMonths} ${tp('months', 'เดือน')}` : `฿${totalInvestmentCost.toLocaleString()}`}
              </strong>
            </div>
            <button 
              type="button" 
              id="btn-open-quote-summary-compact"
              onClick={() => setShowQuotationModal(true)} 
              className="btn-compact-quote"
            >
              <Download size={14} />
              <span>{tp('quoteSummaryBtn', 'สรุปใบเสนอราคา')}</span>
            </button>
            {currentStep === 1 && (
              <button 
                type="button" 
                id="btn-next-step2-compact"
                onClick={() => handleStepChange(2)} 
                className="btn-compact-next"
              >
                <span>{tp('step1_nextBtn', 'เริ่มจัดผัง 3D')}</span>
                <ArrowRight size={14} />
              </button>
            )}
            {currentStep === 2 && (
              <button 
                type="button" 
                id="btn-next-step3-compact"
                onClick={() => handleStepChange(3)} 
                className="btn-compact-next"
              >
                <span>{tp('chooseSpecsBtn', 'เลือกสเปก →')}</span>
                <ArrowRight size={14} />
              </button>
            )}
            {currentStep === 3 && (
              <button 
                type="button" 
                id="btn-next-step4-compact"
                onClick={() => handleStepChange(4)} 
                className="btn-compact-next"
              >
                <span>{tp('step3_nextBtn', 'ดูงบ & ROI')}</span>
                <ArrowRight size={14} />
              </button>
            )}
            {currentStep === 4 && (
              <button 
                type="button" 
                id="btn-export-pdf-compact"
                onClick={() => setShowQuotationModal(true)} 
                className="btn-compact-next"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
              >
                <Printer size={14} />
                <span>{tp('step4_printQuote', 'พิมพ์ใบเสนอราคา (A4)')}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. STEP 1: LOCATION & ROOM SETUP */}
      {currentStep === 1 && (
        <section className="step-content-section container">
          <div className="setup-grid">
            {/* Left Form: Size, Dimensions & Blueprint AI Setup */}
            <div className="setup-card glass-panel">
              <h3 className="setup-card-title">
                <LayoutGrid size={20} className="text-cyan" />
                <span>{tp('step1_setupTitle', 'กำหนดขนาดห้องและแปลนอาคาร')}</span>
              </h3>
              <p className="setup-card-desc">
                {tp('step1_setupDesc', 'เลือกโมเดลขนาดห้องสำเร็จรูป (Preset) เป็นค่าพื้นฐานเพื่อเริ่มคำนวณและวางผังได้ทันที หรือเลือกตัวเลือกเสริมอัปโหลดแปลนพิมพ์เขียวอาคารจริง')}
              </p>

              {/* Setup Mode Switcher Tabs */}
              <div className="setup-mode-tabs">
                <button 
                  type="button"
                  id="tab-setup-preset"
                  className={`setup-mode-tab-btn ${setupMethod === 'preset' ? 'active' : ''}`}
                  onClick={() => setSetupMethod('preset')}
                >
                  <LayoutGrid size={16} />
                  <span>{tp('step1_presetTab', 'กำหนดค่า')}</span>
                  <span className="badge-preset-default">{tp('step1_defaultBadge', 'ค่าเริ่มต้น')}</span>
                </button>
                <button 
                  type="button"
                  id="tab-setup-blueprint"
                  className={`setup-mode-tab-btn ${setupMethod === 'blueprint' ? 'active' : ''}`}
                  onClick={() => setSetupMethod('blueprint')}
                >
                  <UploadCloud size={16} />
                  <span>{tp('step1_blueprintTab', 'อัปโหลดแปลนอาคาร')}</span>
                  <span className="badge-optional-choice">{tp('step1_optionalBadge', 'ตัวเลือกเสริม AI')}</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input 
                type="file" 
                accept="image/*,.webp,image/webp" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />

              {/* TAB 1 (DEFAULT): PRESET MODELS & MANUAL SLIDERS */}
              {setupMethod === 'preset' && (
                <div className="preset-mode-content">
                  {/* Preset Buttons */}
                  <div className="preset-selector-group">
                    <label className="form-label">{tp('step1_roomPresets', 'เลือกโมเดลขนาดสำเร็จรูป (Preset Models):')}</label>
                    <div className="preset-cards-grid">
                      {PRESET_ROOMS.map(preset => (
                        <div 
                          key={preset.id} 
                          className={`preset-card ${roomWidth === preset.width && roomHeight === preset.height ? 'selected' : ''}`}
                          onClick={() => handleLoadPreset(preset)}
                        >
                          <div className="preset-head">
                            <strong>{translateDynamic(preset.name)}</strong>
                            <span className="preset-dim">{preset.width}x{preset.height} {tp('metersUnit', 'ม.')}</span>
                          </div>
                          <p className="preset-info">{translateDynamic(preset.desc)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Sliders */}
                  <div className="dimension-sliders">
                    <div className="slider-group">
                      <div className="slider-header">
                        <label>{tp('step1_widthM', 'ความกว้างห้อง (Width):')}</label>
                        <span className="slider-val text-cyan">{roomWidth} {tp('metersUnit', 'เมตร')}</span>
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
                        <label>{tp('step1_lengthM', 'ความลึก/ความยาวห้อง (Length):')}</label>
                        <span className="slider-val text-cyan">{roomHeight} {tp('metersUnit', 'เมตร')}</span>
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
                    <span>{tp('totalAreaLabel', 'พื้นที่ใช้สอยรวม:')} <strong>{roomAreaSqM} {tp('sqmUnit', 'ตารางเมตร')}</strong></span>
                    <span>({tp('supportsApprox', 'รองรับได้ประมาณ')} <strong>{idealMaxPCs} {tp('stationsCountUnit', 'เครื่อง')}</strong> {tp('comfortableSeating', 'แบบไม่อึดอัด')})</span>
                  </div>
                  {/* Switch to Blueprint Mode Suggestion */}
                  <div 
                    style={{ 
                      marginTop: '16px', 
                      padding: '12px 14px', 
                      background: '#f0f9ff', 
                      border: '1px solid #bae6fd', 
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <span style={{ color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Compass size={16} className="text-blue" />
                      <span>{tp('haveBlueprintPrompt', 'มีแบบแปลนพิมพ์เขียวอาคารจริงของคุณอยู่แล้ว?')}</span>
                    </span>
                    <button 
                      type="button"
                      className="btn-text-blue" 
                      style={{ fontWeight: 700, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => setSetupMethod('blueprint')}
                    >
                      <span>{tp('switchToBlueprint', 'สลับไปอัปโหลดแปลน (ตัวเลือกเสริม)')}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2 (OPTIONAL): BLUEPRINT UPLOAD & SMART FEASIBILITY */}
              {setupMethod === 'blueprint' && (
                <div className="blueprint-mode-content">
                  {/* Dropzone if no blueprint */}
                  {!uploadedBlueprint && !isAnalyzingBlueprint && (
                    <div 
                      className={`blueprint-dropzone-box ${isDraggingFile ? 'dragging' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                      onDragLeave={() => setIsDraggingFile(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingFile(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) processBlueprintFile(file);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="blueprint-dropzone-icon">
                        <UploadCloud size={28} />
                      </div>
                      <div className="blueprint-dropzone-title">
                        {tp('dragBlueprintHint', 'ลากไฟล์แปลนอาคารมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์ (ตัวเลือกเสริม)')}
                      </div>
                      <p className="blueprint-dropzone-sub">
                        {tp('blueprintFormatsHint', 'รองรับไฟล์ภาพแบบแปลนพิมพ์เขียว, ภาพวาดผังร้าน, สเก็ตช์ 2D, ไฟล์สแกน (PNG, JPG, WEBP)')}
                      </p>
                      <div className="blueprint-dropzone-actions" onClick={e => e.stopPropagation()}>
                        <button 
                          type="button"
                          className="btn-primary"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <UploadCloud size={15} />
                          <span>{tp('selectBlueprintFile', 'เลือกไฟล์แปลนจากเครื่อง')}</span>
                        </button>
                        <button 
                          type="button"
                          className="btn-secondary"
                          onClick={handleUseSampleBlueprint}
                        >
                          <Sparkles size={15} />
                          <span>{tp('useSampleBlueprint', 'ทดลองใช้แปลนตัวอย่างอาคารพาณิชย์')}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* If Analyzing */}
                  {isAnalyzingBlueprint && (
                    <div className="blueprint-analyzing-spinner">
                      <RefreshCw size={24} className="spin-icon text-cyan" />
                      <span>{tp('aiScanningBlueprint', 'AI กำลังสแกนแปลนอาคาร วัดสเกลพื้นที่ และคำนวณการจัดสรรโซนร้านเกม...')}</span>
                    </div>
                  )}

                  {/* Blueprint Loaded & Calculated View */}
                  {uploadedBlueprint && !isAnalyzingBlueprint && (
                    <div className="blueprint-loaded-view">
                      {/* Thumbnail & File Details */}
                      <div className="blueprint-image-box" style={{ marginBottom: '16px' }}>
                        <div className="blueprint-image-tag">
                          <CheckCircle2 size={15} className="text-emerald" />
                          <span>{tp('blueprintAttached', 'แนบแปลนสำเร็จ:')} <strong>{uploadedBlueprint.name}</strong> ({uploadedBlueprint.size})</span>
                        </div>
                        <div className="blueprint-img-frame" style={{ height: '180px' }}>
                          <img src={uploadedBlueprint.url} alt="Floor Plan Blueprint Preview" />
                        </div>
                        <div className="blueprint-image-actions">
                          <button type="button" className="btn-text-danger" onClick={handleRemoveBlueprint}>
                            <Trash2 size={13} /> {tp('deleteBlueprint', 'ลบแปลนนี้')}
                          </button>
                          <button type="button" className="btn-text-blue" onClick={() => fileInputRef.current?.click()}>
                            <RotateCw size={13} /> {tp('changeBlueprint', 'เปลี่ยนไฟล์ใหม่')}
                          </button>
                        </div>
                      </div>

                      {/* Dimension Calibration Sliders */}
                      <div className="dimension-sliders" style={{ marginBottom: '16px' }}>
                        <div className="slider-group">
                          <div className="slider-header">
                            <label>{tp('actualBuildingWidth', 'ความกว้างอาคารจริง (Width):')}</label>
                            <span className="slider-val text-cyan">{roomWidth} {tp('metersUnit', 'เมตร')}</span>
                          </div>
                          <input 
                            type="range" 
                            min="6" 
                            max="30" 
                            step="1" 
                            value={roomWidth} 
                            onChange={e => setRoomWidth(Number(e.target.value))}
                            className="custom-range"
                          />
                        </div>

                        <div className="slider-group">
                          <div className="slider-header">
                            <label>{tp('actualBuildingLength', 'ความลึก/ความยาวอาคารจริง (Length):')}</label>
                            <span className="slider-val text-cyan">{roomHeight} {tp('metersUnit', 'เมตร')}</span>
                          </div>
                          <input 
                            type="range" 
                            min="6" 
                            max="25" 
                            step="1" 
                            value={roomHeight} 
                            onChange={e => setRoomHeight(Number(e.target.value))}
                            className="custom-range"
                          />
                        </div>

                        <div className="area-summary-pill" style={{ marginTop: '8px' }}>
                          <span>{tp('totalAreaLabel', 'พื้นที่ใช้สอยรวม:')} <strong>{roomAreaSqM} {tp('sqmUnit', 'ตารางเมตร')}</strong></span>
                        </div>
                      </div>

                      {/* AI Feasibility Stats Grid */}
                      <div className="blueprint-calc-summary" style={{ marginBottom: '16px' }}>
                        <div className="calc-stat-box">
                          <span className="lbl">{tp('recommendedCapacity', 'ความจุเครื่องที่แนะนำ:')}</span>
                          <strong className="val text-cyan">{blueprintFeasibility.recommendedStations} {tp('stationsCountUnit', 'เครื่อง')}</strong>
                        </div>
                        <div className="calc-stat-box">
                          <span className="lbl">{tp('estimatedCapex', 'งบลงทุนประมาณการ:')}</span>
                          <strong className="val text-blue">฿{blueprintFeasibility.estimatedCapex.toLocaleString()}</strong>
                        </div>
                        <div className="calc-stat-box">
                          <span className="lbl">{tp('estimatedMonthlyProfit', 'กำไรสุทธิคาดการณ์:')}</span>
                          <strong className="val text-emerald">฿{blueprintFeasibility.estimatedMonthlyProfit.toLocaleString()} / {tp('months', 'ด.')}</strong>
                        </div>
                        <div className="calc-stat-box">
                          <span className="lbl">{tp('roiPaybackPeriod', 'จุดคุ้มทุน (ROI):')}</span>
                          <strong className="val text-purple">~{blueprintFeasibility.paybackMonths} {tp('months', 'เดือน')}</strong>
                        </div>
                      </div>

                      {/* Zone Allocation Pills */}
                      <div style={{ marginBottom: '14px' }}>
                        <label className="form-label" style={{ marginBottom: '8px' }}>{tp('calculatedZoneAllocation', 'การจัดสรรสัดส่วนโซนที่คำนวณได้:')}</label>
                        <div className="zones-breakdown-grid">
                          {blueprintFeasibility.detectedZones.map((zone, idx) => (
                            <div key={idx} className="zone-pill-item">
                              <div className="zone-color-bar" style={{ backgroundColor: zone.color }}></div>
                              <div className="zone-info">
                                <strong>{translateDynamic(zone.name)}</strong>
                                <div className="zone-meta">
                                  <span>{translateDynamic(zone.area)}</span>
                                  <span className="bullet">•</span>
                                  <span className="zone-capacity text-cyan">{translateDynamic(zone.stations)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Layout Guidelines Box */}
                      <div className="blueprint-guidelines-box">
                        <div className="guidelines-header">
                          <Sparkles size={16} className="text-cyan" />
                          <span>{tp('smartLayoutAdviceTitle', 'คำแนะนำเชิงกลยุทธ์การจัดวางผังร้าน (Smart Layout Advice)')}</span>
                        </div>
                        <div className="guidelines-grid">
                          <div className="guideline-card">
                            <div className="guideline-icon amber">
                              <DoorOpen size={16} />
                            </div>
                            <div className="guideline-content">
                              <h5>{tp('guideline1_title', '1. ทางเข้า & เคาน์เตอร์แคชเชียร์')}</h5>
                              <p>{tp('guideline1_desc', 'ตั้งขนานประตูทางเข้า คุมทัศนวิสัย 180 องศา ต้อนรับลูกค้าทันทีและดูแลความปลอดภัย')}</p>
                            </div>
                          </div>

                          <div className="guideline-card">
                            <div className="guideline-icon blue">
                              <Monitor size={16} />
                            </div>
                            <div className="guideline-content">
                              <h5>{tp('guideline2_title', '2. แนวโต๊ะคอม (Island Back-to-Back)')}</h5>
                              <p>{tp('guideline2_desc', 'วางเกาะกลางหันหลังชนกัน ซ่อนรางสายไฟและท่อแอร์ลงกลางโต๊ะ ประหยัดสายแลน 40% เว้นทางเดิน 1.5 ม.')}</p>
                            </div>
                          </div>

                          <div className="guideline-card">
                            <div className="guideline-icon purple">
                              <Shield size={16} />
                            </div>
                            <div className="guideline-content">
                              <h5>{tp('guideline3_title', '3. ห้องซ้อม VIP Bootcamp Suite')}</h5>
                              <p>{tp('guideline3_desc', 'กั้นห้องกระจกเก็บเสียงโซนด้านในสุด ลดเสียงรบกวน เหมาะกับการฝึกซ้อมทีมและสตรีมเมอร์')}</p>
                            </div>
                          </div>

                          <div className="guideline-card">
                            <div className="guideline-icon emerald">
                              <Server size={16} />
                            </div>
                            <div className="guideline-content">
                              <h5>{tp('guideline4_title', '4. ห้องเซิร์ฟเวอร์ & ตู้ไฟ MDB')}</h5>
                              <p>{tp('guideline4_desc', 'วางชิดผนังมุมหลังร้าน แยกห้องล็อก ปลอดภัย ติดตั้งระบบ UPS สำรองไฟและแอร์เฉพาะตัว 24 ชม.')}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="blueprint-cta-row" style={{ marginTop: '16px' }}>
                        <button 
                          type="button"
                          id="btn-apply-blueprint-to-studio"
                          className="btn-auto-layout-primary"
                          onClick={handleApplyAutoLayout}
                        >
                          <Sparkles size={18} />
                          <span>{tp('autoLayoutBtn', 'จัดวางผังร้านอัตโนมัติ')}</span>
                          <ArrowRight size={18} />
                        </button>
                        <button 
                          type="button"
                          className="btn-auto-layout-secondary"
                          onClick={() => setCurrentStep(2)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Ruler size={15} />
                          <span>{tp('manualLayoutBtn', 'จัดวางผังด้วยตนเอง')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                  {/* Switch back to Preset Suggestion */}
                  <div 
                    style={{ 
                      marginTop: '16px', 
                      padding: '12px 14px', 
                      background: '#f8fafc', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sliders size={15} className="text-blue" />
                      <span>{tp('wantStandardPreset', 'ต้องการใช้ขนาดห้องและโมเดลสำเร็จรูปมาตรฐาน?')}</span>
                    </span>
                    <button 
                      type="button"
                      className="btn-text-blue" 
                      style={{ fontWeight: 700, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => setSetupMethod('preset')}
                    >
                      <span>{tp('switchToStandardPreset', 'สลับไปใช้โมเดลสำเร็จรูป (ค่าเริ่มต้น)')}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Form: Location & Theme */}
            <div className="setup-card glass-panel">
              {/* Active Blueprint / Space Badge */}
              {uploadedBlueprint ? (
                <div className="blueprint-source-badge">
                  <Building2 size={16} />
                  <span>{tp('usingBlueprint', 'ใช้แปลนอาคาร:')} <strong>{uploadedBlueprint.name}</strong> ({roomWidth}x{roomHeight} {tp('metersUnit', 'ม.')} | {roomAreaSqM} {tp('sqmUnit', 'ตร.ม.')})</span>
                </div>
              ) : (
                <div className="blueprint-source-badge">
                  <LayoutGrid size={16} />
                  <span>{tp('simulatedSpaceSize', 'ขนาดพื้นที่จำลอง:')} <strong>{roomWidth}x{roomHeight} {tp('metersUnit', 'เมตร')} ({roomAreaSqM} {tp('sqmUnit', 'ตร.ม.')})</strong></span>
                </div>
              )}

              <h3 className="setup-card-title">
                <Compass size={20} className="text-magenta" />
                <span>{tp('step1_locationCardTitle', 'ข้อมูลทำเล & ธีมการตกแต่ง')}</span>
              </h3>

              <div className="form-group">
                <label className="form-label">{tp('step1_provinceLabel', 'จังหวัด / โซนที่ตั้งร้าน')}</label>
                <select 
                  value={storeLocation} 
                  onChange={e => setStoreLocation(e.target.value)}
                  className="form-select"
                >
                  <option value="กรุงเทพฯ และปริมณฑล">{tp('loc_bkk', 'กรุงเทพฯ และปริมณฑล (ย่านมหาวิทยาลัย/ชุมชน)')}</option>
                  <option value="เชียงใหม่ / ภาคเหนือ">{tp('loc_cm', 'เชียงใหม่ / ภาคเหนือ')}</option>
                  <option value="ขอนแก่น / โคราช / ภาคอีสาน">{tp('loc_esan', 'ขอนแก่น / โคราช / ภาคอีสาน')}</option>
                  <option value="ชลบุรี / พัทยา / ภาคตะวันออก">{tp('loc_east', 'ชลบุรี / พัทยา / ภาคตะวันออก')}</option>
                  <option value="ภูเก็ต / สงขลา / ภาคใต้">{tp('loc_south', 'ภูเก็ต / สงขลา / ภาคใต้')}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{tp('step1_storeTypeLabel', 'ประเภทอาคาร / สถานที่')}</label>
                <select 
                  value={storeType} 
                  onChange={e => setStoreType(e.target.value)}
                  className="form-select"
                >
                  <option value="อาคารพาณิชย์ (Commercial Building)">{tp('type_shophouse', 'อาคารพาณิชย์ 2-3 คูหา (Commercial Shophouse)')}</option>
                  <option value="พื้นที่เช่าในศูนย์การค้า (Mall)">{tp('type_mall', 'พื้นที่เช่าในศูนย์การค้า / ไลฟ์สไตล์มอลล์ (Shopping Mall)')}</option>
                  <option value="อาคารเดี่ยว (Standalone)">{tp('type_standalone', 'อาคารเดี่ยว Standalone หรือโกดัง Renovate')}</option>
                  <option value="ใกล้มหาวิทยาลัย">{tp('type_campus', 'ใกล้มหาวิทยาลัย / หอพักนักศึกษา')}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{tp('step1_themeLabel', 'ธีมการตกแต่งร้าน (Interior Style)')}</label>
                <div className="theme-options-grid">
                  {availableThemes.map((theme) => {
                    const primaryColor = theme.palette?.[0]?.hex || (theme.id === 'royal' ? '#1d4ed8' : theme.id === 'luxury' ? '#f59e0b' : '#10b981');
                    const isSelected = selectedTheme === theme.id;

                    return (
                      <div 
                        key={theme.id}
                        className={`theme-option ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedTheme(theme.id)}
                      >
                        <div 
                          className="theme-color-bar" 
                          style={{ background: primaryColor }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                          <strong>{translateDynamic(theme.name)}</strong>
                          {theme.badge && (
                            <span style={{ 
                              fontSize: '0.68rem', 
                              fontWeight: 700, 
                              padding: '1px 7px', 
                              borderRadius: '999px',
                              background: primaryColor + '18',
                              color: primaryColor,
                              border: `1px solid ${primaryColor}33`,
                              display: 'inline-block'
                            }}>
                              {translateDynamic(theme.badge)}
                            </span>
                          )}
                        </div>
                        <span>{translateDynamic(theme.tagline || theme.description)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="setup-actions">
                <button 
                  id="btn-step1-to-step2"
                  onClick={() => handleStepChange(2)} 
                  className="btn-primary full-width"
                >
                  <span>{tp('step1_nextBtn', 'ถัดไป: จัดผังร้าน')}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. STEP 2: 3D INTERIOR STUDIO & 2D FLOOR PLAN */}
      {currentStep === 2 && (
        <section className={`step-content-section container ${isPlannerFullscreen ? 'planner-fullscreen-mode' : ''} ${isWalkMode ? 'walk-mode-active planner-walk-fullscreen' : ''} ${forceLandscapeRotate ? 'force-landscape-active' : ''}`}>
          {/* Sticky Exit Fullscreen Button - Visible on All Screens & Devices (ONLY ONE EXIT BUTTON) */}
          {(isPlannerFullscreen || isWalkMode) && (
            <button
              type="button"
              id="btn-sticky-exit-fullscreen"
              className="btn-sticky-exit-fullscreen"
              onClick={async () => {
                if (isWalkMode) {
                  setIsWalkMode(false);
                }
                if (isPlannerFullscreen) {
                  await handleExitFullscreen();
                }
              }}
              title={isWalkMode ? tp('exitWalk', 'ออกจากโหมดเดิน (ESC)') : tp('exitFullscreen', 'ออกจากเต็มจอ (ESC)')}
            >
              <Minimize2 size={16} />
              <span>{isWalkMode ? tp('exitWalk', 'ออกจากโหมดเดิน (ESC)') : tp('exitFullscreen', 'ออกจากเต็มจอ (ESC)')}</span>
            </button>
          )}

          {/* Landscape Orientation Guide for Tablets/Mobiles in Fullscreen Mode */}
          {isPlannerFullscreen && !isWalkMode && (
            <div className="planner-fullscreen-landscape-bar">
              <div className="landscape-bar-info">
                <span className="landscape-icon">🔄</span>
                <span className="landscape-text">{tp('step2_landscapeHint', 'โหมดเต็มจอ: แนะนำหมุน iPad / แท็บเล็ต เป็นแนวนอนเพื่อมุมมองที่ดีที่สุด')}</span>
              </div>
              <button
                type="button"
                className="btn-landscape-rotate-toggle"
                onClick={() => setForceLandscapeRotate(prev => !prev)}
                title={tp('step2_rotateLandscape', 'สลับหมุนจอ 90°')}
              >
                <span>{forceLandscapeRotate ? tp('step2_restoreLandscape', 'คืนค่ามุมมองปกติ') : tp('step2_rotateLandscape', 'บังคับหมุนจอ 90°')}</span>
              </button>
            </div>
          )}

          {/* Top Control Bar: View Switcher & Material Customization */}
          {!isWalkMode && (
          <div className="planner-top-controls glass-panel">
            {/* View Mode Toggle */}
            <div className="view-mode-toggle-group">
              <span className="control-group-label">{tp('viewModeLabel', 'โหมดแสดงผล:')}</span>
              <div className="view-mode-btns">
                <button 
                  id="btn-view-mode-3d"
                  className={`btn-mode-switch ${viewMode === '3d' ? 'active' : ''}`}
                  onClick={() => setViewMode('3d')}
                >
                  <Box size={16} />
                  <span className="view-mode-txt-full">{tp('mode3D', '3D Studio')}</span>
                  <span className="view-mode-txt-short">3D</span>
                </button>
                <button 
                  id="btn-view-mode-2d"
                  className={`btn-mode-switch ${viewMode === '2d' ? 'active' : ''}`}
                  onClick={() => setViewMode('2d')}
                >
                  <LayoutGrid size={16} />
                  <span className="view-mode-txt-full">{tp('mode2D', '2D Blueprint (แปลน 2 มิติ)')}</span>
                  <span className="view-mode-txt-short">{tp('topDown', '2D แปลน')}</span>
                </button>
                <button 
                  type="button"
                  id="btn-step2-auto-layout"
                  className="btn-toolbar-auto-layout"
                  onClick={handleApplyAutoLayout}
                  title="AI Auto-Layout"
                >
                  <Sparkles size={14} />
                  <span>{tp('autoLayout', 'จัดผังอัตโนมัติ')}</span>
                </button>
                {!isPlannerFullscreen && (
                  <button 
                    type="button" 
                    id="btn-topbar-fullscreen-toggle"
                    className="btn-topbar-fullscreen"
                    onClick={handleToggleFullscreen}
                    title={tp('fullscreen', 'เปิดสตูดิโอเต็มหน้าจอ (Zen Mode)')}
                  >
                    <Maximize2 size={14} />
                    <span>{tp('fullscreen', 'ขยายเต็มจอ')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Blueprint Overlay Controls (if blueprint is attached) */}
            {uploadedBlueprint && (
              <div className="blueprint-overlay-controls">
                <button 
                  id="btn-toggle-blueprint-overlay"
                  className={`btn-toggle-overlay ${showBlueprintOverlay ? 'active' : ''}`}
                  onClick={() => setShowBlueprintOverlay(!showBlueprintOverlay)}
                  title={tp('toggleBlueprintHint', 'เปิด/ปิดการแสดงผังแปลนที่แนบ')}
                >
                  <SplitSquareVertical size={14} />
                  <span>{tp('refBlueprint', 'แปลนอ้างอิง:')} {showBlueprintOverlay ? tp('stateOn', 'เปิดอยู่') : tp('stateOff', 'ปิด')}</span>
                </button>
                {showBlueprintOverlay && (
                  <div className="opacity-slider-box">
                    <span className="opacity-label">{tp('opacityLabel', 'ความชัด:')} {Math.round(blueprintOpacity * 100)}%</span>
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

            {/* Quick Material & Catalog Indicator Pills (Slim Homestyler Topbar) */}
            <div className="topbar-quick-shortcuts">
              <button
                type="button"
                id="btn-topbar-door"
                className={`btn-topbar-pill ${inspectorTab === 'door' || selectedItemId === 'store-door' ? 'active' : ''}`}
                onClick={() => {
                  setInspectorTab('door');
                  setSelectedItemId('store-door');
                }}
                title={tp('adjustDoorHeaderHint', 'คลิกเพื่อปรับตำแหน่งประตูทางเข้าร้านและป้ายชื่อร้าน (ในแถบซ้าย)')}
              >
                <DoorOpen size={13} className="text-emerald" />
                <span>{tp('quickDoor', 'ประตู: ')}{getWallName(doorConfig.wall)}</span>
                <span className="pill-dot" style={{ backgroundColor: '#10b981' }} />
              </button>

              <button
                type="button"
                className={`btn-topbar-pill ${inspectorTab === 'materials' ? 'active' : ''}`}
                onClick={() => {
                  setInspectorTab('materials');
                  if (selectedItemId === 'store-door') setSelectedItemId(null);
                }}
                title={tp('adjustMaterialsHeaderHint', 'คลิกเพื่อเปลี่ยนวอลเปเปอร์ผนังและวัสดุพื้น')}
              >
                <Palette size={13} className="text-blue" />
                <span>{tp('quickTheme', 'โทนสี')}</span>
                <span className="pill-dot" style={{ backgroundColor: WALLPAPERS.find(w => w.id === selectedWallpaper)?.color || '#e2e8f0' }} title={tp('wallColor', 'สีผนัง')} />
                <span className="pill-dot floor-dot" style={{ backgroundColor: FLOOR_MATERIALS.find(f => f.id === selectedFloorMaterial)?.color || '#b45309' }} title={tp('floorColor', 'สีพื้น')} />
              </button>

              <button
                type="button"
                className={`btn-topbar-pill btn-topbar-add-pill ${inspectorTab === 'catalog' ? 'active' : ''}`}
                onClick={() => {
                  setInspectorTab('catalog');
                  if (selectedItemId === 'store-door') setSelectedItemId(null);
                }}
                title={tp('addItemsHeaderHint', 'คลิกเพื่อเปิดแท็บเพิ่มอุปกรณ์ (ในแถบซ้าย)')}
              >
                <PlusCircle size={13} className="text-blue" />
                <span>{tp('quickAdd', '+ เพิ่มอุปกรณ์')}</span>
              </button>
            </div>
          </div>
          )}

          <div className="planner-canvas-layout">
            {/* ========================================================================= */}
            {/* LEFT SIDEBAR: UNIFIED MANAGEMENT STUDIO (Details, Door, Materials, Add)  */}
            {/* ========================================================================= */}
            {!isWalkMode && (
            <div className="studio-management-sidebar glass-panel">
              {/* 4-Tab Segmented Header */}
              <div className="inspector-tabs-nav">
                <button 
                  type="button"
                  id="tab-btn-details"
                  className={`inspector-tab-btn ${inspectorTab === 'details' && selectedItemId !== 'store-door' ? 'active' : ''}`}
                  onClick={() => {
                    setInspectorTab('details');
                    if (selectedItemId === 'store-door') setSelectedItemId(null);
                  }}
                  title={tp('tabItemsTooltip', 'ดูรายละเอียดอุปกรณ์ที่เลือก และรายการอุปกรณ์ในร้าน')}
                >
                  <Sliders size={14} />
                  <span>{tp('tabDetails', 'รายละเอียด')}</span>
                  {placedItems.length > 0 && (
                    <span className="tab-pill-count">{placedItems.length}</span>
                  )}
                </button>

                <button 
                  type="button"
                  id="tab-btn-door"
                  className={`inspector-tab-btn ${inspectorTab === 'door' || selectedItemId === 'store-door' ? 'active' : ''}`}
                  onClick={() => {
                    setInspectorTab('door');
                    setSelectedItemId('store-door');
                  }}
                  title={tp('tabDoorTooltip', 'ปรับแต่งตำแหน่งประตูทางเข้าร้าน รูปแบบประตู และป้ายชื่อร้าน')}
                >
                  <DoorOpen size={13} />
                  <span>{tp('tabDoor', 'ประตูร้าน')}</span>
                </button>

                <button 
                  type="button"
                  id="tab-btn-materials"
                  className={`inspector-tab-btn ${inspectorTab === 'materials' ? 'active' : ''}`}
                  onClick={() => {
                    setInspectorTab('materials');
                    if (selectedItemId === 'store-door') setSelectedItemId(null);
                  }}
                  title={tp('tabMaterialsTooltip', 'ปรับแต่งวอลเปเปอร์ผนังและวัสดุปูพื้นห้อง')}
                >
                  <Palette size={13} />
                  <span>{tp('tabMaterials', 'ผนัง/พื้น')}</span>
                </button>

                <button 
                  type="button"
                  id="tab-btn-catalog"
                  className={`inspector-tab-btn ${inspectorTab === 'catalog' ? 'active' : ''}`}
                  onClick={() => {
                    setInspectorTab('catalog');
                    if (selectedItemId === 'store-door') setSelectedItemId(null);
                  }}
                  title={tp('tabCatalogTooltip', 'เลือกและเพิ่มอุปกรณ์/โต๊ะคอมลงในผัง')}
                >
                  <PlusCircle size={13} />
                  <span>{tp('tabCatalogShort', 'เพิ่มอุปกรณ์')}</span>
                </button>
              </div>

              {/* TAB: ประตูทางเข้า หรือเมื่อเลือก store-door */}
              {(inspectorTab === 'door' || selectedItemId === 'store-door') && (
                <div className="inspector-tab-content tab-details-content">
                  <div className="selected-item-inspector-expanded door-inspector-panel">
                      <div className="insp-head">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span className="badge-pill badge-emerald">
                            <DoorOpen size={13} />
                            <span>{tp('archStructureBadge', 'โครงสร้างสถาปัตยกรรม')}</span>
                          </span>
                          <button 
                            type="button" 
                            className="btn-popover-close-mini" 
                            onClick={() => {
                              setSelectedItemId(null);
                              if (inspectorTab === 'door') setInspectorTab('details');
                            }}
                            title={tp('closeDoorConfigTooltip', 'ปิดหน้าต่างปรับประตู')}
                          >
                            ✕
                          </button>
                        </div>
                        <h4>{tp('mainEntranceDoor', 'ประตูทางเข้าร้านหลัก')}</h4>
                        <p className="sub-desc" style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0 0' }}>
                          {tp('storeEntranceDesc', 'Store Entrance • ปรับผนัง สัดส่วนระยะ และรูปแบบประตูหน้าร้าน')}
                        </p>
                      </div>

                      {/* Door Wall Selector */}
                      <div className="spatial-control-card" style={{ marginTop: '12px' }}>
                        <div className="control-section-title">
                          <Compass size={14} className="text-emerald" />
                          <span>{tp('selectDoorWall', 'เลือกผนังติดตั้งประตู:')}</span>
                        </div>
                        <div className="wall-selector-grid" style={{ marginTop: '8px' }}>
                          <button 
                            type="button" 
                            className={`wall-btn ${doorConfig.wall === 'front' ? 'active' : ''}`}
                            onClick={() => setDoorConfig({ ...doorConfig, wall: 'front' })}
                          >
                            <ArrowDown size={14} /> {tp('wallFrontFull', 'ด้านหน้า (Front)')}
                          </button>
                          <button 
                            type="button" 
                            className={`wall-btn ${doorConfig.wall === 'right' || !doorConfig.wall ? 'active' : ''}`}
                            onClick={() => setDoorConfig({ ...doorConfig, wall: 'right' })}
                          >
                            <ArrowRight size={14} /> {tp('wallRightFull', 'ผนังขวา (Right)')}
                          </button>
                          <button 
                            type="button" 
                            className={`wall-btn ${doorConfig.wall === 'left' ? 'active' : ''}`}
                            onClick={() => setDoorConfig({ ...doorConfig, wall: 'left' })}
                          >
                            <ArrowLeft size={14} /> {tp('wallLeftFull', 'ผนังซ้าย (Left)')}
                          </button>
                          <button 
                            type="button" 
                            className={`wall-btn ${doorConfig.wall === 'back' ? 'active' : ''}`}
                            onClick={() => setDoorConfig({ ...doorConfig, wall: 'back' })}
                          >
                            <ArrowUp size={14} /> {tp('wallBackFull', 'ผนังหลัง (Back)')}
                          </button>
                        </div>
                      </div>

                      {/* Position Along Wall Slider */}
                      <div className="spatial-control-card" style={{ marginTop: '12px' }}>
                        <div className="control-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Sliders size={14} className="text-emerald" />
                            <span>{tp('positionAlongWall', 'ตำแหน่งตามแนวผนัง:')}</span>
                          </div>
                          <span className="slider-val-mini text-emerald" style={{ fontWeight: 800 }}>{Math.round((doorConfig.offsetRatio ?? 0.75) * 100)}%</span>
                        </div>
                        <div className="door-offset-presets" style={{ marginTop: '8px' }}>
                          <button type="button" className="btn-preset-offset" onClick={() => setDoorConfig({ ...doorConfig, offsetRatio: 0.25 })}>
                            {doorConfig.wall === 'front' || doorConfig.wall === 'back' ? tp('presetLeft25', 'ซ้าย 25%') : tp('presetBack25', 'หลัง 25%')}
                          </button>
                          <button type="button" className="btn-preset-offset" onClick={() => setDoorConfig({ ...doorConfig, offsetRatio: 0.50 })}>
                            {tp('presetCenter50', 'ตรงกลาง 50%')}
                          </button>
                          <button type="button" className="btn-preset-offset" onClick={() => setDoorConfig({ ...doorConfig, offsetRatio: 0.75 })}>
                            {doorConfig.wall === 'front' || doorConfig.wall === 'back' ? tp('presetRight75', 'ขวา 75%') : tp('presetFront75', 'หน้า 75%')}
                          </button>
                        </div>
                        <input 
                          type="range"
                          min="0.15"
                          max="0.85"
                          step="0.05"
                          value={doorConfig.offsetRatio ?? 0.75}
                          onChange={(e) => setDoorConfig({ ...doorConfig, offsetRatio: parseFloat(e.target.value) })}
                          className="custom-range"
                          style={{ marginTop: '10px' }}
                        />
                      </div>

                      {/* Door Style Selection */}
                      <div className="spatial-control-card" style={{ marginTop: '12px' }}>
                        <div className="control-section-title">
                          <DoorClosed size={14} className="text-emerald" />
                          <span>{tp('doorStyleLabel', 'รูปแบบประตู:')}</span>
                        </div>
                        <div className="door-style-pills" style={{ marginTop: '8px' }}>
                          <button 
                            type="button"
                            className={`door-pill ${doorConfig.style === 'glass-single' || doorConfig.style === 'wood' ? 'active' : ''}`}
                            onClick={() => setDoorConfig({ ...doorConfig, style: 'glass-single' })}
                          >
                            <DoorClosed size={16} />
                            <span>{tp('doorSingleOption', 'แบบ 1 บาน (ฟิล์มดำ)')}</span>
                          </button>
                          <button 
                            type="button"
                            className={`door-pill ${doorConfig.style === 'glass-double' || doorConfig.style === 'glass' || !doorConfig.style || doorConfig.style === 'auto-sliding' ? 'active' : ''}`}
                            onClick={() => setDoorConfig({ ...doorConfig, style: 'glass-double' })}
                          >
                            <SplitSquareVertical size={16} />
                            <span>{tp('doorDoubleOption', 'แบบ 2 บาน (ฟิล์มดำ)')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Store Name / Signage Input */}
                      <div className="spatial-control-card" style={{ marginTop: '12px' }}>
                        <div className="control-section-title">
                          <Building2 size={14} className="text-cyan" />
                          <span>{tp('storeNameInputLabel', 'ชื่อร้าน / ป้ายกล่องไฟ 3D หน้าร้าน:')}</span>
                        </div>
                        <input 
                          type="text"
                          value={doorConfig.storeName || 'GLP : G SPEED LIVING PLUS'}
                          onChange={(e) => setDoorConfig({ ...doorConfig, storeName: e.target.value })}
                          placeholder={tp('storeNamePlaceholder', 'เช่น GLP : G SPEED LIVING PLUS...')}
                          className="store-name-card-input"
                          maxLength={36}
                          style={{ marginTop: '8px', width: '100%' }}
                        />
                        <div className="store-name-presets" style={{ marginTop: '6px' }}>
                          {['GLP : G SPEED LIVING PLUS', 'G-SPEED LIVING PLUS', tp('presetSiamSquare', 'สาขา สยามสแควร์'), 'GLP CYBER LOUNGE'].map((preset) => (
                            <button 
                              key={preset}
                              type="button" 
                              className="btn-preset-name"
                              onClick={() => setDoorConfig({ ...doorConfig, storeName: preset })}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sign & Decal Style */}
                      <div className="spatial-control-card" style={{ marginTop: '12px' }}>
                        <div className="control-section-title">
                          <Sparkles size={14} className="text-amber" />
                          <span>{tp('signStyleInputLabel', 'สไตล์ป้ายไฟ & สติ๊กเกอร์:')}</span>
                        </div>
                        <div className="door-style-pills" style={{ marginTop: '8px' }}>
                          <button 
                            type="button" 
                            className={`door-pill ${doorConfig.signStyle === 'neon-lightbox' || !doorConfig.signStyle ? 'active' : ''}`}
                            onClick={() => setDoorConfig({ ...doorConfig, signStyle: 'neon-lightbox' })}
                          >
                            <Sparkles size={14} />
                            <span>{tp('signNeonLed', 'นีออน LED')}</span>
                          </button>
                          <button 
                            type="button" 
                            className={`door-pill ${doorConfig.signStyle === 'acrylic-gold' ? 'active' : ''}`}
                            onClick={() => setDoorConfig({ ...doorConfig, signStyle: 'acrylic-gold' })}
                          >
                            <Award size={14} />
                            <span>{tp('signGoldAcrylic', 'อะคริลิกทอง')}</span>
                          </button>
                          <button 
                            type="button" 
                            className={`door-pill ${doorConfig.signStyle === 'minimal-dark' ? 'active' : ''}`}
                            onClick={() => setDoorConfig({ ...doorConfig, signStyle: 'minimal-dark' })}
                          >
                            <Zap size={14} />
                            <span>{tp('signMinimalCyber', 'มินิมอลไซเบอร์')}</span>
                          </button>
                          <button 
                            type="button" 
                            className={`door-pill ${doorConfig.signStyle === 'grand-arch' ? 'active' : ''}`}
                            onClick={() => setDoorConfig({ ...doorConfig, signStyle: 'grand-arch' })}
                          >
                            <Building2 size={14} />
                            <span>{tp('signGrandArch', 'ซุ้มแกรนด์')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Done / Close Action */}
                      <div className="spatial-action-buttons" style={{ marginTop: '16px' }}>
                        <button 
                          type="button"
                          className="btn-spatial-action"
                          style={{ flex: 1, background: '#10b981', color: '#ffffff', borderColor: '#059669', padding: '10px 14px', fontWeight: 700 }}
                          onClick={() => {
                            setSelectedItemId(null);
                            setInspectorTab('details');
                          }}
                        >
                          <Check size={15} />
                          <span>{tp('saveDoorPosition', 'เสร็จสิ้น / บันทึกตำแหน่งประตู')}</span>
                        </button>
                      </div>
                    </div>
                </div>
              )}

              {/* TAB 1: รายละเอียด & อุปกรณ์ที่ติดตั้งในร้าน */}
              {inspectorTab === 'details' && selectedItemId !== 'store-door' && (
                <div className="inspector-tab-content tab-details-content">
                  {selectedItemObject ? (
                    <div className="selected-item-inspector-expanded">
                      <div className="insp-head">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="badge-pill badge-blue">
                            <Box size={13} />
                            <span>{tp('selectedModuleBadge', 'โมดูลที่เลือก')}</span>
                          </span>
                          <button 
                            type="button" 
                            className="btn-popover-close-mini" 
                            onClick={() => setSelectedItemId(null)}
                            title={tp('closeSelectionTooltip', 'ปิดการเลือก')}
                          >
                            ✕
                          </button>
                        </div>
                        <h4>{selectedItemObject.catalog?.name}</h4>

                        {/* Small preview image under name */}
                        {selectedItemObject.catalog?.image && (
                          <div 
                            className="insp-thumb-banner"
                            onClick={() => setSelectedCatalogModalItem(selectedItemObject.catalog)}
                            title={tp('viewSpecsAndZoomTooltip', 'คลิกเพื่อดูสเปกเต็มและภาพสินค้าขยาย')}
                          >
                            <img 
                              src={selectedItemObject.catalog.image} 
                              alt={selectedItemObject.catalog.name} 
                              className="insp-thumb-img"
                              loading="lazy"
                            />
                            <div className="insp-thumb-overlay">
                              <Eye size={13} />
                              <span>{tp('clickFullSpecs', 'คลิกดูภาพขยาย & สเปกเต็ม')}</span>
                            </div>
                            {selectedItemObject.catalog.seats > 0 && (
                              <span className="insp-thumb-seat-badge">
                                {selectedItemObject.catalog.seats} PCs
                              </span>
                            )}
                            <span className="insp-thumb-dim-badge">
                              {selectedItemObject.catalog.widthMeters} x {selectedItemObject.catalog.depth3D || selectedItemObject.catalog.heightMeters} {tp('metersUnit', 'ม.')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Component Breakdown Card: Desk vs Chair */}
                      <div className="component-breakdown-card">
                        <div className="breakdown-section-title">
                          <span>{tp('modulePriceBreakdown', 'รายละเอียดราคาอุปกรณ์ในโมดูล')}</span>
                        </div>

                        {/* Desk Price Breakdown */}
                        <div className="component-spec-box desk-box">
                          <div className="spec-box-header">
                            <span className="box-title">{tp('deskAndStructure', 'โต๊ะและโครงสร้าง')}</span>
                            <strong className="box-price text-blue">
                              ฿{selectedItemObject.catalog?.deskPrice?.toLocaleString()}
                            </strong>
                          </div>
                          <p className="box-desc">{translateDynamic(selectedItemObject.catalog?.deskDesc)}</p>
                        </div>

                        {/* Chair Model & Price Breakdown */}
                        <div className="component-spec-box chair-box">
                          <div className="spec-box-header">
                            <span className="box-title">{tp('gamingChairsSeats', 'เก้าอี้เกมมิ่ง / ที่นั่ง')}</span>
                            <strong className="box-price text-blue">
                              {selectedItemObject.catalog?.chairCount > 0 
                                ? `฿${((selectedItemObject.catalog?.chairPrice || 0) * (selectedItemObject.catalog?.chairCount || 0)).toLocaleString()}`
                                : tp('noChairs', 'ไม่มี')}
                            </strong>
                          </div>
                          <div className="chair-detail-row">
                            <span className="chair-model-name">
                              {translateDynamic(selectedItemObject.catalog?.chairModel)}
                            </span>
                            {selectedItemObject.catalog?.chairCount > 0 && (
                              <span className="chair-count-badge">
                                {selectedItemObject.catalog?.chairCount} {tp('unitsChairs', 'ตัว')} <span className="unit-price">(฿{selectedItemObject.catalog?.chairPrice?.toLocaleString()}/{tp('unitsPerChair', 'ตัว')})</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 3D Physical Dimensions */}
                        <div className="component-spec-box dimensions-box">
                          <div className="spec-box-header">
                            <span className="box-title">{tp('dimensionsWxDxH', 'มิติขนาด (กว้าง x ลึก x สูง)')}</span>
                          </div>
                          <div className="dimensions-pills">
                            <span className="dim-tag">{tp('dimWidth', 'กว้าง')}: {selectedItemObject.catalog?.widthMeters} {tp('metersUnit', 'ม.')}</span>
                            <span className="dim-tag">{tp('dimDepth', 'ลึก')}: {selectedItemObject.catalog?.depth3D || selectedItemObject.catalog?.heightMeters} {tp('metersUnit', 'ม.')}</span>
                            <span className="dim-tag">{tp('dimHeight', 'สูง')}: {selectedItemObject.catalog?.height3D || 1.25} {tp('metersUnit', 'ม.')}</span>
                          </div>
                        </div>

                        {/* Total Module Price */}
                        <div className="total-module-price-row">
                          <span>{tp('totalModulePrice', 'ราคารวมโมดูลนี้:')}</span>
                          <strong className="text-blue font-bold">
                            ฿{selectedItemObject.catalog?.baseCost?.toLocaleString()}
                          </strong>
                        </div>
                      </div>

                      {/* Placement & Spatial Controls */}
                      <div className="spatial-controls-card">
                        <div className="spatial-title">
                          <Move size={14} className="text-blue" />
                          <span>{tp('positionOrientation', 'ตำแหน่ง & ทิศทางในห้อง')}</span>
                        </div>
                        <div className="coords-info">
                          <span><strong>X:</strong> {selectedItemObject.x.toFixed(1)} {tp('metersUnit', 'ม.')}</span>
                          <span><strong>Y:</strong> {selectedItemObject.y.toFixed(1)} {tp('metersUnit', 'ม.')}</span>
                          <span><strong>{tp('angle', 'มุม:')}</strong> {selectedItemObject.rotation}°</span>
                        </div>

                        {/* Unified Quick Actions */}
                        <div className="spatial-actions-row">
                          <button 
                            type="button"
                            id="btn-sidebar-rotate-item"
                            className="btn-spatial-action btn-rotate"
                            onClick={() => handleRotateItem(selectedItemObject.id)}
                            title={tp('rotateTooltip', 'หมุน 90 องศา (กด R)')}
                          >
                            <RotateCw size={13} />
                            <span>{tp('rotate90', 'หมุน 90°')}</span>
                          </button>
                          <button 
                            type="button"
                            id="btn-sidebar-duplicate-item"
                            className="btn-spatial-action btn-duplicate"
                            onClick={() => handleDuplicateItem(selectedItemObject.id)}
                            title={tp('duplicateModuleTooltip', 'คัดลอกโมดูลนี้ (Duplicate)')}
                          >
                            <Copy size={13} />
                            <span>{tp('duplicate', 'คัดลอก')}</span>
                          </button>
                          <button 
                            type="button"
                            id="btn-sidebar-delete-item"
                            className="btn-spatial-action btn-delete"
                            onClick={() => promptDeleteItem(selectedItemObject)}
                            title={tp('deleteModuleTooltip', 'ลบโมดูลนี้ออกจากผัง (กด Delete)')}
                          >
                            <Trash2 size={13} />
                            <span>{tp('delete', 'ลบออก')}</span>
                          </button>
                        </div>

                        <div className="spatial-keyboard-hint">
                          <Compass size={12} className="text-blue" />
                          <span>{tp('dragHint', 'คลิกลากย้ายอิสระ หรือกดปุ่มลูกศร [↑][↓][←][→] บนคีย์บอร์ด')}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="no-item-selected-state">
                      {/* Installed Items Section Header */}
                      <div className="quick-items-card" style={{ marginTop: 0 }}>
                        <div className="quick-items-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="quick-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                            <Layers size={15} className="text-blue" />
                            <span>{tp('installedItemsTitle', 'อุปกรณ์ที่ติดตั้งในร้าน')} ({placedItems.length} {tp('itemsCountUnit', 'ชิ้น')}):</span>
                          </span>
                          <button
                            type="button"
                            className="btn-quick-add-link"
                            onClick={() => setInspectorTab('catalog')}
                            title={tp('goToAddTabTooltip', 'ไปที่แท็บเพิ่มอุปกรณ์')}
                          >
                            <Plus size={13} />
                            <span>{tp('addEquipmentShort', '+ เพิ่มอุปกรณ์')}</span>
                          </button>
                        </div>

                        <div className="quick-items-scrollable">
                          {/* Store Door always at top of list */}
                          <div 
                            className={`installed-item-card door-item-card ${selectedItemId === 'store-door' ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedItemId('store-door');
                              setInspectorTab('door');
                            }}
                            title={tp('selectDoorTooltip', 'คลิกเพื่อเลือกและปรับตำแหน่งประตูทางเข้าร้าน')}
                          >
                            <div className="installed-item-left">
                              <div className="installed-item-badge door-badge">
                                <DoorOpen size={14} />
                              </div>
                              <div className="installed-item-info">
                                <span className="installed-item-title">{tp('mainEntranceDoor', 'ประตูทางเข้าร้านหลัก')}</span>
                                <div className="installed-item-meta">
                                  <span className="installed-tag tag-emerald">
                                    {getWallName(doorConfig.wall)} {Math.round((doorConfig.offsetRatio ?? 0.75) * 100)}%
                                  </span>
                                  <span className="installed-tag tag-dim">
                                    {(doorConfig.style === 'glass-double' || doorConfig.style === 'glass' || !doorConfig.style) ? tp('glassDoubleTint', 'กระจก 2 บาน (ฟิล์มดำ)') : doorConfig.style === 'auto-sliding' ? tp('autoSlidingTint', 'บานเลื่อนออโต้ (ฟิล์มดำ)') : tp('glassSingleTint', 'กระจก 1 บาน (ฟิล์มดำ)')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="installed-item-right">
                              <span className="badge-door-edit">{tp('settingsBtn', 'ตั้งค่า')}</span>
                            </div>
                          </div>

                          {placedItems.length === 0 ? (
                            <div style={{ padding: '24px 10px', textAlign: 'center', color: '#94a3b8', fontSize: '0.84rem' }}>
                              <span>{tp('noItemsInLayout', 'ยังไม่มีอุปกรณ์ในผังร้าน คลิกปุ่ม "+ เพิ่มอุปกรณ์" ด้านบนเพื่อเริ่มจัดวาง')}</span>
                            </div>
                          ) : (
                            placedItems.map((item, idx) => {
                              const cat = item.catalog || (siteData?.catalogItems || CATALOG_ITEMS).find(c => c.type === item.type) || {};
                              const isExpanded = expandedQuickItemId === item.id;
                              const isSelected = selectedItemId === item.id;

                              return (
                                <div 
                                  key={item.id} 
                                  className={`installed-item-card ${isExpanded ? 'expanded' : ''} ${isSelected ? 'selected' : ''}`}
                                >
                                  {/* Header Button: 1:1 Image + 2-line Text + Circular Chevron */}
                                  <button
                                    type="button"
                                    className="quick-item-summary-btn"
                                    onClick={() => setExpandedQuickItemId(isExpanded ? null : item.id)}
                                    title={isExpanded ? tp('expandDetailsTooltip', 'คลิกเพื่อย่อข้อมูล') : tp('collapseDetailsTooltip', 'คลิกเพื่อดูขนาด ราคา และจัดการอุปกรณ์')}
                                  >
                                    <div className="quick-item-img-wrapper">
                                      {cat.image ? (
                                        <img 
                                          src={cat.image} 
                                          alt={cat.name || item.type} 
                                          className="quick-item-thumb-1to1" 
                                          loading="lazy" 
                                        />
                                      ) : (
                                        <div className="quick-item-icon-1to1">
                                          {renderCatalogItemIcon(cat.icon, 22)}
                                        </div>
                                      )}
                                      <span className="quick-item-idx-floating">#{idx + 1}</span>
                                    </div>

                                    <div className="quick-item-text-col">
                                      <div className="quick-item-top-meta">
                                        <span className="quick-item-type-badge">
                                          {getCategoryName(cat.category)}
                                        </span>
                                        {cat.seats > 0 && (
                                          <span className="quick-item-seats-badge">
                                            {cat.seats} {tp('seatsCountUnit', 'ที่นั่ง')}
                                          </span>
                                        )}
                                      </div>
                                      <span className="quick-item-name-clean" title={getItemName(cat) || item.type}>
                                        {getItemName(cat) || item.type}
                                      </span>
                                      <span className="quick-item-sub-hint">
                                        {isExpanded ? tp('itemActionCollapse', 'คลิกเพื่อย่อรายละเอียด') : tp('itemActionInspect', 'คลิกเพื่อดูขนาด ราคา & จัดการ')}
                                      </span>
                                    </div>

                                    <div className="quick-item-trail">
                                      <div className={`quick-item-chevron-circle ${isExpanded ? 'rotated' : ''}`}>
                                        <ChevronDown size={15} />
                                      </div>
                                    </div>
                                  </button>

                                  {/* Expanded details: Revealed ONLY when clicked / tapped */}
                                  {isExpanded && (
                                    <div className="quick-item-expanded-body">
                                      <div className="quick-item-specs-grid">
                                        <div className="spec-card-box">
                                          <span className="spec-lbl">
                                            <Ruler size={11} className="text-blue" />
                                            <span>{tp('moduleSize', 'ขนาดโมดูล')}</span>
                                          </span>
                                          <strong className="spec-val">
                                            {cat.seats > 0 
                                              ? `${cat.seats} ${tp('seatUnit', 'ที่นั่ง')} (${cat.widthMeters}${tp('unitM', 'ม.')})` 
                                              : `${cat.widthMeters || 1} × ${cat.heightMeters || 1} ${tp('unitM', 'ม.')}`}
                                          </strong>
                                        </div>
                                        <div className="spec-card-box">
                                          <span className="spec-lbl">
                                            <DollarSign size={11} className="text-emerald" />
                                            <span>{tp('estimatedPrice', 'ราคาประเมิน')}</span>
                                          </span>
                                          <strong className="spec-val price-val">
                                            ฿{(cat.baseCost || 0).toLocaleString()}
                                          </strong>
                                        </div>
                                      </div>

                                      <div className="quick-item-actions-row">
                                        <button
                                          type="button"
                                          className="btn-quick-item-action btn-select-3d"
                                          onClick={() => {
                                            setSelectedItemId(item.id);
                                          }}
                                          title={tp('selectAndNudgeIn3DTooltip', 'เลือกและปรับตำแหน่งในมุมมอง 3D')}
                                        >
                                          <Move size={12} />
                                          <span>{tp('focusIn3D', 'ปรับใน 3D')}</span>
                                        </button>
                                        <button
                                          type="button"
                                          className="btn-quick-item-action btn-rotate-mini"
                                          onClick={() => handleRotateItem(item.id)}
                                          title={tp('rotate90Tooltip', 'หมุน 90 องศา')}
                                        >
                                          <RotateCw size={12} />
                                          <span>{tp('rotateAction', 'หมุน')}</span>
                                        </button>
                                        <button
                                          type="button"
                                          className="btn-quick-item-action btn-delete-danger"
                                          onClick={() => promptDeleteItem(item)}
                                          title={tp('removeItemFromLayoutTooltip', 'นำอุปกรณ์ชิ้นนี้ออกจากผังร้าน')}
                                        >
                                          <Trash2 size={12} />
                                          <span>{tp('removeAction', 'นำออก')}</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                      
                      {/* Current Active Materials Summary */}
                      <div className="active-materials-summary" style={{ marginTop: '14px' }}>
                        <div 
                          className="mat-summary-row" 
                          style={{ cursor: 'pointer' }}
                          onClick={() => setInspectorTab('materials')}
                          title={tp('changeWallpaperInTab2Tooltip', 'คลิกเพื่อเปลี่ยนวอลเปเปอร์ในแท็บ 2')}
                        >
                          <span className="mat-key">{tp('wallpaperKey', 'วอลเปเปอร์:')}</span>
                          <strong className="mat-val text-blue" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>{WALLPAPERS.find(w => w.id === selectedWallpaper)?.name}</span>
                            <ChevronRight size={13} />
                          </strong>
                        </div>
                        <div 
                          className="mat-summary-row" 
                          style={{ cursor: 'pointer' }}
                          onClick={() => setInspectorTab('materials')}
                          title={tp('changeFloorInTab2Tooltip', 'คลิกเพื่อเปลี่ยนวัสดุปูพื้นในแท็บ 2')}
                        >
                          <span className="mat-key">{tp('floorKey', 'วัสดุปูพื้น:')}</span>
                          <strong className="mat-val text-blue" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>{FLOOR_MATERIALS.find(f => f.id === selectedFloorMaterial)?.name}</span>
                            <ChevronRight size={13} />
                          </strong>
                        </div>
                        <div 
                          className="mat-summary-row" 
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedItemId('store-door')}
                          title={tp('adjustDoorWallTooltip', 'คลิกเพื่อปรับตำแหน่งประตู')}
                        >
                          <span className="mat-key">{tp('doorEntranceKey', 'ประตูทางเข้า:')}</span>
                          <strong className="mat-val text-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>
                              {doorConfig.wall === 'front' ? `${tp('wallFront', 'ด้านหน้า')} (Front)` :
                               doorConfig.wall === 'left' ? `${tp('wallLeft', 'ผนังซ้าย')} (Left)` :
                               doorConfig.wall === 'back' ? `${tp('wallBack', 'ผนังหลัง')} (Back)` : `${tp('wallRight', 'ผนังขวา')} (Right)`} ({Math.round((doorConfig.offsetRatio ?? 0.75) * 100)}%)
                            </span>
                            <ChevronRight size={13} />
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
                      <span>{tp('initialCostSummary', 'สรุปงบลงทุนเบื้องต้น')}</span>
                    </h4>
                    <div className="cost-row">
                      <span>{tp('hardwareCostRow', 'ฮาร์ดแวร์')} ({totalStations} {tp('stationsCountUnit', 'เครื่อง')}):</span>
                      <strong>฿{hardwareCost.toLocaleString()}</strong>
                    </div>
                    <div className="cost-row">
                      <span>{tp('furnitureCostRow', 'โต๊ะ เก้าอี้ และห้อง VIP:')}</span>
                      <strong>฿{furnitureItemsCost.toLocaleString()}</strong>
                    </div>
                    <div className="cost-row">
                      <span>{tp('interiorCostRow', 'งานตกแต่ง Interior')} ({roomAreaSqM} {tp('sqmUnit', 'ตร.ม.')}):</span>
                      <strong>฿{interiorDecorCost.toLocaleString()}</strong>
                    </div>
                    <div className="cost-row">
                      <span>{tp('airconCostRow', 'ระบบแอร์ & ระบายอากาศ:')}</span>
                      <strong>฿{airconCost.toLocaleString()}</strong>
                    </div>
                    <div className="cost-row">
                      <span>Diskless Server & 10G Network:</span>
                      <strong>฿{(disklessCost + networkCost).toLocaleString()}</strong>
                    </div>
                    <div className="cost-row">
                      <span>{tp('franchiseFeeRow', 'ค่าแฟรนไชส์ & สิทธิ์การใช้แบรนด์:')}</span>
                      <strong>฿{franchiseLicenseCost.toLocaleString()}</strong>
                    </div>

                    <div className="cost-divider"></div>

                    <div className="total-cost-box">
                      <span className="total-cost-label">{tp('totalInvestmentEstimateLabel', 'งบประมาณลงทุนรวมโดยประมาณ:')}</span>
                      <div className="total-cost-number text-blue font-bold">
                        ฿{totalInvestmentCost.toLocaleString()}
                      </div>
                      <span className="total-cost-note">{tp('turnkeyIncludedNote', '* รวมฮาร์ดแวร์ ตกแต่ง และเปิดร้านพร้อมใช้งาน')}</span>
                    </div>
                  </div>

                  {/* Step Navigation in Left Sidebar */}
                  <div className="inspector-step-actions">
                    <button 
                      id="btn-step2-to-step3-sidebar"
                      onClick={() => handleStepChange(3)} 
                      className="btn-primary full-width"
                      style={{ padding: '13px 16px', fontSize: '0.96rem', fontWeight: 700 }}
                    >
                      <span>{tp('nextChooseSpecsWithCount', 'ถัดไป: เลือกสเปก')} ({totalStations} {tp('stationsCountUnit', 'เครื่อง')})</span>
                      <ArrowRight size={16} />
                    </button>
                    <button 
                      onClick={() => handleStepChange(1)} 
                      className="btn-secondary full-width"
                      style={{ marginTop: '6px' }}
                    >
                      {tp('back', 'ย้อนกลับ')}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: วอลเปเปอร์ & วัสดุปูพื้นห้อง */}
              {inspectorTab === 'materials' && (
                <div className="inspector-tab-content tab-materials-content">
                  <div className="tab-section-intro">
                    <div className="tab-section-header">
                      <Palette size={18} className="text-blue" />
                      <div>
                        <h4>{tp('materialsHeaderTitle', 'วอลเปเปอร์ผนัง & วัสดุพื้น')}</h4>
                        <p>{tp('materialsHeaderSubtitle', 'คลิกเพื่อเปลี่ยนโทนสี แสดงผล 3D จำลองแสงทันที')}</p>
                      </div>
                    </div>
                  </div>

                  {/* 1. Wallpaper Selector */}
                  <div className="material-group-box">
                    <div className="material-group-title">
                      <Sparkles size={14} className="text-blue" />
                      <span>{tp('wallFinishesTitle', '1. วอลเปเปอร์ผนังร้าน (Wall Finishes):')}</span>
                    </div>
                    <div className="material-cards-vertical">
                      {WALLPAPERS.map(wp => {
                        const isActive = selectedWallpaper === wp.id;
                        return (
                          <div
                            key={wp.id}
                            id={`tab-swatch-wall-${wp.id}`}
                            className={`mat-card-item ${isActive ? 'active' : ''}`}
                            onClick={() => setSelectedWallpaper(wp.id)}
                            title={`${wp.name} - ${wp.desc}`}
                          >
                            <span 
                              className="mat-card-color-thumb" 
                              style={{ backgroundColor: wp.color }} 
                            />
                            <div className="mat-card-info">
                              <div className="mat-card-name-row">
                                <strong className="mat-card-name">{wp.name}</strong>
                                {isActive && (
                                  <span className="mat-active-pill">
                                    <Check size={11} /> {tp('currentlyActive', 'ใช้งานอยู่')}
                                  </span>
                                )}
                              </div>
                              <span className="mat-card-desc">{wp.desc}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Floor Material Selector */}
                  <div className="material-group-box" style={{ marginTop: '16px' }}>
                    <div className="material-group-title">
                      <Layers size={14} className="text-emerald" />
                      <span>{tp('floorFinishesTitle', '2. วัสดุปูพื้นห้อง (Floor Finishes):')}</span>
                    </div>
                    <div className="material-cards-vertical">
                      {FLOOR_MATERIALS.map(fl => {
                        const isActive = selectedFloorMaterial === fl.id;
                        return (
                          <div
                            key={fl.id}
                            id={`tab-swatch-floor-${fl.id}`}
                            className={`mat-card-item ${isActive ? 'active' : ''}`}
                            onClick={() => setSelectedFloorMaterial(fl.id)}
                            title={`${fl.name} - ${fl.desc}`}
                          >
                            <span 
                              className="mat-card-color-thumb floor-thumb" 
                              style={{ backgroundColor: fl.color }} 
                            />
                            <div className="mat-card-info">
                              <div className="mat-card-name-row">
                                <strong className="mat-card-name">{fl.name}</strong>
                                {isActive && (
                                  <span className="mat-active-pill">
                                    <Check size={11} /> {tp('activeInUse', 'ใช้งานอยู่')}
                                  </span>
                                )}
                              </div>
                              <span className="mat-card-desc">{fl.desc}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="material-tip-card">
                    <Info size={14} className="text-blue" />
                    <span>{tp('materialsTip', '💡 ผนังและพื้นจะคำนวณในหมวด "งานตกแต่ง Interior" ในงบลงทุนโดยอัตโนมัติ')}</span>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <button 
                      type="button"
                      className="btn-secondary full-width"
                      onClick={() => setInspectorTab('details')}
                    >
                      ← {tp('backToDetailsTab', 'กลับไปดูรายละเอียดผังร้าน')}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: เพิ่มอุปกรณ์ลงในผัง (Catalog Items with + icon) */}
              {inspectorTab === 'catalog' && (
                <div className="inspector-tab-content tab-catalog-content">
                  <div className="tab-section-intro">
                    <div className="tab-section-header">
                      <Layers size={18} className="text-cyan" />
                      <div>
                        <h4>{tp('addEquipmentTitle', 'เพิ่มอุปกรณ์และโซนในร้าน')}</h4>
                        <p>{tp('addEquipmentSubtitle', 'กดปุ่ม + ด้านขวา เพื่อเพิ่มโต๊ะ/อุปกรณ์ลงในห้องทันที')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="catalog-filter-tabs" style={{ marginTop: '10px' }}>
                    <button 
                      type="button"
                      className={`filter-tab ${catalogCategory === 'all' ? 'active' : ''}`}
                      onClick={() => setCatalogCategory('all')}
                    >
                      {tp('cat_all', 'ทั้งหมด')}
                    </button>
                    <button 
                      type="button"
                      className={`filter-tab ${catalogCategory === 'stations' ? 'active' : ''}`}
                      onClick={() => setCatalogCategory('stations')}
                    >
                      {tp('cat_stations_short', 'โต๊ะคอม')}
                    </button>
                    <button 
                      type="button"
                      className={`filter-tab ${catalogCategory === 'facilities' ? 'active' : ''}`}
                      onClick={() => setCatalogCategory('facilities')}
                    >
                      {tp('cat_service_short', 'บริการ/เคาน์เตอร์')}
                    </button>
                    <button 
                      type="button"
                      className={`filter-tab ${catalogCategory === 'architectural' ? 'active' : ''}`}
                      onClick={() => setCatalogCategory('architectural')}
                    >
                      {tp('cat_doors_short', 'ประตู/หน้าต่าง')}
                    </button>
                  </div>

                  {/* Catalog Items List (Homestyler style grid) */}
                  <div className="catalog-items-list tab-catalog-items-scroll">
                    {catalogItems
                      .filter(item => {
                        if (catalogCategory === 'all') return true;
                        if (catalogCategory === 'stations') return item.category === 'stations' || item.category === 'vip' || item.category === 'stage';
                        if (catalogCategory === 'facilities') return item.category === 'facilities' || item.category === 'amenities';
                        if (catalogCategory === 'architectural') return item.category === 'architectural';
                        return true;
                      })
                      .map((item) => (
                        <div 
                          key={item.type} 
                          className="catalog-item-card"
                          onClick={() => setSelectedCatalogModalItem(item)}
                          title={tp('viewFullSpecsCardHint', 'คลิกเพื่อดูสเปกเต็มและภาพสินค้า')}
                        >
                          {/* Product Thumbnail Banner */}
                          <div className="catalog-thumb-banner">
                            <img 
                              src={item.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80'} 
                              alt={item.name} 
                              className="catalog-thumb-img"
                              loading="lazy"
                            />
                            <div className="catalog-thumb-hover-overlay">
                              <Eye size={13} />
                              <span>{tp('viewFullSpecs', 'ดูสเปกเต็ม')}</span>
                            </div>
                            
                            <div className="catalog-card-swatches" title={tp('swatchesCardHint', 'โทนสีวัสดุและไฟ')}>
                              <span className="swatch-mini" style={{ backgroundColor: item.deskColor || '#0f172a' }} title={tp('swatchDeskColor', 'สีท็อปโต๊ะ')} />
                              <span className="swatch-mini" style={{ backgroundColor: item.accentColor || '#1d4ed8' }} title={tp('swatchAccentColor', 'สีไฟตกแต่ง')} />
                              {item.chairColor && (
                                <span className="swatch-mini" style={{ backgroundColor: item.chairColor || '#0f172a' }} title={tp('swatchChairColor', 'สีเก้าอี้')} />
                              )}
                            </div>

                            {item.seats > 0 && (
                              <span className="catalog-thumb-seat-badge">
                                {item.seats} PCs
                              </span>
                            )}
                          </div>

                          <div className="catalog-item-top">
                            <div className="catalog-item-info">
                              <strong className="item-name">{getItemName(item)}</strong>
                              <span className="item-dim">
                                {tp('dimensionsLabel', 'ขนาด:')} {item.widthMeters} x {item.depth3D || item.heightMeters} {tp('unitM', 'ม.')} ({tp('heightLabel', 'สูง')} {item.height3D || 1.2}{tp('unitM', 'ม.')})
                              </span>
                            </div>
                            <button 
                              type="button"
                              id={`btn-tab-add-${item.type}`}
                              className="btn-add-catalog"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddItem(item);
                              }}
                              title={tp('addDirectlyTo3DTooltip', 'เพิ่มลงในผัง 3D ทันที')}
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                          
                          <div className="catalog-item-pricing-preview">
                            <div className="price-tag-row">
                              <span className="price-tag-badge">
                                {tp('totalWithColon', 'รวม')} ฿{item.baseCost.toLocaleString()}
                              </span>
                              <span className="catalog-click-spec-hint">
                                <Info size={11} /> {tp('viewSpecsShort', 'ดูสเปก')}
                              </span>
                            </div>
                            <span className="price-sub-badge">
                              {tp('deskItemPrefix', 'โต๊ะ')} ฿{item.deskPrice?.toLocaleString()} {item.chairCount > 0 ? `| ${tp('chairItemPrefix', 'เก้าอี้')} ${item.chairCount} ${tp('unitsPcs', 'ตัว')}` : ''}
                            </span>
                          </div>

                          <p className="catalog-item-desc">{getItemDesc(item)}</p>
                        </div>
                      ))}
                  </div>

                  {/* Presets & Clear Section */}
                  <div className="sidebar-footer-presets" style={{ marginTop: '12px' }}>
                    <span className="sub-label">{tp('presetLayoutModels', 'โมเดลผังร้านสำเร็จรูป:')}</span>
                    <div className="preset-quick-btns">
                      {PRESET_ROOMS.map(p => (
                        <button 
                          key={p.id}
                          type="button"
                          onClick={() => handleLoadPreset(p)}
                          className="btn-mini-preset"
                        >
                          {p.name.split(':')[0]}
                        </button>
                      ))}
                      <button type="button" onClick={handleClearCanvas} className="btn-mini-clear" title={tp('clearEntireLayoutTooltip', 'ล้างผังทั้งหมด')}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Center: 3D Studio or 2D Canvas */}
            <div className="canvas-main-col">
              {/* Canvas Toolbar & Stats Header */}
              {!isWalkMode && (
              <div className="canvas-stats-toolbar glass-panel">
                <div className="canvas-stat-item">
                  <span className="stat-lbl">{tp('roomSize', 'ขนาดห้อง:')}</span>
                  <span className="stat-val text-cyan">{roomWidth} x {roomHeight} {tp('metersUnit', 'ม.')} ({roomAreaSqM} {tp('sqmUnit', 'ตร.ม.')})</span>
                </div>
                <div className="canvas-stat-item">
                  <span className="stat-lbl">{tp('placedStations', 'คอมพิวเตอร์ที่วางแล้ว:')}</span>
                  <span className="stat-val text-blue font-bold">{totalStations} {tp('stationsCountUnit', 'เครื่อง')}</span>
                </div>
                <div className="canvas-stat-item">
                  <span className="stat-lbl">{tp('placedItemsCount', 'ชิ้นส่วนในผัง:')}</span>
                  <span className="stat-val">{placedItems.length} {tp('itemsCountUnit', 'ชิ้น')}</span>
                </div>
                <div className="canvas-stat-item">
                  <span className="stat-lbl">{tp('aisleStatus', 'สถานะระยะทางเดิน:')}</span>
                  {isOvercrowded ? (
                    <span className="stat-val status-warning text-amber">
                      <AlertTriangle size={14} /> {tp('aisleCrowded', 'หนาแน่นเกินไป')}
                    </span>
                  ) : (
                    <span className="stat-val status-good text-cyan">
                      <CheckCircle2 size={14} /> {tp('aisleSafe', 'ได้มาตรฐาน ปลอดภัย')}
                    </span>
                  )}
                </div>
                <button 
                  type="button" 
                  id="btn-export-blueprint-toolbar"
                  className="btn-toolbar-blueprint-export"
                  onClick={handleExportBlueprintImage}
                  title={tp('downloadBlueprintForContractorTooltip', 'ส่งออกภาพแปลนสถาปัตยกรรมสำหรับช่าง (PNG)')}
                >
                  <Download size={14} />
                  <span>{tp('blueprintExport', 'แปลนช่าง (PNG)')}</span>
                </button>
                {!isPlannerFullscreen && (
                  <button 
                    type="button" 
                    id="btn-toolbar-fullscreen-toggle"
                    className="btn-toolbar-fullscreen"
                    onClick={handleToggleFullscreen}
                    title={tp('fullscreen', 'เปิดสตูดิโอเต็มหน้าจอ (Zen Mode)')}
                  >
                    <Maximize2 size={14} />
                    <span>{tp('fullscreen', 'ขยายเต็มจอ (Zen Mode)')}</span>
                  </button>
                )}
              </div>
              )}

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
                  onDeleteItem={promptDeleteItem}
                  onNudgeItem={handleNudgeItem}
                  isPlannerFullscreen={isPlannerFullscreen}
                  onToggleFullscreen={handleToggleFullscreen}
                  doorConfig={doorConfig}
                  onChangeDoorConfig={setDoorConfig}
                  isWalkMode={isWalkMode}
                  onWalkModeChange={setIsWalkMode}
                  onRequestFullscreen={handleToggleFullscreen}
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
                      className="btn-floorplan-ctrl btn-floorplan-zoom-out" 
                      onClick={() => setZoomMultiplier(z => Math.max(Number((z - 0.15).toFixed(2)), 0.5))} 
                      title={tp('zoomOutBlueprintTooltip', 'ซูมย่อแปลน (-)')}
                    >
                      <ZoomOut size={15} />
                    </button>
                    <button 
                      type="button"
                      className="floorplan-zoom-indicator-btn" 
                      onClick={() => setZoomMultiplier(1.0)} 
                      title={tp('zoomResetBlueprintTooltip', 'คลิกเพื่อรีเซ็ต 100%')}
                    >
                      {Math.round(zoomMultiplier * 100)}%
                    </button>
                    <button 
                      type="button" 
                      className="btn-floorplan-ctrl btn-floorplan-zoom-in" 
                      onClick={() => setZoomMultiplier(z => Math.min(Number((z + 0.15).toFixed(2)), 2.5))} 
                      title={tp('zoomInBlueprintTooltip', 'ซูมขยายแปลน (+)')}
                    >
                      <ZoomIn size={15} />
                    </button>
                    <div className="floorplan-ctrl-divider" />
                    <button 
                      type="button" 
                      className="btn-floorplan-ctrl btn-fit-screen" 
                      onClick={() => setZoomMultiplier(1.0)} 
                      title={tp('zoomFitBlueprintTooltip', 'รีเซ็ตพอดีหน้าจอ (Fit to Screen 100%)')}
                    >
                      <Maximize2 size={13} />
                      <span className="btn-fit-text">100% {tp('fitScreen', 'พอดีจอ')}</span>
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
                    <div className="canvas-scale-marker top-marker">⟵ {roomWidth}.0 {tp('metersUnit', 'ม.')} ⟶</div>
                    <div className="canvas-scale-marker left-marker">⟵ {roomHeight}.0 {tp('metersUnit', 'ม.')} ⟶</div>

                    {/* Doorway opening slot on perimeter border */}
                    <div 
                      className="doorway-opening-slot"
                      style={{
                        position: 'absolute',
                        pointerEvents: 'none',
                        zIndex: 15,
                        backgroundColor: '#10b981',
                        boxShadow: '0 0 6px rgba(16, 185, 129, 0.7)',
                        ...(doorConfig?.wall === 'front' ? {
                          bottom: '-4px',
                          left: `${(doorConfig?.offsetRatio ?? 0.75) * 100}%`,
                          transform: 'translateX(-50%)',
                          width: `${Math.max(28, (doorConfig?.width || 1.4) * pixelsPerMeter)}px`,
                          height: '6px',
                          borderRadius: '3px'
                        } : doorConfig?.wall === 'back' ? {
                          top: '-4px',
                          left: `${(doorConfig?.offsetRatio ?? 0.75) * 100}%`,
                          transform: 'translateX(-50%)',
                          width: `${Math.max(28, (doorConfig?.width || 1.4) * pixelsPerMeter)}px`,
                          height: '6px',
                          borderRadius: '3px'
                        } : doorConfig?.wall === 'left' ? {
                          left: '-4px',
                          top: `${(doorConfig?.offsetRatio ?? 0.75) * 100}%`,
                          transform: 'translateY(-50%)',
                          height: `${Math.max(28, (doorConfig?.width || 1.4) * pixelsPerMeter)}px`,
                          width: '6px',
                          borderRadius: '3px'
                        } : {
                          right: '-4px',
                          top: `${(doorConfig?.offsetRatio ?? 0.75) * 100}%`,
                          transform: 'translateY(-50%)',
                          height: `${Math.max(28, (doorConfig?.width || 1.4) * pixelsPerMeter)}px`,
                          width: '6px',
                          borderRadius: '3px'
                        })
                      }}
                    />

                    {/* Dynamic 2D Entrance Marker (Positioned 100% OUTSIDE the room) */}
                    <div 
                      className={`dynamic-entrance-badge-2d wall-${doorConfig?.wall || 'right'}`}
                      style={{
                        ...(doorConfig?.wall === 'front' ? {
                          top: '100%',
                          left: `${(doorConfig?.offsetRatio ?? 0.75) * 100}%`,
                          transform: 'translate(-50%, 8px)'
                        } : doorConfig?.wall === 'back' ? {
                          top: 0,
                          left: `${(doorConfig?.offsetRatio ?? 0.75) * 100}%`,
                          transform: 'translate(-50%, calc(-100% - 8px))'
                        } : doorConfig?.wall === 'left' ? {
                          left: 0,
                          top: `${(doorConfig?.offsetRatio ?? 0.75) * 100}%`,
                          transform: 'translate(calc(-100% - 8px), -50%)'
                        } : {
                          left: '100%',
                          top: `${(doorConfig?.offsetRatio ?? 0.75) * 100}%`,
                          transform: 'translate(8px, -50%)'
                        })
                      }}
                    >
                      <div className="entrance-label">
                        <DoorOpen size={12} />
                        <span>{
                          doorConfig?.wall === 'right' ? `◀ ${tp('entrance', 'ทางเข้า')}` :
                          doorConfig?.wall === 'front' ? `▲ ${tp('entrance', 'ทางเข้า')}` :
                          doorConfig?.wall === 'back' ? `▼ ${tp('entrance', 'ทางเข้า')}` :
                          `${tp('entrance', 'ทางเข้า')} ▶`
                        }</span>
                      </div>
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
                              {item.type === 'lounge-sofa' || item.catalog?.category === 'amenities'
                                ? tp('loungeSofa', 'โซฟาเลานจ์')
                                : item.catalog?.seats > 0
                                  ? `${item.catalog.seats} PCs`
                                  : item.catalog?.name?.split(' ')[0]}
                            </div>

                            {/* Station Seats Visual Dots (only for gaming PC stations) */}
                            {item.catalog?.seats > 0 && item.type !== 'lounge-sofa' && item.catalog?.category !== 'amenities' && (
                              <div className="seat-dots-row">
                                {Array.from({ length: Math.min(item.catalog.seats, 10) }).map((_, i) => (
                                  <span key={i} className="seat-dot" style={{ background: item.catalog?.color || '#1d4ed8' }}></span>
                                ))}
                              </div>
                            )}

                            <div className="item-dimension-tag">
                              {item.catalog?.widthMeters}x{item.catalog?.heightMeters}m
                            </div>

                            <div className="item-drag-handle" title={tp('dragHandleTooltip', 'คลิกเลือก หรือลากเพื่อย้ายตำแหน่ง')}>
                              <Move size={11} />
                              {isSelected && <span className="drag-handle-pill">{tp('selectedPill', 'เลือกอยู่')}</span>}
                            </div>

                            {justAddedId === item.id && (
                              <div className="just-added-badge">
                                <span>{tp('newItemDragPrompt', 'ชิ้นใหม่! ลากจัดผังได้เลย')}</span>
                              </div>
                            )}
                          </div>

                          {/* On-item action buttons & D-Pad if selected */}
                          {isSelected && (
                            <div 
                              className={`floorplan-selected-pill ${item.y < 1.2 ? 'pos-bottom' : 'pos-top'}`} 
                              onClick={e => e.stopPropagation()}
                            >
                              <div className="pill-nudge-cluster" title={tp('nudgeClusterTooltip', 'กดเพื่อเลื่อนตำแหน่ง (หรือใช้ปุ่มลูกศร ↑ ↓ ← → บนคีย์บอร์ด)')}>
                                <button 
                                  type="button" 
                                  className="pill-nudge-btn" 
                                  title={tp('nudgeLeftTooltip', 'เลื่อนซ้าย 0.2ม. (กด ←)')}
                                  onClick={() => handleNudgeItem(item.id, -0.2, 0)}
                                >
                                  <ChevronLeft size={13} />
                                </button>
                                <button 
                                  type="button" 
                                  className="pill-nudge-btn" 
                                  title={tp('nudgeUpTooltip', 'เลื่อนขึ้น 0.2ม. (กด ↑)')}
                                  onClick={() => handleNudgeItem(item.id, 0, -0.2)}
                                >
                                  <ChevronUp size={13} />
                                </button>
                                <button 
                                  type="button" 
                                  className="pill-nudge-btn" 
                                  title={tp('nudgeDownTooltip', 'เลื่อนลง 0.2ม. (กด ↓)')}
                                  onClick={() => handleNudgeItem(item.id, 0, 0.2)}
                                >
                                  <ChevronDown size={13} />
                                </button>
                                <button 
                                  type="button" 
                                  className="pill-nudge-btn" 
                                  title={tp('nudgeRightTooltip', 'เลื่อนขวา 0.2ม. (กด →)')}
                                  onClick={() => handleNudgeItem(item.id, 0.2, 0)}
                                >
                                  <ChevronRight size={13} />
                                </button>
                              </div>
                              <div className="pill-divider" />
                              <button 
                                type="button" 
                                className="pill-action-btn" 
                                title={tp('rotateTooltip', 'หมุน 90 องศา (กด R)')}
                                onClick={() => handleRotateItem(item.id)}
                              >
                                <RotateCw size={12} />
                                <span>{tp('rotateBtn', 'หมุน')}</span>
                              </button>
                              <button 
                                type="button" 
                                className="pill-action-btn" 
                                title={tp('duplicateModuleTooltip', 'คัดลอกโมดูล')}
                                onClick={() => handleDuplicateItem(item.id)}
                              >
                                <Copy size={12} />
                              </button>
                              <button 
                                type="button" 
                                className="pill-action-btn delete-btn" 
                                title={tp('deleteTooltip', 'ลบออก (กด Delete)')}
                                onClick={() => promptDeleteItem(item)}
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
                    <span className="shortcut-tag"><strong>{tp('dragFreely', 'คลิกลาก')}</strong> {tp('moveFree', 'ย้ายอิสระ')}</span>
                    <span className="shortcut-sep">•</span>
                    <span className="shortcut-tag">{tp('arrowKeysLabel', 'ลูกศร')} <strong>[↑] [↓] [←] [→]</strong> {tp('onKeyboard', 'บนคีย์บอร์ด')}</span>
                    <span className="shortcut-sep">•</span>
                    <span className="shortcut-tag"><strong>[R]</strong> {tp('rotate90', 'หมุน 90°')}</span>
                    <span className="shortcut-sep">•</span>
                    <span className="shortcut-tag"><strong>[Del]</strong> {tp('delete', 'ลบ')}</span>
                  </div>
                </div>
              )}

              {/* Canvas Guidance Notes */}
              <div className="canvas-guidance-bar">
                <div className="guidance-tip">
                  <Info size={15} className="text-blue" />
                  <span>
                    <strong>{tp('controlsGuideTitle', 'การควบคุม:')}</strong> {tp('controlsGuideDesc', 'หมุนมุมมองอิสระ 360° ด้วยเมาส์ซ้าย • ซูมเข้า-ออกด้วยลูกกลิ้ง • คลิกเลือกวัตถุเพื่อดูราคาโต๊ะและเก้าอี้')}
                  </span>
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
              {tp('step3Title', 'เลือกระดับสเปกคอมพิวเตอร์ สำหรับทั้งร้าน')}
            </h2>
            <p className="section-subtitle max-w-700">
              {tp('step3_stationsBanner', 'จำนวนเครื่องในผังของคุณปัจจุบันคือ')} <strong>{totalStations} {tp('stationsCountUnit', 'เครื่อง')}</strong> {tp('step3_stationsDesc', 'สามารถเลือก Tier สเปกที่เหมาะสมกับกลุ่มลูกค้าและงบประมาณลงทุน (เก้าอี้เกมมิ่งรวมอยู่ในชุดโต๊ะแล้ว)')}
            </p>

            {/* Admin CMS Quick Shortcut Banner */}
            <div style={{ margin: '14px auto 0 auto', maxWidth: '780px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px 16px', fontSize: '0.82rem', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ color: '#64748b' }}>
                ⚙️ <strong>{tp('adminLabel', 'ผู้ดูแลระบบ:')}</strong> {tp('adminDesc', 'สามารถเข้าไปปรับแต่งรายละเอียดสเปก เพิ่มโมเดล หรือแก้ไขราคาต่อเครื่องและงานระบบได้ทุกจุด')}
              </span>
              <a 
                href="/admin" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                <Sliders size={13} />
                <span>{tp('adminCmsBtn', 'เปิดแผงจัดการสเปก & ราคา (Admin CMS)')}</span>
              </a>
            </div>
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
                    <h3 className="tier-name">{translateDynamic(tier.name)}</h3>
                    <p className="tier-tagline">{translateDynamic(tier.tagline)}</p>
                    <div className="tier-price-tag">
                      <span className="price-num">฿{tier.unitCost.toLocaleString()}</span>
                      <span className="price-unit">/ {tp('perStationFullSet', 'เครื่อง (ครบชุด)')}</span>
                    </div>
                    <div className="tier-total-badge">
                      {tp('totalForStations', 'รวม')} {totalStations} {tp('stationsCountUnit', 'เครื่อง')}: ฿{tierTotal.toLocaleString()}
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
                    <div className="tier-spec-item" style={{ background: '#ecfdf5', borderRadius: '8px', padding: '6px 8px' }}>
                      <Armchair size={15} className="text-emerald" style={{ flexShrink: 0 }} />
                      <div style={{ color: '#065f46', fontSize: '0.78rem' }}>
                        <strong>{tp('gamingChairLabel', 'เก้าอี้เกมมิ่ง:')}</strong> {tp('gamingChairIncludedNote', 'รวมอยู่ในชุดโต๊ะเกมมิ่งแล้ว')}
                      </div>
                    </div>
                  </div>

                  <button 
                    id={`btn-select-tier-${key}`}
                    className={isCurrent ? 'btn-primary full-width' : 'btn-secondary full-width'}
                    onClick={(e) => { e.stopPropagation(); setSelectedTier(key); }}
                  >
                    {isCurrent ? <Check size={16} /> : null}
                    <span>{isCurrent ? tp('selectedThisTier', 'เลือกสเปกนี้แล้ว') : tp('selectThisTier', 'เลือกใช้สเปกนี้')}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Fixed Infrastructure Showcase */}
          <div className="infra-showcase-panel glass-panel">
            <h3 className="infra-title">
              <Server size={20} className="text-cyan" />
              <span>{tp('includedInfraTitle', 'ระบบเซิร์ฟเวอร์แม่ข่าย & เครือข่าย (Included Infrastructure)')}</span>
            </h3>
            <div className="infra-grid">
              <div className="infra-item">
                <strong>Diskless Server 10Gbps Master:</strong>
                <span>{tp('disklessServerDesc', 'แม่ข่าย NVMe Enterprise 2 เครื่อง รันเกม 200+ เกม ไม่ต้องลงเกมทีละเครื่อง อัปเดตแพทช์อัตโนมัติ 24 ชม.')}</span>
              </div>
              <div className="infra-item">
                <strong>Dual-WAN Fiber & Mikrotik:</strong>
                <span>{tp('dualWanDesc', 'ระบบสำรองเน็ต 2 เส้น อัตโนมัติ ป้องกันเน็ตหลุด ปิงนิ่งระดับ 1-3ms พร้อม Cisco Managed Switch 10G')}</span>
              </div>
              <div className="infra-item">
                <strong>Billing & Member POS System:</strong>
                <span>{tp('billingPosDesc', 'ระบบบริหารจัดการสมาชิก คิดเงิน คุมเวลาหน้าจอ และสั่งเครื่องดื่มผ่านโต๊ะคอมพิวเตอร์ มีแดชบอร์ดดูยอดขายบนมือถือ')}</span>
              </div>
            </div>

            <div className="step3-nav-actions">
              <button onClick={() => handleStepChange(2)} className="btn-secondary">
                {tp('back', 'ย้อนกลับ')}
              </button>
              <button 
                id="btn-step3-to-step4"
                onClick={() => handleStepChange(4)} 
                className="btn-primary"
              >
                <span>{tp('nextBudgetRoi', 'ถัดไป: สรุปงบ')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. STEP 4: BUDGET BREAKDOWN, ROI & INSTALLATION TIMELINE */}
      {currentStep === 4 && (
        <section className="step-content-section container">
          <div className="budget-columns-grid">
            {/* Left: Detailed Cost Breakdown Table */}
            <div className="cost-table-card glass-panel">
              <h3 className="card-subheading">
                <DollarSign size={20} className="text-amber" />
                <span>{tp('turnkeyBreakdownTitle', 'แจกแจงรายการต้นทุน (Turnkey Breakdown)')}</span>
              </h3>

              <div className="cost-breakdown-list">
                <div className="cb-row header-row">
                  <span>{tp('workCategoryHeader', 'หมวดหมู่งาน')}</span>
                  <span>{tp('detailsHeader', 'รายละเอียด')}</span>
                  <span className="text-right">{tp('budgetHeader', 'งบประมาณ')}</span>
                </div>

                <div className="cb-row">
                  <strong>{tp('costItem1_title', '1. เครื่องคอมพิวเตอร์ & เกมมิ่งเกียร์ (ไม่รวมเก้าอี้)')}</strong>
                  <span>{totalStations} {tp('stationsCountUnit', 'เครื่อง')} x ฿{currentTierInfo.unitCost.toLocaleString()} ({(currentTierInfo.name || '').includes(':') ? currentTierInfo.name.split(':')[1] : currentTierInfo.name})</span>
                  <strong className="text-right">฿{hardwareCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>{tp('costItem2_title', '2. ชุดโต๊ะคอมเกมมิ่ง & เก้าอี้ Ergonomic ในผัง')}</strong>
                  <span>{tp('costItem2_desc', 'โต๊ะเกมมิ่งพร้อมเก้าอี้ตามจำนวนที่นั่ง, ห้อง VIP, เวที 5v5')} ({placedItems.length} {tp('itemsCountUnit', 'รายการ')})</span>
                  <strong className="text-right">฿{furnitureItemsCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>{tp('costItem3_title', '3. ตกแต่งภายใน & ไฟ Linear Modern')}</strong>
                  <span>{roomAreaSqM} {tp('sqmUnit', 'ตร.ม.')} x ฿{(fixedInfrastructure?.interiorSqMeterCost ?? FIXED_INFRASTRUCTURE.interiorSqMeterCost).toLocaleString()} ({tp('costItem3_desc', 'พื้น, ผนังกันเสียง, ไฟ Linear')})</span>
                  <strong className="text-right">฿{interiorDecorCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>{tp('costItem4_title', '4. งานระบบแอร์ Inverter')}</strong>
                  <span>{roomAreaSqM} {tp('sqmUnit', 'ตร.ม.')} x ฿{(fixedInfrastructure?.airconSqMeterCost ?? FIXED_INFRASTRUCTURE.airconSqMeterCost).toLocaleString()} ({tp('costItem4_desc', 'แอร์ Cassette 4 ทิศทาง')})</span>
                  <strong className="text-right">฿{airconCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>{tp('costItem5_title', '5. แม่ข่าย Diskless Server 10G')}</strong>
                  <span>{tp('costItem5_desc', 'Server แม่ข่าย NVMe 2 ชุด + คลังเกม 200+ เกม อัปเดตอัตโนมัติ')}</span>
                  <strong className="text-right">฿{disklessCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>{tp('costItem6_title', '6. เน็ตเวิร์ก Enterprise Dual-WAN')}</strong>
                  <span>{tp('costItem6_desc', 'Cisco 10G Switches, Mikrotik Router, สายแลน Shielded, ตู้ Rack')}</span>
                  <strong className="text-right">฿{networkCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>{tp('costItem7_title', '7. ซอฟต์แวร์ Billing & เครื่อง POS')}</strong>
                  <span>{tp('costItem7_desc', 'ระบบคุมเครื่อง, ลิ้นชักเก็บเงิน, สแกนเนอร์, ระบบสั่งอาหาร')}</span>
                  <strong className="text-right">฿{billingCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row">
                  <strong>{tp('costItem8_title', '8. ค่าแฟรนไชส์ & การอบรมเปิดร้าน')}</strong>
                  <span>{tp('costItem8_desc', 'สิทธิ์ใช้แบรนด์ G-Speed, แบบ 3D ก่อสร้าง, อบรมพนักงาน, การตลาดวันเปิดร้าน')}</span>
                  <strong className="text-right">฿{franchiseLicenseCost.toLocaleString()}</strong>
                </div>

                <div className="cb-row total-row">
                  <strong>{tp('costTotal_title', 'รวมงบประมาณลงทุนทั้งสิ้น (Turnkey Package):')}</strong>
                  <span>{tp('costTotal_status', 'พร้อมเปิดให้บริการ')}</span>
                  <strong className="text-right text-blue font-large">฿{totalInvestmentCost.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Right: Interactive ROI Calculator */}
            <div className="roi-calculator-card glass-panel">
              <div className="roi-card-header">
                <h3 className="card-subheading" style={{ margin: 0 }}>
                  <Sliders size={18} className="text-blue" />
                  <span>{tp('interactiveRoiTitle', 'จำลองรายได้ & ระยะเวลาคืนทุน (Interactive ROI)')}</span>
                </h3>
                <span className="roi-live-badge">Live Financial Model</span>
              </div>

              <div className="roi-inputs">
                <div className="roi-input-group">
                  <div className="roi-label-row">
                    <label>{tp('hourlyRateLabel', 'อัตราค่าบริการ (บาท / ชั่วโมง):')}</label>
                    <span className="roi-val-badge text-blue">{hourlyRate} {tp('bahtPerHour', 'บาท/ชม.')}</span>
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
                    <label>{tp('occupancyRateLabel', 'อัตราการใช้งานเฉลี่ย (Occupancy Rate):')}</label>
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
                    <span>30% ({tp('occLow', 'น้อย')})</span>
                    <span>60% ({tp('occStandard', 'มาตรฐาน')})</span>
                    <span>85% ({tp('occPrime', 'ทำเลทอง')})</span>
                  </div>
                </div>
              </div>

              {/* 3 Executive KPI Mini Cards */}
              <div className="roi-kpi-summary-grid">
                <div className="roi-kpi-mini-card">
                  <span className="roi-kpi-lbl">{tp('monthlyRevenueKpi', 'รายรับต่อเดือน')}</span>
                  <strong className="roi-kpi-val text-blue">฿{Math.round(totalMonthlyRevenue).toLocaleString()}</strong>
                  <span className="roi-kpi-sub">{tp('averagePerDay', 'เฉลี่ย')} ฿{Math.round(totalMonthlyRevenue / 30).toLocaleString()} / {tp('dayUnit', 'วัน')}</span>
                </div>
                <div className="roi-kpi-mini-card">
                  <span className="roi-kpi-lbl">{tp('monthlyNetProfitKpi', 'กำไรสุทธิต่อเดือน')}</span>
                  <strong className="roi-kpi-val text-emerald">฿{Math.round(estimatedMonthlyNetProfit).toLocaleString()}</strong>
                  <span className="roi-kpi-sub">Margin {Math.round((estimatedMonthlyNetProfit / (totalMonthlyRevenue || 1)) * 100)}%</span>
                </div>
                <div className="roi-kpi-mini-card">
                  <span className="roi-kpi-lbl">{tp('annualRoiKpi', 'ผลตอบแทนต่อปี (ROI)')}</span>
                  <strong className="roi-kpi-val text-purple">{Math.round(((estimatedMonthlyNetProfit * 12) / (totalInvestmentCost || 1)) * 100)}%</strong>
                  <span className="roi-kpi-sub">{tp('paybackInMonths', 'คืนทุนใน')} {paybackMonths} {tp('months', 'เดือน')}</span>
                </div>
              </div>

              {/* Monthly Breakdown Projection */}
              <div className="roi-projection-box">
                <div className="proj-row">
                  <span>{tp('gamingHourRevenue', 'รายได้ค่าชั่วโมงเล่นเกม')} ({totalStations} {tp('stationsCountUnit', 'เครื่อง')}):</span>
                  <strong>฿{Math.round(monthlyGamingRevenue).toLocaleString()} / {tp('months', 'ด.')}</strong>
                </div>
                <div className="proj-row">
                  <span>{tp('fnbRevenue', 'รายได้จำหน่ายเครื่องดื่ม & อาหารว่าง:')}</span>
                  <strong>฿{Math.round(monthlySnackRevenue).toLocaleString()} / {tp('months', 'ด.')}</strong>
                </div>
                <div className="proj-row highlight-income">
                  <span>{tp('grossMonthlyRevenue', 'รายรับรวมต่อเดือน (Gross Revenue):')}</span>
                  <strong className="text-blue">฿{Math.round(totalMonthlyRevenue).toLocaleString()} / {tp('months', 'ด.')}</strong>
                </div>

                <div className="cost-divider"></div>

                <div className="proj-row text-muted">
                  <span>{tp('electricityCostEst', 'ค่าไฟ & แอร์ประมาณการ:')}</span>
                  <span>-฿{Math.round(monthlyElectricity).toLocaleString()}</span>
                </div>
                <div className="proj-row text-muted">
                  <span>{tp('staffSalariesEst', 'เงินเดือนพนักงาน (2-3 กะ):')}</span>
                  <span>-฿{Math.round(monthlyStaff).toLocaleString()}</span>
                </div>
                <div className="proj-row text-muted">
                  <span>{tp('internetMiscEst', 'ค่าอินเทอร์เน็ต & เบ็ดเตล็ด:')}</span>
                  <span>-฿{Math.round(monthlyInternetAndMisc).toLocaleString()}</span>
                </div>
              </div>

              <div className="net-profit-card">
                <div className="net-profit-left">
                  <span>{tp('netProfitTitle', 'กำไรสุทธิโดยประมาณ (Net Profit):')}</span>
                  <h4 className="net-profit-number text-blue">
                    ฿{Math.round(estimatedMonthlyNetProfit).toLocaleString()} <span className="per-month">/ {tp('months', 'เดือน')}</span>
                  </h4>
                </div>
                <div className="net-profit-right">
                  <span>{tp('paybackEstTitle', 'คาดว่าจะคืนทุนใน:')}</span>
                  <h3 className="payback-badge text-blue">{paybackMonths} {tp('months', 'เดือน')}</h3>
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
              <h3 className="timeline-title">{tp('timelineTitle', 'ระยะเวลาในการก่อสร้างและติดตั้ง (ประมาณ 6 สัปดาห์)')}</h3>
              <p className="timeline-desc">{tp('timelineDesc', 'ขั้นตอนการดำเนินงานแบบ Turnkey ตั้งแต่สำรวจพื้นที่จนถึงวัน Grand Opening พร้อมเปิดให้บริการ')}</p>
            </div>

            <div className="timeline-steps-grid">
              {INSTALLATION_TIMELINE.map((item, idx) => (
                <div key={idx} className="timeline-step-card">
                  <div className="step-week-badge">{item.week}</div>
                  <h4 className="step-week-title">{translateDynamic(item.title)}</h4>
                  <ul className="step-tasks-list">
                    {item.tasks.map((task, tIdx) => (
                      <li key={tIdx}>
                        <Check size={14} className="text-blue" />
                        <span>{translateDynamic(task)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4 Final Actions Toolbar */}
          <div className="step4-action-toolbar glass-panel">
            <button 
              type="button"
              onClick={() => handleStepChange(3)} 
              className="step4-btn-back"
            >
              <ArrowLeft size={15} />
              <span>{tp('back', 'ย้อนกลับ')}</span>
            </button>

            <div className="step4-action-group">
              <button 
                type="button" 
                onClick={handleExportBlueprintImage} 
                className="step4-btn-export"
                title={tp('downloadBlueprintForContractorTooltip', 'ดาวน์โหลดภาพแปลนสำหรับช่างและผู้รับเหมา (PNG)')}
              >
                <Download size={15} />
                <span>{tp('blueprintExport', 'แปลนช่าง (PNG)')}</span>
              </button>
              <button 
                type="button"
                id="btn-final-lead-cta"
                onClick={() => setShowQuotationModal(true)} 
                className="step4-btn-submit"
              >
                <FileText size={15} />
                <span>{tp('requestQuoteBtn', 'ขอใบเสนอราคา')}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* UNIVERSAL STICKY BOTTOM NAVIGATION BAR (UNIFIED ACROSS ALL STEPS 1-4) */}
      {!isPlannerFullscreen && !isWalkMode && (
      <div className="planner-bottom-nav-bar glass-panel" id="planner-sticky-bottom-bar">
        <div className="bottom-nav-left-info">
          <Info size={16} className="text-blue flex-shrink-0 hide-mobile" />
          <span className="bottom-nav-info-text">
            {currentStep === 1 && (
              <>
                <strong>{tp('bottomNavRoomSize', 'ขนาดร้าน:')}</strong> {roomWidth}x{roomHeight} {tp('metersUnit', 'ม.')} ({roomAreaSqM} {tp('sqmUnit', 'ตร.ม.')}) • {tp('bottomNavRecommended', 'แนะนำ')} ~{blueprintFeasibility?.recommendedStations || Math.round(roomAreaSqM / 2.5)} {tp('stationsCountUnit', 'เครื่อง')}
              </>
            )}
            {currentStep === 2 && (
              <>
                <strong>{tp('bottomNavStoreLayout', 'ผังร้าน:')}</strong> {totalStations} {tp('stationsCountUnit', 'เครื่อง')} • {roomAreaSqM} {tp('sqmUnit', 'ตร.ม.')} • ฿{totalInvestmentCost.toLocaleString()}
              </>
            )}
            {currentStep === 3 && (
              <>
                <strong>{tp('bottomNavSpecs', 'สเปก:')}</strong> {currentTierInfo.name} • {totalStations} {tp('stationsCountUnit', 'เครื่อง')} • ฿{totalInvestmentCost.toLocaleString()}
              </>
            )}
            {currentStep === 4 && (
              <>
                <strong>{tp('bottomNavBudget', 'งบรวม:')}</strong> ฿{totalInvestmentCost.toLocaleString()} • {tp('bottomNavPayback', 'คืนทุน')} ~{paybackMonths} {tp('months', 'ด.')}
              </>
            )}
          </span>
        </div>

        <div className="bottom-nav-right-actions">
          {currentStep > 1 && (
            <button 
              type="button"
              onClick={() => handleStepChange(currentStep - 1)} 
              className="btn-secondary btn-nav-back"
            >
              <ArrowLeft size={16} />
              <span>{tp('prevStep', 'ย้อนกลับ')}</span>
            </button>
          )}

          {currentStep === 1 && (
            <button 
              type="button" 
              id="btn-sticky-step1-to-step2"
              onClick={() => handleStepChange(2)} 
              className="btn-primary btn-nav-next"
            >
              <span>{tp('step1_nextBtn', 'ถัดไป: จัดผังร้าน')}</span>
              <ArrowRight size={16} />
            </button>
          )}

          {currentStep === 2 && (
            <button 
              type="button" 
              id="btn-sticky-step2-to-step3"
              onClick={() => handleStepChange(3)} 
              className="btn-primary btn-nav-next"
            >
              <span>{tp('step2_nextBtn', 'ถัดไป: เลือกสเปก')}</span>
              <ArrowRight size={16} />
            </button>
          )}

          {currentStep === 3 && (
            <button 
              type="button" 
              id="btn-sticky-step3-to-step4"
              onClick={() => handleStepChange(4)} 
              className="btn-primary btn-nav-next"
            >
              <span>{tp('step3_nextBtn', 'ถัดไป: ดูงบ & ROI')}</span>
              <ArrowRight size={16} />
            </button>
          )}

          {currentStep === 4 && (
            <>
              <button 
                type="button"
                onClick={handleExportBlueprintImage} 
                className="btn-secondary btn-export-quick hide-mobile"
                title={tp('blueprintExport', 'ส่งออกแปลนสำหรับช่าง (PNG)')}
              >
                <Download size={15} />
                <span>{tp('blueprintExport', 'แปลนช่าง (PNG)')}</span>
              </button>
              <button 
                type="button"
                id="btn-sticky-final-lead-cta"
                onClick={() => setShowQuotationModal(true)} 
                className="btn-primary btn-nav-next"
              >
                <FileText size={15} />
                <span>{tp('requestQuote', 'ขอใบเสนอราคา')}</span>
                <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
      )}

      {/* MODAL: QUOTATION & PRINT PREVIEW & LEAD GENERATION */}
      {showQuotationModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog modal-large glass-panel">
            <div className="modal-header">
              <div className="modal-header-left">
                <span className="badge-pill badge-blue">OFFICIAL ESTIMATED QUOTATION</span>
                <h3 className="modal-title">{tp('quoteModalHeaderTitle', 'ใบเสนอราคาประเมินเบื้องต้น: แฟรนไชส์ GLP : G Speed Living Plus')}</h3>
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
                <h3>{tp('quoteSuccessToastTitle', 'บันทึกข้อมูลและส่งแปลนร้านเรียบร้อย!')}</h3>
                <p>{tp('quoteSuccessToastDesc', 'ทีมวิศวกรและผู้เชี่ยวชาญแฟรนไชส์ของ GLP : G Speed Living Plus จะตรวจสอบผังที่คุณออกแบบ และติดต่อกลับเพื่อเสนอนัดสำรวจสถานที่จริงภายใน 24 ชม.')}</p>
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
                    title={tp('printQuotationHint', 'สั่งพิมพ์ใบเสนอราคา หรือบันทึกเป็น PDF (Print to PDF)')}
                  >
                    <Printer size={16} />
                    <span>{tp('printQuotationBtn', 'พิมพ์ใบเสนอราคา')}</span>
                  </button>
                  <button 
                    type="button" 
                    id="btn-quick-export-blueprint"
                    className="btn-modal-action btn-blueprint-secondary" 
                    onClick={handleExportBlueprintImage}
                    title={tp('blueprintExport', 'ส่งออกภาพแปลนสถาปัตยกรรมสำหรับช่าง (PNG)')}
                  >
                    <Download size={16} />
                    <span>{tp('blueprintExport', 'ส่งออกแปลน (PNG)')}</span>
                  </button>
                </div>

                {/* Official Printable Quotation Sheet (Whitelisted for Print Dialog) */}
                <div className="official-quotation-print-sheet" id="official-quotation-print-sheet">
                  {/* Company Letterhead */}
                  <div className="quote-sheet-header">
                    <div className="sheet-brand">
                      <div className="brand-title">GLP : G SPEED LIVING PLUS</div>
                      <div className="brand-sub">{tp('companyNameLegal', 'บริษัท จี-สปีด ลิฟวิ่ง พลัส จำกัด (สำนักงานใหญ่)')}</div>
                      <p className="brand-contact-info">
                        {tp('companyAddress', 'เลขที่ 88/9 อาคารจี-สปีด ทาวเวอร์ ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900')}<br />
                        {tp('companyTaxIdContact', 'เลขประจำตัวผู้เสียภาษีอากร: 0105566012345 | โทร: 02-888-9999 | เว็บไซต์: www.gspeed-esport.com')}
                      </p>
                    </div>
                    <div className="sheet-meta-box">
                      <div className="meta-doc-badge">{tp('quoteDocBadge', 'ใบเสนอราคา / ESTIMATED QUOTATION')}</div>
                      <div className="meta-line"><strong>{tp('quoteRefNo', 'เลขที่ใบเสนอราคา:')}</strong> GS-QT-{new Date().toISOString().slice(0, 10).replace(/-/g, '')}-{Date.now().toString().slice(-4)}</div>
                      <div className="meta-line">
                        <strong>{tp('quoteIssueDate', 'วันที่ออกเอกสาร:')}</strong>{' '}
                        {language === 'zh'
                          ? `${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date().getDate()}日`
                          : language === 'en'
                          ? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                          : new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className="meta-line"><strong>{tp('quoteValidity', 'กำหนดยืนราคา:')}</strong> {tp('quoteValidityVal', '30 วันนับจากวันที่ระบุ')}</div>
                    </div>
                  </div>

                  {/* Customer & Project Specifications Grid */}
                  <div className="quote-customer-project-grid">
                    <div className="quote-info-col">
                      <div className="info-section-title">{tp('customerInfoTitle', 'ข้อมูลลูกค้า / ผู้ขอรับสิทธิ์แฟรนไชส์ (CUSTOMER INFO)')}</div>
                      <div className="info-detail-row">
                        <span className="info-lbl">{tp('customerNameLabel', 'ชื่อลูกค้า / นิติบุคคล:')}</span>
                        <span className="info-val"><strong>{translateDynamic(leadForm.fullName || tp('leadDefaultInvestor', 'ผู้สนใจลงทุนแฟรนไชส์ (Franchise Investor)'))}</strong></span>
                      </div>
                      <div className="info-detail-row">
                        <span className="info-lbl">{tp('customerPhoneLabel', 'เบอร์โทรศัพท์ติดต่อ:')}</span>
                        <span className="info-val">{leadForm.phone || '08X-XXX-XXXX'}</span>
                      </div>
                      <div className="info-detail-row">
                        <span className="info-lbl">{tp('customerEmailLabel', 'อีเมลติดต่อ:')}</span>
                        <span className="info-val">{leadForm.email || 'investor@example.com'}</span>
                      </div>
                      <div className="info-detail-row">
                        <span className="info-lbl">{tp('customerBudgetLabel', 'งบประมาณที่เตรียมไว้:')}</span>
                        <span className="info-val">{translateDynamic(leadForm.budget)}</span>
                      </div>
                    </div>
                    <div className="quote-info-col">
                      <div className="info-section-title">{tp('projectSpecsTitle', 'ข้อมูลโครงการสาขา (PROJECT SPECIFICATIONS)')}</div>
                      <div className="info-detail-row">
                        <span className="info-lbl">{tp('storeLocationLabel', 'ทำเลที่ตั้งสาขา:')}</span>
                        <span className="info-val"><strong>{translateDynamic(storeLocation)}</strong></span>
                      </div>
                      <div className="info-detail-row">
                        <span className="info-lbl">{tp('storeTypeLabel', 'รูปแบบพื้นที่:')}</span>
                        <span className="info-val">{translateDynamic(storeType)} {leadForm.locationDetail ? `(${translateDynamic(leadForm.locationDetail)})` : ''}</span>
                      </div>
                      <div className="info-detail-row">
                        <span className="info-lbl">{tp('roomDimensionsLabel', 'ขนาดพื้นที่ร้าน:')}</span>
                        <span className="info-val"><strong>{roomWidth} x {roomHeight} {tp('metersUnit', 'ม.')} ({roomAreaSqM} {tp('sqmUnit', 'ตร.ม.')})</strong></span>
                      </div>
                      <div className="info-detail-row">
                        <span className="info-lbl">{tp('pcSpecsLabel', 'สเปกคอมพิวเตอร์:')}</span>
                        <span className="info-val text-blue"><strong>{translateDynamic(currentTierInfo.name)} ({totalStations} {tp('stationsCountUnit', 'เครื่อง')})</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Key Highlights Pill Badges */}
                  <div className="quote-summary-badges">
                    <div className="qs-badge">{tp('areaSizeLabel', 'ขนาดพื้นที่:')} <strong>{roomWidth}x{roomHeight} {tp('metersUnit', 'ม.')} ({roomAreaSqM} {tp('sqmUnit', 'ตร.ม.')})</strong></div>
                    <div className="qs-badge">{tp('stationsCountLabel', 'จำนวนเครื่อง:')} <strong>{totalStations} Stations</strong></div>
                    <div className="qs-badge">{tp('bottomNavSpecs', 'สเปก:')} <strong>{translateDynamic(currentTierInfo.name)}</strong></div>
                    <div className="qs-badge">{tp('installDurationLabel', 'ระยะเวลาติดตั้ง:')} <strong>{tp('installDurationVal', '4-6 สัปดาห์')}</strong></div>
                    <div className="qs-badge">{tp('paybackEstLabel', 'จุดคุ้มทุนประเมิน:')} <strong>~{paybackMonths} {tp('months', 'เดือน')}</strong></div>
                    {uploadedBlueprint && (
                      <div className="qs-badge highlight-bp">
                        <CheckCircle2 size={13} className="text-emerald" />
                        <span>{tp('attachedBlueprintLabel', 'แนบแปลนอาคาร:')} <strong>{uploadedBlueprint.name}</strong></span>
                      </div>
                    )}
                  </div>

                  {uploadedBlueprint && (
                    <div className="attached-blueprint-quote-box">
                      <div className="quote-bp-thumb">
                        <img src={uploadedBlueprint.url} alt="Attached Floor Plan" />
                      </div>
                      <div className="quote-bp-info">
                        <h5>{tp('customBpAttachedTitle', 'แบบแปลนอาคารแนบพิเศษ (Custom Blueprint Attached)')}</h5>
                        <p>
                          {tp('blueprintReceivedNoticePrefix', 'ระบบได้บันทึกไฟล์พิมพ์เขียวและสัดส่วนพื้นที่')} <strong>{uploadedBlueprint.dimensions}</strong> {tp('blueprintReceivedNoticeSuffix', 'เรียบร้อยแล้ว สถาปนิก G-Speed จะนำผังนี้ไปขึ้นแบบโครงสร้าง 3D Interior เสมือนจริงความละเอียดสูง (Photo-realistic Render) และจัดเตรียมใบเสนอราคาทางการส่งกลับให้ท่านภายใน 24 ชม.')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Itemized BOQ Table */}
                  <table className="quote-table official-boq-table">
                    <thead>
                      <tr>
                        <th style={{ width: '45px' }}>{tp('boqColNo', 'ลำดับ')}</th>
                        <th>{tp('boqColDesc', 'รายการรายละเอียดอุปกรณ์และงานระบบ (BOQ ITEM DESCRIPTION)')}</th>
                        <th style={{ width: '110px' }} className="text-center">{tp('boqColQty', 'จำนวน')}</th>
                        <th style={{ width: '130px' }} className="text-right">{tp('boqColUnit', 'ราคาต่อหน่วย')}</th>
                        <th style={{ width: '140px' }} className="text-right">{tp('boqColTotal', 'รวมเงิน (บาท)')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-center">1</td>
                        <td>
                          <strong>{tp('boqItem1_title', 'ชุดเครื่องคอมพิวเตอร์เกมมิ่งสเปก')} {currentTierInfo.name}</strong>
                          <div className="boq-item-desc">{currentTierInfo.cpu} • {currentTierInfo.gpu} • {currentTierInfo.ram} • {tp('monitor', 'จอ')} {currentTierInfo.monitor} • {tp('gamingGear', 'เกมมิ่งเกียร์')} {currentTierInfo.gear} {tp('boqItem1_note', '(ไม่รวมเก้าอี้ - รวมในชุดโต๊ะ)')}</div>
                        </td>
                        <td className="text-center">{totalStations} {tp('stationsCountUnit', 'เครื่อง')}</td>
                        <td className="text-right">฿{currentTierInfo.unitCost.toLocaleString()}</td>
                        <td className="text-right">฿{hardwareCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">2</td>
                        <td>
                          <strong>{tp('boqItem2_title', 'ชุดโต๊ะคอมพิวเตอร์เกมมิ่งพร้อมเก้าอี้ Ergonomic และโซนพิเศษในผัง')}</strong>
                          <div className="boq-item-desc">{tp('boqItem2_desc', 'จัดวางตามผังร้าน')} {placedItems.length} {tp('modulesUnit', 'โมดูล')} {tp('boqItem2_note', '(รวมเก้าอี้ Ergonomic ครบตามจำนวนที่นั่ง, รางร้อยสายไฟ, และกล่องเต้ารับคู่ 3 ขา)')}</div>
                        </td>
                        <td className="text-center">1 {tp('unitSet', 'ชุด')}</td>
                        <td className="text-right">-</td>
                        <td className="text-right">฿{furnitureItemsCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">3</td>
                        <td>
                          <strong>{tp('boqItem3_title', 'งานตกแต่งภายใน ระบบฝ้า ผนังกันเสียง & ไฟ Linear Modern')} ({translateDynamic(selectedThemeObj?.name || selectedTheme)})</strong>
                          <div className="boq-item-desc">{tp('boqItem3_desc', 'งานผนัง Acoustic ซับเสียง, งานพื้น Epoxy/กระเบื้องยาง Heavy-Duty, ป้ายไฟอะคริลิกเรืองแสงโลโก้แบรนด์')}</div>
                        </td>
                        <td className="text-center">{roomAreaSqM} {tp('sqmUnit', 'ตร.ม.')}</td>
                        <td className="text-right">฿{(fixedInfrastructure?.interiorSqMeterCost ?? FIXED_INFRASTRUCTURE.interiorSqMeterCost).toLocaleString()}</td>
                        <td className="text-right">฿{interiorDecorCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">4</td>
                        <td>
                          <strong>{tp('boqItem4_title', 'งานระบบปรับอากาศ Inverter Cassette Type ประหยัดพลังงาน')}</strong>
                          <div className="boq-item-desc">{tp('boqItem4_desc', 'เครื่องปรับอากาศฝังฝ้า 4 ทิศทาง พร้อมระบบระบายอากาศ Fresh Air Circulation สำหรับบริการ 24 ชม.')}</div>
                        </td>
                        <td className="text-center">{roomAreaSqM} {tp('sqm', 'ตร.ม.')}</td>
                        <td className="text-right">฿{(fixedInfrastructure?.airconSqMeterCost ?? FIXED_INFRASTRUCTURE.airconSqMeterCost).toLocaleString()}</td>
                        <td className="text-right">฿{airconCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">5</td>
                        <td>
                          <strong>{tp('boqItem5_title', 'ระบบแม่ข่าย Diskless Server 10Gbps NVMe High-Availability')}</strong>
                          <div className="boq-item-desc">{tp('boqItem5_desc', 'เซิร์ฟเวอร์สำรอง Dual-Host ระบบอัปเดตเกมอัตโนมัติความเร็วสูง รองรับการบูตพร้อมกันโดยไม่มีสะดุด')}</div>
                        </td>
                        <td className="text-center">1 {tp('unitSystem', 'ระบบ')}</td>
                        <td className="text-right">-</td>
                        <td className="text-right">฿{disklessCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">6</td>
                        <td>
                          <strong>{tp('boqItem6_title', 'ระบบโครงข่ายเน็ตเวิร์ก Enterprise Dual-WAN & Cisco 10G Switch')}</strong>
                          <div className="boq-item-desc">{tp('boqItem6_desc', 'สายสัญญาณ LAN CAT6A Shielded + ตู้ Rack 42U Server + ระบบ UPS สำรองไฟขนาด 10kVA')}</div>
                        </td>
                        <td className="text-center">1 {tp('unitSystem', 'ระบบ')}</td>
                        <td className="text-right">-</td>
                        <td className="text-right">฿{networkCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">7</td>
                        <td>
                          <strong>{tp('boqItem7_title', 'ระบบบริหารจัดการร้าน Billing & Cloud Member POS System')}</strong>
                          <div className="boq-item-desc">{tp('boqItem7_desc', 'โปรแกรมคิดเงิน ลิ้นชักเก็บเงิน เครื่องสแกนบาร์โค้ด และระบบสมาชิกระดับคลาวด์เชื่อมต่อส่วนกลาง')}</div>
                        </td>
                        <td className="text-center">1 {tp('unitSet', 'ชุด')}</td>
                        <td className="text-right">-</td>
                        <td className="text-right">฿{billingCost.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="text-center">8</td>
                        <td>
                          <strong>{tp('boqItem8_title', 'ค่าสิทธิ์แฟรนไชส์ G-SPEED & บริการ Turnkey Onboarding ครบวงจร')}</strong>
                          <div className="boq-item-desc">{tp('boqItem8_desc', 'สิทธิ์การใช้แบรนด์, แปลนก่อสร้าง 3D, จัดฝึกอบรมผู้จัดการและพนักงาน, การตลาดและโปรโมทเปิดร้าน')}</div>
                        </td>
                        <td className="text-center">1 {tp('unitBranch', 'สาขา')}</td>
                        <td className="text-right">-</td>
                        <td className="text-right">฿{franchiseLicenseCost.toLocaleString()}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="4" className="text-right"><strong>{tp('subtotalPreTax', 'ยอดรวมประมาณการลงทุนก่อนภาษี (Subtotal):')}</strong></td>
                        <td className="text-right"><strong>฿{totalInvestmentCost.toLocaleString()}</strong></td>
                      </tr>
                      <tr>
                        <td colSpan="4" className="text-right">{tp('vat7Label', 'ภาษีมูลค่าเพิ่ม 7% (VAT 7%):')}</td>
                        <td className="text-right">฿{Math.round(totalInvestmentCost * 0.07).toLocaleString()}</td>
                      </tr>
                      <tr className="grand-total-row">
                        <td colSpan="4" className="text-right"><strong>{tp('boqGrandTotal', 'ยอดรวมสุทธิทั้งสิ้น (GRAND TOTAL):')}</strong></td>
                        <td className="text-right"><strong className="text-blue font-large">฿{Math.round(totalInvestmentCost * 1.07).toLocaleString()}</strong></td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* Commercial Terms & Notes */}
                  <div className="quote-commercial-terms">
                    <div className="terms-title">{tp('commercialTermsTitle', 'เงื่อนไขและข้อตกลงทางการค้า (COMMERCIAL TERMS & WARRANTY)')}</div>
                    <ol className="terms-list">
                      <li><strong>{tp('term1_title', 'เงื่อนไขการชำระเงินแบ่ง 3 งวด:')}</strong> {tp('term1_desc', 'งวดที่ 1 (มัดจำลงนามสัญญา) 30% | งวดที่ 2 (จัดส่งและติดตั้งอุปกรณ์) 50% | งวดที่ 3 (ตรวจรับงานและเปิดร้าน) 20%')}</li>
                      <li><strong>{tp('term2_title', 'การรับประกัน (Warranty):')}</strong> {tp('term2_desc', 'อุปกรณ์คอมพิวเตอร์และเซิร์ฟเวอร์รับประกัน On-site Service 3 ปีเต็ม, ระบบ Network ดูแลตลอด 24 ชม. ผ่าน Cloud Monitoring')}</li>
                      <li><strong>{tp('term3_title', 'ระยะเวลาก่อสร้างและส่งมอบ:')}</strong> {tp('term3_desc', 'ดำเนินการแล้วเสร็จภายใน 4 - 6 สัปดาห์ พร้อมเปิดให้บริการเชิงพาณิชย์')}</li>
                      <li><strong>{tp('term4_title', 'ราคารวมงานแบบเบ็ดเสร็จ (Turnkey):')}</strong> {tp('term4_desc', 'รวมค่าขนส่ง, การติดตั้งสายระบบไฟฟ้า, สายแลน, การคอนฟิกระบบ Diskless และการอบรมบุคลากร')}</li>
                    </ol>
                  </div>

                  {/* Official Signatures Section */}
                  <div className="quote-signatures-row">
                    <div className="signature-box" style={{ position: 'relative', overflow: 'visible' }}>
                      {/* Authentic Corporate Stamp / Official Seal */}
                      <div className="official-company-seal" style={{
                        position: 'absolute',
                        right: '18px',
                        top: '-15px',
                        width: '108px',
                        height: '108px',
                        borderRadius: '50%',
                        border: '3px double #dc2626',
                        color: '#dc2626',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        transform: 'rotate(-12deg)',
                        opacity: 0.88,
                        pointerEvents: 'none',
                        userSelect: 'none',
                        zIndex: 2,
                        background: 'rgba(254, 242, 242, 0.25)',
                        boxShadow: 'inset 0 0 0 1px rgba(220, 38, 38, 0.2)'
                      }}>
                        <div style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.5px' }}>★ G-SPEED LIVING PLUS ★</div>
                        <div style={{ fontSize: '0.64rem', fontWeight: 900, borderTop: '1px solid #dc2626', borderBottom: '1px solid #dc2626', padding: '1px 0', width: '84%', margin: '2px 0', letterSpacing: '0.5px' }}>OFFICIAL SEAL</div>
                        <div style={{ fontSize: '0.48rem', fontWeight: 700 }}>AUTHORIZED DEPT</div>
                        <div style={{ fontSize: '0.44rem', opacity: 0.85 }}>TAX: 0105566012345</div>
                      </div>

                      <div className="sign-line"></div>
                      <div className="sign-name">{tp('authorizedSignatureTitle', 'ผู้อนุมัติเสนอราคา (Authorized Signature)')}</div>
                      <div className="sign-title">{tp('franchiseDeptTitle', 'ฝ่ายพัฒนาธุรกิจแฟรนไชส์ / G-Speed Living Plus Co., Ltd.')}</div>
                      <div className="sign-date">{tp('datePrefix', 'วันที่:')} {new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : language === 'en' ? 'en-US' : 'th-TH', { year: 'numeric', month: 'numeric', day: 'numeric' })}</div>
                    </div>
                    <div className="signature-box">
                      <div className="sign-line"></div>
                      <div className="sign-name">{tp('franchiseeAcceptanceTitle', 'ผู้ขอรับสิทธิ์แฟรนไชส์ / ลูกค้า (Franchisee Acceptance)')}</div>
                      <div className="sign-title">{tp('agreementTitle', 'ผู้ตกลงยินยอมตามใบเสนอราคา')}</div>
                      <div className="sign-date">{tp('datePrefix', 'วันที่:')} ..... / ..... / ..........</div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleLeadSubmit} className="lead-submission-form">
                  <div className="lead-form-header">
                    <Send size={18} className="text-blue" />
                    <h4>{tp('leadFormTitle', 'ต้องการให้ทีมงาน G-Speed ติดต่อกลับพร้อมส่งแปลนร้านนี้')}</h4>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>{tp('fullName', 'ชื่อ - นามสกุล')} *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder={tp('leadNamePlaceholder', 'คุณสมเกียรติ มั่นคง')}
                        value={leadForm.fullName}
                        onChange={e => setLeadForm({...leadForm, fullName: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>{tp('phone', 'เบอร์โทรศัพท์ (ติดต่อกลับ)')} *</label>
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
                      <label>{tp('email', 'อีเมล (รับใบเสนอราคา)')} *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="investor@example.com"
                        value={leadForm.email}
                        onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <label style={{ margin: 0 }}>{tp('budgetLabel', 'งบประมาณลงทุนที่เตรียมไว้')}</label>
                        <span style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 600 }}>
                          ⚡ {tp('calcByLayout', 'คำนวณอัตโนมัติตามแปลน')}
                        </span>
                      </div>
                      <select 
                        value={leadForm.budget}
                        onChange={e => setLeadForm({...leadForm, budget: e.target.value})}
                      >
                        <option value={`฿${totalInvestmentCost.toLocaleString()} (${tp('budgetCalculatedAuto', 'คำนวณตามผังร้านและสเปค')})`}>
                          ฿{totalInvestmentCost.toLocaleString()} {tp('baht', 'บาท')} ({tp('budgetAutoOptionDesc', 'คำนวณอัตโนมัติตามผัง')} {totalStations} {tp('stationsCountUnit', 'เครื่อง')})
                        </option>
                        <option value="1,000,000 - 2,000,000">{tp('budget1to2m', '1,000,000 - 2,000,000 บาท')}</option>
                        <option value="2,000,000 - 3,500,000">{tp('budget2to35m', '2,000,000 - 3,500,000 บาท')}</option>
                        <option value="3,500,000 - 5,000,000">{tp('budget35to5m', '3,500,000 - 5,000,000 บาท')}</option>
                        <option value="5,000,000+">{tp('budget5mPlus', '5,000,000 บาทขึ้นไป (Flagship Arena)')}</option>
                        <option value="มีงบประมาณเฉพาะ / ปรึกษาผู้เชี่ยวชาญ">{tp('customBudgetConsult', 'มีงบประมาณเฉพาะ / ปรึกษาผู้เชี่ยวชาญ')}</option>
                      </select>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                        💡 {tp('budgetSummaryLabel', 'งบประเมินรวมฮาร์ดแวร์และโครงสร้างพื้นฐาน:')} <strong style={{ color: '#0f172a' }}>฿{totalInvestmentCost.toLocaleString()} {tp('baht', 'บาท')}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{tp('locationLabel', 'ทำเลหรือจังหวัดที่สนใจเปิดสาขา')}</label>
                    <textarea 
                      rows={2} 
                      placeholder={tp('leadNotesPlaceholder', 'เช่น มีอาคารพาณิชย์ 2 คูหา ย่าน ม.เกษตรศาสตร์ ติดถนนใหญ่...')}
                      value={leadForm.locationDetail}
                      onChange={e => setLeadForm({...leadForm, locationDetail: e.target.value})}
                    />
                  </div>

                  {/* Honeypot Anti-Bot Field */}
                  <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0, overflow: 'hidden' }} aria-hidden="true" tabIndex={-1}>
                    <label htmlFor="hp_lead_security">Security Verification (Do not fill)</label>
                    <input 
                      id="hp_lead_security"
                      type="text" 
                      name="hp_lead_security" 
                      tabIndex={-1} 
                      autoComplete="off"
                      value={leadHoneypot}
                      onChange={e => setLeadHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="lead-form-modal-footer">
                    <button 
                      type="submit" 
                      className="btn-lead-submit btn-primary" 
                      disabled={isSubmittingLead || leadCooldown > 0}
                      style={isSubmittingLead || leadCooldown > 0 ? { opacity: 0.75, cursor: 'not-allowed' } : {}}
                    >
                      {isSubmittingLead ? (
                        <>
                          <RefreshCw size={16} className="spin-icon" />
                          <span>{tp('submittingLead', 'กำลังส่งข้อมูล...')}</span>
                        </>
                      ) : leadCooldown > 0 ? (
                        <>
                          <Clock size={16} />
                          <span>{language === 'zh' ? `已发送 (防连点冷却 ${leadCooldown} 秒...)` : language === 'en' ? `Submitted (Relay Wait ${leadCooldown}s...)` : `ส่งแล้ว (รอคูลดาวน์ ${leadCooldown} วิ...)`}</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>{tp('submitLeadBtn', 'ส่งแปลนขอคำปรึกษา')}</span>
                        </>
                      )}
                    </button>
                    <div className="lead-form-secondary-actions">
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={handleExportBlueprintImage}
                        title={tp('downloadBlueprintHint', 'ดาวน์โหลดแปลนสำหรับช่าง (PNG)')}
                      >
                        <Download size={15} />
                        <span>{tp('downloadBlueprintPng', 'ดาวน์โหลดแปลน (PNG)')}</span>
                      </button>
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => window.print()}
                        title={tp('printQuotationHint', 'พิมพ์ใบเสนอราคา (Print หรือ Save PDF)')}
                      >
                        <Printer size={15} />
                        <span>{tp('printQuotationBtn', 'พิมพ์ใบเสนอราคา')}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: THANK YOU & CONSULTATION PROMISE POPUP */}
      {showThankYouPopup && submittedLeadData && (
        <div className="thank-you-popup-backdrop" onClick={(e) => e.stopPropagation()}>
          <div className="thank-you-popup-dialog glass-panel" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="btn-icon-close" 
              onClick={() => setShowThankYouPopup(false)}
              aria-label={tp('closeModalAria', 'ปิดหน้าต่าง')}
            >
              <X size={20} />
            </button>

            {/* Success Icon with Animated Glow */}
            <div className="thank-you-icon-wrapper">
              <div className="thank-you-icon-halo"></div>
              <div className="thank-you-icon-circle">
                <CheckCircle2 size={44} className="text-green" />
              </div>
            </div>

            <div className="thank-you-badge-ref">
              <Sparkles size={14} />
              <span>{tp('thankYouRefSaved', 'บันทึกแปลนร้านสำเร็จ • REF ID:')} <strong>{submittedLeadData.quoteRef}</strong></span>
            </div>

            <h2 className="thank-you-title">
              {tp('thankYouTitle', 'ขอขอบพระคุณที่ให้ความไว้วางใจ')}<br />
              <span className="text-gradient-blue">GLP : G Speed Living Plus</span>
            </h2>

            <p className="thank-you-subtext">
              {tp('thankYouSubtitle', 'ทีมวิศวกรออกแบบระบบและที่ปรึกษาการลงทุนแฟรนไชส์ GLP ได้รับข้อมูลพิมพ์เขียวผังร้านของคุณเรียบร้อยแล้ว')}
            </p>

            {/* SLA Promise Highlight Card */}
            <div className="thank-you-sla-card">
              <div className="sla-card-header">
                <Clock size={18} className="text-orange" />
                <strong>{tp('slaTitle', 'การประสานงานติดต่อกลับภายใน 24 ชั่วโมง')}</strong>
              </div>
              <p className="sla-card-body">{tp('thankYouFeasibilityBody', 'เรากำลังนำข้อมูลขนาดพื้นที่')} <strong>{submittedLeadData.roomDimensions}</strong> {tp('andCount', 'และจำนวน')} <strong>{submittedLeadData.stations} {tp('stationsCountUnit', 'เครื่อง')}</strong> {tp('toPrepareFeasibility', 'ไปจัดทำ รายงานวิเคราะห์ความเป็นไปได้ของโครงการ (Feasibility Study) พร้อมประมาณการผลตอบแทนรายเดือน โดยทีมงานผู้เชี่ยวชาญจะติดต่อกลับไปยังเบอร์')} <strong className="text-blue">{submittedLeadData.phone}</strong> {tp('orEmail', 'หรืออีเมล')} <strong className="text-blue">{submittedLeadData.email}</strong> {tp('within24Hours', 'ภายใน 24 ชั่วโมง เพื่อส่งมอบเอกสารสรุปโครงการและนัดหมายให้คำปรึกษาแบบ 1-on-1 โดยไม่มีค่าใช้จ่าย')}</p>
            </div>

            {/* Project Snapshot Card */}
            <div className="thank-you-project-snapshot">
              <div className="snapshot-item">
                <span className="snapshot-label">{tp('placedLayoutLabel', 'ผังร้านที่จัดวาง')}</span>
                <strong className="snapshot-value">{submittedLeadData.stations} {tp('stationsCountUnit', 'เครื่อง')}</strong>
              </div>
              <div className="snapshot-item">
                <span className="snapshot-label">{tp('estBudgetLabel', 'งบประมาณประเมิน')}</span>
                <strong className="snapshot-value text-blue">฿{submittedLeadData.totalInvestment?.toLocaleString()} {tp('bahtShort', 'บ.')}</strong>
              </div>
              <div className="snapshot-item">
                <span className="snapshot-label">{tp('emailStatusLabel', 'สถานะอีเมลตอบกลับ')}</span>
                <span className="snapshot-badge-sent">
                  <Check size={12} /> {tp('autoCopySent', 'ส่งสำเนาอัตโนมัติแล้ว')}
                </span>
              </div>
            </div>

            {/* Auto Redirect Countdown */}
            <div className="thank-you-countdown-box">
              <div className="countdown-pulse-dot"></div>
              <span>{tp('autoRedirectCountdownPrefix', 'ระบบกำลังพาท่านกลับสู่หน้าแรกอัตโนมัติในอีก')} <strong className="countdown-number">{redirectCountdown}</strong> {tp('secondsUnit', 'วินาที')}</span>
            </div>

            {/* Action Buttons */}
            <div className="thank-you-actions">
              <button 
                type="button" 
                className="btn-primary thank-you-btn-home"
                onClick={handleRedirectToHome}
              >
                <span>{tp('goToHomeBtn', 'กลับสู่หน้าหลักทันที (Go to Home)')}</span>
                <ArrowRight size={18} />
              </button>
              <button 
                type="button" 
                className="btn-secondary thank-you-btn-stay"
                onClick={() => setShowThankYouPopup(false)}
              >
                <span>{tp('stayOnPlannerBtn', 'ดูแปลนจำลองต่อ')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Specification & Detail Showcase Modal */}
      {selectedCatalogModalItem && (
        <div className="catalog-detail-modal-overlay" onClick={() => setSelectedCatalogModalItem(null)}>
          <div className="catalog-detail-modal-content" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="catalog-modal-header">
              <div className="catalog-modal-title-wrap">
                <div className="catalog-modal-icon-badge" style={{ color: selectedCatalogModalItem.accentColor || '#2563eb' }}>
                  <Box size={22} />
                </div>
                <div>
                  <div className="catalog-modal-tags">
                    <span className="modal-category-tag">
                      {selectedCatalogModalItem.category === 'stations' ? tp('cat_stations', 'โต๊ะคอมพิวเตอร์เกมมิ่ง') : (selectedCatalogModalItem.category === 'vip' ? tp('cat_vip', 'ห้องซ้อม VIP Suite') : (selectedCatalogModalItem.category === 'facilities' ? tp('cat_facilities', 'โซนบริการและแคชเชียร์') : tp('cat_stage', 'เวทีและสิ่งอำนวยความสะดวก')))}
                    </span>
                    <span className="modal-grade-tag">
                      {selectedCatalogModalItem.grade === 'vip' ? 'VIP Series' : (selectedCatalogModalItem.grade === 'ultimate' ? 'Ultimate Studio' : 'Pro Competitive')}
                    </span>
                  </div>
                  <h3 className="catalog-modal-title">{selectedCatalogModalItem.name}</h3>
                </div>
              </div>
              <button 
                type="button" 
                className="catalog-modal-close-btn"
                onClick={() => setSelectedCatalogModalItem(null)}
                title={tp('closeModalAria', 'ปิดหน้าต่าง')}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="catalog-modal-body">
              {/* Left Column: Media & Visual Color Palette */}
              <div className="catalog-modal-left-col">
                <div className="catalog-modal-img-frame">
                  <img 
                    src={selectedCatalogModalItem.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80'} 
                    alt={selectedCatalogModalItem.name} 
                    className="catalog-modal-main-img" 
                  />
                  <div className="catalog-modal-img-badge">
                    <Sparkles size={13} />
                    <span>{tp('realProductPhotoBadge', 'ภาพสินค้าจริงจากโรงงานผลิต G-Speed')}</span>
                  </div>
                </div>

                {/* Color Palette & Material Tones Card */}
                <div className="catalog-modal-colors-card">
                  <h5 className="modal-section-h5">
                    <Palette size={15} className="text-cyan" />
                    <span>{tp('colorAndFinishTitle', 'โทนสีและวัสดุตกแต่งจริง (Color & Finish)')}</span>
                  </h5>
                  <div className="color-swatches-grid">
                    <div className="color-swatch-item">
                      <span className="color-swatch-box" style={{ backgroundColor: selectedCatalogModalItem.deskColor || '#0f172a' }} />
                      <div className="color-swatch-text">
                        <span className="swatch-lbl">{tp('deskTopLegColor', 'สีท็อป & ขาโต๊ะ')}</span>
                        <strong className="swatch-val">{selectedCatalogModalItem.deskColor === '#0f172a' ? tp('blackObsidianVal', 'Black Obsidian (ดำด้าน)') : (selectedCatalogModalItem.deskColor === '#1e293b' ? 'Dark Slate Gray' : selectedCatalogModalItem.deskColor)}</strong>
                      </div>
                    </div>
                    <div className="color-swatch-item">
                      <span className="color-swatch-box" style={{ backgroundColor: selectedCatalogModalItem.accentColor || '#1d4ed8' }} />
                      <div className="color-swatch-text">
                        <span className="swatch-lbl">{tp('neonAccentColor', 'สีไฟนีออน / ขอบตกแต่ง')}</span>
                        <strong className="swatch-val">{selectedCatalogModalItem.accentColor === '#1d4ed8' ? tp('esportBlueVal', 'Esport Blue (น้ำเงิน)') : (selectedCatalogModalItem.accentColor === '#38bdf8' ? tp('cyberCyanVal', 'Cyber Cyan (ฟ้าสว่าง)') : (selectedCatalogModalItem.accentColor === '#8b5cf6' ? tp('auraPurpleVal', 'Aura Purple (ม่วง)') : selectedCatalogModalItem.accentColor))}</strong>
                      </div>
                    </div>
                    {selectedCatalogModalItem.chairColor && (
                      <div className="color-swatch-item">
                        <span className="color-swatch-box" style={{ backgroundColor: selectedCatalogModalItem.chairColor || '#0f172a' }} />
                        <div className="color-swatch-text">
                          <span className="swatch-lbl">{tp('chairLeatherColor', 'สีหนังเก้าอี้เกมมิ่ง')}</span>
                          <strong className="swatch-val">{tp('racingBlackVal', 'Racing Black (หนัง PU ดำเดินด้ายคู่)')}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dimension Metric Quick Pills */}
                <div className="catalog-modal-dimensions-card">
                  <div className="dimension-metric-item">
                    <span className="dim-lbl">{tp('dimSizeWidth', 'ความกว้าง (Width)')}</span>
                    <strong className="dim-val text-cyan">{selectedCatalogModalItem.widthMeters} {tp('metersUnit', 'เมตร')}</strong>
                  </div>
                  <div className="dimension-metric-item">
                    <span className="dim-lbl">{tp('dimSizeDepth', 'ความลึก (Depth)')}</span>
                    <strong className="dim-val text-cyan">{selectedCatalogModalItem.depth3D || selectedCatalogModalItem.heightMeters} {tp('metersUnit', 'เมตร')}</strong>
                  </div>
                  <div className="dimension-metric-item">
                    <span className="dim-lbl">{tp('dimSizeHeight', 'ความสูง (Height)')}</span>
                    <strong className="dim-val text-cyan">{selectedCatalogModalItem.height3D || 1.25} {tp('metersUnit', 'เมตร')}</strong>
                  </div>
                  <div className="dimension-metric-item">
                    <span className="dim-lbl">{tp('seatsInSet', 'จำนวนที่นั่งในเซ็ต')}</span>
                    <strong className="dim-val text-emerald">{selectedCatalogModalItem.seats > 0 ? `${selectedCatalogModalItem.seats} ${tp('seatsUnit', 'ที่นั่ง')} (${tp('deskPrefix', 'โต๊ะ')} 1.20${tp('metersUnit', 'ม.')})` : tp('servicePoint', 'จุดบริการ')}</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Technical Specifications */}
              <div className="catalog-modal-right-col">
                {/* Price Breakdown Banner */}
                <div className="catalog-modal-pricing-box">
                  <div className="pricing-box-left">
                    <span className="pricing-title">{tp('setPriceWithInstall', 'ราคารวมเซ็ตพร้อมติดตั้ง:')}</span>
                    <div className="pricing-main-amount">
                      <span className="currency">฿</span>
                      <span className="amount">{selectedCatalogModalItem.baseCost?.toLocaleString()}</span>
                      <span className="vat-note">{tp('vatAndInstallIncluded', '(รวมภาษีและค่าติดตั้ง)')}</span>
                    </div>
                  </div>
                  <div className="pricing-box-right">
                    <div className="pricing-mini-item">
                      <span>{tp('customDesk', 'โต๊ะสั่งผลิต:')}</span>
                      <strong>฿{selectedCatalogModalItem.deskPrice?.toLocaleString()}</strong>
                    </div>
                    {selectedCatalogModalItem.chairCount > 0 && (
                      <div className="pricing-mini-item">
                        <span>{tp('gamingChairsCount', 'เก้าอี้เกมมิ่ง')} ({selectedCatalogModalItem.chairCount} {tp('unitsChairs', 'ตัว')}):</span>
                        <strong>฿{((selectedCatalogModalItem.chairPrice || 0) * (selectedCatalogModalItem.chairCount || 1)).toLocaleString()}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Specifications Accordion / Cards */}
                <div className="catalog-modal-specs-list">
                  {/* 1. Materials & Construction */}
                  <div className="modal-spec-card">
                    <div className="spec-card-header">
                      <Shield size={16} className="text-blue" />
                      <h4>{tp('specSection1_title', '1. สเปกวัสดุและโครงสร้างทางวิศวกรรม (Material & Construction)')}</h4>
                    </div>
                    <p className="spec-card-body-text">{selectedCatalogModalItem.material}</p>
                    <ul className="spec-bullets-list">
                      <li><strong>{tp('specHplTop', 'หน้าท็อปโต๊ะ:')}</strong> {tp('specHplTopDesc', 'ไม้สังเคราะห์ HPL (High Pressure Laminate) ความหนา 25 มม. เกรดทนความร้อน กันน้ำ 100% และกันรอยขูดขีด')}</li>
                      <li><strong>{tp('specErgoEdge', 'ขอบโต๊ะ Ergonomic:')}</strong> {tp('specErgoEdgeDesc', 'เจียรลบมุมลาดเอียง 45 องศา (Bevel Edge) ตามหลักสรีรศาสตร์ รองรับข้อมือผู้เล่นเกมได้สบายตลอดวัน')}</li>
                      <li><strong>{tp('specSteelFrame', 'โครงขาและคานรับแรง:')}</strong> {tp('specSteelFrameDesc', 'เหล็กกล้าคาร์บอน (Carbon Steel Box) หนา 1.5 - 2.0 มม. พ่นสีพาวเดอร์โค้ตกันสนิม รองรับน้ำหนักได้มากกว่า 250 กก.')}</li>
                    </ul>
                  </div>

                  {/* 2. Furniture & Chairs Included */}
                  {selectedCatalogModalItem.chairCount > 0 && (
                    <div className="modal-spec-card">
                      <div className="spec-card-header">
                        <Armchair size={16} style={{ color: '#0284c7' }} />
                        <h4>{tp('specSection2_title', '2. สเปกเก้าอี้เกมมิ่งและอุปกรณ์ที่มาในเซ็ต (Included Furniture)')}</h4>
                      </div>
                      <div className="chair-spec-info-box">
                        <strong>{tp('chairModelLabel', 'รุ่นเก้าอี้:')} {selectedCatalogModalItem.chairModel}</strong>
                        <span className="chair-count-badge">{tp('chairCountPrefix', 'จำนวน')} {selectedCatalogModalItem.chairCount} {tp('unitsChairs', 'ตัว')} {tp('perStationSuffix', 'ประจำสถานี')}</span>
                      </div>
                      <ul className="spec-bullets-list">
                        <li><strong>{tp('specCushion', 'เบาะรองนั่ง:')}</strong> {tp('specCushionDesc', 'โฟมขึ้นรูปเย็นความหนาแน่นสูง (High-Density Cold-Cure Foam) ไม่ยุบตัว รับประกันการใช้งานต่อเนื่อง')}</li>
                        <li><strong>{tp('specRecline', 'ฟังก์ชันการปรับระดับ:')}</strong> {tp('specReclineDesc', 'ปรับเอนหลังได้ 160 องศา พร้อมระบบล็อกมัลติฟังก์ชัน + ที่พักแขน 3D/4D ปรับระดับความสูงและองศาได้')}</li>
                        <li><strong>{tp('specGasLift', 'ระบบรองรับน้ำหนัก:')}</strong> {tp('specGasLiftDesc', 'โช้กแก๊ส Class 4 ผ่านการทดสอบความปลอดภัยระดับสากล BIFMA รองรับน้ำหนักสูงสุด 150 กก./ตัว')}</li>
                      </ul>
                    </div>
                  )}

                  {/* 3. Electrical & Data Raceway */}
                  <div className="modal-spec-card">
                    <div className="spec-card-header">
                      <Zap size={16} className="text-amber" />
                      <h4>{tp('specSection3_title', '3. ระบบท่อร้อยสายไฟและโครงข่ายเน็ตเวิร์ก (Electrical & LAN Raceway)')}</h4>
                    </div>
                    <ul className="spec-bullets-list">
                      <li><strong>{tp('specRaceway', 'รางร้อยสายไฟใต้โต๊ะ (Dual Cable Raceway):')}</strong> {tp('specRacewayDesc', 'รางเหล็กซ่อนสายไฟ 2 ช่องอิสระ แยกท่อไฟฟ้ากำลัง 220V และสายแลน LAN ป้องกันสัญญาณรบกวน (Zero Interference)')}</li>
                      <li><strong>{tp('specSocket', 'จุดเต้ารับไฟฟ้าต่อสถานี:')}</strong> {tp('specSocketDesc', 'เต้ารับคู่ 3 ขา มีกราวด์ (Universal Socket 220V 16A) พร้อมเบรกเกอร์กันไฟกระชาก (Surge Protection) 1:1')}</li>
                      <li><strong>{tp('specLan', 'การเชื่อมต่อเน็ตเวิร์ก:')}</strong> {tp('specLanDesc', 'เต้ารับ LAN RJ-45 CAT6A Shielded ความเร็ว 10Gbps Ready พร้อมท่อร้อยสายเชื่อมตรงสู่ตู้ Rack เซิร์ฟเวอร์')}</li>
                    </ul>
                  </div>

                  {/* 4. Warranty & Production Lead Time */}
                  <div className="modal-spec-card highlight-warranty">
                    <div className="spec-card-header">
                      <CheckCircle2 size={16} className="text-emerald" />
                      <h4>{tp('specSection4_title', '4. การรับประกันและระยะเวลาผลิต (Warranty & Delivery)')}</h4>
                    </div>
                    <div className="warranty-grid">
                      <div className="warranty-item">
                        <span className="w-lbl">{tp('warrantyLabel', 'การรับประกัน:')}</span>
                        <strong className="w-val text-emerald">{selectedCatalogModalItem.warranty}</strong>
                      </div>
                      <div className="warranty-item">
                        <span className="w-lbl">{tp('leadTimeLabel', 'ระยะเวลาสั่งผลิต:')}</span>
                        <strong className="w-val text-cyan">{selectedCatalogModalItem.leadTime}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="catalog-modal-footer">
              <div className="modal-footer-left">
                <span className="footer-summary-lbl">{tp('modelIncludes', 'โมเดลนี้ประกอบด้วย:')}</span>
                <strong>{selectedCatalogModalItem.seats > 0 ? `${tp('standardDeskPrefix', 'โต๊ะมาตรฐาน')} ${selectedCatalogModalItem.widthMeters}${tp('metersUnit', 'ม.')} + ${tp('chairsPrefix', 'เก้าอี้')} ${selectedCatalogModalItem.chairCount} ${tp('unitsChairs', 'ตัว')} + ${tp('racewayIncluded', 'รางสายไฟครบชุด')}` : getItemDesc(selectedCatalogModalItem)}</strong>
              </div>
              <div className="modal-footer-btns">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setSelectedCatalogModalItem(null)}
                >
                  {tp('closeWindow', 'ปิดหน้าต่าง')}
                </button>
                <button 
                  type="button" 
                  className="btn-primary"
                  onClick={() => {
                    handleAddItem(selectedCatalogModalItem);
                    setSelectedCatalogModalItem(null);
                  }}
                >
                  <Plus size={16} />
                  <span>{tp('addTo3dPlan', 'เพิ่มลงในผัง 3D (Add to Plan)')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blueprint Drawing Export Preview Modal */}
      {exportedBlueprintModal && (
        <div className="blueprint-preview-modal-overlay" onClick={() => setExportedBlueprintModal(null)}>
          <div className="blueprint-preview-modal-content" onClick={e => e.stopPropagation()}>
            <div className="bp-modal-header">
              <div className="bp-modal-title-wrap">
                <Download size={20} className="text-blue" />
                <div>
                  <h3 className="bp-modal-title">{tp('blueprintModalTitle', 'แบบแปลนสถาปัตยกรรม & งานระบบ (PNG)')}</h3>
                  <span className="bp-modal-subtitle">{exportedBlueprintModal.filename}</span>
                </div>
              </div>
              <button 
                type="button"
                className="bp-modal-close" 
                onClick={() => setExportedBlueprintModal(null)}
                title={tp('closeModalAria', 'ปิดหน้าต่าง')}
              >
                <X size={18} />
              </button>
            </div>

            <div 
              className="bp-modal-body" 
              onClick={() => setIsBlueprintZoomed(prev => !prev)}
              title={isBlueprintZoomed ? tp('unzoomTooltip', 'คลิกเพื่อย่อมุมมองปกติ') : tp('zoomTooltip', 'คลิกเพื่อขยายดูตัวอักษรและรายละเอียดขนาดใหญ่ (100% Zoom)')}
            >
              <div className="bp-floating-zoom-badge">
                <span>{isBlueprintZoomed ? '🔍 ' + tp('zooming100', 'กำลังซูม 100% (คลิกเพื่อย่อภาพรวม)') : '🔍 ' + tp('clickToZoom100', 'คลิกภาพเพื่อซูมดูตัวหนังสือและอุปกรณ์ 100%')}</span>
              </div>
              <img 
                src={exportedBlueprintModal.dataUrl} 
                alt="Architectural Blueprint Preview" 
                className={`bp-preview-img ${isBlueprintZoomed ? 'is-zoomed' : ''}`}
              />
            </div>

            <div className="bp-modal-footer">
              <div className="bp-modal-tip">
                <span>💡 <strong>{tp('hintLabel', 'คำแนะนำ:')}</strong> {isBlueprintZoomed ? tp('zoomedHint', 'คลิกที่ภาพเพื่อย่อมุมมองปกติ | เลื่อนลูกกลิ้งเมาส์เพื่อดูส่วนต่างๆ') : tp('unzoomedHint', 'คลิกที่ภาพ หรือกดปุ่ม "ขยายดูอุปกรณ์ 100%" เพื่ออ่านตัวหนังสือชัดเจน')}</span>
              </div>
              <div className="bp-modal-btns">
                <button 
                  type="button"
                  className="btn-primary bp-btn-save" 
                  onClick={() => downloadFile(exportedBlueprintModal.dataUrl, exportedBlueprintModal.filename, 'image/png')}
                >
                  <Download size={16} />
                  <span>{tp('saveFilePng', 'บันทึกไฟล์ (PNG)')}</span>
                </button>
                <div className="bp-modal-sub-btns">
                  <button 
                    type="button"
                    className="btn-secondary"
                    style={{ 
                      background: isBlueprintZoomed ? '#2563eb' : '#eff6ff', 
                      color: isBlueprintZoomed ? '#ffffff' : '#1d4ed8', 
                      borderColor: '#2563eb', 
                      fontWeight: 700 
                    }}
                    onClick={() => setIsBlueprintZoomed(prev => !prev)}
                  >
                    <ZoomIn size={15} />
                    <span>{isBlueprintZoomed ? tp('zoomFit', 'ย่อมุมมอง') : tp('zoom100', 'ซูม 100%')}</span>
                  </button>
                  <button 
                    type="button"
                    className="btn-secondary" 
                    onClick={() => {
                      const win = window.open();
                      if (win) {
                        win.document.write(`<!DOCTYPE html><html><head><title>${exportedBlueprintModal.filename}</title><style>body{margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;min-height:100vh;}img{max-width:98%;max-height:98vh;border-radius:6px;box-shadow:0 10px 40px rgba(0,0,0,0.5);}</style></head><body><img src="${exportedBlueprintModal.dataUrl}" alt="Blueprint" /></body></html>`);
                      }
                    }}
                  >
                    <Eye size={15} />
                    <span>{tp('openNewTab', 'เปิดแท็บใหม่')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {itemPendingDelete && (
        <div 
          className="delete-confirm-modal-overlay"
          onClick={cancelDeleteItem}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="delete-confirm-modal-card" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="del-modal-header">
              <div className="del-modal-icon-bubble">
                <Trash2 size={22} />
              </div>
              <button 
                type="button" 
                className="del-modal-close-btn"
                onClick={cancelDeleteItem}
                title={tp('closeModalAria', 'ปิดหน้าต่าง')}
              >
                <X size={18} />
              </button>
            </div>

            <div className="del-modal-content">
              <h3 className="del-modal-title">{tp('delModalTitle', 'ยืนยันนำอุปกรณ์ออกจากผัง?')}</h3>
              <p className="del-modal-desc">{tp('delModalDesc', 'คุณต้องการนำอุปกรณ์ชิ้นนี้ออกจากแบบจำลองผังร้าน 3D ใช่หรือไม่?')}</p>

              {/* Item preview card */}
              <div className="del-modal-item-preview">
                {itemPendingDelete.catalog?.image ? (
                  <img 
                    src={itemPendingDelete.catalog.image} 
                    alt={itemPendingDelete.catalog?.name} 
                    className="del-modal-item-img" 
                  />
                ) : (
                  <div className="del-modal-item-icon-fallback">
                    {renderCatalogItemIcon(itemPendingDelete.catalog?.icon, 20)}
                  </div>
                )}
                <div className="del-modal-item-info">
                  <h4 className="del-modal-item-name">{itemPendingDelete.catalog?.name || itemPendingDelete.type}</h4>
                  <div className="del-modal-item-meta">
                    <span className="del-meta-dim">
                      <Ruler size={11} />
                      {itemPendingDelete.catalog?.seats > 0 
                        ? `${itemPendingDelete.catalog.seats} ${tp('seatsUnit', 'ที่นั่ง')} (${itemPendingDelete.catalog.widthMeters}${tp('metersUnit', 'ม.')})` : `${itemPendingDelete.catalog?.widthMeters || 1} x ${itemPendingDelete.catalog?.heightMeters || 1} ${tp('metersUnit', 'ม.')}`}
                    </span>
                    <span className="del-meta-price">
                      ฿{(itemPendingDelete.catalog?.baseCost || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="del-modal-subtext">
                <Info size={13} className="text-blue" />
                <span>{tp('delModalSubtext', 'ท่านสามารถเลือกเพิ่มอุปกรณ์ชิ้นนี้กลับเข้ามาใหม่ได้ตลอดเวลาจากแท็บ')} <strong>"{tp('addEquipmentShort', '+ เพิ่มอุปกรณ์')}"</strong></span>
              </p>
            </div>

            <div className="del-modal-footer">
              <button 
                type="button" 
                className="btn-del-modal-cancel" 
                onClick={cancelDeleteItem}
              >
                {tp('cancel', 'ยกเลิก')}
              </button>
              <button 
                type="button" 
                className="btn-del-modal-confirm" 
                onClick={confirmDeleteItem}
              >
                <Trash2 size={14} />
                <span>{tp('confirmRemove', 'ยืนยันนำอุปกรณ์ออก')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
