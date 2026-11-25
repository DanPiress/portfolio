# Daniel Pires: portfolio

A personal portfolio with one finished project presented in full, ARC, plus its case study at `/work/arc/`.
Stack: React 19, TypeScript and Vite. Both pages are prerendered to static HTML at build time, so they read correctly
before JavaScript runs and any static host can serve them. There is no 3D, no animation library and no backend.

## Run it

```powershell
npm install
npm run dev        # http://localhost:5180
npm run build      # type-check, client build, server build, prerender into dist/
npm run preview    # serve the production build on http://localhost:4180
npm run media      # re-make public/media/arc/ from the ARC project's screenshots
```

The build lists every piece of content still marked as a draft. See [CONTENT-CHECKLIST.md](CONTENT-CHECKLIST.md).

## Where to edit

| What | File |
| --- | --- |
| Name, headline, intro, links (email, LinkedIn, CV), About, upcoming work, How I work | `src/content.ts` |
| Projects (title, brief, role, AI contribution, links, spotlight views and captions) | `projects` in `src/content.ts` |
| ARC case study words and figures | `src/data/arc-case.ts` |
| Page titles and descriptions | `src/pages.tsx` |
| Public address (enables canonical, `og:url` and `og:image`) | `site.url` in `src/content.ts` |
| Which ARC screenshots are copied, and their sizes | `scripts/prepare-media.mjs` → `public/media/arc/`, `src/data/media.json` |
| Colours, type, layout | `src/styles.css` (tokens at the top) |

Drafts: wrap an unconfirmed sentence in `draft("...")` and it renders with a visible "Draft" marker and is listed by
the build. Use `fact("...")` once it is confirmed.

**Adding a project:** add an entry to `projects` with its own `views` (each needs a screenshot id from
`prepare-media.mjs`) and a media entry in `ENTRY_MEDIA` (`src/components/ProjectEntry.tsx`). The homepage then
shows it in Selected work. With more than one project, the spotlight should become a project selector in the same
card style (planned, not built).

## How it is put together

- `index.html`, `work/arc/index.html`, `404.html`: page shells with `<!--head-->` and `<!--app-->` placeholders.
- `src/boot.tsx`: hydrates the prerendered page in production, or renders it in the dev server.
- `src/entry-server.tsx` + `scripts/prerender.mjs`: render each page to HTML and write its title, description and
  share tags into `dist/`.
- `src/components/Spotlight.tsx`: the three-view project card. Tabs follow the ARIA tab pattern: arrow keys, Home
  and End move and select, and only the selected tab is in the Tab order. A horizontal swipe on the image works on
  touch screens. The tilt only runs with a mouse that can hover, and is off with reduced motion. Only the first view's
  images load with the page; the other views load after the page's `load` event or on first use.
- `src/components/ui.tsx`: `Img` (srcset, width/height, lazy by default, a labelled fallback if a file fails),
  header, footer, draft marker.

## Design

- **Palette:** paper `#F5F4EF` (reading surfaces), navy `#0D182B` (type, dark sections), coral `#F2694E` (selected
  tab, primary buttons; navy text on coral is 5.8:1), ice `#C5EAF3` (back card, contact band), slate `#5B6472`
  (supporting text, 5.5:1 on paper). Coral is never used for text on paper (2.8:1).
- **Type:** Bricolage Grotesque for headings, DM Sans for everything else, both self-hosted (no requests to Google).
- **Game references, kept small:** the spotlight is a collectible-style card on a second card, with a status "LED",
  shoulder-button tabs and a level-editor grid behind the opening. Primary buttons press down like console buttons.
- ARC keeps its own cobalt and orange inside its screenshots.

## Checks

Needs Python with Playwright (`pip install playwright`, then `playwright install chromium`).

```powershell
python scripts\qa_portfolio.py http://localhost:4180         # functional checks (59)
python scripts\qa_screens.py http://localhost:4180 final     # screenshots at 5 sizes + overflow/errors
```

Both accept the live address instead of `http://localhost:4180`. LinkedIn refuses automated requests (status 999), so
that link is reported as a note and checked by hand in a browser.

`qa_portfolio.py` covers the spotlight by mouse, keyboard, touch tap and swipe; reduced motion; the tilt; skip link
and focus outlines; nav anchors; every internal and external link; the case study's direct load, reload, deep link
and Back; a blocked image; the pages without JavaScript; page errors; and 44 px targets at phone size. It also
reports transfer size. Results and screenshots go to `qa/logs/` and `qa/screenshots/` (not committed).

These run in headless Chromium on this computer. A phone-sized window is not a real phone.

## Publishing

Live at https://daniel-pires.netlify.app (Netlify project `daniel-pires`), separate from ARC's site and repository.
Every push to `main` redeploys. `netlify.toml` supplies the build command, the `dist` folder and Node 24.

- `site.url` in `src/content.ts` drives the canonical link, `og:url` and `og:image`.
- Share image: edit `scripts/share-image.html`, then run `python scripts/render_share_image.py` and
  `node scripts/share-to-jpg.mjs` to rewrite `public/og/share.jpg` (1200×630).
- New Netlify sites start **private**: share menu → Public → **Make public**.

`/work/arc` and `/work/arc/` both work on Netlify without rewrite rules, because the page is a real file. Unknown
addresses get `404.html`. `public/_headers` caches hashed assets for a year and screenshots for a week, and sends
basic security headers. The site uses no API keys or environment variables.

## Licence and media

The code is mine to licence (MIT suggested, not yet added). The ARC screenshots in `public/media/arc/` come from the
ARC project and are all rights reserved, as in ARC's LICENSE.
