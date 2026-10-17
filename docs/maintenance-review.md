# Maintenance review — 17 October 2026

## Testing and documentation

Storybook uses Vitest and Playwright for story interaction tests. The accessibility addon runs with `a11y.test: 'error'`; an intentionally unlabelled input was verified to fail before removing the temporary test. Story-level accessibility exceptions remain in effect.

The duplicate Jest-based Storybook runner and axe-playwright dependency have been removed. `test-storybook` remains available as an alias for the Storybook Vitest project. CI also builds Storybook and runs the Getting Started navigation regression checks against that build.

Vue prop documentation uses the supported `vue-component-meta` parser instead of the deprecated `vue-docgen-api` parser.

## Dependency audit

Compatible dependency patches include Vue 3.5.44 and Vitest 4.1.12. The production dependency audit reports zero vulnerabilities.

The full audit reports ten high-severity development findings, all tracing to the same braces stack-exhaustion advisory through Stylelint and its glob/config dependencies. No patched braces version is available at the time of this review. Do not downgrade Stylelint to an obsolete major merely to silence the audit; revisit when the upstream dependency is fixed. These tools process repository patterns during development and are not library runtime dependencies.

## Icon bundle

Making every Tabler icon available by name adds a substantial cost: the measured ES bundle increased from about 452 kB (116 kB gzip) to 3,397 kB (619 kB gzip). These are whole-library build sizes, not a measurement of a consuming application's final bundle.

Keep the full catalogue as the default, as requested. A future optional lightweight entry could use the same components with an initially empty registry and explicit `registerIcons()` calls. It would need separate entry-point declarations, export/build coverage for ES and UMD consumers, and Tailwind scanning checks. That additional public API is deferred; this change does not introduce it.
