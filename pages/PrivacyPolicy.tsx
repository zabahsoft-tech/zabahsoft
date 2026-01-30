
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

const PrivacyPolicy: React.FC = () => {
  const { language, dir } = useLanguage();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const legal = await api.getLegalContent('privacy');
        setContent(legal[language] || legal['en'] || '');
      } catch (err) {
        console.error("Legal fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [language]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="bg-white dark:bg-[#0d1117] min-h-screen py-24 px-4" dir={dir}>
      <article className="max-w-4xl mx-auto prose prose-blue dark:prose-invert">
        <div className="bg-gray-50 dark:bg-[#161b22] p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl" dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </div>
  );
};

export default PrivacyPolicy;
