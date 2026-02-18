/**
 * HTTP server for the Agentation API.
 * Uses native Node.js http module - no frameworks.
 */

import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TOOLS, handleTool, error as toolError } from "./mcp.js";
import {
  createSession,
  getSession,
  getSessionWithAnnotations,
  addAnnotation,
  updateAnnotation,
  getAnnotation,
  deleteAnnotation,
  listSessions,
  getPendingAnnotations,
  addThreadMessage,
  getEventsSince,
} from "./store.js";
import { eventBus } from "./events.js";
import type { Annotation, AFSEvent, ActionRequest } from "../types.js";

/**
 * Log to stderr so diagnostic output never corrupts the MCP stdio channel.
 * When `server` runs without --mcp-only, both the HTTP server and MCP stdio
 * server share the same process. stdout is reserved for JSON-RPC messages,
 * so all logging must go to stderr.
 */
function log(message: string): void {
  process.stderr.write(message + "\n");
}

// Cloud API configuration
let cloudApiKey: string | undefined;
const CLOUD_API_URL = "https://agentation-mcp-cloud.vercel.app/api";

/**
 * Set the API key for cloud storage mode.
 * When set, the HTTP server proxies requests to the cloud API.
 */
export function setCloudApiKey(key: string | undefined): void {
  cloudApiKey = key;
}

/**
 * Check if we're in cloud mode (API key is set).
 */
function isCloudMode(): boolean {
  return !!cloudApiKey;
}

// Track active SSE connections for cleanup
const sseConnections = new Set<ServerResponse>();
// Track agent SSE connections separately (for accurate delivery status)
// These are connections from MCP tools (e.g. watch_annotations), not browser toolbars
const agentConnections = new Set<ServerResponse>();

// -----------------------------------------------------------------------------
// MCP HTTP Transport
// -----------------------------------------------------------------------------

// Store transports by session ID for stateful sessions
const mcpTransports = new Map<string, StreamableHTTPServerTransport>();

/**
 * Initialize a new MCP server with HTTP transport for a session.
 */
function createMcpSession(): { server: Server; transport: StreamableHTTPServerTransport } {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });

  const server = new Server(
    { name: "agentation", version: "0.0.1" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));
  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    try {
      return await handleTool(req.params.name, req.params.arguments);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return toolError(message);
    }
  });

  server.connect(transport);
  return { server, transport };
}

// -----------------------------------------------------------------------------
// Webhook Support
// -----------------------------------------------------------------------------

/**
 * Get configured webhook URLs from environment variables.
 *
 * Supports:
 * - AGENTATION_WEBHOOK_URL: Single webhook URL
 * - AGENTATION_WEBHOOKS: Comma-separated list of webhook URLs
 */
function getWebhookUrls(): string[] {
  const urls: string[] = [];

  // Single webhook URL
  const singleUrl = process.env.AGENTATION_WEBHOOK_URL;
  if (singleUrl) {
    urls.push(singleUrl.trim());
  }

  // Multiple webhook URLs (comma-separated)
  const multipleUrls = process.env.AGENTATION_WEBHOOKS;
  if (multipleUrls) {
    const parsed = multipleUrls
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);
    urls.push(...parsed);
  }

  return urls;
}

/**
 * Send webhook notification for an action request.
 * Fire-and-forget: doesn't wait for response, logs errors but doesn't throw.
 */
function sendWebhooks(actionRequest: ActionRequest): void {
  const webhookUrls = getWebhookUrls();

  if (webhookUrls.length === 0) {
    return;
  }

  const payload = JSON.stringify(actionRequest);

  for (const url of webhookUrls) {
    // Fire and forget - use .then().catch() instead of await
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Agentation-Webhook/1.0",
      },
      body: payload,
    })
      .then((res) => {
        log(
          `[Webhook] POST ${url} -> ${res.status} ${res.statusText}`
        );
      })
      .catch((err) => {
        console.error(`[Webhook] POST ${url} failed:`, (err as Error).message);
      });
  }

  log(
    `[Webhook] Fired ${webhookUrls.length} webhook(s) for session ${actionRequest.sessionId}`
  );
}

