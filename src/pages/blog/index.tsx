import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import Navbar from "@/components/navigation/Navbar";
import BlogService, { IPost, ICategory, ITag } from "@/services/blogService";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BlogNavigation from "@/components/blog/BlogNavigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Calendar,
  Search,
  Tag,
  Clock,
  Eye,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentLang, isRTL } = useLanguage();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [selectedTag, setSelectedTag] = useState<string>(
    searchParams.get("tag") || ""
  );

  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch posts with filters
        const params: Record<string, string> = {
          page: currentPage.toString(),
        };

        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedTag) params.tag = selectedTag;

        const postsData = await BlogService.getAllPosts(params);
        setPosts(postsData.results || []);
        setTotalPages(Math.ceil((postsData.count || 0) / 10)); // Assuming 10 items per page

        // Fetch categories and tags for filters
        const categoriesData = await BlogService.getAllCategories();
        setCategories(categoriesData || []);

        const tagsData = await BlogService.getAllTags();
        setTags(tagsData || []);

        setError(null);
      } catch (err) {
        console.error("Error fetching blog data:", err);
        setError("حدث خطأ أثناء تحميل المدونة");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, selectedCategory, selectedTag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set("search", searchTerm);
    } else {
      newParams.delete("search");
    }
    newParams.set("page", "1"); // Reset to first page on new search
    setSearchParams(newParams);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("category", value);
    } else {
      newParams.delete("category");
    }
    newParams.set("page", "1"); // Reset to first page on filter change
    setSearchParams(newParams);
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("tag", value);
    } else {
      newParams.delete("tag");
    }
    newParams.set("page", "1"); // Reset to first page on filter change
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedTag("");
    setSearchParams(new URLSearchParams({ page: "1" }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: ar });
    } catch (error) {
      return dateString;
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`/blog?page=${Math.max(1, currentPage - 1)}${
                searchTerm ? `&search=${searchTerm}` : ""
              }${selectedCategory ? `&category=${selectedCategory}` : ""}${
                selectedTag ? `&tag=${selectedTag}` : ""
              }`}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href={`/blog?page=1${
                    searchTerm ? `&search=${searchTerm}` : ""
                  }${selectedCategory ? `&category=${selectedCategory}` : ""}${
                    selectedTag ? `&tag=${selectedTag}` : ""
                  }`}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={`/blog?page=${page}${
                  searchTerm ? `&search=${searchTerm}` : ""
                }${selectedCategory ? `&category=${selectedCategory}` : ""}${
                  selectedTag ? `&tag=${selectedTag}` : ""
                }`}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href={`/blog?page=${totalPages}${
                    searchTerm ? `&search=${searchTerm}` : ""
                  }${selectedCategory ? `&category=${selectedCategory}` : ""}${
                    selectedTag ? `&tag=${selectedTag}` : ""
                  }`}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              href={`/blog?page=${Math.min(totalPages, currentPage + 1)}${
                searchTerm ? `&search=${searchTerm}` : ""
              }${selectedCategory ? `&category=${selectedCategory}` : ""}${
                selectedTag ? `&tag=${selectedTag}` : ""
              }`}
              aria-disabled={currentPage === totalPages}
              className={
                currentPage === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderFilterBadges = () => {
    if (!selectedCategory && !selectedTag && !searchTerm) return null;

    return (
      <div className="mb-6 flex flex-wrap gap-2">
        {searchTerm && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1.5"
          >
            <Search className="h-3 w-3" />
            {searchTerm}
            <button
              onClick={() => {
                setSearchTerm("");
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("search");
                setSearchParams(newParams);
              }}
              className="ml-2 rounded-full hover:bg-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        {selectedCategory && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1.5"
          >
            <Filter className="h-3 w-3" />
            {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
            <button
              onClick={() => handleCategoryChange("")}
              className="ml-2 rounded-full hover:bg-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        {selectedTag && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1.5"
          >
            <Tag className="h-3 w-3" />
            {tags.find((t) => t.slug === selectedTag)?.name || selectedTag}
            <button
              onClick={() => handleTagChange("")}
              className="ml-2 rounded-full hover:bg-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        {(selectedCategory || selectedTag || searchTerm) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-xs"
          >
            مسح الكل
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-950 ${isRTL ? "rtl" : "ltr"}`}>
      <Navbar initialLang={currentLang} />
      <main className="container mx-auto px-4 pb-16 pt-24">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            المدونة
          </h1>
          <p className="mx-auto max-w-2xl text-gray-400">
            أحدث المقالات والأخبار في مجال التكنولوجيا والتطوير
          </p>
        </div>

        <BlogNavigation showHomeLink={true} />

        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <form
            onSubmit={handleSearch}
            className="relative w-full md:max-w-md"
          >
            <Input
              type="text"
              placeholder="ابحث في المدونة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-900 pr-10"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 -translate-y-1/2 transform"
            >
              <Search className="h-5 w-5 text-gray-400" />
            </button>
          </form>

          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between gap-2 sm:w-auto"
                >
                  <Filter className="h-4 w-4" />
                  تصفية المقالات
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-gray-900">
                <SheetHeader>
                  <SheetTitle className="text-right text-white">
                    تصفية المقالات
                  </SheetTitle>
                  <SheetDescription className="text-right text-gray-400">
                    اختر الفئات والوسوم لتصفية المقالات
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="category-filter"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      الفئة
                    </label>
                    <Select
                      value={selectedCategory}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger id="category-filter" className="bg-gray-800">
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800">
                        <SelectItem value="all">جميع الفئات</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="tag-filter"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      الوسم
                    </label>
                    <Select
                      value={selectedTag}
                      onValueChange={handleTagChange}
                    >
                      <SelectTrigger id="tag-filter" className="bg-gray-800">
                        <SelectValue placeholder="اختر الوسم" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800">
                        <SelectItem value="all">جميع الوسوم</SelectItem>
                        {tags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.slug}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <SheetFooter className="mt-6 flex-row-reverse justify-start gap-2">
                  <SheetClose asChild>
                    <Button
                      type="submit"
                      className="w-full"
                      onClick={() => {
                        // Apply filters (already handled by state changes)
                      }}
                    >
                      تطبيق الفلتر
                    </Button>
                  </SheetClose>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={clearFilters}
                  >
                    مسح الفلتر
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {renderFilterBadges()}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden bg-gray-900">
                <div className="aspect-video w-full">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardHeader>
                  <Skeleton className="mb-2 h-4 w-1/3" />
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border border-gray-800 bg-gray-900 p-8">
            <p className="text-xl text-red-400">{error}</p>
            <Button onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border border-gray-800 bg-gray-900 p-8">
            <p className="text-xl text-gray-400">
              لم يتم العثور على أي مقالات
            </p>
            <Button onClick={clearFilters}>عرض جميع المقالات</Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  to={`/blog/${post.slug}`}
                  key={post.id}
                  className="group"
                >
                  <Card className="h-full overflow-hidden border-gray-800 bg-gray-900 transition-all duration-300 hover:border-gray-700 hover:bg-gray-800">
                    <div className="aspect-video w-full overflow-hidden">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-600">
                          لا توجد صورة
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      {post.category && (
                        <Badge
                          variant="outline"
                          className="mb-2 w-fit border-[#FF6B00] text-[#FF6B00]"
                        >
                          {post.category.name}
                        </Badge>
                      )}
                      <h2 className="line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-[#FF6B00]">
                        {post.title}
                      </h2>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="line-clamp-3 text-gray-400">
                        {post.excerpt ||
                          (post.content
                            ? post.content.replace(/<[^>]*>/g, "").substring(0, 150) + "..."
                            : "")}
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-[#FF6B00]/20 text-[#FF6B00] text-xs">
                            {post.author.first_name?.[0] || post.author.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {post.author.first_name
                            ? `${post.author.first_name} ${post.author.last_name || ""}`
                            : post.author.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {formatDate(post.published_at || post.created_at)}
                        </span>
                      </div>
                      {post.views !== undefined && (
                        <div className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{post.views}</span>
                        </div>
                      )}
                      {post.comments && (
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{post.comments.length}</span>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>

            {renderPagination()}
          </>
        )}
      </main>
    </div>
  );
};

export default BlogPage;
