"use client";

import { useState } from "react";

export default function AgentationDocs() {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <article className="article">
        <header>
          <h1>Agentation</h1>
          <p className="tagline">Visual feedback for AI-assisted development</p>
        </header>

        <section>
          <p>
            Agentation is a floating toolbar that lets you annotate elements on a webpage
            and generate structured feedback for AI coding assistants. Click elements,
            select text, add notes, and copy markdown-formatted output to paste into
            Claude, ChatGPT, or any AI tool.
          </p>
        </section>

        <section>
          <h2>Quick Start</h2>
          <ol>
            <li>Click the <strong>chat bubble</strong> in the bottom-right corner to activate</li>
            <li><strong>Hover</strong> over elements to see their names highlighted</li>
            <li><strong>Click</strong> any element to add an annotation</li>
            <li>Write your feedback and click <strong>Add</strong></li>
            <li>Click the <strong>copy button</strong> to get formatted markdown</li>
            <li>Paste into your AI assistant</li>
          </ol>
        </section>

        <section>
          <h2>Features</h2>
          <ul>
            <li><strong>Element annotation</strong> &mdash; Click any element to add feedback with automatic element identification (class names, IDs, semantic tags)</li>
            <li><strong>Text selection</strong> &mdash; Select text to annotate specific content with the quoted text included in output</li>
            <li><strong>Animation pause</strong> &mdash; Freeze CSS animations to annotate specific states</li>
            <li><strong>Marker visibility</strong> &mdash; Toggle annotation markers on/off while working</li>
            <li><strong>Structured output</strong> &mdash; Copies as markdown with page URL, viewport size, element details, and your notes</li>
          </ul>
        </section>

        <section>
          <h2>Output Format</h2>
          <p>
            When you copy, you get markdown like this that you can paste directly into an AI chat:
          </p>
          <pre className="code-block">{`## Page Feedback: /dashboard
**Viewport:** 1512×738

### 1. button.submit-btn
**Location:** .form-container > .actions > button.submit-btn
**Position:** 450px, 320px (120×40px)
**Feedback:** Button text should say "Save" not "Submit"

### 2. Selected text
**Location:** .sidebar > nav > .nav-item
**Quote:** "Settigns"
**Feedback:** Typo - should be "Settings"`}</pre>
          <p>
            The AI can use the element selectors, positions, and context to understand
            exactly what you&rsquo;re referring to.
          </p>
        </section>

        <section>
          <h2>What It Is</h2>
          <ul>
            <li>A <strong>dev tool</strong> for communicating visual feedback to AI assistants</li>
            <li>A way to <strong>point at things</strong> instead of describing them</li>
            <li>A <strong>clipboard helper</strong> that formats feedback as structured markdown</li>
          </ul>
        </section>

        <section>
          <h2>What It Isn&rsquo;t</h2>
          <ul>
            <li><strong>Not a bug tracker</strong> &mdash; annotations aren&rsquo;t persisted or synced</li>
            <li><strong>Not a design tool</strong> &mdash; you can&rsquo;t edit styles or layouts</li>
            <li><strong>Not a testing framework</strong> &mdash; no assertions or automation</li>
            <li><strong>Not for production</strong> &mdash; dev-only, should not ship to users</li>
          </ul>
        </section>

        <section>
          <h2>Limitations</h2>
          <ul>
            <li><strong>Session-only</strong> &mdash; annotations clear on page refresh</li>
            <li><strong>Single page</strong> &mdash; annotations don&rsquo;t follow across navigation</li>
            <li><strong>Static positions</strong> &mdash; markers don&rsquo;t update if layout changes</li>
            <li><strong>No screenshots</strong> &mdash; output is text-only (paste alongside screenshots if needed)</li>
            <li><strong>React only</strong> &mdash; currently requires React 18+ and framer-motion</li>
          </ul>
        </section>

        <section>
          <h2>Best Practices</h2>
          <ul>
            <li><strong>Be specific</strong> &mdash; &ldquo;Button text unclear&rdquo; is better than &ldquo;fix this&rdquo;</li>
            <li><strong>One issue per annotation</strong> &mdash; easier for AI to address individually</li>
            <li><strong>Include context</strong> &mdash; mention what you expected vs. what you see</li>
            <li><strong>Use text selection</strong> &mdash; for typos or content issues, select the exact text</li>
            <li><strong>Pause animations</strong> &mdash; to annotate a specific animation frame</li>
          </ul>
        </section>

        <section>
          <h2>Installation</h2>
          <pre className="code-block">npm install agentation</pre>
          <p>Add to your root layout (Next.js App Router):</p>
          <pre className="code-block">{`// app/layout.tsx
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
}`}</pre>
          <p>
            The <code>NODE_ENV</code> check ensures it only loads in development.
          </p>
        </section>

        <section>
          <h2>Security Notes</h2>
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
          <p>
            Since it runs in the same context as your app, treat it like any dev dependency:
            install from the official npm package or clone from the repo.
          </p>
        </section>

        {/* Interactive Demo Section */}
        <section className="demo-section">
          <h2>Try It</h2>
          <p>
            The toolbar is active on this page. Try annotating these demo elements:
          </p>

          <div className="button-group" style={{ marginTop: "1rem" }}>
            <button className="demo-button" onClick={() => alert("Primary clicked!")}>
              Primary Button
            </button>
            <button className="demo-button secondary" onClick={() => alert("Secondary clicked!")}>
              Secondary Button
            </button>
          </div>

          <input
            type="text"
            className="demo-input"
            placeholder="Try selecting this text..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <div className="demo-card">
            <h3>Example Card</h3>
            <p>
              Click on this card or select this text to create an annotation.
              The output will include the element path and your feedback.
            </p>
          </div>
        </section>

        {/* Animation Demo */}
        <section className="demo-section">
          <h2>Animation Pause Demo</h2>
          <p>
            Click the pause button (⏸) in the toolbar to freeze these animations:
          </p>
          <div className="animation-demo">
            <div className="floating-circle" />
            <div className="floating-circle delay-1" />
            <div className="floating-circle delay-2" />
          </div>
        </section>

        <section>
          <h2>Customizing Output</h2>
          <p>
            The copied output is plain markdown. Feel free to edit it before pasting
            into your AI assistant:
          </p>
          <ul>
            <li><strong>Add context</strong> &mdash; prepend with &ldquo;I&rsquo;m working on the dashboard page...&rdquo;</li>
            <li><strong>Prioritize</strong> &mdash; reorder annotations by importance</li>
            <li><strong>Remove noise</strong> &mdash; delete annotations that aren&rsquo;t relevant</li>
            <li><strong>Add instructions</strong> &mdash; append &ldquo;Fix these issues and run the tests&rdquo;</li>
          </ul>
          <p>
            The structured format helps AI understand <em>what</em> you&rsquo;re pointing at.
            Your edits help it understand <em>what to do</em>.
          </p>
        </section>

        <section>
          <h2>Why Not Just Describe It?</h2>
          <p>
            You could type &ldquo;the blue button in the header is misaligned&rdquo; but:
          </p>
          <ul>
            <li>Which blue button? There might be several.</li>
            <li>What&rsquo;s the actual class name or selector?</li>
            <li>Where exactly is it positioned?</li>
            <li>What&rsquo;s the parent container?</li>
          </ul>
          <p>
            Agentation captures this automatically so you can focus on <em>what&rsquo;s wrong</em>
            rather than <em>where it is</em>.
          </p>
        </section>
      </article>

      <footer className="footer">
        <p>Agentation &middot; Visual feedback for AI-assisted development</p>
      </footer>
    </>
  );
}
