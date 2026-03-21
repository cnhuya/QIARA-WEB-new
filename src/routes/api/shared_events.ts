import type { APIEvent } from "@solidjs/start/server";
import { getSharedEvents } from "../../db/client";

export async function GET(event: APIEvent) {
  const url = new URL(event.request.url);
  const shared = url.searchParams.get("shared");
  if (!shared) return new Response("Missing shared param", { status: 400 });

  const limit      = parseInt(url.searchParams.get("limit")      ?? "50");
  const offset     = parseInt(url.searchParams.get("offset")     ?? "0");
  const category   = url.searchParams.get("category");
  const blockchain = url.searchParams.get("blockchain");
  const type       = url.searchParams.get("type");

  const data = await getSharedEvents(shared, limit, offset, category, blockchain, type);
  return Response.json(data);
}