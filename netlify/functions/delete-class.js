import { getStore } from "@netlify/blobs";

export default async (req) => {
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), { status: 400 });
  }

  const { slug } = body || {};
  if (!slug) {
    return new Response(JSON.stringify({ ok: false, error: "Missing slug" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const store = getStore("seating-planner");
  await store.delete(`classplan:${slug}`);

  const index = (await store.get("classplan-index", { type: "json" })) || [];
  await store.setJSON(
    "classplan-index",
    index.filter((c) => c.slug !== slug)
  );

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
};
