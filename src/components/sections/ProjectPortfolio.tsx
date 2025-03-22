import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import projectService from "../../lib/project-service";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface ProjectPortfolioProps {
  projects?: Project[];
}

// Define a static default image path to prevent infinite network requests
const DEFAULT_PROJECT_IMAGE = "/images/project-default.png";

const ProjectPortfolio = ({ projects: propProjects }: ProjectPortfolioProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If projects are provided as props, use them
    if (propProjects && propProjects.length > 0) {
      setProjects(propProjects);
      setLoading(false);
      return;
    }

    // Otherwise fetch projects from the API
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const fetchedProjects = await projectService.getProjects();
        
        // Map API projects to the format needed by this component
        const mappedProjects = fetchedProjects.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          // Use first image as project cover, or fallback to default image
          // Use a static path instead of a relative path to prevent infinite requests
          imageUrl: project.images && project.images.length > 0 && project.images[0].image
            ? project.images.find(img => img.is_primary)?.image || project.images[0].image
            : DEFAULT_PROJECT_IMAGE
        }));
        
        setProjects(mappedProjects);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("حدث خطأ أثناء تحميل المشاريع");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [propProjects]);

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

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="mx-auto max-w-md rounded-lg bg-red-500/20 p-4 text-center text-red-100">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="mx-auto max-w-md rounded-lg bg-blue-500/20 p-4 text-center text-blue-100">
            لا توجد مشاريع لعرضها حالياً
          </div>
        ) : (
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
                    src={project.imageUrl || DEFAULT_PROJECT_IMAGE}
                    alt={project.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).src = DEFAULT_PROJECT_IMAGE;
                    }}
                  />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {project.title}
                </h3>
                <p className="text-gray-300">{project.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectPortfolio;
