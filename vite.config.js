import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@Css': fileURLToPath(new URL('./src/css', import.meta.url)),
            '@Components': fileURLToPath(
                new URL('./src/components', import.meta.url)
            )
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
    }
})
