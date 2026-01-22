/**
 * @agentation/claude
 *
 * Claude Code integration for Agentation - MCP server for syncing page feedback
 *
 * Usage as CLI (recommended):
 *   claude mcp add agentation -- npx @agentation/claude
 *
 * Usage programmatically:
 *   import { startServer } from '@agentation/claude';
 *   await startServer({ httpPort: 4242 });
 */

export { startServer } from "./server.js";
export { store } from "./store.js";
export type {
  Annotation,
  PageFeedback,
  SyncPayload,
  ServerConfig,
} from "./types.js";
