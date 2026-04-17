# Ocelot UI — Component Library Roadmap

> **Status:** Planning document · April 2026  
> **Current version:** 0.0.21 · 23 components · 53 registered icons

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Competitive Landscape](#2-competitive-landscape)
3. [Icon Library — The Critical Problem](#3-icon-library--the-critical-problem)
4. [Theming & Design Tokens](#4-theming--design-tokens)
5. [Existing Component Improvements](#5-existing-component-improvements)
6. [Missing Components](#6-missing-components)
7. [Forms & Inputs (Brief)](#7-forms--inputs-brief)
8. [Cross-Cutting Technical Concerns](#8-cross-cutting-technical-concerns)
9. [UX Laws Applied](#9-ux-laws-applied)
10. [Developer Experience](#10-developer-experience)
11. [Storybook Requirements](#11-storybook-requirements)
12. [Prioritised Roadmap](#12-prioritised-roadmap)

---

## 1. Current State Assessment

### What exists (23 components)

| Category | Components |
|---|---|
| Core UI | Accordion, Badge, Button, Card, Dialog, Divider, Heading, Icon, Label, Loader, Placeholder |
| Forms | Input |
| Media | Image, LightboxImage, QrCode, Video |
| Overlay | FloatingPanel, Scrim, Sidebar, Toast |
| Content | ReadMore |
| Demo | HelloWorld |

### Strengths

- **Accessibility-first** — Axe integrated into the Storybook test runner, live regions on Toast, focus management via `useFocusMemory`, semantic HTML throughout.
- **Tailwind v4 peer dep** — Consumers own their CSS; zero style leakage; OUI classes are tree-shaken naturally.
- **Composable architecture** — `useToast`, `useLightboxRegistry`, `useFocusMemory` are reusable outside their paired component.
- **Advanced media** — LQIP blur-up on Image, multi-format video (HTML5/YouTube/Vimeo), PhotoSwipe lightbox, and QR code generation are well above the average component library offering.
- **FloatingPanel** — Full Floating UI integration (flip, shift, arrow, all placement modes) with click/hover/all interaction modes is genuinely solid. Most libraries charge for this.
- **Testing infrastructure** — Vitest + Playwright + Axe is a modern, comprehensive testing stack. The test-runner hook that injects Axe before every story is a particularly strong pattern.

### Gaps at a glance

- No navigation patterns (Tabs, Breadcrumb, Pagination, Steps/Stepper).
- No form primitives beyond a single text Input (no Select, Checkbox, Radio, Switch, Textarea).
- No data display patterns (Table, Avatar, Timeline, Stats card, Progress, Code block).
- No inline feedback component (Alert/Banner — Toast is a notification, not a substitute for inline validation or status messaging).
- Icon system is hard-coded to 53 icons with no consumer-extensibility path and no way to pass a Vue component directly.
- Button has no icon support — every UI framework treats icon+label buttons as first-class.
- Card has a flat prop surface where composable slot-based sub-components are expected.
- Accordion cannot be grouped for exclusive-open behaviour.
- No theming story — consumers have no documented way to customise colours, radii, or spacing beyond overriding Tailwind config.

---

## 1a. Dependency Architecture Review

Before adding anything new, the existing dependency model warrants scrutiny. Several runtime dependencies ship with the library bundle and add real weight that consumers cannot opt out of.

### Current full dependencies (not peer)

| Package | Version | Size (approx.) | Issue |
|---|---|---|---|
| `@tabler/icons-vue` | ^3.41.1 | ~2MB (full) / tree-shaken | Used by `useIcons.ts` — tree-shaking is only partial unless consumer imports directly |
| `@floating-ui/dom` | ^1.7.6 | ~15KB gzip | Reasonable; used by FloatingPanel |
| `photoswipe` | ^5.4.4 | ~18KB gzip | Only used by LightboxImage — consumers without galleries pay for it |
| `plyr` | ^3.8.4 | ~38KB gzip | Only used by Video — consumers without video pay for it |
| `qrcode` | ^1.5.4 | ~25KB gzip | Only used by QrCode — consumers without QR pay for it |
| `culori` | ^4.0.2 | ~8KB gzip | Currently unused beyond potential ColorPicker — dead weight today |

### Recommended actions

1. **`photoswipe`, `plyr`, `qrcode`** — move to `peerDependencies` (optional). Consumers must install them only if they use `LightboxImage`, `Video`, or `QrCode` respectively. Provide clear installation instructions and a dev-mode warning if the library is used but not installed.

2. **`culori`** — currently has no active consumer in the library. Remove from dependencies until a `ColorPicker` component is actively being built. Adds dead weight today.

3. **`@floating-ui/dom`** — keep as a full dependency. It is used by FloatingPanel (core) and will be used by Combobox, DropdownMenu, and Tooltip. The size is acceptable and consumers get it automatically.

4. **`@tabler/icons-vue`** and **`@tabler/icons`** — keep as full dependencies for the registry. After the hybrid icon prop is implemented (§3), the registered subset is small; the rest tree-shakes. Document that consumers should import directly from `@tabler/icons-vue` for icons outside the registry rather than expecting OUI to bundle them.

### Impact on bundle budget

After moving optional heavy deps to peer deps:
- **Consumers using no media components:** bundle drops by ~80KB gzip
- **Consumers using LightboxImage + Video + QrCode:** no change (they install the deps anyway)

This is a significant DX win and should happen in Phase 1, not Phase 4.

---

## 2. Competitive Landscape

Understanding what the top libraries do informs both what to build and how to build it.

### TailwindUI

- Ships polished HTML/JSX patterns (not a headless library) — sets the **gold standard for visual design and component composition patterns**.
- Every pattern ships with a dark mode variant, responsive breakpoints, and realistic copy as defaults.
- Organises patterns into Application UI, Marketing, and Ecommerce — a useful taxonomy to borrow when structuring Storybook categories.
- Uses named slots aggressively: `header`, `footer`, `actions`, `description` are always explicit, never implied.
- **Key lesson:** Components should look finished out of the box, with no consumer CSS required for a production-quality result. Slot naming conventions should be consistent across all components.

### Headless UI (Tailwind Labs)

- Fully headless (behaviour-only, no styles). The definitive reference for **keyboard navigation and ARIA correctness** — especially on Listbox, Combobox, Menu, and Dialog.
- Its `Dialog` component traps focus, restores it on close, and handles `aria-modal`. OUI's Dialog already does this — good alignment.
- Listbox and Combobox implementations are the closest thing to a reference spec for accessible selects.
- **Key lesson:** Complex interactive components need an exhaustive keyboard navigation spec before implementation begins, not after.

### Radix UI / shadcn/ui

- Radix is the headless primitive layer; shadcn wraps it with Tailwind and makes the source editable.
- Icons are **never bundled** — consumers import from `lucide-react` or any other icon library and pass the component as a prop.
- Every Radix component exposes a composable sub-component API: `Dialog.Root`, `Dialog.Trigger`, `Dialog.Content`, `Dialog.Title`, `Dialog.Close`. This makes ARIA relationships automatic.
- **Key lesson:** The icon-as-prop pattern is the correct approach for a component library. Sub-component APIs (`Tabs.Root` / `Tabs.List` / `Tabs.Trigger` / `Tabs.Content`) are cleaner than a monolithic component with many props.

### Mantine

- Richest feature set of any open-source React library (~120 components). Well worth browsing for component ideas.
- Ships its own icon wrapper but also allows any component as `leftSection` / `rightSection` on every input-adjacent component — a consistent compositional pattern.
- Form integration uses `useForm` composable that propagates error states via React context (equivalent to Vue's `provide/inject`).
- Exposes `--mantine-color-*` CSS custom properties for every palette colour, allowing deep theming without framework coupling.
- **Key lesson:** Consistent slot naming (`leftSection`/`rightSection`) used across all inputs creates a predictable API. CSS custom property theming is the most framework-agnostic approach.

### Nuxt UI v3 / PrimeVue

- Nuxt UI v3 is Tailwind v4 based — the closest direct competitor to OUI in the Vue ecosystem.
- Uses `ui` prop pattern for Tailwind class overrides: `<UButton :ui="{ base: 'rounded-full' }" />` — powerful but potentially too much surface area for OUI's goals.
- PrimeVue ships theme tokens as CSS custom properties with a theme builder — comprehensive but heavy.
- **Key lesson:** Consumers will want some customisation path. A documented `:class` override pattern or CSS custom properties for key values (border-radius, primary colour) is sufficient to start with.

### Patterns OUI should adopt

1. **Icon-as-prop** alongside string-based lookup (shadcn/Nuxt UI model).
2. **Consistent slot naming** across all components: `#prefix`, `#suffix`, `#header`, `#footer`, `#actions`, `#empty`, `#icon`.
3. Every interactive component ships with a **complete keyboard specification** documented in its Storybook story.
4. **Dark mode is not optional** — every component story must work correctly in both modes.
5. **Responsive behaviour** must be documented per component, not assumed.
6. **Sub-component APIs** for complex components (Tabs, DropdownMenu, Table, Stepper).

---

## 3. Icon Library — The Critical Problem

### The problem

`useIcons.ts` maintains a hard-coded registry of 53 Tabler icons. Adding icons requires editing a library file, rebuilding, and publishing a new package version. Consumers cannot add their own icons. The registry cannot scale.

Importing every Tabler icon (`@tabler/icons-vue` exports 5,000+) would add approximately 2MB to the bundle — completely unacceptable for a library.

### Recommended solution: Hybrid icon prop

Change the `icon` prop on the `Icon` component to accept **either**:

- A `string` — resolved against the internal registry (fully backwards-compatible with all current consumers)
- A **Vue component** — rendered directly via Vue's dynamic component (`<component :is="..." />`)

```vue
<!-- String — current API, backwards-compatible -->
<OuiIcon icon="Check" size="lg" />

<!-- Component — new, consumer controls their own bundle -->
<script setup>
import { IconBrandGithub } from '@tabler/icons-vue'
</script>
<OuiIcon :icon="IconBrandGithub" size="lg" />
```

The `Icon.vue` implementation resolves the prop by checking `typeof icon === 'string'` to decide between registry lookup and direct component rendering. No breaking changes.

This is identical to how shadcn/ui, Nuxt UI, and Mantine handle icons. It is the correct pattern for a component library.

### Consumer extensibility via `registerIcons()`

Export a `registerIcons(map: Record<string, Component>)` function from the library entry point. Consumers call it once at app initialisation to augment the registry:

```js
// consumer's main.js
import { registerIcons } from 'ocelot-ui'
import { IconBrandGithub, IconBrandLinkedin, IconWorld } from '@tabler/icons-vue'

registerIcons({
    BrandGithub: IconBrandGithub,
    BrandLinkedin: IconBrandLinkedin,
    World: IconWorld,
})
```

After this call, `<OuiIcon icon="BrandGithub" />` works anywhere in their app without needing to import the icon component at each usage site. The registry is a simple reactive `Map` (or plain object) shared via module scope — no Pinia or Vue `provide` needed.

### TypeScript

- Export `IconName` as a string union type covering all built-in registry keys.
- Export `IconProp` as `IconName | Component` — the type for the `icon` prop on `Icon` and any component that accepts an icon.
- Consumers who use `registerIcons()` will get autocomplete on their registered names if they augment the `IconName` type via TypeScript module augmentation (document this pattern).

```ts
// consumer's types.d.ts — optional, for autocomplete on custom icons
declare module 'ocelot-ui' {
    interface OuiIconRegistry {
        BrandGithub: true
        BrandLinkedin: true
    }
}
```

### Curate and expand the built-in registry

Grow from 53 to ~120 essential icons covering categories every product UI needs. Audit against TailwindUI's icon usage:

| Category | Icons to add |
|---|---|
| UI actions | MoreHorizontal, MoreVertical, GripVertical, GripHorizontal, Refresh, Expand, Collapse, PinFilled, Pin, Copy, Clipboard, ClipboardCheck |
| Navigation | ExternalLink, Anchor, Link, Unlink, ChevronUpDown |
| Status | Clock, ClockFilled, CircleDashed, CircleMinus, AlertCircle, Ban, Shield, ShieldCheck, ShieldX |
| Form | Eye, EyeOff, Calendar, CalendarEvent, Lock, LockOpen, Upload, Paperclip, At, Hash, CurrencyDollar, CurrencyEuro, CurrencyPound |
| Communication | MessageCircle, MessageSquare, Send, Share, ShareNetwork, Rss |
| Data | SortAscending, SortDescending, Filter, Columns, LayoutGrid, LayoutList, Table |
| File | File, FileText, FilePdf, FileZip, Folder, FolderOpen |
| Social | BrandFacebook, BrandInstagram, BrandTiktok (already have GitHub, YouTube, etc.) |
| Misc | Sun, Moon, Palette, Terminal, Globe, Fingerprint, QrCode (already have Loader variants) |

### Storybook updates for icons

- Update `useIcons.mdx` to document both string and component usage patterns with working code examples.
- Update `useIcons.mdx` to document `registerIcons()` with the TypeScript module augmentation pattern.
- Add a new `Icon Grid` story that renders every registered icon in all 9 sizes — useful as a visual reference and as a regression check when icons are added.
- Add a `Custom Icon` story that demonstrates passing a `@tabler/icons-vue` component directly as the `icon` prop.

---

## 4. Theming & Design Tokens

This area is currently undocumented — consumers have no defined way to customise the visual appearance of OUI components.

### The problem

OUI uses Tailwind utility classes directly. If a consumer wants a different primary colour, border radius, or font family, they must override Tailwind config. This works but is undocumented and fragile — an OUI upgrade could change class names and silently break consumer overrides.

### Recommended approach: CSS custom properties for key values

Expose a small set of CSS custom properties that OUI components reference for the values that consumers are most likely to want to change. These should live in a `:root` block in `tailwind.css` (the file consumers already import):

```css
/* tailwind.css — additions */
:root {
    --oui-radius: 0.375rem;       /* base border-radius */
    --oui-radius-sm: 0.25rem;
    --oui-radius-lg: 0.5rem;
    --oui-radius-full: 9999px;    /* pill buttons, badges */
    --oui-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    --oui-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --oui-ring-width: 2px;
    --oui-ring-offset: 2px;
    --oui-transition-duration: 150ms;
    --oui-font-sans: inherit;     /* inherits consumer's font by default */
}
```

Components reference these in their Tailwind classes via the `[var(--oui-...)]` arbitrary value syntax where needed, and via a thin `tailwind.css` preset that maps them to theme values.

### What NOT to do

- Do not expose a `--oui-primary-*` colour scale — consumers already configure Tailwind colours. OUI should use their Tailwind colour config, not override it.
- Do not build a full design token system at this stage — that becomes a product in itself. Cover the 20% of customisation that addresses 80% of requests (radius, shadow, transition speed).

### Storybook: Design System documentation

Add a Storybook section called **Design System** with the following MDX pages:
- **Colour Palette** — already exists; expand to show how OUI uses each colour semantically
- **Typography** — document the heading scale, body text expectations, and font inheritance
- **Spacing & Sizing** — document the size scales used across Button, Badge, Icon, etc. and how they map to Tailwind spacing
- **Border Radius & Shadow** — document the CSS custom properties and how to override them
- **Motion & Transitions** — document transition durations and the `prefers-reduced-motion` behaviour (see §8)

---

## 4a. Component API Standards

Before building new components or refactoring existing ones, OUI needs an explicit, documented API contract that all components follow. Without this, every new component will make subtly different choices — and consumers will find inconsistencies that erode trust in the library.

### Naming conventions

**Component names:** All components are named in `PascalCase` and exported without a prefix (e.g. `Button`, `Dialog`). However, consumers registering components globally will likely want to prefix them to avoid conflicts with native HTML elements or other libraries. The library should:
- Export components under their plain name (`Button`, `Dialog`).
- Document in the Installation guide that global registration should use a prefix: `app.component('OuiButton', Button)`.
- Generate `components.d.ts` with the `Oui` prefix so Volar autocomplete uses `<OuiButton>`.
- Consider adding an `install` plugin helper: `app.use(OcelotUI, { prefix: 'Oui' })` that registers all components under the configured prefix.

**Prop names:** Follow these conventions consistently across all components:

| Concept | Prop name | Example values |
|---|---|---|
| Colour | `color` (American English — already used) | `'blue' \| 'green' \| 'red'` etc. |
| Visual style | `variant` | `'primary' \| 'secondary'` etc. |
| Size | `size` | `'sm' \| 'md' \| 'lg'` |
| Disabled state | `disabled` | `boolean` |
| Loading state | `loading` | `boolean` |
| Icon (prefix) | `prefixIcon` | `IconProp` |
| Icon (suffix) | `suffixIcon` | `IconProp` |
| ARIA label | `ariaLabel` | `string` |

**Slot names:** Follow this vocabulary consistently across all components:

| Slot | Purpose |
|---|---|
| `#default` | Primary content (not explicitly named) |
| `#header` | Top section of a container component |
| `#footer` | Bottom section of a container component |
| `#media` | Image or visual content area |
| `#actions` | Action buttons (typically right-aligned in footer) |
| `#icon` | Icon override (replaces a default type-based icon) |
| `#prefix` | Content before the main input (input adornment) |
| `#suffix` | Content after the main input (input adornment) |
| `#empty` | Shown when a list/table has no data |
| `#loading` | Shown when content is loading |
| `#trigger` | The element that opens an overlay (FloatingPanel, Tooltip, DropdownMenu) |

Any deviation from this vocabulary must be explicitly justified and documented.

### Event naming

All emitted events use camelCase names and follow these conventions:

| Pattern | Event name | Payload |
|---|---|---|
| v-model binding | `update:modelValue` | the new value |
| User opens something | `open` | — |
| User closes something | `close` | — |
| User removes an item | `remove` | the removed item |
| User dismisses | `dismiss` | — |
| User changes a selection | `change` | the new value |
| User types | `input` | the input event |
| User sorts | `sort` | `{ key: string, direction: 'asc' \| 'desc' }` |

### `defineExpose` standards

Overlay components (Dialog, Sidebar, FloatingPanel, Toast, Tooltip, Popover, CommandPalette) must consistently expose:

```ts
defineExpose({
    open: () => void,
    close: () => void,
    isOpen: Ref<boolean>,
})
```

Other components may expose additional methods (e.g. Dialog's `ConfirmDialog` exposes a `confirm()` Promise). All exposed methods must be typed — no untyped `any` on the exposed interface.

### Vue 3.5 feature opportunities

OUI targets Vue ^3.5.0. Several Vue 3.5 features improve the codebase and should be adopted in new components:

- **`useTemplateRef()`** — replace `ref(null)` + `:ref="el"` with the type-safe `useTemplateRef<HTMLElement>('myRef')`. Cleaner and avoids the possibility of mistyping the ref name string.
- **Reactive props destructuring** — `const { size = 'md', color = 'blue' } = defineProps<Props>()` instead of `props.size`, `props.color`. Reduces verbosity.
- **`defineModel()`** (stable in 3.4, widely available in 3.5) — simplifies v-model components. Use instead of manual `modelValue` prop + `update:modelValue` emit.
- **`onWatcherCleanup()`** — use in composables that set up subscriptions (e.g. `useLightboxRegistry`) for cleaner cleanup without manual `onUnmounted` + `stop()` calls.

Existing components should be migrated to these patterns opportunistically (not as a separate migration pass), primarily when they are touched for other improvements.

---

## 5. Existing Component Improvements

### Button

**Current gaps vs. TailwindUI standard:**
- No built-in icon support — consumers must compose `Icon` + `Button` manually with no guaranteed spacing or alignment.
- No `ButtonGroup` for segmented button patterns.
- The `small` variant may not meet 44×44px minimum touch target on mobile (Fitts's Law violation).
- No icon-only (square) variant with enforced `aria-label`.

**Recommended improvements:**

1. **`prefixIcon` and `suffixIcon` props** — accept `IconProp` (string or Component, matching the new hybrid icon API). Render with correct spacing between icon and label. When both `prefixIcon` and `suffixIcon` are used with no label slot, warn in dev that `aria-label` is required.
2. **`iconOnly` prop** — switches to square aspect ratio, ensures adequate touch target via padding, enforces `aria-label` requirement in dev mode.
3. **`ButtonGroup` component** — a wrapper that:
   - Removes border radius on interior children (`[&:not(:first-child):not(:last-child)]:rounded-none`)
   - Collapses margins between buttons
   - Accepts `orientation` (horizontal/vertical)
   - Accepts `size` and `variant` to pass down to all children (avoiding repeated props)
4. **Touch target audit** — the `small` variant's click area must be ≥ 44×44px. Add invisible padding or use `min-h-[44px] min-w-[44px]` on the outer element.
5. **Story additions:** icon-only (all colours), icon + label (prefix and suffix), ButtonGroup horizontal, ButtonGroup vertical, all size × variant matrix.

### Badge

**Recommended improvements:**

1. **`dot` variant** — a coloured circle with no label text. Used for status indicators, online/offline presence, notification dots. Sizes: sm (6px), md (8px, default), lg (10px).
2. **`removable` prop** — appends a close (×) `<button>` element. Emits `@remove`. The close button must have `aria-label="Remove [badge label]"` (WCAG 2.5.3 Label in Name).
3. **`outline` variant** — border colour only, transparent background. Useful for secondary labels that should not compete visually with content.
4. **`truncate` prop** — for dynamically generated labels that may overflow their container.
5. **Story additions:** dot (all colours, all sizes), removable (play function tests @remove event), outline, truncated label, badge in context inside Card and Avatar.

### Card

The current flat-prop API becomes limiting quickly. A slot-based approach is the industry standard (TailwindUI, Mantine, Nuxt UI all use it).

**Recommended improvements:**

1. **Named slots:** `#media` (replaces `imageSrc` prop), `#header` (title area), `#content` (main body, replaces default slot), `#footer`, `#actions` (button area, right-aligned by convention)
2. **Keep backwards compatibility** — the existing `imageSrc`, `title`, and `badges` props should continue to work as a convenience layer that populates the corresponding slots.
3. **`clickable` prop** — makes the entire card an interactive element (`role="button"` or wraps in `<a>`) with hover/focus states. Common in dashboards and selection UIs.
4. **`selected` prop** — adds a visual selected state (ring, tick icon). For use in selection UIs alongside `clickable`.
5. **`variant` prop:** `default` (white/surface), `bordered` (no shadow, explicit border), `flat` (no shadow, no border — for use inside already-bordered containers)
6. **Story additions:** all slot combinations, clickable card, selectable card (play function toggles selection), card grid layout (3-up, 4-up), horizontal card variant.

### Accordion

**Recommended improvements:**

1. **`AccordionGroup` wrapper** — controls which child `Accordion` is currently open. Props: `exclusive` (bool, default: true — only one open at a time), `defaultOpen` (index or ID). The Group passes state down via `provide/inject`.
2. **`variant` prop on `Accordion`:** `default` (bordered individual panel), `flush` (no outer border, dividers only — common in sidebars), `contained` (box with background — common in cards).
3. **`id` prop** — allow consumers to control the item's identity for use with `AccordionGroup`'s `defaultOpen`.
4. **`expandIcon` slot** — override the default chevron with any content.
5. **ARIA improvement** — the native `<details>/<summary>` element is used currently, which has inconsistent cross-browser ARIA support. Consider switching to a manually managed `<button>` with `aria-expanded` and `aria-controls` for guaranteed screen reader behaviour.
6. **Story additions:** AccordionGroup exclusive mode, AccordionGroup with defaultOpen, all variants, with custom expand icon, with rich content (forms, images, nested lists).

### Divider

**Recommended improvements:**

1. **`label` prop** — text or icon centred on the divider line. Common use: "Or continue with" between form sections. Rendered as `<div role="separator" aria-label="[label]">`.
2. **`labelAlign` prop:** `start`, `center` (default), `end`.
3. **Story additions:** Divider with label (text), Divider with label (icon), Divider with label (custom slot content), as form section separator.

### Dialog

**Recommended improvements:**

1. **`title` slot + automatic `aria-labelledby`** — currently `ariaLabel` is a prop that sets `aria-label` on the dialog element. Best practice (WCAG 2.4.6) is to have a visible title linked via `aria-labelledby`. The Dialog should render a visually styled title bar and auto-bind `aria-labelledby` to it. Keep `ariaLabel` as a fallback for dialogs without visible titles.
2. **`size` prop:** `sm` (400px), `md` (560px, current), `lg` (768px), `xl` (1024px), `fullscreen`. Applied as `max-w-*` on the inner panel.
3. **`description` slot** — auto-linked via `aria-describedby` to the dialog root.
4. **`ConfirmDialog` sub-component** — a convenience wrapper pre-composed with title, body text, and confirm/cancel buttons. Exposes a Promise-based API:
   ```js
   const confirmed = await confirmRef.value.open({
       title: 'Delete item',
       description: 'This action cannot be undone.',
       confirmLabel: 'Delete',
       confirmColor: 'red',
   })
   ```
5. **Story additions:** Dialog with title slot, all sizes, Dialog with scrolling content, Dialog containing a form (test focus trap with form elements), ConfirmDialog (play function confirms and cancels).

### FloatingPanel

Already strong. Focused improvements:

1. **`Tooltip` named export** — a thin wrapper around FloatingPanel with preset `role="tooltip"`, `interaction="hover"`, a sensible `maxWidth`, and a `delay` prop (default: 300ms) to prevent flicker on accidental hover. Exported directly from the library: `import { OuiTooltip } from 'ocelot-ui'`.
2. **`Popover` named export** — FloatingPanel with preset `role="dialog"`, `interaction="click"`, an optional header slot with a close button, and `aria-modal="false"` (popovers don't trap focus).
3. **`delay` prop on FloatingPanel** — added to support the Tooltip use case (hover delay before showing).
4. **Storybook: Tooltip story** — separate from FloatingPanel, covering: basic, on icon button, on disabled element wrapper, multiline content, keyboard trigger.
5. **Storybook: Popover story** — covering: basic, with form content, with action buttons.

### Toast

**Recommended improvements:**

1. **`action` option in `useToast().add()`** — `{ label: string, onClick: () => void }`. Renders a small text button inside the toast. Common use: "Undo", "View", "Retry". This respects the Zeigarnik Effect — users can act on an incomplete or reversible operation.
2. **`icon` override option** — allow passing a custom `IconProp` per toast to override the default type icon.
3. **`onClose` callback** — fires when a toast is dismissed (automatically or manually).
4. **Export `useToast` from the library root** — currently consumers import from an internal path. It should be a named export from `ocelot-ui`.
5. **Story additions:** toast with action button (play function clicks action), persistent toast with manual close, all types with custom icon, rapid toast stacking test.

### Loader

**Recommended improvements:**

1. **`size` prop:** `xs`, `sm`, `base` (default), `lg`, `xl` — controls the icon/spinner size and text size. Currently only `variant` controls layout mode, not visual scale.
2. **`color` prop** — matches the standard 8-colour palette (defaults to the current neutral/blue). Useful for contextual loaders inside coloured containers.
3. **Improved `text` slot** — allow arbitrary content in the loading text, not just a string prop.
4. **Story additions:** size scale (all 5 sizes), colour variants, with rich text slot content.

### Placeholder (Skeleton)

**Recommended improvements:**

1. **`animated` prop** — boolean, default `true`. Setting to `false` shows static skeletons (useful for print or reduced-motion contexts).
2. **`rows` prop** — for `paragraph` and `text` variants, controls the number of skeleton lines (default: 3).
3. **`avatar` skeleton variant** — circular skeleton for Avatar placeholder.
4. **`table` skeleton variant** — a header row + configurable number of data rows (`tableRows` prop, default: 5).
5. **`list` skeleton variant** — repeated rows with optional avatar + text composition.
6. **Story additions:** all variants including new ones, animated vs static, composite page skeleton (avatar + heading + paragraph), realistic table skeleton.

### Sidebar

**Recommended improvements:**

1. **`SidebarNav` sub-component** — a `<nav aria-label="...">` wrapper with consistent vertical spacing.
2. **`SidebarNavGroup` sub-component** — a labelled group of nav items with an optional collapsible header.
3. **`SidebarNavItem` sub-component** — an individual nav link with: `href`, `active` (bool, applies `aria-current="page"`), `icon` (IconProp), `badge` (count), `disabled`.
4. **`width` prop on `Sidebar`** — default is fixed; allow `sm` / `md` / `lg` or arbitrary pixel value.
5. **Transition on scrim** — the backing scrim should fade in/out in sync with the sidebar slide.
6. **Story additions:** Sidebar with full nav structure (groups, items, active state, badge count), mobile sidebar pattern (scrim + slide), programmatic open/close play function.

### Heading

**Recommended improvements:**

1. **`truncate` prop** — clamps to one line with ellipsis overflow. Useful in Card headers, Sidebar items, Table cells.
2. **`srOnly` prop** — visually hidden heading for screen reader context (e.g. a section titled "Navigation" that is visually implied by a sidebar icon). Equivalent to `class="sr-only"`.
3. **`as` prop consideration** — `Heading` currently uses `level` to set both the HTML element and the visual size. The `styleLevel` prop already overrides visual size. Ensure the relationship between `level` (semantic) and `styleLevel` (visual) is clearly documented.
4. **Story additions:** truncated heading in a constrained container, sr-only heading context demo.

### Input

The only existing form component. Currently supports text, email, number, password, tel, and URL types with prefix/suffix slots.

**Recommended improvements:**

1. **Validation state prop** — `state`: `'idle' \| 'valid' \| 'invalid' \| 'warning'`. Applies the appropriate border/icon colour. This must be implemented before other form components are built so there is a consistent model to follow.
2. **`helperText` prop / `#helper` slot** — descriptive text shown beneath the input (always visible, not conditional on state).
3. **`errorMessage` prop / `#error` slot** — error text shown beneath the input only when `state === 'invalid'`. Both `helperText` and `errorMessage` must be linked to the input via `aria-describedby`.
4. **`clearable` prop** — shows a clear (×) button inside the suffix when the input has a value. Emits `update:modelValue` with `''`. Useful for search inputs.
5. **`size` prop** — `'sm' \| 'md' \| 'lg'` to match Button and other components. Currently has no size control.
6. **Story additions:** all validation states, clearable input, size variants, input with helper text, input with error message (play function tests typing + error display), input with prefix icon.

### Label

Currently a minimal wrapper with no meaningful implementation beyond a styled `<span>`. This needs clarifying.

**Recommended improvements:**

1. Determine the intended usage: `Label` should render a `<label>` element (not `<span>`) with a `for` prop that links to a form input by ID. If it is purely decorative, it should be removed and replaced by documentation encouraging consumers to use the native `<label>`.
2. Add `required` prop — renders an asterisk with `aria-hidden="true"` alongside the label text.
3. Add `optional` prop — renders "(optional)" text for non-required fields in forms that mark optional fields explicitly.
4. **Story additions:** label with `for` binding, label with required asterisk, label with optional text, label inside FormField composition.

### Image

Already strong (LQIP, blur-up, srcset, lazy loading). Minor improvements:

1. **Error state slot `#error`** — currently shows a `PhotoOff` icon on load failure. Allow consumers to override with custom error UI (a fallback image, a branded error message).
2. **`rounded` prop** — controls border-radius (`none`, `sm`, `md`, `lg`, `full`) rather than requiring consumers to add classes externally.
3. **Story additions:** error state with custom fallback, rounded variants.

### ReadMore

**Recommended improvement:**

1. **`expandLabel` and `collapseLabel` props** — currently hardcoded as "Read more" / "Read less". These must be internationalisation-friendly.
2. **`#trigger` slot** — allow consumers to replace the text button with a custom expand trigger entirely.
3. **Story additions:** custom labels, with custom trigger slot, in a Card, with very short content (should not render the trigger at all).

### Scrim

**Recommended improvement:**

1. **`zIndex` prop** — consumers using multiple overlapping overlay components (Dialog + Sidebar both using Scrim) need to control stacking order. A `zIndex` prop (or named z-index levels: `'overlay' \| 'modal' \| 'top'`) prevents z-index conflicts.
2. **Story additions:** scrim behind Dialog, scrim behind Sidebar, named z-index levels.

### Video

**Recommended improvement:**

1. **`showControls` slot** — custom player controls overlay. Currently uses Plyr's default controls.
2. **Dependency note** — Plyr should move to `peerDependencies` (see §1a). Document installation requirement.
3. **Story additions:** video without controls (for background video use case), all caption types.

### QrCode

**Recommended improvement:**

1. **`download` prop** — adds a button to download the QR code as a PNG. QR codes on product pages, tickets, and profile pages frequently need to be saved.
2. **Dependency note** — `qrcode` package should move to `peerDependencies` (see §1a).
3. **Story additions:** downloadable QR code, QR code with custom colours.

### HelloWorld

**Remove from the published library.** This is a demo component that should not be in the `dist` bundle. Consumers importing `ocelot-ui` do not want a `HelloWorld` component in their autocomplete. It can remain in the repo as a Storybook demo but must be excluded from the build entry point (`.build/index.ts`).

---

## 6. Missing Components

Components are grouped by priority tier. Tier 1 = essential for a usable component library.

---

### Tier 1 — Essential

---

#### Alert / Banner

An inline, embedded feedback component. Distinct from Toast:
- **Toast** = ephemeral, floating notification triggered by a user action
- **Alert** = persistent, in-layout status message (form submission errors, system notices, onboarding banners)

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Semantic type — sets icon and colour |
| `title` | `string` | — | Optional bold heading |
| `dismissible` | `boolean` | `false` | Shows a close button; emits `@dismiss` |
| `variant` | `'solid' \| 'subtle' \| 'outline'` | `'subtle'` | Visual intensity |

**Slots:** `#icon` (override default type icon), `#title`, `#description` (default slot), `#actions`

**ARIA:** `role="alert"` for `error`/`warning` types (assertive live region); `role="status"` for `info`/`success` (polite). No `role` for static/permanent alerts (they don't need live region semantics).

**UX Law:** Von Restorff Effect — error and warning alerts must be visually distinct via colour *and* icon, not colour alone (colour-blind accessibility).

**Stories:** All 4 types × 3 variants, with and without title, dismissible (play function tests dismiss event and DOM removal), alert with action button, alert with custom icon, alert inside a form layout.

---

#### Avatar / AvatarGroup

Used in nearly every product UI: profile headers, comment threads, team lists, user tables.

**`Avatar` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — | Image URL |
| `alt` | `string` | `''` | Alt text (empty string if decorative) |
| `initials` | `string` | — | Fallback when no `src` or image fails to load. 1–2 chars. |
| `size` | `'xs' \| 'sm' \| 'base' \| 'lg' \| 'xl' \| '2xl'` | `'base'` | |
| `color` | standard 8 colours | `'blue'` | Background colour for initials fallback |
| `shape` | `'circle' \| 'square'` | `'circle'` | |

Fallback priority: image → initials → generic user icon (OUI Icon `User`).  
Image must use `loading="lazy"` and handle `error` event to show fallback.

**`AvatarGroup` props:** `max` (number of visible avatars before +N overflow badge), `size` (cascades to all children), overlapping layout (negative margins).

**ARIA:** If Avatar is purely decorative, `aria-hidden="true"`. If it represents a named user, `alt` or `aria-label` must convey the name.

**UX Law:** Face recognition is faster than text recognition (recognition > recall). Avatars aid navigation in user-dense interfaces.

**Stories:** Avatar with image, initials fallback (all colours), icon fallback, all sizes, square shape, AvatarGroup (5 visible + overflow), AvatarGroup with tooltip on hover showing names.

---

#### Tabs / TabPanels

One of the most fundamental navigation primitives. Deviating from the standard keyboard model will confuse developers — follow the ARIA Authoring Practices Guide exactly.

**Components:** `Tabs` (root), `TabList`, `Tab`, `TabPanel`

**`Tabs` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string \| number` | — | Active tab ID (v-model) |
| `defaultValue` | `string \| number` | first tab | Uncontrolled default |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `variant` | `'underline' \| 'pill' \| 'bordered' \| 'lifted'` | `'underline'` | Visual style |
| `lazy` | `boolean` | `false` | If true, tab panel content is not mounted until first activated |

**`Tab` props:** `value` (required, unique ID), `disabled`, `icon` (IconProp), `badge` (count string)

**Keyboard specification:**

| Key | Action |
|---|---|
| Arrow Right / Down | Move focus to next tab |
| Arrow Left / Up | Move focus to previous tab |
| Home | Move focus to first tab |
| End | Move focus to last tab |
| Enter / Space | Activate focused tab (in manual activation mode) |
| Tab | Move focus into the active tab panel |

**ARIA:** `role="tablist"` on `TabList`, `role="tab"` + `aria-selected` + `aria-controls="[panel-id]"` on each `Tab`, `role="tabpanel"` + `aria-labelledby="[tab-id]"` on each `TabPanel`.

**UX Law:** Jakob's Law — tabs are one of the most recognised navigation patterns. Automatic vs manual activation should be configurable (`activation` prop: `'auto' | 'manual'`) since both have valid use cases.

**Stories:** All 4 variants, vertical orientation, tab with icon, tab with badge count, disabled tab, controlled (v-model), uncontrolled (defaultValue), lazy mounting, keyboard navigation play function (tests Arrow keys + Home/End).

---

#### Breadcrumb

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `{ label: string, href?: string }[]` | required | Path segments. Last item is current page. |
| `separator` | `string \| Component` | `'/'` | String or component (e.g. `IconChevronRight`) |
| `maxItems` | `number` | `0` (all) | Collapse middle items when path is long |

**Semantic HTML:** `<nav aria-label="Breadcrumb"><ol>` with `<li>` per item. Last item gets `aria-current="page"`. Collapsed items use a `<button>` that expands to show the full path.

**Stories:** Basic 3-level, custom separator (icon), collapsed long path (5+ levels), collapsed then expanded (play function).

---

#### Progress

**`ProgressBar` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Current value (0 to `max`) |
| `max` | `number` | `100` | Maximum value |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Bar height |
| `color` | standard 8 colours | `'blue'` | Fill colour |
| `animated` | `boolean` | `false` | Indeterminate animated striped state (when `value` is undefined) |
| `label` | `string` | — | Visible label above/beside the bar |
| `showValue` | `boolean` | `false` | Appends percentage text |

**`ProgressCircle` props:** same value/max/color/size, plus `strokeWidth`, `showValue` (text centred in ring).

**ARIA:** `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax`, `aria-label`. For indeterminate state, omit `aria-valuenow`.

**UX Law:** Zeigarnik Effect — progress indicators actively keep users engaged by making completion feel achievable.

**Stories:** Determinate (all colours, all sizes), indeterminate (animated), with label, with percentage value, ProgressCircle variants.

---

#### Pagination

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number` | required | Current page (1-indexed) |
| `total` | `number` | required | Total number of pages |
| `siblings` | `number` | `1` | Pages shown either side of current |
| `boundaries` | `number` | `1` | Pages shown at start and end |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `compact` | `boolean` | `false` | Show only prev/next buttons |

**Emits:** `update:modelValue`

**ARIA:** `<nav aria-label="Pagination">`. Each page button: `aria-label="Page N"`. Active page: `aria-current="page"`. Prev/next buttons: `aria-label="Previous page"` / `"Next page"`. Ellipsis: `aria-hidden="true"`.

**UX Law:** Miller's Law — show a maximum of 7 page numbers at once. Collapse with ellipsis beyond that.

**Stories:** Basic, compact, large dataset (100+ pages), first/last page disabled state, size variants, click navigation play function.

---

#### Steps / Stepper

For multi-step forms, wizards, and checkout flows.

**Components:** `Stepper` (root), `Step`

**`Stepper` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number` | required | Active step index (0-based) |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | |
| `linear` | `boolean` | `true` | Prevents clicking future steps |

**`Step` props:** `label` (required), `description`, `status` (`'complete' \| 'active' \| 'pending' \| 'error'`, auto-derived from parent index if omitted), `icon` (override default step number/checkmark)

**ARIA:** `role="list"` on Stepper (steps are a list of tasks). `aria-current="step"` on the active step. Each step label is readable without its visual state.

**UX Law:** Goal Gradient Effect — showing progress with clear step completion increases the likelihood of completing the flow.

**Stories:** Horizontal (all status combinations), vertical, linear navigation (play function steps forward and back), error state, with description text.

---

#### Banner (full-width page notice)

Distinct from both Alert and Toast. A Banner is a full-width strip anchored to the top of the page (or a section), commonly used for:
- Cookie consent notices
- Maintenance / downtime warnings
- New feature announcements
- EU-style privacy notices

This is different from Alert (which is embedded in content flow) and Toast (which is floating and ephemeral).

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'info' \| 'warning' \| 'error' \| 'neutral'` | `'neutral'` | Semantic type — sets background colour |
| `dismissible` | `boolean` | `true` | Shows a close button, persists dismissal in `localStorage` if `storageKey` is provided |
| `storageKey` | `string` | — | If provided, dismissal is saved to `localStorage` and the banner does not reappear |
| `sticky` | `boolean` | `false` | Sticks to the top of the viewport while scrolling |

**Slots:** `#icon`, `#default` (message content), `#actions`

**ARIA:** `role="banner"` if it is a site-wide notice at the page level; `role="status"` or `role="alert"` for dynamic state-based banners.

**UX Law:** Law of Common Region — the full-width strip creates a distinct region that separates the notice from all other page content, giving it appropriate visual weight without being a disruptive modal.

**Stories:** Info (announcement), warning (maintenance), dismissible (play function dismisses and verifies it disappears), sticky (scroll demo), with action button.

---

#### Tooltip (named export)

Covered in §5 (FloatingPanel improvements). Summarised here for priority tracking:
- Named export from the library (`OuiTooltip`)
- Preset: hover interaction, `role="tooltip"`, 300ms delay
- Props: `content` (string), `placement`, `delay`, `disabled`
- Trigger: default slot

---

### Tier 2 — Important

---

#### Dropdown Menu

A fully ARIA-compliant menu component. Distinct from FloatingPanel: FloatingPanel positions arbitrary content; DropdownMenu is specifically for command menus and action lists with ARIA `menu` semantics and full keyboard navigation.

**Components:** `DropdownMenu` (root), `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuSeparator`, `DropdownMenuLabel`, `DropdownMenuSub` (nested)

**`DropdownMenuItem` props:** `label`, `icon` (IconProp), `shortcut` (display string, e.g. `"⌘K"`), `disabled`, `destructive` (red colour), `href` (renders as `<a>`)

**Keyboard specification:**

| Key | Action |
|---|---|
| Enter / Space | Open menu / activate item |
| Arrow Down | Move to next item |
| Arrow Up | Move to previous item |
| Home | Move to first item |
| End | Move to last item |
| Escape | Close menu, return focus to trigger |
| A–Z | Jump to next item starting with that character |
| Arrow Right | Open sub-menu |
| Arrow Left | Close sub-menu |

**ARIA:** `role="menu"` on content, `role="menuitem"` on items, `role="menuitemcheckbox"` on checkbox items, `aria-haspopup="menu"` on trigger, `aria-expanded` on trigger, `aria-checked` on checkbox items.

**UX Law:** Hick's Law — limit visible menu items to ~7. Use `DropdownMenuSeparator` and `DropdownMenuLabel` to chunk longer menus into groups.

**Stories:** Basic, with icons, with shortcuts, with checkbox items, with destructive item, with nested sub-menu, keyboard navigation play function (Arrow keys, character jump, Escape).

---

#### Table

Semantic table sub-components for displaying structured data.

**Components:** `Table` (root), `TableHead`, `TableBody`, `TableFoot`, `TableRow`, `TableHeader` (th), `TableCell` (td)

**`Table` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `striped` | `boolean` | `false` | Alternating row backgrounds |
| `hoverable` | `boolean` | `true` | Row highlight on hover |
| `bordered` | `boolean` | `false` | Cell borders |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Cell padding scale |
| `stickyHeader` | `boolean` | `false` | Header fixed during scroll |
| `caption` | `string` | — | Accessible table caption (sr-only by default, `captionVisible` prop to show) |

**`TableHeader` props:** `sortable` (bool), `sortDirection` (`'asc' \| 'desc' \| null`) — emits `sort` with column key. ARIA: `aria-sort="ascending|descending|none"`.

**Slots on `Table`:** `#empty` (shown when no rows — integrate with EmptyState component), `#loading` (shown when data is fetching — integrate with Placeholder table skeleton)

**Note:** This is a semantic table, not a DataTable with built-in filtering/pagination. Those features are consumer-responsibility; this component provides the accessible structure.

**Stories:** Basic, striped, bordered, sortable columns (play function clicks header to sort), empty state slot, loading skeleton slot, sticky header (scroll demo), responsive horizontal scroll.

---

#### Stats / Metric Card

A dedicated component for KPI and metric display — essential for dashboards.

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | required | Metric name |
| `value` | `string \| number` | required | Primary metric value |
| `delta` | `string \| number` | — | Change value (positive = green, negative = red) |
| `deltaLabel` | `string` | — | Context label ("vs last month") |
| `icon` | `IconProp` | — | Icon displayed alongside the metric |
| `variant` | `'card' \| 'bordered' \| 'inline'` | `'card'` | Visual treatment |
| `loading` | `boolean` | `false` | Shows skeleton state |

**UX Law:** Aesthetic-Usability Effect — the value must be visually dominant (large, bold). Delta and label are visually subordinate. Poor visual hierarchy here erodes trust in the data.

**Stories:** Positive delta, negative delta, neutral (no delta), with icon, loading state, 4-up stats grid layout, all variants.

---

#### Timeline

**Components:** `Timeline` (root), `TimelineItem`

**`TimelineItem` props:** `label`, `date`, `description`, `icon` (IconProp), `status` (`'complete' \| 'active' \| 'pending' \| 'error'`), `iconColor`

**Semantic:** `<ol>` with `<li>` items. The visual connector line is `aria-hidden`. Status is conveyed via text/icon, not colour alone.

**Stories:** Basic vertical, with icons, mixed statuses, inside a card, with rich description slots.

---

#### Code Block

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `code` | `string` | required | The code string (pre-escaped) |
| `language` | `string` | `'text'` | Language identifier (for syntax theme header) |
| `showCopyButton` | `boolean` | `true` | Copy to clipboard button |
| `showLineNumbers` | `boolean` | `false` | Gutter with line numbers |
| `filename` | `string` | — | Shown in a styled header bar |
| `highlight` | `number[]` | `[]` | Line numbers to highlight |

**Note:** This component does **not** ship a runtime syntax highlighter — that would be a ~50KB+ dependency. It renders styled `<pre><code>` with the language label. For highlighted output, consumers pass pre-highlighted HTML via the `#highlighted` slot (compatible with Shiki, Prism, or any highlighter). The component provides the chrome (copy button, filename header, line numbers, scrolling container).

**Stories:** Plain text, with filename header, with line numbers, with copy button (play function tests clipboard), with highlighted slot content.

---

#### Empty State

**Props:** `title`, `description`, `variant` (`'page' \| 'inline' \| 'compact'`)

**Slots:** `#icon`, `#title`, `#description`, `#actions`

**Stories:** Page empty state (with icon + action), table empty state (inline), search result empty state, compact variant.

---

#### NavigationBar / AppShell

Almost every web application has a top navigation bar. Currently consumers must build this entirely from scratch using OUI primitives. A `NavigationBar` component would not be prescriptive about layout — it would handle the common patterns:

- **`NavBar`** — a `<header>` wrapper with `role="banner"`, consistent height, horizontal layout, and a `sticky` prop.
  - Slots: `#brand` (logo/name), `#nav` (primary nav links), `#actions` (right-side: search, avatar, theme toggle)
- **`NavBarItem`** — an individual nav link with: `href`, `active` (`aria-current="page"`), `icon` (IconProp)
- **`NavBarDropdown`** — a nav item with a dropdown sub-menu (uses DropdownMenu internally)

**Note:** This component is intentionally layout-focused, not opinionated about visual design. The `#nav`, `#brand`, and `#actions` slots give consumers full control over content.

**ARIA:** The outer `<header>` uses the implicit `banner` landmark. The `<nav>` inside must have `aria-label` to distinguish it from other `<nav>` elements on the page (e.g. the Sidebar's nav).

**Stories:** Basic NavBar with brand + links + avatar, with dropdown nav item, mobile (hamburger menu opens Sidebar), sticky on scroll.

---

#### Popover (named export)

Covered in §5. Summarised here for priority tracking:
- Named export from the library (`OuiPopover`)
- Preset: click interaction, `role="dialog"`, no focus trap
- Has close button in content header
- Slot-based content

---

### Tier 3 — Nice to Have

---

#### CommandPalette (⌘K)

A full-screen search overlay — increasingly expected in modern web products.

**Props:** `placeholder`, `emptyText`

**`useCommandPalette()` composable** — `open()`, `close()`, `register(items)` — allows child routes/views to register their own commands at mount time.

**Keyboard:** `Escape` to close, `Arrow Up/Down` to navigate results, `Enter` to execute selected command.

**Stories:** With grouped results, with icons and shortcuts, empty search state, keyboard navigation play function.

---

#### Chip / Tag

Similar to Badge but interactive — for filter UIs and multi-select representations.

**Props:** `label`, `removable`, `selected`, `disabled`, `icon` (IconProp)

**Emits:** `@remove`, `@click`

Distinguished from Badge: Badge is purely decorative; Chip is interactive (has `role="button"` or is wrapped in a `<button>`).

**Stories:** Basic, removable (play function tests @remove), selected state, disabled, chip group (horizontal wrap), chip used as filter UI.

---

#### Callout

A styled editorial aside for documentation and rich content.

**Props:** `type` (`'info' \| 'warning' \| 'tip' \| 'danger'`), `title`

Distinct from Alert: Callout is static/editorial content; Alert is operational feedback.

**Stories:** All 4 types, with and without title, nested in a prose block.

---

#### SkipLink

A single accessibility utility: a "Skip to main content" link that is visually hidden until focused — required by WCAG 2.4.1 Bypass Blocks.

**Props:** `target` (ID of main content element, default: `"main"`)

**Story:** Focus demo showing the link appearing on Tab press.

---

## 7. Forms & Inputs (Brief)

Forms are a significant workstream deserving their own detailed spec. Key gaps and architectural principles are noted here.

### Missing form primitives

| Component | Priority | Key notes |
|---|---|---|
| Textarea | 1 | Auto-resize variant (ResizeObserver); min/max rows |
| Select (native) | 1 | Styled `<select>` first — native semantics, low complexity |
| Checkbox | 1 | With indeterminate state; `CheckboxGroup` wrapper |
| Radio / RadioGroup | 1 | Horizontal and vertical layouts; `fieldset/legend` pattern |
| Switch / Toggle | 1 | Replaces checkbox in on/off UIs; `role="switch"`, `aria-checked` |
| NumberInput | 2 | With increment/decrement stepper buttons |
| Combobox | 2 | Searchable select using Floating UI (already a dependency) |
| File Upload | 2 | Drag-and-drop zone, file list, upload progress integration |
| Range / Slider | 2 | Single handle; dual-handle for min/max range |
| DatePicker | 3 | Complex — evaluate a composable dependency rather than building from scratch |
| ColorPicker | 3 | `culori` is already a dependency — leverageable |
| OTP / Pin Input | 3 | Multi-cell code entry for 2FA screens |

### Form context via `provide/inject`

A `Form` wrapper component should propagate validation state to child form components. This is the standard Vue pattern (used by Vee-Validate, FormKit, and Nuxt UI):

```
Form (provide: { validationState, registerField, submit })
  └── FormField (inject: { validationState } — provides to its own children)
        ├── Label
        ├── Input / Select / Checkbox / etc.
        ├── HelperText (descriptive, always visible)
        └── ErrorMessage (only visible in invalid state)
```

`FormField` is the key composition unit — it replaces the repetitive Label + Input + HelperText + ErrorMessage pattern every consumer would otherwise rebuild.

### Validation states

All form components must support four states consistently:
- `idle` — default, no validation applied
- `valid` — green border/icon
- `invalid` — red border/icon + error message
- `warning` — amber border/icon (soft validation, does not block submission)

States propagate from `Form` via `provide` or can be set directly via prop for standalone use.

### Cross-cutting form requirements

- `required` fields use `aria-required="true"`, not just a visual asterisk. The asterisk should have `aria-hidden="true"` with a legend note.
- `disabled` vs `readonly` must be visually distinct and both supported on all inputs.
- `autocomplete` attribute must be passable on all text-input components.
- Every form component must accept `id` and `name` props; IDs must auto-generate a UUID as a fallback (already done in Input).
- `FormField` encapsulates the ARIA linking (`for`/`id`, `aria-describedby` pointing to helper + error) so consumers don't wire it manually.

**UX Law:** Tesler's Law — form complexity cannot be reduced, only shifted. OUI absorbs the ARIA linking, ID management, and validation state propagation so consumers write clean, simple template code.

---

## 8. Cross-Cutting Technical Concerns

### Server-Side Rendering (SSR) / Nuxt compatibility

OUI is a Vue 3 library. Many consumers will use it with Nuxt. Potential SSR issues:

- **`document` / `window` access** — FloatingPanel, Sidebar, Dialog, and Toast use browser APIs. All must be guarded with `typeof window !== 'undefined'` or `onMounted()`. **Audit all current components for this.**
- **`Teleport`** — Dialog uses `<Teleport>` which requires the target to exist in the DOM. In SSR, the portal target (`#portal-target`) may not be available during hydration. Use `defer` on Teleport or use a `ClientOnly` pattern and document the requirement.
- **QrCode** — `qrcode` package renders to `<canvas>`, which is client-only. Must be wrapped in `onMounted`.
- **Video / LightboxImage** — Plyr and PhotoSwipe must be initialised client-side only. Already likely the case but needs explicit documentation.
- **Recommendation:** Add a Storybook MDX page documenting SSR/Nuxt usage patterns and any `ClientOnly` wrapping requirements.

### `prefers-reduced-motion`

All animated components must respect the user's motion preference:

```css
@media (prefers-reduced-motion: reduce) {
    /* transitions should be instant or removed */
}
```

Components affected: Dialog (fade/scale in), Sidebar (slide), Toast (slide), Image (blur-up fade), FloatingPanel (fade), Loader (spin/bounce/pulse animations), Placeholder (shimmer), all Vue `<Transition>` instances.

The correct approach in Tailwind v4 is to use `motion-reduce:*` variants:
```
transition-all duration-300 motion-reduce:duration-0 motion-reduce:transition-none
```

This should be applied consistently across all components. Add a note to the Design System Storybook page on motion preferences.

### Dark mode consistency

All new components must be dark-mode tested in Storybook. Dark mode uses the `.dark` class (Tailwind v4 class-based dark mode). Consumers must have `@custom-variant dark (&:where(.dark, .dark *))` in their Tailwind CSS (already documented in CLAUDE.md).

- Every Storybook story must be visually verified in dark mode using the theme decorator.
- Components using hardcoded colours (e.g. white backgrounds, dark text) must use semantic Tailwind classes that invert correctly: `bg-white dark:bg-zinc-900`, etc.

### Right-to-Left (RTL) support

RTL is not in scope for the initial roadmap, but decisions made now will determine how hard it is later:

- Avoid `margin-left`/`margin-right` in favour of `ms-*`/`me-*` (margin-start/end) Tailwind classes.
- Avoid `left-0`/`right-0` in favour of `start-0`/`end-0` for positioned elements.
- FloatingPanel placements (left/right) should use `start`/`end` variants.
- **Recommendation:** adopt start/end logical properties now in all new components, even if RTL is not officially supported. It costs nothing and avoids a painful migration later.

### Print styles

Components that commonly appear in printed documents (Table, Card, Heading, Divider, Badge) should be usable in print context:

- Remove box-shadows and interactive states.
- Ensure colours have sufficient contrast in greyscale.
- This is a low-priority, future consideration — document it rather than implement immediately.

### Bundle size tracking

As the library grows, bundle size must be monitored. Suggested approach:
- Add `bundlesize` or `size-limit` as a dev dependency.
- Set a budget: the ESM bundle should not exceed 100KB before gzip; 40KB after.
- Run in CI (GitHub Actions) so size regressions are caught before merge.
- Document current size per component in Storybook (nice to have).

### Versioning strategy

- The library is currently pre-1.0 (v0.0.x). A 1.0 release signals API stability to consumers.
- Before 1.0: breaking changes are acceptable with minor version bumps.
- After 1.0: follow strict semver — breaking changes require a major bump with a migration guide.
- **Recommendation:** Plan for a 1.0 release after Phase 2 (Tier 1 components) is complete. Stabilise the icon API, Form context pattern, and slot naming conventions before 1.0 as these are the most disruptive things to change later.

---

## 9. UX Laws Applied

These laws have directly informed every recommendation in this document. This section maps each law to its specific application in OUI.

| Law | Specific OUI application |
|---|---|
| **Fitts's Law** (larger/closer targets are easier to hit) | All interactive elements must have a ≥ 44×44px touch target. Button `small` variant must be audited. Icon-only buttons require adequate padding to meet this. Pagination page buttons must be adequately sized. Nav items in Sidebar must be tall enough for thumb targets on mobile. |
| **Hick's Law** (more choices = longer decisions) | Limit prop variants — use sensible defaults, not exhaustive configuration. Dropdown menus capped at ~7 visible items; use separators and groups for longer lists. Storybook stories should show the most common use first, not all permutations at once. |
| **Jakob's Law** (users expect familiar patterns) | Use conventional component names: `Tooltip` not `FloatingPanel[role=tooltip]`. `Tabs` not `TabSwitcher`. Keyboard behaviour on Tabs, Menu, and Dialog must match ARIA APG specifications exactly — that is what developers expect. |
| **Miller's Law** (7 ± 2 items in working memory) | Pagination shows ≤ 7 page numbers at once. Navigation groups in Sidebar should not exceed 7 items without a visual separator. AccordionGroup should default to max 7 items per section. |
| **Law of Proximity** (related things appear close) | Card sub-component slots (`#header`, `#content`, `#footer`) make spatial relationships explicit. FormField composition (label above, helper text below, error below helper) encodes proximity rules into the component structure. |
| **Law of Common Region** (shared region = related content) | Card, Dialog, Sidebar, Alert, Toast, and Popover all use a distinct visual region (background, border, shadow) to signal "this content belongs together." Components that share a region must use consistent spacing within it. |
| **Aesthetic-Usability Effect** (beautiful = more usable) | Stats cards, Code blocks, Empty states, and Timeline must be polished. Users perceive visually refined components as more reliable and are more forgiving of minor issues. Ugly skeletons undermine trust in the actual data they represent. |
| **Zeigarnik Effect** (incomplete tasks are better remembered) | Progress and Stepper components must clearly communicate incompleteness. Toast action buttons ("Undo") allow users to address interrupted operations. Step completion indicators should be visually satisfying (animated checkmark on completion). |
| **Von Restorff Effect** (distinctive items are remembered) | Error and warning states must be visually distinct via colour **and** icon. Never rely on colour alone — colour-blind users cannot distinguish red from green. Use `aria-live` for dynamically appearing alerts. |
| **Tesler's Law** (complexity cannot be eliminated, only moved) | OUI absorbs the ARIA complexity of Dialog, Tabs, Menu, and Combobox. FormField absorbs the ID-linking boilerplate. `registerIcons()` absorbs the icon management complexity. Consumers should write simple template code; OUI does the hard parts. |
| **Goal Gradient Effect** (effort increases as goal approaches) | Stepper and Progress components must show both what is done and how close the end is. The visual treatment of "complete" steps should feel rewarding (filled icon, stronger colour). "Active" step should be clearly differentiated from "pending" steps. |
| **Serial Position Effect** (first and last items are best remembered) | In long Sidebars or navigation menus, place the most important items first. In Toast, the most recent notification should be visually prominent. In Pagination, boundary pages (first/last) are always shown regardless of the collapsed range. |

---

## 10. Developer Experience

A component library is ultimately a developer-facing product. DX is as important as the components themselves.

### TypeScript coverage

- All component props must have TypeScript types — no `any`.
- All emitted events must be typed with `defineEmits<{ (e: 'eventName', payload: Type): void }>`.
- All exposed methods (Dialog's `open()`, `close()`, `isOpen`) must be typed with `defineExpose`.
- Export all prop type interfaces so consumers can import them: `import type { ButtonProps } from 'ocelot-ui'`.
- The icon hybrid type (`IconProp = IconName | Component`) must be exported and usable in consumer code.

### IDE integration

- Components should have correct JSDoc on props so VS Code / WebStorm shows descriptions in the IntelliSense popup.
- For Vue Language Tools (Volar), a `components.d.ts` generated at build time enables auto-complete on `<OuiButton>` in consumer templates without explicit import. This is generated by running `vue-tsc --declaration --emitDeclarationOnly` as part of the build, or via `unplugin-vue-components`'s `dts: true` option.
- **Write a `unplugin-vue-components` resolver** — this is a first-class DX feature, not a nice-to-have. A resolver lets consumers add a single line to their Vite config and get full auto-import of all OUI components with the correct prefix:

  ```js
  // consumer's vite.config.ts
  import { OcelotUIResolver } from 'ocelot-ui/resolver'
  Components({ resolvers: [OcelotUIResolver({ prefix: 'Oui' })] })
  ```

  The resolver is a small file in the library that maps component names to import paths. It should be published as a named export from `ocelot-ui/resolver` (a separate export condition in `package.json`) to avoid importing Vue at resolver resolution time.

- **`app.use()` plugin helper** — export an `install` plugin so consumers can register all components at once with a configurable prefix:

  ```js
  import OcelotUI from 'ocelot-ui'
  app.use(OcelotUI, { prefix: 'Oui' })
  // registers OuiButton, OuiDialog, etc. globally
  ```

  This is opt-in — tree-shaking still works for consumers who import individually.

### Error handling in development

Components should use `console.warn` or `throw` (in non-production) for:
- `Dialog`: missing `ariaLabel` prop and no title slot content
- `Button` icon-only: missing `aria-label`
- `Image`/`LightboxImage`: missing `alt` prop
- `Avatar`: `src` provided but `alt` is empty on a non-decorative avatar
- `Icon`: unrecognised string icon name (string that isn't in registry)

These warnings are stripped in production (`import.meta.env.PROD`) to avoid console noise in shipped apps.

### Documentation standards

Each component's Storybook doc page should include:

1. **When to use / When not to use** — a short paragraph for each. This is TailwindUI and Radix's strongest contribution: they tell you *which pattern to pick*, not just how to use a given component.
2. **Props table** — auto-generated + manually edited descriptions for every prop.
3. **Slots table** — name, expected content, whether it replaces a prop.
4. **Events table** — event name, payload type, when it fires.
5. **Keyboard interaction table** — every key combination, what it does. Required for all interactive components.
6. **ARIA roles and attributes** — what roles/attributes the component applies and why.
7. **Related components** — links to components commonly used alongside this one.
8. **Accessibility notes** — any manual checks required beyond automated Axe (e.g. "verify screen reader announcement order in VoiceOver").

### Changelog and migration guides

- Maintain a `CHANGELOG.md` following Keep a Changelog format.
- Every PR that changes a component API must include a changelog entry.
- Breaking changes require a `MIGRATION.md` section before the 1.0 release.

---

## 11. Storybook Requirements

Every component — new or updated — must meet these standards.

### Story file structure

Each `.stories.js` file must include, in order:

```
1. Default           — component with production-realistic defaults (not all props at once)
2. All variants      — one story per significant visual variant (colour, size, type, etc.)
3. States            — disabled, loading, empty, error where applicable
4. Dark mode         — explicitly using the theme decorator dark state
5. Edge cases        — very long text, missing optional content, maximum items
6. Interactive       — play() functions for components with user interaction
7. Composition       — component used inside other components (Card in a grid, Alert in a form)
```

### Play function standards

Every interactive component must have play functions covering:

- **Happy path** — the primary user interaction (click, type, select, hover)
- **Keyboard path** — the same flow via keyboard only (Tab, Enter, Arrow keys)
- **Focus management** — where is focus before, during, and after the interaction?
- **State assertions** — verify the DOM state changed correctly (`expect(element).toBeVisible()`, `expect(element).toHaveAttribute('aria-expanded', 'true')`)

Play functions should use `@storybook/test` utilities: `userEvent`, `expect`, `waitFor`, `within`. All existing play functions should be audited for completeness.

### Story naming conventions

Follow the existing Storybook category structure:

```
Getting Started/
  Introduction
  Installation
  Design System/
    Colour Palette
    Typography
    Spacing & Sizing
    Border Radius & Shadows
    Motion

Composables/
  useIcons
  useToast
  useFocusMemory
  useLightboxRegistry

Components/
  [Component Name]/
    [Default | Variant | State | Interactive]
```

Story names within a component follow sentence case and describe what the story shows: `"With prefix icon"`, `"Disabled state"`, `"Keyboard navigation"` — not `"Story1"` or `"PrimaryVariant"`.

### Accessibility testing standards

- Axe runs automatically via the test runner for every story (already configured).
- Stories for complex interactive components (Dialog, Tabs, Menu, Combobox) should include a manual accessibility checklist in the story's docs:
  - Tested with VoiceOver (Safari/Mac)
  - Tested with NVDA (Firefox/Windows)
  - All interactive elements reachable by keyboard only
  - Focus never lost or trapped unintentionally
- Colour contrast must pass WCAG AA (4.5:1 for normal text, 3:1 for large text). The a11y Storybook addon flags contrast issues — fix all flagged instances before merging.

### Dark mode story requirements

- Every story must render correctly in dark mode.
- The theme toggle in Storybook preview should be used to verify; it is already configured.
- Components must not hardcode colour values that don't have dark variants. Use Tailwind semantic dark: classes.
- Pay specific attention to: shadows (may disappear in dark mode), borders (may need to be lighter, not darker), images and icons (must remain legible).

### Responsive and viewport testing

- For components that have responsive behaviour (Sidebar mobile pattern, Breadcrumb truncation, Table horizontal scroll, Card grid layouts), add stories with the Storybook viewport addon set to mobile sizes.
- Document the breakpoint behaviour per component in the story docs.

### Visual regression baseline

Once Tier 1 components are complete:
1. Run `test-storybook` to establish a Playwright screenshot baseline for all stories.
2. Commit the baseline snapshots to the repository.
3. Any future run that produces a visual diff fails CI until the snapshot is updated intentionally.
4. This catches Tailwind v4 upgrade regressions, dark mode drift, and unintended style changes.

---

## 12. Prioritised Roadmap

### Phase 1 — Foundation (prerequisite for everything else)

| Item | Type | Why first |
|---|---|---|
| Icon hybrid prop (string + component) | Update `Icon.vue` | Unblocks icon usage on Button, Badge, Alert, Avatar, Tabs, and all new components |
| `registerIcons()` composable | New export | Consumer extensibility |
| Icon registry expansion (~120 icons) | Update `useIcons.ts` | Many new components need icons that aren't currently registered |
| `Button` — prefix/suffix icon props + `iconOnly` variant | Update | First-class icon support is expected by every consumer |
| `ButtonGroup` component | New | Used in toolbars, segmented controls, dialog footers |
| `Tooltip` named export | Thin wrapper | Highest-frequency missing pattern — affects every interactive component that needs hover help text |
| `FormField` wrapper | New | Required foundation before any new form component is added |
| Export `useToast` from library root | Update entry point | DX improvement; consumers currently import from an internal path |

### Phase 2 — Core missing components

| Component | Notes |
|---|---|
| Alert / Banner | Inline feedback — needed immediately for form error display |
| Avatar / AvatarGroup | High-frequency component in almost every product |
| Tabs / TabPanels | Fundamental navigation primitive |
| Progress (bar + circle) | Needed for file upload, loading states, onboarding |
| Breadcrumb | Navigation staple |
| Pagination | Required alongside Table |
| Steps / Stepper | Multi-step forms and wizards |
| Textarea | Form primitive — highest priority form gap |
| Checkbox + CheckboxGroup | Form primitive |
| Radio + RadioGroup | Form primitive |
| Switch | Form primitive |

### Phase 3 — Richer components and form depth

| Component | Notes |
|---|---|
| Dropdown Menu | Complex ARIA — needs careful implementation |
| Table | Semantic sub-components |
| Stats / Metric Card | Dashboard staple |
| Empty State | Needed alongside Table and lists |
| Code Block | Needed for documentation-adjacent products |
| Timeline | Common in activity feeds |
| Popover named export | Quick win from FloatingPanel |
| Select (native) | Form primitive — native first |
| NumberInput | Form primitive |
| File Upload | Form primitive |
| Combobox (searchable select) | Complex form component |

### Phase 4 — Polish, power features, and 1.0 prep

| Item | Notes |
|---|---|
| CSS custom property theming | `--oui-radius`, `--oui-shadow`, `--oui-transition-duration` |
| `AccordionGroup` exclusive mode | Update to existing component |
| Card slot-based sub-components | Refactor (backwards-compatible) |
| Dialog — title slot + sizes + ConfirmDialog | Multiple improvements |
| Sidebar nav sub-components | `SidebarNav`, `SidebarNavItem`, `SidebarNavGroup` |
| Toast action buttons | Update |
| Badge — dot, removable, outline | Update |
| `prefers-reduced-motion` audit | All animated components |
| SSR/Nuxt audit | Guard browser API usage |
| Bundle size limit in CI | `size-limit` or `bundlesize` |
| Visual regression baseline | Playwright snapshot baseline |
| Design System Storybook section | Typography, Spacing, Motion docs |
| CommandPalette | Complex but high-impact |
| Chip / Tag | Filter UIs |
| Callout | Editorial content |
| SkipLink | WCAG 2.4.1 utility |
| `CHANGELOG.md` + `MIGRATION.md` | Pre-1.0 documentation |
| **1.0 release** | Stable API contract |

---

*Document generated April 2026. Revisit and revise after Phase 2 is complete.*
