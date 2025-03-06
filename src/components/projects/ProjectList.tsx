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
            className="border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 overflow-hidden"
            style={{ cursor: onProjectClick ? 'pointer' : 'default' }}
          >
            {project.image_url && (
              <div className="h-40 w-full overflow-hidden bg-[#0B1340]">
                <img
                  src={project.image_url || `/images/projects/default.jpg`}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <CardHeader className="p-4 pb-0">
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              {project.client && (
                <p className="text-sm text-gray-400">{project.client}</p>
              )}
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-gray-300 line-clamp-2">{project.description}</p>
            </CardContent>
            {showStatus && (
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Badge className={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </Badge>
                {project.deadline && (
                  <span className="text-xs text-gray-400">
                    {new Date(project.deadline).toLocaleDateString()}
                  </span>
                )}
              </CardFooter>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectList;