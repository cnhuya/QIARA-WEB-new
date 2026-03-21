import type { APIEvent } from "@solidjs/start/server";
import { getCategories } from "../../db/client";

export async function GET(_event: APIEvent) {
  const data = await getCategories();
  return Response.json(data);
}