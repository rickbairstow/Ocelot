# Ocelot UI — Component Library Roadmap

> **Status:** Planning document · April 2026  
> **Current version:** 0.0.22 · 66 components · ~115 registered icons

---

## Session Log

### Session 7 — May 2026

**Docs follow-through:** Added Storybook guidance pages for form validation, dark mode, and RTL support. README installation notes now reflect automatic Teleport target creation, NavigationBar mobile menu support, dark mode expectations, and the validation boundary.

**RTL visual pass:** Added `Patterns/RTL Layouts` as a right-to-left smoke-test composition covering NavigationBar, Breadcrumb, Banner, Stepper, Card, Badge, Button, and Pagination.

**Validation decision recorded:** OUI keeps validation library logic out of scope for the current release line. `FormField` owns accessible structure and ARIA wiring; host apps or validation libraries own rules, touched/dirty state, async validation, and submission state. Vee-Validate is documented as the recommended first external integration for schema-driven Vue validation.

**Dark mode coverage:** Added a forced-dark Storybook smoke-test composition covering common surfaces, navigation, form controls, status colours, and progress states.

Validation after this pass: `npm run lint`, `npm run check-types`, and `npm run test:run` passed.

---

### Session 6 — May 2026

**Shipped:** `Callout` consolidation is complete. The standalone `Callout.vue` component, story, export, and type export were removed. `Banner` now covers static/editorial callouts directly with the existing `tip` treatment plus a new `note` type and a dedicated `EditorialCallouts` story.

**NavigationBar responsive follow-up closed** — `NavigationBar` now has a first-class `#mobile-menu` slot, controlled/uncontrolled `mobileMenuOpen` support, `update:mobileMenuOpen`, `aria-expanded`, `aria-controls`, and an internal toggle path while preserving the existing `menu-toggle` event.

**Optional dependency coverage** — `src/utilities/optionalDependency.ts` now has focused unit coverage for development warnings, duplicate suppression, and production silence.

**Pattern follow-through** — added `Patterns/Product Screens` stories covering dashboard, settings, data-list, onboarding, and marketing compositions using OUI primitives.

Validation after this pass: `npm run check-types`, `npm run eslint`, and the focused optional dependency Vitest run passed.

---

### Session 5 — April 2026

**Shipped:** RTL cleanup for the known physical-positioning leftovers — Toast, Sidebar, Card selected indicator, FloatingPanel, DropdownMenuContent, and DropdownMenuSubmenu now use logical start/end positioning or inline logical properties where appropriate.

**Accordion cleanup** — `Accordion` migrated from native `<details>/<summary>` to the explicit `<button aria-expanded aria-controls>` disclosure pattern, with animated content reveal, richer title slot support, and `expandIcon` slot state. `AccordionGroup` stories cover exclusive and non-exclusive modes.

**Two-level submenu support** — `DropdownMenuSubmenu` and `NavigationBarSubmenu` were added and exported. The nesting limit is intentionally two levels total: a top-level menu plus one submenu level. Deeper nesting remains out of scope and should be called out in docs.

**Teleport target automation** — `useTeleportTarget()` and `configureTeleportTarget()` were added and exported. Dialog, Toast, and CommandPalette now ensure a target exists on the client, while still allowing consumers to register a custom target. Storybook composable docs now cover this API.

**Audit leftovers closed** — Button now avoids accidental form submission with `type="button"` and no longer adds redundant `role="link"` to native anchors. Badge no longer applies redundant note semantics.

**Decision recorded:** `Callout` overlaps too heavily with `Banner`. Keep the current `Banner` direction, preserve the preferred callout/tip colour treatment there, and remove the standalone `Callout` component and story before release.

Validation after this pass: `npm run lint`, `npm run check-types`, and `npm run test` passed.

---

### Session 4 — April 2026

**Shipped:** Form components accessibility audit — all five prior test failures resolved (Switch `label-title-only` axe, Checkbox indeterminate DOM timing, Textarea counter contrast). Full WCAG 2.1 AA audit of all form primitives: `aria-checked="mixed"` on indeterminate Checkbox; CheckboxGroup converted to `<fieldset>/<legend>` with `label` prop; Radio `effectiveId` bug fixed; FormField `role="alert"` + `aria-live="polite"` conflict resolved; Textarea character count linked via `aria-describedby`.

**Input type extensions** — Password show/hide eye toggle (built-in, disabled-aware); Search clear (×) button (appears reactively); Number `min`/`max`/`step` props; `type` prop narrowed to a union; `'search'` added to style lookup. Five new stories with play functions.

**SkipLink component** — `sr-only` until focused (`focus:not-sr-only`); `target` prop (default `"main"`), `label` prop (default `"Skip to main content"`). WCAG 2.4.1 Bypass Blocks. Two stories.

**`culori` removed** — unused dead weight (~8KB); re-add only if a custom ColorPicker is built.

**Date/Time inputs** — `type="date"`, `type="time"`, `type="datetime-local"` added to Input union; `min`/`max` widened to `number | string` to accept date strings. Three new stories.

All 256 tests passing.

---

### Session 3 — April 2026

**Audit:** Full codebase audit against current build. Roadmap reconciled against actual component files. TypeScript errors surfaced and catalogued. Component-by-component UX, accessibility, and usability review completed. Findings written to §15. Key discoveries: `SidebarNavGroup` and `SidebarNavItem` missing from library exports; `HelloWorld` incorrectly exported; 12 TypeScript errors across components and stories; no `prefers-reduced-motion` support in any animated component; `vite-plugin-dts` absent (consumers receive no `.d.ts` types from the npm package); several component-level a11y and UX issues logged for individual fix sessions. RTL audit confirms logical CSS properties used in most places but physical `left-`/`right-` still present in positioning components (Toast, Sidebar, Card selected indicator).

---

### Session 2 — April 2026

**Shipped:** §3 Icon Library (hybrid icon prop, `registerIcons()`, registry expanded to ~115 icons, new stories). §4 Theming & Design Tokens (`--oui-*` tokens, `@theme inline` bridge, single-file CSS consolidation — `tailwind.css` is now the only consumer import). §5 Existing Component Improvements — Button icon support (strict sizes, `iconPosition` start/end/flex-aware), Badge (dot, removable, outline, truncate), Divider (label + labelAlign), Dialog (size prop replacing `small` boolean, description slot), Loader (size + color props), Card (named slots, variant, clickable, selected), Accordion (variant, expandIcon slot), AccordionGroup (exclusive mode via provide/inject), Toast.vue (action button, per-toast icon override, onClose callback), `AccordionGroup` and `useToast` added to library exports. All 121 tests passing. Future consideration recorded: §14 Remove Tailwind / replace with scoped CSS.

---

### Session 1 — April 2026

**Planning:** Full roadmap written (this document + HTML version).

**Bug fixes shipped (discovered during plan review — 82/82 tests passing):**

| Component | Fix | Type |
|---|---|---|
| `Input.vue` | `:required`, `:minlength`, `:pattern` props were declared but never bound to the native `<input>` — HTML5 validation was silently broken | Bug |
| `Dialog.vue` | Hardcoded `id="dialogueTitle"` caused DOM ID collisions when multiple dialogs exist simultaneously | Bug |
| `Dialog.vue` | Missing `aria-modal="true"` — screen readers in browse mode could navigate outside the modal | A11y |
| `Dialog.vue` | `tabindex="0"` on outer `<section>` put the container in the tab order incorrectly | A11y |
| `Dialog.vue` | Title div `tabindex="0"` → `tabindex="-1"` — programmatic focus target should not be in sequential tab order | A11y |
| `Dialog.vue` | `aria-labelledby` now used (linked to unique UUID title ID) when `#title` slot is present; falls back to `aria-label` prop | A11y / Plan |
| `Accordion.vue` | `aria-expanded`/`aria-controls` on `<summary>` caused double-announcement — native `<details>` handles these already | A11y / Plan |
| `Accordion.vue` | `duration-[1000]` is invalid CSS (no unit) — `transition-duration: 1000` is ignored by all browsers | Bug |
| `Button.vue` | `@keydown.enter.prevent` unconditionally called `preventDefault()` — silently broke Enter-key navigation on `<a>` link buttons when not disabled | Bug |
| `Scrim.vue` | `aria-disabled="true"` on a non-interactive `<div>` is invalid — replaced with `aria-hidden="true"` | A11y |
| `ReadMore.vue` | "Show more"/"Show less" were hardcoded English strings — added `expandLabel`/`collapseLabel` props (backwards-compatible) | Plan |
| `Dialog.stories.ts` | Test queried by `aria-label` ("My dialog") — updated to query by visible title text ("Dialog title") after `aria-labelledby` fix | Test |
| `Scrim.stories.ts` | Test asserted `aria-disabled="true"` — updated to assert `aria-hidden="true"` after fix | Test |

