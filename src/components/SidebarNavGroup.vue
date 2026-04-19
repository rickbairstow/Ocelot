<template>
    <div class="flex flex-col gap-1">
        <button
            v-if="collapsible && label"
            class="flex w-full items-center justify-between px-2 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            :aria-expanded="isExpanded"
            @click="isExpanded = !isExpanded"
        >
            {{ label }}
            <Icon
                aria-hidden="true"
                size="xs"
                :icon="isExpanded ? 'ChevronUp' : 'ChevronDown'"
            />
        </button>

        <p
            v-else-if="label"
            class="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
            {{ label }}
        </p>

        <div v-if="!collapsible || isExpanded">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icon from '@Components/Icon.vue'

interface Props {
    collapsible?: boolean
    label?: string
    startCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    collapsible: false,
    label: undefined,
    startCollapsed: false
})

const isExpanded = ref(!props.startCollapsed)
</script>
