import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Calendar,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishDate: string;
  status: "published" | "draft" | "scheduled";
  views: number;
  imageUrl: string;
}

const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "كيف تختار أفضل استضافة لموقعك؟",
    excerpt: "دليل شامل لاختيار خدمة الاستضافة المناسبة لمشروعك",
    category: "استضافة",
    author: "أحمد محمد",
    publishDate: "2024-03-15",
    status: "published",
    views: 1250,
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
  },
  {
    id: "2",
    title: "أهمية التسويق الرقمي لنجاح المشاريع",
    excerpt: "استراتيجيات فعالة للتسويق الرقمي في 2024",
    category: "تسويق",
    author: "سارة أحمد",
    publishDate: "2024-03-20",
    status: "scheduled",
    views: 0,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
  },
  {
    id: "3",
    title: "أحدث تقنيات تطوير الويب",
    excerpt: "تعرف على أحدث التقنيات المستخدمة في تطوير المواقع",
    category: "تطوير",
    author: "محمد علي",
    publishDate: "",
    status: "draft",
    views: 0,
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  },
];

const getStatusColor = (status: BlogPost["status"]) => {
  switch (status) {
    case "published":
      return "bg-green-500/10 text-green-500";
    case "draft":
      return "bg-gray-500/10 text-gray-500";
    case "scheduled":
      return "bg-blue-500/10 text-blue-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const getStatusText = (status: BlogPost["status"]) => {
  switch (status) {
    case "published":
      return "منشور";
    case "draft":
      return "مسودة";
    case "scheduled":
      return "مجدول";
    default:
      return status;
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "استضافة":
      return "bg-purple-500/10 text-purple-500";
    case "تسويق":
      return "bg-yellow-500/10 text-yellow-500";
    case "تطوير":
      return "bg-blue-500/10 text-blue-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const BlogPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة المدونة"
        subtitle="عرض وإدارة المقالات والمحتوى"
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="البحث في المقالات..."
              className="border-white/10 bg-white/5 pr-10 text-right text-white placeholder:text-gray-400"
            />
          </div>
          <Button className="bg-[#FF6B00] hover:bg-[#FF8533]">
            <Plus className="mr-2 h-4 w-4" />
            إضافة مقال جديد
          </Button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockPosts.map((post) => (
            <Card
              key={post.id}
              className="border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-2 top-2 flex gap-2">
                    <Badge className={getStatusColor(post.status)}>
                      {getStatusText(post.status)}
                    </Badge>
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {post.publishDate || "غير محدد"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-bold text-white">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm text-gray-400">{post.excerpt}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">الكاتب: {post.author}</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Eye className="h-4 w-4" />
                    {post.views}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlogPage;
