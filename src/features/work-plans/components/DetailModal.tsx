// src/features/workplans/components/DetailModal.tsx
import Modal from '../../../components/ui/Modal';
import type { WorkPlanRow } from '../types';
import { fmtDateDMY } from '../utils';

export default function DetailModal({ row, onClose }: { row: WorkPlanRow | null; onClose: () => void }) {
  return (
    <Modal open={!!row} onClose={onClose} title="Detail Rencana Kerja">
      {row && (
        <div className="space-y-2 text-sm">
          <Row label="Tanggal" value={fmtDateDMY(row.date)} />
          <Row label="Mandor" value={row.employee?.name} />
          <Row label="Lokasi" value={row.geofence?.location_code ?? row.geofence?.name} />
          <Row label="Wilayah" value={row.wilayah ?? '-'} />
          <Row label="PG" value={row.pg ?? '-'} />
          <Row label="Status" value={row.status} />
          <Row label="No. SPK" value={row.spk_number || '-'} />
          <Row label="Aktivitas" value={row.activity} />
          <Row label="Dibuat Oleh" value={row.created_by || '-'} />
          <Row label="Disetujui Oleh" value={row.approved_by || '-'} />
          <Row label="Dibuat" value={new Date(row.created_at).toLocaleString()} />
          <Row label="Diupdate" value={new Date(row.updated_at).toLocaleString()} />
        </div>
      )}
    </Modal>
  );
}

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="text-gray-500">{label}</div>
      <div className="col-span-2 text-gray-900">{value ?? '-'}</div>
    </div>
  );
}
