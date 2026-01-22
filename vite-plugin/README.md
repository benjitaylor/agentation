# vite-plugin-agentation

Vite plugin that automatically injects [Agentation](https://agentation.dev) into your development server. No code changes required.

## Install

```bash
npm install vite-plugin-agentation -D
```

## Usage

Add the plugin to your `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import agentation from 'vite-plugin-agentation'

export default defineConfig({
  plugins: [react(), agentation()]
})
```

Start your dev server and Agentation appears automatically.

## How it works

The plugin hooks into Vite's dev server and:

1. Injects a script tag into the HTML response
2. The script creates a container element and mounts the Agentation React component
3. Agentation loads from the `agentation` npm package (must be installed separately)

The plugin only runs in dev mode (`apply: 'serve'`), so it's automatically excluded from production builds.

## Options

```ts
agentation({
  enabled: true // default: true - set to false to disable
})
```

## Requirements

- Vite 4, 5, 6, or 7
- React 18+ (peer dependency of `agentation`)
- `agentation` package installed

## Why use this over direct import?

The Vite plugin approach is useful when you want to add Agentation to an existing project without modifying application code. It's also convenient for teams where not everyone needs the feedback tool—developers can install the plugin locally without affecting the shared codebase.

For full control over placement and rendering, use the direct import method instead:

```tsx
import { Agentation } from 'agentation'

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && <Agentation />}
    </>
  )
}
```

## License

© 2026 Benji Taylor
Licensed under PolyForm Shield 1.0.0
