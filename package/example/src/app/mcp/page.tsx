"use client";

import { Footer } from "../Footer";
import { CodeBlock } from "../components/CodeBlock";
import { MCPDiagram } from "../components/MCPDiagram";

function ToolName({ children }: { children: string }) {
  return (
    <h3 style={{ fontFamily: "'SF Mono', monospace", fontSize: "0.75rem", letterSpacing: "-0.01em" }}>
      {children}
    </h3>
  );
}

export default function McpPage() {
  return (
    <>
      <article className="article">
        <header>
          <h1>MCP Server</h1>
          <p className="tagline">
            Connect AI agents to web page annotations via the Model Context Protocol
          </p>
        </header>

        <section>
          <h2 id="overview">Overview</h2>
          <p>
            The <code>agentation-mcp</code> package provides an MCP server that allows AI coding agents
            (like Claude Code) to receive and respond to web page annotations created with the Agentation toolbar.
            This bypasses copy-paste entirely &mdash; just annotate and talk to your agent. It already has full context.
          </p>
          <p>
            It runs both an <strong>HTTP server</strong> (for the browser toolbar) and an{" "}
            <strong>MCP server</strong> (for agents via stdio), sharing the same data store.
          </p>
          <p style={{ marginTop: "0.75rem", fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            <code>toolbar</code> → <code>server</code> → <code>agent</code>
          </p>

          <MCPDiagram />
        </section>

        <section>
          <h2 id="installation">Installation</h2>
          <CodeBlock
            language="bash"
            copyable
            code={`npm install agentation-mcp
# or
pnpm add agentation-mcp`}
          />
        </section>

        <section>
          <h2 id="quick-start">Quick Start</h2>

          <h3>1. Add to your agent</h3>
          <p>
            The fastest way to configure Agentation across any supported agent:
          </p>
          <CodeBlock language="bash" copyable code={`npx add-mcp "npx -y agentation-mcp server"`} />
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.5rem" }}>
            Uses{" "}
            <a href="https://github.com/neondatabase/add-mcp" target="_blank" rel="noopener noreferrer">add-mcp</a>{" "}
            to auto-detect installed agents (Claude Code, Cursor, Codex, Windsurf, and more) and write the correct config.
          </p>

          <p style={{ marginTop: "0.75rem" }}>
            Or use the interactive wizard for Claude Code specifically:
          </p>
          <CodeBlock language="bash" copyable code={`npx agentation-mcp init`} />

          <h3>2. Verify your setup</h3>
          <CodeBlock language="bash" copyable code={`npx agentation-mcp doctor`} />
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.5rem" }}>
            Checks Node.js version, agent config, and server connectivity.
          </p>
        </section>

        <section>
          <h2 id="cli-commands">CLI Commands</h2>
          <CodeBlock
            language="bash"
            code={`npx agentation-mcp init      # Setup wizard
npx agentation-mcp server    # Start server
npx agentation-mcp doctor    # Check setup
npx agentation-mcp help      # Show help`}
          />
        </section>

        <section>
          <h2 id="server-options">Server Options</h2>
          <CodeBlock
            language="bash"
            code={`--port <port>      # HTTP server port (default: 4747)
--mcp-only         # Skip HTTP server, only run MCP on stdio
--http-url <url>   # HTTP server URL for MCP to fetch from`}
          />
        </section>

        <section>
          <h2 id="claude-code">Claude Code</h2>
          <p>
            To connect Claude Code to the Agentation MCP server:
          </p>

          <h3>1. Add the MCP server</h3>
          <CodeBlock language="bash" copyable code={`npx add-mcp "npx -y agentation-mcp server"`} />
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.5rem" }}>
            Or use <code>claude mcp add agentation -- npx agentation-mcp server</code> or the interactive wizard: <code>npx agentation-mcp init</code>
          </p>

          <h3>2. Restart Claude Code</h3>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            The MCP server starts automatically when Claude Code launches. Once connected, Claude can
            use all the Agentation tools to read and respond to your annotations.
          </p>

          <h3>3. Verify the connection</h3>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            In Claude Code, you can verify the server is connected by asking Claude to list your
            annotation sessions. If the server is running, Claude will be able to use the{" "}
            <code>agentation_list_sessions</code> tool.
          </p>
        </section>

        <section>
          <h2 id="mcp-tools">MCP Tools</h2>
          <p>
            Nine tools are exposed to AI agents via the{" "}
            <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">
              Model Context Protocol
            </a>:
          </p>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", marginTop: "1rem", marginBottom: "1.5rem" }}>
            <thead>
              <tr>
                <th style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "left", fontWeight: 500 }}>Tool</th>
                <th style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "left", fontWeight: 500 }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>agentation_list_sessions</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.6)" }}>List all active annotation sessions</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>agentation_get_session</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.6)" }}>Get a session with all its annotations</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>agentation_get_pending</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.6)" }}>Get pending annotations for a session</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>agentation_get_all_pending</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.6)" }}>Get pending annotations across all sessions</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>agentation_acknowledge</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.6)" }}>Mark an annotation as acknowledged</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>agentation_resolve</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.6)" }}>Mark an annotation as resolved</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>agentation_dismiss</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.6)" }}>Dismiss an annotation with a reason</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.6875rem" }}>agentation_reply</td>
                <td style={{ padding: "0.375rem 0", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.6)" }}>Add a reply to an annotation thread</td>
              </tr>
              <tr>
                <td style={{ padding: "0.375rem 0", fontFamily: "monospace", fontSize: "0.6875rem" }}>agentation_watch_annotations</td>
                <td style={{ padding: "0.375rem 0", color: "rgba(0,0,0,0.6)" }}>Block until new annotations appear, then return batch</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: "1.5rem" }}>Tool Details</h3>

          <ToolName>agentation_list_sessions</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            List all active annotation sessions. Use this to discover which pages have feedback.
          </p>

          <ToolName>agentation_get_session</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Get a session with all its annotations. Input: <code>sessionId</code>
          </p>

          <ToolName>agentation_get_pending</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Get all pending (unacknowledged) annotations for a session. Use this to see what feedback
            needs attention. Input: <code>sessionId</code>
          </p>
          <CodeBlock
            language="json"
            code={`// Response
{
  "count": 1,
  "annotations": [{
    "id": "ann_123",
    "comment": "Button is cut off on mobile",
    "element": "button",
    "elementPath": "body > main > .hero > button.cta",
    "reactComponents": "App > LandingPage > HeroSection > Button",
    "intent": "fix",
    "severity": "blocking"
  }]
}`}
          />

          <ToolName>agentation_get_all_pending</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Get all pending annotations across ALL sessions. Use this to see all unaddressed feedback
            from the human across all pages.
          </p>

          <ToolName>agentation_acknowledge</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Mark an annotation as acknowledged. Use this to let the human know you&apos;ve seen their
            feedback and will address it. Input: <code>annotationId</code>
          </p>

          <ToolName>agentation_resolve</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Mark an annotation as resolved. Use this after you&apos;ve addressed the feedback. Optionally
            include a summary of what you did. Input: <code>annotationId</code>, optional <code>summary</code>
          </p>

          <ToolName>agentation_dismiss</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Dismiss an annotation. Use this when you&apos;ve decided not to address the feedback, with a
            reason why. Input: <code>annotationId</code>, <code>reason</code>
          </p>

          <ToolName>agentation_reply</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Add a reply to an annotation&apos;s thread. Use this to ask clarifying questions or provide
            updates to the human. Input: <code>annotationId</code>, <code>message</code>
          </p>

          <ToolName>agentation_watch_annotations</ToolName>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Block until new annotations appear, then collect a batch and return them. Triggers automatically
            when annotations are created &mdash; the user just annotates in the browser and the agent picks them up.
            After detecting the first new annotation, waits for a batch window to collect more before returning.
            Use in a loop for hands-free feedback processing.
            Input: optional <code>sessionId</code>, optional <code>batchWindowSeconds</code> (default: 10, max: 60),
            optional <code>timeoutSeconds</code> (default: 120, max: 300)
          </p>
        </section>

        <section>
          <h2 id="hands-free-mode">Hands-Free Mode</h2>
          <p>
            Use <code>agentation_watch_annotations</code> in a loop for automatic feedback
            processing &mdash; the agent automatically picks up new annotations as they&apos;re created:
          </p>
          <ol style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.65)", marginTop: "0.5rem" }}>
            <li>Agent calls <code>agentation_watch_annotations</code> (blocks until annotations appear)</li>
            <li>Annotations arrive &mdash; agent receives batch after collection window</li>
            <li>Agent processes each annotation:
              <ul>
                <li><code>agentation_acknowledge</code> &mdash; mark as seen</li>
                <li>Make code changes</li>
                <li><code>agentation_resolve</code> &mdash; mark as done (annotation disappears from browser)</li>
              </ul>
            </li>
            <li>Agent calls <code>agentation_watch_annotations</code> again (loop)</li>
          </ol>
          <CodeBlock
            language="markdown"
            copyable
            code={`# Example CLAUDE.md instructions
When I say "watch mode", call agentation_watch_annotations in a loop.
For each annotation: acknowledge it, make the fix, then resolve it with a summary.
Continue watching until I say stop or timeout is reached.`}
          />
        </section>

        <section>
          <h2 id="critique-mode">Critique Mode</h2>
          <p>
            Hands-free mode waits for <em>you</em> to annotate. Critique mode flips that &mdash; the
            agent opens a headed browser, scrolls through your page top-to-bottom, and adds
            design annotations through the toolbar on your behalf. You watch the cursor move
            across the page in real time.
          </p>
          <CodeBlock
            language="markdown"
            copyable
            code={`Critique the UI at http://localhost:3000`}
          />
          <ol style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.65)", marginTop: "0.5rem" }}>
            <li>Agent opens a headed browser to your page</li>
            <li>Scrolls top-to-bottom, picking elements to critique</li>
            <li>Moves cursor to each element, clicks to open the annotation dialog</li>
            <li>Types specific, actionable feedback and submits</li>
            <li>Repeats for 5&ndash;8 annotations across hierarchy, spacing, typography, navigation, and CTAs</li>
          </ol>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.5rem" }}>
            You review them in the toolbar and decide what to fix.
          </p>

          <h3>Requires</h3>
          <CodeBlock
            language="bash"
            copyable
            code={`npx skills add vercel-labs/agent-browser`}
          />
        </section>

        <section>
          <h2 id="self-driving-mode">Self-Driving Mode</h2>
          <p>
            Critique mode leaves annotations for you to review. Self-driving mode goes
            further &mdash; the same agent also fixes each issue after annotating it.
          </p>
          <CodeBlock
            language="markdown"
            copyable
            code={`Self-driving mode on http://localhost:3000`}
          />
          <ol style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.65)", marginTop: "0.5rem" }}>
            <li>Agent opens a headed browser to your page</li>
            <li>Scrolls to an element, adds a critique annotation (visible in the toolbar)</li>
            <li>Reads the relevant source code and edits it to fix the issue</li>
            <li>Calls <code>agentation_resolve</code> &mdash; annotation disappears from the browser</li>
            <li>Verifies the fix in the browser (if a dev server is running)</li>
            <li>Moves to the next element, repeats</li>
          </ol>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)", marginTop: "0.5rem" }}>
            One Claude Code session handles everything &mdash; browser, code, and annotations.
          </p>

          <h3>Requires</h3>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            Everything from critique mode, plus the self-driving skill:
          </p>
          <CodeBlock
            language="bash"
            copyable
            code={`ln -s "$(pwd)/skills/agentation-self-driving" ~/.claude/skills/agentation-self-driving`}
          />
        </section>

        <section>
          <h2 id="types">TypeScript Types</h2>
          <p>
            Key types for building your own integrations:
          </p>
          <CodeBlock
            language="typescript"
            code={`import type {
  Annotation,
  AnnotationIntent,    // "fix" | "change" | "question" | "approve"
  AnnotationSeverity,  // "blocking" | "important" | "suggestion"
  AnnotationStatus,    // "pending" | "acknowledged" | "resolved" | "dismissed"
  Session,
  SessionStatus,       // "active" | "approved" | "closed"
  SessionWithAnnotations,
  ThreadMessage,
  AFSEvent,
  AFSEventType,
  ActionRequest,
} from 'agentation-mcp';`}
          />
        </section>
      </article>

      <Footer />
    </>
  );
}
