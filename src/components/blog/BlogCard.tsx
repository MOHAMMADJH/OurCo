import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight, Calendar, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { IPost } from "@/services/blogService";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface BlogCardProps {
  post: IPost;
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index }) => {
  // Format date to Arabic format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: ar });
    } catch (error) {
      return dateString;
    }
  };

  // Calculate estimated reading time (1 min per 200 words)
  const calculateReadingTime = (content?: string) => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes > 0 ? minutes : 1;
  };

  const readingTime = calculateReadingTime(post.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group h-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-[#FF6B00]/5">
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.featured_image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {post.category && (
            <div className="absolute right-4 top-4 rounded-full bg-[#FF6B00]/20 px-3 py-1 text-sm text-[#FF6B00] backdrop-blur-sm">
              {post.category.name}
            </div>
          )}
        </div>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readingTime} دقيقة للقراءة</span>
            </div>
            {post.views !== undefined && (
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{post.views} مشاهدة</span>
              </div>
            )}
          </div>
          <CardTitle className="mt-2 text-xl text-white transition-colors group-hover:text-[#FF6B00]">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-300">{post.excerpt}</p>
          <Button
            variant="ghost"
            className="w-full justify-between text-[#FF6B00] hover:text-[#FF8533] group-hover:bg-white/5"
            asChild
          >
            <Link to={`/blog/${post.slug}`}>
              <span>اقرأ المزيد</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-[-4px]" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BlogCard;