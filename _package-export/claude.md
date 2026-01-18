# Agentation - Project Notes

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
- `example/` - Next.js demo app
- `example/lib/` - Built library for example app (copy from `dist/`)

## Build & Development

```bash
# Build library
npm run build

# Copy to example
cp dist/* example/lib/

# Run example
cd example && npm run dev
```

## Key Features

- Click-to-annotate any element
- Text selection support
- Animation pause/resume
- Settings panel (output detail, colors, auto-clear)
- Demo annotations prop for showcase
- localStorage persistence
