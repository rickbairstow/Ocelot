import remarkGfm from 'remark-gfm'

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    staticDirs: ['../.storybook/public'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-a11y',
        '@storybook/addon-themes',
        {
            name: '@storybook/addon-docs',
            options: {
                mdxPluginOptions: {
                    mdxCompileOptions: {
                        remarkPlugins: [remarkGfm]
                    }
                }
            }
        },
        '@storybook/addon-vitest'
    ],
    framework: {
        name: '@storybook/vue3-vite',
        options: { docgen: 'vue-component-meta' }
    },
    core: {
        disableTelemetry: true
    }
}

export default config
