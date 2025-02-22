import React from "react";
import { motion } from "framer-motion";
import ServiceCard from "../services/ServiceCard";

interface ServicesShowcaseProps {
  services?: Array<{
    title: string;
    description: string;
    imageUrl: string;
    ctaText: string;
  }>;
}

const ServicesShowcase = ({
  services = [
    {
      title: "تطوير البرمجيات",
      description:
        "حلول برمجية مخصصة تلبي احتياجات عملك مع التركيز على الأداء والجودة",
      imageUrl:
        "https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3",
      ctaText: "تعرف على المزيد",
    },
    {
      title: "التخطيط الاستراتيجي",
      description: "نساعدك في وضع خطة رقمية شاملة لتحقيق أهداف عملك",
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3",
      ctaText: "اكتشف خدماتنا",
    },
    {
      title: "التسويق الرقمي",
      description: "استراتيجيات تسويقية مبتكرة لتعزيز تواجدك الرقمي",
      imageUrl:
        "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3",
      ctaText: "ابدأ الآن",
    },
  ],
}: ServicesShowcaseProps) => {
  return (
    <section className="relative bg-[#0A1128] py-20 overflow-hidden">
      {/* Modern geometric patterns */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 h-96 w-96 bg-gradient-to-br from-blue-500/20 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 bg-gradient-to-tr from-green-500/20 to-transparent blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">خدماتنا</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            نقدم مجموعة شاملة من الخدمات الرقمية لمساعدة شركتك على النمو
            والازدهار
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <ServiceCard
                title={service.title}
                description={service.description}
                imageUrl={service.imageUrl}
                ctaText={service.ctaText}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesShowcase;
