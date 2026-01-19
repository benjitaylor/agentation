"use client";

import { Footer } from "../Footer";

export default function TodoPage() {
  return (
    <>
      <article className="article">
      <header>
        <h1>To-Do</h1>
        <p className="tagline">9 tasks &middot; 4 areas to explore</p>
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
          <li>Check mobile</li>
          <li>Make sure popup annotations show on top layer</li>
          <li>Make sure popup annotations always show (e.g. if they are right at the edge of the screen)</li>
          <li>Make the toolbar movable</li>
          <li>Improve the toolbar settings</li>
          <li>Improve toolbar icons/animations</li>
          <li>Improve performance</li>
          <li>Improve performance for drag annotations</li>
          <li>Add bunny logo artwork when installing <code>/agentation</code> :)</li>
        </ul>
      </section>

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
    </article>

    <Footer />
    </>
  );
}
