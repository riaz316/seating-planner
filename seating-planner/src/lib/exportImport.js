import { loadIndex, loadClassData, persistClassData } from "./storage.js";

export async function exportAllClasses() {
  const index = await loadIndex();
  const classes = [];
  for (const c of index) {
    const data = await loadClassData(c.slug);
    if (data) classes.push({ slug: c.slug, name: c.name, data });
  }
  const payload = {
    exportedAt: new Date().toISOString(),
    classes,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seating-planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Returns { restored, failed }
export async function importClassesFromFile(file) {
  const text = await file.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("That file isn't valid JSON.");
  }
  const classes = Array.isArray(payload?.classes) ? payload.classes : [];
  let restored = 0;
  let failed = 0;
  for (const c of classes) {
    if (!c.slug || !c.data) {
      failed++;
      continue;
    }
    const ok = await persistClassData(c.slug, { ...c.data, name: c.name || c.data.name });
    if (ok) restored++;
    else failed++;
  }
  return { restored, failed };
}
