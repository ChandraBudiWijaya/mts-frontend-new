/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InformationCircleIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import { geofenceAPI } from '../../shared/api';
import { getErrorMessage } from '../../utils/errorHandler';
import type { PaginatedResponse, Geofence } from '../../shared/types';

interface LocationFilter {
  pg_group: string; // maps from backend resource key
  region: string;
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
  const [perPage, setPerPage] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const fetchGeofences = async (_pageNumber = 1) => {
    try {
      setLoading(true);
      setError('');
      // For view-only, we can fetch without server filtering
      const res = await geofenceAPI.getAll();
      const payload: any = res.data;
      const rows: any[] = Array.isArray(payload) ? payload : payload?.data ?? [];
      setRawItems(rows);

      // If pagination exists from backend, use it; else derive from rows
      if (!Array.isArray(payload) && payload && typeof payload === 'object' && 'total' in payload) {
        const p = payload as PaginatedResponse<any>;
        setTotal(p.total);
        setPerPage(p.per_page);
        setLastPage(p.last_page);
        setPage(p.current_page);
        setItems(rows);
      } else {
        setItems(rows);
        setTotal(rows.length);
        setPerPage(rows.length);
        setLastPage(1);
        setPage(1);
      }
    } catch (e) {
      console.error('Error fetching geofences:', e);
      setError(getErrorMessage(e, 'Gagal memuat data lokasi'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeofences(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleView = (geofence: Geofence) => {
    navigate(`/locations/${geofence.id}`);
  };

  const applyFilter = (rows: any[], f: LocationFilter) => {
    return rows.filter((r) =>
      (f.pg_group ? String(r.pg_group).toLowerCase() === f.pg_group.toLowerCase() : true) &&
      (f.region ? String(r.region).toLowerCase() === f.region.toLowerCase() : true)
    );
  };

  const handleSearch = () => {
    const filtered = applyFilter(rawItems, filters);
    setItems(filtered);
    setTotal(filtered.length);
    setPerPage(filtered.length);
    setLastPage(1);
    setPage(1);
  };

  const handleRefresh = async () => {
    try {
      setSyncing(true);
      setError('');
      setSuccess('');
      await geofenceAPI.syncDwhLocations();
      await fetchGeofences(1);
      setFilters({ pg_group: '', region: '' });
      setSuccess('Sinkronisasi DWH berhasil');
    } catch (e) {
      console.error('Sync DWH error:', e);
      setError(getErrorMessage(e, 'Sinkronisasi DWH gagal'));
    } finally {
      setSyncing(false);
    }
  };

  const handlePrev = () => {
    if (page > 1) fetchGeofences(page - 1);
  };

  const handleNext = () => {
    if (page < lastPage) fetchGeofences(page + 1);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Master Lokasi</h1>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          {error && (
            <div className="mb-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}
          {success && (
            <div className="mb-4">
              <Alert variant="success">{success}</Alert>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plantation Group</label>
              <select
                value={filters.pg_group}
                onChange={(e) => setFilters({ ...filters, pg_group: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="">Semua</option>
                <option value="SAG1">SAG1</option>
                <option value="SAG2">SAG2</option>
                <option value="SAG3">SAG3</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-xl"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Locations Table */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Master Lokasi</h2>
            <Button onClick={handleRefresh} className="bg-green-600 hover:bg-green-700 text-white" loading={syncing}>
              Sync DWH
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-center">
              <thead>
                <tr className="bg-primary-600">
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">PG</th>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">Wilayah</th>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">Luas (Ha)</th>
                  <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {items.map((g, idx) => (
                  <tr key={g.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{(page - 1) * (perPage || items.length) + idx + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.pg_group || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.region || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{g.location_code || g.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{typeof g.area_size === 'number' ? g.area_size.toFixed(2) : (g.area_size ?? '-')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleView(g)}
                          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-md transition-colors duration-200 shadow-sm hover:shadow-md"
                          title="Detail Lokasi"
                        >
                          <InformationCircleIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleView(g)}
                          className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-md transition-colors duration-200 shadow-sm hover:shadow-md"
                          title="Lihat Peta"
                        >
                          <MapPinIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Menampilkan <span className="font-medium">{items.length > 0 ? (page - 1) * (perPage || items.length) + 1 : 0}</span> hingga <span className="font-medium">{(page - 1) * (perPage || items.length) + items.length}</span> dari <span className="font-medium">{total}</span> hasil
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrev}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page <= 1}
              >
                Sebelumnya
              </button>
              <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                {page} / {lastPage}
              </span>
              <button
                onClick={handleNext}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={page >= lastPage}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Locations;
