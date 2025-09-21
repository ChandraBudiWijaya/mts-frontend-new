import { useMemo, useState } from "react";
import { useLivePositions } from "./useLivePositions";
import { usePGs, useWilayah, useMandors } from "./useMasterData";
import type { Mandor, LiveTrackingFilterState } from "../types";

/**
 * Hook utama yang mengelola semua state dan data untuk halaman Live Tracking.
 */
export function useLiveTracking() {
  // State untuk filter yang sedang diubah oleh user
  const [filters, setFilters] = useState<LiveTrackingFilterState>({});
  
  // State untuk filter yang sudah diterapkan (setelah klik Search)
  const [appliedFilters, setAppliedFilters] = useState<LiveTrackingFilterState>({});

  // Mengambil data master untuk opsi filter
  const pgOptions = usePGs();
  const wilayahOptions = useWilayah(filters.pgId);
  const mandorOptions = useMandors(filters.pgId, filters.wilayahId);

  // Mengambil data posisi live berdasarkan filter yang sudah diterapkan
  const livePositions = useLivePositions(appliedFilters);
  
  // Membuat lookup table untuk data mandor agar akses lebih cepat di komponen Map
  const mandorLookup = useMemo<Record<string, Mandor | undefined>>(() => {
    // Gunakan data mandor dari filter saat ini agar popup tetap menampilkan nama
    // meskipun mandor tersebut tidak lagi masuk dalam filter yang diterapkan
    const allMandors = mandorOptions.concat(
      // Tambahkan data mandor dari posisi live jika belum ada
      livePositions.map(p => ({ id: p.mandorId, name: p.mandorId })) as Mandor[]
    );
    const uniqueMandors = Array.from(new Map(allMandors.map(m => [m.id, m])).values());
    
    const lookup: Record<string, Mandor> = {};
    uniqueMandors.forEach(m => { lookup[m.id] = m });
    return lookup;
  }, [mandorOptions, livePositions]);
  
  // Fungsi untuk menerapkan filter
  const handleSearch = () => {
    setAppliedFilters(filters);
  };

  return {
    filters,
    setFilters,
    pgOptions,
    wilayahOptions,
    mandorOptions,
    livePositions,
    mandorLookup,
    handleSearch,
  };
}
