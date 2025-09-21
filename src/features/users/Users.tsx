/**
 * features/users/Users.tsx
 * ------------------------------------------------------------
 * Halaman utama Master User (orchestrator):
 * - Menggunakan useUsers() untuk data & CRUD
 * - Menggunakan useUserOptions() untuk opsi dropdown
 * - Merangkai komponen presentational (Filter, Table, Modal)
 * State list/filters/pagination tersentral di hook.
 */
import { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';

import { useUsers } from './hooks/useUsers';
import { useUserOptions } from './hooks/useUserOptions';
import UsersTable from './components/UsersTable';
import UserFilters from './components/UserFilters';
import EditUserForm from './components/EditUserForm';
import AddUserForm, { type AddUserValues } from './components/AddUserForm';
import type { Employee, EmployeeForm } from '@/shared/types';

export default function Users() {
  const {
    data, total, loading, refreshing, error,
    page, setPage, perPage, setPerPage,
    filters, setFilters,
    fetch, refresh, create, update, remove,
  } = useUsers();

  const { pgOptions, positionOptions, wilayahOptions, roles } = useUserOptions();

  // modals & selection
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', position: '',
    plantation_group: '', wilayah: '', role_id: '' as number | '', is_active: true,
  });

  const openAdd = () => { setIsAddOpen(true); };
  const openEdit = (row: Employee) => {
    setSelected(row);
    const roleName = Array.isArray(row.roles) && row.roles.length > 0 ? row.roles[0] : '';
    const roleId = roles.find(r => r.name === roleName)?.id ?? '';
    setForm({
      name: row.name || '',
      email: row.user?.email || row.email || '',
      phone: (row as any).phone || '',
      position: row.position || '',
      plantation_group: row.plantation_group || '',
      wilayah: (row as any).wilayah || '',
      role_id: roleId as any,
      is_active: !!row.is_active,
    } as any);
    setIsEditOpen(true);
  };
  const openView = (row: Employee) => { setSelected(row); setIsViewOpen(true); };

  const submitAdd = async (values: AddUserValues) => {
    const payload: EmployeeForm = {
      id: values.id, name: values.name, position: values.position, phone: values.phone,
      plantation_group: values.plantation_group, wilayah: values.wilayah,
      email: values.email, password: values.password, role_id: values.role_id, is_active: true,
    };
    await create(payload, values.photoFile ?? undefined);
    setIsAddOpen(false);
    setPage(1);
    await fetch();
  };

  const submitEdit = async () => {
    if (!selected) return;
    const empId = (selected.id as any) ?? (selected as any).employee_id;
    if (empId === undefined || empId === null || empId === '') return;

    await update(empId, {
      name: (form as any).name,
      email: (form as any).email,
      phone: (form as any).phone,
      position: (form as any).position,
      plantation_group: (form as any).plantation_group,
      wilayah: (form as any).wilayah,
      role_id: (form as any).role_id,
      is_active: (form as any).is_active,
    });
    setIsEditOpen(false);
    await fetch();
  };

  const confirmDelete = async () => {
    if (!selected) return;
    const empId = (selected.id as any) ?? (selected as any).employee_id;
    if (empId === undefined || empId === null || empId === '') return;

    await remove(empId);
    setSelected(null);
    const nextPage = data.length === 1 && page > 1 ? page - 1 : page;
    setPage(nextPage);
    await fetch();
  };

  const header = useMemo(() => (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Master User</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola daftar user dan pekerja anda.</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={refresh}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${refreshing ? 'bg-gray-200' : 'bg-white'} text-sm shadow-sm`}
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span className="hidden md:inline">Refresh</span>
        </button>
        <Button onClick={openAdd} className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white">
          <PlusIcon className="w-4 h-4" /> Tambah User
        </Button>
      </div>
    </div>
  ), [refresh, refreshing]);

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {header}

      {error && <Alert variant="error">{error}</Alert>}

      <UserFilters
        pgOptions={pgOptions}
        roles={roles}
        filters={filters}
        setFilters={(f) => { setFilters(f); setPage(1); }}
        onSearch={() => { setPage(1); fetch(); }}
      />

      <UsersTable
        loading={loading}
        data={data}
        page={page}
        perPage={perPage}
        total={total}
        onPageChange={setPage}
        onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
        onView={openView}
        onEdit={openEdit}
        onDelete={(row) => { setSelected(row); }}
      />

      {/* Add */}
      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Tambah User" widthClass="max-w-6xl">
        <AddUserForm
          roles={roles}
          pgOptions={pgOptions}
          wilayahOptions={wilayahOptions}
          onCancel={() => setIsAddOpen(false)}
          onSubmit={submitAdd}
        />
      </Modal>

      {/* Edit */}
      <Modal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit User"
        footer={(
          <>
            <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100">Batal</button>
            <button onClick={submitEdit} className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700">Update</button>
          </>
        )}
      >
        <EditUserForm
          form={form as any}
          setForm={setForm as any}
          pgOptions={pgOptions}
          wilayahOptions={wilayahOptions}
          positionOptions={positionOptions}
          roles={roles}
        />
      </Modal>

      {/* View */}
      <Modal open={isViewOpen} onClose={() => setIsViewOpen(false)} title="Detail User">
        {selected && (
          <div className="space-y-3 text-sm">
            <Row label="Nama" value={selected.name} />
            <Row label="Email" value={selected.user?.email || selected.email} />
            <Row label="Jabatan" value={selected.position} />
            <Row label="Plantation Group" value={selected.plantation_group} />
            <Row label="Wilayah" value={selected.wilayah} />
            <Row label="Telepon" value={selected.phone} />
            <Row label="Role" value={(selected.roles || []).join(', ') || '-'} />
            <Row label="Status" value={selected.is_active ? 'AKTIF' : 'TIDAK AKTIF'} />
            <Row label="Dibuat" value={selected.created_at ? new Date(selected.created_at).toLocaleString() : '-'} />
            {selected.updated_at && <Row label="Diupdate" value={new Date(selected.updated_at).toLocaleString()} />}
          </div>
        )}
      </Modal>

      {/* Delete */}
      <ConfirmDialog
        open={!!selected && !isEditOpen && !isAddOpen && !isViewOpen}
        onClose={() => setSelected(null)}
        onConfirm={confirmDelete}
        title="Hapus User"
        message={`Yakin hapus user "${selected?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="text-gray-500">{label}</div>
      <div className="col-span-2 text-gray-900">{value ?? '-'}</div>
    </div>
  );
}
