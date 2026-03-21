import type { APIEvent } from "@solidjs/start/server";
import { getBlockchains, getCategories, getEventTypes } from "../../db/client";

export async function GET(_event: APIEvent) {
  const [blockchains, categories, eventTypes] = await Promise.all([
    getBlockchains(),
    getCategories(),
    getEventTypes(),
  ]);

  return Response.json({ blockchains, categories, eventTypes });
}