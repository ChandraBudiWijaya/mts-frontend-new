/**
 * features/users/components/EditUserForm.tsx
 * ------------------------------------------------------------
 * Form edit user (inline di modal). Stateless terhadap data list,
 * hanya mengelola nilai form melalui props (controlled).
 * Dipakai oleh Users.tsx.
 */
import type { Role } from '@/shared/types';

export default function EditUserForm({
  form, setForm, pgOptions, wilayahOptions, positionOptions, roles,
}: {
  form: {
    id?: string;
    name: string; email: string; phone: string; position: string; plantation_group: string; wilayah: string; role_id: number | '';
    is_active: boolean;
  };
  setForm: (f: any) => void;
  pgOptions: string[];
  wilayahOptions: string[];
  positionOptions: string[];
  roles: Role[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm" placeholder="Nama" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm" placeholder="email@contoh.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">No HP</label>
        <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm" placeholder="08xxxx" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
        <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm">
          <option value="">Pilih Jabatan</option>
          {positionOptions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">PG</label>
        <select value={form.plantation_group} onChange={(e) => setForm({ ...form, plantation_group: e.target.value })} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm">
          <option value="">Pilih PG</option>
          {pgOptions.map(pg => <option key={pg} value={pg}>{pg}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Wilayah</label>
        <select value={form.wilayah || ''} onChange={(e) => setForm({ ...form, wilayah: e.target.value })} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm">
          <option value="">Pilih Wilayah</option>
          {wilayahOptions.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select value={form.role_id ?? ''} onChange={(e) => setForm({ ...form, role_id: Number(e.target.value) })} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm">
          <option value="">Pilih Role</option>
          {roles.map(r => (<option key={r.id} value={r.id}>{r.name}</option>))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Aktif
        </label>
      </div>
    </div>
  );
}
