# agentation

Agentation is an agent-agnostic visual feedback tool. Click elements on your page, add notes, and copy structured output that helps AI coding agents find the exact code you're referring to.

## Install

```bash
npm install agentation -D
```

## Usage

### React Component

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

The toolbar appears in the bottom-right corner. Click to activate, then click any element to annotate it.

### Vanilla JS / Script Tag

For non-React projects, use the bundled script that works on any website. Perfect for adding visual feedback to Shopify themes, WordPress sites, or any HTML page.

#### CDN / Script Tag

Add this one line anywhere in your HTML:

```html
<script src="https://unpkg.com/agentation/dist/agentation.global.js"></script>
```

The script auto-initializes on page load. No configuration needed.

#### Shopify Theme

Load only in the Theme Editor for design-time feedback:

```liquid
{% if request.design_mode %}
  <script src="https://unpkg.com/agentation/dist/agentation.global.js" defer></script>
{% endif %}
```

Add this to `layout/theme.liquid` before the closing `</body>` tag.

#### WordPress

Load only for logged-in editors:

```php
<?php if (current_user_can('edit_posts')): ?>
  <script src="https://unpkg.com/agentation/dist/agentation.global.js" defer></script>
<?php endif; ?>
```

Add this to your theme's `footer.php` or use `wp_enqueue_script` in `functions.php`.

#### Any HTML Page

Just add the script tag to your HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>My Website</h1>

  <script src="https://unpkg.com/agentation/dist/agentation.global.js"></script>
</body>
</html>
```

**Notes:**
- Auto-initializes on page load (no init call needed)
- Works on ANY website (bundles React internally, no dependencies required)
- ~240KB bundle size (includes React + Agentation)
- All features work: annotations, settings, copy output, markers, area selection, etc.
- Toolbar appears in bottom-right corner
- Intended for development/design tools, not production sites

## Features

- **Click to annotate** – Click any element with automatic selector identification
- **Text selection** – Select text to annotate specific content
- **Multi-select** – Drag to select multiple elements at once
- **Area selection** – Drag to annotate any region, even empty space
- **Animation pause** – Freeze CSS animations to capture specific states
- **Structured output** – Copy markdown with selectors, positions, and context
- **Programmatic access** – Callback prop for direct integration with tools
- **Dark/light mode** – Matches your preference or set manually
- **Zero dependencies** – Pure CSS animations, no runtime libraries

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onAnnotationAdd` | `(annotation: Annotation) => void` | - | Called when an annotation is created |
| `onAnnotationDelete` | `(annotation: Annotation) => void` | - | Called when an annotation is deleted |
| `onAnnotationUpdate` | `(annotation: Annotation) => void` | - | Called when an annotation is edited |
| `onAnnotationsClear` | `(annotations: Annotation[]) => void` | - | Called when all annotations are cleared |
| `onCopy` | `(markdown: string) => void` | - | Callback with markdown output when copy is clicked |
| `copyToClipboard` | `boolean` | `true` | Set to false to prevent writing to clipboard |

### Programmatic Integration

Use callbacks to receive annotation data directly:

```tsx
import { Agentation, type Annotation } from 'agentation';

function App() {
  const handleAnnotation = (annotation: Annotation) => {
    // Structured data - no parsing needed
    console.log(annotation.element);      // "Button"
    console.log(annotation.elementPath);  // "body > div > button"
    console.log(annotation.boundingBox);  // { x, y, width, height }
    console.log(annotation.cssClasses);   // "btn btn-primary"

    // Send to your agent, API, etc.
    sendToAgent(annotation);
  };

  return (
    <>
      <YourApp />
      <Agentation
        onAnnotationAdd={handleAnnotation}
        copyToClipboard={false}  // Don't write to clipboard
      />
    </>
  );
}
```

### Annotation Type

```typescript
type Annotation = {
  id: string;
  x: number;                    // % of viewport width
  y: number;                    // px from top (viewport if fixed)
  comment: string;              // User's note
  element: string;              // e.g., "Button"
  elementPath: string;          // e.g., "body > div > button"
  timestamp: number;

  // Optional metadata (when available)
  selectedText?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  nearbyText?: string;
  cssClasses?: string;
  nearbyElements?: string;
  computedStyles?: string;
  fullPath?: string;
  accessibility?: string;
  isMultiSelect?: boolean;
  isFixed?: boolean;
};
```

## How it works

Agentation captures class names, selectors, and element positions so AI agents can `grep` for the exact code you're referring to. Instead of describing "the blue button in the sidebar," you give the agent `.sidebar > button.primary` and your feedback.

## Requirements

- React 18+ (for React component usage)
- Desktop browser (mobile not supported)
- No requirements for vanilla JS usage (React is bundled)

## Docs

Full documentation at [agentation.dev](https://agentation.dev)

## License

© 2026 Benji Taylor
Licensed under PolyForm Shield 1.0.0
