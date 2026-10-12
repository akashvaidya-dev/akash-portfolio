import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Sparkles,
  Sliders,
  RotateCcw,
  Check,
  ArrowUpRight,
  Clock,
  Info,
} from 'lucide-react';
import { useTheme } from '../context/useTheme';
import { ACCENT_PALETTES, TIME_PERIODS } from '../data/theme';

/**
 * Interactive Theme Playground Section
 * Allows visitors to experiment with:
 * - Living Time Theme (automatic adaptation based on local time)
 * - Manual Appearance (Light / Dark)
 * - 6 Curated Accent Colors
 */
function ThemePlayground() {
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
    <section id="theme-studio" className="section theme-playground-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="badge badge-accent mb-3">
            <Sliders size={13} className="mr-1.5" />
            <span>Interactive Theme Studio</span>
          </div>
          <h2 className="section-title">
            Personalize Visual <span className="text-gradient">Experience</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Switch between living time automatic adaptation, manual appearance, and your signature accent color.
            Every component across the portfolio updates automatically.
          </p>
        </div>

        {/* Playground Grid: Left Mini Preview | Right Controls */}
        <div className="playground-layout-grid mt-10">
          {/* =========================================================
              Column 1: Live Interactive Mini Portfolio Preview Card
             ========================================================= */}
          <div className="playground-preview-col">
            <div className="preview-sticky-wrap">
              <div className="preview-card-header">
                <span className="preview-label">Live Preview</span>
                <span className="preview-sync-badge">
                  <Sparkles size={12} />
                  <span>Realtime Sync</span>
                </span>
              </div>

              {/* The Mini Adaptive Preview Card */}
              <motion.div
                className="mini-portfolio-preview-card"
                layout
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              >
                {/* Mini Card Header */}
                <div className="mini-card-topbar">
                  <div className="mini-brand-wrap">
                    <span className="mini-brand-bracket">&lt;</span>
                    <span className="mini-brand-name">akash.dev</span>
                    <span className="mini-brand-bracket">/&gt;</span>
                  </div>
                  <span className="mini-theme-indicator-badge">
                    {livingTimeEnabled
                      ? `${activePeriodData.emoji} ${activePeriodData.name}`
                      : theme === 'dark'
                      ? '🌙 Dark'
                      : '☀️ Light'}
                  </span>
                </div>

                {/* Role / Tagline */}
                <div className="mini-role-pill">
                  <span>FLUTTER DEVELOPER · CREATIVE BUILDER</span>
                </div>

                {/* Main Headline */}
                <h3 className="mini-card-headline">
                  Building digital experiences.
                </h3>
                <p className="mini-card-subtext">
                  Apps, interfaces and interactions made with care.
                </p>

                {/* Mini Action Button */}
                <div className="mini-card-actions">
                  <a
                    href="#projects"
                    className="btn btn-primary btn-sm mini-preview-btn"
                  >
                    <span>View my work</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>

                {/* Tech Pills */}
                <div className="mini-tech-tags">
                  <span className="mini-tech-badge">Flutter</span>
                  <span className="mini-tech-badge">React</span>
                  <span className="mini-tech-badge">Firebase</span>
                </div>

                {/* Live Summary Footer */}
                <div className="mini-card-footer">
                  <span className="pulsing-mini-dot" />
                  <span className="mini-summary-text">
                    {livingTimeEnabled
                      ? `Living Time: ${activePeriodData.name} (${activePeriodData.timeRange}) · ${activeAccent?.name} Accent`
                      : `Theme: ${theme === 'dark' ? 'Dark Mode' : 'Light Mode'} · ${activeAccent?.name || 'Emerald'} Accent`}
                  </span>
                </div>
              </motion.div>

              <p className="preview-note text-center mt-3 text-xs text-muted">
                Changes apply instantly across navbar, cards, devices, code blocks, and forms.
              </p>
            </div>
          </div>

          {/* =========================================================
              Column 2: Interactive Controls
             ========================================================= */}
          <div className="playground-controls-col">
            <div className="controls-panel-card card">
              {/* ---------------------------------------------------------
                  Control 1: Living Time Theme Feature (Automatic Local Time)
                 --------------------------------------------------------- */}
              <div className="control-group living-time-feature-card">
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

                    {/* Interactive Period Tester */}
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
                      OFF · Using your manually saved appearance below
                    </span>
                  </div>
                )}
              </div>

              {/* ---------------------------------------------------------
                  Control 2: Manual Appearance (Light / Dark)
                 --------------------------------------------------------- */}
              <div className="control-group mt-6">
                <div className="control-header">
                  <span className="control-title">Manual Appearance</span>
                  <span className="control-hint">
                    {livingTimeEnabled
                      ? `Auto Mode (${theme === 'dark' ? 'Dark' : 'Light'})`
                      : manualTheme === 'dark'
                      ? 'Immersive · Futuristic · Calm'
                      : 'Clean · Bright · Minimal'}
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

                <div className="segmented-control-grid appearance-toggle-grid">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`segmented-btn ${
                      (!livingTimeEnabled && manualTheme === 'light') ||
                      (livingTimeEnabled && theme === 'light')
                        ? 'segmented-btn-active'
                        : ''
                    }`}
                    aria-pressed={
                      (!livingTimeEnabled && manualTheme === 'light') ||
                      (livingTimeEnabled && theme === 'light')
                    }
                  >
                    <Sun size={15} />
                    <span>☀️ Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`segmented-btn ${
                      (!livingTimeEnabled && manualTheme === 'dark') ||
                      (livingTimeEnabled && theme === 'dark')
                        ? 'segmented-btn-active'
                        : ''
                    }`}
                    aria-pressed={
                      (!livingTimeEnabled && manualTheme === 'dark') ||
                      (livingTimeEnabled && theme === 'dark')
                    }
                  >
                    <Moon size={15} />
                    <span>🌙 Dark</span>
                  </button>
                </div>
              </div>

              {/* ---------------------------------------------------------
                  Control 3: Accent Color (6 Curated Options)
                 --------------------------------------------------------- */}
              <div className="control-group mt-6">
                <div className="control-header">
                  <span className="control-title">Accent color</span>
                  <span className="control-value-badge" style={{ color: activeAccent?.hex }}>
                    {activeAccent?.name}
                  </span>
                </div>
                <div className="accent-swatches-grid">
                  {ACCENT_PALETTES.map((palette) => {
                    const isSelected = accent === palette.id;
                    return (
                      <button
                        key={palette.id}
                        type="button"
                        onClick={() => setAccent(palette.id)}
                        className={`accent-swatch-chip ${isSelected ? 'swatch-selected' : ''}`}
                        title={`${palette.name} accent`}
                        aria-label={`Select ${palette.name} accent`}
                        aria-pressed={isSelected}
                      >
                        <span
                          className="swatch-color-circle"
                          style={{ backgroundColor: palette.hex }}
                        >
                          {isSelected && <Check size={12} className="swatch-check-icon" />}
                        </span>
                        <span className="swatch-name-text">{palette.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action: Reset to Default */}
              <div className="playground-actions-footer mt-8 pt-5 border-t border-subtle">
                <button
                  type="button"
                  onClick={resetDefaults}
                  className="btn btn-secondary btn-sm reset-defaults-btn"
                  title="Reset to Dark mode & Emerald accent"
                >
                  <RotateCcw size={14} />
                  <span>Reset to default</span>
                </button>
                <span className="settings-saved-note text-xs text-muted">
                  Saved automatically in your browser
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ThemePlayground;
