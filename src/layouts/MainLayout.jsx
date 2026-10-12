import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CursorUniverse from '../components/CursorUniverse';
import VisitorTerminal from '../components/VisitorTerminal';

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
 * 3D CursorUniverse background, and interactive Akash-OS VisitorTerminal.
 */
function MainLayout() {
  const [terminalOpen, setTerminalOpen] = useState(false);

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
      <Navbar onOpenTerminal={() => setTerminalOpen(true)} />

      {/* Main Content */}
      <main className="main-content" id="main-content" style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Floating OS Terminal HUD Trigger */}
      <button
        type="button"
        className="floating-terminal-trigger-btn"
        onClick={() => setTerminalOpen(true)}
        aria-label="Open Futuristic Akash-OS Visitor Terminal"
        title="Open OS Terminal (Press ` or Ctrl+K)"
      >
        <Terminal size={14} className="text-accent" />
        <span>Akash-OS</span>
        <span className="terminal-hotkey-badge">~</span>
      </button>

      {/* Futuristic Visitor Terminal Modal */}
      <VisitorTerminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />
    </>
  );
}

export default MainLayout;
