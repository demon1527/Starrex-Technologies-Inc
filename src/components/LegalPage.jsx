import "../styles/LegalPage.css";

function LegalPage({ title, updated, children }) {
  return (
    <main className="legal-page">
      <article className="legal-content">
        <span className="legal-label">LEGAL</span>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: {updated}</p>
        {children}
      </article>
    </main>
  );
}

export default LegalPage;
