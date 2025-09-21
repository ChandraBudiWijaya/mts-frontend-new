/**
 * features/users/services/api.ts
 * ------------------------------------------------------------
 * Abstraksi akses API untuk feature Users.
 * Tujuan: satu pintu pemanggilan API (CRUD user, roles, options),
 * supaya komponen/hook tidak tergantung langsung ke shared api.
 */
import { employeeAPI, rbacAPI, parametersAPI, masterDataAPI } from '@/shared/api';

export const usersApi = {
  list: (params?: any) => employeeAPI.getAll(params),
  create: (body: any) => employeeAPI.create(body),
  update: (id: number | string, body: any) => employeeAPI.update(id, body),
  remove: (id: number | string) => employeeAPI.delete(id),
  uploadPhoto: (id: number | string, file: File) => employeeAPI.updatePhoto(id, file),
  roles: () => rbacAPI.getAllRoles(),
  pgOptions: () => masterDataAPI.getPlantationGroups(),
  wilayahOptions: () => masterDataAPI.getWilayah(),
  positions: () => parametersAPI.getPositions(),
};
