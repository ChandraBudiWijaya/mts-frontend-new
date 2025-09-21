// src/features/locations/components/LocationsTable.tsx
import { useMemo, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Card from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import Pagination from '../../../components/ui/Pagination';
import type { LocationRow } from '../types';

interface LocationsTableProps {
  items: LocationRow[];
  loading: boolean;
  onView: (item: LocationRow) => void;
}

export default function LocationsTable({ items, loading, onView }: LocationsTableProps) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const displayItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  return (
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
                <tr><td colSpan={6} className="py-20"><div className="flex justify-center"><LoadingSpinner /></div></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                        <InformationCircleIcon className="h-10 w-10 text-gray-300 mb-3" />
                        <div className="text-lg font-medium">Tidak ada data lokasi</div>
                    </div>
                </td></tr>
              ) : (
                displayItems.map((g, idx) => (
                  <tr key={g.id} className="hover:bg-gray-100">
                    <td className="px-4 py-3 text-sm">{(page - 1) * perPage + idx + 1}</td>
                    <td className="px-4 py-3 text-sm">{(g as any).pg_group || '-'}</td>
                    <td className="px-4 py-3 text-sm">{(g as any).region || '-'}</td>
                    <td className="px-4 py-3 text-sm">{g.location_code || g.name || '-'}</td>
                    <td className="px-4 py-3 text-sm">{typeof (g as any).area_size === 'number' ? (g as any).area_size.toFixed(2) : ((g as any).area_size ?? '-')}</td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={() => onView(g)} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-md hover:shadow" title="Detail Lokasi">
                        <InformationCircleIcon className="h-4 w-4 text-primary-600" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} perPage={perPage} total={items.length} onPageChange={setPage} onPerPageChange={setPerPage} />
      </div>
    </Card>
  );
}