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
          <li>CSS version is now the default - <code>AgentationCSS</code> is the recommended component
            <ul>
              <li>Zero runtime dependencies beyond React</li>
              <li>Framer-motion version still available as <code>Agentation</code></li>
            </ul>
          </li>
        </ul>

        <h3>New Features</h3>
        <ul>
          <li>Area selection - Drag in empty space to annotate regions without elements</li>
          <li>Right-click to edit - Edit existing annotations by right-clicking on markers</li>
          <li>Marker hover outlines - Hovering annotation markers shows element bounding box
            <ul>
              <li>Blue solid outline for single elements</li>
              <li>Green dashed outline for multi-select groups</li>
            </ul>
          </li>
          <li>Element outline during annotation - Target element stays highlighted while typing feedback</li>
          <li>Smooth exit animations - Element outline fades out when annotation is submitted</li>
        </ul>

        <h3>Bug Fixes</h3>
        <ul>
          <li>Drag selection detection - Fixed issue where not all elements inside the green boundary were being selected
            <ul>
              <li>Added missing element types (td, th, section, article, aside, nav, div, span)</li>
              <li>Improved overlap detection using center-point and area-based calculations</li>
              <li>Elements are now selected if their center is inside or if they overlap by more than 50%</li>
              <li>Divs and spans with meaningful text content or interactive roles are now included</li>
            </ul>
          </li>
        </ul>

        <h3>Performance</h3>
        <ul>
          <li>60fps drag selection - Drag rectangle and element highlights use direct DOM updates
            <ul>
              <li>Zero React re-renders during drag</li>
              <li>Pooled highlight divs to avoid DOM churn</li>
              <li>Faster 50ms throttle for element detection</li>
            </ul>
          </li>
          <li>Unified marker animations - Single effect handles all marker show/hide states
            <ul>
              <li>Toolbar open/close and visibility toggle use same code path</li>
              <li>Eliminates animation glitches and race conditions</li>
            </ul>
          </li>
        </ul>

        <h3>CSS Version Refinements</h3>
        <ul>
          <li>Exit animations - Popup and pending marker animate out when cancelling or submitting</li>
          <li>Popup shake fix - Fixed flash after shake animation by using stable "entered" state</li>
          <li>Accurate element count - Drag selection uses querySelectorAll for precise counting</li>
          <li>Text selection priority - Starting on text elements allows native selection; drag-to-select only from non-text</li>
          <li>Multi-select placeholder - Custom placeholder text for group annotations</li>
          <li>Area selection placeholder - "What should change in this area?" for empty regions</li>
          <li>Settings always dark - Settings panel uses dark theme for consistency</li>
          <li>Block interactions fix - Properly prevents clicks using capture phase</li>
        </ul>

        <h3>Core Features</h3>
        <ul>
          <li>Drag selection - Click and drag to select multiple elements (green selection box)</li>
          <li>Settings panel - Gear icon opens settings
            <ul>
              <li>Output detail (Compact, Standard, Detailed)</li>
              <li>Marker color (Blue, Green, Orange, Purple, Pink)</li>
              <li>Auto-clear after copy</li>
              <li>Block page interactions</li>
            </ul>
          </li>
          <li>Demo annotations - <code>demoAnnotations</code> prop shows examples on load</li>
          <li>Smart cursor - Text cursor for text elements, crosshair for others</li>
          <li>Animation pause - Freeze CSS animations to capture specific states</li>
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
