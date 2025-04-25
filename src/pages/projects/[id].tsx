import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/navigation/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Loader2 } from 'lucide-react';
import projectService from '@/lib/project-service';
import { Project, ProjectStatus, ProjectPriority } from '@/entities/project/model/types';
import { APIProject, UIProject, apiProjectToEntity } from '@/types';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { currentLang, isRTL } = useLanguage();
  const [project, setProject] = useState<UIProject | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (id) {
          const apiProjectData = await projectService.getProject(id);
          // Convert API data to Entity format
          const entityProject = apiProjectToEntity(apiProjectData);
          
          // Add UI-specific properties 
          const enhancedProject: UIProject = {
            ...entityProject,
            // Legacy UI properties
            image_url: apiProjectData.images?.find(img => img.is_primary)?.image || entityProject.image,
            start_date: apiProjectData.created_at,
            end_date: apiProjectData.deadline,
            created_at: apiProjectData.created_at,
            updated_at: apiProjectData.updated_at,
            deadline: apiProjectData.deadline,
            images: apiProjectData.images,
            technologies: [],
          };
          
          setProject(enhancedProject);
        }
      } catch (err) {
        setError('Failed to load project details');
      }
    };

    fetchProject();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar initialLang={currentLang} />
        <main className="container mx-auto pt-20 p-4">
          <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar initialLang={currentLang} />
      <main className="container mx-auto pt-20 p-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">{project?.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            {project ? (
              <div>
                {/* Project Image */}
                {project.image_url && (
                  <div className="mb-6">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                )}
                
                {/* Project Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2 text-white">الوصف</h2>
                  <p>{project.description}</p>
                </div>
                
                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">تفاصيل المشروع</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#FF6B00]" />
                        <span>تاريخ البدء: {project.start_date}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[#FF6B00]" />
                        <span>الموعد النهائي: {project.end_date}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <User className="h-5 w-5 text-[#FF6B00]" />
                        <span>العميل: {project.client?.name}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">التقنيات المستخدمة</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies && project.technologies.length > 0 ? (
                        project.technologies.map((tech, index) => (
                          <Badge key={index}>{tech}</Badge>
                        ))
                      ) : (
                        <p>لم يتم تحديد تقنيات</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button>
                        View Live Site
                      </Button>
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline">
                        View Source Code
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" />
                <span className="ms-3">جاري التحميل...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProjectDetailPage;