import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Role } from '../types';
import { LoadingSpinner } from '@/components/ui'; // Impor LoadingSpinner

interface RbacTableProps {
  roles: Role[];
  loading: boolean; // <-- Tambahkan prop loading
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export default function RbacTable({ roles, loading, onEdit, onDelete }: RbacTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Daftar Role</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // <-- Tampilan saat loading
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <LoadingSpinner />
                    <span>Memuat data role...</span>
                  </div>
                </td>
              </tr>
            ) : roles.length === 0 ? (
              // <-- Tampilan saat data kosong
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  Belum ada role yang dibuat.
                </td>
              </tr>
            ) : (
              // Tampilan saat data ada
              roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{role.name}</div>
                    <div className="text-sm text-gray-500">{role.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions?.slice(0, 5).map((p) => (
                        <span key={p.id} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{p.name}</span>
                      ))}
                      {(role.permissions?.length || 0) > 5 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          +{(role.permissions?.length || 0) - 5} lainnya
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => onEdit(role)} className="text-blue-600 hover:text-blue-900 p-1 rounded" title="Edit Role">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {role.slug !== 'super-admin' && (
                        <button onClick={() => onDelete(role)} className="text-red-600 hover:text-red-900 p-1 rounded" title="Delete Role">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

