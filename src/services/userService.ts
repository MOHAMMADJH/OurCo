import axios from 'axios';
import { API_BASE_URL } from './api';

// نوع بيانات المستخدم
export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_admin: boolean;
  role: string;
  [key: string]: any; // لأي حقول إضافية
}

// الحصول على التوكن من localStorage أو hook المصادقة
function getAuthToken() {
  return localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
}

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

export const userService = {
  // جلب جميع المستخدمين
  async getAllUsers(): Promise<IUser[]> {
    const res = await axios.get(`${API_BASE_URL}/api/auth/admin/users/`, getAuthHeaders());
    return Array.isArray(res.data) ? res.data : res.data.results || [];
  },

  // إضافة مستخدم جديد
  async createUser(data: Partial<IUser>): Promise<IUser> {
    const res = await axios.post(`${API_BASE_URL}/api/auth/admin/users/`, data, getAuthHeaders());
    return res.data;
  },

  // تعديل بيانات مستخدم
  async updateUser(id: string, data: Partial<IUser>): Promise<IUser> {
    const res = await axios.patch(`${API_BASE_URL}/api/auth/admin/users/${id}/`, data, getAuthHeaders());
    return res.data;
  },

  // حذف مستخدم
  async deleteUser(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/auth/admin/users/${id}/`, getAuthHeaders());
  },

  // تفعيل/تعطيل مستخدم
  async toggleUserActive(id: string): Promise<IUser> {
    const res = await axios.post(`${API_BASE_URL}/api/auth/admin/users/${id}/toggle_active/`, {}, getAuthHeaders());
    return res.data;
  },

  // تغيير دور المستخدم
  async changeUserRole(id: string, role: string): Promise<IUser> {
    const res = await axios.post(`${API_BASE_URL}/api/auth/admin/users/${id}/change_role/`, { role }, getAuthHeaders());
    return res.data;
  },
};
