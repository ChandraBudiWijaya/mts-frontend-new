import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Card, Button, Alert } from "../../components/ui";
import type { Parameter, ParameterFormData } from "./types";
import { useParameters } from "./hooks/useParameters";

// Impor komponen-komponen UI
import FilterBar from "./components/FilterBar";
import ParameterTable from "./components/ParameterTable";
import AddParameterModal from "./components/AddParameterModal";
import EditParameterModal from "./components/EditParameterModal";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";

const Parameters: React.FC = () => {
  // Semua state dan logika sekarang berasal dari satu hook
  const {
    parameters, groups, loading, error, success,
    filters, setFilters, loadParameters,
    createParameter, updateParameter, deleteParameter,
  } = useParameters();

  // State lokal hanya untuk mengontrol tampilan modal
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(null);
  const [deletingParameter, setDeletingParameter] = useState<Parameter | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleUpdate = async (id: number, data: ParameterFormData) => {
    await updateParameter(id, data);
    setEditingParameter(null); // Tutup modal setelah selesai
  };

  const handleDelete = async () => {
    if (!deletingParameter) return;
    setSubmitting(true);
    try {
      await deleteParameter(deletingParameter.id);
    } catch (e) {
      // Error sudah ditangani di hook, tidak perlu menampilkan alert lagi di sini
      console.error(e);
    } finally {
      setSubmitting(false);
      setDeletingParameter(null); // Tutup dialog konfirmasi
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Parameter Management</h1>
        <Button onClick={() => setAddModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white">
          <PlusIcon className="h-4 w-4 mr-1" /> Add Parameter
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <FilterBar
        groups={groups}
        filters={filters}
        onChange={(f) => setFilters(prev => ({ ...prev, ...f }))}
        onReset={() => setFilters({ group: "", status: "", search: "" })}
        onReload={loadParameters}
        loading={loading}
        total={parameters.length}
      />

      <Card>
        <ParameterTable
          parameters={parameters}
          loading={loading}
          onEdit={(param) => setEditingParameter(param)}
          onDelete={(param) => setDeletingParameter(param)}
        />
      </Card>

      {/* Modals & Dialogs */}
      <AddParameterModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreate={createParameter}
        existingGroups={groups}
      />

      <EditParameterModal
        isOpen={!!editingParameter}
        onClose={() => setEditingParameter(null)}
        parameter={editingParameter}
        onUpdate={handleUpdate}
      />

      <ConfirmDeleteDialog
        isOpen={!!deletingParameter}
        onClose={() => setDeletingParameter(null)}
        onConfirm={handleDelete}
        loading={isSubmitting}
        title={`Delete "${deletingParameter?.param_key}"?`}
        message="Parameter akan dihapus permanen."
      />
    </div>
  );
};

export default Parameters;
