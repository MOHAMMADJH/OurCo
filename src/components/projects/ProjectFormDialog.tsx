import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface ProjectFormData {
  title: string;
  client: string;
  description: string;
  status: "active" | "completed" | "pending";
  deadline: string;
  budget: string;
}

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
  mode?: "create" | "edit";
}

const ProjectFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData = {},
  mode = "create",
}: ProjectFormDialogProps) => {
  const [formData, setFormData] = React.useState<ProjectFormData>({
    title: initialData.title || "",
    client: initialData.client || "",
    description: initialData.description || "",
    status: initialData.status || "pending",
    deadline: initialData.deadline || "",
    budget: initialData.budget || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0B1340] text-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "إضافة مشروع جديد" : "تعديل المشروع"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>عنوان المشروع</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="border-white/10 bg-white/5 text-right text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>العميل</Label>
            <Input
              value={formData.client}
              onChange={(e) =>
                setFormData({ ...formData, client: e.target.value })
              }
              className="border-white/10 bg-white/5 text-right text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>وصف المشروع</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[100px] border-white/10 bg-white/5 text-right text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "completed" | "pending") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="border-white/10 bg-white/5 text-right text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0B1340] text-white">
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الموعد النهائي</Label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="border-white/10 bg-white/5 text-right text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>الميزانية</Label>
            <Input
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
              placeholder="مثال: 50,000 ر.س"
              className="border-white/10 bg-white/5 text-right text-white"
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              type="button"
              className="border-white/10 hover:bg-white/5"
            >
              إلغاء
            </Button>
            <Button type="submit" className="bg-[#FF6B00] hover:bg-[#FF8533]">
              {mode === "create" ? "إضافة" : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
