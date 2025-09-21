import { Card } from "@/components/ui";
import Filters from "./components/Filters";
import MapView from "./components/MapView";
import { useLiveTracking } from "./hooks/useLiveTracking";

/**
 * Komponen utama (container) untuk halaman Live Tracking.
 * Tugasnya adalah memanggil hook logika dan menyusun komponen UI.
 */
export default function LiveTrackingPage() {
  const {
    filters,
    setFilters,
    pgOptions,
    wilayahOptions,
    mandorOptions,
    livePositions,
    mandorLookup,
    handleSearch,
  } = useLiveTracking();

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Live Tracking</h1>
      
      <Card>
        <Filters
          filters={filters}
          onFilterChange={setFilters}
          onSearch={handleSearch}
          pgOptions={pgOptions}
          wilayahOptions={wilayahOptions}
          mandorOptions={mandorOptions}
        />
      </Card>

      <Card className="p-0 overflow-hidden">
        {/* Atur tinggi peta agar memenuhi sisa layar */}
        <div className="h-[calc(100vh-280px)] w-full">
            <MapView points={livePositions} mandorLookup={mandorLookup} />
        </div>
      </Card>
    </div>
  );
}

