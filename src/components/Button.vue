<template>
    <component
        :is="element"
        :class="componentStyle"
        :href="href"
    >
        <slot name="default" />
    </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    disabled: {
        default: false,
        type: Boolean
    },

    href: {
        default: null,
        type: String
    },

    size: {
        default: 'base',
        type: String,
        validator: (value) => {
            return ['small', 'base', 'large'].includes(value)
        }
    },

    type: {
        type: String,
        default: 'primary',
        validator: (value) => {
            return [
                'primary',
                'secondary',
                'tertiary',
                'text',
                'none'
            ].includes(value)
        }
    }
})

const styles = {
    padding: {
        small: 'py-1 px-2',
        base: 'py-2 px-3',
        large: 'py-3 px-4'
    },
    common: 'inline-flex items-center justify-center border rounded-lg transition-colors cursor-pointer',
    primary: {
        base: 'text-white bg-blue-600 border-blue-400 hover:bg-blue-700',
        disabled: 'text-white bg-gray-400 border-gray-400 pointer-events-none'
    },
    secondary: {
        base: 'text-black bg-white border-gray-200 hover:bg-gray-200',
        disabled: 'text-black bg-gray-100 border-gray-100 pointer-events-none'
    },
    tertiary: {
        base: 'text-black bg-transparent border-transparent hover:bg-gray-200',
        disabled:
            'text-gray-900 bg-transparent border-transparent pointer-events-none'
    },
    text: {
        base: 'text-blue-600 bg-transparent border-transparent hover:text-blue-700 hover:underline',
        disabled:
            'text-blue-900 bg-transparent border-transparent pointer-events-none'
    },
    none: {
        base: 'text-black bg-transparent border-transparent',
        disabled:
            'text-gray-900 bg-transparent border-transparent pointer-events-none'
    }
}

const componentStyle = computed(() => {
    const { disabled, size, type } = props

    return `${styles?.common} ${styles?.padding?.[size]} ${styles?.[type]?.[disabled ? 'disabled' : 'base']}`
})

const element = computed(() => {
    const { href } = props
    return href ? 'a' : 'button'
})
</script>
