/**
 * Store module - provides persistence for sessions and annotations.
 *
 * By default uses SQLite (~/.agentation/store.db).
 * Falls back to in-memory storage if SQLite fails to initialize.
 *
 * Usage:
 *   import { store } from './store.js';
 *   const session = store.createSession('http://localhost:3000');
 */

import type {
  AFSStore,
  AFSEvent,
  Session,
  SessionStatus,
  SessionWithAnnotations,
  Annotation,
  AnnotationStatus,
  ThreadMessage,
} from "../types.js";
import { eventBus } from "./events.js";

// -----------------------------------------------------------------------------
// Store Singleton
// -----------------------------------------------------------------------------

let _store: AFSStore | null = null;

/**
 * Get the store instance. Lazily initializes on first access.
 */
export function getStore(): AFSStore {
  if (!_store) {
    _store = initializeStore();
  }
  return _store;
}

/**
 * Initialize the store. Tries SQLite first, falls back to in-memory.
 */
function initializeStore(): AFSStore {
  // Check if we should use in-memory only
  if (process.env.AGENTATION_STORE === "memory") {
    process.stderr.write("[Store] Using in-memory store (AGENTATION_STORE=memory)\n");
    return createMemoryStore();
  }

  try {
    // Dynamic import to avoid issues if better-sqlite3 isn't available
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createSQLiteStore } = require("./sqlite.js");
    const store = createSQLiteStore();
    process.stderr.write("[Store] Using SQLite store (~/.agentation/store.db)\n");
    return store;
  } catch (err) {
    console.warn("[Store] SQLite unavailable, falling back to in-memory:", (err as Error).message);
    return createMemoryStore();
  }
}

// -----------------------------------------------------------------------------
// In-Memory Store (fallback)
// -----------------------------------------------------------------------------

