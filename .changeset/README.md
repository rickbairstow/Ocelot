# Changesets

Use Changesets for release notes and package version bumps. Most release work is automated once changesets reach `main`.

For package-impacting changes, add a changeset in the same PR:

```bash
npm run changeset
```

Choose `patch`, `minor`, or `major`, then write a short release note. Leave the generated filename as the random words Changesets creates.

When changesets reach `main`, `release.yml` opens or updates a `Version packages` PR. That PR runs:

```bash
npm run release:prepare
```

That consumes pending changesets, updates `package.json`, `package-lock.json`, and `CHANGELOG.md`, then removes the used changeset files.

When ready to release, review and merge the `Version packages` PR. The next `release.yml` run publishes the prepared npm version through Trusted Publishing and creates the matching GitHub Release.

Changeset files must reference the exact package name from `package.json`: `ocelot-ui`. CI validates this with `npm run changeset:check`.
