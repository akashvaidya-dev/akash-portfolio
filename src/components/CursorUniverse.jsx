import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useTheme } from '../context/useTheme';

function hexToRgba(hex, alpha) {
  try {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
  } catch {
    return `rgba(16, 185, 129, ${alpha})`;
  }
}

/**
 * CursorReactiveUniverse Component
 * Implements:
 * 1. Three.js 3D constellation with cursor parallax & scroll transformation.
 * 2. Adaptive to Design System: Reacts to Theme (Light/Dark), Accent Color, and Reduced Motion.
 * 3. 2D Canvas fallback engine when WebGL is unavailable.
 */
function CursorUniverse() {
  const containerRef = useRef(null);
  const { theme, accent, activeAccent, activePeriod, livingTimeEnabled } = useTheme();
  const isReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cleanup = null;

    try {
      // Test WebGL availability safely
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (gl) {
        cleanup = initThreeUniverse(container, {
          activePeriod: livingTimeEnabled ? activePeriod : null,
          isDark: theme === 'dark',
          accentHex: activeAccent.hex,
          accentLightHex: activeAccent.lightHex,
          isReducedMotion,
        });
      } else {
        cleanup = init2DCanvasUniverse(container, {
          activePeriod: livingTimeEnabled ? activePeriod : null,
          isDark: theme === 'dark',
          accentHex: activeAccent.hex,
          isReducedMotion,
        });
      }
    } catch {
      cleanup = init2DCanvasUniverse(container, {
        isDark: theme === 'dark',
        accentHex: activeAccent.hex,
        isReducedMotion,
      });
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [theme, accent, activeAccent, activePeriod, livingTimeEnabled, isReducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`cursor-universe-canvas-container ${theme === 'light' ? 'light-mode-universe' : ''} ${livingTimeEnabled ? `universe-period-${activePeriod}` : ''}`}
      aria-hidden="true"
    />
  );
}

// =============================================================================
// Engine 1: Three.js 3D Space Constellation & Floating Wireframe Objects
// =============================================================================
function initThreeUniverse(container, { isDark, accentHex, accentLightHex, isReducedMotion, activePeriod }) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.inset = '0';
  renderer.domElement.style.pointerEvents = 'none';
  container.appendChild(renderer.domElement);

  // Particle System
  const particleCount = window.innerWidth < 768 ? 400 : 900;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const mainColor = new THREE.Color(accentHex);
  const lightColor = new THREE.Color(accentLightHex);
  let neutralColor = isDark ? new THREE.Color("#334155") : new THREE.Color("#94a3b8");
  if (activePeriod === "morning") {
    neutralColor = new THREE.Color("#d97706");
  } else if (activePeriod === "evening") {
    neutralColor = new THREE.Color("#8b5cf6");
  }

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 160;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

    const rand = Math.random();
    const col = rand > 0.5 ? mainColor : rand > 0.25 ? lightColor : neutralColor;
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.3, isDark ? accentHex : '#475569');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.PointsMaterial({
    size: isDark ? 1.8 : 1.5,
    vertexColors: true,
    map: texture,
    transparent: true,
    opacity: isDark ? 0.75 : 0.45,
    blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Geometric Nodes
  const icoGeo = new THREE.IcosahedronGeometry(12, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: mainColor,
    wireframe: true,
    transparent: true,
    opacity: isDark ? 0.18 : 0.22,
  });
  const icosahedron = new THREE.Mesh(icoGeo, icoMat);
  icosahedron.position.set(38, -10, 10);
  scene.add(icosahedron);

  const torusGeo = new THREE.TorusGeometry(18, 0.4, 8, 48);
  const torusMat = new THREE.MeshBasicMaterial({
    color: lightColor,
    wireframe: true,
    transparent: true,
    opacity: isDark ? 0.12 : 0.18,
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(-36, 15, -15);
  torus.rotation.x = Math.PI / 3;
  scene.add(torus);

  // Mouse Parallax
  const mouse = { x: 0, y: 0 };
  const handleMouseMove = (e) => {
    if (isReducedMotion) return;
    const targetX = (e.clientX / window.innerWidth) * 2 - 1;
    const targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    gsap.to(mouse, { x: targetX, y: targetY, duration: 0.8, ease: 'power2.out' });
  };
  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  // Scroll Transformation
  const handleScroll = () => {
    if (isReducedMotion) return;
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
    gsap.to(camera.position, {
      z: 80 - scrollProgress * 35,
      y: -scrollProgress * 25,
      duration: 0.6,
      ease: 'power1.out',
      overwrite: 'auto',
    });
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  let animationFrameId;
  const clock = new THREE.Clock();

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (!isReducedMotion) {
      scene.rotation.y = mouse.x * 0.25;
      scene.rotation.x = -mouse.y * 0.25;

      icosahedron.rotation.x = elapsedTime * 0.12 + mouse.y * 0.5;
      icosahedron.rotation.y = elapsedTime * 0.18 + mouse.x * 0.5;

      torus.rotation.z = elapsedTime * 0.08;
      torus.rotation.y = elapsedTime * 0.12;

      particles.rotation.y = elapsedTime * 0.02 + mouse.x * 0.1;
      particles.rotation.x = elapsedTime * 0.01 - mouse.y * 0.1;
    }

    renderer.render(scene, camera);
  };
  animate();

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', handleResize);

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);

    if (container && renderer.domElement) {
      container.removeChild(renderer.domElement);
    }
    geometry.dispose();
    material.dispose();
    texture.dispose();
    icoGeo.dispose();
    icoMat.dispose();
    torusGeo.dispose();
    torusMat.dispose();
    renderer.dispose();
  };
}

// =============================================================================
// Engine 2: 2D Canvas High-Performance Fallback
// =============================================================================
function init2DCanvasUniverse(container, { isDark, accentHex, isReducedMotion }) {
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particleCount = 75;
  const particles = [];
  const mouse = { x: width / 2, y: height / 2, radius: 140 };

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? accentHex : isDark ? '#334155' : '#94a3b8',
    });
  }

  const handleMouseMove = (e) => {
    if (isReducedMotion) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };
  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);

  let animationFrameId;

  const render = () => {
    animationFrameId = requestAnimationFrame(render);
    ctx.clearRect(0, 0, width, height);

    if (!isReducedMotion) {
      const cursorGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
      cursorGrad.addColorStop(0, hexToRgba(accentHex, isDark ? 0.12 : 0.08));
      cursorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = cursorGrad;
      ctx.fillRect(0, 0, width, height);
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!isReducedMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  render();

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    if (container && canvas) {
      container.removeChild(canvas);
    }
  };
}

export default CursorUniverse;
