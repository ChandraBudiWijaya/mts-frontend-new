import { useState, useEffect, useCallback, useMemo } from 'react';
import { geofenceAPI } from '@/shared/api';
import { getErrorMessage } from '@/shared/utils/errorHandler';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { LocationRow, LocationFilter } from '../types';

// Fungsi filter dipindahkan ke sini
function applyFilter(rows: LocationRow[], f: LocationFilter): LocationRow[] {
  return rows.filter((r) => {
    const matchesPg = f.pg_group ? String((r as any).pg_group).toLowerCase() === f.pg_group.toLowerCase() : true;
    const matchesRegion = f.region ? String((r as any).region).toLowerCase() === f.region.toLowerCase() : true;
    const q = f.q?.trim().toLowerCase();
    const matchesQ = q
      ? (String(r.location_code || r.name || '').toLowerCase().includes(q))
      : true;
    return matchesPg && matchesRegion && matchesQ;
  });
};

export function useLocations() {
  const [rawItems, setRawItems] = useState<LocationRow[]>([]);
  const [filteredItems, setFilteredItems] = useState<LocationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [filters, setFilters] = useState<LocationFilter>({ pg_group: '', region: '', q: '' });

  const debouncedQ = useDebounce(filters.q, 300);

  const fetchGeofences = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await geofenceAPI.getAll();
      const rows: LocationRow[] = Array.isArray(res.data) ? res.data : (res.data as any)?.data ?? [];
      setRawItems(rows);
      setFilteredItems(rows); // Awalnya tampilkan semua
    } catch (e) {
      setError(getErrorMessage(e, 'Gagal memuat data lokasi'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGeofences();
  }, [fetchGeofences]);

  // Terapkan filter saat filter atau query debounce berubah
  useEffect(() => {
    const applied = applyFilter(rawItems, { ...filters, q: debouncedQ });
    setFilteredItems(applied);
  }, [debouncedQ, filters.pg_group, filters.region, rawItems, filters]);

  const syncDwh = async () => {
    try {
      setSyncing(true);
      setError('');
      await geofenceAPI.syncDwhLocations();
      await fetchGeofences(); // Muat ulang data setelah sinkronisasi
      setFilters({ pg_group: '', region: '', q: '' }); // Reset filter
      // Bisa tambahkan state success jika perlu
    } catch (e) {
      setError(getErrorMessage(e, 'Sinkronisasi DWH gagal'));
    } finally {
      setSyncing(false);
    }
  };

  return {
    items: filteredItems,
    loading,
    error,
    syncing,
    filters,
    setFilters,
    fetchGeofences,
    syncDwh,
  };
}