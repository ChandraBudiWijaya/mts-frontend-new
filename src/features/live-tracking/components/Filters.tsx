// src/features/live-tracking/components/Filters.tsx
import { useMemo } from "react";
import { usePGs, useWilayah, useMandors } from "../hooks/useMasterData";

type Props = {
  value: { pgId?: string; wilayahId?: string; mandorId?: string };
  onChange: (v: Props["value"]) => void;
  onSearch: () => void;
};

export default function Filters({ value, onChange, onSearch }: Props) {
  const pgs = usePGs();
  const wilayah = useWilayah(value.pgId);
  const mandors = useMandors(value.pgId, value.wilayahId);

  const disableSearch = useMemo(() => !value.pgId, [value.pgId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <select
        className="border rounded-lg p-2"
        value={value.pgId ?? ""}
        onChange={(e) => onChange({ ...value, pgId: e.target.value || undefined, wilayahId: undefined, mandorId: undefined })}
      >
        <option value="">Pilih Plantation Group</option>
        {pgs.map(pg => <option key={pg.id} value={pg.id}>{pg.code}</option>)}
      </select>

      <select
        className="border rounded-lg p-2"
        value={value.wilayahId ?? ""}
        onChange={(e) => onChange({ ...value, wilayahId: e.target.value || undefined, mandorId: undefined })}
        disabled={!value.pgId}
      >
        <option value="">Semua Wilayah</option>
        {wilayah.map(w => <option key={w.id} value={w.id}>{w.code}</option>)}
      </select>

      <select
        className="border rounded-lg p-2"
        value={value.mandorId ?? ""}
        onChange={(e) => onChange({ ...value, mandorId: e.target.value || undefined })}
        disabled={!value.pgId}
      >
        <option value="">Semua Mandor</option>
        {mandors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>

      <button
        className="rounded-lg p-2 border bg-gray-50 hover:bg-gray-100"
        onClick={onSearch}
        disabled={disableSearch}
      >
        Search
      </button>
    </div>
  );
}
