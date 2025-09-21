import { useCallback, useEffect, useMemo, useState } from "react";
import { parametersAPI } from "../../../shared/api";
import { getErrorMessage } from "../../../shared/utils/errorHandler";
import { normalizeParameter, unwrapListPayload } from "../utils/normalizers";
import type { Parameter, ParameterFilters, NewParameterFormData, ParameterFormData } from "../types";
import { useDebouncedValue } from "./useDebouncedValue";

const FILTERS_STORAGE_KEY = "mts:parameters:filters";

export function useParameters() {
  // State utama
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State untuk filter
  const [filters, setFilters] = useState<ParameterFilters>(() => {
    const saved = localStorage.getItem(FILTERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : { group: "", status: "", search: "" };
  });
  const debouncedSearch = useDebouncedValue(filters.search, 500);
  const effectiveFilters = useMemo(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch]);

  // Fungsi untuk menampilkan notifikasi sukses sementara
  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 2500);
  };

  // Logika API
  const loadGroups = useCallback(async () => {
    try {
      const res = await parametersAPI.getGroups();
      setGroups(unwrapListPayload(res) as string[]);
    } catch (err) {
      setError(getErrorMessage(err, "Error loading groups"));
    }
  }, []);

  const loadParameters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, unknown> = {};
      if (effectiveFilters.group) params.group = effectiveFilters.group;
      if (effectiveFilters.status) params.status = effectiveFilters.status;
      if (effectiveFilters.search) params.search = effectiveFilters.search;

      const res = await parametersAPI.getAll(params);
      setParameters(unwrapListPayload(res).map(normalizeParameter));
    } catch (err) {
      setError(getErrorMessage(err, "Error loading parameters"));
      setParameters([]);
    } finally {
      setLoading(false);
    }
  }, [effectiveFilters]);

  const createParameter = async (payload: NewParameterFormData) => {
    try {
      await parametersAPI.create(payload as unknown as Record<string, unknown>);
      showSuccess("Parameter created successfully!");
      await loadParameters();
      if (payload.group_name && !groups.includes(payload.group_name)) {
        await loadGroups();
      }
    } catch (err) {
      const message = getErrorMessage(err, "Error creating parameter");
      setError(message);
      throw new Error(message); // Lempar error agar bisa ditangkap di komponen
    }
  };

  const updateParameter = async (id: number, payload: ParameterFormData) => {
     try {
      await parametersAPI.update(id, payload as Record<string, unknown>);
      showSuccess("Parameter updated successfully!");
      await loadParameters();
    } catch (err) {
      const message = getErrorMessage(err, "Error updating parameter");
      setError(message);
      throw new Error(message); // Lempar error
    }
  };
  
  const deleteParameter = async (id: number) => {
    try {
      await parametersAPI.remove(id);
      showSuccess("Parameter deleted successfully.");
      await loadParameters();
    } catch (err) {
      const message = getErrorMessage(err, "Error deleting parameter");
      setError(message);
      throw new Error(message); // Lempar error
    }
  };

  // Effects untuk memuat data awal dan menyimpan filter
  useEffect(() => { loadGroups(); }, [loadGroups]);
  useEffect(() => { loadParameters(); }, [loadParameters]);
  useEffect(() => { localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters)); }, [filters]);

  return {
    parameters,
    groups,
    loading,
    error,
    success,
    filters,
    setFilters,
    loadParameters,
    createParameter,
    updateParameter,
    deleteParameter,
  };
}