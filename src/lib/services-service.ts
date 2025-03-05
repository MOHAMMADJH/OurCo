import axios from 'axios';
import { authService } from './auth-service';

const API_BASE_URL = 'http://localhost:8000';

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  image: string | null;
  icon: string | null;
  category: ServiceCategory | null;
  price: number | null;
  price_suffix: string | null;
  features: string | null;
  features_list?: string[];
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at?: string;
}

export interface ServiceCreateUpdate {
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  image?: File | null;
  icon?: string;
  category_id?: string | null;
  price?: number | null;
  price_suffix?: string | null;
  features?: string | null;
  is_featured?: boolean;
  order?: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_position: string | null;
  client_company: string | null;
  client_image: string | null;
  content: string;
  rating: number;
  is_featured: boolean;
  created_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

class ServicesService {
  private async getAuthHeader() {
    try {
      let token = authService.getToken();
      if (!token) {
        token = await authService.refreshAccessToken();
      }
      if (!token) {
        // Instead of redirecting immediately, try to refresh token first
        token = await authService.refreshAccessToken();
        if (!token) {
          window.location.href = '/auth/login';
          throw new Error('No authentication token available');
        }
      }
      return { Authorization: `Bearer ${token}` };
    } catch (error) {
      console.error('Authentication error:', error);
      window.location.href = '/auth/login';
      throw new Error('Authentication failed');
    }
  }

  async getServices(): Promise<Service[]> {
    try {
      const response = await axios.get<{ results: Service[] }>(`${API_BASE_URL}/api/services/`, {
        headers: await this.getAuthHeader()
      });
      return response.data.results || [];
    } catch (error) {
      console.error('Error fetching services', error);
      throw new Error('Failed to fetch services');
    }
  }

  async getService(slug: string): Promise<Service> {
    try {
      const response = await axios.get<Service>(`${API_BASE_URL}/api/services/${slug}/`, {
        headers: await this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching service ${slug}`, error);
      throw new Error('Failed to fetch service');
    }
  }

  async createService(data: ServiceCreateUpdate): Promise<Service> {
    try {
      // Handle file uploads by using FormData
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await axios.post<Service>(`${API_BASE_URL}/api/services/`, formData, {
        headers: {
          ...(await this.getAuthHeader()),
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating service', error);
      throw new Error('Failed to create service');
    }
  }

  async updateService(slug: string, data: ServiceCreateUpdate): Promise<Service> {
    try {
      // Handle file uploads by using FormData
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await axios.put<Service>(`${API_BASE_URL}/api/services/${slug}/`, formData, {
        headers: {
          ...(await this.getAuthHeader()),
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating service ${slug}`, error);
      throw new Error('Failed to update service');
    }
  }

  async deleteService(slug: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/api/services/${slug}/`, {
        headers: await this.getAuthHeader()
      });
    } catch (error) {
      console.error(`Error deleting service ${slug}`, error);
      throw new Error('Failed to delete service');
    }
  }

  async getCategories(): Promise<ServiceCategory[]> {
    try {
      const response = await axios.get<{ results: ServiceCategory[] }>(`${API_BASE_URL}/api/services/categories/`, {
        headers: await this.getAuthHeader()
      });
      return response.data.results || [];
    } catch (error) {
      console.error('Error fetching service categories', error);
      throw new Error('Failed to fetch service categories');
    }
  }

  async createCategory(data: Omit<ServiceCategory, 'id' | 'created_at'>): Promise<ServiceCategory> {
    try {
      const response = await axios.post<ServiceCategory>(`${API_BASE_URL}/api/services/categories/`, data, {
        headers: await this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating service category', error);
      throw new Error('Failed to create service category');
    }
  }

  async updateCategory(slug: string, data: Partial<Omit<ServiceCategory, 'id' | 'created_at'>>): Promise<ServiceCategory> {
    try {
      const response = await axios.put<ServiceCategory>(`${API_BASE_URL}/api/services/categories/${slug}/`, data, {
        headers: await this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating service category ${slug}`, error);
      throw new Error('Failed to update service category');
    }
  }

