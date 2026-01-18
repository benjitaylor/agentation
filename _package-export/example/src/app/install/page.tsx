"use client";

import { Highlight, themes } from "prism-react-renderer";

function CodeBlock({ code, language = "tsx" }: { code: string; language?: string }) {
  return (
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
  );
}

export default function InstallPage() {
  return (
    <article className="article">
      <header>
        <h1>Installation</h1>
        <p className="tagline">Get started with Agentation in your project</p>
      </header>

      <section>
        <h2>Install the package</h2>
        <CodeBlock code="npm install agentation" language="bash" />
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
          <li><strong>Open source</strong> &mdash; review the source if you have concerns</li>
        </ul>
      </section>
    </article>
  );
}
