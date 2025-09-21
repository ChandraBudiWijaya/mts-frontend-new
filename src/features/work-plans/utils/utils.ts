// src/features/workplans/utils.ts
import type { WorkPlanRow } from '../types';

export function parsePgWilayahFromLocationCode(locationCode?: string | null) {
  if (!locationCode || typeof locationCode !== 'string') return { pg: null, wilayah: null };
  if (!locationCode.includes('-')) return { pg: null, wilayah: null };
  const [pg, wil] = locationCode.split('-').map(s => s.trim());
  return { pg: pg || null, wilayah: wil || null };
}

export function mapWorkPlanRow(it: any): WorkPlanRow {
  const gf = it.geofence || {};
  const locationCode = gf.location_code || gf.code || gf.name;
  const parsed = parsePgWilayahFromLocationCode(locationCode);
  const wilayah = it.wilayah ?? gf.wilayah ?? gf.region ?? parsed.wilayah ?? null;
  const pg = it.plantation_group ?? it.pg ?? gf.plantation_group ?? gf.pg_group ?? parsed.pg ?? null;

  return {
    id: it.id,
    date: it.date,
    spk_number: it.spk_number ?? null,
    activity: it.activity ?? it.activity_description ?? '-',
    status: it.status,
    employee: it.employee ? { id: String(it.employee.id), name: it.employee.name } : null,
    geofence: it.geofence ? { id: it.geofence.id, name: it.geofence.name, location_code: it.geofence.location_code } : null,
    wilayah,
    pg,
    created_by: it.created_by ?? null,
    approved_by: it.approved_by ?? null,
    created_at: it.created_at,
    updated_at: it.updated_at,
  };
}

export function fmtDateDMY(d: string) {
  // input: YYYY-MM-DD
  const [y, m, day] = d.split('-');
  return [day, m, y].join('/');
}

export function applyFilter(rows: WorkPlanRow[], f: {
  plantation_group?: string; wilayah?: string; mandor?: string; date?: string;
}) {
  const pg = (f.plantation_group ?? '').toLowerCase();
  const wil = (f.wilayah ?? '').toLowerCase();
  const md = (f.mandor ?? '').toLowerCase();
  const dt = (f.date ?? '');

  return rows.filter(r => {
    const okDate = dt ? r.date === dt : true;
    const okMandor = md ? (r.employee?.name?.toLowerCase().includes(md) ?? false) : true;
    const okPg = pg ? (r.pg ? r.pg.toLowerCase().includes(pg) : false) : true;
    const okWil = wil ? (r.wilayah ? r.wilayah.toLowerCase().includes(wil) : false) : true;
    return okDate && okMandor && okPg && okWil;
  });
}
