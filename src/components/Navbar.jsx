import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Terminal } from 'lucide-react';
import { socialLinks } from '../data/socials';

const NAV_ITEMS = [
  { id: 'home', name: 'Home', path: '/' },
  { id: 'about', name: 'About', path: '/about' },
  { id: 'projects', name: 'Projects', path: '/projects' },
  { id: 'experience', name: 'Experience', path: '/experience' },
  { id: 'contact', name: 'Contact', path: '/contact' },
];

/**
 * Navbar Component with:
 * 1. Ultra-smooth Liquid Glassmorphism Dock & Water Ripple Effect.
 *    - Specular rim highlight, backdrop blur, fluid caustic reflections.
 *    - Localized water ripple waves expanding on click.
 * 2. Stationary Nav Options with Sliding & Draggable Notch Indicator:
 *    - All menu options (Home, About, Projects, Experience, Contact) remain strictly fixed in place.
 *    - Only the liquid glass notch / active indicator pill moves between options.
 *    - Spring-physics animated gliding when selecting or clicking tabs.
 *    - The notch can also be grabbed and dragged horizontally across options, snapping to the target.
 * 3. Mobile Responsive Drawer & Akash-OS Terminal launcher.
 */
function Navbar({ onOpenTerminal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDraggingNotch, setIsDraggingNotch] = useState(false);
  const [hoveredTabId, setHoveredTabId] = useState(null);
  const [waterRipples, setWaterRipples] = useState([]);
  const [dragConstraints, setDragConstraints] = useState({ left: -240, right: 240 });

  const navContainerRef = useRef(null);
  const itemRefs = useRef({});
  const rippleIdRef = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Current active item based on current URL
  const activeItem =
    NAV_ITEMS.find((item) =>
      item.path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(item.path)
    ) || NAV_ITEMS[0];

  // Dynamically compute dock drag boundaries for the notch relative to the active tab
  useEffect(() => {
    const updateConstraints = () => {
      if (!navContainerRef.current || !activeItem) return;
      const activeEl = itemRefs.current[activeItem.id];
      if (!activeEl) return;
      const dockRect = navContainerRef.current.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      setDragConstraints({
        left: Math.round(dockRect.left + 8 - activeRect.left),
        right: Math.round(dockRect.right - 8 - activeRect.right),
      });
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [activeItem]);

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

  // Handle Tab Click & Trigger Water Ripple Wave
  const handleNavPillClick = (e, item) => {
    if (isDraggingNotch) return;

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

    if (location.pathname !== item.path) {
      navigate(item.path);
    }
  };

  // Drag notch across fixed options
  const handleNotchDrag = (event, info) => {
    const pointerX = info.point.x;
    for (const item of NAV_ITEMS) {
      const el = itemRefs.current[item.id];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (pointerX >= rect.left && pointerX <= rect.right) {
        setHoveredTabId(item.id);
        return;
      }
    }
  };

  // Release notch: snap to nearest target option and navigate
  const handleNotchDragEnd = (event, info) => {
    setIsDraggingNotch(false);
    setHoveredTabId(null);
    const pointerX = info.point.x;

    let closestItem = activeItem;
    let minDistance = Infinity;

    for (const item of NAV_ITEMS) {
      const el = itemRefs.current[item.id];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dist = Math.abs(pointerX - centerX);
      if (dist < minDistance) {
        minDistance = dist;
        closestItem = item;
      }
    }

    if (closestItem && closestItem.path !== location.pathname) {
      navigate(closestItem.path);
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

        {/* Desktop Navigation: Liquid Glass Dock with Sliding & Draggable Notch */}
        <nav className="navbar-nav-desktop" aria-label="Main navigation">
          <div
            ref={navContainerRef}
            className="nav-liquid-glass-dock"
            title="Tip: Click any tab or drag the liquid notch to navigate"
          >
            {/* Specular Top Rim Reflection & Fluid Caustic Flow */}
            <div className="dock-specular-reflection" aria-hidden="true" />
            <div className="dock-fluid-flow" aria-hidden="true" />

            <ul className="nav-list fixed-nav-list">
              {NAV_ITEMS.map((item) => {
                const isActive = item.id === activeItem.id;
                const isHovered = item.id === hoveredTabId && !isActive;

                return (
                  <li key={item.id} className="nav-item">
                    <button
                      type="button"
                      ref={(el) => {
                        itemRefs.current[item.id] = el;
                      }}
                      onClick={(e) => handleNavPillClick(e, item)}
                      className={`nav-link nav-liquid-pill ${isActive ? 'nav-link-active' : ''} ${isHovered ? 'nav-link-hovered' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {/* Fixed Stationary Tab Label */}
                      <span className="nav-link-text">{item.name}</span>

                      {/* Moving Notch: Liquid Water-Drop Glass Indicator */}
                      {isActive && (
                        <motion.span
                          layoutId="navbar-indicator"
                          className={`nav-indicator nav-water-drop-indicator ${isDraggingNotch ? 'notch-dragging' : ''}`}
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 30,
                          }}
                          drag="x"
                          dragConstraints={dragConstraints}
                          dragElastic={0.15}
                          dragSnapToOrigin={true}
                          onDragStart={() => setIsDraggingNotch(true)}
                          onDrag={handleNotchDrag}
                          onDragEnd={handleNotchDragEnd}
                          whileDrag={{
                            scale: 1.05,
                            cursor: 'grabbing',
                          }}
                          title="Drag notch along options to navigate"
                        >
                          <span className="water-drop-core" />
                          <span className="notch-handle-pip" />
                          <span className="water-drop-sheen" />
                        </motion.span>
                      )}

                      {/* Water Ripple Waves Container */}
                      <span className="pill-ripple-container" aria-hidden="true">
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
                      </span>
                    </button>
                  </li>
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
                {NAV_ITEMS.map((item) => (
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
