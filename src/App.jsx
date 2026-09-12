import React, { useState, useEffect, useMemo, useRef } from "react";

import { DESK_SEATS, FURNITURE_TYPES, DEFAULT_GRID_ROWS, DEFAULT_GRID_COLS } from "./lib/constants.js";
import { slugify, deepCopy } from "./lib/utils.js";
import { loadIndex, loadClassData, persistClassData, deleteClassData } from "./lib/storage.js";
import { exportAllClasses, importClassesFromFile } from "./lib/exportImport.js";

import Header from "./components/Header.jsx";
import ClassManager from "./components/ClassManager.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SendNotes from "./components/SendNotes.jsx";
import Grid from "./components/Grid.jsx";
import SeatModal from "./components/SeatModal.jsx";
import ConfirmModal from "./components/ConfirmModal.jsx";

export default function App() {
  const [classIndex, setClassIndex] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [className, setClassName] = useState("");
  const [loadingIndex, setLoadingIndex] = useState(true);

  const [students, setStudents] = useState([]);
  const [desks, setDesks] = useState([]);
  const [furniture, setFurniture] = useState([]);
  const [seatAssignments, setSeatAssignments] = useState({});
  const [gridRows, setGridRows] = useState(DEFAULT_GRID_ROWS);
  const [gridCols, setGridCols] = useState(DEFAULT_GRID_COLS);

  const [view, setView] = useState("teacher");
  const [tool, setTool] = useState(null);
  const [pasteText, setPasteText] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [pickSlug, setPickSlug] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeSeat, setActiveSeat] = useState(null);
  const [seatSearch, setSeatSearch] = useState("");
  const [layoutLocked, setLayoutLocked] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState(null);
  const [importMessage, setImportMessage] = useState("");

  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const noteSnapshotRef = useRef(null);

  useEffect(() => {
    loadIndex().then((list) => {
      setClassIndex(list);
      setLoadingIndex(false);
    });
  }, []);

  // Autosave
  useEffect(() => {
    if (!selectedSlug) return;
    setSaveStatus("saving");
    const t = setTimeout(async () => {
      const ok = await persistClassData(selectedSlug, {
        name: className,
        students,
        desks,
        furniture,
        seatAssignments,
        gridRows,
        gridCols,
      });
      setSaveStatus(ok ? "saved" : "error");
    }, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, desks, furniture, seatAssignments, gridRows, gridCols, selectedSlug]);

  // ---------- Undo / redo ----------
  const snapshot = () => ({
    students: deepCopy(students),
    desks: deepCopy(desks),
    furniture: deepCopy(furniture),
    seatAssignments: deepCopy(seatAssignments),
  });
  const pushHistory = () => {
    setPast((prev) => [...prev.slice(-49), snapshot()]);
    setFuture([]);
  };
  const restore = (snap) => {
    setStudents(snap.students);
    setDesks(snap.desks);
    setFurniture(snap.furniture);
    setSeatAssignments(snap.seatAssignments);
  };
  const undo = () => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;
      const last = prevPast[prevPast.length - 1];
      setFuture((prevFuture) => [...prevFuture, snapshot()]);
      restore(last);
      return prevPast.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;
      const last = prevFuture[prevFuture.length - 1];
      setPast((prevPast) => [...prevPast, snapshot()]);
      restore(last);
      return prevFuture.slice(0, -1);
    });
  };

  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (key === "y" || (key === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, desks, furniture, seatAssignments, past, future]);

  const resetBoard = () => {
    setStudents([]);
    setDesks([]);
    setFurniture([]);
    setSeatAssignments({});
    setGridRows(DEFAULT_GRID_ROWS);
    setGridCols(DEFAULT_GRID_COLS);
    setPast([]);
    setFuture([]);
  };

  const refreshIndex = async () => setClassIndex(await loadIndex());

  const handleCreateClass = async () => {
    const name = newClassName.trim();
    if (!name) return;
    const slug = slugify(name);
    const existing = classIndex.find((c) => c.slug === slug);
    if (existing) {
      await handleSelectClass(slug, existing.name);
      setNewClassName("");
      return;
    }
    resetBoard();
    setClassName(name);
    setSelectedSlug(slug);
    await persistClassData(slug, {
      name,
      students: [],
      desks: [],
      furniture: [],
      seatAssignments: {},
      gridRows: DEFAULT_GRID_ROWS,
      gridCols: DEFAULT_GRID_COLS,
    });
    await refreshIndex();
    setNewClassName("");
    setSaveStatus("saved");
  };

  const handleSelectClass = async (slug, name) => {
    const data = await loadClassData(slug);
    if (data) {
      setClassName(data.name || name || "");
      setStudents(data.students || []);
      setDesks(data.desks || []);
      setFurniture(data.furniture || []);
      setSeatAssignments(data.seatAssignments || {});
      setGridRows(data.gridRows || DEFAULT_GRID_ROWS);
      setGridCols(data.gridCols || DEFAULT_GRID_COLS);
    } else {
      resetBoard();
      setClassName(name || "");
    }
    setSelectedSlug(slug);
    setSaveStatus("saved");
    setPast([]);
    setFuture([]);
  };

  const handleDeleteClass = async () => {
    if (!selectedSlug) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    await deleteClassData(selectedSlug);
    await refreshIndex();
    setSelectedSlug(null);
    setClassName("");
    resetBoard();
    setConfirmDelete(false);
  };

  const handleExport = () => exportAllClasses();
  const handleImport = async (file) => {
    try {
      const { restored, failed } = await importClassesFromFile(file);
      await refreshIndex();
      setImportMessage(`Restored ${restored} class${restored === 1 ? "" : "es"}${failed ? `, ${failed} failed` : ""}.`);
    } catch (e) {
      setImportMessage(e.message || "Import failed.");
    }
    setTimeout(() => setImportMessage(""), 5000);
  };

  // ---------- Occupancy ----------
  const occupiedCells = (excludeDeskId, excludeFurnId) => {
    const set = new Set();
    desks.forEach((d) => {
      if (d.id === excludeDeskId) return;
      const seats = DESK_SEATS[d.type];
      for (let c = 0; c < seats; c++) set.add(`${d.row},${d.col + c}`);
    });
    furniture.forEach((f) => {
      if (f.id === excludeFurnId) return;
      const w = FURNITURE_TYPES[f.type].width;
      for (let c = 0; c < w; c++) set.add(`${f.row},${f.col + c}`);
    });
    return set;
  };

  const handlePlaceAt = (row, col) => {
    if (view !== "teacher" || !tool || tool === "eraser" || !selectedSlug || layoutLocked) return;
    const occ = occupiedCells(null, null);
    if (tool.kind === "desk") {
      const seats = DESK_SEATS[tool.type];
      if (col + seats > gridCols) return;
      for (let c = 0; c < seats; c++) if (occ.has(`${row},${col + c}`)) return;
      pushHistory();
      const id = crypto.randomUUID();
      setDesks((prev) => [...prev, { id, type: tool.type, row, col }]);
      setSeatAssignments((prev) => ({ ...prev, [id]: Array(seats).fill(null) }));
    } else if (tool.kind === "furniture") {
      const w = FURNITURE_TYPES[tool.type].width;
      if (col + w > gridCols) return;
      for (let c = 0; c < w; c++) if (occ.has(`${row},${col + c}`)) return;
      pushHistory();
      setFurniture((prev) => [...prev, { id: crypto.randomUUID(), type: tool.type, row, col }]);
      setTool(null);
    }
  };

  const eraseDesk = (id) => {
    pushHistory();
    setDesks((prev) => prev.filter((d) => d.id !== id));
    setSeatAssignments((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };
  const eraseFurniture = (id) => {
    pushHistory();
    setFurniture((prev) => prev.filter((f) => f.id !== id));
  };

  const handleBackgroundDrop = (e, row, col) => {
    e.preventDefault();
    if (layoutLocked) return;
    let data;
    try {
      data = JSON.parse(e.dataTransfer.getData("text/plain") || "{}");
    } catch {
      return;
    }
    if (data.kind === "moveDesk") {
      const desk = desks.find((d) => d.id === data.id);
      if (!desk) return;
      const seats = DESK_SEATS[desk.type];
      if (col + seats > gridCols) return;
      const occ = occupiedCells(desk.id, null);
      for (let c = 0; c < seats; c++) if (occ.has(`${row},${col + c}`)) return;
      pushHistory();
      setDesks((prev) => prev.map((d) => (d.id === desk.id ? { ...d, row, col } : d)));
    } else if (data.kind === "moveFurniture") {
      const furn = furniture.find((f) => f.id === data.id);
      if (!furn) return;
      const w = FURNITURE_TYPES[furn.type].width;
      if (col + w > gridCols) return;
      const occ = occupiedCells(null, furn.id);
      for (let c = 0; c < w; c++) if (occ.has(`${row},${col + c}`)) return;
      pushHistory();
      setFurniture((prev) => prev.map((f) => (f.id === furn.id ? { ...f, row, col } : f)));
    }
  };

  // ---------- Students ----------
  const unseatedStudents = useMemo(() => {
    const seatedIds = new Set();
    Object.values(seatAssignments).forEach((arr) => arr.forEach((id) => id && seatedIds.add(id)));
    return students.filter((s) => !seatedIds.has(s.id));
  }, [students, seatAssignments]);

  const studentMap = useMemo(() => {
    const m = {};
    students.forEach((s) => (m[s.id] = s));
    return m;
  }, [students]);

  const addStudents = () => {
    const names = pasteText.split("\n").map((n) => n.trim()).filter(Boolean);
    if (!names.length) return;
    pushHistory();
    setStudents((prev) => [
      ...prev,
      ...names.map((name) => ({
        id: crypto.randomUUID(),
        name,
        status: { s1: "green", s2: null, s3: null, s4: null, s5: null, s6: null },
        note: "",
      })),
    ]);
    setPasteText("");
  };

  const unseatStudent = (studentId) => {
    pushHistory();
    setSeatAssignments((prev) => {
      const next = deepCopy(prev);
      Object.keys(next).forEach((deskId) => {
        const idx = next[deskId].indexOf(studentId);
        if (idx !== -1) next[deskId][idx] = null;
      });
      return next;
    });
  };

  const deleteStudent = (studentId) => {
    pushHistory();
    setSeatAssignments((prev) => {
      const next = deepCopy(prev);
      Object.keys(next).forEach((deskId) => {
        const idx = next[deskId].indexOf(studentId);
        if (idx !== -1) next[deskId][idx] = null;
      });
      return next;
    });
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    if (activeSeat) setActiveSeat(null);
  };

  const toggleDot1 = (id) => {
    pushHistory();
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: { ...s.status, s1: s.status.s1 === "green" ? "red" : "green" } } : s))
    );
  };
  const cycleDot2 = (id) => {
    pushHistory();
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const order = [null, "purple", "orange"];
        const next = order[(order.indexOf(s.status.s2) + 1) % order.length];
        return { ...s, status: { ...s.status, s2: next } };
      })
    );
  };
  const toggleDot3 = (id) => {
    pushHistory();
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: { ...s.status, s3: s.status.s3 === "yellow" ? null : "yellow" } } : s))
    );
  };
  const toggleDot4 = (id) => {
    pushHistory();
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: { ...s.status, s4: s.status.s4 === "lac" ? null : "lac" } } : s))
    );
  };
  const toggleDot5 = (id) => {
    pushHistory();
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: { ...s.status, s5: s.status.s5 === "eal" ? null : "eal" } } : s))
    );
  };
  const toggleDot6 = (id) => {
    pushHistory();
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: { ...s.status, s6: s.status.s6 === "pp" ? null : "pp" } } : s))
    );
  };

  const updateNote = (studentId, text) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, note: text } : s)));
  };

  const assignToActiveSeat = (studentId) => {
    if (!activeSeat) return;
    pushHistory();
    setSeatAssignments((prev) => {
      const next = deepCopy(prev);
      next[activeSeat.deskId][activeSeat.seatIndex] = studentId;
      return next;
    });
    setActiveSeat(null);
    setSeatSearch("");
  };

  const handleSeatClick = (deskId, seatIndex, currentTool) => {
    if (view !== "teacher") return;
    if (currentTool === "eraser") {
      eraseDesk(deskId);
      return;
    }
    setActiveSeat({ deskId, seatIndex });
    setSeatSearch("");
  };

  const handleSeatDrop = (e, deskId, idx) => {
    e.preventDefault();
    e.stopPropagation();
    let data;
    try {
      data = JSON.parse(e.dataTransfer.getData("text/plain") || "{}");
    } catch {
      return;
    }
    if (data.kind !== "seatSwap") return;
    const { deskId: srcDesk, seatIndex: srcIdx, studentId } = data;
    if (srcDesk === deskId && srcIdx === idx) return;
    pushHistory();
    setSeatAssignments((prev) => {
      const next = deepCopy(prev);
      if (!next[srcDesk] || !next[deskId]) return prev;
      const targetOccupant = next[deskId][idx];
      if (targetOccupant) {
        next[srcDesk][srcIdx] = targetOccupant;
        next[deskId][idx] = studentId;
      } else {
        next[srcDesk][srcIdx] = null;
        next[deskId][idx] = studentId;
      }
      return next;
    });
  };

  const handlePrint = (targetView) => {
    setView(targetView);
    setTimeout(() => window.print(), 150);
  };

  const doClearSeating = () => {
    pushHistory();
    setSeatAssignments((prev) => {
      const next = {};
      Object.keys(prev).forEach((k) => (next[k] = prev[k].map(() => null)));
      return next;
    });
    setPendingConfirm(null);
  };
  const doClearLayout = () => {
    pushHistory();
    setDesks([]);
    setFurniture([]);
    setSeatAssignments({});
    setPendingConfirm(null);
  };

  const activeOccupantId =
    activeSeat && seatAssignments[activeSeat.deskId] ? seatAssignments[activeSeat.deskId][activeSeat.seatIndex] : null;
  const activeOccupant = activeOccupantId ? studentMap[activeOccupantId] : null;
  const filteredUnseated = unseatedStudents.filter((s) => s.name.toLowerCase().includes(seatSearch.toLowerCase()));

  const sendStudents = students.filter((s) => s.status && s.status.s3 === "yellow");

  if (loadingIndex) return <div className="p-8 text-slate-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <style>{`
        .sp-gridwrap { margin-right: 0; }
        .sp-sidebar { width: 100%; }
        .sp-grid { width: 100%; }
        .sp-notes { width: 100%; }
        @media (min-width: 640px) {
          .sp-gridwrap { margin-right: 20vw; }
          .sp-grid { width: calc(75% - 8px); flex: none; }
          .sp-notes { width: auto; flex: 1 1 0%; min-width: 0; }
          .sp-sidebar {
            width: 20vw;
            position: fixed;
            top: 1rem;
            right: 1rem;
            bottom: 1rem;
            overflow-y: auto;
            z-index: 20;
            padding-right: 0.25rem;
          }
        }
      `}</style>

      <div className="w-full p-4 sm:p-6">
        <Header
          selectedSlug={selectedSlug}
          view={view}
          setView={setView}
          undo={undo}
          redo={redo}
          canUndo={past.length > 0}
          canRedo={future.length > 0}
          onPrint={handlePrint}
        />

        <ClassManager
          classIndex={classIndex}
          pickSlug={pickSlug}
          setPickSlug={setPickSlug}
          onLoad={() => {
            const c = classIndex.find((c) => c.slug === pickSlug);
            handleSelectClass(pickSlug, c && c.name);
          }}
          newClassName={newClassName}
          setNewClassName={setNewClassName}
          onCreate={handleCreateClass}
          selectedSlug={selectedSlug}
          onDelete={handleDeleteClass}
          confirmDelete={confirmDelete}
          saveStatus={saveStatus}
          onExport={handleExport}
          onImport={handleImport}
        />

        {importMessage && <div className="no-print text-xs text-slate-500 mb-4">{importMessage}</div>}

        {!selectedSlug ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-lg p-10 text-center text-slate-500">
            Create or load a class above to get started.
          </div>
        ) : (
          <>
            <div className="text-lg font-semibold mb-3">{className}</div>

            <div className="flex flex-col sm:flex-row gap-4 sp-gridwrap">
              <Grid
                gridRows={gridRows}
                gridCols={gridCols}
                desks={desks}
                furniture={furniture}
                seatAssignments={seatAssignments}
                studentMap={studentMap}
                view={view}
                tool={tool}
                layoutLocked={layoutLocked}
                onPlaceAt={handlePlaceAt}
                onBackgroundDrop={handleBackgroundDrop}
                onEraseDesk={eraseDesk}
                onEraseFurniture={eraseFurniture}
                onSeatClick={handleSeatClick}
                onSeatDrop={handleSeatDrop}
                onDeskDragStart={(e, id) => e.dataTransfer.setData("text/plain", JSON.stringify({ kind: "moveDesk", id }))}
                onFurnitureDragStart={(e, id) =>
                  e.dataTransfer.setData("text/plain", JSON.stringify({ kind: "moveFurniture", id }))
                }
                onSeatDragStart={(e, deskId, seatIndex, studentId) => {
                  e.stopPropagation();
                  e.dataTransfer.setData("text/plain", JSON.stringify({ kind: "seatSwap", deskId, seatIndex, studentId }));
                }}
                onToggle1={toggleDot1}
                onToggle2={cycleDot2}
                onToggle3={toggleDot3}
                onToggle4={toggleDot4}
                onToggle5={toggleDot5}
                onToggle6={toggleDot6}
              />

              {view === "teacher" && (
                <SendNotes
                  sendStudents={sendStudents}
                  updateNote={updateNote}
                  onNoteFocus={() => {
                    noteSnapshotRef.current = snapshot();
                  }}
                  onNoteBlur={() => {
                    if (noteSnapshotRef.current) {
                      setPast((prev) => [...prev.slice(-49), noteSnapshotRef.current]);
                      setFuture([]);
                      noteSnapshotRef.current = null;
                    }
                  }}
                />
              )}

              {view === "teacher" && (
                <Sidebar
                  tool={tool}
                  setTool={setTool}
                  layoutLocked={layoutLocked}
                  setLayoutLocked={setLayoutLocked}
                  gridRows={gridRows}
                  setGridRows={setGridRows}
                  gridCols={gridCols}
                  setGridCols={setGridCols}
                  onClearSeatingRequest={() =>
                    setPendingConfirm({
                      message: "Clear all seating assignments? Every seat will become empty again.",
                      onConfirm: doClearSeating,
                    })
                  }
                  onClearLayoutRequest={() =>
                    setPendingConfirm({
                      message: "Remove all desks and furniture from the grid?",
                      onConfirm: doClearLayout,
                    })
                  }
                  pasteText={pasteText}
                  setPasteText={setPasteText}
                  onAddStudents={addStudents}
                  unseatedStudents={unseatedStudents}
                  onDeleteStudent={deleteStudent}
                  onToggle1={toggleDot1}
                  onToggle2={cycleDot2}
                  onToggle3={toggleDot3}
                  onToggle4={toggleDot4}
                  onToggle5={toggleDot5}
                  onToggle6={toggleDot6}
                />
              )}
            </div>
          </>
        )}
      </div>

      <SeatModal
        activeSeat={activeSeat}
        activeOccupant={activeOccupant}
        seatSearch={seatSearch}
        setSeatSearch={setSeatSearch}
        filteredUnseated={filteredUnseated}
        onClose={() => setActiveSeat(null)}
        onAssign={assignToActiveSeat}
        onRemoveFromSeat={() => {
          unseatStudent(activeOccupant.id);
          setActiveSeat(null);
        }}
        onDeleteStudent={() => deleteStudent(activeOccupant.id)}
        onToggle1={toggleDot1}
        onToggle2={cycleDot2}
        onToggle3={toggleDot3}
        onToggle4={toggleDot4}
        onToggle5={toggleDot5}
        onToggle6={toggleDot6}
      />

      <ConfirmModal pendingConfirm={pendingConfirm} onCancel={() => setPendingConfirm(null)} />
    </div>
  );
}
