import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  X, 
  Smartphone, 
  Code2, 
  Flame, 
  Network, 
  Layers,
  Cpu,
  CheckCircle2,
  Maximize2,
  Radio,
  Eye,
  RotateCcw,
  Orbit,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Github } from './Icons';
import profilePhotoUrl from '../assets/images/akash-vaidya.jpg';
import blendedPhotoUrl from '../assets/images/akash-blended.png';
import fullPhotoUrl from '../assets/images/akash-vaidya-full.jpg';
import particleData from '../data/akashParticles.json';
import { projects } from '../data/projects';
import { socialLinks } from '../data/socials';

// Tech stack panel data
const TECH_PANELS = [
  {
    id: 'flutter',
    name: 'Flutter',
    badge: 'Mobile Core',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.9)',
    desc: 'Production cross-platform mobile apps with 60 FPS fluidity, Riverpod architecture, and custom hardware ESC/POS bridges.',
    projectTitle: 'RestoPOS — Offline-First POS & ESC/POS Engine',
    projectMetric: 'Sub-5ms local transactions & 100% ESC/POS hardware reliability',
    highlights: [
      'Clean Riverpod state separating repositories and reactive UI',
      'Binary ESC/POS thermal printer streaming via Bluetooth & WiFi',
      'Speech-to-text voice dictation engine for ultra-fast POS item entry',
      'Deterministic offline-first Hive caching with sync retry queue'
    ],
    tags: ['Flutter 3.x', 'Hooks Riverpod', 'ESC/POS', 'Hive NoSQL', 'Dio'],
  },
  {
    id: 'dart',
    name: 'Dart',
    badge: 'OOP & Streams',
    color: '#00b4d8',
    glowColor: 'rgba(0, 180, 216, 0.9)',
    desc: 'Strongly typed asynchronous programming, StreamControllers, isolate background thread workers, and robust serialization.',
    projectTitle: 'FitPassio — Gym Management (BLoC · Hive · Mapbox)',
    projectMetric: 'Offline-friendly Hive cache with Mapbox gym discovery',
    highlights: [
      'Declarative deep-link navigation with GoRouter',
      'BLoC state pipelines for memberships and workouts',
      'Strongly typed DTO serialization and schema validation'
    ],
    tags: ['Dart 3.x', 'Streams', 'Isolates', 'GoRouter', 'OOP'],
  },
  {
    id: 'firebase',
    name: 'Firebase',
    badge: 'Cloud & Push',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.9)',
    desc: 'High-priority Firebase Cloud Messaging (FCM), real-time Firestore sync listeners, and security rule validations.',
    projectTitle: 'DigiSlips — School Circulars & Push Notification Engine',
    projectMetric: '98% parent consent response rate within 24 hours of broadcast',
    highlights: [
      'High-priority FCM notification dispatch with offline queueing',
      'Real-time delivery status receipts and read tracking',
      'Touch-canvas signature capture with timestamped validation'
    ],
    tags: ['Firebase FCM', 'Firestore', 'Auth Rules', 'Cloud Functions'],
  },
  {
    id: 'rest-apis',
    name: 'REST APIs',
    badge: 'Networking',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.9)',
    desc: 'Production Dio HTTP client, automatic JWT token refresh interceptors, offline retry queues, and hardware sockets.',
    projectTitle: 'Clinic Management — Triage & Digital Prescription Suite',
    projectMetric: 'Seamless offline patient lookup and encrypted prescription sync',
    highlights: [
      'Resilient HTTP interceptors with exponential backoff retry',
      'Offline SQLite synchronization engine',
      'Micro-app separation isolating clinical records from billing'
    ],
    tags: ['REST Webhooks', 'Dio Interceptors', 'SQLite Cache', 'Hardware Sockets'],
  },
  {
    id: 'github',
    name: 'GitHub',
    badge: 'CI/CD & Git',
    color: '#e2e8f0',
    glowColor: 'rgba(226, 232, 240, 0.9)',
    desc: 'Trunk-based branch workflows, GitHub Actions automated build matrices, semantic releases, and open-source contributions.',
    projectTitle: 'SIH Fixly — Civic Grievance & Geotagged Issue Tracker',
    projectMetric: 'Smart India Hackathon project with automated CI audit trails',
    highlights: [
      'Automated APK bundling and static code analysis workflows',
      'Geotagged camera EXIF pipeline with cryptographic verification',
      'Modular mono-repo clean architecture structure'
    ],
    tags: ['GitHub Actions', 'CI/CD', 'Git Flows', 'Mono-repo'],
  },
];

