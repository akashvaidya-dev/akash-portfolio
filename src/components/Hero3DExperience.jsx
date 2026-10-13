import React, { Suspense, useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Float } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, Maximize2, Minimize2 } from "lucide-react";

/**
 * Procedural Dynamic Animated Flutter Code Editor Texture
 * Draws a real Dart / Flutter editor screen with syntax highlighting
 */
function createCodingScreenTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");

  // Dark IDE editor background
  ctx.fillStyle = "#0b0f19";
  ctx.fillRect(0, 0, 1024, 640);

  // Editor header bar
  ctx.fillStyle = "#151e2e";
  ctx.fillRect(0, 0, 1024, 44);

  // Tab indicator
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.roundRect(14, 8, 220, 36, 6);
  ctx.fill();

  // Tab title
  ctx.font = "bold 15px monospace";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText("⚡ main_controller.dart", 28, 30);

  // Secondary tab
  ctx.font = "14px monospace";
  ctx.fillStyle = "#64748b";
  ctx.fillText("resto_pos_engine.dart", 255, 30);

  // Editor Gutter (line numbers)
  ctx.fillStyle = "#090d15";
  ctx.fillRect(0, 44, 52, 596);

  ctx.font = "13px monospace";
  ctx.fillStyle = "#475569";
  for (let i = 1; i <= 24; i++) {
    ctx.fillText(String(i).padStart(2, " "), 14, 44 + i * 24);
  }

  // Active Code Lines
  const codeLines = [
    { text: 'import "package:flutter/material.dart";', color: '#f43f5e' },
    { text: 'import "package:hooks_riverpod/hooks_riverpod.dart";', color: '#f43f5e' },
    { text: 'import "package:resto_pos/esc_pos_engine.dart";', color: '#f43f5e' },
    { text: "", color: "" },
    { text: "// Akash Vaidya — Core Flutter Engine", color: "#10b981" },
    { text: "class PosPrintController extends StateNotifier<PosState> {", color: "#38bdf8" },
    { text: "  final EscPosHardwareBridge _hardwareBridge;", color: "#94a3b8" },
    { text: "  final HiveOfflineStore _cache;", color: "#94a3b8" },
    { text: "", color: "" },
    { text: "  PosPrintController(this._hardwareBridge, this._cache) :", color: "#cbd5e1" },
    { text: "      super(PosState.initial()) {", color: "#cbd5e1" },
    { text: "    _initVoiceDictationAndThermal();", color: "#fbbf24" },
    { text: "  }", color: "#cbd5e1" },
    { text: "", color: "" },
    { text: "  Future<void> dispatchThermalReceipt(Order order) async {", color: "#38bdf8" },
    { text: "    state = state.copyWith(status: PosStatus.printing);", color: "#a855f7" },
    { text: "    final bytes = await _hardwareBridge.compileEscPos(order);", color: "#cbd5e1" },
    { text: "    await _hardwareBridge.streamToPrinter(bytes);", color: "#10b981" },
    { text: "    await _cache.commitAuditLog(order.id, durationMs: 4);", color: "#38bdf8" },
    { text: "    state = state.copyWith(status: PosStatus.completed);", color: "#a855f7" },
    { text: "  }", color: "#cbd5e1" },
    { text: "}", color: "#38bdf8" },
  ];

  ctx.font = "15px monospace";
  codeLines.forEach((line, idx) => {
    if (line.text) {
      ctx.fillStyle = line.color;
      ctx.fillText(line.text, 68, 68 + idx * 24);
    }
  });

  // Glowing status footer
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 612, 1024, 28);
  ctx.fillStyle = "#10b981";
  ctx.beginPath();
  ctx.arc(20, 626, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "12px monospace";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Flutter 3.x • Riverpod • ESC/POS Active • Sub-5ms Caching Verified", 32, 630);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Interactive 3D Character developed from sathwikkbhat/interactive-3d-portfolio
 * Rigged skinned-mesh developer character sitting properly in the chair:
 * - Hands placed right on the keyboard typing actively
 * - Seated naturally on the chair cushion with back supported
 * - Smooth head rotation tracking mouse/touch (handleHeadRotation)
 * - Signature cyber sunglasses with HUD reflection & dark cyber clothing
 */
function AkashInteractiveCharacter({
  position = [-0.68, 0.35, -1.42],
  rotation = [0, Math.PI, 0],
  scale = 0.145,
}) {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/character.glb");
  const { actions } = useAnimations(animations, group);
  const headBoneRef = useRef(null);

  // Setup materials, ensure character visibility, and hide non-character props
  useEffect(() => {
    if (!scene) return;

    // Isolate character root: metarig002 / metarig.002
    scene.children.forEach((child) => {
      const lower = child.name.toLowerCase();
      if (lower.includes("metarig")) {
        child.visible = true;
        child.traverse((c) => {
          c.visible = true;
        });
      } else {
        // Hide extra floor, stand, keyboard, and background planes from character.glb
        child.visible = false;
        child.traverse((c) => {
          c.visible = false;
        });
      }
    });

    // Locate head bone for interactive cursor tracking (from sathwikkbhat)
    headBoneRef.current =
      scene.getObjectByName("spine006") ||
      scene.getObjectByName("spine.006") ||
      scene.getObjectByName("spine_006");

    // Style Akash Vaidya character persona
    scene.traverse((child) => {
      if (child.isMesh && child.visible) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          const lower = child.name.toLowerCase();
          // Dark styled hair
          if (lower.includes("hair")) {
            const mat = child.material.clone();
            mat.color = new THREE.Color("#0a0d14");
            mat.roughness = 0.85;
            child.material = mat;
          }
          // Obsidian cyber developer shirt
          else if (lower.includes("shirt")) {
            const mat = child.material.clone();
            mat.color = new THREE.Color("#0b1324");
            mat.roughness = 0.6;
            mat.metalness = 0.2;
            child.material = mat;
          }
          // Dark tailored developer pants
          else if (lower.includes("pant")) {
            const mat = child.material.clone();
            mat.color = new THREE.Color("#090d16");
            mat.roughness = 0.75;
            child.material = mat;
          }
          // Dark sleek sneakers
          else if (lower.includes("shoe") || lower.includes("sole")) {
            const mat = child.material.clone();
            mat.color = new THREE.Color("#1e293b");
            child.material = mat;
          }
        }
      }
    });

    // Attach Akash signature sunglasses with cyan HUD reflection to head bone
    if (headBoneRef.current && !headBoneRef.current.getObjectByName("akash_sunglasses")) {
      const glassesGroup = new THREE.Group();
      glassesGroup.name = "akash_sunglasses";
      glassesGroup.position.set(0, 0.46, 0.48);

      // Glasses Frame
      const frameGeo = new THREE.BoxGeometry(0.72, 0.22, 0.15);
      const frameMat = new THREE.MeshStandardMaterial({
        color: "#050811",
        roughness: 0.1,
        metalness: 0.9,
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      glassesGroup.add(frameMesh);

      // Glasses Cyan HUD Lenses
      const lensGeo = new THREE.PlaneGeometry(0.66, 0.18);
      const lensMat = new THREE.MeshBasicMaterial({
        color: "#38bdf8",
        transparent: true,
        opacity: 0.75,
      });
      const lensMesh = new THREE.Mesh(lensGeo, lensMat);
      lensMesh.position.set(0, 0, 0.08);
      glassesGroup.add(lensMesh);

      headBoneRef.current.add(glassesGroup);
    }
  }, [scene]);

  // Start animations: typing loop + blinking from sathwikkbhat
  useEffect(() => {
    if (!actions) return;

    if (actions["typing"]) {
      actions["typing"].reset().play();
      actions["typing"].timeScale = 1.15;
    }
    if (actions["Blink"]) {
      actions["Blink"].reset().play();
      actions["Blink"].timeScale = 0.8;
    }
    if (actions["introAnimation"]) {
      actions["introAnimation"].setLoop(THREE.LoopOnce, 1);
      actions["introAnimation"].clampWhenFinished = true;
      actions["introAnimation"].play();
    }
  }, [actions]);

  // Interactive head rotation tracking mouse/touch pointer (from sathwikkbhat handleHeadRotation)
  useFrame((state) => {
    if (!headBoneRef.current) return;
    const { pointer } = state;
    const maxRotY = Math.PI / 6;
    const maxRotX = 0.35;

    headBoneRef.current.rotation.y = THREE.MathUtils.lerp(
      headBoneRef.current.rotation.y,
      -pointer.x * maxRotY,
      0.08
    );
    headBoneRef.current.rotation.x = THREE.MathUtils.lerp(
      headBoneRef.current.rotation.x,
      -pointer.y * maxRotX - 0.15,
      0.08
    );
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * 3D Procedural Flutter Floating Brand Logo
 */
function FloatingFlutterLogo({ position = [-2.6, 2.2, -0.6], scale = 0.55 }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.9;
    groupRef.current.rotation.x = Math.sin(t * 1.2) * 0.12;
    groupRef.current.position.y = position[1] + Math.sin(t * 1.8) * 0.18;
  });

  const flutterBlueMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#02569B",
        roughness: 0.2,
        metalness: 0.4,
        emissive: "#02569B",
        emissiveIntensity: 0.25,
      }),
    []
  );

  const flutterCyanMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0175C2",
        roughness: 0.2,
        metalness: 0.4,
        emissive: "#0175C2",
        emissiveIntensity: 0.35,
      }),
    []
  );

  const flutterLightMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#54C5F8",
        roughness: 0.15,
        metalness: 0.3,
        emissive: "#54C5F8",
        emissiveIntensity: 0.5,
      }),
    []
  );

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Top Chevron Wing */}
      <mesh position={[0.2, 0.65, 0]} rotation={[0, 0, -Math.PI / 4]} material={flutterLightMat}>
        <boxGeometry args={[1.1, 0.32, 0.15]} />
      </mesh>

      {/* Bottom Main Chevron Arm */}
      <mesh position={[-0.1, -0.05, 0]} rotation={[0, 0, Math.PI / 4]} material={flutterCyanMat}>
        <boxGeometry args={[1.4, 0.32, 0.15]} />
      </mesh>

      {/* Lower Right Accent Wing */}
      <mesh position={[0.42, -0.42, 0]} rotation={[0, 0, -Math.PI / 4]} material={flutterBlueMat}>
        <boxGeometry args={[0.62, 0.32, 0.15]} />
      </mesh>

      {/* Floating Sparkle Core */}
      <pointLight color="#38bdf8" intensity={15} distance={3.5} />
    </group>
  );
}

