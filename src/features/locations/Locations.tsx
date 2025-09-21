import { useNavigate } from 'react-router-dom';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button'; // <-- Tambahkan import Button
import { useLocations } from './hooks/useLocations';
import type { LocationRow } from './types';

// Impor komponen baru
import LocationFilters from './components/LocationFilters';
import LocationsTable from './components/LocationsTable';

function Locations() {
  const navigate = useNavigate();
  const {
    items, loading, error, syncing,
    filters, setFilters, syncDwh, fetchGeofences,
  } = useLocations();

  const handleView = (geofence: LocationRow) => {
    navigate(`/locations/${geofence.id}`);
  };
  
  const handleReset = () => {
    setFilters({ pg_group: '', region: '', q: '' });
    fetchGeofences();
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header Halaman (Tetap di sini) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Master Lokasi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola daftar lokasi geofence dan sinkronisasi data dari DWH.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={syncDwh} className="bg-green-600 hover:bg-green-700 text-white" loading={syncing}>
            Sync DWH
          </Button>
          <Button onClick={handleReset} className="bg-white border border-green-700 hover:text-white !text-green-700">
            Reset
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