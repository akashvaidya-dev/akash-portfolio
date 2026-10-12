import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, RotateCcw, Check, Palette } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import { ACCENT_PALETTES, CORNER_STYLES, ANIMATION_PREFERENCES } from '../data/theme';

/**
 * Slide-out Theme Customizer Drawer
 * Allows visitors to personalize the portfolio from anywhere across all routes.
 */
function ThemeCustomizerDrawer({ isOpen, onClose }) {
  const {
    theme,
    accent,
    corners,
    animation,
    setTheme,
    setAccent,
    setCorners,
    setAnimation,
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
              <div className="drawer-section mt-5">
                <div className="drawer-section-title">
                  <span>Accent color</span>
                  <span className="text-xs font-semibold" style={{ color: activeAccent.hex }}>
                    {activeAccent.name}
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

              {/* 3. Corner Style */}
              <div className="drawer-section mt-5">
                <div className="drawer-section-title">
                  <span>Corner style</span>
                  <span className="text-xs text-muted">{corners}</span>
                </div>
                <div className="drawer-grid-3">
                  {CORNER_STYLES.map((style) => {
                    const isSelected = corners === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setCorners(style.id)}
                        className={`drawer-option-pill ${isSelected ? 'drawer-pill-active' : ''}`}
                      >
                        <span>{style.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Animation Preference */}
              <div className="drawer-section mt-5">
                <div className="drawer-section-title">
                  <span>Animation preference</span>
                  <span className="text-xs text-muted">{animation}</span>
                </div>
                <div className="drawer-motion-col">
                  {ANIMATION_PREFERENCES.map((pref) => {
                    const isSelected = animation === pref.id;
                    return (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => setAnimation(pref.id)}
                        className={`drawer-motion-pill ${isSelected ? 'drawer-pill-active' : ''}`}
                      >
                        <div className="text-left">
                          <div className="font-medium text-sm">{pref.name}</div>
                          <div className="text-xs text-muted">{pref.description}</div>
                        </div>
                        {isSelected && <Check size={14} className="text-accent" />}
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
