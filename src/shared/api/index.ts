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
  Role,
  Permission,
  ReportFilter,
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
    const token = localStorage.getItem('mts_token');
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
      localStorage.removeItem('mts_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Show a user-friendly access denied message without redirect
      // The backend must still enforce permissions via middleware
      try {
        // Avoid multiple alerts flooding
        if (!(window as any).__MTS_LAST_403__ || Date.now() - (window as any).__MTS_LAST_403__ > 1500) {
          (window as any).__MTS_LAST_403__ = Date.now();
          window.alert('Anda tidak punya akses');
        }
      } catch {}
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

  // Upload/update employee photo (multipart/form-data)
  updatePhoto: (id: number, file: File | Blob) => {
    const form = new FormData();
    form.append('photo', file);
    return api.post(`/employees/${id}/photo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
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

  // Sync DWH trigger (requires permission: sync-geofences)
  syncDwhLocations: () =>
    api.post('/sync/dwh-locations'),
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
  
  // Approve endpoint (requires permission: approve-work-plans)
  approve: (id: number) =>
    api.post(`/work-plans/${id}/approve`),
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

// Master Data API (for dropdowns and options) - sesuai dokumentasi
export const masterDataAPI = {
  // Get all master data sekaligus
  getAll: () =>
    api.get<{
      wilayah: Array<{value: string, label: string}>;
      plantation_groups: Array<{value: string, label: string}>;
    }>('/master-data/all'),

  // Get master data individual
  getWilayah: () => 
    api.get<{data: Array<{value: string, label: string}>}>('/master-data/wilayah'),
  
  getPlantationGroups: () => 
    api.get<{data: Array<{value: string, label: string}>}>('/master-data/plantation-groups'),

  // Get lokasi berdasarkan wilayah atau PG
  getLokasiByWilayah: (wilayah: string) =>
    api.get<{data: Array<{value: string, label: string}>}>(`/master-data/lokasi/by-wilayah?wilayah=${wilayah}`),

  getLokasiByPg: (pg: string) =>
    api.get<{data: Array<{value: string, label: string}>}>(`/master-data/lokasi/by-pg?pg=${pg}`),
};

// RBAC API: roles and permissions
export const rbacAPI = {
  // Roles management
  getAllRoles: () => 
    api.get<PaginatedResponse<Role>>('/roles'),
  
  getRoleById: (id: number) => 
    api.get<{data: Role}>(`/roles/${id}`),
  
  createRole: (data: { name: string; permissions: number[] }) => 
    api.post<{data: Role}>('/roles', data),
  
  updateRole: (id: number, data: { name: string; permissions: number[] }) => 
    api.put<{data: Role}>(`/roles/${id}`, data),
  
  deleteRole: (id: number) => 
    api.delete(`/roles/${id}`),

  // Permissions management
  getAllPermissions: () => 
    api.get<{data: Permission[]}>('/permissions'),
};

// Legacy Parameters API (keep for backward compatibility)
export const parametersAPI = {
  // Generic parameter endpoints (align with Laravel routes)
  getAll: (params?: Record<string, unknown>) =>
    api.get('/parameters', { params }),

  getById: (id: number) =>
    api.get(`/parameters/${id}`),

  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/parameters/${id}`, data),

  getGroups: () =>
    api.get('/parameters/groups'),

  // Mobile settings endpoint
  getMobileSettings: () =>
    api.get('/mobile/settings'),

  // Legacy endpoints - akan diarahkan ke masterDataAPI
  getPlantationGroups: () => 
    masterDataAPI.getPlantationGroups().then(res => ({ data: res.data.data.map(item => item.value) })),
  
  getBlocks: (plantationGroup?: string) => 
    api.get<string[]>('/parameters/blocks', { 
      params: { plantation_group: plantationGroup } 
    }),
  
  getSubblocks: (plantationGroup?: string, block?: string) => 
    api.get<string[]>('/parameters/subblocks', { 
      params: { plantation_group: plantationGroup, block } 
    }),
  
  getWilayah: () => 
    masterDataAPI.getWilayah().then(res => ({ data: res.data.data.map(item => item.value) })),
  
  getPositions: () => 
    api.get<string[]>('/parameters/positions'),
};

export default api;
