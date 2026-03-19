// =============================================================================
// Shared Types
// =============================================================================

export type Annotation = {
  id: string;
  x: number; // % of viewport width
  y: number; // px from top of document (absolute) OR viewport (if isFixed)
  comment: string;
  element: string;
  elementPath: string;
  timestamp: number;
  selectedText?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  nearbyText?: string;
  cssClasses?: string;
  nearbyElements?: string;
  computedStyles?: string;
  fullPath?: string;
  accessibility?: string;
  isMultiSelect?: boolean; // true if created via drag selection
  isFixed?: boolean; // true if element has fixed/sticky positioning (marker stays fixed)
  reactComponents?: string; // React component hierarchy (e.g. "<App> <Dashboard> <Button>")

  // Protocol fields (added when syncing to server)
  sessionId?: string;
  url?: string;
  intent?: AnnotationIntent;
  severity?: AnnotationSeverity;
  status?: AnnotationStatus;
  thread?: ThreadMessage[];
  createdAt?: string;
  updatedAt?: string;
  resolvedAt?: string;
  resolvedBy?: "human" | "agent";
  authorId?: string;
};

// -----------------------------------------------------------------------------
// Annotation Enums
// -----------------------------------------------------------------------------

export type AnnotationIntent = "fix" | "change" | "question" | "approve";
export type AnnotationSeverity = "blocking" | "important" | "suggestion";
export type AnnotationStatus = "pending" | "acknowledged" | "resolved" | "dismissed";

// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

export type Session = {
  id: string;
  url: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt?: string;
  projectId?: string;
  metadata?: Record<string, unknown>;
};

export type SessionStatus = "active" | "approved" | "closed";

export type SessionWithAnnotations = Session & {
  annotations: Annotation[];
};

// -----------------------------------------------------------------------------
// Thread Messages
// -----------------------------------------------------------------------------

export type ThreadMessage = {
  id: string;
  role: "human" | "agent";
  content: string;
  timestamp: number;
};

// -----------------------------------------------------------------------------
// Events (for real-time streaming)
// -----------------------------------------------------------------------------

export type AFSEventType =
  | "annotation.created"
  | "annotation.updated"
  | "annotation.deleted"
  | "session.created"
  | "session.updated"
  | "session.closed"
  | "thread.message"
  | "action.requested";

export type ActionRequest = {
  sessionId: string;
  annotations: Annotation[];
  output: string; // Pre-formatted markdown output
  timestamp: string;
};

export type AFSEvent = {
  type: AFSEventType;
  timestamp: string; // ISO 8601
  sessionId: string;
  sequence: number; // Monotonic for ordering/dedup/replay
  payload: Annotation | Session | ThreadMessage | ActionRequest;
};

// -----------------------------------------------------------------------------
// Store Interface
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Multi-Tenant Types
// -----------------------------------------------------------------------------

export type Organization = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
};

export type UserRole = "owner" | "admin" | "member";

export type User = {
  id: string;
  email: string;
  orgId: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
};

export type ApiKey = {
  id: string;
  keyPrefix: string; // First 8 chars for display (e.g., "sk_live_a")
  keyHash: string; // SHA-256 hash of full key
  userId: string;
  name: string;
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
};

export type UserContext = {
  userId: string;
  orgId: string;
  email?: string;
  role?: UserRole;
};

// -----------------------------------------------------------------------------
// Store Interface
// -----------------------------------------------------------------------------

export interface AFSStore {
  // Sessions
  createSession(url: string, projectId?: string): Session;
  getSession(id: string): Session | undefined;
  getSessionWithAnnotations(id: string): SessionWithAnnotations | undefined;
  updateSessionStatus(id: string, status: SessionStatus): Session | undefined;
  listSessions(): Session[];

  // Annotations
  addAnnotation(
    sessionId: string,
    data: Omit<Annotation, "id" | "sessionId" | "status" | "createdAt">
  ): Annotation | undefined;
  getAnnotation(id: string): Annotation | undefined;
  updateAnnotation(
    id: string,
    data: Partial<Omit<Annotation, "id" | "sessionId" | "createdAt">>
  ): Annotation | undefined;
  updateAnnotationStatus(
    id: string,
    status: AnnotationStatus,
    resolvedBy?: "human" | "agent"
  ): Annotation | undefined;
  addThreadMessage(
    annotationId: string,
    role: "human" | "agent",
    content: string
  ): Annotation | undefined;
  getPendingAnnotations(sessionId: string): Annotation[];
  getSessionAnnotations(sessionId: string): Annotation[];
  deleteAnnotation(id: string): Annotation | undefined;

  // Events (for replay on reconnect)
  getEventsSince(sessionId: string, sequence: number): AFSEvent[];

  // Lifecycle
  close(): void;
}
