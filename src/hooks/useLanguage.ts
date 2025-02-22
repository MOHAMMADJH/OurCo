import { useState } from "react";
import { Language } from "@/lib/i18n";

export function useLanguage(initialLang: Language = "ar") {
  const [currentLang, setCurrentLang] = useState<Language>(initialLang);

  const toggleLanguage = () => {
    setCurrentLang(currentLang === "ar" ? "en" : "ar");
  };

  return {
    currentLang,
    setLanguage: setCurrentLang,
    toggleLanguage,
    isRTL: currentLang === "ar",
  };
}
