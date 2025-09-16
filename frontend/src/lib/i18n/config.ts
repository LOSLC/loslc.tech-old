import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en';
import fr from './locales/fr';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const;

if (!i18n.isInitialized) {
  if (typeof window !== 'undefined') {
    i18n.use(LanguageDetector);
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
      },
      interpolation: { escapeValue: false },
    });
}

export default i18n;
