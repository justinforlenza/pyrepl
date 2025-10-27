# Workspace Configuration

This directory is configured as a workspace within the PyREPL monorepo.

## Structure

```
pyrepl/                         # Root project (main app)
├── package.json               # Defines workspaces
├── src/                       # Main PyREPL app
└── promo-generator/          # Workspace (this directory)
    ├── package.json          # @pyrepl/promo-generator
    ├── src/                  # Promo generator code
    └── public/               # Assets and output
```

## How It Works

The root `package.json` declares this directory as a workspace:

```json
{
  "workspaces": ["promo-generator"]
}
```

This allows:
- **Shared dependencies**: Common packages can be hoisted to root `node_modules`
- **Cross-workspace scripts**: Run promo scripts from root via `npm run promo:*`
- **Independent versioning**: Promo generator has its own version and dependencies
- **Isolated development**: Can be worked on separately from main app

## Running Commands

### From Root Directory

```bash
npm run promo:capture   # Run capture script
npm run promo:preview   # Preview video
npm run promo:render    # Render final video
```

These use `npm --prefix promo-generator run <script>` to execute in the workspace.

### From This Directory

```bash
cd promo-generator
npm run capture         # Same as promo:capture
npm run preview         # Same as promo:preview
npm run render          # Same as promo:render
```

## Installing Dependencies

### For This Workspace Only

```bash
cd promo-generator
npm install <package>
```

### For Root Project

```bash
cd ..
npm install <package>
```

## Benefits of Workspace Setup

1. **Separation of Concerns**: Promo generator dependencies don't pollute main app
2. **Optional Feature**: Main app doesn't need Remotion/Playwright unless generating promos
3. **Independent Updates**: Update promo tools without affecting main app
4. **Cleaner Lockfile**: Dependencies clearly scoped to their purpose
5. **Better CI/CD**: Can run promo generation as separate workflow

## Package Manager Note

This project uses npm workspaces. The configuration also works with:
- **Bun workspaces**: Drop-in replacement, faster installs
- **Yarn workspaces**: Compatible syntax
- **pnpm workspaces**: Add `pnpm-workspace.yaml`

To use Bun instead of npm, just replace `npm` with `bun` in all commands.
