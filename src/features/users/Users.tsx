import { useState, useEffect, useMemo } from 'react';
import { employeeAPI, rbacAPI, parametersAPI, masterDataAPI } from '../../shared/api';
import type { Employee, Role, EmployeeForm } from '../../shared/types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import AddUserForm, { type AddUserValues } from './components/AddUserForm';
import { getErrorMessage } from '../../utils/errorHandler';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

function Users() {
  const [users, setUsers] = useState<Employee[]>([]);
  const [allUsers, setAllUsers] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    plantation_group: '',
    wilayah: '',
    name: '',
    role: '',
    start_date: '',
    end_date: ''
  });

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Employee | null>(null);
  const [selected, setSelected] = useState<Employee | null>(null);

  // Form state
  const emptyForm = useMemo(() => ({
    name: '',
    email: '',
    position: '',
    plantation_group: '',
    block: '',
    subblock: '',
    is_active: true,
  }), []);
  const [form, setForm] = useState(emptyForm);

  // Dropdown options
  const [pgOptions, setPgOptions] = useState<string[]>([]);
  const [blockOptions, setBlockOptions] = useState<string[]>([]);
  const [subblockOptions, setSubblockOptions] = useState<string[]>([]);
  const [positionOptions, setPositionOptions] = useState<string[]>([]);
  const [wilayahOptions, setWilayahOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        
        // Debug: Check if token exists
        const token = localStorage.getItem('mts_token');
        console.log('Token from localStorage:', token);
        
        if (!token) {
          console.error('No token found in localStorage');
          setError('Token tidak ditemukan. Silakan login ulang.');
          setLoading(false);
          return;
        }
        
        console.log('Calling employeeAPI.getAll()...');
        const response = await employeeAPI.getAll();
        console.log('API Response:', response);
        console.log('Response data:', response.data);
        
        if (response.data && response.data.data) {
          setUsers(response.data.data);
          setAllUsers(response.data.data);
          console.log('Employees set:', response.data.data);
        } else {
          console.warn('Unexpected response structure:', response.data);
          setUsers([]);
          setAllUsers([]);
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(getErrorMessage(err, 'Gagal memuat data karyawan'));
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await rbacAPI.getAllRoles();
        const rows: Role[] = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
        setRoles(rows);
      } catch (e) {
        console.error('Error fetching roles:', e);
      }
    };
    fetchRoles();
  }, []);

  // Load parameter dropdowns
  useEffect(() => {
    const loadParams = async () => {
      try {
        console.log('Loading plantation groups, positions, and wilayah...');
        
        // Load master data from new API
        let pgData: string[] = [];
        let posData: string[] = [];
        let wilayahData: string[] = [];
        
        try {
          const pgRes = await masterDataAPI.getPlantationGroups();
          pgData = pgRes.data.data.map(item => item.value) || [];
          console.log('PG data from master API:', pgData);
        } catch (e) {
          console.warn('Failed to load PG from master API, using fallback data');
          pgData = ['PG1', 'PG2'];
        }
        
        try {
          const posRes = await parametersAPI.getPositions();
          posData = posRes.data || [];
          console.log('Position data from API:', posData);
        } catch (e) {
          console.warn('Failed to load positions from API, using fallback data');
          posData = ['Manager', 'Supervisor', 'Assistant Manager', 'Staff', 'Operator'];
        }
        
        try {
          const wilayahRes = await masterDataAPI.getWilayah();
          wilayahData = wilayahRes.data.data.map(item => item.value) || [];
          console.log('Wilayah data from master API:', wilayahData);
        } catch (e) {
          console.warn('Failed to load wilayah from master API, using fallback data');
          wilayahData = ['WIL1', 'WIL2'];
        }
        
        setPgOptions(pgData);
        setPositionOptions(posData);
        setWilayahOptions(wilayahData);
        
        console.log('All options set - PG:', pgData, 'Positions:', posData, 'Wilayah:', wilayahData);
      } catch (e) {
        console.error('Error loading parameters:', e);
        // Fallback data jika semua API call gagal
        setPgOptions(['PG1', 'PG2']);
        setPositionOptions(['Manager', 'Supervisor', 'Assistant Manager', 'Staff', 'Operator']);
        setWilayahOptions(['WIL1', 'WIL2']);
      }
    };
    loadParams();
  }, []);  useEffect(() => {
    const loadBlocks = async () => {
      if (!form.plantation_group) { setBlockOptions([]); setSubblockOptions([]); return; }
      try {
        const res = await parametersAPI.getBlocks(form.plantation_group);
        setBlockOptions(res.data || []);
      } catch (e) { console.error(e); }
    };
    loadBlocks();
  }, [form.plantation_group]);

  useEffect(() => {
    const loadSubblocks = async () => {
      if (!form.plantation_group || !form.block) { setSubblockOptions([]); return; }
      try {
        const res = await parametersAPI.getSubblocks(form.plantation_group, form.block);
        setSubblockOptions(res.data || []);
      } catch (e) { console.error(e); }
    };
    loadSubblocks();
  }, [form.plantation_group, form.block]);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await employeeAPI.getAll();
      if (response.data && response.data.data) {
        setUsers(response.data.data);
        setAllUsers(response.data.data);
      }
    } catch (err) {
      console.error('Error refreshing employees:', err);
      setError(getErrorMessage(err, 'Gagal memuat ulang data karyawan'));
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    // Trigger refetch with current filters
    const fetchUsers = async () => {
      try {
        const response = await employeeAPI.getAll(filters);
        const rows = response.data.data as Employee[];
        const filtered = rows.filter(u => {
          const byName = filters.name ? (u.name?.toLowerCase().includes(filters.name.toLowerCase())) : true;
          const byPg = filters.plantation_group ? (u.plantation_group === filters.plantation_group) : true;
          const byRole = filters.role ? (Array.isArray(u.roles) && u.roles.includes(filters.role)) : true;
          return byName && byPg && byRole;
        });
        setAllUsers(rows);
        setUsers(filtered);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  };

  const openAdd = () => {
    setForm(emptyForm);
    setIsAddOpen(true);
  };

  const openEdit = (emp: Employee) => {
    setSelected(emp);
    setForm({
      name: emp.name || '',
      email: emp.email || '',
      position: emp.position || '',
      plantation_group: emp.plantation_group || '',
      block: emp.block || '',
      subblock: emp.subblock || '',
      is_active: !!emp.is_active,
    });
    setIsEditOpen(true);
  };

  const openView = (emp: Employee) => {
    setSelected(emp);
    setIsViewOpen(true);
  };

  const submitAdd = async (values: AddUserValues) => {
    try {
      console.log('Submitting new employee with values:', values);
      
      // Payload sesuai dengan migration database yang sudah diperbaiki:
      // Table employees: id, name, position, phone, plantation_group, wilayah, photo_url
      // User data: email, password untuk membuat user account
      const payload: EmployeeForm = {
        // Employee fields (sesuai migration)
        id: values.id,
        name: values.name,
        position: values.position,
        phone: values.phone,
        plantation_group: values.plantation_group, // ✅ Sekarang ada di migration
        wilayah: values.wilayah, // ✅ Sekarang ada di migration
        
        // User fields (untuk membuat user account)
        email: values.email,
        password: values.password,
        
        // Additional fields
        role_id: values.role_id, // ✅ Menggunakan role_id (number) bukan role (string)
        is_active: true,
      };
      
      console.log('Payload to be sent:', payload);
      
      const resCreate = await employeeAPI.create(payload);
      console.log('Employee created successfully:', resCreate.data);
      
      // Upload foto jika ada
      const created = resCreate.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const createdId = created?.id || (created as any)?.employee_id;
      if (createdId && values.photoFile) {
        try { 
          console.log('Uploading photo for employee ID:', createdId);
          await employeeAPI.updatePhoto(createdId, values.photoFile); 
          console.log('Photo uploaded successfully');
        } catch (e) { 
          console.warn('Upload foto gagal:', e); 
        }
      }
      
      setIsAddOpen(false);
      // refresh data
      setPage(1);
      const res = await employeeAPI.getAll();
      const payloadRes = res.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows: Employee[] = Array.isArray(payloadRes) ? payloadRes : (payloadRes as any)?.data || [];
      setUsers(rows);
      setTotal(rows.length);
    } catch (e) {
      console.error('Error creating employee:', e);
      console.error('Error response:', (e as any)?.response?.data);
      
      let errorMessage = 'Gagal menambahkan user';
      
      if (e && typeof e === 'object' && 'response' in e) {
        const axiosError = e as any;
        console.log('Full error response:', axiosError.response);
        
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.data?.errors) {
          const errors = axiosError.response.data.errors;
          console.log('Validation errors:', errors);
          const firstErrorKey = Object.keys(errors)[0];
          const firstError = errors[firstErrorKey];
          if (Array.isArray(firstError)) {
            errorMessage = `${firstErrorKey}: ${firstError[0]}`;
          }
        } else if (axiosError.response?.status === 422) {
          errorMessage = 'Data tidak valid. Periksa kembali input Anda.';
        } else if (axiosError.response?.status === 500) {
          errorMessage = 'Terjadi kesalahan server. Silakan coba lagi.';
        }
      }
      
      setError(errorMessage);
    }
  };

  const submitEdit = async () => {
    if (!selected) return;
    const empId = selected.employee_id || selected.id;
    if (!empId) return;
    
    try {
      await employeeAPI.update(Number(empId), form as any);
      setIsEditOpen(false);
      // refresh current page
      const res = await employeeAPI.getAll({ ...(filters as any), page, per_page: perPage } as any);
      const payload: any = res.data;
      const rows: Employee[] = Array.isArray(payload?.data) ? payload.data : payload?.data?.data || [];
      setUsers(rows);
      setTotal(Array.isArray(payload?.data) ? rows.length : payload?.data?.total || rows.length);
    } catch (e) {
      console.error('Error updating employee:', e);
      setError(getErrorMessage(e, 'Gagal mengupdate user'));
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const empId = toDelete.employee_id || toDelete.id;
    if (!empId) return;
    
    try {
      await employeeAPI.delete(Number(empId));
      setToDelete(null);
      // if last item on page deleted, try previous page
      const nextPage = users.length === 1 && page > 1 ? page - 1 : page;
      setPage(nextPage);
      const res = await employeeAPI.getAll({ ...(filters as any), page: nextPage, per_page: perPage } as any);
      const payload: any = res.data;
      const rows: Employee[] = Array.isArray(payload?.data) ? payload.data : payload?.data?.data || [];
      setUsers(rows);
      setTotal(Array.isArray(payload?.data) ? rows.length : payload?.data?.total || rows.length);
    } catch (e) {
      console.error('Error deleting employee:', e);
      setError(getErrorMessage(e, 'Gagal menghapus user'));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Master User</h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
            >
              <option value="">All</option>
              {roles.map(r => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
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
        actions={
          <div className="flex space-x-2">
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              <ArrowPathIcon className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button onClick={openAdd} className="bg-primary-600 hover:bg-primary-700 text-white">
              <PlusIcon className="w-4 h-4 mr-2" />
              Tambah User
            </Button>
          </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
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
                      {Array.isArray(user.roles) && user.roles.length > 0 
                        ? user.roles.join(', ') 
                        : (user.position ?? '-')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'AKTIF' : 'TIDAK AKTIF'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => openView(user)} className="bg-amber-400 hover:bg-amber-500 text-white p-2 rounded-lg">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(user)} className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => setToDelete(user)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg">
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
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <span>Menampilkan {(page - 1) * perPage + (users.length ? 1 : 0)} - {(page - 1) * perPage + users.length} dari {total}</span>
            <select
              value={perPage}
              onChange={(e) => { setPage(1); setPerPage(Number(e.target.value)); }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {[5,10,20,50].map(n => <option key={n} value={n}>{n}/hal</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <span className="px-2 text-sm">Hal {page}</span>
            <button
              disabled={(page * perPage) >= total}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </Card>

      {/* Add Modal */}
      <Modal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Tambah User"
        widthClass="max-w-6xl"
      >
        <AddUserForm
          roles={roles}
          pgOptions={pgOptions}
          wilayahOptions={wilayahOptions}
          onCancel={() => setIsAddOpen(false)}
          onSubmit={submitAdd}
        />
      </Modal>

      {/* Edit Modal */}
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
        <UserForm form={form} setForm={setForm} pgOptions={pgOptions} blockOptions={blockOptions} subblockOptions={subblockOptions} positionOptions={positionOptions} />
      </Modal>

      {/* View Modal */}
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
            <Row label="Dibuat" value={new Date(selected.created_at).toLocaleString()} />
            {selected.updated_at && (
              <Row label="Diupdate" value={new Date(selected.updated_at).toLocaleString()} />
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Hapus User"
        message={`Yakin hapus user "${toDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
      />
    </div>
  );
}

export default Users;

// Helper small components
function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="text-gray-500">{label}</div>
      <div className="col-span-2 text-gray-900">{value ?? '-'}</div>
    </div>
  );
}

function UserForm({
  form,
  setForm,
  pgOptions,
  blockOptions,
  subblockOptions,
  positionOptions,
}: {
  form: {
    name: string; email: string; position: string; plantation_group: string; block: string; subblock: string; is_active: boolean;
  };
  setForm: (f: any) => void;
  pgOptions: string[];
  blockOptions: string[];
  subblockOptions: string[];
  positionOptions: string[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
          placeholder="Nama"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
          placeholder="email@contoh.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
        <select
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
        >
          <option value="">Pilih Jabatan</option>
          {positionOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Plantation Group</label>
        <select
          value={form.plantation_group}
          onChange={(e) => setForm({ ...form, plantation_group: e.target.value, block: '', subblock: '' })}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
        >
          <option value="">Pilih PG</option>
          {pgOptions.map(pg => <option key={pg} value={pg}>{pg}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
        <select
          value={form.block}
          onChange={(e) => setForm({ ...form, block: e.target.value, subblock: '' })}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
          disabled={!form.plantation_group}
        >
          <option value="">Pilih Block</option>
          {blockOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subblock</label>
        <select
          value={form.subblock}
          onChange={(e) => setForm({ ...form, subblock: e.target.value })}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
          disabled={!form.block}
        >
          <option value="">Pilih Subblock</option>
          {subblockOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          Aktif
        </label>
      </div>
    </div>
  );
}
