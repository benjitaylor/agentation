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

const releases: Release[] = [
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
      { type: "added", text: "Claude Code skill for automatic setup (npx add-skill benjitaylor/agentation)" },
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
            <h2>
              <a
                href={`https://www.npmjs.com/package/agentation/v/${release.version}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {release.version}
              </a>
              <span
                style={{
                  fontWeight: 400,
                  color: "rgba(0, 0, 0, 0.35)",
                  marginLeft: "0",
                }}
              >
                {release.date}
              </span>
            </h2>

            {release.summary && <p>{release.summary}</p>}

            {release.changes && release.changes.length > 0 && (
              <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {(["fixed", "improved", "added", "removed"] as ChangeType[]).map((type) => {
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
