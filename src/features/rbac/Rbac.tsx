import { useState } from 'react';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import RbacTable from './components/RbacTable';
import RoleModal from './components/RoleModal';
import { useRbac } from './hooks/useRbac';
import type { Role, RoleFormData } from './types';

export default function Rbac() {
  const { roles, permissions, loading, error, refresh, createRole, updateRole, deleteRole, getRoleWithPermissions } = useRbac();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleCreate = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (role: Role) => {
    const fullRoleData = await getRoleWithPermissions(role.id);
    setEditingRole(fullRoleData);
    setIsModalOpen(true);
  };

  const handleDelete = async (role: Role) => {
    if (role.slug === 'super-admin') {
      // Lebih baik menggunakan custom dialog/alert component
      alert('Role Super Admin tidak dapat dihapus');
      return;
    }
    // Menggunakan custom dialog akan lebih baik daripada window.confirm
    if (window.confirm(`Apakah Anda yakin ingin menghapus role "${role.name}"?`)) {
      await deleteRole(role.id);
    }
  };

  const handleSubmit = async (data: RoleFormData) => {
    if (editingRole) {
      await updateRole(editingRole.id, data);
    } else {
      await createRole(data);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Role & Permission Management</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola role pengguna dan permission sistem</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refresh} loading={loading} variant="secondary" icon={<ArrowPathIcon className="h-4 w-4" />}>
            Refresh
          </Button>
          <Button onClick={handleCreate} icon={<PlusIcon className="h-5 w-5" />}>
            Tambah Role
          </Button>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Teruskan prop 'loading' ke komponen tabel */}
      <RbacTable 
        roles={roles} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        loading={loading} 
      />

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingRole}
        permissions={permissions}
      />
    </div>
  );
}

