# Ocelot UI

**Ocelot UI (OUI)**, a UI framework built with Vue 3 and Tailwind CSS, is designed to be highly performant, optimized, and accessible. It strikes a balance by providing essential features without being overly opinionated, allowing for flexibility in your projects.

Head to [OcelotUI on Netlify](https://ocelotui.netlify.app) for the Storybook site - this auto-publishes on every PR merge.

![OcelotUi-anim](https://github.com/user-attachments/assets/0d26c2ef-305c-4d5c-b7c2-e784f8d4484e)


### Netlify Integration

OcelotUi's Storybook has been integrated into Netlify, you can access it at https://ocelotui.netlify.app. PRs will automatically be pushed to Netlify when they are merged to the main branch.

### Publishing to npm

Publishing is handled automatically via GitHub Actions whenever a new version tag is pushed.

To publish a new version:

1. Ensure you are on `main` and up to date
2. Run `npm run publish:npm`
3. Select a bump type when prompted: `patch`, `minor`, or `major`
4. The script will bump the version in `package.json`, commit, tag, and push
5. GitHub Actions will detect the new tag and publish to npm automatically
