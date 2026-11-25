import { Footer, Header } from "../components/ui";

export function NotFound() {
  return (
    <>
      <Header home={false} />
      <main id="main" className="notfound">
        <div className="wrap">
          <h1 className="case-title">Page not found</h1>
          <p className="prose">This address doesn't match a page. The work and the ARC case study are linked below.</p>
          <p className="case-links">
            <a className="btn btn-coral" href="/">
              Go to the homepage
            </a>
            <a className="btn btn-ghost" href="/work/arc/">
              ARC case study
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
