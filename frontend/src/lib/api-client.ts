import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'instructor' | 'student' | 'leadership';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface DashboardResponse {
  success: boolean;
  data: any;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor to add token
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          Cookies.remove('token');
          window.location.href = '/auth/signin';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    role: string;
  }): Promise<AuthResponse> {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.client.post('/auth/login', credentials);

    // Set token in cookies
    if (response.data.success && response.data.data.token) {
      Cookies.set('token', response.data.data.token, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }

    return response.data;
  }

  async getMe(): Promise<{ success: boolean; data: { user: User } }> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await this.client.post('/auth/logout');
    Cookies.remove('token');
    return response.data;
  }

  async getDashboard(): Promise<DashboardResponse> {
    const response = await this.client.get('/auth/dashboard');
    return response.data;
  }

  // Generic CRUD operations
  async get<T>(url: string): Promise<{ success: boolean; data: T }> {
    const response = await this.client.get(url);
    return response.data;
  }

  async post<T>(url: string, data: any): Promise<{ success: boolean; data: T }> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data: any): Promise<{ success: boolean; data: T }> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<{ success: boolean; data: T }> {
    const response = await this.client.delete(url);
    return response.data;
  }

  // File upload
  async uploadFile(url: string, file: File, additionalData: Record<string, any> = {}): Promise<{ success: boolean; data: any }> {
    const formData = new FormData();
    formData.append('file', file);

    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const response = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;