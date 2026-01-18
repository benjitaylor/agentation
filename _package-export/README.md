# @benji/feedback-tool

A floating toolbar for annotating web pages and collecting structured feedback.

## Features

- Click anywhere to add annotations with smart element identification
- Select text to annotate specific passages
- Hover to see element names highlighted
- Pause CSS animations to capture specific states
- Copy structured markdown output
- Annotations persist in localStorage (7-day expiry)

## Installation

```bash
pnpm add @benji/feedback-tool framer-motion
```

## Usage

```tsx
import { FeedbackToolbar } from '@benji/feedback-tool';

function App() {
  return (
    <>
      <YourContent />
      <FeedbackToolbar />
    </>
  );
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Watch mode
pnpm dev

# Run the example app
cd example && pnpm install && pnpm dev
```

---

## Refactoring Checklist

This package was extracted from benji.org. The following items need to be addressed to make it fully standalone:

### High Priority

- [ ] **Convert SCSS to CSS-in-JS or CSS variables**
  - Currently uses SCSS modules which require consumer to have SCSS setup
  - Options: vanilla-extract, CSS modules with plain CSS, or inline styles
  - Files: `src/components/*/styles.module.scss`

- [ ] **Add configuration props to FeedbackToolbar**
  ```tsx
  interface FeedbackToolbarProps {
    enabled?: boolean;          // Control visibility (default: true)
    theme?: {
      primary?: string;         // Default: #3c82f7
      success?: string;         // Default: #34C759
      danger?: string;          // Default: #ff3b30
    };
    zIndexBase?: number;        // Default: 100000
    retentionDays?: number;     // Default: 7
    onCopy?: (markdown: string) => void | Promise<void>;
  }
  ```

- [ ] **Abstract storage layer**
  - Create `StorageAdapter` interface
  - Provide default localStorage implementation
  - Allow custom implementations (IndexedDB, API, etc.)

### Medium Priority

- [ ] **Add CSS custom properties for theming**
  ```css
  :root {
    --feedback-primary: #3c82f7;
    --feedback-success: #34C759;
    --feedback-danger: #ff3b30;
    --feedback-z-index: 100000;
  }
  ```

- [ ] **Export TypeScript types**
  - `Annotation`
  - `FeedbackToolbarProps`
  - `StorageAdapter`

- [ ] **Add position prop**
  - Allow toolbar to be positioned in any corner
  - `position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'`

### Low Priority

- [ ] **Add tests**
  - Unit tests for element identification
  - Integration tests for toolbar interactions

- [ ] **Add Storybook or similar**
  - Document all components
  - Show different configurations

- [ ] **Consider removing framer-motion dependency**
  - Could use CSS animations for simpler cases
  - Would reduce bundle size significantly

---

## File Structure

```
src/
├── index.ts                    # Main exports
├── types.ts                    # Shared TypeScript types
├── components/
│   ├── icons.tsx               # SVG icons with morph animations
│   ├── annotation-popup/       # Popup for entering feedback
│   │   ├── index.tsx
│   │   └── styles.module.scss
│   └── page-toolbar/           # Main floating toolbar
│       ├── index.tsx
│       └── styles.module.scss
└── utils/
    ├── element-identification.ts  # Smart DOM element naming
    └── storage.ts                 # localStorage helpers

example/                        # Next.js example app for testing
├── src/app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.scss
└── package.json
```

## How Element Identification Works

The tool intelligently names elements based on:

1. **data-element attribute** - Explicit naming (highest priority)
2. **Interactive elements** - Button text, link text, input placeholders
3. **Headings** - Tag + text content
4. **Text elements** - Truncated content
5. **Containers** - Meaningful class names (CSS module hashes stripped)
6. **SVG elements** - Parent context

Example output:
```
button "Submit Form"
link "Learn more"
h2 "Getting Started"
paragraph: "This is the first..."
container (from class name)
```

## License

MIT
