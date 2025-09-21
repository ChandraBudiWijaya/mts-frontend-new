import { useNavigate } from 'react-router-dom';
import { Alert, Button } from '@/components/ui';
import { useLocations } from './hooks/useLocations';
import type { LocationRow } from './types';
import LocationFilters from './components/LocationFilters';
import LocationsTable from './components/LocationsTable';

function Locations() {
  const navigate = useNavigate();
  // Panggilan hook sekarang sudah didukung oleh TanStack Query
  const {
    items, loading, error, syncing,
    filters, setFilters, syncDwh,
  } = useLocations();

  const handleView = (geofence: LocationRow) => {
    navigate(`/locations/${geofence.id}`);
  };
  
  const handleReset = () => {
    setFilters({ pg_group: '', region: '', q: '' });
    // Kita tidak perlu memanggil fetchGeofences() lagi, karena filter akan otomatis berjalan
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Master Lokasi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola daftar lokasi geofence dan sinkronisasi data dari DWH.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Tombol sync sekarang memanggil 'mutate' dari useMutation */}
          <Button onClick={() => syncDwh()} className="bg-green-600 hover:bg-green-700 text-white" loading={syncing}>
            Sync DWH
          </Button>
          <Button onClick={handleReset} variant="secondary">
            Reset Filter
          </Button>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <LocationFilters 
        filters={filters}
        onFilterChange={setFilters}
      />
      
      <LocationsTable 
        items={items}
        loading={loading}
        onView={handleView}
      />
    </div>
  );
}

export default Locations;

