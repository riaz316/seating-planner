import React from "react";
import { DOT_COLOURS, BLANK_DOT } from "../lib/constants.js";

export default function DotRow({
  student,
  size = "w-2.5 h-2.5",
  onToggle1,
  onToggle2,
  onToggle3,
  onToggle4,
  onToggle5,
  onToggle6,
}) {
  const dot = (colourKey, onClick, title) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(student.id);
      }}
      className={`${size} rounded-full ${colourKey ? DOT_COLOURS[colourKey] : BLANK_DOT}`}
      title={title}
    />
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {dot(student.status.s1, onToggle1, "Toggle green / red")}
        {dot(student.status.s2, onToggle2, "Cycle purple / orange / blank")}
        {dot(student.status.s3, onToggle3, "Toggle yellow (SEND) / blank")}
      </div>
      <div className="flex items-center gap-1">
        {dot(student.status.s4, onToggle4, "Toggle blue (LAC) / blank")}
        {dot(student.status.s5, onToggle5, "Toggle pink (EAL) / blank")}
        {dot(student.status.s6, onToggle6, "Toggle black (PP) / blank")}
      </div>
    </div>
  );
}
