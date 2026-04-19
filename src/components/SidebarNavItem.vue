<template>
    <component
        :is="href ? 'a' : 'button'"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        :aria-current="active ? 'page' : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        :class="itemClass"
        :disabled="!href && disabled ? true : undefined"
        :href="href ?? undefined"
        @click="disabled ? $event.preventDefault() : undefined"
    >
        <Icon
            v-if="icon"
            aria-hidden="true"
            size="sm"
            :icon="icon"
        />

        <span class="flex-1 text-start">
            <slot />
        </span>

        <span
            v-if="badge !== undefined"
            aria-hidden="true"
            class="ml-auto inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium"
            :class="active
                ? 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'"
        >
            {{ badge }}
        </span>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@Components/Icon.vue'
import type { IconProp } from '@Composables/useIcons'

interface Props {
    active?: boolean
    badge?: number | string
    disabled?: boolean
    href?: string
    icon?: IconProp
}

const props = withDefaults(defineProps<Props>(), {
    active: false,
    badge: undefined,
    disabled: false,
    href: undefined,
    icon: undefined
})

const itemClass = computed(() => {
    if (props.disabled) {
        return 'cursor-not-allowed opacity-50 text-gray-500 dark:text-gray-400'
    }
    if (props.active) {
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
    }
    return 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
})
</script>
