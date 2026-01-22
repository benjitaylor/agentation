# @agentation/claude

Claude Code integration for [Agentation](https://agentation.dev) - sync page feedback directly to Claude Code via MCP.

## Setup

### 1. Add the MCP server to Claude Code

```bash
claude mcp add agentation -- npx @agentation/claude
```

That's it! The server will auto-start when you launch Claude Code.

### 2. Configure Agentation in your app

```tsx
import { Agentation } from 'agentation';

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && (
        <Agentation serverUrl="http://localhost:4242" />
      )}
    </>
  );
}
```

## Usage

1. **Start Claude Code** - the MCP server starts automatically
2. **Browse your app** and annotate issues with Agentation
3. **Tell Claude** to check your feedback:
   - "Check my page feedback"
   - "What UI issues do I have?"
   - "Fix the issues on /dashboard"

Claude will query the MCP server and see your structured annotations.

## How it works

```
Browser (your app)           Your Machine              Claude Code
     │                           │                         │
     │ POST localhost:4242       │                         │
     └──────────────────────────►│ HTTP Server             │
                                 │     │                   │
                                 │     ▼                   │
                                 │ In-Memory Store         │
                                 │     │                   │
                                 │ MCP Server ◄────────────┘
                                 │ (stdio)      MCP Protocol
```

- **HTTP Server** (port 4242): Receives annotations from browser
- **MCP Server** (stdio): Exposes tools to Claude Code
- **Shared Store**: In-memory, cleared when server restarts

## MCP Tools

| Tool | Description |
|------|-------------|
| `agentation_get_feedback` | Get all annotations, optionally filtered by pathname |
| `agentation_list_pages` | List pages with pending feedback |
| `agentation_clear_feedback` | Clear feedback after processing |

## CLI Options

```bash
npx @agentation/claude [options]

Options:
  --port <number>  HTTP server port (default: 4242)
  --verbose, -v    Enable verbose logging
```

## Custom port

```bash
claude mcp add agentation -- npx @agentation/claude --port 5000
```

Then configure your app:
```tsx
<Agentation serverUrl="http://localhost:5000" />
```
