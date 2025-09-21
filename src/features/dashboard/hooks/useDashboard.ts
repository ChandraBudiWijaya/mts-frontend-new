// src/features/dashboard/hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { dashboardAPI, masterDataAPI } from '@/shared/api';
import { format, subDays } from 'date-fns';
import type { DashboardStats, DashboardFilter } from '../types';
import { getErrorMessage } from '@/shared/utils/errorHandler';

const initialFilters: DashboardFilter = {
  start_date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
  end_date: format(new Date(), 'yyyy-MM-dd'),
  plantation_group: '',
  wilayah: '',
};

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<DashboardFilter>(initialFilters);

  // State untuk dropdown filter
  const [pgOptions, setPgOptions] = useState<string[]>([]);
  const [wilayahOptions, setWilayahOptions] = useState<string[]>([]);

  const fetchData = useCallback(async (currentFilters: DashboardFilter) => {
    try {
      setLoading(true);
      setError('');
      const response = await dashboardAPI.getStats(currentFilters);
      setStats(response.data || {});
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat data dashboard.'));
      setStats({}); // Reset data on error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFilterOptions = useCallback(async () => {
    try {
        const [pgRes, wRes] = await Promise.all([
          masterDataAPI.getPlantationGroups(),
          masterDataAPI.getWilayah(),
        ]);
        setPgOptions(pgRes.data.data?.map((item: any) => item.value) || []);
        setWilayahOptions(wRes.data.data?.map((item: any) => item.value) || []);
    } catch (err) {
        console.error("Failed to load filter options", err);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
        fetchData(filters);
    }, 300); // Debounce fetch data untuk mencegah request berlebihan saat user mengetik
    return () => clearTimeout(handler);
  }, [filters, fetchData]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  return {
    stats,
    loading,
    error,
    filters,
    setFilters,
    pgOptions,
    wilayahOptions
  };
}

