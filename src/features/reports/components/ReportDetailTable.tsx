// src/features/reports/components/ReportDetailTable.tsx
import type { VisitDetail } from "../types";

interface ReportDetailTableProps {
  data: VisitDetail[];
  selectedItems: VisitDetail[];
  onSelectionChange: (newSelection: VisitDetail[]) => void;
}

export default function ReportDetailTable({ data, selectedItems, onSelectionChange }: ReportDetailTableProps) {
    const isAllSelected = data.length > 0 && selectedItems.length === data.length;

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSelectionChange(e.target.checked ? data : []);
    };

    const handleSelectItem = (item: VisitDetail, checked: boolean) => {
        const key = `${item.lokasi}-${item.jam_masuk}`;
        const newSelection = checked 
            ? [...selectedItems, item]
            : selectedItems.filter(selected => `${selected.lokasi}-${selected.jam_masuk}` !== key);
        onSelectionChange(newSelection);
    };

    const isItemSelected = (item: VisitDetail) => {
        const key = `${item.lokasi}-${item.jam_masuk}`;
        return selectedItems.some(selected => `${selected.lokasi}-${selected.jam_masuk}` === key);
    };

  return (
    <div className="overflow-y-auto max-h-[368px]"> {/* Memberikan tinggi maksimal dan scroll */}
      <table className="min-w-full">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} title="Pilih Semua Rute" />
            </th>
            {["No", "Lokasi", "Masuk", "Keluar", "Durasi"].map((h) => (
              <th key={h} className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {!data || data.length === 0 ? (
            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Pilih mandor dari tabel di atas untuk melihat detail perjalanan.</td></tr>
          ) : (
            data.map((d, i) => (
              <tr key={`${d.lokasi}-${d.jam_masuk}`} className={`transition-colors ${isItemSelected(d) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                <td className="px-4 py-3">
                    <input type="checkbox" checked={isItemSelected(d)} onChange={(e) => handleSelectItem(d, e.target.checked)} />
                </td>
                <td className="px-6 py-3 text-sm text-gray-900">{i + 1}</td>
                <td className="px-6 py-3 text-sm font-medium text-gray-900">{d.lokasi}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{d.jam_masuk}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{d.jam_keluar}</td>
                <td className="px-6 py-3 text-sm text-right text-gray-900">{d.durasi_menit} menit</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
