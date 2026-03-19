# Agentation Hook for Claude Code

This hook automatically injects pending UI annotations into Claude's context on every user message.

## Quick Setup

### Option 1: One-liner (recommended)

Add to your project's `.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "type": "command",
        "command": "curl -sf --connect-timeout 1 http://localhost:4747/pending 2>/dev/null | python3 -c \"import sys,json;d=json.load(sys.stdin);c=d['count'];exit(0)if c==0 else[print(f'\\n=== AGENTATION: {c} UI annotations ===\\n'),*[print(f\\\"[{i+1}] {a['element']}\\n    {a['comment']}\\n\\\")for i,a in enumerate(d['annotations'])],print('=== END ===\\n')]\" 2>/dev/null;exit 0"
      }
    ]
  }
}
```

### Option 2: Shell Script (more detailed output)

1. Copy `check-agentation.sh` to your project or a location in your PATH
2. Add to `.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "type": "command",
        "command": "/path/to/check-agentation.sh"
      }
    ]
  }
}
```

### Option 3: Global Settings

Add to `~/.claude/settings.json` to enable for all projects:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "type": "command",
        "command": "curl -sf --connect-timeout 1 http://localhost:4747/pending 2>/dev/null | python3 -c \"import sys,json;d=json.load(sys.stdin);c=d['count'];exit(0)if c==0 else[print(f'\\n=== AGENTATION: {c} UI annotations ===\\n'),*[print(f\\\"[{i+1}] {a['element']}\\n    {a['comment']}\\n\\\")for i,a in enumerate(d['annotations'])],print('=== END ===\\n')]\" 2>/dev/null;exit 0"
      }
    ]
  }
}
```

## How It Works

1. On every user message, the hook runs
2. It calls `http://localhost:4747/pending` (the agentation server)
3. If there are pending annotations (count > 0), it formats and outputs them
4. If no pending annotations or server not running, outputs nothing (silent)

## Requirements

- Agentation server running (`npx agentation-mcp server` or integrated in your app)
- Python 3 (for JSON parsing - comes with macOS/most Linux)
- curl (standard on most systems)

## Example Output

When there are pending annotations, Claude sees:

```
=== AGENTATION FEEDBACK (2 pending) ===

[1] button.submit-btn
    Comment: This button should be disabled during loading

[2] div.error-message
    Comment: Error text is hard to read, needs more contrast

Address these UI issues.
=== END ===
```

When no annotations are pending, the hook outputs nothing.
