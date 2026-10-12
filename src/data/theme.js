export const ACCENT_PALETTES = [
  { id: 'emerald', name: 'Emerald', hex: '#10b981', lightHex: '#34d399' },
  { id: 'blue', name: 'Electric blue', hex: '#3b82f6', lightHex: '#60a5fa' },
  { id: 'purple', name: 'Purple', hex: '#a855f7', lightHex: '#c084fc' },
  { id: 'rose', name: 'Rose', hex: '#f43f5e', lightHex: '#fb7185' },
  { id: 'amber', name: 'Amber', hex: '#f59e0b', lightHex: '#fbbf24' },
  { id: 'cyan', name: 'Cyan', hex: '#06b6d4', lightHex: '#22d3ee' },
];

export const TIME_PERIODS = [
  {
    id: 'morning',
    name: 'Morning',
    timeRange: '6:00 AM – 11:59 AM',
    baseTheme: 'light',
    emoji: '🌅',
    tagline: 'Warm, bright & welcoming surfaces',
    description: 'Gentle morning sunlight, warm ivory surfaces, and soft golden highlights.',
    startHour: 6,
    endHour: 12,
  },
  {
    id: 'afternoon',
    name: 'Afternoon',
    timeRange: '12:00 PM – 4:59 PM',
    baseTheme: 'light',
    emoji: '☀️',
    tagline: 'Crisp, clean daylight with clear contrast',
    description: 'High-clarity daylight, crisp clean slate surfaces, and sharp focus.',
    startHour: 12,
    endHour: 17,
  },
  {
    id: 'evening',
    name: 'Evening',
    timeRange: '5:00 PM – 7:59 PM',
    baseTheme: 'dark',
    emoji: '🌆',
    tagline: 'Muted dusky indigo & warmer accent glow',
    description: 'Twilight dusky indigo backgrounds with warmer sunset ambient treatments.',
    startHour: 17,
    endHour: 20,
  },
  {
    id: 'night',
    name: 'Night',
    timeRange: '8:00 PM – 5:59 AM',
    baseTheme: 'dark',
    emoji: '🌙',
    tagline: 'Deep, comfortable obsidian surfaces',
    description: 'Deep, comfortable charcoal backgrounds with restrained highlights.',
    startHour: 20,
    endHour: 6,
  },
];

/**
 * Determine the active time period based on visitor's local Date.
 * - Morning: 6:00 AM–11:59 AM
 * - Afternoon: 12:00 PM–4:59 PM
 * - Evening: 5:00 PM–7:59 PM
 * - Night: 8:00 PM–5:59 AM
 */
export function getTimePeriod(date = new Date()) {
  const hours = date.getHours();
  if (hours >= 6 && hours < 12) return 'morning';
  if (hours >= 12 && hours < 17) return 'afternoon';
  if (hours >= 17 && hours < 20) return 'evening';
  return 'night';
}

export const STORAGE_KEY = 'akash_portfolio_design_system_v3';

export const DEFAULT_SETTINGS = {
  theme: 'dark', // Manually selected appearance: 'dark' | 'light'
  accent: 'emerald', // Selected accent color
  livingTimeEnabled: false, // Default is OFF: visitor retains full manual control
};
