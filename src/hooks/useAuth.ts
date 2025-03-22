import { create } from 'zustand';
import { authService } from '@/lib/auth-service';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (userData: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
  }) => Promise<User>;
  logout: () => void;
  setAdminStatus: (isAdmin: boolean) => void;
  getToken: () => string | null;
}

export const useAuth = create<AuthState>((set, get) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('accessToken'),

  login: async (credentials) => {
    const user = await authService.login(credentials);
    const token = authService.getToken();

    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    set({ isAuthenticated: true, user, token });
    return user;
  },

  register: async (userData) => {
    const user = await authService.register(userData);
    const token = authService.getToken();

    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    set({ isAuthenticated: true, user, token });
    return user;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null, token: null });
  },

  setAdminStatus: (isAdmin: boolean) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (currentUser) {
      // تحديث حقل is_admin وحقل role أيضًا للتوافقية
      const updatedUser = { 
        ...currentUser, 
        is_admin: isAdmin,
        role: isAdmin ? "admin" : "user" 
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      console.log('Admin status updated:', isAdmin);
      console.log('Updated user:', updatedUser);
    }
  },

  getToken: () => {
    return get().token || localStorage.getItem('accessToken');
  }
}));