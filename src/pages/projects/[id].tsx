import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/navigation/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import projectService from '@/lib/project-service';

interface Project {
  id: number;
  title: string;
  description: string;
  client: string;
  start_date: string;
  end_date?: string;
  status: 'planned' | 'in_progress' | 'completed';
  technologies: string[];
  image_url?: string;
  live_url?: string;
  github_url?: string;
}

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { currentLang, isRTL } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await projectService.getProject(Number(id));
        setProject(projectData);
      } catch (err) {
        setError('Failed to load project details');
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  if (!project) {
    return (
      <div className={`min-h-screen bg-gray-950 ${isRTL ? 'rtl' : 'ltr'}`}>
        <Navbar initialLang={currentLang} />
        <main className="pt-20 container mx-auto px-4">
          <p className="text-center text-gray-400">
            {error || 'Loading...'}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Navbar initialLang={currentLang} />
      <main className="pt-20 container mx-auto px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">{project.title}</CardTitle>
            <p className="text-lg text-gray-400">{project.client}</p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <p className="mb-6">{project.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Project Details</h3>
                  <ul className="space-y-2">
                    <li>
                      <span className="text-gray-400">Status:</span>{' '}
                      <span className="capitalize">{project.status.replace('_', ' ')}</span>
                    </li>
                    <li>
                      <span className="text-gray-400">Start Date:</span>{' '}
                      {new Date(project.start_date).toLocaleDateString()}
                    </li>
                    {project.end_date && (
                      <li>
                        <span className="text-gray-400">End Date:</span>{' '}
                        {new Date(project.end_date).toLocaleDateString()}
                      </li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                {project.live_url && (
                  <Button
                    as="a"
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Live Site
                  </Button>
                )}
                {project.github_url && (
                  <Button
                    variant="outline"
                    as="a"
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Source Code
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProjectDetailPage;