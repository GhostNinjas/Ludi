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
const getLanguageFromLocale = (locale: string | null | undefined): string => {
  if (!locale || typeof locale !== 'string') return 'pt-BR';
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
    // Initialize immediately with default to prevent errors
    let initialLanguage = 'pt-BR';

    // Try to get device locale (synchronous fallback)
    try {
      const locales = Localization.getLocales();
      const deviceLocale = locales?.[0]?.languageTag || 'pt-BR';
      if (deviceLocale && typeof deviceLocale === 'string') {
        initialLanguage = getLanguageFromLocale(deviceLocale);
      }
    } catch (error) {
      console.log('[i18n] Error getting device locale:', error);
    }

    // Initialize i18n first
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

    // Then try to load saved preference and update if different
    try {
      const savedLanguage = await AsyncStorage.getItem('userLanguage');
      if (savedLanguage && resources[savedLanguage as keyof typeof resources] && savedLanguage !== initialLanguage) {
        await i18n.changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.log('[i18n] Error loading saved language:', error);
    }
  } catch (error) {
    console.error('Error initializing i18n:', error);
    // Last resort fallback
    try {
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
    } catch (finalError) {
      console.error('Critical i18n initialization error:', finalError);
    }
  }
};

export default i18n;
