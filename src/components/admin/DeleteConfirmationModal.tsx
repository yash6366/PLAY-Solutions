"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  itemName?: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  title,
  description,
  itemName,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="bg-slate-900 border border-red-900/60 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-950/70 border border-red-800 rounded-xl text-red-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h2 id="delete-dialog-title" className="text-lg font-bold text-white tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {description}
            </p>
            {itemName && (
              <p className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300 mt-3 truncate">
                {itemName}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-600/30 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Confirm Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
