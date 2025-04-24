import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon, Users, FolderKanban, MessageSquare, Target, AlertCircle, Loader2 } from 'lucide-react';
import { fetchDashboardStats } from '@/services/dashboardAPI'; // استيراد خدمة dashboardAPI

interface StatCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  description?: string;
  iconBgColor?: string;
  iconColor?: string;
  iconIsLoading?: boolean;
}

interface DashboardStats {
  activeProjects: number;
  newLeads: number;
  openTasks: number; 
  totalClients: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    newLeads: 0,
    openTasks: 0,
    totalClients: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // استخدام خدمة dashboardAPI الجديدة
        const data = await fetchDashboardStats();
        // تحويل البيانات إلى التنسيق المطلوب
        setStats({
          activeProjects: data.activeProjects || 0,
          newLeads: 0, // يمكن تعديل هذا حسب الاستجابة الفعلية
          openTasks: 0, // يمكن تعديل هذا حسب الاستجابة الفعلية
          totalClients: data.totalUsers || 0
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError('فشل في تحميل الإحصائيات. يرجى المحاولة مرة أخرى لاحقًا.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []); 

  const statCardsBase = [
    { title: "المشاريع النشطة", Icon: FolderKanban, dataKey: 'activeProjects' as keyof DashboardStats },
    { title: "عملاء محتملون جدد", Icon: Target, dataKey: 'newLeads' as keyof DashboardStats },
    { title: "المهام المفتوحة", Icon: MessageSquare, dataKey: 'openTasks' as keyof DashboardStats }, 
    { title: "إجمالي العملاء", Icon: Users, dataKey: 'totalClients' as keyof DashboardStats },
  ];

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCardsBase.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value="-"
            Icon={AlertCircle} 
            description={error}
            iconBgColor="bg-red-500/20"
            iconColor="text-red-500"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCardsBase.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={isLoading ? "..." : stats[card.dataKey].toLocaleString() ?? "-"}
          Icon={isLoading ? Loader2 : card.Icon} 
          iconIsLoading={isLoading} 
        />
      ))}
    </div>
  );
};

const StatCard = ({
  title,
  value,
  Icon,
  description,
  iconBgColor = 'bg-blue-500/20', 
  iconColor = 'text-blue-500',    
  iconIsLoading = false,
}: StatCardProps) => {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        <div className={`p-2 rounded-md ${iconBgColor}`}> 
          <Icon className={`h-4 w-4 ${iconColor} ${iconIsLoading ? 'animate-spin' : ''}`} /> 
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {description && <p className="text-xs text-muted-foreground text-red-500 pt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
