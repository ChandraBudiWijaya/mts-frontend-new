// src/features/workplans/components/Filters.tsx
import { useCallback, useMemo } from 'react';
import type { WorkPlanFilters, Option } from '../types';
import { useDebounce } from '../hooks/useDebounce';

type Props = {
  value: WorkPlanFilters;
  onChange: (v: WorkPlanFilters) => void;
  onDebouncedChange?: (v: WorkPlanFilters) => void;
  pgOptions: Option[];
  wilayahOptions: Option[];
};

export default function Filters({ value, onChange, onDebouncedChange, pgOptions, wilayahOptions }: Props) {
  const set = useCallback((patch: Partial<WorkPlanFilters>) => {
    onChange({ ...value, ...patch });
  }, [value, onChange]);

  useDebounce(value, 400, onDebouncedChange);

  const chips = useMemo(() => ([
    value.plantation_group && { label: `PG: ${value.plantation_group}`, k: 'plantation_group' as const },
    value.wilayah && { label: `Wilayah: ${value.wilayah}`, k: 'wilayah' as const },
    value.mandor && { label: `Mandor: ${value.mandor}`, k: 'mandor' as const },
    value.date && { label: `Tanggal: ${value.date}`, k: 'date' as const },
  ].filter(Boolean) as { label: string; k: keyof WorkPlanFilters }[]), [value]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Plantation Group</label>
          <div className="relative">
            <input
              list="pg-list"
              value={value.plantation_group}
              onChange={(e) => set({ plantation_group: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="PG 1"
              aria-label="Plantation Group"
            />
            {value.plantation_group && (
              <button onClick={() => set({ plantation_group: '' })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Clear Plantation Group">×</button>
            )}
          </div>
          <datalist id="pg-list">{pgOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</datalist>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Wilayah</label>
          <div className="relative">
            <input
              list="wilayah-list"
              value={value.wilayah}
              onChange={(e) => set({ wilayah: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="W01"
              aria-label="Wilayah"
            />
            {value.wilayah && (
              <button onClick={() => set({ wilayah: '' })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Clear Wilayah">×</button>
            )}
          </div>
          <datalist id="wilayah-list">{wilayahOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</datalist>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mandor</label>
          <div className="relative">
            <input
              value={value.mandor}
              onChange={(e) => set({ mandor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Nama mandor"
              aria-label="Mandor"
            />
            {value.mandor && (
              <button onClick={() => set({ mandor: '' })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label="Clear Mandor">×</button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
          <input
            type="date"
            value={value.date}
            onChange={(e) => set({ date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Tanggal"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange({ plantation_group: '', wilayah: '', mandor: '', date: '' })}
            className="text-sm px-3 py-2 rounded border bg-white hover:bg-gray-50"
            title="Reset Filters"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 mt-2">
        {chips.map(c => (
          <span key={c.k} className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
            <span>{c.label}</span>
            <button onClick={() => set({ [c.k]: '' } as Partial<WorkPlanFilters>)}
              className="text-sm text-primary-700" aria-label={`Remove ${c.label}`}>×</button>
          </span>
        ))}
      </div>
    </>
  );
}
