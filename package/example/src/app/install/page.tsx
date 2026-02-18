"use client";

import { useState, useId, useRef, useEffect } from "react";
import { motion, useAnimate, type AnimationSequence } from "framer-motion";
import { Footer } from "../Footer";
import { CodeBlock } from "../components/CodeBlock";

function CopyablePackageManager({ name, command }: { name: string; command: string }) {
  const [copied, setCopied] = useState(false);
  const [scope, animate] = useAnimate();
  const maskId = useId();

  // Same animation values as CodeBlock's CopyButton
  const inSequence: AnimationSequence = [
    [
      '[data-part="square-front"]',
      { y: [0, -4] },
      { duration: 0.12, ease: "easeOut" },
    ],
    [
      '[data-part="square-back"]',
      { x: [0, -4] },
      { at: "<", duration: 0.12, ease: "easeOut" },
    ],
    [
      '[data-part="square-front"], [data-part="square-back"]',
      {
        rx: [2, 7.25],
        width: [10.5, 14.5],
        height: [10.5, 14.5],
        rotate: [0, -45],
      },
      { at: "<", duration: 0.12, ease: "easeOut" },
    ],
    [
      '[data-part="check"]',
      { opacity: [0, 1], pathOffset: [1, 0] },
      { at: "-0.03", duration: 0 },
    ],
    ['[data-part="check"]', { pathLength: [0, 1] }, { duration: 0.1 }],
  ];

  const outSequence: AnimationSequence = [
    [
      '[data-part="check"]',
      { pathOffset: [0, 1] },
      { duration: 0.1, ease: "easeOut" },
    ],
    [
      '[data-part="check"]',
      { opacity: [1, 0], pathLength: [1, 0] },
      { duration: 0 },
    ],
    [
      '[data-part="square-front"], [data-part="square-back"]',
      {
        rx: [7.25, 2],
        width: [14.5, 10.5],
        height: [14.5, 10.5],
        rotate: [-45, 0],
      },
      { at: "+0.03", duration: 0.12, ease: "easeOut" },
    ],
    [
      '[data-part="square-front"]',
      { y: [-4, 0] },
      { at: "<", duration: 0.12, ease: "easeOut" },
    ],
    [
      '[data-part="square-back"]',
      { x: [-4, 0] },
      { at: "<", duration: 0.12, ease: "easeOut" },
    ],
  ];

  const isFirstRender = useRef(true);
  const hasAnimatedIn = useRef(false);
  const inAnimation = useRef<ReturnType<typeof animate> | null>(null);
  const outAnimation = useRef<ReturnType<typeof animate> | null>(null);

  const animateIn = async () => {
    if (!inAnimation.current && !outAnimation.current && !hasAnimatedIn.current) {
      const animation = animate(inSequence);
      inAnimation.current = animation;
      await animation;
      inAnimation.current = null;
      if (animation.speed === 1) hasAnimatedIn.current = true;
    } else if (outAnimation.current) {
      outAnimation.current.speed = -1;
    } else if (inAnimation.current) {
      inAnimation.current.speed = 1;
    }
  };

  const animateOut = async () => {
    if (inAnimation.current) {
      inAnimation.current.speed = -1;
    } else if (hasAnimatedIn.current && !outAnimation.current) {
      const animation = animate(outSequence);
      outAnimation.current = animation;
      await animation;
      outAnimation.current = null;
      if (animation.speed === 1) hasAnimatedIn.current = false;
    } else if (outAnimation.current) {
      outAnimation.current.speed = 1;
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    copied ? animateIn() : animateOut();
  }, [copied]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title={`Copy: ${command}`}
      style={{
        all: "unset",
        cursor: "pointer",
        color: "#007AFF",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.125rem",
      }}
    >
      {name}
      <svg
        ref={scope}
        style={{ overflow: "visible", position: "relative", top: "1.5px" }}
        width={20}
        height={20}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        aria-hidden="true"
      >
        <motion.rect
          data-part="square-front"
          x="4.75"
          y="8.75"
          width="10.5"
          height="10.5"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <g mask={`url(#${maskId})`}>
          <motion.rect
            data-part="square-back"
            x="8.75"
            y="4.75"
            width="10.5"
            height="10.5"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </g>
        <motion.path
          data-part="check"
          initial={{ pathLength: 0, opacity: 0 }}
          d="M9.25 12.25L11 14.25L15 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#fff" />
          <motion.rect
            data-part="square-front"
            x="4.75"
            y="8.75"
            width="10.5"
            height="10.5"
            rx="2"
            fill="#000"
            stroke="#000"
            strokeWidth="1.5"
          />
        </mask>
      </svg>
    </button>
  );
}

