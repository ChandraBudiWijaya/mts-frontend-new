import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // <-- Impor
import { geofenceAPI } from '@/shared/api';
import { getErrorMessage } from '@/shared/utils/errorHandler';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { LocationRow, LocationFilter } from '../types';

// Fungsi filter tetap di sini untuk dijalankan di client-side
function applyFilter(rows: LocationRow[], f: LocationFilter): LocationRow[] {
  if (!rows) return [];
  return rows.filter((r) => {
    const pg_group = (r as any).pg_group || '';
    const region = (r as any).region || '';
    const location_code = r.location_code || '';
    const name = r.name || '';

    const matchesPg = f.pg_group ? pg_group.toLowerCase() === f.pg_group.toLowerCase() : true;
    const matchesRegion = f.region ? region.toLowerCase() === f.region.toLowerCase() : true;
    const q = f.q?.trim().toLowerCase();
    const matchesQ = q
      ? (location_code.toLowerCase().includes(q) || name.toLowerCase().includes(q))
      : true;
    return matchesPg && matchesRegion && matchesQ;
  });
};

export function useLocations() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<LocationFilter>({ pg_group: '', region: '', q: '' });
  const debouncedQ = useDebounce(filters.q, 300);

  // 1. Mengambil data dengan useQuery
  const { data: rawItems = [], isLoading, error } = useQuery({
    queryKey: ['geofences'], // Kunci unik untuk cache data lokasi
    queryFn: async () => {
      const res = await geofenceAPI.getAll();
      const payload: any = res.data;
      return Array.isArray(payload) ? payload : payload?.data ?? [];
    },
  });

  // 2. Sinkronisasi DWH adalah sebuah 'mutasi' karena mengubah data di server
  const syncDwhMutation = useMutation({
    mutationFn: () => geofenceAPI.syncDwhLocations(),
    onSuccess: () => {
      // Setelah sinkronisasi sukses, beri tahu TanStack Query
      // bahwa data 'geofences' sudah tidak valid dan harus diambil ulang.
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
    },
    onError: (err) => {
        // Bisa tambahkan notifikasi error di sini jika perlu
        console.error("Sync DWH failed:", getErrorMessage(err));
    }
  });

  // 3. Terapkan filter pada data yang sudah di-cache oleh useQuery
  const items = useMemo(() => {
    const effectiveFilters = { ...filters, q: debouncedQ };
    return applyFilter(rawItems, effectiveFilters);
  }, [debouncedQ, filters, rawItems]);

  return {
    items,
    loading: isLoading,
    error: error ? getErrorMessage(error, 'Gagal memuat data lokasi') : null,
    syncing: syncDwhMutation.isPending,
    filters,
    setFilters,
    syncDwh: syncDwhMutation.mutate, // Kirim fungsi 'mutate' untuk dieksekusi
  };
}

