<template>
    <ol
        class="flex flex-col"
        :aria-label="ariaLabel"
    >
        <li
            v-for="(item, index) in items"
            :key="index"
            class="flex gap-4"
        >
            <!-- Icon column + connector -->
            <div class="flex flex-col items-center">
                <div :class="dotClass(item.color)">
                    <Icon
                        v-if="item.icon"
                        aria-hidden="true"
                        size="xs"
                        :icon="item.icon"
                    />
                </div>
                <div
                    v-if="index < items.length - 1"
                    class="w-px flex-1 min-h-6 mt-1 bg-gray-200 dark:bg-gray-700"
                />
            </div>

            <!-- Content -->
            <div :class="['min-w-0 flex-1', index < items.length - 1 ? 'pb-6' : '']">
                <div class="flex items-start justify-between gap-4">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ item.title }}
                    </p>
                    <time
                        v-if="item.time"
                        class="shrink-0 text-xs text-gray-800 dark:text-gray-200 mt-0.5"
                    >
                        {{ item.time }}
                    </time>
                </div>
                <p
                    v-if="item.description"
                    class="mt-0.5 text-sm text-gray-800 dark:text-gray-200"
                >
                    {{ item.description }}
                </p>
            </div>
        </li>
    </ol>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import type { IconProp } from '@Composables/useIcons'

type TimelineColor = 'blue' | 'green' | 'indigo' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'gray'

export interface TimelineItem {
    color?: TimelineColor
    description?: string
    icon?: IconProp
    time?: string
    title: string
}

interface Props {
    ariaLabel?: string
    items: TimelineItem[]
}

withDefaults(defineProps<Props>(), {
    ariaLabel: 'Timeline'
})

const colorMap: Record<TimelineColor, string> = {
    blue:   'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    gray:   'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
    green:  'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400',
    pink:   'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
    red:    'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
    teal:   'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400'
}

const dotBase = 'flex shrink-0 items-center justify-center rounded-full w-8 h-8'

const dotClass = computed(() => (color: TimelineColor | undefined): string =>
    `${dotBase} ${colorMap[color ?? 'gray']}`
)
</script>
