import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: false,
  server: {
    preset: "bun",
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  vite: {
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