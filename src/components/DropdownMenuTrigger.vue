<template>
    <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions,vuejs-accessibility/mouse-events-have-key-events -->
    <div
        ref="wrapperRef"
        @click="handleClick"
        @keydown="handleKeydown"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import type { DropdownMenuContext } from './DropdownMenu.vue'

const context = inject<DropdownMenuContext>('dropdownMenu')!
const wrapperRef = ref<HTMLElement | null>(null)

const MANAGED_ARIA = ['aria-controls', 'aria-expanded', 'aria-haspopup'] as const

const getFocusable = (): HTMLElement | null =>
    wrapperRef.value?.querySelector<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
    ) ?? null

watchEffect(() => {
    const isOpen = context.isOpen.value
    const child = getFocusable()
    if (!child) return
    MANAGED_ARIA.forEach((attr) => child.removeAttribute(attr))
    child.setAttribute('aria-haspopup', 'menu')
    child.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
    if (isOpen) {
        child.setAttribute('aria-controls', context.contentId)
    }
})

const handleClick = () => {
    if (context.isOpen.value) {
        context.close()
    } else {
        context.open('first')
    }
}

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (!context.isOpen.value) context.open('first')
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (!context.isOpen.value) context.open('last')
    }
}

onMounted(() => {
    context.setTriggerRef(wrapperRef.value)
})

onBeforeUnmount(() => {
    const child = getFocusable()
    if (child) MANAGED_ARIA.forEach((attr) => child.removeAttribute(attr))
    context.setTriggerRef(null)
})
</script>
