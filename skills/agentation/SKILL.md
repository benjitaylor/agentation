---
name: agentation
description: Add Agentation visual feedback toolbar to a React project (Next.js, Vite, CRA)
---

# Agentation Setup

Set up the Agentation annotation toolbar in this project.

## Steps

1. **Check if already installed**
   - Look for `agentation` in package.json dependencies
   - If not found, run `npm install agentation` (or pnpm/yarn based on lockfile)

2. **Check if already configured**
   - Search for `<Agentation` or `import { Agentation }` in src/
   - If found, report that Agentation is already set up and exit

3. **Detect framework**
   - Next.js App Router: has `app/layout.tsx` or `app/layout.js`
   - Next.js Pages Router: has `pages/_app.tsx` or `pages/_app.js`
   - Vite/CRA: has `src/App.tsx`, `src/App.jsx`, or `src/main.tsx`

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

   For Vite/CRA, add to App or main:
   ```tsx
   import { Agentation } from "agentation";

   // Add inside the return, at the end:
   {process.env.NODE_ENV === "development" && <Agentation />}
   ```

5. **Confirm setup**
   - Tell the user to run their dev server and look for the Agentation toolbar (floating button in bottom-right corner)

## Notes

- The `NODE_ENV` check ensures Agentation only loads in development
- Agentation requires React 18+
- No additional configuration needed — it works out of the box
