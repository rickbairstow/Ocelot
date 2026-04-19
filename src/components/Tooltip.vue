<template>
    <FloatingPanel
        :disabled="disabled"
        :interaction="'hover'"
        :max-width="maxWidth"
        :placement="placement"
        :role="'tooltip'"
        :show-delay="delay"
    >
        <template #trigger>
            <slot />
        </template>

        <template #content>
            {{ content }}
        </template>
    </FloatingPanel>
</template>

<script setup lang="ts">
import type { Placement } from '@floating-ui/dom'
import FloatingPanel from './FloatingPanel.vue'

interface Props {
    content: string
    delay?: number
    disabled?: boolean
    maxWidth?: number | string
    placement?: Placement
}

withDefaults(defineProps<Props>(), {
    delay: 500,
    disabled: false,
    maxWidth: '200px',
    placement: 'top'
})
</script>
