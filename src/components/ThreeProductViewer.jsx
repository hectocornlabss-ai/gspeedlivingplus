import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { 
  Camera, Download, RotateCw, Eye, Compass, 
  ZoomIn, ZoomOut, Check, Sparkles, RefreshCw, 
  Sun, Moon, Layers, Maximize2
} from 'lucide-react';
import { downloadFile } from '../utils/fileDownloader';

export default function ThreeProductViewer({
  item,
  autoRotateDefault = true,
  height = '360px',
  showControls = true,
  onCapture = null,
  onSetAsImage = null,
  className = ''
}) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const modelGroupRef = useRef(null);
  const lightsGroupRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  const [isAutoRotate, setIsAutoRotate] = useState(autoRotateDefault);
  const [bgMode, setBgMode] = useState('studio'); // 'studio' (#f8fafc), 'dark' (#0a0f1d), 'transparent'
  const [capturedFeedback, setCapturedFeedback] = useState(false);
  const [setAsImageFeedback, setSetAsImageFeedback] = useState(false);

  // Procedural Glowing Gaming Screen Texture
  const createScreenTexture = useCallback((accentHex = '#38bdf8') => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 288;
    const ctx = canvas.getContext('2d');

    // Gradient dark sci-fi background
    const grad = ctx.createLinearGradient(0, 0, 512, 288);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 288);

    // Glowing futuristic lines & HUD
    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(30, 220);
    ctx.lineTo(160, 90);
    ctx.lineTo(310, 140);
    ctx.lineTo(470, 40);
    ctx.stroke();

    // Secondary accent wave
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(40, 240);
    ctx.lineTo(200, 180);
    ctx.lineTo(360, 210);
    ctx.lineTo(480, 120);
    ctx.stroke();

    // HUD Tech Crosshair
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(226, 114, 60, 60);
    ctx.beginPath();
    ctx.moveTo(256, 100); ctx.lineTo(256, 188);
    ctx.moveTo(212, 144); ctx.lineTo(300, 144);
    ctx.stroke();

    // Text Watermark
    ctx.fillStyle = accentHex;
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('G-SPEED 360Hz PRO ARENA', 40, 50);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Initialize Three.js Scene, Camera, Renderer & OrbitControls
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const hNum = parseInt(height, 10) || 360;

    // 1. Scene
    const scene = new THREE.Scene();
    if (bgMode === 'studio') {
      scene.background = new THREE.Color(0xf8fafc);
    } else if (bgMode === 'dark') {
      scene.background = new THREE.Color(0x0a0f1d);
    } else {
      scene.background = null;
    }
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / hNum, 0.1, 100);
    camera.position.set(4.2, 3.2, 4.2);
    cameraRef.current = camera;

    // 3. Renderer with preserveDrawingBuffer for high-res PNG export
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, hNum);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't clip beneath floor
    controls.minDistance = 1.2;
    controls.maxDistance = 20;
    controls.target.set(0, 0.7, 0);
    controlsRef.current = controls;

    // 5. Studio Lighting
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;

    const ambientLight = new THREE.AmbientLight(
      bgMode === 'dark' ? 0x1e293b : 0xffffff,
      bgMode === 'dark' ? 0.9 : 1.1
    );
    lightsGroup.add(ambientLight);

    const keySun = new THREE.DirectionalLight(0xffffff, 1.4);
    keySun.position.set(6, 9, 6);
    keySun.castShadow = true;
    keySun.shadow.mapSize.width = 1024;
    keySun.shadow.mapSize.height = 1024;
    keySun.shadow.camera.near = 0.5;
    keySun.shadow.camera.far = 25;
    keySun.shadow.bias = -0.0004;
    lightsGroup.add(keySun);

    const softFill = new THREE.DirectionalLight(0xdbeafe, 0.6);
    softFill.position.set(-6, 4, -4);
    lightsGroup.add(softFill);

    const accentRim = new THREE.DirectionalLight(0x38bdf8, 0.8);
    accentRim.position.set(0, 5, -6);
    lightsGroup.add(accentRim);

    scene.add(lightsGroup);

    // 6. Circular Studio Pedestal Platform
    const pedestalGeo = new THREE.CylinderGeometry(4.5, 4.8, 0.12, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: bgMode === 'dark' ? 0x111827 : 0xffffff,
      roughness: 0.4,
      metalness: 0.08
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, -0.06, 0);
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Studio Grid Ring Accent
    const ringGeo = new THREE.RingGeometry(3.6, 3.65, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: bgMode === 'dark' ? 0x38bdf8 : 0x1d4ed8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 0.002, 0);
    scene.add(ring);

    // 7. Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (isAutoRotate && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += 0.006;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || hNum;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      controls.dispose();
      renderer.dispose();
    };
  }, [bgMode, height]);

  // Handle Background Mode Switch in runtime
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (bgMode === 'studio') {
      scene.background = new THREE.Color(0xf8fafc);
    } else if (bgMode === 'dark') {
      scene.background = new THREE.Color(0x0a0f1d);
    } else {
      scene.background = null;
    }
  }, [bgMode]);

  // Build / Update 3D Geometry when `item` or its properties change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !item) return;

    // Remove existing model if any
    if (modelGroupRef.current) {
      scene.remove(modelGroupRef.current);
    }

    const group = new THREE.Group();
    modelGroupRef.current = group;

    // Check if custom uploaded 3D model (GLB / GLTF) is provided
    if (item.model3DUrl) {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        item.model3DUrl,
        (gltf) => {
          const customModel = gltf.scene;
          const box = new THREE.Box3().setFromObject(customModel);
          const size = new THREE.Vector3();
          box.getSize(size);
          const center = new THREE.Vector3();
          box.getCenter(center);

          customModel.position.x -= center.x;
          customModel.position.y -= box.min.y;
          customModel.position.z -= center.z;

          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const targetScale = 2.4 / maxDim;
            customModel.scale.setScalar(targetScale);
          }

          customModel.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          group.add(customModel);
          scene.add(group);
        },
        undefined,
        (err) => {
          console.warn('Could not load custom 3D GLTF model, falling back to procedural model:', err);
        }
      );
      // Wait for GLTF or continue if fails
    }

    // Colors & Materials
    const deskHex = item.deskColor || item.color || '#0f172a';
    const accentHex = item.accentColor || '#1d4ed8';
    const chairHex = item.chairColor || '#0f172a';

    const deskColor = new THREE.Color(deskHex);
    const accentColor = new THREE.Color(accentHex);
    const chairColor = new THREE.Color(chairHex);

    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.25 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9, roughness: 0.15 });
    const deskTopMat = new THREE.MeshStandardMaterial({ color: deskColor, roughness: 0.35, metalness: 0.12 });

    // Apply real image / desk texture if provided
    const targetTextureUrl = item.deskTextureUrl || item.textureUrl || 
      (typeof item.image === 'string' && (item.image.startsWith('data:image') || item.image.startsWith('blob:') || item.image.includes('texture')) ? item.image : null);

    if (targetTextureUrl) {
      const texLoader = new THREE.TextureLoader();
      texLoader.load(targetTextureUrl, (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        deskTopMat.color.setHex(0xffffff); // Prevent dark color tinting so uploaded photo texture renders in true color
        deskTopMat.map = tex;
        deskTopMat.needsUpdate = true;
      });
    }

    const ledGlowMat = new THREE.MeshBasicMaterial({ color: accentColor });
    const dividerMat = new THREE.MeshStandardMaterial({ color: accentColor, transparent: true, opacity: 0.75, roughness: 0.2 });

    const screenTex = createScreenTexture(accentHex);
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTex,
      emissive: accentColor,
      emissiveMap: screenTex,
      emissiveIntensity: 0.75,
      roughness: 0.2
    });
    const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3, metalness: 0.5 });
    const chairMat = new THREE.MeshStandardMaterial({ color: chairColor, roughness: 0.5 });
    const chairStripeMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.4 });

    // Helper: Build Ergonomic Racing Chair
    const addChair = (x, z, rotY = 0) => {
      const chairGroup = new THREE.Group();
      chairGroup.position.set(x, 0, z);
      chairGroup.rotation.y = rotY;

      // 5-star chrome base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.05, 5), chromeMat);
      base.position.y = 0.08;
      chairGroup.add(base);

      // Hydraulic pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.38, 8), chromeMat);
      pole.position.y = 0.25;
      chairGroup.add(pole);

      // Seat cushion
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.52), chairMat);
      seat.position.y = 0.48;
      seat.castShadow = true;
      chairGroup.add(seat);

      // Racing bolsters (side wings)
      const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.5), chairStripeMat);
      wingL.position.set(-0.24, 0.52, 0);
      const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.5), chairStripeMat);
      wingR.position.set(0.24, 0.52, 0);
      chairGroup.add(wingL);
      chairGroup.add(wingR);

      // Curved Backrest
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.72, 0.08), chairMat);
      back.position.set(0, 0.86, -0.22);
      back.castShadow = true;
      chairGroup.add(back);

      // Center Racing Stripe
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.68, 0.09), chairStripeMat);
      stripe.position.set(0, 0.86, -0.218);
      chairGroup.add(stripe);

      // Ergonomic Headrest Pillow
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.09), chairStripeMat);
      pillow.position.set(0, 1.15, -0.18);
      chairGroup.add(pillow);

      // Armrests
      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.28), metalMat);
      armL.position.set(-0.29, 0.62, 0);
      const armR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.28), metalMat);
      armR.position.set(0.29, 0.62, 0);
      chairGroup.add(armL);
      chairGroup.add(armR);

      group.add(chairGroup);
    };

    // Helper: Build Esports Monitor, RGB mechanical keyboard & mouse
    const addMonitor = (x, z) => {
      // Monitor Stand
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.18), metalMat);
      stand.position.set(x, 0.73, z - 0.04);
      group.add(stand);

      const pole = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.06), chromeMat);
      pole.position.set(x, 0.89, z - 0.06);
      group.add(pole);

      // Screen Frame
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.44, 0.03), screenFrameMat);
      frame.position.set(x, 1.06, z + 0.02);
      frame.castShadow = true;
      group.add(frame);

      // Glowing Game Screen
      const display = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.4), screenMat);
      display.position.set(x, 1.06, z + 0.038);
      group.add(display);

      // Extended Esports Desk Mousepad
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.008, 0.35), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 }));
      pad.position.set(x, 0.724, z + 0.24);
      group.add(pad);

      // RGB Mechanical Keyboard
      const kb = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.018, 0.16), metalMat);
      kb.position.set(x - 0.1, 0.735, z + 0.26);
      group.add(kb);

      const kbGlow = new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.006, 0.17), ledGlowMat);
      kbGlow.position.set(x - 0.1, 0.728, z + 0.26);
      group.add(kbGlow);

      // Gaming Mouse
      const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.022, 0.11), screenFrameMat);
      mouse.position.set(x + 0.22, 0.735, z + 0.26);
      group.add(mouse);
    };

    const type = item.type || '';
    const widthMeters = parseFloat(item.widthMeters) || 2.4;
    const depthMeters = parseFloat(item.depth3D || item.heightMeters) || 1.0;
    const seats = parseInt(item.seats, 10) || 2;

    // BUILD SPECIFIC PRODUCT ARCHITECTURE ACCORDING TO ITEM TYPE
    if (type === 'pc-row-2' || (item.category === 'stations' && seats === 2)) {
      // 2-Station Desk Table
      const desk = new THREE.Mesh(new THREE.BoxGeometry(widthMeters, 0.06, depthMeters * 0.9), deskTopMat);
      desk.position.set(0, 0.72, 0);
      desk.castShadow = true;
      group.add(desk);

      // Tabletop LED Edge strip
      const ledEdge = new THREE.Mesh(new THREE.BoxGeometry(widthMeters + 0.02, 0.02, 0.02), ledGlowMat);
      ledEdge.position.set(0, 0.71, depthMeters * 0.45);
      group.add(ledEdge);

      // 4 Steel Legs
      const halfW = (widthMeters / 2) - 0.1;
      const halfD = (depthMeters * 0.45) - 0.06;
      [[-halfW, -halfD], [halfW, -halfD], [-halfW, halfD], [halfW, halfD]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.72, 8), metalMat);
        leg.position.set(lx, 0.36, lz);
        group.add(leg);
      });

      // Divider Panel
      const div = new THREE.Mesh(new THREE.BoxGeometry(widthMeters * 0.95, 0.32, 0.03), dividerMat);
      div.position.set(0, 0.9, -depthMeters * 0.42);
      group.add(div);

      // 2 Monitors & 2 Chairs
      addMonitor(-widthMeters * 0.25, -depthMeters * 0.15);
      addMonitor(widthMeters * 0.25, -depthMeters * 0.15);

      addChair(-widthMeters * 0.25, depthMeters * 0.45, 0);
      addChair(widthMeters * 0.25, depthMeters * 0.45, 0);

    } else if (type === 'pc-row-4' || (item.category === 'stations' && seats === 4)) {
      // 4-Station Quad Table
      const desk = new THREE.Mesh(new THREE.BoxGeometry(widthMeters, 0.06, depthMeters * 0.9), deskTopMat);
      desk.position.set(0, 0.72, 0);
      desk.castShadow = true;
      group.add(desk);

      // 4 Stations
      const step = widthMeters / 4;
      const startX = -widthMeters / 2 + step / 2;
      for (let i = 0; i < 4; i++) {
        const px = startX + (i * step);
        addMonitor(px, -depthMeters * 0.15);
        addChair(px, depthMeters * 0.45, 0);
      }

      // Divider & LED Strips
      const div = new THREE.Mesh(new THREE.BoxGeometry(widthMeters * 0.98, 0.32, 0.03), dividerMat);
      div.position.set(0, 0.9, -depthMeters * 0.42);
      group.add(div);

      // Steel Support Frame
      for (let x = -widthMeters / 2 + 0.1; x <= widthMeters / 2; x += step) {
        const legF = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.72, 8), metalMat);
        legF.position.set(x, 0.36, depthMeters * 0.38);
        const legB = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.72, 8), metalMat);
        legB.position.set(x, 0.36, -depthMeters * 0.38);
        group.add(legF);
        group.add(legB);
      }

    } else if (type === 'pc-island-6' || (item.category === 'stations' && seats === 6)) {
      // 6-Player Hex Island (3v3 back-to-back)
      const deskFront = new THREE.Mesh(new THREE.BoxGeometry(widthMeters, 0.06, depthMeters * 0.45), deskTopMat);
      deskFront.position.set(0, 0.72, depthMeters * 0.24);
      group.add(deskFront);

      const deskBack = new THREE.Mesh(new THREE.BoxGeometry(widthMeters, 0.06, depthMeters * 0.45), deskTopMat);
      deskBack.position.set(0, 0.72, -depthMeters * 0.24);
      group.add(deskBack);

      // Center Cable Duct / RGB Spine
      const spine = new THREE.Mesh(new THREE.BoxGeometry(widthMeters, 0.4, 0.1), dividerMat);
      spine.position.set(0, 0.9, 0);
      group.add(spine);

      // 3 Front, 3 Back
      const step = widthMeters / 3;
      const startX = -widthMeters / 2 + step / 2;
      for (let i = 0; i < 3; i++) {
        const px = startX + (i * step);
        addMonitor(px, 0.1);
        addChair(px, depthMeters * 0.55, 0);

        // Back row
        addChair(px, -depthMeters * 0.55, Math.PI);
      }

    } else if (type === 'vip-room-5' || item.category === 'vip') {
      // VIP Private Suite Enclosure
      const roomBase = new THREE.Mesh(new THREE.BoxGeometry(widthMeters, 0.08, depthMeters), deskTopMat);
      roomBase.position.set(0, 0.04, 0);
      group.add(roomBase);

      // Glass Walls (Translucent luxury blue)
      const glassMat = new THREE.MeshStandardMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.25,
        roughness: 0.1
      });
      const wallBack = new THREE.Mesh(new THREE.BoxGeometry(widthMeters, 2.2, 0.08), glassMat);
      wallBack.position.set(0, 1.14, -depthMeters / 2);
      group.add(wallBack);

      const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.2, depthMeters), glassMat);
      wallLeft.position.set(-widthMeters / 2, 1.14, 0);
      group.add(wallLeft);

      // Curved Streamer Desk
      const desk = new THREE.Mesh(new THREE.BoxGeometry(widthMeters * 0.85, 0.06, 0.9), deskTopMat);
      desk.position.set(0, 0.72, -depthMeters * 0.15);
      group.add(desk);

      // 5 Stations inside VIP
      const step = (widthMeters * 0.8) / 5;
      const startX = -(widthMeters * 0.8) / 2 + step / 2;
      for (let i = 0; i < 5; i++) {
        const px = startX + (i * step);
        addMonitor(px, -depthMeters * 0.2);
        addChair(px, depthMeters * 0.2, 0);
      }

    } else if (type === 'stage-5v5' || item.category === 'stage') {
      // 5v5 Tournament Stage Platform
      const stagePlat = new THREE.Mesh(new THREE.BoxGeometry(widthMeters, 0.35, depthMeters), deskTopMat);
      stagePlat.position.set(0, 0.175, 0);
      group.add(stagePlat);

      // Stage LED Glow Base
      const stageGlow = new THREE.Mesh(new THREE.BoxGeometry(widthMeters + 0.06, 0.04, depthMeters + 0.06), ledGlowMat);
      stageGlow.position.set(0, 0.34, 0);
      group.add(stageGlow);

      // Team Left Desk (5 players)
      const deskL = new THREE.Mesh(new THREE.BoxGeometry(widthMeters * 0.42, 0.06, 0.85), deskTopMat);
      deskL.position.set(-widthMeters * 0.25, 0.72 + 0.35, 0);
      group.add(deskL);

      // Team Right Desk (5 players)
      const deskR = new THREE.Mesh(new THREE.BoxGeometry(widthMeters * 0.42, 0.06, 0.85), deskTopMat);
      deskR.position.set(widthMeters * 0.25, 0.72 + 0.35, 0);
      group.add(deskR);

      // Backdrop LED Wall
      const ledWall = new THREE.Mesh(new THREE.BoxGeometry(widthMeters * 0.95, 2.0, 0.1), screenMat);
      ledWall.position.set(0, 1.4 + 0.35, -depthMeters * 0.45);
      group.add(ledWall);

      // Add 10 Stage Monitors & Chairs
      for (let i = 0; i < 5; i++) {
        const xL = -widthMeters * 0.42 + (i * 0.75);
        addMonitor(xL, -depthMeters * 0.05);
        addChair(xL, depthMeters * 0.35, 0);

        const xR = widthMeters * 0.12 + (i * 0.75);
        addMonitor(xR, -depthMeters * 0.05);
        addChair(xR, depthMeters * 0.35, 0);
      }

    } else if (type === 'cashier-counter' || type === 'cafe-bar') {
      // Counter Reception / Cafe Bar
      const counterBase = new THREE.Mesh(new THREE.BoxGeometry(widthMeters, 1.1, depthMeters * 0.7), metalMat);
      counterBase.position.set(0, 0.55, 0);
      group.add(counterBase);

      // Stone Counter Top
      const topStone = new THREE.Mesh(new THREE.BoxGeometry(widthMeters + 0.1, 0.08, depthMeters * 0.75), deskTopMat);
      topStone.position.set(0, 1.14, 0);
      topStone.castShadow = true;
      group.add(topStone);

      // Front Accent LED Strip
      const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(widthMeters + 0.08, 0.04, 0.02), ledGlowMat);
      ledStrip.position.set(0, 1.05, depthMeters * 0.38);
      group.add(ledStrip);

      // POS Display / Register
      addMonitor(0, 0.1);

    } else if (type === 'server-room') {
      // 42U Server Rack Enclosure
      const rack = new THREE.Mesh(new THREE.BoxGeometry(widthMeters * 0.8, 2.0, depthMeters * 0.8), deskTopMat);
      rack.position.set(0, 1.0, 0);
      group.add(rack);

      // Server LED Activity Array
      for (let y = 0.3; y < 1.8; y += 0.15) {
        const serverFace = new THREE.Mesh(new THREE.BoxGeometry(widthMeters * 0.75, 0.1, 0.02), metalMat);
        serverFace.position.set(0, y, depthMeters * 0.41);
        group.add(serverFace);

        const blinker = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), ledGlowMat);
        blinker.position.set(widthMeters * 0.3, y, depthMeters * 0.425);
        group.add(blinker);
      }

    } else if (type === 'lounge-sofa') {
      // Spectator Lounge Sofa
      const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(widthMeters, 0.4, depthMeters * 0.8), chairMat);
      seatMesh.position.set(0, 0.25, 0);
      group.add(seatMesh);

      const backMesh = new THREE.Mesh(new THREE.BoxGeometry(widthMeters, 0.5, 0.25), chairMat);
      backMesh.position.set(0, 0.65, -depthMeters * 0.3);
      group.add(backMesh);

      // Coffee Table in front
      const table = new THREE.Mesh(new THREE.BoxGeometry(widthMeters * 0.6, 0.3, 0.5), metalMat);
      table.position.set(0, 0.15, depthMeters * 0.55);
      group.add(table);

    } else {
      // Generic Adaptive Modular Desk Table
      const desk = new THREE.Mesh(new THREE.BoxGeometry(widthMeters, 0.06, depthMeters), deskTopMat);
      desk.position.set(0, 0.72, 0);
      desk.castShadow = true;
      group.add(desk);

      // LED Trim
      const ledTrim = new THREE.Mesh(new THREE.BoxGeometry(widthMeters + 0.02, 0.02, 0.02), ledGlowMat);
      ledTrim.position.set(0, 0.71, depthMeters / 2);
      group.add(ledTrim);

      // Legs
      [
        [-widthMeters / 2 + 0.1, -depthMeters / 2 + 0.1],
        [widthMeters / 2 - 0.1, -depthMeters / 2 + 0.1],
        [-widthMeters / 2 + 0.1, depthMeters / 2 - 0.1],
        [widthMeters / 2 - 0.1, depthMeters / 2 - 0.1]
      ].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.72, 8), metalMat);
        leg.position.set(lx, 0.36, lz);
        group.add(leg);
      });

      // Add Seats
      const nSeats = Math.max(1, seats);
      const step = widthMeters / nSeats;
      const startX = -widthMeters / 2 + step / 2;
      for (let i = 0; i < nSeats; i++) {
        const px = startX + (i * step);
        addMonitor(px, -depthMeters * 0.15);
        addChair(px, depthMeters * 0.45, 0);
      }
    }

    scene.add(group);

    // Auto-frame camera based on item dimensions
    const maxDimension = Math.max(widthMeters, depthMeters, 2.0);
    const camera = cameraRef.current;
    if (camera) {
      camera.position.set(maxDimension * 1.3, maxDimension * 0.95, maxDimension * 1.3);
      camera.lookAt(0, 0.7, 0);
    }
  }, [item, createScreenTexture]);

  // Export 3D Snapshot PNG Handler
  const handleExportSnapshot = () => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;

    // Render frame
    renderer.render(scene, camera);
    const dataUrl = renderer.domElement.toDataURL('image/png');

    // Trigger file download with guaranteed filename and .png extension
    const safeName = (item?.type || 'model').replace(/[^a-z0-9_-]/gi, '-');
    const filename = `gspeed-${safeName}-3d-render.png`;
    downloadFile(renderer.domElement, filename, 'image/png');

    setCapturedFeedback(true);
    setTimeout(() => setCapturedFeedback(false), 2200);

    if (onCapture) onCapture(dataUrl);
  };

  // Set Current 3D View directly as Module Cover Image
  const handleSetAsCover = () => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;

    renderer.render(scene, camera);
    const dataUrl = renderer.domElement.toDataURL('image/png');

    if (onSetAsImage) onSetAsImage(dataUrl);

    setSetAsImageFeedback(true);
    setTimeout(() => setSetAsImageFeedback(false), 2200);
  };

  // Preset Camera Angles
  const setCameraAngle = (view) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls || !item) return;

    const maxDim = Math.max(parseFloat(item.widthMeters) || 2.4, 2.0);
    if (view === 'iso') {
      camera.position.set(maxDim * 1.3, maxDim * 1.0, maxDim * 1.3);
    } else if (view === 'front') {
      camera.position.set(0, 1.2, maxDim * 1.7);
    } else if (view === 'top') {
      camera.position.set(0, maxDim * 2.2, 0.01);
    } else if (view === 'side') {
      camera.position.set(maxDim * 1.7, 1.2, 0);
    }
    controls.target.set(0, 0.7, 0);
    controls.update();
  };

  return (
    <div className={`three-product-viewer-container ${className}`}>
      {/* 3D WebGL Canvas Mount */}
      <div 
        ref={mountRef} 
        className="three-canvas-mount"
        style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }}
      />

      {/* 3D Studio Bottom Controls Bar - Situated cleanly below the 3D canvas */}
      {showControls && (
        <div className="three-bottom-controls-bar">
          <div className="controls-group-left">
            <button
              type="button"
              className={`btn-studio-tool ${isAutoRotate ? 'active' : ''}`}
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              title={isAutoRotate ? 'หยุดหมุน 3D อัตโนมัติ' : 'เปิดหมุน 3D อัตโนมัติ'}
            >
              <RotateCw size={13} className={isAutoRotate ? 'spin-icon' : ''} />
              <span>{isAutoRotate ? 'หมุน 3D' : 'หยุดหมุน'}</span>
            </button>

            <div className="view-angle-btns">
              <button 
                type="button" 
                className="btn-studio-pill" 
                onClick={() => setCameraAngle('iso')}
                title="มุมมองไอโซเมตริก 45°"
              >
                <span>ISO</span>
              </button>
              <button 
                type="button" 
                className="btn-studio-pill" 
                onClick={() => setCameraAngle('front')}
                title="มุมมองด้านหน้าตรง"
              >
                <span>หน้า</span>
              </button>
              <button 
                type="button" 
                className="btn-studio-pill" 
                onClick={() => setCameraAngle('top')}
                title="มุมมองจากด้านบนแปลน"
              >
                <span>บน</span>
              </button>
              <button 
                type="button" 
                className="btn-studio-pill" 
                onClick={() => setCameraAngle('side')}
                title="มุมมองด้านข้าง"
              >
                <span>ข้าง</span>
              </button>
            </div>

            <button
              type="button"
              className="btn-studio-tool"
              onClick={() => {
                if (bgMode === 'studio') setBgMode('dark');
                else if (bgMode === 'dark') setBgMode('transparent');
                else setBgMode('studio');
              }}
              title="สลับพื้นหลัง (ขาวสตูดิโอ / มืดนีออน / โปร่งแสง)"
            >
              {bgMode === 'dark' ? <Moon size={13} /> : <Sun size={13} />}
              <span>{bgMode === 'dark' ? 'มืด' : bgMode === 'transparent' ? 'โปร่ง' : 'สตูดิโอ'}</span>
            </button>
          </div>

          <div className="controls-group-right">
            {onSetAsImage && (
              <button
                type="button"
                className={`btn-studio-action set-cover ${setAsImageFeedback ? 'success' : ''}`}
                onClick={handleSetAsCover}
                title="นำภาพมุมมอง 3D ปัจจุบันไปเป็นภาพหน้าปกโมดูล"
              >
                {setAsImageFeedback ? <Check size={13} /> : <Sparkles size={13} />}
                <span>{setAsImageFeedback ? 'บันทึกเป็นภาพปกแล้ว' : 'ใช้เป็นภาพปก'}</span>
              </button>
            )}

            <button
              type="button"
              id="btn-export-3d-png"
              className={`btn-studio-action export-png ${capturedFeedback ? 'success' : ''}`}
              onClick={handleExportSnapshot}
              title="ดาวน์โหลดภาพเรนเดอร์ 3 มิติเป็นไฟล์ PNG คมชัดสูง"
            >
              {capturedFeedback ? <Check size={13} /> : <Download size={13} />}
              <span>{capturedFeedback ? 'ดาวน์โหลดแล้ว' : 'ส่งออกภาพ 3D'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
