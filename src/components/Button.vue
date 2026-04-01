<template>
    <component
        :is="element"
        :aria-disabled="disabled ? 'true' : undefined"
        :class="componentStyle"
        :href="href"
        :role="href ? 'link' : 'button'"
        @click="handleInteraction"
        @keydown.enter.prevent="handleInteraction"
        @keydown.space.prevent="handleInteraction"
    >
        <slot name="default" />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    disabled?: boolean
    href?: string | null
    size?: 'small' | 'base' | 'large'
    type?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    href: null,
    size: 'base',
    type: 'primary'
})

/**
 * Handles both click and keyboard activation (Enter/Space).
 * Prevents action if aria-disabled.
 */
const handleInteraction = (e: MouseEvent | KeyboardEvent) => {
    if (props.disabled) {
        e.preventDefault()
        ;(e as MouseEvent).stopImmediatePropagation?.()
        e.stopPropagation()
    }
}

const element = computed((): string => (props.href ? 'a' : 'button'))

const styles = {
    padding: {
        small: 'py-1 px-2',
        base: 'py-2 px-3',
        large: 'py-3 px-4'
    },
    common: 'inline-flex items-center justify-center border rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
    primary: {
        base: 'text-white bg-blue-600 border-blue-400 hover:bg-blue-700',
        disabled: 'text-white bg-gray-400 border-gray-400 opacity-50'
    },
    secondary: {
        base: 'text-black bg-white border-gray-200 hover:bg-gray-200',
        disabled: 'text-black bg-gray-100 border-gray-100 opacity-50'
    },
    tertiary: {
        base: 'text-black bg-transparent border-transparent hover:bg-gray-200',
        disabled: 'text-gray-900 bg-transparent border-transparent opacity-50'
    },
    text: {
        base: 'text-blue-600 bg-transparent border-transparent hover:text-blue-700 hover:underline',
        disabled: 'text-blue-900 bg-transparent border-transparent opacity-50'
    },
    none: {
        base: 'text-black bg-transparent border-transparent',
        disabled: 'text-gray-900 bg-transparent border-transparent opacity-50'
    }
}

/**
 * Computed button classes based on props.
 */
const componentStyle = computed((): string => {
    const { size, type, disabled } = props
    const interactive = disabled ? 'cursor-not-allowed' : 'cursor-pointer'
    const visual = styles[type]?.[disabled ? 'disabled' : 'base'] || ''
    return `${styles.common} ${styles.padding[size]} ${visual} ${interactive}`
})
</script>
