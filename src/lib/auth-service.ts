import axios from 'axios';

const API_BASE_URL = 'https://mohjaspy.pythonanywhere.com';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_admin: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/api/auth/login/`, credentials);
      this.setAuthData(response.data);
      return response.data.user;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/api/auth/register/`, data);
      this.setAuthData(response.data);
      return response.data.user;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.refreshToken;
  }

  isAdmin(): boolean {
    return this.user?.is_admin ?? false;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  getUser(): User | null {
    return this.user;
  }

  private setAuthData(data: AuthResponse): void {
    this.accessToken = data.access;
    this.refreshToken = data.refresh;
    this.user = data.user;
    localStorage.setItem('accessToken', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  async refreshAccessToken(): Promise<string | null> {
    try {
      if (!this.refreshToken) return null;

      const response = await axios.post<{ access: string }>(
        `${API_BASE_URL}/api/auth/token/refresh/`,
        { refresh: this.refreshToken }
      );

      this.accessToken = response.data.access;
      localStorage.setItem('accessToken', response.data.access);
      return response.data.access;
    } catch (error) {
      this.logout();
      return null;
    }
  }
}

const authService = new AuthService();
export { authService, type User, type LoginCredentials, type RegisterData };