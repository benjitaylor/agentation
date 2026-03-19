/**
 * Agentation MCP Server
 *
 * This package provides an MCP server for AI coding agents to interact
 * with web page annotations from the Agentation toolbar.
 */

// Re-export server functions
export { startHttpServer, startMcpServer } from "./server/index.js";

// Re-export store functions
export {
  getStore,
  store,
  createSession,
  getSession,
  getSessionWithAnnotations,
  updateSessionStatus,
  listSessions,
  addAnnotation,
  getAnnotation,
  updateAnnotation,
  updateAnnotationStatus,
  addThreadMessage,
  getPendingAnnotations,
  getSessionAnnotations,
  deleteAnnotation,
  getEventsSince,
  clearAll,
} from "./server/store.js";

// Re-export event bus
export { eventBus, userEventBus } from "./server/events.js";

// Re-export tenant store
export {
  getTenantStore,
  resetTenantStore,
  hashApiKey,
  isValidApiKeyFormat,
  createUserContext,
  createOrganization,
  getOrganization,
  createUser,
  getUser,
  getUserByEmail,
  getUsersByOrg,
  createApiKey,
  getApiKeyByHash,
  listApiKeys,
  deleteApiKey,
  updateApiKeyLastUsed,
  createSessionForUser,
  listSessionsForUser,
  getSessionForUser,
  getSessionWithAnnotationsForUser,
  getPendingAnnotationsForUser,
  getAllPendingForUser,
} from "./server/tenant-store.js";
export type { TenantStore } from "./server/tenant-store.js";

// Re-export types
export type {
  Annotation,
  AnnotationIntent,
  AnnotationSeverity,
  AnnotationStatus,
  Session,
  SessionStatus,
  SessionWithAnnotations,
  ThreadMessage,
  AFSEventType,
  ActionRequest,
  AFSEvent,
  AFSStore,
  // Multi-tenant types
  Organization,
  User,
  UserRole,
  ApiKey,
  UserContext,
} from "./types.js";
