/**
 * SQLite-backed store for sessions, annotations, and events.
 * Provides persistence across server restarts.
 */

import Database from "better-sqlite3";
import { createHash, randomBytes } from "crypto";
import { mkdirSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import type {
  AFSStore,
  AFSEvent,
  AFSEventType,
  Session,
  SessionStatus,
  SessionWithAnnotations,
  Annotation,
  AnnotationStatus,
  ThreadMessage,
  Organization,
  User,
  UserRole,
  ApiKey,
  UserContext,
} from "../types.js";
import { eventBus } from "./events.js";

// -----------------------------------------------------------------------------
// Database Setup
// -----------------------------------------------------------------------------

function getDbPath(): string {
  const dataDir = join(homedir(), ".agentation");
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  return join(dataDir, "store.db");
}

function initDatabase(db: Database.Database): void {
  db.exec(`
    -- Multi-tenant tables
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      org_id TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY (org_id) REFERENCES organizations(id)
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      key_prefix TEXT NOT NULL,
      key_hash TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT,
      last_used_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT,
      project_id TEXT,
      metadata TEXT,
      user_id TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS annotations (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      x REAL NOT NULL,
      y REAL NOT NULL,
      comment TEXT NOT NULL,
      element TEXT NOT NULL,
      element_path TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      selected_text TEXT,
      bounding_box TEXT,
      nearby_text TEXT,
      css_classes TEXT,
      nearby_elements TEXT,
      computed_styles TEXT,
      full_path TEXT,
      accessibility TEXT,
      is_multi_select INTEGER DEFAULT 0,
      is_fixed INTEGER DEFAULT 0,
      react_components TEXT,
      url TEXT,
      intent TEXT,
      severity TEXT,
      status TEXT DEFAULT 'pending',
      thread TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      resolved_at TEXT,
      resolved_by TEXT,
      author_id TEXT,
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      session_id TEXT NOT NULL,
      sequence INTEGER NOT NULL UNIQUE,
      payload TEXT NOT NULL,
      user_id TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_users_org ON users(org_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
    CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_annotations_session ON annotations(session_id);
    CREATE INDEX IF NOT EXISTS idx_events_session_seq ON events(session_id, sequence);
    CREATE INDEX IF NOT EXISTS idx_events_user ON events(user_id);
  `);
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function rowToSession(row: Record<string, unknown>): Session & { userId?: string } {
  return {
    id: row.id as string,
    url: row.url as string,
    status: row.status as SessionStatus,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string | undefined,
    projectId: row.project_id as string | undefined,
    metadata: row.metadata ? JSON.parse(row.metadata as string) : undefined,
    userId: row.user_id as string | undefined,
  };
}

function rowToOrganization(row: Record<string, unknown>): Organization {
  return {
    id: row.id as string,
    name: row.name as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string | undefined,
  };
}

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    orgId: row.org_id as string,
    role: row.role as UserRole,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string | undefined,
  };
}

function rowToApiKey(row: Record<string, unknown>): ApiKey {
  return {
    id: row.id as string,
    keyPrefix: row.key_prefix as string,
    keyHash: row.key_hash as string,
    userId: row.user_id as string,
    name: row.name as string,
    createdAt: row.created_at as string,
    expiresAt: row.expires_at as string | undefined,
    lastUsedAt: row.last_used_at as string | undefined,
  };
}

function rowToAnnotation(row: Record<string, unknown>): Annotation {
  return {
    id: row.id as string,
    sessionId: row.session_id as string,
    x: row.x as number,
    y: row.y as number,
    comment: row.comment as string,
    element: row.element as string,
    elementPath: row.element_path as string,
    timestamp: row.timestamp as number,
    selectedText: row.selected_text as string | undefined,
    boundingBox: row.bounding_box ? JSON.parse(row.bounding_box as string) : undefined,
    nearbyText: row.nearby_text as string | undefined,
    cssClasses: row.css_classes as string | undefined,
    nearbyElements: row.nearby_elements as string | undefined,
    computedStyles: row.computed_styles as string | undefined,
    fullPath: row.full_path as string | undefined,
    accessibility: row.accessibility as string | undefined,
    isMultiSelect: Boolean(row.is_multi_select),
    isFixed: Boolean(row.is_fixed),
    reactComponents: row.react_components as string | undefined,
    url: row.url as string | undefined,
    intent: row.intent as Annotation["intent"],
    severity: row.severity as Annotation["severity"],
    status: row.status as AnnotationStatus | undefined,
    thread: row.thread ? JSON.parse(row.thread as string) : undefined,
    createdAt: row.created_at as string | undefined,
    updatedAt: row.updated_at as string | undefined,
    resolvedAt: row.resolved_at as string | undefined,
    resolvedBy: row.resolved_by as Annotation["resolvedBy"],
    authorId: row.author_id as string | undefined,
  };
}

// -----------------------------------------------------------------------------
// SQLite Store Implementation
// -----------------------------------------------------------------------------

export function createSQLiteStore(dbPath?: string): AFSStore {
  const db = new Database(dbPath ?? getDbPath());
  db.pragma("journal_mode = WAL");
  initDatabase(db);

  // Restore event sequence from last event
  const lastEvent = db.prepare("SELECT MAX(sequence) as seq FROM events").get() as { seq: number | null };
  if (lastEvent?.seq) {
    eventBus.setSequence(lastEvent.seq);
  }

  // Prepared statements
  const stmts = {
    // Sessions
    insertSession: db.prepare(`
      INSERT INTO sessions (id, url, status, created_at, project_id, metadata)
      VALUES (@id, @url, @status, @createdAt, @projectId, @metadata)
    `),
    getSession: db.prepare("SELECT * FROM sessions WHERE id = ?"),
    updateSessionStatus: db.prepare(`
      UPDATE sessions SET status = @status, updated_at = @updatedAt WHERE id = @id
    `),
    listSessions: db.prepare("SELECT * FROM sessions ORDER BY created_at DESC"),

    // Annotations
    insertAnnotation: db.prepare(`
      INSERT INTO annotations (
        id, session_id, x, y, comment, element, element_path, timestamp,
        selected_text, bounding_box, nearby_text, css_classes, nearby_elements,
        computed_styles, full_path, accessibility, is_multi_select, is_fixed,
        react_components, url, intent, severity, status, thread, created_at,
        updated_at, resolved_at, resolved_by, author_id
      ) VALUES (
        @id, @sessionId, @x, @y, @comment, @element, @elementPath, @timestamp,
        @selectedText, @boundingBox, @nearbyText, @cssClasses, @nearbyElements,
        @computedStyles, @fullPath, @accessibility, @isMultiSelect, @isFixed,
        @reactComponents, @url, @intent, @severity, @status, @thread, @createdAt,
        @updatedAt, @resolvedAt, @resolvedBy, @authorId
      )
    `),
    getAnnotation: db.prepare("SELECT * FROM annotations WHERE id = ?"),
    getAnnotationsBySession: db.prepare("SELECT * FROM annotations WHERE session_id = ? ORDER BY timestamp"),
    getPendingAnnotations: db.prepare("SELECT * FROM annotations WHERE session_id = ? AND status = 'pending' ORDER BY timestamp"),
    deleteAnnotation: db.prepare("DELETE FROM annotations WHERE id = ?"),
    updateAnnotation: db.prepare(`
      UPDATE annotations SET
        comment = COALESCE(@comment, comment),
        status = COALESCE(@status, status),
        updated_at = @updatedAt,
        resolved_at = COALESCE(@resolvedAt, resolved_at),
        resolved_by = COALESCE(@resolvedBy, resolved_by),
        thread = COALESCE(@thread, thread),
        intent = COALESCE(@intent, intent),
        severity = COALESCE(@severity, severity)
      WHERE id = @id
    `),

    // Events
    insertEvent: db.prepare(`
      INSERT INTO events (type, timestamp, session_id, sequence, payload)
      VALUES (@type, @timestamp, @sessionId, @sequence, @payload)
    `),
    getEventsSince: db.prepare(`
      SELECT * FROM events WHERE session_id = ? AND sequence > ? ORDER BY sequence
    `),
    pruneOldEvents: db.prepare(`
      DELETE FROM events WHERE timestamp < ?
    `),
  };

  // Prune events older than retention period on startup
  const retentionDays = parseInt(process.env.AGENTATION_EVENT_RETENTION_DAYS || "7", 10);
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();
  stmts.pruneOldEvents.run(cutoff);

  function persistEvent(event: AFSEvent): void {
    stmts.insertEvent.run({
      type: event.type,
      timestamp: event.timestamp,
      sessionId: event.sessionId,
      sequence: event.sequence,
      payload: JSON.stringify(event.payload),
    });
  }

  return {
    // Sessions
    createSession(url: string, projectId?: string): Session {
      const session: Session = {
        id: generateId(),
        url,
        status: "active",
        createdAt: new Date().toISOString(),
        projectId,
      };

      stmts.insertSession.run({
        id: session.id,
        url: session.url,
        status: session.status,
        createdAt: session.createdAt,
        projectId: session.projectId ?? null,
        metadata: null,
      });

      const event = eventBus.emit("session.created", session.id, session);
      persistEvent(event);

      return session;
    },

    getSession(id: string): Session | undefined {
      const row = stmts.getSession.get(id) as Record<string, unknown> | undefined;
      return row ? rowToSession(row) : undefined;
    },

    getSessionWithAnnotations(id: string): SessionWithAnnotations | undefined {
      const sessionRow = stmts.getSession.get(id) as Record<string, unknown> | undefined;
      if (!sessionRow) return undefined;

      const annotationRows = stmts.getAnnotationsBySession.all(id) as Record<string, unknown>[];

      return {
        ...rowToSession(sessionRow),
        annotations: annotationRows.map(rowToAnnotation),
      };
    },

    updateSessionStatus(id: string, status: SessionStatus): Session | undefined {
      const updatedAt = new Date().toISOString();
      const result = stmts.updateSessionStatus.run({ id, status, updatedAt });
      if (result.changes === 0) return undefined;

      const session = this.getSession(id);
      if (session) {
        const eventType: AFSEventType = status === "closed" ? "session.closed" : "session.updated";
        const event = eventBus.emit(eventType, id, session);
        persistEvent(event);
      }
      return session;
    },

    listSessions(): Session[] {
      const rows = stmts.listSessions.all() as Record<string, unknown>[];
      return rows.map(rowToSession);
    },

    // Annotations
    addAnnotation(
      sessionId: string,
      data: Omit<Annotation, "id" | "sessionId" | "status" | "createdAt">
    ): Annotation | undefined {
      const session = this.getSession(sessionId);
      if (!session) return undefined;

      const annotation: Annotation = {
        ...data,
        id: generateId(),
        sessionId,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      stmts.insertAnnotation.run({
        id: annotation.id,
        sessionId: annotation.sessionId,
        x: annotation.x,
        y: annotation.y,
        comment: annotation.comment,
        element: annotation.element,
        elementPath: annotation.elementPath,
        timestamp: annotation.timestamp,
        selectedText: annotation.selectedText ?? null,
        boundingBox: annotation.boundingBox ? JSON.stringify(annotation.boundingBox) : null,
        nearbyText: annotation.nearbyText ?? null,
        cssClasses: annotation.cssClasses ?? null,
        nearbyElements: annotation.nearbyElements ?? null,
        computedStyles: annotation.computedStyles ?? null,
        fullPath: annotation.fullPath ?? null,
        accessibility: annotation.accessibility ?? null,
        isMultiSelect: annotation.isMultiSelect ? 1 : 0,
        isFixed: annotation.isFixed ? 1 : 0,
        reactComponents: annotation.reactComponents ?? null,
        url: annotation.url ?? null,
        intent: annotation.intent ?? null,
        severity: annotation.severity ?? null,
        status: annotation.status ?? "pending",
        thread: annotation.thread ? JSON.stringify(annotation.thread) : null,
        createdAt: annotation.createdAt ?? new Date().toISOString(),
        updatedAt: null,
        resolvedAt: null,
        resolvedBy: null,
        authorId: annotation.authorId ?? null,
      });

      const event = eventBus.emit("annotation.created", sessionId, annotation);
      persistEvent(event);

      return annotation;
    },

    getAnnotation(id: string): Annotation | undefined {
      const row = stmts.getAnnotation.get(id) as Record<string, unknown> | undefined;
      return row ? rowToAnnotation(row) : undefined;
    },

    updateAnnotation(
      id: string,
      data: Partial<Omit<Annotation, "id" | "sessionId" | "createdAt">>
    ): Annotation | undefined {
      const existing = this.getAnnotation(id);
      if (!existing) return undefined;

      stmts.updateAnnotation.run({
        id,
        comment: data.comment ?? null,
        status: data.status ?? null,
        updatedAt: new Date().toISOString(),
        resolvedAt: data.resolvedAt ?? null,
        resolvedBy: data.resolvedBy ?? null,
        thread: data.thread ? JSON.stringify(data.thread) : null,
        intent: data.intent ?? null,
        severity: data.severity ?? null,
      });

      const updated = this.getAnnotation(id);
      if (updated && existing.sessionId) {
        const event = eventBus.emit("annotation.updated", existing.sessionId, updated);
        persistEvent(event);
      }
      return updated;
    },

    updateAnnotationStatus(
      id: string,
      status: AnnotationStatus,
      resolvedBy?: "human" | "agent"
    ): Annotation | undefined {
      const isResolved = status === "resolved" || status === "dismissed";
      return this.updateAnnotation(id, {
        status,
        resolvedAt: isResolved ? new Date().toISOString() : undefined,
        resolvedBy: isResolved ? (resolvedBy || "agent") : undefined,
      });
    },

    addThreadMessage(
      annotationId: string,
      role: "human" | "agent",
      content: string
    ): Annotation | undefined {
      const existing = this.getAnnotation(annotationId);
      if (!existing) return undefined;

      const message: ThreadMessage = {
        id: generateId(),
        role,
        content,
        timestamp: Date.now(),
      };

      const thread = [...(existing.thread || []), message];
      const updated = this.updateAnnotation(annotationId, { thread });

      if (updated && existing.sessionId) {
        const event = eventBus.emit("thread.message", existing.sessionId, message);
        persistEvent(event);
      }

      return updated;
    },

    getPendingAnnotations(sessionId: string): Annotation[] {
      const rows = stmts.getPendingAnnotations.all(sessionId) as Record<string, unknown>[];
      return rows.map(rowToAnnotation);
    },

    getSessionAnnotations(sessionId: string): Annotation[] {
      const rows = stmts.getAnnotationsBySession.all(sessionId) as Record<string, unknown>[];
      return rows.map(rowToAnnotation);
    },

    deleteAnnotation(id: string): Annotation | undefined {
      const existing = this.getAnnotation(id);
      if (!existing) return undefined;

      stmts.deleteAnnotation.run(id);

      if (existing.sessionId) {
        const event = eventBus.emit("annotation.deleted", existing.sessionId, existing);
        persistEvent(event);
      }

      return existing;
    },

    // Events
    getEventsSince(sessionId: string, sequence: number): AFSEvent[] {
      const rows = stmts.getEventsSince.all(sessionId, sequence) as Record<string, unknown>[];
      return rows.map((row) => ({
        type: row.type as AFSEventType,
        timestamp: row.timestamp as string,
        sessionId: row.session_id as string,
        sequence: row.sequence as number,
        payload: JSON.parse(row.payload as string),
      }));
    },

    // Lifecycle
    close(): void {
      db.close();
    },
  };
}

// -----------------------------------------------------------------------------
// Tenant Store Interface
// -----------------------------------------------------------------------------

export interface TenantStore {
  // Organizations
  createOrganization(name: string): Organization;
  getOrganization(id: string): Organization | undefined;

  // Users
  createUser(email: string, orgId: string, role?: UserRole): User;
  getUser(id: string): User | undefined;
  getUserByEmail(email: string): User | undefined;
  getUsersByOrg(orgId: string): User[];

  // API Keys
  createApiKey(userId: string, name: string, expiresAt?: string): { apiKey: ApiKey; rawKey: string };
  getApiKeyByHash(hash: string): ApiKey | undefined;
  listApiKeys(userId: string): ApiKey[];
  deleteApiKey(id: string): boolean;
  updateApiKeyLastUsed(id: string): void;

  // User-scoped sessions
  createSessionForUser(userId: string, url: string, projectId?: string): Session;
  listSessionsForUser(userId: string): Session[];
  getSessionForUser(userId: string, sessionId: string): Session | undefined;
  getSessionWithAnnotationsForUser(userId: string, sessionId: string): SessionWithAnnotations | undefined;

  // User-scoped annotations
  getPendingAnnotationsForUser(userId: string, sessionId: string): Annotation[];
  getAllPendingForUser(userId: string): Annotation[];

  // Lifecycle
  close(): void;
}

// -----------------------------------------------------------------------------
// Tenant Store Implementation
// -----------------------------------------------------------------------------

export function createTenantStore(dbPath?: string): TenantStore {
  const db = new Database(dbPath ?? getDbPath());
  db.pragma("journal_mode = WAL");
  initDatabase(db);

  // Restore event sequence from last event
  const lastEvent = db.prepare("SELECT MAX(sequence) as seq FROM events").get() as { seq: number | null };
  if (lastEvent?.seq) {
    eventBus.setSequence(lastEvent.seq);
  }

  // Prepared statements for tenant operations
  const tenantStmts = {
    // Organizations
    insertOrg: db.prepare(`
      INSERT INTO organizations (id, name, created_at)
      VALUES (@id, @name, @createdAt)
    `),
    getOrg: db.prepare("SELECT * FROM organizations WHERE id = ?"),

    // Users
    insertUser: db.prepare(`
      INSERT INTO users (id, email, org_id, role, created_at)
      VALUES (@id, @email, @orgId, @role, @createdAt)
    `),
    getUser: db.prepare("SELECT * FROM users WHERE id = ?"),
    getUserByEmail: db.prepare("SELECT * FROM users WHERE email = ?"),
    getUsersByOrg: db.prepare("SELECT * FROM users WHERE org_id = ?"),

    // API Keys
    insertApiKey: db.prepare(`
      INSERT INTO api_keys (id, key_prefix, key_hash, user_id, name, created_at, expires_at)
      VALUES (@id, @keyPrefix, @keyHash, @userId, @name, @createdAt, @expiresAt)
    `),
    getApiKeyByHash: db.prepare("SELECT * FROM api_keys WHERE key_hash = ?"),
    listApiKeys: db.prepare("SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC"),
    deleteApiKey: db.prepare("DELETE FROM api_keys WHERE id = ?"),
    updateApiKeyLastUsed: db.prepare("UPDATE api_keys SET last_used_at = ? WHERE id = ?"),

    // User-scoped sessions
    insertSessionForUser: db.prepare(`
      INSERT INTO sessions (id, url, status, created_at, project_id, metadata, user_id)
      VALUES (@id, @url, @status, @createdAt, @projectId, @metadata, @userId)
    `),
    listSessionsForUser: db.prepare("SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC"),
    getSessionForUser: db.prepare("SELECT * FROM sessions WHERE id = ? AND user_id = ?"),
    getAnnotationsBySession: db.prepare("SELECT * FROM annotations WHERE session_id = ? ORDER BY timestamp"),
    getPendingAnnotationsForSession: db.prepare("SELECT * FROM annotations WHERE session_id = ? AND status = 'pending' ORDER BY timestamp"),

    // Get all pending for a user (across all their sessions)
    getAllPendingForUser: db.prepare(`
      SELECT a.* FROM annotations a
      JOIN sessions s ON a.session_id = s.id
      WHERE s.user_id = ? AND a.status = 'pending'
      ORDER BY a.timestamp
    `),

    // Events
    insertEvent: db.prepare(`
      INSERT INTO events (type, timestamp, session_id, sequence, payload, user_id)
      VALUES (@type, @timestamp, @sessionId, @sequence, @payload, @userId)
    `),

    // Prune old events
    pruneOldEvents: db.prepare(`
      DELETE FROM events WHERE timestamp < ?
    `),
  };

  // Prune events older than retention period on startup
  const retentionDays = parseInt(process.env.AGENTATION_EVENT_RETENTION_DAYS || "7", 10);
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();
  tenantStmts.pruneOldEvents.run(cutoff);

  function persistEventForUser(event: AFSEvent, userId: string): void {
    tenantStmts.insertEvent.run({
      type: event.type,
      timestamp: event.timestamp,
      sessionId: event.sessionId,
      sequence: event.sequence,
      payload: JSON.stringify(event.payload),
      userId,
    });
  }

  return {
    // Organizations
    createOrganization(name: string): Organization {
      const org: Organization = {
        id: `org_${generateId()}`,
        name,
        createdAt: new Date().toISOString(),
      };

      tenantStmts.insertOrg.run({
        id: org.id,
        name: org.name,
        createdAt: org.createdAt,
      });

      return org;
    },

    getOrganization(id: string): Organization | undefined {
      const row = tenantStmts.getOrg.get(id) as Record<string, unknown> | undefined;
      return row ? rowToOrganization(row) : undefined;
    },

    // Users
    createUser(email: string, orgId: string, role: UserRole = "member"): User {
      const user: User = {
        id: `user_${generateId()}`,
        email,
        orgId,
        role,
        createdAt: new Date().toISOString(),
      };

      tenantStmts.insertUser.run({
        id: user.id,
        email: user.email,
        orgId: user.orgId,
        role: user.role,
        createdAt: user.createdAt,
      });

      return user;
    },

    getUser(id: string): User | undefined {
      const row = tenantStmts.getUser.get(id) as Record<string, unknown> | undefined;
      return row ? rowToUser(row) : undefined;
    },

    getUserByEmail(email: string): User | undefined {
      const row = tenantStmts.getUserByEmail.get(email) as Record<string, unknown> | undefined;
      return row ? rowToUser(row) : undefined;
    },

    getUsersByOrg(orgId: string): User[] {
      const rows = tenantStmts.getUsersByOrg.all(orgId) as Record<string, unknown>[];
      return rows.map(rowToUser);
    },

    // API Keys
    createApiKey(userId: string, name: string, expiresAt?: string): { apiKey: ApiKey; rawKey: string } {
      const id = `key_${generateId()}`;
      // Generate a secure random key
      const rawKey = `sk_live_${randomBytes(32).toString("base64url")}`;
      const keyPrefix = rawKey.substring(0, 12); // "sk_live_xxxx"

      // Hash the key for storage
      const keyHash = createHash("sha256").update(rawKey).digest("hex");

      const apiKey: ApiKey = {
        id,
        keyPrefix,
        keyHash,
        userId,
        name,
        createdAt: new Date().toISOString(),
        expiresAt,
      };

      tenantStmts.insertApiKey.run({
        id: apiKey.id,
        keyPrefix: apiKey.keyPrefix,
        keyHash: apiKey.keyHash,
        userId: apiKey.userId,
        name: apiKey.name,
        createdAt: apiKey.createdAt,
        expiresAt: apiKey.expiresAt ?? null,
      });

      return { apiKey, rawKey };
    },

    getApiKeyByHash(hash: string): ApiKey | undefined {
      const row = tenantStmts.getApiKeyByHash.get(hash) as Record<string, unknown> | undefined;
      return row ? rowToApiKey(row) : undefined;
    },

    listApiKeys(userId: string): ApiKey[] {
      const rows = tenantStmts.listApiKeys.all(userId) as Record<string, unknown>[];
      return rows.map(rowToApiKey);
    },

    deleteApiKey(id: string): boolean {
      const result = tenantStmts.deleteApiKey.run(id);
      return result.changes > 0;
    },

    updateApiKeyLastUsed(id: string): void {
      tenantStmts.updateApiKeyLastUsed.run(new Date().toISOString(), id);
    },

    // User-scoped sessions
    createSessionForUser(userId: string, url: string, projectId?: string): Session {
      const session: Session = {
        id: generateId(),
        url,
        status: "active",
        createdAt: new Date().toISOString(),
        projectId,
      };

      tenantStmts.insertSessionForUser.run({
        id: session.id,
        url: session.url,
        status: session.status,
        createdAt: session.createdAt,
        projectId: session.projectId ?? null,
        metadata: null,
        userId,
      });

      const event = eventBus.emit("session.created", session.id, session);
      persistEventForUser(event, userId);

      return session;
    },

    listSessionsForUser(userId: string): Session[] {
      const rows = tenantStmts.listSessionsForUser.all(userId) as Record<string, unknown>[];
      return rows.map(rowToSession);
    },

    getSessionForUser(userId: string, sessionId: string): Session | undefined {
      const row = tenantStmts.getSessionForUser.get(sessionId, userId) as Record<string, unknown> | undefined;
      return row ? rowToSession(row) : undefined;
    },

    getSessionWithAnnotationsForUser(userId: string, sessionId: string): SessionWithAnnotations | undefined {
      const sessionRow = tenantStmts.getSessionForUser.get(sessionId, userId) as Record<string, unknown> | undefined;
      if (!sessionRow) return undefined;

      const annotationRows = tenantStmts.getAnnotationsBySession.all(sessionId) as Record<string, unknown>[];

      return {
        ...rowToSession(sessionRow),
        annotations: annotationRows.map(rowToAnnotation),
      };
    },

    // User-scoped annotations
    getPendingAnnotationsForUser(userId: string, sessionId: string): Annotation[] {
      // First verify the session belongs to the user
      const session = this.getSessionForUser(userId, sessionId);
      if (!session) return [];

      const rows = tenantStmts.getPendingAnnotationsForSession.all(sessionId) as Record<string, unknown>[];
      return rows.map(rowToAnnotation);
    },

    getAllPendingForUser(userId: string): Annotation[] {
      const rows = tenantStmts.getAllPendingForUser.all(userId) as Record<string, unknown>[];
      return rows.map(rowToAnnotation);
    },

    // Lifecycle
    close(): void {
      db.close();
    },
  };
}
