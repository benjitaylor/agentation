/**
 * Tenant Store - Multi-tenant wrapper for the base store.
 *
 * Provides user-scoped access to sessions and annotations,
 * plus management of organizations, users, and API keys.
 *
 * Usage:
 *   import { getTenantStore, hashApiKey } from './tenant-store.js';
 *   const store = getTenantStore();
 *   const user = store.getUser(userId);
 */

import { createHash } from "crypto";
import type {
  Organization,
  User,
  UserRole,
  ApiKey,
  UserContext,
  Session,
  SessionWithAnnotations,
  Annotation,
} from "../types.js";

// Re-export TenantStore type
export type { TenantStore } from "./sqlite.js";

// -----------------------------------------------------------------------------
// Store Singleton
// -----------------------------------------------------------------------------

let _tenantStore: import("./sqlite.js").TenantStore | null = null;

/**
 * Get the tenant store instance. Lazily initializes on first access.
 */
export function getTenantStore(): import("./sqlite.js").TenantStore {
  if (!_tenantStore) {
    _tenantStore = initializeTenantStore();
  }
  return _tenantStore;
}

/**
 * Initialize the tenant store.
 */
function initializeTenantStore(): import("./sqlite.js").TenantStore {
  try {
    // Dynamic import to avoid issues if better-sqlite3 isn't available
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createTenantStore } = require("./sqlite.js");
    const store = createTenantStore();
    process.stderr.write("[TenantStore] Initialized tenant store\n");
    return store;
  } catch (err) {
    console.error("[TenantStore] Failed to initialize:", (err as Error).message);
    throw err;
  }
}

/**
 * Reset the tenant store singleton (for testing).
 */
export function resetTenantStore(): void {
  if (_tenantStore) {
    _tenantStore.close();
    _tenantStore = null;
  }
}

// -----------------------------------------------------------------------------
// API Key Utilities
// -----------------------------------------------------------------------------

/**
 * Hash an API key for lookup.
 * Used by auth middleware to find the key in the database.
 */
export function hashApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}

/**
 * Validate API key format.
 */
export function isValidApiKeyFormat(key: string): boolean {
  return key.startsWith("sk_live_") && key.length > 20;
}

// -----------------------------------------------------------------------------
// User Context Utilities
// -----------------------------------------------------------------------------

/**
 * Create a UserContext from a User and Organization.
 */
export function createUserContext(user: User): UserContext {
  return {
    userId: user.id,
    orgId: user.orgId,
    email: user.email,
    role: user.role,
  };
}

// -----------------------------------------------------------------------------
// Convenience Exports (delegate to singleton)
// -----------------------------------------------------------------------------

// Organizations
export function createOrganization(name: string): Organization {
  return getTenantStore().createOrganization(name);
}

export function getOrganization(id: string): Organization | undefined {
  return getTenantStore().getOrganization(id);
}

// Users
export function createUser(email: string, orgId: string, role?: UserRole): User {
  return getTenantStore().createUser(email, orgId, role);
}

export function getUser(id: string): User | undefined {
  return getTenantStore().getUser(id);
}

export function getUserByEmail(email: string): User | undefined {
  return getTenantStore().getUserByEmail(email);
}

export function getUsersByOrg(orgId: string): User[] {
  return getTenantStore().getUsersByOrg(orgId);
}

// API Keys
export function createApiKey(
  userId: string,
  name: string,
  expiresAt?: string
): { apiKey: ApiKey; rawKey: string } {
  return getTenantStore().createApiKey(userId, name, expiresAt);
}

export function getApiKeyByHash(hash: string): ApiKey | undefined {
  return getTenantStore().getApiKeyByHash(hash);
}

export function listApiKeys(userId: string): ApiKey[] {
  return getTenantStore().listApiKeys(userId);
}

export function deleteApiKey(id: string): boolean {
  return getTenantStore().deleteApiKey(id);
}

export function updateApiKeyLastUsed(id: string): void {
  return getTenantStore().updateApiKeyLastUsed(id);
}

// User-scoped sessions
export function createSessionForUser(
  userId: string,
  url: string,
  projectId?: string
): Session {
  return getTenantStore().createSessionForUser(userId, url, projectId);
}

export function listSessionsForUser(userId: string): Session[] {
  return getTenantStore().listSessionsForUser(userId);
}

export function getSessionForUser(
  userId: string,
  sessionId: string
): Session | undefined {
  return getTenantStore().getSessionForUser(userId, sessionId);
}

export function getSessionWithAnnotationsForUser(
  userId: string,
  sessionId: string
): SessionWithAnnotations | undefined {
  return getTenantStore().getSessionWithAnnotationsForUser(userId, sessionId);
}

// User-scoped annotations
export function getPendingAnnotationsForUser(
  userId: string,
  sessionId: string
): Annotation[] {
  return getTenantStore().getPendingAnnotationsForUser(userId, sessionId);
}

export function getAllPendingForUser(userId: string): Annotation[] {
  return getTenantStore().getAllPendingForUser(userId);
}
