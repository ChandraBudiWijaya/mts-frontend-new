import { useState, useEffect } from 'react';
import { employeeAPI } from '../../shared/api';
import type { Employee } from '../../shared/types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

function Users() {
  const [users, setUsers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    plantation_group: '',
    wilayah: '',
    name: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await employeeAPI.getAll(filters);
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [filters]);

  const handleSearch = () => {
    // Trigger refetch with current filters
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await employeeAPI.getAll(filters);
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">←</span>
        </div>
        <div>
          <p className="text-sm text-gray-500">Kembali ke List</p>
          <h1 className="text-xl font-semibold text-gray-900">Master User</h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plantation Group</label>
            <select 
              value={filters.plantation_group}
              onChange={(e) => setFilters({ ...filters, plantation_group: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
            >
              <option value="">All</option>
              <option value="PG1">PG 1</option>
              <option value="PG2">PG 2</option>
              <option value="PG3">PG 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wilayah</label>
            <select 
              value={filters.wilayah}
              onChange={(e) => setFilters({ ...filters, wilayah: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
            >
              <option value="">All</option>
              <option value="W01">W01</option>
              <option value="W02">W02</option>
              <option value="W03">W03</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama / Username</label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              placeholder="Cari nama atau username..."
            />
          </div>
          <div className="md:text-right">
            <Button 
              onClick={handleSearch}
              className="w-full md:w-auto bg-amber-400 hover:bg-amber-500 text-white font-medium px-5 py-2"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card
        title="Master User"
        actions={
          <Button className="bg-primary-600 hover:bg-primary-700 text-white">
            <PlusIcon className="w-4 h-4 mr-2" />
            Tambah User
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-primary-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  PG
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data user
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.plantation_group}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'AKTIF' : 'TIDAK AKTIF'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="bg-amber-400 hover:bg-amber-500 text-white p-2 rounded-lg">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Tampilkan 5 dari semua data
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              Sebelumnya
            </button>
            <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded">1</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">2</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">3</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">4</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
              Selanjutnya
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Users;
