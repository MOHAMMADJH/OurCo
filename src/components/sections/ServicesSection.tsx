import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { servicesService, type Service } from "@/lib/services-service";
import { Loader2 } from "lucide-react";

interface ServicesSectionProps {
  onServiceSelect?: (serviceId: string) => void;
}

const ServicesSection = ({
  onServiceSelect = (id: string) => console.log(`Selected service: ${id}`),
}: ServicesSectionProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesService.getServices();
        setServices(response || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="relative w-full bg-[#0B1340] px-4 py-16 text-right lg:px-8">
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-full bg-[#0B1340] px-4 py-16 text-right lg:px-8">
        <div className="text-center text-gray-400">{error}</div>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-[#0B1340] px-4 py-16 text-right lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a237e10_0%,transparent_100%)]" />
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF6B00] opacity-[0.15] blur-[150px]" />
        <div className="absolute right-0 top-[20%] h-[300px] w-[300px] rounded-full bg-[#4A90E2] opacity-[0.1] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="inline-block rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-lg font-medium text-white">
              خدمات متكاملة
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white lg:text-4xl">
            كل ما يلزم لإطلاق نشاطك التجاري في مكان واحد
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            مع وكالة ابولو للحلول التسويقية
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              onClick={() => onServiceSelect(service.id.toString())}
            >
              <div className="mb-4 text-4xl">{service.icon || "🔧"}</div>
              <h3 className="mb-2 text-xl font-bold text-white">
                {service.title}
              </h3>
              <p className="text-gray-300">{service.short_description || service.description}</p>
              <div className="mt-4 flex items-center justify-end">
                <Button
                  variant="link"
                  className="group px-0 text-[#FF6B00] hover:text-[#FF8533]"
                >
                  اطلع على المزيد
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
