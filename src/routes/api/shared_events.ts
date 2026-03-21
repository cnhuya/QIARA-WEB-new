import type { APIEvent } from "@solidjs/start/server";

export async function GET(event: APIEvent) {
  const url     = new URL(event.request.url);
  const shared  = url.searchParams.get("shared") ?? "";
  const params  = new URLSearchParams({
    shared,
    limit:      url.searchParams.get("limit")      ?? "50",
    offset:     url.searchParams.get("offset")     ?? "0",
    category:   url.searchParams.get("category")   ?? "",
    blockchain: url.searchParams.get("blockchain") ?? "",
    type:       url.searchParams.get("type")       ?? "",
  });

  const data = await fetch(`http://localhost:3001/shared_events?${params}`).then(r => r.json());
  return Response.json(data);
}