import type { Project } from "../content";
import { Img, Out, type MediaId } from "./ui";

/** Media shown in Selected work. */
const ENTRY_MEDIA: Record<string, { main: MediaId; mainAlt: string; phone?: MediaId; phoneAlt?: string }> = {
  arc: {
    main: "configurator",
    mainAlt: "ARC's finish configurator: a graphite controller on a dark stage, three finish swatches, a sample price and an Add to demo cart button.",
    phone: "config-phone",
    phoneAlt: "The configurator on a phone-sized screen, with the turntable above the finish choices.",
  },
  "playtest-desk": {
    main: "playtest-main",
    mainAlt: "The Playtest Desk workspace with sample tester notes beside a list of issues and status filters.",
    phone: "playtest-phone",
    phoneAlt: "The Playtest Desk note form on a phone-sized screen.",
  },
};

/** One project in Selected work: what it is, the brief, my role, what AI did, and its links. */
export function ProjectEntry({ project: p }: { project: Project }) {
  const m = ENTRY_MEDIA[p.slug];
  return (
    <article className="entry" aria-labelledby={`entry-${p.slug}`}>
      <div className="entry-media">
        {m && (
          <>
            <Img id={m.main} alt={m.mainAlt} sizes="(min-width: 1000px) 52vw, 92vw" className="entry-main" />
            {m.phone && <Img id={m.phone} alt={m.phoneAlt ?? ""} sizes="(min-width: 1000px) 150px, 100px" className="entry-phone" />}
          </>
        )}
      </div>
      <div className="entry-body">
        <p className="entry-meta">
          <span>{p.kind}</span>
          <span>{p.year}</span>
        </p>
        <h3 className="entry-title" id={`entry-${p.slug}`}>
          {p.title}
        </h3>
        <p className="entry-summary">{p.summary}</p>
        <dl className="entry-facts">
          <div>
            <dt>The brief</dt>
            <dd>{p.brief}</dd>
          </div>
          <div>
            <dt>My role</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt>What AI did</dt>
            <dd>{p.ai}</dd>
          </div>
          <div>
            <dt>Built with</dt>
            <dd>{p.stack.join(", ")}</dd>
          </div>
        </dl>
        <div className="entry-links">
          {p.links.caseStudy && (
            <a className="btn btn-dark" href={p.links.caseStudy}>
              Read the {p.title} case study
            </a>
          )}
          {p.links.live && (
            <Out className="link-out" href={p.links.live}>
              {p.links.liveLabel ?? "Live website"}
            </Out>
          )}
          {p.links.code && (
            <Out className="link-out" href={p.links.code}>
              Code on GitHub
            </Out>
          )}
        </div>
      </div>
    </article>
  );
}
