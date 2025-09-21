import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import type { Role, Permission, RoleFormData } from '../types';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => Promise<void>;
  initialData?: Role | null;
  permissions: Permission[];
}

export default function RoleModal({ isOpen, onClose, onSubmit, initialData, permissions }: RoleModalProps) {
  const [formData, setFormData] = useState<RoleFormData>({ name: '', permissions: [] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        permissions: initialData.permissions?.map(p => p.id) || []
      });
    } else {
      setFormData({ name: '', permissions: [] });
    }
    setError('');
  }, [initialData, isOpen]);

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(id => id !== permissionId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan role.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{initialData ? 'Edit Role' : 'Tambah Role Baru'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-6 w-6" /></button>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pr-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Role *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-3 space-y-2">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`perm-${permission.id}`}
                    checked={formData.permissions.includes(permission.id)}
                    onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`perm-${permission.id}`} className="ml-2 block text-sm text-gray-900">{permission.name}</label>
                </div>
              ))}
            </div>
          </div>
        </form>
        <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
          <Button type="button" onClick={onClose} variant="secondary">Batal</Button>
          <Button onClick={handleSubmit} disabled={saving} loading={saving}>Simpan Role</Button>
        </div>
      </div>
    </div>
  );
}
