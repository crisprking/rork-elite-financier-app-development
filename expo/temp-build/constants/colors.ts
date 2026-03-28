// Professional color palette inspired by Coinbase, CashApp, and modern fintech
const colors = {
  // Primary brand colors - Professional sage green with fintech vibes
  primary: {
    50: '#F0FDF4',
    100: '#DCFCE7', 
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#00E67A', // Main brand - Professional sage
    600: '#00D166',
    700: '#00B852',
    800: '#009A3E',
    900: '#007C2A',
  },

  // Secondary colors - Premium gold for pro features
  secondary: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A', 
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Premium gold
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Neutral colors - Clean, modern fintech aesthetic
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Status colors - Fintech standard
  success: {
    50: '#F0FDF4',
    500: '#10B981',
    600: '#059669',
  },
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
  },
  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
  },
  info: {
    50: '#EFF6FF',
    500: '#3B82F6',
    600: '#2563EB',
  },

  // Surface colors - Light theme (Coinbase-inspired)
  surface: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    warm: '#FEFEFE',
  },

  // Text colors - Light theme
  text: {
    primary: '#0F172A',     // Deep slate for primary text
    secondary: '#475569',   // Slate for secondary text
    tertiary: '#64748B',    // Light slate for tertiary
    quaternary: '#94A3B8',  // Very light slate
    inverse: '#FFFFFF',
    accent: '#00E67A',
    sage: '#059669',
  },

  // Border colors - Light theme
  border: {
    light: '#F1F5F9',
    medium: '#E2E8F0',
    strong: '#CBD5E1',
    accent: '#00E67A',
    sage: '#059669',
  },

  // Background - Light theme
  background: '#FFFFFF',

  // Gradient colors - Professional fintech gradients
  gradient: {
    primary: ['#00E67A', '#00D166'],
    secondary: ['#F59E0B', '#D97706'],
    accent: ['#3B82F6', '#2563EB'],
    luxury: ['#F59E0B', '#D97706'],
    dark: ['#0F172A', '#1E293B'],
    subtle: ['#F8FAFC', '#F1F5F9'],
  },

  // Shadow styles - Professional depth
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 8,
    },
  },

  // Accent colors - Fintech highlights
  accent: {
    gold: '#F59E0B',
    emerald: '#10B981',
    emeraldLight: '#34D399',
    amber: '#F59E0B',
    blue: '#3B82F6',
    purple: '#8B5CF6',
    pink: '#EC4899',
  },

  // Dark theme colors - Optimized for OLED and performance
  dark: {
    surface: {
      primary: '#000000',     // True black for OLED efficiency
      secondary: '#111111',   // Minimal power consumption
      tertiary: '#1A1A1A',    // Subtle elevation
      elevated: '#0D0D0D',    // Elevated cards
      overlay: 'rgba(0, 0, 0, 0.85)',
    },
    text: {
      primary: '#FFFFFF',     // Maximum contrast
      secondary: '#E8E8E8',   // Optimized readability
      tertiary: '#B8B8B8',    // Balanced contrast
      quaternary: '#888888',  // Subtle text
      inverse: '#000000',
      accent: '#00E67A',      // Brand green
    },
    border: {
      light: 'rgba(255, 255, 255, 0.06)',   // Ultra-subtle
      medium: 'rgba(255, 255, 255, 0.10)',  // Subtle
      strong: 'rgba(255, 255, 255, 0.14)',  // Visible
      accent: '#00E67A',
    },
    background: '#000000',  // True black for OLED
  },
};

// Typography scale - Optimized for maximum readability and performance
export const typography = {
  size: {
    xs: 11,      // Compact but readable
    sm: 13,      // Secondary text - optimized
    base: 15,    // Primary text - perfect balance
    lg: 17,      // Comfortable reading
    xl: 19,      // Clear headings
    '2xl': 22,   // Section titles
    '3xl': 26,   // Page titles
    '4xl': 32,   // Hero text
    '5xl': 40,   // Large display
    '6xl': 48,   // Extra large display
  },
  weight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
  lineHeight: {
    tight: 1.15,     // Tighter for headings - optimized
    snug: 1.25,      // Snug for titles - better spacing
    normal: 1.35,    // Normal reading - improved
    relaxed: 1.45,   // Comfortable reading
    loose: 1.55,     // Very comfortable
  },
  letterSpacing: {
    tighter: -0.025,
    tight: -0.015,
    normal: 0,
    wide: 0.015,
    wider: 0.025,
    widest: 0.05,
  },
};

// Spacing scale - Fintech-optimized for mobile and desktop
export const spacing = {
  0: 0,
  1: 2,      // Micro spacing
  2: 4,      // Tiny spacing
  3: 8,      // Small spacing
  4: 12,     // Base spacing
  5: 16,     // Medium spacing
  6: 20,     // Large spacing
  7: 24,     // Extra large
  8: 28,     // Section spacing
  9: 32,     // Large section
  10: 36,    // Extra large section
  11: 40,
  12: 44,
  14: 52,
  16: 60,
  20: 76,
  24: 92,
  28: 108,
  32: 124,
  36: 140,
  40: 156,
  44: 172,
  48: 188,
  52: 204,
  56: 220,
  60: 236,
  64: 252,
  72: 284,
  80: 316,
  96: 380,
};

// Border radius scale - Modern fintech aesthetic
export const borderRadius = {
  none: 0,
  sm: 3,      // Subtle rounding
  base: 6,    // Standard rounding
  md: 8,      // Medium rounding
  lg: 12,     // Large rounding
  xl: 16,     // Extra large
  '2xl': 20,  // Very large
  '3xl': 28,  // Huge rounding
  full: 9999, // Fully rounded
};

// Size scales for compatibility
export const size = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 19,
  '2xl': 22,
  '3xl': 26,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
};

export default colors;