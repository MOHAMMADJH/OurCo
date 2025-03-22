import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface ProjectDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onDelete?: () => void; // Added for compatibility with projects.tsx
  projectTitle: string;
}

const ProjectDeleteDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onDelete,
  projectTitle,
}: ProjectDeleteDialogProps) => {
  // Use onDelete if provided, otherwise use onConfirm
  const handleConfirm = () => {
    if (onDelete) {
      onDelete();
    } else {
      onConfirm();
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-white/10 bg-[#0B1340] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>حذف المشروع</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            هل أنت متأكد من حذف مشروع "{projectTitle}"؟ لا يمكن التراجع عن هذا
            الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 hover:bg-white/5">
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={handleConfirm}
          >
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProjectDeleteDialog;
