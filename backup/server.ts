import { startCronjob } from "../src/db/cronjob";
import { getCategories, getBlockchains, getEventTypes, getAllEvents, getSharedEvents } from "../src/db/client";

startCronjob();

Bun.serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/blockchains") {
      const data = await getBlockchains();
      return Response.json(data);
    }
    if (url.pathname === "/categories") {
      const data = await getCategories();
      return Response.json(data);
    }
    if (url.pathname === "/event-types") {
      const data = await getEventTypes();
      return Response.json(data);
    }
    if (url.pathname === "/events") {
      const limit      = parseInt(url.searchParams.get("limit")      ?? "50");
      const offset     = parseInt(url.searchParams.get("offset")     ?? "0");
      const category   = url.searchParams.get("category");
      const blockchain = url.searchParams.get("blockchain");
      const type       = url.searchParams.get("type");
      const asset      = url.searchParams.get("asset");

      const data = await getAllEvents(limit, offset, category, blockchain, type, asset);
      return Response.json(data);
    }
    if (url.pathname === "/shared_events") {
      const shared     = url.searchParams.get("shared");
      if (!shared) return new Response("Missing shared param", { status: 400 });

      const limit      = parseInt(url.searchParams.get("limit")      ?? "50");
      const offset     = parseInt(url.searchParams.get("offset")     ?? "0");
      const category   = url.searchParams.get("category");
      const blockchain = url.searchParams.get("blockchain");
      const type       = url.searchParams.get("type");

      const data = await getSharedEvents(shared, limit, offset, category, blockchain, type);
      return Response.json(data);
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log("[DB Server] Running on http://localhost:3001");