
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, getTranslation } from '../translations';
import { api, SystemSettings } from '../services/api';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  dir: 'ltr' | 'rtl';
  refreshTranslations: () => Promise<void>;
  siteSettings: SystemSettings | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fa');
  const [dynamicT, setDynamicT] = useState(getTranslation('fa'));
  const [siteSettings, setSiteSettings] = useState<SystemSettings | null>(null);

  const dir: 'ltr' | 'rtl' = language === 'en' ? 'ltr' : 'rtl';

  const loadTranslations = async (lang: Language) => {
    const base = getTranslation(lang);
    try {
      const overrides = await api.getSiteConfig();
      const langOverrides = overrides[lang] || {};
      setDynamicT({ ...base, ...langOverrides });
    } catch (e) {
      setDynamicT(base);
    }
  };

  const detectLocationAndSetLanguage = (): Promise<Language> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve('en');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const isInAfghanistan = 
            latitude >= 29.0 && latitude <= 39.0 && 
            longitude >= 60.0 && longitude <= 75.0;
          
          resolve(isInAfghanistan ? 'fa' : 'en');
        },
        () => {
          const browserLang = navigator.language.toLowerCase();
          if (browserLang.includes('fa')) resolve('fa');
          else if (browserLang.includes('ps')) resolve('ps');
          else resolve('en');
        },
        { timeout: 5000 }
      );
    });
  };

  useEffect(() => {
    const initLanguage = async () => {
      const savedLang = localStorage.getItem('zabah_lang') as Language;
      let settings: SystemSettings | null = null;
      try {
        settings = await api.getSystemSettings();
        setSiteSettings(settings);
      } catch (e) {
        console.error("Failed to load settings", e);
      }

      if (savedLang && ['en', 'fa', 'ps'].includes(savedLang)) {
        setLanguage(savedLang);
        loadTranslations(savedLang);
      } else {
        const detected = await detectLocationAndSetLanguage();
        const finalLang = savedLang || detected || settings?.defaultLanguage || 'fa';
        setLanguage(finalLang);
        loadTranslations(finalLang);
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
    try {
      const settings = await api.getSystemSettings();
      setSiteSettings(settings);
    } catch (e) {}
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t: dynamicT,
    dir,
    refreshTranslations,
    siteSettings
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
