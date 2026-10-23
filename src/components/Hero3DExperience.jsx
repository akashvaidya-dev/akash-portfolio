import React, { Suspense, useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Float } from "@react-three/drei";
import * as THREE from "three";
import { RotateCcw, Maximize2, Minimize2 } from "lucide-react";

/**
 * Dynamic Animated Flutter IDE Screen Hook/Generator
 * Renders real-time coding animation with syntax highlighting, blinking cursor,
 * and live hot-reload terminal status.
 */
function useDynamicIdeTexture() {
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 640;
    return c;
  }, []);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [canvas]);

  const stateRef = useRef({
    typedChars: 0,
    lastUpdate: 0,
    cursorBlink: true,
  });

  const fullCodeLines = [
    { text: 'import "package:flutter/material.dart";', color: "#f43f5e" },
    { text: 'import "package:hooks_riverpod/hooks_riverpod.dart";', color: "#f43f5e" },
    { text: 'import "package:resto_pos/esc_pos_engine.dart";', color: "#f43f5e" },
    { text: "", color: "" },
    { text: "// Akash Vaidya — Core Offline-First POS Engine", color: "#10b981" },
    { text: "class PosController extends StateNotifier<PosState> {", color: "#38bdf8" },
    { text: "  final EscPosHardwareBridge _hardwareBridge;", color: "#94a3b8" },
    { text: "  final HiveOfflineStore _cache;", color: "#94a3b8" },
    { text: "", color: "" },
    { text: "  PosController(this._hardwareBridge, this._cache) :", color: "#cbd5e1" },
    { text: "      super(PosState.initial()) {", color: "#cbd5e1" },
    { text: "    _initVoiceDictationAndThermal();", color: "#fbbf24" },
    { text: "  }", color: "#cbd5e1" },
    { text: "", color: "" },
    { text: "  Future<void> dispatchThermalReceipt(Order order) async {", color: "#38bdf8" },
    { text: "    state = state.copyWith(status: PosStatus.printing);", color: "#a855f7" },
    { text: "    final bytes = await _hardwareBridge.compileEscPos(order);", color: "#cbd5e1" },
    { text: "    await _hardwareBridge.streamToPrinter(bytes);", color: "#10b981" },
    { text: "    await _cache.commitAuditLog(order.id, durationMs: 3.8);", color: "#38bdf8" },
    { text: "    state = state.copyWith(status: PosStatus.completed);", color: "#a855f7" },
    { text: "  }", color: "#cbd5e1" },
    { text: "}", color: "#38bdf8" },
  ];

  const draw = useCallback((elapsed) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dark IDE editor background
    ctx.fillStyle = "#0a0e1a";
    ctx.fillRect(0, 0, 1024, 640);

    // Editor header bar
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, 1024, 46);

    // macOS window dots
    ctx.fillStyle = "#ff5f56";
    ctx.beginPath();
    ctx.arc(20, 23, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffbd2e";
    ctx.beginPath();
    ctx.arc(38, 23, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#27c93f";
    ctx.beginPath();
    ctx.arc(56, 23, 6, 0, Math.PI * 2);
    ctx.fill();

    // Tab indicator
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(82, 8, 240, 36, 6);
    ctx.fill();

    // Tab title
    ctx.font = "bold 15px monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("⚡ main_controller.dart", 96, 31);

    // Secondary tab
    ctx.font = "14px monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("resto_pos_engine.dart", 345, 31);

    // Breadcrumbs
    ctx.fillStyle = "#0c1322";
    ctx.fillRect(0, 46, 1024, 26);
    ctx.font = "12px monospace";
    ctx.fillStyle = "#475569";
    ctx.fillText("resto_pos > lib > controllers > main_controller.dart > PosController", 18, 63);

    // Gutter line numbers
    ctx.fillStyle = "#080c16";
    ctx.fillRect(0, 72, 54, 538);

    ctx.font = "13px monospace";
    ctx.fillStyle = "#334155";
    for (let i = 1; i <= 22; i++) {
      ctx.fillText(String(i).padStart(2, " "), 16, 74 + i * 23);
    }

    // Code lines rendering with dynamic typing simulation
    ctx.font = "14px monospace";
    const totalLines = fullCodeLines.length;
    // Active typing line cycle
    const cycle = Math.floor(elapsed * 2.5) % (totalLines + 8);
    const activeLineIdx = Math.min(cycle, totalLines - 1);

    fullCodeLines.forEach((line, idx) => {
      const y = 97 + idx * 23;
      if (idx <= activeLineIdx && line.text) {
        ctx.fillStyle = line.color;
        // Highlight active line
        if (idx === activeLineIdx) {
          ctx.fillStyle = "#38bdf8";
          ctx.fillText(line.text, 72, y);
          // Blinking cursor
          if (Math.floor(elapsed * 3) % 2 === 0) {
            const width = ctx.measureText(line.text).width;
            ctx.fillStyle = "#38bdf8";
            ctx.fillRect(74 + width, y - 13, 8, 16);
          }
        } else {
          ctx.fillText(line.text, 72, y);
        }
      }
    });

    // Glowing Terminal / Hot Reload Status Strip
    ctx.fillStyle = "#0c1424";
    ctx.fillRect(0, 586, 1024, 54);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 586, 1024, 1);

    // Terminal Status Line
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(20, 612, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("⚡ [Flutter 3.24]: Hot Reload Reassembled (26ms)", 34, 616);

    ctx.font = "12px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("• ESC/POS Thermal 80mm: OK • Sub-5ms Caching Active", 440, 616);

    // Live execution counter ticker
    const tick = Math.floor(elapsed * 10);
    ctx.fillStyle = "#a855f7";
    ctx.fillText(`PID: 15734 | TX #${tick}`, 860, 616);

    texture.needsUpdate = true;
  }, [canvas, fullCodeLines, texture]);

  // Update dynamic texture on animation frames
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (elapsed - stateRef.current.lastUpdate > 0.08) {
      stateRef.current.lastUpdate = elapsed;
      draw(elapsed);
    }
  });

  return texture;
}

/**
 * Dynamic Animated Secondary Screen: RestoPOS Mobile / POS App Live Preview
 * Renders an active mobile POS dashboard with live metrics, audio waveform, and order receipt stream.
 */
function useDynamicPreviewTexture() {
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 640;
    return c;
  }, []);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [canvas]);

  const lastUpdateRef = useRef(0);

  const draw = useCallback((elapsed) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dark sleek app background
    ctx.fillStyle = "#080c17";
    ctx.fillRect(0, 0, 1024, 640);

    // App Navigation Bar
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 1024, 52);

    ctx.font = "bold 17px sans-serif";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("RestoPOS • Mobile Engine v3.2", 24, 33);

    // Live status badge
    ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
    ctx.beginPath();
    ctx.roundRect(760, 12, 240, 28, 14);
    ctx.fill();
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(776, 26, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "bold 12px monospace";
    ctx.fillText("ONLINE • ESC/POS ACTIVE", 790, 30);

    // Left Column: Active Order & Thermal Receipt Print Card
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(24, 76, 470, 536, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
    ctx.stroke();

    ctx.font = "bold 15px monospace";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("LIVE ORDER RECEIPT DISPATCH", 44, 110);

    ctx.font = "13px monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Table #04 — Server: Akash Vaidya", 44, 134);

    // Divider line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.moveTo(44, 150);
    ctx.lineTo(470, 150);
    ctx.stroke();

    // Order items
    const items = [
      { name: "2x Cold Brew Signature", price: "₹280.00" },
      { name: "1x Truffle Mushroom Panini", price: "₹240.00" },
      { name: "1x Espresso Doppio", price: "₹140.00" },
      { name: "1x Almond Biscotti", price: "₹90.00" },
    ];

    items.forEach((item, i) => {
      ctx.font = "14px monospace";
      ctx.fillStyle = "#e2e8f0";
      ctx.fillText(item.name, 44, 184 + i * 36);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(item.price, 380, 184 + i * 36);
    });

    // Subtotal & Tax
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.moveTo(44, 340);
    ctx.lineTo(470, 340);
    ctx.stroke();

    ctx.font = "bold 16px monospace";
    ctx.fillStyle = "#10b981";
    ctx.fillText("TOTAL (PAID VIA UPI): ₹750.00", 44, 375);

    // Thermal Print Pulse Indicator
    const printPulse = (Math.sin(elapsed * 4) + 1) / 2;
    ctx.fillStyle = `rgba(16, 185, 129, ${0.15 + printPulse * 0.2})`;
    ctx.beginPath();
    ctx.roundRect(44, 410, 430, 48, 10);
    ctx.fill();
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#34d399";
    ctx.fillText("⚡ ESC/POS THERMAL PRINT: SUCCESS", 64, 440);

    // Sub-5ms Cache Verification
    ctx.font = "12px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("• Hive Cache commit: 3.4ms latency", 44, 490);
    ctx.fillText("• ESC/POS stream: 80mm USB Direct", 44, 514);
    ctx.fillText("• Offline audit trail: Synchronized", 44, 538);

    // Right Column: Live Performance Analytics & Voice Dictation Audio Wave
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(518, 76, 482, 536, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
    ctx.stroke();

    ctx.font = "bold 15px monospace";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("SYSTEM PERFORMANCE & METRICS", 540, 110);

    // KPI 1
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(540, 134, 210, 80, 10);
    ctx.fill();
    ctx.font = "12px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("TODAY REVENUE", 555, 158);
    ctx.font = "bold 20px monospace";
    ctx.fillStyle = "#10b981";
    ctx.fillText("₹24,850", 555, 192);

    // KPI 2
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(768, 134, 210, 80, 10);
    ctx.fill();
    ctx.font = "12px monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("PRINT ACCURACY", 783, 158);
    ctx.font = "bold 20px monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("100% OK", 783, 192);

    // Voice POS Dictation Waveform
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("VOICE POS DICTATION STREAM", 540, 260);

    // Animated Equalizer Waveform
    const numBars = 28;
    const barWidth = 10;
    const barGap = 5;
    for (let b = 0; b < numBars; b++) {
      const freq = Math.sin(elapsed * 6 + b * 0.4) * 0.5 + 0.5;
      const h = 18 + freq * 60;
      const bx = 540 + b * (barWidth + barGap);
      const by = 350 - h / 2;

      const grad = ctx.createLinearGradient(0, by, 0, by + h);
      grad.addColorStop(0, "#38bdf8");
      grad.addColorStop(1, "#10b981");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(bx, by, barWidth, h, 3);
      ctx.fill();
    }

    ctx.font = "12px monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Real-time Audio Dictation Processing Active", 540, 400);

    // Hardware status indicators
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(540, 428, 438, 160, 10);
    ctx.fill();

    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("CONNECTED HARDWARE BUS:", 556, 458);

    ctx.font = "12px monospace";
    ctx.fillStyle = "#a855f7";
    ctx.fillText("[OK] USB Thermal ESC/POS (80mm)", 556, 486);
    ctx.fillStyle = "#10b981";
    ctx.fillText("[OK] Bluetooth BLE Scanner Ring", 556, 510);
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("[OK] SQLite Hive Local Database Sub-5ms", 556, 534);
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("[OK] Flutter 3.x Hardware Bridge", 556, 558);

    texture.needsUpdate = true;
  }, [canvas, texture]);

  // Update dynamic texture on animation frames
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (elapsed - lastUpdateRef.current > 0.08) {
      lastUpdateRef.current = elapsed;
      draw(elapsed);
    }
  });

  return texture;
}

