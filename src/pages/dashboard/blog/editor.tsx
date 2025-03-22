import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, ChevronLeft, Image, FileText, Tag, Bookmark } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BlogService, { ICategory, ITag, IPostCreate, IPost } from "@/services/blogService";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import QuillEditor from "@/components/blog/QuillEditor";
import { MultiSelectWithCreate } from "@/components/ui/multi-select-with-create";
import CreateCategoryDialog from "@/components/blog/CreateCategoryDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Define the form schema
const postSchema = z.object({
  title: z.string().min(3, { message: "العنوان يجب أن يكون على الأقل 3 أحرف" }),
  content: z.string().min(10, { message: "المحتوى يجب أن يكون على الأقل 10 أحرف" }),
  excerpt: z.string().optional(),
  category_id: z.string().optional().nullable(),
  tag_ids: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]),
  featured_image: z.any().optional(),
  slug: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, getToken } = useAuth();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(isEditing);
  const [activeTab, setActiveTab] = useState<string>("content");

  // Initialize form
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category_id: null,
      tag_ids: [],
      status: "draft",
      featured_image: null,
      slug: "",
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          BlogService.getAllCategories(),
          BlogService.getAllTags(),
        ]);
        setCategories(categoriesData.results || categoriesData);
        setTags(tagsData.results || tagsData);
      } catch (error) {
        console.error("Error fetching categories and tags:", error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "فشل في تحميل الفئات والوسوم، يرجى المحاولة مرة أخرى لاحقًا.",
          variant: "destructive",
        });
      }
    };

    const fetchPost = async () => {
      if (!isEditing) {
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);
        const post = await BlogService.getPostById(id);
        
        // Set form values
        form.reset({
          title: post.title,
          content: post.content || "",
          excerpt: post.excerpt || "",
          category_id: post.category?.id || null,
          tag_ids: post.tags?.map(tag => tag.id) || [],
          status: post.status,
          slug: post.slug || "",
        });

        // Set image preview if there's a featured image
        if (post.featured_image) {
          setImagePreview(post.featured_image);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "خطأ في تحميل المقال",
          description: "فشل في تحميل المقال، يرجى المحاولة مرة أخرى لاحقًا.",
          variant: "destructive",
        });
        navigate("/dashboard/blog", { replace: true });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategoriesAndTags();
    fetchPost();
  }, [isEditing, id, isAuthenticated, navigate, toast, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    form.setValue("featured_image", file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryCreated = (newCategory: { id: string; name: string; slug: string; description?: string }) => {
    // Convert to ICategory by adding the required created_at property
    const categoryWithCreatedAt: ICategory = {
      ...newCategory,
      created_at: new Date().toISOString()
    };
    setCategories(prev => [...prev, categoryWithCreatedAt]);
    form.setValue("category_id", newCategory.id);
  };

  const handleTagsChange = (newTags: { value: string; label: string }[]) => {
    setTags(prev => [
      ...prev,
      ...newTags
        .filter(newTag => !prev.some((tag: ITag) => tag.id === newTag.value))
        .map(newTag => ({ id: newTag.value, name: newTag.label, slug: "" }))
    ]);
  };

  const onSubmit = async (values: PostFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "غير مسجل الدخول",
        description: "يجب تسجيل الدخول للقيام بهذه العملية",
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

      let response: IPost;
      
      if (isEditing) {
        response = await BlogService.updatePost(id, values, token);
      } else {
        response = await BlogService.createPost(values as IPostCreate, token);
      }

      toast({
        title: isEditing ? "تم تحديث المقال" : "تم إنشاء المقال",
        description: isEditing 
          ? "تم تحديث المقال بنجاح" 
          : "تم إنشاء المقال بنجاح",
      });

      // Navigate back to blog list or to the new/edited post
      navigate(`/dashboard/blog`);
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "خطأ في حفظ المقال",
        description: "فشل في حفظ المقال، يرجى المحاولة مرة أخرى لاحقًا.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF6B00]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title={isEditing ? "تعديل مقال" : "إضافة مقال جديد"}
        subtitle={isEditing ? "تعديل محتوى وتفاصيل المقال" : "إنشاء مقال جديد للمدونة"}
      />

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-gray-400"
            onClick={() => navigate("/dashboard/blog")}
          >
            <ChevronLeft className="ml-2 h-4 w-4" />
            العودة إلى قائمة المقالات
          </Button>
          
          <Button
            type="button"
            className="bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90"
            disabled={loading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="ml-2 h-4 w-4" />
                حفظ المقال
              </>
            )}
          </Button>
        </div>

        <Form {...form}>
          <form className="space-y-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-white">معلومات المقال</CardTitle>
                <CardDescription className="text-gray-400">
                  أدخل العنوان والمعلومات الأساسية للمقال
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel className="text-white">العنوان</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان المقال"
                          className="border-white/10 bg-white/5 text-white text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full bg-white/5 mb-6">
                    <TabsTrigger value="content" className="flex-1 data-[state=active]:bg-white/10">
                      <FileText className="ml-2 h-4 w-4" />
                      المحتوى
                    </TabsTrigger>
                    <TabsTrigger value="media" className="flex-1 data-[state=active]:bg-white/10">
                      <Image className="ml-2 h-4 w-4" />
                      الصورة
                    </TabsTrigger>
                    <TabsTrigger value="meta" className="flex-1 data-[state=active]:bg-white/10">
                      <Tag className="ml-2 h-4 w-4" />
                      التصنيفات والوسوم
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="mt-0">
                    {/* Content */}
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem className="mb-6">
                          <FormLabel className="text-white">المحتوى</FormLabel>
                          <FormControl>
                            <div className="rounded border border-white/10">
                              <QuillEditor
                                value={field.value || ''}
                                onChange={(value) => {
                                  field.onChange(value);
                                  // Ensure form validation is triggered
                                  form.trigger("content");
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Excerpt */}
                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">المقتطف</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="أدخل مقتطفاً قصيراً للمقال"
                              className="border-white/10 bg-white/5 text-white"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="mt-1 text-xs text-gray-400">
                            المقتطف هو وصف موجز للمقال يظهر في صفحة المدونة الرئيسية.
                          </p>
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="media" className="mt-0">
                    {/* Featured Image */}
                    <div className="space-y-4">
                      <FormLabel className="text-white">الصورة الرئيسية</FormLabel>
                      
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="border-white/10 bg-white/5 text-white"
                          />
                          {imagePreview && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setImagePreview(null);
                                form.setValue("featured_image", null);
                              }}
                            >
                              إزالة
                            </Button>
                          )}
                        </div>
                        
                        {imagePreview ? (
                          <div className="relative overflow-hidden rounded-md border border-white/10">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-[400px] w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed border-white/20 bg-white/5">
                            <div className="text-center text-gray-400">
                              <Image className="mx-auto h-12 w-12 opacity-50" />
                              <p className="mt-2">قم بتحميل صورة رئيسية للمقال</p>
                              <p className="text-xs">يفضل استخدام صورة بأبعاد 1200×630 بكسل</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-400">
                        الصورة الرئيسية ستظهر في صفحة المدونة الرئيسية وفي بداية المقال.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="meta" className="mt-0">
                    <div className="space-y-6">
                      {/* Slug */}
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">الرابط الدائم</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="أدخل رابطاً دائماً للمقال"
                                  className="border-white/10 bg-white/5 text-white"
                                  {...field}
                                />
                                {isEditing && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                    onClick={async () => {
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
                                        
                                        const response = await BlogService.updatePostSlug(
                                          id,
                                          field.value || null,
                                          token
                                        );
                                        
                                        form.setValue("slug", response.slug);
                                        
                                        toast({
                                          title: "تم تحديث الرابط",
                                          description: "تم تحديث الرابط الدائم للمقال بنجاح",
                                        });
                                      } catch (error) {
                                        console.error("Error updating slug:", error);
                                        toast({
                                          title: "خطأ في تحديث الرابط",
                                          description: "فشل في تحديث الرابط، يرجى المحاولة مرة أخرى لاحقًا.",
                                          variant: "destructive",
                                        });
                                      } finally {
                                        setLoading(false);
                                      }
                                    }}
                                  >
                                    تحديث الرابط
                                  </Button>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                            <p className="mt-1 text-xs text-gray-400">
                              الرابط الدائم هو رابط فريد للمقال، ويستخدم في عنوان الصفحة.
                            </p>
                          </FormItem>
                        )}
                      />

                      {/* Category */}
                      <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel className="text-white">التصنيف</FormLabel>
                              <CreateCategoryDialog onCategoryCreated={handleCategoryCreated} />
                            </div>
                            <Select
                              value={field.value || "none"}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="border-white/10 bg-white/5 text-white">
                                  <SelectValue placeholder="اختر تصنيفاً" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="border-white/10 bg-gray-900 text-white">
                                <SelectItem value="none">بدون تصنيف</SelectItem>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                            <p className="mt-1 text-xs text-gray-400">
                              التصنيف يساعد في تنظيم المقالات وتسهيل الوصول إليها.
                            </p>
                          </FormItem>
                        )}
                      />

                      <Separator className="bg-white/10" />

                      {/* Tags */}
                      <FormField
                        control={form.control}
                        name="tag_ids"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">الوسوم</FormLabel>
                            <MultiSelectWithCreate
                              items={tags.map((tag) => ({
                                label: tag.name,
                                value: tag.id,
                              }))}
                              selectedValues={field.value || []}
                              onSelectChange={(selected) => field.onChange(selected)}
                              onItemsChange={handleTagsChange}
                              placeholder="اختر الوسوم أو أضف وسوماً جديدة"
                              className="border-white/10 bg-white/5 text-white"
                              createItemLabel="إضافة وسم جديد"
                            />
                            <FormMessage />
                            <p className="mt-1 text-xs text-gray-400">
                              يمكنك إضافة وسوم متعددة للمقال. اكتب اسم الوسم الجديد واضغط على "إضافة وسم جديد".
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator className="my-6 bg-white/10" />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">الحالة</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="border-white/10 bg-white/5 text-white">
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-white/10 bg-gray-900 text-white">
                          <SelectItem value="draft">
                            <div className="flex items-center">
                              <div className="ml-2 h-2 w-2 rounded-full bg-yellow-500"></div>
                              مسودة
                            </div>
                          </SelectItem>
                          <SelectItem value="published">
                            <div className="flex items-center">
                              <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
                              منشور
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button - Bottom */}
                <div className="mt-6 flex justify-end">
                  <Button
                    type="button"
                    className="bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90"
                    disabled={loading}
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="ml-2 h-4 w-4" />
                        حفظ المقال
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default BlogEditor;
