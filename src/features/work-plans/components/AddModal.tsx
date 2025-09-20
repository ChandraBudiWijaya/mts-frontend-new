// src/features/workplans/components/AddModal.tsx
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import type { Option, EmployeeLite } from '../types';
import { fetchEmployees, fetchLokasiOptionsByFilter } from '../hooks/useMasterData';

type Props = {
  open: boolean;
  onClose: () => void;
  defaultFilters: { wilayah: string; plantation_group: string };
  onSubmit: (payload: {
    date: string;
    employee_id: string;
    geofence_id?: number;
    location_code?: string;
    spk_number?: string;
    activity_description: string;
  }) => Promise<void>;
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const MIN_DESC = 10;
const MAX_DESC = 300;

export default function AddModal({ open, onClose, defaultFilters, onSubmit }: Props) {
  // state
  const [saving, setSaving] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingLokasi, setLoadingLokasi] = useState(false);

  const [employees, setEmployees] = useState<EmployeeLite[]>([]);
  const [lokasiOptions, setLokasiOptions] = useState<Option[]>([]);

  // form
  const [form, setForm] = useState({
    date: todayISO(),
    employee_id: '',
    geofence_id: '' as number | '',
    location_code: '' as string | '',
    spk_number: '',
    activity_description: '',
  });

  // search helper (filter options locally)
  const [lokasiSearch, setLokasiSearch] = useState('');

  // errors
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});

  // load choices when modal opens
  useEffect(() => {
    if (!open) return;

    (async () => {
      setForm({
        date: todayISO(),
        employee_id: '',
        geofence_id: '',
        location_code: '',
        spk_number: '',
        activity_description: '',
      });
      setLokasiSearch('');
      setErrors({});

      setLoadingEmployees(true);
      setLoadingLokasi(true);
      try {
        const [emps, loks] = await Promise.all([
          fetchEmployees().finally(() => setLoadingEmployees(false)),
          fetchLokasiOptionsByFilter(defaultFilters.wilayah, defaultFilters.plantation_group).finally(() => setLoadingLokasi(false)),
        ]);
        setEmployees(emps);
        setLokasiOptions(loks);
      } catch {
        // no-op (UI akan menampilkan empty state)
      }
    })();
  }, [open, defaultFilters.wilayah, defaultFilters.plantation_group]);

  // derived
  const descCount = form.activity_description.length;

  const filteredLokasiOptions = useMemo(() => {
    if (!lokasiSearch.trim()) return lokasiOptions;
    const q = lokasiSearch.toLowerCase();
    return lokasiOptions.filter(o => (o.label + ' ' + o.value).toLowerCase().includes(q));
  }, [lokasiOptions, lokasiSearch]);

  // validation
  function validate(next = form) {
    const e: Partial<Record<keyof typeof form, string>> = {};
    if (!next.date) e.date = 'Tanggal wajib diisi.';
    if (!next.employee_id) e.employee_id = 'Pilih mandor.';
    // wajib salah satu: geofence_id (dari master) ATAU location_code (ketik manual)
    const val = String(next.geofence_id || next.location_code || '').trim();
    if (!val) e.location_code = 'Pilih lokasi dari daftar atau ketik manual.';
    if (next.activity_description.trim().length < MIN_DESC) {
      e.activity_description = `Minimal ${MIN_DESC} karakter.`;
    }
    if (next.activity_description.length > MAX_DESC) {
      e.activity_description = `Maksimal ${MAX_DESC} karakter.`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function patch<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    const next = { ...form, [key]: value };
    // jika user memilih salah satu, kosongkan yang lain agar tidak ambigu
    if (key === 'geofence_id') {
      const asNum = Number(value as any);
      next.location_code = (isNaN(asNum) || asNum <= 0) ? next.location_code : '';
    }
    if (key === 'location_code' && (value as string).trim()) {
      next.geofence_id = '' as any;
    }
    setForm(next);
    validate(next);
  }

  const isValid = useMemo(() => validate(form), /* re-run after errors set */ [form]);

  // submit
  const submit = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      const val = String(form.geofence_id || form.location_code || '').trim();
      const parsedId = Number(val);
      const payload = {
        date: form.date,
        employee_id: form.employee_id,
        geofence_id: !isNaN(parsedId) && parsedId > 0 ? parsedId : undefined,
        location_code: isNaN(parsedId) ? (val || undefined) : undefined,
        spk_number: form.spk_number || undefined,
        activity_description: form.activity_description.trim(),
      };
      await onSubmit(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Tambah Rencana Kerja"
      widthClass="max-w-2xl"
      footer={(
        <div className="w-full flex justify-between gap-2">
          <button
            onClick={() =>
              setForm({ date: todayISO(), employee_id: '', geofence_id: '', location_code: '', spk_number: '', activity_description: '' })
            }
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100">
              Batal
            </button>
            <button
              onClick={submit}
              disabled={saving || !isValid}
              className={`px-4 py-2 rounded text-white ${isValid ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-300 cursor-not-allowed'} disabled:opacity-50`}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tanggal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal<span className="text-red-500">*</span></label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => patch('date', e.target.value)}
            className={`w-full rounded-lg border ${errors.date ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm`}
          />
          {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
        </div>

        {/* Mandor */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mandor<span className="text-red-500">*</span></label>
            {loadingEmployees && <span className="text-xs text-gray-400">memuat…</span>}
          </div>
          <select
            value={form.employee_id}
            onChange={(e) => patch('employee_id', e.target.value)}
            className={`w-full rounded-lg border ${errors.employee_id ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm`}
          >
            <option value="">Pilih Mandor</option>
            {employees.map(emp => (<option key={emp.id} value={emp.id}>{emp.name}</option>))}
          </select>
          {errors.employee_id && <p className="text-xs text-red-600 mt-1">{errors.employee_id}</p>}
        </div>

        {/* Lokasi Master (pilih) */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (Master) — pilih salah satu</label>
            {loadingLokasi && <span className="text-xs text-gray-400">memuat…</span>}
          </div>

          {/* Search/filter list */}
          <div className="flex gap-2 mb-2">
            <input
              value={lokasiSearch}
              onChange={(e) => setLokasiSearch(e.target.value)}
              placeholder="Cari lokasi… (kode/nama)"
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
            />
            <button
              type="button"
              onClick={() => setLokasiSearch('')}
              className="px-3 rounded border border-gray-300 text-sm hover:bg-gray-50"
              title="Bersihkan pencarian"
            >
              Bersih
            </button>
          </div>

          <select
            value={form.location_code || String(form.geofence_id)}
            onChange={(e) => {
              const v = e.target.value;
              const asNum = Number(v);
              if (!isNaN(asNum) && asNum > 0) {
                patch('geofence_id', asNum as any);
              } else {
                // jika user memilih placeholder / kosong
                patch('geofence_id', '' as any);
                patch('location_code', v);
              }
            }}
            className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
          >
            <option value="">— Pilih dari master —</option>
            {filteredLokasiOptions.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
          </select>

          {/* Lokasi manual (ketik) */}
          <p className="text-xs text-gray-500 mt-2">
            Tidak ada di daftar? Ketik manual kode lokasi di bawah (opsi ini akan mengosongkan pilihan master).
          </p>
          <input
            value={form.location_code}
            onChange={(e) => patch('location_code', e.target.value)}
            placeholder="Contoh: PG1-W01-041G"
            className={`mt-1 w-full rounded-lg border ${errors.location_code ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm`}
          />
          {errors.location_code && <p className="text-xs text-red-600 mt-1">{errors.location_code}</p>}
        </div>

        {/* SPK (opsional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No. SPK (opsional)</label>
          <input
            value={form.spk_number}
            onChange={(e) => patch('spk_number', e.target.value)}
            className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
            placeholder="Misal: SPK/123/IX/2025"
          />
        </div>

        {/* Deskripsi */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Aktivitas<span className="text-red-500">*</span></label>
            <span className={`text-xs ${descCount > MAX_DESC ? 'text-red-600' : 'text-gray-500'}`}>{descCount}/{MAX_DESC}</span>
          </div>
          <textarea
            value={form.activity_description}
            onChange={(e) => patch('activity_description', e.target.value)}
            className={`w-full rounded-lg border ${errors.activity_description ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm`}
            rows={4}
            placeholder="Contoh: Pembersihan lahan blok 1A"
          />
          {errors.activity_description && <p className="text-xs text-red-600 mt-1">{errors.activity_description}</p>}
          <p className="text-xs text-gray-500 mt-1">Tips: tulis detail singkat tapi jelas (aktivitas, blok, catatan khusus).</p>
        </div>
      </div>
    </Modal>
  );
}
