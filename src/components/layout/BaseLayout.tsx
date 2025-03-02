import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "../navigation/Navbar";

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
  withNavbar?: boolean;
}

const BaseLayout = ({
  children,
  className = "",
  withNavbar = true,
}: BaseLayoutProps) => {
  const { currentLang, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? "rtl" : "ltr"} ${className}`}>
      {withNavbar && <Navbar initialLang={currentLang} />}
      <main className={withNavbar ? "pt-20" : ""}>{children}</main>
    </div>
  );
};

export default BaseLayout;