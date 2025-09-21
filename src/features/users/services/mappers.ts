/**
 * features/users/services/mappers.ts
 * ------------------------------------------------------------
 * Kumpulan util mapper/normalizer data response API → bentuk yang
 * konsisten di UI. Mengatasi variasi payload (array langsung, {data:[]},
 * atau {data:{data:[], total}}).
 */
export function normalizeApiList<T = any>(payload: any): { data: T[]; total: number } {
  if (Array.isArray(payload)) return { data: payload, total: payload.length };
  if (Array.isArray(payload?.data)) return { data: payload.data, total: payload.data.length };
  if (Array.isArray(payload?.data?.data)) {
    const total = typeof payload?.data?.total === 'number' ? payload.data.total : payload.data.data.length;
    return { data: payload.data.data, total };
  }
  return { data: [], total: 0 };
}
