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

**Prerequisites:** Vue 3.5+, Tailwind CSS v4, Node.js 24+

Optional media dependencies:

```bash
# LightboxImage
npm install photoswipe

# Video
npm install plyr

# QrCode
npm install qrcode
```

Install only the packages for the media components you actually use. OUI will warn in development if `LightboxImage`, `Video`, or `QrCode` is mounted without its matching dependency.

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

### 4. Add a portal target for Dialog

```html
<!-- index.html -->
<div id="app"></div>
<div id="portal-target"></div>
```

---

## Dark mode

Toggle dark mode via the `.dark` class on `<html>`:

```html
<html class="dark">...</html>
```

---

## Bundle analysis

To inspect the library bundle composition locally, run:

```bash
npm run build:analyse
```

This generates a treemap report at `dist/bundle-analysis.html`.

---

## Publishing to npm

To publish a new version:

1. Ensure you are on `main` and up to date
2. Run `npm run publish:npm`
3. Select a bump type when prompted: `patch`, `minor`, or `major`
4. The script will bump the version, commit, tag, push to GitHub, and publish to npm

---

## Netlify

OcelotUI's Storybook is hosted on Netlify at https://ocelotui.netlify.app. PRs automatically deploy on merge to `main`.
