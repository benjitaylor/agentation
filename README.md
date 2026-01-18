# Agentation

A floating annotation toolbar for collecting visual feedback on web pages. Built for AI coding agents.

![Agentation Demo](https://github.com/benjitaylor/agentation/assets/demo.gif)

## Features

- **Click to annotate** - Click any element to add feedback
- **Text selection** - Select text to annotate specific passages
- **Multi-select drag** - Drag to select multiple elements at once
- **Area selection** - Annotate empty regions of the page
- **Animation pause** - Freeze CSS animations to capture specific states
- **Smart element identification** - Buttons named by text, headings by content, etc.
- **Structured output** - Copy annotations as markdown for AI agents
- **localStorage persistence** - Annotations saved per-page with 7-day expiry

## Installation

```bash
npm install agentation
```

## Quick Start

```tsx
import { Agentation } from 'agentation';

function App() {
  return (
    <>
      <YourApp />
      <Agentation />
    </>
  );
}
```

## Usage

### Basic Usage

```tsx
import { Agentation } from 'agentation';

// Just add to your app - it renders a floating toolbar
<Agentation />
```

### With Demo Annotations

Show example annotations on page load to guide users:

```tsx
import { Agentation } from 'agentation';

const demoAnnotations = [
  {
    selector: ".hero-button",
    comment: "Try clicking this button!",
  },
  {
    selector: "h1",
    comment: "Annotations work on any element",
  },
];

<Agentation
  demoAnnotations={demoAnnotations}
  demoDelay={1000}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `demoAnnotations` | `DemoAnnotation[]` | `undefined` | Annotations to show on page load |
| `demoDelay` | `number` | `1000` | Delay before demo annotations appear (ms) |

### DemoAnnotation Type

```ts
type DemoAnnotation = {
  selector: string;    // CSS selector for target element
  comment: string;     // Annotation text
  selectedText?: string; // Optional text to highlight
};
```

## How It Works

1. **Activate** - Click the floating button to enter annotation mode
2. **Annotate** - Click elements or drag to select multiple
3. **Add feedback** - Type your comment in the popup
4. **Copy** - Click copy to get structured markdown output

### Output Format

Annotations are formatted as markdown:

```markdown
## Page Feedback: /dashboard
**Viewport:** 1920×1080

### 1. Submit Button
**Location:** form > div > button
**Feedback:** This button should be more prominent

### 2. Navigation Menu
**Location:** header > nav
**Selected text:** "Settings"
**Feedback:** Hard to find the settings option
```

## Settings

The toolbar includes a settings panel with:

- **Output Detail** - Compact, Standard, or Detailed output
- **Marker Color** - Blue, Green, Orange, Purple, or Pink
- **Clear after copy** - Auto-clear annotations after copying
- **Block interactions** - Prevent clicking through to page elements

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` | Close popup or exit annotation mode |

## Architecture

### Zero Dependencies

Agentation uses pure CSS animations with no runtime dependencies beyond React.

### Key Components

- `PageFeedbackToolbar` - Main toolbar component
- `AnnotationPopup` - Annotation input popup
- Icon components with morph animations

### Performance Optimizations

- Direct DOM manipulation for drag selection (60fps)
- Throttled element detection during drag
- Pooled highlight divs to avoid DOM churn
- Passive event listeners for scroll/mousemove
- GPU-accelerated CSS animations

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Project Structure

```
agentation/
├── _package-export/           # npm package source
│   ├── src/
│   │   ├── index.ts           # Main exports
│   │   ├── types.ts           # TypeScript types
│   │   ├── components/
│   │   │   ├── icons.tsx      # SVG icons with animations
│   │   │   ├── annotation-popup/      # Framer-motion popup
│   │   │   ├── annotation-popup-css/  # CSS-only popup
│   │   │   ├── page-toolbar/          # Framer-motion toolbar
│   │   │   └── page-toolbar-css/      # CSS-only toolbar
│   │   └── utils/
│   │       ├── element-identification.ts
│   │       └── storage.ts
│   ├── dist/                  # Built output
│   ├── example/               # Next.js demo app
│   │   ├── lib/               # Built library (copied from dist)
│   │   └── src/app/           # Demo pages
│   ├── tsup.config.ts         # Build configuration
│   └── package.json
└── README.md
```

### Setup

The project uses pnpm workspaces for local development with hot reloading.

```bash
# Clone the repo
git clone https://github.com/benjitaylor/agentation.git
cd agentation

# Install all workspace dependencies
pnpm install
```

### Development with Hot Reloading

```bash
# Start both watch mode and dev server
pnpm dev

# Or run separately:
pnpm --filter agentation watch        # Watch mode for library
pnpm --filter feedback-tool-example dev  # Dev server for example app
```

The example app imports directly from the `agentation` package via workspace linking. Changes to library source files automatically trigger rebuilds that the Next.js dev server picks up.

### Build the Library

```bash
# Build once
pnpm build

# Watch mode (rebuilds on changes)
pnpm --filter agentation watch
```

### Build Configuration

The library uses [tsup](https://tsup.egoist.dev/) with a custom SCSS plugin:

- **SCSS Modules** - Compiled and injected as inline styles (SSR-safe)
- **Dual format** - Both CJS and ESM outputs
- **TypeScript** - Full type declarations
- **External deps** - React, React DOM, and Framer Motion are externalized

### Making Changes

1. Edit files in `_package-export/src/`
2. tsup automatically rebuilds (if in watch mode)
3. Next.js dev server picks up changes
4. Browser auto-refreshes

### Code Style

- TypeScript strict mode
- SCSS modules for component styles
- CSS-only animations preferred (no runtime JS for animations)
- Direct DOM manipulation for performance-critical paths

## License

MIT

## Credits

Built by [Benji Taylor](https://benji.co) with [Claude Code](https://claude.ai/code).
