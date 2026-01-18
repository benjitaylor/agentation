"use client";

import { useState } from "react";

export default function ExamplePage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <article className="article">
        <header>
          <h1>Feedback Tool Example</h1>
          <time>Updated Jan 18, 2026</time>
        </header>

        <p>
          This is an example page for testing the <code>@benji/feedback-tool</code> package.
          Click the feedback button in the bottom-right corner to start annotating elements
          on this page.
        </p>

        <p>
          The tool allows you to click on any element to add feedback, select text to
          annotate specific passages, and pause CSS animations to capture specific states.
          Try hovering over elements to see their names highlighted.
        </p>

        <blockquote>
          This is a blockquote element. You can annotate it to provide feedback about
          the styling or content.
        </blockquote>

        <p>
          Here&rsquo;s a list of features you can test:
        </p>

        <ul>
          <li>Click anywhere to add an annotation with element identification</li>
          <li>Select text to annotate specific passages</li>
          <li>Hover to see element names highlighted</li>
          <li>Pause CSS animations to annotate specific states</li>
          <li>Copy structured markdown output for sharing</li>
        </ul>

        <p>
          Learn more about the project on{" "}
          <a href="https://github.com" className="styled-link" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>

        {/* Interactive Elements Section */}
        <div className="demo-section">
          <h2>Interactive Elements</h2>
          <p>Test feedback on buttons and form elements:</p>

          <div className="button-group" style={{ marginTop: "1rem" }}>
            <button className="demo-button" onClick={() => alert("Primary clicked!")}>
              Primary Button
            </button>
            <button className="demo-button secondary" onClick={() => alert("Secondary clicked!")}>
              Secondary Button
            </button>
            <button className="demo-button secondary" disabled>
              Disabled Button
            </button>
          </div>

          <input
            type="text"
            className="demo-input"
            placeholder="Type something here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        {/* Card Section */}
        <div className="demo-section">
          <h2>Card Components</h2>
          <p>Test feedback on card layouts:</p>

          <div className="demo-card">
            <h3>Example Card</h3>
            <p>
              This is a card component with some sample content. Cards are commonly used
              to group related information in a visually distinct container.
            </p>
          </div>

          <div className="demo-card">
            <h3>Another Card</h3>
            <p>
              Multiple cards can be annotated individually. Try clicking on different
              parts of each card to see how the element identification works.
            </p>
          </div>
        </div>

        {/* Animation Section */}
        <div className="demo-section">
          <h2>Animated Elements</h2>
          <p>
            Test the animation pause feature. Click the pause button in the toolbar
            to freeze these animations:
          </p>

          <div className="animation-demo">
            <div className="floating-circle" />
            <div className="floating-circle delay-1" />
            <div className="floating-circle delay-2" />
          </div>
        </div>

        {/* Nested Elements Section */}
        <div className="demo-section">
          <h2>Nested Elements</h2>
          <p>Test element identification on deeply nested structures:</p>

          <div data-element="outer-container" style={{ padding: "1rem", background: "#f9f9f9", borderRadius: "0.5rem", marginTop: "1rem" }}>
            <div data-element="inner-wrapper" style={{ padding: "0.75rem", background: "#f0f0f0", borderRadius: "0.375rem" }}>
              <p data-element="nested-paragraph">
                This paragraph is inside nested containers. The tool should identify
                meaningful class names and data-element attributes.
              </p>
            </div>
          </div>
        </div>
      </article>

      <footer className="footer">
        <p>Feedback Tool Example &middot; Built with Next.js</p>
      </footer>
    </>
  );
}
