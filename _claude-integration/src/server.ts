import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { store } from "./store.js";
import type { SyncPayload, ServerConfig, PageFeedback } from "./types.js";

const DEFAULT_HTTP_PORT = 4242;

// SSE clients for broadcasting events to connected browsers
const sseClients = new Set<ServerResponse>();

/**
 * Broadcast an event to all connected SSE clients
 */
function broadcastEvent(event: string, data: Record<string, unknown>) {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    client.write(message);
  }
}

/**
 * Format annotations as markdown for Claude
 */
function formatFeedbackMarkdown(pages: PageFeedback[]): string {
  if (pages.length === 0) {
    return "No pending page feedback.";
  }

  const lines: string[] = ["# Page Feedback\n"];

  for (const page of pages) {
    if (page.annotations.length === 0) continue;

    lines.push(`## ${page.pathname}`);
    lines.push(`**URL:** ${page.url}`);
    if (page.viewport) {
      lines.push(`**Viewport:** ${page.viewport.width}x${page.viewport.height}`);
    }
    lines.push("");

    for (let i = 0; i < page.annotations.length; i++) {
      const ann = page.annotations[i];
      lines.push(`### ${i + 1}. ${ann.element}`);
      lines.push(`**Location:** ${ann.elementPath}`);
      if (ann.cssClasses) {
        lines.push(`**Classes:** ${ann.cssClasses}`);
      }
      if (ann.selectedText) {
        lines.push(`**Selected text:** "${ann.selectedText}"`);
      }
      if (ann.fullPath) {
        lines.push(`**Full path:** ${ann.fullPath}`);
      }
      lines.push(`**Feedback:** ${ann.comment}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

/**
 * Create and start the HTTP server for receiving browser annotations
 */
function createHttpServer(port: number, verbose: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      // CORS headers for browser requests
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      // Handle preflight
      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url || "/", `http://localhost:${port}`);

      // Health check
      if (req.method === "GET" && url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", annotations: store.getTotalCount() }));
        return;
      }

      // SSE endpoint for real-time events
      if (req.method === "GET" && url.pathname === "/events") {
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "Access-Control-Allow-Origin": "*",
        });

        // Send initial connection message
        res.write(`event: connected\ndata: ${JSON.stringify({ status: "ok" })}\n\n`);

        // Add to clients
        sseClients.add(res);

        // Remove on close
        req.on("close", () => {
          sseClients.delete(res);
        });

        return;
      }

      // Receive annotations from browser
      if (req.method === "POST" && url.pathname === "/sync") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const payload: SyncPayload = JSON.parse(body);

            store.set(payload.pathname, {
              url: payload.url,
              pathname: payload.pathname,
              viewport: payload.viewport,
              userAgent: payload.userAgent,
              annotations: payload.annotations,
            });

            if (verbose) {
              console.error(
                `[agentation] Synced ${payload.annotations.length} annotations for ${payload.pathname}`
              );
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON" }));
          }
        });
        return;
      }

      // Get current feedback (for debugging)
      if (req.method === "GET" && url.pathname === "/feedback") {
        const pathname = url.searchParams.get("pathname");
        const data = pathname ? store.get(pathname) : store.getAll();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
        return;
      }

      // Clear feedback
      if (req.method === "DELETE" && url.pathname === "/feedback") {
        const pathname = url.searchParams.get("pathname");
        if (pathname) {
          store.clear(pathname);
          broadcastEvent("clear", { pathname });
        } else {
          store.clearAll();
          broadcastEvent("clear", { all: true });
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
        return;
      }

      // 404
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.error(`[agentation] Port ${port} is already in use. Server may already be running.`);
        // Don't reject - allow MCP to still work even if HTTP server can't start
        resolve();
      } else {
        reject(err);
      }
    });

    server.listen(port, () => {
      console.error(`[agentation] HTTP server listening on http://localhost:${port}`);
      resolve();
    });
  });
}

/**
 * Create the MCP server with tools for Claude Code
 */
function createMcpServer(verbose: boolean): Server {
  const server = new Server(
    {
      name: "agentation",
      version: "0.0.1",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "agentation_get_feedback",
        description:
          "Get page feedback annotations from Agentation. Returns structured feedback about UI elements that need attention. Use this when the user mentions page feedback, UI issues, or wants you to check their annotations.",
        inputSchema: {
          type: "object" as const,
          properties: {
            pathname: {
              type: "string",
              description:
                "Optional: specific page pathname to get feedback for (e.g., '/dashboard'). If not provided, returns feedback for all pages.",
            },
          },
        },
      },
      {
        name: "agentation_list_pages",
        description:
          "List all pages that have pending feedback annotations. Use this to see which pages have issues to address.",
        inputSchema: {
          type: "object" as const,
          properties: {},
        },
      },
      {
        name: "agentation_clear_feedback",
        description:
          "Clear feedback after processing. Use this after you've addressed the feedback to remove it from the queue.",
        inputSchema: {
          type: "object" as const,
          properties: {
            pathname: {
              type: "string",
              description:
                "Optional: specific page pathname to clear. If not provided, clears all feedback.",
            },
          },
        },
      },
    ],
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const toolArgs = args as Record<string, unknown> | undefined;

    switch (name) {
      case "agentation_get_feedback": {
        const pathname = typeof toolArgs?.pathname === "string" ? toolArgs.pathname : undefined;
        const pages = pathname
          ? [store.get(pathname)].filter((p): p is PageFeedback => p !== undefined)
          : store.getAll();

        const markdown = formatFeedbackMarkdown(pages);

        if (verbose) {
          console.error(`[agentation] get_feedback: returning ${pages.length} pages`);
        }

        return {
          content: [{ type: "text", text: markdown }],
        };
      }

      case "agentation_list_pages": {
        const pages = store.getPagesWithFeedback();

        if (pages.length === 0) {
          return {
            content: [{ type: "text", text: "No pages with pending feedback." }],
          };
        }

        const list = pages
          .map((p) => `- ${p.pathname} (${p.count} annotations)`)
          .join("\n");

        return {
          content: [{ type: "text", text: `Pages with pending feedback:\n${list}` }],
        };
      }

      case "agentation_clear_feedback": {
        const pathname = typeof toolArgs?.pathname === "string" ? toolArgs.pathname : undefined;

        if (pathname) {
          store.clear(pathname);
          broadcastEvent("clear", { pathname });
          return {
            content: [{ type: "text", text: `Cleared feedback for ${pathname}` }],
          };
        }

        store.clearAll();
        broadcastEvent("clear", { all: true });
        return {
          content: [{ type: "text", text: "Cleared all feedback" }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  return server;
}

/**
 * Start the combined HTTP + MCP server
 */
export async function startServer(config: Partial<ServerConfig> = {}): Promise<void> {
  const { httpPort = DEFAULT_HTTP_PORT, verbose = false } = config;

  // Start HTTP server for browser communication
  await createHttpServer(httpPort, verbose);

  // Start MCP server for Claude Code communication
  const mcpServer = createMcpServer(verbose);
  const transport = new StdioServerTransport();

  await mcpServer.connect(transport);

  console.error("[agentation] MCP server connected via stdio");
  console.error("[agentation] Ready to receive annotations from browser and queries from Claude Code");
}
