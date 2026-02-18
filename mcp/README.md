# Agentation MCP

MCP (Model Context Protocol) server for Agentation - visual feedback for AI coding agents.

This package provides an MCP server that allows AI coding agents (like Claude Code) to receive and respond to web page annotations created with the Agentation toolbar.

## Installation

```bash
npm install agentation-mcp
# or
pnpm add agentation-mcp
```

## Quick Start

### 1. Add to your agent

The fastest way to configure Agentation across any supported agent:

```bash
npx add-mcp "npx -y agentation-mcp server"
```

Uses [add-mcp](https://github.com/neondatabase/add-mcp) to auto-detect installed agents (Claude Code, Cursor, Codex, Windsurf, and more).

Or for Claude Code specifically:

```bash
claude mcp add agentation -- npx agentation-mcp server
```


### 2. Start the server

```bash
agentation-mcp server
```

This starts both:
- **HTTP server** (port 4747) - receives annotations from the browser toolbar
- **MCP server** (stdio) - exposes tools for Claude Code

### 3. Verify your setup

```bash
agentation-mcp doctor
```

## CLI Commands

```bash
agentation-mcp init                    # Setup wizard (registers via claude mcp add)
agentation-mcp server [options]        # Start the annotation server
agentation-mcp doctor                  # Check your setup
agentation-mcp help                    # Show help
```

### Server Options

```bash
--port <port>      # HTTP server port (default: 4747)
--mcp-only         # Skip HTTP server, only run MCP on stdio
--http-url <url>   # HTTP server URL for MCP to fetch from
```

## MCP Tools

The MCP server exposes these tools to AI agents:

| Tool | Description |
|------|-------------|
| `agentation_list_sessions` | List all active annotation sessions |
| `agentation_get_session` | Get a session with all its annotations |
| `agentation_get_pending` | Get pending annotations for a session |
| `agentation_get_all_pending` | Get pending annotations across all sessions |
| `agentation_acknowledge` | Mark an annotation as acknowledged |
| `agentation_resolve` | Mark an annotation as resolved |
| `agentation_dismiss` | Dismiss an annotation with a reason |
| `agentation_reply` | Add a reply to an annotation thread |
| `agentation_watch_annotations` | Block until new annotations appear, then return batch |

## HTTP API

The HTTP server provides a REST API for the browser toolbar:

### Sessions
- `POST /sessions` - Create a new session
- `GET /sessions` - List all sessions
- `GET /sessions/:id` - Get session with annotations

### Annotations
- `POST /sessions/:id/annotations` - Add annotation
- `GET /annotations/:id` - Get annotation
- `PATCH /annotations/:id` - Update annotation
- `DELETE /annotations/:id` - Delete annotation
- `GET /sessions/:id/pending` - Get pending annotations
- `GET /pending` - Get all pending annotations

### Events (SSE)
- `GET /sessions/:id/events` - Session event stream
- `GET /events` - Global event stream (optionally filter with `?domain=...`)

### Health
- `GET /health` - Health check
- `GET /status` - Server status

## Hands-Free Mode

Use `agentation_watch_annotations` in a loop for automatic feedback processing -- the agent picks up new annotations as they're created:

1. Agent calls `agentation_watch_annotations` (blocks until annotations appear)
2. Annotations arrive -- agent receives batch after collection window
3. Agent processes each annotation:
   - `agentation_acknowledge` -- mark as seen
   - Make code changes
   - `agentation_resolve` -- mark as done with summary
4. Agent calls `agentation_watch_annotations` again (loop)

Example CLAUDE.md instructions:

```markdown
When I say "watch mode", call agentation_watch_annotations in a loop.
For each annotation: acknowledge it, make the fix, then resolve it with a summary.
Continue watching until I say stop or timeout is reached.
```

## Webhooks

Configure webhooks to receive notifications when users request agent action:

```bash
# Single webhook
export AGENTATION_WEBHOOK_URL=https://your-server.com/webhook

# Multiple webhooks (comma-separated)
export AGENTATION_WEBHOOKS=https://server1.com/hook,https://server2.com/hook
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AGENTATION_STORE` | Storage backend (`memory` or `sqlite`) | `sqlite` |
| `AGENTATION_WEBHOOK_URL` | Single webhook URL | - |
| `AGENTATION_WEBHOOKS` | Comma-separated webhook URLs | - |
| `AGENTATION_EVENT_RETENTION_DAYS` | Days to keep events | `7` |

## Programmatic Usage

```typescript
import { startHttpServer, startMcpServer } from 'agentation-mcp';

// Start HTTP server on port 4747
startHttpServer(4747);

// Start MCP server (connects via stdio)
await startMcpServer('http://localhost:4747');
```

## Storage

By default, data is persisted to SQLite at `~/.agentation/store.db`. To use in-memory storage:

```bash
AGENTATION_STORE=memory agentation-mcp server
```

## License

PolyForm Shield 1.0.0
