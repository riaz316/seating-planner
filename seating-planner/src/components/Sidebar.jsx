import React from "react";
import { X, Lock, Unlock } from "lucide-react";
import { FURNITURE_TYPES, DESK_LABELS, DOT_COLOURS, LEGEND } from "../lib/constants.js";
import DotRow from "./DotRow.jsx";

export default function Sidebar({
  tool,
  setTool,
  layoutLocked,
  setLayoutLocked,
  gridRows,
  setGridRows,
  gridCols,
  setGridCols,
  onClearSeatingRequest,
  onClearLayoutRequest,
  pasteText,
  setPasteText,
  onAddStudents,
  unseatedStudents,
  onDeleteStudent,
  onToggle1,
  onToggle2,
  onToggle3,
  onToggle4,
  onToggle5,
  onToggle6,
}) {
  return (
    <div className="no-print sp-sidebar flex flex-col gap-3">
      {/* Place tab */}
      <div className="bg-white border border-slate-200 rounded-lg p-3">
        <div className="text-xs font-semibold text-slate-500 mb-2">Place</div>

        <div className="flex flex-wrap items-center gap-1.5 mb-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setTool(tool === "eraser" ? null : "eraser")}
            className={`px-2 py-1 rounded-md border text-xs font-medium ${
              tool === "eraser" ? "bg-red-600 text-white border-red-600" : "bg-white border-slate-300 hover:bg-slate-100"
            }`}
          >
            Erase
          </button>
          <button
            onClick={() => {
              setLayoutLocked((v) => !v);
              setTool(null);
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${
              layoutLocked ? "bg-amber-500 text-white border-amber-500" : "bg-white border-slate-300 hover:bg-slate-100"
            }`}
            title={layoutLocked ? "Unlock layout to move desks/furniture" : "Lock layout to safely drag students"}
          >
            {layoutLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {layoutLocked ? "Locked \u2014 click to unlock" : "Lock layout"}
          </button>
        </div>

        <fieldset disabled={layoutLocked} className={layoutLocked ? "opacity-40" : ""}>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {Object.entries(FURNITURE_TYPES).map(([key, f]) => (
              <button
                key={key}
                onClick={() =>
                  setTool(tool && tool.kind === "furniture" && tool.type === key ? null : { kind: "furniture", type: key })
                }
                className={`px-2 py-1 rounded-md border text-xs font-medium ${
                  tool && tool.kind === "furniture" && tool.type === key
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white border-slate-300 hover:bg-slate-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2 pt-2 border-t border-slate-100">
            {Object.entries(DESK_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() =>
                  setTool(tool && tool.kind === "desk" && tool.type === key ? null : { kind: "desk", type: key })
                }
                className={`px-2 py-1 rounded-md border text-xs font-medium ${
                  tool && tool.kind === "desk" && tool.type === key
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white border-slate-300 hover:bg-slate-100"
                }`}
              >
                {label} desk
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mb-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <label className="text-xs text-slate-500">Row</label>
              <input
                type="number"
                min={4}
                max={20}
                value={gridRows}
                onChange={(e) => setGridRows(Math.max(4, Math.min(20, Number(e.target.value) || 14)))}
                className="w-12 border border-slate-300 rounded-md px-1 py-0.5 text-xs"
              />
              <label className="text-xs text-slate-500">Col</label>
              <input
                type="number"
                min={6}
                max={20}
                value={gridCols}
                onChange={(e) => setGridCols(Math.max(6, Math.min(20, Number(e.target.value) || 10)))}
                className="w-12 border border-slate-300 rounded-md px-1 py-0.5 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
            <button
              onClick={onClearSeatingRequest}
              className="px-2 py-1 rounded-md border border-slate-300 bg-white text-xs font-medium hover:bg-slate-100"
            >
              Clear seating
            </button>
            <button
              onClick={onClearLayoutRequest}
              className="px-2 py-1 rounded-md border border-slate-300 bg-white text-xs font-medium hover:bg-slate-100"
            >
              Clear layout
            </button>
          </div>
        </fieldset>
      </div>

      {/* Colour key */}
      <div className="bg-white border border-slate-200 rounded-lg p-3">
        <div className="text-xs font-semibold text-slate-500 mb-2">Colour key</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {LEGEND.map((l) => (
            <div key={l.colour} className="flex items-center gap-1.5 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${DOT_COLOURS[l.colour]}`} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Paste students */}
      <div className="bg-white border border-slate-200 rounded-lg p-3">
        <div className="text-xs font-semibold text-slate-500 mb-1">Paste student names</div>
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          rows={3}
          placeholder={"Alex Kim\nJordan Patel\n..."}
          className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-xs mb-1.5"
        />
        <button
          onClick={onAddStudents}
          className="w-full px-3 py-1.5 rounded-md bg-slate-800 text-white text-xs font-medium hover:bg-slate-900"
        >
          Add students
        </button>
      </div>

      {/* Unseated list */}
      <div className="bg-white border border-slate-200 rounded-lg p-3">
        <div className="text-xs font-semibold text-slate-500 mb-2">Unseated students ({unseatedStudents.length})</div>
        <div className="space-y-1 max-h-72 overflow-auto">
          {unseatedStudents.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5 px-2 py-1 border border-slate-200 rounded-md text-xs bg-slate-50">
              <span className="flex-1 truncate">{s.name}</span>
              <DotRow
                student={s}
                size="w-2 h-2"
                onToggle1={onToggle1}
                onToggle2={onToggle2}
                onToggle3={onToggle3}
                onToggle4={onToggle4}
                onToggle5={onToggle5}
                onToggle6={onToggle6}
              />
              <button onClick={() => onDeleteStudent(s.id)} className="text-slate-300 hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {unseatedStudents.length === 0 && <div className="text-xs text-slate-300 italic">Everyone is seated</div>}
        </div>
      </div>
    </div>
  );
}