function createMemoryStore(): AFSStore {
  const sessions = new Map<string, Session>();
  const annotations = new Map<string, Annotation>();
  const events: AFSEvent[] = [];

  function generateId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  return {
    createSession(url: string, projectId?: string): Session {
      const session: Session = {
        id: generateId(),
        url,
        status: "active",
        createdAt: new Date().toISOString(),
        projectId,
      };
      sessions.set(session.id, session);

      const event = eventBus.emit("session.created", session.id, session);
      events.push(event);

      return session;
    },

    getSession(id: string): Session | undefined {
      return sessions.get(id);
    },

    getSessionWithAnnotations(id: string): SessionWithAnnotations | undefined {
      const session = sessions.get(id);
      if (!session) return undefined;

      const sessionAnnotations = Array.from(annotations.values()).filter(
        (a) => a.sessionId === id
      );

      return {
        ...session,
        annotations: sessionAnnotations,
      };
    },

    updateSessionStatus(id: string, status: SessionStatus): Session | undefined {
      const session = sessions.get(id);
      if (!session) return undefined;

      session.status = status;
      session.updatedAt = new Date().toISOString();

      const eventType = status === "closed" ? "session.closed" : "session.updated";
      const event = eventBus.emit(eventType, id, session);
      events.push(event);

      return session;
    },

    listSessions(): Session[] {
      return Array.from(sessions.values());
    },

    addAnnotation(
      sessionId: string,
      data: Omit<Annotation, "id" | "sessionId" | "status" | "createdAt">
    ): Annotation | undefined {
      const session = sessions.get(sessionId);
      if (!session) return undefined;

      const annotation: Annotation = {
        ...data,
        id: generateId(),
        sessionId,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      annotations.set(annotation.id, annotation);

      const event = eventBus.emit("annotation.created", sessionId, annotation);
      events.push(event);

      return annotation;
    },

    getAnnotation(id: string): Annotation | undefined {
      return annotations.get(id);
    },

    updateAnnotation(
      id: string,
      data: Partial<Omit<Annotation, "id" | "sessionId" | "createdAt">>
    ): Annotation | undefined {
      const annotation = annotations.get(id);
      if (!annotation) return undefined;

      Object.assign(annotation, data, { updatedAt: new Date().toISOString() });

      if (annotation.sessionId) {
        const event = eventBus.emit("annotation.updated", annotation.sessionId, annotation);
        events.push(event);
      }

      return annotation;
    },

    updateAnnotationStatus(
      id: string,
      status: AnnotationStatus,
      resolvedBy?: "human" | "agent"
    ): Annotation | undefined {
      const annotation = annotations.get(id);
      if (!annotation) return undefined;

      annotation.status = status;
      annotation.updatedAt = new Date().toISOString();

      if (status === "resolved" || status === "dismissed") {
        annotation.resolvedAt = new Date().toISOString();
        annotation.resolvedBy = resolvedBy || "agent";
      }

      if (annotation.sessionId) {
        const event = eventBus.emit("annotation.updated", annotation.sessionId, annotation);
        events.push(event);
      }

      return annotation;
    },

    addThreadMessage(
      annotationId: string,
      role: "human" | "agent",
      content: string
    ): Annotation | undefined {
      const annotation = annotations.get(annotationId);
      if (!annotation) return undefined;

      const message: ThreadMessage = {
        id: generateId(),
        role,
        content,
        timestamp: Date.now(),
      };

      if (!annotation.thread) {
        annotation.thread = [];
      }
      annotation.thread.push(message);
      annotation.updatedAt = new Date().toISOString();

      if (annotation.sessionId) {
        const event = eventBus.emit("thread.message", annotation.sessionId, message);
        events.push(event);
      }

      return annotation;
    },

    getPendingAnnotations(sessionId: string): Annotation[] {
      return Array.from(annotations.values()).filter(
        (a) => a.sessionId === sessionId && a.status === "pending"
      );
    },

    getSessionAnnotations(sessionId: string): Annotation[] {
      return Array.from(annotations.values()).filter(
        (a) => a.sessionId === sessionId
      );
    },

    deleteAnnotation(id: string): Annotation | undefined {
      const annotation = annotations.get(id);
      if (!annotation) return undefined;

      annotations.delete(id);

      if (annotation.sessionId) {
        const event = eventBus.emit("annotation.deleted", annotation.sessionId, annotation);
        events.push(event);
      }

      return annotation;
    },

    getEventsSince(sessionId: string, sequence: number): AFSEvent[] {
      return events.filter(
        (e) => e.sessionId === sessionId && e.sequence > sequence
      );
    },

    close(): void {
      sessions.clear();
      annotations.clear();
      events.length = 0;
    },
  };
}

// -----------------------------------------------------------------------------
// Convenience Exports (delegate to singleton)
// -----------------------------------------------------------------------------

export const store = {
  get instance() {
    return getStore();
  },
};

// Direct function exports for backwards compatibility
export function createSession(url: string, projectId?: string): Session {
  return getStore().createSession(url, projectId);
}

export function getSession(id: string): Session | undefined {
  return getStore().getSession(id);
}

export function getSessionWithAnnotations(id: string): SessionWithAnnotations | undefined {
  return getStore().getSessionWithAnnotations(id);
}

export function updateSessionStatus(id: string, status: SessionStatus): Session | undefined {
  return getStore().updateSessionStatus(id, status);
}

export function listSessions(): Session[] {
  return getStore().listSessions();
}

export function addAnnotation(
  sessionId: string,
  data: Omit<Annotation, "id" | "sessionId" | "status" | "createdAt">
): Annotation | undefined {
  return getStore().addAnnotation(sessionId, data);
}

export function getAnnotation(id: string): Annotation | undefined {
  return getStore().getAnnotation(id);
}

export function updateAnnotation(
  id: string,
  data: Partial<Omit<Annotation, "id" | "sessionId" | "createdAt">>
): Annotation | undefined {
  return getStore().updateAnnotation(id, data);
}

export function updateAnnotationStatus(
  id: string,
  status: AnnotationStatus,
  resolvedBy?: "human" | "agent"
): Annotation | undefined {
  return getStore().updateAnnotationStatus(id, status, resolvedBy);
}

export function addThreadMessage(
  annotationId: string,
  role: "human" | "agent",
  content: string
): Annotation | undefined {
  return getStore().addThreadMessage(annotationId, role, content);
}

export function getPendingAnnotations(sessionId: string): Annotation[] {
  return getStore().getPendingAnnotations(sessionId);
}

export function getSessionAnnotations(sessionId: string): Annotation[] {
  return getStore().getSessionAnnotations(sessionId);
}

export function deleteAnnotation(id: string): Annotation | undefined {
  return getStore().deleteAnnotation(id);
}

export function getEventsSince(sessionId: string, sequence: number): AFSEvent[] {
  return getStore().getEventsSince(sessionId, sequence);
}

/**
 * Clear all data and reset the store.
 */
export function clearAll(): void {
  getStore().close();
  _store = null;
}
