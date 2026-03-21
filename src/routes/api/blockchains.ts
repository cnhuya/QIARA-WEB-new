import type { APIEvent } from "@solidjs/start/server";
import { getBlockchains } from "../../db/client";

export async function GET(_event: APIEvent) {
  const data = await getBlockchains();
  return Response.json(data);
}