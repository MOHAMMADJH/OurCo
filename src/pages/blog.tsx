import React from "react";
import Navbar from "@/components/navigation/Navbar";
import BlogSection from "@/components/sections/BlogSection";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";

const BlogPage = () => {
  const { currentLang, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar initialLang={currentLang} />
      <main className="pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BlogSection showFilters={true} showPagination={true} limit={9} />
        </motion.div>
      </main>
    </div>
  );
};

export default BlogPage;
