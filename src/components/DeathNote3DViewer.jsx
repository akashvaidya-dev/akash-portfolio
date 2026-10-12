import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { bugCases } from '../data/bugs';
import {
  createCoverTexture,
  createInsideCoverTexture,
  createRulesTexturePart1,
  createRulesTexturePart2,
  createCaseLeftPageTexture,
  createCaseRightPageTexture,
  createBackCoverTexture,
} from '../utils/deathNoteTextures';

/**
 * Animated 3D Book Slider based on pakagronglb/animated-book-slider-threejs
 * Realistic Death Note skinning, bone bending page-turning curves, and interactive 3D physics.
 * Configured with free OrbitControls zoom/pan and stable Three.js lifecycle to prevent loop resets.
 */

const insideCurveStrength = 0.18;
const outsideCurveStrength = 0.05;
const turningCurveStrength = 0.09;

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 28;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

function checkWebGLSupport() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function DeathNote3DViewer({
  currentPage = 0,
  onPageChange,
  onInspectCase,
}) {
  const mountRef = useRef(null);
  const fallbackCanvasRef = useRef(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(checkWebGLSupport);
  const [internalPage, setInternalPage] = useState(currentPage);
  const activePage = onPageChange ? currentPage : internalPage;
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // References for Three.js state
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const pagesDataRef = useRef([]);
  const bookGroupRef = useRef(null);
  const delayedPageRef = useRef(currentPage || 0);
  const targetPageRef = useRef(currentPage || 0);
  const turnedAtRef = useRef({});
  const lastOpenedRef = useRef({});
  const animationFrameIdRef = useRef(null);
  const audioRef = useRef(null);

  // Keep callback refs stable across parent re-renders
  const onPageChangeRef = useRef(onPageChange);
  useEffect(() => {
    onPageChangeRef.current = onPageChange;
  }, [onPageChange]);

  const soundEnabledRef = useRef(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Sync external page changes into targetPageRef without remounting Three.js
  useEffect(() => {
    const clamped = Math.max(0, Math.min(currentPage, 8));
    targetPageRef.current = clamped;
  }, [currentPage]);

  // Audio effect player
  const playFlipSound = useCallback(() => {
    if (!soundEnabledRef.current) return;
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/audios/page-flip.mp3');
        audioRef.current.volume = 0.35;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {
      // Audio autoplay restrictions fallback
    }
  }, []);

  // Stable change page handler
  const setPage = useCallback((nextPage) => {
    const clamped = Math.max(0, Math.min(nextPage, 8));
    targetPageRef.current = clamped;
    if (onPageChangeRef.current) {
      onPageChangeRef.current(clamped);
    } else {
      setInternalPage(clamped);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setPage(targetPageRef.current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setPage(targetPageRef.current - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setPage]);

  // Three.js Mount Lifecycle (Runs once to preserve camera and state)
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !isWebGLSupported) return;

    // Dimensions
    const width = container.clientWidth || 960;
    const height = container.clientHeight || 620;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(-0.35, 1.25, 4.3);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Create Renderer safely
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch {
      setTimeout(() => setIsWebGLSupported(false), 0);
      return;
    }

    // 4. OrbitControls: Fully free zoom, pan, and rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.0;
    // Allow generous close-up and far zoom so user can zoom as much as they want
    controls.minDistance = 0.4;
    controls.maxDistance = 25.0;
    // Allow panning freely
    controls.enablePan = true;
    controls.panSpeed = 1.0;
    // Full angular range
    controls.maxPolarAngle = Math.PI - 0.02;
    controls.minPolarAngle = 0.02;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    dirLight.position.set(2.8, 6.5, 3.8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 15;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xef4444, 0.6, 6);
    pointLight.position.set(-2, 1.8, 1);
    scene.add(pointLight);

    // 6. Floor shadow receiver
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.22 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.35;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 7. Skinned Page Geometry Creation
    const pageGeometry = new THREE.BoxGeometry(
      PAGE_WIDTH,
      PAGE_HEIGHT,
      PAGE_DEPTH,
      PAGE_SEGMENTS,
      2
    );
    pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

    const position = pageGeometry.attributes.position;
    const vertex = new THREE.Vector3();
    const skinIndexes = [];
    const skinWeights = [];

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);
      const x = vertex.x;
      const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
      const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;
      skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
      skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
    }

    pageGeometry.setAttribute(
      'skinIndex',
      new THREE.Uint16BufferAttribute(skinIndexes, 4)
    );
    pageGeometry.setAttribute(
      'skinWeight',
      new THREE.Float32BufferAttribute(skinWeights, 4)
    );

    // 8. Generate Procedural Textures for Death Note Leaves
    const textures = [
      // Page 0: Front Cover & Inside Cover
      { front: createCoverTexture(), back: createInsideCoverTexture(), isCover: true },
      // Page 1: How To Use It (Rules Spread 1 & 2)
      { front: createRulesTexturePart1(), back: createRulesTexturePart2() },
      // Page 2: Case #001 (Zombie Intersection Observer)
      { front: createCaseLeftPageTexture(bugCases[0]), back: createCaseRightPageTexture(bugCases[0]) },
      // Page 3: Case #002 (Silent Print Spooler Deadlock)
      { front: createCaseLeftPageTexture(bugCases[1]), back: createCaseRightPageTexture(bugCases[1]) },
      // Page 4: Case #003 (Phantom IndexedDB Mutex Lock)
      { front: createCaseLeftPageTexture(bugCases[2]), back: createCaseRightPageTexture(bugCases[2]) },
      // Page 5: Case #004 (Rogue Re-render Cyclone in Chat)
      { front: createCaseLeftPageTexture(bugCases[3]), back: createCaseRightPageTexture(bugCases[3]) },
      // Page 6: Case #005 (The Timezone Ghost in Geofencing)
      { front: createCaseLeftPageTexture(bugCases[4]), back: createCaseRightPageTexture(bugCases[4]) },
      // Page 7: Case #006 (Vanishing Parental Signature)
      { front: createCaseLeftPageTexture(bugCases[5]), back: createCaseRightPageTexture(bugCases[5]) },
      // Page 8: Inside Back Cover & Back Cover
      { front: createInsideCoverTexture(), back: createBackCoverTexture(), isCover: true },
    ];

    // Optional texture roughness loader for realistic leather micro-bumps
    const textureLoader = new THREE.TextureLoader();
    let roughnessMap = null;
    textureLoader.load('/textures/book-cover-roughness.jpg', (tex) => {
      roughnessMap = tex;
      if (pagesDataRef.current[0]) {
        pagesDataRef.current[0].mesh.material[4].roughnessMap = tex;
        pagesDataRef.current[0].mesh.material[4].needsUpdate = true;
      }
      if (pagesDataRef.current[8]) {
        pagesDataRef.current[8].mesh.material[5].roughnessMap = tex;
        pagesDataRef.current[8].mesh.material[5].needsUpdate = true;
      }
    });

    // 9. Instantiate Book Group
    const bookGroup = new THREE.Group();
    bookGroup.rotation.y = -Math.PI / 2;
    scene.add(bookGroup);
    bookGroupRef.current = bookGroup;

    const pageCount = textures.length;
    const pagesData = [];

    // Base paper edge materials
    const paperWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf1ebe1, roughness: 0.85 });
    const spineBlackMat = new THREE.MeshStandardMaterial({ color: 0x090c10, roughness: 0.9 });

    textures.forEach((texData, index) => {
      // Build Bone Skeleton for each page
      const bones = [];
      for (let i = 0; i <= PAGE_SEGMENTS; i++) {
        const bone = new THREE.Bone();
        bones.push(bone);
        if (i === 0) {
          bone.position.x = 0;
        } else {
          bone.position.x = SEGMENT_WIDTH;
        }
        if (i > 0) {
          bones[i - 1].add(bone);
        }
      }
      const skeleton = new THREE.Skeleton(bones);

      // Materials for the 6 faces: [Right, Left/Spine, Top, Bottom, Front, Back]
      const materials = [
        paperWhiteMat,
        spineBlackMat,
        paperWhiteMat,
        paperWhiteMat,
        new THREE.MeshStandardMaterial({
          map: texData.front,
          roughness: texData.isCover ? 0.6 : 0.85,
          roughnessMap: texData.isCover ? roughnessMap : null,
        }),
        new THREE.MeshStandardMaterial({
          map: texData.back,
          roughness: texData.isCover ? 0.6 : 0.85,
          roughnessMap: texData.isCover ? roughnessMap : null,
        }),
      ];

      const mesh = new THREE.SkinnedMesh(pageGeometry, materials);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      mesh.add(skeleton.bones[0]);
      mesh.bind(skeleton);

      const pageGroup = new THREE.Group();
      pageGroup.add(mesh);
      pageGroup.position.z = -index * PAGE_DEPTH;

      bookGroup.add(pageGroup);

      pagesData.push({
        index,
        group: pageGroup,
        mesh,
        skeleton,
        isCover: texData.isCover,
      });

      lastOpenedRef.current[index] = false;
    });

    pagesDataRef.current = pagesData;

    // 10. Click Raycasting to turn pages (distinguishing drag/orbit from a clean click)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isDragging = false;
    let downPos = { x: 0, y: 0 };
    let downTime = 0;

    const handlePointerDown = (e) => {
      downPos = { x: e.clientX, y: e.clientY };
      downTime = Date.now();
      isDragging = false;
    };

    const handlePointerMove = (e) => {
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) {
        isDragging = true;
      }
    };

    const handlePointerUp = (e) => {
      // If the user was dragging/orbiting the camera or holding down, do not turn page
      if (isDragging || Date.now() - downTime > 320) {
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = pagesDataRef.current.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        if (targetPageRef.current === 0) {
          // Closed front cover: clicking opens the notebook
          setPage(1);
        } else if (targetPageRef.current === 8) {
          // Closed back cover: clicking returns to case pages
          setPage(7);
        } else {
          // Open spread: left side turns back, right side turns forward
          if (point.x < 0) {
            setPage(targetPageRef.current - 1);
          } else {
            setPage(targetPageRef.current + 1);
          }
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    domElement.addEventListener('pointermove', handlePointerMove);
    domElement.addEventListener('pointerup', handlePointerUp);

    // 11. Render Animation Loop
    const clock = new THREE.Clock();
    let stepTimer = 0;

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);

      // Controls update for smooth damping
      controls.update();

      // Smooth step towards targetPage without jarring jump
      stepTimer += delta;
      const pageDiff = Math.abs(targetPageRef.current - delayedPageRef.current);
      const stepThreshold = pageDiff > 2 ? 0.05 : 0.16;

      if (stepTimer > stepThreshold) {
        stepTimer = 0;
        if (delayedPageRef.current < targetPageRef.current) {
          delayedPageRef.current += 1;
          playFlipSound();
        } else if (delayedPageRef.current > targetPageRef.current) {
          delayedPageRef.current -= 1;
          playFlipSound();
        }
      }

      const delayedPage = delayedPageRef.current;
      const isBookClosed = delayedPage === 0 || delayedPage === pageCount;

      // Keep book group stationary and stable (no artificial looping floating)
      if (bookGroupRef.current) {
        bookGroupRef.current.position.y = 0;
        bookGroupRef.current.rotation.x = 0;
      }

      // Animate Each Page & Bones
      pagesData.forEach((pData) => {
        const { index, group, skeleton } = pData;
        const opened = delayedPage > index;

        // Position Z stacking adjustment so pages don't clip through
        group.position.z = -index * PAGE_DEPTH + delayedPage * PAGE_DEPTH;

        if (lastOpenedRef.current[index] !== opened) {
          turnedAtRef.current[index] = +new Date();
          lastOpenedRef.current[index] = opened;
        }

        const turnedAt = turnedAtRef.current[index] || 0;
        let turningTime = Math.min(420, new Date() - turnedAt) / 420;
        turningTime = Math.sin(turningTime * Math.PI);

        let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
        if (!isBookClosed) {
          targetRotation += THREE.MathUtils.degToRad(index * 0.85);
        }

        const bones = skeleton.bones;
        for (let i = 0; i < bones.length; i++) {
          const target = i === 0 ? group : bones[i];

          const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
          const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
          const turningIntensity =
            Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

          let rotationAngle =
            insideCurveStrength * insideCurveIntensity * targetRotation -
            outsideCurveStrength * outsideCurveIntensity * targetRotation +
            turningCurveStrength * turningIntensity * targetRotation;

          let foldRotationAngle = THREE.MathUtils.degToRad(Math.sign(targetRotation) * 2.2);

          if (isBookClosed) {
            if (i === 0) {
              rotationAngle = targetRotation;
              foldRotationAngle = 0;
            } else {
              rotationAngle = 0;
              foldRotationAngle = 0;
            }
          }

          // Damp bone rotations
          target.rotation.y = THREE.MathUtils.damp(
            target.rotation.y,
            rotationAngle,
            12,
            delta
          );

          const foldIntensity =
            i > 8
              ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
              : 0;

          target.rotation.x = THREE.MathUtils.damp(
            target.rotation.x,
            foldRotationAngle * foldIntensity,
            8,
            delta
          );
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (domElement) {
        domElement.removeEventListener('pointerdown', handlePointerDown);
        domElement.removeEventListener('pointermove', handlePointerMove);
        domElement.removeEventListener('pointerup', handlePointerUp);
        if (container.contains(domElement)) {
          container.removeChild(domElement);
        }
      }
      if (renderer) {
        renderer.dispose();
      }
      cancelAnimationFrame(animationFrameIdRef.current);
      if (pageGeometry) {
        pageGeometry.dispose();
      }
    };
  }, [isWebGLSupported, playFlipSound, setPage]);

  // 2D Canvas Fallback Renderer for environments without WebGL
  useEffect(() => {
    if (isWebGLSupported) return;
    const canvas = fallbackCanvasRef.current;
    const container = mountRef.current;
    if (!canvas || !container) return;

    const render2DSpread = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth || 960;
      const height = container.clientHeight || 620;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Dark desk vignette surface
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 80,
        width / 2, height / 2, width * 0.8
      );
      bgGrad.addColorStop(0, '#11151f');
      bgGrad.addColorStop(0.7, '#0b0e14');
      bgGrad.addColorStop(1, '#06080b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Book measurements
      const pageAspect = PAGE_WIDTH / PAGE_HEIGHT;
      const bookH = Math.min(height * 0.84, 520);
      const singlePageW = bookH * pageAspect;

      if (activePage === 0) {
        // Front Cover (Centered)
        const coverX = (width - singlePageW) / 2;
        const coverY = (height - bookH) / 2;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 36;
        ctx.shadowOffsetX = 12;
        ctx.shadowOffsetY = 18;

        const coverTex = createCoverTexture();
        if (coverTex && coverTex.image) {
          ctx.drawImage(coverTex.image, coverX, coverY, singlePageW, bookH);
        }
        ctx.shadowColor = 'transparent';

        // Leather spine accent on left
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(coverX, coverY, 12, bookH);

        // Click to Open Hint
        ctx.fillStyle = 'rgba(203, 213, 225, 0.85)';
        ctx.font = '600 13px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CLICK TO OPEN DEATH NOTE  →', width / 2, coverY + bookH + 28);

      } else if (activePage === 8) {
        // Back Cover (Centered)
        const coverX = (width - singlePageW) / 2;
        const coverY = (height - bookH) / 2;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 36;
        ctx.shadowOffsetX = -12;
        ctx.shadowOffsetY = 18;

        const backTex = createBackCoverTexture();
        if (backTex && backTex.image) {
          ctx.drawImage(backTex.image, coverX, coverY, singlePageW, bookH);
        }
        ctx.shadowColor = 'transparent';

        // Leather spine accent on right
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(coverX + singlePageW - 12, coverY, 12, bookH);

        ctx.fillStyle = 'rgba(203, 213, 225, 0.85)';
        ctx.font = '600 13px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('←  CLICK TO RE-OPEN', width / 2, coverY + bookH + 28);

      } else {
        // 2-Page Open Spread
        const totalBookW = singlePageW * 2;
        const startX = (width - totalBookW) / 2;
        const startY = (height - bookH) / 2;

        // Outer desk shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 24;
        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(startX - 8, startY - 6, totalBookW + 16, bookH + 12);
        ctx.shadowColor = 'transparent';

        // Dark leather under-cover edging
        ctx.fillStyle = '#141822';
        ctx.fillRect(startX - 6, startY - 4, totalBookW + 12, bookH + 8);

        // Get textures
        let leftTex, rightTex;
        if (activePage === 1) {
          leftTex = createInsideCoverTexture();
          rightTex = createRulesTexturePart1();
        } else {
          const bug = bugCases[activePage - 2];
          leftTex = createCaseLeftPageTexture(bug);
          rightTex = createCaseRightPageTexture(bug);
        }

        // Draw left page
        if (leftTex && leftTex.image) {
          ctx.drawImage(leftTex.image, startX, startY, singlePageW, bookH);
        }

        // Draw right page
        if (rightTex && rightTex.image) {
          ctx.drawImage(rightTex.image, startX + singlePageW, startY, singlePageW, bookH);
        }

        // Gutter spine crease shadow
        const creaseW = 60;
        const spineGrad = ctx.createLinearGradient(
          startX + singlePageW - creaseW / 2, 0,
          startX + singlePageW + creaseW / 2, 0
        );
        spineGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        spineGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.18)');
        spineGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.48)');
        spineGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.18)');
        spineGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spineGrad;
        ctx.fillRect(startX + singlePageW - creaseW / 2, startY, creaseW, bookH);

        // Page edge bottom bevel
        ctx.fillStyle = 'rgba(235, 224, 207, 0.35)';
        ctx.fillRect(startX, startY + bookH - 2, totalBookW, 2);
      }
    };

    render2DSpread();
    window.addEventListener('resize', render2DSpread);
    return () => window.removeEventListener('resize', render2DSpread);
  }, [isWebGLSupported, activePage]);

  // Click handler for 2D fallback canvas
  const handleFallbackCanvasClick = (e) => {
    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (activePage === 0) {
      setPage(1);
    } else if (activePage === 8) {
      setPage(7);
    } else {
      if (x < rect.width / 2) {
        setPage(activePage - 1);
      } else {
        setPage(activePage + 1);
      }
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(-0.35, 1.25, 4.3);
    controlsRef.current.target.set(0, 0, 0);
    cameraRef.current.lookAt(0, 0, 0);
    controlsRef.current.update();
  };

  // Human-readable page titles for scrubber
  const pageNavLabels = [
    { idx: 0, label: 'Cover', icon: '📓' },
    { idx: 1, label: 'Rules', icon: '📜' },
    { idx: 2, label: 'Case #1', icon: '⚡' },
    { idx: 3, label: 'Case #2', icon: '🖨️' },
    { idx: 4, label: 'Case #3', icon: '💾' },
    { idx: 5, label: 'Case #4', icon: '💬' },
    { idx: 6, label: 'Case #5', icon: '📍' },
    { idx: 7, label: 'Case #6', icon: '✍️' },
    { idx: 8, label: 'Back Cover', icon: '🛡️' },
  ];

  // Active case mapping (pages 2..7 map to bugCases 0..5)
  const currentCaseIdx = activePage >= 2 && activePage <= 7 ? activePage - 2 : null;
  const activeBug = currentCaseIdx !== null ? bugCases[currentCaseIdx] : null;

  return (
    <div
      className="death-note-3d-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Floating HUD Indicator */}
      <div className="death-note-3d-topbar">
        <div className="d3d-badge-group">
          <span className="d3d-badge-pulse" />
          <span className="d3d-badge-text">
            {!isWebGLSupported
              ? 'Realistic Death Note Ledger · Interactive Spread'
              : 'Three.js Skinned Bone Book · Realistic Death Note'}
          </span>
          <span className="d3d-status-pill">
            {activePage === 0
              ? 'Front Cover'
              : activePage === 1
              ? 'The Rules'
              : activePage === 8
              ? 'Back Cover'
              : `Inscribed: ${activeBug?.title || `Case #${activePage - 1}`}`}
          </span>
        </div>

        <div className="d3d-top-actions">
          {/* Quick Reader / Dossier Button */}
          {activeBug && (
            <button
              type="button"
              className="d3d-icon-btn d3d-inspect-btn"
              onClick={() => onInspectCase && onInspectCase(activeBug.id)}
              title="Inspect code & case file in high-contrast drawer"
            >
              <BookOpen size={14} className="text-accent" />
              <span>Inspect Dossier</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            className="d3d-icon-btn"
            onClick={() => setSoundEnabled((prev) => !prev)}
            title={soundEnabled ? 'Mute page flip audio' : 'Enable page flip audio'}
            aria-label="Toggle page turn audio"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Reset View */}
          <button
            type="button"
            className="d3d-icon-btn"
            onClick={handleResetCamera}
            title="Reset 3D camera angle & zoom"
            aria-label="Reset camera"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Main 3D WebGL / 2D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="death-note-webgl-canvas"
        style={{ width: '100%', height: '560px', cursor: isWebGLSupported ? 'grab' : 'pointer' }}
      >
        {!isWebGLSupported && (
          <canvas
            ref={fallbackCanvasRef}
            className="death-note-fallback-canvas"
            onClick={handleFallbackCanvasClick}
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }}
            title={
              activePage === 0
                ? 'Click to Open Death Note'
                : 'Click left side for previous page, right side for next page'
            }
          />
        )}
      </div>

      {/* Floating 3D Interaction Hint */}
      <div className={`d3d-interaction-hint ${isHovered ? 'hint-dim' : ''}`}>
        <span>Drag to orbit · Scroll to zoom freely · Click pages or pills to turn</span>
      </div>

      {/* Quick Navigation Scrubber Dock */}
      <div className="death-note-3d-scrubber">
        <button
          type="button"
          className="d3d-nav-arrow"
          onClick={() => setPage(activePage - 1)}
          disabled={activePage <= 0}
          aria-label="Previous Page"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="d3d-pills-track">
          {pageNavLabels.map((p) => {
            const isActive = activePage === p.idx;
            return (
              <button
                key={p.idx}
                type="button"
                className={`d3d-page-pill ${isActive ? 'd3d-pill-active' : ''}`}
                onClick={() => setPage(p.idx)}
              >
                <span className="pill-icon">{p.icon}</span>
                <span className="pill-name">{p.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="d3d-nav-arrow"
          onClick={() => setPage(activePage + 1)}
          disabled={activePage >= 8}
          aria-label="Next Page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
