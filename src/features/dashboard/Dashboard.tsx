// src/features/dashboard/Dashboard.tsx
import { useDashboard } from './hooks/useDashboard';
import { Card } from '../../components/ui';

// Impor komponen-komponen baru
import FilterBar from './components/FilterBar';
import LocationMap from './components/LocationMap';
import DonutChartCard from './components/DonutChartCard';
import VisitsBarChart from './components/VisitsBarChart';
import CoverageGrid from './components/CoverageGrid';

function Dashboard() {
  const {
    stats,
    loading,
    filters,
    setFilters,
    pgOptions,
    wilayahOptions,
  } = useDashboard();

  return (
    // Padding p-6 dan space-y-6 untuk konsistensi layout
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        pgOptions={pgOptions}
        wilayahOptions={wilayahOptions}
      />
      
      {/* Semua komponen di bawah ini akan di-render secara langsung */}
      <div className="space-y-6">
        <Card title="Lokasi" padding="sm">
          <div className='h-[400px] rounded-b-lg overflow-hidden'>
            <LocationMap />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DonutChartCard
            title="Total User Aktif"
            data={stats.totalUserAktif || []}
            loading={loading} // <-- Loading state dikirim ke komponen
            dataKey="plantation_group"
            valueKey="total"
          />
          <DonutChartCard
            title="Total Lokasi Terkunjungi"
            data={stats.totalLokasiTerkunjungi || []}
            loading={loading} // <-- Loading state dikirim ke komponen
            dataKey="plantation_group"
            valueKey="total"
          />
        </div>

        <VisitsBarChart data={stats.kunjunganPerWilayah || []} loading={loading} />
        
        <CoverageGrid data={stats.coveragePerMandor || []} loading={loading} />
      </div>
    </div>
  );
}

export default Dashboard;
