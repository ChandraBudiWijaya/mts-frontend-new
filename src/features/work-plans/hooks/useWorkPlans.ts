// src/features/workplans/hooks/useWorkPlans.ts
import { useCallback, useEffect, useMemo, useState } from 'react';
import { workPlanAPI } from '../../../shared/api';
import type { WorkPlanFilters, WorkPlanRow } from '../types';
import { applyFilter, mapWorkPlanRow } from '../utils';

export function useWorkPlans() {
  const [allRows, setAllRows] = useState<WorkPlanRow[]>([]);
  const [rows, setRows] = useState<WorkPlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<WorkPlanFilters>({
    plantation_group: '', wilayah: '', mandor: '', date: ''
  });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await workPlanAPI.getAll();
      const list: any[] = (res.data?.data as any[]) ?? (Array.isArray(res.data) ? res.data : []);
      const mapped = list.map(mapWorkPlanRow);
      setAllRows(mapped);
      setRows(mapped);
      setError(null);
    } catch (e) {
      console.error('Error loading work plans', e);
      setError('Gagal memuat data rencana kerja');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const apply = useCallback((f: WorkPlanFilters) => {
    setRows(applyFilter(allRows, f));
  }, [allRows]);

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await workPlanAPI.getAll();
      const list: any[] = (res.data?.data as any[]) ?? (Array.isArray(res.data) ? res.data : []);
      const mapped = list.map(mapWorkPlanRow);
      setAllRows(mapped);
      setRows(applyFilter(mapped, filters));
    } finally {
      setRefreshing(false);
    }
  }, [filters]);

  const create = useCallback(async (payload: {
    date: string; employee_id: string;
    geofence_id?: number; location_code?: string;
    spk_number?: string; activity_description: string;
  }) => {
    await workPlanAPI.create(payload as any);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: number) => {
    await workPlanAPI.delete(id);
    await refresh();
  }, [refresh]);

  return {
    state: { rows, allRows, loading, refreshing, error, filters },
    actions: { setFilters, apply, refresh, load, create, remove },
  };
}
