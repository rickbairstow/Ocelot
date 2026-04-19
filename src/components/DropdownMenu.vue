<template>
    <slot />
</template>

<script setup lang="ts">
import { nextTick, provide, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { generateUuid } from '@Utils/uuid'

export interface DropdownMenuContext {
    close: () => void
    contentId: string
    isOpen: Ref<boolean>
    open: (focusTarget?: 'first' | 'last') => void
    openFocusTarget: Ref<'first' | 'last'>
    setTriggerRef: (el: HTMLElement | null) => void
    triggerRef: Ref<HTMLElement | null>
}

const contentId = generateUuid('dropdown-menu')
const isOpen = ref(false)
const openFocusTarget = ref<'first' | 'last'>('first')
const triggerRef = ref<HTMLElement | null>(null)

const open = (focusTarget: 'first' | 'last' = 'first') => {
    openFocusTarget.value = focusTarget
    isOpen.value = true
}

const close = () => {
    isOpen.value = false
}

const setTriggerRef = (el: HTMLElement | null) => {
    triggerRef.value = el
}

watch(isOpen, (val) => {
    if (!val) {
        nextTick(() => {
            const trigger = triggerRef.value
            const focusable = trigger?.querySelector<HTMLElement>(
                'button, [href], input, [tabindex]:not([tabindex="-1"])'
            ) ?? trigger
            focusable?.focus()
        })
    }
})

provide<DropdownMenuContext>('dropdownMenu', {
    close,
    contentId,
    isOpen,
    open,
    openFocusTarget,
    setTriggerRef,
    triggerRef
})
</script>
