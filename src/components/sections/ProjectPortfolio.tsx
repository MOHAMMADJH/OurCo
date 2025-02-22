import React from "react";
import { motion } from "framer-motion";

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface ProjectPortfolioProps {
  projects?: Project[];
}

const defaultProjects: Project[] = [
  {
    id: 1,
    title: "إدارة الحملات الإعلانية",
    description: "نقدم خدمات إدارة الحملات الإعلانية بكفاءة عالية",
    imageUrl: "/images/ad-campaign.png",
  },
  {
    id: 2,
    title: "تحسين محركات البحث",
    description: "نساعدك في تحسين ظهور موقعك في نتائج البحث",
    imageUrl: "/images/seo.png",
  },
  {
    id: 3,
    title: "تصميمات السوشيال ميديا",
    description: "نصمم محتوى جذاب ومميز لمنصات التواصل الاجتماعي",
    imageUrl: "/images/social-media.png",
  },
  {
    id: 4,
    title: "تصميم العلامات التجارية",
    description: "نقدم خدمات تصميم الهوية البصرية المتكاملة",
    imageUrl: "/images/branding.png",
  },
];

const ProjectPortfolio = ({
  projects = defaultProjects,
}: ProjectPortfolioProps) => {
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
            <span className="text-lg font-medium text-white">معرض أعمالنا</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white lg:text-4xl">
            بعض الأعمال التي قمنا بتنفيذها
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group cursor-pointer rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              <div className="mb-4 h-40 w-full overflow-hidden rounded-lg bg-[#0B1340]">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                {project.title}
              </h3>
              <p className="text-gray-300">{project.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectPortfolio;
