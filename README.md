# Agentation

Visual feedback for AI coding agents.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development (watch mode + dev server)
pnpm dev
```

The dev server will be available at http://localhost:3000

## Project Structure

This is a pnpm workspace monorepo:

- `_package-export/` - The agentation npm package
- `_package-export/example/` - Next.js example app

## Development Workflow

The project is set up with hot reloading:

1. Edit source files in `_package-export/src/`
2. tsup automatically rebuilds the package
3. Next.js dev server picks up the changes
4. Your browser auto-refreshes

## Commands

From the root directory:

```bash
pnpm dev      # Start watch mode + dev server
pnpm build    # Build the library once
pnpm example  # Start only the example app
```

See `CLAUDE.md` for detailed documentation.
