import type { APIEvent } from "@solidjs/start/server";
import { getEventTypes } from "../../db/client";

export async function GET(_event: APIEvent) {
  const data = await getEventTypes();
  return Response.json(data);
}