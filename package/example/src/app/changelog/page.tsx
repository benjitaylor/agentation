"use client";

import { Footer } from "../Footer";
import { ReactNode } from "react";

type ChangeType = "added" | "fixed" | "improved" | "removed";

interface Change {
  type: ChangeType;
  text: ReactNode;
}

interface Release {
  version: string;
  date: string;
  summary?: string;
  changes?: Change[];
}

const badgeLabels: Record<ChangeType, string> = {
  added: "Added",
  fixed: "Fixed",
  improved: "Improved",
  removed: "Removed",
};

function isMajorVersion(version: string): boolean {
  return version.endsWith(".0.0");
}

const releases: Release[] = [
  {
    version: "2.2.1",
    date: "February 11, 2026",
    changes: [
      { type: "fixed", text: "An issue where the toolbar button would occasionally become unresponsive to clicks and drags" },
    ],
  },
  {
    version: "2.2.0",
    date: "February 6, 2026",
    changes: [
      { type: "improved", text: "Animation pause now freezes all page animations — CSS, JavaScript timers, requestAnimationFrame, Web Animations API, and videos — and resumes exactly where they left off" },
    ],
  },
  {
    version: "2.1.1",
    date: "February 5, 2026",
    changes: [
      { type: "fixed", text: "Unstyled \"Learn more\" link in MCP Connection settings when no endpoint is configured" },
    ],
  },
  {
    version: "2.1.0",
    date: "February 5, 2026",
    changes: [
      { type: "added", text: <><a href="/mcp#hands-free-mode" className="styled-link">Hands-free mode</a> — <code>watch_annotations</code> tool blocks until new annotations appear, then returns a batch for the agent to process in a loop</> },
      { type: "added", text: <>Keyboard shortcut <code>Cmd+Shift+F</code> / <code>Ctrl+Shift+F</code> to toggle feedback mode</> },
      { type: "added", text: "Resolved annotations now animate out of the browser UI in real time via Server-Sent Events" },
      { type: "fixed", text: "Production builds no longer health-check localhost:4747 on every page load" },
      { type: "fixed", text: "MCP tools no longer hang indefinitely if the SSE connection drops" },
      { type: "removed", text: <><code>wait_for_action</code> MCP tool — unused and superseded by <code>watch_annotations</code></> },
    ],
  },
  {
    version: "2.0.0",
    date: "February 5, 2026",
    summary: "The shift from \"annotate, copy, paste\" to \"annotate and collaborate.\" Agents now see your annotations directly. This update adds MCP server integration, webhooks, React component detection, Shadow DOM support, and much more.",
    changes: [
      { type: "added", text: <><a href="/mcp" className="styled-link">MCP server</a> for direct agent integration — agents can fetch, acknowledge, resolve, and dismiss annotations</> },
      { type: "added", text: "HTTP API and Server-Sent Events for real-time updates" },
      { type: "added", text: <>Per-page <a href="/mcp#sessions" className="styled-link">sessions</a> with rich annotation metadata (timestamps, status, resolver info)</> },
      { type: "added", text: "Status transitions: pending → acknowledged → resolved/dismissed, all timestamped" },
      { type: "added", text: <><a href="/schema" className="styled-link">Annotation Format Schema</a> with intent and severity fields for prioritization</> },
      { type: "added", text: "JSON Schema and TypeScript definitions for the annotation format" },
      { type: "added", text: <><a href="/webhooks" className="styled-link">Webhooks</a> to subscribe to annotation events with structured JSON payloads</> },
      { type: "added", text: <><a href="/features#react-detection" className="styled-link">React component detection</a> — shows full component hierarchy on hover, not just DOM elements</> },
      { type: "added", text: <>Shadow DOM support — annotate elements inside modals, web components, and design systems that use shadow DOM</> },
      { type: "added", text: "Toolbar position persists in localStorage — drag it once, it stays where you put it" },
      { type: "added", text: <>Cmd+Shift+Click multi-element selection — hold <code>⌘</code>+<code>⇧</code> and click elements to select multiple individually, release to annotate the group</> },
      { type: "improved", text: "Component detection adapts to output detail level (Compact, Standard, Detailed, Forensic)" },
      { type: "improved", text: "Cursor styles in settings panel — I-beam for text inputs, pointer for clickable items" },
      { type: "improved", text: "Individual element highlights on hover — cmd+shift multi-select annotations show each element separately, not one combined box" },
      { type: "fixed", text: "Fixed/sticky element positioning — annotations on fixed navs and sticky headers now position correctly regardless of scroll" },
      { type: "improved", text: "\"Block page interactions\" now enabled by default — prevents accidental clicks while annotating (can be toggled off in settings)" },
      { type: "fixed", text: "SVG icons broken by host page fill styles — now uses attribute selectors to avoid conflicts" },
      { type: "fixed", text: "Query params and hash fragments now preserved in copied feedback URL" },
    ],
  },
  {
    version: "1.3.2",
    date: "January 24, 2026",
    changes: [
      { type: "fixed", text: "Blurry tooltip text on marker hover (counter-scaled to offset parent transform)" },
      { type: "improved", text: "Unified quote text styling between marker tooltip and annotation popup" },
      { type: "improved", text: "Tooltip font and padding consistency" },
    ],
  },
  {
    version: "1.3.1",
    date: "January 23, 2026",
    changes: [
      { type: "added", text: "Custom tooltips with arrows on toolbar buttons" },
      { type: "added", text: "Subtle stroke around marker dots for better visibility" },
      { type: "improved", text: "Help icon design and tooltip styling" },
    ],
  },
  {
    version: "1.3.0",
    date: "January 23, 2026",
    changes: [
      { type: "added", text: "Collapsible computed styles section in annotation popup — click the chevron to view CSS properties for the selected element" },
      { type: "improved", text: "Toolbar polish and visual refinements" },
    ],
  },
  {
    version: "1.2.0",
    date: "January 22, 2026",
    changes: [
      { type: "added", text: <><a href="/api" className="styled-link">Programmatic API</a>: <code>onAnnotationAdd</code>, <code>onAnnotationDelete</code>, <code>onAnnotationUpdate</code>, <code>onAnnotationsClear</code>, <code>onCopy</code> callbacks</> },
      { type: "added", text: <><code>copyToClipboard</code> prop to control clipboard behavior</> },
    ],
  },
  {
    version: "1.1.1",
    date: "January 22, 2026",
    changes: [
      { type: "added", text: "Claude Code skill for automatic setup (npx skills add benjitaylor/agentation)" },
      { type: "fixed", text: "React key prop warning in color picker" },
    ],
  },
  {
    version: "1.1.0",
    date: "January 21, 2026",
    changes: [
      { type: "improved", text: "Package exports now have proper TypeScript type conditions" },
      { type: "removed", text: "Deprecated AgentationCSS export alias (use Agentation instead)" },
    ],
  },
  {
    version: "1.0.0",
    date: "January 21, 2026",
    summary: "First stable release. Click elements to annotate them, select text, drag to multi-select. Multiple output detail levels, keyboard shortcuts, customizable marker colors, and localStorage persistence.",
  },
];

