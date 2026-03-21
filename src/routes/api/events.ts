import type { APIEvent } from "@solidjs/start/server";
import { getAllEvents } from "../../db/query";

export async function GET(event: APIEvent) {
  const url = new URL(event.request.url);

  const limit      = parseInt(url.searchParams.get("limit") ?? "50");
  const offset     = parseInt(url.searchParams.get("offset") ?? "0");
  const category   = url.searchParams.get("category");
  const blockchain = url.searchParams.get("blockchain");
  const type       = url.searchParams.get("type");
  const asset      = url.searchParams.get("asset");

  const data = await getAllEvents({ limit, offset, category, blockchain, type, asset });

  return Response.json(data);
}