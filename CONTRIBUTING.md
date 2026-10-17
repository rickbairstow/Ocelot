# Contributing

Thanks for your interest in contributing 👍

## Getting Started

- Fork the repository
- Clone your fork locally
- Select the contributor Node.js version from `.nvmrc` (currently 26.12.0)
- Install dependencies with `npm ci`
- Create a new branch

Use `nvm install` and `nvm use`, or `nvm install 26.12.0` and `nvm use 26.12.0` with nvm-windows. This version is for working on OUI; consumers use the Node.js version supported by their own build tools.

Start the component documentation with `npm run storybook`.

## Before You Start

- All work should originate from an **Issue**
- Issues must be **discussed and approved before work begins**
- If one doesn’t exist, create it first

## Making Changes

- Keep changes focused and minimal
- Follow existing code style and structure
- Update documentation where relevant

## Testing (Required)

- All changes must be fully tested in **Storybook**
- A Storybook story must be **created or updated for every component**
- Ensure all states and variants are covered where applicable

Before submitting a PR, run:

```bash
npm run lint
npm run check-types
npm run test:run
```

`npm test` runs Vitest in watch mode; `npm run test:run` runs unit and Storybook interaction/accessibility tests once, without a separate Storybook server. PR checks run lint, type checking, tests, and a Storybook build with documentation navigation checks.

For library/export changes, also run `npm run build` to verify the package and generated TypeScript declarations. For documentation navigation changes, build Storybook, serve it on port 6006, and run `npm run test:docs` as described in the README.

## Story interactions

Story interaction tests run only in Vitest (`MODE=test`). Component stories use `runInteractionTests` from `src/stories/interactionMode.ts` to keep normal Storybook browsing at the initial state. Keep mutating play functions behind that guard so consumers can try forms, pagination and loading themselves. Test the complete behaviour in Vitest, and make the initial canvas meaningful without running its play function.

## Releases

Use the manual `Release Package` GitHub Actions workflow on `main`. Choose `patch`, `minor`, or `major`; the workflow prepares a version-bump PR, and merging it publishes through npm Trusted Publishing. Do not bump versions or publish locally for normal releases. See the README for repository credentials and environment setup.

## Commits

- Use clear, descriptive commit messages
- Keep commits small and logical

## Pull Requests (Required)

All contributions **must be submitted via a Pull Request**

Each PR must include:
- A clear description of the changes
- A reference to the related Issue
- Evidence of the change (e.g. screenshots, logs, Storybook examples)

PRs without proper description or evidence may be rejected

## Review

- All PRs are reviewed before merge
- Address feedback where given

## Ground Rules

- Be respectful
- No breaking changes without prior discussion
- Follow the process
