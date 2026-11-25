// After `vite build` (client) and `vite build --ssr` (server bundle in dist-ssr/), writes each page's HTML and head
// tags into dist/, so every page works as plain HTML before JavaScript runs, and reloads/direct links need no rewrites.
import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const ssr = await import(pathToFileURL(path.join(ROOT, "dist-ssr/entry-server.js")).href);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
for (const [key, page] of Object.entries(ssr.pages)) {
  const file = page.path.slice(1) + (page.path.endsWith("/") ? "index.html" : "");
  const url = ssr.siteUrl;
  const head = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (url && key !== "notFound") {
    const share = page.share ?? { image: "/og/share.jpg", alt: "Daniel Pires portfolio, featuring the ARC controller concept." };
    head.push(
      `<link rel="canonical" href="${url}${page.path}" />`,
      `<meta property="og:url" content="${url}${page.path}" />`,
      `<meta property="og:image" content="${url}${share.image}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="${esc(share.alt)}" />`,
    );
  }
  const target = path.join(DIST, file);
  const html = (await readFile(target, "utf8"))
    .replace("<!--head-->", head.join("\n    "))
    .replace("<!--app-->", ssr.render(key));
  if (html.includes("<!--app-->") || html.includes("<!--head-->")) throw new Error(`placeholders left in ${file}`);
  await writeFile(target, html);
  console.log(`prerendered ${file} (${Math.round(html.length / 1024)} KB)`);
}
await rm(path.join(ROOT, "dist-ssr"), { recursive: true, force: true });

const drafts = ssr.drafts();
if (drafts.length) {
  console.warn(`\n${drafts.length} item(s) still marked as draft (see CONTENT-CHECKLIST.md):`);
  for (const d of drafts) console.warn(`  - ${d.length > 110 ? d.slice(0, 107) + "..." : d}`);
}
