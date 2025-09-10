import { type ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  widthClass?: string;
}

export default function Modal({ open, title, onClose, children, footer, widthClass = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', onKey);
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative w-full ${widthClass} mx-4 bg-white rounded-lg shadow-xl`}>
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">?</button>
          </div>
        )}
        <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>
        {footer && (
          <div className="px-4 py-3 border-t bg-gray-50 flex justify-end space-x-2">{footer}</div>
        )}
      </div>
    </div>
  );
}

