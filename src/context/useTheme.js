import { createContext, useContext } from 'react';
import { DEFAULT_SETTINGS, ACCENT_PALETTES, TIME_PERIODS } from '../data/theme';

export const ThemeContext = createContext({
  ...DEFAULT_SETTINGS,
  manualTheme: DEFAULT_SETTINGS.theme,
  currentTimePeriod: 'evening',
  activePeriod: 'evening',
  activePeriodData: TIME_PERIODS[2],
  previewPeriod: null,
  setTheme: () => {},
  toggleTheme: () => {},
  setAccent: () => {},
  setLivingTimeEnabled: () => {},
  toggleLivingTime: () => {},
  setPreviewPeriod: () => {},
  resetDefaults: () => {},
  isDark: true,
  activeAccent: ACCENT_PALETTES[0],
});

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
