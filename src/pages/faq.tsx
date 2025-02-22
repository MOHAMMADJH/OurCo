import React from "react";
import Navbar from "@/components/navigation/Navbar";
import FAQSection from "@/components/sections/FAQSection";
import { useLanguage } from "@/hooks/useLanguage";

const FAQPage = () => {
  const { currentLang, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar initialLang={currentLang} />
      <main className="pt-20">
        <FAQSection />
      </main>
    </div>
  );
};

export default FAQPage;
