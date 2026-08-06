// Shared color palette and style constants used across menu/game screens.

export const COLORS = {
  background: '#ffffff',
  text: '#111827',
  primary: '#2563eb',
  primaryText: '#ffffff',
  border: '#111827',
  muted: '#6b7280',
  locked: '#9ca3af',
};

export const HIGH_CONTRAST_COLORS = {
  background: '#000000',
  text: '#facc15',
  primary: '#facc15',
  primaryText: '#000000',
  border: '#facc15',
  muted: '#9ca3af',
  locked: '#4b5563',
};

export function getTheme(highContrast) {
  return highContrast ? HIGH_CONTRAST_COLORS : COLORS;
}

export const CONTROL_SIZES = {
  small: 48,
  normal: 64,
  large: 80,
};
