// Content of the ARC case study (/work/arc/). Every figure comes from ARC's qa/perf/PERFORMANCE-REPORT.md or its saved
// check logs, with the conditions stated next to it. Edit the words here; the layout is in src/pages/ArcCase.tsx.
import { fact, type Drafty } from "../content";
import type { MediaId } from "../components/ui";

export type Shot = { media: MediaId; alt: string; label?: string };
export type Metric = { label: string; before: string; after: string };
export type Decision = {
  id: string;
  title: string;
  problem: string;
  decision: string;
  evidence: string;
  compare?: [Shot, Shot];
  extra?: [Shot, Shot];
  /** "before-after" (default) highlights the second image as the result; "pair" shows two equal examples. */
  extraKind?: "before-after" | "pair";
  metrics?: { caption: string; rows: Metric[] }[];
  tradeoff: string;
  deep: string[];
};

export const arcCase = {
  title: "ARC",
  tagline: "A launch website for a controller that doesn't exist.",
  summary:
    "ARC is an original gaming controller and the cinematic website that launches it. I directed the project and judged each version; AI coding agents did most of the implementation. The controller is built procedurally in Blender by scripts and rendered offline, and the website turns those renders into a scroll-driven camera journey, an exploded view and a 360° finish configurator with a demo cart.",
  facts: [
    { label: "Type", value: "Concept project: a fictional product, not for sale" },
    { label: "When", value: "22 to 24 November 2026, published 24 November" },
    { label: "My role", value: "Direction, references, reviews and priorities" },
    { label: "Built with", value: "React, TypeScript, Vite, GSAP, Lenis, Blender 5.2 (Cycles), Playwright" },
  ],
  hero: {
    media: "experience" as MediaId,
    alt: "ARC's opening screen: the headline Your next move beside a graphite controller floating above a lit plinth in a blue hall.",
    phone: "experience-phone" as MediaId,
    phoneAlt: "ARC's opening on a phone-sized screen.",
  },

  brief: [
    "Create an original premium gaming controller and a launch website for it: one strong product, a scroll-driven reveal in a few deliberate stages, and a configurator with three finishes and a cart that never charges.",
    "After seeing the first version, I rejected its look and set a new direction: a bold, cinematic gaming scene with real depth. A studio-made website I'd seen became the reference for atmosphere and camera movement, and AI-generated concept images became the quality target for the product.",
  ],

  mine: [
    "Chose the cinematic direction and the visual references.",
    "Rejected the first controller and website, and said why: long inflated grips, a flat face and a large silver plate.",
    "Reviewed the renders at website size and asked for specific fixes: a soft, dark close-up, a camera angle that hid the controls, grip texture that read as leather.",
    "Set the later priorities: loading speed, memory limits and finish switching, then publishing.",
  ],
  ai: [
    "Built with Claude Code, with OpenAI Codex supporting planning, visual review, testing and targeted implementation fixes.",
    "The code includes the React site, the Blender Python that models and renders the controller, the media encoders and the Playwright checks.",
    "Image generation made the early concept references and the desk backdrop behind one product image. Their prompts are kept in the repository.",
    "AI also ran the before/after measurements and summarised them. I decided what to keep.",
  ],

  decisions: [
    {
      id: "controller",
      title: "Rebuild the controller instead of polishing it",
      problem:
        "The first version showed a live 3D model in the browser. Its long, inflated grips, flat face and broad silver plate looked like a toy, and more detail on the same shape wouldn't fix that.",
      decision:
        "Start again with a new original model, built in Blender by a Python script. Each moulded part is a solid shape combined from simpler ones, so edges have controlled radii; the front shell, back shell, grips, spine, bumpers and triggers are separate parts with real 0.3 mm gaps, and the button legends are real geometry.",
      evidence:
        "The rebuilt controller is compact, with outward-angled grips and a narrow titanium spine. After reviewing the rendered close-up, I asked for a sharper, brighter shot and finer grip texture; both were re-rendered.",
      compare: [
        {
          media: "v1-opening",
          label: "First version, 22 Nov",
          alt: "The first ARC version: a large rounded graphite controller with long grips and a broad brushed-silver plate on a plain dark background.",
        },
        {
          media: "experience",
          label: "Rebuilt, 24 Nov",
          alt: "The rebuilt ARC: a compact controller with textured grips and a titanium spine, floating in a blue hall.",
        },
      ],
      extra: [
        {
          media: "macro-before",
          label: "Close-up before review",
          alt: "An earlier render of the stick close-up: soft focus, dark, with a strong orange glow.",
        },
        {
          media: "macro-after",
          label: "After review",
          alt: "The corrected close-up: the dimpled stick cap and its well in sharp focus, with finer grip texture.",
        },
      ],
      tradeoff:
        "A scripted model is slower to start than downloading one, but every view, finish and thumbnail now comes from the same geometry, and any change is a re-run rather than hand editing.",
      deep: [
        "Parts are signed distance fields built with smooth unions, rounded intersections and subtractions for the stick wells, port and trigger scoops, sampled at 0.36 mm (0.12 to 0.15 mm for small controls) and meshed with OpenVDB.",
        "Materials are grouped (shell, grip, spine, rubber, metal, legends and so on), so the three finishes swap coherently. Procedural bump gives the polymer micro-texture and the pebbled grips.",
        "Three freely downloadable controller models were reviewed first. None was a convincing upgrade, so none was used.",
      ],
    },
    {
      id: "renders",
      title: "Render offline and play the frames back with the scroll",
      problem:
        "The reference I'd chosen depends on photographic lighting, haze and depth. Matching that live in the browser would mean heavy 3D on every visitor's device.",
      decision:
        "Render the scene in Blender's Cycles and ship image sequences: 193 frames per device for the camera journey, 96 per finish for the turntable. The scroll position picks and blends frames, so the page needs no WebGL.",
      evidence:
        "Frames were spaced by how much the picture changes rather than evenly. Compared with the earlier 145-frame set, the largest jump between neighbouring frames fell from 11.2 to 6.6 on desktop and from 18.5 to 8.4 on phone frames (mean pixel difference, 0 to 255). In a fast-scroll test at 1440×900, animation frames that had to show a neighbouring frame fell from 76 of 107 to none.",
      extra: [
        { media: "controls", label: "Controls chapter", alt: "The journey's controls chapter: the face buttons and cross pad seen from the front." },
        { media: "shoulders", label: "Shoulders chapter", alt: "The journey's last chapter: the rear shoulders, bumpers and triggers." },
      ],
      extraKind: "pair",
      tradeoff:
        "The site carries about 80 MB of rendered media, and any visual change means re-rendering. At 1920×1080 and phone size, the denser frames cost more decoding, and fast scrolling on this test computer more often showed a neighbouring frame.",
      deep: [
        "The page fetches the opening frame first, then the chapter keyframes and a coarse pass, then the rest nearest to the reader first.",
        "Frames are decoded off the main thread, already cropped and scaled to the canvas, for a window that looks further ahead in the direction of travel.",
        "While scrolling, neighbouring frames are cross-blended; when scrolling stops, the view eases onto one sharp frame.",
      ],
    },
    {
      id: "performance",
      title: "Put a limit on memory and make finishes switch instantly",
      problem:
        "Every turntable frame stayed decoded once seen: 288 frames, about 1.24 GB of pixels by calculation once all three finishes had been viewed. The browser's measured memory passed 1 GB.",
      decision:
        "Keep frames compressed, and decode only a budget of them: the frames being drawn, a ring around the current angle, anchors, and one frame per other finish so switching is immediate. Add a smaller 960×720 turntable set for screens that don't need the larger one.",
      evidence:
        "Same build-to-build test, same conditions, cold cache, in headless Chromium on a Windows 10 laptop. Measured browser memory is the summed working set of its processes. Decoded-frame figures are the page's own count, converted to megabytes by calculation.",
      metrics: [
        {
          caption: "Desktop window, 1440×900, no throttling",
          rows: [
            { label: "Browser memory at the configurator (measured)", before: "1,082 MB", after: "447 MB" },
            { label: "Turntable frames kept decoded (calculated size)", before: "288 (1,244 MB)", after: "30 (52.5 MB)" },
            { label: "Selected finish fully loaded", before: "2.22 s", after: "0.72 s" },
            { label: "Transfer with everything viewed", before: "38.24 MB", after: "31.04 MB" },
          ],
        },
        {
          caption: "Phone-sized window, 390×844, emulated slow network (1.6 Mbps, 150 ms) and 4× slower CPU",
          rows: [
            { label: "Opening frame visible", before: "3.35 s", after: "3.03 s" },
            { label: "Finish change shown", before: "67–70 ms", after: "13–28 ms" },
            { label: "Selected finish fully loaded", before: "59.0 s", after: "31.4 s" },
            { label: "Browser memory at the configurator (measured)", before: "1,138 MB", after: "384 MB" },
          ],
        },
      ],
      tradeoff:
        "The cache logic is more complex and needed its own checks (42 of them) for scrolling, flicks, finish switches and blocked images. The phone figures come from an emulated window on a computer, not a phone.",
      deep: [
        "Each canvas publishes its live decoded-frame count and budget as data attributes, which the checks read while turning and switching.",
        "The 960 set was chosen over 840 because 840 would be enlarged about 8% on standard desktop screens. Lowering the quality setting barely reduced file size, because the transparency channel dominates.",
        "If the opening frame fails to load, its near-identical neighbour is shown and the opening frame is retried in the background.",
      ],
    },
  ] satisfies Decision[],

  features: [
    {
      title: "Scroll journey",
      body: "Four chapters, from the whole controller to the stick close-up, the controls and the rear shoulders. Chapter links jump straight to each.",
      media: "controls" as MediaId,
      alt: "The controls chapter of ARC's scroll journey.",
    },
    {
      title: "Designed in layers",
      body: "The real model parts pulled apart, with three callouts you can choose by pointer, touch or arrow keys.",
      media: "layers" as MediaId,
      alt: "ARC's exploded view with the Shell callout selected.",
    },
    {
      title: "Finish turntable",
      body: "Drag, flick or use the arrow keys to turn the controller through 360°, in Graphite, Silver or Ember.",
      media: "configurator" as MediaId,
      alt: "The finish configurator with Graphite selected.",
    },
    {
      title: "Demo cart",
      body: "Add finishes, change quantities and see a sample total. It is saved in your browser only; checkout is disabled.",
      media: "cart" as MediaId,
      alt: "ARC's demo cart with two Graphite and one Ember controller and a sample total.",
    },
  ],

  testing: {
    version: "Checks ran against the live site deployed from commit 6e7f028 on 24 November 2026, in headless Chromium on a Windows 10 laptop.",
    checks: [
      { name: "Interactions: journey, chapter links, finishes, turntable by mouse, touch and keys, cart, reduced motion, no-canvas fallback", result: "60 / 60" },
      { name: "Designed in layers: lazy loading, callout positions, tab keys, 44 px targets, contrast", result: "64 / 64" },
      { name: "Frame memory budgets, blocked images and deep links", result: "42 / 42" },
      { name: "Why ARC section and footer links", result: "57 / 57" },
      { name: "Turntable loading and cancelled touch gestures", result: "25 / 25" },
      { name: "Horizontal overflow and page errors, desktop and phone size", result: "None" },
    ],
    limits: [
      "No physical phone has been tested yet. Scrolling feel, finger rotation, memory limits on real phones and loading over mobile data are still to check.",
      "Smoothness figures come from a software-rendered browser on one laptop. They compare builds with each other and don't predict a particular phone or frame rate.",
      "Fast scrolling at 1920×1080 and phone size still shows neighbouring frames more often than the older, sparser frame set did.",
    ],
  },

  learned: [
    fact("Visual review exposed material, framing and focus problems that functional tests did not catch."),
    fact("Before-and-after measurements under matching conditions helped evaluate loading and memory improvements accurately."),
  ] as Drafty[],
  next: fact(
    "Test the live site on real iOS and Android phones, then tune how many frames phones decode at once based on what those tests show.",
  ),

  credits: [
    "The controller model and scene are original, built procedurally in Blender for this project. No third-party models are used.",
    "The desk backdrop in the Why ARC image was made with ForgeGUI's image generation; the controller in it is an ARC render.",
    "The early concept references were made with image generation. Their prompts are kept alongside them in the repository.",
    "Code is MIT-licensed; the ARC design, renders and screenshots are all rights reserved.",
  ],
};
