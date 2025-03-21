import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Trash2, X, Loader2 } from "lucide-react";
import BlogService, { ITag } from "@/services/blogService";
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

const TagsPage = () => {
  const [tags, setTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTag, setNewTag] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<ITag | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // إضافة حالة لتعديل slug
  const [slugDialogOpen, setSlugDialogOpen] = useState(false);
  const [tagToUpdateSlug, setTagToUpdateSlug] = useState<ITag | null>(null);
  const [newSlug, setNewSlug] = useState("");
  const [slugUpdateLoading, setSlugUpdateLoading] = useState(false);

  const { getToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await BlogService.getAllTags(token);
      setTags(response.results || response);
      setError(null);
    } catch (err) {
      console.error("Error fetching tags:", err);
      setError("حدث خطأ أثناء تحميل الوسوم");
      toast({
        title: "خطأ في تحميل الوسوم",
        description: "فشل في تحميل الوسوم، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    try {
      const token = await getToken();
      const response = await BlogService.createTag({ name: newTag.trim() }, token);
      setTags([...tags, response]);
      setNewTag("");
      toast({
        title: "تم إضافة الوسم",
        description: "تم إضافة الوسم بنجاح",
      });
    } catch (err) {
      console.error("Error creating tag:", err);
      toast({
        title: "خطأ في إضافة الوسم",
        description: "فشل في إضافة الوسم، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (tag: ITag) => {
    setTagToDelete(tag);
    setDeleteDialogOpen(true);
  };

  const handleDeleteTag = async () => {
    if (!tagToDelete) return;

    try {
      setDeleteLoading(true);
      const token = await getToken();
      await BlogService.deleteTag(tagToDelete.id, token);
      setTags(tags.filter((tag) => tag.id !== tagToDelete.id));
      setDeleteDialogOpen(false);
      setTagToDelete(null);
      toast({
        title: "تم حذف الوسم",
        description: "تم حذف الوسم بنجاح",
      });
    } catch (err) {
      console.error("Error deleting tag:", err);
      toast({
        title: "خطأ في حذف الوسم",
        description: "فشل في حذف الوسم، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // إضافة وظيفة لفتح نافذة تعديل slug
  const openSlugDialog = (tag: ITag) => {
    setTagToUpdateSlug(tag);
    setNewSlug(tag.slug);
    setSlugDialogOpen(true);
  };

  // إضافة وظيفة لتعديل slug
  const handleUpdateSlug = async () => {
    if (!tagToUpdateSlug || !newSlug.trim()) return;

    try {
      setSlugUpdateLoading(true);
      const token = await getToken();
      const updatedTag = await BlogService.updateTagSlug(
        tagToUpdateSlug.slug, 
        newSlug.trim(), 
        token
      );
      
      // تحديث قائمة الوسوم بالـ slug الجديد
      setTags(tags.map(tag => 
        tag.id === updatedTag.id ? updatedTag : tag
      ));
      
      setSlugDialogOpen(false);
      setTagToUpdateSlug(null);
      setNewSlug("");
      
      toast({
        title: "تم تحديث الرابط",
        description: `تم تحديث رابط الوسم بنجاح إلى: ${updatedTag.slug}`,
      });
    } catch (err) {
      console.error("Error updating tag slug:", err);
      toast({
        title: "خطأ في تحديث الرابط",
        description: "فشل في تحديث رابط الوسم، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setSlugUpdateLoading(false);
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة الوسوم"
        subtitle="إدارة وسوم المدونة"
      />

      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="البحث في الوسوم..."
              className="border-white/10 bg-white/5 pr-10 text-right text-white placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setSearchTerm("")}
            />
          </div>

          <form onSubmit={handleAddTag} className="flex gap-2">
            <Input
              placeholder="اسم الوسم الجديد"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
            />
            <Button type="submit" disabled={!newTag.trim()}>
              <Plus className="h-4 w-4" />
              إضافة
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-right text-white">الوسم</TableHead>
                    <TableHead className="text-right text-white">الرابط</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTags.map((tag) => (
                    <TableRow
                      key={tag.id}
                      className="border-white/10 hover:bg-white/5"
                    >
                      <TableCell className="font-medium text-white">
                        {tag.name}
                      </TableCell>
                      <TableCell className="text-gray-400">{tag.slug}</TableCell>
                      <TableCell className="text-left">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openSlugDialog(tag)}
                            className="h-8 w-8 text-blue-400 hover:text-blue-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(tag)}
                            className="h-8 w-8 text-red-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-white/10 bg-gray-950 text-white">
          <DialogHeader>
            <DialogTitle>حذف الوسم</DialogTitle>
            <DialogDescription className="text-gray-400">
              هل أنت متأكد من حذف الوسم "{tagToDelete?.name}"؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-white/10 hover:bg-white/5"
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTag}
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
        <DialogContent className="border-white/10 bg-gray-950 text-white">
          <DialogHeader>
            <DialogTitle>تعديل رابط الوسم</DialogTitle>
            <DialogDescription className="text-gray-400">
              تعديل الرابط (Slug) للوسم "{tagToUpdateSlug?.name}"
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
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => {
                setSlugDialogOpen(false);
                setTagToUpdateSlug(null);
                setNewSlug("");
              }}
              disabled={slugUpdateLoading}
              className="border-white/10 hover:bg-white/5"
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

export default TagsPage;