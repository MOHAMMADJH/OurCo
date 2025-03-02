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
  Shield,
  UserCog,
  Edit2,
  Trash2,
  Key,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "inactive";
  lastLogin: string;
  permissions: string[];
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@ourco.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-15 10:30",
    permissions: ["all"],
  },
  {
    id: "2",
    name: "سارة خالد",
    email: "sarah@ourco.com",
    role: "editor",
    status: "active",
    lastLogin: "2024-01-14 15:45",
    permissions: ["content", "projects"],
  },
  {
    id: "3",
    name: "محمد علي",
    email: "mohammed@ourco.com",
    role: "viewer",
    status: "inactive",
    lastLogin: "2024-01-10 09:15",
    permissions: ["view"],
  },
];

const UsersPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="إدارة المستخدمين"
        subtitle="إدارة المستخدمين والصلاحيات"
      />

      <div className="p-6">
        <div className="mb-6 flex justify-between">
          <Button className="bg-[#FF6B00] hover:bg-[#FF8533]">
            <Plus className="mr-2 h-4 w-4" />
            إضافة مستخدم جديد
          </Button>

          <div className="relative w-64">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="بحث عن مستخدم..."
              className="border-white/10 bg-white/5 pr-10 text-right text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {mockUsers.map((user) => (
            <Card
              key={user.id}
              className="border-white/10 bg-white/5 text-white backdrop-blur-sm"
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B00]/10 text-[#FF6B00]">
                    <UserCog className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        {user.role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge
                    variant={user.status === "active" ? "default" : "secondary"}
                    className={user.status === "active" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
                  >
                    {user.status === "active" ? "نشط" : "غير نشط"}
                  </Badge>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default UsersPage;