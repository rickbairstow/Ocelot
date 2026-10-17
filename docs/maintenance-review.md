# Maintenance review — 17 October 2026

## Testing and documentation

Storybook uses Vitest and Playwright for story interaction tests. The accessibility addon runs with `a11y.test: 'error'`; an intentionally unlabelled input was verified to fail before removing the temporary test. Story-level accessibility exceptions remain in effect.

The duplicate Jest-based Storybook runner and axe-playwright dependency have been removed. `test-storybook` remains available as an alias for the Storybook Vitest project. CI also builds Storybook and runs the Getting Started navigation regression checks against that build.

Vue prop documentation uses the supported `vue-component-meta` parser instead of the deprecated `vue-docgen-api` parser.

## Dependency audit

Direct dependencies have been updated to the latest registry releases, including Vitest 5.0.5, TanStack Table 9.3.1, Playwright 1.64.1, Vite 8.3.4 and Tabler 3.49.0. The production dependency audit reports zero vulnerabilities.

TypeScript is the sole compatibility exception: 6.0.3 is retained because the latest typescript-eslint 8.71.2 declares a TypeScript peer range below 6.1, and the Vue/type-declaration tooling uses the legacy compiler API. TypeScript 7.0.2 exposes a different native compiler API. Do not force an incompatible compiler into this toolchain; revisit when the dependent tooling supports it. `npm outdated` reports only TypeScript after this upgrade.

Table now requires the v9 peer dependency. Its adapter registers sorting, filtering, pagination, selection, sizing, resizing and visibility features explicitly, with Vue-controlled state and scoped cleanup. Existing consumers using TanStack v8 must migrate their peer dependency and typed column-helper calls. See the [official Vue migration guide](https://tanstack.com/table/latest/docs/framework/vue/guide/migrating).

The full audit reports ten high-severity development findings, all tracing to the same [braces stack-exhaustion advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) through Stylelint and its glob/config dependencies. No patched braces version is available at the time of this review. Do not downgrade Stylelint to an obsolete major merely to silence the audit; revisit when the upstream dependency is fixed. These tools process repository patterns during development and are not library runtime dependencies. GitHub Dependabot alert closure is not verified until the updated lockfile is scanned on GitHub.

## Icon bundle

Making every Tabler icon available by name adds a substantial cost: the original registry change increased the measured ES bundle from about 452 kB (116 kB gzip) to 3,397 kB (619 kB gzip). After updating Tabler to 3.49.0 and the build dependencies, the current ES entry measures 3,434 kB (626 kB gzip). These are entry-bundle sizes, excluding separately emitted syntax-highlighting chunks, rather than a measurement of a consuming application's final bundle.

Keep the full catalogue as the default, as requested. A future optional lightweight entry could use the same components with an initially empty registry and explicit `registerIcons()` calls. It would need separate entry-point declarations, export/build coverage for ES and UMD consumers, and Tailwind scanning checks. That additional public API is deferred; this change does not introduce it.
