import React, { useRef } from "react";
import { Plus, Trash2, Download, Upload } from "lucide-react";

export default function ClassManager({
  classIndex,
  pickSlug,
  setPickSlug,
  onLoad,
  newClassName,
  setNewClassName,
  onCreate,
  selectedSlug,
  onDelete,
  confirmDelete,
  saveStatus,
  onExport,
  onImport,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="no-print inline-flex flex-wrap items-end gap-3 mb-4 bg-white border border-slate-200 rounded-lg p-3">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Load a class</label>
        <div className="flex gap-2">
          <select
            value={pickSlug}
            onChange={(e) => setPickSlug(e.target.value)}
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm"
          >
            <option value="">Select saved class...</option>
            {classIndex.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            disabled={!pickSlug}
            onClick={onLoad}
            className="px-3 py-1.5 rounded-md bg-slate-800 text-white text-sm font-medium disabled:opacity-40"
          >
            Load
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Create a new class</label>
        <div className="flex gap-2">
          <input
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="e.g. 8YA2"
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm w-40"
          />
          <button
            onClick={onCreate}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
      </div>

      {selectedSlug && (
        <div className="flex items-center gap-3">
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" /> {confirmDelete ? "Click again to confirm" : "Delete class"}
          </button>
          <span className="text-xs text-slate-400">
            {saveStatus === "saving" ? "Saving..." : saveStatus === "error" ? "Save failed" : "Saved"}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
        <button
          onClick={onExport}
          title="Download all classes as a backup file"
          className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-sm font-medium"
        >
          <Download className="w-4 h-4" /> Export backup
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Restore classes from a backup file"
          className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-sm font-medium"
        >
          <Upload className="w-4 h-4" /> Import backup
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImport(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
