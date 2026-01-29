
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, getTranslation } from '../translations';
import { api } from '../services/api';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  dir: 'ltr' | 'rtl';
  refreshTranslations: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fa');
  const [dynamicT, setDynamicT] = useState(getTranslation('fa'));

  const dir: 'ltr' | 'rtl' = language === 'en' ? 'ltr' : 'rtl';

  const loadTranslations = async (lang: Language) => {
    const base = getTranslation(lang);
    try {
      const overrides = await api.getSiteConfig();
      // Merge overrides that match the current language
      const langOverrides = overrides[lang] || {};
      setDynamicT({ ...base, ...langOverrides });
    } catch (e) {
      setDynamicT(base);
    }
  };

  useEffect(() => {
    const initLanguage = async () => {
      const savedLang = localStorage.getItem('zabah_lang') as Language;
      if (savedLang && ['en', 'fa', 'ps'].includes(savedLang)) {
        setLanguage(savedLang);
        loadTranslations(savedLang);
      } else {
        // Fetch system default
        try {
          const settings = await api.getSystemSettings();
          const defaultLang = settings.defaultLanguage || 'fa';
          setLanguage(defaultLang);
          loadTranslations(defaultLang);
        } catch (e) {
          setLanguage('fa');
          loadTranslations('fa');
        }
      }
    };
    initLanguage();
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('zabah_lang', lang);
    loadTranslations(lang);
  };

  const refreshTranslations = async () => {
    await loadTranslations(language);
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t: dynamicT,
    dir,
    refreshTranslations
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
