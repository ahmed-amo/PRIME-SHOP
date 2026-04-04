/**
 * Design tokens — 4px base spacing scale (Tailwind-style numeric keys).
 */
export const spacing = {
  px: 1,
  0: 0,
  0.5: 2,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/** Storefront / admin semantic colors (use with Tailwind where possible). */
export const semanticColors = {
  primary: 'oklch(0.55 0.15 45)',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
} as const;

export const ANIMATION_FAST_MS = 150;
export const ANIMATION_NORMAL_MS = 250;
