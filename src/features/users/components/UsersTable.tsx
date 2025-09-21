/**
 * features/users/components/UsersTable.tsx
 * ------------------------------------------------------------
 * Tabel daftar user + pagination. Tidak menyimpan state data,
 * hanya menampilkan (presentational). Aksi (view/edit/delete)
 * didelegasikan ke parent lewat props callback.
 */
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Employee } from '@/shared/types';

type Props = {
  loading: boolean;
  data: Employee[];
  page: number;
  perPage: number;
  total: number;
  onPageChange: (p: number) => void;
  onPerPageChange: (n: number) => void;
  onView: (row: Employee) => void;
  onEdit: (row: Employee) => void;
  onDelete: (row: Employee) => void;
};

export default function UsersTable({
  loading, data, page, perPage, total, onPageChange, onPerPageChange,
  onView, onEdit, onDelete,
}: Props) {
  return (
    <Card className="p-2">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-primary-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">PG</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12">
                  <div className="flex justify-center"><LoadingSpinner /></div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Tidak ada data user</td>
              </tr>
            ) : (
              data.map((user, idx) => (
                <tr key={(user.id ?? (user as any).employee_id ?? idx) as any} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(page - 1) * perPage + idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.plantation_group}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Array.isArray(user.roles) && user.roles.length > 0 ? user.roles.join(', ') : (user.position ?? '-')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                      {user.is_active ? 'AKTIF' : 'TIDAK AKTIF'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => onView(user)} className="bg-amber-400 hover:bg-amber-500 text-white p-2 rounded-lg"><EyeIcon className="w-4 h-4" /></button>
                    <button onClick={() => onEdit(user)} className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(user)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"><TrashIcon className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        perPage={perPage}
        total={total}
        onPageChange={onPageChange}
        onPerPageChange={(n) => { onPerPageChange(n); }}
        perPageOptions={[5, 10, 20, 50]}
      />
    </Card>
  );
}