/**
 * Creates soft circular particle alpha texture
 */
function createCircleParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.9)');
  grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.35)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Creates high-resolution canvas texture for glass panels
 */
function createGlassPanelTexture(item) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Background frosted dark glass
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 256);
  bgGrad.addColorStop(0, 'rgba(12, 17, 26, 0.92)');
  bgGrad.addColorStop(1, 'rgba(8, 11, 18, 0.88)');
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 236, 28);
  ctx.fill();

  // Glass specular rim
  ctx.lineWidth = 4;
  const borderGrad = ctx.createLinearGradient(0, 0, 512, 256);
  borderGrad.addColorStop(0, item.color);
  borderGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
  borderGrad.addColorStop(1, item.color);
  ctx.strokeStyle = borderGrad;
  ctx.shadowColor = item.color;
  ctx.shadowBlur = 18;
  ctx.stroke();

  // Specular sheen
  ctx.shadowBlur = 0;
  const sheenGrad = ctx.createLinearGradient(0, 0, 400, 200);
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
  sheenGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = sheenGrad;
  ctx.beginPath();
  ctx.roundRect(14, 14, 484, 110, 24);
  ctx.fill();

  // Category Badge Pill
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.beginPath();
  ctx.roundRect(32, 34, 160, 36, 12);
  ctx.fill();

  ctx.font = 'bold 18px monospace';
  ctx.fillStyle = item.color;
  ctx.fillText(item.badge.toUpperCase(), 44, 58);

  // Tech Title
  ctx.font = 'bold 52px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 8;
  ctx.fillText(item.name, 32, 130);

  // Status Indicator Dot
  ctx.shadowBlur = 12;
  ctx.shadowColor = item.color;
  ctx.fillStyle = item.color;
  ctx.beginPath();
  ctx.arc(456, 52, 10, 0, Math.PI * 2);
  ctx.fill();

  // Subtitle / Prompt
  ctx.shadowBlur = 0;
  ctx.font = '22px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(item.id === 'flutter' ? '✦ Click for Live Project Preview' : '✦ Orbiting Tech Component', 32, 185);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * 3D Particle Point Cloud Mesh for Akash's Portrait Photo
 */