---

## Status Snapshot

### Covered

- Foundation work is largely complete: icon system overhaul, `registerIcons()`, expanded registry, `ButtonGroup`, `Tooltip`, `FormField`, `useToast` export, theming/design tokens, and reduced-motion support.
- Existing component upgrades are largely complete: Button, Badge, Card, Accordion, Divider, Dialog, Toast, Loader, Input, `ReadMore` labels, `SkipLink`, and date/time input support are all recorded as shipped.
- Phase 2 is effectively complete: Alert/Banner, Avatar/AvatarGroup, Tabs, Breadcrumb, Progress, Pagination, Stepper, and the full first wave of form primitives are marked done.
- Phase 3 is substantially complete: Dropdown Menu, two-level Dropdown submenus, two-level NavigationBar submenus, Stats / Metric Card, Empty State, Code Block, Timeline, Popover, and Quote are marked done.
- Form accessibility work is substantially complete: the Session 4 audit closed the previously failing form stories and documented WCAG 2.1 AA fixes across Checkbox, CheckboxGroup, Radio, FormField, Textarea, and Switch.
- Teleport target handling is covered by `useTeleportTarget()` / `configureTeleportTarget()` and Storybook composable docs.
- NavigationBar now includes a built-in small-screen menu composition path via `#mobile-menu`.
- Static/editorial callouts are now represented as `Banner` compositions; the standalone `Callout` primitive has been removed.
- Product-level Storybook compositions now cover dashboard, settings, data-list, onboarding, and marketing examples.
- Form validation strategy is documented: OUI provides accessible field structure and leaves validation state/rules to the host app, with Vee-Validate as the recommended external-library path.
- Dark mode setup and expectations are documented, with a forced-dark Storybook coverage story for common surfaces and controls.
- RTL guidance and a Storybook smoke-test composition are in place.

### Partially Covered

- RTL support is improved and has a Storybook smoke test, but is not yet formally certified with viewport snapshots and a full keyboard/overlay matrix.
- Storybook/DX polish is now mostly documentation upkeep rather than a single unfinished task: bundle analyser, optional dependency cleanup, build/type cleanup, `useTeleportTarget` docs, product patterns, validation guidance, dark mode notes, and RTL notes are covered.


### Still Left To Do

