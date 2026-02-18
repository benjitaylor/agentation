---
name: agentation
description: Add Agentation visual feedback toolbar to a Next.js project
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
   - Explain that for real-time annotation syncing with AI agents, they should also set up the MCP server
   - Recommend one of the following approaches:
     - **Universal (supports 9+ agents including Claude Code, Cursor, Codex, Windsurf, etc.):**
       See [add-mcp](https://github.com/neondatabase/add-mcp) — run `npx add-mcp` and follow the prompts to add `agentation-mcp` as an MCP server
     - **Claude Code only (interactive wizard):**
       Run `agentation-mcp init` after installing the package
   - Tell user to restart their coding agent after MCP setup to load the server
   - Explain that once configured, annotations will sync to the agent automatically

## Notes

- The `NODE_ENV` check ensures Agentation only loads in development
- Agentation requires React 18
- The MCP server runs on port 4747 by default for the HTTP server
- MCP server exposes tools like `agentation_get_all_pending`, `agentation_resolve`, and `agentation_watch_annotations`
- Run `agentation-mcp doctor` to verify setup after installing
