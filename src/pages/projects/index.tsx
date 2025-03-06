import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/navigation/Navbar';
import { Project } from '@/components/features/projects';
import ProjectList from '@/components/projects/ProjectList';
import ProjectDetailsDialog from '@/components/projects/ProjectDetailsDialog';
import { motion } from 'framer-motion';

const ProjectsPage = () => {
  const { currentLang, isRTL } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setDetailsDialogOpen(true);
  };

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar initialLang={currentLang} />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-block rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-lg font-medium text-white">مشاريعنا</span>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white lg:text-4xl">
            استكشف أحدث مشاريعنا
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            نفخر بتقديم مجموعة متنوعة من المشاريع التي تعكس خبرتنا وإبداعنا في مجال التصميم والتطوير
          </p>
        </motion.div>

        <div className="mt-12">
          <ProjectList onProjectClick={handleProjectClick} />
        </div>

        {selectedProject && (
          <ProjectDetailsDialog
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
            project={selectedProject}
          />
        )}
      </main>

      <footer className="bg-[#0A0F2F] py-8 text-center text-sm text-gray-500">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} OurCo. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
};

export default ProjectsPage;