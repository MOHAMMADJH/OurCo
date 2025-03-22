import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  X,
  Calendar,
} from "lucide-react";
import BlogService, { IComment } from "@/services/blogService";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
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

const CommentsPage: React.FC = () => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [commentToDelete, setCommentToDelete] = useState<IComment | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  
  const { isAuthenticated, getToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        setError("يجب تسجيل الدخول للوصول إلى هذه الصفحة");
        return;
      }
      
      const response = await BlogService.getAllComments(token);
      setComments(response.results || response);
      setError(null);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("حدث خطأ أثناء تحميل التعليقات");
      toast({
        title: "خطأ في تحميل التعليقات",
        description: "فشل في تحميل التعليقات، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      setActionLoading(commentId);
      const token = await getToken();
      await BlogService.approveComment(commentId ?? '', token ?? '');
      
      // Update comment in state
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId ? { ...comment, is_approved: true } : comment
        )
      );
      
      toast({
        title: "تم قبول التعليق",
        description: "تم قبول التعليق بنجاح",
      });
    } catch (err) {
      console.error("Error approving comment:", err);
      toast({
        title: "خطأ في قبول التعليق",
        description: "فشل في قبول التعليق، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectComment = async (commentId: string) => {
    try {
      setActionLoading(commentId);
      const token = await getToken();
      await BlogService.rejectComment(commentId ?? '', token ?? '');
      
      // Update comment in state
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId ? { ...comment, is_approved: false } : comment
        )
      );
      
      toast({
        title: "تم رفض التعليق",
        description: "تم رفض التعليق بنجاح",
      });
    } catch (err) {
      console.error("Error rejecting comment:", err);
      toast({
        title: "خطأ في رفض التعليق",
        description: "فشل في رفض التعليق، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openDeleteDialog = (comment: IComment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    try {
      setDeleteLoading(true);
      const token = await getToken();
      await BlogService.deleteComment(commentToDelete.id ?? '', token ?? '');
      
      // Remove comment from state
      setComments(prevComments => 
        prevComments.filter(comment => comment.id !== commentToDelete.id)
      );
      
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      
      toast({
        title: "تم حذف التعليق",
        description: "تم حذف التعليق بنجاح",
      });
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast({
        title: "خطأ في حذف التعليق",
        description: "فشل في حذف التعليق، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: ar });
    } catch (error) {
      return dateString;
    }
  };

  const filteredComments = comments.filter(
    (comment) =>
      comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة التعليقات"
        subtitle="عرض ومراجعة وإدارة تعليقات المدونة"
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="البحث في التعليقات..."
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
            onClick={fetchComments} 
            variant="outline"
            className="mr-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "تحديث"
            )}
          </Button>
        </div>

        {/* Comments Table */}
        {loading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" />
          </div>
        ) : error ? (
          <div className="flex h-64 w-full flex-col items-center justify-center">
            <p className="mb-4 text-lg text-red-400">{error}</p>
            <Button onClick={fetchComments}>إعادة المحاولة</Button>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="flex h-64 w-full flex-col items-center justify-center">
            <p className="mb-4 text-lg text-gray-400">
              {searchTerm ? "لم يتم العثور على نتائج للبحث" : "لا توجد تعليقات حالياً"}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                مسح البحث
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border border-white/10 bg-white/5">
            <Table dir="rtl">
              <TableHeader>
                <TableRow className="hover:bg-white/5">
                  <TableHead className="text-right text-white">الاسم</TableHead>
                  <TableHead className="text-right text-white">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right text-white">التعليق</TableHead>
                  <TableHead className="text-right text-white">التاريخ</TableHead>
                  <TableHead className="text-right text-white">الحالة</TableHead>
                  <TableHead className="text-right text-white">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComments.map((comment) => (
                  <TableRow key={comment.id} className="hover:bg-white/5">
                    <TableCell className="font-medium text-white">
                      {comment.name}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <a href={`mailto:${comment.email}`} className="hover:underline">
                        {comment.email}
                      </a>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-300">
                      {comment.content}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-gray-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(comment.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          comment.is_approved
                            ? "bg-green-500/10 text-green-500"
                            : "bg-gray-500/10 text-gray-500"
                        }
                      >
                        {comment.is_approved ? "مقبول" : "قيد المراجعة"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!comment.is_approved && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-500 hover:bg-green-500/10 hover:text-green-400"
                            onClick={() => handleApproveComment(comment.id)}
                            disabled={actionLoading === comment.id}
                          >
                            {actionLoading === comment.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        {comment.is_approved && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
                            onClick={() => handleRejectComment(comment.id)}
                            disabled={actionLoading === comment.id}
                          >
                            {actionLoading === comment.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-500/10 hover:text-red-400"
                          onClick={() => openDeleteDialog(comment)}
                          disabled={actionLoading === comment.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-white/10 bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>حذف التعليق</DialogTitle>
            <DialogDescription className="text-gray-400">
              هل أنت متأكد من رغبتك في حذف هذا التعليق؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          {commentToDelete && (
            <div className="mt-4 rounded-md border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-white">{commentToDelete.name}</span>
                <span className="text-sm text-gray-400">{formatDate(commentToDelete.created_at)}</span>
              </div>
              <p className="text-gray-300">{commentToDelete.content}</p>
            </div>
          )}
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
              onClick={handleDeleteComment}
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

export default CommentsPage;
