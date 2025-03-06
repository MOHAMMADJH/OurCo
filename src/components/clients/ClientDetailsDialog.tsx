import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Mail, Phone, MapPin, Building2, Calendar } from "lucide-react";
import { Client } from "@/lib/client-service";
import clientService from "@/lib/client-service";
import { Skeleton } from "../ui/skeleton";

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: string;
  budget: string;
  progress: number;
}

const getStatusColor = (status: string) => {
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
        const clientData = await clientService.getClient(clientId);
        setClient(clientData);

        const projectsData = await clientService.getClientProjects(clientId);
        setProjects(projectsData);
      } catch (err) {
        console.error("Error fetching client details:", err);
        setError("حدث خطأ أثناء تحميل بيانات العميل");
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
        return "bg-blue-500/10 text-blue-500";
      case "individual":
        return "bg-purple-500/10 text-purple-500";
      default:
        return "bg-gray-500/10 text-gray-500";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0B1340] text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تفاصيل العميل</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        ) : client ? (
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 border-white/10 bg-white/5">
              <TabsTrigger value="info">معلومات العميل</TabsTrigger>
              <TabsTrigger value="projects">المشاريع ({projects.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="py-4">
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <Badge className={getTypeColor(client.type)}>
                  {getTypeText(client.type)}
                </Badge>
                <Badge
                  className={
                    client.status === "active"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-gray-500/10 text-gray-400"
                  }
                >
                  {client.status === "active" ? "نشط" : "غير نشط"}
                </Badge>
              </div>

              <h2 className="mb-2 text-2xl font-bold">{client.name}</h2>
              {client.company && (
                <p className="mb-6 flex items-center gap-2 text-gray-400">
                  <Building2 className="h-4 w-4" />
                  {client.company}
                </p>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <h3 className="mb-4 text-lg font-semibold">معلومات الاتصال</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-[#FF6B00]" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-[#FF6B00]" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-[#FF6B00]" />
                        <span>{client.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <h3 className="mb-4 text-lg font-semibold">ملخص المشاريع</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">عدد المشاريع</span>
                        <span className="font-semibold">{client.projects_count}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">إجمالي القيمة</span>
                        <span className="font-semibold">
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
                <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-gray-400">
                  لا توجد مشاريع لهذا العميل
                </div>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className="border-white/10 bg-white/5"
                    >
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Badge className={getStatusColor(project.status)}>
                            {getStatusText(project.status)}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="h-4 w-4" />
                            {project.deadline}
                          </div>
                        </div>

                        <h4 className="mb-1 text-lg font-semibold">
                          {project.title}
                        </h4>
                        <p className="mb-3 text-sm text-gray-400">
                          {project.description.substring(0, 120)}
                          {project.description.length > 120 ? "..." : ""}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-gray-400">الميزانية:</span>{" "}
                            <span>{project.budget}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">نسبة الإنجاز:</span>{" "}
                            <span>{project.progress}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-[#FF6B00]"
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
          <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-gray-400">
            لم يتم العثور على بيانات العميل
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailsDialog;