export default function ChangelogPage() {
  return (
    <>
      <article className="article">
        <header>
          <h1>Changelog</h1>
          <p className="tagline">Release history</p>
        </header>

        {releases.map((release, i) => (
          <section key={release.version}>
            <h2
              style={
                isMajorVersion(release.version)
                  ? { fontSize: "1.125rem" }
                  : undefined
              }
            >
              <a
                href={`https://www.npmjs.com/package/agentation/v/${release.version}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {isMajorVersion(release.version) ? (
                  <span className="sketchy-underline" style={{ "--marker-color": "#febc2e" } as React.CSSProperties}>
                    {release.version}
                  </span>
                ) : (
                  release.version
                )}
              </a>
              <span
                style={{
                  fontWeight: 400,
                  color: "rgba(0, 0, 0, 0.35)",
                  marginLeft: "0",
                  ...(isMajorVersion(release.version) && { fontSize: "0.8125rem" }),
                }}
              >
                {release.date}
              </span>
            </h2>

            {release.summary && <p>{release.summary}</p>}

            {release.changes && release.changes.length > 0 && (
              <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {(["added", "improved", "fixed", "removed"] as ChangeType[]).map((type) => {
                  const items = release.changes!.filter((c) => c.type === type);
                  if (items.length === 0) return null;
                  return (
                    <div key={type}>
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 500,
                          color: "rgba(0, 0, 0, 0.4)",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {badgeLabels[type]}
                      </div>
                      <ul>
                        {items.map((change, j) => (
                          <li key={j}>{change.text}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </article>

      <Footer />
    </>
  );
}
