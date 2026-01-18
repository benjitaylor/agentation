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
        <p style={{ fontSize: '0.875rem', color: 'rgba(0,0,0,0.5)', marginBottom: '1rem', fontStyle: 'italic' }}>
          Rollback point: CSS-only version fully functional with all animations and interactions working.
        </p>

        <h3>CSS Version Refinements</h3>
        <ul>
          <li><strong>Exit animations</strong> - Popup and pending marker now animate out when cancelling</li>
          <li><strong>Popup shake fix</strong> - Fixed flash after shake animation by using stable "entered" state</li>
          <li><strong>Accurate element count</strong> - Drag selection now uses querySelectorAll for precise counting</li>
          <li><strong>Text selection priority</strong> - Starting on text elements allows native selection; drag-to-select only from non-text</li>
          <li><strong>Performance optimizations</strong> - Throttled element detection, passive event listeners, GPU-accelerated animations</li>
          <li><strong>Multi-select placeholder</strong> - Custom placeholder text for group annotations</li>
          <li><strong>Settings always dark</strong> - Settings panel uses dark theme for consistency with toolbar</li>
          <li><strong>Settings auto-close</strong> - Settings panel closes when toolbar closes</li>
          <li><strong>Block interactions fix</strong> - Now properly prevents clicks using capture phase</li>
        </ul>

        <h3>New Features</h3>
        <ul>
          <li><strong>CSS-only version</strong> - New <code>AgentationCSS</code> component with zero runtime dependencies
            <ul>
              <li>All animations converted to pure CSS (no framer-motion)</li>
              <li>Same functionality and visual feel as the default version</li>
              <li>Smaller bundle size, better compatibility</li>
              <li>Visit <a href="/css-version" style={{ color: '#3c82f7' }}>/css-version</a> to try it</li>
            </ul>
          </li>
          <li><strong>Drag selection</strong> - Click and drag to select multiple elements at once (green selection box)</li>
          <li><strong>Settings panel</strong> - Access via gear icon in toolbar
            <ul>
              <li>Output detail selector (Compact, Standard, Detailed)</li>
              <li>Marker color picker (5 color options)</li>
              <li>Auto-clear after copy toggle</li>
              <li>Block page interactions toggle (prevents clicks on buttons/links in annotation mode)</li>
            </ul>
          </li>
          <li><strong>Auto dark mode detection</strong> - Settings panel adapts to system theme</li>
          <li><strong>Demo annotations</strong> - New <code>demoAnnotations</code> prop to show example annotations on page load</li>
          <li><strong>Smart cursor</strong> - Text cursor for text elements, crosshair for others</li>
          <li><strong>Side navigation</strong> - Minimal fixed sidebar with Docs and Changelog links</li>
        </ul>

        <h3>Improvements</h3>
        <ul>
          <li><strong>Drag selection UX</strong> - Hover highlight hides during drag to avoid visual clutter</li>
          <li><strong>Scroll behavior</strong> - Hover highlight/tooltip fades during scroll for cleaner UX</li>
          <li><strong>Delete animation</strong> - Markers now dismiss as red X instead of flashing blue</li>
          <li><strong>Clear animation</strong> - Staggered exit animation when clearing all annotations</li>
          <li><strong>Interactive elements</strong> - Clicking buttons/links while popup is open no longer shakes it</li>
        </ul>

        <h3>Bug Fixes</h3>
        <ul>
          <li>Fixed marker positioning during scroll</li>
          <li>Fixed performance issues with scroll handling</li>
          <li>Markers now persist correctly as normal page elements</li>
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
