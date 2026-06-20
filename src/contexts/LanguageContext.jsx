import React, { createContext, useContext, useEffect, useState } from "react";
import translations from "@/i18n/translations";

const LanguageContext = createContext({
  lang: "ta",
  t: translations.ta,
  setLang: () => {},
});

export function LanguageProvider({ children }) {
  // Tamil as default
  const [lang, setLangState] = useState(
    () => localStorage.getItem("ntk_lang") || "ta"
  );

  const setLang = (next) => {
    setLangState(next);
    localStorage.setItem("ntk_lang", next);
    document.documentElement.lang = next;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = {
    lang,
    t: translations[lang],
    setLang,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);