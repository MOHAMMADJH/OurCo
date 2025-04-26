import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Calendar, Clock, DollarSign, User } from "lucide-react";
import projectService from "@/lib/project-service";

interface Project {
  id: string;
  title: string;
  description: string;
  status: "in_progress" | "completed" | "pending";
  deadline: string;
  budget: number;
  progress: number;
  client: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface ProjectDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "in_progress":
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
    case "in_progress":
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

const ProjectDetailsDialog = ({
  open,
  onOpenChange,
  projectId,
}: ProjectDetailsDialogProps) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (open && projectId) {
        try {
          setLoading(true);
          const data = await projectService.getProject(projectId);
          setProject(data);
          setError(null);
        } catch (err) {
          setError('فشل في تحميل تفاصيل المشروع');
          console.error('Error fetching project details:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProjectDetails();
  }, [projectId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0B1340] text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>تفاصيل المشروع</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-6 py-4">
            <div className="h-6 w-24 rounded bg-white/5 animate-pulse"></div>
            <div className="h-10 w-full rounded bg-white/5 animate-pulse"></div>
            <div className="h-20 w-full rounded bg-white/5 animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 rounded bg-white/5 animate-pulse"></div>
              <div className="h-24 rounded bg-white/5 animate-pulse"></div>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        ) : project ? (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(project.status)}>
                {getStatusText(project.status)}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                {new Date(project.deadline).toLocaleDateString("ar-SA")}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-2xl font-bold">{project.title}</h3>
              <div className="flex items-center gap-2 text-gray-400">
                <User className="h-4 w-4" />
                <span>{project.client?.name || 'عميل غير معروف'}</span>
              </div>
            </div>

            <div className="rounded-lg bg-white/5 p-4">
              <h4 className="mb-2 font-semibold">وصف المشروع</h4>
              <p className="text-gray-300">{project.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#FF6B00]" />
                  <span className="font-semibold">الميزانية</span>
                </div>
                <p className="text-lg text-white">{formatCurrency(project.budget)}</p>
              </div>

              <div className="rounded-lg bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#FF6B00]" />
                  <span className="font-semibold">نسبة الإنجاز</span>
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
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-yellow-500/10 p-4 text-yellow-500">
            لم يتم العثور على المشروع
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsDialog;
