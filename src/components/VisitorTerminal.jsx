import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, RotateCcw } from 'lucide-react';
import { projects } from '../data/projects';
import { skillCategories } from '../data/skills';
import { socialLinks } from '../data/socials';
import { experienceTimeline } from '../data/experience';

/**
 * VisitorTerminal Component
 * Futuristic Operating System Terminal for visitors.
 * Allows interactive exploration of projects, skills, contact, and architecture via commands.
 * Accessible globally via hotkey (~ or Ctrl+K) or persistent OS HUD button.
 */
function VisitorTerminal({ isOpen, onClose }) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    {
      type: 'system',
      text: `   ___    __              __        ____  _____
  /   |  / /______ ______/ /_      / __ \\/ ___/
 / /| | / //_/ __ \`/ ___/ __ \\    / / / /\\__ \\ 
/ ___ |/ ,< / /_/ (__  ) / / /   / /_/ /___/ / 
/_/  |_/_/|_|\\__,_/____/_/ /_/____\\____//____/  
                            /_____/             
Akash-OS v2.4.0 [Flutter Engine & React 19 Terminal Shell]
Type 'help' to view available commands, or click the quick action chips below.`,
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [pastInputs, setPastInputs] = useState([]);
  const [isMaximized, setIsMaximized] = useState(false);
  const [theme, setTheme] = useState('emerald'); // emerald, cyan, amber, matrix

  const inputRef = useRef(null);
  const terminalBodyRef = useRef(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom on new output
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmdText) => {
    const raw = cmdText.trim();
    if (!raw) return;

    setPastInputs((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    // Add user command entry
    setHistory((prev) => [...prev, { type: 'user', text: raw }]);

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ').toLowerCase();

    switch (cmd) {
      case 'help':
        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `COMMANDS:
  help              Show this list
  projects          Personal / public projects only
  project <id>      Details (sih-fixly | portfolio-site)
  bugs              Notes on bugs I've fixed
  skills            Flutter skill list
  about             Short bio
  experience        1.5 years junior Flutter + education
  contact           Email, GitHub, LinkedIn
  clear             Clear screen
  exit              Close terminal`,
          },
        ]);
        break;

      case 'bugs':
      case 'deathnote':
      case 'buglog':
        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `DEATH NOTE — THE BUG LOG (ELIMINATED DEFECTS):
--------------------------------------------------------------------------------
RULE: "The bug whose root cause is accurately inscribed shall never crash production again."

#001 [ELIMINATED] The Case of the Expired Token Stampede
     Target: Riverpod Auth Interceptor · REST API
     Fix: Thread-safe Async Mutex & Queued Request Single-Flight Barrier

#002 [ELIMINATED] The Case of the Zombie Thermal Buffer
     Target: Xtream Arena · ESC/POS Hardware Printing Engine
     Fix: 512-Byte Chunking with Real-time DLE EOT 1 Status Backpressure

#003 [ELIMINATED] The Case of the Phantom Hive Overwrite
     Target: FitPassio · Offline Hive NoSQL Cache
     Fix: Optimistic Revision Versioning & Monotonic Dirty Delta Queue

#004 [ELIMINATED] The Case of the Runaway WebSocket Storm
     Target: ResilioHub CRM · Real-time Chat Engine
     Fix: Socket.IO reconnect backoff & single-flight message queue

#005 [ELIMINATED] The Case of the Teleporting GPS Pin
     Target: Fixly (SIH) · Mapbox Location Pipeline
     Fix: Accuracy gating threshold + smoothed location updates

#006 [ELIMINATED] The Case of the Vanishing Parental Signature
     Target: DigiSlips · Touch Canvas & Cryptographic Sealing
     Fix: Catmull-Rom Distance Deduplication + SVG Stroke Bounding Verification

Scroll to "#death-note-bug-log" on the Home page to inspect the interactive notebook dossier.`,
          },
        ]);
        break;

      case 'projects':
        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `PERSONAL / PUBLIC PROJECTS (office apps not listed):
--------------------------------------------------------------------------------
1. FIXLY (SIH)
   • Bookings, Mapbox, Razorpay, WebRTC
   • Flutter · BLoC · GoRouter · Socket.IO
   • project sih-fixly

2. THIS PORTFOLIO
   • React + Vite, handmade
   • project portfolio-site
--------------------------------------------------------------------------------
Client work stays private. Ask in an interview if you want details.`,
          },
        ]);
        break;

      case 'project':
      case 'cat': {
        if (!args) {
          setHistory((prev) => [
            ...prev,
            {
              type: 'error',
              text: "Usage: project <id>\nAvailable IDs: sih-fixly, portfolio-site",
            },
          ]);
          break;
        }

        const match = projects.find(
          (p) => p.id.toLowerCase() === args || p.title.toLowerCase().includes(args)
        );

        if (match) {
          setHistory((prev) => [
            ...prev,
            {
              type: 'output',
              text: `================================================================================
PROJECT BLUEPRINT: ${match.title.toUpperCase()}
================================================================================
Category:     ${match.category}
Architecture: ${match.architecture}
Key Result:   ${match.metric}

PROBLEM STATEMENT:
${match.problem}

ENGINEERING SOLUTION:
${match.solution}

HIGHLIGHTS:
${match.highlights.map((h) => `  • ${h}`).join('\n')}

TECHNOLOGIES:
[ ${match.tags.join(' | ')} ]
${match.githubUrl ? `GitHub: ${match.githubUrl}` : 'Proprietary Commercial Codebase'}
================================================================================`,
            },
          ]);
        } else {
          setHistory((prev) => [
            ...prev,
            {
              type: 'error',
              text: `Project '${args}' not found. Type 'projects' to view all valid project IDs.`,
            },
          ]);
        }
        break;
      }

      case 'skills': {
        const skillsFormatted = skillCategories
          .map((cat) => {
            const items = cat.skills.map((s) => `    ├─ ${s.name}`).join('\n');
            return `[ ${cat.category.toUpperCase()} ]\n${items}`;
          })
          .join('\n\n');

        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `ENGINEERING CAPABILITIES & SKILL MATRIX:\n--------------------------------------------------------------------------------\n${skillsFormatted}\n--------------------------------------------------------------------------------`,
          },
        ]);
        break;
      }

      case 'about':
        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `AKASH VAIDYA // MOBILE & FRONTEND ENGINEER
--------------------------------------------------------------------------------
Background:
Experienced Flutter developer with deep expertise in cross-platform mobile
architecture, hardware peripherals (thermal receipt printers, voice dictation,
GPS sensors), and offline-first state management (Riverpod, Hive).

Expansion into Web:
Actively expanding into modern React 19 web ecosystems, building high-throughput
CRM dashboards, WebSocket real-time inboxes, and responsive web platforms.

Engineering Philosophy:
1. Predictable unidirectional state flow over arbitrary state mutations.
2. Offline-first resilience: local persistence ensures zero-latency user experiences.
3. Hardware-software integration: bridges hardware peripherals directly with UI.`,
          },
        ]);
        break;

      case 'experience': {
        const expFormatted = experienceTimeline
          .map(
            (m) =>
              `[ ${m.period} ] ${m.role} @ ${m.organization}\n• ${m.description}\n• Tech: ${m.tech.join(', ')}`
          )
          .join('\n\n');

        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `TIMELINE & COMMERCIAL MILESTONES:\n--------------------------------------------------------------------------------\n${expFormatted}\n--------------------------------------------------------------------------------`,
          },
        ]);
        break;
      }

      case 'contact':
        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `COMMUNICATION CHANNELS:
--------------------------------------------------------------------------------
Email:     ${socialLinks.email}
GitHub:    ${socialLinks.github}
LinkedIn:  ${socialLinks.linkedin}
Status:    ${socialLinks.availability}
--------------------------------------------------------------------------------`,
          },
        ]);
        break;

      case 'neofetch':
      case 'sysinfo':
        setHistory((prev) => [
          ...prev,
          {
            type: 'output',
            text: `          /\\          akash@portfolio-os
         /  \\         ------------------
        /\\   \\        OS:        Akash-OS v2.4 (x86_64)
       /  \\   \\       Kernel:    Flutter 3.22 / React 19.2
      /    \\   \\      Shell:     zsh 5.9 (custom-wasm)
     /  /\\  \\   \\     DE:        Framer Motion 3D Canvas
    /  /  \\  \\   \\    Hardware:  ESC/POS Thermal & GPS Sensors
   /__/    \\__\\___\\   Memory:    Hive NoSQL (Sub-100ms)
                      Uptime:    99.98% High Availability`,
          },
        ]);
        break;

      case 'theme':
        if (['emerald', 'cyan', 'amber', 'matrix'].includes(args)) {
          setTheme(args);
          setHistory((prev) => [
            ...prev,
            { type: 'output', text: `Terminal theme switched to: ${args.toUpperCase()}` },
          ]);
        } else {
          setHistory((prev) => [
            ...prev,
            { type: 'error', text: `Usage: theme <emerald | cyan | amber | matrix>` },
          ]);
        }
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'exit':
        onClose();
        break;

      default:
        setHistory((prev) => [
          ...prev,
          {
            type: 'error',
            text: `Command not recognized: '${cmd}'. Type 'help' for directory of valid commands.`,
          },
        ]);
        break;
    }

    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pastInputs.length > 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < pastInputs.length) {
          setHistoryIndex(nextIdx);
          setInputVal(pastInputs[pastInputs.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(pastInputs[pastInputs.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const commands = ['help', 'projects', 'skills', 'about', 'experience', 'contact', 'neofetch', 'clear', 'exit'];
      const match = commands.find((c) => c.startsWith(inputVal.toLowerCase().trim()));
      if (match) {
        setInputVal(match);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="terminal-overlay-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`futuristic-terminal-window theme-${theme} ${isMaximized ? 'maximized' : ''}`}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* CRT Scanline Shader Overlay */}
          <div className="crt-scanlines" />

          {/* Window Title Bar */}
          <div className="terminal-header-bar">
            <div className="window-controls">
              <button
                type="button"
                className="win-btn close"
                onClick={onClose}
                title="Close Terminal (Esc)"
              >
                ✕
              </button>
              <button
                type="button"
                className="win-btn min"
                onClick={onClose}
                title="Minimize Terminal"
              >
                –
              </button>
              <button
                type="button"
                className="win-btn max"
                onClick={() => setIsMaximized(!isMaximized)}
                title="Toggle Maximize"
              >
                +
              </button>
            </div>

            <div className="terminal-title">
              <TerminalIcon size={14} className="terminal-title-icon" />
              <span>akash@portfolio-os: ~ (zsh)</span>
              <span className="live-ping-dot" />
            </div>

            <div className="terminal-actions-right">
              <span className="theme-indicator">[{theme}]</span>
              <button
                type="button"
                className="terminal-reset-btn"
                onClick={() => setHistory([])}
                title="Clear screen"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* Quick Action Command Chips */}
          <div className="terminal-quick-chips">
            <span className="chips-label">Quick Commands:</span>
            {[
              { label: 'help', cmd: 'help' },
              { label: 'projects', cmd: 'projects' },
              { label: 'skills', cmd: 'skills' },
              { label: 'about', cmd: 'about' },
              { label: 'contact', cmd: 'contact' },
              { label: 'sysinfo', cmd: 'neofetch' },
            ].map((chip) => (
              <button
                key={chip.cmd}
                type="button"
                className="quick-chip"
                onClick={() => executeCommand(chip.cmd)}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Terminal History Output Body */}
          <div
            ref={terminalBodyRef}
            className="terminal-body"
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((item, idx) => (
              <div key={idx} className={`term-entry term-${item.type}`}>
                {item.type === 'user' && (
                  <div className="term-prompt-line">
                    <span className="term-prompt-user">visitor@akash-os</span>
                    <span className="term-prompt-symbol">:~$</span>
                    <span className="term-prompt-cmd">{item.text}</span>
                  </div>
                )}
                {item.type !== 'user' && (
                  <pre className="term-output-text">{item.text}</pre>
                )}
              </div>
            ))}

            {/* Active Command Prompt Line */}
            <div className="term-active-prompt">
              <span className="term-prompt-user">visitor@akash-os</span>
              <span className="term-prompt-symbol">:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="term-input"
                autoComplete="off"
                spellCheck="false"
                aria-label="Visitor terminal command line"
              />
              <span className="term-cursor" />
            </div>
          </div>

          {/* Terminal Footer Status Bar */}
          <div className="terminal-footer-bar">
            <span>READY // UTF-8</span>
            <span>PRESS [TAB] TO AUTOCOMPLETE • [↑/↓] FOR HISTORY</span>
            <span>TYPE 'EXIT' OR [ESC] TO CLOSE</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default VisitorTerminal;
