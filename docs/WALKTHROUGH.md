# How the projects work, with practice exercises

Short guides so you can explain the code and choices in an interview, and two small exercises per project. Do the
exercises with AI help if you like, but make sure you can say why the fix works.

## The portfolio

**What happens when someone opens the homepage.** At build time, `scripts/prerender.mjs` asks React to render each
page to an HTML string (`src/entry-server.tsx`) and writes it into `dist/index.html` and `dist/work/arc/index.html`.
So the browser gets the finished text and images straight away, even before JavaScript. Then `src/boot.tsx`
*hydrates* the page: React attaches its event handlers to the HTML that is already there.
*Why:* fast first paint, real HTML for search engines, and `/work/arc` reloads work on any static host.

**Content is data.** Everything a visitor reads is in `src/content.ts` and `src/data/arc-case.ts`. Components
like `ProjectEntry` and `CaseSection` only decide layout. Adding a project means adding data, not new pages.

**The spotlight** (`src/components/Spotlight.tsx`) is the ARIA "tabs" pattern: buttons with `role="tab"` and
`aria-selected`, one `role="tabpanel"`. Only the selected tab has `tabIndex=0`, so Tab enters the tab list once and the
arrow keys move inside it ("roving tabindex"). All three views are stacked in the same box; CSS fades and slides them
using `data-pos="prev|on|next"`. Reduced motion turns transitions off in CSS, and the tilt checks
`prefers-reduced-motion` before running.

**Images** (`Img` in `src/components/ui.tsx`) always have `width`/`height` (no layout jump while loading), a
`srcset` so the browser picks a sensible size, and lazy loading except for the opening image.

Exercises:
1. *Maintenance:* add a fourth spotlight view, "Configurator", using the `configurator` screenshot. Which files change?
   Check that End now selects the fourth tab and that the tabs still fit on a 360 px screen.
2. *Debugging:* in `styles.css`, move the `.img { position: relative }` rule back to the end of the file and rebuild.
   The phone screenshot in the spotlight jumps to the wrong place. Explain why (two rules with the same specificity:
   the later one wins) and fix it without moving the rule back.

## ARC

**Why images instead of live 3D.** The look depends on lighting, haze and depth of field that would be very heavy to
compute live on a phone. Blender renders 193 frames per device once; the page shows the frame that matches the scroll
position and blends between neighbours while moving (`src/components/Showcase.tsx`).

**Where the controller comes from.** `design/arc-v4/build_arc.py` builds every part from mathematical solid shapes
(signed distance fields) combined with smooth unions and subtractions, then turns them into a mesh. Because it is a
script, the model can be rebuilt exactly, and all views and finishes share one geometry.

**Memory budget.** A decoded 1200×900 image takes about 4.3 MB of memory whatever its file size. Keeping 288 of them
was the problem. The configurator now keeps the compressed files and decodes only a budget (36 on desktop): the
frames near the current angle plus a few anchors. `ImageBitmap.close()` releases the rest. The canvas publishes its
count in `data-decoded`, which `scripts/qa_cache.py` reads.

**Testing.** Playwright scripts drive a real Chromium: they scroll, drag, press keys, block images on purpose and
compare results with expectations. They prove behaviour, not looks, which is why the screenshots were reviewed by eye.

Exercises:
1. *Maintenance:* change the sample price (`price` in `src/data/product.ts`, currently 189). Search the code for
   where it is displayed (`formatPrice`), add two finishes to the demo cart and check the total is right. Then run
   `scripts/qa_interactions.py` to confirm nothing else broke.
2. *Debugging:* lower the desktop turntable budget (`CACHE` in `src/components/Configurator.tsx`) to 8 and run
   `scripts/qa_cache.py`. Read which checks fail and explain what a visitor would see (hint: switching finishes or
   turning quickly would show missing frames).

## Questions to practise answering

- Why did you prerender the portfolio instead of shipping a plain React app?
- What did AI do on ARC, and what did you decide? Give one example of something you rejected.
- What is the difference between the 1,244 MB "calculated" figure and the 1,082 MB "measured" figure?
- What would you test on a real phone first, and why?
