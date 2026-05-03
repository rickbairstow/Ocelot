<template>
    <!-- Dot variant — status indicator circle, no label -->
    <span
        v-if="dot"
        role="status"
        :aria-label="ariaLabel"
        :class="dotCss"
    />

    <!-- Label badge -->
    <span
        v-else
        :class="badgeCss"
    >
        <span :class="truncate ? 'truncate' : 'contents'">
            <slot />
        </span>

        <button
            v-if="removable"
            class="shrink-0 -me-0.5 ms-0.5 inline-flex items-center justify-center rounded-full opacity-60 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
            type="button"
            :aria-label="`Remove ${label ?? 'badge'}`"
            @click="emit('remove')"
        >
            <svg
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 8 8"
                :height="removeIconSize"
                :width="removeIconSize"
            >
                <path
                    d="M1 1l6 6M7 1l-6 6"
                    stroke-linecap="round"
                />
            </svg>
        </button>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    ariaLabel?: string
    color?: string
    dot?: boolean
    label?: string
    removable?: boolean
    size?: 'sm' | 'md' | 'lg'
    truncate?: boolean
    variant?: 'primary' | 'secondary' | 'outline'
}

const props = withDefaults(defineProps<Props>(), {
    ariaLabel: undefined,
    color: 'blue',
    dot: false,
    label: undefined,
    removable: false,
    size: 'lg',
    truncate: false,
    variant: 'primary'
})

const emit = defineEmits<{ remove: [] }>()

// Dot sizes: sm=6px, md=8px, lg=10px
const dotSizeMap: Record<string, string> = {
    sm: 'size-1.5',
    md: 'size-2',
    lg: 'size-2.5'
}

// Remove button icon size scales with badge size
const removeIconSizeMap: Record<string, number> = { sm: 6, md: 7, lg: 8 }
const removeIconSize = computed(() => removeIconSizeMap[props.size] ?? 8)

const sizeClasses: Record<string, string> = {
    sm: 'min-h-6 gap-x-1 px-2 text-sm',
    md: 'min-h-7 gap-x-1.5 px-2.5 text-base',
    lg: 'min-h-8 gap-x-1.5 px-3 text-lg'
}

const colorClasses: Record<string, Record<string, string>> = {
    blue: {
        primary: 'bg-blue-700 text-white ring-blue-300 dark:bg-blue-600 dark:ring-blue-400',
        secondary: 'bg-white text-blue-700 ring-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-700',
        outline: 'bg-transparent text-blue-700 ring-blue-400 dark:text-blue-400 dark:ring-blue-500'
    },
    green: {
        primary: 'bg-green-700 text-white ring-green-300 dark:bg-green-600 dark:ring-green-400',
        secondary: 'bg-white text-green-700 ring-green-300 dark:bg-green-950 dark:text-green-300 dark:ring-green-700',
        outline: 'bg-transparent text-green-700 ring-green-400 dark:text-green-400 dark:ring-green-500'
    },
    red: {
        primary: 'bg-red-700 text-white ring-red-300 dark:bg-red-600 dark:ring-red-400',
        secondary: 'bg-white text-red-700 ring-red-300 dark:bg-red-950 dark:text-red-300 dark:ring-red-700',
        outline: 'bg-transparent text-red-700 ring-red-400 dark:text-red-400 dark:ring-red-500'
    },
    orange: {
        primary: 'bg-orange-700 text-white ring-orange-300 dark:bg-orange-600 dark:ring-orange-400',
        secondary: 'bg-white text-orange-700 ring-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:ring-orange-700',
        outline: 'bg-transparent text-orange-700 ring-orange-400 dark:text-orange-400 dark:ring-orange-500'
    },
    purple: {
        primary: 'bg-purple-700 text-white ring-purple-300 dark:bg-purple-600 dark:ring-purple-400',
        secondary: 'bg-white text-purple-700 ring-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:ring-purple-700',
        outline: 'bg-transparent text-purple-700 ring-purple-400 dark:text-purple-400 dark:ring-purple-500'
    },
    indigo: {
        primary: 'bg-indigo-700 text-white ring-indigo-300 dark:bg-indigo-600 dark:ring-indigo-400',
        secondary: 'bg-white text-indigo-700 ring-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:ring-indigo-700',
        outline: 'bg-transparent text-indigo-700 ring-indigo-400 dark:text-indigo-400 dark:ring-indigo-500'
    },
    teal: {
        primary: 'bg-teal-700 text-white ring-teal-300 dark:bg-teal-600 dark:ring-teal-400',
        secondary: 'bg-white text-teal-700 ring-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:ring-teal-700',
        outline: 'bg-transparent text-teal-700 ring-teal-400 dark:text-teal-400 dark:ring-teal-500'
    },
    pink: {
        primary: 'bg-pink-700 text-white ring-pink-300 dark:bg-pink-600 dark:ring-pink-400',
        secondary: 'bg-white text-pink-700 ring-pink-300 dark:bg-pink-950 dark:text-pink-300 dark:ring-pink-700',
        outline: 'bg-transparent text-pink-700 ring-pink-400 dark:text-pink-400 dark:ring-pink-500'
    },
    gray: {
        primary: 'bg-gray-700 text-white ring-gray-300 dark:bg-gray-600 dark:ring-gray-400',
        secondary: 'bg-white text-gray-700 ring-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600',
        outline: 'bg-transparent text-gray-700 ring-gray-400 dark:text-gray-400 dark:ring-gray-500'
    }
}

const dotColorMap: Record<string, string> = {
    blue:   'bg-blue-500',
    green:  'bg-green-500',
    red:    'bg-red-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    teal:   'bg-teal-500',
    pink:   'bg-pink-500',
    gray:   'bg-gray-400'
}

const dotCss = computed((): string => {
    const colorCss = dotColorMap[props.color] ?? dotColorMap.gray
    return `inline-block rounded-full ${dotSizeMap[props.size] ?? dotSizeMap.md} ${colorCss}`
})

const badgeCss = computed((): string => {
    const { color, size, variant } = props
    const colorTypeCss = colorClasses[color]?.[variant] ?? colorClasses.blue.primary
    return [
        'inline-flex items-center justify-center rounded-full font-medium ring-1 ring-inset',
        props.truncate ? 'max-w-xs overflow-hidden' : '',
        sizeClasses[size] ?? sizeClasses.lg,
        colorTypeCss
    ].filter(Boolean).join(' ')
})
</script>
