<template>
    <component
        :is="headingElement"
        :class="headingClass"
    >
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    level?: number | string
    styleLevel?: number | string | null
}

const props = withDefaults(defineProps<Props>(), {
    level: 1,
    styleLevel: null
})

const headingLookup: Record<string, string> = {
    base: 'text-black ',
    1: 'text-4xl font-medium leading-10', // 36px
    2: 'text-3xl font-medium leading-9', // 30px
    3: 'text-2xl font-medium leading-7', // 24px
    4: 'text-xl font-medium leading-6', // 20px
    5: 'text-xl leading-6', // 20px
    6: 'text-lg leading-6' // 18px
}

/**
 * Set which element should render, ie h1-h6.
 */
const headingElement = computed((): string => {
    const { level } = props
    return `h${level}`
})

/**
 * Calculate heading classes from the lookup.
 */
const headingClass = computed((): string => {
    const { level, styleLevel } = props
    const selectedLevel = styleLevel ?? level

    return `${headingLookup.base} ${headingLookup?.[String(selectedLevel)]}`
})
</script>
