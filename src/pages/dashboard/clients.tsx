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
  Mail,
  Phone,
  MapPin,
  Building2,
  Edit2,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  type: "company" | "individual";
  status: "active" | "inactive";
  projectsCount: number;
  totalValue: string;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "شركة التقنية المتقدمة",
    company: "شركة التقنية المتقدمة",
    email: "info@techcompany.com",
    phone: "+966 12 345 6789",
    location: "الرياض، المملكة العربية السعودية",
    type: "company",
    status: "active",
    projectsCount: 3,
    totalValue: "150,000 ر.س",
  },
  {
    id: "2",
    name: "مؤسسة الإبداع",
    company: "مؤسسة الإبداع للحلول الرقمية",
    email: "contact@creative.com",
    phone: "+966 12 345 6788",
    location: "جدة، المملكة العربية السعودية",
    type: "company",
    status: "active",
    projectsCount: 2,
    totalValue: "80,000 ر.س",
  },
  {
    id: "3",
    name: "أحمد محمد",
    company: "مستقل",
    email: "ahmed@example.com",
    phone: "+966 12 345 6787",
    location: "الدمام، المملكة العربية السعودية",
    type: "individual",
    status: "inactive",
    projectsCount: 1,
    totalValue: "15,000 ر.س",
  },
];

const getStatusColor = (status: Client["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-500";
    case "inactive":
      return "bg-gray-500/10 text-gray-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const getStatusText = (status: Client["status"]) => {
  switch (status) {
    case "active":
      return "نشط";
    case "inactive":
      return "غير نشط";
    default:
      return status;
  }
};

const getTypeColor = (type: Client["type"]) => {
  switch (type) {
    case "company":
      return "bg-blue-500/10 text-blue-500";
    case "individual":
      return "bg-purple-500/10 text-purple-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
};

const getTypeText = (type: Client["type"]) => {
  switch (type) {
    case "company":
      return "شركة";
    case "individual":
      return "فرد";
    default:
      return type;
  }
};

const ClientsPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة العملاء"
        subtitle="عرض وإدارة جميع العملاء"
      />

      <div className="p-6">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="البحث عن عميل..."
              className="border-white/10 bg-white/5 pr-10 text-right text-white placeholder:text-gray-400"
            />
          </div>
          <Button className="bg-[#FF6B00] hover:bg-[#FF8533]">
            <Plus className="mr-2 h-4 w-4" />
            إضافة عميل جديد
          </Button>
        </div>

        {/* Clients Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockClients.map((client) => (
            <Card
              key={client.id}
              className="border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(client.status)}>
                      {getStatusText(client.status)}
                    </Badge>
                    <Badge className={getTypeColor(client.type)}>
                      {getTypeText(client.type)}
                    </Badge>
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
                  {client.name}
                </h3>
                <p className="mb-4 text-sm text-gray-400">{client.company}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Phone className="h-4 w-4" />
                    {client.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="h-4 w-4" />
                    {client.location}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">المشاريع</p>
                    <p className="text-lg font-bold text-white">
                      {client.projectsCount}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">القيمة الإجمالية</p>
                    <p className="text-lg font-bold text-white">
                      {client.totalValue}
                    </p>
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

export default ClientsPage;
