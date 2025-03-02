import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";

const UserProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleProfileClick = () => {
    navigate("/dashboard/profile");
  };

  const handleSettingsClick = () => {
    navigate("/dashboard/settings");
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U";
    
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    } else if (firstName) {
      return firstName[0];
    } else {
      return user.email[0].toUpperCase();
    }
  };

  // Get user role text
  const getUserRole = () => {
    if (!user) return "";
    return user.is_admin ? "مدير" : "مستخدم";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 pr-3 hover:bg-white/10">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt={user?.first_name || "User"} />
          <AvatarFallback className="bg-[#FF6B00]/10 text-[#FF6B00]">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        {user && (
          <div className="text-right">
            <p className="text-sm font-medium">
              {user.first_name
                ? `${user.first_name} ${user.last_name || ""}`
                : user.email}
            </p>
            <p className="text-xs text-gray-400">{getUserRole()}</p>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-[#0B1340] border-white/10 text-white">
        <DropdownMenuLabel>حسابي</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleProfileClick}
        >
          <User className="h-4 w-4" />
          <span>الملف الشخصي</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleSettingsClick}
        >
          <Settings className="h-4 w-4" />
          <span>الإعدادات</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          className="flex items-center gap-2 text-red-500 cursor-pointer" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;