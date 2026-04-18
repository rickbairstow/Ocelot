<template>
    <component
        :is="iconComponent"
        v-if="iconComponent"
        aria-hidden="true"
        :height="iconSize"
        :width="iconSize"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import type { IconProp, IconSize } from '@Composables/useIcons'
import { availableIcons, availableSizes } from '@Composables/useIcons'

interface Props {
    icon?: IconProp
    size?: IconSize
}

const props = withDefaults(defineProps<Props>(), {
    size: '2xl'
})

const iconComponent = computed((): Component | null => {
    const { icon } = props
    if (!icon) return null
    if (typeof icon !== 'string') return icon
    if (icon in availableIcons) return availableIcons[icon]
    if (import.meta.env.DEV) {
        console.warn(`[OuiIcon] Icon "${icon}" not found in registry. Register it with registerIcons() or pass the component directly.`)
    }
    return null
})

const iconSize = computed((): number => availableSizes[props.size ?? '2xl'] ?? 24)
</script>