/**
 * Interactive 3D Character developed from sathwikkbhat/interactive-3d-portfolio
 * Rigged skinned-mesh developer character:
 * - Seated naturally in the office chair
 * - Left hand actively typing Flutter code on the keyboard
 * - Right hand smoothly moving the mouse on the mousepad
 * - Smooth head rotation tracking mouse/touch pointer
 * - Signature cyber sunglasses with HUD reflection & dark cyber developer clothes
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
  const rightArmRef = useRef(null);
  const rightForearmRef = useRef(null);
  const rightHandRef = useRef(null);
  const leftHandRef = useRef(null);

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

    // Locate bones for head tracking and hand/arm interactivity
    headBoneRef.current =
      scene.getObjectByName("spine006") ||
      scene.getObjectByName("spine.006") ||
      scene.getObjectByName("spine_006");

    rightArmRef.current =
      scene.getObjectByName("upper_arm.R") ||
      scene.getObjectByName("upper_arm_R");

    rightForearmRef.current =
      scene.getObjectByName("forearm.R") ||
      scene.getObjectByName("forearm_R");

    rightHandRef.current =
      scene.getObjectByName("hand.R") ||
      scene.getObjectByName("hand_R");

    leftHandRef.current =
      scene.getObjectByName("hand.L") ||
      scene.getObjectByName("hand_L");

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
      actions["typing"].timeScale = 1.2;
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

  // Interactive animation frame: Head tracking + Left Hand Typing + Right Hand Mouse Movement
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { pointer } = state;

    // 1. Head rotation tracking user cursor smoothly
    if (headBoneRef.current) {
      const maxRotY = Math.PI / 6;
      const maxRotX = 0.35;
      headBoneRef.current.rotation.y = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.y,
        -pointer.x * maxRotY,
        0.08
      );
      headBoneRef.current.rotation.x = THREE.MathUtils.lerp(
        headBoneRef.current.rotation.x,
        -pointer.y * maxRotX - 0.12,
        0.08
      );
    }

    // 2. Left hand: energetic coding keystroke micro-taps on the keyboard
    if (leftHandRef.current) {
      leftHandRef.current.rotation.x = THREE.MathUtils.lerp(
        leftHandRef.current.rotation.x,
        -0.28 + Math.sin(t * 16) * 0.06 + Math.cos(t * 24) * 0.04,
        0.3
      );
      leftHandRef.current.rotation.z = THREE.MathUtils.lerp(
        leftHandRef.current.rotation.z,
        Math.sin(t * 12) * 0.05,
        0.3
      );
    }

    // 3. Right hand & arm: resting on and moving the mouse on the mousepad
    if (rightForearmRef.current && rightHandRef.current) {
      const mx = Math.sin(t * 2.2) * 0.07 + Math.cos(t * 4.1) * 0.03;
      const mz = Math.cos(t * 1.9) * 0.05 + Math.sin(t * 3.5) * 0.025;

      // Guide right arm forward-right onto the mousepad
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = THREE.MathUtils.lerp(
          rightArmRef.current.rotation.z,
          0.16 + mx * 0.12,
          0.12
        );
      }
      rightForearmRef.current.rotation.y = THREE.MathUtils.lerp(
        rightForearmRef.current.rotation.y,
        -0.32 + mx * 0.35,
        0.12
      );
      rightForearmRef.current.rotation.z = THREE.MathUtils.lerp(
        rightForearmRef.current.rotation.z,
        0.62 + mz * 0.25,
        0.12
      );

      // Hand resting flat on mouse with subtle click taps
      const isClicking = Math.sin(t * 3.7) > 0.88;
      rightHandRef.current.rotation.x = THREE.MathUtils.lerp(
        rightHandRef.current.rotation.x,
        -0.22 + (isClicking ? 0.07 : 0),
        0.25
      );
      rightHandRef.current.rotation.y = THREE.MathUtils.lerp(
        rightHandRef.current.rotation.y,
        -0.52 + mx * 0.18,
        0.12
      );
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

/**
 * 3D Official Extruded Flutter Brand Logo
 * Reconstructed with canonical Google Flutter vector geometry:
 * - Top wing (Sky Cyan #47C5FB)
 * - Middle diagonal arm (Vibrant Blue #29B6F6)
 * - Central accent diamond (Light Cyan #54C5F8)
 * - Lower right arm (Deep Flutter Navy #01579B)
 * Layered with 3D bevels, PBR metallic-roughness shading, and soft ambient glow
 */
function FloatingFlutterLogo({ position = [-2.4, 2.0, -0.6], scale = 0.55 }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.75;
    groupRef.current.rotation.x = Math.sin(t * 1.1) * 0.12;
    groupRef.current.position.y = position[1] + Math.sin(t * 1.6) * 0.16;
  });

  const { topGeom, midGeom, lowerGeom, diamondGeom } = useMemo(() => {
    const pts = {
      top: [
        [0.1924, 1.0],
        [0.8076, 1.0],
        [-0.4999, -0.3077],
        [-0.8076, -0.0],
      ],
      mid: [
        [0.1924, 0.077],
        [0.8076, 0.077],
        [-0.0385, -0.7693],
        [-0.346, -0.4616],
      ],
      lower: [
        [-0.0385, -0.7693],
        [0.1924, -1.0],
        [0.8076, -1.0],
        [0.2692, -0.4616],
      ],
      diamond: [
        [-0.346, -0.4616],
        [-0.0383, -0.1537],
        [0.2694, -0.4616],
        [-0.0383, -0.7693],
      ],
    };

    const makeExtruded = (p, depth = 0.1) => {
      const shape = new THREE.Shape();
      p.forEach(([x, y], idx) => {
        if (idx === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      });
      shape.closePath();
      return new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      });
    };

    return {
      topGeom: makeExtruded(pts.top, 0.1),
      midGeom: makeExtruded(pts.mid, 0.095),
      lowerGeom: makeExtruded(pts.lower, 0.095),
      diamondGeom: makeExtruded(pts.diamond, 0.11),
    };
  }, []);

  const topMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#47C5FB",
        roughness: 0.18,
        metalness: 0.35,
        emissive: "#0288D1",
        emissiveIntensity: 0.28,
        side: THREE.DoubleSide,
      }),
    []
  );

  const midMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#29B6F6",
        roughness: 0.18,
        metalness: 0.35,
        emissive: "#0277BD",
        emissiveIntensity: 0.28,
        side: THREE.DoubleSide,
      }),
    []
  );

  const lowerMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#01579B",
        roughness: 0.22,
        metalness: 0.45,
        emissive: "#01579B",
        emissiveIntensity: 0.22,
        side: THREE.DoubleSide,
      }),
    []
  );

  const diamondMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#54C5F8",
        roughness: 0.12,
        metalness: 0.4,
        emissive: "#38BDF8",
        emissiveIntensity: 0.45,
        side: THREE.DoubleSide,
      }),
    []
  );

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Top Main Wing */}
      <mesh geometry={topGeom} material={topMat} position={[0, 0, 0.01]} castShadow />

      {/* Middle Wing (Upper lower-chevron) */}
      <mesh geometry={midGeom} material={midMat} position={[0, 0, 0]} castShadow />

      {/* Center Diamond Accent */}
      <mesh geometry={diamondGeom} material={diamondMat} position={[0, 0, 0.02]} castShadow />

      {/* Lower Right Accent Wing */}
      <mesh geometry={lowerGeom} material={lowerMat} position={[0, 0, 0.005]} castShadow />

      {/* Ambient Flutter Glow Core */}
      <pointLight color="#38bdf8" intensity={18} distance={3.5} />
    </group>
  );
}

/**
 * 3D Developer Workstation Diorama
 * - Seated office chair pulled up directly in front of desk
 * - Character seated with left hand on keyboard typing & right hand moving mouse
 * - Mouse and mousepad aligned right next to the keyboard
 * - Primary monitor with live dynamic Flutter code editor
 * - Secondary monitor with live dynamic RestoPOS app preview
 */
function WorkstationDiorama(props) {
  const { nodes, materials } = useGLTF("/models/optimized-room.glb");
  const liveIdeTexture = useDynamicIdeTexture();
  const livePreviewTexture = useDynamicPreviewTexture();
  const mouseMeshRef = useRef(null);

  const tableMaterial = useMemo(() => new THREE.MeshPhongMaterial({ color: "#1e293b" }), []);
  const radiatorMaterial = useMemo(() => new THREE.MeshPhongMaterial({ color: "#334155" }), []);
  const compMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#f8fafc", metalness: 0.2, roughness: 0.3 }),
    []
  );
  const pillowMaterial = useMemo(() => new THREE.MeshPhongMaterial({ color: "#10b981" }), []);
  const chairMaterial = useMemo(() => new THREE.MeshPhongMaterial({ color: "#0f172a" }), []);

  // Live Coding IDE Screen Material
  const ideScreenMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: liveIdeTexture,
        side: THREE.DoubleSide,
      }),
    [liveIdeTexture]
  );

  // Live RestoPOS App Preview Material
  const previewScreenMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: livePreviewTexture,
        side: THREE.DoubleSide,
      }),
    [livePreviewTexture]
  );

  // Animate physical mouse mesh synchronously with the character's right hand navigation
  useFrame((state) => {
    if (mouseMeshRef.current) {
      const t = state.clock.getElapsedTime();
      mouseMeshRef.current.position.x = -1.48 + Math.sin(t * 2.2) * 0.02 + Math.cos(t * 4.1) * 0.01;
      mouseMeshRef.current.position.z = 0.08 + Math.cos(t * 1.9) * 0.015 + Math.sin(t * 3.5) * 0.008;
    }
  });

  return (
    <group {...props} dispose={null}>
      {/* Open Diorama Floor Disc - centered to ground both desk and chair */}
      <mesh position={[-0.4, 0.18, -1.7]} receiveShadow>
        <cylinderGeometry args={[3.4, 3.6, 0.1, 48]} />
        <meshStandardMaterial color="#0c1220" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Glowing Tech Edge Ring around the floor disc */}
      <mesh position={[-0.4, 0.23, -1.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.45, 3.55, 48]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Seated Office Chair: pulled up directly in front of the desk/keyboard */}
      <group position={[-0.66, 0.08, -1.50]}>
        <mesh geometry={nodes.chair_body_blinn1_0.geometry} material={chairMaterial} />
        <mesh geometry={nodes.pillows_blinn1_0.geometry} material={pillowMaterial} />
      </group>

      {/* Akash Vaidya Character: seated in chair with left hand on keyboard & right hand on mouse */}
      <AkashInteractiveCharacter
        position={[-0.68, 0.35, -1.42]}
        rotation={[0, Math.PI, 0]}
        scale={0.145}
      />

      {/* Primary Monitor: Live Dynamic Flutter IDE Screen */}
      <mesh position={[-0.85, 2.2, -2.36]} rotation={[0, 0.18, 0]}>
        <planeGeometry args={[1.34, 0.88]} />
        <primitive object={ideScreenMaterial} attach="material" />
      </mesh>
      {/* Primary Monitor Soft Screen Glow */}
      <pointLight position={[-0.85, 2.2, -2.1]} intensity={25} color="#38bdf8" distance={4.5} />

      {/* Secondary Monitor: Live Dynamic RestoPOS App Preview Screen */}
      <mesh position={[0.58, 2.2, -2.62]} rotation={[0, -0.16, 0]}>
        <planeGeometry args={[1.34, 0.88]} />
        <primitive object={previewScreenMaterial} attach="material" />
      </mesh>
      {/* Secondary Monitor Screen Glow */}
      <pointLight position={[0.58, 2.2, -2.4]} intensity={20} color="#0284c7" distance={4.0} />

      {/* Mousepad & Animated Mouse: positioned right beside the keyboard where the right hand rests */}
      <group position={[-1.48, 0, 0.08]}>
        <mesh geometry={nodes.kovrik_blinn1_0.geometry} material={materials.blinn1} />
      </group>
      <group ref={mouseMeshRef} position={[-1.48, 0, 0.08]}>
        <mesh geometry={nodes.miuse_blinn1_0.geometry} material={materials.blinn1} />
      </group>

      {/* Workstation Desk & Accessories (NO enclosing walls or ceilings) */}
      <mesh geometry={nodes.table_blinn1_0.geometry} material={tableMaterial} />
      <mesh geometry={nodes.cabin_blinn1_0.geometry} material={tableMaterial} />
      <mesh geometry={nodes.polySurface53_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.comp_blinn1_0.geometry} material={compMaterial} />
      <mesh geometry={nodes.emis_lambert1_0.geometry} material={materials.lambert1} />
      <mesh geometry={nodes.handls_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.keyboard_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.red_bttns_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.lamp_bl_blinn1_0.geometry} material={materials.blinn1} />
      <mesh geometry={nodes.lamp_white_blinn1_0.geometry} material={materials.blinn1} />
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
      <ambientLight intensity={0.75} color="#0f172a" />
      <directionalLight position={[4, 6, 4]} intensity={1.6} color="#e0f2fe" castShadow />
      <directionalLight position={[-4, 5, 2]} intensity={0.9} color="#10b981" />
      <pointLight position={[0, 2.5, 0]} intensity={16} color="#38bdf8" />
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
 * - Perfectly positioned on site open: character, desk, PC monitors, and typing action clearly visible without moving
 * - Interactive dual-hand animation: left hand typing on keyboard, right hand moving mouse
 * - Live dynamic screens: animated Flutter IDE & RestoPOS mobile preview
 * - Unconstrained free zoom, pan, and rotation
 * - Clean icon-only toolbar for Reset & Fullscreen
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

  // Reset Camera View to Default View
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
          camera={{ position: [1.85, 1.95, -0.45], fov: 42 }}
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
              <FloatingFlutterLogo position={[-2.4, 2.0, -0.6]} scale={0.5} />
            </Float>

            {/* Free Orbit Controls: Centered directly on character, keyboard, and coding monitor */}
            <OrbitControls
              ref={controlsRef}
              makeDefault
              target={[0.55, 1.35, -1.95]}
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

        {/* Minimal Icon-Only Toolbar for Reset & Fullscreen */}
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

        {/* Fullscreen Navigation Tip */}
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
