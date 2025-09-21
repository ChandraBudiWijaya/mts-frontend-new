// File: src/features/users/Users.tsx
import { useState } from 'react';
import { Button, Alert, Modal, ConfirmDialog } from '@/components/ui';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useUsers } from './hooks/useUsers';
import { useUserOptions } from './hooks/useUserOptions';
import UsersTable from './components/UsersTable';
import UserFilters from './components/UserFilters';
import EditUserForm from './components/EditUserForm';
import AddUserForm from './components/AddUserForm';
import type { Employee, EmployeeForm } from '@/shared/types';
import type { UserFormData } from './types';

export default function Users() {
  const {
    data, total, loading, error,
    page, setPage, perPage, setPerPage,
    filters, setFilters,
    createUser, updateUser, deleteUser,
    isCreating, isUpdating, isDeleting,
  } = useUsers();

  const { pgOptions, positionOptions, wilayahOptions, roles } = useUserOptions();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);

  const openEdit = (row: Employee) => {
    setSelected(row);
    setIsEditOpen(true);
  };

  const openView = (row: Employee) => {
    setSelected(row);
    setIsViewOpen(true);
  };

  const submitAdd = async (values: UserFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = values;
    const payload: EmployeeForm = {
      ...rest,
      role_id: values.role_id,
    };
    await createUser({ payload, photoFile: values.photoFile });
    setIsAddOpen(false);
  };

  const submitEdit = async (form: Partial<UserFormData>) => {
    if (!selected) return;
    const empId = selected.id ?? (selected as any).employee_id;
    await updateUser({ id: empId, body: form });
    setIsEditOpen(false);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    const empId = selected.id ?? (selected as any).employee_id;
    await deleteUser(empId);
    setSelected(null);
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Master User</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola daftar user dan pekerja anda.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="inline-flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Tambah User
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <UserFilters
        pgOptions={pgOptions}
        roles={roles}
        filters={filters}
        setFilters={(f) => { setPage(1); setFilters(f); }}
      />

      <UsersTable
        loading={loading}
        data={data}
        page={page}
        perPage={perPage}
        total={total}
        onPageChange={setPage}
        onPerPageChange={(n) => { setPage(1); setPerPage(n); }}
        onView={openView}
        onEdit={openEdit}
        onDelete={(row) => setSelected(row)}
      />

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Tambah User" widthClass="max-w-4xl">
        <AddUserForm
          roles={roles}
          pgOptions={pgOptions}
          wilayahOptions={wilayahOptions}
          onCancel={() => setIsAddOpen(false)}
          onSubmit={submitAdd}
          isSaving={isCreating}
        />
      </Modal>

      {selected && (
        <Modal open={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit User" widthClass="max-w-4xl">
          <EditUserForm
            user={selected}
            roles={roles}
            pgOptions={pgOptions}
            wilayahOptions={wilayahOptions}
            positionOptions={positionOptions}
            onCancel={() => setIsEditOpen(false)}
            onSubmit={submitEdit}
            isSaving={isUpdating}
          />
        </Modal>
      )}
      
      {selected && (
          <Modal open={isViewOpen} onClose={() => setIsViewOpen(false)} title="Detail User">
            <div className="space-y-3 text-sm">
                <p><strong>Nama:</strong> {selected.name}</p>
                <p><strong>Email:</strong> {selected.user?.email || selected.email}</p>
                {/* ... tambahkan detail lainnya ... */}
            </div>
          </Modal>
      )}

      <ConfirmDialog
        open={!!selected && !isEditOpen && !isAddOpen && !isViewOpen}
        onClose={() => setSelected(null)}
        onConfirm={confirmDelete}
        title="Hapus User"
        message={`Yakin hapus user "${selected?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        loading={isDeleting}
      />
    </div>
  );
}
