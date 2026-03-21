import type { APIEvent } from "@solidjs/start/server";

export async function GET(event: APIEvent) {
  const url        = new URL(event.request.url);
  const limit      = url.searchParams.get("limit")      ?? "50";
  const offset     = url.searchParams.get("offset")     ?? "0";
  const category   = url.searchParams.get("category")   ?? "";
  const blockchain = url.searchParams.get("blockchain") ?? "";
  const type       = url.searchParams.get("type")       ?? "";
  const asset      = url.searchParams.get("asset")      ?? "";

  const params = new URLSearchParams({ limit, offset, category, blockchain, type, asset });
  const data = await fetch(`http://localhost:3001/events?${params}`).then(r => r.json());

  return Response.json(data);
}