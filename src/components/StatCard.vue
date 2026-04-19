<template>
    <div :class="containerClass">
        <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {{ label }}
                </p>
                <p class="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white truncate">
                    {{ value }}
                </p>
            </div>

            <div
                v-if="icon"
                :class="iconWrapperClass"
            >
                <Icon
                    aria-hidden="true"
                    size="lg"
                    :icon="icon"
                />
            </div>
        </div>

        <div
            v-if="trend !== undefined || description"
            class="mt-3 flex items-center gap-2"
        >
            <span
                v-if="trend !== undefined"
                aria-label="Trend"
                :class="trendClass"
            >
                <Icon
                    aria-hidden="true"
                    size="xs"
                    :icon="trend >= 0 ? 'ArrowUp' : 'ArrowDown'"
                />
                {{ Math.abs(trend) }}%
            </span>
            <p
                v-if="description"
                class="text-sm text-gray-500 dark:text-gray-400 truncate"
            >
                {{ description }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import type { IconProp } from '@Composables/useIcons'

type StatCardColor = 'blue' | 'green' | 'indigo' | 'orange' | 'pink' | 'purple' | 'red' | 'teal'

interface Props {
    color?: StatCardColor
    description?: string
    icon?: IconProp
    label: string
    trend?: number
    value: number | string
}

const props = withDefaults(defineProps<Props>(), {
    color: 'blue',
    description: undefined,
    icon: undefined,
    trend: undefined
})

const colorMap: Record<StatCardColor, { icon: string; text: string }> = {
    blue:   { icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400', text: '' },
    green:  { icon: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400', text: '' },
    indigo: { icon: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400', text: '' },
    orange: { icon: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400', text: '' },
    pink:   { icon: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400', text: '' },
    purple: { icon: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400', text: '' },
    red:    { icon: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400', text: '' },
    teal:   { icon: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400', text: '' }
}

const containerClass = 'rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900'

const iconWrapperClass = computed(() =>
    `flex shrink-0 items-center justify-center rounded-lg w-12 h-12 ${colorMap[props.color].icon}`
)

const trendClass = computed(() => {
    const positive = props.trend !== undefined && props.trend >= 0
    return [
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        positive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
    ].join(' ')
})
</script>
