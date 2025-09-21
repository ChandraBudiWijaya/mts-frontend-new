// src/features/locations/components/LocationFilters.tsx
import type { LocationFilter } from "../types";

interface LocationFiltersProps {
  filters: LocationFilter;
  onFilterChange: (filters: LocationFilter) => void;
}

export default function LocationFilters({ filters, onFilterChange }: LocationFiltersProps) {
  const handleChange = (field: keyof LocationFilter, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cari (kode atau nama)</label>
          <input
            value={filters.q || ''}
            onChange={(e) => handleChange('q', e.target.value)}
            placeholder="Cari lokasi..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plantation Group</label>
          <select
            value={filters.pg_group}
            onChange={(e) => handleChange('pg_group', e.target.value)}
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
            onChange={(e) => handleChange('region', e.target.value)}
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
  );
}