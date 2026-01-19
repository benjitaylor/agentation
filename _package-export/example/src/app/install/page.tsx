"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Footer } from "../Footer";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="copy-button"
      title="Copy to clipboard"
      style={{
        position: 'absolute',
        top: '50%',
        right: '0.75rem',
        transform: 'translateY(-50%)',
        padding: '0.375rem',
        background: copied ? 'rgba(0,0,0,0.08)' : 'transparent',
        border: 'none',
        borderRadius: '0.25rem',
        cursor: 'pointer',
        color: copied ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.35)',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Clipboard icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position: 'absolute',
          opacity: copied ? 0 : 1,
          transform: copied ? 'scale(0.8)' : 'scale(1)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      {/* Checkmark icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: copied ? 1 : 0,
          transform: copied ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </button>
  );
}

function CodeBlock({ code, language = "tsx", copyable = false }: { code: string; language?: string; copyable?: boolean }) {
  return (
    <div style={{ position: 'relative' }}>
      <Highlight theme={themes.github} code={code.trim()} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre className="code-block" style={{ ...style, background: 'transparent' }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      {copyable && <CopyButton text={code.trim()} />}
    </div>
  );
}

export default function InstallPage() {
  return (
    <>
      <article className="article">
      <header>
        <h1>Installation</h1>
        <p className="tagline">Get started with Agentation in your project</p>
      </header>

      <section>
        <h2>Install the package</h2>
        <CodeBlock code="npm install agentation" language="bash" copyable />
        <p style={{ fontSize: '0.875rem', color: 'rgba(0,0,0,0.5)', marginTop: '0.5rem' }}>
          Or use yarn, pnpm, or bun.
        </p>
      </section>

      <section>
        <h2>Add to your app</h2>
        <p>Add the component to your root layout (Next.js App Router):</p>
        <CodeBlock
          code={`// app/layout.tsx
import { Agentation } from "agentation";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}`}
          language="tsx"
        />
        <p>
          The <code>NODE_ENV</code> check ensures it only loads in development.
        </p>
      </section>

      <section>
        <h2>Pages Router</h2>
        <p>For Next.js Pages Router, add to _app.tsx:</p>
        <CodeBlock
          code={`// pages/_app.tsx
import { Agentation } from "agentation";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}`}
          language="tsx"
        />
      </section>

      <section>
        <h2>Other frameworks</h2>
        <p>
          Agentation works with any React 18+ app. Add the component anywhere in your
          component tree, ideally at the root level.
        </p>
        <CodeBlock
          code={`// Vite, Create React App, etc.
import { Agentation } from "agentation";

function App() {
  return (
    <>
      <YourApp />
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}`}
          language="tsx"
        />
      </section>

      <section>
        <h2>Requirements</h2>
        <ul>
          <li><strong>React 18+</strong> &mdash; Uses modern React features</li>
          <li><strong>Client-side only</strong> &mdash; Requires DOM access</li>
          <li><strong>Zero dependencies</strong> &mdash; No runtime deps beyond React</li>
        </ul>
      </section>

      <section>
        <h2>Security notes</h2>
        <p>
          Agentation runs in your browser and reads DOM content to generate feedback.
          It does <strong>not</strong> send data anywhere &mdash; everything stays local
          until you manually copy and paste.
        </p>
        <ul>
          <li><strong>No network requests</strong> &mdash; all processing is client-side</li>
          <li><strong>No data collection</strong> &mdash; nothing is tracked or stored remotely</li>
          <li><strong>Dev-only</strong> &mdash; use the NODE_ENV check to exclude from production</li>
        </ul>
      </section>
    </article>

    <Footer />
    </>
  );
}
