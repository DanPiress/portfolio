import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque/wght.css";
import "@fontsource-variable/dm-sans/wght.css";
import "./styles.css";
import { pages, type PageKey } from "./pages";

/** Hydrates the prerendered page (production) or renders it from scratch (dev server). */
export function boot(key: PageKey) {
  const page = pages[key];
  const root = document.getElementById("root")!;
  const app = <StrictMode>{page.render()}</StrictMode>;
  if (root.firstElementChild) hydrateRoot(root, app);
  else {
    document.title = page.title;
    createRoot(root).render(app);
  }
}
