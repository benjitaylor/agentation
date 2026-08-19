const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const test = require("node:test");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const {
  StreamableHTTPClientTransport,
} = require("@modelcontextprotocol/sdk/client/streamableHttp.js");

function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((error) => {
        if (error) reject(error);
        else if (port === null) reject(new Error("Could not allocate a test port"));
        else resolve(port);
      });
    });
  });
}

async function waitForServer(baseUrl, child, getStderr) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Agentation server exited early:\n${getStderr()}`);
    }

    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      // The server has not started listening yet.
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new Error(`Timed out waiting for Agentation server:\n${getStderr()}`);
}

async function stopChild(child) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    once(child, "exit"),
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ]);
}

test("sourceFile survives HTTP, SQLite, and MCP retrieval", async (context) => {
  const dataHome = fs.mkdtempSync(path.join(os.tmpdir(), "agentation-mcp-e2e-"));
  const port = await getAvailablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const cliPath = path.resolve(__dirname, "../dist/cli.js");
  let stderr = "";

  const child = spawn(
    process.execPath,
    [cliPath, "server", "--port", String(port)],
    {
      env: { ...process.env, HOME: dataHome },
      stdio: ["pipe", "pipe", "pipe"],
    },
  );
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  let client;
  context.after(async () => {
    if (client) await client.close();
    await stopChild(child);
    fs.rmSync(dataHome, { recursive: true, force: true });
  });

  await waitForServer(baseUrl, child, () => stderr);

  const sessionResponse = await fetch(`${baseUrl}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "http://preview.example.test" }),
  });
  assert.equal(sessionResponse.status, 201);
  const session = await sessionResponse.json();

  const sourceFile = "src/components/Banner.tsx:16:6";
  const annotationResponse = await fetch(
    `${baseUrl}/sessions/${session.id}/annotations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        x: 25,
        y: 120,
        comment: "Align this heading",
        element: "Banner heading",
        elementPath: "main > section > h1",
        timestamp: Date.now(),
        sourceFile,
      }),
    },
  );
  assert.equal(annotationResponse.status, 201);

  client = new Client({ name: "source-file-e2e", version: "1.0.0" });
  const transport = new StreamableHTTPClientTransport(
    new URL(`${baseUrl}/mcp`),
  );
  await client.connect(transport);

  const tools = await client.listTools();
  assert.equal(tools.tools.length, 9);
  const getPendingTool = tools.tools.find(
    (tool) => tool.name === "agentation_get_pending",
  );
  assert.ok(getPendingTool);
  assert.deepEqual(getPendingTool.inputSchema.required, ["sessionId"]);
  assert.match(getPendingTool.description, /sourceFile/);

  const result = await client.callTool({
    name: "agentation_get_pending",
    arguments: { sessionId: session.id },
  });
  const text = result.content.find((item) => item.type === "text");
  assert.ok(text && "text" in text);

  const payload = JSON.parse(text.text);
  assert.equal(payload.count, 1);
  assert.equal(payload.annotations[0].sourceFile, sourceFile);
});
