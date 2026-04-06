<template>
    <span
        role="note"
        :class="badgeCss"
    >
        <slot />
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    color?: string
    size?: 'sm' | 'md' | 'lg'
    type?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
    color: 'blue',
    size: 'lg',
    type: 'primary'
})

const sizeClasses: Record<string, string> = {
    sm: 'min-h-6 gap-x-1 px-2 text-sm',
    md: 'min-h-7 gap-x-1.5 px-2.5 text-base',
    lg: 'min-h-8 gap-x-1.5 px-3 text-lg'
}

const colorClasses: Record<string, Record<string, string>> = {
    blue: {
        primary: 'bg-blue-700 text-white ring-blue-300 dark:bg-blue-600 dark:ring-blue-400',
        secondary: 'bg-white text-blue-700 ring-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-700'
    },
    green: {
        primary: 'bg-green-700 text-white ring-green-300 dark:bg-green-600 dark:ring-green-400',
        secondary: 'bg-white text-green-700 ring-green-300 dark:bg-green-950 dark:text-green-300 dark:ring-green-700'
    },
    red: {
        primary: 'bg-red-700 text-white ring-red-300 dark:bg-red-600 dark:ring-red-400',
        secondary: 'bg-white text-red-700 ring-red-300 dark:bg-red-950 dark:text-red-300 dark:ring-red-700'
    },
    orange: {
        primary: 'bg-orange-700 text-white ring-orange-300 dark:bg-orange-600 dark:ring-orange-400',
        secondary: 'bg-white text-orange-700 ring-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:ring-orange-700'
    },
    purple: {
        primary: 'bg-purple-700 text-white ring-purple-300 dark:bg-purple-600 dark:ring-purple-400',
        secondary: 'bg-white text-purple-700 ring-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:ring-purple-700'
    },
    indigo: {
        primary: 'bg-indigo-700 text-white ring-indigo-300 dark:bg-indigo-600 dark:ring-indigo-400',
        secondary: 'bg-white text-indigo-700 ring-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-700'
    },
    teal: {
        primary: 'bg-teal-700 text-white ring-teal-300 dark:bg-teal-600 dark:ring-teal-400',
        secondary: 'bg-white text-teal-700 ring-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:ring-teal-700'
    },
    pink: {
        primary: 'bg-pink-700 text-white ring-pink-300 dark:bg-pink-600 dark:ring-pink-400',
        secondary: 'bg-white text-pink-700 ring-pink-300 dark:bg-pink-950 dark:text-pink-300 dark:ring-pink-700'
    }
}

const badgeCss = computed((): string => {
    const { color, size, type } = props
    const colorTypeCss = colorClasses[color]?.[type] ?? colorClasses.blue.primary
    return [
        'inline-flex items-center justify-center rounded-full font-medium ring-1 ring-inset',
        sizeClasses[size] ?? sizeClasses.lg,
        colorTypeCss
    ].join(' ')
})
</script>
