# agentation-rn

React Native support for [Agentation](https://agentation.dev) - Visual feedback for AI coding agents.

Tap components in your app to create annotations, then copy structured markdown output for AI tools like Claude Code.

## Installation

```bash
npm install agentation-rn
# or
yarn add agentation-rn
# or
pnpm add agentation-rn
```

### Peer Dependencies

```bash
npm install react-native-safe-area-context
```

Optional (for enhanced features):
```bash
npm install @callstack/liquid-glass react-native-svg
```

## Quick Start

```tsx
import { Agentation } from 'agentation-rn';

export default function App() {
  return (
    <Agentation
      onAnnotationAdd={(annotation) => console.log('Added:', annotation)}
      onCopy={(markdown) => {
        // Send to your AI tool
        console.log('Markdown:', markdown);
      }}
    >
      <YourApp />
    </Agentation>
  );
}
```

## Features

- **Tap to Annotate** - Tap any component to create an annotation
- **Component Detection** - Automatically identifies React components with file paths and line numbers
- **Structured Output** - Generates AI-ready markdown with element context
- **4 Detail Levels** - compact, standard, detailed, forensic
- **Settings Persistence** - Saves preferences via AsyncStorage
- **Navigation Support** - Detects React Navigation routes

## API

### `<Agentation>`

Main wrapper component. Provides annotation functionality to your entire app.

```tsx
<Agentation
  onAnnotationAdd={(annotation) => {}}     // Called when annotation created
  onAnnotationUpdate={(annotation) => {}}  // Called when annotation edited
  onAnnotationDelete={(annotation) => {}}  // Called when annotation deleted
  onAnnotationsClear={(annotations) => {}} // Called when all cleared
  onCopy={(markdown) => {}}                // Called when markdown copied
>
  <YourApp />
</Agentation>
```

### Mobile-Specific APIs

#### `useAgentationScroll`

Required for ScrollViews - keeps annotation markers positioned correctly during scroll.

```tsx
import { useAgentationScroll } from 'agentation-rn';

function MyScreen() {
  const { onScroll, scrollEventThrottle } = useAgentationScroll();

  return (
    <ScrollView
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
    >
      {/* Your content */}
    </ScrollView>
  );
}
```

#### `<AgenationView>`

For Modals and Sheets - provides isolated annotation context since iOS modals render outside the normal view hierarchy.

```tsx
import { AgenationView } from 'agentation-rn';
import { Modal } from 'react-native';

function MyModal({ visible, onClose }) {
  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <AgenationView>
        <ModalContent />
      </AgenationView>
    </Modal>
  );
}
```

### Hooks

#### `useAnnotations`

Low-level hook for custom annotation UIs.

```tsx
import { useAnnotations } from 'agentation-rn';

const {
  annotations,
  addAnnotation,
  updateAnnotation,
  deleteAnnotation,
  clearAnnotations,
  copyToClipboard,
  settings,
  updateSettings,
} = useAnnotations({ screenName: 'MyScreen' });
```

### Utilities

```tsx
import {
  // Component detection
  detectComponent,
  identifyElement, // alias for detectComponent
  formatElementPath,
  getElementPath,  // alias for formatElementPath

  // Markdown generation
  generateMarkdown,
  generateSimpleMarkdown,

  // Storage
  saveAnnotations,
  loadAnnotations,
  clearAnnotations,

  // Helpers
  copyToClipboard,
  generateId,
} from 'agentation-rn';
```

## Platform Support

| Platform | Status |
|----------|--------|
| iOS | Supported |
| Android | Supported |
| React Native | >= 0.72.0 |
| React | >= 18.0.0 |

### Navigation Support

| Library | Status |
|---------|--------|
| React Navigation | Supported |
| Expo Router | Coming soon |

## Output Example

When you copy annotations, you get structured markdown:

```markdown
# App Feedback - MyScreen

## Annotation 1
- **Element:** Button (src/components/Button.tsx:42)
- **Comment:** This button should be larger
- **Position:** x: 150, y: 320

## Annotation 2
- **Element:** Text (src/screens/Home.tsx:18)
- **Comment:** Font size too small on mobile
- **Position:** x: 20, y: 180
```

## Running the Example

```bash
cd packages/agentation-rn/example
pnpm install

# iOS
pnpm ios

# Android
pnpm android
```

## License

PolyForm-Shield-1.0.0
