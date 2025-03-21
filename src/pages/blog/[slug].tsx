import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import { useLanguage } from "@/hooks/useLanguage";
import BlogService, { IPost, ICommentCreate, ITag } from "@/services/blogService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BlogNavigation from "@/components/blog/BlogNavigation";
import { 
  Calendar, 
  ArrowLeft, 
  Tag, 
  MessageCircle, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Copy, 
  Eye, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Bookmark,
  ThumbsUp
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import DOMPurify from 'dompurify';

// Define comment form schema
const commentSchema = z.object({
  name: z.string().min(3, { message: "يجب أن يكون الاسم أكثر من 3 أحرف" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  content: z.string().min(10, { message: "يجب أن يكون التعليق أكثر من 10 أحرف" }),
});

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { currentLang, isRTL } = useLanguage();
  const [post, setPost] = useState<IPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [estimatedReadTime, setEstimatedReadTime] = useState<number>(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize form
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (!slug) return;
        
        const data = await BlogService.getPostBySlug(slug);
        setPost(data);
        
        // Calculate estimated read time
        if (data.content) {
          // Remove HTML tags and count words
          const text = data.content.replace(/<[^>]*>/g, "");
          const wordCount = text.split(/\s+/).length;
          // Average reading speed: 200 words per minute
          const readTime = Math.ceil(wordCount / 200);
          setEstimatedReadTime(readTime);
        }
        
        // Fetch related posts based on category or tags
        if (data.category || (data.tags && data.tags.length > 0)) {
          let params = {};
          if (data.category) {
            params = { category: data.category.slug };
          } else if (data.tags && data.tags.length > 0) {
            params = { tag: data.tags[0].slug };
          }
          
          const relatedData = await BlogService.getAllPosts(params);
          // Filter out the current post and limit to 3 posts
          const filteredRelated = relatedData.results
            .filter((p: IPost) => p.id !== data.id)
            .slice(0, 3);
          setRelatedPosts(filteredRelated);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("لم يتم العثور على المقال المطلوب");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: ar });
    } catch (error) {
      return dateString;
    }
  };

  const onSubmitComment = async (values: z.infer<typeof commentSchema>) => {
    try {
      if (!slug) return;
      // Ensure we pass all required fields with proper typing
      const commentData: ICommentCreate = {
        name: values.name,
        email: values.email,
        content: values.content
      };
      await BlogService.addComment(slug, commentData);
      setCommentSubmitted(true);
      form.reset();
      
      toast({
        title: "تم إرسال التعليق بنجاح",
        description: "سيتم مراجعة التعليق ونشره قريباً",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "حدث خطأ",
        description: "لم يتم إرسال التعليق، يرجى المحاولة مرة أخرى",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط المقال إلى الحافظة",
      duration: 3000,
    });
  };
  
  const shareOnSocialMedia = (platform: string) => {
    if (!post) return;
    
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const renderSkeleton = () => (
    <div className="mx-auto max-w-4xl px-4">
      <Skeleton className="mb-8 h-10 w-32" />
      <Skeleton className="mb-8 h-[400px] w-full rounded-xl" />
      <Skeleton className="mb-4 h-8 w-24" />
      <Skeleton className="mb-4 h-12 w-full" />
      <Skeleton className="mb-8 h-6 w-64" />
      <Separator className="mb-8 bg-gray-800" />
      <div className="mb-12 space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar initialLang={currentLang} />
      <main className="pt-24 pb-16">
        {loading ? (
          renderSkeleton()
        ) : error ? (
          <div className="mx-auto max-w-4xl px-4">
            <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border border-gray-800 bg-gray-900 p-8">
              <p className="text-xl text-red-400">{error}</p>
              <Button asChild variant="outline">
                <Link to="/blog">العودة إلى المدونة</Link>
              </Button>
            </div>
          </div>
        ) : post ? (
          <>
            <div className="mx-auto max-w-4xl px-4">
              {/* Navigation */}
              <BlogNavigation postTitle={post.title} postSlug={post.slug} />

              {/* Featured Image */}
              {post.featured_image && (
                <div className="mb-8 overflow-hidden rounded-xl">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="h-[400px] w-full object-cover"
                  />
                </div>
              )}

              {/* Post Header */}
              <div className="mb-8">
                {post.category && (
                  <Badge
                    variant="outline"
                    className="mb-4 border-[#FF6B00] text-[#FF6B00]"
                  >
                    {post.category.name}
                  </Badge>
                )}
                <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-[#FF6B00]/20 text-[#FF6B00]">
                        {post.author?.first_name?.[0] || post.author?.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {post.author?.first_name && post.author.last_name
                        ? `${post.author.first_name} ${post.author.last_name}`
                        : post.author?.first_name
                        ? post.author.first_name
                        : post.author?.username || "مستخدم"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{estimatedReadTime} دقيقة للقراءة</span>
                  </div>
                  {post.views !== undefined && (
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{post.views} مشاهدة</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="mb-8 bg-gray-800" />

              {/* Post Content */}
              <div className="mb-12">
                <div 
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || "") }}
                  className={`blog-content ${isRTL ? 'rtl' : ''}`}
                />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-12">
                  <h3 className="mb-4 text-xl font-semibold text-white">الوسوم</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link to={`/blog?tag=${tag.slug}`} key={tag.id}>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons */}
              <div className="mb-12">
                <h3 className="mb-4 text-xl font-semibold text-white">
                  شارك المقال
                </h3>
                <div className="flex flex-wrap gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => shareOnSocialMedia("facebook")}
                        >
                          <Facebook className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>مشاركة على فيسبوك</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => shareOnSocialMedia("twitter")}
                        >
                          <Twitter className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>مشاركة على تويتر</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={() => shareOnSocialMedia("linkedin")}
                        >
                          <Linkedin className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>مشاركة على لينكد إن</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                          onClick={copyToClipboard}
                        >
                          <Copy className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>نسخ الرابط</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                        >
                          <Bookmark className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>حفظ المقال</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full"
                        >
                          <ThumbsUp className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>أعجبني</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Author Bio */}
              <div className="mb-12">
                <Card className="border-gray-800 bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-[#FF6B00]/20 text-[#FF6B00] text-xl">
                          {post.author?.first_name?.[0] || post.author?.username?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="mb-2 text-xl font-semibold text-white">
                          {post.author?.first_name && post.author.last_name
                            ? `${post.author.first_name} ${post.author.last_name}`
                            : post.author?.first_name
                            ? post.author.first_name
                            : post.author?.username || "مستخدم"}
                        </h3>
                        <p className="text-gray-400">
                          كاتب ومحرر محتوى متخصص في مجال التكنولوجيا والتطوير. يهتم بنشر المعرفة وتبسيط المفاهيم التقنية للقراء.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Comments Section */}
              <div className="mb-12">
                <h3 className="mb-6 text-2xl font-semibold text-white">
                  التعليقات
                  {post.comments && post.comments.length > 0 && post.comments.filter(c => c.is_approved).length > 0 && (
                    <span className="mr-2 text-lg text-gray-400">
                      ({post.comments.filter(c => c.is_approved).length})
                    </span>
                  )}
                </h3>

                {commentSubmitted ? (
                  <Card className="border-green-500/20 bg-green-500/10">
                    <CardContent className="p-6">
                      <h4 className="mb-2 text-lg font-medium text-green-400">
                        تم إرسال تعليقك بنجاح
                      </h4>
                      <p className="text-gray-300">
                        شكراً لك! سيتم مراجعة تعليقك ونشره قريباً.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="mb-8 border-gray-800 bg-gray-900">
                    <CardHeader>
                      <CardTitle className="text-xl">أضف تعليقاً</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmitComment)}
                          className="space-y-4"
                        >
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>الاسم</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="أدخل اسمك"
                                      className="bg-gray-800"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>البريد الإلكتروني</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="أدخل بريدك الإلكتروني"
                                      className="bg-gray-800"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>التعليق</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="أدخل تعليقك هنا..."
                                    className="min-h-[120px] bg-gray-800"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full sm:w-auto">
                            إرسال التعليق
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}

                {/* Comments List */}
                {post.comments && post.comments.length > 0 ? (
                  <div className="space-y-4">
                    {post.comments
                      .filter((comment) => comment.is_approved)
                      .map((comment) => (
                        <Card
                          key={comment.id}
                          className="border-gray-800 bg-gray-900"
                        >
                          <CardContent className="p-6">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-gray-700">
                                    {comment.name?.[0] || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-white">
                                  {comment.name}
                                </span>
                              </div>
                              <span className="text-sm text-gray-400">
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-300">{comment.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Card className="border-gray-800 bg-gray-900">
                    <CardContent className="p-6 text-center">
                      <MessageCircle className="mx-auto mb-2 h-8 w-8 text-gray-500" />
                      <p className="text-gray-400">
                        لا توجد تعليقات حتى الآن. كن أول من يعلق!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
            
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-gray-900 py-12">
                <div className="mx-auto max-w-6xl px-4">
                  <h3 className="mb-8 text-2xl font-semibold text-white">
                    مقالات ذات صلة
                  </h3>
                  <div className="grid gap-6 md:grid-cols-3">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        to={`/blog/${relatedPost.slug}`}
                        key={relatedPost.id}
                        className="group"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/blog/${relatedPost.slug}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        <Card className="h-full overflow-hidden border-gray-800 bg-gray-800/50 transition-all duration-300 hover:border-gray-700 hover:bg-gray-800">
                          <div className="aspect-video w-full overflow-hidden">
                            {relatedPost.featured_image ? (
                              <img
                                src={relatedPost.featured_image}
                                alt={relatedPost.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-600">
                                لا توجد صورة
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h4 className="mb-2 line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-[#FF6B00]">
                              {relatedPost.title}
                            </h4>
                            <p className="line-clamp-2 text-sm text-gray-400">
                              {relatedPost.excerpt ||
                                (relatedPost.content && relatedPost.content.length > 0
                                  ? relatedPost.content
                                      .replace(/<[^>]*>/g, "")
                                      .substring(0, 100) + "..."
                                  : "")}
                            </p>
                          </CardContent>
                          <CardFooter className="border-t border-gray-800 bg-gray-800/50 p-4">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                <span className="text-xs text-gray-500">
                                  {formatDate(relatedPost.published_at || relatedPost.created_at)}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs text-[#FF6B00] hover:bg-[#FF6B00]/10 hover:text-[#FF6B00]"
                              >
                                قراءة المزيد
                                <ChevronLeft className="mr-1 h-3 w-3" />
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Newsletter Subscription */}
            <div className="bg-[#FF6B00]/10 py-16">
              <div className="mx-auto max-w-4xl px-4 text-center">
                <h3 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                  اشترك في النشرة البريدية
                </h3>
                <p className="mb-6 text-gray-300">
                  احصل على أحدث المقالات والأخبار مباشرة إلى بريدك الإلكتروني
                </p>
                <form className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
                  <Input
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    className="bg-gray-800"
                  />
                  <Button type="submit" className="whitespace-nowrap">
                    اشترك الآن
                  </Button>
                </form>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};

export default BlogPostPage;
