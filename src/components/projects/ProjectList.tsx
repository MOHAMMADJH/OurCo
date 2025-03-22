import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/components/features/projects';
import projectService from '@/lib/project-service';
import { getStatusColor, getStatusText } from '@/components/features/projects';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectListProps {
  limit?: number;
  showStatus?: boolean;
  onProjectClick?: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  limit,
  showStatus = true,
  onProjectClick,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getProjects();
        setProjects(limit ? data.slice(0, limit) : data);
        setError(null);
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [limit]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(limit || 3)].map((_, index) => (
          <Card key={index} className="border-white/10 bg-white/5 overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          onClick={() => onProjectClick && onProjectClick(project)}
        >
          <Card 
            className="border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 overflow-hidden group relative shadow-lg hover:shadow-xl"
            style={{ cursor: onProjectClick ? 'pointer' : 'default' }}
          >
            <div className="h-48 w-full overflow-hidden bg-[#0B1340] relative">
              <img
                src={project.image_url || `/images/projects/default.jpg`}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {showStatus && (
                <div className="absolute top-4 right-4">
                  <Badge className={`${getStatusColor(project.status)} shadow-lg font-semibold px-3 py-1`}>
                    {getStatusText(project.status)}
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader className="p-6 pb-3">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-extrabold text-white/95 group-hover:text-[#FF6B00] transition-colors tracking-tight leading-tight">
                    {project.title}
                  </h3>
                  {project.client && (
                    <p className="text-sm text-white/80 mt-2 flex items-center font-medium">
                      <svg className="w-4 h-4 mr-2 text-[#FF6B00]/90" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                      </svg>
                      {typeof project.client === 'string' ? project.client : project.client.name}
                    </p>
                  )}
                </div>
                {project.deadline && (
                  <div className="text-right bg-[#FF6B00]/15 rounded-lg px-3 py-2">
                    <div className="text-sm text-white/90 font-medium flex items-center justify-end">
                      <svg className="w-4 h-4 mr-2 text-[#FF6B00]/90" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                      {new Date(project.deadline).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
              <p className="text-white/70 line-clamp-2 text-base leading-relaxed font-normal">{project.description}</p>
              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-4 py-2.5 bg-[#FF6B00] text-white rounded-lg font-semibold hover:bg-[#FF8533] transition-all transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md">
                  View Details
                </button>
                <button className="px-4 py-2.5 bg-white/5 text-white/90 rounded-lg font-medium hover:bg-white/15 hover:text-white transition-all transform hover:-translate-y-0.5 border border-white/10 hover:border-white/20 active:translate-y-0">
                  Share
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectList;