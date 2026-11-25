import { CaseSection } from "../components/CaseSection";
import { Footer, Header, Img, Out } from "../components/ui";
import { playtestDesk } from "../content";

const { title, kind, status, role, ai, stack, links } = playtestDesk;

export function PlaytestCase() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header home={false} />
      <main id="main" className="case">
        <section className="case-hero" aria-labelledby="case-title">
          <div className="wrap">
            <nav className="crumbs" aria-label="Breadcrumb">
              <a href="/#work">Work</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{title}</span>
            </nav>
            <div className="case-hero-grid">
              <div className="case-hero-copy">
                <p className="labels">
                  <span className="label">{kind}</span>
                  <span className="status is-live">{status.label}</span>
                </p>
                <h1 id="case-title" className="case-title">{title}</h1>
                <p className="case-tagline">From messy playtest notes to issues you can act on.</p>
                <p className="case-summary">
                  A review workspace for solo developers and small game teams. The public demo opens on a fictional
                  playtest and lets you try the full workflow with prewritten suggestions.
                </p>
                <div className="case-links">
                  <Out className="btn btn-coral" href={links.live}>Live demo</Out>
                  <Out className="btn btn-ghost" href={links.code}>Code on GitHub</Out>
                </div>
              </div>
              <figure className="case-hero-media">
                <div className="frame">
                  <Img
                    id="playtest-main"
                    alt="Playtest Desk showing five fictional tester notes alongside a searchable list of three issues."
                    sizes="(min-width: 1000px) 58vw, 94vw"
                    eager
                  />
                </div>
              </figure>
            </div>
            <dl className="fact-row">
              <div><dt>Project</dt><dd>Portfolio prototype</dd></div>
              <div><dt>Built with</dt><dd>{stack.join(", ")}</dd></div>
              <div><dt>Public demo</dt><dd>Fictional notes and sample suggestions</dd></div>
              <div><dt>Storage</dt><dd>In the browser, with CSV and backup export</dd></div>
            </dl>
          </div>
        </section>

        <nav className="case-toc" aria-label="On this page">
          <div className="wrap">
            <ul>
              <li><a href="#brief">The brief</a></li>
              <li><a href="#review">Reviewing feedback</a></li>
              <li><a href="#build">Building the demo</a></li>
              <li><a href="#testing">Testing and limits</a></li>
            </ul>
          </div>
        </nav>

        <CaseSection id="brief" title="The brief">
          <p className="prose">
            A useful playtest report tells you what happened and where to look. Tester messages often mix concrete
            details, guesses and requests. I wanted a small tool that takes one message at a time and helps turn it
            into a trackable issue with its original wording attached.
          </p>
          <div className="roles">
            <div className="role-col">
              <h3 className="h3">My part</h3>
              <p>{role}</p>
            </div>
            <div className="role-col is-ai">
              <h3 className="h3">What AI did</h3>
              <p>{ai}</p>
            </div>
          </div>
        </CaseSection>

        <CaseSection id="review" title="Keep the source in view">
          <p className="prose">
            Paste a note or select a sample to open an editable draft. The review screen puts the original note
            alongside the suggested issue and marks quotes that appear in the source. The reviewer checks the
            interpretation, edits the fields and presses Save issue when the draft is ready.
          </p>
          <figure className="case-figure">
            <Img
              id="playtest-review"
              alt="Playtest Desk review of the first sample note, with four matching quotes marked and an editable issue form beside it."
              sizes="(min-width: 1000px) 62vw, 92vw"
            />
            <figcaption>
              The review for the first sample highlights Android, build 0.4, Checkpoint 4 and “Happened twice.”
              Screenshot from the public demo.
            </figcaption>
          </figure>
          <p className="prose">
            A vague note like “It felt laggy after I joined” becomes a report with clarification questions and an
            unset severity. Possible repeats are flagged so the reviewer can link them while keeping both reports.
          </p>
        </CaseSection>

        <CaseSection id="build" title="Make the demo easy to try">
          <p className="prose">
            The public build runs as a static site. Its five sample notes have clearly labelled prewritten suggestions,
            and visitors can enter other notes manually. That lets someone try the review workflow without an account
            or an API key. The repository also includes an optional server for private Claude suggestions.
          </p>
          <p className="prose">
            Saved issues can be searched, filtered and updated as work progresses. A CSV export keeps the original note
            with each issue. A backup file can move the session to another browser. Shared team access would require
            accounts and shared storage.
          </p>
        </CaseSection>

        <CaseSection id="testing" title="Testing and limits">
          <p className="prose">
            The app passed 47 automated browser checks during development. After publication, 14 checks passed against
            the signed-out Netlify demo in desktop and phone-sized Chromium windows.
          </p>
          <ul className="ticks">
            <li>Reviewed a sample, saved it, edited its status, then confirmed the change survived reload.</li>
            <li>Checked search, status filters, manual entry for a custom note and the exported CSV.</li>
            <li>Checked that the public workflow made zero suggestion API requests.</li>
          </ul>
          <p className="prose">
            The optional suggestion server was tested with simulated replies. Live model evaluation and testing on
            physical phones are still open.
          </p>
        </CaseSection>

        <div className="wrap case-end">
          <a className="btn btn-dark" href="/#work">Back to all work</a>
          <Out className="link-out" href={links.live}>Live demo</Out>
          <Out className="link-out" href={links.code}>Code on GitHub</Out>
        </div>
      </main>
      <Footer />
    </>
  );
}
