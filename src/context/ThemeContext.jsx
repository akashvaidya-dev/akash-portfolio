import { useState, useEffect } from 'react';
import {
  ACCENT_PALETTES,
  CORNER_STYLES,
  ANIMATION_PREFERENCES,
  DEFAULT_SETTINGS,
  STORAGE_KEY,
} from '../data/theme';
import { ThemeContext } from './useTheme';

/**
 * Safely read initial settings from localStorage without crashing during SSR or disabled storage.
 */
function getInitialSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        theme: parsed.theme === 'light' ? 'light' : 'dark',
        accent: ACCENT_PALETTES.some((a) => a.id === parsed.accent) ? parsed.accent : 'emerald',
        corners: CORNER_STYLES.some((c) => c.id === parsed.corners) ? parsed.corners : 'rounded',
        animation: ANIMATION_PREFERENCES.some((m) => m.id === parsed.animation) ? parsed.animation : 'smooth',
      };
    }
  } catch (err) {
    console.warn('Could not read design system settings from localStorage', err);
  }
  return DEFAULT_SETTINGS;
}

/**
 * ThemeProvider Component
 * Manages global adaptive design system state:
 * - Appearance mode (Light / Dark)
 * - Accent color palette (6 options)
 * - Corner style (Rounded / Soft / Sharp)
 * - Motion preference (Smooth / Fast / Reduced)
 * Synchronizes with DOM documentElement attributes and localStorage.
 */
export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(getInitialSettings);

  // Sync state to documentElement attributes and localStorage
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-accent', settings.accent);
    root.setAttribute('data-corners', settings.corners);
    root.setAttribute('data-animation', settings.animation);
    root.style.colorScheme = settings.theme;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.warn('Could not save design system settings to localStorage', err);
    }
  }, [settings]);

  const setTheme = (theme) => {
    setSettings((prev) => ({ ...prev, theme: theme === 'light' ? 'light' : 'dark' }));
  };

  const toggleTheme = () => {
    setSettings((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const setAccent = (accent) => {
    if (ACCENT_PALETTES.some((a) => a.id === accent)) {
      setSettings((prev) => ({ ...prev, accent }));
    }
  };

  const setCorners = (corners) => {
    if (CORNER_STYLES.some((c) => c.id === corners)) {
      setSettings((prev) => ({ ...prev, corners }));
    }
  };

  const setAnimation = (animation) => {
    if (ANIMATION_PREFERENCES.some((m) => m.id === animation)) {
      setSettings((prev) => ({ ...prev, animation }));
    }
  };

  const resetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const value = {
    theme: settings.theme,
    accent: settings.accent,
    corners: settings.corners,
    animation: settings.animation,
    setTheme,
    toggleTheme,
    setAccent,
    setCorners,
    setAnimation,
    resetDefaults,
    isDark: settings.theme === 'dark',
    activeAccent: ACCENT_PALETTES.find((a) => a.id === settings.accent) || ACCENT_PALETTES[0],
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
