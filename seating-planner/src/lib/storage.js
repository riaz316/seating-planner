const BASE = "/.netlify/functions";

export async function loadIndex() {
  try {
    const r = await fetch(`${BASE}/list-classes`);
    if (!r.ok) return [];
    return await r.json();
  } catch (e) {
    console.error("Failed to load class index", e);
    return [];
  }
}

export async function loadClassData(slug) {
  try {
    const r = await fetch(`${BASE}/get-class?slug=${encodeURIComponent(slug)}`);
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    console.error("Failed to load class", e);
    return null;
  }
}

// data is the full class board object, expected to include a `name` field.
export async function persistClassData(slug, data) {
  try {
    const r = await fetch(`${BASE}/save-class`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug, name: data.name, data }),
    });
    return r.ok;
  } catch (e) {
    console.error("Failed to save class", e);
    return false;
  }
}

export async function deleteClassData(slug) {
  try {
    await fetch(`${BASE}/delete-class`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  } catch (e) {
    console.error("Failed to delete class", e);
  }
}
