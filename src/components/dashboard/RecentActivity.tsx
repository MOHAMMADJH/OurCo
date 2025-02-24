import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface Activity {
  id: string;
  type: "project" | "client" | "message" | "service";
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "project",
    title: "تم إضافة مشروع جديد",
    description: "تم إضافة مشروع 'تطوير موقع شركة التقنية' إلى النظام",
    time: "منذ 5 دقائق",
  },
  {
    id: "2",
    type: "client",
    title: "عميل جديد",
    description: "انضم 'شركة الأعمال الدولية' إلى قائمة العملاء",
    time: "منذ ساعة",
  },
  {
    id: "3",
    type: "message",
    title: "رسالة جديدة",
    description: "تم استلام استفسار جديد حول خدمات التسويق الرقمي",
    time: "منذ ساعتين",
  },
  {
    id: "4",
    type: "service",
    title: "تحديث الخدمات",
    description: "تم تحديث أسعار خدمات التصميم",
    time: "منذ 3 ساعات",
  },
];

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "project":
      return "bg-blue-500/10 text-blue-500";
    case "client":
      return "bg-green-500/10 text-green-500";
    case "message":
      return "bg-yellow-500/10 text-yellow-500";
    case "service":
      return "bg-purple-500/10 text-purple-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const RecentActivity = () => {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">النشاط الأخير</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={getActivityColor(activity.type)}>
                    {activity.title}
                  </Badge>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-300">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
