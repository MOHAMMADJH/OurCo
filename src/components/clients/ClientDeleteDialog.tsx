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

interface ClientDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  clientName: string;
}

const ClientDeleteDialog = ({
  open,
  onOpenChange,
  onConfirm,
  clientName,
}: ClientDeleteDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-white/10 bg-[#0B1340] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد من حذف هذا العميل؟</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            سيتم حذف العميل <span className="font-bold text-white">{clientName}</span>{" "}
            وكافة بياناته. هذا الإجراء لا يمكن التراجع عنه.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white/10">
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600"
          >
            حذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClientDeleteDialog;
