import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";

export default defineConfig({
  plugins: [
    solidStart(),
    nitro(),
  ],
  optimizeDeps: {
    exclude: ["bun:sqlite"],
  },
  build: {
    rollupOptions: {
      external: ["bun:sqlite"],
    },
  },
  // ✅ removed ssr block — was likely causing the blank page
});