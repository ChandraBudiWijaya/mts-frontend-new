import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Input, Alert } from '../../../components/ui';
import type { EditParameterModalProps, ParameterFormData } from '../types';

// Interface props diubah agar onUpdate menerima data
interface CustomEditModalProps extends Omit<EditParameterModalProps, 'onUpdate'> {
  onUpdate: (id: number, data: ParameterFormData) => Promise<void>;
}

const EditParameterModal: React.FC<CustomEditModalProps> = ({ isOpen, onClose, parameter, onUpdate }) => {
  const [formData, setFormData] = useState<ParameterFormData>({
    param_value: '',
    description: '',
    status: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (parameter) {
      setFormData({
        param_value: parameter.param_value,
        description: parameter.description || '',
        status: parameter.status,
      });
      setError(null);
    }
  }, [parameter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parameter) return;

    setLoading(true);
    setError(null);

    try {
      // Panggil fungsi onUpdate dari props, bukan memanggil API langsung
      await onUpdate(parameter.id, formData);
      onClose(); // Tutup modal jika sukses
    } catch (err) {
      // Tangkap error yang dilempar oleh hook dari parent component
      setError(err instanceof Error ? err.message : 'Gagal memperbarui parameter');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof ParameterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Parameter</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && <Alert variant="error" className="mb-4">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parameter Key</label>
            <Input value={parameter?.param_key || ''} readOnly className="bg-gray-100 cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value <span className="text-red-500">*</span></label>
            <textarea
              value={formData.param_value}
              onChange={(e) => handleFieldChange('param_value', e.target.value)}
              rows={3}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={2}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status.toString()}
              onChange={(e) => handleFieldChange('status', e.target.value === 'true')}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" loading={loading} disabled={loading}>Update Parameter</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditParameterModal;
