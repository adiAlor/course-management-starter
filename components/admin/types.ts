// Common table cell types for admin tables
export interface UserActionsCellProps {
  user: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    is_active: boolean;
  };
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onToggleStatus: (user: any) => void;
}

export interface CourseActionsCellProps {
  course: {
    id: string;
    title: string;
    code: string;
    is_active?: boolean;
  };
  onEdit: (course: any) => void;
  onDelete: (course: any) => void;
}

export interface ClassActionsCellProps {
  classItem: {
    id: string;
    name: string;
    course: { title: string };
    cohort: { name: string };
  };
  onEdit: (classItem: any) => void;
  onDelete: (classItem: any) => void;
}

export interface CohortActionsCellProps {
  cohort: {
    id: string;
    name: string;
    is_active: boolean;
  };
  onEdit: (cohort: any) => void;
  onDelete: (cohort: any) => void;
  onToggleStatus: (cohort: any) => void;
}

export interface MaterialActionsCellProps {
  material: {
    id: string;
    title: string;
    file_name: string;
    file_type: string;
  };
  onEdit: (material: any) => void;
  onDelete: (material: any) => void;
  onDownload: (material: any) => void;
  onPreview: (material: any) => void;
}

// Form types
export interface UserFormData {
  username: string;
  email: string;
  full_name: string;
  password?: string;
  role: 'admin' | 'instructor' | 'student' | 'leadership';
  is_active: boolean;
}

export interface CourseFormData {
  title: string;
  description: string;
  code: string;
  credits: number;
  duration: number;
  prerequisites?: string;
}

export interface ClassFormData {
  name: string;
  course_id: string;
  cohort_id: string;
  instructor_id: string;
  schedule: string;
  room?: string;
}

export interface CohortFormData {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  capacity?: number;
  is_active: boolean;
}

export interface MaterialFormData {
  title: string;
  description?: string;
  course_id: string;
  is_visible: boolean;
  tags?: string[];
}

// Filter options
export interface FilterOption {
  value: string;
  label: string;
}

export interface UserFilters {
  role?: string;
  status?: string;
}

export interface CourseFilters {
  is_active?: string;
}

export interface ClassFilters {
  course_id?: string;
  cohort_id?: string;
}

export interface CohortFilters {
  is_active?: string;
}

export interface MaterialFilters {
  course_id?: string;
  file_type?: string;
}

// Pagination state
export interface PaginationState {
  page: number;
  limit: number;
}

// Common props for data tables
export interface DataTableBaseProps<T> {
  data: T[];
  loading: boolean;
  error?: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
  search: {
    value: string;
    onChange: (value: string) => void;
  };
  onRefresh: () => void;
}