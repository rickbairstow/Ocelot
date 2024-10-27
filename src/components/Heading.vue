<template>
    <component
        :is="headingElement"
        :class="headingClass"
    >
        <slot />
    </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    level: {
        default: 1,
        type: [Number, String],
        validator(value) {
            const level = parseInt(value)
            return level >= 1 && level <= 6
        }
    },

    styleLevel: {
        default: null,
        type: [Number, String],
        validator(value) {
            const level = parseInt(value)
            return level >= 1 && level <= 6
        }
    }
})

const headingLookup = {
    base: 'text-black ',
    1: 'text-4xl font-medium leading-10', // 36px
    2: 'text-3xl font-medium leading-9', // 30px
    3: 'text-2xl font-medium leading-7', // 24px
    4: 'text-xl font-medium leading-6', // 20px
    5: 'text-xl leading-6', // 20px
    6: 'text-lg leading-6' // 18px
}

/**
 * Set which element shoudl render, ie h1-h6.
 * @type {ComputedRef<string>}
 */
const headingElement = computed(() => {
    const { level } = props
    return `h${level}`
})

/**
 * Calculate heading classes from the lookup.
 * @type {ComputedRef<string>}
 */
const headingClass = computed(() => {
    const { level, styleLevel } = props
    const selectedLevel = styleLevel ?? level

    return `${headingLookup.base} ${headingLookup?.[selectedLevel]}`
})
</script>
