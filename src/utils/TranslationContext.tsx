import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type { LanguageCode } from './translate';
import { translateText } from './translate';

interface TranslationContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  translate: (text: string) => Promise<string>;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const translate = async (text: string) => {
    return await translateText(text, language);
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslation must be used within TranslationProvider');
  return context;
};