// -----------------------------------------------------------------------------
// Request Helpers
// -----------------------------------------------------------------------------

/**
 * Parse JSON body from request.
 */
async function parseBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

/**
 * Send JSON response.
 */
function sendJson(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

/**
 * Send error response.
 */
function sendError(res: ServerResponse, status: number, message: string): void {
  sendJson(res, status, { error: message });
}

/**
 * Handle CORS preflight.
 */
function handleCors(res: ServerResponse): void {
  res.writeHead(204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id",
    "Access-Control-Expose-Headers": "Mcp-Session-Id",
    "Access-Control-Max-Age": "86400",
  });
  res.end();
}

// -----------------------------------------------------------------------------
// Cloud Proxy
// -----------------------------------------------------------------------------

/**
 * Proxy a request to the cloud API.
 */
async function proxyToCloud(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string
): Promise<void> {
  const method = req.method || "GET";
  const cloudUrl = `${CLOUD_API_URL}${pathname}`;

  const headers: Record<string, string> = {
    "x-api-key": cloudApiKey!,
  };

  // Forward content-type for requests with body
  if (req.headers["content-type"]) {
    headers["Content-Type"] = req.headers["content-type"];
  }

  let body: string | undefined;
  if (method !== "GET" && method !== "HEAD") {
    body = await new Promise<string>((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => resolve(data));
      req.on("error", reject);
    });
  }

  try {
    const cloudRes = await fetch(cloudUrl, {
      method,
      headers,
      body,
    });

    // Handle SSE responses
    if (cloudRes.headers.get("content-type")?.includes("text/event-stream")) {
      res.writeHead(cloudRes.status, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      });

      const reader = cloudRes.body?.getReader();
      if (reader) {
        const pump = async () => {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        };
        pump().catch(() => res.end());

        req.on("close", () => {
          reader.cancel();
        });
      }
      return;
    }

    // Handle regular JSON responses
    const data = await cloudRes.text();
    res.writeHead(cloudRes.status, {
      "Content-Type": cloudRes.headers.get("content-type") || "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end(data);
  } catch (err) {
    console.error("[Cloud Proxy] Error:", err);
    sendError(res, 502, `Cloud proxy error: ${(err as Error).message}`);
  }
}

// -----------------------------------------------------------------------------
// Route Handlers
// -----------------------------------------------------------------------------

type RouteHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  params: Record<string, string>
) => Promise<void>;

/**
 * POST /sessions - Create a new session.
 */
const createSessionHandler: RouteHandler = async (req, res) => {
  try {
    const body = await parseBody<{ url: string; projectId?: string }>(req);

    if (!body.url) {
      return sendError(res, 400, "url is required");
    }

    const session = createSession(body.url, body.projectId);
    sendJson(res, 201, session);
  } catch (err) {
    sendError(res, 400, (err as Error).message);
  }
};

/**
 * GET /sessions - List all sessions.
 */
const listSessionsHandler: RouteHandler = async (_req, res) => {
  const sessions = listSessions();
  sendJson(res, 200, sessions);
};

/**
 * GET /sessions/:id - Get a session with annotations.
 */
const getSessionHandler: RouteHandler = async (_req, res, params) => {
  const session = getSessionWithAnnotations(params.id);

  if (!session) {
    return sendError(res, 404, "Session not found");
  }

  sendJson(res, 200, session);
};

/**
 * POST /sessions/:id/annotations - Add annotation to session.
 */
const addAnnotationHandler: RouteHandler = async (req, res, params) => {
  try {
    const body = await parseBody<Omit<Annotation, "id" | "sessionId" | "status" | "createdAt">>(req);

    if (!body.comment || !body.element || !body.elementPath) {
      return sendError(res, 400, "comment, element, and elementPath are required");
    }

    const annotation = addAnnotation(params.id, body);

    if (!annotation) {
      return sendError(res, 404, "Session not found");
    }

    sendJson(res, 201, annotation);
  } catch (err) {
    sendError(res, 400, (err as Error).message);
  }
};

