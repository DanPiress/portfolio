import { arcCase as c, type Shot } from "../data/arc-case";
import { projects } from "../content";
import { CaseSection } from "../components/CaseSection";
import { D, Footer, Header, Img, Out } from "../components/ui";

const arc = projects.find((p) => p.slug === "arc")!;

/** Two real screenshots side by side, labelled. Stacks on narrow screens. */
function Compare({ pair, plain = false }: { pair: [Shot, Shot]; plain?: boolean }) {
  return (
    <div className="compare">
      {pair.map((s, i) => {
        const after = i === 1 && !plain;
        return (
        <figure key={s.media} className={`compare-item${after ? " is-after" : ""}`}>
          <Img id={s.media} alt={s.alt} sizes="(min-width: 900px) 46vw, 92vw" />
          {s.label && <figcaption className={`chip${after ? " chip-coral" : ""}`}>{s.label}</figcaption>}
        </figure>
        );
      })}
    </div>
  );
}

export function ArcCase() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header home={false} />
      <main id="main" className="case">
        <section className="case-hero" aria-labelledby="case-title">
          <div className="wrap">
            <nav className="crumbs" aria-label="Breadcrumb">
              <a href="/#work">Work</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">ARC</span>
            </nav>
            <div className="case-hero-grid">
              <div className="case-hero-copy">
                <p className="labels">
                  <span className="label">Concept project</span>
                  <span className="status is-live">Live</span>
                </p>
                <h1 id="case-title" className="case-title">
                  {c.title}
                </h1>
                <p className="case-tagline">{c.tagline}</p>
                <p className="case-summary">{c.summary}</p>
                <div className="case-links">
                  {arc.links.live && (
                    <Out className="btn btn-coral" href={arc.links.live}>
                      Live website
                    </Out>
                  )}
                  {arc.links.code && (
                    <Out className="btn btn-ghost" href={arc.links.code}>
                      Code on GitHub
                    </Out>
                  )}
                </div>
              </div>
              <figure className="case-hero-media">
                <div className="frame">
                  <Img id={c.hero.media} alt={c.hero.alt} sizes="(min-width: 1000px) 58vw, 94vw" eager />
                </div>
                <Img id={c.hero.phone} alt={c.hero.phoneAlt} sizes="(min-width: 760px) 150px, 96px" eager className="case-hero-phone" />
              </figure>
            </div>
            <dl className="fact-row">
              {c.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <nav className="case-toc" aria-label="On this page">
          <div className="wrap">
            <ul>
              <li><a href="#brief">The brief</a></li>
              <li><a href="#roles">My part and AI's</a></li>
              <li><a href="#decisions">Decisions</a></li>
              <li><a href="#features">What it does</a></li>
              <li><a href="#testing">Testing and limits</a></li>
              <li><a href="#learned">Findings</a></li>
            </ul>
          </div>
        </nav>

        <CaseSection id="brief" title="The brief">
          {c.brief.map((p) => (
            <p key={p} className="prose">
              {p}
            </p>
          ))}
        </CaseSection>

        <CaseSection id="roles" title="My part and AI's">
          <div className="roles">
            <div className="role-col">
              <h3 className="h3">What I did</h3>
              <ul className="ticks">
                {c.mine.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="role-col is-ai">
              <h3 className="h3">What AI did</h3>
              <ul className="ticks">
                {c.ai.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </CaseSection>

        <section className="case-section decisions" id="decisions" aria-labelledby="decisions-title">
          <div className="wrap">
            <h2 className="case-h2" id="decisions-title">
              Three decisions
            </h2>
            {c.decisions.map((d, i) => (
              <article key={d.id} className="decision" id={d.id} aria-labelledby={`${d.id}-title`}>
                <header className="decision-head">
                  <span className="decision-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="decision-title" id={`${d.id}-title`}>
                    {d.title}
                  </h3>
                </header>
                <div className="pde">
                  <div>
                    <h4>Problem</h4>
                    <p>{d.problem}</p>
                  </div>
                  <div>
                    <h4>Decision</h4>
                    <p>{d.decision}</p>
                  </div>
                  <div>
                    <h4>Evidence</h4>
                    <p>{d.evidence}</p>
                  </div>
                </div>
                {d.compare && <Compare pair={d.compare} />}
                {d.extra && <Compare pair={d.extra} plain={d.extraKind === "pair"} />}
                {d.metrics?.map((m) => (
                  <div key={m.caption} className="table-wrap">
                    <table className="metrics">
                      <caption>{m.caption}</caption>
                      <thead>
                        <tr>
                          <th scope="col">Measure</th>
                          <th scope="col">Before</th>
                          <th scope="col">After</th>
                        </tr>
                      </thead>
                      <tbody>
                        {m.rows.map((r) => (
                          <tr key={r.label}>
                            <th scope="row">{r.label}</th>
                            <td>{r.before}</td>
                            <td className="is-after">{r.after}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
                <p className="tradeoff">
                  <strong>Trade-off.</strong> {d.tradeoff}
                </p>
                <details className="deep">
                  <summary>How it works</summary>
                  <ul>
                    {d.deep.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </details>
              </article>
            ))}
          </div>
        </section>

        <section className="case-section is-dark" id="features" aria-labelledby="features-title">
          <div className="wrap">
            <h2 className="case-h2" id="features-title">
              What the finished site does
            </h2>
            <ul className="features">
              {c.features.map((f) => (
                <li key={f.title} className="feature">
                  <div className="feature-media">
                    <Img id={f.media} alt={f.alt} sizes="(min-width: 1000px) 40vw, 92vw" />
                  </div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-body">{f.body}</p>
                </li>
              ))}
            </ul>
            <p className="features-out">
              <Out className="btn btn-coral" href={arc.links.live!}>
                Try it on the live website
              </Out>
            </p>
          </div>
        </section>

        <CaseSection id="testing" title="Testing and limits">
          <p className="prose">{c.testing.version}</p>
          <div className="table-wrap">
            <table className="checks">
              <caption className="sr-only">Automated checks and their results</caption>
              <thead>
                <tr>
                  <th scope="col">Automated check</th>
                  <th scope="col">Passed</th>
                </tr>
              </thead>
              <tbody>
                {c.testing.checks.map((k) => (
                  <tr key={k.name}>
                    <th scope="row">{k.name}</th>
                    <td>{k.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="h3">Limits</h3>
          <ul className="ticks is-limits">
            {c.testing.limits.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </CaseSection>

        <CaseSection id="learned" title="What the project showed">
          {c.learned.map((l) => (
            <D key={l.text} v={l} as="p" />
          ))}
          <h3 className="h3">Next improvement</h3>
          <D v={c.next} as="p" />
        </CaseSection>

        <CaseSection id="credits" title="Credits and provenance">
          <ul className="ticks is-small">
            {c.credits.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </CaseSection>

        <div className="wrap case-end">
          <a className="btn btn-dark" href="/#work">
            Back to all work
          </a>
          <Out className="link-out" href={arc.links.live!}>
            Live website
          </Out>
          <Out className="link-out" href={arc.links.code!}>
            Code
          </Out>
        </div>
      </main>
      <Footer />
    </>
  );
}
