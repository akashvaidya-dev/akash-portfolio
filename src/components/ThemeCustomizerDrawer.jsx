import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sun,
  Moon,
  RotateCcw,
  Check,
  Palette,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { useTheme } from '../context/useTheme';
import { ACCENT_PALETTES, TIME_PERIODS } from '../data/theme';

/**
 * Slide-out Theme Customizer Drawer
 * Allows visitors to personalize appearance, accent colors, and Living Time Theme.
 */
function ThemeCustomizerDrawer({ isOpen, onClose }) {
  const {
    theme,
    manualTheme,
    accent,
    setTheme,
    setAccent,
    resetDefaults,
    activeAccent,
    livingTimeEnabled,
    toggleLivingTime,
    activePeriod,
    activePeriodData,
    previewPeriod,
    setPreviewPeriod,
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
              {/* =======================================================
                  1. Living Time Theme Feature Toggle & Period Showcase
                 ======================================================= */}
              <div className="drawer-section living-time-feature-card">
                <div className="living-time-header-row">
                  <div className="living-time-title-wrap">
                    <div className="living-time-icon-badge">
                      <Clock size={16} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="living-time-title">Living Time Theme</h4>
                      <p className="living-time-desc">
                        Let your portfolio evolve with the time of day.
                      </p>
                    </div>
                  </div>

                  {/* Accessible Switch Toggle */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={livingTimeEnabled}
                    onClick={toggleLivingTime}
                    className={`living-time-switch ${
                      livingTimeEnabled ? 'living-time-switch-on' : ''
                    }`}
                    aria-label="Toggle Living Time Theme"
                    title={
                      livingTimeEnabled
                        ? 'Disable Living Time Theme (restore manual appearance)'
                        : 'Enable Living Time Theme (auto-adapt to local time)'
                    }
                  >
                    <span className="living-time-switch-handle">
                      {livingTimeEnabled ? (
                        <Sparkles size={11} className="switch-sparkle-icon" />
                      ) : null}
                    </span>
                  </button>
                </div>

                {/* Living Time Active State Details */}
                {livingTimeEnabled ? (
                  <motion.div
                    className="living-time-active-panel mt-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="active-period-badge">
                      <span className="period-badge-emoji">{activePeriodData.emoji}</span>
                      <span className="period-badge-text">
                        <strong>Currently: {activePeriodData.name}</strong> ({activePeriodData.timeRange})
                      </span>
                    </div>

                    <p className="period-tagline-text mt-1 text-xs text-muted">
                      {activePeriodData.tagline}
                    </p>

                    {/* Interactive Period Tester for Visitors / Developers */}
                    <div className="period-tester-box mt-3">
                      <div className="period-tester-header">
                        <span className="text-xs font-semibold">Preview Time Periods</span>
                        {previewPeriod && (
                          <button
                            type="button"
                            onClick={() => setPreviewPeriod(null)}
                            className="period-reset-btn text-xs text-accent"
                          >
                            Reset to live clock
                          </button>
                        )}
                      </div>
                      <div className="period-tester-grid mt-2">
                        {TIME_PERIODS.map((period) => {
                          const isActive = activePeriod === period.id;
                          return (
                            <button
                              key={period.id}
                              type="button"
                              onClick={() => setPreviewPeriod(period.id)}
                              className={`period-tester-chip ${
                                isActive ? 'period-tester-chip-active' : ''
                              }`}
                              title={`${period.name}: ${period.timeRange}`}
                            >
                              <span className="period-chip-emoji">{period.emoji}</span>
                              <span className="period-chip-name">{period.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="living-time-off-status mt-2">
                    <span className="status-dot-off" />
                    <span className="text-xs text-muted">
                      OFF · Using your manually saved appearance
                    </span>
                  </div>
                )}
              </div>

              {/* =======================================================
                  2. Appearance (Light / Dark)
                 ======================================================= */}
              <div className="drawer-section mt-5">
                <div className="drawer-section-title">
                  <span>Manual appearance</span>
                  <span className="text-xs text-muted">
                    {livingTimeEnabled
                      ? `Auto: ${theme === 'dark' ? '🌙 Dark' : '☀️ Light'}`
                      : manualTheme === 'dark'
                      ? '🌙 Dark'
                      : '☀️ Light'}
                  </span>
                </div>

                {livingTimeEnabled && (
                  <div className="auto-mode-note mb-2">
                    <Info size={13} className="text-accent mr-1.5 flex-shrink-0" />
                    <span className="text-xs text-muted">
                      Living Time is actively adjusting surfaces. Selecting Light or Dark below will switch to manual mode.
                    </span>
                  </div>
                )}

                <div className="drawer-grid-2">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`drawer-option-pill ${
                      (!livingTimeEnabled && manualTheme === 'light') ||
                      (livingTimeEnabled && theme === 'light')
                        ? 'drawer-pill-active'
                        : ''
                    }`}
                  >
                    <Sun size={15} />
                    <span>☀️ Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`drawer-option-pill ${
                      (!livingTimeEnabled && manualTheme === 'dark') ||
                      (livingTimeEnabled && theme === 'dark')
                        ? 'drawer-pill-active'
                        : ''
                    }`}
                  >
                    <Moon size={15} />
                    <span>🌙 Dark</span>
                  </button>
                </div>
              </div>

              {/* =======================================================
                  3. Accent Color (6 Curated Options)
                 ======================================================= */}
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
                title="Reset to default theme and emerald accent"
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
