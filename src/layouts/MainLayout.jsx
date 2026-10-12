import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Terminal, Palette } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CursorUniverse from '../components/CursorUniverse';
import VisitorTerminal from '../components/VisitorTerminal';
import ThemeCustomizerDrawer from '../components/ThemeCustomizerDrawer';
import LiveDeveloperStatus from '../components/LiveDeveloperStatus';

/**
 * ScrollToTop Component
 * Ensures the viewport resets to the top when navigating between routes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

/**
 * MainLayout Component
 * Wraps page routes with shared Navbar, Main content wrapper, Footer,
 * 3D CursorUniverse background, interactive Akash-OS VisitorTerminal,
 * and the Adaptive Design System ThemeCustomizerDrawer.
 */
function MainLayout() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [themeStudioOpen, setThemeStudioOpen] = useState(false);

  // Global Keyboard Shortcut: Backtick (`) or Ctrl+K / Cmd+K to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is actively typing in an input or textarea
      const targetTag = e.target.tagName.toLowerCase();
      const isInput = targetTag === 'input' || targetTag === 'textarea';

      if (e.key === '`' && !isInput) {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <ScrollToTop />

      {/* 04. Cursor-Reactive Three.js & GSAP Universe Background */}
      <CursorUniverse />

      {/* Navigation */}
      <Navbar
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenThemeStudio={() => setThemeStudioOpen(true)}
      />

      {/* Main Content */}
      <main className="main-content" id="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      {/* Live Developer Status (Bottom Telemetry) */}
      <LiveDeveloperStatus />

      {/* Footer */}
      <Footer />

      {/* Floating Action Triggers HUD */}
      <div className="floating-hud-dock" aria-label="Quick actions dock">
        {/* Design System Studio Trigger */}
        <button
          type="button"
          className="floating-hud-btn floating-theme-trigger-btn"
          onClick={() => setThemeStudioOpen(true)}
          aria-label="Open Design System Studio"
          title="Customize Theme & Design System"
        >
          <Palette size={14} className="text-accent" />
          <span>Theme Studio</span>
        </button>

        {/* Persistent Floating OS Terminal HUD Trigger */}
        <button
          type="button"
          className="floating-hud-btn floating-terminal-trigger-btn"
          onClick={() => setTerminalOpen(true)}
          aria-label="Open Futuristic Akash-OS Visitor Terminal"
          title="Open OS Terminal (Press ` or Ctrl+K)"
        >
          <Terminal size={14} className="text-accent" />
          <span>Akash-OS</span>
          <span className="terminal-hotkey-badge">~</span>
        </button>
      </div>

      {/* Futuristic Visitor Terminal Modal */}
      <VisitorTerminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />

      {/* Slide-out Adaptive Design System Customizer Drawer */}
      <ThemeCustomizerDrawer
        isOpen={themeStudioOpen}
        onClose={() => setThemeStudioOpen(false)}
      />
    </>
  );
}

export default MainLayout;
