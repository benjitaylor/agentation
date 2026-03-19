// =============================================================================
// Server Sync Utilities
// =============================================================================
//
// Optional server synchronization for the Agentation protocol.
// When an endpoint is provided, annotations sync to a server.
// Falls back gracefully to local-only mode on network errors.
//

import type { Annotation, Session, SessionWithAnnotations } from "../types";

/**
 * List all sessions from the server.
 */
export async function listSessions(endpoint: string): Promise<Session[]> {
  const response = await fetch(`${endpoint}/sessions`);
  if (!response.ok) {
    throw new Error(`Failed to list sessions: ${response.status}`);
  }
  return response.json();
}

/**
 * Create a new session on the server.
 */
export async function createSession(
  endpoint: string,
  url: string
): Promise<Session> {
  const response = await fetch(`${endpoint}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.status}`);
  }

  return response.json();
}

/**
 * Get an existing session with its annotations.
 */
export async function getSession(
  endpoint: string,
  sessionId: string
): Promise<SessionWithAnnotations> {
  const response = await fetch(`${endpoint}/sessions/${sessionId}`);

  if (!response.ok) {
    throw new Error(`Failed to get session: ${response.status}`);
  }

  return response.json();
}

/**
 * Sync a new annotation to the server.
 * Returns the annotation with any server-assigned fields.
 */
export async function syncAnnotation(
  endpoint: string,
  sessionId: string,
  annotation: Annotation
): Promise<Annotation> {
  const response = await fetch(`${endpoint}/sessions/${sessionId}/annotations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(annotation),
  });

  if (!response.ok) {
    throw new Error(`Failed to sync annotation: ${response.status}`);
  }

  return response.json();
}

/**
 * Update an annotation on the server.
 */
export async function updateAnnotation(
  endpoint: string,
  annotationId: string,
  data: Partial<Annotation>
): Promise<Annotation> {
  const response = await fetch(`${endpoint}/annotations/${annotationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update annotation: ${response.status}`);
  }

  return response.json();
}

/**
 * Delete an annotation from the server.
 */
export async function deleteAnnotation(
  endpoint: string,
  annotationId: string
): Promise<void> {
  const response = await fetch(`${endpoint}/annotations/${annotationId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete annotation: ${response.status}`);
  }
}

export type ActionResponse = {
  success: boolean;
  annotationCount: number;
  delivered: {
    sseListeners: number;
    webhooks: number;
    total: number;
  };
};

/**
 * Request the agent to act on annotations.
 * Emits an action.requested event via SSE to notify connected agents.
 * Returns delivery info so the UI can show accurate feedback.
 */
export async function requestAction(
  endpoint: string,
  sessionId: string,
  output: string
): Promise<ActionResponse> {
  const response = await fetch(`${endpoint}/sessions/${sessionId}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ output }),
  });

  if (!response.ok) {
    throw new Error(`Failed to request action: ${response.status}`);
  }

  return response.json();
}
