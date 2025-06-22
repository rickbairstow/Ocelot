/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
const dirname =
    typeof __dirname !== 'undefined'
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
    plugins: [vue(), tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@Components': fileURLToPath(
                new URL('./src/components', import.meta.url)
            ),
            '@Composables': fileURLToPath(
                new URL('./src/composables', import.meta.url)
            ),
            '@Css': fileURLToPath(new URL('./src/css', import.meta.url)),
            '@Utils': fileURLToPath(new URL('./src/utilities', import.meta.url))
        }
    },

    // Library build mode to package distribution files.
    build: {
        lib: {
            entry: path.resolve(__dirname, '.build/index.js'),
            name: 'ocelot-ui',
            fileName: (format) => `ocelot-ui.${format}.js`
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },

    // Enable Vitest Storybook testing
    test: {
        projects: [
            {
                extends: true,
                plugins: [
                    // The plugin will run tests for the stories defined in your Storybook config
                    // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                    storybookTest({
                        configDir: path.join(dirname, '.storybook')
                    })
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: 'playwright',
                        instances: [
                            {
                                browser: 'chromium'
                            }
                        ]
                    },
                    setupFiles: ['.storybook/vitest.setup.js']
                }
            }
        ]
    }
})
