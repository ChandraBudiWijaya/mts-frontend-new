import type { Geofence } from '@/shared/types';

// Tipe untuk filter di halaman daftar lokasi
export interface LocationFilter {
  pg_group: string;
  region: string;
  q?: string;
}

// Tipe untuk data detail lokasi yang ditampilkan
export interface LocationDetailData {
  center: { lat: number; lng: number } | null;
  polygon: { lat: number; lng: number }[];
  meta: {
    pg_group?: string;
    region?: string;
    location_code?: string;
    area_size?: number | string;
    name?: string;
  } | null;
}

// Kita bisa menggunakan kembali tipe Geofence dari shared/types
export type LocationRow = Geofence;