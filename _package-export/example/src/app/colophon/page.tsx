"use client";

export default function ColophonPage() {
  return (
    <>
      <style>{`
        .colophon-page {
          max-width: 36rem;
          margin: 0 auto;
          padding: 4rem 1.5rem 3rem;
        }
        @media (max-width: 900px) {
          .colophon-page {
            padding-top: 2rem;
          }
        }
        .colophon-page h1 {
          font-size: 0.8125rem;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.4);
          margin-bottom: 1.25rem;
        }
        .colophon-content {
          font-size: 0.75rem;
          color: rgba(0, 0, 0, 0.4);
          line-height: 1.8;
        }
        .colophon-content p {
          margin-bottom: 0.5rem;
        }
        .colophon-content a {
          color: rgba(0, 0, 0, 0.5);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .colophon-content a:hover {
          color: rgba(0, 0, 0, 0.65);
        }
        .colophon-divider {
          border: none;
          border-top: 1px dotted rgba(0, 0, 0, 0.15);
          margin: 1rem 0;
        }
        .colophon-table {
          display: flex;
          flex-direction: column;
        }
        .colophon-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.3rem 0;
          border-bottom: 1px dotted rgba(0, 0, 0, 0.1);
        }
        .colophon-row:last-child {
          border-bottom: none;
        }
        .colophon-row-label {
          color: rgba(0, 0, 0, 0.35);
        }
        .colophon-row-value {
          color: rgba(0, 0, 0, 0.5);
          text-align: right;
        }
        .colophon-row-value a {
          color: rgba(0, 0, 0, 0.5);
        }
      `}</style>
      <div className="colophon-page">
        <h1>Colophon</h1>

        <div className="colophon-content">
          <p>
            Agentation is a React component for annotating web pages and generating structured
            feedback for AI coding agents. Zero runtime dependencies beyond React 18+, written
            in TypeScript with full type definitions. Available on <a href="https://www.npmjs.com/package/agentation" target="_blank" rel="noopener noreferrer">npm</a> and <a href="https://github.com/benjitaylor/agentation" target="_blank" rel="noopener noreferrer">GitHub</a>.
          </p>
          <p>
            Made by <a href="https://x.com/benjitaylor" target="_blank" rel="noopener noreferrer">Benji Taylor</a>, <a href="https://x.com/seldom" target="_blank" rel="noopener noreferrer">Dennis Jin</a>, and <a href="https://x.com/alexvanderzon" target="_blank" rel="noopener noreferrer">Alex Vanderzon</a>,
            with help from <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer">Claude Code</a>.
            See <a href="https://benji.org/annotating" target="_blank" rel="noopener noreferrer">the original post</a> for
            more on the motivation behind the project.
          </p>

          <hr className="colophon-divider" />

          <div className="colophon-table">
            <div className="colophon-row">
              <span className="colophon-row-label">Framework</span>
              <span className="colophon-row-value"><a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a></span>
            </div>
            <div className="colophon-row">
              <span className="colophon-row-label">Hosting</span>
              <span className="colophon-row-value"><a href="https://vercel.com" target="_blank" rel="noopener noreferrer">Vercel</a></span>
            </div>
            <div className="colophon-row">
              <span className="colophon-row-label">Typeface</span>
              <span className="colophon-row-value"><a href="https://rsms.me/inter" target="_blank" rel="noopener noreferrer">Inter</a></span>
            </div>
            <div className="colophon-row">
              <span className="colophon-row-label">Icons</span>
              <span className="colophon-row-value"><a href="https://dip.benji.org" target="_blank" rel="noopener noreferrer">Dip</a></span>
            </div>
            <div className="colophon-row">
              <span className="colophon-row-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="11" viewBox="0 0 20 20" width="11" fill="currentColor" style={{ opacity: 0.5 }}><path d="M10.75,6.37C11.39,6.15,11.9,5.64,12.12,5H15l-2.5,5.75c0,1.24,1.23,2.25,2.75,2.25c1.52,0,2.75-1.01,2.75-2.25L15.5,5H17 V3.5h-4.88C11.81,2.63,10.98,2,10,2S8.19,2.63,7.88,3.5H3V5h1.5L2,10.75C2,11.99,3.23,13,4.75,13s2.75-1.01,2.75-2.25L5,5h2.88 C8.1,5.64,8.61,6.15,9.25,6.37v9.13H2V17h16v-1.5h-7.25V6.37z M16.91,10.75h-3.32l1.66-3.82L16.91,10.75z M6.41,10.75H3.09 l1.66-3.82L6.41,10.75z M10,5C9.59,5,9.25,4.66,9.25,4.25C9.25,3.84,9.59,3.5,10,3.5s0.75,0.34,0.75,0.75C10.75,4.66,10.41,5,10,5z"/></svg>
                License
              </span>
              <span className="colophon-row-value"><a href="https://github.com/benjitaylor/agentation/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT</a></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
