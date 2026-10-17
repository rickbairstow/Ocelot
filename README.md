# Ocelot UI

[![Netlify Status](https://api.netlify.com/api/v1/badges/cb306552-9864-4937-8051-80c1cb4177a9/deploy-status)](https://app.netlify.com/projects/ocelotui/deploys)

**Ocelot UI (OUI)**, a UI framework built with Vue 3 and Tailwind CSS, is designed to be highly performant, optimized, and accessible. It strikes a balance by providing essential features without being overly opinionated, allowing for flexibility in your projects.

Head to [OcelotUI on Netlify](https://ocelotui.netlify.app) for the Storybook site — this auto-publishes on every PR merge.

![OcelotUi-anim](https://github.com/user-attachments/assets/0d26c2ef-305c-4d5c-b7c2-e784f8d4484e)

---

## Installation

```bash
npm install ocelot-ui
```

**Consumer prerequisites:** Vue 3.5+ and Tailwind CSS v4. Use the Node.js version supported by your application's build tools. OUI's development Node.js version is not a requirement for consuming the published package.

Optional feature dependencies:

```bash
# Table
npm install @tanstack/vue-table@^9.3.1

# LightboxImage
npm install photoswipe@^5.4.4

# Video
npm install plyr@^3.8.5

# QrCode
npm install qrcode@^1.5.4
```

Install only the packages for the components you actually use. OUI will warn in development if `Table`, `LightboxImage`, `Video`, or `QrCode` is mounted without its matching dependency.

For example:

- `Table` requires `@tanstack/vue-table`
- `LightboxImage` requires `photoswipe`
- `Video` requires `plyr`
- `QrCode` requires `qrcode`

### 1. Configure Tailwind

Import the OUI Tailwind plugin alongside your Tailwind import. This tells Tailwind to scan OUI components so their utility classes are included in your build:

```css
/* your main CSS file */
@import "tailwindcss";
@import "ocelot-ui/tailwind.css";
@custom-variant dark (&:where(.dark, .dark *));
```

### 2. Import the stylesheet

```js
// main.js / main.ts
import 'ocelot-ui/style.css'
```

The stylesheet (`ocelot-ui/style.css`) contains Vue transition styles.

### 3. Import components

Use named imports directly in your components:

```js
import { Button, Dialog, Sidebar } from 'ocelot-ui'
```

TypeScript declarations are included. Composables such as `useToast`, `useCommandPalette`, and `useFormField` are also available as named imports.

### 4. Portal targets

`Dialog`, `Toast`, and `CommandPalette` use Vue Teleport. OUI creates `#portal-target` automatically after mount when it is missing, or you can provide one yourself in `index.html`.

### Table notes

`Table` requires TanStack Table 9. Existing consumers on version 8 must update the optional peer dependency. When using TanStack's typed column helper, v9 takes the feature type before the row type: `createColumnHelper<StockFeatures, YourRow>()`. See the [Vue migration guide](https://tanstack.com/table/latest/docs/framework/vue/guide/migrating).

`Table` includes a built-in settings menu for density, column visibility, and pinning. On small screens it can either stay horizontally scrollable or switch rows into stacked cards with `mobileLayout="card"`.

### CommandPalette notes

`CommandPalette` also teleports to `#portal-target`. Register commands with `useCommandPalette()`, then mount the component once near the app root so it can respond to `Ctrl+K` / `Cmd+K`.

### NavigationBar notes

`NavigationBar` includes desktop nav slots, two-level submenu support, and a `#mobile-menu` slot for small-screen navigation. Use `mobileMenuOpen` / `update:mobileMenuOpen` when the host app needs controlled state.

### Forms and RTL

Storybook includes guidance for form validation integration and RTL support. OUI provides accessible form structure but leaves validation rules, touched/submission state, async checks, and server error mapping to the host app or its chosen validation library. Vee-Validate, Zod, native HTML constraints, and server-driven validation should all feed the same `FormField error` contract.

---

## Dark mode

Toggle dark mode via the `.dark` class on `<html>`:

```html
<html class="dark">...</html>
```

All components and product pattern stories should be checked under the Storybook dark theme before release. New component stories should use semantic Tailwind colours with `dark:` variants for any text, border, or background colour they introduce.

### Design tokens

The `ocelot-ui/tailwind.css` import also provides CSS custom properties for shared styling. Override them in your application's CSS to customise OUI:

```css
:root {
    --oui-radius-lg: 0.75rem;
    --oui-transition-duration: 200ms;
}
```

---

## Local development

This repository uses Node.js **26.12.0**, pinned in `.nvmrc`. GitHub Actions and Netlify use that pin for builds. This is a contributor toolchain setting; the published package does not declare a Node.js engine requirement.

With nvm installed, select the pinned version, install dependencies, and start Storybook:

```bash
nvm install
nvm use
npm ci
npm run storybook
```

On Windows with nvm-windows, use `nvm install 26.12.0` and `nvm use 26.12.0` explicitly.

The development stack currently uses Vue 3.5, Tailwind CSS 4, Vite 8, Storybook 10, Vitest 5, and TypeScript 6. Consumer peer dependency ranges are defined separately in `package.json`.

Before submitting changes, run:

```bash
npm run lint
npm run check-types
npm run test:run
npm run build
```

`npm test` starts Vitest in watch mode for local iteration. Component changes also require relevant Storybook stories and interaction tests.

## Bundle analysis

To inspect the library bundle composition locally, run:

```bash
npm run build:analyse
```

This generates a treemap report at `dist/bundle-analysis.html`.

## Testing

Run `npm run test:run` for component interactions, accessibility checks, and unit tests. No separate Storybook server is required. `npm run test-storybook` runs only the Storybook tests through the same Vitest setup.

To check documentation navigation against the production build, run `npm run build-storybook`, serve it with `npm run preview -- --host 127.0.0.1 --port 6006 --outDir storybook-static`, then run `npm run test:docs` in another terminal. CI runs both the component suite and documentation navigation checks.

---

## Publishing to npm

Releases are handled by the manual `Release Package` GitHub Actions workflow on `main`.

Repository setup:

- Configure npm Trusted Publishing for `release.yml`
- Use the `npm-release` GitHub Environment for release approval protection
- Add only trusted maintainers as required reviewers on that environment
- Configure `RELEASE_GITHUB_TOKEN` (or `RELEASE_PR_TOKEN`) with repository Contents and Pull requests read/write access so release PR checks can run automatically

When running `Release Package`, choose `patch`, `minor`, or `major`. The workflow opens or updates a release PR that bumps `package.json` and `package-lock.json`.

When that release PR is merged to `main`, the same workflow installs Playwright, runs linting, type checking, and tests, builds the package, publishes to npm through Trusted Publishing, pushes the release tag, and creates the matching GitHub Release. If the npm version already exists, the workflow skips npm publish and still creates the missing tag/release.

Do not manually bump the package version for normal releases. Let the release workflow do it.

---

## Netlify

OcelotUI's Storybook is hosted on Netlify at https://ocelotui.netlify.app. PRs automatically deploy on merge to `main`.
