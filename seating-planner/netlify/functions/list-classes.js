import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("seating-planner");
  const index = (await store.get("classplan-index", { type: "json" })) || [];
  return new Response(JSON.stringify(index), {
    headers: { "content-type": "application/json" },
  });
};
