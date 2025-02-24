import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="لوحة التحكم"
        subtitle="مرحباً بك في لوحة التحكم"
      />

      <div className="space-y-8 p-6">
        {/* Stats */}
        <DashboardStats />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
