// src/features/dashboard/types/index.ts
export interface DataPoint {
  [key: string]: any;
  total?: number;
}

export interface KunjunganWilayah {
    region: string;
    total_kunjungan: number;
}

export interface CoverageMandor {
    name: string;
    total_coverage: string;
}

export interface DashboardStats {
  totalUserAktif?: DataPoint[];
  totalLokasiTerkunjungi?: DataPoint[];
  kunjunganPerWilayah?: KunjunganWilayah[];
  coveragePerMandor?: CoverageMandor[];
}

export interface DashboardFilter {
  start_date: string;
  end_date: string;
  plantation_group: string;
  wilayah: string;
}
