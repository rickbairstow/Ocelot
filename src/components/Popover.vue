<template>
    <FloatingPanel
        ref="panel"
        :disabled="disabled"
        :flush="flush"
        :interaction="'click'"
        :max-width="maxWidth"
        :placement="placement"
    >
        <template #trigger>
            <slot name="trigger" />
        </template>

        <template #content>
            <slot name="content" />
        </template>
    </FloatingPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Placement } from '@floating-ui/dom'
import FloatingPanel from './FloatingPanel.vue'

interface Props {
    disabled?: boolean
    flush?: boolean
    maxWidth?: number | string
    placement?: Placement
}

withDefaults(defineProps<Props>(), {
    disabled: false,
    flush: false,
    maxWidth: '320px',
    placement: 'bottom'
})

const panel = ref<InstanceType<typeof FloatingPanel> | null>(null)

defineExpose({
    close: () => panel.value?.close(),
    isOpen: () => panel.value?.isOpen,
    open: () => panel.value?.open()
})
</script>
