import React from "react";

export default function ConfirmModal({ pendingConfirm, onCancel }) {
  if (!pendingConfirm) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 no-print" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-80 p-4">
        <div className="text-sm mb-4">{pendingConfirm.message}</div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-1.5 rounded-md border border-slate-300 text-sm font-medium hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={pendingConfirm.onConfirm}
            className="flex-1 px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
