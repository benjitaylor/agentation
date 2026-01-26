"use client";

import { Highlight, themes } from "prism-react-renderer";
import { Footer } from "../Footer";

function CodeBlock({
  code,
  language = "tsx",
}: {
  code: string;
  language?: string;
}) {
  return (
    <Highlight theme={themes.github} code={code.trim()} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="code-block"
          style={{ ...style, background: "transparent" }}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

export default function APIPage() {
  return (
    <>
      <article className="article">
        <header>
          <h1>API</h1>
          <p className="tagline">Programmatic access for developers</p>
        </header>

        <section>
          <h2>Overview</h2>
          <p>
            Agentation exposes callbacks that let you integrate annotations into
            your own workflows — send to a backend, pipe to terminal, trigger
            automations, or build custom AI integrations.
          </p>
          <ul>
            <li>Sync annotations to a database or backend service</li>
            <li>Build analytics dashboards tracking feedback patterns</li>
            <li>Create custom AI integrations (MCP servers, agent tools)</li>
            <li>Trigger webhooks or Slack notifications on new feedback</li>
          </ul>
        </section>

        <section>
          <h2>Props</h2>
          <div className="props-list">
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">onAnnotationAdd</code>
                <span className="prop-type">
                  (annotation: Annotation) =&gt; void
                </span>
              </div>
              <p className="prop-desc">Called when an annotation is created</p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">onAnnotationDelete</code>
                <span className="prop-type">
                  (annotation: Annotation) =&gt; void
                </span>
              </div>
              <p className="prop-desc">Called when an annotation is deleted</p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">onAnnotationUpdate</code>
                <span className="prop-type">
                  (annotation: Annotation) =&gt; void
                </span>
              </div>
              <p className="prop-desc">
                Called when an annotation comment is edited
              </p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">onAnnotationsClear</code>
                <span className="prop-type">
                  (annotations: Annotation[]) =&gt; void
                </span>
              </div>
              <p className="prop-desc">
                Called when all annotations are cleared
              </p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">onCopy</code>
                <span className="prop-type">(markdown: string) =&gt; void</span>
              </div>
              <p className="prop-desc">
                Callback with the markdown output when copy is clicked
              </p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">copyToClipboard</code>
                <span className="prop-type">boolean</span>
                <span className="prop-default">default: true</span>
              </div>
              <p className="prop-desc">
                Set to false to prevent writing to clipboard (if handling via
                onCopy)
              </p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">priorityAttribute</code>
                <span className="prop-type">string</span>
                <span className="prop-default">default: "data-testid"</span>
              </div>
              <p className="prop-desc">
                Attribute used for highest priority element identification (e.g.
                "data-cy", "data-test-id")
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Basic usage</h2>
          <p>Receive annotation data directly in your code:</p>
          <CodeBlock
            code={`import { Agentation, Annotation } from "agentation";

function App() {
  const handleAnnotation = (annotation: Annotation) => {
    console.log(annotation.element, annotation.comment);
  };

  return (
    <>
      <YourApp />
      <Agentation onAnnotationAdd={handleAnnotation} />
    </>
  );
}`}
          />
        </section>

        <section>
          <h2>Annotation type</h2>
          <p>
            The <code>Annotation</code> object passed to callbacks:
          </p>
          <CodeBlock
            code={`type Annotation = {
  id: string;              // Unique identifier
  element: string;         // Human-readable element name
  elementPath: string;     // CSS selector path
  comment: string;         // User's annotation text
  timestamp: number;       // Unix timestamp
  x: number;               // Position (% of viewport width)
  y: number;               // Position (px from top, or viewport if fixed)
  selectedText?: string;   // If text was selected
  boundingBox?: {          // Element dimensions
    x: number;
    y: number;
    width: number;
    height: number;
  };
  // Additional fields (Detailed/Forensic modes)
  nearbyText?: string;
  cssClasses?: string;
  nearbyElements?: string;
  computedStyles?: string;
  fullPath?: string;
  accessibility?: string;
  isMultiSelect?: boolean;
  isFixed?: boolean;
};`}
          />
        </section>

        <section>
          <h2>TypeScript</h2>
          <p>Types are exported for full TypeScript support:</p>
          <CodeBlock
            code={`import type { Annotation, AgentationProps } from "agentation";`}
          />
        </section>
      </article>

      <style>{`
        .props-list {
          display: flex;
          flex-direction: column;
        }
        .prop-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.625rem 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        .prop-item:last-child {
          border-bottom: none;
        }
        .prop-header {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .prop-name {
          font-size: 0.8125rem;
          font-family: "SF Mono", "SFMono-Regular", ui-monospace, Consolas, monospace;
          color: rgba(0, 0, 0, 0.8);
        }
        .prop-type {
          font-size: 0.75rem;
          font-family: "SF Mono", "SFMono-Regular", ui-monospace, Consolas, monospace;
          color: rgba(0, 0, 0, 0.4);
        }
        .prop-default {
          font-size: 0.75rem;
          color: rgba(0, 0, 0, 0.4);
        }
        .prop-desc {
          font-size: 0.8125rem;
          font-weight: 450;
          line-height: 1.5;
          color: rgba(0, 0, 0, 0.55);
          margin: 0;
        }
      `}</style>

      <Footer />
    </>
  );
}
