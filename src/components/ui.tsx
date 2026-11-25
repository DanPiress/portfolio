import { useEffect, useRef, useState, type ReactNode } from "react";
import media from "../data/media.json";
import { links, site, type Drafty } from "../content";

export type MediaId = keyof typeof media;

/** A project image with width/height, a srcset of the prepared sizes and a visible fallback if it fails to load. */
export function Img({
  id,
  alt,
  sizes,
  eager = false,
  className,
}: {
  id: MediaId;
  alt: string;
  sizes: string;
  eager?: boolean;
  className?: string;
}) {
  const m = media[id];
  const ref = useRef<HTMLImageElement>(null);
  const [broken, setBroken] = useState(false);
  const files = m.files;
  const largest = files[0];
  const src = files[Math.min(1, files.length - 1)].file;
  // The prerendered <img> may fail before React attaches onError, so check once on mount as well.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0 && img.currentSrc) setBroken(true);
  }, []);
  return (
    <span className={`img${broken ? " is-broken" : ""}${className ? ` ${className}` : ""}`}>
      <img
        ref={ref}
        src={src}
        srcSet={files.map((f) => `${f.file} ${f.w}w`).join(", ")}
        sizes={sizes}
        width={largest.w}
        height={Math.round((largest.w * m.height) / m.width)}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        decoding="async"
        onError={() => setBroken(true)}
      />
      {broken && (
        <span className="img-fallback" role="img" aria-label={alt}>
          <span aria-hidden="true">Image unavailable</span>
        </span>
      )}
    </span>
  );
}

/** Renders a fact, or a clearly marked draft placeholder. */
export function D({ v, as: Tag = "span" }: { v: Drafty; as?: "span" | "p" }) {
  if (!v.draft) return <Tag>{v.text}</Tag>;
  return (
    <Tag className="draft">
      <span className="draft-tag">Draft</span> {v.text}
    </Tag>
  );
}

export const ExternalIcon = () => (
  <svg className="icon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path d="M5 3h8v8M13 3 3.5 12.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const GitHubIcon = () => (
  <svg className="icon" viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
    <path
      fill="currentColor"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
    />
  </svg>
);

/** A link to another site, with an icon that says so. Opens in the same tab. */
export function Out({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={className} href={href} rel="noopener">
      {children}
      <ExternalIcon />
    </a>
  );
}

export function Header({ home }: { home: boolean }) {
  const p = home ? "" : "/";
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <a className="wordmark" href="/" aria-label={`${site.name}, home`}>
          <span className="wordmark-dot" aria-hidden="true" />
          {site.mark}
        </a>
        <nav aria-label="Main">
          <ul className="nav">
            <li>
              <a href={`${p}#work`}>Work</a>
            </li>
            <li>
              <a href={`${p}#about`}>About</a>
            </li>
            <li>
              <a href={`${p}#contact`}>Contact</a>
            </li>
            {links.cv && (
              <li>
                <a href={links.cv} download>
                  CV
                </a>
              </li>
            )}
            <li>
              <a className="nav-github" href={links.github.href} rel="noopener" aria-label="GitHub profile">
                <GitHubIcon />
                <span className="nav-github-label">GitHub</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <p className="footer-name">© 2026 {site.name}</p>
        <ul className="footer-links">
          <li>
            <a href="/#work">Work</a>
          </li>
          <li>
            <a href="/work/arc/">ARC case study</a>
          </li>
          <li>
            <a href={links.github.href} rel="noopener">
              GitHub
            </a>
          </li>
          {links.linkedin && (
            <li>
              <a href={links.linkedin} rel="noopener">
                LinkedIn
              </a>
            </li>
          )}
        </ul>
        <p className="footer-note">
          Made with AI coding tools and my own design and review. Project images are screenshots of the real work.
        </p>
      </div>
    </footer>
  );
}
