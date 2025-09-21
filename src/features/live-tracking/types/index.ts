// Tipe data untuk master data filter
export type PG = { id: string; code: string; name: string };
export type Wilayah = { id: string; code: string; name: string; pgId: string };
export type Mandor = {
  id: string; 
  name: string; 
  avatarUrl?: string;
  pgId: string; 
  wilayahId: string; 
  code?: string;
};

// Tipe data untuk titik lokasi live dari Firebase
export type LivePoint = {
  mandorId: string;
  pgId: string;
  wilayahId: string;
  lat: number;
  lng: number;
  batteryPct?: number;
  speed?: number;
  heading?: number;
  nearestLocCode?: string;
  accuracy?: number;
  updatedAt?: any; // Tipe Timestamp Firebase
};

// Tipe data untuk state filter
export interface LiveTrackingFilterState {
  pgId?: string;
  wilayahId?: string;
  mandorId?: string;
}
