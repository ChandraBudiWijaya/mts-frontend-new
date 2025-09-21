import { useState, useCallback, useEffect, useMemo } from 'react';
import { rbacAPI } from '@/shared/api';
import { getErrorMessage } from '@/shared/utils/errorHandler';
import type { Role, Permission, RoleFormData } from '../types';
import { useDebounce } from '@/shared/hooks/useDebounce';

export function useRbac() {
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        rbacAPI.getAllRoles(),
        rbacAPI.getAllPermissions()
      ]);
      setAllRoles(rolesRes.data.data || []);
      setPermissions(permissionsRes.data.data || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat data RBAC.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Memo-isasi hasil filter untuk performa
  const roles = useMemo(() => {
    if (!debouncedSearchTerm) {
      return allRoles;
    }
    return allRoles.filter(role =>
      role.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [allRoles, debouncedSearchTerm]);

  // Fungsi CRUD yang sudah diimplementasikan
  const createRole = async (data: RoleFormData) => {
    try {
      await rbacAPI.createRole(data);
      await loadData(); // Muat ulang data setelah berhasil
    } catch (err) {
      // Lempar error agar bisa ditangkap oleh komponen modal
      throw new Error(getErrorMessage(err, 'Gagal membuat role'));
    }
  };

  const updateRole = async (id: number, data: RoleFormData) => {
    try {
      await rbacAPI.updateRole(id, data);
      await loadData(); // Muat ulang data setelah berhasil
    } catch (err) {
      throw new Error(getErrorMessage(err, 'Gagal memperbarui role'));
    }
  };
  
  const getRoleWithPermissions = async (id: number): Promise<Role> => {
    try {
        const response = await rbacAPI.getRoleById(id);
        return response.data.data;
    } catch (err) {
        setError(getErrorMessage(err, 'Gagal mengambil detail role'));
        // Kembalikan objek kosong atau lempar error jika gagal
        throw new Error('Gagal mengambil detail role');
    }
  }

  return {
    roles,
    permissions,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refresh: loadData,
    createRole,
    updateRole,
    getRoleWithPermissions,
  };
}

