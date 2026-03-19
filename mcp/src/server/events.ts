/**
 * EventBus for real-time event distribution.
 * Coordinates SSE streams, MCP notifications, and future webhooks.
 */

import type { AFSEvent, AFSEventType, Annotation, Session, ThreadMessage, ActionRequest } from "../types.js";

type EventHandler = (event: AFSEvent) => void;

// Global sequence counter for event ordering
let globalSequence = 0;

/**
 * Simple pub/sub event bus for AFS events.
 */
class EventBus {
  private handlers = new Set<EventHandler>();
  private sessionHandlers = new Map<string, Set<EventHandler>>();

  /**
   * Subscribe to all events.
   */
  subscribe(handler: EventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  /**
   * Subscribe to events for a specific session.
   */
  subscribeToSession(sessionId: string, handler: EventHandler): () => void {
    if (!this.sessionHandlers.has(sessionId)) {
      this.sessionHandlers.set(sessionId, new Set());
    }
    this.sessionHandlers.get(sessionId)!.add(handler);

    return () => {
      const handlers = this.sessionHandlers.get(sessionId);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.sessionHandlers.delete(sessionId);
        }
      }
    };
  }

  /**
   * Emit an event to all subscribers.
   */
  emit(
    type: AFSEventType,
    sessionId: string,
    payload: Annotation | Session | ThreadMessage | ActionRequest
  ): AFSEvent {
    const event: AFSEvent = {
      type,
      timestamp: new Date().toISOString(),
      sessionId,
      sequence: ++globalSequence,
      payload,
    };

    // Notify global subscribers
    for (const handler of this.handlers) {
      try {
        handler(event);
      } catch (err) {
        console.error("[EventBus] Handler error:", err);
      }
    }

    // Notify session-specific subscribers
    const sessionHandlers = this.sessionHandlers.get(sessionId);
    if (sessionHandlers) {
      for (const handler of sessionHandlers) {
        try {
          handler(event);
        } catch (err) {
          console.error("[EventBus] Session handler error:", err);
        }
      }
    }

    return event;
  }

  /**
   * Get current sequence number (for reconnect logic).
   */
  getSequence(): number {
    return globalSequence;
  }

  /**
   * Set sequence from persisted state (for server restart).
   */
  setSequence(seq: number): void {
    globalSequence = seq;
  }
}

// Singleton instance
export const eventBus = new EventBus();

// -----------------------------------------------------------------------------
// User-Scoped Event Bus
// -----------------------------------------------------------------------------

/**
 * User-scoped event bus that filters events by user ID.
 * Prevents data leakage between users in multi-tenant environments.
 */
class UserEventBus {
  private userHandlers = new Map<string, Set<EventHandler>>();
  private userSessionHandlers = new Map<string, Map<string, Set<EventHandler>>>();

  /**
   * Subscribe to all events for a specific user.
   */
  subscribeForUser(userId: string, handler: EventHandler): () => void {
    if (!this.userHandlers.has(userId)) {
      this.userHandlers.set(userId, new Set());
    }
    this.userHandlers.get(userId)!.add(handler);

    return () => {
      const handlers = this.userHandlers.get(userId);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.userHandlers.delete(userId);
        }
      }
    };
  }

  /**
   * Subscribe to events for a specific session of a specific user.
   */
  subscribeToSessionForUser(
    userId: string,
    sessionId: string,
    handler: EventHandler
  ): () => void {
    if (!this.userSessionHandlers.has(userId)) {
      this.userSessionHandlers.set(userId, new Map());
    }
    const userSessions = this.userSessionHandlers.get(userId)!;

    if (!userSessions.has(sessionId)) {
      userSessions.set(sessionId, new Set());
    }
    userSessions.get(sessionId)!.add(handler);

    return () => {
      const userSessions = this.userSessionHandlers.get(userId);
      if (userSessions) {
        const handlers = userSessions.get(sessionId);
        if (handlers) {
          handlers.delete(handler);
          if (handlers.size === 0) {
            userSessions.delete(sessionId);
          }
        }
        if (userSessions.size === 0) {
          this.userSessionHandlers.delete(userId);
        }
      }
    };
  }

  /**
   * Emit an event scoped to a specific user.
   * Only handlers for that user will receive the event.
   */
  emitForUser(
    userId: string,
    type: AFSEventType,
    sessionId: string,
    payload: Annotation | Session | ThreadMessage | ActionRequest
  ): AFSEvent {
    const event: AFSEvent = {
      type,
      timestamp: new Date().toISOString(),
      sessionId,
      sequence: ++globalSequence,
      payload,
    };

    // Notify user-specific global subscribers
    const userHandlers = this.userHandlers.get(userId);
    if (userHandlers) {
      for (const handler of userHandlers) {
        try {
          handler(event);
        } catch (err) {
          console.error("[UserEventBus] Handler error:", err);
        }
      }
    }

    // Notify user-specific session subscribers
    const userSessions = this.userSessionHandlers.get(userId);
    if (userSessions) {
      const sessionHandlers = userSessions.get(sessionId);
      if (sessionHandlers) {
        for (const handler of sessionHandlers) {
          try {
            handler(event);
          } catch (err) {
            console.error("[UserEventBus] Session handler error:", err);
          }
        }
      }
    }

    return event;
  }

  /**
   * Check if a user has any active listeners.
   */
  hasListenersForUser(userId: string): boolean {
    const hasGlobal = this.userHandlers.has(userId) && this.userHandlers.get(userId)!.size > 0;
    const hasSessions = this.userSessionHandlers.has(userId) && this.userSessionHandlers.get(userId)!.size > 0;
    return hasGlobal || hasSessions;
  }

  /**
   * Get count of listeners for a user.
   */
  getListenerCountForUser(userId: string): number {
    let count = 0;
    const handlers = this.userHandlers.get(userId);
    if (handlers) count += handlers.size;

    const sessions = this.userSessionHandlers.get(userId);
    if (sessions) {
      for (const sessionHandlers of sessions.values()) {
        count += sessionHandlers.size;
      }
    }
    return count;
  }
}

// Singleton instance for user-scoped events
export const userEventBus = new UserEventBus();
