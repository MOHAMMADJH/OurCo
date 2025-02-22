import React from "react";
import Navbar from "@/components/navigation/Navbar";
import ServicesShowcase from "@/components/sections/ServicesShowcase";
import { useLanguage } from "@/hooks/useLanguage";

const ServicesPage = () => {
  const { currentLang, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar initialLang={currentLang} />
      <main className="pt-20">
        <ServicesShowcase />
      </main>
    </div>
  );
};

export default ServicesPage;
