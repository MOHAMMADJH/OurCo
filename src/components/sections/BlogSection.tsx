import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import BlogService, { IPost } from "@/services/blogService";
import BlogCard from "../blog/BlogCard";
import BlogFilters, { BlogFilterValues } from "../blog/BlogFilters";
import BlogPagination from "../blog/BlogPagination";

interface BlogSectionProps {
  limit?: number;
  showHeader?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
}

const BlogSection = ({
  limit = 3,
  showHeader = true,
  showFilters = false,
  showPagination = false,
}: BlogSectionProps) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<BlogFilterValues>({
    search: "",
    category: undefined,
    tag: undefined,
  });

  // Fetch posts with filters
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await BlogService.getAllPosts({
          category: filters.category,
          tag: filters.tag,
          search: filters.search,
        });
        setPosts(response.results || []);
        
        // Calculate total pages
        const totalItems = response.count || response.results.length;
        const calculatedTotalPages = Math.ceil(totalItems / limit);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("حدث خطأ أثناء تحميل المقالات");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filters, limit]);
  
  // Apply pagination to posts
  useEffect(() => {
    // Reset to first page when filters change
    if (currentPage !== 1 && filters) {
      setCurrentPage(1);
      return;
    }
    
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Apply pagination only if showPagination is true, otherwise show limited posts
    if (showPagination) {
      setFilteredPosts(posts.slice(startIndex, endIndex));
    } else {
      setFilteredPosts(posts.slice(0, limit));
    }
  }, [posts, currentPage, limit, showPagination, filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters: BlogFilterValues) => {
    setFilters(newFilters);
  };
  
  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="relative w-full bg-[#0B1340] px-4 py-16 text-right lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a237e10_0%,transparent_100%)]" />
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF6B00] opacity-[0.15] blur-[150px]" />
        <div className="absolute right-0 top-[20%] h-[300px] w-[300px] rounded-full bg-[#4A90E2] opacity-[0.1] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {showHeader && (
          <div className="mb-12 text-center">
            <div className="inline-block rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
              <span className="text-lg font-medium text-white">المدونة</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white lg:text-4xl">
              آخر المقالات والأخبار التقنية
            </h2>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <BlogFilters onFilterChange={handleFilterChange} />
          </motion.div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-xl text-red-400">{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
            <p className="text-xl text-gray-400">لم يتم العثور على مقالات</p>
            {filters.search || filters.category || filters.tag ? (
              <Button
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20"
                onClick={() => handleFilterChange({ search: "", category: undefined, tag: undefined })}
              >
                مسح عوامل التصفية
              </Button>
            ) : null}
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-12"
              >
                <BlogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </motion.div>
            )}
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Button asChild variant="outline" className="bg-white/10 text-white hover:bg-white/20">
            <Link to="/blog">اكتشف المزيد من المقالات والأخبار في مدونتنا</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
