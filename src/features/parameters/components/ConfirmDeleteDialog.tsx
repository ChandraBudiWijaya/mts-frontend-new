import React from "react";
import { Button } from "../../../components/ui";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
};

const ConfirmDeleteDialog: React.FC<Props> = ({
  isOpen, onClose, onConfirm, title = "Delete parameter?",
  message = "Tindakan ini tidak bisa dibatalkan.", loading
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-2">{message}</p>
        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose} variant="secondary" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteDialog;
