import React from "react";
import BlogSection from "./sections/BlogSection";
import FAQSection from "./sections/FAQSection";
import Navbar from "./navigation/Navbar";
import HeroSection from "./sections/HeroSection";
import ServicesSection from "./sections/ServicesSection";
import ProjectPortfolio from "./sections/ProjectPortfolio";
import ClientsSection from "./sections/ClientsSection";
import ContactSection from "./sections/ContactSection";
import { useLanguage } from "@/hooks/useLanguage";

const Home = () => {
  const { currentLang, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-black ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar initialLang={currentLang} />
      <main className="pt-20">
        <HeroSection />
        <ServicesSection />
        <ProjectPortfolio />
        <ClientsSection />
        <BlogSection />
        <FAQSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default Home;
