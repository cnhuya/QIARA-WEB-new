import { solidStart } from "@solidjs/start/config";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    solidStart({
      ssr: true,
    }),
  ],
  optimizeDeps: {
    exclude: ["bun:sqlite"],
  },
  build: {
    rollupOptions: {
      external: ["bun:sqlite"],
    },
  },
});