import type { ReactElement } from "react";
import { playtestDesk, site } from "./content";
import { Home } from "./pages/Home";
import { ArcCase } from "./pages/ArcCase";
import { PlaytestCase } from "./pages/PlaytestCase";
import { NotFound } from "./pages/NotFound";

export type PageKey = "home" | "arc" | "playtestDesk" | "notFound";

/** Each page's component, address and head metadata. Used by the client entries and the build-time prerender. */
export const pages: Record<PageKey, {
  path: string;
  title: string;
  description: string;
  share?: { image: string; alt: string };
  render: () => ReactElement;
}> = {
  home: {
    path: "/",
    title: `${site.name}: websites, games & interactive experiences`,
    description: site.description,
    render: () => <Home />,
  },
  arc: {
    path: "/work/arc/",
    title: `ARC case study | ${site.name}`,
    description:
      "How ARC, an original controller concept and cinematic launch website, was directed, built with AI, reviewed and measured.",
    render: () => <ArcCase />,
  },
  playtestDesk: {
    path: playtestDesk.links.caseStudy,
    title: `Playtest Desk case study | ${site.name}`,
    description:
      "How Playtest Desk turns game feedback into reviewable issues, with source quotes, editable suggestions and local saving.",
    share: { image: "/media/playtest-desk/share.jpg", alt: "The Playtest Desk dashboard with fictional tester notes and an issue list." },
    render: () => <PlaytestCase />,
  },
  notFound: {
    path: "/404.html",
    title: `Page not found | ${site.name}`,
    description: site.description,
    render: () => <NotFound />,
  },
};
