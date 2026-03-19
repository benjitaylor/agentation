# Agentation

Monorepo containing:

1. **npm package** (`package/`) - See `package/CLAUDE.md`
2. **Website/docs** (`package/example/`) - See `package/example/CLAUDE.md`

## What is Agentation?

A floating toolbar for annotating web pages and collecting structured feedback for AI coding agents.

## Development

```bash
pnpm install    # Install all workspace dependencies
pnpm dev        # Run both package watch + website dev server
pnpm build      # Build package only
```

## Important

The npm package is public. Changes to `package/src/` affect all users.
Website changes (`package/example/`) only affect agentation.dev.

## PR/Issue Approach

- Package size is critical - avoid bloat
- UI changes need extra scrutiny
- Plugins/extensions → encourage separate repos
- External binary files → never accept

## Annotations

Whenever the user brings up annotations, fetch all the pending annotations before doing anything else. And infer whether I am referencing any annotations.
