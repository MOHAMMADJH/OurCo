import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Building2, Calendar } from "lucide-react";
import { Client } from "@/lib/client-service";
import clientService from "@/lib/client-service";
import { Skeleton } from "@/components/ui/skeleton";
import projectService, { Project } from "@/lib/project-service";
import { API_BASE_URL } from "@/lib/constants";

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-400";
    case "completed":
      return "bg-blue-500/20 text-blue-400";
    case "pending":
      return "bg-amber-500/20 text-amber-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

const getStatusText = (status: string) => {
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

const ClientDetailsDialog = ({
  open,
  onOpenChange,
  clientId,
}: ClientDetailsDialogProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!open) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch client details
        const clientData = await clientService.getClient(clientId);
        console.log("Client data fetched:", clientData);
        setClient(clientData);

        // Fetch client projects using the projects API
        console.log("Fetching projects for client ID:", clientId);
        const projectsData = await clientService.getClientProjects(clientId);
        console.log("Raw projects data:", projectsData);
        
        // Verify if projectsData is an array and has items
        if (!Array.isArray(projectsData)) {
          console.error("Projects data is not an array:", projectsData);
          // Set empty projects instead of mock data
          setProjects([]);
          return;
        }
        
        console.log("Number of projects fetched:", projectsData.length);
        
        // If no projects were returned, set empty projects
        if (projectsData.length === 0) {
          console.log("No projects returned from API");
          setProjects([]);
          return;
        }
        
        // Format the projects data to match the Project interface
        const formattedProjects = projectsData.map((project: any) => {
          console.log("Processing project:", project);
          
          // Handle edge case where project data might be incomplete
          if (!project || !project.id) {
            console.error("Invalid project data:", project);
            return null;
          }
          
          return {
            id: project.id,
            title: project.title || "مشروع بدون عنوان",
            description: project.description || '',
            status: (project.status as "active" | "completed" | "pending") || "pending",
            deadline: project.deadline || 'غير محدد',
            budget: typeof project.budget === 'number' 
              ? project.budget 
              : parseFloat(project.budget) || 0,
            progress: project.progress || 0,
            client: {
              id: clientId,
              name: clientData.name
            },
            images: project.images || [],
            created_at: project.created_at || '',
            updated_at: project.updated_at || ''
          };
        }).filter(Boolean) as Project[]; // Filter out null values
        
        console.log("Formatted projects:", formattedProjects);
        setProjects(formattedProjects);
      } catch (err) {
        console.error("Error fetching client details:", err);
        setError("حدث خطأ أثناء تحميل بيانات العميل");
        
        // Set empty projects instead of mock data
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, clientId]);

  if (!open) return null;

  const getTypeColor = (type: "company" | "individual") => {
    switch (type) {
      case "company":
        return "bg-blue-500/20 text-blue-400";
      case "individual":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getTypeText = (type: "company" | "individual") => {
    switch (type) {
      case "company":
        return "شركة";
      case "individual":
        return "فرد";
      default:
        return type;
    }
  };

  // Format budget for display
  const formatBudget = (budget: number): string => {
    return `${budget.toLocaleString()} ر.س`;
  };

  console.log("Current projects state:", projects);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/15 bg-[#0B1340] text-slate-100 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl mb-2">تفاصيل العميل</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-500/15 p-4 text-red-400 border border-red-500/20">
            {error}
          </div>
        ) : client ? (
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-lg mb-6 p-0 overflow-hidden">
              <TabsTrigger 
                value="info" 
                className="py-3 px-4 font-medium data-[state=active]:bg-[#FF6B00] data-[state=active]:text-white rounded-none">
                معلومات العميل
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="py-3 px-4 font-medium data-[state=active]:bg-[#FF6B00] data-[state=active]:text-white rounded-none">
                المشاريع ({projects.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="py-4">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <Badge className={`${getTypeColor(client.type)} p-1.5 px-2.5`}>
                  {getTypeText(client.type)}
                </Badge>
                <Badge
                  className={
                    client.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }
                >
                  {client.status === "active" ? "نشط" : "غير نشط"}
                </Badge>
              </div>

              <div className="grid gap-6 md:grid-cols-3 mb-6">
                <div className="md:col-span-1">
                  <div className="flex justify-center">
                    <div className="rounded-lg overflow-hidden border border-white/15 bg-white/10 h-48 w-48">
                      {client.image ? (
                        <img 
                          src={client.image}
                          alt={client.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLImageElement).src = client.type === "company" 
                              ? "/images/clients/business-group.png" 
                              : "/images/clients/individual-client.png";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                          <span className="text-6xl font-bold text-white/40">{client.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h2 className="mb-2 text-2xl font-bold text-white">{client.name}</h2>
                  {client.company && (
                    <p className="mb-6 flex items-center gap-2 text-slate-300">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      {client.company}
                    </p>
                  )}
                
                  <div className="space-y-4">
                    <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-md">
                      <h3 className="mb-4 text-lg font-semibold text-white">معلومات الاتصال</h3>
                      <div className="space-y-5">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-[#FF6B00]" />
                          <span className="text-slate-200">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-[#FF6B00]" />
                          <span className="text-slate-200">{client.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-[#FF6B00]" />
                          <span className="text-slate-200">{client.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-1">
                <div className="space-y-4">
                  <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-md">
                    <h3 className="mb-4 text-lg font-semibold text-white">ملخص المشاريع</h3>
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">عدد المشاريع</span>
                        <span className="font-semibold text-white">{client.projects_count || projects.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">إجمالي القيمة</span>
                        <span className="font-semibold text-white">
                          {client.total_value.toLocaleString()} ر.س
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="py-4">
              {projects.length === 0 ? (
                <div className="rounded-lg border border-white/15 bg-white/10 p-8 text-center text-slate-300">
                  لا توجد مشاريع لهذا العميل
                </div>
              ) : (
                <div className="grid gap-5">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className="border-white/15 bg-white/10 hover:bg-white/15 transition-colors shadow-md"
                    >
                      <CardContent className="p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <Badge className={`${getStatusColor(project.status)} p-1.5 px-2.5`}>
                            {getStatusText(project.status)}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            {project.deadline}
                          </div>
                        </div>

                        <h4 className="mb-2 text-xl font-semibold text-white">
                          {project.title}
                        </h4>
                        <p className="mb-4 text-sm text-slate-300 leading-relaxed">
                          {project.description?.substring(0, 120)}
                          {project.description?.length > 120 ? "..." : ""}
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm">
                            <span className="text-slate-400">الميزانية:</span>{" "}
                            <span className="text-slate-200 font-medium">{formatBudget(project.budget)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-slate-400">نسبة الإنجاز:</span>{" "}
                            <span className="text-slate-200 font-medium">{project.progress}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
                          <div
                            className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9D55]"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="rounded-lg border border-white/15 bg-white/10 p-8 text-center text-slate-300">
            لم يتم العثور على بيانات العميل
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsDialog;
