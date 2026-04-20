import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'

const dirname =
    typeof __dirname !== 'undefined'
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url))

export function createViteConfig(mode = ''): UserConfig {
    const isAnalyzeMode = mode === 'analyze'

    return {
        plugins: [
            vue(),
            tailwindcss(),
            dts({
                exclude: ['src/stories/**/*'],
                include: [
                    'env.d.ts',
                    '.build/index.ts',
                    'src/components',
                    'src/composables',
                    'src/utilities'
                ],
                insertTypesEntry: true,
                outDir: 'dist',
                tsconfigPath: './tsconfig.json'
            })
        ],
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
                entry: path.resolve(dirname, '.build/index.ts'),
                name: 'ocelot-ui',
                fileName: (format: string) => `ocelot-ui.${format}.js`
            },
            rollupOptions: {
                external: [
                    'vue',
                    'photoswipe',
                    'photoswipe/lightbox',
                    'photoswipe/style.css',
                    'plyr',
                    'plyr/dist/plyr.css',
                    'qrcode'
                ],
                output: {
                    globals: {
                        vue: 'Vue'
                    },
                    assetFileNames: 'style[extname]',
                    exports: 'named' as const,
                    plugins: isAnalyzeMode
                        ? [
                            visualizer({
                                brotliSize: true,
                                filename: 'dist/bundle-analysis.html',
                                gzipSize: true,
                                open: false,
                                template: 'treemap'
                            })
                        ]
                        : []
                }
            }
        }
    }
}

export default defineConfig(({ mode }) => createViteConfig(mode))
