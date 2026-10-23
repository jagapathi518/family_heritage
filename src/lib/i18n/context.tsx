'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Locale, TranslationDictionary } from './types';
import { en } from './locales/en';
import { te } from './locales/te';
import { Globe } from 'lucide-react';

interface I18nContextType {
  locale: Locale;
  t: TranslationDictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const dictionaries: Record<Locale, TranslationDictionary> = {
  en,
  te,
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Check saved preference or browser setting
    const saved = localStorage.getItem('dfh_language') as Locale;
    if (saved === 'en' || saved === 'te') {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('dfh_language', newLocale);
    document.documentElement.lang = newLocale;
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'te' : 'en');
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        t: dictionaries[locale],
        setLocale,
        toggleLocale,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback to English if used outside provider
    return {
      locale: 'en' as Locale,
      t: en,
      setLocale: () => {},
      toggleLocale: () => {},
    };
  }
  return context;
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, toggleLocale, t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100/80 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-stone-800 dark:text-stone-200 cursor-pointer ${className}`}
      title={locale === 'en' ? 'తెలుగులోకి మార్చండి' : 'Switch to English'}
    >
      <Globe className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
      <span>{locale === 'en' ? 'తెలుగు' : 'English'}</span>
    </button>
  );
}
