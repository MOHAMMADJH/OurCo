import React, { useEffect, useState } from "react";
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
import { Slider } from "../ui/slider";
import clientService, { Client } from "@/lib/client-service";
import { X, Loader2, DollarSign, AlertCircle } from "lucide-react";
import { ProjectFormData } from "@/lib/project-service";
import ProjectImagesPreview from "./ProjectImagesPreview";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormData) => void;
  defaultValues?: Partial<ProjectFormData>;
  projectId?: string;
}

const ProjectFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
  projectId,
}: ProjectFormDialogProps) => {
  const isEditMode = !!defaultValues.title; // If we have a title, we're editing an existing project

  const [formData, setFormData] = useState<ProjectFormData>({
    title: defaultValues.title || "",
    client_id: defaultValues.client_id ? String(defaultValues.client_id) : "",
    description: defaultValues.description || "",
    status: defaultValues.status || "pending",
    deadline: defaultValues.deadline || new Date().toISOString().split("T")[0],
    budget: typeof defaultValues.budget === 'number' ? parseFloat(defaultValues.budget.toFixed(2)) : 0,
    progress: defaultValues.progress || 0,
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Reset form when the dialog opens or defaultValues changes
  useEffect(() => {
    if (open) {
      // استخراج معرف العميل من مختلف الأنماط الممكنة
      let clientId = "";
      
      // حالة 1: إذا كان client_id متوفر كمعرف
      if (defaultValues.client_id && defaultValues.client_id !== "undefined") {
        clientId = String(defaultValues.client_id);
      } 
      // حالة 2: إذا كان العميل متوفر ككائن
      else if (defaultValues.client && typeof defaultValues.client === 'object' && defaultValues.client.id) {
        clientId = String(defaultValues.client.id);
      }
      // حالة 3: إذا كان العميل متوفر كرقم فقط
      else if (defaultValues.client && typeof defaultValues.client === 'number') {
        clientId = String(defaultValues.client);
      }
      
      console.log("Setting clientId in form to:", clientId);
      
      setFormData({
        title: defaultValues.title || "",
        client_id: clientId,
        description: defaultValues.description || "",
        status: defaultValues.status || "pending",
        deadline: defaultValues.deadline || new Date().toISOString().split("T")[0],
        budget: typeof defaultValues.budget === 'number' ? parseFloat(defaultValues.budget.toFixed(2)) : 0,
        progress: defaultValues.progress || 0,
      });
      
      setValidationErrors({});
      
      console.log("Form data on open:", {
        defaultClientId: defaultValues.client_id,
        rawClientValue: defaultValues.client,
        extractedClientId: clientId,
        budget: defaultValues.budget,
        formattedBudget: typeof defaultValues.budget === 'number' ? parseFloat(defaultValues.budget.toFixed(2)) : 0
      });
      
      // تأكد من تحميل العملاء عند تحرير المشروع
      fetchClients();
    }
  }, [open, defaultValues]);

  // Load clients only once when component mounts
  useEffect(() => {
    if (clients.length === 0) {
      fetchClients();
    }
  }, []);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const data = await clientService.getClients();
      const activeClients = data.filter((client) => client.status === "active");
      console.log("Fetched clients:", activeClients);
      console.log("Current formData client_id:", formData.client_id);
      
      setClients(activeClients);
      setError(null);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("فشل في تحميل قائمة العملاء");
    } finally {
      setLoadingClients(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "عنوان المشروع مطلوب";
    }

    if (!formData.client_id) {
      errors.client_id = "يرجى اختيار العميل";
    }

    if (!formData.description.trim()) {
      errors.description = "وصف المشروع مطلوب";
    }

    if (!formData.deadline) {
      errors.deadline = "الموعد النهائي مطلوب";
    }

    if (formData.budget <= 0) {
      errors.budget = "يرجى إدخال ميزانية صحيحة";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Round budget to 2 decimal places before submitting
      const formattedData = {
        ...formData,
        budget: parseFloat(formData.budget.toFixed(2))
      };
      onSubmit(formattedData);
    }
  };

  const handleBudgetChange = (value: string) => {
    // Remove any non-digits or dots
    const sanitizedValue = value.replace(/[^\d.]/g, "");
    
    // Ensure we only have one decimal point
    const parts = sanitizedValue.split('.');
    const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
    
    // Don't immediately parse to number to allow proper typing
    if (formattedValue === '') {
      setFormData({ ...formData, budget: 0 });
    } else {
      const numericValue = parseFloat(formattedValue);
      setFormData({ ...formData, budget: numericValue });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0B1340] text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "تعديل المشروع" : "إضافة مشروع جديد"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 text-red-500 flex gap-2 items-start">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان المشروع</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="border-white/10 bg-white/5 text-right text-white"
              required
            />
            {validationErrors.title && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">العميل</Label>
            {loadingClients ? (
              <div className="flex items-center gap-2 border border-white/10 rounded-md p-2 bg-white/5">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-gray-400">جاري تحميل العملاء...</span>
              </div>
            ) : (
              <Select
                value={formData.client_id || ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, client_id: value }));
                }}
                required
              >
                <SelectTrigger id="client" className="border-white/10 bg-white/5 text-right text-white">
                  <SelectValue placeholder="اختر العميل" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0B1340] text-white">
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={String(client.id)}>
                        {client.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no_clients" disabled>
                      لا يوجد عملاء نشطين
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
            {validationErrors.client_id && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.client_id}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف المشروع</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[100px] border-white/10 bg-white/5 text-right text-white"
              required
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "completed" | "pending") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status" className="border-white/10 bg-white/5 text-right text-white">
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
              <Label htmlFor="deadline">الموعد النهائي</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="border-white/10 bg-white/5 text-right text-white"
                required
              />
              {validationErrors.deadline && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.deadline}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">الميزانية</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="budget"
                type="text"
                value={formData.budget !== undefined && formData.budget !== null ? 
                  formData.budget.toString() : 
                  "0"}
                onChange={(e) => handleBudgetChange(e.target.value)}
                placeholder="مثال: 50000.00"
                className="border-white/10 bg-white/5 text-right text-white pl-10"
                required
              />
            </div>
            {validationErrors.budget && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.budget}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>نسبة الإنجاز: {formData.progress}%</Label>
              <span className="text-sm text-gray-400">{formData.progress}%</span>
            </div>
            <Slider
              value={[formData.progress]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) =>
                setFormData({ ...formData, progress: value[0] })
              }
              className="py-4"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              type="button"
              className="border border-white/20 hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              إلغاء
            </Button>
            <Button type="submit" className="bg-[#FF6B00] hover:bg-[#FF8533]">
              {isEditMode ? "حفظ التغييرات" : "إضافة المشروع"}
            </Button>
          </DialogFooter>
        </form>

        {isEditMode && projectId && (
          <div className="pt-4 border-t border-white/10 mt-6">
            <h3 className="font-medium mb-4">صور المشروع</h3>
            <ProjectImagesPreview projectId={projectId} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
