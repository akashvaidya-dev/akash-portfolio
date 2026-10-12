import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, RotateCcw, Check, Palette } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import { ACCENT_PALETTES } from '../data/theme';

/**
 * Slide-out Theme Customizer Drawer
 * Allows visitors to personalize appearance and accent colors across all routes.
 */
function ThemeCustomizerDrawer({ isOpen, onClose }) {
  const {
    theme,
    accent,
    setTheme,
    setAccent,
    resetDefaults,
    activeAccent,
  } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="theme-drawer-root">
          {/* Backdrop Overlay */}
          <motion.div
            className="theme-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Slide-in Panel */}
          <motion.aside
            className="theme-customizer-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            aria-label="Theme & Design System Customizer"
          >
            {/* Drawer Header */}
            <div className="drawer-header">
              <div className="drawer-header-title">
                <Palette size={18} className="text-accent" />
                <div>
                  <h3 className="drawer-heading">Design System Studio</h3>
                  <p className="drawer-subheading">Personalize your visual experience</p>
                </div>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={onClose}
                aria-label="Close customizer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body with Customization Sections */}
            <div className="drawer-scroll-body">
              {/* 1. Appearance */}
              <div className="drawer-section">
                <div className="drawer-section-title">
                  <span>Appearance</span>
                  <span className="text-xs text-muted">
                    {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                  </span>
                </div>
                <div className="drawer-grid-2">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`drawer-option-pill ${theme === 'light' ? 'drawer-pill-active' : ''}`}
                  >
                    <Sun size={15} />
                    <span>☀️ Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`drawer-option-pill ${theme === 'dark' ? 'drawer-pill-active' : ''}`}
                  >
                    <Moon size={15} />
                    <span>🌙 Dark</span>
                  </button>
                </div>
              </div>

              {/* 2. Accent Color */}
              <div className="drawer-section mt-6">
                <div className="drawer-section-title">
                  <span>Accent color</span>
                  <span className="text-xs font-semibold" style={{ color: activeAccent?.hex }}>
                    {activeAccent?.name}
                  </span>
                </div>
                <div className="drawer-swatches-grid">
                  {ACCENT_PALETTES.map((palette) => {
                    const isSelected = accent === palette.id;
                    return (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => setAccent(palette.id)}
                        className={`drawer-swatch-chip ${isSelected ? 'drawer-swatch-active' : ''}`}
                        title={palette.name}
                      >
                        <span
                          className="drawer-swatch-circle"
                          style={{ backgroundColor: palette.hex }}
                        >
                          {isSelected && <Check size={11} className="text-white" />}
                        </span>
                        <span className="drawer-swatch-name">{palette.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="drawer-footer">
              <button
                type="button"
                onClick={resetDefaults}
                className="btn btn-secondary btn-sm drawer-reset-btn"
              >
                <RotateCcw size={13} />
                <span>Reset to default</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-primary btn-sm"
              >
                <span>Done</span>
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ThemeCustomizerDrawer;
