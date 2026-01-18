"use client";

export default function ChangelogPage() {
  return (
    <article className="article">
      <header>
        <h1>Changelog</h1>
        <p className="tagline">Recent updates to Agentation</p>
      </header>

      <section>
        <h2>January 18, 2026 - v1.0.0 (Stable)</h2>

        <h3>Breaking Changes</h3>
        <ul>
          <li><strong>CSS version is now the default</strong> - <code>AgentationCSS</code> is the recommended component
            <ul>
              <li>Zero runtime dependencies beyond React</li>
              <li>Framer-motion version still available as <code>Agentation</code></li>
            </ul>
          </li>
        </ul>

        <h3>New Features</h3>
        <ul>
          <li><strong>Area selection</strong> - Drag in empty space to annotate regions without elements</li>
          <li><strong>Right-click to edit</strong> - Edit existing annotations by right-clicking on markers</li>
          <li><strong>Marker hover outlines</strong> - Hovering annotation markers shows element bounding box
            <ul>
              <li>Blue solid outline for single elements</li>
              <li>Green dashed outline for multi-select groups</li>
            </ul>
          </li>
          <li><strong>Element outline during annotation</strong> - Target element stays highlighted while typing feedback</li>
          <li><strong>Smooth exit animations</strong> - Element outline fades out when annotation is submitted</li>
        </ul>

        <h3>Performance</h3>
        <ul>
          <li><strong>60fps drag selection</strong> - Drag rectangle and element highlights use direct DOM updates
            <ul>
              <li>Zero React re-renders during drag</li>
              <li>Pooled highlight divs to avoid DOM churn</li>
              <li>Faster 50ms throttle for element detection</li>
            </ul>
          </li>
          <li><strong>Unified marker animations</strong> - Single effect handles all marker show/hide states
            <ul>
              <li>Toolbar open/close and visibility toggle use same code path</li>
              <li>Eliminates animation glitches and race conditions</li>
            </ul>
          </li>
        </ul>

        <h3>CSS Version Refinements</h3>
        <ul>
          <li><strong>Exit animations</strong> - Popup and pending marker animate out when cancelling or submitting</li>
          <li><strong>Popup shake fix</strong> - Fixed flash after shake animation by using stable "entered" state</li>
          <li><strong>Accurate element count</strong> - Drag selection uses querySelectorAll for precise counting</li>
          <li><strong>Text selection priority</strong> - Starting on text elements allows native selection; drag-to-select only from non-text</li>
          <li><strong>Multi-select placeholder</strong> - Custom placeholder text for group annotations</li>
          <li><strong>Area selection placeholder</strong> - "What should change in this area?" for empty regions</li>
          <li><strong>Settings always dark</strong> - Settings panel uses dark theme for consistency</li>
          <li><strong>Block interactions fix</strong> - Properly prevents clicks using capture phase</li>
        </ul>

        <h3>Core Features</h3>
        <ul>
          <li><strong>Drag selection</strong> - Click and drag to select multiple elements (green selection box)</li>
          <li><strong>Settings panel</strong> - Gear icon opens settings
            <ul>
              <li>Output detail (Compact, Standard, Detailed)</li>
              <li>Marker color (Blue, Green, Orange, Purple, Pink)</li>
              <li>Auto-clear after copy</li>
              <li>Block page interactions</li>
            </ul>
          </li>
          <li><strong>Demo annotations</strong> - <code>demoAnnotations</code> prop shows examples on load</li>
          <li><strong>Smart cursor</strong> - Text cursor for text elements, crosshair for others</li>
          <li><strong>Animation pause</strong> - Freeze CSS animations to capture specific states</li>
        </ul>

        <h3>Bug Fixes</h3>
        <ul>
          <li>Fixed marker positioning during scroll</li>
          <li>Fixed markers re-animating when adding new annotations</li>
          <li>Fixed exit animation flashing on toolbar close</li>
          <li>Fixed visibility toggle animation not working</li>
        </ul>
      </section>

      <section>
        <h2>Initial Release</h2>
        <ul>
          <li>Click-to-annotate any element</li>
          <li>Text selection support</li>
          <li>Animation pause/resume</li>
          <li>Marker visibility toggle</li>
          <li>Copy to clipboard as structured markdown</li>
          <li>Clear all annotations</li>
          <li>localStorage persistence (7-day expiry)</li>
          <li>Smart element identification</li>
        </ul>
      </section>
    </article>
  );
}
