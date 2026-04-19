<template>
    <div class="flex flex-col items-center justify-center text-center px-6 py-12">
        <div
            v-if="icon"
            class="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4"
        >
            <Icon
                aria-hidden="true"
                class="text-gray-400 dark:text-gray-500"
                size="2xl"
                :icon="icon"
            />
        </div>

        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
            {{ title }}
        </h3>

        <p
            v-if="description"
            class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm"
        >
            {{ description }}
        </p>

        <div
            v-if="$slots.action"
            class="mt-6"
        >
            <slot name="action" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'
import type { IconProp } from '@Composables/useIcons'

interface Props {
    description?: string
    icon?: IconProp
    title: string
}

withDefaults(defineProps<Props>(), {
    description: undefined,
    icon: undefined
})
</script>
