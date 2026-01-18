# Feedback Tool - Package Extraction Plan

## Context

This package was extracted from [benji.org](https://benji.org) (personal-website-2024 repo). It's a floating toolbar for collecting visual feedback during development that:

- Lets you click on any element to add annotations
- Identifies elements intelligently (buttons by text, headings by content, etc.)
- Captures text selections
- Pauses CSS animations for precise captures
- Outputs structured markdown for sharing

**Original location:** `src/tools/feedback/` in the personal-website-2024 repo

## Current State

The code has been extracted with minimal changes. It's functional but has hardcoded values and requires SCSS. The goal is to make it a standalone npm package anyone can install.

### What Works Now

- All core functionality is intact
- Example app (`/example`) can be used for testing
- SCSS modules are included (requires SCSS setup in consumer app)

### What Needs Work

The code still has some assumptions from the original site that need to be abstracted.

---

## Phase 1: Make It Build (Do First)

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Fix any TypeScript errors**
   - The code uses `"use client"` directives (Next.js specific)
   - May need to adjust for non-Next.js environments

3. **Get tsup building**
   ```bash
   pnpm build
   ```
   - May need to configure SCSS handling in tsup
   - Options: extract CSS file, inject styles, or convert to CSS-in-JS

4. **Test with example app**
   ```bash
   cd example && pnpm install && pnpm dev
   ```

---

## Phase 2: Abstract Configuration

### 2.1 Add Props Interface

Create a configuration interface in `src/types.ts`:

```tsx
export interface FeedbackToolbarConfig {
  // Visibility control (replaces the wrapper logic)
  enabled?: boolean;

  // Theming
  theme?: {
    primary?: string;    // Currently: #3c82f7 (blue)
    success?: string;    // Currently: #34C759 (green)
    danger?: string;     // Currently: #ff3b30 (red)
  };

  // Layout
  zIndexBase?: number;   // Currently: 100000
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  // Storage
  retentionDays?: number;  // Currently: 7
  storagePrefix?: string;  // Currently: "feedback-annotations-"

  // Callbacks
  onCopy?: (markdown: string) => void | Promise<void>;
  onAnnotationAdd?: (annotation: Annotation) => void;
  onAnnotationRemove?: (id: string) => void;
}
```

### 2.2 Remove Hardcoded Values

Files to update:

| File | Hardcoded Value | Solution |
|------|-----------------|----------|
| `page-toolbar/styles.module.scss` | `$blue: #3c82f7` | CSS variable or prop |
| `page-toolbar/styles.module.scss` | `$red: #ff3b30` | CSS variable or prop |
| `annotation-popup/styles.module.scss` | `$blue`, `$green` | CSS variable or prop |
| `page-toolbar/index.tsx` | z-index values | Config prop |
| `utils/storage.ts` | 7-day retention | Config prop |
| `utils/storage.ts` | localStorage prefix | Config prop |

---

## Phase 3: Styling Approach (Pick One)

### Option A: CSS Variables (Recommended)

Keep SCSS but use CSS variables that consumers can override:

```scss
.toolbar {
  --feedback-primary: #3c82f7;
  --feedback-danger: #ff3b30;

  .badge {
    background: var(--feedback-primary);
  }
}
```

Consumer overrides:
```css
:root {
  --feedback-primary: #8b5cf6;
}
```

**Pros:** Simple, familiar, no build changes needed
**Cons:** Requires importing CSS file

### Option B: CSS-in-JS (vanilla-extract)

Convert SCSS to vanilla-extract for zero-runtime CSS:

```ts
// styles.css.ts
import { style, createVar } from '@vanilla-extract/css';

export const primaryColor = createVar();

export const badge = style({
  background: primaryColor,
});
```

**Pros:** Type-safe, tree-shakeable
**Cons:** More work, adds dependency

### Option C: Inline Styles

Remove SCSS entirely, use inline styles with config:

```tsx
<div style={{
  background: config.theme?.primary ?? '#3c82f7',
  zIndex: config.zIndexBase ?? 100000
}}>
```

**Pros:** Zero CSS to import, fully configurable
**Cons:** Larger component code, harder to maintain

---

## Phase 4: Storage Abstraction

Create a pluggable storage interface:

```ts
// src/types.ts
export interface StorageAdapter {
  load(key: string): Annotation[] | null;
  save(key: string, annotations: Annotation[]): void;
  clear(key: string): void;
}

// src/utils/storage.ts
export const localStorageAdapter: StorageAdapter = {
  load(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  save(key, annotations) {
    localStorage.setItem(key, JSON.stringify(annotations));
  },
  clear(key) {
    localStorage.removeItem(key);
  }
};
```

Usage:
```tsx
<FeedbackToolbar storage={customStorageAdapter} />
```

---

## Phase 5: Polish & Publish

1. **Add TypeScript declaration exports**
   - Ensure all public types are exported
   - Add JSDoc comments

2. **Write README with examples**
   - Basic usage
   - With configuration
   - Custom storage
   - Framework-specific (Next.js, Vite, CRA)

3. **Add demo GIF to README**
   - Record using the tool
   - Show annotation flow

4. **Publish to npm**
   ```bash
   npm publish --access public
   ```

---

## Files Quick Reference

```
src/
├── index.ts                    # Exports everything
├── types.ts                    # Add FeedbackToolbarConfig here
├── components/
│   ├── icons.tsx               # Pure, no changes needed
│   ├── annotation-popup/       # Needs theme props
│   └── page-toolbar/           # Main work happens here
└── utils/
    ├── element-identification.ts  # Pure, no changes needed
    └── storage.ts                 # Add adapter interface
```

---

## Testing Checklist

Before publishing, verify:

- [ ] Builds without errors (`pnpm build`)
- [ ] Example app works (`cd example && pnpm dev`)
- [ ] Annotations persist across page refresh
- [ ] Copy button produces valid markdown
- [ ] Clear button removes all annotations
- [ ] Pause button freezes CSS animations
- [ ] Works in:
  - [ ] Next.js 14 (App Router)
  - [ ] Next.js (Pages Router)
  - [ ] Vite + React
  - [ ] Create React App

---

## Questions to Decide

1. **Package name?**
   - `@benji/feedback-tool`
   - `page-feedback`
   - `react-feedback-toolbar`
   - Something else?

2. **Minimum React version?**
   - React 18+ (uses `useId`, modern hooks)
   - Or support React 17 with polyfills?

3. **Include the animation feedback page?**
   - The original had a separate `/animation-feedback` route
   - Could be a separate export or omitted entirely

4. **License?**
   - MIT recommended for broad adoption
