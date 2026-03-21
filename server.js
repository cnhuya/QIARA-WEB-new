import { join } from "path";

const { default: handler } = await import("./dist/server/entry-server.js");
const staticDir = join(import.meta.dir, "dist/client");

Bun.serve({
  port: process.env.PORT ?? 3001,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    const filePath = join(staticDir, pathname);
    try {
      const file = Bun.file(filePath);
      if (await file.exists()) {
        return new Response(file);
      }
    } catch {}

    return handler.fetch(req);
  }
});

console.log(`Listening on http://localhost:${process.env.PORT ?? 3001}`);