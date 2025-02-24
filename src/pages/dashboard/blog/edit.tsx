import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RichTextEditor from "@/components/blog/RichTextEditor";
import CategoryManager from "@/components/blog/CategoryManager";
import PostScheduler from "@/components/blog/PostScheduler";
import PostAnalytics from "@/components/blog/PostAnalytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const mockCategories = [
  { id: "1", name: "تقنية", count: 5 },
  { id: "2", name: "تطوير", count: 3 },
  { id: "3", name: "تسويق", count: 4 },
];

const mockStats = {
  views: 1250,
  likes: 84,
  comments: 12,
  shares: 35,
  trend: 12,
};

const BlogEditPage = () => {
  const [content, setContent] = React.useState("");
  const [publishDate, setPublishDate] = React.useState<Date>();

  return (
    <DashboardLayout>
      <DashboardHeader
        title="تحرير المقال"
        subtitle="إنشاء وتحرير محتوى المقال"
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr,300px]">
        {/* Main Content */}
        <div className="space-y-6">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <Input
                placeholder="عنوان المقال"
                className="mb-4 border-white/10 bg-white/5 text-right text-2xl text-white placeholder:text-gray-400"
              />
              <Input
                placeholder="وصف مختصر للمقال"
                className="border-white/10 bg-white/5 text-right text-white placeholder:text-gray-400"
              />
            </CardContent>
          </Card>

          <RichTextEditor value={content} onChange={setContent} />

          <div className="flex gap-4">
            <Button className="flex-1 bg-[#FF6B00] hover:bg-[#FF8533]">
              نشر المقال
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-white/10 text-white hover:bg-white/10"
            >
              حفظ كمسودة
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <CategoryManager
            categories={mockCategories}
            onAddCategory={(name) => console.log("Add category:", name)}
            onDeleteCategory={(id) => console.log("Delete category:", id)}
          />

          <PostScheduler
            selectedDate={publishDate}
            onDateSelect={setPublishDate}
          />

          <PostAnalytics stats={mockStats} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlogEditPage;
