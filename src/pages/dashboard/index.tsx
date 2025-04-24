import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import ProjectPipelineWidget from "@/components/dashboard/ProjectPipelineWidget";
import CRMSnippetsWidget from "@/components/dashboard/CRMSnippetsWidget";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader
        title="لوحة التحكم الرئيسية"
        subtitle="نظرة عامة على أنشطة الوكالة"
      />

      <div className="space-y-8 p-6">
        {/* Stats - تم تحديثها */}
        <DashboardStats />

        {/* Project Pipeline - المكون الجديد */}
        <ProjectPipelineWidget />

        {/* CRM Snippets - المكون الجديد */}
        <CRMSnippetsWidget />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
