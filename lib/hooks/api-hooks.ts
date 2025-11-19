"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, ApiResponse, PaginatedResponse } from '@/lib/api-client';
import { showSuccessToast, showErrorToast } from '@/lib/toast-utils';

// Types (these should be adjusted based on your actual API response structure)
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'instructor' | 'student' | 'leadership';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  code: string;
  credits: number;
  duration: number;
  prerequisites?: string;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  name: string;
  course_id: string;
  cohort_id: string;
  instructor_id: string;
  schedule: string;
  room?: string;
  created_at: string;
  updated_at: string;
}

export interface Cohort {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  capacity?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  description?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  course_id: string;
  uploaded_by: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// Query keys for cache management
export const queryKeys = {
  users: ['users'] as const,
  courses: ['courses'] as const,
  classes: ['classes'] as const,
  cohorts: ['cohorts'] as const,
  materials: ['materials'] as const,
};

// ==================== USERS ====================

export const useGetUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string
}) => {
  return useQuery({
    queryKey: [...queryKeys.users, params],
    queryFn: () => adminApi.getUsers(params),
    staleTime: 60000, // 1 minute
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User>) => adminApi.createUser(userData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      showSuccessToast('User created successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to create user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) =>
      adminApi.updateUser(id, userData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      showSuccessToast('User updated successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to update user');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      showSuccessToast('User deleted successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to delete user');
    },
  });
};

// ==================== COURSES ====================

export const useGetCourses = (params?: {
  page?: number;
  limit?: number;
  search?: string
}) => {
  return useQuery({
    queryKey: [...queryKeys.courses, params],
    queryFn: () => adminApi.getCourses(params),
    staleTime: 60000,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData: Partial<Course>) => adminApi.createCourse(courseData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      showSuccessToast('Course created successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to create course');
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, courseData }: { id: string; courseData: Partial<Course> }) =>
      adminApi.updateCourse(id, courseData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      showSuccessToast('Course updated successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to update course');
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCourse(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      showSuccessToast('Course deleted successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to delete course');
    },
  });
};

// ==================== CLASSES ====================

export const useGetClasses = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: string;
  cohortId?: string
}) => {
  return useQuery({
    queryKey: [...queryKeys.classes, params],
    queryFn: () => adminApi.getClasses(params),
    staleTime: 60000,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classData: Partial<Class>) => adminApi.createClass(classData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes });
      showSuccessToast('Class created successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to create class');
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, classData }: { id: string; classData: Partial<Class> }) =>
      adminApi.updateClass(id, classData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes });
      showSuccessToast('Class updated successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to update class');
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteClass(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classes });
      showSuccessToast('Class deleted successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to delete class');
    },
  });
};

// ==================== COHORTS ====================

export const useGetCohorts = (params?: {
  page?: number;
  limit?: number;
  search?: string
}) => {
  return useQuery({
    queryKey: [...queryKeys.cohorts, params],
    queryFn: () => adminApi.getCohorts(params),
    staleTime: 60000,
  });
};

export const useCreateCohort = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cohortData: Partial<Cohort>) => adminApi.createCohort(cohortData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cohorts });
      showSuccessToast('Cohort created successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to create cohort');
    },
  });
};

export const useUpdateCohort = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cohortData }: { id: string; cohortData: Partial<Cohort> }) =>
      adminApi.updateCohort(id, cohortData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cohorts });
      showSuccessToast('Cohort updated successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to update cohort');
    },
  });
};

export const useDeleteCohort = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCohort(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cohorts });
      showSuccessToast('Cohort deleted successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to delete cohort');
    },
  });
};

// ==================== LEARNING MATERIALS ====================

export const useGetMaterials = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: string;
  type?: string
}) => {
  return useQuery({
    queryKey: [...queryKeys.materials, params],
    queryFn: () => adminApi.getMaterials(params),
    staleTime: 60000,
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (materialData: Partial<LearningMaterial>) => adminApi.createMaterial(materialData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials });
      showSuccessToast('Material created successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to create material');
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, materialData }: { id: string; materialData: Partial<LearningMaterial> }) =>
      adminApi.updateMaterial(id, materialData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials });
      showSuccessToast('Material updated successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to update material');
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteMaterial(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials });
      showSuccessToast('Material deleted successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to delete material');
    },
  });
};

export const useUploadMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      courseId,
      metadata,
      onProgress
    }: {
      file: File;
      courseId: string;
      metadata: any;
      onProgress?: (progress: number) => void
    }) => adminApi.uploadMaterial(file, courseId, metadata, onProgress),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materials });
      showSuccessToast('Material uploaded successfully');
    },
    onError: (error: any) => {
      showErrorToast(error.response?.data?.message || 'Failed to upload material');
    },
  });
};