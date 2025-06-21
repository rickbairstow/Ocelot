<template>
    <div
        class="inline-flex justify-center items-center gap-1 rounded-full px-2 font-medium break-all"
        role="note"
        :class="badgeCss"
    >
        <slot />
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    size: {
        type: String,
        default: 'lg',
        validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },

    type: {
        type: String,
        default: 'default',
        validator: (value) =>
            ['default', 'error', 'info', 'success', 'warning'].includes(value)
    }
})

/**
 * Available badge types and their related CSS.
 */
const classLookup = {
    size: {
        sm: 'min-h-4 text-xs',
        md: 'min-h-5 text-xs',
        lg: 'min-h-6 text-sm'
    },
    style: {
        default: 'bg-gray-300 text-black',
        error: 'bg-red-400 text-black',
        info: 'bg-blue-300 text-black',
        success: 'bg-green-500 text-black',
        warning: 'bg-orange-400 text-black'
    }
}

/**
 * Calculate CSS styles CSS based on size and type.
 * @returns {string}
 */
const badgeCss = computed(() => {
    const { size, type } = props
    const sizeCss = classLookup.size?.[size] ?? classLookup.size.lg
    const typeCss = classLookup.style?.[type] ?? classLookup.style?.default

    return `${sizeCss} ${typeCss}`
})
</script>
