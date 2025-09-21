import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rbacAPI } from '@/shared/api';
import type { Role, Permission, RoleFormData } from '../types';
import { getErrorMessage } from '@/shared/utils/errorHandler';

/**
 * Hook RBAC yang sudah di-refactor menggunakan TanStack Query.
 * Logika fetching, caching, dan revalidasi data ditangani secara otomatis.
 */
export function useRbac() {
  const queryClient = useQueryClient();

  // --- QUERIES (untuk mengambil data) ---

  const { data: roles = [], isLoading: isLoadingRoles, error: rolesError } = useQuery({
    queryKey: ['roles'], // Kunci unik untuk cache data roles
    queryFn: async () => {
      const response = await rbacAPI.getAllRoles();
      return response.data.data || [];
    },
  });

  const { data: permissions = [], isLoading: isLoadingPermissions, error: permissionsError } = useQuery({
    queryKey: ['permissions'], // Kunci unik untuk cache data permissions
    queryFn: async () => {
      const response = await rbacAPI.getAllPermissions();
      return response.data.data || [];
    },
  });

  // --- MUTATIONS (untuk mengubah data: C-U-D) ---

  // Opsi umum untuk semua mutasi: setelah berhasil, invalidasi cache 'roles'
  // Ini akan memberitahu TanStack Query untuk mengambil ulang data roles yang terbaru.
  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  };

  const createRoleMutation = useMutation({
    mutationFn: (data: RoleFormData) => rbacAPI.createRole(data),
    ...mutationOptions,
  });

  const updateRoleMutation = useMutation({
    mutationFn: (variables: { id: number; data: RoleFormData }) => rbacAPI.updateRole(variables.id, variables.data),
    ...mutationOptions,
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => rbacAPI.deleteRole(id),
    ...mutationOptions,
  });
  
  const getRoleWithPermissions = async (id: number): Promise<Role> => {
    // Fungsi ini tetap sama karena ini adalah aksi tunggal, bukan state berkelanjutan
    const response = await rbacAPI.getRoleById(id);
    return response.data.data;
  }

  // Gabungkan pesan error dari kedua query
  const error = rolesError ? getErrorMessage(rolesError) : permissionsError ? getErrorMessage(permissionsError) : null;

  return {
    roles,
    permissions,
    loading: isLoadingRoles || isLoadingPermissions,
    error,
    
    // Kirim fungsi `mutateAsync` dari mutation hooks
    createRole: createRoleMutation.mutateAsync,
    updateRole: updateRoleMutation.mutateAsync,
    deleteRole: deleteRoleMutation.mutateAsync,
    getRoleWithPermissions,

    // Kirim juga status loading dari masing-masing mutasi jika diperlukan di UI
    isCreating: createRoleMutation.isPending,
    isUpdating: updateRoleMutation.isPending,
    isDeleting: deleteRoleMutation.isPending,
  };
}

