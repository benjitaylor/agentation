"use client";

import { useState } from "react";

export default function CSSVersionPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <article className="article">
        <header>
          <h1>CSS Version Demo</h1>
          <p className="tagline">Zero-dependency version using CSS animations</p>
        </header>

        <section>
          <p>
            This page uses <code>AgentationCSS</code> instead of the default <code>Agentation</code> component.
            All animations are pure CSS - no framer-motion dependency required.
          </p>
          <p>
            The animations should feel nearly identical to the framer-motion version. Try:
          </p>
          <ul>
            <li>Opening/closing the toolbar (watch the spring-like animation)</li>
            <li>Adding annotations (markers scale in with a bounce)</li>
            <li>Hovering over markers (tooltip fades in smoothly)</li>
            <li>Deleting markers (watch them scale out)</li>
            <li>Opening the settings panel</li>
          </ul>
        </section>

        <section>
          <h2>Usage</h2>
          <pre className="code-block">
{`import { AgentationCSS } from "agentation";

// Instead of:
// import { Agentation } from "agentation";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <AgentationCSS />
    </>
  );
}`}
          </pre>
        </section>

        <section>
          <h2>Benefits</h2>
          <ul>
            <li><strong>Zero runtime dependencies</strong> - No framer-motion needed</li>
            <li><strong>Smaller bundle size</strong> - CSS is lighter than JS animation libraries</li>
            <li><strong>Better compatibility</strong> - Works anywhere CSS works</li>
            <li><strong>Consistent performance</strong> - CSS animations are GPU-accelerated</li>
          </ul>
        </section>

        <section>
          <h2>Trade-offs</h2>
          <ul>
            <li>Exit animations require delayed unmounting (slightly more complex state)</li>
            <li>No physics-based spring interruption (CSS springs are fire-and-forget)</li>
            <li>Stagger animations use CSS animation-delay instead of JS orchestration</li>
          </ul>
          <p>
            For most use cases, these trade-offs are negligible. The CSS version should
            feel nearly identical to users.
          </p>
        </section>

        {/* Interactive Demo Section */}
        <section className="demo-section">
          <h2>Try it</h2>
          <p>
            The CSS-only toolbar is active on this page. Test the animations:
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
            style={{ marginTop: "1rem" }}
          />

          <div className="demo-card" style={{ marginTop: "1rem" }}>
            <h3>Example Card</h3>
            <p>
              Click on this card or select text to create annotations.
              Watch the marker animate in when you add one.
            </p>
          </div>
        </section>

        {/* Animation Demo */}
        <section className="demo-section">
          <h2>Animation pause test</h2>
          <p>
            Click the pause button to freeze this animation:
          </p>
          <div className="animation-demo">
            <div className="slider-track">
              <div className="slider-circle" />
            </div>
          </div>
        </section>

        <section>
          <h2>Multi-select drag</h2>
          <p>
            Drag to select multiple elements at once. The green selection box and
            element highlighting should work identically to the framer-motion version.
          </p>
          <div className="button-group" style={{ marginTop: "1rem" }}>
            <button className="demo-button">Button 1</button>
            <button className="demo-button">Button 2</button>
            <button className="demo-button">Button 3</button>
            <button className="demo-button secondary">Button 4</button>
          </div>
        </section>

        <section>
          <h2>Fixed element annotation</h2>
          <p>
            Try annotating the side navigation (it&apos;s position: fixed).
            The annotation marker should stay in place when you scroll -
            this tests the fixed marker layer rendering.
          </p>
        </section>
      </article>

      <footer className="footer">
        <p>CSS-only version of <a href="/" style={{ color: 'inherit' }}>Agentation</a></p>
      </footer>
    </>
  );
}
