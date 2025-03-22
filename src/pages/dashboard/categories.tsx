import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Trash2, X, Loader2 } from "lucide-react";
import BlogService, { ICategory } from "@/services/blogService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // إضافة حالة لتعديل slug
  const [slugDialogOpen, setSlugDialogOpen] = useState(false);
  const [categoryToUpdateSlug, setCategoryToUpdateSlug] = useState<ICategory | null>(null);
  const [newSlug, setNewSlug] = useState("");
  const [slugUpdateLoading, setSlugUpdateLoading] = useState(false);

  const { getToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await BlogService.getAllCategories(token);
      setCategories(response.results || response);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("حدث خطأ أثناء تحميل التصنيفات");
      toast({
        title: "خطأ في تحميل التصنيفات",
        description: "فشل في تحميل التصنيفات، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const token = await getToken();
      const response = await BlogService.createCategory({ name: newCategory.trim() }, token);
      setCategories([...categories, response]);
      setNewCategory("");
      toast({
        title: "تم إضافة التصنيف",
        description: "تم إضافة التصنيف بنجاح",
      });
    } catch (err) {
      console.error("Error creating category:", err);
      toast({
        title: "خطأ في إضافة التصنيف",
        description: "فشل في إضافة التصنيف، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (category: ICategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setDeleteLoading(true);
      const token = await getToken();
      await BlogService.deleteCategory(categoryToDelete.id, token);
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      toast({
        title: "تم حذف التصنيف",
        description: "تم حذف التصنيف بنجاح",
      });
    } catch (err) {
      console.error("Error deleting category:", err);
      toast({
        title: "خطأ في حذف التصنيف",
        description: "فشل في حذف التصنيف، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // إضافة وظيفة لفتح نافذة تعديل slug
  const openSlugDialog = (category: ICategory) => {
    setCategoryToUpdateSlug(category);
    setNewSlug(category.slug);
    setSlugDialogOpen(true);
  };

  // إضافة وظيفة لتعديل slug
  const handleUpdateSlug = async () => {
    if (!categoryToUpdateSlug || !newSlug.trim()) return;

    try {
      setSlugUpdateLoading(true);
      const token = await getToken();
      const updatedCategory = await BlogService.updateCategorySlug(
        categoryToUpdateSlug.slug, 
        newSlug.trim(), 
        token
      );
      
      // تحديث قائمة الفئات بالـ slug الجديد
      setCategories(categories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      ));
      
      setSlugDialogOpen(false);
      setCategoryToUpdateSlug(null);
      setNewSlug("");
      
      toast({
        title: "تم تحديث الرابط",
        description: `تم تحديث رابط التصنيف بنجاح إلى: ${updatedCategory.slug}`,
      });
    } catch (err) {
      console.error("Error updating category slug:", err);
      toast({
        title: "خطأ في تحديث الرابط",
        description: "فشل في تحديث رابط التصنيف، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setSlugUpdateLoading(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة التصنيفات"
        subtitle="إدارة تصنيفات المدونة"
      />

      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="البحث في التصنيفات..."
              className="border-white/10 bg-white/5 pr-10 text-right text-white placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setSearchTerm("")}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <form onSubmit={handleAddCategory} className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="اسم التصنيف الجديد"
              className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
            />
            <Button
              type="submit"
              className="bg-[#FF6B00] hover:bg-[#FF8533]"
              disabled={!newCategory.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
              </div>
            ) : error ? (
              <div className="flex h-64 items-center justify-center">
                <p className="text-xl text-red-400">{error}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right text-white">الاسم</TableHead>
                    <TableHead className="text-right text-white">الرابط</TableHead>
                    <TableHead className="text-right text-white">عدد المقالات</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="text-right font-medium text-white">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-right text-gray-400">
                        {category.slug}
                      </TableCell>
                      <TableCell className="text-right text-gray-400">
                        {category.posts_count || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-500 hover:bg-blue-500/10 hover:text-blue-500"
                            onClick={() => openSlugDialog(category)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
                            onClick={() => openDeleteDialog(category)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف التصنيف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من حذف التصنيف "{categoryToDelete?.name}"؟
              <br />
              سيتم إزالة هذا التصنيف من جميع المقالات المرتبطة به.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={deleteLoading}
            >
              {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* إضافة نافذة تعديل slug */}
      <Dialog open={slugDialogOpen} onOpenChange={setSlugDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل رابط التصنيف</DialogTitle>
            <DialogDescription>
              تعديل الرابط (Slug) للتصنيف "{categoryToUpdateSlug?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="الرابط الجديد"
              className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
              dir="ltr"
            />
            <p className="mt-2 text-xs text-gray-400">
              الرابط يجب أن يكون فريدًا ويمكن أن يحتوي على أحرف عربية
            </p>
          </div>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setSlugDialogOpen(false);
                setCategoryToUpdateSlug(null);
                setNewSlug("");
              }}
              disabled={slugUpdateLoading}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleUpdateSlug}
              disabled={slugUpdateLoading || !newSlug.trim()}
              className="bg-[#FF6B00] hover:bg-[#FF8533]"
            >
              {slugUpdateLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              تحديث الرابط
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CategoriesPage;