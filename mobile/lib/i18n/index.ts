import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
  es: { translation: es },
};

/**
 * Maps device locale codes to supported language codes with better variant handling.
 * Supports various locale formats like en-US, en_US, en-GB, pt-BR, pt_PT, es-ES, es-MX, etc.
 */
const getLanguageFromLocale = (locale: string): string => {
  const normalizedLocale = locale.toLowerCase().replace('_', '-');

  // Portuguese variants
  if (normalizedLocale.startsWith('pt')) {
    return 'pt-BR'; // Default to Brazilian Portuguese
  }

  // English variants
  if (normalizedLocale.startsWith('en')) {
    return 'en';
  }

  // Spanish variants
  if (normalizedLocale.startsWith('es')) {
    return 'es';
  }

  // Default fallback
  return 'pt-BR';
};

/**
 * Initialize i18n with user preference, then device locale, then default fallback.
 */
export const initI18n = async () => {
  try {
    // Try to get saved user preference first
    const savedLanguage = await AsyncStorage.getItem('userLanguage');

    let initialLanguage: string;

    if (savedLanguage && resources[savedLanguage as keyof typeof resources]) {
      // Use saved preference if valid
      initialLanguage = savedLanguage;
    } else {
      // Fall back to device locale detection
      const deviceLocale = Localization.locale;
      initialLanguage = getLanguageFromLocale(deviceLocale);
    }

    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: initialLanguage,
        fallbackLng: 'pt-BR',
        interpolation: {
          escapeValue: false,
        },
        compatibilityJSON: 'v3',
      });
  } catch (error) {
    console.error('Error initializing i18n:', error);
    // If anything fails, initialize with default
    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: 'pt-BR',
        fallbackLng: 'pt-BR',
        interpolation: {
          escapeValue: false,
        },
        compatibilityJSON: 'v3',
      });
  }
};

export default i18n;
