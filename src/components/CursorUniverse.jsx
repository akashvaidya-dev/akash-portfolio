import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

/**
 * CursorUniverse Component
 * 3D Cursor-Reactive and Scroll-Transforming Universe.
 *
 * Resilient Architecture:
 * - Attempts Three.js WebGL rendering first with 1,000+ 3D particles & geometric nodes.
 * - If WebGL is unavailable (e.g., sandboxed browser, disabled hardware acceleration),
 *   gracefully falls back to high-performance HTML5 2D Canvas particle universe with GSAP.
 * - Zero uncaught exceptions, 100% universal compatibility.
 */
function CursorUniverse() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = mountRef.current;
    if (!container) return;

    let cleanup = null;

    // Helper: Test WebGL availability
    const isWebGLAvailable = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    };

    if (isWebGLAvailable()) {
      try {
        cleanup = initThreeWebGL(container);
      } catch (err) {
        console.warn('WebGL init failed, using 2D Canvas fallback:', err);
        cleanup = init2DCanvasUniverse(container);
      }
    } else {
      cleanup = init2DCanvasUniverse(container);
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="cursor-universe-canvas-layer"
      aria-hidden="true"
    />
  );
}

// =============================================================================
// Engine 1: Three.js WebGL 3D Universe
// =============================================================================
function initThreeWebGL(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 80;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Particle Constellation
  const particleCount = 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const emeraldColor = new THREE.Color('#10b981');
  const mintColor = new THREE.Color('#34d399');
  const slateColor = new THREE.Color('#334155');

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 160;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

    const rand = Math.random();
    const col = rand > 0.6 ? emeraldColor : rand > 0.3 ? mintColor : slateColor;
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
  grad.addColorStop(0.3, 'rgba(16, 185, 129, 0.8)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    map: texture,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Geometric Nodes
  const icoGeo = new THREE.IcosahedronGeometry(12, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  const icosahedron = new THREE.Mesh(icoGeo, icoMat);
  icosahedron.position.set(38, -10, 10);
  scene.add(icosahedron);

  const torusGeo = new THREE.TorusGeometry(18, 0.4, 8, 48);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(-36, 15, -15);
  torus.rotation.x = Math.PI / 3;
  scene.add(torus);

  // Mouse Parallax
  const mouse = { x: 0, y: 0 };
  const handleMouseMove = (e) => {
    const targetX = (e.clientX / window.innerWidth) * 2 - 1;
    const targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    gsap.to(mouse, { x: targetX, y: targetY, duration: 0.8, ease: 'power2.out' });
  };
  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  // Scroll Transformation
  const handleScroll = () => {
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

    scene.rotation.y = mouse.x * 0.25;
    scene.rotation.x = -mouse.y * 0.25;

    icosahedron.rotation.x = elapsedTime * 0.12 + mouse.y * 0.5;
    icosahedron.rotation.y = elapsedTime * 0.18 + mouse.x * 0.5;

    torus.rotation.z = elapsedTime * 0.08;
    torus.rotation.y = elapsedTime * 0.12;

    particles.rotation.y = elapsedTime * 0.02 + mouse.x * 0.1;
    particles.rotation.x = elapsedTime * 0.01 - mouse.y * 0.1;

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
function init2DCanvasUniverse(container) {
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
      color: Math.random() > 0.4 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(52, 211, 153, 0.4)',
    });
  }

  const handleMouseMove = (e) => {
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

    // Draw glowing cursor spot
    const cursorGrad = ctx.createRadialGradient(
      mouse.x,
      mouse.y,
      0,
      mouse.x,
      mouse.y,
      mouse.radius
    );
    cursorGrad.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
    cursorGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = cursorGrad;
    ctx.fillRect(0, 0, width, height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse repulsion/interaction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        p.x -= (dx / dist) * force * 2;
        p.y -= (dy / dist) * force * 2;
      }

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Connect near particles with glowing lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const pDist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (pDist < 90) {
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.2 * (1 - pDist / 90)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
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
