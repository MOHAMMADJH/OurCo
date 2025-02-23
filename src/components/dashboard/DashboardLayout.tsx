import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Briefcase,
  Building2,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "لوحة التحكم",
    href: "/dashboard",
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    label: "الخدمات",
    href: "/dashboard/services",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "المشاريع",
    href: "/dashboard/projects",
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    label: "العملاء",
    href: "/dashboard/clients",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "المدونة",
    href: "/dashboard/blog",
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    label: "الرسائل",
    href: "/dashboard/messages",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "المستخدمين",
    href: "/dashboard/users",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "الإعدادات",
    href: "/dashboard/settings",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0B1340] text-white">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full flex-col border-l border-white/10 bg-[#0B1340]/95 backdrop-blur-xl transition-all",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          {!isSidebarCollapsed && (
            <span className="text-xl font-bold">لوحة التحكم</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {sidebarItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.icon}
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            {!isSidebarCollapsed && <span>تسجيل الخروج</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all",
          isSidebarCollapsed ? "mr-20" : "mr-[280px]",
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
