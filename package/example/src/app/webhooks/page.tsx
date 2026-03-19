"use client";

import { Footer } from "../Footer";
import { CodeBlock } from "../components/CodeBlock";
import { WebhooksDiagram } from "../components/WebhooksDiagram";

export default function WebhooksPage() {
  return (
    <>
      <article className="article">
        <header>
          <h1>Webhooks</h1>
          <p className="tagline">
            Send annotation events to external services automatically
          </p>
        </header>

        <section>
          <h2 id="overview">Overview</h2>
          <p>
            Webhooks allow you to receive annotation data at external URLs when users interact with annotations.
            This enables integrations with Slack, Discord, custom backends, CI/CD pipelines, and more.
          </p>
          <p>
            Configure a webhook URL via the <code>webhookUrl</code> prop, and events will be sent automatically
            when annotations are created, updated, deleted, or submitted.
          </p>

          <WebhooksDiagram />
        </section>

        <section>
          <h2 id="configuration">Configuration</h2>
          <p>
            Add the <code>webhookUrl</code> prop to enable webhooks:
          </p>
          <CodeBlock
            language="tsx"
            copyable
            code={`import { Agentation } from "agentation";

function App() {
  return (
    <>
      <YourApp />
      <Agentation webhookUrl="https://your-server.com/webhook" />
    </>
  );
}`}
          />
          <p style={{ marginTop: "0.75rem", fontSize: "0.8125rem", color: "rgba(0,0,0,0.55)" }}>
            With a webhook URL configured, you have two options: enable Auto-Send to fire events automatically,
            or click &quot;Send Annotations&quot; in the toolbar manually. When Auto-Send is on, the toolbar button
            is hidden.
          </p>
        </section>

        <section>
          <h2 id="events">Events</h2>
          <p>
            Webhooks fire for the following events:
          </p>
          <ul style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.65)" }}>
            <li><code>annotation.add</code> &mdash; New annotation created</li>
            <li><code>annotation.delete</code> &mdash; Annotation deleted</li>
            <li><code>annotation.update</code> &mdash; Annotation comment edited</li>
            <li><code>annotations.clear</code> &mdash; All annotations cleared</li>
            <li><code>submit</code> &mdash; &quot;Send Annotations&quot; clicked</li>
          </ul>
        </section>

        <section>
          <h2 id="webhook-payload">Webhook Payload</h2>
          <p>
            All events send a POST request with the following JSON structure:
          </p>
          <CodeBlock
            language="json"
            code={`{
  "event": "annotation.add",
  "timestamp": 1706234567890,
  "url": "https://example.com/dashboard",
  "annotation": {
    "id": "1706234567890",
    "comment": "Button is cut off on mobile",
    "element": "button",
    "elementPath": "body > main > form > button.submit-btn",
    "timestamp": 1706234567890
  }
}`}
          />

          <h3 style={{ marginTop: "1.5rem" }}>Event-specific payloads</h3>
          <p style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.65)" }}>
            <code>annotation.add</code> / <code>annotation.delete</code> / <code>annotation.update</code>
          </p>
          <CodeBlock
            language="json"
            code={`{
  "event": "annotation.add",
  "timestamp": 1706234567890,
  "url": "https://example.com/page",
  "annotation": { ... }
}`}
          />

          <p style={{ marginTop: "1rem", fontSize: "0.8125rem", color: "rgba(0,0,0,0.65)" }}>
            <code>annotations.clear</code>
          </p>
          <CodeBlock
            language="json"
            code={`{
  "event": "annotations.clear",
  "timestamp": 1706234567890,
  "url": "https://example.com/page",
  "annotations": [ ... ]
}`}
          />

          <p style={{ marginTop: "1rem", fontSize: "0.8125rem", color: "rgba(0,0,0,0.65)" }}>
            <code>submit</code>
          </p>
          <CodeBlock
            language="json"
            code={`{
  "event": "submit",
  "timestamp": 1706234567890,
  "url": "https://example.com/page",
  "output": "# Page Feedback\\n\\n...",
  "annotations": [ ... ]
}`}
          />
        </section>

        <section>
          <h2 id="client-callback">Combining with Callbacks</h2>
          <p>
            You can use webhooks alongside the <code>onSubmit</code> and other callback props.
            Both will fire when events occur:
          </p>
          <CodeBlock
            language="tsx"
            copyable
            code={`<Agentation
  webhookUrl="https://your-server.com/webhook"
  onSubmit={(output, annotations) => {
    // This fires in addition to the webhook
    console.log("Submitted:", annotations.length, "annotations");
  }}
  onAnnotationAdd={(annotation) => {
    // Track in analytics
    analytics.track("annotation_created");
  }}
/>`}
          />
        </section>

        <section>
          <h2 id="use-cases">Use Cases</h2>

          <h3>Slack Notifications</h3>
          <CodeBlock
            language="typescript"
            code={`// Server webhook handler
app.post("/webhook/agentation", async (req, res) => {
  const { event, annotation, url } = req.body;

  if (event === "annotation.add") {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: \`New annotation on \${url}: "\${annotation.comment}"\`,
      }),
    });
  }

  res.json({ ok: true });
});`}
          />

          <h3>GitHub Issue Creation</h3>
          <CodeBlock
            language="typescript"
            code={`app.post("/webhook/agentation", async (req, res) => {
  const { event, output, annotations } = req.body;

  if (event === "submit" && annotations.length > 0) {
    await fetch("https://api.github.com/repos/owner/repo/issues", {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${process.env.GITHUB_TOKEN}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: \`[Feedback] \${annotations.length} annotation(s)\`,
        body: output,
        labels: ["feedback"],
      }),
    });
  }

  res.json({ ok: true });
});`}
          />

          <h3>Real-time Dashboard</h3>
          <CodeBlock
            language="typescript"
            code={`// Server with WebSocket broadcast
app.post("/webhook/agentation", (req, res) => {
  const { event, annotation, url } = req.body;

  // Broadcast to connected dashboard clients
  wss.clients.forEach((client) => {
    client.send(JSON.stringify({
      type: "annotation_event",
      event,
      annotation,
      url,
    }));
  });

  res.json({ ok: true });
});`}
          />
        </section>

        <section>
          <h2 id="security">Security Considerations</h2>
          <ul>
            <li>
              <strong>Use HTTPS</strong> &mdash; Always use encrypted connections for webhook URLs
            </li>
            <li>
              <strong>Validate origin</strong> &mdash; Check the request origin if your webhook is public
            </li>
            <li>
              <strong>Rate limiting</strong> &mdash; Implement rate limits to prevent abuse
            </li>
            <li>
              <strong>Sanitize content</strong> &mdash; Annotation comments may contain user-generated content; sanitize before rendering
            </li>
          </ul>
        </section>

        <section>
          <h2 id="testing">Testing Webhooks</h2>
          <p>
            Tools for testing webhooks during development:
          </p>
          <ul style={{ fontSize: "0.8125rem", color: "rgba(0,0,0,0.65)" }}>
            <li>
              <strong>webhook.site</strong> &mdash; Free public endpoint for testing payloads
            </li>
            <li>
              <strong>ngrok</strong> &mdash; Expose local server for testing with real URLs
            </li>
            <li>
              <strong>RequestBin</strong> &mdash; Inspect and debug webhook payloads
            </li>
          </ul>

          <h3>Quick Test Setup</h3>
          <CodeBlock
            language="tsx"
            code={`// Use webhook.site for testing
<Agentation webhookUrl="https://webhook.site/your-unique-id" />

// Then create annotations and check webhook.site for payloads`}
          />
        </section>
      </article>

      <Footer />
    </>
  );
}