/**
 * 3D Developer Workstation Diorama (Completely Open, Zero Walls)
 * The chair is pulled directly up to the keyboard/desk and Akash is correctly seated in it
 * with hands resting and typing on the keyboard.
 */
function WorkstationDiorama(props) {
  const { nodes, materials } = useGLTF("/models/optimized-room.glb");
  const codingScreenTexture = useMemo(() => createCodingScreenTexture(), []);

  const tableMaterial = useMemo(() => new THREE.MeshPhongMaterial({ color: "#1e293b" }), []);
  const radiatorMaterial = useMemo(() => new THREE.MeshPhongMaterial({ color: "#334155" }), []);
  const compMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f8fafc", metalness: 0.2, roughness: 0.3 }),
    []
  );
  const pillowMaterial = useMemo(() => new THREE.MeshPhongMaterial({ color: "#10b981" }), []);
  const chairMaterial = useMemo(() => new THREE.MeshPhongMaterial({ color: "#0f172a" }), []);

  // Monitor Live Coding Screen Material with Flutter Code View
  const liveScreenMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: codingScreenTexture,
        side: THREE.DoubleSide,
      }),
    [codingScreenTexture]
  );

  return (
    <group {...props} dispose={null}>
      {/* Open Diorama Floor Disc - sleek dark tech disc grounded under the desk */}
      <mesh position={[-0.2, 0.18, -1.1]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.4, 0.1, 48]} />
        <meshStandardMaterial color="#0c1220" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Glowing Tech Edge Ring around the floor disc */}
      <mesh position={[-0.2, 0.23, -1.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.25, 3.35, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Seated Office Chair: pulled up directly in front of the desk/keyboard */}
      <group position={[-0.66, 0.08, -1.50]}>
        <mesh geometry={nodes.chair_body_blinn1_0.geometry} material={chairMaterial} />
        <mesh geometry={nodes.pillows_blinn1_0.geometry} material={pillowMaterial} />
      </group>

      {/* Akash Vaidya Character: seated naturally in chair with hands typing directly on keyboard */}
      <AkashInteractiveCharacter
        position={[-0.68, 0.35, -1.42]}
        rotation={[0, Math.PI, 0]}
        scale={0.145}
      />

      {/* High-Resolution Live Coding IDE Screen attached to the Primary Monitor */}
      <mesh position={[-0.85, 2.2, -2.36]} rotation={[0, 0.18, 0]}>
        <planeGeometry args={[1.34, 0.88]} />
        <primitive object={liveScreenMaterial} attach="material" />
      </mesh>

      {/* Secondary Monitor Live Preview */}
      <mesh position={[0.58, 2.2, -2.62]} rotation={[0, -0.16, 0]}>
        <planeGeometry args={[1.34, 0.88]} />
        <meshBasicMaterial color="#0284c7" />
      </mesh>

      {/* Workstation Desk & Accessories (NO enclosing walls or ceilings) */}
      <mesh geometry={nodes.table_blinn1_0.geometry} material={tableMaterial} />
      <mesh geometry={nodes.cabin_blinn1_0.geometry} material={tableMaterial} />
      <mesh geometry={nodes.polySurface53_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.comp_blinn1_0.geometry} material={compMaterial} />
      <mesh geometry={nodes.emis_lambert1_0.geometry} material={materials.lambert1} />
      <mesh geometry={nodes.handls_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.keyboard_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.red_bttns_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.kovrik_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.lamp_bl_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.lamp_white_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.miuse_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.monitor2_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.monitor3_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.pCylinder5_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.radiator_blinn1_0.geometry} material={radiatorMaterial} />
      <mesh geometry={nodes.stylus_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.tablet_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.triangle_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.vires_blinn1_0.geometry} material={materials.blinn1} />
    </group>
  );
}

