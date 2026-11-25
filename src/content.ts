// Everything a visitor reads about me, my projects and their links lives here. Edit this file to update the site.
//
// Facts marked `draft: true` (or wrapped in draft()) are placeholders I have not confirmed yet. They render with a
// visible "Draft" marker and are listed by the build (scripts/prerender.mjs) until they are replaced.
// CONTENT-CHECKLIST.md lists what is still needed.

export type Drafty = { text: string; draft?: boolean };
export const draft = (text: string): Drafty => ({ text, draft: true });
export const fact = (text: string): Drafty => ({ text });

export const site = {
  /** Public address once deployed, without a trailing slash, e.g. "https://example.netlify.app". Empty = not known yet:
   *  canonical, og:url and og:image tags are left out until it is set. */
  url: "https://daniel-pires.netlify.app",
  name: "Daniel Pires",
  /** Wordmark in the header. */
  mark: "Daniel Pires",
  headline: ["Websites,", "games &", "interactive", "experiences."],
  intro:
    "I make projects with AI and shape them through my own design decisions, reviews and testing. My first finished showcase is ARC, a launch site for a controller I invented.",
  description:
    "Portfolio of Daniel Pires: websites, games and interactive experiences made with AI and shaped through design, testing and iteration.",
};

export const links = {
  github: { label: "GitHub", href: "https://github.com/DanPiress" },
  /** Public contact email, confirmed by Daniel on 25 Nov 2026. */
  email: "danielpires2107@gmail.com",
  linkedin: "https://www.linkedin.com/in/daniel-pires-b99978219/",
  /** Hidden until a reviewed CV exists: add the PDF to public/ and its path here to show a link in the header. */
  cv: "",
};

export const about = {
  paragraphs: [
    fact(
      "I'm building a body of work in web and game development, using AI tools for much of the implementation and my own judgement for the direction, the reviews and the decisions about what is good enough.",
    ),
  ],
  looking: fact(
    "Junior web and front-end development roles, where I can keep learning while shipping real work. Game development is a secondary interest.",
  ),
};

export type View = {
  id: string;
  label: string;
  caption: string;
  alt: string;
  media: string;
  /** Optional earlier version shown beside the main image (Build story). */
  before?: { media: string; alt: string; label: string };
  after?: string;
  /** Optional phone screenshot layered over the main image. */
  phone?: { media: string; alt: string };
};

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  status: { label: string; live: boolean };
  summary: string;
  brief: string;
  role: string;
  ai: string;
  stack: string[];
  links: { caseStudy?: string; live?: string; code?: string };
  views: View[];
};

export const projects: Project[] = [
  {
    slug: "arc",
    title: "ARC",
    kind: "Concept launch website",
    year: "November 2026",
    status: { label: "Live concept", live: true },
    summary:
      "A launch website for an original gaming controller: a scroll-driven camera journey, an exploded view and a 360° finish configurator with a demo cart.",
    brief:
      "Design a fictional premium controller and a cinematic website to launch it, with one strong product, scroll storytelling and a working configurator.",
    role: "I set the direction, chose the references, reviewed each version at website size and decided what had to change, from the controller's shape to how fast it loads.",
    ai: "Built with Claude Code, with OpenAI Codex supporting planning, visual review, testing and targeted implementation fixes. Image generation made the early references and one backdrop.",
    stack: ["React", "TypeScript", "Vite", "GSAP", "Blender 5.2 (Cycles)", "Playwright"],
    links: {
      caseStudy: "/work/arc/",
      live: "https://arc-j11j.netlify.app/",
      code: "https://github.com/DanPiress/ARC",
    },
    views: [
      {
        id: "experience",
        label: "Experience",
        caption: "The opening of the live site. Scrolling drives a rendered camera move through the hall.",
        alt: "ARC's opening screen: the headline Your next move beside a graphite controller floating above a lit plinth in a blue hall.",
        media: "experience",
        phone: {
          media: "experience-phone",
          alt: "The same opening on a phone-sized screen, with the controller below the headline.",
        },
      },
      {
        id: "design",
        label: "Design",
        caption: "An exploded view of the real model parts, with callouts you can select by pointer, touch or keyboard.",
        alt: "ARC's Designed in layers section: the controller's spine, front shell, back shell and grips pulled apart, with the Shell callout selected.",
        media: "layers",
      },
      {
        id: "build",
        label: "Build story",
        caption: "First version, a live 3D model in the browser, and the rebuilt version: a new procedural Blender model rendered offline.",
        alt: "The rebuilt ARC opening with a compact controller, textured grips and a titanium centre spine.",
        media: "experience",
        before: {
          media: "v1-opening",
          label: "First version",
          alt: "The first ARC version: a large rounded controller with long grips and a silver brow plate on a plain dark background.",
        },
        after: "Rebuilt",
      },
    ],
  },
];

/** Work I have not published yet. Shown in a compact note, never as finished projects. */
export const upcoming: { title: string; status: string; note: Drafty }[] = [
  {
    title: "Playtest dashboard",
    status: "Planned",
    note: fact("A small app for organising game playtests and logging issues, with saved data and CSV export."),
  },
];

/** "How I work", each with a concrete example from ARC. This is a sequence, so it is numbered. */
export const process = [
  {
    title: "Understand the brief",
    body: "I write down what the project must do and who it is for, then pick references for quality.",
    example:
      "For ARC's redesign I chose a bold, cinematic gaming direction and a studio website as the reference for depth and camera movement.",
  },
  {
    title: "Build with AI",
    body: "AI agents write most of the code and scripts. I decide the approach and the order of the work.",
    example:
      "When the browser model couldn't reach the look, we switched to building the controller in Blender with scripts and rendering it offline.",
  },
  {
    title: "Inspect the result",
    body: "I review real screenshots at the size a visitor sees them, not just whether the code runs.",
    example:
      "I flagged a blurry, dark close-up and grips that read as coarse leather. Both were re-rendered.",
  },
  {
    title: "Test and improve",
    body: "Automated browser checks and before/after measurements show whether a change actually helped.",
    example:
      "A cache rewrite cut the browser's memory at the configurator from 1,082 MB to 447 MB in the same desktop test.",
  },
];
