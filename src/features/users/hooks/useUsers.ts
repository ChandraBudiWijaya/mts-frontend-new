/**
 * features/users/hooks/useUsers.ts
 * ------------------------------------------------------------
 * Hook state management untuk daftar user:
 * - data, loading/error, pagination, filters
 * - operasi CRUD (create/update/delete)
 * - fetch/refresh terpusat
 * Komponen halaman tinggal konsumsi hook ini.
 */
import { useCallback, useState } from 'react';
import { usersApi } from '../services/api';
import { normalizeApiList } from '../services/mappers';
import { getErrorMessage } from '@/shared/utils/errorHandler';
import type { Employee, EmployeeForm } from '@/shared/types';

export function useUsers() {
  const [data, setData] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState({ plantation_group: '', name: '', role: '' });

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await usersApi.list({
        plantation_group: filters.plantation_group || undefined,
        name: filters.name || undefined,
        role: filters.role || undefined,
        page, per_page: perPage,
      });
      const norm = normalizeApiList<Employee>(res.data);

      // guard local filter kalau backend belum support
      const filtered = norm.data.filter(u => {
        const byName = filters.name ? (u.name?.toLowerCase().includes(filters.name.toLowerCase())) : true;
        const byPg = filters.plantation_group ? (u.plantation_group === filters.plantation_group) : true;
        const byRole = filters.role ? (Array.isArray(u.roles) && u.roles.includes(filters.role)) : true;
        return byName && byPg && byRole;
      });

      setData(filtered);
      setTotal(typeof norm.total === 'number' ? norm.total : filtered.length);
      setError(null);
    } catch (e) {
      setData([]); setTotal(0);
      setError(getErrorMessage(e, 'Gagal memuat data karyawan'));
    } finally {
      setLoading(false);
    }
  }, [filters.plantation_group, filters.name, filters.role, page, perPage]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetch();
    setRefreshing(false);
  }, [fetch]);

  const create = useCallback(async (payload: EmployeeForm, photoFile?: File | null) => {
    const res = await usersApi.create(payload);
    const id = (res?.data?.id) ?? (res?.data as any)?.employee_id;
    if (id && photoFile) {
      try { await usersApi.uploadPhoto(id, photoFile); } catch {}
    }
    return res;
  }, []);

  const update = useCallback(async (id: number | string, body: Partial<EmployeeForm>) => {
    return usersApi.update(id, body);
  }, []);

  const remove = useCallback(async (id: number | string) => {
    return usersApi.remove(id);
  }, []);

  return {
    data, total, loading, refreshing, error,
    page, setPage, perPage, setPerPage,
    filters, setFilters,
    fetch, refresh, create, update, remove,
  };
}
