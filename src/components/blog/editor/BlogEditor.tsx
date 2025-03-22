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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Define interfaces here
interface IPost {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featured_image?: string | null;
  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  published_at?: Date | string | null;
  created_at?: string;
  updated_at?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  categories?: CategoryType[];
  tags?: TagType[];
  comments_count?: number;
  views_count?: number;
  reading_time?: number;
}

interface IPostCreate {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featured_image?: File | null;
  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  published_at?: string | null;
  category_ids?: string[];
  tag_ids?: string[];
}

interface ICategory {
  id: string;
  name: string;
  slug: string;
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
  const { categories, addCategory, deleteCategory, loading } = useCategories();
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
    // Generate slug with Arabic support
    return title
      .trim()
      .toLowerCase()
      .normalize('NFKD') // Normalize Arabic characters
      .replace(/[^\p{L}\p{N}\s-]/gu, '') // Remove invalid characters
      .replace(/[\s-]+/g, '-') // Replace spaces and multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  // Handle slug update
  const handleUpdateSlug = async () => {
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

      // Use custom slug or generate from title
      const newSlug = post.slug || (post.title ? generateSlugFromTitle(post.title) : "");

      // Validate slug
      if (!newSlug || newSlug.length < 3) {
        toast({
          title: "رابط غير صالح",
          description: "الرجاء إدخال رابط صالح (3 أحرف على الأقل)",
          variant: "destructive",
        });
        return;
      }

      // Update slug via API
      const updatedPost = await BlogService.updatePostSlug(
        initialPost?.id || "",
        newSlug,
        token
      );

      // Update post state with new slug
      setPost(prev => ({ ...prev, slug: updatedPost.slug }));

      // Update URL in browser
      if (location.pathname !== `/dashboard/blog/edit/${updatedPost.slug}`) {
        navigate(`/dashboard/blog/edit/${updatedPost.slug}`, { replace: true });
      }

      toast({
        title: "تم تحديث الرابط",
        description: `تم تحديث رابط المقالة إلى: ${updatedPost.slug}`,
      });
    } catch (error) {
      console.error("Error updating slug:", error);
      handleApiError(error, toast);
    } finally {
      setIsSaving(false);
    }
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
  const handleInputChange = (name: string, value: string) => {
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
  const handleContentChange = (content: string) => {
    setPost(prev => ({ ...prev, content }));
    
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
  const handleRemoveTag = async (tagId: string): Promise<void> => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags ? prev.tags.filter(tag => tag.id !== tagId) : []
    }));
  };

  // Remove/update category from post
  const handleRemoveCategory = (categoryId: string) => {
    setPost(prev => ({
      ...prev,
      categories: prev.categories ? prev.categories.filter(category => category.id !== categoryId) : []
    }));
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find(c => c.id === categoryId);
    if (selectedCategory) {
      setPost(prev => ({ 
        ...prev, 
        categories: [...(prev.categories || []), selectedCategory] 
      }));
    }
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
      const postData: IPostCreate = {
        title: post.title || "",
        slug: post.slug || generateSlugFromTitle(post.title || ""),
        content: post.content || "",
        excerpt: post.excerpt || "",
        status: (post.status as 'draft' | 'published' | 'scheduled') || "draft",
        tag_ids: post.tags?.map(tag => tag.id) || [],
        category_ids: post.categories?.map(category => category.id) || []
      };

      // Handle scheduled publishing
      if (post.published_at) {
        postData.published_at = post.published_at instanceof Date ? 
            post.published_at.toISOString() : 
            typeof post.published_at === 'string' ? post.published_at : null;
      }

      let savedPost;
      
      if (isEditMode && initialPost?.id) {
        // Update existing post
        savedPost = await BlogService.updatePost(
          token,
          initialPost.id,
          postData
        );
        toast({
          title: "تم حفظ المقال",
          description: publishNow ? "تم نشر المقال" : "تم حفظ المقال كمسودة",
        });
      } else {
        // Create new post
        savedPost = await BlogService.createPost(
          token,
          postData
        );
        toast({
          title: "تم إنشاء المقال",
          description: publishNow ? "تم نشر المقال الجديد" : "تم حفظ المقال الجديد كمسودة",
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
  const isLoading = loading || tagsLoading;

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
            onChange={(e) => handleInputChange("excerpt", e.target.value)}
            className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
          />
        </div>

        <Label htmlFor="content" className="mb-2 block text-white">
          محتوى المقال <span className="text-red-500">*</span>
        </Label>
        <RichTextEditor 
          value={post.content || ""} 
          onChange={(content: string) => handleContentChange(content)}
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
          selectedCategory={post.categories?.[0]?.id || ""}
          onChange={(categoryId: string) => {
            const selectedCategory = categories.find(c => c.id === categoryId);
            if (selectedCategory) {
              setPost(prev => ({
                ...prev,
                categories: [selectedCategory]
              }));
            } else {
              setPost(prev => ({
                ...prev,
                categories: []
              }));
            }
          }}
          onAddCategory={async (name: string) => {
            if (addCategory) {
              await addCategory({ name, slug: "" });
            }
          }}
          onDeleteCategory={async (id: string) => {
            if (deleteCategory) {
              await deleteCategory(id);
            }
          }}
          isLoading={loading}
        />
        
        <Label className="mb-2 block text-white">التصنيفات</Label>
        <div className="mb-4 flex flex-wrap gap-2 rounded border border-white/10 bg-white/5 p-2">
          {post.categories && post.categories.length > 0 ? (
            post.categories.map(category => (
              <Badge 
                key={category.id} 
                variant="secondary" 
                className="flex items-center gap-1 px-3 py-1.5 text-sm"
              >
                {category.name}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer opacity-70 hover:opacity-100" 
                  onClick={() => handleRemoveCategory(category.id)}
                />
              </Badge>
            ))
          ) : (
            <p className="text-gray-400">لم يتم إضافة أي تصنيفات</p>
          )}
        </div>
        
        <TagSelector 
          availableTags={tags} 
          selectedTags={post.tags?.map(tag => tag.id) || []}
          onChange={(selectedTagIds: string[]) => {
            const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));
            setPost(prev => ({
              ...prev,
              tags: selectedTags
            }));
          }}
          onAddTag={async (name: string) => {
            const newTag = await addTag({ name });
            if (newTag) {
              setPost(prev => ({
                ...prev,
                tags: [...(prev.tags || []), newTag]
              }));
            }
          }}
          onDeleteTag={handleRemoveTag}
          isLoading={tagsLoading}
        />
        
        <Label className="mb-2 block text-white">الوسوم</Label>
        <div className="mb-4 flex flex-wrap gap-2 rounded border border-white/10 bg-white/5 p-2">
          {post.tags && post.tags.length > 0 ? (
            post.tags.map(tag => (
              <Badge 
                key={tag.id} 
                variant="outline" 
                className="flex items-center gap-1 px-3 py-1.5 text-sm"
              >
                {tag.name}
                <X 
                  className="ml-1 h-3 w-3 cursor-pointer opacity-70 hover:opacity-100" 
                  onClick={() => handleRemoveTag(tag.id)}
                />
              </Badge>
            ))
          ) : (
            <p className="text-gray-400">لم يتم إضافة أي وسوم</p>
          )}
        </div>
        
        <h3 className="mb-2 text-lg font-medium text-white">خيارات النشر</h3>
        
        <PostScheduler
          initialDate={post.published_at instanceof Date ? post.published_at : post.published_at ? new Date(post.published_at) : null}
          initialStatus={post.status as 'draft' | 'published' | 'scheduled' | 'archived' || 'draft'}
          onStatusChange={handleStatusChange}
          onDateSelect={handleScheduledDateChange}
        />
        
        {/* ملخص المقال */}
        <div className="mb-6">
          <Label htmlFor="excerpt" className="mb-2 block text-white">
            ملخص المقال
          </Label>
          <textarea
            id="excerpt"
            value={post.excerpt || ""}
            onChange={(e) => handleInputChange("excerpt", e.target.value)}
            placeholder="أدخل ملخصاً موجزاً للمقال..."
            className="h-32 w-full resize-none rounded border border-white/10 bg-white/5 p-3 text-white placeholder:text-gray-400"
          />
          {errors.excerpt && (
            <p className="mt-1 text-sm text-red-500">{errors.excerpt}</p>
          )}
        </div>

        {/* تحميل صورة مميزة - سيتم تنفيذها لاحقاً */}
        <div className="mb-6">
          <Label className="mb-2 block text-white">
            الصورة المميزة
          </Label>
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
