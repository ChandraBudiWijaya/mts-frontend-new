// src/features/workplans/index.tsx
import { useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';

import { useWorkPlans } from './hooks/useWorkPlans';
import { usePGWilayahOptions } from './hooks/useMasterData';
import { usePagination } from './hooks/usePagination';
import Filters from './components/Filters';
import Table from './components/Table';
import Pagination from './components/Pagination';
import AddModal from './components/AddModal';
import DetailModal from './components/DetailModal';
import DeleteDialog from './components/DeleteDialog';


export default function WorkPlans() {
  const { state, actions } = useWorkPlans();
  const { rows, loading, refreshing, error, filters } = state;
  const { setFilters, apply, refresh, create, remove } = actions;

  const { pgOptions, wilayahOptions } = usePGWilayahOptions();
  const { page, setPage, perPage, onPerPage, total, totalPages, data, canPrev, canNext } = usePagination(rows, 10);

  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const startIndex = useMemo(() => (page - 1) * perPage, [page, perPage]);

  const onDebouncedFilter = (v: typeof filters) => {
    apply(v);
    setPage(1);
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Rencana Kerja</h1>
          <p className="text-sm text-gray-500">Daftar rencana kerja, filter dan aksi</p>
        </div>
        <div className="flex justify-end gap-2 mb-3">
          <Button
            variant="secondary"
            onClick={refresh}
            loading={refreshing}
            className="bg-white border border-primary-600 text-primary-700 hover:bg-primary-50"
            icon={<ArrowPathIcon className="w-4 h-4" />}
          >
            Refresh
          </Button>
          <Button onClick={() => setAddOpen(true)} icon={<PlusIcon className="w-4 h-4" />}>
            Tambah Rencana
          </Button>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        {/* Filters */}
        <Filters
          value={filters}
          onChange={setFilters}
          onDebouncedChange={onDebouncedFilter}
          pgOptions={pgOptions}
          wilayahOptions={wilayahOptions}
        />
      
    </div>

    {/* Table */}
    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        {loading ? (
          <div className="py-12 flex items-center justify-center gap-3 text-gray-600">
            <LoadingSpinner /><span>Memuat rencana kerja...</span>
          </div>
        ) : (
          <>
            <Table
              rows={data}
              startIndex={startIndex}
              onDetail={(r) => setSelected(r)}
              onDelete={(r) => setDeleteTarget(r)}
            />
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              total={total}
              perPage={perPage}
              onPerPage={onPerPage}
            />
          </>
        )}

    </div>

      {/* Modals */}
      <AddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        defaultFilters={{ wilayah: filters.wilayah, plantation_group: filters.plantation_group }}
        onSubmit={async (payload) => {
          await create(payload);
        }}
      />

      <DetailModal row={selected} onClose={() => setSelected(null)} />

      <DeleteDialog
        row={deleteTarget}
        deleting={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            setDeleting(true);
            await remove(deleteTarget.id);
            setDeleteTarget(null);
          } finally {
            setDeleting(false);
          }
        }}
      />
    </div>
  );
}
