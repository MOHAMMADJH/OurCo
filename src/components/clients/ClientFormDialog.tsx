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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AlertCircle } from "lucide-react";
import { Client } from "@/lib/client-service";

export interface ClientFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  type: "company" | "individual";
  status: "active" | "inactive";
}

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClientFormData) => void;
  defaultValues?: Partial<ClientFormData>;
}

const ClientFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: ClientFormDialogProps) => {
  const isEditMode = !!defaultValues.name; // If we have a name, we're editing an existing client

  const [formData, setFormData] = useState<ClientFormData>({
    name: defaultValues.name || "",
    company: defaultValues.company || "",
    email: defaultValues.email || "",
    phone: defaultValues.phone || "",
    location: defaultValues.location || "",
    type: defaultValues.type || "company",
    status: defaultValues.status || "active",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Reset form when the dialog opens or defaultValues changes
  useEffect(() => {
    if (open) {
      setFormData({
        name: defaultValues.name || "",
        company: defaultValues.company || "",
        email: defaultValues.email || "",
        phone: defaultValues.phone || "",
        location: defaultValues.location || "",
        type: defaultValues.type || "company",
        status: defaultValues.status || "active",
      });
      setValidationErrors({});
    }
  }, [open, defaultValues]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "اسم العميل مطلوب";
    }

    if (!formData.email.trim()) {
      errors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }

    if (!formData.phone.trim()) {
      errors.phone = "رقم الهاتف مطلوب";
    }

    if (!formData.location.trim()) {
      errors.location = "الموقع الجغرافي مطلوب";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-[#0B1340] text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "تعديل بيانات العميل" : "إضافة عميل جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم العميل</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border-white/10 bg-white/5 text-right text-white"
              required
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">اسم الشركة/المؤسسة</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="border-white/10 bg-white/5 text-right text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border-white/10 bg-white/5 text-right text-white"
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="border-white/10 bg-white/5 text-right text-white"
                required
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">الموقع الجغرافي</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="border-white/10 bg-white/5 text-right text-white"
              required
            />
            {validationErrors.location && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">نوع العميل</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "company" | "individual") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger id="type" className="border-white/10 bg-white/5 text-right text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0B1340] text-white">
                  <SelectItem value="company">شركة</SelectItem>
                  <SelectItem value="individual">فرد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status" className="border-white/10 bg-white/5 text-right text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0B1340] text-white">
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              {isEditMode ? "حفظ التغييرات" : "إضافة العميل"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormDialog;
