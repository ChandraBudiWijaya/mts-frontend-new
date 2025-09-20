// Mock data and helper functions for the Reporting page
export type ReportRow = {
  id: string;
  pg: string;
  wilayah: string;
  mandor: string;
  tanggal: string; // ISO date string
  totalLokasi: number;
  totalCoverageHa: number;
};

export type ReportDetail = ReportRow & {
  lokasiName: string;
  keluarLokasi?: string;
  totalDurasi?: string;
};

export const sampleReportRows: ReportRow[] = [
  { id: '1', pg: 'PG 1', wilayah: 'W01', mandor: 'Budi', tanggal: '2025-01-11', totalLokasi: 6, totalCoverageHa: 45 },
  { id: '2', pg: 'PG 1', wilayah: 'W01', mandor: 'Andi', tanggal: '2025-01-11', totalLokasi: 5, totalCoverageHa: 30 },
  { id: '3', pg: 'PG 1', wilayah: 'W01', mandor: 'Joko', tanggal: '2025-01-11', totalLokasi: 7, totalCoverageHa: 52 },
  { id: '4', pg: 'PG 1', wilayah: 'W01', mandor: 'Sulton', tanggal: '2025-01-11', totalLokasi: 5, totalCoverageHa: 26 },
  { id: '5', pg: 'PG 1', wilayah: 'W01', mandor: 'Dedi', tanggal: '2025-01-11', totalLokasi: 4, totalCoverageHa: 34 },
];

export function fetchReportRows(filter?: Partial<ReportRow>): Promise<ReportRow[]> {
  // Simple mock filter implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      let rows = sampleReportRows;
      if (filter) {
        rows = rows.filter(r => {
          if (filter.pg && r.pg !== filter.pg) return false;
          if (filter.wilayah && r.wilayah !== filter.wilayah) return false;
          if (filter.mandor && r.mandor !== filter.mandor) return false;
          return true;
        });
      }
      resolve(rows);
    }, 150);
  });
}

// Synchronous helper used by the Reporting mock page. Returns a small
// summary (one row per mandor/day) and a details list simulating
// lokasi visits for the selected filters. This keeps the page simple
// for a mock implementation and matches the import used in
// `src/components/reporting/Reporting.tsx`.
export function getReportSummary(filter?: Partial<ReportRow>) {
  // Apply the same filtering logic synchronously
  let rows = sampleReportRows;
  if (filter) {
    rows = rows.filter(r => {
      if (filter.pg && r.pg !== filter.pg) return false;
      if (filter.wilayah && r.wilayah !== filter.wilayah) return false;
      if (filter.mandor && r.mandor !== filter.mandor) return false;
      return true;
    });
  }

  // For details, expand each summary row into several mock location entries
  const details: ReportDetail[] = rows.flatMap((r) => {
    const count = Math.max(1, r.totalLokasi);
    return Array.from({ length: count }).map((_, idx) => ({
      id: `${r.id}-loc-${idx + 1}`,
      pg: r.pg,
      wilayah: r.wilayah,
      mandor: r.mandor,
      tanggal: r.tanggal,
      totalLokasi: 1,
      totalCoverageHa: Math.round(r.totalCoverageHa / Math.max(1, count)),
      lokasiName: `Lokasi ${idx + 1}`,
      keluarLokasi: '08:00',
      totalDurasi: `${5 + idx * 2} Menit`,
    }));
  });

  return {
    summary: rows,
    details,
  };
}
