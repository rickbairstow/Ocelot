/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-a11y',
        '@storybook/addon-themes'
    ],
    framework: {
        name: '@storybook/vue3-vite',
        options: {}
    }
}

export default config
