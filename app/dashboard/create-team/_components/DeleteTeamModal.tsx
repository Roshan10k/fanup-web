"use client";

import { AlertTriangle, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useThemeMode } from "../../_components/useThemeMode";

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
  const { isDark } = useThemeMode();

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md overflow-hidden rounded-xl border shadow-2xl ${isDark ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white"}`}
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

        <div className={`px-6 py-6 ${isDark ? "bg-slate-900" : "bg-white"}`}>
          <p className={`text-sm ${isDark ? "text-slate-300" : "text-gray-700"}`}>
            Delete <span className={`font-semibold ${isDark ? "text-slate-100" : "text-gray-900"}`}>{teamName}</span> from this contest?
            You can create a new team for the same match after deleting.
          </p>
        </div>

        <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"}`}>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className={`px-5 py-2.5 rounded-lg border font-medium transition disabled:opacity-50 ${isDark ? "border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"}`}
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

  return createPortal(modalContent, document.body);
}
