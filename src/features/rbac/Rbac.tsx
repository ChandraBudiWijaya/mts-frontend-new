import { useState, useEffect, useMemo } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { rbacAPI } from '../../shared/api';
import { getErrorMessage } from '../../shared/utils/errorHandler';
import type { Role, Permission } from '../../shared/types';

interface RoleFormData {
  name: string;
  permissions: number[];
}

const Rbac = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [refreshing, setRefreshing] = useState(false); // Only for refresh operations
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    permissions: []
  });

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        rbacAPI.getAllRoles(),
        rbacAPI.getAllPermissions()
      ]);

      setRoles(rolesRes.data.data || []);
      setPermissions(permissionsRes.data.data || []);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat data. Pastikan token API valid.'));
      console.error('Error loading RBAC data:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setFormData({ name: '', permissions: [] });
    setIsModalOpen(true);
  };

  const handleEditRole = async (role: Role) => {
    try {
      const response = await rbacAPI.getRoleById(role.id);
      const roleData = response.data.data;
      
      setEditingRole(role);
      setFormData({
        name: roleData.name,
        permissions: roleData.permissions?.map(p => p.id) || []
      });
      setIsModalOpen(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat data role'));
      console.error('Error loading role:', err);
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.slug === 'super-admin') {
      setError('Role Super Admin tidak dapat dihapus');
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus role "${role.name}"?`)) {
      return;
    }

    try {
      await rbacAPI.deleteRole(role.id);
      await loadData();
      setError('Role berhasil dihapus!');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus role'));
      console.error('Error deleting role:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingRole) {
        await rbacAPI.updateRole(editingRole.id, formData);
        setError('Role berhasil diperbarui!');
      } else {
        await rbacAPI.createRole(formData);
        setError('Role berhasil dibuat!');
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan role'));
      console.error('Error saving role:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(id => id !== permissionId)
    }));
  };

  const statsCards = useMemo(() => [
    {
      title: 'Total Roles',
      value: roles.length,
      color: 'blue',
      icon: '👥'
    },
    {
      title: 'Total Permissions',
      value: permissions.length,
      color: 'green',
      icon: '🔐'
    },
    {
      title: 'Active Roles',
      value: roles.length,
      color: 'orange',
      icon: '✅'
    }
  ], [roles.length, permissions.length]);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Role & Permission Management</h1>
          <p className="text-sm text-gray-600 mt-1">Kelola role pengguna dan permission sistem</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700"
          >
            <span>{refreshing ? '🔄' : '↻'}</span>
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
          <Button onClick={handleCreateRole} className="flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Tambah Role</span>
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <span className="text-lg">{stat.icon}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Daftar Role</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{role.name}</div>
                        <div className="text-sm text-gray-500">{role.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions?.slice(0, 3).map((permission) => (
                        <span
                          key={permission.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {permission.name}
                        </span>
                      ))}
                      {(role.permissions?.length || 0) > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{(role.permissions?.length || 0) - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Edit Role"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {role.slug !== 'super-admin' && (
                        <button
                          onClick={() => handleDeleteRole(role)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Role"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {roles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada role yang dibuat</p>
          </div>
        )}
      </div>

      {/* Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingRole ? 'Edit Role' : 'Tambah Role Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Role *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`perm-${permission.id}`}
                        checked={formData.permissions.includes(permission.id)}
                        onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`perm-${permission.id}`} className="ml-2 block text-sm text-gray-900">
                        {permission.name}
                        <span className="text-xs text-gray-500 ml-1">({permission.slug})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Role'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rbac;