import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProjectFormDialog, {
  ProjectFormData,
} from "@/components/projects/ProjectFormDialog";
import ProjectDeleteDialog from "@/components/projects/ProjectDeleteDialog";
import ProjectDetailsDialog from "@/components/projects/ProjectDetailsDialog";
import ProjectImagesDialog from "@/components/projects/ProjectImagesDialog";
import ProjectProgressDialog from "@/components/projects/ProjectProgressDialog";
import {
  Plus,
  Search,
  Calendar,
  Edit2,
  Trash2,
  ExternalLink,
  Image,
  BarChart2,
  User,
  DollarSign,
} from "lucide-react";
import projectService from "@/lib/project-service";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface ProjectImage {
  id: string;
  image: string;
  caption?: string;
  is_primary: boolean;
}

interface Client {
  id: string;
  name: string;
  type: "company" | "individual";
  status: "active" | "inactive";
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "pending";
  deadline: string;
  budget: number;
  progress: number;
  client: {
    id: string;
    name: string;
  };
  images: ProjectImage[];
  created_at: string;
  updated_at: string;
}

const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-500";
    case "completed":
      return "bg-blue-500/10 text-blue-500";
    case "pending":
      return "bg-yellow-500/10 text-yellow-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const getStatusText = (status: Project["status"]) => {
  switch (status) {
    case "active":
      return "نشط";
    case "completed":
      return "مكتمل";
    case "pending":
      return "قيد الانتظار";
    default:
      return status;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getProgressColor = (progress: number) => {
  if (progress < 30) return "bg-red-500";
  if (progress < 70) return "bg-yellow-500";
  return "bg-green-500";
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Project["status"] | "all">("all");
  
  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل المشاريع');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (data: ProjectFormData) => {
    try {
      await projectService.createProject(data);
      fetchProjects();
      setFormDialogOpen(false);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('حدث خطأ أثناء إنشاء المشروع');
    }
  };

  const handleUpdateProject = async (id: string, data: Partial<ProjectFormData>) => {
    try {
      await projectService.updateProject(id, data);
      fetchProjects();
      setFormDialogOpen(false);
    } catch (err) {
      console.error('Error updating project:', err);
      setError('حدث خطأ أثناء تحديث المشروع');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      fetchProjects();
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('حدث خطأ أثناء حذف المشروع');
    }
  };

  const filteredProjects = projects.filter((project) => {
    // Filter by search query
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة المشاريع"
        subtitle="إدارة وتتبع جميع مشاريع الشركة"
      />

      <div className="space-y-6 p-6">
        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="البحث عن مشروع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-white/10 bg-white/5 pr-10 text-right text-white w-full"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as any)}
            >
              <SelectTrigger className="w-[180px] border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0B1340] text-white">
                <SelectItem value="all">جميع المشاريع</SelectItem>
                <SelectItem value="active">المشاريع النشطة</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="completed">المشاريع المكتملة</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={() => {
                setSelectedProject(null);
                setFormDialogOpen(true);
              }}
              className="bg-[#FF6B00] hover:bg-[#FF6B00]/90"
            >
              <Plus className="ml-2 h-4 w-4" />
              مشروع جديد
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-white/10 bg-white/5">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-6 w-1/3 mb-4" />
                  <div className="flex justify-between mt-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/5 p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">لا توجد مشاريع</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "لا توجد مشاريع تطابق معايير البحث الخاصة بك"
                : "لم يتم إضافة أي مشاريع حتى الآن"}
            </p>
            <Button
              onClick={() => {
                setSelectedProject(null);
                setFormDialogOpen(true);
              }}
              className="bg-[#FF6B00] hover:bg-[#FF6B00]/90"
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة مشروع جديد
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-white/10 bg-white/5 overflow-hidden hover:bg-white/[0.07] hover:border-white/20 transition-all duration-200 transform hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="relative h-40 group">
                      {project.images && project.images.length > 0 ? (
                        <img
                          src={project.images.find(img => img.is_primary)?.image || project.images[0]?.image || '/placeholder-project.jpg'}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-[#0B1340]/90 to-[#0B1340]">
                          <Image className="h-16 w-16 text-white/20" />
                        </div>
                      )}
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        onClick={() => {
                          setSelectedProject(project);
                          setImagesDialogOpen(true);
                        }}
                      >
                        <Image className="h-4 w-4 text-white" />
                      </Button>
                      <Badge
                        className={`absolute top-2 right-2 ${getStatusColor(project.status)} shadow-lg`}
                      >
                        {getStatusText(project.status)}
                      </Badge>
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold mb-3 line-clamp-1 text-white">
                        {project.title}
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-300">
                          <User className="h-4 w-4 ml-2 text-gray-400" />
                          <span className="line-clamp-1 font-medium">{project.client?.name || 'عميل غير معروف'}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="h-4 w-4 ml-2 text-gray-400" />
                          <span className="font-medium">
                            {new Date(project.deadline).toLocaleDateString("ar-SA")}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-300">
                          <DollarSign className="h-4 w-4 ml-2 text-gray-400" />
                          <span className="font-medium">{formatCurrency(project.budget)}</span>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-300">نسبة الإنجاز</span>
                          <span className="font-semibold text-white">{project.progress}%</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(project.progress)} transition-all duration-300`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 hover:bg-white/10 hover:border-white/20 h-9 w-9 p-0 transition-colors"
                            onClick={() => {
                              setSelectedProject(project);
                              setDetailsDialogOpen(true);
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 h-9 w-9 p-0 transition-colors"
                            onClick={() => {
                              setSelectedProject(project);
                              setProgressDialogOpen(true);
                            }}
                          >
                            <BarChart2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 hover:bg-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/30 h-9 w-9 p-0 transition-colors"
                            onClick={() => {
                              setSelectedProject(project);
                              setFormDialogOpen(true);
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 h-9 w-9 p-0 transition-colors"
                            onClick={() => {
                              setSelectedProject(project);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Project Form Dialog */}
      <ProjectFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={selectedProject 
          ? (data) => handleUpdateProject(selectedProject.id, data) 
          : handleCreateProject
        }
        defaultValues={selectedProject ? {
          title: selectedProject.title,
          description: selectedProject.description,
          client_id: selectedProject.client?.id || '',
          status: selectedProject.status,
          deadline: selectedProject.deadline,
          budget: selectedProject.budget,
          progress: selectedProject.progress,
        } : undefined}
        projectId={selectedProject?.id}
      />

      {/* Project Delete Dialog */}
      {selectedProject && (
        <ProjectDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          projectId={selectedProject.id}
          projectTitle={selectedProject.title}
          onDelete={() => handleDeleteProject(selectedProject.id)}
        />
      )}

      {/* Project Details Dialog */}
      {selectedProject && (
        <ProjectDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          projectId={selectedProject.id}
        />
      )}

      {/* Project Images Dialog */}
      {selectedProject && (
        <ProjectImagesDialog
          open={imagesDialogOpen}
          onOpenChange={setImagesDialogOpen}
          projectId={selectedProject.id}
        />
      )}

      {/* Project Progress Dialog */}
      {selectedProject && (
        <ProjectProgressDialog
          open={progressDialogOpen}
          onOpenChange={setProgressDialogOpen}
          projectId={selectedProject.id}
          currentProgress={selectedProject.progress}
          onProgressUpdated={fetchProjects}
        />
      )}
    </DashboardLayout>
  );
};

export default ProjectsPage;
