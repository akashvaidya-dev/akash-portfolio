import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Laptop,
  Printer,
  Wifi,
  WifiOff,
  Mic,
  Send,
  CheckCircle2,
  MapPin,
  FileSignature,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Github } from './Icons';

/**
 * LivingDevice Component
 * 3D Interactive Floating Phone & Laptop Mockup.
 * Features:
 * - 3D dynamic tilt & specular glare on mouse move
 * - Form factor toggle (Phone 📱 <-> Laptop 💻)
 * - Working interactive app screens & simulations:
 *    • Xtream Arena: Voice POS dictation & ESC/POS Thermal Receipt ejection
 *    • VedicMitra: Offline Hive NoSQL caching simulator (0ms load)
 *    • WhatsApp CRM: Realtime multi-agent chat simulator
 *    • Clinic Suite: Instant patient triage token caller
 *    • DigiSlips: Interactive cryptographic signature verification
 *    • SIH Fixly: Geotagged camera & civic defect radar
 * - Hover / Tab story & architecture reveal
 */
function LivingDevice({ project, onOpenDetails, index = 0 }) {
  const defaultType = project.id === 'portfolio-site' ? 'laptop' : 'phone';
  const [deviceType, setDeviceType] = useState(defaultType);
  const [activeScreen, setActiveScreen] = useState(0); // 0: App UI, 1: Live Simulator, 2: Architecture

  // 3D Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef(null);

  // Project Specific Interactive States
  // 1. Xtream Arena Thermal Print
  const [isPrinting, setIsPrinting] = useState(false);
  const [orderItems, setOrderItems] = useState([
    { name: 'Espresso Double', price: 180 },
    { name: 'Margherita Pizza', price: 420 },
  ]);

  // 2. VedicMitra Offline Mode
  const [isOffline, setIsOffline] = useState(false);

  // 3. WhatsApp CRM Message Stream
  const [messages, setMessages] = useState([
    { id: 1, sender: 'customer', text: 'Hi, is Dr. Sharma available for consultation today?' },
    { id: 2, sender: 'agent', text: 'Hello! Yes, slots are open at 4:30 PM. Should I book?' },
  ]);
  const [inputText, setInputText] = useState('');

  // 4. Clinic Suite Token
  const [currentToken, setCurrentToken] = useState(14);

  // 5. DigiSlips Signature
  const [isSigned, setIsSigned] = useState(false);

  // 6. SIH Fixly GPS
  const [gpsLocked, setGpsLocked] = useState(true);

  // Handle 3D Mouse Parallax
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rY = ((x - centerX) / centerX) * 8; // Max 8deg tilt
    const rX = -((y - centerY) / centerY) * 8;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Simulate Thermal Receipt Print
  const triggerPrint = (e) => {
    e.stopPropagation();
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
    }, 4500);
  };

  // Add Item to Xtream Arena
  const addOrderItem = (name, price) => {
    setOrderItems((prev) => [...prev, { name, price }]);
  };

  // Send CRM message
  const sendMessage = (e) => {
    e?.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: 'agent', text: trimmed }
    ]);
    setInputText('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: 'customer', text: 'Thanks! Confirmed via WhatsApp API.' },
      ]);
    }, 1200);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`living-device-wrapper ${deviceType}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Floating Perspective Frame */}
      <motion.div
        className="living-device-container"
        animate={{
          rotateX,
          rotateY,
          transformPerspective: 1200,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Device Top Control Bar: Device Switcher & Screen Tabs */}
        <div className="device-hud-bar">
          <div className="device-type-toggle">
            <button
              type="button"
              className={`device-btn ${deviceType === 'phone' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setDeviceType('phone');
              }}
              title="Smartphone View"
              aria-label="View as Smartphone"
            >
              <Smartphone size={13} />
              <span>Mobile</span>
            </button>
            <button
              type="button"
              className={`device-btn ${deviceType === 'laptop' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setDeviceType('laptop');
              }}
              title="Laptop View"
              aria-label="View as Laptop"
            >
              <Laptop size={13} />
              <span>Desktop</span>
            </button>
          </div>

          <div className="device-screen-tabs">
            {['App UI', 'Live Simulator', 'Blueprint'].map((tab, idx) => (
              <button
                key={tab}
                type="button"
                className={`screen-tab-btn ${activeScreen === idx ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveScreen(idx);
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            PHONE CHASSIS
            ========================================================================= */}
        {deviceType === 'phone' && (
          <div className="phone-chassis">
            <div className="phone-outer-rim">
              <div className="phone-notch">
                <div className="phone-speaker" />
                <div className="phone-camera" />
              </div>

              {/* Volume / Power Buttons */}
              <div className="phone-btn-volume-up" />
              <div className="phone-btn-volume-down" />
              <div className="phone-btn-power" />

              {/* Phone Screen Glass */}
              <div className="phone-screen">
                {/* Status Bar */}
                <div className="screen-status-bar">
                  <span className="status-time">09:41</span>
                  <div className="status-icons">
                    {isOffline ? (
                      <span className="offline-badge">
                        <WifiOff size={11} /> Hive Cache
                      </span>
                    ) : (
                      <Wifi size={11} />
                    )}
                    <span className="status-battery">100%</span>
                  </div>
                </div>

                {/* Living Content Render */}
                <div className="device-screen-content">
                  <AnimatePresence mode="wait">
                    {activeScreen === 0 && (
                      <motion.div
                        key="screen-ui"
                        className="screen-view app-ui-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        {renderProjectAppUI(project, {
                          orderItems,
                          addOrderItem,
                          isOffline,
                          setIsOffline,
                          messages,
                          currentToken,
                          setCurrentToken,
                          isSigned,
                          setIsSigned,
                          gpsLocked,
                        })}
                      </motion.div>
                    )}

                    {activeScreen === 1 && (
                      <motion.div
                        key="screen-sim"
                        className="screen-view simulator-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        {renderProjectSimulator(project, {
                          isPrinting,
                          triggerPrint,
                          orderItems,
                          isOffline,
                          setIsOffline,
                          messages,
                          inputText,
                          setInputText,
                          sendMessage,
                          currentToken,
                          setCurrentToken,
                          isSigned,
                          setIsSigned,
                          gpsLocked,
                          setGpsLocked,
                        })}
                      </motion.div>
                    )}

                    {activeScreen === 2 && (
                      <motion.div
                        key="screen-arch"
                        className="screen-view blueprint-view"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="blueprint-header">
                          <Layers size={14} className="text-accent" />
                          <span>System Architecture</span>
                        </div>
                        <div className="blueprint-tag">{project.architecture}</div>
                        <div className="blueprint-layers">
                          <div className="b-layer">
                            <span className="b-num">01</span>
                            <div>
                              <strong>UI Layer:</strong> Flutter Declarative Widgets
                            </div>
                          </div>
                          <div className="b-layer">
                            <span className="b-num">02</span>
                            <div>
                              <strong>State Layer:</strong> Riverpod StateNotifier
                            </div>
                          </div>
                          <div className="b-layer">
                            <span className="b-num">03</span>
                            <div>
                              <strong>Data & Cache:</strong> Hive / REST Dio Stream
                            </div>
                          </div>
                        </div>
                        <div className="blueprint-metric">
                          <span>// Metric:</span> {project.metric}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Thermal Receipt Paper Ejection Animation for Xtream Arena */}
                {project.id === 'xtream-arena' && (
                  <AnimatePresence>
                    {isPrinting && (
                      <motion.div
                        className="thermal-receipt-paper"
                        initial={{ y: 220, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 220, opacity: 0 }}
                        transition={{ type: 'spring', damping: 18, stiffness: 120 }}
                      >
                        <div className="receipt-sawtooth" />
                        <div className="receipt-content">
                          <div className="receipt-shop">XTREAM ARENA POS</div>
                          <div className="receipt-sub">ESC/POS 80mm THERMAL</div>
                          <div className="receipt-divider">------------------------</div>
                          {orderItems.map((item, i) => (
                            <div key={i} className="receipt-row">
                              <span>{item.name}</span>
                              <span>₹{item.price}</span>
                            </div>
                          ))}
                          <div className="receipt-divider">------------------------</div>
                          <div className="receipt-total">
                            <span>TOTAL:</span>
                            <span>
                              ₹{orderItems.reduce((acc, it) => acc + it.price, 0)}
                            </span>
                          </div>
                          <div className="receipt-barcode">||| |||| || ||||| ||</div>
                          <div className="receipt-footer">Printed via Bluetooth Stream</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* Bottom Home Indicator Bar */}
                <div className="phone-home-indicator" />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            LAPTOP CHASSIS
            ========================================================================= */}
        {deviceType === 'laptop' && (
          <div className="laptop-chassis">
            <div className="laptop-lid">
              <div className="laptop-webcam" />
              <div className="laptop-screen">
                <div className="browser-top-bar">
                  <div className="window-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <div className="browser-url-pill">
                    https://{project.id}.akashvaidya.dev/console
                  </div>
                </div>

                {/* Laptop Screen Content */}
                <div className="device-screen-content laptop-inner">
                  <AnimatePresence mode="wait">
                    {activeScreen === 0 && (
                      <motion.div
                        key="laptop-ui"
                        className="screen-view laptop-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {renderProjectAppUI(project, {
                          orderItems,
                          addOrderItem,
                          isOffline,
                          setIsOffline,
                          messages,
                          currentToken,
                          setCurrentToken,
                          isSigned,
                          setIsSigned,
                          gpsLocked,
                        })}
                      </motion.div>
                    )}

                    {activeScreen === 1 && (
                      <motion.div
                        key="laptop-sim"
                        className="screen-view laptop-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {renderProjectSimulator(project, {
                          isPrinting,
                          triggerPrint,
                          orderItems,
                          isOffline,
                          setIsOffline,
                          messages,
                          inputText,
                          setInputText,
                          sendMessage,
                          currentToken,
                          setCurrentToken,
                          isSigned,
                          setIsSigned,
                          gpsLocked,
                          setGpsLocked,
                        })}
                      </motion.div>
                    )}

                    {activeScreen === 2 && (
                      <motion.div
                        key="laptop-arch"
                        className="screen-view blueprint-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="blueprint-header">
                          <Layers size={14} className="text-accent" />
                          <span>System Architecture</span>
                        </div>
                        <div className="blueprint-tag">{project.architecture}</div>
                        <p className="blueprint-desc">{project.solution}</p>
                        <div className="blueprint-metric">
                          <span>// Metric:</span> {project.metric}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="laptop-base">
              <div className="laptop-notch-indent" />
            </div>
          </div>
        )}

        {/* =========================================================================
            PROJECT STORY & SPECS TRAY
            ========================================================================= */}
        <div className="device-story-tray">
          <div className="story-title-row">
            <h3 className="story-project-name">{project.title}</h3>
            {project.featured && (
              <span className="badge badge-accent">
                <Sparkles size={11} style={{ marginRight: 4 }} />
                Flagship
              </span>
            )}
          </div>

          <p className="story-tagline">{project.tagline}</p>

          <div className="story-metric-box">
            <span className="metric-tag">// Key Result:</span> {project.metric}
          </div>

          <div className="story-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenDetails}
            >
              <span>Explore Case Study</span>
              <ArrowUpRight size={14} />
            </button>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <Github size={14} />
                <span>Source</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// =============================================================================
// Helper: Render Project Specific App UI
// =============================================================================
function renderProjectAppUI(project, state) {
  switch (project.id) {
    case 'xtream-arena':
      return (
        <div className="mock-app pos-app">
          <div className="pos-app-header">
            <div>
              <span className="pos-badge">TABLE 04</span>
              <div className="pos-order-id">#ORD-9821</div>
            </div>
            <div className="pos-mic-indicator">
              <Mic size={14} className="pulsing-mic" />
              <span>Voice Active</span>
            </div>
          </div>

          <div className="pos-items-list">
            {state.orderItems.map((item, idx) => (
              <div key={idx} className="pos-item-row">
                <span>{item.name}</span>
                <span className="pos-price">₹{item.price}</span>
              </div>
            ))}
          </div>

          <div className="pos-add-chips">
            <button
              type="button"
              className="chip-btn"
              onClick={() => state.addOrderItem('Cold Coffee', 150)}
            >
              + Cold Coffee
            </button>
            <button
              type="button"
              className="chip-btn"
              onClick={() => state.addOrderItem('Garlic Bread', 220)}
            >
              + Garlic Bread
            </button>
          </div>

          <div className="pos-app-footer">
            <div className="pos-total-row">
              <span>Total Bill</span>
              <strong>₹{state.orderItems.reduce((acc, it) => acc + it.price, 0)}</strong>
            </div>
          </div>
        </div>
      );

    case 'fitpassio':
      return (
        <div className="mock-app vedic-app">
          <div className="vedic-header">
            <div className="vedic-brand">FitPassio ✨</div>
            <span className="vedic-badge">Gym Live</span>
          </div>
          <div className="astrologer-card">
            <div className="astrologer-avatar">💪</div>
            <div className="astrologer-info">
              <strong>Gold Membership</strong>
              <span>Nearby gyms · Mapbox</span>
              <div className="rating">Hive cache ready</div>
            </div>
          </div>
          <div className="vedic-cache-status">
            <CheckCircle2 size={12} className="text-accent" />
            <span>Offline Hive Storage Engine</span>
          </div>
          <button type="button" className="vedic-consult-btn">
            Start Workout
          </button>
        </div>
      );

    case 'resiliohub':
      return (
        <div className="mock-app crm-app">
          <div className="crm-header">
            <span className="crm-badge">ResilioHub CRM</span>
            <span className="crm-status">● 3 Agents Online</span>
          </div>
          <div className="crm-chat-body">
            {state.messages.map((m) => (
              <div key={m.id} className={`chat-bubble ${m.sender}`}>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
          <div className="crm-typing-bar">
            <span>Customer verified via webhook</span>
          </div>
        </div>
      );

    case 'clinic-management':
      return (
        <div className="mock-app clinic-app">
          <div className="clinic-header">
            <span className="clinic-badge">Cardiology OPD</span>
            <span className="clinic-time">Live Queue</span>
          </div>
          <div className="token-display-box">
            <span className="token-label">NOW CALLING TOKEN</span>
            <span className="token-number">#{state.currentToken}</span>
            <span className="token-name">Patient: Ramesh Verma (45M)</span>
          </div>
          <div className="rx-preview-pill">
            <Activity size={12} className="text-accent" />
            <span>Digital Rx Sync: Connected</span>
          </div>
        </div>
      );

    case 'digislips':
      return (
        <div className="mock-app slips-app">
          <div className="slips-header">
            <span className="slips-badge">Delhi Public School</span>
            <span className="slips-date">Circular #88</span>
          </div>
          <div className="slips-notice">
            <strong>Excursion Consent: Science Planetarium</strong>
            <p>Annual academic field trip for Class IX students.</p>
          </div>
          <div className="signature-box-status">
            <FileSignature size={16} className="text-accent" />
            <span>{state.isSigned ? 'Parent Cryptographically Signed' : 'Pending Parent Authorization'}</span>
          </div>
        </div>
      );

    case 'portfolio-site':
      return (
        <div className="mock-app crm-app">
          <div className="crm-header">
            <span className="crm-badge">akashvaidya.dev</span>
            <span className="crm-status">● handmade</span>
          </div>
          <div className="crm-chat-body">
            <div className="chat-bubble agent">
              <p>React + Vite portfolio</p>
            </div>
            <div className="chat-bubble customer">
              <p>Flutter skills · journey · contact</p>
            </div>
          </div>
          <div className="crm-typing-bar">
            <span>Coded by hand — no client repos here</span>
          </div>
        </div>
      );

    case 'sih-fixly':
    default:
      return (
        <div className="mock-app sih-app">
          <div className="sih-header">
            <span className="sih-badge">Flutter App</span>
            <span className="sih-id">BK-5582</span>
          </div>
          <div className="sih-map-preview">
            <MapPin size={18} className="map-pin-pulse" />
            <div className="sih-coords">Worker ETA · Mapbox live</div>
          </div>
          <div className="sih-step-progress">
            <span className="step done">1. Book</span>
            <span className="step done">2. Pay</span>
            <span className="step active">3. Live Track</span>
          </div>
        </div>
      );
  }
}

// =============================================================================
// Helper: Render Project Simulator
// =============================================================================
function renderProjectSimulator(project, state) {
  switch (project.id) {
    case 'xtream-arena':
      return (
        <div className="sim-box xtream-sim">
          <div className="sim-title">
            <Printer size={16} className="text-accent" />
            <span>Hardware Receipt Ejection</span>
          </div>
          <p className="sim-desc">
            Simulates binary ESC/POS byte generation over Bluetooth / WiFi thermal paper rolls.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm btn-block"
            onClick={state.triggerPrint}
            disabled={state.isPrinting}
          >
            {state.isPrinting ? 'Printing Receipt...' : 'Eject ESC/POS Receipt'}
          </button>
        </div>
      );

    case 'fitpassio':
      return (
        <div className="sim-box vedic-sim">
          <div className="sim-title">
            <Activity size={16} className="text-accent" />
            <span>Hive NoSQL Cache Simulator</span>
          </div>
          <p className="sim-desc">
            Toggle network status to verify offline membership/workout cache.
          </p>
          <button
            type="button"
            className={`btn btn-sm btn-block ${state.isOffline ? 'btn-secondary' : 'btn-outline'}`}
            onClick={(e) => {
              e.stopPropagation();
              state.setIsOffline(!state.isOffline);
            }}
          >
            {state.isOffline ? 'Switch to Online Mode' : 'Simulate Flaky / Offline Mode'}
          </button>
          <div className="sim-cache-log">
            Status: {state.isOffline ? 'OFFLINE (Read from Hive local box: 0.8ms)' : 'ONLINE (Synced via Dio REST)'}
          </div>
        </div>
      );

    case 'resiliohub':
      return (
        <div className="sim-box crm-sim">
          <div className="sim-title">
            <Send size={16} className="text-accent" />
            <span>Live Agent Reply Simulator</span>
          </div>
          <form onSubmit={state.sendMessage} className="crm-sim-form">
            <input
              type="text"
              placeholder="Type customer reply..."
              value={state.inputText}
              onChange={(e) => state.setInputText(e.target.value)}
              className="sim-input"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Send
            </button>
          </form>
          <span className="sim-hint">Simulates WebSocket event broadcast to all connected agents.</span>
        </div>
      );

    case 'clinic-management':
      return (
        <div className="sim-box clinic-sim">
          <div className="sim-title">
            <Activity size={16} className="text-accent" />
            <span>Queue Triage Dispatcher</span>
          </div>
          <p className="sim-desc">
            Advance clinic queue to generate synchronized prescription tokens.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm btn-block"
            onClick={(e) => {
              e.stopPropagation();
              state.setCurrentToken((prev) => prev + 1);
            }}
          >
            Call Next Patient (Token #{state.currentToken + 1})
          </button>
        </div>
      );

    case 'digislips':
      return (
        <div className="sim-box slips-sim">
          <div className="sim-title">
            <FileSignature size={16} className="text-accent" />
            <span>Cryptographic Glass Signer</span>
          </div>
          <p className="sim-desc">
            Sign authorization with SHA-256 tamper-proof verification.
          </p>
          <button
            type="button"
            className={`btn btn-sm btn-block ${state.isSigned ? 'btn-secondary' : 'btn-primary'}`}
            onClick={(e) => {
              e.stopPropagation();
              state.setIsSigned(!state.isSigned);
            }}
          >
            {state.isSigned ? 'Revoke Signature' : 'Sign & Authorize Circular'}
          </button>
          {state.isSigned && (
            <div className="hash-proof">Hash: e3b0c44298fc1c149afbf4c8996fb9... [VERIFIED]</div>
          )}
        </div>
      );

    case 'sih-fixly':
    default:
      return (
        <div className="sim-box sih-sim">
          <div className="sim-title">
            <MapPin size={16} className="text-accent" />
            <span>GPS Geotag Sensor Lock</span>
          </div>
          <p className="sim-desc">
            Locks EXIF coordinates on live defect photo to prevent spoofing.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm btn-block"
            onClick={(e) => {
              e.stopPropagation();
              state.setGpsLocked(!state.gpsLocked);
            }}
          >
            {state.gpsLocked ? 'Re-scan GPS Satellites' : 'Lock Satellite Coordinates'}
          </button>
          <div className="sim-cache-log">
            Status: {state.gpsLocked ? 'GPS LOCKED: Accuracy ±1.4m' : 'Searching for GPS Lock...'}
          </div>
        </div>
      );
  }
}

export default LivingDevice;
