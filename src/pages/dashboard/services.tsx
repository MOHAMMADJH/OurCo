import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { servicesService, type Service } from "@/lib/services-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Checkbox } from "@/components/ui/checkbox";

const DashboardServicesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    description: string;
    short_description: string;
    icon: string;
    is_featured: boolean;
  }>({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    icon: "",
    is_featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("DashboardServicesPage rendered");
    console.log("User:", user);
    console.log("Is admin from is_admin:", user?.is_admin);
    console.log("Is admin from role:", user?.role === "admin");
    const isAdmin = user?.is_admin || user?.role === "admin";
    console.log("Combined isAdmin:", isAdmin);

    // فحص القيم التي قد تتسبب في إعادة التوجيه
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    console.log("Stored user:", storedUser);
    console.log("Stored user is_admin:", storedUser?.is_admin);
    console.log("Stored user role:", storedUser?.role);
    
    return () => {
      console.log("DashboardServicesPage unmounted");
    };
  }, [user]);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      try {
        const response = await servicesService.getServices();
        setServices(response || []);
      } catch (serviceError) {
        console.error("Error from service:", serviceError);
        setServices([]);
        toast({
          title: "تنبيه",
          description: "لا توجد خدمات متاحة حالياً",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "خطأ",
        description: "فشل في جلب الخدمات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      setIsSubmitting(true);
      await servicesService.deleteService(selectedService.slug);
      setServices((prev) => prev.filter((s) => s.id !== selectedService.id));
      toast({
        title: "تم الحذف",
        description: "تم حذف الخدمة بنجاح",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "خطأ",
        description: "فشل في حذف الخدمة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async () => {
    try {
      setIsSubmitting(true);
      const newService = await servicesService.createService({
        ...formData,
      });
      setServices((prev) => [...prev, newService]);
      toast({
        title: "تمت الإضافة",
        description: "تم إضافة الخدمة بنجاح",
      });
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error("Error creating service:", error);
      toast({
        title: "خطأ",
        description: "فشل في إضافة الخدمة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedService) return;

    try {
      setIsSubmitting(true);
      const updatedService = await servicesService.updateService(selectedService.slug, {
        ...formData,
      });
      setServices((prev) =>
        prev.map((s) => (s.id === updatedService.id ? updatedService : s))
      );
      toast({
        title: "تم التحديث",
        description: "تم تحديث الخدمة بنجاح",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الخدمة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description,
      short_description: service.short_description || "",
      icon: service.icon || "",
      is_featured: service.is_featured,
    });
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_featured: checked }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      short_description: "",
      icon: "",
      is_featured: false,
    });
  };

  const handleCreateDialogOpen = () => {
    resetForm();
    setIsCreating(true);
  };

  const generateSlug = () => {
    const slug = formData.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
    setFormData((prev) => ({ ...prev, slug }));
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة الخدمات"
        subtitle="إضافة وتعديل الخدمات المقدمة"
      />

      <div className="p-6">
        <div className="mb-6 flex justify-between">
          <div className="flex gap-2">
            <Button
              id="create-service-btn"
              className="bg-[#FF6B00] hover:bg-[#FF8533]"
              onClick={handleCreateDialogOpen}
            >
              <Plus className="mr-2 h-4 w-4" />
              إضافة خدمة جديدة
            </Button>
            <Button
              id="seed-services-btn"
              variant="outline"
              className="border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white"
              onClick={async () => {
                try {
                  await servicesService.seedDefaultServices();
                  toast({
                    title: "تم بنجاح",
                    description: "تم إضافة الخدمات الافتراضية بنجاح",
                  });
                  fetchServices();
                } catch (error) {
                  console.error("Error seeding services:", error);
                  toast({
                    title: "خطأ",
                    description: "فشل في إضافة الخدمات الافتراضية",
                    variant: "destructive",
                  });
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              إضافة الخدمات الافتراضية
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.length === 0 ? (
              <div className="col-span-full py-8 text-center text-gray-400">
                لا توجد خدمات متاحة، يمكنك إضافة خدمة جديدة
              </div>
            ) : (
              services.map((service) => (
                <Card
                  key={service.id}
                  className="border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-4xl">{service.icon || "🔧"}</span>
                      <div className="flex gap-2">
                        <Button
                          id="edit-service-btn"
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white"
                          onClick={() => handleEdit(service)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          id="delete-service-btn"
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => {
                            setSelectedService(service);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="mb-2 text-xl font-bold text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-400">{service.short_description || service.description.substring(0, 100) + '...'}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {service.is_featured && (
                        <span className="inline-block rounded-full bg-[#FF6B00]/20 px-2 py-1 text-xs text-[#FF6B00]">
                          مميز
                        </span>
                      )}
                      {service.category && (
                        <span className="inline-block rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-500">
                          {service.category.name}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Service Dialog */}
      <Dialog open={isCreating || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false);
          setIsEditDialogOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isCreating ? "إضافة خدمة جديدة" : "تعديل الخدمة"}</DialogTitle>
            <DialogDescription>
              {isCreating
                ? "أدخل تفاصيل الخدمة الجديدة"
                : "قم بتعديل تفاصيل الخدمة"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الخدمة</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={formData.slug === "" ? generateSlug : undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">الرابط (Slug)</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <Button
                  id="generate-slug-btn"
                  type="button"
                  variant="outline"
                  onClick={generateSlug}
                  className="whitespace-nowrap"
                >
                  إنشاء تلقائي
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">أيقونة (رمز إيموجي)</Label>
              <Input
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                placeholder="مثال: 💻 🎨 📱"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="short_description">وصف مختصر</Label>
              <Textarea
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">الوصف الكامل</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_featured" className="mr-2">خدمة مميزة؟</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              id="dialog-cancel-btn"
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setIsEditDialogOpen(false);
              }}
            >
              إلغاء
            </Button>
            <Button
              id="dialog-submit-btn"
              onClick={isCreating ? handleCreate : handleUpdate}
              disabled={isSubmitting}
              className="bg-[#FF6B00] hover:bg-[#FF8533]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : isCreating ? (
                "إضافة"
              ) : (
                "تحديث"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذه الخدمة؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              id="delete-cancel-btn"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              id="delete-confirm-btn"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "تأكيد الحذف"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DashboardServicesPage;
