---
name: agentation-fixer
description: >
  Watch for browser annotations and auto-fix code. The "Fixer" half of the
  two-session self-driving workflow — receives annotations created by a human or
  by the agentation-self-driving Critic, locates the relevant source code, applies
  minimal fixes, and resolves each annotation. Supports one-shot check and
  continuous watch loop. Use when: "watch annotations", "watch mode", "fix annotations",
  "agentation fixer", "agentation watch", or user wants an agent to continuously
  process UI feedback from the browser.
argument-hint: "[watch|check]"
allowed-tools: "mcp__agentation__agentation_get_all_pending mcp__agentation__agentation_watch_annotations mcp__agentation__agentation_acknowledge mcp__agentation__agentation_resolve mcp__agentation__agentation_dismiss mcp__agentation__agentation_reply Edit Read Grep Glob"
---

# Agentation Fixer

Receive browser annotations via MCP, locate source code, apply fixes, resolve.

Designed as the **Fixer** in the [two-session workflow](../agentation-self-driving/references/two-session-workflow.md):
- **Session 1 (Critic)**: `/agentation-self-driving` — scans page, adds annotations in a headed browser
- **Session 2 (Fixer)**: This skill — watches for annotations, edits code to address each one

Also works standalone when a human creates annotations manually.

## Mode Selection

- `/agentation-fixer` or `/agentation-fixer check` → **One-shot**: drain pending, fix, done
- `/agentation-fixer watch` → **Watch loop**: continuous monitoring until stopped

If no argument and zero pending, ask user: check only or enter watch mode?

## One-shot

1. `agentation_get_all_pending`
2. Fix each via **Fix Cycle**
3. Report summary (N fixed, N clarified, N dismissed)

## Watch Loop

1. Drain existing pending annotations first
2. `agentation_watch_annotations` (timeoutSeconds: 300, batchWindowSeconds: 15)
3. Annotations arrive → fix each → re-enter watch
4. Timeout with no annotations → "Still watching..." → re-enter watch
5. User says stop → print session summary, exit

## Fix Cycle

Per annotation:

1. **Acknowledge**: `agentation_acknowledge(id)` — user sees you're working on it
2. **Locate source**:
   - Use `sourceFile` field if present (direct path)
   - Otherwise use `reactComponents` to identify the component, then Grep/Glob to find the file
   - Fallback: use `elementPath` or `cssClasses` to grep the codebase
3. **Read** the relevant code section
4. **Route by intent**:
   - `fix` / `change` / (no intent) → apply minimal code change → `agentation_resolve(id, "summary")`
   - `question` → `agentation_reply(id, "answer")`, leave open for human to confirm
   - `approve` → `agentation_resolve(id, "Acknowledged, no changes needed")`
5. **When unsure** → `agentation_reply(id, "clarifying question")`, leave open
6. **When scope is too large** → `agentation_reply(id, "explanation of scope")`, leave open

## Rules

- **Minimal diffs** — fix exactly what's asked, nothing more
- **No opportunistic refactoring** of surrounding code
- **Severity ordering**: `blocking` first, then `important`, then `suggestion`
- **Batch same-component annotations** into one edit when they touch the same file/section
- **Never break the build** — if unsure about a change, reply instead of guessing

## Install

Symlink into your skills directory:

```bash
ln -s "$(pwd)/skills/agentation-fixer" ~/.claude/skills/agentation-fixer
```

Restart Claude Code after installing. Verify with `/agentation-fixer`.
