# CLAUDE.md

## Important Notes

**DO NOT publish the npm package until v1 is fully ready and tested.** The name `agentation` has been reserved on npm but we unpublished to avoid exposing unfinished code. Wait until we're confident in the API and functionality before publishing.

When ready to publish:
```bash
cd _package-export
npm publish
```

## Project Overview

**Agentation** is a floating toolbar for annotating web pages and collecting structured feedback for AI coding agents.

Core features:
- Click anywhere to add annotations with smart element identification
- Select text to annotate specific passages
- Hover to see element names highlighted
- Pause CSS animations to capture specific states
- Copy structured markdown output for sharing with AI agents
- Annotations persist in localStorage (7-day expiry)

## Project Structure

```
agentation/
├── _package-export/           # The npm package source
│   ├── src/
│   │   ├── index.ts           # Main exports
│   │   ├── types.ts           # TypeScript types (Annotation, etc.)
│   │   ├── components/
│   │   │   ├── icons.tsx      # SVG icons with morph animations
│   │   │   ├── icons-css.tsx  # CSS-only icon variants
│   │   │   ├── annotation-popup/   # Popup for entering feedback
│   │   │   └── page-toolbar/       # Main floating toolbar
│   │   └── utils/
│   │       ├── element-identification.ts  # Smart DOM element naming
│   │       └── storage.ts                 # localStorage helpers
│   ├── example/               # Next.js example app for testing
│   ├── dist/                  # Built output (gitignored in real use)
│   ├── package.json           # Currently minimal for name reservation
│   └── PLAN.md                # Detailed refactoring roadmap
```

## Two Component Variants

1. **Agentation** (default) - Uses framer-motion for smooth animations
   ```tsx
   import { Agentation } from 'agentation';
   ```

2. **AgentationCSS** - Zero runtime deps, CSS-only animations
   ```tsx
   import { AgentationCSS } from 'agentation';
   ```

## Development

```bash
cd _package-export
pnpm install
pnpm build      # Build the package
pnpm dev        # Watch mode

# Test with example app
cd example && pnpm install && pnpm dev
```

## Key Implementation Details

- Uses SCSS modules (requires consumer to have SCSS setup, or we convert to CSS-in-JS)
- Peer dependencies: react >=18, react-dom >=18, framer-motion >=10
- Element identification is smart: buttons by text, headings by content, containers by class name
- Storage key is based on pathname for per-page annotations

## Before v1 Release (see PLAN.md for details)

High priority:
- [ ] Convert SCSS to CSS-in-JS or CSS variables for easier adoption
- [ ] Add configuration props (theme, position, storage adapter)
- [ ] Abstract storage layer for custom implementations

Medium priority:
- [ ] Export TypeScript types properly
- [ ] Add position prop for toolbar placement

Low priority:
- [ ] Add tests
- [ ] Consider removing framer-motion dependency option
