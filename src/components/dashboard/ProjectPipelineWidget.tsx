import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { FolderKanban, AlertCircle, Loader2 } from 'lucide-react'; // أيقونات
import { fetchActiveProjects } from '@/services/dashboardAPI'; // استيراد خدمة dashboardAPI

// نوع بيانات المشروع المتوقع من الـ API
interface Project {
  id: string;
  name: string;
  status: string;
  dueDate: string | null;
  projectUrl: string; // رابط لتفاصيل المشروع
  clientName: string; // اسم العميل
}

// الدالة المساعدة لتحديد لون الـ Badge بناءً على حالة الـ API
const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  // قد تحتاج لتعديل هذه بناءً على القيم الفعلية من الـ API
  switch (status.toLowerCase()) { // تحويل النص إلى حالة صغيرة للمقارنة
    case 'planning': return 'secondary';
    case 'in progress': return 'default';
    case 'review': return 'destructive';
    case 'completed': return 'outline';
    default: return 'outline'; // حالة افتراضية
  }
};

const ProjectPipelineWidget = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // استخدام خدمة dashboardAPI الجديدة
        const data = await fetchActiveProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch active projects:", err);
        setError('فشل في تحميل المشاريع النشطة. يرجى المحاولة مرة أخرى لاحقًا.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []); // تشغيل مرة واحدة عند تحميل المكون

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-white flex items-center">
          <FolderKanban className="ms-2 h-5 w-5 text-blue-400" />
          المشاريع النشطة حالياً
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center items-center p-6">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
            <span className="me-2 text-gray-300">جار تحميل المشاريع...</span>
          </div>
        )}
        {error && (
          <div className="text-center p-6 text-red-500 flex items-center justify-center">
            <AlertCircle className="ms-2 h-5 w-5" />
            {error}
          </div>
        )}
        {!isLoading && !error && projects.length === 0 && (
          <p className="text-center text-gray-500 p-6">لا توجد مشاريع نشطة حالياً.</p>
        )}
        {!isLoading && !error && projects.length > 0 && (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-md bg-black/10 hover:bg-black/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <Link to={project.projectUrl} className="text-sm font-medium text-white hover:underline truncate block" title={project.name}>
                    {project.name}
                  </Link>
                  <p className="text-xs text-gray-400 truncate" title={project.clientName}>العميل: {project.clientName || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-3 mt-2 sm:mt-0 flex-shrink-0">
                  <Badge variant={getStatusBadgeVariant(project.status)} className="text-xs">
                    {project.status}
                  </Badge>
                  {project.dueDate && <span className="text-xs text-gray-500">تاريخ الاستحقاق: {project.dueDate}</span>}
                  <Link to={project.projectUrl} className="text-xs text-blue-400 hover:text-blue-300">
                    التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectPipelineWidget;
