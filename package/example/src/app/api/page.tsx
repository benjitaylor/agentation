"use client";

import { Footer } from "../Footer";
import { CodeBlock } from "../components/CodeBlock";

export default function APIPage() {
  return (
    <>
      <article className="article">
        <header>
          <h1>API</h1>
          <p className="tagline">Programmatic access for developers</p>
        </header>

        <section>
          <h2 id="overview">Overview</h2>
          <p>
            Agentation exposes callbacks that let you integrate annotations into
            your own workflows — send to a backend, pipe to terminal, trigger
            automations, or build custom AI integrations.
          </p>
          <ul>
            <li>Sync annotations to a database or backend service</li>
            <li>Build analytics dashboards tracking feedback patterns</li>
            <li>Create custom AI integrations (MCP servers, agent tools)</li>
          </ul>
        </section>

        <section>
          <h2 id="props">Props</h2>
          <div className="props-list">
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">onAnnotationAdd</code>
                <span className="prop-type">(annotation: Annotation) =&gt; void</span>
              </div>
              <p className="prop-desc">Called when an annotation is created</p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">onAnnotationDelete</code>
                <span className="prop-type">(annotation: Annotation) =&gt; void</span>
              </div>
              <p className="prop-desc">Called when an annotation is deleted</p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">onAnnotationUpdate</code>
                <span className="prop-type">(annotation: Annotation) =&gt; void</span>
              </div>
              <p className="prop-desc">Called when an annotation comment is edited</p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">onAnnotationsClear</code>
                <span className="prop-type">(annotations: Annotation[]) =&gt; void</span>
              </div>
              <p className="prop-desc">Called when all annotations are cleared</p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">onCopy</code>
                <span className="prop-type">(markdown: string) =&gt; void</span>
              </div>
              <p className="prop-desc">Callback with the markdown output when copy is clicked</p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">onSubmit</code>
                <span className="prop-type">(output: string, annotations: Annotation[]) =&gt; void</span>
              </div>
              <p className="prop-desc">Called when &quot;Send Annotations&quot; is clicked</p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">copyToClipboard</code>
                <span className="prop-type">boolean</span>
                <span className="prop-default">default: true</span>
              </div>
              <p className="prop-desc">Set to false to prevent writing to clipboard (if handling via onCopy)</p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">endpoint</code>
                <span className="prop-type">string</span>
              </div>
              <p className="prop-desc">MCP server URL for syncing annotations</p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">sessionId</code>
                <span className="prop-type">string</span>
              </div>
              <p className="prop-desc">Pre-existing session ID to use</p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">onSessionCreated</code>
                <span className="prop-type">(sessionId: string) =&gt; void</span>
              </div>
              <p className="prop-desc">Called when a new session is created</p>
            </div>
            <div className="prop-item">
              <div className="prop-header">
                <code className="prop-name">webhookUrl</code>
                <span className="prop-type">string</span>
              </div>
              <p className="prop-desc">Webhook URL to receive annotation events</p>
            </div>
          </div>
        </section>

        <section>
          <h2 id="basic-usage">Basic usage</h2>
          <p>
            Receive annotation data directly in your code:
          </p>
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
          <h2 id="annotation-type">Annotation type</h2>
          <p>
            The <code>Annotation</code> object passed to callbacks. See <a href="/schema">Agentation Format</a> for the full schema.
          </p>
          <CodeBlock
            code={`type Annotation = {
  // Required
  id: string;              // Unique identifier
  comment: string;         // User's annotation text
  elementPath: string;     // CSS selector path
  timestamp: number;       // Unix timestamp (ms)
  x: number;               // % of viewport width (0-100)
  y: number;               // px from document top
  element: string;         // Tag name ("button", "div")

  // Recommended
  url?: string;            // Page URL
  boundingBox?: {          // Element dimensions
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // Context (varies by output format)
  reactComponents?: string;   // Component tree
  cssClasses?: string;
  computedStyles?: string;
  accessibility?: string;
  nearbyText?: string;
  selectedText?: string;      // If text was selected

  // Browser component fields
  isFixed?: boolean;       // Fixed-position element
  isMultiSelect?: boolean; // Created via drag selection
};`}
          />
        </section>

        <section>
          <h2 id="http-api">HTTP API</h2>
          <p>
            The <code>agentation-mcp</code> server provides a REST API for programmatic access:
          </p>

          <h3 style={{ marginTop: "1.25rem" }}>Sessions</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem", width: "5rem", color: "rgba(0,0,0,0.4)" }}>POST</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>/sessions</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Create a new session</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem", color: "rgba(0,0,0,0.4)" }}>GET</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>/sessions</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>List all sessions</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem", color: "rgba(0,0,0,0.4)" }}>GET</td>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem" }}>/sessions/:id</td>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Get session with annotations</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: "1.25rem" }}>Annotations</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem", width: "5rem", color: "rgba(0,0,0,0.4)" }}>POST</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>/sessions/:id/annotations</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Add annotation</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem", color: "rgba(0,0,0,0.4)" }}>GET</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>/annotations/:id</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Get annotation</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem", color: "rgba(0,0,0,0.4)" }}>PATCH</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>/annotations/:id</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Update annotation</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem", color: "rgba(0,0,0,0.4)" }}>DELETE</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>/annotations/:id</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Delete annotation</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem", color: "rgba(0,0,0,0.4)" }}>POST</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>/annotations/:id/thread</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Add thread message</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem", color: "rgba(0,0,0,0.4)" }}>GET</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>/sessions/:id/pending</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Get pending annotations</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem", color: "rgba(0,0,0,0.4)" }}>GET</td>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem" }}>/pending</td>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Get all pending annotations</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: "1.25rem" }}>Events (SSE)</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem", width: "5rem", color: "rgba(0,0,0,0.4)" }}>GET</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>/sessions/:id/events</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Session event stream</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem", color: "rgba(0,0,0,0.4)" }}>GET</td>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem" }}>/events</td>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Global event stream (optionally filter with <code>?domain=...</code>)</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: "1.25rem" }}>Health</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem", width: "5rem", color: "rgba(0,0,0,0.4)" }}>GET</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>/health</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Health check</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem", color: "rgba(0,0,0,0.4)" }}>GET</td>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem" }}>/status</td>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>Server status</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 id="real-time-events">Real-Time Events</h2>
          <p>
            Subscribe to real-time events via Server-Sent Events:
          </p>
          <CodeBlock
            language="bash"
            code={`# Session-level: events for a single page
curl -N http://localhost:4747/sessions/:id/events

# Global: events across ALL sessions
curl -N http://localhost:4747/events

# Filtered by domain: events for pages on a specific domain
curl -N "http://localhost:4747/events?domain=localhost:3001"

# Reconnect after disconnect (replay missed events)
curl -N -H "Last-Event-ID: 42" http://localhost:4747/sessions/:id/events`}
          />
          <h3 style={{ marginTop: "1.25rem" }}>Event types</h3>
          <ul style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.65)", marginTop: "0.5rem" }}>
            <li><code>annotation.created</code> &mdash; New annotation added</li>
            <li><code>annotation.updated</code> &mdash; Annotation modified (comment, status, etc.)</li>
            <li><code>annotation.deleted</code> &mdash; Annotation removed</li>
            <li><code>session.created</code> &mdash; New session started</li>
            <li><code>session.updated</code> &mdash; Session updated</li>
            <li><code>session.closed</code> &mdash; Session closed</li>
            <li><code>action.requested</code> &mdash; Agent action requested</li>
            <li><code>thread.message</code> &mdash; New message in annotation thread</li>
          </ul>
        </section>


        <section>
          <h2 id="environment-variables">Environment Variables</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", marginTop: "1rem" }}>
            <thead>
              <tr>
                <th style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "left", fontWeight: 500 }}>Variable</th>
                <th style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "left", fontWeight: 500 }}>Description</th>
                <th style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "left", fontWeight: 500 }}>Default</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>AGENTATION_STORE</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.6)" }}>Storage backend (<code>memory</code> or <code>sqlite</code>)</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>sqlite</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem" }}>AGENTATION_EVENT_RETENTION_DAYS</td>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.6)" }}>Days to keep events</td>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem" }}>7</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 id="storage">Storage</h2>
          <p>
            By default, data is persisted to SQLite at <code>~/.agentation/store.db</code>. To use
            in-memory storage:
          </p>
          <CodeBlock
            language="bash"
            copyable
            code={`AGENTATION_STORE=memory npx agentation-mcp server`}
          />
        </section>

        <section>
          <h2 id="programmatic-usage">Programmatic Usage</h2>
          <CodeBlock
            language="typescript"
            code={`import { startHttpServer, startMcpServer } from 'agentation-mcp';

// Start HTTP server on port 4747
startHttpServer(4747);

// Start MCP server (connects via stdio)
await startMcpServer('http://localhost:4747');`}
          />
          <p style={{ marginTop: "0.75rem", fontSize: "0.8125rem" }}>
            See <a href="/mcp">MCP Server</a> for AI agent integration and available tools.
          </p>
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
