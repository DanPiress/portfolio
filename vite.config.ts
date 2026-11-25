import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// These routes are prerendered to static HTML so direct links and reloads need no rewrite rules.
export default defineConfig({
  appType: "mpa",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        arc: resolve(import.meta.dirname, "work/arc/index.html"),
        playtestDesk: resolve(import.meta.dirname, "work/playtest-desk/index.html"),
        notFound: resolve(import.meta.dirname, "404.html"),
      },
    },
  },
});
