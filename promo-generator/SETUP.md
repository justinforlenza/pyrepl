# Promo Generator - Workspace Setup Complete ✅

The promo-generator has been successfully set up as an npm workspace within the PyREPL project.

## What Changed

### 1. Root Package Configuration
- Added `"workspaces": ["promo-generator"]` to root `package.json`
- Removed promo-specific dependencies from root (Remotion, Playwright, etc.)
- Added convenience scripts: `promo:capture`, `promo:preview`, `promo:render`, `promo:voiceover`

### 2. New Workspace Package
- Created `promo-generator/package.json` with its own dependencies
- Package name: `@pyrepl/promo-generator`
- Independent versioning and dependency management

### 3. Updated Paths
- Fixed relative paths in automation scripts
- Updated README with workspace-aware commands
- Added `.gitignore` entries for generated files

## Quick Start

### Installation

```bash
# From project root - installs both main app and workspace
npm install

# Install promo-generator dependencies
cd promo-generator
npm install
cd ..

# Install Playwright browsers
cd promo-generator
npx playwright install chromium
cd ..
```

### Usage

All commands can be run from the project root:

```bash
npm run promo:capture     # Capture footage
npm run promo:preview     # Preview composition
npm run promo:render      # Render final video
npm run promo:voiceover   # Generate AI voiceover (optional)
```

Or from within the promo-generator directory:

```bash
cd promo-generator
npm run capture
npm run preview
npm run render
```

## Workspace Benefits

✅ **Clean Separation**: Promo dependencies isolated from main app
✅ **Optional Feature**: Main app doesn't require video tools
✅ **Independent Updates**: Update promo tools without affecting main app
✅ **Better Organization**: Clear ownership of dependencies
✅ **Flexible Execution**: Run from root or workspace directory

## File Structure

```
pyrepl/
├── package.json              # Root - defines workspaces
├── src/                      # Main PyREPL app
└── promo-generator/          # Workspace
    ├── package.json          # Workspace package
    ├── src/
    │   ├── index.ts
    │   ├── PromoVideo.tsx
    │   ├── MainComposition.tsx
    │   ├── config.ts
    │   ├── scenes/           # 5 scene components
    │   └── automation/
    │       ├── capture.ts
    │       └── generate-voiceover.ts
    ├── public/
    │   ├── footage/          # Generated videos
    │   ├── audio/            # Music & voiceover
    │   └── assets/           # Icons, logos
    ├── out/                  # Rendered output
    ├── remotion.config.ts
    ├── tsconfig.json
    ├── README.md             # Full documentation
    ├── WORKSPACE.md          # Workspace explanation
    └── SETUP.md             # This file
```

## Next Steps

1. **Install dependencies**: `npm install` (from root)
2. **Install promo dependencies**: `cd promo-generator && npm install`
3. **Install Playwright**: `cd promo-generator && npx playwright install chromium`
4. **Test it out**: `npm run promo:capture` (from root)

## Troubleshooting

### "workspace not found" error
- Make sure you ran `npm install` from the project root
- Verify `package.json` has `"workspaces": ["promo-generator"]`

### Dependencies not installing
- Delete `node_modules` and `package-lock.json`
- Run `npm install` from root
- Then `cd promo-generator && npm install`

### Scripts not running
- Use `npm run promo:*` from root, OR
- Use `npm run <script>` from within `promo-generator/`

## Alternative: Using Bun

If you prefer Bun over npm:

```bash
# Install with Bun
bun install

# Run scripts
bun run promo:capture
bun run promo:preview
bun run promo:render
```

The workspace configuration works with both npm and Bun.

---

**See [README.md](README.md) for full documentation and usage guide.**
