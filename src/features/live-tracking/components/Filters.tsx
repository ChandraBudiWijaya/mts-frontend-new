import type { LiveTrackingFilterState, PG, Wilayah, Mandor } from "../types";

interface FiltersProps {
  filters: LiveTrackingFilterState;
  onFilterChange: (filters: LiveTrackingFilterState) => void;
  onSearch: () => void;
  pgOptions: PG[];
  wilayahOptions: Wilayah[];
  mandorOptions: Mandor[];
}

export default function Filters({
  filters,
  onFilterChange,
  onSearch,
  pgOptions,
  wilayahOptions,
  mandorOptions,
}: FiltersProps) {

  // Saat PG berubah, reset Wilayah dan Mandor
  const handlePgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ 
      pgId: e.target.value || undefined, 
      wilayahId: undefined, 
      mandorId: undefined 
    });
  };
  
  // Saat Wilayah berubah, reset Mandor
  const handleWilayahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ 
      ...filters,
      wilayahId: e.target.value || undefined, 
      mandorId: undefined 
    });
  };

  const handleMandorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, mandorId: e.target.value || undefined });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      {/* Filter Plantation Group */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Plantation Group</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          value={filters.pgId ?? ""}
          onChange={handlePgChange}
        >
          <option value="">Pilih PG</option>
          {pgOptions.map(pg => <option key={pg.id} value={pg.id}>{pg.code}</option>)}
        </select>
      </div>
      
      {/* Filter Wilayah */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Wilayah</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          value={filters.wilayahId ?? ""}
          onChange={handleWilayahChange}
          disabled={!filters.pgId}
        >
          <option value="">Semua Wilayah</option>
          {wilayahOptions.map(w => <option key={w.id} value={w.id}>{w.code}</option>)}
        </select>
      </div>

      {/* Filter Mandor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mandor</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          value={filters.mandorId ?? ""}
          onChange={handleMandorChange}
          disabled={!filters.pgId}
        >
          <option value="">Semua Mandor</option>
          {mandorOptions.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Tombol Search */}
      <button
        className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 transition-colors"
        onClick={onSearch}
        disabled={!filters.pgId}
      >
        Search
      </button>
    </div>
  );
}

