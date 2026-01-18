"use client";

import { useState } from "react";

type OutputFormat = 'standard' | 'detailed' | 'compact';

const outputExamples: Record<OutputFormat, string> = {
  standard: `## Page Feedback: /dashboard
**Viewport:** 1512×738

### 1. button.submit-btn
**Selector:** \`.form-container > .actions > button.submit-btn\`
**Classes:** \`submit-btn primary\`
**Position:** 450, 320 (120×40)
**Feedback:** Button text should say "Save" not "Submit"

### 2. span.nav-label
**Selector:** \`.sidebar > nav > .nav-item > span\`
**Selected:** "Settigns"
**Feedback:** Typo - should be "Settings"`,

  detailed: `## Page Feedback: /dashboard
**Viewport:** 1512×738
**URL:** https://myapp.com/dashboard
**User Agent:** Chrome/120.0

---

### 1. button.submit-btn

**Selector:** \`.form-container > .actions > button.submit-btn\`
**Classes:** \`.submit-btn\`, \`.primary\`
**Bounding box:** x:450, y:320, 120×40px
**Nearby text:** "Cancel Save Changes"

**Issue:** Button text should say "Save" not "Submit"

---

### 2. span.nav-label

**Selector:** \`.sidebar > nav > .nav-item > span\`
**Classes:** \`.nav-label\`
**Selected text:** "Settigns"
**Nearby text:** "Dashboard Settigns Profile"

**Issue:** Typo - should be "Settings"

---

**Search tips:** Use the class names or selectors above to find these elements. Try \`grep -r "className.*submit-btn"\` or search for the nearby text.`,

  compact: `## Feedback: /dashboard

1. **.submit-btn**
   Button text should say "Save" not "Submit"

2. **.nav-label** ("Settigns...")
   Typo - should be "Settings"`,
};

