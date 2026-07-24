# Changesets

Use Changesets for release notes and package version bumps. Most release work is automated once the release-prep commit reaches `main`.

For package-impacting changes, add a changeset in the same PR:

```bash
npm run changeset
```

Choose `patch`, `minor`, or `major`, then write a short release note. Leave the generated filename as the random words Changesets creates.

When ready to release, run:

```bash
npm run release:prepare
```

That consumes pending changesets, updates `package.json`, `package-lock.json`, and `CHANGELOG.md`, then removes the used changeset files. Commit those changes and merge/push to `main`; `release.yml` runs checks, publishes the prepared npm version through Trusted Publishing, and creates the matching GitHub Release.

Changeset files must reference the exact package name from `package.json`: `ocelot-ui`. CI validates this with `npm run changeset:check`.
