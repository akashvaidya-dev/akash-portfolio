import { useState, useEffect, useCallback } from 'react';
import {
  ACCENT_PALETTES,
  TIME_PERIODS,
  getTimePeriod,
  DEFAULT_SETTINGS,
  STORAGE_KEY,
} from '../data/theme';
import { ThemeContext } from './useTheme';

/**
 * Safely read initial settings from localStorage without crashing.
 */
function getInitialSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem('akash_portfolio_design_system_v2');

    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        theme: parsed.theme === 'light' ? 'light' : 'dark',
        accent: ACCENT_PALETTES.some((a) => a.id === parsed.accent)
          ? parsed.accent
          : 'emerald',
        livingTimeEnabled: Boolean(parsed.livingTimeEnabled),
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
 * - Living Time Theme: Automatic adaptation according to visitor's local time
 * - Appearance Mode: ☀️ Light / 🌙 Dark (preserved when Living Time is OFF)
 * - Accent Color: 6 curated colors (Emerald, Electric blue, Purple, Rose, Amber, Cyan)
 * Synchronizes with DOM documentElement attributes and localStorage.
 */
export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(getInitialSettings);
  const [currentTimePeriod, setCurrentTimePeriod] = useState(() => getTimePeriod(new Date()));
  const [previewPeriod, setPreviewPeriod] = useState(null);

  // Active time period: preview period if testing, otherwise live local time period
  const activePeriod = previewPeriod || currentTimePeriod;
  const activePeriodData =
    TIME_PERIODS.find((p) => p.id === activePeriod) || TIME_PERIODS[0];

  // Effective visual theme: time-based baseTheme when Living Time is enabled, otherwise manual theme
  const effectiveTheme = settings.livingTimeEnabled
    ? activePeriodData.baseTheme
    : settings.theme;

  // Sync state to documentElement attributes and localStorage
  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', effectiveTheme);
    root.setAttribute('data-accent', settings.accent);
    root.style.colorScheme = effectiveTheme;

    if (settings.livingTimeEnabled) {
      root.setAttribute('data-time-period', activePeriod);
      root.setAttribute('data-living-time', 'true');
    } else {
      root.removeAttribute('data-time-period');
      root.setAttribute('data-living-time', 'false');
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.warn('Could not save design system settings to localStorage', err);
    }
  }, [settings, effectiveTheme, activePeriod]);

  // Periodic clock check & tab visibility sync for automatic time updates
  useEffect(() => {
    const checkTime = () => {
      const detected = getTimePeriod(new Date());
      setCurrentTimePeriod((prev) => (prev !== detected ? detected : prev));
    };

    // Check immediately
    checkTime();

    // Check on 30-second interval to catch period boundaries promptly
    const intervalId = setInterval(checkTime, 30000);

    // Recalculate immediately when tab becomes visible or window gains focus (handles wake-from-sleep)
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        checkTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, []);

  // When manually selecting light/dark theme, disable automatic mode and apply user choice
  const setTheme = useCallback((theme) => {
    const normalized = theme === 'light' ? 'light' : 'dark';
    setSettings((prev) => ({
      ...prev,
      theme: normalized,
      livingTimeEnabled: false,
    }));
    setPreviewPeriod(null);
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings((prev) => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      return {
        ...prev,
        theme: nextTheme,
        livingTimeEnabled: false,
      };
    });
    setPreviewPeriod(null);
  }, []);

  const setAccent = useCallback((accent) => {
    if (ACCENT_PALETTES.some((a) => a.id === accent)) {
      setSettings((prev) => ({ ...prev, accent }));
    }
  }, []);

  const setLivingTimeEnabled = useCallback((enabled) => {
    setSettings((prev) => ({
      ...prev,
      livingTimeEnabled: Boolean(enabled),
    }));
    if (!enabled) {
      setPreviewPeriod(null);
    }
  }, []);

  const toggleLivingTime = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.livingTimeEnabled;
      return {
        ...prev,
        livingTimeEnabled: next,
      };
    });
    setPreviewPeriod(null);
  }, []);

  const handleSetPreviewPeriod = useCallback((periodId) => {
    if (!periodId) {
      setPreviewPeriod(null);
      return;
    }
    if (TIME_PERIODS.some((p) => p.id === periodId)) {
      setPreviewPeriod(periodId);
      // If living time is currently OFF, enable it so the preview is immediately visible
      setSettings((prev) =>
        prev.livingTimeEnabled ? prev : { ...prev, livingTimeEnabled: true }
      );
    }
  }, []);

  const resetDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setPreviewPeriod(null);
  }, []);

  const value = {
    theme: effectiveTheme,
    manualTheme: settings.theme,
    accent: settings.accent,
    livingTimeEnabled: settings.livingTimeEnabled,
    currentTimePeriod,
    activePeriod,
    activePeriodData,
    previewPeriod,
    setTheme,
    toggleTheme,
    setAccent,
    setLivingTimeEnabled,
    toggleLivingTime,
    setPreviewPeriod: handleSetPreviewPeriod,
    resetDefaults,
    isDark: effectiveTheme === 'dark',
    activeAccent:
      ACCENT_PALETTES.find((a) => a.id === settings.accent) || ACCENT_PALETTES[0],
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
