<template>
    <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 text-sm">
        <!-- Header bar -->
        <div class="flex items-center justify-between gap-4 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide select-none">{{ language }}</span>
            <button
                class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                type="button"
                @click="copy"
            >
                <Icon
                    aria-hidden="true"
                    size="xs"
                    :icon="copied ? 'Check' : 'Copy'"
                />
                {{ copied ? 'Copied' : 'Copy' }}
            </button>
        </div>

        <!-- Code -->
        <div class="relative overflow-x-auto">
            <!-- eslint-disable vue/no-v-html -->
            <!-- safe: Shiki HTML-escapes all user input before rendering -->
            <div
                v-if="highlighted"
                class="[&>pre]:p-4 [&>pre]:m-0 [&>pre]:bg-transparent! [&_code]:bg-transparent! [&_code]:text-sm [&_code]:leading-relaxed"
                v-html="highlighted"
            />
            <!-- eslint-enable vue/no-v-html -->
            <!-- Fallback while loading -->
            <pre
                v-else
                class="p-4 m-0 text-gray-800 dark:text-gray-200 leading-relaxed"
            ><code>{{ code }}</code></pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { createHighlighter } from 'shiki'
import type { Highlighter, BundledLanguage, BundledTheme } from 'shiki'
import Icon from './Icon.vue'

interface Props {
    code: string
    language?: BundledLanguage
    theme?: BundledTheme
    darkTheme?: BundledTheme
}

const props = withDefaults(defineProps<Props>(), {
    language: 'typescript',
    theme: 'github-light',
    darkTheme: 'github-dark'
})

let highlighter: Highlighter | null = null
const highlighted = ref<string | null>(null)
const copied = ref(false)

const getHighlighter = async (): Promise<Highlighter> => {
    if (!highlighter) {
        highlighter = await createHighlighter({
            langs: [props.language],
            themes: [props.theme, props.darkTheme]
        })
    } else {
        await highlighter.loadLanguage(props.language)
        await highlighter.loadTheme(props.theme)
        await highlighter.loadTheme(props.darkTheme)
    }
    return highlighter
}

const highlight = async (): Promise<void> => {
    const hl = await getHighlighter()
    highlighted.value = hl.codeToHtml(props.code, {
        lang: props.language,
        themes: {
            dark: props.darkTheme,
            light: props.theme
        }
    })
}

const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
}

onMounted(highlight)
watch(() => [props.code, props.language, props.theme, props.darkTheme], highlight)
</script>

<style>
/* Override Shiki's prefers-color-scheme media query to use Tailwind's .dark class instead */
.dark .shiki,
.dark .shiki span {
    background-color: var(--shiki-dark-bg) !important;
    color: var(--shiki-dark) !important;
}
</style>