  async deleteCategory(slug: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/api/services/categories/${slug}/`, {
        headers: await this.getAuthHeader()
      });
    } catch (error) {
      console.error(`Error deleting service category ${slug}`, error);
      throw new Error('Failed to delete service category');
    }
  }

  async seedDefaultServices(): Promise<void> {
    // First, fetch all existing categories to check against
    let existingCategories: ServiceCategory[] = [];
    try {
      existingCategories = await this.getCategories();
    } catch (error) {
      console.error('Error fetching existing categories:', error);
      // Continue with empty array if fetching fails
    }

    const defaultServicesData = [
      {
        category: {
          name: "صناعة الإعلانات المرئية",
          slug: "video-advertising",
          icon: "🎥"
        },
        services: [
          {
            title: "صناعة الإعلانات المرئية",
            slug: "video-advertising-production",
            description: "نحن نصنع محتويات إعلانية احترافية لتعزيز حضور علامتك التجارية.",
            short_description: "نحن نصنع محتويات إعلانية احترافية",
            icon: "🎥",
            is_featured: true,
            features: "تصوير احترافي\nمونتاج متميز\nمؤثرات بصرية\nتصحيح الألوان\nصناعة المحتوى"
          }
        ]
      },
      {
        category: {
          name: "تطوير المواقع",
          slug: "web-development",
          icon: "💻"
        },
        services: [
          {
            title: "برمجة المواقع الإلكترونية",
            slug: "web-development-service",
            description: "نصمم ونطور مواقع الويب الاحترافية لتلبية احتياجات عملك.",
            short_description: "نصمم ونطور مواقع الويب الاحترافية",
            icon: "💻",
            is_featured: true,
            features: "تصميم متجاوب\nتحسين محركات البحث\nلوحة تحكم سهلة\nتكامل وسائل التواصل الاجتماعي\nدعم فني متواصل"
          }
        ]
      },
      {
        category: {
          name: "التسويق بالمؤثرين",
          slug: "influencer-marketing",
          icon: "🌟"
        },
        services: [
          {
            title: "التسويق بالمؤثرين",
            slug: "influencer-marketing-service",
            description: "نقدم لك شبكة واسعة من المؤثرين لتعزيز وصول علامتك التجارية.",
            short_description: "نقدم لك شبكة واسعة من المؤثرين",
            icon: "🌟",
            is_featured: true,
            features: "شبكة مؤثرين واسعة\nحملات مخصصة\nتحليل النتائج\nاختيار المؤثرين المناسبين\nتقارير أداء"
          }
        ]
      },
      {
        category: {
          name: "تطوير العلامات التجارية",
          slug: "brand-development",
          icon: "✨"
        },
        services: [
          {
            title: "تطوير العلامات التجارية",
            slug: "brand-development-service",
            description: "نطور هويتك البصرية بشكل احترافي لتميز علامتك التجارية.",
            short_description: "نطور هويتك البصرية بشكل احترافي",
            icon: "✨",
            is_featured: true,
            features: "تصميم الهوية\nاستراتيجية العلامة\nتطوير الشعار\nاختيار الألوان\nدليل الهوية"
          }
        ]
      },
      {
        category: {
          name: "تحسين محركات البحث",
          slug: "seo",
          icon: "🔍"
        },
        services: [
          {
            title: "تحسين محركات البحث",
            slug: "seo-optimization",
            description: "نضمن لك الظهور في نتائج البحث من خلال تحسين محركات البحث.",
            short_description: "نضمن لك الظهور في نتائج البحث",
            icon: "🔍",
            is_featured: true,
            features: "تحليل الكلمات المفتاحية\nتحسين المحتوى\nبناء الروابط\nتحليل المنافسين\nتقارير شهرية"
          }
        ]
      },
      {
        category: {
          name: "إدارة وسائل التواصل",
          slug: "social-media",
          icon: "📱"
        },
        services: [
          {
            title: "إدارة وسائل التواصل",
            slug: "social-media-management",
            description: "نقدم محتوى متميز لمنصاتك الاجتماعية لتعزيز تواجدك الرقمي.",
            short_description: "نقدم محتوى متميز لمنصاتك",
            icon: "📱",
            is_featured: true,
            features: "إدارة المحتوى\nجدولة المنشورات\nتفاعل مع الجمهور\nتحليل الأداء\nتقارير دورية"
          }
        ]
      },
      {
        category: {
          name: "تصميم الجرافيك",
          slug: "graphic-design",
          icon: "🎨"
        },
        services: [
          {
            title: "تصميم الجرافيك",
            slug: "graphic-design-service",
            description: "نصمم هويتك البصرية بإبداع لتميز علامتك التجارية.",
            short_description: "نصمم هويتك البصرية بإبداع",
            icon: "🎨",
            is_featured: true,
            features: "تصميم الشعارات\nتصميم المطبوعات\nتصميم وسائل التواصل\nتصميم الإعلانات\nتصميم المواقع"
          }
        ]
      },
      {
        category: {
          name: "التصوير الاحترافي",
          slug: "professional-photography",
          icon: "📸"
        },
        services: [
          {
            title: "التصوير الاحترافي",
            slug: "professional-photography-service",
            description: "نقدم خدمات تصوير عالية الجودة لإبراز منتجاتك وخدماتك.",
            short_description: "نقدم خدمات تصوير عالية الجودة",
            icon: "📸",
            is_featured: true,
            features: "تصوير المنتجات\nتصوير الفعاليات\nتصوير المطاعم\nتصوير العقارات\nتصوير الأزياء"
          }
        ]
      }
    ];

    try {
      for (const categoryData of defaultServicesData) {
        // Check if category already exists
        let category = existingCategories.find(c => c.slug === categoryData.category.slug);
        
        if (!category) {
          // Create new category only if it doesn't exist
          try {
            category = await this.createCategory({
              name: categoryData.category.name,
              slug: categoryData.category.slug,
              icon: categoryData.category.icon,
              description: null
            });
          } catch (error) {
            console.error(`Error creating category ${categoryData.category.slug}:`, error);
            continue; // Skip this category and its services if creation fails
          }
        }

        // Create services for this category
        for (const serviceData of categoryData.services) {
          try {
            await this.createService({
              ...serviceData,
              category_id: category.id
            });
          } catch (error) {
            console.error(`Error creating service ${serviceData.slug}:`, error);
            // Continue with next service if one fails
            continue;
          }
        }
      }

      console.log('Successfully seeded default services and categories');
    } catch (error) {
      console.error('Error seeding default services:', error);
      throw new Error('Failed to seed default services');
    }
  }
}

export const servicesService = new ServicesService();
