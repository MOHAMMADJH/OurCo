import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, Users, FileText, MessageSquare } from "lucide-react";

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
];

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="لوحة التحكم"
        subtitle="مرحباً بك في لوحة التحكم"
      />

      <div className="p-6">
        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-500">
                    <ArrowUp className="h-4 w-4" />
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">النشاط الأخير</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Activity items will go here */}
              <p className="text-gray-400">لا يوجد نشاط حديث</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
