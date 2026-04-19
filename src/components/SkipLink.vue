<template>
    <a
        class="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-blue-600 focus:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:bg-gray-900 dark:focus:text-blue-400"
        :href="`#${target}`"
    >
        {{ label }}
    </a>
</template>

<script setup lang="ts">
interface Props {
    target?: string
    label?: string
}

withDefaults(defineProps<Props>(), {
    target: 'main',
    label: 'Skip to main content'
})
</script>
