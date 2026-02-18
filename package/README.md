<img src="https://raw.githubusercontent.com/benjitaylor/agentation/main/package/logo.svg" alt="Agentation" width="50" />

[![npm version](https://img.shields.io/npm/v/agentation)](https://www.npmjs.com/package/agentation)
[![downloads](https://img.shields.io/npm/dm/agentation)](https://www.npmjs.com/package/agentation)

**[Agentation](https://agentation.dev)** is an agent-agnostic visual feedback tool. Click elements on your page, add notes, and copy structured output that helps AI coding agents find the exact code you're referring to.

## Install

```bash
npm install agentation -D
```

## Usage

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

## Features

- **Click to annotate** – Click any element with automatic selector identification
- **Text selection** – Select text to annotate specific content
- **Multi-select** – Drag to select multiple elements at once
- **Area selection** – Drag to annotate any region, even empty space
- **Animation pause** – Freeze all animations (CSS, JS, videos) to capture specific states
- **Structured output** – Copy markdown with selectors, positions, and context
- **Programmatic access** – Callback prop for direct integration with tools
- **Dark/light mode** – Toggle in settings, persists to localStorage
- **Zero dependencies** – Pure CSS animations, no runtime libraries

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onAnnotationAdd` | `(annotation: Annotation) => void` | - | Called when an annotation is created |
| `onAnnotationDelete` | `(annotation: Annotation) => void` | - | Called when an annotation is deleted |
| `onAnnotationUpdate` | `(annotation: Annotation) => void` | - | Called when an annotation is edited |
| `onAnnotationsClear` | `(annotations: Annotation[]) => void` | - | Called when all annotations are cleared |
| `onCopy` | `(markdown: string) => void` | - | Callback with markdown output when copy is clicked |
| `onSubmit` | `(output: string, annotations: Annotation[]) => void` | - | Called when "Send Annotations" is clicked |
| `copyToClipboard` | `boolean` | `true` | Set to false to prevent writing to clipboard |
| `endpoint` | `string` | - | Server URL for Agent Sync (e.g., `"http://localhost:4747"`) |
| `sessionId` | `string` | - | Pre-existing session ID to join |
| `onSessionCreated` | `(sessionId: string) => void` | - | Called when a new session is created |
| `webhookUrl` | `string` | - | Webhook URL to receive annotation events |

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
  y: number;                    // px from top of document (absolute) OR viewport (if isFixed)
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

> **Note:** This is a simplified type. The full type includes additional fields for Agent Sync (`url`, `status`, `thread`, `reactComponents`, etc.). See [agentation.dev/schema](https://agentation.dev/schema) for the complete schema.

## How it works

Agentation captures class names, selectors, and element positions so AI agents can `grep` for the exact code you're referring to. Instead of describing "the blue button in the sidebar," you give the agent `.sidebar > button.primary` and your feedback.

## Requirements

- React 18+
- Desktop browser (mobile not supported)

## Docs

Full documentation at [agentation.dev](https://agentation.dev)

## License

© 2026 Benji Taylor

Licensed under PolyForm Shield 1.0.0
