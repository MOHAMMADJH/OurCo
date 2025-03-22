import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Calendar,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import BlogService, { IPost } from "@/services/blogService";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth"; // Assuming you have an auth hook

const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-500/10 text-green-500";
    case "draft":
      return "bg-gray-500/10 text-gray-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "published":
      return "منشور";
    case "draft":
      return "مسودة";
    default:
      return status;
  }
};

const getCategoryColor = (category?: string) => {
  if (!category) return "bg-gray-500/10 text-gray-500";
  
  const lowerCategory = category.toLowerCase();
  switch (lowerCategory) {
    case "استضافة":
      return "bg-purple-500/10 text-purple-500";
    case "تسويق":
      return "bg-yellow-500/10 text-yellow-500";
    case "تطوير":
      return "bg-blue-500/10 text-blue-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [postToDelete, setPostToDelete] = useState<IPost | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, getToken } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getAllPosts();
      setPosts(response.results || response);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("حدث خطأ أثناء تحميل المقالات");
      toast({
        title: "خطأ في تحميل المقالات",
        description: "فشل في تحميل المقالات، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = () => {
    navigate("/dashboard/blog/new");
  };

  const handleEditPost = (id: string) => {
    navigate(`/dashboard/blog/edit/${id}`);
  };

  const handleViewPost = (slug: string) => {
    window.open(`/blog/${slug}`, "_blank");
  };

  const openDeleteDialog = (post: IPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeletePost = async () => {
    if (!postToDelete || !isAuthenticated) return;
    
    try {
      setDeleteLoading(true);
      const token = await getToken();
      await BlogService.deletePost(postToDelete.slug ?? '', token);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postToDelete.id));
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المقال بنجاح",
      });
    } catch (err) {
      console.error("Error deleting post:", err);
      toast({
        title: "خطأ في حذف المقال",
        description: "فشل في حذف المقال، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "غير محدد";
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: ar });
    } catch (error) {
      return dateString;
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (post.category && post.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة المدونة"
        subtitle="عرض وإدارة المقالات والمحتوى"
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="البحث في المقالات..."
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
          <Button 
            className="bg-[#FF6B00] hover:bg-[#FF8533]"
            onClick={handleAddPost}
          >
            <Plus className="mr-2 h-4 w-4" />
            إضافة مقال جديد
          </Button>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" />
          </div>
        ) : error ? (
          <div className="flex h-64 w-full flex-col items-center justify-center">
            <p className="mb-4 text-lg text-red-400">{error}</p>
            <Button onClick={fetchPosts}>إعادة المحاولة</Button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex h-64 w-full flex-col items-center justify-center">
            <p className="mb-4 text-lg text-gray-400">
              {searchTerm ? "لم يتم العثور على نتائج للبحث" : "لا توجد مقالات حالياً"}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                مسح البحث
              </Button>
            )}
            {!searchTerm && (
              <Button onClick={handleAddPost}>إضافة مقال جديد</Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className="border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
                    <img
                      src={post.featured_image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute right-2 top-2 flex flex-wrap gap-2">
                      <Badge className={getStatusColor(post.status)}>
                        {getStatusText(post.status)}
                      </Badge>
                      {post.category && (
                        <Badge className={getCategoryColor(post.category.name)}>
                          {post.category.name}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.published_at || post.created_at)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                        onClick={() => handleViewPost(post.slug)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                        onClick={() => handleEditPost(post.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => openDeleteDialog(post)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-white">
                    {post.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-400">{post.excerpt}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      الكاتب: {post.author.first_name 
                        ? `${post.author.first_name} ${post.author.last_name || ''}` 
                        : post.author.username}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Eye className="h-4 w-4" />
                      {/* Show view count if available */}
                      {post.views || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-white/10 bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>حذف المقال</DialogTitle>
            <DialogDescription className="text-gray-400">
              هل أنت متأكد من رغبتك في حذف المقال "{postToDelete?.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteLoading}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePost}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جارِ الحذف...
                </>
              ) : (
                "حذف"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BlogPage;
