'use client';

import { useState, useEffect } from 'react';
import { Language, getLanguage, setLanguage } from '@/lib/i18n';

export default function LanguageSwitcher({ onLanguageChange }: { onLanguageChange?: (lang: Language) => void }) {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentLang(getLanguage());
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCurrentLang(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <button className="px-3 py-1 rounded bg-gray-100 text-gray-700">EN</button>
        <button className="px-3 py-1 rounded bg-gray-100 text-gray-700">AR</button>
        <button className="px-3 py-1 rounded bg-gray-100 text-gray-700">SV</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded ${
          currentLang === 'en' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('ar')}
        className={`px-3 py-1 rounded ${
          currentLang === 'ar' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        AR
      </button>
      <button
        onClick={() => handleLanguageChange('sv')}
        className={`px-3 py-1 rounded ${
          currentLang === 'sv' 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        SV
      </button>
    </div>
  );
}
