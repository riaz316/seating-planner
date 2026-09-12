import React from "react";

export default function SendNotes({ sendStudents, updateNote, onNoteFocus, onNoteBlur }) {
  return (
    <div className="no-print sp-notes bg-white border border-slate-200 rounded-lg p-3 h-fit">
      <div className="text-xs font-semibold text-slate-500 mb-2">SEND support notes ({sendStudents.length})</div>
      {sendStudents.length === 0 ? (
        <div className="text-xs text-slate-300 italic">No students tagged SEND yet</div>
      ) : (
        <div className="space-y-2">
          {sendStudents.map((s) => (
            <div key={s.id}>
              <div className="text-xs font-medium mb-1">{s.name}</div>
              <textarea
                value={s.note || ""}
                onFocus={onNoteFocus}
                onChange={(e) => updateNote(s.id, e.target.value)}
                onBlur={onNoteBlur}
                rows={2}
                placeholder="How to support this student..."
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
