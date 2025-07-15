/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-a11y',
        '@storybook/addon-themes',
        '@storybook/addon-docs',
        '@storybook/addon-vitest'
    ],
    framework: {
        name: '@storybook/vue3-vite',
        options: {}
    }
}

export default config
