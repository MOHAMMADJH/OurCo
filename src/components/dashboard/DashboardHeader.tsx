import React from "react";
import { Bell, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1340]/95 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="بحث..."
              className="w-64 border-white/10 bg-white/5 pr-10 text-right text-white placeholder:text-gray-400"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-300 hover:text-white"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6B00] text-[10px]">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
