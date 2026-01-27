# agentation

Agentation is an agent-agnostic visual feedback tool for AI coding agents. It allows users to annotate web pages and generate structured markdown output that helps agents find the exact code being referred to.

## Project Overview

- **Purpose**: Bridge the gap between visual feedback and code modification for AI agents.
- **Core Functionality**:
  - **Click to Annotate**: Identify elements and generate readable CSS paths.
  - **Text Selection**: Annotate specific content.
  - **Multi-select**: Drag to select multiple elements.
  - **Animation Freeze**: Pause animations to capture specific states.
  - **Structured Output**: Export markdown with selectors, positions, and computed styles.
- **Customizable Shortcuts**: Toggle feedback mode with a customizable keyboard shortcut (default: `Meta+Shift+A`).
- **Key Technologies**: React 18+, TypeScript, SCSS (CSS Modules), `tsup` (esbuild), `vitest`, `pnpm`.

## Architecture

The project is a monorepo structured as follows:

- `_package-export/`: The core library package (`agentation`).
  - `src/components/`: React components.
    - `page-toolbar-css/`: The main `Agentation` toolbar component.
    - `annotation-popup-css/`: The popup for adding comments.
  - `src/utils/`: Core logic utilities.
    - `element-identification.ts`: Logic for generating selectors, names, and computed styles.
    - `source-location.ts`: (Experimental) React fiber tree walking to find source file locations.
    - `storage.ts`: Local storage persistence for annotations.
- `_package-export/example/`: A Next.js 15 application demonstrating the tool's usage.

## Component Props (`AgentationProps`)

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `activationShortcut` | `string` | `"mod+Shift+A"` | Custom keyboard shortcut to toggle the toolbar. |
| `demoAnnotations` | `Annotation[]` | `[]` | List of demo annotations to show in demo mode. |
| `demoDelay` | `number` | `1000` | Delay before showing demo annotations. |
| `enableDemoMode` | `boolean` | `false` | Whether to enable demo mode on mount. |
| `copyToClipboard` | `boolean` | `true` | Whether to automatically copy output to clipboard. |

## Development Commands

### Workspace Root
- `pnpm dev`: Runs both the library in watch mode and the example app.
- `pnpm build`: Builds the library.
- `pnpm example`: Runs the example app only.
- `pnpm pack`: Generates a tarball of the package.

### Core Package (`_package-export`)
- `pnpm build`: Runs `tsup` to build the library (ESM, CJS, d.ts).
- `pnpm watch`: Runs `tsup` in watch mode.
- `pnpm test`: Runs `vitest` unit tests.

## Development Conventions

- **Type Safety**: Strictly typed components and utilities. No `any`.
- **Zero Runtime Dependencies**: Avoid external libraries beyond React and React DOM.
- **SSR Safety**: Use custom SCSS injection logic in `tsup.config.ts` to ensure styles work in Next.js and other SSR environments.
- **"use client"**: All UI components must include the `"use client"` directive.
- **File Naming**: Lowercase with hyphens (e.g., `element-identification.ts`).
- **Style Injection**: Components inject their own styles into the `document.head` to avoid side-effect imports that break some bundlers.

## Key Files

- `_package-export/src/index.ts`: Public API entry point.
- `_package-export/src/components/page-toolbar-css/index.tsx`: Main toolbar implementation.
- `_package-export/src/utils/element-identification.ts`: Selector generation logic.
- `_package-export/tsup.config.ts`: Custom build configuration with SCSS processing.
