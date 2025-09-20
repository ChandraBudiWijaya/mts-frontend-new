// src/features/workplans/hooks/useMasterData.ts
import { useEffect, useState } from 'react';
import { masterDataAPI, geofenceAPI, employeeAPI } from '../../../shared/api';
import type { Option, EmployeeLite } from '../types';

export function usePGWilayahOptions() {
  const [pgOptions, setPgOptions] = useState<Option[]>([]);
  const [wilayahOptions, setWilayahOptions] = useState<Option[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [pgRes, wRes] = await Promise.all([
          masterDataAPI.getPlantationGroups().catch(() => null),
          masterDataAPI.getWilayah().catch(() => null),
        ]);
        const pg = (pgRes?.data?.data as any[]) ?? [];
        const wil = (wRes?.data?.data as any[]) ?? [];
        setPgOptions(pg.map((p: any) => ({ value: String(p.value ?? p.id ?? p.label), label: String(p.label ?? p.name ?? p.value) })));
        setWilayahOptions(wil.map((w: any) => ({ value: String(w.value ?? w.id ?? w.label), label: String(w.label ?? w.name ?? w.value) })));
      } catch { /* no-op */ }
    })();
  }, []);

  return { pgOptions, wilayahOptions };
}

export async function fetchLokasiOptionsByFilter(wilayah: string, pg: string): Promise<Option[]> {
  const [lokWil, lokPg] = await Promise.all([
    wilayah ? masterDataAPI.getLokasiByWilayah(wilayah).catch(() => null) : Promise.resolve(null),
    pg ? masterDataAPI.getLokasiByPg(pg).catch(() => null) : Promise.resolve(null),
  ]);

  const a: any[] = lokWil?.data?.data ?? [];
  const b: any[] = lokPg?.data?.data ?? [];
  if (a.length || b.length) {
    const src = a.length ? a : b;
    return src.map((it: any) => ({ value: String(it.value ?? it.id ?? it.location_code), label: String(it.label ?? it.name ?? it.location_code ?? it.value) }));
  }

  const geos = await geofenceAPI.getAll().catch(() => null);
  const geoRows: any[] = (geos?.data?.data as any[]) ?? [];
  return geoRows.map((g: any) => ({ value: String(g.id), label: String(g.location_code ?? g.name) }));
}

export async function fetchEmployees(): Promise<EmployeeLite[]> {
  const emps = await employeeAPI.getAll().catch(() => null);
  const rows: any[] = (emps?.data?.data as any[]) ?? [];
  return rows.map(e => ({ id: String(e.employee_id ?? e.id), name: e.name }));
}
