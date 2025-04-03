import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocalStorage } from "react-use";
import { languages, type Language } from "@/data/languages";
import { formatIntl } from "@/lib/translations";

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [storedLanguage, setStoredLanguage] = useLocalStorage<string>("arogya-language", "en");
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages.find(lang => lang.code === storedLanguage) || languages[0]
  );
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // In production, load from API or static files
        // For now, use the translations from the language object
        setTranslations(currentLanguage.translations || {});
        setStoredLanguage(currentLanguage.code);
      } catch (error) {
        console.error("Failed to load translations:", error);
      }
    };

    loadTranslations();
  }, [currentLanguage, setStoredLanguage]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const t = (key: string, defaultValue?: string): string => {
    return formatIntl(translations, key, defaultValue);
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      t,
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
