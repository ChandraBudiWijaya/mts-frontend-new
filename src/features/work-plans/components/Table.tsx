// src/features/workplans/components/Table.tsx
import StatusChip from './StatusChip';
import type { WorkPlanRow } from '../types';
import { fmtDateDMY } from '../utils';
import { InformationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

type Props = {
  rows: WorkPlanRow[];
  startIndex: number; // (page-1)*perPage
  onDetail: (row: WorkPlanRow) => void;
  onDelete: (row: WorkPlanRow) => void;
  loading?: boolean;
};

export default function Table({ rows, startIndex, onDetail, onDelete, loading }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-green-700 text-white">
            <th className="px-4 py-2 text-left text-sm font-semibold">No</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Tanggal</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Mandor</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Lokasi</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Wilayah</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">PG</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-600">Memuat rencana kerja...</td></tr>
          ) : rows.length ? rows.map((r, idx) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm">{startIndex + idx + 1}</td>
              <td className="px-4 py-2 text-sm">{fmtDateDMY(r.date)}</td>
              <td className="px-4 py-2 text-sm">{r.employee?.name ?? '-'}</td>
              <td className="px-4 py-2 text-sm">{r.geofence?.location_code ?? r.geofence?.name ?? '-'}</td>
              <td className="px-4 py-2 text-sm">{r.wilayah ?? '-'}</td>
              <td className="px-4 py-2 text-sm">{r.pg ?? '-'}</td>
              <td className="px-4 py-2 text-sm"><StatusChip status={r.status} /></td>
              <td className="px-4 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <button onClick={() => onDetail(r)} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-500 text-white" title="Detail"><InformationCircleIcon className="w-5 h-5" /></button>
                  <button onClick={() => onDelete(r)} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white" title="Hapus"><TrashIcon className="w-5 h-5" /></button>
                </div>
              </td>
            </tr>
          )) : (
            <tr><td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={8}>Tidak ada data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
