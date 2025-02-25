import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Calendar, Clock, DollarSign, User } from "lucide-react";

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  status: "active" | "completed" | "pending";
  deadline: string;
  budget: string;
  progress: number;
}

interface ProjectDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
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

const ProjectDetailsDialog = ({
  open,
  onOpenChange,
  project,
}: ProjectDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0B1340] text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>تفاصيل المشروع</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(project.status)}>
              {getStatusText(project.status)}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              {project.deadline}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-2xl font-bold">{project.title}</h3>
            <div className="flex items-center gap-2 text-gray-400">
              <User className="h-4 w-4" />
              <span>{project.client}</span>
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
              <p className="text-lg text-white">{project.budget}</p>
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
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsDialog;
