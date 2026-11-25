import type { ReactElement } from "react";
import { site } from "./content";
import { Home } from "./pages/Home";
import { ArcCase } from "./pages/ArcCase";
import { NotFound } from "./pages/NotFound";

export type PageKey = "home" | "arc" | "notFound";

/** Each page's component, address and head metadata. Used by the client entries and the build-time prerender. */
export const pages: Record<PageKey, { path: string; title: string; description: string; render: () => ReactElement }> = {
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
  notFound: {
    path: "/404.html",
    title: `Page not found | ${site.name}`,
    description: site.description,
    render: () => <NotFound />,
  },
};
