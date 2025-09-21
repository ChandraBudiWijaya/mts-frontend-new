// src/features/dashboard/components/FilterBar.tsx
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import type { DashboardFilters } from '../types';

interface FilterBarProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  pgOptions: string[];
  wilayahOptions: string[];
}

export default function FilterBar({ filters, onFiltersChange, pgOptions, wilayahOptions }: FilterBarProps) {
  const handleInputChange = (field: keyof DashboardFilters, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    // Card container dengan padding konsisten
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 items-end">
        
        {/* Filter Tanggal */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative w-full">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <span className="text-gray-500">-</span>
            <div className="relative w-full">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Filter Plantation Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plantation Group
          </label>
          <select
            value={filters.plantation_group}
            onChange={(e) => handleInputChange('plantation_group', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
          >
            <option value="">All</option>
            {pgOptions.map(pg => <option key={pg} value={pg}>{pg}</option>)}
          </select>
        </div>

        {/* Filter Wilayah */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wilayah
          </label>
          <select
            value={filters.wilayah}
            onChange={(e) => handleInputChange('wilayah', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
          >
            <option value="">All</option>
            {wilayahOptions.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>

        {/* Tombol Search dipindahkan ke ujung kanan jika perlu */}
        {/* Untuk layout ini, tombolnya kita letakkan di dashboard utama */}
      </div>
    </div>
  );
}

