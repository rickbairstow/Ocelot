<template>
    <div
        role="tablist"
        :aria-label="props.label"
        :class="listClass"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import type { TabsContext } from './Tabs.vue'

interface Props {
    label?: string
}

const props = withDefaults(defineProps<Props>(), {
    label: undefined
})

const ctx = inject<TabsContext>('tabs')

const listClass = computed((): string => {
    const variant = ctx?.variant ?? 'line'

    if (variant === 'pill') {
        return 'flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg'
    }
    if (variant === 'contained') {
        return 'flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'
    }
    return 'flex border-b border-gray-200 dark:border-gray-700'
})
</script>
