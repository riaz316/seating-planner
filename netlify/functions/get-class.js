import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  if (!slug) {
    return new Response(JSON.stringify(null), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  const store = getStore("seating-planner");
  const data = await store.get(`classplan:${slug}`, { type: "json" });
  return new Response(JSON.stringify(data || null), {
    headers: { "content-type": "application/json" },
  });
};
