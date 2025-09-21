// src/features/reports/hooks/useReports.ts
import { useCallback, useMemo, useState } from "react";
import { parse } from 'date-fns';
import type { ReportFilterState, ReportSummary, VisitDetail, TrackingPoint } from "../types";
import { fetchDashboardStats, fetchVisitDetails, fetchTrackingPoints } from "../services/reportAPI";
import { getErrorMessage } from "@/shared/utils/errorHandler";

export function useReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [summaries, setSummaries] = useState<ReportSummary[]>([]);
  const [details, setDetails] = useState<VisitDetail[]>([]);
  const [track, setTrack] = useState<TrackingPoint[]>([]); // Menyimpan seluruh jejak perjalanan harian
  const [selectedSummary, setSelectedSummary] = useState<{ mandorId: string; date: string } | null>(null);

  // STATE BARU: Untuk melacak item detail yang dipilih
  const [selectedDetails, setSelectedDetails] = useState<VisitDetail[]>([]);

  const search = useCallback(async (f: ReportFilterState) => {
    setError(null);
    setLoading(true);
    try {
      const [s, d] = await Promise.all([ fetchDashboardStats(f), fetchVisitDetails(f) ]);
      setSummaries(s);
      setDetails(d);
      // Reset state lainnya saat pencarian baru
      setTrack([]);
      setSelectedSummary(null);
      setSelectedDetails([]); // <-- Reset pilihan detail
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Gagal memuat data laporan"));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTrackFor = useCallback(async (mandorId: string, date: string) => {
    // Jika user mengklik baris yang sama, jangan lakukan apa-apa
    if (selectedSummary?.mandorId === mandorId && selectedSummary?.date === date) return;

    setError(null);
    setLoading(true);
    try {
      const pts = await fetchTrackingPoints(mandorId, date);
      setTrack(pts);
      setSelectedSummary({ mandorId, date });
      setSelectedDetails([]); // <-- Reset pilihan detail saat memilih mandor/hari baru
    } catch (e: unknown) {
      setError(getErrorMessage(e, "Gagal memuat data jejak perjalanan"));
    } finally {
      setLoading(false);
    }
  }, [selectedSummary]);
  
  // LOGIKA BARU: Membuat data polyline untuk peta berdasarkan pilihan
  const mapPolylines = useMemo((): TrackingPoint[][] => {
    if (!track.length) return [];
    
    // Jika tidak ada detail yang dipilih (termasuk saat "Pilih Semua" dicentang), tampilkan seluruh rute harian
    if (selectedDetails.length === 0 || selectedDetails.length === details.length) return [track];

    const polylines: TrackingPoint[][] = [];
    const parseTime = (timeStr: string, dateStr: string): Date => {
        // Menggunakan date-fns untuk parsing yang lebih andal
        return parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm:ss', new Date());
    };

    selectedDetails.forEach(detail => {
      if (!detail.jam_masuk || !detail.jam_keluar || !selectedSummary?.date) return;

      const startTime = parseTime(detail.jam_masuk, selectedSummary.date).getTime();
      const endTime = parseTime(detail.jam_keluar, selectedSummary.date).getTime();

      const segment = track.filter(point => {
        const pointTime = new Date(point.timestamp).getTime();
        return pointTime >= startTime && pointTime <= endTime;
      });
      
      if (segment.length > 0) {
        polylines.push(segment);
      }
    });

    return polylines;
  }, [track, details, selectedDetails, selectedSummary]);

  return { 
    loading, error, summaries, details, track, 
    selectedSummary,
    selectedDetails,       // <-- Ekspor state baru
    setSelectedDetails,  // <-- Ekspor setter-nya
    mapPolylines,        // <-- Ekspor data polyline yang sudah diproses
    search, 
    loadTrackFor 
  };
}

