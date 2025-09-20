// src/features/workplans/components/DeleteDialog.tsx
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import type { WorkPlanRow } from '../types';
import { fmtDateDMY } from '../utils';

type Props = {
  row: WorkPlanRow | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteDialog({ row, deleting, onClose, onConfirm }: Props) {
  return (
    <ConfirmDialog
      open={!!row}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Hapus Rencana Kerja"
      message={`Anda yakin ingin menghapus rencana tanggal ${row ? fmtDateDMY(row.date) : ''} milik ${row?.employee?.name ?? '-'}?`}
      confirmText={deleting ? 'Menghapus...' : 'Ya, Hapus'}
    />
  );
}
