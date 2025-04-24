import axios from 'axios';

import { API_BASE_URL } from '../lib/constants';

interface DashboardStatsResponse {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalUsers: number;
  activeUsers: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

interface RecentActivity {
  id: string;
  type: 'project' | 'user' | 'message' | 'report';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  dueDate: string | null;
  projectUrl: string;
  clientName: string;
}

interface Lead {
  id: string;
  name: string;
  source: string;
  addedDate: string;
  clientUrl: string;
}

interface FollowUp {
  id: string;
  clientName: string;
  dueDate: string;
  notes?: string;
  taskUrl: string;
}

export const fetchDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/stats/`);
  return response.data;
};

export const fetchQuickActions = async (): Promise<QuickAction[]> => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/quick-actions/`);
  return response.data;
};

export const fetchRecentActivities = async (): Promise<RecentActivity[]> => {
  const response = await axios.get(`${API_BASE_URL}/dashboard/recent-activities/`);
  return response.data;
};

export const fetchActiveProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/active-projects/`);
    const result: any = response.data;
    if (Array.isArray(result)) {
      return result;
    } else if (Array.isArray(result.projects)) {
      return result.projects;
    } else if (Array.isArray(result.results)) {
      return result.results;
    }
    return [];
  } catch (error) {
    console.error("Error fetching active projects:", error);

    // إذا كان هناك خطأ في الاتصال بالـ API، يمكننا إرجاع بيانات تجريبية مؤقتة
    // هذا مفيد أثناء التطوير أو عندما يكون الـ API غير متاح
    return [
      {
        id: "1",
        name: "تطوير موقع الشركة",
        status: "in progress",
        dueDate: "2023-12-30",
        projectUrl: "/projects/1",
        clientName: "شركة الاتصالات السعودية"
      },
      {
        id: "2",
        name: "تطبيق الجوال للمبيعات",
        status: "planning",
        dueDate: "2024-01-15",
        projectUrl: "/projects/2",
        clientName: "مجموعة الفطيم"
      },
      {
        id: "3",
        name: "نظام إدارة المخزون",
        status: "review",
        dueDate: "2023-12-10",
        projectUrl: "/projects/3",
        clientName: "شركة المراعي"
      }
    ];
  }
};

export const fetchRecentLeads = async (): Promise<Lead[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/recent-leads/`);
    const result: any = response.data;
    if (Array.isArray(result)) {
      return result;
    } else if (Array.isArray(result.leads)) {
      return result.leads;
    } else if (Array.isArray(result.results)) {
      return result.results;
    }
    return [];
  } catch (error) {
    console.error("Error fetching recent leads:", error);

    // بيانات تجريبية في حالة فشل الاتصال بالـ API
    return [
      {
        id: "l1",
        name: "مؤسسة الإبداع للتقنية",
        source: "معرض التقنية 2023",
        addedDate: "اليوم",
        clientUrl: "/dashboard/clients/l1"
      },
      {
        id: "l2",
        name: "شركة الأفق للاستشارات",
        source: "موقع الويب",
        addedDate: "أمس",
        clientUrl: "/dashboard/clients/l2"
      },
      {
        id: "l3",
        name: "مجموعة الخليج التجارية",
        source: "توصية عميل",
        addedDate: "منذ 3 أيام",
        clientUrl: "/dashboard/clients/l3"
      }
    ];
  }
};

export const fetchUpcomingFollowups = async (): Promise<FollowUp[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/upcoming-followups/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming followups:", error);

    // بيانات تجريبية في حالة فشل الاتصال بالـ API
    return [
      {
        id: "f1",
        clientName: "شركة النجاح",
        dueDate: "غداً",
        notes: "مناقشة العرض الجديد",
        taskUrl: "/dashboard/tasks/f1"
      },
      {
        id: "f2",
        clientName: "متجر الأفكار",
        dueDate: "بعد 3 أيام",
        notes: "متابعة طلب التسعير",
        taskUrl: "/dashboard/tasks/f2"
      },
      {
        id: "f3",
        clientName: "مؤسسة الريادة",
        dueDate: "الأسبوع القادم",
        notes: "عرض الخدمات الجديدة",
        taskUrl: "/dashboard/tasks/f3"
      }
    ];
  }
};