/**
 * PATCH /annotations/:id - Update an annotation.
 */
const updateAnnotationHandler: RouteHandler = async (req, res, params) => {
  try {
    const body = await parseBody<Partial<Annotation>>(req);

    // Check if annotation exists
    const existing = getAnnotation(params.id);
    if (!existing) {
      return sendError(res, 404, "Annotation not found");
    }

    const annotation = updateAnnotation(params.id, body);
    sendJson(res, 200, annotation);
  } catch (err) {
    sendError(res, 400, (err as Error).message);
  }
};

/**
 * GET /annotations/:id - Get an annotation.
 */
const getAnnotationHandler: RouteHandler = async (_req, res, params) => {
  const annotation = getAnnotation(params.id);

  if (!annotation) {
    return sendError(res, 404, "Annotation not found");
  }

  sendJson(res, 200, annotation);
};

/**
 * DELETE /annotations/:id - Delete an annotation.
 */
const deleteAnnotationHandler: RouteHandler = async (_req, res, params) => {
  const annotation = deleteAnnotation(params.id);

  if (!annotation) {
    return sendError(res, 404, "Annotation not found");
  }

  sendJson(res, 200, { deleted: true, annotationId: params.id });
};

/**
 * GET /sessions/:id/pending - Get pending annotations for a session.
 */
const getPendingHandler: RouteHandler = async (_req, res, params) => {
  const pending = getPendingAnnotations(params.id);
  sendJson(res, 200, { count: pending.length, annotations: pending });
};

/**
 * GET /pending - Get all pending annotations across all sessions.
 */
const getAllPendingHandler: RouteHandler = async (_req, res) => {
  const sessions = listSessions();
  const allPending = sessions.flatMap((session) => getPendingAnnotations(session.id));
  sendJson(res, 200, { count: allPending.length, annotations: allPending });
};

/**
 * POST /sessions/:id/action - Request agent action on annotations.
 *
 * Emits an action.requested event via SSE with the current annotations
 * and formatted output. The agent can listen for this event to know
 * when the user wants action taken.
 *
 * Also sends webhooks to configured URLs (via AGENTATION_WEBHOOK_URL or
 * AGENTATION_WEBHOOKS environment variables).
 */
const requestActionHandler: RouteHandler = async (req, res, params) => {
  try {
    const sessionId = params.id;
    const body = await parseBody<{ output: string }>(req);

    // Verify session exists
    const session = getSessionWithAnnotations(sessionId);
    if (!session) {
      return sendError(res, 404, "Session not found");
    }

    if (!body.output) {
      return sendError(res, 400, "output is required");
    }

    // Build action request payload
    const actionRequest: ActionRequest = {
      sessionId,
      annotations: session.annotations,
      output: body.output,
      timestamp: new Date().toISOString(),
    };

    // Emit event (will be sent to all SSE subscribers)
    eventBus.emit("action.requested", sessionId, actionRequest);

    // Send webhooks (fire and forget, non-blocking)
    const webhookUrls = getWebhookUrls();
    sendWebhooks(actionRequest);

    // Return delivery info so client knows if anyone received it
    // Only count agent connections (with ?agent=true), not browser toolbar connections
    const agentListeners = agentConnections.size;
    const webhooks = webhookUrls.length;

    sendJson(res, 200, {
      success: true,
      annotationCount: session.annotations.length,
      delivered: {
        sseListeners: agentListeners,
        webhooks: webhooks,
        total: agentListeners + webhooks,
      },
    });
  } catch (err) {
    sendError(res, 400, (err as Error).message);
  }
};

/**
 * POST /annotations/:id/thread - Add a thread message.
 */
const addThreadHandler: RouteHandler = async (req, res, params) => {
  try {
    const body = await parseBody<{ role: "human" | "agent"; content: string }>(req);

    if (!body.role || !body.content) {
      return sendError(res, 400, "role and content are required");
    }

    const annotation = addThreadMessage(params.id, body.role, body.content);

    if (!annotation) {
      return sendError(res, 404, "Annotation not found");
    }

    sendJson(res, 201, annotation);
  } catch (err) {
    sendError(res, 400, (err as Error).message);
  }
};

