/**
 * MCP server for Agentation.
 * Exposes tools for AI agents to interact with annotations.
 *
 * This server fetches data from the HTTP API (single source of truth)
 * rather than maintaining its own store.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import type { ActionRequest } from "../types.js";

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

let httpBaseUrl = "http://localhost:4747";
let apiKey: string | undefined;

/**
 * Set the HTTP server URL that this MCP server will fetch from.
 */
export function setHttpBaseUrl(url: string): void {
  httpBaseUrl = url;
}

/**
 * Set the API key for authenticating with the cloud backend.
 */
export function setApiKey(key: string): void {
  apiKey = key;
}

// -----------------------------------------------------------------------------
// HTTP Client
// -----------------------------------------------------------------------------

async function httpGet<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }
  const res = await fetch(`${httpBaseUrl}${path}`, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

async function httpPatch<T>(path: string, body: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }
  const res = await fetch(`${httpBaseUrl}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

async function httpPost<T>(path: string, body: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }
  const res = await fetch(`${httpBaseUrl}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// -----------------------------------------------------------------------------
// Tool Schemas
// -----------------------------------------------------------------------------

const GetPendingSchema = z.object({
  sessionId: z.string().describe("The session ID to get pending annotations for"),
});

const AcknowledgeSchema = z.object({
  annotationId: z.string().describe("The annotation ID to acknowledge"),
});

const ResolveSchema = z.object({
  annotationId: z.string().describe("The annotation ID to resolve"),
  summary: z.string().optional().describe("Optional summary of how it was resolved"),
});

const DismissSchema = z.object({
  annotationId: z.string().describe("The annotation ID to dismiss"),
  reason: z.string().describe("Reason for dismissing this annotation"),
});

const ReplySchema = z.object({
  annotationId: z.string().describe("The annotation ID to reply to"),
  message: z.string().describe("The reply message"),
});

const GetSessionSchema = z.object({
  sessionId: z.string().describe("The session ID to get"),
});

const WatchAnnotationsSchema = z.object({
  sessionId: z.string().optional().describe("Optional session ID to filter. If not provided, watches ALL sessions."),
  batchWindowSeconds: z.number().optional().default(10).describe("Seconds to wait after first annotation before returning batch (default: 10, max: 60)"),
  timeoutSeconds: z.number().optional().default(120).describe("Max seconds to wait for first annotation (default: 120, max: 300)"),
});

// -----------------------------------------------------------------------------
// Tool Definitions
// -----------------------------------------------------------------------------

export const TOOLS = [
  {
    name: "agentation_list_sessions",
    description: "List all active annotation sessions",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "agentation_get_session",
    description: "Get a session with all its annotations",
    inputSchema: {
      type: "object" as const,
      properties: {
        sessionId: {
          type: "string",
          description: "The session ID to get",
        },
      },
      required: ["sessionId"],
    },
  },
  {
    name: "agentation_get_pending",
    description:
      "Get all pending (unacknowledged) annotations for a session. Use this to see what feedback the human has given that needs attention.",
    inputSchema: {
      type: "object" as const,
      properties: {
        sessionId: {
          type: "string",
          description: "The session ID to get pending annotations for",
        },
      },
      required: ["sessionId"],
    },
  },
  {
    name: "agentation_get_all_pending",
    description:
      "Get all pending annotations across ALL sessions. Use this to see all unaddressed feedback from the human across all pages they've visited.",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "agentation_acknowledge",
    description:
      "Mark an annotation as acknowledged. Use this to let the human know you've seen their feedback and will address it.",
    inputSchema: {
      type: "object" as const,
      properties: {
        annotationId: {
          type: "string",
          description: "The annotation ID to acknowledge",
        },
      },
      required: ["annotationId"],
    },
  },
  {
    name: "agentation_resolve",
    description:
      "Mark an annotation as resolved. Use this after you've addressed the feedback. Optionally include a summary of what you did.",
    inputSchema: {
      type: "object" as const,
      properties: {
        annotationId: {
          type: "string",
          description: "The annotation ID to resolve",
        },
        summary: {
          type: "string",
          description: "Optional summary of how it was resolved",
        },
      },
      required: ["annotationId"],
    },
  },
  {
    name: "agentation_dismiss",
    description:
      "Dismiss an annotation. Use this when you've decided not to address the feedback, with a reason why.",
    inputSchema: {
      type: "object" as const,
      properties: {
        annotationId: {
          type: "string",
          description: "The annotation ID to dismiss",
        },
        reason: {
          type: "string",
          description: "Reason for dismissing this annotation",
        },
      },
      required: ["annotationId", "reason"],
    },
  },
  {
    name: "agentation_reply",
    description:
      "Add a reply to an annotation's thread. Use this to ask clarifying questions or provide updates to the human.",
    inputSchema: {
      type: "object" as const,
      properties: {
        annotationId: {
          type: "string",
          description: "The annotation ID to reply to",
        },
        message: {
          type: "string",
          description: "The reply message",
        },
      },
      required: ["annotationId", "message"],
    },
  },
  {
    name: "agentation_watch_annotations",
    description:
      "Block until new annotations appear, then collect a batch and return them. " +
      "Triggers automatically when annotations are created — the user just annotates in the browser " +
      "and the agent picks them up. After detecting the first new annotation, waits for a batch window " +
      "to collect more before returning. Use in a loop for hands-free processing. " +
      "After addressing each annotation, call agentation_resolve with the annotation ID and a summary " +
      "of what you did. Only resolve annotations the user accepted — if the user rejects your change, " +
      "leave the annotation open.",
    inputSchema: {
      type: "object" as const,
      properties: {
        sessionId: {
          type: "string",
          description: "Optional session ID to filter. If not provided, watches ALL sessions.",
        },
        batchWindowSeconds: {
          type: "number",
          description: "Seconds to wait after first annotation before returning batch (default: 10, max: 60)",
        },
        timeoutSeconds: {
          type: "number",
          description: "Max seconds to wait for first annotation (default: 120, max: 300)",
        },
      },
      required: [],
    },
  },
];

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Session = {
  id: string;
  url: string;
  status: string;
  createdAt: string;
};

type Annotation = {
  id: string;
  sessionId: string;
  comment: string;
  element: string;
  elementPath: string;
  url?: string;
  intent?: string;
  severity?: string;
  timestamp?: number;
  nearbyText?: string;
  reactComponents?: string;
  status: string;
};

type SessionWithAnnotations = Session & {
  annotations: Annotation[];
};

type PendingResponse = {
  count: number;
  annotations: Annotation[];
};

// -----------------------------------------------------------------------------
// Tool Handlers
// -----------------------------------------------------------------------------

type ToolResult = {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
};

export function success(data: unknown): ToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

export function error(message: string): ToolResult {
  return {
    content: [{ type: "text", text: message }],
    isError: true,
  };
}

/**
 * Result from watchForAnnotations
 */
type WatchAnnotationsResult =
  | { type: "annotations"; annotations: Annotation[]; sessions: string[] }
  | { type: "timeout" }
  | { type: "error"; message: string };

/**
 * Watch for new annotation.created events via SSE from the HTTP server.
 * When the first annotation is detected, waits for a batch window to collect
 * additional annotations directly from SSE event payloads.
 *
 * Initial sync events (sequence 0) are ignored to prevent false triggers
 * from pre-existing pending annotations when the SSE connection opens.
 *
 * Watches for new annotations via SSE and collects them into a batch.
 */
function watchForAnnotations(
  sessionId: string | undefined,
  batchWindowMs: number,
  timeoutMs: number
): Promise<WatchAnnotationsResult> {
  return new Promise((resolve) => {
    let aborted = false;
    const controller = new AbortController();
    let batchTimeout: ReturnType<typeof setTimeout> | null = null;
    const detectedSessions = new Set<string>();
    const collectedAnnotations: Annotation[] = [];

    const cleanup = () => {
      aborted = true;
      controller.abort();
      if (batchTimeout) clearTimeout(batchTimeout);
    };

    // Set overall timeout
    const timeoutId = setTimeout(() => {
      cleanup();
      resolve({ type: "timeout" });
    }, timeoutMs);

    // Connect to SSE endpoint with agent=true to be counted as an agent listener
    const sseUrl = sessionId
      ? `${httpBaseUrl}/sessions/${sessionId}/events?agent=true`
      : `${httpBaseUrl}/events?agent=true`;

    const sseHeaders: Record<string, string> = { Accept: "text/event-stream" };
    if (apiKey) {
      sseHeaders["x-api-key"] = apiKey;
    }

    fetch(sseUrl, {
      signal: controller.signal,
      headers: sseHeaders,
    })
      .then(async (res) => {
        if (!res.ok) {
          clearTimeout(timeoutId);
          cleanup();
          resolve({ type: "error", message: `HTTP server returned ${res.status}: ${res.statusText}` });
          return;
        }
        if (!res.body) {
          clearTimeout(timeoutId);
          cleanup();
          resolve({ type: "error", message: "No response body from SSE endpoint" });
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (!aborted) {
          const { done, value } = await reader.read();
          if (done) {
            if (!aborted) {
              clearTimeout(timeoutId);
              cleanup();
              if (collectedAnnotations.length > 0) {
                resolve({
                  type: "annotations",
                  annotations: collectedAnnotations,
                  sessions: Array.from(detectedSessions),
                });
              } else {
                resolve({ type: "error", message: "SSE connection closed unexpectedly. The agentation server may have restarted." });
              }
            }
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const event = JSON.parse(line.slice(6));
                if (event.type === "annotation.created") {
                  // Skip initial sync events (sequence 0) — historical replay, not new
                  if (event.sequence === 0) continue;

                  // If filtering by session, check it matches
                  if (sessionId && event.sessionId !== sessionId) continue;

                  detectedSessions.add(event.sessionId);
                  collectedAnnotations.push(event.payload as Annotation);

                  // First annotation detected — start batch window
                  if (!batchTimeout) {
                    batchTimeout = setTimeout(() => {
                      clearTimeout(timeoutId);
                      cleanup();
                      resolve({
                        type: "annotations",
                        annotations: collectedAnnotations,
                        sessions: Array.from(detectedSessions),
                      });
                    }, batchWindowMs);
                  }
                }
              } catch {
                // Ignore parse errors for individual events
              }
            }
          }
        }
      })
      .catch((err) => {
        // Connection error or aborted
        if (!aborted) {
          clearTimeout(timeoutId);
          const message = err instanceof Error ? err.message : "Unknown connection error";
          // Check for common connection errors
          if (message.includes("ECONNREFUSED") || message.includes("fetch failed")) {
            resolve({ type: "error", message: `Cannot connect to HTTP server at ${httpBaseUrl}. Is the agentation server running?` });
          } else if (message.includes("abort")) {
            // Aborted by timeout - already handled
            resolve({ type: "timeout" });
          } else {
            resolve({ type: "error", message: `Connection error: ${message}` });
          }
        }
      });
  });
}

export async function handleTool(name: string, args: unknown): Promise<ToolResult> {
  switch (name) {
    case "agentation_list_sessions": {
      const sessions = await httpGet<Session[]>("/sessions");
      return success({
        sessions: sessions.map((s) => ({
          id: s.id,
          url: s.url,
          status: s.status,
          createdAt: s.createdAt,
        })),
      });
    }

    case "agentation_get_session": {
      const { sessionId } = GetSessionSchema.parse(args);
      try {
        const session = await httpGet<SessionWithAnnotations>(`/sessions/${sessionId}`);
        return success(session);
      } catch (err) {
        if ((err as Error).message.includes("404")) {
          return error(`Session not found: ${sessionId}`);
        }
        throw err;
      }
    }

    case "agentation_get_pending": {
      const { sessionId } = GetPendingSchema.parse(args);
      const response = await httpGet<PendingResponse>(`/sessions/${sessionId}/pending`);
      return success({
        count: response.count,
        annotations: response.annotations.map((a) => ({
          id: a.id,
          comment: a.comment,
          element: a.element,
          elementPath: a.elementPath,
          url: a.url,
          intent: a.intent,
          severity: a.severity,
          timestamp: a.timestamp,
          nearbyText: a.nearbyText,
          reactComponents: a.reactComponents,
        })),
      });
    }

    case "agentation_get_all_pending": {
      const response = await httpGet<PendingResponse>("/pending");
      return success({
        count: response.count,
        annotations: response.annotations.map((a) => ({
          id: a.id,
          comment: a.comment,
          element: a.element,
          elementPath: a.elementPath,
          url: a.url,
          intent: a.intent,
          severity: a.severity,
          timestamp: a.timestamp,
          nearbyText: a.nearbyText,
          reactComponents: a.reactComponents,
        })),
      });
    }

    case "agentation_acknowledge": {
      const { annotationId } = AcknowledgeSchema.parse(args);
      try {
        await httpPatch(`/annotations/${annotationId}`, { status: "acknowledged" });
        return success({ acknowledged: true, annotationId });
      } catch (err) {
        if ((err as Error).message.includes("404")) {
          return error(`Annotation not found: ${annotationId}`);
        }
        throw err;
      }
    }

    case "agentation_resolve": {
      const { annotationId, summary } = ResolveSchema.parse(args);
      try {
        await httpPatch(`/annotations/${annotationId}`, {
          status: "resolved",
          resolvedBy: "agent",
        });
        if (summary) {
          await httpPost(`/annotations/${annotationId}/thread`, {
            role: "agent",
            content: `Resolved: ${summary}`,
          });
        }
        return success({ resolved: true, annotationId, summary });
      } catch (err) {
        if ((err as Error).message.includes("404")) {
          return error(`Annotation not found: ${annotationId}`);
        }
        throw err;
      }
    }

    case "agentation_dismiss": {
      const { annotationId, reason } = DismissSchema.parse(args);
      try {
        await httpPatch(`/annotations/${annotationId}`, {
          status: "dismissed",
          resolvedBy: "agent",
        });
        await httpPost(`/annotations/${annotationId}/thread`, {
          role: "agent",
          content: `Dismissed: ${reason}`,
        });
        return success({ dismissed: true, annotationId, reason });
      } catch (err) {
        if ((err as Error).message.includes("404")) {
          return error(`Annotation not found: ${annotationId}`);
        }
        throw err;
      }
    }

    case "agentation_reply": {
      const { annotationId, message } = ReplySchema.parse(args);
      try {
        await httpPost(`/annotations/${annotationId}/thread`, {
          role: "agent",
          content: message,
        });
        return success({ replied: true, annotationId, message });
      } catch (err) {
        if ((err as Error).message.includes("404")) {
          return error(`Annotation not found: ${annotationId}`);
        }
        throw err;
      }
    }

    case "agentation_watch_annotations": {
      const parsed = WatchAnnotationsSchema.parse(args);
      const sessionId = parsed.sessionId;
      const batchWindowSeconds = Math.min(60, Math.max(1, parsed.batchWindowSeconds ?? 10));
      const timeoutSeconds = Math.min(300, Math.max(1, parsed.timeoutSeconds ?? 120));

      // Drain: return any pending annotations immediately before blocking on SSE.
      // This catches annotations that arrived while the caller was busy processing
      // the previous batch (when watch_annotations wasn't running).
      try {
        const pendingPath = sessionId ? `/sessions/${sessionId}/pending` : "/pending";
        const pending = await httpGet<PendingResponse>(pendingPath);
        if (pending.count > 0) {
          const sessions = [...new Set(pending.annotations.map((a) => a.sessionId))];
          return success({
            timeout: false,
            count: pending.count,
            sessions,
            annotations: pending.annotations.map((a) => ({
              id: a.id,
              comment: a.comment,
              element: a.element,
              elementPath: a.elementPath,
              url: a.url,
              intent: a.intent,
              severity: a.severity,
              timestamp: a.timestamp,
              nearbyText: a.nearbyText,
              reactComponents: a.reactComponents,
            })),
          });
        }
      } catch (err) {
        console.error("[MCP] Pending drain failed, falling through to SSE watch:", err);
      }

      const result = await watchForAnnotations(
        sessionId,
        batchWindowSeconds * 1000,
        timeoutSeconds * 1000
      );

      switch (result.type) {
        case "annotations":
          return success({
            timeout: false,
            count: result.annotations.length,
            sessions: result.sessions,
            annotations: result.annotations.map((a) => ({
              id: a.id,
              comment: a.comment,
              element: a.element,
              elementPath: a.elementPath,
              url: a.url,
              intent: a.intent,
              severity: a.severity,
              timestamp: a.timestamp,
              nearbyText: a.nearbyText,
              reactComponents: a.reactComponents,
            })),
          });
        case "timeout":
          return success({
            timeout: true,
            message: `No new annotations within ${timeoutSeconds} seconds`,
          });
        case "error":
          return error(result.message);
      }
    }

    default:
      return error(`Unknown tool: ${name}`);
  }
}

// -----------------------------------------------------------------------------
// Server
// -----------------------------------------------------------------------------

/**
 * Create and start the MCP server on stdio.
 * @param baseUrl - Optional HTTP server URL to fetch from (default: http://localhost:4747)
 */
export async function startMcpServer(baseUrl?: string): Promise<void> {
  if (baseUrl) {
    setHttpBaseUrl(baseUrl);
  }

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
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      return await handleTool(name, args);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return error(message);
    }
  });

  // Connect via stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log startup message with connection details
  const isRemote = httpBaseUrl.startsWith("https://") || (!httpBaseUrl.includes("localhost") && !httpBaseUrl.includes("127.0.0.1"));
  if (isRemote && apiKey) {
    console.error(`[MCP] Agentation MCP server started on stdio (Remote: ${httpBaseUrl}, API key: configured)`);
  } else if (isRemote) {
    console.error(`[MCP] Agentation MCP server started on stdio (Remote: ${httpBaseUrl}, API key: not configured)`);
  } else {
    console.error(`[MCP] Agentation MCP server started on stdio (HTTP: ${httpBaseUrl})`);
  }
}
