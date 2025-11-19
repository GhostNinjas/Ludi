/**
 * Color palette for the app.
 * Modern, cohesive design that attracts children and builds trust with parents.
 *
 * Design principles:
 * - Stimulate curiosity without sensory overload
 * - Pass credibility and calmness to parents
 * - Maintain readability and proper contrast for small screens
 */
export const Colors = {
  // Primary brand color - Vibrant light blue
  primary: '#4CA6FF',
  primaryDark: '#3B8EE6',
  primaryLight: '#6FB8FF',
  primaryPastel: '#B3D9FF', // For subtle backgrounds

  // CTA / Highlight color - Warm orange
  cta: '#FFA928',
  ctaDark: '#E69420',
  ctaLight: '#FFB84D',
  ctaPastel: '#FFD699', // For hover states

  // Secondary color - Soft purple (creativity)
  secondary: '#A974FF',
  secondaryDark: '#9460E6',
  secondaryLight: '#BB8FFF',
  secondaryPastel: '#D9BFFF', // For creative zones

  // Success/Progress - Mint green
  success: '#7EDDA2',
  successDark: '#6BC990',
  successLight: '#9FE6B8',

  // NEW: Vibrant colors for maximum visual impact
  vibrant: {
    // Bright primary colors for kids
    electricBlue: '#2E9CFF',
    sunnyYellow: '#FFD93D',
    happyGreen: '#6BCF7F',
    playfulPink: '#FF6B9D',
    vividOrange: '#FF8A3D',
    purplePower: '#9B59D0',

    // Neon accents (use sparingly for highlights)
    neonCyan: '#00F5FF',
    neonPink: '#FF10F0',
    neonGreen: '#39FF14',
  },

  // Background colors
  background: '#FFF3E0', // More vibrant warm background
  backgroundLight: '#FFF8F1', // Original warm off-white (fallback)
  surface: '#FFFFFF', // Pure white for cards
  surfaceElevated: '#FFFBF6', // Slightly elevated surfaces

  // Text colors - Soft dark gray
  text: '#3C3C3C',
  textSecondary: '#6B6B6B',
  textLight: '#9B9B9B',
  textInverse: '#FFFFFF',

  // Border colors
  border: '#E8E0D8', // Warm neutral border
  borderLight: '#F2EBE3',
  borderStrong: '#D0C5B8',

  // Accent colors for categories (pastel versions for harmony)
  abc: '#FFB366', // Soft orange for literacy
  numbers: '#7EDDA2', // Mint green for math
  colorsCategory: '#FF9BB5', // Soft pink for colors/art
  shapes: '#8FA8FF', // Soft blue for shapes
  puzzles: '#B899FF', // Soft purple for puzzles
  drawing: '#FFB366', // Soft orange for drawing

  // Feedback colors
  error: '#FF7B7B',
  warning: '#FFBB55',
  info: '#4CA6FF',

  // Star ratings
  starFilled: '#FFA928', // Using CTA color
  starEmpty: '#E8E0D8',

  // Gradient definitions
  gradients: {
    // Original gradients (keep for backward compatibility)
    primary: ['#4CA6FF', '#A974FF'], // Blue to Purple
    warm: ['#FFA928', '#FF9BB5'], // Orange to Pink
    success: ['#7EDDA2', '#4CA6FF'], // Green to Blue
    creative: ['#A974FF', '#FF9BB5'], // Purple to Pink

    // NEW: Vibrant 3-color gradients for games
    rainbow: ['#FF6B9D', '#FFD93D', '#6BCF7F'], // Pink → Yellow → Green
    sky: ['#2E9CFF', '#6FB8FF', '#B3D9FF'], // Electric Blue → Light Blue → Pastel
    sunset: ['#FF8A3D', '#FF6B9D', '#9B59D0'], // Orange → Pink → Purple
    ocean: ['#00F5FF', '#2E9CFF', '#4CA6FF'], // Cyan → Electric Blue → Primary
    forest: ['#6BCF7F', '#7EDDA2', '#4CA6FF'], // Green → Mint → Blue
    candy: ['#FF10F0', '#FF6B9D', '#FFD93D'], // Neon Pink → Pink → Yellow
    fire: ['#FF8A3D', '#FF6B9D', '#FFD93D'], // Orange → Pink → Yellow
    unicorn: ['#FF6B9D', '#9B59D0', '#00F5FF'], // Pink → Purple → Cyan

    // Game-specific vibrant gradients
    memory: ['#9B59D0', '#FF6B9D', '#FFD93D'], // Purple → Pink → Yellow
    math: ['#2E9CFF', '#6BCF7F', '#FFD93D'], // Blue → Green → Yellow
    creativity: ['#FF6B9D', '#9B59D0', '#2E9CFF'], // Pink → Purple → Blue
    logic: ['#6BCF7F', '#2E9CFF', '#9B59D0'], // Green → Blue → Purple
  },

  // Accessibility - High contrast mode
  highContrast: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#0066CC',
    secondary: '#009900',
  },
};
