# Changesets

Use Changesets for release notes and package version bumps.

For package changes, run:

```bash
npm run changeset
```

Choose `patch`, `minor`, or `major`, then write a short release note. The generated filename should be left as the random words Changesets creates.

When ready to release, run:

```bash
npm run release:prepare
```

That consumes pending changesets, updates `package.json`, `package-lock.json`, and `CHANGELOG.md`, then removes the used changeset files. Commit those changes and merge/push to `main`; the release workflow publishes the prepared version.

Changeset files must reference the exact package name from `package.json`: `ocelot-ui`.
