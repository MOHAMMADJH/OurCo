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
    <section className="relative w-full bg-[#0B1340] px-4 py-16 text-right lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a237e10_0%,transparent_100%)]" />
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-[#FF6B00] opacity-[0.15] blur-[150px]" />
        <div className="absolute right-0 top-[20%] h-[300px] w-[300px] rounded-full bg-[#4A90E2] opacity-[0.1] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="inline-block rounded-lg bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-lg font-medium text-white">المدونة</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white lg:text-4xl">
            آخر المقالات والأخبار التقنية
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="group h-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute right-4 top-4 rounded-full bg-[#FF6B00]/20 px-3 py-1 text-sm text-[#FF6B00]">
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
                  <p className="mb-4 text-gray-300">{post.excerpt}</p>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-[#FF6B00] hover:text-[#FF8533]"
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
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-300">
            اكتشف المزيد من المقالات والأخبار في مدونتنا
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
