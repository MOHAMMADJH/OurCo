import React from "react";
import Navbar from "@/components/navigation/Navbar";
import ContactSection from "@/components/sections/ContactSection";
import { useLanguage } from "@/hooks/useLanguage";

const ContactPage = () => {
  const { currentLang, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar initialLang={currentLang} />
      <main className="pt-20">
        <ContactSection />
      </main>
    </div>
  );
};

export default ContactPage;
