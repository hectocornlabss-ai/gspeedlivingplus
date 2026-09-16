import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutGrid, Calculator, Monitor, Armchair, Server, CreditCard, Coffee, 
  Users, Trophy, Shield, Plus, RotateCw, Trash2, Copy, Download, 
  Send, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, DollarSign, Clock, 
  Sliders, ChevronRight, RefreshCw, Layers, Zap, Compass, Info, Check, X, Cpu, DoorOpen, DoorClosed, Award,
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
  const { siteData } = useSiteData();
  const catalogItems = siteData?.catalogItems || CATALOG_ITEMS;
  const hardwareTiers = siteData?.hardwareTiers || HARDWARE_TIERS;

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
  const [selectedTheme, setSelectedTheme] = useState('royal'); // royal, luxury, stealth

  // Store Entrance & Door Configuration State
  const [doorConfig, setDoorConfig] = useState({
    wall: 'right', // 'front', 'right', 'left', 'back'
    offsetRatio: 0.75, // 0.15 to 0.85
    width: 1.4, // meters
    style: 'wood', // 'wood', 'glass', 'auto-sliding'
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
  const [exportedBlueprintModal, setExportedBlueprintModal] = useState(null);
  const [isBlueprintZoomed, setIsBlueprintZoomed] = useState(false);
  const [selectedCatalogModalItem, setSelectedCatalogModalItem] = useState(null);
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
  const rawPayback = totalInvestmentCost / estimatedMonthlyNetProfit;
  const paybackMonths = Math.max(Math.round(rawPayback * 10) / 10, 1);

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
      ctx.fillText('🚪 ทางเข้า ⬆', entranceX + (entranceW / 2), roomOriginY + roomPxH + 36);
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
      ctx.fillText('🚪 ทางเข้า ⬇', entranceX + (entranceW / 2), roomOriginY - 22);
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
      ctx.fillText('🚪 ทางเข้า ➡', roomOriginX - 16, entranceY + (entranceW / 2) + 7);
      ctx.textAlign = 'left';
    } else {
      const entranceY = roomOriginY + (roomPxH * doorRatio) - (entranceW / 2);
      ctx.fillRect(roomOriginX + roomPxW - 6, entranceY, 14, entranceW);
      ctx.beginPath();
      ctx.arc(roomOriginX + roomPxW, entranceY, entranceW, Math.PI / 2, Math.PI);
      ctx.stroke();
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.fillText('🚪 ทางเข้า ⬅', roomOriginX + roomPxW + 16, entranceY + (entranceW / 2) + 7);
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
      ctx.fillText('เก้าอี้', chairCenterX, chairCenterY + 4);

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
          ctx.fillText(r === 0 ? 'ตู้แร็ค 42U: No-Disk' : 'ตู้แร็ค 42U: Switch/10G', rx + (rackW / 2), rackY + rackH + 18);
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
        ctx.fillText('สำรองไฟฉุกเฉิน 30 นาที', upsX + 60, upsY + 40);

        // Server Room 24hr Precision AC Unit
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(pxX + 20, pxY + 12, 160, 24);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pxX + 20, pxY + 12, 160, 24);
        ctx.fillStyle = '#0369a1';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.fillText('❄ แอร์เซิร์ฟเวอร์ 18,000 BTU 24ชม.', pxX + 100, pxY + 28);
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
          ctx.fillText(`POS จอสัมผัส #${p + 1}`, posX + 35, posY + 17);
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
    ctx.fillText('1. ข้อมูลโครงการและงานระบบอาคาร (PROJECT & MEP METADATA)', infoPanelX + 18, currentY + 30);
    currentY += 62;

    const metaRows = [
      ['ชื่อโครงการ (Project Name):', 'GLP : G SPEED LIVING PLUS OFFICIAL STORE'],
      ['ขนาดพื้นที่ร้านรวม (Total Venue):', `${roomWidth} x ${roomHeight} เมตร (${roomWidth * roomHeight} ตร.ม.)`],
      ['จำนวนสถานีคอมพิวเตอร์ (Capacity):', `${totalStations} เครื่อง (สัดส่วน 1 PC / 2.3 ตร.ม. ตามมาตรฐาน)`],
      ['จำนวนโมดูลเฟอร์นิเจอร์ทั้งหมด:', `${placedItems.length} โมดูลหลัก (รวมงานสั่งผลิตและระบบ)`],
      ['ทำเลที่ตั้งสาขา (Site Location):', storeLocation],
      ['ระบบไฟฟ้าและโหลดเมนรวม (MDB):', '3 Phase 380V / 100A พร้อมตู้ MDB แยกเบรกเกอร์ย่อย'],
      ['โครงข่ายอินเทอร์เน็ต (Internet):', 'Dual 10Gbps SFP+ Fiber Optic Active-Active Failover']
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
    ctx.fillText(`2. สเปกคอมพิวเตอร์และอุปกรณ์ครบชุด (PC SPECIFICATIONS - ${currentTierInfo.name.toUpperCase()})`, infoPanelX + 18, currentY + 30);
    currentY += 62;

    const pcSpecs = [
      ['หน่วยประมวลผล (Processor CPU):', currentTierInfo.cpu || 'Intel Core i7-14700F / AMD Ryzen 7 7800X3D (Liquid Cooler)'],
      ['การ์ดแสดงผล (Graphics Card GPU):', currentTierInfo.gpu || 'NVIDIA GeForce RTX 4070 SUPER 12GB GDDR6X Dual/Triple Fan'],
      ['หน่วยความจำหลัก (RAM System):', currentTierInfo.ram || '32GB DDR5 6000MHz Dual-Channel Low Latency RGB'],
      ['จอแสดงผลการแข่งขัน (Esports Monitor):', currentTierInfo.monitor || '27" Fast-IPS 280Hz - 360Hz QHD DyAc Ready (0.5ms Response)'],
      ['ชุดเกมมิ่งเกียร์ (Gaming Gear Set):', currentTierInfo.gear || 'Custom Coiled Keyboard (Hotswap) + Ultralight 4K/8K Hz Mouse + Headset 7.1'],
      ['เซิร์ฟเวอร์ดิสก์เลส (Diskless Boot Master):', '10G SFP+ Dual Master Server (Enterprise NVMe PCIe 4.0 Array + Auto Updater)'],
      ['ระบบพาวเวอร์ซัพพลาย (Power Supply PSU):', '750W - 850W 80+ Gold Fully Modular Active PFC รับประกัน 5 ปี'],
      ['การเชื่อมต่อระบบเครือข่าย (LAN Interface):', 'RJ-45 CAT6A Shielded 1000/2500 Mbps ต่อเครื่อง 1:1 เข้า Switch 10G']
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
    ctx.fillText('3. รายละเอียดสเปกโต๊ะและเก้าอี้ติดตั้ง (DESK & FURNITURE SCHEDULE)', infoPanelX + 18, currentY + 30);
    currentY += 62;

    const deskSpecs = [
      ['ขนาดโต๊ะต่อที่นั่ง (Station Dimensions):', 'กว้าง 1.20 x ลึก 0.80 x สูง 0.75 ม. (ระยะตามมาตรฐาน Pro Player)'],
      ['หน้าท็อปโต๊ะ (Desk Tabletop Material):', 'ไม้สังเคราะห์เกรด HPL หนา 25 มม. ทนรอยขีดข่วน/ความร้อน/น้ำ 100%'],
      ['การขึ้นรูปขอบโต๊ะ (Ergonomic Bevel Edge):', 'ลบมุมลาดเอียง 45 องศา ลดแรงกดทับข้อมือขณะเล่นเกมต่อเนื่อง'],
      ['โครงสร้างขาและคาน (Steel Frame Structure):', 'เหล็กกล้าคาร์บอน (Carbon Steel) หนา 1.5 มม. อบสีพาวเดอร์โค้ตกันสนิม'],
      ['ระบบท่อร้อยสายไฟ (Dual Wire Raceway):', 'รางเหล็กใต้โต๊ะแยกอิสระ 2 ช่อง: ช่องไฟ 220V และช่องสายสัญญาณ LAN'],
      ['เก้าอี้เกมมิ่งมืออาชีพ (Ergonomic Chair):', currentTierInfo.chair || 'G-Speed Pro Racing PU Leather / Ergonomic Mesh'],
      ['ระบบปรับระดับเก้าอี้ (Ergonomic Adjustability):', 'ที่พักแขน 4D ปรับได้ 4 ทิศทาง + เบาะปรับเอนนอน 160° + ปรับหนุนหลัง'],
      ['การรับประกันสินค้า (Warranty Coverage):', 'รับประกันโครงสร้างโต๊ะ 5 ปี และเก้าอี้เกมมิ่ง 3 ปี On-site Service']
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
    ctx.fillText('4. รายการโมดูลและจุดติดตั้งในผัง (EQUIPMENT SCHEDULE TABLE)', infoPanelX + 18, currentY + 30);
    currentY += 58;

    ctx.font = 'bold 15px "Inter", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('ลำดับ  ชื่อรายการโมดูล             พิกัด (X,Y)     ขนาดโมดูล        จำนวนสถานี / สเปก', infoPanelX + 18, currentY);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(infoPanelX + 18, currentY + 8); ctx.lineTo(infoPanelX + infoPanelW - 18, currentY + 8); ctx.stroke();
    currentY += 28;

    ctx.font = '14.5px "Inter", sans-serif';
    placedItems.slice(0, 8).forEach((it, idx) => {
      const name = (it.catalog?.name?.split('(')[0] || it.type).slice(0, 18);
      const coords = `(${it.x.toFixed(1)}, ${it.y.toFixed(1)})`;
      const size = `${it.catalog?.widthMeters || 1}x${it.catalog?.heightMeters || 1}m`;
      const seatInfo = it.catalog?.seats ? `${it.catalog.seats} PCs (โต๊ะ 1.20ม.)` : 'Facility จุดบริการ';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`#${idx + 1}    ${name.padEnd(20, ' ')} ${coords.padEnd(12, ' ')} ${size.padEnd(12, ' ')} ${seatInfo}`, infoPanelX + 18, currentY);
      currentY += 26;
    });

    if (placedItems.length > 8) {
      ctx.fillStyle = '#64748b';
      ctx.font = 'italic 14px "Inter", sans-serif';
      ctx.fillText(`... และยังมีอีก ${placedItems.length - 8} รายการในบัญชีรายการผลิตและการติดตั้ง`, infoPanelX + 18, currentY);
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
    ctx.fillText('ข้อกำหนดสำคัญสำหรับผู้รับเหมาและวิศวกรระบบ (GENERAL CONTRACTOR & MEP SPECIFICATIONS):', 110, notesY + 28);

    ctx.fillStyle = '#334155';
    ctx.font = '15px "Inter", sans-serif';
    ctx.fillText('1. ขนาดโต๊ะเกมมิ่งมาตรฐาน: กว้าง 1.20 ม. ลึก 0.80 ม. ต่อสถานี เว้นระยะทางเดินหลัก (Main Clearance) ไม่น้อยกว่า 1.20 - 1.50 ม. ตามกฎหมายอาคาร', 110, notesY + 50);
    ctx.fillText('2. จุดเต้ารับไฟฟ้า 220V 16A เต้ารับคู่ 3 ขา มีกราวด์ (Grounding <= 5 Ohm) ต่อเครื่อง 1:1 พร้อมรางร้อยสาย LAN CAT6A แยกท่อห่างสายเมน 30 ซม.', 110, notesY + 70);

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
              title="ขั้นตอนที่ 1: กำหนดขนาดห้องและแปลนอาคาร"
            >
              <span className={`step-num ${currentStep === 1 ? 'active' : ''}`}>1</span>
              <span className="step-txt">ขนาด {roomWidth}x{roomHeight}ม.</span>
              {currentStep === 1 && <span className="studio-active-dot"></span>}
            </button>
            <ChevronRight size={14} className="studio-step-sep" />
            <button 
              type="button" 
              id="btn-step-compact-2"
              className={`studio-step-pill ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`} 
              onClick={() => handleStepChange(2)}
              title="ขั้นตอนที่ 2: จัดผังร้าน 3D Studio & แปลน 2D"
            >
              <span className={`step-num ${currentStep === 2 ? 'active' : ''}`}>2</span>
              <span className="step-txt">จัดผัง 3D Studio</span>
              {currentStep === 2 && <span className="studio-active-dot"></span>}
            </button>
            <ChevronRight size={14} className="studio-step-sep" />
            <button 
              type="button" 
              id="btn-step-compact-3"
              className={`studio-step-pill ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`} 
              onClick={() => handleStepChange(3)}
              title="ขั้นตอนที่ 3: เลือกระดับสเปกฮาร์ดแวร์"
            >
              <span className={`step-num ${currentStep === 3 ? 'active' : ''}`}>3</span>
              <span className="step-txt">สเปกคอม</span>
              {currentStep === 3 && <span className="studio-active-dot"></span>}
            </button>
            <ChevronRight size={14} className="studio-step-sep" />
            <button 
              type="button" 
              id="btn-step-compact-4"
              className={`studio-step-pill ${currentStep === 4 ? 'active' : ''}`} 
              onClick={() => handleStepChange(4)}
              title="ขั้นตอนที่ 4: สรุปงบประมาณและผลตอบแทน ROI"
            >
              <span className={`step-num ${currentStep === 4 ? 'active' : ''}`}>4</span>
              <span className="step-txt">งบ & ROI</span>
              {currentStep === 4 && <span className="studio-active-dot"></span>}
            </button>
          </div>

          {/* Quick Metrics & CTA */}
          <div className="studio-compact-metrics">
            <div className="compact-metric-pill">
              <span className="metric-tag">{currentStep === 1 ? 'พื้นที่:' : 'ความจุ:'}</span>
              <strong className="text-blue">
                {currentStep === 1 ? `${roomAreaSqM} ตร.ม.` : `${totalStations} เครื่อง`}
              </strong>
            </div>
            <div className="compact-metric-pill hide-mobile">
              <span className="metric-tag">{currentStep === 4 ? 'คืนทุน:' : 'งบลงทุน:'}</span>
              <strong className="text-emerald">
                {currentStep === 4 ? `${paybackMonths} เดือน` : `฿${totalInvestmentCost.toLocaleString()}`}
              </strong>
            </div>
            <button 
              type="button" 
              id="btn-open-quote-summary-compact"
              onClick={() => setShowQuotationModal(true)} 
              className="btn-compact-quote"
            >
              <Download size={14} />
              <span>สรุปใบเสนอราคา</span>
            </button>
            {currentStep === 1 && (
              <button 
                type="button" 
                id="btn-next-step2-compact"
                onClick={() => handleStepChange(2)} 
                className="btn-compact-next"
              >
                <span>เริ่มจัดผัง 3D</span>
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
                <span>เลือกสเปก</span>
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
                <span>ดูงบ & ROI</span>
                <ArrowRight size={14} />
              </button>
            )}
            {currentStep === 4 && (
              <button 
                type="button" 
                id="btn-export-pdf-compact"
                onClick={() => window.print()} 
                className="btn-compact-next"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}
              >
                <Printer size={14} />
                <span>พิมพ์ใบเสนอราคา</span>
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
                <span>กำหนดขนาดห้องและแปลนอาคาร</span>
              </h3>
              <p className="setup-card-desc">
                เลือกโมเดลขนาดห้องสำเร็จรูป (Preset) เป็นค่าพื้นฐานเพื่อเริ่มคำนวณและวางผังได้ทันที หรือเลือกตัวเลือกเสริมอัปโหลดแปลนพิมพ์เขียวอาคารจริง
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
                  <span>เลือกโมเดลสำเร็จรูป / กำหนดเอง</span>
                  <span className="badge-preset-default">ค่าเริ่มต้น</span>
                </button>
                <button 
                  type="button"
                  id="tab-setup-blueprint"
                  className={`setup-mode-tab-btn ${setupMethod === 'blueprint' ? 'active' : ''}`}
                  onClick={() => setSetupMethod('blueprint')}
                >
                  <UploadCloud size={16} />
                  <span>อัปโหลดแปลนอาคาร & คำนวณผัง</span>
                  <span className="badge-optional-choice">ตัวเลือกเสริม AI</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                style={{ display: 'none' }} 
              />

              {/* TAB 1 (DEFAULT): PRESET MODELS & MANUAL SLIDERS */}
              {setupMethod === 'preset' && (
                <div className="preset-mode-content">
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

                  {/* Store Entrance Configuration Card */}
                  <div className="door-config-card">
                    <div className="door-config-header">
                      <div className="door-header-title">
                        <DoorOpen size={16} className="text-emerald" />
                        <div>
                          <strong>ตำแหน่งประตูทางเข้าร้าน (Store Entrance)</strong>
                          <p className="sub-desc">กำหนดผนังและปรับเลื่อนตำแหน่งประตูตามผังจริงของแต่ละร้าน</p>
                        </div>
                      </div>
                      <span className="door-wall-badge">
                        {doorConfig.wall === 'front' ? 'ด้านหน้า' :
                         doorConfig.wall === 'left' ? 'ผนังซ้าย' :
                         doorConfig.wall === 'back' ? 'ผนังหลัง' : 'ผนังขวา'}
                      </span>
                    </div>

                    <div className="wall-selector-grid">
                      <button 
                        type="button" 
                        className={`wall-btn ${doorConfig.wall === 'front' ? 'active' : ''}`}
                        onClick={() => setDoorConfig({ ...doorConfig, wall: 'front' })}
                      >
                        <ArrowDown size={14} /> ด้านหน้า (Front)
                      </button>
                      <button 
                        type="button" 
                        className={`wall-btn ${doorConfig.wall === 'right' ? 'active' : ''}`}
                        onClick={() => setDoorConfig({ ...doorConfig, wall: 'right' })}
                      >
                        <ArrowRight size={14} /> ผนังขวา (Right)
                      </button>
                      <button 
                        type="button" 
                        className={`wall-btn ${doorConfig.wall === 'left' ? 'active' : ''}`}
                        onClick={() => setDoorConfig({ ...doorConfig, wall: 'left' })}
                      >
                        <ArrowLeft size={14} /> ผนังซ้าย (Left)
                      </button>
                      <button 
                        type="button" 
                        className={`wall-btn ${doorConfig.wall === 'back' ? 'active' : ''}`}
                        onClick={() => setDoorConfig({ ...doorConfig, wall: 'back' })}
                      >
                        <ArrowUp size={14} /> ผนังหลัง (Back)
                      </button>
                    </div>

                    <div className="door-slider-box">
                      <div className="slider-header-mini">
                        <label>ตำแหน่งตามแนวผนัง:</label>
                        <span className="slider-val-mini text-emerald">{Math.round(doorConfig.offsetRatio * 100)}%</span>
                      </div>
                      <div className="door-offset-presets">
                        <button type="button" className="btn-preset-offset" onClick={() => setDoorConfig({ ...doorConfig, offsetRatio: 0.25 })}>
                          {doorConfig.wall === 'front' || doorConfig.wall === 'back' ? 'ซ้าย 25%' : 'หลัง 25%'}
                        </button>
                        <button type="button" className="btn-preset-offset" onClick={() => setDoorConfig({ ...doorConfig, offsetRatio: 0.50 })}>
                          ตรงกลาง 50%
                        </button>
                        <button type="button" className="btn-preset-offset" onClick={() => setDoorConfig({ ...doorConfig, offsetRatio: 0.75 })}>
                          {doorConfig.wall === 'front' || doorConfig.wall === 'back' ? 'ขวา 75%' : 'หน้า 75%'}
                        </button>
                      </div>
                      <input 
                        type="range"
                        min="0.15"
                        max="0.85"
                        step="0.05"
                        value={doorConfig.offsetRatio}
                        onChange={(e) => setDoorConfig({ ...doorConfig, offsetRatio: parseFloat(e.target.value) })}
                        className="custom-range"
                      />
                    </div>

                    <div className="door-style-mini-row">
                      <label>รูปแบบประตู:</label>
                      <div className="door-style-pills">
                        <button 
                          type="button"
                          className={`door-pill ${doorConfig.style === 'wood' ? 'active' : ''}`}
                          onClick={() => setDoorConfig({ ...doorConfig, style: 'wood' })}
                        >
                          <DoorClosed size={14} />
                          <span>บานไม้โมเดิร์น</span>
                        </button>
                        <button 
                          type="button"
                          className={`door-pill ${doorConfig.style === 'glass' ? 'active' : ''}`}
                          onClick={() => setDoorConfig({ ...doorConfig, style: 'glass' })}
                        >
                          <SplitSquareVertical size={14} />
                          <span>กระจกใสบานคู่</span>
                        </button>
                        <button 
                          type="button"
                          className={`door-pill ${doorConfig.style === 'auto-sliding' ? 'active' : ''}`}
                          onClick={() => setDoorConfig({ ...doorConfig, style: 'auto-sliding' })}
                        >
                          <Sliders size={14} />
                          <span>บานเลื่อนออโต้</span>
                        </button>
                      </div>
                    </div>

                    <div className="door-field-group" style={{ marginTop: '12px' }}>
                      <div className="slider-header-mini">
                        <label>ชื่อร้าน / ป้ายหน้าร้าน:</label>
                        <span className="slider-val-mini text-cyan">ป้าย 3D Real-time</span>
                      </div>
                      <input 
                        type="text"
                        value={doorConfig.storeName || 'GLP : G SPEED LIVING PLUS'}
                        onChange={(e) => setDoorConfig({ ...doorConfig, storeName: e.target.value })}
                        placeholder="เช่น GLP : G SPEED LIVING PLUS, สาขา พระราม 9..."
                        className="store-name-card-input"
                        maxLength={36}
                      />
                      <div className="store-name-presets" style={{ marginTop: '6px' }}>
                        {['GLP : G SPEED LIVING PLUS', 'G-SPEED LIVING PLUS', 'สาขา สยามสแควร์', 'GLP CYBER LOUNGE'].map((preset) => (
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

                    <div className="door-style-mini-row" style={{ marginTop: '10px' }}>
                      <label>รูปแบบป้าย & สติ๊กเกอร์:</label>
                      <div className="door-style-pills">
                        <button 
                          type="button" 
                          className={`door-pill ${doorConfig.signStyle === 'neon-lightbox' || !doorConfig.signStyle ? 'active' : ''}`}
                          onClick={() => setDoorConfig({ ...doorConfig, signStyle: 'neon-lightbox' })}
                        >
                          <Sparkles size={14} />
                          <span>นีออน LED</span>
                        </button>
                        <button 
                          type="button" 
                          className={`door-pill ${doorConfig.signStyle === 'acrylic-gold' ? 'active' : ''}`}
                          onClick={() => setDoorConfig({ ...doorConfig, signStyle: 'acrylic-gold' })}
                        >
                          <Award size={14} />
                          <span>อะคริลิกทอง</span>
                        </button>
                        <button 
                          type="button" 
                          className={`door-pill ${doorConfig.signStyle === 'minimal-dark' ? 'active' : ''}`}
                          onClick={() => setDoorConfig({ ...doorConfig, signStyle: 'minimal-dark' })}
                        >
                          <Zap size={14} />
                          <span>มินิมอลไซเบอร์</span>
                        </button>
                        <button 
                          type="button" 
                          className={`door-pill ${doorConfig.signStyle === 'grand-arch' ? 'active' : ''}`}
                          onClick={() => setDoorConfig({ ...doorConfig, signStyle: 'grand-arch' })}
                        >
                          <Building2 size={14} />
                          <span>ซุ้มแกรนด์</span>
                        </button>
                      </div>
                    </div>
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
                      <span>มีแบบแปลนพิมพ์เขียวอาคารจริงของคุณอยู่แล้ว?</span>
                    </span>
                    <button 
                      type="button"
                      className="btn-text-blue" 
                      style={{ fontWeight: 700, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => setSetupMethod('blueprint')}
                    >
                      <span>สลับไปอัปโหลดแปลน (ตัวเลือกเสริม)</span>
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
                        ลากไฟล์แปลนอาคารมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์ (ตัวเลือกเสริม)
                      </div>
                      <p className="blueprint-dropzone-sub">
                        รองรับไฟล์ภาพแบบแปลนพิมพ์เขียว, ภาพวาดผังร้าน, สเก็ตช์ 2D, ไฟล์สแกน (PNG, JPG, WEBP)
                      </p>
                      <div className="blueprint-dropzone-actions" onClick={e => e.stopPropagation()}>
                        <button 
                          type="button"
                          className="btn-primary"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <UploadCloud size={15} />
                          <span>เลือกไฟล์แปลนจากเครื่อง</span>
                        </button>
                        <button 
                          type="button"
                          className="btn-secondary"
                          onClick={handleUseSampleBlueprint}
                        >
                          <Sparkles size={15} />
                          <span>ทดลองใช้แปลนตัวอย่างอาคารพาณิชย์</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* If Analyzing */}
                  {isAnalyzingBlueprint && (
                    <div className="blueprint-analyzing-spinner">
                      <RefreshCw size={24} className="spin-icon text-cyan" />
                      <span>AI กำลังสแกนแปลนอาคาร วัดสเกลพื้นที่ และคำนวณการจัดสรรโซนร้านเกม...</span>
                    </div>
                  )}

                  {/* Blueprint Loaded & Calculated View */}
                  {uploadedBlueprint && !isAnalyzingBlueprint && (
                    <div className="blueprint-loaded-view">
                      {/* Thumbnail & File Details */}
                      <div className="blueprint-image-box" style={{ marginBottom: '16px' }}>
                        <div className="blueprint-image-tag">
                          <CheckCircle2 size={15} className="text-emerald" />
                          <span>แนบแปลนสำเร็จ: <strong>{uploadedBlueprint.name}</strong> ({uploadedBlueprint.size})</span>
                        </div>
                        <div className="blueprint-img-frame" style={{ height: '180px' }}>
                          <img src={uploadedBlueprint.url} alt="Floor Plan Blueprint Preview" />
                        </div>
                        <div className="blueprint-image-actions">
                          <button type="button" className="btn-text-danger" onClick={handleRemoveBlueprint}>
                            <Trash2 size={13} /> ลบแปลนนี้
                          </button>
                          <button type="button" className="btn-text-blue" onClick={() => fileInputRef.current?.click()}>
                            <RotateCw size={13} /> เปลี่ยนไฟล์ใหม่
                          </button>
                        </div>
                      </div>

                      {/* Dimension Calibration Sliders */}
                      <div className="dimension-sliders" style={{ marginBottom: '16px' }}>
                        <div className="slider-group">
                          <div className="slider-header">
                            <label>ความกว้างอาคารจริง (Width):</label>
                            <span className="slider-val text-cyan">{roomWidth} เมตร</span>
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
                            <label>ความลึก/ความยาวอาคารจริง (Length):</label>
                            <span className="slider-val text-cyan">{roomHeight} เมตร</span>
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
                          <span>พื้นที่ใช้สอยรวม: <strong>{roomAreaSqM} ตารางเมตร</strong></span>
                          <span>(สเกลมาตราส่วน: <strong>1:{Math.round(pixelsPerMeter)}</strong>)</span>
                        </div>

                        {/* Store Entrance Configuration Card (Blueprint Mode) */}
                        <div className="door-config-card" style={{ marginTop: '12px' }}>
                          <div className="door-config-header">
                            <div className="door-header-title">
                              <DoorOpen size={16} className="text-emerald" />
                              <div>
                                <strong>ตำแหน่งประตูทางเข้าร้าน (Store Entrance)</strong>
                                <p className="sub-desc">กำหนดผนังและปรับเลื่อนตำแหน่งประตูตามผังจริงของแต่ละร้าน</p>
                              </div>
                            </div>
                            <span className="door-wall-badge">
                              {doorConfig.wall === 'front' ? 'ด้านหน้า' :
                               doorConfig.wall === 'left' ? 'ผนังซ้าย' :
                               doorConfig.wall === 'back' ? 'ผนังหลัง' : 'ผนังขวา'}
                            </span>
                          </div>

                          <div className="wall-selector-grid">
                            <button 
                              type="button" 
                              className={`wall-btn ${doorConfig.wall === 'front' ? 'active' : ''}`}
                              onClick={() => setDoorConfig({ ...doorConfig, wall: 'front' })}
                            >
                              <ArrowDown size={14} /> ด้านหน้า (Front)
                            </button>
                            <button 
                              type="button" 
                              className={`wall-btn ${doorConfig.wall === 'right' ? 'active' : ''}`}
                              onClick={() => setDoorConfig({ ...doorConfig, wall: 'right' })}
                            >
                              <ArrowRight size={14} /> ผนังขวา (Right)
                            </button>
                            <button 
                              type="button" 
                              className={`wall-btn ${doorConfig.wall === 'left' ? 'active' : ''}`}
                              onClick={() => setDoorConfig({ ...doorConfig, wall: 'left' })}
                            >
                              <ArrowLeft size={14} /> ผนังซ้าย (Left)
                            </button>
                            <button 
                              type="button" 
                              className={`wall-btn ${doorConfig.wall === 'back' ? 'active' : ''}`}
                              onClick={() => setDoorConfig({ ...doorConfig, wall: 'back' })}
                            >
                              <ArrowUp size={14} /> ผนังหลัง (Back)
                            </button>
                          </div>

                          <div className="door-slider-box">
                            <div className="slider-header-mini">
                              <label>ตำแหน่งตามแนวผนัง:</label>
                              <span className="slider-val-mini text-emerald">{Math.round(doorConfig.offsetRatio * 100)}%</span>
                            </div>
                            <div className="door-offset-presets">
                              <button type="button" className="btn-preset-offset" onClick={() => setDoorConfig({ ...doorConfig, offsetRatio: 0.25 })}>
                                {doorConfig.wall === 'front' || doorConfig.wall === 'back' ? 'ซ้าย 25%' : 'หลัง 25%'}
                              </button>
                              <button type="button" className="btn-preset-offset" onClick={() => setDoorConfig({ ...doorConfig, offsetRatio: 0.50 })}>
                                ตรงกลาง 50%
                              </button>
                              <button type="button" className="btn-preset-offset" onClick={() => setDoorConfig({ ...doorConfig, offsetRatio: 0.75 })}>
                                {doorConfig.wall === 'front' || doorConfig.wall === 'back' ? 'ขวา 75%' : 'หน้า 75%'}
                              </button>
                            </div>
                            <input 
                              type="range"
                              min="0.15"
                              max="0.85"
                              step="0.05"
                              value={doorConfig.offsetRatio}
                              onChange={(e) => setDoorConfig({ ...doorConfig, offsetRatio: parseFloat(e.target.value) })}
                              className="custom-range"
                            />
                          </div>

                          <div className="door-style-mini-row">
                            <label>รูปแบบประตู:</label>
                            <div className="door-style-pills">
                              <button 
                                type="button"
                                className={`door-pill ${doorConfig.style === 'wood' ? 'active' : ''}`}
                                onClick={() => setDoorConfig({ ...doorConfig, style: 'wood' })}
                              >
                                <DoorClosed size={14} />
                                <span>บานไม้โมเดิร์น</span>
                              </button>
                              <button 
                                type="button"
                                className={`door-pill ${doorConfig.style === 'glass' ? 'active' : ''}`}
                                onClick={() => setDoorConfig({ ...doorConfig, style: 'glass' })}
                              >
                                <SplitSquareVertical size={14} />
                                <span>กระจกใสบานคู่</span>
                              </button>
                              <button 
                                type="button"
                                className={`door-pill ${doorConfig.style === 'auto-sliding' ? 'active' : ''}`}
                                onClick={() => setDoorConfig({ ...doorConfig, style: 'auto-sliding' })}
                              >
                                <Sliders size={14} />
                                <span>บานเลื่อนออโต้</span>
                              </button>
                            </div>
                          </div>

                          <div className="door-field-group" style={{ marginTop: '12px' }}>
                            <div className="slider-header-mini">
                              <label>ชื่อร้าน / ป้ายหน้าร้าน:</label>
                              <span className="slider-val-mini text-cyan">ป้าย 3D Real-time</span>
                            </div>
                            <input 
                              type="text"
                              value={doorConfig.storeName || 'GLP : G SPEED LIVING PLUS'}
                              onChange={(e) => setDoorConfig({ ...doorConfig, storeName: e.target.value })}
                              placeholder="เช่น GLP : G SPEED LIVING PLUS, สาขา พระราม 9..."
                              className="store-name-card-input"
                              maxLength={36}
                            />
                            <div className="store-name-presets" style={{ marginTop: '6px' }}>
                              {['GLP : G SPEED LIVING PLUS', 'G-SPEED LIVING PLUS', 'สาขา สยามสแควร์', 'GLP CYBER LOUNGE'].map((preset) => (
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

                          <div className="door-style-mini-row" style={{ marginTop: '10px' }}>
                            <label>รูปแบบป้าย & สติ๊กเกอร์:</label>
                            <div className="door-style-pills">
                              <button 
                                type="button" 
                                className={`door-pill ${doorConfig.signStyle === 'neon-lightbox' || !doorConfig.signStyle ? 'active' : ''}`}
                                onClick={() => setDoorConfig({ ...doorConfig, signStyle: 'neon-lightbox' })}
                              >
                                <Sparkles size={14} />
                                <span>นีออน LED</span>
                              </button>
                              <button 
                                type="button" 
                                className={`door-pill ${doorConfig.signStyle === 'acrylic-gold' ? 'active' : ''}`}
                                onClick={() => setDoorConfig({ ...doorConfig, signStyle: 'acrylic-gold' })}
                              >
                                <Award size={14} />
                                <span>อะคริลิกทอง</span>
                              </button>
                              <button 
                                type="button" 
                                className={`door-pill ${doorConfig.signStyle === 'minimal-dark' ? 'active' : ''}`}
                                onClick={() => setDoorConfig({ ...doorConfig, signStyle: 'minimal-dark' })}
                              >
                                <Zap size={14} />
                                <span>มินิมอลไซเบอร์</span>
                              </button>
                              <button 
                                type="button" 
                                className={`door-pill ${doorConfig.signStyle === 'grand-arch' ? 'active' : ''}`}
                                onClick={() => setDoorConfig({ ...doorConfig, signStyle: 'grand-arch' })}
                              >
                                <Building2 size={14} />
                                <span>ซุ้มแกรนด์</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Feasibility Stats Grid */}
                      <div className="blueprint-calc-summary" style={{ marginBottom: '16px' }}>
                        <div className="calc-stat-box">
                          <span className="lbl">ความจุเครื่องที่แนะนำ:</span>
                          <strong className="val text-cyan">{blueprintFeasibility.recommendedStations} เครื่อง</strong>
                        </div>
                        <div className="calc-stat-box">
                          <span className="lbl">งบลงทุนประมาณการ:</span>
                          <strong className="val text-blue">฿{blueprintFeasibility.estimatedCapex.toLocaleString()}</strong>
                        </div>
                        <div className="calc-stat-box">
                          <span className="lbl">กำไรสุทธิคาดการณ์:</span>
                          <strong className="val text-emerald">฿{blueprintFeasibility.estimatedMonthlyProfit.toLocaleString()} / ด.</strong>
                        </div>
                        <div className="calc-stat-box">
                          <span className="lbl">จุดคุ้มทุน (ROI):</span>
                          <strong className="val text-purple">~{blueprintFeasibility.paybackMonths} เดือน</strong>
                        </div>
                      </div>

                      {/* Zone Allocation Pills */}
                      <div style={{ marginBottom: '14px' }}>
                        <label className="form-label" style={{ marginBottom: '8px' }}>การจัดสรรสัดส่วนโซนที่คำนวณได้:</label>
                        <div className="zones-breakdown-grid">
                          {blueprintFeasibility.detectedZones.map((zone, idx) => (
                            <div key={idx} className="zone-pill-item">
                              <div className="zone-color-bar" style={{ backgroundColor: zone.color }}></div>
                              <div className="zone-info">
                                <strong>{zone.name}</strong>
                                <div className="zone-meta">
                                  <span>{zone.area}</span>
                                  <span className="bullet">•</span>
                                  <span className="zone-capacity text-cyan">{zone.stations}</span>
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
                          <span>คำแนะนำเชิงกลยุทธ์การจัดวางผังร้าน (Smart Layout Advice)</span>
                        </div>
                        <div className="guidelines-grid">
                          <div className="guideline-card">
                            <div className="guideline-icon amber">
                              <DoorOpen size={16} />
                            </div>
                            <div className="guideline-content">
                              <h5>1. ทางเข้า & เคาน์เตอร์แคชเชียร์</h5>
                              <p>ตั้งขนานประตูทางเข้า คุมทัศนวิสัย 180 องศา ต้อนรับลูกค้าทันทีและดูแลความปลอดภัย</p>
                            </div>
                          </div>

                          <div className="guideline-card">
                            <div className="guideline-icon blue">
                              <Monitor size={16} />
                            </div>
                            <div className="guideline-content">
                              <h5>2. แนวโต๊ะคอม (Island Back-to-Back)</h5>
                              <p>วางเกาะกลางหันหลังชนกัน ซ่อนรางสายไฟและท่อแอร์ลงกลางโต๊ะ ประหยัดสายแลน 40% เว้นทางเดิน 1.5 ม.</p>
                            </div>
                          </div>

                          <div className="guideline-card">
                            <div className="guideline-icon purple">
                              <Shield size={16} />
                            </div>
                            <div className="guideline-content">
                              <h5>3. ห้องซ้อม VIP Bootcamp Suite</h5>
                              <p>กั้นห้องกระจกเก็บเสียงโซนด้านในสุด ลดเสียงรบกวน เหมาะกับการฝึกซ้อมทีมและสตรีมเมอร์</p>
                            </div>
                          </div>

                          <div className="guideline-card">
                            <div className="guideline-icon emerald">
                              <Server size={16} />
                            </div>
                            <div className="guideline-content">
                              <h5>4. ห้องเซิร์ฟเวอร์ & ตู้ไฟ MDB</h5>
                              <p>วางชิดผนังมุมหลังร้าน แยกห้องล็อก ปลอดภัย ติดตั้งระบบ UPS สำรองไฟและแอร์เฉพาะตัว 24 ชม.</p>
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
                          <span>จัดวางผังร้านและโต๊ะคอมลงบนแปลนนี้ให้อัตโนมัติ</span>
                          <ArrowRight size={18} />
                        </button>
                        <button 
                          type="button"
                          className="btn-auto-layout-secondary"
                          onClick={() => setCurrentStep(2)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Ruler size={15} />
                          <span>นำแปลนไปจัดวางด้วยตนเอง</span>
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
                      <span>ต้องการใช้ขนาดห้องและโมเดลสำเร็จรูปมาตรฐาน?</span>
                    </span>
                    <button 
                      type="button"
                      className="btn-text-blue" 
                      style={{ fontWeight: 700, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => setSetupMethod('preset')}
                    >
                      <span>สลับไปใช้โมเดลสำเร็จรูป (ค่าเริ่มต้น)</span>
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
                  <span>ใช้แปลนอาคาร: <strong>{uploadedBlueprint.name}</strong> ({roomWidth}x{roomHeight} ม. | {roomAreaSqM} ตร.ม.)</span>
                </div>
              ) : (
                <div className="blueprint-source-badge">
                  <LayoutGrid size={16} />
                  <span>ขนาดพื้นที่จำลอง: <strong>{roomWidth}x{roomHeight} เมตร ({roomAreaSqM} ตร.ม.)</strong></span>
                </div>
              )}

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
                  onClick={() => handleStepChange(2)} 
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
                  <span className="view-mode-txt-full">3D Isometric Studio (สไตล์ Homestyler)</span>
                  <span className="view-mode-txt-short">3D Studio</span>
                </button>
                <button 
                  id="btn-view-mode-2d"
                  className={`btn-mode-switch ${viewMode === '2d' ? 'active' : ''}`}
                  onClick={() => setViewMode('2d')}
                >
                  <LayoutGrid size={16} />
                  <span className="view-mode-txt-full">2D Blueprint (แปลน 2 มิติ)</span>
                  <span className="view-mode-txt-short">2D แปลน</span>
                </button>
                <button 
                  type="button"
                  id="btn-step2-auto-layout"
                  className="btn-toolbar-auto-layout"
                  onClick={handleApplyAutoLayout}
                  title="คำนวณและจัดวางโต๊ะคอมพิวเตอร์และเฟอร์นิเจอร์ใหม่อัตโนมัติ (AI Auto-Layout)"
                >
                  <Sparkles size={14} />
                  <span>จัดผังอัตโนมัติ</span>
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
            {/* Mobile Tab Switcher Bar - Shows directly under 3D canvas on Mobile/Tablet */}
            <div className="mobile-planner-tabs-bar">
              <button 
                type="button" 
                id="btn-mobile-tab-catalog"
                className={`mobile-planner-tab-btn ${mobileStudioTab === 'catalog' ? 'active' : ''}`}
                onClick={() => setMobileStudioTab('catalog')}
              >
                <Layers size={16} />
                <span>เพิ่มอุปกรณ์ ({catalogItems.length})</span>
              </button>
              <button 
                type="button" 
                id="btn-mobile-tab-inspector"
                className={`mobile-planner-tab-btn ${mobileStudioTab === 'inspector' ? 'active' : ''}`}
                onClick={() => setMobileStudioTab('inspector')}
              >
                <Sliders size={16} />
                <span>ปรับแต่ง & สรุปงบ ({placedItems.length})</span>
              </button>
            </div>

            {/* Left: Item Catalog Sidebar */}
            <div className={`catalog-sidebar glass-panel ${mobileStudioTab === 'catalog' ? 'mobile-active' : 'mobile-hidden'}`}>
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
                    <div 
                      key={item.type} 
                      className="catalog-item-card"
                      onClick={() => setSelectedCatalogModalItem(item)}
                      title="คลิกเพื่อดูสเปกเต็มและภาพสินค้า"
                    >
                      {/* Product Thumbnail Banner with Color Swatches */}
                      <div className="catalog-thumb-banner">
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80'} 
                          alt={item.name} 
                          className="catalog-thumb-img"
                          loading="lazy"
                        />
                        <div className="catalog-thumb-hover-overlay">
                          <Eye size={13} />
                          <span>ดูสเปกเต็ม</span>
                        </div>
                        
                        {/* Mini Color Swatches overlay */}
                        <div className="catalog-card-swatches" title="โทนสีวัสดุและไฟ">
                          <span className="swatch-mini" style={{ backgroundColor: item.deskColor || '#0f172a' }} title="สีท็อปโต๊ะ" />
                          <span className="swatch-mini" style={{ backgroundColor: item.accentColor || '#1d4ed8' }} title="สีไฟตกแต่ง" />
                          {item.chairColor && (
                            <span className="swatch-mini" style={{ backgroundColor: item.chairColor || '#0f172a' }} title="สีเก้าอี้" />
                          )}
                        </div>

                        {/* Capacity / Type Pill */}
                        {item.seats > 0 && (
                          <span className="catalog-thumb-seat-badge">
                            {item.seats} PCs
                          </span>
                        )}
                      </div>

                      <div className="catalog-item-top">
                        <div className="catalog-item-info">
                          <strong className="item-name">{item.name}</strong>
                          <span className="item-dim">
                            ขนาด 3D: {item.widthMeters} x {item.depth3D || item.heightMeters} ม. (สูง {item.height3D || 1.2}ม.)
                          </span>
                        </div>
                        <button 
                          type="button"
                          id={`btn-add-item-${item.type}`}
                          className="btn-add-catalog"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddItem(item);
                          }}
                          title="เพิ่มลงในผัง 3D ทันที"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      {/* Price Breakdown Micro-Badge */}
                      <div className="catalog-item-pricing-preview">
                        <div className="price-tag-row">
                          <span className="price-tag-badge">
                            รวม ฿{item.baseCost.toLocaleString()}
                          </span>
                          <span className="catalog-click-spec-hint">
                            <Info size={11} /> ดูสเปก
                          </span>
                        </div>
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
                  doorConfig={doorConfig}
                  onChangeDoorConfig={setDoorConfig}
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
                      onClick={() => setZoomMultiplier(z => Math.max(Number((z - 0.15).toFixed(2)), 0.5))} 
                      title="ซูมย่อแปลน (-)"
                    >
                      <ZoomOut size={15} />
                    </button>
                    <button 
                      type="button"
                      className="floorplan-zoom-indicator-btn" 
                      onClick={() => setZoomMultiplier(1.0)} 
                      title="คลิกเพื่อรีเซ็ต 100%"
                    >
                      {Math.round(zoomMultiplier * 100)}%
                    </button>
                    <button 
                      type="button" 
                      className="btn-floorplan-ctrl" 
                      onClick={() => setZoomMultiplier(z => Math.min(Number((z + 0.15).toFixed(2)), 2.5))} 
                      title="ซูมขยายแปลน (+)"
                    >
                      <ZoomIn size={15} />
                    </button>
                    <div className="floorplan-ctrl-divider" />
                    <button 
                      type="button" 
                      className="btn-floorplan-ctrl btn-fit-screen" 
                      onClick={() => setZoomMultiplier(1.0)} 
                      title="รีเซ็ตพอดีหน้าจอ (Fit to Screen 100%)"
                    >
                      <Maximize2 size={13} />
                      <span className="btn-fit-text">100% พอดีจอ</span>
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
                    <div className="canvas-scale-marker top-marker">⟵ {roomWidth}.0 ม. ⟶</div>
                    <div className="canvas-scale-marker left-marker">⟵ {roomHeight}.0 ม. ⟶</div>

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
                          doorConfig?.wall === 'right' ? '◀ ทางเข้า' :
                          doorConfig?.wall === 'front' ? '▲ ทางเข้า' :
                          doorConfig?.wall === 'back' ? '▼ ทางเข้า' :
                          'ทางเข้า ▶'
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
                                ? 'โซฟาเลานจ์'
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

                            <div className="item-drag-handle" title="คลิกเลือก หรือลากเพื่อย้ายตำแหน่ง">
                              <Move size={11} />
                              {isSelected && <span className="drag-handle-pill">เลือกอยู่</span>}
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
              </div>
            </div>

            {/* Right: Selected Item Inspector & Cost Breakdown Panel */}
            <div className={`inspector-sidebar glass-panel ${mobileStudioTab === 'inspector' ? 'mobile-active' : 'mobile-hidden'}`}>
              {/* Selected Item Detail Inspector */}
              {selectedItemObject ? (
                <div className="selected-item-inspector-expanded">
                  <div className="insp-head">
                    <span className="badge-pill badge-blue">
                      <Box size={13} />
                      <span>โมดูลที่เลือก</span>
                    </span>
                    <h4>{selectedItemObject.catalog?.name}</h4>

                    {/* Small preview image under name */}
                    {selectedItemObject.catalog?.image && (
                      <div 
                        className="insp-thumb-banner"
                        onClick={() => setSelectedCatalogModalItem(selectedItemObject.catalog)}
                        title="คลิกเพื่อดูสเปกเต็มและภาพสินค้าขยาย"
                      >
                        <img 
                          src={selectedItemObject.catalog.image} 
                          alt={selectedItemObject.catalog.name} 
                          className="insp-thumb-img"
                          loading="lazy"
                        />
                        <div className="insp-thumb-overlay">
                          <Eye size={13} />
                          <span>คลิกดูภาพขยาย & สเปกเต็ม</span>
                        </div>
                        {selectedItemObject.catalog.seats > 0 && (
                          <span className="insp-thumb-seat-badge">
                            {selectedItemObject.catalog.seats} PCs
                          </span>
                        )}
                        <span className="insp-thumb-dim-badge">
                          {selectedItemObject.catalog.widthMeters} x {selectedItemObject.catalog.depth3D || selectedItemObject.catalog.heightMeters} ม.
                        </span>
                      </div>
                    )}
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
                            {selectedItemObject.catalog?.chairCount} ตัว <span className="unit-price">(฿{selectedItemObject.catalog?.chairPrice?.toLocaleString()}/ตัว)</span>
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
                      <span>ตำแหน่ง & ทิศทางในห้อง</span>
                    </div>
                    <div className="coords-info">
                      <span><strong>X:</strong> {selectedItemObject.x.toFixed(1)} ม.</span>
                      <span><strong>Y:</strong> {selectedItemObject.y.toFixed(1)} ม.</span>
                      <span><strong>มุม:</strong> {selectedItemObject.rotation}°</span>
                    </div>

                    {/* Unified Quick Actions */}
                    <div className="spatial-actions-row">
                      <button 
                        type="button"
                        id="btn-sidebar-rotate-item"
                        className="btn-spatial-action btn-rotate"
                        onClick={() => handleRotateItem(selectedItemObject.id)}
                        title="หมุน 90 องศา (กด R)"
                      >
                        <RotateCw size={13} />
                        <span>หมุน 90°</span>
                      </button>
                      <button 
                        type="button"
                        id="btn-sidebar-duplicate-item"
                        className="btn-spatial-action btn-duplicate"
                        onClick={() => handleDuplicateItem(selectedItemObject.id)}
                        title="คัดลอกโมดูลนี้ (Duplicate)"
                      >
                        <Copy size={13} />
                        <span>คัดลอก</span>
                      </button>
                      <button 
                        type="button"
                        id="btn-sidebar-delete-item"
                        className="btn-spatial-action btn-delete"
                        onClick={() => handleDeleteItem(selectedItemObject.id)}
                        title="ลบโมดูลนี้ออกจากผัง (กด Delete)"
                      >
                        <Trash2 size={13} />
                        <span>ลบออก</span>
                      </button>
                    </div>

                    <div className="spatial-keyboard-hint">
                      <Compass size={12} className="text-blue" />
                      <span>คลิกลากย้ายอิสระ หรือกดปุ่มลูกศร <strong>[↑][↓][←][→]</strong> บนคีย์บอร์ด</span>
                    </div>
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
                  
                  {/* Current Active Materials & Entrance Badge */}
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
                    <div className="mat-summary-row">
                      <span className="mat-key">ประตูทางเข้า:</span>
                      <strong className="mat-val text-emerald">
                        {doorConfig.wall === 'front' ? 'ด้านหน้า (Front)' :
                         doorConfig.wall === 'left' ? 'ผนังซ้าย (Left)' :
                         doorConfig.wall === 'back' ? 'ผนังหลัง (Back)' : 'ผนังขวา (Right)'} ({Math.round(doorConfig.offsetRatio * 100)}%)
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

              {/* Step Navigation in Right Sidebar - Placed prominently on the right */}
              <div className="inspector-step-actions">
                <button 
                  id="btn-step2-to-step3-sidebar"
                  onClick={() => handleStepChange(3)} 
                  className="btn-primary full-width"
                  style={{ padding: '13px 16px', fontSize: '0.96rem', fontWeight: 700 }}
                >
                  <span>เลือกสเปกคอมพิวเตอร์ ({totalStations} เครื่อง)</span>
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => handleStepChange(1)} 
                  className="btn-secondary full-width"
                  style={{ marginTop: '6px' }}
                >
                  ย้อนกลับไปตั้งขนาด
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Step Navigation Bar - Placed cleanly at the bottom */}
          <div className="planner-bottom-nav-bar glass-panel">
            <div className="bottom-nav-left-info">
              <Info size={16} className="text-blue" style={{ flexShrink: 0 }} />
              <span className="bottom-nav-info-text">
                <strong>สรุปผัง:</strong> {roomWidth}x{roomHeight} ม. ({roomAreaSqM} ตร.ม.) • วาง <strong>{totalStations} เครื่อง</strong> • งบประมาณ <strong>฿{totalInvestmentCost.toLocaleString()}</strong>
              </span>
            </div>
            <div className="bottom-nav-right-actions">
              <button onClick={() => handleStepChange(1)} className="btn-secondary">
                <span className="hide-mobile">ย้อนกลับไปตั้งขนาด</span>
                <span className="show-mobile">ย้อนกลับ</span>
              </button>
              <button 
                id="btn-step2-to-step3"
                onClick={() => handleStepChange(3)} 
                className="btn-primary"
              >
                <span className="hide-mobile">เลือกสเปกคอมพิวเตอร์ ({totalStations} เครื่อง)</span>
                <span className="show-mobile">เลือกสเปก ({totalStations} เครื่อง)</span>
                <ArrowRight size={16} />
              </button>
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
              <button onClick={() => handleStepChange(2)} className="btn-secondary">
                ย้อนกลับไปจัดผังร้าน
              </button>
              <button 
                id="btn-step3-to-step4"
                onClick={() => handleStepChange(4)} 
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
            <button onClick={() => handleStepChange(2)} className="btn-secondary">
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
                <h3 className="modal-title">ใบเสนอราคาประเมินเบื้องต้น: แฟรนไชส์ GLP : G Speed Living Plus</h3>
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
                <p>ทีมวิศวกรและผู้เชี่ยวชาญแฟรนไชส์ของ GLP : G Speed Living Plus จะตรวจสอบผังที่คุณออกแบบ และติดต่อกลับเพื่อเสนอนัดสำรวจสถานที่จริงภายใน 24 ชม.</p>
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
                      <div className="brand-title">GLP : G SPEED LIVING PLUS</div>
                      <div className="brand-sub">บริษัท จี-สปีด ลิฟวิ่ง พลัส จำกัด (สำนักงานใหญ่)</div>
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
                      {selectedCatalogModalItem.category === 'stations' ? 'โต๊ะคอมพิวเตอร์เกมมิ่ง' : (selectedCatalogModalItem.category === 'vip' ? 'ห้องซ้อม VIP Suite' : (selectedCatalogModalItem.category === 'facilities' ? 'โซนบริการและแคชเชียร์' : 'เวทีและสิ่งอำนวยความสะดวก'))}
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
                title="ปิดหน้าต่าง"
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
                    <span>ภาพสินค้าจริงจากโรงงานผลิต G-Speed</span>
                  </div>
                </div>

                {/* Color Palette & Material Tones Card */}
                <div className="catalog-modal-colors-card">
                  <h5 className="modal-section-h5">
                    <Palette size={15} className="text-cyan" />
                    <span>โทนสีและวัสดุตกแต่งจริง (Color & Finish)</span>
                  </h5>
                  <div className="color-swatches-grid">
                    <div className="color-swatch-item">
                      <span className="color-swatch-box" style={{ backgroundColor: selectedCatalogModalItem.deskColor || '#0f172a' }} />
                      <div className="color-swatch-text">
                        <span className="swatch-lbl">สีท็อป & ขาโต๊ะ</span>
                        <strong className="swatch-val">{selectedCatalogModalItem.deskColor === '#0f172a' ? 'Black Obsidian (ดำด้าน)' : (selectedCatalogModalItem.deskColor === '#1e293b' ? 'Dark Slate Gray' : selectedCatalogModalItem.deskColor)}</strong>
                      </div>
                    </div>
                    <div className="color-swatch-item">
                      <span className="color-swatch-box" style={{ backgroundColor: selectedCatalogModalItem.accentColor || '#1d4ed8' }} />
                      <div className="color-swatch-text">
                        <span className="swatch-lbl">สีไฟนีออน / ขอบตกแต่ง</span>
                        <strong className="swatch-val">{selectedCatalogModalItem.accentColor === '#1d4ed8' ? 'Esport Blue (น้ำเงิน)' : (selectedCatalogModalItem.accentColor === '#38bdf8' ? 'Cyber Cyan (ฟ้าสว่าง)' : (selectedCatalogModalItem.accentColor === '#8b5cf6' ? 'Aura Purple (ม่วง)' : selectedCatalogModalItem.accentColor))}</strong>
                      </div>
                    </div>
                    {selectedCatalogModalItem.chairColor && (
                      <div className="color-swatch-item">
                        <span className="color-swatch-box" style={{ backgroundColor: selectedCatalogModalItem.chairColor || '#0f172a' }} />
                        <div className="color-swatch-text">
                          <span className="swatch-lbl">สีหนังเก้าอี้เกมมิ่ง</span>
                          <strong className="swatch-val">Racing Black (หนัง PU ดำเดินด้ายคู่)</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dimension Metric Quick Pills */}
                <div className="catalog-modal-dimensions-card">
                  <div className="dimension-metric-item">
                    <span className="dim-lbl">ความกว้าง (Width)</span>
                    <strong className="dim-val text-cyan">{selectedCatalogModalItem.widthMeters} เมตร</strong>
                  </div>
                  <div className="dimension-metric-item">
                    <span className="dim-lbl">ความลึก (Depth)</span>
                    <strong className="dim-val text-cyan">{selectedCatalogModalItem.depth3D || selectedCatalogModalItem.heightMeters} เมตร</strong>
                  </div>
                  <div className="dimension-metric-item">
                    <span className="dim-lbl">ความสูง (Height)</span>
                    <strong className="dim-val text-cyan">{selectedCatalogModalItem.height3D || 1.25} เมตร</strong>
                  </div>
                  <div className="dimension-metric-item">
                    <span className="dim-lbl">จำนวนที่นั่งในเซ็ต</span>
                    <strong className="dim-val text-emerald">{selectedCatalogModalItem.seats > 0 ? `${selectedCatalogModalItem.seats} ที่นั่ง (โต๊ะ 1.20ม.)` : 'จุดบริการ'}</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Technical Specifications */}
              <div className="catalog-modal-right-col">
                {/* Price Breakdown Banner */}
                <div className="catalog-modal-pricing-box">
                  <div className="pricing-box-left">
                    <span className="pricing-title">ราคารวมเซ็ตพร้อมติดตั้ง:</span>
                    <div className="pricing-main-amount">
                      <span className="currency">฿</span>
                      <span className="amount">{selectedCatalogModalItem.baseCost?.toLocaleString()}</span>
                      <span className="vat-note">(รวมภาษีและค่าติดตั้ง)</span>
                    </div>
                  </div>
                  <div className="pricing-box-right">
                    <div className="pricing-mini-item">
                      <span>โต๊ะสั่งผลิต:</span>
                      <strong>฿{selectedCatalogModalItem.deskPrice?.toLocaleString()}</strong>
                    </div>
                    {selectedCatalogModalItem.chairCount > 0 && (
                      <div className="pricing-mini-item">
                        <span>เก้าอี้เกมมิ่ง ({selectedCatalogModalItem.chairCount} ตัว):</span>
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
                      <h4>1. สเปกวัสดุและโครงสร้างทางวิศวกรรม (Material & Construction)</h4>
                    </div>
                    <p className="spec-card-body-text">{selectedCatalogModalItem.material}</p>
                    <ul className="spec-bullets-list">
                      <li><strong>หน้าท็อปโต๊ะ:</strong> ไม้สังเคราะห์ HPL (High Pressure Laminate) ความหนา 25 มม. เกรดทนความร้อน กันน้ำ 100% และกันรอยขูดขีด</li>
                      <li><strong>ขอบโต๊ะ Ergonomic:</strong> เจียรลบมุมลาดเอียง 45 องศา (Bevel Edge) ตามหลักสรีรศาสตร์ รองรับข้อมือผู้เล่นเกมได้สบายตลอดวัน</li>
                      <li><strong>โครงขาและคานรับแรง:</strong> เหล็กกล้าคาร์บอน (Carbon Steel Box) หนา 1.5 - 2.0 มม. พ่นสีพาวเดอร์โค้ตกันสนิม รองรับน้ำหนักได้มากกว่า 250 กก.</li>
                    </ul>
                  </div>

                  {/* 2. Furniture & Chairs Included */}
                  {selectedCatalogModalItem.chairCount > 0 && (
                    <div className="modal-spec-card">
                      <div className="spec-card-header">
                        <Armchair size={16} style={{ color: '#0284c7' }} />
                        <h4>2. สเปกเก้าอี้เกมมิ่งและอุปกรณ์ที่มาในเซ็ต (Included Furniture)</h4>
                      </div>
                      <div className="chair-spec-info-box">
                        <strong>รุ่นเก้าอี้: {selectedCatalogModalItem.chairModel}</strong>
                        <span className="chair-count-badge">จำนวน {selectedCatalogModalItem.chairCount} ตัว ประจำสถานี</span>
                      </div>
                      <ul className="spec-bullets-list">
                        <li><strong>เบาะรองนั่ง:</strong> โฟมขึ้นรูปเย็นความหนาแน่นสูง (High-Density Cold-Cure Foam) ไม่ยุบตัว รับประกันการใช้งานต่อเนื่อง</li>
                        <li><strong>ฟังก์ชันการปรับระดับ:</strong> ปรับเอนหลังได้ 160 องศา พร้อมระบบล็อกมัลติฟังก์ชัน + ที่พักแขน 3D/4D ปรับระดับความสูงและองศาได้</li>
                        <li><strong>ระบบรองรับน้ำหนัก:</strong> โช้กแก๊ส Class 4 ผ่านการทดสอบความปลอดภัยระดับสากล BIFMA รองรับน้ำหนักสูงสุด 150 กก./ตัว</li>
                      </ul>
                    </div>
                  )}

                  {/* 3. Electrical & Data Raceway */}
                  <div className="modal-spec-card">
                    <div className="spec-card-header">
                      <Zap size={16} className="text-amber" />
                      <h4>3. ระบบท่อร้อยสายไฟและโครงข่ายเน็ตเวิร์ก (Electrical & LAN Raceway)</h4>
                    </div>
                    <ul className="spec-bullets-list">
                      <li><strong>รางร้อยสายไฟใต้โต๊ะ (Dual Cable Raceway):</strong> รางเหล็กซ่อนสายไฟ 2 ช่องอิสระ แยกท่อไฟฟ้ากำลัง 220V และสายแลน LAN ป้องกันสัญญาณรบกวน (Zero Interference)</li>
                      <li><strong>จุดเต้ารับไฟฟ้าต่อสถานี:</strong> เต้ารับคู่ 3 ขา มีกราวด์ (Universal Socket 220V 16A) พร้อมเบรกเกอร์กันไฟกระชาก (Surge Protection) 1:1</li>
                      <li><strong>การเชื่อมต่อเน็ตเวิร์ก:</strong> เต้ารับ LAN RJ-45 CAT6A Shielded ความเร็ว 10Gbps Ready พร้อมท่อร้อยสายเชื่อมตรงสู่ตู้ Rack เซิร์ฟเวอร์</li>
                    </ul>
                  </div>

                  {/* 4. Warranty & Production Lead Time */}
                  <div className="modal-spec-card highlight-warranty">
                    <div className="spec-card-header">
                      <CheckCircle2 size={16} className="text-emerald" />
                      <h4>4. การรับประกันและระยะเวลาผลิต (Warranty & Delivery)</h4>
                    </div>
                    <div className="warranty-grid">
                      <div className="warranty-item">
                        <span className="w-lbl">การรับประกัน:</span>
                        <strong className="w-val text-emerald">{selectedCatalogModalItem.warranty}</strong>
                      </div>
                      <div className="warranty-item">
                        <span className="w-lbl">ระยะเวลาสั่งผลิต:</span>
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
                <span className="footer-summary-lbl">โมเดลนี้ประกอบด้วย:</span>
                <strong>{selectedCatalogModalItem.seats > 0 ? `โต๊ะมาตรฐาน ${selectedCatalogModalItem.widthMeters}ม. + เก้าอี้ ${selectedCatalogModalItem.chairCount} ตัว + รางสายไฟครบชุด` : selectedCatalogModalItem.desc}</strong>
              </div>
              <div className="modal-footer-btns">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setSelectedCatalogModalItem(null)}
                >
                  ปิดหน้าต่าง
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
                  <span>เพิ่มลงในผัง 3D (Add to Plan)</span>
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
                  <h3 className="bp-modal-title">แบบแปลนสถาปัตยกรรม & งานระบบ (PNG)</h3>
                  <span className="bp-modal-subtitle">{exportedBlueprintModal.filename}</span>
                </div>
              </div>
              <button 
                type="button"
                className="bp-modal-close" 
                onClick={() => setExportedBlueprintModal(null)}
                title="ปิดหน้าต่าง"
              >
                <X size={18} />
              </button>
            </div>

            <div 
              className="bp-modal-body" 
              onClick={() => setIsBlueprintZoomed(prev => !prev)}
              title={isBlueprintZoomed ? 'คลิกเพื่อย่อมุมมองปกติ' : 'คลิกเพื่อขยายดูตัวอักษรและรายละเอียดขนาดใหญ่ (100% Zoom)'}
            >
              <div className="bp-floating-zoom-badge">
                <span>{isBlueprintZoomed ? '🔍 กำลังซูม 100% (คลิกเพื่อย่อภาพรวม)' : '🔍 คลิกภาพเพื่อซูมดูตัวหนังสือและอุปกรณ์ 100%'}</span>
              </div>
              <img 
                src={exportedBlueprintModal.dataUrl} 
                alt="Architectural Blueprint Preview" 
                className={`bp-preview-img ${isBlueprintZoomed ? 'is-zoomed' : ''}`}
              />
            </div>

            <div className="bp-modal-footer">
              <div className="bp-modal-tip">
                <span>💡 <strong>คำแนะนำ:</strong> {isBlueprintZoomed ? 'คลิกที่ภาพเพื่อย่อมุมมองปกติ | เลื่อนลูกกลิ้งเมาส์เพื่อดูส่วนต่างๆ' : 'คลิกที่ภาพ หรือกดปุ่ม "ขยายดูอุปกรณ์ 100%" เพื่ออ่านตัวหนังสือชัดเจน'}</span>
              </div>
              <div className="bp-modal-btns">
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
                  <ZoomIn size={16} />
                  <span>{isBlueprintZoomed ? 'ย่อมุมมองรวม' : '🔍 ขยายดูอุปกรณ์ 100%'}</span>
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
                  <Eye size={16} />
                  <span>เปิดภาพในแท็บใหม่</span>
                </button>
                <button 
                  type="button"
                  className="btn-primary" 
                  onClick={() => downloadFile(exportedBlueprintModal.dataUrl, exportedBlueprintModal.filename, 'image/png')}
                >
                  <Download size={16} />
                  <span>บันทึกไฟล์ (Save PNG)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
