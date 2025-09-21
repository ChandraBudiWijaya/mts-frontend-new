// File: src/features/users/services/api.ts
import { employeeAPI, rbacAPI, parametersAPI, masterDataAPI } from '@/shared/api';
import type { EmployeeForm } from '@/shared/types';

export const usersApi = {
  list: (params?: any) => employeeAPI.getAll(params),
  // Perbarui fungsi create untuk menerima foto
  create: async (body: EmployeeForm, photoFile?: File | null) => {
    const res = await employeeAPI.create(body);
    const id = (res?.data?.id) ?? (res?.data as any)?.employee_id;
    if (id && photoFile) {
      try { 
        await employeeAPI.updatePhoto(id, photoFile); 
      } catch (photoError) {
        console.error("Failed to upload photo, but user was created:", photoError);
      }
    }
    return res;
  },
  update: (id: number | string, body: any) => employeeAPI.update(id, body),
  remove: (id: number | string) => employeeAPI.remove(id),
  roles: () => rbacAPI.getAllRoles(),
  pgOptions: () => masterDataAPI.getPlantationGroups(),
  wilayahOptions: () => masterDataAPI.getWilayah(),
  positions: () => parametersAPI.getPositions(),
};