/**
 * GET /sessions/:id/events - SSE stream of events for a session.
 *
 * Supports reconnection via Last-Event-ID header.
 * Events are streamed in real-time as they occur.
 */
const sseHandler: RouteHandler = async (req, res, params) => {
  const sessionId = params.id;
  const url = new URL(req.url || "/", "http://localhost");
  const isAgent = url.searchParams.get("agent") === "true";

  // Verify session exists
  const session = getSessionWithAnnotations(sessionId);
  if (!session) {
    return sendError(res, 404, "Session not found");
  }

  // Set up SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  // Track this connection
  sseConnections.add(res);
  if (isAgent) {
    agentConnections.add(res);
  }

  // Send initial comment to establish connection
  res.write(": connected\n\n");

  // Check for Last-Event-ID for replay
  const lastEventId = req.headers["last-event-id"];
  if (lastEventId) {
    const lastSequence = parseInt(lastEventId as string, 10);
    if (!isNaN(lastSequence)) {
      // Replay missed events
      const missedEvents = getEventsSince(sessionId, lastSequence);
      for (const event of missedEvents) {
        sendSSEEvent(res, event);
      }
    }
  }

  // Subscribe to new events
  const unsubscribe = eventBus.subscribeToSession(sessionId, (event: AFSEvent) => {
    sendSSEEvent(res, event);
  });

  // Keep connection alive with periodic comments
  const keepAlive = setInterval(() => {
    res.write(": ping\n\n");
  }, 30000);

  // Clean up on disconnect
  req.on("close", () => {
    clearInterval(keepAlive);
    unsubscribe();
    sseConnections.delete(res);
    agentConnections.delete(res);
  });
};

/**
 * Send an SSE event to a response stream.
 */
function sendSSEEvent(res: ServerResponse, event: AFSEvent): void {
  res.write(`event: ${event.type}\n`);
  res.write(`id: ${event.sequence}\n`);
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

/**
 * GET /events - Global SSE stream.
 *
 * Optionally filter by domain: GET /events?domain=example.com
 * Without domain, streams ALL events across all sessions.
 * Useful for agents that need to track feedback across page navigations.
 */
const globalSseHandler: RouteHandler = async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  const domain = url.searchParams.get("domain");
  const isAgent = url.searchParams.get("agent") === "true";

  // Set up SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  // Track this connection
  sseConnections.add(res);
  if (isAgent) {
    agentConnections.add(res);
  }

  // Send initial comment to establish connection
  res.write(`: connected${domain ? ` to domain ${domain}` : ""}\n\n`);

  // Send all pending annotations on connect (initial sync for agents)
  if (isAgent) {
    let syncCount = 0;
    const sessions = listSessions();
    for (const session of sessions) {
      try {
        // If domain is specified, filter by it; otherwise include all sessions
        if (domain) {
          const sessionHost = new URL(session.url).host;
          if (sessionHost !== domain) continue;
        }
        const pending = getPendingAnnotations(session.id);
        for (const annotation of pending) {
          // Send as annotation.created events so agents see existing annotations
          // Use sequence 0 for initial sync events (they're historical, not new)
          sendSSEEvent(res, {
            type: "annotation.created",
            sessionId: session.id,
            timestamp: annotation.createdAt || new Date().toISOString(),
            sequence: 0,
            payload: annotation,
          });
          syncCount++;
        }
      } catch {
        // Invalid URL, skip
      }
    }
    // Send a sync.complete event so agents know initial sync is done
    res.write(`event: sync.complete\ndata: ${JSON.stringify({ domain: domain ?? "all", count: syncCount, timestamp: new Date().toISOString() })}\n\n`);
  }

  // Subscribe to all events, optionally filter by domain
  const unsubscribe = eventBus.subscribe((event: AFSEvent) => {
    if (!domain) {
      // No domain filter -- stream all events
      sendSSEEvent(res, event);
      return;
    }
    const session = getSession(event.sessionId);
    if (session) {
      try {
        const sessionHost = new URL(session.url).host;
        if (sessionHost === domain) {
          sendSSEEvent(res, event);
        }
      } catch {
        // Invalid URL, skip
      }
    }
  });

  // Keep connection alive with periodic comments
  const keepAlive = setInterval(() => {
    res.write(": ping\n\n");
  }, 30000);

  // Clean up on disconnect
  req.on("close", () => {
    clearInterval(keepAlive);
    unsubscribe();
    sseConnections.delete(res);
    agentConnections.delete(res);
  });
};

