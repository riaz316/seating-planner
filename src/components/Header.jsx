import React from "react";
import { Eye, EyeOff, Printer, Undo2, Redo2 } from "lucide-react";

export default function Header({
  selectedSlug,
  view,
  setView,
  undo,
  redo,
  canUndo,
  canRedo,
  onPrint,
}) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-bold text-slate-900 mb-2">Classroom Seating Planner</h1>
      <div className="flex flex-wrap items-center gap-2 no-print">
        {selectedSlug && (
          <>
            <button
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-sm font-medium disabled:opacity-30"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-sm font-medium disabled:opacity-30"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView(view === "teacher" ? "student" : "teacher")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-sm font-medium"
            >
              {view === "teacher" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {view === "teacher" ? "Switch to student view" : "Switch to teacher view"}
            </button>
            <button
              onClick={() => onPrint("teacher")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-sm font-medium"
            >
              <Printer className="w-4 h-4" /> Print teacher view
            </button>
            <button
              onClick={() => onPrint("student")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-100 text-sm font-medium"
            >
              <Printer className="w-4 h-4" /> Print student view
            </button>
          </>
        )}
      </div>
    </div>
  );
}
