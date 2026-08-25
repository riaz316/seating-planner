import React from "react";
import { X, Search } from "lucide-react";
import DotRow from "./DotRow.jsx";

export default function SeatModal({
  activeSeat,
  activeOccupant,
  seatSearch,
  setSeatSearch,
  filteredUnseated,
  onClose,
  onAssign,
  onRemoveFromSeat,
  onDeleteStudent,
  onToggle1,
  onToggle2,
  onToggle3,
}) {
  if (!activeSeat) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 no-print" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-80 p-4">
        {activeOccupant ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-sm">{activeOccupant.name}</div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <DotRow student={activeOccupant} onToggle1={onToggle1} onToggle2={onToggle2} onToggle3={onToggle3} />
            <button
              onClick={onRemoveFromSeat}
              className="w-full mt-3 px-3 py-1.5 rounded-md border border-slate-300 text-sm font-medium hover:bg-slate-100"
            >
              Remove from seat
            </button>
            <button
              onClick={onDeleteStudent}
              className="w-full mt-1.5 px-3 py-1.5 rounded-md text-xs text-red-500 hover:bg-red-50"
            >
              Delete student from class
            </button>
            <div className="border-t border-slate-100 mt-3 pt-3">
              <div className="text-xs font-medium text-slate-500 mb-1">Reassign to:</div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-sm">Assign student</div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
          <input
            autoFocus
            value={seatSearch}
            onChange={(e) => setSeatSearch(e.target.value)}
            placeholder="Search name..."
            className="w-full border border-slate-300 rounded-md pl-7 pr-2 py-1.5 text-sm"
          />
        </div>
        <div className="max-h-48 overflow-auto space-y-1">
          {filteredUnseated.map((s) => (
            <button
              key={s.id}
              onClick={() => onAssign(s.id)}
              className="w-full text-left px-2 py-1.5 rounded-md text-sm hover:bg-slate-100"
            >
              {s.name}
            </button>
          ))}
          {filteredUnseated.length === 0 && (
            <div className="text-xs text-slate-300 italic px-2 py-1.5">No unseated students match</div>
          )}
        </div>
      </div>
    </div>
  );
}
