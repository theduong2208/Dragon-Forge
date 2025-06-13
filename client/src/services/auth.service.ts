import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';

export interface User {
  id: string;
  username: string;
  email: string;
  telegramId: string;
  registrationDate: string;
  coins: number;
  diamonds: number;
  level: number;
  experience: number;
  stats: {
    totalCoinsEarned: number;
    totalDiamondsEarned: number;
    dragonsCreated: number;
    missionsCompleted: number;
    loginDays: number;
    lastLogin: string;
  };
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private currentUser: User | null = null;
  private requestInterceptor: number | null = null;
  private responseInterceptor: number | null = null;

  private constructor() {
    this.initializeFromStorage();
    this.setupAxiosInterceptors();
  }

  private initializeFromStorage() {
    // Safely load token and user from localStorage
    try {
      this.token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      this.clearStorage();
    }
  }

  private clearStorage() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private setupAxiosInterceptors() {
    // Remove existing interceptors if they exist
    if (this.requestInterceptor !== null) {
      axios.interceptors.request.eject(this.requestInterceptor);
    }
    if (this.responseInterceptor !== null) {
      axios.interceptors.response.eject(this.responseInterceptor);
    }

    // Request interceptor
    this.requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = this.token || localStorage.getItem('token');
        if (token && config.url?.includes(API_URL)) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('Authentication failed, logging out...');
          this.logout();
          
          // Only redirect if not already on auth pages
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      // Clear any existing auth data before registration
      this.clearStorage();
      
      const response = await axios.post<AuthResponse>(`${API_URL}/register`, {
        username,
        email,
        password
      });
      
      const { token, user } = response.data;
      if (token && user) {
        this.setToken(token);
        this.setUser(user);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Clear any existing auth data before login
      this.clearStorage();
      
      const response = await axios.post<AuthResponse>(`${API_URL}/login`, {
        email,
        password
      });
      
      const { token, user, success } = response.data;
      
      if (success && token && user) {
        this.setToken(token);
        this.setUser(user);
        console.log('Login successful, token set');
        return response.data;
      } else {
        const error = new Error(response.data.message || 'Login failed');
        throw error;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this.clearStorage();
      
      // Throw a more informative error
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error('Login failed. Please check your connection and try again.');
      }
    }
  }

  logout(): void {
    console.log('Logging out...');
    this.clearStorage();
    
    // Clear axios default headers
    if (axios.defaults.headers.common) {
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  isAuthenticated(): boolean {
    const token = this.token || localStorage.getItem('token');
    
    if (!token) {
      return false;
    }

    try {
      // Validate JWT token structure
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.log('Invalid token format');
        this.logout();
        return false;
      }

      // Decode and check expiration
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && currentTime >= payload.exp) {
        console.log('Token expired');
        this.logout();
        return false;
      }

      // Ensure current user data is available
      if (!this.currentUser) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            this.currentUser = JSON.parse(userStr);
          } catch (error) {
            console.error('Error parsing user data:', error);
            this.logout();
            return false;
          }
        } else {
          console.log('No user data found');
          this.logout();
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      this.logout();
      return false;
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    return this.currentUser;
  }

  private setToken(token: string): void {
    this.token = token;
    try {
      localStorage.setItem('token', token);
      console.log('Token saved to localStorage');
    } catch (error) {
      console.error('Error saving token to localStorage:', error);
    }
  }

  private setUser(user: User): void {
    this.currentUser = user;
    try {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('User data saved to localStorage');
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  async getProfile(): Promise<User> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Not authenticated');
      }

      const response = await axios.get<User>(`${API_URL}/profile`);
      this.setUser(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.logout();
      }
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Not authenticated');
      }

      await axios.post(`${API_URL}/change-password`, {
        currentPassword,
        newPassword
      });
    } catch (error: any) {
      console.error('Change password error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.logout();
      }
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/reset-password`, {
        token,
        newPassword
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Method to refresh token if needed
  async refreshToken(): Promise<boolean> {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/refresh`);
      const { token, user } = response.data;
      
      if (token && user) {
        this.setToken(token);
        this.setUser(user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      return false;
    }
  }
}

// Export singleton instance
const authService = AuthService.getInstance();
export default authService;