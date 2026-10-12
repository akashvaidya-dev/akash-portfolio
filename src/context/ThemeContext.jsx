import { useState, useEffect } from 'react';
import { ACCENT_PALETTES, DEFAULT_SETTINGS, STORAGE_KEY } from '../data/theme';
import { ThemeContext } from './useTheme';

/**
 * Safely read initial settings from localStorage without crashing.
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
      };
    }
  } catch (err) {
    console.warn('Could not read design system settings from localStorage', err);
  }
  return DEFAULT_SETTINGS;
}

/**
 * ThemeProvider Component
 * Manages clean visual customization:
 * - Appearance Mode: ☀️ Light / 🌙 Dark
 * - Accent Color: 6 curated colors (Emerald, Electric blue, Purple, Rose, Amber, Cyan)
 * Synchronizes with DOM documentElement attributes and localStorage.
 */
export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(getInitialSettings);

  // Sync state to documentElement attributes and localStorage
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-accent', settings.accent);
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

  const resetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const value = {
    theme: settings.theme,
    accent: settings.accent,
    setTheme,
    toggleTheme,
    setAccent,
    resetDefaults,
    isDark: settings.theme === 'dark',
    activeAccent: ACCENT_PALETTES.find((a) => a.id === settings.accent) || ACCENT_PALETTES[0],
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
