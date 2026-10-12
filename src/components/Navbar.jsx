import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Terminal, GripVertical } from 'lucide-react';
import { socialLinks } from '../data/socials';

const defaultNavItems = [
  { id: 'home', name: 'Home', path: '/' },
  { id: 'about', name: 'About', path: '/about' },
  { id: 'projects', name: 'Projects', path: '/projects' },
  { id: 'experience', name: 'Experience', path: '/experience' },
  { id: 'contact', name: 'Contact', path: '/contact' },
];

/**
 * Navbar Component with:
 * 1. Ultra-smooth Glassmorphism & Liquid Water-drop Ripple Effect.
 *    - Glass pill container with specular rim highlight, noise/backdrop-filter blur.
 *    - Dynamic liquid ripple expanding from pointer location on click & hover.
 * 2. Draggable & Reorderable Navigation Options.
 *    - Interactive Framer Motion reordering: grab, drag, and reorder tabs freely.
 *    - Spring-physics snapping and haptic visual feedback while dragging.
 *    - Visual drag affordance indicator with grab cursor.
 * 3. Mobile Responsive Drawer & Akash-OS Terminal launcher.
 */
function Navbar({ onOpenTerminal }) {
  const [navItems, setNavItems] = useState(defaultNavItems);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDragId, setActiveDragId] = useState(null);
  const [waterRipples, setWaterRipples] = useState([]);

  const navContainerRef = useRef(null);
  const rippleIdRef = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Monitor scroll for subtle shadow & background blur transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  // Liquid Water Ripple Effect on Click
  const handleNavPillClick = (e, item) => {
    const navPill = e.currentTarget;
    const rect = navPill.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    rippleIdRef.current += 1;
    const currentRippleId = rippleIdRef.current;

    const newRipple = {
      id: currentRippleId,
      x,
      y,
      itemId: item.id,
    };

    setWaterRipples((prev) => [...prev.slice(-6), newRipple]);

    setTimeout(() => {
      setWaterRipples((prev) => prev.filter((r) => r.id !== currentRippleId));
    }, 900);

    // If item was clicked rather than dragged, navigate cleanly
    if (!activeDragId && location.pathname !== item.path) {
      navigate(item.path);
    }
  };

  // Drag reordering logic
  const handleDragEnd = (event, info, itemId) => {
    setActiveDragId(null);
    const offset = info.offset.x;
    const threshold = 40; // pixel distance to shift item position

    if (Math.abs(offset) > threshold) {
      const currentIndex = navItems.findIndex((it) => it.id === itemId);
      let targetIndex;

      if (offset > 0) {
        // Dragged right
        const steps = Math.min(Math.round(offset / 70), navItems.length - 1 - currentIndex);
        targetIndex = Math.min(navItems.length - 1, currentIndex + Math.max(1, steps));
      } else {
        // Dragged left
        const steps = Math.min(Math.round(Math.abs(offset) / 70), currentIndex);
        targetIndex = Math.max(0, currentIndex - Math.max(1, steps));
      }

      if (targetIndex !== currentIndex) {
        const reordered = [...navItems];
        const [movedItem] = reordered.splice(currentIndex, 1);
        reordered.splice(targetIndex, 0, movedItem);
        setNavItems(reordered);
      }
    }
  };

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
      {/* Background Liquid Water Refraction & Caustic Glow */}
      <div className="navbar-water-caustic" aria-hidden="true" />

      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMenu} aria-label="Akash Vaidya Portfolio Home">
          <span className="brand-bracket">&lt;</span>
          <span className="brand-name">Akash</span>
          <span className="brand-dot">.</span>
          <span className="brand-surname">dev</span>
          <span className="brand-bracket">/&gt;</span>
        </Link>

        {/* Desktop Navigation: Liquid Glass Dock with Draggable Options */}
        <nav className="navbar-nav-desktop" aria-label="Main navigation">
          <div
            ref={navContainerRef}
            className="nav-liquid-glass-dock"
            title="Tip: You can click, select, or drag tabs horizontally to reorder them"
          >
            {/* Water Drop Surface Highlight */}
            <div className="dock-specular-reflection" aria-hidden="true" />
            <div className="dock-fluid-flow" aria-hidden="true" />

            <ul className="nav-list draggable-nav-list">
              {navItems.map((item) => {
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);
                const isDragging = activeDragId === item.id;

                return (
                  <motion.li
                    key={item.id}
                    layout
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 32,
                    }}
                    className={`nav-draggable-item ${isDragging ? 'dragging' : ''}`}
                  >
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: -140, right: 140 }}
                      dragElastic={0.2}
                      onDragStart={() => setActiveDragId(item.id)}
                      onDragEnd={(e, info) => handleDragEnd(e, info, item.id)}
                      whileDrag={{
                        scale: 1.08,
                        zIndex: 20,
                        cursor: 'grabbing',
                      }}
                      className="nav-drag-handle"
                    >
                      <button
                        type="button"
                        onClick={(e) => handleNavPillClick(e, item)}
                        className={`nav-link nav-liquid-pill ${isActive ? 'nav-link-active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {/* Drag Handle Grip Icon */}
                        <span className="drag-grip-icon" title="Drag to move" aria-hidden="true">
                          <GripVertical size={11} />
                        </span>

                        <span className="nav-link-text">{item.name}</span>

                        {/* Active Water-Drop Droplet Glow */}
                        {isActive && (
                          <motion.span
                            layoutId="navbar-indicator"
                            className="nav-indicator nav-water-drop-indicator"
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                          >
                            <span className="water-drop-core" />
                            <span className="water-drop-sheen" />
                          </motion.span>
                        )}

                        {/* Water Ripple Waves */}
                        {waterRipples
                          .filter((r) => r.itemId === item.id)
                          .map((ripple) => (
                            <span
                              key={ripple.id}
                              className="water-ripple-wave"
                              style={{
                                left: ripple.x,
                                top: ripple.y,
                              }}
                            />
                          ))}
                      </button>
                    </motion.div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Desktop Header Actions */}
        <div className="navbar-actions-desktop">
          {onOpenTerminal && (
            <button
              type="button"
              className="btn btn-secondary btn-sm nav-glass-btn"
              onClick={onOpenTerminal}
              aria-label="Launch Visitor Terminal"
              title="Open Terminal (Press ` or Ctrl+K)"
            >
              <Terminal size={14} className="text-accent" />
              <span>Terminal</span>
            </button>
          )}

          <Link to="/contact" className="btn btn-primary btn-sm nav-glass-cta">
            <span>Let's Talk</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMenu}
          >
            <motion.div
              className="mobile-drawer mobile-glass-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-drawer-header">
                <span className="brand-name">Menu</span>
                <button
                  type="button"
                  className="mobile-close-btn"
                  onClick={closeMenu}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="mobile-nav-list" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
                    onClick={closeMenu}
                  >
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="mobile-drawer-footer">
                {onOpenTerminal && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-block"
                    onClick={() => {
                      closeMenu();
                      onOpenTerminal();
                    }}
                  >
                    <Terminal size={16} className="text-accent" />
                    <span>Open Akash-OS Terminal</span>
                  </button>
                )}

                <Link to="/contact" className="btn btn-primary btn-block" onClick={closeMenu}>
                  <span>Get in Touch</span>
                  <ArrowUpRight size={16} />
                </Link>
                <div className="mobile-status">
                  <span className="pulsing-dot" aria-hidden="true" />
                  <span>{socialLinks.availability}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
