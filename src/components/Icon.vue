<template>
    <component
        :is="iconName"
        v-if="iconName"
        :height="iconSize.height"
        :width="iconSize.width"
    />
</template>

<script setup>
import { computed } from 'vue'
import { availableIcons, availableSizes } from '@Composables/useIcons'

const props = defineProps({
    icon: {
        default: '',
        type: String
    },
    size: {
        default: '2xl',
        type: String,
        validator: (value) => {
            // Check that values match the available font sizes
            return [...Object.keys(availableSizes)].includes(value)
        }
    }
})

/**
 * Check that the icon component is imported for use.
 * @type {ComputedRef<String|string>}
 */
const iconName = computed(() => {
    const { icon } = props
    if (icon in availableIcons) return icon

    console.error(`${icon} not found`)
    return ''
})

/**
 * Set icon sizes based on the size prop.
 * @type {ComputedRef<{width: *|number, height: *|number}>}
 */
const iconSize = computed(() => {
    const { size } = props
    const calcSize = availableSizes?.[size] || 24
    return {
        height: calcSize,
        width: calcSize
    }
})
</script>

<script>
// Dynamic imports - this requires Options API.
import { availableIcons as components } from '@Composables/useIcons'

export default {
    components
}
</script>
