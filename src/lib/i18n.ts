export type Language = "ar" | "en";

export const COMPANY_NAME = "Apollo";
export const BRAND_COLORS = {
  primary: "#000000", // Pure black
  secondary: "#ffffff", // White
  accent: "#ffffff", // White accents
  highlight: "#ffffff", // White highlights
};

export const translations = {
  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "خدماتنا",
      portfolio: "مشاريعنا",
      blog: "المدونة",
      faq: "الأسئلة الشائعة",
      contact: "تواصل معنا",
      privacy: "سياسة الخصوصية",
      changeLanguage: "تغيير اللغة",
    },
    hero: {
      title: "نحن نبني مستقبلكم الرقمي",
      subtitle: "خدمات برمجية متكاملة لتحويل رؤيتكم إلى واقع",
    },
    // Add more translations as needed
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      portfolio: "Portfolio",
      blog: "Blog",
      faq: "FAQ",
      contact: "Contact",
      privacy: "Privacy Policy",
      changeLanguage: "Change Language",
    },
    hero: {
      title: "Building Your Digital Future",
      subtitle:
        "Comprehensive Software Services to Transform Your Vision into Reality",
    },
    // Add more translations as needed
  },
};
