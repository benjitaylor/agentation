# Agentation RN Package

This is the publishable npm package for React Native. Changes here affect everyone who installs `agentation-rn`.

## Critical Rules

1. **NEVER run `npm publish`** - Only publish when explicitly instructed
2. **NEVER bump version** in package.json without explicit instruction
3. **NEVER modify exports** in index.ts without discussing breaking changes

## What Gets Published

- `dist/` folder (compiled from `src/`)
- `package.json`, `README.md`, `LICENSE`

## Before Modifying `src/`

- Consider: Is this a breaking change?
- Consider: Does this affect the API surface?
- Consider: Will existing users' code still work?
- Consider: Does this break parity with the web package?

## Main Export

```tsx
import { Agentation } from 'agentation-rn';
```

## Mobile-Specific APIs

These are React Native additions not in the web package:

- `useAgentationScroll` - ScrollView marker positioning
- `AgenationView` - Modal/sheet annotation context

## Programmatic API (Web Parity)

The component exposes these callback props (matching web 1.2.0+):

- `onAnnotationAdd(annotation)` - when annotation created
- `onAnnotationDelete(annotation)` - when annotation deleted
- `onAnnotationUpdate(annotation)` - when annotation edited
- `onAnnotationsClear(annotations[])` - when all cleared
- `onCopy(markdown)` - when copy button clicked
- `copyToClipboard` (boolean, default: true)

**API stability**: These are public contracts. Changing signatures or removing callbacks is a breaking change requiring a major version bump.

## Testing Changes

1. Run `pnpm build` to ensure it compiles
2. Run `pnpm typecheck` for TypeScript validation
3. Test the example app on iOS: `cd example && pnpm ios`
4. Test the example app on Android: `cd example && pnpm android`

## Publishing

When instructed to publish a new npm version:

1. Bump version in `package.json`
2. Run `pnpm build`
3. Commit the version bump
4. Run `npm publish --access public` (will prompt for OTP)
5. Push to main

## Web API Parity

Maintain compatibility with the web `agentation` package:

| Feature | Web | RN | Notes |
|---------|-----|-----|-------|
| Annotation callbacks | ✅ | ✅ | Same signatures |
| Demo mode | ✅ | ✅ | Same props |
| Output levels | ✅ | ✅ | compact/standard/detailed/forensic |
| Settings persistence | ✅ | ✅ | localStorage vs AsyncStorage |
| `identifyElement` | ✅ | ✅ | Alias for `detectComponent` |
| `getElementPath` | ✅ | ✅ | Alias for `formatElementPath` |

When adding features, consider if they should also be added to the web package.
