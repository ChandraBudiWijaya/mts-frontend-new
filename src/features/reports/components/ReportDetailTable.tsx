import type { VisitDetail } from "../types";

export default function ReportDetailTable({
  data,
  mandorName,
  date,
}: {
  data: VisitDetail[];
  mandorName?: string;
  date?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-primary-600">
          <tr>
            {[
              "No",
              "Mandor",
              "Lokasi",
              "Tanggal",
              "Masuk",
              "Keluar",
              "Total Lokasi",
              "Durasi",
            ].map((h) => (
              <th
                key={h}
                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-8 text-center text-gray-500"
              >
                No data
              </td>
            </tr>
          ) : (
            data.map((d, i) => (
              <tr key={d.id + i} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm text-gray-900">{i + 1}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{d.mandor}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{d.lokasi}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{d.tanggal}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{d.jam_masuk}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{d.jam_keluar}</td>
                <td className="px-6 py-3 text-sm text-right text-gray-900">
                  {d.total_lokasi}
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-900">
                  {d.durasi_menit} menit
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
