import React from "react";
import { DOT_COLOURS, BLANK_DOT } from "../lib/constants.js";

export default function DotRow({ student, size = "w-2.5 h-2.5", onToggle1, onToggle2, onToggle3 }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle1(student.id);
        }}
        className={`${size} rounded-full ${DOT_COLOURS[student.status.s1]}`}
        title="Toggle green / red"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle2(student.id);
        }}
        className={`${size} rounded-full ${student.status.s2 ? DOT_COLOURS[student.status.s2] : BLANK_DOT}`}
        title="Cycle purple / orange / blank"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle3(student.id);
        }}
        className={`${size} rounded-full ${student.status.s3 ? DOT_COLOURS[student.status.s3] : BLANK_DOT}`}
        title="Toggle yellow / blank"
      />
    </div>
  );
}
