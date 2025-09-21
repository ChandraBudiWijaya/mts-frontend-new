import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button, Alert, Card } from '../../components/ui';
import { useRbac } from './hooks/useRbac';
import type { Role, RoleFormData } from './types';

// Impor komponen-komponen UI yang terpisah
import RbacFilterBar from './components/RbacFilterBar';
import RbacTable from './components/RbacTable';
import RoleModal from './components/RoleModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function Rbac() {
  // Semua state dan logika data berasal dari satu hook
  const {
    roles, permissions, loading, error, refresh,
    createRole, updateRole, deleteRole, getRoleWithPermissions,
    searchTerm, setSearchTerm,
  } = useRbac();

  // State lokal hanya untuk mengontrol UI (modal, item terpilih)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  // --- Handlers untuk Aksi UI ---

  const handleAdd = () => {
    setEditingRole(null); // Pastikan tidak ada data edit saat menambah baru
    setIsModalOpen(true);
  };
  
  const handleEdit = async (role: Role) => {
    try {
      // Ambil data role lengkap dengan permission-nya sebelum membuka modal
      const fullRoleData = await getRoleWithPermissions(role.id);
      setEditingRole(fullRoleData);
      setIsModalOpen(true);
    } catch (e) {
      // Error sudah ditangani di dalam hook, tidak perlu menampilkan alert lagi di sini
      console.error("Gagal membuka modal edit:", e);
    }
  };

  const handleDelete = (role: Role) => {
    if (role.slug === 'super-admin') {
      alert('Role Super Admin tidak dapat dihapus.');
      return;
    }
    setDeletingRole(role);
  };

  const confirmDelete = async () => {
    if (deletingRole) {
      await deleteRole(deletingRole.id);
      setDeletingRole(null); // Tutup dialog setelah selesai
    }
  };

  // Handler ini akan diteruskan ke RoleModal
  const handleSubmit = async (data: RoleFormData) => {
    if (editingRole) {
      await updateRole(editingRole.id, data);
    } else {
      await createRole(data);
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Role & Permission</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola role pengguna dan hak akses sistem.</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refresh} disabled={loading} variant="secondary">Refresh</Button>
          <Button onClick={handleAdd}><PlusIcon className="h-5 w-5 mr-2" /> Tambah Role</Button>
        </div>
      </div>

      {/* Tampilkan notifikasi error jika ada */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* Komponen Filter */}
      <RbacFilterBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* Komponen Tabel */}
      <Card padding="none">
        <RbacTable
          roles={roles}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* Komponen-komponen Modal */}
      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingRole}
        permissions={permissions}
      />
      
      <ConfirmDialog
        open={!!deletingRole}
        onClose={() => setDeletingRole(null)}
        onConfirm={confirmDelete}
        title={`Hapus Role "${deletingRole?.name}"?`}
        message="Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi semua user dengan role ini."
      />
    </div>
  );
}

