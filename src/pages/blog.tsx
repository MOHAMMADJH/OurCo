import React from "react";
import Navbar from "@/components/navigation/Navbar";
import BlogSection from "@/components/sections/BlogSection";
import { useLanguage } from "@/hooks/useLanguage";

const BlogPage = () => {
  const { currentLang, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar initialLang={currentLang} />
      <main className="pt-20">
        <BlogSection />
      </main>
    </div>
  );
};

export default BlogPage;
