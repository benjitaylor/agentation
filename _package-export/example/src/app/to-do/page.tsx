"use client";

import { useState } from "react";
import { Footer } from "../Footer";

export default function TodoPage() {
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isDoneOpen, setIsDoneOpen] = useState(false);

  return (
    <>
      <style>{`
        .section-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.625rem 0;
          font-size: 0.8125rem;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.45);
          text-align: left;
          background: none;
          border: none;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: color 0.15s ease;
          margin-top: 1.5rem;
        }
        .section-toggle:hover {
          color: rgba(0, 0, 0, 0.65);
        }
        .section-toggle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease;
        }
        .section-toggle-icon.open {
          transform: rotate(180deg);
        }
        .section-content {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.25s ease;
        }
        .section-content.open {
          grid-template-rows: 1fr;
        }
        .section-content-inner {
          overflow: hidden;
        }
      `}</style>

      <article className="article">
      <header>
        <h1>To-Do</h1>
        <p className="tagline">12 tasks &middot; 4 areas to explore</p>
      </header>

      <div style={{
        background: 'rgba(0,0,0,0.04)',
        padding: '0.625rem 0.875rem',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        color: 'rgba(0,0,0,0.5)',
        marginBottom: '0.5rem'
      }}>
        This is a temporary dev page and won&rsquo;t be published.
      </div>

      <section>
        <h2>Tasks</h2>
        <ul>
          <li>Make sure popup annotations show on top layer</li>
          <li>Make sure popup annotations always show (e.g. if they are right at the edge of the screen)</li>
          <li>Make the toolbar movable</li>
          <li style={{ color: '#22c55e' }}>Improve performance for drag annotations <span style={{ opacity: 0.7 }}>(post-launch)</span></li>
          <li>Clicking save on right-click to edit isn&rsquo;t animating out the container</li>
          <li>Toolbar flashes in on page load &mdash; a simple scale animation might be nicer</li>
          <li>Missing forensic option in toolbar settings</li>
          <li>Check whether output format setting is changing the output format for the toolbar</li>
          <li>Set toolbar to be closed by default in final package</li>
          <li>Create and run test package</li>
          <li>Clean up git history for clean slate, then open source</li>
          <li>Finalise domain and OG image</li>
        </ul>
      </section>

      <button className="section-toggle" style={{ marginTop: '0.5rem' }} onClick={() => setIsDoneOpen(!isDoneOpen)}>
        <span>Done (6)</span>
        <span className={`section-toggle-icon ${isDoneOpen ? 'open' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div className={`section-content ${isDoneOpen ? 'open' : ''}`}>
        <div className="section-content-inner">
          <ul style={{ color: 'rgba(0,0,0,0.4)', marginTop: '0.5rem' }}>
            <li><s>Improve the toolbar settings (visual &mdash; Dennis)</s></li>
            <li><s>Improve toolbar icons/animations</s></li>
            <li><s>Check mobile</s></li>
            <li><s>Improve performance</s> (probably fine)</li>
            <li><s>Add mobile nav for docs site</s></li>
            <li><s>Decide on domain and create OG image for site</s></li>
          </ul>
        </div>
      </div>

      <button className="section-toggle" onClick={() => setIsExploreOpen(!isExploreOpen)}>
        <span>Things to Explore &amp; Implementation Plan</span>
        <span className={`section-toggle-icon ${isExploreOpen ? 'open' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div className={`section-content ${isExploreOpen ? 'open' : ''}`}>
        <div className="section-content-inner">
          <section>
            <h2>Things to Explore</h2>

            <h3>Auto-paste Integration</h3>
            <p>Explore ways to integrate with AI coding tools:</p>
            <ul>
              <li><strong>Cursor/VS Code</strong> &mdash; Check if there&rsquo;s a clipboard API or extension API</li>
              <li><strong>Claude Code</strong> &mdash; Investigate if there&rsquo;s a way to send directly to the CLI</li>
              <li><strong>Fallback</strong> &mdash; Add a &ldquo;Copy &amp; Open&rdquo; button that copies and opens the tool&rsquo;s URL</li>
            </ul>

            <h3>Improved Element Identification</h3>
            <ul>
              <li>Capture React component names from <code>data-*</code> attributes or devtools</li>
              <li>Include more context about parent components</li>
              <li>Better handling of dynamically generated class names (CSS-in-JS)</li>
            </ul>

            <h3>Annotation Persistence Options</h3>
            <ul>
              <li>Export/import annotations as JSON</li>
              <li>URL-based sharing (encode annotations in URL hash)</li>
            </ul>

            <h3>Multi-page Support</h3>
            <ul>
              <li>Track annotations per-route automatically</li>
              <li>Show combined output for all pages</li>
              <li>Navigation detection to prompt save</li>
            </ul>
          </section>

          <section>
            <h2>Implementation Plan</h2>
            <p>Notes on approaching each task, keeping changes minimal and focused.</p>

            <h3><span style={{ display: 'inline-block', background: '#22c55e', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 500 }}>Low-Risk, High-Value</span></h3>
            <ul>
              <li><strong>Popup z-index issues</strong> &mdash; Verify z-index is high enough (currently 100000 base). Could also investigate <code>popover</code> attribute or CSS <code>@layer</code> if needed.</li>
              <li><strong>Popup edge positioning</strong> &mdash; Already partially handled with <code>Math.min/max</code> clamping. Add similar logic for left/right edges and tall popups. Low risk&mdash;just math adjustments.</li>
            </ul>

            <h3><span style={{ display: 'inline-block', background: '#f59e0b', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 500 }}>Medium-Risk (Require Care)</span></h3>
            <ul>
              <li><strong>Make toolbar movable</strong> &mdash; Doable but needs thoughtful UX (drag handle, persist position, snap to corners?). Keep it simple: just add drag handle and store position in localStorage. Modifies positioning logic but not core functionality.</li>
              <li><strong>Drag annotation performance</strong> &mdash; Already has throttling (50ms). Could optimize by reducing DOM queries, using IntersectionObserver, caching bounding rects. Medium risk&mdash;performance work can introduce bugs if not careful.</li>
              <li><strong>Drag selection container display</strong> &mdash; Fix the underlying containers display issue when doing drag-based annotations. Currently looks a bit funky&mdash;likely needs refinement of which elements get highlighted during selection.</li>
            </ul>

            <h3><span style={{ display: 'inline-block', background: '#ef4444', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 500 }}>Higher-Risk / Needs Input</span></h3>
            <ul>
              <li><strong>Improve toolbar settings</strong> &mdash; Visual improvements, one for Dennis.</li>
              <li><strong>Improve icons/animations</strong> &mdash; Already has nice animations. &ldquo;Improvements&rdquo; are subjective&mdash;need specific feedback on what feels wrong before changing.</li>
            </ul>

            <h3><span style={{ display: 'inline-block', background: '#8b5cf6', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: 500 }}>Exploration Areas (Research Only)</span></h3>
            <p>These are explicitly &ldquo;things to explore&rdquo;&mdash;won&rsquo;t start implementing without discussion:</p>
            <ul>
              <li><strong>Auto-paste integration</strong> &mdash; Would need to research Cursor/VS Code extension APIs</li>
              <li><strong>Improved element identification</strong> &mdash; Could enhance <code>element-identification.ts</code> but current approach is already smart</li>
              <li><strong>Annotation persistence</strong> &mdash; JSON export/import is low-risk; URL sharing needs design decisions</li>
              <li><strong>Multi-page support</strong> &mdash; Already stores per-pathname; &ldquo;combined output&rdquo; would need UI work</li>
              <li><strong>Arrow annotations</strong> &mdash; Draw arrows to point at specific things. Medium complexity: SVG rendering is easy, but adds mode switching complexity. Output could be element-aware (&ldquo;Arrow from Button &rarr; Input&rdquo;) or coordinate-based. Simpler alternative: &ldquo;points to&rdquo; second-click on existing annotations.</li>
            </ul>
          </section>
        </div>
      </div>
    </article>

    <Footer />
    </>
  );
}
