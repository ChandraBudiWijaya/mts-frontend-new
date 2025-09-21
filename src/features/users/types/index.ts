// File: src/features/users/types/index.ts

// Tipe data ini menjadi satu-satunya sumber kebenaran untuk form user
export interface UserFormData {
  id: string; // employee ID
  name: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  role_id: number | '';
  position: string;
  plantation_group: string;
  wilayah: string;
  photoFile?: File | null;
  is_active: boolean;
}

// Tipe untuk filter
export interface UserFilters {
  plantation_group: string;
  name: string;
  role: string;
}
