<template>
    <component
        :is="iconComponent"
        v-if="iconComponent"
        :height="iconSize.height"
        :width="iconSize.width"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { availableIcons, availableSizes } from '@Composables/useIcons'

interface Props {
    icon?: string
    size?: string
}

const props = withDefaults(defineProps<Props>(), {
    icon: '',
    size: '2xl'
})

/**
 * Check that the icon component is imported for use and return the component object.
 */
const iconComponent = computed((): Component | null => {
    const { icon } = props
    if (icon in availableIcons) return availableIcons[icon]

    console.error(`${icon} not found`)
    return null
})

/**
 * Set icon sizes based on the size prop.
 */
const iconSize = computed((): { width: number; height: number } => {
    const { size } = props
    const calcSize = availableSizes?.[size] || 24
    return {
        height: calcSize,
        width: calcSize
    }
})
</script>
