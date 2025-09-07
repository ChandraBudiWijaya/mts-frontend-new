// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  position: string;
  plantation_group: string;
  block: string;
  subblock: string;
  roles: Role[];
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  slug: string;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Employee Types
export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  plantation_group: string;
  block: string;
  subblock: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Location Types
export interface Location {
  id: number;
  name: string;
  address: string;
  description?: string;
  latitude: number;
  longitude: number;
  plantation_group: string;
  block: string;
  subblock: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Geofence Types
export interface Geofence {
  id: number;
  name: string;
  type: 'polygon' | 'circle';
  coordinates: GeofenceCoordinate[];
  plantation_group: string;
  block: string;
  subblock: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeofenceCoordinate {
  latitude: number;
  longitude: number;
}

// Work Plan Types
export interface WorkPlan {
  id: number;
  user_id: number;
  geofence_id: number;
  title: string;
  description: string;
  plan_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  user: Employee;
  geofence: Geofence;
  created_at: string;
  updated_at: string;
}

// Live Tracking Types
export interface LiveTracking {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  speed?: number;
  bearing?: number;
  user: Employee;
}

// Report Types
export interface DashboardStats {
  totalUserAktif: Array<{
    plantation_group: string;
    total: number;
  }>;
  totalLokasiTerkunjungi: Array<{
    plantation_group: string;
    total: number;
  }>;
  coveragePerMandor: Array<{
    name: string;
    total_coverage: string;
  }>;
  kunjunganPerWilayah: Array<{
    region: string;
    total_kunjungan: number;
  }>;
}

export interface VisitReport {
  id: number;
  user_id: number;
  geofence_id: number;
  visit_time: string;
  exit_time: string | null;
  duration_minutes: number | null;
  user: Employee;
  geofence: Geofence;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Form Types
export interface EmployeeForm {
  name: string;
  email: string;
  password?: string;
  position: string;
  plantation_group: string;
  block: string;
  subblock: string;
  is_active: boolean;
}

export interface GeofenceForm {
  name: string;
  type: 'polygon' | 'circle';
  coordinates: GeofenceCoordinate[];
  plantation_group: string;
  block: string;
  subblock: string;
  description?: string;
  is_active: boolean;
}

export interface WorkPlanForm {
  user_id: number;
  geofence_id: number;
  title: string;
  description: string;
  plan_date: string;
}

// Filter Types
export interface DateRangeFilter {
  start_date: string;
  end_date: string;
}

export interface EmployeeFilter extends DateRangeFilter {
  plantation_group?: string;
  block?: string;
  position?: string;
  is_active?: boolean;
}

export interface ReportFilter extends DateRangeFilter {
  user_id?: number;
  geofence_id?: number;
  plantation_group?: string;
}
