import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Eye, ThumbsUp, MessageSquare, Share2, TrendingUp } from "lucide-react";

interface PostStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  trend: number;
}

interface PostAnalyticsProps {
  stats: PostStats;
}

const PostAnalytics = ({
  stats = {
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    trend: 0,
  },
}: PostAnalyticsProps) => {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">إحصائيات المقال</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-lg bg-white/10 p-4 text-center shadow-sm">
            <Eye className="mx-auto mb-2 h-6 w-6 text-blue-500" />
            <div className="text-2xl font-bold text-white">{stats.views.toLocaleString()}</div>
            <div className="text-sm text-gray-300">مشاهدة</div>
          </div>

          <div className="rounded-lg bg-white/10 p-4 text-center shadow-sm">
            <ThumbsUp className="mx-auto mb-2 h-6 w-6 text-green-500" />
            <div className="text-2xl font-bold text-white">{stats.likes.toLocaleString()}</div>
            <div className="text-sm text-gray-300">إعجاب</div>
          </div>

          <div className="rounded-lg bg-white/10 p-4 text-center shadow-sm">
            <MessageSquare className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
            <div className="text-2xl font-bold text-white">
              {stats.comments.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">تعليق</div>
          </div>

          <div className="rounded-lg bg-white/10 p-4 text-center shadow-sm">
            <Share2 className="mx-auto mb-2 h-6 w-6 text-purple-500" />
            <div className="text-2xl font-bold text-white">{stats.shares.toLocaleString()}</div>
            <div className="text-sm text-gray-300">مشاركة</div>
          </div>

          <div className="rounded-lg bg-white/10 p-4 text-center shadow-sm">
            <TrendingUp className="mx-auto mb-2 h-6 w-6 text-[#FF6B00]" />
            <div className="text-2xl font-bold text-white">
              {stats.trend > 0 ? "+" : ""}
              {stats.trend}%
            </div>
            <div className="text-sm text-gray-300">النمو</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostAnalytics;
