// src/services/api.ts
// خدمة API المركزية للتعامل مع نقاط النهاية وإدارة المصادقة
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * عنوان API الأساسي - يتم استخدامه في جميع الطلبات
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mohjaspy.pythonanywhere.com';

/**
 * الخطأ المخصص لطلبات API
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * تكوين الإعدادات الافتراضية لـ axios
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * إضافة معترض للطلبات لإضافة رمز المصادقة
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    // تخزين الرمز في localStorage للاستخدام اللاحق
    localStorage.setItem('auth_token', token);
    // إعداد الرأس الافتراضي للطلبات
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // إزالة الرمز عند تسجيل الخروج
    localStorage.removeItem('auth_token');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * استعادة رمز المصادقة من التخزين المحلي عند بدء التطبيق
 */
export const initializeAuth = () => {
  const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
  if (token) {
    setAuthToken(token);
  }
};

/**
 * دالة عامة للتعامل مع طلبات GET
 */
export const apiGet = async <T>(endpoint: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(endpoint, { 
      params: { ...params, format: 'json' }, 
      ...config 
    });
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    throw error;
  }
};

/**
 * دالة عامة للتعامل مع طلبات POST
 */
export const apiPost = async <T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    throw error;
  }
};

/**
 * دالة عامة للتعامل مع طلبات PUT
 */
export const apiPut = async <T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    throw error;
  }
};

/**
 * دالة عامة للتعامل مع طلبات DELETE
 */
export const apiDelete = async <T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.delete(endpoint, config);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
    throw error;
  }
};

/**
 * معالجة أخطاء API بشكل موحد
 */
const handleApiError = (error: AxiosError) => {
  if (error.response) {
    // الخادم استجاب برمز حالة خارج نطاق 2xx
    const status = error.response.status;
    const data = error.response.data as Record<string, any>;
    
    // التعامل مع أخطاء المصادقة
    if (status === 401 || status === 403) {
      console.error('Authentication error:', error.message);
      // يمكن تنفيذ منطق إعادة التوجيه إلى صفحة تسجيل الدخول هنا
      // مثال: window.location.href = '/login';
    }
    
    throw new ApiError(
      data?.detail || data?.message || error.message || 'حدث خطأ في الخادم',
      status,
      data
    );
  } else if (error.request) {
    // تم إرسال الطلب لكن لم يتم استلام استجابة
    console.error('Network error:', error.message);
    throw new ApiError('لا يمكن الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.', 0);
  } else {
    // حدث خطأ أثناء إعداد الطلب
    console.error('Request error:', error.message);
    throw new ApiError('حدث خطأ أثناء إعداد الطلب.', 0);
  }
};

/**
 * دالة تسجيل الدخول
 */
export const login = async (username: string, password: string) => {
  const response = await apiPost<{ token: string; user: any }>('/api/auth/login/', { username, password });
  setAuthToken(response.token);
  return response;
};

/**
 * دالة تسجيل الخروج
 */
export const logout = () => {
  setAuthToken(null);
};

// تهيئة المصادقة عند استيراد هذا الملف
initializeAuth();
