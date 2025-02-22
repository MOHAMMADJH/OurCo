import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";

interface Service {
  title: string;
  description: string;
  imageUrl: string;
}

interface ServiceRotatorProps {
  services?: Service[];
  rotationInterval?: number;
}

const ServiceRotator = ({
  services = [
    {
      title: "التخطيط الاستراتيجي",
      description: "نساعدك في وضع خطة رقمية شاملة لمشروعك",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    },
    {
      title: "تطوير البرمجيات",
      description: "نقدم حلول برمجية مبتكرة وعالية الجودة",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    },
    {
      title: "التسويق الرقمي",
      description: "نساعدك في الوصول إلى جمهورك المستهدف",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    },
  ],
  rotationInterval = 5000,
}: ServiceRotatorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, rotationInterval);

    return () => clearInterval(timer);
  }, [services.length, rotationInterval]);

  return (
    <div className="relative h-[320px] w-[960px] overflow-hidden bg-gray-900 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Card className="h-full w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6">
            <div className="flex h-full items-center justify-between gap-8">
              <div className="flex-1 text-right">
                <h3 className="mb-4 text-2xl font-bold text-white">
                  {services[currentIndex].title}
                </h3>
                <p className="text-lg text-gray-300">
                  {services[currentIndex].description}
                </p>
              </div>
              <div className="h-48 w-48 overflow-hidden rounded-lg">
                <img
                  src={services[currentIndex].imageUrl}
                  alt={services[currentIndex].title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-2">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all ${index === currentIndex ? "bg-blue-500 w-4" : "bg-gray-500"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceRotator;
