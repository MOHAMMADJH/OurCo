import React from "react";
import { motion } from "framer-motion";

interface Client {
  id: number;
  name: string;
  description: string;
  logo: string;
  industry: string;
}

interface ClientsSectionProps {
  clients?: Client[];
}

const defaultClients: Client[] = [
  {
    id: 1,
    name: "شركة التقنية المتقدمة",
    description: "رائدة في مجال الحلول التقنية المبتكرة",
    logo: "/images/clients/tech-company.png",
    industry: "التقنية",
  },
  {
    id: 2,
    name: "مجموعة الأعمال الدولية",
    description: "خدمات استشارية وحلول أعمال متكاملة",
    logo: "/images/clients/business-group.png",
    industry: "الاستشارات",
  },
  {
    id: 3,
    name: "شركة البناء الحديثة",
    description: "تطوير وإدارة المشاريع العقارية",
    logo: "/images/clients/construction-company.png",
    industry: "العقارات",
  },
  {
    id: 4,
    name: "مؤسسة التعليم الذكي",
    description: "منصات تعليمية رقمية متطورة",
    logo: "/images/clients/education-institute.png",
    industry: "التعليم",
  },
];

const ClientsSection = ({ clients = defaultClients }: ClientsSectionProps) => {
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
            <span className="text-lg font-medium text-white">عملاؤنا</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white lg:text-4xl">
            نفخر بثقة عملائنا في خدماتنا
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              <div className="mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg bg-[#0B1340]">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-24 w-24 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-[#FF6B00]/20 px-3 py-1 text-sm text-[#FF6B00]">
                  {client.industry}
                </span>
                <h3 className="text-xl font-bold text-white">{client.name}</h3>
              </div>
              <p className="text-gray-300">{client.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-300">
            انضم إلى قائمة عملائنا المميزين واستفد من خدماتنا المتكاملة
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsSection;
