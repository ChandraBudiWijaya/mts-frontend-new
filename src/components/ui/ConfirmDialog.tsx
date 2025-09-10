import Modal from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  open,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} widthClass="max-w-md"
      footer={(
        <>
          <button onClick={onClose} className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
            {confirmText}
          </button>
        </>
      )}
    >
      <p className="text-gray-700">{message}</p>
    </Modal>
  );
}

