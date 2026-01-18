"use client";

export default function FeaturesPage() {
  return (
    <article className="article">
      <header>
        <h1>Features</h1>
        <p className="tagline">Everything Agentation can do</p>
      </header>

      <section>
        <h2>Annotation modes</h2>
        <ul>
          <li><strong>Element annotation</strong> &mdash; Click any element to add feedback with automatic element identification (class names, IDs, semantic tags)</li>
          <li><strong>Text selection</strong> &mdash; Select text to annotate specific content with the quoted text included in output</li>
          <li><strong>Multi-select drag</strong> &mdash; Drag to select multiple elements at once</li>
          <li><strong>Area selection</strong> &mdash; Annotate empty regions of the page</li>
        </ul>
      </section>

      <section>
        <h2>Toolbar controls</h2>
        <ul>
          <li><strong>Animation pause</strong> &mdash; Freeze CSS animations to annotate specific states</li>
          <li><strong>Marker visibility</strong> &mdash; Toggle annotation markers on/off while working</li>
          <li><strong>Copy output</strong> &mdash; Get structured markdown for AI agents</li>
          <li><strong>Clear all</strong> &mdash; Remove all annotations</li>
          <li><strong>Settings</strong> &mdash; Configure output detail, marker color, and behavior</li>
        </ul>
      </section>

      <section>
        <h2>Smart identification</h2>
        <p>
          Agentation automatically identifies elements in a way that&rsquo;s useful for code search:
        </p>
        <ul>
          <li>Buttons and links are named by their text content</li>
          <li>Headings are identified by their content</li>
          <li>Images use alt text or src filename</li>
          <li>Inputs use labels or placeholder text</li>
          <li>Other elements use class names or IDs</li>
        </ul>
        <p>
          This makes it easy for agents to <code>grep</code> for the exact element in your codebase.
        </p>
      </section>

      <section>
        <h2>Keyboard shortcuts</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}><code>Cmd+Shift+A</code> / <code>Ctrl+Shift+A</code></td>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>Toggle feedback mode</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}><code>Esc</code></td>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>Close toolbar or cancel</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}><code>P</code></td>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>Pause/resume animations</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}><code>H</code></td>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>Hide/show markers</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}><code>C</code></td>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>Copy feedback</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem 0' }}><code>X</code></td>
              <td style={{ padding: '0.5rem 0' }}>Clear all annotations</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', marginTop: '0.75rem' }}>
          Shortcuts are disabled when typing in an input field.
        </p>
      </section>

      <section>
        <h2>Settings</h2>
        <p>Click the gear icon to access settings:</p>
        <ul>
          <li><strong>Output Detail</strong> &mdash; Compact, Standard, or Detailed output</li>
          <li><strong>Marker Color</strong> &mdash; Blue, Green, Orange, Purple, or Pink</li>
          <li><strong>Clear after copy</strong> &mdash; Auto-clear annotations after copying</li>
          <li><strong>Block interactions</strong> &mdash; Prevent clicking through to page elements</li>
        </ul>
      </section>

      <section>
        <h2>Limitations</h2>
        <ul>
          <li><strong>Session-only</strong> &mdash; Annotations clear on page refresh</li>
          <li><strong>Single page</strong> &mdash; Annotations don&rsquo;t follow across navigation</li>
          <li><strong>Static positions</strong> &mdash; Markers don&rsquo;t update if layout changes</li>
          <li><strong>No screenshots</strong> &mdash; Output is text-only (paste alongside screenshots if needed)</li>
          <li><strong>React only</strong> &mdash; Currently requires React 18+</li>
        </ul>
      </section>
    </article>
  );
}
