import React, { useEffect, useMemo, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input, Alert } from "../../../components/ui";
import type { NewParameterFormData } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: NewParameterFormData) => Promise<void>;
  existingGroups: string[];
};

const emptyForm: NewParameterFormData = {
  param_key: "",
  param_value: "",
  description: "",
  group_name: "",
  status: true,
};

const AddParameterModal: React.FC<Props> = ({ isOpen, onClose, onCreate, existingGroups }) => {
  const [form, setForm] = useState<NewParameterFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm);
      setError(null);
    }
  }, [isOpen]);

  const canSubmit = useMemo(
    () => form.param_key.trim().length > 0 && form.param_value.trim().length > 0,
    [form]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setLoading(true);
      setError(null);
      await onCreate(form);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create parameter");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Parameter</h3>
          <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && <Alert variant="error" className="mb-3">{error}</Alert>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parameter Key <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.param_key}
              onChange={(e) => setForm((p) => ({ ...p, param_key: e.target.value.trim() }))}
              placeholder="e.g. tracking_sunday_enabled"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Gunakan snake_case; contoh: <code>tracking_start_time_weekday</code>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={form.param_value}
              onChange={(e) => setForm((p) => ({ ...p, param_value: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Masukkan nilai parameter…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Deskripsi singkat…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
            <input
              list="param-groups"
              value={form.group_name}
              onChange={(e) => setForm((p) => ({ ...p, group_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Aplikasi Mobile / Penjadwalan / Sinkronisasi"
            />
            <datalist id="param-groups">
              {existingGroups?.map((g) => <option key={g} value={g} />)}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={form.status.toString()}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value === "true" }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={onClose} variant="secondary" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || loading} className="bg-green-600 hover:bg-green-700 text-white">
              {loading ? "Saving…" : "Create Parameter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParameterModal;