export default function AgentationDocs() {
  const [inputValue, setInputValue] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('standard');

  return (
    <>
      <article className="article">
        <header>
          <h1>Agentation</h1>
          <p className="tagline">Visual feedback for AI coding agents</p>
        </header>

        <section>
          <p>
            Agentation is a dev tool that lets you annotate elements on your webpage
            and generate structured feedback for AI coding agents. Click elements,
            select text, add notes, and paste the output into Claude Code, Cursor, or
            any agent that has access to your codebase.
          </p>
          <p>
            The key insight: agents can find and fix code much faster when they
            know exactly which element you&rsquo;re referring to. Agentation captures
            class names, selectors, and positions so the agent can locate the corresponding
            source files.
          </p>
        </section>

        <section>
          <h2>Quick start</h2>
          <ol>
            <li>Click the <strong>chat bubble</strong> in the bottom-right corner to activate</li>
            <li><strong>Hover</strong> over elements to see their names highlighted</li>
            <li><strong>Click</strong> any element to add an annotation</li>
            <li>Write your feedback and click <strong>Add</strong></li>
            <li>Click the <strong>copy button</strong> to get formatted markdown</li>
            <li>Paste into your agent</li>
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
          <h2>Keyboard shortcuts</h2>
          <ul>
            <li><code>⌘⇧A</code> / <code>Ctrl+Shift+A</code> &mdash; Toggle feedback mode on/off</li>
            <li><code>Esc</code> &mdash; Close toolbar or cancel annotation</li>
            <li><code>P</code> &mdash; Pause/resume animations</li>
            <li><code>H</code> &mdash; Hide/show annotation markers</li>
            <li><code>C</code> &mdash; Copy feedback to clipboard</li>
            <li><code>X</code> &mdash; Clear all annotations</li>
          </ul>
          <p>
            Shortcuts are disabled when typing in an input field.
          </p>
        </section>

        <section>
          <h2>Output format</h2>
          <p>
            When you copy, you get structured markdown that agents can parse and act on.
            Three formats are available:
          </p>
          <div className="format-toggle">
            <button
              className={outputFormat === 'compact' ? 'active' : ''}
              onClick={() => setOutputFormat('compact')}
            >
              Compact
            </button>
            <button
              className={outputFormat === 'standard' ? 'active' : ''}
              onClick={() => setOutputFormat('standard')}
            >
              Standard
            </button>
            <button
              className={outputFormat === 'detailed' ? 'active' : ''}
              onClick={() => setOutputFormat('detailed')}
            >
              Detailed
            </button>
          </div>
          <pre className="code-block">{outputExamples[outputFormat]}</pre>
          <p>
            The output includes searchable selectors and class names that agents can <code>grep</code> for
            in your codebase to find the exact component.
          </p>
        </section>

        <section>
          <h2>What it is</h2>
          <ul>
            <li>A <strong>dev tool</strong> for communicating visual feedback to AI coding agents</li>
            <li>A way to <strong>point at things</strong> in your running app so the agent can find them in code</li>
            <li>A bridge between <strong>what you see</strong> in the browser and <strong>what the agent can search</strong> in your codebase</li>
          </ul>
        </section>

        <section>
          <h2>How it works with agents</h2>
          <p>
            Agentation works best with AI tools that have access to your codebase
            (Claude Code, Cursor, Windsurf, etc.):
          </p>
          <ol>
            <li>You see a bug or want a change in your running app</li>
            <li>Use Agentation to annotate the element with your feedback</li>
            <li>Copy the output and paste it into your agent</li>
            <li>The agent uses the class names and selectors to <strong>search your codebase</strong></li>
            <li>It finds the relevant component/file and makes the fix</li>
          </ol>
          <p>
            Without Agentation, you&rsquo;d have to describe the element (&ldquo;the blue button
            in the sidebar&rdquo;) and hope the agent guesses right. With Agentation, you give it
            <code>.sidebar &gt; .nav-actions &gt; button.primary</code> and it can grep for that directly.
          </p>
        </section>

        <section>
          <h2>What it isn&rsquo;t</h2>
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
            <li><strong>React only</strong> &mdash; currently requires React 18+</li>
          </ul>
        </section>

        <section>
          <h2>Best practices</h2>
          <ul>
            <li><strong>Be specific</strong> &mdash; &ldquo;Button text unclear&rdquo; is better than &ldquo;fix this&rdquo;</li>
            <li><strong>One issue per annotation</strong> &mdash; easier for the agent to address individually</li>
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
// or use AgentationCSS for zero-dep version (no framer-motion)

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
          <p>
            <strong>Two versions available:</strong>
          </p>
          <ul>
            <li><code>Agentation</code> &mdash; Smoother animations, requires framer-motion peer dependency</li>
            <li><code>AgentationCSS</code> &mdash; CSS-only animations, zero runtime dependencies</li>
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
          <p>
            Since it runs in the same context as your app, treat it like any dev dependency:
            install from the official npm package or clone from the repo.
          </p>
        </section>

        {/* Interactive Demo Section */}
        <section className="demo-section">
          <h2>Try it</h2>
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
          <h2>Animation pause demo</h2>
          <p>
            Click the pause button in the toolbar to freeze these animations:
          </p>
          <div className="animation-demo">
            <div className="floating-circle" />
            <div className="floating-circle delay-1" />
            <div className="floating-circle delay-2" />
          </div>
        </section>

        <section>
          <h2>Customizing output</h2>
          <p>
            The copied output is plain markdown. Feel free to edit it before pasting
            into your agent:
          </p>
          <ul>
            <li><strong>Add context</strong> &mdash; prepend with &ldquo;I&rsquo;m working on the dashboard page...&rdquo;</li>
            <li><strong>Prioritize</strong> &mdash; reorder annotations by importance</li>
            <li><strong>Remove noise</strong> &mdash; delete annotations that aren&rsquo;t relevant</li>
            <li><strong>Add instructions</strong> &mdash; append &ldquo;Fix these issues and run the tests&rdquo;</li>
          </ul>
          <p>
            The structured format helps the agent understand <em>what</em> you&rsquo;re pointing at.
            Your edits help it understand <em>what to do</em>.
          </p>
        </section>

        <section>
          <h2>Why not just describe it?</h2>
          <p>
            You could type &ldquo;the blue button in the header is misaligned&rdquo; but:
          </p>
          <ul>
            <li>Which blue button? There might be several.</li>
            <li>What&rsquo;s the actual class name the agent can search for?</li>
            <li>What component renders this element?</li>
            <li>What&rsquo;s the parent container&rsquo;s class?</li>
          </ul>
          <p>
            Agentation captures selectors that the agent can actually <code>grep</code> for in your codebase.
            Instead of guessing which file to look at, it can search for <code>className=&quot;submit-btn&quot;</code>
            and find the exact component.
          </p>
        </section>
      </article>

      <footer className="footer">
        <p>Created by <a href="https://benji.org" target="_blank" rel="noopener noreferrer">Benji Taylor</a></p>
      </footer>
    </>
  );
}
