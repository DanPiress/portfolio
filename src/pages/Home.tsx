import { about, links, process, projects, site, upcoming } from "../content";
import { D, Footer, Header, Out } from "../components/ui";
import { Spotlight } from "../components/Spotlight";
import { ProjectEntry } from "../components/ProjectEntry";

export function Home() {
  const featured = projects[0];
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header home />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <h1 id="hero-title" className="hero-title">
                {site.headline.map((line) => (
                  <span key={line} className="hero-line">
                    {line}{" "}
                  </span>
                ))}
              </h1>
              <p className="hero-intro">{site.intro}</p>
              <div className="hero-actions">
                <a className="btn btn-coral" href="#work">
                  View my work
                </a>
                <a className="btn btn-ghost" href="#contact">
                  Contact
                </a>
              </div>
            </div>
            <Spotlight project={featured} />
          </div>
        </section>

        <section className="section work" id="work" aria-labelledby="work-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="work-title" className="section-title">
                Selected work
              </h2>
              <p className="section-lede">
                One finished project for now, presented in full. More will join it as they are ready.
              </p>
            </div>
            {projects.map((p) => (
              <ProjectEntry key={p.slug} project={p} />
            ))}
            <aside className="bench" aria-labelledby="bench-title">
              <h3 id="bench-title" className="bench-title">
                On the workbench
              </h3>
              <ul className="bench-list">
                {upcoming.map((u) => (
                  <li key={u.title} className="bench-item">
                    <span className="bench-name">{u.title}</span>
                    <span className="bench-status">{u.status}</span>
                    <D v={u.note} />
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="section process" id="process" aria-labelledby="process-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="process-title" className="section-title">
                How I work
              </h2>
              <p className="section-lede">
                AI does much of the building. The direction, the reviews and the decision about what is good enough
                stay with me. Each step below has a real example from ARC.
              </p>
            </div>
            <ol className="steps">
              {process.map((s, i) => (
                <li key={s.title} className="step">
                  <span className="step-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-body">{s.body}</p>
                  <p className="step-example">
                    <span className="step-on">On ARC</span>
                    {s.example}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section about" id="about" aria-labelledby="about-title">
          <div className="wrap about-grid">
            <h2 id="about-title" className="section-title">
              About
            </h2>
            <div className="about-body">
              {about.paragraphs.map((p) => (
                <D key={p.text} v={p} as="p" />
              ))}
              <h3 className="about-sub">What I'm looking for</h3>
              <D v={about.looking} as="p" />
            </div>
          </div>
        </section>

        <section className="section contact" id="contact" aria-labelledby="contact-title">
          <div className="wrap contact-inner">
            <h2 id="contact-title" className="contact-title">
              Get in touch
            </h2>
            <p className="contact-lede">For questions about my work or opportunities, these are the best ways to reach me.</p>
            <ul className="contact-list">
              <li>
                {links.email ? (
                  <a className="btn btn-coral" href={`mailto:${links.email}`}>
                    Email {links.email}
                  </a>
                ) : (
                  <span className="draft">
                    <span className="draft-tag">Draft</span> Email address to be confirmed
                  </span>
                )}
              </li>
              <li>
                <Out className="btn btn-ghost-light" href={links.github.href}>
                  GitHub
                </Out>
              </li>
              {links.linkedin && (
                <li>
                  <Out className="btn btn-ghost-light" href={links.linkedin}>
                    LinkedIn
                  </Out>
                </li>
              )}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
