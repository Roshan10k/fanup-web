"use client";

import { AlertTriangle, X } from "lucide-react";

interface DeleteTeamModalProps {
  isOpen: boolean;
  teamName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteTeamModal({
  isOpen,
  teamName,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteTeamModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-red-500 to-red-600 px-6 py-7 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1 hover:bg-white/20 transition-colors"
            aria-label="Close delete modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Delete Team</h3>
              <p className="text-sm text-white/90">This action cannot be undone.</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <p className="text-sm text-gray-700">
            Delete <span className="font-semibold text-gray-900">{teamName}</span> from this contest?
            You can create a new team for the same match after deleting.
          </p>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
