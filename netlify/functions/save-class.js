import { getStore } from "@netlify/blobs";

export default async (req) => {
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), { status: 400 });
  }

  const { slug, name, data } = body || {};
  if (!slug || !data) {
    return new Response(JSON.stringify({ ok: false, error: "Missing slug or data" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const store = getStore("seating-planner");
  await store.setJSON(`classplan:${slug}`, data);

  const index = (await store.get("classplan-index", { type: "json" })) || [];
  const exists = index.find((c) => c.slug === slug);
  const nextIndex = exists
    ? index.map((c) => (c.slug === slug ? { slug, name: name || c.name } : c))
    : [...index, { slug, name: name || slug }];
  await store.setJSON("classplan-index", nextIndex);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
};
