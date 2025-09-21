// src/features/reports/components/ReportTable.tsx
import type { ReportSummary } from "../types";

export default function ReportTable({
  data,
  onSelectRow,
  selectedRowId
}: {
  data: ReportSummary[];
  onSelectRow?: (row: ReportSummary) => void;
  selectedRowId: string | null;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-primary-600">
          <tr>
            {["No", "PG", "Wilayah", "Mandor", "Tanggal", "Total Lokasi", "Total Area (Ha)"].map((h) => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Silakan pilih filter dan klik Search untuk menampilkan data.</td></tr>
          ) : (
            data.map((row, i) => {
              const isSelected = selectedRowId === `${row.id}-${row.tanggal}`;
              return (
                <tr
                  key={`${row.id}-${row.tanggal}`}
                  className={`cursor-pointer transition-colors ${isSelected ? 'bg-primary-100' : 'hover:bg-gray-50'}`}
                  onClick={() => onSelectRow?.(row)}
                >
                  <td className="px-6 py-3 text-sm text-gray-900">{i + 1}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{row.plantation_group}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{row.wilayah}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{row.mandor}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{row.tanggal}</td>
                  <td className="px-6 py-3 text-sm text-right text-gray-900">{row.total_lokasi}</td>
                  <td className="px-6 py-3 text-sm text-right text-gray-900">{row.total_area_ha ?? "-"}</td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

