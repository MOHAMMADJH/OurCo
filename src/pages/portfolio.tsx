import React from "react";
import Navbar from "@/components/navigation/Navbar";
import ProjectPortfolio from "@/components/sections/ProjectPortfolio";
import { useLanguage } from "@/hooks/useLanguage";

const PortfolioPage = () => {
  const { currentLang, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar initialLang={currentLang} />
      <main className="pt-20">
        <ProjectPortfolio />
      </main>
    </div>
  );
};

export default PortfolioPage;
