# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

**Ocelot UI (OUI)** is a Vue 3 component library built with Tailwind CSS v4, published as the `ocelot-ui` npm package. Documentation and demos are hosted at https://ocelotui.netlify.app (auto-deploys on merge to main).

## Commands

```bash
# Development
npm run build            # Build library (outputs to dist/)
npm run build:analyse    # Build library + generate bundle treemap report
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
npm run test-storybook   # Run Vitest + Playwright tests against built Storybook

# Testing (no Storybook server required)
npm run test             # Run Vitest directly — faster for iteration; no build step needed

# CI test workflow
npm run build-storybook && npm run test-storybook

```

## Releases

- Releases are handled by the manual `Release Package` GitHub Actions workflow on `main`.
- Do not hand-edit `package.json` versions for normal releases. Let the release workflow open a release PR that bumps `package.json` and `package-lock.json`.
- Use `patch` for fixes and small compatible improvements, `minor` for new compatible components/features, and `major` for breaking changes.
- Package-impacting changes do not need release note files.

## Architecture

### Library Build
- Entry point: `.build/index.ts` — dynamically imports all `.vue` files from `src/components/`, extracts component names from filenames, and exports them as a default object.
- Build outputs:
    - `dist/ocelot-ui.umd.js` — UMD bundle (CommonJS consumers)
    - `dist/ocelot-ui.es.js` — ES module bundle
    - `dist/style.css` — Vue transition styles only. Tailwind CSS is a peer dependency; consumers add `@import "ocelot-ui/tailwind.css"` to their Tailwind CSS to auto-scan OUI component classes.
    - `tailwind.css` (root, published) — Static Tailwind plugin file containing `@source` pointing at the ES bundle. Consumers import this; not processed by the Vite build.

### Path Aliases
Defined in `vite.config.ts` and `jsconfig.json`:
- `@` → `src/`
- `@Components` → `src/components/`
- `@Composables` → `src/composables/`
- `@Css` → `src/css/`
- `@Utils` → `src/utilities/`

### Composables
- **`useFocusMemory.js`** — Focus management for dialogs: records focused element before open, restores on close, finds first focusable element inside a container.
- **`useIcons.js`** — Tabler icon registry and size constants (xs=12px through 9xl=120px).

### Styling
- Tailwind CSS v4 is a **peer dependency** — consumers must have it configured in their own project.
- Components use standard Tailwind utility classes (no prefix).
- Dark mode uses `.dark` class. Consumers must add `@custom-variant dark (&:where(.dark, .dark *))` to their own Tailwind CSS.
- `src/css/core.scss` — Vue transition styles only. Imported by `.build/index.ts`, output as `dist/style.css`.
- `src/css/storybook.css` — Tailwind + dark variant import for Storybook only. Not included in the library build.
- `@tailwindcss/vite` plugin in `vite.config.ts` drives Tailwind during library builds and Storybook.

### Key Component Patterns
- All components use `<script setup>` (Composition API).
- Form components (`Input`, `Accordion`, etc.) generate unique IDs via `generateUuid()` from `src/utilities/uuid.js` for ARIA linking.
- `Dialog` uses `<Teleport>` to render outside the component tree (target: `#portal-target`) and exposes `open()`, `close()`, `isOpen` via `defineExpose`.
- Prop enums are validated with `validator` functions.
- Input component emits both `update:modelValue` (v-model) and specific `input`/`change` events.

### Testing
- Tests run through Storybook stories — each story can have a `play()` function for interaction testing.
- Accessibility tested automatically via `axe-playwright` in `.storybook/test-runner.js` — violations at minor/moderate/serious/critical impact levels fail the test run.
- Vitest runs in-browser with Playwright/Chromium (configured in `vite.config.ts`).

**Requirements for every change:**
1. Run `npm run lint` to check for errors; `npm run lint:fix` to auto-fix. All lint errors must be resolved.
2. Run `npm run test` for fast iteration, or `npm run build-storybook && npm run test-storybook` for the full CI workflow. All tests must pass.
3. Every component **must** have a Storybook story file (`src/stories/components/<ComponentName>.stories.ts`).
4. Every story file must include relevant `play()` interaction tests covering the component's core behaviour and edge cases.
5. New stories are not optional — they are part of the definition of done for every component addition or modification.

## Code Style
- 4-space indentation (JS, Vue, CSS, SCSS)
- Single quotes, no semicolons (Prettier)
- Single attribute per line in Vue templates
- Strict equality (`===`) enforced by ESLint
- Vue attributes in alphabetical order (ESLint rule)
- Accessibility enforced via `eslint-plugin-vuejs-accessibility`
