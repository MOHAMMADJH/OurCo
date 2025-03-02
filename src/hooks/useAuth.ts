import { create } from 'zustand';
import { authService } from '@/lib/auth-service';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
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
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),

  login: async (credentials) => {
    const user = await authService.login(credentials);
    const token = 'dummy-token'; // In real app, this would come from the backend

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    set({ isAuthenticated: true, user, token });
    return user;
  },

  register: async (userData) => {
    const user = await authService.register(userData);
    const token = 'dummy-token'; // In real app, this would come from the backend

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    set({ isAuthenticated: true, user, token });
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null, token: null });
  },
}));