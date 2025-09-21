/**
 * features/users/components/AddUserForm.tsx
 * ----------------------------------------------------------------------
 * + Phone masking/formatting (sanitize → pretty display, kirim raw tanpa spasi)
 * + Email validation sederhana
 * + Auto-focus ke field pertama yang error ketika submit
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { Role } from '@/shared/types';
import { CameraIcon } from '@heroicons/react/24/outline';

export interface AddUserValues {
  id: string; // employee ID
  name: string;
  email: string;
  phone: string; // disimpan sebagai raw (hanya + dan digit, tanpa spasi)
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

// --- Helpers: phone sanitize & pretty print ---
function sanitizePhone(input: string): string {
  // izinkan hanya digit dan satu leading '+'
  let s = input.replace(/[^\d+]/g, '');
  // kalau ada '+' bukan di awal → hapus
  s = s[0] === '+' ? '+' + s.slice(1).replace(/[+]/g, '') : s.replace(/[+]/g, '');
  return s;
}
function prettyPhone(raw: string): string {
  // tampilkan dengan spasi tiap 4 digit (lewatkan '+')
  const sign = raw.startsWith('+') ? '+' : '';
  const digits = raw.replace(/[^\d]/g, '');
  return sign + digits.replace(/(.{4})/g, '$1 ').trim();
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AddUserForm({
  roles,
  pgOptions,
  wilayahOptions = [],
  onCancel,
  onSubmit,
}: AddUserFormProps) {
  const [values, setValues] = useState<AddUserValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Refs untuk auto-focus
  const idRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const positionRef = useRef<HTMLInputElement | null>(null);
  const roleRef = useRef<HTMLSelectElement | null>(null);
  const pgRef = useRef<HTMLSelectElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  // Bersihkan preview URL saat unmount
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  // Validasi ringan realtime
  const isValid = useMemo(() => {
    const nextErrors: Record<string, string> = {};
    if (!values.id) nextErrors.id = 'Wajib diisi';
    if (!values.name) nextErrors.name = 'Wajib diisi';
    if (!values.email) nextErrors.email = 'Wajib diisi';
    if (values.email && !EMAIL_RE.test(values.email)) nextErrors.email = 'Email tidak valid';
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

  const focusFirstError = (errs: Record<string, string>) => {
    const order = [
      ['id', idRef],
      ['name', nameRef],
      ['email', emailRef],
      ['phone', phoneRef],
      ['position', positionRef],
      ['plantation_group', pgRef],
      ['role_id', roleRef],
      ['password', passwordRef],
      ['confirmPassword', confirmRef],
    ] as const;
    for (const [key, ref] of order) {
      if (errs[key]) {
        ref.current?.focus();
        break;
      }
    }
  };

  const handleChange = (name: keyof AddUserValues, value: string | number) => {
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handlePhoneInput = (val: string) => {
    // normalize lalu simpan raw, tampilkan pretty
    const raw = sanitizePhone(val);
    setValues((v) => ({ ...v, phone: raw }));
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
    // Lock in latest validation & focus error jika ada
    const submitErrors: Record<string, string> = {};
    if (!values.id) submitErrors.id = 'Wajib diisi';
    if (!values.name) submitErrors.name = 'Wajib diisi';
    if (!values.email) submitErrors.email = 'Wajib diisi';
    if (values.email && !EMAIL_RE.test(values.email)) submitErrors.email = 'Email tidak valid';
    if (!values.phone) submitErrors.phone = 'Wajib diisi';
    if (!values.position) submitErrors.position = 'Wajib diisi';
    if (!values.plantation_group) submitErrors.plantation_group = 'Wajib diisi';
    if (!values.role_id) submitErrors.role_id = 'Wajib diisi';
    if (!values.password) submitErrors.password = 'Wajib diisi';
    if (values.password && values.password.length < 6) submitErrors.password = 'Min 6 karakter';
    if (values.password !== values.confirmPassword) submitErrors.confirmPassword = 'Tidak sama';

    setErrors(submitErrors);
    if (Object.keys(submitErrors).length > 0) {
      focusFirstError(submitErrors);
      return;
    }
    onSubmit?.(values);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kiri: Foto + field kiri */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            {/* Photo */}
            <div className="border rounded-xl overflow-hidden bg-gray-50">
              <div className="aspect-video flex items-center justify-center relative">
                {preview ? (
                  <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 w-full h-full">
                    <CameraIcon className="w-10 h-10 mb-2" aria-hidden="true" />
                    <span className="text-sm">Belum ada foto</span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoChange(e.target.files?.[0])}
                  aria-label="Upload foto user"
                />
              </div>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => fileRef.current?.click()}
            >
              Tambah Foto
            </Button>

            {/* Employee ID */}
            <Input
              ref={idRef}
              label="Employee ID"
              error={errors.id}
              value={values.id}
              onChange={(e) => handleChange('id', e.target.value)}
              placeholder="ID Employee"
              required
            />
            {/* Position */}
            <Input
              ref={positionRef}
              label="Position"
              error={errors.position}
              value={values.position}
              onChange={(e) => handleChange('position', e.target.value)}
              placeholder="Jabatan"
              required
            />
          </div>
        </div>

        {/* Kanan: field utama */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            ref={nameRef}
            label="Nama Lengkap"
            error={errors.name}
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nama lengkap"
            required
          />
          <Input
            ref={emailRef}
            label="Email"
            type="email"
            error={errors.email}
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@contoh.com"
            required
          />

          {/* Phone dengan masking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No HP</label>
            <input
              ref={phoneRef}
              inputMode="tel"
              value={prettyPhone(values.phone)}
              onChange={(e) => handlePhoneInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="+62812 3456 7890"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && <p id="phone-error" className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            <p className="text-xs text-gray-500 mt-1">Hanya angka & simbol “+”. Disimpan tanpa spasi.</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p id="password-error" className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
            <div className="relative">
              <input
                ref={confirmRef}
                type={showConfirm ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ulangi password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                aria-label={showConfirm ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && <p id="confirm-error" className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              ref={roleRef}
              value={values.role_id}
              onChange={(e) => handleChange('role_id', Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              aria-invalid={!!errors.role_id}
            >
              <option value="">Pilih Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            {errors.role_id && <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>}
          </div>

          {/* PG */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PG</label>
            <select
              ref={pgRef}
              value={values.plantation_group}
              onChange={(e) => handleChange('plantation_group', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              aria-invalid={!!errors.plantation_group}
            >
              <option value="">Pilih PG</option>
              {pgOptions.map((pg) => (
                <option key={pg} value={pg}>{pg}</option>
              ))}
            </select>
            {errors.plantation_group && <p className="text-red-500 text-sm mt-1">{errors.plantation_group}</p>}
          </div>

          {/* Wilayah */}
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
          disabled={!isValid}
          className={`text-white font-medium px-6 py-2 rounded-lg ${isValid ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-300 cursor-not-allowed'}`}
          aria-disabled={!isValid}
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
