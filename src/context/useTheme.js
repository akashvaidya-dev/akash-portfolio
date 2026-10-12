import { createContext, useContext } from 'react';
import { DEFAULT_SETTINGS } from '../data/theme';

export const ThemeContext = createContext({
  ...DEFAULT_SETTINGS,
  setTheme: () => {},
  toggleTheme: () => {},
  setAccent: () => {},
  setCorners: () => {},
  setAnimation: () => {},
  resetDefaults: () => {},
});

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