/**
 * Handle MCP protocol requests at /mcp endpoint.
 * Supports POST (requests), GET (SSE stream), and DELETE (session cleanup).
 */
async function handleMcp(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const method = req.method || "GET";
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  // Add CORS headers to all responses
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Mcp-Session-Id");
  res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

  // POST: Handle JSON-RPC requests
  if (method === "POST") {
    let transport: StreamableHTTPServerTransport;

    if (sessionId) {
      // Session ID provided - must exist in our map
      if (!mcpTransports.has(sessionId)) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32000, message: "Session not found. Please re-initialize." },
          id: null
        }));
        return;
      }
      transport = mcpTransports.get(sessionId)!;
    } else {
      // No session ID - this should be an initialize request, create new session
      const { transport: newTransport } = createMcpSession();
      transport = newTransport;
    }

    try {
      // Read the request body
      const body = await new Promise<string>((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(data));
        req.on("error", reject);
      });

      const parsedBody = body ? JSON.parse(body) : undefined;

      // Handle the request through the transport (it writes directly to res)
      await transport.handleRequest(req, res, parsedBody);

      // Store the transport with its session ID after the request is handled (for new sessions)
      const newSessionId = transport.sessionId;
      if (newSessionId && !mcpTransports.has(newSessionId)) {
        mcpTransports.set(newSessionId, transport);
        log(`[MCP HTTP] New session created: ${newSessionId}`);
      }
    } catch (err) {
      console.error("[MCP HTTP] Error handling request:", err);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    }
    return;
  }

  // GET: SSE stream for notifications
  if (method === "GET") {
    if (!sessionId || !mcpTransports.has(sessionId)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing or invalid Mcp-Session-Id" }));
      return;
    }

    const transport = mcpTransports.get(sessionId)!;

    try {
      // Handle the SSE request (transport writes directly to res)
      await transport.handleRequest(req, res);
    } catch (err) {
      console.error("[MCP HTTP] Error handling SSE:", err);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal server error" }));
      }
    }
    return;
  }

  // DELETE: Session cleanup
  if (method === "DELETE") {
    if (sessionId && mcpTransports.has(sessionId)) {
      const transport = mcpTransports.get(sessionId)!;
      await transport.close();
      mcpTransports.delete(sessionId);
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Session not found" }));
    }
    return;
  }

  // Method not allowed
  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Method not allowed" }));
}

// -----------------------------------------------------------------------------
// Router
// -----------------------------------------------------------------------------

type Route = {
  method: string;
  pattern: RegExp;
  handler: RouteHandler;
  paramNames: string[];
};

