// Export all project-related components
export { default as ProjectDetailsDialog } from "../../projects/ProjectDetailsDialog";
export { default as ProjectFormDialog } from "../../projects/ProjectFormDialog";
export { default as ProjectDeleteDialog } from "../../projects/ProjectDeleteDialog";
export { default as ProjectPortfolio } from "../../sections/ProjectPortfolio";

// Export project-related types
export interface Project {
  id: string;
  title: string;
  client: { id: string; name: string; } | string;
  description: string;
  status: "in_progress" | "completed" | "pending";
  deadline: string;
  budget: number | string;
  progress: number;
  image_url?: string;
}

// Export project-related utilities
export const getStatusColor = (status: Project["status"]) => {
  switch (status) {
    case "in_progress":
      return "bg-green-500/10 text-green-500";
    case "completed":
      return "bg-blue-500/10 text-blue-500";
    case "pending":
      return "bg-yellow-500/10 text-yellow-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  };
};

export const getStatusText = (status: Project["status"]) => {
  switch (status) {
    case "in_progress":
      return "نشط";
    case "completed":
      return "مكتمل";
    case "pending":
      return "قيد الانتظار";
    default:
      return status;
  };
};