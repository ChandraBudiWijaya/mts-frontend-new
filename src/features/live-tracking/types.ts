// src/features/live-tracking/types.ts
export type PG = { id: string; code: string; name: string };
export type Wilayah = { id: string; code: string; name: string; pgId: string };
export type Mandor = {
  id: string; name: string; avatarUrl?: string;
  pgId: string; wilayahId: string; code?: string;
};

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
  updatedAt?: any; // Timestamp
};
