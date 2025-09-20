import { useMemo, useRef, useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import type { Role } from '../../../shared/types';
import { CameraIcon } from '@heroicons/react/24/outline';

export interface AddUserValues {
  id: string; // employee ID
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role_id: number | '';
  position: string;
  plantation_group: string;
  wilayah: string;
  photoFile?: File | null;
}

interface AddUserFormProps {
  roles: Role[];
  pgOptions: string[];
  wilayahOptions?: string[];
  onCancel: () => void;
  onSubmit?: (values: AddUserValues) => void;
}

const initialValues: AddUserValues = {
  id: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role_id: '',
  position: '',
  plantation_group: '',
  wilayah: '',
  photoFile: null,
};

export default function AddUserForm({ roles, pgOptions, wilayahOptions = [], onCancel, onSubmit }: AddUserFormProps) {
  const [values, setValues] = useState<AddUserValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const isValid = useMemo(() => {
    const nextErrors: Record<string, string> = {};
    if (!values.id) nextErrors.id = 'Wajib diisi';
    if (!values.name) nextErrors.name = 'Wajib diisi';
    if (!values.email) nextErrors.email = 'Wajib diisi';
    if (!values.phone) nextErrors.phone = 'Wajib diisi';
    if (!values.position) nextErrors.position = 'Wajib diisi';
    if (!values.plantation_group) nextErrors.plantation_group = 'Wajib diisi';
    if (!values.role_id) nextErrors.role_id = 'Wajib diisi';
    if (!values.password) nextErrors.password = 'Wajib diisi';
    if (values.password && values.password.length < 6) nextErrors.password = 'Min 6 karakter';
    if (values.password !== values.confirmPassword) nextErrors.confirmPassword = 'Tidak sama';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [values]);

  const handleChange = (name: keyof AddUserValues, value: string | number) => {
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handlePhotoChange = (file?: File | null) => {
    const f = file ?? null;
    setValues((v) => ({ ...v, photoFile: f }));
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview((p) => {
        if (p) URL.revokeObjectURL(p);
        return url;
      });
    } else {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  const submit = () => {
    if (!isValid) return;
    onSubmit?.(values);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Photo + left fields */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {/* Photo */}
            <div className="border rounded-xl overflow-hidden bg-gray-50">
              <div className="aspect-video flex items-center justify-center relative">
                {preview ? (
                  <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 w-full h-full">
                    <CameraIcon className="w-10 h-10 mb-2" />
                    <span className="text-sm">Belum ada foto</span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoChange(e.target.files?.[0])}
                />
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => fileRef.current?.click()}>
              Tambah Foto
            </Button>

            {/* Employee ID */}
            <Input
              label="Employee ID"
              error={errors.id}
              value={values.id}
              onChange={(e) => handleChange('id', e.target.value)}
              placeholder="ID Employee"
              required
            />
            {/* Position */}
            <Input
              label="Position"
              error={errors.position}
              value={values.position}
              onChange={(e) => handleChange('position', e.target.value)}
              placeholder="Jabatan"
              required
            />
          </div>
        </div>

        {/* Right: main fields */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nama Lengkap"
            error={errors.name}
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nama lengkap"
            required
          />
          <Input
            label="Email"
            type="email"
            error={errors.email}
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@contoh.com"
            required
          />
          <Input
            label="No HP"
            error={errors.phone}
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="08xxxx"
            required
          />
          <Input
            label="Password"
            type="password"
            error={errors.password}
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="••••••"
            required
          />
          <Input
            label="Konfirmasi Password"
            type="password"
            error={errors.confirmPassword}
            value={values.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="Ulangi password"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={values.role_id}
              onChange={(e) => handleChange('role_id', Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Pilih Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            {errors.role_id && (
              <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PG</label>
            <select
              value={values.plantation_group}
              onChange={(e) => handleChange('plantation_group', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Pilih PG</option>
              {pgOptions.map((pg) => (
                <option key={pg} value={pg}>{pg}</option>
              ))}
            </select>
            {errors.plantation_group && (
              <p className="text-red-500 text-sm mt-1">{errors.plantation_group}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wilayah</label>
            <select
              value={values.wilayah}
              onChange={(e) => handleChange('wilayah', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Pilih Wilayah</option>
              {wilayahOptions.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onCancel}
          className="bg-amber-400 hover:bg-amber-500 text-white font-medium px-6 py-2 rounded-lg"
        >
          Batal
        </button>
        <button
          onClick={submit}
          className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2 rounded-lg"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}

