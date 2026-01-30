
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
          // Approximate bounding box for Afghanistan
          const isInAfghanistan = 
            latitude >= 29.0 && latitude <= 39.0 && 
            longitude >= 60.0 && longitude <= 75.0;
          
          resolve(isInAfghanistan ? 'fa' : 'en');
        },
        () => {
          // Fallback to browser language if location is denied
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
      if (savedLang && ['en', 'fa', 'ps'].includes(savedLang)) {
        setLanguage(savedLang);
        loadTranslations(savedLang);
      } else {
        const detected = await detectLocationAndSetLanguage();
        let finalLang = detected;
        
        try {
          const settings = await api.getSystemSettings();
          // System settings override detection if explicitly set by admin, 
          // but usually we want dynamic detection for first-time users.
          finalLang = savedLang || detected || settings.defaultLanguage || 'fa';
        } catch (e) {
          finalLang = detected || 'fa';
        }
        
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
