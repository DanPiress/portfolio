import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Project, View } from "../content";
import { Img, Out, type MediaId } from "./ui";

const MAIN_SIZES = "(min-width: 1100px) 56vw, (min-width: 760px) 88vw, 94vw";

/**
 * The project spotlight: one project card with labelled views (tabs). Selecting a tab by pointer, touch or keyboard
 * (arrow keys, Home, End; focus selects) changes the image and caption. On touch screens a horizontal swipe on the
 * image also moves between views. A small pointer tilt adds depth where a fine pointer can hover; nothing depends on it.
 */
export function Spotlight({ project }: { project: Project }) {
  const { views } = project;
  const [active, setActive] = useState(0);
  // Only the first view's images load with the page; the others are added once the page has loaded or on first use.
  const [warm, setWarm] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const card = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
  const uid = useId();
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = `${uid}-panel`;

  useEffect(() => {
    const go = () => setWarm(true);
    if (document.readyState === "complete") {
      const t = window.setTimeout(go, 400);
      return () => window.clearTimeout(t);
    }
    window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);

  const select = (i: number, focus = false) => {
    const n = (i + views.length) % views.length;
    setActive(n);
    setWarm(true);
    if (focus) tabs.current[n]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: views.length - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key], true);
    }
  };

  // Pointer tilt: only with a hovering fine pointer and without reduced motion. Writes CSS variables, no re-render.
  const tilt = (e: PointerEvent) => {
    const el = card.current;
    if (!el || e.pointerType !== "mouse") return;
    if (!matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${(x * 5).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`);
  };
  const untilt = () => {
    card.current?.style.setProperty("--ry", "0deg");
    card.current?.style.setProperty("--rx", "0deg");
  };

  const swipeStart = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const swipeEnd = (e: PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.6) select(active + (dx < 0 ? 1 : -1));
  };

  const view = views[active];

  return (
    <section className="spot" aria-labelledby={`${uid}-title`}>
      <div className="spot-cardwrap">
      <div className="spot-deck" aria-hidden="true" />
      <div className="spot-card" ref={card} onPointerMove={tilt} onPointerLeave={untilt}>
        <div className="spot-head">
          <h2 className="spot-title" id={`${uid}-title`}>
            {project.title}
            <span className="spot-kind">{project.kind}</span>
          </h2>
          <span className={`status${project.status.live ? " is-live" : ""}`}>{project.status.label}</span>
        </div>

        <div
          className="spot-stage"
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId(active)}
          onPointerDown={swipeStart}
          onPointerUp={swipeEnd}
          onPointerCancel={() => (swipe.current = null)}
        >
          {views.map((v, i) => (
            <div
              key={v.id}
              className="spot-view"
              data-pos={i < active ? "prev" : i > active ? "next" : "on"}
              aria-hidden={i !== active}
              inert={i !== active}
            >
              {(i === active || warm) && <ViewMedia v={v} eager={i === 0} />}
            </div>
          ))}
        </div>

        <p className="spot-caption" aria-live="polite">
          <span key={view.id} className="spot-caption-text">
            {view.caption}
          </span>
        </p>

        <div className="spot-tabs" role="tablist" aria-label={`${project.title} views`} onKeyDown={onKey}>
          {views.map((v, i) => (
            <button
              key={v.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(i)}
              aria-selected={i === active}
              aria-controls={panelId}
              tabIndex={i === active ? 0 : -1}
              className="spot-tab"
              onClick={() => select(i)}
              onFocus={() => i !== active && select(i)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      </div>

      <div className="spot-links">
        {project.links.caseStudy && (
          <a className="btn btn-dark" href={project.links.caseStudy}>
            Read case study
          </a>
        )}
        {project.links.live && (
          <Out className="link-out" href={project.links.live}>
            Live website
          </Out>
        )}
        {project.links.code && (
          <Out className="link-out" href={project.links.code}>
            Code
          </Out>
        )}
      </div>
    </section>
  );
}

function ViewMedia({ v, eager }: { v: View; eager: boolean }) {
  if (v.before) {
    return (
      <div className="pair">
        <figure className="pair-before">
          <Img id={v.before.media as MediaId} alt={v.before.alt} sizes="(min-width: 1100px) 30vw, 52vw" />
          <figcaption className="chip">{v.before.label}</figcaption>
        </figure>
        <figure className="pair-after">
          <Img id={v.media as MediaId} alt={v.alt} sizes="(min-width: 1100px) 36vw, 64vw" />
          <figcaption className="chip chip-coral">{v.after}</figcaption>
        </figure>
      </div>
    );
  }
  return (
    <>
      <Img id={v.media as MediaId} alt={v.alt} sizes={MAIN_SIZES} eager={eager} className="spot-main" />
      {v.phone && (
        <Img id={v.phone.media as MediaId} alt={v.phone.alt} sizes="(min-width: 760px) 140px, 96px" eager={eager} className="spot-phone" />
      )}
    </>
  );
}
