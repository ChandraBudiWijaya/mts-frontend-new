/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import Pagination from '../../components/ui/Pagination';
import { geofenceAPI } from '../../shared/api';
import { getErrorMessage } from '../../shared/utils/errorHandler';
import { useDebounce } from '../../shared/hooks/useDebounce';
import type { Geofence } from '../../shared/types';

interface LocationFilter {
  pg_group: string; // maps from backend resource key
  region: string;
  q?: string; // quick search for name or code
}

function Locations() {
  const navigate = useNavigate();
  // Use a loose type to align with backend resource keys
  const [rawItems, setRawItems] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [filters, setFilters] = useState<LocationFilter>({
    pg_group: '',
    region: ''
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const fetchGeofences = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      // For view-only, we can fetch without server filtering
      const res = await geofenceAPI.getAll();
      const payload: any = res.data;
      const rows: any[] = Array.isArray(payload) ? payload : payload?.data ?? [];
      setRawItems(rows);
      // Use client-side pagination: store all rows and derive pagination client-side
      setItems(rows);
      setTotal(rows.length);
  // compute lastPage based on current perPage selection (no state - derived in Pagination)
      setPage(1);
    } catch (e) {
      console.error('Error fetching geofences:', e);
      setError(getErrorMessage(e, 'Gagal memuat data lokasi'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGeofences();
  }, [fetchGeofences]);

  // derive currently displayed items based on client-side pagination
  const displayItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  // Debounce the quick-search term so we don't re-filter on every keystroke
  const debouncedQ = useDebounce<string | undefined>(filters.q, 300);

  // Auto-apply filters when debounced query or selects change
  useEffect(() => {
    const applied = applyFilter(rawItems, { ...filters, q: debouncedQ });
    setItems(applied);
    setPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, filters.pg_group, filters.region, rawItems]);

  // Keep pagination totals in sync when items or perPage change
  useEffect(() => {
    setTotal(items.length);
  const lp = Math.max(1, Math.ceil(items.length / perPage || 1));
    if (page > lp) setPage(1);
  }, [items, perPage, page]);

  const handleView = (geofence: Geofence) => {
    navigate(`/locations/${geofence.id}`);
  };

  const applyFilter = (rows: any[], f: LocationFilter) => {
    return rows.filter((r) => {
      const matchesPg = f.pg_group ? String(r.pg_group).toLowerCase() === f.pg_group.toLowerCase() : true;
      const matchesRegion = f.region ? String(r.region).toLowerCase() === f.region.toLowerCase() : true;
      const q = f.q?.trim().toLowerCase();
      const matchesQ = q
        ? (String(r.location_code || r.name || '').toLowerCase().includes(q))
        : true;
      return matchesPg && matchesRegion && matchesQ;
    });
  };

  // Search is now auto-applied via debounced input and select changes

  const handleRefresh = async () => {
    try {
      setSyncing(true);
      setError('');
      setSuccess('');
      await geofenceAPI.syncDwhLocations();
  await fetchGeofences();
      setFilters({ pg_group: '', region: '' });
      setSuccess('Sinkronisasi DWH berhasil');
    } catch (e) {
      console.error('Sync DWH error:', e);
      setError(getErrorMessage(e, 'Sinkronisasi DWH gagal'));
    } finally {
      setSyncing(false);
    }
  };

  const handlePageChange = (p: number) => setPage(p);
  const handlePerPageChange = (n: number) => { setPerPage(n); setPage(1); };

  // Always render page shell; show spinner only inside the table area so header/filters don't wait

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Master Lokasi</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola daftar lokasi geofence dan sinkronisasi data dari DWH.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleRefresh} className="bg-green-600 hover:bg-green-700 text-white" loading={syncing}>
            Sync DWH
          </Button>
          <Button onClick={() => { setFilters({ pg_group: '', region: '' }); fetchGeofences(); }} className="bg-white border border-green-700 hover:text-white !text-green-700">
            Reset
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && <div className="mb-4"><Alert variant="error">{error}</Alert></div>}
      {success && <div className="mb-4"><Alert variant="success">{success}</Alert></div>}

      {/* Filters */}
      <div className='bg-white rounded-lg p-8 shadow-sm border border-gray-200'>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari (kode atau nama)</label>
            <input
              value={filters.q || ''}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              placeholder="Cari lokasi..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plantation Group</label>
            <select
              value={filters.pg_group}
              onChange={(e) => setFilters({ ...filters, pg_group: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Semua</option>
              <option value="PG1">PG1</option>
              <option value="PG2">PG2</option>
              <option value="PG3">PG3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wilayah</label>
            <select
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Semua</option>
              <option value="SAG1">SAG1</option>
              <option value="SAG2">SAG2</option>
              <option value="SAG3">SAG3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Locations Table */}
      <Card>
        <div className="p-2">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="sticky top-0 shadow-sm">
                <tr className="bg-primary-600">
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">PG</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Wilayah</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Lokasi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Luas (Ha)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20">
                      <div className="flex justify-center">
                        <LoadingSpinner />
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <InformationCircleIcon className="h-10 w-10 text-gray-300 mb-3" />
                        <div className="text-lg font-medium">Tidak ada data lokasi</div>
                        <div className="text-sm text-gray-500 mt-1">Coba ubah filter atau lakukan sinkronisasi DWH.</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayItems.map((g, idx) => (
                    <tr key={g.id} className={`transition-colors duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{(page - 1) * perPage + idx + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{g.pg_group || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{g.region || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{g.location_code || g.name || '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{typeof g.area_size === 'number' ? g.area_size.toFixed(2) : (g.area_size ?? '-')}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(g)}
                            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-md hover:shadow"
                            title="Detail Lokasi"
                          >
                            <InformationCircleIcon className="h-4 w-4 text-primary-600" />
                            <span className="text-sm">Detail</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination page={page} perPage={perPage} total={total} onPageChange={handlePageChange} onPerPageChange={handlePerPageChange} />
        </div>
      </Card>
    </div>
  );
}

export default Locations;