function ParticlePortraitMesh({ isHovered, pointer }) {
  const pointsRef = useRef();
  const hoverProgressRef = useRef(0);

  // Initialize typed arrays from pre-sampled portrait data
  const { positions, origins, colors, noise, count } = useMemo(() => {
    const c = particleData.count;
    const pos = new Float32Array(particleData.positions);
    const orig = new Float32Array(particleData.positions);
    const col = new Float32Array(particleData.colors);
    const n = new Float32Array(particleData.noise);
    return {
      positions: pos,
      origins: orig,
      colors: col,
      noise: n,
      count: c,
    };
  }, []);

  const circleTexture = useMemo(() => createCircleParticleTexture(), []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    // Smoothly interpolate hover factor
    const targetHover = isHovered ? 1.0 : 0.0;
    hoverProgressRef.current = THREE.MathUtils.lerp(hoverProgressRef.current, targetHover, 0.08);
    const h = hoverProgressRef.current;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArray = posAttr.array;

    // Disperse or reassemble particles in 3D space
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ox = origins[i3];
      const oy = origins[i3 + 1];
      const oz = origins[i3 + 2];
      const nx = noise[i3];
      const ny = noise[i3 + 1];
      const nz = noise[i3 + 2];

      // Subtle organic breathing harmonic wave
      const breathe = Math.sin(time * 1.8 + ox * 2.5 + oy * 2.0) * 0.05;

      // 3D holographic explosion vector when cursor is over photo
      const disperseX = nx * h * 1.1 + Math.sin(time * 2.0 + oy) * h * 0.25;
      const disperseY = ny * h * 1.1 + Math.cos(time * 2.0 + ox) * h * 0.25;
      const disperseZ = nz * h * 2.2 + Math.sin(time * 3.0 + i) * h * 0.4;

      const targetX = ox + disperseX;
      const targetY = oy + disperseY;
      const targetZ = oz + disperseZ + breathe;

      // Lerp particle back to original or dispersed location
      posArray[i3] = THREE.MathUtils.lerp(posArray[i3], targetX, 0.14);
      posArray[i3 + 1] = THREE.MathUtils.lerp(posArray[i3 + 1], targetY, 0.14);
      posArray[i3 + 2] = THREE.MathUtils.lerp(posArray[i3 + 2], targetZ, 0.14);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.046}
        vertexColors={true}
        map={circleTexture}
        transparent={true}
        opacity={isHovered ? 0.95 : 0.9}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

/**
 * Underlying Stylized Hologram Photo Backdrop Mesh
 */
function HologramBackdropMesh({ isHovered }) {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(blendedPhotoUrl, (loaded) => {
      loaded.minFilter = THREE.LinearFilter;
      loaded.magFilter = THREE.LinearFilter;
      loaded.needsUpdate = true;
      setTexture(loaded);
    });
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const targetZ = isHovered ? -0.38 : -0.05;
    const targetScale = isHovered ? 0.94 : 1.0;
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.08);
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
  });

  return (
    <group ref={meshRef} position={[0, 0, -0.05]}>
      {/* Frameless Feathered Backdrop - Blends seamlessly into website background with 0 rectangular border */}
      <mesh>
        <planeGeometry args={[2.5, 3.125]} />
        {texture && (
          <meshBasicMaterial 
            map={texture} 
            transparent={true}
            opacity={isHovered ? 0.5 : 0.88}
            depthWrite={false}
          />
        )}
      </mesh>
    </group>
  );
}

/**
 * 3D Orbiting Glass Tech Panel Mesh
 */
