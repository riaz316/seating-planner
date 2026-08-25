import React from "react";
import { CELL, DESK_SEATS, FURNITURE_TYPES, DOT_COLOURS, BLANK_DOT } from "../lib/constants.js";
import { displayName } from "../lib/utils.js";

export default function Grid({
  gridRows,
  gridCols,
  desks,
  furniture,
  seatAssignments,
  studentMap,
  view,
  tool,
  layoutLocked,
  onPlaceAt,
  onBackgroundDrop,
  onEraseDesk,
  onEraseFurniture,
  onSeatClick,
  onSeatDrop,
  onDeskDragStart,
  onFurnitureDragStart,
  onSeatDragStart,
  onToggle1,
  onToggle2,
  onToggle3,
}) {
  return (
    <div className="sp-grid overflow-auto bg-white border border-slate-200 rounded-lg p-3">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, ${CELL}px)`,
          gridTemplateRows: `repeat(${gridRows}, ${CELL}px)`,
          gap: "2px",
          position: "relative",
        }}
      >
        {Array.from({ length: gridRows }).map((_, r) =>
          Array.from({ length: gridCols }).map((_, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => onPlaceAt(r, c)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onBackgroundDrop(e, r, c)}
              style={{ gridColumn: c + 1, gridRow: r + 1 }}
              className={`z-0 border border-slate-100 rounded-sm ${
                view === "teacher" && tool && tool !== "eraser" && !layoutLocked
                  ? "hover:bg-slate-100 cursor-pointer"
                  : ""
              }`}
            />
          ))
        )}

        {desks.map((d) => {
          const seats = DESK_SEATS[d.type];
          const occupants = seatAssignments[d.id] || Array(seats).fill(null);
          return (
            <div
              key={d.id}
              style={{ gridColumn: `${d.col + 1} / span ${seats}`, gridRow: `${d.row + 1} / span 1` }}
              className="z-10 flex flex-col bg-white border-2 border-slate-400 rounded-md overflow-hidden"
            >
              {view === "teacher" && !layoutLocked && (
                <div
                  draggable
                  onDragStart={(e) => onDeskDragStart(e, d.id)}
                  onClick={() => tool === "eraser" && onEraseDesk(d.id)}
                  className="h-2 bg-slate-200 hover:bg-slate-300 cursor-move no-print"
                  title="Drag to move desk"
                />
              )}
              <div className="flex flex-1">
                {occupants.map((studentId, idx) => {
                  const student = studentId ? studentMap[studentId] : null;
                  return (
                    <div
                      key={idx}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onSeatDrop(e, d.id, idx)}
                      onClick={() => onSeatClick(d.id, idx, tool)}
                      className={`flex-1 flex flex-col items-center justify-center text-center border-r last:border-r-0 border-slate-200 px-0.5 py-0.5 min-h-[54px] ${
                        view === "teacher" ? "cursor-pointer hover:bg-slate-50" : ""
                      }`}
                    >
                      {student ? (
                        <div
                          draggable={view === "teacher"}
                          onDragStart={(e) => onSeatDragStart(e, d.id, idx, student.id)}
                          className="flex flex-col items-center justify-center w-full h-full cursor-grab"
                        >
                          <span className="text-xs leading-tight line-clamp-2">{displayName(student.name)}</span>
                          {view === "teacher" && (
                            <div className="flex gap-1 mt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggle1(student.id);
                                }}
                                className={`w-2 h-2 rounded-full ${DOT_COLOURS[student.status.s1]}`}
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggle2(student.id);
                                }}
                                className={`w-2 h-2 rounded-full ${
                                  student.status.s2 ? DOT_COLOURS[student.status.s2] : BLANK_DOT
                                }`}
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggle3(student.id);
                                }}
                                className={`w-2 h-2 rounded-full ${
                                  student.status.s3 ? DOT_COLOURS[student.status.s3] : BLANK_DOT
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">empty</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {furniture.map((f) => {
          const w = FURNITURE_TYPES[f.type].width;
          return (
            <div
              key={f.id}
              draggable={view === "teacher" && !layoutLocked}
              onDragStart={(e) => onFurnitureDragStart(e, f.id)}
              onClick={() => view === "teacher" && tool === "eraser" && onEraseFurniture(f.id)}
              style={{ gridColumn: `${f.col + 1} / span ${w}`, gridRow: `${f.row + 1} / span 1` }}
              className={`z-10 rounded-md flex items-center justify-center text-xs font-semibold ${
                FURNITURE_TYPES[f.type].className
              } ${view === "teacher" && !layoutLocked ? "cursor-move" : ""}`}
            >
              {FURNITURE_TYPES[f.type].label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
