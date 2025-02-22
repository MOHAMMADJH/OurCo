import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const HeroSection = ({
  title = "نُنشئ معاً معادلة نجاحك التسويقي",
  subtitle = "خدماتنا تجمع بين الخبرة والنظرة الاستراتيجية للمنتج نجاحاً تسويقياً باهراً، يحقق لك أهدافك ويميزك عن المنافسين",
  ctaText = "تواصل معنا",
  onCtaClick = () => console.log("CTA clicked"),
}: HeroSectionProps) => {
  return (
    <section className="relative min-h-[100vh] w-full overflow-hidden bg-[#0B1340] px-4 py-16 text-right lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a237e10_0%,transparent_100%)]" />
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF6B00] opacity-[0.15] blur-[150px]" />
        <div className="absolute right-0 top-[20%] h-[300px] w-[300px] rounded-full bg-[#4A90E2] opacity-[0.1] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-6xl">
              {title}
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-gray-300 lg:text-xl">
              {subtitle}
            </p>
            <div className="flex justify-start">
              <Button
                size="lg"
                className="group bg-[#FF6B00] text-lg hover:bg-[#FF8533]"
                onClick={onCtaClick}
              >
                {ctaText}
                <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <img
              src="/hero-illustration.svg"
              alt="Marketing Success"
              className="w-full max-w-[600px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
