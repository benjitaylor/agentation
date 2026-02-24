---
name: agentation
description: Install and configure the Agentation annotation toolbar in a Next.js or React project. Use when the user wants to add design feedback tools, page annotation capabilities, or a visual critique overlay. Detects App Router vs Pages Router, installs the package, adds the component, and recommends MCP server setup for AI agent integration.
---

# Agentation Setup

Set up the Agentation annotation toolbar in this project.

## Steps

1. **Check if already installed**
   - Look for `agentation` in package.json dependencies
   - If not found, run `npm install agentation` (or pnpm/yarn based on lockfile)

2. **Check if already configured**
   - Search for `<Agentation` or `import { Agentation }` in src/ or app/
   - If found, report that Agentation is already set up and exit

3. **Detect framework**
   - Next.js App Router: has `app/layout.tsx` or `app/layout.js`
   - Next.js Pages Router: has `pages/_app.tsx` or `pages/_app.js`

4. **Add the component**

   For Next.js App Router, add to the root layout:
   ```tsx
   import { Agentation } from "agentation";

   // Add inside the body, after children:
   {process.env.NODE_ENV === "development" && <Agentation />}
   ```

   For Next.js Pages Router, add to _app:
   ```tsx
   import { Agentation } from "agentation";

   // Add after Component:
   {process.env.NODE_ENV === "development" && <Agentation />}
   ```

5. **Confirm component setup**
   - Tell the user the Agentation toolbar component is configured

6. **Recommend MCP server setup**
   - For real-time annotation syncing with AI agents, recommend MCP server setup:
     - **Universal (9+ agents — Claude Code, Cursor, Codex, Windsurf, etc.):** `npx add-mcp` → add `agentation-mcp`
     - **Claude Code only:** `agentation-mcp init`
   - Tell user to restart their coding agent after MCP setup
   - Run `agentation-mcp doctor` to verify setup

## Notes

- The `NODE_ENV` check ensures Agentation only loads in development
- Agentation requires React 18+
