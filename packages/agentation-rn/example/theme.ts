
export const colors = {
  // Primary actions
  primary: '#3c82f7',
  primaryHover: '#74b1fd',
  success: '#34c759',
  danger: '#ff3b30',

  // Dark mode (primary UI)
  dark: {
    bg: '#1a1a1a',
    bgElevated: '#2a2a2a',
    bgOverlay: '#383838',
    text: '#ffffff',
    textSecondary: 'rgba(255,255,255,0.85)',
    textTertiary: 'rgba(255,255,255,0.5)',
    textMuted: 'rgba(255,255,255,0.35)',
    border: 'rgba(255,255,255,0.08)',
    borderLight: 'rgba(255,255,255,0.12)',
  },

  // Light mode
  light: {
    bg: '#fdfdfc',
    bgCard: '#ffffff',
    bgSubtle: 'rgba(0,0,0,0.03)',
    bgHover: 'rgba(0,0,0,0.06)',
    text: '#111111',
    textSecondary: 'rgba(0,0,0,0.7)',
    textTertiary: 'rgba(0,0,0,0.5)',
    textMuted: 'rgba(0,0,0,0.35)',
    border: 'rgba(0,0,0,0.08)',
    borderMedium: 'rgba(0,0,0,0.12)',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  xxl: 16,
  pill: 999,
};

export const typography = {
  // React Native uses system fonts (SF Pro on iOS, Roboto on Android)
  sizes: {
    tiny: 10,
    small: 11,
    caption: 12,
    body: 14,
    ui: 13,
    title: 16,
    heading: 18,
    large: 20,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  letterSpacing: {
    tight: -0.3,
    normal: 0,
    wide: 0.5,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  marker: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
};

// Animation presets (for react-native-reanimated)
export const animations = {
  spring: {
    damping: 15,
    stiffness: 150,
  },
  springBouncy: {
    damping: 12,
    stiffness: 180,
  },
  timing: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
};

// Common component styles
export const componentStyles = {
  // Cards
  card: {
    backgroundColor: colors.light.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  cardDark: {
    backgroundColor: colors.dark.bg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },

  // Buttons
  buttonPrimary: {
    backgroundColor: colors.light.text,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md + 2,
  },
  buttonSecondary: {
    backgroundColor: colors.light.bgCard,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.light.borderMedium,
  },

  // Icon buttons (toolbar style)
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Inputs
  input: {
    backgroundColor: colors.light.bgCard,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    fontSize: typography.sizes.body,
  },

  // Badges
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  badgeText: {
    color: '#fff',
    fontSize: typography.sizes.tiny,
    fontWeight: typography.weights.semibold,
  },
};

export default {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  animations,
  componentStyles,
};
