import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'

const dirname =
    typeof __dirname !== 'undefined'
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        dts({
            exclude: ['src/stories/**/*'],
            include: [
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
            fileName: (format) => `ocelot-ui.${format}.js`
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
                exports: 'named'
            }
        }
    }
})
