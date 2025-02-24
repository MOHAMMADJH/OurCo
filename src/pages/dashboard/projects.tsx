import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Calendar,
  Edit2,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  client: string;
  status: "active" | "completed" | "pending";
  deadline: string;
  budget: string;
  progress: number;
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "تطوير موقع شركة التقنية",
    client: "شركة التقنية المتقدمة",
    status: "active",
    deadline: "2024-06-30",
    budget: "50,000 ر.س",
    progress: 65,
  },
  {
    id: "2",
    title: "تصميم هوية بصرية",
    client: "مؤسسة الإبداع",
    status: "pending",
    deadline: "2024-05-15",
    budget: "15,000 ر.س",
    progress: 0,
  },
  {
    id: "3",
    title: "حملة تسويقية شاملة",
    client: "شركة الأغذية العالمية",
    status: "completed",
    deadline: "2024-03-01",
    budget: "75,000 ر.س",
    progress: 100,
  },
];

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

const ProjectsPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة المشاريع"
        subtitle="عرض وإدارة جميع المشاريع"
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="البحث عن مشروع..."
              className="border-white/10 bg-white/5 pr-10 text-right text-white placeholder:text-gray-400"
            />
          </div>
          <Button className="bg-[#FF6B00] hover:bg-[#FF8533]">
            <Plus className="mr-2 h-4 w-4" />
            إضافة مشروع جديد
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((project) => (
            <Card
              key={project.id}
              className="border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-white">
                  {project.title}
                </h3>
                <p className="mb-4 text-sm text-gray-400">{project.client}</p>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">الميزانية:</span>
                    <span className="text-white">{project.budget}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">الموعد النهائي:</span>
                    <div className="flex items-center gap-1 text-white">
                      <Calendar className="h-4 w-4" />
                      {project.deadline}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">التقدم:</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#FF6B00] transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;
