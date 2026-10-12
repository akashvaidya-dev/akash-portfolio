import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Terminal } from 'lucide-react';
import { socialLinks } from '../data/socials';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Experience', path: '/experience' },
  { name: 'Contact', path: '/contact' },
];

/**
 * Navbar Component
 * Responsive, accessible navigation bar with dark charcoal & emerald accents,
 * active route indicator, mobile drawer, and Akash-OS Terminal launcher.
 */
function Navbar({ onOpenTerminal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMenu} aria-label="Akash Vaidya Portfolio Home">
          <span className="brand-bracket">&lt;</span>
          <span className="brand-name">Akash</span>
          <span className="brand-dot">.</span>
          <span className="brand-surname">dev</span>
          <span className="brand-bracket">/&gt;</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav-desktop" aria-label="Main navigation">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.name}</span>
                      {isActive && (
                        <motion.span
                          layoutId="navbar-indicator"
                          className="nav-indicator"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Header Actions */}
        <div className="navbar-actions-desktop">
          {onOpenTerminal && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onOpenTerminal}
              aria-label="Launch Visitor Terminal"
              title="Open Terminal (Press ` or Ctrl+K)"
            >
              <Terminal size={14} className="text-accent" />
              <span>Terminal</span>
            </button>
          )}

          <Link to="/contact" className="btn btn-primary btn-sm">
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
              className="mobile-drawer"
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
                    key={item.path}
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
