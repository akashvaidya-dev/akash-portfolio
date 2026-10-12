import { motion } from 'framer-motion';
import { Sun, Moon, RotateCcw, Check, Sparkles, Sliders, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import { ACCENT_PALETTES } from '../data/theme';

/**
 * Interactive Theme Playground
 * Allows visitors to customize:
 * - Appearance: ☀️ Light / 🌙 Dark
 * - Accent Colors: 6 Curated Colors (Emerald, Electric blue, Purple, Rose, Amber, Cyan)
 * Every component across the portfolio adapts in real time.
 */
function ThemePlayground() {
  const {
    theme,
    accent,
    setTheme,
    setAccent,
    resetDefaults,
    activeAccent,
  } = useTheme();

  return (
    <section className="section-padding theme-playground-section" id="theme-studio">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-compact text-center">
          <div className="badge badge-accent mb-3">
            <Sliders size={13} className="mr-1.5" />
            <span>Interactive Theme Studio</span>
          </div>
          <h2 className="section-title">
            Personalize Visual <span className="text-gradient">Experience</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Switch between light and dark appearance and choose your signature accent color.
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
                    {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
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
                    Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'} · {activeAccent?.name || 'Emerald'} Accent
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
              {/* Control 1: Appearance (Light / Dark) */}
              <div className="control-group">
                <div className="control-header">
                  <span className="control-title">Appearance</span>
                  <span className="control-hint">
                    {theme === 'dark' ? 'Immersive · Futuristic · Calm' : 'Clean · Bright · Minimal'}
                  </span>
                </div>
                <div className="segmented-control-grid appearance-toggle-grid">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`segmented-btn ${theme === 'light' ? 'segmented-btn-active' : ''}`}
                    aria-pressed={theme === 'light'}
                  >
                    <Sun size={15} />
                    <span>☀️ Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`segmented-btn ${theme === 'dark' ? 'segmented-btn-active' : ''}`}
                    aria-pressed={theme === 'dark'}
                  >
                    <Moon size={15} />
                    <span>🌙 Dark</span>
                  </button>
                </div>
              </div>

              {/* Control 2: Accent Color (6 Curated Options) */}
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
