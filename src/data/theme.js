export const ACCENT_PALETTES = [
  { id: 'emerald', name: 'Emerald', hex: '#10b981', lightHex: '#34d399' },
  { id: 'blue', name: 'Electric blue', hex: '#3b82f6', lightHex: '#60a5fa' },
  { id: 'purple', name: 'Purple', hex: '#a855f7', lightHex: '#c084fc' },
  { id: 'rose', name: 'Rose', hex: '#f43f5e', lightHex: '#fb7185' },
  { id: 'amber', name: 'Amber', hex: '#f59e0b', lightHex: '#fbbf24' },
  { id: 'cyan', name: 'Cyan', hex: '#06b6d4', lightHex: '#22d3ee' },
];

export const CORNER_STYLES = [
  { id: 'rounded', name: 'Rounded', description: 'Curved & modern' },
  { id: 'soft', name: 'Soft', description: 'Subtle rounding' },
  { id: 'sharp', name: 'Sharp', description: 'Clean & angular' },
];

export const ANIMATION_PREFERENCES = [
  { id: 'smooth', name: 'Smooth and cinematic', description: 'Fluid spring physics' },
  { id: 'fast', name: 'Fast and responsive', description: 'Snappy micro-interactions' },
  { id: 'reduced', name: 'Reduced motion', description: 'Calm & accessible' },
];

export const STORAGE_KEY = 'akash_portfolio_design_system_v1';

export const DEFAULT_SETTINGS = {
  theme: 'dark',
  accent: 'emerald',
  corners: 'rounded',
  animation: 'smooth',
};
