import { ProjectStatus } from "@/entities/project/model/types";

// Export all project-related components
export { default as ProjectDetailsDialog } from "../../projects/ProjectDetailsDialog";
export { default as ProjectFormDialog } from "../../projects/ProjectFormDialog";
export { default as ProjectDeleteDialog } from "../../projects/ProjectDeleteDialog";
export { default as ProjectPortfolio } from "../../sections/ProjectPortfolio";

// Export project-related utilities
export const getStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.IN_PROGRESS:
      return "bg-green-500/10 text-green-500";
    case ProjectStatus.COMPLETED:
      return "bg-blue-500/10 text-blue-500";
    case ProjectStatus.PLANNING:
      return "bg-yellow-500/10 text-yellow-500";
    case ProjectStatus.ON_HOLD:
      return "bg-purple-500/10 text-purple-500";
    case ProjectStatus.CANCELLED:
      return "bg-red-500/10 text-red-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  };
};

export const getStatusText = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.IN_PROGRESS:
      return "نشط";
    case ProjectStatus.COMPLETED:
      return "مكتمل";
    case ProjectStatus.PLANNING:
      return "قيد الانتظار";
    case ProjectStatus.ON_HOLD:
      return "في الانتظار";
    case ProjectStatus.CANCELLED:
      return "ملغي";
    default:
      const key = Object.keys(ProjectStatus).find(k => ProjectStatus[k as keyof typeof ProjectStatus] === status);
      return key ? key.replace('_', ' ').toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase()) : 'غير معروف';
  };
};