/**
 * Atmospheric Studio & Cyber Lights
 */
function HeroLights() {
  return (
    <>
      <ambientLight intensity={0.7} color="#0f172a" />
      <directionalLight position={[4, 6, 4]} intensity={1.5} color="#e0f2fe" castShadow />
      <directionalLight position={[-4, 5, 2]} intensity={0.8} color="#10b981" />
      <pointLight position={[0, 2.5, 0]} intensity={15} color="#38bdf8" />
      {/* Glow reflecting from Flutter screen onto Akash face */}
      <pointLight position={[-0.85, 2.2, -2.1]} intensity={28} color="#38bdf8" distance={4.5} />
    </>
  );
}

/**
 * Ambient Space Dust Particles
 */
function HeroParticles({ count = 100 }) {
  const mesh = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 12;
      pos[i3 + 1] = Math.random() * 6 - 2;
      pos[i3 + 2] = (Math.random() - 0.5) * 12;

      const isCyan = Math.random() > 0.5;
      col[i3] = isCyan ? 0.22 : 0.06;
      col[i3 + 1] = isCyan ? 0.74 : 0.72;
      col[i3 + 2] = isCyan ? 0.97 : 0.51;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.015;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Main Hero 3D Interactive Room Experience
 * - Hands placed right on the keyboard typing
 * - Character correctly seated in the chair
 * - Freely zoomable (0.15x - 40x, smooth damping, pan & orbit)
 * - Fullscreen toggle mode with dedicated viewport controls
 */
export default function Hero3DExperience() {
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync fullscreen state with document fullscreenchange event
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // Toggle Fullscreen mode
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!isFullscreen) {
        const el = containerRef.current;
        if (el?.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el?.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen();
        } else if (el?.msRequestFullscreen) {
          await el.msRequestFullscreen();
        } else {
          // Fallback state if fullscreen API is restricted
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        } else {
          setIsFullscreen(false);
        }
      }
    } catch (err) {
      console.warn("Fullscreen API fallback:", err);
      setIsFullscreen((prev) => !prev);
    }
  }, [isFullscreen]);

  // Reset Camera View to Default
  const handleResetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);



  return (
    <div
      ref={containerRef}
      className={`hero-3d-experience-container ${isFullscreen ? "hero-3d-is-fullscreen" : ""}`}
    >
      {/* 3D Canvas Viewport */}
      <div className="hero-3d-canvas-wrapper">
        <Canvas
          camera={{ position: [-0.38, 2.05, 1.05], fov: 38 }}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
          style={{ width: "100%", height: "100%", background: "transparent" }}
        >
          <Suspense fallback={null}>
            <HeroLights />
            <HeroParticles count={100} />

            {/* Central Workstation Diorama (No walls, 100% open diorama) */}
            <WorkstationDiorama
              position={[0.1, -0.9, 0]}
              rotation={[0.08, -Math.PI / 4 + 0.15, 0]}
              scale={1.05}
            />

            {/* Floating 3D Flutter Logo */}
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.7}>
              <FloatingFlutterLogo position={[-2.4, 1.8, 0.2]} scale={0.5} />
            </Float>

            {/* Free Orbit Controls: fully unconstrained zoom (0.15x to 40x), pan & orbit */}
            <OrbitControls
              ref={controlsRef}
              makeDefault
              target={[-0.68, 1.35, -1.75]}
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              autoRotate={false}
              minDistance={0.15}
              maxDistance={40.0}
              minPolarAngle={0.02}
              maxPolarAngle={Math.PI - 0.02}
              dampingFactor={0.05}
              rotateSpeed={0.85}
              panSpeed={1.0}
              zoomSpeed={1.0}
            />
          </Suspense>
        </Canvas>

        {/* Floating Controls: Reset & Fullscreen Icon-Only Buttons */}
        <div className="hero-3d-hud-bar">
          <button
            onClick={handleResetCamera}
            className="hero-3d-btn"
            title="Reset Camera View"
            aria-label="Reset Camera View"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="hero-3d-btn hero-3d-btn-fullscreen"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>

        {/* Keyboard / Gesture Navigation Tip */}
        {isFullscreen && (
          <div className="hero-3d-fullscreen-tip">
            <span>Esc or click Exit to return • Scroll/Pinch to Zoom freely • Right-click/2-finger drag to Pan</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Preload 3D assets for instant loading
useGLTF.preload("/models/optimized-room.glb");
useGLTF.preload("/models/character.glb");
