import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Two real pages: / and /work/arc/. Each is prerendered to static HTML by scripts/prerender.mjs after the build,
// so direct links and reloads work on any static host without rewrite rules.
export default defineConfig({
  appType: "mpa",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        arc: resolve(import.meta.dirname, "work/arc/index.html"),
        notFound: resolve(import.meta.dirname, "404.html"),
      },
    },
  },
});
