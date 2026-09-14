import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Eye, Compass, RotateCw, Copy, Trash2, Maximize2, Minimize2,
  Layers, Sun, RefreshCw, ZoomIn, ZoomOut, Check, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Move, Camera, Download, DoorOpen,
  DoorClosed, SplitSquareVertical, Sliders, Award, Zap, Building2, X,
  Sparkles, Footprints
} from 'lucide-react';
import { downloadFile } from '../utils/fileDownloader';

export default function Room3DStudio({
  roomWidth = 12,
  roomHeight = 10,
  placedItems = [],
  selectedItemId = null,
  onSelectItem = () => {},
  selectedWallpaper = 'white-clean',
  selectedFloorMaterial = 'wood-parquet',
  blueprintUrl = null,
  blueprintOpacity = 0.5,
  onRotateItem = () => {},
  onDuplicateItem = () => {},
  onDeleteItem = () => {},
  onUpdateItemPosition = () => {},
  onNudgeItem = () => {},
  isPlannerFullscreen = false,
  onToggleFullscreen = () => {},
  doorConfig = { wall: 'right', offsetRatio: 0.75, width: 1.4, style: 'wood' },
  onChangeDoorConfig = () => {}
}) {
  const [isDoorPopoverOpen, setIsDoorPopoverOpen] = useState(false);
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const itemMeshesMapRef = useRef(new Map());
  const selectedHighlightRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Procedural Canvas Texture Generator for Realistic Floors
  const createFloorTexture = useCallback((materialId) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (materialId === 'wood-parquet') {
      // Warm Amber/Chestnut Wood Herringbone Parquet (Photorealistic Homestyler Style)
      ctx.fillStyle = '#6b3713';
      ctx.fillRect(0, 0, 1024, 1024);

      const plankWidth = 48;
      const plankLength = 144;
      const shades = ['#592e0f', '#6b3713', '#7a3f16', '#87481a', '#542b0d', '#723a14'];

      for (let y = 0; y < 1024; y += plankLength) {
        for (let x = 0; x < 1024; x += plankWidth * 2) {
          const shade = shades[Math.floor(Math.random() * shades.length)];
          ctx.fillStyle = shade;
          ctx.fillRect(x, y, plankWidth, plankLength);
          
          // Wood grain streaks
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x + 12, y); ctx.lineTo(x + 12, y + plankLength);
          ctx.moveTo(x + 36, y); ctx.lineTo(x + 36, y + plankLength);
          ctx.stroke();

          // Bevel border
          ctx.strokeStyle = 'rgba(15, 8, 4, 0.55)';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(x, y, plankWidth, plankLength);

          const shade2 = shades[Math.floor(Math.random() * shades.length)];
          ctx.fillStyle = shade2;
          ctx.fillRect(x + plankWidth, y + (plankLength / 2), plankWidth, plankLength);
          ctx.strokeStyle = 'rgba(15, 8, 4, 0.55)';
          ctx.strokeRect(x + plankWidth, y + (plankLength / 2), plankWidth, plankLength);
        }
      }
    } else if (materialId === 'white-marble') {
      // Luxury Polished Marble Tile
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 1024, 1024);

      // Tile grid lines
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.lineWidth = 3;
      for (let i = 0; i <= 1024; i += 256) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, 1024); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
      }

      // Marble subtle veining
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.22)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(100, 0); ctx.bezierCurveTo(400, 300, 600, 700, 900, 1024); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(600, 0); ctx.bezierCurveTo(750, 400, 400, 800, 200, 1024); ctx.stroke();
    } else if (materialId === 'dark-carpet') {
      // Acoustic Charcoal Carpet
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 1024, 1024);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < 1024; i += 8) {
        ctx.fillRect(i, 0, 4, 1024);
        ctx.fillRect(0, i, 1024, 4);
      }
    } else {
      // Esports Seamless Grey Epoxy
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, 1024, 1024);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let i = 0; i < 1024; i += 16) {
        ctx.fillRect(i, 0, 1, 1024);
        ctx.fillRect(0, i, 1024, 1);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(roomWidth / 2.5, roomHeight / 2.5);
    return texture;
  }, [roomWidth, roomHeight]);

  // Procedural Glowing Gaming Screen Wallpaper Texture
  const createScreenTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 288; // 16:9 ratio
    const ctx = canvas.getContext('2d');

    // Gradient dark sci-fi background
    const grad = ctx.createLinearGradient(0, 0, 512, 288);
    grad.addColorStop(0, '#030712');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 288);

    // Neon battle lines
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, 220);
    ctx.lineTo(180, 90);
    ctx.lineTo(320, 140);
    ctx.lineTo(480, 40);
    ctx.stroke();

    // Ambient glow polygon
    ctx.fillStyle = 'rgba(37, 99, 235, 0.28)';
    ctx.beginPath();
    ctx.moveTo(30, 220);
    ctx.lineTo(180, 90);
    ctx.lineTo(320, 140);
    ctx.lineTo(480, 40);
    ctx.lineTo(480, 250);
    ctx.lineTo(30, 250);
    ctx.closePath();
    ctx.fill();

    // Screen Title
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('GLP PRO ARENA', 30, 60);

    // Health / Status Bars
    ctx.fillStyle = '#10b981';
    ctx.fillRect(30, 75, 120, 8);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(160, 75, 70, 8);

    // Pro Circuit Specs
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('RTX 4080 • 360Hz • 0.5ms', 30, 250);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  // Procedural Wallpaper Texture
  const getWallpaperColor = useCallback((wpId) => {
    switch (wpId) {
      case 'royal-blue': return 0x1e3a8a;
      case 'dark-hex': return 0x1e293b;
      case 'loft-concrete': return 0x94a3b8;
      case 'white-clean':
      default: return 0xf1f5f9;
    }
  }, []);

  // Procedural Canvas Texture for Entrance Floor Mat
  const createEntranceMatTexture = useCallback((storeName) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const displayName = (storeName || 'GLP : G SPEED LIVING PLUS').toUpperCase();

    // High-tech dark mat texture
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle carbon weave pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    for (let x = 0; x < 1024; x += 16) {
      for (let y = 0; y < 512; y += 16) {
        if ((x + y) % 32 === 0) {
          ctx.fillRect(x, y, 16, 16);
        }
      }
    }

    // Glowing dual border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#059669'; // Emerald border
    ctx.strokeRect(16, 16, 1024 - 32, 512 - 32);

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#34d399'; // Bright mint green
    ctx.strokeRect(32, 32, 1024 - 64, 512 - 64);

    // Center header badge
    ctx.fillStyle = '#10b981';
    ctx.fillRect(150, 48, 1024 - 300, 52);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px "Inter", "Prompt", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayName, 512, 74);

    // Thai & English Entrance Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px "Inter", "Prompt", sans-serif';
    ctx.fillText('ทางเข้าร้าน', 512, 205);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 40px "Inter", sans-serif';
    ctx.fillText('MAIN ENTRANCE', 512, 280);

    // Directional Arrows on Mat pointing towards room (+Z local)
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 88px "Inter", sans-serif';
    ctx.fillText('▲   ▲   ▲', 512, 405);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Procedural Canvas Texture for 3D Overhead Entrance Sign (Supports Neon Lightbox, Acrylic Gold, and Minimal Cyber)
  const createEntranceSignTexture = useCallback((storeName, signStyle) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const displayName = (storeName || 'GLP : G SPEED LIVING PLUS').trim();

    if (signStyle === 'acrylic-gold') {
      // Luxury Gold & Obsidian Acrylic Lightbox
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, 1024, 256);

      // Gold Trim
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#f59e0b';
      ctx.strokeRect(10, 10, 1024 - 20, 256 - 20);

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(20, 20, 1024 - 40, 12);

      // Store Name
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 52px "Inter", "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayName, 512, 115);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 26px "Inter", "Prompt", sans-serif';
      ctx.fillText('VIP GAMING LOUNGE & ESPORT CLUB', 512, 185);
    } else if (signStyle === 'minimal-dark') {
      // Minimal High-Tech Cyber Matte Slate Lightbox
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 1024, 256);

      // Cyan Accent Bar
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(20, 20, 1024 - 40, 6);

      // Store Name
      ctx.fillStyle = '#f8fafc';
      ctx.font = '900 48px "Inter", "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayName, 512, 118);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px "Inter", sans-serif';
      ctx.fillText('ESPORT STADIUM & GAMING HUB', 512, 185);
    } else {
      // Default: Emerald & Mint Green LED Lightbox
      ctx.fillStyle = '#0a1512';
      ctx.fillRect(0, 0, 1024, 256);

      // Glowing Outer Border
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#10b981';
      ctx.strokeRect(10, 10, 1024 - 20, 256 - 20);

      // LED Top Glow Strip
      ctx.fillStyle = '#059669';
      ctx.fillRect(20, 20, 1024 - 40, 14);

      // Store Name in prominent typography
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px "Inter", "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayName, 512, 115);

      // Subtitle
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 28px "Inter", "Prompt", sans-serif';
      ctx.fillText('ทางเข้าร้าน | MAIN ENTRANCE', 512, 188);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Procedural Canvas Texture for Storefront Glass Door Sticker Decal (Frosted White Esport Decal)
  const createGlassDecalTexture = useCallback((storeName) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, 512, 512);

    const displayName = (storeName || 'GLP').toUpperCase();

    // Frosted/White Esport Shield Silhouette
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(256, 80);
    ctx.lineTo(340, 125);
    ctx.lineTo(325, 245);
    ctx.lineTo(256, 300);
    ctx.lineTo(187, 245);
    ctx.lineTo(172, 125);
    ctx.closePath();
    ctx.stroke();

    // Vector lightning icon inside shield
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.moveTo(265, 140);
    ctx.lineTo(240, 185);
    ctx.lineTo(260, 185);
    ctx.lineTo(245, 235);
    ctx.lineTo(275, 175);
    ctx.lineTo(255, 175);
    ctx.closePath();
    ctx.fill();

    // Store Name Decal (Frosted White)
    ctx.font = 'bold 30px "Inter", "Prompt", sans-serif';
    ctx.fillText(displayName, 256, 340);

    // Subtitle / Opening hours
    ctx.font = '600 18px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('OPEN 24 HOURS • ESPORT ARENA', 256, 380);

    // Green accent line
    ctx.fillStyle = '#10b981';
    ctx.fillRect(156, 400, 200, 4);

    // "PULL / ดึง"
    ctx.font = 'bold 22px "Inter", "Prompt", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText('ดึง • PULL', 256, 435);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 580;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    // Camera (Perspective Isometric angle, centered with clearance for bottom floating bars)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    const maxDim = Math.max(roomWidth, roomHeight);
    camera.position.set(maxDim * 1.38, maxDim * 1.56, maxDim * 1.56);
    cameraRef.current = camera;

    // Renderer with preserveDrawingBuffer enabled for crisp snapshot export
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true, 
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit Controls - target centered on floor plane with forward bias to lift room away from bottom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Can view right at storefront eye level
    controls.minDistance = 1.2; // Close inspection of decals and components
    controls.maxDistance = 150; // Pro interior software zoom-out range (2.5x further)
    controls.target.set(0, -0.22, 0.65);
    controlsRef.current = controls;

    // Lights - Warm Interior Atmosphere & Ceiling Track Spotlights (Homestyler style)
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.75); // warm bounce
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.35);
    sunLight.position.set(maxDim * 1.2, maxDim * 1.9, maxDim * 0.9);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = maxDim * 4;
    sunLight.shadow.bias = -0.0004;
    const shadowSize = maxDim * 1.2;
    sunLight.shadow.camera.left = -shadowSize;
    sunLight.shadow.camera.right = shadowSize;
    sunLight.shadow.camera.top = shadowSize;
    sunLight.shadow.camera.bottom = -shadowSize;
    scene.add(sunLight);

    const softFillLight = new THREE.DirectionalLight(0xdbeafe, 0.45);
    softFillLight.position.set(-maxDim, maxDim, -maxDim);
    scene.add(softFillLight);

    // Ceiling Interior Track Lights (Spotlights casting pools of warm light onto tables)
    const spot1 = new THREE.SpotLight(0xfffbeb, 4.0);
    spot1.position.set(-roomWidth * 0.2, 5.2, -roomHeight * 0.15);
    spot1.angle = 0.65;
    spot1.penumbra = 0.8;
    spot1.decay = 1.2;
    spot1.distance = 18;
    scene.add(spot1);

    const spot2 = new THREE.SpotLight(0x60a5fa, 3.2);
    spot2.position.set(roomWidth * 0.25, 5.0, roomHeight * 0.15);
    spot2.angle = 0.6;
    spot2.penumbra = 0.85;
    spot2.decay = 1.4;
    spot2.distance = 16;
    scene.add(spot2);

    // Selected Highlight Ring
    const ringGeo = new THREE.RingGeometry(0.8, 0.95, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x1d4ed8, side: THREE.DoubleSide });
    const highlightMesh = new THREE.Mesh(ringGeo, ringMat);
    highlightMesh.position.y = 0.04;
    highlightMesh.visible = false;
    scene.add(highlightMesh);
    selectedHighlightRef.current = highlightMesh;

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler with ResizeObserver for ultra-smooth fullscreen responsiveness
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    let resizeObserver;
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
    };
  }, [roomWidth, roomHeight]);

  // Rebuild Room Architecture (Floor, Walls, Cutaway, Door, Window)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing room structure
    const existingRoom = scene.getObjectByName('room_architecture');
    if (existingRoom) scene.remove(existingRoom);

    const roomGroup = new THREE.Group();
    roomGroup.name = 'room_architecture';

    const wallHeight = 2.8;
    const wallThick = 0.22;
    const floorY = 0;

    // 1. FLOOR
    const floorTex = createFloorTexture(selectedFloorMaterial);
    const floorGeo = new THREE.BoxGeometry(roomWidth, 0.15, roomHeight);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: selectedFloorMaterial === 'white-marble' ? 0.2 : 0.55,
      metalness: selectedFloorMaterial === 'white-marble' ? 0.15 : 0.05
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -0.075, 0);
    floorMesh.receiveShadow = true;
    roomGroup.add(floorMesh);

    // Architectural Blueprint Floor Overlay (if user uploaded a custom floor plan)
    if (blueprintUrl && blueprintOpacity > 0) {
      const bpLoader = new THREE.TextureLoader();
      bpLoader.load(blueprintUrl, (bpTex) => {
        bpTex.colorSpace = THREE.SRGBColorSpace;
        const bpGeo = new THREE.PlaneGeometry(roomWidth * 0.98, roomHeight * 0.98);
        bpGeo.rotateX(-Math.PI / 2);
        const bpMat = new THREE.MeshBasicMaterial({
          map: bpTex,
          transparent: true,
          opacity: blueprintOpacity,
          depthWrite: false
        });
        const bpMesh = new THREE.Mesh(bpGeo, bpMat);
        bpMesh.position.set(0, 0.008, 0);
        bpMesh.name = 'blueprint_overlay_mesh';
        roomGroup.add(bpMesh);
      });
    }

    // Floor Base Slab Border
    const baseGeo = new THREE.BoxGeometry(roomWidth + 0.6, 0.2, roomHeight + 0.6);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -0.2, 0);
    baseMesh.receiveShadow = true;
    roomGroup.add(baseMesh);

    // Exterior Ground Pavement Plaza (Professional architectural surround when zooming out)
    const plazaCanvas = document.createElement('canvas');
    plazaCanvas.width = 512;
    plazaCanvas.height = 512;
    const pCtx = plazaCanvas.getContext('2d');
    pCtx.fillStyle = '#f1f5f9'; // Clean concrete sidewalk tone
    pCtx.fillRect(0, 0, 512, 512);
    // Grid pavers / sidewalk joint lines
    pCtx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    pCtx.lineWidth = 3;
    for (let i = 0; i <= 512; i += 64) {
      pCtx.beginPath();
      pCtx.moveTo(i, 0); pCtx.lineTo(i, 512); pCtx.stroke();
      pCtx.beginPath();
      pCtx.moveTo(0, i); pCtx.lineTo(512, i); pCtx.stroke();
    }
    const plazaTex = new THREE.CanvasTexture(plazaCanvas);
    plazaTex.wrapS = THREE.RepeatWrapping;
    plazaTex.wrapT = THREE.RepeatWrapping;
    plazaTex.repeat.set(24, 24);

    const plazaGeo = new THREE.PlaneGeometry(80, 80);
    plazaGeo.rotateX(-Math.PI / 2);
    const plazaMat = new THREE.MeshStandardMaterial({
      map: plazaTex,
      roughness: 0.95,
      metalness: 0.05
    });
    const plazaMesh = new THREE.Mesh(plazaGeo, plazaMat);
    plazaMesh.position.set(0, -0.21, 0);
    plazaMesh.receiveShadow = true;
    roomGroup.add(plazaMesh);

    // Skirting Baseboard along floor borders
    const skirtingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const backSkirting = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, 0.12, 0.04), skirtingMat);
    backSkirting.position.set(0, 0.06, -roomHeight / 2 + 0.13);
    roomGroup.add(backSkirting);

    // Wall Material
    const wallColor = getWallpaperColor(selectedWallpaper);
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.7,
      metalness: 0.05
    });

    const exteriorWallMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9
    });

    // ==========================================
    // ENTRANCE DOOR & DIRECTIONAL ARROW SETUP
    // ==========================================
    const activeWall = doorConfig?.wall || 'right';
    const doorW = Math.max(1.0, Math.min(2.4, doorConfig?.width || 1.4));
    const doorRatio = Math.max(0.15, Math.min(0.85, doorConfig?.offsetRatio ?? 0.75));
    const doorStyle = doorConfig?.style || 'wood';
    const doorHeight = 2.2;
    const lintelHeight = wallHeight - doorHeight; // 0.6m

    // Materials for Door, Frame, and Entrance Accents
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.2 });
    const doorWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.55, metalness: 0.05 });
    const doorGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.92,
      opacity: 0.4,
      transparent: true,
      roughness: 0.08,
      ior: 1.52
    });
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.15 });
    const ledThresholdMat = new THREE.MeshBasicMaterial({ color: 0x10b981 }); // Emerald glow

    // Entrance textures
    const entranceMatTex = createEntranceMatTexture(doorConfig?.storeName);
    const entranceSignTex = createEntranceSignTexture(doorConfig?.storeName, doorConfig?.signStyle);
    const glassDecalTex = createGlassDecalTexture(doorConfig?.storeName);

    // Helper: Build Complete Door Assembly in Local Space (+Z = Inward into Arena)
    const buildDoorAssembly = (posX, posZ, rotY) => {
      const assembly = new THREE.Group();
      assembly.position.set(posX, 0, posZ);
      assembly.rotation.y = rotY;

      // 1. Door Frame Jambs and Header
      const jambThick = 0.08;
      const jambDepth = wallThick + 0.04;

      const leftJamb = new THREE.Mesh(new THREE.BoxGeometry(jambThick, doorHeight, jambDepth), doorFrameMat);
      leftJamb.position.set(-doorW / 2 + jambThick / 2, doorHeight / 2, 0);
      assembly.add(leftJamb);

      const rightJamb = new THREE.Mesh(new THREE.BoxGeometry(jambThick, doorHeight, jambDepth), doorFrameMat);
      rightJamb.position.set(doorW / 2 - jambThick / 2, doorHeight / 2, 0);
      assembly.add(rightJamb);

      const topJamb = new THREE.Mesh(new THREE.BoxGeometry(doorW, jambThick, jambDepth), doorFrameMat);
      topJamb.position.set(0, doorHeight - jambThick / 2, 0);
      assembly.add(topJamb);

      // Glowing Threshold Strip on Floor
      const thresholdMesh = new THREE.Mesh(new THREE.BoxGeometry(doorW, 0.02, jambDepth + 0.04), ledThresholdMat);
      thresholdMesh.position.set(0, 0.01, 0);
      assembly.add(thresholdMesh);

      // 2. Door Panels (Leaves)
      if (doorStyle === 'wood') {
        // Single Wood Door open slightly inward (32 deg)
        const leafW = doorW - (jambThick * 2);
        const leafH = doorHeight - jambThick;
        const woodLeaf = new THREE.Mesh(new THREE.BoxGeometry(leafW, leafH, 0.06), doorWoodMat);
        woodLeaf.castShadow = true;

        const hingeGroup = new THREE.Group();
        hingeGroup.position.set(-doorW / 2 + jambThick, 0, 0);
        woodLeaf.position.set(leafW / 2, leafH / 2, 0);
        hingeGroup.add(woodLeaf);

        // Stainless steel pull handle
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.12), handleMat);
        handle.position.set(leafW - 0.12, leafH * 0.48, 0);
        hingeGroup.add(handle);

        hingeGroup.rotation.y = 0.55; // Open inward
        assembly.add(hingeGroup);
      } else if (doorStyle === 'glass') {
        // Frameless Glass Double Door
        const halfLeafW = (doorW - (jambThick * 2) - 0.04) / 2;
        const leafH = doorHeight - jambThick;

        // Shared Glass Door Sticker Decal Material
        const decalW = Math.min(halfLeafW * 0.85, 0.42);
        const decalH = 0.42;
        const decalGeo = new THREE.PlaneGeometry(decalW, decalH);
        const decalMat = new THREE.MeshBasicMaterial({
          map: glassDecalTex,
          transparent: true,
          opacity: 0.92,
          depthWrite: false,
          side: THREE.DoubleSide
        });

        // Left Leaf
        const leftHinge = new THREE.Group();
        leftHinge.position.set(-doorW / 2 + jambThick, 0, 0);
        const leftLeaf = new THREE.Mesh(new THREE.BoxGeometry(halfLeafW, leafH, 0.035), doorGlassMat);
        leftLeaf.position.set(halfLeafW / 2, leafH / 2, 0);
        leftHinge.add(leftLeaf);
        const leftHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.65, 12), handleMat);
        leftHandle.position.set(halfLeafW - 0.08, leafH * 0.48, 0.04);
        leftHinge.add(leftHandle);

        // Store Logo / Name Decal Sticker on Left Leaf
        const leftDecal = new THREE.Mesh(decalGeo, decalMat);
        leftDecal.position.set(halfLeafW / 2, leafH * 0.55, 0.02);
        leftHinge.add(leftDecal);

        leftHinge.rotation.y = 0.45;
        assembly.add(leftHinge);

        // Right Leaf
        const rightHinge = new THREE.Group();
        rightHinge.position.set(doorW / 2 - jambThick, 0, 0);
        const rightLeaf = new THREE.Mesh(new THREE.BoxGeometry(halfLeafW, leafH, 0.035), doorGlassMat);
        rightLeaf.position.set(-halfLeafW / 2, leafH / 2, 0);
        rightHinge.add(rightLeaf);
        const rightHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.65, 12), handleMat);
        rightHandle.position.set(-halfLeafW + 0.08, leafH * 0.48, 0.04);
        rightHinge.add(rightHandle);

        // Store Logo / Name Decal Sticker on Right Leaf
        const rightDecal = new THREE.Mesh(decalGeo, decalMat);
        rightDecal.position.set(-halfLeafW / 2, leafH * 0.55, 0.02);
        rightHinge.add(rightDecal);

        rightHinge.rotation.y = -0.45;
        assembly.add(rightHinge);
      } else {
        // Automatic Sliding Glass Door
        const halfLeafW = (doorW - (jambThick * 2)) / 2;
        const leafH = doorHeight - jambThick;

        const sensorBox = new THREE.Mesh(new THREE.BoxGeometry(doorW + 0.2, 0.12, 0.14), doorFrameMat);
        sensorBox.position.set(0, doorHeight + 0.06, 0);
        assembly.add(sensorBox);

        const sensorLed = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.15), ledThresholdMat);
        sensorLed.position.set(0, doorHeight + 0.06, 0);
        assembly.add(sensorLed);

        // Shared Glass Sticker Decal
        const decalW = Math.min(halfLeafW * 0.85, 0.42);
        const decalH = 0.42;
        const decalGeo = new THREE.PlaneGeometry(decalW, decalH);
        const decalMat = new THREE.MeshBasicMaterial({
          map: glassDecalTex,
          transparent: true,
          opacity: 0.92,
          depthWrite: false,
          side: THREE.DoubleSide
        });

        const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(halfLeafW, leafH, 0.03), doorGlassMat);
        leftPanel.position.set(-halfLeafW * 0.75, leafH / 2, 0.02);
        const leftDecal = new THREE.Mesh(decalGeo, decalMat);
        leftDecal.position.set(0, 0.05, 0.02);
        leftPanel.add(leftDecal);
        assembly.add(leftPanel);

        const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(halfLeafW, leafH, 0.03), doorGlassMat);
        rightPanel.position.set(halfLeafW * 0.75, leafH / 2, -0.02);
        const rightDecal = new THREE.Mesh(decalGeo, decalMat);
        rightDecal.position.set(0, 0.05, 0.02);
        rightPanel.add(rightDecal);
        assembly.add(rightPanel);
      }

      // 3. Overhead 3D Entrance Lightbox Sign (Hanging above door at Y = 2.55m)
      const signW = Math.min(doorW + 0.6, 2.6);
      const signH = 0.50;
      const signGeo = new THREE.BoxGeometry(signW, signH, 0.12);
      const signMesh = new THREE.Mesh(signGeo, [
        doorFrameMat, doorFrameMat, doorFrameMat, doorFrameMat,
        new THREE.MeshBasicMaterial({ map: entranceSignTex }),
        new THREE.MeshBasicMaterial({ map: entranceSignTex })
      ]);
      signMesh.position.set(0, 2.55, 0);
      assembly.add(signMesh);

      // Neon LED Edge Lighting glow strips above and below the signboard
      const neonColor = doorConfig?.signStyle === 'acrylic-gold' ? 0xf59e0b :
                        doorConfig?.signStyle === 'minimal-dark' ? 0x06b6d4 : 0x10b981;
      const neonMat = new THREE.MeshBasicMaterial({ color: neonColor });
      const neonGeo = new THREE.BoxGeometry(signW - 0.04, 0.03, 0.13);
      const topNeon = new THREE.Mesh(neonGeo, neonMat);
      topNeon.position.set(0, 2.55 + signH / 2 + 0.015, 0);
      assembly.add(topNeon);
      const btmNeon = new THREE.Mesh(neonGeo, neonMat);
      btmNeon.position.set(0, 2.55 - signH / 2 - 0.015, 0);
      assembly.add(btmNeon);

      // Architectural Entrance Portal Grand Arch (if grand-arch selected)
      if (doorConfig?.signStyle === 'grand-arch') {
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.5 });
        const pillarGeo = new THREE.BoxGeometry(0.18, 2.9, 0.22);
        const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
        leftPillar.position.set(-signW / 2 - 0.09, 1.45, 0);
        assembly.add(leftPillar);
        const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
        rightPillar.position.set(signW / 2 + 0.09, 1.45, 0);
        assembly.add(rightPillar);
      }

      // 4. Entrance Floor Mat on floor inside the doorway (+Z local)
      const matGeo = new THREE.PlaneGeometry(doorW + 0.3, 1.15);
      matGeo.rotateX(-Math.PI / 2);
      const matMesh = new THREE.Mesh(matGeo, new THREE.MeshBasicMaterial({
        map: entranceMatTex,
        depthWrite: false
      }));
      matMesh.position.set(0, 0.012, 0.65);
      assembly.add(matMesh);

      // 5. Directional Arrow Chevrons on Floor leading into shop (+Z local)
      const chevronSteps = [1.45, 2.15, 2.85];
      chevronSteps.forEach((dist, idx) => {
        const cShape = new THREE.Shape();
        const cw = 0.38;
        const cd = 0.28;
        const ct = 0.10;
        cShape.moveTo(-cw, -cd);
        cShape.lineTo(0, cd);
        cShape.lineTo(cw, -cd);
        cShape.lineTo(cw, -cd + ct);
        cShape.lineTo(0, cd + ct);
        cShape.lineTo(-cw, -cd + ct);
        cShape.closePath();

        const cGeo = new THREE.ShapeGeometry(cShape);
        cGeo.rotateX(-Math.PI / 2);
        const cMat = new THREE.MeshBasicMaterial({
          color: 0x10b981,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.95 - (idx * 0.22)
        });
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cMesh.position.set(0, 0.014, dist);
        assembly.add(cMesh);
      });

      return assembly;
    };

    // 2. BACK WALL (Z = -roomHeight/2)
    if (activeWall === 'back') {
      const doorX = (doorRatio - 0.5) * roomWidth;
      const len1 = (doorX - doorW / 2) - (-roomWidth / 2);
      const len2 = (roomWidth / 2) - (doorX + doorW / 2);

      if (len1 > 0.1) {
        const seg1 = new THREE.Mesh(new THREE.BoxGeometry(len1, wallHeight, wallThick), [
          exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat, wallMat, exteriorWallMat
        ]);
        seg1.position.set(-roomWidth / 2 + len1 / 2, wallHeight / 2, -roomHeight / 2);
        seg1.receiveShadow = true;
        seg1.castShadow = true;
        roomGroup.add(seg1);
      }

      if (len2 > 0.1) {
        const seg2 = new THREE.Mesh(new THREE.BoxGeometry(len2, wallHeight, wallThick), [
          exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat, wallMat, exteriorWallMat
        ]);
        seg2.position.set(doorX + doorW / 2 + len2 / 2, wallHeight / 2, -roomHeight / 2);
        seg2.receiveShadow = true;
        seg2.castShadow = true;
        roomGroup.add(seg2);
      }

      // Lintel above door
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorW, lintelHeight, wallThick), [
        exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat, wallMat, exteriorWallMat
      ]);
      lintel.position.set(doorX, doorHeight + lintelHeight / 2, -roomHeight / 2);
      roomGroup.add(lintel);

      // Door assembly facing inward (+Z world)
      roomGroup.add(buildDoorAssembly(doorX, -roomHeight / 2, 0));
    } else {
      // Solid Back Wall with GLP Arena LED and Sign
      const backWallGeo = new THREE.BoxGeometry(roomWidth + wallThick, wallHeight, wallThick);
      const backWall = new THREE.Mesh(backWallGeo, [
        exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat,
        wallMat, exteriorWallMat
      ]);
      backWall.position.set(0, wallHeight / 2, -roomHeight / 2);
      backWall.receiveShadow = true;
      backWall.castShadow = true;
      roomGroup.add(backWall);

      const backLedGeo = new THREE.BoxGeometry(roomWidth * 0.85, 0.06, 0.05);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0x1d4ed8 });
      const backLed = new THREE.Mesh(backLedGeo, ledMat);
      backLed.position.set(0, wallHeight * 0.75, -roomHeight / 2 + 0.12);
      roomGroup.add(backLed);

      const signGeo = new THREE.BoxGeometry(3.5, 0.6, 0.08);
      const signMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
      const signMesh = new THREE.Mesh(signGeo, signMat);
      signMesh.position.set(0, wallHeight * 0.75, -roomHeight / 2 + 0.13);
      roomGroup.add(signMesh);
    }

    // 3. LEFT WALL (X = -roomWidth/2)
    if (activeWall === 'left') {
      const doorZ = (doorRatio - 0.5) * roomHeight;
      const len1 = (doorZ - doorW / 2) - (-roomHeight / 2);
      const len2 = (roomHeight / 2) - (doorZ + doorW / 2);

      if (len1 > 0.1) {
        const seg1 = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallHeight, len1), [
          exteriorWallMat, wallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat
        ]);
        seg1.position.set(-roomWidth / 2, wallHeight / 2, -roomHeight / 2 + len1 / 2);
        seg1.receiveShadow = true;
        seg1.castShadow = true;
        roomGroup.add(seg1);
      }

      if (len2 > 0.1) {
        const seg2 = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallHeight, len2), [
          exteriorWallMat, wallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat
        ]);
        seg2.position.set(-roomWidth / 2, wallHeight / 2, doorZ + doorW / 2 + len2 / 2);
        seg2.receiveShadow = true;
        seg2.castShadow = true;
        roomGroup.add(seg2);
      }

      const lintel = new THREE.Mesh(new THREE.BoxGeometry(wallThick, lintelHeight, doorW), [
        exteriorWallMat, wallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat
      ]);
      lintel.position.set(-roomWidth / 2, doorHeight + lintelHeight / 2, doorZ);
      roomGroup.add(lintel);

      // Door assembly facing inward (+X world)
      roomGroup.add(buildDoorAssembly(-roomWidth / 2, doorZ, Math.PI / 2));
    } else {
      // Left Wall with Panoramic Glass Window
      const leftWallZ = roomHeight;
      const leftSolidGeo = new THREE.BoxGeometry(wallThick, wallHeight, leftWallZ * 0.35);
      const leftSolid = new THREE.Mesh(leftSolidGeo, [
        exteriorWallMat, wallMat, exteriorWallMat, exteriorWallMat,
        exteriorWallMat, exteriorWallMat
      ]);
      leftSolid.position.set(-roomWidth / 2, wallHeight / 2, -roomHeight * 0.25);
      leftSolid.receiveShadow = true;
      leftSolid.castShadow = true;
      roomGroup.add(leftSolid);

      const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
      const windowGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x93c5fd,
        transmission: 0.95,
        opacity: 0.4,
        transparent: true,
        roughness: 0.05,
        ior: 1.5
      });

      const windowGeo = new THREE.BoxGeometry(0.08, wallHeight * 0.65, roomHeight * 0.45);
      const windowMesh = new THREE.Mesh(windowGeo, windowGlassMat);
      windowMesh.position.set(-roomWidth / 2, wallHeight * 0.55, roomHeight * 0.15);
      roomGroup.add(windowMesh);

      const sillGeo = new THREE.BoxGeometry(0.3, 0.1, roomHeight * 0.48);
      const sill = new THREE.Mesh(sillGeo, windowFrameMat);
      sill.position.set(-roomWidth / 2, wallHeight * 0.22, roomHeight * 0.15);
      roomGroup.add(sill);
    }

    // 4. RIGHT WALL (X = roomWidth/2)
    if (activeWall === 'right') {
      const doorZ = (doorRatio - 0.5) * roomHeight;
      const len1 = (doorZ - doorW / 2) - (-roomHeight / 2);
      const len2 = (roomHeight / 2) - (doorZ + doorW / 2);

      if (len1 > 0.1) {
        const seg1 = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallHeight, len1), [
          wallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat
        ]);
        seg1.position.set(roomWidth / 2, wallHeight / 2, -roomHeight / 2 + len1 / 2);
        seg1.receiveShadow = true;
        seg1.castShadow = true;
        roomGroup.add(seg1);
      }

      if (len2 > 0.1) {
        const seg2 = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallHeight, len2), [
          wallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat
        ]);
        seg2.position.set(roomWidth / 2, wallHeight / 2, doorZ + doorW / 2 + len2 / 2);
        seg2.receiveShadow = true;
        seg2.castShadow = true;
        roomGroup.add(seg2);
      }

      const lintel = new THREE.Mesh(new THREE.BoxGeometry(wallThick, lintelHeight, doorW), [
        wallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat
      ]);
      lintel.position.set(roomWidth / 2, doorHeight + lintelHeight / 2, doorZ);
      roomGroup.add(lintel);

      // Door assembly facing inward (-X world)
      roomGroup.add(buildDoorAssembly(roomWidth / 2, doorZ, -Math.PI / 2));
    } else {
      // Solid Right Wall
      const rightWallGeo = new THREE.BoxGeometry(wallThick, wallHeight, roomHeight * 0.85);
      const rightWall = new THREE.Mesh(rightWallGeo, [
        wallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat,
        exteriorWallMat, exteriorWallMat
      ]);
      rightWall.position.set(roomWidth / 2, wallHeight / 2, -roomHeight * 0.075);
      rightWall.receiveShadow = true;
      rightWall.castShadow = true;
      roomGroup.add(rightWall);
    }

    // 5. FRONT WALL / CUTAWAY (Z = roomHeight/2)
    if (activeWall === 'front') {
      const doorX = (doorRatio - 0.5) * roomWidth;
      const len1 = (doorX - doorW / 2) - (-roomWidth / 2);
      const len2 = (roomWidth / 2) - (doorX + doorW / 2);

      if (len1 > 0.1) {
        const frontBaseLeft = new THREE.Mesh(new THREE.BoxGeometry(len1, 0.15, wallThick), exteriorWallMat);
        frontBaseLeft.position.set(-roomWidth / 2 + len1 / 2, 0.075, roomHeight / 2);
        roomGroup.add(frontBaseLeft);
      }

      if (len2 > 0.1) {
        const frontBaseRight = new THREE.Mesh(new THREE.BoxGeometry(len2, 0.15, wallThick), exteriorWallMat);
        frontBaseRight.position.set(doorX + doorW / 2 + len2 / 2, 0.075, roomHeight / 2);
        roomGroup.add(frontBaseRight);
      }

      // Door assembly facing inward (-Z world)
      roomGroup.add(buildDoorAssembly(doorX, roomHeight / 2, Math.PI));
    } else {
      const frontBaseGeo = new THREE.BoxGeometry(roomWidth + wallThick, 0.15, wallThick);
      const frontBase = new THREE.Mesh(frontBaseGeo, exteriorWallMat);
      frontBase.position.set(0, 0.075, roomHeight / 2);
      roomGroup.add(frontBase);
    }

    scene.add(roomGroup);
  }, [roomWidth, roomHeight, selectedFloorMaterial, selectedWallpaper, blueprintUrl, blueprintOpacity, createFloorTexture, getWallpaperColor, doorConfig, createEntranceMatTexture, createEntranceSignTexture, createGlassDecalTexture]);

  // Create 3D Meshes for Placed Items
  const createFurnitureMesh = useCallback((item) => {
    const group = new THREE.Group();
    group.userData = { itemId: item.id };

    const type = item.type;
    const deskColor = 0x0f172a; // dark slate desk
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
    const deskTopMat = new THREE.MeshStandardMaterial({ color: deskColor, roughness: 0.35, metalness: 0.1 });
    
    // Photorealistic Glowing Screen with game HUD
    const screenTex = createScreenTexture();
    const screenMat = new THREE.MeshStandardMaterial({ 
      map: screenTex, 
      emissive: 0x38bdf8, 
      emissiveMap: screenTex,
      emissiveIntensity: 0.65,
      roughness: 0.15
    });
    const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.2, metalness: 0.3 });
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 }); // Black racing leather
    const chairRoyalBlue = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.45 }); // Royal Blue racing stripe
    const chairAccent = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 });
    const rgbStripMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 }); // RGB keyboard glow

    // Helper: Build a realistic ergonomic gaming chair (Bucket Racing Seat)
    const addChair = (x, z, rotY = 0) => {
      const chairGroup = new THREE.Group();
      chairGroup.position.set(x, 0, z);
      chairGroup.rotation.y = rotY;

      // Base 5-star chrome castor
      const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.05, 5), metalMat);
      baseMesh.position.y = 0.08;
      chairGroup.add(baseMesh);

      // Hydraulic piston pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.38, 8), metalMat);
      pole.position.y = 0.25;
      chairGroup.add(pole);

      // Seat cushion (two-tone with side bolsters)
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.52), chairMat);
      seat.position.y = 0.48;
      seat.castShadow = true;
      chairGroup.add(seat);

      // Seat racing side wings
      const seatWingL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.5), chairRoyalBlue);
      seatWingL.position.set(-0.24, 0.52, 0);
      const seatWingR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.5), chairRoyalBlue);
      seatWingR.position.set(0.24, 0.52, 0);
      chairGroup.add(seatWingL);
      chairGroup.add(seatWingR);

      // Curved Backrest (racing style)
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.72, 0.08), chairMat);
      back.position.set(0, 0.86, -0.22);
      back.castShadow = true;
      chairGroup.add(back);

      // Backrest Royal Blue Center Stripe
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.68, 0.09), chairRoyalBlue);
      stripe.position.set(0, 0.86, -0.218);
      chairGroup.add(stripe);

      // Headrest Ergonomic Pillow
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.09), chairRoyalBlue);
      pillow.position.set(0, 1.15, -0.18);
      chairGroup.add(pillow);

      // Lumbar Support Cushion
      const lumbar = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.06), chairMat);
      lumbar.position.set(0, 0.64, -0.18);
      chairGroup.add(lumbar);

      // 3D Adjustable Armrests
      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.28), chairAccent);
      armL.position.set(-0.29, 0.62, 0);
      const armR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.28), chairAccent);
      armR.position.set(0.29, 0.62, 0);
      chairGroup.add(armL);
      chairGroup.add(armR);

      group.add(chairGroup);
    };

    // Helper: Build photorealistic gaming monitor, RGB keyboard & mouse
    const addMonitor = (x, z) => {
      // Monitor Stand Base & Pole
      const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.18), metalMat);
      standBase.position.set(x, 0.73, z - 0.04);
      group.add(standBase);

      const standPole = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.06), metalMat);
      standPole.position.set(x, 0.89, z - 0.06);
      group.add(standPole);

      // Thin Bezel Screen Frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.44, 0.03), screenFrameMat);
      frame.position.set(x, 1.06, z + 0.02);
      frame.castShadow = true;
      group.add(frame);

      // Glowing Game HUD Display Screen
      const display = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.4), screenMat);
      display.position.set(x, 1.06, z + 0.038);
      group.add(display);

      // Extended Esports Desk Mousepad
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.008, 0.35), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 }));
      pad.position.set(x, 0.724, z + 0.24);
      group.add(pad);

      // RGB Backlit Mechanical Keyboard
      const kb = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.018, 0.16), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 }));
      kb.position.set(x - 0.1, 0.735, z + 0.26);
      group.add(kb);

      const kbRgb = new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.006, 0.17), rgbStripMat);
      kbRgb.position.set(x - 0.1, 0.728, z + 0.26);
      group.add(kbRgb);

      // Gaming Mouse
      const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.022, 0.11), new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.3 }));
      mouse.position.set(x + 0.22, 0.735, z + 0.26);
      group.add(mouse);
    };

    if (type === 'pc-row-2') {
      // 2.4m x 1.0m table with 2 battle stations
      const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 0.9), deskTopMat);
      deskTop.position.set(0, 0.72, 0);
      deskTop.castShadow = true;
      group.add(deskTop);

      // 4 Steel Legs
      const legPositions = [[-1.1, -0.38], [1.1, -0.38], [-1.1, 0.38], [1.1, 0.38]];
      legPositions.forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.72, 8), metalMat);
        leg.position.set(lx, 0.36, lz);
        group.add(leg);
      });

      // Cable tray underneath
      const tray = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.2), metalMat);
      tray.position.set(0, 0.65, -0.2);
      group.add(tray);

      // Divider glass / acoustic panel
      const divider = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.32, 0.04), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, transparent: true, opacity: 0.85 }));
      divider.position.set(0, 0.9, -0.42);
      group.add(divider);

      // 2 Monitors and Keyboards
      addMonitor(-0.6, -0.15);
      addMonitor(0.6, -0.15);

      // 2 Chairs
      addChair(-0.6, 0.45, 0);
      addChair(0.6, 0.45, 0);
    } 
    else if (type === 'pc-row-4') {
      // 4.8m x 1.0m quad table
      const deskTop = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.06, 0.9), deskTopMat);
      deskTop.position.set(0, 0.72, 0);
      deskTop.castShadow = true;
      group.add(deskTop);

      // Legs
      [-2.3, -0.75, 0.75, 2.3].forEach(lx => {
        [-0.38, 0.38].forEach(lz => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.72, 8), metalMat);
          leg.position.set(lx, 0.36, lz);
          group.add(leg);
        });
      });

      // 4 Monitors & Chairs
      const xOffsets = [-1.8, -0.6, 0.6, 1.8];
      xOffsets.forEach(ox => {
        addMonitor(ox, -0.15);
        addChair(ox, 0.45, 0);
      });
    }
    else if (type === 'pc-island-6') {
      // 3.6m x 2.0m 6-station island
      const deskTop1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.06, 0.9), deskTopMat);
      deskTop1.position.set(0, 0.72, -0.48);
      const deskTop2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.06, 0.9), deskTopMat);
      deskTop2.position.set(0, 0.72, 0.48);
      group.add(deskTop1);
      group.add(deskTop2);

      // Central divider & cable spine with illuminated GLP Royal Blue
      const spine = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.5, 0.08), new THREE.MeshStandardMaterial({ color: 0x1d4ed8 }));
      spine.position.set(0, 0.95, 0);
      group.add(spine);

      // Side 1 (Facing North)
      [-1.2, 0, 1.2].forEach(ox => {
        addMonitor(ox, -0.25);
        addChair(ox, -0.85, Math.PI);
      });

      // Side 2 (Facing South)
      [-1.2, 0, 1.2].forEach(ox => {
        addMonitor(ox, 0.25);
        addChair(ox, 0.85, 0);
      });
    }
    else if (type === 'vip-room-5') {
      // 5.0m x 3.5m VIP Room glass booth (CUTAWAY OPEN CEILING - NO SOLID BLACK ROOF!)
      // Transparent acoustic glass enclosure
      const boothFrame = new THREE.Mesh(new THREE.BoxGeometry(5.0, 2.5, 3.5), new THREE.MeshPhysicalMaterial({
        color: 0x93c5fd,
        transmission: 0.92,
        opacity: 0.35,
        transparent: true,
        roughness: 0.08,
        ior: 1.45
      }));
      boothFrame.position.set(0, 1.25, 0);
      group.add(boothFrame);

      // Open Modern Perimeter Roof Beam Frame (Allows full visibility from above!)
      const beamThick = 0.12;
      const beamMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
      
      const beamFront = new THREE.Mesh(new THREE.BoxGeometry(5.0, beamThick, beamThick), beamMat);
      beamFront.position.set(0, 2.5, 1.75);
      group.add(beamFront);

      const beamBack = new THREE.Mesh(new THREE.BoxGeometry(5.0, beamThick, beamThick), beamMat);
      beamBack.position.set(0, 2.5, -1.75);
      group.add(beamBack);

      const beamLeft = new THREE.Mesh(new THREE.BoxGeometry(beamThick, beamThick, 3.5), beamMat);
      beamLeft.position.set(-2.5, 2.5, 0);
      group.add(beamLeft);

      const beamRight = new THREE.Mesh(new THREE.BoxGeometry(beamThick, beamThick, 3.5), beamMat);
      beamRight.position.set(2.5, 2.5, 0);
      group.add(beamRight);

      // Warm Amber Interior Spotlight for VIP Luxury Atmosphere
      const vipInteriorLight = new THREE.PointLight(0xf59e0b, 2.2, 6.0);
      vipInteriorLight.position.set(0, 2.3, 0);
      group.add(vipInteriorLight);

      // VIP Sign Badge
      const vipSign = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.35, 0.08), new THREE.MeshBasicMaterial({ color: 0x1d4ed8 }));
      vipSign.position.set(0, 2.3, 1.76);
      group.add(vipSign);

      // 5 VIP Stations inside
      [-1.8, -0.9, 0, 0.9, 1.8].forEach(ox => {
        addMonitor(ox, -0.6);
        addChair(ox, 0.1, 0);
      });
    }
    else if (type === 'stage-5v5') {
      // 8.5m x 3.2m Tournament Stage
      // Raised Platform
      const stageBase = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.35, 3.2), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 }));
      stageBase.position.set(0, 0.175, 0);
      stageBase.castShadow = true;
      group.add(stageBase);

      // Blue Glow Edge Line
      const stageGlow = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.08, 3.3), new THREE.MeshBasicMaterial({ color: 0x1d4ed8 }));
      stageGlow.position.set(0, 0.35, 0);
      group.add(stageGlow);

      // Team Left (5 stations)
      [-3.4, -2.6, -1.8, -1.0, -0.2].forEach(ox => {
        addMonitor(ox, -0.2);
        addChair(ox, 0.45, 0);
      });

      // Team Right (5 stations)
      [0.2, 1.0, 1.8, 2.6, 3.4].forEach(ox => {
        addMonitor(ox, -0.2);
        addChair(ox, 0.45, 0);
      });

      // Backdrop Giant LED Screen
      const ledWall = new THREE.Mesh(new THREE.BoxGeometry(8.0, 2.2, 0.1), new THREE.MeshBasicMaterial({ color: 0x1e3a8a }));
      ledWall.position.set(0, 1.45, -1.45);
      group.add(ledWall);
    }
    else if (type === 'cashier-counter') {
      // 3.0m x 1.5m Reception
      const counter = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.15, 0.8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }));
      counter.position.set(0, 1.15 / 2, 0);
      counter.castShadow = true;
      group.add(counter);

      // Top marble ledge
      const ledge = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.08, 0.9), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 }));
      ledge.position.set(0, 1.18, 0);
      group.add(ledge);

      // POS Display
      const pos = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.25), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      pos.position.set(0, 1.35, 0);
      group.add(pos);
    }
    else if (type === 'server-room') {
      // 42U Server Rack (2m x 2m room)
      const rack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.1, 0.9), new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.3 }));
      rack.position.set(0, 1.05, 0);
      rack.castShadow = true;
      group.add(rack);

      // Server blinking LEDs
      [-0.4, 0, 0.4].forEach(ox => {
        [0.4, 0.8, 1.2, 1.6].forEach(oy => {
          const led = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
          led.position.set(ox, oy, 0.47);
          group.add(led);
        });
      });
    }
    else if (type === 'cafe-bar') {
      // 3.5m x 2.2m Bar Counter
      const bar = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.1, 0.9), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 }));
      bar.position.set(0, 0.55, 0);
      group.add(bar);

      // Top bar wood finish
      const barTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 1.0), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 }));
      barTop.position.set(0, 1.14, 0);
      group.add(barTop);
    }
    else if (type === 'lounge-sofa') {
      // Modern 4-seater sofa
      const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.45, 0.9), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 }));
      sofaBase.position.set(0, 0.225, 0);
      group.add(sofaBase);

      const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.5, 0.3), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }));
      sofaBack.position.set(0, 0.6, -0.3);
      group.add(sofaBack);

      // Coffee table
      const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 0.65), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }));
      coffeeTable.position.set(0, 0.175, 0.75);
      group.add(coffeeTable);
    }
    else {
      // Fallback architectural block
      const w = item.catalog?.widthMeters || 1;
      const h = item.catalog?.heightMeters || 1;
      const box = new THREE.Mesh(new THREE.BoxGeometry(w, 0.8, h), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.5 }));
      box.position.set(0, 0.4, 0);
      group.add(box);
    }

    return group;
  }, []);

  // Sync Placed Items with 3D Scene
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing furniture
    const existingGroup = scene.getObjectByName('placed_furniture_group');
    if (existingGroup) scene.remove(existingGroup);

    const furnitureGroup = new THREE.Group();
    furnitureGroup.name = 'placed_furniture_group';
    itemMeshesMapRef.current.clear();

    // Map 2D floor coordinates (0,0 is top-left of room) to 3D center-origin (-width/2 to +width/2)
    placedItems.forEach(item => {
      const mesh = createFurnitureMesh(item);
      
      // Calculate 3D position
      const isRotated = item.rotation === 90 || item.rotation === 270;
      const itemW = isRotated ? (item.catalog?.heightMeters || 1) : (item.catalog?.widthMeters || 1);
      const itemH = isRotated ? (item.catalog?.widthMeters || 1) : (item.catalog?.heightMeters || 1);

      const posX3D = (item.x + itemW / 2) - (roomWidth / 2);
      const posZ3D = (item.y + itemH / 2) - (roomHeight / 2);

      mesh.position.set(posX3D, 0, posZ3D);
      mesh.rotation.y = (item.rotation * Math.PI) / 180;

      furnitureGroup.add(mesh);
      itemMeshesMapRef.current.set(item.id, mesh);
    });

    scene.add(furnitureGroup);
  }, [placedItems, roomWidth, roomHeight, createFurnitureMesh]);

  // Update Highlight when Selected Item Changes
  useEffect(() => {
    const highlight = selectedHighlightRef.current;
    if (!highlight) return;

    if (!selectedItemId) {
      highlight.visible = false;
      return;
    }

    const mesh = itemMeshesMapRef.current.get(selectedItemId);
    if (mesh) {
      highlight.position.x = mesh.position.x;
      highlight.position.z = mesh.position.z;
      highlight.visible = true;
    } else {
      highlight.visible = false;
    }
  }, [selectedItemId]);

  // Raycasting for Direct 3D Item Clicking
  const handlePointerDown = (event) => {
    const container = containerRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    if (!container || !camera || !scene) return;

    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    const furnitureGroup = scene.getObjectByName('placed_furniture_group');
    if (!furnitureGroup) return;

    const intersects = raycasterRef.current.intersectObjects(furnitureGroup.children, true);
    if (intersects.length > 0) {
      // Find top group with userData.itemId
      let cur = intersects[0].object;
      while (cur && cur.parent && !cur.userData?.itemId && cur !== scene) {
        cur = cur.parent;
      }
      if (cur?.userData?.itemId) {
        onSelectItem(cur.userData.itemId);
      }
    }
  };

  // Camera Presets
  const [activeCamPreset, setActiveCamPreset] = useState('iso');

  const setCameraView = (viewType) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    setActiveCamPreset(viewType);
    const maxDim = Math.max(roomWidth, roomHeight);
    const activeWall = doorConfig?.wall || 'right';
    const doorRatio = Math.max(0.15, Math.min(0.85, doorConfig?.offsetRatio ?? 0.75));

    if (viewType === 'iso') {
      // 45-degree Isometric View (Homestyler style) - raised target to keep whole venue centered
      camera.position.set(maxDim * 1.38, maxDim * 1.56, maxDim * 1.56);
      controls.target.set(0, -0.22, 0.65);
    } else if (viewType === 'top') {
      // Top-Down 2D Blueprint angle
      camera.position.set(0, maxDim * 1.95, 0.01);
      controls.target.set(0, 0, 0);
    } else if (viewType === 'front') {
      // Front Eye-Level Angle
      camera.position.set(0, 2.2, maxDim * 1.5);
      controls.target.set(0, 0.7, 0);
    } else if (viewType === 'storefront') {
      // Storefront Entrance View: Automatically frame outside the door looking at sign/stickers
      if (activeWall === 'front') {
        const doorX = (doorRatio - 0.5) * roomWidth;
        camera.position.set(doorX, 2.3, roomHeight / 2 + 7.2);
        controls.target.set(doorX, 1.9, roomHeight / 2);
      } else if (activeWall === 'back') {
        const doorX = (doorRatio - 0.5) * roomWidth;
        camera.position.set(doorX, 2.3, -roomHeight / 2 - 7.2);
        controls.target.set(doorX, 1.9, -roomHeight / 2);
      } else if (activeWall === 'left') {
        const doorZ = (doorRatio - 0.5) * roomHeight;
        camera.position.set(-roomWidth / 2 - 7.2, 2.3, doorZ);
        controls.target.set(-roomWidth / 2, 1.9, doorZ);
      } else { // right
        const doorZ = (doorRatio - 0.5) * roomHeight;
        camera.position.set(roomWidth / 2 + 7.2, 2.3, doorZ);
        controls.target.set(roomWidth / 2, 1.9, doorZ);
      }
    } else if (viewType === 'walk') {
      // Walkthrough inside arena at eye level
      camera.position.set(0, 1.65, roomHeight * 0.28);
      controls.target.set(0, 1.45, -roomHeight * 0.15);
    }
    controls.update();
  };

  const handleZoom = (delta) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    camera.position.multiplyScalar(delta > 0 ? 0.80 : 1.25);
    controls.update();
  };

  // High-Resolution 3D Snapshot PNG Export
  const handleExport3DSnapshot = () => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;

    renderer.render(scene, camera);
    const filename = `GSPEED-3D-Shop-Layout-${roomWidth}x${roomHeight}m-${Date.now().toString().slice(-4)}.png`;
    downloadFile(renderer.domElement, filename, 'image/png');
  };

  // Adjust camera framing smoothly when toggling fullscreen so shop is never cut off at bottom
  useEffect(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const maxDim = Math.max(roomWidth, roomHeight);
    if (isPlannerFullscreen) {
      // In fullscreen mode, elevate camera angle & adjust target to provide ample bottom clearance
      camera.position.set(maxDim * 1.45, maxDim * 1.62, maxDim * 1.62);
      controls.target.set(0, -0.32, 0.75);
    } else {
      camera.position.set(maxDim * 1.38, maxDim * 1.56, maxDim * 1.56);
      controls.target.set(0, -0.22, 0.65);
    }
    controls.update();
  }, [isPlannerFullscreen, roomWidth, roomHeight]);

  // Real-time Keyboard Arrow Movement & Shortcut Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedItemId) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onNudgeItem(selectedItemId, -0.5, 0);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNudgeItem(selectedItemId, 0.5, 0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onNudgeItem(selectedItemId, 0, -0.5);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onNudgeItem(selectedItemId, 0, 0.5);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onRotateItem(selectedItemId);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDeleteItem(selectedItemId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, onNudgeItem, onRotateItem, onDeleteItem]);

  const selectedItemData = placedItems.find(i => i.id === selectedItemId);

  return (
    <div className="room-3d-studio-wrapper">
      {/* 3D Viewport Toolbar */}
      <div className="studio-3d-topbar">
        <div className="topbar-left">
          <span className="badge-pill badge-blue">
            <Compass size={14} />
            <span>3D STUDIO</span>
          </span>
          <span className="studio-info-text">
            ขนาดร้าน: <strong>{roomWidth} x {roomHeight} ม.</strong> ({roomWidth * roomHeight} ตร.ม.)
          </span>
        </div>

        {/* Camera Views Selector */}
        <div className="camera-view-btns">
          <div className="camera-views-cluster">
          <button 
            className={`btn-cam-view ${activeCamPreset === 'iso' ? 'active' : ''}`}
            onClick={() => setCameraView('iso')}
            title="มุมมอง 3D Isometric (สไตล์ตัวอย่าง)"
          >
            <Eye size={15} />
            <span>3D Isometric (45°)</span>
          </button>
          <button 
            className={`btn-cam-view btn-cam-storefront ${activeCamPreset === 'storefront' ? 'active' : ''}`}
            onClick={() => setCameraView('storefront')}
            title="หมุนกล้องไปส่องป้ายและสติ๊กเกอร์หน้าร้านตรงประตูทางเข้า"
          >
            <Sparkles size={15} className="text-emerald" />
            <span>หน้าร้าน (Storefront)</span>
          </button>
          <button 
            className={`btn-cam-view ${activeCamPreset === 'walk' ? 'active' : ''}`}
            onClick={() => setCameraView('walk')}
            title="มุมมองระดับสายตาคนเดินชมในร้าน (Eye-Level Walk)"
          >
            <Footprints size={15} />
            <span>เดินชมในร้าน</span>
          </button>
          <button 
            className={`btn-cam-view ${activeCamPreset === 'top' ? 'active' : ''}`}
            onClick={() => setCameraView('top')}
            title="มุมมองแปลนด้านบน (Top-Down)"
          >
            <Layers size={15} />
            <span>Top-Down (แปลน)</span>
          </button>
          </div>

          <div className="cam-zoom-divider"></div>

          <div className="camera-tools-cluster">
            <button className="btn-cam-mini" onClick={() => handleZoom(1)} title="ซูมเข้า">
              <ZoomIn size={15} />
            </button>
            <button className="btn-cam-mini" onClick={() => handleZoom(-1)} title="ซูมออก">
              <ZoomOut size={15} />
            </button>
            <button 
              type="button" 
              className="btn-cam-mini"
              onClick={handleExport3DSnapshot}
              title="ถ่ายภาพเรนเดอร์ 3D (PNG)"
            >
              <Camera size={15} />
            </button>
          </div>

          <div className="cam-zoom-divider"></div>
          {/* Quick Door Entrance Position Popover Button */}
          <button 
            type="button" 
            id="btn-3d-door-toggle"
            className={`btn-cam-view btn-door-toggle ${isDoorPopoverOpen ? 'active' : ''}`}
            onClick={() => setIsDoorPopoverOpen(!isDoorPopoverOpen)}
            title="กำหนดตำแหน่งและผนังประตูทางเข้าร้าน"
          >
            <DoorOpen size={15} className={isDoorPopoverOpen ? 'text-white' : 'text-emerald'} />
            <span>ทางเข้า: {
              doorConfig?.wall === 'front' ? 'ด้านหน้า' :
              doorConfig?.wall === 'left' ? 'ผนังซ้าย' :
              doorConfig?.wall === 'back' ? 'ผนังหลัง' : 'ผนังขวา'
            }</span>
          </button>
        </div>
      </div>

      {/* Main 3D WebGL Canvas */}
      <div className="three-canvas-container">
        {/* Dedicated WebGL Canvas Viewport */}
        <div 
          className="three-canvas-viewport" 
          ref={containerRef}
          onPointerDown={handlePointerDown}
        />
        {/* Floating Quick Door Configuration Popover */}
        {isDoorPopoverOpen && (
          <div className="door-3d-floating-popover" onClick={(e) => e.stopPropagation()}>
            <div className="door-popover-header">
              <div className="popover-title">
                <DoorOpen size={16} className="text-emerald" />
                <span>กำหนดประตูทางเข้าร้าน (Store Entrance)</span>
              </div>
              <button 
                type="button" 
                className="btn-popover-close" 
                onClick={() => setIsDoorPopoverOpen(false)}
                title="ปิดหน้าต่าง"
              >
                ✕
              </button>
            </div>

            <div className="door-popover-body">
              {/* 4 Wall Selector */}
              <div className="door-field-group">
                <label className="field-lbl">เลือกผนังติดตั้งประตูร้าน:</label>
                <div className="door-wall-grid">
                  <button 
                    type="button" 
                    className={`wall-pick-btn ${doorConfig?.wall === 'front' ? 'active' : ''}`}
                    onClick={() => onChangeDoorConfig({ ...doorConfig, wall: 'front' })}
                  >
                    <ArrowDown size={14} /> ด้านหน้า (Front)
                  </button>
                  <button 
                    type="button" 
                    className={`wall-pick-btn ${doorConfig?.wall === 'right' || !doorConfig?.wall ? 'active' : ''}`}
                    onClick={() => onChangeDoorConfig({ ...doorConfig, wall: 'right' })}
                  >
                    <ArrowRight size={14} /> ผนังขวา (Right)
                  </button>
                  <button 
                    type="button" 
                    className={`wall-pick-btn ${doorConfig?.wall === 'left' ? 'active' : ''}`}
                    onClick={() => onChangeDoorConfig({ ...doorConfig, wall: 'left' })}
                  >
                    <ArrowLeft size={14} /> ผนังซ้าย (Left)
                  </button>
                  <button 
                    type="button" 
                    className={`wall-pick-btn ${doorConfig?.wall === 'back' ? 'active' : ''}`}
                    onClick={() => onChangeDoorConfig({ ...doorConfig, wall: 'back' })}
                  >
                    <ArrowUp size={14} /> ผนังหลัง (Back)
                  </button>
                </div>
              </div>

              {/* Position Slider */}
              <div className="door-field-group">
                <div className="slider-header-mini">
                  <label className="field-lbl">ตำแหน่งบนผนัง:</label>
                  <span className="slider-val-mini text-emerald">{Math.round((doorConfig?.offsetRatio ?? 0.75) * 100)}%</span>
                </div>
                <div className="door-offset-presets">
                  <button 
                    type="button" 
                    className="btn-preset-offset" 
                    onClick={() => onChangeDoorConfig({ ...doorConfig, offsetRatio: 0.25 })}
                  >
                    {doorConfig?.wall === 'front' || doorConfig?.wall === 'back' ? 'ฝั่งซ้าย (25%)' : 'ฝั่งหลัง (25%)'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-preset-offset" 
                    onClick={() => onChangeDoorConfig({ ...doorConfig, offsetRatio: 0.50 })}
                  >
                    ตรงกลาง (50%)
                  </button>
                  <button 
                    type="button" 
                    className="btn-preset-offset" 
                    onClick={() => onChangeDoorConfig({ ...doorConfig, offsetRatio: 0.75 })}
                  >
                    {doorConfig?.wall === 'front' || doorConfig?.wall === 'back' ? 'ฝั่งขวา (75%)' : 'ฝั่งหน้า (75%)'}
                  </button>
                </div>
                <input 
                  type="range"
                  min="0.15"
                  max="0.85"
                  step="0.05"
                  value={doorConfig?.offsetRatio ?? 0.75}
                  onChange={(e) => onChangeDoorConfig({ ...doorConfig, offsetRatio: parseFloat(e.target.value) })}
                  className="custom-range"
                />
              </div>

              {/* Door Style */}
              <div className="door-field-group">
                <label className="field-lbl">รูปแบบประตู:</label>
                <div className="door-style-row">
                  <button 
                    type="button" 
                    className={`door-style-btn ${doorConfig?.style === 'wood' || !doorConfig?.style ? 'active' : ''}`}
                    onClick={() => onChangeDoorConfig({ ...doorConfig, style: 'wood' })}
                  >
                    <DoorClosed size={15} />
                    <span>บานไม้โมเดิร์น</span>
                  </button>
                  <button 
                    type="button" 
                    className={`door-style-btn ${doorConfig?.style === 'glass' ? 'active' : ''}`}
                    onClick={() => onChangeDoorConfig({ ...doorConfig, style: 'glass' })}
                  >
                    <SplitSquareVertical size={15} />
                    <span>กระจกใสบานคู่</span>
                  </button>
                  <button 
                    type="button" 
                    className={`door-style-btn ${doorConfig?.style === 'auto-sliding' ? 'active' : ''}`}
                    onClick={() => onChangeDoorConfig({ ...doorConfig, style: 'auto-sliding' })}
                  >
                    <Sliders size={15} />
                    <span>บานเลื่อนออโต้</span>
                  </button>
                </div>
              </div>

              {/* Custom Store Name / Sign Text */}
              <div className="door-field-group">
                <div className="slider-header-mini">
                  <label className="field-lbl">ชื่อร้าน / สติ๊กเกอร์หน้าร้าน:</label>
                  <span className="slider-val-mini text-cyan">ป้าย 3D Real-time</span>
                </div>
                <input 
                  type="text"
                  value={doorConfig?.storeName || 'GLP : G SPEED LIVING PLUS'}
                  onChange={(e) => onChangeDoorConfig({ ...doorConfig, storeName: e.target.value })}
                  placeholder="เช่น GLP : G SPEED LIVING PLUS, สาขา พระราม 9..."
                  className="store-name-popover-input"
                  maxLength={36}
                />
                <div className="store-name-presets">
                  {['GLP : G SPEED LIVING PLUS', 'G-SPEED LIVING PLUS', 'สาขา สยามสแควร์', 'GLP CYBER LOUNGE'].map((preset) => (
                    <button 
                      key={preset}
                      type="button" 
                      className="btn-preset-name"
                      onClick={() => onChangeDoorConfig({ ...doorConfig, storeName: preset })}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signboard & Sticker Style */}
              <div className="door-field-group">
                <label className="field-lbl">รูปแบบป้าย & สติ๊กเกอร์หน้าร้าน:</label>
                <div className="door-style-row">
                  <button 
                    type="button" 
                    className={`door-style-btn ${doorConfig?.signStyle === 'neon-lightbox' || !doorConfig?.signStyle ? 'active' : ''}`}
                    onClick={() => onChangeDoorConfig({ ...doorConfig, signStyle: 'neon-lightbox' })}
                  >
                    <Sparkles size={15} />
                    <span>นีออน LED</span>
                  </button>
                  <button 
                    type="button" 
                    className={`door-style-btn ${doorConfig?.signStyle === 'acrylic-gold' ? 'active' : ''}`}
                    onClick={() => onChangeDoorConfig({ ...doorConfig, signStyle: 'acrylic-gold' })}
                  >
                    <Award size={15} />
                    <span>อะคริลิกทอง</span>
                  </button>
                  <button 
                    type="button" 
                    className={`door-style-btn ${doorConfig?.signStyle === 'minimal-dark' ? 'active' : ''}`}
                    onClick={() => onChangeDoorConfig({ ...doorConfig, signStyle: 'minimal-dark' })}
                  >
                    <Zap size={15} />
                    <span>มินิมอลไซเบอร์</span>
                  </button>
                  <button 
                    type="button" 
                    className={`door-style-btn ${doorConfig?.signStyle === 'grand-arch' ? 'active' : ''}`}
                    onClick={() => onChangeDoorConfig({ ...doorConfig, signStyle: 'grand-arch' })}
                  >
                    <Building2 size={15} />
                    <span>ซุ้มแกรนด์</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>

      {/* Floating Guidance & Selected Item Quick Actions */}
      <div className="studio-3d-floating-footer">
        {!selectedItemData && (
          <div className="hint-pill">
            <Compass size={14} className="text-blue" />
            <span className="hint-text-desktop">คลิกซ้ายค้างเพื่อหมุนรอบห้อง • คลิกขวาเพื่อเลื่อน • กดปุ่มลูกศรเพื่อย้ายโต๊ะ</span>
            <span className="hint-text-mobile">แตะเลื่อนเพื่อหมุน 360° • สองนิ้วเพื่อซูม</span>
          </div>
        )}

        {selectedItemData && (
          <div className="quick-3d-actions-pill">
            <span className="selected-tag">{selectedItemData.catalog?.name.split(' ')[0]}</span>

            {/* D-Pad Nudge Buttons */}
            <div className="nudge-3d-group" title="เลื่อนตำแหน่งวัตถุใน 3D (หรือกดปุ่มลูกศรบนคีย์บอร์ด)">
              <span className="nudge-lbl">ย้าย:</span>
              <button 
                type="button"
                className="nudge-btn-mini" 
                onClick={() => onNudgeItem(selectedItemData.id, -0.5, 0)}
                title="เลื่อนซ้าย (-0.5ม.) หรือกดปุ่ม ←"
              >
                <ArrowLeft size={12} />
              </button>
              <button 
                type="button"
                className="nudge-btn-mini" 
                onClick={() => onNudgeItem(selectedItemData.id, 0.5, 0)}
                title="เลื่อนขวา (+0.5ม.) หรือกดปุ่ม →"
              >
                <ArrowRight size={12} />
              </button>
              <button 
                type="button"
                className="nudge-btn-mini" 
                onClick={() => onNudgeItem(selectedItemData.id, 0, -0.5)}
                title="เลื่อนขึ้น/ลึก (-0.5ม.) หรือกดปุ่ม ↑"
              >
                <ArrowUp size={12} />
              </button>
              <button 
                type="button"
                className="nudge-btn-mini" 
                onClick={() => onNudgeItem(selectedItemData.id, 0, 0.5)}
                title="เลื่อนลง/หน้า (+0.5ม.) หรือกดปุ่ม ↓"
              >
                <ArrowDown size={12} />
              </button>
            </div>

            <button 
              className="btn-quick-action" 
              onClick={() => onRotateItem(selectedItemData.id)}
              title="หมุน 90 องศา (กด R)"
            >
              <RotateCw size={14} />
              <span>หมุน 90°</span>
            </button>
            <button 
              className="btn-quick-action" 
              onClick={() => onDuplicateItem(selectedItemData.id)}
              title="คัดลอก"
            >
              <Copy size={14} />
              <span>คัดลอก</span>
            </button>
            <button 
              className="btn-quick-action delete" 
              onClick={() => onDeleteItem(selectedItemData.id)}
              title="ลบออก (กด Delete)"
            >
              <Trash2 size={14} />
              <span>ลบ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
