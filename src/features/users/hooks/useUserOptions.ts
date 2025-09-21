// File: src/features/users/hooks/useUserOptions.ts
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../services/api';

/**
 * Hook untuk mengambil data opsi dropdown (PG, Jabatan, Wilayah, Role).
 * Data ini sekarang di-cache oleh TanStack Query.
 * `staleTime: Infinity` digunakan karena data master ini jarang berubah.
 */

export function useUserOptions() {
  const { data: pgOptions = [] } = useQuery({
    queryKey: ['options', 'pg'],
    queryFn: async () => {
      const res = await usersApi.pgOptions();
      return (res?.data?.data ?? []).map((x: any) => String(x.value ?? x.label));
    },
    staleTime: Infinity, // Data ini dianggap tidak pernah basi
  });

  const { data: positionOptions = [] } = useQuery({
    queryKey: ['options', 'positions'],
    queryFn: async () => (await usersApi.positions()).data || [],
    staleTime: Infinity,
  });
  
  const { data: wilayahOptions = [] } = useQuery({
    queryKey: ['options', 'wilayah'],
    queryFn: async () => {
        const res = await usersApi.wilayahOptions();
        return (res?.data?.data ?? []).map((x: any) => String(x.value ?? x.label));
    },
    staleTime: Infinity,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['options', 'roles'],
    queryFn: async () => (await usersApi.roles()).data.data ?? [],
    staleTime: 1000 * 60 * 5, // Anggap role bisa berubah, refresh tiap 5 menit
  });

  return { pgOptions, positionOptions, wilayahOptions, roles };
}
