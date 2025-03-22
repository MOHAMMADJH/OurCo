import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import BlogService from "@/lib/blog-service";
import { handleApiError } from "@/utils/apiUtils";
import RichTextEditor from "./RichTextEditor";
import CategorySelector from "./CategorySelector";
import TagSelector from "./TagSelector";
import PostScheduler from "./PostScheduler";
import { CategoryType, TagType, useCategories, useTags } from "@/features/blog/hooks";

// Define interfaces here
interface IPost {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featured_image?: string | null;
  published_at?: Date | null;
  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  author?: string;
  author_id?: string;
  tags: TagType[];
  categories: CategoryType[];
  reading_time?: number;
}

interface IPostCreate {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string | null;
  published_at?: Date | null;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  author_id: string;
  tag_ids: string[];
  category_ids: string[];
}

// BlogEditor props
interface BlogEditorProps {
  initialPost?: Partial<IPost>;
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
  const { toast } = useToast();
  const { user, getToken } = useAuth();
  const { categories, addCategory, deleteCategory, loading: categoriesLoading } = useCategories();
  const { tags, addTag, deleteTag, loading: tagsLoading } = useTags();
  
  // Initialize post state
  const [post, setPost] = useState<Partial<IPost>>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image: null,
    status: "draft",
    tags: [],
    categories: []
  });

  // Function to generate a slug from a title with Arabic support
  const generateSlugFromTitle = (title: string): string => {
    if (!title) return "";
    // توليد slug يدعم اللغة العربية
    return title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0621-\u064A\-]+/g, "") // دعم الأحرف العربية
      .replace(/\-\-+/g, "-");
  };

  // Generate slug from title
  const handleGenerateSlug = () => {
    if (!post.title) return;
    
    const slug = generateSlugFromTitle(post.title);
    
    setPost(prev => ({ ...prev, slug }));
  };

  // Additional state for UI
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Remove/update tags from post
  const handleRemoveTag = (tagId: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag.id !== tagId) || []
    }));
  };

  // Remove/update category from post
  const handleRemoveCategory = (categoryId: string) => {
    setPost(prev => ({
      ...prev,
      categories: prev.categories?.filter(category => category.id !== categoryId) || []
    }));
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(c => c.id === categoryId);
    setPost(prev => ({ ...prev, categories: [...(prev.categories || []), selectedCategory] }));
  };

  // Handle tags selection
  const handleTagsChange = (tagIds: string[]) => {
    setPost(prev => ({ ...prev, tags: tags.filter(tag => tagIds.includes(tag.id)) }));
  };

  // Handle status change
  const handleStatusChange = (newStatus: 'draft' | 'published' | 'scheduled' | 'archived') => {
    setPost(prev => ({
      ...prev,
      status: newStatus
    }));
  };

  // Handle date change from PostScheduler
  const handleScheduledDateChange = (date: Date | null) => {
    setPost(prev => ({
      ...prev,
      published_at: date
    }));
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
        title: post.title!,
        slug: post.slug || generateSlugFromTitle(post.title!),
        content: post.content!,
        excerpt: post.excerpt || "",
        status: publishNow ? "published" : "draft",
        tag_ids: post.tags?.map(tag => tag.id) || [],
        category_ids: post.categories?.map(category => category.id) || []
      };

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
                handleGenerateSlug();
              }
            }}
            className="mb-4 border-white/10 bg-white/5 text-right text-2xl text-white placeholder:text-gray-400"
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
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerateSlug}
              className="whitespace-nowrap border-white/10 text-white hover:bg-white/10"
            >
              إنشاء تلقائي
            </Button>
            {isEditMode && (
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
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
                    const newSlug = post.slug || (post.title ? generateSlugFromTitle(post.title) : "");
                    
                    // تحديث slug عبر API
                    const updatedPost = await BlogService.updatePostSlug(
                      initialPost?.slug || "", 
                      newSlug, 
                      token
                    );
                    
                    // تحديث حالة المقالة بـ slug الجديد
                    setPost(prev => ({ ...prev, slug: updatedPost.slug }));
                    
                    // تحديث الرابط في المتصفح
                    if (location.pathname !== `/dashboard/blog/edit/${updatedPost.slug}`) {
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
                }}
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
          onChange={(content) => handleContentChange(content)}
          className="min-h-[300px] rounded border border-white/10 bg-white/5 p-4 text-white/90"
          placeholder="اكتب محتوى المقال هنا..."
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
          selectedCategories={post.categories || []} 
          onSelectCategory={(category: CategoryType) => {
            const exists = post.categories?.some(c => c.id === category.id) || false;
            if (!exists) {
              setPost(prev => ({
                ...prev,
                categories: [...(prev.categories || []), category]
              }));
            }
          }}
          onRemoveCategory={handleRemoveCategory}
          onCreateCategory={addCategory}
        />
        
        <TagSelector 
          tags={tags}
          selectedTags={post.tags || []}
          onSelectTag={(tag: TagType) => {
            const exists = post.tags?.some(t => t.id === tag.id) || false;
            if (!exists) {
              setPost(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tag]
              }));
            }
          }}
          onRemoveTag={handleRemoveTag}
          onCreateTag={addTag}
        />
        
        <PostScheduler
          initialDate={post.published_at}
          status={post.status as 'draft' | 'published' | 'scheduled'}
          onStatusChange={handleStatusChange}
          onDateChange={handleScheduledDateChange}
        />
        
        {/* ملخص المقال */}
        <div className="mb-6">
          <label htmlFor="excerpt" className="mb-2 block text-white">
            ملخص المقال
          </label>
          <textarea
            id="excerpt"
            value={post.excerpt || ""}
            onChange={(e) => handleChange(e)}
            placeholder="أدخل ملخصاً موجزاً للمقال..."
            className="h-32 w-full resize-none rounded border border-white/10 bg-white/5 p-3 text-white placeholder:text-gray-400"
          />
          {errors.excerpt && (
            <p className="mt-1 text-sm text-red-500">{errors.excerpt}</p>
          )}
        </div>

        {/* تحميل صورة مميزة - سيتم تنفيذها لاحقاً */}
        <div className="mb-6">
          <label className="mb-2 block text-white">
            الصورة المميزة
          </label>
          <div className="flex h-32 w-full items-center justify-center rounded border border-dashed border-white/10 bg-white/5 p-3">
            <p className="text-center text-gray-400">
              {post.featured_image ? "تم تحميل الصورة" : "ميزة تحميل الصورة قيد التطوير..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