- Formal RTL certification still needs viewport snapshots, keyboard navigation checks, and overlay placement checks before OUI claims official RTL support.
- Dark mode still needs manual visual review in Storybook for every component before a stable release, even with the forced-dark smoke test in place.
- Release documentation should keep being reconciled before a stable release so README, Storybook, and the roadmap match the shipped API surface.


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
13. [Patterns & Compositions](#13-patterns--compositions)
14. [Future: Remove Tailwind](#future-remove-tailwind--replace-with-scoped-css)

---

## 1. Current State Assessment

This section captures the initial audit baseline from the start of the roadmap. The current shipped state has moved on substantially; use the session log and status snapshot above for the up-to-date view.

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

### Current dependency state

| Package | Version | Size (approx.) | Issue |
|---|---|---|---|
| `@tabler/icons-vue` | ^3.41.1 | ~2MB (full) / tree-shaken | Used by `useIcons.ts` — tree-shaking is only partial unless consumer imports directly |
| `@floating-ui/dom` | ^1.7.6 | ~15KB gzip | Reasonable; used by FloatingPanel |
| ~~`photoswipe`~~ | ^5.4.4 | ~18KB gzip | ✅ Moved to optional peer dependency; installed as devDependency for local tests/stories |
| ~~`plyr`~~ | ^3.8.4 | ~38KB gzip | ✅ Moved to optional peer dependency; installed as devDependency for local tests/stories |
| ~~`qrcode`~~ | ^1.5.4 | ~25KB gzip | ✅ Moved to optional peer dependency; installed as devDependency for local tests/stories |
| ~~`culori`~~ | ~~^4.0.2~~ | ~~~8KB gzip~~ | ✅ Removed — was unused dead weight; re-add if ColorPicker is ever built |

### Recommended actions

1. ~~**`photoswipe`, `plyr`, `qrcode`**~~ — ✅ Moved to optional `peerDependencies` with local `devDependencies` for development. Remaining work: improve docs and keep `optionalDependency.ts` fully covered because it now guards the consumer-facing failure paths.

2. ~~**`culori`**~~ — ✅ Removed.

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

## 3. Icon Library — ~~The Critical Problem~~ ✅ Done

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

## 4. Theming & Design Tokens ✅ Done

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

## 5. Existing Component Improvements ✅

### Button

**Current gaps vs. TailwindUI standard:**
- No built-in icon support — consumers must compose `Icon` + `Button` manually with no guaranteed spacing or alignment.
- No `ButtonGroup` for segmented button patterns.
- The `small` variant may not meet 44×44px minimum touch target on mobile (Fitts's Law violation).
- No icon-only (square) variant with enforced `aria-label`.

**Recommended improvements:**

1. ✅ **Keyboard navigation bug on `<a>` elements (bug fix)** — `@keydown.enter.prevent` unconditionally called `event.preventDefault()`, silently breaking Enter-key navigation on link buttons (`href` set) when not disabled. Fixed: replaced with a `handleKeyInteraction` method that only prevents default when disabled, and handles Space correctly (prevent scroll + trigger click) without interfering with native Enter behaviour.
2. **`icon` prop with `iconPosition`** — full icon support for Button. See detailed spec below.
3. **`iconOnly` prop** — switches to square aspect ratio, ensures adequate touch target via padding, enforces `aria-label` requirement in dev mode.
4. **`ButtonGroup` component** — a wrapper that:
   - Removes border radius on interior children (`[&:not(:first-child):not(:last-child)]:rounded-none`)
   - Collapses margins between buttons
   - Accepts `orientation` (horizontal/vertical)
   - Accepts `size` and `variant` to pass down to all children (avoiding repeated props)
5. **Touch target audit** — the `small` variant's click area must be ≥ 44×44px. Add invisible padding or use `min-h-[44px] min-w-[44px]` on the outer element.
6. **Story additions:** icon-only (all colours), icon + label (start and end), ButtonGroup horizontal, ButtonGroup vertical, all size × variant matrix.

#### Button icon spec

**Props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `IconProp \| undefined` | `undefined` | Icon to render alongside the button label. Accepts a string (registry lookup) or a Vue component (direct render). |
| `iconPosition` | `'start' \| 'end'` | `'start'` | Whether the icon appears before or after the label. Follows document direction — `start` = inline-start (left in LTR, right in RTL), `end` = inline-end. |

**Behaviour:**

- **Registry validation** — When `icon` is a string, check it exists in the icon registry before rendering. If not found: do not render any icon element, and in development mode (`import.meta.env.DEV`) emit `console.warn('[OuiButton] Icon "X" not found in registry. Register it with registerIcons() or pass the component directly.')`. No error is thrown — the button remains fully functional without the icon.
- **Component passthrough** — When `icon` is a Vue component, render it directly without any registry lookup. No warning is emitted.
- **Size mapping** — Icon size is derived from the button `size` prop and must never exceed the button's line-height. Use the icon size constants from `useIcons`:

  | Button size | Icon size | Rationale |
  |---|---|---|
  | `sm` | `xs` (12px) | Matches the sm button's 14px text; icons feel proportionate at 12px |
  | `md` (default) | `sm` (16px) | Matches the md button's 16px text |
  | `lg` | `md` (20px) | Matches the lg button's 18–20px text; 20px icon anchors well |

- **Layout** — The button's inner element becomes `flex flex-row items-center` with a gap between icon and label. Using `flex-row` (not `flex-row-reverse`) means swapping `iconPosition` between `'start'` and `'end'` is achieved by rendering the icon component either before or after the label slot in the template — no `direction`-specific CSS overrides needed. RTL support is automatic because flexbox follows the document's writing direction.
- **Icon-only** — When `icon` is set and there is no label slot content (or `iconOnly` prop is true), switch to square padding and enforce that `aria-label` is provided. In dev mode, warn if `aria-label` is absent.
- **No icon duplication** — If the consumer is already using the prefix/suffix slot to render an icon manually, that is fine — the `icon` prop does not interact with the slots.

**Implementation sketch:**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useIcons } from '@Composables/useIcons'

const { registry, sizes } = useIcons()

const props = withDefaults(defineProps<{
    icon?: IconProp
    iconPosition?: 'start' | 'end'
    size?: 'sm' | 'md' | 'lg'
    // ... other existing props
}>(), {
    iconPosition: 'start',
    size: 'md',
})

const iconSizeMap: Record<string, string> = {
    sm: 'xs',
    md: 'sm',
    lg: 'md',
}

const resolvedIcon = computed(() => {
    if (!props.icon) return null
    if (typeof props.icon !== 'string') return props.icon

    const found = registry[props.icon]
    if (!found && import.meta.env.DEV) {
        console.warn(`[OuiButton] Icon "${props.icon}" not found in registry. Register it with registerIcons() or pass the component directly.`)
    }
    return found ?? null
})

const iconSize = computed(() => iconSizeMap[props.size ?? 'md'])
</script>

<template>
    <!-- inside the button element: -->
    <span class="flex flex-row items-center gap-1.5">
        <component
            :is="resolvedIcon"
            v-if="resolvedIcon && iconPosition === 'start'"
            :size="sizes[iconSize]"
            aria-hidden="true"
        />
        <slot />
        <component
            :is="resolvedIcon"
            v-if="resolvedIcon && iconPosition === 'end'"
            :size="sizes[iconSize]"
            aria-hidden="true"
        />
    </span>
</template>
```

Note: the icon element always has `aria-hidden="true"` — it is purely decorative. The button's accessible name comes from its label text or `aria-label` prop.

**Storybook stories to add:**

- `IconStart` — string icon, `iconPosition: 'start'`, all button sizes
- `IconEnd` — string icon, `iconPosition: 'end'`
- `IconComponent` — Vue component passed directly (no registry lookup)
- `IconNotFound` — string that does not exist in registry (check console for warning, button renders without icon)
- `IconOnly` — `iconOnly: true` with `aria-label`, no label slot (play function asserts `aria-label` is present)
- `IconOnlyMissingLabel` — dev warning test: `iconOnly: true`, no `aria-label` (play function checks console warning)
- `IconAllVariants` — matrix story: icon × all `variant` × all `color` values
- `IconRtl` — wraps story in a `dir="rtl"` container; asserts icon visually switches sides

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

**Status:** Implemented. Keep this section as the original scope/spec reference and decision record.

**Shipped improvements:**

1. **`AccordionGroup` wrapper** — controls child `Accordion` state via provide/inject, with exclusive and non-exclusive modes.
2. **`variant` prop on `Accordion`:** `default`, `flush`, and `contained`.
3. **`id` prop** — allows consumers to control the item identity used by `AccordionGroup`.
4. **`expandIcon` slot** — supports custom icons and exposes open state to the slot.
5. **ARIA disclosure migration** — replaced `<details>/<summary>` with the explicit `<button aria-expanded aria-controls>` pattern, avoiding inconsistent browser/AT behaviour and duplicate announcements.
6. **Story coverage** — AccordionGroup exclusive mode, non-exclusive mode, default open state, variants, custom expand icon, and richer content examples.

**Open note:** The audit still questions whether `AccordionGroup` should default to `exclusive: true` or whether multiple-open behaviour is the more expected default. That is an API decision, not an implementation gap.

### Divider

**Recommended improvements:**

1. **`label` prop** — text or icon centred on the divider line. Common use: "Or continue with" between form sections. Rendered as `<div role="separator" aria-label="[label]">`.
2. **`labelAlign` prop:** `start`, `center` (default), `end`.
3. **Story additions:** Divider with label (text), Divider with label (icon), Divider with label (custom slot content), as form section separator.

### Dialog

**Recommended improvements:**

1. ✅ **`title` slot + automatic `aria-labelledby`** — ~~currently `ariaLabel` is a prop that sets `aria-label` on the dialog element.~~ Fixed: dialog now uses `aria-labelledby` pointing to a UUID-keyed title element when the `#title` slot is present, falling back to `aria-label` for dialogs without a visible title. Also fixed: duplicate hardcoded `id="dialogueTitle"`, missing `aria-modal="true"`, and incorrect `tabindex` on container/title elements.
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

1. ✅ **Missing attribute bindings (bug fix)** — `:required`, `:minlength`, and `:pattern` were all declared as props but never bound to the native `<input>` element, silently breaking HTML5 form validation. Fixed.
2. **Validation state prop** — `state`: `'idle' \| 'valid' \| 'invalid' \| 'warning'`. Applies the appropriate border/icon colour. This must be implemented before other form components are built so there is a consistent model to follow.
3. **`helperText` prop / `#helper` slot** — descriptive text shown beneath the input (always visible, not conditional on state).
4. **`errorMessage` prop / `#error` slot** — error text shown beneath the input only when `state === 'invalid'`. Both `helperText` and `errorMessage` must be linked to the input via `aria-describedby`.
5. **`clearable` prop** — shows a clear (×) button inside the suffix when the input has a value. Emits `update:modelValue` with `''`. Useful for search inputs.
6. **`size` prop** — `'sm' \| 'md' \| 'lg'` to match Button and other components. Currently has no size control.
7. **Story additions:** all validation states, clearable input, size variants, input with helper text, input with error message (play function tests typing + error display), input with prefix icon.

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

1. ✅ **`expandLabel` and `collapseLabel` props** — ~~currently hardcoded as "Show more" / "Show less".~~ Fixed: props added with the original strings as defaults. Fully backwards-compatible.
2. **`#trigger` slot** — allow consumers to replace the text button with a custom expand trigger entirely.
3. **Story additions:** custom labels, with custom trigger slot, in a Card, with very short content (should not render the trigger at all).

### Scrim

**Recommended improvement:**

1. ✅ **`aria-disabled` on non-interactive element (bug fix)** — when `clickable` is false the scrim renders as a `<div>`, but `aria-disabled="true"` was applied to it. `aria-disabled` is only valid on interactive roles. Fixed: replaced with `aria-hidden="true"` (a non-clickable scrim is purely decorative).
2. **`zIndex` prop** — consumers using multiple overlapping overlay components (Dialog + Sidebar both using Scrim) need to control stacking order. A `zIndex` prop (or named z-index levels: `'overlay' \| 'modal' \| 'top'`) prevents z-index conflicts.
3. **Story additions:** scrim behind Dialog, scrim behind Sidebar, named z-index levels.

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

**Status:** Implemented, including one submenu level.

**Components:** `DropdownMenu` (root), `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuSeparator`, `DropdownMenuLabel`, `DropdownMenuSubmenu` (nested)

**Intentional limitation:** Dropdown nesting is limited to two levels total: the top-level menu plus one submenu level. Deeper nested menus are intentionally unsupported because they become difficult to scan, steer, and use on touch devices.

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

#### Table (DataTable via TanStack Table)

> **Updated decision:** OUI Table will use **TanStack Table v8** (`@tanstack/vue-table`) as its headless engine. This provides sorting, filtering, pagination, selection, column visibility, resizing, and pinning for free — with full TypeScript generics and server-side support. OUI provides the Vue template layer and styles on top.

**Architecture:**

```
Consumer provides:              OUI provides:
  data: T[]               →    <OuiTable> renders the full table UI
  columns: ColumnDef<T>[]      including header, body, footer, pagination,
                               toolbar (search, density, column visibility)
```

The component creates and manages the TanStack table instance internally, but exposes it via `defineExpose({ table })` so consumers who need direct access (e.g. for imperative row selection) can get it.

**Installation note:** `@tanstack/vue-table` must be listed as a peer dependency (optional) — only consumers using `OuiTable` need to install it.

---

**`OuiTable` props:**

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `T[]` | required | Row data array |
| `columns` | `ColumnDef<T>[]` | required | TanStack column definitions |
| `caption` | `string` | — | Accessible `<caption>` (sr-only by default) |
| `captionVisible` | `boolean` | `false` | Renders caption visibly above the table |
| `striped` | `boolean` | `false` | Alternating row backgrounds |
| `hoverable` | `boolean` | `true` | Row highlight on hover |
| `bordered` | `boolean` | `false` | Cell borders |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Cell padding density |
| `stickyHeader` | `boolean` | `false` | Header fixed during vertical scroll |
| `stickyFirstColumn` | `boolean` | `false` | First column fixed during horizontal scroll |
| `loading` | `boolean` | `false` | Shows skeleton rows in place of data |
| `loadingRows` | `number` | `5` | Number of skeleton rows to show |
| `manualSorting` | `boolean` | `false` | Disable client-side sort — consumer handles via `@sort-change` |
| `manualPagination` | `boolean` | `false` | Disable client-side pagination — consumer handles via `@page-change` |
| `manualFiltering` | `boolean` | `false` | Disable client-side filtering |
| `pageCount` | `number` | — | Required when `manualPagination` is true |
| `rowCount` | `number` | — | Total row count for server-side pagination display |
| `pagination` | `boolean` | `true` | Show built-in pagination bar |
| `pageSize` | `number` | `10` | Default rows per page |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | Per-page selector options |
| `globalFilter` | `boolean` | `false` | Show global search input in the toolbar |
| `columnVisibility` | `boolean` | `false` | Show column visibility toggle in the toolbar |
| `rowSelection` | `'none' \| 'single' \| 'multi'` | `'none'` | Enables row checkboxes |
| `getRowId` | `(row: T) => string` | `row index` | Stable row identifier for selection |

**Emits:**

| Event | Payload | When |
|---|---|---|
| `sort-change` | `{ id: string, desc: boolean }[]` | User clicks a sortable column header |
| `page-change` | `{ pageIndex: number, pageSize: number }` | Page or page size changes |
| `filter-change` | `string` | Global filter input changes |
| `row-selection-change` | `Record<string, boolean>` | Selected rows change |
| `row-click` | `{ row: Row<T>, event: MouseEvent }` | User clicks a row |

**Slots:**

| Slot | Props | Purpose |
|---|---|---|
| `#toolbar` | — | Replaces the entire toolbar area above the table |
| `#toolbar-start` | — | Prepend to the toolbar (before the search input) |
| `#toolbar-end` | — | Append to the toolbar (after column visibility toggle) |
| `#empty` | — | Shown when no rows match (integrates with EmptyState component) |
| `#loading` | — | Shown when `loading` is true (integrates with Placeholder skeleton) |
| `#cell-[columnId]` | `{ row, cell, getValue }` | Custom cell renderer per column |
| `#header-[columnId]` | `{ column }` | Custom header renderer per column |
| `#row-actions` | `{ row }` | Action buttons rendered in the last column |

**Defines expose:** `table` — the raw TanStack `Table<T>` instance for advanced consumer use.

---

**Feature details:**

**Sorting:**
- Click column header to sort ascending; click again for descending; click again to clear.
- `aria-sort="ascending|descending|none"` on `<th>` elements.
- Multi-column sort via Shift+Click.
- Sort icons (up/down/neutral) rendered using OUI Icon component.

**Filtering (global search):**
- Opt-in via `globalFilter` prop. Renders a search Input in the toolbar.
- 300ms debounce before filtering fires to avoid re-rendering on every keypress.
- For server-side: emit `filter-change` and pass `manualFiltering`.

**Pagination:**
- Renders OUI Pagination component below the table.
- Shows "Showing X–Y of Z rows" alongside the pagination controls.
- Per-page selector using native `<select>` (styled).

**Row selection:**
- `single`: radio-style (only one row at a time, no checkboxes column).
- `multi`: checkbox column injected as first column automatically. Header checkbox selects/deselects all visible rows. Indeterminate state when partially selected.
- Selected rows highlighted with a distinct background.

**Column features (via TanStack):**
- **Visibility toggle:** a popover in the toolbar listing all column names as checkboxes.
- **Resizing:** drag handles on column headers to resize. Uses TanStack's `columnResizeMode: 'onChange'`.
- **Pinning:** first and/or last column can be sticky (horizontal scroll). Controlled via `stickyFirstColumn` prop; full column pinning available via the exposed `table` instance.

**Loading state:**
- Replaces all data rows with Placeholder skeleton rows (using the existing Placeholder component).
- Header columns remain visible during loading.

**Row actions:**
- Use the `#row-actions` slot to inject Buttons (or a DropdownMenu) per row.
- OUI automatically appends a fixed-width "Actions" column when this slot is used.

---

**Responsive behaviour:**

Two strategies, both supported:

1. **Horizontal scroll** (default) — wrap the `<table>` in an `overflow-x-auto` container. The sticky header and sticky first column work within this. A subtle scroll shadow (`gradient` mask on the right edge) hints that there is more content. This is the pattern used by TailwindUI.

2. **Card layout on mobile** (opt-in via `responsiveMode="card"` prop) — at `< md` breakpoints, each row collapses into a card. Column headers become inline labels beside each value. Uses CSS grid inside each card. This is the pattern used by Mantine's DataTable.

The default is horizontal scroll as it preserves the table's semantic structure (`<table>`, `<tr>`, `<td>`) at all breakpoints, which is better for accessibility and screen readers.

---

**UX considerations:**

- **Fitts's Law:** Sort click targets cover the full column header width, not just the icon.
- **Hick's Law:** Column visibility and density controls are hidden behind toolbar toggles — not always visible. Don't overwhelm with controls.
- **Von Restorff Effect:** Selected rows must be clearly distinct from hovered rows. Use a persistent background colour, not just a hover effect.
- **Law of Proximity:** Row actions are right-aligned within the row — spatially associated with the row, not the table header.
- **Aesthetic-Usability Effect:** Loading skeletons must match the column structure exactly (same widths). A skeleton that doesn't align to columns feels broken, not loading.
- Sortable column headers should show a sort icon even in the unsorted state (subtle neutral icon) so users know the column is sortable before clicking.
- Zero-data state should use the EmptyState component with a contextual message — not just an empty table body.

---

**TanStack column definition pattern for consumers:**

```ts
import { createColumnHelper } from '@tanstack/vue-table'

const columnHelper = createColumnHelper<User>()

const columns = [
    columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
        enableSorting: true,
    }),
    columnHelper.accessor('email', {
        header: 'Email',
        enableSorting: false,
    }),
    columnHelper.accessor('role', {
        header: 'Role',
        filterFn: 'equals',
    }),
]
```

---

**Stories:**
- Default (basic data, no features)
- Sortable columns (play function clicks header, asserts aria-sort)
- With pagination (play function navigates pages)
- With global filter (play function types in search, asserts filtered row count)
- With row selection — multi (play function selects rows, asserts count)
- With row actions (DropdownMenu per row)
- Loading state (skeleton rows)
- Empty state (EmptyState slot)
- Server-side mode (manualSorting + manualPagination — mock API)
- Sticky header (scroll demo)
- Responsive horizontal scroll (mobile viewport)
- Responsive card layout (mobile viewport, `responsiveMode="card"`)
- Column visibility toggle (play function hides a column)
- Dense / comfortable / spacious density toggle

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

**Status:** Implemented, including one submenu level and a first-class small-screen `#mobile-menu` slot. Keep this section as the original scope/spec reference for future refinement work.

Almost every web application has a top navigation bar. Currently consumers must build this entirely from scratch using OUI primitives. A `NavigationBar` component would not be prescriptive about layout — it would handle the common patterns:

- **`NavBar`** — a `<header>` wrapper with `role="banner"`, consistent height, horizontal layout, and a `sticky` prop.
  - Slots: `#brand` (logo/name), `#nav` (primary nav links), `#actions` (right-side: search, avatar, theme toggle)
- **`NavBarItem`** — an individual nav link with: `href`, `active` (`aria-current="page"`), `icon` (IconProp)
- **`NavigationBarSubmenu`** — a nav item with a dropdown sub-menu.

**Intentional limitation:** Navigation submenus are limited to two levels total: a top-level nav item plus one submenu panel. For deeper information architecture, recommend Sidebar, AppShell, or a dedicated page-level subnav instead.

**Note:** This component is intentionally layout-focused, not opinionated about visual design. The `#nav`, `#brand`, and `#actions` slots give consumers full control over content.

**ARIA:** The outer `<header>` uses the implicit `banner` landmark. The `<nav>` inside must have `aria-label` to distinguish it from other `<nav>` elements on the page (e.g. the Sidebar's nav).

**Stories:** Basic NavBar with brand + links + avatar, with submenu nav item, mobile/responsive coverage, sticky on scroll.

**Responsive follow-up:** Closed in Session 6 with `#mobile-menu`, `mobileMenuOpen`, `update:mobileMenuOpen`, `aria-expanded`, and `aria-controls`.

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

**Status:** Implemented. Keep this section as the original scope/spec reference for future refinement work.

A full-screen search overlay — increasingly expected in modern web products.

**Props:** `placeholder`, `emptyText`

**`useCommandPalette()` composable** — `open()`, `close()`, `register(items)` — allows child routes/views to register their own commands at mount time.

**Keyboard:** `Escape` to close, `Arrow Up/Down` to navigate results, `Enter` to execute selected command.

**Stories:** With grouped results, with icons and shortcuts, empty search state, keyboard navigation play function.

---

#### ~~Chip / Tag~~

No longer planned as a separate component. OUI standardises on the term **Badge** and avoids shipping a duplicate label for substantially overlapping UI. If future product requirements call for selectable filter pills, removable tokens, or input-style chips, that work should be scoped as an interactive Badge extension or a more clearly named token/filter component rather than a generic `Chip / Tag`.

---

#### ~~Callout~~

**Status:** Removed in Session 6. Static/editorial callouts now use `Banner`.

**Decision:** Do not keep a standalone `Callout` primitive. It overlaps too heavily with `Banner`, and `Banner` already has the broader API: dismissibility, announcement roles, title tag control, variants, icon slot, and the `tip` / `note` palettes.

---

#### ~~SkipLink~~

✅ Done — `sr-only` until focused; `target` prop (default `"main"`), `label` prop (default `"Skip to main content"`). WCAG 2.4.1 Bypass Blocks.

---

## 7. Forms & Inputs (Brief)

> ⚠️ **Needs more thought before implementation.** Forms are on hold pending a validation strategy decision. The goal is to avoid reinventing the wheel — existing packages (Vee-Validate, FormKit, etc.) should be evaluated before building a custom validation layer. All components should stay as native as possible; avoid complex custom implementations where a styled native element will do.

Forms are a significant workstream deserving their own detailed spec. Key gaps and architectural principles are noted here.

### Missing form primitives

| Component | Priority | Key notes |
|---|---|---|
| Textarea | 1 | Auto-resize variant (ResizeObserver); min/max rows |
| Select (native) | 1 | Styled `<select>` first — native semantics, low complexity |
| Checkbox | 1 | With indeterminate state; `CheckboxGroup` wrapper |
| Radio / RadioGroup | 1 | Horizontal and vertical layouts; `fieldset/legend` pattern |
| Switch / Toggle | 1 | Replaces checkbox in on/off UIs; `role="switch"`, `aria-checked` |
| ~~Input[type=tel]~~ | ~~1~~ | ✅ Done |
| ~~Input[type=email]~~ | ~~1~~ | ✅ Done |
| ~~Input[type=password]~~ | ~~1~~ | ✅ Done — built-in show/hide eye toggle; disabled state handled |
| ~~Input[type=number]~~ | ~~2~~ | ✅ Done — `min`, `max`, `step` props bound to native input |
| ~~Input[type=search]~~ | ~~2~~ | ✅ Done — clear (×) button appears when value is non-empty |
| ~~Date / Time pickers~~ | ~~2~~ | ✅ Done — `type="date"`, `type="time"`, `type="datetime-local"` added to Input; `min`/`max` props widened to `number \| string` to accept date strings |
| ColorPicker | 3 | Native `<input type="color">` as a starting point |
| File Upload | 2 | Drag-and-drop zone, file list, upload progress integration |
| Range / Slider | 2 | Single handle; dual-handle for min/max range |
| Combobox | 3 | Searchable select using Floating UI (already a dependency) |
| OTP / Pin Input | 3 | Multi-cell code entry for 2FA screens |

### Validation — decision needed

Before any new form component is built, a validation strategy must be chosen. Options:

1. **Vee-Validate** — schema-based (Zod/Yup), widely used in Vue ecosystem, composable API, no opinion on UI.
2. **FormKit** — full-stack form framework with its own component layer; more opinionated, may conflict with OUI's own components.
3. **Native HTML5 only** — leverage the browser's built-in constraint validation API; lowest complexity, but limited UX control.
4. **Custom `provide/inject` context** — lightweight Form/FormField wrapper, no external dep. Most flexibility, most work.

**Recommendation:** Evaluate Vee-Validate first. It integrates cleanly alongside existing component libraries without replacing them, and its schema validation story is strong.

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

- Stay native where possible — use `<input type="x">` before reaching for a custom implementation.
- `required` fields use `aria-required="true"`, not just a visual asterisk. The asterisk should have `aria-hidden="true"` with a legend note.
- `disabled` vs `readonly` must be visually distinct and both supported on all inputs.
- `autocomplete` attribute must be passable on all text-input components.
- Every form component must accept `id` and `name` props; IDs must auto-generate a UUID as a fallback (already done in Input).
- `FormField` encapsulates the ARIA linking (`for`/`id`, `aria-describedby` pointing to helper + error) so consumers don't wire it manually.

**UX Law:** Tesler's Law — form complexity cannot be reduced, only shifted. OUI absorbs the ARIA linking, ID management, and validation state propagation so consumers write clean, simple template code.

---

## 8. Cross-Cutting Technical Concerns

### Browser-only dependencies

OUI is scoped as a Vue client-side component library. Browser-only dependencies such as Photoswipe, Plyr, QR code generation, focus management, and Teleport targets should stay lazily loaded or mounted-state guarded where required. Full SSR/Nuxt certification is out of scope for the current roadmap.

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
- **Current cleanup state:** the known physical-positioning leftovers from the Session 3 audit have been corrected in Toast, Sidebar, Card, FloatingPanel, DropdownMenuContent, and DropdownMenuSubmenu. A full visual RTL test matrix remains future work.

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

| Item | Type | Status |
|---|---|---|
| ~~Icon hybrid prop (string + component)~~ | Update `Icon.vue` | ✅ Done |
| ~~`registerIcons()` composable~~ | New export | ✅ Done |
| ~~Icon registry expansion (~120 icons)~~ | Update `useIcons.ts` | ✅ Done |
| ~~`Button` — prefix/suffix icon props + `iconOnly` variant~~ | Update | ✅ Done |
| ~~`ButtonGroup` component~~ | New | ✅ Done |
| ~~`Tooltip`~~ | New | ✅ Done |
| ~~`FormField` wrapper~~ | New | ✅ Done — layout + ARIA wrapper with `provide/inject` context; `Input.vue` updated to inject; no validation logic (consumers bring Vee-Validate etc.) |
| ~~Export `useToast` from library root~~ | Update entry point | ✅ Done |

### Phase 2 — Core missing components

| Component | Notes |
|---|---|
| ~~Alert / Banner~~ | ✅ Done |
| ~~Avatar / AvatarGroup~~ | ✅ Done |
| ~~Tabs / TabPanels~~ | ✅ Done |
| ~~Progress (bar + circle)~~ | ✅ Done |
| ~~Breadcrumb~~ | ✅ Done |
| ~~Pagination~~ | ✅ Done |
| ~~Steps / Stepper~~ | ✅ Done |
| ~~Form primitives (Textarea, Checkbox, Radio, Switch, Select)~~ | ✅ Done — all native, FormField-integrated, with CheckboxGroup + RadioGroup. No validation logic (consumer's responsibility). |

### Phase 3 — Richer components and form depth

| Component | Notes |
|---|---|
| ~~Tooltip~~ | ✅ Done |
| ~~Dropdown Menu~~ | ✅ Done — full keyboard nav, typeahead, ARIA semantics, floating positioning, and one submenu level. Deeper nesting is intentionally unsupported. |
| ~~Table~~ | ✅ Done — TanStack-powered table shipped with sorting, filtering, pagination, selection, resizing, pinning, expansion, mobile card layout, and Storybook coverage. |
| ~~Stats / Metric Card~~ | ✅ Done |
| ~~Empty State~~ | ✅ Done |
| ~~Code Block~~ | ✅ Done — Shiki-powered, dark mode via `.dark` class |
| ~~Timeline~~ | ✅ Done |
| ~~Popover~~ | ✅ Done |
| ~~Quote~~ | ✅ Done |

### Phase 4 — Polish and power features

| Item | Status | Notes |
|---|---|---|
| **Bug fixes — Session 1** | ✅ Done | Input missing attrs, Dialog ARIA/ID/tabindex/aria-modal, Accordion ARIA + CSS, Button `<a>` keyboard, Scrim invalid aria-disabled |
| **ReadMore i18n labels** | ✅ Done | `expandLabel`/`collapseLabel` props added |
| **Dialog — title slot + `aria-labelledby` + `aria-modal`** | ✅ Done | |
| **Accordion — ARIA cleanup** | ✅ Done | Migrated to explicit `<button aria-expanded aria-controls>` disclosure pattern with animated reveal |
| ~~CSS custom property theming~~ | ✅ Done | `--oui-radius-*`, `--oui-shadow-*`, `--oui-transition-duration` in `tailwind.css` |
| ~~`AccordionGroup` exclusive mode~~ | ✅ Done | Variant inheritance via provide/inject; non-exclusive mode; GroupContained + GroupNonExclusive stories |
| ~~Card slot-based sub-components~~ | ✅ Done | Added SelectableToggle + CardGrid stories |
| ~~Dialog — `size` prop + `ConfirmDialog`~~ | ✅ Done | Added ConfirmPattern story, fixed close button layout |
| ~~Sidebar nav sub-components~~ | ✅ Done | `SidebarNav`, `SidebarNavItem`, `SidebarNavGroup` — with icon, active, badge, disabled, collapsible group support |
| ~~Toast action buttons~~ | ✅ Done | `action`, `onClose`, `icon` in useToast; full stories present |
| ~~Badge — dot, removable, outline~~ | ✅ Done | dot, removable, outline, truncate, AllVariations story |
| ~~`prefers-reduced-motion` audit~~ | ✅ Done | CSS `@media` block in `core.scss` for Vue slide/toast/fade transitions; `motion-reduce:animate-none` on Loader, Button spinner, Image skeleton, Placeholder; `motion-reduce:transition-none` on Image LQIP, Progress bar, DropdownMenuContent, FloatingPanel; computed style for Progress circle SVG |
| ~~Form components accessibility audit~~ | ✅ Done | Checkbox: `aria-checked="mixed"` for indeterminate (native `indeterminate` DOM prop is not exposed to AT); CheckboxGroup: converted `role="group"` div → `<fieldset>/<legend>` with `label` prop (matching RadioGroup); Radio: `formField?.inputId` was injected but ignored — now used as `effectiveId`; FormField: removed conflicting `aria-live="polite"` from `role="alert"` error paragraph, added `aria-live="polite"` to hint paragraph; Textarea: character count div now has an ID and is merged into `aria-describedby` so AT users hear the limit on focus. Switch: track changed from `<label>` to `aria-hidden div` with programmatic click forwarding to eliminate `label-title-only` axe violation. |

---

## 13. Patterns & Compositions

Patterns are distinct from components. A **component** is a reusable primitive with encapsulated state and behaviour. A **pattern** is a composition of components that solves a specific, recurring product need.

### When a pattern should be a Storybook story vs a component

| Deliver as a story when… | Deliver as a component when… |
|---|---|
| The value is showing how components combine | There is non-trivial state to manage (responsive toggle, keyboard listener, open/close coordination) |
| Consumers will heavily customise the layout | Consumers would mostly use it as-is |
| It is primarily a CSS/layout concern | It requires complex accessibility beyond its parts (landmark roles, `provide/inject` context, focus management) |
| It would be a thin wrapper with no logic | It is used across projects frequently enough that repeating the boilerplate is costly |

The default bias should be **story first**. Promote to a component only when multiple projects are copy-pasting the pattern and it clearly has shared logic worth encapsulating.

### Components that warrant being actual components

Three patterns are complex enough that they should be built as library components:

#### Navbar (Top Navigation Bar)

Every app needs a top navigation bar, but the responsive behaviour (desktop horizontal links → mobile hamburger menu) is non-trivial to implement correctly, repeatedly. Worth encapsulating.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `sticky` | `boolean` | Fixes bar to top of viewport (`position: sticky`) |
| `bordered` | `boolean` | Adds a bottom border (alternative to shadow) |
| `mobileBreakpoint` | `'sm' \| 'md' \| 'lg'` | Below which the nav collapses to hamburger (default: `'md'`) |

**Slots:**

| Slot | Purpose |
|---|---|
| `#logo` | Brand logo / wordmark (left side) |
| `#links` | Desktop navigation links (`<a>` or router-link items) |
| `#actions` | Right side: search button, notifications, user avatar menu |
| `#mobile-menu` | Content shown in the mobile drawer (typically mirrors `#links`) |

**State:** `mobileOpen` is managed internally. Expose `open()`, `close()`, `toggle()` via `defineExpose` for programmatic control (e.g. close on route change).

**ARIA:** `<header role="banner">` wraps the bar. The hamburger button is `aria-expanded`/`aria-controls` linked to the mobile menu container. The mobile menu uses `aria-label="Mobile navigation"`.

**UX detail:** The mobile menu should slide in from the top or use a Sidebar on mobile, with a Scrim underneath. On desktop, the `#mobile-menu` slot and hamburger are hidden.

**Stories:** Default (desktop), mobile viewport (hamburger visible), with user avatar + dropdown, with notification badge on icon, sticky behaviour (scroll play function), programmatic open/close.

**Responsive follow-up:** The current `NavigationBar` hides inline nav links below the configured breakpoint, but does not provide its own fallback menu unless consumers wire one externally. Add a first-class small-screen path such as a `#mobile-menu` slot, controlled open state, and documented behaviour for when teams should move dense navigation into subnav, Sidebar, or AppShell patterns. Include mobile viewport stories and play functions that assert nav items remain reachable.

---

#### AppShell (Application Layout Wrapper)

**Status:** Implemented. Treat the details below as the original design intent and follow-up reference rather than an open missing component.

A pre-wired layout that composes a `Navbar` + `Sidebar` + main content area + optional footer. Its value is the CSS grid/flex layout, the landmark roles, and the `provide/inject` context that coordinates sidebar open state between the Navbar's hamburger and the Sidebar component.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `hasSidebar` | `boolean` | Whether a sidebar is included (default: `true`) |
| `sidebarPosition` | `'left' \| 'right'` | Default: `'left'` |
| `fixedHeader` | `boolean` | Whether the Navbar stays fixed at top |

**Slots:**

| Slot | Purpose |
|---|---|
| `#header` | Receives the `Navbar` component |
| `#sidebar` | Receives the `Sidebar` + `SidebarNav` components |
| `#default` | Main page content |
| `#footer` | Optional site footer |

**State/context:** Provides `{ sidebarOpen, toggleSidebar }` via `provide` so that a hamburger button inside `#header` can control the `#sidebar` slot without prop-drilling. The Sidebar component should `inject` this context.

**ARIA:** `<body>` analogue is `<div class="app-shell">`. Semantic landmarks: `<header>` for the nav, `<aside>` for the sidebar, `<main>` for content, `<footer>` for the footer slot.

**Stories:** With sidebar (desktop + mobile viewport), without sidebar (full-width content), right sidebar, fixed header with scroll content.

---

#### CommandPalette (Cmd+K Search)

**Status:** Implemented. Treat the details below as the original design intent and follow-up reference rather than an open missing component.

The most complex pattern on this list — warrants a component because of: global keyboard shortcut listener, modal focus trap, fuzzy search state, keyboard navigation within results, and the accessibility requirements for a `combobox`-like interface.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `placeholder` | `string` | Search input placeholder |
| `shortcut` | `string[]` | Key combination to open (default: `['Meta+k', 'Ctrl+k']`) |
| `items` | `CommandItem[]` | Static items. For async search, use the `search` emit instead. |
| `groups` | `CommandGroup[]` | Grouped item structure |
| `loading` | `boolean` | Shows a spinner while async results load |
| `empty` | `string` | Message shown when no results match |

**`CommandItem` type:** `{ id, label, description?, icon?, shortcut?, action: () => void, keywords?: string[] }`

**`CommandGroup` type:** `{ label: string, items: CommandItem[] }`

**Emits:** `open`, `close`, `search` (debounced input value — consumer fetches and updates `items`), `select` (selected item)

**Keyboard:** `↑`/`↓` navigate items; `Enter` executes selected item's `action`; `Escape` closes; `Tab` wraps within results.

**ARIA:** `role="dialog"` on the palette container, `aria-modal="true"`, `role="combobox"` on the search input, `aria-expanded`, `role="listbox"` on results, `role="option"` + `aria-selected` on each result.

**Stories:** Static items, grouped items, async search (debounced, play function types and waits), with keyboard shortcut trigger, no results state, loading state.

---

### Storybook story patterns (no new component)

These are delivered as `Patterns/` stories in Storybook. They demonstrate how OUI components combine in realistic product scenarios. Each story is a full-page composition with a `play()` function that tests the primary user flow.

The `Patterns/` category sits alongside `Components/` and `Composables/` in Storybook's sidebar:

```
Patterns/
  Auth/
  Navigation/
  Forms/
  Page Layouts/
  Data Display/
  Feedback/
  Marketing/
```

---

#### Auth patterns

These are story-only. The components are already in the library (Input, Button, Checkbox, Link, Card); the pattern is their assembly.

| Story | Key components | Play function |
|---|---|---|
| `Sign In` | Card, Heading, Input (email), Input (password), Checkbox (remember me), Button, Link | Type email + password, submit, assert button clicked |
| `Register` | Same + confirm password Input, terms Checkbox | Fill all fields, submit |
| `Forgot Password` | Card, Heading, Input (email), Button, Alert (success) | Submit email, assert success alert appears |
| `Magic Link Sent` | Card, Heading, descriptive text, Button (resend) | Assert resend button is focusable |
| `Two-Factor (OTP)` | Card, Heading, 6 × Input fields (or `OtpInput` component if built) | Type 6 digits, assert auto-focus advances |
| `Password Reset` | Card, Input (new password), Input (confirm), Button | Fill and submit |

**Note on OtpInput:** If the Two-Factor pattern gets frequent reuse, an `OtpInput` component (auto-focus advancing, paste-to-fill, backspace-to-previous) is worth building. Deliver as a story first.

---

#### Navigation patterns

| Story | Key components | Play function |
|---|---|---|
| `Application Header` | Navbar (component above), Icon buttons, Avatar | Click hamburger, assert mobile menu opens |
| `Sidebar Navigation` | AppShell + Sidebar + SidebarNav + SidebarNavItem | Click active item, assert `aria-current="page"` |
| `Tabbed Page Navigation` | Tabs | Keyboard navigate tabs, assert panel switches |
| `Breadcrumb in Page Header` | Breadcrumb, Heading, Button (actions) | Click breadcrumb link, assert navigation |
| `Bottom Tab Bar (mobile)` | Tabs (vertical=false, pill variant) | 375px viewport, click tabs |
| `Mega Menu` | Navbar + FloatingPanel for mega panel | Hover/click nav item, assert panel opens |

---

#### Form patterns

| Story | Key components | Play function |
|---|---|---|
| `Contact Form` | Heading, Input (name/email), Textarea, Button, Alert (success) | Fill and submit, assert success |
| `Profile Settings` | Tabs (General/Security/Notifications), Input, Switch, Button | Switch tabs, update field, save |
| `Payment / Checkout` | Heading, Input (card number/expiry/CVV), Select (country), Button | Fill card details, submit |
| `Search with Filters` | Input (search), Badge (active filters, removable), Select (sort), Button | Type query, apply filter, assert badge appears, click remove |
| `Multi-Step Wizard` | Stepper, varied form content per step, Button (next/back) | Step through all steps, assert stepper advances |
| `Inline Validation` | Input with `state="invalid"` + `errorMessage`, Button | Submit empty form, assert error messages appear |

---

#### Page layout patterns

These patterns double as visual regression anchors — if they break, something significant changed in the component layer.

| Story | Key components | Notes |
|---|---|---|
| `Dashboard` | AppShell, Navbar, Stats cards, DataTable, Alert | Realistic data, 1280px viewport |
| `Settings Page` | AppShell, Sidebar nav, Tabs, Input, Switch, Button | Two-level navigation |
| `Data List Page` | Navbar, Pagination, DataTable, EmptyState, Filter badges | Test pagination play function |
| `Detail / Profile Page` | AppShell, Tabs, Avatar, Badge, Card, Timeline | Content-heavy, test tab switching |
| `Two-Column Content` | Basic CSS grid, Card, ReadMore | No new components needed |
| `Empty / Onboarding State` | AppShell, EmptyState, Button | First-run experience |

---

#### Feedback & error patterns

| Story | Key components | Notes |
|---|---|---|
| `404 Not Found` | Heading, descriptive text, Button (go home) | Standalone page, no AppShell |
| `500 Server Error` | Heading, descriptive text, Button (retry/reload) | Same |
| `Permission Denied` | Heading, descriptive text, Button | Same |
| `Success Confirmation` | Card, Icon (large check), Heading, text, Button | Post-form submission success |
| `Loading / Skeleton Page` | AppShell, Placeholder (paragraph, avatar, table) | Tests skeleton composition |

---

#### Marketing / editorial patterns

These are lower priority but useful for teams using OUI for public-facing sites as well as apps.

| Story | Key components | Notes |
|---|---|---|
| `Pricing Table` | Card, Badge, Heading, Button, Divider | 3-column at desktop, stacked at mobile |
| `Feature Grid` | Card (icon + title + text), Heading | 3-up or 4-up grid |
| `Hero CTA` | Heading, text, Button (primary + secondary), Badge | Centred layout |
| `Testimonials` | Card, Avatar, Quote text, Star rating | Carousel optional |
| `Stats / Metrics Bar` | Stats component (or Card), Divider | Horizontal at desktop |

---

### Design system from Storybook

The user's goal of using Claude Code to build a design system from Storybook stories maps directly to two features:

1. **Storybook Pages stories** — the `Patterns/` stories above are full-page compositions. They can be exported to static HTML via `build-storybook` and published as a visual design reference alongside the component docs. Each pattern story includes the exact code needed to reproduce it, making them a natural source of truth for a design system.

2. **Living design system** — the `Getting Started/Design System/` Storybook section (planned in §4) documents tokens, colour scales, and type scales. Combined with the `Patterns/` stories, this gives any team (or AI assistant) everything needed to reproduce OUI-compliant UIs without guessing component combinations.

**Suggested workflow when using Claude Code to extend patterns:**
- Each `Patterns/` story file is self-contained (no external dependencies beyond OUI and Vue)
- A new pattern can be requested with: "using these OUI components, create a Storybook story that matches the attached screenshot" — Claude Code reads the component API from the story files and existing component sources, then generates a new pattern story
- The pattern story gets added to `src/stories/patterns/<category>/<PatternName>.stories.ts`
- It passes `npm run test-storybook` before it is considered done (Axe + play functions)

---

## Future: Remove Tailwind — Replace with Scoped CSS

> **Status:** Not planned for any current phase. Recorded here for future consideration only.

The `--oui-*` design token layer (introduced in §4) was deliberately designed as the stable CSS API, making this migration theoretically straightforward when the time comes.

### How scoped CSS in Vue works

Vue `<style scoped>` CSS is compiled into the component's JS bundle. When a consumer imports a component — `import { Button } from 'ocelot-ui'` — the scoped styles are injected into the page as `<style>` tags by the bundler at runtime. **No separate CSS file needed for component-level styles.** This is the same behaviour as today's `dist/style.css`, but scoped per-component instead of global.

Two things would still require a single global CSS file (`tailwind.css` or its successor):
- **Design tokens** — `:root { --oui-* }` is inherently global
- **Vue transition classes** — `.v-enter-active` etc. must be global because Vue applies them to the DOM at runtime, not at component render time

So the consumer import would remain:
```css
@import "ocelot-ui/oui.css"; /* tokens + transitions only — no Tailwind */
```

### What the migration would look like

1. **Replace utility classes with scoped CSS** — each component's `<style scoped>` block replaces Tailwind classes with CSS that references the `--oui-*` tokens directly:
   ```css
   /* Button.vue <style scoped> */
   .btn {
       border-radius: var(--oui-radius-lg);
       transition: background-color var(--oui-transition-duration) ease;
   }
   ```
2. **Remove `@tailwindcss/vite` from the build** — Tailwind is no longer a peer dependency
3. **Remove `@theme inline` from `tailwind.css`** — the Tailwind bridge is gone; `tailwind.css` becomes a plain CSS file with just tokens and transitions
4. **Responsive utilities** — see below

### Responsive breakpoints

Tailwind provides responsive utilities (`sm:`, `md:`, `lg:` prefixes) used throughout components. Replacing these requires a globally available breakpoint system. Options at migration time:

- **CSS `@container` queries** — modern, no global config needed; components respond to their container size rather than the viewport. Preferred for a library.
- **CSS custom media queries** — define once in `tailwind.css` and use in scoped styles: `@media (--oui-screen-md) { ... }`
- **Hardcoded `@media` breakpoints** — simplest; match Tailwind's default scale (`640px`, `768px`, `1024px`, `1280px`, `1536px`) to avoid visible changes

The breakpoints would need to match whatever the consumer's project uses, or be documented as fixed values that consumers cannot override (which is acceptable for a component library).

---

### Patterns roadmap placement

Pattern stories are not gated on Phase 1 or 2 completing — they can begin as soon as the core components they depend on exist. A suggested ordering:

| Phase | Patterns to add |
|---|---|
| After Phase 2 | Auth patterns (Sign In, Register, Forgot Password), Contact Form, 404/500 pages |
| After Phase 3 | Dashboard, Settings Page, Data List, Navbar + AppShell components |
| After Phase 4 | Full pattern suite, CommandPalette, Marketing patterns |

Add `Patterns/` as a Phase 5 milestone (or treat each batch as a sub-task of the relevant phase).

---

*Document generated April 2026. Last updated Session 3.*

---

## 15. Component Audit — Session 3 Findings

> Full audit of the then-current 63 components against TypeScript coverage, accessibility (WCAG 2.1 AA), UX laws, and known bugs. Items to be addressed individually.

---

### TypeScript & Build Errors

| Location | Error | Fix |
|---|---|---|
| `.build/index.ts:36` | `HelloWorld.vue` exported but file does not exist | Remove `HelloWorld` export entirely (it is a demo component, not a library component) |
| `FloatingPanel.vue:252,264` | `window.setTimeout()` returns `number` but refs typed as `Timeout` | Change ref types to `number \| null` or use `ReturnType<typeof window.setTimeout>` |
| `FloatingPanel.vue:373,374,377,378` | `middlewareData.arrow` typed as `{}` — no `x`/`y` properties | Cast `middlewareData.arrow` to `{ x?: number; y?: number }` |
| `Input.vue:138` | `emit(eventType, value)` where `eventType` is `'input' \| 'change'` — TypeScript cannot narrow the union | Use explicit `if/else` branches for each emit call |
| `Video.vue:145` | `title` does not exist in Plyr `Options` type | Cast options object or use `as unknown as Options` with a comment |
| `Input.stories.ts:101` | `minLength` (camelCase) does not exist; correct prop is `minlength` | Rename to `minlength` |
| `QRCode.stories.ts:43` | Storybook control shape `{ required: true }` is invalid | Use `control: { type: 'text' }` or `control: 'text'` |
| `QRCode.stories.ts:80,82` | `.alt` does not exist on `HTMLElement` — should be `HTMLImageElement` | Cast to `HTMLImageElement` |
| `Sidebar.stories.ts:59` | `sidebar.value` possibly `null` | Add null guard |
| `Timeline.stories.ts:7` | Story data has `color: string` but `TimelineColor` is a union | Type the story data array as `TimelineItem[]` |
| `tsconfig.json:13` | `baseUrl` deprecated in TypeScript 7 | Add `"ignoreDeprecations": "6.0"` to `compilerOptions` |
| `vitest.config.ts:20` | `extends: true` not in `UserProjectConfigExport` type | Vitest version mismatch — verify Vitest version and update config shape accordingly |

---

### Missing / Incorrect Library Exports

| Issue | Fix |
|---|---|
| ~~`SidebarNavGroup` not exported from `.build/index.ts`~~ | Done — export added to `.build/index.ts` |
| ~~`SidebarNavItem` not exported from `.build/index.ts`~~ | Done — export added to `.build/index.ts` |
| ~~`HelloWorld` exported from `.build/index.ts`~~ | Done — export removed from `.build/index.ts` |
| ~~No `components.d.ts` generated~~ | Done — `vite-plugin-dts` added and configured in `vite.config.ts` with `insertTypesEntry: true` |

---

### Tooling Gaps

| Item | Detail |
|---|---|
| ~~No bundle analyser~~ | Done — `rollup-plugin-visualizer` is installed and `npm run build:analyse` is available. |
| **Low coverage: `optionalDependency.ts`** | `src/utilities/optionalDependency.ts` is currently at 12.5% coverage. Add focused unit tests for successful optional import, missing dependency handling, cached resolution, warning/error paths, and any SSR-safe branches until this file reaches 100% coverage. |
| ~~No `check-types` npm script~~ | Done — `package.json` now includes `"check-types": "vue-tsc --noEmit"` and the command is documented in `CLAUDE.md`. |

---

### Cross-Cutting Issues

#### `prefers-reduced-motion` — Not implemented anywhere

All animated components ignore user motion preferences. Add the following to `tailwind.css`:

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

**Affected components:** Toast (TransitionGroup slide), Sidebar (Transition slide), Dialog (Transition fade), FloatingPanel (Transition opacity), Progress (indeterminate bar animation, `transition-[width]`), Stepper (`transition-colors`), Loader (`animate-spin`, `animate-bounce` etc.).

#### RTL Support — Improved, Not Certified

Most components correctly use logical CSS properties (`ps-`, `pe-`, `ms-`, `me-`, `text-start`). The physical-positioning leftovers from the Session 3 audit have been cleaned up:

| Component | Prior issue | Status |
|---|---|---|
| `Toast.vue` | `right-4` / `left-4` placement positioning | ✅ Uses logical start/end placement |
| `Sidebar.vue` | `left-0` / `right-0` side positioning | ✅ Uses logical start/end positioning |
| `Card.vue` | `top-2 right-2` selected tick indicator | ✅ Uses logical end positioning |
| `FloatingPanel.vue` | `left: ${x}px` inline style | ✅ Uses inline logical positioning |
| `DropdownMenuContent.vue` / `DropdownMenuSubmenu.vue` | Floating content positioning | ✅ Uses inline logical positioning |

Remaining gap: OUI still needs a dedicated RTL Storybook/visual pass before claiming official RTL support.

---

### Component-by-Component Findings

#### Button
| Type | Issue |
|---|---|
| **Bug** | ✅ Fixed — native buttons now set `type="button"` by default to avoid accidental form submission |
| **A11y** | ✅ Fixed — native anchors no longer receive redundant `role="link"` |

#### Accordion
| Type | Issue |
|---|---|
| **A11y** | ✅ Fixed — migrated from `<details>/<summary>` to `<button aria-expanded aria-controls>` |
| **UX** | ✅ Fixed — content reveal is animated |
| **UX** | ✅ Fixed — `expandIcon` exposes open state |
| **UX** | ✅ Fixed — title slot supports richer title content |

#### AccordionGroup
| Type | Issue |
|---|---|
| **UX** | `exclusive: true` by default — non-exclusive (multiple open) is likely the more expected default |

#### Input
| Type | Issue |
|---|---|
| **A11y/Bug** | No `aria-invalid` binding — an invalid field state is not communicated to assistive technology |
| **A11y/Bug** | No `aria-describedby` wiring — error messages or helper text cannot be programmatically linked to the input |
| **UX** | No error state prop or styling — consumers must implement their own error presentation |
| **UX** | No helper/hint text prop |
| **UX** | `type` prop is plain `string` — should be a union of valid HTML input types |
| **UX** | `autocomplete` is a `boolean` (`on`/`off`) — HTML `autocomplete` accepts specific token strings (e.g., `"email"`, `"current-password"`, `"given-name"`). This is too restrictive. |
| **UX** | No character count display when `maxlength` is set |

#### Dialog
| Type | Issue |
|---|---|
| **A11y** | The sr-only close button at the bottom of the dialog body is redundant with the visible close button in the header — may cause screen readers to announce two "Close dialog" buttons in sequence |
| **A11y** | No `aria-describedby` — dialogs with description text cannot programmatically link it to the dialog element |

#### FloatingPanel
| Type | Issue |
|---|---|
| **A11y** | No `aria-label` or `aria-labelledby` for non-tooltip/menu role panels — floating content without a label is opaque to AT |

#### Toast
| Type | Issue |
|---|---|
| **UX** | "Show all" / "Show less" strings are hardcoded English with no i18n props (inconsistent — `ReadMore` has `expandLabel`/`collapseLabel`) |

#### Tabs / Tab
| Type | Issue |
|---|---|
| **A11y** | `TabList` missing `aria-orientation="horizontal"` — screen readers may not announce correct arrow key navigation |
| **A11y/UX** | Keyboard Arrow navigation does not skip disabled `Tab` items — focus lands on a disabled tab that cannot be activated |

#### SidebarNavItem
| Type | Issue |
|---|---|
| **Bug/A11y** | When both `href` and `disabled` are set, `aria-disabled` alone does not prevent keyboard activation via Enter on a real `<a>` element — the `href` attribute must be removed when disabled |

#### Badge
| Type | Issue |
|---|---|
| **A11y** | `role="note"` on the label badge is unconventional — consider `role="status"` or no role |
| **A11y** | Dot badge with no `ariaLabel` prop is invisible to screen readers — `ariaLabel` should be documented as required when `dot` is `true` |

#### Card
| Type | Issue |
|---|---|
| **A11y** | Clickable card renders `<button>` but contains `<h2>` inside — headings inside buttons is invalid HTML and causes AT issues |
| **A11y** | `selected` state has no `aria-pressed` or `aria-selected` — interactive selection state not communicated to AT |

#### Avatar
| Type | Issue |
|---|---|
| **A11y** | When `href` is set (link avatar), `ariaLabel` is optional — an unlabelled link is a WCAG failure. Prop should be documented as required when `href` is provided. |

#### Banner
| Type | Issue |
|---|---|
| **A11y** | Uses `<h4>` for the title — creates a heading in the document outline regardless of context, which may disrupt heading hierarchy. Consider `<p>` with `font-semibold` or let consumers control heading level via slot. |
| **A11y** | `role="alert"` applied to non-dismissible error/warning banners — `role="alert"` only announces dynamically injected content; banners present on initial page load will not be read by this role |

#### Stepper
| Type | Issue |
|---|---|
| **A11y** | `<ol>` has no `aria-label` — screen readers have no context that this is a progress stepper |
| **UX** | No overall progress announcement (e.g., "Step 2 of 5") accessible to AT |

#### Progress
| Type | Issue |
|---|---|
| **A11y** | Indeterminate bar uses `[animation:oui-indeterminate_...]` Tailwind arbitrary value — the `@keyframes oui-indeterminate` is defined in `core.scss` (confirmed), but no `prefers-reduced-motion` fallback pauses it |

#### StatCard
| Type | Issue |
|---|---|
| **A11y** | `aria-label="Trend"` is not descriptive — should include the value, e.g., "Trend: up 12%" |
| **A11y** | Positive/negative trend relies on colour alone (green/red) — icon helps but is `aria-hidden` |

#### Timeline
| Type | Issue |
|---|---|
| **A11y** | `<ol>` has no `aria-label` identifying it as a timeline |

#### EmptyState
| Type | Issue |
|---|---|
| **A11y** | `<h3>` hardcoded for the title — disrupts heading hierarchy if the empty state appears at a level where h3 is inappropriate |

#### Loader
| Type | Issue |
|---|---|
| **A11y** | No `aria-live` region or `role="status"` on the container — screen readers receive no feedback that a loading state is in progress |
| **A11y** | Animated icon has no `aria-label` |

