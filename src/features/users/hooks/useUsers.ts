/**
 * features/users/hooks/useUsers.ts
 * ------------------------------------------------------------
 * Hook state management untuk daftar user:
 * - data, loading/error, pagination, filters
 * - operasi CRUD (create/update/delete)
 * - fetch/refresh terpusat
 * Komponen halaman tinggal konsumsi hook ini.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../services/api';
import { normalizeApiList } from '../services/mappers';
import { getErrorMessage } from '@/shared/utils/errorHandler';
import type { Employee, EmployeeForm } from '@/shared/types';
import type { UserFilters } from '../types';

export function useUsers() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState<UserFilters>({ plantation_group: '', name: '', role: '' });

  // Kunci query sekarang dinamis, tergantung pada filter dan paginasi
  const queryKey = ['users', { filters, page, perPage }];

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const apiFilters = {
        plantation_group: filters.plantation_group || undefined,
        name: filters.name || undefined,
        role: filters.role || undefined,
        page, 
        per_page: perPage
      };
      const res = await usersApi.list(apiFilters);
      return normalizeApiList<Employee>(res.data);
    },
    placeholderData: (previousData) => previousData, // UI tidak berkedip saat refetch
  });

  // Opsi untuk semua mutasi: invalidasi query 'users' agar data di-fetch ulang
  const mutationOptions = {
    onSuccess: () => {
      alert('Aksi berhasil!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err: unknown) => {
      alert(getErrorMessage(err));
    }
  };

  const createUserMutation = useMutation({
    mutationFn: ({ payload, photoFile }: { payload: EmployeeForm, photoFile?: File | null }) => 
      usersApi.create(payload, photoFile),
    ...mutationOptions,
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, body }: { id: number | string, body: Partial<EmployeeForm> }) => 
      usersApi.update(id, body),
    ...mutationOptions,
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number | string) => usersApi.remove(id),
    ...mutationOptions,
  });

  return {
    data: data?.data ?? [],
    total: data?.total ?? 0,
    loading: isLoading,
    error: isError ? getErrorMessage(error) : null,
    
    page, setPage,
    perPage, setPerPage,
    filters, setFilters,

    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,

    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
}
