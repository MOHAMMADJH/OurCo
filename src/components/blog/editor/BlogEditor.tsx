import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import BlogService, { IPost, IPostCreate } from "@/services/blogService";
import { handleApiError } from "@/utils/apiUtils";
import RichTextEditor from "./RichTextEditor";
import CategorySelector from "./CategorySelector";
import TagSelector from "./TagSelector";
import PostScheduler from "./PostScheduler";
import { PostStatus } from "../common/PostStatusBadge";
import { useCategories, useTags } from "@/features/blog/hooks";

interface BlogEditorProps {
  /**
   * Initial post data (for editing mode)
   */
  initialPost?: IPost;
  /**
   * Whether the editor is in edit mode or create mode
   * @default false
   */
  isEditMode?: boolean;
}

/**
 * Unified blog post editor component for both creating and editing posts
 */
const BlogEditor: React.FC<BlogEditorProps> = ({ 
  initialPost, 
  isEditMode = false 
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const { toast } = useToast();
  const { getToken } = useAuth();
  
  // Fetch categories and tags using custom hooks
  const { 
    categories, 
    loading: categoriesLoading, 
    isCategoryLoading,
    addCategory,
    deleteCategory
  } = useCategories();
  
  const { 
    tags, 
    loading: tagsLoading, 
    isTagLoading,
    addTag,
    deleteTag
  } = useTags();

  // Post form state
  const [post, setPost] = useState<Partial<IPost>>({
    title: "",
    content: "",
    slug: "",
    status: "draft",
    excerpt: "",
    featured_image: undefined,
    category: undefined,
    tags: [],
    ...(initialPost || {})
  });

  // Generate slug from title
  const generateSlug = () => {
    if (!post.title) return;
    
    const slug = post.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
      
    setPost(prev => ({ ...prev, slug }));
    
    // Clear error for slug if any
    if (errors.slug) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.slug;
        return newErrors;
      });
    }
  };

  // Additional state for UI
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if any
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle content changes from rich text editor
  const handleContentChange = (value: string) => {
    setPost(prev => ({ ...prev, content: value }));
    
    // Clear error for content if any
    if (errors.content) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.content;
        return newErrors;
      });
    }
  };

  // تحديث slug المقالة
  const handleUpdateSlug = async () => {
    if (!isEditMode || !post.slug) return;
    
    try {
      const token = await getToken();
      if (!token) {
        toast({
          title: "خطأ في المصادقة",
          description: "يرجى تسجيل الدخول مرة أخرى",
          variant: "destructive",
        });
        return;
      }

      setIsSaving(true);
      
      // استخدام slug مخصص أو توليد من العنوان
      const newSlug = post.slug || (post.title ? post.title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-") : "");
      
      // تحديث slug عبر API
      const updatedPost = await BlogService.updatePostSlug(
        initialPost?.slug || "", 
        newSlug, 
        token
      );
      
      // تحديث حالة المقالة بـ slug الجديد
      setPost(prev => ({ ...prev, slug: updatedPost.slug }));
      
      // تحديث الرابط في المتصفح
      if (params.slug !== updatedPost.slug) {
        navigate(`/dashboard/blog/edit/${updatedPost.slug}`, { replace: true });
      }
      
      toast({
        title: "تم تحديث الرابط",
        description: `تم تحديث رابط المقالة إلى: ${updatedPost.slug}`,
      });
    } catch (error) {
      console.error("Error updating slug:", error);
      handleApiError(error, "فشل في تحديث رابط المقالة");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(c => c.id === categoryId);
    setPost(prev => ({ ...prev, category: selectedCategory }));
  };

  // Handle tags selection
  const handleTagsChange = (tagIds: string[]) => {
    setPost(prev => ({ ...prev, tags: tags.filter(tag => tagIds.includes(tag.id)) }));
  };

  // Handle status change
  const handleStatusChange = (status: PostStatus) => {
    setPost(prev => ({
      ...prev,
      status: status === "scheduled" ? "draft" : status
    }));
  };

  // Handle scheduled date change
  const handleScheduledDateChange = (date?: Date) => {
    setPost(prev => ({ ...prev, published_at: date ? date.toISOString() : undefined }));
  };

  // Validate the form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!post.title?.trim()) {
      newErrors.title = "يرجى إدخال عنوان المقال";
    }
    
    if (!post.content?.trim()) {
      newErrors.content = "يرجى إدخال محتوى المقال";
    }

    if (!post.slug?.trim()) {
      newErrors.slug = "يرجى إدخال الرابط (Slug)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async (publishNow = false) => {
    try {
      setIsSaving(true);
      setErrors({});

      // Basic validation
      const newErrors: Record<string, string> = {};
      if (!post.title?.trim()) {
        newErrors.title = "يرجى إدخال عنوان المقال";
      }
      if (!post.content?.trim()) {
        newErrors.content = "يرجى إدخال محتوى المقال";
      }
      if (!post.slug?.trim()) {
        newErrors.slug = "يرجى إدخال الرابط (Slug)";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast({
          title: "يرجى تصحيح الأخطاء",
          description: "هناك بعض الحقول المطلوبة غير مكتملة",
          variant: "destructive",
        });
        return;
      }

      const token = await getToken();
      if (!token) {
        toast({
          title: "خطأ في المصادقة",
          description: "يرجى تسجيل الدخول مرة أخرى",
          variant: "destructive",
        });
        return;
      }

      // Prepare post data for API
      const postData: Partial<IPostCreate> = {
        title: post.title,
        content: post.content || "",
        excerpt: post.excerpt,
        slug: post.slug,
        status: publishNow ? "published" : "draft",
      };

      // Handle category
      if (post.category?.id) {
        postData.category_id = post.category.id;
      }

      // Handle tags
      if (post.tags && post.tags.length > 0) {
        postData.tag_ids = post.tags.map(tag => tag.id);
      }

      // Handle scheduled publishing
      if (post.published_at) {
        postData.published_at = new Date(post.published_at).toISOString();
      }

      let savedPost;
      
      if (isEditMode && post.slug) {
        // Update existing post
        savedPost = await BlogService.updatePost(post.slug, postData, token);
        toast({
          title: "تم حفظ المقال",
          description: publishNow ? "تم نشر المقال بنجاح" : "تم حفظ المقال كمسودة",
        });
      } else {
        // Create new post
        savedPost = await BlogService.createPost({
          ...postData,
          content: postData.content || "",
          featured_image: null,
        } as IPostCreate, token);
        toast({
          title: "تم إنشاء المقال",
          description: publishNow ? "تم نشر المقال الجديد بنجاح" : "تم حفظ المقال الجديد كمسودة",
        });
      }

      // Redirect to edit page if we were on the create page
      if (!isEditMode && savedPost?.slug) {
        navigate(`/dashboard/blog/edit/${savedPost.slug}`);
      }
    } catch (error) {
      console.error("Error saving post:", error);
      handleApiError(error, "فشل في حفظ المقال");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate loading state
  const isLoading = categoriesLoading || tagsLoading;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
      {/* Main Content */}
      <div className="space-y-6">
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <Input
            placeholder="عنوان المقال"
            value={post.title || ""}
            onChange={(e) => {
              setPost({ ...post, title: e.target.value });
              // Clear error for title if any
              if (errors.title) {
                setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.title;
                  return newErrors;
                });
              }
            }}
            onBlur={() => {
              if (post.title && !post.slug) {
                generateSlug();
              }
            }}
            className="mb-4 border-white/10 bg-white/5 text-right text-2xl text-white placeholder:text-gray-400"
            error={errors.title}
          />
          <div className="mb-4 flex gap-2">
            <Input
              placeholder="الرابط (Slug)"
              name="slug"
              value={post.slug || ""}
              onChange={(e) => {
                setPost({ ...post, slug: e.target.value });
                // Clear error for slug if any
                if (errors.slug) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.slug;
                    return newErrors;
                  });
                }
              }}
              className="flex-1 border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
              error={errors.slug}
            />
            <Button
              type="button"
              variant="outline"
              onClick={generateSlug}
              className="whitespace-nowrap border-white/10 text-white hover:bg-white/10"
            >
              إنشاء تلقائي
            </Button>
            {isEditMode && (
              <Button
                type="button"
                variant="outline"
                onClick={handleUpdateSlug}
                disabled={isSaving}
                className="whitespace-nowrap border-white/10 text-white hover:bg-white/10"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  "تحديث الرابط"
                )}
              </Button>
            )}
          </div>
          <Input
            placeholder="وصف مختصر للمقال"
            value={post.excerpt || ""}
            onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
            className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
          />
        </div>

        <RichTextEditor 
          value={post.content || ""} 
          onChange={(content) => setPost({ ...post, content })}
          error={errors.content}
        />

        <div className="flex gap-4">
          <Button 
            className="flex-1 bg-[#FF6B00] hover:bg-[#FF8533]"
            onClick={() => handleSave(true)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "نشر المقال"
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-white/10 text-white hover:bg-white/10"
            onClick={() => handleSave(false)}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            حفظ كمسودة
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <CategorySelector
          categories={categories}
          selectedCategory={post.category?.id || ""}
          onChange={(categoryId) => {
            const selectedCategory = categories.find(c => c.id === categoryId);
            setPost({ ...post, category: selectedCategory });
          }}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          isLoading={categoriesLoading || isCategoryLoading}
        />
        
        <TagSelector
          availableTags={tags}
          selectedTags={post.tags?.map(tag => tag.id) || []}
          onChange={(selectedTagIds) => {
            const selectedTags = selectedTagIds.map(id => tags.find(t => t.id === id)).filter(Boolean) as any[];
            setPost({ ...post, tags: selectedTags });
          }}
          onAddTag={addTag}
          onDeleteTag={deleteTag}
          isLoading={tagsLoading || isTagLoading}
        />
        
        <PostScheduler
          selectedDate={post.published_at ? new Date(post.published_at) : undefined}
          onDateSelect={(date) => setPost({ ...post, published_at: date?.toISOString() })}
          status={post.status as PostStatus}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default BlogEditor;
