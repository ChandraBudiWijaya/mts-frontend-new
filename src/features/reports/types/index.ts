// src/features/reports/types/index.ts
export interface ReportSummary {
  id: string; // employee_id
  mandor: string;
  plantation_group: string;
  wilayah: string;
  tanggal: string;         // YYYY-MM-DD
  total_lokasi: number;
  total_area_ha?: number;
}

export interface VisitDetail {
  id: string;              // employee_id
  mandor: string;
  lokasi: string;
  tanggal: string;         // YYYY-MM-DD
  jam_masuk: string;       // HH:mm:ss
  jam_keluar: string;      // HH:mm:ss
  total_lokasi: number;
  durasi_menit: number;
}

export interface TrackingPoint {
  lat: number;
  lng: number;
  timestamp: string;       // ISO
}

export interface ReportFilterState {
  pg?: string;
  wilayah?: string;
  mandorId?: string;
  dateStart: string;
  dateEnd: string;
}

