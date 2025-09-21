// Menggunakan kembali tipe Role dan Permission dari shared
import type { Role, Permission } from '@/shared/types';

export interface RoleFormData {
  name: string;
  permissions: number[];
}

export type { Role, Permission };
