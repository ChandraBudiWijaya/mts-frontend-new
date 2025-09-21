import { useCallback, useMemo, useState } from "react";
import type { ReportFilterState, ReportSummary, VisitDetail, TrackingPoint } from "../types";
import { fetchDashboardStats, fetchVisitDetails, fetchTrackingPoints } from "../services/reportAPI";

export function useReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [summaries, setSummaries] = useState<ReportSummary[]>([]);
  const [details, setDetails] = useState<VisitDetail[]>([]);
  const [track, setTrack] = useState<TrackingPoint[]>([]);
  const [selected, setSelected] = useState<{ mandorId: string; date: string } | null>(null);

  const search = useCallback(async (f: ReportFilterState) => {
    setError(null);
    setLoading(true);
    try {
      const [s, d] = await Promise.all([
        fetchDashboardStats(f),
        fetchVisitDetails(f),
      ]);
      setSummaries(s);
      setDetails(d);
      setTrack([]);
      setSelected(null);
    } catch (e: any) {
      setError(e?.message ?? "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTrackFor = useCallback(async (mandorId: string, date: string) => {
    setError(null);
    setLoading(true);
    try {
      const pts = await fetchTrackingPoints(mandorId, date);
      setTrack(pts);
      setSelected({ mandorId, date });
    } catch (e: any) {
      setError(e?.message ?? "Gagal memuat tracking");
    } finally {
      setLoading(false);
    }
  }, []);

  // Detail yang ditampilkan bisa kamu filter sesuai selected bila mau
  return { loading, error, summaries, details, track, selected, search, loadTrackFor };
}
