import axios, { AxiosError } from 'axios';
import type { 
  LoginCredentials, 
  AuthResponse, 
  Employee, 
  EmployeeForm,
  Location,
  Geofence,
  GeofenceForm,
  WorkPlan,
  WorkPlanForm,
  LiveTracking,
  DashboardStats,
  VisitReport,
  PaginatedResponse,
  EmployeeFilter,
  ReportFilter
} from '../types';

// Additional filter types for APIs
interface LocationFilter {
  plantation_group?: string;
  block?: string;
  is_active?: boolean;
}

interface GeofenceFilter {
  plantation_group?: string;
  block?: string;
  type?: 'polygon' | 'circle';
  is_active?: boolean;
}

interface WorkPlanFilter {
  user_id?: number;
  geofence_id?: number;
  status?: string;
  plan_date?: string;
}

interface LiveTrackingFilter {
  user_id?: number;
  start_time?: string;
  end_time?: string;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials: LoginCredentials) => 
    api.post<AuthResponse>('/login', credentials),
  
  logout: () => 
    api.post('/logout'),
  
  getUser: () => 
    api.get('/user'),
};

// Employee API
export const employeeAPI = {
  getAll: (params?: EmployeeFilter) => 
    api.get<PaginatedResponse<Employee>>('/employees', { params }),
  
  getById: (id: number) => 
    api.get<Employee>(`/employees/${id}`),
  
  create: (data: EmployeeForm) => 
    api.post<Employee>('/employees', data),
  
  update: (id: number, data: Partial<EmployeeForm>) => 
    api.put<Employee>(`/employees/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/employees/${id}`),
};

// Location API
export const locationsAPI = {
  getAll: (params?: LocationFilter) => 
    api.get<PaginatedResponse<Location>>('/locations', { params }),
  
  getById: (id: string) => 
    api.get<Location>(`/locations/${id}`),
  
  create: (data: Partial<Location>) => 
    api.post<Location>('/locations', data),
  
  update: (id: string, data: Partial<Location>) => 
    api.put<Location>(`/locations/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/locations/${id}`),
};

// Geofence API
export const geofenceAPI = {
  getAll: (params?: GeofenceFilter) => 
    api.get<PaginatedResponse<Geofence>>('/geofences', { params }),
  
  getById: (id: number) => 
    api.get<Geofence>(`/geofences/${id}`),
  
  create: (data: GeofenceForm) => 
    api.post<Geofence>('/geofences', data),
  
  update: (id: number, data: Partial<GeofenceForm>) => 
    api.put<Geofence>(`/geofences/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/geofences/${id}`),
};

// Work Plan API
export const workPlanAPI = {
  getAll: (params?: WorkPlanFilter) => 
    api.get<PaginatedResponse<WorkPlan>>('/work-plans', { params }),
  
  getById: (id: number) => 
    api.get<WorkPlan>(`/work-plans/${id}`),
  
  create: (data: WorkPlanForm) => 
    api.post<WorkPlan>('/work-plans', data),
  
  update: (id: number, data: Partial<WorkPlanForm>) => 
    api.put<WorkPlan>(`/work-plans/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/work-plans/${id}`),
  
  updateStatus: (id: number, status: string) => 
    api.patch(`/work-plans/${id}/status`, { status }),
};

// Live Tracking API
export const liveTrackingAPI = {
  getCurrent: (params?: LiveTrackingFilter) => 
    api.get<LiveTracking[]>('/live-tracking', { params }),
  
  getHistory: (userId: number, params?: LiveTrackingFilter) => 
    api.get<LiveTracking[]>(`/live-tracking/history/${userId}`, { params }),
};

// Dashboard & Reports API
export const dashboardAPI = {
  getStats: (params?: ReportFilter) => 
    api.get<DashboardStats>('/reports/dashboard', { params }),
  
  getVisitDetails: (params?: ReportFilter) => 
    api.get<PaginatedResponse<VisitReport>>('/reports/visits', { params }),
  
  exportVisits: (params?: ReportFilter) => 
    api.get('/reports/visits/export', { 
      params,
      responseType: 'blob'
    }),
};

// Parameters API (for dropdowns and options)
export const parametersAPI = {
  getPlantationGroups: () => 
    api.get<string[]>('/parameters/plantation-groups'),
  
  getBlocks: (plantationGroup?: string) => 
    api.get<string[]>('/parameters/blocks', { 
      params: { plantation_group: plantationGroup } 
    }),
  
  getSubblocks: (plantationGroup?: string, block?: string) => 
    api.get<string[]>('/parameters/subblocks', { 
      params: { plantation_group: plantationGroup, block } 
    }),
  
  getPositions: () => 
    api.get<string[]>('/parameters/positions'),
};

export default api;
