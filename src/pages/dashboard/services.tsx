import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "active" | "draft";
}

const mockServices: Service[] = [
  {
    id: "1",
    title: "تطوير المواقع",
    description: "تطوير مواقع احترافية",
    icon: "💻",
    status: "active",
  },
  {
    id: "2",
    title: "تصميم الهوية",
    description: "تصميم هوية بصرية متكاملة",
    icon: "🎨",
    status: "active",
  },
  {
    id: "3",
    title: "التسويق الرقمي",
    description: "حملات تسويقية فعالة",
    icon: "📱",
    status: "draft",
  },
];

const ServicesPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة الخدمات"
        subtitle="إضافة وتعديل الخدمات المقدمة"
      />

      <div className="p-6">
        <div className="mb-6 flex justify-between">
          <Button className="bg-[#FF6B00] hover:bg-[#FF8533]">
            <Plus className="mr-2 h-4 w-4" />
            إضافة خدمة جديدة
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockServices.map((service) => (
            <Card
              key={service.id}
              className="border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-4xl">{service.icon}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
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
                  {service.title}
                </h3>
                <p className="text-gray-400">{service.description}</p>

                <div className="mt-4">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs ${service.status === "active" ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}`}
                  >
                    {service.status === "active" ? "نشط" : "مسودة"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ServicesPage;
