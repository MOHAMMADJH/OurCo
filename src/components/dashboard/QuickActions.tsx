import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, MessageSquare, FileText, Users, Settings } from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const QuickActions = () => {
  const actions: QuickAction[] = [
    {
      title: "إضافة مشروع",
      description: "إنشاء مشروع جديد في النظام",
      icon: <Plus className="h-5 w-5" />,
      onClick: () => console.log("Add project clicked"),
    },
    {
      title: "إدارة الرسائل",
      description: "عرض وإدارة رسائل العملاء",
      icon: <MessageSquare className="h-5 w-5" />,
      onClick: () => console.log("Manage messages clicked"),
    },
    {
      title: "التقارير",
      description: "عرض تقارير الأداء",
      icon: <FileText className="h-5 w-5" />,
      onClick: () => console.log("View reports clicked"),
    },
    {
      title: "إدارة المستخدمين",
      description: "إدارة صلاحيات المستخدمين",
      icon: <Users className="h-5 w-5" />,
      onClick: () => console.log("Manage users clicked"),
    },
    {
      title: "الإعدادات",
      description: "تخصيص إعدادات النظام",
      icon: <Settings className="h-5 w-5" />,
      onClick: () => console.log("Settings clicked"),
    },
  ];

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">إجراءات سريعة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex h-auto flex-col items-center gap-2 border-white/10 bg-white/5 p-4 text-white hover:bg-white/10"
              onClick={action.onClick}
            >
              <div className="rounded-full bg-white/10 p-2">{action.icon}</div>
              <span className="text-sm font-medium">{action.title}</span>
              <span className="text-xs text-gray-400">
                {action.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
