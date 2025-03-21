import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import BlogService from "@/services/blogService";
import { useAuth } from "@/hooks/useAuth";

interface CreateCategoryDialogProps {
  onCategoryCreated: (newCategory: { id: string; name: string; slug: string; description?: string }) => void;
}

const CreateCategoryDialog: React.FC<CreateCategoryDialogProps> = ({ onCategoryCreated }) => {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryDescription, setCategoryDescription] = useState<string>('');
  const [categorySlug, setCategorySlug] = useState<string | null>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم التصنيف",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        toast({
          title: "خطأ في المصادقة",
          description: "يرجى تسجيل الدخول مرة أخرى",
          variant: "destructive",
        });
        return;
      }

      const newCategory = await BlogService.createCategory({
        name: categoryName,
        description: categoryDescription || undefined,
        slug: categorySlug || '' 
      }, token);
      
      toast({
        title: "تم إنشاء التصنيف",
        description: `تم إنشاء التصنيف "${categoryName}" بنجاح`,
      });
      
      onCategoryCreated(newCategory);
      setCategoryName("");
      setCategoryDescription("");
      setCategorySlug("");
      setOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "خطأ في إنشاء التصنيف",
        description: "فشل في إنشاء التصنيف، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="mt-1 border-dashed border-white/20 bg-white/5 text-white hover:bg-white/10"
        >
          <Plus className="ml-1 h-4 w-4" />
          تصنيف جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-gray-900 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة تصنيف جديد</DialogTitle>
          <DialogDescription className="text-gray-400">
            أدخل اسم ووصف التصنيف الجديد الذي ترغب في إضافته.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                اسم التصنيف
              </Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="col-span-3 border-white/10 bg-white/5 text-white"
                placeholder="أدخل اسم التصنيف"
                dir="rtl"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categorySlug" className="text-right">
                الرابط (اختياري)
              </Label>
              <Input
                id="categorySlug"
                value={categorySlug || ''}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="col-span-3 border-white/10 bg-white/5 text-white"
                placeholder="أدخل الرابط أو اتركه فارغًا لاستخدام الاسم"
                dir="rtl"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="categoryDescription" className="text-right">
                الوصف
              </Label>
              <Textarea
                id="categoryDescription"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="col-span-3 border-white/10 bg-white/5 text-white"
                placeholder="أدخل وصف التصنيف (اختياري)"
                rows={3}
                dir="rtl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90"
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                "إضافة التصنيف"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
