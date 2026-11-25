// Build-time only: renders each page to HTML for scripts/prerender.mjs.
import { renderToString } from "react-dom/server";
import { StrictMode } from "react";
import { pages, type PageKey } from "./pages";
import { about, links, site, upcoming } from "./content";
import { arcCase } from "./data/arc-case";

export { pages };
export const siteUrl = site.url;

export function render(key: PageKey) {
  return renderToString(<StrictMode>{pages[key].render()}</StrictMode>);
}

/** Every draft placeholder still in the content, so the build can list what is left to confirm. */
export function drafts(): string[] {
  const all = [...about.paragraphs, about.looking, ...upcoming.map((u) => u.note), ...arcCase.learned, arcCase.next];
  const out = all.filter((d) => d.draft).map((d) => d.text);
  if (!links.email) out.push("links.email (public contact email) is not set: the contact section shows a draft notice");
  if (!site.url) out.push("site.url (public address) is not set: canonical and share tags are left out");
  return out;
}
