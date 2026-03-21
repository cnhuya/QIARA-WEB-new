import type { APIEvent } from "@solidjs/start/server";

export async function GET(_event: APIEvent) {
  const [blockchains, categories, eventTypes] = await Promise.all([
    fetch("http://localhost:3001/blockchains").then(r => r.json()),
    fetch("http://localhost:3001/categories").then(r => r.json()),
    fetch("http://localhost:3001/event-types").then(r => r.json()),
  ]);

  return Response.json({ blockchains, categories, eventTypes });
}