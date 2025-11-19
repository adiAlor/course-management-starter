import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        // Get token from cookies or localStorage
        const token = this.getAuthToken();
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
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/auth/signin';
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    // Try to get token from cookies first
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find(cookie =>
        cookie.trim().startsWith('auth_token=')
      );
      if (authCookie) {
        return authCookie.split('=')[1];
      }
    }

    // Fallback to localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }

    return null;
  }

  // Generic GET request
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  // Generic POST request
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  // Generic PUT request
  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  // Generic DELETE request
  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return response.data;
  }

  // File upload with progress
  async uploadFile<T>(
    url: string,
    file: File,
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const response = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Specific API endpoints
export const adminApi = {
  // Users
  getUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    apiClient.get<PaginatedResponse<any>>('/admin/users', params),
  createUser: (userData: any) => apiClient.post<ApiResponse<any>>('/admin/users', userData),
  updateUser: (id: string, userData: any) => apiClient.put<ApiResponse<any>>(`/admin/users/${id}`, userData),
  deleteUser: (id: string) => apiClient.delete<ApiResponse<any>>(`/admin/users/${id}`),

  // Courses
  getCourses: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<PaginatedResponse<any>>('/admin/courses', params),
  createCourse: (courseData: any) => apiClient.post<ApiResponse<any>>('/admin/courses', courseData),
  updateCourse: (id: string, courseData: any) => apiClient.put<ApiResponse<any>>(`/admin/courses/${id}`, courseData),
  deleteCourse: (id: string) => apiClient.delete<ApiResponse<any>>(`/admin/courses/${id}`),

  // Classes
  getClasses: (params?: { page?: number; limit?: number; search?: string; courseId?: string; cohortId?: string }) =>
    apiClient.get<PaginatedResponse<any>>('/admin/classes', params),
  createClass: (classData: any) => apiClient.post<ApiResponse<any>>('/admin/classes', classData),
  updateClass: (id: string, classData: any) => apiClient.put<ApiResponse<any>>(`/admin/classes/${id}`, classData),
  deleteClass: (id: string) => apiClient.delete<ApiResponse<any>>(`/admin/classes/${id}`),

  // Cohorts
  getCohorts: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<PaginatedResponse<any>>('/admin/cohorts', params),
  createCohort: (cohortData: any) => apiClient.post<ApiResponse<any>>('/admin/cohorts', cohortData),
  updateCohort: (id: string, cohortData: any) => apiClient.put<ApiResponse<any>>(`/admin/cohorts/${id}`, cohortData),
  deleteCohort: (id: string) => apiClient.delete<ApiResponse<any>>(`/admin/cohorts/${id}`),

  // Learning Materials
  getMaterials: (params?: { page?: number; limit?: number; search?: string; courseId?: string; type?: string }) =>
    apiClient.get<PaginatedResponse<any>>('/admin/materials', params),
  createMaterial: (materialData: any) => apiClient.post<ApiResponse<any>>('/admin/materials', materialData),
  updateMaterial: (id: string, materialData: any) => apiClient.put<ApiResponse<any>>(`/admin/materials/${id}`, materialData),
  deleteMaterial: (id: string) => apiClient.delete<ApiResponse<any>>(`/admin/materials/${id}`),
  uploadMaterial: (file: File, courseId: string, metadata: any, onProgress?: (progress: number) => void) =>
    apiClient.uploadFile<ApiResponse<any>>('/admin/materials/upload', file, { courseId, ...metadata }, onProgress),
};