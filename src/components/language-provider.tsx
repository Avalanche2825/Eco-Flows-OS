"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import translations from "@/lib/translations.json";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
  languages: typeof translations.languages;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("eco-lang");
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("eco-lang", lang);
  };

  const t = (key: string, variables?: Record<string, string | number>) => {
    const langData = (translations as any)[language] || translations.en;
    let text = langData[key] || (translations.en as any)[key] || key;

    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, String(v));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: translations.languages }}>
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
