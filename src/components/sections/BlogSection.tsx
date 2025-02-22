import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight, Calendar } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  category: string;
}

interface BlogSectionProps {
  posts?: BlogPost[];
}

const defaultPosts: BlogPost[] = [
  {
    id: 1,
    title: "كيف تختار أفضل استضافة لموقعك؟",
    excerpt: "دليل شامل لاختيار خدمة الاستضافة المناسبة لمشروعك",
    date: "2024-03-15",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    category: "استضافة",
  },
  {
    id: 2,
    title: "أهمية التسويق الرقمي لنجاح المشاريع",
    excerpt: "استراتيجيات فعالة للتسويق الرقمي في 2024",
    date: "2024-03-10",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    category: "تسويق",
  },
  {
    id: 3,
    title: "أحدث تقنيات تطوير الويب",
    excerpt: "تعرف على أحدث التقنيات المستخدمة في تطوير المواقع",
    date: "2024-03-05",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    category: "تطوير",
  },
];

const BlogSection = ({ posts = defaultPosts }: BlogSectionProps) => {
  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-white">المدونة</h2>
          <p className="text-xl text-gray-400">آخر المقالات والأخبار التقنية</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden border-2 border-gray-800 bg-gray-800/50 backdrop-blur-sm transition-all hover:border-blue-500">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
                    {post.category}
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <CardTitle className="mt-2 text-xl text-white">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-400">{post.excerpt}</p>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-blue-400 hover:text-blue-300"
                  >
                    <span>اقرأ المزيد</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Button
            size="lg"
            variant="outline"
            className="text-white hover:bg-gray-800"
          >
            <span>عرض جميع المقالات</span>
            <ArrowRight className="mr-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
