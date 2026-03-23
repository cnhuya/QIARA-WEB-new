import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: false,
  vite: {
    server: {
      port: 3000,
    },
    optimizeDeps: {
      exclude: ["bun:sqlite"],
    },
    build: {
      rollupOptions: {
        external: ["bun:sqlite"],
      },
      target: "esnext",
    },
  },
});