---
references:
  - https://signaldb.js.org/llms-full.txt
---
## Project Overview

PyREPL is a web-based Python REPL (Read-Eval-Print Loop) environment built with SvelteKit 2 and Pyodide. It runs Python entirely in the browser using WebAssembly, with persistent storage via IndexedDB for saving multiple REPL sessions.

### Linting/Formatting
This project uses Biome (not ESLint/Prettier). Configuration is in `biome.json`:
- Formatter: 2 spaces, single quotes, semicolons as needed, trailing commas
- Special Svelte overrides disable certain rules (useConst, useImportType, noUnusedVariables, noUnusedImports)

## Architecture

### Package Manager
This project uses `bun` as its package manager

### State Management

The application uses Svelte 5's runes system (`$state`, `$effect`) with a centralized state architecture. All state modules are in `src/lib/state/`:

- **`db.svelte.ts` (DBState)**: Manages REPL sessions in IndexedDB
  - Handles CRUD operations for REPLs
  - Tracks `currentReplId` in localStorage
  - Auto-creates initial REPL if none exists
  - Exposes `ready` flag - check this before DB operations

- **`worker.svelte.ts` (WorkerState)**: Manages the Pyodide Web Worker
  - Tracks `running` and `ready` states
  - Handles bidirectional communication with worker via typed events
  - Callback-based API: `onStdin`, `onStdout`, `onReady`, `onStderr`

- **`terminal.svelte.ts` (TerminalState)**: Terminal UI state
  - Manages xterm.js terminal reference
  - Tracks expansion state and current input line

- **`editor.svelte.ts` (EditorState)**: CodeMirror editor state
  - Simple reactive `value` property for editor content

All state modules are singleton instances exported from `src/lib/state/index.ts`.

### Pyodide Integration

The Python runtime runs in a Web Worker (`src/lib/worker/index.ts`):

- **SharedArrayBuffer Communication**: Uses `Atomics.wait` for blocking stdin reads
  - `syncBuffer`: Int32Array for synchronization flags
  - `inputBuffer`: Uint8Array for text input (1024 bytes)
  - Worker signals stdin request, main thread writes data and wakes worker

- **Event System** (`src/lib/worker/events.ts`): Type-safe message passing
  - `RUN`: Execute Python code
  - `STDIN`/`STDOUT`/`STDERR`: I/O streams
  - `READY`: Worker initialized with buffers
  - `COMPLETE`: Execution finished

- **Vite Configuration**: Custom plugin copies Pyodide files to `static/_app/immutable/workers/`
  - Required files: `pyodide-lock.json`, `pyodide.asm.js`, `pyodide.asm.wasm`, `python_stdlib.zip`
  - Worker format set to ES modules

### Data Persistence

Uses SignalDB  with IndexedDB adapter (`src/lib/db.svelte.ts`):

- **REPLCollection**: Custom collection class with Svelte 5 reactivity integration
  - Schema: `{ id, name, code, created, updated }`
  - Indices on `id` and `name`

### Cross-Origin Isolation

The app requires COOP/COEP headers for SharedArrayBuffer support:
```javascript
// vite.config.ts server headers
'Cross-Origin-Opener-Policy': 'same-origin'
'Cross-Origin-Embedder-Policy': 'require-corp'
```

### Routing

- Uses SvelteKit's static adapter with SPA fallback (`adapter-static`)
- Dynamic base path via `PUBLIC_BASE_PATH` env var
- Route structure: `+page.svelte` (main app), `[...hash]/+page.svelte` (shareable sessions)

## Design System & Styling

The project follows a **high-contrast, minimal** aesthetic with a focus on clarity and readability:

### Color Palette
- Uses UnoCSS Wind preset with Tailwind-style color scales (e.g., `slate-2`, `slate-4`, `blue-8`)
- **High contrast pairings**:
  - Light backgrounds: `bg-slate-50` / `bg-white`
  - Medium backgrounds: `bg-slate-2` (main app background)
  - Dark elements: `bg-black` (terminal)
  - Text: `text-slate-8` (high contrast against light backgrounds)
  - Borders: `border-slate-4` (subtle but visible)

### Typography
- **Primary font**: Space Grotesk (loaded via `@fontsource`)
- **Font size**: 18px for both editor and terminal (consistent reading experience)
- **Font classes**: `font-sans` for UI elements, `font-mono` for version/code

### Component Styling Patterns

**Buttons** (`src/components/ui/Button.svelte`):
- Minimal design with 1px borders (`border-1`)
- Four semantic variants using light backgrounds with colored borders/text:
  - `default`: `bg-slate-50 border-slate-4 text-slate-8`
  - `blue`: `bg-blue-50 border-blue-4 text-blue-8`
  - `green`: `bg-green-50 border-green-4 text-green-8`
  - `red`: `bg-red-50 border-red-4 text-red-8`
- Hover states darken background (`hover:bg-slate-1`)
- All buttons use `rounded` corners (not aggressive rounding)

**Editor/Terminal**:
- Both use `rounded-lg` for consistent corner styling
- Editor: White background with subtle border (`bg-white border-1 border-slate-4`)
- Terminal: Pure black background (`bg-black`) for maximum contrast
- Both use `transition-all` for smooth state changes

### UnoCSS Configuration
- Located in `uno.config.ts`
- Uses scoped mode: `@unocss/svelte-scoped` (styles injected per-component)
- Reset: Tailwind CSS reset via `@unocss/reset/tailwind.css`
- Font provider set to `'none'` (fonts loaded via `@fontsource` instead)

### Styling Guidelines
- **Avoid aggressive styling**: Keep borders thin (1px), rounding subtle (`rounded` or `rounded-lg`)
- **High contrast is key**: Always ensure text is highly readable against backgrounds
- **Consistent spacing**: Use UnoCSS spacing utilities (`px-2`, `gap-4`, etc.)
- **Minimal decoration**: No shadows, gradients, or heavy effects
- **Semantic colors**: Use color variants to communicate action type (green=run, blue=share)

## Key Dependencies

- **Pyodide 0.29.0**: Python runtime in WebAssembly
- **@xterm/xterm**: Terminal emulator via `@battlefieldduck/xterm-svelte` wrapper
- **svelte-codemirror-editor**: Code editor with `@codemirror/lang-python`
- **@signaldb/core + @signaldb/indexeddb**: Reactive database with persistence
- **UnoCSS**: Atomic CSS via `@unocss/svelte-scoped` with Tailwind preset

## Important Notes

- **Worker Communication**: Always check `worker.ready` before calling `worker.run()`
- **DB Operations**: Always check `db.ready` before database operations
- **Svelte 5 Reactivity**: Use runes (`$state`, `$effect`, `$derived`) not stores
- **Type Safety**: Worker events are fully typed - import from `$lib/worker/events`
- **Pyodide Args**: Initialized with `-u` flag for unbuffered output


