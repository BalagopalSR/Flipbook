"use client";

import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";

interface DeleteConfirmModalProps {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ open, title, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title="Delete Flipbook" size="sm">
      <p className="text-sm text-slate-600">
        Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
