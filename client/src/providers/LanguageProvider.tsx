import React, { createContext, useContext, useState, useEffect } from 'react';
import { matchLocale } from '@/utils/i18n';
import { languages } from '@/data/languages';
import { translations } from '@/data/translations/en';
import type { Translation } from '@/data/translations/en';

interface LanguageContextType {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: keyof Translation) => string;
  currentTranslations: Translation;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key as string,
  currentTranslations: translations,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTranslations, setCurrentTranslations] = useState<Translation>(translations);
  const [language, setLanguageState] = useState<string>(() => {
    // Try to get from localStorage first
    const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    if (storedLanguage) return storedLanguage;
    
    // Otherwise, detect from browser
    if (typeof navigator !== 'undefined') {
      const browserLanguages = navigator.languages || [navigator.language];
      return matchLocale(browserLanguages, Object.keys(languages)) || 'en';
    }
    
    return 'en';
  });

  const setLanguage = async (code: string) => {
    setLanguageState(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', code);
    }
    
    // Dynamically import translation file
    try {
      const translationModule = await import(`../data/translations/${code}.ts`);
      setCurrentTranslations(translationModule.translations);
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to English
      const enModule = await import('../data/translations/en.ts');
      setCurrentTranslations(enModule.translations);
    }
  };

  // Load initial translations
  useEffect(() => {
    if (language !== 'en') {
      setLanguage(language);
    }
  }, [language]);

  // Translation function
  const t = (key: keyof Translation): string => {
    return currentTranslations[key] || key as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};
