/**
 * i18n Configuration
 * Supports: es-ES, en-US, pt-BR
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import esTranslations from './locales/es-ES.json';
import enTranslations from './locales/en-US.json';
import ptTranslations from './locales/pt-BR.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'es-ES': { translation: esTranslations },
      'en-US': { translation: enTranslations },
      'pt-BR': { translation: ptTranslations },
    },
    fallbackLng: 'es-ES',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