const routes: Route[] = [
  {
    method: "GET",
    pattern: /^\/events$/,
    handler: globalSseHandler,
    paramNames: [],
  },
  {
    method: "GET",
    pattern: /^\/pending$/,
    handler: getAllPendingHandler,
    paramNames: [],
  },
  {
    method: "GET",
    pattern: /^\/sessions$/,
    handler: listSessionsHandler,
    paramNames: [],
  },
  {
    method: "POST",
    pattern: /^\/sessions$/,
    handler: createSessionHandler,
    paramNames: [],
  },
  {
    method: "GET",
    pattern: /^\/sessions\/([^/]+)$/,
    handler: getSessionHandler,
    paramNames: ["id"],
  },
  {
    method: "GET",
    pattern: /^\/sessions\/([^/]+)\/events$/,
    handler: sseHandler,
    paramNames: ["id"],
  },
  {
    method: "GET",
    pattern: /^\/sessions\/([^/]+)\/pending$/,
    handler: getPendingHandler,
    paramNames: ["id"],
  },
  {
    method: "POST",
    pattern: /^\/sessions\/([^/]+)\/action$/,
    handler: requestActionHandler,
    paramNames: ["id"],
  },
  {
    method: "POST",
    pattern: /^\/sessions\/([^/]+)\/annotations$/,
    handler: addAnnotationHandler,
    paramNames: ["id"],
  },
  {
    method: "PATCH",
    pattern: /^\/annotations\/([^/]+)$/,
    handler: updateAnnotationHandler,
    paramNames: ["id"],
  },
  {
    method: "GET",
    pattern: /^\/annotations\/([^/]+)$/,
    handler: getAnnotationHandler,
    paramNames: ["id"],
  },
  {
    method: "DELETE",
    pattern: /^\/annotations\/([^/]+)$/,
    handler: deleteAnnotationHandler,
    paramNames: ["id"],
  },
  {
    method: "POST",
    pattern: /^\/annotations\/([^/]+)\/thread$/,
    handler: addThreadHandler,
    paramNames: ["id"],
  },
];

/**
 * Match a request to a route.
 */
function matchRoute(
  method: string,
  pathname: string
): { handler: RouteHandler; params: Record<string, string> } | null {
  for (const route of routes) {
    if (route.method !== method) continue;

    const match = pathname.match(route.pattern);
    if (match) {
      const params: Record<string, string> = {};
      route.paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { handler: route.handler, params };
    }
  }
  return null;
}

// -----------------------------------------------------------------------------
// Server
// -----------------------------------------------------------------------------

/**
 * Create and start the HTTP server.
 * @param port - Port to listen on
 * @param apiKey - Optional API key for cloud storage mode
 */
export function startHttpServer(port: number, apiKey?: string): void {
  // Set cloud mode if API key provided
  if (apiKey) {
    setCloudApiKey(apiKey);
  }

  const server = createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://localhost:${port}`);
    const pathname = url.pathname;
    const method = req.method || "GET";

    // Log all requests for debugging
    if (method !== "OPTIONS" && pathname !== "/health") {
      log(`[HTTP] ${method} ${pathname}`);
    }

    // Handle CORS preflight
    if (method === "OPTIONS") {
      return handleCors(res);
    }

    // Health check (always local)
    if (pathname === "/health" && method === "GET") {
      return sendJson(res, 200, { status: "ok", mode: isCloudMode() ? "cloud" : "local" });
    }

    // Status endpoint (always local)
    if (pathname === "/status" && method === "GET") {
      const webhookUrls = getWebhookUrls();
      return sendJson(res, 200, {
        mode: isCloudMode() ? "cloud" : "local",
        webhooksConfigured: webhookUrls.length > 0,
        webhookCount: webhookUrls.length,
        activeListeners: sseConnections.size,
        agentListeners: agentConnections.size,
      });
    }

    // MCP protocol endpoint (always local - allows Claude Code to connect)
    if (pathname === "/mcp") {
      return handleMcp(req, res);
    }

    // Cloud mode: proxy all other requests to cloud API
    if (isCloudMode()) {
      return proxyToCloud(req, res, pathname + url.search);
    }

    // Local mode: use local store
    const match = matchRoute(method, pathname);
    if (!match) {
      return sendError(res, 404, "Not found");
    }

    try {
      await match.handler(req, res, match.params);
    } catch (err) {
      console.error("Request error:", err);
      sendError(res, 500, "Internal server error");
    }
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      log(`[HTTP] Port ${port} already in use — skipping HTTP server (MCP stdio still active)`);
    } else {
      log(`[HTTP] Server error: ${err.message}`);
    }
  });

  server.listen(port, () => {
    if (isCloudMode()) {
      log(`[HTTP] Agentation server listening on http://localhost:${port} (cloud mode)`);
    } else {
      log(`[HTTP] Agentation server listening on http://localhost:${port}`);
    }
  });
}