function OrbitingGlassPanel({ 
  panel, 
  index, 
  total, 
  isHovered, 
  hoveredPanelId, 
  setHoveredPanelId, 
  onSelect 
}) {
  const meshRef = useRef();
  const texture = useMemo(() => createGlassPanelTexture(panel), [panel]);
  const baseAngle = (index / total) * Math.PI * 2;

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const speed = isHovered ? 0.75 : 0.35;
    const currentAngle = baseAngle + time * speed;

    const targetRadius = isHovered ? 2.15 : 1.72;
    const targetX = Math.cos(currentAngle) * targetRadius;
    const targetZ = Math.sin(currentAngle) * (targetRadius * 0.95);
    const targetY = Math.sin(currentAngle * 2 + index * 1.2) * (isHovered ? 0.7 : 0.35) + (index % 2 === 0 ? 0.2 : -0.2);

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.08);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.08);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.08);

    meshRef.current.lookAt(state.camera.position);

    const isThisHovered = hoveredPanelId === panel.id;
    const targetScale = isThisHovered ? 1.18 : (isHovered ? 1.0 : 0.85);
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
  });

  return (
    <group 
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(panel.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredPanelId(panel.id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredPanelId(null);
        document.body.style.cursor = 'auto';
      }}
    >
      <mesh>
        <planeGeometry args={[1.28, 0.64]} />
        <meshPhysicalMaterial 
          map={texture}
          transparent={true}
          roughness={0.12}
          metalness={0.15}
          transmission={0.88}
          ior={1.5}
          thickness={0.4}
          emissive={panel.color}
          emissiveIntensity={hoveredPanelId === panel.id ? 0.35 : 0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[1.30, 0.66]} />
        <meshBasicMaterial 
          color={panel.color}
          transparent={true}
          opacity={hoveredPanelId === panel.id ? 0.45 : 0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * 3D Scene Root
 */

/**
 * Ambient Cyber Dust particles that float across the broad 3D hero stage
 * to blend the holographic avatar seamlessly with the portfolio background
 */
function AmbientCyberDust({ isHovered }) {
  const pointsRef = useRef();

  const { positions, colors, count } = useMemo(() => {
    const c = 220;
    const pos = new Float32Array(c * 3);
    const col = new Float32Array(c * 3);

    for (let i = 0; i < c; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 8.0;
      pos[i3 + 1] = (Math.random() - 0.5) * 7.0;
      pos[i3 + 2] = (Math.random() - 0.5) * 4.0;

      const isCyan = Math.random() > 0.45;
      if (isCyan) {
        col[i3] = 0.22;
        col[i3 + 1] = 0.74;
        col[i3 + 2] = 0.97;
      } else {
        col[i3] = 0.06;
        col[i3 + 1] = 0.72;
        col[i3 + 2] = 0.51;
      }
    }
    return { positions: pos, colors: col, count: c };
  }, []);

  const circleTexture = useMemo(() => createCircleParticleTexture(), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const pos = posAttr.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3 + 1] += Math.sin(time * 0.7 + i) * 0.0025;
      pos[i3] += Math.cos(time * 0.5 + i) * 0.002;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.042}
        vertexColors={true}
        map={circleTexture}
        transparent={true}
        opacity={isHovered ? 0.75 : 0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function HoloScene({ 
  isHovered, 
  hoveredPanelId, 
  setHoveredPanelId, 
  onSelectTech 
}) {
  const groupRef = useRef();
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    const targetRotY = pointer.x * 0.38;
    const targetRotX = -pointer.y * 0.28;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.07);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.07);
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 5, 4]} intensity={2.0} color="#ffffff" />
      <pointLight position={[-3, -2, 2]} intensity={2.5} color="#38bdf8" distance={10} />
      <pointLight position={[3, 2, 2]} intensity={2.0} color="#10b981" distance={10} />

      {/* Underlying Stylized Backdrop */}
      <HologramBackdropMesh isHovered={isHovered} />

      {/* Ambient Cyber Dust connecting to hero background */}
      <AmbientCyberDust isHovered={isHovered} />

      {/* 3D Silhouette Particles */}
      <ParticlePortraitMesh isHovered={isHovered} pointer={pointer} />

      {/* 5 Orbiting 3D Glass Panels */}
      {TECH_PANELS.map((panel, idx) => (
        <OrbitingGlassPanel 
          key={panel.id}
          panel={panel}
          index={idx}
          total={TECH_PANELS.length}
          isHovered={isHovered}
          hoveredPanelId={hoveredPanelId}
          setHoveredPanelId={setHoveredPanelId}
          onSelect={onSelectTech}
        />
      ))}
    </group>
  );
}

/**
 * Master HoloPhotoViewer Component
 */

class WebGLBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('WebGL Canvas encountered an issue, using seamless fallback:', err);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function HoloPhotoViewer() {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredPanelId, setHoveredPanelId] = useState(null);
  const [activePreviewTechId, setActivePreviewTechId] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activePanelData = TECH_PANELS.find((p) => p.id === activePreviewTechId);

  return (
    <div className="holo-viewer-root">
      
      

      {/* Interactive 3D Canvas Box */}
      <div 
        className="holo-canvas-wrapper"
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => {
          setIsHovered(false);
          setHoveredPanelId(null);
        }}
        onClick={() => {
          setIsHovered((prev) => !prev);
        }}
      >


        <WebGLBoundary
          fallback={
            <div className="holo-fallback-card" onClick={() => setIsHovered((prev) => !prev)}>
              <img 
                src={blendedPhotoUrl} 
                alt="Akash Vaidya - Cybernetic AI Engineer" 
                className="holo-fallback-img"
              />
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 7.0], fov: 48 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
          >
            <HoloScene 
              isHovered={isHovered}
              hoveredPanelId={hoveredPanelId}
              setHoveredPanelId={setHoveredPanelId}
              onSelectTech={(techId) => setActivePreviewTechId(techId)}
            />
          </Canvas>
        </WebGLBoundary>

        </div>

      {/* Interactive Tech Stack Selectors Below the 3D Canvas */}
      <div className="holo-tech-pill-row">
        {TECH_PANELS.map((item) => (
          <button
            key={item.id}
            className={`holo-tech-pill ${item.id === 'flutter' ? 'holo-tech-pill-featured' : ''} ${hoveredPanelId === item.id ? 'active' : ''}`}
            onClick={() => setActivePreviewTechId(item.id)}
            onPointerEnter={() => {
              setIsHovered(true);
              setHoveredPanelId(item.id);
            }}
            onPointerLeave={() => setHoveredPanelId(null)}
          >
            <span className="holo-pill-dot" style={{ backgroundColor: item.color }} />
            <span className="holo-pill-label">{item.name}</span>
            {item.id === 'flutter' && <span className="holo-pill-tag">PROJECT</span>}
          </button>
        ))}
      </div>

      {/* =========================================================================
          Mini Project Preview Modal (Triggered on Clicking Flutter)
          ========================================================================= */}
      <AnimatePresence>
        {activePreviewTechId && activePanelData && (
          <motion.div 
            className="holo-preview-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePreviewTechId(null)}
          >
            <motion.div 
              className="holo-preview-dialog"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="holo-preview-header">
                <div className="holo-preview-tag-wrap">
                  <span className="badge badge-primary">
                    <Smartphone size={13} style={{ display: 'inline', marginRight: 4 }} />
                    {activePanelData.badge}
                  </span>
                  <span className="holo-tech-accent-title" style={{ color: activePanelData.color }}>
                    {activePanelData.name} Production Architecture
                  </span>
                </div>
                <button 
                  className="holo-preview-close"
                  onClick={() => setActivePreviewTechId(null)}
                  aria-label="Close project preview"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="holo-preview-body">
                <h3 className="holo-preview-project-title">
                  {activePanelData.projectTitle}
                </h3>
                <p className="holo-preview-metric">
                  ⚡ <strong>Key Benchmark:</strong> {activePanelData.projectMetric}
                </p>
                <p className="holo-preview-desc">
                  {activePanelData.desc}
                </p>

                {/* Key Architectural Highlights */}
                <div className="holo-preview-highlights">
                  <h4 className="holo-highlights-title">// Core Engineering Highlights</h4>
                  <ul className="holo-highlights-list">
                    {activePanelData.highlights.map((hl, i) => (
                      <li key={i}>
                        <CheckCircle2 size={15} style={{ color: activePanelData.color, flexShrink: 0 }} />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Tags */}
                <div className="holo-preview-tags">
                  {activePanelData.tags.map((tag) => (
                    <span key={tag} className="badge badge-subtle">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="holo-preview-footer">
                <Link 
                  to="/projects" 
                  className="btn btn-primary"
                  onClick={() => setActivePreviewTechId(null)}
                >
                  <span>Explore in Projects Page</span>
                  <ArrowRight size={16} />
                </Link>
                <button 
                  className="btn btn-outline"
                  onClick={() => setActivePreviewTechId(null)}
                >
                  <span>Close Preview</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Photo Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            className="photo-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              className="photo-lightbox-dialog"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="photo-lightbox-close"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Close photo preview"
              >
                <X size={20} />
              </button>

              <div className="photo-lightbox-img-wrap">
                <img
                  src={fullPhotoUrl}
                  alt="Akash Vaidya full portrait"
                  className="photo-lightbox-img"
                />
              </div>

              <div className="photo-lightbox-caption">
                <div className="photo-lightbox-header">
                  <h3 className="photo-lightbox-name">{socialLinks.name}</h3>
                  <span className="badge badge-subtle">{socialLinks.role}</span>
                </div>
                <p className="photo-lightbox-desc">
                  Building high-speed production Flutter mobile systems, POS hardware bridges, and modern React 19 web experiences.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