export default function InstallPage() {
  return (
    <>
      <article className="article">
        <header>
          <h1>Installation</h1>
          <p className="tagline">Get started with Agentation in your project</p>
        </header>

        <section>
          <h2>Choose your setup</h2>
          <ul>
            <li><strong>Just want annotations?</strong> &rarr; Basic Setup below (copy-paste to agent)</li>
            <li><strong>Using Claude Code?</strong> &rarr; Add the <code>/agentation</code> skill (sets up component + MCP server)</li>
            <li><strong>Building a custom agent?</strong> &rarr; Run MCP server manually for real-time sync</li>
          </ul>
          <p style={{ fontSize: "0.875rem", color: "rgba(0,0,0,0.5)", marginTop: "0.5rem" }}>
            Most users: Basic Setup. Claude Code users: Use the skill for full auto-setup.
          </p>
        </section>

        <section>
          <h2>Install the package</h2>
          <CodeBlock code="npm install agentation -D" language="bash" copyable />
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(0,0,0,0.5)",
              marginTop: "0.5rem",
            }}
          >
            Or use{" "}
            <CopyablePackageManager name="yarn" command="yarn add agentation --dev" />,{" "}
            <CopyablePackageManager name="pnpm" command="pnpm add agentation -D" />, or{" "}
            <CopyablePackageManager name="bun" command="bun add agentation -d" />.
          </p>
        </section>

        <section>
          <h2>Add to your app</h2>
          <p>
            Add the component anywhere in your React app, ideally at the root
            level. The <code>NODE_ENV</code> check ensures it only loads in
            development.
          </p>
          <CodeBlock
            code={`import { Agentation } from "agentation";

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === "development" && <Agentation />}
    </>
  );
}`}
            language="tsx"
          />
        </section>

        <section>
          <h2>Claude Code</h2>
          <p>
            If you use Claude Code, you can set up Agentation automatically with the <code>/agentation</code> skill. Install it:
          </p>
          <CodeBlock code="npx skills add benjitaylor/agentation" language="bash" copyable />
          <p style={{ marginTop: "1rem" }}>
            Then in Claude Code:
          </p>
          <CodeBlock code="/agentation" language="bash" copyable />
          <p
            style={{
              fontSize: "0.8125rem",
              color: "rgba(0,0,0,0.45)",
              marginTop: "0.375rem",
            }}
          >
            Detects your framework, installs the package, wires it into your layout, and recommends MCP server setup.
          </p>
        </section>

        <section>
          <h2>Agent Integration <span className="sketchy-underline" style={{ "--marker-color": "#febc2e" } as React.CSSProperties}>Recommended</span></h2>
          <p>
            Connect Agentation to any AI coding agent that supports{" "}
            <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">MCP</a>.
            This enables real-time annotation syncing and bidirectional communication.
          </p>

          <h3>1. Add the MCP server to your agent</h3>
          <p>
            The easiest way to configure Agentation across any supported agent (Claude Code, Cursor, Codex, Windsurf, and more):
          </p>
          <CodeBlock code={`npx add-mcp "npx -y agentation-mcp server"`} language="bash" copyable />
          <p
            style={{
              fontSize: "0.8125rem",
              color: "rgba(0,0,0,0.45)",
              marginTop: "0.375rem",
            }}
          >
            Uses{" "}
            <a href="https://github.com/neondatabase/add-mcp" target="_blank" rel="noopener noreferrer">add-mcp</a>{" "}
            to auto-detect your installed agents and write the correct config. Supports 9+ agents.
          </p>

          <p style={{ marginTop: "1rem" }}>
            Or use the interactive wizard for Claude Code specifically:
          </p>
          <CodeBlock code="npx agentation-mcp init" language="bash" copyable />

          <h3>2. Verify setup</h3>
          <p>
            Check that everything is configured correctly:
          </p>
          <CodeBlock code="npx agentation-mcp doctor" language="bash" copyable />
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(0,0,0,0.5)",
              marginTop: "0.5rem",
            }}
          >
            The server runs on port 4747 by default. Use <code>--port 8080</code> to change it.
          </p>

          <h3>3. Connect the component</h3>
          <p>
            Point the React component to your server:
          </p>
          <CodeBlock
            code={`<Agentation
  endpoint="http://localhost:4747"
  onSessionCreated={(sessionId) => {
    console.log("Session started:", sessionId);
  }}
/>`}
            language="tsx"
          />
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(0,0,0,0.5)",
              marginTop: "0.5rem",
            }}
          >
            Annotations are stored locally and synced to the server when connected.
          </p>

          <ul style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.6)", marginTop: "0.75rem", paddingLeft: "1.25rem" }}>
            <li style={{ marginBottom: "0.375rem" }}><strong>Local-first</strong> &mdash; Works offline, syncs when server is available</li>
            <li style={{ marginBottom: "0.375rem" }}><strong>Session continuity</strong> &mdash; Rejoins the same session on page refresh</li>
            <li style={{ marginBottom: "0.375rem" }}><strong>No duplicates</strong> &mdash; Only new annotations are uploaded; existing ones are skipped</li>
            <li><strong>Server authority</strong> &mdash; Agent changes (resolve, dismiss) take precedence on rejoin</li>
          </ul>

          <p
            style={{
              fontSize: "0.8125rem",
              color: "rgba(0,0,0,0.5)",
              marginTop: "0.75rem",
            }}
          >
            This means you can annotate freely, refresh the page, and the agent will see a continuous session
            rather than fragmented duplicates.
          </p>

          <p style={{ marginTop: "1.5rem" }}>
            <strong>Other agents:</strong> Any tool that supports MCP can connect.
            Use <code>npx add-mcp &quot;npx -y agentation-mcp server&quot;</code> to auto-configure,
            or manually point your agent&apos;s MCP config to the Agentation server.
            Once connected, the agent will have access to tools like <code>agentation_get_all_pending</code>,{" "}
            <code>agentation_list_sessions</code>, and <code>agentation_resolve</code>.
          </p>
        </section>

        <section>
          <h2>Requirements</h2>
          <ul>
            <li>
              <strong>React 18+</strong> &mdash; Uses modern React features
            </li>
            <li>
              <strong>Client-side only</strong> &mdash; Requires DOM access
            </li>
            <li>
              <strong>Desktop only</strong> &mdash; Not optimized for mobile
              devices
            </li>
            <li>
              <strong>Zero dependencies</strong> &mdash; No runtime deps beyond
              React
            </li>
          </ul>
        </section>

        <section>
          <h2>Props</h2>
          <p>
            All props are optional. The component works with zero configuration.
          </p>

          <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Callbacks</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", width: "35%" }}>
                  <code>onAnnotationAdd</code>
                </td>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Fired when an annotation is added
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <code>onAnnotationDelete</code>
                </td>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Fired when an annotation is deleted
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <code>onAnnotationUpdate</code>
                </td>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Fired when an annotation comment is edited
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <code>onAnnotationsClear</code>
                </td>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Fired when all annotations are cleared
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <code>onCopy</code>
                </td>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Fired when copy button is clicked (receives markdown)
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.5rem 0" }}>
                  <code>onSubmit</code>
                </td>
                <td style={{ padding: "0.5rem 0", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Fired when &quot;Send Annotations&quot; is clicked
                </td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Behavior</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.5rem 0", width: "35%" }}>
                  <code>copyToClipboard</code>
                </td>
                <td style={{ padding: "0.5rem 0", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Auto-copy on add (default: <code style={{ color: "rgba(0,0,0,0.7)" }}>true</code>)
                </td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Agent Sync</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", width: "35%" }}>
                  <code>endpoint</code>
                </td>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Server URL (e.g., <code style={{ color: "rgba(0,0,0,0.7)" }}>&quot;http://localhost:4747&quot;</code>)
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <code>sessionId</code>
                </td>
                <td style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Join an existing session (optional)
                </td>
              </tr>
              <tr>
                <td style={{ padding: "0.5rem 0" }}>
                  <code>onSessionCreated</code>
                </td>
                <td style={{ padding: "0.5rem 0", color: "rgba(0,0,0,0.5)", textAlign: "right" }}>
                  Fired when new session is created (receives <code style={{ color: "rgba(0,0,0,0.7)" }}>sessionId: string</code>)
                </td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
            See <a href="/api">API</a> for full props reference and HTTP endpoints.
          </p>

        </section>

        <section>
          <h2>Security notes</h2>
          <p>
            Agentation runs in your browser and reads DOM content to generate
            feedback. By default, it does <strong>not</strong> send data anywhere &mdash;
            everything stays local until you manually copy and paste.
          </p>
          <ul>
            <li>
              <strong>No external requests</strong> &mdash; all processing is
              client-side by default
            </li>
            <li>
              <strong>Local server only</strong> &mdash; when using the <code>endpoint</code> prop,
              data is sent to your local machine only (localhost)
            </li>
            <li>
              <strong>No data collection</strong> &mdash; nothing is tracked or
              stored remotely
            </li>
            <li>
              <strong>Dev-only</strong> &mdash; use the <code>NODE_ENV</code>{" "}
              check to exclude from production
            </li>
          </ul>
        </section>
      </article>

      <Footer />
    </>
  );
}
