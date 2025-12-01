
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, getTranslation } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // CHANGED: Default language set to 'fa' (Persian)
  const [language, setLanguage] = useState<Language>('fa');

  const dir: 'ltr' | 'rtl' = language === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    // Save preference
    const savedLang = localStorage.getItem('zabah_lang') as Language;
    if (savedLang && ['en', 'fa', 'ps'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('zabah_lang', lang);
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t: getTranslation(language),
    dir
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={dir} className={language === 'en' ? 'font-sans' : 'font-rtl'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
