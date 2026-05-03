import { defineConfig, mergeConfig, defineProject } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import path from 'path'
import { fileURLToPath } from 'node:url'

import { createViteConfig } from './vite.config'

const dirname =
    typeof __dirname !== 'undefined'
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url))

export default mergeConfig(
    createViteConfig('test'),
    defineConfig({
        test: {
            projects: [
                defineProject({
                    extends: true,
                    test: {
                        environment: 'node',
                        include: ['src/**/*.test.ts'],
                        name: 'unit'
                    }
                } as unknown as Parameters<typeof defineProject>[0]),
                defineProject({
                    extends: true,
                    plugins: [
                        storybookTest({
                            configDir: path.join(dirname, '.storybook')
                        })
                    ],
                    test: {
                        name: 'storybook',
                        browser: {
                            enabled: true,
                            headless: true,
                            provider: playwright(),
                            instances: [{ browser: 'chromium' }]
                        },
                        setupFiles: []
                    }
                } as unknown as Parameters<typeof defineProject>[0])
            ]
        }
    })
)
