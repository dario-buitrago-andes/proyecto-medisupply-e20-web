import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones - Español
import commonES from './locales/es/common.json';
import authES from './locales/es/auth.json';
import vendorsES from './locales/es/vendors.json';
import productsES from './locales/es/products.json';
import reportsES from './locales/es/reports.json';
import salesPlansES from './locales/es/salesPlans.json';

// Importar traducciones - Inglés
import commonEN from './locales/en/common.json';
import authEN from './locales/en/auth.json';
import vendorsEN from './locales/en/vendors.json';
import productsEN from './locales/en/products.json';
import reportsEN from './locales/en/reports.json';
import salesPlansEN from './locales/en/salesPlans.json';

const resources = {
  es: {
    common: commonES,
    auth: authES,
    vendors: vendorsES,
    products: productsES,
    reports: reportsES,
    salesPlans: salesPlansES,
  },
  en: {
    common: commonEN,
    auth: authEN,
    vendors: vendorsEN,
    products: productsEN,
    reports: reportsEN,
    salesPlans: salesPlansEN,
  },
};

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Integración con React
  .init({
    resources,
    fallbackLng: 'es', // Idioma por defecto
    defaultNS: 'common', // Namespace por defecto
    ns: ['common', 'auth', 'vendors', 'products', 'reports', 'salesPlans'],
    
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },
    
    // Configuración de detección de idioma
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em'],
    },
    
    // Habilitar modo debug en desarrollo
    debug: process.env.NODE_ENV === 'development',
  });

export default i18n;
