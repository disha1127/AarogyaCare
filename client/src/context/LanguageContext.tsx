import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { languages, type Language } from "@/data/languages";
import i18n from "@/lib/i18n";

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: any) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { t, i18n: i18nInstance } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages.find(lang => lang.code === i18n.language) || languages[0]
  );

  // Update currentLanguage when i18n language changes
  useEffect(() => {
    const language = languages.find(lang => lang.code === i18nInstance.language) || languages[0];
    setCurrentLanguage(language);
  }, [i18nInstance.language]);

  const setLanguage = (lang: Language) => {
    i18nInstance.changeLanguage(lang.code);
  };

  const translateWithNesting = (key: string, options?: any): string => {
    // First try with the direct key
    let translated = t(key, { ...options, returnObjects: false });
    
    // If it's not a string, try with common prefix since many translations are under 'common'
    if (typeof translated !== 'string') {
      translated = t(`common.${key}`, { ...options, returnObjects: false });
    }
    
    // If still not a string, return the key itself as fallback
    return typeof translated === 'string' ? translated : key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      t: translateWithNesting,
      availableLanguages: languages 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
