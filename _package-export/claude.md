# Agentation - Project Notes

## CRITICAL: No Dependencies in Package

**UNDER NO CIRCUMSTANCES can anything be added to the package (`src/`) that requires external dependencies like framer-motion.** The package must remain zero-dependency (beyond React peer deps).

- `src/` = Package code. **NO external dependencies allowed.** CSS-only animations are fine.
- `example/` = Docs website. Framer-motion and other deps are fine here.

## Changelog Updates

When making changes to the agentation library, update the changelog page at `example/src/app/changelog/page.tsx` with a summary of changes.

Group changes under the current date and appropriate category:
- **New Features** - New functionality added
- **Improvements** - Enhancements to existing features
- **Bug Fixes** - Issues that were resolved

## Project Structure

- `src/` - Library source code
- `src/components/page-toolbar/` - Main toolbar component
- `src/components/annotation-popup/` - Annotation input popup
- `src/components/icons.tsx` - Icon components
- `example/` - Next.js demo app (imports via workspace)

## Build & Development

The project uses pnpm workspaces with hot reloading. The example app imports directly from the `agentation` package.

```bash
# From repository root:
pnpm install       # Install all workspace dependencies
pnpm dev           # Start watch mode + dev server

# Or from _package-export:
pnpm build         # Build once
pnpm watch         # Watch mode (rebuilds on changes)
pnpm dev           # Build once + watch

# Run example separately:
cd example && pnpm dev
```

Changes to library source files automatically trigger rebuilds, and Next.js dev server picks up the changes.

## Key Features

- Click-to-annotate any element
- Text selection support
- Animation pause/resume
- Settings panel (output detail, colors, auto-clear)
- Demo annotations prop for showcase
- localStorage persistence
