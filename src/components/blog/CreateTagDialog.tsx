import React, { useState } from "react";
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
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import BlogService from "@/services/blogService";
import { useAuth } from "@/hooks/useAuth";

interface CreateTagDialogProps {
  onTagCreated: (newTag: { id: string; name: string; slug: string }) => void;
}

const CreateTagDialog: React.FC<CreateTagDialogProps> = ({ onTagCreated }) => {
  const [open, setOpen] = useState(false);
  const [tagName, setTagName] = useState<string>('');
  const [tagSlug, setTagSlug] = useState<string | null>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tagName.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الوسم",
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

      const newTag = await BlogService.createTag({ 
        name: tagName,
        slug: tagSlug || '' 
      }, token);
      
      toast({
        title: "تم إنشاء الوسم",
        description: `تم إنشاء الوسم "${tagName}" بنجاح`,
      });
      
      onTagCreated(newTag);
      setTagName("");
      setTagSlug("");
      setOpen(false);
    } catch (error) {
      console.error("Error creating tag:", error);
      toast({
        title: "خطأ في إنشاء الوسم",
        description: "فشل في إنشاء الوسم، يرجى المحاولة مرة أخرى لاحقًا.",
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
          وسم جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-gray-900 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة وسم جديد</DialogTitle>
          <DialogDescription className="text-gray-400">
            أدخل اسم الوسم الجديد الذي ترغب في إضافته. يمكنك أيضًا تحديد رابط مخصص (slug) أو تركه فارغًا ليتم إنشاؤه تلقائيًا.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tagName" className="text-right">
                اسم الوسم
              </Label>
              <Input
                id="tagName"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                className="col-span-3 border-white/10 bg-white/5 text-white"
                placeholder="أدخل اسم الوسم"
                dir="rtl"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tagSlug" className="text-right">
                الرابط (slug)
              </Label>
              <Input
                id="tagSlug"
                value={tagSlug || ''}
                onChange={(e) => setTagSlug(e.target.value)}
                className="col-span-3 border-white/10 bg-white/5 text-white"
                placeholder="أدخل الرابط أو اتركه فارغًا لإنشائه تلقائيًا من الاسم"
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
                "إضافة الوسم"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTagDialog;
