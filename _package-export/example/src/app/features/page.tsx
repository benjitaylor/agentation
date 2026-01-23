"use client";

import { Footer } from "../Footer";
import { FeaturesDemo, SettingsDemo, SmartIdentificationDemo, MarkerKeyDemo, ComputedStylesDemo } from "../components/FeaturesDemo";

export default function FeaturesPage() {
  return (
    <>
      <article className="article">
      <header>
        <h1>Features</h1>
        <p className="tagline">Everything Agentation can do</p>
      </header>

      <section>
        <h2>Annotation modes</h2>
        <p>
          Click the tabs below to see examples of each annotation mode:
        </p>
        <FeaturesDemo />
      </section>

      <section>
        <h2>Toolbar controls</h2>
        <ul>
          <li><svg style={{ display: 'inline-block', verticalAlign: '-0.38em', width: '1.5em', height: '1.5em', margin: '0 -0.1em 0 0' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 6L8 18" /><path d="M16 18L16 6" /></svg> <strong>Pause</strong> <span style={{ color: 'rgba(0,0,0,0.25)', margin: '0 0.25em' }}>•</span> Freeze CSS animations to annotate specific states</li>
          <li><svg style={{ display: 'inline-block', verticalAlign: '-0.38em', width: '1.5em', height: '1.5em', margin: '0 -0.1em 0 0' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.91752 12.7539C3.65127 12.2889 3.65127 11.7111 3.91752 11.2461C5.42678 8.59839 8.46097 6.25 12 6.25C15.539 6.25 18.5732 8.59839 20.0825 11.2461C20.3487 11.7111 20.3487 12.2889 20.0825 12.7539C18.5732 15.4016 15.539 17.75 12 17.75C8.46097 17.75 5.42678 15.4016 3.91752 12.7539Z" /><path d="M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17391 12 9.17391C10.4392 9.17391 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z" /></svg> <strong>Visibility</strong> <span style={{ color: 'rgba(0,0,0,0.25)', margin: '0 0.25em' }}>•</span> Toggle annotation markers on/off while working</li>
          <li><svg style={{ display: 'inline-block', verticalAlign: '-0.38em', width: '1.5em', height: '1.5em', margin: '0 -0.1em 0 0' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z" /><path d="M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75" /></svg> <strong>Copy</strong> <span style={{ color: 'rgba(0,0,0,0.25)', margin: '0 0.25em' }}>•</span> Get structured markdown for AI agents</li>
          <li><svg style={{ display: 'inline-block', verticalAlign: '-0.38em', width: '1.5em', height: '1.5em', margin: '0 -0.1em 0 0' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 11.5L10.125 15.5" /><path d="M14 11.5L13.87 15.5" /><path d="M9 7.5V6.25C9 5.42157 9.67157 4.75 10.5 4.75H13.5C14.3284 4.75 15 5.42157 15 6.25V7.5" /><path d="M5.5 7.75H18.5" /><path d="M6.75 7.75L7.11691 16.189C7.16369 17.2649 7.18708 17.8028 7.41136 18.2118C7.60875 18.5717 7.91211 18.8621 8.28026 19.0437C8.69854 19.25 9.23699 19.25 10.3139 19.25H13.6861C14.763 19.25 15.3015 19.25 15.7197 19.0437C16.0879 18.8621 16.3912 18.5717 16.5886 18.2118C16.8129 17.8028 16.8363 17.2649 16.8831 16.189L17.25 7.75" /></svg> <strong>Clear</strong> <span style={{ color: 'rgba(0,0,0,0.25)', margin: '0 0.25em' }}>•</span> Remove all annotations</li>
          <li><svg style={{ display: 'inline-block', verticalAlign: '-0.38em', width: '1.5em', height: '1.5em', margin: '0 -0.1em 0 0' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z"/><circle cx="12" cy="12" r="2.5"/></svg> <strong>Settings</strong> <span style={{ color: 'rgba(0,0,0,0.25)', margin: '0 0.25em' }}>•</span> Configure output detail, marker color, and behavior</li>
        </ul>
        <p style={{ fontSize: '0.875rem', color: 'rgba(0,0,0,0.5)', marginTop: '0.75rem' }}>
          Drag the toolbar to reposition it. Click a marker to remove it, or right-click to edit.
        </p>
      </section>

      <section>
        <h2>Marker types</h2>
        <p>
          Different annotation modes use different marker styles.
        </p>
        <MarkerKeyDemo />
      </section>

      <section>
        <h2>Smart identification</h2>
        <p>
          Agentation automatically identifies elements in a way that&rsquo;s useful for code search.
          This makes it easy for agents to <code>grep</code> for the exact element in your codebase.
        </p>
        <SmartIdentificationDemo />
      </section>

      <section>
        <h2>Computed styles</h2>
        <p>
          View the computed CSS styles for any element directly in the annotation popup.
          Expand the collapsible section to see relevant properties like colors, fonts, and spacing.
        </p>
        <ComputedStylesDemo />
      </section>

      <section>
        <h2>Keyboard shortcuts</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><code>Cmd+Shift+A</code> / <code>Ctrl+Shift+A</code></td>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.5)', textAlign: 'right' }}>Toggle feedback mode</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><code>Esc</code></td>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.5)', textAlign: 'right' }}>Close toolbar or cancel</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><code>P</code></td>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.5)', textAlign: 'right' }}>Pause/resume animations</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><code>H</code></td>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.5)', textAlign: 'right' }}>Hide/show markers</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}><code>C</code></td>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.5)', textAlign: 'right' }}>Copy feedback</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem 0' }}><code>X</code></td>
              <td style={{ padding: '0.5rem 0', color: 'rgba(0,0,0,0.5)', textAlign: 'right' }}>Clear all annotations</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', marginTop: '0.75rem' }}>
          Shortcuts are disabled when typing in an input field.
        </p>
      </section>

      <section>
        <h2>Settings</h2>
        <p>The <svg style={{ display: 'inline-block', verticalAlign: '-0.38em', width: '1.5em', height: '1.5em', margin: '0 -0.1em' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z"/><circle cx="12" cy="12" r="2.5"/></svg> icon lets you customize Agentation to fit your workflow.</p>
        <SettingsDemo />
      </section>

      <section>
        <h2>Limitations</h2>
        <ul>
          <li><strong>Desktop only</strong> &mdash; The tool requires a desktop browser, but you can still request mobile changes in your feedback</li>
          <li><strong>Per-page storage</strong> &mdash; Annotations persist in localStorage for 7 days</li>
          <li><strong>Single page</strong> &mdash; Annotations don&rsquo;t follow across navigation</li>
          <li><strong>Static positions</strong> &mdash; Markers don&rsquo;t update if layout changes</li>
          <li><strong>No screenshots</strong> &mdash; Output is text-only (paste alongside screenshots if needed)</li>
          <li><strong>CSS animations only</strong> &mdash; Pause works on CSS animations, not JS-driven animations (framer-motion, GSAP, etc.)</li>
          <li><strong>React only</strong> &mdash; Currently requires React 18+</li>
        </ul>
      </section>
    </article>

    <Footer />
    </>
  );
}
