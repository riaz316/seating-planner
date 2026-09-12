export const CELL = 70;

export const DESK_SEATS = { single: 1, double: 2, triple: 3 };
export const DESK_LABELS = { single: "Single", double: "Double", triple: "Triple" };

export const FURNITURE_TYPES = {
  teacher: { label: "Teacher Desk", width: 2, className: "bg-slate-700 text-white" },
  whiteboard: { label: "Whiteboard", width: 4, className: "bg-sky-700 text-white" },
  door: { label: "Door", width: 1, className: "bg-amber-700 text-white" },
};

export const DOT_COLOURS = {
  green: "bg-emerald-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  lac: "bg-blue-600",
  eal: "bg-pink-600",
  pp: "bg-neutral-900",
};
export const BLANK_DOT = "bg-white border border-slate-300";

export const LEGEND = [
  { colour: "green", label: "On track" },
  { colour: "red", label: "Off track" },
  { colour: "purple", label: "Grade leapers" },
  { colour: "orange", label: "SAF" },
  { colour: "yellow", label: "SEND" },
  { colour: "lac", label: "LAC" },
  { colour: "eal", label: "EAL" },
  { colour: "pp", label: "PP" },
];

export const DEFAULT_GRID_ROWS = 14;
export const DEFAULT_GRID_COLS = 10;
