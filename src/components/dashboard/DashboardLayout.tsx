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
  FolderKanban,
} from "lucide-react";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";

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
    icon: <FolderKanban className="h-5 w-5" />,
    label: "المشاريع",
    href: "/dashboard/projects",
  },
  {
    icon: <Briefcase className="h-5 w-5" />,
    label: "الخدمات",
    href: "/dashboard/services",
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
  const location = useLocation();

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
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/10",
                location.pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:text-white",
              )}
            >
              {item.icon}
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </Link>
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
