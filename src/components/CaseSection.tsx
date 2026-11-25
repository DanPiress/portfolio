import type { ReactNode } from "react";

export function CaseSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="case-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap case-grid">
        <h2 className="case-h2" id={`${id}-title`}>
          {title}
        </h2>
        <div className="case-body">{children}</div>
      </div>
    </section>
  );
}
