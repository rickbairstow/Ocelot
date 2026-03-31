# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Ocelot UI (OUI)** is a Vue 3 component library built with Tailwind CSS v4, published as the `ocelot-ui` npm package. Documentation and demos are hosted at https://ocelotui.netlify.app (auto-deploys on merge to main).

## Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run build            # Build library (outputs UMD + ES module to dist/)
npm run preview          # Preview built library

# Linting
npm run lint             # Run ESLint + Stylelint
npm run lint:fix         # Auto-fix lint issues
npm run eslint           # ESLint only
npm run stylelint        # Stylelint only
npm run prettier:fix     # Format src/ with Prettier

# Storybook
npm run storybook        # Start Storybook dev server on port 6006
npm run build-storybook  # Build static Storybook
npm run test-storybook   # Run Vitest + Playwright tests via Storybook

# CI test workflow (mirrors GitHub Actions)
yarn build-storybook && yarn test-storybook
```

**Note:** GitHub Actions uses Yarn for Storybook tests (npm has a caching bug in CI). Use npm locally.

## Architecture

### Library Build
- Entry point: `.build/index.js` — dynamically imports all `.vue` files from `src/components/`, extracts component names from filenames, and exports them as a default object.
- Build outputs: `dist/ocelot-ui.umd.js`, `dist/ocelot-ui.es.js`, `dist/style.css`
- Vue is a peer dependency (external, not bundled).

### Path Aliases
Defined in `vite.config.js` and `jsconfig.json`:
- `@` → `src/`
- `@Components` → `src/components/`
- `@Composables` → `src/composables/`
- `@Css` → `src/css/`
- `@Utils` → `src/utilities/`

### Composables
- **`useFocusMemory.js`** — Focus management for dialogs: records focused element before open, restores on close, finds first focusable element inside a container.
- **`useIcons.js`** — Tabler icon registry and size constants (xs=12px through 9xl=120px).

### Styling
- Tailwind CSS v4 via `@tailwindcss/postcss` in PostCSS config.
- No scoped CSS in components — purely Tailwind utility classes.
- Dark mode uses `.dark` class.
- Global styles and Vue transitions in `src/css/core.scss`.

### Key Component Patterns
- All components use `<script setup>` (Composition API).
- Form components (`Input`, `Accordion`, etc.) generate unique IDs via `generateUuid()` from `src/utilities/uuid.js` for ARIA linking.
- `Dialog` uses `<Teleport>` to render outside the component tree (target: `#portal-target`) and exposes `open()`, `close()`, `isOpen` via `defineExpose`.
- Prop enums are validated with `validator` functions.
- Input component emits both `update:modelValue` (v-model) and specific `input`/`change` events.

### Testing
- Tests run through Storybook stories — each story can have a `play()` function for interaction testing.
- Accessibility tested automatically via `axe-playwright` in `.storybook/test-runner.js` — violations at minor/moderate/serious/critical impact levels fail the test run.
- Vitest runs in-browser with Playwright/Chromium (configured in `vite.config.js`).

## Code Style
- 4-space indentation (JS, Vue, CSS, SCSS)
- Single quotes, no semicolons (Prettier)
- Single attribute per line in Vue templates
- Strict equality (`===`) enforced by ESLint
- Vue attributes in alphabetical order (ESLint rule)
- Accessibility enforced via `eslint-plugin-vuejs-accessibility`
