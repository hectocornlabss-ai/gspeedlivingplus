import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Eye, Compass, RotateCw, Copy, Trash2, Maximize2, Minimize2,
  Layers, Sun, RefreshCw, ZoomIn, ZoomOut, Check, ArrowRight,
  ArrowLeft, ArrowUp, ArrowDown, Move, Camera, Download
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
  onToggleFullscreen = () => {}
}) {
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
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not go under floor
    controls.minDistance = 4;
    controls.maxDistance = 60;
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

    // 2. BACK WALL (Z = -roomHeight/2)
    const backWallGeo = new THREE.BoxGeometry(roomWidth + wallThick, wallHeight, wallThick);
    const backWall = new THREE.Mesh(backWallGeo, [
      exteriorWallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat,
      wallMat, exteriorWallMat
    ]);
    backWall.position.set(0, wallHeight / 2, -roomHeight / 2);
    backWall.receiveShadow = true;
    backWall.castShadow = true;
    roomGroup.add(backWall);

    // Back Wall Decorative Acoustic LED Line
    const backLedGeo = new THREE.BoxGeometry(roomWidth * 0.85, 0.06, 0.05);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x1d4ed8 });
    const backLed = new THREE.Mesh(backLedGeo, ledMat);
    backLed.position.set(0, wallHeight * 0.75, -roomHeight / 2 + 0.12);
    roomGroup.add(backLed);

    // GLP Arena Wall Sign on Back Wall
    const signGeo = new THREE.BoxGeometry(3.5, 0.6, 0.08);
    const signMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    signMesh.position.set(0, wallHeight * 0.75, -roomHeight / 2 + 0.13);
    roomGroup.add(signMesh);

    // 3. LEFT WALL WITH PANORAMIC GLASS WINDOW (X = -roomWidth/2)
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

    // Left Panoramic Window Frame
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

    // Window sill
    const sillGeo = new THREE.BoxGeometry(0.3, 0.1, roomHeight * 0.48);
    const sill = new THREE.Mesh(sillGeo, windowFrameMat);
    sill.position.set(-roomWidth / 2, wallHeight * 0.22, roomHeight * 0.15);
    roomGroup.add(sill);

    // 4. RIGHT WALL WITH ENTRANCE DOOR (X = roomWidth/2)
    const rightWallGeo = new THREE.BoxGeometry(wallThick, wallHeight, roomHeight * 0.6);
    const rightWall = new THREE.Mesh(rightWallGeo, [
      wallMat, exteriorWallMat, exteriorWallMat, exteriorWallMat,
      exteriorWallMat, exteriorWallMat
    ]);
    rightWall.position.set(roomWidth / 2, wallHeight / 2, -roomHeight * 0.2);
    rightWall.receiveShadow = true;
    rightWall.castShadow = true;
    roomGroup.add(rightWall);

    // Wooden Entrance Door Frame
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const doorWoodMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.6 });
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 1.2), doorWoodMat);
    doorPanel.position.set(roomWidth / 2, 1.1, roomHeight * 0.25);
    doorPanel.castShadow = true;
    roomGroup.add(doorPanel);

    // Metallic Door Handle
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.8, roughness: 0.2 });
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.4, 0.05), handleMat);
    handle.position.set(roomWidth / 2 - 0.05, 1.05, roomHeight * 0.25 - 0.45);
    roomGroup.add(handle);

    // 5. OPEN FRONT CUTAWAY (Front wall removed for 3D Isometric View)
    const frontBaseGeo = new THREE.BoxGeometry(roomWidth + wallThick, 0.15, wallThick);
    const frontBase = new THREE.Mesh(frontBaseGeo, exteriorWallMat);
    frontBase.position.set(0, 0.075, roomHeight / 2);
    roomGroup.add(frontBase);

    scene.add(roomGroup);
  }, [roomWidth, roomHeight, selectedFloorMaterial, selectedWallpaper, blueprintUrl, blueprintOpacity, createFloorTexture, getWallpaperColor]);

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
  const setCameraView = (viewType) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const maxDim = Math.max(roomWidth, roomHeight);

    if (viewType === 'iso') {
      // 45-degree Isometric View (Homestyler style) - raised target to keep whole venue centered
      camera.position.set(maxDim * 1.38, maxDim * 1.56, maxDim * 1.56);
      controls.target.set(0, -0.22, 0.65);
    } else if (viewType === 'top') {
      // Top-Down 2D Blueprint angle
      camera.position.set(0, maxDim * 1.85, 0.01);
      controls.target.set(0, 0, 0);
    } else if (viewType === 'front') {
      // Front Eye-Level Angle
      camera.position.set(0, 2.2, maxDim * 1.5);
      controls.target.set(0, 0.7, 0);
    }
    controls.update();
  };

  const handleZoom = (delta) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    camera.position.multiplyScalar(delta > 0 ? 0.85 : 1.15);
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
            <span>3D ISOMETRIC STUDIO</span>
          </span>
          <span className="studio-info-text">
            ขนาดร้าน: {roomWidth} x {roomHeight} ม. ({roomWidth * roomHeight} ตร.ม.)
          </span>
        </div>

        {/* Camera Views Selector */}
        <div className="camera-view-btns">
          <button 
            className="btn-cam-view active" 
            onClick={() => setCameraView('iso')}
            title="มุมมอง 3D Isometric (สไตล์ตัวอย่าง)"
          >
            <Eye size={15} />
            <span>3D Isometric (45°)</span>
          </button>
          <button 
            className="btn-cam-view" 
            onClick={() => setCameraView('top')}
            title="มุมมองแปลนด้านบน (Top-Down)"
          >
            <Layers size={15} />
            <span>Top-Down (แปลน)</span>
          </button>
          <button 
            className="btn-cam-view" 
            onClick={() => setCameraView('front')}
            title="มุมมองสายตาคน (Eye Level)"
          >
            <Maximize2 size={15} />
            <span>Front View</span>
          </button>
          <div className="cam-zoom-divider"></div>
          <button className="btn-cam-mini" onClick={() => handleZoom(1)} title="ซูมเข้า">
            <ZoomIn size={15} />
          </button>
          <button className="btn-cam-mini" onClick={() => handleZoom(-1)} title="ซูมออก">
            <ZoomOut size={15} />
          </button>
          <button 
            type="button" 
            className="btn-cam-mini btn-export-3d-shot"
            onClick={handleExport3DSnapshot}
            title="บันทึกภาพเรนเดอร์ 3D (PNG)"
          >
            <Camera size={15} />
            <span>ภาพ 3D</span>
          </button>
        </div>
      </div>

      {/* Main 3D WebGL Canvas */}
      <div 
        className="three-canvas-container" 
        ref={containerRef}
        onPointerDown={handlePointerDown}
      >
        {/* Prominent Fullscreen / Zen Mode Toggle Button at Bottom-Right of 3D Canvas */}
        <button 
          type="button"
          id="btn-3d-floating-fullscreen"
          className={`floating-3d-fullscreen-btn ${isPlannerFullscreen ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFullscreen();
          }} 
          title={isPlannerFullscreen ? 'ออกจากโหมดเต็มจอ (กด ESC ได้)' : 'เปิดสตูดิโอ 3D เต็มจอ (Zen Mode)'}
        >
          {isPlannerFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          <span>{isPlannerFullscreen ? 'ย่อหน้าต่าง (ESC)' : 'ขยายเต็มจอ'}</span>
        </button>
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
