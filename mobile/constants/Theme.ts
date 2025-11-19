/**
 * Theme Configuration
 * Design tokens and scales for consistent, playful UI
 */

import { Platform } from 'react-native';

/**
 * Typography Scale
 * Child-friendly fonts optimized for ages 1-6
 */
export const Typography = {
  // Font Families (using system fonts for reliability)
  fonts: {
    heading: Platform.select({
      ios: 'Avenir-Heavy',
      android: 'sans-serif-medium',
      default: 'System',
    }),
    body: Platform.select({
      ios: 'Avenir',
      android: 'sans-serif',
      default: 'System',
    }),
    playful: Platform.select({
      ios: 'Marker Felt',
      android: 'sans-serif-condensed',
      default: 'System',
    }),
    handwritten: Platform.select({
      ios: 'Snell Roundhand',
      android: 'cursive',
      default: 'System',
    }),
  },

  // Font Sizes (optimized for children)
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    huge: 48,
    massive: 64,
  },

  // Font Weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Text Styles (ready-to-use combinations)
  styles: {
    heroTitle: {
      fontFamily: Platform.select({
        ios: 'Quicksand-Bold',
        android: 'Quicksand-Bold',
        default: 'Quicksand-Bold',
      }),
      fontSize: 48,
      fontWeight: '800' as const,
      lineHeight: 56,
    },
    title1: {
      fontFamily: Platform.select({
        ios: 'Quicksand-Bold',
        android: 'Quicksand-Bold',
        default: 'Quicksand-Bold',
      }),
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    title2: {
      fontFamily: Platform.select({
        ios: 'Quicksand-Bold',
        android: 'Quicksand-Bold',
        default: 'Quicksand-Bold',
      }),
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 32,
    },
    title3: {
      fontFamily: Platform.select({
        ios: 'Quicksand-Bold',
        android: 'Quicksand-Bold',
        default: 'Quicksand-Bold',
      }),
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontFamily: Platform.select({
        ios: 'Comic Neue',
        android: 'ComicNeue-Regular',
        default: 'Comic Neue',
      }),
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodyLarge: {
      fontFamily: Platform.select({
        ios: 'Comic Neue',
        android: 'ComicNeue-Regular',
        default: 'Comic Neue',
      }),
      fontSize: 18,
      fontWeight: '500' as const,
      lineHeight: 28,
    },
    caption: {
      fontFamily: Platform.select({
        ios: 'Comic Neue',
        android: 'ComicNeue-Regular',
        default: 'Comic Neue',
      }),
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    button: {
      fontFamily: Platform.select({
        ios: 'Quicksand-Bold',
        android: 'Quicksand-Bold',
        default: 'Quicksand-Bold',
      }),
      fontSize: 18,
      fontWeight: '700' as const,
      lineHeight: 24,
      textTransform: 'none' as const,
    },
  },
};

/**
 * Spacing Scale
 * Based on 4px grid system
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
};

/**
 * Border Radius Scale
 * Consistent roundness across components
 */
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999, // Fully rounded (pills, circles)
};

/**
 * Shadow Presets
 * Elevation system for depth
 */
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  colored: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  }),
};

/**
 * Animation Configurations
 * Smooth, playful motion
 */
export const Animations = {
  // Durations (in ms)
  durations: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },

  // Easing curves
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Playful bounce
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Spring effect
  },

  // React Native Animated configs
  spring: {
    gentle: {
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    },
    bouncy: {
      tension: 60,
      friction: 5,
      useNativeDriver: true,
    },
    snappy: {
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    },
  },

  timing: {
    fast: {
      duration: 200,
      useNativeDriver: true,
    },
    normal: {
      duration: 300,
      useNativeDriver: true,
    },
    slow: {
      duration: 500,
      useNativeDriver: true,
    },
  },
};

/**
 * Icon Sizes
 * Consistent icon scaling
 */
export const IconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
  huge: 64,
};

/**
 * Touch Targets
 * Minimum sizes for child-friendly interaction
 */
export const TouchTargets = {
  minimum: 44, // iOS HIG minimum
  recommended: 56, // Better for children
  comfortable: 64, // Best for toddlers
};

/**
 * Z-Index Scale
 * Layering system
 */
export const ZIndex = {
  background: -1,
  base: 0,
  content: 1,
  overlay: 10,
  dropdown: 100,
  modal: 1000,
  tooltip: 2000,
  toast: 3000,
};

/**
 * Opacity Scale
 * Consistent transparency levels
 */
export const Opacity = {
  invisible: 0,
  subtle: 0.1,
  light: 0.25,
  medium: 0.5,
  heavy: 0.75,
  almostOpaque: 0.9,
  opaque: 1,
};

/**
 * Component Sizes
 * Predefined sizes for common components
 */
export const ComponentSizes = {
  button: {
    sm: {
      height: 36,
      paddingHorizontal: Spacing.lg,
      fontSize: Typography.sizes.sm,
    },
    md: {
      height: 48,
      paddingHorizontal: Spacing.xl,
      fontSize: Typography.sizes.md,
    },
    lg: {
      height: 56,
      paddingHorizontal: Spacing.xxl,
      fontSize: Typography.sizes.lg,
    },
    xl: {
      height: 64,
      paddingHorizontal: Spacing.xxxl,
      fontSize: Typography.sizes.xl,
    },
  },

  input: {
    sm: {
      height: 40,
      paddingHorizontal: Spacing.md,
      fontSize: Typography.sizes.sm,
    },
    md: {
      height: 48,
      paddingHorizontal: Spacing.lg,
      fontSize: Typography.sizes.md,
    },
    lg: {
      height: 56,
      paddingHorizontal: Spacing.xl,
      fontSize: Typography.sizes.lg,
    },
  },

  card: {
    sm: {
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
    },
    md: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
    },
    lg: {
      padding: Spacing.xl,
      borderRadius: BorderRadius.xl,
    },
  },
};

/**
 * Breakpoints
 * Responsive design breakpoints
 */
export const Breakpoints = {
  xs: 320,  // Small phones
  sm: 375,  // iPhone SE, etc.
  md: 414,  // iPhone 11 Pro Max, etc.
  lg: 768,  // iPads in portrait
  xl: 1024, // iPads in landscape
};

/**
 * Layout Constants
 * Common layout values
 */
export const Layout = {
  tabBarHeight: 80,
  headerHeight: 60,
  screenPadding: Spacing.xl,
  cardSpacing: Spacing.md,
  gridGap: Spacing.md,
};

export default {
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Animations,
  IconSizes,
  TouchTargets,
  ZIndex,
  Opacity,
  ComponentSizes,
  Breakpoints,
  Layout,
};
