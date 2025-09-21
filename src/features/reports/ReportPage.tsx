import { useReports } from "./hooks/useReports";
import ReportFilter from "./components/ReportFilter";
import ReportTable from "./components/ReportTable";
import ReportMap from "./components/ReportMap";
import { Card, Alert, LoadingSpinner} from "../../components/ui";
import ReportDetailTable from "./components/ReportDetailTable";


export default function ReportPage() {
  const {
    loading,
    error,
    summaries,
    details,
    track,
    selected,
    search,
    loadTrackFor,
  } = useReports();

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Laporan perjalanan mandor berdasarkan tanggal, wilayah, dan PG.
        </p>
      </div>

      {/* Error */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* Filter */}
      <ReportFilter onSearch={search} />

      {/* Summary Table */}
      <Card className="p-0">
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <ReportTable
            data={summaries}
            onSelectRow={(row) => loadTrackFor(row.id, row.tanggal)}
          />
        )}
      </Card>

      {/* Map */}
      <Card className="p-0">
        <div className="p-4 text-sm font-semibold text-gray-700">
          Peta Perjalanan
        </div>
        <div className="h-[420px] rounded-b-xl overflow-hidden">
          <ReportMap selected={selected} track={track} />
        </div>
      </Card>

      {/* Detail Table */}
      <Card className="p-0">
        <div className="p-4 text-sm font-semibold text-gray-700">
          Rute Perjalanan
        </div>
        <ReportDetailTable
          data={details}
          mandorName={summaries.find((s) => s.id === selected?.mandorId)?.mandor}
          date={selected?.date}
        />
      </Card>
    </div>
  );
}
