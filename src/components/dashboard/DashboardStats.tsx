import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ArrowUp,
  Users,
  FileText,
  MessageSquare,
  DollarSign,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, icon }: StatCardProps) => (
  <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-400">
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="flex items-center gap-1 text-sm text-green-500">
          <ArrowUp className="h-4 w-4" />
          {change}
        </div>
      </div>
    </CardContent>
  </Card>
);

const DashboardStats = () => {
  const stats = [
    {
      title: "إجمالي المشاريع",
      value: "24",
      change: "+12%",
      icon: <FileText className="h-5 w-5 text-[#FF6B00]" />,
    },
    {
      title: "العملاء النشطين",
      value: "48",
      change: "+18%",
      icon: <Users className="h-5 w-5 text-[#4A90E2]" />,
    },
    {
      title: "الرسائل الجديدة",
      value: "12",
      change: "+5%",
      icon: <MessageSquare className="h-5 w-5 text-[#FF6B00]" />,
    },
    {
      title: "الإيرادات الشهرية",
      value: "25,000 ر.س",
      change: "+8%",
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;
