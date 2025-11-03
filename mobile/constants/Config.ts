/**
 * App configuration constants.
 */
export const Config = {
  // API
  API_URL: process.env.API_URL || 'http://localhost:8000/api',
  API_TIMEOUT: 30000, // 30 seconds

  // Features
  ENABLE_ANALYTICS: process.env.ANALYTICS_ENABLED === 'true',
  ENABLE_OFFLINE: true,
  ENABLE_PARENTAL_GATE: true,

  // Subscription
  FREE_GAMES_LIMIT: 3,
  FREE_WORKSHEETS_LIMIT: 3,
  FREE_PROFILES_LIMIT: 1,

  // Game settings
  DEFAULT_DIFFICULTY: 1, // 1 = Easy, 2 = Medium, 3 = Hard
  SESSION_TIMEOUT: 120000, // 2 minutes of inactivity
  MIN_SESSION_TIME: 10, // Minimum 10 seconds to count as valid session
  MAX_SESSION_TIME: 300, // Maximum 5 minutes per session

  // Audio
  ENABLE_TTS: true,
  TTS_RATE: 0.8, // Slower speech for kids
  ENABLE_SOUND_EFFECTS: true,
  DEFAULT_VOLUME: 0.7,

  // Parental Gate
  PARENTAL_GATE_MATH_MIN: 5,
  PARENTAL_GATE_MATH_MAX: 15,
  PARENTAL_GATE_HOLD_DURATION: 3000, // 3 seconds

  // Cache
  CACHE_DURATION: 3600000, // 1 hour
  MAX_CACHED_WORKSHEETS: 10,

  // Validation
  MIN_CHILD_NAME_LENGTH: 2,
  MAX_CHILD_NAME_LENGTH: 30,
  MIN_PASSWORD_LENGTH: 8,

  // App info
  APP_VERSION: '1.0.0',
  APP_NAME: 'Ludi',
};
