import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en/translation.json';
import hiTranslation from '../locales/hi/translation.json';
import bnTranslation from '../locales/bn/translation.json';
import teTranslation from '../locales/te/translation.json';
import taTranslation from '../locales/ta/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  hi: {
    translation: hiTranslation
  },
  bn: {
    translation: bnTranslation
  },
  te: {
    translation: teTranslation
  },
  ta: {
    translation: taTranslation
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'arogya-language',
      caches: ['localStorage']
    }
  });

export default i18n;