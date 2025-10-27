# PyREPL Promo Video Generator

Fully automated, code-based promo video generator that captures the real PyREPL app and composes a professional 30-second video with animations, text overlays, and optional AI voiceover.

## Prerequisites

```bash
bun install
```

## Quick Start

### 1. Install Playwright Browsers

```bash
bunx playwright install chromium
```

### 2. Capture Real App Footage

This launches your dev server and automatically records the app in action:

```bash
bun run promo:capture
```

**What it does:**
- Starts PyREPL dev server at `localhost:5173`
- Opens Chromium browser
- Executes scripted actions (typing code, clicking Run, sharing, managing REPLs)
- Saves video clips to `promo-generator/public/footage/`

**Output files:**
- `run-code.mp4` - Typing and running Python code
- `share-code.mp4` - Clicking Share button
- `manage-repls.mp4` - Switching between multiple REPLs

### 3. Preview the Composition

Launch Remotion's interactive preview:

```bash
bun run promo:preview
```

This opens a browser where you can:
- Scrub through the timeline
- See all scenes with animations
- Test timing and transitions
- Make quick edits to scene components

### 4. Render Final Video

Export the final MP4:

```bash
bun run promo:render
```

**Output:** `promo-generator/out/promo.mp4`

## Customization

### Edit Scene Content

Open [`src/config.ts`](src/config.ts) to modify:

```typescript
export const SCENES: SceneConfig[] = [
  {
    name: 'hook',
    durationInSeconds: 5,
    title: 'PyREPL',
    subtitle: 'Python. Anywhere. No setup.',
    voiceover: 'Python. Anywhere. No setup.',
  },
  // ... edit duration, text, emoji for each scene
];
```


## Adding Background Music

1. Add an MP3 file to `promo-generator/public/audio/background.mp3`
2. Update `src/config.ts`:
   ```typescript
   export const AUDIO_CONFIG = {
     backgroundMusic: 'background.mp3',
     musicVolume: 0.3,
   };
   ```
3. Import and use in `MainComposition.tsx`:
   ```tsx
   import { Audio } from 'remotion';
   <Audio src={staticFile('audio/background.mp3')} volume={0.3} />
   ```

## License

Same as parent project (AGPL-3.0-only)
