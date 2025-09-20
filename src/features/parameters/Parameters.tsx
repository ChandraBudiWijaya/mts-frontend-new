import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PencilIcon, TrashIcon, XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Card, Button, Input, LoadingSpinner, Alert } from "../../components/ui";
import { parametersAPI } from "../../shared/api";
import type { Parameter, ParameterFormData, ParameterFilters, NewParameterFormData } from "./types";
import { getErrorMessage } from "../../shared/utils/errorHandler";
import FilterBar from "./components/FilterBar";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { normalizeParameter, unwrapListPayload } from "./utils/normalizers";
import AddParameterModal from "./components/AddParameterModal";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";

const FILTERS_STORAGE_KEY = "mts:parameters:filters";

const Parameters: React.FC = () => {
  // ---- state
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // filters
  const [filters, setFilters] = useState<ParameterFilters>(() => {
    const saved = localStorage.getItem(FILTERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : { group: "", status: "", search: "" };
  });
  const debouncedSearch = useDebouncedValue(filters.search, 500);
  const effectiveFilters = useMemo<ParameterFilters>(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch]);

  // modal edit
  const [showModal, setShowModal] = useState(false);
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(null);
  const [formData, setFormData] = useState<ParameterFormData>({ param_value: "", description: "", status: true });

  // modal add
  const [showAdd, setShowAdd] = useState(false);

  // delete
  const [deleteTarget, setDeleteTarget] = useState<Parameter | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ---- helpers
  const onFilterChange = (next: Partial<ParameterFilters>) => setFilters((p) => ({ ...p, ...next }));
  const resetFilters = () => setFilters({ group: "", status: "", search: "" });

  // ---- API
  const loadGroups = useCallback(async () => {
    try {
      setLoadingGroups(true);
      setError(null);
      const res = await parametersAPI.getGroups();
      setGroups(unwrapListPayload(res) as string[]);
    } catch (err) {
      setError(getErrorMessage(err, "Error loading groups"));
      setGroups([]);
    } finally {
      setLoadingGroups(false);
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

  const openEdit = async (id: number) => {
    try {
      setError(null);
      const res = await parametersAPI.getById(id);
      const raw = res?.data?.data ?? res?.data;
      const p = normalizeParameter(raw);
      setEditingParameter(p);
      setFormData({ param_value: p.param_value, description: p.description || "", status: p.status });
      setShowModal(true);
    } catch (err) {
      setError(getErrorMessage(err, "Error loading parameter"));
    }
  };

  const submitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParameter) return;
    try {
      await parametersAPI.update(editingParameter.id, { ...formData } as Record<string, unknown>);
      setShowModal(false);
      setEditingParameter(null);
      setSuccess("Parameter updated successfully!");
      setTimeout(() => setSuccess(null), 2500);
      loadParameters();
    } catch (err) {
      setError(getErrorMessage(err, "Error updating parameter"));
    }
  };

  const createParameter = async (payload: NewParameterFormData) => {
    // pastikan API kamu punya endpoint create
    await parametersAPI.create(payload as unknown as Record<string, unknown>);
    setSuccess("Parameter created!");
    setTimeout(() => setSuccess(null), 2000);
    await loadParameters();
    // refresh groups kalau ada group_name baru
    if (payload.group_name && !groups.includes(payload.group_name)) loadGroups();
  };

  const confirmDelete = (p: Parameter) => setDeleteTarget(p);

  const doDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await parametersAPI.remove(deleteTarget.id);
      setDeleteTarget(null);
      setSuccess("Parameter deleted.");
      setTimeout(() => setSuccess(null), 2000);
      loadParameters();
    } catch (err) {
      setError(getErrorMessage(err, "Error deleting parameter"));
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => { loadGroups(); }, [loadGroups]);
  useEffect(() => { loadParameters(); }, [loadParameters]);
  useEffect(() => { localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters)); }, [filters]);

  // ---- UI
  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Parameter Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowAdd(true)} className="bg-green-600 hover:bg-green-700 text-white">
            <PlusIcon className="h-4 w-4 mr-1" /> Add Parameter
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Filters */}
      <FilterBar
        groups={groups}
        filters={filters}
        onChange={onFilterChange}
        onReset={resetFilters}
        onReload={loadParameters}
        loading={loading}
        total={parameters.length}
      />

      {/* Table */}
      <Card>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter Key</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parameters.map((param) => (
                    <tr key={param.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{param.param_key}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        <div className="truncate" title={param.param_value}>{param.param_value}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {param.group_name || "No Group"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          param.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {param.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEdit(param.id)}
                            className="text-green-700 hover:text-green-900 flex items-center gap-1"
                            title={`Edit ${param.param_key}`}
                          >
                            <PencilIcon className="h-4 w-4" /> Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(param)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            title={`Delete ${param.param_key}`}
                          >
                            <TrashIcon className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {parameters.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No parameters found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Edit Modal (punyamu sudah OK) */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Parameter</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={submitUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parameter Key</label>
                <Input type="text" value={editingParameter?.param_key || ""} readOnly className="bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value <span className="text-red-500">*</span></label>
                <textarea
                  value={formData.param_value}
                  onChange={(e) => setFormData((p) => ({ ...p, param_value: e.target.value }))}
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter parameter value…"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter parameter description…"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status.toString()}
                  onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value === "true" }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" onClick={() => setShowModal(false)} variant="secondary" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">Cancel</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Update Parameter</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <AddParameterModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={createParameter}
        existingGroups={groups}
      />

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={doDelete}
        loading={deleting}
        title={`Delete "${deleteTarget?.param_key}"?`}
        message="Parameter akan dihapus permanen."
      />
    </div>
  );
};

export default Parameters;
